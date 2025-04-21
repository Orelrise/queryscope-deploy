'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import postsData from '@/blog/posts.json';
// Removed Header import, re-add with correct path if needed: import Header from '@/components/Header'; 

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
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
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

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            {/* Changed heading to English */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.slug} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <span className="hover:text-purple-600 cursor-pointer">{relatedPost.title}</span>
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
       <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500 pb-8">
        <p>© QueryScope 2025</p>
      </footer>
    </div>
  );
}
