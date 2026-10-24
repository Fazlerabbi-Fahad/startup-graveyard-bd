import { getAllPublishedSafe } from '@/lib/api';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const all = await getAllPublishedSafe();
  const newest = all.reduce((max, cs) => (cs.updatedAt && cs.updatedAt > max ? cs.updatedAt : max), '');
  const lastModified = newest ? new Date(newest) : new Date();

  return [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/case-studies'), lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/about'), changeFrequency: 'yearly', priority: 0.4 },
    ...all.map((cs) => ({
      url: absoluteUrl(`/case-studies/${cs.slug}`),
      lastModified: cs.updatedAt ? new Date(cs.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];
}
