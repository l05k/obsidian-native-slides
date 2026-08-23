"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => NativeSlidesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/bar.ts
function createBar() {
  const bar = document.createElement("div");
  bar.className = "native-slides-bar";
  bar.style.display = "none";
  bar.title = "Click to park the mouse \u2014 hides the editor caret while presenting";
  bar.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) active.blur();
  });
  return bar;
}
function navButton(label, tip, onClick, disabled = false) {
  const btn = document.createElement("button");
  btn.className = "native-slides-nav-btn";
  btn.textContent = label;
  btn.title = tip;
  btn.disabled = disabled;
  if (!disabled) btn.addEventListener("click", onClick);
  return btn;
}
function syncTabBarHeight(cached) {
  const tabBar = document.querySelector(
    ".workspace-tabs.mod-top .workspace-tab-header-container"
  );
  if (tabBar && tabBar.offsetHeight > 0) cached = tabBar.offsetHeight;
  if (cached > 0) {
    document.documentElement.style.setProperty("--native-slides-tabbar-height", `${cached}px`);
  } else {
    document.documentElement.style.removeProperty("--native-slides-tabbar-height");
  }
  return cached;
}

// src/debug.ts
var import_obsidian2 = require("obsidian");

// src/mode.ts
var import_obsidian = require("obsidian");
function currentMode(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
  return view ? view.getMode() : "";
}
function isLivePreview(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
  if (!view || view.getMode() !== "source") return false;
  const state = view.getState();
  if (state.source === true) return false;
  if (state.source === false) return true;
  return !!view.contentEl.querySelector(".markdown-source-view.mod-cm6.is-live-preview");
}
function frontmatterOf(app, file) {
  const cache = app.metadataCache.getFileCache(file);
  return cache?.frontmatter ?? null;
}
function activeFrontmatter(app) {
  const file = app.workspace.getActiveFile();
  return file ? frontmatterOf(app, file) : null;
}

// src/debug.ts
var SAMPLE_NOTE_NAMES = [
  "typography-sample-headings",
  "typography-sample-list",
  "typography-sample-code",
  "typography-sample-quote",
  "typography-sample-media"
];
var STYLE_SECTIONS = [
  "container",
  "paragraph",
  "h1",
  "listItem",
  "codeBlock",
  "blockquote",
  "inlineCode",
  "table",
  "image",
  "horizontalRule"
];
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function mergeSample(target, sample) {
  for (const key of STYLE_SECTIONS) {
    const section = sample[key];
    if (!section || "(missing)" in section) continue;
    const existing = target[key];
    if (existing && !("(missing)" in existing)) continue;
    target[key] = section;
  }
  for (const key of [
    "listLines",
    "metadataContainerDisplay",
    "h1OffsetTop",
    "h1TopInContent",
    "h1LeftInContent",
    "title",
    "contentChildren",
    "topChain"
  ]) {
    const probe = sample[key];
    if (probe === void 0 || probe === null) continue;
    if (Array.isArray(probe) && probe.length === 0) continue;
    if (typeof probe === "object" && !Array.isArray(probe) && Object.keys(probe).length === 0)
      continue;
    if (target[key] === void 0) target[key] = probe;
  }
}
function diffDumps(edit, reading) {
  const out = {};
  for (const section of STYLE_SECTIONS) {
    const e = edit[section] ?? {};
    const r = reading[section] ?? {};
    const keys = /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(r)]);
    const diffs = {};
    for (const key of keys) {
      if (e[key] !== r[key]) {
        diffs[key] = { edit: e[key] ?? "(missing)", reading: r[key] ?? "(missing)" };
      }
    }
    if (Object.keys(diffs).length > 0) out[section] = diffs;
  }
  return out;
}
function sampleStyles(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
  if (!view) return null;
  const isEdit = view.getMode() === "source";
  const contentEl = view.contentEl;
  const pick = (sels) => {
    for (const sel of sels) {
      const el = contentEl.querySelector(sel);
      if (el) return el;
    }
    return null;
  };
  const style = (el, props) => {
    if (!el) return { "(missing)": "element not in this note" };
    const cs = getComputedStyle(el);
    const out = {};
    for (const p of props) {
      const v = cs.getPropertyValue(p).trim();
      if (v) out[p] = v;
    }
    return out;
  };
  const vars = getComputedStyle(document.body);
  const cssVar = (name) => vars.getPropertyValue(name).trim();
  const container = pick([
    isEdit ? ".markdown-source-view.mod-cm6 .cm-content" : ".markdown-reading-view .markdown-preview-view"
  ]);
  const para = pick([
    isEdit ? ".markdown-source-view.mod-cm6 .cm-line:not(.HyperMD-header)" : ".markdown-reading-view .markdown-preview-view p"
  ]);
  const h1 = pick([
    isEdit ? ".markdown-source-view.mod-cm6 .cm-header-1" : ".markdown-reading-view h1",
    isEdit ? ".markdown-source-view.mod-cm6 h1" : ".markdown-reading-view .markdown-preview-view h1"
  ]);
  const listItem = pick([
    isEdit ? ".markdown-source-view.mod-cm6 .HyperMD-list-line" : ".markdown-preview-view ul > li",
    isEdit ? ".HyperMD-list-line" : ".markdown-reading-view .markdown-preview-view ul > li"
  ]);
  const pre = pick([
    isEdit ? ".markdown-source-view.mod-cm6 pre" : ".markdown-reading-view .markdown-preview-view pre",
    isEdit ? ".markdown-source-view.mod-cm6 .cm-editing pre" : ".markdown-preview-view pre",
    isEdit ? ".markdown-source-view.mod-cm6 .HyperMD-codeblock" : ".markdown-preview-view pre"
  ]);
  const quote = pick([
    isEdit ? ".markdown-source-view.mod-cm6 blockquote" : ".markdown-reading-view blockquote",
    isEdit ? ".markdown-source-view.mod-cm6 .HyperMD-quote" : ".markdown-reading-view .markdown-preview-view blockquote"
  ]);
  const inlineCode = pick([
    isEdit ? ".markdown-source-view.mod-cm6 code" : ".markdown-reading-view code",
    isEdit ? ".markdown-source-view.mod-cm6 .cm-inline-code" : ".markdown-reading-view .markdown-preview-view code"
  ]);
  const table = pick([
    isEdit ? ".markdown-source-view.mod-cm6 table" : ".markdown-reading-view table",
    isEdit ? ".cm-line table" : ".markdown-reading-view .markdown-preview-view table"
  ]);
  const img = pick([
    isEdit ? ".markdown-source-view.mod-cm6 img" : ".markdown-reading-view img",
    isEdit ? ".cm-line img" : ".markdown-reading-view .markdown-preview-view img",
    "img"
    // whole-document fallback
  ]);
  const hr = pick([
    isEdit ? ".markdown-source-view.mod-cm6 hr" : ".markdown-reading-view hr",
    isEdit ? ".cm-line hr" : ".markdown-reading-view .markdown-preview-view hr",
    isEdit ? ".cm-hr" : ".markdown-preview-view hr"
  ]);
  const sourceViewClass = contentEl.querySelector(".markdown-source-view.mod-cm6")?.className ?? "";
  const domTags = [];
  if (isEdit) {
    const tags = /* @__PURE__ */ new Set();
    contentEl.querySelectorAll(".markdown-source-view.mod-cm6 *").forEach((el) => tags.add(el.tagName.toLowerCase()));
    domTags.push(...tags);
  }
  const listLines = [];
  if (isEdit) {
    contentEl.querySelectorAll(".HyperMD-list-line").forEach((el, i) => {
      if (i >= 4) return;
      const cs = getComputedStyle(el);
      listLines.push({
        className: el.className,
        paddingLeft: cs.getPropertyValue("padding-left").trim()
      });
    });
  }
  const metadataDisplay = (() => {
    const sel = isEdit ? ".markdown-source-view .metadata-container" : ".markdown-reading-view .metadata-container";
    const el = contentEl.querySelector(sel);
    return el ? getComputedStyle(el).display : "(not in DOM)";
  })();
  const h1OffsetTop = (() => {
    if (!h1) return void 0;
    let top = 0;
    let node = h1;
    while (node && node !== contentEl && node !== document.body) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return top;
  })();
  const anchor = isEdit ? contentEl.querySelector(".cm-content") : contentEl.querySelector(".markdown-reading-view .markdown-preview-view");
  const h1TopInContent = (() => {
    if (!h1 || !anchor) return void 0;
    return Math.round(h1.getBoundingClientRect().top - anchor.getBoundingClientRect().top);
  })();
  const h1LeftInContent = (() => {
    if (!h1 || !anchor) return void 0;
    return Math.round(h1.getBoundingClientRect().left - anchor.getBoundingClientRect().left);
  })();
  const contentChildren = (() => {
    if (!anchor) return void 0;
    return Array.from(anchor.children).slice(0, 4).map((el) => {
      const cs = getComputedStyle(el);
      return {
        cls: el.className || el.tagName.toLowerCase(),
        display: cs.display,
        height: Math.round(el.getBoundingClientRect().height),
        marginTop: cs.marginTop,
        paddingTop: cs.paddingTop,
        marginBottom: cs.marginBottom,
        paddingBottom: cs.paddingBottom
      };
    });
  })();
  const topChain = (() => {
    if (!anchor) return void 0;
    const parts = [];
    let node = anchor;
    while (node && node !== contentEl && node !== document.body) {
      const cs = getComputedStyle(node);
      parts.push({
        cls: node.className || node.tagName.toLowerCase(),
        padTop: cs.paddingTop,
        marTop: cs.marginTop
      });
      node = node.parentElement;
    }
    return parts;
  })();
  const titleBefore = (() => {
    if (!isEdit) return void 0;
    const content = contentEl.querySelector(".cm-content");
    if (!content || !content.hasAttribute("data-slides-title")) return void 0;
    const cs = getComputedStyle(content, "::before");
    return {
      content: cs.content,
      display: cs.display,
      position: cs.position,
      top: cs.top,
      left: cs.left,
      paddingTop: cs.paddingTop,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      fontWeight: cs.fontWeight,
      fontVariant: cs.fontVariant,
      color: cs.color,
      letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform,
      wordSpacing: cs.wordSpacing,
      fontKerning: cs.fontKerning,
      fontFeatureSettings: cs.fontFeatureSettings,
      fontVariantNumeric: cs.fontVariantNumeric,
      fontVariantLigatures: cs.fontVariantLigatures,
      fontVariantCaps: cs.fontVariantCaps
    };
  })();
  const dump = {
    mode: isEdit ? "edit (Live Preview)" : "reading",
    // Slides styling only applies when Slides mode is on
    slidesActive: document.body.classList.contains("native-slides-mode"),
    domTags: isEdit ? domTags : void 0,
    sourceViewClass: isEdit ? sourceViewClass : void 0,
    livePreview: isEdit ? isLivePreview(app) : void 0,
    listLines: isEdit ? listLines : void 0,
    metadataContainerDisplay: metadataDisplay,
    h1OffsetTop,
    h1TopInContent,
    h1LeftInContent,
    contentChildren,
    topChain,
    title: titleBefore,
    container: style(container, [
      "font-family",
      "font-size",
      "line-height",
      "max-width",
      "width",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "color",
      "text-align"
    ]),
    paragraph: style(para, [
      "font-size",
      "line-height",
      "margin-top",
      "margin-bottom",
      "margin-left",
      "margin-right",
      "text-indent",
      "text-align"
    ]),
    h1: style(h1, [
      "font-family",
      "font-size",
      "line-height",
      "font-weight",
      "font-variant",
      "color",
      "letter-spacing",
      "text-transform",
      "word-spacing",
      "font-kerning",
      "font-feature-settings",
      "font-variant-numeric",
      "font-variant-ligatures",
      "font-variant-caps",
      "margin-top",
      "margin-bottom",
      "text-align"
    ]),
    listItem: style(listItem, [
      "padding-left",
      "margin-left",
      "margin-right",
      "text-indent",
      "line-height",
      "text-align"
    ]),
    codeBlock: style(pre, [
      "font-size",
      "line-height",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "background-color",
      "border-radius"
    ]),
    blockquote: style(quote, [
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "margin-top",
      "margin-bottom",
      "border-left-width",
      "background-color"
    ]),
    inlineCode: style(inlineCode, [
      "font-size",
      "padding-top",
      "padding-bottom",
      "padding-left",
      "padding-right",
      "background-color",
      "border-radius"
    ]),
    table: style(table, ["font-size", "line-height", "width", "border-collapse"]),
    image: style(img, ["display", "margin-left", "margin-right", "max-width", "width"]),
    horizontalRule: style(hr, ["margin-top", "margin-bottom", "border-top-width", "height"]),
    cssVariables: {
      "--font-text": cssVar("--font-text"),
      "--line-height-normal": cssVar("--line-height-normal"),
      "--h1-size": cssVar("--h1-size"),
      "--h1-line-height": cssVar("--h1-line-height"),
      "--h1-weight": cssVar("--h1-weight"),
      "--h1-variant": cssVar("--h1-variant"),
      "--h1-color": cssVar("--h1-color"),
      "--h1-margin-top": cssVar("--h1-margin-top"),
      "--h1-margin-bottom": cssVar("--h1-margin-bottom"),
      "--p-spacing": cssVar("--p-spacing"),
      "--list-spacing": cssVar("--list-spacing"),
      "--list-indent": cssVar("--list-indent"),
      "--code-size": cssVar("--code-size"),
      "--code-padding": cssVar("--code-padding"),
      "--code-radius": cssVar("--code-radius"),
      "--blockquote-padding": cssVar("--blockquote-padding"),
      "--blockquote-border-thickness": cssVar("--blockquote-border-thickness"),
      "--file-margins": cssVar("--file-margins"),
      "--file-line-width": cssVar("--file-line-width"),
      "--normal-font-size": cssVar("--normal-font-size"),
      "--font-text-size": cssVar("--font-text-size")
    }
  };
  return dump;
}
async function dumpTypography(plugin) {
  const app = plugin.app;
  if (!document.body.classList.contains("native-slides-mode")) {
    new import_obsidian2.Notice("Native Slides: enter Slides mode first (Mod+Shift+E on a deck note)");
    return;
  }
  const view = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
  if (!view) {
    new import_obsidian2.Notice("Native Slides: no active Markdown note");
    return;
  }
  const startMode = view.getMode();
  const activeFile = app.workspace.getActiveFile();
  const leaf = app.workspace.getLeaf(false);
  const edit = {};
  for (const name of SAMPLE_NOTE_NAMES) {
    const f = app.vault.getAbstractFileByPath(`${name}.md`);
    if (!(f instanceof import_obsidian2.TFile)) continue;
    await leaf.openFile(f, { state: { mode: "source" } });
    await sleep(500);
    const s = sampleStyles(app);
    if (s) mergeSample(edit, s);
  }
  let reading = null;
  const demo = app.vault.getAbstractFileByPath("typography-demo.md");
  if (demo instanceof import_obsidian2.TFile) {
    await leaf.openFile(demo, { state: { mode: "preview" } });
    await sleep(800);
    reading = sampleStyles(app);
  }
  if (activeFile) {
    await leaf.openFile(activeFile, { state: { mode: startMode } });
    plugin.refresh();
  }
  if (!reading) {
    new import_obsidian2.Notice("Native Slides: reading sample failed");
    return;
  }
  const payload = { edit, reading, diff: diffDumps(edit, reading) };
  try {
    await app.vault.adapter.write(".native-slides-debug.json", JSON.stringify(payload, null, 2));
    new import_obsidian2.Notice("Typography dump \u2192 .native-slides-debug.json (vault root)");
  } catch (error) {
    new import_obsidian2.Notice(`Native Slides: could not write debug file (${String(error)})`);
  }
  console.log("[native-slides debug-styles]", JSON.stringify(payload, null, 2));
}
function registerDebugCommand(plugin) {
  plugin.addCommand({
    id: "ns-debug-styles",
    name: "Debug: dump typography styles",
    callback: () => void dumpTypography(plugin)
  });
}

// src/types.ts
var SLIDES_THEMES = [
  { id: "jyy", label: "Lecture (jyy)" },
  { id: "dashed", label: "Dashed outline" },
  { id: "paper", label: "Paper card" },
  { id: "minimal", label: "Minimal" },
  { id: "accent", label: "Accent edge" },
  { id: "glass", label: "Frosted glass" }
];
var DEFAULT_SETTINGS = {
  showNavButtons: true,
  pageNumberStyle: "none",
  showProgress: true,
  showSlidesBar: true,
  barHidden: false,
  autoEnterSlides: false,
  escExitsSlides: true,
  slidesTitle: "",
  slidesTheme: "jyy",
  barProperties: "",
  barPropertyWidths: ""
};
var DECK_KEY = "deck";

// src/commands.ts
function registerCommands(plugin) {
  plugin.addCommand({
    id: "ns-toggle-bar",
    name: "Toggle slides bar",
    callback: async () => {
      plugin.settings.barHidden = !plugin.settings.barHidden;
      await plugin.saveSettings();
      plugin.refresh();
    }
  });
  plugin.addCommand({
    id: "ns-show-panel",
    name: "Show slides panel",
    callback: () => void plugin.activateSlidesPanel()
  });
  plugin.addCommand({
    id: "ns-toggle-pointer",
    name: "Toggle mouse pointer",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "M" }],
    checkCallback: (checking) => {
      if (!document.body.classList.contains("native-slides-mode")) return false;
      if (!checking) plugin.togglePointer();
      return true;
    }
  });
  plugin.addCommand({
    id: "ns-prev",
    name: "Previous page",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "ArrowLeft" }],
    callback: () => plugin.navigate("prev")
  });
  plugin.addCommand({
    id: "ns-next",
    name: "Next page",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "ArrowRight" }],
    callback: () => plugin.navigate("next")
  });
  plugin.addCommand({
    id: "ns-create-next",
    name: "Create next slide",
    // Greyed out in the palette unless the active note can take a next slide
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file) return false;
      const plan = plugin.deckService.planCreateNext(file);
      if (!plan) return false;
      if (!checking) void plugin.deckService.executeCreateNext(file, plan);
      return true;
    }
  });
  plugin.addCommand({
    id: "ns-toggle-slides",
    name: "Toggle slides mode",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "E" }],
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file) return false;
      const fm = frontmatterOf(plugin.app, file);
      if (fm === null || !(DECK_KEY in fm)) return false;
      if (!checking) plugin.toggleSlides();
      return true;
    }
  });
  if (true) registerDebugCommand(plugin);
}

// src/deck-service.ts
var import_obsidian3 = require("obsidian");

