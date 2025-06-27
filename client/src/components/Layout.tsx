import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth_context';
import { useApp } from '@/context/AppContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({
  children,
  title,
  showHeader = true,
  showFooter = true,
}: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useApp();
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {showHeader && (
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    Guild WoW
                  </Link>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <Link
                    href="/"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/') ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/guild"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/guild') ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'}`}
                  >
                    Create Guild
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name || 'User'}
                    </span>
                    <button
                      onClick={logout}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow">
        {title && (
          <div className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      {showFooter && (
        <footer className="bg-white dark:bg-gray-800 shadow-inner">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Guild WoW. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}