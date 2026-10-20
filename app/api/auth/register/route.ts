import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '../../../lib/users';
import { setSession } from '../../../lib/session';

export async function POST(req: NextRequest) {
  try {
    const { email, name, password, role } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Email, name and password are required' }, { status: 400 });
    }
    const result = await registerUser(email, name, password, role || 'free');
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    await setSession(result.user);
    return NextResponse.json({ user: result.user });
  } catch {
    return NextResponse.json({ error: 'Unable to register' }, { status: 500 });
  }
}
