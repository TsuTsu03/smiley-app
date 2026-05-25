'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role } from './data';

interface AuthContextType {
  role: Role | null;
  userId: string | null;
  clinicName: string;
  clinicSlug: string;
  login: (role: Role, userId: string, clinicName: string, clinicSlug: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState('');
  const [clinicSlug, setClinicSlug] = useState('');

  const login = (r: Role, uid: string, cn: string, cs: string) => {
    setRole(r);
    setUserId(uid);
    setClinicName(cn);
    setClinicSlug(cs);
  };

  const logout = () => {
    setRole(null);
    setUserId(null);
    setClinicName('');
    setClinicSlug('');
  };

  return (
    <AuthContext.Provider value={{ role, userId, clinicName, clinicSlug, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
