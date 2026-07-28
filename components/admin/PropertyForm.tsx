'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/lib/supabase/types';
import { savePropertyAction } from '@/app/actions/admin-actions';
import { uploadPropertyImage } from '@/lib/supabase/storage';

interface PropertyFormProps {
  initialData?: Property;
  isEdit?: boolean;
}

interface ImageEntry {
  file?: File;
  previewUrl: string;
  existingUrl?: string; // for images already in DB
  isPrimary: boolean;
}

export default function PropertyForm({ initialData, isEdit = false }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<Partial<Property>>(
    initialData || {
      title: '',
      price: '',
      status: 'for-sale',
      propertyType: 'apartment',
      description: '',
      location: '',
      area: '',
      yearBuilt: undefined,
      beds: 3,
      baths: 2,
      imageUrl: '',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      amenities: []
    }
  );

  // Build initial image entries from existing data
  const buildInitialImages = (): ImageEntry[] => {
    if (!initialData) return [];
    const entries: ImageEntry[] = [];
    if (initialData.imageUrl) {
      entries.push({ previewUrl: initialData.imageUrl, existingUrl: initialData.imageUrl, isPrimary: true });
    }
    if (initialData.images && initialData.images.length > 0) {
      initialData.images.filter(img => !img.isPrimary).forEach(img => {
        entries.push({ previewUrl: img.url, existingUrl: img.url, isPrimary: false });
      });
    }
    return entries;
  };

  const [images, setImages] = useState<ImageEntry[]>(buildInitialImages);

  const AMENITIES_LIST = [
    'Swimming Pool', 'Garden', 'Air Conditioning', 'Smart Home',
    'Gym', 'Security System', 'Garage', 'Balcony'
  ];

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (field: string, delta: number) => {
    setFormData(prev => {
      const currentVal = Number(prev[field as keyof Property] || 0);
      return { ...prev, [field]: Math.max(0, currentVal + delta) };
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const amenities: string[] = prev.amenities || [];
      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter((a: string) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...amenities, amenity] };
      }
    });
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const newEntries: ImageEntry[] = newFiles.map((file, i) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: images.length === 0 && i === 0,
    }));
    setImages(prev => {
      // If no images existed, make first new one primary
      const updated = [...prev, ...newEntries];
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
    e.target.value = ''; // reset input
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // If we removed the primary, make the first remaining primary
      if (prev[index].isPrimary && updated.length > 0) {
        updated[0] = { ...updated[0], isPrimary: true };
      }
      return updated;
    });
  };

  const handleSetPrimary = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      showNotification('Title and Price are required', 'error');
      return;
    }

    setLoading(true);

    try {
      let primaryImageUrl = formData.imageUrl || '';
      const additionalUrls: string[] = [];

      // Upload all images that have a file (new uploads)
      for (const imgEntry of images) {
        if (imgEntry.file) {
          const { url, error } = await uploadPropertyImage(imgEntry.file);
          if (error || !url) {
            showNotification(`Image upload failed: ${error}`, 'error');
            setLoading(false);
            return;
          }
          if (imgEntry.isPrimary) {
            primaryImageUrl = url;
          } else {
            additionalUrls.push(url);
          }
        } else if (imgEntry.existingUrl) {
          // Existing URL from DB
          if (imgEntry.isPrimary) {
            primaryImageUrl = imgEntry.existingUrl;
          } else {
            additionalUrls.push(imgEntry.existingUrl);
          }
        }
      }

      const payload = {
        ...formData,
        imageUrl: primaryImageUrl,
        transactionType: formData.status === 'for-sale' ? 'buy' : formData.status === 'for-rent' ? 'rent' : formData.transactionType,
      };

      const result = await savePropertyAction(payload, isEdit, additionalUrls);

      if (result.success) {
        showNotification(isEdit ? 'Property updated successfully' : 'Property created successfully', 'success');
        setTimeout(() => {
          router.push('/admin/properties');
          router.refresh();
        }, 1500);
      } else {
        showNotification(result.error || 'Failed to save property', 'error');
      }
    } catch (err: any) {
      showNotification('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sf-pro pb-24 md:pb-0">
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

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
              <li><button onClick={() => router.push('/admin/properties')} className="hover:text-primary transition-colors">Properties</button></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-nordic dark:text-gray-200">{isEdit ? 'Edit Property' : 'Add New'}</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic dark:text-white tracking-tight mb-2">
              {isEdit ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl font-normal">
              Fill in the details below to {isEdit ? 'update the' : 'create a new'} listing. Fields marked with * are mandatory.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/properties')}
            className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="material-icons animate-spin text-sm">sync</span>
            ) : (
              <span className="material-icons text-sm">save</span>
            )}
            {loading ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-8">

          {/* Basic Info */}
          <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-primary/20 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-icons text-lg">info</span>
              </div>
              <h2 className="text-xl font-bold text-nordic dark:text-white">Basic Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-nordic dark:text-gray-300 mb-1.5" htmlFor="title">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" id="title" name="title"
                  value={formData.title} onChange={handleChange} required
                  placeholder="e.g. Modern Penthouse with Ocean View"
                  className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-nordic dark:text-gray-300 mb-1.5" htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="text" id="price" name="price"
                      value={formData.price} onChange={handleChange} required
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nordic dark:text-gray-300 mb-1.5" htmlFor="status">Status</label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-100 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base cursor-pointer">
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nordic dark:text-gray-300 mb-1.5" htmlFor="propertyType">Property Type</label>
                  <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-100 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base cursor-pointer">
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nordic dark:text-gray-300 mb-1.5">Visibility</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`w-full py-2.5 px-4 rounded-md border font-medium text-sm flex items-center justify-between transition-colors ${
                      formData.isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    <span>{formData.isActive ? 'Active' : 'Disabled'}</span>
                    <span className={`w-8 h-4 rounded-full p-0.5 transition-colors flex items-center ${formData.isActive ? 'bg-emerald-500 justify-end' : 'bg-gray-400 justify-start'}`}>
                      <span className="w-3 h-3 rounded-full bg-white shadow-sm block"></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-primary/20 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-icons text-lg">description</span>
              </div>
              <h2 className="text-xl font-bold text-nordic dark:text-white">Description</h2>
            </div>
            <div className="p-8">
              <textarea
                id="description" name="description"
                value={formData.description || ''} onChange={handleChange}
                placeholder="Describe the property features, neighborhood, and unique selling points..."
                className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-base leading-relaxed resize-y min-h-[200px]"
              />
            </div>
          </div>

          {/* Gallery — Multiple Images */}
          <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-primary/20 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-icons text-lg">image</span>
                </div>
                <h2 className="text-xl font-bold text-nordic dark:text-white">Gallery</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">JPG, PNG, WEBP</span>
            </div>

            <div className="p-8">
              {/* Drop zone */}
              <div
                className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-8 text-center hover:bg-primary/5 hover:border-primary/40 transition-colors cursor-pointer group mb-6"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file" accept="image/*" multiple
                  ref={fileInputRef} onChange={handleFilesSelected}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform duration-300">
                    <span className="material-icons text-2xl">cloud_upload</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-nordic dark:text-gray-200">Click or drag images here</p>
                    <p className="text-xs text-gray-400">Max 5MB per image · First image will be the main photo</p>
                  </div>
                </div>
              </div>

              {/* Image grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm border border-gray-100 dark:border-gray-700">
                      <img
                        src={img.previewUrl}
                        alt={`Property image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shadow"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(i)}
                            title="Set as main image"
                            className="w-8 h-8 rounded-full bg-white text-primary hover:bg-gray-50 flex items-center justify-center transition-colors shadow"
                          >
                            <span className="material-icons text-sm">star</span>
                          </button>
                        )}
                      </div>
                      {/* Badge */}
                      {img.isPrimary && (
                        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Main</span>
                      )}
                    </div>
                  ))}
                  {/* Add more button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                    <span className="text-xs mt-1 font-medium">Add More</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          {/* Location */}
          <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-primary/20 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-icons text-lg">place</span>
              </div>
              <h2 className="text-lg font-bold text-nordic dark:text-white">Location</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic dark:text-gray-300 mb-1.5" htmlFor="location">Address</label>
                <input
                  type="text" id="location" name="location"
                  value={formData.location} onChange={handleChange}
                  placeholder="Street Address, City, Zip"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="lat">
                    Latitude <span className="text-gray-400 font-normal">(for map)</span>
                  </label>
                  <input
                    type="number" id="lat" name="lat" step="any"
                    value={(formData as any).lat ?? ''} onChange={handleChange}
                    placeholder="-16.5000"
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-nordic dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="lng">
                    Longitude <span className="text-gray-400 font-normal">(for map)</span>
                  </label>
                  <input
                    type="number" id="lng" name="lng" step="any"
                    value={(formData as any).lng ?? ''} onChange={handleChange}
                    placeholder="-68.1500"
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-nordic dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                💡 Tip: Find coordinates at{' '}
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">maps.google.com</a>
                {' '}→ right-click on map → copy coordinates.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden sticky top-24">
            <div className="px-6 py-4 border-b border-primary/20 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-icons text-lg">straighten</span>
              </div>
              <h2 className="text-lg font-bold text-nordic dark:text-white">Details</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium mb-1 block" htmlFor="area">Area (m²)</label>
                  <input
                    type="text" id="area" name="area"
                    value={formData.area} onChange={handleChange}
                    placeholder="0"
                    className="w-full text-left px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-nordic dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="group">
                  <label className="text-xs text-gray-500 font-medium mb-1 block" htmlFor="yearBuilt">Year Built</label>
                  <input
                    type="number" id="yearBuilt" name="yearBuilt"
                    value={formData.yearBuilt || ''} onChange={handleChange}
                    placeholder="YYYY"
                    className="w-full text-left px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-nordic dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-700" />

              <div className="space-y-4">
                {/* Beds */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic dark:text-gray-300 flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <button type="button" onClick={() => handleNumberChange('beds', -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-gray-700">-</button>
                    <input type="text" readOnly value={formData.beds} className="w-10 text-center border-none bg-transparent text-nordic dark:text-gray-100 p-0 focus:ring-0 text-sm font-medium" />
                    <button type="button" onClick={() => handleNumberChange('beds', 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-gray-700">+</button>
                  </div>
                </div>
                {/* Baths */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-nordic dark:text-gray-300 flex items-center gap-2">
                    <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <button type="button" onClick={() => handleNumberChange('baths', -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-gray-700">-</button>
                    <input type="text" readOnly value={formData.baths} className="w-10 text-center border-none bg-transparent text-nordic dark:text-gray-100 p-0 focus:ring-0 text-sm font-medium" />
                    <button type="button" onClick={() => handleNumberChange('baths', 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-gray-700">+</button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-700" />

              <div>
                <h3 className="font-bold text-nordic dark:text-gray-300 mb-3 uppercase tracking-wider text-xs">Amenities</h3>
                <div className="space-y-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.amenities?.includes(amenity) || false}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 text-primary border-gray-300 dark:border-gray-600 rounded focus:ring-primary dark:bg-gray-800"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-nordic dark:group-hover:text-white transition-colors">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl md:hidden z-40 flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/properties')}
            className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-gray-300 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-primary text-white font-medium flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
