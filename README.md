# Semantic Variable Examples

A small, real reference implementation of a two-tier design token
architecture — **primitives → semantics** — with a multi-platform build
(CSS custom properties, JSON, Kotlin/Jetpack Compose, Swift), semantic
versioning + changelogs per package, a public Storybook, and one
production-grade React component (`Button`) that demonstrates the
ShadCN-style API surface: polymorphic `as`, `asChild` (Radix Slot),
variant-to-token mapping, and forwarded refs.

The token/semantic split and CSS bridging pattern here are modeled on the
primitive/semantic layering used in SMG's `smg-web-react-forge` monorepo
(`theme-vars.css` → `semantic-vars.css`), reimplemented from scratch as a
small, standalone, public example — not copied code.

## Packages

| Package | What it is |
| --- | --- |
| [`@svx/tokens`](packages/tokens) | Primitive + semantic token source (JSON) and a Style Dictionary build emitting `dist/css`, `dist/json`, `dist/compose` (Kotlin), and `dist/swift`. |
| [`@svx/react`](packages/react) | The `Button` component + Storybook. Consumes only semantic tokens, never primitives, directly. |

## Architecture

```
packages/tokens/tokens/primitives.json   raw palette, spacing, radius, type, duration scales
packages/tokens/tokens/semantic.json     intention-based aliases (background, surface, text,
                                          border, interactive, status, component, motion),
                                          referencing primitives only
packages/tokens/tokens/semantic.dark.json  dark-mode overrides of the semantic layer only
        │
        ▼  build-tokens.mjs (Style Dictionary, programmatic API)
packages/tokens/dist/
  css/index.css        :root { --primitives } + :root/[data-theme='dark'] { --semantics }
  json/tokens.json      nested snapshot
  json/tokens.flat.json flat kebab-case snapshot
  compose/SvxTokens.kt   Jetpack Compose object (Color / .dp)
  swift/SvxTokens.swift  SwiftUI enum (Color / CGFloat)
        │
        ▼
packages/react/src/styles.css   maps each Button variant to semantic CSS variables only
packages/react/src/Button.tsx   polymorphic `as`, `asChild` via @radix-ui/react-slot,
                                variant/size via class-variance-authority, forwardRef
```

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
