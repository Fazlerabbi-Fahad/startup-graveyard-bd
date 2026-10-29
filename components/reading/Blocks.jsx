import Link from 'next/link';
import { MONTHS, formatLooseDate, formatNumber, formatUsd, plural, reasonHref } from '@/lib/format';
import { ReasonIcon } from '../ReasonIcon';
import { Icon } from '../Icons';

/** Section wrapper: H2 with a hover/focus-visible anchor link. Only the heading reveals; text never waits. */
export function Section({ id, index, title, children, className = '' }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-32 lg:scroll-mt-24 ${className}`}>
      <div data-reveal="" className="group mb-6 flex items-baseline gap-4">
        <span className="label shrink-0 tabular-nums" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <h2 id={`${id}-title`} className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.08] font-extrabold tracking-tight text-balance">
          {title}
          <a
            href={`#${id}`}
            className="ml-2 inline-flex size-8 translate-y-[-0.1em] items-center justify-center rounded-full align-middle text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent focus-visible:opacity-100"
            aria-label={`Link to section: ${title}`}
          >
            <Icon name="hash" className="size-4" />
          </a>
        </h2>
      </div>
      {children}
    </section>
  );
}

function Unknown() {
  return <span className="text-muted">Unknown</span>;
}

/** Two-column fact grid. Every row always shows; missing values read "Unknown". */
export function AtAGlance({ g = {} }) {
  const yearsActive = g.foundedYear && g.shutDownYear ? `${g.foundedYear}–${g.shutDownYear}` : g.foundedYear ? `${g.foundedYear}–` : null;
  const rows = [
    ['Sector', g.sector],
    ['City', g.city],
    ['Years active', yearsActive],
    ['Lifespan', g.lifespanYears != null ? plural(g.lifespanYears, 'year') : null],
    ['Funding raised', g.fundingAmountUSD != null ? formatUsd(g.fundingAmountUSD) : null],
    ['Funding rounds', g.fundingRounds != null ? formatNumber(g.fundingRounds) : null],
    ['Peak team', g.peakTeamSize != null ? `${formatNumber(g.peakTeamSize)} people` : null],
    ['Outcome', g.outcome],
    [
      'Founders',
      g.founders?.length ? (
        <ul className="space-y-0.5">
          {g.founders.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              {f.name}
              {f.role && <span className="text-muted">, {f.role}</span>}
            </li>
          ))}
        </ul>
      ) : null,
      true,
    ],
    ['Investors', g.investors?.length ? g.investors.join(', ') : null, true],
  ];

  return (
    <section aria-labelledby="glance-title" className="rounded-3xl bg-surface p-6 sm:p-8">
      <h2 id="glance-title" className="label">
        At a glance
      </h2>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
        {rows.map(([label, value, wide]) => (
          <div key={label} className={wide ? 'col-span-2' : ''}>
            <dt className="label">{label}</dt>
            <dd className="mt-1 font-display text-[1.05rem] leading-snug font-medium">{value ?? <Unknown />}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReasonTags({ reasons = [] }) {
  const unique = [...new Set(reasons.map((r) => r.category))];
  if (!unique.length) return null;
  return (
    <div>
      <p className="label mb-3">Why it failed</p>
      <ul className="flex flex-wrap gap-2">
        {unique.map((c) => (
          <li key={c}>
            <Link
              href={reasonHref(c)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 font-mono text-[0.78rem] tracking-[0.04em] transition-colors hover:bg-accent hover:text-on-accent"
            >
              <ReasonIcon category={c} className="size-4" />
              {c}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Timeline({ items = [] }) {
  return (
    <ol className="relative ml-2 border-l-2 border-rule">
      {items.map((t, i) => (
        <li key={`${t.year}-${t.month ?? 0}-${i}`} className="relative pb-8 pl-8 last:pb-0">
          <span aria-hidden="true" className="absolute top-2 -left-[7px] size-3 rounded-full bg-accent ring-4 ring-paper" />
          <p className="label">
            {t.month ? `${MONTHS[t.month - 1].slice(0, 3)} ` : ''}
            {t.year}
          </p>
          <p className="mt-1 font-serif text-[1.1rem] leading-relaxed">{t.event}</p>
        </li>
      ))}
    </ol>
  );
}

export function ReasonCards({ reasons = [] }) {
  return (
    <ul className="mb-10 grid grid-cols-[minmax(0,1fr)] gap-3">
      {reasons.map((r, i) => (
        <li key={`${r.category}-${i}`} className="min-w-0 rounded-2xl bg-surface p-5 sm:p-6">
          <p className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper text-accent">
              <ReasonIcon category={r.category} className="size-[1.1rem]" />
            </span>
            {r.category}
          </p>
          {r.summary && <p className="mt-3 font-serif text-[1.075rem] leading-relaxed break-words">{r.summary}</p>}
        </li>
      ))}
    </ul>
  );
}

/** The most shareable part: a highlighted numbered callout. */
export function Lessons({ lessons = [] }) {
  return (
    <div className="rounded-3xl bg-ink p-7 text-paper sm:p-10">
      <p className="label !text-paper/70">The takeaways</p>
      <ol className="mt-6 space-y-6">
        {lessons.map((l, i) => (
          <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-3 sm:grid-cols-[3rem_1fr]">
            <span className="font-mono text-lg font-medium text-[var(--lesson-num)] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <p className="font-display text-[1.25rem] leading-snug font-semibold tracking-tight text-balance sm:text-[1.4rem]">{l}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Sources({ sources = [], lastVerifiedAt }) {
  return (
    <div className="mt-10">
      <h3 className="label mb-4">Sources</h3>
      <ol className="space-y-4">
        {sources.map((s, i) => {
          const meta = [s.publisher, formatLooseDate(s.date)].filter(Boolean).join(' · ');
          return (
            <li key={`${s.url}-${i}`} className="grid grid-cols-[2rem_1fr] gap-2">
              <span className="font-mono text-sm text-muted tabular-nums">{i + 1}.</span>
              <div>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="link font-serif text-[1.075rem] leading-snug break-words">
                  {s.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {meta && <p className="label mt-1 normal-case">{meta}</p>}
              </div>
            </li>
          );
        })}
      </ol>
      {lastVerifiedAt && <p className="label mt-6">Facts last verified {lastVerifiedAt}</p>}
    </div>
  );
}

export function Competitors({ competitors = [] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {competitors.map((c, i) => (
        <li key={`${c.name}-${i}`}>
          {c.url ? (
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface px-4 font-display font-medium hover:text-accent"
            >
              {c.name}
              <Icon name="external" className="size-3.5 text-muted" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center rounded-full bg-surface px-4 font-display font-medium">{c.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
