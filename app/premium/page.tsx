'use client';

import { useEffect, useState } from 'react';
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

export default function PremiumDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [assistant, setAssistant] = useState('Ask me anything about deals, budget or bundles...');
  const [assistantInput, setAssistantInput] = useState('');

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
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  async function askAssistant() {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: assistantInput }),
    });
    const data = await res.json();
    setAssistant(data.reply);
    setAssistantInput('');
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Premium AI Dashboard</h1>
            <p className="text-sm text-zinc-400">Welcome, {user?.name || 'Guest'} · {user?.role?.toUpperCase()}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-white/30 hover:text-white"
          >
            Logout
          </button>
        </div>

        {analytics && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-zinc-400">Total Clicks</p>
              <p className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-zinc-400">Deals</p>
              <p className="text-2xl font-bold">{analytics.totalDeals}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-zinc-400">Active Users</p>
              <p className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-zinc-400">Est. Savings</p>
              <p className="text-2xl font-bold text-emerald-400">{formatPrice(analytics.savingsEstimate)}</p>
            </div>
          </div>
        )}

        {budget && (
          <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="mb-2 text-lg font-semibold">AI Budget Tracker</h2>
            <div className="flex gap-4 text-sm">
              <span>Budget: {formatPrice(budget.budget)}</span>
              <span>Spent: {formatPrice(budget.spent)}</span>
              <span className={budget.remaining < 0 ? 'text-red-400' : 'text-emerald-400'}>
                Remaining: {formatPrice(budget.remaining)}
              </span>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-400">
              {budget.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 text-lg font-semibold">Predictive Recommendations</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {recommendations.map((r) => (
              <a
                key={r.store}
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 hover:border-white/20"
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

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 text-lg font-semibold">AI Shopping Assistant</h2>
          <p className="mb-3 min-h-[3rem] rounded-lg bg-zinc-900 p-3 text-sm text-zinc-200">{assistant}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
              placeholder="Ask SROne AI..."
              className="flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <button
              onClick={askAssistant}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
