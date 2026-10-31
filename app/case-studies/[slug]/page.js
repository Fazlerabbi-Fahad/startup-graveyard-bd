import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPublishedSafe, getCaseStudy, listCaseStudies, publicApiUrl } from '@/lib/api';
import { excerpt, formatDate, isoDate, plural } from '@/lib/format';
import { SITE_NAME, absoluteUrl } from '@/lib/site';
import { buildFaq, caseStudyTitle, pickRelated, quickAnswer, shortName } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { RemoteImage, Logo } from '@/components/RemoteImage';
import { Markdown } from '@/components/reading/Markdown';
import { ProgressBar } from '@/components/reading/ProgressBar';
import { TocDesktop, TocMobile } from '@/components/reading/Toc';
import { AtAGlance, Competitors, Lessons, ReasonCards, ReasonTags, Section, Sources, Timeline } from '@/components/reading/Blocks';
import { CorrectionForm } from '@/components/reading/CorrectionForm';
import { ShareButtons } from '@/components/reading/ShareButtons';
import { PrevNext } from '@/components/reading/PrevNext';
import { Related } from '@/components/reading/Related';
import { ViewPing } from '@/components/reading/ViewPing';
import { Undertakers } from '@/components/Undertakers';

export const revalidate = 3600;
export const dynamicParams = true; // newly published slugs render on first request, then cache

