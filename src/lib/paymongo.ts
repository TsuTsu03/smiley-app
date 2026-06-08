import crypto from 'crypto';

/**
 * Thin PayMongo REST helper (no SDK). Uses HTTP Basic auth with the secret key.
 * Docs: https://developers.paymongo.com
 * Set PAYMONGO_SECRET_KEY (sk_test_... / sk_live_...).
 */
const BASE = 'https://api.paymongo.com/v1';

function authHeader(): string {
  const key = process.env.PAYMONGO_SECRET_KEY;
  if (!key) throw new Error('PAYMONGO_SECRET_KEY is not set');
  return 'Basic ' + Buffer.from(`${key}:`).toString('base64');
}

export async function paymongoFetch(
  path: string,
  method: 'GET' | 'POST',
  body?: unknown
): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.errors?.[0]?.detail ?? `PayMongo ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

/**
 * Plan → monthly amount in CENTAVOS (₱1,499 = 149900). Configurable via env.
 * PayMongo settles in PHP only.
 */
export function planAmount(plan: string): { amount: number; name: string } | null {
  const map: Record<string, { amount: number; name: string }> = {
    starter: { amount: Number(process.env.PAYMONGO_PRICE_STARTER ?? 150000), name: 'Smiley Starter' },
    basic: { amount: Number(process.env.PAYMONGO_PRICE_STARTER ?? 150000), name: 'Smiley Starter' },
    growth: { amount: Number(process.env.PAYMONGO_PRICE_GROWTH ?? 300000), name: 'Smiley Growth' },
    pro: { amount: Number(process.env.PAYMONGO_PRICE_GROWTH ?? 300000), name: 'Smiley Growth' },
    'multi-clinic': { amount: Number(process.env.PAYMONGO_PRICE_MULTICLINIC ?? 600000), name: 'Smiley Multi-Clinic' },
    enterprise: { amount: Number(process.env.PAYMONGO_PRICE_MULTICLINIC ?? 600000), name: 'Smiley Multi-Clinic' },
  };
  return map[plan.toLowerCase()] ?? null;
}

/**
 * Verify a PayMongo webhook signature.
 * Header format: `t=<timestamp>,te=<test_sig>,li=<live_sig>`.
 * Signed payload = `${t}.${rawBody}`, HMAC-SHA256 with the webhook secret.
 */
export function verifyWebhook(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((kv) => {
      const i = kv.indexOf('=');
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
    })
  ) as { t?: string; te?: string; li?: string };

  if (!parts.t) return false;
  const provided = parts.li || parts.te; // live first, then test
  if (!provided) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${parts.t}.${rawBody}`)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  } catch {
    return false;
  }
}
