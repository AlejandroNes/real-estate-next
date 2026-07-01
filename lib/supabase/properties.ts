import { supabase } from "./client";
import { mapProperty, Property, PropertyRow } from "./types";

export const PAGE_SIZE = 8;

interface GetPropertiesOptions {
  page?: number;
  featured?: boolean;
}

interface GetPropertiesResult {
  data: Property[];
  count: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch a paginated list of non-featured properties from Supabase.
 * Uses server-side range queries for efficient pagination.
 */
export async function getProperties({
  page = 1,
  featured = false,
}: GetPropertiesOptions = {}): Promise<GetPropertiesResult> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_featured", featured)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("[getProperties] Supabase error:", error.message);
    return { data: [], count: 0, totalPages: 0, currentPage: safePage };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return {
    data: (data as PropertyRow[]).map(mapProperty),
    count: total,
    totalPages,
    currentPage: safePage,
  };
}

/**
 * Fetch all featured properties (no pagination needed – usually a small set).
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getFeaturedProperties] Supabase error:", error.message);
    return [];
  }

  return (data as PropertyRow[]).map(mapProperty);
}
