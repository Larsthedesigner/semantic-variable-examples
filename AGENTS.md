# Repository guide

This repository contains `@svx/tokens` and the `@svx/react` component library.
See [README.md](README.md) for setup, architecture, and public APIs.

## Design-system work

- Inspect existing components, stories, and tokens before adding new ones.
- Author tokens in [packages/tokens/src](packages/tokens/src); generated `dist`
  files are build outputs, not the source of truth.
- Follow [design-system guidance](docs/design-system-guidance.md) for token
  decisions, accessibility, and Storybook documentation.
- Preserve the behavior and public API of existing components unless the task
  explicitly calls for a change.

## Verification

- Run focused tests for the changed behavior and check affected Storybook
  stories when changing UI.
- Run `pnpm test`, `pnpm build`, and `pnpm typecheck` when the scope warrants
  repository-wide validation. Report checks that could not be run.
- Do not assume accessibility is covered by CI: Storybook's accessibility addon
  supports inspection, but the current CI does not run its browser tests.
