-- ════════════════════════════════════════════════════════════════════════════
--  Smiley — Staff onboarding walkthrough + CSV import support
--  Run AFTER schema.sql (and earlier numbered migrations). Safe to re-run.
--
--  1. Trial/demo lockout is retired. The billing columns on `clinics` stay for
--     paid-plan accounting, but the app no longer blocks staff when a trial
--     "ends". Instead, first-time staff (admin/dentist) must complete a one-time
--     product walkthrough before using the app. `profiles.onboarded_at` records
--     when they finished it (NULL = not yet onboarded).
--
--  2. Patient CSV import upserts by (clinic_id, lower(email)). A partial unique
--     index makes that key enforceable at the database level and lets the import
--     endpoint use ON CONFLICT to update existing rows instead of duplicating.
-- ════════════════════════════════════════════════════════════════════════════

-- ─── 1. Staff walkthrough completion ─────────────────────────────────────────
alter table public.profiles
  add column if not exists onboarded_at timestamptz;

-- ─── 2. Upsert key for patient imports ───────────────────────────────────────
-- Emails are stored as-entered; match case-insensitively and ignore blanks.
-- (A partial index skips rows with an empty email so those never collide.)
create unique index if not exists patients_clinic_email_uniq
  on public.patients (clinic_id, lower(email))
  where email is not null and email <> '';
