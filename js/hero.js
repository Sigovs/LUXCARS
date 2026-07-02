/* =====================================================================
   hero.js — hero slider ("leader"): crossfade slides, staircase text
   reveal, pagination dots, autoplay with pause. Vanilla, no deps.
   ===================================================================== */
(function () {
  'use strict';

  const hero = document.getElementById('hero');
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  if (slides.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTO_MS = 6500;
  let idx = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  let timer = null;

  const paint = () => {
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === idx);
      s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
  };

  const go = (n) => {
    const next = (n + slides.length) % slides.length;
    if (next === idx) return;
    idx = next;
    paint();
  };

  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const start = () => {
    if (reduce) return;
    stop();
    timer = setInterval(() => go(idx + 1), AUTO_MS);
  };

  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); start(); }));

  // Pause on hover / focus / hidden tab
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  paint();
  start();
})();
