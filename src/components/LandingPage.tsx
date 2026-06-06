"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
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
  Star,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  TrendingUp,
  CalendarCheck,
} from "lucide-react";
import MarketingNav from "./MarketingNav";
import MarketingFooter from "./MarketingFooter";

/* ──────────────────────────────────────────────────────────────
   Motion variants
   ────────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ──────────────────────────────────────────────────────────────
   Animated counter — counts up to `to` when scrolled into view
   ────────────────────────────────────────────────────────────── */
function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
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
    { icon: Bell, label: "Reminders" },
  ];
  const appts = [
    { name: "Liza Mariano", time: "9:00 AM", treat: "Cleaning", tone: "bg-teal-400" },
    { name: "Mark Villanueva", time: "10:30 AM", treat: "Braces adjust", tone: "bg-sky-400" },
    { name: "Andrea Cruz", time: "1:15 PM", treat: "Root canal", tone: "bg-purple-400" },
    { name: "Paolo Ramos", time: "3:00 PM", treat: "Whitening", tone: "bg-amber-400" },
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
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500" />
            <span className="font-display text-sm font-bold text-sky-900">Smiley</span>
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
              <div className="text-[10px] text-sky-400">Good morning, Dr. Santos</div>
              <div className="font-display text-base sm:text-lg text-sky-950 font-bold">Today&apos;s Overview</div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-600 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Live
            </div>
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              { label: "Appointments", value: "12", icon: CalendarCheck, tone: "text-sky-600 bg-sky-50" },
              { label: "New Patients", value: "8", icon: Users, tone: "text-teal-600 bg-teal-50" },
              { label: "Revenue", value: "₱48k", icon: TrendingUp, tone: "text-purple-600 bg-purple-50" },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="rounded-xl border border-sky-100/70 bg-white p-2.5">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1.5 ${tone}`}>
                  <Icon size={13} />
                </div>
                <div className="font-display text-base sm:text-lg text-sky-950 font-bold leading-none">{value}</div>
                <div className="text-[9px] text-sky-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* appointments */}
            <div className="sm:col-span-3 rounded-xl border border-sky-100/70 bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-sky-900">Upcoming</span>
                <span className="text-[9px] text-sky-400">Today</span>
              </div>
              <div className="space-y-1.5">
                {appts.map(({ name, time, treat, tone }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${tone} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                      {name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-medium text-sky-800 truncate">{name}</div>
                      <div className="text-[9px] text-sky-400 truncate">{treat}</div>
                    </div>
                    <span className="text-[9px] font-semibold text-sky-500 shrink-0">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* weekly chart */}
            <div className="sm:col-span-2 rounded-xl border border-sky-100/70 bg-white p-3">
              <div className="text-[11px] font-semibold text-sky-900 mb-0.5">Bookings</div>
              <div className="text-[9px] text-sky-400 mb-2">This week</div>
              <div className="flex items-end justify-between gap-1 h-16">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-sky-500 to-teal-400"
                    style={{ height: `${h}%` }}
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
    { day: "Mon", time: "9:00", label: "Cleaning", tone: "from-teal-400 to-teal-500", top: "8%" },
    { day: "Tue", time: "11:00", label: "Check-up", tone: "from-sky-400 to-sky-500", top: "34%" },
    { day: "Wed", time: "2:00", label: "Braces", tone: "from-purple-400 to-purple-500", top: "20%" },
    { day: "Thu", time: "10:30", label: "Whitening", tone: "from-amber-400 to-amber-500", top: "54%" },
    { day: "Fri", time: "3:30", label: "Filling", tone: "from-rose-400 to-rose-500", top: "40%" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-xl shadow-sky-900/10 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-base text-sky-950 font-bold">June 2026</div>
        <div className="flex items-center gap-1.5 text-[11px] text-sky-500 font-medium">
          <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">Week</span>
          <span className="px-2 py-0.5">Month</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {slots.map(({ day, time, label, tone, top }) => (
          <div key={day} className="relative">
            <div className="text-center text-[10px] font-semibold text-sky-400 mb-1.5">{day}</div>
            <div className="relative h-40 rounded-lg bg-sky-50/60 border border-sky-100/60 overflow-hidden">
              <div
                className={`absolute inset-x-1 rounded-md bg-gradient-to-br ${tone} p-1.5 text-white shadow-sm`}
                style={{ top }}
              >
                <div className="text-[9px] font-bold leading-none">{time}</div>
                <div className="text-[8px] opacity-90 mt-0.5 leading-none">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Data
   ────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Users, title: "Patient Records", desc: "Complete medical history, treatment plans, and allergies — all in one secure profile.", tone: "from-sky-500 to-sky-600" },
  { icon: Calendar, title: "Smart Booking", desc: "Patients book online by date or dentist. Automatic conflict detection and confirmations.", tone: "from-teal-500 to-teal-600" },
  { icon: Bell, title: "Automated Reminders", desc: "SMS and email reminders for upcoming appointments and follow-up visits.", tone: "from-amber-500 to-amber-600" },
  { icon: Building2, title: "Multi-Clinic Ready", desc: "Manage multiple branches under one account. Each clinic gets its own branded portal.", tone: "from-purple-500 to-purple-600" },
  { icon: Stethoscope, title: "Dentist Dashboard", desc: "Dentists view their schedule, patient records, and add treatment notes on the go.", tone: "from-rose-500 to-rose-600" },
  { icon: SmilePlus, title: "Patient Portal", desc: "Patients view their records, book appointments, and check upcoming visits anytime.", tone: "from-emerald-500 to-emerald-600" },
];

const PLANS = [
  {
    name: "Basic",
    price: 29,
    desc: "For small clinics getting started",
    features: ["1 clinic", "Up to 3 dentists", "100 patient records", "Appointment booking", "Basic reports"],
    popular: false,
  },
  {
    name: "Pro",
    price: 59,
    desc: "For growing clinics that need more",
    features: ["1 clinic", "Unlimited dentists", "Unlimited patients", "SMS & email reminders", "Priority support", "Advanced analytics"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    desc: "For multi-branch dental groups",
    features: ["Unlimited clinics", "Custom branding", "API access", "Dedicated support", "HIPAA compliance", "SLA guarantee"],
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Maria Santos",
    role: "Owner, BrightSmile Dental",
    quote: "Smiley transformed how we manage our clinic. Patient records that used to take hours are now at our fingertips. Our team loves it.",
  },
  {
    name: "Dr. Jose Reyes",
    role: "Lead Dentist, PearlWhite Clinic",
    quote: "The appointment system alone saved us 10 hours per week. Patients book online, we confirm in one click. No more phone tag.",
  },
  {
    name: "Rosa Magtanggol",
    role: "Clinic Manager, SmileCare BGC",
    quote: "We switched from spreadsheets and never looked back. The patient portal is a game-changer — fewer no-shows, happier patients.",
  },
];

const STATS = [
  { to: 500, suffix: "+", label: "Clinics onboarded" },
  { to: 10000, suffix: "+", label: "Patients managed" },
  { to: 99.9, decimals: 1, suffix: "%", label: "Uptime SLA" },
  { to: 4.9, decimals: 1, suffix: "/5", label: "Average rating" },
];

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <MarketingNav />

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
        {/* aurora background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/80 via-white to-white" />
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] bg-sky-300/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-10 -right-24 w-[30rem] h-[30rem] bg-teal-300/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        {/* dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(2,132,199,0.10) 1px, transparent 0)",
            backgroundSize: "34px 34px",
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-sky-200/70 px-4 py-1.5 rounded-full text-sky-700 text-sm font-medium mb-7 shadow-sm"
            >
              <Sparkles size={14} className="text-teal-500" />
              The all-in-one platform for modern dental clinics
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl text-sky-950 mb-6 tracking-tight"
            >
              Run your dental clinic
              <br className="hidden sm:block" />{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                  on autopilot
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C75 3 225 3 298 9"
                    stroke="url(#underline)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underline" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#0ea5e9" />
                      <stop offset="1" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sky-700/70 text-lg sm:text-xl leading-relaxed mb-9 max-w-2xl mx-auto"
            >
              Appointments, patient records, reminders, and analytics — beautifully unified.
              Launch your branded clinic portal in minutes, not months.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-sky-700 to-sky-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all hover:-translate-y-0.5 text-base"
              >
                Start 14-day free trial
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-7 py-3.5 bg-white/80 backdrop-blur text-sky-700 font-semibold rounded-2xl border border-sky-200/70 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-base"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-5 mt-6 text-xs text-sky-500"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-teal-500" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-teal-500" /> Cancel anytime
              </span>
            </motion.div>
          </motion.div>

          {/* product mockup + floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="mt-16 sm:mt-20 relative max-w-4xl mx-auto"
          >
            {/* glow behind mockup */}
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/20 via-teal-400/20 to-sky-400/20 rounded-[2rem] blur-2xl" />

            <div className="relative">
              <DashboardPreview />

              {/* floating notification — top right */}
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="hidden sm:flex absolute -top-5 -right-5 lg:-right-12 items-center gap-2.5 bg-white rounded-xl shadow-xl shadow-sky-900/10 border border-sky-50 px-3.5 py-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-teal-500" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-sky-900">Appointment booked</div>
                  <div className="text-[10px] text-sky-400">Liza M. · 9:00 AM</div>
                </div>
              </motion.div>

              {/* floating stat — bottom left */}
              <motion.div
                animate={{ y: [0, 9, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="hidden sm:flex absolute -bottom-6 -left-5 lg:-left-12 items-center gap-2.5 bg-white rounded-xl shadow-xl shadow-sky-900/10 border border-sky-50 px-3.5 py-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                  <TrendingUp size={16} className="text-sky-500" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-sky-900">98% attendance</div>
                  <div className="text-[10px] text-sky-400">Fewer no-shows</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ══════════════════════════════════════════════ */}
      <section className="border-y border-sky-100/70 bg-gradient-to-r from-sky-50/70 via-white to-teal-50/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ to, decimals, suffix, label }) => (
            <div key={label}>
              <div className="font-display text-3xl sm:text-4xl text-sky-900 font-bold">
                <Counter to={to} decimals={decimals} suffix={suffix} />
              </div>
              <div className="text-sky-500 text-sm mt-1.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══════════════════════════════════════════ */}
      <section id="features" className="py-20 sm:py-28 scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <motion.p variants={fadeUp} className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Everything you need
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-5xl text-sky-950 mb-4 tracking-tight">
              One platform. Your entire clinic.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              From patient intake to follow-up reminders, Smiley handles every step of your workflow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map(({ icon: Icon, title, desc, tone }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group relative bg-white rounded-2xl p-7 border border-sky-100/70 hover:border-transparent transition-all hover:-translate-y-1.5 hover:shadow-hover overflow-hidden"
              >
                {/* gradient wash on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tone} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${tone} flex items-center justify-center mb-5 shadow-lg shadow-sky-500/10 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="relative font-semibold text-sky-900 text-lg mb-2">{title}</h3>
                <p className="relative text-sky-600/70 text-sm leading-relaxed">{desc}</p>
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
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/60 px-3.5 py-1 rounded-full text-teal-700 text-xs font-semibold mb-5">
              <Zap size={13} /> Online booking
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl text-sky-950 mb-5 tracking-tight leading-tight">
              Let patients book themselves — around the clock
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/65 text-lg leading-relaxed mb-7">
              Your branded booking page lets patients pick a dentist, date, and time that works for
              them. Smiley handles conflicts, confirmations, and reminders — so your front desk
              doesn&apos;t have to.
            </motion.p>
            <motion.ul variants={stagger} className="space-y-3.5">
              {[
                { icon: Clock, text: "24/7 self-service booking, no phone calls" },
                { icon: Bell, text: "Automatic SMS & email confirmations" },
                { icon: ShieldCheck, text: "No double-bookings, ever" },
              ].map(({ icon: Icon, text }) => (
                <motion.li key={text} variants={fadeUp} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-sky-100 shadow-sm flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-teal-500" />
                  </div>
                  <span className="text-sky-800 text-sm font-medium">{text}</span>
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
            <motion.p variants={fadeUp} className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Get started in minutes
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-5xl text-sky-950 tracking-tight">
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
              { step: "01", title: "Register your clinic", desc: "Sign up, name your clinic, and choose a plan that fits your size." },
              { step: "02", title: "Set up your team", desc: "Add dentists, configure schedules, and import patient records." },
              { step: "03", title: "Go live", desc: "Your branded portal is ready. Patients book, you manage — instantly." },
            ].map(({ step, title, desc }) => (
              <motion.div key={step} variants={fadeUp} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white font-display text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-500/25 ring-4 ring-white">
                  {step}
                </div>
                <h3 className="font-semibold text-sky-900 text-lg mb-2">{title}</h3>
                <p className="text-sky-600/65 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
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
            <motion.p variants={fadeUp} className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-5xl text-sky-950 mb-4 tracking-tight">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              Start with a free trial, upgrade when you&apos;re ready. No hidden fees.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start"
          >
            {PLANS.map(({ name, price, desc, features, popular }) => (
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
                <h3 className={`font-semibold text-lg ${popular ? "text-white" : "text-sky-900"}`}>{name}</h3>
                <p className={`text-sm mt-1 mb-5 ${popular ? "text-sky-300" : "text-sky-500"}`}>{desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`font-display text-5xl ${popular ? "text-white" : "text-sky-950"}`}>${price}</span>
                  <span className={popular ? "text-sky-300 text-sm" : "text-sky-400 text-sm"}>/month</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${popular ? "text-sky-100" : "text-sky-700/75"}`}>
                      <CheckCircle2 size={16} className={popular ? "text-teal-300 shrink-0" : "text-teal-500 shrink-0"} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/register?plan=${name.toLowerCase()}`}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    popular
                      ? "bg-white text-sky-900 hover:bg-sky-50"
                      : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:text-sky-800 transition-colors">
              Compare all features <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Testimonials
            </p>
            <h2 className="font-display text-3xl sm:text-5xl text-sky-950 tracking-tight">
              Loved by dental professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, quote }) => (
              <div
                key={name}
                className="relative bg-white rounded-2xl p-7 border border-sky-100/70 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sky-700/80 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-sky-900 text-sm">{name}</div>
                    <div className="text-sky-500 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                backgroundSize: "28px 28px",
              }}
            />

            <motion.div variants={fadeUp} className="relative inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-white text-sm font-medium mb-6">
              <Sparkles size={14} className="text-teal-300" /> Join 500+ clinics
            </motion.div>
            <motion.h2 variants={fadeUp} className="relative font-display text-3xl sm:text-5xl text-white mb-4 tracking-tight">
              Ready to modernize your clinic?
            </motion.h2>
            <motion.p variants={fadeUp} className="relative text-sky-200/80 text-lg mb-9 max-w-xl mx-auto">
              Start your free 14-day trial today. Set up takes less than 5 minutes — no credit card needed.
            </motion.p>
            <motion.div variants={fadeUp} className="relative flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base"
              >
                Start Free Trial
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
    </div>
  );
}
