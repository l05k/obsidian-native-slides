# AGENTS.md — Agent Operating Rules

Rules that agents (AI or human) MUST follow when working in this repository. Detailed specifications live in the `.agents/skills/` directory; each rule below links to its skill.

## Rule 1 — Development workflow (CLI-first)

Every change must follow the **branch → PR → CI → review loop → merge → cleanup** workflow, driven entirely by CLI tools. Never commit directly to `main`. Before every commit, confirm that all documentation affected by the change (`README.md` / `README-zh.md`, `docs/`, `CHANGELOG.md`) is updated in the same commit — never ship code without its docs.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md)

## Rule 2 — Every PR is reviewed by a Herdr subagent, then merged (max 2 rounds)

An agent never reviews its own work, and no longer waits for a human to merge it: the review loop below replaces the human merge gate. A **round** is one review plus the fixes it produces; after **at most two rounds**, with CI green and the local checks passing, the authoring agent merges its own PR with **squash**.

1. **Spawn a reviewer** in a Herdr pane — sibling pane, repository root, no focus change, agent kind `pi`, synchronous — following [.agents/skills/herdr-subagent/SKILL.md](.agents/skills/herdr-subagent/SKILL.md).
2. **Review** — prompt that subagent to run Matt's [`code-review`](.agents/skills/code-review/SKILL.md) skill over the PR, with the `origin/main` merge-base as the fixed point. Require file:line + severity, **blockers separated from nits**, and a Markdown artifact to read back.
3. **Publish** — post the findings as a PR comment (`gh pr comment <pr> --body-file …`), labelled with the round number.
4. **Fix in that same subagent** — send the blockers back into the pane; never fix the findings yourself in the main session, and never let two agents write the tree at once. The subagent edits the working tree and reports its diff; **the orchestrating agent stays the only git writer** and commits/pushes that diff.
5. **Re-verify** — `npm run check` / `test` / `lint` / `format:check` / `build`, `git diff --exit-code -- main.js`, then `gh pr checks <pr> --watch` until CI is green.
6. **Merge or stop** — `gh pr merge <pr> --squash --delete-branch`. If a blocker is still open after two rounds, stop, leave the PR open, and hand it to the human with the findings; never merge over an open blocker.

**Full instructions:** [.agents/skills/dev-workflow/SKILL.md](.agents/skills/dev-workflow/SKILL.md#4-review-loop-a-herdr-subagent-runs-code-review-max-2-rounds)

## Agent skills

`.agents/skills/` holds both the repository's own skills — `dev-workflow` (Rule 1) and `herdr-subagent` (Rule 2 mechanics) — and the 25 published [mattpocock/skills](https://github.com/mattpocock/skills) (grilling a plan, test-first implementation, code review, debugging loops, handoffs). Read the matching `SKILL.md` before starting that kind of work instead of improvising a process. Layout, update commands and the pinned `skills-lock.json` are documented in [docs/development.md](docs/development.md#agent-skills).
