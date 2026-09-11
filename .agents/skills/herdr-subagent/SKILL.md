---
name: herdr-subagent
description: Start and coordinate a subagent in a Herdr pane when the user explicitly asks to delegate work through Herdr or run another agent alongside the current one.
---

# Herdr Subagent

Follow this SOP directly. The happy path is self-contained: do not load the general `herdr` skill, run `herdr --skill`, or inspect CLI help unless a command fails or its response no longer matches this SOP.

Defaults unless the user overrides them:

- sibling pane in the current tab
- current working directory
- split to the right — the right choice for a **wide** pane; split a narrow or tall one down instead (step 2 says how to read which you have)
- keep the user's focus unchanged
- Herdr agent name `default`
- agent kind `pi`
- pi's configured default provider and model
- synchronous execution

## SOP

### 1. Check the Herdr context

```bash
test "${HERDR_ENV:-}" = 1
```

If this fails, report that the current process is not inside Herdr and stop. Do not control another Herdr session from outside Herdr.

### 2. Create the subagent pane

Use the user-requested direction and working directory when supplied; otherwise pick the direction from your own geometry first.

- **Read your own rect** with `herdr pane layout --current`. It prints the **whole tab**, not your pane: `.result.layout` carries the tab's `area`, a `panes[]` array (each entry's `pane_id` and `rect`), and `splits[]`, with no filtering to the caller. So take the `panes[]` entry whose `pane_id` equals your own `$HERDR_PANE_ID` and read that entry's `rect` — the entry lookup is the part that matters, not the command. `stty size` is not available when your shell is not a tty, and `herdr pane get` reports no geometry at all, so neither answers this question.
- **Pick the direction** from that rect: a pane **wider than it is tall** splits to the right, otherwise down. Both panes should stay usable — roughly 40 columns and 10 rows — so when one dimension is much larger than the other, bias the split with `--ratio` instead of halving it.
- **If the read gives you nothing usable** — no `panes[]` entry for your own pane ID, or no `rect` on it — say so and fall back to the default direction rather than guessing.

```bash
herdr pane split --current --direction right --cwd "$PWD" --no-focus   # or --direction down, per the rect above
```

Read the new pane ID from `.result.pane.pane_id` in the JSON response. Use that exact ID in the next step: it is the **only** pane this workflow may target.

Do not re-derive that ID later, and never pick a pane out of `herdr pane list`. A workspace holds other panes — earlier subagents' panes, plain shells, panes the user opened — so "an empty pane in this workspace" is not "the pane this workflow just created", and starting an agent in the wrong one takes over a terminal that was not yours. When you need the ID in a later command, carry it in a variable rather than searching for it. The block below is the **same** split and the **same** start as above written as one invocation — it is not an extra split, and running it as one would leave an orphan pane that the ownership rules below then disown:

```bash
PANE=$(herdr pane split --current --direction right --cwd "$PWD" --no-focus | jq -r '.result.pane.pane_id')
if [ -z "$PANE" ] || [ "$PANE" = null ]; then
  echo "pane split returned no pane id — stopping instead of starting an agent in an unknown pane" >&2
  exit 1
fi
herdr agent start default --kind pi --pane "$PANE"
```

An empty or `null` result means the response did not match this SOP: stop and report rather than passing an empty `--pane`.

### 3. Start the agent

Use the requested name and kind when supplied; otherwise run:

```bash
herdr agent start default --kind pi --pane <pane-id>
```

For default pi, pass no native arguments: this preserves pi's configured default provider and model. When the user requests pi options, append the corresponding native arguments after `--`, for example:

```bash
herdr agent start <name> --kind pi --pane <pane-id> -- --provider <provider> --model <model>
```

Use distinct lowercase names for parallel agents. Do not reuse an occupied name.

`agent start` reports where it settled as `.result.agent.pane_id`. Check that it **equals** the ID from step 2 before you rely on the pane: if the two differ, the agent is running in a pane this workflow did not create, so stop, close nothing, and report the mismatch — every later step, including any close, would otherwise act on the wrong pane.

### 4. Delegate the task

Send a self-contained prompt containing the task, relevant scope, expected output, and any execution or safety constraints. For synchronous work, run:

```bash
herdr agent prompt <name> "<task>" --wait --timeout 120000
```

For explicitly asynchronous work, omit `--wait`; then report the agent name and pane ID immediately so the user can monitor it.

### 5. Resolve the returned state

- `idle` or `done`: continue to result collection.
- `blocked`: read the agent output, identify the approval or question, and ask the user to decide. Do not answer it by guessing.
- timeout or `working`: the task may still be running. Inspect with `herdr agent get <name>`, then wait again with `herdr agent wait <name> --timeout 120000` when synchronous completion is still required.
- `unknown` or command error: enter the troubleshooting path below.

### 6. Collect the result

```bash
herdr agent get <name>
herdr agent read <name> --source recent-unwrapped --lines 120
```

If the complete response is unavailable because the agent uses the terminal's alternate screen, ask it to write the complete response to a temporary Markdown file and reply only with that path. Read the file directly and verify any requested artifact exists.

Report the result, agent name, and pane ID. Leave the pane and agent running unless the user explicitly asks to close them.

## Troubleshooting only

Enter this path only when a happy-path command fails, a response field is missing, or the installed Herdr version behaves differently from the SOP.

1. Load the installed authoritative Herdr instructions:

   ```bash
   herdr --skill
   ```

2. Inspect only the relevant command group:

   ```bash
   herdr agent
   herdr pane
   ```

3. Correct the failed step using the installed syntax, then resume at that step. Do not restart successful earlier steps or create another pane unless the existing pane is unusable.

## Safety and completion

Target the caller with `--current`, then use only the returned pane ID or the chosen unique agent name. Preserve user focus with `--no-focus`. Close, move, or stop only resources created by this workflow, and only when the user requests it; a pane that merely exists in the workspace was not created by this workflow, so only an ID your own `pane split` returned is yours to touch. Never stop the Herdr server as cleanup.

Synchronous delegation is complete only when the agent settles at `idle` or `done`, its result has been collected, and requested artifacts have been verified. Asynchronous delegation is complete when startup and prompt submission succeed and the agent name and pane ID have been reported.
