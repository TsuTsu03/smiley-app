'use client';

import { useAuth } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DentistDashboard from '@/components/dentist/DentistDashboard';
import PatientDashboard from '@/components/patient/PatientDashboard';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const { role, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!role) return <LandingPage />;
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'dentist') return <DentistDashboard />;
  if (role === 'patient') return <PatientDashboard />;
  return <LandingPage />;
}
