#!/usr/bin/env node
/**
 * slide-style-snapshot.mjs — dump the full computed style of every element
 * Slides mode renders, or diff two dumps.
 *
 * Why: this is the **primary gate** for a stylesheet change that must not move
 * anything — dropping an `!important`, replacing a `:has`, swapping a selector
 * for a more specific one. A pixel diff is the wrong instrument for that job: it
 * carries a sub-perceptual rasteriser flake (measured on an **unchanged** tree:
 * 4 pixels of Δ3/255 at a glyph edge, so `--tolerance 2` on
 * `slide-visual-check.mjs` does not even absorb it, while any real ≤2/255 change
 * is invisible to it). Computed style is exact and deterministic instead — two
 * runs of one tree are byte-identical — and it names the property that moved:
 *
 *   npm run check:style-snapshot -- --out /tmp/before.json
 *   # … edit styles.css, reload the plugin (node scripts/vault-cdp.mjs reload) …
 *   npm run check:style-snapshot -- --diff /tmp/before.json
 *   # or, two captures taken earlier:
 *   npm run check:style-snapshot -- --diff /tmp/before.json /tmp/after.json
 *
 * **The before/after pair must be captured back-to-back, in one session, on one
 * instance.** The dump reads what the app computed, so whatever the app's state
 * contributes is part of the evidence: the theme, the colour scheme, the base
 * font size, the plugin's settings, the measured tab-bar height. The tool pins
 * all of those, but a capture that follows someone else's driving of the app can
 * still start from a different environment — a session that measured a 40px tab
 * bar instead of 38px diffs on every element. Capture the baseline, make the
 * change, reload, capture again; do not compare against a capture from an
 * earlier session.
 *
 * `--diff` exits non-zero on any difference beyond `--tolerance`, printing the
 * path of every property that moved. `--tolerance` applies to numeric values
 * only (px lengths and the like) and defaults to 0: a computed value that moved
 * by 0.01px is a difference, because that is the whole point of the gate.
 *
 * Coverage is bought with a **tall viewport**, not with scrolling. CodeMirror
 * renders only the lines inside the viewport, so a dump of the visible frame
 * would miss whatever is below the fold; scrolling and merging the frames was
 * the earlier approach, but the step positions then depend on the very layout
 * under measurement, so a change could move the steps and report noise. Instead
 * the viewport is overridden to `--height` (default 20000px) for the duration of
 * the run: every line renders at once, one collect covers the whole note, and the
 * width — the axis the card's geometry actually depends on — is left at
 * `--width`. The stylesheet uses no `vh` unit, so height is not part of what is
 * being measured. If a note is still taller than the override, the run fails
 * rather than reporting a partial dump as a pass.
 *
 * It drives `example-vault/` through scripts/vault-cdp.mjs (see
 * docs/development.md#driving-the-running-app-over-cdp): the app must be running
 * with `--remote-debugging-port=9222` and that vault open, or another port via
 * `OBSIDIAN_CDP_PORT` — the dedicated capture instance uses 9333, and a window
 * that has the user's focus is refused. The theme, colour scheme, font size,
 * plugin settings, Slides mode, the right split and the active note are restored
 * afterwards; two of those writes land in **tracked** files
 * (`example-vault/.obsidian/appearance.json` and
 * `example-vault/.obsidian/plugins/native-slides/data.json`), so the restore puts
 * the values back while the files stay rewritten: `git restore --
 * example-vault/.obsidian` afterwards, as the reminder printed at the end says.
 */

import { readFileSync, writeFileSync } from "node:fs";
import {
  captureVaultState,
  connect,
  parseArgs,
  printVaultReminder,
  restoreVaultState,
  sleep,
} from "./vault-cdp.mjs";

const { args, positional } = parseArgs({
  defaults: {
    // Every construct the stylesheet targets, so a rule change cannot hide
    // behind a note that never renders it: the demo note plus the five
    // `typography-sample-*` fixtures `src/debug.ts` already pins, plus a real
    // deck note. `typography-sample-list` carries all four list levels.
    notes:
      "tests/typography-demo,tests/typography-sample-headings,tests/typography-sample-list," +
      "tests/typography-sample-quote,tests/typography-sample-code,tests/typography-sample-media," +
      "Grow the Deck",
    theme: "",
    scheme: "dark",
    size: 23,
    // The tab bar's height is measured once, while it is visible, and reused
    // after Slides mode hides it — so it is an environment input, not a style,
    // and a session that measured a different one diffs on every element. Pinned
    // after each refresh, and recorded in the dump.
    tabbarHeight: 38,
    // The width is the axis the card's geometry depends on; the height only
    // decides how much of the note renders (see the header).
    width: 1440,
    height: 20000,
    tolerance: 0,
    out: "",
    diff: "",
  },
  name: "slide-style-snapshot",
  numeric: ["size", "tabbarHeight", "width", "height", "tolerance"],
  allowPositional: true,
});

