# AI workflow notes

## What I delegated

I used Claude for the whole build in this pass: reading the 1,716-line
prototype (structure, CSS, JS), extracting the resolved (non-dead) style
values, and generating the Liquid sections, snippets, shared CSS/JS,
metafield/metaobject definitions and these notes.

Concretely, the delegation split was:
- **Structural extraction** (which selectors are live vs. dead, where
  section boundaries fall, what each card's actual data shape is) — fully
  delegated, checked by grepping the source for each selector before
  trusting it rather than trusting a first read.
- **Data modelling decisions** (blocks vs. metaobjects vs. metafields;
  pricing a combo off a real product instead of a typed number) — these
  are judgment calls I made, not defaults an agent would pick unprompted;
  the agent's first draft of the combo card used typed price/compare-at
  settings, which is exactly the bug I was trying to fix in the source
  file, so I redirected it to model combos off a real product reference.
- **Liquid syntax correctness** — delegated, but not trusted blind (see
  below).

## Where it failed me

- **Liquid filter chaining silently produces the wrong string, not an
  error.** Twice the first draft piped `| money` *after* a `| t:` call
  (`'...save_amount' | t: amount: savings | money`), which parses fine but
  formats the whole translated sentence as currency instead of the number
  inside it. Liquid doesn't fail loudly here — it just renders garbage —
  so this needs an actual Liquid render (or at minimum a careful line-by-
  line read) to catch, not just "does it look plausible." I caught these
  by re-reading each snippet after generation rather than trusting the
  first pass; a Theme Check run against the actual repo would surface the
  rest.
- **Nested loop scoping** — `forloop.parent.first` inside a loop-within-a-
  loop is easy to get backwards on the first attempt (used it to try to
  mark only the very first image of the very first slide as eager-loaded).
  Worth double-checking against Shopify's actual Liquid docs rather than
  general Liquid knowledge, since `forloop.parent` is a Shopify-specific
  extension, not standard Liquid.
- **Scope creep toward "redesign it properly."** Left unchecked, the
  instinct is to fix everything that looks wrong in the source file (the
  scroll-synced scenes system, the mouse parallax, the marquee) by
  quietly improving on it. The brief is explicit that this is a build, not
  a redesign — so every deviation from the source is written down in
  NOTES.md with a reason, and anything I couldn't justify as "wrong for
  production" rather than "not how I'd have done it" got left alone or
  flagged, not silently changed.
- **No live Shopify preview in this environment**, so nothing here has
  actually been rendered by Shopify's Liquid engine or seen a browser.
  That's the single biggest thing I'd change about how I ran this: I
  would not treat unrendered Liquid as done. It's flagged plainly in
  NOTES.md rather than presented as verified.

## What I'd systematise for 20 more of these

1. **A real render loop before calling anything finished** — Shopify CLI
   theme dev server, `shopify theme check` in CI, and a scripted
   screenshot pass at the standard breakpoints, run automatically rather
   than as a manual last step. Most of what "AI workflow failed" above
   describes is exactly what this would catch immediately.
2. **A standing checklist derived from the brief's "the bar" section**
   (merchant-editable / real data / reusable / survives the editor /
   fast / accessible), applied per-section as it's built rather than
   audited at the end — I did this manually as a mental pass per section
   here; formalizing it as a literal checklist per PR would catch misses
   sooner and make review faster on the human side.
3. **A small fixture pack**: a synthetic Shopify products/collections JSON
   (sold out / no image / long title / normal, matching the seed data the
   brief asks for) that every section can be developed and screenshot-
   tested against without needing a live store round-trip for every
   iteration.
4. **Treat "what did the agent quietly decide" as a required diff review**,
   not just "does the output look right" — the combo-pricing modelling
   choice above is the clearest example of a place where the fast/plausible
   answer and the correct answer diverged, and it only gets caught by
   someone who already knows what "correct" means here.
