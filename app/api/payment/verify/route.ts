import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSession } from '../../../lib/session';
import { upgradeUserToPremium } from '../../../lib/users';

function getBaseUrl() {
  if (process.env.CASHFREE_ENV === 'production') {
    return 'https://api.cashfree.com/pg';
  }
  return 'https://sandbox.cashfree.com/pg';
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to verify payment' }, { status: 401 });
    }

    const { order_id } = await req.json();
    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Cashfree is not configured. Add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET to environment variables.' },
        { status: 500 }
      );
    }

    const res = await fetch(`${getBaseUrl()}/orders/${order_id}`, {
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': process.env.CASHFREE_API_VERSION || '2023-08-01',
        'x-request-id': `${order_id}-verify`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Unable to verify payment with Cashfree' },
        { status: res.status }
      );
    }

    const isPaid = data.order_status === 'PAID' || data.payment_status === 'SUCCESS';
    if (!isPaid) {
      return NextResponse.json({ success: false, status: data.order_status }, { status: 400 });
    }

    const updated = await upgradeUserToPremium(user.email);
    if (!updated) {
      return NextResponse.json({ error: 'Unable to activate premium' }, { status: 500 });
    }

    await setSession(updated);

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    return NextResponse.json({
      success: true,
      user: updated,
      order_id,
      next_billing: nextBilling.toISOString(),
      message: 'Premium activated successfully.',
    });
  } catch {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
