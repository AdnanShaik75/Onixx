export const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "WATCHES", href: "/watches" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "NEW ARRIVALS", href: "/new-arrivals" },
  { label: "BEST SELLERS", href: "/best-sellers" },
  { label: "LIMITED EDITION", href: "/limited-edition" },
] as const;

export const ANNOUNCEMENT_ITEMS = [
  "PAN INDIA SHIPPING",
  "SECURE PAYMENTS",
  "PREMIUM WATCHES & ACCESSORIES",
] as const;

export type BadgeType = "BESTSELLER" | "SALE" | "NEW" | "LIMITED";

export interface Product {
  id: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: BadgeType;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  strapMaterial?: string;
  caseMaterial?: string;
  movement?: string;
  waterResistance?: string;
  caseSize?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedEdition?: boolean;
  stock: number;
}

const img = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const ALL_PRODUCTS: Product[] = [
  {
    id: "royal-chronograph",
    name: "Royal Chronograph",
    category: "AUTOMATIC",
    collection: "signature",
    price: 1074850,
    rating: 5,
    reviewCount: 128,
    badge: "BESTSELLER",
    isBestSeller: true,
    image: img("1523170335258-f5ed11844a49"),
    images: [
      img("1523170335258-f5ed11844a49"),
      img("1524592094714-0f0654e20314"),
      img("1547996160-81dfa63595aa"),
      img("1587836374828-4dbafa74b0c2"),
    ],
    description:
      "The Royal Chronograph embodies the pinnacle of ONIXX horological mastery. Featuring an in-house automatic movement with column-wheel chronograph, this timepiece delivers uncompromising precision wrapped in timeless elegance.",
    features: [
      "In-house automatic caliber",
      "Column-wheel chronograph",
      "Sapphire crystal case back",
      "72-hour power reserve",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-R01" },
      { label: "Case", value: "41mm 18K Rose Gold" },
      { label: "Dial", value: "Guilloche Grand Feu Enamel" },
      { label: "Crystal", value: "Sapphire with AR coating" },
      { label: "Power Reserve", value: "72 hours" },
      { label: "Water Resistance", value: "100 meters" },
    ],
    strapMaterial: "Alligator Leather",
    caseMaterial: "18K Rose Gold",
    movement: "Automatic",
    waterResistance: "100m",
    caseSize: "41mm",
    stock: 12,
  },
  {
    id: "heritage-classic",
    name: "Heritage Classic",
    category: "QUARTZ",
    collection: "heritage",
    price: 410850,
    originalPrice: 493850,
    rating: 4.5,
    reviewCount: 89,
    badge: "SALE",
    isBestSeller: true,
    image: img("1524592094714-0f0654e20314"),
    images: [
      img("1524592094714-0f0654e20314"),
      img("1523170335258-f5ed11844a49"),
      img("1614164185128-e4ec99c436d7"),
      img("1594534475807-b8f9d8c8cc4e"),
    ],
    description:
      "A tribute to the golden age of watchmaking. The Heritage Classic pairs a minimalist dial with a precision Swiss quartz movement, offering effortless elegance for the modern gentleman.",
    features: [
      "Swiss quartz movement",
      "Slim 8.5mm profile",
      "Double-sided anti-reflective sapphire",
      "Applied indices",
    ],
    specs: [
      { label: "Movement", value: "Swiss Quartz Ronda 715" },
      { label: "Case", value: "40mm Stainless Steel 316L" },
      { label: "Dial", value: "Sunburst Silver" },
      { label: "Crystal", value: "Sapphire, double AR" },
      { label: "Water Resistance", value: "50 meters" },
    ],
    strapMaterial: "Bracelet Stainless Steel",
    caseMaterial: "Stainless Steel 316L",
    movement: "Quartz",
    waterResistance: "50m",
    caseSize: "40mm",
    stock: 8,
  },
  {
    id: "midnight-automatic",
    name: "Midnight Automatic",
    category: "AUTOMATIC",
    collection: "signature",
    price: 726250,
    rating: 5,
    reviewCount: 64,
    badge: "NEW",
    isNewArrival: true,
    image: img("1547996160-81dfa63595aa"),
    images: [
      img("1547996160-81dfa63595aa"),
      img("1523170335258-f5ed11844a49"),
      img("1587836374828-4dbafa74b0c2"),
      img("1612817159949-195b6eb9e31a"),
    ],
    description:
      "Born from the darkness, the Midnight Automatic commands attention with its deep black dial and luminous indices. A timepiece that transitions seamlessly from boardroom to black tie.",
    features: [
      "In-house automatic movement",
      "Super-LumiNova indices",
      "Exhibition case back",
      "Date display at 6 o'clock",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-M02" },
      { label: "Case", value: "42mm Black DLC Titanium" },
      { label: "Dial", value: "Matte Black with Sunray" },
      { label: "Crystal", value: "Sapphire with AR coating" },
      { label: "Power Reserve", value: "60 hours" },
      { label: "Water Resistance", value: "200 meters" },
    ],
    strapMaterial: "Rubber",
    caseMaterial: "Black DLC Titanium",
    movement: "Automatic",
    waterResistance: "200m",
    caseSize: "42mm",
    stock: 15,
  },
  {
    id: "sovereign-tourbillon",
    name: "Sovereign Tourbillon",
    category: "MANUAL WIND",
    collection: "skeleton",
    price: 2033500,
    rating: 5,
    reviewCount: 32,
    badge: "LIMITED",
    isLimitedEdition: true,
    image: img("1587836374828-4dbafa74b0c2"),
    images: [
      img("1587836374828-4dbafa74b0c2"),
      img("1523170335258-f5ed11844a49"),
      img("1509048191080-d2984bad6ae5"),
      img("1526045431048-f857369baa09"),
    ],
    description:
      "The crown jewel of ONIXX haute horlogerie. Limited to just 100 pieces worldwide, the Sovereign Tourbillon showcases a flying tourbillon visible through the skeletonized dial — a mechanical ballet of precision.",
    features: [
      "Flying tourbillon",
      "Hand-wound manufacture caliber",
      "Skeletonized movement",
      "Limited to 100 pieces",
    ],
    specs: [
      { label: "Movement", value: "Manual Wind Caliber ONX-T01" },
      { label: "Case", value: "43mm Platinum 950" },
      { label: "Dial", value: "Skeleton, Hand-engraved" },
      { label: "Crystal", value: "Box sapphire" },
      { label: "Power Reserve", value: "120 hours" },
      { label: "Water Resistance", value: "30 meters" },
    ],
    strapMaterial: "Hand-stitched Alligator",
    caseMaterial: "Platinum 950",
    movement: "Manual Wind",
    waterResistance: "30m",
    caseSize: "43mm",
    stock: 3,
  },
  {
    id: "apex-diver",
    name: "Apex Diver Pro",
    category: "DIVER",
    collection: "signature",
    price: 576850,
    rating: 4.5,
    reviewCount: 24,
    badge: "NEW",
    isNewArrival: true,
    image: img("1614164185128-e4ec99c436d7"),
    images: [
      img("1614164185128-e4ec99c436d7"),
      img("1523170335258-f5ed11844a49"),
      img("1547996160-81dfa63595aa"),
      img("1594534475807-b8f9d8c8cc4e"),
    ],
    description:
      "Engineered for the depths, styled for the surface. The Apex Diver Pro combines 300m water resistance with a unidirectional ceramic bezel and luminous display, built to perform in any environment.",
    features: [
      "300m water resistance",
      "Ceramic unidirectional bezel",
      "Helium escape valve",
      "Automatic helium release",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-D01" },
      { label: "Case", value: "44mm Grade 5 Titanium" },
      { label: "Dial", value: "Gradient Blue to Black" },
      { label: "Crystal", value: "Sapphire, 3mm thick" },
      { label: "Power Reserve", value: "68 hours" },
      { label: "Water Resistance", value: "300 meters" },
    ],
    strapMaterial: "Titanium Bracelet",
    caseMaterial: "Grade 5 Titanium",
    movement: "Automatic",
    waterResistance: "300m",
    caseSize: "44mm",
    stock: 6,
  },
  {
    id: "zenith-perpetual",
    name: "Zenith Perpetual",
    category: "AUTOMATIC",
    collection: "heritage",
    price: 1311400,
    rating: 5,
    reviewCount: 18,
    badge: "NEW",
    isNewArrival: true,
    image: img("1594534475807-b8f9d8c8cc4e"),
    images: [
      img("1594534475807-b8f9d8c8cc4e"),
      img("1523170335258-f5ed11844a49"),
      img("1587836374828-4dbafa74b0c2"),
      img("1524592094714-0f0654e20314"),
    ],
    description:
      "A perpetual calendar that required 847 individual components. The Zenith Perpetual tracks the day, date, month, and leap year cycle, requiring no correction until the year 2100.",
    features: [
      "Perpetual calendar",
      "847 components",
      "Moon phase display",
      "No correction needed until 2100",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-P01" },
      { label: "Case", value: "42mm 18K White Gold" },
      { label: "Dial", value: "Guilloche, Silver" },
      { label: "Crystal", value: "Box sapphire" },
      { label: "Power Reserve", value: "48 hours" },
      { label: "Water Resistance", value: "30 meters" },
    ],
    strapMaterial: "Hand-stitched Alligator",
    caseMaterial: "18K White Gold",
    movement: "Automatic",
    waterResistance: "30m",
    caseSize: "42mm",
    stock: 2,
  },
  {
    id: "noir-dress",
    name: "Noir Dress Elite",
    category: "QUARTZ",
    collection: "heritage",
    price: 286350,
    rating: 4.5,
    reviewCount: 42,
    badge: "NEW",
    isNewArrival: true,
    image: img("1639037689659-05be63e715c0"),
    images: [
      img("1639037689659-05be63e715c0"),
      img("1524592094714-0f0654e20314"),
      img("1614164185128-e4ec99c436d7"),
      img("1547996160-81dfa63595aa"),
    ],
    description:
      "The Noir Dress Elite is the ultimate expression of understated luxury. At just 7.2mm thick, it slides effortlessly under a cuff while making a bold statement with its jet-black dial.",
    features: [
      "Ultra-thin 7.2mm profile",
      "Jet black enamel dial",
      "Swiss quartz movement",
      "Italian leather strap",
    ],
    specs: [
      { label: "Movement", value: "Swiss Quartz ETA 901.001" },
      { label: "Case", value: "39mm Polished Steel" },
      { label: "Dial", value: "Jet Black Enamel" },
      { label: "Crystal", value: "Sapphire, double AR" },
      { label: "Water Resistance", value: "30 meters" },
    ],
    strapMaterial: "Italian Calfskin Leather",
    caseMaterial: "Stainless Steel 316L",
    movement: "Quartz",
    waterResistance: "30m",
    caseSize: "39mm",
    stock: 0,
  },
  {
    id: "chronos-aviator",
    name: "Chronos Aviator",
    category: "AUTOMATIC",
    collection: "signature",
    price: 817550,
    rating: 5,
    reviewCount: 56,
    badge: "BESTSELLER",
    isBestSeller: true,
    image: img("1509048191080-d2984bad6ae5"),
    images: [
      img("1509048191080-d2984bad6ae5"),
      img("1523170335258-f5ed11844a49"),
      img("1526045431048-f857369baa09"),
      img("1547996160-81dfa63595aa"),
    ],
    description:
      "Inspired by the golden age of aviation, the Chronos Aviator features a distinctive pilot dial with oversized numerals and a chronograph complication for precise timing.",
    features: [
      "Pilot-style dial",
      "Chronograph complication",
      "Large crown for gloved hands",
      "Anti-magnetic inner case",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-A01" },
      { label: "Case", value: "43mm Brushed Steel" },
      { label: "Dial", value: "Matte Black, Pilot Style" },
      { label: "Crystal", value: "Sapphire with AR" },
      { label: "Power Reserve", value: "56 hours" },
      { label: "Water Resistance", value: "100 meters" },
    ],
    strapMaterial: "Vintage Leather",
    caseMaterial: "Stainless Steel 316L",
    movement: "Automatic",
    waterResistance: "100m",
    caseSize: "43mm",
    stock: 20,
  },
  {
    id: "nocturne-skeleton",
    name: "Nocturne Skeleton",
    category: "AUTOMATIC",
    collection: "skeleton",
    price: 1535500,
    rating: 5,
    reviewCount: 27,
    badge: "LIMITED",
    isLimitedEdition: true,
    image: img("1526045431048-f857369baa09"),
    images: [
      img("1526045431048-f857369baa09"),
      img("1509048191080-d2984bad6ae5"),
      img("1587836374828-4dbafa74b0c2"),
      img("1523170335258-f5ed11844a49"),
    ],
    description:
      "The Nocturne Skeleton reveals the soul of watchmaking through its fully skeletonized movement. Each bridge is hand-finished with anglage and mirror polishing — limited to 75 pieces.",
    features: [
      "Fully skeletonized movement",
      "Hand-finished bridges",
      "Limited to 75 pieces",
      "Double-sided exhibition",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-S01" },
      { label: "Case", value: "41mm Rose Gold PVD Steel" },
      { label: "Dial", value: "Skeleton, Open-worked" },
      { label: "Crystal", value: "Double box sapphire" },
      { label: "Power Reserve", value: "80 hours" },
      { label: "Water Resistance", value: "50 meters" },
    ],
    strapMaterial: "Alligator Leather",
    caseMaterial: "Rose Gold PVD Steel",
    movement: "Automatic",
    waterResistance: "50m",
    caseSize: "41mm",
    stock: 1,
  },
  {
    id: "emperor-grand",
    name: "Emperor Grand Complication",
    category: "MANUAL WIND",
    collection: "skeleton",
    price: 3735000,
    rating: 5,
    reviewCount: 8,
    badge: "LIMITED",
    isLimitedEdition: true,
    image: img("1612817159949-195b6eb9e31a"),
    images: [
      img("1612817159949-195b6eb9e31a"),
      img("1587836374828-4dbafa74b0c2"),
      img("1523170335258-f5ed11844a49"),
      img("1526045431048-f857369baa09"),
    ],
    description:
      "The Emperor Grand Complication is the zenith of ONIXX craftsmanship. Featuring a minute repeater, perpetual calendar, and tourbillon in a single timepiece — limited to 25 pieces worldwide.",
    features: [
      "Minute repeater",
      "Perpetual calendar",
      "Tourbillon",
      "Limited to 25 pieces",
    ],
    specs: [
      { label: "Movement", value: "Manual Wind Caliber ONX-GC01" },
      { label: "Case", value: "45mm 18K Yellow Gold" },
      { label: "Dial", value: "Grand Feu Enamel" },
      { label: "Crystal", value: "Box sapphire" },
      { label: "Power Reserve", value: "48 hours" },
      { label: "Water Resistance", value: "30 meters" },
    ],
    strapMaterial: "Hand-stitched Alligator",
    caseMaterial: "18K Yellow Gold",
    movement: "Manual Wind",
    waterResistance: "30m",
    caseSize: "45mm",
    stock: 0,
  },
  {
    id: "titan-sport",
    name: "Titan Sport",
    category: "AUTOMATIC",
    collection: "signature",
    price: 597600,
    rating: 4.5,
    reviewCount: 73,
    isBestSeller: true,
    image: img("1523170335258-f5ed11844a49"),
    images: [
      img("1523170335258-f5ed11844a49"),
      img("1614164185128-e4ec99c436d7"),
      img("1547996160-81dfa63595aa"),
      img("1524592094714-0f0654e20314"),
    ],
    description:
      "Built for active lifestyles, the Titan Sport combines lightweight titanium construction with a robust automatic movement and sporty rubber strap.",
    features: [
      "Lightweight titanium",
      "Integrated rubber strap",
      "Luminous hands and markers",
      "Ratchet bezel",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-SP01" },
      { label: "Case", value: "42mm Brushed Titanium" },
      { label: "Dial", value: "Sunburst Grey" },
      { label: "Crystal", value: "Sapphire with AR" },
      { label: "Power Reserve", value: "50 hours" },
      { label: "Water Resistance", value: "200 meters" },
    ],
    strapMaterial: "Integrated Rubber",
    caseMaterial: "Grade 5 Titanium",
    movement: "Automatic",
    waterResistance: "200m",
    caseSize: "42mm",
    stock: 10,
  },
  {
    id: "meridian-world",
    name: "Meridian World Timer",
    category: "AUTOMATIC",
    collection: "heritage",
    price: 954500,
    rating: 5,
    reviewCount: 35,
    badge: "NEW",
    isNewArrival: true,
    image: img("1524592094714-0f0654e20314"),
    images: [
      img("1524592094714-0f0654e20314"),
      img("1523170335258-f5ed11844a49"),
      img("1594534475807-b8f9d8c8cc4e"),
      img("1509048191080-d2984bad6ae5"),
    ],
    description:
      "For the global citizen. The Meridian World Timer displays 24 time zones simultaneously through its intricate city ring, making it the ultimate travel companion.",
    features: [
      "24 time zones",
      "City ring complication",
      "Home time indicator",
      "Quick-set city selector",
    ],
    specs: [
      { label: "Movement", value: "Automatic Caliber ONX-WT01" },
      { label: "Case", value: "41mm Stainless Steel" },
      { label: "Dial", value: "Blue Lacquer with Cities" },
      { label: "Crystal", value: "Sapphire, AR coated" },
      { label: "Power Reserve", value: "60 hours" },
      { label: "Water Resistance", value: "50 meters" },
    ],
    strapMaterial: "Alligator Leather",
    caseMaterial: "Stainless Steel 316L",
    movement: "Automatic",
    waterResistance: "50m",
    caseSize: "41mm",
    stock: 4,
  },
];

