---
name: dev-workflow
description: Mandatory development workflow for this repository — single checkout, one branch at a time, merge latest main before PR, CLI-first, one independent Herdr-subagent code review round before squash-merging, reload-based preview loop, sync after merge (the user deletes the branch).
---

# Development Workflow (Rules 1 & 2)

This skill is the full specification of **Rule 1** and of the review loop in **Rule 2** in [AGENTS.md](../../../AGENTS.md). Every change to this repository MUST follow it. **Never commit directly to `main`.**

## Principles

- **CLI tools first.** Every step is driven by CLI tools (`git`, `gh`, `npm`).
- **Single checkout, one branch at a time.** All work happens in the one repository checkout; branches are created/switched with `git switch`. Features are developed **serially** — never parallel. No git worktrees.
- **No rebase.** Always `merge` the latest `main` into the branch and resolve conflicts explicitly. Never rewrite history with `rebase`.
- **Independent review, then squash-merge.** A PR is never reviewed by the agent that wrote it: a **separate agent in a Herdr pane** runs [`code-review-herdr`](../code-review-herdr/SKILL.md) over it, for exactly **one round**, after which the authoring agent may squash-merge its own PR once CI is green (step 4). This is the only path to a merge; skipping the loop, or merging before CI is green, is not allowed. The fixes are not re-reviewed — step 5's checks and the round's PR comment are what cover them — so keep them tight and scoped. A human may always take over the review instead — if the user asks to hold a PR for human review, hold it.

## Preview loop (no restart, no hot-reload plugin)

`example-vault/` is the **only** vault anything here may be tested against — never another vault, and never the maintainer's notes vault ([AGENTS.md](../../AGENTS.md) Rule 3, and [docs/development.md](../../docs/development.md#testing-in-the-example-vault) for the full loop).

The human opens **`example-vault/`** in Obsidian **once** and never needs to reopen it:

- After a **branch switch** or a **code change**, the human reloads with: `Cmd/Ctrl+P` → **Reload app without saving** (this reloads the whole vault in place — notes, config and plugins — per the official "Build a plugin" docs). The vault folder never changes, so Obsidian never needs "Open another vault".
- The agent announces "**ready to reload**" only after doing its part:
  1. **Clean Obsidian runtime noise** — Obsidian rewrites `example-vault/.obsidian/` configs (`core-plugins.json`, `community-plugins.json`, …) while running; revert those (`git checkout -- example-vault/.obsidian/`) so `git switch` is never blocked by a dirty tree.
  2. **Verify** — run `npm run check` / `npm run test` / `npm run lint` / `npm run format:check` / `npm run build` and confirm `main.js` is in sync (`git diff --exit-code -- main.js`).
