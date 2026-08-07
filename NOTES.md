# Build notes

## Scope actually completed

All 5 required sections built as Liquid sections with schema, on stock Dawn:

- `sections/hero.liquid`
- `sections/shop-product-grid.liquid`
- `sections/best-selling-combos.liquid`
- `sections/bundles.liquid`
- `sections/reviews-rail.liquid`

Plus the shared plumbing that makes them reusable/merchant-editable:
`snippets/pl-product-card.liquid`, `pl-combo-card.liquid`, `pl-tier-card.liquid`,
`pl-review-card.liquid`, `pl-price.liquid`, `pl-icon.liquid`, and one
stylesheet/script pair (`assets/purelane-sections.css/.js`).

**Not done**: the rest of the file (ingredients, pillars, proof, full range,
why-bundles, categories, trust bar, signup, footer, sticky CTA, nav, ticker,
scroll-synced "scenes" background). Per the brief, cut deliberately to get
the required 5 right rather than spread thin. If I had a 6th hour I'd do
Bundles' actual box-builder interaction (see below) before touching any of
those.

**Honesty about verification**: this was built by reading the prototype's
HTML/CSS/JS directly and reproducing it as Liquid, without a live Shopify
preview in this environment. I could not screenshot-diff it against the
source at every breakpoint the way the brief asks for. Before this goes
anywhere near review, pull it into an actual dev store and eyeball it at
375/768/1024/1440 against the original file open side by side — I'd expect
minor spacing/line-height drift, not structural surprises.

## What I'd flag about the original file

- **~14KB of dead CSS.** The file ships two complete `<style>` blocks — a
  dark "V1" palette and a light "V2" palette with identical selectors. V2
  loads second and wins on every property it touches, so V1 is pure dead
  weight. I only reproduced V2 (the palette that actually renders).
- **12 bespoke product illustrations hardcoded as base64 SVG data-URIs in
  `:root` custom properties** (`--p-tap`, `--p-kitchen`, `--p-combo2`,
  etc.), each duplicated again as an inline `<svg>` block for 4 of the 8
  shop cards. This is most of the 148KB. It's a reasonable prototyping
  shortcut when there's no real photography yet, but it's fabricated
  per-SKU art standing in for product photos — the one part of the file
  that's actively *wrong* for production, not just unclean. I kept exactly
  one generic bottle silhouette as the "no image" fallback and deleted the
  rest; real builds use `product.featured_image`.
- **Every price, discount %, savings amount, rating and review count is
  hand-typed text** with no relationship to any underlying number — e.g.
  `₹499 / ₹897 / Save ₹398` appears as three independent strings that
  happen to be arithmetically consistent today. Same for "33% off" next to
  ₹200/₹299. Nothing enforces they stay consistent if a merchant changes a
  price. This is the core of "real Shopify data" in the brief: every price
  in my build is computed from `variant.price`/`compare_at_price` at
  render time.
- **Unprefixed, collision-prone class names**: `.card`, `.btn`, `.glass`,
  `.wrap`, `.rule`, `.pill` — every one of these either already exists in
  Dawn or is generic enough that a future app/section will pick the same
  name eventually. All namespaced to `pl-` here.
- **A page-level scroll-synced background system** (`.scenes`/`data-scene`
  crossfading 4 gradients as you scroll past section boundaries) that
  assumes a fixed, complete section order. It's incompatible with a
  section-based theme by construction — a merchant reordering or deleting
  a section changes which `data-scene` zones exist, which the JS's
  scroll-position math has no way to know about. I dropped it rather than
  half-fake it (see "Survives the theme editor" below); the hero keeps its
  own self-contained gradient background instead.
- **Duplicate markup for the marquee loop**: the 5 reviews are written out
  twice in the HTML to make the CSS `translateX(-50%)` loop seamless. Same
  effect, but the merchant would be maintaining two copies of every
  review. My version stores each review once and duplicates it only in the
  render, only once there are enough reviews for a loop to look
  intentional (see reviews-rail.liquid).
- **Mouse-parallax on hero product art** (`mousemove` listener moving
  `translate3d` on every frame, is also wired into a global unthrottled
  `requestAnimationFrame` loop that runs three unrelated systems — parallax,
  header shrink, scene-picking). Cut. It's a nice-to-have that costs a
  permanently-attached `mousemove` listener and doesn't do anything for
  touch devices (the large majority of an India-focused D2C store's
  traffic), and reduced-motion users should never get it anyway.

## What I changed in the code, and why

- **CSS/class namespacing** (`pl-` prefix everywhere, `.pl-scope` wrapper
  per section) — Dawn already defines `.card`/`.button`/`.grid` etc; the
  original names would silently restyle unrelated theme elements the
  moment both loaded on the same page.
