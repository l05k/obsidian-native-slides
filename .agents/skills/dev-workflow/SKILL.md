---
name: dev-workflow
description: Mandatory development workflow for this repository — single checkout, one branch at a time, merge latest main before PR, CLI-first, one independent Herdr-subagent code review round before squash-merging, reload-based preview loop, and a post-merge cleanup that deletes the merged PR's local branch and closes the review panes it spawned, leaving every remote branch to the user.
---

# Development Workflow (Rules 1, 2 and 4)

This skill is the full specification of **Rule 1**, of the review loop in **Rule 2** and of the release procedure in **Rule 4** in [AGENTS.md](../../../AGENTS.md). Every change to this repository MUST follow it. **Never commit directly to `main`.**

## Principles

- **CLI tools first.** Every step is driven by CLI tools (`git`, `gh`, `npm`).
- **Single checkout, one branch at a time.** All work happens in the one repository checkout; branches are created/switched with `git switch`. Features are developed **serially** — never parallel. No git worktrees.
- **No rebase.** Always `merge` the latest `main` into the branch and resolve conflicts explicitly. Never rewrite history with `rebase`.
- **Independent review, then squash-merge.** A PR is never reviewed by the agent that wrote it: a **separate agent in a Herdr pane** runs [`code-review-herdr`](../code-review-herdr/SKILL.md) over it, for exactly **one round**, after which the authoring agent may squash-merge its own PR once CI is green (step 4). This is the only path to a merge; skipping the loop, or merging before CI is green, is not allowed. The fixes are not re-reviewed — step 5's checks and the round's PR comment are what cover them — so keep them tight and scoped. A human may always take over the review instead — if the user asks to hold a PR for human review, hold it.

## Preview loop (no restart, no hot-reload plugin)

`example-vault/` is the **only** vault anything here may be tested against — never another vault, and never the maintainer's notes vault ([AGENTS.md](../../../AGENTS.md) Rule 3, and [docs/development.md](../../../docs/development.md#testing-in-the-example-vault) for the full loop).

The human opens **`example-vault/`** in Obsidian **once** and never needs to reopen it:

- After a **branch switch** or a **code change**, the human reloads with: `Cmd/Ctrl+P` → **Reload app without saving** (this reloads the whole vault in place — notes, config and plugins — per the official "Build a plugin" docs). The vault folder never changes, so Obsidian never needs "Open another vault".
- The agent announces "**ready to reload**" only after doing its part:
  1. **Check the tree for vault churn** — Obsidian's own configuration in `example-vault/.obsidian/` (enabled plugins, theme, font size, workspace) is ignored (listed in `.gitignore`), so it does not show in `git status`. The one tracked file a CDP check can rewrite is the plugin's demo `example-vault/.obsidian/plugins/native-slides/data.json`; if `git status` shows it, put it back (`git restore -- example-vault/.obsidian/plugins/native-slides/data.json`) so `git switch` is never blocked. If the harness's permission guard refuses the restore, report it to the user instead of routing around it.
  2. **Verify** — run `npm run check` / `npm run test` / `npm run lint` / `npm run format:check` / `npm run build` and confirm `main.js` is in sync (`git diff --exit-code -- main.js`).
- `npm run dev` (esbuild watch) is only needed while **actively editing** `main.ts`; viewing a branch's behavior needs nothing but the switch + reload (each branch carries its own committed, in-sync `main.js`).

**Never drive the instance the human is working in.** A CDP capture or a `slide-visual-check` run belongs in the dedicated instance, never their own Obsidian — see [vault-cdp-testing](../vault-cdp-testing/SKILL.md) for the rule and the procedure.

## Workflow

### 1. Create / enter a branch (single checkout)

```sh
git switch -c feat/my-change
```

One feature at a time; the branch is based on the latest `main`.

### 2. Before opening a PR: merge the latest main

```sh
git fetch origin
git merge origin/main
```

- Resolve any merge conflicts, then verify locally.
- **Rebuild and test locally** before submitting (run from the repository root):

  ```sh
  npm ci               # first time only
  npm run check        # TypeScript type-check (tsc --noEmit)
  npm run test         # vitest unit tests
  npm run lint         # ESLint
  npm run format:check # Prettier
  npm run build        # the release build → the committed main.js
  npm run check:scanner # the community scanner's two passes
  ```

- Never open a PR that is behind or in conflict with `origin/main`.

### 3. Commit, push, open a PR

**Docs check (before committing):** if the change is user-visible, update the affected documentation **in the same commit** — `README.md` / `README-zh.md` (both languages), `docs/*.md`, and `CHANGELOG.md` ([Unreleased] section). Never commit code without its docs.

```sh
git add <files>                       # stage the files you changed, by name
git commit -m "type: short summary"   # conventional commits
git push -u origin feat/my-change
gh pr create --base main --head feat/my-change --title "..." --body "..."
```

