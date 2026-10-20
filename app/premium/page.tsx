'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatPrice } from '../lib/prices';

interface Recommendation {
  store: string;
  category: string;
  score: number;
  reason: string;
  link: string;
}

interface Analytics {
  totalClicks: number;
  totalDeals: number;
  activeUsers: number;
  topStores: { name: string; clicks: number }[];
  categoryBreakdown: { category: string; clicks: number }[];
  savingsEstimate: number;
}

interface BudgetData {
  spent: number;
  budget: number;
  remaining: number;
  status: string;
  suggestions: string[];
}

interface BasketQuote {
  store: string;
  total: number;
  items: { name: string; price: number; qty: number }[];
  link: string;
}

interface Bundle {
  name: string;
  items: string[];
  originalPrice: number;
  bundlePrice: number;
  demandScore: number;
}

const TABS = ['Overview', 'Analytics', 'Basket', 'Bundles', 'Assistant', 'Alerts'];
const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#06b6d4', '#f97316'];

export default function PremiumDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [budget, setBudget] = useState<BudgetData | null>(null);

  const [basketInput, setBasketInput] = useState('milk, bread, eggs, rice, apples');
  const [basketResult, setBasketResult] = useState<{ quotes: BasketQuote[]; best: BasketQuote; savings: number } | null>(null);

  const [bundleInput, setBundleInput] = useState('milk, bread, eggs, rice');
  const [bundles, setBundles] = useState<Bundle[]>([]);

  const [assistant, setAssistant] = useState('Ask me anything about deals, budget or bundles...');
  const [assistantInput, setAssistantInput] = useState('');

  const [alert, setAlert] = useState({ deal: '', target: '', phone: '', priority: 'priority' as 'standard' | 'priority', status: '' });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user));
    fetch('/api/analytics').then((r) => r.json()).then(setAnalytics);
    fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile: { id: 'guest', preferences: ['grocery', 'travel'], history: ['Blinkit', 'MakeMyTrip'] },
      }),
    })
      .then((r) => r.json())
      .then((d) => setRecommendations(d.recommendations || []));
    fetch('/api/budget').then((r) => r.json()).then(setBudget);
    runBasketOptimizer();
    runBundleBuilder();
  }, []);

  async function runBasketOptimizer() {
    const items = basketInput.split(',').map((i) => i.trim()).filter(Boolean).map((name) => ({ name }));
    const res = await fetch('/api/basket-optimizer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    setBasketResult(data);
  }

  async function runBundleBuilder() {
    const items = bundleInput.split(',').map((i) => i.trim()).filter(Boolean).map((name) => ({ name }));
    const res = await fetch('/api/bundles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    setBundles(data.bundles || []);
  }

  async function askAssistant() {
    if (!assistantInput.trim()) return;
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: assistantInput }),
    });
    const data = await res.json();
    setAssistant(data.reply);
    setAssistantInput('');
  }

  async function setPriceAlert() {
    if (!alert.deal || !alert.target || !alert.phone) return;
    const res = await fetch('/api/whatsapp-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealTitle: alert.deal,
        targetPrice: Number(alert.target),
        whatsappNumber: alert.phone,
        priority: alert.priority,
      }),
    });
    const data = await res.json();
    setAlert({ ...alert, status: data.success ? `${alert.priority === 'priority' ? 'Priority' : 'Standard'} alert saved` : 'Failed' });
    setTimeout(() => setAlert({ ...alert, status: '' }), 3000);
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  const chartData = useMemo(
    () =>
      analytics?.categoryBreakdown.slice(0, 6).map((c) => ({
        name: c.category.length > 20 ? c.category.slice(0, 18) + '...' : c.category,
        value: c.clicks,
      })) || [],
    [analytics]
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Premium <span className="text-brand-accent">Dashboard</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Welcome back, {user?.name || 'Guest'} · {user?.role?.toUpperCase()}
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-brand-accent text-zinc-950'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {analytics && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Clicks" value={analytics.totalClicks.toLocaleString()} />
                <StatCard label="Live Deals" value={analytics.totalDeals.toString()} />
                <StatCard label="Active Users" value={analytics.activeUsers.toLocaleString()} />
                <StatCard label="Est. Savings" value={formatPrice(analytics.savingsEstimate)} accent />
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
                <h2 className="mb-4 text-lg font-bold">Predictive Recommendations</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {recommendations.slice(0, 6).map((r) => (
                    <a
                      key={r.store}
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 p-4 hover:border-brand-accent/30"
                    >
                      <div>
                        <p className="font-semibold">{r.store}</p>
                        <p className="text-xs text-zinc-400">{r.reason}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{Math.round(r.score * 100)}%</span>
                    </a>
                  ))}
                </div>
              </div>

              {budget && (
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5">
                  <h2 className="mb-3 text-lg font-bold">AI Budget Tracker</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-zinc-400">Budget</span><span>{formatPrice(budget.budget)}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-400">Spent</span><span>{formatPrice(budget.spent)}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-400">Remaining</span><span className={budget.remaining < 0 ? 'text-red-400' : 'text-emerald-400'}>{formatPrice(budget.remaining)}</span></div>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-brand-accent"
                      style={{ width: `${Math.min(100, (budget.spent / budget.budget) * 100)}%` }}
                    />
                  </div>
                  <ul className="mt-4 list-disc space-y-1 pl-4 text-xs text-zinc-400">
                    {budget.suggestions.slice(0, 3).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Analytics' && analytics && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-4 text-lg font-bold">Top Stores</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topStores} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                    <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} angle={-25} textAnchor="end" />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '0.5rem' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="clicks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-4 text-lg font-bold">Category Breakdown</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {chartData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '0.5rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Basket' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-bold">Real-Time Cross-Platform Basket Optimizer</h2>
            <p className="mb-5 text-sm text-zinc-400">Compare basket totals across quick-commerce and grocery stores.</p>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={basketInput}
                onChange={(e) => setBasketInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runBasketOptimizer()}
                placeholder="e.g. milk, bread, eggs, rice, apples"
                className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-brand-accent"
              />
              <button
                onClick={runBasketOptimizer}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Optimize Basket
              </button>
            </div>

            {basketResult && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {basketResult.quotes.slice(0, 4).map((q, i) => (
                  <div
                    key={q.store}
                    className={`rounded-xl border p-4 ${i === 0 ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-white/10 bg-zinc-900/50'}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold">{q.store}</span>
                      {i === 0 && <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">BEST</span>}
                    </div>
                    <p className="text-2xl font-bold">{formatPrice(q.total)}</p>
                    <p className="mt-1 text-xs text-zinc-400">{q.items.length} items</p>
                    <a
                      href={q.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                    >
                      Go to store
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Bundles' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-xl font-bold">Predictive Bundling</h2>
              <p className="mb-5 text-sm text-zinc-400">Enter items to discover dynamic bundle discounts.</p>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="text"
                  value={bundleInput}
                  onChange={(e) => setBundleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runBundleBuilder()}
                  placeholder="e.g. milk, bread, eggs, rice"
                  className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-brand-accent"
                />
                <button
                  onClick={runBundleBuilder}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Build Bundles
                </button>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bundles.map((b, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5">
                  <h3 className="mb-2 font-bold">{b.name}</h3>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {b.items.map((item) => (
                      <span key={item} className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-zinc-300">{item}</span>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-emerald-400">{formatPrice(b.bundlePrice)}</span>
                    <span className="text-sm text-zinc-500 line-through">{formatPrice(b.originalPrice)}</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">Demand score: {b.demandScore}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Assistant' && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-xl font-bold">AI Shopping Assistant</h2>
            <div className="mb-4 min-h-[6rem] rounded-xl bg-zinc-900/70 p-4 text-sm leading-relaxed text-zinc-200">
              {assistant}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
                placeholder="Ask SROne AI..."
                className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-brand-accent"
              />
              <button
                onClick={askAssistant}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Ask
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Alerts' && (
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 md:p-8">
            <h2 className="mb-2 text-xl font-bold">Priority WhatsApp Price Drop Alert</h2>
            <p className="mb-6 text-sm text-zinc-400">Premium users get faster alerts when the target price is reached.</p>
            <div className="grid gap-4 md:grid-cols-2">
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
              <select
                value={alert.priority}
                onChange={(e) => setAlert({ ...alert, priority: e.target.value as 'standard' | 'priority' })}
                className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-brand-accent"
              >
                <option value="priority">Priority (instant)</option>
                <option value="standard">Standard</option>
              </select>
            </div>
            <button
              onClick={setPriceAlert}
              className="mt-5 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Set Alert
            </button>
            {alert.status && <p className="mt-3 text-sm text-emerald-400">{alert.status}</p>}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}
