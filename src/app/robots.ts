import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Served at /robots.txt. Public marketing pages are crawlable; the app's
 * authenticated areas and API are disallowed. AI crawlers are allowed so the
 * site can be cited by answer/generative engines (GEO).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin', '/dentist', '/login/admin', '/login/dentist'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
