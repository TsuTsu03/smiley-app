"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-sky-100/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Logo href="/" size={38} />

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
