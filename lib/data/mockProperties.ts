export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceSuffix?: string;
  beds: number;
  baths: number;
  area: string;
  badge: string;
  badgeType?: 'primary' | 'secondary' | 'neutral'; // specific for styling based on 'FOR SALE' or 'FOR RENT' or 'Exclusive'
  imageUrl: string;
  isFeatured?: boolean;
}

export const featuredProperties: Property[] = [
  {
    id: "f1",
    title: "The Glass Pavilion",
    location: "Beverly Hills, California",
    price: "$5,250,000",
    beds: 5,
    baths: 4.5,
    area: "4,200",
    badge: "Exclusive",
    badgeType: "neutral",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM",
    isFeatured: true,
  },
  {
    id: "f2",
    title: "Azure Heights Penthouse",
    location: "Downtown, Vancouver",
    price: "$3,800,000",
    beds: 3,
    baths: 3,
    area: "2,100",
    badge: "New Arrival",
    badgeType: "neutral",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s",
    isFeatured: true,
  }
];

export const newInMarketProperties: Property[] = [
  {
    id: "n1",
    title: "Modern Family Home",
    location: "123 Pine St, Seattle",
    price: "$850,000",
    beds: 3,
    baths: 2,
    area: "120",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E"
  },
  {
    id: "n2",
    title: "Urban Loft",
    location: "456 Elm Ave, Portland",
    price: "$3,200",
    priceSuffix: "/mo",
    beds: 1,
    baths: 1,
    area: "85",
    badge: "FOR RENT",
    badgeType: "primary",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4"
  },
  {
    id: "n3",
    title: "Highland Retreat",
    location: "789 Mountain Rd, Bend",
    price: "$620,000",
    beds: 2,
    baths: 2,
    area: "98",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro"
  },
  {
    id: "n4",
    title: "Sea View Penthouse",
    location: "321 Ocean Dr, Miami",
    price: "$4,500",
    priceSuffix: "/mo",
    beds: 3,
    baths: 3,
    area: "180",
    badge: "FOR RENT",
    badgeType: "primary",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U"
  },
  {
    id: "n5",
    title: "Central Studio",
    location: "555 Main St, Chicago",
    price: "$550,000",
    beds: 1,
    baths: 1,
    area: "50",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE"
  },
  {
    id: "n6",
    title: "Garden Villa",
    location: "999 Oak Ln, Austin",
    price: "$2,800",
    priceSuffix: "/mo",
    beds: 2,
    baths: 2,
    area: "110",
    badge: "FOR RENT",
    badgeType: "primary",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8"
  },
  {
    id: "n7",
    title: "Cozy Beachfront Cottage",
    location: "12 Sand Dune Rd, Malibu",
    price: "$1,250,000",
    beds: 2,
    baths: 1.5,
    area: "105",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: "n8",
    title: "Downtown Tech Hub Condo",
    location: "101 Silicon Ave, San Francisco",
    price: "$4,100",
    priceSuffix: "/mo",
    beds: 1,
    baths: 1,
    area: "65",
    badge: "FOR RENT",
    badgeType: "primary",
    imageUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: "n9",
    title: "Historic Brownstone",
    location: "202 Maple St, Boston",
    price: "$1,850,000",
    beds: 4,
    baths: 3,
    area: "220",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075&ixlib=rb-4.0.3"
  },
  {
    id: "n10",
    title: "Sunny Desert Oasis",
    location: "303 Cactus Blvd, Phoenix",
    price: "$720,000",
    beds: 3,
    baths: 2,
    area: "185",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: "n11",
    title: "Luxury Ski Chalet",
    location: "404 Alpine Way, Aspen",
    price: "$5,500",
    priceSuffix: "/mo",
    beds: 4,
    baths: 4,
    area: "250",
    badge: "FOR RENT",
    badgeType: "primary",
    imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=2127&ixlib=rb-4.0.3"
  },
  {
    id: "n12",
    title: "Riverside Apartment",
    location: "505 River Rd, Chicago",
    price: "$2,100",
    priceSuffix: "/mo",
    beds: 2,
    baths: 1,
    area: "90",
    badge: "FOR RENT",
    badgeType: "primary",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: "n13",
    title: "Spacious Suburban Home",
    location: "606 Meadow Ln, Dallas",
    price: "$480,000",
    beds: 5,
    baths: 3.5,
    area: "310",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: "n14",
    title: "Minimalist City Flat",
    location: "707 Urban St, New York",
    price: "$3,500",
    priceSuffix: "/mo",
    beds: 1,
    baths: 1,
    area: "55",
    badge: "FOR RENT",
    badgeType: "primary",
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: "n15",
    title: "Tropical Retreat",
    location: "808 Palm Dr, Honolulu",
    price: "$2,100,000",
    beds: 3,
    baths: 2,
    area: "175",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1542314831-c53cd3816002?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: "n16",
    title: "Mountain View Cabin",
    location: "909 Timber Rd, Denver",
    price: "$890,000",
    beds: 3,
    baths: 2,
    area: "140",
    badge: "FOR SALE",
    badgeType: "secondary",
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1965&ixlib=rb-4.0.3"
  }
];
