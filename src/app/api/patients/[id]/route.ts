import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    id: data.id,
    fullName: data.full_name,
    dateOfBirth: data.date_of_birth,
    gender: data.gender,
    phone: data.phone,
    email: data.email,
    address: data.address,
    bloodType: data.blood_type,
    allergies: data.allergies ?? [],
    emergencyContact: data.emergency_contact,
    emergencyPhone: data.emergency_phone,
    clinicId: data.clinic_id,
    registeredAt: data.registered_at,
    nextAdjustmentDate: data.next_adjustment_date,
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  const { error } = await supabase
    .from('patients')
    .update({
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
      next_adjustment_date: body.nextAdjustmentDate ?? null,
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from('patients').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
