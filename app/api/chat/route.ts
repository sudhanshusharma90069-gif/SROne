import { NextRequest, NextResponse } from 'next/server';
import { Store } from '../../lib/types';
import { storeCategories } from '../../lib/stores';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const allStores: Store[] = storeCategories.flatMap((c) =>
  c.stores.map((s) => ({ ...s, category: c.name }))
);

const storeList = storeCategories
  .map((c) => `${c.name}: ${c.stores.map((s) => s.name).join(', ')}`)
  .join('\n');

const stopWords = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'and', 'or', 'but', 'for', 'with', 'without', 'from', 'to', 'in', 'on',
  'at', 'by', 'of', 'about', 'like', 'want', 'need', 'best', 'cheap', 'cheapest',
  'good', 'top', 'latest', 'new', 'kya', 'koi', 'mujhe', 'chahiye', 'batao', 'kaunsa',
  'kahan', 'kaise', 'kab', 'kitna', 'hai', 'hain', 'ho', 'mein', 'se', 'ko', 'ki', 'ke',
  'liye', 'batao', 'dikhao', 'sasta', 'sasti', 'tara', 'karo', 'kare', 'main', 'hi',
  'please', 'plz', 'show', 'find', 'give', 'tell', 'suggest', 'recommend', 'looking',
  'search', 'i', 'you', 'we', 'us', 'my', 'your', 'me', 'he', 'she', 'it', 'they',
]);

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

function isHindi(q: string): boolean {
  return /[\u0900-\u097F]/.test(q) || /\b(kya|kahan|chahiye|mujhe|sasta|sasti|kaise|kab|kitna|batao|btao|dikhao|milega|milegi|konsa|konse|kya h|kya hai|kaun|kyu|kya ye|kya vo)\b/i.test(q);
}

function findStores(query: string) {
  const q = query.toLowerCase().trim();
  const words = tokenize(q);
  if (words.length === 0 && q.length > 0) {
    words.push(q);
  }

  const scored = allStores.map((s) => {
    let score = 0;
    const name = s.name.toLowerCase();
    const desc = s.description.toLowerCase();
    const cat = (s.category || '').toLowerCase();

    words.forEach((w) => {
      if (name.startsWith(w)) score += 12;
      else if (name.includes(w)) score += 8;
      else if (cat.startsWith(w)) score += 5;
      else if (cat.includes(w)) score += 3;
      else if (desc.includes(w)) score += 1;
    });

    return { ...s, score };
  });

  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
}

function formatReply(query: string, stores: Store[]): { text: string; stores: Store[] } {
  const hindi = isHindi(query);
  const q = query.toLowerCase();

  if (stores.length > 0) {
    const names = stores.map((s) => s.name).join(', ');
    const text = hindi
      ? `Aapke liye best options: ${names}. Neeche kisi bhi store pe click karein aur apna order ya booking shuru karein.`
      : `Here are the best options for you: ${names}. Click any store below to start shopping or booking.`;
    return { text, stores };
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
    return {
      text: hindi
        ? 'Namaste! Main SROne AI assistant hoon. Aapko shopping, grocery, food, hotel, travel, recharge, entertainment — kisi bhi category mein help kar sakta hoon. Apna sawal poochhein!'
        : "Hi there! I'm the SROne AI assistant. Ask me about shopping, groceries, food delivery, hotels, travel, recharge, entertainment, or any deals — I'm here to help!",
      stores: [],
    };
  }

  const categoryMatch = storeCategories.find((c) => q.includes(c.name.toLowerCase()));
  if (categoryMatch) {
    const names = categoryMatch.stores.map((s) => s.name).slice(0, 6).join(', ');
    return {
      text: hindi
        ? `${categoryMatch.name} ke liye yeh stores hain: ${names}. Menu se bhi seedhe jaa sakte hain.`
        : `For ${categoryMatch.name}, check out: ${names}. You can also browse them from the menu.`,
      stores: categoryMatch.stores.slice(0, 6),
    };
  }

  return {
    text: hindi
      ? 'Main 70+ top stores aur 17 categories mein aapki madad kar sakta hoon. Shopping, grocery, food, hotel, travel, recharge, entertainment — jo chahiye bataiye!'
      : 'I can help you across 70+ top stores and 17 categories — shopping, groceries, food delivery, hotels, travel, recharge, entertainment and more. Just type what you need!',
    stores: [],
  };
}

function fallbackAnswer(message: string): { text: string; stores: typeof allStores } {
  const stores = findStores(message);
  return formatReply(message, stores);
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    const fallback = fallbackAnswer(message);

    if (!OPENAI_API_KEY) {
      return NextResponse.json(fallback);
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are SROne's helpful shopping assistant. Customers are asking for the best stores and deals in India. Always reply in the SAME language the user writes in (English, Hindi, or Hinglish). Keep answers short, friendly, and suggest specific stores from the list. When a user provides a grocery list, analyze the items and compare prices between quick commerce platforms like Blinkit and Swiggy Instamart to recommend the cheapest option. Available categories and stores:\n${storeList}`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 160,
      }),
    });
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    const stores = findStores(message);
    return NextResponse.json({ text: reply || fallback.text, stores });
  } catch {
    return NextResponse.json({
      text: 'Sorry, I could not process that. Please try again.',
      stores: [],
    });
  }
}
