'use client';

import { useState } from 'react';
import { computeCartPrices, formatPrice } from '../lib/prices';

export default function CartOptimizer() {
  const [items, setItems] = useState('');
  const [result, setResult] = useState<{ items: string[]; blinkit: Record<string, number>; instamart: Record<string, number> } | null>(null);

  function handleCompare() {
    const list = items.split(',').map((i) => i.trim()).filter(Boolean);
    if (list.length === 0) return;
    const prices = computeCartPrices(list);
    setResult({ items: list, ...prices });
  }

  const blinkitTotal = result ? Object.values(result.blinkit).reduce((a, b) => a + b, 0) : 0;
  const instamartTotal = result ? Object.values(result.instamart).reduce((a, b) => a + b, 0) : 0;
  const cheaper = blinkitTotal <= instamartTotal ? 'Blinkit' : 'Swiggy Instamart';
  const savings = Math.abs(blinkitTotal - instamartTotal);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-10">
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Grocery Cart Optimizer</h2>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          Compare your basket between Blinkit and Swiggy Instamart before you order.
        </p>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            placeholder="e.g. milk, bread, eggs, rice, apples"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            onClick={handleCompare}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Compare Prices
          </button>
        </div>

        {result && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">Blinkit</h3>
              <ul className="space-y-2 text-sm">
                {result.items.map((item) => (
                  <li key={item} className="flex justify-between text-zinc-700 dark:text-zinc-300">
                    <span className="capitalize">{item}</span>
                    <span>{formatPrice(result.blinkit[item])}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-zinc-200 pt-3 text-right font-bold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
                {formatPrice(blinkitTotal)}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">Swiggy Instamart</h3>
              <ul className="space-y-2 text-sm">
                {result.items.map((item) => (
                  <li key={item} className="flex justify-between text-zinc-700 dark:text-zinc-300">
                    <span className="capitalize">{item}</span>
                    <span>{formatPrice(result.instamart[item])}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-zinc-200 pt-3 text-right font-bold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
                {formatPrice(instamartTotal)}
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
            Cheapest: <strong>{cheaper}</strong> saves you <strong>{formatPrice(savings)}</strong>
          </div>
        )}
      </div>
    </section>
  );
}
