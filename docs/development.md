# Development

**English** | [简体中文](development-zh.md)

The developer-facing documentation — building the plugin, the dev loop, testing
in the example vault, the dev-only debug tooling, and the AI agent skills in
`.agents/skills/`. The user-facing README stays a clean release page by design;
anything a plugin author or contributor needs lives here.

## Building

The plugin is written in TypeScript. You don't need to know TS to ask for
changes — describe what you want in natural language and the code will be
updated and rebuilt. To build manually:

Run the commands from the repository root:

```sh
npm ci             # first time only (downloads esbuild etc.)
npm run build:dev  # compiles main.ts → main.js (dev build: debug command included)
npm run build      # release build: minified, debug command excluded (= npm run build:release)
npm run check      # optional: TypeScript type-check (tsc --noEmit)
npm run test       # optional: vitest unit tests
npm run lint       # optional: ESLint
npm run format:check  # optional: Prettier
npm run check:scanner  # optional: the community scanner's own two passes (see below)
```

## The community scanner (CI)

When a plugin is submitted to the community catalogue, Obsidian's scanner runs its own passes over
the source and the stylesheet, and the plugin's page carries the resulting scorecard. Two of those
passes are reproducible here, and `npm run check:scanner` runs both:

```sh
npm run check:scanner      # both passes
npm run check:scanner:ts   # eslint-plugin-obsidianmd's configs.recommended over main.ts + src/
npm run check:scanner:css  # stylelint-config-obsidianmd over styles.css
```

- **`eslint.obsidianmd.mjs`** wraps the scanner's own preset unchanged. The two additions are the
  ones needed to run it at all (`projectService`, for its type-aware rules, and the `DEV_MODE`
  build flag), plus one documented exception: `obsidianmd/commands/no-default-hotkeys` is off
  because the plugin ships five default hotkeys by design. With that exception the pass must be
  clean, so CI runs it with `--max-warnings 0`.
- **`stylelint.config.mjs`** extends `stylelint-config-obsidianmd` — the scanner's CSS config — and
  changes exactly two things. Nine rules it inherits are off, because none of them is a **scorecard
  category**: they fire 134 errors on this stylesheet, and the scorecard shows none of them (only
  two of the nine are formatting Prettier owns). And `plugin/no-unsupported-browser-features` is
  pinned to `electron >= 30` — the scanner targets Obsidian 1.6.5 (its own baseline, the version the
  scorecard names), which ships Electron 30 — so it reports `css-text-indent` on the list geometry.
