# Design-system contribution guidance

Use this guidance when creating or changing components, stories, and tokens.
The [README](../README.md) describes the current implementation and setup.

## Token decisions

1. Inspect [primitives](../packages/tokens/src/primitives.css),
   [semantic roles](../packages/tokens/src/semantic.css), and existing
   [component tokens](../packages/tokens/src/components) for the same intent.
   The [token catalog](../packages/react/src/tokens/token-catalog.ts) resolves
   registered aliases and primitive references; it is not a complete graph of
   component use or interaction rules.
2. Reuse an existing semantic role when its purpose and state behavior match.
   Introduce a component token when the component needs its own mapping or
   configurable value; map colors to semantic roles where appropriate.
3. Add a semantic role when there is a distinct, reusable intent that existing
   roles cannot express. Add a primitive only when the underlying palette or
   scale lacks the needed value. Avoid adding aliases solely because values
   happen to match or introducing a global role for a one-off detail.
4. Document semantic usage in the source declaration. Consider light, dark,
   and high-contrast modes, interaction states, and contrast with the actual
   paired surfaces and foregrounds. Test new mappings and resolved values.
5. Register new component token files in
   [components.css](../packages/tokens/src/components.css) and the catalog
   when they need Storybook references. Check the token build and downstream
   consumers. CSS expressions such as `color-mix()` remain in CSS and JSON
   but may be skipped from Compose and Swift; report platform limitations.

## Components and accessibility

- Build on existing components and supported primitives rather than duplicating
  behavior. Define semantics, keyboard and focus behavior, labeling,
  controlled and uncontrolled states, and errors as applicable.
- Compose components from existing, smaller SVX components when their semantic
  and interaction contracts fit. Treat specialized compound parts (such as a
  tab trigger) as part of the composed component's API; reuse does not require
  exposing every implementation detail as a standalone public component.
- Reuse controls such as `Button` or `IconButton` only when their semantics and
  interaction behavior match the role they serve. Do not nest interactive
  controls. For example, an accordion trigger is the interactive button; its
  chevron is decorative content, not a second `IconButton`.
- Keep compound APIs cohesive and composable, with explicit parts for the
  structure consumers need to arrange. Avoid splitting simple markup into
  public components without an independent reuse or API benefit.
- Choose an interaction foundation based on the behavior the component needs:
  prefer native HTML controls when they provide the required behavior and
  accessibility; use an existing supported primitive such as Radix for complex
  interactions when it supplies behavior we would otherwise need to recreate,
  especially focus management, keyboard navigation, dismissal, or portal
  handling. Add a new primitive dependency only when existing components,
  supported primitives, and native elements do not meet the requirement.
- Implement custom interaction logic only when native elements and supported
  primitives do not fit the required UX. In that case, own and test its
  semantics, keyboard and focus behavior, and relevant accessibility states.
  Keep implementation dependencies behind the SVX public API rather than
  requiring consumers to use the underlying primitive directly.
- Verify relevant light, dark, high-contrast, forced-colors, and reduced-motion
  behavior. Test contrast and target sizes in context; do not rely on color
  alone to communicate status.
- Storybook's accessibility addon aids inspection, but it does not replace
  keyboard testing, automated tests, or manual accessibility review. See
  [accessibility alignment](wcag3-alignment.md).

## Storybook standard

- Each component story exposes relevant controls that actually affect its
  rendering or behavior. Do not expose controls ignored by a custom render,
  or invent controls that misrepresent the public API.
- Each component's Docs page provides a props table with types, defaults, and
  descriptions for its relevant public API. Explicitly document compound and
  polymorphic APIs when automatic inference is incomplete; distinguish
  story-only arguments from real component props.
- For reference-only stories, expose relevant controls and props of the
  reference itself. If none apply, explain why rather than showing inert
  controls.
- Demonstrate meaningful states and compositions. Add interaction tests for
  applicable behavior, and verify controls, Docs tables, and rendered examples
  in Storybook. Check the token reference when token mappings change.

The shared [Storybook MCP configuration](../.vscode/mcp.json) requires the
local Storybook server; see the README for startup instructions. If it is
unavailable, use the repository and browser tools and report any validation
that could not be completed.
