-- ════════════════════════════════════════════════════════════════════════════
--  Smiley — Billing/Invoicing + Insurance & HMO Claims
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

-- ─── Invoices ─────────────────────────────────────────────────────────────────
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id),
  patient_id uuid references patients(id) on delete cascade,
  invoice_number text,
  items jsonb default '[]'::jsonb,          -- [{ desc, qty, price }]
  subtotal numeric(12,2) default 0,
  discount numeric(12,2) default 0,
  total numeric(12,2) default 0,
  amount_paid numeric(12,2) default 0,
  status text not null default 'unpaid' check (status in ('unpaid', 'partial', 'paid', 'void')),
  notes text,
  created_at timestamptz default now()
);
create index if not exists invoices_clinic_idx on invoices (clinic_id, created_at desc);
create index if not exists invoices_patient_idx on invoices (patient_id);
alter table invoices enable row level security;

drop policy if exists "read clinic or own invoices" on invoices;
create policy "read clinic or own invoices" on invoices
  for select to authenticated using (
    clinic_id = auth_clinic_id()
    and (auth_is_staff() or patient_id in (select id from patients where profile_id = auth.uid()))
  );
drop policy if exists "staff manage invoices" on invoices;
create policy "staff manage invoices" on invoices
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_is_staff())
  with check (clinic_id = auth_clinic_id() and auth_is_staff());

-- ─── Insurance / HMO claims ───────────────────────────────────────────────────
create table if not exists insurance_claims (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id),
  patient_id uuid references patients(id) on delete cascade,
  provider text not null,                   -- HMO / insurer name
  member_id text,
  procedure text,
  claim_amount numeric(12,2) default 0,
  approved_amount numeric(12,2) default 0,
  status text not null default 'submitted' check (status in ('submitted', 'pending', 'approved', 'partial', 'denied')),
  notes text,
  created_at timestamptz default now()
);
create index if not exists claims_clinic_idx on insurance_claims (clinic_id, created_at desc);
create index if not exists claims_patient_idx on insurance_claims (patient_id);
alter table insurance_claims enable row level security;

drop policy if exists "read clinic or own claims" on insurance_claims;
create policy "read clinic or own claims" on insurance_claims
  for select to authenticated using (
    clinic_id = auth_clinic_id()
    and (auth_is_staff() or patient_id in (select id from patients where profile_id = auth.uid()))
  );
drop policy if exists "staff manage claims" on insurance_claims;
create policy "staff manage claims" on insurance_claims
  for all to authenticated
  using (clinic_id = auth_clinic_id() and auth_is_staff())
  with check (clinic_id = auth_clinic_id() and auth_is_staff());
