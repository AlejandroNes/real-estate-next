import { newInMarketProperties } from "@/lib/data/mockProperties";
import PropertyCard from "./PropertyCard";

export default function NewInMarket() {
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">New in Market</h2>
          <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
        </div>
        <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm cursor-pointer border-none">
            All
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark dark:hover:text-white cursor-pointer border-none bg-transparent">
            Buy
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark dark:hover:text-white cursor-pointer border-none bg-transparent">
            Rent
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newInMarketProperties.map((property, index) => {
          let className = "";
          // Replicate the hidden classes from the original HTML design
          if (index === 4) {
            className = "hidden xl:flex";
          } else if (index === 5) {
            className = "hidden lg:flex";
          }
          return (
            <PropertyCard
              key={property.id}
              property={property}
              className={className}
            />
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque text-nordic-dark dark:text-white font-medium rounded-lg transition-all hover:shadow-md cursor-pointer">
          Load more properties
        </button>
      </div>
    </section>
  );
}
