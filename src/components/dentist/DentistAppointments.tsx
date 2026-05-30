'use client';

import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, Badge, SectionHeader, EmptyState } from '@/components/ui';
import { fmtDate } from '@/lib/data';
import { Modal } from '@/components/ui';

export default function DentistAppointments() {
  const { dentistId } = useAuth();
  const [selected, setSelected]   = useState<any | null>(null);
  const [filter, setFilter]       = useState('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!dentistId) return;
    fetch(`/api/appointments?dentistId=${dentistId}`)
      .then(r => r.json())
      .then(a => setAppointments(Array.isArray(a) ? a : []))
      .finally(() => setLoading(false));
  }, [dentistId]);

  const today = new Date().toISOString().split('T')[0];

  const filtered = appointments.filter(a => {
    if (filter === 'upcoming') return a.date >= today && a.status !== 'cancelled';
    if (filter === 'today')    return a.date === today;
    if (filter === 'past')     return a.date < today || a.status === 'completed';
    return true;
  }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-sky-50 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="My Schedule" sub="Your appointments and patient visits" />

      <div className="flex flex-wrap gap-2">
        {['upcoming', 'today', 'past', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-sky-600 text-white' : 'bg-white text-sky-600 border border-sky-100 hover:bg-sky-50'}`}>
            {f}
          </button>
        ))}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="No appointments" desc="No appointments match this filter." />
        ) : (
          <div className="divide-y divide-sky-50">
            {filtered.map(apt => (
              <div key={apt.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 hover:bg-sky-50/30 transition-colors cursor-pointer" onClick={() => setSelected(apt)}>
                <div className="flex-shrink-0 text-center min-w-14 sm:min-w-16">
                  <div className="text-xs font-bold text-sky-600 bg-sky-50 rounded-lg px-1.5 sm:px-2 py-1">{apt.date}</div>
                  <div className="text-sm font-semibold text-sky-800 mt-1">{apt.time}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {(apt.patientName || '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sky-800">{apt.patientName}</div>
                  <div className="text-sm text-sky-500">{apt.type}</div>
                </div>
                <Badge status={apt.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {selected && (
        <Modal title="Appointment Details" onClose={() => setSelected(null)}>
          <div className="space-y-3">
            {[
              ['Patient', selected.patientName],
              ['Date', fmtDate(selected.date)],
              ['Time', selected.time],
              ['Procedure', selected.type],
              ['Status', selected.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-sky-500">{k}</span>
                <span className="font-medium text-sky-800 capitalize">{v}</span>
              </div>
            ))}
            {selected.notes && (
              <div className="bg-sky-50 rounded-xl p-3 text-sm text-sky-600 mt-2">{selected.notes}</div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
