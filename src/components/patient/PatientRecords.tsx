'use client';

import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Card, SectionHeader, EmptyState } from '@/components/ui';
import { fmtDate } from '@/lib/data';

export default function PatientRecords() {
  const { userId } = useAuth();
  const [records, setRecords]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/records?patientId=${userId}`)
      .then(r => r.json())
      .then(r => setRecords(Array.isArray(r) ? r.sort((a: any, b: any) => b.date.localeCompare(a.date)) : []))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-sky-50 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeader title="My Medical Records" sub={`${records.length} visit${records.length !== 1 ? 's' : ''} on file`} />

      {records.length === 0 ? (
        <EmptyState icon={<FileText size={28} />} title="No records yet" desc="Your visit history will appear here after your first appointment." />
      ) : (
        <div className="space-y-4">
          {records.map(r => (
            <Card key={r.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sky-800 text-base">{r.procedure}</h3>
                  <div className="text-sm text-sky-500 mt-0.5">{fmtDate(r.date)} · {r.dentistName}</div>
                </div>
                {r.tooth && (
                  <span className="text-xs bg-sky-50 text-sky-600 border border-sky-100 px-2.5 py-1 rounded-full flex-shrink-0">
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
                  <div className="text-xs text-sky-400 mb-1.5 font-medium uppercase tracking-wide">Dentist Notes</div>
                  <div className="bg-sky-50/60 rounded-xl px-4 py-3 text-sm text-sky-700 leading-relaxed">{r.notes}</div>
                </div>
              )}

              {r.prescription && (
                <div>
                  <div className="text-xs text-sky-400 mb-1.5 font-medium uppercase tracking-wide">Prescription</div>
                  <div className="bg-sky-50/60 rounded-xl px-4 py-3 text-sm text-sky-700 font-mono text-xs leading-relaxed border border-sky-100">{r.prescription}</div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3.5 ${highlight ? 'bg-sky-50 border border-sky-100' : 'bg-gray-50 border border-gray-100'}`}>
      <div className="text-xs text-sky-400 mb-0.5 font-medium uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-medium ${highlight ? 'text-sky-700' : 'text-sky-800'}`}>{value}</div>
    </div>
  );
}
