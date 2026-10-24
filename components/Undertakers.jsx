import Link from 'next/link';

/** The disclaimer. The light humour stays in the label; the text is plain. */
export function Undertakers({ compact = false }) {
  return (
    <aside aria-labelledby="undertakers-title" className={`rounded-3xl bg-surface ${compact ? 'p-6 sm:p-8' : 'p-8 sm:p-12'}`} data-reveal="">
      <p id="undertakers-title" className="label">
        From the undertakers
      </p>
      <div className={`mt-4 max-w-[62ch] font-serif leading-relaxed ${compact ? 'text-lg' : 'text-xl'}`}>
        <p>
          This is a learning resource, not a final verdict. Each case study is built from the sources listed at its end, and some details may be incomplete or
          disputed. Startups rarely fail for a single reason: the causes here are interrelated, and hindsight makes them look clearer than they were at the time.
        </p>
        <p className="mt-4 text-muted">
          These were real companies built by real people. If you were involved and something is wrong or missing,{' '}
          <Link href="/about#contribute" className="link">
            please tell us
          </Link>
          . Corrections are welcome and reviewed.
        </p>
      </div>
    </aside>
  );
}
