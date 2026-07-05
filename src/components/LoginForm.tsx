"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader, UserCog, Stethoscope, SmilePlus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/data";

const ROLE_CONFIG = {
  admin: { label: "Admin", icon: UserCog, color: "from-sky-600 to-sky-500", route: "/login/admin" },
  dentist: { label: "Dentist", icon: Stethoscope, color: "from-sky-500 to-teal-500", route: "/login/dentist" },
  patient: { label: "Patient", icon: SmilePlus, color: "from-teal-500 to-teal-400", route: "/login/patient" },
} as const;

/**
 * Single-role login card. Each route (/login/admin, /login/dentist,
 * /login/patient) renders this with a fixed `role`. Admin & dentist use the
 * same email+password flow (the real role comes from the DB); patient uses
 * name + date of birth.
 */
export default function LoginForm({ role }: { role: Role }) {
  const { login } = useAuth();
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cfg = ROLE_CONFIG[role];
  const Icon = cfg.icon;
  const isPatient = role === "patient";
  const notFound = isPatient && error.toLowerCase().includes("not found");
  const otherRoles = (Object.keys(ROLE_CONFIG) as Role[]).filter((r) => r !== role);

  // Shared field treatment — readable placeholder + accessible focus ring
  const fieldCls =
    "w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/40 text-sky-950 placeholder-slate-400 " +
    "focus:border-sky-400 focus:bg-white focus:shadow-ring outline-none text-sm " +
    "transition-[border-color,box-shadow,background-color] duration-200 ease-out-expo";

  const handleLogin = async () => {
    setError("");
    if (!field1 || !field2) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const result = await login(field1, field2, isPatient);
    if (result.otpRequired) {
      // A one-time code was emailed — switch to the code-entry step.
      setMaskedEmail(result.email ?? "");
      setStep("otp");
      setOtp("");
      setLoading(false);
      return;
    }
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    const result = await login(field1, field2, true, otp.trim());
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, AuthProvider sets the user and the app redirects.
  };

  const resetToCredentials = () => {
    setStep("credentials");
    setOtp("");
    setError("");
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden w-full max-w-md">
      <div className="p-7">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center shadow-md`}>
            <Icon size={18} className="text-white" />
          </div>
          <h2 className="text-lg font-display font-semibold text-sky-900">{cfg.label} Sign In</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          {isPatient && step === "otp"
            ? `We emailed a 6-digit code${maskedEmail ? ` to ${maskedEmail}` : ""}. Enter it below to finish signing in.`
            : isPatient
            ? "Enter the name and date of birth registered by your clinic."
            : "Sign in with your clinic email and password."}
        </p>

        <div className="space-y-4">
          {isPatient && step === "otp" ? (
            <div>
              <label className="block text-sky-800 text-sm font-medium mb-1.5">Sign-in code</label>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                placeholder="123456"
                autoFocus
                className={`${fieldCls} text-center !text-lg tracking-[0.4em]`}
              />
              <button
                type="button"
                onClick={resetToCredentials}
                className="mt-2 text-xs text-sky-500 hover:text-sky-700 underline underline-offset-2"
              >
                Use a different name or date of birth
              </button>
            </div>
          ) : isPatient ? (
            <>
              <div>
                <label className="block text-sky-800 text-sm font-medium mb-1.5">Full Name</label>
                <input
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="Juan dela Cruz"
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="block text-sky-800 text-sm font-medium mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={`${fieldCls} cursor-pointer`}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sky-800 text-sm font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="you@clinic.com"
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="block text-sky-800 text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    className={`${fieldCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="press absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-sky-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
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
              notFound ? "bg-amber-50 border-amber-100 text-amber-800" : "bg-red-50 border-red-100 text-red-600"
            }`}
          >
            {notFound ? (
              <>
                <p className="font-medium mb-1">Not registered yet</p>
                <p className="text-xs leading-relaxed">
                  Your name and date of birth weren&apos;t found in our records. Please visit
                  the clinic and ask the staff to register you.
                </p>
              </>
            ) : (
              error
            )}
          </div>
        )}

        <button
          onClick={isPatient && step === "otp" ? handleVerifyOtp : handleLogin}
          disabled={loading}
          className={`press mt-6 w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${cfg.color} shadow-soft hover:shadow-[0_8px_24px_-6px_rgba(2,132,199,0.5)] hover:brightness-[1.03] transition-[box-shadow,filter] duration-200 ease-out-expo disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2`}
        >
          {loading ? (
            <><Loader size={16} className="animate-spin" /> {isPatient && step === "otp" ? "Verifying…" : "Signing in…"}</>
          ) : isPatient && step === "otp" ? (
            "Verify & sign in"
          ) : isPatient ? (
            "Email me a code"
          ) : (
            "Sign In"
          )}
        </button>

        {/* Switch role */}
        <div className="mt-5 pt-4 border-t border-sky-100/70 text-center text-xs text-slate-500">
          Not {role === "admin" ? "an admin" : `a ${cfg.label.toLowerCase()}`}?{" "}
          {otherRoles.map((r, i) => (
            <span key={r}>
              {i > 0 && <span className="mx-1">·</span>}
              <Link href={ROLE_CONFIG[r].route} className="text-sky-600 font-medium hover:text-sky-800 underline underline-offset-2">
                Sign in as {ROLE_CONFIG[r].label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
