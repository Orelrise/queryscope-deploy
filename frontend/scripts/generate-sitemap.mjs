import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // We need gray-matter to read frontmatter

const BASE_URL = 'https://queryscope.app';
const POSTS_DIR = path.join(process.cwd(), 'src/blog/posts');
const SITEMAP_PATH = path.join(process.cwd(), 'public/sitemap.xml');

// Helper function to get all post slugs and dates
function getPostDetails() {
  try {
    const fileNames = fs.readdirSync(POSTS_DIR);
    const postDetails = fileNames
      .filter((fn) => fn.endsWith('.mdx'))
      .map((fileName) => {
        try {
          const filePath = path.join(POSTS_DIR, fileName);
          const fileContents = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(fileContents);
          const slug = fileName.replace(/\.mdx$/, '');
          // Use the date from frontmatter, fallback to current date if missing
          const lastmod = data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          return { slug, lastmod };
        } catch (readError) {
          console.error(`Error reading frontmatter for ${fileName}:`, readError);
          return null; // Skip files with errors
        }
      });
    return postDetails.filter(detail => detail !== null); // Filter out nulls from errors
  } catch (dirError) {
    console.error('Error reading posts directory:', dirError);
    return []; // Return empty if directory reading fails
  }
}

async function generateSitemap() {
  console.log('Generating sitemap...');

  const postDetails = getPostDetails();

  // Define static pages (add more if needed)
  const staticPages = [
    { slug: '', lastmod: new Date().toISOString().split('T')[0], priority: '1.0' }, // Homepage
    { slug: 'blog', lastmod: new Date().toISOString().split('T')[0], priority: '0.8' } // Blog index page
    // Add other static pages like '/about', '/contact' here if they exist
  ];

  const sitemapEntries = staticPages.map(({ slug, lastmod, priority }) => `
  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);

  postDetails.forEach(({ slug, lastmod }) => {
    sitemapEntries.push(`
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq> 
    <priority>0.7</priority>
  </url>`);
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('')}
</urlset>`;

  try {
    fs.writeFileSync(SITEMAP_PATH, sitemapContent);
    console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);
  } catch (writeError) {
    console.error('Error writing sitemap file:', writeError);
  }
}

generateSitemap(); 