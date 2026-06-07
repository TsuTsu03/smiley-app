import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Cancels the clinic's subscription. PayMongo has no hosted customer portal,
 * so we mark it canceled here — access stays until current_period_end, then
 * no further checkout is offered. Admin-only.
 */
export async function POST(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('clinic_id, role')
    .eq('id', user.id)
    .single();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Only clinic admins can manage billing' }, { status: 403 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('clinics')
    .update({ subscription_status: 'canceled' })
    .eq('id', profile.clinic_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
