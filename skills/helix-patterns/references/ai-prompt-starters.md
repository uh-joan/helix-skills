# Pattern: AI prompt starters

- **id**: ai-prompt-starters
- **status**: beta
- **use when**: The empty state of an AI assistant, before the first message,
  full-page or in a panel.
- **avoid when**: A conversation already in progress (that's the AI assistant
  thread), or a one-off generate button.
- **components**: HelixAiAvatarComponent, matButton, MatFormFieldModule
- **hlx classes**: hlx-gradient-ai
- **tokens**: surface-minimal, text-secondary, spacing-2, spacing-3

## Rules

- A starter card fills the composer with an editable prompt and focuses it; it
  does not send immediately — the user stays in control (the Assistive
  principle).
- Offer three to six starters, each a specific, product-relevant task ("Compare
  the last two labels for…"), not generic filler ("Ask me anything"). Keep them
  short.
- Starters are real buttons (keyboard-reachable, aria-labelled), laid out as a
  responsive grid that collapses to one column on small screens.
- Lead with a brief greeting (AI avatar optional), then the starters, then the
  docked composer — the same composer the conversation uses.
- Signal that this is AI with the Helix AI treatment (avatar / gradient title),
  per the AI foundation, without overdoing it.

## Anti-patterns (do not do)

- A starter that fires the question immediately, denying the user a chance to
  edit.
- Vague starters ("Ask me anything") that don't teach what the assistant can do.
- Starter tiles as clickable divs instead of real buttons.

## Guidance

## Overview

An assistant's first screen shouldn't be an empty box. Lead with a short
greeting, a few **suggested-prompt cards** that seed the composer, and the
composer itself. All three apps do this; reg-ai's `chat-intro` + `hint-card` is
the cleanest source. It pairs with the [AI assistant](/patterns/ai-assistant)
pattern (this is its empty state) and follows the
[AI foundation](/foundations/ai).

## Starters seed, they don't send

Clicking a starter fills the composer with an **editable** prompt and focuses it
— it never sends on click. That keeps the user in control (the foundation's
_Assistive_ principle) and lets them tweak before asking.

```ts
readonly draft = signal('');

useStarter(prompt: string): void {
  this.draft.set(prompt);
  this.composer()?.nativeElement.focus();
}
```

## Pick good starters

Three to six, each a **specific, product-relevant** task — not generic filler:

- "Summarise the latest regulatory changes for pembrolizumab"
- "Compare the last two FDA labels for this drug"
- "Which trials for this target changed phase this quarter?"

## Do

- Seed the composer (editable, focused); never auto-send.
- Offer a few specific, product-relevant starters as real buttons.
- Reuse the conversation's composer.
- Signal AI with the Helix treatment, lightly.

## Don't

- Fire the question on card click.
- Use vague "ask me anything" starters.
- Build the tiles as clickable divs.
