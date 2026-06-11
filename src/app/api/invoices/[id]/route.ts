import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { paymentStatus } from '@/lib/billing';
import { NextRequest, NextResponse } from 'next/server';

/** Record a payment / update an invoice's status. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const body = await request.json();

  // Load current invoice to recompute payment status
  const { data: inv, error: loadErr } = await supabase
    .from('invoices')
    .select('total, amount_paid, status')
    .eq('id', id)
    .single();
  if (loadErr || !inv) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

  const updates: Record<string, unknown> = {};

  if (body.addPayment !== undefined) {
    const newPaid = Number(inv.amount_paid) + Number(body.addPayment || 0);
    updates.amount_paid = newPaid;
    updates.status = paymentStatus(Number(inv.total), newPaid);
  }
  if (body.status !== undefined) updates.status = body.status;
  if (body.notes !== undefined) updates.notes = body.notes;

  const { error } = await supabase.from('invoices').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
