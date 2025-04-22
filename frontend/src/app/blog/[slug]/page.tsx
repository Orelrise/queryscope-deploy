import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import TableOfContents from '@/components/blog/TableOfContents';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

const postsDirectory = path.join(process.cwd(), 'src/blog/posts');

// Define interface for post metadata (used for related posts)
interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

// Define interface for full post data (frontmatter + content)
interface PostData extends PostMetadata {
  content: string;
}

// Function to get all post metadata (needed for related posts)
// Duplicated from blog/page.tsx logic for encapsulation here
function getAllPostMetadata(): PostMetadata[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const markdownPosts = fileNames.filter((fn) => fn.endsWith('.mdx'));
  
  const posts = markdownPosts.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title || 'Untitled',
      date: matterResult.data.date || new Date().toISOString(),
      excerpt: matterResult.data.excerpt || '',
      slug: matterResult.data.slug || fileName.replace(/\.mdx$/, ''),
    };
  });
  // Sort posts by date, newest first, to potentially show recent related posts
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);
  const paths = fileNames
    .filter((fn) => fn.endsWith('.mdx'))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }));
  return paths;
}

// Function to get post data based on slug from MDX file
function getPostBySlug(slug: string): PostData | undefined {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (!data.title || !data.date || !data.slug || !content) {
      console.warn(`Missing frontmatter or content in ${slug}.mdx`);
      return undefined;
    }

    return {
      slug: data.slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || '',
      content: content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return undefined;
  }
}

// The Page component is now async
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get metadata for all posts to find related ones
  const allPostsMetadata = getAllPostMetadata();
  const relatedPosts = allPostsMetadata
    .filter((p) => p.slug !== post.slug) // Exclude current post
    .slice(0, 2); // Take the first 2 other posts

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose lg:prose-lg max-w-none dark:prose-invert">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Created by Aurelien</p>
          </header>

          <TableOfContents content={post.content} />

          <div
            className="prose prose-lg max-w-none prose-indigo dark:prose-invert prose-a:text-purple-600 hover:prose-a:text-purple-800 dark:prose-a:text-purple-400 dark:hover:prose-a:text-purple-300 prose-strong:font-semibold"
          >
            <MDXRemote source={post.content} />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-700">
            <Link href="/blog">
              <span className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors cursor-pointer">
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Blog
              </span>
            </Link>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t-2 border-gray-100 dark:border-neutral-800">
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800 dark:text-neutral-200 mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.slug} className="rounded-lg p-1 bg-gradient-to-r from-primary to-secondary shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-white dark:bg-neutral-900 rounded-md p-5 flex flex-col flex-grow h-full">
                    <h3 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-200 group-hover:text-purple-700 transition-colors duration-200">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <span className="cursor-pointer">{relatedPost.title}</span>
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow mb-3">{relatedPost.excerpt}</p>
                    <Link href={`/blog/${relatedPost.slug}`} className="mt-auto self-start">
                       <span className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 group-hover:text-purple-800 dark:group-hover:text-purple-300 font-medium transition-colors duration-200">
                         Read more
                         <svg className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                       </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
       <footer className="bg-gray-50 dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 mt-16 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© QueryScope 2025</p>
        <p className="mt-1">
          Created by <a href="https://www.linkedin.com/in/aur%C3%A9lien-pringarbe-4b57561b0/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Aurélien Pringarbe</a>
        </p>
      </footer>
    </div>
  );
}
