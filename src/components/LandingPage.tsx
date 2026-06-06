"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader, UserCog, Stethoscope, SmilePlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import RegisterClinicModal from "./RegisterClinicModal";

const ROLES = [
  { key: "admin" as const, label: "Admin", icon: UserCog, color: "from-sky-600 to-sky-500" },
  { key: "dentist" as const, label: "Dentist", icon: Stethoscope, color: "from-sky-500 to-teal-500" },
  { key: "patient" as const, label: "Patient", icon: SmilePlus, color: "from-teal-500 to-teal-400" },
];

export default function LandingPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<"admin" | "dentist" | "patient">("admin");
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const isPatient = role === "patient";
  const notFound = isPatient && error.toLowerCase().includes("not found");
  const activeRole = ROLES.find((r) => r.key === role)!;

  const handleLogin = async () => {
    setError("");
    if (!field1 || !field2) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const result = await login(field1, field2, isPatient);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setField1("");
    setField2("");
    setError("");
    setShowPwd(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50/40 font-sans flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md page-enter">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 shadow-lg mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 4C10.5 4 7 8 7 12c0 2.5.8 4.5 2 6l2.5 8c.4 1.2 1.5 2 2.7 2h3.6c1.2 0 2.3-.8 2.7-2L21 18c1.2-1.5 2-3.5 2-6 0-4-3.5-8-7-8z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <circle cx="13" cy="12" r="1.5" fill="rgba(14,165,233,0.5)" />
                <circle cx="19" cy="12" r="1.5" fill="rgba(14,165,233,0.5)" />
              </svg>
            </div>
            <h1 className="font-display text-2xl text-sky-900 font-bold tracking-tight">
              Smiley
            </h1>
            <p className="text-sky-400 text-sm mt-0.5">Smart Clinic Management</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-hover border border-sky-100/60 overflow-hidden">
            {/* Role tabs */}
            <div className="flex border-b border-sky-100">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => {
                      setRole(r.key);
                      resetForm();
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${
                      active
                        ? "text-sky-700"
                        : "text-sky-400 hover:text-sky-600"
                    }`}
                  >
                    <Icon size={16} />
                    {r.label}
                    {active && (
                      <div className={`absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-gradient-to-r ${r.color}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <div className="p-7">
              <h2 className="text-lg font-display font-semibold text-sky-900 mb-1">
                {activeRole.label} Sign In
              </h2>
              <p className="text-sm text-sky-400 mb-6">
                {isPatient
                  ? "Enter the name and date of birth registered by your clinic."
                  : "Sign in with your clinic email and password."}
              </p>

              <div className="space-y-4">
                {isPatient ? (
                  <>
                    <div>
                      <label className="block text-sky-800 text-sm font-medium mb-1.5">
                        Full Name
                      </label>
                      <input
                        value={field1}
                        onChange={(e) => setField1(e.target.value)}
                        placeholder="Juan dela Cruz"
                        className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 placeholder-sky-300 focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-200 transition-all text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sky-800 text-sm font-medium mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={field2}
                        onChange={(e) => setField2(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-200 transition-all text-sm outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sky-800 text-sm font-medium mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={field1}
                        onChange={(e) => setField1(e.target.value)}
                        placeholder="you@clinic.com"
                        className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 placeholder-sky-300 focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-200 transition-all text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sky-800 text-sm font-medium mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPwd ? "text" : "password"}
                          value={field2}
                          onChange={(e) => setField2(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pr-11 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 placeholder-sky-300 focus:border-sky-400 focus:bg-white focus:ring-1 focus:ring-sky-200 transition-all text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600"
                        >
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div
                  className={`mt-4 text-sm rounded-xl px-4 py-3 border ${
                    notFound
                      ? "bg-amber-50 border-amber-100 text-amber-800"
                      : "bg-red-50 border-red-100 text-red-600"
                  }`}
                >
                  {notFound ? (
                    <>
                      <p className="font-medium mb-1">Not registered yet</p>
                      <p className="text-xs leading-relaxed">
                        Your name and date of birth weren&apos;t found in our
                        records. Please visit the clinic and ask the staff to
                        register you.
                      </p>
                    </>
                  ) : (
                    error
                  )}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`mt-6 w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${activeRole.color} hover:opacity-90 transition-opacity shadow-soft disabled:opacity-60 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>

          {/* Register link */}
          <div className="text-center mt-6">
            <p className="text-sm text-sky-500">
              New clinic?{" "}
              <button
                onClick={() => setShowRegister(true)}
                className="text-sky-700 font-semibold hover:text-sky-900 transition-colors underline underline-offset-2"
              >
                Register your clinic
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-sky-400 space-x-4">
            <span>&copy; {new Date().getFullYear()} Smiley</span>
            <Link
              href="/privacy"
              className="hover:text-sky-600 transition-colors underline underline-offset-2"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-sky-600 transition-colors underline underline-offset-2"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {showRegister && (
        <RegisterClinicModal
          onClose={() => setShowRegister(false)}
          onSuccess={() => {
            setShowRegister(false);
          }}
        />
      )}
    </div>
  );
}
