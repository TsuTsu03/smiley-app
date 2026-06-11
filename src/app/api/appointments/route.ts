import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { logAudit } from '@/lib/audit';
import { enforceRateLimit } from '@/lib/rateLimit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get('clinicId');
  const patientId = searchParams.get('patientId');
  const dentistId = searchParams.get('dentistId');

  let query = supabase
    .from('appointments')
    .select('*, patients(full_name), dentists(full_name)')
    .order('date')
    .order('time');
  if (clinicId) query = query.eq('clinic_id', clinicId);
  if (patientId) query = query.eq('patient_id', patientId);
  if (dentistId) query = query.eq('dentist_id', dentistId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const appointments = (data as any[]).map((a) => ({
    id: a.id,
    patientId: a.patient_id,
    dentistId: a.dentist_id,
    clinicId: a.clinic_id,
    date: a.date,
    time: a.time,
    type: a.type,
    status: a.status,
    notes: a.notes,
    createdAt: a.created_at,
    patientName: a.patients?.full_name ?? null,
    dentistName: a.dentists?.full_name ?? null,
  }));

  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  // Anti-spam on booking creation: 15 / minute per IP
  const limited = await enforceRateLimit(request, 'booking', { limit: 15, windowSec: 60 });
  if (limited) return limited;

  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const body = await request.json();

  if (!body.dentistId || !body.date || !body.time || !body.patientId) {
    return NextResponse.json(
      { error: 'Missing required fields (patient, dentist, date, time).' },
      { status: 400 }
    );
  }

  // ── Conflict detection: a dentist cannot have two active appointments at the
  //    same date & time. Backs the "no double-bookings, ever" promise.
  const { data: clash, error: clashError } = await supabase
    .from('appointments')
    .select('id')
    .eq('dentist_id', body.dentistId)
    .eq('date', body.date)
    .eq('time', body.time)
    .neq('status', 'cancelled')
    .limit(1);

  if (clashError) return NextResponse.json({ error: clashError.message }, { status: 500 });
  if (clash && clash.length > 0) {
    return NextResponse.json(
      { error: 'That time slot is already booked for this dentist. Please choose another.' },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: body.patientId,
      dentist_id: body.dentistId,
      clinic_id: body.clinicId,
      date: body.date,
      time: body.time,
      type: body.type,
      status: body.status ?? 'pending',
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  await logAudit({
    clinicId: body.clinicId,
    actorId: user?.id,
    actorEmail: user?.email,
    action: 'create',
    entity: 'appointment',
    entityId: data.id,
    details: { date: body.date, time: body.time, type: body.type },
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
