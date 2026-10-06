# Pattern: Data grid wrapper

- **id**: data-grid
- **status**: stable
- **use when**: Large, sortable, filterable or column-managed datasets — the
  results grid in a list page, an analytics table, anything beyond a simple
  mat-table.
- **avoid when**: A short, read-mostly list — use mat-table (see the List with
  filters pattern).
- **components**: AgGridAngular, matButton
- **tokens**: surface-primary, surface-minimal, text-primary, text-secondary,
  border-secondary, icon-accent, border-radius-default

## Rules

- Register AG Grid modules (and set the licence) once at bootstrap through a
  single provider — provideHelixAgGrid() — never ModuleRegistry.registerModules
  scattered across features.
- Use the AG Grid v36 Theming API theme (helixGridTheme) bound with [theme],
  built from the --hlx-* custom properties so the grid follows the app theme. Do
  not ship the legacy CSS theme for new grids.
- Use the shared HELIX_DEFAULT_COL_DEF for sort/resize/filter/flex defaults; set
  per-column overrides on the column, not by re-declaring the defaults.
- Persist column state (order, width, sort) per grid to localStorage — save on
  stateUpdated, restore on gridReady — with a Reset columns action.
- The toolbar, applied-filter chips and loading/empty/error states around the
  grid come from the List with filters and Page states patterns; the grid is
  just the results surface.

## Anti-patterns (do not do)

- Repeating ModuleRegistry.registerModules / the licence key in several files.
- Using the legacy ag-theme CSS override for a new grid instead of the Theming
  API.
- Styling the grid with bespoke .ag-* CSS overrides instead of theme params.
- A column-managed grid that forgets the user's layout on reload.

## Guidance

## Overview

AG Grid is the right tool for large, sortable, filterable, column-managed data.
The apps we audited each wired it up differently — an app grew an 846-line
grid directive with a dozen feature flags, both repeated module and licence
registration, and the theme is a legacy CSS override from the AG Grid 32 builder
while the repo is on v36. This pattern is the one Helix setup.

For a short, read-mostly list use a `mat-table` instead (see
[List with filters](/patterns/list-with-filters)); the toolbar, chips and
[Page states](/patterns/page-states) around the grid are the same either way.

## One setup, shared

```ts
// provideHelixAgGrid() — registered once in app.config.ts
import { provideHelixAgGrid } from '@cdx/theme-ag-grid';

export const appConfig: ApplicationConfig = {
  providers: [provideHelixAgGrid()],
};
```

```ts
// helixGridTheme is an AG Grid v36 Theming-API theme built from --hlx-* tokens
import { HELIX_DEFAULT_COL_DEF, helixGridTheme } from '@cdx/theme-ag-grid';

@Component({
  template: ` <ag-grid-angular
    [theme]="theme"
    [rowData]="rows"
    [columnDefs]="columns"
    [defaultColDef]="defaultColDef"
    (gridReady)="onGridReady($event)"
    (stateUpdated)="saveColumns()"
  />`,
})
export class TrialsGrid {
  readonly theme = helixGridTheme;
  readonly defaultColDef = HELIX_DEFAULT_COL_DEF;
}
```

`provideHelixAgGrid`, `helixGridTheme` and `HELIX_DEFAULT_COL_DEF` ship from
`@cdx/theme-ag-grid` (the Theming-API theme supersedes the package's legacy CSS
theme for new grids).

## Cell renderers

Use the shared renderers from `@cdx/theme-ag-grid` rather than re-writing them
per grid. `helixChipCellRenderer` renders a short categorical value (status,
phase, type) as a Helix chip, styled with `--hlx-*` tokens and built with
`textContent` (no HTML injection). `helixDateCellRenderer` formats a date value
consistently (e.g. "2 Oct 2026") from a `Date`, ISO string or epoch number.

```ts
{ field: 'phase', cellRenderer: helixChipCellRenderer }
{ field: 'updated', cellRenderer: helixDateCellRenderer }
```

## Persist the user's layout

Save the column state on `stateUpdated` and restore it on `gridReady`, keyed per
grid, wrapped in try/catch (storage can be unavailable). Offer a **Reset
columns** action. The example does this in full.

## Do

- Register modules and the licence once, via `provideHelixAgGrid()`.
- Use the Theming-API `helixGridTheme` and `HELIX_DEFAULT_COL_DEF`.
- Persist and reset column state per grid.
- Build the toolbar, chips and states from the composing patterns.

## Don't

- Scatter `ModuleRegistry.registerModules` or the licence key.
- Use the legacy CSS theme, or bespoke `.ag-*` overrides, for a new grid.
- Grow one grid component with feature-flag booleans — use config or variants.
- Let a column-managed grid forget the user's layout.
