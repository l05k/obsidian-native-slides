---
name: vault-cdp-testing
description: Run a behavioural check in the running Obsidian app — drive example-vault over CDP. Use when a unit test cannot reach the behaviour (a drag, a click, a menu action), when reproducing a claim before it goes into a PR body, or when re-verifying a PR after a review round.
---

# Vault CDP testing

A **behavioural check** drives the running Obsidian app against the build you just made and asserts what the user would see. The pure cores have unit tests; this covers everything else — a gesture, a menu action, a rendered page number, a chain the plugin resolved.

`scripts/vault-cdp.mjs` is the entry point and the guard. The hazard it guards against, the identification algorithm and the command reference are in [docs/development.md §Driving the running app over CDP](../../../docs/development.md#driving-the-running-app-over-cdp).

## Steps

1. **Confirm the vault and the build.** `node scripts/vault-cdp.mjs state`. Done when `vaultPath` ends in `…/obsidian/example-vault` and `pluginVersion` matches `package.json` — a window still running an older bundle is the usual first surprise. What fixes it depends on the file: `pluginVersion` reads the plugin's **in-memory** manifest, and `reload` (a plugin disable/enable) re-reads `main.js` and `styles.css` but **not** `manifest.json` — so for a version mismatch, and for any manifest edit, only the command palette's **Reload app without saving** works.
2. **Build the starting state.** Create the deck the check needs (`create-deck`), open its head (`open`), leave Slides mode (it hides the panel), then poll until the panel and the deck the plugin resolves agree. Done when the precondition is **asserted**, not assumed.
3. **Drive and assert.** One check per claim. Read through `app.*` wherever the claim allows it; synthesize input only for the gesture the claim is about. Done when every assertion compares against the **live truth** as well as the UI — after a reorder, that the frontmatter chain matches the panel order — rather than merely that something changed.
4. **Clean up.** Delete the scratch notes, `git restore -- example-vault/.obsidian`, re-check `git status`. Done when nothing of yours is left in the vault.
5. **Report.** Name what was checked, and name any check a throttled window forced onto behaviour or handlers instead of pixels. Done when every claim in the PR body has a check behind it — or is not claimed.

## Rules

- **Drive one vault: `example-vault/`.** The guard refuses on zero **or several** matches, and anything connected to the wrong window can read the notes in it — so a refusal means fix the setup, not work around the guard.
- **Assert the layout before you click or drag it.** A collapsed sidebar gives every panel entry a `0×0` rect, and `cdp.drag` refuses a layout-less entry rather than clicking whatever sits at those coordinates.
- **Settle before asserting.** `openLinkText`, a frontmatter write and a metadata reindex are asynchronous; reading immediately reads a half-applied state.
- **An environment limit is not a pass.** A throttled window (`requestAnimationFrame` never firing, `Menu` mounting no DOM) changes _how_ you assert — on the handler (a real right-click reaching it, `defaultPrevented`) or on the action behind a menu entry — and you say so in the report.
- **Put a check where its lifetime belongs.** A one-off check answers a question once, so it stays outside the repository (`/tmp/…`), importing the primitives — nothing test-shaped is committed. A check that is meant to be re-run belongs in `scripts/` instead, in one of two shapes:
  - **An assertion-style check** locks a **named invariant** and exits non-zero on drift (`check-slide-geometry.mjs` is the worked example).
  - **A two-run comparison tool** compares two runs **the caller supplies** instead of asserting a baked-in expected value: capture a baseline from the tree as it stands, make the change, capture again, diff the two (`slide-geometry-snapshot.mjs` for the computed numbers, `slide-visual-check.mjs` for the pixels). It is still a check worth committing — the comparison _is_ the assertion, and it is the only gate that can see a hand-pinned layout, which no unit test can — but its evidence is the pair of runs rather than a number in the source, so the report names both captures and what produced them.

  Either shape must be linted and formatted like the rest of the repository, **runnable by name from `package.json`** (`check:geometry`, `check:geometry-snapshot`, `check:visual`), documented in [`docs/development.md`](../../../docs/development.md) (the `scripts/` inventory), and write nothing into the repository — it never ships: the Release workflow publishes only `main.js`, `manifest.json` and `styles.css`.
