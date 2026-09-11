---
name: code-review-herdr
description: 'Two-axis review (Standards + Spec) of the changes since a fixed point (commit, branch, tag, merge-base). Use when the user wants a branch, a PR or work-in-progress reviewed, or asks to "review since X". Each axis runs in its own Herdr pane, because Pi has no native sub-agent tool: this repository fork of the mattpocock/skills code-review spawns them through herdr-subagent and reports the axes unmerged. Prefer it over the vendored code-review.'
---

Two-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards**: does the code conform to this repo's documented coding standards?
- **Spec**: does the code faithfully implement the originating issue / spec?

Both axes run in **separate Herdr panes**, one agent each, so they don't pollute each other's context; this skill then aggregates their findings.

This is a fork of the vendored [`../code-review/SKILL.md`](../code-review/SKILL.md), which assumes a native parallel-sub-agent tool that Pi does not have. The method is the same; the spawning is Herdr's, through [`../herdr-subagent/SKILL.md`](../herdr-subagent/SKILL.md). Read that skill's SOP if a Herdr command in step 4 fails or behaves differently.

The issue tracker should have been provided to you. If `docs/agents/issue-tracker.md` is missing, tell the user to run `/setup-matt-pocock-skills` once to record this repository's tracker — but that never blocks the review: step 2 item 4 says what the Spec axis runs against instead.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point (a commit SHA, branch name, tag, `main`, `HEAD~5`, etc.). If they didn't specify one, ask for it.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, so the comparison is against the merge-base). Also note the list of commits via `git log <fixed-point>..HEAD --oneline`.

Before going further, confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or empty diff should fail here, not inside two pane sub-agents that then report nothing.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`, etc.), fetched via the workflow in `docs/agents/issue-tracker.md`.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.
4. If `docs/agents/issue-tracker.md` is missing, do not ask and do not skip: run the **Spec** axis against the PR description (`gh pr view <pr> --json title,body`) and the commit messages, and say in the report that this is where the spec came from. Only when there is no spec anywhere _and_ no PR description either, ask the user where the spec is; if they say there isn't one, the **Spec** axis skips and reports "no spec available".

### 3. Identify the standards sources

Anything in the repo that documents how code should be written, such as `CODING_STANDARDS.md` or `CONTRIBUTING.md`.

On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below: a fixed set of Fowler code smells (_Refactoring_, ch.3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation. Like any standard here, skip anything tooling already enforces.

Each smell reads _what it is_ → _how to fix_; match it against the diff:

- **Mysterious Name**: a function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 4. Spawn one Herdr pane per axis

Pi has no task/sub-agent tool: the two "parallel sub-agents" are two **Herdr panes**, each running its own pi agent, created by you. Pick an `<id>` that identifies this review — the PR number, or a **short sanitised** branch name or short SHA — and keep it to **15 characters or fewer**: Herdr agent names must match `[a-z][a-z0-9_-]{0,31}` and be unique among live agents, and `<id>` is used inside both the agent names (`review-<id>-standards`) and the artifact filenames, so an id that breaks that rule breaks both. The branch `feat/code-review-herdr-skill` is invalid — it contains `/` and is far too long — while `107` or `cr-herdr` work fine.

**4.1 Can you spawn panes?** This works from inside a pane as well as from the top-level session: a pane agent has `HERDR_ENV=1` and its own `HERDR_PANE_ID` (verified 2026-09-10), so nesting is fine.

```sh
test "${HERDR_ENV:-}" = 1
```

If that fails, or if `herdr pane split` errors, do **not** silently single-thread: run the two axes sequentially in this session, keep the findings separate per axis exactly as in step 5, and say in the report that the axes ran sequentially because panes were unavailable. See _Failure modes_ at the end.

**4.2 Create the panes and start one agent per axis**:

```sh
# Standards pane — always
herdr pane split --current --direction right --cwd "$PWD" --no-focus   # read .result.pane.pane_id — the only pane you may target, and `herdr pane list` is never its source
herdr agent start review-<id>-standards --kind pi --pane <standards-pane-id>   # .result.agent.pane_id must equal <standards-pane-id>
herdr agent get review-<id>-standards                                  # expect .result.agent.interactive_ready: true