/**
 * A cheap signature of the current frame, polled until two consecutive reads
 * agree before the expensive collect runs.
 */
const SIGNATURE = `(() => {
  const root = document.querySelector(".workspace-leaf.mod-active");
  if (!root) return null;
  const card = root.querySelector(".cm-content");
  return [
    root.querySelectorAll("*").length,
    card ? Math.round(card.getBoundingClientRect().height) : -1,
    document.activeElement ? document.activeElement.tagName : "(none)",
    document.body.classList.contains("native-slides-mode") ? "slides" : "plain",
    app.workspace.getActiveFile()?.path ?? "(none)",
  ].join("|");
})()`;

/**
 * Every element Slides mode renders, with its full computed style — every
 * property the engine exposes, not a curated list, so a rule the stylesheet
 * gains later cannot hide behind a missing property. `::before`/`::after` are
 * recorded when they carry `content` (the card title, the bullets, the indent
 * guides); one whose `content` is `none` generates no box, so its other
 * properties mean nothing — and a `content` rule appearing or disappearing still
 * shows up, as the record appearing or disappearing.
 *
 * Each record is keyed by the element's own identity (tag, sorted classes, a
 * text fingerprint, and its occurrence among identical siblings) prefixed by the
 * same identity for up to two ancestors — deliberately **not** by its index in
 * the DOM, so that a rule which adds or removes a sibling cannot renumber every
 * element after it. Identical elements that differ in style are counted as
 * conflicts and reported, so a key collision cannot silently drop a record.
 */
const COLLECT = `(() => {
  const root = document.querySelector(".workspace-leaf.mod-active");
  if (!root) return { error: "no active leaf" };

  const memo = new WeakMap();
  const ident = (el, depth) => {
    if (!el || depth > 2) return "";
    const cached = memo.get(el);
    if (cached !== undefined) return cached;
    const cls = (typeof el.className === "string" ? el.className : "")
      .trim().split(/\\s+/).filter(Boolean).sort().join(".");
    const text = el.childElementCount === 0 ? (el.textContent ?? "").trim().slice(0, 40) : "";
    const own = el.tagName.toLowerCase() + (cls ? "." + cls : "") + (text ? "#" + text : "");
    const value = ident(el.parentElement, depth + 1) + ">" + own;
    memo.set(el, value);
    return value;
  };

  const style = (el, pseudo) => {
    const cs = getComputedStyle(el, pseudo || undefined);
    const out = {};
    for (let i = 0; i < cs.length; i++) out[cs[i]] = cs.getPropertyValue(cs[i]);
    return out;
  };

  const records = {};
  const seen = new Map();
  let conflicts = 0;
  const add = (el, pseudo) => {
    const base = ident(el, 0) + (pseudo || "");
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const key = base + "@" + n;
    const value = style(el, pseudo);
    if (!(key in records)) records[key] = value;
    else if (JSON.stringify(records[key]) !== JSON.stringify(value)) conflicts++;
  };

  const scan = (el, label) => {
    if (label) {
      const value = style(el, "");
      if (!(label in records)) records[label] = value;
      else if (JSON.stringify(records[label]) !== JSON.stringify(value)) conflicts++;
      return;
    }
    add(el, "");
    for (const pseudo of ["::before", "::after"]) {
      const content = getComputedStyle(el, pseudo).content;
      if (content && content !== "none" && content !== "normal") add(el, pseudo);
    }
  };
  for (const el of [root, ...root.querySelectorAll("*")]) scan(el);
  // The slides bar lives outside the leaf.
  const bar = document.querySelector(".native-slides-bar");
  if (bar) for (const el of [bar, ...bar.querySelectorAll("*")]) scan(el);
  // The chrome Slides mode hides lives outside the leaf too, and a display:none
  // rule dropping its !important is exactly the change this tool gates — so the
  // leaf walk above cannot be the whole dump.
  const chrome = {
    "<html>": document.documentElement,
    "<body>": document.body,
    "<status-bar>": document.querySelector(".status-bar"),
    "<ribbon>": document.querySelector(".workspace-ribbon"),
    "<left-split>": document.querySelector(".workspace-split.mod-left-split"),
    "<right-split>": document.querySelector(".workspace-split.mod-right-split"),
    "<tab-header-container>": document.querySelector(
      ".workspace-tabs.mod-top .workspace-tab-header-container",
    ),
    "<view-header>": root.querySelector(".view-header"),
    "<metadata-container>": root.querySelector(".metadata-container"),
  };
  for (const [label, el] of Object.entries(chrome)) if (el) scan(el, label);

  const scroller = root.querySelector(".cm-scroller");
  return {
    records,
    conflicts,
    rendered: root.querySelectorAll("*").length,
    lines: root.querySelectorAll(".cm-line").length,
    // Everything must be inside the overridden viewport, or the dump is partial.
    overflow: scroller ? Math.max(0, scroller.scrollHeight - scroller.clientHeight) : 0,
  };
})()`;