- **The `--max-warnings 44` baseline** in `check:scanner:css` is not a target: it is 34
  `!important` (#133) + 6 `:has` (#135) + 4 `text-indent` (#134), the three tracked follow-ups.
  A new warning pushes the count over the baseline and fails CI. **Lower the number in the same PR
  that closes one of those issues.**
- **`.github/workflows/ci.yml`** runs both passes as its own `scanner` job, so a regression is
  caught on the pull request instead of on the plugin's store page. It is deliberately _not_ part of
  `npm run lint` — the two rule sets are tuned separately, and the scanner's set is not ours to
  edit.

## Dev loop (rebuild + reload)

Rebuild on change, then reload manually:

```sh
npm run dev        # watch main.ts, rebuild main.js on change
```

After editing `main.ts`, reload the plugin in Obsidian: open the command
palette with `Cmd/Ctrl+P`, search for **Reload app without saving**, and run
it (it has no default hotkey). Alternatively, disable/re-enable **Native
Slides** under _Settings → Community plugins_.

## Testing in the example vault

**Every behavioural check runs in `example-vault/` — never in another vault.** It ships with this
repository, its plugin folder holds **symlinks to the repository root** (`main.js`, `manifest.json`,
`styles.css`), and it therefore always runs the build you just made. Never point an agent, a script
or a manual test at a vault that holds real notes.

- **Loop**: `npm run build:dev` (or `npm run dev` while editing) → reload the plugin in Obsidian
  (`Cmd/Ctrl+P` → **Reload app without saving**) → check. See _Dev loop_ above.
- **Scratch notes**: create them inside `example-vault/` when a check needs them and remove them when
  you are done — never leave test files behind. The `Probe*.md` / `test.md` / `untitled-slides.md`
  slides are the maintainer's scratch; leave them as they are.
- **Fixtures**: `example-vault/tests/typography-*.md` are consumed by the dev-only
  `Debug: Dump Typography Styles` command (`src/debug.ts` hard-codes five of the names) — do not
  rename or remove them. The demo deck is `Welcome.md` → `Make it yours.md` → `Grow the Deck.md`;
  the README's tour depends on those three names and on `demo-image.png`.
- **Config churn**: Obsidian rewrites the vault's tracked configuration while it runs
  (`appearance.json`, `community-plugins.json`, `core-plugins.json`). Restore it with
  `git restore -- example-vault/.obsidian` before switching branches or opening a PR, and re-check
  `git status` afterwards.
- **Driving the app** over CDP with `--remote-debugging-port=9222` is allowed and often the only
  way to check a behaviour that is a gesture — see _Driving the running app over CDP_ below, which is
  what keeps such a script on `example-vault/`.

### Driving the running app over CDP

CDP is the way to check a behaviour that a unit test cannot reach — a drag, a click, a menu action —
because it drives the real app against the build you just made. It also carries one sharp edge, which
is why it comes with a guard rather than a bare permission.

**The debugging port is process-wide, so it can expose more than one vault.** `--remote-debugging-port`
is a flag on the Obsidian _process_, and one process can hold several windows: on this machine the
maintainer's own notes vault and `example-vault/` have both been reachable on `:9222` at the same
time. The endpoint cannot tell them apart — every window answers `app://obsidian.md/index.html` — and
the window title is localized and stale, so a title match is not an identity. That is a
confidentiality boundary, not just a write boundary: anything connected can read the notes in the
other window.

**Identify the target by asking the app, and fail closed.**

```js
// the app's own answer is the identity — never the window title
const basePath = await cdp.eval(`app.vault.adapter.getBasePath()`);
if (basePath !== EXPECTED_VAULT) throw new Error(`refusing to drive ${basePath}`);
```

`EXPECTED_VAULT` is this repository's `example-vault/`. `connect()` asks every page target on the
port: zero matches means the vault is not open, and **several matches means the identity is
ambiguous — stop, do not pick one.** Both cases abort.

**`scripts/vault-cdp.mjs` does exactly this**, and is the intended entry point: it refuses to connect
unless precisely one window holds `example-vault/`, and re-checks that identity before every input
dispatch. It is a small library plus a one-shot CLI:

```sh
node scripts/vault-cdp.mjs state      # vault path, plugin version, active note, resolved deck
node scripts/vault-cdp.mjs reload     # reload the plugin, picking up a fresh main.js
node scripts/vault-cdp.mjs eval 'app.workspace.getActiveFile()?.path'  # evaluate and print it
node scripts/vault-cdp.mjs order      # slide titles as the slides panel lists them
node scripts/vault-cdp.mjs rects      # the same entries with their layout
node scripts/vault-cdp.mjs open "Check A"  # open a note in the editor
node scripts/vault-cdp.mjs drag 3 40  # press entry 3, drag to y=40, release
node scripts/vault-cdp.mjs create-deck "Check A" "Check B"
node scripts/vault-cdp.mjs delete-notes "Check A" "Check B"
```

A multi-step check is a script that imports it — whether it belongs in `scripts/` or in a scratch file
outside the repository is the rule in
[`.agents/skills/vault-cdp-testing/SKILL.md`](../.agents/skills/vault-cdp-testing/SKILL.md):

```js
import { connect, sameArray } from "<repo>/scripts/vault-cdp.mjs";
const cdp = await connect();
await cdp.open("Check A");
const before = await cdp.order();
await cdp.drag(3, 40);
// dragging entry 3 to the top moves it to the head
const expected = [before[3], before[0], before[1], before[2]];
const order = await cdp.order();
if (!sameArray(order, expected)) throw new Error("…");
// and the notes themselves agree: slide i links to slide i+1, the last holds []
const chain = await cdp.eval(`(async () => {
  const titles = ${JSON.stringify(order)};
  return titles.map((t) => {
    const file = app.vault.getAbstractFileByPath(t + ".md");
    return app.metadataCache.getFileCache(file)?.frontmatter?.deck ?? null;
  });
})()`);
const linked = order.slice(0, -1).map((_, i) => ["[[" + order[i + 1] + "]]"]);
if (!sameArray(chain, [...linked, []]))
  throw new Error("the frontmatter chain does not follow the panel order");
```

**`scripts/check-slide-geometry.mjs` is the worked example of a committed check**: it drives the app,
measures the card-title invariant across font sizes, themes and pane widths, and exits non-zero on any
drift. Run it with `npm run check:geometry` — dev-only, because it needs the running app, so it is
deliberately not part of CI. Reach for it when a change touches the card's geometry, and copy its shape
for the next invariant that only a real layout engine can see.

**The procedure a check follows** — its steps, their completion criteria and the rules that keep it on
this vault — is [`.agents/skills/vault-cdp-testing/SKILL.md`](../.agents/skills/vault-cdp-testing/SKILL.md);
this section is the mechanism behind it. Three incidents are why three of those rules exist:

- **a click that landed in the editor** — a collapsed sidebar gave every panel entry a `0×0` rect, so
  "click entry 1" became a click at `(0,0)` inside the editor, which edited a demo note and left a
  stray file in the repository root;
- **a read that came too early** — `openLinkText`, a frontmatter write and a metadata reindex are
  asynchronous, so a check that read immediately read a half-applied state, and a _correct_ refusal
  looked like a bug;
- **a window Chrome had throttled** — an occluded window still runs, but `requestAnimationFrame` may
  never fire and Obsidian's `Menu` may mount no DOM, so a menu could not be asserted on its rendered
  items and an animation could not be observed (`Page.bringToFront` has not been enough to lift it
  here).

## Agent skills

`.agents/skills/` is the repository's skill home, and it holds two kinds of
things, so any agent working here (Pi, Claude Code, Codex, Copilot, …) can grill
a plan, implement test-first, review a branch, run a debugging loop or hand a
session off. They are plain Markdown you own and may edit.

- **Repo-owned skills** — `dev-workflow` (the mandatory workflow of
  [Rule 1](../AGENTS.md), [Rule 2](../AGENTS.md) and [Rule 4](../AGENTS.md)),
  `herdr-subagent` (the Herdr pane/subagent mechanics Rule 2 uses),
  `code-review-herdr` (this repository's fork of the vendored `code-review`: same
  two-axis method, but each axis runs in its own Herdr pane, which is what Pi
  needs — it has no native sub-agent tool — and those panes are closed once their
  reports are collected) and `vault-cdp-testing` (the procedure a behavioural
  check follows in the running app, [Rule 3](../AGENTS.md)). Ours: edit freely;
  they stay Prettier-formatted (ESLint skips the whole `.agents/skills/` tree).
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
  `.agents/skills/*` (re-including the four repo-owned skills) — never reformat
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
> `herdr-subagent`, `code-review-herdr` and `vault-cdp-testing` too. They are
> committed, so `git checkout -- .agents/skills` restores them, but never run
> those commands blindly.

The `/setup-matt-pocock-skills` skill records this repository's issue tracker,
triage labels and doc layout under [`docs/agents/`](agents/), for the skills that
need them; it has been run here, and the three files are committed alongside this
doc. `code-review-herdr` reads `docs/agents/issue-tracker.md` to resolve its Spec
axis, and the triage mapping lives in `docs/agents/triage-labels.md`, which
`AGENTS.md` points at, so whoever runs `/triage` has it to hand. Edit them
directly; re-run the skill only to switch trackers or start over.

## Typography debug tooling (dev-only)

The typography-measurement tooling ships as a **dev-only** command and is
excluded from release builds.

- **Dev build** (`npm run build:dev` / `npm run dev`) registers the `Debug: Dump
Typography Styles` command: it samples the current note in **both** edit and
  reading views, computes an edit-vs-reading diff, and writes
  `.native-slides-debug.json` to the vault root (no manual console
  copy/paste). Run it on a deck note with Slides mode on; the five
  `typography-sample-*.md` notes in `example-vault/` are its fixed one-page
  fixtures — do not rename or remove them.
- **Release build** (`npm run build` / `npm run build:release`) minifies `main.js`
  and drops the debug command (and its supporting code) entirely via
  `--define:DEV_MODE=false` + tree-shaking. Run `npm run build:dev` afterwards to
  restore the dev artifact; `npm run build` (the release build) is what the
  committed `main.js` must be.

The source is split into `src/` modules (`types`, `mode`, `deck-service`,
`panel`, `panel-drag`, `bar`, `commands`, `settings`, `debug`, `deck`,
`createNext`, `deleteSlides`, `move`, `nav`, `capacity`, `capacity-core`,
`confirm-delete`, `utils`) with `main.ts` as the orchestration entry point.

`scripts/` holds development tooling that is **not** part of the plugin and never ships in a release
(the Release workflow publishes `main.js`, `manifest.json` and `styles.css` only):

- **`vault-cdp.mjs`** — the CDP driver of _Driving the running app over CDP_ above, and the shared
  arg-parsing / vault-state helpers the checks import.
- **`check-slide-geometry.mjs`** (`npm run check:geometry`) — measures the card-title geometry in the
  running app across font sizes, themes and pane widths, and exits non-zero on any drift (the
  invariant behind #125, which no unit test can see).
- **`slide-geometry-snapshot.mjs`** (`npm run check:geometry-snapshot`) — dumps every computed number
  the card's layout is made of (card box and padding, title box, every line, every image, the chrome
  Slides mode hides, the body cursor), or diffs two dumps and fails on drift beyond `--tolerance`.
- **`slide-visual-check.mjs`** (`npm run check:visual`) — captures deterministic screenshots of the
  slides (pinned viewport, theme, font size and scheme; animations and the caret frozen) and compares
  two capture directories pixel by pixel, failing on anything beyond `--maxDiff` pixels. Its `--diff`
  mode needs **`python3` with Pillow** on `PATH` — the only part of the repository that does; nothing
  else installs or declares it.
