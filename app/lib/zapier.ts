const WEBHOOK_TIMEOUT_MS = 8000;

export type ZapierEvent = 'price_alert' | 'whatsapp_alert';

export async function sendToZapier(event: ZapierEvent, data: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('ZAPIER_WEBHOOK_URL is not configured');
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, source: 'srone', ...data }),
    cache: 'no-store',
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Zapier webhook responded with ${res.status}`);
  }
}
