import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { logAudit } from '@/lib/audit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get('clinicId');
  const patientId = searchParams.get('patientId');

  let query = supabase
    .from('consent_forms')
    .select('*, patients(full_name)')
    .order('created_at', { ascending: false });
  if (clinicId) query = query.eq('clinic_id', clinicId);
  if (patientId) query = query.eq('patient_id', patientId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const consents = (data as any[]).map((c) => ({
    id: c.id,
    clinicId: c.clinic_id,
    patientId: c.patient_id,
    patientName: c.patients?.full_name ?? null,
    title: c.title,
    content: c.content,
    status: c.status,
    signedAt: c.signed_at,
    createdAt: c.created_at,
  }));
  return NextResponse.json(consents);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const body = await request.json();
  if (!body.patientId || !body.clinicId || !body.title) {
    return NextResponse.json({ error: 'Patient, clinic, and title are required.' }, { status: 400 });
  }

  const status = body.status ?? 'signed';
  const { data, error } = await supabase
    .from('consent_forms')
    .insert({
      clinic_id: body.clinicId,
      patient_id: body.patientId,
      title: body.title,
      content: body.content ?? null,
      status,
      signed_at: status === 'signed' ? new Date().toISOString() : null,
      recorded_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    clinicId: body.clinicId,
    actorId: user.id,
    actorEmail: user.email,
    action: 'create',
    entity: 'consent_form',
    entityId: data.id,
    details: { title: body.title, status },
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
