#!/usr/bin/env node
/**
 * check-slides-chrome.mjs — assert in the *running* app that Slides mode hides
 * the core Backlinks plugin's in-document panel, and that leaving Slides mode
 * brings it back.
 *
 * Why this is a script and not a unit test: the claim is about a *rendered*
 * panel — a real element, a real computed `display`, a real box — while
 * `test/styles.test.ts` can only assert the CSS *text* (there is no layout
 * engine in vitest). A CSS-text assertion cannot see that a selector names
 * nothing, and that is exactly how #141 survived a release: the rule hid
 * `.backlink-container`, Obsidian 1.9.10 has no such element anywhere in its
 * DOM, the panel stayed on screen at the bottom of the card, and every check
 * stayed green. Only the running app can see it.
 *
 * The invariant, asserted in this order so that no claim can pass vacuously:
 *
 *   1. **outside Slides mode the panel is on screen.** With the core Backlinks
 *      plugin's "Backlinks in document" feature on, `.embedded-backlinks` is
 *      rendered inside the active leaf, computes a `display` other than `none`
 *      and has a box with height. A panel that is not on screen fails the run —
 *      "hidden in Slides mode" is otherwise true of a panel that was never
 *      there at all;
 *   2. **in Slides mode the panel is hidden.** The same element is still in the
 *      DOM but computes `display: none` and measures zero height, *and* the
 *      slides bar and the card are laid out — so a blank pane can never pass as
 *      a hidden panel;
 *   3. **leaving Slides mode brings it back.** The rule is scoped to
 *      `body.native-slides-mode`, not to the panel, so the panel has to
 *      reappear exactly as it was.
 *
 * If "Backlinks in document" is off, the run turns it on through Obsidian's own
 * command (`backlink:toggle-backlinks-in-document`) and toggles it back
 * afterwards; a feature that cannot be turned on fails the run, it is never a
 * skipped claim.
 *
 *   npm run check:chrome
 *   OBSIDIAN_CDP_PORT=9333 NS_ALLOW_FOCUSED_WINDOW=1 npm run check:chrome
 *   node scripts/check-slides-chrome.mjs --note "Grow the Deck"
 *
 * It drives `example-vault/` through scripts/vault-cdp.mjs, so the app must be
 * running with `--remote-debugging-port=9222` (or another port via
 * `OBSIDIAN_CDP_PORT` — the dedicated capture instance uses 9333) and that vault
 * open; the guard refuses anything else, including a window that has the user's
 * focus. `--note` must be a deck note, because Slides mode only engages on one.
 *
 * Everything it changes is restored afterwards — on success, on failure and on
 * Ctrl-C — through the shared `captureVaultState` / `restoreVaultState` pair,
 * plus the Backlinks toggle when this run used it. The reminder printed at the
 * end names `example-vault/.obsidian/appearance.json` because the shared restore
 * re-applies the theme and font size through the app, and those values live in
 * that tracked file; measured, a vault already on those values does not move the
 * file's bytes, so the reminder is about the config Obsidian owns (AGENTS.md
 * Rule 3) rather than a diff you will necessarily see. The Backlinks toggle
 * lives in the vault's untracked `example-vault/.obsidian/backlink.json` and is
 * put back by value.
 *
 * See docs/development.md#driving-the-running-app-over-cdp.
 */

import {
  captureVaultState,
  connect,
  parseArgs,
  printVaultReminder,
  restoreVaultState,
  sleep,
} from "./vault-cdp.mjs";

const { args } = parseArgs({
  defaults: { note: "Grow the Deck" },
  name: "check-slides-chrome",
});

/** The panel, scoped to the active leaf: a second leaf's panel must not answer */
const PANEL = ".workspace-leaf.mod-active .embedded-backlinks";
/** Obsidian's own toggle for the feature that renders the panel */
const TOGGLE = "backlink:toggle-backlinks-in-document";
/** How long a state gets to land after the app's own write */
const SETTLE_MS = 900;
/** Upper bound on waiting for the panel to appear, or for a state to change */
const WAIT_TIMEOUT_MS = 6000;

/**
 * The panel's state, plus the two things that prove Slides mode really rendered
 * something (the slides bar and the card): without them a blank pane would make
 * "the panel is hidden" vacuously true.
 */
