'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { CheckCircle2, Calendar, Stethoscope } from 'lucide-react';
import { Card, SectionHeader, Select, Input, Textarea, Btn } from '@/components/ui';
import { PROCEDURE_TYPES } from '@/lib/data';

type BookMode = 'by-date' | 'by-doctor';

export default function PatientBook() {
  const { userId, user } = useAuth();
  const [mode, setMode]   = useState<BookMode>('by-date');
  const [done, setDone]   = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dentists, setDentists] = useState<any[]>([]);
  const [form, setForm]   = useState({ dentistId: '', date: '', time: '', type: '', notes: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  useEffect(() => {
    if (!user?.clinicId) return;
    fetch(`/api/dentists?clinicId=${user.clinicId}`)
      .then(r => r.json())
      .then(d => setDentists(Array.isArray(d) ? d : []));
  }, [user?.clinicId]);

  const handleBook = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: userId,
          clinicId: user?.clinicId,
          dentistId: form.dentistId || null,
          date: form.date,
          time: form.time,
          type: form.type,
          notes: form.notes || null,
          status: 'pending',
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        setError(json.error ?? 'Failed to book appointment.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    const dentist = dentists.find(d => d.id === form.dentistId);
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <CheckCircle2 size={44} className="text-accent" />
        </div>
        <h2 className="font-display text-2xl text-fg mb-2">Appointment Requested!</h2>
        <p className="text-muted text-sm max-w-sm mb-2">
          Your appointment request has been sent. You will receive a confirmation from the clinic.
        </p>
        <div className="bg-bg border border-line rounded-2xl p-4 my-4 text-sm text-left space-y-1.5 min-w-72">
          <div className="flex justify-between"><span className="text-subtle">Procedure</span><span className="font-medium text-fg">{form.type}</span></div>
          <div className="flex justify-between"><span className="text-subtle">Date</span><span className="font-medium text-fg">{form.date}</span></div>
          <div className="flex justify-between"><span className="text-subtle">Time</span><span className="font-medium text-fg">{form.time}</span></div>
          {dentist && <div className="flex justify-between"><span className="text-subtle">Dentist</span><span className="font-medium text-fg">{dentist.fullName}</span></div>}
        </div>
        <Btn onClick={() => { setDone(false); setError(''); setForm({ dentistId:'', date:'', time:'', type:'', notes:'' }); }}>
          Book Another
        </Btn>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <SectionHeader title="Book an Appointment" sub="Choose how you'd like to schedule" />

      {/* Mode selector */}
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {([
            { v: 'by-date',   icon: <Calendar size={18} />,    label: 'Book by Date',   desc: 'Pick a date, see available dentists' },
            { v: 'by-doctor', icon: <Stethoscope size={18} />, label: 'Book by Dentist', desc: 'Choose your preferred dentist' },
          ] as const).map(({ v, icon, label, desc }) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              className={`press flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-colors text-left ${mode === v ? 'border-primary bg-primary/10' : 'border-line hover:border-line-strong'}`}
            >
              <div className={`p-2 rounded-lg ${mode === v ? 'bg-primary text-primary-fg' : 'bg-bg text-muted'}`}>{icon}</div>
              <div>
                <div className="font-semibold text-fg text-sm">{label}</div>
                <div className="text-xs text-subtle">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Form */}
      <Card className="p-6 space-y-4">
        {mode === 'by-doctor' && (
          <div>
            <div className="text-xs font-semibold text-subtle uppercase tracking-wide mb-3">Choose Dentist</div>
            <div className="space-y-2">
              {dentists.map(d => (
                <button
                  key={d.id}
                  onClick={() => set('dentistId', d.id)}
                  className={`press w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-colors ${form.dentistId === d.id ? 'border-primary bg-primary/10' : 'border-line hover:border-line-strong'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {d.fullName.split(' ').slice(-1)[0][0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-fg text-sm">{d.fullName}</div>
                    <div className="text-xs text-muted">{d.specialization}</div>
                  </div>
                  <div className="text-right text-xs text-subtle">
                    {(d.schedule || []).map((s: any) => <div key={s.day}>{s.day}</div>).slice(0, 2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-line pt-4 space-y-4">
          <div className="text-xs font-semibold text-subtle uppercase tracking-wide">Appointment Details</div>
          <Input label="Preferred Date *" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-fg mb-1.5">Preferred Time *</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {TIME_SLOTS.map(t => (
                <button key={t} onClick={() => set('time', t)}
                  className={`press py-2 px-1 rounded-lg text-xs font-medium transition-colors ${form.time === t ? 'bg-primary text-primary-fg' : 'bg-bg text-muted hover:text-fg border border-line'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {mode === 'by-date' && (
            <Select label="Preferred Dentist (optional)" value={form.dentistId} onChange={e => set('dentistId', e.target.value)}>
              <option value="">Any available dentist</option>
              {dentists.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
            </Select>
          )}
          <Select label="Procedure Type *" value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="">What do you need?</option>
            {PROCEDURE_TYPES.map(t => <option key={t}>{t}</option>)}
          </Select>
          <Textarea label="Additional Notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Any specific concerns or requests..." />
        </div>

        {error && (
          <div className="px-4 py-2.5 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
            {error}
          </div>
        )}

        <Btn
          onClick={handleBook}
          disabled={loading || !form.date || !form.time || !form.type}
          className="w-full justify-center mt-2"
        >
          <Calendar size={16} />
          {loading ? 'Requesting…' : 'Request Appointment'}
        </Btn>
      </Card>
    </div>
  );
}
