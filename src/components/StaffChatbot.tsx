'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const SUGGESTIONS = [
  "Who's due for an adjustment this week?",
  "Today's appointments",
  'Patients with allergies',
  'Recent treatments',
];

const OFFLINE_REPLY =
  "The AI assistant isn't configured on this deployment yet. Ask your administrator to set `GROQ_API_KEY`. In the meantime you can find everything through the dashboard tabs.";

/**
 * Staff assistant (admin/dentist). AI-first — it answers from the clinic's live
 * data via /api/ai/staff-chat. When the model isn't configured, it degrades to
 * a short explanatory message rather than pretending to answer.
 */
export default function StaffChatbot() {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'bot',
    text: `Hi ${user?.fullName?.split(' ')[0] ?? 'there'} 👋 I'm your **Smiley** clinic assistant. Ask me about patients, appointments, schedules, or recent records — I read your clinic's live data.`,
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    const history = messages.map((m) => ({
      role: m.role === 'bot' ? ('assistant' as const) : ('user' as const),
      content: m.text,
    }));
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
    setInput('');
    setTyping(true);

    let reply = OFFLINE_REPLY;
    try {
      const res = await fetch('/api/ai/staff-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const json = await res.json();
      if (res.ok && json.configured && json.reply) reply = json.reply as string;
      else if (json.error) reply = `Sorry — ${json.error}`;
    } catch {
      reply = 'Network error — please try again in a moment.';
    }

    setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: 'bot', text: reply }]);
    setTyping(false);
  };

  const renderText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 flex flex-col bg-surface rounded-2xl shadow-hover border border-line overflow-hidden animate-slide-up"
          style={{ height: 'min(540px, calc(100dvh - 120px))' }}
        >
          <div className="bg-gradient-to-r from-sky-700 to-indigo-600 px-4 py-3 text-white flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-none">Clinic Assistant</div>
              <div className="text-sky-100 text-xs mt-0.5 capitalize">{role} · reads your clinic data</div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 p-3.5 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${msg.role === 'bot' ? 'bg-primary/10 text-primary' : 'bg-primary text-primary-fg'}`}>
                  {msg.role === 'bot' ? <Bot size={12} /> : <User size={12} />}
                </div>
                <div className={`max-w-[82%] px-3 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-line ${msg.role === 'bot' ? 'bg-bg text-fg rounded-tl-sm' : 'bg-primary text-primary-fg rounded-tr-sm'}`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Bot size={12} />
                </div>
                <div className="bg-bg px-3 py-2.5 rounded-xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-3.5">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3.5 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="press text-xs bg-bg text-muted border border-line px-2.5 py-1 rounded-full hover:text-fg hover:border-line-strong transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-line flex gap-2 flex-shrink-0 bg-surface">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about your clinic..."
              className="flex-1 px-3 py-2 rounded-xl border border-line bg-bg text-fg placeholder-subtle text-xs focus:border-primary focus:shadow-ring focus:outline-none transition-[border-color,box-shadow]"
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="press w-9 h-9 rounded-xl bg-accent text-accent-fg flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close assistant' : 'Open clinic assistant'}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${open ? 'bg-sky-800 rotate-90' : 'bg-gradient-to-br from-sky-700 to-indigo-700 hover:scale-110 active:scale-95'}`}
      >
        {open ? <X size={22} className="text-white" /> : <MessageSquare size={22} className="text-white" />}
      </button>
    </>
  );
}
