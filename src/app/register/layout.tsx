import type { Metadata } from 'next';

// SEO metadata for the (client) clinic-registration page.
export const metadata: Metadata = {
  title: 'Register Your Clinic',
  description:
    'Set up your dental clinic on Smiley in minutes — online booking, patient records, billing, and an AI assistant. Create your clinic account today.',
  alternates: { canonical: '/register' },
  openGraph: {
    title: 'Register Your Dental Clinic — Smiley',
    description:
      'Create your clinic account and start managing bookings, patients, and billing with Smiley.',
    url: '/register',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
