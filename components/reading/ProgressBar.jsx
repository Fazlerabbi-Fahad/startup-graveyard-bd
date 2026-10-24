'use client';

import { useEffect, useRef } from 'react';

/** Thin accent bar showing how far through the article the reader is. */
export function ProgressBar({ targetId }) {
  const bar = useRef(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !bar.current) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
      bar.current.style.transform = `scaleX(${p})`;
      bar.current.parentElement.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent will-change-transform" />
    </div>
  );
}
