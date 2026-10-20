'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import FestivalBanner from '../components/FestivalBanner';
import Footer from '../sections/Footer';
import { Deal } from '../lib/types';
import { formatPrice } from '../lib/prices';

const stats = [
  { value: '0', label: 'Saved Alerts' },
  { value: '0', label: 'Categories' },
  { value: 'Free', label: 'Plan' },
  { value: '100%', label: 'Free to Use' },
];

export default function FreeDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [query, setQuery] = useState('');
  const [alert, setAlert] = useState({ deal: '', target: '', phone: '', status: '' });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user));
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => {
        setDeals(d.deals || []);
        setReady(true);
      });
  }, []);

  const filtered = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.store.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase())
  );

  const liveStats = [
    { value: deals.length.toString(), label: 'Live Deals' },
    { value: new Set(deals.map((d) => d.category)).size.toString(), label: 'Categories' },
    { value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Free', label: 'Plan' },
    { value: '100%', label: 'Free to Use' },
  ];

  async function setPriceAlert() {
    if (!alert.deal || !alert.target || !alert.phone) return;
    const res = await fetch('/api/whatsapp-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealTitle: alert.deal,
        targetPrice: Number(alert.target),
        whatsappNumber: alert.phone,
        priority: 'standard',
      }),
    });
    const data = await res.json();
    setAlert({ ...alert, status: data.success ? 'Standard alert saved' : 'Failed' });
    setTimeout(() => setAlert({ ...alert, status: '' }), 3000);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

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
              Search the latest AI-curated deals and set standard WhatsApp price drop alerts — all in one clean view.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a
                href="/premium"
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

        <section className="py-20 lg:py-28 bg-brand-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent text-xs font-bold uppercase tracking-wider mb-4">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.65 5.65a7.5 7.5 0 0011 11z" />
                </svg>
                Search deals
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Find Your Next Save</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Search across stores, titles and categories instantly.</p>
            </div>

            <div className="max-w-xl mx-auto mb-10">
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
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search deals by store, title or category..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-accent transition-colors"
              />
              </div>
            </div>

            {!ready ? (
              <p className="text-center text-gray-400 py-12">Loading latest deals...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No deals match your search.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((deal, i) => (
                  <a
                    key={i}
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 card-hover"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{deal.store}</span>
                      <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-bold text-brand-accent">
                        {deal.discount}
                      </span>
                    </div>
                    <h3 className="mb-2 text-base font-semibold leading-snug text-white group-hover:text-brand-accent transition-colors">
                      {deal.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-400">{deal.ai_summary}</p>
                    <div className="mt-auto flex items-baseline gap-2">
                      {deal.discountedPrice && <span className="text-xl font-bold text-emerald-400">{formatPrice(deal.discountedPrice)}</span>}
                      {deal.originalPrice && <span className="text-sm text-zinc-600 line-through">{formatPrice(deal.originalPrice)}</span>}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Standard Price Drop Alert</h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Set a target price for any deal and get a WhatsApp message when it drops. Free users get standard alerts.
                </p>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">✓</span>
                    Save any product
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">✓</span>
                    One WhatsApp number
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">✓</span>
                    No spam, only price drops
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <h3 className="mb-6 text-lg font-bold">Create Alert</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={alert.deal}
                    onChange={(e) => setAlert({ ...alert, deal: e.target.value })}
                    placeholder="Deal name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                  <input
                    type="number"
                    value={alert.target}
                    onChange={(e) => setAlert({ ...alert, target: e.target.value })}
                    placeholder="Target price"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                  <input
                    type="tel"
                    value={alert.phone}
                    onChange={(e) => setAlert({ ...alert, phone: e.target.value })}
                    placeholder="WhatsApp number"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
                <button
                  onClick={setPriceAlert}
                  className="mt-5 w-full rounded-xl bg-brand-accent py-3 text-sm font-bold text-brand-900 hover:bg-brand-accent-hover transition-colors"
                >
                  Set Standard Alert
                </button>
                {alert.status && <p className="mt-3 text-sm text-emerald-400">{alert.status}</p>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
