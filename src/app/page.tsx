'use client';

import { useAuth } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DentistDashboard from '@/components/dentist/DentistDashboard';
import PatientDashboard from '@/components/patient/PatientDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import StaffWalkthrough from '@/components/StaffWalkthrough';
import Paywall from '@/components/Paywall';

export default function Home() {
  const { role, loading, needsOnboarding, paidActive } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!role) return <LandingPage />;

  // No free trial: a clinic must have an active paid subscription to use the
  // app. Everyone in an unpaid clinic hits the paywall — the admin pays there,
  // other roles are told the clinic isn't active yet.
  if (!paidActive) return <Paywall />;

  // First-time staff then complete a one-time product walkthrough before
  // reaching the dashboard. Patients skip this.
  if (needsOnboarding) return <StaffWalkthrough />;

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'dentist') return <DentistDashboard />;
  if (role === 'patient') return <PatientDashboard />;
  return <LandingPage />;
}
