"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchFiltersModal({ isOpen, onClose }: SearchFiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("query") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "1,200,000");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "4,500,000");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "Any Type");
  const [beds, setBeds] = useState(parseInt(searchParams.get("beds") || "0", 10));
  const [baths, setBaths] = useState(parseInt(searchParams.get("baths") || "0", 10));

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setLocation(searchParams.get("query") || "");
      setMinPrice(searchParams.get("minPrice") || "1,200,000");
      setMaxPrice(searchParams.get("maxPrice") || "4,500,000");
      setPropertyType(searchParams.get("propertyType") || "Any Type");
      setBeds(parseInt(searchParams.get("beds") || "0", 10));
      setBaths(parseInt(searchParams.get("baths") || "0", 10));
    }
  }, [isOpen, searchParams]);

  if (!isOpen) return null;

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (location) params.set("query", location);
    else params.delete("query");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (propertyType && propertyType !== "Any Type") params.set("propertyType", propertyType);
    else params.delete("propertyType");

    if (beds > 0) params.set("beds", beds.toString());
    else params.delete("beds");

    if (baths > 0) params.set("baths", baths.toString());
    else params.delete("baths");

    // reset to page 1 on search
    params.delete("page");

    router.push(`/?${params.toString()}`);
    onClose();
  };

  const handleClearAll = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("Any Type");
    setBeds(0);
    setBaths(0);
    router.push("/");
    onClose();
  };

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Main Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <main className="pointer-events-auto relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <header className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Filters</h1>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              <span className="material-icons">close</span>
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
            {/* Section 1: Location */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Location</label>
              <div className="relative group">
                <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-filter-primary transition-colors">location_on</span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-background-light dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-filter-primary focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm" 
                  placeholder="City, neighborhood, or address" 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </section>

            {/* Section 2: Price Range */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price Range</label>
                <span className="text-sm font-medium text-filter-primary">${minPrice} – ${maxPrice}</span>
              </div>
              <div className="relative h-12 flex items-center mb-6 px-2">
                <div className="absolute w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-filter-primary w-1/3 ml-[20%]"></div>
                </div>
                <div className="absolute left-[20%] w-6 h-6 bg-white border-2 border-filter-primary rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
                <div className="absolute left-[53%] w-6 h-6 bg-white border-2 border-filter-primary rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-light dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-filter-primary/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Min Price</label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input 
                      className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm focus:outline-none" 
                      type="text" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-background-light dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-filter-primary/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Max Price</label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input 
                      className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm focus:outline-none" 
                      type="text" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Property Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Type */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Type</label>
                <div className="relative">
                  <select 
                    className="w-full bg-background-light dark:bg-gray-800 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-filter-primary focus:outline-none cursor-pointer"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option>Any Type</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Condo</option>
                    <option>Townhouse</option>
                    <option>Villa</option>
                    <option>Penthouse</option>
                  </select>
                  <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-4">
                {/* Beds */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bedrooms</span>
                  <div className="flex items-center space-x-3 bg-background-light dark:bg-gray-800 rounded-full p-1">
                    <button 
                      onClick={() => setBeds(Math.max(0, beds - 1))}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-filter-primary disabled:opacity-50 transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{beds > 0 ? `${beds}+` : "Any"}</span>
                    <button 
                      onClick={() => setBeds(beds + 1)}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-filter-primary hover:bg-filter-primary hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>

                {/* Baths */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bathrooms</span>
                  <div className="flex items-center space-x-3 bg-background-light dark:bg-gray-800 rounded-full p-1">
                    <button 
                      onClick={() => setBaths(Math.max(0, baths - 1))}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-filter-primary transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{baths > 0 ? `${baths}+` : "Any"}</span>
                    <button 
                      onClick={() => setBaths(baths + 1)}
                      className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-filter-primary hover:bg-filter-primary hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Amenities (Mock up for now) */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Amenities &amp; Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label className="cursor-pointer group relative">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="h-full px-4 py-3 rounded-lg border border-filter-primary bg-filter-primary/5 dark:bg-filter-primary/20 text-filter-primary dark:text-filter-primary-light font-medium text-sm flex items-center justify-center gap-2 transition-all peer-checked:bg-filter-primary/10 peer-checked:border-filter-primary peer-checked:text-filter-primary hover:bg-filter-primary/10">
                    <span className="material-icons text-lg">pool</span> Swimming Pool
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-filter-primary rounded-full opacity-100 transition-opacity hidden peer-checked:block"></div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 dark:hover:border-gray-600 peer-checked:border-filter-primary peer-checked:bg-filter-primary/5 peer-checked:text-filter-primary">
                    <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-filter-primary">fitness_center</span> Gym
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 dark:hover:border-gray-600 peer-checked:border-filter-primary peer-checked:bg-filter-primary/5 peer-checked:text-filter-primary">
                    <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-filter-primary">local_parking</span> Parking
                  </div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 dark:hover:border-gray-600 peer-checked:border-filter-primary peer-checked:bg-filter-primary/5 peer-checked:text-filter-primary">
                    <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-filter-primary">ac_unit</span> Air Conditioning
                  </div>
                </label>
                <label className="cursor-pointer group relative">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <div className="h-full px-4 py-3 rounded-lg border border-filter-primary bg-filter-primary/5 dark:bg-filter-primary/20 text-filter-primary dark:text-filter-primary-light font-medium text-sm flex items-center justify-center gap-2 transition-all peer-checked:bg-filter-primary/10 peer-checked:border-filter-primary peer-checked:text-filter-primary hover:bg-filter-primary/10">
                    <span className="material-icons text-lg">wifi</span> High-speed Wifi
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-filter-primary rounded-full opacity-100 transition-opacity hidden peer-checked:block"></div>
                </label>
                <label className="cursor-pointer group">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 dark:hover:border-gray-600 peer-checked:border-filter-primary peer-checked:bg-filter-primary/5 peer-checked:text-filter-primary">
                    <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-filter-primary">deck</span> Patio / Terrace
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
            <button 
              onClick={handleClearAll}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors underline decoration-gray-300 underline-offset-4"
            >
              Clear all filters
            </button>
            <button 
              onClick={handleApply}
              className="bg-filter-primary hover:bg-filter-primary/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-filter-primary/30 transition-all hover:shadow-filter-primary/40 flex items-center gap-2 transform active:scale-95 cursor-pointer"
            >
              Search Homes
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}
