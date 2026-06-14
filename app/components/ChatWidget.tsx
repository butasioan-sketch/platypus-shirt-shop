'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  locale?: 'de' | 'ro' | 'en';
}

const WELCOME: Record<string, string> = {
  de: 'Hallo! Ich bin dein PLATYPUS Assistent. Wie kann ich helfen?',
  ro: 'Bună! Sunt asistentul tău PLATYPUS. Cum te pot ajuta?',
  en: 'Hi! I\'m your PLATYPUS assistant. How can I help?',
};

const PLACEHOLDERS: Record<string, string> = {
  de: 'Frage zu Größe, Versand...',
  ro: 'Întrebare despre mărimi, livrare...',
  en: 'Question about size, shipping...',
};

export default function ChatWidget({ locale = 'de' }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME[locale] || WELCOME.de },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          locale,
          history: messages.slice(-6),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: locale === 'ro' ? 'Eroare. Încearcă din nou.' : locale === 'en' ? 'Error. Please try again.' : 'Fehler. Bitte erneut versuchen.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat öffnen"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: open ? '#333' : '#fff',
          color: open ? '#fff' : '#000',
          border: 'none', cursor: 'pointer',
          fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'all 0.2s',
        }}
      >
        {open ? '×' : '💬'}
      </button>

      {/* CHAT FENSTER */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5rem', right: '1.5rem', zIndex: 999,
          width: '340px', maxHeight: '500px',
          background: '#111', border: '1px solid #222', borderRadius: '16px',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(226,0,26,0.15)',
          overflow: 'hidden',
        }}>

          {/* HEADER */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #e2001a, #a00014)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              🦆
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>PLATYPUS Assistent</p>
              <p style={{ fontSize: '0.7rem', color: '#4ade80' }}>● Online</p>
            </div>
          </div>

          {/* NACHRICHTEN */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.625rem 0.875rem', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? '#e2001a' : '#1a1a1a',
                  color: m.role === 'user' ? '#fff' : '#fff',
                  fontSize: '0.8rem', lineHeight: 1.5,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#1a1a1a', padding: '0.625rem 0.875rem', borderRadius: '12px 12px 12px 2px', color: '#555', fontSize: '0.8rem' }}>
                  ···
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '0.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={PLACEHOLDERS[locale]}
              style={{
                flex: 1, background: '#0a0a0a', border: '1px solid #222',
                borderRadius: '8px', padding: '0.5rem 0.75rem',
                color: '#fff', fontSize: '0.8rem', outline: 'none',
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: '#e2001a', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '0.5rem 0.95rem',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
              opacity: loading || !input.trim() ? 0.4 : 1,
            }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
