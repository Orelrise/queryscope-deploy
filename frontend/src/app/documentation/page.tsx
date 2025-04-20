'use client';

import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Données pour le graphique d'exemple
const exampleChartData = [
  { name: 'Non-Brand', value: 6000, percentage: 60, color: '#6366F1' }, // Indigo
  { name: 'Brand', value: 4000, percentage: 40, color: '#A855F7' },     // Violet
];

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-md">
        {/* Bouton Retour */}
        <div className="mb-10">
          <Link href="/" legacyBehavior>
            <a className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 no-underline text-sm font-medium">&larr; Back to App</a>
          </Link>
        </div>

        <article className="space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 border-b pb-4 mb-8">QueryScope Documentation</h1>
          
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed">QueryScope – Segment your GSC queries into branded and unbranded.</p>
            
            {/* Simplified Segmentation Schema - English */}
            <div className="my-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center text-sm font-medium text-gray-700 mb-4">Simplified Segmentation Process</div>
              <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">Google Search Traffic</div>
                <div className="text-gray-400 text-xl font-light sm:rotate-0 rotate-90">→</div>
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Brand Filter (Regex)</div>
                <div className="text-gray-400 text-xl font-light sm:rotate-0 rotate-90">→</div>
                <div className="flex flex-col space-y-1">
                   <div className="px-3 py-1 bg-violet-100 text-violet-800 rounded text-sm">Brand Clicks</div>
                   <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">Non-Brand Clicks</div>
                </div>
              </div>
            </div>
            {/* End Schema */}

            <p className="text-gray-600 leading-relaxed">QueryScope is an SEO tool that automatically separates your Google Search Console (GSC) search query data into branded and non-branded categories. Branded search queries are those that include your brand name (including typos or alternate spellings), whereas non-branded queries do not include your brand name or any variant. By connecting directly to your GSC data, QueryScope provides a clear breakdown of how many clicks come from people searching for your brand versus people searching for generic terms relevant to your business. In practice, this means you can quickly see, for example, if "Apple Watch" searches (branded) are driving 40% of your organic clicks while generic searches like "best smartwatch" (non-branded) drive the other 60%. QueryScope solves the common headache of manually filtering and segmenting queries in GSC – it delivers the insights at a glance. This not only saves you time but also ensures reporting is accurate and focused on the right metrics. In short, QueryScope gives SEO professionals and marketers clarity on the makeup of their organic traffic, enabling better strategic decisions with minimal effort.</p>
          </section>
          
          <hr className="my-10 border-gray-200"/>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Why It Matters</h2>
            <p className="text-gray-600 leading-relaxed">Understanding the split between branded and non-branded traffic is crucial for any SEO strategy. Branded searches often come from existing customers or people already aware of your brand (often navigational intent), while non-branded searches come from people who may not know your brand yet (informational or commercial intent). Non-branded search terms tend to drive new visitors to your site, and are usually more competitive to rank for – but they represent growth opportunities in reaching new audiences. Branded terms, on the other hand, are usually easier to rank for (you naturally rank for your own brand) and indicate existing brand interest or loyalty. By measuring the share of branded vs. non-branded clicks, you get a better understanding of your organic performance. For instance, if your company just ran a big marketing campaign (TV, social media, etc.), you might see a spike in organic traffic. Without segmentation, you might attribute this spike to SEO improvements, when in reality it was people searching for your brand after seeing the campaign. Splitting the traffic into branded and non-branded lets you see that effect clearly. It answers questions like: "Are we attracting new organic visitors or just people who already know us?" and "How reliant is our organic traffic on brand recognition?".</p>
            <p className="text-gray-600 leading-relaxed">Without proper segmentation, SEO performance can be misinterpreted. In many cases, reporting without this context can be misleading. One might look at total clicks and proudly conclude "90% of our clicks are thanks to all the hard SEO work – and of course, none of those are just people searching our brand name." (see the humorous example above). In reality, a large portion could be branded searches that don't reflect new user acquisition. QueryScope prevents such misunderstandings by clearly delineating which clicks come from brand-driven queries vs. generic queries. This clarity is valuable for demonstrating the true impact of your SEO efforts. It ensures that when you report on "SEO performance," everyone understands how much of it came from organic growth versus existing brand demand. In summary, QueryScope matters because it brings transparency to your organic search data. It helps you:</p>
            <ul className="list-disc list-outside space-y-2 pl-6 text-gray-600 leading-relaxed">
              <li>Validate SEO efforts: Prove that an increase in non-branded clicks is due to your optimization work (and not just a spike in brand interest).</li>
              <li>Understand audience behavior: See how many users find you through generic searches, indicating brand-new visitors.</li>
              <li>Inform strategy: If non-branded traffic is low, you know to focus on content and SEO for generic keywords. If branded traffic is high, you might capitalize on brand loyalty or realize your brand campaigns are effective.</li>
              <li>Improve reporting: Provide stakeholders or clients with a nuanced view of organic performance, leading to more informed decisions and realistic goals.</li>
            </ul>
          </section>
          
          {/* Nouvelle Section "QueryScope Advantage" */}
          <hr className="my-10 border-gray-200"/>
          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">The QueryScope Advantage: Streamlining Your Workflow</h2>
            <p className="text-gray-600 leading-relaxed">Manually segmenting GSC data can be time-consuming and error-prone. Here's how QueryScope simplifies each step:</p>

            {/* Point 1: Multiple Steps vs Automation */}
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg">
                <h4 className="font-semibold text-red-800">Manual Pain Point: Multiple Tedious Steps</h4>
                <p className="text-sm text-red-700 mt-1">Accessing GSC, applying filters multiple times, exporting separate files, opening spreadsheets, writing formulas...</p>
              </div>
              <div className="p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg">
                <h4 className="font-semibold text-indigo-800">QueryScope Solution: One-Click Analysis</h4>
                <p className="text-sm text-indigo-700 mt-1">Configure once (key, date, regex), then click "Analyze". QueryScope handles all GSC interactions, calculations, and visualization automatically.</p>
              </div>
            </div>

            {/* Point 2: Data Limitation vs Completeness */}
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg">
                <h4 className="font-semibold text-red-800">Manual Pain Point: GSC UI Data Limit</h4>
                <p className="text-sm text-red-700 mt-1">Exports from the GSC interface are limited to only the top 1,000 rows per filter, potentially missing significant long-tail query data.</p>
              </div>
              <div className="p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg">
                <h4 className="font-semibold text-indigo-800">QueryScope Solution: Complete Data via API</h4>
                <p className="text-sm text-indigo-700 mt-1">Utilizes the GSC API with automatic pagination to retrieve **all** available query data, ensuring your analysis is comprehensive, even beyond 1,000 rows.</p>
              </div>
            </div>

            {/* Point 3: Error Risk vs Reliability */}
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg">
                <h4 className="font-semibold text-red-800">Manual Pain Point: Risk of Errors</h4>
                <p className="text-sm text-red-700 mt-1">Incorrectly applied filters in GSC, copy-paste mistakes, or formula errors in spreadsheets can lead to inaccurate segmentation.</p>
              </div>
              <div className="p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg">
                <h4 className="font-semibold text-indigo-800">QueryScope Solution: Automated & Reliable</h4>
                <p className="text-sm text-indigo-700 mt-1">Automated processing eliminates manual errors. The logic is consistently applied based on your exact brand regex pattern.</p>
              </div>
            </div>
            
             {/* Point 4: Time vs Speed */}
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg">
                <h4 className="font-semibold text-red-800">Manual Pain Point: Time Consuming</h4>
                <p className="text-sm text-red-700 mt-1">The entire manual process can take significant time, especially if repeated regularly or for multiple clients.</p>
              </div>
              <div className="p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg">
                <h4 className="font-semibold text-indigo-800">QueryScope Solution: Fast Results</h4>
                <p className="text-sm text-indigo-700 mt-1">Get your complete branded vs. non-branded breakdown and visualizations in seconds or minutes, not hours.</p>
              </div>
            </div>

          </section>
          {/* Fin Section Avantage */}

          <hr className="my-10 border-gray-200"/>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Who It's For</h2>
            <p className="text-gray-600 leading-relaxed">QueryScope is designed for SEO-minded professionals and organizations who want deeper insights from Search Console. Key users include:</p>
            <ul className="list-disc list-outside space-y-2 pl-6 text-gray-600 leading-relaxed">
              <li>SEO Professionals & Consultants: Easily segment client or company search data to show the value of SEO work beyond brand searches. This tool saves time in preparing reports and unearths insights that impress clients.</li>
              <li>Digital Marketing Agencies: Incorporate branded vs. non-branded breakdowns in your reporting dashboards for clients. QueryScope provides a quick, reliable way to get these numbers without manual exports or complex data studio formulas.</li>
              <li>In-House SEO Managers: Monitor the health of your website's organic traffic. For enterprise or e-commerce brands, quickly gauge how much of your traffic is driven by brand recognition versus generic discovery.</li>
              <li>E-commerce Brands & CMOs: Understand the balance between brand-driven demand and organic search discovery. This helps in attributing revenue – e.g., knowing if an uplift in organic sales came from people actively seeking your brand or from improved search rankings on generic product terms.</li>
              <li>Content Marketers & Strategists: Validate if content efforts are bringing in non-branded traffic. If you're investing in blogs or SEO content, QueryScope will show if those efforts result in more new search visitors (non-branded clicks) over time.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">Essentially, anyone who uses Google Search Console and cares about the distinction between branded vs non-branded organic traffic will find QueryScope valuable. Whether you're a freelance SEO auditing a small site or part of an agency managing dozens of clients, QueryScope simplifies a task that would otherwise require tedious filtering or scripting.</p>
          </section>

          <hr className="my-10 border-gray-200"/>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Key Features</h2>
            <p className="text-gray-600 leading-relaxed">QueryScope focuses on delivering a fast, focused analysis of your GSC query data. Its key features include:</p>
            <ul className="list-disc list-outside space-y-2 pl-6 text-gray-600 leading-relaxed">
              <li>Branded vs. Non-Branded Segmentation: Automatically categorize all search queries from GSC into Branded or Non-Branded buckets based on a custom brand keyword pattern you provide. This catches exact brand names as well as variations (misspellings, spacing, capitalization differences, etc.).</li>
              <li>Simple GSC Integration: Connect using your Google Search Console API credentials (a JSON key for a service account). No complicated setup or third-party data sharing – your data is fetched securely directly from Google's API. (No GSC API enabled yet? QueryScope will guide you to get your key and permissions.)</li>
              <li>Date Range Selection: Choose a date range for analysis, up to 16 months of data (the maximum GSC allows). You can analyze last month, last 3 months, or the full past year+ to understand long-term trends. (Data is fetched up to the previous day, since GSC provides data up to yesterday.)</li>
              <li>Comprehensive Query Coverage: QueryScope pulls all available queries from GSC via the API, beyond the 1,000-row limit you see in the GSC web interface. It uses automatic pagination to retrieve large datasets, so even sites with tens of thousands of queries will be analyzed. This ensures your segmentation is based on as complete data as Google can provide.</li>
              <li>Interactive Dashboard & Visualization: Once processed, QueryScope presents a clear summary of total clicks split by branded vs non-branded. You'll see the absolute number of clicks in each category and the percentage share of each. A responsive pie chart visualization makes the split instantly understandable at a glance.</li>
              <li>One-Click Exports: Easily download your results for further analysis or reporting. Export a CSV file containing every query with its click count and whether it was classified as Branded or Non-Brand. You can also export the pie chart as an image (PNG) to paste into presentations or reports. This way you can share the findings with colleagues or clients in a clean format.</li>
              <li>No Account Required (Frictionless Use): QueryScope is designed to be lightweight and fast. In its current version, there's no need to create an account or store data in a database – you simply upload your key, run the analysis, and get results. (Nothing is permanently stored, ensuring privacy and security for your data.)</li>
              <li>Fast Processing: The tool is optimized for speed. Even with large datasets, the backend efficiently fetches and processes data using robust libraries (under the hood, it's powered by Python/Pandas for data crunching). This means you get your segmentation results in moments, not hours.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">Each of these features is geared toward saving you time and providing actionable insights quickly. QueryScope combines the heavy lifting of data retrieval with smart query classification, all in a user-friendly interface.</p>
          </section>

          <hr className="my-10 border-gray-200"/>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">How It Works</h2>
            <p className="text-gray-600 leading-relaxed">Using QueryScope is straightforward and doesn't require technical expertise beyond having access to your Search Console data. Here's a step-by-step look at how it works:</p>
            <ol className="list-decimal list-outside space-y-3 pl-6 text-gray-600 leading-relaxed">
              <li>Connect Your GSC Data: When you open QueryScope, you'll be prompted to provide access to your Google Search Console data. This is done by uploading a Google Cloud JSON key for a service account that has access to your site's GSC property. (If you're not sure how to get this, the tool's onboarding will explain the process – essentially you create a service account in Google Cloud, grant it access to your Search Console property, and download the key file.) This authentication method is secure and ensures QueryScope can fetch your data directly from Google.</li>
              <li>Configure Your Analysis: Next, specify the parameters for the analysis. You will enter a date range – select a start date and end date for the period you want to analyze. QueryScope allows up to 16 months of data in one go (which is the maximum range GSC's API supports). For example, you might choose January 1, 2024 – April 30, 2025 to cover nearly 16 months. Then, input your brand query pattern. This is usually your brand name and common variations, which the tool will use to identify branded queries. You can enter a simple word (e.g., "Apple") or a more complex regular expression for multiple terms (e.g., apple|iphone|macbook if your brand has several forms). QueryScope will validate this pattern to make sure it's a valid regex and not empty (since it's required to distinguish brand queries).</li>
              <li>Run the Segmentation: After configuration, hit the analyze button. QueryScope will connect to the GSC API behind the scenes and pull in all search query data for your site within the chosen date range. It fetches the data in batches (ensuring even large sites with many queries are fully retrieved). As data comes in, the tool applies the brand filter you provided: every query is checked against your brand regex. Queries that match the pattern are tagged as "Branded", and those that don't match are tagged as "Non-Branded". The tool then aggregates the total clicks for each group. Both the raw counts and percentage share of branded vs non-branded clicks are computed. (This calculation is very fast – even if there are tens of thousands of queries, QueryScope crunches them efficiently.)</li>
              <li>
                View Your Results: Within seconds, you'll see the results displayed on the QueryScope dashboard. At the top, a summary might read, for example: "Total Clicks Analyzed: 10,000", followed by "Branded Clicks: 4,000 (40%)" and "Non-Branded Clicks: 6,000 (60%)" This gives you an immediate sense of the breakdown. Just below the summary, a visual pie chart is shown, with one slice representing branded clicks and the other representing non-branded. The chart is typically color-coded and labeled for clarity (e.g., Violet for Branded, Indigo for Non-Branded, with percentage labels on each slice). You can hover on the chart (if in an interactive interface) to see exact values.
                
                {/* Mini Graphique d'Exemple Ajouté Ici */}
                <div className="my-6 flex justify-center">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={exampleChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70} // Plus petit rayon
                          fill="#8884d8"
                          dataKey="value"
                          stroke="#ffffff" // Bordure blanche entre les parts
                          strokeWidth={2}
                        >
                          {exampleChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string, props: any) => [
                            `${value.toLocaleString()} clicks (${props.payload.percentage.toFixed(0)}%)`,
                            name
                          ]}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb', // Bordure légère
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            padding: '8px 12px',
                            fontSize: '0.875rem' // Taille de police tooltip
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                 {/* Fin Mini Graphique */}
              </li> 
            </ol>
            <figure className="mt-6 p-4 border rounded-md bg-gray-50 text-center">
                <figcaption className="text-sm text-gray-500 mb-2 italic">Example output description</figcaption>
                <p className="text-gray-600 leading-relaxed text-sm mt-2">For example, QueryScope might reveal that out of 10,000 total organic clicks last month, 4,000 came from branded queries and 6,000 from non-branded queries (represented visually above). This visual makes it easy to communicate the ratio to others – even someone not familiar with the data can see that "the majority of our traffic is from non-branded searches" in this case.</p>
            </figure>
            <ol start={5} className="list-decimal list-outside space-y-3 pl-6 text-gray-600 leading-relaxed">
               <li>Drill-down and Export: If you're interested in the details behind the summary, QueryScope provides options to dig deeper. You can download a CSV export that lists every query from the analysis, alongside its total clicks and whether it was classified as Branded or Non-Branded. This is useful if you want to see which queries are driving branded traffic (e.g., specific product names or misspellings people use for your brand) versus the top non-brand queries bringing in new visitors. Additionally, you can export the pie chart as an image (PNG) with a single click. This image can be used in presentations or reports. Because the chart is already labeled with percentages and categories, it serves as a quick snapshot of your branded vs non-branded performance.</li>
            </ol>
            <p className="text-gray-600 leading-relaxed">That's it – no complex setup, no manual data wrangling. In summary, you connect QueryScope to GSC, define your brand terms and date range, and within moments get a clear breakdown of your search queries. The tool handles all the heavy lifting (API calls, data parsing, regex matching, math) in the background, presenting you with just the insights you need.</p>
          </section>

          <hr className="my-10 border-gray-200"/>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Use Cases</h2>
            <p className="text-gray-600 leading-relaxed">To better illustrate how QueryScope can be applied in real-world scenarios, here are a few common use cases and examples:</p>
            <ul className="list-disc list-outside space-y-3 pl-6 text-gray-600 leading-relaxed">
              <li>Monthly SEO Reporting: You're an SEO specialist preparing a monthly report for a client (or your boss). Instead of just reporting "we got 10k organic clicks this month," you use QueryScope to show that "6k were non-branded (new users via generic searches) and 4k were branded (people searching our brand)." This added context demonstrates the quality of traffic. Before QueryScope, you might have spent hours exporting data and applying filters in Excel to get these numbers. After QueryScope, it takes a minute to get the chart and stats, improving your reporting accuracy and efficiency.</li>
              <li>Evaluating Brand Campaigns vs. SEO Efforts: Imagine your marketing team ran a big brand awareness campaign (TV ads, billboards, etc.) in June. In July, you see a surge in GSC clicks. Using QueryScope, you discover that branded queries shot up significantly (meaning many people searched your brand after seeing the campaign), while non-branded queries remained flat. This tells you the traffic bump was due to offline marketing, not necessarily SEO. Conversely, if non-branded clicks grew, it could indicate your SEO content and link-building work are paying off. Use Case Example: An e-commerce brand finds that after a Super Bowl ad, branded searches for their company name doubled – QueryScope quantifies this, so the SEO team can clearly attribute that spike to the ad (and not mistakenly to their optimizations).</li>
              <li>Content Strategy and Opportunity Identification: As a content marketer, you've been targeting certain informational keywords with new blog posts. Over a quarter, you want to see if those efforts brought in more non-branded traffic. QueryScope shows that the share of non-branded clicks grew from 50% to 65% of total organic traffic since you started the content project – a positive sign that more people are discovering the site via generic queries. You can even inspect the CSV export to see which non-branded queries increased the most (perhaps the very topics you wrote about). This helps validate your content strategy and decide on next topics to target.</li>
              <li>Agency Multi-Client Management: If you're an agency managing SEO for multiple clients, you likely need to separate brand vs non-brand traffic for each client's reporting. QueryScope can be used for each client's GSC property by plugging in their credentials and brand pattern. For example, for Client A (a fashion retailer), you run QueryScope using brand regex "FashionistaCo" and find 30% branded traffic. For Client B (a SaaS product), using brand regex "TechSuite|techsuite.com", you find 80% branded traffic. This comparison might tell you that Client B's organic growth potential lies in increasing non-brand reach (since they rely heavily on brand searches currently), whereas Client A is already getting a large portion of non-brand traffic. Such insights help tailor your SEO approach for each client and communicate success or areas for improvement clearly.</li>
              <li>Diagnosing Traffic Drops or Spikes: When you notice a sudden change in organic traffic, QueryScope can help diagnose it. For instance, if organic clicks dropped in a given week, QueryScope might reveal that non-branded clicks fell while branded remained steady – possibly indicating a loss of rankings or visibility for generic terms. Alternatively, if branded dropped, perhaps there's a brand perception issue or a tracking glitch. Having this segmentation can point you in the right direction faster. Another example: a startup observes a gradual increase in branded searches month over month – QueryScope confirms this trend, suggesting growing brand awareness (which might encourage the marketing team to continue their PR campaigns).</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">These use cases show how QueryScope is not just a one-off novelty tool, but a practical part of ongoing SEO analysis and decision-making. In each scenario, the tool provides clarity that leads to an action: whether it's adjusting strategy, proving the value of work, or investigating further. The ability to quickly toggle between a high-level overview (percentages of brand vs non-brand) and the granular details (specific queries list) means both strategists and hands-on analysts benefit from the tool.</p>
          </section>

          <hr className="my-10 border-gray-200"/>

          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Limitations</h2>
            <p className="text-gray-600 leading-relaxed">While QueryScope is incredibly useful, it's important to understand its limitations and the context of the data it provides:</p>
            <ul className="list-disc list-outside space-y-3 pl-6 text-gray-600 leading-relaxed">
              <li>
                Google Data Sampling & Omission: Google Search Console does not always report all queries, especially those with extremely low volumes or those filtered for privacy. This means the data QueryScope analyzes is an extensive sample of your traffic, but it may not include every single long-tail query. 
                
                {/* GSC Sampling Schema - English */}
                <div className="my-4 p-3 border border-gray-200 rounded-lg bg-gray-50 text-xs text-center">
                  <div className="font-medium text-gray-600 mb-2">GSC Sampling Concept</div>
                  <div className="relative border-2 border-dashed border-gray-400 p-6 rounded">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-1 text-gray-500">All Searches</span>
                    <div className="border border-blue-300 bg-blue-50 p-3 rounded">
                      <span className="text-blue-800">Data Reported by GSC API</span>
                    </div>
                    <div className="absolute -bottom-2 right-2 bg-gray-50 px-1 text-gray-500 italic">Difference = Sampling & Privacy</div>
                  </div>
                </div>
                {/* End Schema */}

                In practice, you might notice that if you add branded and non-branded clicks from QueryScope, the sum can be slightly lower than the total clicks reported in GSC's overview. Google's own documentation notes that filtering by queries (e.g., using "contains" or regex filters) might not capture 100% of the total, so filtered totals may not equal the unfiltered total. Implication: The percentages and numbers are accurate for the data retrieved, but consider them an approximation of the true total distribution. They are usually very close, but minor discrepancies are normal due to GSC's data aggregation methods.
              </li>
              <li>Regex Pattern Accuracy: QueryScope's classification is only as good as the brand regex pattern you provide. If your regex is too broad or mis-specified, you might misclassify some queries. For example, if your brand is "Apple" but you also sell products that include the term "Apple" as part of a common phrase unrelated to your brand (e.g. "apple pie recipe"), those might be falsely tagged as branded unless your pattern is specific. Conversely, if your brand has multiple variations and you forget to include one in the pattern (e.g., you miss 'mac book' with a space), some branded queries will slip into the non-branded count. Recommendation: Double-check your brand pattern and consider common misspellings or spacing (e.g., "iphone" vs "i phone" vs "apple phone"). You can refine the regex as needed and rerun the analysis – QueryScope will quickly recompute the segmentation with the updated pattern.</li>
              <li>Requires GSC Access (Service Account): To use QueryScope, you must have Google Search Console access to the site in question and be able to set up a service account key. For most SEO professionals this is standard, but for beginners it could be a small hurdle. There's no OAuth login flow in the current version – the tool specifically uses the JSON key method. This is a deliberate design choice for a secure, accountless experience, but it does mean the user has to go through a few steps to obtain the key. Detailed instructions are provided, and it's generally a one-time setup. Just be aware that without GSC property access, QueryScope cannot fetch any data.</li>
              <li>Focus on Clicks (Not Impressions/CTR): QueryScope V0 is centered on segmenting clicks by query type. It does not separately analyze impressions, click-through rate (CTR), or average position by branded vs non-branded (at least, not in the current version). It simply takes whatever queries and click counts GSC provides and splits them. If you need to analyze impressions or CTR differences between branded and non-branded queries, you would need to do a more custom analysis (which might be a feature in a future version). Similarly, QueryScope doesn't currently break down data by other dimensions like country, device, or page – it's purely query-focused segmentation. The tool's simplicity is its strength, but it means it's specialized for that one job.</li>
              <li>Real-Time Data & Frequency: GSC data is typically updated daily, not in real-time. QueryScope uses the data available up to yesterday (the latest full day). If you run QueryScope frequently (say daily or weekly), you'll likely see incremental changes. But it's not a tool for minute-by-minute analytics – it relies on GSC's dataset. Also, note that GSC limits the number of API queries per day per site; QueryScope stays within these limits under normal use, but if you were to run an extremely large number of analyses for the same site in a short period, you might hit Google's quota. This is rarely an issue (as one analysis already pulls all needed data in one go), but it's good to be aware of general API use limits.</li>
              <li>Segment Interpretation (Edge Cases): For some websites, the line between branded and non-branded might blur. For example, if your brand name is a common word (say your company is called "Orange"), then queries like "orange fruit benefits" would be non-branded (nothing to do with the company), while "Orange electronics store" would be branded. QueryScope can technically separate these if you craft the regex well (maybe using word boundaries or additional terms), but interpreting such cases might be tricky. Always combine QueryScope's quantitative output with your qualitative understanding of your brand and search landscape. In other words, use the tool as an aid, but apply human judgment for ambiguous cases.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">Despite these limitations, QueryScope remains a powerful ally for SEO data analysis. Most of the limitations are either inherent to the data source (GSC) or conscious trade-offs for a streamlined tool. Knowing these boundaries will help you use QueryScope effectively and interpret its results correctly. If anything, these limitations highlight why having human expertise on top of the tool is valuable – you bring the context, QueryScope brings the data clarity.</p>
          </section>
          
          <div className="border-t pt-8 mt-12 border-gray-200">
            <p className="text-center text-gray-600 italic">We hope this documentation has provided a clear understanding of what QueryScope is, why it's valuable, and how to make the most of it. By segmenting your search queries into branded and non-branded, you unlock a new level of insight into your SEO performance and audience behavior. Whether you're using it for high-level strategy or day-to-day reporting, QueryScope is here to save you time and enhance your decision-making with accurate data. Happy analyzing, and may your organic traffic grow (in the non-branded way)!</p>
          </div>

           {/* Bouton Retour */}
          <div className="mt-12 text-center">
            <Link href="/" legacyBehavior>
              <a className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 no-underline text-sm font-medium">&larr; Back to App</a>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
} 