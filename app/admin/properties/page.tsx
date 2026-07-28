'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProperties } from '@/lib/supabase/properties';
import { Property } from '@/lib/supabase/types';
import { togglePropertyFeaturedAction } from '@/app/actions/admin-actions';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination State (6 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      const res = await getProperties({ page: 1, includeAll: true });
      setProperties(res.data);
      setLoading(false);
    }
    loadProperties();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggleFeatured = async (property: Property) => {
    const res = await togglePropertyFeaturedAction(property.id, property.isFeatured);
    if (res.success) {
      setProperties(prev =>
        prev.map(p => (p.id === property.id ? { ...p, isFeatured: res.newFeaturedState! } : p))
      );
      showNotification(`Propiedad "${property.title}" ${res.newFeaturedState ? 'marcada como destacada' : 'desmarcada'}`);
    } else {
      showNotification('Error al cambiar el estado de la propiedad', 'error');
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'featured') return matchesSearch && p.isFeatured;
    if (statusFilter === 'buy') return matchesSearch && p.transactionType === 'buy';
    if (statusFilter === 'rent') return matchesSearch && p.transactionType === 'rent';
    return matchesSearch;
  });

  const totalListings = properties.length;
  const activeCount = properties.filter(p => !p.isFeatured).length;
  const featuredCount = properties.filter(p => p.isFeatured).length;

  // Pagination logic
  const totalFiltered = filteredProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalFiltered);
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 backdrop-blur-md'
              : 'bg-red-950/90 border-red-500/40 text-red-200 backdrop-blur-md'
          }`}>
            <span className="material-symbols-outlined text-xl">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">My Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter properties..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic dark:text-gray-300 px-4 py-2.5 pl-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
          </div>
          <Link href="/admin/properties/new" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> Add New Property
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Listings</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{totalListings}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-icons">apartment</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Listings</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#D9ECC8] flex items-center justify-center text-primary">
            <span className="material-icons">check_circle</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Featured Properties</p>
            <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{featuredCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="material-icons">star</span>
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <span className="material-icons animate-spin text-3xl text-primary mb-2">sync</span>
            <p className="text-sm font-medium">Loading property portfolio...</p>
          </div>
        ) : paginatedProperties.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <span className="material-icons text-4xl mb-2">search_off</span>
            <p className="text-sm font-medium">No properties match your filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-primary/10">
            {paginatedProperties.map((prop) => (
              <div
                key={prop.id}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-[#EEF6F6]/50 dark:hover:bg-primary/5 transition-colors items-center"
              >
                {/* Property Details */}
                <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                  <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                    {prop.imageUrl ? (
                      <Image
                        src={prop.imageUrl}
                        alt={prop.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-icons">image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-nordic dark:text-white group-hover:text-primary transition-colors cursor-pointer">
                      {prop.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{prop.location}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {prop.beds} Beds</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {prop.baths} Baths</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{prop.area} m²</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-6 md:col-span-2">
                  <div className="text-base font-semibold text-nordic dark:text-gray-200">
                    {prop.price.startsWith('$') ? prop.price : `$${prop.price}`}
                  </div>
                  <div className="text-xs text-gray-400 uppercase font-medium mt-0.5">
                    {prop.transactionType === 'rent' ? 'For Rent' : 'For Sale'}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-6 md:col-span-2">
                  {prop.isFeatured ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                      Featured
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#D9ECC8] text-primary border border-primary/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                      Active
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleToggleFeatured(prop)}
                    className={`p-2 rounded-lg transition-all ${
                      prop.isFeatured
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'text-gray-400 hover:text-primary hover:bg-[#D9ECC8]/30'
                    }`}
                    title={prop.isFeatured ? 'Unmark Featured' : 'Mark as Featured'}
                  >
                    <span className="material-icons text-xl">{prop.isFeatured ? 'star' : 'star_outline'}</span>
                  </button>
                  <Link href={`/admin/properties/${prop.id}`} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-[#D9ECC8]/30 transition-all" title="Edit Property">
                    <span className="material-icons text-xl">edit</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-primary/20 flex items-center justify-between bg-gray-50/50 dark:bg-primary/5">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-nordic dark:text-white">{totalFiltered > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium text-nordic dark:text-white">{endIndex}</span> of <span className="font-medium text-nordic dark:text-white">{totalFiltered}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || totalFiltered === 0}
              className="px-3.5 py-1.5 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-xs font-semibold text-primary dark:text-emerald-300 bg-primary/10 rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || totalFiltered === 0}
              className="px-3.5 py-1.5 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
