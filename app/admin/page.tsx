'use client';

import { useState } from 'react';
import { COMMISSION_RATES } from '../lib/affiliates';

interface Stats {
  total_clicks: number;
  by_store: Record<string, number>;
  by_deal: Record<string, number>;
  recent_clicks: { store: string; deal: string | null; ts: string; ua: string }[];
  earnings: { store: string; amount: number; order_value: number; ts: string }[];
  total_earnings: number;
  total_order_value: number;
}

export default function Admin() {
  const [key, setKey] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [earning, setEarning] = useState({ store: '', amount: '', order_value: '' });

  const load = async () => {
    const res = await fetch(`/api/track?key=${encodeURIComponent(key)}`);
    if (!res.ok) {
      setError('Wrong admin key');
      return;
    }
    setError('');
    setStats(await res.json());
  };

  const logEarning = async () => {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store: earning.store,
        amount: parseFloat(earning.amount) || 0,
        order_value: parseFloat(earning.order_value) || 0,
        type: 'earning',
      }),
    });
    setEarning({ store: '', amount: '', order_value: '' });
    load();
  };

  if (!stats) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-8 rounded-2xl bg-brand-800/60 border border-white/10">
          <h1 className="text-2xl font-bold mb-1">SROne Admin</h1>
          <p className="text-sm text-gray-400 mb-6">Enter admin key to view earnings & clicks.</p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder="Admin key"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white mb-3 outline-none focus:border-brand-accent"
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button onClick={load} className="w-full py-3 rounded-lg bg-brand-accent text-brand-900 font-bold">
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">SROne Admin Dashboard</h1>
        <button onClick={load} className="px-4 py-2 rounded-lg bg-white/10 text-sm">Refresh</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          ['Total Clicks', stats.total_clicks],
          ['Stores Clicked', Object.keys(stats.by_store).length],
          ['Total Order Value', `₹${stats.total_order_value}`],
          ['Total Earnings', `₹${stats.total_earnings}`],
        ].map(([l, v]) => (
          <div key={l} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
            <p className="text-2xl font-extrabold gradient-text">{v}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <h2 className="font-bold mb-4">Clicks by Store (est. commission rate)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase text-left">
                <th className="pb-2">Store</th>
                <th className="pb-2">Clicks</th>
                <th className="pb-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.by_store)
                .sort((a, b) => b[1] - a[1])
                .map(([store, count]) => (
                  <tr key={store} className="border-t border-white/5">
                    <td className="py-2">{store}</td>
                    <td className="py-2 text-gray-400">{count}</td>
                    <td className="py-2 text-brand-accent">{COMMISSION_RATES[store] ?? '—'}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <h2 className="font-bold mb-4">Log an Earning</h2>
            <div className="space-y-3">
              <input
                value={earning.store}
                onChange={(e) => setEarning({ ...earning, store: e.target.value })}
                placeholder="Store name (e.g. Amazon)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={earning.order_value}
                  onChange={(e) => setEarning({ ...earning, order_value: e.target.value })}
                  placeholder="Order value ₹"
                  type="number"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                />
                <input
                  value={earning.amount}
                  onChange={(e) => setEarning({ ...earning, amount: e.target.value })}
                  placeholder="Commission ₹"
                  type="number"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
                />
              </div>
              <button onClick={logEarning} className="w-full py-2.5 rounded-lg bg-brand-accent text-brand-900 font-bold text-sm">
                Add Earning
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <h2 className="font-bold mb-4">Recent Clicks</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recent_clicks.length === 0 && <p className="text-sm text-gray-500">No clicks yet.</p>}
              {stats.recent_clicks.map((c, i) => (
                <div key={i} className="text-xs text-gray-400 flex justify-between gap-2 border-b border-white/5 pb-1">
                  <span className="truncate">
                    <b className="text-gray-200">{c.store}</b>
                    {c.deal ? ` — ${c.deal}` : ''}
                  </span>
                  <span className="shrink-0">{new Date(c.ts).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
        <h2 className="font-bold mb-4">Logged Earnings</h2>
        {stats.earnings.length === 0 ? (
          <p className="text-sm text-gray-500">
            No earnings logged yet. Check your affiliate dashboards (Amazon Associates, EarnKaro,
            Cuelinks) for real commission data and log them above to track totals.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase text-left">
                <th className="pb-2">Store</th>
                <th className="pb-2">Order Value</th>
                <th className="pb-2">Commission</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.earnings.map((e, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="py-2">{e.store}</td>
                  <td className="py-2 text-gray-400">₹{e.order_value}</td>
                  <td className="py-2 text-brand-accent font-bold">₹{e.amount}</td>
                  <td className="py-2 text-gray-500">{new Date(e.ts).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
