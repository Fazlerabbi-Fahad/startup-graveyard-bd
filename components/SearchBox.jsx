import { Icon } from './Icons';

/** Plain GET form to the archive, so it works without JavaScript. */
export function SearchBox({ defaultValue = '', id = 'site-search', className = '' }) {
  return (
    <form action="/case-studies" method="get" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search case studies
      </label>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search the archive"
        autoComplete="off"
        className="h-14 w-full rounded-full bg-surface pr-28 pl-12 font-display text-base text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-2 focus:outline-accent"
      />
      <button
        type="submit"
        className="absolute top-1/2 right-2 h-11 -translate-y-1/2 rounded-full bg-ink px-5 font-display text-sm font-semibold text-paper transition-colors hover:bg-accent hover:text-on-accent"
      >
        Search
      </button>
    </form>
  );
}
