import { NextRequest, NextResponse } from 'next/server';
import { AlertSubscription } from '../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AlertSubscription & { currentPrice?: number };
    const { dealTitle, targetPrice, whatsappNumber, priority, currentPrice } = body;

    if (!dealTitle || !targetPrice || !whatsappNumber || !priority) {
      return NextResponse.json({ error: 'dealTitle, targetPrice, whatsappNumber and priority are required' }, { status: 400 });
    }

    const payload = {
      dealTitle,
      targetPrice: Number(targetPrice),
      currentPrice: Number(currentPrice ?? 0),
      whatsappNumber,
      priority,
      estimatedAlertSeconds: priority === 'priority' ? 5 : 300,
      createdAt: new Date().toISOString(),
    };

    // TODO: push to Zapier / Make / Twilio webhook
    // const webhookUrl = process.env.WHATSAPP_ALERT_WEBHOOK_URL;

    return NextResponse.json({
      success: true,
      message: `WhatsApp alert queued with ${priority} priority.`,
      payload,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to queue alert' }, { status: 500 });
  }
}
