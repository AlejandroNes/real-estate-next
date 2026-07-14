import SearchForm from "./SearchForm";
import { getDictionary } from "@/lib/i18n";

export default async function Hero() {
  const dictionary = await getDictionary();

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark dark:text-white leading-tight">
          {dictionary.Hero.findYour}{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">{dictionary.Hero.sanctuary}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>
        <SearchForm 
          dictSearch={dictionary.Search} 
          dictFilters={dictionary.Filters} 
        />
      </div>
    </section>
  );
}
