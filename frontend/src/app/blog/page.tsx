'use client';

import Link from 'next/link';
import posts from '@/blog/posts.json';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export default function BlogPage() {
  // Sort posts by date, newest first
  const sortedPosts: Post[] = [...posts].sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.map((post: Post) => (
          <div key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">
                <Link href={`/blog/${post.slug}`}>
                  <span className="hover:text-blue-600 cursor-pointer">{post.title}</span>
                </Link>
              </h2>
              <p className="text-gray-500 text-sm mb-4">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>
                <span className="text-blue-500 hover:text-blue-700 font-medium">Read more →</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 