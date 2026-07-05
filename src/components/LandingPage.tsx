"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Bell,
  Building2,
  Stethoscope,
  SmilePlus,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  TrendingUp,
  CalendarCheck,
  Play,
  X,
  XCircle,
  MessageSquare,
  FileText,
  Lock,
  Cloud,
  Download,
  ScrollText,
  Activity,
  UserCog,
  Bot,
  Brain,
  Mic,
  BarChart3,
  Send,
  Receipt
} from "lucide-react";
import MarketingNav from "./MarketingNav";
import MarketingFooter from "./MarketingFooter";
import { FAQS } from "@/lib/seo";
import ScheduleDemo from "./ScheduleDemo";
import ComingSoonModal from "./ComingSoonModal";
import { SmileyIcon } from "./Logo";

/* ──────────────────────────────────────────────────────────────
   Motion variants
   ────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.09 } }
};

/* ──────────────────────────────────────────────────────────────
   Ambient "video" background — a living, looping gradient mesh.
   No video asset to 404; it's a coded, continuously-moving scene
   (drifting auroras + a slow-rotating conic ring + floating motes)
   that gives the page motion and depth instead of flat white.
   `tone` switches between the light hero wash and dark sections.
   ────────────────────────────────────────────────────────────── */
function AmbientBackground({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  // colour-matched motes that drift across the section
  const motes = [
    { x: "12%", y: "22%", s: 6, d: 0 },
    { x: "82%", y: "16%", s: 4, d: 1.4 },
    { x: "68%", y: "70%", s: 8, d: 0.6 },
    { x: "28%", y: "78%", s: 5, d: 2.1 },
    { x: "48%", y: "38%", s: 3, d: 1.1 },
    { x: "90%", y: "52%", s: 5, d: 0.3 }
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* base wash */}
      <div
        className={
          dark
            ? "absolute inset-0 bg-gradient-to-b from-sky-950 via-sky-950 to-sky-900"
            : "absolute inset-0 bg-gradient-to-b from-sky-50/80 via-white to-white"
        }
      />

      {/* slow-rotating conic ring — the "alive" core of the scene */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 w-[55rem] h-[55rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-50"
        style={{
          background: dark
            ? "conic-gradient(from 0deg, rgba(14,165,233,0.18), rgba(20,184,166,0.16), rgba(2,132,199,0.10), rgba(14,165,233,0.18))"
            : "conic-gradient(from 0deg, rgba(14,165,233,0.16), rgba(20,184,166,0.16), rgba(168,85,247,0.10), rgba(14,165,233,0.16))"
        }}
      />

      {/* drifting auroras */}
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full blur-3xl ${dark ? "bg-sky-500/25" : "bg-sky-300/30"}`}
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className={`absolute top-10 -right-24 w-[30rem] h-[30rem] rounded-full blur-3xl ${dark ? "bg-teal-500/25" : "bg-teal-300/30"}`}
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
        className={`absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-purple-500/20" : "bg-purple-200/25"}`}
      />

      {/* floating motes — subtle continuous motion, like dust in light */}
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${dark ? "bg-teal-300/40" : "bg-sky-400/40"}`}
          style={{ left: m.x, top: m.y, width: m.s, height: m.s }}
          animate={{ y: [0, -22, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: m.d
          }}
        />
      ))}

      {/* dotted grid, fading out */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dark
            ? "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)"
            : "radial-gradient(circle at 1px 1px, rgba(2,132,199,0.10) 1px, transparent 0)",
          backgroundSize: "34px 34px",
          maskImage: "linear-gradient(to bottom, black, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 80%)"
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Coded product mockup — the "dashboard" shown in the hero.
   Built in markup (no stock photos) so it looks like the real app.
   ────────────────────────────────────────────────────────────── */
function DashboardPreview() {
  const nav = [
    { icon: TrendingUp, label: "Dashboard", active: true },
    { icon: Calendar, label: "Appointments" },
    { icon: Users, label: "Patients" },
    { icon: Stethoscope, label: "Dentists" },
    { icon: Bell, label: "Reminders" }
  ];
  const appts = [
    {
      name: "Liza Mariano",
      time: "9:00 AM",
      treat: "Cleaning",
      tone: "bg-teal-400"
    },
    {
      name: "Mark Villanueva",
      time: "10:30 AM",
      treat: "Braces adjust",
      tone: "bg-sky-400"
    },
    {
      name: "Andrea Cruz",
      time: "1:15 PM",
      treat: "Root canal",
      tone: "bg-purple-400"
    },
    {
      name: "Paolo Ramos",
      time: "3:00 PM",
      treat: "Whitening",
      tone: "bg-amber-400"
    }
  ];
  const bars = [42, 58, 36, 70, 52, 84, 48];

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-2xl shadow-sky-900/10 overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-4 h-9 border-b border-sky-50 bg-sky-50/50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        <div className="ml-3 text-[10px] sm:text-[11px] text-sky-400 font-medium tracking-wide">
          app.smiley.com/dashboard
        </div>
      </div>

      <div className="flex">
        {/* sidebar */}
        <div className="hidden sm:flex flex-col w-40 shrink-0 border-r border-sky-50 p-3 gap-1">
          <div className="flex items-center gap-2 px-2 mb-3">
            <SmileyIcon size={22} />
            <span className="font-display text-sm font-bold text-sky-900">
              Smiley
            </span>
          </div>
          {nav.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium ${
                active ? "bg-sky-100 text-sky-700" : "text-sky-400"
              }`}
            >
              <Icon size={13} />
              {label}
            </div>
          ))}
        </div>

        {/* main panel */}
        <div className="flex-1 p-4 sm:p-5 bg-gradient-to-br from-white to-sky-50/40 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] text-sky-400">
                Good morning, Dr. Santos
              </div>
              <div className="font-display text-base sm:text-lg text-sky-950 font-bold">
                Today&apos;s Overview
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-600 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />{" "}
              Live
            </div>
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              {
                label: "Appointments",
                value: "12",
                icon: CalendarCheck,
                tone: "text-sky-600 bg-sky-50"
              },
              {
                label: "New Patients",
                value: "8",
                icon: Users,
                tone: "text-teal-600 bg-teal-50"
              },
              {
                label: "Revenue",
                value: "₱48k",
                icon: TrendingUp,
                tone: "text-purple-600 bg-purple-50"
              }
            ].map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className="rounded-xl border border-sky-100/70 bg-white p-2.5"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1.5 ${tone}`}
                >
                  <Icon size={13} />
                </div>
                <div className="font-display text-base sm:text-lg text-sky-950 font-bold leading-none">
                  {value}
                </div>
                <div className="text-[9px] text-sky-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* appointments */}
            <div className="sm:col-span-3 rounded-xl border border-sky-100/70 bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-sky-900">
                  Upcoming
                </span>
                <span className="text-[9px] text-sky-400">Today</span>
              </div>
              <div className="space-y-1.5">
                {appts.map(({ name, time, treat, tone }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full ${tone} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
                    >
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-medium text-sky-800 truncate">
                        {name}
                      </div>
                      <div className="text-[9px] text-sky-400 truncate">
                        {treat}
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-sky-500 shrink-0">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* weekly chart */}
            <div className="sm:col-span-2 rounded-xl border border-sky-100/70 bg-white p-3">
              <div className="text-[11px] font-semibold text-sky-900 mb-0.5">
                Bookings
              </div>
              <div className="text-[9px] text-sky-400 mb-2">This week</div>
              <div className="flex items-end justify-between gap-1 h-16">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.06,
                      ease: "easeOut"
                    }}
                    className="flex-1 rounded-t bg-gradient-to-t from-sky-500 to-teal-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Coded "booking calendar" mockup for the product-spotlight section
   ────────────────────────────────────────────────────────────── */
function BookingPreview() {
  const slots = [
    {
      day: "Mon",
      time: "9:00",
      label: "Cleaning",
      tone: "from-teal-400 to-teal-500",
      top: "8%"
    },
    {
      day: "Tue",
      time: "11:00",
      label: "Check-up",
      tone: "from-sky-400 to-sky-500",
      top: "34%"
    },
    {
      day: "Wed",
      time: "2:00",
      label: "Braces",
      tone: "from-purple-400 to-purple-500",
      top: "20%"
    },
    {
      day: "Thu",
      time: "10:30",
      label: "Whitening",
      tone: "from-amber-400 to-amber-500",
      top: "54%"
    },
    {
      day: "Fri",
      time: "3:30",
      label: "Filling",
      tone: "from-rose-400 to-rose-500",
      top: "40%"
    }
  ];
  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-xl shadow-sky-900/10 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-base text-sky-950 font-bold">
          June 2026
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-sky-500 font-medium">
          <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">
            Week
          </span>
          <span className="px-2 py-0.5">Month</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {slots.map(({ day, time, label, tone, top }, i) => (
          <div key={day} className="relative">
            <div className="text-center text-[10px] font-semibold text-sky-400 mb-1.5">
              {day}
            </div>
            <div className="relative h-40 rounded-lg bg-sky-50/60 border border-sky-100/60 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className={`absolute inset-x-1 rounded-md bg-gradient-to-br ${tone} p-1.5 text-white shadow-sm`}
                style={{ top }}
              >
                <div className="text-[9px] font-bold leading-none">{time}</div>
                <div className="text-[8px] opacity-90 mt-0.5 leading-none">
                  {label}
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Auto-playing product demo — a coded "video" that cycles through
   the core workflow. Reads like a screen-recording without a heavy
   asset, and never 404s. Used in the demo section + modal.
   ────────────────────────────────────────────────────────────── */
const DEMO_SCENES = [
  {
    key: "book",
    tag: "Patient books online",
    icon: Calendar,
    tone: "from-teal-500 to-sky-500",
    render: () => (
      <div className="w-full max-w-sm">
        <div className="text-[11px] font-semibold text-sky-900 mb-3">
          Pick a time with Dr. Santos
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["9:00", "10:30", "1:15", "2:00", "3:30", "4:45"].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`text-center text-[11px] font-semibold rounded-lg py-2 border ${
                t === "1:15"
                  ? "bg-gradient-to-br from-teal-500 to-sky-500 text-white border-transparent shadow-md shadow-sky-500/30"
                  : "bg-white text-sky-600 border-sky-100"
              }`}
            >
              {t}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 text-white text-[12px] font-semibold py-2.5 shadow-lg shadow-sky-500/30"
        >
          <CheckCircle2 size={15} /> Confirm 1:15 PM
        </motion.div>
      </div>
    )
  },
  {
    key: "remind",
    tag: "Reminder sent automatically",
    icon: Bell,
    tone: "from-amber-500 to-orange-500",
    render: () => (
      <div className="w-full max-w-sm space-y-2.5">
        {[
          {
            c: "SMS",
            t: "Hi Andrea! Your cleaning is tomorrow at 1:15 PM 🦷",
            d: "Sent · 2s ago",
            on: true
          },
          {
            c: "Email",
            t: "Appointment confirmation + clinic directions",
            d: "Delivered",
            on: true
          },
          {
            c: "Follow-up",
            t: "Scheduled for 6 months from visit",
            d: "Queued",
            on: false
          }
        ].map(({ c, t, d, on }, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.22 }}
            className="flex items-start gap-3 rounded-xl border border-sky-100 bg-white p-3"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${on ? "bg-amber-50 text-amber-500" : "bg-sky-50 text-sky-400"}`}
            >
              {on ? <CheckCircle2 size={16} /> : <Clock size={16} />}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-sky-900">{c}</div>
              <div className="text-[10px] text-sky-500 leading-snug">{t}</div>
              <div className="text-[9px] text-teal-500 font-medium mt-0.5">
                {d}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    key: "record",
    tag: "Dentist updates the chart",
    icon: FileText,
    tone: "from-purple-500 to-sky-500",
    render: () => (
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-sky-400 text-white flex items-center justify-center text-[11px] font-bold">
            AC
          </div>
          <div>
            <div className="text-[12px] font-semibold text-sky-900">
              Andrea Cruz
            </div>
            <div className="text-[10px] text-sky-400">
              Record #2048 · Updated just now
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { l: "Treatment", v: "Scaling & polishing" },
            { l: "Notes", v: "Mild gingivitis, advised flossing" },
            { l: "Next visit", v: "Dec 2026 · auto-scheduled" }
          ].map(({ l, v }, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.18 }}
              className="rounded-lg border border-sky-100 bg-white px-3 py-2"
            >
              <div className="text-[9px] uppercase tracking-wide text-sky-400 font-semibold">
                {l}
              </div>
              <div className="text-[11px] text-sky-800 font-medium">{v}</div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-3 flex items-center gap-1.5 text-[11px] text-teal-600 font-semibold"
        >
          <CheckCircle2 size={14} /> Saved to patient portal
        </motion.div>
      </div>
    )
  },
  {
    key: "invoice",
    tag: "Invoice & payment recorded",
    icon: Receipt,
    tone: "from-emerald-500 to-teal-500",
    render: () => (
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[12px] font-semibold text-sky-900">
              INV-20260608
            </div>
            <div className="text-[10px] text-sky-400">Andrea Cruz</div>
          </div>
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
            PAID
          </span>
        </div>
        <div className="space-y-1.5 mb-3">
          {[
            ["Scaling & polishing", "₱1,500"],
            ["Fluoride treatment", "₱800"]
          ].map(([d, p], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.15 }}
              className="flex justify-between text-[11px] rounded-lg bg-white border border-sky-100 px-3 py-2"
            >
              <span className="text-sky-700">{d}</span>
              <span className="font-semibold text-sky-900">{p}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white px-3.5 py-2.5"
        >
          <span className="text-[11px] font-medium">Total paid</span>
          <span className="font-display text-lg">₱2,300</span>
        </motion.div>
      </div>
    )
  },
  {
    key: "analytics",
    tag: "Clinic performance, live",
    icon: TrendingUp,
    tone: "from-sky-500 to-purple-500",
    render: () => (
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            ["New patients", "+18"],
            ["Revenue", "₱82k"],
            ["Attendance", "96%"]
          ].map(([l, v], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-xl border border-sky-100 bg-white p-2.5 text-center"
            >
              <div className="font-display text-base text-sky-950 leading-none">
                {v}
              </div>
              <div className="text-[9px] text-sky-400 mt-1">{l}</div>
            </motion.div>
          ))}
        </div>
        <div className="rounded-xl border border-sky-100 bg-white p-3">
          <div className="text-[10px] font-semibold text-sky-500 mb-2">
            New patients · 6 months
          </div>
          <div className="flex items-end justify-between gap-1.5 h-20">
            {[40, 55, 48, 70, 62, 90].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                className="flex-1 rounded-t bg-gradient-to-t from-sky-500 to-teal-400"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
];

function DemoPlayer({ large = false }: { large?: boolean }) {
  const [scene, setScene] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(
      () => setScene((s) => (s + 1) % DEMO_SCENES.length),
      3600
    );
    return () => clearInterval(id);
  }, [inView]);

  const active = DEMO_SCENES[scene];
  const ActiveIcon = active.icon;

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl border border-sky-100 shadow-2xl shadow-sky-900/15 overflow-hidden"
    >
      {/* player chrome */}
      <div className="flex items-center gap-2 px-4 h-10 border-b border-sky-50 bg-sky-50/50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        <div className="ml-2 flex items-center gap-1.5 text-[11px] text-sky-500 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />{" "}
          Live product demo
        </div>
      </div>

      {/* stage */}
      <div
        className={`relative bg-gradient-to-br from-sky-50/60 via-white to-teal-50/40 flex items-center justify-center ${large ? "min-h-[22rem] p-8" : "min-h-[19rem] p-7"}`}
      >
        {/* current-step badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${active.tone} flex items-center justify-center text-white shadow-md`}
          >
            <ActiveIcon size={15} />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={active.tag}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] font-semibold text-sky-700"
            >
              {active.tag}
            </motion.span>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -14 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex justify-center pt-6"
          >
            {active.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* timeline / chapters */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-sky-50 bg-white">
        {DEMO_SCENES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setScene(i)}
            className="group flex-1 text-left"
            aria-label={s.tag}
          >
            <div className="h-1 rounded-full bg-sky-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-500 to-teal-400"
                initial={false}
                animate={{
                  width: i === scene ? "100%" : i < scene ? "100%" : "0%"
                }}
                transition={{
                  duration: i === scene ? 3.4 : 0.3,
                  ease: "linear"
                }}
                key={`${s.key}-${scene}`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Smiley AI mockup — an animated "assistant" panel for the AI
   section. Shows live no-show risk scoring + an AI suggestion the
   clinic can act on. Coded (no asset) so it animates and never 404s.
   ────────────────────────────────────────────────────────────── */
function AIPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const risks = [
    {
      i: "PR",
      name: "Paolo Ramos",
      time: "3:00 PM",
      level: "High",
      pct: 82,
      tone: "bg-rose-500",
      chip: "text-rose-600 bg-rose-50"
    },
    {
      i: "MV",
      name: "Mark Villanueva",
      time: "10:30 AM",
      level: "Medium",
      pct: 47,
      tone: "bg-amber-500",
      chip: "text-amber-600 bg-amber-50"
    },
    {
      i: "LM",
      name: "Liza Mariano",
      time: "9:00 AM",
      level: "Low",
      pct: 12,
      tone: "bg-teal-500",
      chip: "text-teal-600 bg-teal-50"
    }
  ];

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-sky-100 shadow-2xl shadow-sky-900/20 overflow-hidden"
    >
      {/* header */}
      <div className="flex items-center gap-2.5 px-4 h-12 border-b border-sky-50 bg-gradient-to-r from-sky-50 to-teal-50/60">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md">
          <Sparkles size={14} />
        </div>
        <div className="flex-1">
          <div className="text-[12px] font-bold text-sky-900 leading-none">
            Smiley AI
          </div>
          <div className="text-[9px] text-sky-400 mt-0.5">
            Predicting today&apos;s no-shows
          </div>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-semibold text-teal-600">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />{" "}
          Live
        </span>
      </div>

      {/* risk list */}
      <div className="p-4 space-y-2.5 bg-gradient-to-br from-white to-sky-50/40">
        <div className="text-[10px] font-semibold text-sky-500 uppercase tracking-wide">
          No-show risk · today
        </div>
        {risks.map((r, idx) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 + idx * 0.15 }}
            className="flex items-center gap-2.5"
          >
            <div
              className={`w-7 h-7 rounded-full ${r.tone} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
            >
              {r.i}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-sky-900 truncate">
                  {r.name}
                </span>
                <span className="text-[9px] text-sky-400">{r.time}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-sky-100 overflow-hidden">
                  <motion.div
                    className={`h-full ${r.tone}`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${r.pct}%` } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.15 }}
                  />
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${r.chip}`}
                >
                  {r.level}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.9 }}
        className="m-4 mt-0 rounded-xl border border-teal-200/70 bg-gradient-to-br from-sky-50 to-teal-50/60 p-3"
      >
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white shrink-0">
            <Brain size={13} />
          </div>
          <p className="text-[11px] text-sky-800 leading-snug">
            I drafted reminders for the{" "}
            <span className="font-semibold">2 high-risk</span> patients. Send
            them now?
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2.5 pl-8">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-sky-600 to-teal-500 px-2.5 py-1 rounded-lg shadow-sm">
            <Send size={11} /> Send reminders
          </span>
          <span className="text-[10px] font-medium text-sky-500 px-2 py-1">
            Edit
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Data
   ────────────────────────────────────────────────────────────── */
/* Mini UI previews shown inside each feature card — small,
   product-like glimpses instead of empty space below the text. */
const FeaturePreviews = {
  records: (
    <div className="flex items-center gap-2.5 rounded-lg bg-sky-50/70 border border-sky-100 px-2.5 py-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
        AC
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold text-sky-900 truncate">
          Andrea Cruz · #2048
        </div>
        <div className="text-[9px] text-sky-400 truncate">
          Scaling · Mild gingivitis
        </div>
      </div>
    </div>
  ),
  booking: (
    <div className="flex gap-1.5">
      {["9:00", "10:30", "1:15"].map((t) => (
        <div
          key={t}
          className={`flex-1 text-center text-[10px] font-semibold rounded-md py-1.5 border ${
            t === "1:15"
              ? "bg-gradient-to-br from-teal-500 to-sky-500 text-white border-transparent"
              : "bg-white text-sky-500 border-sky-100"
          }`}
        >
          {t}
        </div>
      ))}
    </div>
  ),
  reminders: (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 rounded-lg bg-amber-50/70 border border-amber-100 px-2.5 py-1.5">
        <Bell size={12} className="text-amber-500 shrink-0" />
        <span className="text-[10px] text-sky-700 truncate">
          SMS sent · cleaning tomorrow 1:15
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-sky-50/70 border border-sky-100 px-2.5 py-1.5">
        <CheckCircle2 size={12} className="text-teal-500 shrink-0" />
        <span className="text-[10px] text-sky-700 truncate">
          Email confirmation delivered
        </span>
      </div>
    </div>
  ),
  branches: (
    <div className="flex gap-1.5">
      {["BGC", "Makati", "QC"].map((b, i) => (
        <div
          key={b}
          className={`flex-1 rounded-md border px-2 py-1.5 text-center ${i === 0 ? "bg-purple-50 border-purple-200" : "bg-white border-sky-100"}`}
        >
          <div className="text-[10px] font-semibold text-sky-800">{b}</div>
          <div className="text-[8px] text-sky-400">branch</div>
        </div>
      ))}
    </div>
  ),
  dentist: (
    <div className="space-y-1">
      {[
        { t: "9:00", n: "Liza M." },
        { t: "10:30", n: "Mark V." }
      ].map(({ t, n }) => (
        <div
          key={t}
          className="flex items-center gap-2 rounded-md bg-rose-50/60 border border-rose-100 px-2 py-1"
        >
          <span className="text-[9px] font-bold text-rose-500 shrink-0">
            {t}
          </span>
          <span className="text-[10px] text-sky-700 truncate">{n}</span>
        </div>
      ))}
    </div>
  ),
  portal: (
    <div className="flex items-end justify-between gap-1 h-10">
      {[40, 64, 48, 80, 56, 72].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-gradient-to-t from-emerald-500 to-teal-400"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
};

const FEATURES = [
  {
    icon: Users,
    title: "Patient Records",
    desc: "Complete medical history, treatment plans, and allergies, all in one secure profile.",
    tone: "from-sky-500 to-sky-600",
    preview: FeaturePreviews.records
  },
  {
    icon: Calendar,
    title: "Smart Booking",
    desc: "Let patients choose a dentist, date, and time without the back-and-forth messages.",
    tone: "from-teal-500 to-teal-600",
    preview: FeaturePreviews.booking
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    desc: "SMS and email reminders for upcoming appointments and follow-up visits.",
    tone: "from-amber-500 to-amber-600",
    preview: FeaturePreviews.reminders
  },
  {
    icon: Building2,
    title: "Multi-Clinic Ready",
    desc: "Manage multiple branches under one account. Each clinic gets its own branded portal.",
    tone: "from-purple-500 to-purple-600",
    preview: FeaturePreviews.branches
  },
  {
    icon: Stethoscope,
    title: "Dentist Dashboard",
    desc: "Dentists view their schedule, patient records, and add treatment notes on the go.",
    tone: "from-rose-500 to-rose-600",
    preview: FeaturePreviews.dentist
  },
  {
    icon: SmilePlus,
    title: "Patient Portal",
    desc: "Patients view their records, book appointments, and check upcoming visits anytime.",
    tone: "from-emerald-500 to-emerald-600",
    preview: FeaturePreviews.portal
  }
];

/* Full "everything included" checklist — available now vs coming soon.
   `soon: true` items are paid-to-run (SMS) or larger modules still in build. */
const INCLUDED_FEATURES: { name: string; soon?: boolean }[] = [
  { name: "Patient management & records" },
  { name: "Dental charting & treatment notes" },
  { name: "Appointment scheduling" },
  { name: "Online booking portal" },
  { name: "Patient portal" },
  { name: "Automated email reminders" },
  { name: "AI assistant & services inquiry" },
  { name: "Activity logging & audit trail" },
  { name: "Role-based multi-user access" },
  { name: "Cloud-based access" },
  { name: "Analytics & reports" },
  { name: "Multi-branch support" },
  { name: "Queue management system" },
  { name: "Patient consent forms" },
  { name: "Billing & invoicing" },
  { name: "Insurance & HMO claims" },
  { name: "SMS reminders & receipts", soon: true }
];

const PLANS = [
  {
    name: "Starter",
    price: 2000,
    desc: "For solo dentists and small clinics",
    features: [
      "1 clinic",
      "Up to 3 dentists",
      "100 patient records",
      "Online booking portal",
      "Patient portal",
      "Basic reports"
    ],
    popular: false
  },
  {
    name: "Growth",
    price: 3500,
    desc: "For clinics with multiple dentists and staff",
    features: [
      "1 clinic",
      "Unlimited dentists",
      "Unlimited patients",
      "SMS & email reminders",
      "Patient portal",
      "Advanced analytics"
    ],
    popular: true
  },
  {
    name: "Multi-Clinic",
    price: 3000,
    unit: "/branch",
    desc: "For dental groups, billed per branch",
    features: [
      "Everything in Growth",
      "Per-branch billing",
      "Multi-branch dashboard",
      "Centralized records",
      "Role-based access",
      "Dedicated support"
    ],
    popular: false
  }
];

/* Pain points — shown on the dark "before Smiley" section */
const PAIN_POINTS = [
  {
    icon: MessageSquare,
    text: "Bookings buried in Messenger and text threads"
  },
  { icon: FileText, text: "Records scattered across paper, Excel, and chats" },
  { icon: Clock, text: "Manual reminders, and patients still forget and no-show" },
  { icon: Activity, text: "No clear view of daily clinic performance" },
  { icon: Building2, text: "Hard to manage multiple dentists or branches" }
];

/* Before → After comparison rows */
const BEFORE_AFTER = [
  {
    before: "Messenger & text bookings",
    after: "Branded online booking portal"
  },
  {
    before: "Paper files & spreadsheets",
    after: "Organized digital patient records"
  },
  { before: "Manual chat reminders", after: "Automatic SMS & email reminders" },
  {
    before: "Frequent missed appointments",
    after: "Fewer no-shows, full chairs"
  },
  { before: "No daily overview", after: "Real-time clinic dashboard" }
];

/* ROI / outcome cards — clinic owners buy outcomes, not features */
const BENEFITS = [
  {
    icon: Bell,
    title: "Reduce no-shows",
    desc: "Automated SMS and email reminders before every visit keep chairs full."
  },
  {
    icon: Clock,
    title: "Save admin hours",
    desc: "Patients book online without the back-and-forth, so your front desk gets time back."
  },
  {
    icon: SmilePlus,
    title: "Improve retention",
    desc: "Follow-up reminders and organized treatment history bring patients back."
  },
  {
    icon: TrendingUp,
    title: "Track performance",
    desc: "Appointments, revenue, new patients, and attendance in one live dashboard."
  }
];

/* Role-based value — helps every decision-maker see themselves */
const ROLES = [
  {
    icon: TrendingUp,
    title: "Clinic owners",
    desc: "Track revenue, appointments, patient growth, and branch performance at a glance."
  },
  {
    icon: Stethoscope,
    title: "Dentists",
    desc: "View schedules, patient records, notes, and full treatment history on any device."
  },
  {
    icon: CalendarCheck,
    title: "Front desk staff",
    desc: "Manage bookings, reminders, cancellations, and patient queues in seconds."
  },
  {
    icon: SmilePlus,
    title: "Patients",
    desc: "Book online, view appointment history, and get reminders without picking up the phone."
  }
];

/* Trust & security builders — critical for healthcare buyers */
const TRUST = [
  {
    icon: Lock,
    title: "Secure patient records",
    desc: "Encrypted storage with strict access controls."
  },
  {
    icon: UserCog,
    title: "Role-based access",
    desc: "Owners, dentists, and staff each see only what they need."
  },
  {
    icon: Cloud,
    title: "Automatic cloud backup",
    desc: "Your data is backed up and recoverable, always."
  },
  {
    icon: Download,
    title: "Exportable records",
    desc: "Own your data. Export patient records anytime."
  },
  {
    icon: ScrollText,
    title: "Audit logs",
    desc: "See who accessed or changed records, and when."
  },
  {
    icon: ShieldCheck,
    title: "Privacy-focused design",
    desc: "Built for the trust that clinic operations demand."
  }
];

/* Smiley AI capabilities — the modern differentiator */
const AI_FEATURES = [
  {
    icon: Brain,
    title: "No-show predictor",
    desc: "AI scores every appointment by no-show risk so you can send a nudge or fill the slot early."
  },
  {
    icon: Mic,
    title: "AI charting scribe",
    desc: "Speak naturally after a visit, and AI turns it into structured, ready-to-save treatment notes."
  },
  {
    icon: Bot,
    title: "AI front-desk assistant",
    desc: "A 24/7 chatbot that books, reschedules, and answers patients in Tagalog and English."
  },
  {
    icon: BarChart3,
    title: "Ask-your-data analytics",
    desc: "Ask in plain words, like \"Ilang new patients this month?\", and get instant answers and charts."
  }
];

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  // lock scroll while the demo modal is open
  useEffect(() => {
    document.body.style.overflow = demoOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [demoOpen]);

  return (
    <div data-theme="light" className="min-h-screen bg-white font-sans overflow-x-hidden">
      <MarketingNav />

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        {/* living, video-like ambient background */}
        <AmbientBackground tone="light" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            {/* ── LEFT: copy + CTA ───────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left max-w-xl mx-auto lg:mx-0"
            >
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6"
              >
                <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-sky-200/70 px-4 py-1.5 rounded-full text-sky-700 text-sm font-medium shadow-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                  </span>
                  Built for modern dental clinics
                </span>
                <a
                  href="#ai"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    background: "linear-gradient(135deg, #0284C7, #14B8A6)"
                  }}
                >
                  <Sparkles size={13} /> Powered by AI
                </a>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-[2.4rem] leading-[1.06] sm:text-5xl lg:text-6xl text-sky-950 mb-5 tracking-tight"
              >
                Stop losing patients to{" "}
                <span className="relative inline-block">
                  <span className="text-teal-600">
                    missed appointments
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M2 9C75 3 225 3 298 9"
                      stroke="url(#underline)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 0.9,
                        delay: 0.5,
                        ease: "easeOut"
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="underline"
                        x1="0"
                        y1="0"
                        x2="300"
                        y2="0"
                      >
                        <stop stopColor="#0ea5e9" />
                        <stop offset="1" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                and messy records.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-slate-600 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Smiley helps dental clinics manage online bookings, patient
                records, automated reminders, dentist schedules, and follow-ups,
                without spreadsheets or manual chat reminders.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5"
              >
                <Link
                  href="/register"
                  className="group flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all hover:-translate-y-0.5 text-base"
                  style={{
                    background: "linear-gradient(135deg, #0284C7, #14B8A6)"
                  }}
                >
                  Get started with Smiley
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <button
                  onClick={() => setDemoOpen(true)}
                  className="group flex items-center gap-2.5 px-6 py-3.5 bg-white/80 backdrop-blur text-sky-700 font-semibold rounded-2xl border border-sky-200/70 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-base"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                    <Play size={14} className="ml-0.5 fill-white" />
                  </span>
                  See how it works
                </button>
              </motion.div>

              <motion.p variants={fadeUp} className="text-xs text-sky-500 mt-4">
                Book a free demo · Setup takes less than 10 minutes.
              </motion.p>

              {/* value highlights */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5 mt-7"
              >
                {[
                  "Online booking portal",
                  "Automated reminders",
                  "Secure patient records"
                ].map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 text-sm font-medium text-sky-700"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-teal-500 shrink-0"
                    />
                    {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT: product mockup + floating cards ─────── */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="relative max-w-xl mx-auto lg:max-w-none w-full"
            >
              {/* glow behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/20 via-teal-400/20 to-sky-400/20 rounded-[2rem] blur-2xl" />

              <div className="relative">
                <DashboardPreview />

                {/* play overlay → opens demo */}
                <button
                  onClick={() => setDemoOpen(true)}
                  className="absolute inset-0 z-10 flex items-center justify-center group"
                  aria-label="Watch product demo"
                >
                  <span className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/90 backdrop-blur shadow-2xl shadow-sky-900/20 border border-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-600 to-teal-500 flex items-center justify-center text-white">
                      <Play size={16} className="ml-0.5 fill-white" />
                    </span>
                    <span className="text-sm font-semibold text-sky-900">
                      Play demo
                    </span>
                  </span>
                </button>

                {/* floating notification — top right */}
                <motion.div
                  animate={{ y: [0, -9, 0] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="hidden sm:flex absolute -top-5 -right-4 lg:-right-8 items-center gap-2.5 bg-white rounded-xl shadow-xl shadow-sky-900/10 border border-sky-50 px-3.5 py-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-teal-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-sky-900">
                      Appointment booked
                    </div>
                    <div className="text-[10px] text-sky-400">
                      Liza M. · 9:00 AM
                    </div>
                  </div>
                </motion.div>

                {/* floating notification — reminder sent (mid-left) */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="hidden sm:flex absolute top-1/3 -left-4 lg:-left-10 items-center gap-2.5 bg-white rounded-xl shadow-xl shadow-sky-900/10 border border-sky-50 px-3.5 py-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Bell size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-sky-900">
                      Reminder sent
                    </div>
                    <div className="text-[10px] text-sky-400">
                      SMS · Andrea C.
                    </div>
                  </div>
                </motion.div>

                {/* floating stat — bottom left */}
                <motion.div
                  animate={{ y: [0, 9, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                  className="hidden sm:flex absolute -bottom-6 -left-4 lg:-left-8 items-center gap-2.5 bg-white rounded-xl shadow-xl shadow-sky-900/10 border border-sky-50 px-3.5 py-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                    <TrendingUp size={16} className="text-sky-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-sky-900">
                      98% attendance
                    </div>
                    <div className="text-[10px] text-sky-400">
                      Fewer no-shows
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PAIN (dark navy) ═══════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <AmbientBackground tone="dark" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 px-3.5 py-1 rounded-full text-rose-200 text-xs font-semibold mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />{" "}
              Sound familiar?
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight leading-tight"
            >
              Still running your clinic through Messenger, paper records, and
              spreadsheets?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-200/70 text-lg">
              Every missed message is a missed appointment. Here&apos;s
              what&apos;s quietly costing your clinic time and patients.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {PAIN_POINTS.map(({ icon: Icon, text }) => (
              <motion.div
                key={text}
                variants={fadeUp}
                className="flex items-start gap-3 rounded-2xl bg-white/[0.06] backdrop-blur border border-white/10 p-5 hover:bg-white/[0.09] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-400/20 flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-rose-300" />
                </div>
                <p className="text-sky-100/90 text-sm font-medium leading-snug pt-1.5">
                  {text}
                </p>
              </motion.div>
            ))}
            <motion.div
              variants={fadeUp}
              className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-sky-500/20 border border-teal-300/25 p-5"
            >
              <p className="text-white font-semibold text-sm mb-1">
                There&apos;s a better way.
              </p>
              <p className="text-sky-200/80 text-sm leading-snug">
                Smiley replaces all of it with one simple platform built for
                dental clinics.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ BEFORE vs AFTER ════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-sky-50/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3"
            >
              The Smiley difference
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 tracking-tight"
            >
              From clinic chaos to calm control
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Before */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-sky-100 bg-white p-6 sm:p-7 shadow-soft"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                  <XCircle size={18} className="text-rose-400" />
                </div>
                <span className="font-display text-xl text-sky-950">
                  Before Smiley
                </span>
              </div>
              <ul className="space-y-3.5">
                {BEFORE_AFTER.map(({ before }) => (
                  <li
                    key={before}
                    className="flex items-center gap-3 text-sky-500 text-sm"
                  >
                    <XCircle size={16} className="text-rose-300 shrink-0" />
                    <span className="line-through decoration-rose-200">
                      {before}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* After */}
            <motion.div
              variants={fadeUp}
              className="relative rounded-2xl p-6 sm:p-7 shadow-card bg-gradient-to-br from-sky-50 to-teal-50/60 border border-teal-200/50"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-md">
                  <SmilePlus size={18} className="text-white" />
                </div>
                <span className="font-display text-xl text-sky-950">
                  After Smiley
                </span>
              </div>
              <ul className="space-y-3.5">
                {BEFORE_AFTER.map(({ after }) => (
                  <li
                    key={after}
                    className="flex items-center gap-3 text-sky-800 text-sm font-medium"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-teal-500 shrink-0"
                    />
                    {after}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ROI / BENEFITS ═════════════════════════════════════ */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3"
            >
              Outcomes, not just features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 tracking-tight"
            >
              What your clinic actually gains
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-2xl bg-white border border-sky-100/70 p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/15">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-sky-900 text-lg mb-1.5">
                  {title}
                </h3>
                <p className="text-sky-600/70 text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ LIVE DEMO ("video") ════════════════════════════════ */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200/60 px-3.5 py-1 rounded-full text-rose-600 text-xs font-semibold mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />{" "}
              See it in action
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 mb-5 tracking-tight leading-tight"
            >
              Watch a whole visit run itself
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-sky-700/65 text-lg leading-relaxed mb-7"
            >
              From the moment a patient picks a slot to the invoice and clinic
              insights, Smiley handles the busywork. Here&apos;s the full loop:
              booking, reminders, charting, billing, and analytics, happening
              live.
            </motion.p>
            <motion.ul variants={stagger} className="space-y-3.5 mb-8">
              {[
                {
                  icon: Calendar,
                  text: "Patient self-books in under 30 seconds"
                },
                {
                  icon: Bell,
                  text: "Confirmation + reminder fire automatically"
                },
                {
                  icon: FileText,
                  text: "Charting syncs straight to the patient portal"
                },
                {
                  icon: Receipt,
                  text: "Invoice and payment recorded in one tap"
                },
                {
                  icon: TrendingUp,
                  text: "Clinic performance updates in real time"
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
                  <span className="text-sky-800 text-sm font-medium">
                    {text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.button
              variants={fadeUp}
              onClick={() => setDemoOpen(true)}
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-sky-700 to-sky-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Play size={16} className="fill-white" />
              Play full demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-400/20 to-teal-400/20 rounded-3xl blur-2xl" />
            <div className="relative">
              <DemoPlayer />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES (bento) ═══════════════════════════════════ */}
      <section
        id="features"
        className="py-20 sm:py-28 scroll-mt-20 relative bg-gradient-to-b from-white to-sky-50/40"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3"
            >
              Everything you need
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 mb-4 tracking-tight"
            >
              One platform. Your entire clinic.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              From patient intake to follow-up reminders, Smiley handles every
              step of your workflow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map(({ icon: Icon, title, desc, tone, preview }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group relative bg-white rounded-2xl p-7 border border-sky-100/70 hover:border-transparent transition-all hover:-translate-y-1.5 hover:shadow-hover overflow-hidden"
              >
                {/* gradient wash on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tone} opacity-0 group-hover:opacity-[0.05] transition-opacity`}
                />
                {/* corner glow */}
                <div
                  className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${tone} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity rounded-full`}
                />
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${tone} flex items-center justify-center mb-5 shadow-lg shadow-sky-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-transform`}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="relative font-semibold text-sky-900 text-lg mb-2">
                  {title}
                </h3>
                <p className="relative text-sky-600/70 text-sm leading-relaxed mb-5">
                  {desc}
                </p>
                {/* mini product preview */}
                <div className="relative">{preview}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ EVERYTHING INCLUDED (checklist) ════════════════════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-12 max-w-2xl mx-auto"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3"
            >
              Everything included
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 mb-4 tracking-tight"
            >
              Everything you need to run your clinic
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              One platform for your whole clinic, with more on the way.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3.5"
          >
            {INCLUDED_FEATURES.map(({ name, soon }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                {soon ? (
                  <span className="w-5 h-5 rounded-full border-2 border-sky-200 flex items-center justify-center shrink-0">
                    <Clock size={11} className="text-sky-300" />
                  </span>
                ) : (
                  <CheckCircle2 size={20} className="text-teal-500 shrink-0" />
                )}
                <span
                  className={`text-sm ${soon ? "text-sky-400" : "text-sky-800 font-medium"}`}
                >
                  {name}
                </span>
                {soon && (
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded-full shrink-0">
                    Soon
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center text-xs text-sky-400 mt-10"
          >
            <CheckCircle2 size={12} className="inline text-teal-500 mr-1" />{" "}
            Available now
            <span className="mx-3">·</span>
            <Clock size={11} className="inline text-sky-300 mr-1" /> Coming soon
          </motion.p>
        </div>
      </section>

      {/* ═══ SMILEY AI (dark) ═══════════════════════════════════ */}
      <section
        id="ai"
        className="relative overflow-hidden py-20 sm:py-28 scroll-mt-20"
      >
        <AmbientBackground tone="dark" />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 px-4 py-1.5 rounded-full text-white text-sm font-medium mb-6"
            >
              <Sparkles size={14} className="text-teal-300" /> Powered by Smiley
              AI
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight leading-tight"
            >
              Your clinic&apos;s new AI teammate
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-200/75 text-lg">
              Smiley AI quietly handles the busywork: predicting no-shows,
              writing up visits, and answering patients, so your team can focus
              on care.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
            {/* animated AI mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative max-w-md mx-auto w-full lg:order-1"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-sky-400/25 to-teal-400/25 rounded-3xl blur-2xl" />
              <div className="relative">
                <AIPreview />
              </div>
            </motion.div>

            {/* capability cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="grid sm:grid-cols-2 gap-4 lg:order-2"
            >
              {AI_FEATURES.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="rounded-2xl bg-white/[0.06] backdrop-blur border border-white/10 p-5 hover:bg-white/[0.1] transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center mb-3.5 shadow-lg shadow-sky-900/30">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-[15px] mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sky-200/70 text-sm leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative text-center text-sky-300/60 text-xs mt-10"
          >
            Smiley AI assists your team. Every suggestion stays under clinic
            review and control.
          </motion.p>
        </div>
      </section>

      {/* ═══ ROLE-BASED VALUE ═══════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-sky-50/40 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3"
            >
              Built for your whole team
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 mb-4 tracking-tight"
            >
              Everyone in the clinic, on the same page
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              From the owner&apos;s office to the front desk to the
              patient&apos;s phone, each role gets exactly what they need.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {ROLES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group relative rounded-2xl bg-white border border-sky-100/70 p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-sky-400 to-teal-400 opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity" />
                <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-teal-500 transition-colors">
                  <Icon
                    size={20}
                    className="text-sky-600 group-hover:text-white transition-colors"
                  />
                </div>
                <div className="text-[10px] uppercase tracking-wider text-teal-600 font-semibold mb-1">
                  For
                </div>
                <h3 className="font-semibold text-sky-900 text-lg mb-2">
                  {title}
                </h3>
                <p className="text-sky-600/70 text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PRODUCT SPOTLIGHT ══════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-sky-50/60 to-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/60 px-3.5 py-1 rounded-full text-teal-700 text-xs font-semibold mb-5"
            >
              <Zap size={13} /> Online booking
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-4xl text-sky-950 mb-5 tracking-tight leading-tight"
            >
              Let patients book themselves, around the clock
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-sky-700/65 text-lg leading-relaxed mb-7"
            >
              Your branded booking page lets patients pick a dentist, date, and
              time that works for them. Smiley handles conflicts, confirmations,
              and reminders, so your front desk doesn&apos;t have to.
            </motion.p>
            <motion.ul variants={stagger} className="space-y-3.5">
              {[
                {
                  icon: Clock,
                  text: "24/7 self-service booking, no phone calls"
                },
                { icon: Bell, text: "Automatic SMS & email confirmations" },
                { icon: ShieldCheck, text: "No double-bookings, ever" }
              ].map(({ icon: Icon, text }) => (
                <motion.li
                  key={text}
                  variants={fadeUp}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-sky-100 shadow-sm flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-teal-500" />
                  </div>
                  <span className="text-sky-800 text-sm font-medium">
                    {text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-teal-400/15 to-sky-400/15 rounded-3xl blur-2xl" />
            <div className="relative">
              <BookingPreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3"
            >
              Get started in minutes
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 tracking-tight"
            >
              Three steps to a smarter clinic
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* connecting line */}
            <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-sky-200 via-teal-200 to-sky-200" />
            {[
              {
                step: "01",
                title: "Register your clinic",
                desc: "Sign up, name your clinic, and choose a plan that fits your size."
              },
              {
                step: "02",
                title: "Set up your team",
                desc: "Add dentists, configure schedules, and import patient records."
              },
              {
                step: "03",
                title: "Go live",
                desc: "Your branded portal is ready. Patients book, you manage, instantly."
              }
            ].map(({ step, title, desc }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white font-display text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-500/25 ring-4 ring-white">
                  {step}
                </div>
                <h3 className="font-semibold text-sky-900 text-lg mb-2">
                  {title}
                </h3>
                <p className="text-sky-600/65 text-sm leading-relaxed max-w-xs mx-auto">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST & SECURITY ═══════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-sky-50/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/60 px-3.5 py-1 rounded-full text-teal-700 text-xs font-semibold mb-5"
            >
              <ShieldCheck size={13} /> Safe for clinic operations
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 mb-4 tracking-tight"
            >
              Your patients&apos; data, protected
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              Healthcare runs on trust. Smiley is built to keep patient records
              secure, private, and always recoverable.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {TRUST.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="flex items-start gap-3.5 rounded-2xl bg-white border border-sky-100/70 p-5 shadow-soft hover:shadow-card transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shrink-0 shadow-md shadow-sky-500/15">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sky-900 text-[15px] mb-0.5">
                    {title}
                  </h3>
                  <p className="text-sky-600/70 text-sm leading-snug">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING PREVIEW ════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-sky-50/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3"
            >
              Pricing
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl sm:text-5xl text-sky-950 mb-4 tracking-tight"
            >
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              Pick a plan and activate anytime. Cancel whenever you want. No
              hidden fees.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start"
          >
            {PLANS.map(({ name, price, desc, features, popular, unit }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className={`relative rounded-2xl p-7 transition-all hover:-translate-y-1.5 ${
                  popular
                    ? "bg-gradient-to-b from-sky-900 to-sky-950 text-white shadow-2xl shadow-sky-900/30 md:scale-105"
                    : "bg-white border border-sky-100/70 hover:shadow-card"
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-400 to-sky-400 text-white text-xs font-semibold rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <h3
                  className={`font-semibold text-lg ${popular ? "text-white" : "text-sky-900"}`}
                >
                  {name}
                </h3>
                <p
                  className={`text-sm mt-1 mb-5 ${popular ? "text-sky-300" : "text-sky-500"}`}
                >
                  {desc}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={`font-display text-5xl ${popular ? "text-white" : "text-sky-950"}`}
                  >
                    ₱{price.toLocaleString()}
                  </span>
                  <span
                    className={
                      popular ? "text-sky-300 text-sm" : "text-sky-400 text-sm"
                    }
                  >
                    {unit ? `${unit}/mo` : "/month"}
                  </span>
                </div>
                <ul className="space-y-3 mb-7">
                  {features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2.5 text-sm ${popular ? "text-sky-100" : "text-sky-700/75"}`}
                    >
                      <CheckCircle2
                        size={16}
                        className={
                          popular
                            ? "text-teal-300 shrink-0"
                            : "text-teal-500 shrink-0"
                        }
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setComingSoon(true)}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    popular
                      ? "bg-white text-sky-900 hover:bg-sky-50"
                      : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:text-sky-800 transition-colors"
            >
              Compare all features <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SCHEDULE A DEMO ════════════════════════════════════ */}
      <ScheduleDemo />

      {/* ═══ FAQ (visible + matches FAQPage JSON-LD for AEO) ═════ */}
      <section id="faq" className="py-20 sm:py-28 bg-gradient-to-b from-white to-sky-50/50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-sky-950 tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-sky-700/80">
              Everything you need to know about Smiley dental clinic software.
            </p>
          </div>
          <dl className="space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-sky-100 bg-white p-5 shadow-sm open:shadow-md transition-shadow"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <dt className="font-semibold text-sky-950">{f.q}</dt>
                  <span className="text-sky-400 transition-transform group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <dd className="mt-3 text-sky-700 leading-relaxed">{f.a}</dd>
              </details>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="relative bg-gradient-to-br from-sky-700 via-sky-800 to-sky-950 rounded-[2rem] p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                backgroundSize: "28px 28px"
              }}
            />

            <motion.div
              variants={fadeUp}
              className="relative inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-white text-sm font-medium mb-6"
            >
              <Sparkles size={14} className="text-teal-300" /> Start managing
              your clinic today
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="relative font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight"
            >
              Ready to run your clinic with less admin work?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="relative text-sky-200/80 text-lg mb-9 max-w-xl mx-auto"
            >
              Launch your booking portal, automate reminders, and organize
              patient records in one place. Setup takes less than 10 minutes.
              Book a free demo to see it live.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="relative flex flex-wrap items-center justify-center gap-3.5"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base"
              >
                Get Started
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/15 transition-all text-base"
              >
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />

      <ComingSoonModal open={comingSoon} onClose={() => setComingSoon(false)} />

      {/* ═══ DEMO MODAL ═════════════════════════════════════════ */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setDemoOpen(false)}
          >
            <div className="absolute inset-0 bg-sky-950/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setDemoOpen(false)}
                className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-sky-700 shadow-lg flex items-center justify-center hover:bg-sky-50 transition-colors"
                aria-label="Close demo"
              >
                <X size={18} />
              </button>
              <DemoPlayer large />
              <p className="text-center text-white/80 text-sm mt-4">
                This is a live, coded walkthrough of the real workflow.{" "}
                <Link
                  href="/register"
                  className="font-semibold text-white underline underline-offset-2"
                >
                  Get started →
                </Link>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
