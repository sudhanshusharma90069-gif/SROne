'use client';

import { useState } from 'react';
import { computeCartPrices, formatPrice } from '../lib/prices';
import { getSavedItems } from '../lib/auto-list';

const STORE_META = [
  { key: 'blinkit', label: 'Blinkit', color: 'text-emerald-400', bestClass: 'border-emerald-500 bg-emerald-950/30' },
  { key: 'instamart', label: 'Swiggy Instamart', color: 'text-orange-400', bestClass: 'border-orange-500/60 bg-orange-950/20' },
  { key: 'bigbasket', label: 'BigBasket', color: 'text-lime-400', bestClass: 'border-lime-500/60 bg-lime-950/20' },
  { key: 'jiomart', label: 'JioMart', color: 'text-sky-400', bestClass: 'border-sky-500/60 bg-sky-950/20' },
] as const;

export default function CartOptimizer() {
  const [items, setItems] = useState('');
  const [result, setResult] = useState<{
    items: string[];
    blinkit: Record<string, number>;
    instamart: Record<string, number>;
    bigbasket: Record<string, number>;
    jiomart: Record<string, number>;
  } | null>(null);

  function handleCompare() {
    const list = items.split(',').map((i) => i.trim()).filter(Boolean);
    if (list.length === 0) return;
    const prices = computeCartPrices(list);
    setResult({ items: list, ...prices });
  }

  function autoFillFromSaved() {
    const names = getSavedItems()
      .filter((i) => i.selected)
      .map((i) => i.name)
      .join(', ');
    setItems(names);
    if (names) {
      const list = names.split(',').map((i) => i.trim()).filter(Boolean);
      const prices = computeCartPrices(list);
      setResult({ items: list, ...prices });
    }
  }

  const totals = result
    ? STORE_META.map((s) => ({
        ...s,
        total: Object.values(result[s.key]).reduce((a, b) => a + b, 0),
      }))
    : [];

  const cheapest = totals.length ? totals.reduce((a, b) => (a.total <= b.total ? a : b)) : null;

  return (
    <section id="cart-optimizer" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">Multi-Store Basket AI</span>
            <h2 className="text-2xl font-extrabold text-white mt-1">Smart Grocery Cart Optimizer</h2>
            <p className="text-sm text-gray-400 mt-1">
              Compare basket totals across Blinkit, Swiggy Instamart, BigBasket and JioMart.
            </p>
          </div>
          <button
            onClick={autoFillFromSaved}
            className="bg-brand-accent/15 border border-brand-accent/40 text-brand-accent hover:bg-brand-accent/25 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            ✨ Auto-Fill From My Past Orders
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            placeholder="e.g. Aashirvaad Atta 10kg, Amul Butter 500g, Fortune Oil 5L"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
          />
          <button
            onClick={handleCompare}
            className="rounded-xl bg-brand-accent text-brand-900 font-bold px-6 py-3 text-sm hover:bg-brand-accent-hover transition"
          >
            Compare Prices Now
          </button>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {totals.map((s) => (
                <div
                  key={s.key}
                  className={`p-4 rounded-xl border ${cheapest?.key === s.key ? s.bestClass : 'bg-black/40 border-white/10'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">{s.label}</span>
                    {cheapest?.key === s.key && (
                      <span className="text-[10px] bg-emerald-500 text-black font-extrabold px-2 py-0.5 rounded-full">CHEAPEST</span>
                    )}
                  </div>
                  <div className={`text-2xl font-extrabold my-1 ${cheapest?.key === s.key ? s.color : 'text-white'}`}>
                    {formatPrice(s.total)}
                  </div>
                  <div className="text-xs text-gray-400">{result.items.length} items</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-emerald-900/20 border border-emerald-500/20 p-4 text-sm text-emerald-400">
              Best basket: <strong>{cheapest?.label}</strong> — aapke list par sabse sasta total.
            </div>
          </>
        )}
      </div>
    </section>
  );
}
