import { Deal } from '../lib/types';

function trackClick(store: string, deal: string) {
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store, deal, type: 'click' }),
    });
  } catch {}
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
};

export default function DealCard({ deal }: { deal: Deal }) {
  const brand = brands[deal.store] || { c1: '#f9a826', c2: '#ff6c37', text: '#1a1a2e' };
  const initial = deal.store.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-brand-800/50 border border-white/10 card-hover">
      <div
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
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-extrabold mr-4 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.92)', color: brand.c2 }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80" style={{ color: brand.text }}>
            {deal.category}
          </p>
          <h3 className="text-xl font-extrabold leading-tight truncate" style={{ color: brand.text }}>
            {deal.store}
          </h3>
        </div>
        <span
          className="ml-auto px-3 py-1.5 rounded-full text-xs font-extrabold shadow-md shrink-0"
          style={{ background: 'rgba(0,0,0,0.35)', color: '#ffffff' }}
        >
          {deal.discount}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h4 className="text-base font-bold text-white mb-1.5 leading-snug">{deal.title}</h4>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-1">{deal.ai_summary}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-accent">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Pick
          </span>
        </div>
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(deal.store, deal.title)}
          className="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-lg font-semibold transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${brand.c1} 0%, ${brand.c2} 100%)`, color: brand.text === '#1a1a2e' ? '#1a1a2e' : '#ffffff' }}
        >
          Grab Deal
        </a>
      </div>
    </div>
  );
}
