import { listCaseStudies } from '@/lib/api';
import { shortName } from '@/lib/seo';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

const oneLine = (s = '') => s.replace(/\s+/g, ' ').trim();

/** Every published case study, paging through the API's per-page maximum. */
async function allCaseStudies() {
  const out = [];
  for (let page = 1; page <= 20; page += 1) {
    const data = await listCaseStudies({ page, limit: 50 });
    out.push(...data.items);
    if (!data.hasNextPage) break;
  }
  return out;
}

/** A short plain-language index of the site for AI answer engines (the emerging /llms.txt convention). */
export async function GET() {
  const items = await allCaseStudies().catch(() => []);

  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    'Each case study explains what a Bangladeshi startup built, why it failed, and what founders can learn. Every one lists its sources and a last-verified date.',
    '',
    '## Key pages',
    '',
    `- [All case studies](${absoluteUrl('/case-studies')}): the full archive, filterable by sector, cause of failure, city and shutdown year`,
    `- [About and editorial standards](${absoluteUrl('/about')}): how case studies are researched, verified and corrected`,
    `- [Contact](${absoluteUrl('/contact')}): suggest a startup or send a message`,
    '',
    '## Case studies',
    '',
    ...items.map((cs) => {
      const tagline = oneLine(cs.tagline);
      return `- [${shortName(cs.name)}](${absoluteUrl(`/case-studies/${cs.slug}`)})${tagline ? `: ${tagline}` : ''}`;
    }),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
