// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = 'admin' | 'dentist' | 'patient';

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  clinicId: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  bloodType?: string;
  allergies: string[];
  emergencyContact: string;
  emergencyPhone: string;
  clinicId: string;
  registeredAt: string;
  nextAdjustmentDate?: string;
}

export interface Dentist {
  id: string;
  fullName: string;
  specialization: string;
  email: string;
  phone: string;
  clinicId: string;
  schedule: DaySchedule[];
  avatar?: string;
}

export interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  clinicId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  dentistId: string;
  clinicId: string;
  date: string;
  procedure: string;
  tooth?: string;
  notes: string;
  diagnosis: string;
  prescription?: string;
  nextVisit?: string;
  images?: string[];
}

export interface Notification {
  id: string;
  type: 'sms' | 'email';
  patientId: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
}

// ─── Mock Clinic ────────────────────────────────────────────────────────────

export const MOCK_CLINIC: Clinic = {
  id: 'clinic-1',
  name: 'BrightSmile Dental Clinic',
  slug: 'brightsmile',
  address: '123 Mabini St., Makati City',
  phone: '(02) 8123-4567',
  email: 'hello@brightsmile.com',
};

// ─── Mock Dentists ───────────────────────────────────────────────────────────

export const MOCK_DENTISTS: Dentist[] = [
  {
    id: 'dent-1',
    fullName: 'Dr. Maria Santos',
    specialization: 'General Dentistry & Orthodontics',
    email: 'maria@brightsmile.com',
    phone: '0917-123-4567',
    clinicId: 'clinic-1',
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '14:00' },
    ],
  },
  {
    id: 'dent-2',
    fullName: 'Dr. Jose Reyes',
    specialization: 'Oral Surgery & Implantology',
    email: 'jose@brightsmile.com',
    phone: '0918-765-4321',
    clinicId: 'clinic-1',
    schedule: [
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00' },
    ],
  },
  {
    id: 'dent-3',
    fullName: 'Dr. Ana Cruz',
    specialization: 'Pediatric Dentistry',
    email: 'ana@brightsmile.com',
    phone: '0919-222-3333',
    clinicId: 'clinic-1',
    schedule: [
      { day: 'Monday', startTime: '13:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '13:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '15:00' },
    ],
  },
];

// ─── Mock Patients ───────────────────────────────────────────────────────────

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    fullName: 'Juan dela Cruz',
    dateOfBirth: '1990-03-15',
    gender: 'male',
    phone: '0920-111-2222',
    email: 'juan@example.com',
    address: 'Quezon City',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    emergencyContact: 'Maria dela Cruz',
    emergencyPhone: '0920-333-4444',
    clinicId: 'clinic-1',
    registeredAt: '2023-01-10',
    nextAdjustmentDate: '2026-05-28',
  },
  {
    id: 'pat-2',
    fullName: 'Rosa Magtanggol',
    dateOfBirth: '1985-07-22',
    gender: 'female',
    phone: '0921-555-6666',
    email: 'rosa@example.com',
    address: 'Pasig City',
    bloodType: 'A+',
    allergies: [],
    emergencyContact: 'Pedro Magtanggol',
    emergencyPhone: '0921-777-8888',
    clinicId: 'clinic-1',
    registeredAt: '2023-03-05',
    nextAdjustmentDate: '2026-05-30',
  },
  {
    id: 'pat-3',
    fullName: 'Carlos Bautista',
    dateOfBirth: '2000-11-08',
    gender: 'male',
    phone: '0922-999-0000',
    email: 'carlos@example.com',
    address: 'Mandaluyong City',
    bloodType: 'B+',
    allergies: ['Latex', 'Ibuprofen'],
    emergencyContact: 'Luz Bautista',
    emergencyPhone: '0922-111-0000',
    clinicId: 'clinic-1',
    registeredAt: '2024-06-20',
    nextAdjustmentDate: '2026-06-10',
  },
  {
    id: 'pat-4',
    fullName: 'Liza Montano',
    dateOfBirth: '1995-04-30',
    gender: 'female',
    phone: '0923-222-3333',
    email: 'liza@example.com',
    address: 'Taguig City',
    bloodType: 'AB+',
    allergies: [],
    emergencyContact: 'Tony Montano',
    emergencyPhone: '0923-444-5555',
    clinicId: 'clinic-1',
    registeredAt: '2024-09-14',
    nextAdjustmentDate: '2026-06-03',
  },
];

