'use client';

import { useMemo, useState } from 'react';
import { Deal } from '../lib/types';
import { BANK_CARDS, getCardDiscount, getSelectedCardName, setSelectedCardName } from '../lib/cards';
import { formatPrice, generatePriceHistory } from '../lib/prices';
import PriceChart from './PriceChart';
import PriceAlertModal from './PriceAlertModal';

function trackClick(store: string, deal: string) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store, deal, type: 'click' }),
    });
  } catch {}
}

function getLogoUrl(link: string) {
  try {
    const { hostname } = new URL(link);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return '';
  }
}

const brands: Record<string, { c1: string; c2: string; text: string }> = {
  Amazon: { c1: '#ff9900', c2: '#ff6c37', text: '#1a1a2e' },
  Flipkart: { c1: '#2874f0', c2: '#0d3b8f', text: '#ffffff' },
  Meesho: { c1: '#9f2089', c2: '#570f4b', text: '#ffffff' },
  Snapdeal: { c1: '#e40046', c2: '#8f002b', text: '#ffffff' },
  ShopClues: { c1: '#f37021', c2: '#b34c00', text: '#ffffff' },
  IndiaMART: { c1: '#d32f2f', c2: '#8e1a1a', text: '#ffffff' },
  Myntra: { c1: '#ff3f6c', c2: '#b01f46', text: '#ffffff' },
  Ajio: { c1: '#2a3d51', c2: '#16222f', text: '#ffffff' },
  'Tata CLiQ': { c1: '#0a0a0a', c2: '#3a3a3a', text: '#ffffff' },
  LimeRoad: { c1: '#ff5a5f', c2: '#c22a30', text: '#ffffff' },
  Nykaa: { c1: '#fc2779', c2: '#a30e50', text: '#ffffff' },
  Purplle: { c1: '#4e0d3a', c2: '#2a0620', text: '#ffffff' },
  Blinkit: { c1: '#f8cb46', c2: '#f9a826', text: '#1a1a2e' },
  Zepto: { c1: '#6c3cf7', c2: '#3d1f96', text: '#ffffff' },
  BigBasket: { c1: '#84c225', c2: '#4f7a0e', text: '#ffffff' },
  JioMart: { c1: '#0078ad', c2: '#004a6b', text: '#ffffff' },
  Swiggy: { c1: '#fc8019', c2: '#c25800', text: '#ffffff' },
  Zomato: { c1: '#e23744', c2: '#9c1622', text: '#ffffff' },
  "Domino's": { c1: '#006491', c2: '#003d57', text: '#ffffff' },
  Rominos: { c1: '#e31837', c2: '#8f0f22', text: '#ffffff' },
  'Reliance Digital': { c1: '#e71d1d', c2: '#940e0e', text: '#ffffff' },
  Lenskart: { c1: '#00a0e3', c2: '#005e85', text: '#ffffff' },
  FirstCry: { c1: '#ef8236', c2: '#b4550c', text: '#ffffff' },
  Pepperfry: { c1: '#ff6c37', c2: '#c24310', text: '#ffffff' },
  Uber: { c1: '#1a1a2e', c2: '#000000', text: '#ffffff' },
  Rapido: { c1: '#f7b32b', c2: '#c8871a', text: '#1a1a2e' },
  Shopify: { c1: '#96bf48', c2: '#5e8f26', text: '#ffffff' },
  'OYO Rooms': { c1: '#ef3e5b', c2: '#b01f3b', text: '#ffffff' },
  'Booking.com': { c1: '#003580', c2: '#001f4d', text: '#ffffff' },
  Airbnb: { c1: '#ff5a5f', c2: '#c22a30', text: '#ffffff' },
  MakeMyTrip: { c1: '#eb2226', c2: '#990f12', text: '#ffffff' },
  'MakeMyTrip Hotels': { c1: '#eb2226', c2: '#990f12', text: '#ffffff' },
  Goibibo: { c1: '#f60', c2: '#a33e00', text: '#ffffff' },
  Yatra: { c1: '#ea2330', c2: '#a0141f', text: '#ffffff' },
  Cleartrip: { c1: '#e36b0a', c2: '#96440a', text: '#ffffff' },
  EaseMyTrip: { c1: '#00b1b7', c2: '#006b70', text: '#ffffff' },
  IRCTC: { c1: '#fb792b', c2: '#b35215', text: '#ffffff' },
  redBus: { c1: '#d84e55', c2: '#96222a', text: '#ffffff' },
  Instamart: { c1: '#fc8019', c2: '#c25800', text: '#ffffff' },
  SmartBazar: { c1: '#6a1b9a', c2: '#38006b', text: '#ffffff' },
  StarQuik: { c1: '#e53935', c2: '#9b1c1c', text: '#ffffff' },
  "Nature's Basket": { c1: '#689f38', c2: '#3b5e1f', text: '#ffffff' },
  "Spencer's": { c1: '#d32f2f', c2: '#8e1a1a', text: '#ffffff' },
  Licious: { c1: '#c62828', c2: '#7f1616', text: '#ffffff' },
  TenderCuts: { c1: '#ef5350', c2: '#b71c1c', text: '#ffffff' },
  FreshToHome: { c1: '#43a047', c2: '#255d28', text: '#ffffff' },
  Eatclub: { c1: '#f57c00', c2: '#a85500', text: '#ffffff' },
  BookMyShow: { c1: '#c62828', c2: '#7f1616', text: '#ffffff' },
  'PVR Cinemas': { c1: '#e91e63', c2: '#9c144e', text: '#ffffff' },
  INOX: { c1: '#3f51b5', c2: '#252f6a', text: '#ffffff' },
  'Paytm Insider': { c1: '#00b1b7', c2: '#006b70', text: '#ffffff' },
  TicketNew: { c1: '#ff6f00', c2: '#a34d00', text: '#ffffff' },
};

