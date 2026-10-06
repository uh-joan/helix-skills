# Pattern: Export

- **id**: export
- **status**: beta
- **use when**: Letting the user download the current data (a grid, a report) as
  CSV, Excel or PDF, especially when the file is generated server-side and takes
  a moment.
- **avoid when**: An instant client-side download of something already in memory
  — just trigger it; no snackbar choreography needed.
- **components**: MatMenuModule, MatButton, MatSnackBar

## Rules

- Offer formats from one Export menu (CSV, Excel, PDF), not a row of buttons;
  disable it while an export is already running.
- For a server-generated file, open a "Preparing your export…" snackbar on
  start, then a success snackbar when it's ready and an error snackbar (with a
  Retry action) if it fails. Never leave the trigger with no feedback.
- Don't block the whole screen with a spinner overlay for an export — it runs in
  the background; the snackbars carry the state.
- When the file is ready, either start the download immediately or put a
  Download action on the success snackbar — don't make the user hunt for it.
- Say what is being exported (all rows, the current filter, the selection) in
  the menu or a confirm, so there's no surprise about scope.

## Anti-patterns (do not do)

- An export button that does nothing visible while the server works.
- A full-screen blocking spinner for a background export.
- A row of CSV / Excel / PDF buttons instead of one Export menu.
- An export that fails with no error and no way to retry.

## Guidance

## Overview

Exports are usually generated server-side and take a moment, so the user needs
feedback. an app's flow is the model: a **format menu**, then **snackbars**
that carry the state — preparing, ready, or failed with a retry — while the
export runs in the background. Don't block the screen, and don't leave the
button silent.

## The flow

```ts
private readonly snackBar = inject(MatSnackBar);
readonly exporting = signal(false);

export(format: 'csv' | 'xlsx'): void {
  this.exporting.set(true);
  const ref = this.snackBar.open('Preparing your export…');

  this.exports.create(format).subscribe({
    next: (file) => {
      ref.dismiss();
      this.snackBar.open('Export ready', 'Download', { duration: 6000 })
        .onAction().subscribe(() => this.download(file));
      this.exporting.set(false);
    },
    error: () => {
      ref.dismiss();
      this.snackBar.open('Export failed', 'Retry', { duration: 8000 })
        .onAction().subscribe(() => this.export(format));
      this.exporting.set(false);
    },
  });
}
```

## Do

- Put formats in one Export menu; disable it while an export runs.
- Open a preparing snackbar, then a ready / failed (with Retry) snackbar.
- Deliver the file immediately or via a Download action on the snackbar.
- State the scope (all / filtered / selected).

## Don't

- Leave the trigger with no feedback.
- Block the whole screen for a background export.
- Spread CSV / Excel / PDF across separate buttons.
- Fail silently.
