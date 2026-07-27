'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser-client';

interface NavbarUserProps {
  user: any;
  loginText: string;
  logoutText: string;
}

export default function NavbarUser({ user, loginText, logoutText }: NavbarUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const avatarUrl = user?.user_metadata?.avatar_url;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.refresh();
  };

  if (!user) {
    return (
      <Link 
        href="/login" 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-mosque/10 hover:bg-mosque/20 text-mosque dark:text-emerald-400 font-medium text-sm transition-all duration-200 ml-2"
      >
        <span className="material-icons text-lg">login</span>
        <span>{loginText}</span>
      </Link>
    );
  }

  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative shadow-sm">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt={userName || "Profile"} 
              fill
              className="object-cover"
            />
          ) : (
            <span className="material-icons text-gray-500 flex items-center justify-center w-full h-full text-lg">
              person
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#152e2a] rounded-2xl shadow-xl border border-gray-100 dark:border-primary/20 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <p className="text-sm font-semibold text-nordic dark:text-white truncate">
              {userName}
            </p>
            <p className="text-xs text-nordic/60 dark:text-gray-400 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
            >
              <span className="material-icons text-lg">logout</span>
              <span>{logoutText}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
