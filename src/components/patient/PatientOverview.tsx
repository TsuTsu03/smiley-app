'use client';

import { useAuth } from '@/lib/auth';
import { Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { StatCard, Card, Badge, SectionHeader, Btn } from '@/components/ui';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_RECORDS, getDentistById, fmtDate, fmtShortDate, calcAge } from '@/lib/data';

export default function PatientOverview({ onNav }: { onNav: (k: string) => void }) {
  const { userId } = useAuth();
  const patient  = MOCK_PATIENTS.find(p => p.id === userId);
  const myApts   = MOCK_APPOINTMENTS.filter(a => a.patientId === userId);
  const myRecs   = MOCK_RECORDS.filter(r => r.patientId === userId);
  const today    = new Date().toISOString().split('T')[0];
  const upcoming = myApts.filter(a => a.date >= today && a.status !== 'cancelled')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const daysToAdj = patient?.nextAdjustmentDate
    ? Math.ceil((new Date(patient.nextAdjustmentDate).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white">
        <div className="text-teal-100 text-sm mb-1">Welcome back,</div>
        <h1 className="font-display text-2xl">{patient?.fullName}</h1>
        <div className="text-teal-100 text-sm mt-1">
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
        <StatCard icon={<FileText size={20} />} label="Records" value={myRecs.length} sub="Visit history" color="mint" />
        {daysToAdj !== null && (
          <StatCard icon={<Clock size={20} />} label="Next Adjustment" value={`${daysToAdj}d`} sub={fmtShortDate(patient!.nextAdjustmentDate!)} color={daysToAdj <= 7 ? 'amber' : 'blue'} />
        )}
      </div>

      {/* Adjustment reminder */}
      {patient?.nextAdjustmentDate && daysToAdj !== null && daysToAdj <= 14 && (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${daysToAdj <= 7 ? 'bg-amber-50 border-amber-100' : 'bg-teal-50 border-teal-100'}`}>
          <AlertCircle size={18} className={daysToAdj <= 7 ? 'text-amber-500 flex-shrink-0 mt-0.5' : 'text-teal-500 flex-shrink-0 mt-0.5'} />
          <div className="flex-1">
            <div className={`font-semibold text-sm ${daysToAdj <= 7 ? 'text-amber-700' : 'text-teal-700'}`}>
              Orthodontic Adjustment Reminder
            </div>
            <div className={`text-sm ${daysToAdj <= 7 ? 'text-amber-600' : 'text-teal-600'}`}>
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
            <Calendar size={32} className="text-teal-200 mx-auto mb-3" />
            <div className="text-teal-400 text-sm">No upcoming appointments</div>
            <Btn onClick={() => onNav('book')} className="mt-4 mx-auto">Book an Appointment</Btn>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(apt => {
              const dentist = getDentistById(apt.dentistId);
              return (
                <div key={apt.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-teal-50 bg-teal-50/30">
                  <div className="text-center min-w-12">
                    <div className="text-lg font-bold text-teal-800">{new Date(apt.date).getDate()}</div>
                    <div className="text-xs text-teal-500">{new Date(apt.date).toLocaleString('en', { month: 'short' })}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-teal-800">{apt.type}</div>
                    <div className="text-sm text-teal-500">{apt.time} · {dentist?.fullName}</div>
                  </div>
                  <Badge status={apt.status} />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Recent records */}
      {myRecs.length > 0 && (
        <Card className="p-5">
          <SectionHeader title="Recent Visits" sub="Your latest records" action={<Btn variant="ghost" size="sm" onClick={() => onNav('records')}>See All</Btn>} />
          <div className="space-y-3">
            {myRecs.slice(0, 2).map(r => {
              const dentist = getDentistById(r.dentistId);
              return (
                <div key={r.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-teal-50">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-teal-800 text-sm">{r.procedure}</div>
                    <div className="text-xs text-teal-400">{fmtDate(r.date)} · {dentist?.fullName}</div>
                    <div className="text-sm text-teal-600 mt-0.5">{r.diagnosis}</div>
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
