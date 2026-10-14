# Contributing to Native Slides

Thanks for your interest in contributing! This guide covers setup, the checks a change must pass, and how a pull request is reviewed and merged. Build internals, the dev loop and the test tooling are in [docs/development.md](docs/development.md).

## Development setup

```bash
git clone https://github.com/l05k/obsidian-native-slides.git
cd obsidian-native-slides
npm ci
```

Test in the repository's own **`example-vault/`**: open it in Obsidian (_Open another vault_). Its plugin folder already holds symlinks to `main.js`, `styles.css` and `manifest.json` at the repository root, so you do not link anything yourself. Never test against a vault that holds real notes.

Build, then reload the plugin:

```bash
npm run build:dev   # or `npm run dev` to rebuild on save
```

In Obsidian, run **Reload app without saving** from the command palette (`Cmd/Ctrl+P`). Disabling and re-enabling the plugin also picks up `main.js` / `styles.css`, but not `manifest.json`. See [Dev loop](docs/development.md#dev-loop-rebuild--reload).

## Checks before you open a PR

```bash
npm run build          # release bundle; main.js is committed with source changes
npm run check          # TypeScript type-check
npm test               # unit tests (vitest)
npm run lint           # ESLint
npm run format:check   # Prettier (run `npm run format` to fix)
npm run check:scanner  # the community scanner's two passes
```

CI runs the same set and also fails if the committed `main.js` differs from a fresh build (`git diff --exit-code -- main.js`). The scanner's CSS pass has a tracked baseline; see [The community scanner](docs/development.md#the-community-scanner-ci).

## Commits

- **One logical change per commit**, with its docs and tests in the same commit.
- **Message format**: a short imperative subject with a type prefix (`feat:`, `fix:`, `docs:`, `chore:`). No scope is required.
- **User-visible changes** get a line under `[Unreleased]` in `CHANGELOG.md`, and `README.md` / `README-zh.md` are updated together. Tooling and docs-only changes do not go in the changelog.
- **Do not commit Obsidian's runtime state.** Obsidian rewrites some tracked files in `example-vault/.obsidian/` while it runs. Stage files by name rather than with `git add -A`, and leave those out.

## Pull requests

1. Branch from `main`: `git switch -c feat/your-change`.
2. Open a PR against `main`, as a draft if you want early feedback.
3. Keep the branch current by **merging** `main` into it. Do not rebase.
4. CI must be green: the `build` job (check, test, lint, format:check, build, `main.js` in sync) and the `scanner` job.

**Who reviews and merges:**

- **Human contributions**: a maintainer reviews and merges. Please do not merge your own PR.
- **Agent-authored PRs**: reviewed once by an independent Herdr subagent, then squash-merged by the authoring agent once CI is green. The rules are in [AGENTS.md](AGENTS.md) (Rule 2).
- **Release PRs**: always merged by the maintainer ([Rule 4](AGENTS.md)).

Squash is the only merge method the repository allows.

## Reporting issues

Use the issue templates: **Bug report** for crashes, unexpected behaviour or visual glitches, **Feature request** for new functionality. Include your Obsidian version, plugin version and, for visual bugs, a screenshot or recording.

## Code style

- **TypeScript** for all source (`main.ts`, `src/`). ESLint and Prettier enforce style: `npm run lint:fix`, `npm run format`.
- **CSS**: `styles.css` is hand-written, with no preprocessor. Theme-scoped values go through the existing `--ns-*` variables, and selectors stay under `body.native-slides-mode` so native modes are never affected.
- **Tests**: `test/` uses Vitest, for pure logic (deck navigation, page numbers, theme registry). Visual and CSS behaviour is checked by hand in `example-vault/`. A layout invariant that would regress silently can also be locked with a contract test over `styles.css`.

## Project structure

```
main.ts          Plugin entry point (lifecycle, Slides mode toggle)
src/             Plugin modules, listed in docs/development.md
styles.css       All CSS, scoped under body.native-slides-mode
test/            Vitest unit tests
scripts/         Dev-only tooling (CDP checks); never shipped
docs/            Design, development and ADRs
example-vault/   The vault used for manual testing
.agents/skills/  Agent skills (see AGENTS.md)
```

## Questions?

Open a discussion or issue.
