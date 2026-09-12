#!/usr/bin/env node
/**
 * check-slide-geometry.mjs — verify the card-title geometry in the *running*
 * app, where a real layout engine exists.
 *
 * Why this is a script and not a unit test: the invariant is pure computed
 * layout. `test/styles.test.ts` can only assert the CSS *declarations* (there is
 * no layout engine in vitest), so it cannot see the failure this checks — the
 * title's box drifting off the card's text column because a theme restyles the
 * boxes the two percentages resolve against (#125, and #120 before it).
 *
 * The invariant: with `Slides title = filename`, the title's box must sit
 * exactly on the card's text column — the card's border box inset by its own
 * padding. It is measured in two pane shapes, because two different layouts
 * break it:
 *
 *   - **wide** — the root pane at its full width, at every font size in
 *     `--sizes` (10/12/18/23/30/40 by default);
 *   - **narrow** — the pane narrowed by a second root pane, the #120 shape where
 *     the pane is narrower than the card's `80vw` basis, at 12/23/40 × theme.
 *
 * Obsidian caps `baseFontSize` (measured: it accepts 40 in the config and applies
 * 30px), so a size the app will not apply is never reported under its own label:
 * the row shows `requested→applied`. A row is likewise only accepted once the
 * *effective* font size is the one the app should apply for that request,
 * because `setConfig` lands in the DOM a moment later and a row measured in
 * between would report the previous size's geometry.
 *
 * A sidebar cannot narrow the pane here: Slides mode hides the sidebars
 * (styles.css §3), so the right split's state does not move the pane's width
 * (measured: 1376px with it collapsed and expanded alike). The split is what
 * narrows it, and the narrow pass refuses to report rows if it did not.
 *
 * Anything beyond `--tolerance` px of drift fails the run.
 *
 *   npm run check:geometry
 *   node scripts/check-slide-geometry.mjs --sizes 10,23,40 --theme Minimal
 *   node scripts/check-slide-geometry.mjs --note "Grow the Deck"
 *
 * It drives `example-vault/` through scripts/vault-cdp.mjs, so the app must be
 * running with `--remote-debugging-port=9222` and that vault open; the guard
 * refuses anything else. Themes come from the vault's own `.obsidian/themes/`
 * (gitignored): a theme that is not installed is a failure, never a silently
 * skipped row.
 *
 * A theme's stylesheet is injected **asynchronously**: `app.customCss.theme`
 * flips immediately while the CSS lands a moment later, so a measurement taken
 * too early describes the previous theme and reports a false pass — and waiting
 * for the *current* reading to repeat is not enough, because the previous
 * theme's CSS is stable too. Every theme switch therefore captures the injected
 * `<style>` text lengths *before* the switch and waits until that signature has
 * changed, the geometry has then held still for a second, and a minimum time has
 * passed since the switch. A row's evidence that it measured the theme it names
 * is the theme the app reports plus that signature change — not the container's
 * computed max-width, which reads `none` under Slides mode for every theme once
 * the cap is dropped, and so identifies nothing.
 *
 * Everything it changes is restored afterwards — on success, on failure and on
 * Ctrl-C: the theme, the base font size, the title source, Slides mode, the open
 * note, the right split and the pane the narrow pass added. Two of those writes
 * land in **tracked** files — `example-vault/.obsidian/appearance.json` (theme,
 * font size) and `example-vault/.obsidian/plugins/native-slides/data.json` (the
 * title source) — so the restore puts the *values* back but the files stay
 * rewritten: `git restore -- example-vault/.obsidian` afterwards, the duty
 * Obsidian's own config churn already carries (the reminder is printed when the
 * run ends). A restore that fails fails the run.
 *
 * See docs/development.md#driving-the-running-app-over-cdp.
 */

import { connect, sleep } from "./vault-cdp.mjs";

