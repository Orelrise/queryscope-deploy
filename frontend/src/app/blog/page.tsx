import Link from 'next/link';
import Header from '@/components/Header';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Update the Post interface if needed (content is no longer directly here)
interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

// Function to get all post metadata
function getPostMetadata(): PostMetadata[] {
  const postsDirectory = path.join(process.cwd(), 'src/blog/posts'); // Adjusted path
  const fileNames = fs.readdirSync(postsDirectory);
  const markdownPosts = fileNames.filter((fn) => fn.endsWith('.mdx'));
  
  const posts = markdownPosts.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      excerpt: matterResult.data.excerpt,
      slug: matterResult.data.slug, // Ensure slug is in frontmatter
    };
  });

  return posts;
}

export default function BlogPage() {
  const postMetadata = getPostMetadata();
  // Sort posts by date, newest first
  const sortedPosts = [...postMetadata].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-gray-900">
      <Header />

      {/* Enhanced Blog Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 dark:from-blue-900 via-gray-50 dark:via-neutral-950 to-green-50 dark:to-green-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight mb-6">
            Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">QueryScope Blog</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-neutral-300 max-w-3xl mx-auto">
            Discover actionable insights, practical guides, and the latest updates on non-brand SEO analysis.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* Map over sortedPosts which now contains metadata */} 
          {sortedPosts.map((post) => (
            <div key={post.slug} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden flex flex-col group border border-transparent hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300 ease-in-out">
              {/* Optional: Add image based on frontmatter if available */}
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900"></div> 
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-3 text-gray-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  <Link href={`/blog/${post.slug}`}>
                    {/* Use post.title from metadata */}
                    <span className="cursor-pointer">{post.title}</span>
                  </Link>
                </h2>
                {/* Use post.date from metadata */}
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                {/* Added Author Line */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Created by Aurelien</p>
                {/* Use post.excerpt from metadata */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>
                  <span className="inline-flex items-center text-blue-500 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-medium transition-colors duration-200">
                    Read more
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© QueryScope 2025</p>
        <p className="mt-1">
          Created by <a href="https://www.linkedin.com/in/aur%C3%A9lien-pringarbe-4b57561b0/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Aurélien Pringarbe</a>
        </p>
      </footer>
    </div>
  );
} 