# AGENTS.md — Agent Operating Rules

Rules that agents (AI or human) MUST follow when working in this repository. Detailed specifications live in the `.agents/skills/` directory; each rule below links to its skill.

## Rule 1 — Development workflow (CLI-first)

Every change must follow the **branch → PR → CI → review loop → merge → cleanup** workflow, driven entirely by CLI tools. Never commit directly to `main`. Before every commit, confirm that all documentation affected by the change (`README.md` / `README-zh.md`, `docs/`, `CHANGELOG.md`) is updated in the same commit — never ship code without its docs.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md)

## Rule 2 — Every PR is reviewed by a Herdr subagent, then merged (one round)

An agent never reviews its own work, and no longer waits for a human to merge it: the review loop below replaces the human merge gate. A **round** is one review plus the fixes it produces; there is exactly **one round**, after which — with CI green and the local checks passing — the authoring agent merges its own PR with **squash**. The fixes are not re-reviewed: step 5's checks and a clear PR comment are what verify them, so keep them tight and scoped to the findings. A human may always take over the review instead — if the user asks to hold a PR for human review, hold it.

1. **Spawn a reviewer** in a Herdr pane — sibling pane, repository root, no focus change, agent kind `pi`, synchronous — following [.agents/skills/herdr-subagent/SKILL.md](.agents/skills/herdr-subagent/SKILL.md).
2. **Review** — prompt that subagent to run this repository's [`code-review-herdr`](.agents/skills/code-review-herdr/SKILL.md) skill over the PR, with the `origin/main` merge-base as the fixed point. It is the fork that spawns each axis in its own Herdr pane; the vendored `code-review` assumes a native sub-agent tool Pi does not have, so it is not what Rule 2 uses. Require file:line + severity, **blockers separated from nits**, and a Markdown artifact to read back.
3. **Publish** — post the findings as a PR comment (`gh pr comment <pr> --body-file …`), labelled `review round 1`.
4. **Fix in that same subagent** — send the blockers back into the pane; never fix the findings yourself in the main session, and never let two agents write the tree at once. The subagent edits the working tree and reports its diff; **the orchestrating agent stays the only git writer** and commits/pushes that diff.
5. **Re-verify** — `npm run check` / `test` / `lint` / `format:check` / `build`, `git diff --exit-code -- main.js`, then `gh pr checks <pr> --watch` until CI is green, then comment the round's outcome on the PR — findings, fixes and verdict.
6. **Merge or stop** — `gh pr merge <pr> --squash`, then clean up: sync and delete the **local** branch (`git switch main` → `git branch -d <branch>`, before anything prunes → `git pull origin main`). The **remote** branch is the user's: never delete a remote ref, never prune ahead of your own local delete, and never hand over a command that would (see the harness note below). If a blocker is still open after the fixes, stop, leave the PR open, and hand it to the human with the findings; never merge over an open blocker. There is no second review: the fixes are covered by step 5 and by the round's PR comment, so a blocker found inside a fix means the PR goes to the human, not around the loop again.

**Merge gate — the `protect-main` ruleset on the default branch** (snapshot verified 2026-09-10; re-check with `gh api repos/<owner>/<repo>/rulesets`):

- A pull request is **required**: no direct pushes to `main`, no force-push, and no deletion of `main`.
- **Squash is the only allowed merge method**, and history must stay linear.
- **No approving review is required** for agent-authored PRs — the review loop plus green CI _is_ the gate, which is what lets the authoring agent merge its own PR. Human contributions keep the maintainer-review rule in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- CI is **not** a required status check either, so nothing technically stops a merge while it is still running: wait for `gh pr checks <pr> --watch` yourself, every time.
- `bypass_actors` also lists a repository role with `bypass_mode: pull_request` (the API gives `actor_type: RepositoryRole` and a numeric `actor_id`, no name): `current_user_can_bypass: pull_requests_only` means that identity may merge without meeting the PR-rule conditions — inert while `required_approving_review_count` is 0, so the loop is unchanged.

