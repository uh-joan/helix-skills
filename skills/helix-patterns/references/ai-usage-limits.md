# Pattern: AI usage & limits

- **id**: ai-usage-limits
- **status**: beta
- **use when**: An assistant with quotas, a bounded context window, or rate
  limits — anywhere a request can be refused for a limit rather than an error.
- **avoid when**: No limits apply, or a genuine failure (that's the error state,
  not a limit).
- **components**: HelixNotificationComponent, matButton
- **tokens**: text-secondary, spacing-2

## Rules

- Show remaining quota before it runs out (e.g. "8 of 10 responses left today"),
  quietly, near the composer — not only once it's gone.
- A limit is not a failure. Use an hlx-notification (warn for approaching,
  negative only when blocked), with plain language and a way forward — not a red
  error toast.
- Every limit state offers the next step: context too long → "Start a new chat";
  quota reached → when it resets; rate limited → when to retry.
- When a limit blocks input, disable the composer and the send/New-chat control
  that can't work, so the user isn't typing into a dead end.
- Limit banners are announced to assistive tech (hlx-notification sets the role
  — status for warn, alert for negative); don't bury the state in muted text
  only.

## Anti-patterns (do not do)

- No sign of the quota until the user is suddenly blocked.
- Treating a limit as a red error with no next step.
- Leaving the composer enabled when input can't be sent.

## Guidance

## Overview

Assistants have limits — a daily response quota, a bounded context window, a
rate limit. Tell the user where they stand _before_ they hit one, and give a
clear way forward when they do. an app threads a **responses-left quota**; cmc
shows a **context-limit** banner that points to a new chat. Both use the
[notification](/components/notifications) component; this pairs with the
[AI assistant](/patterns/ai-assistant) and follows the
[AI foundation](/foundations/ai)'s _Trustworthy_ principle.

## Three limit states

| State                            | When                          | Treatment                                                    |
| -------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| **Quota remaining**              | Normal                        | Quiet "N of M left today" near the composer                  |
| **Context too long**             | The thread exceeds the window | `warn` banner → Start a new chat                             |
| **Quota reached / rate limited** | Blocked                       | `negative` banner + disable the composer; say when it resets |

```html
@if (contextTooLong()) {
<hlx-notification
  severity="warn"
  title="This conversation is getting long"
  action="Start a new chat"
  (actionEvent)="newChat()"
>
  Start a new chat to keep answers accurate.
</hlx-notification>
}
```

## Do

- Show remaining quota quietly, before it runs out.
- Use `hlx-notification` (warn approaching, negative when blocked), with a next
  step.
- Disable the composer when input can't be sent.

## Don't

- Hide the quota until the user is blocked.
- Treat a limit as a red error with no way forward.
- Leave the composer enabled when it can't send.
