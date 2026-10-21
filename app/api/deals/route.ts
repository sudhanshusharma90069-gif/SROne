import { NextResponse } from 'next/server';
import { getEnrichedDeals } from '../../lib/deals-source';

export async function GET() {
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import('../../lib/prisma');
      const dbDeals = await prisma.deal.findMany({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      });
      if (dbDeals.length) {
        return NextResponse.json({ deals: dbDeals });
      }
    } catch {
      // DB not ready or no deals table yet — fall through to JSON/feed source.
    }
  }

  if (process.env.DEALS_FEED_URL) {
    try {
      const res = await fetch(process.env.DEALS_FEED_URL, { next: { revalidate: 0 } });
      const data = await res.json();
      const raw = Array.isArray(data) ? data : data.deals || [];
      if (raw.length) {
        const deals = await getEnrichedDeals(raw);
        return NextResponse.json({ deals });
      }
    } catch {
      // Feed failed — fall through to JSON source.
    }
  }

  const deals = await getEnrichedDeals();
  return NextResponse.json({ deals });
}
