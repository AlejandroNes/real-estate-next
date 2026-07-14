import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewInMarket from "@/components/NewInMarket";
import { getProperties } from "@/lib/supabase/properties";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page, query, propertyType, beds, baths, transactionType } = await searchParams;
  const currentPage = typeof page === "string" ? parseInt(page, 10) : 1;
  const resolvedQuery = typeof query === "string" ? query : undefined;
  const resolvedType = typeof propertyType === "string" ? propertyType : undefined;
  const resolvedBeds = typeof beds === "string" ? parseInt(beds, 10) : undefined;
  const resolvedBaths = typeof baths === "string" ? parseInt(baths, 10) : undefined;
  const resolvedTransactionType = typeof transactionType === "string" ? transactionType : undefined;

  const hasActiveFilters = Boolean(resolvedQuery || resolvedType || resolvedBeds || resolvedBaths || resolvedTransactionType);

  const { data: properties, totalPages, currentPage: resolvedPage } =
    await getProperties({ 
      page: currentPage, 
      query: resolvedQuery, 
      propertyType: resolvedType, 
      beds: resolvedBeds, 
      baths: resolvedBaths,
      transactionType: resolvedTransactionType
    });

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        {!hasActiveFilters && <FeaturedCollections />}
        <NewInMarket
          properties={properties}
          currentPage={resolvedPage}
          totalPages={totalPages}
        />
      </main>
    </>
  );
}
