'use client';

import { useState, useEffect } from 'react';
import { FileSignature, Plus } from 'lucide-react';
import { Card, SectionHeader, Modal, Input, Select, Textarea, Btn, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fmtDate } from '@/lib/data';

const TEMPLATES = [
  'General Treatment Consent',
  'Data Privacy Consent (RA 10173)',
  'Tooth Extraction Consent',
  'Local Anesthesia Consent',
  'Orthodontic Treatment Consent',
  'Minor / Guardian Consent',
];

const STATUS_STYLE: Record<string, string> = {
  signed: 'bg-teal-50 text-teal-700 border-teal-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  declined: 'bg-red-50 text-red-600 border-red-100',
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${STATUS_STYLE[status] ?? STATUS_STYLE.signed}`}>
      {status}
    </span>
  );
}

export default function AdminConsents() {
  const { user } = useAuth();
  const [consents, setConsents] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = () => {
    if (!user?.clinicId) return;
    Promise.all([
      fetch(`/api/consents?clinicId=${user.clinicId}`).then((r) => r.json()),
      fetch(`/api/patients?clinicId=${user.clinicId}`).then((r) => r.json()),
    ])
      .then(([c, p]) => {
        setConsents(Array.isArray(c) ? c : []);
        setPatients(Array.isArray(p) ? p : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?.clinicId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-sky-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Consent Forms"
        sub={`${consents.length} record${consents.length === 1 ? '' : 's'}`}
        action={<Btn onClick={() => setShowAdd(true)}><Plus size={15} /> Record Consent</Btn>}
      />

      <Card>
        {consents.length === 0 ? (
          <EmptyState
            icon={<FileSignature size={28} />}
            title="No consent forms yet"
            desc="Record a patient's signed consent (treatment, data privacy, anesthesia, etc.)."
          />
        ) : (
          <div className="divide-y divide-sky-50">
            {consents.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 sm:px-5 py-3.5 hover:bg-sky-50/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sky-800 text-sm truncate">{c.title}</div>
                  <div className="text-xs text-sky-400 truncate">
                    {c.patientName}{c.signedAt ? ` · signed ${fmtDate(c.signedAt)}` : ''}
                  </div>
                </div>
                <StatusPill status={c.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {showAdd && (
        <RecordConsentModal
          patients={patients}
          clinicId={user?.clinicId ?? ''}
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); load(); }}
        />
      )}
    </div>
  );
}

function RecordConsentModal({ patients, clinicId, onClose, onSaved }: {
  patients: any[];
  clinicId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ patientId: '', title: TEMPLATES[0], content: '', status: 'signed' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clinicId }),
      });
      const json = await res.json();
      if (res.ok) onSaved();
      else setError(json.error ?? 'Failed to record consent.');
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Record Consent" onClose={onClose}>
      <div className="space-y-4">
        <Select label="Patient" value={form.patientId} onChange={(e) => set('patientId', e.target.value)}>
          <option value="">Select patient...</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </Select>
        <Select label="Consent Form" value={form.title} onChange={(e) => set('title', e.target.value)}>
          {TEMPLATES.map((t) => <option key={t}>{t}</option>)}
        </Select>
        <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)}>
          <option value="signed">Signed</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </Select>
        <Textarea label="Notes (optional)" rows={3} value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Any details about the consent..." />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={save} disabled={loading || !form.patientId || !form.title} className="flex-1">
            {loading ? 'Saving…' : 'Record Consent'}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}
