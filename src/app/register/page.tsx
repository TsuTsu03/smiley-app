"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader,
  Building2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import LoadingScreen from "@/components/LoadingScreen";

const PLANS = [
  { key: "starter", name: "Starter", price: 1500, unit: "/mo", desc: "Solo dentists & small clinics" },
  { key: "growth", name: "Growth", price: 3500, unit: "/mo", desc: "Multiple dentists & staff", popular: true },
  { key: "multi-clinic", name: "Multi-Clinic", price: 3000, unit: "/branch", desc: "Dental groups — per branch" },
];

const fadeSlide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RegisterFlow />
    </Suspense>
  );
}

function RegisterFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselected = searchParams.get("plan") ?? "";

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [selectedPlan, setSelectedPlan] = useState(preselected || "growth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [form, setForm] = useState({
    clinicName: "",
    slug: "",
    address: "",
    phone: "",
    email: "",
    adminName: "",
    adminEmail: "",
    password: "",
  });

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "clinicName") {
      setForm((f) => ({
        ...f,
        clinicName: v,
        slug: v.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20),
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName: form.clinicName,
          slug: form.slug,
          address: form.address,
          phone: form.phone,
          email: form.email,
          adminName: form.adminName,
          adminEmail: form.adminEmail,
          password: form.password,
        }),
      });
      const json = await res.json();
      if (res.status === 201) {
        setStep(5);
      } else if (res.status === 409) {
        setError(json.error ?? "This clinic name is already taken");
      } else {
        setError(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = [
    { num: 1, label: "Plan" },
    { num: 2, label: "Clinic" },
    { num: 3, label: "Account" },
    { num: 4, label: "Payment" },
  ];

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-200 transition-all outline-none placeholder-sky-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50/30 font-sans flex flex-col">
      <MarketingNav />

      <div className="flex-1 pt-28 pb-16 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          {step < 5 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {STEPS.map(({ num, label }) => (
                <div key={num} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= num
                        ? "bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-md"
                        : "bg-sky-100 text-sky-400"
                    }`}
                  >
                    {step > num ? <CheckCircle2 size={16} /> : num}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step >= num ? "text-sky-700" : "text-sky-400"}`}>
                    {label}
                  </span>
                  {num < 4 && <div className={`w-8 h-0.5 rounded ${step > num ? "bg-teal-400" : "bg-sky-200"}`} />}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Select Plan */}
            {step === 1 && (
              <motion.div key="plan" {...fadeSlide}>
                <h2 className="font-display text-2xl text-sky-950 text-center mb-2">Choose your plan</h2>
                <p className="text-sky-500 text-sm text-center mb-8">All plans include a 14-day free trial</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PLANS.map(({ key, name, price, desc, popular, unit }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                        selectedPlan === key
                          ? "border-sky-500 bg-sky-50/50 shadow-lg shadow-sky-200/30"
                          : "border-sky-100 bg-white hover:border-sky-200"
                      }`}
                    >
                      {popular && (
                        <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white text-[10px] font-bold rounded-full">
                          POPULAR
                        </span>
                      )}
                      <div className="font-semibold text-sky-900">{name}</div>
                      <div className="flex items-baseline gap-0.5 mt-2 mb-2">
                        <span className="font-display text-2xl text-sky-950">₱{price.toLocaleString()}</span>
                        <span className="text-sky-400 text-xs">{unit === "/branch" ? "/branch/mo" : "/mo"}</span>
                      </div>
                      <div className="text-xs text-sky-500">{desc}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Link href="/pricing" className="flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700">
                    <ArrowLeft size={14} /> Compare plans
                  </Link>
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold rounded-xl shadow-soft hover:opacity-90 transition-opacity text-sm"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Clinic Info */}
            {step === 2 && (
              <motion.div key="clinic" {...fadeSlide}>
                <h2 className="font-display text-2xl text-sky-950 text-center mb-2">Clinic Information</h2>
                <p className="text-sky-500 text-sm text-center mb-8">Tell us about your clinic</p>

                <div className="bg-white rounded-2xl border border-sky-100/60 p-7 shadow-sm space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sky-800 mb-1.5 block">Clinic Name *</label>
                    <input value={form.clinicName} onChange={(e) => set("clinicName", e.target.value)} placeholder="BrightSmile Dental Clinic" className={inputClass} />
                  </div>
                  {form.slug && (
                    <div className="flex items-center gap-2 text-xs text-sky-600 bg-sky-50 rounded-lg px-3 py-2">
                      <Building2 size={12} />
                      Your portal: <span className="font-mono font-semibold">{form.slug}.smiley.app</span>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-sky-800 mb-1.5 block">Clinic Address *</label>
                    <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="123 Mabini St., Makati City" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-sky-800 mb-1.5 block">Phone</label>
                      <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(02) 8123-4567" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-sky-800 mb-1.5 block">Email</label>
                      <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@clinic.com" className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!form.clinicName || !form.address}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold rounded-xl shadow-soft hover:opacity-90 transition-opacity text-sm disabled:opacity-40"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Admin Account */}
            {step === 3 && (
              <motion.div key="account" {...fadeSlide}>
                <h2 className="font-display text-2xl text-sky-950 text-center mb-2">Admin Account</h2>
                <p className="text-sky-500 text-sm text-center mb-8">Create your admin login</p>

                <div className="bg-white rounded-2xl border border-sky-100/60 p-7 shadow-sm space-y-4">
                  <div>
                    <label className="text-sm font-medium text-sky-800 mb-1.5 block">Your Full Name *</label>
                    <input value={form.adminName} onChange={(e) => set("adminName", e.target.value)} placeholder="Dr. Ana Reyes" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sky-800 mb-1.5 block">Admin Email *</label>
                    <input type="email" value={form.adminEmail} onChange={(e) => set("adminEmail", e.target.value)} placeholder="admin@yourclinic.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-sky-800 mb-1.5 block">Password *</label>
                    <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Create a strong password" className={inputClass} />
                  </div>

                  <label className="flex items-start gap-3 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-sky-300 text-sky-600 accent-sky-600 shrink-0"
                    />
                    <span className="text-xs text-sky-700/80 leading-relaxed">
                      I agree to Smiley&apos;s{" "}
                      <Link href="/terms" target="_blank" className="text-sky-600 underline hover:text-sky-800">Terms of Service</Link>{" "}
                      and{" "}
                      <Link href="/privacy" target="_blank" className="text-sky-600 underline hover:text-sky-800">Privacy Policy</Link>.
                      I understand that patient records are protected under the Philippine Data Privacy Act (RA 10173).
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !form.adminName || !form.adminEmail || !form.password || !agreedToTerms}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold rounded-xl shadow-soft hover:opacity-90 transition-opacity text-sm disabled:opacity-40"
                  >
                    {loading ? (
                      <><Loader size={14} className="animate-spin" /> Creating…</>
                    ) : (
                      <>Create Clinic <ArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment (placeholder for PayMongo) */}
            {step === 4 && (
              <motion.div key="payment" {...fadeSlide} className="text-center">
                <h2 className="font-display text-2xl text-sky-950 mb-2">Payment</h2>
                <p className="text-sky-500 text-sm mb-8">Secure PayMongo checkout (card, GCash, Maya) will open here</p>
                <div className="bg-white rounded-2xl border border-sky-100/60 p-10 shadow-sm">
                  <Loader size={32} className="text-sky-400 animate-spin mx-auto mb-4" />
                  <p className="text-sky-600 text-sm">Redirecting to secure payment...</p>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <motion.div key="success" {...fadeSlide} className="text-center py-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20">
                  <Sparkles size={32} className="text-white" />
                </div>
                <h2 className="font-display text-3xl text-sky-950 mb-3">You&apos;re all set!</h2>
                <p className="text-sky-600/70 text-sm mb-3">Your clinic portal is ready at:</p>
                <div className="inline-block bg-sky-50 border border-sky-100 rounded-xl px-6 py-3 font-mono text-sky-700 text-sm mb-8">
                  {form.slug || "yourclinic"}.smiley.app
                </div>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-3.5 bg-gradient-to-r from-sky-700 to-sky-600 text-white font-semibold rounded-xl shadow-soft hover:opacity-90 transition-opacity"
                  >
                    Sign In to Dashboard
                  </button>
                  <Link href="/" className="text-sm text-sky-500 hover:text-sky-700">
                    Back to home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
