# Purelane homepage sections — Dawn build

5 required sections from `purelane-homepage.html`, rebuilt as production
Liquid sections on stock Dawn. See `NOTES.md` for what was flagged/changed
and why, `AI-WORKFLOW.md` for how this was built.

## What's here

```
sections/
  hero.liquid                 → section.hero
  shop-product-grid.liquid    → #shop
  best-selling-combos.liquid  → #combos
  bundles.liquid              → #bundles
  reviews-rail.liquid         → #reviews
snippets/
  pl-product-card.liquid      shop grid card
  pl-combo-card.liquid        combo rail card
  pl-tier-card.liquid         bundle tier card
  pl-review-card.liquid       reviews rail card
  pl-price.liquid             shared price/compare-at/savings markup
  pl-icon.liquid              shared inline SVG icons
assets/
  purelane-sections.css       shared stylesheet, namespaced pl-
  purelane-sections.js        shared behaviour (hero rotator, reveal-on-scroll)
config/
  metaobjects.json            review_card metaobject definition
  metafields.json             product metafield definitions (badge/rating/review count)
  theme-liquid-snippet.txt    the 2 lines to add to layout/theme.liquid
locales/
  en.default.json             new translation keys used by these sections (fragment — merge into the theme's real file)
```

## Setup on a fresh Dawn install

1. Copy `sections/`, `snippets/`, `assets/` into the theme.
2. Merge `locales/en.default.json`'s `sections.pl_shared` block into the
   theme's actual `locales/en.default.json`.
3. Add the two lines in `config/theme-liquid-snippet.txt` to
   `layout/theme.liquid` (CSS in `<head>`, JS before `</body>`).
4. In Shopify Admin → Settings → Custom data → Metaobjects, create the
   `review_card` definition from `config/metaobjects.json`.
5. In Shopify Admin → Settings → Custom data → Products, create the 3
   metafield definitions from `config/metafields.json`.
6. Seed ≥8 products per the brief (1 sold out, 1 with no image, 1 with a
   very long title), plus 3-5 "bundle" products for combos/tiers to price
   off, plus a handful of `review_card` metaobject entries.
7. Add each section to the homepage template via the theme editor and
   configure blocks — every section ships a preset so it renders
   reasonably with zero configuration, but combos/bundles need their
   product references set before they'll show real prices.

## Known gap

This was built by reading the source file directly, without a live
Shopify preview available in the environment it was written in. It has
not been visually diffed against the original at every breakpoint the
brief asks for — that's the first thing to do with this before trusting
it pixel-for-pixel. See `NOTES.md` → "What I'd do with more time".
