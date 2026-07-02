/* =====================================================================
   carousel.js — featured inventory slider
   Progressive enhancement over a native scroll-snap track: the track
   already scrolls/swipes without JS; this wires the prev/next buttons
   and keeps their disabled state in sync with scroll position.
   ===================================================================== */
(function () {
  'use strict';

  const track = document.getElementById('featTrack');
  const prev = document.getElementById('featPrev');
  const next = document.getElementById('featNext');
  if (!track) return;

  // Scroll by roughly one card (slide width + gap).
  const step = () => {
    const slide = track.querySelector('.carousel__slide');
    if (!slide) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 20;
    return slide.getBoundingClientRect().width + gap;
  };

  const updateButtons = () => {
    if (!prev || !next) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll;
  };

  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  track.addEventListener('scroll', () => window.requestAnimationFrame(updateButtons), { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();

  // Keyboard support when the track itself is focused.
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
  });
})();
