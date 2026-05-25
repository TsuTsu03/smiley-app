'use client';

import { useAuth } from '@/lib/auth';
import { FileText } from 'lucide-react';
import { Card, SectionHeader, EmptyState } from '@/components/ui';
import { MOCK_RECORDS, getDentistById, fmtDate } from '@/lib/data';

export default function PatientRecords() {
  const { userId } = useAuth();
  const records   = MOCK_RECORDS.filter(r => r.patientId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <SectionHeader title="My Medical Records" sub={`${records.length} visit${records.length !== 1 ? 's' : ''} on file`} />

      {records.length === 0 ? (
        <EmptyState icon={<FileText size={28} />} title="No records yet" desc="Your visit history will appear here after your first appointment." />
      ) : (
        <div className="space-y-4">
          {records.map(r => {
            const dentist = getDentistById(r.dentistId);
            return (
              <Card key={r.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-teal-800 text-base">{r.procedure}</h3>
                    <div className="text-sm text-teal-500 mt-0.5">{fmtDate(r.date)} · {dentist?.fullName}</div>
                  </div>
                  {r.tooth && (
                    <span className="text-xs bg-teal-50 text-teal-600 border border-teal-100 px-2.5 py-1 rounded-full flex-shrink-0">
                      {r.tooth}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoBox label="Diagnosis" value={r.diagnosis} />
                  {r.nextVisit && <InfoBox label="Next Visit" value={fmtDate(r.nextVisit)} highlight />}
                </div>

                {r.notes && (
                  <div>
                    <div className="text-xs text-teal-400 mb-1.5 font-medium uppercase tracking-wide">Dentist Notes</div>
                    <div className="bg-teal-50/60 rounded-xl px-4 py-3 text-sm text-teal-700 leading-relaxed">{r.notes}</div>
                  </div>
                )}

                {r.prescription && (
                  <div>
                    <div className="text-xs text-teal-400 mb-1.5 font-medium uppercase tracking-wide">Prescription</div>
                    <div className="bg-mint-50/60 rounded-xl px-4 py-3 text-sm text-teal-700 font-mono text-xs leading-relaxed border border-teal-100">{r.prescription}</div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3.5 ${highlight ? 'bg-teal-50 border border-teal-100' : 'bg-gray-50 border border-gray-100'}`}>
      <div className="text-xs text-teal-400 mb-0.5 font-medium uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-medium ${highlight ? 'text-teal-700' : 'text-teal-800'}`}>{value}</div>
    </div>
  );
}
