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

async function readJsonDeals(filename: string): Promise<RawDeal[]> {
  try {
    const file = path.join(process.cwd(), 'public', filename);
    const text = await readFile(file, 'utf-8');
    const parsed = JSON.parse(text);
    return Array.isArray(parsed.deals) ? parsed.deals : [];
  } catch {
    return [];
  }
}

export async function loadSourceDeals(): Promise<RawDeal[]> {
  const products = await readJsonDeals('products.json');
  if (products.length) return products;
  return readJsonDeals('deals.json');
}

export async function getEnrichedDeals(overrideRaw?: RawDeal[]): Promise<Deal[]> {
  const raw = overrideRaw && overrideRaw.length ? overrideRaw : await loadSourceDeals();
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
