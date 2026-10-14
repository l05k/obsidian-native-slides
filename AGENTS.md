# AGENTS.md — Agent Operating Rules

Rules that agents (AI or human) MUST follow when working in this repository. This file is an index: each rule is stated in a few lines, and the procedure lives in the skill it links to. Read that skill before starting the kind of work it covers.

## Rule 1 — Development workflow (CLI-first)

Every change follows **branch → PR → CI → review → merge → cleanup**, driven by CLI tools. Never commit directly to `main`. Update every affected document (`README.md` / `README-zh.md`, `docs/`, `CHANGELOG.md`) in the same commit as the code.

Procedure: [dev-workflow](.agents/skills/dev-workflow/SKILL.md)

## Rule 2 — Every PR is reviewed by a Herdr subagent, then merged (one round)

An agent never reviews its own work. A **round** is one review plus the fixes it produces; there is exactly one. After it, with CI green and the local checks passing, the authoring agent squash-merges its own PR. A human may take over the review at any time: if the user asks to hold a PR, hold it.

- **Review**: spawn a Herdr pane (agent kind `pi`) that runs [`code-review-herdr`](.agents/skills/code-review-herdr/SKILL.md) over the PR, fixed at the `origin/main` merge-base. Not the vendored `code-review`: Pi has no native sub-agent tool. Findings carry file:line and severity, with blockers apart from nits.
- **Publish and fix**: post the findings as a PR comment labelled `review round 1`. Blockers are fixed in the same subagent, never in the main session, and never by two agents writing the tree at once. The orchestrating agent is the only git writer.
- **Verify, then merge**: re-run `npm run check` / `test` / `lint` / `format:check` / `build` / `check:scanner`, `git diff --exit-code -- main.js`, and `gh pr checks <pr> --watch`. Comment the outcome, then `gh pr merge <pr> --squash`.
- **Open blocker after the fixes**: stop, leave the PR open, hand it to the human. Never merge over a blocker and never start a second round.

Mechanics: [dev-workflow §4](.agents/skills/dev-workflow/SKILL.md#4-review-loop-a-herdr-subagent-runs-code-review-herdr-one-round) and [herdr-subagent](.agents/skills/herdr-subagent/SKILL.md). The merge gate (what the `protect-main` ruleset enforces and what it leaves to you) is in [dev-workflow §4, step 6](.agents/skills/dev-workflow/SKILL.md#4-review-loop-a-herdr-subagent-runs-code-review-herdr-one-round).

### Branch and tag deletion: local is the agent's, remote is the user's

- **Agent**: after a merge, sync and delete the **local** branch with the non-force `git branch -d <branch>`. That is a normal step and needs no permission.
- **User**: remote branches and tags are deleted only by the user. Never delete a remote ref, never hand over a command that would, and never use a refused form: `git branch -D`, `git tag -d`, `git push --delete` / `-d`, `git push origin :<ref>`, `gh pr merge --delete-branch`.
- **Order matters**: delete the local branch before anything prunes `origin/<branch>`. See [dev-workflow §5](.agents/skills/dev-workflow/SKILL.md#5-after-the-pr-is-merged-local-delete-then-sync).

This is policy, not a deduction from what a local guard happens to block. Do not route around a refusal.

## Rule 3 — Test in `example-vault/`, never in another vault

Every behavioural check runs against this repository's `example-vault/` — the only vault anything here may be tested against, never another vault, and in particular never one that holds real notes. It is wired to the repository root by symlinks, so `npm run build:dev` plus a plugin reload is the whole loop.

- Scratch notes go inside `example-vault/` and are removed afterwards. The `Probe*.md` / `test.md` / `untitled-slides.md` slides and the `tests/typography-*.md` fixtures are not yours to delete.
- Driving the app over CDP is fine, through `scripts/vault-cdp.mjs`, which refuses to connect unless exactly one window holds `example-vault/`. Identify the target by asking the app, not by window title.
- **Never drive the instance the user is working in.** Run captures in a dedicated instance holding only `example-vault/`.

Procedure: [vault-cdp-testing](.agents/skills/vault-cdp-testing/SKILL.md). Mechanism: [docs/development.md](docs/development.md#testing-in-the-example-vault).

## Rule 4 — Releases: the maintainer merges, the agent tags

A release is a Rule 1 PR that bumps the version, plus one step only the agent performs: **tagging**. The release PR is the one PR type the agent does not self-merge: Rule 2's review runs, but the maintainer merges.

- Tag `main`'s commit, never the release branch tip. Sync `main` first and check `git rev-parse <version>^{commit}` equals `git rev-parse main`.
- Creating and re-pointing a tag is the agent's. Deleting one is the user's.
- Verify the published chain (Release workflow, assets, `manifest.json`, `main.js` byte-identical to a local `build:release`). A merged GitHub release is not the end of a release.

Procedure: [dev-workflow §6](.agents/skills/dev-workflow/SKILL.md#6-releasing-the-maintainer-merges-the-agent-tags)

## Agent skills

`.agents/skills/` holds this repository's own skills (`dev-workflow`, `herdr-subagent`, `code-review-herdr`, `vault-cdp-testing`) and a vendored copy of [mattpocock/skills](https://github.com/mattpocock/skills). Layout, update commands and which vendored skills this repository actually relies on: [docs/development.md](docs/development.md#agent-skills).

- **Issue tracker**: GitHub Issues through the `gh` CLI. [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)
- **Triage labels**: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. [docs/agents/triage-labels.md](docs/agents/triage-labels.md)
- **Domain docs**: one `CONTEXT.md` and `docs/adr/` at the repo root. [docs/agents/domain.md](docs/agents/domain.md)
