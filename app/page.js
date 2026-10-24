import Link from 'next/link';
import { getStats, getTaxonomies, listCaseStudies } from '@/lib/api';
import { reasonHref, sectorHref } from '@/lib/format';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, absoluteUrl } from '@/lib/site';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { CountUp } from '@/components/CountUp';
import { SearchBox } from '@/components/SearchBox';
import { ReasonIcon } from '@/components/ReasonIcon';
import { Icon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { Undertakers } from '@/components/Undertakers';

export const revalidate = 3600;

export const metadata = {
  title: { absolute: `${SITE_NAME}: failed Bangladeshi startups as case studies` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { title: SITE_NAME, description: SITE_TAGLINE, url: '/' },
  twitter: { title: SITE_NAME, description: SITE_TAGLINE },
};

export default async function Home() {
  const [stats, latest, tax] = await Promise.all([getStats(), listCaseStudies({ limit: 6 }), getTaxonomies()]);
  const reasons = (stats?.byFailureCategory ?? []).filter((r) => r.count > 0).sort((a, b) => b.count - a.count);
  const maxReason = Math.max(1, ...reasons.map((r) => r.count));
  const sectorCounts = new Map((stats?.bySector ?? []).map((s) => [s.sector, s.count]));

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: absoluteUrl('/'),
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl('/case-studies')}?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        <p className="label">An archive of failed Bangladeshi startups</p>
        <h1 className="h-display mt-6 max-w-[14ch] text-balance">{SITE_NAME}</h1>
        <p className="h-light mt-6 max-w-[22ch] text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] text-balance">{SITE_TAGLINE}</p>
        <div className="mt-12 flex max-w-2xl flex-col gap-5">
          <SearchBox id="hero-search" />
          <Link href="/case-studies" className="link inline-flex min-h-11 items-center gap-2 self-start font-display font-semibold">
            Browse all case studies
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </section>

      {/* The numbers */}
      {stats && stats.totalCaseStudies > 0 && (
        <section aria-labelledby="numbers-title" className="bg-surface">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 id="numbers-title" className="label">
              The numbers
            </h2>
            <dl className="mt-10 grid gap-12 sm:grid-cols-3 sm:gap-8">
              <Stat label="Startups documented" value={<CountUp value={stats.totalCaseStudies} />} />
              <Stat label="Funding lost (known)" value={<CountUp value={stats.totalFundingLostUSD} format="usd" />} />
              <Stat
                label="Average lifespan"
                value={
                  stats.averageLifespanYears == null ? (
                    <span className="text-muted">Unknown</span>
                  ) : (
                    <>
                      <CountUp value={stats.averageLifespanYears} decimals={1} />
                      <span className="ml-2 font-display text-2xl font-extralight text-muted">years</span>
                    </>
                  )
                }
              />
            </dl>
          </div>
        </section>
      )}

      {/* Why they died */}
      {reasons.length > 0 && (
        <section aria-labelledby="why-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div data-reveal="">
              <p className="label">Causes of death</p>
              <h2 id="why-title" className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-extrabold tracking-tight">
                Why they died
              </h2>
              <p className="mt-4 max-w-sm font-serif text-lg leading-relaxed text-muted">
                Most startups fail for more than one reason. Each bar counts the case studies where that cause played a part.
              </p>
            </div>
            <ul className="space-y-1">
              {reasons.map((r) => (
                <li key={r.category} data-reveal="">
                  <Link
                    href={reasonHref(r.category)}
                    className="group grid min-h-12 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface sm:grid-cols-[16rem_1fr_auto]"
                  >
                    <span className="flex items-center gap-2.5 font-display text-[0.95rem] font-medium group-hover:text-accent">
                      <ReasonIcon category={r.category} className="size-[1.1rem] shrink-0 text-accent" />
                      {r.category}
                    </span>
                    <span className="col-span-2 row-start-2 h-2 rounded-full bg-surface sm:col-span-1 sm:row-start-auto group-hover:bg-paper" aria-hidden="true">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${(r.count / maxReason) * 100}%` }} />
                    </span>
                    <span className="col-start-2 row-start-1 font-mono text-sm tabular-nums sm:col-start-auto sm:row-start-auto">
                      {r.count}
                      <span className="sr-only"> {r.count === 1 ? 'case study' : 'case studies'}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Latest */}
      <section aria-labelledby="latest-title" className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="latest-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-none font-extrabold tracking-tight" data-reveal="">
            Latest case studies
          </h2>
          {latest.total > latest.items.length && (
            <Link href="/case-studies" className="link inline-flex min-h-11 items-center gap-2 font-display font-semibold">
              All {latest.total}
              <Icon name="arrowRight" className="size-4" />
            </Link>
          )}
        </div>
        {latest.items.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.items.map((cs) => (
              <li key={cs.slug}>
                <CaseStudyCard cs={cs} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-surface p-8 font-serif text-lg text-muted">
            {latest.unavailable ? 'The archive is temporarily unavailable. Please check back shortly.' : 'The first case studies are being written. Check back soon.'}
          </p>
        )}
      </section>

      {/* Browse by sector */}
      <section aria-labelledby="sectors-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <h2 id="sectors-title" className="label" data-reveal="">
          Browse by sector
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2.5" data-reveal="">
          {tax.sectors.map((s) => {
            const n = sectorCounts.get(s) ?? 0;
            return (
              <li key={s}>
                <Link
                  href={sectorHref(s)}
                  className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-surface px-5 font-display font-medium transition-colors hover:bg-accent hover:text-on-accent"
                >
                  {s}
                  {n > 0 && <span className="font-mono text-xs tabular-nums opacity-70">{n}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Undertakers />
      </section>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div data-reveal="">
      <dt className="label">{label}</dt>
      <dd className="mt-3 font-mono text-[clamp(2.75rem,6vw,4.5rem)] leading-none font-medium tracking-tight text-accent">{value}</dd>
    </div>
  );
}
