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
6. **Merge or stop** — `gh pr merge <pr> --squash`; branch deletion is handed to the user (see the harness note below). If a blocker is still open after the fixes, stop, leave the PR open, and hand it to the human with the findings; never merge over an open blocker. There is no second review: the fixes are covered by step 5 and by the round's PR comment, so a blocker found inside a fix means the PR goes to the human, not around the loop again.

**Merge gate — the `protect-main` ruleset on the default branch** (snapshot verified 2026-09-10; re-check with `gh api repos/<owner>/<repo>/rulesets`):

- A pull request is **required**: no direct pushes to `main`, no force-push, and no deletion of `main`.
- **Squash is the only allowed merge method**, and history must stay linear.
- **No approving review is required** for agent-authored PRs — the review loop plus green CI _is_ the gate, which is what lets the authoring agent merge its own PR. Human contributions keep the maintainer-review rule in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- CI is **not** a required status check either, so nothing technically stops a merge while it is still running: wait for `gh pr checks <pr> --watch` yourself, every time.
- `bypass_actors` also lists a repository role with `bypass_mode: pull_request` (the API gives `actor_type: RepositoryRole` and a numeric `actor_id`, no name): `current_user_can_bypass: pull_requests_only` means that identity may merge without meeting the PR-rule conditions — inert while `required_approving_review_count` is 0, so the loop is unchanged.

**Harness note — branch deletion is the user's call:** the global `PreToolUse` guard, `~/.pi/scripts/rm-protect.py` (wired in `~/.pi/agent/settings.json` for the `bash` tool), carries two relevant rules — not repository policy, and not the permission system, whose **git rules** are `git branch -D*`, `git tag -d*`, `git push*--force*`, `git reset --hard*` and `git clean -f*`:

1. **Branch / reference deletion is refused outright**: `git branch -d/-D`, `git branch --delete`, `git tag -d`, `git tag --delete`, `git push -d`, `git push --delete`, `git push origin :<branch>` and `gh pr merge --delete-branch` are denied before they run, with no authorization path in the hook — its deny text invites 先取得用户明确授权 ("first obtain the user's explicit authorization", a translation of the guard's Chinese), but no authorized retry can ever pass, so never attempt one. None of these needs a path: the guard attaches ref intent wherever the form appears, including to a command-shaped line of a heredoc body. Ask the user **before** deleting any branch, and when they want to run it themselves, hand them these commands (they are the **user's** commands — the agent runs only `gh pr merge <pr> --squash`):

   ```sh
   git switch main                                                        # leave the branch first
   git branch -d <branch>                                                 # local, while its upstream ref still exists
   git pull origin main                                                   # sync to the latest main
   gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/<branch>          # remote branch
   git fetch --prune                                                      # drop the remote-tracking ref
   ```

   Do not route around the refusal: this repository does not delete branches on merge, so the remote step is required rather than optional, and the REST form above does run because the guard attaches no ref intent to it, but deleting the remote branch is still the user's decision, so ask first. Never retry a refused deletion, and never `--delete-branch`. On why the local delete comes first, and on "not fully merged" (`-D` is part of the same refused set), see [`dev-workflow` §5](.agents/skills/dev-workflow/SKILL.md#5-after-the-pr-is-merged-clean-up-and-sync).

2. **Delete-verb text needs a protected path**: a delete verb in command position (`rm`, `shred`, …) or a whole-word delete flag (`find . -delete`, `rsync --delete`) is denied when the command resolves to a protected path (anything outside `~/notebase`, minus its scratch/cache paths — and it refuses when no target can be resolved either). The guard tokenizes the command and judges the command-position word plus whole-word flags, so for delete intent quotes change nothing — `"rm" -rf <path>` is still refused. A heredoc body is tokenized as ordinary shell text, so a body line that is itself a command (one headed by `rm`, a whole-word `-delete` or `--delete`) is refused — unless that body is itself inside quotes, where it is a single token and slips through — while prose that merely names the flag inside another token is not: write such a message to a file and commit it with `git commit -F <path>`. Read-only text is unaffected (`rg -n shred docs/development.md` is fine). Merge with a plain `gh pr merge <pr> --squash`.

**Precondition:** `code-review-herdr` resolves its spec source through `docs/agents/issue-tracker.md`. While that file is missing, the reviewer runs the Spec axis against the PR description and the commits, says so in its findings, and tells the human to run `/setup-matt-pocock-skills` once to record this repository's tracker.

**Axis panes:** `code-review-herdr` runs its Standards and Spec axes as **two Herdr panes of its own** (spawned through `herdr-subagent`, then closed once their reports are collected — that standing instruction is in the skill). Only if the reviewer pane is not inside Herdr, or pane creation fails, does it run the two axes sequentially and say so; either way the findings stay separate per axis — never merged or re-ranked.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md#4-review-loop-a-herdr-subagent-runs-code-review-herdr-one-round)

## Agent skills

`.agents/skills/` holds both the repository's own skills — `dev-workflow` (Rules 1 and 2), `herdr-subagent` (the Herdr mechanics Rule 2 uses) and `code-review-herdr` (this repository's fork of the vendored `code-review`, adapted to run each review axis in its own Herdr pane) — and the 25 published [mattpocock/skills](https://github.com/mattpocock/skills) (grilling a plan, test-first implementation, code review, debugging loops, handoffs). Read the matching `SKILL.md` before starting that kind of work instead of improvising a process. Layout, update commands and the `skills-lock.json` hash trail are documented in [docs/development.md](docs/development.md#agent-skills).
