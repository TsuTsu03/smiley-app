-- ══════════════════════════════════════════════════════════════════════════════
-- DEMO AUTH USERS  (run in Supabase SQL Editor with service role)
-- BrightSmile:  admin@brightsmile.com / admin123
--               maria@brightsmile.com / dentist123
--               (patients log in with name + DOB — no auth user needed)
-- ══════════════════════════════════════════════════════════════════════════════
insert into auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, email_change, email_change_token_new, recovery_token,
  aud, role, is_super_admin
) values
  ('00000000-0000-0000-0006-000000000001','00000000-0000-0000-0000-000000000000','admin@brightsmile.com', crypt('admin123',   gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, '', '', '', '', 'authenticated', 'authenticated', false),
  ('00000000-0000-0000-0006-000000000002','00000000-0000-0000-0000-000000000000','maria@brightsmile.com', crypt('dentist123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, '', '', '', '', 'authenticated', 'authenticated', false)
on conflict (id) do nothing;

-- ─── Profiles for BrightSmile ─────────────────────────────────────────────────
-- (inserted before the clinic row via deferred FK — or insert clinic first below)

-- ─── Seed Clinic ──────────────────────────────────────────────────────────────
insert into clinics (id, name, slug, address, phone, email) values
  ('00000000-0000-0000-0000-000000000001', 'BrightSmile Dental Clinic', 'brightsmile', '123 Mabini St., Makati City', '(02) 8123-4567', 'hello@brightsmile.com')
on conflict (id) do nothing;

insert into profiles (id, full_name, email, role, clinic_id) values
  ('00000000-0000-0000-0006-000000000001', 'Admin BrightSmile',  'admin@brightsmile.com', 'admin',   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0006-000000000002', 'Dr. Maria Santos',   'maria@brightsmile.com', 'dentist', '00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- ─── Seed Dentists ────────────────────────────────────────────────────────────
insert into dentists (id, profile_id, full_name, specialization, email, phone, clinic_id) values
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0006-000000000002', 'Dr. Maria Santos', 'General Dentistry & Orthodontics', 'maria@brightsmile.com', '0917-123-4567', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000002', null,                                   'Dr. Jose Reyes',   'Oral Surgery & Implantology',       'jose@brightsmile.com',  '0918-765-4321', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000003', null,                                   'Dr. Ana Cruz',     'Pediatric Dentistry',               'ana@brightsmile.com',   '0919-222-3333', '00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- ─── Seed Dentist Schedules ───────────────────────────────────────────────────
insert into dentist_schedules (dentist_id, day, start_time, end_time) values
  ('00000000-0000-0000-0001-000000000001', 'Monday', '09:00', '17:00'),
  ('00000000-0000-0000-0001-000000000001', 'Wednesday', '09:00', '17:00'),
  ('00000000-0000-0000-0001-000000000001', 'Friday', '09:00', '14:00'),
  ('00000000-0000-0000-0001-000000000002', 'Tuesday', '10:00', '18:00'),
  ('00000000-0000-0000-0001-000000000002', 'Thursday', '10:00', '18:00'),
  ('00000000-0000-0000-0001-000000000002', 'Saturday', '09:00', '13:00'),
  ('00000000-0000-0000-0001-000000000003', 'Monday', '13:00', '18:00'),
  ('00000000-0000-0000-0001-000000000003', 'Wednesday', '13:00', '18:00'),
  ('00000000-0000-0000-0001-000000000003', 'Saturday', '10:00', '15:00');

-- ─── Seed Patients ────────────────────────────────────────────────────────────
insert into patients (id, full_name, date_of_birth, gender, phone, email, address, blood_type, allergies, emergency_contact, emergency_phone, clinic_id, next_adjustment_date) values
  ('00000000-0000-0000-0002-000000000001', 'Juan dela Cruz', '1990-03-15', 'male', '0920-111-2222', 'juan@example.com', 'Quezon City', 'O+', '{"Penicillin"}', 'Maria dela Cruz', '0920-333-4444', '00000000-0000-0000-0000-000000000001', '2026-05-28'),
  ('00000000-0000-0000-0002-000000000002', 'Rosa Magtanggol', '1985-07-22', 'female', '0921-555-6666', 'rosa@example.com', 'Pasig City', 'A+', '{}', 'Pedro Magtanggol', '0921-777-8888', '00000000-0000-0000-0000-000000000001', '2026-05-30'),
  ('00000000-0000-0000-0002-000000000003', 'Carlos Bautista', '2000-11-08', 'male', '0922-999-0000', 'carlos@example.com', 'Mandaluyong City', 'B+', '{"Latex","Ibuprofen"}', 'Luz Bautista', '0922-111-0000', '00000000-0000-0000-0000-000000000001', '2026-06-10'),
  ('00000000-0000-0000-0002-000000000004', 'Liza Montano', '1995-04-30', 'female', '0923-222-3333', 'liza@example.com', 'Taguig City', 'AB+', '{}', 'Tony Montano', '0923-444-5555', '00000000-0000-0000-0000-000000000001', '2026-06-03')
on conflict (id) do nothing;

-- ─── Seed Appointments ────────────────────────────────────────────────────────
insert into appointments (id, patient_id, dentist_id, clinic_id, date, time, type, status, notes) values
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-05-21', '09:00', 'Orthodontic Adjustment', 'confirmed', 'Monthly wire tightening'),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-05-21', '10:30', 'Cleaning', 'confirmed', null),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', '2026-05-22', '11:00', 'Tooth Extraction', 'pending', null),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', '2026-05-22', '14:00', 'Consultation', 'confirmed', null),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-05-28', '09:00', 'Orthodontic Adjustment', 'pending', null),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', '2026-05-24', '13:00', 'Fluoride Treatment', 'confirmed', null),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-04-10', '09:30', 'Orthodontic Adjustment', 'completed', 'Completed successfully'),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-04-05', '10:00', 'Cleaning', 'completed', null)
on conflict (id) do nothing;