# Spec pane — only when step 2 found a spec or a PR description
herdr pane split --current --direction down --cwd "$PWD" --no-focus    # read .result.pane.pane_id — the only pane you may target, and `herdr pane list` is never its source
herdr agent start review-<id>-spec --kind pi --pane <spec-pane-id>     # .result.agent.pane_id must equal <spec-pane-id>
herdr agent get review-<id>-spec                                       # expect .result.agent.interactive_ready: true
```

- **Create and start the Spec pane only when step 2 found a spec or a PR description.** When step 2 decided the Spec axis skips, do not create that pane at all — a pane created here and never prompted is an agent left running for nothing, and 4.6 could not close it without contradicting 4.2.
- Use `--current` — **your** pane — never the _focused_ pane: the user's focus may sit in another workspace or tab, so "focused" is not yours. Keep `--no-focus` so the human is not yanked around.
- Follow Herdr's direction rule — split a **wide** pane to the right and a **narrow or tall** pane down — and avoid repeated same-direction splits, which leave unusably narrow columns or short rows. That rule is why the examples use `right` then `down`, and it holds whether the caller is the root pane of a top-level session or an already-split one. `--ratio` is the alternative if you prefer.
  Re-read your own geometry after each split when you create several panes — the `herdr-subagent` SOP, step 2, says how: the rule is about the pane you are splitting **now**, not the one you started in.
- Pass no native pi arguments after `--`: the panes then inherit pi's configured default provider and model.
- **Verify the agent actually started** before you rely on the pane: `agent start` returns only once Herdr has detected the agent and considers it ready (`interactive_ready: true`), and a startup blocked on a dialog fails loudly with `agent_not_ready`. If `agent start` returns `agent_not_ready`, or `herdr agent get review-<id>-<axis>` shows no agent or `interactive_ready: false`, wait up to the CLI's 30 s startup timeout and **retry once** — then stop and report instead of prompting a pane that has nothing in it. `agent start` also reports where it settled, as `.result.agent.pane_id`: confirm it **equals** the pane you created before doing anything else, because 4.6 closes the IDs recorded here — a mismatch would leave the real agent running and close a pane that never had one. On a mismatch, stop, close nothing, and report both pane IDs — prompt neither pane. Never look a pane up in `herdr pane list`; a workspace usually holds other panes, and only the ID your own split returned is yours.
- Record each pane ID and agent name; step 4.6 closes exactly those panes.

**4.3 Prompt each axis with its own brief.** The **Standards** brief must include:

- The full diff command and the commit list.
- The list of standards-source files you found in step 3, **plus the smell baseline from step 3 pasted in full** (the pane agent has no other access to it).
- The task: "Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

The **Spec** brief must include:

- The diff command and the commit list.
- The path, or the fetched contents, of the spec.
- The task: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

Both briefs must also state the constraints: **read-only** (no edits, no staging, no commits, no pushes, no merges, no `npx skills` writes), write the full findings to `/tmp/code-review-<id>-r<round>-<axis>.md` (`<round>` is the round number the calling workflow gives the review; the path is keyed per round, so under a single-round workflow a re-run writes the same path — step 4.5's non-empty, mtime-after-the-prompt check is what keeps a leftover file from satisfying it), and reply with only that path plus a one-line verdict. If step 2 decided the Spec axis skips, no Spec pane exists (4.2) and you note the skip in the final report.

```sh
# Submit both prompts WITHOUT --wait: each call returns as soon as it is accepted,
# so the two panes work concurrently instead of the Spec pane idling behind Standards.
herdr agent prompt review-<id>-standards "<standards brief>"
herdr agent prompt review-<id>-spec "<spec brief>"

