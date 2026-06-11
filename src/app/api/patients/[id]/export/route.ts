import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Exports a patient's full medical history as a CSV download.
 * RLS ensures the caller can only export patients in their own clinic.
 */
function csvEscape(v: unknown): string {
  let s = v == null ? '' : String(v);
  // Neutralize CSV/formula injection: a leading =, +, -, @, tab or CR makes
  // spreadsheet apps execute the cell as a formula. Prefix with an apostrophe.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;

  const { data: patient } = await supabase
    .from('patients')
    .select('full_name')
    .eq('id', id)
    .single();
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: records, error } = await supabase
    .from('medical_records')
    .select('date, procedure, tooth, diagnosis, notes, prescription, next_visit, dentists(full_name)')
    .eq('patient_id', id)
    .order('date', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = ['Date', 'Procedure', 'Tooth', 'Diagnosis', 'Notes', 'Prescription', 'Next Visit', 'Dentist'];
  const lines = [headers.join(',')];
  for (const r of (records ?? []) as any[]) {
    lines.push([
      r.date, r.procedure, r.tooth, r.diagnosis, r.notes,
      r.prescription, r.next_visit, r.dentists?.full_name,
    ].map(csvEscape).join(','));
  }
  const csv = lines.join('\n');

  const safeName = patient.full_name.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeName}_records.csv"`,
    },
  });
}
