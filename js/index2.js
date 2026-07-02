/* =====================================================================
   index2.js — HOMEPAGE V2 PROTOTYPE only.
   Subtle parallax on large visual-break media. Transform + opacity only,
   IntersectionObserver-gated, rAF-throttled, passive scroll. Fully skipped
   when the user prefers reduced motion. Scoped to elements with
   [data-parallax] (only present on index2.html).
   ===================================================================== */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!items.length || typeof IntersectionObserver === 'undefined') return;

  // Only animate media that is on screen (keeps work tiny).
  const active = new Set();
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? active.add(e.target) : active.delete(e.target))),
    { rootMargin: '120px 0px 120px 0px' }
  );
  items.forEach((el) => io.observe(el));

  // Amplitude (px). Stronger on the visual breaks; gentler on small screens.
  const strength = () => (window.innerWidth < 640 ? 74 : 150);

  let ticking = false;
  const update = () => {
    ticking = false;
    if (!active.size) return;
    const vh = window.innerHeight;
    const s = strength();
    active.forEach((el) => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      // progress ~ -1 (entering from below) .. 1 (leaving at top)
      const prog = (center - vh / 2) / (vh / 2 + r.height / 2);
      const shift = Math.max(-s, Math.min(s, prog * -s));
      el.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    });
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

/* =====================================================================
   Footer map — Leaflet + OpenStreetMap, grayscale, brand-red pin.
   ===================================================================== */
(function () {
  'use strict';
  var el = document.getElementById('v2-map');
  if (!el || typeof L === 'undefined') return;

  var lat = 42.1516, lng = -87.9585; // 88 E Dundee Rd, Buffalo Grove, IL (approx.)
  var map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([lat, lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var pin = L.divIcon({ className: 'v2-pin', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] });
  L.marker([lat, lng], { icon: pin, title: 'Lux Cars Chicago', keyboard: false }).addTo(map);

  // Container sits far down the page; recalc size once laid out.
  setTimeout(function () { map.invalidateSize(); }, 200);
})();

/* =====================================================================
   Hero slide 1 plays an intro video, then advances to the next slide.
   Autoplay is paused while the video plays so it never cuts off early;
   graceful fallback resumes the slider if the video cannot play.
   ===================================================================== */
(function () {
  'use strict';
  var hero = document.getElementById('hero');
  var video = document.getElementById('heroIntroVideo');
  if (!hero || !video) return;

  var slide1 = video.closest('.hero__slide');
  if (!slide1) return;

  var playing = false;
  var resume = function () { hero.dispatchEvent(new Event('mouseleave')); };

  var advance = function () {
    playing = false;
    var dots = hero.querySelectorAll('[data-hero-dot]');
    if (dots[1]) dots[1].click();   // hero.js goes to slide 2 and restarts autoplay
    resume();
  };

  // Play the intro from the start every time slide 1 becomes active.
  var play = function () {
    if (playing) return;
    playing = true;
    hero.dispatchEvent(new Event('mouseenter')); // pause slider so the clip never cuts off

    video.addEventListener('ended', advance, { once: true });
    video.addEventListener('error', function () { playing = false; resume(); }, { once: true });

    try { video.currentTime = 0; } catch (e) {}
    var p = video.play && video.play();
    if (p && typeof p.catch === 'function') p.catch(function () { playing = false; resume(); });
  };

  // hero.js drives slides by toggling `is-active`; replay whenever slide 1 returns.
  var mo = new MutationObserver(function () {
    if (slide1.classList.contains('is-active')) play();
    else playing = false;
  });
  mo.observe(slide1, { attributes: true, attributeFilter: ['class'] });

  // Slide 1 is active on initial load.
  if (slide1.classList.contains('is-active')) play();
})();
