'use server';

import { getTaxonomies, listCaseStudies } from '@/lib/api';
import { parseFilters } from '@/lib/filters';

/** "Load more" on the archive. Server actions are public endpoints, so inputs are re-validated. */
export async function loadMoreCaseStudies(rawFilters, rawPage) {
  const page = Number.parseInt(rawPage, 10);
  if (!Number.isInteger(page) || page < 2 || page > 500) return { items: [], hasNextPage: false };
  const tax = await getTaxonomies();
  const filters = parseFilters(typeof rawFilters === 'object' && rawFilters ? rawFilters : {}, tax);
  const data = await listCaseStudies({ ...filters, page, limit: 12 });
  return { items: data.items, hasNextPage: data.hasNextPage, page: data.page };
}
