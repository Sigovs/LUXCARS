/* =====================================================================
   srp.js — inventory / search-results page.
   Client-side filtering, sorting, active-filter chips and the mobile
   filter sheet. Vanilla and dependency-free: page speed is the client's
   stated priority #1.

   Progressive enhancement: without JS the page still renders every
   vehicle and the <details> filter groups still open/close natively.
   ===================================================================== */
(function () {
  'use strict';

  var layout   = document.getElementById('srpLayout');
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
  if (!layout || !grid || !form) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.srp-card'));
  var priceMax = document.getElementById('priceMax');
  var milesMax = document.getElementById('milesMax');
  var priceOut = document.getElementById('priceMaxOut');
  var milesOut = document.getElementById('milesMaxOut');

  var isMobile = function () { return window.matchMedia('(max-width: 900px)').matches; };
  var money = function (n) { return '$' + Number(n).toLocaleString('en-US'); };
  var num   = function (n) { return Number(n).toLocaleString('en-US'); };

  /* ------------------------------------------------ filtering ---- */
  function checkedValues(name) {
    return Array.prototype.slice
      .call(form.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (i) { return i.value; });
  }

  function apply() {
    var makes  = checkedValues('make');
    var bodies = checkedValues('body');
    var drives = checkedValues('drive');
    var pMax   = priceMax ? Number(priceMax.value) : Infinity;
    var mMax   = milesMax ? Number(milesMax.value) : Infinity;

    var pTouched = priceMax && Number(priceMax.value) < Number(priceMax.max);
    var mTouched = milesMax && Number(milesMax.value) < Number(milesMax.max);

    var shown = 0;
    cards.forEach(function (card) {
      var ok =
        (!makes.length  || makes.indexOf(card.dataset.make) > -1) &&
        (!bodies.length || bodies.indexOf(card.dataset.body) > -1) &&
        (!drives.length || drives.indexOf(card.dataset.drive) > -1) &&
        Number(card.dataset.price) <= pMax &&
        Number(card.dataset.miles) <= mMax;
      card.hidden = !ok;
      if (ok) shown++;
    });

    countEl.textContent = shown;
    if (liveEl) liveEl.textContent = shown + (shown === 1 ? ' vehicle matches your filters' : ' vehicles match your filters');
    if (emptyEl) emptyEl.hidden = shown !== 0;

    renderChips(makes, bodies, drives, pTouched ? pMax : null, mTouched ? mMax : null);
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

  function renderChips(makes, bodies, drives, pMax, mMax) {
    chipsEl.innerHTML = '';
    var add = function (name, value) {
      chipsEl.appendChild(chip(value, function () {
        var input = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
        if (input) { input.checked = false; apply(); }
      }));
    };
    makes.forEach(function (v) { add('make', v); });
    bodies.forEach(function (v) { add('body', v); });
    drives.forEach(function (v) { add('drive', v); });

    if (pMax !== null) {
      chipsEl.appendChild(chip('Up to ' + money(pMax), function () {
        priceMax.value = priceMax.max; syncRanges(); apply();
      }));
    }
    if (mMax !== null) {
      chipsEl.appendChild(chip('Under ' + num(mMax) + ' mi', function () {
        milesMax.value = milesMax.max; syncRanges(); apply();
      }));
    }
  }

  function syncRanges() {
    if (priceMax && priceOut) priceOut.textContent = money(priceMax.value);
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

  toggle.addEventListener('click', function () {
    if (isMobile()) {
      rail.classList.contains('is-open') ? closeSheet() : openSheet();
    } else {
      var collapsed = layout.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
    }
  });

  if (sheetX)   sheetX.addEventListener('click', closeSheet);
  if (backdrop) backdrop.addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rail.classList.contains('is-open')) closeSheet();
  });

  /* --------------------------------------------------- wiring ---- */
  form.addEventListener('change', apply);
  if (priceMax) priceMax.addEventListener('input', function () { syncRanges(); apply(); });
  if (milesMax) milesMax.addEventListener('input', function () { syncRanges(); apply(); });
  sortEl.addEventListener('change', sort);

  function clearAll() {
    form.reset();
    if (priceMax) priceMax.value = priceMax.max;
    if (milesMax) milesMax.value = milesMax.max;
    syncRanges();
    apply();
  }
  if (clearEl) clearEl.addEventListener('click', clearAll);
  var emptyReset = document.querySelector('.srp-empty__reset');
  if (emptyReset) emptyReset.addEventListener('click', clearAll);

  // The sheet is closed on mobile at load; the rail is open on desktop.
  toggle.setAttribute('aria-expanded', isMobile() ? 'false' : 'true');
  window.addEventListener('resize', function () {
    if (!isMobile() && rail.classList.contains('is-open')) closeSheet();
  });

  syncRanges();
  apply();
})();
