'use client';

import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';

// Add at the top of the file, after imports
interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface ResultsData {
  total_all_clicks: number;
  non_brand_clicks: number;
  brand_clicks: number;
  unattributed_clicks: number;
  start_date: string;
  end_date: string;
  non_brand_ctr: number;
  non_brand_avg_position: number;
  brand_ctr: number;
  brand_avg_position: number;
  non_brand_impressions: number;
  brand_impressions: number;
  top_non_brand_queries: QueryData[];
  top_brand_queries: QueryData[];
  site_url: string;
  all_non_brand_queries: QueryData[];
  all_brand_queries: QueryData[];
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: string;
}

// Composant HelpTooltip réutilisable
const HelpTooltip = ({ children, content }: { children: React.ReactNode, content: string }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white rounded-lg shadow-lg border border-gray-200">
          {content}
        </div>
      )}
    </div>
  );
};

// Ajouter le composant FAQ
const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = {
    'Getting Started': [0, 1, 4],
    'Technical Setup': [2, 3],
    'Why Non-Brand SEO Matters': [8],
    'Analysis': [5, 6, 7],
    'Troubleshooting': [9, 10, 11],
    'Glossary': [12, 13, 14, 15, 16, 17, 18]
  };

  const faqItems: FAQItem[] = [
    {
      question: "What is QueryScope and how does it work?",
      answer: `QueryScope is a powerful SEO analysis tool that helps you understand your true organic search performance by analyzing your Search Console data, focusing on non-brand traffic.

Key Features:
• Non-Brand Traffic Analysis: Identify your real SEO performance
• Advanced Metrics: CTR, position, and visibility analysis for non-brand queries
• Strategic Recommendations: Actionable insights based on non-brand data
• Secure Processing: Your data never leaves your browser
• Export Options: Detailed CSV reports

The tool processes your data locally in your browser and provides instant insights without storing any information on external servers.`,
      category: 'Getting Started',
      icon: '🚀'
    },
    {
      question: "Data Security & Privacy",
      answer: `Your data security is our top priority:

1. Local Processing
   • All analysis is performed directly in your browser
   • No data is ever stored on our servers
   • Your GSC credentials remain private

2. Secure Implementation
   • One-time JSON key usage
   • No data persistence after session ends
   • Automatic cleanup on browser close

3. Best Practices
   • Use a restricted GSC service account
   • Grant read-only permissions
   • Regularly rotate your API keys

We recommend creating a dedicated service account with minimal permissions for added security.`,
      category: 'Getting Started',
      icon: '🔒'
    },
    {
      question: "How does non-brand analysis work?",
      answer: `The analysis uses a sophisticated pattern matching system to identify and exclude brand-related queries:

1. Brand Detection
   • Uses your custom regex pattern to identify brand queries
   • Example: For "Apple", use "apple|iphone|macbook"
   • Captures variations and misspellings if included

2. Classification Process:
   • Brand: Queries matching your regex (excluded from analysis)
   • Non-Brand: Queries not matching (focus of analysis)
   • Hidden: Queries not provided by the API due to sampling

3. Analysis Includes:
   • Non-brand click distribution
   • Non-brand CTR analysis
   • Position analysis for non-brand queries
   • True SEO performance score
   • Strategic recommendations for non-brand optimization

Pro Tips:
• Include all brand variations in your regex
• Consider regional brand variations
• Test your regex pattern before analysis`,
      category: 'Technical Setup',
      icon: '🔍'
    },
    {
      question: "How to obtain and configure the Google Search Console JSON key?",
      answer: `Step-by-step guide to secure API access:

1. Google Cloud Console Setup (https://console.cloud.google.com):
   • Create a new project or select existing
   • Enable Search Console API
   • Set up OAuth consent screen (Internal)

2. Create Service Account:
   • Go to "IAM & Admin" > "Service Accounts"
   • Click "Create Service Account"
   • Name it (e.g., "queryscope-readonly")
   • Description: "Read-only access for QueryScope analysis"

3. Configure Permissions:
   • Grant only "Search Console Reader" role
   • No additional Google Cloud permissions needed

4. Create & Download JSON Key:
   • Select your service account
   • Go to "Keys" tab
   • Create new JSON key
   • Store securely, never share publicly

5. Search Console Configuration:
   • Open Search Console
   • Go to Settings > Users and Permissions
   • Add service account email as user
   • Grant "Read-only" permission
   • Verify access

Security Best Practices:
• Create dedicated service account for QueryScope
• Use minimal permissions
• Rotate keys periodically
• Store JSON key securely`,
      category: 'Technical Setup',
      icon: '🔑'
    },
    {
      question: "How to choose the right analysis period?",
      answer: `Optimize your analysis with these period selection guidelines:

1. Time Range Limits:
   • Maximum: 16 months rolling window
   • Minimum: 1 day
   • Recommended: 1-3 months for optimal insights

2. Strategic Period Selection:
   • Recent Data: More accurate, complete data
   • Seasonal Trends: Compare similar periods
   • Campaign Analysis: Include pre/post periods
   • Year-over-Year: Same months across years

3. Considerations:
   • Data Freshness: 3-day delay in GSC
   • Sampling Levels: Longer periods may increase sampling
   • Seasonal Factors: Consider business cycles
   • Algorithm Updates: Note major Google updates

4. Best Practices:
   • Regular Analysis: Monthly or quarterly reviews
   • Consistent Periods: Use same length for comparisons
   • Exclude Anomalies: Skip unusual event periods
   • Include Full Weeks: Start/end on same weekday`,
      category: 'Getting Started',
      icon: '📅'
    },
    {
      question: "Understanding the Results",
      answer: `Comprehensive guide to interpreting your analysis:

1. Non-Brand Traffic Analysis:
   • Non-Brand Clicks: True organic search performance
   • Non-Brand CTR: Engagement with non-brand queries
   • Position Analysis: SERP performance for non-brand
   • Hidden Clicks: Unattributed due to sampling

2. Key Metrics:
   • Non-Brand Percentage: True SEO performance indicator
   • CTR Comparison: Engagement strength for non-brand
   • Position Analysis: SERP dominance for non-brand
   • Visibility Score: Overall non-brand strength

3. Performance Indicators:
   • Strong SEO: High non-brand click share
   • Good CTR: Strong non-brand engagement
   • Optimal Position: <3 average position for non-brand
   • Healthy Mix: Balance of non-brand queries

4. Report Sections:
   • Overview: Key non-brand metrics summary
   • Detailed Analysis: Deep dive into non-brand data
   • Strategic Recommendations: Action items
   • Implementation Plan: 30/90 day roadmap`,
      category: 'Analysis',
      icon: '📊'
    },
    {
      question: "Data Quality and Limitations",
      answer: `Understanding data accuracy and limitations:

1. Search Console Sampling:
   • What: GSC provides representative data sample
   • Why: Processing efficiency for large datasets
   • Impact: Minor variations from GSC interface
   • Handling: Clearly marked in reports

2. Data Processing:
   • Real-time: Instant analysis in browser
   • Accuracy: High-precision calculations
   • Validation: Automated data checks
   • Quality: Statistical significance maintained

3. Known Limitations:
   • 16-month historical limit
   • 3-day reporting delay
   • Query sampling for high-volume sites
   • Position averaging for multiple appearances

4. Best Practices:
   • Regular analysis for trends
   • Compare similar time periods
   • Consider sampling in analysis
   • Use relative metrics for decisions`,
      category: 'Analysis',
      icon: '📈'
    },
    {
      question: "Maximizing Analysis Value",
      answer: `Tips for getting the most from QueryScope:

1. Regular Analysis:
   • Monthly non-brand performance checks
   • Quarterly trend analysis
   • Year-over-year comparisons
   • Post-campaign evaluations

2. Strategic Applications:
   • True SEO performance tracking
   • Competition monitoring
   • Content strategy validation
   • SEO campaign measurement

3. Advanced Usage:
   • Multiple regex variations
   • Segment by market/region
   • Track specific product lines
   • Monitor brand variations

4. Action Planning:
   • Prioritize non-brand recommendations
   • Set measurable goals
   • Track implementation
   • Monitor improvements

5. Report Utilization:
   • Share with stakeholders
   • Guide strategy meetings
   • Justify SEO investments
   • Document progress`,
      category: 'Analysis',
      icon: '💡'
    },
    // ---- Why Non-Brand SEO Matters Section ----
    {
      question: "Why focus on Non-Brand SEO?",
      answer: `Understanding the distinction between Brand and Non-Brand traffic is crucial for accurately assessing your SEO effectiveness.

1. What is Brand Traffic?
   • Searches directly containing your brand name, specific product names, or variations (e.g., "QueryScope", "QueryScope login").
   • Reflects existing brand awareness and users specifically seeking you out.
   • Typically has high CTR and top positions due to navigational intent.

2. What is Non-Brand Traffic?
   • Searches related to the problems you solve, the services you offer, or general industry terms, but WITHOUT mentioning your brand (e.g., "seo analysis tool", "how to measure non-brand seo").
   • Represents users discovering solutions or exploring options, often unaware of your brand initially.

3. Why is Non-Brand Traffic the "Pure" SEO Indicator?
   • Acquisition Focus: It measures your ability to attract *new* users who aren't already familiar with you.
   • Competitive Benchmark: It shows how well you perform against competitors on generic, high-value keywords.
   • Market Relevance: It reflects your visibility on the actual topics and needs your target audience is searching for.
   • Content Strategy Validation: Success here indicates your content effectively addresses user needs and search intent.

4. Limitations of Relying Solely on Total Traffic:
   • High brand traffic can mask underlying weaknesses in non-brand SEO.
   • A drop in total traffic might be due to declining brand searches (market factors) rather than poor SEO.

5. How QueryScope Helps:
   • By isolating non-brand traffic, QueryScope provides a clear view of your true SEO performance in attracting new, relevant audiences based on their needs, not just your name recognition.`,
      category: 'Why Non-Brand SEO Matters',
      icon: '🎯'
    },
    // ---- Troubleshooting Section ----
    {
      question: "Why is my JSON key not working?",
      answer: `Several reasons can cause JSON key issues:

1. Invalid Key Format:
   • Ensure the file is a valid JSON downloaded from Google Cloud Console.
   • Do not modify the file content.

2. Incorrect Permissions (Most Common):
   • The Service Account linked to the key MUST have "Viewer" (Lecteur) permission on the Search Console property.
   • Check permissions in GSC: Settings > Users and permissions.
   • The Service Account email needs to be added as a user with Viewer rights.

3. API Not Enabled:
   • The Google Search Console API must be enabled in your Google Cloud Project.
   • Go to Google Cloud Console > APIs & Services > Enabled APIs & services.

4. Expired Key:
   • Service account keys don't expire by default, but check if any policy was applied.

5. Wrong Property:
   • Make sure the Service Account has access to the specific property URL you entered (e.g., domain property vs. URL prefix property).

Troubleshooting Steps:
• Double-check GSC permissions for the service account email.
• Verify the Search Console API is enabled in Google Cloud.
• Try generating a new key for the same service account.
• Ensure the Website URL entered matches the GSC property format (e.g., example.com vs www.example.com).`,
      category: 'Troubleshooting',
      icon: '🔧'
    },
    {
      question: "I'm getting an API error during analysis.",
      answer: `API errors can occur for various reasons:

1. Quota Exceeded:
   • Google Search Console API has usage limits (queries per minute, queries per day).
   • If you run many analyses rapidly, you might hit these limits.
   • Wait a few minutes or hours and try again.
   • Check quotas in Google Cloud Console > APIs & Services > Google Search Console API > Quotas.

2. Temporary Google Server Issues:
   • Rarely, Google's API might experience temporary downtime.
   • Check Google Cloud Status Dashboard if you suspect this.
   • Try again later.

3. Invalid Date Range or Filters:
   • Ensure the selected date range is valid (max 16 months, end date not before start date).
   • Issues with the exclude regex might sometimes cause unexpected API request formats (less common).

4. Network Issues:
   • Your internet connection might be unstable.
   • Try refreshing the page or checking your connection.

Error Message Detail:
• Look closely at the error message provided by QueryScope. It often contains details from the Google API that can pinpoint the issue (e.g., "Quota exceeded", "Backend error").`,
      category: 'Troubleshooting',
      icon: '⚙️'
    },
    {
      question: "Why do the numbers differ slightly from the GSC interface?",
      answer: `Small discrepancies between QueryScope and the GSC web interface are normal and expected. Here's why:

1. Data Freshness & Cache:
   • GSC interface data can sometimes have a slight delay or use cached results differently than the API.
   • The API generally provides the most up-to-date data (usually with a ~3-day lag).

2. Sampling Differences:
   • Both the GSC interface and the API use data sampling for large datasets. The exact samples might differ slightly, leading to minor variations in totals.
   • QueryScope explicitly reports "Hidden Traffic" resulting from this sampling.

3. Timezone Handling:
   • The GSC API typically uses UTC time, while the interface might adjust to your local timezone. QueryScope uses the API data directly.

4. API Request Granularity:
   • QueryScope requests data specifically dimensioned by query, which might trigger slightly different processing on Google's side compared to the aggregated views in the interface.

Key Takeaway:
• Focus on trends, percentages, and relative performance rather than exact number matching. The insights derived remain valid.`,
      category: 'Troubleshooting',
      icon: '📊'
    },
    // ---- Glossary Section ----
    {
      question: "Clicks",
      answer: `The number of times users clicked on your website links in Google search results for a given query.

In QueryScope:
• Total Clicks: All clicks recorded for the period.
• Non-Brand Clicks: Clicks from queries NOT matching your exclude regex.
• Brand Clicks: Clicks from queries matching your exclude regex.
• Hidden Clicks: Clicks from queries not reported by the API due to sampling/privacy thresholds.`,
      category: 'Glossary',
      icon: '🖱️'
    },
    {
      question: "Impressions",
      answer: `The number of times any URL from your site appeared in search results viewed by a user (even if not scrolled into view). An impression is counted each time your link appears for a specific query.`,
      category: 'Glossary',
      icon: '👁️'
    },
    {
      question: "CTR (Click-Through Rate)",
      answer: `The percentage of impressions that resulted in a click.

Calculation: (Clicks / Impressions) * 100%

Interpretation:
• A high CTR suggests your search result snippet (title, description) is compelling for that query.
• QueryScope shows CTR for Non-Brand and Brand traffic separately, allowing you to gauge the effectiveness of your snippets for different user intents.`,
      category: 'Glossary',
      icon: '📈'
    },
    {
      question: "Average Position",
      answer: `The average ranking of your website URLs in the search results for a given query. Lower numbers are better (e.g., position 1 is the top result).

Important Notes:
• It's an average across all impressions for that query.
• If your site appears multiple times (e.g., sitelinks), the topmost position is typically used for calculation.
• QueryScope averages this across all Non-Brand or Brand queries.`,
      category: 'Glossary',
      icon: '🏆'
    },
    {
      question: "Non-Brand Traffic",
      answer: `Search traffic originating from queries that DO NOT contain the brand keywords you defined in the "Keywords to exclude" regex.

Significance:
• Often considered a better reflection of pure SEO performance, as users are searching for topics, products, or services, not specifically your brand.
• QueryScope focuses on analyzing this segment.`,
      category: 'Glossary',
      icon: '🔍'
    },
    {
      question: "Brand Traffic",
      answer: `Search traffic originating from queries that DO contain the brand keywords you defined in the "Keywords to exclude" regex.

Significance:
• Reflects brand awareness and users specifically looking for your company or products.
• Typically has a higher CTR and better average position.`,
      category: 'Glossary',
      icon: '🏢'
    },
    {
      question: "Hidden Traffic (Unattributed)",
      answer: `Clicks and impressions that Google Search Console does not attribute to specific queries. This happens due to:

1. Privacy Thresholds: Google anonymizes very rare or potentially sensitive queries.
2. Sampling: For large datasets, GSC analyzes a sample, and some data might not be included in the query-specific results.

QueryScope shows this as "Hidden Traffic" clicks in the overview.`,
      category: 'Glossary',
      icon: '❓'
    }
  ];

  return (
    <div id="guide" className="mt-16 glass-effect p-8 rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Guide</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-lg ${
            !activeCategory
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              activeCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {faqItems
          .filter((item: FAQItem) => !activeCategory || item.category === activeCategory)
          .map((item: FAQItem, index: number) => (
            <div 
              key={index}
              className="border border-gray-100 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenItem(openItem === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-gray-900">{item.question}</span>
                </div>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openItem === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openItem === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {item.answer.split('\n\n').map((paragraph: string, pIndex: number) => (
                      <div key={pIndex} className="mb-4">
                        {paragraph.split('\n').map((line: string, lIndex: number) => (
                          <p key={lIndex} className="mb-2">
                            {line.startsWith('•') ? (
                              <span className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{line.substring(1)}</span>
                              </span>
                            ) : line.match(/^\d+\./) ? (
                              <span className="flex items-start">
                                <span className="mr-2 font-medium">{line.split('.')[0]}.</span>
                                <span>{line.split('.').slice(1).join('.')}</span>
                              </span>
                            ) : (
                              line
                            )}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const FileUploadZone = ({ onFileSelect, selectedFile }: { onFileSelect: (file: File) => void, selectedFile: File | null }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-purple-500 bg-purple-50'
          : selectedFile 
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".json"
        className="hidden"
      />
      <div className="text-center">
        {selectedFile ? (
          <div className="flex items-center justify-center space-x-2">
            <svg 
              className="w-5 h-5 text-purple-500" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-purple-600 font-medium">
              {selectedFile.name}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">
            Click or drop your JSON file here
          </p>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [excludeRegex, setExcludeRegex] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !startDate || !endDate || !siteUrl) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('start_date', startDate.toISOString().split('T')[0]);
      formData.append('end_date', endDate.toISOString().split('T')[0]);
      formData.append('exclude_regex', excludeRegex);
      formData.append('site_url', siteUrl);

      // Construct the full API endpoint URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL environment variable not set.");
      }
      const endpoint = `${apiUrl}/analyze`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setResults(response.data);
    } catch (err: any) {
      console.error('Error details:', err);
      // Handle potential error structure differences
      let errorMessage = 'An error occurred during analysis';
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message; // Include error message if detail is not available
      }
      setError(typeof errorMessage === 'string' 
        ? errorMessage 
        : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = (data: ResultsData) => {
    // Vérifier que les données existent
    if (!data.all_non_brand_queries || !data.all_brand_queries) {
      console.error('Missing query data');
      return;
    }

    // Fonction pour formater les nombres
    const formatNumber = (num: number): string => {
      return num.toLocaleString('fr-FR'); // Utilise le format français avec espaces
    };

    // Fonction pour formater les pourcentages
    const formatPercent = (num: number): string => {
      return `${num.toFixed(1)}%`;
    };

    // Fonction pour formater les positions
    const formatPosition = (num: number): string => {
      return num === Math.floor(num) ? num.toString() : num.toFixed(1);
    };

    // Prepare all queries data
    const allQueries = [
      ...(data.all_non_brand_queries || []).map(q => ({
        ...q,
        type: 'Non-Brand'
      })),
      ...(data.all_brand_queries || []).map(q => ({
        ...q,
        type: 'Brand'
      }))
    ].sort((a, b) => b.clicks - a.clicks);

    // Create CSV content with minimal formatting
    const csv = [
      // Headers
      ['QUERY', 'TYPE', 'CLICKS', 'IMPRESSIONS', 'CTR', 'POSITION'],
      // Queries data
      ...allQueries.map(q => [
        q.query,
        q.type,
        formatNumber(q.clicks),
        formatNumber(q.impressions),
        formatPercent(q.ctr),
        formatPosition(q.position)
      ]),
      // Totals
      ['', '', '', '', '', ''],
      ['NON-BRAND TOTAL', '', formatNumber(data.non_brand_clicks), formatNumber(data.non_brand_impressions), formatPercent(data.non_brand_ctr), formatPosition(data.non_brand_avg_position)],
      ['BRAND TOTAL', '', formatNumber(data.brand_clicks), formatNumber(data.brand_impressions), formatPercent(data.brand_ctr), formatPosition(data.brand_avg_position)],
      ['HIDDEN TRAFFIC', '', formatNumber(data.unattributed_clicks), '', '', '']
    ].map(row => row.join(';')).join('\n');

    // Create and download file
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // Ajout du BOM pour Excel
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `queryscope_analysis.csv`;
    link.click();
  };

  const handleExportExcel = (data: ResultsData) => {
    // Vérifier que les données existent
    if (!data.all_non_brand_queries || !data.all_brand_queries) {
      console.error('Missing query data');
      return;
    }

    // Fonction pour formater les nombres
    const formatNumber = (num: number): string => {
      return num.toLocaleString('fr-FR');
    };

    // Fonction pour formater les pourcentages
    const formatPercent = (num: number): string => {
      return `${num.toFixed(1)}%`;
    };

    // Fonction pour formater les positions
    const formatPosition = (num: number): string => {
      return num === Math.floor(num) ? num.toString() : num.toFixed(1);
    };

    // Prepare all queries data
    const allQueries = [
      ...(data.all_non_brand_queries || []).map(q => ({
        ...q,
        type: 'Non-Brand'
      })),
      ...(data.all_brand_queries || []).map(q => ({
        ...q,
        type: 'Brand'
      }))
    ].sort((a, b) => b.clicks - a.clicks);

    // Create Excel data
    const excelData = [
      // Headers
      ['QUERY', 'TYPE', 'CLICKS', 'IMPRESSIONS', 'CTR', 'POSITION'],
      // Queries data
      ...allQueries.map(q => [
        q.query,
        q.type,
        formatNumber(q.clicks),
        formatNumber(q.impressions),
        formatPercent(q.ctr),
        formatPosition(q.position)
      ]),
      // Empty row
      ['', '', '', '', '', ''],
      // Totals
      ['NON-BRAND TOTAL', '', formatNumber(data.non_brand_clicks), formatNumber(data.non_brand_impressions), formatPercent(data.non_brand_ctr), formatPosition(data.non_brand_avg_position)],
      ['BRAND TOTAL', '', formatNumber(data.brand_clicks), formatNumber(data.brand_impressions), formatPercent(data.brand_ctr), formatPosition(data.brand_avg_position)],
      ['HIDDEN TRAFFIC', '', formatNumber(data.unattributed_clicks), '', '', '']
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Analysis");

    // Generate Excel file
    XLSX.writeFile(wb, `queryscope_analysis.xlsx`);
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
              Reveal your organic search power
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mt-2">
              beyond brand visibility
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Query<span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Scope</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Understand Your True SEO Performance
            </p>
            <a 
              href="#guide"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all duration-200"
            >
              Guide
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload JSON Key
                </label>
                <FileUploadZone onFileSelect={setFile} selectedFile={file} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="example.com"
                  className="w-full rounded-lg p-3 bg-white border border-gray-200"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter domain without protocol (e.g., example.com)
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()}
                    placeholderText="Select start date"
                    className="w-full rounded-lg p-3 bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
                    placeholderText="Select end date"
                    className="w-full rounded-lg p-3 bg-white border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords to exclude from non-brand traffic
                </label>
                <input
                  type="text"
                  value={excludeRegex}
                  onChange={(e) => setExcludeRegex(e.target.value)}
                  placeholder="apple | iphone | macbook"
                  className="w-full rounded-lg p-3 bg-white border border-gray-200"
                />
                <p className="mt-2 text-sm text-gray-500">
                  List keywords to exclude, separated by |. Any query containing these words will be treated as brand traffic.
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Analyze'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {results && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Results</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportCSV(results)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    CSV
                  </button>
                  <button
                    onClick={() => handleExportExcel(results)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Excel
                  </button>
                </div>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-800">Non-Brand Traffic</h3>
                    <HelpTooltip content="Traffic from search queries that don't contain your brand terms">
                      <InformationCircleIcon className="w-4 h-4 text-gray-500" />
                    </HelpTooltip>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {results.non_brand_clicks.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {((results.non_brand_clicks / (results.non_brand_clicks + results.brand_clicks)) * 100).toFixed(1)}% of total
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-800">Brand Traffic</h3>
                    <HelpTooltip content="Traffic from search queries containing your brand terms">
                      <InformationCircleIcon className="w-4 h-4 text-gray-500" />
                    </HelpTooltip>
                  </div>
                  <div className="text-2xl font-bold text-violet-600 mb-1">
                    {results.brand_clicks.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {((results.brand_clicks / (results.non_brand_clicks + results.brand_clicks)) * 100).toFixed(1)}% of total
                  </div>
                </div>

                {results.unattributed_clicks > 0 && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-800">Hidden Traffic</h3>
                      <HelpTooltip content="Clicks that Google Search Console doesn't attribute to specific queries due to privacy protection">
                        <InformationCircleIcon className="w-4 h-4 text-gray-500" />
                      </HelpTooltip>
                    </div>
                    <div className="text-2xl font-bold text-gray-700 mb-1">
                      {results.unattributed_clicks.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Standard GSC limitation
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Non-Brand Analysis */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-indigo-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Non-Brand Performance</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">CTR</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {results.non_brand_ctr.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Avg Position</div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {results.non_brand_avg_position.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Top Queries</h4>
                      <div className="space-y-3">
                        {results.top_non_brand_queries.map((query: QueryData, index: number) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-900">{query.query}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-600">Position: {query.position.toFixed(1)}</span>
                              <span className="text-sm font-medium text-indigo-600">
                                {query.clicks.toLocaleString()} clicks
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Brand Analysis */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-violet-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Brand Performance</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">CTR</div>
                        <div className="text-2xl font-bold text-violet-600">
                          {results.brand_ctr.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Avg Position</div>
                        <div className="text-2xl font-bold text-violet-600">
                          {results.brand_avg_position.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Top Queries</h4>
                      <div className="space-y-3">
                        {results.top_brand_queries.map((query: QueryData, index: number) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-900">{query.query}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-600">Position: {query.position.toFixed(1)}</span>
                              <span className="text-sm font-medium text-violet-600">
                                {query.clicks.toLocaleString()} clicks
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Distribution Chart */}
              <div className="mt-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { 
                              name: 'Non-Brand', 
                              value: results.non_brand_clicks,
                              percentage: (results.non_brand_clicks / (results.non_brand_clicks + results.brand_clicks) * 100)
                            },
                            { 
                              name: 'Brand', 
                              value: results.brand_clicks,
                              percentage: (results.brand_clicks / (results.non_brand_clicks + results.brand_clicks) * 100)
                            }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#6366F1" />
                          <Cell fill="#A855F7" />
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value.toLocaleString()} clicks (${props.payload.percentage.toFixed(1)}%)`,
                            name
                          ]}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <FAQSection />

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Feedback & Suggestions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Have an idea to improve QueryScope? Found a bug? Your feedback is valuable to us!
          </p>
          <a 
            href="mailto:aurelien.pringarbe.pro@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            Send an Email
          </a>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© QueryScope 2025</p>
          <p className="mt-1">
            Created by{' '}
            <a 
              href="https://www.linkedin.com/in/aur%C3%A9lien-pringarbe-4b57561b0/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Aurélien Pringarbe
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}