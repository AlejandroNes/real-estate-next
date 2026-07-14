import Link from "next/link";
import { getFeaturedProperties } from "@/lib/supabase/properties";
import FeaturedPropertyCard from "./FeaturedPropertyCard";
import { getDictionary } from "@/lib/i18n";

export default async function FeaturedCollections() {
  const featuredProperties = await getFeaturedProperties();
  const dictionary = await getDictionary();

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">{dictionary.Featured.title}</h2>
          <p className="text-nordic-muted mt-1 text-sm">{dictionary.Featured.subtitle}</p>
        </div>
        <Link href="#" className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity">
          {dictionary.Featured.viewAll} <span className="material-icons text-sm">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredProperties.map((property, index) => (
          <FeaturedPropertyCard 
            key={property.id} 
            property={property} 
            isFirst={index === 0} 
            dictFeatured={dictionary.Featured}
          />
        ))}
      </div>
    </section>
  );
}
