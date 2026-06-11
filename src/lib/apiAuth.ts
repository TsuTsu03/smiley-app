import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Defense-in-depth auth guard for API routes.
 *
 * Most data routes rely on Supabase Row Level Security to scope rows to the
 * caller's clinic. That is the primary control — but it fails OPEN if a policy
 * is ever dropped, misconfigured, or a migration isn't applied. This guard
 * makes every protected endpoint also fail CLOSED on a missing session, so an
 * unauthenticated request is rejected before any query runs.
 *
 * Usage:
 *   const supabase = await createClient();
 *   const { user, response } = await requireUser(supabase);
 *   if (response) return response;   // 401 — stop here
 *   // ...user is guaranteed non-null below
 */
export async function requireUser(
  supabase: SupabaseClient
): Promise<{ user: { id: string; email?: string } | null; response: NextResponse | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: 'Not signed in' }, { status: 401 }),
    };
  }

  return { user, response: null };
}
