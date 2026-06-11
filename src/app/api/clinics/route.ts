import { createAdminClient } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/audit';
import { enforceRateLimit } from '@/lib/rateLimit';
import { sendEmail, trialSignupNotificationHtml } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

/** Where new free-trial signups are announced. */
function signupNotifyEmail(): string {
  return (
    process.env.SIGNUP_NOTIFY_EMAIL ||
    process.env.DEMO_NOTIFY_EMAIL ||
    'jansen.dev03@gmail.com'
  );
}

export async function POST(request: NextRequest) {
  // Anti-spam: clinic signups create auth users — cap at 5 / 10 min per IP
  const limited = await enforceRateLimit(request, 'signup', { limit: 5, windowSec: 600 });
  if (limited) return limited;

  const { clinicName, slug, address, phone, email, adminName, adminEmail, password } = await request.json();

  const adminClient = createAdminClient();

  // Step 1: Insert clinic
  const { data: clinic, error: clinicError } = await adminClient
    .from('clinics')
    .insert({ name: clinicName, slug, address, phone, email })
    .select()
    .single();

  if (clinicError) {
    if (clinicError.code === '23505') {
      return NextResponse.json({ error: 'This clinic name is already taken' }, { status: 409 });
    }
    return NextResponse.json({ error: clinicError.message }, { status: 500 });
  }

  // Step 2: Create Supabase auth user
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: adminEmail,
    password,
    email_confirm: true,
  });

  if (authError) {
    // Rollback: delete clinic
    await adminClient.from('clinics').delete().eq('id', clinic.id);
    if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already been registered')) {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 409 });
    }
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // Step 3: Insert profile
  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({
      id: authData.user.id,
      full_name: adminName,
      email: adminEmail,
      role: 'admin',
      clinic_id: clinic.id,
    });

  if (profileError) {
    // Rollback: delete auth user and clinic
    await adminClient.auth.admin.deleteUser(authData.user.id);
    await adminClient.from('clinics').delete().eq('id', clinic.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  await logAudit({
    clinicId: clinic.id,
    actorId: authData.user.id,
    actorEmail: adminEmail,
    action: 'create',
    entity: 'clinic',
    entityId: clinic.id,
    details: { name: clinic.name, slug: clinic.slug },
  });

  // Notify the team that a new clinic started a free trial — best-effort,
  // never block or fail the signup if the email can't be sent.
  try {
    await sendEmail({
      to: signupNotifyEmail(),
      subject: `New free trial — ${clinic.name}`,
      html: trialSignupNotificationHtml({
        clinicName: clinic.name,
        slug: clinic.slug,
        adminName,
        adminEmail,
        phone,
        clinicEmail: email,
      }),
      replyTo: adminEmail,
    });
  } catch {
    // ignore — signup already succeeded
  }

  return NextResponse.json({ clinic: { name: clinic.name, slug: clinic.slug } }, { status: 201 });
}
