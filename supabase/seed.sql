-- ─── Seed Clinic ──────────────────────────────────────────────────────────────
insert into clinics (id, name, slug, address, phone, email) values
  ('00000000-0000-0000-0000-000000000001', 'BrightSmile Dental Clinic', 'brightsmile', '123 Mabini St., Makati City', '(02) 8123-4567', 'hello@brightsmile.com')
on conflict (id) do nothing;

-- ─── Seed Dentists ────────────────────────────────────────────────────────────
insert into dentists (id, full_name, specialization, email, phone, clinic_id) values
  ('00000000-0000-0000-0001-000000000001', 'Dr. Maria Santos', 'General Dentistry & Orthodontics', 'maria@brightsmile.com', '0917-123-4567', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000002', 'Dr. Jose Reyes', 'Oral Surgery & Implantology', 'jose@brightsmile.com', '0918-765-4321', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000003', 'Dr. Ana Cruz', 'Pediatric Dentistry', 'ana@brightsmile.com', '0919-222-3333', '00000000-0000-0000-0000-000000000001')
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
