import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSession } from '../../../lib/session';
import { upgradeUserToPremium } from '../../../lib/users';
import { getCashfreeConfig, cashfreeAuthHeaders } from '../../../lib/cashfree';

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

    const config = getCashfreeConfig();
    if ('error' in config) {
      return NextResponse.json({ error: config.error }, { status: 500 });
    }

    const res = await fetch(`${config.baseUrl}/orders/${order_id}`, {
      headers: {
        ...cashfreeAuthHeaders(config),
        'x-request-id': `${order_id}-verify`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Cashfree verify order failed:', res.status, data);
      const message = data?.message || data?.error?.message || 'Unable to verify payment with Cashfree';
      return NextResponse.json(
        {
          error: message,
          cashfree_status: res.status,
          cashfree_response: data,
        },
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
  } catch (err) {
    console.error('Verify order exception:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