- **Cards → snippets, data → blocks/settings.** Every repeated card shape
  (`pl-product-card`, `pl-combo-card`, `pl-tier-card`, `pl-review-card`)
  is one snippet used everywhere that shape appears, taking a Shopify
  object as its only real input. Content — which products, in what order,
  with what copy — lives entirely in section blocks/settings, so a
  merchant can add/remove/reorder without a developer, and the "several
  sections render similar cards, build accordingly" requirement is a
  by-product of not duplicating markup in the first place.
- **Combos/bundles priced off a real product, not typed text.** Both
  "combo" and "tier" blocks reference an actual sellable Shopify product
  (`bundle_product` / `tier_product`) for price, compare-at price and the
  checkout link. This was the least obvious modelling decision in the
  whole build and the one I'd defend hardest: it means a merchant can
  never end up with a combo tile showing a price the cart won't honour,
  which the static original had no way to prevent.
- **Reviews → metaobjects, not more section settings.** A `review_card`
  metaobject (definition in `config/metaobjects.json`) instead of cramming
  rating/title/body/author into block settings, so reviews are reusable
  outside this one section (a future PDP reviews block, for instance) and
  bulk-editable from Content → Metaobjects rather than one at a time
  inside a section's block list.
- **Missing native fields solved with metafields, documented as a bridge
  to a real reviews app.** `custom.badge_label` for the shop-grid overlay
  pill, `custom.rating_value`/`custom.review_count` as a fallback when no
  reviews app is installed (checked first: `reviews.rating` /
  `reviews.rating_count`, the namespace Judge.me/Loox/Yotpo already write
  to). Definitions in `config/metafields.json`.
- **Accessibility fixes that weren't stylistic**: the marquee's duplicated
  set is `aria-hidden`; every decorative icon got `aria-hidden`+
  `focusable="false"`; the reviews section has a real (visually-hidden)
  `<h2>` instead of relying on a `<span class="kicker">`; sold-out state
  is communicated in text, not just a dimmed image; the shop grid's
  add-to-cart button becomes a real disabled `<button>` for sold-out
  products and a "Choose options" link (not a blind add) for products with
  real variants, since a card with no variant picker can't safely add a
  specific variant to cart.
- **Performance**: `image_tag` with explicit `widths`/`sizes` (no more
  giant base64 strings inflating every page load regardless of viewport);
  `loading="lazy"` on everything except the first hero slide's first
  image, which is the LCP element and needs to load eager; reveal-on-scroll
  and hero-rotation both check `prefers-reduced-motion` in JS *and* have a
  CSS-only fallback (`@media (prefers-reduced-motion: reduce)` forces
  `animation-duration:.001ms` even before JS runs), so nothing depends on
  JS alone for a user with the OS setting on; dropped the always-on
  `mousemove` listener and the second global RAF loop (see above); trimmed
  the Google Fonts request to the 4 weights actually used instead of 8.
- **JS made theme-editor-safe.** The original was one IIFE that ran once
  on page load and referenced fixed element IDs (`getElementById('hstage')`).
  Rewritten scoped to `[data-pl-section]`/`[data-pl-hstage]` (works with N
  instances of a section on a page), and listens for
  `shopify:section:load`/`:unload`/`:block:select` so adding, removing, or
  focusing a block in the theme editor re-initialises or tears down
  cleanly instead of leaking timers or double-firing observers.
- **Bundles is honestly scoped down.** The original tier cards are a
  *marketing entry point* into "pick any 2/3/5 products for a flat price"
  — the actual picking is a cart/checkout-time interaction (native Shopify
  Bundles, or a build-a-box app), not something a static homepage section
  can implement. My section renders the three tiles and links each CTA to
  the corresponding real product/page; it does not attempt to fake the
  picker. I'd flag this as the one section where "production sections a
  marketing team can run" and "the actual feature" are two different
  projects, and said so rather than papering over it with client-side
  fake state.

## What I'd do with more time

1. **Verify pixel accuracy for real**, side by side with the source file,
   at 375/390/768/1024/1440/1920 — this build was done reading source,
   not visually diffing against a running preview, which is the biggest
   gap between this and a submission I'd stand behind unreservedly.
2. **Bundles' actual builder** — either adopt Shopify's native Bundles
   feature or scope a minimal custom cart-transform, then make the tier
   CTA open that flow directly instead of linking to a product page.
3. **Move to Shopify's inline `{% stylesheet %}`/`{% javascript %}` block
   syntax** per section instead of one shared asset pair wired through
   theme.liquid (see `config/theme-liquid-snippet.txt`) — cleaner
   dependency graph, though functionally equivalent today.
4. **Second-pass i18n**: `locales/en.default.json` here is a fragment of
   new keys (`sections.pl_shared.*`) that need merging into the theme's
   real locale file, plus every other language Dawn ships if the store is
   multi-language.
5. **Visual regression tests** (Percy/Chromatic or a Playwright screenshot
   diff) wired to CI, given "pixel-accurate" is graded criteria here —
   worth automating rather than trusting manual review across breakpoints
   on every future change.
6. **The remaining 8 sections**, roughly in the order they'd matter to a
   merchant: full range → why-bundles → trust bar → ingredients/pillars →
   footer/signup.
