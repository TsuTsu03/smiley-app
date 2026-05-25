'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, Calendar, Bell, UserPlus, Stethoscope, Settings } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import AdminOverview from './AdminOverview';
import AdminPatients from './AdminPatients';
import AdminAppointments from './AdminAppointments';
import AdminReminders from './AdminReminders';
import AdminDentists from './AdminDentists';
import AdminRegisterPatient from './AdminRegisterPatient';

const NAV = [
  { key: 'overview',         label: 'Overview',           icon: <LayoutDashboard size={17} /> },
  { key: 'appointments',     label: 'Appointments',        icon: <Calendar size={17} /> },
  { key: 'patients',         label: 'Patients',            icon: <Users size={17} /> },
  { key: 'register-patient', label: 'Register Patient',    icon: <UserPlus size={17} /> },
  { key: 'dentists',         label: 'Dentists & Schedule', icon: <Stethoscope size={17} /> },
  { key: 'reminders',        label: 'Reminders',           icon: <Bell size={17} /> },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');

  return (
    <SidebarLayout nav={NAV} active={active} onNav={setActive} subtitle="Admin Portal">
      {active === 'overview'         && <AdminOverview onNav={setActive} />}
      {active === 'appointments'     && <AdminAppointments />}
      {active === 'patients'         && <AdminPatients />}
      {active === 'register-patient' && <AdminRegisterPatient />}
      {active === 'dentists'         && <AdminDentists />}
      {active === 'reminders'        && <AdminReminders />}
    </SidebarLayout>
  );
}
