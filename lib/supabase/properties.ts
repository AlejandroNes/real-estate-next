import { supabase } from "./client";
import { mapProperty, mapPropertyImage, Property, PropertyRow, PropertyImageRow } from "./types";

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

/**
 * Fetch a single property by its slug, including its images.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (propertyError || !propertyData) {
    console.error("[getPropertyBySlug] Supabase error:", propertyError?.message);
    return null;
  }

  const property = mapProperty(propertyData as PropertyRow);

  const { data: imagesData, error: imagesError } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", property.id)
    .order("is_primary", { ascending: false }); // Primary images first

  if (!imagesError && imagesData) {
    property.images = (imagesData as PropertyImageRow[]).map(mapPropertyImage);
  } else {
    property.images = [];
  }

  return property;
}
