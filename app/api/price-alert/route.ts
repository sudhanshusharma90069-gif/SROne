import { NextRequest, NextResponse } from 'next/server';
import { sendToZapier } from '../../lib/zapier';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dealTitle, targetPrice, whatsappNumber, currentPrice } = body;

    if (!dealTitle || !targetPrice || !whatsappNumber) {
      return NextResponse.json(
        { success: false, error: 'dealTitle, targetPrice and whatsappNumber are required' },
        { status: 400 }
      );
    }

    const payload = {
      dealTitle,
      targetPrice: Number(targetPrice),
      whatsappNumber,
      currentPrice: Number(currentPrice ?? 0),
      createdAt: new Date().toISOString(),
    };

    try {
      await sendToZapier('price_alert', payload);
    } catch (error) {
      console.error('Failed to send price alert to Zapier', error);
      return NextResponse.json(
        { success: false, error: 'Unable to save alert. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Price alert saved. We will notify you on WhatsApp when the price drops.',
      payload,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Unable to save alert. Please try again.' },
      { status: 500 }
    );
  }
}
