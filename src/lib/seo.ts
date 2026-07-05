/**
 * Single source of truth for SEO / AEO / GEO metadata.
 *
 * SEO   — titles, descriptions, canonical URLs, sitemap, robots.
 * AEO   — the FAQ below is rendered BOTH as visible copy and as FAQPage
 *         JSON-LD, so answer engines (Google AI Overviews, Bing) quote the
 *         exact same wording they can see.
 * GEO   — the same facts feed public/llms.txt and the Organization /
 *         SoftwareApplication schema so generative engines describe Smiley
 *         accurately and citably.
 *
 * Set NEXT_PUBLIC_SITE_URL to the production origin (e.g. https://smiley.ph)
 * in the deployment env. The fallback is only used locally.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://smileyhq.it.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Smiley';
export const SITE_TAGLINE = 'Smart Dental Clinic Management Software';
export const SITE_DESCRIPTION =
  'Cloud-based dental clinic software for the Philippines. Online booking, patient records, billing, and an AI assistant for staff and patients.';

export const SITE_KEYWORDS = [
  'dental clinic management software',
  'dental practice management',
  'online dental appointment booking',
  'patient records system',
  'dental clinic software Philippines',
  'dental billing software',
  'clinic management system',
  'dental EMR',
];

// Plan pricing lives in ./plans.ts (the single source of truth); re-exported
// here so existing SEO consumers don't need a second import.
export { PRICE_LOW, PLAN_CURRENCY as PRICE_CURRENCY } from './plans';

export const ORG_LOGO = `${SITE_URL}/icon.svg`;
export const OG_IMAGE = `${SITE_URL}/opengraph-image`;

/** Public marketing routes worth indexing (used by the sitemap). */
export const PUBLIC_ROUTES = ['/', '/pricing', '/register', '/login', '/privacy', '/terms'];

/** AEO/GEO FAQ — kept concise and factual so it is quotable verbatim. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Smiley?',
    a: 'Smiley is cloud-based dental clinic management software. It handles online appointment booking, patient records, billing and invoices, insurance claims, and automated reminders in one place, with an AI assistant for staff and patients.',
  },
  {
    q: 'How do patients book an appointment?',
    a: 'Patients book online through the clinic’s Smiley portal, choosing a dentist, date, and procedure, and get reminders automatically. Returning patients sign in with their name and date of birth plus a one-time code sent to their email, so there is no password to remember.',
  },
  {
    q: 'Is patient data secure and private?',
    a: 'Yes. Each clinic’s data is isolated at the database level with row-level security, every record change is written to an audit log, and the system is built to align with the Philippine Data Privacy Act (RA 10173).',
  },
  {
    q: 'Does Smiley have AI features?',
    a: 'Yes. Staff can ask an AI assistant about patients, schedules, and recent records in plain language, and patients get an assistant for bookings and clinic questions. The staff assistant is read-only and every query is audit-logged.',
  },
  {
    q: 'How much does Smiley cost?',
    a: 'Smiley is offered on a subscription plan for clinics. See the pricing page for current plans, or request a guided demo and onboarding walkthrough for your clinic.',
  },
  {
    q: 'Can I import my existing patient list?',
    a: 'Yes. Clinic admins can bulk-import patient records from a CSV file. Rows are validated and matched by email, so re-importing updates existing patients instead of creating duplicates.',
  },
];
