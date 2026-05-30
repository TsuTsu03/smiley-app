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
  user: AuthUser | null;
  loading: boolean;
  login: (emailOrName: string, passwordOrDob: string, asPatient?: boolean) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [clinicName, setClinicName] = useState('');
  const [clinicSlug, setClinicSlug] = useState('');
  const [loading, setLoading] = useState(true);

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
        setClinicName(json.clinic?.name ?? '');
        setClinicSlug(json.clinic?.slug ?? '');
      } else {
        setUser(null);
        setClinicName('');
        setClinicSlug('');
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
    asPatient = false
  ): Promise<{ error?: string }> {
    const endpoint = asPatient ? '/api/auth/patient-login' : '/api/auth/login';
    const body = asPatient
      ? { fullName: emailOrName, dateOfBirth: passwordOrDob }
      : { email: emailOrName, password: passwordOrDob };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error ?? 'Login failed' };
    setUser(json.user);
    setClinicName(json.clinic?.name ?? '');
    setClinicSlug(json.clinic?.slug ?? '');
    return {};
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setClinicName('');
    setClinicSlug('');
  }

  return (
    <AuthContext.Provider
      value={{
        role: user?.role ?? null,
        userId: user?.id ?? null,
        dentistId: user?.dentistId ?? null,
        clinicName,
        clinicSlug,
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
