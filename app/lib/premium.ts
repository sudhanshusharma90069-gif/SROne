import { storeCategories } from './stores';
import { UserProfile, BasketItem, StoreQuote, Bundle, BudgetInsights, AnalyticsSummary } from './types';

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function priceFor(name: string, storeMultiplier = 1): number {
  const base = (hash(name.toLowerCase()) % 300) + 25;
  return Math.round(base * storeMultiplier);
}

export function getRecommendations(profile: UserProfile) {
  const prefs = (profile.preferences || []).map((p) => p.toLowerCase());
  const allStores = storeCategories.flatMap((c) => c.stores.map((s) => ({ ...s, category: c.name })));

  const scored = allStores.map((s) => {
    const match = prefs.some((p) => s.category.toLowerCase().includes(p) || s.name.toLowerCase().includes(p));
    const history = (profile.history || []).includes(s.name) ? 0.3 : 0;
    const score = match ? 0.85 + history : 0.4 + history;
    return {
      store: s.name,
      category: s.category,
      link: s.link,
      score: Math.min(parseFloat(score.toFixed(2)), 0.99),
      reason: match ? `Matches your interest: ${s.category}` : `Trending in ${s.category}`,
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 12);
}

const SURCHARGES: Record<string, number> = {
  Blinkit: 1.05,
  Instamart: 1.08,
  BigBasket: 0.95,
  Zepto: 1.06,
  SmartBazar: 0.93,
  StarQuik: 0.96,
  JioMart: 0.97,
  Amazon: 1.02,
  Flipkart: 1.01,
};

export function optimizeBasket(items: BasketItem[], _location?: string): { quotes: StoreQuote[]; best: StoreQuote } {
  const storeMap: Record<string, StoreQuote> = {};

  items.forEach((it) => {
    const qty = it.qty ?? 1;
    Object.entries(SURCHARGES).forEach(([store, multiplier]) => {
      const base = priceFor(it.name, multiplier);
      if (!storeMap[store]) storeMap[store] = { store, total: 0, items: [], link: '' };
      storeMap[store].total += base * qty;
      storeMap[store].items.push({ name: it.name, price: base, qty });
    });
  });

  const store = storeCategories
    .flatMap((c) => c.stores)
    .find((s) => SURCHARGES[s.name]);

  const quotes = Object.values(storeMap)
    .map((q) => {
      const found = storeCategories.flatMap((c) => c.stores).find((s) => s.name === q.store);
      return { ...q, total: Math.round(q.total), link: found?.link || '' };
    })
    .sort((a, b) => a.total - b.total);

  const best = quotes[0];
  return { quotes, best };
}

export function predictTrend(basePrice: number, days = 7) {
  const trend = [] as { day: number; price: number; confidence: number }[];
  for (let i = 1; i <= days; i++) {
    const noise = (hash(`day${i}`) % 15) - 7;
    const price = Math.max(0, Math.round(basePrice + noise - i * 2));
    trend.push({ day: i, price, confidence: Math.max(0.5, 0.98 - i * 0.05) });
  }
  return trend;
}

export function buildBundles(items: BasketItem[]): Bundle[] {
  const names = items.map((i) => i.name.trim()).filter(Boolean);
  if (names.length === 0) return [];

  const bundles: Bundle[] = [];
  for (let size = 2; size <= Math.min(4, names.length); size++) {
    const subset = names.slice(0, size);
    const original = subset.reduce((sum, n) => sum + priceFor(n), 0);
    const bundle = Math.round(original * 0.88);
    bundles.push({
      name: `${subset.join(' + ')} Bundle`,
      items: subset,
      originalPrice: original,
      bundlePrice: bundle,
      demandScore: Math.min(99, 60 + hash(subset.join(',')) % 40),
    });
  }

  return bundles.sort((a, b) => b.demandScore - a.demandScore);
}

export function budgetInsights(spent: number, budget: number, categories?: Record<string, number>): BudgetInsights {
  const remaining = budget - spent;
  let status: 'under' | 'near' | 'over' = 'under';
  if (remaining < 0) status = 'over';
  else if (remaining < budget * 0.15) status = 'near';

  const suggestions: string[] = [];
  if (status === 'over') suggestions.push('You have crossed your monthly budget. Pause non-essential spending.');
  if (status === 'near') suggestions.push('You are close to your budget limit. Switch to essentials only.');
  if (remaining > budget * 0.4) suggestions.push('You have room to stock up on bundled grocery offers.');

  if (categories) {
    const top = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    if (top) suggestions.push(`Most spending is on ${top[0]}. Look for category-specific bank offers.`);
  }

  return { spent, budget, remaining, status, suggestions };
}

export function getAnalytics(): AnalyticsSummary {
  const allStores = storeCategories.flatMap((c) => c.stores.map((s) => s.name));
  const top = allStores.slice(0, 6).map((name, i) => ({ name, clicks: 1200 - i * 150 }));
  const categories = storeCategories.map((c, i) => ({ category: c.name, clicks: 800 - i * 40 }));

  return {
    totalClicks: 24500,
    totalDeals: 70,
    activeUsers: 1840,
    topStores: top,
    categoryBreakdown: categories,
    savingsEstimate: 128000,
  };
}

export function assistantReply(message: string, _profile?: UserProfile) {
  const m = message.toLowerCase();
  if (m.includes('budget')) return 'Track your monthly spend and get alerts before you overshoot.';
  if (m.includes('basket') || m.includes('cart')) return 'Use the basket optimizer to compare total prices across Blinkit, Instamart, BigBasket, Zepto and more.';
  if (m.includes('recommend')) return 'Share your preferences and I will rank the best stores and deals for you.';
  if (m.includes('bundle')) return 'I can build bundles that give you up to 12% extra off on frequently bought together items.';
  if (m.includes('alert') || m.includes('whatsapp')) return 'Set a target price and WhatsApp number to get notified instantly.';
  if (m.includes('analytics')) return 'The analytics dashboard shows top stores, category breakdowns and estimated savings.';
  return 'I am your SROne shopping agent. Ask about deals, basket optimization, budget tracking, bundles or recommendations.';
}
