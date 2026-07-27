'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser-client';
import { useEffect, useState } from 'react';

export default function AdminNavbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getUser();
  }, []);

  const isPropertiesActive = pathname === '/admin/properties' || pathname === '/admin';
  const isUsersActive = pathname === '/admin/users';

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#152e2a] border-b border-primary/10 dark:border-primary/20 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Primary Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-white text-xl">apartment</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-nordic dark:text-white">LuxeEstate</span>
            </Link>

            <div className="hidden md:flex md:space-x-8">
              <Link
                href="/admin/properties"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isPropertiesActive
                    ? 'border-primary text-nordic dark:text-white font-semibold'
                    : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30 dark:text-gray-400'
                }`}
              >
                Properties
              </Link>
              <Link
                href="/admin/users"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isUsersActive
                    ? 'border-primary text-nordic dark:text-white font-semibold'
                    : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30 dark:text-gray-400'
                }`}
              >
                Users & Roles
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-primary hover:border-primary/30 transition-colors dark:text-gray-400"
              >
                Public Site ↗
              </Link>
            </div>
          </div>

          {/* Secondary Nav / Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors">
              <span className="material-icons text-xl">notifications_none</span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-nordic dark:text-white truncate max-w-[140px]">
                  {currentUser?.email?.split('@')[0] || 'Admin User'}
                </span>
                <span className="text-xs text-primary dark:text-emerald-400 font-semibold uppercase">Administrator</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/20 text-primary dark:text-emerald-300 font-bold text-sm flex items-center justify-center ring-2 ring-white dark:ring-primary/20">
                {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
