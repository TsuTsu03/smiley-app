"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import MarketingNav from "./MarketingNav";
import MarketingFooter from "./MarketingFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  { icon: Users, title: "Patient Records", desc: "Complete medical history, treatment plans, and allergies — all in one secure profile.", color: "bg-sky-50 text-sky-600" },
  { icon: Calendar, title: "Smart Booking", desc: "Patients book online by date or dentist. Automatic conflict detection and confirmations.", color: "bg-teal-50 text-teal-600" },
  { icon: Bell, title: "Automated Reminders", desc: "SMS and email reminders for upcoming appointments and adjustment follow-ups.", color: "bg-amber-50 text-amber-600" },
  { icon: Building2, title: "Multi-Clinic Ready", desc: "Manage multiple branches under one account. Each clinic gets its own branded portal.", color: "bg-purple-50 text-purple-600" },
  { icon: Stethoscope, title: "Dentist Dashboard", desc: "Dentists view their schedule, patient records, and add treatment notes on the go.", color: "bg-rose-50 text-rose-600" },
  { icon: SmilePlus, title: "Patient Portal", desc: "Patients view their records, book appointments, and check upcoming visits.", color: "bg-emerald-50 text-emerald-600" },
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <MarketingNav />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-teal-50/40" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/60 px-4 py-1.5 rounded-full text-teal-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Trusted by 500+ dental clinics
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-sky-950 leading-[1.1] mb-6">
              The smartest way to run your{" "}
              <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">
                dental clinic
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Patient records, appointments, reminders, and analytics — all in one beautiful platform.
              Set up in minutes, not months.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-sky-700 to-sky-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all hover:-translate-y-0.5 text-base"
              >
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-7 py-3.5 bg-white text-sky-700 font-semibold rounded-2xl border border-sky-200/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-base"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero image — dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-sky-900/10 border border-sky-200/40">
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1400&q=80"
                alt="Smiley dashboard"
                width={1400}
                height={800}
                className="w-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-sky-400/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="border-y border-sky-100/60 bg-sky-50/50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "500+", label: "Clinics" },
            { value: "10,000+", label: "Patients Managed" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9/5", label: "User Rating" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-display text-2xl sm:text-3xl text-sky-900 font-bold">{value}</div>
              <div className="text-sky-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Everything you need
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl text-sky-950 mb-4">
              Built for modern dental clinics
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg max-w-2xl mx-auto">
              From patient intake to follow-up reminders, Smiley handles the entire clinic workflow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group bg-white rounded-2xl p-7 border border-sky-100/60 hover:shadow-lg hover:shadow-sky-100/50 transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-sky-900 text-lg mb-2">{title}</h3>
                <p className="text-sky-600/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-sky-50/50 to-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Get started in minutes
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl text-sky-950">
              Three steps to a smarter clinic
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { step: "01", title: "Register your clinic", desc: "Sign up, name your clinic, and choose a plan that fits your size." },
              { step: "02", title: "Set up your team", desc: "Add dentists, configure schedules, and import patient records." },
              { step: "03", title: "Go live", desc: "Your branded portal is ready. Patients can book and you can manage — instantly." },
            ].map(({ step, title, desc }) => (
              <motion.div key={step} variants={fadeUp} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white font-display text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-500/20">
                  {step}
                </div>
                <h3 className="font-semibold text-sky-900 text-lg mb-2">{title}</h3>
                <p className="text-sky-600/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing preview ──────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl text-sky-950 mb-4">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {PLANS.map(({ name, price, desc, features, popular }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className={`relative bg-white rounded-2xl p-7 border transition-all hover:-translate-y-1 ${
                  popular
                    ? "border-sky-400 shadow-xl shadow-sky-200/40 ring-1 ring-sky-400/20"
                    : "border-sky-100/60 hover:shadow-lg hover:shadow-sky-100/50"
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-sky-600 to-teal-500 text-white text-xs font-semibold rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="font-semibold text-sky-900 text-lg">{name}</h3>
                <p className="text-sky-500 text-sm mt-1 mb-5">{desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-4xl text-sky-950">${price}</span>
                  <span className="text-sky-400 text-sm">/month</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-sky-700/70">
                      <CheckCircle2 size={16} className="text-teal-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/register?plan=${name.toLowerCase()}`}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    popular
                      ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-soft hover:opacity-90"
                      : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:text-sky-800 transition-colors">
              Compare all features <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-sky-50/50 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-wider mb-3">
              Testimonials
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-sky-950">
              Loved by dental professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, quote }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-7 border border-sky-100/60 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sky-700/80 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
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

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="relative bg-gradient-to-br from-sky-700 to-sky-900 rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl" />

            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl text-white mb-4 relative">
              Ready to modernize your clinic?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sky-200/70 text-lg mb-8 max-w-xl mx-auto relative">
              Join hundreds of dental clinics already using Smiley. Set up takes less than 5 minutes.
            </motion.p>
            <motion.div variants={fadeUp} className="relative">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
