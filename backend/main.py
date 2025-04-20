from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import json
import re
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
import io
import matplotlib.pyplot as plt
import base64
import logging
from urllib.parse import urlparse
from typing import List
import os

# Configure logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get allowed origin from environment variable
# Use a default like your Vercel preview URL or localhost for development if needed
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000") # Default to localhost:3000 if not set

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL], # Use the variable here
    allow_credentials=True,
    allow_methods=["*"], # Allow POST
    allow_headers=["*"],
)

def validate_regex(pattern: str) -> bool:
    try:
        re.compile(pattern)
        return True
    except re.error:
        return False

def normalize_site_url(url: str) -> str:
    """
    Normalize the site URL to the format expected by the Search Console API.
    """
    # If already in sc-domain format, return as is
    if url.startswith('sc-domain:'):
        return url
        
    url = url.lower().strip()
    
    # Add protocol if not present
    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"
        
    # Ensure trailing slash
    if not url.endswith('/'):
        url = f"{url}/"
        
    return url

def validate_dates(start_date: str, end_date: str):
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        today = datetime.now()
        
        if end > today - timedelta(days=1):
            raise HTTPException(status_code=400, detail="End date cannot be later than yesterday")
        if start < end - timedelta(days=16*30):
            raise HTTPException(status_code=400, detail="Date range cannot exceed 16 months")
        if start > end:
            raise HTTPException(status_code=400, detail="Start date must be before end date")
            
        return start, end
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

def get_base_domain(url: str) -> str:
    """
    Get the base domain from a URL, handling various formats.
    Returns the domain without any prefix or protocol.
    """
    # Remove protocol if present
    url = url.lower().strip()
    if '://' in url:
        url = url.split('://', 1)[1]
    
    # Remove path, query parameters, etc.
    url = url.split('/')[0]
    
    # Remove www. if present
    if url.startswith('www.'):
        url = url[4:]
        
    # Remove sc-domain: if present
    if url.startswith('sc-domain:'):
        url = url[10:]
        
    return url

def get_all_possible_site_formats(domain: str) -> list:
    """
    Generate all possible formats for a given domain.
    """
    domain = get_base_domain(domain)  # Clean the domain first
    return [
        f"sc-domain:{domain}",
        f"https://www.{domain}/",
        f"https://{domain}/",
        f"http://www.{domain}/",
        f"http://{domain}/"
    ]

