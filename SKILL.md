# Lux Cars Chicago - Design System (source of truth)

Living spec: `design-system.html`. Tokens live in `css/styles.css` and are the
single source; this document mirrors them. Version 1.0.

Structure follows a Foundations / Components / Patterns discipline (borrowed
conceptually from mature automotive design systems, not their assets).

## Identity

- Special Gothic Expanded One: display headings, section headings, major labels, selected eyebrows.
- Manrope: body, UI, cards, nav, filters, buttons, meta, forms.
- Dark warm-neutral base.
- Oxblood red is the one action color.
- Platinum is the one decorative metallic.
- No blue anywhere.
- Premium automotive restraint: confident, calm, direct. Not decorative, not loud.

## Foundations

### Color

Base (warm neutral):

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#0B0B0D` | Warm charcoal base |
| `--color-surface` | `#16171A` | Cards / raised sections |
| `--color-border` | `#26272B` | Component hairline borders |
| `--color-text` | `#F5F5F5` | Primary text |
| `--color-muted` | `#9A9CA3` | Secondary text |

Oxblood red scale (action color - do not change):

`--red-50 #F7EAEA`, `--red-100 #E9C6C6`, `--red-200 #D79A9A`, `--red-300 #C16E6E`,
`--red-400 #A54848`, `--red-500 #8B2828` (primary), `--red-600 #742020` (hover),
`--red-700 #5C1919` (pressed), `--red-800 #431212`, `--red-900 #2B0C0C`.

Platinum / silver metallic (decorative only):

| Token | Value | Use |
|-------|-------|-----|
| `--platinum-300` | `#D8DBDE` | Light silver: hairline highlights, focus rings |
| `--platinum-400` | `#A9AEB4` | Platinum: icon accents, thin dividers, review stars, LUX "X" mark, text-link hover |
| `--platinum-500` | `#7C8288` | Deep pewter: pressed / active metallic details only |
| `--divider-platinum` | `platinum-400 @ 15%` | Thin section dividers |

**Platinum rule.** Decorative only, sparse and thin. Allowed: hairlines, small
icon strokes, review stars, thin section dividers, the LUX "X" mark, focus rings,
subtle text-link hover. Not allowed: primary buttons, CTA backgrounds, large fills,
badges, price emphasis, major navigation actions. Platinum is cooler than the warm
base; that contrast is intentional. It must never compete with red or read as blue,
cold, techy, or SaaS-like.

One action color (oxblood red), one decorative metallic (platinum).

### Typography

Fluid scale tokens in `css/styles.css` (`--fs-2xl` ... `--fs-display`). Special
Gothic Expanded One is a single-weight (400) expanded display face; do not fake
heavier weights. Manrope carries all reading and UI text.

### Iconography, Spacing, Radius, Accessibility, Photography, Tone

- Icons: one thin single-weight (1.5) outline set; accents may use `--platinum-400`.
- Accessibility: platinum focus ring (2px `--platinum-300`, offset 2px), AA contrast,
  readable type, full keyboard nav. Part of the brand, not an add-on.
- Photography: real, uncropped vehicle photography is a luxury signal. Restraint,
  contrast, and spacing over decoration.

## Components

Buttons, Links, Inputs, Selects, Badges, Vehicle cards, Review cards, Value cards,
Trust items. Actions stay red. Each component is documented with Usage, Specs,
States, and Do / Don't.

## Patterns

Hero search bar, Inventory grid, Trust rail, Split CTA blocks, Warranty / service
feature grid, Reviews strip, Final CTA, Footer.

## System principles

- Coherence: every page feels like one dealership, not separate campaigns.
- Restraint: luxury comes from spacing, hierarchy, contrast, and photography.
- Scalability: components support homepage, SRP, VDP, finance, service, and trade.
- Accessibility: contrast, focus states, readable type, and keyboard nav are brand.

## Tone of voice

Inspiring not intimidating. Dialogue not broadcast. Sophisticated but approachable.
Direct and confident. No cheap dealer language, no aggressive urgency, no fake
exclusivity, no bad-credit tone. Short and confident.

Do: "Search our hand-picked inventory." Don't: "Discover unbeatable deals today!"

## Phase 2A: luxury brand rules

### Color usage ratio

Proportion is the luxury signal. Warm-neutral base + negative space: min 60%
(backgrounds, surfaces, footer, structure). Oxblood red: 8-12% (primary CTA,
active nav, key action states only). Platinum: 3-6% (hairlines, review stars,
focus rings, LUX "X", subtle icon strokes, text-link hover). Text/muted: the
remaining balance. Red is the only action color; platinum never becomes a second
CTA; supporting tints are not a secondary palette. No extra accents, no blue, no gold.

### Luxury hygiene

- No distressed pricing: no "huge savings / discounted / price reduced / special
  offer / was-now / blowout / manager special." Use: view inventory, request
  details, get a clear number.
- No desperate inventory language: no "large inventory / huge selection /
  immediate delivery / must go / in stock now / limited time." Use: hand-picked,
  carefully selected, updated collection.
- No fake exclusivity: no "VIP only / ultra exclusive / rare chance today / once
  in a lifetime." Use: private appointments, curated vehicles, a personal experience.
- No visual clutter: one message and one primary CTA per section; clean imagery;
  strong negative space. No stacked badges, heavy overlays, or crowded cards.
- No badge abuse: small functional labels only. No oversized certification badges,
  random trust seals, or sticker-style graphics.

### Content style

Direct, premium, calm, trustworthy, human, simple. Authoritative without being
bossy. One key message per section. Short headings, short sentences, plain words.
If it sounds like an ad, rewrite it; if it sounds desperate, remove it; if it needs
three adjectives, simplify. No em or en dash in visible copy (use hyphen or colon).

