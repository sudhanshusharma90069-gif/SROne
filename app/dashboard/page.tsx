'use client';

import { useEffect, useState } from 'react';
import { Deal } from '../lib/types';
import { formatPrice } from '../lib/prices';

interface AlertState {
  deal: string;
  target: string;
  phone: string;
  status: string;
}

export default function FreeDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [query, setQuery] = useState('');
  const [alert, setAlert] = useState<AlertState>({ deal: '', target: '', phone: '', status: '' });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user));
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => setDeals(d.deals || []));
  }, []);

  const filtered = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.store.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase())
  );

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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Free <span className="text-brand-accent">Dashboard</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Welcome back, {user?.name || 'Guest'} · Find the best deals and track prices.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role !== 'premium' && (
              <a
                href="/premium"
                className="rounded-full bg-gradient-to-r from-brand-accent to-[#ff6c37] px-5 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-brand-accent/20 hover:opacity-90"
              >
                Upgrade to Premium
              </a>
            )}
            <button
              onClick={logout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-zinc-400">Total Deals</p>
            <p className="text-2xl font-bold">{deals.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-zinc-400">Categories</p>
            <p className="text-2xl font-bold">{new Set(deals.map((d) => d.category)).size}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-zinc-400">Saved Alerts</p>
            <p className="text-2xl font-bold">{alert.status ? '1' : '0'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-zinc-400">Your Plan</p>
            <p className="text-2xl font-bold capitalize">{user?.role || 'Free'}</p>
          </div>
        </div>

        <div className="mb-8 relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
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
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-brand-accent"
          />
        </div>

        {filtered.length === 0 && query && (
          <p className="mb-6 text-center text-sm text-zinc-400">No matching deals found.</p>
        )}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deal, i) => (
            <a
              key={i}
              href={deal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-brand-accent/30 hover:bg-white/[0.07]"
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
              <p className="mb-4 line-clamp-2 text-sm text-zinc-400">{deal.ai_summary}</p>
              <div className="mt-auto flex items-baseline gap-2">
                {deal.discountedPrice && <span className="text-xl font-bold text-emerald-400">{formatPrice(deal.discountedPrice)}</span>}
                {deal.originalPrice && <span className="text-sm text-zinc-600 line-through">{formatPrice(deal.originalPrice)}</span>}
              </div>
            </a>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 md:p-8">
          <h2 className="mb-2 text-xl font-bold">Standard Price Drop Alert</h2>
          <p className="mb-6 text-sm text-zinc-400">We will notify you on WhatsApp when the price drops.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              value={alert.deal}
              onChange={(e) => setAlert({ ...alert, deal: e.target.value })}
              placeholder="Deal name"
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-brand-accent"
            />
            <input
              type="number"
              value={alert.target}
              onChange={(e) => setAlert({ ...alert, target: e.target.value })}
              placeholder="Target price"
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-brand-accent"
            />
            <input
              type="tel"
              value={alert.phone}
              onChange={(e) => setAlert({ ...alert, phone: e.target.value })}
              placeholder="WhatsApp number"
              className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-brand-accent"
            />
          </div>
          <button
            onClick={setPriceAlert}
            className="mt-5 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Set Standard Alert
          </button>
          {alert.status && <p className="mt-3 text-sm text-emerald-400">{alert.status}</p>}
        </div>
      </div>
    </main>
  );
}