Then run the review loop (step 4) straight away — by default no PR waits for a human to pick it up.

### 4. Review loop: a Herdr subagent runs `code-review-herdr` (one round)

The authoring agent never reviews its own work. A **round** is one review plus the fixes it produces, and there is exactly **one** of them; after it, the authoring agent merges the PR itself with **squash**. Mechanics: [../herdr-subagent/SKILL.md](../herdr-subagent/SKILL.md) (spawning the pane and driving the agent), [../code-review-herdr/SKILL.md](../code-review-herdr/SKILL.md) (the review itself and its per-axis panes). Three vendored skills still route a `/code-review` step (`ask-matt`, `implement`, `tdd`); in this repository those pointers resolve to `code-review-herdr`, because the vendored skill's parallel sub-agents assume a tool Pi does not have.

**Spec source.** `code-review-herdr` resolves it through `docs/agents/issue-tracker.md`; if that file is ever missing, the reviewer falls back to the PR description and the commit messages and says so in its findings. **Axis panes:** `code-review-herdr` spawns the Standards and Spec axes as two Herdr panes of its own (through `herdr-subagent`) and closes them once their reports are collected. Only outside Herdr, or when pane creation fails, does it run the two axes sequentially and say so — either way the findings stay separate per axis, never merged or re-ranked.

1. **Spawn the reviewer** — sibling pane in the current tab, repository root, no focus change, kind `pi`, synchronous:

   ```sh
   herdr pane split --current --direction right --cwd "$PWD" --no-focus   # read .result.pane.pane_id
   herdr agent start review-pr-<n> --kind pi --pane <pane-id>
   ```

2. **Review round** — prompt it to run the `code-review-herdr` skill over this PR with the `origin/main` merge-base as the fixed point. Require file:line + severity, **blockers separated from nits**, and the full findings written to a Markdown file so you can read them back. Give it a budget larger than the axes': the reviewer waits for both axis panes, each with its own 600 s wait, so its own timeout has to exceed theirs:

   ```sh
   herdr agent prompt review-pr-<n> "<self-contained review task>" --wait --timeout 1800000
   ```

3. **Publish the findings** — comment on the PR, labelled `review round 1`:

   ```sh
   gh pr comment <pr> --body-file <findings>.md
   ```

4. **Fix in that same subagent** — send the blockers back into the same pane. Never apply the fixes yourself in the main session, and never let two agents write the working tree at once. The subagent edits the tree and reports its diff; **you stay the only git writer** — review that diff, then commit and push it on the same branch:

   ```sh
   herdr agent prompt review-pr-<n> "Fix the blockers you reported: <list>. Touch nothing else." --wait --timeout 600000
   git add <files> && git commit -m "fix: address review round 1" && git push
   ```

5. **Re-verify** — the same checks as step 2 (before opening a PR), plus CI, then comment the round's outcome on the PR:

   ```sh
   npm run check && npm run test && npm run lint && npm run format:check && npm run build && npm run check:scanner
   git diff --exit-code -- main.js
   gh pr checks <pr> --watch
   ```

   **The six checks are not the whole re-verification when the PR touched behaviour.** A review fix is a change like any other, and the checks above are blind to it: they would pass on a fix that breaks the feature. So when the diff has behaviour that a unit test cannot reach — a drag, a click, a menu action, anything in a running Obsidian — re-run the PR's behavioural checks too, in `example-vault/` over CDP, following [../vault-cdp-testing/SKILL.md](../vault-cdp-testing/SKILL.md). That is not a formality: a review fix in this repository's own history moved a flag-clearing statement below a new early return, and the CDP suite caught the regression (a Mod+click selecting one slide instead of two) while the checks stayed green. Report the behavioural result in the round's PR comment alongside the checks, or say plainly that the change had no behaviour to re-check.

