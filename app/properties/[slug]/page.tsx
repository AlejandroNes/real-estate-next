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
  const dictionary = await getDictionary();
  const t = dictionary.PropertyPage;

  if (!property) {
    return { title: t.notFound };
  }

  const metaDesc = t.metaDesc
    .replace('{location}', property.location)
    .replace('{price}', property.price)
    .replace('{beds}', property.beds.toString())
    .replace('{baths}', property.baths.toString());

  const metaDescShort = t.metaDescShort
    .replace('{location}', property.location)
    .replace('{price}', property.price);

  return {
    title: `${property.title} | LuxeEstate`,
    description: metaDesc,
    openGraph: {
      title: `${property.title} | LuxeEstate`,
      description: metaDescShort,
      images: [{ url: property.imageUrl }],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  const dictionary = await getDictionary();
  const t = dictionary.PropertyPage;

  if (!property) {
    notFound();
  }

  // Gallery
  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0] || { url: property.imageUrl, altText: property.title };
  const otherImages = property.images?.filter(img => img.id !== (primaryImage as any).id) || [];

  return (
    <div className="bg-background-light dark:bg-background-dark text-nordic-dark dark:text-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-4">
            
            {/* Main Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
              <Image 
                src={primaryImage.url} 
                alt={primaryImage.altText || property.title} 
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
              </div>
              <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2 cursor-pointer border-none outline-none z-10">
                <span className="material-icons text-sm">grid_view</span>
                {t.viewAllPhotos}
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {otherImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto hide-scroll pb-2 snap-x">
                {otherImages.map((img) => (
                  <div key={img.id} className="flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity snap-start relative ring-2 ring-transparent hover:ring-mosque hover:ring-offset-2 hover:ring-offset-background-light dark:hover:ring-offset-background-dark">
                    <Image 
                      src={img.url} 
                      alt={img.altText || property.title} 
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
              
              {/* Agent & Price Card */}
              <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic-dark dark:text-white mb-2">
                    {property.price}
                    {property.priceSuffix && <span className="text-xl ml-1 text-nordic-muted">{property.priceSuffix}</span>}
                  </h1>
                  <p className="text-nordic-muted font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                <div className="h-px bg-slate-100 dark:bg-white/10 my-6"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-white/20 shadow-sm bg-gray-200 relative overflow-hidden">
                     {/* Dummy Agent Image */}
                     <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w" alt="Agent" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-dark dark:text-white">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>{t.topRatedAgent}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer border-none outline-none">
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer border-none outline-none">
                      <span className="material-icons text-sm">call</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-mosque/90 text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer border-none outline-none">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    {t.scheduleVisit}
                  </button>
                  <button className="w-full bg-transparent border border-nordic-dark/10 dark:border-white/10 hover:border-mosque dark:hover:border-mosque text-nordic-dark/80 dark:text-white/80 hover:text-mosque dark:hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer outline-none">
                    <span className="material-icons text-xl">mail_outline</span>
                    {t.contactAgent}
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
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark dark:text-white">{t.propertyFeatures}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                <span className="text-xl font-bold text-nordic-dark dark:text-white">{property.area}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">{t.squareMeters}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                <span className="text-xl font-bold text-nordic-dark dark:text-white">{property.beds}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">{t.bedrooms}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                <span className="text-xl font-bold text-nordic-dark dark:text-white">{property.baths}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">{t.bathrooms}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                <span className="text-xl font-bold text-nordic-dark dark:text-white">2</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">{t.garage}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-4 text-nordic-dark dark:text-white">{t.aboutHome}</h2>
            <div className="prose prose-slate max-w-none text-nordic-muted leading-relaxed">
              <p className="mb-4">
                {t.desc1.replace('{location}', property.location)}
              </p>
              <p>
                {t.desc2}
              </p>
            </div>
            <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer border-none outline-none bg-transparent">
              {t.readMore}
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Amenities */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark dark:text-white">{t.amenities}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[t.amenityList.smartHome, t.amenityList.pool, t.amenityList.hvac, t.amenityList.evCharging, t.amenityList.gym, t.amenityList.wineCellar].map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-nordic-muted">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mortgage Calculator */}
          <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-white/10 rounded-full text-mosque shadow-sm">
                <span className="material-icons">calculate</span>
              </div>
              <div>
                <h3 className="font-semibold text-nordic-dark dark:text-white">{t.estimatedPayment}</h3>
                <p className="text-sm text-nordic-muted">{t.startingFrom} <strong className="text-mosque">$5,430/mo</strong> {t.withDown}</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-4 py-2 bg-white dark:bg-white/10 border border-nordic-dark/10 dark:border-white/10 rounded-lg text-sm font-semibold hover:border-mosque dark:hover:border-mosque transition-colors text-nordic-dark dark:text-white cursor-pointer outline-none">
              {t.calculateMortgage}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic-muted">
            {t.footer}
          </div>
        </div>
      </footer>
    </div>
  );
}