const args = { sizes: "10,12,18,23,30,40", note: "Grow the Deck", theme: [], tolerance: 0.5 };
for (let i = 2; i < process.argv.length; i += 2) {
  const flag = process.argv[i];
  const value = process.argv[i + 1];
  if (!flag?.startsWith("--")) {
    console.error(`check-slide-geometry: unexpected argument ${flag}`);
    process.exit(2);
  }
  const key = flag.slice(2);
  if (value === undefined) {
    console.error(`check-slide-geometry: --${key} needs a value`);
    process.exit(2);
  }
  if (key === "theme") args.theme.push(value);
  else if (key === "tolerance") args.tolerance = Number(value);
  else if (key in args) args[key] = value;
  else {
    console.error(`check-slide-geometry: unknown flag --${key}`);
    process.exit(2);
  }
}
const SIZES = args.sizes.split(",").map(Number);
if (SIZES.some((n) => !Number.isFinite(n) || n <= 0)) {
  console.error(`check-slide-geometry: --sizes must be positive numbers, got ${args.sizes}`);
  process.exit(2);
}
/** The narrow pane's matrix — the #120 shapes (12/23/40 × every theme) */
const NARROW_SIZES = [12, 23, 40];

/** How long the geometry must hold still before a measurement counts as settled */
const SETTLE_MS = 1000;
/** Upper bound on waiting for the app to settle */
const SETTLE_TIMEOUT_MS = 15000;
/** Minimum wait after a theme switch, before a reading may count */
const THEME_MIN_MS = 400;

/** The one message for "the card is not on screen"; every caller shares it */
const NOT_IN_DOM =
  "the card or the card title is not in the DOM — is the note a deck in Slides mode?";

/**
 * Geometry of the card, its text column and the title box, plus the *effective*
 * editor font size, the theme's own line-width cap and the container's computed
 * max-width. The last two are the *fix's* evidence — the cap is what a theme
 * declares, and `none` on the container is that cap being dropped under Slides
 * mode — while which *theme* was measured is evidenced by the per-theme line
 * above its rows, and which *font size* by `fontSize` (never the config, which
 * the app may have capped). Scoped to the active leaf, because the narrow pass
 * has two markdown views open and only the active one carries the Slides-mode
 * rules.
 */
const MEASURE = `(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const view = document.querySelector(".workspace-leaf.mod-active .markdown-source-view.mod-cm6.is-live-preview");
  const card = view?.querySelector(".cm-content");
  const title = view?.querySelector(".inline-title");
  const container = view?.querySelector(".cm-contentContainer");
  if (!card || !title || !container) return null;
  const r = card.getBoundingClientRect();
  const t = title.getBoundingClientRect();
  const cs = getComputedStyle(card);
  const padL = parseFloat(cs.paddingLeft);
  const padR = parseFloat(cs.paddingRight);
  const bodyVars = getComputedStyle(document.body);
  return {
    slidesMode: document.body.classList.contains("native-slides-mode"),
    theme: app.customCss.theme,
    size: app.vault.getConfig("baseFontSize"),
    fontSize: parseFloat(getComputedStyle(view.querySelector(".cm-sizer")).fontSize),
    lineWidthCap: bodyVars.getPropertyValue("--line-width").trim(),
    fileLineWidthCap: bodyVars.getPropertyValue("--file-line-width").trim(),
    containerMaxWidth: getComputedStyle(container).maxWidth,
    paneW: round(view.querySelector(".cm-sizer").getBoundingClientRect().width),
    card: { x: round(r.left), w: round(r.width), right: round(r.right) },
    textCol: { x: round(r.left + padL), right: round(r.right - padR) },
    title: { x: round(t.left), w: round(t.width), right: round(t.right) },
    titleSource: view.getAttribute("data-ns-inline-title"),
  };
})()`;

/**
 * Read the geometry until it has been stable for `SETTLE_MS`. A theme switch
 * needs `settledAfterTheme` instead: the previous theme's CSS is stable too.
 */
