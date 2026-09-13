#!/usr/bin/env node
/**
 * slide-geometry-snapshot.mjs — dump the computed slide geometry, or diff two
 * dumps.
 *
 * Why: the plugin's styles.css pins the card's layout by hand — every offset is
 * a measured number — and refactors there (dropping `!important`, replacing
 * `:has`) are exactly the changes that a unit test cannot see and a screenshot
 * only catches by eye. This captures the numbers a person would compare by
 * hand, so a refactor can be proved to have moved nothing:
 *
 *   node scripts/slide-geometry-snapshot.mjs --out /tmp/before.json
 *   # … edit styles.css, reload the plugin …
 *   node scripts/slide-geometry-snapshot.mjs --diff /tmp/before.json
 *
 * The diff exits non-zero on any drift beyond `--tolerance`, and prints the
 * path of every value that moved, so a deliberate change is visible as its own
 * line rather than buried in noise.
 *
 * It drives `example-vault/` through scripts/vault-cdp.mjs (see
 * docs/development.md#driving-the-running-app-over-cdp): the app must be
 * running with `--remote-debugging-port=9222` and that vault open. It opens the
 * notes it measures, leaves Slides mode and the theme as it found them, and
 * needs no vault writes.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { connect, sleep } from "./vault-cdp.mjs";

const args = {
  notes: "tests/typography-demo,Grow the Deck",
  theme: "",
  size: 23,
  tolerance: 0.5,
  out: "",
  diff: "",
};
for (let i = 2; i < process.argv.length; i += 2) {
  const flag = process.argv[i];
  const value = process.argv[i + 1];
  if (!flag?.startsWith("--")) {
    console.error(`slide-geometry-snapshot: unexpected argument ${flag}`);
    process.exit(2);
  }
  const key = flag.slice(2);
  if (value === undefined) {
    console.error(`slide-geometry-snapshot: --${key} needs a value`);
    process.exit(2);
  }
  if (key === "notes") args.notes = value;
  else if (key === "theme") args.theme = value;
  else if (key === "size") args.size = Number(value);
  else if (key === "tolerance") args.tolerance = Number(value);
  else if (key === "out") args.out = value;
  else if (key === "diff") args.diff = value;
  else {
    console.error(`slide-geometry-snapshot: unknown flag --${key}`);
    process.exit(2);
  }
}

/**
 * Everything the card's layout is made of, rounded to 0.01px so sub-pixel
 * rendering noise does not read as a change. Every selector is scoped to the
 * active leaf: Slides mode can have more than one markdown view open.
 */
const MEASURE = `(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const view = document.querySelector(".workspace-leaf.mod-active .markdown-source-view.mod-cm6.is-live-preview");
  if (!view) return { error: "no live preview in the active leaf" };
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: round(r.left), y: round(r.top), w: round(r.width), h: round(r.height) };
  };
  const decl = (el, props) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const out = {};
    for (const p of props) out[p] = s.getPropertyValue(p);
    return out;
  };

  const card = view.querySelector(".cm-content");
  const cardStyle = card ? getComputedStyle(card) : null;
  const out = {
    theme: app.customCss.theme ?? "",
    baseFontSize: app.vault.getConfig("baseFontSize"),
    slidesMode: document.body.classList.contains("native-slides-mode"),
    imagesBlocked: document.body.classList.contains("native-slides-block-images"),
    sizer: box(view.querySelector(".cm-sizer")),
    container: box(view.querySelector(".cm-contentContainer")),
    card: box(card),
    cardDecl: decl(card, [
      "padding-top", "padding-right", "padding-bottom", "padding-left",
      "min-height", "width", "max-width", "font-size", "line-height",
    ]),
    title: box(view.querySelector(".inline-title")),
    titleDecl: decl(view.querySelector(".inline-title"), [
      "font-size", "line-height", "letter-spacing", "padding-top", "padding-bottom",
      "width", "max-width", "margin-inline-start", "margin-inline-end", "border-bottom-width",
    ]),
    bar: box(document.querySelector(".native-slides-bar")),
    // Every rendered line: the numbers the typography rules pin.
    lines: Array.from(view.querySelectorAll(".cm-line")).map((el, i) => ({
      i,
      cls: (el.className || "").replace(/cm-line\\s*/, "").trim().slice(0, 48),
      box: box(el),
      decl: decl(el, [
        "padding-top", "padding-bottom", "padding-left", "padding-right",
        "padding-inline-start", "padding-inline-end",
        "margin-top", "margin-bottom", "margin-left", "margin-right",
        "text-indent", "line-height", "font-size", "max-width", "width",
      ]),
    })),
    // The inline styles Obsidian itself writes, so a refactor that stops
    // fighting them is visible as a change here.
    inlineStyled: Array.from(view.querySelectorAll(".cm-line[style], .cm-content[style]")).map((el) => ({
      cls: (el.className || el.tagName).toString().slice(0, 48),
      style: (el.getAttribute("style") ?? "").slice(0, 120),
    })),
  };
  // The UI Slides mode hides, and the cursor it suppresses: the targets of the
  // display:none / cursor:none rules, which no card-geometry number would catch.
  const chrome = {
    statusBar: ".status-bar",
    ribbon: ".workspace-ribbon",
    leftSplit: ".workspace-split.mod-left-split",
    rightSplit: ".workspace-split.mod-right-split",
    tabHeader: ".workspace-tabs.mod-top .workspace-tab-header-container",
    foldIndicator: ".cm-fold-indicator",
    propertiesPanel: ".metadata-container",
    embeddedBacklinks: ".embedded-backlinks",
  };
  out.chrome = {};
  for (const [name, sel] of Object.entries(chrome)) {
    const el = document.querySelector(sel);
    out.chrome[name] = el ? { display: getComputedStyle(el).display, box: box(el) } : "(missing)";
  }
  out.cursor = {};
  for (const sel of ["body", ".cm-content", ".cm-line", ".native-slides-bar", ".inline-title"]) {
    const el = sel === "body" ? document.body : document.querySelector(sel);
    out.cursor[sel] = el ? getComputedStyle(el).cursor : "(missing)";
  }
  // Image/embed geometry, when the note has any.
  out.media = Array.from(view.querySelectorAll(".cm-line img, .cm-line .internal-embed")).map((el, i) => ({
    i,
    tag: el.tagName.toLowerCase(),
    box: box(el),
    decl: decl(el, ["display", "margin-left", "margin-right", "max-width", "width"]),
  }));
  return out;
})()`;

