'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
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
    admin:   'from-teal-600 to-teal-700',
    dentist: 'from-teal-600 to-coral-500',
    patient: 'from-coral-500 to-teal-500',
  };
  const gradient = roleColors[role!] || roleColors.admin;

  return (
    <div className="flex h-screen bg-teal-50/30 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={clsx(
          'flex-shrink-0 w-64 bg-white border-r border-teal-100 flex flex-col transition-transform duration-300',
          'fixed md:relative inset-y-0 left-0 z-40',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-teal-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
              <span className="text-white text-sm font-bold">✦</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-teal-400 uppercase tracking-wide leading-none mb-0.5">Smiley</div>
              <div className="text-teal-800 font-semibold text-sm truncate leading-tight">{clinicName}</div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        {subtitle && (
          <div className="px-5 py-3 border-b border-teal-50">
            <span className="text-xs font-medium text-teal-500 bg-teal-50 px-2.5 py-1 rounded-full capitalize">
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
                  : 'text-teal-700 hover:bg-teal-50 hover:text-teal-900'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {active === item.key && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-teal-50 pt-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-teal-900/20 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-white border-b border-teal-100 shadow-sm">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-teal-600 rounded-lg hover:bg-teal-50">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="font-display text-teal-800 text-base">{clinicName}</div>
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-teal-50/40 via-white to-mint-50/30">
          <div className="p-6 md:p-8 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
