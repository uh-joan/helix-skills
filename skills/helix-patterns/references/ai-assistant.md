# Pattern: AI assistant

- **id**: ai-assistant
- **status**: beta
- **use when**: A product's AI chat or assistant surface, full-page or in a side
  panel.
- **avoid when**: A one-shot generate action (a button that fills a field) —
  that is a button with a loading state, not a conversation.
- **components**: HelixAiAvatarComponent, matButton, matIconButton,
  MatFormFieldModule, HelixEmptyStateComponent
- **hlx classes**: hlx-btn-ai, hlx-gradient-ai, hlx-prose
- **tokens**: surface-minimal, text-secondary, spacing-2, spacing-3

## Rules

- The streamed answer lives in an aria-live="polite" region so screen readers
  hear it as it arrives. The thinking/searching status is real text in that
  region, never CSS `content:`.
- Mark assistant turns with hlx-ai-avatar; set `animated` only while a response
  is generating. The avatar already respects prefers-reduced-motion.
- Feedback (thumbs up/down, copy) and citations are real <button>s with
  aria-label and aria-pressed, never clickable <div>s.
- User and assistant turns are visually distinct — a right-aligned user bubble
  on surface-minimal, an assistant turn led by the avatar — and each turn is a
  list item in a labelled log (role="log").
- One composer component: an autosizing textarea that submits on Enter (newline
  on Shift+Enter), disabled while generating, with a labelled send button.
- While a response streams, offer a Stop generating control (the send button
  becomes a stop button) so the user can cut a long or wrong answer short.
- Inline citations open an accessible popover (the rich tooltip), reachable by
  keyboard and focus, not a hover-only home-made div.
- The history sidebar reuses the app-shell drawer and Page states (loading
  skeleton, empty, error); rename/delete go through the Dialogs size presets.
- Show a short AI-generated disclosure near the thread; keep answer copy in
  sentence case and address the user as "you".

## Anti-patterns (do not do)

- Streaming tokens into the DOM with no aria-live, so screen readers miss the
  answer.
- Putting the "Thinking…" status in CSS `content:` where assistive tech can't
  read it.
- Feedback or citations as <div (click)> instead of real buttons.
- Loading a charting or markdown library from a CDN at runtime inside the chat.
- Copying the whole chat UI per surface (an app has it three times) instead of
  shared parts.

## Guidance

## Overview

An assistant surface is a thread of turns the user and the model take, with a
composer docked at the bottom. Helix ships the pieces that make it feel like
Clarivate AI — the [AI avatar](/components/ai-avatar), the `hlx-btn-ai` gradient
button and the `hlx-gradient-ai` surface — and the
[AI foundation](/foundations/ai) covers the voice. All three audited apps built
a capable chat UI; none made the streamed answer accessible. This pattern keeps
their structure and fixes that.

## Anatomy

- **Thread** — a `role="log"` list, centred (~760px), each turn a list item.
- **User turn** — a right-aligned bubble on `surface-minimal`.
- **Assistant turn** — led by `hlx-ai-avatar`; the answer renders into an
  `aria-live="polite"` region; below it, the feedback actions.
- **Streaming indicator** — the avatar `animated`, with the status ("Thinking…",
  "Searching…", "Generating answer…") as **text** in the live region.
- **Composer** — an autosizing textarea (Enter submits, Shift+Enter newlines),
  disabled while generating, and a labelled send button (`hlx-btn-ai`).

## Accessibility is the point here

```html
<!-- The whole answer area is one polite live region -->
<div class="assistant-turn" aria-live="polite">
  @if (generating()) {
  <p class="assistant-turn__status">{{ status() }}</p>
  }
  <div class="assistant-turn__answer">{{ answer() }}</div>
</div>
```

Screen readers announce the status and the answer as they change. The status is
real text, not `::before { content }`. Feedback is real buttons with
`aria-pressed`:

```html
<button
  matIconButton
  aria-label="Good answer"
  [attr.aria-pressed]="rating() === 'up'"
  (click)="rate('up')"
>
  <mat-icon>thumb_up</mat-icon>
</button>
```

## Citations, history, feedback detail

- **Citations** — render an inline numbered `<button>` that opens the
  [rich tooltip](/components/tooltips) as a popover (keyboard- and focus-
  reachable), showing the source **excerpt**, a **link** to the source, and —
  for non-English sources — an **AI-translate toggle** (translate / translating
  / see original, RTL-aware). Not a hover-only div. List the ranked sources
  below the answer with a **"Show N more"** toggle once there are more than ~5.
- **History** — a drawer (the [App shell](/patterns/app-shell) drawer) grouped
  by date, with the [Page states](/patterns/page-states) for loading / empty /
  error, and rename / delete through the [Dialogs](/patterns/dialogs) size
  presets.
- **Structured feedback** — thumbs up/down and copy on each answer;
  **thumbs-down opens an inline reason form** (a few reason checkboxes + an
  optional comment), with a short "don't include personal information" note.
  Submit and clear map to POST/DELETE on your feedback API.
- **Disclosure** — show a persistent "AI-generated content: check for accuracy"
  line near the thread (and include it in copied output), per the foundation's
  _Transparent_ principle.

## While generating: stop & status

Give a **Stop generating** control while a response streams (the send button
becomes a stop button), so the user can cut a long or wrong answer short. Show
the streaming **status as real text** in the live region, and — where useful —
an **elapsed timer** ("Thinking 5s" → "Thought for 8s"); the staged labels
(Thinking → Searching → Generating answer) belong here too. See the
[AI generation trace](/patterns/ai-generation-trace) for the expandable step
detail.

## Markdown answers

## Markdown answers

Render sanitised model markdown into an element with the `hlx-prose` class (from
`theme-helix-overrides`), which styles headings, lists, code, tables, links and
quotes with Helix tokens — so you do not reach in with per-app `::ng-deep` on
the `innerHTML`.

## Do

- Put the streamed answer and status in an `aria-live` region.
- Mark assistant turns with `hlx-ai-avatar`; animate only while generating.
- Make feedback and citations real buttons with `aria-pressed` / `aria-label`.
- Share one set of chat parts across surfaces.

## Don't

- Stream tokens with no live region, or put status in CSS `content:`.
- Use clickable `<div>`s for feedback or citations.
- Load a library from a CDN at runtime inside the chat.
- Copy the whole chat UI per surface.
