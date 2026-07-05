"use client";

import { SmileyIcon } from "@/components/Logo";

/**
 * On statically-prerendered public pages that wrap content in <Suspense> (e.g.
 * /register, gated on useSearchParams), THIS component's markup is what a
 * crawler sees if it doesn't wait for hydration, not the real page content.
 * `title`/`subtitle` let each caller give crawlers something page-relevant
 * instead of the generic brand splash.
 */
export default function LoadingScreen({
  title = "Smiley",
  subtitle = "Smart Clinic Management",
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-white">
      {/* Logo mark */}
      <div className="relative mb-6 w-16 h-16">
        <SmileyIcon size={64} className="relative z-10 drop-shadow-lg" />
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-2xl bg-sky-400 opacity-20 animate-ping" />
      </div>

      {/* Brand name */}
      <h1 className="text-2xl font-bold text-sky-900 tracking-tight mb-1">
        {title}
      </h1>
      <p className="text-sm text-sky-400 mb-8">{subtitle}</p>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
