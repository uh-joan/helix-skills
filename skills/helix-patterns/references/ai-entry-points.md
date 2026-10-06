# Pattern: AI entry points

- **id**: ai-entry-points
- **status**: beta
- **use when**: Deciding how to surface AI in an app shell: the global way in
  (header, rail, or FAB) and how to announce a new AI capability.
- **avoid when**: An AI action scoped to on-screen content (that's inline AI
  actions), or the assistant conversation itself (that's the AI assistant).
- **components**: HelixAiAvatarComponent, MatToolbarModule, matButton,
  MatFabButton, matIcon
- **hlx classes**: hlx-btn-ai, hlx-gradient-ai
- **tokens**: gradient-ai, surface-minimal, icon-accent, spacing-2

## Rules

- Every entry point wears the same Helix AI treatment (gradient / sparkle via
  hlx-btn-ai and hlx-ai-avatar) so the user recognises AI at a glance. Don't
  hand-roll a different AI look on each screen.
- Offer one clear primary way in (a header button, rail, or FAB) plus scoped
  context entries; don't stack competing AI buttons or block the task with a
  modal upsell.
- An entry point says what it does with a text label (or aria-label on a FAB) —
  "Ask AI", "Research assistant" — never a bare sparkle the user has to guess
  at.
- An AI announcement/promo banner introduces a capability once: it's dismissible
  and stays dismissed (persist the flag). It is not permanent chrome and never
  returns every visit.
- All global entry points open the same assistant surface and share its state —
  not several disconnected chats.
- Entry points are real, keyboard-reachable buttons with accessible names; the
  promo banner's dismiss control is reachable and labelled.

## Anti-patterns (do not do)

- A bare sparkle icon with no label — the user can't tell what it does.
- Each screen invents its own AI look, so AI stops being recognisable.
- A promo banner that can't be dismissed, or returns on every visit.
- Interrupting the task with a modal AI upsell instead of an inline, dismissible
  invitation.

## Guidance

## Overview

Before the user can talk to the assistant, they have to **find it**. Every app
in the suite surfaces AI differently — reg-ai uses a sidebar rail, cmc a header
button, off-x a floating action button — and none uses the Helix AI primitives,
so each screen reinvents the look. This pattern settles **where** AI lives and
**how** the entry wears the Helix AI treatment, grounded in the
[AI foundation](/foundations/ai)'s _Transparent_ principle: AI is clearly marked
and easy to recognise.

## The three surfaces

- **Primary trigger** — a header button or a rail, marked with `hlx-btn-ai`. The
  always-there way into the assistant.
- **Floating action button** — an extended FAB (`hlx-btn-ai`) for apps where the
  header is busy; it has an accessible name, not just a sparkle.
- **Promo banner** — a one-time, dismissible invitation that introduces a new AI
  capability, using the AI gradient and an `hlx-ai-avatar`. It teaches the
  feature once, then stays out of the way.

All three open the **same** assistant surface — see the
[AI assistant](/patterns/ai-assistant). For AI scoped to on-screen content, use
[inline AI actions](/patterns/ai-inline-actions) instead.

```ts
// A promo introduces the capability once, then stays dismissed.
readonly promoVisible = signal(this.seenPromo() === false);

dismissPromo(): void {
  this.promoVisible.set(false);
  this.markPromoSeen(); // persist, e.g. user settings — don't show it again
}

// Every entry point lands on the same assistant surface.
openAssistant(from: 'header' | 'fab' | 'promo'): void {
  this.assistant.open({ source: from });
}
```

## Consistent treatment

The header button, the FAB and the banner all use the same gradient and sparkle
so AI reads as one feature across the app. Reach for `hlx-btn-ai` on buttons and
FABs, `hlx-ai-avatar` for the mark, and `hlx-gradient-ai` (or the
`--hlx-gradient-ai` token) for a custom AI surface like the banner's accent.

## Do

- Give one clear primary entry, marked with the AI treatment.
- Label every trigger; give a FAB an accessible name.
- Make the promo dismissible and keep it dismissed.
- Lead every entry to the same assistant surface.

## Don't

- Ship a bare, unlabelled sparkle.
- Reinvent the AI look per screen.
- Make the promo permanent or interrupt the task with a modal.
