/**
 * Email sender built on Brevo's transactional API (no SDK dependency).
 * Brevo's free tier (300 emails/day) lets you send by validating a single
 * sender email — no custom domain required to get started.
 *
 * Env:
 *   - BREVO_API_KEY      — from Brevo → SMTP & API → API Keys
 *   - BREVO_SENDER_EMAIL — a validated sender address (confirm via Brevo email)
 *   - BREVO_SENDER_NAME  — optional default display name (e.g. "Smiley")
 *
 * To make a message appear to come from a clinic, pass:
 *   - fromName: the clinic's name  → becomes the sender display name
 *   - replyTo:  the clinic's email → patient replies go straight to the clinic
 * The actual sending address stays your validated BREVO_SENDER_EMAIL.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  fromName?: string; // display name override, e.g. the clinic's name
  replyTo?: string;  // e.g. the clinic's registered email
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!key || !senderEmail) {
    return { ok: false, error: 'Email not configured (BREVO_API_KEY/BREVO_SENDER_EMAIL)' };
  }

  const senderName =
    opts.fromName?.replace(/["<>\r\n]/g, '').trim() ||
    process.env.BREVO_SENDER_NAME ||
    'Smiley';

  const body: Record<string, unknown> = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: opts.to }],
    subject: opts.subject,
    htmlContent: opts.html,
  };
  if (opts.replyTo) body.replyTo = { email: opts.replyTo };

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': key,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Brevo ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Branded appointment-reminder email. */
export function reminderEmailHtml(args: {
  patientName: string;
  clinicName: string;
  date: string;
  time: string;
  type: string;
}): string {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;color:#0c4a6e">
    <div style="background:linear-gradient(135deg,#0284c7,#14b8a6);padding:24px;border-radius:16px 16px 0 0">
      <h1 style="color:#fff;margin:0;font-size:20px">${args.clinicName}</h1>
      <p style="color:#e0f2fe;margin:4px 0 0;font-size:13px">Appointment reminder</p>
    </div>
    <div style="border:1px solid #e0f2fe;border-top:none;border-radius:0 0 16px 16px;padding:24px">
      <p style="font-size:15px">Hi ${args.patientName},</p>
      <p style="font-size:15px;line-height:1.5">This is a friendly reminder of your upcoming appointment:</p>
      <div style="background:#f0f9ff;border:1px solid #e0f2fe;border-radius:12px;padding:16px;margin:16px 0">
        <div style="font-size:14px"><strong>${args.type}</strong></div>
        <div style="font-size:14px;color:#0369a1;margin-top:4px">${args.date} at ${args.time}</div>
      </div>
      <p style="font-size:13px;color:#64748b">Need to reschedule? Just reply to this email or contact the clinic. See you soon! 🦷</p>
    </div>
  </div>`;
}
