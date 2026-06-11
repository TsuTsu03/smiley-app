/**
 * Pure billing math — extracted from the invoice API routes so it can be
 * unit-tested in isolation.
 */
export interface LineItem {
  desc?: string;
  qty: number;
  price: number;
}

export function computeInvoiceTotals(items: LineItem[], discount = 0): { subtotal: number; total: number } {
  const subtotal = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
  const total = Math.max(0, subtotal - Number(discount || 0));
  return { subtotal, total };
}

/** Payment status after a given amount paid against a total. */
export function paymentStatus(total: number, amountPaid: number): 'paid' | 'partial' | 'unpaid' {
  if (Number(amountPaid) >= Number(total) && Number(total) > 0) return 'paid';
  if (Number(amountPaid) > 0) return 'partial';
  return 'unpaid';
}

/** Billing-relevant fields of a clinic, as stored on the `clinics` row. */
export interface ClinicBilling {
  subscriptionStatus?: string | null;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
}

/**
 * Whether a clinic currently has access to the app. Access is granted when the
 * clinic is either:
 *   - on a paid plan that hasn't lapsed (`active` and current_period_end in the future), or
 *   - still inside its free trial (`trialing` and trial_ends_at in the future).
 * Every other state — expired trial, lapsed paid period, past_due, canceled,
 * or missing/invalid dates — means no access.
 */
export function isSubscriptionActive(
  billing: ClinicBilling,
  now: number = Date.now()
): boolean {
  const status = billing.subscriptionStatus ?? 'trialing';

  const future = (iso?: string | null): boolean => {
    if (iso == null) return false;
    const t = new Date(iso).getTime();
    return Number.isFinite(t) && t > now;
  };

  const paidActive = status === 'active' && future(billing.currentPeriodEnd);
  const trialActive = status === 'trialing' && future(billing.trialEndsAt);
  return paidActive || trialActive;
}
