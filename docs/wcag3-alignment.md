# WCAG 3.0 alignment

WCAG 3.0 is still an editor's draft and its conformance model differs
substantially from 2.x: instead of pass/fail success criteria, it scores
**outcomes** across bronze/silver/gold levels, and replaces the WCAG 2.x
contrast ratio math with **APCA** (Accessible Perceptual Contrast Algorithm).
This document records how this repo's token architecture and `Button`
component anticipate that model today, and what remains provisional until
WCAG 3.0 stabilizes.

## What we did now (WCAG 2.2 baseline, enforced)

- **Contrast**: every semantic `text-on-*` / `interactive-*` pairing in
  [`packages/tokens/src/semantic.css`](../../packages/tokens/src/semantic.css)
  (light values, plus the `.dark { }` overrides in the same file) is chosen to
  clear WCAG 2.2 AA (4.5:1 text, 3:1 UI component) in both themes. Storybook's
  `addon-a11y` lints every story against the `wcag22aa` tag on every commit.
- **Target size**: `--component-control-min-target` is fixed at `44px`,
  satisfying both WCAG 2.2 SC 2.5.8 (Target Size Minimum) and the
  WCAG 3.0 draft's target-size outcome, so `Button` never needs a
  post-3.0 resize.
- **Focus visibility**: `Button` uses `:focus-visible` with a
  `--border-focus` outline at 2px + 2px offset, keeping focus indication
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
  thresholds are finalized, add an APCA check to the token build (a
  Style Dictionary lint step) that scores every `text-*`/`surface-*` and
  `text-*`/`interactive-*` pair and fails the build below the target
  bronze/silver tier — rather than only checking WCAG 2.x ratios as we do
  today.
- **Outcome-based scoring**: move Storybook's a11y gate from a single
  pass/fail tag to recording an outcome score per component (bronze/
  silver/gold) once the W3C publishes stable scoring guidance, so
  component docs can state a conformance *level*, not just a binary pass.
- **Non-color status cues**: `status.*` tokens currently pair a
  background + foreground color; WCAG 3.0 outcomes emphasize not relying
  on color alone. Track adding a required icon/shape convention
  alongside `status.*` tokens in a follow-up.

## Why this belongs in the token layer, not the component

Because `Button` only ever consumes semantic tokens (never raw palette
values, see [`styles.css`](../../packages/react/src/styles.css)), contrast and
target-size fixes made in `tokens/src/semantic.css` propagate to every
consumer and platform output (CSS/JSON/Compose/Swift) without touching
component code — the same reason the primitive/semantic split exists.
