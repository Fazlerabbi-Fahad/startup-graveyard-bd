'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Renders the final value on the server (so it's correct without JS), then counts up once when it
 * scrolls into view. Skipped entirely under prefers-reduced-motion.
 */
export function CountUp({ value, format = 'number', decimals = 0, duration = 1400 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(value) || value === 0) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    // Already on screen at load: leave the real number alone.
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined;

    setDisplay(0);
    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          setDisplay(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatValue(display, format, decimals)}
    </span>
  );
}

function formatValue(n, format, decimals) {
  if (format === 'usd') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
  }
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}
