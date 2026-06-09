-- ════════════════════════════════════════════════════════════════════════════
--  Smiley — Patient Consent Forms
--  Run AFTER schema.sql. (Ideally also after 02_security_and_features.sql.)
--  Safe to re-run.
-- ════════════════════════════════════════════════════════════════════════════

-- Helper functions (idempotent — also created by 02_security_and_features.sql).
-- Included here so this migration works even if 02 hasn't been run yet.
create or replace function public.auth_clinic_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select clinic_id from public.profiles where id = auth.uid()
$$;
create or replace function public.auth_is_staff() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()) in ('admin','dentist'), false)
$$;

create table if not exists consent_forms (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id),
  patient_id uuid references patients(id) on delete cascade,
  title text not null,
  content text,
  status text not null default 'signed' check (status in ('signed', 'pending', 'declined')),
  signed_at timestamptz,
  recorded_by uuid,
  created_at timestamptz default now()
);
create index if not exists consent_forms_clinic_idx on consent_forms (clinic_id, created_at desc);
create index if not exists consent_forms_patient_idx on consent_forms (patient_id);

alter table consent_forms enable row level security;

-- Staff see/manage their clinic's consents; a patient may read their own.
drop policy if exists "read clinic or own consents" on consent_forms;
create policy "read clinic or own consents" on consent_forms
  for select to authenticated using (
    clinic_id = auth_clinic_id()
    and (auth_is_staff() or patient_id in (select id from patients where profile_id = auth.uid()))
  );

drop policy if exists "staff manage consents" on consent_forms;
create policy "staff manage consents" on consent_forms
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_is_staff())
  with check (clinic_id = auth_clinic_id() and auth_is_staff());
