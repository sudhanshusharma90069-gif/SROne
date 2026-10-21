import { NextRequest, NextResponse } from 'next/server';
import { loadSourceDeals } from '../../../lib/deals-source';
import { computePrices } from '../../../lib/prices';

async function fetchFeed(): Promise<Array<Record<string, any>>> {
  const feedUrl = process.env.DEALS_FEED_URL;
  if (feedUrl) {
    try {
      const res = await fetch(feedUrl, { next: { revalidate: 0 } });
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.deals)) return data.deals;
    } catch {
      // Fall through to local JSON if remote feed fails.
    }
  }
  return loadSourceDeals();
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization') || '';
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = await fetchFeed();
  const enriched = raw.map((d) => {
    const { originalPrice, discountedPrice } = computePrices(d as any);
    return {
      store: d.store || 'Unknown',
      title: d.title || '',
      description: d.description || '',
      link: d.link || '',
      category: d.category || 'General',
      discount: d.discount || '',
      ai_summary: d.ai_summary || `${d.title} — ${d.description}`,
      originalPrice,
      discountedPrice,
    };
  });

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      success: false,
      message: 'DATABASE_URL is not set. Add it to persist deals in the database.',
      count: enriched.length,
    });
  }

  try {
    const { prisma } = await import('../../../lib/prisma');
    let count = 0;
    for (const deal of enriched) {
      if (!deal.link) continue;
      await prisma.deal.upsert({
        where: { link: deal.link },
        update: {
          store: deal.store,
          title: deal.title,
          description: deal.description,
          category: deal.category,
          discount: deal.discount,
          ai_summary: deal.ai_summary,
          originalPrice: deal.originalPrice,
          discountedPrice: deal.discountedPrice,
          active: true,
        },
        create: {
          store: deal.store,
          title: deal.title,
          description: deal.description,
          link: deal.link,
          category: deal.category,
          discount: deal.discount,
          ai_summary: deal.ai_summary,
          originalPrice: deal.originalPrice,
          discountedPrice: deal.discountedPrice,
          active: true,
        },
      });
      count += 1;
    }
    return NextResponse.json({
      success: true,
      message: 'Deals refreshed successfully.',
      count,
      next: 'Run again tomorrow or via cron.',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: 'Database refresh failed.',
      error: err?.message || String(err),
      count: enriched.length,
    }, { status: 500 });
  }
}
