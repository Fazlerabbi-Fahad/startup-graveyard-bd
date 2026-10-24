import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = { paper: '#F6F3EE', surface: '#ECE7DF', ink: '#1A1917', muted: '#6B665E', accent: '#006A4E' };

let fontsPromise;
/** Fonts for next/og (WOFF; see assets/fonts/README.md). Loaded once per server instance. */
export function ogFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/Bricolage-800.woff')),
    readFile(join(process.cwd(), 'assets/fonts/Bricolage-200.woff')),
    readFile(join(process.cwd(), 'assets/fonts/JetBrainsMono-500.woff')),
  ]).then(([b800, b200, mono]) => [
    { name: 'Bricolage', data: b800, weight: 800, style: 'normal' },
    { name: 'Bricolage', data: b200, weight: 200, style: 'normal' },
    { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
  ]);
  return fontsPromise;
}

/** Headstone + sprout mark, as an inline SVG data URI for <img>. */
export const markDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M9 27V13a7 7 0 0 1 14 0v14" stroke="#1A1917" stroke-width="2.2" stroke-linecap="round"/><path d="M5 27h22" stroke="#1A1917" stroke-width="2.2" stroke-linecap="round"/><path d="M16 22v-5m0 0c0-2 1.5-3 3.5-3 0 2-1.5 3-3.5 3Zm0 0c0-1.6-1.2-2.4-2.8-2.4 0 1.6 1.2 2.4 2.8 2.4Z" stroke="#006A4E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
)}`;
