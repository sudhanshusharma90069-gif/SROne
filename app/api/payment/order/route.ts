import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/session';
import { getCashfreeConfig, cashfreeAuthHeaders } from '../../../lib/cashfree';

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to subscribe' }, { status: 401 });
    }

    const { phone } = await req.json();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ error: 'Valid 10-digit phone number is required' }, { status: 400 });
    }

    const config = getCashfreeConfig();
    if ('error' in config) {
      return NextResponse.json({ error: config.error }, { status: 500 });
    }

    const orderId = `srone-${user.id}-${Date.now()}`.slice(0, 45);
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://srone.vercel.app'}/subscribe?order_id={order_id}`;

    const order = {
      order_id: orderId,
      order_amount: 9,
      order_currency: 'INR',
      customer_details: {
        customer_id: user.id.slice(0, 50),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: `+91${phone.replace(/\D/g, '').slice(-10)}`,
      },
      order_meta: {
        return_url: returnUrl,
      },
    };

    const res = await fetch(`${config.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        ...cashfreeAuthHeaders(config),
        'x-request-id': `${orderId}-req`,
      },
      body: JSON.stringify(order),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Cashfree create order failed:', res.status, data);
      const message = data?.message || data?.error?.message || 'Unable to create Cashfree order';
      return NextResponse.json(
        {
          error: message,
          cashfree_status: res.status,
          cashfree_response: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      order_id: orderId,
      payment_session_id: data.payment_session_id,
      mode: config.env,
    });
  } catch (err) {
    console.error('Create order exception:', err);
    return NextResponse.json({ error: 'Unable to create payment order' }, { status: 500 });
  }
}