const MEASURE = `(() => {
  const round = (n) => Math.round(n);
  const panel = document.querySelector(${JSON.stringify(PANEL)});
  const bar = document.querySelector(".native-slides-bar");
  const card = document.querySelector(".workspace-leaf.mod-active .cm-content");
  const box = (el) => (el ? el.getBoundingClientRect() : null);
  const panelBox = box(panel);
  const barBox = box(bar);
  return {
    slidesMode: document.body.classList.contains("native-slides-mode"),
    panel: panel
      ? {
          display: getComputedStyle(panel).display,
          height: round(panelBox.height),
          top: round(panelBox.top),
        }
      : null,
    bar: bar ? { display: getComputedStyle(bar).display, height: round(barBox.height) } : null,
    cardHeight: card ? round(box(card).height) : null,
    viewport: innerHeight,
  };
})()`;

/** Whether a reading shows the panel on screen: present, not `display: none`, with a box */
const shown = (panel) => Boolean(panel) && panel.display !== "none" && panel.height > 0;

/** One panel reading as text for an evidence line */
const readout = (state) => (state ? `${state.display} / ${state.height}px` : "(not in the DOM)");

const cdp = await connect();
const failures = [];
/** What the run saw, in order — the evidence behind the verdict */
const claims = [];
/** The state the run found; null until captured */
let snapshot = null;
/** Whether this run turned "Backlinks in document" on and must put it back */
let turnedPanelOn = false;
/** The one in-flight restore — the `finally` and the SIGINT handler share it */
let restoring = null;

/** The tracked file whose values the shared restore re-applies, for the reminder */
const VAULT_FILES = ["example-vault/.obsidian/appearance.json"];

/**
 * Put the vault back the way the snapshot found it, at most once. Resolves to
 * whether it succeeded: a run that leaves the vault mutated must not exit 0.
 */
function restore() {
  if (!snapshot) return Promise.resolve(true);
  if (!restoring) {
    restoring = (async () => {
      try {
        if (turnedPanelOn) {
          await cdp.eval(`app.commands.executeCommandById(${JSON.stringify(TOGGLE)})`);
          turnedPanelOn = false;
          await sleep(500);
        }
        await restoreVaultState(cdp, snapshot);
        // The shared restore only ever *leaves* Slides mode; put the class back
        // the way the run found it, in both directions.
        await setSlides(snapshot.slidesMode);
        return true;
      } catch (error) {
        console.error(`could not restore the vault state: ${String(error)}`);
        return false;
      }
    })();
  }
  return restoring;
}

// Ctrl-C mid-run must not leave the vault mutated: the same restore the `finally`
// runs, then a non-zero exit either way.
process.on("SIGINT", () => {
  console.error("\ninterrupted — restoring the vault state before exiting");
  restore().then((ok) => {
    printVaultReminder(VAULT_FILES);
    process.exit(ok ? 130 : 1);
  });
});

/** Read the panel's state in the app */
const measure = () => cdp.eval(MEASURE);

/** Wait until a reading satisfies `predicate`, or return the last one when none does */
async function until(predicate) {
  const deadline = Date.now() + WAIT_TIMEOUT_MS;
  let latest = await measure();
  while (!predicate(latest) && Date.now() < deadline) {
    await sleep(300);
    latest = await measure();
  }
  return latest;
}

