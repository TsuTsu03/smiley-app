import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { fullName, dateOfBirth } = await request.json();

  const supabase = createClient();
  const { data, error } = await supabase
    .from('patients')
    .select('*, clinics(name, slug)')
    .ilike('full_name', fullName.trim())
    .eq('date_of_birth', dateOfBirth)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'Patient not found. Check your full name and date of birth.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    user: {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      role: 'patient' as const,
      clinicId: data.clinic_id,
    },
    clinic: {
      name: data.clinics?.name ?? '',
      slug: data.clinics?.slug ?? '',
    },
  });
}
