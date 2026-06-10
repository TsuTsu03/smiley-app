"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, CalendarCheck, ArrowRight } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Where the "Book a demo" button should go. Defaults to the demo section. */
  demoHref?: string;
};

/**
 * Lightweight "feature not ready yet" dialog shown when a visitor clicks a
 * subscription plan CTA. We're not charging online yet (cash / annual billing
 * is handled manually for now), so we nudge people to book a demo and explore
 * the app instead.
 */
export default function ComingSoonModal({ open, onClose, demoHref = "/#demo" }: Props) {
  // lock scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-950/50 backdrop-blur-sm px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-sky-400 hover:text-sky-700 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-teal-400 text-white">
              <Sparkles size={26} />
            </div>

            <h3 id="coming-soon-title" className="font-display text-2xl text-sky-950 mb-3">
              We&apos;re still working on this!
            </h3>
            <p className="text-sky-700/70 text-sm leading-relaxed mb-7">
              Online sign-up and self-service billing aren&apos;t live just yet. In the
              meantime, book a free demo and we&apos;ll walk you through the app and help
              you get set up.
            </p>

            <div className="flex flex-col gap-2.5">
              <Link
                href={demoHref}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-soft hover:opacity-90 transition-all"
              >
                <CalendarCheck size={16} /> Book a demo <ArrowRight size={14} />
              </Link>
              <button
                onClick={onClose}
                className="py-3 rounded-xl font-semibold text-sm text-sky-600 hover:bg-sky-50 transition-all"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
