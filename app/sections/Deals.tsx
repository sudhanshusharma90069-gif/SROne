'use client';

import { useEffect, useMemo, useState } from 'react';
import DealCard from '../components/DealCard';
import { Deal } from '../lib/types';

export default function Deals({
  showAlert = true,
  premiumFeatures = true,
}: {
  showAlert?: boolean;
  premiumFeatures?: boolean;
}) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        setDeals(data.deals);
      } catch (err) {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(deals.map((d) => d.category)))],
    [deals]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return deals.filter(
      (d) =>
        (activeCategory === 'All' || d.category === activeCategory) &&
        (!q ||
          d.store.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q))
    );
  }, [deals, query, activeCategory]);

  return (
    <section id="deals" className="py-20 lg:py-28 bg-brand-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent text-xs font-bold uppercase tracking-wider mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Live deals
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">AI-Classified Best Deals</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Only the best offers — picked and summarized by AI across 70+ stores.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.65 5.65a7.5 7.5 0 0011 11z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deals, stores, categories..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-accent transition-colors"
            />
          </div>
        </div>

        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                  activeCategory === c
                    ? 'bg-brand-accent text-brand-900 border-brand-accent'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-brand-accent/50 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading latest deals...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No deals match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deal, index) => (
              <DealCard key={index} deal={deal} showAlert={showAlert} premiumFeatures={premiumFeatures} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
