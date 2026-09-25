import type { MetadataRoute } from 'next';
import { getNavPages } from '@/lib/supabase';

const SITE_URL = 'https://ostati.ge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getNavPages();
  const paths = ['', '/services', '/how-it-works', ...pages.map((p) => `/${p.slug}`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));
}
