# Semantic Variable Examples

A small, real reference implementation of a two-tier design token
architecture — **primitives → semantics** — with a multi-platform build
(CSS custom properties, JSON, Kotlin/Jetpack Compose, Swift), semantic
versioning + changelogs per package, a public Storybook, and one
production-grade React component (`Button`) that demonstrates the
ShadCN-style API surface: polymorphic `as`, `asChild` (Radix Slot),
variant-to-token mapping, and forwarded refs.

The token/semantic split and CSS bridging pattern here follow a common
design-system convention — a primitive palette layer feeding an
intention-based semantic layer — built from scratch as a small, standalone,
public case study.

## Packages

| Package | What it is |
| --- | --- |
| [`@svx/tokens`](packages/tokens) | Primitive + semantic tokens authored as plain CSS custom properties, plus a build that lowers/parses them into `dist/css`, `dist/json`, `dist/compose` (Kotlin), and `dist/swift`. |
| [`@svx/react`](packages/react) | The `Button` component + Storybook. Consumes only semantic tokens, never primitives, directly. |

## Architecture

Tokens are authored as CSS, not JSON — a primitive layer (`primitives.css`)
feeding an intention-based semantic layer (`semantic.css`):

```
packages/tokens/src/primitives.css   @theme static { } two full color ramps (slate + blue,
                                      50->950), plus the spacing/radius/type/duration
                                      steps semantic.css actually references
packages/tokens/src/semantic.css     @theme static { } intention-based aliases
                                      (text, border, interactive, component, motion),
                                      each var(--...) referencing a primitive only, plus a
                                      `.dark { }` block with semantic *overrides* only
                                      (primitives are never redeclared there)
        │
        ▼  build-tokens.mjs (parses the CSS with postcss — no separate JSON source)
packages/tokens/dist/
  css/index.css          `@theme static` lowered to plain `:root { }` + `.dark { }`,
                          so it works with or without Tailwind
  json/tokens.json        { light: {...}, dark: {...} }, resolved (no var() left), nested by category
  json/tokens.flat.json   same, flat
  compose/SvxTokens.kt     SvxTokensLight / SvxTokensDark Kotlin objects (Color / .dp)
  swift/SvxTokens.swift    SvxTokensLight / SvxTokensDark SwiftUI enums (Color / CGFloat)
        │
        ▼
packages/react/src/styles.css   maps each Button variant to semantic CSS variables only
packages/react/src/Button.tsx   polymorphic `as`, `asChild` via @radix-ui/react-slot,
                                variant/size via class-variance-authority, forwardRef
```

`--interactive-surface-hover`/`-pressed` (used by the outline/ghost variants)
are a `color-mix()` overlay, not a hand-picked swatch, so they composite
correctly over any surface underneath. `--interactive-solid*` (the filled
variant) still steps through fixed ramp swatches, since a solid fill needs to
be fully opaque; see the comments atop `semantic.css` for why each approach is
used where it is.

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
