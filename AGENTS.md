# AGENTS.md — Agent Operating Rules

Rules that agents (AI or human) MUST follow when working in this repository. Detailed specifications live in the `.agents/skills/` directory; each rule below links to its skill.

## Rule 1 — Development workflow (CLI-first)

Every change must follow the **branch → PR → CI → review loop → merge → cleanup** workflow, driven entirely by CLI tools. Never commit directly to `main`. Before every commit, confirm that all documentation affected by the change (`README.md` / `README-zh.md`, `docs/`, `CHANGELOG.md`) is updated in the same commit — never ship code without its docs.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md)

## Rule 2 — Every PR is reviewed by a Herdr subagent, then merged (max 2 rounds)

An agent never reviews its own work, and no longer waits for a human to merge it: the review loop below replaces the human merge gate. A **round** is one review plus the fixes it produces; after **at most two rounds**, with CI green and the local checks passing, the authoring agent merges its own PR with **squash**. A human may always take over the review instead — if the user asks to hold a PR for human review, hold it.

1. **Spawn a reviewer** in a Herdr pane — sibling pane, repository root, no focus change, agent kind `pi`, synchronous — following [.agents/skills/herdr-subagent/SKILL.md](.agents/skills/herdr-subagent/SKILL.md).
2. **Review** — prompt that subagent to run this repository's [`code-review-herdr`](.agents/skills/code-review-herdr/SKILL.md) skill over the PR, with the `origin/main` merge-base as the fixed point. It is the fork that spawns each axis in its own Herdr pane; the vendored `code-review` assumes a native sub-agent tool Pi does not have, so it is not what Rule 2 uses. Require file:line + severity, **blockers separated from nits**, and a Markdown artifact to read back.
3. **Publish** — post the findings as a PR comment (`gh pr comment <pr> --body-file …`), labelled with the round number.
4. **Fix in that same subagent** — send the blockers back into the pane; never fix the findings yourself in the main session, and never let two agents write the tree at once. The subagent edits the working tree and reports its diff; **the orchestrating agent stays the only git writer** and commits/pushes that diff.
5. **Re-verify** — `npm run check` / `test` / `lint` / `format:check` / `build`, `git diff --exit-code -- main.js`, then `gh pr checks <pr> --watch` until CI is green.
6. **Merge or stop** — `gh pr merge <pr> --squash`; branch deletion is handed to the user (see the harness note below). If a blocker is still open after two rounds, stop, leave the PR open, and hand it to the human with the findings; never merge over an open blocker.

**Merge gate — the `protect-main` ruleset on the default branch** (snapshot verified 2026-09-10; re-check with `gh api repos/<owner>/<repo>/rulesets`):

- A pull request is **required**: no direct pushes to `main`, no force-push, and no deletion of `main`.
- **Squash is the only allowed merge method**, and history must stay linear.
- **No approving review is required** for agent-authored PRs — the review loop plus green CI _is_ the gate, which is what lets the authoring agent merge its own PR. Human contributions keep the maintainer-review rule in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- CI is **not** a required status check either, so nothing technically stops a merge while it is still running: wait for `gh pr checks <pr> --watch` yourself, every time.
- `bypass_actors` also lists a repository role with `bypass_mode: pull_request` (the API gives `actor_type: RepositoryRole` and a numeric `actor_id`, no name): `current_user_can_bypass: pull_requests_only` means that identity may merge without meeting the PR-rule conditions — inert while `required_approving_review_count` is 0, so the loop is unchanged.

**Harness note — branch deletion is the user's call:** the global `PreToolUse` guard, `~/.pi/scripts/rm-protect.py` (wired in `~/.pi/agent/settings.json` for the `bash` tool), carries two relevant rules — not repository policy, and not the permission system (whose only git rule is `git branch -D*`):

1. **Branch / reference deletion is refused outright**: `git branch -d/-D`, `git tag -d`, `git push --delete`, `git push origin :ref` and `gh pr merge --delete-branch` are denied before they run, with no authorization path in the hook. Ask the user **before** deleting any branch, and when they want to do it themselves, hand them exactly these commands:

   ```sh
   git switch main && git pull origin main
   git branch -d <branch>                                                # local
   gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/<branch>         # remote
   git fetch --prune
   ```

   Do not route around the refusal: the REST form above does run because the pattern does not classify it as a ref deletion, but deleting the remote branch is still the user's decision, so ask first. Never retry a refused deletion, and never `--delete-branch`. Delete the local branch **before** any `git fetch --prune` — the tracking ref is what keeps `git branch -d` working after a squash merge — and if `-d` reports "not fully merged", stop and ask the human rather than reaching for `-D`.

2. **Delete-verb text needs a protected path**: a delete verb (`rm`, `find -delete`, `shred`, …) is denied when the command resolves to a protected path (anything outside `~/notebase`, minus its scratch/cache paths — and it refuses when no target can be resolved either). The guard strips quoted spans before matching, so it trips on an unquoted token or on a heredoc body, which is not quote-stripped: that is how a commit message written as a heredoc gets refused. Pass such messages as a file (`git commit -F <path>`) and keep that prose off the command line. Merge with a plain `gh pr merge <pr> --squash`.

**Precondition:** `code-review-herdr` resolves its spec source through `docs/agents/issue-tracker.md`. While that file is missing, the reviewer runs the Spec axis against the PR description and the commits, says so in its findings, and tells the human to run `/setup-matt-pocock-skills` once to record this repository's tracker.

**Axis panes:** `code-review-herdr` runs its Standards and Spec axes as **two Herdr panes of its own** (spawned through `herdr-subagent`, then closed once their reports are collected — that standing instruction is in the skill). Only if the reviewer pane is not inside Herdr, or pane creation fails, does it run the two axes sequentially and say so; either way the findings stay separate per axis — never merged or re-ranked.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md#4-review-loop-a-herdr-subagent-runs-code-review-herdr-max-2-rounds)

## Agent skills

`.agents/skills/` holds both the repository's own skills — `dev-workflow` (Rules 1 and 2), `herdr-subagent` (the Herdr mechanics Rule 2 uses) and `code-review-herdr` (this repository's fork of the vendored `code-review`, adapted to run each review axis in its own Herdr pane) — and the 25 published [mattpocock/skills](https://github.com/mattpocock/skills) (grilling a plan, test-first implementation, code review, debugging loops, handoffs). Read the matching `SKILL.md` before starting that kind of work instead of improvising a process. Layout, update commands and the `skills-lock.json` hash trail are documented in [docs/development.md](docs/development.md#agent-skills).
