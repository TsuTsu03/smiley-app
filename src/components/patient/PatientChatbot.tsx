'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
  MOCK_DENTISTS, MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_CLINIC,
  getDentistById, fmtShortDate,
} from '@/lib/data';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

function getBotResponse(input: string, userId: string | null): string {
  const q = input.toLowerCase().trim();
  const patient = MOCK_PATIENTS.find(p => p.id === userId);
  const today = new Date().toISOString().split('T')[0];

  if (/^(hi|hello|hey|good\s+(morning|afternoon|evening)|greetings)/.test(q)) {
    return `Hello${patient ? `, ${patient.fullName.split(' ')[0]}` : ''}! I'm your Smiley dental assistant. I can help you with:\n\n• **My appointments** — "What are my upcoming appointments?"\n• **Dentist schedules** — "When is Dr. Santos available?"\n• **Procedures & FAQs** — Ask about any dental treatment\n• **Clinic info** — Address, contact, hours\n\nHow can I help you today?`;
  }

  if (/my appointment|my booking|my schedule|upcoming appointment|when is my/.test(q)) {
    const myApts = MOCK_APPOINTMENTS
      .filter(a => a.patientId === userId && a.date >= today && a.status !== 'cancelled')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    if (myApts.length === 0) {
      return `You have no upcoming appointments. Head to the **"Book Appointment"** tab to schedule one!`;
    }
    const list = myApts
      .map(a => `• **${a.type}** — ${fmtShortDate(a.date)} at ${a.time} with ${getDentistById(a.dentistId)?.fullName} (${a.status})`)
      .join('\n');
    return `Here are your upcoming appointments:\n\n${list}`;
  }

  if (/schedule|available|availability|when is|dentist hour|clinic hour|operating hour|open/.test(q)) {
    const formatSched = (d: typeof MOCK_DENTISTS[0]) =>
      `**${d.fullName}** — ${d.specialization}\n` +
      d.schedule.map(s => `  ${s.day}: ${s.startTime}–${s.endTime}`).join('\n');

    if (/santos|maria/.test(q)) return `Dr. Santos's schedule:\n\n${formatSched(MOCK_DENTISTS[0])}`;
    if (/reyes|jose/.test(q))   return `Dr. Reyes's schedule:\n\n${formatSched(MOCK_DENTISTS[1])}`;
    if (/cruz|ana/.test(q))     return `Dr. Cruz's schedule:\n\n${formatSched(MOCK_DENTISTS[2])}`;

    return `Our dentists' schedules:\n\n${MOCK_DENTISTS.map(formatSched).join('\n\n')}\n\nYou can book from the **"Book Appointment"** tab!`;
  }

  if (/dentist|doctor|dr\.|specialist/.test(q) && !/schedule|appointment|when/.test(q)) {
    const list = MOCK_DENTISTS.map(d => `• **${d.fullName}** — ${d.specialization}`).join('\n');
    return `Our dental team:\n\n${list}\n\nWant to know any of their schedules?`;
  }

  if (/how.*(book|reserv|make|schedule|get)|set an appointment/.test(q)) {
    return `Booking is easy! Go to the **"Book Appointment"** tab in your dashboard, choose your preferred dentist, date, and procedure type.\n\nNeed help picking the right procedure?`;
  }

  if (/cancel|reschedule|change appointment/.test(q)) {
    return `To cancel or reschedule, please contact us directly:\n\n📞 **${MOCK_CLINIC.phone}**\n📧 **${MOCK_CLINIC.email}**\n\nOur staff will be happy to help!`;
  }

  if (/address|location|where|contact|phone|email|reach|find you/.test(q)) {
    return `Our clinic information:\n\n🏥 **${MOCK_CLINIC.name}**\n📍 ${MOCK_CLINIC.address}\n📞 ${MOCK_CLINIC.phone}\n📧 ${MOCK_CLINIC.email}`;
  }

  if (/cleaning|prophylaxis/.test(q)) {
    return `**Teeth Cleaning (Prophylaxis)** removes plaque and tartar to prevent gum disease and cavities.\n\n⏱ Duration: 30–60 minutes\n💡 Recommended every 6 months\n\nWant to book a cleaning?`;
  }

  if (/extraction|remove.*tooth|pull.*tooth/.test(q)) {
    return `**Tooth Extraction** is the removal of a tooth under local anesthesia.\n\n⏱ Duration: 30–90 minutes\n🔹 After care: soft diet, avoid smoking and straws for 24h\n\nDr. Jose Reyes is our oral surgery specialist.`;
  }

  if (/filling|cavity|caries/.test(q)) {
    return `**Composite Filling** treats cavities with a natural tooth-colored material.\n\n⏱ Duration: 30–60 minutes per tooth\n💡 Avoid hard or sticky foods for 24h after treatment.`;
  }

  if (/root canal|endodont/.test(q)) {
    return `**Root Canal Treatment** removes infected pulp to save the tooth and relieve pain.\n\n⏱ Duration: 1–2 sessions of 60–90 minutes\n💡 You'll be under local anesthesia — it's more comfortable than it sounds! 😊`;
  }

  if (/whitening|bleach/.test(q)) {
    return `**Teeth Whitening** brightens your smile by removing stains.\n\n⏱ Duration: 60–90 minutes\n🌟 Results last 6–12 months with proper care\n💡 Avoid coffee and tea for 48h after treatment.`;
  }

  if (/braces|ortho|orthodontic|alignment|wire|bracket/.test(q)) {
    return `**Orthodontic Treatment** aligns your teeth for a healthier, straighter smile.\n\n🦷 Adjustments every 4–8 weeks\n⏱ Total treatment: 12–24 months on average\n\nDr. Maria Santos is our orthodontics specialist. Want her schedule?`;
  }

  if (/implant/.test(q)) {
    return `**Dental Implants** are permanent replacements for missing teeth placed directly into the jawbone.\n\n⏱ Full process takes several months\n✅ They look and function just like natural teeth!\n\nDr. Jose Reyes is our implant specialist.`;
  }

  if (/crown|bridge|denture/.test(q)) {
    return `We offer **Crowns**, **Bridges**, and **Dentures** to restore missing or damaged teeth:\n\n• **Crown** — caps a damaged tooth\n• **Bridge** — fills the gap from a missing tooth\n• **Denture** — removable replacement for multiple missing teeth\n\nBook a consultation to find the right option for you!`;
  }

  if (/pediatric|child|kid|children/.test(q)) {
    return `We love our young patients! 🦷 **Dr. Ana Cruz** is our Pediatric Dentistry specialist:\n\n${MOCK_DENTISTS[2].schedule.map(s => `• ${s.day}: ${s.startTime}–${s.endTime}`).join('\n')}\n\nFirst dental visit recommended by age 1!`;
  }

  if (/fluoride/.test(q)) {
    return `**Fluoride Treatment** strengthens enamel and prevents cavities.\n\n⏱ Duration: ~5–10 minutes\n💡 Recommended every 6 months for children and cavity-prone adults.`;
  }

  if (/pain|hurt|emergency|ache|toothache/.test(q)) {
    return `Sorry you're in pain! 😟 For emergencies, call us immediately:\n\n📞 **${MOCK_CLINIC.phone}**\n\nWhile waiting:\n• Rinse with warm salt water\n• Take OTC pain relief if no allergies\n• Avoid very hot or cold foods\n\nDon't ignore tooth pain — it can worsen quickly!`;
  }

  if (/insurance|hmo|payment|cost|price|fee|charge/.test(q)) {
    return `For fees, HMO coverage, and payment options, please contact us:\n\n📞 ${MOCK_CLINIC.phone}\n📧 ${MOCK_CLINIC.email}\n\nOur staff will give you an accurate quote based on your treatment.`;
  }

  if (/thank|thanks|salamat|appreciate/.test(q)) {
    return `You're welcome! 😊 Don't hesitate to ask if you have more questions. Take care of that smile!`;
  }

  if (/help|what can you|what do you know|how do you work/.test(q)) {
    return `Here's what I can help with:\n\n• **Your appointments** — "What are my upcoming appointments?"\n• **Dentist schedules** — "When is Dr. Reyes available?"\n• **Procedures** — cleaning, braces, extraction, fillings, implants, etc.\n• **Clinic info** — address, phone, email\n• **Booking** — how to book or reschedule\n• **Emergencies** — what to do for tooth pain\n\nJust type your question!`;
  }

  return `I'm not sure I understood that. Try asking:\n\n• "What are my appointments?"\n• "When is Dr. Santos available?"\n• "Tell me about teeth cleaning"\n• "What's your clinic address?"\n\nType **help** to see everything I can do!`;
}

