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
