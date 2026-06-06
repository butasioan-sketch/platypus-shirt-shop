import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/api/'] },
    ],
    sitemap: 'https://platypus-shirt-shop.vercel.app/sitemap.xml',
  };
}
