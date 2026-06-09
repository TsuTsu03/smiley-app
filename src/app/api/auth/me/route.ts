import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, clinics(name, slug)')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  let dentistId: string | null = null;
  if (profile.role === 'dentist') {
    const { data: dentist } = await supabase
      .from('dentists')
      .select('id')
      .eq('profile_id', profile.id)
      .single();
    dentistId = dentist?.id ?? null;
  }

  // Patients are identified by their patients-table id (not the auth uid), so
  // the portal fetches the right records on reload, same as at login time.
  let id = profile.id;
  let fullName = profile.full_name;
  let email = profile.email;
  if (profile.role === 'patient') {
    const { data: patient } = await supabase
      .from('patients')
      .select('id, full_name, email')
      .eq('profile_id', profile.id)
      .maybeSingle();
    if (patient) {
      id = patient.id;
      fullName = patient.full_name;
      email = patient.email;
    }
  }

  return NextResponse.json({
    user: {
      id,
      fullName,
      email,
      role: profile.role,
      clinicId: profile.clinic_id,
      dentistId,
    },
    clinic: {
      name: profile.clinics?.name ?? '',
      slug: profile.clinics?.slug ?? '',
    },
  });
}
