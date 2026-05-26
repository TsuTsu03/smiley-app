'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { CheckCircle2, Calendar, User, Stethoscope } from 'lucide-react';
import { Card, SectionHeader, Select, Input, Btn } from '@/components/ui';
import { MOCK_DENTISTS, PROCEDURE_TYPES } from '@/lib/data';

type BookMode = 'by-date' | 'by-doctor';

export default function PatientBook() {
  const { userId } = useAuth();
  const [mode, setMode] = useState<BookMode>('by-date');
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ dentistId: '', date: '', time: '', type: '', notes: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  if (done) {
    const dentist = MOCK_DENTISTS.find(d => d.id === form.dentistId);
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <CheckCircle2 size={44} className="text-blue-400" />
        </div>
        <h2 className="font-display text-2xl text-blue-800 mb-2">Appointment Requested!</h2>
        <p className="text-blue-500 text-sm max-w-sm mb-2">
          Your appointment request has been sent. You will receive a confirmation from the clinic.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 my-4 text-sm text-left space-y-1.5 min-w-72">
          <div className="flex justify-between"><span className="text-blue-400">Procedure</span><span className="font-medium text-blue-800">{form.type}</span></div>
          <div className="flex justify-between"><span className="text-blue-400">Date</span><span className="font-medium text-blue-800">{form.date}</span></div>
          <div className="flex justify-between"><span className="text-blue-400">Time</span><span className="font-medium text-blue-800">{form.time}</span></div>
          {dentist && <div className="flex justify-between"><span className="text-blue-400">Dentist</span><span className="font-medium text-blue-800">{dentist.fullName}</span></div>}
        </div>
        <Btn onClick={() => { setDone(false); setForm({ dentistId:'', date:'', time:'', type:'', notes:'' }); }}>
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
              className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${mode === v ? 'border-blue-500 bg-blue-50' : 'border-blue-100 hover:border-blue-200'}`}
            >
              <div className={`p-2 rounded-lg ${mode === v ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'}`}>{icon}</div>
              <div>
                <div className="font-semibold text-blue-800 text-sm">{label}</div>
                <div className="text-xs text-blue-400">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Form */}
      <Card className="p-6 space-y-4">
        {mode === 'by-doctor' && (
          <div>
            <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-3">Choose Dentist</div>
            <div className="space-y-2">
              {MOCK_DENTISTS.map(d => (
                <button
                  key={d.id}
                  onClick={() => set('dentistId', d.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${form.dentistId === d.id ? 'border-blue-500 bg-blue-50' : 'border-blue-100 hover:border-blue-200'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {d.fullName.split(' ').slice(-1)[0][0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800 text-sm">{d.fullName}</div>
                    <div className="text-xs text-blue-500">{d.specialization}</div>
                  </div>
                  <div className="text-right text-xs text-blue-400">
                    {d.schedule.map(s => <div key={s.day}>{s.day}</div>).slice(0, 2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-blue-50 pt-4 space-y-4">
          <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Appointment Details</div>
          <Input label="Preferred Date *" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1.5">Preferred Time *</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {TIME_SLOTS.map(t => (
                <button key={t} onClick={() => set('time', t)}
                  className={`py-2 px-1 rounded-lg text-xs font-medium transition-colors ${form.time === t ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {mode === 'by-date' && (
            <Select label="Preferred Dentist (optional)" value={form.dentistId} onChange={e => set('dentistId', e.target.value)}>
              <option value="">Any available dentist</option>
              {MOCK_DENTISTS.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
            </Select>
          )}
          <Select label="Procedure Type *" value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="">What do you need?</option>
            {PROCEDURE_TYPES.map(t => <option key={t}>{t}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1.5">Additional Notes</label>
            <textarea
              value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={2} placeholder="Any specific concerns or requests..."
              className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-900 text-sm resize-none focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        <Btn
          onClick={() => setDone(true)}
          disabled={!form.date || !form.time || !form.type}
          className="w-full justify-center mt-2"
        >
          <Calendar size={16} />
          Request Appointment
        </Btn>
      </Card>
    </div>
  );
}
