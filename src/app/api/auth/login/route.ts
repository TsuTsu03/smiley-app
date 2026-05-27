import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, clinics(name, slug)')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      role: profile.role,
      clinicId: profile.clinic_id,
    },
    clinic: {
      name: profile.clinics?.name ?? '',
      slug: profile.clinics?.slug ?? '',
    },
  });
}
