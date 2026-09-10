# Development

**English** | [简体中文](development-zh.md)

The developer-facing documentation — building the plugin, the dev loop, the
dev-only debug tooling, and the AI agent skills in `.agents/skills/`. The
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

## Agent skills

`.agents/skills/` is the repository's skill home, and it holds two kinds of
things, so any agent working here (Pi, Claude Code, Codex, Copilot, …) can grill
a plan, implement test-first, review a branch, run a debugging loop or hand a
session off. They are plain Markdown you own and may edit.

- **Repo-owned skills** — `dev-workflow` (the mandatory workflow of
  [Rule 1](../AGENTS.md) and [Rule 2](../AGENTS.md)), `herdr-subagent` (the
  Herdr pane/subagent mechanics Rule 2 uses) and `code-review-herdr` (this
  repository's fork of the vendored `code-review`: same two-axis method, but each
  axis runs in its own Herdr pane, which is what Pi needs — it has no native
  sub-agent tool — and those panes are closed once their reports are collected).
  Ours: edit freely; they stay Prettier-formatted (ESLint skips the whole
  `.agents/skills/` tree).
- **The vendored 25** — the `engineering` + `productivity` skills from
  [mattpocock/skills](https://github.com/mattpocock/skills), i.e. the sets listed
  at [aihero.dev/skills](https://www.aihero.dev/skills). The experimental
  `in-progress` / `misc` skills are deliberately left out. The vendored
  `code-review` keeps its upstream text (so `npx skills update` can still refresh
  it) and is **not** what Rule 2 uses: `code-review-herdr` is the fork that runs.
  Port upstream fixes into the fork by hand when it changes.
- **Canonical location**: `.agents/skills/<name>/SKILL.md`. Agents that share the
  canonical directory (Pi, Amp, Codex, Copilot, …) discover it as-is; an
  agent-specific directory (`.claude/skills`, `.cursor/skills`, …) is a
  **symlink** into it, never a copy. Those dirs are local CLI artefacts and are
  gitignored — the committed `.agents/skills/` copy is the one source of truth.
- **The lock is an audit trail, not a pin** — `skills-lock.json` records the
  source repo, path and content hash per skill. `npx skills update` and
  `npx skills experimental_install` re-download and **rewrite** those hashes, so
  upstream changes surface as a `skills-lock.json` diff, while local edits under
  `.agents/skills/` are overwritten without warning. No commit `ref` is recorded,
  so a reinstall resolves the upstream default branch.
- **Third-party content stays unformatted**: `.prettierignore` excludes
  `.agents/skills/*` (re-including the three repo-owned skills) — never reformat
  the vendored files, so updates stay diffable. Prettier consults `.gitignore`
  too, so anything ignored there (this checkout's local scratch files, per-machine
  Obsidian state) is skipped by `npm run format:check` as well.

Manage them with the skills CLI, from the repository root:

```sh
npx skills@latest list                                                   # what is installed
npx skills@latest add mattpocock/skills -a universal -y -s <skill-names> # add skills
npx skills@latest update                                                 # refresh from the lock's sources
```

`-a universal` is the target that writes the canonical `.agents/skills/`; a
single-agent target such as `-a pi` copies the skills into that agent's own
gitignored directory (`.pi/skills/`) instead. A successful `add` prints
`→ ./.agents/skills/<name>`.

> **Caution:** the CLI owns this directory. A scoped `npx skills remove` — and
> especially `remove --all` — would delete the repo-owned `dev-workflow`,
> `herdr-subagent` and `code-review-herdr` too. They are committed, so
> `git checkout -- .agents/skills` restores them, but never run those commands
> blindly.

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
`deleteSlides`, `nav`, `capacity`, `capacity-core`, `confirm-delete`, `utils`)
with `main.ts` as the orchestration entry point.