// src/deck.ts
var MAX_DECK_LINKS = 1;
function computeDeck(currentPath, getLinks, getPrev) {
  const backVisited = /* @__PURE__ */ new Set([currentPath]);
  let head = currentPath;
  for (; ; ) {
    const prev = getPrev(head);
    if (!prev || backVisited.has(prev)) break;
    backVisited.add(prev);
    head = prev;
  }
  const chain = [];
  const visited = /* @__PURE__ */ new Set();
  let cur = head;
  while (cur && !visited.has(cur)) {
    visited.add(cur);
    chain.push(cur);
    cur = getLinks(cur)[0];
  }
  const index = chain.indexOf(currentPath);
  if (index === -1) return null;
  return { chain, index };
}
function extractLinks(value, max = MAX_DECK_LINKS) {
  const flat = [];
  const collect = (v) => {
    if (Array.isArray(v)) {
      for (const item of v) collect(item);
    } else {
      flat.push(v);
    }
  };
  collect(value);
  const out = [];
  for (const item of flat) {
    const name = extractLinkText(item);
    if (name) out.push(name);
    if (out.length >= max) break;
  }
  return out;
}
function extractRawLinks(value, max = MAX_DECK_LINKS) {
  const flat = [];
  const collect = (v) => {
    if (Array.isArray(v)) {
      for (const item of v) collect(item);
    } else {
      flat.push(v);
    }
  };
  collect(value);
  const out = [];
  for (const item of flat) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!trimmed) continue;
    out.push(trimmed);
    if (out.length >= max) break;
  }
  return out;
}
function extractLinkText(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^\[\[/, "").replace(/\]\]$/, "").split("|")[0].split("#")[0].trim();
}
function formatValue(value) {
  if (value === null || value === void 0) return "\u2014";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

// src/createNext.ts
function planCreateNext(input) {
  const { currentName, currentLinks } = input;
  const nextLink = currentLinks[0];
  if (nextLink) {
    const nextName = extractLinkText(nextLink);
    if (nextName && isPlainName(nextName) && nextName !== currentName) {
      if (!input.existingNames.has(nextName)) {
        return { newName: nextName, newDeckLinks: [], rewrites: [] };
      }
      const newName2 = uniqueName(`${currentName}-next`, input.existingNames);
      return {
        newName: newName2,
        newDeckLinks: [nextLink],
        rewrites: [{ name: currentName, deck: [`[[${newName2}]]`] }]
      };
    }
  }
  const newName = uniqueName(`${currentName}-next`, input.existingNames);
  return {
    newName,
    newDeckLinks: [],
    rewrites: [{ name: currentName, deck: [`[[${newName}]]`] }]
  };
}
function isPlainName(name) {
  return name.length > 0 && !name.includes("/") && !name.includes("\\");
}
function uniqueName(base, existing) {
  if (!existing.has(base)) return base;
  for (let i = 2; ; i++) {
    const candidate = `${base}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }
}

// src/deck-service.ts
var DeckService = class {
  constructor(app) {
    this.app = app;
  }
  /**
   * Resolve the current note's position inside its deck. A note qualifies
   * when it holds a `deck` property (even empty — a fresh single slide) or
   * when some other slide declares it as its next slide.
   */
  compute(file) {
    const fm = frontmatterOf(this.app, file);
    const member = fm !== null && DECK_KEY in fm || this.prevOf(file.path) !== void 0;
    if (!member) return null;
    return computeDeck(
      file.path,
      (path) => this.linkPaths(path),
      (path) => this.prevOf(path)
    );
  }
  /** Resolve the `deck` property of a note into real note paths (max one) */
  linkPaths(path) {
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian3.TFile)) return [];
    const fm = frontmatterOf(this.app, f);
    const names = fm ? extractLinks(fm[DECK_KEY]) : [];
    return names.map((name) => this.app.metadataCache.getFirstLinkpathDest(name, path)).filter((x) => !!x).map((x) => x.path);
  }
  /**
   * The note whose `deck` property points at `path` (the previous slide in
   * the chain). With next-only semantics this backward lookup is the only
   * way to reach the chain head from a middle/last slide.
   */
  prevOf(path) {
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.path === path) continue;
      if (this.linkPaths(f.path)[0] === path) return f.path;
    }
    return void 0;
  }
  /** Names in the `deck` property that resolve to no note (broken links) */
  broken(file) {
    const fm = frontmatterOf(this.app, file);
    const names = fm ? extractLinks(fm[DECK_KEY]) : [];
    return names.filter((name) => !this.app.metadataCache.getFirstLinkpathDest(name, file.path));
  }
  /**
   * Plan a "Create Next Slide" run for the active note. Deck slides
   * insert/append after the current note; a note without a `deck` link
   * starts a brand-new deck (it becomes the head slide).
   */
  planCreateNext(file) {
    const fm = frontmatterOf(this.app, file);
    const raw = fm ? extractRawLinks(fm[DECK_KEY]) : [];
    const existingNames = new Set(this.app.vault.getMarkdownFiles().map((f) => f.basename));
    return planCreateNext({ currentName: file.basename, currentLinks: raw, existingNames });
  }
  /** Apply a plan: create the note, rewire `deck` properties, open it */
  async executeCreateNext(file, plan) {
    const dir = file.parent?.path ? file.parent.path + "/" : "";
    const newPath = `${dir}${plan.newName}.md`;
    const frontmatter = plan.newDeckLinks.map((link) => JSON.stringify(link)).join(", ");
    const content = `---
deck: [${frontmatter}]
---
`;
    let newFile;
    try {
      newFile = await this.app.vault.create(newPath, content);
    } catch (error) {
      new import_obsidian3.Notice(`Native Slides: could not create "${plan.newName}.md" (${String(error)})`);
      return;
    }
    for (const rewrite of plan.rewrites) {
      if (rewrite.name !== file.basename) continue;
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        fm[DECK_KEY] = rewrite.deck;
      });
    }
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(newFile, { state: { mode: "source" } });
  }
};

// src/panel.ts
var import_obsidian4 = require("obsidian");
var SLIDES_PANEL_VIEW = "native-slides-panel";
var SlidesPanelView = class extends import_obsidian4.ItemView {
  constructor(plugin, leaf) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return SLIDES_PANEL_VIEW;
  }
  getDisplayText() {
    return "Slides";
  }
  getIcon() {
    return "presentation";
  }
  async onOpen() {
    this.containerEl.addClass("native-slides-panel");
    this.registerEvent(this.app.workspace.on("file-open", () => this.render()));
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.render()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.render()));
    this.registerEvent(this.app.metadataCache.on("changed", () => this.render()));
    this.registerEvent(this.app.vault.on("rename", () => this.render()));
    this.registerEvent(this.app.vault.on("delete", () => this.render()));
    this.render();
  }
  async onClose() {
    this.containerEl.empty();
  }
  /** Rebuild the slide list for the active note's deck */
  render() {
    const root = this.containerEl;
    root.empty();
    const file = this.app.workspace.getActiveFile();
    const deck = file ? this.plugin.deckService.compute(file) : null;
    if (!deck) {
      const empty = root.createDiv({ cls: "native-slides-panel-empty" });
      empty.setText(
        "No slides deck \u2014 open a deck note, or run Create next slide on any note to start one."
      );
      return;
    }
    deck.chain.forEach((path, i) => {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof import_obsidian4.TFile)) return;
      const item = root.createDiv({ cls: "native-slides-panel-item" });
      if (path === file?.path) item.addClass("is-active");
      const num = item.createSpan({ cls: "native-slides-panel-num" });
      num.setText(String(i + 1));
      item.createSpan({ cls: "native-slides-panel-title" }).setText(f.basename);
      item.addEventListener("click", () => {
        void this.app.workspace.getLeaf(false).openFile(f);
      });
    });
  }
};

// src/settings.ts
var import_obsidian5 = require("obsidian");
var NativeSlidesSettingTab = class extends import_obsidian5.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Native Slides \xB7 Settings" });
    new import_obsidian5.Setting(containerEl).setName("Style template").setDesc(
      "Built-in look for the Slides card and slides bar (border, background, shadow, bar styling). Every template adapts to light and dark themes."
    ).addDropdown((dropdown) => {
      for (const t of SLIDES_THEMES) dropdown.addOption(t.id, t.label);
      dropdown.setValue(this.plugin.settings.slidesTheme).onChange(async (value) => {
        this.plugin.settings.slidesTheme = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      });
    });
    new import_obsidian5.Setting(containerEl).setName("Show slides bar").setDesc("Master toggle for the entire slides bar at the bottom of the window").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showSlidesBar).onChange(async (value) => {
        this.plugin.settings.showSlidesBar = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Show Previous/Next buttons").setDesc(
      "Show \u25C0 \u25B6 buttons on the left of the slides bar when the note belongs to a deck (has a `deck` property)"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showNavButtons).onChange(async (value) => {
        this.plugin.settings.showNavButtons = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Page number style").setDesc(
      'Shown at the bottom-right. "N / Total": 1-based over the whole deck chain (head slide = 1). "N": just the current page number. "None": hidden.'
    ).addDropdown(
      (dropdown) => dropdown.addOptions({
        fraction: "N / Total",
        current: "N",
        none: "None"
      }).setValue(this.plugin.settings.pageNumberStyle).onChange(async (value) => {
        this.plugin.settings.pageNumberStyle = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Show progress bar").setDesc(
      "Discrete clickable segments at the top of the slides bar -- one per slide, click to jump"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showProgress).onChange(async (value) => {
        this.plugin.settings.showProgress = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Auto-enter Slides mode").setDesc(
      "Open deck notes directly in Slides mode. Leave off to enter manually with the Toggle Slides Mode command (Mod+Shift+E) or the previous/next page hotkeys."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoEnterSlides).onChange(async (value) => {
        this.plugin.settings.autoEnterSlides = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Escape exits Slides mode").setDesc("Press Escape to leave Slides mode and return to the previous view").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.escExitsSlides).onChange(async (value) => {
        this.plugin.settings.escExitsSlides = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Slides title").setDesc(
      "Frontmatter property to show as the card title (H1). Leave empty for none; type `filename` to use the file name."
    ).addText(
      (text) => text.setPlaceholder("e.g. title").setValue(this.plugin.settings.slidesTitle).onChange(async (value) => {
        this.plugin.settings.slidesTitle = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Bar properties").setDesc(
      "Comma-separated frontmatter property names to show in the slides bar (e.g. `university, short-title, date`). Each value fills an equal-width column; drag dividers to resize. Leave empty to show nothing."
    ).addText(
      (text) => text.setPlaceholder("e.g. university, date").setValue(this.plugin.settings.barProperties).onChange(async (value) => {
        this.plugin.settings.barProperties = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian5.Setting(containerEl).setName("Navigation hotkeys").setDesc(
      "Default: Previous Page Mod+Shift+\u2190, Next Page Mod+Shift+\u2192. Rebind under Settings \u2192 Hotkeys."
    ).addButton(
      (button) => button.setButtonText("Open Hotkeys Settings").onClick(() => {
        this.app.setting?.openTabById?.("hotkeys");
      })
    );
  }
};

// src/utils.ts
function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

// main.ts
var NativeSlidesPlugin = class extends import_obsidian6.Plugin {
  constructor() {
    super(...arguments);
    /** The slides bar DOM element */
    this.bar = null;
    /** Plugin settings */
    this.settings = { ...DEFAULT_SETTINGS };
    /** Whether Slides mode is currently active (session state, not persisted) */
    this.slidesMode = false;
    /** View mode to restore when leaving Slides mode ("preview" | "source") */
    this.exitMode = "source";
    /** Whether the exit view was Source mode (true) vs Live Preview (false) */
    this.exitSource = false;
    /** Last note auto-entered into Slides mode (prevents re-entering after manual exit) */
    this.autoEnteredPath = "";
    /** Last refresh key ("path|mode") to avoid pointless re-renders */
    this.lastKey = "";
    /** Last measured tab-bar height (px) — cached while the slides bar is hidden */
    this.tabBarHeight = 0;
    /** Whether the mouse pointer is hidden for presenting (session state) */
    this.pointerHidden = false;
  }
  async onload() {
    await this.loadSettings();
    this.deckService = new DeckService(this.app);
    this.addSettingTab(new NativeSlidesSettingTab(this));
    this.registerEvent(
      this.app.workspace.on("file-open", () => {
        this.maybeAutoEnterSlides();
        this.refresh();
      })
    );
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.refresh()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.refresh()));
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        if (file === this.app.workspace.getActiveFile()) this.refresh();
      })
    );
    this.registerInterval(
      window.setInterval(() => {
        const file = this.app.workspace.getActiveFile();
        const key = file ? `${file.path}|${currentMode(this.app)}` : "";
        if (key !== this.lastKey) {
          this.lastKey = key;
          this.refresh();
        }
      }, 500)
    );
    registerCommands(this);
    this.registerView(SLIDES_PANEL_VIEW, (leaf) => new SlidesPanelView(this, leaf));
    this.addRibbonIcon("presentation", "Show slides panel", () => {
      void this.activateSlidesPanel();
    });
    this.registerDomEvent(
      document,
      "scroll",
      (evt) => {
        if (!document.body.classList.contains("native-slides-mode")) return;
        const view = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
        if (!view) return;
        const el = evt.target;
        if (el instanceof HTMLElement && view.contentEl.contains(el)) {
          if (el.scrollTop !== 0) el.scrollTop = 0;
          if (el.scrollLeft !== 0) el.scrollLeft = 0;
        }
      },
      { capture: true }
    );
    this.registerDomEvent(document, "keydown", (evt) => {
      if (evt.key === "Escape" && this.slidesMode && this.settings.escExitsSlides) {
        this.exitSlides();
      }
    });
    this.bar = createBar();
    document.body.appendChild(this.bar);
    this.refresh();
  }
  onunload() {
    this.bar?.remove();
    this.bar = null;
    document.body.classList.remove("native-slides-mode");
    document.body.classList.remove("native-slides-pointer-hidden");
    this.removeThemeClasses();
  }
  // ── Settings ──────────────────────────────────────────────────────────
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // ── Slides mode ───────────────────────────────────────────────────────
  /** Whether the active note is a deck note (has a `deck` property) */
  isDeckNote(file) {
    if (!file) return false;
    const fm = frontmatterOf(this.app, file);
    return fm !== null && DECK_KEY in fm;
  }
  /** Remove every `native-slides-theme-*` class from <body> */
  removeThemeClasses() {
    for (const cls of Array.from(document.body.classList)) {
      if (cls.startsWith("native-slides-theme-")) document.body.classList.remove(cls);
    }
  }
  /**
   * Keep the single `native-slides-theme-<id>` body class in sync with the
   * `slidesTheme` setting — the style templates in styles.css hook off it.
   * Unknown ids (e.g. after a downgrade) fall back to the default theme.
   */
  applyThemeClass() {
    const id = SLIDES_THEMES.some((t) => t.id === this.settings.slidesTheme) ? this.settings.slidesTheme : DEFAULT_SETTINGS.slidesTheme;
    const cls = `native-slides-theme-${id}`;
    for (const c of Array.from(document.body.classList)) {
      if (c.startsWith("native-slides-theme-") && c !== cls) document.body.classList.remove(c);
    }
    document.body.classList.add(cls);
  }
  /**
   * Toggle hiding the mouse pointer window-wide for presenting. Hiding also
   * parks focus (blurs the editor, so the caret disappears); showing leaves
   * focus parked — click slide content to resume editing.
   */
  togglePointer() {
    this.pointerHidden = !this.pointerHidden;
    if (this.pointerHidden) {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) active.blur();
    }
    this.refresh();
  }
  /**
   * Keep the `native-slides-pointer-hidden` body class in sync with the
   * presenting state — styles.css turns every cursor invisible while set.
   * Leaving Slides mode always restores the pointer.
   */
  syncPointerClass(slides) {
    document.body.classList.toggle("native-slides-pointer-hidden", slides && this.pointerHidden);
  }
  /**
   * Render the card title (an H1 inside the card) per the `slidesTitle`
   * setting, via the `.cm-content` data-slides-title attribute — the CSS
   * ::before pseudo-element renders it. "" (default) shows nothing;
   * "filename" uses the file name; any other value names a frontmatter
   * property. The file name (inline title) outside the card is always hidden
   * by CSS in Slides mode.
   */
  updateInlineTitle(slides) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    const file = this.app.workspace.getActiveFile();
    const content = view?.contentEl.querySelector(".cm-content");
    if (!content || !file) return;
    let text = null;
    if (slides) {
      const src = this.settings.slidesTitle.trim();
      if (src === "filename") {
        text = file.basename;
      } else if (src) {
        const fm = frontmatterOf(this.app, file);
        const v = fm?.[src];
        if (v != null) {
          text = typeof v === "string" ? v : Array.isArray(v) ? v.join(", ") : String(v);
        }
      }
    }
    if (text) content.setAttribute("data-slides-title", text);
    else content.removeAttribute("data-slides-title");
  }
  /** Enter Slides mode: record the exit state and force the Live Preview */
  async enterSlides() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (view) {
      const state = view.getState();
      this.exitMode = state.mode === "preview" ? "preview" : "source";
      this.exitSource = state.source === true;
      const next = view.leaf.getViewState();
      next.state = { ...next.state, mode: "source", source: false };
      await view.leaf.setViewState(next, { focus: false });
    }
    this.slidesMode = true;
    this.refresh();
  }
  /** Exit Slides mode: restore the view mode recorded at entry */
  exitSlides() {
    this.slidesMode = false;
    const view = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (view) {
      const state = view.leaf.getViewState();
      if (this.exitMode === "preview") {
        state.state = { ...state.state, mode: "preview" };
      } else {
        state.state = { ...state.state, mode: "source", source: this.exitSource };
      }
      void view.leaf.setViewState(state, { focus: false });
    }
    this.refresh();
  }
  /** Toggle Slides mode (deck notes only — enforced by the command) */
  toggleSlides() {
    if (this.slidesMode) this.exitSlides();
    else void this.enterSlides();
  }
  /** Reveal the slides sidebar panel, creating it in the right sidebar if needed */
  async activateSlidesPanel() {
    const existing = this.app.workspace.getLeavesOfType(SLIDES_PANEL_VIEW);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: SLIDES_PANEL_VIEW, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  /** Auto-enter Slides mode once per opened deck note when the setting is on */
  maybeAutoEnterSlides() {
    const file = this.app.workspace.getActiveFile();
    if (!file || file.path === this.autoEnteredPath) return;
    this.autoEnteredPath = file.path;
    if (this.settings.autoEnterSlides && this.isDeckNote(file) && !this.slidesMode) {
      void this.enterSlides();
    }
  }
  // ── PPT navigation ────────────────────────────────────────────────────
  /** Move one step back/forward along the deck chain (entering Slides mode as needed) */
  async navigate(direction) {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    const deck = this.deckService.compute(file);
    if (!deck) return;
    const target = deck.chain[direction === "prev" ? deck.index - 1 : deck.index + 1];
    if (!target) return;
    if (!this.slidesMode) await this.enterSlides();
    void this.app.workspace.openLinkText(target, file.path);
  }
  /** Jump to a specific index in the deck chain (progress bar click) */
  async jumpTo(index) {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    const deck = this.deckService.compute(file);
    if (!deck || index < 0 || index >= deck.chain.length || index === deck.index) return;
    const target = deck.chain[index];
    if (!target) return;
    if (!this.slidesMode) await this.enterSlides();
    void this.app.workspace.openLinkText(target, file.path);
  }
  // ── Bar rendering ─────────────────────────────────────────────────────
  /**
   * Get column width percentages for the bar properties. Returns an array of
   * percentages (summing to 100) for each property. Loads from settings or
   * defaults to equal distribution.
   */
  getBarPropertyWidths(count) {
    try {
      const stored = JSON.parse(this.settings.barPropertyWidths || "[]");
      if (Array.isArray(stored) && stored.length === count && stored.every((n) => typeof n === "number")) {
        return stored;
      }
    } catch {
    }
    return Array(count).fill(100 / count);
  }
  /** Save column width percentages to settings */
  async saveBarPropertyWidths(widths) {
    this.settings.barPropertyWidths = JSON.stringify(widths);
    await this.saveSettings();
  }
  /** Decide what the slides bar shows, then re-render it */
  refresh() {
    if (!this.bar) return;
    this.applyThemeClass();
    const file = this.app.workspace.getActiveFile();
    const mode = currentMode(this.app);
    const isCard = this.isDeckNote(file);
    const livePreviewNow = mode === "source" && isLivePreview(this.app);
    if (this.slidesMode && (!isCard || !livePreviewNow)) {
      this.slidesMode = false;
    }
    this.tabBarHeight = syncTabBarHeight(this.tabBarHeight);
    const slides = this.slidesMode && isCard && livePreviewNow;
    document.body.classList.toggle("native-slides-mode", slides);
    if (!slides) this.pointerHidden = false;
    this.syncPointerClass(slides);
    this.updateInlineTitle(slides);
    const barVisible = slides && this.settings.showSlidesBar && !this.settings.barHidden;
    if (barVisible) {
      document.documentElement.style.removeProperty("--native-slides-bar-height");
    } else {
      document.documentElement.style.setProperty("--native-slides-bar-height", "0px");
    }
    if (!barVisible) {
      this.bar.style.display = "none";
      return;
    }
    if (!file) return;
    const fm = activeFrontmatter(this.app);
    const deck = this.deckService.compute(file);
    clearChildren(this.bar);
    if (this.settings.showNavButtons && deck) {
      const hasPrev = deck.index > 0;
      const hasNext = deck.index < deck.chain.length - 1;
      const nav = document.createElement("div");
      nav.className = "native-slides-nav";
      nav.appendChild(navButton("\u25C0", "Previous page", () => this.navigate("prev"), !hasPrev));
      nav.appendChild(navButton("\u25B6", "Next page", () => this.navigate("next"), !hasNext));
      this.bar.appendChild(nav);
    }
    const propNames = this.settings.barProperties.split(",").map((s) => s.trim()).filter(Boolean);
    if (propNames.length > 0 && fm) {
      const entries = [];
      for (const name of propNames) {
        if (name in fm) {
          const val = fm[name];
          if (val != null) entries.push([name, formatValue(val)]);
        }
      }
      if (entries.length > 0) {
        const container = document.createElement("div");
        container.className = "native-slides-bar-properties";
        const widths = this.getBarPropertyWidths(entries.length);
        for (let i = 0; i < entries.length; i++) {
          const [, value] = entries[i];
          const item = document.createElement("span");
          item.className = "native-slides-bar-prop-item";
          item.style.flexBasis = `calc(${widths[i]}% - ${(entries.length - 1) * 4 / entries.length}px)`;
          item.textContent = value;
          container.appendChild(item);
          if (i < entries.length - 1) {
            const divider = document.createElement("div");
            divider.className = "native-slides-bar-divider";
            divider.addEventListener("mousedown", (e) => {
              e.preventDefault();
              const startX = e.clientX;
              const containerWidth = container.clientWidth;
              const initialWidths = [...widths];
              const onMove = (ev) => {
                const delta = (ev.clientX - startX) / containerWidth * 100;
                const newLeft = Math.max(5, initialWidths[i] + delta);
                const newRight = Math.max(5, initialWidths[i + 1] - delta);
                widths[i] = newLeft;
                widths[i + 1] = newRight;
                const items = container.querySelectorAll(
                  ".native-slides-bar-prop-item"
                );
                items[i].style.flexBasis = `calc(${newLeft}% - ${(entries.length - 1) * 4 / entries.length}px)`;
                items[i + 1].style.flexBasis = `calc(${newRight}% - ${(entries.length - 1) * 4 / entries.length}px)`;
              };
              const onUp = () => {
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
                void this.saveBarPropertyWidths(widths);
              };
              document.addEventListener("mousemove", onMove);
              document.addEventListener("mouseup", onUp);
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            });
            container.appendChild(divider);
          }
        }
        this.bar.appendChild(container);
      }
    }
    const broken = file ? this.deckService.broken(file) : [];
    if (broken.length > 0) {
      const warn = document.createElement("span");
      warn.className = "native-slides-warn";
      warn.textContent = "\u26A0 " + broken.join(", ");
      warn.title = "Broken deck link(s) \u2014 the target note does not exist";
      this.bar.appendChild(warn);
    }
    if (this.settings.pageNumberStyle !== "none" && deck) {
      const page = document.createElement("span");
      page.className = "native-slides-page";
      const total = deck.chain.length;
      page.textContent = this.settings.pageNumberStyle === "fraction" ? `${deck.index + 1} / ${total}` : `${deck.index + 1}`;
      this.bar.appendChild(page);
    }
    if (this.settings.showProgress && deck && deck.chain.length > 1) {
      const progress = document.createElement("div");
      progress.className = "native-slides-progress";
      for (let i = 0; i < deck.chain.length; i++) {
        const seg = document.createElement("div");
        const state = i < deck.index ? "past" : i === deck.index ? "current" : "future";
        seg.className = `native-slides-progress-seg native-slides-progress-seg--${state}`;
        seg.addEventListener("click", () => void this.jumpTo(i));
        progress.appendChild(seg);
      }
      this.bar.appendChild(progress);
    }
    this.bar.style.display = this.bar.childElementCount === 0 ? "none" : "";
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9kZWJ1Zy50cyIsICJzcmMvbW9kZS50cyIsICJzcmMvdHlwZXMudHMiLCAic3JjL2NvbW1hbmRzLnRzIiwgInNyYy9kZWNrLXNlcnZpY2UudHMiLCAic3JjL2RlY2sudHMiLCAic3JjL2NyZWF0ZU5leHQudHMiLCAic3JjL3BhbmVsLnRzIiwgInNyYy9zZXR0aW5ncy50cyIsICJzcmMvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogbmF0aXZlLXNsaWRlcyBcdTIwMTQgYSBcIlNsaWRlcyBtb2RlXCIgZm9yIE9ic2lkaWFuIGRlY2sgbm90ZXNcbiAqXG4gKiBPbmUgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5LCBgZGVja2AgKGEgc2luZ2xlIG1hcmtkb3duIGxpbmsgdG8gdGhlIG5leHRcbiAqIHNsaWRlIFx1MjAxNCBuZXh0LW9ubHkgc2VtYW50aWNzLCBubyBvdmVydmlldyBwYWdlIHNpbmNlIHYxLjAuMCksIGRyaXZlc1xuICogcHJldi9uZXh0IG5hdmlnYXRpb24gYW5kIGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXJzLiBBIGRlY2sgbm90ZSBjYW4gYmVcbiAqIGVudGVyZWQgaW50byAqKlNsaWRlcyBtb2RlKiogXHUyMDE0IGFuIGltbWVyc2l2ZSwgZWRpdGFibGUgKExpdmUgUHJldmlldykgdmlld1xuICogd2l0aCBhIHNsaWRlcyBiYXIgc2hvd2luZyBwcm9wZXJ0aWVzLCBuYXZpZ2F0aW9uIGFuZCB0aGUgcGFnZSBudW1iZXIuXG4gKlxuICogTmF0aXZlIE9ic2lkaWFuIG1vZGVzIChTb3VyY2UgLyBkZWZhdWx0IExpdmUgUHJldmlldyAvIFJlYWRpbmcgdmlldykgYXJlXG4gKiBsZWZ0IGNvbXBsZXRlbHkgdW50b3VjaGVkOiBubyBzdGF0dXMtYmFyIGhpZGluZywgbm8gc2xpZGVzIGJhciwgbm9cbiAqIGZ1bGxzY3JlZW4sIG5vIHN0eWxpbmcuIFNsaWRlcyBtb2RlIGlzIHRoZSBwbHVnaW4ncyBvbmx5IHN1cmZhY2UuXG4gKlxuICogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBhbmQgYSB0aGluIG9yY2hlc3RyYXRpb24gbGF5ZXI7IHRoZSBsb2dpY1xuICogbGl2ZXMgaW4gYHNyYy9gOlxuICogICAtIHNyYy90eXBlcy50cyAgICAgICAgc2V0dGluZ3Mgc2hhcGUgKyBkZWZhdWx0cyArIHJlc2VydmVkIGBkZWNrYCBrZXlcbiAqICAgLSBzcmMvbW9kZS50cyAgICAgICAgIHZpZXcgbW9kZSAvIGZyb250bWF0dGVyIGhlbHBlcnMgKHB1cmUsIGBBcHBgLWJhc2VkKVxuICogICAtIHNyYy9kZWNrLXNlcnZpY2UudHMgZGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWVcbiAqICAgLSBzcmMvYmFyLnRzICAgICAgICAgIGJhciBET00gaGVscGVycyAoY3JlYXRlIC8gYnV0dG9ucyAvIHRhYi1iYXIgbWVhc3VyZSlcbiAqICAgLSBzcmMvcGFuZWwudHMgICAgICAgIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gKiAgIC0gc3JjL2NvbW1hbmRzLnRzICAgICBjb21tYW5kIHJlZ2lzdHJhdGlvbiAoZGV2LWdhdGVkIGRlYnVnIGNvbW1hbmQpXG4gKiAgIC0gc3JjL3NldHRpbmdzLnRzICAgICBzZXR0aW5ncyB0YWJcbiAqICAgLSBzcmMvZGVidWcudHMgICAgICAgIHR5cG9ncmFwaHkgbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KVxuICogICAtIHNyYy9kZWNrLnRzICAgICAgICAgcHVyZSBkZWNrIGNvcmUgKHdpdGggc3JjL2NyZWF0ZU5leHQudHMpXG4gKi9cblxuaW1wb3J0IHsgTWFya2Rvd25WaWV3LCBQbHVnaW4sIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjcmVhdGVCYXIsIG5hdkJ1dHRvbiwgc3luY1RhYkJhckhlaWdodCB9IGZyb20gXCIuL3NyYy9iYXJcIjtcbmltcG9ydCB7IHJlZ2lzdGVyQ29tbWFuZHMgfSBmcm9tIFwiLi9zcmMvY29tbWFuZHNcIjtcbmltcG9ydCB7IERlY2tTZXJ2aWNlIH0gZnJvbSBcIi4vc3JjL2RlY2stc2VydmljZVwiO1xuaW1wb3J0IHsgZm9ybWF0VmFsdWUgfSBmcm9tIFwiLi9zcmMvZGVja1wiO1xuaW1wb3J0IHsgYWN0aXZlRnJvbnRtYXR0ZXIsIGN1cnJlbnRNb2RlLCBmcm9udG1hdHRlck9mLCBpc0xpdmVQcmV2aWV3IH0gZnJvbSBcIi4vc3JjL21vZGVcIjtcbmltcG9ydCB7IFNsaWRlc1BhbmVsVmlldywgU0xJREVTX1BBTkVMX1ZJRVcgfSBmcm9tIFwiLi9zcmMvcGFuZWxcIjtcbmltcG9ydCB7IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgfSBmcm9tIFwiLi9zcmMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IERFQ0tfS0VZLCBERUZBVUxUX1NFVFRJTkdTLCBTTElERVNfVEhFTUVTLCB0eXBlIE5hdGl2ZVNsaWRlc1NldHRpbmdzIH0gZnJvbSBcIi4vc3JjL3R5cGVzXCI7XG5pbXBvcnQgeyBjbGVhckNoaWxkcmVuIH0gZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdGl2ZVNsaWRlc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIC8qKiBUaGUgc2xpZGVzIGJhciBET00gZWxlbWVudCAqL1xuICBiYXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8qKiBEZWNrIGNoYWluIHJlc29sdXRpb24gKyBcImNyZWF0ZSBuZXh0IHNsaWRlXCIgZ2x1ZSAqL1xuICBkZWNrU2VydmljZSE6IERlY2tTZXJ2aWNlO1xuICAvKiogUGx1Z2luIHNldHRpbmdzICovXG4gIHNldHRpbmdzOiBOYXRpdmVTbGlkZXNTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuXG4gIC8qKiBXaGV0aGVyIFNsaWRlcyBtb2RlIGlzIGN1cnJlbnRseSBhY3RpdmUgKHNlc3Npb24gc3RhdGUsIG5vdCBwZXJzaXN0ZWQpICovXG4gIHByaXZhdGUgc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAvKiogVmlldyBtb2RlIHRvIHJlc3RvcmUgd2hlbiBsZWF2aW5nIFNsaWRlcyBtb2RlIChcInByZXZpZXdcIiB8IFwic291cmNlXCIpICovXG4gIHByaXZhdGUgZXhpdE1vZGU6IFwicHJldmlld1wiIHwgXCJzb3VyY2VcIiA9IFwic291cmNlXCI7XG4gIC8qKiBXaGV0aGVyIHRoZSBleGl0IHZpZXcgd2FzIFNvdXJjZSBtb2RlICh0cnVlKSB2cyBMaXZlIFByZXZpZXcgKGZhbHNlKSAqL1xuICBwcml2YXRlIGV4aXRTb3VyY2UgPSBmYWxzZTtcbiAgLyoqIExhc3Qgbm90ZSBhdXRvLWVudGVyZWQgaW50byBTbGlkZXMgbW9kZSAocHJldmVudHMgcmUtZW50ZXJpbmcgYWZ0ZXIgbWFudWFsIGV4aXQpICovXG4gIHByaXZhdGUgYXV0b0VudGVyZWRQYXRoID0gXCJcIjtcbiAgLyoqIExhc3QgcmVmcmVzaCBrZXkgKFwicGF0aHxtb2RlXCIpIHRvIGF2b2lkIHBvaW50bGVzcyByZS1yZW5kZXJzICovXG4gIHByaXZhdGUgbGFzdEtleSA9IFwiXCI7XG4gIC8qKiBMYXN0IG1lYXN1cmVkIHRhYi1iYXIgaGVpZ2h0IChweCkgXHUyMDE0IGNhY2hlZCB3aGlsZSB0aGUgc2xpZGVzIGJhciBpcyBoaWRkZW4gKi9cbiAgcHJpdmF0ZSB0YWJCYXJIZWlnaHQgPSAwO1xuICAvKiogV2hldGhlciB0aGUgbW91c2UgcG9pbnRlciBpcyBoaWRkZW4gZm9yIHByZXNlbnRpbmcgKHNlc3Npb24gc3RhdGUpICovXG4gIHBvaW50ZXJIaWRkZW4gPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmRlY2tTZXJ2aWNlID0gbmV3IERlY2tTZXJ2aWNlKHRoaXMuYXBwKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIodGhpcykpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDEuIFJlZnJlc2ggb24gXCJjdXJyZW50IG5vdGUgLyB2aWV3IGNoYW5nZWRcIiBldmVudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5tYXliZUF1dG9FbnRlclNsaWRlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG4gICAgLy8gUmVmcmVzaCB3aGVuIHRoZSBub3RlIGNvbnRlbnQgKGluY2x1ZGluZyBmcm9udG1hdHRlcikgY2hhbmdlcyAvIHNhdmVzXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMi4gRmFsbGJhY2sgdGltZXI6IGVkaXRcdTIxOTRyZWFkaW5nIHRvZ2dsZXMgbWF5IGZpcmUgbm8gc3RhbmRhcmQgZXZlbnQgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKFxuICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGZpbGUgPyBgJHtmaWxlLnBhdGh9fCR7Y3VycmVudE1vZGUodGhpcy5hcHApfWAgOiBcIlwiO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCksXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzLiBDb21tYW5kcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICByZWdpc3RlckNvbW1hbmRzKHRoaXMpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDNiLiBTbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBvdmVydmlldywgcmVwbGFjZXMgdGhlIG9sZCBvdmVydmlldyBwYWdlKSBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhTTElERVNfUEFORUxfVklFVywgKGxlYWYpID0+IG5ldyBTbGlkZXNQYW5lbFZpZXcodGhpcywgbGVhZikpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInByZXNlbnRhdGlvblwiLCBcIlNob3cgc2xpZGVzIHBhbmVsXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVNsaWRlc1BhbmVsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNC4gUGluIHRoZSBTbGlkZXMgZWRpdG9yIHRvIG9uZSBzY3JlZW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ1NTIGBvdmVyZmxvdzogaGlkZGVuYCBibG9ja3MgdGhlIHdoZWVsLCBidXQgbmF0aXZlIGRyYWctc2VsZWN0XG4gICAgLy8gYXV0b3Njcm9sbCBhbmQgQ29kZU1pcnJvcidzIHByb2dyYW1tYXRpYyBzY3JvbGxJbnRvVmlldyBzdGlsbCBtb3ZlIHRoZVxuICAgIC8vIHNjcm9sbGVyLiBUaGlzIGNhcHR1cmUtcGhhc2UgbGlzdGVuZXIgcmVzZXRzIGFueSBzY3JvbGwgaW5zaWRlIHRoZVxuICAgIC8vIGFjdGl2ZSBtYXJrZG93biB2aWV3IGJhY2sgdG8gdGhlIHRvcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhY3RpdmUuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KFxuICAgICAgZG9jdW1lbnQsXG4gICAgICBcInNjcm9sbFwiLFxuICAgICAgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcbiAgICAgICAgY29uc3QgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB2aWV3LmNvbnRlbnRFbC5jb250YWlucyhlbCkpIHtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxMZWZ0ICE9PSAwKSBlbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHsgY2FwdHVyZTogdHJ1ZSB9LFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNS4gRXNjYXBlIGtleSBleGl0cyBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZG9jdW1lbnQsIFwia2V5ZG93blwiLCAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNsaWRlc01vZGUgJiYgdGhpcy5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykge1xuICAgICAgICB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA2LiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgYW5kIGRvIHRoZSBmaXJzdCByZW5kZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5iYXIgPSBjcmVhdGVCYXIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFyKTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9udW5sb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuYmFyPy5yZW1vdmUoKTtcbiAgICB0aGlzLmJhciA9IG51bGw7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5cIik7XG4gICAgdGhpcy5yZW1vdmVUaGVtZUNsYXNzZXMoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXR0aW5ncyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG5vdGUgaXMgYSBkZWNrIG5vdGUgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSkgKi9cbiAgcHJpdmF0ZSBpc0RlY2tOb3RlKGZpbGU6IFRGaWxlIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBldmVyeSBgbmF0aXZlLXNsaWRlcy10aGVtZS0qYCBjbGFzcyBmcm9tIDxib2R5PiAqL1xuICBwcml2YXRlIHJlbW92ZVRoZW1lQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNscyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGNscy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBzaW5nbGUgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmAgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBzbGlkZXNUaGVtZWAgc2V0dGluZyBcdTIwMTQgdGhlIHN0eWxlIHRlbXBsYXRlcyBpbiBzdHlsZXMuY3NzIGhvb2sgb2ZmIGl0LlxuICAgKiBVbmtub3duIGlkcyAoZS5nLiBhZnRlciBhIGRvd25ncmFkZSkgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHRoZW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVRoZW1lQ2xhc3MoKTogdm9pZCB7XG4gICAgY29uc3QgaWQgPSBTTElERVNfVEhFTUVTLnNvbWUoKHQpID0+IHQuaWQgPT09IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWUpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5zbGlkZXNUaGVtZTtcbiAgICBjb25zdCBjbHMgPSBgbmF0aXZlLXNsaWRlcy10aGVtZS0ke2lkfWA7XG4gICAgZm9yIChjb25zdCBjIG9mIEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpKSB7XG4gICAgICBpZiAoYy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikgJiYgYyAhPT0gY2xzKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBoaWRpbmcgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgZm9yIHByZXNlbnRpbmcuIEhpZGluZyBhbHNvXG4gICAqIHBhcmtzIGZvY3VzIChibHVycyB0aGUgZWRpdG9yLCBzbyB0aGUgY2FyZXQgZGlzYXBwZWFycyk7IHNob3dpbmcgbGVhdmVzXG4gICAqIGZvY3VzIHBhcmtlZCBcdTIwMTQgY2xpY2sgc2xpZGUgY29udGVudCB0byByZXN1bWUgZWRpdGluZy5cbiAgICovXG4gIHRvZ2dsZVBvaW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5wb2ludGVySGlkZGVuID0gIXRoaXMucG9pbnRlckhpZGRlbjtcbiAgICBpZiAodGhpcy5wb2ludGVySGlkZGVuKSB7XG4gICAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgYG5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBwcmVzZW50aW5nIHN0YXRlIFx1MjAxNCBzdHlsZXMuY3NzIHR1cm5zIGV2ZXJ5IGN1cnNvciBpbnZpc2libGUgd2hpbGUgc2V0LlxuICAgKiBMZWF2aW5nIFNsaWRlcyBtb2RlIGFsd2F5cyByZXN0b3JlcyB0aGUgcG9pbnRlci5cbiAgICovXG4gIHByaXZhdGUgc3luY1BvaW50ZXJDbGFzcyhzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIsIHNsaWRlcyAmJiB0aGlzLnBvaW50ZXJIaWRkZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY2FyZCB0aXRsZSAoYW4gSDEgaW5zaWRlIHRoZSBjYXJkKSBwZXIgdGhlIGBzbGlkZXNUaXRsZWBcbiAgICogc2V0dGluZywgdmlhIHRoZSBgLmNtLWNvbnRlbnRgIGRhdGEtc2xpZGVzLXRpdGxlIGF0dHJpYnV0ZSBcdTIwMTQgdGhlIENTU1xuICAgKiA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudCByZW5kZXJzIGl0LiBcIlwiIChkZWZhdWx0KSBzaG93cyBub3RoaW5nO1xuICAgKiBcImZpbGVuYW1lXCIgdXNlcyB0aGUgZmlsZSBuYW1lOyBhbnkgb3RoZXIgdmFsdWUgbmFtZXMgYSBmcm9udG1hdHRlclxuICAgKiBwcm9wZXJ0eS4gVGhlIGZpbGUgbmFtZSAoaW5saW5lIHRpdGxlKSBvdXRzaWRlIHRoZSBjYXJkIGlzIGFsd2F5cyBoaWRkZW5cbiAgICogYnkgQ1NTIGluIFNsaWRlcyBtb2RlLlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJbmxpbmVUaXRsZShzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBjb250ZW50ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFmaWxlKSByZXR1cm47XG5cbiAgICBsZXQgdGV4dDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKHNsaWRlcykge1xuICAgICAgY29uc3Qgc3JjID0gdGhpcy5zZXR0aW5ncy5zbGlkZXNUaXRsZS50cmltKCk7XG4gICAgICBpZiAoc3JjID09PSBcImZpbGVuYW1lXCIpIHtcbiAgICAgICAgdGV4dCA9IGZpbGUuYmFzZW5hbWU7XG4gICAgICB9IGVsc2UgaWYgKHNyYykge1xuICAgICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgICAgICBjb25zdCB2ID0gZm0/LltzcmNdO1xuICAgICAgICBpZiAodiAhPSBudWxsKSB7XG4gICAgICAgICAgdGV4dCA9IHR5cGVvZiB2ID09PSBcInN0cmluZ1wiID8gdiA6IEFycmF5LmlzQXJyYXkodikgPyB2LmpvaW4oXCIsIFwiKSA6IFN0cmluZyh2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0ZXh0KSBjb250ZW50LnNldEF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIsIHRleHQpO1xuICAgIGVsc2UgY29udGVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKTtcbiAgfVxuXG4gIC8qKiBFbnRlciBTbGlkZXMgbW9kZTogcmVjb3JkIHRoZSBleGl0IHN0YXRlIGFuZCBmb3JjZSB0aGUgTGl2ZSBQcmV2aWV3ICovXG4gIHByaXZhdGUgYXN5bmMgZW50ZXJTbGlkZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdmlldy5nZXRTdGF0ZSgpIGFzIHsgbW9kZT86IHN0cmluZzsgc291cmNlPzogYm9vbGVhbiB9O1xuICAgICAgdGhpcy5leGl0TW9kZSA9IHN0YXRlLm1vZGUgPT09IFwicHJldmlld1wiID8gXCJwcmV2aWV3XCIgOiBcInNvdXJjZVwiO1xuICAgICAgdGhpcy5leGl0U291cmNlID0gc3RhdGUuc291cmNlID09PSB0cnVlO1xuICAgICAgLy8gU2xpZGVzIG1vZGUgaXMgYWx3YXlzIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICAgIGNvbnN0IG5leHQgPSB2aWV3LmxlYWYuZ2V0Vmlld1N0YXRlKCk7XG4gICAgICBuZXh0LnN0YXRlID0geyAuLi5uZXh0LnN0YXRlLCBtb2RlOiBcInNvdXJjZVwiLCBzb3VyY2U6IGZhbHNlIH07XG4gICAgICBhd2FpdCB2aWV3LmxlYWYuc2V0Vmlld1N0YXRlKG5leHQsIHsgZm9jdXM6IGZhbHNlIH0pO1xuICAgIH1cbiAgICB0aGlzLnNsaWRlc01vZGUgPSB0cnVlO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIEV4aXQgU2xpZGVzIG1vZGU6IHJlc3RvcmUgdGhlIHZpZXcgbW9kZSByZWNvcmRlZCBhdCBlbnRyeSAqL1xuICBwcml2YXRlIGV4aXRTbGlkZXMoKTogdm9pZCB7XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgaWYgKHRoaXMuZXhpdE1vZGUgPT09IFwicHJldmlld1wiKSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJwcmV2aWV3XCIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiB0aGlzLmV4aXRTb3VyY2UgfTtcbiAgICAgIH1cbiAgICAgIHZvaWQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShzdGF0ZSwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZSBTbGlkZXMgbW9kZSAoZGVjayBub3RlcyBvbmx5IFx1MjAxNCBlbmZvcmNlZCBieSB0aGUgY29tbWFuZCkgKi9cbiAgdG9nZ2xlU2xpZGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHRoaXMuZXhpdFNsaWRlcygpO1xuICAgIGVsc2Ugdm9pZCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gIH1cblxuICAvKiogUmV2ZWFsIHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCwgY3JlYXRpbmcgaXQgaW4gdGhlIHJpZ2h0IHNpZGViYXIgaWYgbmVlZGVkICovXG4gIGFzeW5jIGFjdGl2YXRlU2xpZGVzUGFuZWwoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFNMSURFU19QQU5FTF9WSUVXKTtcbiAgICBpZiAoZXhpc3RpbmcubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnJldmVhbExlYWYoZXhpc3RpbmdbMF0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSk7XG4gICAgaWYgKCFsZWFmKSByZXR1cm47XG4gICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBTTElERVNfUEFORUxfVklFVywgYWN0aXZlOiB0cnVlIH0pO1xuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgb25jZSBwZXIgb3BlbmVkIGRlY2sgbm90ZSB3aGVuIHRoZSBzZXR0aW5nIGlzIG9uICovXG4gIHByaXZhdGUgbWF5YmVBdXRvRW50ZXJTbGlkZXMoKTogdm9pZCB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlIHx8IGZpbGUucGF0aCA9PT0gdGhpcy5hdXRvRW50ZXJlZFBhdGgpIHJldHVybjtcbiAgICB0aGlzLmF1dG9FbnRlcmVkUGF0aCA9IGZpbGUucGF0aDtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMgJiYgdGhpcy5pc0RlY2tOb3RlKGZpbGUpICYmICF0aGlzLnNsaWRlc01vZGUpIHtcbiAgICAgIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBQUFQgbmF2aWdhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogTW92ZSBvbmUgc3RlcCBiYWNrL2ZvcndhcmQgYWxvbmcgdGhlIGRlY2sgY2hhaW4gKGVudGVyaW5nIFNsaWRlcyBtb2RlIGFzIG5lZWRlZCkgKi9cbiAgYXN5bmMgbmF2aWdhdGUoZGlyZWN0aW9uOiBcInByZXZcIiB8IFwibmV4dFwiKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBpZiAoIWRlY2spIHJldHVybjtcbiAgICBjb25zdCB0YXJnZXQgPSBkZWNrLmNoYWluW2RpcmVjdGlvbiA9PT0gXCJwcmV2XCIgPyBkZWNrLmluZGV4IC0gMSA6IGRlY2suaW5kZXggKyAxXTtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5zbGlkZXNNb2RlKSBhd2FpdCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gICAgdm9pZCB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KHRhcmdldCwgZmlsZS5wYXRoKTtcbiAgfVxuXG4gIC8qKiBKdW1wIHRvIGEgc3BlY2lmaWMgaW5kZXggaW4gdGhlIGRlY2sgY2hhaW4gKHByb2dyZXNzIGJhciBjbGljaykgKi9cbiAgYXN5bmMganVtcFRvKGluZGV4OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGlmICghZGVjayB8fCBpbmRleCA8IDAgfHwgaW5kZXggPj0gZGVjay5jaGFpbi5sZW5ndGggfHwgaW5kZXggPT09IGRlY2suaW5kZXgpIHJldHVybjtcbiAgICBjb25zdCB0YXJnZXQgPSBkZWNrLmNoYWluW2luZGV4XTtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5zbGlkZXNNb2RlKSBhd2FpdCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gICAgdm9pZCB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KHRhcmdldCwgZmlsZS5wYXRoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBCYXIgcmVuZGVyaW5nIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIC8qKlxuICAgKiBHZXQgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIGZvciB0aGUgYmFyIHByb3BlcnRpZXMuIFJldHVybnMgYW4gYXJyYXkgb2ZcbiAgICogcGVyY2VudGFnZXMgKHN1bW1pbmcgdG8gMTAwKSBmb3IgZWFjaCBwcm9wZXJ0eS4gTG9hZHMgZnJvbSBzZXR0aW5ncyBvclxuICAgKiBkZWZhdWx0cyB0byBlcXVhbCBkaXN0cmlidXRpb24uXG4gICAqL1xuICBwcml2YXRlIGdldEJhclByb3BlcnR5V2lkdGhzKGNvdW50OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0b3JlZCA9IEpTT04ucGFyc2UodGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0eVdpZHRocyB8fCBcIltdXCIpO1xuICAgICAgaWYgKFxuICAgICAgICBBcnJheS5pc0FycmF5KHN0b3JlZCkgJiZcbiAgICAgICAgc3RvcmVkLmxlbmd0aCA9PT0gY291bnQgJiZcbiAgICAgICAgc3RvcmVkLmV2ZXJ5KChuKSA9PiB0eXBlb2YgbiA9PT0gXCJudW1iZXJcIilcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gc3RvcmVkO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiBBcnJheShjb3VudCkuZmlsbCgxMDAgLyBjb3VudCk7XG4gIH1cblxuICAvKiogU2F2ZSBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgdG8gc2V0dGluZ3MgKi9cbiAgcHJpdmF0ZSBhc3luYyBzYXZlQmFyUHJvcGVydHlXaWR0aHMod2lkdGhzOiBudW1iZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgPSBKU09OLnN0cmluZ2lmeSh3aWR0aHMpO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICAvKiogRGVjaWRlIHdoYXQgdGhlIHNsaWRlcyBiYXIgc2hvd3MsIHRoZW4gcmUtcmVuZGVyIGl0ICovXG4gIHJlZnJlc2goKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmJhcikgcmV0dXJuO1xuICAgIHRoaXMuYXBwbHlUaGVtZUNsYXNzKCk7XG5cbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUodGhpcy5hcHApO1xuICAgIGNvbnN0IGlzQ2FyZCA9IHRoaXMuaXNEZWNrTm90ZShmaWxlKTtcbiAgICBjb25zdCBsaXZlUHJldmlld05vdyA9IG1vZGUgPT09IFwic291cmNlXCIgJiYgaXNMaXZlUHJldmlldyh0aGlzLmFwcCk7XG5cbiAgICAvLyBMZWF2aW5nIGEgZGVjayBub3RlLCBvciBsZWF2aW5nIHRoZSBMaXZlIFByZXZpZXcgKGUuZy4gQ21kL0N0cmwrRSB0b1xuICAgIC8vIHJlYWRpbmcgdmlldyksIGVuZHMgU2xpZGVzIG1vZGUgXHUyMDE0IG9ubHkgdGhlIHRvZ2dsZSBjb21tYW5kIHJlLWVudGVycyBpdC5cbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlICYmICghaXNDYXJkIHx8ICFsaXZlUHJldmlld05vdykpIHtcbiAgICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1lYXN1cmUgdGhlIHRhYiBiYXIgd2hpbGUgaXQgaXMgc3RpbGwgdmlzaWJsZSAoU2xpZGVzIG1vZGUgaGlkZXMgaXRcbiAgICAvLyBiZWxvdzsgdGhlIGxhc3QgbWVhc3VyZWQgdmFsdWUgaXMgcmV1c2VkIG9uY2UgaGlkZGVuKS5cbiAgICB0aGlzLnRhYkJhckhlaWdodCA9IHN5bmNUYWJCYXJIZWlnaHQodGhpcy50YWJCYXJIZWlnaHQpO1xuXG4gICAgLy8gU2xpZGVzIG1vZGUgaXMgYWN0aXZlIG9ubHkgd2hpbGUgYWN0dWFsbHkgaW4gdGhlIGVkaXRhYmxlIExpdmUgUHJldmlld1xuICAgIGNvbnN0IHNsaWRlcyA9IHRoaXMuc2xpZGVzTW9kZSAmJiBpc0NhcmQgJiYgbGl2ZVByZXZpZXdOb3c7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIsIHNsaWRlcyk7XG4gICAgaWYgKCFzbGlkZXMpIHRoaXMucG9pbnRlckhpZGRlbiA9IGZhbHNlOyAvLyBsZWF2aW5nIFNsaWRlcyByZXN0b3JlcyB0aGUgcG9pbnRlclxuICAgIHRoaXMuc3luY1BvaW50ZXJDbGFzcyhzbGlkZXMpO1xuICAgIHRoaXMudXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzKTtcblxuICAgIGNvbnN0IGJhclZpc2libGUgPSBzbGlkZXMgJiYgdGhpcy5zZXR0aW5ncy5zaG93U2xpZGVzQmFyICYmICF0aGlzLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAvLyBXaGVuIGJhciBpcyBoaWRkZW4sIHNldCBib3R0b20gcGFkZGluZyB0byAwIHNvIHRoZSBjYXJkIGZpbGxzIHRoZSBmdWxsXG4gICAgLy8gd2luZG93IGhlaWdodC4gV2hlbiB2aXNpYmxlLCByZW1vdmUgdGhlIG92ZXJyaWRlIHNvIENTUyBmYWxscyBiYWNrIHRvXG4gICAgLy8gLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQgKGNsZWFycyB0aGUgYmFyIGFzIGJlZm9yZSkuXG4gICAgaWYgKGJhclZpc2libGUpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtYmFyLWhlaWdodFwiLCBcIjBweFwiKTtcbiAgICB9XG4gICAgaWYgKCFiYXJWaXNpYmxlKSB7XG4gICAgICB0aGlzLmJhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZmlsZSkgcmV0dXJuOyAvLyBiYXJWaXNpYmxlIGltcGxpZXMgYSBmaWxlLCBidXQgbmFycm93IGZvciBUeXBlU2NyaXB0XG5cbiAgICBjb25zdCBmbSA9IGFjdGl2ZUZyb250bWF0dGVyKHRoaXMuYXBwKTtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGNsZWFyQ2hpbGRyZW4odGhpcy5iYXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExlZnQ6IHByZXZpb3VzIC8gbmV4dCBidXR0b25zIChib3RoIGFsd2F5cyBzaG93biBpbnNpZGUgYSBkZWNrO1xuICAgIC8vICAgICAgICB0aGUgb25lIHRoYXQgY2Fubm90IG1vdmUgaXMgZGlzYWJsZWQgLyBsaWdodCBncmF5KSBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyAmJiBkZWNrKSB7XG4gICAgICBjb25zdCBoYXNQcmV2ID0gZGVjay5pbmRleCA+IDA7XG4gICAgICBjb25zdCBoYXNOZXh0ID0gZGVjay5pbmRleCA8IGRlY2suY2hhaW4ubGVuZ3RoIC0gMTtcbiAgICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBuYXYuY2xhc3NOYW1lID0gXCJuYXRpdmUtc2xpZGVzLW5hdlwiO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVDMFwiLCBcIlByZXZpb3VzIHBhZ2VcIiwgKCkgPT4gdGhpcy5uYXZpZ2F0ZShcInByZXZcIiksICFoYXNQcmV2KSk7XG4gICAgICBuYXYuYXBwZW5kQ2hpbGQobmF2QnV0dG9uKFwiXHUyNUI2XCIsIFwiTmV4dCBwYWdlXCIsICgpID0+IHRoaXMubmF2aWdhdGUoXCJuZXh0XCIpLCAhaGFzTmV4dCkpO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTWlkZGxlOiBjb25maWd1cmVkIHByb3BlcnR5IGNvbHVtbnMgd2l0aCBkcmFnZ2FibGUgZGl2aWRlcnMgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgcHJvcE5hbWVzID0gdGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzXG4gICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBpZiAocHJvcE5hbWVzLmxlbmd0aCA+IDAgJiYgZm0pIHtcbiAgICAgIGNvbnN0IGVudHJpZXM6IFtzdHJpbmcsIHN0cmluZ11bXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHByb3BOYW1lcykge1xuICAgICAgICBpZiAobmFtZSBpbiBmbSkge1xuICAgICAgICAgIGNvbnN0IHZhbCA9IGZtW25hbWVdO1xuICAgICAgICAgIGlmICh2YWwgIT0gbnVsbCkgZW50cmllcy5wdXNoKFtuYW1lLCBmb3JtYXRWYWx1ZSh2YWwpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gXCJuYXRpdmUtc2xpZGVzLWJhci1wcm9wZXJ0aWVzXCI7XG5cbiAgICAgICAgY29uc3Qgd2lkdGhzID0gdGhpcy5nZXRCYXJQcm9wZXJ0eVdpZHRocyhlbnRyaWVzLmxlbmd0aCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgWywgdmFsdWVdID0gZW50cmllc1tpXTtcbiAgICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgaXRlbS5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiO1xuICAgICAgICAgIGl0ZW0uc3R5bGUuZmxleEJhc2lzID0gYGNhbGMoJHt3aWR0aHNbaV19JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgO1xuICAgICAgICAgIGl0ZW0udGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSA8IGVudHJpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY29uc3QgZGl2aWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBkaXZpZGVyLmNsYXNzTmFtZSA9IFwibmF0aXZlLXNsaWRlcy1iYXItZGl2aWRlclwiO1xuICAgICAgICAgICAgZGl2aWRlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgY29uc3Qgc3RhcnRYID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgY29uc3QgaW5pdGlhbFdpZHRocyA9IFsuLi53aWR0aHNdO1xuICAgICAgICAgICAgICBjb25zdCBvbk1vdmUgPSAoZXY6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9ICgoZXYuY2xpZW50WCAtIHN0YXJ0WCkgLyBjb250YWluZXJXaWR0aCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TGVmdCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaV0gKyBkZWx0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UmlnaHQgPSBNYXRoLm1heCg1LCBpbml0aWFsV2lkdGhzW2kgKyAxXSAtIGRlbHRhKTtcbiAgICAgICAgICAgICAgICB3aWR0aHNbaV0gPSBuZXdMZWZ0O1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpICsgMV0gPSBuZXdSaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICAgICAgICAgICAgIFwiLm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uc3R5bGUuZmxleEJhc2lzID1cbiAgICAgICAgICAgICAgICAgIGBjYWxjKCR7bmV3TGVmdH0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWA7XG4gICAgICAgICAgICAgICAgaXRlbXNbaSArIDFdLnN0eWxlLmZsZXhCYXNpcyA9XG4gICAgICAgICAgICAgICAgICBgY2FsYygke25ld1JpZ2h0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYDtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgY29uc3Qgb25VcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudXNlclNlbGVjdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdm9pZCB0aGlzLnNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHMpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IFwiY29sLXJlc2l6ZVwiO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdmlkZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQnJva2VuIGRlY2sgbGlua3MgXHUyMTkyIHdhcm5pbmcgY2hpcCBzbyBkZWNrIGF1dGhvcnMgc3BvdCB0eXBvc1xuICAgIGNvbnN0IGJyb2tlbiA9IGZpbGUgPyB0aGlzLmRlY2tTZXJ2aWNlLmJyb2tlbihmaWxlKSA6IFtdO1xuICAgIGlmIChicm9rZW4ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgd2FybiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgd2Fybi5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtd2FyblwiO1xuICAgICAgd2Fybi50ZXh0Q29udGVudCA9IFwiXHUyNkEwIFwiICsgYnJva2VuLmpvaW4oXCIsIFwiKTtcbiAgICAgIHdhcm4udGl0bGUgPSBcIkJyb2tlbiBkZWNrIGxpbmsocykgXHUyMDE0IHRoZSB0YXJnZXQgbm90ZSBkb2VzIG5vdCBleGlzdFwiO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQod2Fybik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEJvdHRvbS1yaWdodDogYXV0by1jb21wdXRlZCBwYWdlIG51bWJlciBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgIT09IFwibm9uZVwiICYmIGRlY2spIHtcbiAgICAgIGNvbnN0IHBhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIHBhZ2UuY2xhc3NOYW1lID0gXCJuYXRpdmUtc2xpZGVzLXBhZ2VcIjtcbiAgICAgIC8vIHYxLjAuMCBuZXh0LW9ubHkgc2VtYW50aWNzOiBjaGFpblswXSBpcyB0aGUgaGVhZCBzbGlkZSA9IHBhZ2UgMTtcbiAgICAgIC8vIHRvdGFsIGlzIHRoZSBmdWxsIGNoYWluIGxlbmd0aC5cbiAgICAgIGNvbnN0IHRvdGFsID0gZGVjay5jaGFpbi5sZW5ndGg7XG4gICAgICBwYWdlLnRleHRDb250ZW50ID1cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPT09IFwiZnJhY3Rpb25cIlxuICAgICAgICAgID8gYCR7ZGVjay5pbmRleCArIDF9IC8gJHt0b3RhbH1gXG4gICAgICAgICAgOiBgJHtkZWNrLmluZGV4ICsgMX1gO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFByb2dyZXNzIGluZGljYXRvcjogZGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IGJhciB0b3AgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1Byb2dyZXNzICYmIGRlY2sgJiYgZGVjay5jaGFpbi5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBwcm9ncmVzcy5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3NcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVjay5jaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGkgPCBkZWNrLmluZGV4ID8gXCJwYXN0XCIgOiBpID09PSBkZWNrLmluZGV4ID8gXCJjdXJyZW50XCIgOiBcImZ1dHVyZVwiO1xuICAgICAgICBzZWcuY2xhc3NOYW1lID0gYG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnIG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnLS0ke3N0YXRlfWA7XG4gICAgICAgIHNlZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdm9pZCB0aGlzLmp1bXBUbyhpKSk7XG4gICAgICAgIHByb2dyZXNzLmFwcGVuZENoaWxkKHNlZyk7XG4gICAgICB9XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChwcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gSGlkZSB0aGUgc2xpZGVzIGJhciBlbnRpcmVseSB3aGVuIGl0IGhhcyBub3RoaW5nIHRvIGRpc3BsYXkgKG5vIHByb3BlcnRpZXMsXG4gICAgLy8gYW5kIG5vdCBwYXJ0IG9mIGEgZGVjaylcbiAgICB0aGlzLmJhci5zdHlsZS5kaXNwbGF5ID0gdGhpcy5iYXIuY2hpbGRFbGVtZW50Q291bnQgPT09IDAgPyBcIm5vbmVcIiA6IFwiXCI7XG4gIH1cbn1cbiIsICIvKiogQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50IChoaWRkZW4gdW50aWwgcmVmcmVzaCgpIHNob3dzIGl0KSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhcigpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGJhci5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtYmFyXCI7XG4gIGJhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGJhci50aXRsZSA9IFwiQ2xpY2sgdG8gcGFyayB0aGUgbW91c2UgXHUyMDE0IGhpZGVzIHRoZSBlZGl0b3IgY2FyZXQgd2hpbGUgcHJlc2VudGluZ1wiO1xuICAvLyBQcmVzZW50YXRpb24gcGFya2luZzogY2xpY2tpbmcgdGhlIGJhciBrZWVwcyBmb2N1cyBvdXQgb2YgdGhlIGVkaXRvciBzb1xuICAvLyB0aGUgYmxpbmtpbmcgY2FyZXQgZGlzYXBwZWFycy4gcHJldmVudERlZmF1bHQgc3RvcHMgdGhlIGNsaWNrIGZyb20gbW92aW5nXG4gIC8vIGZvY3VzIG9yIHN0YXJ0aW5nIGEgdGV4dCBzZWxlY3Rpb247IGJ1dHRvbnMgc3RpbGwgcmVjZWl2ZSB0aGVpciBjbGljayBldmVudC5cbiAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgYWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSBhY3RpdmUuYmx1cigpO1xuICB9KTtcbiAgcmV0dXJuIGJhcjtcbn1cblxuLyoqIEJ1aWxkIGEgXHUyNUMwIC8gXHUyNUI2IG5hdmlnYXRpb24gYnV0dG9uOyBgZGlzYWJsZWRgIHJlbmRlcnMgaXQgbGlnaHQgZ3JheS9pbmFjdGl2ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hdkJ1dHRvbihcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGlwOiBzdHJpbmcsXG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQsXG4gIGRpc2FibGVkID0gZmFsc2UsXG4pOiBIVE1MQnV0dG9uRWxlbWVudCB7XG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIGJ0bi5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtbmF2LWJ0blwiO1xuICBidG4udGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgYnRuLnRpdGxlID0gdGlwO1xuICBidG4uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgaWYgKCFkaXNhYmxlZCkgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSB0b3AgdGFiIGJhciBhbmQgZXhwb3NlIGl0cyBoZWlnaHQgYXMgdGhlIENTUyB2YXJpYWJsZVxuICogLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQsIHJldHVybmluZyB0aGUgKHBvc3NpYmx5IHVwZGF0ZWQpIGNhY2hlZFxuICogdmFsdWUuIFRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSwgc28gdGhlIGxhc3QgbWVhc3VyZWRcbiAqIHZhbHVlIGlzIHJldXNlZCB0aGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bmNUYWJCYXJIZWlnaHQoY2FjaGVkOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICBcIi53b3Jrc3BhY2UtdGFicy5tb2QtdG9wIC53b3Jrc3BhY2UtdGFiLWhlYWRlci1jb250YWluZXJcIixcbiAgKTtcbiAgaWYgKHRhYkJhciAmJiB0YWJCYXIub2Zmc2V0SGVpZ2h0ID4gMCkgY2FjaGVkID0gdGFiQmFyLm9mZnNldEhlaWdodDtcbiAgaWYgKGNhY2hlZCA+IDApIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiLCBgJHtjYWNoZWR9cHhgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBObyBtZWFzdXJlbWVudCB5ZXQgKHRhYiBiYXIgaGlkZGVuIHNpbmNlIGxvYWQpIFx1MjAxNCBsZXQgdGhlIENTUyBmYWxsYmFjayBhcHBseS5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9tb2RlXCI7XG5cbi8qKlxuICogVHlwb2dyYXBoeS1tZWFzdXJlbWVudCB0b29saW5nIChkZXYgYnVpbGRzIG9ubHkpLlxuICpcbiAqIFRoZSBgbnMtZGVidWctc3R5bGVzYCBjb21tYW5kIHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyBpblxuICogZWRpdCAoTGl2ZSBQcmV2aWV3KSBhbmQgdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldywgbWVyZ2VzIHRoZVxuICogcmVzdWx0cywgY29tcHV0ZXMgYW4gZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kIHdyaXRlcyBpdCB0b1xuICogLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC4gUmVnaXN0ZXJlZCBvbmx5IHdoZW4gdGhlXG4gKiBidWlsZC10aW1lIERFVl9NT0RFIGZsYWcgaXMgdHJ1ZTsgcmVsZWFzZSBidWlsZHMgdHJlZS1zaGFrZSB0aGlzIG1vZHVsZSBvdXQuXG4gKi9cblxuLyoqIEZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyB1c2VkIGJ5IHRoZSBkZWJ1ZyBjb21tYW5kIChlZGl0IHNpZGUpICovXG5leHBvcnQgY29uc3QgU0FNUExFX05PVEVfTkFNRVMgPSBbXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtaGVhZGluZ3NcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1saXN0XCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtY29kZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLXF1b3RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbWVkaWFcIixcbl07XG5cbi8qKiBTdHlsZSBzZWN0aW9ucyBzYW1wbGVkIGJ5IHNhbXBsZVN0eWxlcygpIGFuZCBjb21wYXJlZCBieSBkaWZmRHVtcHMoKSAqL1xuY29uc3QgU1RZTEVfU0VDVElPTlMgPSBbXG4gIFwiY29udGFpbmVyXCIsXG4gIFwicGFyYWdyYXBoXCIsXG4gIFwiaDFcIixcbiAgXCJsaXN0SXRlbVwiLFxuICBcImNvZGVCbG9ja1wiLFxuICBcImJsb2NrcXVvdGVcIixcbiAgXCJpbmxpbmVDb2RlXCIsXG4gIFwidGFibGVcIixcbiAgXCJpbWFnZVwiLFxuICBcImhvcml6b250YWxSdWxlXCIsXG5dO1xuXG4vKiogUHJvbWlzZS1iYXNlZCBzbGVlcCAqL1xuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuLyoqXG4gKiBNZXJnZSBub24tbWlzc2luZyBzdHlsZSBzZWN0aW9ucyBvZiBhIGZyZXNoIHNhbXBsZSBpbnRvIHRoZSB0YXJnZXRcbiAqIChmaXJzdCBub24tbWlzc2luZyB2YWx1ZSB3aW5zKS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTYW1wbGUodGFyZ2V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgc2FtcGxlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHZvaWQge1xuICBmb3IgKGNvbnN0IGtleSBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IHNlY3Rpb24gPSBzYW1wbGVba2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuICAgIGlmICghc2VjdGlvbiB8fCBcIihtaXNzaW5nKVwiIGluIHNlY3Rpb24pIGNvbnRpbnVlO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGFyZ2V0W2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoZXhpc3RpbmcgJiYgIShcIihtaXNzaW5nKVwiIGluIGV4aXN0aW5nKSkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzZWN0aW9uO1xuICB9XG4gIC8vIFByb2JlIGZpZWxkcyByaWRlIGFsb25nIChmaXJzdCBub24tZW1wdHkgd2lucylcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwibGlzdExpbmVzXCIsXG4gICAgXCJtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXlcIixcbiAgICBcImgxT2Zmc2V0VG9wXCIsXG4gICAgXCJoMVRvcEluQ29udGVudFwiLFxuICAgIFwiaDFMZWZ0SW5Db250ZW50XCIsXG4gICAgXCJ0aXRsZVwiLFxuICAgIFwiY29udGVudENoaWxkcmVuXCIsXG4gICAgXCJ0b3BDaGFpblwiLFxuICBdKSB7XG4gICAgY29uc3QgcHJvYmUgPSBzYW1wbGVba2V5XTtcbiAgICBpZiAocHJvYmUgPT09IHVuZGVmaW5lZCB8fCBwcm9iZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvYmUpICYmIHByb2JlLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgaWYgKHR5cGVvZiBwcm9iZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShwcm9iZSkgJiYgT2JqZWN0LmtleXMocHJvYmUpLmxlbmd0aCA9PT0gMClcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmICh0YXJnZXRba2V5XSA9PT0gdW5kZWZpbmVkKSB0YXJnZXRba2V5XSA9IHByb2JlO1xuICB9XG59XG5cbi8qKlxuICogQ29tcGFyZSB0aGUgc3R5bGUgc2VjdGlvbnMgb2YgYW4gZWRpdCBkdW1wIGFuZCBhIHJlYWRpbmcgZHVtcDsgb25seVxuICoga2V5cyB3aG9zZSB2YWx1ZXMgZGlmZmVyIGFyZSBrZXB0LCBhcyB7IGtleTogeyBlZGl0LCByZWFkaW5nIH0gfS5cbiAqL1xuZnVuY3Rpb24gZGlmZkR1bXBzKFxuICBlZGl0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgZm9yIChjb25zdCBzZWN0aW9uIG9mIFNUWUxFX1NFQ1RJT05TKSB7XG4gICAgY29uc3QgZSA9IChlZGl0W3NlY3Rpb25dID8/IHt9KSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGNvbnN0IHIgPSAocmVhZGluZ1tzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldChbLi4uT2JqZWN0LmtleXMoZSksIC4uLk9iamVjdC5rZXlzKHIpXSk7XG4gICAgY29uc3QgZGlmZnM6IFJlY29yZDxzdHJpbmcsIHsgZWRpdDogc3RyaW5nOyByZWFkaW5nOiBzdHJpbmcgfT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICBpZiAoZVtrZXldICE9PSByW2tleV0pIHtcbiAgICAgICAgZGlmZnNba2V5XSA9IHsgZWRpdDogZVtrZXldID8/IFwiKG1pc3NpbmcpXCIsIHJlYWRpbmc6IHJba2V5XSA/PyBcIihtaXNzaW5nKVwiIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhkaWZmcykubGVuZ3RoID4gMCkgb3V0W3NlY3Rpb25dID0gZGlmZnM7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqIFNhbXBsZSB0aGUgY3VycmVudCB2aWV3J3MgdHlwb2dyYXBoeSBjb21wdXRlZCBzdHlsZXMgKyBDU1MgdmFyaWFibGVzICovXG5mdW5jdGlvbiBzYW1wbGVTdHlsZXMoYXBwOiBBcHApOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGlzRWRpdCA9IHZpZXcuZ2V0TW9kZSgpID09PSBcInNvdXJjZVwiO1xuICBjb25zdCBjb250ZW50RWwgPSB2aWV3LmNvbnRlbnRFbDtcbiAgLy8gRmlyc3QgbWF0Y2hpbmcgY2FuZGlkYXRlIHdpbnMgXHUyMDE0IGVkaXQgKGNtNikgYW5kIHJlYWRpbmcgdXNlXG4gIC8vIGRpZmZlcmVudCBlbGVtZW50IHN0cnVjdHVyZXMgKGUuZy4gbm8gcHJlL2Jsb2NrcXVvdGUgaW4gY202KS5cbiAgY29uc3QgcGljayA9IChzZWxzOiBzdHJpbmdbXSk6IEhUTUxFbGVtZW50IHwgbnVsbCA9PiB7XG4gICAgZm9yIChjb25zdCBzZWwgb2Ygc2Vscykge1xuICAgICAgY29uc3QgZWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc2VsKTtcbiAgICAgIGlmIChlbCkgcmV0dXJuIGVsO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgY29uc3Qgc3R5bGUgPSAoZWw6IEhUTUxFbGVtZW50IHwgbnVsbCwgcHJvcHM6IHN0cmluZ1tdKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gICAgaWYgKCFlbCkgcmV0dXJuIHsgXCIobWlzc2luZylcIjogXCJlbGVtZW50IG5vdCBpbiB0aGlzIG5vdGVcIiB9O1xuICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIHByb3BzKSB7XG4gICAgICBjb25zdCB2ID0gY3MuZ2V0UHJvcGVydHlWYWx1ZShwKS50cmltKCk7XG4gICAgICBpZiAodikgb3V0W3BdID0gdjtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgY29uc3QgdmFycyA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XG4gIGNvbnN0IGNzc1ZhciA9IChuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4gdmFycy5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpLnRyaW0oKTtcblxuICBjb25zdCBjb250YWluZXIgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tY29udGVudFwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3XCIsXG4gIF0pO1xuICBjb25zdCBwYXJhID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWxpbmU6bm90KC5IeXBlck1ELWhlYWRlcilcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBwXCIsXG4gIF0pO1xuICBjb25zdCBoMSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWhlYWRlci0xXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaDFcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBoMVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGgxXCIsXG4gIF0pO1xuICBjb25zdCBsaXN0SXRlbSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtbGlzdC1saW5lXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICAgIGlzRWRpdCA/IFwiLkh5cGVyTUQtbGlzdC1saW5lXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyB1bCA+IGxpXCIsXG4gIF0pO1xuICBjb25zdCBwcmUgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBwcmVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1lZGl0aW5nIHByZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtY29kZWJsb2NrXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gIF0pO1xuICBjb25zdCBxdW90ZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgYmxvY2txdW90ZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGJsb2NrcXVvdGVcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1xdW90ZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGJsb2NrcXVvdGVcIixcbiAgXSk7XG4gIGNvbnN0IGlubGluZUNvZGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGNvZGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBjb2RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWlubGluZS1jb2RlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgY29kZVwiLFxuICBdKTtcbiAgY29uc3QgdGFibGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IHRhYmxlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgdGFibGVcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIHRhYmxlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyB0YWJsZVwiLFxuICBdKTtcbiAgY29uc3QgaW1nID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBpbWdcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIGltZ1wiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaW1nXCIsXG4gICAgXCJpbWdcIiwgLy8gd2hvbGUtZG9jdW1lbnQgZmFsbGJhY2tcbiAgXSk7XG4gIGNvbnN0IGhyID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBoclwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBoclwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaHJcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1oclwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gIF0pO1xuXG4gIC8vIFN0cnVjdHVyZSBwcm9iZXMgKGVkaXQgdmlldyBvbmx5KTogdGhlIHNvdXJjZS12aWV3IGNsYXNzIGxpc3RcbiAgLy8gKGNvbmZpcm1zIHRoZSBMaXZlIFByZXZpZXcgbWFya2VyIGNsYXNzKSBhbmQgdW5pcXVlIGVsZW1lbnQgdGFnc1xuICAvLyBpbnNpZGUgdGhlIGVkaXRvciAocmV2ZWFscyBob3cgY202IHJlbmRlcnMgY29kZSBibG9ja3MgZXRjLiB3aGVuXG4gIC8vIHRoZSB1c3VhbCBzZWxlY3RvcnMgZG8gbm90IG1hdGNoKS5cbiAgY29uc3Qgc291cmNlVmlld0NsYXNzID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNlwiKT8uY2xhc3NOYW1lID8/IFwiXCI7XG4gIGNvbnN0IGRvbVRhZ3M6IHN0cmluZ1tdID0gW107XG4gIGlmIChpc0VkaXQpIHtcbiAgICBjb25zdCB0YWdzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29udGVudEVsXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202ICpcIilcbiAgICAgIC5mb3JFYWNoKChlbCkgPT4gdGFncy5hZGQoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG4gICAgZG9tVGFncy5wdXNoKC4uLnRhZ3MpO1xuICB9XG4gIC8vIExpc3QtbGluZSBwcm9iZSAoZWRpdCB2aWV3IG9ubHkpOiBjbGFzcyBuYW1lcyArIGNvbXB1dGVkIHBhZGRpbmdcbiAgLy8gb2YgdGhlIGZpcnN0IGxpc3QgbGluZXMgXHUyMDE0IG5lc3RlZCBsZXZlbHMgb2Z0ZW4gdXNlIGRpc3RpbmN0XG4gIC8vIGNsYXNzZXMgb3IgaW5saW5lIHBhZGRpbmdzLCB3aGljaCBkZWNpZGVzIHdoZXRoZXIgYSBsZXZlbC1hd2FyZVxuICAvLyBpbmRlbnQgb3ZlcnJpZGUgaXMgZXZlbiBwb3NzaWJsZS5cbiAgY29uc3QgbGlzdExpbmVzOiB7IGNsYXNzTmFtZTogc3RyaW5nOyBwYWRkaW5nTGVmdDogc3RyaW5nIH1bXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29udGVudEVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuSHlwZXJNRC1saXN0LWxpbmVcIikuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgIGlmIChpID49IDQpIHJldHVybjtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBsaXN0TGluZXMucHVzaCh7XG4gICAgICAgIGNsYXNzTmFtZTogZWwuY2xhc3NOYW1lLFxuICAgICAgICBwYWRkaW5nTGVmdDogY3MuZ2V0UHJvcGVydHlWYWx1ZShcInBhZGRpbmctbGVmdFwiKS50cmltKCksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvLyBGcm9udG1hdHRlciBwcm9iZXM6IGRvZXMgdGhlIChoaWRkZW4pIHByb3BlcnRpZXMgYXJlYSBzdGlsbFxuICAvLyBvY2N1cHkgc3BhY2UgaW4gTGl2ZSBQcmV2aWV3PyBBbmQgaG93IGZhciBpcyB0aGUgSDEgZnJvbSB0aGVcbiAgLy8gdG9wIG9mIHRoZSBjb250ZW50IGFyZWE/IChyZWFkaW5nIG1vZGUgaGFzIG5vIHN1Y2ggcGFkZGluZylcbiAgY29uc3QgbWV0YWRhdGFEaXNwbGF5ID0gKCgpID0+IHtcbiAgICBjb25zdCBzZWwgPSBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWV0YWRhdGEtY29udGFpbmVyXCI7XG4gICAgY29uc3QgZWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc2VsKTtcbiAgICByZXR1cm4gZWwgPyBnZXRDb21wdXRlZFN0eWxlKGVsKS5kaXNwbGF5IDogXCIobm90IGluIERPTSlcIjtcbiAgfSkoKTtcbiAgY29uc3QgaDFPZmZzZXRUb3AgPSAoKCkgPT4ge1xuICAgIGlmICghaDEpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IHRvcCA9IDA7XG4gICAgbGV0IG5vZGU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGgxO1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRlbnRFbCAmJiBub2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICB0b3AgKz0gbm9kZS5vZmZzZXRUb3A7XG4gICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdG9wO1xuICB9KSgpO1xuICAvLyBXaGF0IG9jY3VwaWVzIHRoZSBzcGFjZSBiZXR3ZWVuIHRoZSBjb250ZW50IHRvcCBhbmQgdGhlIEgxP1xuICAvLyAoZWRpdCkgZmlyc3QgY2hpbGRyZW4gb2YgLmNtLWNvbnRlbnQsIGFuZCB0aGUgbmV0IEgxIGRpc3RhbmNlXG4gIC8vIGZyb20gdGhlIGNvbnRlbnQgYW5jaG9yIFx1MjAxNCByZWFkaW5nIGhhcyBubyBzdWNoIGdhcC5cbiAgY29uc3QgYW5jaG9yID0gaXNFZGl0XG4gICAgPyBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKVxuICAgIDogY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3XCIpO1xuICBjb25zdCBoMVRvcEluQ29udGVudCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSB8fCAhYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGgxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApO1xuICB9KSgpO1xuICBjb25zdCBoMUxlZnRJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpO1xuICB9KSgpO1xuICBjb25zdCBjb250ZW50Q2hpbGRyZW4gPSAoKCkgPT4ge1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFuY2hvci5jaGlsZHJlbilcbiAgICAgIC5zbGljZSgwLCA0KVxuICAgICAgLm1hcCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjbHM6IChlbCBhcyBIVE1MRWxlbWVudCkuY2xhc3NOYW1lIHx8IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpLFxuICAgICAgICAgIG1hcmdpblRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgICAgIHBhZGRpbmdUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiBjcy5tYXJnaW5Cb3R0b20sXG4gICAgICAgICAgcGFkZGluZ0JvdHRvbTogY3MucGFkZGluZ0JvdHRvbSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9KSgpO1xuICAvLyBDb250YWluZXIgY2hhaW4gcHJvYmU6IGZyb20gLmNtLWNvbnRlbnQgdXAgdG8gdGhlIHZpZXctY29udGVudCxcbiAgLy8gZWFjaCB3cmFwcGVyJ3MgcGFkZGluZy9tYXJnaW4gXHUyMDE0IGxvY2F0ZXMgdGhlIGxlZnRvdmVyIHZlcnRpY2FsXG4gIC8vIG9mZnNldCBiZXR3ZWVuIGVkaXQgYW5kIHJlYWRpbmcgY29udGVudCBhcmVhcy5cbiAgY29uc3QgdG9wQ2hhaW4gPSAoKCkgPT4ge1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcnRzOiB7IGNsczogc3RyaW5nOyBwYWRUb3A6IHN0cmluZzsgbWFyVG9wOiBzdHJpbmcgfVtdID0gW107XG4gICAgbGV0IG5vZGU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGFuY2hvcjtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIGNsczogbm9kZS5jbGFzc05hbWUgfHwgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHBhZFRvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgICAgbWFyVG9wOiBjcy5tYXJnaW5Ub3AsXG4gICAgICB9KTtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBwYXJ0cztcbiAgfSkoKTtcblxuICAvLyBUaXRsZSBwcm9iZTogdGhlIGdlbmVyYXRlZCA6OmJlZm9yZSBpbiBTbGlkZXMgbW9kZSAod2hlbiBhIHRpdGxlIGlzXG4gIC8vIGNvbmZpZ3VyZWQpLiBDYXB0dXJlcyBpdHMgY29tcHV0ZWQgc3R5bGUgc28gd2UgY2FuIGRpZmYgaXQgYWdhaW5zdCB0aGVcbiAgLy8gYm9keSBIMSAoLmNtLWhlYWRlci0xKSBhbmQgYWxpZ24gdGhlbSBleGFjdGx5LlxuICBjb25zdCB0aXRsZUJlZm9yZSA9ICgoKSA9PiB7XG4gICAgaWYgKCFpc0VkaXQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY29udGVudCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICAgIGlmICghY29udGVudCB8fCAhY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoY29udGVudCwgXCI6OmJlZm9yZVwiKTtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogY3MuY29udGVudCxcbiAgICAgIGRpc3BsYXk6IGNzLmRpc3BsYXksXG4gICAgICBwb3NpdGlvbjogY3MucG9zaXRpb24sXG4gICAgICB0b3A6IGNzLnRvcCxcbiAgICAgIGxlZnQ6IGNzLmxlZnQsXG4gICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgZm9udEZhbWlseTogY3MuZm9udEZhbWlseSxcbiAgICAgIGZvbnRTaXplOiBjcy5mb250U2l6ZSxcbiAgICAgIGxpbmVIZWlnaHQ6IGNzLmxpbmVIZWlnaHQsXG4gICAgICBmb250V2VpZ2h0OiBjcy5mb250V2VpZ2h0LFxuICAgICAgZm9udFZhcmlhbnQ6IGNzLmZvbnRWYXJpYW50LFxuICAgICAgY29sb3I6IGNzLmNvbG9yLFxuICAgICAgbGV0dGVyU3BhY2luZzogY3MubGV0dGVyU3BhY2luZyxcbiAgICAgIHRleHRUcmFuc2Zvcm06IGNzLnRleHRUcmFuc2Zvcm0sXG4gICAgICB3b3JkU3BhY2luZzogY3Mud29yZFNwYWNpbmcsXG4gICAgICBmb250S2VybmluZzogY3MuZm9udEtlcm5pbmcsXG4gICAgICBmb250RmVhdHVyZVNldHRpbmdzOiBjcy5mb250RmVhdHVyZVNldHRpbmdzLFxuICAgICAgZm9udFZhcmlhbnROdW1lcmljOiBjcy5mb250VmFyaWFudE51bWVyaWMsXG4gICAgICBmb250VmFyaWFudExpZ2F0dXJlczogY3MuZm9udFZhcmlhbnRMaWdhdHVyZXMsXG4gICAgICBmb250VmFyaWFudENhcHM6IGNzLmZvbnRWYXJpYW50Q2FwcyxcbiAgICB9O1xuICB9KSgpO1xuXG4gIGNvbnN0IGR1bXAgPSB7XG4gICAgbW9kZTogaXNFZGl0ID8gXCJlZGl0IChMaXZlIFByZXZpZXcpXCIgOiBcInJlYWRpbmdcIixcbiAgICAvLyBTbGlkZXMgc3R5bGluZyBvbmx5IGFwcGxpZXMgd2hlbiBTbGlkZXMgbW9kZSBpcyBvblxuICAgIHNsaWRlc0FjdGl2ZTogZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIiksXG4gICAgZG9tVGFnczogaXNFZGl0ID8gZG9tVGFncyA6IHVuZGVmaW5lZCxcbiAgICBzb3VyY2VWaWV3Q2xhc3M6IGlzRWRpdCA/IHNvdXJjZVZpZXdDbGFzcyA6IHVuZGVmaW5lZCxcbiAgICBsaXZlUHJldmlldzogaXNFZGl0ID8gaXNMaXZlUHJldmlldyhhcHApIDogdW5kZWZpbmVkLFxuICAgIGxpc3RMaW5lczogaXNFZGl0ID8gbGlzdExpbmVzIDogdW5kZWZpbmVkLFxuICAgIG1ldGFkYXRhQ29udGFpbmVyRGlzcGxheTogbWV0YWRhdGFEaXNwbGF5LFxuICAgIGgxT2Zmc2V0VG9wOiBoMU9mZnNldFRvcCxcbiAgICBoMVRvcEluQ29udGVudDogaDFUb3BJbkNvbnRlbnQsXG4gICAgaDFMZWZ0SW5Db250ZW50OiBoMUxlZnRJbkNvbnRlbnQsXG4gICAgY29udGVudENoaWxkcmVuOiBjb250ZW50Q2hpbGRyZW4sXG4gICAgdG9wQ2hhaW46IHRvcENoYWluLFxuICAgIHRpdGxlOiB0aXRsZUJlZm9yZSxcbiAgICBjb250YWluZXI6IHN0eWxlKGNvbnRhaW5lciwgW1xuICAgICAgXCJmb250LWZhbWlseVwiLFxuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwibWF4LXdpZHRoXCIsXG4gICAgICBcIndpZHRoXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcImNvbG9yXCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBwYXJhZ3JhcGg6IHN0eWxlKHBhcmEsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGgxOiBzdHlsZShoMSwgW1xuICAgICAgXCJmb250LWZhbWlseVwiLFxuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwiZm9udC13ZWlnaHRcIixcbiAgICAgIFwiZm9udC12YXJpYW50XCIsXG4gICAgICBcImNvbG9yXCIsXG4gICAgICBcImxldHRlci1zcGFjaW5nXCIsXG4gICAgICBcInRleHQtdHJhbnNmb3JtXCIsXG4gICAgICBcIndvcmQtc3BhY2luZ1wiLFxuICAgICAgXCJmb250LWtlcm5pbmdcIixcbiAgICAgIFwiZm9udC1mZWF0dXJlLXNldHRpbmdzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1udW1lcmljXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1saWdhdHVyZXNcIixcbiAgICAgIFwiZm9udC12YXJpYW50LWNhcHNcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBsaXN0SXRlbTogc3R5bGUobGlzdEl0ZW0sIFtcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1yaWdodFwiLFxuICAgICAgXCJ0ZXh0LWluZGVudFwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgY29kZUJsb2NrOiBzdHlsZShwcmUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIGJsb2NrcXVvdGU6IHN0eWxlKHF1b3RlLCBbXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJib3JkZXItbGVmdC13aWR0aFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgXSksXG4gICAgaW5saW5lQ29kZTogc3R5bGUoaW5saW5lQ29kZSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgXCJib3JkZXItcmFkaXVzXCIsXG4gICAgXSksXG4gICAgdGFibGU6IHN0eWxlKHRhYmxlLCBbXCJmb250LXNpemVcIiwgXCJsaW5lLWhlaWdodFwiLCBcIndpZHRoXCIsIFwiYm9yZGVyLWNvbGxhcHNlXCJdKSxcbiAgICBpbWFnZTogc3R5bGUoaW1nLCBbXCJkaXNwbGF5XCIsIFwibWFyZ2luLWxlZnRcIiwgXCJtYXJnaW4tcmlnaHRcIiwgXCJtYXgtd2lkdGhcIiwgXCJ3aWR0aFwiXSksXG4gICAgaG9yaXpvbnRhbFJ1bGU6IHN0eWxlKGhyLCBbXCJtYXJnaW4tdG9wXCIsIFwibWFyZ2luLWJvdHRvbVwiLCBcImJvcmRlci10b3Atd2lkdGhcIiwgXCJoZWlnaHRcIl0pLFxuICAgIGNzc1ZhcmlhYmxlczoge1xuICAgICAgXCItLWZvbnQtdGV4dFwiOiBjc3NWYXIoXCItLWZvbnQtdGV4dFwiKSxcbiAgICAgIFwiLS1saW5lLWhlaWdodC1ub3JtYWxcIjogY3NzVmFyKFwiLS1saW5lLWhlaWdodC1ub3JtYWxcIiksXG4gICAgICBcIi0taDEtc2l6ZVwiOiBjc3NWYXIoXCItLWgxLXNpemVcIiksXG4gICAgICBcIi0taDEtbGluZS1oZWlnaHRcIjogY3NzVmFyKFwiLS1oMS1saW5lLWhlaWdodFwiKSxcbiAgICAgIFwiLS1oMS13ZWlnaHRcIjogY3NzVmFyKFwiLS1oMS13ZWlnaHRcIiksXG4gICAgICBcIi0taDEtdmFyaWFudFwiOiBjc3NWYXIoXCItLWgxLXZhcmlhbnRcIiksXG4gICAgICBcIi0taDEtY29sb3JcIjogY3NzVmFyKFwiLS1oMS1jb2xvclwiKSxcbiAgICAgIFwiLS1oMS1tYXJnaW4tdG9wXCI6IGNzc1ZhcihcIi0taDEtbWFyZ2luLXRvcFwiKSxcbiAgICAgIFwiLS1oMS1tYXJnaW4tYm90dG9tXCI6IGNzc1ZhcihcIi0taDEtbWFyZ2luLWJvdHRvbVwiKSxcbiAgICAgIFwiLS1wLXNwYWNpbmdcIjogY3NzVmFyKFwiLS1wLXNwYWNpbmdcIiksXG4gICAgICBcIi0tbGlzdC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tbGlzdC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3QtaW5kZW50XCI6IGNzc1ZhcihcIi0tbGlzdC1pbmRlbnRcIiksXG4gICAgICBcIi0tY29kZS1zaXplXCI6IGNzc1ZhcihcIi0tY29kZS1zaXplXCIpLFxuICAgICAgXCItLWNvZGUtcGFkZGluZ1wiOiBjc3NWYXIoXCItLWNvZGUtcGFkZGluZ1wiKSxcbiAgICAgIFwiLS1jb2RlLXJhZGl1c1wiOiBjc3NWYXIoXCItLWNvZGUtcmFkaXVzXCIpLFxuICAgICAgXCItLWJsb2NrcXVvdGUtcGFkZGluZ1wiOiBjc3NWYXIoXCItLWJsb2NrcXVvdGUtcGFkZGluZ1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLWJvcmRlci10aGlja25lc3NcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLWJvcmRlci10aGlja25lc3NcIiksXG4gICAgICBcIi0tZmlsZS1tYXJnaW5zXCI6IGNzc1ZhcihcIi0tZmlsZS1tYXJnaW5zXCIpLFxuICAgICAgXCItLWZpbGUtbGluZS13aWR0aFwiOiBjc3NWYXIoXCItLWZpbGUtbGluZS13aWR0aFwiKSxcbiAgICAgIFwiLS1ub3JtYWwtZm9udC1zaXplXCI6IGNzc1ZhcihcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiKSxcbiAgICAgIFwiLS1mb250LXRleHQtc2l6ZVwiOiBjc3NWYXIoXCItLWZvbnQtdGV4dC1zaXplXCIpLFxuICAgIH0sXG4gIH07XG4gIHJldHVybiBkdW1wO1xufVxuXG4vKipcbiAqIERlYnVnIHR5cG9ncmFwaHk6IHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyAoZWFjaFxuICogY292ZXJpbmcgYSBncm91cCBvZiBlbGVtZW50cyBcdTIwMTQgYWxsIHZpc2libGUgd2l0aG91dCBzY3JvbGxpbmcpLFxuICogdGhlbiB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgaW4gcmVhZGluZyB2aWV3IChubyB2aXJ0dWFsaXphdGlvblxuICogdGhlcmUpLCBtZXJnZXMgZXZlcnl0aGluZywgY29tcHV0ZXMgdGhlIGVkaXQtdnMtcmVhZGluZyBkaWZmIGFuZFxuICogd3JpdGVzIGl0IHRvIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gaW4gdGhlIHZhdWx0IHJvb3QuXG4gKiBUaGUgdXNlcidzIG93biBub3RlIGlzIHJlc3RvcmVkIGF0IHRoZSBlbmQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkdW1wVHlwb2dyYXBoeShwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBhcHAgPSBwbHVnaW4uYXBwO1xuICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBTbGlkZXM6IGVudGVyIFNsaWRlcyBtb2RlIGZpcnN0IChNb2QrU2hpZnQrRSBvbiBhIGRlY2sgbm90ZSlcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3KSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBTbGlkZXM6IG5vIGFjdGl2ZSBNYXJrZG93biBub3RlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBzdGFydE1vZGUgPSB2aWV3LmdldE1vZGUoKTtcbiAgY29uc3QgYWN0aXZlRmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICBjb25zdCBsZWFmID0gYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcblxuICAvLyBFZGl0IHNpZGU6IGVhY2ggc2hvcnQgbm90ZSBrZWVwcyBldmVyeSB0YXJnZXQgZWxlbWVudCBvbiBzY3JlZW5cbiAgY29uc3QgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFNBTVBMRV9OT1RFX05BTUVTKSB7XG4gICAgY29uc3QgZiA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoYCR7bmFtZX0ubWRgKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGYsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICAgIGF3YWl0IHNsZWVwKDUwMCk7XG4gICAgY29uc3QgcyA9IHNhbXBsZVN0eWxlcyhhcHApO1xuICAgIGlmIChzKSBtZXJnZVNhbXBsZShlZGl0LCBzKTtcbiAgfVxuXG4gIC8vIFJlYWRpbmcgc2lkZTogdGhlIGtpdGNoZW4tc2luayBub3RlIHJlbmRlcnMgZXZlcnl0aGluZyBhdCBvbmNlXG4gIGxldCByZWFkaW5nOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPSBudWxsO1xuICBjb25zdCBkZW1vID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChcInR5cG9ncmFwaHktZGVtby5tZFwiKTtcbiAgaWYgKGRlbW8gaW5zdGFuY2VvZiBURmlsZSkge1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZGVtbywgeyBzdGF0ZTogeyBtb2RlOiBcInByZXZpZXdcIiB9IH0pO1xuICAgIGF3YWl0IHNsZWVwKDgwMCk7XG4gICAgcmVhZGluZyA9IHNhbXBsZVN0eWxlcyhhcHApO1xuICB9XG5cbiAgLy8gUmVzdG9yZSB0aGUgdXNlcidzIG5vdGVcbiAgaWYgKGFjdGl2ZUZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGFjdGl2ZUZpbGUsIHsgc3RhdGU6IHsgbW9kZTogc3RhcnRNb2RlIH0gfSk7XG4gICAgcGx1Z2luLnJlZnJlc2goKTtcbiAgfVxuICBpZiAoIXJlYWRpbmcpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIFNsaWRlczogcmVhZGluZyBzYW1wbGUgZmFpbGVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBheWxvYWQgPSB7IGVkaXQsIHJlYWRpbmcsIGRpZmY6IGRpZmZEdW1wcyhlZGl0LCByZWFkaW5nKSB9O1xuICB0cnkge1xuICAgIGF3YWl0IGFwcC52YXVsdC5hZGFwdGVyLndyaXRlKFwiLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvblwiLCBKU09OLnN0cmluZ2lmeShwYXlsb2FkLCBudWxsLCAyKSk7XG4gICAgbmV3IE5vdGljZShcIlR5cG9ncmFwaHkgZHVtcCBcdTIxOTIgLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiAodmF1bHQgcm9vdClcIik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbmV3IE5vdGljZShgTmF0aXZlIFNsaWRlczogY291bGQgbm90IHdyaXRlIGRlYnVnIGZpbGUgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gIH1cbiAgY29uc29sZS5sb2coXCJbbmF0aXZlLXNsaWRlcyBkZWJ1Zy1zdHlsZXNdXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIDIpKTtcbn1cblxuLyoqIFJlZ2lzdGVyIHRoZSBkZXYtb25seSBkZWJ1ZyBjb21tYW5kIChjYWxsZWQgb25seSB3aGVuIERFVl9NT0RFIGlzIHRydWUpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGVidWdDb21tYW5kKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1kZWJ1Zy1zdHlsZXNcIixcbiAgICBuYW1lOiBcIkRlYnVnOiBkdW1wIHR5cG9ncmFwaHkgc3R5bGVzXCIsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgZHVtcFR5cG9ncmFwaHkocGx1Z2luKSxcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBNb2RlIG9mIHRoZSBhY3RpdmUgTWFya2Rvd24gdmlldzogJ3ByZXZpZXcnPXJlYWRpbmcgJ3NvdXJjZSc9ZWRpdGluZyAnJz1ub25lICovXG5leHBvcnQgZnVuY3Rpb24gY3VycmVudE1vZGUoYXBwOiBBcHApOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgfCBcIlwiIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICByZXR1cm4gdmlldyA/ICh2aWV3LmdldE1vZGUoKSBhcyBcInByZXZpZXdcIiB8IFwic291cmNlXCIpIDogXCJcIjtcbn1cblxuLyoqXG4gKiBUcnVlIHdoZW4gdGhlIGFjdGl2ZSBlZGl0IHZpZXcgaXMgTGl2ZSBQcmV2aWV3IChTbGlkZXMpIFx1MjAxNCBhc1xuICogb3Bwb3NlZCB0byBTb3VyY2UgbW9kZS4gT2JzaWRpYW4gcmVwb3J0cyBib3RoIGFzIG1vZGUgXCJzb3VyY2VcIjtcbiAqIHRoZSB2aWV3IHN0YXRlIGNhcnJpZXMgYSBgc291cmNlYCBmbGFnIChTb3VyY2UgbW9kZSA9IHRydWUpLCB3aXRoXG4gKiBhIERPTSBjbGFzcyBmYWxsYmFjayAoLmlzLWxpdmUtcHJldmlldykgZm9yIHNhZmV0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTGl2ZVByZXZpZXcoYXBwOiBBcHApOiBib29sZWFuIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcgfHwgdmlldy5nZXRNb2RlKCkgIT09IFwic291cmNlXCIpIHJldHVybiBmYWxzZTtcbiAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBzb3VyY2U/OiBib29sZWFuIH07XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IHRydWUpIHJldHVybiBmYWxzZTtcbiAgaWYgKHN0YXRlLnNvdXJjZSA9PT0gZmFsc2UpIHJldHVybiB0cnVlO1xuICByZXR1cm4gISF2aWV3LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYuaXMtbGl2ZS1wcmV2aWV3XCIpO1xufVxuXG4vKiogRnJvbnRtYXR0ZXIgb2YgYW55IG5vdGUgYXMgYW4gb2JqZWN0LCBvciBudWxsIHdoZW4gYWJzZW50ICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbnRtYXR0ZXJPZihhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgcmV0dXJuIGNhY2hlPy5mcm9udG1hdHRlciA/PyBudWxsO1xufVxuXG4vKiogQ3VycmVudCBub3RlJ3MgZnJvbnRtYXR0ZXIgYXMgYW4gb2JqZWN0LCBvciBudWxsIHdoZW4gYWJzZW50ICovXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZlRnJvbnRtYXR0ZXIoYXBwOiBBcHApOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCBmaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIHJldHVybiBmaWxlID8gZnJvbnRtYXR0ZXJPZihhcHAsIGZpbGUpIDogbnVsbDtcbn1cbiIsICIvKiogQSBidWlsdC1pbiBTbGlkZXMgc3R5bGUgdGVtcGxhdGUgKHJlbmRlcmVkIGFzIGJvZHkgY2xhc3MgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmApICovXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlc1RoZW1lIHtcbiAgaWQ6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuLyoqIEJ1aWx0LWluIHN0eWxlIHRlbXBsYXRlcyBmb3IgdGhlIFNsaWRlcyBjYXJkICsgYmFyIChhbGwgdGhlbWUtYWRhcHRpdmUpICovXG5leHBvcnQgY29uc3QgU0xJREVTX1RIRU1FUzogcmVhZG9ubHkgU2xpZGVzVGhlbWVbXSA9IFtcbiAgeyBpZDogXCJqeXlcIiwgbGFiZWw6IFwiTGVjdHVyZSAoanl5KVwiIH0sXG4gIHsgaWQ6IFwiZGFzaGVkXCIsIGxhYmVsOiBcIkRhc2hlZCBvdXRsaW5lXCIgfSxcbiAgeyBpZDogXCJwYXBlclwiLCBsYWJlbDogXCJQYXBlciBjYXJkXCIgfSxcbiAgeyBpZDogXCJtaW5pbWFsXCIsIGxhYmVsOiBcIk1pbmltYWxcIiB9LFxuICB7IGlkOiBcImFjY2VudFwiLCBsYWJlbDogXCJBY2NlbnQgZWRnZVwiIH0sXG4gIHsgaWQ6IFwiZ2xhc3NcIiwgbGFiZWw6IFwiRnJvc3RlZCBnbGFzc1wiIH0sXG5dO1xuXG4vKiogUGx1Z2luIHNldHRpbmdzICovXG5leHBvcnQgaW50ZXJmYWNlIE5hdGl2ZVNsaWRlc1NldHRpbmdzIHtcbiAgLyoqIFNob3cgXHUyNUMwIFx1MjVCNiBwcmV2aW91cy9uZXh0IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd05hdkJ1dHRvbnM6IGJvb2xlYW47XG4gIC8qKiBQYWdlIG51bWJlciBkaXNwbGF5IHN0eWxlOiBcImZyYWN0aW9uXCIgPSBOIC8gVG90YWwsIFwiY3VycmVudFwiID0gTiwgXCJub25lXCIgPSBoaWRkZW4gKi9cbiAgcGFnZU51bWJlclN0eWxlOiBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAvKiogU2hvdyBhIHRoaW4gY2xpY2thYmxlIHByb2dyZXNzIGxpbmUgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAqL1xuICBzaG93UHJvZ3Jlc3M6IGJvb2xlYW47XG4gIC8qKiBTaG93IHRoZSBlbnRpcmUgc2xpZGVzIGJhciAobWFzdGVyIHRvZ2dsZSkgKi9cbiAgc2hvd1NsaWRlc0JhcjogYm9vbGVhbjtcbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgbWFudWFsbHkgaGlkIHRoZSBzbGlkZXMgYmFyICh0b2dnbGUgY29tbWFuZCkgKi9cbiAgYmFySGlkZGVuOiBib29sZWFuO1xuICAvKiogQXV0by1lbnRlciBTbGlkZXMgbW9kZSB3aGVuIG9wZW5pbmcgYSBkZWNrIG5vdGUgKGRlZmF1bHQgb2ZmKSAqL1xuICBhdXRvRW50ZXJTbGlkZXM6IGJvb2xlYW47XG4gIC8qKiBQcmVzcyBFc2NhcGUgdG8gZXhpdCBTbGlkZXMgbW9kZSAoZGVmYXVsdCBvbikgKi9cbiAgZXNjRXhpdHNTbGlkZXM6IGJvb2xlYW47XG4gIC8qKiBGcm9udG1hdHRlciBwcm9wZXJ0eSBzaG93biBhcyB0aGUgY2FyZCB0aXRsZSAoXCJcIiA9IG5vbmUsIFwiZmlsZW5hbWVcIiA9IGZpbGUgbmFtZSkgKi9cbiAgc2xpZGVzVGl0bGU6IHN0cmluZztcbiAgLyoqIFN0eWxlIHRlbXBsYXRlIGlkIGZyb20gU0xJREVTX1RIRU1FUyAoY2FyZCArIGJhciBhcHBlYXJhbmNlKSAqL1xuICBzbGlkZXNUaGVtZTogc3RyaW5nO1xuICAvKiogQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIGZvciB0aGUgc2xpZGVzIGJhciAoZW1wdHkgPSBub25lKSAqL1xuICBiYXJQcm9wZXJ0aWVzOiBzdHJpbmc7XG4gIC8qKiBKU09OIGFycmF5IG9mIGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgYmFyIHByb3BlcnRpZXMgKGRyYWdnYWJsZSBkaXZpZGVycykgKi9cbiAgYmFyUHJvcGVydHlXaWR0aHM6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0ge1xuICBzaG93TmF2QnV0dG9uczogdHJ1ZSxcbiAgcGFnZU51bWJlclN0eWxlOiBcIm5vbmVcIixcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBzaG93U2xpZGVzQmFyOiB0cnVlLFxuICBiYXJIaWRkZW46IGZhbHNlLFxuICBhdXRvRW50ZXJTbGlkZXM6IGZhbHNlLFxuICBlc2NFeGl0c1NsaWRlczogdHJ1ZSxcbiAgc2xpZGVzVGl0bGU6IFwiXCIsXG4gIHNsaWRlc1RoZW1lOiBcImp5eVwiLFxuICBiYXJQcm9wZXJ0aWVzOiBcIlwiLFxuICBiYXJQcm9wZXJ0eVdpZHRoczogXCJcIixcbn07XG5cbi8qKiBSZXNlcnZlZCBmcm9udG1hdHRlciBrZXkgZHJpdmluZyBkZWNrIG5hdmlnYXRpb24gKG5ldmVyIHJlbmRlcmVkIGFzIGEgY2hpcCkgKi9cbmV4cG9ydCBjb25zdCBERUNLX0tFWSA9IFwiZGVja1wiO1xuIiwgImltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQgfSBmcm9tIFwiLi9kZWJ1Z1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB7IERFQ0tfS0VZIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqIFJlZ2lzdGVyIGV2ZXJ5IGNvbW1hbmQ7IHRoZSBkZWJ1ZyBjb21tYW5kIGlzIGRldi1idWlsZCBvbmx5LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ29tbWFuZHMocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiB2b2lkIHtcbiAgLy8gVG9nZ2xlIHRoZSBzbGlkZXMgYmFyICh3aXRoaW4gU2xpZGVzIG1vZGUpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtYmFyXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIGJhclwiLFxuICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICBwbHVnaW4uc2V0dGluZ3MuYmFySGlkZGVuID0gIXBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW47XG4gICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICBwbHVnaW4ucmVmcmVzaCgpO1xuICAgIH0sXG4gIH0pO1xuICAvLyBTaG93IHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtc2hvdy1wYW5lbFwiLFxuICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgcGFuZWxcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uYWN0aXZhdGVTbGlkZXNQYW5lbCgpLFxuICB9KTtcbiAgLy8gSGlkZSAvIHNob3cgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgKHByZXNlbnRpbmc7IFNsaWRlcyBtb2RlIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtcG9pbnRlclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIG1vdXNlIHBvaW50ZXJcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVBvaW50ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBQcmV2aW91cyAvIG5leHQgcGFnZSAoZGVjayBuYXZpZ2F0aW9uOyBlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1wcmV2XCIsXG4gICAgbmFtZTogXCJQcmV2aW91cyBwYWdlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkFycm93TGVmdFwiIH1dLFxuICAgIGNhbGxiYWNrOiAoKSA9PiBwbHVnaW4ubmF2aWdhdGUoXCJwcmV2XCIpLFxuICB9KTtcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLW5leHRcIixcbiAgICBuYW1lOiBcIk5leHQgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd1JpZ2h0XCIgfV0sXG4gICAgY2FsbGJhY2s6ICgpID0+IHBsdWdpbi5uYXZpZ2F0ZShcIm5leHRcIiksXG4gIH0pO1xuICAvLyBDcmVhdGUgTmV4dCBTbGlkZSBcdTIwMTQgbmV3IHNsaWRlIGFmdGVyIHRoZSBjdXJyZW50IG9uZSAoZGVjayBub3RlcyBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5leHRcIixcbiAgICBuYW1lOiBcIkNyZWF0ZSBuZXh0IHNsaWRlXCIsXG4gICAgLy8gR3JleWVkIG91dCBpbiB0aGUgcGFsZXR0ZSB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGNhbiB0YWtlIGEgbmV4dCBzbGlkZVxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gVG9nZ2xlIFNsaWRlcyBtb2RlIFx1MjAxNCB0aGUgaW1tZXJzaXZlIGNhcmQgdmlldyAoZGVjayBub3RlcyBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLXNsaWRlc1wiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIHNsaWRlcyBtb2RlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkVcIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZihwbHVnaW4uYXBwLCBmaWxlKTtcbiAgICAgIGlmIChmbSA9PT0gbnVsbCB8fCAhKERFQ0tfS0VZIGluIGZtKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVNsaWRlcygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIERlYnVnIHRvb2xpbmcgXHUyMDE0IHJlZ2lzdGVyZWQgb25seSBpbiBkZXYgYnVpbGRzICh0cmVlLXNoYWtlbiBpbiByZWxlYXNlKVxuICBpZiAoREVWX01PREUpIHJlZ2lzdGVyRGVidWdDb21tYW5kKHBsdWdpbik7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBwbGFuQ3JlYXRlTmV4dCBhcyBwbGFuLCB0eXBlIENyZWF0ZU5leHRSZXN1bHQgfSBmcm9tIFwiLi9jcmVhdGVOZXh0XCI7XG5pbXBvcnQgeyBjb21wdXRlRGVjaywgZXh0cmFjdExpbmtzLCBleHRyYWN0UmF3TGlua3MsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKipcbiAgICogUmVzb2x2ZSB0aGUgY3VycmVudCBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrLiBBIG5vdGUgcXVhbGlmaWVzXG4gICAqIHdoZW4gaXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW4gZW1wdHkgXHUyMDE0IGEgZnJlc2ggc2luZ2xlIHNsaWRlKSBvclxuICAgKiB3aGVuIHNvbWUgb3RoZXIgc2xpZGUgZGVjbGFyZXMgaXQgYXMgaXRzIG5leHQgc2xpZGUuXG4gICAqL1xuICBjb21wdXRlKGZpbGU6IFRGaWxlKTogRGVja0luZm8gfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IG1lbWJlciA9IChmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbSkgfHwgdGhpcy5wcmV2T2YoZmlsZS5wYXRoKSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmICghbWVtYmVyKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gY29tcHV0ZURlY2soXG4gICAgICBmaWxlLnBhdGgsXG4gICAgICAocGF0aCkgPT4gdGhpcy5saW5rUGF0aHMocGF0aCksXG4gICAgICAocGF0aCkgPT4gdGhpcy5wcmV2T2YocGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgYSBub3RlIGludG8gcmVhbCBub3RlIHBhdGhzIChtYXggb25lKSAqL1xuICBwcml2YXRlIGxpbmtQYXRocyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gW107XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXNcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KTogeCBpcyBURmlsZSA9PiAhIXgpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh0aGUgcHJldmlvdXMgc2xpZGUgaW5cbiAgICogdGhlIGNoYWluKS4gV2l0aCBuZXh0LW9ubHkgc2VtYW50aWNzIHRoaXMgYmFja3dhcmQgbG9va3VwIGlzIHRoZSBvbmx5XG4gICAqIHdheSB0byByZWFjaCB0aGUgY2hhaW4gaGVhZCBmcm9tIGEgbWlkZGxlL2xhc3Qgc2xpZGUuXG4gICAqL1xuICBwcml2YXRlIHByZXZPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLnBhdGggPT09IHBhdGgpIGNvbnRpbnVlO1xuICAgICAgaWYgKHRoaXMubGlua1BhdGhzKGYucGF0aClbMF0gPT09IHBhdGgpIHJldHVybiBmLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogTmFtZXMgaW4gdGhlIGBkZWNrYCBwcm9wZXJ0eSB0aGF0IHJlc29sdmUgdG8gbm8gbm90ZSAoYnJva2VuIGxpbmtzKSAqL1xuICBicm9rZW4oZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBmaWxlLnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIHJ1biBmb3IgdGhlIGFjdGl2ZSBub3RlLiBEZWNrIHNsaWRlc1xuICAgKiBpbnNlcnQvYXBwZW5kIGFmdGVyIHRoZSBjdXJyZW50IG5vdGU7IGEgbm90ZSB3aXRob3V0IGEgYGRlY2tgIGxpbmtcbiAgICogc3RhcnRzIGEgYnJhbmQtbmV3IGRlY2sgKGl0IGJlY29tZXMgdGhlIGhlYWQgc2xpZGUpLlxuICAgKi9cbiAgcGxhbkNyZWF0ZU5leHQoZmlsZTogVEZpbGUpOiBDcmVhdGVOZXh0UmVzdWx0IHwgbnVsbCB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCByYXcgPSBmbSA/IGV4dHJhY3RSYXdMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuKHsgY3VycmVudE5hbWU6IGZpbGUuYmFzZW5hbWUsIGN1cnJlbnRMaW5rczogcmF3LCBleGlzdGluZ05hbWVzIH0pO1xuICB9XG5cbiAgLyoqIEFwcGx5IGEgcGxhbjogY3JlYXRlIHRoZSBub3RlLCByZXdpcmUgYGRlY2tgIHByb3BlcnRpZXMsIG9wZW4gaXQgKi9cbiAgYXN5bmMgZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZTogVEZpbGUsIHBsYW46IENyZWF0ZU5leHRSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBkaXIgPSBmaWxlLnBhcmVudD8ucGF0aCA/IGZpbGUucGFyZW50LnBhdGggKyBcIi9cIiA6IFwiXCI7XG4gICAgY29uc3QgbmV3UGF0aCA9IGAke2Rpcn0ke3BsYW4ubmV3TmFtZX0ubWRgO1xuICAgIGNvbnN0IGZyb250bWF0dGVyID0gcGxhbi5uZXdEZWNrTGlua3MubWFwKChsaW5rKSA9PiBKU09OLnN0cmluZ2lmeShsaW5rKSkuam9pbihcIiwgXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgLS0tXFxuZGVjazogWyR7ZnJvbnRtYXR0ZXJ9XVxcbi0tLVxcbmA7XG5cbiAgICBsZXQgbmV3RmlsZTogVEZpbGU7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUobmV3UGF0aCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBTbGlkZXM6IGNvdWxkIG5vdCBjcmVhdGUgXCIke3BsYW4ubmV3TmFtZX0ubWRcIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXdpcmUgdGhlIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCAoa2VlcHMgYWxsIG90aGVyIHByb3BlcnRpZXMgaW50YWN0KVxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiBwbGFuLnJld3JpdGVzKSB7XG4gICAgICBpZiAocmV3cml0ZS5uYW1lICE9PSBmaWxlLmJhc2VuYW1lKSBjb250aW51ZTsgLy8gaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGVcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm0pID0+IHtcbiAgICAgICAgZm1bREVDS19LRVldID0gcmV3cml0ZS5kZWNrO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT3BlbiB0aGUgbmV3IG5vdGUgaW4gdGhlIGN1cnJlbnQgcGFuZSwgZWRpdCBtb2RlIChMaXZlIFByZXZpZXcpXG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5ld0ZpbGUsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICB9XG59XG4iLCAiLyoqXG4gKiBkZWNrLnRzIFx1MjAxNCBQdXJlIGRlY2stcmVzb2x1dGlvbiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9kZWNrLnRlc3QudHMpLiBtYWluLnRzIGFkYXB0cyB0aGVcbiAqIHZhdWx0IChtZXRhZGF0YUNhY2hlKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlOiBpdCByZXNvbHZlcyBgZGVja2BcbiAqIHByb3BlcnRpZXMgdG8gbm90ZSBwYXRocywgdGhlbiBoYW5kcyB0aGUgcGF0aCBncmFwaCB0byBjb21wdXRlRGVjaygpLlxuICovXG5cbi8qKiBBIGRlY2sgbGluayBsaXN0IGhvbGRzIGF0IG1vc3Qgb25lIGVudHJ5ICh0aGUgbmV4dCBzbGlkZSkgKi9cbmV4cG9ydCBjb25zdCBNQVhfREVDS19MSU5LUyA9IDE7XG5cbi8qKiBSZXN1bHQgb2YgcmVzb2x2aW5nIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBhIGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja0luZm8ge1xuICAvKiogQ2hhaW4gb2Ygbm90ZSBwYXRoczogWzBdIGlzIHRoZSBmaXJzdCBzbGlkZSwgdGhlbiB0aGUgcmVzdCBpbiBvcmRlciAqL1xuICBjaGFpbjogc3RyaW5nW107XG4gIC8qKiBJbmRleCBvZiB0aGUgY3VycmVudCBub3RlIGluc2lkZSBjaGFpbiAqL1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6XG4gKiAgIC0gYSBzbGlkZSdzIGBkZWNrYCBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rOiB0aGUgbmV4dCBzbGlkZVxuICogICAgICh0aGUgbGFzdCBzbGlkZSBoYXMgbm8gbGluayBhdCBhbGwpO1xuICogICAtIGEgZGVjayBpcyBzaW1wbHkgYSBmb3J3YXJkIGxpbmsgY2hhaW4gc3RhcnRpbmcgYXQgaXRzIGhlYWQgc2xpZGU7XG4gKiAgIC0gYW55IG5vdGUgdGhhdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlbiBlbXB0eSkgaXMgYSBkZWNrIG1lbWJlcixcbiAqICAgICBzbyBhIHNpbmdsZSBmcmVzaGx5IGNyZWF0ZWQgc2xpZGUgYWxyZWFkeSBjb3VudHMgYXMgYSBvbmUtcGFnZSBkZWNrLlxuICpcbiAqIEJlY2F1c2Ugc2xpZGVzIG5vIGxvbmdlciBsaW5rIGJhY2sgdG8gYSBoZWFkIG5vdGUsIHRoZSBjaGFpbiBoZWFkIGlzXG4gKiBsb2NhdGVkIGJ5IHdhbGtpbmcgYmFja3dhcmQ6IGBnZXRQcmV2KHBhdGgpYCByZXR1cm5zIHRoZSBub3RlIHdob3NlXG4gKiBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodW5kZWZpbmVkIHdoZW4gbm9uZSkuXG4gKlxuICogYGdldExpbmtzKHBhdGgpYCBtdXN0IHJldHVybiB0aGUgcmVzb2x2ZWQgbm90ZSBwYXRocyBvZiB0aGUgYGRlY2tgXG4gKiBwcm9wZXJ0eSBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKGVtcHR5IHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUsIG9yIGl0c1xuICogbGluayBpcyBicm9rZW4gXHUyMDE0IGEgYnJva2VuIGxpbmsgc2ltcGx5IGVuZHMgdGhlIGNoYWluLCBuZXZlciBjcmFzaGVzKS5cbiAqXG4gKiBSZXR1cm5zIHRoZSBmdWxsIGNoYWluIGFuZCB0aGUgY3VycmVudCBub3RlJ3MgaW5kZXgsIG9yIG51bGwgd2hlbiB0aGVcbiAqIG5vdGUgaXMgbm90IHBhcnQgb2YgYW55IGRlY2sgKG5vIGBkZWNrYCBwcm9wZXJ0eSBhbmQgbm9ib2R5IGxpbmtzIHRvIGl0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVEZWNrKFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuICBnZXRMaW5rczogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW10sXG4gIGdldFByZXY6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIC8vIFdhbGsgYmFja3dhcmQgdG8gdGhlIGNoYWluIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLiBBIGxvbmUgbm9kZSAobm8gb3duXG4gIC8vIGxpbmssIG5vIHByZWRlY2Vzc29yKSByZXNvbHZlcyBhcyBhIG9uZS1wYWdlIGNoYWluIFx1MjAxNCB3aGV0aGVyIGl0IGNvdW50c1xuICAvLyBhcyBhIGRlY2sgbWVtYmVyIGF0IGFsbCBpcyBkZWNpZGVkIGJ5IHRoZSBhZGFwdGVyICh0aGUgYGRlY2tgIGtleSkuXG4gIGNvbnN0IGJhY2tWaXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KFtjdXJyZW50UGF0aF0pO1xuICBsZXQgaGVhZCA9IGN1cnJlbnRQYXRoO1xuICBmb3IgKDs7KSB7XG4gICAgY29uc3QgcHJldiA9IGdldFByZXYoaGVhZCk7XG4gICAgaWYgKCFwcmV2IHx8IGJhY2tWaXNpdGVkLmhhcyhwcmV2KSkgYnJlYWs7XG4gICAgYmFja1Zpc2l0ZWQuYWRkKHByZXYpO1xuICAgIGhlYWQgPSBwcmV2O1xuICB9XG5cbiAgLy8gV2FsayBmb3J3YXJkIGZyb20gdGhlIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgY3VyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBoZWFkO1xuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyKTtcbiAgICBjaGFpbi5wdXNoKGN1cik7XG4gICAgY3VyID0gZ2V0TGlua3MoY3VyKVswXTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIG5vdGUgbmFtZXMgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEFjY2VwdHMgYSBzaW5nbGUgc3RyaW5nIG9yIGEgWUFNTCBsaXN0IG9mIHN0cmluZ3M7IHVucXVvdGVkIFtbeF1dIHZhbHVlc1xuICogYXJlIHBhcnNlZCBieSBZQU1MIGFzIG5lc3RlZCBhcnJheXMgYW5kIGZsYXR0ZW5lZCBoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgY29uc3QgbmFtZSA9IGV4dHJhY3RMaW5rVGV4dChpdGVtKTtcbiAgICBpZiAobmFtZSkgb3V0LnB1c2gobmFtZSk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgcmF3IGxpbmsgc3RyaW5ncyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlIFx1MjAxNCB0aGVcbiAqIHRyaW1tZWQgdmFsdWVzIGV4YWN0bHkgYXMgd3JpdHRlbiAoYWxpYXMgLyBwYXRoIGZvcm1zIHByZXNlcnZlZCkuIFNhbWVcbiAqIGZsYXR0ZW5pbmcgcnVsZXMgYXMgZXh0cmFjdExpbmtzKCksIGJ1dCB3aXRob3V0IGV4dHJhY3RpbmcgdGhlIHRhcmdldCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFJhd0xpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSBcInN0cmluZ1wiKSBjb250aW51ZTtcbiAgICBjb25zdCB0cmltbWVkID0gaXRlbS50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh0cmltbWVkKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgdGFyZ2V0IG5vdGUgbmFtZSBmcm9tIGEgbWFya2Rvd24gbGluayBzdHJpbmcuXG4gKiBIYW5kbGVzIHNldmVyYWwgc2hhcGVzOlxuICogICBcIltbc2xpZGUtMl1dXCIgICAgICAgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yfGFsaWFzXV1cIiAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTIjc2VjdGlvbl1dXCJcdTIxOTIgc2xpZGUtMlxuICogICBzbGlkZS0yICAgICAgICAgICAgICBcdTIxOTIgc2xpZGUtMiAoYmFyZSBmaWxlbmFtZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rVGV4dCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHRyaW1tZWQucmVwbGFjZSgvXlxcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0uc3BsaXQoXCIjXCIpWzBdLnRyaW0oKTtcbn1cblxuLyoqIFJlbmRlciBhIHByb3BlcnR5IHZhbHVlIGFzIHJlYWRhYmxlIHRleHQ6IGFycmF5cy9vYmplY3RzIFx1MjE5MiBKU09OLCBlbHNlIFN0cmluZyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBcIlx1MjAxNFwiO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG59XG4iLCAiLyoqXG4gKiBjcmVhdGVOZXh0LnRzIFx1MjAxNCBQdXJlIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9jcmVhdGVOZXh0LnRlc3QudHMpLiBtYWluLnRzIGFkYXB0c1xuICogdGhlIHZhdWx0IChtZXRhZGF0YUNhY2hlLCBjb21wdXRlRGVjaykgdG8gdGhpcyBwdXJlIGludGVyZmFjZSBhbmQgYXBwbGllc1xuICogdGhlIHJlc3VsdGluZyBwbGFuIHdpdGggdmF1bHQuY3JlYXRlKCkgKyBmaWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoKS5cbiAqXG4gKiB2MS4wLjAgY29udmVudGlvbiBcdTIwMTQgbmV4dC1vbmx5LCBubyBvdmVydmlldyBwYWdlOiBhIHNsaWRlJ3MgYGRlY2tgXG4gKiBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rIChpdHMgbmV4dCBzbGlkZSkuIFRoZSBwbGFuIGRlY2lkZXMsIGZvclxuICogdGhlIGN1cnJlbnQgbm90ZTpcbiAqICAgLSB0aGUgbmFtZSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKGNvbGxpc2lvbi1hd2FyZSksXG4gKiAgIC0gdGhlIHJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgbmV3IG5vdGUsXG4gKiAgIC0gdGhlIHJld3JpdGVzIG5lZWRlZCBvbiBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSBpdHNlbGYpLlxuICovXG5cbmltcG9ydCB7IGV4dHJhY3RMaW5rVGV4dCB9IGZyb20gXCIuL2RlY2tcIjtcblxuLyoqIElucHV0cyBmb3IgcGxhbm5pbmcgXHUyMDE0IHJlc29sdmVkIGJ5IHRoZSBhZGFwdGVyIGluIG1haW4udHMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dElucHV0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIGN1cnJlbnQgbm90ZSAqL1xuICBjdXJyZW50TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBjdXJyZW50IG5vdGUgKGV4dHJhY3RlZCwgYXQgbW9zdCBvbmUpICovXG4gIGN1cnJlbnRMaW5rczogc3RyaW5nW107XG4gIC8qKiBCYXNlbmFtZXMgb2YgZXZlcnkgbWFya2Rvd24gbm90ZSBpbiB0aGUgdmF1bHQgKGNvbGxpc2lvbi1mcmVlIG5hbWluZykgKi9cbiAgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz47XG59XG5cbi8qKiBPbmUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja1Jld3JpdGUge1xuICAvKiogQmFzZW5hbWUgb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IHJhdyBgZGVja2AgbGluayB0ZXh0cyAoc2VyaWFsaXplZCBhcyBhIFlBTUwgbGlzdCkgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKiBUaGUgZnVsbCBwbGFuIGZvciBjcmVhdGluZyBvbmUgbmV3IHNsaWRlICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRSZXN1bHQge1xuICAvKiogQmFzZW5hbWUgKHdpdGhvdXQgZXh0ZW5zaW9uKSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKi9cbiAgbmV3TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIGZvciB0aGUgbmV3IG5vdGUncyBmcm9udG1hdHRlciAqL1xuICBuZXdEZWNrTGlua3M6IHN0cmluZ1tdO1xuICAvKiogUmV3cml0ZXMgdG8gYXBwbHkgdG8gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlKSAqL1xuICByZXdyaXRlczogRGVja1Jld3JpdGVbXTtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBub3RlLlxuICpcbiAqIEJlaGF2aW9yczpcbiAqICAgLSBObyBuZXh0IGxpbmsgKGxhc3Qgc2xpZGUsIGZyZXNoIGRlY2sgaGVhZCwgb3IgYSBwbGFpbiBub3RlIHN0YXJ0aW5nXG4gKiAgICAgYSBicmFuZC1uZXcgZGVjayk6IGFwcGVuZCBgPGN1cnJlbnQ+LW5leHRgIGFzIHRoZSBuZXcgbGFzdCBzbGlkZTsgdGhlXG4gKiAgICAgY3VycmVudCBub3RlJ3MgYGRlY2tgIGdhaW5zIHRoZSBsaW5rIHRvIGl0LlxuICogICAtIFZhbGlkIG5leHQgbGluazogaW5zZXJ0IGA8Y3VycmVudD4tbmV4dGAgYmV0d2VlbiB0aGUgY3VycmVudCBub3RlIGFuZFxuICogICAgIGl0cyBuZXh0OyB0aGUgbmV3IG5vdGUgdGFrZXMgb3ZlciB0aGUgb2xkIG5leHQgbGluay5cbiAqICAgLSBCcm9rZW4gbmV4dCBsaW5rIChwbGFpbiwgbm9uLWV4aXN0aW5nIG5hbWUpOiBjcmVhdGUgZXhhY3RseSB0aGVcbiAqICAgICBkZWNsYXJlZCBtaXNzaW5nIG5vdGUgYXMgdGhlIG5ldyBuZXh0IHNsaWRlIFx1MjAxNCB0aGUgXHUyNkEwIHdhcm5pbmdcbiAqICAgICBkaXNhcHBlYXJzIGFuZCB0aGUgYXV0aG9yJ3MgaW50ZW50IGlzIGhvbm91cmVkLiBBIGJyb2tlbiBsaW5rIHRoYXQgaXNcbiAqICAgICBub3QgYSBwbGFpbiBiYXNlbmFtZSAocGF0aC1xdWFsaWZpZWQsIHNlbGYtcmVmZXJlbmNpbmcpIGlzIHRyZWF0ZWQgYXNcbiAqICAgICBpbnZhbGlkIGFuZCBkcm9wcGVkIChhcHBlbmQgYSBgPGN1cnJlbnQ+LW5leHRgIGxhc3Qgc2xpZGUgaW5zdGVhZCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuQ3JlYXRlTmV4dChpbnB1dDogQ3JlYXRlTmV4dElucHV0KTogQ3JlYXRlTmV4dFJlc3VsdCB8IG51bGwge1xuICBjb25zdCB7IGN1cnJlbnROYW1lLCBjdXJyZW50TGlua3MgfSA9IGlucHV0O1xuICBjb25zdCBuZXh0TGluayA9IGN1cnJlbnRMaW5rc1swXTtcblxuICBpZiAobmV4dExpbmspIHtcbiAgICBjb25zdCBuZXh0TmFtZSA9IGV4dHJhY3RMaW5rVGV4dChuZXh0TGluayk7XG4gICAgaWYgKG5leHROYW1lICYmIGlzUGxhaW5OYW1lKG5leHROYW1lKSAmJiBuZXh0TmFtZSAhPT0gY3VycmVudE5hbWUpIHtcbiAgICAgIGlmICghaW5wdXQuZXhpc3RpbmdOYW1lcy5oYXMobmV4dE5hbWUpKSB7XG4gICAgICAgIC8vIFRoZSBkZWNsYXJlZCBuZXh0IG5vdGUgZG9lcyBub3QgZXhpc3QgeWV0IFx1MjE5MiBjcmVhdGUgZXhhY3RseSB0aGF0XG4gICAgICAgIC8vIG5vdGUgKGZpeGVzIHRoZSBicm9rZW4tbGluayB3YXJuaW5nLCBob25vdXJzIHRoZSBhdXRob3IncyBpbnRlbnQpLlxuICAgICAgICByZXR1cm4geyBuZXdOYW1lOiBuZXh0TmFtZSwgbmV3RGVja0xpbmtzOiBbXSwgcmV3cml0ZXM6IFtdIH07XG4gICAgICB9XG4gICAgICAvLyBBIHZhbGlkIG5leHQgbm90ZSBleGlzdHMgXHUyMTkyIGluc2VydCBiZXR3ZWVuIGl0IGFuZCB0aGUgY3VycmVudCBub3RlLlxuICAgICAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ld05hbWUsXG4gICAgICAgIG5ld0RlY2tMaW5rczogW25leHRMaW5rXSxcbiAgICAgICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBJbnZhbGlkIChwYXRoLXF1YWxpZmllZCAvIHNlbGYtcmVmZXJlbmNpbmcpIG5leHQgbGluayBcdTIxOTIgZHJvcCBpdCBhbmRcbiAgICAvLyBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSAoZmFsbCB0aHJvdWdoIHRvIHRoZSBuby1uZXh0IGJyYW5jaCkuXG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTm8gKHVzYWJsZSkgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgcmV0dXJuIHtcbiAgICBuZXdOYW1lLFxuICAgIG5ld0RlY2tMaW5rczogW10sXG4gICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gIH07XG59XG5cbi8qKiBBIG5hbWUgdXNhYmxlIGFzIGEgdmF1bHQgbm90ZSBuYW1lOiBubyBwYXRoIHNlcGFyYXRvcnMsIG5vbi1lbXB0eSAqL1xuZnVuY3Rpb24gaXNQbGFpbk5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBuYW1lLmxlbmd0aCA+IDAgJiYgIW5hbWUuaW5jbHVkZXMoXCIvXCIpICYmICFuYW1lLmluY2x1ZGVzKFwiXFxcXFwiKTtcbn1cblxuLyoqIEZpcnN0IGZyZWUgbmFtZSBpbiB0aGUgZmFtaWx5IGBiYXNlYCwgYGJhc2UtMmAsIGBiYXNlLTNgLCBcdTIwMjYgKi9cbmZ1bmN0aW9uIHVuaXF1ZU5hbWUoYmFzZTogc3RyaW5nLCBleGlzdGluZzogU2V0PHN0cmluZz4pOiBzdHJpbmcge1xuICBpZiAoIWV4aXN0aW5nLmhhcyhiYXNlKSkgcmV0dXJuIGJhc2U7XG4gIGZvciAobGV0IGkgPSAyOyA7IGkrKykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2Jhc2V9LSR7aX1gO1xuICAgIGlmICghZXhpc3RpbmcuaGFzKGNhbmRpZGF0ZSkpIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgVEZpbGUsIFdvcmtzcGFjZUxlYWYgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuXG4vKiogVmlldyB0eXBlIGlkIG9mIHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19QQU5FTF9WSUVXID0gXCJuYXRpdmUtc2xpZGVzLXBhbmVsXCI7XG5cbi8qKlxuICogU2lkZWJhciBwYW5lbCBsaXN0aW5nIGV2ZXJ5IHNsaWRlIG9mIHRoZSBhY3RpdmUgbm90ZSdzIGRlY2sgKG5leHQtb25seVxuICogY2hhaW4gb3JkZXIpLiBUYWtlcyBvdmVyIHRoZSBhZ2dyZWdhdGlvbi9lbnRyeSByb2xlIHRoZSBvdmVydmlldyBwYWdlXG4gKiB1c2VkIHRvIHBsYXkgYmVmb3JlIHYxLjAuMC4gQ2xpY2tpbmcgYW4gZW50cnkgb3BlbnMgdGhhdCBzbGlkZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNsaWRlc1BhbmVsVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbixcbiAgICBsZWFmOiBXb3Jrc3BhY2VMZWFmLFxuICApIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFNMSURFU19QQU5FTF9WSUVXO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJTbGlkZXNcIjtcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJwcmVzZW50YXRpb25cIjtcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuICB9XG5cbiAgLyoqIFJlYnVpbGQgdGhlIHNsaWRlIGxpc3QgZm9yIHRoZSBhY3RpdmUgbm90ZSdzIGRlY2sgKi9cbiAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGFpbmVyRWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgZGVjayA9IGZpbGUgPyB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpIDogbnVsbDtcblxuICAgIGlmICghZGVjaykge1xuICAgICAgY29uc3QgZW1wdHkgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWVtcHR5XCIgfSk7XG4gICAgICBlbXB0eS5zZXRUZXh0KFxuICAgICAgICBcIk5vIHNsaWRlcyBkZWNrIFx1MjAxNCBvcGVuIGEgZGVjayBub3RlLCBvciBydW4gQ3JlYXRlIG5leHQgc2xpZGUgb24gYW55IG5vdGUgdG8gc3RhcnQgb25lLlwiLFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWNrLmNoYWluLmZvckVhY2goKHBhdGgsIGkpID0+IHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm47XG4gICAgICBjb25zdCBpdGVtID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1pdGVtXCIgfSk7XG4gICAgICBpZiAocGF0aCA9PT0gZmlsZT8ucGF0aCkgaXRlbS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgICAgIGNvbnN0IG51bSA9IGl0ZW0uY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLW51bVwiIH0pO1xuICAgICAgbnVtLnNldFRleHQoU3RyaW5nKGkgKyAxKSk7XG4gICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC10aXRsZVwiIH0pLnNldFRleHQoZi5iYXNlbmFtZSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpLm9wZW5GaWxlKGYpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IFNMSURFU19USEVNRVMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKiogU2V0dGluZ3MgdGFiOiB0b2dnbGVzIHRoZSBuYXYgYnV0dG9ucywgcGFnZSBudW1iZXIsIGF1dG8tZW50ZXIgYW5kIGJhciB2aXNpYmlsaXR5LiAqL1xuZXhwb3J0IGNsYXNzIE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJOYXRpdmUgU2xpZGVzIFx1MDBCNyBTZXR0aW5nc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlN0eWxlIHRlbXBsYXRlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgU2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBTTElERVNfVEhFTUVTKSBkcm9wZG93bi5hZGRPcHRpb24odC5pZCwgdC5sYWJlbCk7XG4gICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHNsaWRlcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0Jhcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0JhciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgUHJldmlvdXMvTmV4dCBidXR0b25zXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQYWdlIG51bWJlciBzdHlsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIk4gLyBUb3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJOXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwiTm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbnMoe1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPSB2YWx1ZSBhcyBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJvZ3Jlc3MgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkF1dG8tZW50ZXIgU2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFc2NhcGUgZXhpdHMgU2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFwiUHJlc3MgRXNjYXBlIHRvIGxlYXZlIFNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2xpZGVzIHRpdGxlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcImUuZy4gdGl0bGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJCYXIgcHJvcGVydGllc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJlLmcuIHVuaXZlcnNpdHksIGRhdGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTmF2aWdhdGlvbiBob3RrZXlzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEZWZhdWx0OiBQcmV2aW91cyBQYWdlIE1vZCtTaGlmdCtcdTIxOTAsIE5leHQgUGFnZSBNb2QrU2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgU2V0dGluZ3MgXHUyMTkyIEhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+XG4gICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiT3BlbiBIb3RrZXlzIFNldHRpbmdzXCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgfVxufVxuIiwgIi8qKiBSZW1vdmUgYWxsIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNoaWxkcmVuKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQkEsSUFBQUEsbUJBQTRDOzs7QUN6QnJDLFNBQVMsWUFBeUI7QUFDdkMsUUFBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLE1BQUksWUFBWTtBQUNoQixNQUFJLE1BQU0sVUFBVTtBQUNwQixNQUFJLFFBQVE7QUFJWixNQUFJLGlCQUFpQixhQUFhLENBQUMsTUFBTTtBQUN2QyxNQUFFLGVBQWU7QUFDakIsVUFBTSxTQUFTLFNBQVM7QUFDeEIsUUFBSSxrQkFBa0IsZUFBZSxXQUFXLFNBQVMsS0FBTSxRQUFPLEtBQUs7QUFBQSxFQUM3RSxDQUFDO0FBQ0QsU0FBTztBQUNUO0FBR08sU0FBUyxVQUNkLE9BQ0EsS0FDQSxTQUNBLFdBQVcsT0FDUTtBQUNuQixRQUFNLE1BQU0sU0FBUyxjQUFjLFFBQVE7QUFDM0MsTUFBSSxZQUFZO0FBQ2hCLE1BQUksY0FBYztBQUNsQixNQUFJLFFBQVE7QUFDWixNQUFJLFdBQVc7QUFDZixNQUFJLENBQUMsU0FBVSxLQUFJLGlCQUFpQixTQUFTLE9BQU87QUFDcEQsU0FBTztBQUNUO0FBUU8sU0FBUyxpQkFBaUIsUUFBd0I7QUFDdkQsUUFBTSxTQUFTLFNBQVM7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7QUFDQSxNQUFJLFVB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LEtBQUssTUFBTSxRQUFRLEtBQUs7QUFDMUMsY0FBTSxNQUFNLFNBQVMsY0FBYyxLQUFLO0FBQ3hDLGNBQU0sUUFBUSxJQUFJLEtBQUssUUFBUSxTQUFTLE1BQU0sS0FBSyxRQUFRLFlBQVk7QUFDdkUsWUFBSSxZQUFZLDBEQUEwRCxLQUFLO0FBQy9FLFlBQUksaUJBQWlCLFNBQVMsTUFBTSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDdkQsaUJBQVMsWUFBWSxHQUFHO0FBQUEsTUFDMUI7QUFDQSxXQUFLLElBQUksWUFBWSxRQUFRO0FBQUEsSUFDL0I7QUFJQSxTQUFLLElBQUksTUFBTSxVQUFVLEtBQUssSUFBSSxzQkFBc0IsSUFBSSxTQUFTO0FBQUEsRUFDdkU7QUFDRjsiLAogICJuYW1lcyI6IFsiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAibmV3TmFtZSIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIl0KfQo=
