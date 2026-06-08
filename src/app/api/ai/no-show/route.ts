import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scoreNoShowRisk, type NoShowApptRow } from '@/lib/noShow';

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

  const rows: NoShowApptRow[] = ((all ?? []) as any[]).map((a) => ({
    id: a.id,
    patient_id: a.patient_id,
    date: a.date,
    time: a.time,
    type: a.type,
    status: a.status,
    reminder_sent_at: a.reminder_sent_at,
    patientName: a.patients?.full_name ?? null,
  }));

  const upcoming = scoreNoShowRisk(rows, today);

  return NextResponse.json({ count: upcoming.length, appointments: upcoming });
}
