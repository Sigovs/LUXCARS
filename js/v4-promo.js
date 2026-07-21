/* =====================================================================
   v4-promo.js — keeps the top announcement strip to a single line.

   The three messages are written at desktop width, so on a phone they
   wrapped and doubled the height of the bar. CSS now forbids the break;
   this measures each message and, only where it genuinely does not fit,
   hands the CSS the exact overflow distance so the line can slide to
   reveal its end.

   Measured rather than assumed: the amount depends on the message, the
   viewport and the font once it has actually loaded — a fixed percentage
   would either cut the last word or leave a blank run-out.
   ===================================================================== */
(function () {
  'use strict';

  var track = document.getElementById('promoTrack');
  if (!track) return;

  var items = Array.prototype.slice.call(track.querySelectorAll('.promo__item'));
  if (!items.length) return;

  function measure() {
    items.forEach(function (item) {
      // Inactive items are absolutely positioned but still laid out, so they
      // measure correctly without being shown.
      var over = item.scrollWidth - item.clientWidth;
      if (over > 1) {
        item.style.setProperty('--over', over + 'px');
        item.classList.add('is-marquee');
      } else {
        item.classList.remove('is-marquee');
        item.style.removeProperty('--over');
      }
    });
  }

  var queued = false;
  function remeasure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; measure(); });
  }

  measure();
  window.addEventListener('resize', remeasure);

  /* The strip is set in a webfont. Measuring before it swaps in gives the
     fallback's metrics, which are usually narrower — the line would then be
     judged to fit and get clipped once the real face arrives. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
})();