const SUGGESTIONS = [
  'My appointments?',
  'Dentist schedules',
  'About braces',
  'How to book?',
];

export default function PatientChatbot() {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'bot',
    text: `Hi there! 👋 I'm your **Smiley** dental assistant.\n\nAsk me about dentist schedules, appointments, or dental procedures. Type **help** to see everything I can do!`,
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotResponse(text, userId);
      setMessages(prev => [...prev, { id: `b-${Date.now()}`, role: 'bot', text: reply }]);
      setTyping(false);
      if (!open) setHasUnread(true);
    }, 500 + Math.random() * 400);
  };

  const renderText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 flex flex-col bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden animate-slide-up"
          style={{ height: 'min(520px, calc(100dvh - 120px))' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 text-white flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-none">Smiley Assistant</div>
              <div className="text-teal-100 text-xs mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block animate-pulse" />
                Online — Ask me anything!
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-3.5 min-h-0">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${msg.role === 'bot' ? 'bg-teal-100 text-teal-600' : 'bg-teal-600 text-white'}`}>
                  {msg.role === 'bot' ? <Bot size={12} /> : <User size={12} />}
                </div>
                <div className={`max-w-[82%] px-3 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-line ${msg.role === 'bot' ? 'bg-teal-50 text-teal-800 rounded-tl-sm' : 'bg-teal-600 text-white rounded-tr-sm'}`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={12} />
                </div>
                <div className="bg-teal-50 px-3 py-2.5 rounded-xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-3.5">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <div className="px-3.5 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full hover:bg-teal-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-teal-100 flex gap-2 flex-shrink-0 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 rounded-xl border border-teal-100 bg-teal-50/40 text-teal-900 text-xs focus:border-teal-400 focus:outline-none transition-colors"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open Smiley Assistant'}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${open ? 'bg-teal-700 rotate-90' : 'bg-gradient-to-br from-teal-500 to-teal-700 hover:scale-110 active:scale-95'}`}
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageSquare size={22} className="text-white" />
        }
        {/* Unread dot */}
        {hasUnread && !open && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
