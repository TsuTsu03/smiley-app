"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import LoadingScreen from "@/components/LoadingScreen";
import { Logo } from "@/components/Logo";

/**
 * Shared split-screen scaffold for every login route (admin / dentist /
 * patient / chooser). Handles the "already signed in → go to dashboard"
 * redirect once, so the individual pages stay tiny.
 */
export default function LoginShell({ children }: { children: ReactNode }) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role) router.replace("/");
  }, [role, loading, router]);

  if (loading) return <LoadingScreen />;
  if (role) return null;

  return (
    <div data-theme="light" className="min-h-screen flex bg-bg">
      {/* Left — background image (hidden on mobile) */}
      <div className="hidden lg:block relative w-1/2">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80"
          alt="Modern dental clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-sky-800/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="max-w-md">
            <h2 className="font-display text-3xl text-white mb-3">Welcome back to Smiley</h2>
            <p className="text-sky-200/80 text-sm leading-relaxed">
              Manage your patients, appointments, and records with the platform trusted by dental clinics.
            </p>
          </div>
        </div>
      </div>

      {/* Right — content slot */}
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50/30">
        {/* Mobile header image */}
        <div className="lg:hidden relative h-48 -mb-8">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80"
            alt="Modern dental clinic"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 to-sky-50" />
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Logo href="/" size={44} textClassName="font-display text-xl font-bold text-sky-900" />
            </div>

            {children}

            {/* Register link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted">
                New clinic?{" "}
                <Link href="/register" className="text-primary font-semibold hover:text-primary-hover transition-colors underline underline-offset-2">
                  Register your clinic
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-xs text-subtle space-x-4">
              <Link href="/" className="hover:text-fg transition-colors underline underline-offset-2">Back to home</Link>
              <Link href="/privacy" className="hover:text-fg transition-colors underline underline-offset-2">Privacy</Link>
              <Link href="/terms" className="hover:text-fg transition-colors underline underline-offset-2">Terms</Link>
            </div>
            <p className="text-center mt-3 text-[11px] text-subtle">
              Smiley is a product of <span className="font-semibold text-muted">StackWise</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