6. **Merge or stop** — merge only once no blocker is open. The `protect-main` ruleset requires a PR, allows **squash only** (linear history), forbids deleting or force-pushing `main`, and requires **no approving review**: for agent-authored PRs the loop plus green CI is the whole gate. Re-check the live rules with `gh api repos/<owner>/<repo>/rulesets` for the ids and `gh api repos/<owner>/<repo>/rulesets/<id>` for the rules, rather than trusting this text. Unless `build` and `scanner` are listed there as required status checks, nothing stops a merge while CI is still running, so waiting for `gh pr checks <pr> --watch` is your job. A repository role is also a bypass actor (`bypass_mode: pull_request`); that is inert while no approving review is required. Plain `--squash` only; then clean up: delete the local branch, sync, and close the review panes you spawned; the remote branch stays for the user ([§5](#5-after-the-pr-is-merged-delete-the-local-branch-sync-close-the-panes)).

   ```sh
   gh pr merge <pr> --squash
   ```

   - There is no second round: run **one** review, apply its fixes, and let step 5 plus the round's PR comment stand as the verification. Keep the fixes tight and scoped to the findings.
   - **A blocker still open after the fixes**: stop, leave the PR open, report the findings to the human. Never merge over an open blocker, and never start another review round to re-litigate it.
   - Report the round (findings + fixes + verdict) in the final summary and in the PR comment, and keep the reviewer pane open while the PR is open, so it can be inspected; closing it is part of the post-merge cleanup (§5), unless the user asked to keep it.

### 5. After the PR is merged: delete the local branch, sync, close the panes

After a merge the agent cleans up locally: the merged PR's **local** branch (the non-force `git branch -d`) and the Herdr panes it spawned for that PR's review. **Every remote ref stays the user's**, including the merged PR's own head branch.

```sh
git switch main
git branch -d <branch>       # that PR's local branch, non-force, and before anything prunes
git pull origin main         # sync to the latest main
herdr pane close <pane-id>   # each review pane you spawned, by the ID you recorded
```

**Order matters.** Delete the local branch first, while its upstream ref still exists. A squash-merged branch's commits are not ancestors of `main`, so for that case `git branch -d` can only pass through its other test — a merge-base check against `origin/<branch>` — and that ref is exactly what a prune removes. (Had the branch been a real ancestor of `main`, no tracking ref would be needed; the ordering rule is about the squash case, which is every PR here.) Expect this on every squash-merged branch:

```
warning: deleting branch 'x' that has been merged to
         'refs/remotes/origin/x', but not yet merged to HEAD
```

It is a **warning**, not an error (the delete succeeds, exit 0), and it names the ref that allowed it. Deleting the branch on GitHub does **not** remove the local remote-tracking ref; a prune does. So **never prune before the local delete** — prune first and `-d` refuses with "not fully merged", leaving only `-D`, which is refused for the agent. A bare `git fetch origin` prunes when `fetch.prune` (or `remote.<name>.prune`) is set — it is unset in this checkout today, so the hazard is conditional rather than live — and a bare fetch is part of this workflow's own step 2; a refspec-scoped fetch (`git fetch origin main`, `git pull origin main`) prunes only what its refspec covers. If `-d` reports "not fully merged", check **why** before asking anyone: `git log origin/<branch>..<branch>` shows unpushed commits, and in that case the `-D` a human would reach for discards work — report the commits instead of just the error.

The agent's deletions are exactly these: the non-force local `git branch -d <name>` / `--delete` for the branch of the PR it just merged, and closing the panes it created. These are normal steps and need no permission. Every other deletion of a ref is not the agent's: `git branch -D`, clustered `-fd`/`-rd`, `git tag -d`, `git tag --delete`, deleting any remote ref (`git push --delete` / `-d`, `git push origin :<ref>`), `gh pr merge --delete-branch` (it deletes the remote branch) and `gh api -X DELETE`. Re-pointing a tag is a separate, explicitly allowed step (§6). A local guard may refuse some of these and let others through, which is why this is a **policy** and not a deduction from what happens to be blocked. If the guard refuses one of the agent's own steps, report which branch or pane remains and stop; never route around a refusal.

**Remote refs are the user's.** The merged PR's head branch, tags and every other remote branch are left alone, and the user deletes them when they choose. Deleting a remote ref through the API (`gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/<branch>`) is off-limits as well: do not run it and do not hand it over as a step. Say which remote branches are still there and let the user decide.

### 6. Releasing (the maintainer merges, the agent tags)

A release is a Rule 1 PR that bumps the version, plus one step only the agent performs: **the tag**. The maintainer reviews and merges the release PR — the agent never self-merges it — and after it lands the agent syncs, tags and verifies.

**1. Bump every version site** (all five; `1.0.5` did this):

| Site                | Change                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `CHANGELOG.md`      | a fresh empty `## [Unreleased]` above `## [X.Y.Z] - <date>` (`date +%F`), so the existing entries become that version's section |
| `manifest.json`     | `"version": "X.Y.Z"`                                                                                                            |
| `package.json`      | `"version": "X.Y.Z"`                                                                                                            |
| `versions.json`     | `"X.Y.Z": "<minAppVersion>"` — the value must equal `manifest.json`'s `minAppVersion`                                           |
| `package-lock.json` | the root `version` and `packages[""].version` — `npm install --package-lock-only` does exactly those two and nothing else       |

Patch vs minor: read `[Unreleased]`. Only `### Fixed` (a bug-fix issue) → patch; anything `### Added`/`### Changed` a user would notice → minor. Agent tooling and docs changes do not appear in the CHANGELOG at all.

**2. Verify before opening the PR**

- the five sites agree, and `versions.json[version]` equals `minAppVersion`;
- `[Unreleased]` is genuinely empty and the new section is dated correctly;
- **Prettier first, then `npm run build`** (`npm run format` / `format:check`, then build) so the committed release `main.js` is not left stale — a version bump alone leaves `main.js` byte-identical, which is expected;
- the **five** checks: `check` / `test` / `lint` / `format:check` / `build`, plus `git diff --exit-code -- main.js`;
- simulate the workflow's own notes extraction, because a mistyped tag or heading fails the release job — the same `awk` program, with the tag substituted: `awk -v ver=X.Y.Z '/^## \[/ { if (found) exit; if ($0 ~ "\\[" ver "\\]") { found=1; next } } found { print }' CHANGELOG.md` must print the section. The `awk` alone exits 0 with empty output, so the workflow's real gate is the `[ ! -s release-notes.md ]` check right after it — an empty extraction is what fails the job;
- `npm run build:release` succeeds, run **from the repository root** (then `npm run build` to restore the committed release bundle, and confirm `git diff --exit-code -- main.js`). An out-of-repo `--outfile` produces a different bundle, because the inline sourcemap's `sources` are written relative to the output directory.

**3. PR and hand it over** — branch → PR → the maintainer reviews and merges. Say explicitly in the PR body that this is the step you are leaving to them; do not self-merge a release PR, and do not tag before it is merged. (This is Rule 2's one exception: the review loop still runs, the merge does not.)

**4. Tag `main`'s commit — not the release branch tip**

```sh
git switch main && git pull origin main
git tag <version> && git push origin <version>
```

The convention is a **lightweight** tag (`git tag <version>`, no `-a`, no `v` prefix) pushed on the commit at `main`'s tip — squash merging makes that the release commit, and this history has exactly one merge commit (`9db23e2`, untagged). Older tags are not all examples of it (`1.0.0` is annotated; `0.1.1` sits on a commit no branch contains), so this is the rule for new tags. Check it rather than assuming:

```sh
test "$(git rev-parse <version>^{commit})" = "$(git rev-parse main)" && echo "tag is on main"
```

Tagging from the release branch tip puts the tag on a commit outside `main` (release `1.0.5` shipped that way once): the trees happened to match, so the artifacts were identical, but `git log <version>` showed branch commits instead of the release commit, and plain `git describe` ignores lightweight tags anyway (it needs `--tags`), so the tag had to be re-pointed. Pushing the tag triggers [`.github/workflows/release.yml`](../../../.github/workflows/release.yml), which runs the checks, `build:release`, the provenance attestation and the release itself (three assets plus the CHANGELOG notes).

**5. Verify the chain, don't assume it**

- `gh run list` / `gh run watch <run-id>` — the Release workflow (checks → `build:release` → attestation → create release) must be `success`;
- `gh release view <version>` — three assets (`main.js`, `manifest.json`, `styles.css`), and `gh api repos/<owner>/<repo>/releases/latest` reports this version;
- download the published `manifest.json` and check its `version`;
- **prove the published bundle matches the source**: download the release's `main.js` and compare its `sha256` with a local `npm run build:release` run from the same tree — they are byte-identical, because the workflow builds from the tag and esbuild is deterministic for one lockfile. Report the hash, and **leave the committed release bundle in place** (`npm run build`, then `git diff --exit-code -- main.js`): the comparison writes the minified release artifact, and since `npm run build` _is_ the release build, that is exactly the state the tracked `main.js` must be in — the diff must be clean, and `npm run build:dev` is for a reload loop only.

**6. If the tag landed in the wrong place**, re-point it (the tree and artifacts do not change):

```sh
git tag -f <version> <main-sha>                                                   # local
gh api -X PATCH repos/<owner>/<repo>/git/refs/tags/<version> \
  -f sha=<main-sha> -F force=true                                                 # remote
```

`git push --force` cannot be used (the permission system denies `git push*--force*`), which is why the remote half goes through the API. Re-pointing a tag re-triggers CI and Release — expect **two runs for the same tag name**, the later one superseding the earlier; they rebuild from the identical tree and republish byte-identical assets, so the release stays valid. Verify it afterwards and say so. Re-pointing is the agent's to do (it is not a deletion); **deleting** a tag is not: `git tag -d <tag>`, `git tag --delete`, `git push origin --delete <tag>` and `git push origin :refs/tags/<tag>` are in the refused set and belong to the user. That is the same rule as for remote branches: a remote ref is the user's to delete (§5).

**7. The release is not finished at the GitHub release.** Obsidian's platform review picks the GitHub release up on its own schedule, and the community-store listing is a **human** step in the [community.obsidian.md](https://community.obsidian.md) console — say clearly which of the two is still open rather than reporting the release as shipped. If the tag does not trigger a workflow run at all (it has happened), an empty commit (`git commit --allow-empty`) on `main` is the maintainer's documented nudge.
