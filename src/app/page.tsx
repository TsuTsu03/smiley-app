'use client';

import { useAuth } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DentistDashboard from '@/components/dentist/DentistDashboard';
import PatientDashboard from '@/components/patient/PatientDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import StaffWalkthrough from '@/components/StaffWalkthrough';

export default function Home() {
  const { role, loading, needsOnboarding } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!role) return <LandingPage />;

  // Signed-in users go straight to their role's dashboard; the plan picker no
  // longer blocks access. First-time staff complete a one-time product walkthrough before
  // reaching the dashboard. Patients skip this.
  if (needsOnboarding) return <StaffWalkthrough />;

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'dentist') return <DentistDashboard />;
  if (role === 'patient') return <PatientDashboard />;
  return <LandingPage />;
}
