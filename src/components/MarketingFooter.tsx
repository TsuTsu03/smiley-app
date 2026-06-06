import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="bg-sky-950 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 4C10.5 4 7 8 7 12c0 2.5.8 4.5 2 6l2.5 8c.4 1.2 1.5 2 2.7 2h3.6c1.2 0 2.3-.8 2.7-2L21 18c1.2-1.5 2-3.5 2-6 0-4-3.5-8-7-8z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
              <span className="font-display text-lg font-bold">Smiley</span>
            </div>
            <p className="text-sky-300/70 text-sm leading-relaxed max-w-sm">
              The modern clinic management platform built for dental professionals.
              Manage patients, appointments, and records all in one place.
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
          &copy; {new Date().getFullYear()} Smiley / DentaFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
