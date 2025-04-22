'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  const linkClasses = (path: string) => 
    `px-3 md:px-4 py-2 rounded-md text-lg md:text-xl font-medium transition-colors duration-200 ${
      pathname === path 
        ? 'bg-gradient-to-r from-primary to-secondary text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white shadow-sm mb-8 sticky top-0 z-40">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center">
             {/* Optional: Add Logo/Brand Name here if desired */}
             <Link href="/" legacyBehavior>
               <a className="text-xl md:text-3xl font-bold text-gray-900 hover:text-primary transition-colors">
                 Query<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Scope</span>
               </a>
             </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" legacyBehavior>
              <a className={linkClasses('/')}>
                Home
              </a>
            </Link>
            <Link href="/blog" legacyBehavior>
               <a className={linkClasses('/blog')}>
                 Blog
               </a>
            </Link>
             {/* Add other links here if needed */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 