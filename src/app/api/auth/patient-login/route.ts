import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { enforceRateLimit } from '@/lib/rateLimit';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

/**
 * Deterministic, unguessable password for a patient's internal auth user.
 * Patients authenticate by name + DOB; we mint a real Supabase session behind
 * the scenes so Row Level Security ("profile_id = auth.uid()") lets them read
 * ONLY their own records. Derived from the service-role key + patient id.
 */
function patientPassword(patientId: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';
  return crypto.createHmac('sha256', secret).update('patient:' + patientId).digest('hex');
}

export async function POST(request: NextRequest) {
  // Brute-force protection on name+DOB guessing: 10 attempts / minute per IP
  const limited = await enforceRateLimit(request, 'patient-login', { limit: 10, windowSec: 60 });
  if (limited) return limited;

  const { fullName, dateOfBirth } = await request.json();
  if (!fullName || !dateOfBirth) {
    return NextResponse.json({ error: 'Full name and date of birth are required.' }, { status: 400 });
  }

  // Validate the name+DOB credential with elevated access (no session yet).
  const admin = createAdminClient();
  const { data: patient } = await admin
    .from('patients')
    .select('*, clinics(name, slug)')
    .ilike('full_name', fullName.trim())
    .eq('date_of_birth', dateOfBirth)
    .maybeSingle();

  if (!patient) {
    return NextResponse.json(
      { error: 'Patient not found. Check your full name and date of birth.' },
      { status: 404 }
    );
  }

  // Internal (synthetic) auth identity — patients never type this.
  const authEmail = `patient.${patient.id}@patients.smiley.local`;
  const password = patientPassword(patient.id);
  const supabase = await createClient();

  // Try to start a session; provision the auth user on first login.
  let signIn = await supabase.auth.signInWithPassword({ email: authEmail, password });
  if (signIn.error) {
    const { data: created } = await admin.auth.admin.createUser({
      email: authEmail,
      password,
      email_confirm: true,
    });
    if (created?.user) {
      await admin.from('profiles').upsert({
        id: created.user.id,
        full_name: patient.full_name,
        email: authEmail,
        role: 'patient',
        clinic_id: patient.clinic_id,
      });
      await admin.from('patients').update({ profile_id: created.user.id }).eq('id', patient.id);
      signIn = await supabase.auth.signInWithPassword({ email: authEmail, password });
    }
  }

  if (signIn.error) {
    return NextResponse.json(
      { error: 'Could not start your patient session. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: {
      id: patient.id,
      fullName: patient.full_name,
      email: patient.email,
      role: 'patient' as const,
      clinicId: patient.clinic_id,
    },
    clinic: {
      name: patient.clinics?.name ?? '',
      slug: patient.clinics?.slug ?? '',
    },
  });
}
