import { describe, it, expect } from 'vitest';
import {
  computeInvoiceTotals,
  paymentStatus,
  isSubscriptionActive,
  type LineItem,
} from '../billing';

describe('computeInvoiceTotals', () => {
  it('sums qty × price across line items', () => {
    const items: LineItem[] = [
      { desc: 'Cleaning', qty: 1, price: 1500 },
      { desc: 'Filling', qty: 2, price: 800 },
    ];
    expect(computeInvoiceTotals(items)).toEqual({ subtotal: 3100, total: 3100 });
  });

  it('applies a discount to the total but not the subtotal', () => {
    const items: LineItem[] = [{ qty: 1, price: 2000 }];
    expect(computeInvoiceTotals(items, 500)).toEqual({ subtotal: 2000, total: 1500 });
  });

  it('never returns a negative total', () => {
    const items: LineItem[] = [{ qty: 1, price: 100 }];
    expect(computeInvoiceTotals(items, 9999).total).toBe(0);
  });

  it('handles empty items and missing/garbage numbers safely', () => {
    expect(computeInvoiceTotals([])).toEqual({ subtotal: 0, total: 0 });
    // qty/price coerced; undefined → 0
    expect(computeInvoiceTotals([{ qty: undefined as any, price: 100 }]).subtotal).toBe(0);
  });
});

describe('paymentStatus', () => {
  it('is "paid" when amount covers the total', () => {
    expect(paymentStatus(1000, 1000)).toBe('paid');
    expect(paymentStatus(1000, 1200)).toBe('paid');
  });

  it('is "partial" when some but not all is paid', () => {
    expect(paymentStatus(1000, 400)).toBe('partial');
  });

  it('is "unpaid" when nothing is paid', () => {
    expect(paymentStatus(1000, 0)).toBe('unpaid');
  });
});

describe('isSubscriptionActive', () => {
  // Fixed "now" so the tests are deterministic.
  const NOW = new Date('2026-06-11T00:00:00Z').getTime();
  const future = new Date(NOW + 86_400_000).toISOString(); // +1 day
  const past = new Date(NOW - 86_400_000).toISOString(); // -1 day

  it('grants access during an unexpired trial', () => {
    expect(
      isSubscriptionActive({ subscriptionStatus: 'trialing', trialEndsAt: future }, NOW)
    ).toBe(true);
  });

  it('denies access once the trial has expired', () => {
    expect(
      isSubscriptionActive({ subscriptionStatus: 'trialing', trialEndsAt: past }, NOW)
    ).toBe(false);
  });

  it('treats the exact expiry instant as expired (not in the future)', () => {
    const exact = new Date(NOW).toISOString();
    expect(
      isSubscriptionActive({ subscriptionStatus: 'trialing', trialEndsAt: exact }, NOW)
    ).toBe(false);
  });

  it('grants access on an active paid plan whose period has not lapsed', () => {
    expect(
      isSubscriptionActive({ subscriptionStatus: 'active', currentPeriodEnd: future }, NOW)
    ).toBe(true);
  });

  it('denies access on an active plan whose paid period has lapsed', () => {
    expect(
      isSubscriptionActive({ subscriptionStatus: 'active', currentPeriodEnd: past }, NOW)
    ).toBe(false);
  });

  it('ignores a future trial date once the status is active (must check the paid period)', () => {
    // active but no current_period_end → no access, even if a trial date lingers
    expect(
      isSubscriptionActive(
        { subscriptionStatus: 'active', trialEndsAt: future, currentPeriodEnd: null },
        NOW
      )
    ).toBe(false);
  });

  it('denies access for past_due, canceled, and unknown statuses', () => {
    for (const status of ['past_due', 'canceled', 'unpaid', 'something-else']) {
      expect(
        isSubscriptionActive({ subscriptionStatus: status, currentPeriodEnd: future, trialEndsAt: future }, NOW)
      ).toBe(false);
    }
  });

  it('defaults a missing status to "trialing"', () => {
    expect(isSubscriptionActive({ trialEndsAt: future }, NOW)).toBe(true);
    expect(isSubscriptionActive({ trialEndsAt: past }, NOW)).toBe(false);
  });

  it('denies access when the relevant date is missing or invalid', () => {
    expect(isSubscriptionActive({ subscriptionStatus: 'trialing', trialEndsAt: null }, NOW)).toBe(false);
    expect(isSubscriptionActive({ subscriptionStatus: 'trialing' }, NOW)).toBe(false);
    expect(
      isSubscriptionActive({ subscriptionStatus: 'trialing', trialEndsAt: 'not-a-date' }, NOW)
    ).toBe(false);
  });

  it('falls back to the real clock when no "now" is supplied', () => {
    const wayFuture = new Date(Date.now() + 1_000_000_000).toISOString();
    expect(isSubscriptionActive({ subscriptionStatus: 'trialing', trialEndsAt: wayFuture })).toBe(true);
  });
});
