'use client';

import clsx from 'clsx';
import { ReactNode, useEffect } from 'react';
import { X, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

/* ════════════════════════════════════════════════════════════════
   Smiley UI kit — token-based, theme-aware primitives.
   Every interactive element ships default/hover/focus-visible/active/
   disabled states; motion uses Emil ease-out curves under 250ms and
   respects reduced motion via globals.css.
   ════════════════════════════════════════════════════════════════ */

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const interactive = !!onClick;
  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={clsx(
        'bg-surface rounded-2xl border border-line shadow-soft',
        interactive && 'cursor-pointer card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const badgeMap: Record<string, string> = {
  confirmed: 'bg-primary/10 text-primary border-primary/25',
  active:    'bg-accent/10 text-accent border-accent/25',
  pending:   'bg-warning/10 text-warning border-warning/25',
  cancelled: 'bg-danger/10 text-danger border-danger/25',
  completed: 'bg-muted/10 text-muted border-line-strong',
  inactive:  'bg-muted/10 text-subtle border-line-strong',
};
const dotMap: Record<string, string> = {
  confirmed: 'bg-primary', active: 'bg-accent', pending: 'bg-warning',
  cancelled: 'bg-danger', completed: 'bg-muted', inactive: 'bg-subtle',
};

export function Badge({ status, label, dot = false }: { status: string; label?: string; dot?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border', badgeMap[status] || badgeMap.active)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotMap[status] || dotMap.active)} />}
      {label || status}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const statTones: Record<string, string> = {
  teal:  'bg-teal-500/12 text-teal-600 dark:text-teal-300',
  mint:  'bg-teal-500/12 text-teal-600 dark:text-teal-300',
  amber: 'bg-amber-500/12 text-amber-600 dark:text-amber-300',
  blue:  'bg-sky-500/12 text-sky-600 dark:text-sky-300',
  red:   'bg-red-500/12 text-red-600 dark:text-red-300',
};

export function StatCard({ icon, label, value, sub, color = 'teal' }: {
  icon: ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <Card className="p-5 group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-subtle uppercase tracking-wide mb-1.5">{label}</div>
          <div className="text-2xl font-bold text-fg tabular-nums leading-none">{value}</div>
          {sub && <div className="text-xs text-muted mt-1.5">{sub}</div>}
        </div>
        <div className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 ease-out-expo group-hover:scale-110',
          statTones[color] || statTones.teal
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h2 className="font-display text-lg sm:text-xl text-fg leading-snug">{title}</h2>
        {sub && <p className="text-sm text-muted mt-0.5">{sub}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: { icon: ReactNode; title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/8 text-primary/70 flex items-center justify-center mb-4 ring-1 ring-line">{icon}</div>
      <div className="font-semibold text-fg mb-1">{title}</div>
      <div className="text-sm text-muted max-w-xs">{desc}</div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="border-t border-line my-5" />;
}

// ─── Skeleton / Spinner ─────────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={clsx('skeleton rounded-lg', className)} />;
}
export function Spinner({ size = 18, className = '' }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={clsx('animate-spin', className)} />;
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 36, className = '' }: { name: string; size?: number; className?: string }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span
      className={clsx('inline-flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-teal-500 text-white font-semibold shrink-0', className)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

// ─── Theme toggle ──────────────────────────────────────────────────────────────
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={clsx(
        'press grid place-items-center w-9 h-9 rounded-xl border border-line text-muted bg-surface',
        'hover:text-fg hover:border-line-strong transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70', className
      )}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ onClose, title, children, wide = false }: {
  onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[rgb(var(--overlay)/0.45)] backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'bg-surface w-full overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-hover ring-1 ring-line animate-slide-up sm:animate-scale-in',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        )}
      >
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 sm:py-5 border-b border-line">
          <h3 className="font-display text-lg sm:text-xl text-fg">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="press grid place-items-center w-8 h-8 text-subtle hover:text-fg hover:bg-bg rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 sm:px-7 py-4 sm:py-7 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── Form fields ────────────────────────────────────────────────────────────────
const fieldBase =
  'w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-fg text-sm ' +
  'transition-[border-color,box-shadow,background-color] duration-200 ease-out-expo ' +
  'focus:bg-surface focus:outline-none focus:border-primary focus:shadow-ring';

export function Input({ label, error, hint, ...props }: { label?: string; error?: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-fg mb-1.5">{label}</label>}
      <input
        {...props}
        aria-invalid={!!error}
        className={clsx(fieldBase, 'placeholder-subtle', error && 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgb(var(--danger)/0.25)]')}
      />
      {error ? <p className="text-xs text-danger mt-1.5">{error}</p> : hint ? <p className="text-xs text-subtle mt-1.5">{hint}</p> : null}
    </div>
  );
}

export function Select({ label, children, ...props }: { label?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-fg mb-1.5">{label}</label>}
      <select {...props} className={clsx(fieldBase, 'cursor-pointer')}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-fg mb-1.5">{label}</label>}
      <textarea {...props} className={clsx(fieldBase, 'placeholder-subtle resize-none')} />
    </div>
  );
}

// ─── Button ────────────────────────────────────────────────────────────────────
const btnVariants = {
  primary:   'bg-primary text-primary-fg shadow-soft hover:bg-primary-hover hover:shadow-[0_6px_20px_-4px_rgb(var(--primary)/0.45)]',
  secondary: 'bg-surface text-fg border border-line hover:bg-bg hover:border-line-strong',
  danger:    'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15',
  ghost:     'text-fg hover:bg-bg',
};
const btnSizes = { sm: 'px-3.5 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm' };

export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, loading, type, className = '' }: {
  children: ReactNode; onClick?: () => void; variant?: keyof typeof btnVariants;
  size?: 'sm' | 'md'; disabled?: boolean; loading?: boolean; type?: 'button' | 'submit'; className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(
        'press font-semibold rounded-xl transition-[background,box-shadow,border-color,opacity] duration-200 ease-out-expo',
        'inline-flex items-center justify-center gap-2 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:opacity-50 disabled:pointer-events-none',
        btnVariants[variant], btnSizes[size], className
      )}
    >
      {loading && <Loader2 size={size === 'sm' ? 13 : 15} className="animate-spin" />}
      {children}
    </button>
  );
}
// Alias for clearer call-sites in new code
export const Button = Btn;

// ─── Icon button ───────────────────────────────────────────────────────────────
export function IconButton({ children, onClick, label, className = '' }: { children: ReactNode; onClick?: () => void; label: string; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={clsx('press grid place-items-center w-9 h-9 rounded-xl text-muted hover:text-fg hover:bg-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70', className)}
    >
      {children}
    </button>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string }[]; active: string; onChange: (k: string) => void }) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-bg border border-line">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          aria-current={active === t.key ? 'page' : undefined}
          className={clsx(
            'press px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70',
            active === t.key ? 'bg-surface text-fg shadow-soft' : 'text-muted hover:text-fg'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
