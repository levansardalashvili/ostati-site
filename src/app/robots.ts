import type { MetadataRoute } from 'next';

const SITE_URL = 'https://ostati.ge';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // admin panel-ს არაფერი აქვს საძიებოსთვის, და private key/session
        // page-ებია — ინდექსში არასდროს არ უნდა მოხვდეს.
        disallow: '/admin',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
