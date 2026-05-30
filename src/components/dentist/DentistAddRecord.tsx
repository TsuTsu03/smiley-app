'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, FilePlus } from 'lucide-react';
import { Card, SectionHeader, Input, Select, Textarea, Btn } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { PROCEDURE_TYPES } from '@/lib/data';

export default function DentistAddRecord() {
  const { user, dentistId } = useAuth();
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm]     = useState({
    patientId: '', date: '', procedure: '', tooth: '', diagnosis: '', notes: '', prescription: '', nextVisit: '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!user?.clinicId) return;
    fetch(`/api/patients?clinicId=${user.clinicId}`)
      .then(r => r.json())
      .then(p => setPatients(Array.isArray(p) ? p : []));
  }, [user?.clinicId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: form.patientId,
          dentistId,
          clinicId: user?.clinicId,
          date: form.date,
          procedure: form.procedure,
          tooth: form.tooth || null,
          diagnosis: form.diagnosis,
          notes: form.notes || '',
          prescription: form.prescription || null,
          nextVisit: form.nextVisit || null,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        setError(json.error ?? 'Failed to save record.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    const patient = patients.find(p => p.id === form.patientId);
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <CheckCircle2 size={64} className="text-sky-400 mb-4" />
        <h2 className="font-display text-2xl text-sky-800 mb-2">Record Saved!</h2>
        <p className="text-sky-500 text-sm mb-8">
          Medical record for <strong>{patient?.fullName}</strong> has been added.
        </p>
        <Btn onClick={() => { setDone(false); setError(''); setForm({ patientId:'', date:'', procedure:'', tooth:'', diagnosis:'', notes:'', prescription:'', nextVisit:'' }); }}>
          Add Another Record
        </Btn>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <SectionHeader title="Add Medical Record" sub="Document a procedure or visit" />

      <Card className="p-6 space-y-5">
        <div>
          <h3 className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-4">Visit Details</h3>
          <div className="space-y-4">
            <Select label="Patient *" value={form.patientId} onChange={e => set('patientId', e.target.value)}>
              <option value="">Select patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </Select>
            <Input label="Date *" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            <Select label="Procedure *" value={form.procedure} onChange={e => set('procedure', e.target.value)}>
              <option value="">Select procedure...</option>
              {PROCEDURE_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input label="Tooth / Area" value={form.tooth} onChange={e => set('tooth', e.target.value)} placeholder="e.g. #16, Upper right, Full arch..." />
          </div>
        </div>

        <div className="border-t border-sky-50 pt-5">
          <h3 className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-4">Clinical Notes</h3>
          <div className="space-y-4">
            <Input label="Diagnosis *" value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)} placeholder="Clinical diagnosis..." />
            <Textarea label="Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Observations, patient complaints, treatment done..." />
            <Textarea label="Prescription" value={form.prescription} onChange={e => set('prescription', e.target.value)} rows={2} placeholder="Medications prescribed..." />
            <Input label="Next Visit Date" type="date" value={form.nextVisit} onChange={e => set('nextVisit', e.target.value)} />
          </div>
        </div>

        {error && (
          <div className="px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <Btn
          onClick={handleSubmit}
          disabled={loading || !form.patientId || !form.date || !form.procedure || !form.diagnosis}
          className="w-full justify-center"
        >
          <FilePlus size={16} />
          {loading ? 'Saving…' : 'Save Record'}
        </Btn>
      </Card>
    </div>
  );
}
