"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-sky-100/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-md">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4C10.5 4 7 8 7 12c0 2.5.8 4.5 2 6l2.5 8c.4 1.2 1.5 2 2.7 2h3.6c1.2 0 2.3-.8 2.7-2L21 18c1.2-1.5 2-3.5 2-6 0-4-3.5-8-7-8z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <span className="font-display text-lg font-bold text-sky-900">Smiley</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm text-sky-700/70 hover:text-sky-900 transition-colors font-medium">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-sky-700/70 hover:text-sky-900 transition-colors font-medium">
            Pricing
          </Link>
          <Link href="/login" className="text-sm text-sky-700 hover:text-sky-900 transition-colors font-semibold">
            Sign In
          </Link>
          <Link
            href="/pricing"
            className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white text-sm font-semibold rounded-xl hover:from-sky-700 hover:to-sky-600 transition-all shadow-soft"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-sky-700">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-sky-100 px-5 pb-5 pt-3 space-y-3">
          <Link href="/#features" onClick={() => setOpen(false)} className="block text-sm text-sky-700 font-medium py-2">
            Features
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block text-sm text-sky-700 font-medium py-2">
            Pricing
          </Link>
          <Link href="/login" onClick={() => setOpen(false)} className="block text-sm text-sky-700 font-semibold py-2">
            Sign In
          </Link>
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="block text-center px-5 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white text-sm font-semibold rounded-xl"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
