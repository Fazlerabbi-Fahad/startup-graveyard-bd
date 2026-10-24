'use client';

import { useState } from 'react';
import { FacebookLogo, Icon, LinkedInLogo, XLogo } from '../Icons';

const btn =
  'inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 font-display text-[0.95rem] font-medium transition-colors hover:bg-ink hover:text-paper';

export function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const links = [
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`, icon: <XLogo /> },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, icon: <LinkedInLogo /> },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, icon: <FacebookLogo /> },
  ];

  return (
    <section aria-labelledby="share-title">
      <h2 id="share-title" className="label mb-4">
        Share this case study
      </h2>
      <ul className="flex flex-wrap gap-2">
        <li>
          <button type="button" onClick={copy} className={btn}>
            <Icon name={copied ? 'check' : 'link'} className="size-4" />
            {copied ? 'Link copied' : 'Copy link'}
          </button>
        </li>
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
              {l.icon}
              {l.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </p>
    </section>
  );
}
