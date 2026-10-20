import { NextResponse } from 'next/server';
import { getAnalytics } from '../../lib/premium';

export async function GET() {
  const analytics = getAnalytics();
  return NextResponse.json(analytics);
}
