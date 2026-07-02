/* =====================================================================
   main.js — navigation, mobile menu, sticky header, promo rotator
   Vanilla JS, no dependencies. Kept light for Core Web Vitals.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------- Sticky header */
  const header = document.getElementById('siteHeader');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------- Mobile menu */
  const menu = document.getElementById('mobileMenu');
  const toggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('menuClose');

  const openMenu = () => {
    if (!menu) return;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    // Move focus into the menu for accessibility
    if (closeBtn) closeBtn.focus();
  };

  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  };

  if (toggle) toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close when any menu link is tapped
  if (menu) {
    menu.querySelectorAll('a[href]').forEach((a) => a.addEventListener('click', closeMenu));
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) closeMenu();
  });

  // Reset menu state if resized up to desktop
  const mq = window.matchMedia('(min-width: 1024px)');
  mq.addEventListener('change', (e) => { if (e.matches) closeMenu(); });

  /* ------------------------------------------- Promo banner rotator */
  const track = document.getElementById('promoTrack');
  if (track) {
    const items = Array.from(track.querySelectorAll('.promo__item'));
    if (items.length > 1) {
      let i = 0;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        setInterval(() => {
          items[i].classList.remove('is-active');
          i = (i + 1) % items.length;
          items[i].classList.add('is-active');
        }, 4500);
      }
    }
  }

  /* ---------------------------------------------- Footer current year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
