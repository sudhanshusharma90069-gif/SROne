import { NextRequest, NextResponse } from 'next/server';
import { budgetInsights } from '../../lib/premium';

export async function POST(req: NextRequest) {
  try {
    const { spent, budget, categories } = (await req.json()) as {
      spent?: number;
      budget?: number;
      categories?: Record<string, number>;
    };

    if (typeof spent !== 'number' || typeof budget !== 'number') {
      return NextResponse.json({ error: 'spent and budget are required numbers' }, { status: 400 });
    }

    const insights = budgetInsights(spent, budget, categories);
    return NextResponse.json(insights);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  const insights = budgetInsights(4200, 10000, { Groceries: 1800, Travel: 1500, Fashion: 900 });
  return NextResponse.json(insights);
}
