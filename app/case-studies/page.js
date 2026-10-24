import Link from 'next/link';
import { getTaxonomies, listCaseStudies } from '@/lib/api';
import { describeFilters, parseFilters, yearOptions } from '@/lib/filters';
import { plural } from '@/lib/format';
import { FilterBar } from '@/components/archive/FilterBar';
import { ArchiveResults } from '@/components/archive/ArchiveResults';

export async function generateMetadata({ searchParams }) {
  const tax = await getTaxonomies();
  const f = parseFilters(await searchParams, tax);
  const desc = describeFilters(f);
  const title = f.q ? `Search: ${f.q}` : desc ? `Case studies: ${desc}` : 'All case studies';
  return {
    title,
    description: 'Browse failed Bangladeshi startups by sector, cause of failure, city and the year they shut down.',
    alternates: { canonical: '/case-studies' },
    // Free-text search results shouldn't be indexed; filtered and plain archive pages can be.
    robots: f.q ? { index: false, follow: true } : undefined,
  };
}

export default async function ArchivePage({ searchParams }) {
  const raw = await searchParams;
  const tax = await getTaxonomies();
  const filters = parseFilters(raw, tax);
  const data = await listCaseStudies({ ...filters, page: 1, limit: 12 });
  const active = Object.keys(filters).length > 0;
  const key = JSON.stringify(filters);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20">
      <header className="max-w-3xl">
        <p className="label">The archive</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-extrabold tracking-tight">Case studies</h1>
        <p className="mt-4 font-serif text-xl leading-relaxed text-muted">
          Every startup here was real. Filter by sector, cause of failure, city or the year it shut down.
        </p>
      </header>

      <FilterBar
        filters={filters}
        taxonomies={tax}
        years={yearOptions()}
        autoFocusSearch={raw?.focus === 'search'}
      />

      <p className="label mt-8 mb-6" aria-live="polite" id="results-count">
        {data.unavailable
          ? 'Archive temporarily unavailable'
          : active
            ? `${plural(data.total, 'case study', 'case studies')} found`
            : `${plural(data.total, 'case study', 'case studies')}`}
      </p>

      {data.items.length === 0 ? (
        <div className="rounded-3xl bg-surface px-6 py-16 text-center sm:px-12">
          <p className="font-display text-2xl font-extrabold tracking-tight">
            {data.unavailable ? 'We couldn’t reach the archive' : active ? 'Nothing matches those filters' : 'No case studies yet'}
          </p>
          <p className="mx-auto mt-3 max-w-md font-serif text-lg text-muted">
            {data.unavailable
              ? 'Please try again in a moment.'
              : active
                ? 'Try removing a filter or searching for something broader.'
                : 'The first stories are being researched and written.'}
          </p>
          {active && (
            <Link
              href="/case-studies"
              className="mt-8 inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-display font-semibold text-paper hover:bg-accent hover:text-on-accent"
            >
              Reset filters
            </Link>
          )}
        </div>
      ) : (
        <ArchiveResults key={`results:${key}`} initial={data} filters={filters} />
      )}
    </div>
  );
}
