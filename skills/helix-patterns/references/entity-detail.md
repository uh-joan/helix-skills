# Pattern: Entity detail

- **id**: entity-detail
- **status**: beta
- **use when**: The detail view of one record — a drug, a trial, a target —
  reached from a list or search.
- **avoid when**: A collection (use List with filters) or a short record that
  fits in a card with no sections.
- **components**: MatCard, MatExpansionModule, HelixEmptyStateComponent,
  matButton
- **tokens**: spacing-2, spacing-3, text-secondary

## Rules

- Lead with an entity header (name, type, key metadata, actions), then a summary
  card of the handful of facts the user came for, then the detail in an
  accordion of sections.
- Load each section's data when it first opens, not all up front; show the
  section's own loading / empty / error (the Page states pattern) inside the
  panel.
- A section with no data is disabled (or clearly marked empty), not an open
  panel showing nothing — so the user sees at a glance what this record has.
- The summary card answers the common question without any clicks; the accordion
  holds the depth. Do not bury the key facts inside a panel.
- The entity name is the page's single h1; section titles are h2/h3 within their
  panels.

## Anti-patterns (do not do)

- Every section expanded and loaded at once, so the page is long and slow.
- Open panels that show "no data" instead of being disabled or marked empty.
- Jumping straight to accordions with no summary of the key facts.

## Guidance

## Overview

An entity detail page shows one record. an app's **Snapshot** is the source:
an entity header, a **summary card** of the key facts, then an **accordion** of
sections that load lazily and are **disabled when empty** — so the user sees at
a glance what the record has and only pays for the sections they open.

## Shape

1. **Entity header** — name (the page's `h1`), type, key metadata, actions. Use
   the [App shell](/patterns/app-shell) heading area.
2. **Summary card** — the handful of facts the user came for, no clicks needed.
3. **Sections** — a `mat-accordion` of `mat-expansion-panel`s; each loads on
   first open and shows its own [Page states](/patterns/page-states) (loading
   skeleton, content, empty, error). Sections known to be empty are `disabled`.

## Lazy sections

```html
<mat-accordion>
  <mat-expansion-panel [disabled]="!counts().trials" (opened)="load('trials')">
    <mat-expansion-panel-header>
      <mat-panel-title>Clinical trials</mat-panel-title>
      <mat-panel-description>{{ counts().trials }}</mat-panel-description>
    </mat-expansion-panel-header>

    @switch (trials.status()) { @case ('loading') { <app-section-skeleton /> }
    @case ('error') {
    <hlx-empty-state tone="error" heading="Couldn't load trials" … /> } @default
    { <app-trials-table [rows]="trials.value()" /> } }
  </mat-expansion-panel>
</mat-accordion>
```

## Do

- Lead with the header and a summary card; keep the depth in the accordion.
- Load each section on first open; show its four states inside the panel.
- Disable (or mark) sections with no data.
- Keep one `h1` (the entity name).

## Don't

- Expand and load every section up front.
- Leave empty panels openable only to show "no data".
- Skip the summary and start with accordions.
