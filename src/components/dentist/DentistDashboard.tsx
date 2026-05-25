'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, Calendar, FilePlus, ClipboardList } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import DentistOverview from './DentistOverview';
import DentistPatients from './DentistPatients';
import DentistAppointments from './DentistAppointments';
import DentistAddRecord from './DentistAddRecord';

const NAV = [
  { key: 'overview',     label: 'Overview',         icon: <LayoutDashboard size={17} /> },
  { key: 'schedule',     label: 'My Schedule',       icon: <Calendar size={17} /> },
  { key: 'patients',     label: 'Patient Records',   icon: <Users size={17} /> },
  { key: 'add-record',   label: 'Add Record',        icon: <FilePlus size={17} /> },
];

export default function DentistDashboard() {
  const [active, setActive] = useState('overview');
  return (
    <SidebarLayout nav={NAV} active={active} onNav={setActive} subtitle="Dentist Portal">
      {active === 'overview'   && <DentistOverview onNav={setActive} />}
      {active === 'schedule'   && <DentistAppointments />}
      {active === 'patients'   && <DentistPatients />}
      {active === 'add-record' && <DentistAddRecord />}
    </SidebarLayout>
  );
}