/** Enter or leave Slides mode, and let the class and the layout land */
async function setSlides(on) {
  await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    if (${on} !== document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
    await new Promise((r) => setTimeout(r, ${SETTLE_MS}));
    return true;
  })()`);
  await sleep(500);
}

/**
 * Turn the feature that renders the panel on, if it is off, and report whether
 * this run has to turn it back off.
 *
 * Both "no element" (the feature is off) and "an element that computes
 * `display: none`" read as off: a check that treated only the first as off would
 * skip the very state it exists to assert. `turnedPanelOn` is set as soon as the
 * command is issued, not once the panel appears, so the restore undoes a toggle
 * the run made even when the panel never turned up.
 */
async function turnPanelOn() {
  if (shown((await measure()).panel)) return false;
  await cdp.eval(`app.commands.executeCommandById(${JSON.stringify(TOGGLE)})`);
  turnedPanelOn = true;
  const latest = await until((m) => shown(m.panel));
  if (!shown(latest.panel)) {
    throw new Error(
      `the "Backlinks in document" panel is not on screen outside Slides mode even after ` +
        `toggling it with ${TOGGLE} (${readout(latest.panel)}) — the core Backlinks plugin may be ` +
        "disabled, so nothing was verified",
    );
  }
  return true;
}

/** The check itself: set up, assert the three states, leave the vault to `restore()` */
async function run() {
  snapshot = await captureVaultState(cdp);
  await cdp.open(args.note);
  await setSlides(false);

  turnedPanelOn = await turnPanelOn();

  // ── 1. Outside Slides mode the panel is on screen ────────────────────────
  // Asserted first, because it is what makes claim 2 mean something: "hidden in
  // Slides mode" is vacuously true of a panel that was never rendered.
  const native = await measure();
  claims.push(`outside Slides mode: panel ${readout(native.panel)}`);
  if (!shown(native.panel)) {
    failures.push(
      `the Backlinks in document panel is not on screen outside Slides mode ` +
        `(${readout(native.panel)}) — "hidden in Slides mode" would be vacuously true`,
    );
  }

  // ── 2. In Slides mode it is hidden ───────────────────────────────────────
  await setSlides(true);
  const slides = await until((m) => m.slidesMode);
  claims.push(
    `Slides mode: panel ${readout(slides.panel)}, slides bar ${readout(slides.bar)}, ` +
      `card ${slides.cardHeight}px, ${slides.viewport}px viewport`,
  );
  if (!slides.slidesMode) {
    failures.push(`Slides mode did not engage on "${args.note}" — is it a deck note?`);
  }
  if (!slides.bar || slides.bar.display === "none" || !(slides.bar.height > 0)) {
    failures.push(
      "the slides bar is not laid out in Slides mode — the pane may be blank for another reason",
    );
  }
  if (!(slides.cardHeight > 0)) {
    failures.push(
      "the card is not laid out in Slides mode — a blank pane must not pass as a hidden panel",
    );
  }
  if (!slides.panel) {
    failures.push(
      "the Backlinks in document panel is not in the DOM in Slides mode: this check asserts that " +
        "the CSS hides a panel that is still there, so an absent element is a different claim",
    );
  } else if (slides.panel.display !== "none" || slides.panel.height !== 0) {
    failures.push(
      `the Backlinks in document panel is still visible in Slides mode: ${slides.panel.display} @ ` +
        `${slides.panel.top}px into a ${slides.viewport}px viewport, ${slides.panel.height}px tall`,
    );
  }

  // ── 3. Leaving Slides mode brings it back ────────────────────────────────
  await setSlides(false);
  const back = await until((m) => !m.slidesMode);
  claims.push(`back outside Slides mode: panel ${readout(back.panel)}`);
  if (!shown(back.panel)) {
    failures.push(
      `the panel did not come back when Slides mode was left (${readout(back.panel)}) — the rule ` +
        "is not scoped to Slides mode",
    );
  }
}

let exitCode = 0;
try {
  await run();
} catch (error) {
  console.error(`\ncheck-slides-chrome: ${error?.stack ?? error}`);
  exitCode = 1;
} finally {
  // A restore that fails fails the run: an exit 0 over a mutated vault is the
  // worst outcome there is.
  if (!(await restore())) {
    console.error(
      "\nthe vault state could not be restored — do not commit example-vault/.obsidian",
    );
    exitCode = 1;
  }
  cdp.ws.close();
}

// One exit point, so the reminder about the tracked vault config is always the
// last thing a run prints.
for (const claim of claims) console.log(`  · ${claim}`);
if (failures.length > 0) {
  console.error(`\n${failures.length} failure(s):`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  exitCode = 1;
}
if (claims.length === 0) {
  console.error("\nno state was measured — nothing was verified");
  exitCode = 1;
}
if (exitCode === 0) {
  console.log(
    "\nthe panel is on screen outside Slides mode, hidden in it, and back on screen after",
  );
}
printVaultReminder(VAULT_FILES);
process.exit(exitCode);
