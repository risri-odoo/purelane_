# Seed data created on the dev store

Created directly on `my-store-300000000000000013697.myshopify.com` via the
Shopify Admin API (not part of this repo — products live in the store, not
in code). Listed here so the reviewer/reader knows what exists and why,
and so it's reproducible if the store gets reset.

## Shop-grid products (8 — matches the brief's seed requirements)

| Product | Price | Compare-at | Notes |
|---|---|---|---|
| Tap Cleaner & Limescale Remover | ₹200 | ₹299 | in stock (60) |
| Foaming Kitchen Cleaner | ₹200 | ₹299 | in stock (60) |
| Copper, Bronze & Brass Cleaner | ₹200 | ₹299 | in stock (60) |
| Washing Machine Cleaner & Descaler | ₹200 | ₹299 | **sold out** (0 stock, tracked) — the required sold-out seed |
| Organic Dishwash Liquid Gel | ₹200 | ₹299 | in stock (60) |
| Natural Herbal Floor Cleaner | ₹200 | ₹299 | in stock (60), **no image** — the required no-image seed |
| Non-Toxic Laundry Detergent | ₹220 | ₹320 | in stock (60) |
| Purelane Gentle Hydrating Liquid Handwash for Sensitive Skin with Aloe Vera and Coconut-Derived Surfactants, Dermatologically Tested, Free From Sulphates, Parabens and Artificial Dyes — 250ml Pump Bottle | ₹150 | ₹220 | in stock (60), **very long title** — the required long-title seed |

Images: real, generic (no logos/brand names/text) product photography
pulled via Shopify's own sample-product catalog — not fabricated
placeholder URLs, not hotlinked from an unrelated third-party site.

## Backing products for combos/tiers (6)

These are what `pl-combo-card.liquid`/`pl-tier-card.liquid` reference for
real price/compare-at/checkout — see NOTES.md for why combo and tier
prices are modelled this way instead of typed text.

| Product | Price | Compare-at |
|---|---|---|
| Kitchen Essentials Combo | ₹499 | ₹897 |
| Laundry Care Bundle | ₹499 | ₹947 |
| Complete Home Bundle | ₹799 | ₹1,495 |
| Build Your Box — 2 Products | ₹349 | ₹598 |
| Build Your Box — 3 Products | ₹499 | ₹897 |
| Build Your Box — 5 Products | ₹799 | ₹1,495 |

No images on these 6 — they're multi-item boxes, not single SKUs. Real
box photography would replace this gap if/when available.

## Still needed on the store (not done by this pass)

- Theme code (`sections/`, `snippets/`, `assets/`, `locales/` fragment)
  is NOT yet installed on the theme — no Shopify CLI / theme-file access
  was available from this environment. Needs Shopify CLI or the admin
  code editor.
- `review_card` metaobject definition (`config/metaobjects.json`) not
  yet created — no metaobject-definition tool was available. Needs
  Admin → Settings → Custom data, or the Admin GraphQL API directly.
- Product metafield definitions (`config/metafields.json`) — same gap,
  same fix.
- No review_card entries exist yet (blocked on the metaobject definition
  above).
- Section blocks (hero slides, combo/tier product references, review
  blocks) aren't wired up yet — that happens in the theme editor once
  the code is installed, pointing blocks at the products above.
