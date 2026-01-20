import { MetadataRoute } from 'next';
// app/sitemap.ts

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://hokpath.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://hokpath.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://hokpath.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}