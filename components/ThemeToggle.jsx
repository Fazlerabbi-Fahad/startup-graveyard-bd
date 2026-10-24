'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Icon } from './Icons';

const ORDER = ['system', 'light', 'dark'];
const LABEL = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' };
const ICON = { system: 'system', light: 'sun', dark: 'moon' };

/** Cycles system → light → dark. Renders a stable placeholder until mounted (theme unknown on the server). */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Enable the color transition only after first paint, so page load never animates.
    const id = requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'));
    return () => cancelAnimationFrame(id);
  }, []);

  const current = mounted ? theme ?? 'system' : 'system';
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="tap grid place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
      aria-label={`${LABEL[current]}. Switch to ${LABEL[next].toLowerCase()}`}
      title={`${LABEL[current]} (click for ${LABEL[next].toLowerCase()})`}
    >
      <Icon name={ICON[current]} className="size-5" />
    </button>
  );
}
