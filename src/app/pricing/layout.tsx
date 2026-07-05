import type { Metadata } from 'next';

// The pricing page is a client component, so its SEO metadata lives here in a
// server layout wrapper (unique title/description + canonical).
export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Smiley pricing for dental clinics — simple subscription plans for online booking, patient records, billing, and the AI assistant. See plans or request a demo.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Smiley Pricing — Dental Clinic Software Plans',
    description:
      'Simple subscription plans for dental clinics: online booking, patient records, billing, and an AI assistant.',
    url: '/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
