import {
  SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, ORG_LOGO, FAQS,
  PRICE_LOW, PRICE_CURRENCY,
} from '@/lib/seo';

/**
 * schema.org JSON-LD for AEO/GEO. Server component — the graph is in the initial
 * HTML so crawlers and answer/generative engines read it without running JS.
 *
 * Emits one @graph with:
 *  - Organization  → who Smiley is (entity clarity for GEO)
 *  - WebSite       → site-level identity
 *  - SoftwareApplication → what the product is + category
 *  - FAQPage       → the same Q&A shown on the landing page (AEO)
 */
export default function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: ORG_LOGO,
        description: SITE_DESCRIPTION,
        slogan: SITE_TAGLINE,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#software`,
        name: SITE_NAME,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Dental Clinic Management Software',
        operatingSystem: 'Web',
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
        offers: {
          '@type': 'AggregateOffer',
          category: 'subscription',
          url: `${SITE_URL}/pricing`,
          priceCurrency: PRICE_CURRENCY,
          lowPrice: PRICE_LOW,
          offerCount: 3,
        },
        featureList: [
          'Online appointment booking',
          'Patient records management',
          'Billing and invoices',
          'Insurance claims',
          'Automated reminders',
          'AI assistant for staff and patients',
          'CSV patient import',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
