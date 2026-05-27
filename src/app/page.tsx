'use client';

import { useAuth } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DentistDashboard from '@/components/dentist/DentistDashboard';
import PatientDashboard from '@/components/patient/PatientDashboard';

export default function Home() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!role) return <LandingPage />;
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'dentist') return <DentistDashboard />;
  if (role === 'patient') return <PatientDashboard />;
  return <LandingPage />;
}
