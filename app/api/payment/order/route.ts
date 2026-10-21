import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/session';

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
      return NextResponse.json({ error: 'Please log in to subscribe' }, { status: 401 });
    }

    const { phone } = await req.json();
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Cashfree is not configured. Add CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET to environment variables.' },
        { status: 500 }
      );
    }

    const orderId = `srone-${user.id}-${Date.now()}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://srone.vercel.app'}/subscribe?order_id=${orderId}`;

    const order = {
      order_id: orderId,
      order_amount: 9,
      order_currency: 'INR',
      customer_details: {
        customer_id: user.id,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://srone.vercel.app'}/api/payment/notify`,
      },
    };

    const res = await fetch(`${getBaseUrl()}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': process.env.CASHFREE_API_VERSION || '2023-08-01',
        'x-request-id': `${orderId}-req`,
      },
      body: JSON.stringify(order),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Unable to create Cashfree order' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      order_id: orderId,
      payment_session_id: data.payment_session_id,
      mode: process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox',
    });
  } catch {
    return NextResponse.json({ error: 'Unable to create payment order' }, { status: 500 });
  }
}
