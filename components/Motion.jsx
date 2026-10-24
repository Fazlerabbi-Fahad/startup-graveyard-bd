'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fade-and-rise reveals for elements marked [data-reveal].
 * - Initial hidden state is applied by JS, only to elements below the fold, so content is never
 *   hidden if JS fails and nothing on the first screen waits for an animation.
 * - Opacity only (no visibility:hidden), so find-in-page and screen readers always see the text.
 * - prefers-reduced-motion: keep the fade, drop the movement.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    let ctx;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      ctx = gsap.context(() => {
        const fold = window.innerHeight * 0.9;
        const targets = gsap.utils.toArray('[data-reveal]').filter((el) => el.getBoundingClientRect().top > fold);
        if (!targets.length) return;
        gsap.set(targets, { opacity: 0, y: reduce ? 0 : 20 });
        ScrollTrigger.batch(targets, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => {
            // After a jump, elements already scrolled past appear instantly so they never delay
            // what's on screen; the rest fade in with a stagger capped at ~0.35 s in total.
            const passed = batch.filter((el) => el.getBoundingClientRect().bottom <= 0);
            const visible = batch.filter((el) => el.getBoundingClientRect().bottom > 0);
            if (passed.length) gsap.set(passed, { opacity: 1, y: 0 });
            if (visible.length) {
              gsap.to(visible, {
                opacity: 1,
                y: 0,
                duration: reduce ? 0.45 : 0.75,
                ease: 'power2.out',
                stagger: Math.min(0.07, 0.35 / visible.length),
                overwrite: true,
              });
            }
          },
        });
        // Web fonts swapping in shifts layout; recompute trigger positions once they're ready.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
        // Safety net: anything still hidden after a jump (anchor link, fast scroll) is shown.
        const onHash = () => gsap.to(targets, { opacity: 1, y: 0, duration: 0.3, overwrite: true });
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
