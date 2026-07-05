import type { MetadataRoute } from 'next';
import { SITE_URL, PUBLIC_ROUTES } from '@/lib/seo';

/**
 * Served at /sitemap.xml. Lists the public marketing routes for crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