/** Read until two consecutive reads agree, so async layout work cannot race us */
async function settled(cdp) {
  let previous = null;
  for (let i = 0; i < 25; i++) {
    const m = await cdp.eval(MEASURE);
    const key = JSON.stringify(m);
    if (previous === key) return m;
    previous = key;
    await sleep(200);
  }
  return cdp.eval(MEASURE);
}

/** Flatten a snapshot to `path -> value`, for a line-by-line diff */
function flatten(value, prefix = "", out = {}) {
  if (value === null || typeof value !== "object") {
    out[prefix] = value;
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  return out;
}

const cdp = await connect();
const snapshot = { notes: {} };
let restore = null;

try {
  restore = await cdp.eval(`(() => {
    const plugin = app.plugins.plugins["native-slides"];
    return {
      theme: app.vault.getConfig("cssTheme"),
      baseFontSize: app.vault.getConfig("baseFontSize"),
      slidesMode: document.body.classList.contains("native-slides-mode"),
      pane: app.workspace.rightSplit.collapsed ? "collapsed" : "expanded",
      activeNote: app.workspace.getActiveFile()?.path ?? null,
    };
  })()`);

  await cdp.eval(`(async () => {
    app.customCss.setTheme(${JSON.stringify(args.theme)});
    app.vault.setConfig("baseFontSize", ${args.size});
    app.workspace.rightSplit.collapse();
    await new Promise((r) => setTimeout(r, 400));
    return true;
  })()`);

  for (const note of args.notes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)) {
    await cdp.open(note);
    await cdp.eval(`(async () => {
      const plugin = app.plugins.plugins["native-slides"];
      if (!document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
      await new Promise((r) => setTimeout(r, 700));
      plugin.refresh();
      await new Promise((r) => setTimeout(r, 300));
      return true;
    })()`);
    const m = await settled(cdp);
    if (m?.error || !m?.slidesMode) {
      throw new Error(
        `could not measure "${note}" in Slides mode: ${JSON.stringify(m)?.slice(0, 200)}`,
      );
    }
    snapshot.notes[note] = m;
    console.log(`measured ${note}: ${m.lines.length} lines, ${m.media.length} media`);
  }
} finally {
  if (restore) {
    await cdp
      .eval(
        `(async () => {
        const plugin = app.plugins.plugins["native-slides"];
        app.customCss.setTheme(${JSON.stringify(restore.theme)});
        app.vault.setConfig("baseFontSize", ${restore.baseFontSize});
        if (!${restore.slidesMode} && document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
        if (${restore.pane === "expanded"}) app.workspace.rightSplit.expand();
        if (${JSON.stringify(restore.activeNote)} && ${JSON.stringify(restore.activeNote)} !== (app.workspace.getActiveFile()?.path ?? null)) {
          const file = app.vault.getAbstractFileByPath(${JSON.stringify(restore.activeNote)});
          if (file) await app.workspace.getLeaf(false).openFile(file);
        }
        plugin.refresh();
        await new Promise((r) => setTimeout(r, 400));
        return true;
      })()`,
      )
      .catch((error) => console.error(`could not restore the vault state: ${String(error)}`));
  }
  cdp.ws.close();
}

if (args.diff) {
  const before = JSON.parse(readFileSync(args.diff, "utf8"));
  const a = flatten(before.notes);
  const b = flatten(snapshot.notes);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const drift = [];
  for (const key of [...keys].sort()) {
    // Obsidian's own inline style *values* are not our contract: CodeMirror
    // recomputes them per render (the scroll-past-end `padding-bottom` moves
    // with the content), so comparing them reports noise. Their *presence* is
    // still in the dump, where a refactor that stops fighting an inline style
    // shows up as a moved computed value instead.
    if (/^.*\.inlineStyled\[\d+\]\.style$/.test(key)) continue;
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") {
      if (Math.abs(av - bv) > args.tolerance) drift.push(`${key}: ${av} → ${bv}`);
    } else if (JSON.stringify(av) !== JSON.stringify(bv)) {
      drift.push(`${key}: ${JSON.stringify(av)} → ${JSON.stringify(bv)}`);
    }
  }
  if (drift.length === 0) {
    console.log(`\nno drift beyond ${args.tolerance} against ${args.diff}`);
  } else {
    console.error(`\n${drift.length} value(s) moved against ${args.diff}:`);
    for (const d of drift) console.error(`  ${d}`);
    process.exit(1);
  }
} else if (args.out) {
  writeFileSync(args.out, JSON.stringify(snapshot, null, 2));
  console.log(`\nwrote ${args.out}`);
} else {
  console.log(JSON.stringify(snapshot, null, 2));
}
