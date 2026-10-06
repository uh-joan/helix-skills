# Helix Theme Setup Snippets

## Style entry point (`src/styles.scss`)

All `@use` rules must be at the very top of the file, before any other rule.

```scss
@use '@cdx/theme-angular-material' as cdx;
@use '@cdx/ngx-branding/header/theme' as header;
@use '@cdx/ngx-branding/footer/theme' as footer;

@include cdx.default(cdx.$helix-theme, 'helix-theme-material');
@include header.theme(cdx.$helix-theme);
@include footer.theme(cdx.$helix-theme);

.helix-theme-material {
  @include cdx.theme-helix-overrides;
}
```

Notes:

- `cdx.default($theme, $class-name)` wraps `mat.core()`, `mat.core-theme()`,
  `mat.all-component-themes()` and the Helix Material overrides inside
  `.$class-name`, and emits the typography hierarchy under
  `.$class-name.mat-typography`.
- The second argument is the theme class name. It defaults to
  `cdx-theme-material`; Helix apps pass `'helix-theme-material'`. Whatever you
  pass must match the `<body>` class and the overrides block.
- Available themes forwarded by the package: `$helix-theme`,
  `$helix-dark-theme`, `$helix-error-theme`, `$helix-success-theme`,
  `$helix-invert-theme`, plus the legacy `$light-theme` / `$dark-theme`.
- Never call `mat.core()` or `mat.all-component-themes()` yourself —
  `cdx.default` already does, and duplicating them doubles the emitted CSS.
- Component SCSS files that need Helix tokens should
  `@use '@cdx/theme-angular-material' as cdx;` locally. `@use` is scoped
  per-file, so this is required in each file and emits no duplicate CSS for
  token-only usage.

## Body classes (`src/index.html`)

```html
<body class="mat-typography helix-theme-material">
  <!-- BODY CONTENTS -->
</body>
```

Both classes must be on the same element (or `mat-typography` on a descendant of
the theme class) so the Helix overrides win over Material defaults.

## Fonts (`src/index.html` `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="preconnect"
  href="<your brand font CDN>"
  crossorigin
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap"
/>
<link
  rel="stylesheet"
  href="<your brand font CDN>"
/>
```

Trim the Material Icons variants to the ones actually used to reduce payload —
the checker only requires the `family=Material+Icons` request to be present.

## Branding — standalone component

```ts
import {
  HelixHeaderComponent,
  HelixHeaderGlobalComponent,
  HelixHeaderProductNameOrLogoComponent,
  HelixFooterComponent,
  HelixFooterGroupComponent,
  HelixFooterGroupTitleDirective,
  HelixFooterLinkDirective,
} from '@cdx/ngx-branding';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    HelixHeaderComponent,
    HelixHeaderGlobalComponent,
    HelixHeaderProductNameOrLogoComponent,
    HelixFooterComponent,
    HelixFooterGroupComponent,
    HelixFooterGroupTitleDirective,
    HelixFooterLinkDirective,
  ],
})
export class App {}
```

For NgModule apps, put the same components in the module `imports` array (they
are standalone).

## Branding — template and layout

```html
<div class="with-header">
  <header hlx-header></header>
  <router-outlet />
</div>

<footer hlx-footer></footer>
```

```scss
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.with-header {
  flex: 1 0 auto;
}

footer {
  flex-shrink: 0;
}
```
