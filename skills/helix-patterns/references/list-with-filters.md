# Pattern: List with filters

- **id**: list-with-filters
- **status**: beta
- **use when**: Browsing or searching a collection — alerts, documents, drugs,
  trials — that the user narrows with filters.
- **avoid when**: A short, fixed list that never needs filtering, or a single
  record (use a detail page).
- **components**: MatFormFieldModule, MatInput, MatButton, MatMenuModule,
  MatChipsModule, MatTableModule, HelixEmptyStateComponent
- **tokens**: spacing-2, spacing-3

## Rules

- The results region is a Page states region — give it loading (skeleton),
  empty, error (retry) and loaded. Over-filtering to zero rows is the empty
  state, with a Clear filters action.
- Show every applied filter as a removable chip (mat-chip-row with
  matChipRemove) in one row, with a Clear all. The chips are the source of truth
  for what is filtered; the results derive from them.
- Few filters inline in the toolbar; many or hierarchical filters behind a
  Filter button that opens a dialog (see the Dialogs pattern) or a panel (see
  the Filters pattern). Do not scatter filter controls across the page.
- A free-text search is a signal updated on input; derive the filtered rows with
  computed(). Debounce the network call, not the local filter.
- Keep the filter state (search term, selected facets) as signals and derive the
  visible rows with computed(); do not keep a second copy of the filtered list
  in sync by hand.

## Anti-patterns (do not do)

- Showing an empty table (or nothing) when filters match no rows.
- Filter controls scattered across the toolbar, the side, and inline, with no
  single applied-state.
- Filters applied but not shown, so the user can't tell why the list is short or
  how to clear them.
- Maintaining a separate filteredRows array updated by hand instead of a
  computed().

## Guidance

## Overview

A results page lets the user browse a collection and narrow it with filters. It
composes three things you already have: a **toolbar** (search + a filter
surface), the **applied filters as removable chips**, and a **results region**
that is a [Page states](/patterns/page-states) region (loading / empty / error /
loaded). For the filter surface itself, see the [Filters](/patterns/filters)
pattern (inline, modal or panel) and open any modal through the
[Dialogs](/patterns/dialogs) size presets.

an app and an app both built this, each slightly differently; this is
the shared shape.

## State is derived, not stored

Keep the filter inputs as signals and derive the visible rows with `computed()`.
The chips, the result count and the table all read from the same derived value,
so they can never disagree.

```ts
readonly search = signal('');
readonly phases = signal<Set<string>>(new Set());

readonly rows = computed(() => {
  const q = this.search().toLowerCase();
  const phases = this.phases();
  return this.allRows().filter(
    (r) =>
      (!q || r.drug.toLowerCase().includes(q)) &&
      (phases.size === 0 || phases.has(r.phase)),
  );
});
```

## Empty is a first-class state

When filters match nothing, show an empty state with a way out — not a blank
table:

```html
@if (rows().length) {
<table mat-table [dataSource]="rows()">
  …
</table>
} @else {
<hlx-empty-state
  heading="No results match your filters"
  message="Try removing a filter or broadening your search."
>
  <button
    hlx-empty-state-actions
    matButton="filled"
    class="hlx-btn-accent"
    (click)="clearAll()"
  >
    Clear filters
  </button>
</hlx-empty-state>
}
```

## Choosing the grid

Use a Material `mat-table` for modest, read-mostly lists. For large datasets,
virtualisation, column management, grouping or server-side rows, use the
[Data grid](/components/data-grid) (AG Grid) component instead — the toolbar,
chips and states around it stay the same.

## Do

- Derive rows with `computed()` from filter signals.
- Show every applied filter as a removable chip with a Clear all.
- Give the results region all four Page states.
- Put many/hierarchical filters behind a Filter button (dialog or panel).

## Don't

- Render an empty table on no matches.
- Scatter filter controls with no single applied-state.
- Hide which filters are active.
- Keep a hand-synced copy of the filtered list.
