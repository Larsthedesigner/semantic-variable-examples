# Data-visualization colors

The token package provides library-agnostic chart colors. Use these semantic
roles for data marks and chart scaffolding; do not use status colors to encode
quantitative series or select colors directly from the primitive palette.

## Roles

| Role | Tokens | Use |
| --- | --- | --- |
| Categorical | `--system-data-viz-categorical-1` through `-7` | Up to seven series or categories. Pair each with a visible label and another channel such as marker shape, line style, or pattern. |
| Sequential | `--system-data-viz-sequential-1` through `-6` | Ordered low-to-high values. Use the tokens in numeric order and include a scale label or numeric alternative. |
| Diverging | `--system-data-viz-diverging-negative-3` through `-1`, `--system-data-viz-diverging-neutral`, and `--system-data-viz-diverging-positive-1` through `-3` | Values around an explicit neutral point. The negative side is blue and the positive side amber; label sign and the midpoint. |
| Gridline | `--system-data-viz-gridline` | Supplementary chart structure. Do not rely on gridlines to communicate values. |
| Axis text | `--system-data-viz-axis-text` | Axis labels, ticks, and units. Keep at least 4.5:1 contrast against the chart surface. |
| Reference line | `--system-data-viz-reference-line` | Thresholds, targets, and other emphasized chart references. Label the line's meaning. |

Use the surface and chart roles together. The authored categorical, sequential,
and diverging colors are tested for at least 3:1 contrast against the default
surface in light, dark, and high-contrast modes. That is a chart-mark check,
not permission to use these colors for small text. Axis text uses the regular
secondary-text role; gridlines intentionally remain low emphasis and the
high-contrast mode strengthens them.

## Accessible chart content

Color is never the only way to read a chart:

- Give the chart an accessible name and a concise text summary of its finding.
- Label series, axes, units, and meaningful reference lines in text.
- Distinguish series with additional visual encodings (for example, circles,
  squares, dashed lines, or patterns), especially when categories repeat colors.
- Provide the underlying values in an accessible table or equivalent data
  alternative. Include a caption and proper row and column headers.
- Keep the data and its interpretation available when a chart is printed,
  exported, or rendered without its colors.

The Storybook reference demonstrates categorical, sequential, and diverging
roles in all three modes, plus labelled marks and an expandable data table. It
does not select or require a charting library.

## Color-vision screening and limitations

Categorical pairs were screened with the full-severity protanopia, deuteranopia,
and tritanopia linear-sRGB simulation matrices described by
[Machado, Oliveira, and Fernandes (2009)](https://doi.org/10.1109/TVCG.2009.113).
Simulated RGB values are clipped to the display range, converted to CIELAB
(D65), and compared with CIE76 Euclidean distance. The smallest pairwise
distance is 5.7 for light/high-contrast and 5.8 for dark mode; the test uses
5.5 as an internal screening floor, not as a WCAG requirement or a guarantee of
perceptual separability. The test also checks each categorical mark against its
mode's default surface and checks sequential order and chart text contrast.

Simulation is an approximation: it cannot represent individual variation,
display calibration, transparency, overlapping marks, or the chart's full
context. Seven colors are not enough for every chart. Reuse colors only with
additional encodings and labels, or choose another chart form when the data
cannot remain distinguishable. Sequential stops are ordered samples from the
existing blue primitive ramp, not equal-perceptual steps. Test the rendered
chart with its actual marks, surfaces, and data.

In forced-colors environments, user agent colors may replace authored chart
colors. Preserve labels, shapes, line styles, and a data table; do not assume
the palette remains visible. Review any library-specific canvas or SVG behavior
separately.

## Platform exports

All data-visualization roles resolve to plain hex colors. They are included in
CSS, JSON, Compose, and Swift token outputs for light, dark, and high-contrast
modes. These roles are not among the CSS-only values skipped by native exports.
