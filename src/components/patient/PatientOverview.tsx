'use client';

import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { StatCard, Card, Badge, SectionHeader, Btn } from '@/components/ui';
import { fmtDate, fmtShortDate, calcAge } from '@/lib/data';

export default function PatientOverview({ onNav }: { onNav: (k: string) => void }) {
  const { userId, user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords]           = useState<any[]>([]);
  const [patient, setPatient]           = useState<any | null>(null);

  useEffect(() => {
    if (!userId || !user?.clinicId) return;
    Promise.all([
      fetch(`/api/appointments?patientId=${userId}`).then(r => r.json()),
      fetch(`/api/records?patientId=${userId}`).then(r => r.json()),
      fetch(`/api/patients?clinicId=${user.clinicId}`).then(r => r.json()),
    ]).then(([apts, recs, allPatients]) => {
      setAppointments(Array.isArray(apts) ? apts : []);
      setRecords(Array.isArray(recs) ? recs : []);
      const me = Array.isArray(allPatients) ? allPatients.find((p: any) => p.id === userId) : null;
      setPatient(me ?? null);
    });
  }, [userId, user?.clinicId]);

  const today    = new Date().toISOString().split('T')[0];
  const upcoming = appointments
    .filter(a => a.date >= today && a.status !== 'cancelled')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const daysToAdj = patient?.nextAdjustmentDate
    ? Math.ceil((new Date(patient.nextAdjustmentDate).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-500 rounded-2xl p-6 text-white">
        <div className="text-sky-100 text-sm mb-1">Welcome back,</div>
        <h1 className="font-display text-2xl">{patient?.fullName}</h1>
        <div className="text-sky-100 text-sm mt-1">
          {calcAge(patient?.dateOfBirth || '')} years old · {patient?.bloodType || 'Blood type not set'}
        </div>
        {patient?.allergies && patient.allergies.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-amber-200 text-xs">
            <AlertCircle size={12} />
            Allergies: {patient.allergies.join(', ')}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={<Calendar size={20} />} label="Upcoming" value={upcoming.length} sub="Appointments" />
        <StatCard icon={<FileText size={20} />} label="Records" value={records.length} sub="Visit history" color="mint" />
        {daysToAdj !== null && (
          <StatCard icon={<Clock size={20} />} label="Next Adjustment" value={`${daysToAdj}d`} sub={fmtShortDate(patient!.nextAdjustmentDate!)} color={daysToAdj <= 7 ? 'amber' : 'blue'} />
        )}
      </div>

      {/* Adjustment reminder */}
      {patient?.nextAdjustmentDate && daysToAdj !== null && daysToAdj <= 14 && (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${daysToAdj <= 7 ? 'bg-amber-50 border-amber-100' : 'bg-sky-50 border-sky-100'}`}>
          <AlertCircle size={18} className={daysToAdj <= 7 ? 'text-amber-500 flex-shrink-0 mt-0.5' : 'text-sky-500 flex-shrink-0 mt-0.5'} />
          <div className="flex-1">
            <div className={`font-semibold text-sm ${daysToAdj <= 7 ? 'text-amber-700' : 'text-sky-700'}`}>
              Orthodontic Adjustment Reminder
            </div>
            <div className={`text-sm ${daysToAdj <= 7 ? 'text-amber-600' : 'text-sky-600'}`}>
              Your next adjustment is on <strong>{fmtDate(patient.nextAdjustmentDate)}</strong> — {daysToAdj} days away.
            </div>
          </div>
          <Btn size="sm" variant="secondary" onClick={() => onNav('book')}>Book Now</Btn>
        </div>
      )}

      {/* Upcoming appointments */}
      <Card className="p-5">
        <SectionHeader title="My Appointments" sub={`${upcoming.length} upcoming`} action={<Btn variant="ghost" size="sm" onClick={() => onNav('book')}>Book New</Btn>} />
        {upcoming.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={32} className="text-sky-200 mx-auto mb-3" />
            <div className="text-sky-400 text-sm">No upcoming appointments</div>
            <Btn onClick={() => onNav('book')} className="mt-4 mx-auto">Book an Appointment</Btn>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-sky-50 bg-sky-50/30">
                <div className="text-center min-w-12">
                  <div className="text-lg font-bold text-sky-800">{new Date(apt.date).getDate()}</div>
                  <div className="text-xs text-sky-500">{new Date(apt.date).toLocaleString('en', { month: 'short' })}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sky-800">{apt.type}</div>
                  <div className="text-sm text-sky-500">{apt.time} · {apt.dentistName}</div>
                </div>
                <Badge status={apt.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent records */}
      {records.length > 0 && (
        <Card className="p-5">
          <SectionHeader title="Recent Visits" sub="Your latest records" action={<Btn variant="ghost" size="sm" onClick={() => onNav('records')}>See All</Btn>} />
          <div className="space-y-3">
            {records.slice(0, 2).map(r => (
              <div key={r.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-sky-50">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sky-800 text-sm">{r.procedure}</div>
                  <div className="text-xs text-sky-400">{fmtDate(r.date)} · {r.dentistName}</div>
                  <div className="text-sm text-sky-600 mt-0.5">{r.diagnosis}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
