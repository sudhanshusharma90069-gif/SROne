import { NextRequest, NextResponse } from 'next/server';
import { optimizeBasket } from '../../lib/premium';
import { BasketItem } from '../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { items: BasketItem[]; location?: string };
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }
    const { quotes, best } = optimizeBasket(body.items, body.location);
    const savings = quotes.length > 0 ? Math.round(quotes[quotes.length - 1].total - best.total) : 0;
    return NextResponse.json({ quotes, best, savings, itemCount: body.items.length });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
