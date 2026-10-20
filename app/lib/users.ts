import { hashPassword, verifyPassword } from './password';
import { SessionUser } from './jwt';
import { prisma } from './prisma';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'free' | 'premium';
}

const hasDatabase = Boolean(process.env.DATABASE_URL);

const users = new Map<string, User>();

// seed sample accounts for testing when no database is configured
if (!hasDatabase) {
  const freeHash = hashPassword('free123');
  const premiumHash = hashPassword('premium123');

  users.set('free@srone.in', {
    id: 'u1',
    email: 'free@srone.in',
    name: 'Free User',
    passwordHash: freeHash,
    role: 'free',
  });

  users.set('premium@srone.in', {
    id: 'u2',
    email: 'premium@srone.in',
    name: 'Premium User',
    passwordHash: premiumHash,
    role: 'premium',
  });
}

export function toSession(user: User): SessionUser {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function registerUser(
  email: string,
  name: string,
  password: string,
  role: 'free' | 'premium' = 'free'
): Promise<{ user: SessionUser } | { error: string }> {
  const normalized = email.trim().toLowerCase();

  if (hasDatabase) {
    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing) return { error: 'An account with this email already exists' };
    const passwordHash = hashPassword(password);
    const created = await prisma.user.create({
      data: { email: normalized, name: name.trim(), passwordHash, role },
    });
    return { user: toSession(created as User) };
  }

  if (users.has(normalized)) return { error: 'An account with this email already exists' };
  const passwordHash = hashPassword(password);
  const id = Math.random().toString(36).slice(2);
  const user: User = { id, email: normalized, name: name.trim(), passwordHash, role };
  users.set(normalized, user);
  return { user: toSession(user) };
}

export async function loginUser(email: string, password: string): Promise<SessionUser | null> {
  const normalized = email.trim().toLowerCase();

  let user: User | null = null;

  if (hasDatabase) {
    const dbUser = await prisma.user.findUnique({ where: { email: normalized } });
    if (dbUser) user = dbUser as User;
  } else {
    user = users.get(normalized) ?? null;
  }

  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return toSession(user);
}
