import type { MetadataRoute } from 'next';

const SITE_URL = 'https://ostati.ge';
const PAGES = ['', '/services', '/how-it-works', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
