'use client';

import { useState } from 'react';
import {
  Users, CalendarCheck, Upload, Stethoscope, Bot, Sparkles, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { SmileyIcon } from '@/components/Logo';
import { useAuth } from '@/lib/auth';
import { Btn } from '@/components/ui';

/**
 * One-time product walkthrough shown to staff (admin/dentist) on first sign-in.
 * It replaces the old free-trial demo: instead of a countdown that locks the
 * app, new staff are walked through what Smiley does, then marked onboarded so
 * this never shows again. It is required (no dismiss) but only ~4 short steps,
 * and resumable — if they close the tab it reappears until finished.
 */

interface Step {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const COMMON_INTRO: Step = {
  icon: <SmileyIcon size={44} />,
  title: 'Welcome to Smiley',
  body: 'A quick tour of your clinic workspace. It takes under a minute, and you only see it once.',
};

const ADMIN_STEPS: Step[] = [
  COMMON_INTRO,
  {
    icon: <Users size={28} />,
    title: 'Manage patients',
    body: 'Add, search, and edit patient records from the Patients tab. Each record holds contact details, medical history, and appointment history.',
  },
  {
    icon: <Upload size={28} />,
    title: 'Import in bulk',
    body: 'Already have a patient list? Use Import in the Patients tab to upload a CSV. Rows are validated and matched by email, so re-importing updates instead of duplicating.',
  },
  {
    icon: <CalendarCheck size={28} />,
    title: 'Appointments & billing',
    body: 'Track the daily queue, confirm bookings, and issue invoices. Everything for your clinic stays scoped to your clinic.',
  },
  {
    icon: <Bot size={28} />,
    title: 'Ask the AI assistant',
    body: 'Open the assistant to ask about patients, schedules, or records in plain language, for example “who has an appointment tomorrow?”. It only reads your clinic’s data.',
  },
];

const DENTIST_STEPS: Step[] = [
  COMMON_INTRO,
  {
    icon: <CalendarCheck size={28} />,
    title: 'Your schedule',
    body: 'See your upcoming appointments and today’s queue the moment you sign in. Status updates as patients are seen.',
  },
  {
    icon: <Stethoscope size={28} />,
    title: 'Add clinical records',
    body: 'Open a patient to add treatment notes and records. They’re saved to that patient’s history for the whole care team.',
  },
  {
    icon: <Bot size={28} />,
    title: 'Ask the AI assistant',
    body: 'Ask the assistant about a patient’s history or your schedule in plain language. It only reads your clinic’s data.',
  },
];

export default function StaffWalkthrough() {
  const { role, completeOnboarding } = useAuth();
  const steps = role === 'dentist' ? DENTIST_STEPS : ADMIN_STEPS;
  const [i, setI] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const step = steps[i];
  const last = i === steps.length - 1;

  async function finish() {
    setFinishing(true);
    try {
      await completeOnboarding();
    } finally {
      // On error we still drop the overlay so staff aren't stuck; the flag
      // simply stays unset and the tour reappears next load.
      setFinishing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--overlay)/0.55)] backdrop-blur-sm p-4 animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Product walkthrough"
        className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-hover ring-1 ring-line text-center animate-scale-in"
      >
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-primary/8 text-primary ring-1 ring-line">
          {step.icon}
        </div>

        <h1 className="font-display text-2xl text-fg tracking-tight mb-2">{step.title}</h1>
        <p className="text-sm text-muted leading-relaxed mb-7">{step.body}</p>

        {/* progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-7" aria-hidden>
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={
                idx === i
                  ? 'h-1.5 w-6 rounded-full bg-primary transition-all'
                  : 'h-1.5 w-1.5 rounded-full bg-line-strong transition-all'
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Btn
            variant="ghost"
            size="md"
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0 || finishing}
          >
            <ArrowLeft size={15} /> Back
          </Btn>

          <span className="text-xs text-subtle tabular-nums">
            {i + 1} / {steps.length}
          </span>

          {last ? (
            <Btn onClick={finish} loading={finishing}>
              <Sparkles size={15} /> Get started
            </Btn>
          ) : (
            <Btn onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))}>
              Next <ArrowRight size={15} />
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
