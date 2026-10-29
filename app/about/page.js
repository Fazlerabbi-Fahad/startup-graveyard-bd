import Link from 'next/link';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import { Undertakers } from '@/components/Undertakers';

export const metadata = {
  title: 'About',
  description: `Why ${SITE_NAME} exists, how each case study is researched, and the editorial standards behind it.`,
  alternates: { canonical: '/about' },
};

const STANDARDS = [
  ['Only verifiable facts', 'Every claim about a company should be traceable to a public source: press coverage, filings, founder statements, or the company’s own announcements. Where something is uncertain, the case study says so.'],
  ['Every case study has sources', 'Nothing is published without at least one source, and the sources are listed in full at the end of each article.'],
  ['Analysis is labelled as analysis', '“What went wrong” and “what could have been done differently” are our reading of the evidence, not a verdict on anyone’s character.'],
  ['Corrections are reviewed', 'Every correction is read and checked against sources. When a case study changes, its “last verified” date is updated.'],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
      <header className="max-w-4xl">
        <p className="label">About</p>
        <h1 className="h-display mt-6 text-balance">Learning from what didn’t work</h1>
      </header>

      <div className="mt-16 grid gap-16 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="hidden lg:block" />
        <div className="max-w-[68ch] space-y-20">
          <section aria-labelledby="why">
            <h2 id="why" className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-extrabold tracking-tight" data-reveal="">
              Why this exists
            </h2>
            <div className="prose mt-6">
              <p className="prose-lead !text-[1.3rem]">
                Success stories get written up. Failures mostly disappear, and with them the most useful lessons a founder can learn.
              </p>
              <p>
                {SITE_NAME} collects the stories of Bangladeshi startups that shut down, were sold for parts, went quiet or changed course, and writes each one up as a
                business case study: what the company did, the market it worked in, what went wrong, and what a founder starting today could do differently.
              </p>
              <p>
                It is written for founders, operators, investors and students in Bangladesh and beyond. It is not written to mock anyone. Starting a company is hard,
                and many of these teams built real products and employed real people before things fell apart.
              </p>
            </div>
          </section>

          <section aria-labelledby="how">
            <h2 id="how" className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-extrabold tracking-tight" data-reveal="">
              How case studies are researched
            </h2>
            <div className="prose mt-6">
              <p>Each case study starts from public material: news coverage, funding announcements, regulatory notices, founder interviews and posts, and, where available, archived copies of the company’s own website and app listings.</p>
              <p>The research notes at the end of each article explain what was used and what remains uncertain. Every source is listed with its publisher and date so you can check it yourself.</p>
              <p>A failure almost never has one cause. Failure reasons are tagged so you can compare across companies, but the full analysis matters more than the tags.</p>
            </div>
          </section>

          <section aria-labelledby="standards">
            <h2 id="standards" className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-extrabold tracking-tight" data-reveal="">
              Editorial standards
            </h2>
            <ol className="mt-8 space-y-6">
              {STANDARDS.map(([title, body], i) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3" data-reveal="">
                  <span className="font-mono text-lg font-medium text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
                    <p className="mt-1.5 font-serif text-[1.1rem] leading-relaxed text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="contribute-title" id="contribute" className="scroll-mt-28">
            <h2 id="contribute-title" className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-extrabold tracking-tight" data-reveal="">
              Suggest a startup or send a correction
            </h2>
            <div className="prose mt-6">
              <p>
                <strong>Corrections:</strong> every case study ends with a “Spotted an error?” form. Use it for anything that’s wrong or missing, and include a source
                if you can. If you were part of the company, tell us; your perspective is especially welcome.
              </p>
              <p>
                <strong>Suggestions:</strong> know a Bangladeshi startup that shut down and should be documented?{' '}
                {CONTACT_EMAIL ? (
                  <>
                    Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with its name and any links you have.
                  </>
                ) : (
                  <>Send it through the correction form on any case study, with the company’s name and any links you have, and say it’s a suggestion.</>
                )}
              </p>
            </div>
            <Link
              href="/case-studies"
              className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-display font-semibold text-paper transition-colors hover:bg-accent hover:text-on-accent"
            >
              Browse the case studies
            </Link>
            <p className="mt-6">
              <Link href="/contact?topic=suggestion" className="link">
                Suggest a startup or send a message
              </Link>
            </p>
          </section>

          <Undertakers compact />
        </div>
      </div>
    </div>
  );
}