-- ─── Seed Medical Records ─────────────────────────────────────────────────────
insert into medical_records (id, patient_id, dentist_id, clinic_id, date, procedure, tooth, notes, diagnosis, prescription, next_visit) values
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-04-05', 'Prophylaxis (Teeth Cleaning)', 'Full mouth', 'Heavy tartar buildup noted in lower anteriors. Patient advised to improve flossing habits.', 'Mild gingivitis, Grade II plaque accumulation', 'Chlorhexidine mouthwash 0.12% twice daily for 2 weeks', '2026-07-05'),
  ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-01-10', 'Orthodontic Adjustment', 'Full arch', 'Tightened upper and lower archwires. Good progress noted.', 'Active orthodontic treatment - month 8', null, '2026-04-10'),
  ('00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', '2026-04-10', 'Orthodontic Adjustment', 'Full arch', 'Replaced upper wire. Patient reports slight discomfort.', 'Active orthodontic treatment - month 5', 'Ibuprofen 400mg PRN for discomfort', '2026-07-10'),
  ('00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', '2026-03-15', 'Tooth Extraction', '#38 (Lower Left Wisdom Tooth)', 'Surgical extraction performed under local anesthesia. No complications.', 'Impacted mandibular third molar', 'Amoxicillin 500mg TID x 5 days, Mefenamic Acid 500mg TID PRN', '2026-03-22'),
  ('00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', '2026-02-20', 'Composite Filling', '#16 (Upper Right First Molar)', 'Tooth-colored composite restoration placed. Patient satisfied with aesthetics.', 'Class II caries, dentin involvement', null, '2026-08-20')
on conflict (id) do nothing;

