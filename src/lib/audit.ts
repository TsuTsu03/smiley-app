import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Append an entry to the audit_log. Best-effort: never throws, so it can't
 * break the request it's recording. Writes via the service-role key.
 */
export async function logAudit(entry: {
  clinicId?: string | null;
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from('audit_log').insert({
      clinic_id: entry.clinicId ?? null,
      actor_id: entry.actorId ?? null,
      actor_email: entry.actorEmail ?? null,
      action: entry.action,
      entity: entry.entity,
      entity_id: entry.entityId ?? null,
      details: entry.details ?? null,
    });
  } catch {
    /* swallow — auditing must never break the main flow */
  }
}
