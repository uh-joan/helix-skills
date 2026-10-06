# Pattern: Charts

- **id**: charts
- **status**: beta
- **use when**: Visualising quantitative data — trends, comparisons,
  distributions — in a product screen or dashboard.
- **avoid when**: A single number or a short comparison that a stat tile, a
  table or inline text conveys better than a chart.
- **components**: HighchartsChartComponent
- **tokens**: surface-primary, text-secondary, border-secondary

## Rules

- Render Highcharts in styledMode and apply the Helix theme
  (hlx-highcharts-styled-mode-theme from @cdx/theme-highcharts) — colour, font
  and axis styling then come from the design system, not from per-chart options.
- The categorical series palette comes from the theme
  (HLX_HIGHCHARTS_THEME_COLORS). Never hardcode a colour array in the chart
  options or in TypeScript; for D3 / custom SVG, import that same array.
- Keep semantic colour (good / warning / critical) separate from the categorical
  series palette, and never encode meaning in hue alone — pair it with a label,
  pattern or shape so it survives colour-blindness and print.
- Give every chart a title and axis titles, enable Highcharts accessibility
  (accessibility.enabled, descriptions), and provide the data as a table or
  aria-label for non-visual users.
- Put the chart in a responsive container (width 100%, a set height or
  aspect-ratio) and let Highcharts reflow; do not pin a pixel width.
- One question per chart, and the right type for it — trend over time (line),
  comparison (column/bar), composition (stacked, sparingly). Not a pie for more
  than a few slices.

## Anti-patterns (do not do)

- A colour array hardcoded in the chart options or a constants file.
- Encoding good/bad or categories in colour alone, with no label or pattern.
- A chart with per-option colours and fonts instead of the styled-mode theme.
- A pixel-pinned chart that overflows or clips on small screens.

## Guidance

## Overview

Charts should look like the rest of the product: the same palette, the same
type, the same muted axes. Helix ships that as the **Highcharts styled-mode
theme** in `@cdx/theme-highcharts`, so you render in `styledMode` and let the
theme supply colour, font and axis styling — instead of setting them per chart
(which is how every audited app ended up with a different hardcoded palette).

See the [Highcharts](/components/highcharts) component for the base wiring.

## Theme the chart, don't colour it

```scss
@import 'highcharts/css/highcharts.css';
@use '@cdx/theme-highcharts' as highcharts;

.my-chart {
  @include highcharts.hlx-highcharts-styled-mode-theme;
}
```

```ts
chartOptions: Highcharts.Options = {
  chart: { type: 'column', styledMode: true },
  // no `colors:` here — the series palette comes from the theme
  title: { text: 'Regulatory activity by quarter' },
  xAxis: { title: { text: 'Quarter' }, categories: [...] },
  yAxis: { title: { text: 'Submissions' } },
  accessibility: { enabled: true },
};
```

For D3 or custom SVG, import the same palette so every chart in the app agrees:

```ts
import { HLX_HIGHCHARTS_THEME_COLORS } from '@cdx/theme-highcharts';
```

## Colour carries no meaning on its own

The categorical palette distinguishes series; it does not mean anything. Keep
**semantic** colour (good / warning / critical) separate, and always pair it
with a label, pattern or shape — never hue alone — so the chart survives
colour-blindness, greyscale and print.

## Do

- Render in `styledMode` with the Helix Highcharts theme.
- Take the series palette from the theme; never hardcode colours.
- Title the chart and both axes; enable accessibility; offer the data as a
  table.
- Use a responsive container and let the chart reflow.

## Don't

- Hardcode a colour array in options or a constants file.
- Encode meaning in colour alone.
- Pin a pixel width.
- Reach for a pie chart with many slices.
