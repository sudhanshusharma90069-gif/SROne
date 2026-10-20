'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import FestivalBanner from '../components/FestivalBanner';
import Footer from '../sections/Footer';
import Deals from '../sections/Deals';

export default function FreeDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [dealsCount, setDealsCount] = useState(0);
  const [categories, setCategories] = useState(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user));
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => {
        const list = d.deals || [];
        setDealsCount(list.length);
        setCategories(new Set(list.map((x: { category: string }) => x.category)).size);
      });
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  const liveStats = [
    { value: dealsCount.toString(), label: 'Live Deals' },
    { value: categories.toString(), label: 'Categories' },
    { value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Free', label: 'Plan' },
    { value: '100%', label: 'Free to Use' },
  ];

  return (
    <div className="min-h-screen bg-brand-900 text-white">
      <FestivalBanner />
      <Header />

      <main>
        <section className="relative pt-24 pb-16 dot-grid hero-glow overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {user ? `Welcome back, ${user.name}` : 'Your personal free dashboard'}
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-[#ff6c37] flex items-center justify-center shadow-lg shadow-brand-accent/20">
                <span className="text-brand-900 font-extrabold text-lg">SR</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Free <span className="gradient-text">Dashboard</span>
              </h1>
            </div>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
              Browse AI-curated deals with real store logos, price alerts, card discounts and 30-day price charts — just like the home page.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a
                href="/subscribe"
                className="px-8 py-4 rounded-xl bg-brand-accent text-brand-900 font-bold text-lg hover:bg-brand-accent-hover transition-all hover:scale-105 shadow-lg shadow-brand-accent/20"
              >
                Upgrade to Premium
              </a>
              <button
                onClick={logout}
                className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
              >
                Logout
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {liveStats.map((s) => (
                <div key={s.label} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <p className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1">{s.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Deals showAlert={false} />
      </main>

      <Footer />
    </div>
  );
}
