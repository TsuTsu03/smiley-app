'use client';

import { useState } from 'react';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { Card, Input, Select, Textarea, Btn, SectionHeader } from '@/components/ui';

export default function AdminRegisterPatient() {
  const [done, setDone]   = useState(false);
  const [form, setForm]   = useState({
    fullName: '', dateOfBirth: '', gender: '', phone: '', email: '',
    address: '', bloodType: '', allergies: '', emergencyContact: '', emergencyPhone: '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <CheckCircle2 size={64} className="text-sky-400 mb-4" />
        <h2 className="font-display text-2xl text-sky-800 mb-2">Patient Registered!</h2>
        <p className="text-sky-500 text-sm mb-2">
          <strong>{form.fullName}</strong> has been added to the clinic records.
        </p>
        <p className="text-sky-400 text-xs mb-8">
          They can log in using their full name and date of birth.
        </p>
        <Btn onClick={() => { setDone(false); setForm({ fullName:'',dateOfBirth:'',gender:'',phone:'',email:'',address:'',bloodType:'',allergies:'',emergencyContact:'',emergencyPhone:'' }); }}>
          Register Another Patient
        </Btn>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <SectionHeader title="Register New Patient" sub="First-visit patients are registered by the admin" />

      <Card className="p-6 space-y-5">
        <div>
          <h3 className="font-semibold text-sky-700 text-sm uppercase tracking-wide mb-4">Personal Information</h3>
          <div className="space-y-4">
            <Input label="Full Name *" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Juan dela Cruz" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Date of Birth *" type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
              <Select label="Gender *" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <Textarea label="Address" value={form.address} onChange={e => set('address', e.target.value)} rows={2} placeholder="Street, City, Province" />
          </div>
        </div>

        <div className="border-t border-sky-50 pt-5">
          <h3 className="font-semibold text-sky-700 text-sm uppercase tracking-wide mb-4">Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Phone *" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0917-XXX-XXXX" />
            <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="patient@email.com" />
          </div>
        </div>

        <div className="border-t border-sky-50 pt-5">
          <h3 className="font-semibold text-sky-700 text-sm uppercase tracking-wide mb-4">Medical Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select label="Blood Type" value={form.bloodType} onChange={e => set('bloodType', e.target.value)}>
                <option value="">Unknown</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t}>{t}</option>)}
              </Select>
            </div>
            <Input label="Allergies" value={form.allergies} onChange={e => set('allergies', e.target.value)} placeholder="Penicillin, Latex... or 'None'" />
          </div>
        </div>

        <div className="border-t border-sky-50 pt-5">
          <h3 className="font-semibold text-sky-700 text-sm uppercase tracking-wide mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Contact Name" value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} placeholder="Full name" />
            <Input label="Contact Phone" value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} placeholder="0917-XXX-XXXX" />
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-sm text-sky-600">
          <strong>Login credentials:</strong> The patient will use their <strong>Full Name</strong> + <strong>Date of Birth</strong> to sign in.
        </div>

        <Btn
          onClick={() => setDone(true)}
          disabled={!form.fullName || !form.dateOfBirth || !form.gender || !form.phone}
          className="w-full justify-center"
        >
          <UserPlus size={16} />
          Register Patient
        </Btn>
      </Card>
    </div>
  );
}
