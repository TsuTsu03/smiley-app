import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, reminderEmailHtml } from '@/lib/email';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Sends reminder emails for appointments happening tomorrow that haven't been
 * reminded yet. Trigger via Vercel Cron (see vercel.json) or any scheduler.
 * Protected by CRON_SECRET — request must send `Authorization: Bearer <secret>`.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization');
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();

  // Target date = tomorrow (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = tomorrow.toISOString().slice(0, 10);

  const { data: appts, error } = await admin
    .from('appointments')
    .select('id, date, time, type, clinic_id, patient_id, reminder_sent_at, patients(full_name, email), clinics(name)')
    .eq('date', target)
    .is('reminder_sent_at', null)
    .neq('status', 'cancelled');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  let failed = 0;

  for (const a of (appts ?? []) as any[]) {
    const email = a.patients?.email;
    const patientName = a.patients?.full_name ?? 'there';
    const clinicName = a.clinics?.name ?? 'Your dental clinic';
    if (!email) continue;

    const result = await sendEmail({
      to: email,
      subject: `Reminder: ${a.type} on ${a.date} at ${a.time}`,
      html: reminderEmailHtml({ patientName, clinicName, date: a.date, time: a.time, type: a.type }),
    });

    if (result.ok) {
      sent++;
      await admin.from('appointments').update({ reminder_sent_at: new Date().toISOString() }).eq('id', a.id);
      await admin.from('notifications').insert({
        type: 'email',
        channel: 'email',
        patient_id: a.patient_id,
        clinic_id: a.clinic_id,
        appointment_id: a.id,
        message: `Reminder sent to ${patientName} for ${a.type} on ${a.date} ${a.time}`,
        status: 'sent',
      });
    } else {
      failed++;
    }
  }

  return NextResponse.json({ target, total: appts?.length ?? 0, sent, failed });
}
