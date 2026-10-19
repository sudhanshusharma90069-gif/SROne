'use client';

import { useEffect, useState } from 'react';
import { storeCategories } from '../lib/stores';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

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
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full sm:w-96 max-h-[80vh] overflow-y-auto glass border-t border-white/10">
          <div className="p-4 space-y-1">
            {storeCategories.map((category) => (
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
                    {category.stores.map((store) => (
                      <a
                        key={store.name}
                        href={store.link}
                        target="_blank"
                        rel="noopener noreferrer"
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