function hashTitle(title: string) {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h << 5) - h + title.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getStoredVotes(title: string) {
  const seed = hashTitle(title);
  const baseUp = (seed % 80) + 12;
  const baseDown = (seed % 15) + 3;
  if (typeof window === 'undefined') return { up: baseUp, down: baseDown, user: null as 'up' | 'down' | null };

  try {
    const raw = localStorage.getItem(`srone-vote-${title}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { up: parsed.up, down: parsed.down, user: parsed.user };
    }
  } catch {}

  return { up: baseUp, down: baseDown, user: null as 'up' | 'down' | null };
}

function setStoredVotes(title: string, up: number, down: number, user: 'up' | 'down' | null) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`srone-vote-${title}`, JSON.stringify({ up, down, user }));
}

export default function DealCard({
  deal,
  showAlert = true,
  premiumFeatures = true,
  isBest = false,
}: {
  deal: Deal;
  showAlert?: boolean;
  premiumFeatures?: boolean;
  isBest?: boolean;
}) {
  const brand = brands[deal.store] || { c1: '#f9a826', c2: '#ff6c37', text: '#1a1a2e' };
  const initial = deal.store.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  const [logoFailed, setLogoFailed] = useState(false);
  const [selectedCard, setSelectedCard] = useState(getSelectedCardName());
  const [alertOpen, setAlertOpen] = useState(false);
  const [votes, setVotes] = useState(getStoredVotes(deal.title));

  const history = useMemo(
    () => generatePriceHistory(deal.discountedPrice ?? 0),
    [deal.discountedPrice]
  );
  const cardDiscount = getCardDiscount(selectedCard);
  const finalPrice = Math.round((deal.discountedPrice ?? 0) * (1 - cardDiscount));

  const totalVotes = votes.up + votes.down;
  const helpfulPercent = totalVotes ? Math.round((votes.up / totalVotes) * 100) : 0;

  function handleCardChange(name: string) {
    setSelectedCard(name);
    setSelectedCardName(name);
  }

  function handleVote(type: 'up' | 'down') {
    let { up, down, user } = votes;
    if (user === type) return;
    if (user === 'up') up -= 1;
    if (user === 'down') down -= 1;
    if (type === 'up') up += 1;
    else down += 1;
    user = type;
    setStoredVotes(deal.title, up, down, user);
    setVotes({ up, down, user });
  }

  return (
    <>
      <div className="flex flex-col rounded-2xl overflow-hidden bg-brand-800/50 border border-white/10 card-hover">
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(deal.store, deal.title)}
          className="relative h-28 flex items-center px-6 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${brand.c1} 0%, ${brand.c2} 100%)` }}
        >
          <div
            className="absolute -right-4 -top-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          />
          <div
            className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full opacity-15"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          />
          {!logoFailed ? (
            <img
              src={getLogoUrl(deal.link)}
              alt={deal.store}
              loading="lazy"
              onError={() => setLogoFailed(true)}
              className="w-14 h-14 rounded-xl object-contain bg-white p-2 shadow-lg mr-4"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-extrabold mr-4 shadow-lg"
              style={{ background: 'rgba(255,255,255,0.92)', color: brand.c2 }}
            >
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80" style={{ color: brand.text }}>
              {deal.category}
            </p>
            <h3 className="text-xl font-extrabold leading-tight truncate" style={{ color: brand.text }}>
              {deal.store}
            </h3>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            {isBest && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 text-brand-900 shadow-md">
                Best Deal
              </span>
            )}
            <span
              className="px-3 py-1.5 rounded-full text-xs font-extrabold shadow-md"
              style={{ background: 'rgba(0,0,0,0.35)', color: '#ffffff' }}
            >
              {deal.discount}
            </span>
          </div>
        </a>

        <div className="flex flex-col flex-1 p-5">
          <h4 className="text-base font-bold text-white mb-1.5 leading-snug">{deal.title}</h4>
          <p className="text-sm text-gray-400 mb-3 leading-relaxed flex-1">{deal.ai_summary}</p>

          <div className="mb-3 flex items-baseline gap-2">
            {typeof deal.originalPrice === 'number' && (
              <span className="text-sm text-zinc-500 line-through">{formatPrice(deal.originalPrice)}</span>
            )}
            {typeof deal.discountedPrice === 'number' && (
              <span className="text-lg font-bold text-emerald-400">{formatPrice(deal.discountedPrice)}</span>
            )}
          </div>

          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">Select bank card</label>
            <div className="flex flex-wrap gap-1.5">
              {BANK_CARDS.map((card) => {
                const active = selectedCard === card.name;
                return (
                  <button
                    key={card.name}
                    onClick={() => handleCardChange(card.name)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {card.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-1.5 text-xs text-emerald-400">
              Final price with {selectedCard}: <strong>{formatPrice(finalPrice)}</strong>
              <span className="ml-1.5 text-zinc-500">(save {Math.round(cardDiscount * 100)}%)</span>
            </div>
          </div>

          {premiumFeatures && (
            <div className="mb-3 rounded-xl bg-zinc-900/50 p-2">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400">30-day price trend</p>
              <PriceChart data={history} />
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('up')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  votes.user === 'up' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.764 7.527a2 2 0 01-1.789 1.079H8.23a2 2 0 01-1.993-1.84L6 18V8.5a2 2 0 012-2h2.5" />
                </svg>
                {votes.up}
              </button>
              <button
                onClick={() => handleVote('down')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  votes.user === 'down' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.764-7.527A2 2 0 018.23 2.5h5.66a2 2 0 011.993 1.84L17 5.5V15a2 2 0 01-2 2h-2.5" />
                </svg>
                {votes.down}
              </button>
            </div>
            <span className="text-xs font-semibold text-indigo-400">{helpfulPercent}% helpful</span>
          </div>

          <div className="mb-3 flex gap-2">
            {showAlert && (
              <button
                onClick={() => setAlertOpen(true)}
                className="flex-1 rounded-lg border border-zinc-600 bg-transparent px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
              >
                Set Price Alert
              </button>
            )}
            <a
              href={deal.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(deal.store, deal.title)}
              className="flex-[2] inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${brand.c1} 0%, ${brand.c2} 100%)`, color: brand.text === '#1a1a2e' ? '#1a1a2e' : '#ffffff' }}
            >
              Grab Deal
            </a>
          </div>

          {premiumFeatures && (
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-accent">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Pick
              </span>
            </div>
          )}
        </div>
      </div>

      {showAlert && <PriceAlertModal open={alertOpen} onClose={() => setAlertOpen(false)} deal={deal} />}
    </>
  );
}
