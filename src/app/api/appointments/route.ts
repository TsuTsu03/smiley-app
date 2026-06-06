import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
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
  const supabase = await createClient();
  const body = await request.json();

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
  return NextResponse.json({ id: data.id }, { status: 201 });
}
