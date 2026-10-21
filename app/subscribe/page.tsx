'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Header from '../components/Header';
import FestivalBanner from '../components/FestivalBanner';
import Footer from '../sections/Footer';

declare global {
  interface Window {
    Cashfree?: any;
  }
}

export default function Subscribe() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [cashfreeReady, setCashfreeReady] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const verifyOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    const res = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setStatus({ success: true, message: `${data.message} Redirecting...` });
      setTimeout(() => router.push('/premium'), 2000);
    } else {
      setStatus({ success: false, message: data.error || data.status || 'Payment not completed.' });
    }
  }, [router]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('order_id');
    if (id) {
      verifyOrder(id);
    }
  }, [verifyOrder]);

  async function createOrder() {
    if (!user) return;
    if (!phone || phone.length < 10) {
      setStatus({ success: false, message: 'Please enter a valid 10-digit phone number.' });
      return;
    }
    if (!consent) {
      setStatus({ success: false, message: 'Please accept the monthly auto-debit consent to continue.' });
      return;
    }

    setLoading(true);
    const res = await fetch('/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus({ success: false, message: data.error || 'Unable to start payment.' });
      return;
    }

    if (typeof window !== 'undefined' && window.Cashfree) {
      const cashfree = window.Cashfree({
        mode: data.mode === 'production' ? 'production' : 'sandbox',
      });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        returnUrl: `${window.location.origin}/subscribe?order_id=${data.order_id}`,
      });
    } else {
      setStatus({
        success: false,
        message: 'Cashfree SDK not loaded. Please refresh or set a valid payment method.',
      });
    }
  }

  return (
    <div className="min-h-screen bg-brand-900 text-white">
      <FestivalBanner />
      <Header />
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        onLoad={() => setCashfreeReady(true)}
      />

      <main>
        <section className="relative pt-24 pb-16 dot-grid hero-glow overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Go <span className="gradient-text">Premium</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
              Unlock all AI tools, analytics, basket optimizer and priority alerts for just ₹9/month.
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
                  ₹9<span className="text-base font-medium text-gray-500">/month</span>
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

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-brand-accent"
                    />
                    <span className="text-sm text-gray-400 leading-relaxed">
                      I consent to a monthly premium subscription of ₹9 and authorise the auto-debit mandate through Cashfree.
                    </span>
                  </label>

                  {!cashfreeReady && (
                    <p className="mb-4 text-center text-xs text-yellow-500">
                      Loading Cashfree checkout...
                    </p>
                  )}

                  <button
                    onClick={createOrder}
                    disabled={loading || !consent || !cashfreeReady}
                    className="w-full rounded-xl bg-brand-accent py-4 text-base font-bold text-brand-900 hover:bg-brand-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Pay ₹9 & Activate Premium'}
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
