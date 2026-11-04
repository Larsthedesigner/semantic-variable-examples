---
'@svx/tokens': minor
'@svx/react': patch
---

Replace unequal color palettes with coordinated 12-stop neutral, Apple-blue,
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
