// One small line icon per failure category (24px grid, 1.6 stroke, currentColor).
const ICONS = {
  // a target with the shot landing off-centre
  'No product-market fit': () => (
    <>
      <circle cx="11" cy="13" r="7" />
      <circle cx="11" cy="13" r="3" />
      <path d="M16.5 3.5 21 3l-.5 4.5M21 3l-4.5 4.5" />
    </>
  ),
  // a coin falling to an empty line
  'Ran out of funding': () => (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M12 6v4M10.5 8h3" />
      <path d="M5 20h14M8 16.5l-1 3.5M16 16.5l1 3.5" />
    </>
  ),
  // a flame: burning cash
  'Unit economics / cash burn': () => (
    <path d="M12 21c3.6 0 6-2.5 6-5.8 0-3.7-2.8-5.3-3.4-9.2-2.2 1.3-3.3 3.3-3.3 5.3-1-.6-1.6-1.6-1.7-2.9C7.8 10.2 6 12.5 6 15.2 6 18.5 8.4 21 12 21Z" />
  ),
  // a document with a stamped seal
  'Regulatory / licensing': () => (
    <>
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z" />
      <path d="M14 3v4h4M9 9h3M9 12h6" />
      <circle cx="13" cy="16.5" r="2" />
    </>
  ),
  // two runners' arrows, one cutting ahead of the other
  Competition: () => (
    <>
      <path d="M3 9h13m0 0-3-3m3 3-3 3" />
      <path d="M8 15h13m0 0-3-3m3 3-3 3" />
    </>
  ),
  // two people with a split between them
  'Team / co-founder conflict': () => (
    <>
      <circle cx="7" cy="8" r="2.5" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M3 19c0-2.8 1.8-5 4-5s4 2.2 4 5M13 19c0-2.8 1.8-5 4-5s4 2.2 4 5" />
      <path d="m12 4-1 3h2l-1 3" />
    </>
  ),
  // a shield with a crack
  'Governance / compliance issues': () => (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
      <path d="m12 8-1.5 3.5h3L12 15" />
    </>
  ),
  // a box with a broken tape line
  'Operations / logistics': () => (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
      <path d="m7.7 5.3 8.5 4.5" />
    </>
  ),
  // an hourglass
  'Market timing': () => (
    <>
      <path d="M7 3h10M7 21h10" />
      <path d="M8 3c0 4 4 5 4 9s-4 5-4 9M16 3c0 4-4 5-4 9s4 5 4 9" />
    </>
  ),
  // an exchange-rate line rising past a currency mark
  'Macroeconomic (FX, inflation)': () => (
    <>
      <path d="M3 17l5-5 4 3 8-8" />
      <path d="M15 7h5v5" />
      <path d="M5 21h14" />
    </>
  ),
  // scales of justice
  Legal: () => (
    <>
      <path d="M12 3v18M8 21h8M5 7h14" />
      <path d="M5 7 2.5 13a2.5 2.5 0 0 0 5 0L5 7ZM19 7l-2.5 6a2.5 2.5 0 0 0 5 0L19 7Z" />
    </>
  ),
  // three dots in a circle
  Other: () => (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.4" />
    </>
  ),
};

export function ReasonIcon({ category, className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {(ICONS[category] ?? ICONS.Other)()}
    </svg>
  );
}

export function ReasonTag({ category, size = 'sm' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-paper font-mono tracking-[0.06em] text-ink ${
        size === 'sm' ? 'px-2.5 py-1 text-[0.7rem]' : 'px-3 py-1.5 text-xs'
      }`}
    >
      <ReasonIcon category={category} className={size === 'sm' ? 'size-3.5 text-accent' : 'size-4 text-accent'} />
      {category}
    </span>
  );
}
