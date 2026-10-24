'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toQueryString } from '@/lib/filters';
import { Icon } from '../Icons';

const SELECTS = [
  { key: 'sector', label: 'Sector', all: 'All sectors', from: 'sectors' },
  { key: 'reason', label: 'Why it failed', all: 'Any reason', from: 'failureCategories' },
  { key: 'city', label: 'City', all: 'All cities', from: 'cities' },
  { key: 'year', label: 'Shut down in', all: 'Any year', from: 'years' },
];

/**
 * Filters are the URL. Desktop: inline row. Phones: search stays inline, the rest open in a bottom sheet.
 */
export function FilterBar({ filters, taxonomies, years, autoFocusSearch = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(filters.q ?? '');
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);
  const searchRef = useRef(null);
  const options = { ...taxonomies, years };
  const activeCount = SELECTS.filter((s) => filters[s.key]).length;

  const apply = (next) => {
    startTransition(() => {
      router.replace(`${pathname}${toQueryString(next)}`, { scroll: false });
    });
  };

  // Debounced search.
  useEffect(() => {
    if ((filters.q ?? '') === q.trim()) return undefined;
    const t = setTimeout(() => apply({ ...filters, q: q.trim() }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Keep the box in sync when the URL changes from elsewhere (reset, back button), but never
  // while the reader is typing in it.
  useEffect(() => {
    if (document.activeElement !== searchRef.current) setQ(filters.q ?? '');
  }, [filters.q]);

  useEffect(() => {
    if (autoFocusSearch) searchRef.current?.focus();
  }, [autoFocusSearch]);

  useEffect(() => {
    const d = sheetRef.current;
    if (!d) return;
    if (sheetOpen && !d.open) d.showModal();
    if (!sheetOpen && d.open) d.close();
  }, [sheetOpen]);

  const selects = (idPrefix) =>
    SELECTS.map((s) => (
      <div key={s.key} className="min-w-0">
        <label htmlFor={`${idPrefix}-${s.key}`} className="label mb-1.5 block">
          {s.label}
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}-${s.key}`}
            value={filters[s.key] ?? ''}
            onChange={(e) => apply({ ...filters, q: q.trim(), [s.key]: e.target.value })}
            className={`h-12 w-full appearance-none truncate rounded-xl bg-surface pr-10 pl-4 font-display text-[0.95rem] ${
              filters[s.key] ? 'font-semibold text-accent' : 'text-ink'
            }`}
          >
            <option value="">{s.all}</option>
            {options[s.from].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" />
        </div>
      </div>
    ));

  const hasAny = activeCount > 0 || Boolean(filters.q);

  return (
    <section aria-label="Filter case studies" className={`mt-12 transition-opacity ${pending ? 'opacity-60' : ''}`} aria-busy={pending}>
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1 lg:max-w-sm">
          <label htmlFor="archive-search" className="label mb-1.5 block">
            Search
          </label>
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
            <input
              ref={searchRef}
              id="archive-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && apply({ ...filters, q: q.trim() })}
              placeholder="Company or story"
              autoComplete="off"
              className="h-12 w-full rounded-xl bg-surface pr-4 pl-12 font-display text-base placeholder:text-muted"
            />
          </div>
        </div>

        <div className="hidden flex-1 grid-cols-4 gap-3 lg:grid">{selects('f')}</div>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-surface px-4 font-display font-semibold lg:hidden"
          aria-haspopup="dialog"
        >
          <Icon name="filter" className="size-5" />
          Filters
          {activeCount > 0 && <span className="grid size-6 place-items-center rounded-full bg-accent font-mono text-xs text-on-accent">{activeCount}</span>}
        </button>

        {hasAny && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              apply({});
            }}
            className="hidden h-12 shrink-0 items-center px-2 font-display font-semibold text-accent underline-offset-4 hover:underline lg:inline-flex"
          >
            Reset
          </button>
        )}
      </div>

      {/* Phone bottom sheet */}
      <dialog
        ref={sheetRef}
        onClose={() => setSheetOpen(false)}
        onClick={(e) => e.target === sheetRef.current && setSheetOpen(false)}
        aria-labelledby="filters-title"
        className="m-0 mt-auto w-full max-w-none rounded-t-3xl bg-paper p-0 text-ink backdrop:bg-black/40 lg:hidden"
      >
        <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-surface" aria-hidden="true" />
          <div className="mb-5 flex items-center justify-between">
            <h2 id="filters-title" className="font-display text-xl font-extrabold">
              Filters
            </h2>
            <button type="button" onClick={() => setSheetOpen(false)} className="tap grid place-items-center rounded-full hover:bg-surface" aria-label="Close filters">
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <div className="grid gap-4">{selects('m')}</div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setQ('');
                apply({});
                setSheetOpen(false);
              }}
              className="h-12 rounded-full bg-surface font-display font-semibold"
            >
              Reset
            </button>
            <button type="button" onClick={() => setSheetOpen(false)} className="h-12 rounded-full bg-ink font-display font-semibold text-paper">
              Show results
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
