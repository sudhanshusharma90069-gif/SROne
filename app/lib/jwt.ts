import { SignJWT, jwtVerify } from 'jose';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'free' | 'premium';
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'srone-dev-secret-change-me');

export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}