export async function generateStaticParams() {
  const all = await getAllPublishedSafe();
  return all.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return { title: 'Case study not found', robots: { index: false } };
  const description = cs.tagline || excerpt(cs.sections?.executiveSummary) || `How ${cs.name} failed, and what founders can learn from it.`;
  const title = caseStudyTitle(cs);
  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${cs.slug}` },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title,
      description,
      url: `/case-studies/${cs.slug}`,
      publishedTime: isoDate(cs.publishedAt),
      modifiedTime: isoDate(cs.updatedAt),
      section: cs.atAGlance?.sector ?? undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** Build the ordered list of sections that actually have content (shared by the body and the TOC). */
function buildSections(cs) {
  const s = cs.sections ?? {};
  const has = (v) => typeof v === 'string' && v.trim() !== '';
  const list = [
    has(s.executiveSummary) && { id: 'executive-summary', label: 'Executive Summary' },
    has(s.companyBackground) && { id: 'company-background', label: 'Company Background' },
    has(s.marketContext) && { id: 'market-context', label: 'Market Context' },
    cs.timeline?.length && { id: 'timeline', label: 'Timeline' },
    (cs.failureReasons?.length || has(s.whatWentWrong)) && { id: 'what-went-wrong', label: 'What Went Wrong' },
    has(s.whatCouldHaveBeenDone) && { id: 'what-could-have-been-done', label: 'What Could Have Been Done Differently' },
    cs.lessons?.length && { id: 'lessons', label: 'Lessons for Founders' },
    has(s.conclusion) && { id: 'conclusion', label: 'Conclusion' },
    buildFaq(cs).length > 0 && { id: 'faq', label: 'FAQ' },
    (has(s.researchNotes) || cs.sources?.length) && { id: 'sources', label: 'Research Notes & Sources' },
    cs.competitors?.length && { id: 'competitors', label: 'Competitors' },
  ];
  return list.filter(Boolean);
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) notFound();

  const [prev, next] = await Promise.all([
    cs.prevSlug ? getCaseStudy(cs.prevSlug) : null,
    cs.nextSlug ? getCaseStudy(cs.nextSlug) : null,
  ]);

  // Internal links: same sector first, then shared causes and era. Failures here must never break the page.
  const [sameSector, latest] = await Promise.all([
    cs.atAGlance?.sector ? listCaseStudies({ sector: cs.atAGlance.sector, limit: 12 }).catch(() => null) : null,
    listCaseStudies({ limit: 12 }).catch(() => null),
  ]);
  const pool = [...new Map([...(sameSector?.items ?? []), ...(latest?.items ?? [])].map((c) => [c.slug, c])).values()];
  const related = pickRelated(cs, pool);

  const g = cs.atAGlance ?? {};
  const s = cs.sections ?? {};
  const name = shortName(cs.name);
  const faq = buildFaq(cs);
  const answer = quickAnswer(cs);
  const sections = buildSections(cs);
  const n = (id) => sections.findIndex((x) => x.id === id) + 1;
  const url = absoluteUrl(`/case-studies/${cs.slug}`);
  const lastVerified = formatDate(cs.lastVerifiedAt);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: caseStudyTitle(cs),
          description: cs.tagline || excerpt(s.executiveSummary),
          inLanguage: 'en',
          citation: (cs.sources ?? []).filter((src) => src.url).map((src) => ({ '@type': 'CreativeWork', name: src.title, url: src.url })),
          datePublished: isoDate(cs.publishedAt),
          dateModified: isoDate(cs.updatedAt),
          author: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
          publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          image: [absoluteUrl(`/case-studies/${cs.slug}/opengraph-image`)],
          about: { '@type': 'Organization', name: cs.name },
          articleSection: g.sector ?? undefined,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Case studies', item: absoluteUrl('/case-studies') },
            { '@type': 'ListItem', position: 3, name, item: url },
          ],
        }}
      />
      {faq.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }}
        />
      )}
      <ProgressBar targetId="article" />
      <ViewPing apiUrl={publicApiUrl()} slug={cs.slug} />

      <article id="article">
        {/* Header */}
        <header className="mx-auto max-w-7xl px-5 pt-14 pb-12 sm:px-8 sm:pt-20">
          <nav aria-label="Breadcrumb" className="label mb-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/case-studies" className="hover:text-accent">
                  Case studies
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{name}</li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <Logo src={cs.logoUrl} name={cs.name} size={48} tone="bg-surface" />
            <p className="label">{[g.sector, g.city].filter(Boolean).join(' · ') || 'Case study'}</p>
          </div>
          <h1 className="h-display mt-8 max-w-[16ch] text-balance break-words">{cs.name}</h1>
          {cs.tagline && <p className="h-light mt-6 max-w-[30ch] text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.15] text-balance">{cs.tagline}</p>}
          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" aria-label="About this case study">
            {g.outcome && (
              <li>
                <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 font-mono text-xs tracking-[0.12em] uppercase">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {g.outcome}
                </span>
              </li>
            )}
            {cs.readingTimeMinutes > 0 && <li className="label">{plural(cs.readingTimeMinutes, 'min')} read</li>}
            <li className="label">{lastVerified ? `Last verified ${lastVerified}` : `Updated ${formatDate(cs.updatedAt)}`}</li>
          </ul>
        </header>

        {cs.coverImageUrl && (
          <figure className="mx-auto mb-14 max-w-7xl px-5 sm:px-8">
            <RemoteImage
              src={cs.coverImageUrl}
              alt=""
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="aspect-[16/9] w-full rounded-3xl bg-surface object-cover"
            />
          </figure>
        )}

        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <TocDesktop sections={sections} />
          </aside>

          <div className="min-w-0">
            <TocMobile sections={sections} />

            <div className="max-w-[68ch] space-y-8">
              {answer && <p className="font-serif text-[1.25rem] leading-relaxed text-pretty">{answer}</p>}
              <AtAGlance g={g} />
              <ReasonTags reasons={cs.failureReasons} />
            </div>

            <div className="mt-20 max-w-[68ch] space-y-20">
              {n('executive-summary') > 0 && (
                <Section id="executive-summary" index={n('executive-summary')} title="Executive Summary">
                  <Markdown className="prose prose-lead">{s.executiveSummary}</Markdown>
                </Section>
              )}
              {n('company-background') > 0 && (
                <Section id="company-background" index={n('company-background')} title="Company Background">
                  <Markdown>{s.companyBackground}</Markdown>
                </Section>
              )}
              {n('market-context') > 0 && (
                <Section id="market-context" index={n('market-context')} title="Market Context">
                  <Markdown>{s.marketContext}</Markdown>
                </Section>
              )}
              {n('timeline') > 0 && (
                <Section id="timeline" index={n('timeline')} title="Timeline">
                  <Timeline items={cs.timeline} />
                </Section>
              )}
              {n('what-went-wrong') > 0 && (
                <Section id="what-went-wrong" index={n('what-went-wrong')} title={`Why did ${name} fail?`}>
                  {cs.failureReasons?.length > 0 && <ReasonCards reasons={cs.failureReasons} />}
                  <Markdown>{s.whatWentWrong}</Markdown>
                </Section>
              )}
              {n('what-could-have-been-done') > 0 && (
                <Section id="what-could-have-been-done" index={n('what-could-have-been-done')} title="What Could Have Been Done Differently">
                  <Markdown>{s.whatCouldHaveBeenDone}</Markdown>
                </Section>
              )}
              {n('lessons') > 0 && (
                <Section id="lessons" index={n('lessons')} title="Lessons for Founders">
                  <Lessons lessons={cs.lessons} />
                </Section>
              )}
              {n('conclusion') > 0 && (
                <Section id="conclusion" index={n('conclusion')} title="Conclusion">
                  <Markdown>{s.conclusion}</Markdown>
                </Section>
              )}
              {n('faq') > 0 && (
                <Section id="faq" index={n('faq')} title="Frequently asked questions">
                  <dl className="space-y-6">
                    {faq.map((f) => (
                      <div key={f.q}>
                        <dt className="font-display text-lg font-bold tracking-tight">{f.q}</dt>
                        <dd className="mt-2 font-serif text-[1.075rem] leading-relaxed break-words">{f.a}</dd>
                      </div>
                    ))}
                  </dl>
                </Section>
              )}
              {n('sources') > 0 && (
                <Section id="sources" index={n('sources')} title="Research Notes & Sources">
                  <Markdown>{s.researchNotes}</Markdown>
                  {cs.sources?.length > 0 && <Sources sources={cs.sources} lastVerifiedAt={lastVerified} />}
                </Section>
              )}
              {n('competitors') > 0 && (
                <Section id="competitors" index={n('competitors')} title="Competitors">
                  <Competitors competitors={cs.competitors} />
                </Section>
              )}
            </div>

            {/* End of article */}
            <div className="mt-24 max-w-[68ch] space-y-16">
              <ShareButtons url={url} title={`${cs.name}: why it failed`} />
              <CorrectionForm apiUrl={publicApiUrl()} slug={cs.slug} name={cs.name} />
              <Undertakers compact />
            </div>
          </div>
        </div>
      </article>

      <Related items={related} />
      <PrevNext prev={prev} next={next} />
    </>
  );
}
