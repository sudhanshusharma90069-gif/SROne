import { readFile } from 'fs/promises';
import path from 'path';
import App from '../omnipulse/page';

async function loadLocalDeals() {
  try {
    const text = await readFile(path.join(process.cwd(), 'public', 'products.json'), 'utf-8');
    const parsed = JSON.parse(text);
    if (parsed.deals?.length) return parsed.deals;
  } catch {}
  try {
    const text = await readFile(path.join(process.cwd(), 'public', 'deals.json'), 'utf-8');
    const parsed = JSON.parse(text);
    return parsed.deals || [];
  } catch {
    return [];
  }
}

export default async function FreeDashboard() {
  const initialDeals = await loadLocalDeals();
  return <App initialDeals={initialDeals} />;
}
