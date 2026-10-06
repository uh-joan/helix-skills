# Pattern: AI chat history

- **id**: ai-chat-history
- **status**: beta
- **use when**: An AI assistant keeps a history of conversations the user
  returns to, resumes, renames or cleans up.
- **avoid when**: A one-shot or stateless AI interaction with nothing worth
  keeping, or a single active conversation with no past sessions.
- **components**: matButton, matIcon, MatMenuModule, NgxSkeletonLoaderModule
- **hlx classes**: hlx-btn-negative
- **tokens**: surface-minimal, border-secondary, text-secondary, spacing-2

## Rules

- Group conversations by recency (Today / Last 7 days / Older), newest first, so
  the user finds recent work without scanning the whole list.
- Label each conversation by its first question, truncated with the full text on
  a tooltip; a pending conversation shows a skeleton placeholder until its title
  arrives.
- Let the user rename and delete a conversation from a per-item menu revealed on
  hover and focus — real, keyboard-reachable controls — and confirm a delete.
- The list has loading (skeletons), empty, and error-with-retry states, plus
  load-more and end-of-list for a long history — not just the loaded path.
- Highlight the conversation currently open and scroll it into view; a new chat
  is one click from the header.
- Each entry deep-links to its conversation and restores it where the user left
  off; remember whether the history panel is open.

## Anti-patterns (do not do)

- An undated, ungrouped list where the user can't find recent chats.
- Entries labelled only by id or timestamp, with no human-readable title.
- History you can read but can't rename, delete or clean up.
- A list that renders loaded data but shows nothing while loading, empty or on
  error.
- Deleting a conversation with no confirmation.

## Guidance

## Overview

An assistant the user returns to needs a **history** they can navigate — not a
flat log. Group past conversations by recency, title each by its first question,
and let the user reopen, rename and delete them, with every list state handled.
reg-ai's chat-history panel is the reference: grouped **Today / Last 7 days /
Older**, query-as-title with a tooltip, a per-item **Rename / Delete** menu on
hover and focus, and real loading, empty and error states. It's the
[AI foundation](/foundations/ai)'s _Trustworthy_ principle applied to the user's
own record, and it pairs with the [AI assistant](/patterns/ai-assistant).

## Grouped, titled, resumable

```ts
// Group by recency, newest first — Today / Last 7 days / Older.
readonly grouped = computed(() => {
  const now = new Date();
  const groups = new Map<string, Conversation[]>();
  for (const c of [...this.conversations()].sort(byNewest)) {
    const key = groupKey(new Date(c.timestamp), now); // 'Today' | 'Last 7 days' | 'Older'
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(c);
  }
  return groups;
});

// Title from the first question; a pending conversation shows a skeleton.
title(c: Conversation): string { return c.query || ''; }
```

## Every state, not just the happy path

A real history has to render while **loading** (skeletons), when **empty** (a
clear message), and on **error** (a retry) — and, for a long list, load more on
scroll and show the end. Treat these as first-class, exactly like the
[Page states](/patterns/page-states) pattern.

## Do

- Group by recency and title by the first question.
- Rename and delete from a hover/focus menu; confirm deletes.
- Handle loading, empty and error states, plus load-more.
- Highlight the active conversation; offer a one-click new chat.

## Don't

- Ship a flat, undated list or id-only titles.
- Make history read-only with no way to clean up.
- Render only the loaded path.
- Delete without confirmation.
