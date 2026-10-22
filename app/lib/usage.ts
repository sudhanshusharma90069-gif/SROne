const USAGE_KEY = 'srone-usage';

export type UsageMap = Record<string, number>;

export function getUsage(): UsageMap {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsage(map: UsageMap) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event('srone-usage'));
}

export function addUsage(category: string, amount = 3) {
  const map = getUsage();
  if (!category || category === 'All') return;
  map[category] = (map[category] || 0) + amount;
  saveUsage(map);
}

export function getTopCategories(limit = 4): { name: string; score: number }[] {
  const map = getUsage();
  return Object.entries(map)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
