import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const body = await request.json();

  const { error } = await supabase
    .from('medical_records')
    .update({
      date: body.date,
      procedure: body.procedure,
      tooth: body.tooth ?? null,
      notes: body.notes,
      diagnosis: body.diagnosis,
      prescription: body.prescription ?? null,
      next_visit: body.nextVisit ?? null,
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { response } = await requireUser(supabase);
  if (response) return response;
  const { error } = await supabase.from('medical_records').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
