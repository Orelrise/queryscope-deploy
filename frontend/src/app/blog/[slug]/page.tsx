'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import postsData from '@/blog/posts.json';
import Header from '@/components/Header';
import TableOfContents from '@/components/blog/TableOfContents';

// Define the interface for a blog post based on posts.json
interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string; // Keep for type consistency, even if not used here
  content: string;
}

// Cast the imported JSON data to the Post array type
const posts: Post[] = postsData as Post[];

// Function to get post data based on slug
// Ensures the return type is correctly typed or undefined
function getPostBySlug(slug: string): Post | undefined {
  // Ensure posts is treated as an array of Post objects
  return posts.find((post: Post) => post.slug === slug);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  // If post not found, trigger 404 using Next.js notFound utility
  if (!post) {
    notFound();
     // It's good practice to return null here although notFound should stop execution
    return null;
  }

  // Filter out the current post to get related posts
  const relatedPosts = posts.filter((p: Post) => p.slug !== params.slug);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-gray-500">
              {/* Changed date format to en-US and text */}
              Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          {/* Insert the Table of Contents component here */}
          <TableOfContents content={post.content} />

          {/* Use prose for nice article formatting - ensure Tailwind typography plugin is installed */}
          <div
            className="prose prose-lg max-w-none prose-indigo prose-a:text-purple-600 hover:prose-a:text-purple-800 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            {/* Removed legacyBehavior from Link and used a span inside */}
            <Link href="/blog">
              <span className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors cursor-pointer">
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                {/* Changed text to English */}
                Back to Blog
              </span>
            </Link>
          </div>
        </article>

        {/* Related Articles Section - Enhanced Styling */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t-2 border-gray-100">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">Related Articles</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                // Enhanced related post card styling
                <div key={relatedPost.slug} className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow duration-200 flex flex-col">
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <span className="cursor-pointer">{relatedPost.title}</span>
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm flex-grow">{relatedPost.excerpt}</p>
                    <Link href={`/blog/${relatedPost.slug}`} className="mt-3 self-start">
                       <span className="inline-flex items-center text-sm text-purple-600 group-hover:text-purple-800 font-medium transition-colors duration-200">
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
       <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-6 text-center text-sm text-gray-500">
        <p>© QueryScope 2025</p>
      </footer>
    </div>
  );
}
