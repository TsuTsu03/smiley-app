'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, FilePlus, X, CheckCircle2, Loader } from 'lucide-react';
import { Card, Badge, SectionHeader, EmptyState } from '@/components/ui';
import { MOCK_PATIENTS, MOCK_RECORDS, getDentistById, fmtDate, fmtShortDate, calcAge, Patient, MedicalRecord, PROCEDURE_TYPES } from '@/lib/data';

export default function DentistPatients() {
  const [search, setSearch]     = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addFor, setAddFor]     = useState<Patient | null>(null);

  const patients = MOCK_PATIENTS.filter(p =>
    !search || p.fullName.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="Patient Records" sub="Access records from all clinic dentists" />

      <Card className="p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sm focus:border-sky-400 transition-colors" />
        </div>
      </Card>

      <div className="space-y-3">
        {patients.length === 0 ? (
          <EmptyState icon={<FileText size={28} />} title="No patients found" desc="Adjust the search term." />
        ) : patients.map(patient => {
          const records = MOCK_RECORDS.filter(r => r.patientId === patient.id);
          const isOpen  = expanded === patient.id;
          return (
            <Card key={patient.id} className="overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : patient.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-sky-50/30 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {patient.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sky-800">{patient.fullName}</div>
                  <div className="text-xs text-sky-400">{calcAge(patient.dateOfBirth)} yrs · {patient.phone}</div>
                </div>
                <div className="text-xs text-sky-500 mr-2">{records.length} record{records.length !== 1 ? 's' : ''}</div>
                {isOpen ? <ChevronUp size={16} className="text-sky-400" /> : <ChevronDown size={16} className="text-sky-400" />}
              </button>

              {isOpen && (
                <div className="border-t border-sky-50 px-5 pb-5 pt-4 space-y-4">
                  {/* Quick info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {[
                      ['Blood Type', patient.bloodType || '—'],
                      ['Allergies', patient.allergies.length ? patient.allergies.join(', ') : 'None'],
                      ['Emergency', patient.emergencyContact],
                      ['Next Adjustment', patient.nextAdjustmentDate ? fmtShortDate(patient.nextAdjustmentDate) : '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-sky-50/60 rounded-xl p-2.5">
                        <div className="text-sky-400 mb-0.5">{k}</div>
                        <div className="font-medium text-sky-800">{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Records */}
                  {records.length === 0 ? (
                    <div className="text-sm text-sky-300 text-center py-4">No records yet</div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-sky-500 uppercase tracking-wide">Medical Records</div>
                      {records.map(r => <MiniRecord key={r.id} record={r} />)}
                    </div>
                  )}

                  {/* Walk-in / direct add record */}
                  <button
                    onClick={() => setAddFor(patient)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
                  >
                    <FilePlus size={15} />
                    Add Record
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Inline add-record modal */}
      {addFor && (
        <AddRecordModal patient={addFor} onClose={() => setAddFor(null)} />
      )}
    </div>
  );
}

function AddRecordModal({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    date: today, procedure: '', tooth: '', diagnosis: '', notes: '', prescription: '', nextVisit: '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-sky-950/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-hover w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-teal-500 px-6 py-5 text-white rounded-t-3xl flex items-start justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-white/70 mb-0.5">Add Record</div>
            <h2 className="font-display text-xl">{patient.fullName}</h2>
            <p className="text-white/70 text-xs mt-0.5">{calcAge(patient.dateOfBirth)} yrs · Walk-in or unscheduled visit</p>
          </div>
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white mt-0.5">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 size={52} className="text-sky-400 mx-auto mb-3" />
              <h3 className="font-display text-xl text-sky-800 mb-1">Record Saved</h3>
              <p className="text-sky-500 text-sm mb-6">
                Medical record for <strong>{patient.fullName}</strong> has been added.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setDone(false); setForm({ date: today, procedure: '', tooth: '', diagnosis: '', notes: '', prescription: '', nextVisit: '' }); }}
                  className="flex-1 py-3 rounded-xl bg-sky-50 text-sky-700 font-semibold text-sm hover:bg-sky-100 transition-colors"
                >
                  Add Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Visit details */}
              <div>
                <div className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-3">Visit Details</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-sky-800 mb-1.5">Date *</label>
                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sky-800 mb-1.5">Procedure *</label>
                    <select value={form.procedure} onChange={e => set('procedure', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 transition-colors">
                      <option value="">Select procedure...</option>
                      {PROCEDURE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sky-800 mb-1.5">Tooth / Area</label>
                    <input value={form.tooth} onChange={e => set('tooth', e.target.value)}
                      placeholder="e.g. #16, Upper right, Full arch..."
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Clinical notes */}
              <div className="border-t border-sky-50 pt-4">
                <div className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-3">Clinical Notes</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-sky-800 mb-1.5">Diagnosis *</label>
                    <input value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)}
                      placeholder="Clinical diagnosis..."
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sky-800 mb-1.5">Notes</label>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                      rows={3} placeholder="Observations, patient complaints, treatment done..."
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sky-800 mb-1.5">Prescription</label>
                    <textarea value={form.prescription} onChange={e => set('prescription', e.target.value)}
                      rows={2} placeholder="Medications prescribed..."
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sky-800 mb-1.5">Next Visit Date</label>
                    <input type="date" value={form.nextVisit} onChange={e => set('nextVisit', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm focus:border-sky-400 transition-colors" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={loading || !form.date || !form.procedure || !form.diagnosis}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-700 to-sky-600 text-white font-semibold text-sm shadow-soft hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader size={15} className="animate-spin" /> Saving…</> : <><FilePlus size={15} /> Save Record</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniRecord({ record }: { record: MedicalRecord }) {
  const dentist = getDentistById(record.dentistId);
  return (
    <div className="border border-sky-100 rounded-xl p-3.5 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-sky-800 text-sm">{record.procedure}</span>
        <span className="text-xs text-sky-400 flex-shrink-0">{fmtDate(record.date)}</span>
      </div>
      <div className="text-xs text-sky-500">By {dentist?.fullName}</div>
      <div className="text-sm text-sky-600">{record.diagnosis}</div>
      {record.tooth && <div className="text-xs text-sky-400">Tooth: {record.tooth}</div>}
      {record.notes && <div className="text-xs text-sky-500 bg-sky-50 rounded-lg px-2.5 py-1.5">{record.notes}</div>}
      {record.prescription && <div className="text-xs text-sky-500"><span className="font-medium">Rx: </span>{record.prescription}</div>}
      {record.nextVisit && <div className="text-xs text-sky-500"><span className="font-medium">Next visit: </span>{fmtDate(record.nextVisit)}</div>}
    </div>
  );
}
