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
      // DB not ready or no deals table yet — fall through to JSON source.
    }
  }

  const deals = await getEnrichedDeals();
  return NextResponse.json({ deals });
}
