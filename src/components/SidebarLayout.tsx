'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  nav: NavItem[];
  active: string;
  onNav: (key: string) => void;
  children: React.ReactNode;
  subtitle?: string;
}

export default function SidebarLayout({ nav, active, onNav, children, subtitle }: Props) {
  const { clinicName, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleColors = {
    admin:   'from-sky-600 to-sky-700',
    dentist: 'from-sky-600 to-teal-500',
    patient: 'from-teal-500 to-sky-500',
  };
  const gradient = roleColors[role!] || roleColors.admin;

  return (
    <div className="flex h-screen bg-sky-50/30 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={clsx(
          'flex-shrink-0 w-64 bg-white border-r border-sky-100 flex flex-col transition-transform duration-300',
          'fixed md:relative inset-y-0 left-0 z-40',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-sky-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
              <span className="text-white text-sm font-bold">✦</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-sky-400 uppercase tracking-wide leading-none mb-0.5">Smiley</div>
              <div className="text-sky-800 font-semibold text-sm truncate leading-tight">{clinicName}</div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        {subtitle && (
          <div className="px-5 py-3 border-b border-sky-50">
            <span className="text-xs font-medium text-sky-500 bg-sky-50 px-2.5 py-1 rounded-full capitalize">
              {role} Portal
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(item => (
            <button
              key={item.key}
              onClick={() => { onNav(item.key); setMobileOpen(false); }}
              className={clsx(
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active === item.key
                  ? 'nav-active'
                  : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {active === item.key && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </button>
          ))}
        </nav>

        {/* Logout + Legal */}
        <div className="px-3 pb-4 border-t border-sky-50 pt-3 space-y-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <div className="flex items-center gap-3 px-3.5 pt-1">
            <Link href="/privacy" target="_blank" className="text-[11px] text-sky-400 hover:text-sky-600 transition-colors">
              Privacy
            </Link>
            <span className="text-sky-200">·</span>
            <Link href="/terms" target="_blank" className="text-[11px] text-sky-400 hover:text-sky-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-sky-900/20 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-white border-b border-sky-100 shadow-sm">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-sky-600 rounded-lg hover:bg-sky-50">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="font-display text-sky-800 text-base">{clinicName}</div>
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-sky-50/40 via-white to-sky-50/30">
          <div className="p-6 md:p-8 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
