/* =====================================================================
   inventory.js — inventory page: client-side filtering (no reload),
   sort, empty state, and a skeleton "load more" demo. Design phase:
   works on the static card set; swap in a real feed later.
   ===================================================================== */
(function () {
  'use strict';

  const grid = document.getElementById('inventoryGrid');
  if (!grid) return;

  const form = document.getElementById('heroFilter');
  const countEl = document.getElementById('resultCount');
  const sortEl = document.getElementById('sortBy');
  const emptyEl = document.getElementById('inventoryEmpty');
  const resetBtn = document.getElementById('inventoryReset');
  const loadMoreBtn = document.getElementById('loadMore');

  const cards = Array.from(grid.querySelectorAll('.vcard'))
    .filter((c) => !c.classList.contains('vcard--skeleton'));

  // Precompute each card's filterable data from its existing markup.
  const data = cards.map((card) => {
    const title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
    const priceTxt = card.querySelector('.vcard__price') ? card.querySelector('.vcard__price').textContent : '';
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    return {
      card,
      title,
      price: parseInt(priceTxt.replace(/[^0-9]/g, ''), 10) || 0,
      year: yearMatch ? parseInt(yearMatch[0], 10) : 0,
      body: card.dataset.body || '',
    };
  });

  const fieldVal = (name) => {
    const f = form && form.querySelector(`[name="${name}"]`);
    return f ? f.value : '';
  };

  const matches = (d) => {
    const make = fieldVal('make');
    if (make && d.title.indexOf(make) === -1) return false;

    const body = fieldVal('body');
    if (body && d.body !== body) return false;

    const price = fieldVal('price');
    if (price) {
      const [lo, hi] = price.split('-');
      const min = parseInt(lo, 10) || 0;
      const max = hi ? parseInt(hi, 10) : Infinity;
      if (d.price < min || d.price > max) return false;
    }

    const year = fieldVal('year');
    if (year) {
      if (/older|&/i.test(year)) { if (d.year > 2020) return false; }
      else if (String(d.year) !== year) return false;
    }
    return true;
  };

  const apply = () => {
    let shown = 0;
    data.forEach((d) => {
      const ok = matches(d);
      d.card.classList.toggle('is-hidden', !ok);
      if (ok) shown++;
    });
    if (countEl) countEl.textContent = shown;
    if (emptyEl) emptyEl.classList.toggle('is-hidden', shown !== 0);
    grid.classList.toggle('is-hidden', shown === 0);
  };

  const sortBy = (mode) => {
    const arr = data.slice();
    if (mode.indexOf('Low to High') !== -1) arr.sort((a, b) => a.price - b.price);
    else if (mode.indexOf('High to Low') !== -1) arr.sort((a, b) => b.price - a.price);
    else arr.sort((a, b) => b.year - a.year); // Newest (default)
    arr.forEach((d) => grid.appendChild(d.card));
  };

  // Pre-select filters from the URL (forwarded by the homepage quick-filter).
  const url = new URLSearchParams(location.search);
  if (form && url.toString()) {
    ['make', 'body', 'price', 'year'].forEach((n) => {
      const v = url.get(n);
      if (!v) return;
      const f = form.querySelector(`[name="${n}"]`);
      if (f) f.value = v;
    });
  }

  if (form) form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  if (sortEl) sortEl.addEventListener('change', () => sortBy(sortEl.value));
  if (resetBtn) resetBtn.addEventListener('click', () => { if (form) form.reset(); apply(); });

  // "Load more" → show skeleton cards briefly, then reveal the design-phase note.
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (loadMoreBtn.disabled) return;
      loadMoreBtn.disabled = true;

      const skels = [];
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 3; i++) {
        const s = document.createElement('article');
        s.className = 'vcard vcard--skeleton';
        s.setAttribute('aria-hidden', 'true');
        s.innerHTML =
          '<div class="skel-media skeleton"></div>' +
          '<div class="p-5">' +
          '<div class="skel-line skeleton"></div>' +
          '<div class="skel-line short skeleton"></div>' +
          '<div class="skel-line skeleton" style="margin-top:1.25rem"></div>' +
          '</div>';
        frag.appendChild(s);
        skels.push(s);
      }
      grid.appendChild(frag);

      setTimeout(() => {
        skels.forEach((s) => s.remove());
        const note = document.getElementById('loadMoreNote');
        if (note) note.classList.remove('is-hidden');
        loadMoreBtn.classList.add('is-hidden');
      }, 1100);
    });
  }

  apply();
})();
