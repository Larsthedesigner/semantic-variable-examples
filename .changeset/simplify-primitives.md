---
'@svx/tokens': minor
---

Remove the unused `color-grey-50` through `color-grey-950` and legacy
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
