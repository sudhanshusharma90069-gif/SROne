import { readFile } from 'fs/promises';
import path from 'path';
import { Deal } from './types';
import { computePrices } from './prices';

interface RawDeal {
  store: string;
  title: string;
  description: string;
  link: string;
  category: string;
  discount: string;
  ai_summary?: string;
}

export async function loadSourceDeals(): Promise<RawDeal[]> {
  try {
    const file = path.join(process.cwd(), 'public', 'deals.json');
    const text = await readFile(file, 'utf-8');
    const parsed = JSON.parse(text);
    return Array.isArray(parsed.deals) ? parsed.deals : [];
  } catch {
    return [];
  }
}

export async function getEnrichedDeals(): Promise<Deal[]> {
  const raw = await loadSourceDeals();
  return raw.map((d) => {
    const { originalPrice, discountedPrice } = computePrices(d);
    return {
      ...d,
      ai_summary: d.ai_summary || `${d.title} — ${d.description}`,
      originalPrice,
      discountedPrice,
    };
  });
}
