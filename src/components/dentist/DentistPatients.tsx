'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Card, Badge, SectionHeader, EmptyState, Modal } from '@/components/ui';
import { MOCK_PATIENTS, MOCK_RECORDS, MOCK_APPOINTMENTS, getDentistById, fmtDate, fmtShortDate, calcAge, Patient, MedicalRecord } from '@/lib/data';

export default function DentistPatients() {
  const [search, setSearch]    = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

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
                  {patient.fullName.split(' ').map(n=>n[0]).slice(0,2).join('')}
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
                </div>
              )}
            </Card>
          );
        })}
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
