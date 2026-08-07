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

## Product GIDs (for wiring section blocks)

| Product | GID | Variant GID |
|---|---|---|
| Tap Cleaner & Limescale Remover | `gid://shopify/Product/9017568657468` | `gid://shopify/ProductVariant/45961043181628` |
| Foaming Kitchen Cleaner | `gid://shopify/Product/9017569706044` | `gid://shopify/ProductVariant/45961044230204` |
| Copper, Bronze & Brass Cleaner | `gid://shopify/Product/9017570492476` | `gid://shopify/ProductVariant/45961045016636` |
| Washing Machine Cleaner & Descaler (sold out) | `gid://shopify/Product/9017572819004` | `gid://shopify/ProductVariant/45961047375932` |
| Organic Dishwash Liquid Gel | `gid://shopify/Product/9017573900348` | `gid://shopify/ProductVariant/45961048522812` |
| Natural Herbal Floor Cleaner (no image) | `gid://shopify/Product/9017574588476` | `gid://shopify/ProductVariant/45961049210940` |
| Non-Toxic Laundry Detergent | `gid://shopify/Product/9017575309372` | `gid://shopify/ProductVariant/45961049997372` |
| Purelane Gentle Hydrating Liquid Handwash… (long title) | `gid://shopify/Product/9017576095804` | `gid://shopify/ProductVariant/45961050783804` |
| Kitchen Essentials Combo | `gid://shopify/Product/9017578160188` | `gid://shopify/ProductVariant/45961052815420` |
| Laundry Care Bundle | `gid://shopify/Product/9017579503676` | `gid://shopify/ProductVariant/45961054191676` |
| Complete Home Bundle | `gid://shopify/Product/9017580126268` | `gid://shopify/ProductVariant/45961054814268` |
| Build Your Box — 2 Products | `gid://shopify/Product/9017580683324` | `gid://shopify/ProductVariant/45961055338556` |
| Build Your Box — 3 Products | `gid://shopify/Product/9017581371452` | `gid://shopify/ProductVariant/45961056026684` |
| Build Your Box — 5 Products | `gid://shopify/Product/9017582092348` | `gid://shopify/ProductVariant/45961056747580` |

## Done on the store (this pass)

- `review_card` metaobject definition created
  (`gid://shopify/MetaobjectDefinition/16744677436`) via Admin GraphQL
  (`metaobjectDefinitionCreate`), matching `config/metaobjects.json`.
- 3 product metafield definitions created via `metafieldDefinitionCreate`:
  `custom.badge_label`, `custom.rating_value`, `custom.review_count`,
  matching `config/metafields.json`.
- 5 `review_card` entries created with Purelane-brand copy (rating,
  title, body, author, author_context), each referencing a real product
  or combo above.
- `custom.badge_label` set on 4 shop-grid products: Tap Cleaner &
  Foaming Kitchen Cleaner → "Best seller", Copper/Bronze/Brass Cleaner →
  "Top rated", Washing Machine Cleaner & Descaler → "New".

## Still needed on the store (not done by this pass)

- Theme code (`sections/`, `snippets/`, `assets/`, `locales/` fragment)
  is NOT yet installed on the theme — Shopify CLI is not available in
  this environment (no npm/npx/yarn/pnpm to install it with). Needs
  Shopify CLI or the admin code editor, once available.
- Section blocks (hero slides, combo/tier product references, review
  blocks) aren't wired up yet — that happens in the theme editor once
  the code is installed, pointing blocks at the products above.
