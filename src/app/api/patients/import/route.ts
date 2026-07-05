import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { buildImportPlan, parseCsv, type PatientRecord } from '@/lib/patientImport';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Bulk patient import (admin only). Accepts raw CSV text and upserts by
 * (clinic_id, lower(email)): rows whose email already exists in the clinic are
 * UPDATED, new ones are INSERTED, invalid rows are reported back per-row so the
 * admin can fix and re-upload. The target clinic is taken from the caller's own
 * profile — never trusted from the request — so an admin can only import into
 * their own clinic.
 *
 * Pass { commit: false } to dry-run: validate and return the plan counts +
 * errors without writing. The UI uses this to preview before committing.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { user, response } = await requireUser(supabase);
  if (response) return response;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, clinic_id')
    .eq('id', user!.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Only clinic admins can import patients' }, { status: 403 });
  }
  const clinicId = profile.clinic_id as string;

  const { csv, commit = true } = await request.json();
  if (typeof csv !== 'string' || !csv.trim()) {
    return NextResponse.json({ error: 'Missing CSV data' }, { status: 400 });
  }

  // DoS guard: cap the payload size and row count so one upload can't exhaust
  // memory or hammer the database. ~5 MB / 5000 rows is far beyond any real
  // single-clinic import.
  const MAX_BYTES = 5 * 1024 * 1024;
  const MAX_ROWS = 5000;
  if (csv.length > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 });
  }
  // Cheap line-count pre-check before the full parse.
  if (csv.split('\n').length - 1 > MAX_ROWS) {
    return NextResponse.json({ error: `Too many rows (max ${MAX_ROWS})` }, { status: 413 });
  }

  // Emails already in this clinic → decide insert vs update.
  const { data: existing, error: readErr } = await supabase
    .from('patients')
    .select('email')
    .eq('clinic_id', clinicId);
  if (readErr) return NextResponse.json({ error: readErr.message }, { status: 500 });

  const existingEmails = new Set(
    (existing ?? []).map((p) => (p.email ?? '').toLowerCase()).filter(Boolean)
  );

  const plan = buildImportPlan(parseCsv(csv), existingEmails);

  const summary = {
    inserted: plan.toInsert.length,
    updated: plan.toUpdate.length,
    failed: plan.errors.length,
    errors: plan.errors,
  };

  // Dry run, or nothing valid to write.
  if (!commit || plan.validCount === 0) {
    return NextResponse.json({ committed: false, ...summary });
  }

  const toRow = (p: PatientRecord) => ({
    full_name: p.fullName,
    date_of_birth: p.dateOfBirth,
    gender: p.gender,
    phone: p.phone,
    email: p.email,
    address: p.address,
    blood_type: p.bloodType,
    allergies: p.allergies,
    emergency_contact: p.emergencyContact,
    emergency_phone: p.emergencyPhone,
    clinic_id: clinicId,
  });

  if (plan.toInsert.length) {
    const { error } = await supabase.from('patients').insert(plan.toInsert.map(toRow));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update existing records in place, matched by clinic + email.
  for (const p of plan.toUpdate) {
    const row = toRow(p);
    const { error } = await supabase
      .from('patients')
      .update(row)
      .eq('clinic_id', clinicId)
      .eq('email', p.email);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ committed: true, ...summary });
}
