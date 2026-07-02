/* =====================================================================
   animations.js — scroll reveals + hero entrance
   Uses IntersectionObserver (cheap, no scroll handlers). Respects
   prefers-reduced-motion by revealing everything immediately.
   ===================================================================== */
(function () {
  'use strict';

  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Promote to its own layer only for the reveal, then drop the hint
          // so we don't keep GPU layers alive for the whole page lifetime.
          el.classList.add('is-revealing');
          el.classList.add('is-visible');
          obs.unobserve(el); // reveal once
          el.addEventListener('transitionend', () => el.classList.remove('is-revealing'), { once: true });
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  els.forEach((el) => observer.observe(el));
})();
