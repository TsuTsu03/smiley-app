'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { X, Eye, EyeOff, Loader } from 'lucide-react';
import { MOCK_PATIENTS, MOCK_DENTISTS } from '@/lib/data';

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

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate

    if (role === 'admin') {
      if (field1 === 'admin@brightsmile.com' && field2 === 'admin123') {
        login('admin', 'admin-1', 'BrightSmile Dental Clinic', 'brightsmile');
        onClose();
      } else {
        setError('Invalid email or password.');
      }
    } else if (role === 'dentist') {
      const found = MOCK_DENTISTS.find(d => d.email.toLowerCase() === field1.toLowerCase());
      if (found && field2 === 'dentist123') {
        login('dentist', found.id, 'BrightSmile Dental Clinic', 'brightsmile');
        onClose();
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // patient: full name + date of birth
      const found = MOCK_PATIENTS.find(
        p => p.fullName.toLowerCase() === field1.toLowerCase() && p.dateOfBirth === field2
      );
      if (found) {
        login('patient', found.id, 'BrightSmile Dental Clinic', 'brightsmile');
        onClose();
      } else {
        setError('Patient not found. Check your full name and date of birth.');
      }
    }
    setLoading(false);
  };

  const roleLabels = { admin: 'Admin', dentist: 'Dentist', patient: 'Patient' };
  const roleColors = { admin: 'from-blue-600 to-blue-500', dentist: 'from-blue-500 to-blue-500', patient: 'from-blue-500 to-blue-400' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-hover w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleColors[role]} p-7 text-white`}>
          <button onClick={onClose} className="absolute top-5 right-5 p-1 text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="text-xs font-medium uppercase tracking-wider text-white/70 mb-1">Smiley</div>
          <h2 className="font-display text-2xl">{roleLabels[role]} Sign In</h2>
          <p className="text-white/70 text-sm mt-1">BrightSmile Dental Clinic</p>
        </div>

        <div className="p-7">
          {/* Demo hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 mb-5 font-mono">
            {DEMO_CREDS[role].hint}
          </div>

          <div className="space-y-4">
            {role === 'patient' ? (
              <>
                <div>
                  <label className="block text-blue-800 text-sm font-medium mb-1.5">Full Name</label>
                  <input
                    value={field1}
                    onChange={e => setField1(e.target.value)}
                    placeholder="Juan dela Cruz"
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-900 placeholder-blue-300 focus:border-blue-400 focus:bg-white transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-blue-800 text-sm font-medium mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={field2}
                    onChange={e => setField2(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-900 focus:border-blue-400 focus:bg-white transition-colors text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-blue-800 text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={field1}
                    onChange={e => setField1(e.target.value)}
                    placeholder="you@clinic.com"
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-900 placeholder-blue-300 focus:border-blue-400 focus:bg-white transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-blue-800 text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={field2}
                      onChange={e => setField2(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-900 placeholder-blue-300 focus:border-blue-400 focus:bg-white transition-colors text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
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
