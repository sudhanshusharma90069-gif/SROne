// Central affiliate link config — paste your real links here once.
// Get IDs from:
//  - Amazon: amazon.in/associates
//  - Flipkart: affiliate.flipkart.com / fktr.in
//  - Most other stores: EarnKaro (earnkaro.com) or Cuelinks (cuelinks.com) — one account covers Myntra, Ajio, Nykaa, Swiggy, MakeMyTrip etc.

export const AFFILIATE_IDS: Record<string, string> = {
  amazon: 'https://link.amazon/B0dHvm5kb',
  flipkart: 'https://fktr.in/XJvTEq6',
  earnkaro: 'YOUR_AFFILIATE_ID',
  cuelinks: 'YOUR_AFFILIATE_ID',
  booking: 'YOUR_AFFILIATE_ID',
  shopify: 'YOUR_AFFILIATE_ID',
};

// Product-specific Flipkart affiliate links.
// Key = exact product title (as shown on the site). Value = the fktr.in / Flipkart affiliate link.
export const FLIPKART_PRODUCT_LINKS: Record<string, string> = {
  'Samsung Galaxy S24 5G': 'https://fktr.in/XJvTEq6',
  // Add more titles here, e.g.:
  // 'Apple iPhone 15 128GB': 'https://fktr.in/XXXXX',
};

type AffiliateInput = {
  store?: string;
  title?: string;
  link?: string;
};

export function getAffiliateUrl({ store, title, link }: AffiliateInput): string {
  const s = (store || '').toLowerCase();
  if (s === 'flipkart') {
    return FLIPKART_PRODUCT_LINKS[title || ''] || AFFILIATE_IDS.flipkart;
  }
  return link || '#';
}

// Commission rate estimates per store (%) — for admin dashboard estimates.
// Update with real rates from your affiliate network dashboards.
export const COMMISSION_RATES: Record<string, number> = {
  Amazon: 3,
  Flipkart: 5,
  Meesho: 12,
  Snapdeal: 8,
  ShopClues: 8,
  IndiaMART: 5,
  Myntra: 10,
  Ajio: 10,
  'Tata CLiQ': 8,
  LimeRoad: 10,
  Nykaa: 8,
  Purplle: 10,
  Blinkit: 5,
  Zepto: 5,
  BigBasket: 6,
  JioMart: 5,
  Swiggy: 3,
  Zomato: 3,
  "Domino's": 5,
  Rominos: 5,
  'Reliance Digital': 3,
  Lenskart: 8,
  FirstCry: 10,
  Pepperfry: 10,
  Uber: 4,
  Rapido: 5,
  Shopify: 20,
  'OYO Rooms': 6,
  'Booking.com': 4,
  Airbnb: 5,
  MakeMyTrip: 4,
  'MakeMyTrip Hotels': 4,
  Goibibo: 4,
  Yatra: 4,
  Cleartrip: 4,
  EaseMyTrip: 4,
  IRCTC: 2,
  redBus: 5,
};
