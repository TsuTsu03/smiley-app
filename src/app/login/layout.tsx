import type { Metadata } from 'next';

// Auth pages carry no SEO value and shouldn't appear in search results, so the
// whole /login/* group is noindex (still followable). Applies to /login and the
// role-specific sign-in pages.
export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: true },
  alternates: { canonical: '/login' },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
