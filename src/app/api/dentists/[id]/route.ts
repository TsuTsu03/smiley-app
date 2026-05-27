import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('dentists')
    .select('*, dentist_schedules(*)')
    .eq('id', params.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    id: data.id,
    fullName: data.full_name,
    specialization: data.specialization,
    email: data.email,
    phone: data.phone,
    clinicId: data.clinic_id,
    avatar: data.avatar,
    schedule: (data.dentist_schedules ?? []).map((s: { day: string; start_time: string; end_time: string }) => ({
      day: s.day,
      startTime: s.start_time,
      endTime: s.end_time,
    })),
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await request.json();

  const { error } = await supabase
    .from('dentists')
    .update({
      full_name: body.fullName,
      specialization: body.specialization,
      email: body.email,
      phone: body.phone,
      avatar: body.avatar ?? null,
    })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.schedule) {
    await supabase.from('dentist_schedules').delete().eq('dentist_id', params.id);
    if (body.schedule.length) {
      await supabase.from('dentist_schedules').insert(
        body.schedule.map((s: { day: string; startTime: string; endTime: string }) => ({
          dentist_id: params.id,
          day: s.day,
          start_time: s.startTime,
          end_time: s.endTime,
        }))
      );
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from('dentists').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
