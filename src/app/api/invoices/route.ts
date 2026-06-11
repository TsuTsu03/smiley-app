import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { logAudit } from '@/lib/audit';
import { computeInvoiceTotals, type LineItem } from '@/lib/billing';
import { NextRequest, NextResponse } from 'next/server';

const mapInvoice = (i: any) => ({
  id: i.id,
  clinicId: i.clinic_id,
  patientId: i.patient_id,
  patientName: i.patients?.full_name ?? null,
  invoiceNumber: i.invoice_number,
  items: i.items ?? [],
  subtotal: Number(i.subtotal),
  discount: Number(i.discount),
  total: Number(i.total),
  amountPaid: Number(i.amount_paid),
  status: i.status,
  notes: i.notes,
  createdAt: i.created_at,
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get('clinicId');
  const patientId = searchParams.get('patientId');

  let query = supabase
    .from('invoices')
    .select('*, patients(full_name)')
    .order('created_at', { ascending: false });
  if (clinicId) query = query.eq('clinic_id', clinicId);
  if (patientId) query = query.eq('patient_id', patientId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data as any[]).map(mapInvoice));
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const body = await request.json();
  if (!body.patientId || !body.clinicId) {
    return NextResponse.json({ error: 'Patient and clinic are required.' }, { status: 400 });
  }
  const items: LineItem[] = Array.isArray(body.items) ? body.items : [];
  const discount = Number(body.discount || 0);
  const { subtotal, total } = computeInvoiceTotals(items, discount);
  const invoiceNumber = body.invoiceNumber || `INV-${Date.now().toString().slice(-8)}`;

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      clinic_id: body.clinicId,
      patient_id: body.patientId,
      invoice_number: invoiceNumber,
      items,
      subtotal,
      discount,
      total,
      amount_paid: 0,
      status: 'unpaid',
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    clinicId: body.clinicId, actorId: user.id, actorEmail: user.email,
    action: 'create', entity: 'invoice', entityId: data.id,
    details: { invoiceNumber, total },
  });

  return NextResponse.json({ id: data.id, invoiceNumber }, { status: 201 });
}