// ─── Mock Appointments ───────────────────────────────────────────────────────

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'apt-1', patientId: 'pat-1', dentistId: 'dent-1', clinicId: 'clinic-1', date: '2026-05-21', time: '09:00', type: 'Orthodontic Adjustment', status: 'confirmed', notes: 'Monthly wire tightening', createdAt: '2026-05-10' },
  { id: 'apt-2', patientId: 'pat-2', dentistId: 'dent-1', clinicId: 'clinic-1', date: '2026-05-21', time: '10:30', type: 'Cleaning', status: 'confirmed', createdAt: '2026-05-12' },
  { id: 'apt-3', patientId: 'pat-3', dentistId: 'dent-2', clinicId: 'clinic-1', date: '2026-05-22', time: '11:00', type: 'Tooth Extraction', status: 'pending', createdAt: '2026-05-15' },
  { id: 'apt-4', patientId: 'pat-4', dentistId: 'dent-2', clinicId: 'clinic-1', date: '2026-05-22', time: '14:00', type: 'Consultation', status: 'confirmed', createdAt: '2026-05-14' },
  { id: 'apt-5', patientId: 'pat-1', dentistId: 'dent-1', clinicId: 'clinic-1', date: '2026-05-28', time: '09:00', type: 'Orthodontic Adjustment', status: 'pending', createdAt: '2026-05-21' },
  { id: 'apt-6', patientId: 'pat-3', dentistId: 'dent-3', clinicId: 'clinic-1', date: '2026-05-24', time: '13:00', type: 'Fluoride Treatment', status: 'confirmed', createdAt: '2026-05-16' },
  { id: 'apt-7', patientId: 'pat-2', dentistId: 'dent-1', clinicId: 'clinic-1', date: '2026-04-10', time: '09:30', type: 'Orthodontic Adjustment', status: 'completed', notes: 'Completed successfully', createdAt: '2026-04-01' },
  { id: 'apt-8', patientId: 'pat-1', dentistId: 'dent-1', clinicId: 'clinic-1', date: '2026-04-05', time: '10:00', type: 'Cleaning', status: 'completed', createdAt: '2026-03-28' },
];

// ─── Mock Medical Records ────────────────────────────────────────────────────

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    patientId: 'pat-1',
    dentistId: 'dent-1',
    clinicId: 'clinic-1',
    date: '2026-04-05',
    procedure: 'Prophylaxis (Teeth Cleaning)',
    tooth: 'Full mouth',
    notes: 'Heavy tartar buildup noted in lower anteriors. Patient advised to improve flossing habits.',
    diagnosis: 'Mild gingivitis, Grade II plaque accumulation',
    prescription: 'Chlorhexidine mouthwash 0.12% twice daily for 2 weeks',
    nextVisit: '2026-07-05',
  },
  {
    id: 'rec-2',
    patientId: 'pat-1',
    dentistId: 'dent-1',
    clinicId: 'clinic-1',
    date: '2026-01-10',
    procedure: 'Orthodontic Adjustment',
    tooth: 'Full arch',
    notes: 'Tightened upper and lower archwires. Good progress noted.',
    diagnosis: 'Active orthodontic treatment - month 8',
    nextVisit: '2026-04-10',
  },
  {
    id: 'rec-3',
    patientId: 'pat-2',
    dentistId: 'dent-1',
    clinicId: 'clinic-1',
    date: '2026-04-10',
    procedure: 'Orthodontic Adjustment',
    tooth: 'Full arch',
    notes: 'Replaced upper wire. Patient reports slight discomfort.',
    diagnosis: 'Active orthodontic treatment - month 5',
    prescription: 'Ibuprofen 400mg PRN for discomfort',
    nextVisit: '2026-07-10',
  },
  {
    id: 'rec-4',
    patientId: 'pat-3',
    dentistId: 'dent-2',
    clinicId: 'clinic-1',
    date: '2026-03-15',
    procedure: 'Tooth Extraction',
    tooth: '#38 (Lower Left Wisdom Tooth)',
    notes: 'Surgical extraction performed under local anesthesia. No complications.',
    diagnosis: 'Impacted mandibular third molar',
    prescription: 'Amoxicillin 500mg TID x 5 days, Mefenamic Acid 500mg TID PRN',
    nextVisit: '2026-03-22',
  },
  {
    id: 'rec-5',
    patientId: 'pat-4',
    dentistId: 'dent-2',
    clinicId: 'clinic-1',
    date: '2026-02-20',
    procedure: 'Composite Filling',
    tooth: '#16 (Upper Right First Molar)',
    notes: 'Tooth-colored composite restoration placed. Patient satisfied with aesthetics.',
    diagnosis: 'Class II caries, dentin involvement',
    nextVisit: '2026-08-20',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPatientById(id: string) {
  return MOCK_PATIENTS.find(p => p.id === id);
}

export function getDentistById(id: string) {
  return MOCK_DENTISTS.find(d => d.id === id);
}

export function getAppointmentsForPatient(patientId: string) {
  return MOCK_APPOINTMENTS.filter(a => a.patientId === patientId);
}

export function getAppointmentsForDentist(dentistId: string) {
  return MOCK_APPOINTMENTS.filter(a => a.dentistId === dentistId);
}

export function getRecordsForPatient(patientId: string) {
  return MOCK_RECORDS.filter(r => r.patientId === patientId);
}

export function getUpcomingAdjustments(daysAhead = 14) {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);
  return MOCK_PATIENTS.filter(p => {
    if (!p.nextAdjustmentDate) return false;
    const d = new Date(p.nextAdjustmentDate);
    return d >= now && d <= future;
  });
}

export function calcAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  return age;
}

export function fmtDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function fmtShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const PROCEDURE_TYPES = [
  'Consultation',
  'Teeth Cleaning (Prophylaxis)',
  'Tooth Extraction',
  'Composite Filling',
  'Root Canal Treatment',
  'Dental Crown',
  'Dental Bridge',
  'Denture Fitting',
  'Orthodontic Adjustment',
  'Orthodontic Consultation',
  'Teeth Whitening',
  'Fluoride Treatment',
  'X-Ray',
  'Dental Implant',
  'Oral Surgery',
  'Pediatric Checkup',
  'Emergency Treatment',
];
