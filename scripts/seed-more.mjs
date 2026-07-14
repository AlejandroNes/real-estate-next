import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const newProperties = [
  {
    title: "Luxury Villa in Beverly Hills",
    location: "Beverly Hills, CA",
    price: "$4,500,000",
    price_suffix: null,
    beds: 5,
    baths: 6,
    area: "650",
    badge: "NEW",
    badge_type: "primary",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoSh7bCIKgaMhgJnEWdRkH3_ZuDeg09ALe8WS9dD7gtkzKBf7CBqgpivJDNX8El0EYOWPKs4NS5QaEBHIkK-iuDlOX5WnEiUmUonb4qrsXXXB61Qd0zzUm4V7hcQnQd9-CdydTKt8_AtyEsW-wAdOh-oGpp2sl4g4c_gRocCsh__C8LfxXqjSY_2ZzS2zNluerhVwTNouiD4RTxwLFFLFgOW1zhJr2VoYULE6gl8X2Jy2r70A64l7u9QwknqtTd_rQ0OflanZyJBk",
    is_featured: false,
    transaction_type: "buy",
    slug: "luxury-villa-beverly-hills-" + Date.now(),
    lat: 34.0736,
    lng: -118.4004
  },
  {
    title: "Downtown Penthouse Suite",
    location: "Downtown Los Angeles, CA",
    price: "$2,800,000",
    price_suffix: null,
    beds: 3,
    baths: 3,
    area: "250",
    badge: "FOR SALE",
    badge_type: "secondary",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E",
    is_featured: false,
    transaction_type: "buy",
    slug: "downtown-penthouse-la-" + Date.now(),
    lat: 34.0407,
    lng: -118.2468
  },
  {
    title: "Beachfront House in Malibu",
    location: "Malibu, CA",
    price: "$5,200,000",
    price_suffix: null,
    beds: 4,
    baths: 4,
    area: "400",
    badge: "HOT",
    badge_type: "primary",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoSh7bCIKgaMhgJnEWdRkH3_ZuDeg09ALe8WS9dD7gtkzKBf7CBqgpivJDNX8El0EYOWPKs4NS5QaEBHIkK-iuDlOX5WnEiUmUonb4qrsXXXB61Qd0zzUm4V7hcQnQd9-CdydTKt8_AtyEsW-wAdOh-oGpp2sl4g4c_gRocCsh__C8LfxXqjSY_2ZzS2zNluerhVwTNouiD4RTxwLFFLFgOW1zhJr2VoYULE6gl8X2Jy2r70A64l7u9QwknqtTd_rQ0OflanZyJBk",
    is_featured: false,
    transaction_type: "buy",
    slug: "beachfront-house-malibu-" + Date.now(),
    lat: 34.0259,
    lng: -118.7798
  },
  {
    title: "Modern Condo in Hollywood",
    location: "Hollywood, CA",
    price: "$1,300,000",
    price_suffix: null,
    beds: 2,
    baths: 2,
    area: "120",
    badge: "FOR SALE",
    badge_type: "secondary",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E",
    is_featured: false,
    transaction_type: "buy",
    slug: "modern-condo-hollywood-" + Date.now(),
    lat: 34.0928,
    lng: -118.3287
  },
  {
    title: "Cozy Apartment near Central Park",
    location: "New York, NY",
    price: "$950,000",
    price_suffix: null,
    beds: 1,
    baths: 1,
    area: "75",
    badge: "NEW",
    badge_type: "primary",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoSh7bCIKgaMhgJnEWdRkH3_ZuDeg09ALe8WS9dD7gtkzKBf7CBqgpivJDNX8El0EYOWPKs4NS5QaEBHIkK-iuDlOX5WnEiUmUonb4qrsXXXB61Qd0zzUm4V7hcQnQd9-CdydTKt8_AtyEsW-wAdOh-oGpp2sl4g4c_gRocCsh__C8LfxXqjSY_2ZzS2zNluerhVwTNouiD4RTxwLFFLFgOW1zhJr2VoYULE6gl8X2Jy2r70A64l7u9QwknqtTd_rQ0OflanZyJBk",
    is_featured: false,
    transaction_type: "rent",
    slug: "cozy-apartment-nyc-" + Date.now(),
    lat: 40.7812,
    lng: -73.9665
  }
];

async function run() {
  const { data, error } = await supabase.from('properties').insert(newProperties).select();
  console.log("Inserted properties:", data?.length);
  if (error) console.error(error);
}
run();