# Wait for both only after both are already running.
herdr agent wait review-<id>-standards --timeout 600000
herdr agent wait review-<id>-spec --timeout 600000
```

Submitting without `--wait` is what makes the two panes work concurrently: `--wait` blocks until _that_ agent settles, so two `--wait` calls run the axes one after the other. The waiting happens afterwards, once both are running. `herdr agent wait` matches `idle`, `done` or `blocked` unless you pass `--until`.

Accepting a submission does not prove the agent started a turn, and without `--wait` a swallowed prompt would surface only after the 600 s wait. So probe each agent right after submitting — `herdr agent get review-<id>-<axis>` must show `working`, or an already-settled `idle`/`done`/`blocked`. If an agent is still `idle` with no evidence of a turn, re-submit that one prompt **once**; if it still does not start, fall back per 4.1 and say so in the report.

**4.4 Resolve the returned state.**

- `idle` or `done`: collect the result (4.5).
- `blocked`: the pane is waiting for an approval or asking a question — read its output, then **surface the question to the user**; do not answer it by guessing.
- `working` or a timeout: the work may still be running. `herdr agent get <name>`, then `herdr agent wait <name> --timeout 120000`.
- Unknown state or command error: read the pane (`herdr agent read <name> --source recent-unwrapped --lines 120`) and follow the herdr-subagent troubleshooting path.

**4.5 Collect the reports.** Read each path you actually prompted — `/tmp/code-review-<id>-r<round>-standards.md`, and `/tmp/code-review-<id>-r<round>-spec.md` when a Spec pane was created in 4.2 — directly and verify each was written **by this round**: the pane's own reply names that path, and `ls -l` shows a non-empty file with an mtime after you submitted the prompt. A file that exists but predates the prompt is a leftover from an earlier round, not a report — ask the agent to write it. (`rm` and `truncate -s 0` are denied by this harness's permission policy, so `: > <path>` is how to clear a path first.) If a pane's answer is unavailable (because the agent uses the terminal's alternate screen), read its recent output with `herdr agent read <name> --source recent-unwrapped --lines 120`, and if that still isn't the report, ask the agent to write the file.

**4.6 Close the axis panes you created.** The delegated SOP closes panes "only when the user requests it" ([`../herdr-subagent/SKILL.md`](../herdr-subagent/SKILL.md)) — this repository's standing instruction _is_ that request: the axis panes are always closed once their reports have been collected, and the top-level reviewer pane stays for the human. Close exactly the panes you created in 4.2, by the IDs you recorded there — never any other pane; never stop the Herdr server. Report the IDs you closed. If the user asked to keep them, keep them instead.

```sh
herdr pane close <standards-pane-id>
herdr pane close <spec-pane-id>
```

### 5. Aggregate

Present the two reports under `## Standards` and `## Spec` headings, verbatim or lightly cleaned. Do **not** merge or rerank findings, because the two axes are deliberately separate (see _Why two axes_).

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes: that's the reranking the separation exists to prevent.

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.

## Failure modes

Every failure falls back or escalates — never silently single-thread, and never report an axis you did not actually run:

- **Not inside Herdr, or pane creation fails** → run both axes sequentially in this session, keep them separate per axis in the report, and say the axes ran sequentially and why.
- **An axis agent is `blocked`** → escalate its question to the user before continuing; a guessed answer invalidates that axis.
- **A findings file is missing, or predates this round** → read the pane's recent output; if the report still isn't there, ask the agent to write the file.
- **An agent name is invalid or already occupied** → pick another valid `<id>` (a PR number, a short sanitised branch name or short SHA, ≤15 chars) and start a fresh agent with a fresh name. Never reuse the occupied name and never blind-truncate one to fit: the id also appears in the artifact filenames, so a mangled id misplaces the reports.
- **Closing a pane fails** → report it and leave that pane alone; do not go hunting for other panes to close.
