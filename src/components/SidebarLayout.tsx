'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { SmileyIcon } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui';

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
  /** Hide the dark-mode toggle (used on portals still locked to light). */
  lockTheme?: boolean;
}

export default function SidebarLayout({ nav, active, onNav, children, subtitle, lockTheme = false }: Props) {
  const { clinicName, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar */}
      <aside
        className={clsx(
          'flex-shrink-0 w-64 bg-raised border-r border-line flex flex-col transition-transform duration-300 ease-drawer',
          'fixed md:relative inset-y-0 left-0 z-40',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-line">
          <div className="flex items-center gap-2.5">
            <SmileyIcon size={34} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-subtle uppercase tracking-wide leading-none mb-0.5">Smiley <span className="opacity-70 normal-case">by StackWise</span></div>
              <div className="text-fg font-semibold text-sm truncate leading-tight">{clinicName}</div>
            </div>
          </div>
        </div>

        {/* Role badge + theme */}
        {subtitle && (
          <div className="px-5 py-3 border-b border-line flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full capitalize">
              {role} Portal
            </span>
            {!lockTheme && <ThemeToggle className="w-8 h-8" />}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(item => (
            <button
              key={item.key}
              onClick={() => { onNav(item.key); setMobileOpen(false); }}
              aria-current={active === item.key ? 'page' : undefined}
              className={clsx(
                'press w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium',
                'transition-[background,color,box-shadow] duration-200 ease-out-expo',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70',
                active === item.key
                  ? 'nav-active'
                  : 'text-muted hover:bg-bg hover:text-fg'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {active === item.key && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </button>
          ))}
        </nav>

        {/* Logout + Legal */}
        <div className="px-3 pb-4 border-t border-line pt-3 space-y-1">
          <button
            onClick={logout}
            className="press w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-danger/10 hover:text-danger transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <div className="flex items-center gap-3 px-3.5 pt-1">
            <Link href="/privacy" target="_blank" className="text-[11px] text-subtle hover:text-fg transition-colors">
              Privacy
            </Link>
            <span className="text-line-strong">·</span>
            <Link href="/terms" target="_blank" className="text-[11px] text-subtle hover:text-fg transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[rgb(var(--overlay)/0.30)] z-30 md:hidden animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-raised border-b border-line">
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation" className="press p-1.5 text-muted hover:text-fg rounded-lg hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="font-display text-fg text-base truncate">{clinicName}</div>
          {lockTheme ? <div className="w-8" /> : <ThemeToggle className="w-8 h-8" />}
        </div>

        <main className="flex-1 overflow-y-auto bg-bg">
          <div className="p-6 md:p-8 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
