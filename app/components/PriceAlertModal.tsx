'use client';

import { useState } from 'react';
import { formatPrice } from '../lib/prices';
import { Deal } from '../lib/types';

export default function PriceAlertModal({
  open,
  onClose,
  deal,
}: {
  open: boolean;
  onClose: () => void;
  deal: Deal;
}) {
  const [targetPrice, setTargetPrice] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/price-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealTitle: deal.title,
          targetPrice: Number(targetPrice),
          whatsappNumber: whatsapp,
          currentPrice: deal.discountedPrice,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
      if (data.success) {
        setTargetPrice('');
        setWhatsapp('');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Set WhatsApp Price Alert
        </h3>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          {deal.title} — current {formatPrice(deal.discountedPrice ?? 0)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Target price
            </label>
            <input
              type="number"
              required
              min={1}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="e.g. 450"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              WhatsApp number
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="e.g. +91 98765 43210"
            />
          </div>

          {status === 'success' && (
            <p className="text-sm text-green-600">Alert saved! You will be notified on WhatsApp.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Set Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
