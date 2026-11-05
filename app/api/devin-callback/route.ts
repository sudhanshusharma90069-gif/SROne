import { NextRequest, NextResponse } from 'next/server';
import { forwardResultToZapier, updateDevinTask, verifyCallbackToken } from '../../lib/devin-tasks';

export const dynamic = 'force-dynamic';

const optionalString = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : null);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const taskId = optionalString(body.task_id);
  const status = body.status === 'completed' || body.status === 'failed' ? body.status : null;
  if (!taskId || !status) {
    return NextResponse.json({ error: 'task_id and status (completed|failed) are required' }, { status: 400 });
  }
  if (!(await verifyCallbackToken(taskId, req.headers.get('x-callback-token')))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const updated = await updateDevinTask(taskId, {
    status,
    summary: optionalString(body.summary),
    prUrl: optionalString(body.pr_url),
    sessionUrl: optionalString(body.session_url),
    completedAt: new Date(),
  });
  if (!updated) {
    return NextResponse.json({ error: 'task not found' }, { status: 404 });
  }

  let forwarded = true;
  try {
    await forwardResultToZapier(updated);
  } catch (error) {
    forwarded = false;
    console.error('Zapier forward failed', error);
  }

  return NextResponse.json({ success: true, forwarded });
}
