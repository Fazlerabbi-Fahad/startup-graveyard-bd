'use client';

import Link from 'next/link';

export default function Error({ reset }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-20 pb-10 sm:px-8 sm:pt-28">
      <p className="label">Something went wrong</p>
      <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4rem)] leading-none font-extrabold tracking-tight">
        We couldn’t load this page
      </h1>
      <p className="mt-6 max-w-[48ch] font-serif text-xl leading-relaxed text-muted">The archive may be briefly unavailable. Please try again in a moment.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-display font-semibold text-paper hover:bg-accent hover:text-on-accent"
        >
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-surface px-6 font-display font-semibold hover:bg-ink hover:text-paper">
          Homepage
        </Link>
      </div>
    </div>
  );
}
