-- ════════════════════════════════════════════════════════════════════════════
--  Smiley — Security hardening & feature columns
--  Run this in the Supabase SQL editor AFTER schema.sql.
--  Safe to re-run (idempotent): it drops old policies before recreating them.
-- ════════════════════════════════════════════════════════════════════════════

-- ─── Helper functions ─────────────────────────────────────────────────────────
-- SECURITY DEFINER so they can read `profiles` without tripping its own RLS
-- (prevents infinite recursion in the policies below).

create or replace function public.auth_clinic_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select clinic_id from public.profiles where id = auth.uid()
$$;

create or replace function public.auth_role()
returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Convenience: is the caller clinic staff (admin or dentist)?
create or replace function public.auth_is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()) in ('admin','dentist'), false)
$$;

-- ─── Feature columns ──────────────────────────────────────────────────────────
-- Billing on clinics (PayMongo — Philippine payment gateway).
-- Provider-agnostic status columns + a PayMongo reference.
alter table clinics add column if not exists paymongo_customer_id text;
alter table clinics add column if not exists paymongo_reference text;
alter table clinics add column if not exists plan text default 'trial';
alter table clinics add column if not exists subscription_status text default 'trialing';
alter table clinics add column if not exists trial_ends_at timestamptz default (now() + interval '14 days');
alter table clinics add column if not exists current_period_end timestamptz;

-- Reminder tracking
alter table appointments add column if not exists reminder_sent_at timestamptz;
alter table notifications add column if not exists clinic_id uuid references clinics(id);
alter table notifications add column if not exists channel text;
alter table notifications add column if not exists appointment_id uuid references appointments(id) on delete set null;

-- ─── Audit log ────────────────────────────────────────────────────────────────
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id),
  actor_id uuid,
  actor_email text,
  action text not null,        -- e.g. 'create', 'update', 'delete', 'login'
  entity text not null,        -- e.g. 'patient', 'appointment', 'record'
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);
create index if not exists audit_log_clinic_idx on audit_log (clinic_id, created_at desc);
alter table audit_log enable row level security;

-- ════════════════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY — replace the permissive "using (true)" policies with
--  clinic-scoped ones so one clinic can NEVER read another clinic's data.
-- ════════════════════════════════════════════════════════════════════════════

-- Drop every old permissive policy ------------------------------------------------
drop policy if exists "Authenticated users can read clinics" on clinics;
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Authenticated users can read profiles" on profiles;
drop policy if exists "Authenticated users can read dentists" on dentists;
drop policy if exists "Authenticated users can manage dentists" on dentists;
drop policy if exists "Authenticated users can read schedules" on dentist_schedules;
drop policy if exists "Authenticated users can manage schedules" on dentist_schedules;
drop policy if exists "Authenticated users can read patients" on patients;
drop policy if exists "Authenticated users can manage patients" on patients;
drop policy if exists "Authenticated users can read appointments" on appointments;
drop policy if exists "Authenticated users can manage appointments" on appointments;
drop policy if exists "Authenticated users can read records" on medical_records;
drop policy if exists "Authenticated users can manage records" on medical_records;
drop policy if exists "Authenticated users can read notifications" on notifications;
drop policy if exists "Authenticated users can manage notifications" on notifications;

-- CLINICS ------------------------------------------------------------------------
create policy "read own clinic" on clinics
  for select to authenticated using (id = auth_clinic_id());

-- PROFILES -----------------------------------------------------------------------
create policy "read own profile" on profiles
  for select to authenticated using (id = auth.uid());
create policy "staff read clinic profiles" on profiles
  for select to authenticated using (auth_is_staff() and clinic_id = auth_clinic_id());

-- DENTISTS -----------------------------------------------------------------------
create policy "read clinic dentists" on dentists
  for select to authenticated using (clinic_id = auth_clinic_id());
create policy "admin manage dentists" on dentists
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_role() = 'admin')
  with check (clinic_id = auth_clinic_id() and auth_role() = 'admin');

-- DENTIST SCHEDULES --------------------------------------------------------------
create policy "read clinic schedules" on dentist_schedules
  for select to authenticated using (
    dentist_id in (select id from dentists where clinic_id = auth_clinic_id())
  );
create policy "staff manage schedules" on dentist_schedules
  for all to authenticated
  using (dentist_id in (select id from dentists where clinic_id = auth_clinic_id()) and auth_is_staff())
  with check (dentist_id in (select id from dentists where clinic_id = auth_clinic_id()) and auth_is_staff());

-- PATIENTS -----------------------------------------------------------------------
-- staff see everyone in their clinic; a patient sees only their own row
create policy "read clinic or own patient" on patients
  for select to authenticated using (
    clinic_id = auth_clinic_id() and (auth_is_staff() or profile_id = auth.uid())
  );
create policy "staff manage patients" on patients
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_is_staff())
  with check (clinic_id = auth_clinic_id() and auth_is_staff());

-- APPOINTMENTS -------------------------------------------------------------------
create policy "read clinic or own appointments" on appointments
  for select to authenticated using (
    clinic_id = auth_clinic_id()
    and (auth_is_staff() or patient_id in (select id from patients where profile_id = auth.uid()))
  );
create policy "staff manage appointments" on appointments
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_is_staff())
  with check (clinic_id = auth_clinic_id() and auth_is_staff());
-- patients may create their own appointment requests
create policy "patient create own appointment" on appointments
  for insert to authenticated
  with check (
    clinic_id = auth_clinic_id()
    and patient_id in (select id from patients where profile_id = auth.uid())
  );

-- MEDICAL RECORDS ----------------------------------------------------------------
create policy "read clinic or own records" on medical_records
  for select to authenticated using (
    clinic_id = auth_clinic_id()
    and (auth_is_staff() or patient_id in (select id from patients where profile_id = auth.uid()))
  );
create policy "staff manage records" on medical_records
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_is_staff())
  with check (clinic_id = auth_clinic_id() and auth_is_staff());

-- NOTIFICATIONS ------------------------------------------------------------------
create policy "read clinic notifications" on notifications
  for select to authenticated using (
    clinic_id = auth_clinic_id()
    and (auth_is_staff() or patient_id in (select id from patients where profile_id = auth.uid()))
  );
create policy "staff manage notifications" on notifications
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_is_staff())
  with check (clinic_id = auth_clinic_id() and auth_is_staff());

-- AUDIT LOG ----------------------------------------------------------------------
create policy "admin read audit log" on audit_log
  for select to authenticated using (
    clinic_id = auth_clinic_id() and auth_role() = 'admin'
  );
-- (writes happen via the service-role key, which bypasses RLS)
