'use client';

import { useEffect, useRef, useState } from 'react';

interface StoreLink {
  name: string;
  link: string;
  category?: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  stores?: StoreLink[];
}

const suggestions = [
  'Best deals today?',
  'Sasta hotel kahan milega?',
  'Flight booking sites?',
  'Grocery offers?',
  'Recharge cashback?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hi! I'm the SROne AI assistant. Ask me anything — stores, deals, hotels, travel. हिंदी में भी पूछ सकते हैं!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const reply = data?.text || data?.reply || 'Sorry, try again.';
      const stores = data?.stores || [];
      setMessages((m) => [...m, { role: 'assistant', text: reply, stores }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error — please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Voice input is not supported in this browser. Please type instead.' },
      ]);
      return;
    }
    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      send(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const close = () => setOpen(false);

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
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[28rem] flex flex-col rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl">
          <div className="px-4 py-3 bg-brand-800/80 border-b border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-white">SROne AI Assistant</span>
            <span className="ml-auto text-[10px] text-gray-500 uppercase tracking-wider">EN · हिं</span>
            <button onClick={close} aria-label="Close chat" className="text-gray-400 hover:text-white ml-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-brand-accent text-brand-900' : 'bg-white/10 text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  {m.stores && m.stores.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.stores.map((s) => (
                        <a
                          key={s.name}
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-semibold hover:bg-brand-accent/30 transition-colors"
                          onClick={() => {
                            try {
                              fetch('/api/track', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ store: s.name, deal: null, type: 'chat_click' }),
                              });
                            } catch {}
                          }}
                        >
                          {s.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-brand-accent/50 hover:text-brand-accent transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl bg-white/10 text-gray-200 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2">
            <button
              onClick={toggleVoice}
              aria-label="Voice input"
              className={`px-3 py-2 rounded-lg border transition-colors ${
                listening
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
                if (e.key === 'Escape') close();
              }}
              placeholder="Type or speak... / हिंदी में पूछें"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-accent"
            />
            <button
              onClick={() => send()}
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
