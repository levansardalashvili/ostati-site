import type { MetadataRoute } from 'next';
import { getHelpArticles, getNavPages } from '@/lib/supabase';

const SITE_URL = 'https://ostato.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, articles] = await Promise.all([getNavPages(), getHelpArticles()]);
  const categories = [...new Set(articles.map((a) => a.category_id))];
  const paths = [
    '',
    '/services',
    '/how-it-works',
    '/legal',
    '/support',
    '/support/contact',
    ...categories.map((c) => `/support/${c}`),
    ...articles.map((a) => `/support/${a.category_id}/${a.slug}`),
    ...pages.map((p) => `/${p.slug}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));
}
