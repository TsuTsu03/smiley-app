'use client';

import { useAuth } from '@/lib/auth';
import { Calendar, Users, CheckCircle2, Clock } from 'lucide-react';
import { StatCard, Card, Badge, SectionHeader, Btn } from '@/components/ui';
import {
  MOCK_DENTISTS, MOCK_APPOINTMENTS, MOCK_RECORDS,
  getPatientById, fmtDate
} from '@/lib/data';

export default function DentistOverview({ onNav }: { onNav: (k: string) => void }) {
  const { user } = useAuth();
  const cid      = user?.clinicId;
  // In demo, show all clinic appointments (dentist-specific filtering requires Phase 1 auth)
  const myApts    = MOCK_APPOINTMENTS.filter(a => a.clinicId === cid);
  const dentist   = MOCK_DENTISTS.filter(d => d.clinicId === cid)[0]; // first dentist for schedule display
  const today     = new Date().toISOString().split('T')[0];
  const todayApts = myApts.filter(a => a.date === today);
  const upcoming  = myApts.filter(a => a.date > today && (a.status === 'confirmed' || a.status === 'pending'));
  const myPatients = Array.from(new Set(myApts.map(a => a.patientId)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-sky-900">Welcome, {dentist?.fullName} 👋</h1>
        <p className="text-sky-500 text-sm mt-1">{dentist?.specialization} · {fmtDate(today)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Calendar size={20} />} label="Today" value={todayApts.length} sub="Appointments" />
        <StatCard icon={<Clock size={20} />} label="Upcoming" value={upcoming.length} sub="Confirmed + pending" color="mint" />
        <StatCard icon={<Users size={20} />} label="My Patients" value={myPatients.length} sub="Total" color="amber" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed" value={myApts.filter(a => a.status === 'completed').length} sub="All time" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today */}
        <Card className="p-5">
          <SectionHeader title="Today's Patients" sub={`${todayApts.length} scheduled`} action={<Btn variant="ghost" size="sm" onClick={() => onNav('schedule')}>Full Schedule</Btn>} />
          {todayApts.length === 0 ? (
            <div className="text-center py-10 text-sky-300 text-sm">No patients today</div>
          ) : (
            <div className="space-y-3">
              {todayApts.map(apt => {
                const patient = getPatientById(apt.patientId);
                return (
                  <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/50 border border-sky-50">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {patient?.fullName.split(' ').map(n=>n[0]).slice(0,2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sky-800 text-sm">{patient?.fullName}</div>
                      <div className="text-xs text-sky-500">{apt.time} · {apt.type}</div>
                    </div>
                    <Badge status={apt.status} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* My Schedule */}
        <Card className="p-5">
          <SectionHeader title="My Schedule" sub="Weekly availability" />
          <div className="space-y-2">
            {dentist?.schedule.map(s => (
              <div key={s.day} className="flex items-center justify-between p-3 bg-sky-50 rounded-xl">
                <span className="font-medium text-sky-800 text-sm">{s.day}</span>
                <span className="text-sky-500 text-xs">{s.startTime} – {s.endTime}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Card className="p-5">
          <SectionHeader title="Upcoming Appointments" sub={`${upcoming.length} scheduled`} />

          {/* Mobile card list (< md) */}
          <div className="md:hidden space-y-2">
            {upcoming.slice(0, 8).map(apt => {
              const patient = getPatientById(apt.patientId);
              return (
                <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/40 border border-sky-50">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {patient?.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sky-800 text-sm truncate">{patient?.fullName}</div>
                    <div className="text-xs text-sky-500">{apt.type}</div>
                    <div className="text-xs text-sky-600 font-medium">{fmtDate(apt.date)} · {apt.time}</div>
                  </div>
                  <Badge status={apt.status} />
                </div>
              );
            })}
          </div>

          {/* Desktop table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-50">
                  {['Date', 'Time', 'Patient', 'Procedure', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-sky-400 uppercase tracking-wide px-3 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {upcoming.slice(0, 8).map(apt => {
                  const patient = getPatientById(apt.patientId);
                  return (
                    <tr key={apt.id} className="border-b border-sky-50/80 hover:bg-sky-50/30">
                      <td className="px-3 py-2.5 font-medium text-sky-800">{fmtDate(apt.date)}</td>
                      <td className="px-3 py-2.5 text-sky-600">{apt.time}</td>
                      <td className="px-3 py-2.5 font-medium text-sky-800">{patient?.fullName}</td>
                      <td className="px-3 py-2.5 text-sky-500">{apt.type}</td>
                      <td className="px-3 py-2.5"><Badge status={apt.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
