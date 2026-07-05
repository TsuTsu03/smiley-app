/**
 * Single source of truth for subscription plan pricing.
 *
 * Before this file existed, the Starter price was hardcoded in four places
 * (the pricing page, the register page, the landing page preview, and the
 * PayMongo checkout amount) and drifted out of sync when only one was
 * updated. Every consumer now reads from PLAN_PRICING instead.
 */
export type PlanKey = 'starter' | 'growth' | 'multi-clinic';

export interface PlanPricing {
  key: PlanKey;
  name: string;
  /** Monthly price in PHP (not centavos). */
  monthly: number;
  /** Annual price in PHP (not centavos); bills once a year. */
  annual: number;
  /** Billing unit suffix shown after the price, e.g. "/branch". Defaults to "/mo". */
  unit?: string;
  /** Extra note shown under the price, e.g. "billed per branch / location". */
  priceNote?: string;
}

export const PLAN_PRICING: Record<PlanKey, PlanPricing> = {
  starter: {
    key: 'starter',
    name: 'Starter',
    monthly: 2000,
    annual: 20000,
  },
  growth: {
    key: 'growth',
    name: 'Growth',
    monthly: 3500,
    annual: 35000,
  },
  'multi-clinic': {
    key: 'multi-clinic',
    name: 'Multi-Clinic',
    monthly: 3000,
    annual: 30000,
    unit: '/branch',
    priceNote: 'billed per branch / location',
  },
};

export const PLAN_CURRENCY = 'PHP';

/** Lowest published plan price, used for AggregateOffer / "from ₱X" copy. */
export const PRICE_LOW = Math.min(...Object.values(PLAN_PRICING).map((p) => p.monthly));
