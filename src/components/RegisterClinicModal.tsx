'use client';

import { useState } from 'react';
import { X, CheckCircle2, Loader, Building2 } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterClinicModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clinicName: '',
    slug: '',
    address: '',
    phone: '',
    email: '',
    adminName: '',
    adminEmail: '',
    password: '',
  });

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === 'clinicName') {
      setForm(f => ({ ...f, clinicName: v, slug: v.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-hover w-full max-w-lg overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-teal-700 to-coral-500 p-7 text-white relative">
          <button onClick={onClose} className="absolute top-5 right-5 p-1 text-white/70 hover:text-white">
            <X size={20} />
          </button>
          <div className="text-xs font-medium uppercase tracking-wider text-white/70 mb-1">Smiley</div>
          <h2 className="font-display text-2xl">Register Your Clinic</h2>
          <p className="text-white/70 text-sm mt-1">Get your own branded portal in minutes</p>
          {/* Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2].map(s => (
              <div key={s} className={`h-1.5 rounded-full flex-1 transition-all ${step >= s ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>

        <div className="p-7">
          {step === 3 ? (
            <div className="text-center py-6">
              <CheckCircle2 size={56} className="text-teal-500 mx-auto mb-4" />
              <h3 className="font-display text-2xl text-teal-800 mb-2">You&apos;re all set!</h3>
              <p className="text-teal-600/70 text-sm mb-2">Your clinic portal is ready at:</p>
              <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 font-mono text-teal-700 text-sm mb-6">
                {form.slug || 'yourclinic'}.dentaflow.app
              </div>
              <button
                onClick={onSuccess}
                className="w-full py-3.5 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-xl shadow-coral hover:opacity-90 transition-opacity"
              >
                Go to Admin Dashboard
              </button>
            </div>
          ) : step === 1 ? (
            <>
              <h3 className="font-semibold text-teal-800 mb-4">Clinic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-teal-800 mb-1.5 block">Clinic Name *</label>
                  <input value={form.clinicName} onChange={e => set('clinicName', e.target.value)}
                    placeholder="BrightSmile Dental Clinic"
                    className="w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 text-sm focus:border-teal-400 focus:bg-white transition-colors" />
                </div>
                {form.slug && (
                  <div className="flex items-center gap-2 text-xs text-teal-600 bg-teal-50 rounded-lg px-3 py-2">
                    <Building2 size={12} />
                    Your portal: <span className="font-mono font-semibold">{form.slug}.dentaflow.app</span>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-teal-800 mb-1.5 block">Clinic Address *</label>
                  <input value={form.address} onChange={e => set('address', e.target.value)}
                    placeholder="123 Mabini St., Makati City"
                    className="w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 text-sm focus:border-teal-400 focus:bg-white transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-teal-800 mb-1.5 block">Phone</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="(02) 8123-4567"
                      className="w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 text-sm focus:border-teal-400 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-teal-800 mb-1.5 block">Email</label>
                    <input value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="hello@clinic.com"
                      className="w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 text-sm focus:border-teal-400 focus:bg-white transition-colors" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!form.clinicName || !form.address}
                className="mt-5 w-full py-3.5 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-xl shadow-coral hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-teal-800 mb-4">Admin Account</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-teal-800 mb-1.5 block">Your Full Name *</label>
                  <input value={form.adminName} onChange={e => set('adminName', e.target.value)}
                    placeholder="Dr. Ana Reyes"
                    className="w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 text-sm focus:border-teal-400 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium text-teal-800 mb-1.5 block">Admin Email *</label>
                  <input type="email" value={form.adminEmail} onChange={e => set('adminEmail', e.target.value)}
                    placeholder="admin@yourclinic.com"
                    className="w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 text-sm focus:border-teal-400 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium text-teal-800 mb-1.5 block">Password *</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 text-sm focus:border-teal-400 focus:bg-white transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 bg-teal-50 text-teal-700 font-semibold rounded-xl hover:bg-teal-100 transition-colors">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.adminName || !form.adminEmail || !form.password}
                  className="flex-1 py-3.5 bg-gradient-to-r from-coral-500 to-coral-400 text-white font-semibold rounded-xl shadow-coral hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader size={15} className="animate-spin" /> Creating…</> : 'Create Clinic'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
