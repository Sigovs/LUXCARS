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

  /* Full screen — the browser's own Fullscreen API rather than a lightbox
     library, so it costs nothing: Esc exits, the arrows above still step
     through the photos, and the CSS drops the 4:3 crop while we're in it. */
  var full = document.getElementById('vdpFull');
  if (full && stage.requestFullscreen) {
    full.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else stage.requestFullscreen().catch(function () {});
    });
    document.addEventListener('fullscreenchange', function () {
      var on = document.fullscreenElement === stage;
      full.setAttribute('aria-label', on ? 'Exit full screen' : 'View photo full screen');
    });
  } else if (full) {
    full.hidden = true;   // no API (older iOS Safari) — don't offer a dead control
  }
})();

/* =====================================================================
   Equipment: the OEM standard list runs long, so show a first block and
   open the rest on demand. A real <button> with aria-expanded, not a
   click-handler on a div.
   ===================================================================== */
(function () {
  'use strict';
  var btn = document.getElementById('vdpEquipMore');
  var list = document.getElementById('vdpStdList');
  if (!btn || !list) return;

  var more = Array.prototype.slice.call(list.querySelectorAll('.vdp-equip__more'));
  if (!more.length) { btn.hidden = true; return; }

  var total = list.querySelectorAll('li').length;
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    more.forEach(function (li) { li.hidden = open; });
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? 'Show all ' + total + ' features' : 'Show fewer features';
  });
})();

/* =====================================================================
   Save / Share / Text to phone.

   Share uses the browser's own share sheet where there is one and falls back
   to the clipboard, so it works on desktop too. "Text to phone" is a plain
   sms: link — it opens the messaging app with the listing already in it.
   ===================================================================== */
(function () {
  'use strict';

  var save  = document.getElementById('vdpSave');
  var label = document.getElementById('vdpSaveLabel');
  var share = document.getElementById('vdpShare');
  var text  = document.getElementById('vdpText');
  var live  = document.getElementById('vdpUtilLive');
  var title = (document.querySelector('.vdp-title') || {}).textContent || document.title;

  var say = function (msg) { if (live) live.textContent = msg; };

  // ---- Save (persists, so it survives a reload like a real shortlist) ----
  if (save) {
    var key = 'lux:saved:' + (location.pathname || 'vdp');
    var setSaved = function (on) {
      save.setAttribute('aria-pressed', String(on));
      if (label) label.textContent = on ? 'Saved' : 'Save';
    };
    try { setSaved(localStorage.getItem(key) === '1'); } catch (e) {}

    save.addEventListener('click', function () {
      var on = save.getAttribute('aria-pressed') !== 'true';
      setSaved(on);
      try { on ? localStorage.setItem(key, '1') : localStorage.removeItem(key); } catch (e) {}
      say(on ? 'Saved to your list' : 'Removed from your list');
    });
  }

  // ---- Share ----
  if (share) {
    share.addEventListener('click', function () {
      var data = { title: title, text: title + ' at Lux Cars Chicago', url: location.href };
      if (navigator.share) {
        navigator.share(data).catch(function () {});   // user dismissed — not an error
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(location.href).then(function () {
          say('Link copied to clipboard');
          var span = share.querySelector('span');
          var was = span.textContent;
          span.textContent = 'Link copied';
          setTimeout(function () { span.textContent = was; }, 1800);
        });
      }
    });
  }

  // ---- Text to phone ----
  if (text) {
    text.href = 'sms:?&body=' + encodeURIComponent(title + ' — ' + location.href);
  }
})();

/* =====================================================================
   Request-information form.

   Validation is ours, not the browser's default bubbles: an error must be
   text + icon next to the field (never colour alone), tied to the input via
   aria-describedby, with aria-invalid set and focus moved to the first
   problem. `novalidate` on the form turns the native bubbles off so this
   runs instead.
   ===================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('vdpForm');
  if (!form) return;

  var ok = document.getElementById('vdpFormOk');
  var fields = [
    { input: document.getElementById('rfName'),  err: document.getElementById('rfNameErr'),
      valid: function (v) { return v.trim().length > 0; } },
    { input: document.getElementById('rfEmail'), err: document.getElementById('rfEmailErr'),
      valid: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } }
  ];

  function setError(f, bad) {
    f.err.hidden = !bad;
    f.input.setAttribute('aria-invalid', bad ? 'true' : 'false');
  }

  // Clear an error as soon as the field becomes valid — don't nag while typing.
  fields.forEach(function (f) {
    f.input.addEventListener('input', function () {
      if (f.input.getAttribute('aria-invalid') === 'true' && f.valid(f.input.value)) setError(f, false);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;

    fields.forEach(function (f) {
      var bad = !f.valid(f.input.value);
      setError(f, bad);
      if (bad && !firstBad) firstBad = f.input;
    });

    if (firstBad) {
      if (ok) ok.hidden = true;
      firstBad.focus();
      return;
    }

    // No backend on the prototype — show the state the real submit would.
    if (ok) ok.hidden = false;
    form.reset();
  });
})();
