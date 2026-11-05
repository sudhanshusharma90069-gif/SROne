import { NextRequest, NextResponse } from 'next/server';
import { AlertSubscription } from '../../lib/types';
import { sendToZapier } from '../../lib/zapier';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AlertSubscription & { currentPrice?: number };
    const { dealTitle, targetPrice, whatsappNumber, priority, currentPrice } = body;

    if (!dealTitle || !targetPrice || !whatsappNumber || !priority) {
      return NextResponse.json({ success: false, error: 'dealTitle, targetPrice, whatsappNumber and priority are required' }, { status: 400 });
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

    try {
      await sendToZapier('whatsapp_alert', payload);
    } catch (error) {
      console.error('Failed to send WhatsApp alert to Zapier', error);
      return NextResponse.json({ success: false, error: 'Unable to queue alert. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: `WhatsApp alert queued with ${priority} priority.`,
      payload,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to queue alert' }, { status: 500 });
  }
}
