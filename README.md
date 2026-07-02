# Lux Cars Chicago — Front-End Scaffold

Static front-end for **Lux Cars Chicago**, a luxury used-car dealership in
Buffalo Grove, IL. **Design phase only** — no backend / CMS yet. Built
mobile-first with Tailwind (CDN) + vanilla JS, on a dark premium theme with a
red brand accent.

> Trusted since 2010 · 88 E Dundee Rd, Buffalo Grove, IL 60089 · 847-947-2900

---

## Run it

No build step. Open `index.html` in a browser, or serve locally for correct
relative paths:

```bash
# from this folder
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## Project structure

```
LUX CARS/
├── index.html              # Homepage — all 9 sections, inline header/footer
├── pages/
│   ├── inventory.html      # Filterable vehicle grid
│   ├── vdp.html            # Vehicle detail page (with Reserve CTA)
│   ├── sell-trade.html     # Value-your-trade flow
│   ├── financing.html      # Credit application
│   ├── warranty.html       # Coverage overview
│   ├── service.html        # Service department
│   ├── about.html          # Family-run story
│   └── contact.html        # Contact + map placeholder
├── assets/
│   ├── img/                # SVG placeholders (hero, vehicles, showroom, logo)
│   ├── icons/              # Thin single-weight SVG icon set (standalone files)
│   └── fonts/              # (reserved for self-hosted fonts later)
├── css/
│   └── styles.css          # Custom layer on top of Tailwind — brand CSS vars
├── js/
│   ├── main.js             # Nav, mobile menu, sticky header, promo rotator
│   ├── filters.js          # Hero inventory filter (Make/Body/Price/Year)
│   ├── carousel.js         # Featured inventory slider
│   ├── animations.js       # Scroll reveals + hero entrance
│   └── partials.js         # Shared header/footer/icon-sprite for inner pages
└── README.md
```

## Brand palette (locked)

Defined as CSS variables in [`css/styles.css`](css/styles.css) and mirrored in
each page's inline Tailwind config. **The one accent is a muted wine-red,
never blue.**

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#0B0B0D` | Near-black base |
| `--color-surface` | `#16171A` | Cards / raised sections |
| `--color-text` | `#F5F5F5` | Primary text |
| `--color-muted` | `#9A9CA3` | Secondary text |
| `--color-border` | `#26272B` | Hairline borders |

### Red accent scale (built around `#8B2828`)

| Token | Value | Use |
|-------|-------|-----|
| `--red-50` | `#F7EAEA` | Lightest tint |
| `--red-100` | `#E9C6C6` | |
| `--red-200` | `#D79A9A` | |
| `--red-300` | `#C16E6E` | |
| `--red-400` | `#A54848` | Small accents (icon highlights, stars, step numbers) |
| `--red-500` | `#8B2828` | **Primary accent** — CTAs, active states, links |
| `--red-600` | `#742020` | Hover |
| `--red-700` | `#5C1919` | Pressed / deep |
| `--red-800` | `#431212` | Large fills / hero overlay tints |
| `--red-900` | `#2B0C0C` | Deepest tint over the dark base |

`--color-accent` / `--color-accent-hover` remain as aliases to `--red-500` / `--red-600`.

### Accent usage rules

- **Primary buttons:** bg `--red-500`, hover `--red-600`, active `--red-700`.
- **Secondary buttons:** outline `--color-border`, text `--color-text`, hover border `--red-500`.
- **Links / active nav / active filter tab:** `--red-500`.
- **Small accents** (icon highlights, rating stars, step numbers): `--red-400`–`--red-500`.
- **Large fills / hero overlays:** `--red-800` / `--red-900` tints over the dark base for depth.
- **Zero blue anywhere.** One accent hue (this red) across the whole page.

## Typography & style

- Uppercase headings, wide letter-spacing, thin/light weights (luxury feel).
- Single typeface: **Inter** (weights 200–700) via Google Fonts.
- Clean whitespace, dark premium theme.

## Icons

One consistent set: **thin, single-weight (stroke 1.5) outline SVGs**, no mixed
styles — addressing the client's dislike of the previous icons. Available two
ways:

1. **Inline sprite** — `<symbol>` defs injected on every page; used via
   `<svg class="icon"><use href="#i-name"/></svg>`.
2. **Standalone files** in [`assets/icons/`](assets/icons/) for reuse elsewhere.

Set: search, phone, filter, chevron (+ left/right), tag, star, truck, shield,
wrench, financing, trade, reserve, menu, close, pin, clock, arrow-right, gauge,
mail, check, plus, spark, and social (facebook, instagram, google).

## Homepage section order

1. Top promo banner (rotating, thin bar above header)
2. Hero — "Hand-picked luxury. Honest pricing." + inventory quick-filter
3. "Browse our full collection" band + body-style chips
4. Value proposition bar (Trusted Since 2010, Lowest Price, etc.)
5. Featured inventory carousel
6. Sell / Trade + Financing split CTA
7. Warranty
8. Service department grid
9. Trust CTA strip → footer

## Navigation (client-approved)

`Home · Inventory · Sell / Trade · Financing · Warranty · Service · About · Contact`

- **Desktop:** horizontal nav, logo left, phone as tap-to-call in header.
- **Mobile:** hamburger dropdown, large tap targets, phone in header **and**
  repeated at the bottom of the mobile menu.

## Design-phase notes / TODO for the build phase

- **Images are SVG placeholders.** Swap `assets/img/*.svg` for real,
  optimized vehicle/hero photography (use `<picture>` + AVIF/WebP + `srcset`).
- **Forms are not wired.** Sell/Trade, Financing, Contact, and the VDP Reserve
  button are front-end only (marked with a dashed "design phase" note).
- **Inventory is static.** `inventory.html` / `vdp.html` show sample vehicles;
  connect a live inventory feed / DMS. The hero filter already forwards
  `?make=&body=&price=&year=` params that `inventory.html` reads back.
- **Shared chrome via `partials.js`.** Inner pages inject header/footer/sprite
  through JS to stay DRY during design. For production, move these to
  server-side includes or a build step (and drop the CDN Tailwind for a
  compiled, purged stylesheet) — this is why the Tailwind config is inline.
- **Performance** (client's #1 priority): defer scripts, lazy-loaded images,
  IntersectionObserver reveals, `prefers-reduced-motion` respected. Revisit
  Core Web Vitals once real assets and the Tailwind build are in.