@app.post("/analyze")
async def analyze_data(
    file: UploadFile = File(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    exclude_regex: str = Form(...),
    site_url: str = Form(...)
):
    try:
        logger.info(f"Starting analysis for site: {site_url}")
        logger.info(f"Date range: {start_date} to {end_date}")
        logger.info(f"Exclude regex: {exclude_regex}")

        # Validate regex pattern
        if exclude_regex and not validate_regex(exclude_regex):
            logger.error(f"Invalid regex pattern: {exclude_regex}")
            raise HTTPException(status_code=400, detail="Invalid regex pattern provided")

        # Read and validate JSON key file
        try:
            content = await file.read()
            logger.info(f"JSON key file name: {file.filename}")
            json_key = json.loads(content)
            logger.info("Successfully parsed JSON key file")
        except json.JSONDecodeError as je:
            logger.error(f"JSON decode error: {str(je)}")
            raise HTTPException(status_code=400, detail=f"Invalid JSON key file: {str(je)}")
        except Exception as e:
            logger.error(f"Error reading file: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

        # Initialize credentials and service
        try:
            credentials = service_account.Credentials.from_service_account_info(
                json_key,
                scopes=['https://www.googleapis.com/auth/webmasters.readonly']
            )
            logger.info("Successfully created credentials")
            
            # Verify site access before proceeding
            webmasters_service = build('searchconsole', 'v1', credentials=credentials)
            sites = webmasters_service.sites().list().execute()
            
            # Log all available sites
            available_sites = [site['siteUrl'] for site in sites.get('siteEntry', [])]
            logger.info(f"Available sites: {available_sites}")
            
            # Clean up input domain
            input_domain = get_base_domain(site_url)
            logger.info(f"Cleaned input domain: {input_domain}")
            
            site_found = False
            matched_site_url = None
            
            # Try to find any site that matches our domain
            for site in sites.get('siteEntry', []):
                current_site_url = site['siteUrl']
                current_domain = get_base_domain(current_site_url)
                
                logger.info(f"Checking site URL: {current_site_url}")
                logger.info(f"Cleaned site domain: {current_domain}")
                logger.info(f"Comparing with input domain: {input_domain}")
                
                if current_domain == input_domain:
                    site_found = True
                    matched_site_url = current_site_url
                    logger.info(f"Found matching domain! Using site URL: {matched_site_url}")
                    
                    if site.get('permissionLevel') in ['siteOwner', 'siteFullUser', 'siteRestrictedUser']:
                        logger.info(f"Access verified with permission level: {site.get('permissionLevel')}")
                        break
                    else:
                        logger.error(f"Insufficient permission level: {site.get('permissionLevel')}")
                        raise HTTPException(status_code=403, detail="Insufficient permissions to access site data")
            
            if not site_found:
                error_msg = f"No matching domain found. You entered: {site_url} (cleaned to: {input_domain}). Available sites: {available_sites}"
                logger.error(error_msg)
                raise HTTPException(status_code=404, detail=error_msg)
            
            # Use the matched site URL for subsequent requests
            normalized_site_url = matched_site_url
            logger.info(f"Final site URL being used: {normalized_site_url}")
            
        except Exception as e:
            logger.error(f"Credentials or site access error: {str(e)}")
            raise HTTPException(status_code=403, detail=f"Error accessing Search Console: {str(e)}")

        # Get total clicks for the period first
        total_request = {
            'startDate': start_date,
            'endDate': end_date,
            'dimensions': []  # No dimensions means we get totals
        }
        
        try:
            logger.info("Querying total clicks...")
            total_response = webmasters_service.searchanalytics().query(
                siteUrl=normalized_site_url,
                body=total_request
            ).execute()
            logger.info(f"Total response: {total_response}")
        except Exception as e:
            logger.error(f"Search Console API error (totals): {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error querying Search Console API: {str(e)}")
        
        if 'rows' not in total_response or not total_response['rows']:
            logger.error("No data returned from Search Console API")
            raise HTTPException(status_code=404, detail="No data found for the specified period")
            
        total_gsc_clicks = total_response['rows'][0]['clicks']
        logger.info(f"Total GSC clicks: {total_gsc_clicks}")
        
        # Initialize variables for pagination
        start_row = 0
        row_limit = 25000
        all_rows = []
        
        while True:
            # Prepare request body with pagination
            request = {
                'startDate': start_date,
                'endDate': end_date,
                'dimensions': ['query'],
                'rowLimit': row_limit,
                'startRow': start_row
            }
            
            # Execute API request
            try:
                logger.info(f"Fetching data batch starting at row {start_row}")
                response = webmasters_service.searchanalytics().query(
                    siteUrl=normalized_site_url,
                    body=request
                ).execute()
                
                if 'rows' in response and response['rows']:
                    logger.info(f"Received {len(response['rows'])} rows")
                    all_rows.extend(response['rows'])
                else:
                    logger.info("No more rows to fetch")
                    break
                    
                if len(response['rows']) < row_limit:
                    logger.info("Reached last batch of data")
                    break
                    
                start_row += row_limit
                
            except Exception as e:
                logger.error(f"Search Console API error (query data): {str(e)}")
                raise HTTPException(status_code=400, detail=f"Error querying Search Console API: {str(e)}")
        
        logger.info(f"Total rows fetched: {len(all_rows)}")
        
        # Initialize counters
        total_clicks = 0
        total_impressions = 0
        brand_clicks = 0
        brand_impressions = 0
        brand_position_sum = 0
        non_brand_clicks = 0
        non_brand_impressions = 0
        non_brand_position_sum = 0
        brand_queries = []
        non_brand_queries = []
        
        # Process all results
        for row in all_rows:
            query = row['keys'][0].lower()
            clicks = row.get('clicks', 0)
            impressions = row.get('impressions', 0)
            position = row.get('position', 0)
            
            total_clicks += clicks
            total_impressions += impressions
            
            # Use empty string if exclude_regex is empty to avoid regex errors
            pattern = exclude_regex.lower() if exclude_regex else ''
            if pattern:
                # Split the pattern by | and create a list of words to check
                brand_keywords = [kw.strip() for kw in pattern.split('|')]
                # Check if any of the keywords is present in the query
                if any(kw in query.split() for kw in brand_keywords):
                    brand_clicks += clicks
                    brand_impressions += impressions
                    brand_position_sum += position * impressions
                    brand_queries.append({
                        'query': query,
                        'clicks': clicks,
                        'impressions': impressions,
                        'position': position,
                        'ctr': row.get('ctr', 0) * 100
                    })
                else:
                    non_brand_clicks += clicks
                    non_brand_impressions += impressions
                    non_brand_position_sum += position * impressions
                    non_brand_queries.append({
                        'query': query,
                        'clicks': clicks,
                        'impressions': impressions,
                        'position': position,
                        'ctr': row.get('ctr', 0) * 100
                    })
        
        # Calculate metrics
        total_all_clicks = brand_clicks + non_brand_clicks
        unattributed_clicks = max(0, total_gsc_clicks - total_all_clicks)
        
        total_with_unattributed = total_all_clicks + unattributed_clicks
        brand_percentage = (brand_clicks / total_with_unattributed * 100) if total_with_unattributed > 0 else 0
        non_brand_percentage = (non_brand_clicks / total_with_unattributed * 100) if total_with_unattributed > 0 else 0
        unattributed_percentage = (unattributed_clicks / total_with_unattributed * 100) if total_with_unattributed > 0 else 0
        
        brand_avg_position = (brand_position_sum / brand_impressions) if brand_impressions > 0 else 0
        non_brand_avg_position = (non_brand_position_sum / non_brand_impressions) if non_brand_impressions > 0 else 0
        
        brand_ctr = (brand_clicks / brand_impressions * 100) if brand_impressions > 0 else 0
        non_brand_ctr = (non_brand_clicks / non_brand_impressions * 100) if non_brand_impressions > 0 else 0
        
        # Sort queries by clicks for the top 10 lists
        brand_queries.sort(key=lambda x: x['clicks'], reverse=True)
        non_brand_queries.sort(key=lambda x: x['clicks'], reverse=True)
        
        # Prepare CSV data with ALL queries
        csv_data = "SEO Performance Analysis - Complete Query Data\n"
        csv_data += f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        csv_data += f"Website: {site_url}\n"
        csv_data += f"Period: {start_date} to {end_date}\n\n"
        
        # Add summary metrics
        csv_data += "Overall Metrics\n"
        csv_data += f"Total Clicks (including unattributed),{total_with_unattributed}\n"
        csv_data += f"Unattributed Clicks,{unattributed_clicks}\n"
        csv_data += f"Total Impressions,{total_impressions}\n"
        csv_data += f"Average CTR,{(total_clicks/total_impressions*100 if total_impressions > 0 else 0):.2f}%\n"
        csv_data += f"Average Position,{((brand_position_sum + non_brand_position_sum)/(brand_impressions + non_brand_impressions) if (brand_impressions + non_brand_impressions) > 0 else 0):.1f}\n\n"
        
        csv_data += "Brand vs Non-Brand Summary\n"
        csv_data += "Type,Clicks,Impressions,CTR,Average Position,Share of Voice\n"
        csv_data += f"Brand,{brand_clicks},{brand_impressions},{brand_ctr:.2f}%,{brand_avg_position:.1f},{brand_percentage:.1f}%\n"
        csv_data += f"Non-Brand,{non_brand_clicks},{non_brand_impressions},{non_brand_ctr:.2f}%,{non_brand_avg_position:.1f},{non_brand_percentage:.1f}%\n"
        csv_data += f"Unattributed,{unattributed_clicks},N/A,N/A,N/A,{unattributed_percentage:.1f}%\n\n"
        
        # Add complete query data
        csv_data += "Complete Query Analysis\n"
        csv_data += "Type,Query,Clicks,Impressions,CTR,Position,Click Share,Impression Share\n"
        
        # Add all brand queries
        for query in brand_queries:
            click_share = (query['clicks'] / total_with_unattributed * 100) if total_with_unattributed > 0 else 0
            impression_share = (query['impressions'] / total_impressions * 100) if total_impressions > 0 else 0
            csv_data += f"Brand,{query['query']},{query['clicks']},{query['impressions']},{query['ctr']:.2f}%,{query['position']:.1f},{click_share:.2f}%,{impression_share:.2f}%\n"
            
        # Add all non-brand queries
        for query in non_brand_queries:
            click_share = (query['clicks'] / total_with_unattributed * 100) if total_with_unattributed > 0 else 0
            impression_share = (query['impressions'] / total_impressions * 100) if total_impressions > 0 else 0
            csv_data += f"Non-Brand,{query['query']},{query['clicks']},{query['impressions']},{query['ctr']:.2f}%,{query['position']:.1f},{click_share:.2f}%,{impression_share:.2f}%\n"
        
        # Calculate visibility score (0-100)
        visibility_score = min(100, (
            (brand_percentage * 0.4) +  # Brand dominance
            (min(100, (1/brand_avg_position) * 50) * 0.3) +  # Brand position
            (min(100, brand_ctr) * 0.3)  # Brand CTR
        )) if brand_avg_position > 0 else 0
        
        return {
            "total_all_clicks": total_with_unattributed,
            "brand_clicks": brand_clicks,
            "non_brand_clicks": non_brand_clicks,
            "brand_percentage": brand_percentage,
            "non_brand_percentage": non_brand_percentage,
            "unattributed_clicks": unattributed_clicks,
            "unattributed_percentage": unattributed_percentage,
            "csv_data": csv_data,
            # Additional metrics for exports
            "brand_impressions": brand_impressions,
            "non_brand_impressions": non_brand_impressions,
            "brand_ctr": brand_ctr,
            "non_brand_ctr": non_brand_ctr,
            "brand_avg_position": brand_avg_position,
            "non_brand_avg_position": non_brand_avg_position,
            "visibility_score": visibility_score,
            "top_brand_queries": brand_queries[:10],  # Top 10 pour le dashboard
            "top_non_brand_queries": non_brand_queries[:10],  # Top 10 pour le dashboard
            "all_brand_queries": brand_queries,  # Toutes les requêtes pour l'export CSV
            "all_non_brand_queries": non_brand_queries,  # Toutes les requêtes pour l'export CSV
            "total_impressions": total_impressions
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error in analyze_data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.post("/compare")
async def compare_periods(
    file: UploadFile = File(...),
    current_start_date: str = Form(...),
    current_end_date: str = Form(...),
    previous_start_date: str = Form(...),
    previous_end_date: str = Form(...),
    exclude_regex: str = Form(...),
    site_url: str = Form(...)
):
    try:
        # Validate dates
        validate_dates(current_start_date, current_end_date)
        validate_dates(previous_start_date, previous_end_date)
        
        # Read JSON key file
        content = await file.read()
        json_key = json.loads(content)
        
        # Initialize credentials
        credentials = service_account.Credentials.from_service_account_info(
            json_key,
            scopes=['https://www.googleapis.com/auth/webmasters.readonly']
        )
        
        # Create service
        webmasters_service = build('searchconsole', 'v1', credentials=credentials)
        
        # Get data for both periods
        current_period = await analyze_data(
            file=file,
            start_date=current_start_date,
            end_date=current_end_date,
            exclude_regex=exclude_regex,
            site_url=site_url
        )
        
        previous_period = await analyze_data(
            file=file,
            start_date=previous_start_date,
            end_date=previous_end_date,
            exclude_regex=exclude_regex,
            site_url=site_url
        )
        
        # Calculate changes
        changes = {
            "non_brand": {
                "clicks_change": calculate_percentage_change(
                    previous_period["non_brand_clicks"],
                    current_period["non_brand_clicks"]
                ),
                "ctr_change": calculate_percentage_change(
                    previous_period["non_brand_ctr"],
                    current_period["non_brand_ctr"]
                ),
                "position_change": previous_period["non_brand_avg_position"] - current_period["non_brand_avg_position"]
            },
            "brand": {
                "clicks_change": calculate_percentage_change(
                    previous_period["brand_clicks"],
                    current_period["brand_clicks"]
                ),
                "ctr_change": calculate_percentage_change(
                    previous_period["brand_ctr"],
                    current_period["brand_ctr"]
                ),
                "position_change": previous_period["brand_avg_position"] - current_period["brand_avg_position"]
            },
            "queries": compare_queries(
                previous_period["all_non_brand_queries"] + previous_period["all_brand_queries"],
                current_period["all_non_brand_queries"] + current_period["all_brand_queries"]
            )
        }
        
        return {
            "current_period": current_period,
            "previous_period": previous_period,
            "changes": changes
        }
        
    except Exception as e:
        logging.error(f"Error in compare_periods: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """Calculate percentage change between two values."""
    if old_value == 0:
        return 100 if new_value > 0 else 0
    return ((new_value - old_value) / old_value) * 100

def compare_queries(previous_queries: List[dict], current_queries: List[dict]) -> List[dict]:
    """Compare queries between two periods and identify significant changes."""
    query_changes = []
    
    # Create dictionaries for easy lookup
    previous_dict = {q["query"]: q for q in previous_queries}
    current_dict = {q["query"]: q for q in current_queries}
    
    # Find all unique queries
    all_queries = set(previous_dict.keys()) | set(current_dict.keys())
    
    for query in all_queries:
        prev = previous_dict.get(query, {"clicks": 0, "impressions": 0, "ctr": 0, "position": 0})
        curr = current_dict.get(query, {"clicks": 0, "impressions": 0, "ctr": 0, "position": 0})
        
        clicks_change = calculate_percentage_change(prev["clicks"], curr["clicks"])
        position_change = prev["position"] - curr["position"] if prev["position"] and curr["position"] else 0
        
        # Only include significant changes
        if abs(clicks_change) > 10 or abs(position_change) > 0.5:
            query_changes.append({
                "query": query,
                "clicks_change": clicks_change,
                "position_change": position_change,
                "current": curr,
                "previous": prev
            })
    
    # Sort by absolute click change
    query_changes.sort(key=lambda x: abs(x["clicks_change"]), reverse=True)
    return query_changes[:100]  # Return top 100 most significant changes

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 