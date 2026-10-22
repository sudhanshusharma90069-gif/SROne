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
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import Header from '../components/Header';
import FestivalBanner from '../components/FestivalBanner';
import Footer from '../sections/Footer';
import Deals from '../sections/Deals';
import AIPredictions from '../sections/AIPredictions';
import SmartReorder from '../sections/SmartReorder';
import CartOptimizer from '../components/CartOptimizer';
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

const TABS = ['Overview', 'Deals', 'Analytics', 'Basket', 'Bundles', 'Assistant', 'Alerts'];
const COLORS = ['#f9a826', '#10b981', '#6366f1', '#ec4899', '#06b6d4', '#f97316'];

const trend = [
  { day: 'Mon', clicks: 1200 },
  { day: 'Tue', clicks: 1800 },
  { day: 'Wed', clicks: 1500 },
  { day: 'Thu', clicks: 2400 },
  { day: 'Fri', clicks: 2100 },
  { day: 'Sat', clicks: 3200 },
  { day: 'Sun', clicks: 2900 },
];

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
    <div className="min-h-screen bg-slate-950 text-white">
      <FestivalBanner />
      <Header />

      <main>
        <section className="relative pt-24 pb-12 dot-grid hero-glow overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {user ? `Premium access active — ${user.name}` : 'Unlock the full power of SROne AI'}
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <span className="text-white font-extrabold text-lg">SR</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Premium <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">Dashboard</span>
              </h1>
            </div>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
              Predictive recommendations, real-time basket optimization, advanced analytics and AI assistance — all in one premium command center.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {analytics && [
                { value: analytics.totalClicks.toLocaleString(), label: 'Total Clicks' },
                { value: analytics.totalDeals.toString(), label: 'Live Deals' },
                { value: analytics.activeUsers.toLocaleString(), label: 'Active Users' },
                { value: formatPrice(analytics.savingsEstimate), label: 'Est. Savings' },
              ].map((s) => (
                <div key={s.label} className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <p className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 mb-1">{s.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sticky top-[72px] z-30 glass border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={logout}
                className="ml-auto rounded-full border border-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-slate-900/30 min-h-[50vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === 'Deals' && (
              <div className="space-y-10">
                <AIPredictions />
                <SmartReorder />
                <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                  <Deals />
                </div>
                <CartOptimizer />
              </div>
            )}

            {activeTab === 'Overview' && (
              <div className="space-y-10">
                <div>
                  <div className="mb-6 flex items-center gap-2">
                    <span className="rounded-full bg-indigo-600/10 p-2 text-indigo-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <h2 className="text-2xl font-bold">Predictive Recommendations</h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendations.slice(0, 6).map((r) => (
                      <a
                        key={r.store}
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 card-hover"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-bold text-white">{r.store}</p>
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                            {Math.round(r.score * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{r.reason}</p>
                        <p className="mt-2 text-xs text-zinc-500">{r.category}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {budget && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="rounded-full bg-indigo-600/10 p-2 text-indigo-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <h2 className="text-2xl font-bold">AI Budget Tracker</h2>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Budget</span><span>{formatPrice(budget.budget)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Spent</span><span>{formatPrice(budget.spent)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Remaining</span><span className={budget.remaining < 0 ? 'text-red-400' : 'text-emerald-400'}>{formatPrice(budget.remaining)}</span></div>
                      </div>
                      <div className="lg:col-span-2">
                        <div className="mb-2 h-3 w-full rounded-full bg-zinc-800">
                          <div
                            className="h-3 rounded-full bg-indigo-600"
                            style={{ width: `${Math.min(100, (budget.spent / budget.budget) * 100)}%` }}
                          />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {budget.suggestions.slice(0, 4).map((s, i) => (
                            <div key={i} className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-xs text-gray-300">
                              <span className="mt-0.5 text-indigo-400">✓</span>
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Analytics' && analytics && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="mb-4 text-xl font-bold">Click Trend</h2>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f9a826" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f9a826" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '0.5rem' }} />
                        <Area type="monotone" dataKey="clicks" stroke="#f9a826" fillOpacity={1} fill="url(#colorClicks)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 card-hover">
                    <h2 className="mb-4 text-xl font-bold">Top Stores</h2>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.topStores} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                          <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} angle={-25} textAnchor="end" />
                          <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '0.5rem' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                          <Bar dataKey="clicks" fill="#f9a826" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 card-hover">
                    <h2 className="mb-4 text-xl font-bold">Category Breakdown</h2>
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
              </div>
            )}

            {activeTab === 'Basket' && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-600/10 p-2 text-indigo-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  <h2 className="text-2xl font-bold">Real-Time Basket Optimizer</h2>
                </div>
                <p className="mb-6 text-sm text-gray-400">Compare your basket total across Blinkit, Instamart, BigBasket, Zepto and more.</p>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="text"
                    value={basketInput}
                    onChange={(e) => setBasketInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runBasketOptimizer()}
                    placeholder="e.g. milk, bread, eggs, rice, apples"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                  <button
                    onClick={runBasketOptimizer}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-500"
                  >
                    Optimize Now
                  </button>
                </div>

                {basketResult && (
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {basketResult.quotes.slice(0, 4).map((q, i) => (
                      <div
                        key={q.store}
                        className={`rounded-2xl border p-5 ${i === 0 ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-white/10 bg-white/[0.03] card-hover'}`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold">{q.store}</span>
                          {i === 0 && <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">BEST</span>}
                        </div>
                        <p className="text-3xl font-bold">{formatPrice(q.total)}</p>
                        <p className="mt-1 text-xs text-gray-400">{q.items.length} items</p>
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
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
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-indigo-600/10 p-2 text-indigo-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m0 0l8 4m8-4v10l-8 4m0-10l8-4m-8 4v10" />
                      </svg>
                    </span>
                    <h2 className="text-2xl font-bold">Predictive Bundling</h2>
                  </div>
                  <p className="mb-5 text-sm text-gray-400">AI-built bundles that give you the best dynamic price.</p>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      value={bundleInput}
                      onChange={(e) => setBundleInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && runBundleBuilder()}
                      placeholder="e.g. milk, bread, eggs, rice"
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                    />
                    <button
                      onClick={runBundleBuilder}
                      className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-500"
                    >
                      Build Bundles
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {bundles.map((b, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 card-hover">
                      <h3 className="mb-3 font-bold text-lg">{b.name}</h3>
                      <div className="mb-4 flex flex-wrap gap-1">
                        {b.items.map((item) => (
                          <span key={item} className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-gray-300">{item}</span>
                        ))}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-400">{formatPrice(b.bundlePrice)}</span>
                        <span className="text-sm text-zinc-500 line-through">{formatPrice(b.originalPrice)}</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Demand score: {b.demandScore}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Assistant' && (
              <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-600/10 p-2 text-indigo-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8m-8 4h5m-9 8l3-3h10a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
                    </svg>
                  </span>
                  <h2 className="text-2xl font-bold">AI Shopping Assistant</h2>
                </div>
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
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                  <button
                    onClick={askAssistant}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-500"
                  >
                    Ask
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Alerts' && (
              <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 lg:p-8">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-600/10 p-2 text-indigo-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </span>
                  <h2 className="text-2xl font-bold">Priority WhatsApp Alert</h2>
                </div>
                <p className="mb-6 text-sm text-gray-400">Premium users get instant WhatsApp notifications when the target price is reached.</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    value={alert.deal}
                    onChange={(e) => setAlert({ ...alert, deal: e.target.value })}
                    placeholder="Deal name"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                  <input
                    type="number"
                    value={alert.target}
                    onChange={(e) => setAlert({ ...alert, target: e.target.value })}
                    placeholder="Target price"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                  <input
                    type="tel"
                    value={alert.phone}
                    onChange={(e) => setAlert({ ...alert, phone: e.target.value })}
                    placeholder="WhatsApp number"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                  />
                  <select
                    value={alert.priority}
                    onChange={(e) => setAlert({ ...alert, priority: e.target.value as 'standard' | 'priority' })}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
