import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get('clinicId');
  const patientId = searchParams.get('patientId');
  const dentistId = searchParams.get('dentistId');

  let query = supabase
    .from('medical_records')
    .select('*, dentists(full_name)')
    .order('date', { ascending: false });
  if (clinicId) query = query.eq('clinic_id', clinicId);
  if (patientId) query = query.eq('patient_id', patientId);
  if (dentistId) query = query.eq('dentist_id', dentistId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const records = (data as any[]).map((r) => ({
    id: r.id,
    patientId: r.patient_id,
    dentistId: r.dentist_id,
    clinicId: r.clinic_id,
    date: r.date,
    procedure: r.procedure,
    tooth: r.tooth,
    notes: r.notes,
    diagnosis: r.diagnosis,
    prescription: r.prescription,
    nextVisit: r.next_visit,
    images: r.images ?? [],
    dentistName: r.dentists?.full_name ?? null,
  }));

  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('medical_records')
    .insert({
      patient_id: body.patientId,
      dentist_id: body.dentistId,
      clinic_id: body.clinicId,
      date: body.date,
      procedure: body.procedure,
      tooth: body.tooth ?? null,
      notes: body.notes,
      diagnosis: body.diagnosis,
      prescription: body.prescription ?? null,
      next_visit: body.nextVisit ?? null,
      images: body.images ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
