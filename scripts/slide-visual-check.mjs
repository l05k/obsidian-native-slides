#!/usr/bin/env node
/**
 * slide-visual-check.mjs — capture deterministic screenshots of the slides, and
 * compare two captures pixel by pixel.
 *
 * Why: styles.css pins the card's layout by hand, so a refactor there (dropping
 * `!important`, replacing `:has`) is exactly the change a unit test cannot see.
 * `slide-geometry-snapshot.mjs` compares the numbers; this compares the pixels,
 * which is what a person would actually check:
 *
 *   node scripts/slide-visual-check.mjs --out /tmp/before
 *   # … edit styles.css, reload the plugin …
 *   node scripts/slide-visual-check.mjs --out /tmp/after
 *   node scripts/slide-visual-check.mjs --diff /tmp/before /tmp/after
 *
 * Determinism is the whole game, so the capture pins everything that could move
 * on its own: a fixed viewport through `Emulation.setDeviceMetricsOverride` (the
 * real window size is irrelevant), animations/transitions/caret off, a fixed
 * theme, font size and plugin config, and a settle-and-repeat read before each
 * shot. `--diff` reports the differing pixel count and the bounding box of the
 * difference, and exits non-zero on anything beyond `--max-diff` pixels — so
 * first prove the capture is stable by diffing a directory against a second
 * capture of the same tree, and only then trust a before/after comparison.
 *
 * It drives `example-vault/` through scripts/vault-cdp.mjs (see
 * docs/development.md#driving-the-running-app-over-cdp): the app must be running
 * with `--remote-debugging-port=9222` and that vault open. The theme, font size,
 * plugin settings, Slides mode and the active note are restored afterwards; the
 * tracked `example-vault/.obsidian` files it rewrites are reported at the end.
 *
 * `--diff` shells out to `python3` with **Pillow** on `PATH` — the only part of
 * the repository that needs Python — so a missing interpreter is an error, not
 * a pass: an empty comparison (no `*.png` on either side) fails rather than
 * reporting "no visual difference".
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
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
    notes: "tests/typography-demo,tests/typography-sample-list,Grow the Deck",
    schemes: "light,dark",
    width: 1440,
    height: 900,
    theme: "",
    size: 23,
    out: "",
    diff: "",
    maxDiff: 0,
    tolerance: 0,
  },
  name: "slide-visual-check",
  numeric: ["width", "height", "size", "maxDiff", "tolerance"],
  allowPositional: true,
});

// ── diff mode: compare two capture directories with PIL ────────────────────
if (args.diff) {
  const [left, right] = [args.diff, positional[0]];
  if (!left || !right) {
    console.error("slide-visual-check: --diff <dirA> <dirB>");
    process.exit(2);
  }
  for (const dir of [left, right]) {
    if (!existsSync(dir)) {
      console.error(`slide-visual-check: no such capture directory: ${dir}`);
      process.exit(2);
    }
  }
  // An empty comparison is not a pass. The name set below is the *union* of
  // both directories, so two empty directories would report "no visual
  // difference" and exit 0 — the one silent way this gate could be satisfied
  // without comparing anything.
  const present = [left, right].flatMap((dir) =>
    readdirSync(dir).filter((file) => file.endsWith(".png")),
  );
  if (present.length === 0) {
    console.error(
      `slide-visual-check: no *.png in ${left} or ${right} — refusing to report "no visual difference" for an empty comparison`,
    );
    process.exit(1);
  }
  const program = `
import json, sys
from pathlib import Path
from PIL import Image, ImageChops

left, right, max_diff, tolerance = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
names = sorted({p.name for p in Path(left).glob("*.png")} | {p.name for p in Path(right).glob("*.png")})
report, failed = [], 0
for name in names:
    a_path, b_path = Path(left) / name, Path(right) / name
    if not a_path.exists() or not b_path.exists():
        report.append({"name": name, "error": "missing on one side"})
        failed += 1
        continue
    a, b = Image.open(a_path).convert("RGBA"), Image.open(b_path).convert("RGBA")
    if a.size != b.size:
        report.append({"name": name, "error": f"size {a.size} vs {b.size}"})
        failed += 1
        continue
    diff = ImageChops.difference(a, b).convert("L")
    # A per-pixel tolerance absorbs the last bit of rasteriser noise without
    # hiding a real move: point() maps "at most tolerance" to 0.
    if tolerance > 0:
        diff = diff.point(lambda v: 0 if v <= tolerance else 255)
    bbox = diff.getbbox()
    count = sum(1 for v in diff.getdata() if v)
    entry = {"name": name, "diffPixels": count, "total": a.size[0] * a.size[1]}
    if bbox:
        entry["bbox"] = list(bbox)
    if count > max_diff:
        failed += 1
    report.append(entry)
print(json.dumps({"failed": failed, "report": report}, indent=2))
sys.exit(1 if failed else 0)
`;
  try {
    const out = execFileSync(
      "python3",
      ["-c", program, left, right, String(args.maxDiff), String(args.tolerance)],
      { encoding: "utf8" },
    );
    const parsed = JSON.parse(out);
    for (const entry of parsed.report) {
      if (entry.error) console.error(`  ${entry.name}: ${entry.error}`);
      else if (entry.diffPixels > args.maxDiff)
        console.error(
          `  ${entry.name}: ${entry.diffPixels} differing px, bbox ${JSON.stringify(entry.bbox)}`,
        );
      else console.log(`  ${entry.name}: identical`);
    }
    console.log(
      parsed.failed === 0 ? "\nno visual difference" : `\n${parsed.failed} shot(s) differ`,
    );
    process.exit(parsed.failed === 0 ? 0 : 1);
  } catch (error) {
    const out = error.stdout ?? "";
    if (out) {
      const parsed = JSON.parse(out);
      for (const entry of parsed.report) {
        if (entry.error) console.error(`  ${entry.name}: ${entry.error}`);
        else if (entry.diffPixels > args.maxDiff)
          console.error(
            `  ${entry.name}: ${entry.diffPixels}/${entry.total} differing px, bbox ${JSON.stringify(entry.bbox)}`,
          );
        else console.log(`  ${entry.name}: identical`);
      }
      console.error(`\n${parsed.failed} shot(s) differ`);
    } else {
      console.error(`slide-visual-check: pixel diff failed: ${String(error)}`);
    }
    process.exit(1);
  }
}

// ── capture mode ───────────────────────────────────────────────────────────
if (!args.out) {
  console.error(
    [
      "usage: slide-visual-check.mjs --out <dir> | --diff <dirA> <dirB>",
      "",
      "  --notes <a,b>      notes to shoot (default: the typography demo, the list sample, a deck note)",
      "  --schemes <a,b>    colour schemes (default: light,dark)",
      "  --width/--height   the pinned viewport (default: 1440x900)",
      "  --theme/--size     the pinned theme and base font size",
      "  --maxDiff <n>      differing pixels allowed in --diff (default: 0)",
    ].join("\n"),
  );
  process.exit(2);
}

const cdp = await connect();
let restore = null;
let captured = 0;

try {
  // Pin everything the layout depends on, so a difference between two captures
  // can only come from the styles.
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: args.width,
    height: args.height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  restore = await captureVaultState(cdp, { pluginSettings: true });

  await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    // A deterministic card: the same title source, the same template, and no
    // bar properties (their values differ per note and are not under test).
    plugin.settings.slidesTitle = "filename";
    plugin.settings.slidesTheme = "jyy";
    plugin.settings.barProperties = "series, level, date";
    plugin.settings.pageNumberStyle = "current";
    plugin.settings.showNavButtons = true;
    plugin.settings.showProgress = true;
    plugin.settings.imageLayout = true;
    plugin.settings.barHidden = false;
    await plugin.saveSettings();
    app.customCss.setTheme(${JSON.stringify(args.theme)});
    app.vault.setConfig("baseFontSize", ${args.size});
    app.workspace.rightSplit.collapse();
    await new Promise((r) => setTimeout(r, 400));
    return true;
  })()`);

  // Focus state is part of the visual: a `.cm-active` line carries a
  // background tint and one extra pixel of layout, so a previous run that
  // left the caret on a task line will not match a run that did not. Slides
  // mode and the leaf set are settled once here; the caret is dropped out of
  // the document **after every note is opened** (below), because the open
  // itself focuses the editor again.
  await cdp.eval(`(async () => {
    const plugin = app.plugins.plugins["native-slides"];
    // Make sure we are in Slides mode (the user may have left it).
    if (!document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
    await new Promise((r) => setTimeout(r, 400));
    // Collapse any extra leaves the test may have left open.
    for (const leaf of [...app.workspace.getLeavesOfType("markdown")]) {
      if (leaf !== app.workspace.activeLeaf) leaf.detach();
    }
    await new Promise((r) => setTimeout(r, 300));
    return true;
  })()`);

  // Freeze animation: the caret blinks and CodeMirror animates its cursor layer,
  // which would make two captures of the same tree differ.
  await cdp.eval(`(() => {
    const id = "ns-visual-check-freeze";
    document.getElementById(id)?.remove();
    const style = document.createElement("style");
    style.id = id;
    style.textContent = \`
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    \`;
    document.head.appendChild(style);
    return true;
  })()`);

  mkdirSync(args.out, { recursive: true });

  for (const note of args.notes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)) {
    await cdp.open(note);
    await cdp.eval(
      `(async () => {
      const plugin = app.plugins.plugins["native-slides"];
      if (!document.body.classList.contains("native-slides-mode")) plugin.toggleSlides();
      await new Promise((r) => setTimeout(r, 700));
      plugin.refresh();
      await new Promise((r) => setTimeout(r, 400));
      // Opening the note focuses the editor and puts a caret on some line; the
      // active line carries a background tint and one extra pixel of layout.
      // Drop focus out of the document again so this shot starts from the same
      // state as the last one.
      document.body.focus();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      return true;
    })()`,
    );

    for (const scheme of args.schemes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)) {
      const wantDark = scheme === "dark";
      await cdp.eval(`(async () => {
        app.changeTheme(${JSON.stringify(wantDark ? "obsidian" : "moonstone")});
        // Give CodeMirror a generous beat: theme class flips, but the colour
        // scheme (which the post-change settle reads off document.body) and
        // any overlay-paint catch-up can take a while. 5s is the figure that
        // made typography-sample-list settle cleanly on every run here.
        await new Promise((r) => setTimeout(r, 5000));
        return true;
      })()`);
      // Settle on what this shot actually depends on — including the colour
      // scheme. A geometry-only predicate is blind to a theme swap (same
      // layout, different colours), which is exactly how a "dark" capture came
      // out light: the shutter fired before `app.changeTheme` had landed.
      let previous = null;
      let settled = null;
      let last = null;
      for (let i = 0; i < 80; i++) {
        const probe = await cdp.eval(
          `(() => {
            const view = document.querySelector(".workspace-leaf.mod-active .markdown-source-view.mod-cm6.is-live-preview");
            const card = view?.querySelector(".cm-content");
            if (!card) return null;
            const r = card.getBoundingClientRect();
            const bar = document.querySelector(".native-slides-bar")?.getBoundingClientRect();
            const body = getComputedStyle(document.body);
            // Read the scheme from the DOM, not from app.isDarkMode(): the
            // app's own answer flips synchronously while the theme-dark class
            // (what the styles key off) lands a moment later, so an app-state
            // predicate reports dark over a still-light page.
            const dark = document.body.classList.contains("theme-dark");
            // Which note is open, too: a stale leaf or a leaf the open did not
            // land in would otherwise be invisible to this predicate as long
            // as the line count happened to be stable (the 221-pixel false
            // drift this check was written to catch came from exactly that).
            const note = app.workspace.getActiveFile()?.path ?? "(none)";
            return {
              dark,
              note,
              wantsNote: note === ${JSON.stringify(note)} || note === ${JSON.stringify(`${note}.md`)},
              key: [
                note,
                Math.round(r.width), Math.round(r.height), Math.round(r.top),
                bar ? Math.round(bar.height) : -1,
                document.querySelectorAll(".cm-line").length,
                document.activeElement?.tagName ?? "(none)",
                (() => {
                  const c = document.querySelector(".cm-content");
                  return c ? c.textContent.length + "|" + (document.querySelector(".cm-active") ? "active" : "noactive") : "(noc)";
                })(),
                dark ? "dark" : "light",
                body.backgroundColor,
                body.color,
              ].join("|"),
            };
          })()`,
        );
        // A missing card is a re-render in flight, not a reason to give up:
        // keep polling until the deadline rather than capturing a blank frame.
        if (!probe) {
          previous = null;
          await sleep(200);
          continue;
        }
        last = probe;
        if (probe.key === previous && probe.dark === wantDark && probe.wantsNote) {
          settled = probe;
          break;
        }
        previous = probe.key;
        await sleep(200);
      }
      if (!settled) {
        throw new Error(
          `the ${scheme} scheme never settled on "${note}" (active note: ${last?.note ?? "(none)"}, dark: ${last?.dark ?? "?"}) — refusing to capture a shot that is not the note and scheme requested`,
        );
      }
      const shot = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      const name = `${note.replace(/[^\w.-]+/g, "_")}__${scheme}.png`;
      writeFileSync(join(args.out, name), Buffer.from(shot.data, "base64"));
      captured += 1;
      console.log(`captured ${name}`);
    }
  }
} finally {
  if (restore) {
    await cdp.eval(`document.getElementById("ns-visual-check-freeze")?.remove()`).catch(() => {});
    await restoreVaultState(cdp, restore).catch((error) =>
      console.error(`could not restore the vault state: ${String(error)}`),
    );
  }
  await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
  cdp.ws.close();
}

const written = readdirSync(args.out).filter((f) => f.endsWith(".png"));
console.log(
  `\n${captured} screenshot(s) written to ${args.out} (${written.length} *.png there now)`,
);
if (captured === 0) {
  console.error(
    `slide-visual-check: captured nothing into ${args.out} — refusing to report success`,
  );
  process.exit(1);
}
printVaultReminder([
  "example-vault/.obsidian/appearance.json",
  "example-vault/.obsidian/plugins/native-slides/data.json",
]);
