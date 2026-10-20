'use client';

import { useState } from 'react';
import { Store } from '../lib/types';

function getLogoUrl(link: string) {
  try {
    const { hostname } = new URL(link);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return '';
  }
}

export default function StoreCard({ store }: { store: Store }) {
  const colors: Record<string, string> = {
    Amazon: 'bg-[#ff9900]',
    Flipkart: 'bg-[#2874f0]',
    Meesho: 'bg-[#9f2089]',
    Snapdeal: 'bg-[#e40046]',
    ShopClues: 'bg-[#f37021]',
    IndiaMART: 'bg-[#d32f2f]',
    Myntra: 'bg-[#ff3f6c]',
    Ajio: 'bg-[#2a3d51]',
    'Tata CLiQ': 'bg-[#0a0a0a] border border-white/20',
    LimeRoad: 'bg-[#ff5a5f]',
    Nykaa: 'bg-[#fc2779]',
    Purplle: 'bg-[#4e0d3a]',
    Blinkit: 'bg-[#f8cb46] text-brand-900',
    Zepto: 'bg-[#6c3cf7]',
    BigBasket: 'bg-[#84c225]',
    JioMart: 'bg-[#0078ad]',
    Swiggy: 'bg-[#fc8019]',
    Zomato: 'bg-[#e23744]',
    "Domino's": 'bg-[#006491]',
    Rominos: 'bg-[#e31837]',
    'Reliance Digital': 'bg-[#e71d1d]',
    Lenskart: 'bg-[#00a0e3]',
    FirstCry: 'bg-[#ef8236]',
    Pepperfry: 'bg-[#ff6c37]',
    Uber: 'bg-[#000000] border border-white/20',
    Rapido: 'bg-[#f7b32b] text-brand-900',
    Shopify: 'bg-[#96bf48]',
    'OYO Rooms': 'bg-[#ef3e5b]',
    'Booking.com': 'bg-[#003580]',
    Airbnb: 'bg-[#ff5a5f]',
    MakeMyTrip: 'bg-[#eb2226]',
    'MakeMyTrip Hotels': 'bg-[#eb2226]',
    Goibibo: 'bg-[#f60]',
    Yatra: 'bg-[#ea2330]',
    Cleartrip: 'bg-[#e36b0a]',
    EaseMyTrip: 'bg-[#00b1b7]',
    IRCTC: 'bg-[#fb792b]',
    redBus: 'bg-[#d84e55]',
    Instamart: 'bg-[#ff6600]',
    'Smart Bazar': 'bg-[#0066cc]',
    StarQuik: 'bg-[#00a651]',
    "Nature's Basket": 'bg-[#8bc34a]',
    "Spencer's": 'bg-[#e91e63]',
    Licious: 'bg-[#d32f2f]',
    TenderCuts: 'bg-[#f57c00]',
    FreshToHome: 'bg-[#4caf50]',
    Eatclub: 'bg-[#ff6b6b]',
    'Swiggy One': 'bg-[#fc8019]',
    'Zomato Gold': 'bg-[#e23744]',
    BookMyShow: 'bg-[#d32f2f]',
    'PVR Cinemas': 'bg-[#e91e63]',
    INOX: 'bg-[#3f51b5]',
    'Paytm Insider': 'bg-[#00b4f0]',
    TicketNew: 'bg-[#f44336]',
    'IRCTC E-Catering': 'bg-[#fb792b]',
    Zoop: 'bg-[#4caf50]',
    RailRestro: 'bg-[#ff9800]',
    TravelKhana: 'bg-[#795548]',
    RailYatri: 'bg-[#2196f3]',
    'Air India': 'bg-[#e91e63]',
    IndiGo: 'bg-[#3f51b5]',
    Paytm: 'bg-[#00b4f0]',
    PhonePe: 'bg-[#5f259f]',
    'Google Pay': 'bg-[#4285f4]',
    'Amazon Pay': 'bg-[#ff9900]',
    Freecharge: 'bg-[#ff6f00]',
    MobiKwik: 'bg-[#00b8f0]',
    CRED: 'bg-[#1a1a1a] border border-white/20',
    'Bajaj Finserv': 'bg-[#0091ea]',
    'Airtel Thanks': 'bg-[#ff0000]',
    MyJio: 'bg-[#0078ad]',
    Vi: 'bg-[#f05a28]',
    BSNL: 'bg-[#01579b]',
    YouTube: 'bg-[#ff0000]',
    Instagram: 'bg-[#e1306c]',
    Facebook: 'bg-[#1877f2]',
    'X (Twitter)': 'bg-[#000000] border border-white/20',
    WhatsApp: 'bg-[#25d366]',
    Telegram: 'bg-[#0088cc]',
    LinkedIn: 'bg-[#0a66c2]',
    Snapchat: 'bg-[#fffc00] text-brand-900',
    Pinterest: 'bg-[#e60023]',
    Reddit: 'bg-[#ff4500]',
    Quora: 'bg-[#b92b27]',
    Discord: 'bg-[#5865f2]',
    'Disney+ Hotstar': 'bg-[#1f80e0]',
    JioTV: 'bg-[#0078ad]',
    Netflix: 'bg-[#e50914]',
    'Amazon Prime Video': 'bg-[#00a8e1]',
    SonyLIV: 'bg-[#000000] border border-white/20',
    Zee5: 'bg-[#724ae3]',
    JioCinema: 'bg-[#0078ad]',
    Voot: 'bg-[#4a148c]',
    'Sun NXT': 'bg-[#ff0000]',
    'MX Player': 'bg-[#000000] border border-white/20',
    Aha: 'bg-[#ff6f00]',
    Hoichoi: 'bg-[#ff5722]',
    AltBalaji: 'bg-[#e91e63]',
    ShemarooMe: 'bg-[#f06292]',
    'Discovery+': 'bg-[#1976d2]',
    'Lionsgate Play': 'bg-[#ff6f00]',
  };

  const [logoFailed, setLogoFailed] = useState(false);
  const firstLetter = store.name[0];

  return (
    <a
      href={store.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 card-hover overflow-hidden"
    >
      <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex flex-col items-center text-center">
        {!logoFailed ? (
          <img
            src={getLogoUrl(store.link)}
            alt={store.name}
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className="w-16 h-16 rounded-2xl object-contain bg-white p-2 shadow-lg mb-4"
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg mb-4 ${
              colors[store.name] || 'bg-brand-600'
            }`}
          >
            {firstLetter}
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-2">{store.name}</h3>
        <p className="text-sm text-gray-400 mb-5 leading-relaxed">{store.description}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent group-hover:translate-x-1 transition-transform">
          Shop Now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </a>
  );
}