async function settled(cdp) {
  const deadline = Date.now() + SETTLE_TIMEOUT_MS;
  let previous = null;
  let stableSince = 0;
  while (Date.now() < deadline) {
    const latest = await cdp.eval(MEASURE);
    const key = JSON.stringify(latest);
    if (key === previous) {
      if (Date.now() - stableSince >= SETTLE_MS) return latest;
    } else {
      previous = key;
      stableSince = Date.now();
    }
    await sleep(200);
  }
  throw new Error(`the layout never settled within ${SETTLE_TIMEOUT_MS}ms`);
}

/** Text lengths of the injected `<style>` elements — a theme's CSS lands in one */
function styleSheets(cdp) {
  return cdp.eval(
    `Array.from(document.querySelectorAll("style")).map((s) => (s.textContent ?? "").length)`,
  );
}

/** One comparable value for a `<style>`-length list */
const signatureOf = (lengths) => lengths.join(",");

/** The same list, for the human reading the evidence line */
const describeSheets = (lengths) =>
  `${lengths.length} sheets / ${lengths.reduce((total, n) => total + n, 0)} chars`;

/**
 * Wait for a theme switch to land and the layout to settle.
 *
 * `beforeSignature` is the `<style>`-length signature captured *before*
 * `setTheme`. Requiring only the current reading to repeat would accept the
 * previous theme's still-injected CSS and report a false pass, so the signature
 * must change first, the geometry must then hold still for `SETTLE_MS`, and at
 * least `THEME_MIN_MS` must have passed since the switch.
 */
async function settledAfterTheme(cdp, beforeSignature) {
  const switchedAt = Date.now();
  const deadline = switchedAt + SETTLE_TIMEOUT_MS;
  let changed = false;
  let previous = null;
  let stableSince = 0;
  while (Date.now() < deadline) {
    const latest = await cdp.eval(MEASURE);
    if (!changed && signatureOf(await styleSheets(cdp)) !== beforeSignature) {
      changed = true;
      // The stability window starts at the change, not before it.
      previous = null;
      stableSince = Date.now();
    }
    const key = JSON.stringify(latest);
    if (
      changed &&
      key === previous &&
      Date.now() - stableSince >= SETTLE_MS &&
      Date.now() - switchedAt >= THEME_MIN_MS
    ) {
      return latest;
    }
    if (key !== previous) {
      previous = key;
      stableSince = Date.now();
    }
    await sleep(200);
  }
  throw new Error(`the theme's stylesheet never landed within ${SETTLE_TIMEOUT_MS}ms`);
}

/**
 * Find the app's own ceiling on `baseFontSize` by asking for the largest size the
 * run wants and reading back the size that was actually applied. Obsidian takes a
 * larger number in its config but applies 30px, so `--sizes 40` would otherwise
 * report a 30px measurement under a 40px label. The request is repeated: a DOM
 * that has not caught up looks like a refusal on the first read and not on the
 * second. Returns null when the app honoured the request.
 */
async function discoverFontSizeCap(cdp, largest) {
  let last = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    await cdp.eval(
      `(async () => { app.vault.setConfig("baseFontSize", ${largest}); return true; })()`,
    );
    const m = await settled(cdp);
    if (!m) throw new Error(NOT_IN_DOM);
    if (Math.abs(m.fontSize - largest) < 0.01) return null;
    last = m.fontSize;
  }
  return last;
}

/**
 * Apply `size` and return the geometry measured once that size is in force.
 *
 * `setConfig` lands in the DOM a moment later, and a row measured in between
 * reports the previous size's geometry, so the effective size is checked and the
 * write repeated when it does not match. `fontSizeCap` is what the app will
 * actually apply (see `discoverFontSizeCap`).
 */
async function applyFontSize(cdp, size) {
  const expected = fontSizeCap === null ? size : Math.min(size, fontSizeCap);
  for (let attempt = 0; attempt < 3; attempt++) {
    await cdp.eval(
      `(async () => { app.vault.setConfig("baseFontSize", ${size}); return true; })()`,
    );
    const m = await settled(cdp);
    if (!m) throw new Error(NOT_IN_DOM);
    if (Math.abs(m.fontSize - expected) < 0.01) return { geometry: m, applied: m.fontSize };
  }
  throw new Error(
    `the app never applied baseFontSize ${size}px (expected ${expected}px) — a row measured here would be labelled with a size that was not in force`,
  );
}

