---
name: helix-patterns
description: >-
  GENERATED — do not edit by hand. Use when building a page or composition with
  the Helix design system (Angular 22 / Material 3): page states
  (loading/empty/error), and other documented patterns. Source of truth is each
  pattern's *.guide.md under packages/docs-website; regenerate with
  tools/patterns/generate-pattern-ai.mjs.
---

# Helix Patterns

Compositions of Helix + Angular Material components that solve one UI problem.
Each pattern is authored once as a `*.guide.md` beside its docs page and
generated into this skill. **Do not edit these files by hand** — edit the guide
and run `node tools/patterns/generate-pattern-ai.mjs`.

Prefer a documented pattern over inventing a composition. If a pattern names an
`hlx-*` class, it exists in the theme (CI checks this). Follow your repo's
Angular baseline (`AGENTS.md` / `.github/copilot-instructions.md`): standalone,
signals, `@if`/`@for`/`@switch`, `inject()`, no `*ngIf`, no new NgModule.

## Catalog

| Pattern                | Status | Summary                                                                                                                                                                                                                 | Reference                                                  |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| AI assistant           | beta   | A conversational assistant: a thread of user and assistant message cards, a streaming answer announced to assistive technology, per-answer feedback, and a docked composer — built on the Helix AI avatar and gradient. | [ai-assistant](./references/ai-assistant.md)               |
| AI chat history        | beta   | A panel of past AI conversations, grouped by recency and titled by their first question, that the user can reopen, rename and delete — with real loading, empty and error states, not just the happy path.              | [ai-chat-history](./references/ai-chat-history.md)         |
| AI entry points        | beta   | Where and how the user reaches AI — a header/rail trigger, a floating action button, and a one-time promo banner — all wearing the same Helix AI treatment so AI is recognisable and leads to one assistant surface.    | [ai-entry-points](./references/ai-entry-points.md)         |
| AI generate & rewrite  | beta   | A one-shot AI action on a single field — draft, rewrite, shorten, fix — that proposes new text the user reviews and accepts, discards or regenerates, with an undo. Not a conversation.                                 | [ai-generate-field](./references/ai-generate-field.md)     |
| AI generation trace    | beta   | A collapsed "How was this generated?" disclosure under an AI answer, showing the steps the assistant took and the inputs it used — so users can understand and trust the result.                                        | [ai-generation-trace](./references/ai-generation-trace.md) |
| Inline AI actions      | beta   | Bring the assistant to the content: AI actions (summarise, explain, ask about this) attached to a document or a selection, with the result shown in place or sent to the assistant — not a detour to a separate chat.   | [ai-inline-actions](./references/ai-inline-actions.md)     |
| AI prompt starters     | beta   | The pre-conversation landing for an assistant: a short greeting, a few suggested-prompt cards that seed the composer, and the composer itself — so the user isn't facing a blank box.                                   | [ai-prompt-starters](./references/ai-prompt-starters.md)   |
| AI sources & citations | beta   | Make an AI answer traceable — number claims with inline citations that reveal the cited passage and link to the source, and list the ranked source documents behind the answer, collapsed past a handful.               | [ai-sources](./references/ai-sources.md)                   |
| AI usage & limits      | beta   | Tell the user where they stand against AI limits — responses left, a context that's too long, a rate limit — before and when they hit them, with a clear way forward, using hlx-notification.                           | [ai-usage-limits](./references/ai-usage-limits.md)         |
| App shell              | beta   | The standard page chrome — Helix header with product name, primary navigation and global actions, a routed content area, and the footer — assembled once and driven by typed route data.                                | [app-shell](./references/app-shell.md)                     |
| Charts                 | beta   | Build charts with the Helix Highcharts styled-mode theme so colour, type and axes come from the design system — never a hardcoded palette — and keep them accessible and readable.                                      | [charts](./references/charts.md)                           |
| Data grid wrapper      | stable | One place to set up AG Grid the Helix way — modules and licence registered once, a Theming-API theme built from Helix tokens, shared column defaults, and column-state persistence.                                     | [data-grid](./references/data-grid.md)                     |
| Dialogs                | stable | A modal for one decision or one short task. Open it through a named size preset, structure the body with the Material dialog slots, and put the primary action on the right.                                            | [dialogs](./references/dialogs.md)                         |
| Entity detail          | beta   | A record page: an entity header, a summary card of the key facts, then an accordion of sections that load lazily and are disabled when they have nothing to show.                                                       | [entity-detail](./references/entity-detail.md)             |
| Error pages            | beta   | Full-page states for 404, 403 and 500 — a centred hlx-empty-state with a pictogram, a plain explanation and one clear way forward, served by the router.                                                                | [error-pages](./references/error-pages.md)                 |
| Export                 | beta   | An export action: pick a format, then give asynchronous feedback through snackbars — preparing, then ready (or failed with retry) — so the user isn't left staring at a frozen button.                                  | [export](./references/export.md)                           |
| Form layout            | beta   | A single-column form of Material fields grouped into sections, with inline validation on blur, a required/optional convention, and a docked action bar — laid out with Helix spacing tokens.                            | [forms](./references/forms.md)                             |
| List with filters      | beta   | A results page: a toolbar with search and filters, the applied filters shown as removable chips, and a results table that handles its own loading, empty and error states.                                              | [list-with-filters](./references/list-with-filters.md)     |
| Page states            | beta   | Every region that loads data has four states — loading, loaded, empty and error. Design all four from the start so a screen never shows a blank box or a frozen spinner.                                                | [page-states](./references/page-states.md)                 |

## How to use

1. Find the pattern that matches the problem (a loading/empty/error region →
   **Page states**).
2. Open its reference for the rules, the components to use, and the
   anti-patterns to avoid.
3. Copy from the live examples in
   `packages/docs-website/src/app/pages/patterns/<id>/examples/` — they compile
   and are the canonical code.
