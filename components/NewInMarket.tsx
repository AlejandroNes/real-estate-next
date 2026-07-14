import Link from "next/link";
import PropertyCard from "./PropertyCard";
import { Property } from "@/lib/supabase/types";

interface NewInMarketProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
}

import TransactionToggle from "./TransactionToggle";

export default function NewInMarket({
  properties,
  currentPage,
  totalPages,
}: NewInMarketProps) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">
            New in Market
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            Fresh opportunities added this week.
          </p>
        </div>
        <TransactionToggle />
      </div>

      {/* Property Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-nordic-muted">
          No properties found.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          {/* Previous */}
          {hasPrev ? (
            <Link
              href={`/?page=${currentPage - 1}`}
              id="pagination-prev"
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque text-nordic-dark dark:text-white font-medium rounded-lg transition-all hover:shadow-md text-sm"
            >
              <span className="material-icons text-sm">arrow_back</span>
              Previous
            </Link>
          ) : (
            <span className="flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-white/5 border border-nordic-dark/5 dark:border-white/5 text-nordic-muted font-medium rounded-lg text-sm cursor-not-allowed opacity-50">
              <span className="material-icons text-sm">arrow_back</span>
              Previous
            </span>
          )}

          {/* Page indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/?page=${p}`}
                id={`pagination-page-${p}`}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  p === currentPage
                    ? "bg-mosque text-white shadow-md"
                    : "bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white hover:border-mosque hover:text-mosque"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>

          {/* Next */}
          {hasNext ? (
            <Link
              href={`/?page=${currentPage + 1}`}
              id="pagination-next"
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque text-nordic-dark dark:text-white font-medium rounded-lg transition-all hover:shadow-md text-sm"
            >
              Next
              <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          ) : (
            <span className="flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-white/5 border border-nordic-dark/5 dark:border-white/5 text-nordic-muted font-medium rounded-lg text-sm cursor-not-allowed opacity-50">
              Next
              <span className="material-icons text-sm">arrow_forward</span>
            </span>
          )}
        </div>
      )}
    </section>
  );
}
