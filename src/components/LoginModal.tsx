'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { X, Eye, EyeOff, Loader } from 'lucide-react';

interface Props {
  role: 'admin' | 'dentist' | 'patient';
  onClose: () => void;
}

const DEMO_CREDS = {
  admin:   { hint: 'Email: admin@brightsmile.com  •  Password: admin123' },
  dentist: { hint: 'Email: maria@brightsmile.com  •  Password: dentist123' },
  patient: { hint: 'Full name: Juan dela Cruz  •  Date of Birth: 1990-03-15' },
};

export default function LoginModal({ role, onClose }: Props) {
  const { login } = useAuth();
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPatient = role === 'patient';
  const notFound = isPatient && error.toLowerCase().includes('not found');

  const handleLogin = async () => {
    setError('');
    if (!field1 || !field2) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = await login(field1, field2, isPatient);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onClose();
    }
  };

  const roleLabels = { admin: 'Admin', dentist: 'Dentist', patient: 'Patient' };
  const roleColors = {
    admin:   'from-sky-600 to-sky-500',
    dentist: 'from-sky-500 to-sky-500',
    patient: 'from-sky-500 to-sky-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-hover w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleColors[role]} p-7 text-white relative`}>
          <button onClick={onClose} className="absolute top-5 right-5 p-1 text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="text-xs font-medium uppercase tracking-wider text-white/70 mb-1">Smiley</div>
          <h2 className="font-display text-2xl">{roleLabels[role]} Sign In</h2>
          <p className="text-white/70 text-sm mt-1">BrightSmile Dental Clinic</p>
        </div>

        <div className="p-7">
          {/* Demo hint */}
          <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-xs text-sky-700 mb-5 font-mono">
            {DEMO_CREDS[role].hint}
          </div>

          <div className="space-y-4">
            {isPatient ? (
              <>
                <div>
                  <label className="block text-sky-800 text-sm font-medium mb-1.5">Full Name</label>
                  <input
                    value={field1}
                    onChange={e => setField1(e.target.value)}
                    placeholder="Juan dela Cruz"
                    className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 placeholder-sky-300 focus:border-sky-400 focus:bg-white transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sky-800 text-sm font-medium mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={field2}
                    onChange={e => setField2(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 focus:border-sky-400 focus:bg-white transition-colors text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sky-800 text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={field1}
                    onChange={e => setField1(e.target.value)}
                    placeholder="you@clinic.com"
                    className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 placeholder-sky-300 focus:border-sky-400 focus:bg-white transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sky-800 text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={field2}
                      onChange={e => setField2(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 placeholder-sky-300 focus:border-sky-400 focus:bg-white transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className={`mt-4 text-sm rounded-xl px-4 py-3 border ${notFound ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-red-50 border-red-100 text-red-600'}`}>
              {notFound ? (
                <>
                  <p className="font-medium mb-1">Not registered yet</p>
                  <p className="text-xs leading-relaxed">
                    Your name and date of birth weren&apos;t found in our records. Please visit the clinic and ask the staff to register you — they&apos;ll set up your patient profile.
                  </p>
                </>
              ) : (
                error
              )}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`mt-5 w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${roleColors[role]} hover:opacity-90 transition-opacity shadow-soft disabled:opacity-60 flex items-center justify-center gap-2`}
          >
            {loading ? <><Loader size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
