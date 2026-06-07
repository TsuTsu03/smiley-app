"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, X, ArrowRight, ChevronDown } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const PLANS = [
  {
    name: "Basic",
    monthlyPrice: 29,
    annualPrice: 279,
    desc: "For small clinics getting started",
    features: [
      "1 clinic location",
      "Up to 3 dentists",
      "100 patient records",
      "Appointment booking",
      "Basic reports & analytics",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 59,
    annualPrice: 569,
    desc: "For growing clinics that need more",
    features: [
      "1 clinic location",
      "Unlimited dentists",
      "Unlimited patients",
      "SMS & email reminders",
      "Advanced analytics",
      "Priority support",
      "Patient portal",
      "Custom branding",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 99,
    annualPrice: 959,
    desc: "For multi-branch dental groups",
    features: [
      "Unlimited clinic locations",
      "Unlimited dentists",
      "Unlimited patients",
      "All Pro features",
      "API access",
      "Dedicated account manager",
      "HIPAA compliance",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const COMPARISON = [
  { feature: "Clinic locations", basic: "1", pro: "1", enterprise: "Unlimited" },
  { feature: "Dentist accounts", basic: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Patient records", basic: "100", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Appointment booking", basic: true, pro: true, enterprise: true },
  { feature: "Patient portal", basic: false, pro: true, enterprise: true },
  { feature: "SMS reminders", basic: false, pro: true, enterprise: true },
  { feature: "Email reminders", basic: true, pro: true, enterprise: true },
  { feature: "Basic analytics", basic: true, pro: true, enterprise: true },
  { feature: "Advanced analytics", basic: false, pro: true, enterprise: true },
  { feature: "Custom branding", basic: false, pro: true, enterprise: true },
  { feature: "API access", basic: false, pro: false, enterprise: true },
  { feature: "HIPAA compliance", basic: false, pro: false, enterprise: true },
  { feature: "Dedicated support", basic: false, pro: false, enterprise: true },
];

const FAQS = [
  { q: "Can I try Smiley before committing?", a: "Yes! All plans come with a 14-day free trial. No credit card required to start." },
  { q: "Can I switch plans later?", a: "Absolutely. Upgrade or downgrade at any time. Changes take effect at your next billing cycle." },
  { q: "What payment methods do you accept?", a: "We accept GCash, Maya, GrabPay, and major credit and debit cards through our secure Philippine payment partner, PayMongo." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted at rest and in transit. We use Supabase (built on PostgreSQL) with row-level security and regular backups." },
  { q: "Do you offer refunds?", a: "If you cancel within 14 days of a paid billing cycle, we offer a full refund. No questions asked." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans">
      <MarketingNav />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="pt-28 pb-6 sm:pt-36 sm:pb-8 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl text-sky-950 mb-4">
              Simple, transparent pricing
            </motion.h1>
            <motion.p variants={fadeUp} className="text-sky-700/60 text-lg max-w-xl mx-auto mb-8">
              Choose the plan that fits your clinic. Start with a 14-day free trial, upgrade anytime.
            </motion.p>

            {/* Toggle */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 bg-sky-50 rounded-full p-1 border border-sky-100">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  !annual ? "bg-white text-sky-900 shadow-sm" : "text-sky-500 hover:text-sky-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  annual ? "bg-white text-sky-900 shadow-sm" : "text-sky-500 hover:text-sky-700"
                }`}
              >
                Annual <span className="text-teal-600 text-xs ml-1">Save 20%</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Plan cards ────────────────────────────────────── */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
          >
            {PLANS.map(({ name, monthlyPrice, annualPrice, desc, features, cta, popular }) => {
              const price = annual ? Math.round(annualPrice / 12) : monthlyPrice;
              return (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className={`relative bg-white rounded-2xl p-8 border flex flex-col transition-all hover:-translate-y-1 ${
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

                  <h3 className="font-semibold text-sky-900 text-xl">{name}</h3>
                  <p className="text-sky-500 text-sm mt-1 mb-5">{desc}</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-5xl text-sky-950">${price}</span>
                    <span className="text-sky-400 text-sm">/mo</span>
                  </div>
                  {annual && (
                    <p className="text-teal-600 text-xs mb-5">
                      ${annualPrice}/year &middot; Save ${monthlyPrice * 12 - annualPrice}
                    </p>
                  )}
                  {!annual && <div className="mb-5" />}

                  <ul className="space-y-3 mb-8 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-sky-700/70">
                        <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/register?plan=${name.toLowerCase()}`}
                    className={`block text-center py-3.5 rounded-xl font-semibold text-sm transition-all ${
                      popular
                        ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-soft hover:opacity-90"
                        : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                    }`}
                  >
                    {cta} <ArrowRight size={14} className="inline ml-1" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Feature comparison ────────────────────────────── */}
      <section className="py-20 bg-sky-50/50 border-y border-sky-100/60">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-2xl sm:text-3xl text-sky-950 text-center mb-10">
            Compare all features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-200/60">
                  <th className="text-left py-3 pr-4 text-sky-500 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-sky-700 font-semibold">Basic</th>
                  <th className="text-center py-3 px-4 text-sky-700 font-semibold">Pro</th>
                  <th className="text-center py-3 px-4 text-sky-700 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ feature, basic, pro, enterprise }) => (
                  <tr key={feature} className="border-b border-sky-100/60">
                    <td className="py-3 pr-4 text-sky-700">{feature}</td>
                    {[basic, pro, enterprise].map((val, i) => (
                      <td key={i} className="text-center py-3 px-4">
                        {val === true ? (
                          <CheckCircle2 size={16} className="text-teal-500 mx-auto" />
                        ) : val === false ? (
                          <X size={16} className="text-sky-300 mx-auto" />
                        ) : (
                          <span className="text-sky-700 font-medium">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-2xl sm:text-3xl text-sky-950 text-center mb-10">
            Frequently asked questions
          </h2>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-xl border border-sky-100/60 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-sky-900 text-sm">{q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-sky-400 shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-sky-600/70 leading-relaxed">{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="bg-gradient-to-br from-sky-700 to-sky-900 rounded-3xl p-10 sm:p-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-3">
              Ready to get started?
            </h2>
            <p className="text-sky-200/70 mb-8">
              14-day free trial. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Start Free Trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
