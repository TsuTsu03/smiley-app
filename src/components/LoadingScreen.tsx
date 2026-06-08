"use client";

import { SmileyIcon } from "@/components/Logo";

export default function LoadingScreen() {
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
        Smiley
      </h1>
      <p className="text-sm text-sky-400 mb-8">Smart Clinic Management</p>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
