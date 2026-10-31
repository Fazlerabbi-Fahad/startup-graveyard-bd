import { formatUsd } from '@/lib/format';

/** "Ekhanei (এখানেই; ekhanei.com), formerly CellBazaar" -> "Ekhanei". Used where a short, searchable name reads better. */
export const shortName = (name = '') => name.replace(/\s*[(（].*$/, '').replace(/,\s*(formerly|previously).*$/i, '').trim() || name;

const joinList = (items) => (items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

// "Other" is a catch-all, not a real cause: leave it out of sentences, FAQ answers and related-study matching.
const uniqueCategories = (cs) => [...new Set((cs.failureReasons ?? []).map((r) => r.category).filter((c) => c && c !== 'Other'))];

const yearRange = (g = {}) => (g.foundedYear && g.shutDownYear ? `${g.foundedYear}–${g.shutDownYear}` : null);

/** Page title: targets "why X failed" / "X shutdown reasons" and carries the years. */
export function caseStudyTitle(cs) {
  const range = yearRange(cs.atAGlance);
  return `Why ${shortName(cs.name)} failed${range ? ` (${range})` : ''}: shutdown reasons`;
}

/** One factual answer sentence block, assembled only from fields the editor filled in. */
export function quickAnswer(cs) {
  const g = cs.atAGlance ?? {};
  const name = shortName(cs.name);
  const range = yearRange(g);
  const sector = g.sector && g.sector !== 'Other' ? g.sector : null;
  const article = sector && /^[aeiou]/i.test(sector) ? 'an' : 'a';
  const who = [sector ? `${article} ${sector} startup` : 'a startup', g.city ? `based in ${g.city}, Bangladesh` : 'in Bangladesh'].join(' ');
  const parts = [`${name}${range ? ` (${range})` : ''} was ${who}.`];
  if (g.outcome) parts.push(`Outcome: ${g.outcome}.`);
  const cats = uniqueCategories(cs).filter((c) => c !== 'Other').slice(0, 3);
  if (cats.length) parts.push(`Main reasons it failed: ${joinList(cats)}.`);
  return cats.length || g.outcome ? parts.join(' ') : '';
}

/** Q&A pairs shown on the page and in FAQPage JSON-LD. Only questions the data can answer are included. */
export function buildFaq(cs) {
  const g = cs.atAGlance ?? {};
  const name = shortName(cs.name);
  const faq = [];

  const cats = uniqueCategories(cs).filter((c) => c !== 'Other');
  if (cats.length) {
    faq.push({
      q: `Why did ${name} fail?`,
      a: `According to this case study, ${name} failed mainly because of ${joinList(cats.slice(0, 4))}. The full analysis is in the section above.`,
    });
  }

  const range = yearRange(g);
  if (range) {
    faq.push({
      q: `When was ${name} active?`,
      a: `${name} was active from ${g.foundedYear} to ${g.shutDownYear}${g.outcome ? `. Outcome: ${g.outcome}` : ''}.`,
    });
  }

  if (g.fundingAmountUSD) {
    faq.push({ q: `How much funding did ${name} raise?`, a: `${name} raised about ${formatUsd(g.fundingAmountUSD)} in known funding.` });
  }

  const lessons = (cs.lessons ?? []).filter(Boolean).slice(0, 3);
  if (lessons.length) {
    faq.push({ q: `What can founders learn from ${name}?`, a: lessons.join(' ') });
  }

  return faq.length >= 2 ? faq : [];
}

/** Related case studies: same sector first, then shared failure categories, then closest shutdown year. */
export function pickRelated(current, candidates, count = 3) {
  const g = current.atAGlance ?? {};
  const mine = new Set(uniqueCategories(current));
  return candidates
    .filter((c) => c.slug !== current.slug)
    .map((c) => {
      const cg = c.atAGlance ?? {};
      let score = 0;
      if (g.sector && cg.sector === g.sector) score += 3;
      score += uniqueCategories(c).filter((k) => mine.has(k)).length;
      if (g.shutDownYear && cg.shutDownYear) score += Math.max(0, 3 - Math.abs(g.shutDownYear - cg.shutDownYear)) / 3;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.c);
}
