'use client';

import { useState } from 'react';
import { SmileyIcon } from '@/components/Logo';
import { useAuth } from '@/lib/auth';

/**
 * Hard paywall. Smiley has no free trial — a clinic must have an ACTIVE paid
 * subscription to use the app. Until then every role in the clinic lands here
 * instead of a dashboard:
 *   - admin  → pick a plan and pay (PayMongo checkout)
 *   - dentist/patient → told the clinic isn't active yet (only the admin pays)
 */

const SUPPORT_EMAIL = 'floresjansen28@gmail.com';

const PLANS = [
  { key: 'starter', name: 'Starter', price: '₱2,000', note: 'Solo dentists & small clinics' },
  { key: 'growth', name: 'Growth', price: '₱3,500', note: 'Growing multi-dentist clinics' },
  { key: 'multi-clinic', name: 'Multi-Clinic', price: '₱3,000', note: 'Per branch / location' },
];

export default function Paywall() {
  const { clinicName, role, logout } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState('');
  const isAdmin = role === 'admin';

  async function subscribe(plan: string) {
    setLoadingPlan(plan);
    setError('');
    try {
      const res = await fetch('/api/paymongo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(json.error ?? 'Could not start checkout. Please try again.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-white px-6 py-10 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl ring-1 ring-sky-100 text-center">
        <div className="mx-auto mb-6 w-16 h-16">
          <SmileyIcon size={64} className="drop-shadow-lg" />
        </div>

        <h1 className="text-2xl font-bold text-sky-900 tracking-tight mb-2">
          Activate {clinicName || 'your clinic'}
        </h1>

        {isAdmin ? (
          <>
            <p className="text-sm text-slate-500 mb-6">
              Choose a plan to activate your clinic. You&apos;ll be billed monthly and
              can cancel anytime. There&apos;s no free trial.
            </p>

            <div className="space-y-3 text-left">
              {PLANS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => subscribe(p.key)}
                  disabled={!!loadingPlan}
                  className="w-full flex items-center justify-between gap-3 rounded-xl border border-sky-100 bg-white px-5 py-4 hover:border-sky-400 hover:shadow-md transition disabled:opacity-50"
                >
                  <span>
                    <span className="block font-semibold text-sky-900">{p.name}</span>
                    <span className="block text-xs text-slate-400">{p.note}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-bold text-sky-700">{p.price}</span>
                    <span className="block text-xs text-slate-400">
                      {loadingPlan === p.key ? 'Redirecting…' : '/mo'}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {error && <p className="mt-4 text-sm text-danger">{error}</p>}

            <p className="mt-5 text-xs text-slate-400">
              Secure payment via PayMongo (card, GCash, Maya, GrabPay). Questions?{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-sky-600 hover:underline">
                Contact us
              </a>
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">{clinicName || 'This clinic'}</span>{' '}
            isn&apos;t active yet. Please ask your clinic administrator to complete
            the subscription, then sign in again.
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
