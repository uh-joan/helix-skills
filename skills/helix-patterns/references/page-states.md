# Pattern: Page states

- **id**: page-states
- **status**: beta
- **use when**: Any view, panel, drawer or card whose content comes from an
  async source (HTTP, a resource, a signal store).
- **avoid when**: Content that is always present and synchronous. A form with no
  remote data does not need these states.
- **components**: HelixEmptyStateComponent, NgxSkeletonLoaderModule, matButton
- **tokens**: text-primary, text-secondary, icon-secondary, icon-negative,
  spacing-2, spacing-6

## Rules

- Give every async region all four states. A spinner alone is not enough: decide
  what empty and error look like before you ship.
- Show loading as a skeleton shaped like the real content, not a centred
  spinner, so the layout does not jump when data arrives.
- Use hlx-empty-state with tone="empty" for a legitimately empty result and
  tone="error" for a failed load. An error state must offer a retry.
- An error state is announced to assistive technology (role="alert"); an empty
  state is a quiet region and is not. Do not add your own aria-live on top.
- Drive the states from one status value with @switch (or @if branches), not
  from several overlapping booleans that can contradict each other.
- Do not overlay a spinner on stale content without marking it busy; prefer a
  skeleton on first load and an inline indicator on refresh.

## Anti-patterns (do not do)

- Rendering nothing (or an empty table) when a query returns no rows.
- Shipping a loading spinner but no empty or error state.
- isLoading / hasError / isEmpty booleans set independently, so the view can be
  "loading and error" at once.
- A bespoke centred div with a hardcoded icon and colour instead of
  hlx-empty-state.

## Guidance

## Overview

Any region that reads data from the network moves through four states, and a
quality screen designs all four up front:

1. **Loading** — a skeleton shaped like the content that is coming.
2. **Loaded** — the real content.
3. **Empty** — the request succeeded but there is nothing to show.
4. **Error** — the request failed, with a way to try again.

Across the Clarivate apps we audited, each team rebuilt these states by hand —
`no-alerts-yet` and `error-page` pages, a duplicated `async-view` wrapper, and
inline states inside a chat history sidebar — with hardcoded icons and colours
and, in most cases, no accessible error announcement. This pattern replaces all
of that with one component and one control-flow shape.

## Anatomy

- **Skeleton** (loading): `ngx-skeleton-loader`, laid out to match the real
  content so the page does not reflow when data arrives. See the
  [Skeleton loader](/components/skeleton-loader) component.
- **Empty and error**: `<hlx-empty-state>` from `@cdx/ngx-branding`. It renders
  a media slot (a pictogram, or a Material Symbol fallback), a heading, a
  message, optional body content, and an actions slot. `tone="error"` switches
  the icon colour and adds `role="alert"`.

## Driving the states

Keep one source of truth for which state is showing. With Angular's `resource()`
its `status` already gives you this; otherwise expose a single status signal
from your store and branch on it with `@switch`:

```html
@switch (alerts.status()) { @case ('loading') {
<app-alerts-skeleton />
} @case ('error') {
<hlx-empty-state
  tone="error"
  heading="Couldn't load alerts"
  message="Something went wrong. Please try again."
>
  <button
    hlx-empty-state-actions
    matButton="outlined"
    (click)="alerts.reload()"
  >
    Retry
  </button>
</hlx-empty-state>
} @default { @if (alerts.value().length) {
<app-alerts-grid [rows]="alerts.value()" />
} @else {
<hlx-empty-state
  heading="No alerts yet"
  message="Alerts you create will appear here."
>
  <button
    hlx-empty-state-actions
    matButton="filled"
    class="hlx-btn-accent"
    (click)="createAlert()"
  >
    Create an alert
  </button>
</hlx-empty-state>
} } }
```

This is deliberately a control-flow shape, not an `*ngIf`-style wrapper
component. Under zoneless change detection the template reads signals directly,
so a wrapper buys nothing and hides the states. One `@switch` on one status
keeps the four states mutually exclusive.

## Do

- Design all four states before building the happy path.
- Match the skeleton to the real layout.
- Give every error a retry.
- Write specific copy: name what is empty or what failed, in the user's words.

## Don't

- Ship a spinner with no empty or error state.
- Render an empty table or a blank panel on no results.
- Track the state with several independent booleans.
- Hand-roll an empty state when `hlx-empty-state` exists.
