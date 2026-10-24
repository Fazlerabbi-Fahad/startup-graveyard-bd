'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../Icons';

/** Tracks which section is being read (the last heading that crossed the upper third of the viewport). */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    const els = key.split('|').map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [key]);
  return active;
}

function TocList({ sections, active, onNavigate }) {
  return (
    <ol className="space-y-0.5">
      {sections.map((s) => {
        const isActive = s.id === active;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={onNavigate}
              aria-current={isActive ? 'location' : undefined}
              className={`relative flex min-h-11 items-center py-1.5 pl-4 font-display text-[0.92rem] leading-snug transition-colors lg:min-h-0 ${
                isActive ? 'font-semibold text-accent' : 'text-muted hover:text-ink'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-full transition-colors ${isActive ? 'bg-accent' : 'bg-transparent'}`}
              />
              {s.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Desktop: sticky list in the left margin. */
export function TocDesktop({ sections }) {
  const ids = sections.map((s) => s.id);
  const active = useActiveSection(ids);
  return (
    <nav aria-label="On this page" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="label mb-3 pl-4">On this page</p>
      <TocList sections={sections} active={active} />
    </nav>
  );
}

/** Phones and tablets: a collapsible "On this page" bar that sticks under the header. */
export function TocMobile({ sections }) {
  const ids = sections.map((s) => s.id);
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const current = sections.find((s) => s.id === active);

  return (
    <nav aria-label="On this page" className="sticky top-16 z-30 -mx-5 bg-paper/90 px-5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="toc-mobile-list"
        className="flex min-h-12 w-full items-center justify-between gap-3 text-left"
      >
        <span className="min-w-0">
          <span className="label block">On this page</span>
          <span className="block truncate font-display text-[0.95rem] font-semibold">{current?.label}</span>
        </span>
        <Icon name="chevronDown" className={`size-5 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div id="toc-mobile-list" hidden={!open} className="pb-3">
        <TocList sections={sections} active={active} onNavigate={() => setOpen(false)} />
      </div>
    </nav>
  );
}
