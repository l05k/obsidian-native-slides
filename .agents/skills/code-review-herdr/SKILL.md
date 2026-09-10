---
name: code-review-herdr
description: "Two-axis review (Standards + Spec) of the changes since a fixed point (commit, branch, tag, merge-base). Each axis runs in its own Herdr pane, because Pi has no native sub-agent tool: this repository fork of the code-review skill from mattpocock/skills spawns them through herdr-subagent and reports the axes unmerged. Prefer it over the vendored code-review, whose parallel sub-agents Pi cannot provide."
---

Two-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards**: does the code conform to this repo's documented coding standards?
- **Spec**: does the code faithfully implement the originating issue / spec?

Both axes run in **separate Herdr panes**, one agent each, so they don't pollute each other's context; this skill then aggregates their findings.

This is a fork of the vendored [`../code-review/SKILL.md`](../code-review/SKILL.md), which assumes a native parallel-sub-agent tool that Pi does not have. The method is the same; the spawning is Herdr's, through [`../herdr-subagent/SKILL.md`](../herdr-subagent/SKILL.md). Read that skill's SOP if a Herdr command in step 4 fails or behaves differently.

The issue tracker should have been provided to you. If `docs/agents/issue-tracker.md` is missing, tell the user to run `/setup-matt-pocock-skills`.

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
4. If nothing is found, ask the user where the spec is. If they say there isn't one, the **Spec** axis will skip and report "no spec available".

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

Pi has no task/sub-agent tool: the two "parallel sub-agents" are two **Herdr panes**, each running its own pi agent, created by you. Pick an `<id>` that identifies this review — the PR number, or the branch / short SHA — because agent names must be distinct lowercase names and an occupied name cannot be reused.

**4.1 Can you spawn panes?** This works from inside a pane as well as from the top-level session: a pane agent has `HERDR_ENV=1` and its own `HERDR_PANE_ID` (verified 2026-09-10), so nesting is fine.

```sh
test "${HERDR_ENV:-}" = 1
```

If that fails, or if `herdr pane split` errors, do **not** silently single-thread: run the two axes sequentially in this session, keep the findings separate per axis exactly as in step 5, and say in the report that the axes ran sequentially because panes were unavailable. See _Failure modes_ at the end.

**4.2 Create both panes and start one agent per axis**:

```sh
herdr pane split --current --direction right --cwd "$PWD" --no-focus   # read .result.pane.pane_id
herdr agent start review-<id>-standards --kind pi --pane <pane-id>

herdr pane split --current --direction right --cwd "$PWD" --no-focus   # read .result.pane.pane_id
herdr agent start review-<id>-spec --kind pi --pane <pane-id>
```

- Use `--current` — **your** pane — never the _focused_ pane: the user's focus may sit in another workspace or tab, so "focused" is not yours. Keep `--no-focus` so the human is not yanked around.
- Pass no native pi arguments after `--`: the panes then inherit pi's configured default provider and model.
- Record both pane IDs and agent names; step 4.6 closes exactly those panes.

**4.3 Prompt each axis with its own brief.** The **Standards** brief must include:

- The full diff command and the commit list.
- The list of standards-source files you found in step 3, **plus the smell baseline from step 3 pasted in full** (the pane agent has no other access to it).
- The task: "Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

The **Spec** brief must include:

- The diff command and the commit list.
- The path, or the fetched contents, of the spec.
- The task: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

Both briefs must also state the constraints: **read-only** (no edits, no staging, no commits, no pushes, no merges, no `npx skills` writes), write the full findings to `/tmp/code-review-<id>-<axis>.md`, and reply with only that path plus a one-line verdict. If the spec is missing, skip the Spec pane and note that in the final report.

```sh
herdr agent prompt review-<id>-standards "<standards brief>" --wait --timeout 600000
herdr agent prompt review-<id>-spec "<spec brief>" --wait --timeout 600000
```

**4.4 Resolve the returned state.**

- `idle` or `done`: collect the result (4.5).
- `blocked`: the pane is waiting for an approval or asking a question — read its output, then **surface the question to the user**; do not answer it by guessing.
- `working` or a timeout: the work may still be running. `herdr agent get <name>`, then `herdr agent wait <name> --timeout 120000`.
- Unknown state or command error: read the pane (`herdr agent read <name> --source recent-unwrapped --lines 160`) and follow the herdr-subagent troubleshooting path.

**4.5 Collect the two reports.** Read `/tmp/code-review-<id>-standards.md` and `/tmp/code-review-<id>-spec.md` directly and verify they exist. If a pane's answer is unavailable (an agent on the terminal's alternate screen), read its recent output with `herdr agent read <name> --source recent-unwrapped --lines 160`, and if that still isn't the report, ask the agent to write the file.

**4.6 Close the axis panes you created.** This repository's standing instruction is that the axis panes are closed once their reports have been collected — the top-level reviewer pane stays for the human. Close only the two panes you created in 4.2, by the IDs you recorded there, and never any other pane; never stop the Herdr server. Report the IDs you closed. If the user asked to keep them, keep them instead.

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
- **A findings file is missing** → read the pane's recent output; if the report still isn't there, ask the agent to write the file.
- **Closing a pane fails** → report it and leave that pane alone; do not go hunting for other panes to close.
