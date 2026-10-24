const usdCompact = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
const usdFull = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('en-US');
const dateLong = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const formatUsdCompact = (n) => (n == null ? null : usdCompact.format(n));
export const formatUsd = (n) => (n == null ? null : usdFull.format(n));
export const formatNumber = (n) => (n == null ? null : num.format(n));
export const formatDate = (d) => (d ? dateLong.format(new Date(d)) : null);
export const isoDate = (d) => (d ? new Date(d).toISOString() : undefined);

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "2016–2021 · 5 years" (whatever parts are known). */
export function yearsSpan(g = {}) {
  const { foundedYear: from, shutDownYear: to, lifespanYears: life } = g;
  const range = from && to ? `${from}–${to}` : from ? `${from}–` : to ? `–${to}` : null;
  const span = life != null ? plural(life, 'year') : null;
  return [range, span].filter(Boolean).join(' · ') || null;
}

/** Source dates are free text ("2021", "2021-05", "2021-05-14"); show them nicely when we can. */
export function formatLooseDate(s) {
  if (!s) return null;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(s.trim());
  if (!m) return s;
  const [, y, mo, d] = m;
  if (d) return `${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}`;
  if (mo) return `${MONTHS[Number(mo) - 1]} ${y}`;
  return y;
}

/** Plain-text excerpt from Markdown for meta descriptions. */
export function excerpt(markdown, max = 160) {
  if (!markdown) return '';
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/[#*_`~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
}

export const reasonHref = (category) => `/case-studies?reason=${encodeURIComponent(category)}`;
export const sectorHref = (sector) => `/case-studies?sector=${encodeURIComponent(sector)}`;
