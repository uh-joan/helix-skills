# Pattern: AI generate & rewrite

- **id**: ai-generate-field
- **status**: beta
- **use when**: Helping the user write or revise one field or block of text — an
  alert description, a summary, a note — in place.
- **avoid when**: An open-ended question or multi-turn task (that's the AI
  assistant), or content the user hasn't asked AI to touch.
- **components**: matButton, MatMenuModule, matIcon, MatFormFieldModule
- **hlx classes**: hlx-btn-ai
- **tokens**: surface-minimal, icon-accent, spacing-2

## Rules

- AI proposes; the user disposes. Never overwrite the field silently — show the
  generated text as a reviewable proposal with Accept / Discard, and make Accept
  undoable. The user stays in control (the Assistive principle).
- Offer specific actions (Draft, Rewrite, Shorten, Fix grammar), not a vague
  "AI". Each acts on this field's current content (or produces it when empty)
  and says what it will do.
- Show the generating state (disable the trigger, show progress) and handle
  failure with a retry — the one-shot has loading/error states just like any
  async action.
- Let the user Regenerate a proposal they don't like before accepting, and keep
  their original until they accept.
- Mark the control and the proposal with the Helix AI treatment (sparkle /
  hlx-btn-ai) and note the text is AI-generated and should be checked.
- Don't discard what the user already typed without consent; "Rewrite" works on
  their text, and Discard restores it exactly.

## Anti-patterns (do not do)

- Replacing the field's content in place with no review and no undo.
- A single "AI" button with no idea what it will do to the field.
- One take only — no way to try again short of retyping.
- Losing the user's original text when they discard the proposal.

## Guidance

## Overview

Not every AI help is a conversation. Often the user just wants to **draft or
revise one field** — an alert description, a summary, a note. A one-shot action
proposes new text and lets the user **accept, discard or regenerate**, with an
undo. No app in the suite does this yet, so this is net-new Helix guidance,
grounded in the [AI foundation](/foundations/ai)'s _Assistive_ principle: AI
supports the user's writing, it doesn't take it over.

## Propose, don't replace

The flow is always: **act → generating → proposal → accept / discard /
regenerate**. Accept replaces the field (undoable); Discard restores the
original exactly.

```ts
readonly value = signal(initialText);
readonly proposal = signal<string | null>(null);
readonly status = signal<'idle' | 'generating' | 'error'>('idle');

rewrite(kind: 'draft' | 'shorten' | 'fix'): void {
  this.status.set('generating');
  this.ai.rewrite(kind, this.value()).subscribe({
    next: (text) => { this.proposal.set(text); this.status.set('idle'); },
    error: () => this.status.set('error'),
  });
}

accept(): void {
  this.previous.set(this.value());   // for undo
  this.value.set(this.proposal()!);
  this.proposal.set(null);
}

discard(): void { this.proposal.set(null); } // original untouched
```

## Scoped actions, not a vague "AI"

Offer named actions that say what they do — **Draft**, **Rewrite**, **Shorten**,
**Fix grammar** — from one AI menu/button marked with the Helix AI treatment.
Each works on the field's current text (or produces it when empty).

## Do

- Propose the text for review; make Accept undoable and Discard lossless.
- Offer specific, named actions.
- Show generating and error states.
- Mark the control and proposal as AI; note it should be checked.

## Don't

- Overwrite the field silently.
- Ship a vague "AI" button.
- Give one take with no regenerate.
- Lose the user's original on discard.
