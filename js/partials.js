/* =====================================================================
   partials.js — shared chrome for inner pages (DESIGN PHASE ONLY)
   Injects the icon sprite, header, mobile menu, and footer so the
   8 page stubs stay in sync without copy-pasting ~150 lines each.
   The homepage (index.html) inlines this markup directly for best LCP;
   when we move to a build step / CMS these become server-side includes.

   Usage on a page in /pages/:
     <body data-base="../" data-page="inventory">
     ...content...
     <script src="../js/partials.js" defer></script>   (load BEFORE main.js)
   ===================================================================== */
(function () {
  'use strict';

  const base = document.body.dataset.base || '';
  const active = document.body.dataset.page || '';

  const NAV = [
    ['inventory', 'Inventory', 'pages/inventory.html'],
    ['sell-trade', 'Sell / Trade', 'pages/sell-trade.html'],
    ['financing', 'Financing', 'pages/financing.html'],
    ['warranty', 'Warranty', 'pages/warranty.html'],
    ['service', 'Service', 'pages/service.html'],
    ['about', 'About', 'pages/about.html'],
    ['contact', 'Contact', 'pages/contact.html'],
  ];

  const href = (path) => base + path;
  const icon = (id, cls) => `<svg class="icon ${cls || ''}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  /* --------------------------------------------------- Icon sprite */
  const sprite = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"/></symbol>
      <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></symbol>
      <symbol id="i-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></symbol>
      <symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></symbol>
      <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></symbol>
      <symbol id="i-tag" viewBox="0 0 24 24"><path d="M3.5 11.5V4.5A1 1 0 0 1 4.5 3.5h7l9 9a1.4 1.4 0 0 1 0 2l-7 7a1.4 1.4 0 0 1-2 0l-9-9z"/><circle cx="7.5" cy="7.5" r="1.2"/></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 17.9l-5.25 2.6 1-5.85L3.5 9.65l5.9-.85z"/></symbol>
      <symbol id="i-truck" viewBox="0 0 24 24"><path d="M2.5 5.5h11v10H2.5z"/><path d="M13.5 8.5h4l3 3v4h-7z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/></symbol>
      <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l7 2.5v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10v-5z"/><path d="M9 12l2 2 4-4"/></symbol>
      <symbol id="i-wrench" viewBox="0 0 24 24"><path d="M15.5 6.5a4 4 0 0 0-5 5L4 18l2 2 6.5-6.5a4 4 0 0 0 5-5l-2.4 2.4-2.1-.5-.5-2.1z"/></symbol>
      <symbol id="i-financing" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14.5h3"/></symbol>
      <symbol id="i-trade" viewBox="0 0 24 24"><path d="M4 8h13l-2.5-2.5M20 16H7l2.5 2.5"/></symbol>
      <symbol id="i-reserve" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9h16M8 3v4M16 3v4M9.5 14l1.8 1.8 3.2-3.4"/></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
      <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21c4-4.5 6.5-7.6 6.5-11a6.5 6.5 0 0 0-13 0c0 3.4 2.5 6.5 6.5 11z"/><circle cx="12" cy="10" r="2.4"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/></symbol>
      <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>
      <symbol id="i-gauge" viewBox="0 0 24 24"><path d="M4.5 15a7.5 7.5 0 1 1 15 0"/><path d="M12 15l4-3.5"/><circle cx="12" cy="15" r="1"/></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M4 7l8 6 8-6"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></symbol>
      <symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></symbol>
      <symbol id="i-facebook" viewBox="0 0 24 24"><path d="M14 8.5h2.5V5.5H14c-2 0-3.5 1.5-3.5 3.5v2H8v3h2.5V21H14v-7h2.3l.7-3H14v-1.5c0-.6.4-1 1-1z"/></symbol>
      <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none"/></symbol>
      <symbol id="i-google" viewBox="0 0 24 24"><path d="M20 12.2c0-.6-.05-1.2-.15-1.7H12v3.4h4.5a3.9 3.9 0 0 1-1.7 2.5v2.1h2.7A8 8 0 0 0 20 12.2z"/><path d="M12 20.5a8 8 0 0 0 5.5-2l-2.7-2.1a4.9 4.9 0 0 1-7.3-2.6H4.7v2.2A8.5 8.5 0 0 0 12 20.5z"/><path d="M7.5 13.8a5 5 0 0 1 0-3.2V8.4H4.7a8.5 8.5 0 0 0 0 7.6z"/><path d="M12 7.3a4.6 4.6 0 0 1 3.2 1.3l2.4-2.4A8.2 8.2 0 0 0 12 3.5 8.5 8.5 0 0 0 4.7 8.4l2.8 2.2A5 5 0 0 1 12 7.3z"/></symbol>
    </g>
  </defs></svg>`;

  const desktopNav = NAV.map(([id, label, path]) =>
    `<a href="${href(path)}" class="nav-link ${id === active ? 'is-active' : ''}">${label}</a>`
  ).join('');

  const mobileNav = NAV.map(([, label, path]) =>
    `<a href="${href(path)}" class="mobile-nav-link">${label} ${icon('arrow-right', 'text-muted')}</a>`
  ).join('');

  const logo = `<img src="${href('assets/img/logo/brand-logo-white.svg')}" alt="Lux Cars Chicago" class="logo__img" width="471" height="87" />`;

  /* --------------------------------------------------------- Header */
  const header = `
  <div class="promo" role="region" aria-label="Announcements">
    <div class="container promo__track" id="promoTrack">
      <div class="promo__item is-active">${icon('shield','icon-sm')}<span>Every vehicle backed by a 3-month / 3,000-mile limited warranty</span></div>
      <div class="promo__item">${icon('truck','icon-sm')}<span>Nationwide shipping available — we deliver to your driveway</span></div>
      <div class="promo__item">${icon('tag','icon-sm')}<span>Lowest price guaranteed on every hand-picked vehicle</span></div>
    </div>
  </div>
  <header class="site-header" id="siteHeader">
    <div class="header-util hidden md:block">
      <div class="container max-w-site flex items-center justify-between h-9">
        <div class="flex items-center gap-6">
          <a href="tel:+18479472900" class="inline-flex items-center gap-2 hover:text-text transition-colors">${icon('phone','icon-sm')}847-947-2900</a>
          <span class="inline-flex items-center gap-2">${icon('clock','icon-sm')}Mon–Fri 9–7 · Sat 9–5 · Sun closed</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="tracking-wide">We speak English · Ukrainian · Russian · Polish</span>
          <span class="inline-flex items-center gap-2 text-accent">${icon('star','icon-sm')}<span class="text-muted">4.8 · 180+ Google reviews</span></span>
        </div>
      </div>
    </div>
    <div class="container max-w-site flex items-center justify-between" style="height:var(--header-h)">
      <a href="${href('index.html')}" class="logo" aria-label="Lux Cars Chicago — home">${logo}</a>
      <nav class="hidden lg:flex items-center gap-8" aria-label="Primary">${desktopNav}</nav>
      <div class="flex items-center gap-3">
        <a href="tel:+18479472900" class="btn btn-primary hidden sm:inline-flex">${icon('phone','icon-sm')}<span>847-947-2900</span></a>
        <a href="tel:+18479472900" class="btn btn-primary sm:hidden !px-3" aria-label="Call 847-947-2900">${icon('phone')}</a>
        <button id="menuToggle" class="lg:hidden btn btn-secondary !px-3" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">${icon('menu')}</button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    <div class="container flex items-center justify-between" style="height:var(--header-h)">
      <span class="logo">${logo}</span>
      <button id="menuClose" class="btn btn-secondary !px-3" aria-label="Close menu">${icon('close')}</button>
    </div>
    <nav class="container flex-1 flex flex-col" aria-label="Mobile">${mobileNav}</nav>
    <div class="container py-8 border-t hairline">
      <p class="overline mb-3">Call us directly</p>
      <a href="tel:+18479472900" class="btn btn-primary btn-block text-base">${icon('phone')}847-947-2900</a>
      <p class="text-muted text-sm mt-4 flex items-center gap-2">${icon('pin','icon-sm')}88 E Dundee Rd, Buffalo Grove, IL 60089</p>
      <p class="text-muted text-sm mt-1 flex items-center gap-2">${icon('clock','icon-sm')}Mon–Fri 9–7 · Sat 9–5 · Sun closed</p>
    </div>
  </div>`;

  /* --------------------------------------------------------- Footer */
  const footer = `
  <footer class="site-footer">
    <div class="container max-w-site py-14 md:py-16">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <span class="logo mb-4">${logo}</span>
          <p class="text-muted text-sm mt-4 flex items-start gap-2">${icon('pin','icon-sm mt-0.5')}88 E Dundee Rd<br>Buffalo Grove, IL 60089</p>
          <p class="text-muted text-sm mt-3 flex items-center gap-2">${icon('clock','icon-sm')}Mon–Fri 9–7 · Sat 9–5 · Sun closed</p>
          <a href="tel:+18479472900" class="text-text text-lg mt-3 inline-flex items-center gap-2 hover:text-accent transition-colors">${icon('phone','icon-sm')}847-947-2900</a>
        </div>
        <div>
          <p class="footer-col-title">Shop</p>
          <a href="${href('pages/inventory.html')}" class="footer-link">Inventory</a>
          <a href="${href('pages/sell-trade.html')}" class="footer-link">Sell / Trade</a>
          <a href="${href('pages/financing.html')}" class="footer-link">Financing</a>
          <a href="${href('pages/warranty.html')}" class="footer-link">Warranty</a>
        </div>
        <div>
          <p class="footer-col-title">Company</p>
          <a href="${href('pages/about.html')}" class="footer-link">About Us</a>
          <a href="${href('pages/service.html')}" class="footer-link">Service</a>
          <a href="${href('pages/contact.html')}" class="footer-link">Contact</a>
          <a href="${href('index.html')}#reviews" class="footer-link">Reviews</a>
        </div>
        <div>
          <p class="footer-col-title">Stay connected</p>
          <p class="text-muted text-sm mb-4">Family-run since 2010. We speak English, Ukrainian, Russian &amp; Polish.</p>
          <div class="flex gap-3">
            <a href="https://www.facebook.com/LuxCarsChicago" target="_blank" rel="noopener" class="social-btn" aria-label="Facebook @LuxCarsChicago">${icon('facebook')}</a>
            <a href="https://www.instagram.com/luxcarschicago" target="_blank" rel="noopener" class="social-btn" aria-label="Instagram @luxcarschicago">${icon('instagram')}</a>
            <a href="${href('index.html')}#reviews" class="social-btn" aria-label="Google reviews">${icon('google')}</a>
          </div>
        </div>
      </div>
      <div class="mt-12 pt-6 border-t hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>© <span id="year">2026</span> Lux Cars Chicago. All rights reserved.</p>
        <p class="flex items-center gap-2">${icon('spark','icon-sm text-accent')}Powered by All Auto Network</p>
      </div>
    </div>
  </footer>`;

  // Inject. Sprite + header go at the very top of <body>; footer at the end.
  document.body.insertAdjacentHTML('afterbegin', sprite + header);
  const mainEnd = document.querySelector('[data-partials="footer"]') || document.body;
  if (mainEnd === document.body) document.body.insertAdjacentHTML('beforeend', footer);
  else mainEnd.insertAdjacentHTML('beforebegin', footer);
})();
