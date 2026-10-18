'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! I\'m the SROne AI assistant. Ask me anything — best stores, deals, hotels, travel...' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', text: data.reply || 'Sorry, try again.' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error — please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat with AI assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-accent text-brand-900 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8m-8 4h5m-9 8l3-3h10a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[26rem] flex flex-col rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl">
          <div className="px-4 py-3 bg-brand-800/80 border-b border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-white">SROne AI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-brand-accent text-brand-900' : 'bg-white/10 text-gray-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-gray-500">AI is thinking...</p>}
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about stores, deals..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-accent"
            />
            <button
              onClick={send}
              className="px-4 py-2 rounded-lg bg-brand-accent text-brand-900 text-sm font-bold hover:bg-brand-accent-hover"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
