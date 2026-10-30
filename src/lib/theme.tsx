'use client';

import { createContext, useContext, useSyncExternalStore, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'smiley-theme';

/**
 * Inline script string injected into <head> before paint to avoid a
 * flash of the wrong theme. Reads the stored preference, falling back to
 * the OS setting, and sets data-theme on <html> synchronously.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void; }
const Ctx = createContext<ThemeCtx | null>(null);

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The no-flash script owns the initial value; read it from <html>.
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'light' as Theme);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  }, []);

  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
