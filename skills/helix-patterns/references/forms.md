# Pattern: Form layout

- **id**: forms
- **status**: beta
- **use when**: Collecting or editing structured input — a settings page, a
  create/edit form, a filter builder saved as a form.
- **avoid when**: A single search box or one inline control (use the control on
  its own), or a long multi-step flow (use a stepper).
- **components**: MatFormFieldModule, MatInput, MatSelect, MatCheckbox,
  MatButton, ReactiveFormsModule
- **hlx classes**: hlx-field-borderless, hlx-input-small
- **tokens**: spacing-2, spacing-3, spacing-4, text-secondary

## Rules

- One column. A single top-to-bottom column is faster to complete and scan than
  multiple columns; only put two fields on a row when they are a genuine pair
  (e.g. start/end date) and never below the sm breakpoint.
- Use typed reactive forms (FormGroup/FormControl + inject(FormBuilder)) and
  signals for derived view state; do not use ngModel/template-driven forms in
  new code.
- Group related fields under a section heading; separate sections with spacing-4
  (or a divider), fields within a section with spacing-2/3. Full-width fields
  (width:100%) unless the data is intrinsically short (a year, a code).
- Every field has a mat-label. Placeholders are optional hints, never the label;
  hints and errors go in mat-hint / mat-error, not alongside.
- Show validation when a field is touched (on blur) or on submit, not on every
  keystroke; render messages in mat-error tied to the control's errors.
- Pick one convention and state it once: mark required fields (asterisk via the
  required attribute) or mark optional ones — don't mix. Most Cortellis forms
  mark required.
- Actions sit in a bar at the end: the primary submit on the right, Cancel to
  its left; disable submit while the form is invalid or saving and show a busy
  state on save.
- Use the shared field variants instead of overriding MDC: hlx-input-small /
  hlx-input-x-small for density, and hlx-field-borderless for an inline-edit
  title or a toolbar search where a boxed field is too heavy (the outline
  appears on hover and focus). Don't hand-roll field chrome with ::ng-deep.

## Anti-patterns (do not do)

- Multi-column forms that zig-zag the eye, or two-up fields that stack badly on
  mobile.
- Using the placeholder as the label, so it vanishes once the user types.
- Flashing errors on every keystroke before the user has finished the field.
- ngModel / template-driven forms in new code instead of typed reactive forms.

## Guidance

## Overview

Helix documents the form _controls_ (field, input, select, checkbox, radio) but
not how to compose them into a form. This pattern is that composition: a
**single column** of Material fields, grouped into **sections**, with inline
validation and a docked **action bar** — spaced with Helix tokens.

## Shape

- **One column**, fields full-width, grouped under section headings.
- **Section spacing** `spacing-4`; field spacing `spacing-2`/`spacing-3`.
- **Labels** always present (`mat-label`); hints in `mat-hint`, errors in
  `mat-error`.
- **Action bar** at the end: Cancel, then the primary submit on the right.

## Typed reactive forms

```ts
private readonly fb = inject(FormBuilder);

readonly form = this.fb.group({
  name: ['', Validators.required],
  area: ['oncology', Validators.required],
  notifyByEmail: [true],
});

readonly saving = signal(false);

submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.saving.set(true);
  // … persist, then this.saving.set(false)
}
```

## Validate on blur, show errors in `mat-error`

```html
<mat-form-field>
  <mat-label>Alert name</mat-label>
  <input matInput formControlName="name" required />
  @if (form.controls.name.hasError('required')) {
  <mat-error>Enter a name for the alert.</mat-error>
  }
</mat-form-field>
```

Errors render only once the control is touched (Material does this for
`mat-error`), so the user is not scolded mid-typing. Write messages that say how
to fix it, in sentence case.

## Field variants

Reach for the shared variants rather than overriding MDC:

- `hlx-input-small` / `hlx-input-x-small` — denser fields for compact UIs.
- `hlx-field-borderless` — hides the outline at rest and shows it on hover and
  focus, for an **inline-edit title** or a **toolbar search** where a boxed
  field would be too heavy. It's driven by the Material outline-colour custom
  properties, so it composes with density and the usual field states — no
  `::ng-deep`.

```html
<mat-form-field class="hlx-field-borderless" appearance="outline">
  <input
    matInput
    [value]="title()"
    (input)="title.set($any($event.target).value)"
  />
</mat-form-field>
```

## Do

- Keep it one column; pair two fields on a row only when they belong together.
- Use typed reactive forms and signals for derived state.
- Give every field a label; put hints and errors in their slots.
- Dock the actions; disable submit while invalid or saving.

## Don't

- Lay forms out in multiple columns that zig-zag.
- Use the placeholder as the label.
- Flash validation on every keystroke.
- Use `ngModel` / template-driven forms in new code.
