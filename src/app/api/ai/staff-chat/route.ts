import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { askAI, aiConfigured } from '@/lib/ai';
import { enforceRateLimit } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';

/**
 * Staff-facing AI assistant for admins and dentists. Unlike the patient
 * assistant, it is grounded in the whole clinic's data — patient roster,
 * upcoming appointments, and recent clinical records — so staff can ask things
 * like "who is due for an adjustment this week?" or "does Jane Cruz have any
 * allergies?".
 *
 * Guardrails:
 *  - Staff only (admin/dentist); patients are rejected.
 *  - Read-only: it never writes patient data, and every query is written to the
 *    audit log so record access through the assistant is traceable.
 *  - Bounded: only a capped slice of clinic data is sent to the model to keep
 *    latency, cost, and PHI exposure in check.
 *
 * NOTE ON PHI: this forwards patient data to a third-party LLM (Groq). Before
 * using real patient records in production, confirm the provider terms allow
 * processing health data (a DPA / no-training guarantee). Point GROQ_API_KEY at
 * an approved endpoint, or disable by leaving it unset (the client then falls
 * back to a non-AI message).
 */

const PATIENT_CAP = 200;
const APPT_CAP = 100;
const RECORD_CAP = 60;

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, 'ai-staff-chat', { limit: 20, windowSec: 60 });
  if (limited) return limited;

  // PHI safety gate. This route forwards patient data to a third-party LLM, so
  // it stays OFF until an operator explicitly acknowledges the compliance
  // review by setting AI_PHI_ACK=true (alongside a configured key). Without it
  // the client shows the same "not configured" fallback and no PHI leaves the
  // server.
  if (!aiConfigured() || process.env.AI_PHI_ACK !== 'true') {
    return NextResponse.json({ configured: false });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, clinic_id')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'dentist') {
    return NextResponse.json({ error: 'Staff only' }, { status: 403 });
  }

  const { message, history } = await request.json();
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Clinic context (RLS scopes every query to the caller's clinic).
  const [{ data: clinic }, { data: dentists }, { data: patients }, { data: appointments }, { data: records }] =
    await Promise.all([
      supabase.from('clinics').select('name, address, phone, email').eq('id', profile.clinic_id).single(),
      supabase.from('dentists').select('full_name, specialization').eq('clinic_id', profile.clinic_id),
      supabase
        .from('patients')
        .select('full_name, date_of_birth, gender, phone, email, blood_type, allergies, next_adjustment_date')
        .eq('clinic_id', profile.clinic_id)
        .order('full_name')
        .limit(PATIENT_CAP),
      supabase
        .from('appointments')
        .select('date, time, type, status, patients(full_name), dentists(full_name)')
        .eq('clinic_id', profile.clinic_id)
        .gte('date', today)
        .neq('status', 'cancelled')
        .order('date')
        .limit(APPT_CAP),
      supabase
        .from('medical_records')
        .select('date, procedure, diagnosis, tooth, patients(full_name), dentists(full_name)')
        .eq('clinic_id', profile.clinic_id)
        .order('date', { ascending: false })
        .limit(RECORD_CAP),
    ]);

  const context = {
    clinic,
    today,
    dentists,
    patients,
    upcomingAppointments: appointments,
    recentRecords: records,
  };

  const system = `You are "Smiley", an assistant for dental-clinic STAFF (${profile.role}: ${profile.full_name}).
Answer ONLY from the clinic data provided as JSON below. It is already scoped to
this staff member's own clinic. If the data doesn't contain the answer, say so
plainly — never guess names, dates, diagnoses, or contact details.
You are read-only: you cannot book, edit, or delete anything; if asked to, explain
the staff member must do it from the relevant dashboard tab.
Be concise and professional. Use markdown **bold** for names, dates, and totals,
and bullet lists for multiple results. Today is ${today}.

CLINIC DATA (JSON):
${JSON.stringify(context, null, 2)}`;

  const msgs = [
    ...(Array.isArray(history) ? history.slice(-6) : []),
    { role: 'user' as const, content: message },
  ];

  const result = await askAI({ system, messages: msgs, maxTokens: 600 });

  // Record that staff accessed patient data through the assistant.
  await logAudit({
    clinicId: profile.clinic_id,
    actorId: user.id,
    actorEmail: user.email,
    action: 'ai_query',
    entity: 'staff_assistant',
    details: { message: message.slice(0, 500) },
  });

  if (!result.ok) {
    return NextResponse.json({ configured: true, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ configured: true, reply: result.text });
}
