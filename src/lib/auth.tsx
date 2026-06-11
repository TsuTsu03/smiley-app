'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Role } from './data';

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  clinicId: string;
  dentistId?: string | null;
}

interface AuthContextType {
  role: Role | null;
  userId: string | null;
  dentistId: string | null;
  clinicName: string;
  clinicSlug: string;
  subscriptionActive: boolean;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  user: AuthUser | null;
  loading: boolean;
  login: (
    emailOrName: string,
    passwordOrDob: string,
    asPatient?: boolean,
    otp?: string
  ) => Promise<{ error?: string; otpRequired?: boolean; email?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [clinicName, setClinicName] = useState('');
  const [clinicSlug, setClinicSlug] = useState('');
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState('trialing');
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function applyClinic(clinic: any) {
    setClinicName(clinic?.name ?? '');
    setClinicSlug(clinic?.slug ?? '');
    setSubscriptionActive(clinic?.subscriptionActive ?? true);
    setSubscriptionStatus(clinic?.subscriptionStatus ?? 'trialing');
    setTrialEndsAt(clinic?.trialEndsAt ?? null);
  }

  useEffect(() => {
    fetchMe();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchMe();
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchMe() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        setUser(json.user);
        applyClinic(json.clinic);
      } else {
        setUser(null);
        applyClinic(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(
    emailOrName: string,
    passwordOrDob: string,
    asPatient = false,
    otp?: string
  ): Promise<{ error?: string; otpRequired?: boolean; email?: string }> {
    const endpoint = asPatient ? '/api/auth/patient-login' : '/api/auth/login';
    const body = asPatient
      ? { fullName: emailOrName, dateOfBirth: passwordOrDob, otp }
      : { email: emailOrName, password: passwordOrDob };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error ?? 'Login failed' };
    // Patient flow step 1: a code was emailed; the session isn't created yet.
    if (json.otpRequired) return { otpRequired: true, email: json.email };
    setUser(json.user);
    applyClinic(json.clinic);
    return {};
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    applyClinic(null);
  }

  return (
    <AuthContext.Provider
      value={{
        role: user?.role ?? null,
        userId: user?.id ?? null,
        dentistId: user?.dentistId ?? null,
        clinicName,
        clinicSlug,
        subscriptionActive,
        subscriptionStatus,
        trialEndsAt,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
