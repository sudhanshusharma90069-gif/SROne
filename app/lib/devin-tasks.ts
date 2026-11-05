import { createHash, randomBytes, timingSafeEqual } from 'crypto';

export const DEVIN_REPOS: Record<string, string> = {
  'dr-nidhi-dental': 'sudhanshusharma90069-gif/dr-nidhi-dental',
  SROne: 'sudhanshusharma90069-gif/SROne',
};

export type DevinTaskStatus = 'queued' | 'completed' | 'failed' | 'dispatch_failed';

export interface DevinTask {
  id: string;
  repo: string;
  task: string;
  requestedBy: string | null;
  status: DevinTaskStatus;
  summary: string | null;
  prUrl: string | null;
  sessionUrl: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

const hasDatabase = Boolean(process.env.DATABASE_URL);
const memoryTasks = new Map<string, DevinTask>();
const WEBHOOK_TIMEOUT_MS = 8000;

export function secretsMatch(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function serialize(row: any): DevinTask {
  const iso = (d: Date | string | null) => (d ? new Date(d).toISOString() : null);
  return {
    id: row.id,
    repo: row.repo,
    task: row.task,
    requestedBy: row.requestedBy ?? null,
    status: row.status,
    summary: row.summary ?? null,
    prUrl: row.prUrl ?? null,
    sessionUrl: row.sessionUrl ?? null,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
    completedAt: iso(row.completedAt),
  };
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
const memoryTokenHashes = new Map<string, string>();

export async function createDevinTask(
  repo: string,
  task: string,
  requestedBy: string | null
): Promise<{ task: DevinTask; callbackToken: string }> {
  const callbackToken = randomBytes(24).toString('hex');
  const callbackTokenHash = hashToken(callbackToken);
  if (hasDatabase) {
    const { prisma } = await import('./prisma');
    const row = await prisma.devinTask.create({ data: { repo, task, requestedBy, callbackTokenHash } });
    return { task: serialize(row), callbackToken };
  }
  const now = new Date().toISOString();
  const record: DevinTask = {
    id: Math.random().toString(36).slice(2),
    repo,
    task,
    requestedBy,
    status: 'queued',
    summary: null,
    prUrl: null,
    sessionUrl: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
  memoryTasks.set(record.id, record);
  memoryTokenHashes.set(record.id, callbackTokenHash);
  return { task: record, callbackToken };
}

export async function verifyCallbackToken(id: string, token: string | null): Promise<boolean> {
  if (!token) return false;
  let expected: string | undefined;
  if (hasDatabase) {
    const { prisma } = await import('./prisma');
    const row = await prisma.devinTask.findUnique({ where: { id }, select: { callbackTokenHash: true } });
    expected = row?.callbackTokenHash;
  } else {
    expected = memoryTokenHashes.get(id);
  }
  return secretsMatch(hashToken(token), expected);
}

export async function updateDevinTask(
  id: string,
  data: Partial<Pick<DevinTask, 'status' | 'summary' | 'prUrl' | 'sessionUrl'>> & { completedAt?: Date | null }
): Promise<DevinTask | null> {
  if (hasDatabase) {
    const { prisma } = await import('./prisma');
    const existing = await prisma.devinTask.findUnique({ where: { id } });
    if (!existing) return null;
    return serialize(await prisma.devinTask.update({ where: { id }, data }));
  }
  const existing = memoryTasks.get(id);
  if (!existing) return null;
  const { completedAt, ...rest } = data;
  const updated: DevinTask = {
    ...existing,
    ...rest,
    completedAt: completedAt ? completedAt.toISOString() : existing.completedAt,
    updatedAt: new Date().toISOString(),
  };
  memoryTasks.set(id, updated);
  return updated;
}

export async function listDevinTasks(limit = 50): Promise<DevinTask[]> {
  if (hasDatabase) {
    const { prisma } = await import('./prisma');
    const rows = await prisma.devinTask.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
    return rows.map(serialize);
  }
  return Array.from(memoryTasks.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function dispatchToDevin(task: DevinTask, callbackUrl: string, callbackToken: string): Promise<void> {
  const webhookUrl = process.env.DEVIN_WEBHOOK_URL;
  const webhookSecret = process.env.DEVIN_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    throw new Error('DEVIN_WEBHOOK_URL / DEVIN_WEBHOOK_SECRET are not configured');
  }
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': webhookSecret },
    body: JSON.stringify({
      task_id: task.id,
      repo: DEVIN_REPOS[task.repo],
      task: task.task,
      requested_by: task.requestedBy,
      callback_url: callbackUrl,
      callback_token: callbackToken,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Devin webhook responded with ${res.status}`);
  }
}

export async function forwardResultToZapier(task: DevinTask): Promise<void> {
  const webhookUrl = process.env.DEVIN_ZAPIER_WEBHOOK_URL || process.env.ZAPIER_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('DEVIN_ZAPIER_WEBHOOK_URL is not configured');
  }
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'devin_task_result', source: 'srone', ...task }),
    cache: 'no-store',
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Zapier webhook responded with ${res.status}`);
  }
}
