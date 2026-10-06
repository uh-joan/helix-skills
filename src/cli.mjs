#!/usr/bin/env node
/**
 * @cdx/helix-ai — sync Helix design-system AI coding guidance into a repo.
 *
 * Writes the guidance that ships with THIS package version into a target repo,
 * in the formats each AI tool reads:
 *   - Agent Skills  → <target>/.claude/skills/<name>/   (helix-patterns, helix-components,
 *                     helix-project-setup — Claude Code / skill-aware agents)
 *   - AGENTS.md     → a managed block in <target>/AGENTS.md       (cross-tool: Cursor, Copilot agent, Codex, …)
 *   - Copilot       → <target>/.github/instructions/helix-patterns.instructions.md
 *
 * The guidance is baked into this package at publish time, so the version you
 * install IS the version you get — install @cdx/helix-ai matching your @cdx/*
 * major and the guidance matches. The CLI also checks the @cdx/* version
 * actually installed in the target and warns on a major mismatch.
 *
 * Usage:
 *   npx @cdx/helix-ai sync [options]
 *     --all          write every format (default)
 *     --strict       treat a @cdx/* major mismatch as an error (default: warn)
 *     --skill        write only the Agent Skill
 *     --agents       write only the AGENTS.md block
 *     --copilot      write only the Copilot instructions
 *     --dir <path>   target repo (default: current directory)
 *     --dry-run      print what would change, write nothing
 *     --force        overwrite even on a detected major-version mismatch
 *     --help         show this help
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
  rmSync,
  statSync,
} from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, '..');
// Payload layout works in both homes: the @cdx/helix-ai package keeps it under
// `payload/`; the standalone helix-skills repo keeps it at the repo root. Detect
// whichever is present so the same CLI serves both.
const payloadDir = existsSync(join(pkgRoot, 'payload'))
  ? join(pkgRoot, 'payload')
  : pkgRoot;
const selfVersion = JSON.parse(
  readFileSync(join(pkgRoot, 'package.json'), 'utf8'),
).version;

const AGENTS_START = '<!-- helix-patterns:start -->';
const AGENTS_END = '<!-- helix-patterns:end -->';

function parseArgs(argv) {
  const opts = {
    command: 'sync',
    formats: new Set(),
    dir: process.cwd(),
    dryRun: false,
    force: false,
    strict: false,
    help: false,
  };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--strict') opts.strict = true;
    else if (a === '--all') {
      /* default */
    } else if (a === '--skill') opts.formats.add('skill');
    else if (a === '--agents') opts.formats.add('agents');
    else if (a === '--copilot') opts.formats.add('copilot');
    else if (a === '--dir') opts.dir = rest[++i];
    else if (!a.startsWith('-')) opts.command = a;
    else {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    }
  }
  if (opts.formats.size === 0) {
    opts.formats = new Set(['skill', 'agents', 'copilot']);
  }
  return opts;
}

const HELP = `Helix AI guidance v${selfVersion}

Sync Helix design-system AI coding guidance into a repo.

Usage:
  npx @cdx/helix-ai sync [options]

Options:
  --all          write every format (default)
  --skill        write only the Agent Skills (.claude/skills/*)
  --agents       write only the AGENTS.md block
  --copilot      write only the Copilot instructions
  --dir <path>   target repo (default: current directory)
  --dry-run      print what would change, write nothing
  --strict       treat a @cdx/* major mismatch as an error (default: warn)
  --force        proceed even under --strict on a mismatch
  --help         show this help
`;

/** Read the @cdx/* major actually installed in the target, or null. */
function installedCdxVersion(targetDir) {
  for (const name of [
    '@cdx/theme-angular-material',
    '@cdx/colors',
    '@cdx/ngx-branding',
  ]) {
    const p = join(targetDir, 'node_modules', name, 'package.json');
    if (existsSync(p)) {
      try {
        return { name, version: JSON.parse(readFileSync(p, 'utf8')).version };
      } catch {
        /* ignore */
      }
    }
  }
  return null;
}

const major = (v) => String(v ?? '').split('.')[0];

/** Recursively list files under a dir, relative to it. */
function listFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, base));
    else out.push(relative(base, full));
  }
  return out;
}

