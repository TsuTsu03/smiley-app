import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import crypto from 'node:crypto';
import { planAmount, verifyWebhook, paymongoFetch } from '../paymongo';

describe('planAmount', () => {
  beforeEach(() => {
    delete process.env.PAYMONGO_PRICE_STARTER;
    delete process.env.PAYMONGO_PRICE_GROWTH;
    delete process.env.PAYMONGO_PRICE_MULTICLINIC;
  });

  it('returns default centavo amounts for known plans', () => {
    expect(planAmount('starter')).toEqual({ amount: 200000, name: 'Smiley Starter' });
    expect(planAmount('growth')?.amount).toBe(350000);
    expect(planAmount('multi-clinic')?.amount).toBe(300000); // per branch
  });

  it('maps legacy aliases to the new plans', () => {
    expect(planAmount('basic')?.name).toBe('Smiley Starter');
    expect(planAmount('pro')?.name).toBe('Smiley Growth');
    expect(planAmount('enterprise')?.name).toBe('Smiley Multi-Clinic (per branch)');
  });

  it('is case-insensitive', () => {
    expect(planAmount('STARTER')?.amount).toBe(200000);
    expect(planAmount('Growth')?.amount).toBe(350000);
  });

  it('returns null for an unknown plan', () => {
    expect(planAmount('platinum')).toBeNull();
    expect(planAmount('')).toBeNull();
  });

  it('honors env price overrides', () => {
    process.env.PAYMONGO_PRICE_STARTER = '199900';
    expect(planAmount('starter')?.amount).toBe(199900);
  });
});

describe('verifyWebhook', () => {
  const secret = 'whsk_test_secret';
  const sign = (t: string, body: string) =>
    crypto.createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');

  beforeEach(() => { process.env.PAYMONGO_WEBHOOK_SECRET = secret; });
  afterEach(() => { delete process.env.PAYMONGO_WEBHOOK_SECRET; });

  it('accepts a valid live (li) signature', () => {
    const body = JSON.stringify({ hello: 'world' });
    const t = '1700000000';
    expect(verifyWebhook(body, `t=${t},li=${sign(t, body)}`)).toBe(true);
  });

  it('accepts a valid test (te) signature', () => {
    const body = '{"a":1}';
    const t = '123';
    expect(verifyWebhook(body, `t=${t},te=${sign(t, body)}`)).toBe(true);
  });

  it('rejects a tampered body', () => {
    const t = '123';
    const header = `t=${t},li=${sign(t, '{"a":1}')}`;
    expect(verifyWebhook('{"a":2}', header)).toBe(false);
  });

  it('rejects a missing signature header', () => {
    expect(verifyWebhook('{}', null)).toBe(false);
  });

  it('rejects a malformed header (no timestamp)', () => {
    expect(verifyWebhook('{}', 'li=abc')).toBe(false);
  });

  it('rejects when the webhook secret is not configured', () => {
    delete process.env.PAYMONGO_WEBHOOK_SECRET;
    expect(verifyWebhook('{}', 't=1,li=abc')).toBe(false);
  });
});

describe('paymongoFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.PAYMONGO_SECRET_KEY;
  });

  it('throws when the secret key is not set', async () => {
    delete process.env.PAYMONGO_SECRET_KEY;
    await expect(paymongoFetch('/checkout_sessions', 'POST', {})).rejects.toThrow(/PAYMONGO_SECRET_KEY/);
  });

  it('sends HTTP Basic auth and returns parsed JSON on success', async () => {
    process.env.PAYMONGO_SECRET_KEY = 'sk_test_abc';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { id: 'cs_1' } }) });
    vi.stubGlobal('fetch', fetchMock);

    const res = await paymongoFetch('/checkout_sessions', 'POST', { a: 1 });
    expect(res.data.id).toBe('cs_1');

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.paymongo.com/v1/checkout_sessions');
    expect(opts.headers.Authorization).toBe('Basic ' + Buffer.from('sk_test_abc:').toString('base64'));
  });

  it('throws the PayMongo error detail on a failure response', async () => {
    process.env.PAYMONGO_SECRET_KEY = 'sk_test_abc';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ errors: [{ detail: 'Invalid plan' }] }),
    }));
    await expect(paymongoFetch('/x', 'GET')).rejects.toThrow('Invalid plan');
  });
});
