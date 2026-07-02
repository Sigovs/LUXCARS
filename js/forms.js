/* =====================================================================
   forms.js — design-phase form interaction states (no backend).
   Any <form data-validate> gets inline required/email validation,
   error text under the field, focus-to-first-error, and a success
   banner on valid submit. Real submission is wired in the build phase.
   ===================================================================== */
(function () {
  'use strict';

  const forms = document.querySelectorAll('form[data-validate]');
  if (!forms.length) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const controlOf = (field) => field.querySelector('input, textarea, select');

  const validateField = (field) => {
    const ctrl = controlOf(field);
    if (!ctrl) return true;
    const required = field.hasAttribute('data-required');
    const val = (ctrl.value || '').trim();
    let ok = true;

    if (required) {
      if (ctrl.tagName === 'SELECT') {
        if (ctrl.selectedIndex <= 0) ok = false;      // first option is the label
      } else if (!val) {
        ok = false;
      }
    }
    if (ok && val && ctrl.type === 'email' && !emailRe.test(val)) ok = false;

    field.classList.toggle('is-invalid', !ok);
    return ok;
  };

  forms.forEach((form) => {
    const success = form.querySelector('.form-success');
    const fields = Array.from(form.querySelectorAll('.field'));

    // Live-clear an error once the user corrects the field
    fields.forEach((field) => {
      const ctrl = controlOf(field);
      if (!ctrl) return;
      const revalidate = () => { if (field.classList.contains('is-invalid')) validateField(field); };
      ctrl.addEventListener('input', revalidate);
      ctrl.addEventListener('change', revalidate);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allOk = true, firstBad = null;
      fields.forEach((field) => {
        const ok = validateField(field);
        if (!ok) { allOk = false; if (!firstBad) firstBad = field; }
      });

      if (!allOk) {
        if (success) success.classList.remove('is-shown');
        if (firstBad) { const c = controlOf(firstBad); if (c) c.focus(); }
        return;
      }

      form.reset();
      if (success) {
        success.classList.add('is-shown');
        success.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  });
})();
