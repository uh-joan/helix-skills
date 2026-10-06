# Pattern: Inline AI actions

- **id**: ai-inline-actions
- **status**: beta
- **use when**: The user is reading content (a document, a row, a report
  section) and an AI action on that content would help without leaving the page.
- **avoid when**: A general, open-ended question (that's the assistant), or an
  action that would work better as a one-shot field edit.
- **components**: HelixAiAvatarComponent, matButton, matIcon
- **hlx classes**: hlx-btn-ai
- **tokens**: surface-minimal, icon-accent, spacing-2

## Rules

- Each action is scoped to specific content (this document, this selection, this
  section) and says so; the prompt it builds names that scope.
- Either seed the assistant composer with a scoped prompt (user edits, then
  sends) or show the result inline next to the content — don't silently fire a
  hidden request.
- Attach actions where the content is (a per-item action row, or a floating "Ask
  AI" on text selection), marked with the AI treatment, without cluttering every
  element.
- Actions are real buttons with labels/aria, keyboard-reachable; a
  selection-triggered button is also dismissible and focus-manageable.
- An inline result is clearly AI (avatar/gradient) and carries the same
  disclosure and feedback as an assistant answer.

## Anti-patterns (do not do)

- Forcing the user into a separate chat to ask about what's on screen.
- Firing a hidden prompt with no chance to see or edit it.
- An AI action on every element, cluttering the page.
- A selection button that only works on hover and can't be reached by keyboard.

## Guidance

## Overview

Sometimes the fastest path is to bring the assistant **to the content** rather
than sending the user to a chat. Attach AI actions — _summarise_, _explain_,
_ask about this_ — to a document, a row, or a text selection, and either seed
the assistant with a scoped prompt or show the result in place. reg-ai does this
with per-document **Summarise / Compare** actions; an app with a floating
**"Ask AI"** on text selection. It builds on the
[AI assistant](/patterns/ai-assistant) and the
[AI foundation](/foundations/ai)'s _Assistive_ principle.

## Two triggers

- **Per-item actions** — an action row on a document/card ("Summarise", "Ask
  about this"). Explicit and discoverable.
- **Selection action** — a floating "Ask AI" button near a text selection, for
  "what does this mean?". Keyboard-reachable and dismissible.

Both build a **scoped prompt** ("Summarise this document: …") and either seed
the composer (user edits, then sends) or render the result inline.

```ts
summarise(doc: Doc): void {
  // Seed the assistant with a scoped, editable prompt — the user stays in control.
  this.assistant.seed(`Summarise this document: ${doc.title}`);
}
```

## Do

- Scope each action to specific content and name that scope.
- Seed the composer or show the result inline; never fire a hidden prompt.
- Attach actions where the content is; mark them with the AI treatment.
- Make them real, keyboard-reachable controls.

## Don't

- Send the user to a separate chat to ask about what's on screen.
- Clutter every element with AI actions.
- Use a hover-only selection button with no keyboard path.
