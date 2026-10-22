export interface PriceAlert {
  id: string;
  dealId?: string;
  title: string;
  dealTitle?: string;
  platform?: string;
  targetPrice: number;
  currentPrice: number;
  whatsappNumber?: string;
  channel?: string;
  status: string;
  createdAt: string;
}

const KEY = 'srone-price-alerts';

export function getPriceAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePriceAlert(alert: PriceAlert): void {
  const existing = getPriceAlerts();
  const next = [alert, ...existing.filter((a) => a.id !== alert.id)];
  localStorage.setItem(KEY, JSON.stringify(next));
}
