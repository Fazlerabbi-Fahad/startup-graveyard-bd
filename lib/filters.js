// Archive filters live in the URL. This normalises them against the taxonomies.
export const FILTER_KEYS = ['q', 'sector', 'reason', 'city', 'year'];

const FIRST_YEAR = 2005;
export const yearOptions = () => {
  const now = new Date().getFullYear();
  return Array.from({ length: now - FIRST_YEAR + 1 }, (_, i) => String(now - i));
};

/** Keep only known keys and valid values. */
export function parseFilters(raw, tax) {
  const pick = (k) => {
    const v = raw?.[k];
    return (Array.isArray(v) ? v[0] : v)?.toString().trim() ?? '';
  };
  const out = {};
  const q = pick('q').slice(0, 200);
  if (q) out.q = q;
  if (tax.sectors.includes(pick('sector'))) out.sector = pick('sector');
  if (tax.failureCategories.includes(pick('reason'))) out.reason = pick('reason');
  if (tax.cities.includes(pick('city'))) out.city = pick('city');
  if (/^\d{4}$/.test(pick('year'))) out.year = pick('year');
  return out;
}

export const toQueryString = (filters) => {
  const p = new URLSearchParams();
  for (const k of FILTER_KEYS) if (filters[k]) p.set(k, filters[k]);
  const s = p.toString();
  return s ? `?${s}` : '';
};

export function describeFilters(f) {
  const parts = [];
  if (f.sector) parts.push(f.sector);
  if (f.city) parts.push(`in ${f.city}`);
  if (f.reason) parts.push(`· ${f.reason}`);
  if (f.year) parts.push(`· shut down ${f.year}`);
  return parts.join(' ');
}
