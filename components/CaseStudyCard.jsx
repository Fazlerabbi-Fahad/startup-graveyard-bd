import Link from 'next/link';
import { yearsSpan } from '@/lib/format';
import { Logo } from './RemoteImage';
import { ReasonTag } from './ReasonIcon';

/** Archive / home card. Works in server and client trees (no hooks). */
export function CaseStudyCard({ cs, headingLevel = 'h3', reveal = true }) {
  const H = headingLevel;
  const g = cs.atAGlance ?? {};
  const meta = [g.sector, yearsSpan(g)].filter(Boolean).join(' · ');
  const reasons = [...new Set((cs.failureReasons ?? []).map((r) => r.category))].slice(0, 2);

  return (
    <article
      data-reveal={reveal ? '' : undefined}
      className="group relative flex h-full flex-col rounded-2xl bg-surface p-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)] focus-within:-translate-y-1 motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0"
    >
      <div className="flex items-center gap-3">
        <Logo src={cs.logoUrl} name={cs.name} size={44} />
        {meta && <p className="label">{meta}</p>}
      </div>
      <H className="mt-5 font-display text-[1.6rem] leading-tight font-extrabold tracking-tight text-balance">
        <Link href={`/case-studies/${cs.slug}`} className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent">
          {cs.name}
        </Link>
      </H>
      {cs.tagline && <p className="mt-2 font-serif text-[1.075rem] leading-relaxed text-muted">{cs.tagline}</p>}
      <div className="mt-auto pt-6">
        {reasons.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1.5" aria-label="Main failure reasons">
            {reasons.map((r) => (
              <li key={r}>
                <ReasonTag category={r} />
              </li>
            ))}
          </ul>
        )}
        {cs.readingTimeMinutes > 0 && <p className="label">{cs.readingTimeMinutes} min read</p>}
      </div>
    </article>
  );
}
