/**
 * Minimal email sender built on Resend's REST API (no SDK dependency).
 * Set RESEND_API_KEY and RESEND_FROM (e.g. "Smiley <reminders@yourdomain.com>").
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) return { ok: false, error: 'Email not configured (RESEND_API_KEY/RESEND_FROM)' };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${text}` };
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