-- ══════════════════════════════════════════════════════════════════════════════
-- CLINIC 2 — PearlWhite Dental Center (Cebu City)
-- Demo credentials:
--   Admin   : ramon@pearlwhite.com  / admin123
--   Dentist : sofia@pearlwhite.com  / dentist123
--   Dentist : mark@pearlwhite.com   / dentist123
--   Patient : Marisol Fernandez     / 1988-05-20
-- Auth users must be created in Supabase Dashboard (Auth > Users) using the
-- emails above with password "admin123" / "dentist123", then their UUIDs
-- updated below to match what Supabase assigns.
-- For convenience, fixed UUIDs are pre-set here — create the users with these
-- exact IDs via the service-role API or update after manual creation.
-- ══════════════════════════════════════════════════════════════════════════════

-- Auth users for PearlWhite (run with service role / pgcrypto enabled)
insert into auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, email_change, email_change_token_new, recovery_token,
  aud, role, is_super_admin
) values
  ('00000000-0000-0000-0005-000000000001','00000000-0000-0000-0000-000000000000','ramon@pearlwhite.com', crypt('admin123',   gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, '', '', '', '', 'authenticated', 'authenticated', false),
  ('00000000-0000-0000-0005-000000000002','00000000-0000-0000-0000-000000000000','sofia@pearlwhite.com', crypt('dentist123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, '', '', '', '', 'authenticated', 'authenticated', false),
  ('00000000-0000-0000-0005-000000000003','00000000-0000-0000-0000-000000000000','mark@pearlwhite.com',  crypt('dentist123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, '', '', '', '', 'authenticated', 'authenticated', false)
on conflict (id) do nothing;

-- ─── Clinic 2 ─────────────────────────────────────────────────────────────────
insert into clinics (id, name, slug, address, phone, email) values
  ('00000000-0000-0000-0000-000000000002', 'PearlWhite Dental Center', 'pearlwhite', '88 Osmeña Blvd., Cebu City', '(032) 255-8899', 'hello@pearlwhite.com')
on conflict (id) do nothing;

-- ─── Profiles for PearlWhite ──────────────────────────────────────────────────
insert into profiles (id, full_name, email, role, clinic_id) values
  ('00000000-0000-0000-0005-000000000001', 'Dr. Ramon Delgado',    'ramon@pearlwhite.com', 'admin',   '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0005-000000000002', 'Dr. Sofia Villanueva', 'sofia@pearlwhite.com', 'dentist', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0005-000000000003', 'Dr. Mark Torres',      'mark@pearlwhite.com',  'dentist', '00000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

-- ─── Dentists for PearlWhite ──────────────────────────────────────────────────
insert into dentists (id, profile_id, full_name, specialization, email, phone, clinic_id) values
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0005-000000000002', 'Dr. Sofia Villanueva', 'Cosmetic Dentistry & Veneers',  'sofia@pearlwhite.com', '0932-100-2000', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0005-000000000003', 'Dr. Mark Torres',      'Endodontics & Root Canal',       'mark@pearlwhite.com',  '0933-300-4000', '00000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

-- ─── Dentist Schedules for PearlWhite ─────────────────────────────────────────
insert into dentist_schedules (dentist_id, day, start_time, end_time) values
  ('00000000-0000-0000-0001-000000000004', 'Monday',    '08:00', '16:00'),
  ('00000000-0000-0000-0001-000000000004', 'Wednesday', '08:00', '16:00'),
  ('00000000-0000-0000-0001-000000000004', 'Friday',    '08:00', '13:00'),
  ('00000000-0000-0000-0001-000000000005', 'Tuesday',   '09:00', '17:00'),
  ('00000000-0000-0000-0001-000000000005', 'Thursday',  '09:00', '17:00'),
  ('00000000-0000-0000-0001-000000000005', 'Saturday',  '08:00', '12:00');

-- ─── Patients for PearlWhite ──────────────────────────────────────────────────
insert into patients (id, full_name, date_of_birth, gender, phone, email, address, blood_type, allergies, emergency_contact, emergency_phone, clinic_id, next_adjustment_date) values
  ('00000000-0000-0000-0002-000000000005', 'Marisol Fernandez', '1988-05-20', 'female', '0932-111-2222', 'marisol@example.com', 'Cebu City',      'A+',  '{}',             'Roberto Fernandez', '0932-333-4444', '00000000-0000-0000-0000-000000000002', '2026-06-05'),
  ('00000000-0000-0000-0002-000000000006', 'Andrei Pascual',    '1993-09-14', 'male',   '0933-555-6666', 'andrei@example.com',  'Mandaue City',   'B+',  '{"Aspirin"}',    'Clara Pascual',     '0933-777-8888', '00000000-0000-0000-0000-000000000002', null),
  ('00000000-0000-0000-0002-000000000007', 'Cynthia Garcia',    '1979-02-28', 'female', '0934-999-0000', 'cynthia@example.com', 'Lapu-Lapu City', 'O-',  '{}',             'Noel Garcia',       '0934-111-2222', '00000000-0000-0000-0000-000000000002', '2026-06-18'),
  ('00000000-0000-0000-0002-000000000008', 'Ben Ramos',         '2001-12-03', 'male',   '0935-333-4444', 'ben@example.com',     'Talisay City',   'AB+', '{"Penicillin"}', 'Gloria Ramos',      '0935-555-6666', '00000000-0000-0000-0000-000000000002', null)
on conflict (id) do nothing;

-- ─── Appointments for PearlWhite ──────────────────────────────────────────────
insert into appointments (id, patient_id, dentist_id, clinic_id, date, time, type, status, notes) values
  ('00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', '2026-05-26', '08:30', 'Veneer Consultation',       'confirmed', 'Initial consult for upper 6 veneers'),
  ('00000000-0000-0000-0003-000000000010', '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000002', '2026-05-27', '10:00', 'Root Canal Treatment',      'pending',   null),
  ('00000000-0000-0000-0003-000000000011', '00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', '2026-05-28', '09:00', 'Teeth Whitening',           'confirmed', null),
  ('00000000-0000-0000-0003-000000000012', '00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000002', '2026-05-29', '11:00', 'Consultation',              'confirmed', null),
  ('00000000-0000-0000-0003-000000000013', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', '2026-06-05', '08:30', 'Orthodontic Adjustment',    'pending',   null),
  ('00000000-0000-0000-0003-000000000014', '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000002', '2026-04-15', '10:00', 'Root Canal Treatment',      'completed', 'First session completed'),
  ('00000000-0000-0000-0003-000000000015', '00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', '2026-03-20', '09:00', 'Composite Filling',         'completed', null)
on conflict (id) do nothing;

-- ─── Medical Records for PearlWhite ───────────────────────────────────────────
insert into medical_records (id, patient_id, dentist_id, clinic_id, date, procedure, tooth, notes, diagnosis, prescription, next_visit) values
  ('00000000-0000-0000-0004-000000000006', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', '2026-03-10', 'Orthodontic Consultation', 'Full arch',              'Patient interested in ceramic braces. Photos and X-rays taken.', 'Mild crowding upper anterior, suitable for orthodontic treatment', null, '2026-06-05'),
  ('00000000-0000-0000-0004-000000000007', '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000002', '2026-04-15', 'Root Canal Treatment',     '#26 (Upper Left First Molar)', 'Pulp extirpation completed. Canal preparation and irrigation done.', 'Irreversible pulpitis, periapical abscess', 'Amoxicillin 500mg TID x 5 days, Mefenamic Acid 500mg PRN', '2026-05-27'),
  ('00000000-0000-0000-0004-000000000008', '00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000002', '2026-03-20', 'Composite Filling',        '#21 (Upper Left Central Incisor)', 'Tooth-colored composite placed. Shade matched perfectly.', 'Class IV fracture, enamel-dentin involvement', null, '2026-09-20'),
  ('00000000-0000-0000-0004-000000000009', '00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000002', '2026-02-05', 'Dental X-Ray',             'Full mouth', 'Panoramic radiograph taken. No significant pathology detected.', 'Routine radiographic screening — WNL', null, '2026-08-05')
on conflict (id) do nothing;
