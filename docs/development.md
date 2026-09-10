# Development

**English** | [简体中文](development-zh.md)

The developer-facing documentation — building the plugin, the dev loop, the
dev-only debug tooling, and the AI agent skills vendored in the repository. The
user-facing README stays a clean release page by design; anything a plugin
author or contributor needs lives here.

## Building

The plugin is written in TypeScript. You don't need to know TS to ask for
changes — describe what you want in natural language and the code will be
updated and rebuilt. To build manually:

Run the commands from the repository root:

```sh
npm ci             # first time only (downloads esbuild etc.)
npm run build      # compiles main.ts → main.js (dev build: debug command included)
npm run build:release  # publish build: minified, debug command excluded
npm run check      # optional: TypeScript type-check (tsc --noEmit)
npm run test       # optional: vitest unit tests
npm run lint       # optional: ESLint
npm run format:check  # optional: Prettier
```

## Dev loop (rebuild + reload)

Rebuild on change, then reload manually:

```sh
npm run dev        # watch main.ts, rebuild main.js on change
```

After editing `main.ts`, reload the plugin in Obsidian: open the command
palette with `Cmd/Ctrl+P`, search for **Reload app without saving**, and run
it (it has no default hotkey). Alternatively, disable/re-enable **Native
Slides** under _Settings → Community plugins_.

## Agent skills (vendored)

The engineering and productivity skills from
[mattpocock/skills](https://github.com/mattpocock/skills) are vendored into this
repository, so any agent working here (Pi, Claude Code, Codex, Copilot, …) can
grill a plan, implement test-first, review a branch, run a debugging loop or
hand a session off. They are plain Markdown you own and may edit.

- **Canonical location**: `.agents/skills/<name>/SKILL.md`. Agents that share the
  canonical directory (Pi, Amp, Codex, Copilot, …) discover it as-is; an
  agent-specific directory (`.claude/skills`, `.cursor/skills`, …) is a
  **symlink** into it, never a copy — one source of truth.
- **What is installed**: the 25 published skills — the `engineering` +
  `productivity` sets listed at [aihero.dev/skills](https://www.aihero.dev/skills).
  The experimental `in-progress` / `general` skills are deliberately left out.
- **Versions are pinned** by `skills-lock.json` (source repo, path and content
  hash per skill), so a reinstall is reproducible.
- **Third-party content**: kept out of Prettier and ESLint via
  `.prettierignore` — never reformat it, so updates stay diffable.

Manage them with the skills CLI, from the repository root:

```sh
npx skills@latest list                                            # what is installed
npx skills@latest add mattpocock/skills -a pi -y -s <skill-names> # add skills
npx skills@latest update                                          # re-sync from the lock file
```

After a first install, run the `/setup-matt-pocock-skills` skill once: it records
this repository's issue tracker, triage labels and doc layout for the skills that
need them.

## Typography debug tooling (dev-only)

The typography-measurement tooling ships as a **dev-only** command and is
excluded from release builds.

- **Dev build** (`npm run build` / `npm run dev`) registers the `Debug: Dump
Typography Styles` command: it samples the current note in **both** edit and
  reading views, computes an edit-vs-reading diff, and writes
  `.native-slides-debug.json` to the vault root (no manual console
  copy/paste). Run it on a deck note with Slides mode on; the five
  `typography-sample-*.md` notes in `example-vault/` are its fixed one-page
  fixtures — do not rename or remove them.
- **Release build** (`npm run build:release`) minifies `main.js` and drops the
  debug command (and its supporting code) entirely via
  `--define:DEV_MODE=false` + tree-shaking. Run `npm run build` afterwards to
  restore the dev artifact.

The source is split into `src/` modules (`types`, `mode`, `deck-service`,
`panel`, `bar`, `commands`, `settings`, `debug`, `deck`, `createNext`,
`deleteSlides`) with `main.ts` as the orchestration entry point.
