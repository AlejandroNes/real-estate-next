"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface TransactionToggleProps {
  dictTransaction: Record<string, string>;
}

export default function TransactionToggle({ dictTransaction }: TransactionToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentTransaction = searchParams.get("transactionType") || "all";

  const handleToggle = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("transactionType");
    } else {
      params.set("transactionType", type);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg">
      <button 
        onClick={() => handleToggle("all")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer border-none transition-colors ${currentTransaction === "all" ? "bg-nordic-dark text-white shadow-sm" : "text-nordic-muted hover:text-nordic-dark dark:hover:text-white bg-transparent"}`}
      >
        {dictTransaction.all || "All"}
      </button>
      <button 
        onClick={() => handleToggle("buy")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer border-none transition-colors ${currentTransaction === "buy" ? "bg-nordic-dark text-white shadow-sm" : "text-nordic-muted hover:text-nordic-dark dark:hover:text-white bg-transparent"}`}
      >
        {dictTransaction.buy || "Buy"}
      </button>
      <button 
        onClick={() => handleToggle("rent")}
        className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer border-none transition-colors ${currentTransaction === "rent" ? "bg-nordic-dark text-white shadow-sm" : "text-nordic-muted hover:text-nordic-dark dark:hover:text-white bg-transparent"}`}
      >
        {dictTransaction.rent || "Rent"}
      </button>
    </div>
  );
}
