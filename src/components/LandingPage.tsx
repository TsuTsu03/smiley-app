'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Tooth, ChevronRight, Building2, CheckCircle2, Star, Users, Calendar, Shield } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterClinicModal from './RegisterClinicModal';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState<'admin' | 'dentist' | 'patient'>('admin');
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = (role: 'admin' | 'dentist' | 'patient') => {
    setLoginRole(role);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-mint-50 font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold leading-none">✦</span>
          </div>
          <div>
            <span className="text-teal-800 font-display text-lg font-semibold">Smiley</span>
            <span className="text-teal-400 text-xs block leading-none -mt-0.5 font-sans">clinic management</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegister(true)}
            className="px-4 py-2 text-teal-700 font-medium text-sm hover:text-teal-900 transition-colors"
          >
            Register Clinic
          </button>
          <button
            onClick={() => openLogin('admin')}
            className="px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-soft"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 page-enter">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-4 py-1.5 rounded-full text-teal-700 text-sm font-medium mb-5 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Built for dental clinics
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-teal-900 leading-tight mb-4 sm:mb-5">
            Manage your clinic<br />
            <em className="text-teal-500 not-italic">beautifully.</em>
          </h1>
          <p className="text-teal-700/70 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto">
            Patient records, appointments, reminders — all in one place. Each clinic gets its own branded portal.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowRegister(true)}
              className="flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold rounded-2xl shadow-card hover:shadow-hover transition-all hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <Building2 size={18} />
              Register Your Clinic
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => openLogin('admin')}
              className="flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-teal-700 font-semibold rounded-2xl border border-teal-100 shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Demo login cards */}
        <div className="mt-8 mb-16">
          <p className="text-center text-teal-600/60 text-sm font-medium mb-5 uppercase tracking-wider">Try the demo</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { role: 'admin' as const,   emoji: '⚙️', label: 'Admin Portal',   desc: 'Manage patients, schedules & reminders', color: 'from-teal-500 to-teal-600' },
              { role: 'dentist' as const, emoji: '🦷', label: 'Dentist Portal', desc: 'Access records & manage appointments',     color: 'from-mint-500 to-teal-500' },
              { role: 'patient' as const, emoji: '😊', label: 'Patient Portal', desc: 'View records & book appointments',          color: 'from-teal-400 to-mint-400' },
            ].map(({ role, emoji, label, desc, color }) => (
              <button
                key={role}
                onClick={() => openLogin(role)}
                className="group relative bg-white rounded-2xl p-5 border border-teal-50 shadow-soft hover:shadow-card transition-all hover:-translate-y-1 text-left card-hover overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="text-3xl mb-3">{emoji}</div>
                <div className="font-semibold text-teal-800 mb-1">{label}</div>
                <div className="text-sm text-teal-600/60">{desc}</div>
                <div className="mt-3 flex items-center gap-1 text-teal-500 text-sm font-medium">
                  Enter demo <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            { icon: <Users size={20} />, title: 'Patient Records', desc: 'Complete medical history across all clinic dentists' },
            { icon: <Calendar size={20} />, title: 'Smart Booking', desc: 'Book by date or by dentist — easy for everyone' },
            { icon: <Shield size={20} />, title: 'Reminders', desc: 'Auto SMS & email reminders for adjustments' },
            { icon: <Star size={20} />, title: 'Clinic Branding', desc: 'Your own subdomain — brightsmile.dentaflow.app' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-teal-50 shadow-soft">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                {icon}
              </div>
              <div className="font-semibold text-teal-800 text-sm mb-1">{title}</div>
              <div className="text-xs text-teal-600/60 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Modals */}
      {showLogin && (
        <LoginModal role={loginRole} onClose={() => setShowLogin(false)} />
      )}
      {showRegister && (
        <RegisterClinicModal onClose={() => setShowRegister(false)} onSuccess={() => { setShowRegister(false); openLogin('admin'); }} />
      )}
    </div>
  );
}
