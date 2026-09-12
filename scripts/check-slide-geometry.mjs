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
 * padding — at every font size, in every theme, in a wide and in a narrow pane.
 * Anything beyond `--tolerance` px of drift fails the run.
 *
 *   node scripts/check-slide-geometry.mjs
 *   node scripts/check-slide-geometry.mjs --sizes 10,23,40 --theme Minimal
 *   node scripts/check-slide-geometry.mjs --note "Grow the Deck"
 *
 * It drives `example-vault/` through scripts/vault-cdp.mjs, so the app must be
 * running with `--remote-debugging-port=9222` and that vault open; the guard
 * refuses anything else. Themes come from the vault's own `.obsidian/themes/`
 * (gitignored), so a missing theme is skipped with a note rather than failing.
 * Everything it changes — theme, base font size, the title source, Slides mode —
 * is restored afterwards, including on failure.
 *
 * A theme's stylesheet is injected **asynchronously**: `app.customCss.theme`
 * flips immediately while the CSS lands a moment later, so a measurement taken
 * too early describes the previous theme and reports a false pass. Every wait
 * here therefore runs for a minimum time *and* until the geometry (which
 * includes the container's computed max-width) has been stable for a second;
 * the table prints the applied theme and its line-width cap as evidence of what
 * was actually measured.
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

/** How long the geometry must hold still before a measurement counts as settled */
const SETTLE_MS = 1000;
/** Upper bound on waiting for the app to settle */
const SETTLE_TIMEOUT_MS = 15000;

/**
 * Geometry of the card, its text column, the title box, and the boxes the two
 * percentages resolve against — plus the theme's own line-width cap, so the
 * table shows whether that theme's cap was in force.
 */
const MEASURE = `(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const view = document.querySelector(".markdown-source-view.mod-cm6.is-live-preview");
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
    themeConfig: app.vault.getConfig("cssTheme"),
    size: app.vault.getConfig("baseFontSize"),
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
 * Read the geometry until it has been stable for `SETTLE_MS` — a theme's CSS
 * lands asynchronously, so agreement between two reads is not enough.
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

const cdp = await connect();
const failures = [];
let checked = 0;
let restore = null;

try {
  restore = await cdp.eval(`(() => {
    const plugin = app.plugins.plugins["native-slides"];
    return {
      theme: app.vault.getConfig("cssTheme"),
      baseFontSize: app.vault.getConfig("baseFontSize"),
      slidesTitle: plugin.settings.slidesTitle,
      slidesMode: document.body.classList.contains("native-slides-mode"),
      pane: app.workspace.rightSplit.collapsed ? "collapsed" : "expanded",
    };
  })()`);

  const installed = await cdp.eval(`Object.keys(app.customCss.themes ?? {})`);
  const themes = args.theme.length > 0 ? args.theme : ["", ...installed];

  // The affected title source, a deck note open, Slides mode on. The title
  // source only reaches the DOM on a refresh, so refresh explicitly rather than
  // hoping an event fires.
  await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    plugin.settings.slidesTitle = "filename";
    await plugin.saveSettings();
    app.workspace.rightSplit.collapse();
    await new Promise((r) => setTimeout(r, 400));
    plugin.refresh();
    await new Promise((r) => setTimeout(r, 300));
    return true;
  })()`);
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

  console.log(
    `${"theme".padEnd(14)}${"size".padEnd(6)}${"pane".padEnd(7)}${"card text col".padEnd(19)}${"title".padEnd(19)}${"drift L/R".padEnd(15)}cap / container max-width`,
  );

  for (const theme of themes) {
    if (theme && !installed.includes(theme)) {
      console.log(`${theme.padEnd(14)}(not installed — skipped)`);
      continue;
    }
    await cdp.eval(
      `(async () => { app.customCss.setTheme(${JSON.stringify(theme)}); return true; })()`,
    );

    for (const size of SIZES) {
      await cdp.eval(
        `(async () => { app.vault.setConfig("baseFontSize", ${size}); return true; })()`,
      );
      const m = await settled(cdp);

      // Evidence that the requested theme is the one that was measured: the
      // applied theme must match, or the row says nothing.
      const themeApplied = (m.theme ?? "") === theme;
      const driftL = Math.round((m.title.x - m.textCol.x) * 100) / 100;
      const driftR = Math.round((m.title.right - m.textCol.right) * 100) / 100;
      const ok =
        themeApplied && Math.abs(driftL) <= args.tolerance && Math.abs(driftR) <= args.tolerance;
      checked++;
      if (!ok) {
        failures.push(
          themeApplied
            ? `${theme || "(default)"} @${size}px: drift ${driftL}px / ${driftR}px`
            : `${theme || "(default)"} @${size}px: theme not applied (got ${JSON.stringify(m.theme)})`,
        );
      }
      const cap = [
        m.lineWidthCap && `--line-width: ${m.lineWidthCap}`,
        m.fileLineWidthCap && `--file-line-width: ${m.fileLineWidthCap}`,
      ]
        .filter(Boolean)
        .join(", ");
      console.log(
        `${(theme || "(default)").padEnd(14)}${String(size).padEnd(6)}${String(Math.round(m.paneW)).padEnd(7)}` +
          `${`${m.textCol.x}..${m.textCol.right}`.padEnd(19)}${`${m.title.x}..${m.title.right}`.padEnd(19)}` +
          `${`${driftL} / ${driftR}`.padEnd(15)}${ok ? "ok " : "DRIFT "}${cap || "(no line-width cap)"} / ${m.containerMaxWidth}`,
      );
    }
  }
} finally {
  if (restore) {
    await cdp
      .eval(
        `(async () => {
        const plugin = app.plugins.plugins["native-slides"];
        app.customCss.setTheme(${JSON.stringify(restore.theme)});
        app.vault.setConfig("baseFontSize", ${restore.baseFontSize});
        plugin.settings.slidesTitle = ${JSON.stringify(restore.slidesTitle)};
        await plugin.saveSettings();
        if (!${restore.slidesMode} && document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
        if (${restore.pane === "expanded"}) app.workspace.rightSplit.expand();
        plugin.refresh();
        await new Promise((r) => setTimeout(r, 500));
        return true;
      })()`,
      )
      .catch((error) => console.error(`could not restore the vault state: ${String(error)}`));
  }
  cdp.ws.close();
}

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${checked} measurements failed:`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`\n${checked} measurements, no drift beyond ${args.tolerance}px`);
