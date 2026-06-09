'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import { Card, StatCard, SectionHeader, Modal, Input, Select, Textarea, Btn, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fmtDate } from '@/lib/data';

const peso = (n: number) => `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const HMOS = ['Maxicare', 'Intellicare', 'MediCard', 'PhilCare', 'Cocolife', 'Insular Health', 'ValuCare', 'Other'];

const STATUS_STYLE: Record<string, string> = {
  submitted: 'bg-sky-50 text-sky-700 border-sky-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  approved: 'bg-teal-50 text-teal-700 border-teal-100',
  partial: 'bg-amber-50 text-amber-700 border-amber-100',
  denied: 'bg-red-50 text-red-600 border-red-100',
};
const Pill = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${STATUS_STYLE[status] ?? STATUS_STYLE.submitted}`}>{status}</span>
);
const STATUSES = ['submitted', 'pending', 'approved', 'partial', 'denied'];

export default function AdminInsurance() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);

  const load = () => {
    if (!user?.clinicId) return;
    Promise.all([
      fetch(`/api/insurance?clinicId=${user.clinicId}`).then((r) => r.json()),
      fetch(`/api/patients?clinicId=${user.clinicId}`).then((r) => r.json()),
    ]).then(([c, p]) => {
      setClaims(Array.isArray(c) ? c : []);
      setPatients(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  };
  useEffect(load, [user?.clinicId]);

  const claimed = claims.reduce((s, c) => s + c.claimAmount, 0);
  const approved = claims.reduce((s, c) => s + c.approvedAmount, 0);

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-sky-50 rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Insurance & HMO Claims"
        sub={`${claims.length} claim${claims.length === 1 ? '' : 's'}`}
        action={<Btn onClick={() => setShowAdd(true)}><Plus size={15} /> New Claim</Btn>}
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={<ShieldCheck size={18} />} color="blue" label="Claims" value={claims.length} />
        <StatCard icon={<ShieldCheck size={18} />} color="amber" label="Claimed" value={peso(claimed)} />
        <StatCard icon={<ShieldCheck size={18} />} color="teal" label="Approved" value={peso(approved)} />
      </div>

      <Card>
        {claims.length === 0 ? (
          <EmptyState icon={<ShieldCheck size={28} />} title="No claims yet" desc="Track HMO / insurance claims for your patients." />
        ) : (
          <div className="divide-y divide-sky-50">
            {claims.map((c) => (
              <button key={c.id} onClick={() => setEdit(c)} className="w-full text-left flex flex-col sm:flex-row sm:items-center gap-2 px-4 sm:px-5 py-3.5 hover:bg-sky-50/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sky-800 text-sm truncate">{c.patientName} · {c.provider}</div>
                  <div className="text-xs text-sky-400 truncate">{c.procedure || 'Claim'} · {fmtDate(c.createdAt)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-sky-900 text-sm">{peso(c.claimAmount)}</div>
                  {c.approvedAmount > 0 && <div className="text-[11px] text-teal-600">{peso(c.approvedAmount)} approved</div>}
                </div>
                <Pill status={c.status} />
              </button>
            ))}
          </div>
        )}
      </Card>

      {showAdd && <NewClaimModal patients={patients} clinicId={user?.clinicId ?? ''} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {edit && <UpdateClaimModal claim={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} />}
    </div>
  );
}

function NewClaimModal({ patients, clinicId, onClose, onSaved }: { patients: any[]; clinicId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ patientId: '', provider: HMOS[0], memberId: '', procedure: '', claimAmount: 0, notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/insurance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clinicId }),
      });
      const json = await res.json();
      if (res.ok) onSaved(); else setError(json.error ?? 'Failed to create claim.');
    } catch { setError('Network error.'); } finally { setLoading(false); }
  };

  return (
    <Modal title="New Insurance Claim" onClose={onClose}>
      <div className="space-y-4">
        <Select label="Patient" value={form.patientId} onChange={(e) => set('patientId', e.target.value)}>
          <option value="">Select patient...</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Select label="HMO / Provider" value={form.provider} onChange={(e) => set('provider', e.target.value)}>
            {HMOS.map((h) => <option key={h}>{h}</option>)}
          </Select>
          <Input label="Member / Card ID" value={form.memberId} onChange={(e) => set('memberId', e.target.value)} />
        </div>
        <Input label="Procedure / Reason" value={form.procedure} onChange={(e) => set('procedure', e.target.value)} placeholder="e.g. Tooth extraction" />
        <Input label="Claim Amount (₱)" type="number" value={form.claimAmount} onChange={(e) => set('claimAmount', Number(e.target.value))} />
        <Textarea label="Notes (optional)" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={save} disabled={loading || !form.patientId || !form.provider} className="flex-1">{loading ? 'Saving…' : 'Submit Claim'}</Btn>
        </div>
      </div>
    </Modal>
  );
}

function UpdateClaimModal({ claim, onClose, onSaved }: { claim: any; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState(claim.status);
  const [approvedAmount, setApprovedAmount] = useState(claim.approvedAmount);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await fetch(`/api/insurance/${claim.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approvedAmount }),
      });
      onSaved();
    } finally { setLoading(false); }
  };

  return (
    <Modal title={`Update Claim · ${claim.provider}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="text-sm text-sky-500">{claim.patientName} · {claim.procedure || 'Claim'} · claimed {peso(claim.claimAmount)}</div>
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </Select>
        <Input label="Approved Amount (₱)" type="number" value={approvedAmount} onChange={(e) => setApprovedAmount(Number(e.target.value))} />
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={save} disabled={loading} className="flex-1">{loading ? 'Saving…' : 'Update Claim'}</Btn>
        </div>
      </div>
    </Modal>
  );
}