- `npm run dev` (esbuild watch) is only needed while **actively editing** `main.ts`; viewing a branch's behavior needs nothing but the switch + reload (each branch carries its own committed, in-sync `main.js`).

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
  npm run build        # compile main.ts → main.js
  ```

- Never open a PR that is behind or in conflict with `origin/main`.

### 3. Commit, push, open a PR

**Docs check (before committing):** if the change is user-visible, update the affected documentation **in the same commit** — `README.md` / `README-zh.md` (both languages), `docs/*.md`, and `CHANGELOG.md` ([Unreleased] section). Never commit code without its docs.

```sh
git add -A
git commit -m "type: short summary"   # conventional commits
git push -u origin feat/my-change
gh pr create --base main --head feat/my-change --title "..." --body "..."
```

Then run the review loop (step 4) straight away — by default no PR waits for a human to pick it up.

### 4. Review loop: a Herdr subagent runs `code-review-herdr` (one round)

The authoring agent never reviews its own work. A **round** is one review plus the fixes it produces, and there is exactly **one** of them; after it, the authoring agent merges the PR itself with **squash**. Mechanics: [../herdr-subagent/SKILL.md](../herdr-subagent/SKILL.md) (spawning the pane and driving the agent), [../code-review-herdr/SKILL.md](../code-review-herdr/SKILL.md) (the review itself and its per-axis panes). Three vendored skills still route a `/code-review` step (`ask-matt`, `implement`, `tdd`); in this repository those pointers resolve to `code-review-herdr`, because the vendored skill's parallel sub-agents assume a tool Pi does not have.

**Precondition — `docs/agents/issue-tracker.md`.** The `code-review-herdr` skill resolves its spec source through that file. While it is missing, the reviewer runs the Spec axis against the PR description and the commit messages instead, says so in its findings, and reports that the human must run `/setup-matt-pocock-skills` once. **Axis panes:** `code-review-herdr` spawns the Standards and Spec axes as two Herdr panes of its own (through `herdr-subagent`) and closes them once their reports are collected. Only outside Herdr, or when pane creation fails, does it run the two axes sequentially and say so — either way the findings stay separate per axis, never merged or re-ranked.

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
   git add -A && git commit -m "fix: address review round 1" && git push
   ```

5. **Re-verify** — the same checks as step 2 (before opening a PR), plus CI, then comment the round's outcome on the PR:

   ```sh
   npm run check && npm run test && npm run lint && npm run format:check && npm run build
   git diff --exit-code -- main.js
   gh pr checks <pr> --watch
   ```

6. **Merge or stop** — merge only once no blocker is open. The `protect-main` ruleset requires a PR, allows **squash only** (linear history), and requires **no approving review** — for agent-authored PRs the loop plus green CI is the whole gate — but CI is not a required status check, so waiting for it is your job. Plain `--squash` only; then sync (`git switch main` → `git pull origin main`) and hand the branch deletion to the user — nothing about a branch is yours to remove ([§5](#5-after-the-pr-is-merged-the-branch-deletion-is-the-users)).

   ```sh
   gh pr merge <pr> --squash
   ```

   - There is no second round: run **one** review, apply its fixes, and let step 5 plus the round's PR comment stand as the verification. Keep the fixes tight and scoped to the findings.
   - **A blocker still open after the fixes**: stop, leave the PR open, report the findings to the human. Never merge over an open blocker, and never start another review round to re-litigate it.
   - Report the round (findings + fixes + verdict) in the final summary and in the PR comment, and leave the reviewer pane open for inspection unless the user asks to close it.

### 5. After the PR is merged: the branch deletion is the user's

The agent syncs; the user deletes. Nothing about a branch is the agent's to remove — not the remote one, and not the local one either, because the guard refuses `git branch -d` just as hard as `gh pr merge --delete-branch`:

```sh
git switch main
git pull origin main      # sync to the latest main; leave the branch alone
```

Every git/gh deletion form is refused outright by the guard (`git branch -d/-D`, `git branch --delete`, `git tag -d`, `git tag --delete`, `git push -d`, `git push --delete`, `git push origin :<branch>`, `gh pr merge --delete-branch`), with no authorization path in the hook — its deny text invites 先取得用户明确授权 ("first obtain the user's explicit authorization", a translation of the guard's Chinese), but no authorized retry can ever pass, so never attempt one and never route around it. `gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/<branch>` is the one form the hook does not classify as a ref deletion; it stays off-limits **by standing instruction** anyway, because the user deletes branches themselves — do not run it and do not hand it over as a step.

**What to hand the user** (their commands, in this order):

```sh
git switch main && git pull origin main
git branch -d <branch>                                            # local — before anything prunes
git fetch --prune                                                 # only after the local delete
```

**Why that order, and what their warning means.** After a squash merge the PR branch's commits are not ancestors of `main`, so `git branch -d` can only pass through its other test: a merge-base check against the branch's upstream, `origin/<branch>`. Hence this, for every squash-merged branch while that tracking ref exists:

```
warning: deleting branch 'x' that has been merged to
         'refs/remotes/origin/x', but not yet merged to HEAD
```

It is a **warning**, not an error (the delete succeeds, exit 0), and it names the ref that allowed it. Deleting the branch on GitHub does **not** remove the local remote-tracking ref — only a prune does — so that ref is what lets `-d` pass, and the order cannot be inverted: prune first and `-d` refuses with "not fully merged", leaving only `-D`, which skips the safety check and is itself in the refused set.

**Never prune on the user's behalf before they have run their local `git branch -d`.** A bare `git fetch origin` prunes when `fetch.prune` — or `remote.<name>.prune` — is set, and a bare fetch is part of this workflow's own step 2, so it can drop `origin/<branch>` long before they get to it and turn their `-d` into a `-D`. A refspec-scoped fetch (`git fetch origin main`, `git pull origin main`) prunes only what its refspec covers, so the sync above is safe.

The guard's other half governs merge and commit text: for delete intent a delete verb in command position or a whole-word `-delete`/`--delete` is refused when the command resolves to a protected path, and because the guard tokenizes the command, quotes change nothing for it; a heredoc body is ordinary shell text, so a command-shaped body line is refused unless the body is itself inside quotes — write such a commit message to a file and use `git commit -F <path>`. Details: the `AGENTS.md` harness note.
