'use client';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-white">
      {/* Logo mark */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 4C10.5 4 7 8 7 12c0 2.5.8 4.5 2 6l2.5 8c.4 1.2 1.5 2 2.7 2h3.6c1.2 0 2.3-.8 2.7-2L21 18c1.2-1.5 2-3.5 2-6 0-4-3.5-8-7-8z"
              fill="white"
              fillOpacity="0.9"
            />
            <circle cx="13" cy="12" r="1.5" fill="rgba(14,165,233,0.6)" />
            <circle cx="19" cy="12" r="1.5" fill="rgba(14,165,233,0.6)" />
          </svg>
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-2xl bg-sky-400 opacity-20 animate-ping" />
      </div>

      {/* Brand name */}
      <h1 className="text-2xl font-bold text-sky-900 tracking-tight mb-1">Smiley</h1>
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
