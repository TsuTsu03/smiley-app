import { describe, it, expect, beforeEach, vi } from 'vitest';

// Lightweight stub so we don't need the full Next runtime in unit tests.
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      status: init?.status ?? 200,
      body,
      headers: init?.headers,
    }),
  },
}));

import { rateLimit, clientIp, enforceRateLimit } from '../rateLimit';

const rid = () => 'k-' + Math.random().toString(36).slice(2);

beforeEach(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

describe('rateLimit (in-memory fallback)', () => {
  it('allows up to the limit then blocks', async () => {
    const key = rid();
    const opts = { limit: 3, windowSec: 60 };
    expect((await rateLimit(key, opts)).success).toBe(true);
    expect((await rateLimit(key, opts)).success).toBe(true);
    expect((await rateLimit(key, opts)).success).toBe(true);
    const fourth = await rateLimit(key, opts);
    expect(fourth.success).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it('reports remaining count', async () => {
    const r = await rateLimit(rid(), { limit: 5, windowSec: 60 });
    expect(r.remaining).toBe(4);
    expect(r.limit).toBe(5);
  });

  it('tracks keys independently', async () => {
    const a = rid();
    const b = rid();
    await rateLimit(a, { limit: 1, windowSec: 60 });
    expect((await rateLimit(a, { limit: 1, windowSec: 60 })).success).toBe(false);
    expect((await rateLimit(b, { limit: 1, windowSec: 60 })).success).toBe(true);
  });
});

describe('clientIp', () => {
  it('uses the first x-forwarded-for entry', () => {
    const req = new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } });
    expect(clientIp(req)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip, then "unknown"', () => {
    expect(clientIp(new Request('http://x', { headers: { 'x-real-ip': '9.9.9.9' } }))).toBe('9.9.9.9');
    expect(clientIp(new Request('http://x'))).toBe('unknown');
  });
});

describe('enforceRateLimit', () => {
  it('returns null while under the limit', async () => {
    const req = new Request('http://x', { headers: { 'x-forwarded-for': '10.0.0.1' } });
    const res = await enforceRateLimit(req, rid(), { limit: 2, windowSec: 60 });
    expect(res).toBeNull();
  });

  it('returns a 429 response once over the limit', async () => {
    const req = new Request('http://x', { headers: { 'x-forwarded-for': '10.1.1.1' } });
    const bucket = rid();
    await enforceRateLimit(req, bucket, { limit: 1, windowSec: 60 });
    const blocked = await enforceRateLimit(req, bucket, { limit: 1, windowSec: 60 });
    expect(blocked).not.toBeNull();
    expect((blocked as unknown as { status: number }).status).toBe(429);
  });
});
