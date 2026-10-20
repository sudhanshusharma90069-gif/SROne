import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSession } from '../../lib/session';
import { upgradeUserToPremium } from '../../lib/users';

const SUBSCRIPTION_PRICE = 9;

export async function GET() {
  return NextResponse.json({
    price: SUBSCRIPTION_PRICE,
    currency: 'INR',
    upiId: process.env.PAYMENT_UPI_ID || '',
    billingCycle: 'monthly',
    note: 'For real payments, set PAYMENT_UPI_ID in environment variables or replace this mock with Razorpay/Stripe subscriptions.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Please log in to subscribe' }, { status: 401 });
    }

    const { method, consent } = await req.json();
    if (!consent) {
      return NextResponse.json({ error: 'Auto-debit consent is required' }, { status: 400 });
    }

    // TODO: replace this mock with a real payment gateway (Razorpay/Stripe/Cashfree) subscription flow.
    // Real money must only be collected through a certified payment provider with customer consent.
    const updated = await upgradeUserToPremium(session.email);
    if (!updated) {
      return NextResponse.json({ error: 'Unable to upgrade account' }, { status: 500 });
    }

    await setSession(updated);

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    return NextResponse.json({
      success: true,
      user: updated,
      plan: 'Premium',
      price: SUBSCRIPTION_PRICE,
      billingCycle: 'monthly',
      autoDebit: true,
      nextBilling: nextBilling.toISOString(),
      message: 'Premium activated. Auto-debit mandate accepted for ₹9/month.',
    });
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
