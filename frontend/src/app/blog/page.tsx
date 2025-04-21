'use client';

import Link from 'next/link';
import posts from '@/blog/posts.json';
import Header from '@/components/Header';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export default function BlogPage() {
  // Sort posts by date, newest first
  const sortedPosts: Post[] = [...posts].sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-800">Blog</h1>
        <p className="text-center text-gray-600 mb-12 text-lg">Insights, guides, and updates from the QueryScope team.</p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post: Post) => (
            <div key={post.slug} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group border border-transparent hover:border-indigo-300 hover:shadow-lg transition-all duration-300 ease-in-out">
              <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100"></div> 
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl lg:text-2xl font-semibold mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="cursor-pointer">{post.title}</span>
                  </Link>
                </h2>
                <p className="text-gray-500 text-sm mb-4">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>
                  <span className="inline-flex items-center text-indigo-500 group-hover:text-indigo-700 font-medium transition-colors duration-200">
                    Read more
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>© QueryScope 2025</p>
      </footer>
    </div>
  );
} 