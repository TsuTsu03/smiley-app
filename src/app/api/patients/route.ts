import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get('clinicId');

  let query = supabase.from('patients').select('*').order('full_name');
  if (clinicId) query = query.eq('clinic_id', clinicId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const patients = data.map((p) => ({
    id: p.id,
    fullName: p.full_name,
    dateOfBirth: p.date_of_birth,
    gender: p.gender,
    phone: p.phone,
    email: p.email,
    address: p.address,
    bloodType: p.blood_type,
    allergies: p.allergies ?? [],
    emergencyContact: p.emergency_contact,
    emergencyPhone: p.emergency_phone,
    clinicId: p.clinic_id,
    registeredAt: p.registered_at,
    nextAdjustmentDate: p.next_adjustment_date,
  }));

  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const body = await request.json();

  const { data, error } = await supabase
    .from('patients')
    .insert({
      full_name: body.fullName,
      date_of_birth: body.dateOfBirth,
      gender: body.gender,
      phone: body.phone,
      email: body.email,
      address: body.address,
      blood_type: body.bloodType,
      allergies: body.allergies ?? [],
      emergency_contact: body.emergencyContact,
      emergency_phone: body.emergencyPhone,
      clinic_id: body.clinicId,
      next_adjustment_date: body.nextAdjustmentDate ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
