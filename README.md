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
Size primitives use pixel-equivalent suffixes: `--size-px-2` is 2px,
`--size-px-8` is 8px, and `--size-rem-14` is 0.875rem (14px at a 16px
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
When reduced motion is requested, the spinner remains visible but stops
rotating. Loading controls remain disabled and expose `aria-busy`.

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

Storybook opens with an introduction to the token layers, component references,
and AI-assisted workflow. Use the sidebar to explore foundations and component
stories, or follow a direct story link to open a specific example.

### Storybook MCP

The Storybook 10 dev server provides the official MCP addon and component
manifest. Run `pnpm storybook`, then start/trust `svx-storybook` from VS Code's
MCP server controls. The workspace configuration lives in `.vscode/mcp.json`
and connects to `http://127.0.0.1:6006/mcp`. Restart/reload MCP tools in the
agent session if the server does not appear automatically.

The server binds to loopback only. Its docs tools discover components, props,
and stories; development tools provide story guidance and previews. Prefer
those tools for component context and reserve browser inspection for visual
checks. MCP test execution is intentionally disabled: the existing Vitest
suite remains the test runner, without introducing Storybook's browser-test
addon. Static Storybook builds do not host the MCP server.

### Theme foundations and token reference

All six primitive color families use 12 light-to-dark stops (`100`–`1200`).
Blue `800` is Apple system blue `#007AFF`; solid actions with small white text
use a darker semantic mapping to meet 4.5:1 contrast. Error, success, warning,
and info palettes use coordinated red, green, amber, and informational blue.
Magenta is removed; escalated workflow status now uses the error foreground.
Semantic names stay stable, but palette colors and removed primitive stops are
intentional theme changes. Update direct primitive consumers; application
components should consume semantic roles instead.

The px/rem size ramps have identical steps and unit-first names:
`--size-px-2` and `--size-rem-2`. Steps describe pixel equivalents at a
16px root. Previous unit-suffix names are removed; migrate direct references
and overrides. Typography and motion have their own meaningful scales; they are
not padded to match the number of color stops.

App-wide spacer semantics use `--system-spacer-rem-{size}` and
`--system-spacer-px-{size}` for margins, padding, and layout gaps:

| Size | Baseline px | rem |
| --- | --- | --- |
| `2xs` | 2 | 0.125 |
| `xs` | 4 | 0.25 |
| `sm` | 8 | 0.5 |
| `md` | 12 | 0.75 |
| `lg` | 16 | 1 |
| `xl` | 24 | 1.5 |
| `2xl` | 32 | 2 |
| `3xl` | 40 | 2.5 |

Prefer rem for text-led forms, menus, content padding, and application layout
that should follow the computed root (`html`) font size. It does not follow a
component's local font-size override. For example,
`gap: var(--system-spacer-rem-md)` is 12 CSS px at a 16px root and 15 CSS px at a
20px root; `--system-spacer-px-md` remains 12 CSS px in both cases.
Use px for deliberately fixed CSS-pixel spacing, such as the current
pixel-sized Button's padding and icon-label gaps, not as the default for
text-led content. CSS pixels are not physical device pixels, and normal browser
page zoom enlarges both px and rem. Neither unit responds to viewport width
automatically or prevents text overflow in fixed-height controls; use responsive
layout rules and allow content to grow or wrap. Root-relative spacing follows
browser font preferences only when the root font-size configuration respects
those preferences. These roles are consistent across theme modes.

Storybook's **Foundations / Color** and **Foundations / Size** each have
Primitives and Semantics stories. Color Semantics lists app-wide color roles;
Size Semantics lists the spacer scale with rendered previews.
**Foundations / Typography** has Primitives and Semantics stories, while
**Foundations / Motion** retains the timing primitive reference.
Color Semantics shows the CSS variable, square light-mode and dark-mode color
previews, usage guidance, the authored light-mode mapping, and the resolved
light-mode value. Both previews remain fixed when the mode selector changes.
Color roles share one table with purpose filters, an All option, and token counts.
Each mode preview is a single colored square; transparent colors composite over
the table surface.
System usage descriptions identify the CSS role, example elements, intended
surface or state, and companion tokens where relevant. They describe purpose
rather than assuming a particular palette value or guaranteeing contrast.
These descriptions live in inline comments beside the base declarations in
`packages/tokens/src/semantic.css`; Storybook reads them directly so source
documentation and the reference table stay aligned across modes.
All foundation references share a page header, and color primitives use connected
palette strips with an Apple blue anchor marker.
Size and component references show selected-mode values and transitive primitive
dependencies. Data comes from the CSS sources, not a
duplicated palette snapshot. Color-mix values remain CSS expressions; their
displayed previews are rendered by the browser. Usage describes intent rather
than guaranteeing contrast on every possible surface.

Reference layouts share the Storybook-only `.storybook/storybook.css` stylesheet,
imported once by the preview. Its `sbx-*` classes provide themed tables, sticky
headers, keyboard-focusable scroll regions, palette grids, and transparency
checkerboards. Only token-driven preview values remain inline. These styles are
not included in the published React component stylesheet.

The semantic layer and Semantics story contain only `--system-*` roles.
Component-owned tokens live in `packages/tokens/src/components/`, grouped by
owner and imported through `components.css`. This includes Switch geometry and
thumb treatment, Field gaps, Label/SupportingText typography, Input/Textarea
sizes, Tooltip surfaces, and workflow status mappings. These roles use
`--component-*` names rather than `--system-*`; update overrides using their
previous names. Shared compatibility aliases remain in `shared-controls.css`.
The canonical bundle loads primitives, app-wide semantics, then component
tokens. Color mappings consume system roles; geometry consumes primitive scales.
Component stories include a Tokens table; Toggle shares Button tokens and
Textarea shares Input tokens.

Component padding and gaps map to spacer semantics through their component
tokens: Button (also Toggle/SplitButton), Label, SupportingText, Input/Textarea,
and Menu. Button spacing stays pixel-exact; form-text and Menu spacing retain
rem scaling. Compatibility spacing aliases also map to the system scale.
Two intentional 6px exceptions remain: Field's vertical gap and large
Input/Textarea vertical padding. Their component tokens reference `--size-rem-6`
because the T-shirt spacer scale has no 6px step. Switch thumb inset, focus-ring
offset/width, radii, and control/icon dimensions are geometry, not layout
spacers, and remain independent. Zero spacing remains a literal reset.

### Typography foundations

Typography follows primitives into prescribed system bundles. Primitive sizes
run from xs (12px equivalent) through 5xl (40px equivalent), with sans/monospace
families, 400/500/600/700 weights, unitless line-height ratios, and tracking.
Font sizes use rem. Existing dimension-based `--line-height-*` primitives
remain available; system bundles use `--line-height-ratio-*` so their line
boxes follow the element's font size.

The default sans family is self-hosted **Inter Variable**, provided by the
`@fontsource-variable/inter` dependency and imported by the component stylesheet.
Its normal style supports weights 100-900 and loads with `font-display: swap`;
the system-font fallback remains available during loading. Font files are
served by the application's CSS bundler, not requested from Google Fonts.
The package includes the SIL Open Font License, also copied to
`@svx/react/dist/inter-OFL.txt` by the build. Retain the font license when
redistributing font assets. Use the same family token to rebrand centrally.

Each `--system-type-{role}` bundle has `-font`, `-tracking`, and `-color` members:

```css
.page-title {
  font: var(--system-type-h1-font);
  letter-spacing: var(--system-type-h1-tracking);
  color: var(--system-type-h1-color);
}
```

Apply the complete bundle rather than independently choosing size, weight,
tracking, or foreground. `font` is a CSS shorthand; it does not include
letter spacing or color. Type styles do not supply margins or layout gaps.

| Role | Intended markup | Baseline size / line height | Weight | Foreground |
| --- | --- | --- | --- | --- |
| h1 | h1, main page title | 32 / 40 | 700 | Primary |
| h2 | h2, major section | 24 / 32 | 600 | Primary |
| h3 | h3, subsection | 20 / 28 | 600 | Primary |
| h4 | h4, nested subsection | 18 / 28 | 600 | Primary |
| h5 | h5, deeper heading | 16 / 24 | 600 | Primary |
| h6 | h6, deepest heading | 14 / 20 | 600 | Primary |
| body | p, ordinary content | 16 / 24 | 400 | Primary |
| body-secondary | p, supporting content | 16 / 24 | 400 | Secondary |
| body-sm | p, compact content | 14 / 20 | 400 | Primary |
| label-sm | span, compact interface text | 12 / 16 | 500 | Primary |
| label-md | span, standard interface text | 14 / 20 | 500 | Primary |
| label-lg | span, larger interface text | 16 / 24 | 500 | Primary |
| caption | span, metadata and annotations | 12 / 16 | 400 | Secondary |
| code | code, inline technical content | 14 / 20 | 400 | Primary |

Heading levels follow document hierarchy, not the desired visual size.
The label bundles do not replace the accessible Label component. Label sizes
sm/md/lg map to the corresponding system label fonts and tracking. SupportingText
sm/md use caption, while lg uses body-sm. Their existing sizes, line heights,
native markup, required/optional indicators, icons, and accessible associations
are preserved. Both components retain secondary, error, success, or disabled
foreground handling rather than inheriting the generic type-bundle color.
Other controls retain their existing typography mappings.
These bundles target standard content surfaces; no speculative accent,
inverse, or on-deep variants are introduced. Foreground aliases follow the
theme's existing text roles in root-level and scoped dark/high-contrast modes.

Secondary text uses neutral 900 (`#595964`) in light mode and neutral 600
(`#afafb8`) in dark mode for clearer separation from primary text. It retains
at least 4.5:1 contrast on the standard content surfaces tested in each mode.
High-contrast mode intentionally retains the primary-strength foreground.

Typography Semantics displays all 14 bundles as real text specimens, with
intended markup, usage, authored mappings, resolved values, and primitive
dependencies. These are token foundations, not a new public React typography
component or global heading reset.

### Radius semantics

Corner rounding uses a shared shape scale, not spacer tokens:

| Semantic | Default | At a 16px root |
| --- | --- | --- |
| `--system-radius-none` | 0 | 0 |
| `--system-radius-xs` | 0.125rem | 2px |
| `--system-radius-sm` | 0.25rem | 4px |
| `--system-radius-md` | 0.5rem | 8px |
| `--system-radius-lg` | 0.625rem | 10px |
| `--system-radius-xl` | 1rem | 16px |
| `--system-radius-2xl` | 1.5rem | 24px |
| `--system-radius-full` | 50% | Circle on square boxes; ellipse on rectangles |
| `--system-radius-pill` | 9999px | Capsule on ordinary rectangular controls |

Component-owned radius tokens reference these semantics. Buttons, inputs,
textareas, cards, menus, and tooltips use md/lg; checkboxes and skeleton blocks
use sm; radios and circular skeletons use full; switches use pill. Joined control
edges use none. The legacy `--radius-md` alias remains for compatibility.
T-shirt values scale with root font size, including Input and large Button
corners that previously used fixed pixels. At a 16px root their shape is
unchanged. Shape and spacing are separate roles even when their values match.
The Foundations / Radius story shows the scale, mapping, usage, and previews.

### Card

Card is a non-interactive bordered content surface with prescribed padding,
section spacing, and typography. It adds no role, tab stop, click behavior,
shadow, or automatic heading associations.

```tsx
<Card asChild>
  <section aria-labelledby="workspace-title">
    <CardHeader actions={<Button variant="outline">Edit</Button>}>
      <CardTitle id="workspace-title" level={2}>Workspace</CardTitle>
      <CardDescription>Manage your team's settings.</CardDescription>
    </CardHeader>
    <CardBody>{content}</CardBody>
    <CardFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </CardFooter>
  </section>
</Card>
```

Card renders a div by default; `asChild` merges onto a single non-interactive
article, section, or form. Give landmarks an appropriate accessible name when
needed. CardTitle requires a level from 2 through 6; select by document hierarchy,
not appearance. The corresponding system heading bundle controls its styling.
CardDescription uses the supporting body bundle. CardBody is a Stack with a
prescribed gap; child paragraphs/lists retain their native margins.

CardHeader accepts heading content and optional `actions`. Below sm (768px) of
the Card's content width, header actions stack beneath the heading and fill the
available track. At sm and above they sit beside it. CardFooter uses Inline:
actions stack below sm of the footer's own width and align to the end above it.
Neither arrangement reorders the DOM. Keep header actions short enough to fit
beside content at the wide threshold. Card uses inline-size containment and
should receive its width from a parent layout, not shrink-to-fit content.

Component-owned card tokens map the surface/border to theme roles and geometry
to size/spacer scales. This initial Card has one prescribed treatment, not a
variant API. Use links/buttons inside for actions; do not make a whole Card
interactive while nesting other controls. Loading features own aria-busy and
status announcements; Skeleton remains decorative.

Keep component stories concise: one basic example, a small number of distinct
behavior examples, and a token reference. Avoid separate stories for every
composition or visual permutation; use automated tests for broader coverage.

### Dialog, AlertDialog, and Popover

These overlays use Radix primitives for focus management, keyboard behavior,
dismissal, and positioning. `Dialog` is modal and dismisses on Escape or an
outside interaction; `AlertDialog` is a modal confirmation that requires an
explicit action and does not dismiss from outside clicks; `Popover` is anchored
and non-modal by default. Each content component renders its portal and token-
backed surface. Compose `Title` and `Description` parts so the overlay has a
programmatic accessible name and description. Popover content should also set
`aria-label` or `aria-labelledby`, since Popover has no built-in title part.
Dialog and AlertDialog content show a scrim by default; set `scrim={false}` to
hide it without changing modal focus, scrolling, or dismissal behavior. The
shared `--system-scrim` token controls the backdrop color for dialogs and
other temporary panels; `--component-dialog-overlay` maps to it.
For destructive confirmations, compose the action with `Button color="error"`.

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Edit profile</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Update your public name.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <DialogClose asChild><Button>Save changes</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

<AlertDialog>
  <AlertDialogTrigger asChild><Button>Delete workspace</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel asChild><Button variant="outline">Cancel</Button></AlertDialogCancel>
      <AlertDialogAction asChild><Button color="error">Delete workspace</Button></AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

<Popover>
  <PopoverTrigger asChild><Button variant="outline">Filters</Button></PopoverTrigger>
  <PopoverContent aria-label="Project filters">{/* filter controls */}</PopoverContent>
</Popover>
```

Keep confirmation actions explicit: use AlertDialog for consequential choices,
with a cancel path and a clearly named action. Use Dialog for broader forms or
workflows. Popover content is capped to the available viewport space; set an
appropriate `side`, `align`, or `aria-labelledby` on its content when needed.
Dialog surface and Popover surface/geometry tokens are exposed in their
component token stories.

### Layout foundations

`Stack`, `Inline`, `Grid`, and `Container` arrange content without choosing its
surface, typography, padding inside a Card, or interaction behavior.

```tsx
<Container size="content">
  <Stack gap="xl">
    <Inline justify="end" stackBelow="sm">
      <Button>Cancel</Button>
      <Button>Save changes</Button>
    </Inline>
    <Grid preset="cards">{items}</Grid>
  </Stack>
</Container>
```

- Stack uses a single vertical Grid track and defaults to `gap="lg"`.
- Inline defaults to `gap="sm"`, center alignment, start justification, and
  `stackBelow="sm"`. An outer div establishes an inline-size query container;
  an inner Grid arranges children. Its ref, native attributes, and className
  target the outer wrapper. Below the threshold it stacks and stretches tracks.
  It does not implement variable-width flex wrapping; choose a suitable threshold
  for the content. It needs available width from its parent, not shrink-to-fit
  sizing. Reading and focus order always follow the DOM.
- Grid defaults to adaptive `preset="cards"` with a 17.5rem minimum item width
  and an xl gap. It falls to one track when space is narrower than the minimum.
  `equal-2` and `equal-3` deliberately retain two/three equal tracks at all widths.
  These fixed presets are not responsive card layouts.
- Container defaults to `size="content"` and `gutter="responsive"`. Reading,
  content, and wide outer-width caps are initially 40rem, 70rem, and 90rem,
  including gutters. Responsive gutters change from lg to xl at the sm viewport
  threshold. `gutter="fluid"` uses bounded 3vw spacing (lg to 2xl);
  `gutter="none"` removes the inset. Nested Containers add their own gutters;
  use none when the parent already supplies the intended inset.

Gap choices are `none`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, and `3xl`,
mapped to existing rem spacer semantics. Layout offers no general margin/padding
props. Parent gaps separate siblings; surface components own their internal
insets. Stack, Grid, and Container support `asChild` for a single semantic child
such as main, section, or ul. The child retains its native browser styles:
reset list/heading/paragraph margins where the composition requires it.
Inline intentionally retains its two-div query boundary and has no asChild.

Minimum-width thresholds are xs 480px, sm 768px, md 992px, lg 1280px,
xl 1440px, and 2xl 1920px. Base styles apply below xs. These correspond to
Webflow's familiar boundaries but cascade mobile-first. Compact (base/xs),
regular (sm/md), and wide (lg and above) are descriptive groupings, not automatic
device detection. Gap sizes and breakpoint sizes are separate scales.

The CSS source `--breakpoint-*` primitives are build inputs. Named rules in
`packages/tokens/src/layout-queries.css` compile to actual media/container
conditions in `dist/css/layout-queries.css`, imported by the React stylesheet.
CSS custom properties cannot be substituted directly into query conditions.
Rebuild tokens after changing thresholds. Queries use CSS pixels, while rem
content widths/spacing scale with the root font size.

`--system-layout-size-fill` means 100% of the containing block on the applied
axis, not the viewport or remaining space beside siblings. Percentage block
sizes need a definite parent block size. Use border-box when borders and padding
must fit. `--system-layout-viewport-block-size` supplies 100dvh for full-height
regions; use min-block-size for growing pages and test keyboard/safe-area behavior.
Content-width and gutter roles are shared system semantics; layout-owned
component tokens map those roles to Container and Grid.

Storybook's Foundations / Layout includes gap/width references, breakpoint
definitions, a continuously resizable parent preview, fixed/adaptive grids,
RTL/long-content stress cases, and parent/viewport/remaining-track comparisons.
Dedicated Stack, Inline, Grid, and Container stories expose their own Controls.
Specimens pair minimal code with boundary/spacing diagrams; live readouts report
rendered widths, gaps, gutters, and track counts. The parent playground offers
a number input, range slider, T-shirt presets, and optional layout guides.
Large previews retain their actual CSS-pixel width and scroll within the canvas;
they are never visually scaled to fit. Breakpoint tables show exact ranges.
Parent resizing changes Inline queries and intrinsic Grid columns; changing the
Storybook iframe viewport changes Container media queries, vw, and dvh.

### Checkbox and radio selection

`Checkbox` is a native checkbox, distinct from a Switch's immediate on/off setting.
Use it for independent options, multi-selection, and consent. It supports
`checked`/`defaultChecked`, native `onChange`, optional `onCheckedChange(boolean)`,
sm/md/lg sizes, disabled, required, invalid, names/values, and input refs.

```tsx
<Field required invalid={hasError}>
  <FieldLabel>Accept the terms</FieldLabel>
  <FieldControl><Checkbox name="terms" value="accepted" /></FieldControl>
  <FieldDescription>Read the agreement before continuing.</FieldDescription>
  <FieldError>Accept the terms to continue.</FieldError>
</Field>
```

`indeterminate` is a controlled boolean presentation/accessible mixed state,
independent of `checked`. For select-all, derive it from a partially selected
collection and clear it by updating that collection in `onCheckedChange`.
Native checked state still determines form submission and required validation;
an indeterminate mark alone does not submit a value. Uncontrolled checked state
resets with the form; controlled state remains the parent's responsibility.

`Radio` is a native radio input for mutually exclusive choices. Use
`RadioGroup` to supply a common name, size, state, and native legend:

```tsx
<RadioGroup legend="Billing period" name="billing" defaultValue="monthly">
  <Label><Radio value="monthly" />Monthly</Label>
  <Label><Radio value="annual" />Annual</Label>
</RadioGroup>
```

RadioGroup renders a fieldset with a legend; it is not itself a FieldControl.
Label every option using a wrapping Label or `htmlFor`/`id`. The group generates
an isolated name if omitted; use an explicit name for useful form submission.
Set group `value`/`onValueChange` for controlled selection or `defaultValue` for
native uncontrolled state and reset. Let the group own names and checked state;
do not mix group state with individual `checked`/`defaultChecked` props.
Native keyboard navigation moves among enabled options, selecting with arrow
keys; Space selects the focused option. Required applies to the whole choice set.

Set `aria-describedby` on RadioGroup to associate separately rendered
SupportingText/error messages with the group and its options. `invalid` marks
the fieldset and options without replacing native validation. Disabled groups
disable every option and omit their values from submission. Individual options
can also be disabled. Standalone Radio inputs accept native checked state and
can use Field when a single option needs those associations.

Checkbox/Radio share selection-control component tokens for geometry and theme
roles. They share the focus-ring tokens, preserve semantic invalid/disabled colors,
and provide system-color checked/mixed indicators in forced-colors mode.
Checkbox check/mixed glyphs use Material Symbols; load the icon font as described
above. Wrapping Label compositions align the control and text with a shared gap.
Checkbox, Radio, and Switch reserve at least 24 by 24 CSS pixels for each native
input, while retaining their smaller visual shapes. Allow that layout space and
avoid clipping or covering it; associated labels can provide a larger target.
Native props, `className`, and inline styles apply to the transparent input,
not the decorative visual shape.
Group layout uses spacer semantics; no new app-wide selection colors are added.

### Loading placeholders

`Skeleton` reserves space while content is loading. It supports text (default),
circle, and rectangle variants, with sm/md/lg sizes:

```tsx
<section aria-label="Account details" aria-busy={loading}>
  {loading ? <Skeleton lines={3} /> : <AccountDetails />}
</section>
```

Text sizes reserve 16/20/24px-equivalent line boxes; multiple lines have a
deterministic 80% final line. Circle sizes are 24/32/40px equivalents. Rectangles
fill the available width with the same default heights; a parent-specific
`style` or class may reserve the final image/card dimensions. Match the eventual
content layout to avoid layout shifts. `lines` must be a positive integer and
is supported only for text. Placeholders accept no content, are aria-hidden and
inert, and never announce their own status. The containing feature owns
`aria-busy`, an optional single loading announcement, errors, and replacement
with real content. Do not cover still-focusable controls with a placeholder.

The generic system roles are:

- `--system-loading-surface`: resting placeholder fill.
- `--system-loading-shimmer`: translucent highlight over that fill.
- `--system-animation-loading-shimmer`: shared animation shorthand and keyframes,
  built from duration/easing primitives.

Skeleton consumes these through its component-owned tokens. Other decorative
placeholders can reuse the `.svx-loading-shimmer` class, or use the semantic
animation on a full-width, absolutely positioned overlay clipped by its parent:

```css
.custom-placeholder {
  position: relative;
  overflow: hidden;
  background: var(--system-loading-surface);
}
.custom-placeholder::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    90deg, transparent, var(--system-loading-shimmer), transparent
  );
  transform: translateX(-100%);
  animation: var(--system-animation-loading-shimmer);
}
```

The animation translates the decorative layer, not layout or actual content.
Reduced-motion preferences set the system animation to `none`; the shared class
also removes its overlay. Forced-colors mode renders static outlined shapes.
Dark/high-contrast themes adjust loading fills without changing geometry.
Color Semantics includes loading colors, Motion Semantics documents the reusable
animation, and Skeleton stories show shapes, themes, and a loading-to-content
card. JSON/native exports describe base theme values, not runtime media-query
preferences. Existing Button spinners and progress patterns are unchanged.

### Form text foundations

`Label` renders a native label and `SupportingText` renders a paragraph. Both
support `size="sm" | "md" | "lg"` (default `md`), `invalid`, and `disabled`
styling, using semantic typography and color tokens. Disabled styling takes
precedence over invalid styling. Labels use secondary text color and medium
weight; supporting text uses regular weight with a smaller scale:

| Size | Label | Uppercase label | Supporting text / icon |
| --- | --- | --- | --- |
| `sm` | 12px / 16px | 12px / 16px | 12px / 16px / 12px |
| `md` | 14px / 20px | 12px / 16px | 12px / 16px / 12px |
| `lg` | 16px / 24px | 14px / 20px | 14px / 20px / 14px |

These are baseline dimensions at a 16px root; typography scales in rem.
Use `textCase="uppercase"` on Label for uppercase text and `optional` for a
smaller, regular-weight `(optional)` hint. Required takes precedence over
optional. Invalid labels retain their normal color; validation is communicated
by the control and error message.

```tsx
<Label htmlFor="email" required>Email</Label>
<input id="email" type="email" required aria-describedby="email-hint" />
<SupportingText id="email-hint">Use your work email.</SupportingText>
```

`Label`'s `required` prop adds a red asterisk, hidden from
assistive technology to avoid duplicating the control's native required state.
Set `required` on the control as well. Likewise, set `disabled` and
`aria-invalid` on the control itself; text-component state props only affect
appearance. Connect supporting text using `aria-describedby`. Error messages
should explain the problem in words, not just change color.

SupportingText supports `variant="default" | "error" | "success" | "disabled"`
and optional `startIcon` / `endIcon` flags. These render decorative Material
Symbols appropriate to the variant, aligned to the first line when text wraps.
Load the Material Symbols stylesheet (or supply the font locally) when using
icons. `invalid` selects the error variant; `disabled` overrides all variants.

`SupportingText` does not automatically announce content as a live region.
For validation updates that need announcements, explicitly pass `role="alert"`
or an appropriate `aria-live` value. Avoid duplicate announcements when a
form-level error summary already provides feedback.

### Field composition

`Field` connects one control to its label, descriptions, and error messages.
It owns `size`, `required`, `disabled`, and `invalid` for its parts:

```tsx
<Field required invalid={hasError}>
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" />
  </FieldControl>
  <FieldDescription>Use your work email.</FieldDescription>
  <FieldError>Enter a valid email address.</FieldError>
