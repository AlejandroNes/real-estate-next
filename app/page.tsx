import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import NewInMarket from "@/components/NewInMarket";
import { getProperties } from "@/lib/supabase/properties";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const currentPage = typeof page === "string" ? parseInt(page, 10) : 1;

  const { data: properties, totalPages, currentPage: resolvedPage } =
    await getProperties({ page: currentPage });

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        <FeaturedCollections />
        <NewInMarket
          properties={properties}
          currentPage={resolvedPage}
          totalPages={totalPages}
        />
      </main>
    </>
  );
}
