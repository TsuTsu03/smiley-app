import { describe, it, expect } from 'vitest';
import { computeInvoiceTotals, paymentStatus, type LineItem } from '../billing';

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
