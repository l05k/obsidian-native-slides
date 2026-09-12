---
name: vault-cdp-testing
description: Run a behavioural check in the running Obsidian app — drive example-vault over CDP and assert what the user would see. Use when a change has to be verified by driving the app (a drag, a click, a menu action, a page number, anything a unit test cannot reach), when reproducing a claim before it goes into a PR body, or when re-verifying a PR after a review round.
---

# Vault CDP testing

A **behavioural check** drives the running Obsidian app against the build you just made and asserts what the user would see. The pure cores have unit tests; this covers everything else — a gesture, a menu action, a rendered page number, a chain the plugin resolved.

`scripts/vault-cdp.mjs` is the entry point and the guard. The hazard it guards against, the identification algorithm and the command reference are in [docs/development.md §Driving the running app over CDP](../../../docs/development.md#driving-the-running-app-over-cdp).

## Steps

1. **Confirm the vault and the build.** `node scripts/vault-cdp.mjs state`. Done when `vaultPath` ends in `…/obsidian/example-vault` and `pluginVersion` matches `package.json` — a window still running an older bundle is the usual first surprise, and `reload` fixes it.
2. **Build the starting state.** Create the deck the check needs (`create-deck`), open its head (`open`), leave Slides mode (it hides the panel), then poll until the panel and the deck the plugin resolves agree. Done when the precondition is **asserted**, not assumed.
3. **Drive and assert.** One check per claim. Read through `app.*` wherever the claim allows it; synthesize input only for the gesture the claim is about. Done when every assertion compares against the **live truth** as well as the UI — after a reorder, that the frontmatter chain matches the panel order — rather than merely that something changed.
4. **Clean up.** Delete the scratch notes, `git restore -- example-vault/.obsidian`, re-check `git status`. Done when nothing of yours is left in the vault.
5. **Report.** Name what was checked, and name any check a throttled window forced onto behaviour or handlers instead of pixels. Done when every claim in the PR body has a check behind it — or is not claimed.

## Rules

- **Drive one vault: `example-vault/`.** The guard refuses on zero **or several** matches, and anything connected to the wrong window can read the notes in it — so a refusal means fix the setup, not work around the guard.
- **Assert the layout before you click or drag it.** A collapsed sidebar gives every panel entry a `0×0` rect, and the click then lands in the editor at `(0,0)` — which is how a demo note got edited and a stray file ended up in the repository root.
- **Settle before asserting.** `openLinkText`, a frontmatter write and a metadata reindex are asynchronous; reading immediately reads a half-applied state, and a _correct_ refusal then looks like a bug.
- **An environment limit is not a pass.** A throttled window (`requestAnimationFrame` never firing, `Menu` mounting no DOM) changes _how_ you assert — on the handler, on the action behind a menu entry — and you say so in the report.
- **Keep scratch check scripts outside the repository** (`/tmp/…`), importing the primitives; nothing test-shaped is committed.
