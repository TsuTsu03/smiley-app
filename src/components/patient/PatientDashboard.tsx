'use client';

import { useState } from 'react';
import { LayoutDashboard, FileText, Calendar } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import PatientOverview from './PatientOverview';
import PatientRecords from './PatientRecords';
import PatientBook from './PatientBook';
import PatientChatbot from './PatientChatbot';

const NAV = [
  { key: 'overview', label: 'My Health',       icon: <LayoutDashboard size={17} /> },
  { key: 'records',  label: 'My Records',       icon: <FileText size={17} /> },
  { key: 'book',     label: 'Book Appointment', icon: <Calendar size={17} /> },
];

export default function PatientDashboard() {
  const [active, setActive] = useState('overview');
  return (
    <>
      <SidebarLayout nav={NAV} active={active} onNav={setActive} subtitle="Patient Portal">
        {active === 'overview' && <PatientOverview onNav={setActive} />}
        {active === 'records'  && <PatientRecords />}
        {active === 'book'     && <PatientBook />}
      </SidebarLayout>
      <PatientChatbot />
    </>
  );
}
