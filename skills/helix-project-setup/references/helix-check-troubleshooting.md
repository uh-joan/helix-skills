# `npx helix-check` — what each check means and how to fix it

`helix-check` ships in `@cdx/ngx-branding` and runs against `process.cwd()`. Run
it from the Angular project root (where `angular.json` and `package.json` live),
after `npm install`.

## Environment

| Output                                           | Cause                                           | Fix                                                                                                      |
| ------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `Node version is <v>` red                        | Below the minimum the script enforces           | Switch Node via nvm/fnm to a supported LTS                                                               |
| `.npmrc file not found`                          | No `.npmrc` at project root                     | Create it                                                                                                |
| `.npmrc file does not contain the right content` | Registry line does not match the expected regex | Use exactly `@cdx:registry = <your-org npm registry>` on its own line |
| `angular.json` / `package.json` not found        | Ran from the wrong directory                    | `cd` into the Angular project root                                                                       |

## Packages

Checks that `@cdx/ngx-branding`, `@cdx/theme-angular-material` and
`@angular/material` are installed in `node_modules` and that their **major**
matches `HELIX_MAJOR_VERSION` in the shipped script.

- Missing → `npm install` the package.
- `⚠️ ... is incorrect. Version required: N` → align the package major with `N`.
  If the project targets a newer Angular than the installed `@cdx/ngx-branding`,
  upgrade `@cdx/ngx-branding` too: the expected major travels with that package,
  so an outdated branding install reports a stale expectation.

## Theme

The script scans every `.scss` under `src/` and looks for three things:

1. `@include <ns>.default(<theme>, "<class-name>")` — captures `<class-name>`.
   Missing → add the `cdx.default(...)` call to the style entry point.
2. A `.<class-name> { ... }` block containing `theme-helix-overrides`. Missing →
   add `.helix-theme-material { @include cdx.theme-helix-overrides; }`.
3. `<body class="... <class-name> ... mat-typography ...">` in some `.html`
   under `src/`. Missing → add both classes to `<body>` in `index.html`.

Gotchas:

- The class name in all three places must be byte-identical.
- The regex only matches double or single quoted string literals — a Sass
  variable as the class name will not be detected.
- Comments are stripped before matching, so a commented-out include does not
  count.

## index.html

Requires all three stylesheet URLs (Material Icons, Source Sans 3, Clarivate
font). It also warns when `Source+Sans+Pro` is present — remove it.

## Branding

- Module check: some `.ts` under `src/` must reference `HelixHeaderComponent`
  (or `HeaderComponent`) **and** `HelixFooterComponent`.
- Element check: some `.html` must contain `<header hlx-header>` (or
  `cdx-header`) **and** `<footer hlx-footer>`. Attribute selectors on other tags
  (e.g. `<div hlx-header>`) are not matched.

## Limitations to keep in mind

- The checker is regex-based and never compiles Sass. Always follow it with
  `npx ng build` — a project can pass every check and still fail to build.
- It only inspects `src/`. Multi-project workspaces (`projects/<app>/src`) need
  the checker run from a root that contains `src/`, or the checks must be
  validated manually.
- It reads installed `node_modules` versions, not `package.json` ranges —
  reinstall after changing versions before re-running.
