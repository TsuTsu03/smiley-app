import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import { PLAN_PRICING, PLAN_CURRENCY } from '@/lib/plans';

// The pricing page is a client component, so its SEO metadata lives here in a
// server layout wrapper (unique title/description + canonical).
export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Smiley pricing for dental clinics: simple subscription plans for online booking, patient records, billing, and the AI assistant. See plans or request a demo.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Smiley Pricing: Dental Clinic Software Plans',
    description:
      'Simple subscription plans for dental clinics: online booking, patient records, billing, and an AI assistant.',
    url: '/pricing',
  },
};

// Page-scoped Product/Offer JSON-LD — the homepage schema only carries an
// aggregate price range, so search engines have no per-plan pricing for the
// page people actually search "Smiley pricing" to find.
function PricingStructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${SITE_NAME} Dental Clinic Management Software`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: Object.values(PLAN_PRICING).map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} Plan`,
      url: `${SITE_URL}/pricing`,
      priceCurrency: PLAN_CURRENCY,
      price: plan.monthly,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.monthly,
        priceCurrency: PLAN_CURRENCY,
        unitText: plan.unit === '/branch' ? 'branch per month' : 'month',
      },
      availability: 'https://schema.org/InStock',
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PricingStructuredData />
      {children}
    </>
  );
}