/**
 * What the dump is read against, recorded next to it so a comparison is
 * self-describing and a state difference can be told from a style difference.
 */
const ENVIRONMENT = `(() => {
  const style = getComputedStyle(document.documentElement);
  return {
    theme: app.customCss.theme ?? "",
    scheme: document.body.classList.contains("theme-dark") ? "dark" : "light",
    baseFontSize: app.vault.getConfig("baseFontSize"),
    slidesMode: document.body.classList.contains("native-slides-mode"),
    tabbarHeight: style.getPropertyValue("--native-slides-tabbar-height").trim(),
    barHeight: style.getPropertyValue("--native-slides-bar-height").trim(),
    viewport: window.innerWidth + "x" + window.innerHeight,
    settings: JSON.parse(JSON.stringify(app.plugins.plugins["native-slides"].settings)),
  };
})()`;

/** Poll the cheap signature until two consecutive reads agree, then collect once */
async function settledCollect(cdp) {
  let previous = null;
  for (let i = 0; i < 60; i++) {
    const signature = await cdp.eval(SIGNATURE);
    if (signature !== null && signature === previous) return cdp.eval(COLLECT);
    previous = signature;
    await sleep(150);
  }
  return cdp.eval(COLLECT);
}

/** Flatten a dump to `path -> value`, for a line-by-line diff */
function flatten(value, prefix = "", out = {}) {
  if (value === null || typeof value !== "object") {
    out[prefix] = value;
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix} :: ${k}` : k, out);
  return out;
}

/** Compare two dumps and exit non-zero on drift */
function compare(leftPath, rightPath, right) {
  const left = JSON.parse(readFileSync(leftPath, "utf8"));
  const a = flatten(left.notes);
  const b = flatten(right.notes);
  const drift = [];
  for (const key of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
    const av = a[key];
    const bv = b[key];
    if (av === undefined || bv === undefined) {
      drift.push(`${key}: ${JSON.stringify(av)} → ${JSON.stringify(bv)}`);
      continue;
    }
    if (typeof av === "number" && typeof bv === "number") {
      if (Math.abs(av - bv) > args.tolerance) drift.push(`${key}: ${av} → ${bv}`);
      continue;
    }
    if (JSON.stringify(av) !== JSON.stringify(bv)) {
      drift.push(`${key}: ${JSON.stringify(av)} → ${JSON.stringify(bv)}`);
    }
  }
  const where = rightPath ? `${leftPath} vs ${rightPath}` : `${leftPath} vs this run`;
  if (drift.length === 0) {
    console.log(`\nno style difference beyond ${args.tolerance} (${where})`);
    return;
  }
  console.error(`\n${drift.length} value(s) differ (${where}):`);
  for (const d of drift.slice(0, 200)) console.error(`  ${d}`);
  if (drift.length > 200) console.error(`  … ${drift.length - 200} more`);
  process.exit(1);
}

const cdp = args.diff && positional.length ? null : await connect();
const snapshot = { pinned: null, environment: null, notes: {} };
let restore = null;

if (cdp) {
  try {
    // Pin everything the computed style depends on, so a difference between two
    // captures can only come from the styles.
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: args.width,
      height: args.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    restore = await captureVaultState(cdp, { pluginSettings: true });

    await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    plugin.settings.slidesTitle = "filename";
    plugin.settings.slidesTheme = "jyy";
    plugin.settings.barProperties = "series, level, date";
    plugin.settings.pageNumberStyle = "current";
    plugin.settings.showNavButtons = true;
    plugin.settings.showProgress = true;
    plugin.settings.imageLayout = true;
    plugin.settings.barHidden = false;
    // Equal columns: the stored widths are whatever a previous drag left, and
    // the bar's chips are part of the dump.
    plugin.settings.barPropertyWidths = "";
    await plugin.saveSettings();
    app.customCss.setTheme(${JSON.stringify(args.theme)});
    app.vault.setConfig("baseFontSize", ${args.size});
    app.changeTheme(${JSON.stringify(args.scheme === "dark" ? "obsidian" : "moonstone")});
    app.workspace.rightSplit.collapse();
    await new Promise((r) => setTimeout(r, 1500));
    return true;
  })()`);
    snapshot.pinned = {
      theme: args.theme,
      scheme: args.scheme,
      baseFontSize: args.size,
      tabbarHeight: args.tabbarHeight,
      viewport: `${args.width}x${args.height}`,
      notes: args.notes,
    };
    snapshot.environment = await cdp.eval(ENVIRONMENT);

    for (const note of args.notes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)) {
      const exists = await cdp.eval(
        `(() => {
        const direct = app.vault.getAbstractFileByPath(${JSON.stringify(note)});
        const withExt = app.vault.getAbstractFileByPath(${JSON.stringify(note)} + ".md");
        const link = app.metadataCache.getFirstLinkpathDest(${JSON.stringify(note)}, "");
        return !!(direct || withExt || link);
      })()`,
      );
      if (!exists) {
        throw new Error(
          `refusing to measure "${note}": it does not resolve to a file in example-vault/. ` +
            `openLinkText would create an empty note, and the dump would silently cover the wrong set of elements.`,
        );
      }
      await cdp.open(note);
      await cdp.eval(`(async () => {
      const plugin = app.plugins.plugins["native-slides"];
      if (!document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
      await new Promise((r) => setTimeout(r, 700));
      plugin.refresh();
      await new Promise((r) => setTimeout(r, 400));
      // The tab-bar height is measured while the tab bar is visible and reused
      // afterwards, so it carries whatever the session measured into every
      // element's style. Pin it after the refresh (which re-applies the plugin's
      // cache) and record it, so a run cannot silently differ from its pair by
      // this one input.
      document.documentElement.style.setProperty(
        "--native-slides-tabbar-height",
        ${JSON.stringify(`${args.tabbarHeight}px`)},
      );
      // Opening the note focuses the editor; the active line carries a
      // background tint and one extra pixel of layout, which would make the
      // dump depend on where the caret landed.
      document.body.focus();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      const scroller = document.querySelector(
        ".workspace-leaf.mod-active .markdown-source-view.mod-cm6.is-live-preview .cm-scroller",
      );
      if (scroller) scroller.scrollTop = 0;
      return true;
    })()`);
      await sleep(500);

      const { records, conflicts, rendered, lines, overflow, error } = await settledCollect(cdp);
      if (error) throw new Error(`could not measure "${note}": ${error}`);
      if (overflow > 1) {
        throw new Error(
          `"${note}" is ${overflow}px taller than the ${args.height}px viewport override, so CodeMirror ` +
            `is not rendering all of it — the dump would be partial. Raise --height.`,
        );
      }
      if (rendered === 0 || lines === 0) {
        throw new Error(`"${note}" rendered no lines — refusing to record an empty dump`);
      }
      snapshot.notes[note] = { records, conflicts };
      console.log(
        `measured ${note}: ${Object.keys(records).length} style records over ${rendered} elements ` +
          `(${lines} lines)${conflicts ? `, ${conflicts} identity conflict(s)` : ""}`,
      );
    }
  } finally {
    if (restore) {
      await restoreVaultState(cdp, restore).catch((error) =>
        console.error(`could not restore the vault state: ${String(error)}`),
      );
    }
    await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
    cdp.ws.close();
  }
  printVaultReminder([
    "example-vault/.obsidian/appearance.json",
    "example-vault/.obsidian/plugins/native-slides/data.json",
  ]);
}

