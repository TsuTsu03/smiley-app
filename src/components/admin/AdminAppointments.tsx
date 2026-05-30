'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Search } from 'lucide-react';
import { Card, Badge, SectionHeader, Modal, Input, Select, Btn, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fmtDate, PROCEDURE_TYPES } from '@/lib/data';

export default function AdminAppointments() {
  const { user } = useAuth();
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [showAdd, setShowAdd]       = useState(false);
  const [selected, setSelected]     = useState<any | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients]     = useState<any[]>([]);
  const [dentists, setDentists]     = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);

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
    }).finally(() => setLoading(false));
  }, [user?.clinicId]);

  const refreshAppointments = () => {
    if (!user?.clinicId) return;
    fetch(`/api/appointments?clinicId=${user.clinicId}`).then(r => r.json()).then(a => {
      setAppointments(Array.isArray(a) ? a : []);
    });
  };

  const filtered = appointments.filter(a => {
    const matchSearch = !search ||
      (a.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.dentistName || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || a.status === filter;
    const matchDate   = !dateFilter || a.date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  }).sort((a: any, b: any) => (a.date + a.time).localeCompare(b.date + b.time));

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-sky-50 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Appointments"
        sub={`${appointments.length} total records`}
        action={<Btn onClick={() => setShowAdd(true)}><Plus size={15} /> New Appointment</Btn>}
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          <div className="relative flex-1 min-w-0 sm:min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient or dentist..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-sky-100 bg-sky-50/30 text-sm text-sky-900 focus:border-sky-400 transition-colors"
            />
          </div>
          <input
            type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-sky-100 bg-sky-50/30 text-sm text-sky-900 focus:border-sky-400 transition-colors"
          />
          <div className="flex flex-wrap gap-1.5">
            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* List */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="No appointments found" desc="Try adjusting filters or add a new appointment." />
        ) : (
          <>
            {/* Mobile card list (< md) */}
            <div className="md:hidden divide-y divide-sky-50">
              {filtered.map(apt => (
                <div key={apt.id} className="px-4 py-3.5 hover:bg-sky-50/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-medium text-sky-800 text-sm">{apt.patientName}</div>
                    <Badge status={apt.status} />
                  </div>
                  <div className="text-xs text-sky-500 mb-0.5">{apt.type}</div>
                  <div className="text-xs text-sky-600 font-medium">{fmtDate(apt.date)} · {apt.time}</div>
                  <div className="text-xs text-sky-400 mb-2">{apt.dentistName}</div>
                  <button
                    onClick={() => setSelected(apt)}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                  >
                    View details →
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sky-50">
                    {['Date & Time', 'Patient', 'Dentist', 'Procedure', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-sky-500 uppercase tracking-wide px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt, i) => (
                    <tr key={apt.id} className={`border-b border-sky-50/80 hover:bg-sky-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-sky-50/20'}`}>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-sky-800">{fmtDate(apt.date)}</div>
                        <div className="text-xs text-sky-400">{apt.time}</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-sky-800">{apt.patientName}</td>
                      <td className="px-5 py-3.5 text-sky-600">{apt.dentistName}</td>
                      <td className="px-5 py-3.5 text-sky-600">{apt.type}</td>
                      <td className="px-5 py-3.5"><Badge status={apt.status} /></td>
                      <td className="px-5 py-3.5">
                        <Btn variant="ghost" size="sm" onClick={() => setSelected(apt)}>View</Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* Add modal */}
      {showAdd && (
        <AddAppointmentModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); refreshAppointments(); }}
          patients={patients}
          dentists={dentists}
          clinicId={user?.clinicId ?? ''}
        />
      )}

      {/* Detail modal */}
      {selected && (
        <Modal title="Appointment Details" onClose={() => setSelected(null)}>
          <AppointmentDetail apt={selected} />
        </Modal>
      )}
    </div>
  );
}

function AppointmentDetail({ apt }: { apt: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[
          ['Patient', apt.patientName],
          ['Dentist', apt.dentistName],
          ['Date', fmtDate(apt.date)],
          ['Time', apt.time],
          ['Type', apt.type],
          ['Status', apt.status],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="text-xs text-sky-500 mb-0.5">{k}</div>
            <div className="font-medium text-sky-800 capitalize">{v}</div>
          </div>
        ))}
      </div>
      {apt.notes && (
        <div>
          <div className="text-xs text-sky-500 mb-1">Notes</div>
          <div className="bg-sky-50 rounded-xl px-4 py-3 text-sm text-sky-700">{apt.notes}</div>
        </div>
      )}
    </div>
  );
}

function AddAppointmentModal({ onClose, onSaved, patients, dentists, clinicId }: {
  onClose: () => void;
  onSaved: () => void;
  patients: any[];
  dentists: any[];
  clinicId: string;
}) {
  const [form, setForm]   = useState({ patientId: '', dentistId: '', date: '', time: '', type: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clinicId }),
      });
      const json = await res.json();
      if (res.ok) {
        onSaved();
      } else {
        setError(json.error ?? 'Failed to save appointment.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Appointment" onClose={onClose}>
      <div className="space-y-4">
        <Select label="Patient" value={form.patientId} onChange={e => set('patientId', e.target.value)}>
          <option value="">Select patient...</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </Select>
        <Select label="Dentist" value={form.dentistId} onChange={e => set('dentistId', e.target.value)}>
          <option value="">Select dentist...</option>
          {dentists.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
        </Select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          <Input label="Time" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
        </div>
        <Select label="Procedure Type" value={form.type} onChange={e => set('type', e.target.value)}>
          <option value="">Select type...</option>
          {PROCEDURE_TYPES.map(t => <option key={t}>{t}</option>)}
        </Select>
        <Input label="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any special notes..." />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={handleSave} disabled={loading || !form.patientId || !form.dentistId || !form.date || !form.time || !form.type} className="flex-1">
            {loading ? 'Saving…' : 'Save Appointment'}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}
