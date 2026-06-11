"use client";

import { SmileyIcon } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

// Where extension requests are sent while PayMongo billing isn't live yet.
const SUPPORT_EMAIL = "floresjansen28@gmail.com";

export default function SubscriptionExpired() {
  const { clinicName, user, role, logout } = useAuth();
  const isStaff = role === "admin" || role === "dentist";

  const subject = `Subscription extension request — ${clinicName || "Clinic"}`;
  const body = [
    `Hi,`,
    ``,
    `Our trial/subscription has expired and we'd like to continue using Smiley.`,
    ``,
    `Clinic: ${clinicName || "(unknown)"}`,
    `Account: ${user?.fullName ?? ""} (${user?.email ?? ""})`,
    `Clinic ID: ${user?.clinicId ?? ""}`,
    ``,
    `Please let us know the payment details so we can extend our access.`,
    ``,
    `Thank you!`,
  ].join("\n");

  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-white px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-sky-100 text-center">
        <div className="mx-auto mb-6 w-16 h-16">
          <SmileyIcon size={64} className="drop-shadow-lg" />
        </div>

        <h1 className="text-2xl font-bold text-sky-900 tracking-tight mb-2">
          Your access has expired
        </h1>

        {isStaff ? (
          <>
            <p className="text-sm text-slate-500 mb-6">
              The free trial for{" "}
              <span className="font-semibold text-slate-700">
                {clinicName || "your clinic"}
              </span>{" "}
              has ended. To continue using Smiley, request an extension and
              we&apos;ll restore your access.
            </p>

            <a
              href={mailto}
              className="block w-full rounded-xl bg-sky-500 px-6 py-3 text-center font-semibold text-white shadow-md transition hover:bg-sky-600"
            >
              Email us to continue
            </a>

            <p className="mt-4 text-xs text-slate-400">
              Or email us directly at{" "}
              <span className="font-medium text-slate-500">{SUPPORT_EMAIL}</span>
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500 mb-2">
            The subscription for{" "}
            <span className="font-semibold text-slate-700">
              {clinicName || "your clinic"}
            </span>{" "}
            has ended, so the portal is temporarily unavailable. Please contact
            your clinic to have access restored.
          </p>
        )}

        <button
          onClick={() => logout()}
          className="mt-6 text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
