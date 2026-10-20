export interface Store {
  name: string;
  description: string;
  link: string;
  category?: string;
}

export interface Deal {
  store: string;
  title: string;
  description: string;
  link: string;
  category: string;
  discount: string;
  ai_summary: string;
  originalPrice?: number;
  discountedPrice?: number;
}

export interface UserProfile {
  id: string;
  name?: string;
  preferences?: string[];
  history?: string[];
  location?: string;
  monthlyBudget?: number;
}

export interface BasketItem {
  name: string;
  qty?: number;
}

export interface StoreQuote {
  store: string;
  total: number;
  items: { name: string; price: number; qty: number }[];
  link: string;
}

export interface Bundle {
  name: string;
  items: string[];
  originalPrice: number;
  bundlePrice: number;
  demandScore: number;
}

export interface BudgetInsights {
  spent: number;
  budget: number;
  remaining: number;
  status: 'under' | 'near' | 'over';
  suggestions: string[];
}

export interface AnalyticsSummary {
  totalClicks: number;
  totalDeals: number;
  activeUsers: number;
  topStores: { name: string; clicks: number }[];
  categoryBreakdown: { category: string; clicks: number }[];
  savingsEstimate: number;
}

export interface AlertSubscription {
  dealTitle: string;
  targetPrice: number;
  whatsappNumber: string;
  priority: 'standard' | 'priority';
}
