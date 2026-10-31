import Link from 'next/link';
import { CaseStudyCard } from '../CaseStudyCard';
import { Icon } from '../Icons';

/** Internal links: related case studies, plus a way back to the archive index. */
export function Related({ items = [] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="related-title" className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
      <h2 id="related-title" className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-extrabold tracking-tight">
        More case studies like this
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cs) => (
          <li key={cs.slug} className="min-w-0">
            <CaseStudyCard cs={cs} headingLevel="h3" reveal={false} />
          </li>
        ))}
      </ul>
      <Link href="/case-studies" className="link mt-8 inline-flex min-h-11 items-center gap-2 font-display font-semibold">
        Browse all case studies
        <Icon name="arrowRight" className="size-4" />
      </Link>
    </section>
  );
}
