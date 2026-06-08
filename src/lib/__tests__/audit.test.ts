import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Supabase admin client before importing the module under test.
const { insertMock } = vi.hoisted(() => ({ insertMock: vi.fn() }));
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({ from: () => ({ insert: insertMock }) }),
}));

import { logAudit } from '../audit';

describe('logAudit', () => {
  beforeEach(() => {
    insertMock.mockReset().mockResolvedValue({ error: null });
  });

  it('inserts a row with snake_cased, mapped fields', async () => {
    await logAudit({
      clinicId: 'c1',
      actorId: 'u1',
      actorEmail: 'a@b.com',
      action: 'create',
      entity: 'patient',
      entityId: 'p1',
      details: { name: 'Juan' },
    });
    expect(insertMock).toHaveBeenCalledOnce();
    const row = insertMock.mock.calls[0][0];
    expect(row).toMatchObject({
      clinic_id: 'c1',
      actor_id: 'u1',
      actor_email: 'a@b.com',
      action: 'create',
      entity: 'patient',
      entity_id: 'p1',
      details: { name: 'Juan' },
    });
  });

  it('defaults optional fields to null', async () => {
    await logAudit({ action: 'login', entity: 'session' });
    const row = insertMock.mock.calls[0][0];
    expect(row.clinic_id).toBeNull();
    expect(row.entity_id).toBeNull();
    expect(row.details).toBeNull();
  });

  it('never throws, even when the insert rejects (best-effort)', async () => {
    insertMock.mockRejectedValueOnce(new Error('db down'));
    await expect(logAudit({ action: 'x', entity: 'y' })).resolves.toBeUndefined();
  });
});