if (args.diff) {
  const rightPath = positional[0] ?? "";
  compare(args.diff, rightPath, rightPath ? JSON.parse(readFileSync(rightPath, "utf8")) : snapshot);
} else if (args.out) {
  if (positional.length) {
    console.error(
      `slide-style-snapshot: unexpected argument ${positional[0]} (only --diff takes a second file)`,
    );
    process.exit(2);
  }
  writeFileSync(args.out, JSON.stringify(snapshot, null, 1));
  console.log(`\nwrote ${args.out}`);
} else {
  console.log(
    [
      "usage: slide-style-snapshot.mjs --out <file> | --diff <before.json> [<after.json>]",
      "",
      "  --notes <a,b>          notes to measure (default: the demo note, the five typography-sample-* fixtures, a deck note)",
      "  --theme <name>         the pinned theme (default: Obsidian's own)",
      "  --scheme <light|dark>  the pinned colour scheme (default: dark)",
      "  --size <px>            the pinned base font size (default: 23)",
      "  --tabbar-height <px>   the pinned --native-slides-tabbar-height (default: 38)",
      "  --width <px>           the pinned viewport width (default: 1440)",
      "  --height <px>          the viewport height the whole note must fit in (default: 20000)",
      "  --tolerance <n>        numeric drift allowed in --diff (default: 0)",
    ].join("\n"),
  );
  process.exit(2);
}
