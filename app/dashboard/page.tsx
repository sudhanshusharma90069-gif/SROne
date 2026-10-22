'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../sections/Footer';
import Deals from '../sections/Deals';
import ChatWidget from '../components/ChatWidget';

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
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-indigo-500/20 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {user ? `Welcome back, ${user.name}` : 'Your personal free dashboard'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Free Dashboard
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
              Browse the latest AI-curated deals from 70+ Indian stores. Upgrade to Premium for habit predictions, auto-list and advanced analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a
                href="/subscribe"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105 shadow-lg shadow-indigo-600/20"
              >
                Upgrade to Premium
              </a>
              <button
                onClick={logout}
                className="px-8 py-4 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-900 transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {liveStats.map((s) => (
                <div
                  key={s.label}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 mb-1">
                    {s.value}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Deals showAlert={false} premiumFeatures={false} enableSmartFeatures={false} />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
