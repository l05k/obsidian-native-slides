---
name: dev-workflow
description: Mandatory development workflow for this repository — single checkout, one branch at a time, merge latest main before PR, CLI-first, an independent Herdr-subagent code review (max 2 rounds) before squash-merging, reload-based preview loop, cleanup after merge.
---

# Development Workflow (Rules 1 & 2)

This skill is the full specification of **Rule 1** and of the review loop in **Rule 2** in [AGENTS.md](../../../AGENTS.md). Every change to this repository MUST follow it. **Never commit directly to `main`.**

## Principles

- **CLI tools first.** Every step is driven by CLI tools (`git`, `gh`, `npm`).
- **Single checkout, one branch at a time.** All work happens in the one repository checkout; branches are created/switched with `git switch`. Features are developed **serially** — never parallel. No git worktrees.
- **No rebase.** Always `merge` the latest `main` into the branch and resolve conflicts explicitly. Never rewrite history with `rebase`.
- **Independent review, then squash-merge.** A PR is never reviewed by the agent that wrote it: a **separate agent in a Herdr pane** runs [`code-review`](../code-review/SKILL.md) over it, for at most **two rounds**, after which the authoring agent may squash-merge its own PR once CI is green (step 4). This is the only path to a merge; skipping the loop, or merging before CI is green, is not allowed. A human may always take over the review instead — if the user asks to hold a PR for human review, hold it.

## Preview loop (no restart, no hot-reload plugin)

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

### 4. Review loop: a Herdr subagent runs `code-review` (max 2 rounds)

The authoring agent never reviews its own work. A **round** is one review plus the fixes it produces; after **at most two rounds**, the authoring agent merges the PR itself with **squash**. Mechanics: [../herdr-subagent/SKILL.md](../herdr-subagent/SKILL.md) (spawning the pane and driving the agent), [../code-review-herdr/SKILL.md](../code-review-herdr/SKILL.md) (the review itself and its per-axis panes).

**Precondition — `docs/agents/issue-tracker.md`.** The `code-review-herdr` skill resolves its spec source through that file. While it is missing, the reviewer runs the Spec axis against the PR description and the commit messages instead, says so in its findings, and reports that the human must run `/setup-matt-pocock-skills` once. **Axis panes:** `code-review-herdr` spawns the Standards and Spec axes as two Herdr panes of its own (through `herdr-subagent`) and closes them once their reports are collected. Only outside Herdr, or when pane creation fails, does it run the two axes sequentially and say so — either way the findings stay separate per axis, never merged or re-ranked.

1. **Spawn the reviewer** — sibling pane in the current tab, repository root, no focus change, kind `pi`, synchronous:

   ```sh
   herdr pane split --current --direction right --cwd "$PWD" --no-focus   # read .result.pane.pane_id
   herdr agent start review-pr-<n> --kind pi --pane <pane-id>
   ```

2. **Review round** — prompt it to run the `code-review-herdr` skill over this PR with the `origin/main` merge-base as the fixed point. Require file:line + severity, **blockers separated from nits**, and the full findings written to a Markdown file so you can read them back:

   ```sh
   herdr agent prompt review-pr-<n> "<self-contained review task>" --wait --timeout 600000
   ```

3. **Publish the findings** — comment on the PR, labelled with the round number:

   ```sh
   gh pr comment <pr> --body-file <findings>.md
   ```

4. **Fix in that same subagent** — send the blockers back into the same pane. Never apply the fixes yourself in the main session, and never let two agents write the working tree at once. The subagent edits the tree and reports its diff; **you stay the only git writer** — review that diff, then commit and push it on the same branch:

   ```sh
   herdr agent prompt review-pr-<n> "Fix the blockers you reported: <list>. Touch nothing else." --wait --timeout 600000
   git add -A && git commit -m "fix: address review round <n>" && git push
   ```

5. **Re-verify** — the same checks as step 2, plus CI, then comment the round's outcome on the PR:

   ```sh
   npm run check && npm run test && npm run lint && npm run format:check && npm run build
   git diff --exit-code -- main.js
   gh pr checks <pr> --watch
   ```

6. **Merge or stop** — merge only once no blocker is open. The `protect-main` ruleset requires a PR, allows **squash only** (linear history), and requires **no approving review** — for agent-authored PRs the loop plus green CI is the whole gate — but CI is not a required status check, so waiting for it is your job. Plain `--squash` only: `--delete-branch` is refused before `gh` runs by the global `rm-protect.py` `PreToolUse` guard, not by repository policy (see §5, _clean up and sync_).

   ```sh
   gh pr merge <pr> --squash
   ```

   - Run a second round when the first round's fixes need independent verification; two rounds is the ceiling, not a target.
   - **A blocker still open after two rounds**: stop, leave the PR open, report the findings to the human. Never merge over an open blocker.
   - Report every round (findings + fixes + verdict) in the final summary, and leave the reviewer pane open for inspection unless the user asks to close it.

### 5. After the PR is merged: clean up and sync

Delete the local branch **before** any `git fetch --prune` — the tracking ref is what keeps `git branch -d` working after a squash merge:

```sh
git switch main
git pull origin main                          # sync to the latest main
git branch -d feat/my-change                  # delete the local branch
```

If `git branch -d` still reports "not fully merged", stop and ask the human: the fallback `git branch -D` is denied by the permission policy.

`gh pr merge --delete-branch` cannot be used here: this is an environment guard, not repository policy. A global `PreToolUse` hook, `~/.pi/scripts/rm-protect.py` (wired in `~/.pi/agent/settings.json` for the `bash` tool), denies any bash command whose text matches a delete verb — its `-delete\b` pattern matches the substring inside `--delete-branch` (and inside `origin --delete`) — when the command resolves to a protected path (anything outside `~/notebase`, minus its scratch/cache paths — and it refuses when no target can be resolved). It fires before `gh` runs, so nothing is deleted, locally or remotely. It strips quoted spans before matching, so it trips on an unquoted `--delete-branch` / `origin --delete` token, and on a heredoc body, which is not quote-stripped — exactly how a commit message written as a heredoc gets refused. Pass the message as a file instead (`git commit -F <path>`). This repository does not delete branches on merge, so delete the remote branch explicitly, then drop the remote-tracking ref:

```sh
gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/feat/my-change   # remote branch
git fetch --prune
```
