'use client';

import { useState } from 'react';
import { Stethoscope, Clock, Calendar } from 'lucide-react';
import { Card, SectionHeader, Modal, Badge } from '@/components/ui';
import { MOCK_DENTISTS, MOCK_APPOINTMENTS, getPatientById, fmtDate, Dentist } from '@/lib/data';

export default function AdminDentists() {
  const [selected, setSelected] = useState<Dentist | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader title="Dentists & Schedules" sub="Clinic staff roster and availability" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_DENTISTS.map(d => {
          const apts     = MOCK_APPOINTMENTS.filter(a => a.dentistId === d.id);
          const upcoming = apts.filter(a => a.status === 'confirmed' || a.status === 'pending');
          return (
            <Card key={d.id} className="p-5 cursor-pointer card-hover" onClick={() => setSelected(d)}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0">
                  {d.fullName.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <div className="font-semibold text-blue-800">{d.fullName}</div>
                  <div className="text-xs text-blue-500 mt-0.5">{d.specialization}</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Schedule</div>
                {d.schedule.map(s => (
                  <div key={s.day} className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">{s.day}</span>
                    <span className="text-blue-500 text-xs">{s.startTime} – {s.endTime}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-blue-50 text-xs text-blue-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{upcoming.length} upcoming</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{apts.filter(a => a.status === 'completed').length} completed</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selected && (
        <Modal title={selected.fullName} onClose={() => setSelected(null)} wide>
          <DentistDetail dentist={selected} />
        </Modal>
      )}
    </div>
  );
}

function DentistDetail({ dentist }: { dentist: Dentist }) {
  const apts = MOCK_APPOINTMENTS.filter(a => a.dentistId === dentist.id)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><div className="text-xs text-blue-400 mb-0.5">Specialization</div><div className="font-medium text-blue-800">{dentist.specialization}</div></div>
        <div><div className="text-xs text-blue-400 mb-0.5">Email</div><div className="font-medium text-blue-800">{dentist.email}</div></div>
        <div><div className="text-xs text-blue-400 mb-0.5">Phone</div><div className="font-medium text-blue-800">{dentist.phone}</div></div>
      </div>

      <div>
        <div className="font-semibold text-blue-700 text-sm mb-3">Weekly Schedule</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dentist.schedule.map(s => (
            <div key={s.day} className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="font-medium text-blue-800 text-sm">{s.day}</span>
              <span className="text-blue-500 text-xs">{s.startTime} – {s.endTime}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold text-blue-700 text-sm mb-3">Appointments ({apts.length})</div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {apts.map(a => {
            const patient = getPatientById(a.patientId);
            return (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-blue-50">
                <div className="text-xs font-bold text-blue-600 w-16 flex-shrink-0">{a.date}</div>
                <div className="text-xs text-blue-500 w-10">{a.time}</div>
                <div className="flex-1 text-sm font-medium text-blue-800 truncate">{patient?.fullName}</div>
                <Badge status={a.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
