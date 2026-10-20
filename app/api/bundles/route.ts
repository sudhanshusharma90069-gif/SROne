import { NextRequest, NextResponse } from 'next/server';
import { buildBundles } from '../../lib/premium';
import { BasketItem } from '../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as { items: BasketItem[] };
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }
    const bundles = buildBundles(items);
    return NextResponse.json({ bundles, potentialSavings: bundles.reduce((s, b) => s + (b.originalPrice - b.bundlePrice), 0) });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
