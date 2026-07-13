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

  // Price bands mirror the homepage select exactly ("45000-70000", "70000-").
  function priceBand() {
    var r = form.querySelector('input[name="price"]:checked');
    if (!r || !r.value) return null;
    var parts = r.value.split('-');
    return {
      value: r.value,
      min: Number(parts[0]) || 0,
      max: parts[1] === '' || parts[1] === undefined ? Infinity : Number(parts[1]),
      label: r.parentNode.querySelector('.srp-check__label').textContent
    };
  }

  /* ------------------------------------------------ filtering ---- */
  function apply() {
    var makes  = checkedValues('make');
    var bodies = checkedValues('body');
    var years  = checkedValues('year');
    var drives = checkedValues('drive');
    var band   = priceBand();
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
        (!band || (price >= band.min && price <= band.max)) &&
        Number(card.dataset.miles) <= mMax;
      card.hidden = !ok;
      if (ok) shown++;
    });

    countEl.textContent = shown;
    if (liveEl) liveEl.textContent = shown + (shown === 1 ? ' vehicle matches your filters' : ' vehicles match your filters');
    if (emptyEl) emptyEl.hidden = shown !== 0;

    renderChips(makes, bodies, years, drives, band, mTouched ? mMax : null);
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

  function renderChips(makes, bodies, years, drives, band, mMax) {
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

    if (band) {
      chipsEl.appendChild(chip(band.label, function () {
        var any = form.querySelector('input[name="price"][value=""]');
        if (any) { any.checked = true; apply(); }
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
    if (price) {
      var radio = form.querySelector('input[name="price"][value="' + price + '"]');
      if (radio) { radio.checked = true; used = true; }
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
  sortEl.addEventListener('change', sort);

  function clearAll() {
    form.reset();
    var any = form.querySelector('input[name="price"][value=""]');
    if (any) any.checked = true;
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
  applyUrlParams();
  apply();
})();
