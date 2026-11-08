# WCAG 3.0 alignment

WCAG 3.0 is still an editor's draft and its conformance model differs
substantially from 2.x: instead of pass/fail success criteria, it scores
**outcomes** across bronze/silver/gold levels, and replaces the WCAG 2.x
contrast ratio math with **APCA** (Accessible Perceptual Contrast Algorithm).
This document records how this repo's token architecture and `Button`
component anticipate that model today, and what remains provisional until
WCAG 3.0 stabilizes.

## Current WCAG 2.2 baseline

- **Contrast**: every semantic `text-on-*` / `interactive-*` pairing in
  [`packages/tokens/src/semantic.css`](../packages/tokens/src/semantic.css)
  (light values, plus the `.dark { }` overrides in the same file) is chosen to
  support WCAG 2.2 AA contrast in both themes. Token tests cover selected
  pairings; check new foreground and background combinations in context.
  Storybook's `addon-a11y` is configured with the `wcag22aa` tag for
  inspection. CI does not currently run automated Storybook accessibility tests.
- **Target size**: Button's visual heights are 24px, 32px, and
  40px. The smallest size does not guarantee a 44px hit area; consumers should
  ensure each instance satisfies WCAG 2.2 SC 2.5.8 through its target dimensions
  and applicable spacing exception, or provide a larger hit area where needed.
- **Focus visibility**: `Button` uses `:focus-visible` with a
  `--system-interactive-focus-ring` box-shadow ring, keeping focus indication
  as a token (not a hardcoded color) so future outcome-level focus
  requirements can be tuned centrally.
- **Keyboard & semantics**: `Button` renders a native `<button>` by
  default; `as`/`asChild` are opt-in escape hatches, so consumers keep
  correct implicit role, keyboard activation (Space/Enter), and disabled
  semantics unless they deliberately choose otherwise.

## What we're tracking for when WCAG 3.0 stabilizes

- **APCA contrast migration**: APCA is polarity- and context-aware (text
  size/weight change the required contrast, and light-on-dark vs
  dark-on-light are scored differently). Once APCA's conformance
  thresholds are finalized, add an APCA check to the token build
  (`build-tokens.mjs` already resolves every token to a literal value —
  a lint pass just needs to score `text-*`/`interactive-*` pairs) and fail
  the build below the target bronze/silver tier — rather than only
  checking WCAG 2.x ratios as we do today.
- **Outcome-based scoring**: evaluate recording an outcome score per component
  (bronze/silver/gold) once the W3C publishes stable scoring guidance, so
  component docs can state a conformance *level*, not just a binary pass.
- **Non-color status cues**: the system includes status and error palettes.
  Communicate status through text, icons, shape, or other cues as well as color.

## Why this belongs in the token layer, not the component

Because `Button` only ever consumes semantic tokens (never raw palette
values, see [`styles.css`](../packages/react/src/styles.css)), contrast and
target-size fixes made in `tokens/src/semantic.css` propagate to every
consumer and platform output (CSS/JSON/Compose/Swift) without touching
component code — the same reason the primitive/semantic split exists.
