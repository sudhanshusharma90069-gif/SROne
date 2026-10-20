'use client';

import { useEffect, useState } from 'react';
import { Deal } from '../lib/types';

export default function FreeDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [query, setQuery] = useState('');
  const [alert, setAlert] = useState({ deal: '', target: '', phone: '', status: '' });

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
    setAlert({ ...alert, status: data.success ? 'Alert saved' : 'Failed' });
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Free Dashboard</h1>
            <p className="text-sm text-zinc-400">Welcome, {user?.name || 'Guest'}</p>
          </div>
          <a
            href="/premium"
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              user?.role === 'premium'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {user?.role === 'premium' ? 'Go Premium' : 'Upgrade to Premium'}
          </a>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals by store, title or category..."
            className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 12).map((deal, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-zinc-400">{deal.store}</p>
              <h3 className="text-sm font-semibold">{deal.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{deal.discount}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold">Standard Price Drop Alert</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              value={alert.deal}
              onChange={(e) => setAlert({ ...alert, deal: e.target.value })}
              placeholder="Deal name"
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              value={alert.target}
              onChange={(e) => setAlert({ ...alert, target: e.target.value })}
              placeholder="Target price"
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <input
              type="tel"
              value={alert.phone}
              onChange={(e) => setAlert({ ...alert, phone: e.target.value })}
              placeholder="WhatsApp number"
              className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={setPriceAlert}
            className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Set Standard Alert
          </button>
          {alert.status && <p className="mt-2 text-sm text-emerald-400">{alert.status}</p>}
        </div>
      </div>
    </main>
  );
}
