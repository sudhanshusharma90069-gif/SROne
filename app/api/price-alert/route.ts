import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: connect to Zapier / Make webhook here
    // await fetch(process.env.PRICE_ALERT_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) });

    return NextResponse.json({
      success: true,
      message: 'Price alert saved. We will notify you on WhatsApp when the price drops.',
      payload,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unable to save alert. Please try again.' },
      { status: 500 }
    );
  }
}
