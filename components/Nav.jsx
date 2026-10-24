'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icons';

const LINKS = [
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'About' },
];

const isActive = (pathname, href) => pathname === href || pathname.startsWith(`${href}/`);

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {LINKS.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex h-11 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors ${
                active ? 'text-accent' : 'text-muted hover:text-ink'
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Phones: a small dropdown with the main links. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        type="button"
        className="tap grid place-items-center rounded-full text-muted hover:bg-surface hover:text-ink"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={open ? 'close' : 'menu'} className="size-5" />
      </button>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-surface p-2 shadow-xl shadow-black/10"
      >
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                className="flex min-h-11 items-center rounded-lg px-3 text-base font-medium hover:bg-paper aria-[current=page]:text-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
