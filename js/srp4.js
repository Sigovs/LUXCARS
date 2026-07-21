/* =====================================================================
   srp.js — inventory / search-results page.
   Filtering, sorting, active-filter chips, the mobile filter sheet, and
   pre-filtering from the URL (the homepage search bar and the body-style
   tiles link straight in, e.g. srp.html?body=SUV).

   Vanilla and dependency-free: page speed is the client's priority #1.
   Progressive enhancement: without JS the page still renders every vehicle
   and the <details> groups still open/close natively.
   ===================================================================== */
(function () {
  'use strict';

  var rail     = document.getElementById('srpFilters');
  var toggle   = document.getElementById('filtersToggle');
  var form     = document.getElementById('srpForm');
  var grid     = document.getElementById('srpGrid');
  var countEl  = document.getElementById('srpCount');
  var liveEl   = document.getElementById('srpLive');
  var chipsEl  = document.getElementById('srpChips');
  var sortEl   = document.getElementById('srpSort');
  var clearEl  = document.getElementById('srpClear');
  var emptyEl  = document.getElementById('srpEmpty');
  var backdrop = document.getElementById('srpBackdrop');
  var sheetX   = document.getElementById('srpSheetClose');
  if (!grid || !form) return;

  var cards    = Array.prototype.slice.call(grid.querySelectorAll('.srp-card'));
  var milesMax = document.getElementById('milesMax');
  var milesOut = document.getElementById('milesMaxOut');

  var isMobile = function () { return window.matchMedia('(max-width: 900px)').matches; };
  var num = function (n) { return Number(n).toLocaleString('en-US'); };

  /* ------------------------------------------------- helpers ----- */
  function checkedValues(name) {
    return Array.prototype.slice
      .call(form.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (i) { return i.value; });
  }

  /* ---------------------------------------------- price min / max ----
     A two-handle range plus typed boxes. This keeps the band semantics the
     homepage depends on: its search bar sends price=45000-70000, which maps
     straight onto min/max. (A single max-only slider used to turn that into
     "up to $70,000" and quietly show $38k cars.) */
  var priceMin = document.getElementById('priceMin');
  var priceMax = document.getElementById('priceMax');
  var priceMinBox = document.getElementById('priceMinBox');
  var priceMaxBox = document.getElementById('priceMaxBox');
  var priceFill = document.getElementById('priceFill');

  var PRICE_FLOOR = priceMin ? Number(priceMin.min) : 0;
  var PRICE_CEIL  = priceMax ? Number(priceMax.max) : Infinity;

  var parseMoney = function (s) {
    var n = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? null : n;
  };
  var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };

  // Handles can't cross; whichever one is being dragged pushes the other.
  function clampPair(leading) {
    var lo = Number(priceMin.value), hi = Number(priceMax.value);
    if (lo > hi) {
      if (leading === 'min') priceMax.value = lo;
      else priceMin.value = hi;
    }
  }

  function paintPrice() {
    if (!priceMin) return;
    var lo = Number(priceMin.value), hi = Number(priceMax.value);
    var span = PRICE_CEIL - PRICE_FLOOR;
    priceFill.style.left  = ((lo - PRICE_FLOOR) / span * 100) + '%';
    priceFill.style.right = ((PRICE_CEIL - hi) / span * 100) + '%';
    priceMinBox.value = money(lo);
    priceMaxBox.value = money(hi);
    // announce the real value, not the raw number
    priceMin.setAttribute('aria-valuetext', money(lo));
    priceMax.setAttribute('aria-valuetext', money(hi));
  }

  function priceRange() {
    if (!priceMin) return null;
    var lo = Number(priceMin.value), hi = Number(priceMax.value);
    if (lo <= PRICE_FLOOR && hi >= PRICE_CEIL) return null;   // untouched
    return { min: lo, max: hi, label: money(lo) + ' - ' + money(hi) };
  }

  /* ------------------------------------------------ filtering ---- */
  function apply() {
    var makes  = checkedValues('make');
    var bodies = checkedValues('body');
    var years  = checkedValues('year');
    var drives = checkedValues('drive');
    var range  = priceRange();
    var mMax   = milesMax ? Number(milesMax.value) : Infinity;
    var mTouched = milesMax && Number(milesMax.value) < Number(milesMax.max);

    var shown = 0;
    cards.forEach(function (card) {
      var price = Number(card.dataset.price);
      var ok =
        (!makes.length  || makes.indexOf(card.dataset.make) > -1) &&
        (!bodies.length || bodies.indexOf(card.dataset.body) > -1) &&
        (!years.length  || years.indexOf(card.dataset.year) > -1) &&
        (!drives.length || drives.indexOf(card.dataset.drive) > -1) &&
        (!range || (price >= range.min && price <= range.max)) &&
        Number(card.dataset.miles) <= mMax;
      card.hidden = !ok;
      if (ok) shown++;
    });

    countEl.textContent = shown;
    if (liveEl) liveEl.textContent = shown + (shown === 1 ? ' vehicle matches your filters' : ' vehicles match your filters');
    if (emptyEl) emptyEl.hidden = shown !== 0;

    renderChips(makes, bodies, years, drives, range, mTouched ? mMax : null);
  }

  /* --------------------------------------------- active chips ---- */
  function chip(label, onRemove) {
    var li = document.createElement('li');
    li.className = 'srp-chip';
    li.appendChild(document.createTextNode(label));
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'srp-chip__x';
    b.setAttribute('aria-label', 'Remove filter: ' + label);
    b.innerHTML = '&times;';
    b.addEventListener('click', onRemove);
    li.appendChild(b);
    return li;
  }

  function renderChips(makes, bodies, years, drives, range, mMax) {
    chipsEl.innerHTML = '';
    var addBox = function (name, value) {
      chipsEl.appendChild(chip(value, function () {
        var input = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
        if (input) { input.checked = false; apply(); }
      }));
    };
    makes.forEach(function (v) { addBox('make', v); });
    bodies.forEach(function (v) { addBox('body', v); });
    years.forEach(function (v) { addBox('year', v); });
    drives.forEach(function (v) { addBox('drive', v); });

    if (range) {
      chipsEl.appendChild(chip(range.label, function () {
        priceMin.value = PRICE_FLOOR; priceMax.value = PRICE_CEIL;
        paintPrice(); apply();
      }));
    }
    if (mMax !== null) {
      chipsEl.appendChild(chip('Under ' + num(mMax) + ' mi', function () {
        milesMax.value = milesMax.max; syncRanges(); apply();
      }));
    }
  }

  function syncRanges() {
    if (milesMax && milesOut) milesOut.textContent = num(milesMax.value) + ' mi';
  }

  /* ------------------------------------------------- sorting ----- */
  var order = cards.slice();   // original ("Featured") order
  function sort() {
    var v = sortEl.value;
    var list = order.slice();
    if (v === 'price-asc')  list.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
    if (v === 'price-desc') list.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
    if (v === 'year-desc')  list.sort(function (a, b) { return b.dataset.year - a.dataset.year; });
    if (v === 'miles-asc')  list.sort(function (a, b) { return a.dataset.miles - b.dataset.miles; });
    list.forEach(function (c) { grid.appendChild(c); });
  }

  /* ---------------------------------- pre-filter from the URL ----
     The homepage search bar submits here as a GET, and each body-style tile
     links in as srp.html?body=SUV. Values that don't match a control (e.g. a
     year we hold no stock for) are ignored rather than silently mis-filtering. */
  function applyUrlParams() {
    var params = new URLSearchParams(window.location.search);
    var used = false;

    ['make', 'body', 'year', 'drive'].forEach(function (name) {
      params.getAll(name).forEach(function (value) {
        if (!value) return;
        var input = form.querySelector('input[name="' + name + '"][value="' + value.replace(/"/g, '') + '"]');
        if (input) { input.checked = true; used = true; }
      });
    });

    var price = params.get('price');
    if (price && priceMin) {
      var parts = price.split('-');
      var lo = Number(parts[0]) || PRICE_FLOOR;
      var hi = parts[1] === '' || parts[1] === undefined ? PRICE_CEIL : Number(parts[1]);
      priceMin.value = Math.max(PRICE_FLOOR, Math.min(lo, PRICE_CEIL));
      priceMax.value = Math.max(PRICE_FLOOR, Math.min(hi, PRICE_CEIL));
      clampPair('min'); paintPrice(); used = true;
    }
    return used;
  }

  /* ------------------------------- filter rail / mobile sheet ---- */
  function openSheet() {
    rail.classList.add('is-open');
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (sheetX) sheetX.focus();
  }
  function closeSheet() {
    rail.classList.remove('is-open');
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  // Mobile-only control: it opens/closes the filter sheet. On desktop the rail
  // is always visible (CSS hides this button), so there is nothing to toggle.
  if (toggle) {
    toggle.addEventListener('click', function () {
      rail.classList.contains('is-open') ? closeSheet() : openSheet();
    });
  }
  if (sheetX)   sheetX.addEventListener('click', closeSheet);
  if (backdrop) backdrop.addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rail.classList.contains('is-open')) closeSheet();
  });

  /* --------------------------------------------------- wiring ---- */
  form.addEventListener('change', apply);
  if (milesMax) milesMax.addEventListener('input', function () { syncRanges(); apply(); });

  if (priceMin) {
    priceMin.addEventListener('input', function () { clampPair('min'); paintPrice(); apply(); });
    priceMax.addEventListener('input', function () { clampPair('max'); paintPrice(); apply(); });

    // Typed boxes: commit on blur/Enter, not per keystroke — otherwise a
    // half-typed "1" reads as $1 and wipes the results mid-entry.
    var commit = function (box, slider, which) {
      var n = parseMoney(box.value);
      if (n === null) { paintPrice(); return; }
      slider.value = Math.max(PRICE_FLOOR, Math.min(n, PRICE_CEIL));
      clampPair(which); paintPrice(); apply();
    };
    priceMinBox.addEventListener('blur', function () { commit(priceMinBox, priceMin, 'min'); });
    priceMaxBox.addEventListener('blur', function () { commit(priceMaxBox, priceMax, 'max'); });
    [priceMinBox, priceMaxBox].forEach(function (b) {
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); b.blur(); } });
    });
  }
  sortEl.addEventListener('change', sort);

  function clearAll() {
    form.reset();
    if (priceMin) { priceMin.value = PRICE_FLOOR; priceMax.value = PRICE_CEIL; paintPrice(); }
    if (milesMax) milesMax.value = milesMax.max;
    syncRanges();
    apply();
  }
  if (clearEl) clearEl.addEventListener('click', clearAll);
  var emptyReset = document.querySelector('.srp-empty__reset');
  if (emptyReset) emptyReset.addEventListener('click', clearAll);

  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  window.addEventListener('resize', function () {
    if (!isMobile() && rail.classList.contains('is-open')) closeSheet();
  });

  syncRanges();
  paintPrice();
  applyUrlParams();
  apply();
})();

/* =====================================================================
   Recently-sold rail — arrow paging over a native scroll container.
   Deliberately NOT a carousel library: the track is a real overflow
   scroller, so trackpad swipe, shift-wheel, keyboard and touch already
   work with zero JS. The arrows are an addition, not the mechanism —
   if this script never runs, the rail still scrolls.
   ===================================================================== */
(function () {
  'use strict';

  var track = document.getElementById('soldTrack');
  var prev  = document.getElementById('soldPrev');
  var next  = document.getElementById('soldNext');
  if (!track || !prev || !next) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Step = one card + one gap, measured from the DOM rather than hard-coded,
  // so the breakpoint changes in CSS can't drift out of sync with the JS.
  function step() {
    var card = track.querySelector('.sold-card');
    if (!card) return track.clientWidth;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function page(dir) {
    track.scrollBy({
      left: dir * step(),
      behavior: reduced.matches ? 'auto' : 'smooth'
    });
  }

  // Disabled at the ends: an arrow that silently does nothing reads as a
  // broken page. 2px of slack absorbs sub-pixel scroll widths.
  function syncArrows() {
    var max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }

  prev.addEventListener('click', function () { page(-1); });
  next.addEventListener('click', function () { page(1); });
  track.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows);

  syncArrows();
})();