### Photography rules

Real, color photography only (no black-and-white or duotone vehicles). Natural
saturation and balance, clean uncluttered environments, no AI-looking cars or stock
cliches. Exterior: preserve shape and stance, no wide-angle distortion, no dirty
pavement/gravel/clutter, headlights on when appropriate, keep styling lines. Interior:
even cabin light, no dust/fingerprints/wear, wheel centered, seats aligned, no harsh
flash. Hero: leave negative space for copy, scrim aids readability without hiding the
car, cinematic and calm. People/service: natural and engaged, no staged handshakes or
camera stares, clean workspace. Crops: intentional, flexible space, never lose context.

### Icon rules

One simple single-weight outline set, 1.5px stroke. Default color muted or platinum;
red only for action or active state. Max two colors per icon. Sizes: small 14px,
standard 18px, large 24px. No filled, bulky, emoji-like, or third-party icon styles;
never mix libraries or stroke widths.

### Logo and mark usage

One wordmark, white on the dark base, with a subtle platinum "X" (--platinum-400).
Header ~34px tall, footer ~40px, mobile smaller. Do not stretch, recolor, or add
glow/shadow/outline/gradient; keep clear space and contrast; never place over busy
imagery without contrast. Clear space (cap height), minimum digital size (120px), and
a dark-on-light version are Proposed until sign-off.

### Header and footer rules

Header: clear predictable nav, phone easy to find, primary CTA red, no overcrowding
and no "specials"/discount items. Mobile keeps Inventory, Financing, Sell/Trade,
Service, Contact. Footer: quiet and complete (address, phone, core nav, legal, social);
not a second homepage; maintain contrast and keyboard focus.

### Pattern QA checklist

Before shipping a page, check: page identity (brand, fonts, colors), action hierarchy
(one primary CTA, red-only buttons, decorative platinum), content quality (calm,
no distressed/urgent language), photography (shape preserved, clean, intentional crop),
component consistency (shared tokens, consistent hover/focus), accessibility (visible
focus, contrast, readable errors, tap targets, no hover-only content), and mobile
(clean stacking, usable filters, readable cards, accessible nav).

### Spacing rhythm

Approved scale (Proposed as `--space-*` tokens; not yet in styles.css, not yet
rolled across the site): 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120 px.

- Section to section (desktop): hero to next 80-96px; standard 96px; compact
  related 64px; footer top 80px. Mobile: hero to next 56-64px; standard 64px;
  compact 40-48px.
- Section header: eyebrow to title 10-12px; title to body 16-20px; body to CTA
  24-32px; header to content grid 40-48px.
- Card: padding 24px (compact 16px); image to title 16px; title to meta 8px;
  meta to price 12px; price to CTA 16px; grid gap 24px desktop, 16px mobile.
- Button: icon to label 8px; horizontal padding 20-24px; vertical padding
  12-14px; group gap 12px; CTA block buttons from text 24px.
- Form: control padding 14-16px; filter group gap 12px desktop, 10px mobile;
  label to input 8px; input to error 6px; search button gap 12-16px.
- Text rhythm: paragraph gap 12-16px; list item gap 8px; small meta group 6-8px;
  no huge gaps inside small components.
- Luxury rules: more space between sections, less noise inside components; do not
  crowd CTAs; do not place headings tight to borders; card grids must not feel
  like a discount inventory wall; use spacing for hierarchy before decoration; if
  a section feels cheap, remove elements before adding effects.

### Inputs and selects

Premium and quiet. Background `--color-surface-2`, 1px `--color-border`, radius
12px, padding 14-16px, min height 50px, text 14px, muted placeholder. Focus ring:
2px `--platinum-300` (visible on dark), not red. Error: `--red-400` border plus an
icon and a message (never color alone). Disabled: 45% opacity, not-allowed. Search
and submit actions stay red. No generic SaaS styling; no oversized controls outside
the hero search.

### Cards and badges

Cards share one surface system: `--color-surface`, 1px `--color-border`, radius 14px.
Vehicle card: 4:3 contain image (full car), title 18px/600, meta 12px muted, price
20px/600 (calm, never distressed), uppercase link that goes platinum on hover,
padding 24px (compact 16px), hover lifts translateY -6px with a red-tinted border,
focus shows the platinum ring. Badges are functional: muted surface and border by
default, red only for a meaningful active/primary status, platinum only as a subtle
border or icon detail. No sticker-style badges, oversized trust seals, certification
clutter, or distressed-pricing badges.

### Radius

Refined, not bubbly. Scale (full set Proposed; only `--radius` 14px and `--radius-sm`
10px exist today): 4px small details, 8px small buttons/chips, 12px inputs/selects,
16px cards/surfaces, 24px large editorial panels, 999px pills/badges/icon buttons.
Keep one radius across related components; avoid SaaS over-rounding; pills only for
compact labels and chips.

### Inventory grid

Curated, not crowded. Columns: 3 desktop / 2 tablet / 1 mobile; gap 24px desktop,
16px mobile. Full, clean photos with no heavy overlays; consistent card heights;
title, meta, price, and CTA aligned across cards. Price stays calm (never distressed).
Provide skeleton loading, an empty/no-results state with a reset, and clean pagination
and filters. Mobile cards must be easy to scan and tap. No discount-style badges.

### Reference brand usage disclaimer

Ferrari, Bentley, Rolls-Royce, and Rolls-Royce SMR inform discipline, not identity.
Never copy their colors, logos, marks, layouts, photography, icons, or proprietary
systems. Borrow only principles: restraint, consistency, hierarchy, accessibility,
typography discipline, photography quality, tone control.
