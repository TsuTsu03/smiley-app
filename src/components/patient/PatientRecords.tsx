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
        <div key={i} className="skeleton h-16 rounded-2xl" />
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
                  <h3 className="font-semibold text-fg text-base">{r.procedure}</h3>
                  <div className="text-sm text-muted mt-0.5">{fmtDate(r.date)} · {r.dentistName}</div>
                </div>
                {r.tooth && (
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full flex-shrink-0">
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
                  <div className="text-xs text-subtle mb-1.5 font-medium uppercase tracking-wide">Dentist Notes</div>
                  <div className="bg-bg rounded-xl px-4 py-3 text-sm text-muted leading-relaxed">{r.notes}</div>
                </div>
              )}

              {r.prescription && (
                <div>
                  <div className="text-xs text-subtle mb-1.5 font-medium uppercase tracking-wide">Prescription</div>
                  <div className="bg-bg rounded-xl px-4 py-3 text-sm text-muted font-mono text-xs leading-relaxed border border-line">{r.prescription}</div>
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
    <div className={`rounded-xl p-3.5 border ${highlight ? 'bg-primary/10 border-primary/20' : 'bg-bg border-line'}`}>
      <div className="text-xs text-subtle mb-0.5 font-medium uppercase tracking-wide">{label}</div>
      <div className={`text-sm font-medium ${highlight ? 'text-primary' : 'text-fg'}`}>{value}</div>
    </div>
  );
}
