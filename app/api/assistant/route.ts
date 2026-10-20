import { NextRequest, NextResponse } from 'next/server';
import { assistantReply } from '../../lib/premium';
import { UserProfile } from '../../lib/types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { message, profile } = (await req.json()) as { message: string; profile?: UserProfile };
    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        reply: assistantReply(message, profile),
        source: 'rule',
      });
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are SROne, an expert AI shopping assistant. Help users find deals, compare basket prices, track budgets, get recommendations, build bundles and set WhatsApp alerts. Be concise and helpful in English or Hindi.',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 180,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || assistantReply(message, profile);
    return NextResponse.json({ reply, source: 'openai' });
  } catch {
    return NextResponse.json({
      reply: assistantReply('hello', { id: 'guest' }),
      source: 'rule',
    });
  }
}
