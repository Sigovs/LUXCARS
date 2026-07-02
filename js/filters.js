/* =====================================================================
   filters.js — hero inventory quick-filter (Make / Body / Price / Year)
   Design phase: no backend yet, so submitting builds a query string and
   forwards to inventory.html. inventory.html reads the same params to
   pre-select its filters. This keeps the contract ready for a real API.
   ===================================================================== */
(function () {
  'use strict';

  const form = document.getElementById('heroFilter');
  if (!form) return;

  // On the inventory page, inventory.js owns the filter (client-side, no reload).
  if (document.body.dataset.page === 'inventory') return;

  // Build a clean query string (drop empty values) and navigate.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (value) params.set(key, value);
    }
    const target = form.getAttribute('action') || 'pages/inventory.html';
    const qs = params.toString();
    window.location.href = qs ? `${target}?${qs}` : target;
  });

  /* --------- Pre-select from URL (used when this runs on inventory.html) ---------
     Harmless on the homepage (no matching fields / no params). */
  const url = new URLSearchParams(window.location.search);
  if (url.toString()) {
    ['make', 'body', 'price', 'year'].forEach((name) => {
      const val = url.get(name);
      if (!val) return;
      const field = form.querySelector(`[name="${name}"]`);
      if (field) field.value = val;
    });
  }
})();
