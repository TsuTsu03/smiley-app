-- ════════════════════════════════════════════════════════════════════════════
--  Smiley — Patient login OTP (second factor)
--  Run AFTER schema.sql. Safe to re-run.
--
--  Patients sign in with full name + date of birth. Those are NOT secrets, so
--  on their own they're a weak credential for health records. This table backs
--  a one-time 6-digit code emailed to the patient's registered address: the
--  name+DOB identifies the record, the OTP proves the person controls that
--  email (something they HAVE) before a session is minted.
--
--  Only the service-role key (server-side admin client) ever touches this
--  table — RLS is enabled with NO policies so it is unreadable to end users.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists patient_login_otps (
  patient_id  uuid primary key references patients(id) on delete cascade,
  code_hash   text not null,          -- HMAC-SHA256 of the 6-digit code
  expires_at  timestamptz not null,   -- typically now() + 10 minutes
  attempts    int not null default 0, -- failed verify attempts (locks at 5)
  created_at  timestamptz default now()
);

alter table patient_login_otps enable row level security;
-- Intentionally NO policies: end users can never read or write this table.
-- All access goes through the service-role key, which bypasses RLS.
