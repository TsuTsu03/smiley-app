'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar, Bell, Clock, AlertCircle } from 'lucide-react';
import { StatCard, Card, Badge, SectionHeader, Btn } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fmtDate, fmtShortDate } from '@/lib/data';

export default function AdminOverview({ onNav }: { onNav: (k: string) => void }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients]         = useState<any[]>([]);
  const [dentists, setDentists]         = useState<any[]>([]);

  useEffect(() => {
    if (!user?.clinicId) return;
    Promise.all([
      fetch(`/api/appointments?clinicId=${user.clinicId}`).then(r => r.json()),
      fetch(`/api/patients?clinicId=${user.clinicId}`).then(r => r.json()),
      fetch(`/api/dentists?clinicId=${user.clinicId}`).then(r => r.json()),
    ]).then(([a, p, d]) => {
      setAppointments(Array.isArray(a) ? a : []);
      setPatients(Array.isArray(p) ? p : []);
      setDentists(Array.isArray(d) ? d : []);
    });
  }, [user?.clinicId]);

  const today = new Date().toISOString().split('T')[0];
  const todayApts   = appointments.filter(a => a.date === today);
  const upcoming    = appointments.filter(a => a.date > today && a.status !== 'cancelled');

  // Patients needing adjustment within 14 days
  const now    = new Date();
  const future = new Date();
  future.setDate(future.getDate() + 14);
  const upcomingAdj = patients.filter(p => {
    if (!p.nextAdjustmentDate) return false;
    const d = new Date(p.nextAdjustmentDate);
    return d >= now && d <= future;
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-sky-900">Good morning 👋</h1>
        <p className="text-sky-500 text-sm mt-1">{fmtDate(today)} — Here&apos;s your clinic at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20} />}     label="Total Patients"      value={patients.length}       sub="Registered" />
        <StatCard icon={<Calendar size={20} />}  label="Today's Appts"       value={todayApts.length}      sub="Scheduled today" color="mint" />
        <StatCard icon={<Clock size={20} />}     label="Upcoming"            value={upcoming.length}       sub="Next 7 days"  color="amber" />
        <StatCard icon={<Bell size={20} />}      label="Adjustments Due"     value={upcomingAdj.length}    sub="Within 14 days" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <Card className="p-5">
          <SectionHeader
            title="Today's Schedule"
            sub={`${today} — ${todayApts.length} appointment${todayApts.length !== 1 ? 's' : ''}`}
            action={<Btn variant="ghost" size="sm" onClick={() => onNav('appointments')}>View All</Btn>}
          />
          {todayApts.length === 0 ? (
            <div className="text-center py-10 text-sky-300 text-sm">No appointments today</div>
          ) : (
            <div className="space-y-3">
              {todayApts.map(apt => (
                <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/50 border border-sky-50">
                  <div className="w-12 text-center">
                    <div className="text-xs font-bold text-sky-700">{apt.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sky-800 text-sm truncate">{apt.patientName}</div>
                    <div className="text-xs text-sky-500 truncate">{apt.type} · {apt.dentistName}</div>
                  </div>
                  <Badge status={apt.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Dentists on duty */}
        <Card className="p-5">
          <SectionHeader title="Dentists" sub="Clinic roster" action={<Btn variant="ghost" size="sm" onClick={() => onNav('dentists')}>View All</Btn>} />
          <div className="space-y-3">
            {dentists.map(d => {
              const dApts = appointments.filter(a => a.dentistId === d.id && a.date === today);
              return (
                <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-sky-50 bg-white">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {d.fullName.split(' ').slice(-1)[0][0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sky-800 text-sm truncate">{d.fullName}</div>
                    <div className="text-xs text-sky-400 truncate">{d.specialization}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-sky-700">{dApts.length}</div>
                    <div className="text-xs text-sky-400">today</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Adjustment reminders */}
      {upcomingAdj.length > 0 && (
        <Card className="p-5">
          <SectionHeader
            title="Upcoming Adjustments"
            sub="Patients needing reminders in the next 14 days"
            action={<Btn variant="primary" size="sm" onClick={() => onNav('reminders')}>Send Reminders</Btn>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingAdj.map(p => {
              const daysLeft = Math.ceil((new Date(p.nextAdjustmentDate!).getTime() - Date.now()) / 86400000);
              return (
                <div key={p.id} className={`p-3.5 rounded-xl border ${daysLeft <= 3 ? 'bg-amber-50 border-amber-100' : 'bg-sky-50 border-sky-100'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-medium text-sky-800 text-sm leading-tight">{p.fullName}</div>
                    {daysLeft <= 3 && <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />}
                  </div>
                  <div className="text-xs text-sky-500">{fmtShortDate(p.nextAdjustmentDate!)}</div>
                  <div className={`mt-1.5 text-xs font-semibold ${daysLeft <= 3 ? 'text-amber-600' : 'text-sky-600'}`}>
                    {daysLeft} day{daysLeft !== 1 ? 's' : ''} away
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
