import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
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

  return NextResponse.json({
    user: {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
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
