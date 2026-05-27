import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.date !== undefined) updates.date = body.date;
  if (body.time !== undefined) updates.time = body.time;
  if (body.type !== undefined) updates.type = body.type;
  if (body.dentistId !== undefined) updates.dentist_id = body.dentistId;

  const { error } = await supabase.from('appointments').update(updates).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('appointments').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
