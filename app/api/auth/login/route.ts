import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '../../../lib/users';
import { setSession } from '../../../lib/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const user = loginUser(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    await setSession(user);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Unable to log in' }, { status: 500 });
  }
}
