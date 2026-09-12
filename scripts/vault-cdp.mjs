#!/usr/bin/env node
/**
 * vault-cdp.mjs — drive the *running* Obsidian window that has this
 * repository's `example-vault/` open, over the Chrome DevTools Protocol.
 *
 * Why this file exists: `--remote-debugging-port` is a **process-wide** flag,
 * and one Obsidian process can hold several windows, so the endpoint may also
 * expose a window with the maintainer's real notes in it. That endpoint cannot
 * tell the windows apart by URL (`app://obsidian.md/index.html` for all of
 * them) and the window title is localized and stale, so the only trustworthy
 * identity is the app's own answer: `app.vault.adapter.getBasePath()`. This
 * module asks every page target that question, accepts the one whose vault is
 * `example-vault/` in this repository, and **refuses to run** on zero or
 * several matches — it is the mechanism behind AGENTS.md Rule 3 ("test in
 * `example-vault/`, never in another vault"). See
 * docs/development.md#driving-the-running-app-over-cdp.
 *
 * Two more rules it enforces, both learned the hard way:
 *   - **never dispatch input blind** — an element with no layout (a collapsed
 *     sidebar gives every panel entry a 0×0 rect) would send the click to
 *     whatever happens to sit at the requested coordinates, so `drag()`
 *     refuses instead of guessing;
 *   - **the vault identity is re-checked before an input dispatch**, so a
 *     window swapped underneath the connection cannot be typed into.
 *
 * Usage, from the repository root:
 *   node scripts/vault-cdp.mjs state
 *   node scripts/vault-cdp.mjs order
 *   node scripts/vault-cdp.mjs drag 3 40
 *   node scripts/vault-cdp.mjs eval 'app.workspace.getActiveFile()?.path'
 *   node scripts/vault-cdp.mjs create-deck "Check A" "Check B"
 *   node scripts/vault-cdp.mjs delete-notes "Check A" "Check B"
 *
 * Or import the primitives into a scratch check script — keep those outside
 * the repository (`/tmp/…`) so no test-shaped file is ever committed:
 *
 *   import { connect, sameArray } from "<repo>/scripts/vault-cdp.mjs";
 *   const cdp = await connect();
 *   await cdp.open("Check A");
 *   const before = await cdp.order();
 *   await cdp.drag(3, 40);            // entry 3 moves to the head
 *   const expected = [before[3], before[0], before[1], before[2]];
 *   if (!sameArray(await cdp.order(), expected)) throw new Error("…");
 *
 * The running app must have been started with `--remote-debugging-port=9222`
 * (or another port via `OBSIDIAN_CDP_PORT`). A window that is occluded is
 * still drivable, but Chrome throttles it: `requestAnimationFrame` may never
 * fire and Obsidian's `Menu` mounts no DOM — assert on behaviour and on
 * handlers rather than on rendered pixels, and say so in the report.
 */

import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** Repository root — this file lives in `<root>/scripts/` */
const REPO_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
/** The only vault this script will ever drive (AGENTS.md Rule 3) */
const EXPECTED_VAULT = path.join(REPO_ROOT, "example-vault");

