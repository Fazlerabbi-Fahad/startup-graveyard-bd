import { notFound } from 'next/navigation';
import { getAllPublishedSafe, getCaseStudy, publicApiUrl } from '@/lib/api';
import { excerpt, formatDate, isoDate, plural } from '@/lib/format';
import { SITE_NAME, absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';
import { RemoteImage, Logo } from '@/components/RemoteImage';
import { Markdown } from '@/components/reading/Markdown';
import { ProgressBar } from '@/components/reading/ProgressBar';
import { TocDesktop, TocMobile } from '@/components/reading/Toc';
import { AtAGlance, Competitors, Lessons, ReasonCards, ReasonTags, Section, Sources, Timeline } from '@/components/reading/Blocks';
import { CorrectionForm } from '@/components/reading/CorrectionForm';
import { ShareButtons } from '@/components/reading/ShareButtons';
import { PrevNext } from '@/components/reading/PrevNext';
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
  const title = `${cs.name}: why it failed`;
  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${cs.slug}` },
    openGraph: {
      type: 'article',
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

  const g = cs.atAGlance ?? {};
  const s = cs.sections ?? {};
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
          headline: `${cs.name}: why it failed`,
          description: cs.tagline || excerpt(s.executiveSummary),
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
      <ProgressBar targetId="article" />
      <ViewPing apiUrl={publicApiUrl()} slug={cs.slug} />

      <article id="article">
        {/* Header */}
        <header className="mx-auto max-w-7xl px-5 pt-14 pb-12 sm:px-8 sm:pt-20">
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
                <Section id="what-went-wrong" index={n('what-went-wrong')} title="What Went Wrong">
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

      <PrevNext prev={prev} next={next} />
    </>
  );
}
