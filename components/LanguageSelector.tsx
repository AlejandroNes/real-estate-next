"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { setLocale } from "@/app/actions/locale-actions";

type LanguageSelectorProps = {
  currentLocale: string;
  dictionary: Record<string, string>;
};

export default function LanguageSelector({ currentLocale, dictionary }: LanguageSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLocale = (locale: string) => {
    setIsOpen(false);
    startTransition(() => {
      setLocale(locale);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-nordic-dark hover:text-mosque dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        disabled={isPending}
      >
        <div className="relative w-6 h-4.5 rounded-sm overflow-hidden shadow-sm">
          <Image 
            src={currentLocale === 'es' ? 'https://flagcdn.com/es.svg' : 'https://flagcdn.com/us.svg'} 
            alt={currentLocale} 
            fill 
            className="object-cover" 
          />
        </div>
        <span className="text-sm font-medium uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-lg bg-white dark:bg-background-dark shadow-xl border border-nordic-dark/10 dark:border-white/10 overflow-hidden z-50">
          <button
            onClick={() => changeLocale('es')}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-mosque/10 dark:hover:bg-white/10 cursor-pointer flex items-center gap-3 ${currentLocale === 'es' ? 'font-semibold text-mosque dark:text-white' : 'text-nordic-dark dark:text-gray-300'}`}
          >
            <div className="relative w-6 h-4.5 rounded-sm overflow-hidden shadow-sm flex-shrink-0">
              <Image src="https://flagcdn.com/es.svg" alt="Español" fill className="object-cover" />
            </div>
            {dictionary.es}
          </button>
          <button
            onClick={() => changeLocale('en')}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-mosque/10 dark:hover:bg-white/10 cursor-pointer flex items-center gap-3 ${currentLocale === 'en' ? 'font-semibold text-mosque dark:text-white' : 'text-nordic-dark dark:text-gray-300'}`}
          >
            <div className="relative w-6 h-4.5 rounded-sm overflow-hidden shadow-sm flex-shrink-0">
              <Image src="https://flagcdn.com/us.svg" alt="English" fill className="object-cover" />
            </div>
            {dictionary.en}
          </button>
        </div>
      )}
    </div>
  );
}
