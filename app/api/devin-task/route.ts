import { NextRequest, NextResponse } from 'next/server';
import {
  DEVIN_REPOS,
  createDevinTask,
  dispatchToDevin,
  listDevinTasks,
  secretsMatch,
  updateDevinTask,
} from '../../lib/devin-tasks';

export const dynamic = 'force-dynamic';

function authorize(req: NextRequest): NextResponse | null {
  if (!process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'ADMIN_KEY is not configured' }, { status: 503 });
  }
  if (!secretsMatch(req.headers.get('x-admin-key'), process.env.ADMIN_KEY)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = authorize(req);
  if (denied) return denied;
  return NextResponse.json({ tasks: await listDevinTasks(), repos: Object.keys(DEVIN_REPOS) });
}

export async function POST(req: NextRequest) {
  const denied = authorize(req);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const repo = typeof body.repo === 'string' ? body.repo : '';
  const task = typeof body.task === 'string' ? body.task.trim() : '';
  const requestedBy = typeof body.requested_by === 'string' && body.requested_by.trim() ? body.requested_by.trim() : null;

  if (!DEVIN_REPOS[repo]) {
    return NextResponse.json({ error: `repo must be one of: ${Object.keys(DEVIN_REPOS).join(', ')}` }, { status: 400 });
  }
  if (!task || task.length > 4000) {
    return NextResponse.json({ error: 'task is required (max 4000 characters)' }, { status: 400 });
  }

  const { task: created, callbackToken } = await createDevinTask(repo, task, requestedBy);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

  try {
    await dispatchToDevin(created, `${baseUrl}/api/devin-callback`, callbackToken);
  } catch (error) {
    console.error('Devin dispatch failed', error);
    const failed = await updateDevinTask(created.id, { status: 'dispatch_failed' });
    return NextResponse.json({ error: 'Could not send the task to Devin', task: failed }, { status: 502 });
  }

  return NextResponse.json({ task: created }, { status: 201 });
}
