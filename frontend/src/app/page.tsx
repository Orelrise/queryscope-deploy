'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import Link from 'next/link';

// Import the new Header component
import Header from '../components/Header';

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
  const [activeCategory, setActiveCategory] = useState<string | null>('Getting Started'); // Default to the first category

  // Updated category mapping with new order and indices
  const categories = {
    'Getting Started': [0, 1],
    'Why Non-Brand SEO Matters': [2],
    'Technical Setup': [3, 4, 5],
    'Understanding the Results': [6, 7, 8],
    'Troubleshooting': [9, 10, 11],
    'Glossary': [12, 13, 14, 15, 16, 17, 18]
  };

  // Reordered faqItems array
  const faqItems: FAQItem[] = [
    // Getting Started (0, 1)
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
    // Why Non-Brand SEO Matters (2) - Originally index 8
    {
      question: "Why focus on Non-Brand SEO?",
      answer: `Understanding the 'why' behind non-brand analysis:

1. True SEO Measurement:
   • Brand traffic reflects existing brand strength, not necessarily SEO effectiveness.
   • Non-brand traffic shows how well you attract users unaware of your brand.
   • It's the key indicator of organic search growth potential.

2. Uncover Hidden Opportunities:
   • Identify non-brand queries driving relevant traffic.
   • Optimize content for these high-potential terms.
   • Find gaps where competitors outperform.

3. Strategic Decision Making:
   • Allocate SEO resources effectively.
   • Measure the true impact of SEO campaigns.
   • Validate content strategy success.

4. Competitive Edge:
   • Understand user search intent beyond your brand.
   • Capture market share from generic searches.
   • Build long-term organic visibility.

Focusing on non-brand SEO provides a clear view of your actual search engine performance and guides effective optimization strategies.`,
      category: 'Why Non-Brand SEO Matters',
      icon: '🎯'
    },
    // Technical Setup (3, 4, 5) - Originally indices 3, 4, 2
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
      category: 'Technical Setup', // Moved from Getting Started
      icon: '📅'
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
    // Understanding the Results (6, 7, 8) - Originally indices 5, 7, 6
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
    // Troubleshooting (9, 10, 11) - Original indices
    {
      question: "Why is my JSON key not working?",
      answer: `Troubleshooting steps for key issues:

1. Common Errors:
   • Incorrect JSON format
   • Expired or revoked key
   • Service account lacks GSC permissions
   • API not enabled in Google Cloud

2. Verification Checklist:
   • Ensure valid JSON structure
   • Verify service account email added to GSC
   • Confirm "Read-only" permission in GSC
   • Check API enabled status in Cloud Console
   • Regenerate key if suspected compromise

3. Permission Timing:
   • Allow up to 24 hours for GSC permissions to propagate

4. Error Messages:
   • "Permission denied": Check GSC user settings
   • "API not enabled": Check Cloud Console
   • "Invalid credentials": Regenerate JSON key

Still having issues? Double-check the setup guide or contact support.`,
      category: 'Troubleshooting',
      icon: '❓'
    },
    {
      question: "I'm getting an API error during analysis.",
      answer: `Common API errors and solutions:

1. Rate Limits Exceeded:
   • Cause: Too many requests in short period
   • Solution: Wait and retry; reduce analysis frequency

2. Quota Exceeded:
   • Cause: Project quota limits reached
   • Solution: Check Google Cloud quotas; request increase if needed

3. Invalid Request:
   • Cause: Malformed request (e.g., bad date range)
   • Solution: Verify input parameters; check date formats

4. Server Error (5xx):
   • Cause: Temporary Google API issue
   • Solution: Retry after a few minutes

5. Debugging Steps:
   • Note the exact error message
   • Check Google Cloud API dashboard for status
   • Simplify analysis (shorter period, fewer sites)
   • Test JSON key validity`,
      category: 'Troubleshooting',
      icon: '⚙️'
    },
    {
      question: "Why do the numbers differ slightly from the GSC interface?",
      answer: `Reasons for minor discrepancies:

1. Data Sampling:
   • GSC API may use slightly different sampling than the UI
   • Especially noticeable for long periods or large sites
   • QueryScope indicates potential sampling impact

2. Data Freshness:
   • API data can have a slightly different delay than the UI
   • Typically aligns within hours

3. Calculation Differences:
   • QueryScope applies specific non-brand filtering
   • GSC UI might aggregate data differently

4. Timezone Handling:
   • Ensure consistent timezone settings (PST for GSC)

Focus on trends and relative performance rather than exact number matching.`,
      category: 'Troubleshooting',
      icon: '📉'
    },
    // Glossary (12-18) - Original indices
    {
      question: "Clicks",
      answer: "The number of times users clicked on your site's links in Google Search results for a specific query.",
      category: 'Glossary',
      icon: '🖱️'
    },
    {
      question: "Impressions",
      answer: "The number of times links to your site appeared in Google Search results viewed by a user.",
      category: 'Glossary',
      icon: '👁️'
    },
    {
      question: "CTR (Click-Through Rate)",
      answer: "The percentage of impressions that resulted in a click. Calculated as (Clicks / Impressions) * 100.",
      category: 'Glossary',
      icon: '%'
    },
    {
      question: "Average Position",
      answer: "The average ranking of your site's links in search results for a query or set of queries. Lower numbers are better.",
      category: 'Glossary',
      icon: '📊' // Reusing, consider finding a better one if needed
    },
    {
      question: "Non-Brand Traffic",
      answer: "Clicks and impressions from search queries that do not contain your brand name or variations, as defined by your regex.",
      category: 'Glossary',
      icon: '📈' // Reusing
    },
    {
      question: "Brand Traffic",
      answer: "Clicks and impressions from search queries that contain your brand name or variations, matching your regex.",
      category: 'Glossary',
      icon: '🏢'
    },
    {
      question: "Hidden Traffic (Unattributed)",
      answer: "Clicks and impressions from queries that Google Search Console does not report due to privacy thresholds or sampling.",
      category: 'Glossary',
      icon: '👻'
    }
  ];


  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category);
    setOpenItem(null); // Close any open item when changing category
  };

  // Filter items based on active category
  const filteredItems = activeCategory
    ? faqItems.filter(item => item.category === activeCategory)
    : faqItems; // Show all if activeCategory is null (though we removed the 'All' button)

  return (
    <div id="guide" className="mt-16 glass-effect p-8 rounded-2xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Guide
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(categories).map(category => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-lg ${
              activeCategory === category
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          // Calculate the original index based on the active category filter
          const originalIndex = activeCategory ? faqItems.findIndex(original => original.question === item.question) : index;
          const isOpen = openItem === originalIndex;

          return (
            <div 
              key={originalIndex} 
              className="border border-gray-100 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleItem(originalIndex)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-gray-900">{item.question}</span>
                </div>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    isOpen ? 'rotate-180' : ''
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
              {isOpen && (
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
          );
        })}
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
      className={`w-full p-8 border-2 rounded-lg cursor-pointer transition-all duration-200 ${ 
        isDragging || selectedFile 
          ? 'border-primary border-solid bg-gradient-to-r from-primary/10 to-secondary/10' // Keep this state as is
          : 'border-gray-200 border-dashed hover:bg-gray-50' // Keep border gray dashed, add subtle bg hover
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
              className="w-5 h-5 text-primary" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-primary font-medium">
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
  const [progressPercent, setProgressPercent] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !startDate || !endDate || !siteUrl) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setProgressPercent(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgressPercent(prev => {
        if (prev >= 95) {
          if(intervalRef.current) clearInterval(intervalRef.current);
          return 95;
        }
        return prev + 1;
      });
    }, 600);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('start_date', startDate.toISOString().split('T')[0]);
      formData.append('end_date', endDate.toISOString().split('T')[0]);
      formData.append('exclude_regex', excludeRegex);
      formData.append('site_url', siteUrl);

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
      setProgressPercent(100);

    } catch (err: any) {
      console.error('Error details:', err);
      let errorMessage = 'An error occurred during analysis';
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(typeof errorMessage === 'string' 
        ? errorMessage 
        : 'An error occurred during analysis');
      setProgressPercent(0);
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setLoading(false);
    }
  };

  const handleExportCSV = (data: ResultsData) => {
    if (!data.all_non_brand_queries || !data.all_brand_queries) {
      console.error('Missing query data');
      return;
    }

    const formatNumber = (num: number): string => {
      return num.toLocaleString('fr-FR');
    };

    const formatPercent = (num: number): string => {
      return `${num.toFixed(1)}%`;
    };

    const formatPosition = (num: number): string => {
      return num === Math.floor(num) ? num.toString() : num.toFixed(1);
    };

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

    const csv = [
      ['QUERY', 'TYPE', 'CLICKS', 'IMPRESSIONS', 'CTR', 'POSITION'],
      ...allQueries.map(q => [
        q.query,
        q.type,
        formatNumber(q.clicks),
        formatNumber(q.impressions),
        formatPercent(q.ctr),
        formatPosition(q.position)
      ]),
      ['', '', '', '', '', ''],
      ['NON-BRAND TOTAL', '', formatNumber(data.non_brand_clicks), formatNumber(data.non_brand_impressions), formatPercent(data.non_brand_ctr), formatPosition(data.non_brand_avg_position)],
      ['BRAND TOTAL', '', formatNumber(data.brand_clicks), formatNumber(data.brand_impressions), formatPercent(data.brand_ctr), formatPosition(data.brand_avg_position)],
      ['HIDDEN TRAFFIC', '', formatNumber(data.unattributed_clicks), '', '', '']
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `queryscope_analysis.csv`;
    link.click();
  };

  const handleExportExcel = (data: ResultsData) => {
    if (!data.all_non_brand_queries || !data.all_brand_queries) {
      console.error('Missing query data');
      return;
    }

    const formatNumber = (num: number): string => {
      return num.toLocaleString('fr-FR');
    };

    const formatPercent = (num: number): string => {
      return `${num.toFixed(1)}%`;
    };

    const formatPosition = (num: number): string => {
      return num === Math.floor(num) ? num.toString() : num.toFixed(1);
    };

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

    const excelData = [
      ['QUERY', 'TYPE', 'CLICKS', 'IMPRESSIONS', 'CTR', 'POSITION'],
      ...allQueries.map(q => [
        q.query,
        q.type,
        formatNumber(q.clicks),
        formatNumber(q.impressions),
        formatPercent(q.ctr),
        formatPosition(q.position)
      ]),
      ['', '', '', '', '', ''],
      ['NON-BRAND TOTAL', '', formatNumber(data.non_brand_clicks), formatNumber(data.non_brand_impressions), formatPercent(data.non_brand_ctr), formatPosition(data.non_brand_avg_position)],
      ['BRAND TOTAL', '', formatNumber(data.brand_clicks), formatNumber(data.brand_impressions), formatPercent(data.brand_ctr), formatPosition(data.brand_avg_position)],
      ['HIDDEN TRAFFIC', '', formatNumber(data.unattributed_clicks), '', '', '']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    XLSX.utils.book_append_sheet(wb, ws, "Analysis");

    XLSX.writeFile(wb, `queryscope_analysis.xlsx`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-2xl mx-auto py-16">
        <div className="text-center mb-16">
          <div className="flex flex-col items-center gap-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-neutral-100 tracking-tight">
                Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">True</span> Organic Growth
            </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-300 max-w-xl mx-auto mt-4">
                Stop guessing with total traffic. QueryScope analyzes your Google Search Console data to isolate non-brand queries, revealing your real SEO performance.
            </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a 
              href="#guide"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-200 shadow-sm"
                >
                  Quick Guide
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
                <Link href="/documentation" legacyBehavior>
                   <a className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all duration-200 shadow-sm">
                     Documentation
                     <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7"></path></svg>
                   </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section id="upload-section" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 -mt-16">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <span>Upload JSON Key</span>
                    <HelpTooltip content="Import the JSON key file downloaded from Google Cloud Console for the Service Account you created with Search Console API access.">
                      <InformationCircleIcon className="w-4 h-4 text-gray-500 ml-1 cursor-help" /> 
                    </HelpTooltip>
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
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
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
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            Send an Email
          </a>
        </div>
        </section>
      </main>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© QueryScope 2025</p>
        <div className="mt-2 space-x-4">
          <Link href="#guide" legacyBehavior><a className="hover:text-gray-700 transition-colors">Guide</a></Link>
          <span>|</span>
          <Link href="/documentation" legacyBehavior><a className="hover:text-gray-700 transition-colors">Documentation</a></Link>
        </div>
        <p className="mt-2">
            Created by{' '}
            <a 
              href="https://www.linkedin.com/in/aur%C3%A9lien-pringarbe-4b57561b0/" 
              target="_blank" 
              rel="noopener noreferrer" 
            className="relative font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r from-primary to-secondary after:transition-all after:duration-300 hover:after:w-full"
            >
              Aurélien Pringarbe
            </a>
          </p>
        </footer>
      </div>
  );
}