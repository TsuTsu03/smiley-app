"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  Send,
  Loader2,
  Bell,
  Users,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const stagger = { visible: { transition: { staggerChildren: 0.09 } } };

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

type Form = {
  name: string;
  email: string;
  clinicName: string;
  dentists: string;
  phone: string;
  message: string;
  company: string; // honeypot
};

const EMPTY: Form = {
  name: "",
  email: "",
  clinicName: "",
  dentists: "1",
  phone: "",
  message: "",
  company: ""
};

/* Loads Calendly's inline widget once the prospect reaches the scheduling step. */
function CalendlyInline({ name, email }: { name: string; email: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CALENDLY_URL || !ref.current) return;
    const id = "calendly-widget-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  if (!CALENDLY_URL) {
    // No Calendly configured — the confirmation message alone is shown.
    return null;
  }

  const url = new URL(CALENDLY_URL);
  if (name) url.searchParams.set("name", name);
  if (email) url.searchParams.set("email", email);

  return (
    <div
      ref={ref}
      className="calendly-inline-widget rounded-xl overflow-hidden border border-sky-100"
      data-url={url.toString()}
      style={{ minWidth: "320px", height: "660px" }}
    />
  );
}

export default function ScheduleDemo() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm text-sky-900 placeholder:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400 transition";

  return (
    <section
      id="demo"
      className="py-20 sm:py-28 relative overflow-hidden scroll-mt-20"
    >
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* ── LEFT: value copy ─────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/60 px-3.5 py-1 rounded-full text-teal-600 text-xs font-semibold mb-5"
          >
            <CalendarCheck size={13} /> Schedule a demo
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl sm:text-5xl text-sky-950 mb-5 tracking-tight leading-tight"
          >
            See Smiley running your clinic — live
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sky-700/65 text-lg leading-relaxed mb-7"
          >
            Book a free, no-pressure walkthrough. We&apos;ll show you exactly
            how Smiley fits your clinic and answer every question.
          </motion.p>

          <motion.ul variants={stagger} className="space-y-3.5">
            {[
              {
                icon: Users,
                text: "Tailored to your clinic size and workflow"
              },
              {
                icon: Bell,
                text: "See booking, reminders, and records in action"
              },
              {
                icon: ShieldCheck,
                text: "No commitment — just see if it's a fit"
              }
            ].map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-sky-100 shadow-sm flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-teal-500" />
                </div>
                <span className="text-sky-800 text-sm font-medium">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ── RIGHT: form → Calendly ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-sky-100 shadow-xl shadow-sky-900/10 p-6 sm:p-7"
        >
          {status === "done" ? (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <CheckCircle2 size={22} className="text-teal-500" />
                </div>
                <div>
                  <div className="font-display text-lg text-sky-950 font-bold">
                    Request received!
                  </div>
                  <div className="text-sm text-sky-500">
                    We&apos;ve emailed you a confirmation.
                  </div>
                </div>
              </div>
              {CALENDLY_URL ? (
                <>
                  <p className="text-sm text-sky-700/80 my-4">
                    Pick a time that works for you and we&apos;ll meet you
                    there:
                  </p>
                  <CalendlyInline name={form.name} email={form.email} />
                </>
              ) : (
                <p className="text-sm text-sky-700/80 mt-4">
                  Thanks, {form.name.split(" ")[0]}! We&apos;ll reach out
                  shortly at{" "}
                  <span className="font-semibold text-sky-900">
                    {form.email}
                  </span>{" "}
                  to set up your demo.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="mb-1">
                <div className="font-display text-lg text-sky-950 font-bold">
                  Request your demo
                </div>
                <div className="text-sm text-sky-500">
                  Takes less than a minute.
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-sky-700 mb-1 block">
                    Your name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Dr. Juan Dela Cruz"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-sky-700 mb-1 block">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@clinic.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-sky-700 mb-1 block">
                    Clinic name *
                  </label>
                  <input
                    required
                    value={form.clinicName}
                    onChange={(e) => set("clinicName", e.target.value)}
                    placeholder="BrightSmile Dental"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-sky-700 mb-1 block">
                    Dentists
                  </label>
                  <select
                    value={form.dentists}
                    onChange={(e) => set("dentists", e.target.value)}
                    className={inputClass}
                  >
                    <option value="1">Just me</option>
                    <option value="2-3">2–3</option>
                    <option value="4-10">4–10</option>
                    <option value="10+">10+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-sky-700 mb-1 block">
                  Phone (optional)
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="0917 123 4567"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-sky-700 mb-1 block">
                  Anything specific? (optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={3}
                  placeholder="Tell us what you'd like to see…"
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* honeypot — hidden from humans */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="hidden"
                aria-hidden
              />

              {error && (
                <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="group w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #0284C7, #14B8A6)"
                }}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} /> Request demo
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
              <p className="text-[11px] text-sky-400 text-center">
                We&apos;ll only use your details to set up your demo.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
