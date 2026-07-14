import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/supabase/types";

interface PropertyCardProps {
  property: Property;
  className?: string;
  dictFeatured?: Record<string, any>;
}

export default function PropertyCard({ property, className = "", dictFeatured = { bed: "Beds", bath: "Baths" } }: PropertyCardProps) {
  // Determine badge styling based on badgeType
  let badgeColorClass = "bg-nordic-dark/90";
  if (property.badgeType === "primary") {
    badgeColorClass = "bg-mosque/90";
  }

  return (
    <Link href={`/properties/${property.slug}`} className="block h-full group">
      <article className={`bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer h-full flex flex-col ${className}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button 
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark border-none outline-none cursor-pointer z-10"
          >
            <span className="material-icons text-lg">favorite_border</span>
          </button>
          <div className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded z-10 ${badgeColorClass}`}>
            {property.badge}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-bold text-lg text-nordic-dark dark:text-white">
              {property.price}
              {property.priceSuffix && (
                <span className="text-sm font-normal text-nordic-muted">{property.priceSuffix}</span>
              )}
            </h3>
          </div>
          <h4 className="text-nordic-dark dark:text-gray-200 font-medium truncate mb-1">
            {property.title}
          </h4>
          <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-1 text-nordic-muted text-xs">
              <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds} {dictFeatured.bed}
            </div>
            <div className="flex items-center gap-1 text-nordic-muted text-xs">
              <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths} {dictFeatured.bath}
            </div>
            <div className="flex items-center gap-1 text-nordic-muted text-xs">
              <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}m²
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
