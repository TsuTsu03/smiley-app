import Link from "next/link";
import { Logo } from "./Logo";

export default function MarketingFooter() {
  return (
    <footer className="bg-sky-950 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={36} textClassName="font-display text-lg font-bold text-white" />
              <span className="text-[11px] text-sky-300/60 font-medium border-l border-sky-700/60 pl-2.5">
                by StackWise
              </span>
            </div>
            <p className="text-sky-300/70 text-sm leading-relaxed max-w-sm">
              The modern clinic management platform built for dental professionals.
              Manage patients, appointments, and records all in one place.
            </p>
            <p className="text-sky-400/60 text-xs mt-3">
              Smiley is a product of <span className="font-semibold text-sky-300/80">StackWise</span>.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-sky-200">Product</h4>
            <ul className="space-y-2.5 text-sm text-sky-300/70">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register Clinic</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-sky-200">Legal</h4>
            <ul className="space-y-2.5 text-sm text-sky-300/70">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-800/50 pt-6 text-center text-xs text-sky-400/50">
          &copy; {new Date().getFullYear()}{" "}StackWise. All rights reserved. Smiley&trade; is a product of StackWise.
        </div>
      </div>
    </footer>
  );
}