**Harness note — branch deletion: local is the agent's, remote is the user's:** the global `PreToolUse` guard, `~/.pi/scripts/rm-protect.py` (wired in `~/.pi/agent/settings.json` for the `bash` tool), carries two relevant rules — not repository policy, and not the permission system, whose **git rules** are `git branch -D*`, `git tag -d*`, `git push*--force*`, `git reset --hard*` and `git clean -f*`:

1. **Branch deletion is split — the agent deletes the local branch, the user deletes the remote one**: the guard allows the non-force local `git branch -d <name>` / `git branch --delete <name>` and denies the ones that lose or move a ref (`git branch -D`, clustered `-fd`/`-rd`, `git tag -d`, `git tag --delete`, `git push -d`, `git push --delete`, `git push origin :<branch>`, `gh pr merge --delete-branch`) before they run, with no authorization path in the hook. The whitelisted non-force delete is a normal step — do not ask for permission for it — and the denied forms are never to be attempted or routed around. It is not airtight (`git branch -f`, `git branch -d -r origin/<branch>`, `git push --prune`, `git update-ref -d` and a command hidden inside `$(…)` all pass), which is why this is stated as **policy** rather than deduced from what happens to be blocked. In the forms it does recognise it needs no path: a command-shaped heredoc body line is caught too.

   **What the agent does after a merge** (order matters — for a squash-merged branch the non-force delete passes only while `origin/<branch>` exists):

   ```sh
   git switch main
   git branch -d <branch>    # non-force, before anything prunes
   git pull origin main      # sync to the latest main
   ```

   If `-d` reports "not fully merged", find out why before asking anyone: `git log origin/<branch>..<branch>` lists unpushed commits (and the `-D` a human would reach for would discard them), while an empty result means the tracking ref is already gone and only they can finish it.

   **Remote branches stay the user's.** `gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/<branch>` is the one form the hook does not classify as a ref deletion, so it would run; it stays off-limits **by standing instruction** — the user deletes remote branches themselves, so do not run it and do not hand it over as a step. Mention which remote branches are still there and let them handle those.

   Never prune before the local delete: a bare `git fetch origin` prunes when `fetch.prune` (or `remote.<name>.prune`) is set — unset in this checkout today, so the hazard is conditional — and a bare fetch is this workflow's own step 2, so it would drop `origin/<branch>`, the ref the delete depends on. A refspec-scoped fetch (`git fetch origin main`, `git pull origin main`) prunes only what its refspec covers, so the sync above is safe. The warning the delete prints, and why the order cannot be inverted, are in [`dev-workflow` §5](.agents/skills/dev-workflow/SKILL.md#5-after-the-pr-is-merged-local-delete-then-sync).

2. **Delete-verb text needs a protected path**: a delete verb in command position (`rm`, `shred`, …) or a whole-word delete flag (`find . -delete`, `rsync --delete`) is denied when the command resolves to a protected path (anything outside `~/notebase`, minus its scratch/cache paths — and it refuses when no target can be resolved either). The guard tokenizes the command and judges the command-position word plus whole-word flags, so for delete intent quotes change nothing — `"rm" -rf <path>` is still refused. A heredoc body is tokenized as ordinary shell text, so a body line that is itself a command (one headed by `rm`, a whole-word `-delete` or `--delete`) is refused — unless that body is itself inside quotes, where it is a single token and slips through — while prose that merely names the flag inside another token is not: write such a message to a file and commit it with `git commit -F <path>`. Read-only text is unaffected (`rg -n shred docs/development.md` is fine). Merge with a plain `gh pr merge <pr> --squash`.

**Precondition:** `code-review-herdr` resolves its spec source through `docs/agents/issue-tracker.md`. While that file is missing, the reviewer runs the Spec axis against the PR description and the commits, says so in its findings, and tells the human to run `/setup-matt-pocock-skills` once to record this repository's tracker.

