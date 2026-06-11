import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { enforceRateLimit } from '@/lib/rateLimit';
import { sendEmail, patientOtpEmailHtml } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;

/**
 * Patient sign-in is a TWO-STEP flow:
 *
 *   1) Request: client POSTs { fullName, dateOfBirth }. We confirm a matching
 *      patient exists and email a 6-digit one-time code to their registered
 *      address. No session is minted yet → { otpRequired: true }.
 *
 *   2) Verify: client POSTs { fullName, dateOfBirth, otp }. We check the code,
 *      then mint a real Supabase session so Row Level Security
 *      ("profile_id = auth.uid()") lets the patient read ONLY their own records.
 *
 * Name + DOB alone are not secrets, so the emailed code is the real second
 * factor: it proves the person controls the email on file before any data is
 * exposed.
 */

/**
 * Deterministic, unguessable password for a patient's internal auth user.
 * Patients never see this — it's derived from the service-role key + patient id
 * so the server can sign them in once the OTP is verified.
 */
function patientPassword(patientId: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';
  return crypto.createHmac('sha256', secret).update('patient:' + patientId).digest('hex');
}

/** HMAC the OTP so a DB leak doesn't expose live codes. */
function hashOtp(patientId: string, code: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';
  return crypto.createHmac('sha256', secret).update(`otp:${patientId}:${code}`).digest('hex');
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'hex');
  const bb = Buffer.from(b, 'hex');
  if (ba.length !== bb.length) return false;
  try {
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/** "juan@gmail.com" → "j••••@gmail.com" so the client can hint where to look. */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '•••';
  const head = local.slice(0, 1);
  return `${head}${'•'.repeat(Math.max(local.length - 1, 3))}@${domain}`;
}

type Admin = ReturnType<typeof createAdminClient>;

/** Look up the patient by name + DOB (the identifier, not the credential). */
async function findPatient(admin: Admin, fullName: string, dateOfBirth: string) {
  const { data } = await admin
    .from('patients')
    .select('*, clinics(name, slug)')
    .ilike('full_name', fullName.trim())
    .eq('date_of_birth', dateOfBirth)
    .maybeSingle();
  return data;
}

/** Mint a Supabase session for the patient, provisioning the auth user on first login. */
async function startPatientSession(admin: Admin, patient: any) {
  const authEmail = `patient.${patient.id}@patients.smiley.local`;
  const password = patientPassword(patient.id);
  const supabase = await createClient();

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
  return signIn.error ? null : true;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { fullName, dateOfBirth, otp } = body as {
    fullName?: string;
    dateOfBirth?: string;
    otp?: string;
  };

  if (!fullName || !dateOfBirth) {
    return NextResponse.json({ error: 'Full name and date of birth are required.' }, { status: 400 });
  }

  const admin = createAdminClient();

  // ── Step 2: verify the emailed code and start the session ──────────────────
  if (otp) {
    // Throttle code guessing: 10 attempts / minute per IP (on top of the
    // per-patient attempt counter below).
    const limited = await enforceRateLimit(request, 'patient-otp-verify', { limit: 10, windowSec: 60 });
    if (limited) return limited;

    if (!/^\d{6}$/.test(otp.trim())) {
      return NextResponse.json({ error: 'Enter the 6-digit code from your email.' }, { status: 400 });
    }

    const patient = await findPatient(admin, fullName, dateOfBirth);
    if (!patient) {
      return NextResponse.json({ error: 'Your sign-in session expired. Please start again.' }, { status: 400 });
    }

    const { data: otpRow } = await admin
      .from('patient_login_otps')
      .select('code_hash, expires_at, attempts')
      .eq('patient_id', patient.id)
      .maybeSingle();

    if (!otpRow || new Date(otpRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'Your code expired. Please request a new one.' }, { status: 400 });
    }
    if (otpRow.attempts >= OTP_MAX_ATTEMPTS) {
      await admin.from('patient_login_otps').delete().eq('patient_id', patient.id);
      return NextResponse.json(
        { error: 'Too many incorrect codes. Please request a new one.' },
        { status: 429 }
      );
    }

    const ok = timingSafeEqualHex(otpRow.code_hash, hashOtp(patient.id, otp.trim()));
    if (!ok) {
      await admin
        .from('patient_login_otps')
        .update({ attempts: otpRow.attempts + 1 })
        .eq('patient_id', patient.id);
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 401 });
    }

    // Correct — burn the code so it can't be reused, then sign in.
    await admin.from('patient_login_otps').delete().eq('patient_id', patient.id);

    const session = await startPatientSession(admin, patient);
    if (!session) {
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

  // ── Step 1: validate identity and email a one-time code ────────────────────
  // Throttle code requests: 5 / 5 min per IP so name+DOB can't be enumerated.
  const limited = await enforceRateLimit(request, 'patient-otp-request', { limit: 5, windowSec: 300 });
  if (limited) return limited;

  const patient = await findPatient(admin, fullName, dateOfBirth);
  if (!patient) {
    return NextResponse.json(
      { error: 'Patient not found. Check your full name and date of birth.' },
      { status: 404 }
    );
  }

  if (!patient.email) {
    return NextResponse.json(
      {
        error:
          'No email is on file for your record, so we can’t send a sign-in code. Please contact your clinic to add one.',
      },
      { status: 409 }
    );
  }

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000).toISOString();

  await admin.from('patient_login_otps').upsert({
    patient_id: patient.id,
    code_hash: hashOtp(patient.id, code),
    expires_at: expiresAt,
    attempts: 0,
  });

  const clinicName = patient.clinics?.name ?? 'Your dental clinic';
  const emailResult = await sendEmail({
    to: patient.email,
    subject: `${code} is your ${clinicName} sign-in code`,
    html: patientOtpEmailHtml({
      patientName: patient.full_name,
      clinicName,
      code,
      minutes: OTP_TTL_MINUTES,
    }),
    fromName: clinicName,
  });

  if (!emailResult.ok) {
    return NextResponse.json(
      { error: 'Could not send your sign-in code. Please try again shortly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ otpRequired: true, email: maskEmail(patient.email) });
}