/**
 * Point the card title at `source` ("filename" or a frontmatter property) and
 * refresh. The title source only reaches the DOM on a refresh, so ask for one
 * rather than hoping an event fires. Shared by the setup and the restore, so the
 * two cannot drift apart.
 */
function setTitleSource(cdp, source) {
  return cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    plugin.settings.slidesTitle = ${JSON.stringify(source)};
    await plugin.saveSettings();
    await new Promise((r) => setTimeout(r, 300));
    plugin.refresh();
    await new Promise((r) => setTimeout(r, 300));
    return true;
  })()`);
}

/**
 * Measure one pane shape — every theme × every size — and print it as a table
 * under its own label. Appends to `failures` / `checked`; returns the pane width
 * it measured, or null when no theme could be measured.
 */
async function measurePass(cdp, shape, label, sizes, themes) {
  console.log(`\n${label}`);
  console.log(
    `${"theme".padEnd(14)}${"size".padEnd(6)}${"pane".padEnd(7)}${"card text col".padEnd(19)}${"title".padEnd(19)}${"drift L/R".padEnd(15)}cap / container max-width`,
  );
  let paneW = null;
  for (const theme of themes) {
    const name = theme || "(default)";
    if (theme && !installed.includes(theme)) continue; // already reported as a failure
    const appliedBefore = await cdp.eval(`app.customCss.theme ?? ""`);
    const sheetsBefore = await styleSheets(cdp);
    await cdp.eval(
      `(async () => { app.customCss.setTheme(${JSON.stringify(theme)}); return true; })()`,
    );
    const switched = appliedBefore !== theme;
    if (switched) await settledAfterTheme(cdp, signatureOf(sheetsBefore));
    else await settled(cdp);
    const sheetsAfter = await styleSheets(cdp);
    const signatureChanged = signatureOf(sheetsAfter) !== signatureOf(sheetsBefore);
    const applied = await cdp.eval(`app.customCss.theme ?? ""`);
    console.log(
      `  ${name}: app.customCss.theme=${JSON.stringify(applied)}, injected styles ` +
        `${describeSheets(sheetsBefore)} → ${describeSheets(sheetsAfter)}` +
        (switched
          ? signatureChanged
            ? " (changed)"
            : " (UNCHANGED — the theme's CSS did not land)"
          : " (already applied)"),
    );
    // A row only counts when the theme it names is the theme that was measured:
    // the app's own answer, plus — for a switch — the stylesheet really changing.
    const themeApplied = (m) => (m.theme ?? "") === theme && (!switched || signatureChanged);

    for (const size of sizes) {
      const { geometry: m, applied } = await applyFontSize(cdp, size);
      paneW = m.paneW;
      // Labelled with the size that was in force: a request the app caps reads
      // `40→30`, so no row claims a font size it did not measure.
      const sizeLabel = applied === size ? String(size) : `${size}→${applied}`;
      const driftL = Math.round((m.title.x - m.textCol.x) * 100) / 100;
      const driftR = Math.round((m.title.right - m.textCol.right) * 100) / 100;
      const ok =
        themeApplied(m) && Math.abs(driftL) <= args.tolerance && Math.abs(driftR) <= args.tolerance;
      checked++;
      if (!ok) {
        failures.push(
          themeApplied(m)
            ? `${shape} ${name} @${sizeLabel}px: drift ${driftL}px / ${driftR}px`
            : `${shape} ${name} @${sizeLabel}px: theme not applied (app.customCss.theme=${JSON.stringify(m.theme)})`,
        );
      }
      const cap = [
        m.lineWidthCap && `--line-width: ${m.lineWidthCap}`,
        m.fileLineWidthCap && `--file-line-width: ${m.fileLineWidthCap}`,
      ]
        .filter(Boolean)
        .join(", ");
      console.log(
        `${name.padEnd(14)}${sizeLabel.padEnd(6)}${String(Math.round(m.paneW)).padEnd(7)}` +
          `${`${m.textCol.x}..${m.textCol.right}`.padEnd(19)}${`${m.title.x}..${m.title.right}`.padEnd(19)}` +
          `${`${driftL} / ${driftR}`.padEnd(15)}${ok ? "ok " : "DRIFT "}${cap || "(no line-width cap)"} / ${m.containerMaxWidth}`,
      );
    }
  }
  return paneW;
}

const cdp = await connect();
const failures = [];
let checked = 0;
/** Every theme the vault has installed, read once the app is reachable */
let installed = [];
/** The app's own ceiling on `baseFontSize`, discovered once; null when there is none */
let fontSizeCap = null;
/** What the run found before it changed anything; null until captured */
let snapshot = null;
/** The pane the narrow pass added, so the restore can detach it */
let narrowLeafId = null;
/** The one in-flight restore — the `finally` and the SIGINT handler share it */
let restoring = null;

/**
 * Put the vault back the way the snapshot found it, at most once. Resolves to
 * whether it succeeded: a run that leaves the vault mutated must not exit 0.
 */
function restore() {
  if (!snapshot) return Promise.resolve(true);
  if (!restoring) {
    restoring = restoreVaultState(cdp, snapshot).catch((error) => {
      console.error(`could not restore the vault state: ${String(error)}`);
      return false;
    });
  }
  return restoring;
}

/** The tracked files this run rewrites, and the one command that puts them back */
function printVaultReminder() {
  console.log(
    "note: this run rewrote example-vault/.obsidian/appearance.json and\n" +
      "      example-vault/.obsidian/plugins/native-slides/data.json (both tracked) — restore them\n" +
      "      with `git restore -- example-vault/.obsidian`.",
  );
}

// Ctrl-C mid-run must not leave the vault mutated: the same restore the `finally`
// runs, then a non-zero exit either way.
process.on("SIGINT", () => {
  console.error("\ninterrupted — restoring the vault state before exiting");
  restore().then((ok) => {
    printVaultReminder();
    process.exit(ok ? 130 : 1);
  });
});

/**
 * Undo everything the run changed: the pane the narrow pass added, then the
 * theme, font size, Slides mode, right split, title source and open note.
 */
async function restoreVaultState(cdp, snapshot) {
  if (narrowLeafId) {
    await cdp.eval(`(() => {
      const leaf = app.workspace.getLeafById(${JSON.stringify(narrowLeafId)});
      if (leaf) leaf.detach();
      return true;
    })()`);
    narrowLeafId = null;
    await sleep(500);
  }
  await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    app.customCss.setTheme(${JSON.stringify(snapshot.theme)});
    app.vault.setConfig("baseFontSize", ${snapshot.baseFontSize});
    if (!${snapshot.slidesMode} && document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
    if (${snapshot.pane === "expanded"}) app.workspace.rightSplit.expand();
    await new Promise((r) => setTimeout(r, 500));
    return true;
  })()`);
  await setTitleSource(cdp, snapshot.slidesTitle);
  if (snapshot.activeNote) {
    await cdp.eval(`(async () => {
      const file = app.vault.getAbstractFileByPath(${JSON.stringify(snapshot.activeNote)});
      if (file) await app.workspace.getLeaf(false).openFile(file);
      return true;
    })()`);
  }
  return true;
}

