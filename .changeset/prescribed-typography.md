---
'@svx/tokens': minor
'@svx/react': patch
---

Add typography families, weights, extended rem sizes, unitless line-height
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
