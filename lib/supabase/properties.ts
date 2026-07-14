import { supabase } from "./client";
import { mapProperty, mapPropertyImage, Property, PropertyRow, PropertyImageRow } from "./types";

export const PAGE_SIZE = 8;

interface GetPropertiesOptions {
  page?: number;
  featured?: boolean;
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

// --- MOCK PROPERTIES INJECTION ---
const MOCK_PROPERTIES: Property[] = [
  {
    id: "mock-1",
    title: "Luxury Villa in Beverly Hills",
    location: "Beverly Hills, CA",
    price: "4,500,000",
    priceSuffix: null,
    beds: 5,
    baths: 6,
    area: "650",
    badge: "NEW",
    badgeType: "primary",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    isFeatured: false,
    transactionType: "buy",
    slug: "luxury-villa-beverly-hills",
    lat: 34.0736,
    lng: -118.4004
  },
  {
    id: "mock-2",
    title: "Downtown Penthouse Suite",
    location: "Downtown Los Angeles, CA",
    price: "2,800,000",
    priceSuffix: null,
    beds: 3,
    baths: 3,
    area: "250",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    isFeatured: false,
    transactionType: "buy",
    slug: "downtown-penthouse-la",
    lat: 34.0407,
    lng: -118.2468
  },
  {
    id: "mock-3",
    title: "Beachfront House in Malibu",
    location: "Malibu, CA",
    price: "5,200,000",
    priceSuffix: null,
    beds: 4,
    baths: 4,
    area: "400",
    badge: "HOT",
    badgeType: "primary",
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
    isFeatured: false,
    transactionType: "rent",
    slug: "beachfront-house-malibu",
    lat: 34.0259,
    lng: -118.7798
  },
  {
    id: "mock-4",
    title: "Modern Condo in Hollywood",
    location: "Hollywood, CA",
    price: "1,300,000",
    priceSuffix: null,
    beds: 2,
    baths: 2,
    area: "120",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    isFeatured: false,
    transactionType: "buy",
    slug: "modern-condo-hollywood",
    lat: 34.0928,
    lng: -118.3287
  },
  {
    id: "mock-5",
    title: "Cozy Apartment near Central Park",
    location: "New York, NY",
    price: "950,000",
    priceSuffix: null,
    beds: 1,
    baths: 1,
    area: "75",
    badge: "NEW",
    badgeType: "primary",
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    isFeatured: false,
    transactionType: "rent",
    slug: "cozy-apartment-nyc",
    lat: 40.7812,
    lng: -73.9665
  }
];

/**
 * Fetch a paginated list of non-featured properties from Supabase.
 * Uses server-side range queries for efficient pagination.
 */
export async function getProperties({
  page = 1,
  featured = false,
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
    .select("*", { count: "exact" })
    .eq("is_featured", featured);

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
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("[getProperties] Supabase error:", error.message);
    return { data: [], count: 0, totalPages: 0, currentPage: safePage };
  }

  let results = (data as PropertyRow[]).map(mapProperty);

  // MOCK PROPERTIES are defined at the module level now

  let filteredMocks = MOCK_PROPERTIES.filter(p => p.isFeatured === featured);
  if (query) {
    const q = query.toLowerCase();
    filteredMocks = filteredMocks.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
  }
  if (propertyType && propertyType !== "Any Type" && propertyType !== "All") {
    filteredMocks = filteredMocks.filter(p => p.title.toLowerCase().includes(propertyType.toLowerCase()));
  }
  if (beds && beds > 0) {
    filteredMocks = filteredMocks.filter(p => p.beds >= beds);
  }
  if (baths && baths > 0) {
    filteredMocks = filteredMocks.filter(p => p.baths >= baths);
  }
  if (transactionType === "buy" || transactionType === "rent") {
    filteredMocks = filteredMocks.filter(p => p.transactionType === transactionType);
  }

  // Add the mock items to the results (only on first page for simplicity)
  if (safePage === 1) {
    results = [...filteredMocks, ...results];
  }

  const total = (count ?? 0) + filteredMocks.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

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
  const mockMatch = MOCK_PROPERTIES.find(p => p.slug === slug);
  if (mockMatch) {
    return { ...mockMatch, images: [] }; // Mock properties don't have extra images for now
  }

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
