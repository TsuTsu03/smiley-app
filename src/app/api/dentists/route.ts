import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get('clinicId');

  let query = supabase
    .from('dentists')
    .select('*, dentist_schedules(*)')
    .order('full_name');
  if (clinicId) query = query.eq('clinic_id', clinicId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const dentists = data.map((d) => ({
    id: d.id,
    fullName: d.full_name,
    specialization: d.specialization,
    email: d.email,
    phone: d.phone,
    clinicId: d.clinic_id,
    avatar: d.avatar,
    schedule: (d.dentist_schedules ?? []).map((s: { day: string; start_time: string; end_time: string }) => ({
      day: s.day,
      startTime: s.start_time,
      endTime: s.end_time,
    })),
  }));

  return NextResponse.json(dentists);
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('dentists')
    .insert({
      full_name: body.fullName,
      specialization: body.specialization,
      email: body.email,
      phone: body.phone,
      clinic_id: body.clinicId,
      avatar: body.avatar ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.schedule?.length) {
    await supabase.from('dentist_schedules').insert(
      body.schedule.map((s: { day: string; startTime: string; endTime: string }) => ({
        dentist_id: data.id,
        day: s.day,
        start_time: s.startTime,
        end_time: s.endTime,
      }))
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
