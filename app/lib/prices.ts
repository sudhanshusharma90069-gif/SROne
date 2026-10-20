import { Deal } from './types';

const BASE_PRICE_BY_CATEGORY: Record<string, number> = {
  'Online Marketplaces': 2500,
  'Fashion & Lifestyle': 1500,
  'Beauty & Personal Care': 800,
  'Grocery & Quick Commerce': 600,
  'Food Delivery': 400,
  'Hotel Booking': 3500,
  'Travel Booking': 5000,
  'Electronics & Appliances': 12000,
  'Specialty Stores': 1200,
  'Travel & Mobility': 250,
  'Start Your Own Store': 1000,
  'Quick Commerce & Groceries': 700,
  'Meat, Food & Subscriptions': 900,
  'Movies & Entertainment': 1000,
  'Railway & Airport Services': 1500,
  'Recharge & Bill Payments': 500,
  'Daily Use & Streaming': 300,
};

const DEFAULT_BASE = 1500;

function getBasePrice(category: string): number {
  return BASE_PRICE_BY_CATEGORY[category] ?? DEFAULT_BASE;
}

export function computePrices(deal: Partial<Deal> & { category: string; discount: string }): { originalPrice: number; discountedPrice: number } {
  const original = getBasePrice(deal.category);
  const discountText = (deal.discount || '').toLowerCase();

  let discounted = original;

  const percentMatch = discountText.match(/(\d+)%\s*off?/);
  if (percentMatch) {
    const percent = Math.min(parseInt(percentMatch[1], 10), 95);
    discounted = Math.round(original * (1 - percent / 100));
  } else {
    const rangeMatch = discountText.match(/(\d+)-\d+%\s*off?/);
    if (rangeMatch) {
      const percent = Math.min(parseInt(rangeMatch[1], 10), 95);
      discounted = Math.round(original * (1 - percent / 100));
    } else {
      const rupeeMatch = discountText.match(/₹?\s*(\d{2,})/);
      if (rupeeMatch) {
        const off = parseInt(rupeeMatch[1], 10);
        discounted = Math.max(0, original - off);
      } else if (discountText.includes('bogo') || discountText.includes('buy 1 get 1')) {
        discounted = Math.round(original * 0.5);
      } else if (discountText.includes('free trial') || discountText.includes('first free') || discountText.includes('free')) {
        discounted = Math.round(original * 0.05);
      } else if (discountText.includes('wholesale')) {
        discounted = Math.round(original * 0.7);
      } else if (discountText.includes('no fees')) {
        discounted = Math.round(original * 0.95);
      } else if (discountText.includes('off')) {
        const fallback = discountText.match(/(\d+)/);
        if (fallback) {
          const percent = Math.min(parseInt(fallback[1], 10), 95);
          discounted = Math.round(original * (1 - percent / 100));
        }
      }
    }
  }

  return { originalPrice: original, discountedPrice: discounted };
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function generatePriceHistory(discountedPrice: number, days = 30): { day: string; price: number }[] {
  const start = Math.round(discountedPrice * 1.4);
  const data: { day: string; price: number }[] = [];
  for (let i = 0; i < days; i++) {
    const progress = (i + 1) / days;
    const noise = Math.round((Math.random() - 0.5) * discountedPrice * 0.08);
    const price = Math.max(discountedPrice, Math.round(start - (start - discountedPrice) * progress + noise));
    data.push({ day: `Day ${i + 1}`, price });
  }
  return data;
}

function hashItem(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function computeCartPrices(items: string[]): { blinkit: Record<string, number>; instamart: Record<string, number> } {
  const blinkit: Record<string, number> = {};
  const instamart: Record<string, number> = {};

  items.forEach((raw) => {
    const name = raw.trim().toLowerCase();
    if (!name) return;
    const base = (hashItem(name) % 250) + 20;
    blinkit[name] = Math.round(base * 0.95);
    instamart[name] = Math.round(base * 1.05);
  });

  return { blinkit, instamart };
}
