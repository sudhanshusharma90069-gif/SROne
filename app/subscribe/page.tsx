'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import FestivalBanner from '../components/FestivalBanner';
import Footer from '../sections/Footer';

export default function Subscribe() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [plan, setPlan] = useState({ price: 9, upiId: '', billingCycle: 'monthly' });
  const [method, setMethod] = useState('upi');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user));
    fetch('/api/subscribe')
      .then((r) => r.json())
      .then((d) => setPlan({ price: d.price, upiId: d.upiId, billingCycle: d.billingCycle }));
  }, []);

  async function subscribe() {
    if (!consent) {
      setStatus({ success: false, message: 'Please accept the auto-debit consent to continue.' });
      return;
    }
    setLoading(true);
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, consent }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setStatus({ success: true, message: data.message });
      setTimeout(() => router.push('/premium'), 2000);
    } else {
      setStatus({ success: false, message: data.error || 'Subscription failed. Please try again.' });
    }
  }

  return (
    <div className="min-h-screen bg-brand-900 text-white">
      <FestivalBanner />
      <Header />

      <main>
        <section className="relative pt-24 pb-16 dot-grid hero-glow overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Go <span className="gradient-text">Premium</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
              Unlock all AI tools, analytics, basket optimizer and priority alerts for just ₹{plan.price}/month.
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-brand-800/30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
              <div className="mb-8 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-accent mb-4">
                  Premium Plan
                </span>
                <p className="text-5xl font-extrabold text-white mb-2">
                  ₹{plan.price}<span className="text-base font-medium text-gray-500">/{plan.billingCycle}</span>
                </p>
                <p className="text-sm text-gray-400">Auto-renews. Cancel anytime.</p>
              </div>

              {!user ? (
                <div className="rounded-xl bg-zinc-900/50 p-5 text-center">
                  <p className="mb-4 text-sm text-gray-300">Please log in or register to subscribe.</p>
                  <a
                    href="/login"
                    className="inline-block rounded-xl bg-brand-accent px-6 py-3 text-sm font-bold text-brand-900 hover:bg-brand-accent-hover"
                  >
                    Log in
                  </a>
                </div>
              ) : (
                <>
                  {user.role === 'premium' && (
                    <div className="rounded-xl bg-emerald-900/20 border border-emerald-500/20 p-4 text-center text-sm text-emerald-400 mb-6">
                      You are already on Premium.
                    </div>
                  )}

                  <div className="space-y-4 mb-8">
                    {[
                      { id: 'upi', label: 'UPI / QR' },
                      { id: 'card', label: 'Debit / Credit Card' },
                      { id: 'netbanking', label: 'Net Banking' },
                    ].map((m) => (
                      <label
                        key={m.id}
                        className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors ${
                          method === m.id ? 'border-brand-accent bg-brand-accent/5' : 'border-white/10 bg-white/5 hover:bg-white/[0.07]'
                        }`}
                      >
                        <span className="text-sm font-semibold text-white">{m.label}</span>
                        <input
                          type="radio"
                          name="method"
                          value={m.id}
                          checked={method === m.id}
                          onChange={() => setMethod(m.id)}
                          className="h-4 w-4 accent-brand-accent"
                        />
                      </label>
                    ))}
                  </div>

                  {method === 'upi' && (
                    <div className="mb-6 rounded-xl bg-zinc-900/50 p-4 text-sm text-gray-300">
                      <p className="mb-2">Pay using the merchant UPI ID below. In the live flow this will be replaced by a payment gateway checkout.</p>
                      <p className="font-mono text-brand-accent text-base">{plan.upiId || 'UPI ID not configured'}</p>
                    </div>
                  )}

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-brand-accent"
                    />
                    <span className="text-sm text-gray-400 leading-relaxed">
                      I consent to a monthly auto-debit of ₹{plan.price} for the SROne Premium subscription. I understand this is a mock flow and real payments require a certified payment gateway.
                    </span>
                  </label>

                  <button
                    onClick={subscribe}
                    disabled={loading || !consent}
                    className="w-full rounded-xl bg-brand-accent py-4 text-base font-bold text-brand-900 hover:bg-brand-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : `Pay ₹${plan.price} & Activate Premium`}
                  </button>

                  {status && (
                    <p className={`mt-4 text-center text-sm ${status.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {status.message}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
