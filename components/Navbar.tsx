import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { getDictionary, getCurrentLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const dictionary = await getDictionary();
  const currentLocale = await getCurrentLocale();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-nordic-dark/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark dark:text-white">LuxeEstate</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1">
              {dictionary.Navbar.buy}
            </Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">
              {dictionary.Navbar.rent}
            </Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">
              {dictionary.Navbar.sell}
            </Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">
              {dictionary.Navbar.savedHomes}
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <LanguageSelector currentLocale={currentLocale} dictionary={dictionary.Language} />
            <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>
            {user ? (
              <button className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 ml-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative">
                  {avatarUrl ? (
                    <Image 
                      src={avatarUrl} 
                      alt="Profile" 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="material-icons text-gray-500 flex items-center justify-center w-full h-full">person</span>
                  )}
                </div>
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 ml-2">
                <span className="text-sm font-medium hover:text-mosque transition-colors">Log In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu Placeholder */}
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light dark:bg-background-dark overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10">{dictionary.Navbar.buy}</Link>
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{dictionary.Navbar.rent}</Link>
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{dictionary.Navbar.sell}</Link>
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{dictionary.Navbar.savedHomes}</Link>
        </div>
      </div>
    </nav>
  );
}
