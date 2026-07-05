import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/apiAuth';
import { NextResponse } from 'next/server';

/**
 * Marks the signed-in staff member's product walkthrough as complete.
 * Sets profiles.onboarded_at = now() so the one-time tutorial never gates
 * them again. Idempotent — re-calling just refreshes the timestamp.
 */
export async function POST() {
  const supabase = await createClient();
  const { user, response } = await requireUser(supabase);
  if (response) return response;

  const { error } = await supabase
    .from('profiles')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', user!.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
