'use client';

import { useState } from 'react';
import { Calendar, Plus, Search } from 'lucide-react';
import { Card, Badge, SectionHeader, Modal, Input, Select, Btn, EmptyState } from '@/components/ui';
import {
  MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_DENTISTS,
  getPatientById, getDentistById, fmtDate, PROCEDURE_TYPES, Appointment
} from '@/lib/data';

export default function AdminAppointments() {
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [dateFilter, setDateFilter] = useState('');

  const appointments = MOCK_APPOINTMENTS.filter(a => {
    const patient = getPatientById(a.patientId);
    const dentist = getDentistById(a.dentistId);
    const matchSearch = !search || patient?.fullName.toLowerCase().includes(search.toLowerCase()) || dentist?.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || a.status === filter;
    const matchDate   = !dateFilter || a.date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Appointments"
        sub={`${MOCK_APPOINTMENTS.length} total records`}
        action={<Btn onClick={() => setShowAdd(true)}><Plus size={15} /> New Appointment</Btn>}
      />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          <div className="relative flex-1 min-w-0 sm:min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient or dentist..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-blue-100 bg-blue-50/30 text-sm text-blue-900 focus:border-blue-400 transition-colors"
            />
          </div>
          <input
            type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-blue-100 bg-blue-50/30 text-sm text-blue-900 focus:border-blue-400 transition-colors"
          />
          <div className="flex flex-wrap gap-1.5">
            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* List */}
      <Card>
        {appointments.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="No appointments found" desc="Try adjusting filters or add a new appointment." />
        ) : (
          <>
            {/* Mobile card list (< md) */}
            <div className="md:hidden divide-y divide-blue-50">
              {appointments.map(apt => {
                const patient = getPatientById(apt.patientId);
                const dentist = getDentistById(apt.dentistId);
                return (
                  <div key={apt.id} className="px-4 py-3.5 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium text-blue-800 text-sm">{patient?.fullName}</div>
                      <Badge status={apt.status} />
                    </div>
                    <div className="text-xs text-blue-500 mb-0.5">{apt.type}</div>
                    <div className="text-xs text-blue-600 font-medium">{fmtDate(apt.date)} · {apt.time}</div>
                    <div className="text-xs text-blue-400 mb-2">{dentist?.fullName}</div>
                    <button
                      onClick={() => setSelected(apt)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      View details →
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-50">
                    {['Date & Time', 'Patient', 'Dentist', 'Procedure', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-blue-500 uppercase tracking-wide px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, i) => {
                    const patient = getPatientById(apt.patientId);
                    const dentist = getDentistById(apt.dentistId);
                    return (
                      <tr key={apt.id} className={`border-b border-blue-50/80 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-blue-50/20'}`}>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-blue-800">{fmtDate(apt.date)}</div>
                          <div className="text-xs text-blue-400">{apt.time}</div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-blue-800">{patient?.fullName}</td>
                        <td className="px-5 py-3.5 text-blue-600">{dentist?.fullName}</td>
                        <td className="px-5 py-3.5 text-blue-600">{apt.type}</td>
                        <td className="px-5 py-3.5"><Badge status={apt.status} /></td>
                        <td className="px-5 py-3.5">
                          <Btn variant="ghost" size="sm" onClick={() => setSelected(apt)}>View</Btn>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {/* Add modal */}
      {showAdd && <AddAppointmentModal onClose={() => setShowAdd(false)} />}

      {/* Detail modal */}
      {selected && (
        <Modal title="Appointment Details" onClose={() => setSelected(null)}>
          <AppointmentDetail apt={selected} />
        </Modal>
      )}
    </div>
  );
}

function AppointmentDetail({ apt }: { apt: Appointment }) {
  const patient = getPatientById(apt.patientId);
  const dentist = getDentistById(apt.dentistId);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[
          ['Patient', patient?.fullName],
          ['Dentist', dentist?.fullName],
          ['Date', fmtDate(apt.date)],
          ['Time', apt.time],
          ['Type', apt.type],
          ['Status', apt.status],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="text-xs text-blue-500 mb-0.5">{k}</div>
            <div className="font-medium text-blue-800 capitalize">{v}</div>
          </div>
        ))}
      </div>
      {apt.notes && (
        <div>
          <div className="text-xs text-blue-500 mb-1">Notes</div>
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700">{apt.notes}</div>
        </div>
      )}
    </div>
  );
}

function AddAppointmentModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ patientId: '', dentistId: '', date: '', time: '', type: '', notes: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title="New Appointment" onClose={onClose}>
      <div className="space-y-4">
        <Select label="Patient" value={form.patientId} onChange={e => set('patientId', e.target.value)}>
          <option value="">Select patient...</option>
          {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </Select>
        <Select label="Dentist" value={form.dentistId} onChange={e => set('dentistId', e.target.value)}>
          <option value="">Select dentist...</option>
          {MOCK_DENTISTS.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
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
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={onClose} className="flex-1">Save Appointment</Btn>
        </div>
      </div>
    </Modal>
  );
}
