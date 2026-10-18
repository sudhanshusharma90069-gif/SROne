import { NextRequest, NextResponse } from 'next/server';
import { storeCategories } from '../../lib/stores';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const storeList = storeCategories
  .map((c) => `${c.name}: ${c.stores.map((s) => s.name).join(', ')}`)
  .join('\n');

function fallbackAnswer(message: string): string {
  const q = message.toLowerCase();
  const matches = storeCategories
    .flatMap((c) => c.stores.map((s) => ({ ...s, category: c.name })))
    .filter(
      (s) =>
        q.includes(s.name.toLowerCase()) ||
        q.includes(s.name.toLowerCase().split(' ')[0]) ||
        s.description.toLowerCase().split(' ').some((w) => w.length > 5 && q.includes(w))
    );

  if (matches.length > 0) {
    const top = matches.slice(0, 3);
    return (
      `I recommend checking ${top.map((s) => s.name).join(', ')}. ` +
      top.map((s) => `${s.name}: ${s.description}`).join(' ') +
      ' Open the menu (☰) to visit these stores directly.'
    );
  }

  if (q.includes('hotel')) return 'For hotel bookings check OYO Rooms, Booking.com, Airbnb or MakeMyTrip Hotels — find them under "Hotel Booking" in the ☰ menu.';
  if (q.includes('flight') || q.includes('train') || q.includes('bus') || q.includes('travel'))
    return 'For travel bookings check MakeMyTrip, Goibibo, Yatra, Cleartrip, EaseMyTrip, IRCTC or redBus under "Travel Booking" in the ☰ menu.';
  if (q.includes('food') || q.includes('pizza') || q.includes('restaurant'))
    return 'For food delivery check Swiggy, Zomato, Domino\'s or Rominos under "Food Delivery" in the ☰ menu.';
  if (q.includes('grocer')) return 'For groceries check Blinkit, Zepto, BigBasket or JioMart under "Grocery & Quick Commerce" in the ☰ menu.';
  if (q.includes('fashion') || q.includes('cloth'))
    return 'For fashion check Myntra, Ajio, Tata CLiQ or LimeRoad under "Fashion & Lifestyle" in the ☰ menu.';
  if (q.includes('beauty') || q.includes('makeup')) return 'For beauty products check Nykaa or Purplle in the ☰ menu.';
  if (q.includes('cab') || q.includes('ride') || q.includes('taxi')) return 'For rides check Uber or Rapido under "Travel & Mobility" in the ☰ menu.';
  if (q.includes('deal') || q.includes('offer') || q.includes('discount'))
    return 'All AI-classified best deals are on this page below — scroll to see discounts from 35+ stores.';

  return 'I can help you find deals across shopping, groceries, food delivery, hotels, travel and more. Open the ☰ menu (top-right) to browse all 11 categories and 35+ stores, or scroll down for today\'s AI-picked deals.';
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ reply: fallbackAnswer(message) });
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are SROne's shopping assistant. Help customers find the best stores and deals in India. Keep answers short, friendly, and suggest specific stores. Available categories and stores:\n${storeList}`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
      }),
    });
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || fallbackAnswer(message) });
  } catch {
    return NextResponse.json({ reply: 'Sorry, I could not process that. Please try again.' });
  }
}
