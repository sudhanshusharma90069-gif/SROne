export interface BankCard {
  name: string;
  discount: number;
}

export const BANK_CARDS: BankCard[] = [
  { name: 'HDFC', discount: 0.10 },
  { name: 'SBI', discount: 0.08 },
  { name: 'ICICI', discount: 0.12 },
  { name: 'Axis', discount: 0.10 },
  { name: 'Amex', discount: 0.15 },
  { name: 'Kotak', discount: 0.09 },
];

const CARD_KEY = 'srone-selected-card';

export function getSelectedCardName(): string {
  if (typeof window === 'undefined') return BANK_CARDS[0].name;
  return localStorage.getItem(CARD_KEY) || BANK_CARDS[0].name;
}

export function setSelectedCardName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CARD_KEY, name);
}

export function getCardDiscount(name: string): number {
  return BANK_CARDS.find((c) => c.name === name)?.discount ?? 0;
}
