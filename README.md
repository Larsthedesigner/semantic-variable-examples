# Semantic Variable Examples

A small, real reference implementation of a two-tier design token
architecture — **primitives → semantics** — with a multi-platform build
(CSS custom properties, JSON, Kotlin/Jetpack Compose, Swift), semantic
versioning + changelogs per package, a public Storybook, and React components
including a production-grade `Button` that demonstrates the ShadCN-style API
surface (polymorphic `as`, `asChild` via Radix Slot, variant-to-token mapping,
and forwarded refs), an `IconButton` with a required accessible name, and a
Material Symbols wrapper with shared fixed-size presets.

The token/semantic split and CSS bridging pattern here follow a common
design-system convention — a primitive palette layer feeding an
intention-based semantic layer — built from scratch as a small, standalone,
public case study.

## Packages

| Package | What it is |
| --- | --- |
| [`@svx/tokens`](packages/tokens) | Primitive + semantic tokens authored as plain CSS custom properties, plus a build that lowers/parses them into `dist/css`, `dist/json`, `dist/compose` (Kotlin), and `dist/swift`. |
| [`@svx/react`](packages/react) | `Button`, `IconButton`, and `MaterialSymbol` components + Storybook. Consumes only semantic tokens, never primitives, directly. |

## Architecture

Tokens are authored as CSS, not JSON — a primitive layer (`primitives.css`)
feeding an intention-based semantic layer (`semantic.css`):

Primitive color families use ordinal stops in increments of 100, ordered
light to dark (for example, `--color-neutral-100`). These numbers do not imply
equal perceptual intervals or equivalent lightness across different families.
Size primitives use pixel-equivalent suffixes: `--size-2-px` is 2px,
`--size-8-px` is 8px, and `--size-14-rem` is 0.875rem (14px at a 16px
root). The rem values scale with the user's root font size. Existing px/rem
variants share the same naming scale; only needed stops are declared.

```
packages/tokens/src/primitives.css   @theme static { } existing size/type values plus
                                      palette values needed by the system semantic
                                      surface/text/icon/border/interactive/status roles
packages/tokens/src/semantic.css     existing control tokens plus the system semantic
                                      API; `.dark { }` and `.high-contrast { }` contain
                                      semantic overrides only (never primitive overrides)
        │
        ▼  build-tokens.mjs (parses the CSS with postcss — no separate JSON source)
packages/tokens/dist/
  css/index.css          `@theme static` lowered to plain `:root { }` + mode overrides,
                          so it works with or without Tailwind
  json/tokens.json        { light, dark, highContrast }, resolved, nested by category
  json/tokens.flat.json   same, flat
  compose/SvxTokens.kt     SvxTokensLight / SvxTokensDark / SvxTokensHighContrast
  swift/SvxTokens.swift    SvxTokensLight / SvxTokensDark / SvxTokensHighContrast
        │
        ▼
packages/react/src/styles.css   maps each Button variant to semantic CSS variables only
packages/react/src/button/      polymorphic `as`, `asChild` via @radix-ui/react-slot,
                                variant/size via class-variance-authority, forwardRef
packages/react/src/icon-button/ builds on Button with a required accessible name
packages/react/src/icons/       provides the Material Symbols Rounded wrapper and size presets
```

`MaterialSymbol` icons are decorative by default and accept a ligature name
(for example, `add`). The optional `@svx/react/material-symbols.css` stylesheet
loads the Material Symbols Rounded variable font from Google Fonts; import it
alongside `@svx/react/styles.css` to render those ligatures. Applications that
need self-hosted fonts can provide the same font family locally instead. The
font is distributed under the Apache License 2.0.

Button and IconButton support only Material Symbols for their icon props.
Pass ligature names rather than React elements; each control renders
`MaterialSymbol` internally. SplitButton uses IconButton for its dropdown
trigger. All three share icon sizes of 12px / 16px / 20px for `sm` / `md` /
`lg` controls, and the internal SVG loading spinner follows the same sizing.

```tsx
<Button iconStartIcon="add" iconEndIcon="arrow_forward">Add item</Button>
<IconButton label="Add item" icon="add" />
```

This replaces the previous React-node icon props: change
`icon={<MaterialSymbol name="add" />}` to `icon="add"` (and likewise for
`iconStartIcon` / `iconEndIcon`). Load the font stylesheet or supply a
self-hosted font for all three controls, including SplitButton.

`--system-interactive-surface-hover`/`-pressed` (used by the outline/ghost variants)
are a `color-mix()` overlay, not a hand-picked swatch, so they composite
correctly over any surface underneath. `--system-interactive-solid*` (the filled
variant) still steps through fixed ramp swatches, since a solid fill needs to
be fully opaque; see the comments in `semantic.css` for why each approach is
used where it is. A few pre-existing non-color component sizing tokens remain
temporarily; the token file identifies them and their consumers for follow-up.

Any token whose resolved value isn't a plain hex color / px dimension / plain
number (e.g. a future gradient or `color-mix()`) is intentionally skipped from
the Compose/Swift output — flagged in a comment — since CSS-only values like
gradients have no native platform representation.

See [`docs/wcag3-alignment.md`](docs/wcag3-alignment.md) for how contrast, target
size, and focus visibility are enforced today and what's tracked for when
WCAG 3.0's APCA-based conformance model stabilizes.

## Getting started

```bash
corepack enable
pnpm install
pnpm build            # builds tokens, then react (turbo respects the dependency)
pnpm test
pnpm storybook         # http://localhost:6006
```

## Versioning & releases

This repo uses [Changesets](https://github.com/changesets/changesets) for
independent semantic versioning and per-package `CHANGELOG.md` generation.

```bash
pnpm changeset          # describe your change, pick bumped packages
pnpm version-packages    # applies version bumps + changelog entries
pnpm release              # build + publish
```

## CI/CD

- **`.github/workflows/ci.yml`** — install, build, test, typecheck on every push/PR.
- **`.github/workflows/release.yml`** — Changesets release PR / publish flow on `main`.
- **`.github/workflows/storybook.yml`** — builds `@svx/react`'s Storybook and deploys it to GitHub Pages on `main`.

## License

MIT — see [`LICENSE`](LICENSE).
