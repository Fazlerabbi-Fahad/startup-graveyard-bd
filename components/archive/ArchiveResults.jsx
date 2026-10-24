'use client';

import { useState, useTransition } from 'react';
import { loadMoreCaseStudies } from '@/app/case-studies/actions';
import { CaseStudyCard } from '../CaseStudyCard';

export function ArchiveResults({ initial, filters }) {
  const [items, setItems] = useState(initial.items);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(initial.hasNextPage);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  function loadMore() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await loadMoreCaseStudies(filters, page + 1);
        // De-duplicate in case something was published between pages.
        setItems((prev) => {
          const seen = new Set(prev.map((i) => i.slug));
          return [...prev, ...res.items.filter((i) => !seen.has(i.slug))];
        });
        setPage(res.page ?? page + 1);
        setHasNext(res.hasNextPage);
      } catch {
        setError('Couldn’t load more. Please try again.');
      }
    });
  }

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cs, i) => (
          <li key={cs.slug}>
            {/* Only the first server-rendered page uses scroll reveals; appended cards appear immediately. */}
            <CaseStudyCard cs={cs} headingLevel="h2" reveal={i < initial.items.length} />
          </li>
        ))}
      </ul>
      {(hasNext || error) && (
        <div className="mt-12 flex flex-col items-center gap-3">
          {error && (
            <p role="alert" className="font-serif text-muted">
              {error}
            </p>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={loadMore}
              disabled={pending}
              aria-describedby="results-count"
              className="inline-flex min-h-12 items-center rounded-full bg-surface px-8 font-display font-semibold transition-colors hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {pending ? 'Loading more case studies' : `${items.length} case studies shown`}
      </p>
    </>
  );
}
