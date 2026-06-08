import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { askAI, aiConfigured } from '@/lib/ai';
import { enforceRateLimit } from '@/lib/rateLimit';

/**
 * Patient-facing AI assistant. Grounds the model in the caller's real clinic
 * data (dentists, schedules, and the patient's own appointments) so answers
 * are accurate — not generic. Returns { configured:false } when no API key,
 * so the client can fall back to its built-in rule-based replies.
 */
export async function POST(request: NextRequest) {
  // Protect the (free) Groq quota from abuse: 20 messages / minute per IP
  const limited = await enforceRateLimit(request, 'ai-chat', { limit: 20, windowSec: 60 });
  if (limited) return limited;

  if (!aiConfigured()) {
    return NextResponse.json({ configured: false });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { message, history } = await request.json();
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  }

  // Caller context (RLS guarantees this only returns the caller's clinic)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, clinic_id')
    .eq('id', user.id)
    .single();

  const [{ data: clinic }, { data: dentists }, { data: patientRow }] = await Promise.all([
    supabase.from('clinics').select('name, address, phone, email').eq('id', profile?.clinic_id).single(),
    supabase.from('dentists').select('id, full_name, specialization').eq('clinic_id', profile?.clinic_id),
    supabase.from('patients').select('id, full_name').eq('profile_id', user.id).maybeSingle(),
  ]);

  let myAppointments: unknown[] = [];
  if (patientRow?.id) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: appts } = await supabase
      .from('appointments')
      .select('date, time, type, status, dentists(full_name)')
      .eq('patient_id', patientRow.id)
      .gte('date', today)
      .neq('status', 'cancelled')
      .order('date');
    myAppointments = appts ?? [];
  }

  const context = {
    clinic,
    dentists,
    patient: patientRow?.full_name ?? profile?.full_name,
    upcomingAppointments: myAppointments,
  };

  const system = `You are "Smiley", a warm, concise dental-clinic assistant for patients.
Answer ONLY using the clinic data provided as JSON below. If the data doesn't
contain the answer, say so briefly and suggest contacting the clinic or booking
in the "Book Appointment" tab. Never invent dentists, times, or prices.
You may reply in English or Tagalog, matching the patient's language.
Keep answers short (2-5 sentences). Use markdown **bold** for key details.

CLINIC DATA (JSON):
${JSON.stringify(context, null, 2)}`;

  const msgs = [
    ...(Array.isArray(history) ? history.slice(-6) : []),
    { role: 'user' as const, content: message },
  ];

  const result = await askAI({ system, messages: msgs, maxTokens: 400 });
  if (!result.ok) {
    return NextResponse.json({ configured: true, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ configured: true, reply: result.text });
}