</Field>
```

`FieldControl` renders no extra wrapper. Pass exactly one native input,
textarea, or select, or a component that forwards native control props and
its ref. The field supplies the control ID and required/disabled/invalid
state; configure these on `Field`, not the child. Use `controlId` on Field
for an explicit control ID; `id` on Field identifies the wrapper.
Field also supplies `data-size` to the control, overriding Input/Textarea's
standalone visual size. A valid Field sets `aria-invalid="false"` explicitly
so it also overrides a child's standalone `invalid` prop.

Descriptions register after mounting and are removed from `aria-describedby`
when unmounted. Existing external description IDs on the child are preserved.
Generated IDs are stable across server rendering and hydration, but automatic
description associations become available after hydration. `FieldError`
renders only when `invalid` is true. Validation is owned by the application.
Field uses a 6px vertical gap. FieldError includes a decorative status icon
by default; pass `startIcon={false}` to omit it.
Field does not validate values or create announcements automatically. Use
`role="alert"` on FieldError when appropriate. Keep descriptions/errors
inside their Field and use unique IDs if supplying them explicitly.

### Input and Textarea

`Input` and `Textarea` render native elements with forwarded refs, native
controlled/uncontrolled values and events, semantic theme colors, and the same
`svx-focus-ring` utility as Button. They do not generate labels or validation
messages: use Field as above, or supply an accessible name and descriptions
yourself.

Both support `size="sm" | "md" | "lg"` (default `md`), `disabled`, `readOnly`,
and `invalid`. Explicit `aria-invalid` takes precedence over `invalid`.
Disabled styling takes precedence over error styling; read-only text remains
selectable and focusable. The focus ring remains the shared focus color when
invalid, with an error-colored border.

| Size | Input minimum height | Text typography |
| --- | --- | --- |
| `sm` | 24px | 12px / 16px |
| `md` | 32px | 14px / 20px |
| `lg` | 40px | 16px / 24px |

These controls fill their container. Input's visual `size` replaces the native
numeric attribute; use `htmlSize` for that attribute instead. Textarea defaults
to `rows={3}`, supports native `rows`/`cols`/`maxLength`, and can be resized
vertically. Override `style.resize` if needed. No auto-grow or custom scrollbar
behavior is added. Native input types are forwarded without custom pickers or
file-upload UI; the visual sizing is intended primarily for text-like inputs.
System input height, padding, typography, and radius tokens define the shared
size scale, while existing surface, text, border, and status roles supply colors.

```tsx
<Input aria-label="Search" type="search" placeholder="Search..." />
<Textarea aria-label="Notes" rows={5} maxLength={500} />
```

### Toggle and Switch

These are different interaction contracts, not interchangeable appearances:

- `Toggle` is a native button with `aria-pressed` for modes/actions such as bold.
  Its accessible name should stay the same when pressed. It defaults to
  `type="button"`, supports Enter and Space, and does not submit a checked form
  value. Use `pressed` / `onPressedChange` for controlled state or `defaultPressed`
  for uncontrolled state. It reuses Button's sizes, shared focus ring, and
  Material Symbols `iconStartIcon` / `iconEndIcon` props. Icon-only toggles need
  an accessible name such as `aria-label`. Preventing the native `onClick`
  default cancels the state change.
- `Switch` is a native checkbox with `role="switch"` for on/off settings.
  Use `checked` / `onCheckedChange` (or native `onChange`) for controlled state,
  or `defaultChecked` for uncontrolled state. Native label activation, Space,
  `name`/`value` form submission, `required`, and uncontrolled form reset work
  without a hidden form proxy. Only checked, enabled switches submit a value
  (`"on"` unless `value` is provided). It has no indeterminate or read-only mode.
  Reset controlled state in your own form `onReset` handler when needed.

Both support `disabled`, `size="sm" | "md" | "lg"` (default `md`), and forwarded
refs. Toggle's sizes match Button's 24/32/40px heights. Switch tracks are
28x16 / 32x20 / 40x24px with 12/16/20px thumbs. Switch uses logical positioning
for RTL layouts, respects reduced motion, and supports system forced colors.
Its compact track sits within the minimum 24px-high interactive area; use a
clickable label row when a larger target is needed.

Toggle's persistent pressed appearance uses the selected interactive surface and
its surface foreground, independently of hover and pointer-down overlays.
Switch uses neutral interaction overlays on its off track and solid interactive
colors on its on track. The bordered thumb stays light in either state, using
shared `--component-switch-thumb-surface` / `--component-switch-thumb-border` roles
and their `-disabled` counterparts. These roles are defined per theme rather
than borrowing text colors or choosing palette stops in component styles.

Switch accepts `invalid`, with explicit `aria-invalid` taking precedence.
Compose it with Field for automatic labels, descriptions, size, and
required/disabled/invalid state. FieldControl and the forwarded ref target the
native input; Switch adds a small presentation wrapper for its decorative thumb.
`className` and native props/style apply to the input. Toggle is an action button,
not a Field control. The input is transparent; the visible track and thumb are
decorative elements styled through the component's CSS and tokens. Neither
component performs application validation or saves a setting for you.

```tsx
<Toggle defaultPressed iconStartIcon="format_bold">Bold</Toggle>

<Field>
  <FieldLabel>Notifications</FieldLabel>
  <FieldControl>
    <Switch name="notifications" checked={notifications} onCheckedChange={setNotifications} />
  </FieldControl>
  <FieldDescription>Receive email notifications.</FieldDescription>
</Field>
```

### Development

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
