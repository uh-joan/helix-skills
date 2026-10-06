# Helix Theme Tokens

Source: `packages/theme-angular-material/styles/theme/helix/`

## Theme definitions (`helix.scss`)

Built with Angular Material's `mat.define-theme()`, combining a `theme-type`
(light/dark) with `primary`/`tertiary` (and sometimes `secondary`) palettes:

| SCSS variable          | theme-type | primary palette                                     | use case                                    |
| ---------------------- | ---------- | --------------------------------------------------- | ------------------------------------------- |
| `$helix-theme`         | light      | `paletes.$primary`                                  | default app theme                           |
| `$helix-dark-theme`    | dark       | `paletes.$primary`                                  | dark mode                                   |
| `$helix-error-theme`   | light      | `paletes.$error`                                    | error/negative states                       |
| `$helix-success-theme` | light      | `paletes.$success`                                  | success/positive states                     |
| `$helix-invert-theme`  | light      | `paletes.$secondary` (tertiary: `paletes.$primary`) | inverted surfaces (dark header/footer/tabs) |

Typography uses `use-system-variables: true` with
`system-variables-prefix: sys`, so components should reference `--sys-*` CSS
custom properties for type scale rather than hardcoding font sizes.

## Runtime CSS custom properties (`--hlx-*`)

The semantic tokens are also emitted as `--hlx-*` CSS custom properties by
`theme-helix-overrides`, so any app that applies the Helix theme can consume
them at runtime in plain CSS — no Sass import needed:

```css
.card {
  color: var(--hlx-text-primary);
  background: var(--hlx-surface-minimal);
  border: 1px solid var(--hlx-border-secondary);
  border-radius: var(--hlx-border-radius-default);
  padding: var(--hlx-spacing-2);
}
```

Available: every `--hlx-surface-*`, `--hlx-text-*`, `--hlx-border-*`,
`--hlx-icon-*`, `--hlx-border-radius-default`, `--hlx-spacing-half` through
`--hlx-spacing-13`, `--hlx-breakpoint-sm…xl`, `--hlx-elevation-none/sm/md/lg`
(also the `.hlx-elevation-*` utility classes), and the AI gradient
(`--hlx-gradient-ai`, `--hlx-gradient-ai-start`, `--hlx-gradient-ai-end`). The
names match the Sass tokens below (minus the `$`). Use these from component SCSS
instead of hardcoding hex/px or inventing your own `var(--text-primary)` names.
Component-internal (`$components-*`) and primitive (`ref-*`, `$color-*`) tokens
are **not** exposed — use the semantic ones.

## Prose (rendered markdown / LLM output)

`theme-helix-overrides` also ships a `hlx-prose` class that styles rendered
markdown — headings, lists, code, tables, links, blockquotes — with Helix tokens.
Put it on the element whose `innerHTML` is the generated HTML (e.g. an AI answer),
instead of reaching in with per-component `::ng-deep`:

```html
<div class="hlx-prose" [innerHTML]="sanitizedAnswer()"></div>
```

## Breakpoints (`variables/breakpoints.scss`)

Helix breakpoints align with Angular CDK's `BreakpointObserver` bands, so SCSS
and TypeScript agree: `sm` 600, `md` 960, `lg` 1280, `xl` 1920 (px). Design
mobile-first.

In SCSS, use the media mixins instead of hardcoding widths:

```scss
@use '@cdx/theme-angular-material' as hlx;

.nav {
  display: flex;
  @include hlx.media-down('md') {
    // below 960px
    display: none;
  }
}
```

`media-up($name)` is min-width (that breakpoint and wider), `media-down($name)`
is max-width (below it), `media-between($min, $max)` is a range. The px values
are also exposed as `--hlx-breakpoint-sm … --hlx-breakpoint-xl` custom
properties for JS/`calc()` — but `@media` conditions cannot read custom
properties, so use the mixins (or `BreakpointObserver`) for queries.

In TypeScript, use the exported queries with `BreakpointObserver`:

```ts
import { HELIX_MEDIA } from '@cdx/theme-angular-material';
// this breakpoint and wider: HELIX_MEDIA.gtMd; below it: HELIX_MEDIA.ltMd
const isCompact = toSignal(
  inject(BreakpointObserver)
    .observe(HELIX_MEDIA.ltMd)
    .pipe(map((s) => s.matches)),
  { initialValue: false },
);
```

`HELIX_BREAKPOINTS` gives the raw numbers if you need them. Prefer these over
`innerWidth` checks or app-local breakpoint constants.

## Design tokens (`variables/tokens.scss`, built on `primitives.scss`)

Group tokens by category — always prefer these over raw hex values:

- **Surface**: `$surface-primary`, `$surface-minimal`, `$surface-contrast`,
  `$surface-invert`, `$surface-info`, `$surface-positive`, `$surface-negative`,
  `$surface-warn`
- **Text**: `$text-primary`, `$text-secondary`, `$text-invert`
- **Border**: `$border-primary`, `$border-secondary`, `$border-contrast`,
  `$border-invert`, `$border-radius-default`
- **Icon**: `$icon-primary`, `$icon-secondary`, `$icon-invert`, `$icon-info`,
  `$icon-positive`, `$icon-negative`, `$icon-warn`, `$icon-accent`,
  `$icon-brand`, `$icon-disabled`
- **Component fills/states** (prefix `$components-*`): per-variant
  filled/outline/hover colors for primary, secondary, accent, negative,
  positive, info, warn, invert, and disabled states (e.g.
  `$components-accent-filled`, `$components-accent-filled-hover`,
  `$components-negative-outline`, `$components-disabled`).

## Guidance

- Use `tokens.scss` variables (or the `--mat-sys-*` runtime variables) in new
  SCSS — never hardcode a color that already has a token.
- Density/size is not a separate token set here; it's handled via the wrapper
  classes documented in [variant-classes.md](./variant-classes.md)
  (`hlx-btn-large`, `hlx-btn-small`, `hlx-btn-xsmall`, `hlx-btn-xxsmall`,
  `hlx-chip-small`).
- When a component needs an inverted look (dark background), reach for
  `$helix-invert-theme` / the corresponding `hlx-*-invert` class rather than
  manually setting `$surface-invert`/`$text-invert` colors.
