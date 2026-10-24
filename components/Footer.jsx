import Link from 'next/link';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site';
import { Mark } from './Icons';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-[1fr_auto] sm:px-8">
        <div className="max-w-md">
          <p className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight">
            <Mark className="size-7" />
            {SITE_NAME}
          </p>
          <p className="mt-3 font-serif text-lg leading-relaxed text-muted">{SITE_TAGLINE}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-1 text-[0.95rem]">
            <li>
              <Link href="/case-studies" className="inline-flex min-h-11 items-center hover:text-accent">
                All case studies
              </Link>
            </li>
            <li>
              <Link href="/about" className="inline-flex min-h-11 items-center hover:text-accent">
                About & editorial standards
              </Link>
            </li>
            <li>
              <Link href="/about#contribute" className="inline-flex min-h-11 items-center hover:text-accent">
                Suggest a startup
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <p className="label">
          © {year} {SITE_NAME} · Written to learn from, not to mock
        </p>
      </div>
    </footer>
  );
}