/** Sleep for `ms` milliseconds */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Order-sensitive array comparison, for assertions in check scripts */
export const sameArray = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** `p` with symlinks resolved, or `p` itself when it cannot be resolved */
function canonical(p) {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

/** Whether two vault paths name the same directory (symlinks resolved) */
function sameVault(a, b) {
  return canonical(a) === canonical(b);
}

/** Page targets on the debugging port (workers and other target kinds dropped) */
async function pageTargets(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`);
  if (!response.ok) throw new Error(`devtools endpoint answered ${response.status}`);
  const targets = await response.json();
  return targets.filter((t) => t.type === "page" && t.webSocketDebuggerUrl);
}

/**
 * A CDP connection with the helpers the checks need.
 *
 * Invariant: every path that reads app state or mutates the vault goes through
 * a guarded entry point — `eval()`, `mouse()` or `pressEscape()` — which
 * re-checks the vault identity first. Only the connect-time probe and
 * `assertVault()` itself may use `evalRaw()`, which performs no check
 * (`assertVault()` must not call the guarded `eval()`, or it would recurse).
 */
class Cdp {
  constructor(ws, vaultPath) {
    this.ws = ws;
    this.vaultPath = vaultPath;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  /**
   * Evaluate `expression` in the page with **no** vault check. Only the
   * connect-time probe and `assertVault()` may call this; every other path
   * goes through `eval()` (see the class doc).
   */
  async evalRaw(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      const description = result.exceptionDetails.exception?.description;
      throw new Error(description ?? "evaluation failed");
    }
    return result.result.value;
  }

  /**
   * Re-read the vault path from the live page. Every guarded entry point goes
   * through this: the connection outlives the window it was made for.
   */
  async assertVault() {
    const actual = await this.evalRaw(`app.vault.adapter.getBasePath()`);
    if (!sameVault(actual, this.vaultPath)) {
      throw new Error(
        `refusing to dispatch input: the window now holds ${actual}, not ${this.vaultPath}`,
      );
    }
    return actual;
  }

  /** Evaluate `expression` in the page and return its value, after re-checking the vault */
  async eval(expression) {
    await this.assertVault();
    return this.evalRaw(expression);
  }

  /** One synthetic mouse event, after re-checking the vault */
  async mouse(type, x, y, { buttons = 0, button = "left", modifiers = 0 } = {}) {
    await this.assertVault();
    await this.send("Input.dispatchMouseEvent", {
      type,
      x,
      y,
      button,
      buttons,
      clickCount: 1,
      modifiers,
    });
  }

  /** One synthetic Escape press, after re-checking the vault */
  async pressEscape() {
    await this.assertVault();
    await this.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
    await this.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  }

  /** Rendered panel entries, in order, with their layout */
  rects() {
    return this
      .eval(`Array.from(document.querySelectorAll(".native-slides-panel-item")).map((el) => {
      const r = el.getBoundingClientRect();
      return { title: el.querySelector(".native-slides-panel-title").textContent,
               top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    })`);
  }

  /** Slide titles as the panel lists them (chain order) */
  order() {
    return this.eval(
      `Array.from(document.querySelectorAll(".native-slides-panel-title")).map((e) => e.textContent)`,
    );
  }

  /** Open a note in the editor and let the workspace settle */
  async open(name, settleMs = 500) {
    await this.eval(
      `(async () => { await app.workspace.openLinkText(${JSON.stringify(name)}, ""); return true; })()`,
    );
    await sleep(settleMs);
  }

  /**
   * Press panel entry `fromIndex`, drag to the absolute y `toY`, release.
   * `options.escape` cancels the gesture instead; `options.modifiers` are the
   * CDP modifier bits (1 Alt, 2 Ctrl, 4 Meta, 8 Shift).
   */
  async drag(fromIndex, toY, options = {}) {
    const { escape = false, modifiers = 0, steps = 8 } = options;
    const rects = await this.rects();
    const item = rects[fromIndex];
    if (!item) throw new Error(`no panel entry at index ${fromIndex}`);
    // The guard that keeps a collapsed sidebar from turning a click into a
    // blind click at (0,0): a layout-less entry is not draggable, and its
    // coordinates would be meaningless.
    if (item.right - item.left < 1 || item.bottom - item.top < 1) {
      throw new Error(
        `panel entry ${fromIndex} has no layout (${JSON.stringify(item)}) — is the sidebar visible?`,
      );
    }
    const x = Math.round((item.left + item.right) / 2);
    const y0 = Math.round((item.top + item.bottom) / 2);
    await this.mouse("mouseMoved", x, y0, { modifiers });
    await this.mouse("mousePressed", x, y0, { buttons: 1, modifiers });
    for (let step = 1; step <= steps; step++) {
      await this.mouse("mouseMoved", x, Math.round(y0 + ((toY - y0) * step) / steps), {
        buttons: 1,
        modifiers,
      });
      await sleep(20);
    }
    if (escape) {
      await this.pressEscape();
      await sleep(100);
    }
    await this.mouse("mouseReleased", x, toY, { modifiers });
    await sleep(800);
  }
}

/**
 * Connect to the example-vault window on the debugging port.
 *
 * Asks every page target which vault it holds and keeps the one that is this
 * repository's `example-vault/`. Zero matches means the vault is not open (or
 * the port is a different app); several means the identity is ambiguous. Both
 * throw — never fall back to "the first target".
 */
export async function connect(port = Number(process.env.OBSIDIAN_CDP_PORT ?? 9222)) {
  const targets = await pageTargets(port);
  const matches = [];
  const seen = [];

  for (const target of targets) {
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    try {
      await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve, { once: true });
        ws.addEventListener("error", reject, { once: true });
      });
      const probe = new Cdp(ws, EXPECTED_VAULT);
      const basePath = await probe.evalRaw(`app.vault.adapter.getBasePath()`);
      const title = await probe.evalRaw(`document.title`);
      seen.push(`${title} → ${basePath}`);
      if (sameVault(basePath, EXPECTED_VAULT)) {
        // the probe is already connected to the right window — reuse it
        matches.push(probe);
        continue;
      }
    } catch (error) {
      seen.push(`${target.title} → unreadable (${String(error)})`);
    }
    ws.close();
  }

  if (matches.length === 0) {
    throw new Error(
      `no window holds ${EXPECTED_VAULT} on port ${port}. Open it in Obsidian, started with ` +
        `--remote-debugging-port=${port}. Windows seen: ${seen.join("; ") || "none"}`,
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `refusing to guess: ${matches.length} windows hold ${EXPECTED_VAULT} on port ${port}. ` +
        `Windows seen: ${seen.join("; ")}`,
    );
  }
  return matches[0];
}

// ── CLI ────────────────────────────────────────────────────────────────────
// Small on purpose: the one-shot commands below cover the loop in
// docs/development.md, while anything multi-step belongs in a scratch script
// that imports the primitives above.

const isCli =
  process.argv[1] && canonical(process.argv[1]) === canonical(fileURLToPath(import.meta.url));

/** The one-shot commands, printed for `help` and for an unknown one */
function usage() {
  return [
    "usage: node scripts/vault-cdp.mjs <command> [args]",
    "",
    "  state                     vault, plugin version, active note, resolved deck",
    "  reload                    reload the plugin (picks up a fresh main.js)",
    "  eval <js>                 evaluate in the app, print the value",
    "  order                     slide titles as the slides panel lists them",
    "  rects                     the same entries with their layout",
    "  open <note>               open a note in the editor",
    "  drag <index> <y> [--escape]",
    "  create-deck <name...>     scratch deck (names, no extension)",
    "  delete-notes <name...>    remove scratch notes",
    "",
    "The vault must be open in an Obsidian started with --remote-debugging-port=9222,",
    "and it must be this repository's example-vault — see docs/development.md.",
  ].join("\n");
}

if (isCli) {
  const [command, ...args] = process.argv.slice(2);
  // Answer `help` (and a bare invocation) without connecting: the usage text is
  // what someone reads when no window is up yet.
  if (!command || command === "help" || command === "--help") {
    console.log(usage());
    process.exit(command ? 0 : 2);
  }

  const cdp = await connect();
  const print = (value) => console.log(JSON.stringify(value, null, 2));

  switch (command) {
    case "state": {
      print(
        await cdp.eval(`(() => {
          const plugin = app.plugins.plugins["native-slides"];
          const file = app.workspace.getActiveFile();
          return {
            vault: app.vault.getName(),
            vaultPath: app.vault.adapter.getBasePath(),
            pluginVersion: plugin?.manifest?.version ?? null,
            activeFile: file?.path ?? null,
            deck: file && plugin ? plugin.resolveDeck(file) : null,
            panelEntries: document.querySelectorAll(".native-slides-panel-item").length,
          };
        })()`),
      );
      break;
    }
    case "reload": {
      await cdp.eval(`(async () => {
        await app.plugins.disablePlugin("native-slides");
        await app.plugins.enablePlugin("native-slides");
        return true;
      })()`);
      await sleep(1200);
      console.log("reloaded");
      break;
    }
    case "eval": {
      print(await cdp.eval(args.join(" ")));
      break;
    }
    case "order": {
      print(await cdp.order());
      break;
    }
    case "rects": {
      print(await cdp.rects());
      break;
    }
    case "open": {
      await cdp.open(args[0]);
      console.log("opened", args[0]);
      break;
    }
    case "drag": {
      await cdp.drag(Number(args[0]), Number(args[1]), { escape: args.includes("--escape") });
      console.log("dragged", args[0], "->", args[1]);
      break;
    }
    case "create-deck": {
      // Scratch notes for a check; names are basenames without the extension
      print(
        await cdp.eval(`(async () => {
          const names = ${JSON.stringify(args)};
          const created = [];
          for (let i = 0; i < names.length; i++) {
            const existing = app.vault.getAbstractFileByPath(names[i] + ".md");
            if (existing) await app.fileManager.trashFile(existing);
            const next = i + 1 < names.length ? names[i + 1] : null;
            const deck = next ? '["[[' + next + ']]"]' : "[]";
            await app.vault.create(names[i] + ".md", "---\\ndeck: " + deck + "\\n---\\n\\n# " + names[i] + "\\n");
            created.push(names[i] + ".md");
          }
          await new Promise((r) => setTimeout(r, 400));
          return created;
        })()`),
      );
      break;
    }
    case "delete-notes": {
      // Scratch notes must not be left behind (AGENTS.md Rule 3)
      print(
        await cdp.eval(`(async () => {
          const deleted = [];
          for (const name of ${JSON.stringify(args)}) {
            const file = app.vault.getAbstractFileByPath(name + ".md");
            if (file) { await app.fileManager.trashFile(file); deleted.push(name); }
          }
          return deleted;
        })()`),
      );
      break;
    }
    default: {
      console.error(usage());
      process.exit(2);
    }
  }
  cdp.ws.close();
}
