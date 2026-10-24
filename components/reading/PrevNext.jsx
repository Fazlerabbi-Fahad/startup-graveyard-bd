import Link from 'next/link';
import { yearsSpan } from '@/lib/format';
import { Icon } from '../Icons';

function Card({ cs, direction }) {
  const isPrev = direction === 'prev';
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className={`group flex h-full flex-col rounded-3xl bg-surface p-6 transition-[transform,background-color] duration-300 hover:-translate-y-1 sm:p-8 motion-reduce:hover:translate-y-0 ${
        isPrev ? '' : 'sm:items-end sm:text-right'
      }`}
    >
      <span className="label inline-flex items-center gap-2">
        {isPrev && <Icon name="arrowLeft" className="size-4" />}
        {isPrev ? 'Previous case study' : 'Next case study'}
        {!isPrev && <Icon name="arrowRight" className="size-4" />}
      </span>
      <span className="mt-4 font-display text-2xl leading-tight font-extrabold tracking-tight group-hover:text-accent">{cs.name}</span>
      {cs.tagline && <span className="mt-2 font-serif text-[1.05rem] leading-relaxed text-muted">{cs.tagline}</span>}
      {yearsSpan(cs.atAGlance) && <span className="label mt-4">{yearsSpan(cs.atAGlance)}</span>}
    </Link>
  );
}

export function PrevNext({ prev, next }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="More case studies" className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>{prev && <Card cs={prev} direction="prev" />}</div>
        <div>{next && <Card cs={next} direction="next" />}</div>
      </div>
    </nav>
  );
}
