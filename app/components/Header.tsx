'use client';

import { useEffect, useMemo, useState } from 'react';
import { storeCategories } from '../lib/stores';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const query = search.toLowerCase().trim();
  const filteredCategories = useMemo(() => {
    if (!query) return storeCategories;
    return storeCategories
      .map((c) => ({
        ...c,
        stores: c.stores.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)
        ),
      }))
      .filter(
        (c) =>
          c.stores.length > 0 ||
          c.name.toLowerCase().includes(query)
      );
  }, [query]);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-18 py-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle categories menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-accent to-[#ff6c37] flex items-center justify-center shadow-lg shadow-brand-accent/30 group-hover:scale-105 transition-transform">
              <span className="text-brand-900 font-extrabold text-sm tracking-tight">SR</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              SR<span className="text-brand-accent">One</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 ml-auto">
            <a href="#deals" className="text-sm font-medium text-gray-300 hover:text-brand-accent transition-colors">
              Deals
            </a>
            <a href="#about" className="text-sm font-medium text-gray-300 hover:text-brand-accent transition-colors">
              About
            </a>
            <a href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-brand-accent transition-colors">
              Dashboard
            </a>
            <a href="/premium" className="text-sm font-medium text-brand-accent hover:text-white transition-colors">
              Premium
            </a>
            <a
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Sign in
            </a>
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full sm:w-96 max-h-[80vh] overflow-y-auto glass border-t border-white/10">
          <div className="p-4 space-y-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.65 5.65a7.5 7.5 0 0011 11z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories & stores..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            {filteredCategories.length === 0 && (
              <p className="text-sm text-gray-400 py-2">No matching stores or categories.</p>
            )}

            {filteredCategories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-sm font-semibold text-gray-200 hover:bg-white/10 hover:text-brand-accent"
                >
                  {category.name}
                  <svg
                    className={`w-4 h-4 transition-transform ${openCategory === category.name ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openCategory === category.name && (
                  <div className="ml-4 mb-2 space-y-1">
                    {(category.stores.length > 0 ? category.stores : storeCategories.find((c) => c.name === category.name)?.stores || []).map((store) => (
                      <a
                        key={store.name}
                        href={store.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          try {
                            fetch('/api/track', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ store: store.name, deal: null, type: 'click' }),
                            });
                          } catch {}
                        }}
                        className="block px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white"
                      >
                        {store.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
