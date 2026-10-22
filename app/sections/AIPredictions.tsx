'use client';

import { useEffect, useState } from 'react';
import { getTopCategories, getUsage, UsageMap } from '../lib/usage';
import { getSavedItems, SavedItem } from '../lib/auto-list';

function scrollToDeals(category?: string) {
  const el = document.getElementById('deals');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  if (category) {
    const map = getUsage();
    map[category] = (map[category] || 0) + 3;
    localStorage.setItem('srone-usage', JSON.stringify(map));
    window.dispatchEvent(new Event('srone-usage'));
  }
}

export default function AIPredictions() {
  const [usage, setUsage] = useState<UsageMap>({});
  const [saved, setSaved] = useState<SavedItem[]>([]);

  const load = () => {
    setUsage(getUsage());
    setSaved(getSavedItems());
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('srone-usage', handler);
    return () => window.removeEventListener('srone-usage', handler);
  }, []);

  const sorted = Object.entries(usage)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score);

  const top = sorted[0]?.name || 'Groceries';
  const second = sorted[1]?.name || 'Mobiles';
  const restock = saved[0] || { name: 'Aashirvaad Atta 10kg', bestStore: 'BigBasket', nextDue: 'Restock soon' };

  return (
    <section id="ai-predictions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <span>🧠</span> AI Usage & Habit Prediction Model
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Aapke Sabse Zyada Use Kiye Gaye Categories & Predictions</h2>
          <p className="text-gray-400 text-sm">Jis category ko aap sabse zyada click ya order karte hain, AI uske deals automatically sabse upar rakhta hai.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {sorted.slice(0, 4).map((cat, idx) => (
            <span
              key={cat.name}
              className={`px-3 py-1 rounded-full border ${idx === 0 ? 'bg-brand-accent/20 border-brand-accent text-brand-accent font-bold' : 'bg-white/5 border-white/10 text-gray-300'}`}
            >
              #{idx + 1} {cat.name} ({cat.score})
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-brand-800/50 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full">Top Habit: {top}</span>
            <h3 className="font-bold text-white text-base mt-3">Aap {top} sabse zyada use karte hain — Extra Cashback Unlocked</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              AI ne notice kiya hai ki aapki activity {top} mein hai. JioMart aur Blinkit ke sabse saste deals upar pin kar diye gaye hain.
            </p>
          </div>
          <button onClick={() => scrollToDeals(top)} className="mt-4 w-full bg-black/50 hover:bg-brand-accent hover:text-black text-gray-200 border border-white/10 py-2 rounded-xl text-xs font-bold transition">
            {top} Deals &rarr;
          </button>
        </div>

        <div className="bg-brand-800/50 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full">2nd Most Used: {second}</span>
            <h3 className="font-bold text-white text-base mt-3">{second} Price Drop Prediction: Agle 6 ghante best time hai</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Price history ke mutabiq {second} par abhi 30-day low price chal raha hai. ICICI aur HDFC card par extra 12% instant discount live hai.
            </p>
          </div>
          <button onClick={() => scrollToDeals(second)} className="mt-4 w-full bg-black/50 hover:bg-brand-accent hover:text-black text-gray-200 border border-white/10 py-2 rounded-xl text-xs font-bold transition">
            Explore {second} &rarr;
          </button>
        </div>

        <div className="bg-brand-800/50 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full">Smart Restock Alert</span>
            <h3 className="font-bold text-white text-base mt-3">{restock.name} khatam hone wala hoga!</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Pichle mahine aapne reorder kiya tha. Aaj {restock.bestStore} par {restock.name} par best price live hai.
            </p>
          </div>
          <button onClick={() => scrollToDeals()} className="mt-4 w-full bg-black/50 hover:bg-brand-accent hover:text-black text-gray-200 border border-white/10 py-2 rounded-xl text-xs font-bold transition">
            Go To Auto-List &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
