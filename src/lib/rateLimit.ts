import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Distributed rate limiting for sensitive endpoints (auth, AI, signups).
 *
 * Uses Upstash Redis when configured (the correct choice for Vercel
 * serverless — HTTP-based, no connection pooling issues). Falls back to a
 * per-instance in-memory limiter when Upstash isn't set, so it still works
 * in local dev. ⚠️ The in-memory fallback is NOT shared across serverless
 * instances — configure Upstash for real protection in production.
 *
 * Env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */
function hasUpstash(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let redis: Redis | null = null;
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowSec: number): Ratelimit {
  const cacheKey = `${limit}:${windowSec}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    redis ||= Redis.fromEnv();
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: 'smiley_rl',
      analytics: false,
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

// ── In-memory fallback (per-instance) ─────────────────────────────────────────
const memoryHits = new Map<string, { count: number; reset: number }>();

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = memoryHits.get(key);
  if (!entry || now > entry.reset) {
    memoryHits.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  entry.count++;
  if (entry.count > limit) return { success: false, remaining: 0 };
  return { success: true, remaining: limit - entry.count };
}

// Occasionally evict expired in-memory entries to avoid unbounded growth.
function sweepMemory() {
  if (memoryHits.size < 5000) return;
  const now = Date.now();
  for (const [k, v] of memoryHits) if (now > v.reset) memoryHits.delete(k);
}

export interface RateLimitOptions {
  limit: number;
  windowSec: number;
}

export async function rateLimit(
  identifier: string,
  opts: RateLimitOptions
): Promise<{ success: boolean; remaining: number; limit: number }> {
  if (hasUpstash()) {
    try {
      const res = await getLimiter(opts.limit, opts.windowSec).limit(identifier);
      return { success: res.success, remaining: res.remaining, limit: opts.limit };
    } catch {
      // If Upstash hiccups, fail open to memory rather than blocking users.
      const m = memoryLimit(identifier, opts.limit, opts.windowSec * 1000);
      return { success: m.success, remaining: m.remaining, limit: opts.limit };
    }
  }
  sweepMemory();
  const m = memoryLimit(identifier, opts.limit, opts.windowSec * 1000);
  return { success: m.success, remaining: m.remaining, limit: opts.limit };
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * Enforce a rate limit for a request. Returns a 429 NextResponse when the
 * caller is over the limit, or `null` to continue. Keyed by bucket + client IP.
 */
export async function enforceRateLimit(
  req: Request,
  bucket: string,
  opts: RateLimitOptions
): Promise<NextResponse | null> {
  const id = `${bucket}:${clientIp(req)}`;
  const { success, remaining, limit } = await rateLimit(id, opts);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down and try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(opts.windowSec),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    );
  }
  return null;
}
