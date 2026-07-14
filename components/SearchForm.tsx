"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchFiltersModal from "./SearchFiltersModal";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const currentPropertyType = searchParams.get("propertyType") || "All";

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const handleTypeToggle = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "All") {
      params.delete("propertyType");
    } else {
      params.set("propertyType", type);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
            search
          </span>
        </div>
        <input
          className="block w-full pl-12 pr-24 py-4 rounded-xl border-none bg-white dark:bg-white/5 text-nordic-dark dark:text-white shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-white/10 transition-all text-lg focus:outline-none"
          placeholder="Search by city, neighborhood, or address..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
        >
          Search
        </button>
      </form>

      <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
        {["All", "House", "Apartment", "Villa", "Penthouse"].map((type) => {
          const isActive = currentPropertyType === type || (type === "All" && !searchParams.get("propertyType"));
          return (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 hover:-translate-y-0.5"
                  : "bg-white dark:bg-white/5 border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
              }`}
            >
              {type}
            </button>
          );
        })}
        <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
        <button 
          onClick={() => setIsFiltersOpen(true)}
          className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <span className="material-icons text-base">tune</span> Filters
        </button>
      </div>

      <SearchFiltersModal 
        isOpen={isFiltersOpen} 
        onClose={() => setIsFiltersOpen(false)} 
      />
    </>
  );
}
