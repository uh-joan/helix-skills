---
name: helix-project-setup
description:
  'Set up or fix the Helix + Angular Material design system in any Angular
  project (new or existing). Use for "add Helix to my app", "install
  @cdx/theme-angular-material", "configure styles.scss for Helix", "set up the
  Clarivate header and footer", "mat-typography / helix-theme-material class",
  "Material Icons and Source Sans 3 fonts not loading", ".npmrc @cdx registry",
  "npx helix-check fails", or any Helix/CDX theme, branding, or Sass @use setup
  and verification task.'
argument-hint: 'Optional: path to the Angular project to set up or audit'
---

# Helix Project Setup

Bring an Angular project to a valid Helix state: correct registry, packages,
Sass theme wiring, fonts, and Clarivate header/footer — then verify with
`npx helix-check`.

## When to Use

- Adding Helix to a brand-new Angular app.
- Retrofitting Helix into an existing app that already has Angular Material.
- Auditing / repairing a project where `npx helix-check` reports failures.

## Ground Rules

- **Never invent versions.** Read the target project's `@angular/core` major and
  match `@angular/material` and the `@cdx/*` packages to that same major.
- **Sass: `@use` / `@forward` only.** `@import` is deprecated in Dart Sass and
  must not be added. Every `@use` must appear before any rule in the file.
- **One theme include.** `cdx.default(...)` emits `mat.core()` and all component
  themes; calling it more than once duplicates the entire Material CSS payload.
- **Do not run `ng add @angular/material` with a prebuilt theme.** Choose
  `Custom`, otherwise the generated theme fights the Helix theme.
- **Idempotent edits.** Before adding anything, check whether it already exists;
  fix in place rather than appending duplicates.

## Procedure

### 1. Inspect

Determine, before editing anything:

- Angular major from `package.json`.
- Whether `.npmrc` maps `@cdx` to the Clarivate registry.
- Whether Angular Material is already installed and which theme strategy it
  uses.
- Style entry point from `angular.json` (`build.options.styles`) — usually
  `src/styles.scss`.
- Whether the app is standalone (`app.config.ts`) or NgModule-based
  (`app.module.ts`).

### 2. Registry

Create/patch `.npmrc` at the project root:

```
@cdx:registry = <your-org npm registry>
```

Must be `https`, exact path, no trailing comment on the same line —
`helix-check` matches this line with a regex.

### 3. Packages

```bash
ng add @angular/material@<angular-major>   # theme: Custom, typography: No, animations: Yes
npm install @cdx/theme-angular-material @cdx/ngx-branding
```

Optional packages and their peer dependencies are listed in
[optional-packages.md](./references/optional-packages.md).

### 4. Theme wiring

Apply the Sass entry point and body classes exactly as in
[theme-setup.md](./references/theme-setup.md). Three things must line up or the
theme silently does nothing:

1. `cdx.default($theme, '<class-name>')` declares the theme class.
2. The same `<class-name>` block includes `cdx.theme-helix-overrides`.
3. `<body>` carries both `<class-name>` and `mat-typography`.

### 5. Fonts

Add the Material Icons, Source Sans 3 and Clarivate font links to
`src/index.html` `<head>` (see [theme-setup.md](./references/theme-setup.md)).
Remove any `Source+Sans+Pro` link — it is not a Helix font.

### 6. Branding

Import the header/footer components and place them in the root template with the
"Clarivate sandwich" flex layout from
[theme-setup.md](./references/theme-setup.md). The header element must be
`<header hlx-header>` and the footer `<footer hlx-footer>`.

### 7. Verify

```bash
npx helix-check
```

Then build to catch Sass errors the checker cannot see:

```bash
npx ng build
```

Resolve every reported item using
[helix-check-troubleshooting.md](./references/helix-check-troubleshooting.md).
Do not report success while any check is red.

## Completion Criteria

- [ ] `.npmrc` registry line present and exact.
- [ ] `@angular/material`, `@cdx/theme-angular-material`, `@cdx/ngx-branding`
      installed on a single consistent major.
- [ ] Style entry point uses `@use` only, includes `cdx.default` exactly once,
      plus the header and footer theme mixins.
- [ ] Theme class includes `theme-helix-overrides` and is on `<body>` with
      `mat-typography`.
- [ ] Font links present; `Source+Sans+Pro` absent.
- [ ] Header and footer rendered with the flex sandwich layout.
- [ ] `npx helix-check` all green and `ng build` succeeds.
