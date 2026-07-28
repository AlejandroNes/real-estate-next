import { supabase } from "./client";
import { mapProperty, mapPropertyImage, Property, PropertyRow, PropertyImageRow } from "./types";

export const PAGE_SIZE = 8;

interface GetPropertiesOptions {
  page?: number;
  featured?: boolean;
  includeAll?: boolean;
  query?: string;
  propertyType?: string;
  beds?: number;
  baths?: number;
  minPrice?: string;
  maxPrice?: string;
  transactionType?: string;
}

interface GetPropertiesResult {
  data: Property[];
  count: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch a paginated list of properties from Supabase, newest first.
 */
export async function getProperties({
  page = 1,
  featured,
  includeAll = false,
  query,
  propertyType,
  beds,
  baths,
  transactionType,
}: GetPropertiesOptions = {}): Promise<GetPropertiesResult> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let queryBuilder = supabase
    .from("properties")
    .select("*", { count: "exact" });

  if (!includeAll) {
    queryBuilder = queryBuilder.eq("is_active", true);
  }

  if (!includeAll && featured !== undefined) {
    queryBuilder = queryBuilder.eq("is_featured", featured);
  }

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
  }

  if (propertyType && propertyType !== "Any Type" && propertyType !== "All") {
    queryBuilder = queryBuilder.ilike("title", `%${propertyType}%`);
  }

  if (beds && beds > 0) {
    queryBuilder = queryBuilder.gte("beds", beds);
  }

  if (baths && baths > 0) {
    queryBuilder = queryBuilder.gte("baths", baths);
  }

  if (transactionType === "buy" || transactionType === "rent") {
    queryBuilder = queryBuilder.eq("transaction_type", transactionType);
  }

  const { data, error, count } = await queryBuilder
    .order("created_at", { ascending: false }) // newest first
    .range(from, to);

  if (error) {
    console.error("[getProperties] Supabase error:", error.message);
    return { data: [], count: 0, totalPages: 1, currentPage: safePage };
  }

  const results = (data as PropertyRow[]).map(mapProperty);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    data: results,
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
    .eq("is_active", true)
    .order("created_at", { ascending: false });

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
    .maybeSingle();

  if (propertyError || !propertyData) {
    if (propertyError) console.error("[getPropertyBySlug] Supabase error:", propertyError.message);
    return null;
  }

  const property = mapProperty(propertyData as PropertyRow);

  if (!property.isActive) {
    return null;
  }

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

/**
 * Fetch a single property by its ID, including its images.
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (propertyError || !propertyData) {
    if (propertyError) console.error("[getPropertyById] Supabase error:", propertyError.message);
    return null;
  }

  const property = mapProperty(propertyData as PropertyRow);

  const { data: imagesData, error: imagesError } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", property.id)
    .order("is_primary", { ascending: false });

  if (!imagesError && imagesData) {
    property.images = (imagesData as PropertyImageRow[]).map(mapPropertyImage);
  } else {
    property.images = [];
  }

  return property;
}
