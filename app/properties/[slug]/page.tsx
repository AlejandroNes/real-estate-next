import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import LazyMap from '@/components/LazyMap';
import { getPropertyBySlug } from '@/lib/supabase/properties';
import Navbar from '@/components/Navbar';

import { getDictionary } from '@/lib/i18n';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: 'Property Not Found | LuxeEstate' };
  }

  const desc = property.description
    ? property.description.substring(0, 160)
    : `${property.beds} bed, ${property.baths} bath property in ${property.location} for $${property.price}.`;

  return {
    title: `${property.title} | LuxeEstate`,
    description: desc,
    openGraph: {
      title: `${property.title} | LuxeEstate`,
      description: desc,
      images: [{ url: property.imageUrl }],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Build gallery: main image + secondary images from property_images table
  const mainImage = {
    url: property.imageUrl,
    altText: property.title,
    id: 'primary',
    isPrimary: true,
  };

  const secondaryImages = (property.images || []).filter(img => img.url !== property.imageUrl);
  const galleryImages = [mainImage, ...secondaryImages];
  const thumbImages = secondaryImages;

  const amenitiesList: string[] = Array.isArray(property.amenities)
    ? property.amenities
    : [];

  const statusLabel = property.transactionType === 'rent' ? 'For Rent' : 'For Sale';

  return (
    <div className="bg-background-light dark:bg-background-dark text-nordic-dark dark:text-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-4">

            {/* Main Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
              <Image
                src={mainImage.url}
                alt={mainImage.altText || property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {property.badge && (
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${property.badgeType === 'primary' ? 'bg-mosque text-white' : 'bg-white/90 text-nordic-dark'}`}>
                    {property.badge}
                  </span>
                )}
                <span className="text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm bg-white/90 text-nordic-dark">
                  {statusLabel}
                </span>
              </div>
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2 z-10">
                  <span className="material-icons text-sm">grid_view</span>
                  {galleryImages.length} Photos
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {thumbImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {thumbImages.map((img, i) => (
                  <div key={img.id ?? i} className="flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity snap-start relative ring-2 ring-transparent hover:ring-mosque hover:ring-offset-2 hover:ring-offset-background-light dark:hover:ring-offset-background-dark">
                    <Image
                      src={img.url}
                      alt={img.altText || `${property.title} - photo ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">

              {/* Price Card */}
              <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic-dark dark:text-white mb-2">
                    ${property.price}
                    {property.priceSuffix && <span className="text-xl ml-1 text-nordic-muted">{property.priceSuffix}</span>}
                  </h1>
                  <p className="text-lg font-semibold text-nordic-dark dark:text-white mb-1">{property.title}</p>
                  <p className="text-nordic-muted font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                <div className="h-px bg-slate-100 dark:bg-white/10 my-6"></div>
                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-mosque/90 text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer border-none outline-none">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    Schedule a Visit
                  </button>
                  <button className="w-full bg-transparent border border-nordic-dark/10 dark:border-white/10 hover:border-mosque dark:hover:border-mosque text-nordic-dark/80 dark:text-white/80 hover:text-mosque dark:hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer outline-none">
                    <span className="material-icons text-xl">mail_outline</span>
                    Contact Agent
                  </button>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white dark:bg-white/5 p-2 rounded-xl shadow-sm border border-mosque/5 h-[300px] relative z-0">
                <LazyMap lat={property.lat} lng={property.lng} popupText={property.title} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8 lg:max-w-full relative z-10">

          {/* Features */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark dark:text-white">Property Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                <span className="text-xl font-bold text-nordic-dark dark:text-white">{property.area}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">m²</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                <span className="text-xl font-bold text-nordic-dark dark:text-white">{property.beds}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                <span className="text-xl font-bold text-nordic-dark dark:text-white">{property.baths}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Bathrooms</span>
              </div>
              {property.yearBuilt && (
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">calendar_month</span>
                  <span className="text-xl font-bold text-nordic-dark dark:text-white">{property.yearBuilt}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic-muted">Year Built</span>
                </div>
              )}
            </div>
          </div>

          {/* Description — only show if there is real description */}
          {property.description && (
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic-dark dark:text-white">About this Home</h2>
              <div className="prose prose-slate max-w-none text-nordic-muted leading-relaxed whitespace-pre-wrap">
                {property.description}
              </div>
            </div>
          )}

          {/* Amenities — only show if there are real amenities */}
          {amenitiesList.length > 0 && (
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic-dark dark:text-white">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {amenitiesList.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-nordic-muted">
                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic-muted">
            © {new Date().getFullYear()} LuxeEstate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
