'use client';

import { useEffect, useRef } from 'react';

/**
 * Counts one view per page load. Called from the browser (not the Next server) so the API's
 * per-IP de-duplication sees the reader's IP. Failures are ignored; this never affects reading.
 */
export function ViewPing({ apiUrl, slug }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return; // StrictMode re-runs effects in dev; refs survive, so this guards it
    sent.current = true;
    fetch(`${apiUrl}/public/case-studies/${encodeURIComponent(slug)}/view`, { method: 'POST', keepalive: true }).catch(() => {});
  }, [apiUrl, slug]);
  return null;
}