export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
export const NEW_ARRIVALS = ALL_PRODUCTS.filter((p) => p.isNewArrival);
export const LIMITED_EDITION = ALL_PRODUCTS.filter((p) => p.isLimitedEdition);
export const BEST_SELLERS = ALL_PRODUCTS.filter((p) => p.isBestSeller);

export const COLLECTIONS = [
  {
    id: "classic",
    title: "Classic Watches",
    description: "Elegant designs for every occasion",
    longDescription:
      "Our classic collection features timeless watch designs that pair effortlessly with any outfit. From minimalist dials to refined details, these pieces are built for everyday elegance.",
    image: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&h=1000&fit=crop&q=80",
    count: ALL_PRODUCTS.filter((p) => p.collection === "heritage").length,
  },
  {
    id: "chronograph",
    title: "Chronograph Watches",
    description: "Performance meets timeless style",
    longDescription:
      "Chronograph watches combine precise timing functionality with sophisticated design. Whether for sport or style, these watches deliver performance and elegance in equal measure.",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&h=1000&fit=crop&q=80",
    count: ALL_PRODUCTS.filter((p) => p.collection === "signature").length,
  },
  {
    id: "skeleton",
    title: "Smart Watches",
    description: "Modern features with refined aesthetics",
    longDescription:
      "Smart watches that blend modern technology with clean, refined design. Stay connected with features that complement your lifestyle without compromising on style.",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=1000&fit=crop&q=80",
    count: ALL_PRODUCTS.filter((p) => p.collection === "skeleton").length,
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Complete your everyday look",
    longDescription:
      "From leather straps to premium sunglass collections, our accessories are curated to complement your watches and elevate your everyday style.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=1000&fit=crop&q=80",
    count: 0,
  },
];

