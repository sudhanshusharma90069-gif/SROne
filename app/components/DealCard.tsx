import { Deal } from '../lib/types';

export default function DealCard({ deal }: { deal: Deal }) {
  const colors: Record<string, string> = {
    Amazon: 'border-l-[#ff9900]',
    Flipkart: 'border-l-[#2874f0]',
    Meesho: 'border-l-[#9f2089]',
    Snapdeal: 'border-l-[#e40046]',
    ShopClues: 'border-l-[#f37021]',
    IndiaMART: 'border-l-[#d32f2f]',
    Myntra: 'border-l-[#ff3f6c]',
    Ajio: 'border-l-[#2a3d51]',
    'Tata CLiQ': 'border-l-[#0a0a0a]',
    LimeRoad: 'border-l-[#ff5a5f]',
    Nykaa: 'border-l-[#fc2779]',
    Purplle: 'border-l-[#4e0d3a]',
    Blinkit: 'border-l-[#f8cb46]',
    Zepto: 'border-l-[#6c3cf7]',
    BigBasket: 'border-l-[#84c225]',
    JioMart: 'border-l-[#0078ad]',
    Swiggy: 'border-l-[#fc8019]',
    Zomato: 'border-l-[#e23744]',
    "Domino's": 'border-l-[#006491]',
    Rominos: 'border-l-[#e31837]',
    'Reliance Digital': 'border-l-[#e71d1d]',
    Lenskart: 'border-l-[#00a0e3]',
    FirstCry: 'border-l-[#ef8236]',
    Pepperfry: 'border-l-[#ff6c37]',
    Uber: 'border-l-[#000000]',
    Rapido: 'border-l-[#f7b32b]',
    Shopify: 'border-l-[#96bf48]',
    'OYO Rooms': 'border-l-[#ef3e5b]',
    'Booking.com': 'border-l-[#003580]',
    Airbnb: 'border-l-[#ff5a5f]',
    MakeMyTrip: 'border-l-[#eb2226]',
    Goibibo: 'border-l-[#f60]',
    Yatra: 'border-l-[#ea2330]',
    Cleartrip: 'border-l-[#e36b0a]',
    EaseMyTrip: 'border-l-[#00b1b7]',
    IRCTC: 'border-l-[#fb792b]',
    redBus: 'border-l-[#d84e55]',
    'MakeMyTrip Hotels': 'border-l-[#eb2226]',
  };

  return (
    <div
      className={`relative flex flex-col p-6 rounded-2xl bg-brand-800/50 border border-white/10 border-l-4 ${colors[deal.store] || 'border-l-brand-accent'} card-hover`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-300">{deal.store}</span>
        <span className="px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-bold">
          {deal.discount}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 leading-snug">{deal.title}</h3>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-1">{deal.ai_summary}</p>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{deal.category}</span>
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
        className="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-lg bg-white text-brand-900 font-semibold hover:bg-brand-accent-hover transition-colors"
      >
        Grab Deal
      </a>
    </div>
  );
}
