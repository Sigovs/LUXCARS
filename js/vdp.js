/* =====================================================================
   vdp.js — vehicle detail page gallery.

   No lightbox library on purpose: page speed is the client's priority #1
   and this is the heaviest page on the site. Photos are plain <img> tags
   the browser lazy-loads; only the first is eager.

   Keyboard: Left/Right arrows step through photos while the gallery has
   focus; every thumbnail is a real <button>. The visible photo count is
   announced to screen readers.
   ===================================================================== */
(function () {
  'use strict';

  var stage  = document.querySelector('.vdp-stage');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.vdp-thumb'));
  var photos = Array.prototype.slice.call(document.querySelectorAll('.vdp-photo'));
  var prev   = document.getElementById('vdpPrev');
  var next   = document.getElementById('vdpNext');
  var indexEl = document.getElementById('vdpIndex');
  var liveEl  = document.getElementById('vdpLive');
  if (!stage || photos.length < 2) return;

  var current = 0;

  function show(i) {
    i = (i + photos.length) % photos.length;   // wrap both ways
    photos[current].hidden = true;
    thumbs[current].removeAttribute('aria-current');

    current = i;
    photos[current].hidden = false;
    thumbs[current].setAttribute('aria-current', 'true');

    if (indexEl) indexEl.textContent = current + 1;
    if (liveEl)  liveEl.textContent = 'Photo ' + (current + 1) + ' of ' + photos.length;

    // keep the active thumbnail in view without yanking the page around
    thumbs[current].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  thumbs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
  });
  if (prev) prev.addEventListener('click', function () { show(current - 1); });
  if (next) next.addEventListener('click', function () { show(current + 1); });

  // Arrow keys work when focus is anywhere inside the gallery.
  var gallery = document.querySelector('.vdp-gallery');
  gallery.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { show(current - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
  });
})();
