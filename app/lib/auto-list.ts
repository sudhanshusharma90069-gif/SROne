const AUTO_LIST_KEY = 'srone-auto-list';

export interface SavedItem {
  id: number;
  name: string;
  category?: string;
  bestStore: string;
  mrp: number;
  bestPrice: number;
  selected: boolean;
  frequency?: string;
  nextDue?: string;
  autoSubscribe?: boolean;
}

const DEFAULT_SAVED: SavedItem[] = [
  {
    id: 101,
    name: 'Aashirvaad Atta 10kg',
    category: 'Groceries',
    bestStore: 'JioMart',
    mrp: 620,
    bestPrice: 485,
    selected: true,
    frequency: 'Ordered 8x • Har 15 din par',
    nextDue: 'Due in 2 days',
    autoSubscribe: true,
  },
  {
    id: 102,
    name: 'Fortune Sunflower Oil 5L',
    category: 'Groceries',
    bestStore: 'BigBasket',
    mrp: 950,
    bestPrice: 740,
    selected: true,
    frequency: 'Ordered 6x • Monthly Essential',
    nextDue: 'Lowest price today!',
    autoSubscribe: true,
  },
  {
    id: 103,
    name: 'Amul Butter 500g',
    category: 'Groceries',
    bestStore: 'Blinkit',
    mrp: 580,
    bestPrice: 510,
    selected: true,
    frequency: 'Ordered 14x • Weekly Favorite',
    nextDue: 'Delivery in 9 mins',
    autoSubscribe: false,
  },
  {
    id: 104,
    name: 'Lakme 9 to 5 Kit',
    category: 'Beauty',
    bestStore: 'Nykaa',
    mrp: 1500,
    bestPrice: 1250,
    selected: true,
    frequency: 'Ordered 3x • Regular Restock',
    nextDue: 'Extra 12% ICICI Off',
    autoSubscribe: false,
  },
];

export function getSavedItems(): SavedItem[] {
  if (typeof window === 'undefined') return DEFAULT_SAVED;
  try {
    const raw = localStorage.getItem(AUTO_LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return DEFAULT_SAVED;
  }
  return DEFAULT_SAVED;
}

export function setSavedItems(items: SavedItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTO_LIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('srone-auto-list'));
}

export function addSavedItem(item: SavedItem) {
  const items = getSavedItems();
  items.unshift(item);
  setSavedItems(items);
}

export function removeSavedItem(id: number) {
  const items = getSavedItems().filter((i) => i.id !== id);
  setSavedItems(items);
}
