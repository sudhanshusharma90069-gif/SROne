'use client';

import { useEffect, useState } from 'react';
import { getActiveFestival, Festival } from '../lib/festivals';

export default function FestivalBanner() {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setFestival(getActiveFestival());
  }, []);

  if (!festival || dismissed) return null;

  return (
    <div className="relative z-40 bg-gradient-to-r from-brand-accent via-[#ff6c37] to-brand-accent animate-[pulse_4s_ease-in-out_infinite]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-center gap-3 text-center">
        <span className="text-xl">{festival.emoji}</span>
        <p className="text-sm sm:text-base font-bold text-brand-900">
          {festival.name} — <span className="font-medium">{festival.wish}</span>
        </p>
        <a
          href="#deals"
          className="px-4 py-1.5 rounded-full bg-brand-900 text-brand-accent text-xs font-bold hover:bg-black transition-colors"
        >
          {festival.cta}
        </a>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss festival banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-900/70 hover:text-brand-900 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
