/** Row shape as stored in Supabase (snake_case) */
export interface PropertyRow {
  id: string;
  title: string;
  location: string;
  price: string;
  price_suffix: string | null;
  beds: number;
  baths: number;
  area: string;
  badge: string;
  badge_type: "primary" | "secondary" | "neutral" | null;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

/** Camel-case shape used throughout the UI */
export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceSuffix: string | null;
  beds: number;
  baths: number;
  area: string;
  badge: string;
  badgeType: "primary" | "secondary" | "neutral" | null;
  imageUrl: string;
  isFeatured: boolean;
}

/** Map a DB row to the UI-friendly shape */
export function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: row.price,
    priceSuffix: row.price_suffix,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    badge: row.badge,
    badgeType: row.badge_type,
    imageUrl: row.image_url,
    isFeatured: row.is_featured,
  };
}