/** The check itself: set up, measure both pane shapes, leave the vault to `restore()`. */
async function run() {
  snapshot = await cdp.eval(`(() => {
    const plugin = app.plugins.plugins["native-slides"];
    return {
      theme: app.vault.getConfig("cssTheme"),
      baseFontSize: app.vault.getConfig("baseFontSize"),
      slidesTitle: plugin.settings.slidesTitle,
      slidesMode: document.body.classList.contains("native-slides-mode"),
      pane: app.workspace.rightSplit.collapsed ? "collapsed" : "expanded",
      activeNote: app.workspace.getActiveFile()?.path ?? null,
    };
  })()`);

  installed = await cdp.eval(`Object.keys(app.customCss.themes ?? {})`);
  const themes = args.theme.length > 0 ? args.theme : ["", ...installed];
  // A theme that is not installed is a failure, never a silently skipped row:
  // the run would otherwise "pass" having measured nothing that was asked for.
  for (const name of args.theme.filter((theme) => !installed.includes(theme))) {
    console.error(
      `check-slide-geometry: --theme ${name} is not installed in example-vault/.obsidian/themes/`,
    );
    failures.push(`--theme ${name}: not installed (installed: ${installed.join(", ") || "none"})`);
  }

  // The affected title source, a deck note open, Slides mode on.
  await cdp.eval(`(async () => {
    app.workspace.rightSplit.collapse();
    await new Promise((r) => setTimeout(r, 400));
    return true;
  })()`);
  await setTitleSource(cdp, "filename");
  await cdp.open(args.note);
  await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    if (!document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
    await new Promise((r) => setTimeout(r, 700));
    plugin.refresh();
    await new Promise((r) => setTimeout(r, 300));
    return true;
  })()`);

  const first = await settled(cdp);
  if (!first || !first.slidesMode) {
    throw new Error(
      `not in Slides mode on "${args.note}" — is it a deck note? (measured ${JSON.stringify(first)})`,
    );
  }
  if (first.titleSource !== "filename") {
    throw new Error(`Slides title is not "filename" (got ${JSON.stringify(first.titleSource)})`);
  }

  // The size a row may be labelled with is the size the app *applies*: Obsidian
  // caps `baseFontSize`, so the largest size the run wants is asked for once.
  fontSizeCap = await discoverFontSizeCap(cdp, Math.max(...SIZES, ...NARROW_SIZES));
  if (fontSizeCap !== null) {
    console.log(
      `\nnote: the app caps baseFontSize at ${fontSizeCap}px — a larger --sizes entry is ` +
        'measured at the cap and labelled "requested→applied"',
    );
  }

  // ── The wide pane ───────────────────────────────────────────────────────
  const widePaneW = await measurePass(
    cdp,
    "wide",
    "wide pane — the root pane at full width",
    SIZES,
    themes,
  );

  // ── The narrow pane: the #120 shape ─────────────────────────────────────
  // Slides mode hides the sidebars (§3), so no sidebar state can narrow the
  // pane — the second root pane is what does (#120's "or split the pane").
  narrowLeafId = await cdp.eval(`(() => {
    const leaf = app.workspace.getLeaf("split", "vertical");
    return leaf?.id ?? null;
  })()`);
  await sleep(500);
  await cdp.open(args.note);
  await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    if (!document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
    await new Promise((r) => setTimeout(r, 700));
    plugin.refresh();
    await new Promise((r) => setTimeout(r, 300));
    return true;
  })()`);
  const narrowShape = await settled(cdp);
  if (!narrowShape) {
    throw new Error("the card or the card title is not in the DOM in the narrow pane");
  }
  if (Number.isFinite(widePaneW) && !(narrowShape.paneW < widePaneW - 1)) {
    throw new Error(
      `the narrow pane is not narrower than the wide one (${narrowShape.paneW}px vs ${widePaneW}px) — ` +
        "rows labelled narrow would prove nothing",
    );
  }
  await measurePass(
    cdp,
    "narrow",
    `narrow pane — split root, ${Math.round(narrowShape.paneW)}px wide (the #120 shape)`,
    NARROW_SIZES,
    themes,
  );
}

let exitCode = 0;
try {
  await run();
} catch (error) {
  console.error(`\ncheck-slide-geometry: ${error?.stack ?? error}`);
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
if (failures.length > 0) {
  console.error(`\n${failures.length} failure(s) over ${checked} measurement(s):`);
  for (const failure of failures) console.error(`  ${failure}`);
  exitCode = 1;
}
if (checked === 0) {
  console.error("\nno measurements were taken — nothing was verified");
  exitCode = 1;
}
if (exitCode === 0) {
  console.log(`\n${checked} measurements, no drift beyond ${args.tolerance}px`);
}
printVaultReminder();
process.exit(exitCode);
