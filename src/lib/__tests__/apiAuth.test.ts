import { describe, it, expect } from 'vitest';
import { requireUser } from '../apiAuth';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Minimal fake of the Supabase client's auth.getUser() for guard testing. */
const fakeClient = (user: { id: string; email?: string } | null) =>
  ({ auth: { getUser: async () => ({ data: { user } }) } }) as unknown as SupabaseClient;

describe('requireUser', () => {
  it('returns a 401 response and no user when there is no session', async () => {
    const { user, response } = await requireUser(fakeClient(null));
    expect(user).toBeNull();
    expect(response).not.toBeNull();
    expect(response?.status).toBe(401);
  });

  it('passes through (no response) when a user is signed in', async () => {
    const { user, response } = await requireUser(fakeClient({ id: 'u1', email: 'a@b.com' }));
    expect(response).toBeNull();
    expect(user?.id).toBe('u1');
  });
});
