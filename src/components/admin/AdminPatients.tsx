'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Search, Eye, Upload } from 'lucide-react';
import { Card, SectionHeader, Modal, EmptyState, Btn } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fmtDate, fmtShortDate, calcAge } from '@/lib/data';
import PatientImport from './PatientImport';

export default function AdminPatients() {
  const { user } = useAuth();
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<any | null>(null);
  const [view, setView]           = useState<'info' | 'records'>('info');
  const [patients, setPatients]   = useState<any[]>([]);
  const [records, setRecords]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [importing, setImporting] = useState(false);

  const load = useCallback(() => {
    if (!user?.clinicId) return;
    Promise.all([
      fetch(`/api/patients?clinicId=${user.clinicId}`).then(r => r.json()),
      fetch(`/api/records?clinicId=${user.clinicId}`).then(r => r.json()),
    ]).then(([p, r]) => {
      setPatients(Array.isArray(p) ? p : []);
      setRecords(Array.isArray(r) ? r : []);
    }).finally(() => setLoading(false));
  }, [user?.clinicId]);

  useEffect(() => { load(); }, [load]);

  const filtered = patients.filter(p =>
    !search || p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) || (p.email || '').toLowerCase().includes(search.toLowerCase())
  );

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
        title="Patients"
        sub={`${patients.length} registered patients`}
        action={
          <Btn variant="secondary" size="sm" onClick={() => setImporting(true)}>
            <Upload size={14} /> Import CSV
          </Btn>
        }
      />

      <Card className="p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-sm text-sky-900 focus:border-sky-400 transition-colors"
          />
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState icon={<Users size={28} />} title="No patients found" desc="Try a different search." />
        ) : (
          <>
            {/* Mobile card list (< md) */}
            <div className="md:hidden divide-y divide-sky-50">
              {filtered.map(p => {
                const patRecords = records.filter(r => r.patientId === p.id);
                const daysLeft = p.nextAdjustmentDate
                  ? Math.ceil((new Date(p.nextAdjustmentDate).getTime() - Date.now()) / 86400000)
                  : null;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-sky-50/30 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {p.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sky-800 text-sm truncate">{p.fullName}</div>
                      <div className="text-xs text-sky-500">{p.phone}</div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-sky-400">{calcAge(p.dateOfBirth)} yrs · {p.gender}</span>
                        <span className="bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded text-xs">{patRecords.length} records</span>
                        {daysLeft !== null && (
                          <span className={`text-xs font-semibold ${daysLeft <= 7 ? 'text-amber-600' : 'text-sky-600'}`}>
                            Adj: {daysLeft}d
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelected(p); setView('info'); }}
                      className="p-2 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sky-50">
                    {['Patient', 'Contact', 'DOB / Age', 'Next Adjustment', 'Records', ''].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-sky-500 uppercase tracking-wide px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const patRecords = records.filter(r => r.patientId === p.id);
                    const daysLeft  = p.nextAdjustmentDate
                      ? Math.ceil((new Date(p.nextAdjustmentDate).getTime() - Date.now()) / 86400000)
                      : null;
                    return (
                      <tr key={p.id} className={`border-b border-sky-50/80 hover:bg-sky-50/40 transition-colors ${i % 2 ? 'bg-sky-50/20' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-300 to-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {p.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-sky-800">{p.fullName}</div>
                              <div className="text-xs text-sky-400 capitalize">{p.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-sky-700">{p.phone}</div>
                          <div className="text-xs text-sky-400">{p.email}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-sky-700">{fmtShortDate(p.dateOfBirth)}</div>
                          <div className="text-xs text-sky-400">{calcAge(p.dateOfBirth)} years old</div>
                        </td>
                        <td className="px-5 py-3.5">
                          {p.nextAdjustmentDate ? (
                            <>
                              <div className={`font-medium text-sm ${daysLeft! <= 7 ? 'text-amber-600' : 'text-sky-700'}`}>
                                {fmtShortDate(p.nextAdjustmentDate)}
                              </div>
                              <div className="text-xs text-sky-400">{daysLeft} days away</div>
                            </>
                          ) : <span className="text-sky-300 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                            {patRecords.length} record{patRecords.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => { setSelected(p); setView('info'); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                          >
                            <Eye size={13} /> View
                          </button>
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

      {selected && (
        <Modal title={selected.fullName} onClose={() => setSelected(null)} wide>
          <PatientDetailModal patient={selected} view={view} setView={setView} records={records.filter(r => r.patientId === selected.id)} />
        </Modal>
      )}

      {importing && (
        <PatientImport onClose={() => setImporting(false)} onImported={load} />
      )}
    </div>
  );
}

function PatientDetailModal({ patient, view, setView, records }: { patient: any; view: string; setView: (v: 'info' | 'records') => void; records: any[] }) {
  return (
    <div>
      <div className="flex gap-2 mb-5">
        {(['info', 'records'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${view === v ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}>
            {v === 'info' ? 'Patient Info' : `Records (${records.length})`}
          </button>
        ))}
      </div>

      {view === 'info' ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Full Name', patient.fullName],
              ['Date of Birth', `${fmtDate(patient.dateOfBirth)} (${calcAge(patient.dateOfBirth)} yrs)`],
              ['Gender', patient.gender],
              ['Phone', patient.phone],
              ['Email', patient.email],
              ['Blood Type', patient.bloodType || '—'],
              ['Allergies', patient.allergies?.length ? patient.allergies.join(', ') : 'None'],
              ['Emergency Contact', `${patient.emergencyContact} · ${patient.emergencyPhone}`],
              ['Address', patient.address],
              ['Registered', fmtDate(patient.registeredAt)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-sky-400 mb-0.5">{k}</div>
                <div className="font-medium text-sky-800 text-sm">{v}</div>
              </div>
            ))}
          </div>
          {patient.nextAdjustmentDate && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="text-xs text-amber-600 font-medium mb-0.5">Next Adjustment Due</div>
              <div className="font-semibold text-amber-800">{fmtDate(patient.nextAdjustmentDate)}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-10 text-sky-300 text-sm">No records yet</div>
          ) : records.map(r => <RecordCard key={r.id} record={r} />)}
        </div>
      )}
    </div>
  );
}

function RecordCard({ record }: { record: any }) {
  return (
    <div className="border border-sky-100 rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-sky-800">{record.procedure}</div>
          <div className="text-xs text-sky-400">{fmtDate(record.date)} · {record.dentistName}</div>
        </div>
        {record.tooth && <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">{record.tooth}</span>}
      </div>
      <div className="text-sm text-sky-600">{record.diagnosis}</div>
      {record.notes && <div className="text-sm text-sky-500 bg-sky-50 rounded-lg px-3 py-2">{record.notes}</div>}
      {record.prescription && (
        <div className="text-xs text-sky-500">
          <span className="font-medium">Rx: </span>{record.prescription}
        </div>
      )}
    </div>
  );
}