**Axis panes:** `code-review-herdr` runs its Standards and Spec axes as **two Herdr panes of its own** (spawned through `herdr-subagent`, then closed once their reports are collected — that standing instruction is in the skill). Only if the reviewer pane is not inside Herdr, or pane creation fails, does it run the two axes sequentially and say so; either way the findings stay separate per axis — never merged or re-ranked.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md#4-review-loop-a-herdr-subagent-runs-code-review-herdr-one-round)

## Rule 3 — Test in `example-vault/`, never in another vault

Every behavioural check runs against the repository's own **`example-vault/`** — never against another vault, and in particular never against the maintainer's notes vault, which holds real notes. `example-vault/` is wired to the repository root with symlinks, so it always runs the build you just made and `npm run build` plus a plugin reload is the whole loop.

- Create scratch notes inside `example-vault/` when a check needs them, and remove them when you are done. The `Probe*.md` / `test.md` / `untitled-slides.md` slides and the `tests/typography-*.md` fixtures are **not yours to delete** (`src/debug.ts` hard-codes five of those fixture names).
- Obsidian rewrites the vault's tracked configuration while it runs (`appearance.json`, `community-plugins.json`, `core-plugins.json`): `git restore -- example-vault/.obsidian` before switching branches or opening a PR, and re-check `git status` afterwards.
- Driving the running app is fine — for example over CDP with `--remote-debugging-port=9222` — and this rule is what limits which vault it may touch.

**Full instructions:** [docs/development.md#testing-in-the-example-vault](docs/development.md#testing-in-the-example-vault)

## Rule 4 — Releases: the maintainer merges, the agent tags

A release is a Rule 1 PR that bumps the version, plus one step only the agent performs: **tagging**. The release PR is the **one PR type the agent does not self-merge** — Rule 2's review loop still runs on it, but the maintainer reviews and merges it. Once it has landed the agent syncs `main`, pushes the tag itself (`git tag <version> && git push origin <version>`) and verifies the published chain, which ends where humans take over: the platform's review and the community-store listing.

- **Tag `main`'s commit, never the release branch tip.** Sync (`git switch main` → `git pull origin main`) and check `git rev-parse <version>^{commit}` equals `git rev-parse main`. Squash-only history means that commit is the release commit, not a merge commit; release `1.0.5` was cut from the branch tip once and had to be re-pointed ([§6](.agents/skills/dev-workflow/SKILL.md#6-releasing-the-maintainer-merges-the-agent-tags)).
- **Creating and re-pointing a tag is the agent's; deleting one is the user's** — unlike the local branch half, which the agent does delete (`git branch -d`), tag deletion and every remote-ref form are refused: `git tag -d`, `git push --delete` and `git push origin :<ref>` are in the refused set of the harness note under Rule 2.
- **Verifying is part of the job**, not a courtesy: the Release workflow's conclusion, the release's assets and Latest marker, the published `manifest.json`, and the published `main.js` byte-identical to a local `build:release` of the same tree. A merged GitHub release is **not** the end of a release — see §6 steps 5 and 7.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md#6-releasing-the-maintainer-merges-the-agent-tags)

## Agent skills

`.agents/skills/` holds both the repository's own skills — `dev-workflow` (Rules 1, 2 and 4), `herdr-subagent` (the Herdr mechanics Rule 2 uses) and `code-review-herdr` (this repository's fork of the vendored `code-review`, adapted to run each review axis in its own Herdr pane) — and the 25 published [mattpocock/skills](https://github.com/mattpocock/skills) (grilling a plan, test-first implementation, code review, debugging loops, handoffs). Read the matching `SKILL.md` before starting that kind of work instead of improvising a process. Layout, update commands and the `skills-lock.json` hash trail are documented in [docs/development.md](docs/development.md#agent-skills).

### Issue tracker

Issues live in this repo's GitHub Issues, driven by the `gh` CLI. See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).

### Triage labels

The five canonical triage roles, each label string equal to its role name (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See [docs/agents/triage-labels.md](docs/agents/triage-labels.md).

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See [docs/agents/domain.md](docs/agents/domain.md).
