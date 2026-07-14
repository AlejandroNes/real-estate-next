import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/supabase/types";

interface FeaturedPropertyCardProps {
  property: Property;
  isFirst?: boolean;
  dictFeatured: Record<string, any>;
}

export default function FeaturedPropertyCard({ property, isFirst = false, dictFeatured }: FeaturedPropertyCardProps) {
  return (
    <Link href={`/properties/${property.slug}`} className="block group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden shadow-soft bg-white dark:bg-white/5 h-full">
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark dark:text-white z-10">
            {property.badge}
          </div>
          <button 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all cursor-pointer border-none outline-none z-10"
          >
            <span className="material-icons text-xl">favorite_border</span>
          </button>
          {isFirst && (
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none"></div>
          )}
        </div>
        <div className="p-6 relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-medium text-nordic-dark dark:text-white group-hover:text-mosque transition-colors">
                {property.title}
              </h3>
              <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
                <span className="material-icons text-sm">place</span> {property.location}
              </p>
            </div>
            <span className="text-xl font-semibold text-mosque dark:text-primary">
              {property.price}
            </span>
          </div>
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5 dark:border-white/10">
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">king_bed</span> {property.beds} {dictFeatured.bed}
            </div>
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">bathtub</span> {property.baths} {dictFeatured.bath}
            </div>
            <div className="flex items-center gap-2 text-nordic-muted text-sm">
              <span className="material-icons text-lg">square_foot</span> {property.area} m²
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
