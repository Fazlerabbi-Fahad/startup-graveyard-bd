import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';
import { Icon, Mark } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import { NavLinks, MobileMenu } from './Nav';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-5 sm:px-8">
        <Link href="/" className="mr-auto flex items-center gap-2.5 rounded py-2 text-ink" aria-label={`${SITE_NAME}, home`}>
          <Mark className="size-7 shrink-0" />
          <span className="font-display text-[1.05rem] font-extrabold tracking-tight">{SITE_NAME}</span>
        </Link>
        <nav aria-label="Main" className="hidden sm:block">
          <NavLinks />
        </nav>
        <Link
          href="/case-studies?focus=search"
          className="tap grid place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
          aria-label="Search case studies"
          title="Search"
        >
          <Icon name="search" className="size-5" />
        </Link>
        <ThemeToggle />
        <MobileMenu />
      </div>
    </header>
  );
}