export const getProduct = (id: string): Product | undefined =>
  ALL_PRODUCTS.find((p) => p.id === id);

export const getProductsByCollection = (collectionId: string): Product[] =>
  ALL_PRODUCTS.filter((p) => p.collection === collectionId);

export const getCollection = (id: string) =>
  COLLECTIONS.find((c) => c.id === id);

export const CRAFTSMANSHIP_FEATURES = [
  {
    icon: "shield" as const,
    title: "Premium Quality",
    description: "Carefully selected products",
  },
  {
    icon: "globe" as const,
    title: "Secure Payments",
    description: "Safe and reliable checkout",
  },
  {
    icon: "award" as const,
    title: "Pan India Shipping",
    description: "Delivery across India",
  },
  {
    icon: "refreshCw" as const,
    title: "Customer Support",
    description: "We're here to help",
  },
];

export const FOOTER_SHOP = [
  { label: "All Products", href: "/watches" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Accessories", href: "/accessories" },
  { label: "Gift Cards", href: "/gift-cards" },
];

export const FOOTER_SUPPORT = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Returns Policy", href: "/returns" },
  { label: "Track Order", href: "/track-order" },
];

export const FOOTER_COMPANY = [
  { label: "About ONIXX", href: "/story" },
  { label: "Collections", href: "/collections" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
