import Link from 'next/link';
import { SearchBox } from '@/components/SearchBox';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-20 pb-10 sm:px-8 sm:pt-28">
      <p className="label">404 · Nothing buried here</p>
      <h1 className="h-display mt-6 max-w-[14ch] text-balance">This page never existed</h1>
      <p className="h-light mt-6 max-w-[30ch] text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
        Or it moved. Either way, there’s no story here, but the archive is full of them.
      </p>
      <div className="mt-12 max-w-xl">
        <SearchBox id="notfound-search" />
      </div>
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-display font-semibold text-paper hover:bg-accent hover:text-on-accent">
            Back to the homepage
          </Link>
        </li>
        <li>
          <Link href="/case-studies" className="inline-flex min-h-12 items-center rounded-full bg-surface px-6 font-display font-semibold text-ink hover:bg-ink hover:text-paper">
            All case studies
          </Link>
        </li>
      </ul>
    </div>
  );
}