function write(file, content, { dryRun }, changes) {
  const exists = existsSync(file);
  const current = exists ? readFileSync(file, 'utf8') : null;
  if (current === content) return;
  changes.push(`${exists ? 'update' : 'create'}  ${file}`);
  if (dryRun) return;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function syncSkills(targetDir, opts, changes) {
  const skillsRoot = join(payloadDir, 'skills');
  for (const name of readdirSync(skillsRoot)) {
    const src = join(skillsRoot, name);
    if (!statSync(src).isDirectory()) continue;
    const dest = join(targetDir, '.claude', 'skills', name);
    const wanted = new Set(listFiles(src));
    for (const rel of wanted) {
      write(join(dest, rel), readFileSync(join(src, rel), 'utf8'), opts, changes);
    }
    // Remove stale files (e.g. a reference that no longer exists), but only ones
    // we own under this skill dir.
    if (existsSync(dest)) {
      for (const rel of listFiles(dest)) {
        if (!wanted.has(rel)) {
          changes.push(`remove  ${join(dest, rel)}`);
          if (!opts.dryRun) rmSync(join(dest, rel));
        }
      }
    }
  }
}

function syncCopilot(targetDir, opts, changes) {
  const src = join(payloadDir, 'copilot-instructions.md');
  const dest = join(
    targetDir,
    '.github',
    'instructions',
    'helix-patterns.instructions.md',
  );
  write(dest, readFileSync(src, 'utf8'), opts, changes);
}

function syncAgents(targetDir, opts, changes) {
  const block = readFileSync(
    join(payloadDir, 'agents-section.md'),
    'utf8',
  ).trim();
  const managed = `${AGENTS_START}\n${block}\n${AGENTS_END}\n`;
  const dest = join(targetDir, 'AGENTS.md');
  let next;
  if (existsSync(dest)) {
    const current = readFileSync(dest, 'utf8');
    if (current.includes(AGENTS_START) && current.includes(AGENTS_END)) {
      next = current.replace(
        new RegExp(`${AGENTS_START}[\\s\\S]*?${AGENTS_END}\\n?`),
        managed,
      );
    } else {
      next = current.replace(/\n*$/, '\n') + '\n' + managed;
    }
  } else {
    next = `# AGENTS.md\n\nGuidance for AI coding agents in this repo.\n\n${managed}`;
  }
  write(dest, next, opts, changes);
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.help || opts.command === 'help') {
    process.stdout.write(HELP);
    return;
  }
  if (opts.command !== 'sync') {
    console.error(`Unknown command: ${opts.command}\n`);
    process.stdout.write(HELP);
    process.exit(2);
  }
  if (!existsSync(payloadDir)) {
    console.error(
      'Guidance payload is missing from this package — reinstall @cdx/helix-ai.',
    );
    process.exit(1);
  }

  const targetDir = opts.dir;
  if (!existsSync(targetDir) || !statSync(targetDir).isDirectory()) {
    console.error(`Target directory does not exist: ${targetDir}`);
    process.exit(1);
  }

  // Version-skew check against the @cdx/* actually installed in the target.
  // Advisory by default (the guidance may be distributed independently of the
  // package version, e.g. from the standalone helix-skills repo); --strict makes
  // a major mismatch a hard stop, and --force overrides --strict.
  const installed = installedCdxVersion(targetDir);
  if (installed && major(installed.version) !== major(selfVersion)) {
    const msg = `guidance is ${selfVersion} but ${installed.name} in the target is ${installed.version} — it may not match the installed Helix.`;
    if (opts.strict && !opts.force) {
      console.error(
        `✗ ${msg}\n  Use guidance matching your @cdx/* major, or pass --force.`,
      );
      process.exit(1);
    }
    console.warn(`⚠ ${msg}`);
  } else if (!installed) {
    console.warn(
      '⚠ No @cdx/* package found in the target node_modules — cannot verify the guidance matches your installed Helix.',
    );
  }

  const changes = [];
  if (opts.formats.has('skill')) syncSkills(targetDir, opts, changes);
  if (opts.formats.has('agents')) syncAgents(targetDir, opts, changes);
  if (opts.formats.has('copilot')) syncCopilot(targetDir, opts, changes);

  if (changes.length === 0) {
    console.log('✓ Helix AI guidance already up to date.');
    return;
  }
  const verb = opts.dryRun ? 'Would write' : 'Wrote';
  console.log(
    `${verb} Helix AI guidance (v${selfVersion}) into ${relative(process.cwd(), targetDir) || '.'}:`,
  );
  for (const c of changes) console.log(`  ${c}`);
  if (opts.dryRun) console.log('\n(dry run — nothing written)');
}

main();
