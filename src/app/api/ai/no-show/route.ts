import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * No-show risk scoring for upcoming appointments. Staff-only.
 * Uses each patient's own history (cancellations vs. completions) plus a
 * few simple signals — a transparent heuristic, no black box. RLS keeps it
 * scoped to the caller's clinic automatically.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('clinic_id, role')
    .eq('id', user.id)
    .single();
  if (!profile || !['admin', 'dentist'].includes(profile.role)) {
    return NextResponse.json({ error: 'Staff only' }, { status: 403 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // All appointments for this clinic (RLS-scoped)
  const { data: all, error } = await supabase
    .from('appointments')
    .select('id, patient_id, date, time, type, status, reminder_sent_at, patients(full_name)')
    .eq('clinic_id', profile.clinic_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (all ?? []) as any[];

  // Build per-patient history from PAST appointments
  const hist: Record<string, { cancelled: number; completed: number; total: number }> = {};
  for (const a of rows) {
    if (a.date >= today) continue;
    const h = (hist[a.patient_id] ||= { cancelled: 0, completed: 0, total: 0 });
    h.total++;
    if (a.status === 'cancelled') h.cancelled++;
    if (a.status === 'completed') h.completed++;
  }

  const upcoming = rows
    .filter((a) => a.date >= today && a.status !== 'cancelled' && a.status !== 'completed')
    .map((a) => {
      const h = hist[a.patient_id];
      let score: number;
      if (!h || h.total === 0) {
        score = 35; // new patient — unknown, slightly elevated
      } else {
        const cancelRate = h.cancelled / h.total;
        score = Math.round(15 + cancelRate * 70); // 15–85 from history
      }
      if (!a.reminder_sent_at) score += 8; // no reminder sent yet → higher risk
      score = Math.max(5, Math.min(95, score));
      const level = score >= 65 ? 'High' : score >= 40 ? 'Medium' : 'Low';
      return {
        appointmentId: a.id,
        patientName: a.patients?.full_name ?? 'Unknown',
        date: a.date,
        time: a.time,
        type: a.type,
        riskPct: score,
        level,
      };
    })
    .sort((a, b) => b.riskPct - a.riskPct);

  return NextResponse.json({ count: upcoming.length, appointments: upcoming });
}
