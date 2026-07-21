/* =====================================================================
   v4-menu.js — mobile menu extras.

   Opening, closing, Escape, scroll-lock and the aria-hidden flip already
   live in main.js. That file is shared with the frozen v3 pages, so instead
   of editing it this adds only what is missing:

     1. a second tap on the hamburger closes the menu
     2. Tab stays inside the panel while it is open
     3. the Inventory disclosure
     4. closing on the way to desktop, so the page cannot stay scroll-locked

   Loaded only by the v4 pages.
   ===================================================================== */
(function () {
  'use strict';

  var menu   = document.getElementById('mobileMenu');
  var toggle = document.getElementById('menuToggle');
  if (!menu || !toggle) return;

  function isOpen() { return menu.classList.contains('is-open'); }

  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  /* 1. Second tap closes.
     The hamburger animates into an X, so it is claiming to be the close
     control and has to behave like one. main.js binds openMenu to this same
     button and was registered first, so by the time a bubble handler runs the
     menu has already been re-opened. The state is therefore read during the
     CAPTURE phase on document, which happens before the button's own
     listeners — no reordering of main.js required. */
  var wasOpen = false;
  document.addEventListener('click', function (e) {
    wasOpen = toggle.contains(e.target) && isOpen();
  }, true);
  toggle.addEventListener('click', function () {
    if (wasOpen) { closeMenu(); return; }
    fitBelowHeader();
  });

  /* Clear the floating header by MEASURING it, not by assuming its height.
     A fixed padding of --header-h put "Inventory" straight under the logo:
     the announcement strip above the header means the header does not start
     at the top of the viewport, and where it starts depends on scroll
     position. The rendered bottom edge is the only honest number. */
  function fitBelowHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    menu.style.paddingTop = Math.max(0, header.getBoundingClientRect().bottom) + 'px';
  }

  /* 2. Focus trap.
     A full-screen overlay that lets Tab wander onto the page behind it is
     worse than no overlay: focus disappears somewhere the user cannot see,
     because the panel is covering it. */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !isOpen()) return;

    /* The hamburger lives in the header, OUTSIDE the panel, but it is the
       close button while the menu is open — so it belongs in the loop.
       Leaving it out would make the one control that dismisses this thing
       unreachable by keyboard. It goes last, matching where the eye finds
       it: top-right, after the items. */
    var items = Array.prototype.filter.call(
      menu.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement; }
    );
    items.push(toggle);
    if (!items.length) return;

    var first = items[0];
    var last  = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  /* 3. Inventory disclosure.
     A <button>, not a link: it goes nowhere, it reveals something. The
     chevron rotation is CSS driven off aria-expanded, so the state is
     announced and drawn from one source. */
  var invBtn = document.getElementById('mnavInvBtn');
  var invSub = document.getElementById('mnavInv');
  if (invBtn && invSub) {
    invBtn.addEventListener('click', function () {
      var open = invBtn.getAttribute('aria-expanded') === 'true';
      invBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
      invSub.hidden = open;
    });
  }

  /* 4. A rotation into desktop width hides the menu by CSS but would leave
     body.menu-open in place — the page would be silently unscrollable. */
  var wide = window.matchMedia('(min-width: 1024px)');
  function bailOnDesktop() { if (wide.matches && isOpen()) closeMenu(); }
  if (wide.addEventListener) wide.addEventListener('change', bailOnDesktop);
  window.addEventListener('resize', function () {
    bailOnDesktop();
    if (isOpen()) fitBelowHeader();   // an on-screen keyboard or rotation moves that edge
  });
})();
