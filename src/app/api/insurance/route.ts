import { createClient } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';
import { NextRequest, NextResponse } from 'next/server';

const mapClaim = (c: any) => ({
  id: c.id,
  clinicId: c.clinic_id,
  patientId: c.patient_id,
  patientName: c.patients?.full_name ?? null,
  provider: c.provider,
  memberId: c.member_id,
  procedure: c.procedure,
  claimAmount: Number(c.claim_amount),
  approvedAmount: Number(c.approved_amount),
  status: c.status,
  notes: c.notes,
  createdAt: c.created_at,
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get('clinicId');
  const patientId = searchParams.get('patientId');

  let query = supabase
    .from('insurance_claims')
    .select('*, patients(full_name)')
    .order('created_at', { ascending: false });
  if (clinicId) query = query.eq('clinic_id', clinicId);
  if (patientId) query = query.eq('patient_id', patientId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data as any[]).map(mapClaim));
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const body = await request.json();
  if (!body.patientId || !body.clinicId || !body.provider) {
    return NextResponse.json({ error: 'Patient, clinic, and HMO/provider are required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('insurance_claims')
    .insert({
      clinic_id: body.clinicId,
      patient_id: body.patientId,
      provider: body.provider,
      member_id: body.memberId ?? null,
      procedure: body.procedure ?? null,
      claim_amount: Number(body.claimAmount || 0),
      approved_amount: Number(body.approvedAmount || 0),
      status: body.status ?? 'submitted',
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    clinicId: body.clinicId, actorId: user.id, actorEmail: user.email,
    action: 'create', entity: 'insurance_claim', entityId: data.id,
    details: { provider: body.provider, claimAmount: body.claimAmount },
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
