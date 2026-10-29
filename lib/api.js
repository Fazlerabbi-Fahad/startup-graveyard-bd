import 'server-only';

const API_URL = (process.env.API_URL || 'http://localhost:4000/api').replace(/\/+$/, '');
export const REVALIDATE_SECONDS = 3600;
export const TAG_ALL = 'case-studies';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Public API base URL, handed to client components that call the API directly (views, corrections). */
export const publicApiUrl = () => API_URL;

async function get(path, { query, tags = [] } = {}) {
  const url = new URL(API_URL + path);
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: REVALIDATE_SECONDS, tags: [TAG_ALL, ...tags] },
  });
  if (!res.ok) {
    let message = `API ${res.status} for ${path}`;
    try {
      message = (await res.json())?.error?.message ?? message;
    } catch {
      /* non-JSON error */
    }
    throw new ApiError(res.status, message);
  }
  return res.json();
}

const isBuild = () => process.env.NEXT_PHASE === 'phase-production-build';

/**
 * During `next build`, an unreachable API shouldn't fail the whole build: return the fallback and let
 * ISR fill the page in later. At runtime, errors are re-thrown so Next keeps serving the last good page.
 */
async function resilient(promise, fallback) {
  try {
    return await promise;
  } catch (err) {
    if (isBuild()) {
      console.warn(`[api] ${err.message}; using fallback during build`);
      return fallback;
    }
    throw err;
  }
}

export const FALLBACK_TAXONOMIES = {
  sectors: ['Fintech', 'eCommerce', 'Logistics', 'Mobility', 'Edtech', 'Healthtech', 'Foodtech', 'Agritech', 'SaaS', 'Media', 'Internet search', 'Online classifieds', 'Food Delivery', 'Travel', 'Proptech', 'Other'],
  failureCategories: [
    'No product-market fit',
    'Ran out of funding',
    'Unit economics / cash burn',
    'Regulatory / licensing',
    'Competition',
    'Team / co-founder conflict',
    'Governance / compliance issues',
    'Operations / logistics',
    'Market timing',
    'Macroeconomic (FX, inflation)',
    'Legal',
    'Other',
  ],
  cities: ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Other'],
  outcomes: ['Shut down', 'Acquired', 'Dormant', 'Pivoted', 'Defunct'],
};

const EMPTY_LIST = { items: [], total: 0, page: 1, limit: 12, totalPages: 1, hasNextPage: false, hasPrevPage: false };

export const getTaxonomies = () => resilient(get('/public/taxonomies'), FALLBACK_TAXONOMIES).catch(() => FALLBACK_TAXONOMIES);

export const getStats = () => resilient(get('/public/stats', { tags: ['stats'] }), null);

export const listCaseStudies = (params = {}) =>
  resilient(get('/public/case-studies', { query: { limit: 12, ...params } }), { ...EMPTY_LIST, unavailable: true });

/** Full published document (+ prevSlug/nextSlug), or null when it doesn't exist. */
export async function getCaseStudy(slug) {
  try {
    return await get(`/public/case-studies/${encodeURIComponent(slug)}`, { tags: [`case-study:${slug}`] });
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) return null;
    if (isBuild()) return null;
    throw err;
  }
}

/** Every published slug (+ updatedAt), paging through the API's 50-per-page maximum. */
export async function getAllPublished() {
  const out = [];
  let page = 1;
  for (;;) {
    const data = await get('/public/case-studies', { query: { page, limit: 50 } });
    out.push(...data.items.map((i) => ({ slug: i.slug, updatedAt: i.updatedAt, publishedAt: i.publishedAt })));
    if (!data.hasNextPage) break;
    page += 1;
  }
  return out;
}

export const getAllPublishedSafe = () => resilient(getAllPublished(), []);
