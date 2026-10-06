# helix-skills

AI coding guidance for the **Helix** design system (Angular / Material 3): Agent
Skills, an `AGENTS.md` block and GitHub Copilot instructions, so Claude Code,
Cursor and Copilot write correct, on-brand Helix code.

> **Generated — do not edit by hand.** Built from the Helix design-system source
> (one `*.guide.md` per pattern) and refreshed by re-running the exporter. This
> repo is a distribution mirror; it carries guidance only, no package source.

## What's here

- `skills/helix-project-setup` — install and theme a new app
- `skills/helix-components` — component variants and tokens
- `skills/helix-patterns` — 19 composed UI patterns
- `agents-section.md` — the cross-tool `AGENTS.md` block
- `copilot-instructions.md` — GitHub Copilot path instructions
- `src/cli.mjs` — a zero-dependency sync CLI

## Use it in your repo

Run the bundled sync CLI (writes the skills to `.claude/skills`, merges the
`AGENTS.md` block, and writes the Copilot file):

```bash
npx github:uh-joan/helix-skills sync      # or: node /path/to/helix-skills/src/cli.mjs sync
```

Or pull just the skills with the Agent Skills CLI:

```bash
npx skills add uh-joan/helix-skills
```

## Versioning

The guidance tracks a Helix major. Pin by **git tag** (e.g. `v22`) rather than
an npm version:

```bash
npx github:uh-joan/helix-skills#v22 sync
```

The CLI warns if the `@cdx/*` version installed in your target repo doesn't
match; pass `--strict` to make that a hard stop.

## Requirements

This is **guidance, not the components.** The skills themselves are just markdown
plus a zero-dependency CLI (Node only). To actually build, your app installs the
real `@cdx/*` Helix packages, which come from their own npm registry and require
access to it — the skills just tell the agent how to compose them.
