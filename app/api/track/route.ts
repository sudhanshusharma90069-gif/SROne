import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CLICKS_FILE = path.join(DATA_DIR, 'clicks.jsonl');
const EARNINGS_FILE = path.join(DATA_DIR, 'earnings.jsonl');

async function append(file: string, record: object) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(file, JSON.stringify(record) + '\n');
  } catch {
    // read-only filesystem (serverless) — ignore
  }
}

async function readJsonl(file: string): Promise<any[]> {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return raw.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { store, deal, type } = body;
  if (!store) return NextResponse.json({ error: 'store required' }, { status: 400 });

  const record = {
    store,
    deal: deal || null,
    type: type || 'click',
    ts: new Date().toISOString(),
    ua: req.headers.get('user-agent')?.slice(0, 120) || null,
  };

  if (type === 'earning') {
    record.deal = body.amount ?? null;
    await append(EARNINGS_FILE, { store, amount: body.amount || 0, order_value: body.order_value || 0, ts: record.ts });
  } else {
    await append(CLICKS_FILE, record);
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  const adminKey = process.env.ADMIN_KEY || 'srone123';
  if (key !== adminKey) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const clicks = await readJsonl(CLICKS_FILE);
  const earnings = await readJsonl(EARNINGS_FILE);

  const byStore: Record<string, number> = {};
  const byDeal: Record<string, number> = {};
  clicks.forEach((c) => {
    byStore[c.store] = (byStore[c.store] || 0) + 1;
    if (c.deal) byDeal[`${c.store} — ${c.deal}`] = (byDeal[`${c.store} — ${c.deal}`] || 0) + 1;
  });

  const totalEarnings = earnings.reduce((s, e) => s + (e.amount || 0), 0);
  const totalOrderValue = earnings.reduce((s, e) => s + (e.order_value || 0), 0);

  return NextResponse.json({
    total_clicks: clicks.length,
    by_store: byStore,
    by_deal: byDeal,
    recent_clicks: clicks.slice(-50).reverse(),
    earnings,
    total_earnings: totalEarnings,
    total_order_value: totalOrderValue,
  });
}
