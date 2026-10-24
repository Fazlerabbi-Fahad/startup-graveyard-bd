// Small inline line icons (24px grid, 1.6 stroke, currentColor).
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const PATHS = {
  search: 'm20 20-4.2-4.2M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  sun: 'M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.4-6.4-1 1M6.6 17.4l-1 1m12.8 0-1-1M6.6 6.6l-1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10Z',
  system: 'M3 5h18v11H3zM8.5 20h7M12 16v4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  arrowRight: 'M5 12h14m-5-5 5 5-5 5',
  arrowLeft: 'M19 12H5m5-5-5 5 5 5',
  link: 'M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1',
  check: 'M5 12.5 10 17l9-10',
  filter: 'M4 6h16M7 12h10M10 18h4',
  chevronDown: 'm6 9 6 6 6-6',
  hash: 'M5 9h14M5 15h14M10 4 8 20M16 4l-2 16',
  external: 'M14 4h6v6M10 14 20 4M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
};

export function Icon({ name, className = 'size-5', ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <path d={PATHS[name]} />
    </svg>
  );
}

export function XLogo({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.9 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
    </svg>
  );
}

export function LinkedInLogo({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
    </svg>
  );
}

export function FacebookLogo({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A21 21 0 0 0 14.3 4.3c-2.2 0-3.7 1.34-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
    </svg>
  );
}

/** Wordmark glyph: a headstone with a small sprout, i.e. something grows from what ended. */
export function Mark({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path d="M9 27V13a7 7 0 0 1 14 0v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M5 27h22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 22v-5m0 0c0-2 1.5-3 3.5-3 0 2-1.5 3-3.5 3Zm0 0c0-1.6-1.2-2.4-2.8-2.4 0 1.6 1.2 2.4 2.8 2.4Z" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
