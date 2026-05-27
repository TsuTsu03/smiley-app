-- ─── Clinics ──────────────────────────────────────────────────────────────────
create table if not exists clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  address text not null,
  phone text not null,
  email text not null,
  created_at timestamptz default now()
);

-- ─── Profiles (linked to Supabase Auth) ───────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin', 'dentist', 'patient')),
  clinic_id uuid references clinics(id),
  avatar text,
  created_at timestamptz default now()
);

-- ─── Dentists ─────────────────────────────────────────────────────────────────
create table if not exists dentists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  full_name text not null,
  specialization text not null,
  email text not null,
  phone text not null,
  clinic_id uuid references clinics(id),
  avatar text,
  created_at timestamptz default now()
);

-- ─── Dentist Schedules ────────────────────────────────────────────────────────
create table if not exists dentist_schedules (
  id uuid primary key default gen_random_uuid(),
  dentist_id uuid references dentists(id) on delete cascade,
  day text not null,
  start_time text not null,
  end_time text not null
);

-- ─── Patients ─────────────────────────────────────────────────────────────────
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  full_name text not null,
  date_of_birth date not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  phone text not null,
  email text not null,
  address text not null,
  blood_type text,
  allergies text[] default '{}',
  emergency_contact text not null,
  emergency_phone text not null,
  clinic_id uuid references clinics(id),
  registered_at timestamptz default now(),
  next_adjustment_date date
);

-- ─── Appointments ─────────────────────────────────────────────────────────────
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  dentist_id uuid references dentists(id),
  clinic_id uuid references clinics(id),
  date date not null,
  time text not null,
  type text not null,
  status text not null default 'pending' check (status in ('confirmed', 'pending', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz default now()
);

-- ─── Medical Records ──────────────────────────────────────────────────────────
create table if not exists medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  dentist_id uuid references dentists(id),
  clinic_id uuid references clinics(id),
  date date not null,
  procedure text not null,
  tooth text,
  notes text not null,
  diagnosis text not null,
  prescription text,
  next_visit date,
  images text[] default '{}',
  created_at timestamptz default now()
);

-- ─── Notifications ────────────────────────────────────────────────────────────
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('sms', 'email')),
  patient_id uuid references patients(id) on delete cascade,
  message text not null,
  sent_at timestamptz default now(),
  status text not null default 'pending' check (status in ('sent', 'pending', 'failed'))
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table clinics enable row level security;
alter table profiles enable row level security;
alter table dentists enable row level security;
alter table dentist_schedules enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table medical_records enable row level security;
alter table notifications enable row level security;

-- Allow authenticated users to read their clinic's data
create policy "Authenticated users can read clinics" on clinics
  for select to authenticated using (true);

create policy "Users can read own profile" on profiles
  for select to authenticated using (auth.uid() = id);

create policy "Authenticated users can read profiles" on profiles
  for select to authenticated using (true);

create policy "Authenticated users can read dentists" on dentists
  for select to authenticated using (true);

create policy "Authenticated users can read schedules" on dentist_schedules
  for select to authenticated using (true);

create policy "Authenticated users can read patients" on patients
  for select to authenticated using (true);

create policy "Authenticated users can manage patients" on patients
  for all to authenticated using (true);

create policy "Authenticated users can read appointments" on appointments
  for select to authenticated using (true);

create policy "Authenticated users can manage appointments" on appointments
  for all to authenticated using (true);

create policy "Authenticated users can read records" on medical_records
  for select to authenticated using (true);

create policy "Authenticated users can manage records" on medical_records
  for all to authenticated using (true);

create policy "Authenticated users can read notifications" on notifications
  for select to authenticated using (true);

create policy "Authenticated users can manage notifications" on notifications
  for all to authenticated using (true);

create policy "Authenticated users can manage dentists" on dentists
  for all to authenticated using (true);

create policy "Authenticated users can manage schedules" on dentist_schedules
  for all to authenticated using (true);
