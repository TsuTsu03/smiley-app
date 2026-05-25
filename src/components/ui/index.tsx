import clsx from 'clsx';
import { ReactNode } from 'react';

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl border border-teal-50 shadow-soft',
        onClick && 'cursor-pointer card-hover',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const badgeMap: Record<string, string> = {
  confirmed: 'bg-teal-50 text-teal-700 border border-teal-100',
  pending:   'bg-amber-50 text-amber-700 border border-amber-100',
  cancelled: 'bg-red-50 text-red-600 border border-red-100',
  completed: 'bg-slate-50 text-slate-500 border border-slate-100',
  active:    'bg-teal-50 text-teal-700 border border-teal-100',
  inactive:  'bg-slate-50 text-slate-400 border border-slate-100',
};

export function Badge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', badgeMap[status] || badgeMap.active)}>
      {label || status}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, sub, color = 'teal' }: {
  icon: ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    teal:  'bg-teal-50 text-teal-600',
    mint:  'bg-mint-50 text-mint-600',
    amber: 'bg-amber-50 text-amber-600',
    blue:  'bg-blue-50 text-blue-600',
    red:   'bg-red-50 text-red-500',
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-teal-500 uppercase tracking-wide mb-1">{label}</div>
          <div className="text-2xl font-bold text-teal-900">{value}</div>
          {sub && <div className="text-xs text-teal-500 mt-0.5">{sub}</div>}
        </div>
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colors[color] || colors.teal)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
      <div className="min-w-0">
        <h2 className="font-display text-lg sm:text-xl text-teal-900 leading-snug">{title}</h2>
        {sub && <p className="text-sm text-teal-500 mt-0.5">{sub}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-300 flex items-center justify-center mb-4">{icon}</div>
      <div className="font-semibold text-teal-700 mb-1">{title}</div>
      <div className="text-sm text-teal-400 max-w-xs">{desc}</div>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="border-t border-teal-50 my-5" />;
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ onClose, title, children, wide = false }: {
  onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-teal-950/25 backdrop-blur-sm p-0 sm:p-4">
      <div className={clsx('bg-white w-full overflow-hidden animate-slide-up rounded-t-3xl sm:rounded-3xl shadow-hover', wide ? 'sm:max-w-2xl' : 'sm:max-w-lg')}>
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 sm:py-5 border-b border-teal-50">
          <h3 className="font-display text-lg sm:text-xl text-teal-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-teal-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
            ✕
          </button>
        </div>
        <div className="px-4 sm:px-7 py-4 sm:py-7 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-teal-800 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 placeholder-teal-300 focus:border-teal-400 focus:bg-white transition-colors text-sm"
      />
    </div>
  );
}

export function Select({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-teal-800 mb-1.5">{label}</label>
      <select
        {...props}
        className="w-full px-4 py-2.5 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 focus:border-teal-400 focus:bg-white transition-colors text-sm"
      >
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-teal-800 mb-1.5">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-2.5 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 placeholder-teal-300 focus:border-teal-400 focus:bg-white transition-colors text-sm resize-none"
      />
    </div>
  );
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, type, className = '' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md'; disabled?: boolean; type?: 'button' | 'submit'; className?: string;
}) {
  const variants = {
    primary:   'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-soft hover:opacity-90',
    secondary: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
    danger:    'bg-red-50 text-red-600 hover:bg-red-100',
    ghost:     'text-teal-600 hover:bg-teal-50',
  };
  const sizes = { sm: 'px-3.5 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm' };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx('font-semibold rounded-xl transition-all disabled:opacity-40 flex items-center gap-2', variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}
