# @svx/tokens

## 0.2.0

### Minor Changes

- 4b11b3a: Add accessible Dialog, AlertDialog, and Popover components built on Radix UI
  primitives, with responsive token-backed surfaces, descriptions, actions,
  positioning, and interaction stories.
- 8e6b8c2: Add accessible Tooltip and Separator components with theme-aware component tokens.
- 603b542: Add a non-interactive Card surface with prescribed header, title, description,
  body, and responsive footer composition. Component-owned tokens define the
  bordered surface, radius, padding, and gaps. Heading levels follow system type
  bundles. Include concise default, settings, loading, and token stories.
- 9840985: Add Label and SupportingText with shared typography sizes, theme-aware semantic
  colors, required indicators, invalid and disabled styling, and forwarded refs.
  Native label association and description IDs support accessible form composition.

  Add compound Field, FieldLabel, FieldControl, FieldDescription, and FieldError
  components with generated IDs, shared state, and mounted description/error
  associations. FieldControl composes one native control or a ref-forwarding
  component without adding a DOM wrapper.

  Add system label/supporting-text typography, icon sizing, inline spacing, and
  field-gap roles. Use compact secondary labels with optional/required indicators,
  uppercase treatment, and supporting-text status variants with Material Symbols.

  Add native Input and Textarea components with shared focus rings, semantic
  size tokens, disabled/read-only/error states, and Field size/state integration.

- 10552fe: Add Stack, Inline, Grid, and Container layout primitives with rem spacing presets,
  parent-aware Inline stacking, adaptive card grids, and bounded content widths.
  Add shared fill, dynamic viewport, gutter, and content-width semantics and
  Webflow-familiar T-shirt breakpoint primitives. Compile named responsive queries
  from the CSS token source and provide Storybook layout references and playgrounds.
- 2576f55: Add reusable loading surface/shimmer colors and an animation semantic backed by
  shared transform keyframes and motion primitives. Respect reduced motion and
  provide themed component-owned Skeleton mappings.

  Export decorative text, circle, and rectangle Skeleton placeholders with
  deterministic geometry, reduced-motion and forced-colors fallbacks. Add shape,
  theme, loading-card, token, and Motion Semantics stories and usage guidance.

- 0c8fdbb: Add native Checkbox and Radio/RadioGroup foundations with shared component-owned
  selection tokens, three sizes, invalid and disabled states, theme support, and
  forced-colors treatment. Checkbox supports a controlled mixed-state indicator;
  RadioGroup uses fieldset/legend and native radio grouping, keyboard selection,
  validation, submission, and reset. Add Field compositions, stories, and tests.
- 2576f55: Add typography families, weights, extended rem sizes, unitless line-height
  ratios, and tracking primitives. Add 14 prescribed system typography bundles
  with font, tracking, and theme-aware foreground members and inline usage.
  Preserve dimension-based line-height aliases. Map Label sizes to the matching
  system label bundles and SupportingText to caption/body-sm font and tracking
  members, retaining baseline sizes and component-owned state colors.

  Use locally served Inter Variable through Fontsource, retain the SIL Open Font
  License in the build output, and preserve the system-font fallback. Simplify
  body variants and provide label-sm/md/lg bundles. Increase primary/secondary
  text distinction in light and dark modes while preserving high-contrast intent.

  Split Typography and Motion foundation stories. Document complete type bundles
  with specimens, intended markup, mappings, resolved values, and primitive
  dependencies. Keep typography members out of the color semantic reference.

- 603b542: Add T-shirt radius semantics from xs through 2xl with none, full, and pill
  endpoints. Map buttons, inputs, cards, menus, switches, selection controls,
  skeletons, and Storybook surfaces through the shared shape vocabulary.
  Inputs and large button radii now scale with root font size; baseline dimensions
  at a 16px root are preserved. Add a concise Radius foundation reference.
- d1b4fd7: Remove the unused `color-grey-50` through `color-grey-950` and legacy
  `color-blue-50` through `color-blue-950` primitive ramps. Inline the existing
  teal values into the success palette and remove the six `color-teal-*`
  primitives. These are exported primitive removals; consumers using them
  directly must migrate to the active palettes or system semantic roles.

  Rename the active `color-slate-*` primitives to `color-neutral-*`. Standardize
  all color families on 100-point ordinal steps ordered light to dark, absorbing
  fractional and source-specific suffixes into the sequence. Consolidate the
  identical warning stops. Values are preserved; step numbers do not represent
  matching lightness across families.

  Rename size stops to pixel-equivalent suffixes at a 16px root:
  `size-0-5-px` becomes `size-2-px`, `size-2-px` becomes `size-8-px`, and
  `size-3-5-rem` becomes `size-14-rem`. Existing values and px/rem units are
  preserved. Update direct primitive consumers to the new names; semantic
  references are migrated in this package.

  Existing semantic token names and resolved values remain unchanged across
  light, dark, and high-contrast modes.

- 21cafc2: Add distinct Toggle and Switch foundations with shared focus rings, semantic
  styling, sizes, forwarded refs, documentation, tests, and stories. Toggle uses
  pressed-button semantics and Button's sizing and Material Symbols support.
  Switch uses a native checkbox with switch semantics, preserving label activation,
  form values, required validation, and uncontrolled form reset. Add system switch
  dimension roles and support Field size/state/description composition.

  Map Toggle's persistent pressed state to selected surface/foreground roles.
  Add theme-aware shared control-thumb surface/border roles, including disabled
  values, and neutral off-track interaction overlays for Switch.

- 2576f55: Replace unequal color palettes with coordinated 12-stop neutral, Apple-blue,
  red, green, amber, and informational-blue ramps. Preserve #007AFF as blue 800,
  remove magenta, migrate semantic references, and align px/rem size steps.
  Removed color stops are a breaking change for direct primitive consumers.
  Semantic names remain stable, but resolved theme colors intentionally change.

  Add Storybook palette, size, typography/motion, and semantic references with
  usage descriptions, authored mappings, resolved CSS values, and transitive
  primitive dependencies. Add ramp, reference-integrity, and solid-text contrast
  tests.

  Separate non-system component/control aliases into components.css while
  preserving bundle and native exports. Restrict the semantic reference to
  system-prefixed roles.

  Move component-specific system roles into owner-specific component token files,
  renaming them to component-prefixed roles and updating consumers. Keep global
  semantics independent of Switch, form typography/geometry, Tooltip, and workflow
  status patterns. Component token tables accompany their component stories.
  Consumers overriding the previous component-specific system names must migrate.

  Rename size primitives to unit-first names (size-px-2 / size-rem-2), updating
  all authored consumers and native exports. Old unit-suffix names are removed.
  Add matching rem/px system spacer semantics using 2xs through 3xl T-shirt sizes.
  Organize foundation references into Color and Size Primitives/Semantics stories,
  with a separate Typography And Motion reference.

  Route current component padding/gaps and compatibility spacing aliases through
  system spacer roles, preserving rem/px units and baseline layout. Give Menu
  its own padding aliases. Retain documented 6px form-spacing exceptions and
  keep fixed control/focus geometry independent of layout spacing.

### Patch Changes

- f9cf215: Add themed Badge and accessible Avatar components.
- 51c51c4: Add system semantic tokens for light, dark, and high-contrast themes.
