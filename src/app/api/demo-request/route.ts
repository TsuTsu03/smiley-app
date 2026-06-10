import { sendEmail, demoRequestNotificationHtml, demoRequestConfirmationHtml } from '@/lib/email';
import { enforceRateLimit } from '@/lib/rateLimit';
import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Where demo-request notifications are delivered. */
function notifyEmail(): string {
  return process.env.DEMO_NOTIFY_EMAIL || process.env.BREVO_SENDER_EMAIL || '';
}

export async function POST(request: NextRequest) {
  // Anti-spam: cap demo requests at 5 / 10 min per IP
  const limited = await enforceRateLimit(request, 'demo-request', { limit: 5, windowSec: 600 });
  if (limited) return limited;

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const clean = (v: unknown, max = 500) =>
    typeof v === 'string' ? v.trim().slice(0, max) : '';

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200);
  const clinicName = clean(payload.clinicName, 200);
  const dentists = clean(payload.dentists, 60);
  const phone = clean(payload.phone, 60);
  const message = clean(payload.message, 2000);
  // Honeypot — bots fill hidden fields; humans don't.
  const honeypot = clean(payload.company, 200);

  if (honeypot) return NextResponse.json({ ok: true }); // silently drop bots

  if (!name || !email || !clinicName) {
    return NextResponse.json({ error: 'Name, email, and clinic name are required.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const to = notifyEmail();
  if (!to) {
    return NextResponse.json(
      { error: 'Demo requests are not configured yet. Please email us directly.' },
      { status: 503 }
    );
  }

  // Notify the team (reply-to = prospect so we can respond directly).
  const notify = await sendEmail({
    to,
    subject: `New demo request — ${clinicName}`,
    html: demoRequestNotificationHtml({ name, email, clinicName, dentists, phone, message }),
    replyTo: email,
  });

  if (!notify.ok) {
    return NextResponse.json({ error: 'Could not send your request. Please try again.' }, { status: 502 });
  }

  // Confirmation to the prospect — best-effort, don't fail the request if it bounces.
  await sendEmail({
    to: email,
    subject: 'We received your Smiley demo request',
    html: demoRequestConfirmationHtml({ name }),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
