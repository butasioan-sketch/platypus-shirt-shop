import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://platypus-shirt-shop.vercel.app';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/product/1`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/product/2`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/cart`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
    { url: `${base}/versand`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/agb`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
