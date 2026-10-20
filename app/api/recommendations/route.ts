import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '../../lib/premium';
import { UserProfile } from '../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { profile?: UserProfile };
    if (!body.profile) {
      return NextResponse.json({ error: 'profile is required' }, { status: 400 });
    }
    const recommendations = getRecommendations(body.profile);
    return NextResponse.json({ recommendations, count: recommendations.length });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
