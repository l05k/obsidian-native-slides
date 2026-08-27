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
var import_obsidian7 = require("obsidian");

// src/bar.ts
function createBar() {
  const bar = createDiv({ cls: "native-slides-bar" });
  bar.setCssStyles({ display: "none" });
  bar.title = "Click to park the mouse \u2014 hides the editor caret while presenting";
  bar.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) active.blur();
  });
  return bar;
}
function navButton(label, tip, onClick, disabled = false) {
  const btn = createEl("button", {
    cls: "native-slides-nav-btn",
    text: label,
    attr: { title: tip }
  });
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
    document.documentElement.setCssProps({ "--native-slides-tabbar-height": `${cached}px` });
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
  return new Promise((resolve) => window.setTimeout(resolve, ms));
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
    new import_obsidian2.Notice("Native slides: enter Slides mode first (Mod+Shift+E on a deck note)");
    return;
  }
  const view = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
  if (!view) {
    new import_obsidian2.Notice("Native slides: no active Markdown note");
    return;
  }
  const startMode = view.getMode();
  const activeFile = app.workspace.getActiveFile();
  const leaf = app.workspace.getLeaf(false);
  const edit = {};
  for (const name of SAMPLE_NOTE_NAMES) {
    const f = app.vault.getAbstractFileByPath(`tests/${name}.md`);
    if (!(f instanceof import_obsidian2.TFile)) continue;
    await leaf.openFile(f, { state: { mode: "source" } });
    await sleep(500);
    const s = sampleStyles(app);
    if (s) mergeSample(edit, s);
  }
  let reading = null;
  const demo = app.vault.getAbstractFileByPath("tests/typography-demo.md");
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
    new import_obsidian2.Notice("Native slides: reading sample failed");
    return;
  }
  const payload = { edit, reading, diff: diffDumps(edit, reading) };
  try {
    await app.vault.adapter.write(".native-slides-debug.json", JSON.stringify(payload, null, 2));
    new import_obsidian2.Notice("Typography dump \u2192 .native-slides-debug.json (vault root)");
  } catch (error) {
    new import_obsidian2.Notice(`Native slides: could not write debug file (${String(error)})`);
  }
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
  barPropertyWidths: "",
  confirmDeleteSlides: true
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
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "N" }],
    // Greyed out unless the active note is part of a deck — plain notes
    // start decks with "Create new slide" instead.
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || !plugin.deckService.isMember(file)) return false;
      const plan = plugin.deckService.planCreateNext(file);
      if (!plan) return false;
      if (!checking) void plugin.deckService.executeCreateNext(file, plan);
      return true;
    }
  });
  plugin.addCommand({
    id: "ns-create-new",
    name: "Create new slide",
    // No default hotkey: Mod+Shift+N belongs to Create next slide — two
    // commands sharing one default hotkey trips Obsidian's conflict UI.
    callback: () => void plugin.deckService.executeCreateNew(plugin.deckService.planCreateNew())
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
  switch (typeof value) {
    case "string":
      return value;
    case "object":
      try {
        return JSON.stringify(value) ?? "\u2014";
      } catch {
        return "\u2014";
      }
    case "number":
    case "boolean":
    case "bigint":
      return String(value);
    default:
      return typeof value;
  }
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
function planCreateNew(input) {
  return {
    newName: uniqueName("untitled-slides", input.existingNames),
    newDeckLinks: [],
    rewrites: []
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

// src/deleteSlides.ts
function planDeleteSlides(chain, deletePaths) {
  const rewrites = [];
  for (let i = 0; i < chain.length; i++) {
    const path = chain[i];
    if (!path || deletePaths.has(path)) continue;
    let j = i + 1;
    while (j < chain.length && deletePaths.has(chain[j])) j++;
    const nextPath = j < chain.length ? chain[j] : null;
    const changed = nextPath !== (chain[i + 1] ?? null);
    if (changed) rewrites.push({ path, nextPath });
  }
  return rewrites;
}
function pickLandingPath(chain, deletePaths, focusPath) {
  if (!focusPath || !deletePaths.has(focusPath)) return null;
  const index = chain.indexOf(focusPath);
  if (index === -1) return null;
  for (let i = index + 1; i < chain.length; i++) {
    if (!deletePaths.has(chain[i])) return chain[i];
  }
  for (let i = index - 1; i >= 0; i--) {
    if (!deletePaths.has(chain[i])) return chain[i];
  }
  return null;
}

// src/deck-service.ts
var DeckService = class {
  constructor(app) {
    this.app = app;
  }
  /**
   * Whether the note belongs to a deck: it holds a `deck` property (even
   * empty — a fresh single slide) or some other slide declares it as its
   * next slide.
   */
  isMember(file) {
    const fm = frontmatterOf(this.app, file);
    return fm !== null && DECK_KEY in fm || this.prevOf(file.path) !== void 0;
  }
  /** Resolve the current note's position inside its deck (null when not a member) */
  compute(file) {
    if (!this.isMember(file)) return null;
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
   * insert/append after the current note. (Plain notes are routed to
   * planCreateNew by the command — this core still handles them as
   * "no usable next link → append".)
   */
  planCreateNext(file) {
    const fm = frontmatterOf(this.app, file);
    const raw = fm ? extractRawLinks(fm[DECK_KEY]) : [];
    const existingNames = new Set(this.app.vault.getMarkdownFiles().map((f) => f.basename));
    return planCreateNext({ currentName: file.basename, currentLinks: raw, existingNames });
  }
  /**
   * Plan a "Create New Slide" run: a brand-new deck's first page in the
   * same folder as the active note, which itself stays untouched.
   */
  planCreateNew() {
    const existingNames = new Set(this.app.vault.getMarkdownFiles().map((f) => f.basename));
    return planCreateNew({ existingNames });
  }
  /** Apply a Create Next Slide plan; open=false keeps the current note in the editor */
  async executeCreateNext(file, plan, open = true) {
    await this.applyPlan(file, plan, dirPrefix(file.parent?.path), open);
  }
  /**
   * Apply a Create New Slide plan. Lands in Obsidian's default new-note
   * location (Settings → Files & links → Default location for new notes);
   * with "same folder as current" configured that is the active note's own
   * folder. Works with no note open at all (blank tab).
   */
  async executeCreateNew(plan) {
    const sourcePath = this.app.workspace.getActiveFile()?.path ?? "";
    await this.applyPlan(
      null,
      plan,
      dirPrefix(this.app.fileManager.getNewFileParent(sourcePath)?.path)
    );
  }
  /** Apply a plan: create the note, rewire `deck` properties, optionally open it */
  async applyPlan(file, plan, dir, open = true) {
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
      new import_obsidian3.Notice(`Native slides: could not create "${plan.newName}.md" (${String(error)})`);
      return;
    }
    for (const rewrite of plan.rewrites) {
      if (!file || rewrite.name !== file.basename) continue;
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        fm[DECK_KEY] = rewrite.deck;
      });
    }
    if (!open) return;
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(newFile, { state: { mode: "source" } });
  }
  /**
   * Delete slides out of an ordered deck chain: splice the chain around
   * every deleted run (the predecessor's `deck` takes over the run's first
   * survivor), then move each deleted note to the trash. `focusPath` is the
   * note the editor currently shows — when it is among the deleted, the
   * result names the nearest surviving neighbour to open instead.
   */
  async executeDeleteSlides(chain, deletePaths, focusPath) {
    const rewrites = planDeleteSlides(chain, deletePaths);
    for (const rewrite of rewrites) {
      const f = this.app.vault.getAbstractFileByPath(rewrite.path);
      if (!(f instanceof import_obsidian3.TFile)) continue;
      const next = rewrite.nextPath ? this.app.vault.getAbstractFileByPath(rewrite.nextPath) : null;
      await this.app.fileManager.processFrontMatter(f, (fm) => {
        fm[DECK_KEY] = next instanceof import_obsidian3.TFile ? [`[[${next.basename}]]`] : [];
      });
    }
    const trashed = [];
    for (const path of deletePaths) {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof import_obsidian3.TFile)) continue;
      try {
        await this.app.fileManager.trashFile(f);
        trashed.push(path);
      } catch (error) {
        new import_obsidian3.Notice(`Native slides: could not delete "${f.basename}" (${String(error)})`);
      }
    }
    return { trashed, landingPath: pickLandingPath(chain, deletePaths, focusPath) };
  }
};
function dirPrefix(path) {
  if (!path || path === "/") return "";
  return `${path.replace(/\/+$/, "")}/`;
}

// src/panel.ts
var import_obsidian5 = require("obsidian");

// src/confirm-delete.ts
var import_obsidian4 = require("obsidian");
var MAX_VISIBLE_NAMES = 8;
var ConfirmDeleteModal = class extends import_obsidian4.Modal {
  constructor(app, names, onConfirm, onDontAsk) {
    super(app);
    this.names = names;
    this.onConfirm = onConfirm;
    this.onDontAsk = onDontAsk;
    this.confirmed = false;
  }
  onOpen() {
    this.contentEl.empty();
    this.modalEl.addClass("native-slides-confirm-delete");
    const count = this.names.length;
    this.contentEl.createEl("h3", {
      cls: "native-slides-confirm-delete-title",
      text: count === 1 ? "Delete this slide?" : `Delete ${count} slides?`
    });
    this.contentEl.createDiv({ cls: "native-slides-confirm-delete-sub" }).setText(
      count === 1 ? "The note will be moved to the trash." : "These notes will be moved to the trash."
    );
    const list = this.contentEl.createDiv({ cls: "native-slides-confirm-delete-list" });
    for (const [i, name] of this.names.slice(0, MAX_VISIBLE_NAMES).entries()) {
      const row = list.createDiv({ cls: "native-slides-confirm-delete-row" });
      row.createSpan({ cls: "native-slides-confirm-delete-num" }).setText(String(i + 1));
      row.createSpan({ cls: "native-slides-confirm-delete-name" }).setText(name);
    }
    if (this.names.length > MAX_VISIBLE_NAMES) {
      list.createDiv({ cls: "native-slides-confirm-delete-more" }).setText(`\u2026 and ${this.names.length - MAX_VISIBLE_NAMES} more`);
    }
    this.buildDontAskRow();
    this.buildActions();
  }
  /** Compact left-aligned "don't ask again" checkbox row */
  buildDontAskRow() {
    const row = this.contentEl.createDiv({ cls: "native-slides-confirm-delete-dontask" });
    row.createEl("label").setText("Don't ask again");
    const checkbox = row.createEl("input", { type: "checkbox" });
    checkbox.addEventListener("change", () => {
      void this.onDontAsk().then(
        () => {
          checkbox.disabled = true;
        },
        () => {
        }
      );
    });
  }
  /** Right-aligned Cancel / Delete button row */
  buildActions() {
    const actions = this.contentEl.createDiv({ cls: "native-slides-confirm-delete-actions" });
    actions.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    actions.createEl("button", { text: "Delete", cls: "mod-warning" }).addEventListener("click", () => {
      this.confirmed = true;
      this.close();
    });
  }
  onClose() {
    if (this.confirmed) this.onConfirm();
  }
};

// src/panel.ts
var SLIDES_PANEL_VIEW = "native-slides-panel";
var SlidesPanelView = class extends import_obsidian5.ItemView {
  constructor(plugin, leaf) {
    super(leaf);
    this.plugin = plugin;
    /** Chain signature of the currently rendered list */
    this.lastChain = [];
    /** Rendered item elements, index-aligned with lastChain */
    this.items = [];
    /** Currently selected slide paths (multi-select for Delete) */
    this.selected = /* @__PURE__ */ new Set();
    /** Selection anchor for Shift+click range extension */
    this.anchor = null;
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
    this.lastChain = [];
    this.items = [];
    this.selected.clear();
    this.anchor = null;
  }
  /**
   * Sync the list with the active note's deck. Incremental on purpose: the
   * refresh events also fire while a click on an entry is in flight (the
   * mousedown activates this leaf), and rebuilding the DOM mid-gesture
   * destroys the click target — which made opening a slide take two clicks
   * whenever the panel was not the active leaf. Unchanged chains only get
   * their highlight updated, so item elements always survive.
   */
  render() {
    const file = this.app.workspace.getActiveFile();
    const deck = file ? this.plugin.deckService.compute(file) : null;
    const chain = deck ? deck.chain.filter((p) => this.app.vault.getAbstractFileByPath(p) instanceof import_obsidian5.TFile) : [];
    if (this.selected.size > 0) {
      const live = new Set(chain);
      for (const path of this.selected) if (!live.has(path)) this.selected.delete(path);
    }
    if (this.anchor !== null && !chain.includes(this.anchor)) this.anchor = null;
    if (!chainEquals(this.lastChain, chain)) {
      this.rebuild(chain);
    } else {
      for (const it of this.items) it.el.classList.toggle("is-active", it.path === file?.path);
    }
    this.syncSelectionClasses();
  }
  /** Full rebuild (chain shape changed) */
  rebuild(chain) {
    const root = this.containerEl;
    root.empty();
    this.items = [];
    this.lastChain = chain;
    if (chain.length === 0) {
      const empty = root.createDiv({ cls: "native-slides-panel-empty" });
      empty.setText(
        "No slides deck \u2014 open a deck note, or run create next slide on any note to start one."
      );
      return;
    }
    const activePath = this.app.workspace.getActiveFile()?.path;
    chain.forEach((path, i) => {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof import_obsidian5.TFile)) return;
      const item = root.createDiv({ cls: "native-slides-panel-item" });
      if (path === activePath) item.addClass("is-active");
      item.createSpan({ cls: "native-slides-panel-num" }).setText(String(i + 1));
      item.createSpan({ cls: "native-slides-panel-title" }).setText(f.basename);
      item.addEventListener("click", (e) => this.onItemClick(e, i, f));
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.openContextMenu(e, f);
      });
      this.items.push({ path, el: item });
    });
  }
  /** Click routing: plain = open, Mod = toggle select, Shift = range select */
  onItemClick(e, index, f) {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (e.shiftKey) {
        const activePath = this.app.workspace.getActiveFile()?.path ?? null;
        const anchorPath = this.anchor !== null && this.items.some((it) => it.path === this.anchor) ? this.anchor : activePath;
        const from = this.items.findIndex((it) => it.path === anchorPath);
        if (anchorPath !== null && from !== -1) {
          const [lo, hi] = from < index ? [from, index] : [index, from];
          for (let i = lo; i <= hi; i++) this.selected.add(this.items[i].path);
          if (activePath !== null && this.items.some((it) => it.path === activePath)) {
            this.selected.add(activePath);
          }
          this.anchor = this.items[index].path;
          this.syncSelectionClasses();
          return;
        }
      }
      if (this.selected.has(f.path)) this.selected.delete(f.path);
      else this.selected.add(f.path);
      this.anchor = f.path;
      this.syncSelectionClasses();
      return;
    }
    this.selected.clear();
    this.anchor = f.path;
    this.syncSelectionClasses();
    void this.openSlide(f);
  }
  /** Reflect the selection set on the rendered items without a rebuild */
  syncSelectionClasses() {
    for (const it of this.items) it.el.classList.toggle("is-selected", this.selected.has(it.path));
  }
  /** Right-click menu on one item; operates on the whole selection when it belongs to one */
  openContextMenu(e, f) {
    const menu = new import_obsidian5.Menu();
    menu.addItem(
      (mi) => mi.setTitle("Create next slide").setIcon("plus").onClick(() => void this.createNextAfter(f))
    );
    const targets = this.selected.has(f.path) ? [...this.selected] : [f.path];
    const ordered = this.lastChain.filter((p) => targets.includes(p));
    menu.addItem(
      (mi) => mi.setTitle(ordered.length > 1 ? `Delete ${ordered.length} slides` : "Delete slide").setIcon("trash").onClick(() => this.deleteSlides(ordered))
    );
    menu.showAtMouseEvent(e);
  }
  /** Create a slide after the right-clicked one (without opening it) */
  async createNextAfter(f) {
    const plan = this.plugin.deckService.planCreateNext(f);
    if (!plan) return;
    await this.plugin.deckService.executeCreateNext(f, plan, false);
    this.render();
  }
  /** Confirm, then trash the given slides and splice them out of the chain */
  deleteSlides(paths) {
    if (paths.length === 0) return;
    const run = () => void this.runDeletion(paths);
    if (!this.plugin.settings.confirmDeleteSlides) {
      run();
      return;
    }
    const names = paths.map((p) => {
      const f = this.app.vault.getAbstractFileByPath(p);
      return f instanceof import_obsidian5.TFile ? f.basename : p;
    });
    new ConfirmDeleteModal(this.app, names, run, async () => {
      this.plugin.settings.confirmDeleteSlides = false;
      await this.plugin.saveSettings();
    }).open();
  }
  async runDeletion(paths) {
    const activePath = this.app.workspace.getActiveFile()?.path ?? null;
    const result = await this.plugin.deckService.executeDeleteSlides(
      this.lastChain,
      new Set(paths),
      activePath
    );
    for (const path of paths) this.selected.delete(path);
    if (this.anchor !== null && paths.includes(this.anchor)) this.anchor = null;
    if (result.landingPath) {
      const f = this.app.vault.getAbstractFileByPath(result.landingPath);
      if (f instanceof import_obsidian5.TFile) await this.openSlide(f);
      return;
    }
    this.render();
  }
  /** Open a slide in a markdown leaf (never in this panel's own leaf) */
  async openSlide(f) {
    const leaf = this.app.workspace.getLeavesOfType("markdown")[0] ?? this.app.workspace.getLeaf(true);
    await leaf.openFile(f);
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
  }
};
function chainEquals(a, b) {
  return a.length === b.length && a.every((p, i) => p === b[i]);
}

// src/settings.ts
var import_obsidian6 = require("obsidian");
var NativeSlidesSettingTab = class extends import_obsidian6.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  /** Declarative settings (Obsidian ≥ 1.13.0) — searchable by the settings modal. */
  getSettingDefinitions() {
    return [
      {
        name: "Style template",
        desc: "Built-in look for the slides card and slides bar (border, background, shadow, bar styling). Every template adapts to light and dark themes.",
        control: {
          key: "slidesTheme",
          type: "dropdown",
          options: Object.fromEntries(SLIDES_THEMES.map((t) => [t.id, t.label]))
        }
      },
      {
        name: "Show slides bar",
        desc: "Master toggle for the entire slides bar at the bottom of the window",
        control: { key: "showSlidesBar", type: "toggle" }
      },
      {
        name: "Show previous/next buttons",
        desc: "Show \u25C0 \u25B6 buttons on the left of the slides bar when the note belongs to a deck (has a `deck` property)",
        control: { key: "showNavButtons", type: "toggle" }
      },
      {
        name: "Page number style",
        desc: 'Shown at the bottom-right. "n / total": 1-based over the whole deck chain (head slide = 1). "n": just the current page number. "none": hidden.',
        control: {
          key: "pageNumberStyle",
          type: "dropdown",
          options: {
            fraction: "N / Total",
            current: "N",
            none: "None"
          }
        }
      },
      {
        name: "Show progress bar",
        desc: "Discrete clickable segments at the top of the slides bar -- one per slide, click to jump",
        control: { key: "showProgress", type: "toggle" }
      },
      {
        name: "Auto-enter slides mode",
        desc: "Open deck notes directly in Slides mode. Leave off to enter manually with the Toggle Slides Mode command (Mod+Shift+E) or the previous/next page hotkeys.",
        control: { key: "autoEnterSlides", type: "toggle" }
      },
      {
        name: "Escape exits slides mode",
        desc: "Press escape to leave slides mode and return to the previous view",
        control: { key: "escExitsSlides", type: "toggle" }
      },
      {
        name: "Slides title",
        desc: "Frontmatter property to show as the card title (H1). Leave empty for none; type `filename` to use the file name \u2014 that title is editable (renames the note); property-backed titles are read-only (edit the property outside slides mode).",
        control: { key: "slidesTitle", type: "text", placeholder: "E.g. Title" }
      },
      {
        name: "Bar properties",
        desc: "Comma-separated frontmatter property names to show in the slides bar (e.g. `university, short-title, date`). Each value fills an equal-width column; drag dividers to resize. Leave empty to show nothing.",
        control: { key: "barProperties", type: "text", placeholder: "E.g. University, date" }
      },
      {
        name: "Confirm slide deletion",
        desc: "Ask for confirmation before deleting slides from the slides panel's right-click menu. Deletion moves slides to the trash.",
        control: { key: "confirmDeleteSlides", type: "toggle" }
      },
      {
        name: "Navigation hotkeys",
        desc: "Default: Previous page mod+shift+\u2190, next page mod+shift+\u2192. Rebind under settings \u2192 hotkeys.",
        action: () => {
          this.app.setting?.openTabById?.("hotkeys");
        }
      }
    ];
  }
  /** Persist control changes, then refresh the bar so the new setting applies. */
  setControlValue(key, value) {
    void this.applyControlValue(key, value);
  }
  async applyControlValue(key, value) {
    this.plugin.settings[key] = value;
    await this.plugin.saveSettings();
    this.plugin.refresh();
  }
  /** Imperative fallback for Obsidian < 1.13.0 (not called with definitions present). */
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian6.Setting(containerEl).setName("Style template").setDesc(
      "Built-in look for the slides card and slides bar (border, background, shadow, bar styling). Every template adapts to light and dark themes."
    ).addDropdown((dropdown) => {
      for (const t of SLIDES_THEMES) dropdown.addOption(t.id, t.label);
      dropdown.setValue(this.plugin.settings.slidesTheme).onChange(async (value) => {
        this.plugin.settings.slidesTheme = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      });
    });
    new import_obsidian6.Setting(containerEl).setName("Show slides bar").setDesc("Master toggle for the entire slides bar at the bottom of the window").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showSlidesBar).onChange(async (value) => {
        this.plugin.settings.showSlidesBar = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Show previous/next buttons").setDesc(
      "Show \u25C0 \u25B6 buttons on the left of the slides bar when the note belongs to a deck (has a `deck` property)"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showNavButtons).onChange(async (value) => {
        this.plugin.settings.showNavButtons = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Page number style").setDesc(
      'Shown at the bottom-right. "n / total": 1-based over the whole deck chain (head slide = 1). "n": just the current page number. "none": hidden.'
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
    new import_obsidian6.Setting(containerEl).setName("Show progress bar").setDesc(
      "Discrete clickable segments at the top of the slides bar -- one per slide, click to jump"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showProgress).onChange(async (value) => {
        this.plugin.settings.showProgress = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Auto-enter slides mode").setDesc(
      "Open deck notes directly in Slides mode. Leave off to enter manually with the Toggle Slides Mode command (Mod+Shift+E) or the previous/next page hotkeys."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoEnterSlides).onChange(async (value) => {
        this.plugin.settings.autoEnterSlides = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Escape exits slides mode").setDesc("Press escape to leave slides mode and return to the previous view").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.escExitsSlides).onChange(async (value) => {
        this.plugin.settings.escExitsSlides = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Slides title").setDesc(
      "Frontmatter property to show as the card title (H1). Leave empty for none; type `filename` to use the file name."
    ).addText(
      (text) => text.setPlaceholder("E.g. Title").setValue(this.plugin.settings.slidesTitle).onChange(async (value) => {
        this.plugin.settings.slidesTitle = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Bar properties").setDesc(
      "Comma-separated frontmatter property names to show in the slides bar (e.g. `university, short-title, date`). Each value fills an equal-width column; drag dividers to resize. Leave empty to show nothing."
    ).addText(
      (text) => text.setPlaceholder("E.g. University, date").setValue(this.plugin.settings.barProperties).onChange(async (value) => {
        this.plugin.settings.barProperties = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Confirm slide deletion").setDesc(
      "Ask for confirmation before deleting slides from the slides panel's right-click menu. Deletion moves slides to the trash."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.confirmDeleteSlides).onChange(async (value) => {
        this.plugin.settings.confirmDeleteSlides = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian6.Setting(containerEl).setName("Navigation hotkeys").setDesc(
      "Default: Previous page mod+shift+\u2190, next page mod+shift+\u2192. Rebind under settings \u2192 hotkeys."
    ).addButton(
      (button) => button.setButtonText("Open hotkeys settings").onClick(() => {
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
var NativeSlidesPlugin = class extends import_obsidian7.Plugin {
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
    /** Animation-frame counter re-certifying solo-image tags while editing */
    this.soloImageFrame = null;
    /** Deadline until which the rAF certification window stays open (ms) */
    this.soloRetagUntil = 0;
    /** Current active editor container (listener host for solo certification) */
    this.soloImageHost = null;
    /** View-level capture listener (pointerdown/image loads) renewing the window */
    this.soloViewHandler = null;
    /** Document-level selectionchange listener renewing the window */
    this.soloDocHandler = null;
    /** Self-heal budget for the expiry pass (window re-arms ≤ this many times) */
    this.soloRearms = 0;
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
    this.registerEvent(
      this.app.workspace.on("editor-change", () => {
        if (!this.slidesMode) return;
        this.tagCurrentContent();
        this.scheduleSoloCertify();
      })
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
        const view = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView);
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
    if (this.soloImageFrame !== null) window.cancelAnimationFrame(this.soloImageFrame);
    this.soloImageFrame = null;
    this.bar?.remove();
    this.bar = null;
    document.body.classList.remove("native-slides-mode");
    document.body.classList.remove("native-slides-pointer-hidden");
    this.removeThemeClasses();
  }
  // ── Settings ──────────────────────────────────────────────────────────
  async loadSettings() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
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
   * Render the card title per the `slidesTitle` setting. "filename" restyles
   * the native inline title into the card title (still editable — typing
   * renames the note); "" shows nothing; any other value names a frontmatter
   * property rendered read-only via the ::before pseudo-element.
   */
  updateInlineTitle(slides) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView);
    const file = this.app.workspace.getActiveFile();
    const content = view?.contentEl.querySelector(".cm-content");
    if (!content || !file) return;
    const src = this.settings.slidesTitle.trim();
    const nativeTitle = slides && src === "filename";
    const sourceView = view?.contentEl.querySelector(".markdown-source-view");
    if (nativeTitle && sourceView) sourceView.setAttribute("data-ns-inline-title", "filename");
    else sourceView?.removeAttribute("data-ns-inline-title");
    content.toggleAttribute("data-slides-title-native", nativeTitle);
    let text = null;
    if (slides && src && src !== "filename") {
      const fm = frontmatterOf(this.app, file);
      const v = fm?.[src];
      if (v != null) text = formatValue(v);
    }
    if (text) content.setAttribute("data-slides-title", text);
    else content.removeAttribute("data-slides-title");
  }
  /** Tag every image-only line with the solo class; true if any line changed. */
  tagSoloImageLines(content) {
    let changed = false;
    for (const line of content.querySelectorAll(":scope > .cm-line")) {
      const want = isSoloImageLine(line);
      if (line.classList.contains("native-slides-solo-image") !== want) {
        changed = true;
        line.classList.toggle("native-slides-solo-image", want);
      }
    }
    return changed;
  }
  /**
   * Keep the solo-image tags fresh while Slides mode is active. CodeMirror
   * re-creates line elements inside its render pipeline, so tags must be
   * re-certified at a moment that lands before the browser paints rebuilt
   * lines. rAF callbacks run after the frame's tasks and before layout/
   * paint, so a line built in the task phase is re-tagged in the same
   * frame — an uncentered solo image can never be painted with the window
   * open.
   *
   * No permanent 60fps loop: certifications are event-driven and bounded.
   * A window is opened/renewed by every content edit (`editor-change`),
   * by caret/selection moves and clicks (selectionchange/pointerdown —
   * clicking the image line flips its preview between raw markdown and the
   * embed, re-rendering the line), and by image loads; entry into Slides
   * mode opens a long window covering the editor rebuild that follows the
   * mode switch. If the window expires and the expiry pass still had to
   * change tags (the DOM was still settling), it re-arms a fresh window,
   * up to `soloRearms` budget. The rAF chain stops the moment the window
   * is closed, so idle = no scheduled work.
   */
  syncSoloImageObserver(active) {
    if (active) {
      const view = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView);
      const host = view?.contentEl ?? null;
      if (host && this.soloViewHandler === null) {
        this.soloImageHost = host;
        this.soloViewHandler = () => {
          if (this.slidesMode) this.scheduleSoloCertify();
        };
        host.addEventListener("pointerdown", this.soloViewHandler, true);
        host.addEventListener("load", this.soloViewHandler, true);
        this.soloDocHandler = () => {
          if (this.slidesMode) this.scheduleSoloCertify();
        };
        document.addEventListener("selectionchange", this.soloDocHandler);
      }
      this.soloRearms = 0;
      this.scheduleSoloCertify(2500);
      return;
    }
    if (this.soloViewHandler && this.soloImageHost) {
      this.soloImageHost.removeEventListener("pointerdown", this.soloViewHandler, true);
      this.soloImageHost.removeEventListener("load", this.soloViewHandler, true);
    }
    this.soloViewHandler = null;
    this.soloImageHost = null;
    if (this.soloDocHandler) document.removeEventListener("selectionchange", this.soloDocHandler);
    this.soloDocHandler = null;
    if (this.soloImageFrame !== null) {
      window.cancelAnimationFrame(this.soloImageFrame);
      this.soloImageFrame = null;
    }
  }
  /** Open (or renew) the rAF certification window for `ms` milliseconds. */
  scheduleSoloCertify(ms = 500) {
    this.soloRetagUntil = window.performance.now() + ms;
    if (this.soloImageFrame !== null) return;
    const tick = () => {
      this.soloImageFrame = null;
      if (window.performance.now() >= this.soloRetagUntil) {
        if (this.soloRearms < 4 && this.tagCurrentContent()) {
          this.soloRearms++;
          this.scheduleSoloCertify();
        }
        return;
      }
      this.tagCurrentContent();
      this.soloImageFrame = window.requestAnimationFrame(tick);
    };
    this.soloImageFrame = window.requestAnimationFrame(tick);
  }
  /** Tag the solo-image lines of the active editor, wherever it is now. */
  tagCurrentContent() {
    const content = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView)?.contentEl.querySelector(".cm-content");
    return content ? this.tagSoloImageLines(content) : false;
  }
  /** Enter Slides mode: record the exit state and force the Live Preview */
  async enterSlides() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView);
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
      await this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: SLIDES_PANEL_VIEW, active: true });
    await this.app.workspace.revealLeaf(leaf);
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
      if (isNumberList(stored, count)) return stored;
    } catch {
    }
    return new Array(count).fill(100 / count);
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
    this.syncSoloImageObserver(slides);
    const barVisible = slides && this.settings.showSlidesBar && !this.settings.barHidden;
    if (barVisible) {
      document.documentElement.style.removeProperty("--native-slides-bar-height");
    } else {
      document.documentElement.setCssProps({ "--native-slides-bar-height": "0px" });
    }
    if (!barVisible) {
      this.bar.setCssStyles({ display: "none" });
      return;
    }
    if (!file) return;
    const fm = activeFrontmatter(this.app);
    const deck = this.deckService.compute(file);
    clearChildren(this.bar);
    if (this.settings.showNavButtons && deck) {
      const hasPrev = deck.index > 0;
      const hasNext = deck.index < deck.chain.length - 1;
      const nav = createDiv({ cls: "native-slides-nav" });
      nav.appendChild(navButton("\u25C0", "Previous page", () => void this.navigate("prev"), !hasPrev));
      nav.appendChild(navButton("\u25B6", "Next page", () => void this.navigate("next"), !hasNext));
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
        const container = createDiv({ cls: "native-slides-bar-properties" });
        const widths = this.getBarPropertyWidths(entries.length);
        for (let i = 0; i < entries.length; i++) {
          const [, value] = entries[i];
          const item = createSpan({ cls: "native-slides-bar-prop-item", text: value });
          item.setCssStyles({
            flexBasis: `calc(${widths[i]}% - ${(entries.length - 1) * 4 / entries.length}px)`
          });
          container.appendChild(item);
          if (i < entries.length - 1) {
            const divider = createDiv({ cls: "native-slides-bar-divider" });
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
                items[i].setCssStyles({
                  flexBasis: `calc(${newLeft}% - ${(entries.length - 1) * 4 / entries.length}px)`
                });
                items[i + 1].setCssStyles({
                  flexBasis: `calc(${newRight}% - ${(entries.length - 1) * 4 / entries.length}px)`
                });
              };
              const onUp = () => {
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
                document.body.setCssStyles({ cursor: "", userSelect: "" });
                void this.saveBarPropertyWidths(widths);
              };
              document.addEventListener("mousemove", onMove);
              document.addEventListener("mouseup", onUp);
              document.body.setCssStyles({ cursor: "col-resize", userSelect: "none" });
            });
            container.appendChild(divider);
          }
        }
        this.bar.appendChild(container);
      }
    }
    const broken = file ? this.deckService.broken(file) : [];
    if (broken.length > 0) {
      const warn = createSpan({
        cls: "native-slides-warn",
        text: "\u26A0 " + broken.join(", "),
        attr: { title: "Broken deck link(s) \u2014 the target note does not exist" }
      });
      this.bar.appendChild(warn);
    }
    if (this.settings.pageNumberStyle !== "none" && deck) {
      const total = deck.chain.length;
      const page = createSpan({
        cls: "native-slides-page",
        text: this.settings.pageNumberStyle === "fraction" ? `${deck.index + 1} / ${total}` : `${deck.index + 1}`
      });
      this.bar.appendChild(page);
    }
    if (this.settings.showProgress && deck && deck.chain.length > 1) {
      const progress = createDiv({ cls: "native-slides-progress" });
      for (let i = 0; i < deck.chain.length; i++) {
        const state = i < deck.index ? "past" : i === deck.index ? "current" : "future";
        const seg = createDiv({
          cls: `native-slides-progress-seg native-slides-progress-seg--${state}`
        });
        seg.addEventListener("click", () => void this.jumpTo(i));
        progress.appendChild(seg);
      }
      this.bar.appendChild(progress);
    }
    this.bar.setCssStyles({ display: this.bar.childElementCount === 0 ? "none" : "" });
  }
};
function isNumberList(value, count) {
  return Array.isArray(value) && value.length === count && value.every((n) => typeof n === "number");
}
function isSoloImageLine(line) {
  let sawImage = false;
  let sawText = false;
  for (const node of Array.from(line.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent && node.textContent.trim()) sawText = true;
      continue;
    }
    if (!node.instanceOf(HTMLElement)) continue;
    if (node.classList.contains("cm-widgetBuffer") || node.classList.contains("cm-fold-indicator")) {
      continue;
    }
    if (node.tagName === "IMG") {
      sawImage = true;
      continue;
    }
    if (node.classList.contains("cm-formatting")) {
      if (node.textContent && node.textContent.trim()) sawText = true;
      continue;
    }
    if (node.querySelector("img")) sawImage = true;
    else if (node.textContent && node.textContent.trim()) sawText = true;
  }
  return sawImage && !sawText;
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9kZWJ1Zy50cyIsICJzcmMvbW9kZS50cyIsICJzcmMvdHlwZXMudHMiLCAic3JjL2NvbW1hbmRzLnRzIiwgInNyYy9kZWNrLXNlcnZpY2UudHMiLCAic3JjL2RlY2sudHMiLCAic3JjL2NyZWF0ZU5leHQudHMiLCAic3JjL2RlbGV0ZVNsaWRlcy50cyIsICJzcmMvcGFuZWwudHMiLCAic3JjL2NvbmZpcm0tZGVsZXRlLnRzIiwgInNyYy9zZXR0aW5ncy50cyIsICJzcmMvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogbmF0aXZlLXNsaWRlcyBcdTIwMTQgYSBcIlNsaWRlcyBtb2RlXCIgZm9yIE9ic2lkaWFuIGRlY2sgbm90ZXNcbiAqXG4gKiBPbmUgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5LCBgZGVja2AgKGEgc2luZ2xlIG1hcmtkb3duIGxpbmsgdG8gdGhlIG5leHRcbiAqIHNsaWRlIFx1MjAxNCBuZXh0LW9ubHkgc2VtYW50aWNzLCBubyBvdmVydmlldyBwYWdlIHNpbmNlIHYxLjAuMCksIGRyaXZlc1xuICogcHJldi9uZXh0IG5hdmlnYXRpb24gYW5kIGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXJzLiBBIGRlY2sgbm90ZSBjYW4gYmVcbiAqIGVudGVyZWQgaW50byAqKlNsaWRlcyBtb2RlKiogXHUyMDE0IGFuIGltbWVyc2l2ZSwgZWRpdGFibGUgKExpdmUgUHJldmlldykgdmlld1xuICogd2l0aCBhIHNsaWRlcyBiYXIgc2hvd2luZyBwcm9wZXJ0aWVzLCBuYXZpZ2F0aW9uIGFuZCB0aGUgcGFnZSBudW1iZXIuXG4gKlxuICogTmF0aXZlIE9ic2lkaWFuIG1vZGVzIChTb3VyY2UgLyBkZWZhdWx0IExpdmUgUHJldmlldyAvIFJlYWRpbmcgdmlldykgYXJlXG4gKiBsZWZ0IGNvbXBsZXRlbHkgdW50b3VjaGVkOiBubyBzdGF0dXMtYmFyIGhpZGluZywgbm8gc2xpZGVzIGJhciwgbm9cbiAqIGZ1bGxzY3JlZW4sIG5vIHN0eWxpbmcuIFNsaWRlcyBtb2RlIGlzIHRoZSBwbHVnaW4ncyBvbmx5IHN1cmZhY2UuXG4gKlxuICogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBhbmQgYSB0aGluIG9yY2hlc3RyYXRpb24gbGF5ZXI7IHRoZSBsb2dpY1xuICogbGl2ZXMgaW4gYHNyYy9gOlxuICogICAtIHNyYy90eXBlcy50cyAgICAgICAgc2V0dGluZ3Mgc2hhcGUgKyBkZWZhdWx0cyArIHJlc2VydmVkIGBkZWNrYCBrZXlcbiAqICAgLSBzcmMvbW9kZS50cyAgICAgICAgIHZpZXcgbW9kZSAvIGZyb250bWF0dGVyIGhlbHBlcnMgKHB1cmUsIGBBcHBgLWJhc2VkKVxuICogICAtIHNyYy9kZWNrLXNlcnZpY2UudHMgZGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWVcbiAqICAgLSBzcmMvYmFyLnRzICAgICAgICAgIGJhciBET00gaGVscGVycyAoY3JlYXRlIC8gYnV0dG9ucyAvIHRhYi1iYXIgbWVhc3VyZSlcbiAqICAgLSBzcmMvcGFuZWwudHMgICAgICAgIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gKiAgIC0gc3JjL2NvbW1hbmRzLnRzICAgICBjb21tYW5kIHJlZ2lzdHJhdGlvbiAoZGV2LWdhdGVkIGRlYnVnIGNvbW1hbmQpXG4gKiAgIC0gc3JjL3NldHRpbmdzLnRzICAgICBzZXR0aW5ncyB0YWJcbiAqICAgLSBzcmMvZGVidWcudHMgICAgICAgIHR5cG9ncmFwaHkgbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KVxuICogICAtIHNyYy9kZWNrLnRzICAgICAgICAgcHVyZSBkZWNrIGNvcmUgKHdpdGggc3JjL2NyZWF0ZU5leHQudHMpXG4gKi9cblxuaW1wb3J0IHsgTWFya2Rvd25WaWV3LCBQbHVnaW4sIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjcmVhdGVCYXIsIG5hdkJ1dHRvbiwgc3luY1RhYkJhckhlaWdodCB9IGZyb20gXCIuL3NyYy9iYXJcIjtcbmltcG9ydCB7IHJlZ2lzdGVyQ29tbWFuZHMgfSBmcm9tIFwiLi9zcmMvY29tbWFuZHNcIjtcbmltcG9ydCB7IERlY2tTZXJ2aWNlIH0gZnJvbSBcIi4vc3JjL2RlY2stc2VydmljZVwiO1xuaW1wb3J0IHsgZm9ybWF0VmFsdWUgfSBmcm9tIFwiLi9zcmMvZGVja1wiO1xuaW1wb3J0IHsgYWN0aXZlRnJvbnRtYXR0ZXIsIGN1cnJlbnRNb2RlLCBmcm9udG1hdHRlck9mLCBpc0xpdmVQcmV2aWV3IH0gZnJvbSBcIi4vc3JjL21vZGVcIjtcbmltcG9ydCB7IFNsaWRlc1BhbmVsVmlldywgU0xJREVTX1BBTkVMX1ZJRVcgfSBmcm9tIFwiLi9zcmMvcGFuZWxcIjtcbmltcG9ydCB7IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgfSBmcm9tIFwiLi9zcmMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IERFQ0tfS0VZLCBERUZBVUxUX1NFVFRJTkdTLCBTTElERVNfVEhFTUVTLCB0eXBlIE5hdGl2ZVNsaWRlc1NldHRpbmdzIH0gZnJvbSBcIi4vc3JjL3R5cGVzXCI7XG5pbXBvcnQgeyBjbGVhckNoaWxkcmVuIH0gZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdGl2ZVNsaWRlc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIC8qKiBUaGUgc2xpZGVzIGJhciBET00gZWxlbWVudCAqL1xuICBiYXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8qKiBEZWNrIGNoYWluIHJlc29sdXRpb24gKyBcImNyZWF0ZSBuZXh0IHNsaWRlXCIgZ2x1ZSAqL1xuICBkZWNrU2VydmljZSE6IERlY2tTZXJ2aWNlO1xuICAvKiogUGx1Z2luIHNldHRpbmdzICovXG4gIHNldHRpbmdzOiBOYXRpdmVTbGlkZXNTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuXG4gIC8qKiBXaGV0aGVyIFNsaWRlcyBtb2RlIGlzIGN1cnJlbnRseSBhY3RpdmUgKHNlc3Npb24gc3RhdGUsIG5vdCBwZXJzaXN0ZWQpICovXG4gIHByaXZhdGUgc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAvKiogVmlldyBtb2RlIHRvIHJlc3RvcmUgd2hlbiBsZWF2aW5nIFNsaWRlcyBtb2RlIChcInByZXZpZXdcIiB8IFwic291cmNlXCIpICovXG4gIHByaXZhdGUgZXhpdE1vZGU6IFwicHJldmlld1wiIHwgXCJzb3VyY2VcIiA9IFwic291cmNlXCI7XG4gIC8qKiBXaGV0aGVyIHRoZSBleGl0IHZpZXcgd2FzIFNvdXJjZSBtb2RlICh0cnVlKSB2cyBMaXZlIFByZXZpZXcgKGZhbHNlKSAqL1xuICBwcml2YXRlIGV4aXRTb3VyY2UgPSBmYWxzZTtcbiAgLyoqIExhc3Qgbm90ZSBhdXRvLWVudGVyZWQgaW50byBTbGlkZXMgbW9kZSAocHJldmVudHMgcmUtZW50ZXJpbmcgYWZ0ZXIgbWFudWFsIGV4aXQpICovXG4gIHByaXZhdGUgYXV0b0VudGVyZWRQYXRoID0gXCJcIjtcbiAgLyoqIExhc3QgcmVmcmVzaCBrZXkgKFwicGF0aHxtb2RlXCIpIHRvIGF2b2lkIHBvaW50bGVzcyByZS1yZW5kZXJzICovXG4gIHByaXZhdGUgbGFzdEtleSA9IFwiXCI7XG4gIC8qKiBMYXN0IG1lYXN1cmVkIHRhYi1iYXIgaGVpZ2h0IChweCkgXHUyMDE0IGNhY2hlZCB3aGlsZSB0aGUgc2xpZGVzIGJhciBpcyBoaWRkZW4gKi9cbiAgcHJpdmF0ZSB0YWJCYXJIZWlnaHQgPSAwO1xuICAvKiogV2hldGhlciB0aGUgbW91c2UgcG9pbnRlciBpcyBoaWRkZW4gZm9yIHByZXNlbnRpbmcgKHNlc3Npb24gc3RhdGUpICovXG4gIHBvaW50ZXJIaWRkZW4gPSBmYWxzZTtcbiAgLyoqIEFuaW1hdGlvbi1mcmFtZSBjb3VudGVyIHJlLWNlcnRpZnlpbmcgc29sby1pbWFnZSB0YWdzIHdoaWxlIGVkaXRpbmcgKi9cbiAgcHJpdmF0ZSBzb2xvSW1hZ2VGcmFtZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIC8qKiBEZWFkbGluZSB1bnRpbCB3aGljaCB0aGUgckFGIGNlcnRpZmljYXRpb24gd2luZG93IHN0YXlzIG9wZW4gKG1zKSAqL1xuICBwcml2YXRlIHNvbG9SZXRhZ1VudGlsID0gMDtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmRlY2tTZXJ2aWNlID0gbmV3IERlY2tTZXJ2aWNlKHRoaXMuYXBwKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIodGhpcykpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDEuIFJlZnJlc2ggb24gXCJjdXJyZW50IG5vdGUgLyB2aWV3IGNoYW5nZWRcIiBldmVudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5tYXliZUF1dG9FbnRlclNsaWRlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG4gICAgLy8gUmVmcmVzaCB3aGVuIHRoZSBub3RlIGNvbnRlbnQgKGluY2x1ZGluZyBmcm9udG1hdHRlcikgY2hhbmdlcyAvIHNhdmVzXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMi4gRmFsbGJhY2sgdGltZXI6IGVkaXRcdTIxOTRyZWFkaW5nIHRvZ2dsZXMgbWF5IGZpcmUgbm8gc3RhbmRhcmQgZXZlbnQgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKFxuICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGZpbGUgPyBgJHtmaWxlLnBhdGh9fCR7Y3VycmVudE1vZGUodGhpcy5hcHApfWAgOiBcIlwiO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCksXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAyYi4gU29sby1pbWFnZSBjZXJ0aWZpY2F0aW9uIHdpbmRvd3M6IGVhY2ggZWRpdG9yLWNoYW5nZSBldmVudFxuICAgIC8vIHJlLWNlcnRpZmllcyBpbW1lZGlhdGVseSAodGhlIGRvYyB1cGRhdGUgaXMgYWxyZWFkeSBpbiB0aGUgRE9NIHdoZW5cbiAgICAvLyB0aGUgZXZlbnQgZmlyZXMpIGFuZCBvcGVucyBhIH41MDBtcyB3aW5kb3cgb2YgcGVyLWZyYW1lIHJlLWNlcnRpZmljYXRpb25cbiAgICAvLyBjb3ZlcmluZyBDb2RlTWlycm9yJ3MgZGVmZXJyZWQgcmUtcmVuZGVycy4gVGhlIHJBRiBjaGFpbiBjbG9zZXMgYXMgc29vblxuICAgIC8vIGFzIHRoZSBlZGl0b3IgaXMgaWRsZSwgc28gbm8gYmFja2dyb3VuZCB3b3JrIHJ1bnMgYmV0d2VlbiBlZGl0cy4gXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZWRpdG9yLWNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5zbGlkZXNNb2RlKSByZXR1cm47XG4gICAgICAgIHRoaXMudGFnQ3VycmVudENvbnRlbnQoKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZVNvbG9DZXJ0aWZ5KCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDMuIENvbW1hbmRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHJlZ2lzdGVyQ29tbWFuZHModGhpcyk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgM2IuIFNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIG92ZXJ2aWV3LCByZXBsYWNlcyB0aGUgb2xkIG92ZXJ2aWV3IHBhZ2UpIFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFNMSURFU19QQU5FTF9WSUVXLCAobGVhZikgPT4gbmV3IFNsaWRlc1BhbmVsVmlldyh0aGlzLCBsZWFmKSk7XG4gICAgdGhpcy5hZGRSaWJib25JY29uKFwicHJlc2VudGF0aW9uXCIsIFwiU2hvdyBzbGlkZXMgcGFuZWxcIiwgKCkgPT4ge1xuICAgICAgdm9pZCB0aGlzLmFjdGl2YXRlU2xpZGVzUGFuZWwoKTtcbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA0LiBQaW4gdGhlIFNsaWRlcyBlZGl0b3IgdG8gb25lIHNjcmVlbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvLyBDU1MgYG92ZXJmbG93OiBoaWRkZW5gIGJsb2NrcyB0aGUgd2hlZWwsIGJ1dCBuYXRpdmUgZHJhZy1zZWxlY3RcbiAgICAvLyBhdXRvc2Nyb2xsIGFuZCBDb2RlTWlycm9yJ3MgcHJvZ3JhbW1hdGljIHNjcm9sbEludG9WaWV3IHN0aWxsIG1vdmUgdGhlXG4gICAgLy8gc2Nyb2xsZXIuIFRoaXMgY2FwdHVyZS1waGFzZSBsaXN0ZW5lciByZXNldHMgYW55IHNjcm9sbCBpbnNpZGUgdGhlXG4gICAgLy8gYWN0aXZlIG1hcmtkb3duIHZpZXcgYmFjayB0byB0aGUgdG9wIHdoaWxlIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZS5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoXG4gICAgICBkb2N1bWVudCxcbiAgICAgIFwic2Nyb2xsXCIsXG4gICAgICAoZXZ0KSA9PiB7XG4gICAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHJldHVybjtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmICghdmlldykgcmV0dXJuO1xuICAgICAgICBjb25zdCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICAgIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHZpZXcuY29udGVudEVsLmNvbnRhaW5zKGVsKSkge1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxUb3AgIT09IDApIGVsLnNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgaWYgKGVsLnNjcm9sbExlZnQgIT09IDApIGVsLnNjcm9sbExlZnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeyBjYXB0dXJlOiB0cnVlIH0sXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA1LiBFc2NhcGUga2V5IGV4aXRzIFNsaWRlcyBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChkb2N1bWVudCwgXCJrZXlkb3duXCIsIChldnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldnQua2V5ID09PSBcIkVzY2FwZVwiICYmIHRoaXMuc2xpZGVzTW9kZSAmJiB0aGlzLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzKSB7XG4gICAgICAgIHRoaXMuZXhpdFNsaWRlcygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDYuIENyZWF0ZSB0aGUgc2xpZGVzIGJhciBhbmQgZG8gdGhlIGZpcnN0IHJlbmRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLmJhciA9IGNyZWF0ZUJhcigpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5iYXIpO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgb251bmxvYWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc29sb0ltYWdlRnJhbWUgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnNvbG9JbWFnZUZyYW1lKTtcbiAgICB0aGlzLnNvbG9JbWFnZUZyYW1lID0gbnVsbDtcbiAgICB0aGlzLmJhcj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5iYXIgPSBudWxsO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIpO1xuICAgIHRoaXMucmVtb3ZlVGhlbWVDbGFzc2VzKCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2V0dGluZ3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRhdGEgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSBhcyBQYXJ0aWFsPE5hdGl2ZVNsaWRlc1NldHRpbmdzPiB8IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGRhdGEgPz8ge30pO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBub3RlIGlzIGEgZGVjayBub3RlIChoYXMgYSBgZGVja2AgcHJvcGVydHkpICovXG4gIHByaXZhdGUgaXNEZWNrTm90ZShmaWxlOiBURmlsZSB8IG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiBmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgZXZlcnkgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtKmAgY2xhc3MgZnJvbSA8Ym9keT4gKi9cbiAgcHJpdmF0ZSByZW1vdmVUaGVtZUNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBjbHMgb2YgQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNsYXNzTGlzdCkpIHtcbiAgICAgIGlmIChjbHMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgc2luZ2xlIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgc2xpZGVzVGhlbWVgIHNldHRpbmcgXHUyMDE0IHRoZSBzdHlsZSB0ZW1wbGF0ZXMgaW4gc3R5bGVzLmNzcyBob29rIG9mZiBpdC5cbiAgICogVW5rbm93biBpZHMgKGUuZy4gYWZ0ZXIgYSBkb3duZ3JhZGUpIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB0aGVtZS5cbiAgICovXG4gIHByaXZhdGUgYXBwbHlUaGVtZUNsYXNzKCk6IHZvaWQge1xuICAgIGNvbnN0IGlkID0gU0xJREVTX1RIRU1FUy5zb21lKCh0KSA9PiB0LmlkID09PSB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1Muc2xpZGVzVGhlbWU7XG4gICAgY29uc3QgY2xzID0gYG5hdGl2ZS1zbGlkZXMtdGhlbWUtJHtpZH1gO1xuICAgIGZvciAoY29uc3QgYyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpICYmIGMgIT09IGNscykgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaGlkaW5nIHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIGZvciBwcmVzZW50aW5nLiBIaWRpbmcgYWxzb1xuICAgKiBwYXJrcyBmb2N1cyAoYmx1cnMgdGhlIGVkaXRvciwgc28gdGhlIGNhcmV0IGRpc2FwcGVhcnMpOyBzaG93aW5nIGxlYXZlc1xuICAgKiBmb2N1cyBwYXJrZWQgXHUyMDE0IGNsaWNrIHNsaWRlIGNvbnRlbnQgdG8gcmVzdW1lIGVkaXRpbmcuXG4gICAqL1xuICB0b2dnbGVQb2ludGVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9pbnRlckhpZGRlbiA9ICF0aGlzLnBvaW50ZXJIaWRkZW47XG4gICAgaWYgKHRoaXMucG9pbnRlckhpZGRlbikge1xuICAgICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuYCBib2R5IGNsYXNzIGluIHN5bmMgd2l0aCB0aGVcbiAgICogcHJlc2VudGluZyBzdGF0ZSBcdTIwMTQgc3R5bGVzLmNzcyB0dXJucyBldmVyeSBjdXJzb3IgaW52aXNpYmxlIHdoaWxlIHNldC5cbiAgICogTGVhdmluZyBTbGlkZXMgbW9kZSBhbHdheXMgcmVzdG9yZXMgdGhlIHBvaW50ZXIuXG4gICAqL1xuICBwcml2YXRlIHN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwibmF0aXZlLXNsaWRlcy1wb2ludGVyLWhpZGRlblwiLCBzbGlkZXMgJiYgdGhpcy5wb2ludGVySGlkZGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNhcmQgdGl0bGUgcGVyIHRoZSBgc2xpZGVzVGl0bGVgIHNldHRpbmcuIFwiZmlsZW5hbWVcIiByZXN0eWxlc1xuICAgKiB0aGUgbmF0aXZlIGlubGluZSB0aXRsZSBpbnRvIHRoZSBjYXJkIHRpdGxlIChzdGlsbCBlZGl0YWJsZSBcdTIwMTQgdHlwaW5nXG4gICAqIHJlbmFtZXMgdGhlIG5vdGUpOyBcIlwiIHNob3dzIG5vdGhpbmc7IGFueSBvdGhlciB2YWx1ZSBuYW1lcyBhIGZyb250bWF0dGVyXG4gICAqIHByb3BlcnR5IHJlbmRlcmVkIHJlYWQtb25seSB2aWEgdGhlIDo6YmVmb3JlIHBzZXVkby1lbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJbmxpbmVUaXRsZShzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBjb250ZW50ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFmaWxlKSByZXR1cm47XG5cbiAgICBjb25zdCBzcmMgPSB0aGlzLnNldHRpbmdzLnNsaWRlc1RpdGxlLnRyaW0oKTtcblxuICAgIC8vIFwiZmlsZW5hbWVcIjogcmVzdHlsZSB0aGUgbmF0aXZlIC5pbmxpbmUtdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZS4gSXRcbiAgICAvLyBzdGF5cyBjb250ZW50ZWRpdGFibGUsIHNvIGVkaXRpbmcgaXQgcmVuYW1lcyB0aGUgbm90ZSBhcyBpbiBMaXZlXG4gICAgLy8gUHJldmlldy4gVGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgbGl2ZXMgb24gdGhlIG1hcmtkb3duLXNvdXJjZS12aWV3XG4gICAgLy8gZWxlbWVudCAoYSBzaWJsaW5nIGJyYW5jaCBvZiB0aGUgY2FyZCksIHNvIHRoZSBzdHlsaW5nIGhvb2sgaXMgYVxuICAgIC8vIHZpZXcgYXR0cmlidXRlICsgYSBicmFuZC1uZXcgLmNtLWNvbnRlbnQgYXR0cmlidXRlIHRoYXQgcmVzZXJ2ZXMgdGhlXG4gICAgLy8gdGl0bGUncyBoZWlnaHQgdGhlIHNhbWUgd2F5IHRoZSBwc2V1ZG8tZWxlbWVudCB2ZXJzaW9uIGRpZC5cbiAgICBjb25zdCBuYXRpdmVUaXRsZSA9IHNsaWRlcyAmJiBzcmMgPT09IFwiZmlsZW5hbWVcIjtcbiAgICBjb25zdCBzb3VyY2VWaWV3ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXNvdXJjZS12aWV3XCIpO1xuICAgIGlmIChuYXRpdmVUaXRsZSAmJiBzb3VyY2VWaWV3KSBzb3VyY2VWaWV3LnNldEF0dHJpYnV0ZShcImRhdGEtbnMtaW5saW5lLXRpdGxlXCIsIFwiZmlsZW5hbWVcIik7XG4gICAgZWxzZSBzb3VyY2VWaWV3Py5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiKTtcbiAgICBjb250ZW50LnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiLCBuYXRpdmVUaXRsZSk7XG5cbiAgICAvLyBQcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIHJlbmRlciByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudFxuICAgIC8vIChubyBlZGl0aW5nIHN1cmZhY2UgXHUyMDE0IHRoZSBwcm9wZXJ0aWVzIHBhbmVsIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSkuXG4gICAgbGV0IHRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGlmIChzbGlkZXMgJiYgc3JjICYmIHNyYyAhPT0gXCJmaWxlbmFtZVwiKSB7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgICAgY29uc3QgdiA9IGZtPy5bc3JjXTtcbiAgICAgIGlmICh2ICE9IG51bGwpIHRleHQgPSBmb3JtYXRWYWx1ZSh2KTtcbiAgICB9XG5cbiAgICBpZiAodGV4dCkgY29udGVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiLCB0ZXh0KTtcbiAgICBlbHNlIGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIik7XG4gIH1cblxuICAvKiogVGFnIGV2ZXJ5IGltYWdlLW9ubHkgbGluZSB3aXRoIHRoZSBzb2xvIGNsYXNzOyB0cnVlIGlmIGFueSBsaW5lIGNoYW5nZWQuICovXG4gIHByaXZhdGUgdGFnU29sb0ltYWdlTGluZXMoY29udGVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgbGluZSBvZiBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiOnNjb3BlID4gLmNtLWxpbmVcIikpIHtcbiAgICAgIGNvbnN0IHdhbnQgPSBpc1NvbG9JbWFnZUxpbmUobGluZSk7XG4gICAgICBpZiAobGluZS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLXNvbG8taW1hZ2VcIikgIT09IHdhbnQpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIGxpbmUuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtc29sby1pbWFnZVwiLCB3YW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYW5nZWQ7XG4gIH1cblxuICAvKiogQ3VycmVudCBhY3RpdmUgZWRpdG9yIGNvbnRhaW5lciAobGlzdGVuZXIgaG9zdCBmb3Igc29sbyBjZXJ0aWZpY2F0aW9uKSAqL1xuICBwcml2YXRlIHNvbG9JbWFnZUhvc3Q6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8qKiBWaWV3LWxldmVsIGNhcHR1cmUgbGlzdGVuZXIgKHBvaW50ZXJkb3duL2ltYWdlIGxvYWRzKSByZW5ld2luZyB0aGUgd2luZG93ICovXG4gIHByaXZhdGUgc29sb1ZpZXdIYW5kbGVyOiAoKGV2OiBFdmVudCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcbiAgLyoqIERvY3VtZW50LWxldmVsIHNlbGVjdGlvbmNoYW5nZSBsaXN0ZW5lciByZW5ld2luZyB0aGUgd2luZG93ICovXG4gIHByaXZhdGUgc29sb0RvY0hhbmRsZXI6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuICAvKiogU2VsZi1oZWFsIGJ1ZGdldCBmb3IgdGhlIGV4cGlyeSBwYXNzICh3aW5kb3cgcmUtYXJtcyBcdTIyNjQgdGhpcyBtYW55IHRpbWVzKSAqL1xuICBwcml2YXRlIHNvbG9SZWFybXMgPSAwO1xuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBzb2xvLWltYWdlIHRhZ3MgZnJlc2ggd2hpbGUgU2xpZGVzIG1vZGUgaXMgYWN0aXZlLiBDb2RlTWlycm9yXG4gICAqIHJlLWNyZWF0ZXMgbGluZSBlbGVtZW50cyBpbnNpZGUgaXRzIHJlbmRlciBwaXBlbGluZSwgc28gdGFncyBtdXN0IGJlXG4gICAqIHJlLWNlcnRpZmllZCBhdCBhIG1vbWVudCB0aGF0IGxhbmRzIGJlZm9yZSB0aGUgYnJvd3NlciBwYWludHMgcmVidWlsdFxuICAgKiBsaW5lcy4gckFGIGNhbGxiYWNrcyBydW4gYWZ0ZXIgdGhlIGZyYW1lJ3MgdGFza3MgYW5kIGJlZm9yZSBsYXlvdXQvXG4gICAqIHBhaW50LCBzbyBhIGxpbmUgYnVpbHQgaW4gdGhlIHRhc2sgcGhhc2UgaXMgcmUtdGFnZ2VkIGluIHRoZSBzYW1lXG4gICAqIGZyYW1lIFx1MjAxNCBhbiB1bmNlbnRlcmVkIHNvbG8gaW1hZ2UgY2FuIG5ldmVyIGJlIHBhaW50ZWQgd2l0aCB0aGUgd2luZG93XG4gICAqIG9wZW4uXG4gICAqXG4gICAqIE5vIHBlcm1hbmVudCA2MGZwcyBsb29wOiBjZXJ0aWZpY2F0aW9ucyBhcmUgZXZlbnQtZHJpdmVuIGFuZCBib3VuZGVkLlxuICAgKiBBIHdpbmRvdyBpcyBvcGVuZWQvcmVuZXdlZCBieSBldmVyeSBjb250ZW50IGVkaXQgKGBlZGl0b3ItY2hhbmdlYCksXG4gICAqIGJ5IGNhcmV0L3NlbGVjdGlvbiBtb3ZlcyBhbmQgY2xpY2tzIChzZWxlY3Rpb25jaGFuZ2UvcG9pbnRlcmRvd24gXHUyMDE0XG4gICAqIGNsaWNraW5nIHRoZSBpbWFnZSBsaW5lIGZsaXBzIGl0cyBwcmV2aWV3IGJldHdlZW4gcmF3IG1hcmtkb3duIGFuZCB0aGVcbiAgICogZW1iZWQsIHJlLXJlbmRlcmluZyB0aGUgbGluZSksIGFuZCBieSBpbWFnZSBsb2FkczsgZW50cnkgaW50byBTbGlkZXNcbiAgICogbW9kZSBvcGVucyBhIGxvbmcgd2luZG93IGNvdmVyaW5nIHRoZSBlZGl0b3IgcmVidWlsZCB0aGF0IGZvbGxvd3MgdGhlXG4gICAqIG1vZGUgc3dpdGNoLiBJZiB0aGUgd2luZG93IGV4cGlyZXMgYW5kIHRoZSBleHBpcnkgcGFzcyBzdGlsbCBoYWQgdG9cbiAgICogY2hhbmdlIHRhZ3MgKHRoZSBET00gd2FzIHN0aWxsIHNldHRsaW5nKSwgaXQgcmUtYXJtcyBhIGZyZXNoIHdpbmRvdyxcbiAgICogdXAgdG8gYHNvbG9SZWFybXNgIGJ1ZGdldC4gVGhlIHJBRiBjaGFpbiBzdG9wcyB0aGUgbW9tZW50IHRoZSB3aW5kb3dcbiAgICogaXMgY2xvc2VkLCBzbyBpZGxlID0gbm8gc2NoZWR1bGVkIHdvcmsuXG4gICAqL1xuICBwcml2YXRlIHN5bmNTb2xvSW1hZ2VPYnNlcnZlcihhY3RpdmU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoYWN0aXZlKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgIGNvbnN0IGhvc3QgPSB2aWV3Py5jb250ZW50RWwgPz8gbnVsbDtcbiAgICAgIGlmIChob3N0ICYmIHRoaXMuc29sb1ZpZXdIYW5kbGVyID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc29sb0ltYWdlSG9zdCA9IGhvc3Q7XG4gICAgICAgIHRoaXMuc29sb1ZpZXdIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHRoaXMuc2NoZWR1bGVTb2xvQ2VydGlmeSgpO1xuICAgICAgICB9O1xuICAgICAgICBob3N0LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLnNvbG9WaWV3SGFuZGxlciwgdHJ1ZSk7XG4gICAgICAgIGhvc3QuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgdGhpcy5zb2xvVmlld0hhbmRsZXIsIHRydWUpO1xuICAgICAgICB0aGlzLnNvbG9Eb2NIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHRoaXMuc2NoZWR1bGVTb2xvQ2VydGlmeSgpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2VsZWN0aW9uY2hhbmdlXCIsIHRoaXMuc29sb0RvY0hhbmRsZXIpO1xuICAgICAgfVxuICAgICAgdGhpcy5zb2xvUmVhcm1zID0gMDtcbiAgICAgIHRoaXMuc2NoZWR1bGVTb2xvQ2VydGlmeSgyNTAwKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc29sb1ZpZXdIYW5kbGVyICYmIHRoaXMuc29sb0ltYWdlSG9zdCkge1xuICAgICAgdGhpcy5zb2xvSW1hZ2VIb3N0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLnNvbG9WaWV3SGFuZGxlciwgdHJ1ZSk7XG4gICAgICB0aGlzLnNvbG9JbWFnZUhvc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgdGhpcy5zb2xvVmlld0hhbmRsZXIsIHRydWUpO1xuICAgIH1cbiAgICB0aGlzLnNvbG9WaWV3SGFuZGxlciA9IG51bGw7XG4gICAgdGhpcy5zb2xvSW1hZ2VIb3N0ID0gbnVsbDtcbiAgICBpZiAodGhpcy5zb2xvRG9jSGFuZGxlcikgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNlbGVjdGlvbmNoYW5nZVwiLCB0aGlzLnNvbG9Eb2NIYW5kbGVyKTtcbiAgICB0aGlzLnNvbG9Eb2NIYW5kbGVyID0gbnVsbDtcbiAgICBpZiAodGhpcy5zb2xvSW1hZ2VGcmFtZSAhPT0gbnVsbCkge1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuc29sb0ltYWdlRnJhbWUpO1xuICAgICAgdGhpcy5zb2xvSW1hZ2VGcmFtZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIE9wZW4gKG9yIHJlbmV3KSB0aGUgckFGIGNlcnRpZmljYXRpb24gd2luZG93IGZvciBgbXNgIG1pbGxpc2Vjb25kcy4gKi9cbiAgcHJpdmF0ZSBzY2hlZHVsZVNvbG9DZXJ0aWZ5KG1zID0gNTAwKTogdm9pZCB7XG4gICAgdGhpcy5zb2xvUmV0YWdVbnRpbCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSArIG1zO1xuICAgIGlmICh0aGlzLnNvbG9JbWFnZUZyYW1lICE9PSBudWxsKSByZXR1cm47IC8vIHdpbmRvdyBhbHJlYWR5IGNvdmVyZWRcbiAgICBjb25zdCB0aWNrID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGhpcy5zb2xvSW1hZ2VGcmFtZSA9IG51bGw7XG4gICAgICBpZiAod2luZG93LnBlcmZvcm1hbmNlLm5vdygpID49IHRoaXMuc29sb1JldGFnVW50aWwpIHtcbiAgICAgICAgLy8gV2luZG93IGNsb3NlZDogaWYgdGhlIGZpbmFsIHBhc3Mgc3RpbGwgaGFkIHRvIGNoYW5nZSB0YWdzLCB0aGVcbiAgICAgICAgLy8gZWRpdG9yIHdhcyBzdGlsbCBzZXR0bGluZyBcdTIwMTQgcmUtYXJtIGEgZnJlc2ggd2luZG93IHdoaWxlIHRoZVxuICAgICAgICAvLyBidWRnZXQgYWxsb3dzLlxuICAgICAgICBpZiAodGhpcy5zb2xvUmVhcm1zIDwgNCAmJiB0aGlzLnRhZ0N1cnJlbnRDb250ZW50KCkpIHtcbiAgICAgICAgICB0aGlzLnNvbG9SZWFybXMrKztcbiAgICAgICAgICB0aGlzLnNjaGVkdWxlU29sb0NlcnRpZnkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnRhZ0N1cnJlbnRDb250ZW50KCk7XG4gICAgICB0aGlzLnNvbG9JbWFnZUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICB9O1xuICAgIHRoaXMuc29sb0ltYWdlRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICB9XG5cbiAgLyoqIFRhZyB0aGUgc29sby1pbWFnZSBsaW5lcyBvZiB0aGUgYWN0aXZlIGVkaXRvciwgd2hlcmV2ZXIgaXQgaXMgbm93LiAqL1xuICBwcml2YXRlIHRhZ0N1cnJlbnRDb250ZW50KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmFwcC53b3Jrc3BhY2VcbiAgICAgIC5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldylcbiAgICAgID8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgcmV0dXJuIGNvbnRlbnQgPyB0aGlzLnRhZ1NvbG9JbWFnZUxpbmVzKGNvbnRlbnQpIDogZmFsc2U7XG4gIH1cblxuICAvKiogRW50ZXIgU2xpZGVzIG1vZGU6IHJlY29yZCB0aGUgZXhpdCBzdGF0ZSBhbmQgZm9yY2UgdGhlIExpdmUgUHJldmlldyAqL1xuICBwcml2YXRlIGFzeW5jIGVudGVyU2xpZGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IG1vZGU/OiBzdHJpbmc7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgICAgIHRoaXMuZXhpdE1vZGUgPSBzdGF0ZS5tb2RlID09PSBcInByZXZpZXdcIiA/IFwicHJldmlld1wiIDogXCJzb3VyY2VcIjtcbiAgICAgIHRoaXMuZXhpdFNvdXJjZSA9IHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZTtcbiAgICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFsd2F5cyB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgICBjb25zdCBuZXh0ID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgbmV4dC5zdGF0ZSA9IHsgLi4ubmV4dC5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiBmYWxzZSB9O1xuICAgICAgYXdhaXQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShuZXh0LCB7IGZvY3VzOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gdHJ1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBFeGl0IFNsaWRlcyBtb2RlOiByZXN0b3JlIHRoZSB2aWV3IG1vZGUgcmVjb3JkZWQgYXQgZW50cnkgKi9cbiAgcHJpdmF0ZSBleGl0U2xpZGVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIGlmICh0aGlzLmV4aXRNb2RlID09PSBcInByZXZpZXdcIikge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwicHJldmlld1wiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogdGhpcy5leGl0U291cmNlIH07XG4gICAgICB9XG4gICAgICB2b2lkIHZpZXcubGVhZi5zZXRWaWV3U3RhdGUoc3RhdGUsIHsgZm9jdXM6IGZhbHNlIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgU2xpZGVzIG1vZGUgKGRlY2sgbm90ZXMgb25seSBcdTIwMTQgZW5mb3JjZWQgYnkgdGhlIGNvbW1hbmQpICovXG4gIHRvZ2dsZVNsaWRlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlKSB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICBlbHNlIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqIFJldmVhbCB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwsIGNyZWF0aW5nIGl0IGluIHRoZSByaWdodCBzaWRlYmFyIGlmIG5lZWRlZCAqL1xuICBhc3luYyBhY3RpdmF0ZVNsaWRlc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTTElERVNfUEFORUxfVklFVyk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nWzBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikgcmV0dXJuO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogU0xJREVTX1BBTkVMX1ZJRVcsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIE1vdmUgb25lIHN0ZXAgYmFjay9mb3J3YXJkIGFsb25nIHRoZSBkZWNrIGNoYWluIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpICovXG4gIGFzeW5jIG5hdmlnYXRlKGRpcmVjdGlvbjogXCJwcmV2XCIgfCBcIm5leHRcIik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgaWYgKCFkZWNrKSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltkaXJlY3Rpb24gPT09IFwicHJldlwiID8gZGVjay5pbmRleCAtIDEgOiBkZWNrLmluZGV4ICsgMV07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvKiogSnVtcCB0byBhIHNwZWNpZmljIGluZGV4IGluIHRoZSBkZWNrIGNoYWluIChwcm9ncmVzcyBiYXIgY2xpY2spICovXG4gIGFzeW5jIGp1bXBUbyhpbmRleDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBpZiAoIWRlY2sgfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IGRlY2suY2hhaW4ubGVuZ3RoIHx8IGluZGV4ID09PSBkZWNrLmluZGV4KSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltpbmRleF07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQmFyIHJlbmRlcmluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKipcbiAgICogR2V0IGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgdGhlIGJhciBwcm9wZXJ0aWVzLiBSZXR1cm5zIGFuIGFycmF5IG9mXG4gICAqIHBlcmNlbnRhZ2VzIChzdW1taW5nIHRvIDEwMCkgZm9yIGVhY2ggcHJvcGVydHkuIExvYWRzIGZyb20gc2V0dGluZ3Mgb3JcbiAgICogZGVmYXVsdHMgdG8gZXF1YWwgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRCYXJQcm9wZXJ0eVdpZHRocyhjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgfHwgXCJbXVwiKSBhcyB1bmtub3duO1xuICAgICAgaWYgKGlzTnVtYmVyTGlzdChzdG9yZWQsIGNvdW50KSkgcmV0dXJuIHN0b3JlZDtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEFycmF5PG51bWJlcj4oY291bnQpLmZpbGwoMTAwIC8gY291bnQpO1xuICB9XG5cbiAgLyoqIFNhdmUgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIHRvIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRoczogbnVtYmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzID0gSlNPTi5zdHJpbmdpZnkod2lkdGhzKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLyoqIERlY2lkZSB3aGF0IHRoZSBzbGlkZXMgYmFyIHNob3dzLCB0aGVuIHJlLXJlbmRlciBpdCAqL1xuICByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXIpIHJldHVybjtcbiAgICB0aGlzLmFwcGx5VGhlbWVDbGFzcygpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKHRoaXMuYXBwKTtcbiAgICBjb25zdCBpc0NhcmQgPSB0aGlzLmlzRGVja05vdGUoZmlsZSk7XG4gICAgY29uc3QgbGl2ZVByZXZpZXdOb3cgPSBtb2RlID09PSBcInNvdXJjZVwiICYmIGlzTGl2ZVByZXZpZXcodGhpcy5hcHApO1xuXG4gICAgLy8gTGVhdmluZyBhIGRlY2sgbm90ZSwgb3IgbGVhdmluZyB0aGUgTGl2ZSBQcmV2aWV3IChlLmcuIENtZC9DdHJsK0UgdG9cbiAgICAvLyByZWFkaW5nIHZpZXcpLCBlbmRzIFNsaWRlcyBtb2RlIFx1MjAxNCBvbmx5IHRoZSB0b2dnbGUgY29tbWFuZCByZS1lbnRlcnMgaXQuXG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSAmJiAoIWlzQ2FyZCB8fCAhbGl2ZVByZXZpZXdOb3cpKSB7XG4gICAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIHRoZSB0YWIgYmFyIHdoaWxlIGl0IGlzIHN0aWxsIHZpc2libGUgKFNsaWRlcyBtb2RlIGhpZGVzIGl0XG4gICAgLy8gYmVsb3c7IHRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGlzIHJldXNlZCBvbmNlIGhpZGRlbikuXG4gICAgdGhpcy50YWJCYXJIZWlnaHQgPSBzeW5jVGFiQmFySGVpZ2h0KHRoaXMudGFiQmFySGVpZ2h0KTtcblxuICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZSBvbmx5IHdoaWxlIGFjdHVhbGx5IGluIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICBjb25zdCBzbGlkZXMgPSB0aGlzLnNsaWRlc01vZGUgJiYgaXNDYXJkICYmIGxpdmVQcmV2aWV3Tm93O1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiLCBzbGlkZXMpO1xuICAgIGlmICghc2xpZGVzKSB0aGlzLnBvaW50ZXJIaWRkZW4gPSBmYWxzZTsgLy8gbGVhdmluZyBTbGlkZXMgcmVzdG9yZXMgdGhlIHBvaW50ZXJcbiAgICB0aGlzLnN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnVwZGF0ZUlubGluZVRpdGxlKHNsaWRlcyk7XG5cbiAgICAvLyBLZWVwIHN0YW5kYWxvbmUtaW1hZ2UgbGluZSB0YWdzIGZyZXNoIHdoaWxlIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZS5cbiAgICAvLyBUaGUgb2JzZXJ2ZXIgd2F0Y2hlcyBkb2N1bWVudC5ib2R5IGFuZCByZS1yZXNvbHZlcyB0aGUgYWN0aXZlIGVkaXRvclxuICAgIC8vIGVhY2ggcGFzcywgc28gZWRpdG9yIHJlYnVpbGRzICh2aWV3LW1vZGUgc3dpdGNoZXMpIGNhbm5vdCBzdHJhbmQgaXQuXG4gICAgdGhpcy5zeW5jU29sb0ltYWdlT2JzZXJ2ZXIoc2xpZGVzKTtcblxuICAgIGNvbnN0IGJhclZpc2libGUgPSBzbGlkZXMgJiYgdGhpcy5zZXR0aW5ncy5zaG93U2xpZGVzQmFyICYmICF0aGlzLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAvLyBXaGVuIGJhciBpcyBoaWRkZW4sIHNldCBib3R0b20gcGFkZGluZyB0byAwIHNvIHRoZSBjYXJkIGZpbGxzIHRoZSBmdWxsXG4gICAgLy8gd2luZG93IGhlaWdodC4gV2hlbiB2aXNpYmxlLCByZW1vdmUgdGhlIG92ZXJyaWRlIHNvIENTUyBmYWxscyBiYWNrIHRvXG4gICAgLy8gLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQgKGNsZWFycyB0aGUgYmFyIGFzIGJlZm9yZSkuXG4gICAgaWYgKGJhclZpc2libGUpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCI6IFwiMHB4XCIgfSk7XG4gICAgfVxuICAgIGlmICghYmFyVmlzaWJsZSkge1xuICAgICAgdGhpcy5iYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZmlsZSkgcmV0dXJuOyAvLyBiYXJWaXNpYmxlIGltcGxpZXMgYSBmaWxlLCBidXQgbmFycm93IGZvciBUeXBlU2NyaXB0XG5cbiAgICBjb25zdCBmbSA9IGFjdGl2ZUZyb250bWF0dGVyKHRoaXMuYXBwKTtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGNsZWFyQ2hpbGRyZW4odGhpcy5iYXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExlZnQ6IHByZXZpb3VzIC8gbmV4dCBidXR0b25zIChib3RoIGFsd2F5cyBzaG93biBpbnNpZGUgYSBkZWNrO1xuICAgIC8vICAgICAgICB0aGUgb25lIHRoYXQgY2Fubm90IG1vdmUgaXMgZGlzYWJsZWQgLyBsaWdodCBncmF5KSBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyAmJiBkZWNrKSB7XG4gICAgICBjb25zdCBoYXNQcmV2ID0gZGVjay5pbmRleCA+IDA7XG4gICAgICBjb25zdCBoYXNOZXh0ID0gZGVjay5pbmRleCA8IGRlY2suY2hhaW4ubGVuZ3RoIC0gMTtcbiAgICAgIGNvbnN0IG5hdiA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdlwiIH0pO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVDMFwiLCBcIlByZXZpb3VzIHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwicHJldlwiKSwgIWhhc1ByZXYpKTtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QjZcIiwgXCJOZXh0IHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwibmV4dFwiKSwgIWhhc05leHQpKTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKG5hdik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1pZGRsZTogY29uZmlndXJlZCBwcm9wZXJ0eSBjb2x1bW5zIHdpdGggZHJhZ2dhYmxlIGRpdmlkZXJzIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHByb3BOYW1lcyA9IHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydGllc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHByb3BOYW1lcy5sZW5ndGggPiAwICYmIGZtKSB7XG4gICAgICBjb25zdCBlbnRyaWVzOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwcm9wTmFtZXMpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gZm0pIHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBmbVtuYW1lXTtcbiAgICAgICAgICBpZiAodmFsICE9IG51bGwpIGVudHJpZXMucHVzaChbbmFtZSwgZm9ybWF0VmFsdWUodmFsKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3BlcnRpZXNcIiB9KTtcblxuICAgICAgICBjb25zdCB3aWR0aHMgPSB0aGlzLmdldEJhclByb3BlcnR5V2lkdGhzKGVudHJpZXMubGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBbLCB2YWx1ZV0gPSBlbnRyaWVzW2ldO1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLCB0ZXh0OiB2YWx1ZSB9KTtcbiAgICAgICAgICBpdGVtLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7d2lkdGhzW2ldfSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSA8IGVudHJpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY29uc3QgZGl2aWRlciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1kaXZpZGVyXCIgfSk7XG4gICAgICAgICAgICBkaXZpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICBjb25zdCBpbml0aWFsV2lkdGhzID0gWy4uLndpZHRoc107XG4gICAgICAgICAgICAgIGNvbnN0IG9uTW92ZSA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gKChldi5jbGllbnRYIC0gc3RhcnRYKSAvIGNvbnRhaW5lcldpZHRoKSAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMZWZ0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpXSArIGRlbHRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSaWdodCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaSArIDFdIC0gZGVsdGEpO1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpXSA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2kgKyAxXSA9IG5ld1JpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgXCIubmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld0xlZnR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2kgKyAxXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld1JpZ2h0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgY29uc3Qgb25VcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRDc3NTdHlsZXMoeyBjdXJzb3I6IFwiXCIsIHVzZXJTZWxlY3Q6IFwiXCIgfSk7XG4gICAgICAgICAgICAgICAgdm9pZCB0aGlzLnNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHMpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJjb2wtcmVzaXplXCIsIHVzZXJTZWxlY3Q6IFwibm9uZVwiIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2aWRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCcm9rZW4gZGVjayBsaW5rcyBcdTIxOTIgd2FybmluZyBjaGlwIHNvIGRlY2sgYXV0aG9ycyBzcG90IHR5cG9zXG4gICAgY29uc3QgYnJva2VuID0gZmlsZSA/IHRoaXMuZGVja1NlcnZpY2UuYnJva2VuKGZpbGUpIDogW107XG4gICAgaWYgKGJyb2tlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB3YXJuID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXdhcm5cIixcbiAgICAgICAgdGV4dDogXCJcdTI2QTAgXCIgKyBicm9rZW4uam9pbihcIiwgXCIpLFxuICAgICAgICBhdHRyOiB7IHRpdGxlOiBcIkJyb2tlbiBkZWNrIGxpbmsocykgXHUyMDE0IHRoZSB0YXJnZXQgbm90ZSBkb2VzIG5vdCBleGlzdFwiIH0sXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHdhcm4pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBCb3R0b20tcmlnaHQ6IGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXIgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlICE9PSBcIm5vbmVcIiAmJiBkZWNrKSB7XG4gICAgICAvLyB2MS4wLjAgbmV4dC1vbmx5IHNlbWFudGljczogY2hhaW5bMF0gaXMgdGhlIGhlYWQgc2xpZGUgPSBwYWdlIDE7XG4gICAgICAvLyB0b3RhbCBpcyB0aGUgZnVsbCBjaGFpbiBsZW5ndGguXG4gICAgICBjb25zdCB0b3RhbCA9IGRlY2suY2hhaW4ubGVuZ3RoO1xuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYWdlXCIsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPT09IFwiZnJhY3Rpb25cIlxuICAgICAgICAgICAgPyBgJHtkZWNrLmluZGV4ICsgMX0gLyAke3RvdGFsfWBcbiAgICAgICAgICAgIDogYCR7ZGVjay5pbmRleCArIDF9YCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFByb2dyZXNzIGluZGljYXRvcjogZGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IGJhciB0b3AgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1Byb2dyZXNzICYmIGRlY2sgJiYgZGVjay5jaGFpbi5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXByb2dyZXNzXCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlY2suY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBpIDwgZGVjay5pbmRleCA/IFwicGFzdFwiIDogaSA9PT0gZGVjay5pbmRleCA/IFwiY3VycmVudFwiIDogXCJmdXR1cmVcIjtcbiAgICAgICAgY29uc3Qgc2VnID0gY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IGBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZyBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZy0tJHtzdGF0ZX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB2b2lkIHRoaXMuanVtcFRvKGkpKTtcbiAgICAgICAgcHJvZ3Jlc3MuYXBwZW5kQ2hpbGQoc2VnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHRoZSBzbGlkZXMgYmFyIGVudGlyZWx5IHdoZW4gaXQgaGFzIG5vdGhpbmcgdG8gZGlzcGxheSAobm8gcHJvcGVydGllcyxcbiAgICAvLyBhbmQgbm90IHBhcnQgb2YgYSBkZWNrKVxuICAgIHRoaXMuYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IHRoaXMuYmFyLmNoaWxkRWxlbWVudENvdW50ID09PSAwID8gXCJub25lXCIgOiBcIlwiIH0pO1xuICB9XG59XG5cbi8qKiBXaGV0aGVyIGB2YWx1ZWAgaXMgYW4gYXJyYXkgb2YgZXhhY3RseSBgY291bnRgIG51bWJlcnMgKHN0b3JlZCBiYXIgd2lkdGhzKS4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyTGlzdCh2YWx1ZTogdW5rbm93biwgY291bnQ6IG51bWJlcik6IHZhbHVlIGlzIG51bWJlcltdIHtcbiAgcmV0dXJuIChcbiAgICBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IGNvdW50ICYmIHZhbHVlLmV2ZXJ5KChuKSA9PiB0eXBlb2YgbiA9PT0gXCJudW1iZXJcIilcbiAgKTtcbn1cblxuLyoqXG4gKiBXaGV0aGVyIGEgbGluZSBlbGVtZW50IGhvbGRzIGFuIGltYWdlIGFuZCBub3RoaW5nIGVsc2UgKG5vIHR5cGVkIHRleHQgYW5kXG4gKiBubyBsaXN0L3F1b3RlIG1hcmtlcnMpIFx1MjAxNCBhIFwic3RhbmRhbG9uZSBpbWFnZSBsaW5lXCIuIENvZGVNaXJyb3IncyBvd25cbiAqIHdpZGdldCBwbHVtYmluZyAoY20td2lkZ2V0QnVmZmVyIHBsYWNlaG9sZGVycywgdGhlIGZvbGQgaW5kaWNhdG9yKSBpc1xuICogaWdub3JlZDsgYW55IHJlYWwgaW1nIChyYXcgbWFya2Rvd24gaW1hZ2Ugb3IgZW1iZWQpIGNvdW50cy5cbiAqL1xuZnVuY3Rpb24gaXNTb2xvSW1hZ2VMaW5lKGxpbmU6IEVsZW1lbnQpOiBib29sZWFuIHtcbiAgbGV0IHNhd0ltYWdlID0gZmFsc2U7XG4gIGxldCBzYXdUZXh0ID0gZmFsc2U7XG4gIGZvciAoY29uc3Qgbm9kZSBvZiBBcnJheS5mcm9tKGxpbmUuY2hpbGROb2RlcykpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgIGlmIChub2RlLnRleHRDb250ZW50ICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpKSBzYXdUZXh0ID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoIW5vZGUuaW5zdGFuY2VPZihIVE1MRWxlbWVudCkpIGNvbnRpbnVlO1xuICAgIGlmIChcbiAgICAgIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY20td2lkZ2V0QnVmZmVyXCIpIHx8XG4gICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImNtLWZvbGQtaW5kaWNhdG9yXCIpXG4gICAgKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gXCJJTUdcIikge1xuICAgICAgc2F3SW1hZ2UgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImNtLWZvcm1hdHRpbmdcIikpIHtcbiAgICAgIGlmIChub2RlLnRleHRDb250ZW50ICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpKSBzYXdUZXh0ID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobm9kZS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpKSBzYXdJbWFnZSA9IHRydWU7XG4gICAgZWxzZSBpZiAobm9kZS50ZXh0Q29udGVudCAmJiBub2RlLnRleHRDb250ZW50LnRyaW0oKSkgc2F3VGV4dCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHNhd0ltYWdlICYmICFzYXdUZXh0O1xufVxuIiwgIi8qKiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKGhpZGRlbiB1bnRpbCByZWZyZXNoKCkgc2hvd3MgaXQpICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQmFyKCk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgYmFyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyXCIgfSk7XG4gIGJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgYmFyLnRpdGxlID0gXCJDbGljayB0byBwYXJrIHRoZSBtb3VzZSBcdTIwMTQgaGlkZXMgdGhlIGVkaXRvciBjYXJldCB3aGlsZSBwcmVzZW50aW5nXCI7XG4gIC8vIFByZXNlbnRhdGlvbiBwYXJraW5nOiBjbGlja2luZyB0aGUgYmFyIGtlZXBzIGZvY3VzIG91dCBvZiB0aGUgZWRpdG9yIHNvXG4gIC8vIHRoZSBibGlua2luZyBjYXJldCBkaXNhcHBlYXJzLiBwcmV2ZW50RGVmYXVsdCBzdG9wcyB0aGUgY2xpY2sgZnJvbSBtb3ZpbmdcbiAgLy8gZm9jdXMgb3Igc3RhcnRpbmcgYSB0ZXh0IHNlbGVjdGlvbjsgYnV0dG9ucyBzdGlsbCByZWNlaXZlIHRoZWlyIGNsaWNrIGV2ZW50LlxuICBiYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gIH0pO1xuICByZXR1cm4gYmFyO1xufVxuXG4vKiogQnVpbGQgYSBcdTI1QzAgLyBcdTI1QjYgbmF2aWdhdGlvbiBidXR0b247IGBkaXNhYmxlZGAgcmVuZGVycyBpdCBsaWdodCBncmF5L2luYWN0aXZlICovXG5leHBvcnQgZnVuY3Rpb24gbmF2QnV0dG9uKFxuICBsYWJlbDogc3RyaW5nLFxuICB0aXA6IHN0cmluZyxcbiAgb25DbGljazogKCkgPT4gdm9pZCxcbiAgZGlzYWJsZWQgPSBmYWxzZSxcbik6IEhUTUxCdXR0b25FbGVtZW50IHtcbiAgY29uc3QgYnRuID0gY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdi1idG5cIixcbiAgICB0ZXh0OiBsYWJlbCxcbiAgICBhdHRyOiB7IHRpdGxlOiB0aXAgfSxcbiAgfSk7XG4gIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICBpZiAoIWRpc2FibGVkKSBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uQ2xpY2spO1xuICByZXR1cm4gYnRuO1xufVxuXG4vKipcbiAqIE1lYXN1cmUgdGhlIHRvcCB0YWIgYmFyIGFuZCBleHBvc2UgaXRzIGhlaWdodCBhcyB0aGUgQ1NTIHZhcmlhYmxlXG4gKiAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCwgcmV0dXJuaW5nIHRoZSAocG9zc2libHkgdXBkYXRlZCkgY2FjaGVkXG4gKiB2YWx1ZS4gVGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuIGluIFNsaWRlcyBtb2RlLCBzbyB0aGUgbGFzdCBtZWFzdXJlZFxuICogdmFsdWUgaXMgcmV1c2VkIHRoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3luY1RhYkJhckhlaWdodChjYWNoZWQ6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHRhYkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFxuICAgIFwiLndvcmtzcGFjZS10YWJzLm1vZC10b3AgLndvcmtzcGFjZS10YWItaGVhZGVyLWNvbnRhaW5lclwiLFxuICApO1xuICBpZiAodGFiQmFyICYmIHRhYkJhci5vZmZzZXRIZWlnaHQgPiAwKSBjYWNoZWQgPSB0YWJCYXIub2Zmc2V0SGVpZ2h0O1xuICBpZiAoY2FjaGVkID4gMCkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIjogYCR7Y2FjaGVkfXB4YCB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBObyBtZWFzdXJlbWVudCB5ZXQgKHRhYiBiYXIgaGlkZGVuIHNpbmNlIGxvYWQpIFx1MjAxNCBsZXQgdGhlIENTUyBmYWxsYmFjayBhcHBseS5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9tb2RlXCI7XG5cbi8qKlxuICogVHlwb2dyYXBoeS1tZWFzdXJlbWVudCB0b29saW5nIChkZXYgYnVpbGRzIG9ubHkpLlxuICpcbiAqIFRoZSBgbnMtZGVidWctc3R5bGVzYCBjb21tYW5kIHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyBpblxuICogZWRpdCAoTGl2ZSBQcmV2aWV3KSBhbmQgdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldywgbWVyZ2VzIHRoZVxuICogcmVzdWx0cywgY29tcHV0ZXMgYW4gZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kIHdyaXRlcyBpdCB0b1xuICogLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC4gUmVnaXN0ZXJlZCBvbmx5IHdoZW4gdGhlXG4gKiBidWlsZC10aW1lIERFVl9NT0RFIGZsYWcgaXMgdHJ1ZTsgcmVsZWFzZSBidWlsZHMgdHJlZS1zaGFrZSB0aGlzIG1vZHVsZSBvdXQuXG4gKi9cblxuLyoqIEZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyB1c2VkIGJ5IHRoZSBkZWJ1ZyBjb21tYW5kIChlZGl0IHNpZGUpICovXG5leHBvcnQgY29uc3QgU0FNUExFX05PVEVfTkFNRVMgPSBbXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtaGVhZGluZ3NcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1saXN0XCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtY29kZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLXF1b3RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbWVkaWFcIixcbl07XG5cbi8qKiBTdHlsZSBzZWN0aW9ucyBzYW1wbGVkIGJ5IHNhbXBsZVN0eWxlcygpIGFuZCBjb21wYXJlZCBieSBkaWZmRHVtcHMoKSAqL1xuY29uc3QgU1RZTEVfU0VDVElPTlMgPSBbXG4gIFwiY29udGFpbmVyXCIsXG4gIFwicGFyYWdyYXBoXCIsXG4gIFwiaDFcIixcbiAgXCJsaXN0SXRlbVwiLFxuICBcImNvZGVCbG9ja1wiLFxuICBcImJsb2NrcXVvdGVcIixcbiAgXCJpbmxpbmVDb2RlXCIsXG4gIFwidGFibGVcIixcbiAgXCJpbWFnZVwiLFxuICBcImhvcml6b250YWxSdWxlXCIsXG5dO1xuXG4vKiogUHJvbWlzZS1iYXNlZCBzbGVlcCAqL1xuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHdpbmRvdy5zZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKlxuICogTWVyZ2Ugbm9uLW1pc3Npbmcgc3R5bGUgc2VjdGlvbnMgb2YgYSBmcmVzaCBzYW1wbGUgaW50byB0aGUgdGFyZ2V0XG4gKiAoZmlyc3Qgbm9uLW1pc3NpbmcgdmFsdWUgd2lucykuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU2FtcGxlKHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHNhbXBsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gc2FtcGxlW2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlY3Rpb24gfHwgXCIobWlzc2luZylcIiBpbiBzZWN0aW9uKSBjb250aW51ZTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRhcmdldFtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKGV4aXN0aW5nICYmICEoXCIobWlzc2luZylcIiBpbiBleGlzdGluZykpIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc2VjdGlvbjtcbiAgfVxuICAvLyBQcm9iZSBmaWVsZHMgcmlkZSBhbG9uZyAoZmlyc3Qgbm9uLWVtcHR5IHdpbnMpXG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImxpc3RMaW5lc1wiLFxuICAgIFwibWV0YWRhdGFDb250YWluZXJEaXNwbGF5XCIsXG4gICAgXCJoMU9mZnNldFRvcFwiLFxuICAgIFwiaDFUb3BJbkNvbnRlbnRcIixcbiAgICBcImgxTGVmdEluQ29udGVudFwiLFxuICAgIFwidGl0bGVcIixcbiAgICBcImNvbnRlbnRDaGlsZHJlblwiLFxuICAgIFwidG9wQ2hhaW5cIixcbiAgXSkge1xuICAgIGNvbnN0IHByb2JlID0gc2FtcGxlW2tleV07XG4gICAgaWYgKHByb2JlID09PSB1bmRlZmluZWQgfHwgcHJvYmUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb2JlKSAmJiBwcm9iZS5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcHJvYmUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvYmUpICYmIE9iamVjdC5rZXlzKHByb2JlKS5sZW5ndGggPT09IDApXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFyZ2V0W2tleV0gPT09IHVuZGVmaW5lZCkgdGFyZ2V0W2tleV0gPSBwcm9iZTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmUgdGhlIHN0eWxlIHNlY3Rpb25zIG9mIGFuIGVkaXQgZHVtcCBhbmQgYSByZWFkaW5nIGR1bXA7IG9ubHlcbiAqIGtleXMgd2hvc2UgdmFsdWVzIGRpZmZlciBhcmUga2VwdCwgYXMgeyBrZXk6IHsgZWRpdCwgcmVhZGluZyB9IH0uXG4gKi9cbmZ1bmN0aW9uIGRpZmZEdW1wcyhcbiAgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IGUgPSAoZWRpdFtzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCByID0gKHJlYWRpbmdbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGUpLCAuLi5PYmplY3Qua2V5cyhyKV0pO1xuICAgIGNvbnN0IGRpZmZzOiBSZWNvcmQ8c3RyaW5nLCB7IGVkaXQ6IHN0cmluZzsgcmVhZGluZzogc3RyaW5nIH0+ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgaWYgKGVba2V5XSAhPT0gcltrZXldKSB7XG4gICAgICAgIGRpZmZzW2tleV0gPSB7IGVkaXQ6IGVba2V5XSA/PyBcIihtaXNzaW5nKVwiLCByZWFkaW5nOiByW2tleV0gPz8gXCIobWlzc2luZylcIiB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoZGlmZnMpLmxlbmd0aCA+IDApIG91dFtzZWN0aW9uXSA9IGRpZmZzO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBTYW1wbGUgdGhlIGN1cnJlbnQgdmlldydzIHR5cG9ncmFwaHkgY29tcHV0ZWQgc3R5bGVzICsgQ1NTIHZhcmlhYmxlcyAqL1xuZnVuY3Rpb24gc2FtcGxlU3R5bGVzKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0VkaXQgPSB2aWV3LmdldE1vZGUoKSA9PT0gXCJzb3VyY2VcIjtcbiAgY29uc3QgY29udGVudEVsID0gdmlldy5jb250ZW50RWw7XG4gIC8vIEZpcnN0IG1hdGNoaW5nIGNhbmRpZGF0ZSB3aW5zIFx1MjAxNCBlZGl0IChjbTYpIGFuZCByZWFkaW5nIHVzZVxuICAvLyBkaWZmZXJlbnQgZWxlbWVudCBzdHJ1Y3R1cmVzIChlLmcuIG5vIHByZS9ibG9ja3F1b3RlIGluIGNtNikuXG4gIGNvbnN0IHBpY2sgPSAoc2Vsczogc3RyaW5nW10pOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3Qgc2VsIG9mIHNlbHMpIHtcbiAgICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgICBpZiAoZWwpIHJldHVybiBlbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGNvbnN0IHN0eWxlID0gKGVsOiBIVE1MRWxlbWVudCB8IG51bGwsIHByb3BzOiBzdHJpbmdbXSk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICAgIGlmICghZWwpIHJldHVybiB7IFwiKG1pc3NpbmcpXCI6IFwiZWxlbWVudCBub3QgaW4gdGhpcyBub3RlXCIgfTtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcCBvZiBwcm9wcykge1xuICAgICAgY29uc3QgdiA9IGNzLmdldFByb3BlcnR5VmFsdWUocCkudHJpbSgpO1xuICAgICAgaWYgKHYpIG91dFtwXSA9IHY7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IHZhcnMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICBjb25zdCBjc3NWYXIgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHZhcnMuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKS50cmltKCk7XG5cbiAgY29uc3QgY29udGFpbmVyID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWNvbnRlbnRcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiLFxuICBdKTtcbiAgY29uc3QgcGFyYSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcFwiLFxuICBdKTtcbiAgY29uc3QgaDEgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1oZWFkZXItMVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGgxXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaDFcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoMVwiLFxuICBdKTtcbiAgY29uc3QgbGlzdEl0ZW0gPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgICBpc0VkaXQgPyBcIi5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICBdKTtcbiAgY29uc3QgcHJlID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgcHJlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tZWRpdGluZyBwcmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWNvZGVibG9ja1wiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICBdKTtcbiAgY29uc3QgcXVvdGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGJsb2NrcXVvdGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBibG9ja3F1b3RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtcXVvdGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBibG9ja3F1b3RlXCIsXG4gIF0pO1xuICBjb25zdCBpbmxpbmVDb2RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBjb2RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgY29kZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1pbmxpbmUtY29kZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGNvZGVcIixcbiAgXSk7XG4gIGNvbnN0IHRhYmxlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IHRhYmxlXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdGFibGVcIixcbiAgXSk7XG4gIGNvbnN0IGltZyA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaW1nXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGltZ1wiLFxuICAgIFwiaW1nXCIsIC8vIHdob2xlLWRvY3VtZW50IGZhbGxiYWNrXG4gIF0pO1xuICBjb25zdCBociA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20taHJcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICBdKTtcblxuICAvLyBTdHJ1Y3R1cmUgcHJvYmVzIChlZGl0IHZpZXcgb25seSk6IHRoZSBzb3VyY2UtdmlldyBjbGFzcyBsaXN0XG4gIC8vIChjb25maXJtcyB0aGUgTGl2ZSBQcmV2aWV3IG1hcmtlciBjbGFzcykgYW5kIHVuaXF1ZSBlbGVtZW50IHRhZ3NcbiAgLy8gaW5zaWRlIHRoZSBlZGl0b3IgKHJldmVhbHMgaG93IGNtNiByZW5kZXJzIGNvZGUgYmxvY2tzIGV0Yy4gd2hlblxuICAvLyB0aGUgdXN1YWwgc2VsZWN0b3JzIGRvIG5vdCBtYXRjaCkuXG4gIGNvbnN0IHNvdXJjZVZpZXdDbGFzcyA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTZcIik/LmNsYXNzTmFtZSA/PyBcIlwiO1xuICBjb25zdCBkb21UYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnRlbnRFbFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAqXCIpXG4gICAgICAuZm9yRWFjaCgoZWwpID0+IHRhZ3MuYWRkKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkpO1xuICAgIGRvbVRhZ3MucHVzaCguLi50YWdzKTtcbiAgfVxuICAvLyBMaXN0LWxpbmUgcHJvYmUgKGVkaXQgdmlldyBvbmx5KTogY2xhc3MgbmFtZXMgKyBjb21wdXRlZCBwYWRkaW5nXG4gIC8vIG9mIHRoZSBmaXJzdCBsaXN0IGxpbmVzIFx1MjAxNCBuZXN0ZWQgbGV2ZWxzIG9mdGVuIHVzZSBkaXN0aW5jdFxuICAvLyBjbGFzc2VzIG9yIGlubGluZSBwYWRkaW5ncywgd2hpY2ggZGVjaWRlcyB3aGV0aGVyIGEgbGV2ZWwtYXdhcmVcbiAgLy8gaW5kZW50IG92ZXJyaWRlIGlzIGV2ZW4gcG9zc2libGUuXG4gIGNvbnN0IGxpc3RMaW5lczogeyBjbGFzc05hbWU6IHN0cmluZzsgcGFkZGluZ0xlZnQ6IHN0cmluZyB9W10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yQWxsKFwiLkh5cGVyTUQtbGlzdC1saW5lXCIpLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICBpZiAoaSA+PSA0KSByZXR1cm47XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgbGlzdExpbmVzLnB1c2goe1xuICAgICAgICBjbGFzc05hbWU6IGVsLmNsYXNzTmFtZSxcbiAgICAgICAgcGFkZGluZ0xlZnQ6IGNzLmdldFByb3BlcnR5VmFsdWUoXCJwYWRkaW5nLWxlZnRcIikudHJpbSgpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gRnJvbnRtYXR0ZXIgcHJvYmVzOiBkb2VzIHRoZSAoaGlkZGVuKSBwcm9wZXJ0aWVzIGFyZWEgc3RpbGxcbiAgLy8gb2NjdXB5IHNwYWNlIGluIExpdmUgUHJldmlldz8gQW5kIGhvdyBmYXIgaXMgdGhlIEgxIGZyb20gdGhlXG4gIC8vIHRvcCBvZiB0aGUgY29udGVudCBhcmVhPyAocmVhZGluZyBtb2RlIGhhcyBubyBzdWNoIHBhZGRpbmcpXG4gIGNvbnN0IG1ldGFkYXRhRGlzcGxheSA9ICgoKSA9PiB7XG4gICAgY29uc3Qgc2VsID0gaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiO1xuICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgcmV0dXJuIGVsID8gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSA6IFwiKG5vdCBpbiBET00pXCI7XG4gIH0pKCk7XG4gIGNvbnN0IGgxT2Zmc2V0VG9wID0gKCgpID0+IHtcbiAgICBpZiAoIWgxKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB0b3AgPSAwO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBoMTtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdG9wICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgICAgbm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRvcDtcbiAgfSkoKTtcbiAgLy8gV2hhdCBvY2N1cGllcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgY29udGVudCB0b3AgYW5kIHRoZSBIMT9cbiAgLy8gKGVkaXQpIGZpcnN0IGNoaWxkcmVuIG9mIC5jbS1jb250ZW50LCBhbmQgdGhlIG5ldCBIMSBkaXN0YW5jZVxuICAvLyBmcm9tIHRoZSBjb250ZW50IGFuY2hvciBcdTIwMTQgcmVhZGluZyBoYXMgbm8gc3VjaCBnYXAuXG4gIGNvbnN0IGFuY2hvciA9IGlzRWRpdFxuICAgID8gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIilcbiAgICA6IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiKTtcbiAgY29uc3QgaDFUb3BJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTtcbiAgfSkoKTtcbiAgY29uc3QgaDFMZWZ0SW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KTtcbiAgfSkoKTtcbiAgY29uc3QgY29udGVudENoaWxkcmVuID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhbmNob3IuY2hpbGRyZW4pXG4gICAgICAuc2xpY2UoMCwgNClcbiAgICAgIC5tYXAoKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xzOiAoZWwgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTmFtZSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSxcbiAgICAgICAgICBtYXJnaW5Ub3A6IGNzLm1hcmdpblRvcCxcbiAgICAgICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogY3MubWFyZ2luQm90dG9tLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IGNzLnBhZGRpbmdCb3R0b20sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSkoKTtcbiAgLy8gQ29udGFpbmVyIGNoYWluIHByb2JlOiBmcm9tIC5jbS1jb250ZW50IHVwIHRvIHRoZSB2aWV3LWNvbnRlbnQsXG4gIC8vIGVhY2ggd3JhcHBlcidzIHBhZGRpbmcvbWFyZ2luIFx1MjAxNCBsb2NhdGVzIHRoZSBsZWZ0b3ZlciB2ZXJ0aWNhbFxuICAvLyBvZmZzZXQgYmV0d2VlbiBlZGl0IGFuZCByZWFkaW5nIGNvbnRlbnQgYXJlYXMuXG4gIGNvbnN0IHRvcENoYWluID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJ0czogeyBjbHM6IHN0cmluZzsgcGFkVG9wOiBzdHJpbmc7IG1hclRvcDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBhbmNob3I7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICBjbHM6IG5vZGUuY2xhc3NOYW1lIHx8IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBwYWRUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgIG1hclRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgfSk7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFydHM7XG4gIH0pKCk7XG5cbiAgLy8gVGl0bGUgcHJvYmU6IHRoZSBnZW5lcmF0ZWQgOjpiZWZvcmUgaW4gU2xpZGVzIG1vZGUgKHdoZW4gYSB0aXRsZSBpc1xuICAvLyBjb25maWd1cmVkKS4gQ2FwdHVyZXMgaXRzIGNvbXB1dGVkIHN0eWxlIHNvIHdlIGNhbiBkaWZmIGl0IGFnYWluc3QgdGhlXG4gIC8vIGJvZHkgSDEgKC5jbS1oZWFkZXItMSkgYW5kIGFsaWduIHRoZW0gZXhhY3RseS5cbiAgY29uc3QgdGl0bGVCZWZvcmUgPSAoKCkgPT4ge1xuICAgIGlmICghaXNFZGl0KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgICBpZiAoIWNvbnRlbnQgfHwgIWNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQsIFwiOjpiZWZvcmVcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNzLmNvbnRlbnQsXG4gICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgcG9zaXRpb246IGNzLnBvc2l0aW9uLFxuICAgICAgdG9wOiBjcy50b3AsXG4gICAgICBsZWZ0OiBjcy5sZWZ0LFxuICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgIGZvbnRGYW1pbHk6IGNzLmZvbnRGYW1pbHksXG4gICAgICBmb250U2l6ZTogY3MuZm9udFNpemUsXG4gICAgICBsaW5lSGVpZ2h0OiBjcy5saW5lSGVpZ2h0LFxuICAgICAgZm9udFdlaWdodDogY3MuZm9udFdlaWdodCxcbiAgICAgIGZvbnRWYXJpYW50OiBjcy5mb250VmFyaWFudCxcbiAgICAgIGNvbG9yOiBjcy5jb2xvcixcbiAgICAgIGxldHRlclNwYWNpbmc6IGNzLmxldHRlclNwYWNpbmcsXG4gICAgICB0ZXh0VHJhbnNmb3JtOiBjcy50ZXh0VHJhbnNmb3JtLFxuICAgICAgd29yZFNwYWNpbmc6IGNzLndvcmRTcGFjaW5nLFxuICAgICAgZm9udEtlcm5pbmc6IGNzLmZvbnRLZXJuaW5nLFxuICAgICAgZm9udEZlYXR1cmVTZXR0aW5nczogY3MuZm9udEZlYXR1cmVTZXR0aW5ncyxcbiAgICAgIGZvbnRWYXJpYW50TnVtZXJpYzogY3MuZm9udFZhcmlhbnROdW1lcmljLFxuICAgICAgZm9udFZhcmlhbnRMaWdhdHVyZXM6IGNzLmZvbnRWYXJpYW50TGlnYXR1cmVzLFxuICAgICAgZm9udFZhcmlhbnRDYXBzOiBjcy5mb250VmFyaWFudENhcHMsXG4gICAgfTtcbiAgfSkoKTtcblxuICBjb25zdCBkdW1wID0ge1xuICAgIG1vZGU6IGlzRWRpdCA/IFwiZWRpdCAoTGl2ZSBQcmV2aWV3KVwiIDogXCJyZWFkaW5nXCIsXG4gICAgLy8gU2xpZGVzIHN0eWxpbmcgb25seSBhcHBsaWVzIHdoZW4gU2xpZGVzIG1vZGUgaXMgb25cbiAgICBzbGlkZXNBY3RpdmU6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpLFxuICAgIGRvbVRhZ3M6IGlzRWRpdCA/IGRvbVRhZ3MgOiB1bmRlZmluZWQsXG4gICAgc291cmNlVmlld0NsYXNzOiBpc0VkaXQgPyBzb3VyY2VWaWV3Q2xhc3MgOiB1bmRlZmluZWQsXG4gICAgbGl2ZVByZXZpZXc6IGlzRWRpdCA/IGlzTGl2ZVByZXZpZXcoYXBwKSA6IHVuZGVmaW5lZCxcbiAgICBsaXN0TGluZXM6IGlzRWRpdCA/IGxpc3RMaW5lcyA6IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXk6IG1ldGFkYXRhRGlzcGxheSxcbiAgICBoMU9mZnNldFRvcDogaDFPZmZzZXRUb3AsXG4gICAgaDFUb3BJbkNvbnRlbnQ6IGgxVG9wSW5Db250ZW50LFxuICAgIGgxTGVmdEluQ29udGVudDogaDFMZWZ0SW5Db250ZW50LFxuICAgIGNvbnRlbnRDaGlsZHJlbjogY29udGVudENoaWxkcmVuLFxuICAgIHRvcENoYWluOiB0b3BDaGFpbixcbiAgICB0aXRsZTogdGl0bGVCZWZvcmUsXG4gICAgY29udGFpbmVyOiBzdHlsZShjb250YWluZXIsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1heC13aWR0aFwiLFxuICAgICAgXCJ3aWR0aFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgcGFyYWdyYXBoOiBzdHlsZShwYXJhLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBoMTogc3R5bGUoaDEsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcImZvbnQtd2VpZ2h0XCIsXG4gICAgICBcImZvbnQtdmFyaWFudFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJsZXR0ZXItc3BhY2luZ1wiLFxuICAgICAgXCJ0ZXh0LXRyYW5zZm9ybVwiLFxuICAgICAgXCJ3b3JkLXNwYWNpbmdcIixcbiAgICAgIFwiZm9udC1rZXJuaW5nXCIsXG4gICAgICBcImZvbnQtZmVhdHVyZS1zZXR0aW5nc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbnVtZXJpY1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbGlnYXR1cmVzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1jYXBzXCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgbGlzdEl0ZW06IHN0eWxlKGxpc3RJdGVtLCBbXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGNvZGVCbG9jazogc3R5bGUocHJlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICBibG9ja3F1b3RlOiBzdHlsZShxdW90ZSwgW1xuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwiYm9yZGVyLWxlZnQtd2lkdGhcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgIF0pLFxuICAgIGlubGluZUNvZGU6IHN0eWxlKGlubGluZUNvZGUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIHRhYmxlOiBzdHlsZSh0YWJsZSwgW1wiZm9udC1zaXplXCIsIFwibGluZS1oZWlnaHRcIiwgXCJ3aWR0aFwiLCBcImJvcmRlci1jb2xsYXBzZVwiXSksXG4gICAgaW1hZ2U6IHN0eWxlKGltZywgW1wiZGlzcGxheVwiLCBcIm1hcmdpbi1sZWZ0XCIsIFwibWFyZ2luLXJpZ2h0XCIsIFwibWF4LXdpZHRoXCIsIFwid2lkdGhcIl0pLFxuICAgIGhvcml6b250YWxSdWxlOiBzdHlsZShociwgW1wibWFyZ2luLXRvcFwiLCBcIm1hcmdpbi1ib3R0b21cIiwgXCJib3JkZXItdG9wLXdpZHRoXCIsIFwiaGVpZ2h0XCJdKSxcbiAgICBjc3NWYXJpYWJsZXM6IHtcbiAgICAgIFwiLS1mb250LXRleHRcIjogY3NzVmFyKFwiLS1mb250LXRleHRcIiksXG4gICAgICBcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCI6IGNzc1ZhcihcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCIpLFxuICAgICAgXCItLWgxLXNpemVcIjogY3NzVmFyKFwiLS1oMS1zaXplXCIpLFxuICAgICAgXCItLWgxLWxpbmUtaGVpZ2h0XCI6IGNzc1ZhcihcIi0taDEtbGluZS1oZWlnaHRcIiksXG4gICAgICBcIi0taDEtd2VpZ2h0XCI6IGNzc1ZhcihcIi0taDEtd2VpZ2h0XCIpLFxuICAgICAgXCItLWgxLXZhcmlhbnRcIjogY3NzVmFyKFwiLS1oMS12YXJpYW50XCIpLFxuICAgICAgXCItLWgxLWNvbG9yXCI6IGNzc1ZhcihcIi0taDEtY29sb3JcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLXRvcFwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi10b3BcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLWJvdHRvbVwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi1ib3R0b21cIiksXG4gICAgICBcIi0tcC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tcC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3Qtc3BhY2luZ1wiOiBjc3NWYXIoXCItLWxpc3Qtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LWluZGVudFwiOiBjc3NWYXIoXCItLWxpc3QtaW5kZW50XCIpLFxuICAgICAgXCItLWNvZGUtc2l6ZVwiOiBjc3NWYXIoXCItLWNvZGUtc2l6ZVwiKSxcbiAgICAgIFwiLS1jb2RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1jb2RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tY29kZS1yYWRpdXNcIjogY3NzVmFyKFwiLS1jb2RlLXJhZGl1c1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCIpLFxuICAgICAgXCItLWZpbGUtbWFyZ2luc1wiOiBjc3NWYXIoXCItLWZpbGUtbWFyZ2luc1wiKSxcbiAgICAgIFwiLS1maWxlLWxpbmUtd2lkdGhcIjogY3NzVmFyKFwiLS1maWxlLWxpbmUtd2lkdGhcIiksXG4gICAgICBcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiOiBjc3NWYXIoXCItLW5vcm1hbC1mb250LXNpemVcIiksXG4gICAgICBcIi0tZm9udC10ZXh0LXNpemVcIjogY3NzVmFyKFwiLS1mb250LXRleHQtc2l6ZVwiKSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gZHVtcDtcbn1cblxuLyoqXG4gKiBEZWJ1ZyB0eXBvZ3JhcGh5OiBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgKGVhY2hcbiAqIGNvdmVyaW5nIGEgZ3JvdXAgb2YgZWxlbWVudHMgXHUyMDE0IGFsbCB2aXNpYmxlIHdpdGhvdXQgc2Nyb2xsaW5nKSxcbiAqIHRoZW4gdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldyAobm8gdmlydHVhbGl6YXRpb25cbiAqIHRoZXJlKSwgbWVyZ2VzIGV2ZXJ5dGhpbmcsIGNvbXB1dGVzIHRoZSBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmRcbiAqIHdyaXRlcyBpdCB0byAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LlxuICogVGhlIHVzZXIncyBvd24gbm90ZSBpcyByZXN0b3JlZCBhdCB0aGUgZW5kLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHVtcFR5cG9ncmFwaHkocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYXBwID0gcGx1Z2luLmFwcDtcbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBubyBhY3RpdmUgTWFya2Rvd24gbm90ZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc3RhcnRNb2RlID0gdmlldy5nZXRNb2RlKCk7XG4gIGNvbnN0IGFjdGl2ZUZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgY29uc3QgbGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG5cbiAgLy8gRWRpdCBzaWRlOiBlYWNoIHNob3J0IG5vdGUga2VlcHMgZXZlcnkgdGFyZ2V0IGVsZW1lbnQgb24gc2NyZWVuXG4gIGNvbnN0IGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBTQU1QTEVfTk9URV9OQU1FUykge1xuICAgIGNvbnN0IGYgPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGB0ZXN0cy8ke25hbWV9Lm1kYCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg1MDApO1xuICAgIGNvbnN0IHMgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgICBpZiAocykgbWVyZ2VTYW1wbGUoZWRpdCwgcyk7XG4gIH1cblxuICAvLyBSZWFkaW5nIHNpZGU6IHRoZSBraXRjaGVuLXNpbmsgbm90ZSByZW5kZXJzIGV2ZXJ5dGhpbmcgYXQgb25jZVxuICBsZXQgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZGVtbyA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCJ0ZXN0cy90eXBvZ3JhcGh5LWRlbW8ubWRcIik7XG4gIGlmIChkZW1vIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGRlbW8sIHsgc3RhdGU6IHsgbW9kZTogXCJwcmV2aWV3XCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg4MDApO1xuICAgIHJlYWRpbmcgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgdGhlIHVzZXIncyBub3RlXG4gIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShhY3RpdmVGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IHN0YXJ0TW9kZSB9IH0pO1xuICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cbiAgaWYgKCFyZWFkaW5nKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IHJlYWRpbmcgc2FtcGxlIGZhaWxlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXlsb2FkID0geyBlZGl0LCByZWFkaW5nLCBkaWZmOiBkaWZmRHVtcHMoZWRpdCwgcmVhZGluZykgfTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci53cml0ZShcIi5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb25cIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMikpO1xuICAgIG5ldyBOb3RpY2UoXCJUeXBvZ3JhcGh5IGR1bXAgXHUyMTkyIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gKHZhdWx0IHJvb3QpXCIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCB3cml0ZSBkZWJ1ZyBmaWxlICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG5cbi8qKiBSZWdpc3RlciB0aGUgZGV2LW9ubHkgZGVidWcgY29tbWFuZCAoY2FsbGVkIG9ubHkgd2hlbiBERVZfTU9ERSBpcyB0cnVlKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtZGVidWctc3R5bGVzXCIsXG4gICAgbmFtZTogXCJEZWJ1ZzogZHVtcCB0eXBvZ3JhcGh5IHN0eWxlc1wiLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbiksXG4gIH0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTW9kZSBvZiB0aGUgYWN0aXZlIE1hcmtkb3duIHZpZXc6ICdwcmV2aWV3Jz1yZWFkaW5nICdzb3VyY2UnPWVkaXRpbmcgJyc9bm9uZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRNb2RlKGFwcDogQXBwKTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiIHwgXCJcIiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgcmV0dXJuIHZpZXcgPyB2aWV3LmdldE1vZGUoKSA6IFwiXCI7XG59XG5cbi8qKlxuICogVHJ1ZSB3aGVuIHRoZSBhY3RpdmUgZWRpdCB2aWV3IGlzIExpdmUgUHJldmlldyAoU2xpZGVzKSBcdTIwMTQgYXNcbiAqIG9wcG9zZWQgdG8gU291cmNlIG1vZGUuIE9ic2lkaWFuIHJlcG9ydHMgYm90aCBhcyBtb2RlIFwic291cmNlXCI7XG4gKiB0aGUgdmlldyBzdGF0ZSBjYXJyaWVzIGEgYHNvdXJjZWAgZmxhZyAoU291cmNlIG1vZGUgPSB0cnVlKSwgd2l0aFxuICogYSBET00gY2xhc3MgZmFsbGJhY2sgKC5pcy1saXZlLXByZXZpZXcpIGZvciBzYWZldHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xpdmVQcmV2aWV3KGFwcDogQXBwKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSBcInNvdXJjZVwiKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN0YXRlID0gdmlldy5nZXRTdGF0ZSgpIGFzIHsgc291cmNlPzogYm9vbGVhbiB9O1xuICBpZiAoc3RhdGUuc291cmNlID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IGZhbHNlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICEhdmlldy5jb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202LmlzLWxpdmUtcHJldmlld1wiKTtcbn1cblxuLyoqIEZyb250bWF0dGVyIG9mIGFueSBub3RlIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb250bWF0dGVyT2YoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIHJldHVybiBjYWNoZT8uZnJvbnRtYXR0ZXIgPz8gbnVsbDtcbn1cblxuLyoqIEN1cnJlbnQgbm90ZSdzIGZyb250bWF0dGVyIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2ZUZyb250bWF0dGVyKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgZmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICByZXR1cm4gZmlsZSA/IGZyb250bWF0dGVyT2YoYXBwLCBmaWxlKSA6IG51bGw7XG59XG4iLCAiLyoqIEEgYnVpbHQtaW4gU2xpZGVzIHN0eWxlIHRlbXBsYXRlIChyZW5kZXJlZCBhcyBib2R5IGNsYXNzIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gKSAqL1xuZXhwb3J0IGludGVyZmFjZSBTbGlkZXNUaGVtZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbi8qKiBCdWlsdC1pbiBzdHlsZSB0ZW1wbGF0ZXMgZm9yIHRoZSBTbGlkZXMgY2FyZCArIGJhciAoYWxsIHRoZW1lLWFkYXB0aXZlKSAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19USEVNRVM6IHJlYWRvbmx5IFNsaWRlc1RoZW1lW10gPSBbXG4gIHsgaWQ6IFwianl5XCIsIGxhYmVsOiBcIkxlY3R1cmUgKGp5eSlcIiB9LFxuICB7IGlkOiBcImRhc2hlZFwiLCBsYWJlbDogXCJEYXNoZWQgb3V0bGluZVwiIH0sXG4gIHsgaWQ6IFwicGFwZXJcIiwgbGFiZWw6IFwiUGFwZXIgY2FyZFwiIH0sXG4gIHsgaWQ6IFwibWluaW1hbFwiLCBsYWJlbDogXCJNaW5pbWFsXCIgfSxcbiAgeyBpZDogXCJhY2NlbnRcIiwgbGFiZWw6IFwiQWNjZW50IGVkZ2VcIiB9LFxuICB7IGlkOiBcImdsYXNzXCIsIGxhYmVsOiBcIkZyb3N0ZWQgZ2xhc3NcIiB9LFxuXTtcblxuLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB7XG4gIC8qKiBTaG93IFx1MjVDMCBcdTI1QjYgcHJldmlvdXMvbmV4dCBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dOYXZCdXR0b25zOiBib29sZWFuO1xuICAvKiogUGFnZSBudW1iZXIgZGlzcGxheSBzdHlsZTogXCJmcmFjdGlvblwiID0gTiAvIFRvdGFsLCBcImN1cnJlbnRcIiA9IE4sIFwibm9uZVwiID0gaGlkZGVuICovXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgLyoqIFNob3cgYSB0aGluIGNsaWNrYWJsZSBwcm9ncmVzcyBsaW5lIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd1Byb2dyZXNzOiBib29sZWFuO1xuICAvKiogU2hvdyB0aGUgZW50aXJlIHNsaWRlcyBiYXIgKG1hc3RlciB0b2dnbGUpICovXG4gIHNob3dTbGlkZXNCYXI6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIG1hbnVhbGx5IGhpZCB0aGUgc2xpZGVzIGJhciAodG9nZ2xlIGNvbW1hbmQpICovXG4gIGJhckhpZGRlbjogYm9vbGVhbjtcbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgd2hlbiBvcGVuaW5nIGEgZGVjayBub3RlIChkZWZhdWx0IG9mZikgKi9cbiAgYXV0b0VudGVyU2xpZGVzOiBib29sZWFuO1xuICAvKiogUHJlc3MgRXNjYXBlIHRvIGV4aXQgU2xpZGVzIG1vZGUgKGRlZmF1bHQgb24pICovXG4gIGVzY0V4aXRzU2xpZGVzOiBib29sZWFuO1xuICAvKiogRnJvbnRtYXR0ZXIgcHJvcGVydHkgc2hvd24gYXMgdGhlIGNhcmQgdGl0bGUgKFwiXCIgPSBub25lLCBcImZpbGVuYW1lXCIgPSBmaWxlIG5hbWUpICovXG4gIHNsaWRlc1RpdGxlOiBzdHJpbmc7XG4gIC8qKiBTdHlsZSB0ZW1wbGF0ZSBpZCBmcm9tIFNMSURFU19USEVNRVMgKGNhcmQgKyBiYXIgYXBwZWFyYW5jZSkgKi9cbiAgc2xpZGVzVGhlbWU6IHN0cmluZztcbiAgLyoqIENvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyBmb3IgdGhlIHNsaWRlcyBiYXIgKGVtcHR5ID0gbm9uZSkgKi9cbiAgYmFyUHJvcGVydGllczogc3RyaW5nO1xuICAvKiogSlNPTiBhcnJheSBvZiBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIGJhciBwcm9wZXJ0aWVzIChkcmFnZ2FibGUgZGl2aWRlcnMpICovXG4gIGJhclByb3BlcnR5V2lkdGhzOiBzdHJpbmc7XG4gIC8qKiBBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHBhbmVsIChkZWZhdWx0IG9uKSAqL1xuICBjb25maXJtRGVsZXRlU2xpZGVzOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7XG4gIHNob3dOYXZCdXR0b25zOiB0cnVlLFxuICBwYWdlTnVtYmVyU3R5bGU6IFwibm9uZVwiLFxuICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gIHNob3dTbGlkZXNCYXI6IHRydWUsXG4gIGJhckhpZGRlbjogZmFsc2UsXG4gIGF1dG9FbnRlclNsaWRlczogZmFsc2UsXG4gIGVzY0V4aXRzU2xpZGVzOiB0cnVlLFxuICBzbGlkZXNUaXRsZTogXCJcIixcbiAgc2xpZGVzVGhlbWU6IFwianl5XCIsXG4gIGJhclByb3BlcnRpZXM6IFwiXCIsXG4gIGJhclByb3BlcnR5V2lkdGhzOiBcIlwiLFxuICBjb25maXJtRGVsZXRlU2xpZGVzOiB0cnVlLFxufTtcblxuLyoqIFJlc2VydmVkIGZyb250bWF0dGVyIGtleSBkcml2aW5nIGRlY2sgbmF2aWdhdGlvbiAobmV2ZXIgcmVuZGVyZWQgYXMgYSBjaGlwKSAqL1xuZXhwb3J0IGNvbnN0IERFQ0tfS0VZID0gXCJkZWNrXCI7XG4iLCAiaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyByZWdpc3RlckRlYnVnQ29tbWFuZCB9IGZyb20gXCIuL2RlYnVnXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKiogUmVnaXN0ZXIgZXZlcnkgY29tbWFuZDsgdGhlIGRlYnVnIGNvbW1hbmQgaXMgZGV2LWJ1aWxkIG9ubHkuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21tYW5kcyhwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICAvLyBUb2dnbGUgdGhlIHNsaWRlcyBiYXIgKHdpdGhpbiBTbGlkZXMgbW9kZSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1iYXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgYmFyXCIsXG4gICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgIHBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW4gPSAhcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gICAgfSxcbiAgfSk7XG4gIC8vIFNob3cgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1zaG93LXBhbmVsXCIsXG4gICAgbmFtZTogXCJTaG93IHNsaWRlcyBwYW5lbFwiLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIHBsdWdpbi5hY3RpdmF0ZVNsaWRlc1BhbmVsKCksXG4gIH0pO1xuICAvLyBIaWRlIC8gc2hvdyB0aGUgbW91c2UgcG9pbnRlciB3aW5kb3ctd2lkZSAocHJlc2VudGluZzsgU2xpZGVzIG1vZGUgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1wb2ludGVyXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgbW91c2UgcG9pbnRlclwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJNXCIgfV0sXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSBwbHVnaW4udG9nZ2xlUG9pbnRlcigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIFByZXZpb3VzIC8gbmV4dCBwYWdlIChkZWNrIG5hdmlnYXRpb247IGVudGVyaW5nIFNsaWRlcyBtb2RlIGFzIG5lZWRlZClcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXByZXZcIixcbiAgICBuYW1lOiBcIlByZXZpb3VzIHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dMZWZ0XCIgfV0sXG4gICAgY2FsbGJhY2s6ICgpID0+IHBsdWdpbi5uYXZpZ2F0ZShcInByZXZcIiksXG4gIH0pO1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtbmV4dFwiLFxuICAgIG5hbWU6IFwiTmV4dCBwYWdlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkFycm93UmlnaHRcIiB9XSxcbiAgICBjYWxsYmFjazogKCkgPT4gcGx1Z2luLm5hdmlnYXRlKFwibmV4dFwiKSxcbiAgfSk7XG4gIC8vIENyZWF0ZSBOZXh0IFNsaWRlIFx1MjAxNCBuZXcgc2xpZGUgYWZ0ZXIgdGhlIGN1cnJlbnQgb25lIChkZWNrIG5vdGVzIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jcmVhdGUtbmV4dFwiLFxuICAgIG5hbWU6IFwiQ3JlYXRlIG5leHQgc2xpZGVcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTlwiIH1dLFxuICAgIC8vIEdyZXllZCBvdXQgdW5sZXNzIHRoZSBhY3RpdmUgbm90ZSBpcyBwYXJ0IG9mIGEgZGVjayBcdTIwMTQgcGxhaW4gbm90ZXNcbiAgICAvLyBzdGFydCBkZWNrcyB3aXRoIFwiQ3JlYXRlIG5ldyBzbGlkZVwiIGluc3RlYWQuXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlIHx8ICFwbHVnaW4uZGVja1NlcnZpY2UuaXNNZW1iZXIoZmlsZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IHBsYW4gPSBwbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5leHQoZmlsZSk7XG4gICAgICBpZiAoIXBsYW4pIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHZvaWQgcGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXh0KGZpbGUsIHBsYW4pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIENyZWF0ZSBOZXcgU2xpZGUgXHUyMDE0IGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIChub24tZGVjayBub3RlcyBvbmx5O1xuICAvLyBhbHNvIHdvcmtzIGZyb20gYSBibGFuayB0YWIgXHUyMDE0IGxhbmRzIGluIHRoZSBkZWZhdWx0IG5ldy1ub3RlIGxvY2F0aW9uKVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5ld1wiLFxuICAgIG5hbWU6IFwiQ3JlYXRlIG5ldyBzbGlkZVwiLFxuICAgIC8vIE5vIGRlZmF1bHQgaG90a2V5OiBNb2QrU2hpZnQrTiBiZWxvbmdzIHRvIENyZWF0ZSBuZXh0IHNsaWRlIFx1MjAxNCB0d29cbiAgICAvLyBjb21tYW5kcyBzaGFyaW5nIG9uZSBkZWZhdWx0IGhvdGtleSB0cmlwcyBPYnNpZGlhbidzIGNvbmZsaWN0IFVJLlxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIHBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlQ3JlYXRlTmV3KHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV3KCkpLFxuICB9KTtcbiAgLy8gVG9nZ2xlIFNsaWRlcyBtb2RlIFx1MjAxNCB0aGUgaW1tZXJzaXZlIGNhcmQgdmlldyAoZGVjayBub3RlcyBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLXNsaWRlc1wiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIHNsaWRlcyBtb2RlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkVcIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZihwbHVnaW4uYXBwLCBmaWxlKTtcbiAgICAgIGlmIChmbSA9PT0gbnVsbCB8fCAhKERFQ0tfS0VZIGluIGZtKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVNsaWRlcygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIERlYnVnIHRvb2xpbmcgXHUyMDE0IHJlZ2lzdGVyZWQgb25seSBpbiBkZXYgYnVpbGRzICh0cmVlLXNoYWtlbiBpbiByZWxlYXNlKVxuICBpZiAoREVWX01PREUpIHJlZ2lzdGVyRGVidWdDb21tYW5kKHBsdWdpbik7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQge1xuICBwbGFuQ3JlYXRlTmV3IGFzIHBsYW5OZXcsXG4gIHBsYW5DcmVhdGVOZXh0IGFzIHBsYW4sXG4gIHR5cGUgQ3JlYXRlTmV4dFJlc3VsdCxcbn0gZnJvbSBcIi4vY3JlYXRlTmV4dFwiO1xuaW1wb3J0IHsgY29tcHV0ZURlY2ssIGV4dHJhY3RMaW5rcywgZXh0cmFjdFJhd0xpbmtzLCB0eXBlIERlY2tJbmZvIH0gZnJvbSBcIi4vZGVja1wiO1xuaW1wb3J0IHsgcGlja0xhbmRpbmdQYXRoLCBwbGFuRGVsZXRlU2xpZGVzIH0gZnJvbSBcIi4vZGVsZXRlU2xpZGVzXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKiogUmVzdWx0IG9mIGEgRGVsZXRlIHNsaWRlcyBydW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlU2xpZGVzUmVzdWx0IHtcbiAgLyoqIFBhdGhzIGFjdHVhbGx5IG1vdmVkIHRvIHRoZSB0cmFzaCAqL1xuICB0cmFzaGVkOiBzdHJpbmdbXTtcbiAgLyoqIFdoZXJlIHRoZSBlZGl0b3Igc2hvdWxkIGxhbmQgYWZ0ZXJ3YXJkcyAobnVsbCA9IGtlZXAgY3VycmVudCBub3RlKSAqL1xuICBsYW5kaW5nUGF0aDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqIERlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiBnbHVlICh3cmFwcyB0aGUgcHVyZSBjb3JlKS4gKi9cbmV4cG9ydCBjbGFzcyBEZWNrU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIG5vdGUgYmVsb25ncyB0byBhIGRlY2s6IGl0IGhvbGRzIGEgYGRlY2tgIHByb3BlcnR5IChldmVuXG4gICAqIGVtcHR5IFx1MjAxNCBhIGZyZXNoIHNpbmdsZSBzbGlkZSkgb3Igc29tZSBvdGhlciBzbGlkZSBkZWNsYXJlcyBpdCBhcyBpdHNcbiAgICogbmV4dCBzbGlkZS5cbiAgICovXG4gIGlzTWVtYmVyKGZpbGU6IFRGaWxlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICByZXR1cm4gKGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtKSB8fCB0aGlzLnByZXZPZihmaWxlLnBhdGgpICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogUmVzb2x2ZSB0aGUgY3VycmVudCBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrIChudWxsIHdoZW4gbm90IGEgbWVtYmVyKSAqL1xuICBjb21wdXRlKGZpbGU6IFRGaWxlKTogRGVja0luZm8gfCBudWxsIHtcbiAgICBpZiAoIXRoaXMuaXNNZW1iZXIoZmlsZSkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBjb21wdXRlRGVjayhcbiAgICAgIGZpbGUucGF0aCxcbiAgICAgIChwYXRoKSA9PiB0aGlzLmxpbmtQYXRocyhwYXRoKSxcbiAgICAgIChwYXRoKSA9PiB0aGlzLnByZXZPZihwYXRoKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIFJlc29sdmUgdGhlIGBkZWNrYCBwcm9wZXJ0eSBvZiBhIG5vdGUgaW50byByZWFsIG5vdGUgcGF0aHMgKG1heCBvbmUpICovXG4gIHByaXZhdGUgbGlua1BhdGhzKHBhdGg6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybiBbXTtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGYpO1xuICAgIGNvbnN0IG5hbWVzID0gZm0gPyBleHRyYWN0TGlua3MoZm1bREVDS19LRVldKSA6IFtdO1xuICAgIHJldHVybiBuYW1lc1xuICAgICAgLm1hcCgobmFtZSkgPT4gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBwYXRoKSlcbiAgICAgIC5maWx0ZXIoKHgpOiB4IGlzIFRGaWxlID0+ICEheClcbiAgICAgIC5tYXAoKHgpID0+IHgucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IHBvaW50cyBhdCBgcGF0aGAgKHRoZSBwcmV2aW91cyBzbGlkZSBpblxuICAgKiB0aGUgY2hhaW4pLiBXaXRoIG5leHQtb25seSBzZW1hbnRpY3MgdGhpcyBiYWNrd2FyZCBsb29rdXAgaXMgdGhlIG9ubHlcbiAgICogd2F5IHRvIHJlYWNoIHRoZSBjaGFpbiBoZWFkIGZyb20gYSBtaWRkbGUvbGFzdCBzbGlkZS5cbiAgICovXG4gIHByaXZhdGUgcHJldk9mKHBhdGg6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKSkge1xuICAgICAgaWYgKGYucGF0aCA9PT0gcGF0aCkgY29udGludWU7XG4gICAgICBpZiAodGhpcy5saW5rUGF0aHMoZi5wYXRoKVswXSA9PT0gcGF0aCkgcmV0dXJuIGYucGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBOYW1lcyBpbiB0aGUgYGRlY2tgIHByb3BlcnR5IHRoYXQgcmVzb2x2ZSB0byBubyBub3RlIChicm9rZW4gbGlua3MpICovXG4gIGJyb2tlbihmaWxlOiBURmlsZSk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IG5hbWVzID0gZm0gPyBleHRyYWN0TGlua3MoZm1bREVDS19LRVldKSA6IFtdO1xuICAgIHJldHVybiBuYW1lcy5maWx0ZXIoKG5hbWUpID0+ICF0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KG5hbWUsIGZpbGUucGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYW4gYSBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgcnVuIGZvciB0aGUgYWN0aXZlIG5vdGUuIERlY2sgc2xpZGVzXG4gICAqIGluc2VydC9hcHBlbmQgYWZ0ZXIgdGhlIGN1cnJlbnQgbm90ZS4gKFBsYWluIG5vdGVzIGFyZSByb3V0ZWQgdG9cbiAgICogcGxhbkNyZWF0ZU5ldyBieSB0aGUgY29tbWFuZCBcdTIwMTQgdGhpcyBjb3JlIHN0aWxsIGhhbmRsZXMgdGhlbSBhc1xuICAgKiBcIm5vIHVzYWJsZSBuZXh0IGxpbmsgXHUyMTkyIGFwcGVuZFwiLilcbiAgICovXG4gIHBsYW5DcmVhdGVOZXh0KGZpbGU6IFRGaWxlKTogQ3JlYXRlTmV4dFJlc3VsdCB8IG51bGwge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgY29uc3QgcmF3ID0gZm0gPyBleHRyYWN0UmF3TGlua3MoZm1bREVDS19LRVldKSA6IFtdO1xuICAgIGNvbnN0IGV4aXN0aW5nTmFtZXMgPSBuZXcgU2V0KHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKS5tYXAoKGYpID0+IGYuYmFzZW5hbWUpKTtcbiAgICByZXR1cm4gcGxhbih7IGN1cnJlbnROYW1lOiBmaWxlLmJhc2VuYW1lLCBjdXJyZW50TGlua3M6IHJhdywgZXhpc3RpbmdOYW1lcyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV3IFNsaWRlXCIgcnVuOiBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZSBpbiB0aGVcbiAgICogc2FtZSBmb2xkZXIgYXMgdGhlIGFjdGl2ZSBub3RlLCB3aGljaCBpdHNlbGYgc3RheXMgdW50b3VjaGVkLlxuICAgKi9cbiAgcGxhbkNyZWF0ZU5ldygpOiBDcmVhdGVOZXh0UmVzdWx0IHtcbiAgICBjb25zdCBleGlzdGluZ05hbWVzID0gbmV3IFNldCh0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkubWFwKChmKSA9PiBmLmJhc2VuYW1lKSk7XG4gICAgcmV0dXJuIHBsYW5OZXcoeyBleGlzdGluZ05hbWVzIH0pO1xuICB9XG5cbiAgLyoqIEFwcGx5IGEgQ3JlYXRlIE5leHQgU2xpZGUgcGxhbjsgb3Blbj1mYWxzZSBrZWVwcyB0aGUgY3VycmVudCBub3RlIGluIHRoZSBlZGl0b3IgKi9cbiAgYXN5bmMgZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZTogVEZpbGUsIHBsYW46IENyZWF0ZU5leHRSZXN1bHQsIG9wZW4gPSB0cnVlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5hcHBseVBsYW4oZmlsZSwgcGxhbiwgZGlyUHJlZml4KGZpbGUucGFyZW50Py5wYXRoKSwgb3Blbik7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYSBDcmVhdGUgTmV3IFNsaWRlIHBsYW4uIExhbmRzIGluIE9ic2lkaWFuJ3MgZGVmYXVsdCBuZXctbm90ZVxuICAgKiBsb2NhdGlvbiAoU2V0dGluZ3MgXHUyMTkyIEZpbGVzICYgbGlua3MgXHUyMTkyIERlZmF1bHQgbG9jYXRpb24gZm9yIG5ldyBub3Rlcyk7XG4gICAqIHdpdGggXCJzYW1lIGZvbGRlciBhcyBjdXJyZW50XCIgY29uZmlndXJlZCB0aGF0IGlzIHRoZSBhY3RpdmUgbm90ZSdzIG93blxuICAgKiBmb2xkZXIuIFdvcmtzIHdpdGggbm8gbm90ZSBvcGVuIGF0IGFsbCAoYmxhbmsgdGFiKS5cbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVDcmVhdGVOZXcocGxhbjogQ3JlYXRlTmV4dFJlc3VsdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNvdXJjZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IFwiXCI7XG4gICAgYXdhaXQgdGhpcy5hcHBseVBsYW4oXG4gICAgICBudWxsLFxuICAgICAgcGxhbixcbiAgICAgIGRpclByZWZpeCh0aGlzLmFwcC5maWxlTWFuYWdlci5nZXROZXdGaWxlUGFyZW50KHNvdXJjZVBhdGgpPy5wYXRoKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIEFwcGx5IGEgcGxhbjogY3JlYXRlIHRoZSBub3RlLCByZXdpcmUgYGRlY2tgIHByb3BlcnRpZXMsIG9wdGlvbmFsbHkgb3BlbiBpdCAqL1xuICBwcml2YXRlIGFzeW5jIGFwcGx5UGxhbihcbiAgICBmaWxlOiBURmlsZSB8IG51bGwsXG4gICAgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCxcbiAgICBkaXI6IHN0cmluZyxcbiAgICBvcGVuID0gdHJ1ZSxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGAke2Rpcn0ke3BsYW4ubmV3TmFtZX0ubWRgO1xuICAgIGNvbnN0IGZyb250bWF0dGVyID0gcGxhbi5uZXdEZWNrTGlua3MubWFwKChsaW5rKSA9PiBKU09OLnN0cmluZ2lmeShsaW5rKSkuam9pbihcIiwgXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgLS0tXFxuZGVjazogWyR7ZnJvbnRtYXR0ZXJ9XVxcbi0tLVxcbmA7XG5cbiAgICBsZXQgbmV3RmlsZTogVEZpbGU7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUobmV3UGF0aCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBjcmVhdGUgXCIke3BsYW4ubmV3TmFtZX0ubWRcIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXdpcmUgdGhlIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCAoa2VlcHMgYWxsIG90aGVyIHByb3BlcnRpZXMgaW50YWN0KVxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiBwbGFuLnJld3JpdGVzKSB7XG4gICAgICBpZiAoIWZpbGUgfHwgcmV3cml0ZS5uYW1lICE9PSBmaWxlLmJhc2VuYW1lKSBjb250aW51ZTsgLy8gaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGVcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IHJld3JpdGUuZGVjaztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghb3BlbikgcmV0dXJuO1xuXG4gICAgLy8gT3BlbiB0aGUgbmV3IG5vdGUgaW4gdGhlIGN1cnJlbnQgcGFuZSwgZWRpdCBtb2RlIChMaXZlIFByZXZpZXcpXG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5ld0ZpbGUsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzbGlkZXMgb3V0IG9mIGFuIG9yZGVyZWQgZGVjayBjaGFpbjogc3BsaWNlIHRoZSBjaGFpbiBhcm91bmRcbiAgICogZXZlcnkgZGVsZXRlZCBydW4gKHRoZSBwcmVkZWNlc3NvcidzIGBkZWNrYCB0YWtlcyBvdmVyIHRoZSBydW4ncyBmaXJzdFxuICAgKiBzdXJ2aXZvciksIHRoZW4gbW92ZSBlYWNoIGRlbGV0ZWQgbm90ZSB0byB0aGUgdHJhc2guIGBmb2N1c1BhdGhgIGlzIHRoZVxuICAgKiBub3RlIHRoZSBlZGl0b3IgY3VycmVudGx5IHNob3dzIFx1MjAxNCB3aGVuIGl0IGlzIGFtb25nIHRoZSBkZWxldGVkLCB0aGVcbiAgICogcmVzdWx0IG5hbWVzIHRoZSBuZWFyZXN0IHN1cnZpdmluZyBuZWlnaGJvdXIgdG8gb3BlbiBpbnN0ZWFkLlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICBjaGFpbjogc3RyaW5nW10sXG4gICAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gICAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuICApOiBQcm9taXNlPERlbGV0ZVNsaWRlc1Jlc3VsdD4ge1xuICAgIGNvbnN0IHJld3JpdGVzID0gcGxhbkRlbGV0ZVNsaWRlcyhjaGFpbiwgZGVsZXRlUGF0aHMpO1xuXG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHJld3JpdGVzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUucGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG5leHQgPSByZXdyaXRlLm5leHRQYXRoID8gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUubmV4dFBhdGgpIDogbnVsbDtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IG5leHQgaW5zdGFuY2VvZiBURmlsZSA/IFtgW1ske25leHQuYmFzZW5hbWV9XV1gXSA6IFtdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhc2hlZDogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgZGVsZXRlUGF0aHMpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnRyYXNoRmlsZShmKTtcbiAgICAgICAgdHJhc2hlZC5wdXNoKHBhdGgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IGRlbGV0ZSBcIiR7Zi5iYXNlbmFtZX1cIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0cmFzaGVkLCBsYW5kaW5nUGF0aDogcGlja0xhbmRpbmdQYXRoKGNoYWluLCBkZWxldGVQYXRocywgZm9jdXNQYXRoKSB9O1xuICB9XG59XG5cbi8qKiBGb2xkZXIgcGF0aCBcdTIxOTIgdHJhaWxpbmctc2xhc2ggcHJlZml4IChcIlwiIGZvciB2YXVsdCByb290KSAqL1xuZnVuY3Rpb24gZGlyUHJlZml4KHBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghcGF0aCB8fCBwYXRoID09PSBcIi9cIikgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBgJHtwYXRoLnJlcGxhY2UoL1xcLyskLywgXCJcIil9L2A7XG59XG4iLCAiLyoqXG4gKiBkZWNrLnRzIFx1MjAxNCBQdXJlIGRlY2stcmVzb2x1dGlvbiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9kZWNrLnRlc3QudHMpLiBtYWluLnRzIGFkYXB0cyB0aGVcbiAqIHZhdWx0IChtZXRhZGF0YUNhY2hlKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlOiBpdCByZXNvbHZlcyBgZGVja2BcbiAqIHByb3BlcnRpZXMgdG8gbm90ZSBwYXRocywgdGhlbiBoYW5kcyB0aGUgcGF0aCBncmFwaCB0byBjb21wdXRlRGVjaygpLlxuICovXG5cbi8qKiBBIGRlY2sgbGluayBsaXN0IGhvbGRzIGF0IG1vc3Qgb25lIGVudHJ5ICh0aGUgbmV4dCBzbGlkZSkgKi9cbmV4cG9ydCBjb25zdCBNQVhfREVDS19MSU5LUyA9IDE7XG5cbi8qKiBSZXN1bHQgb2YgcmVzb2x2aW5nIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBhIGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja0luZm8ge1xuICAvKiogQ2hhaW4gb2Ygbm90ZSBwYXRoczogWzBdIGlzIHRoZSBmaXJzdCBzbGlkZSwgdGhlbiB0aGUgcmVzdCBpbiBvcmRlciAqL1xuICBjaGFpbjogc3RyaW5nW107XG4gIC8qKiBJbmRleCBvZiB0aGUgY3VycmVudCBub3RlIGluc2lkZSBjaGFpbiAqL1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6XG4gKiAgIC0gYSBzbGlkZSdzIGBkZWNrYCBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rOiB0aGUgbmV4dCBzbGlkZVxuICogICAgICh0aGUgbGFzdCBzbGlkZSBoYXMgbm8gbGluayBhdCBhbGwpO1xuICogICAtIGEgZGVjayBpcyBzaW1wbHkgYSBmb3J3YXJkIGxpbmsgY2hhaW4gc3RhcnRpbmcgYXQgaXRzIGhlYWQgc2xpZGU7XG4gKiAgIC0gYW55IG5vdGUgdGhhdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlbiBlbXB0eSkgaXMgYSBkZWNrIG1lbWJlcixcbiAqICAgICBzbyBhIHNpbmdsZSBmcmVzaGx5IGNyZWF0ZWQgc2xpZGUgYWxyZWFkeSBjb3VudHMgYXMgYSBvbmUtcGFnZSBkZWNrLlxuICpcbiAqIEJlY2F1c2Ugc2xpZGVzIG5vIGxvbmdlciBsaW5rIGJhY2sgdG8gYSBoZWFkIG5vdGUsIHRoZSBjaGFpbiBoZWFkIGlzXG4gKiBsb2NhdGVkIGJ5IHdhbGtpbmcgYmFja3dhcmQ6IGBnZXRQcmV2KHBhdGgpYCByZXR1cm5zIHRoZSBub3RlIHdob3NlXG4gKiBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodW5kZWZpbmVkIHdoZW4gbm9uZSkuXG4gKlxuICogYGdldExpbmtzKHBhdGgpYCBtdXN0IHJldHVybiB0aGUgcmVzb2x2ZWQgbm90ZSBwYXRocyBvZiB0aGUgYGRlY2tgXG4gKiBwcm9wZXJ0eSBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKGVtcHR5IHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUsIG9yIGl0c1xuICogbGluayBpcyBicm9rZW4gXHUyMDE0IGEgYnJva2VuIGxpbmsgc2ltcGx5IGVuZHMgdGhlIGNoYWluLCBuZXZlciBjcmFzaGVzKS5cbiAqXG4gKiBSZXR1cm5zIHRoZSBmdWxsIGNoYWluIGFuZCB0aGUgY3VycmVudCBub3RlJ3MgaW5kZXgsIG9yIG51bGwgd2hlbiB0aGVcbiAqIG5vdGUgaXMgbm90IHBhcnQgb2YgYW55IGRlY2sgKG5vIGBkZWNrYCBwcm9wZXJ0eSBhbmQgbm9ib2R5IGxpbmtzIHRvIGl0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVEZWNrKFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuICBnZXRMaW5rczogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW10sXG4gIGdldFByZXY6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIC8vIFdhbGsgYmFja3dhcmQgdG8gdGhlIGNoYWluIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLiBBIGxvbmUgbm9kZSAobm8gb3duXG4gIC8vIGxpbmssIG5vIHByZWRlY2Vzc29yKSByZXNvbHZlcyBhcyBhIG9uZS1wYWdlIGNoYWluIFx1MjAxNCB3aGV0aGVyIGl0IGNvdW50c1xuICAvLyBhcyBhIGRlY2sgbWVtYmVyIGF0IGFsbCBpcyBkZWNpZGVkIGJ5IHRoZSBhZGFwdGVyICh0aGUgYGRlY2tgIGtleSkuXG4gIGNvbnN0IGJhY2tWaXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KFtjdXJyZW50UGF0aF0pO1xuICBsZXQgaGVhZCA9IGN1cnJlbnRQYXRoO1xuICBmb3IgKDs7KSB7XG4gICAgY29uc3QgcHJldiA9IGdldFByZXYoaGVhZCk7XG4gICAgaWYgKCFwcmV2IHx8IGJhY2tWaXNpdGVkLmhhcyhwcmV2KSkgYnJlYWs7XG4gICAgYmFja1Zpc2l0ZWQuYWRkKHByZXYpO1xuICAgIGhlYWQgPSBwcmV2O1xuICB9XG5cbiAgLy8gV2FsayBmb3J3YXJkIGZyb20gdGhlIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgY3VyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBoZWFkO1xuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyKTtcbiAgICBjaGFpbi5wdXNoKGN1cik7XG4gICAgY3VyID0gZ2V0TGlua3MoY3VyKVswXTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIG5vdGUgbmFtZXMgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEFjY2VwdHMgYSBzaW5nbGUgc3RyaW5nIG9yIGEgWUFNTCBsaXN0IG9mIHN0cmluZ3M7IHVucXVvdGVkIFtbeF1dIHZhbHVlc1xuICogYXJlIHBhcnNlZCBieSBZQU1MIGFzIG5lc3RlZCBhcnJheXMgYW5kIGZsYXR0ZW5lZCBoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgY29uc3QgbmFtZSA9IGV4dHJhY3RMaW5rVGV4dChpdGVtKTtcbiAgICBpZiAobmFtZSkgb3V0LnB1c2gobmFtZSk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgcmF3IGxpbmsgc3RyaW5ncyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlIFx1MjAxNCB0aGVcbiAqIHRyaW1tZWQgdmFsdWVzIGV4YWN0bHkgYXMgd3JpdHRlbiAoYWxpYXMgLyBwYXRoIGZvcm1zIHByZXNlcnZlZCkuIFNhbWVcbiAqIGZsYXR0ZW5pbmcgcnVsZXMgYXMgZXh0cmFjdExpbmtzKCksIGJ1dCB3aXRob3V0IGV4dHJhY3RpbmcgdGhlIHRhcmdldCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFJhd0xpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSBcInN0cmluZ1wiKSBjb250aW51ZTtcbiAgICBjb25zdCB0cmltbWVkID0gaXRlbS50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh0cmltbWVkKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgdGFyZ2V0IG5vdGUgbmFtZSBmcm9tIGEgbWFya2Rvd24gbGluayBzdHJpbmcuXG4gKiBIYW5kbGVzIHNldmVyYWwgc2hhcGVzOlxuICogICBcIltbc2xpZGUtMl1dXCIgICAgICAgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yfGFsaWFzXV1cIiAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTIjc2VjdGlvbl1dXCJcdTIxOTIgc2xpZGUtMlxuICogICBzbGlkZS0yICAgICAgICAgICAgICBcdTIxOTIgc2xpZGUtMiAoYmFyZSBmaWxlbmFtZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rVGV4dCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHRyaW1tZWQucmVwbGFjZSgvXlxcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0uc3BsaXQoXCIjXCIpWzBdLnRyaW0oKTtcbn1cblxuLyoqIFJlbmRlciBhIHByb3BlcnR5IHZhbHVlIGFzIHJlYWRhYmxlIHRleHQ6IGFycmF5cy9vYmplY3RzIFx1MjE5MiBKU09OLCBlbHNlIFN0cmluZyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBcIlx1MjAxNFwiO1xuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpID8/IFwiXHUyMDE0XCI7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gY2lyY3VsYXIgLyB1bi1zdHJpbmdpZmlhYmxlIHN0cnVjdHVyZSBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgICAgcmV0dXJuIFwiXHUyMDE0XCI7XG4gICAgICB9XG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIHN5bWJvbCAvIGZ1bmN0aW9uIFx1MjAxNCBub3QgZXhwZWN0ZWQgZnJvbSBmcm9udG1hdHRlclxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogY3JlYXRlTmV4dC50cyBcdTIwMTQgUHVyZSBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgLyBcIkNyZWF0ZSBOZXcgU2xpZGVcIiBwbGFubmluZ1xuICogY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvY3JlYXRlTmV4dC50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHNcbiAqIHRoZSB2YXVsdCAobWV0YWRhdGFDYWNoZSwgY29tcHV0ZURlY2spIHRvIHRoaXMgcHVyZSBpbnRlcmZhY2UgYW5kIGFwcGxpZXNcbiAqIHRoZSByZXN1bHRpbmcgcGxhbiB3aXRoIHZhdWx0LmNyZWF0ZSgpICsgZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKCkuXG4gKlxuICogdjEuMC4wIGNvbnZlbnRpb24gXHUyMDE0IG5leHQtb25seSwgbm8gb3ZlcnZpZXcgcGFnZTogYSBzbGlkZSdzIGBkZWNrYFxuICogcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluayAoaXRzIG5leHQgc2xpZGUpLiBwbGFuQ3JlYXRlTmV4dCBkZWNpZGVzLFxuICogZm9yIHRoZSBjdXJyZW50IGRlY2sgbm90ZTpcbiAqICAgLSB0aGUgbmFtZSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKGNvbGxpc2lvbi1hd2FyZSksXG4gKiAgIC0gdGhlIHJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgbmV3IG5vdGUsXG4gKiAgIC0gdGhlIHJld3JpdGVzIG5lZWRlZCBvbiBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSkuXG4gKiBwbGFuQ3JlYXRlTmV3IHBsYW5zIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIChhIGZyZXNoIG5vdGUgdGhhdCBpc1xuICogbm90IHBhcnQgb2YgYW55IGRlY2sgeWV0IFx1MjAxNCBgZGVjazogW11gLCBubyByZXdyaXRlcyBhbnl3aGVyZSkuXG4gKi9cblxuaW1wb3J0IHsgZXh0cmFjdExpbmtUZXh0IH0gZnJvbSBcIi4vZGVja1wiO1xuXG4vKiogSW5wdXRzIGZvciBwbGFubmluZyBcdTIwMTQgcmVzb2x2ZWQgYnkgdGhlIGFkYXB0ZXIgaW4gbWFpbi50cyAqL1xuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVOZXh0SW5wdXQge1xuICAvKiogQmFzZW5hbWUgKHdpdGhvdXQgZXh0ZW5zaW9uKSBvZiB0aGUgY3VycmVudCBub3RlICovXG4gIGN1cnJlbnROYW1lOiBzdHJpbmc7XG4gIC8qKiBSYXcgYGRlY2tgIGxpbmsgdGV4dHMgb2YgdGhlIGN1cnJlbnQgbm90ZSAoZXh0cmFjdGVkLCBhdCBtb3N0IG9uZSkgKi9cbiAgY3VycmVudExpbmtzOiBzdHJpbmdbXTtcbiAgLyoqIEJhc2VuYW1lcyBvZiBldmVyeSBtYXJrZG93biBub3RlIGluIHRoZSB2YXVsdCAoY29sbGlzaW9uLWZyZWUgbmFtaW5nKSAqL1xuICBleGlzdGluZ05hbWVzOiBTZXQ8c3RyaW5nPjtcbn1cblxuLyoqIE9uZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBtdXN0IGJlIHJld3JpdHRlbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWNrUmV3cml0ZSB7XG4gIC8qKiBCYXNlbmFtZSBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqIFRoZSBuZXcgcmF3IGBkZWNrYCBsaW5rIHRleHRzIChzZXJpYWxpemVkIGFzIGEgWUFNTCBsaXN0KSAqL1xuICBkZWNrOiBzdHJpbmdbXTtcbn1cblxuLyoqIFRoZSBmdWxsIHBsYW4gZm9yIGNyZWF0aW5nIG9uZSBuZXcgc2xpZGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dFJlc3VsdCB7XG4gIC8qKiBCYXNlbmFtZSAod2l0aG91dCBleHRlbnNpb24pIG9mIHRoZSBuZXcgc2xpZGUgZmlsZSAqL1xuICBuZXdOYW1lOiBzdHJpbmc7XG4gIC8qKiBSYXcgYGRlY2tgIGxpbmsgdGV4dHMgZm9yIHRoZSBuZXcgbm90ZSdzIGZyb250bWF0dGVyICovXG4gIG5ld0RlY2tMaW5rczogc3RyaW5nW107XG4gIC8qKiBSZXdyaXRlcyB0byBhcHBseSB0byBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGUpICovXG4gIHJld3JpdGVzOiBEZWNrUmV3cml0ZVtdO1xufVxuXG4vKipcbiAqIFBsYW4gdGhlIGNyZWF0aW9uIG9mIGEgbmV3IHNsaWRlIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuXG4gKlxuICogQmVoYXZpb3JzOlxuICogICAtIE5vIG5leHQgbGluayAobGFzdCBzbGlkZSwgZnJlc2ggZGVjayBoZWFkLCBvciBhIHBsYWluIG5vdGUgc3RhcnRpbmdcbiAqICAgICBhIGJyYW5kLW5ldyBkZWNrKTogYXBwZW5kIGA8Y3VycmVudD4tbmV4dGAgYXMgdGhlIG5ldyBsYXN0IHNsaWRlOyB0aGVcbiAqICAgICBjdXJyZW50IG5vdGUncyBgZGVja2AgZ2FpbnMgdGhlIGxpbmsgdG8gaXQuXG4gKiAgIC0gVmFsaWQgbmV4dCBsaW5rOiBpbnNlcnQgYDxjdXJyZW50Pi1uZXh0YCBiZXR3ZWVuIHRoZSBjdXJyZW50IG5vdGUgYW5kXG4gKiAgICAgaXRzIG5leHQ7IHRoZSBuZXcgbm90ZSB0YWtlcyBvdmVyIHRoZSBvbGQgbmV4dCBsaW5rLlxuICogICAtIEJyb2tlbiBuZXh0IGxpbmsgKHBsYWluLCBub24tZXhpc3RpbmcgbmFtZSk6IGNyZWF0ZSBleGFjdGx5IHRoZVxuICogICAgIGRlY2xhcmVkIG1pc3Npbmcgbm90ZSBhcyB0aGUgbmV3IG5leHQgc2xpZGUgXHUyMDE0IHRoZSBcdTI2QTAgd2FybmluZ1xuICogICAgIGRpc2FwcGVhcnMgYW5kIHRoZSBhdXRob3IncyBpbnRlbnQgaXMgaG9ub3VyZWQuIEEgYnJva2VuIGxpbmsgdGhhdCBpc1xuICogICAgIG5vdCBhIHBsYWluIGJhc2VuYW1lIChwYXRoLXF1YWxpZmllZCwgc2VsZi1yZWZlcmVuY2luZykgaXMgdHJlYXRlZCBhc1xuICogICAgIGludmFsaWQgYW5kIGRyb3BwZWQgKGFwcGVuZCBhIGA8Y3VycmVudD4tbmV4dGAgbGFzdCBzbGlkZSBpbnN0ZWFkKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5DcmVhdGVOZXh0KGlucHV0OiBDcmVhdGVOZXh0SW5wdXQpOiBDcmVhdGVOZXh0UmVzdWx0IHwgbnVsbCB7XG4gIGNvbnN0IHsgY3VycmVudE5hbWUsIGN1cnJlbnRMaW5rcyB9ID0gaW5wdXQ7XG4gIGNvbnN0IG5leHRMaW5rID0gY3VycmVudExpbmtzWzBdO1xuXG4gIGlmIChuZXh0TGluaykge1xuICAgIGNvbnN0IG5leHROYW1lID0gZXh0cmFjdExpbmtUZXh0KG5leHRMaW5rKTtcbiAgICBpZiAobmV4dE5hbWUgJiYgaXNQbGFpbk5hbWUobmV4dE5hbWUpICYmIG5leHROYW1lICE9PSBjdXJyZW50TmFtZSkge1xuICAgICAgaWYgKCFpbnB1dC5leGlzdGluZ05hbWVzLmhhcyhuZXh0TmFtZSkpIHtcbiAgICAgICAgLy8gVGhlIGRlY2xhcmVkIG5leHQgbm90ZSBkb2VzIG5vdCBleGlzdCB5ZXQgXHUyMTkyIGNyZWF0ZSBleGFjdGx5IHRoYXRcbiAgICAgICAgLy8gbm90ZSAoZml4ZXMgdGhlIGJyb2tlbi1saW5rIHdhcm5pbmcsIGhvbm91cnMgdGhlIGF1dGhvcidzIGludGVudCkuXG4gICAgICAgIHJldHVybiB7IG5ld05hbWU6IG5leHROYW1lLCBuZXdEZWNrTGlua3M6IFtdLCByZXdyaXRlczogW10gfTtcbiAgICAgIH1cbiAgICAgIC8vIEEgdmFsaWQgbmV4dCBub3RlIGV4aXN0cyBcdTIxOTIgaW5zZXJ0IGJldHdlZW4gaXQgYW5kIHRoZSBjdXJyZW50IG5vdGUuXG4gICAgICBjb25zdCBuZXdOYW1lID0gdW5pcXVlTmFtZShgJHtjdXJyZW50TmFtZX0tbmV4dGAsIGlucHV0LmV4aXN0aW5nTmFtZXMpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmV3TmFtZSxcbiAgICAgICAgbmV3RGVja0xpbmtzOiBbbmV4dExpbmtdLFxuICAgICAgICByZXdyaXRlczogW3sgbmFtZTogY3VycmVudE5hbWUsIGRlY2s6IFtgW1ske25ld05hbWV9XV1gXSB9XSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIEludmFsaWQgKHBhdGgtcXVhbGlmaWVkIC8gc2VsZi1yZWZlcmVuY2luZykgbmV4dCBsaW5rIFx1MjE5MiBkcm9wIGl0IGFuZFxuICAgIC8vIGFwcGVuZCBhIG5ldyBsYXN0IHNsaWRlIChmYWxsIHRocm91Z2ggdG8gdGhlIG5vLW5leHQgYnJhbmNoKS5cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBObyAodXNhYmxlKSBuZXh0IGxpbmsgXHUyMTkyIGFwcGVuZCBhIG5ldyBsYXN0IHNsaWRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBjb25zdCBuZXdOYW1lID0gdW5pcXVlTmFtZShgJHtjdXJyZW50TmFtZX0tbmV4dGAsIGlucHV0LmV4aXN0aW5nTmFtZXMpO1xuICByZXR1cm4ge1xuICAgIG5ld05hbWUsXG4gICAgbmV3RGVja0xpbmtzOiBbXSxcbiAgICByZXdyaXRlczogW3sgbmFtZTogY3VycmVudE5hbWUsIGRlY2s6IFtgW1ske25ld05hbWV9XV1gXSB9XSxcbiAgfTtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBjcmVhdGlvbiBvZiBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZS5cbiAqXG4gKiBUaGUgbmV3IG5vdGUgc3RhcnRzIGFzIGEgc2luZ2xlLXNsaWRlIGRlY2sgKGBkZWNrOiBbXWApIGFuZCBub3RoaW5nIGVsc2VcbiAqIGlzIHRvdWNoZWQgXHUyMDE0IHRoZSBub3RlIGl0IHdhcyBsYXVuY2hlZCBmcm9tIHN0YXlzIGFzLWlzLiBMYXRlciBwYWdlcyBhcmVcbiAqIGFkZGVkIHdpdGggQ3JlYXRlIE5leHQgU2xpZGUgZnJvbSBpbnNpZGUgdGhlIGRlY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuQ3JlYXRlTmV3KGlucHV0OiB7IGV4aXN0aW5nTmFtZXM6IFNldDxzdHJpbmc+IH0pOiBDcmVhdGVOZXh0UmVzdWx0IHtcbiAgcmV0dXJuIHtcbiAgICBuZXdOYW1lOiB1bmlxdWVOYW1lKFwidW50aXRsZWQtc2xpZGVzXCIsIGlucHV0LmV4aXN0aW5nTmFtZXMpLFxuICAgIG5ld0RlY2tMaW5rczogW10sXG4gICAgcmV3cml0ZXM6IFtdLFxuICB9O1xufVxuXG4vKiogQSBuYW1lIHVzYWJsZSBhcyBhIHZhdWx0IG5vdGUgbmFtZTogbm8gcGF0aCBzZXBhcmF0b3JzLCBub24tZW1wdHkgKi9cbmZ1bmN0aW9uIGlzUGxhaW5OYW1lKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gbmFtZS5sZW5ndGggPiAwICYmICFuYW1lLmluY2x1ZGVzKFwiL1wiKSAmJiAhbmFtZS5pbmNsdWRlcyhcIlxcXFxcIik7XG59XG5cbi8qKiBGaXJzdCBmcmVlIG5hbWUgaW4gdGhlIGZhbWlseSBgYmFzZWAsIGBiYXNlLTJgLCBgYmFzZS0zYCwgXHUyMDI2ICovXG5mdW5jdGlvbiB1bmlxdWVOYW1lKGJhc2U6IHN0cmluZywgZXhpc3Rpbmc6IFNldDxzdHJpbmc+KTogc3RyaW5nIHtcbiAgaWYgKCFleGlzdGluZy5oYXMoYmFzZSkpIHJldHVybiBiYXNlO1xuICBmb3IgKGxldCBpID0gMjsgOyBpKyspIHtcbiAgICBjb25zdCBjYW5kaWRhdGUgPSBgJHtiYXNlfS0ke2l9YDtcbiAgICBpZiAoIWV4aXN0aW5nLmhhcyhjYW5kaWRhdGUpKSByZXR1cm4gY2FuZGlkYXRlO1xuICB9XG59XG4iLCAiLyoqXG4gKiBkZWxldGVTbGlkZXMudHMgXHUyMDE0IFB1cmUgXCJEZWxldGUgc2xpZGVzXCIgcGxhbm5pbmcgY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBGcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0IGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseVxuICogKHNlZSB0ZXN0L2RlbGV0ZVNsaWRlcy50ZXN0LnRzKS4gVGhlIGFkYXB0ZXIgaW4gZGVjay1zZXJ2aWNlLnRzIGFwcGxpZXNcbiAqIHRoZSBwbGFuOiBpdCByZXdyaXRlcyB0aGUgc3Vydml2aW5nIG5vdGVzJyBgZGVja2AgcHJvcGVydGllcywgdGhlbiBtb3Zlc1xuICogdGhlIGRlbGV0ZWQgbm90ZXMgdG8gdGhlIHRyYXNoLlxuICpcbiAqIERlbGV0aW9uIHNwbGljZXMgdGhlIGNoYWluIGluc3RlYWQgb2YgYnJlYWtpbmcgaXQ6IGV2ZXJ5IG1heGltYWwgcnVuIG9mXG4gKiBkZWxldGVkIHNsaWRlcyBiZXR3ZWVuIHR3byBzdXJ2aXZvcnMgQSBcdTIxOTIgXHUyMDI2IFx1MjE5MiBCIGlzIHJlcGFpcmVkIGJ5IHBvaW50aW5nXG4gKiBBJ3MgYGRlY2tgIGxpbmsgYXQgQiAoYFtdYCB3aGVuIHRoZSBydW4gcmVhY2hlcyB0aGUgZW5kIG9mIHRoZSBjaGFpbikuXG4gKiBXaGVuIGEgcnVuIHN0YXJ0cyBhdCB0aGUgY2hhaW4gaGVhZCwgdGhlIGZpcnN0IHN1cnZpdm9yIGJlY29tZXMgdGhlIG5ld1xuICogaGVhZCBhbmQgbmVlZHMgbm8gcmV3cml0ZSBhdCBhbGwgKGl0cyBvd24gYGRlY2tgIGFscmVhZHkgcG9pbnRzIG9ud2FyZCkuXG4gKi9cblxuLyoqIE9uZSBzdXJ2aXZpbmcgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVsZXRlUmV3cml0ZSB7XG4gIC8qKiBWYXVsdCBwYXRoIG9mIHRoZSBub3RlIHRvIHJld3JpdGUgKi9cbiAgcGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0aGF0IHNob3VsZCBiZWNvbWUgdGhpcyBub3RlJ3MgbmV4dCBzbGlkZSxcbiAgICogb3IgbnVsbCB3aGVuIHRoZSBub3RlIGJlY29tZXMgdGhlIG5ldyBsYXN0IHNsaWRlIChgZGVjazogW11gKS5cbiAgICovXG4gIG5leHRQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKipcbiAqIFBsYW4gdGhlIGRlbGV0aW9uIG9mIHNsaWRlcyBmcm9tIGFuIG9yZGVyZWQgZGVjayBjaGFpbi5cbiAqXG4gKiBgY2hhaW5gIGlzIHRoZSBmdWxsIHNsaWRlIG9yZGVyIChbMF0gPSBoZWFkKS4gT25seSBwYXRocyBwcmVzZW50IGluIHRoZVxuICogY2hhaW4gYXJlIGNvbnNpZGVyZWQ7IGFueXRoaW5nIGVsc2UgaW4gYGRlbGV0ZVBhdGhzYCBpcyBpZ25vcmVkLiBSZXR1cm5zXG4gKiBvbmUgcmV3cml0ZSBwZXIgc3Vydml2aW5nIG5vdGUgdGhhdCBkaXJlY3RseSBwcmVjZWRlZCBhIGRlbGV0ZWQgcnVuLFxuICogb3JkZXJlZCBieSBjaGFpbiBwb3NpdGlvbi4gRGVsZXRpbmcgbm90aGluZyB5aWVsZHMgbm8gcmV3cml0ZXM7IGRlbGV0aW5nXG4gKiBldmVyeXRoaW5nIHlpZWxkcyBubyByZXdyaXRlcyBlaXRoZXIgKG5vIHN1cnZpdm9ycyBsZWZ0IHRvIHJlcGFpcikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuRGVsZXRlU2xpZGVzKFxuICBjaGFpbjogc3RyaW5nW10sXG4gIGRlbGV0ZVBhdGhzOiBSZWFkb25seVNldDxzdHJpbmc+LFxuKTogRGVsZXRlUmV3cml0ZVtdIHtcbiAgY29uc3QgcmV3cml0ZXM6IERlbGV0ZVJld3JpdGVbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcGF0aCA9IGNoYWluW2ldO1xuICAgIGlmICghcGF0aCB8fCBkZWxldGVQYXRocy5oYXMocGF0aCkpIGNvbnRpbnVlO1xuICAgIC8vIEZpbmQgdGhlIGZpcnN0IHN1cnZpdm9yIGFmdGVyIHRoaXMgbm90ZSdzIHBvc2l0aW9uLlxuICAgIGxldCBqID0gaSArIDE7XG4gICAgd2hpbGUgKGogPCBjaGFpbi5sZW5ndGggJiYgZGVsZXRlUGF0aHMuaGFzKGNoYWluW2pdKSkgaisrO1xuICAgIGNvbnN0IG5leHRQYXRoID0gaiA8IGNoYWluLmxlbmd0aCA/IGNoYWluW2pdIDogbnVsbDtcbiAgICBjb25zdCBjaGFuZ2VkID0gbmV4dFBhdGggIT09IChjaGFpbltpICsgMV0gPz8gbnVsbCk7XG4gICAgaWYgKGNoYW5nZWQpIHJld3JpdGVzLnB1c2goeyBwYXRoLCBuZXh0UGF0aCB9KTtcbiAgfVxuICByZXR1cm4gcmV3cml0ZXM7XG59XG5cbi8qKlxuICogUGljayB3aGVyZSB0aGUgZWRpdG9yIHNob3VsZCBsYW5kIGFmdGVyIGRlbGV0aW5nIHNsaWRlczogdGhlIG5lYXJlc3RcbiAqIHN1cnZpdm9yIG9mIGBkZWxldGVkUGF0aHNgJyBuZWlnaGJvdXJob29kIGFyb3VuZCBgZm9jdXNQYXRoYCBcdTIwMTQgcHJlZmVyXG4gKiB0aGUgY2xvc2VzdCBzdXJ2aXZvciBhZnRlciBpdCwgZWxzZSB0aGUgY2xvc2VzdCBiZWZvcmUgaXQuIFJldHVybnMgbnVsbFxuICogd2hlbiBgZm9jdXNQYXRoYCBzdXJ2aXZlcyBvciBub3RoaW5nIG5lYXJieSByZW1haW5zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGlja0xhbmRpbmdQYXRoKFxuICBjaGFpbjogc3RyaW5nW10sXG4gIGRlbGV0ZVBhdGhzOiBSZWFkb25seVNldDxzdHJpbmc+LFxuICBmb2N1c1BhdGg6IHN0cmluZyB8IG51bGwsXG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCFmb2N1c1BhdGggfHwgIWRlbGV0ZVBhdGhzLmhhcyhmb2N1c1BhdGgpKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaW5kZXggPSBjaGFpbi5pbmRleE9mKGZvY3VzUGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICBmb3IgKGxldCBpID0gaW5kZXggKyAxOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWRlbGV0ZVBhdGhzLmhhcyhjaGFpbltpXSkpIHJldHVybiBjaGFpbltpXTtcbiAgfVxuICBmb3IgKGxldCBpID0gaW5kZXggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmICghZGVsZXRlUGF0aHMuaGFzKGNoYWluW2ldKSkgcmV0dXJuIGNoYWluW2ldO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBNZW51LCBURmlsZSwgV29ya3NwYWNlTGVhZiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBDb25maXJtRGVsZXRlTW9kYWwgfSBmcm9tIFwiLi9jb25maXJtLWRlbGV0ZVwiO1xuXG4vKiogVmlldyB0eXBlIGlkIG9mIHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19QQU5FTF9WSUVXID0gXCJuYXRpdmUtc2xpZGVzLXBhbmVsXCI7XG5cbi8qKlxuICogU2lkZWJhciBwYW5lbCBsaXN0aW5nIGV2ZXJ5IHNsaWRlIG9mIHRoZSBhY3RpdmUgbm90ZSdzIGRlY2sgKG5leHQtb25seVxuICogY2hhaW4gb3JkZXIpLiBUYWtlcyBvdmVyIHRoZSBhZ2dyZWdhdGlvbi9lbnRyeSByb2xlIHRoZSBvdmVydmlldyBwYWdlXG4gKiB1c2VkIHRvIHBsYXkgYmVmb3JlIHYxLjAuMC5cbiAqXG4gKiBJbnRlcmFjdGlvbjpcbiAqICAgLSBjbGljayAgICAgICAgICAgIFx1MjE5MiBvcGVuIHRoYXQgc2xpZGUgKGFuZCBjbGVhciBhbnkgc2VsZWN0aW9uKVxuICogICAtIE1vZCtjbGljayAgICAgICAgXHUyMTkyIHRvZ2dsZSB0aGUgaXRlbSBpbiB0aGUgc2VsZWN0aW9uXG4gKiAgIC0gU2hpZnQrY2xpY2sgICAgICBcdTIxOTIgZXh0ZW5kIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgbGFzdCBhbmNob3JcbiAqICAgLSByaWdodC1jbGljayAgICAgIFx1MjE5MiBjb250ZXh0IG1lbnU6IENyZWF0ZSBuZXh0IHNsaWRlIC8gRGVsZXRlIHNsaWRlKHMpXG4gKi9cbmV4cG9ydCBjbGFzcyBTbGlkZXNQYW5lbFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIC8qKiBDaGFpbiBzaWduYXR1cmUgb2YgdGhlIGN1cnJlbnRseSByZW5kZXJlZCBsaXN0ICovXG4gIHByaXZhdGUgbGFzdENoYWluOiBzdHJpbmdbXSA9IFtdO1xuICAvKiogUmVuZGVyZWQgaXRlbSBlbGVtZW50cywgaW5kZXgtYWxpZ25lZCB3aXRoIGxhc3RDaGFpbiAqL1xuICBwcml2YXRlIGl0ZW1zOiB7IHBhdGg6IHN0cmluZzsgZWw6IEhUTUxFbGVtZW50IH1bXSA9IFtdO1xuICAvKiogQ3VycmVudGx5IHNlbGVjdGVkIHNsaWRlIHBhdGhzIChtdWx0aS1zZWxlY3QgZm9yIERlbGV0ZSkgKi9cbiAgcHJpdmF0ZSBzZWxlY3RlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAvKiogU2VsZWN0aW9uIGFuY2hvciBmb3IgU2hpZnQrY2xpY2sgcmFuZ2UgZXh0ZW5zaW9uICovXG4gIHByaXZhdGUgYW5jaG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luLFxuICAgIGxlYWY6IFdvcmtzcGFjZUxlYWYsXG4gICkge1xuICAgIHN1cGVyKGxlYWYpO1xuICB9XG5cbiAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gU0xJREVTX1BBTkVMX1ZJRVc7XG4gIH1cblxuICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcIlNsaWRlc1wiO1xuICB9XG5cbiAgZ2V0SWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBcInByZXNlbnRhdGlvblwiO1xuICB9XG5cbiAgYXN5bmMgb25PcGVuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY29udGFpbmVyRWwuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLXBhbmVsXCIpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJmaWxlLW9wZW5cIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcInJlbmFtZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwiZGVsZXRlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgYXN5bmMgb25DbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgdGhpcy5sYXN0Q2hhaW4gPSBbXTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jIHRoZSBsaXN0IHdpdGggdGhlIGFjdGl2ZSBub3RlJ3MgZGVjay4gSW5jcmVtZW50YWwgb24gcHVycG9zZTogdGhlXG4gICAqIHJlZnJlc2ggZXZlbnRzIGFsc28gZmlyZSB3aGlsZSBhIGNsaWNrIG9uIGFuIGVudHJ5IGlzIGluIGZsaWdodCAodGhlXG4gICAqIG1vdXNlZG93biBhY3RpdmF0ZXMgdGhpcyBsZWFmKSwgYW5kIHJlYnVpbGRpbmcgdGhlIERPTSBtaWQtZ2VzdHVyZVxuICAgKiBkZXN0cm95cyB0aGUgY2xpY2sgdGFyZ2V0IFx1MjAxNCB3aGljaCBtYWRlIG9wZW5pbmcgYSBzbGlkZSB0YWtlIHR3byBjbGlja3NcbiAgICogd2hlbmV2ZXIgdGhlIHBhbmVsIHdhcyBub3QgdGhlIGFjdGl2ZSBsZWFmLiBVbmNoYW5nZWQgY2hhaW5zIG9ubHkgZ2V0XG4gICAqIHRoZWlyIGhpZ2hsaWdodCB1cGRhdGVkLCBzbyBpdGVtIGVsZW1lbnRzIGFsd2F5cyBzdXJ2aXZlLlxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgZGVjayA9IGZpbGUgPyB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpIDogbnVsbDtcbiAgICBjb25zdCBjaGFpbiA9IGRlY2tcbiAgICAgID8gZGVjay5jaGFpbi5maWx0ZXIoKHApID0+IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwKSBpbnN0YW5jZW9mIFRGaWxlKVxuICAgICAgOiBbXTtcblxuICAgIC8vIERyb3Agc2VsZWN0aW9ucyB3aG9zZSBub3RlIHZhbmlzaGVkIGZyb20gdGhlIGNoYWluIG1lYW53aGlsZVxuICAgIGlmICh0aGlzLnNlbGVjdGVkLnNpemUgPiAwKSB7XG4gICAgICBjb25zdCBsaXZlID0gbmV3IFNldChjaGFpbik7XG4gICAgICBmb3IgKGNvbnN0IHBhdGggb2YgdGhpcy5zZWxlY3RlZCkgaWYgKCFsaXZlLmhhcyhwYXRoKSkgdGhpcy5zZWxlY3RlZC5kZWxldGUocGF0aCk7XG4gICAgfVxuICAgIC8vIEEgZGVhZCBhbmNob3IgbXVzdCBub3Qgc2lsZW50bHkgdHVybiBhIFNoaWZ0K2NsaWNrIGludG8gYSB0b2dnbGVcbiAgICBpZiAodGhpcy5hbmNob3IgIT09IG51bGwgJiYgIWNoYWluLmluY2x1ZGVzKHRoaXMuYW5jaG9yKSkgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKCFjaGFpbkVxdWFscyh0aGlzLmxhc3RDaGFpbiwgY2hhaW4pKSB7XG4gICAgICB0aGlzLnJlYnVpbGQoY2hhaW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMuaXRlbXMpIGl0LmVsLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIiwgaXQucGF0aCA9PT0gZmlsZT8ucGF0aCk7XG4gICAgfVxuICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBGdWxsIHJlYnVpbGQgKGNoYWluIHNoYXBlIGNoYW5nZWQpICovXG4gIHByaXZhdGUgcmVidWlsZChjaGFpbjogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250YWluZXJFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMubGFzdENoYWluID0gY2hhaW47XG5cbiAgICBpZiAoY2hhaW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBlbXB0eSA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtZW1wdHlcIiB9KTtcbiAgICAgIGVtcHR5LnNldFRleHQoXG4gICAgICAgIFwiTm8gc2xpZGVzIGRlY2sgXHUyMDE0IG9wZW4gYSBkZWNrIG5vdGUsIG9yIHJ1biBjcmVhdGUgbmV4dCBzbGlkZSBvbiBhbnkgbm90ZSB0byBzdGFydCBvbmUuXCIsXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoO1xuICAgIGNoYWluLmZvckVhY2goKHBhdGgsIGkpID0+IHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm47XG4gICAgICBjb25zdCBpdGVtID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1pdGVtXCIgfSk7XG4gICAgICBpZiAocGF0aCA9PT0gYWN0aXZlUGF0aCkgaXRlbS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLW51bVwiIH0pLnNldFRleHQoU3RyaW5nKGkgKyAxKSk7XG4gICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC10aXRsZVwiIH0pLnNldFRleHQoZi5iYXNlbmFtZSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gdGhpcy5vbkl0ZW1DbGljayhlLCBpLCBmKSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMub3BlbkNvbnRleHRNZW51KGUsIGYpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLml0ZW1zLnB1c2goeyBwYXRoLCBlbDogaXRlbSB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDbGljayByb3V0aW5nOiBwbGFpbiA9IG9wZW4sIE1vZCA9IHRvZ2dsZSBzZWxlY3QsIFNoaWZ0ID0gcmFuZ2Ugc2VsZWN0ICovXG4gIHByaXZhdGUgb25JdGVtQ2xpY2soZTogTW91c2VFdmVudCwgaW5kZXg6IG51bWJlciwgZjogVEZpbGUpOiB2b2lkIHtcbiAgICBpZiAoZS5zaGlmdEtleSB8fCBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAvLyBSYW5nZSBhbmNob3I6IHRoZSBsYXN0IHNlbGVjdGVkIGl0ZW0sIG9yIHRoZSBkaXNwbGF5ZWQgc2xpZGVcbiAgICAgICAgLy8gd2hlbiBubyB1c2FibGUgYW5jaG9yIGV4aXN0cyAoZmlyc3QgU2hpZnQrY2xpY2sgaW4gYSBzZXNzaW9uKS5cbiAgICAgICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbDtcbiAgICAgICAgY29uc3QgYW5jaG9yUGF0aCA9XG4gICAgICAgICAgdGhpcy5hbmNob3IgIT09IG51bGwgJiYgdGhpcy5pdGVtcy5zb21lKChpdCkgPT4gaXQucGF0aCA9PT0gdGhpcy5hbmNob3IpXG4gICAgICAgICAgICA/IHRoaXMuYW5jaG9yXG4gICAgICAgICAgICA6IGFjdGl2ZVBhdGg7XG4gICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgoaXQpID0+IGl0LnBhdGggPT09IGFuY2hvclBhdGgpO1xuICAgICAgICBpZiAoYW5jaG9yUGF0aCAhPT0gbnVsbCAmJiBmcm9tICE9PSAtMSkge1xuICAgICAgICAgIGNvbnN0IFtsbywgaGldID0gZnJvbSA8IGluZGV4ID8gW2Zyb20sIGluZGV4XSA6IFtpbmRleCwgZnJvbV07XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGxvOyBpIDw9IGhpOyBpKyspIHRoaXMuc2VsZWN0ZWQuYWRkKHRoaXMuaXRlbXNbaV0ucGF0aCk7XG4gICAgICAgICAgLy8gVGhlIGRpc3BsYXllZCBzbGlkZSBqb2lucyBldmVyeSBTaGlmdCBzZWxlY3Rpb24gXHUyMDE0IGV4dGVuZGluZyBhXG4gICAgICAgICAgLy8gc2VsZWN0aW9uIG5ldmVyIHNpbGVudGx5IGRyb3BzIHRoZSBwYWdlIHlvdSBhcmUgbG9va2luZyBhdC5cbiAgICAgICAgICBpZiAoYWN0aXZlUGF0aCAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLnNvbWUoKGl0KSA9PiBpdC5wYXRoID09PSBhY3RpdmVQYXRoKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5hZGQoYWN0aXZlUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYW5jaG9yID0gdGhpcy5pdGVtc1tpbmRleF0ucGF0aDtcbiAgICAgICAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBNb2QgKG9yIFNoaWZ0IHdpdGggbm8gcmVhY2hhYmxlIGFuY2hvcik6IHB1cmUgdG9nZ2xlIFx1MjAxNCB0aGUgb25seSB3YXlcbiAgICAgIC8vIHRvIGNhbmNlbCBhbiBpdGVtIG91dCBvZiB0aGUgc2VsZWN0aW9uLlxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQuaGFzKGYucGF0aCkpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKGYucGF0aCk7XG4gICAgICBlbHNlIHRoaXMuc2VsZWN0ZWQuYWRkKGYucGF0aCk7XG4gICAgICB0aGlzLmFuY2hvciA9IGYucGF0aDtcbiAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgIC8vIE5vIHNlbGVjdGlvbiBhZnRlciBhIHBsYWluIGNsaWNrLCBidXQgdGhlIGNsaWNrZWQgc2xpZGUgc3RheXMgdGhlXG4gICAgLy8gU2hpZnQrY2xpY2sgYW5jaG9yIFx1MjAxNCBtYXRjaGluZyB0aGUgZmlsZS1leHBsb3JlciBmZWVsOiBwaWNrIGEgc2xpZGUsXG4gICAgLy8gdGhlbiBTaGlmdCtjbGljayBhIGxhdGVyIG9uZSB0byBzZWxlY3QgdGhlIHdob2xlIHJhbmdlIGJldHdlZW4gdGhlbS5cbiAgICB0aGlzLmFuY2hvciA9IGYucGF0aDtcbiAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgdm9pZCB0aGlzLm9wZW5TbGlkZShmKTtcbiAgfVxuXG4gIC8qKiBSZWZsZWN0IHRoZSBzZWxlY3Rpb24gc2V0IG9uIHRoZSByZW5kZXJlZCBpdGVtcyB3aXRob3V0IGEgcmVidWlsZCAqL1xuICBwcml2YXRlIHN5bmNTZWxlY3Rpb25DbGFzc2VzKCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5pdGVtcykgaXQuZWwuY2xhc3NMaXN0LnRvZ2dsZShcImlzLXNlbGVjdGVkXCIsIHRoaXMuc2VsZWN0ZWQuaGFzKGl0LnBhdGgpKTtcbiAgfVxuXG4gIC8qKiBSaWdodC1jbGljayBtZW51IG9uIG9uZSBpdGVtOyBvcGVyYXRlcyBvbiB0aGUgd2hvbGUgc2VsZWN0aW9uIHdoZW4gaXQgYmVsb25ncyB0byBvbmUgKi9cbiAgcHJpdmF0ZSBvcGVuQ29udGV4dE1lbnUoZTogTW91c2VFdmVudCwgZjogVEZpbGUpOiB2b2lkIHtcbiAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcbiAgICBtZW51LmFkZEl0ZW0oKG1pKSA9PlxuICAgICAgbWlcbiAgICAgICAgLnNldFRpdGxlKFwiQ3JlYXRlIG5leHQgc2xpZGVcIilcbiAgICAgICAgLnNldEljb24oXCJwbHVzXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHZvaWQgdGhpcy5jcmVhdGVOZXh0QWZ0ZXIoZikpLFxuICAgICk7XG4gICAgY29uc3QgdGFyZ2V0cyA9IHRoaXMuc2VsZWN0ZWQuaGFzKGYucGF0aCkgPyBbLi4udGhpcy5zZWxlY3RlZF0gOiBbZi5wYXRoXTtcbiAgICBjb25zdCBvcmRlcmVkID0gdGhpcy5sYXN0Q2hhaW4uZmlsdGVyKChwKSA9PiB0YXJnZXRzLmluY2x1ZGVzKHApKTtcbiAgICBtZW51LmFkZEl0ZW0oKG1pKSA9PlxuICAgICAgbWlcbiAgICAgICAgLnNldFRpdGxlKG9yZGVyZWQubGVuZ3RoID4gMSA/IGBEZWxldGUgJHtvcmRlcmVkLmxlbmd0aH0gc2xpZGVzYCA6IFwiRGVsZXRlIHNsaWRlXCIpXG4gICAgICAgIC5zZXRJY29uKFwidHJhc2hcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdGhpcy5kZWxldGVTbGlkZXMob3JkZXJlZCkpLFxuICAgICk7XG4gICAgbWVudS5zaG93QXRNb3VzZUV2ZW50KGUpO1xuICB9XG5cbiAgLyoqIENyZWF0ZSBhIHNsaWRlIGFmdGVyIHRoZSByaWdodC1jbGlja2VkIG9uZSAod2l0aG91dCBvcGVuaW5nIGl0KSAqL1xuICBwcml2YXRlIGFzeW5jIGNyZWF0ZU5leHRBZnRlcihmOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBsYW4gPSB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmKTtcbiAgICBpZiAoIXBsYW4pIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlQ3JlYXRlTmV4dChmLCBwbGFuLCBmYWxzZSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBDb25maXJtLCB0aGVuIHRyYXNoIHRoZSBnaXZlbiBzbGlkZXMgYW5kIHNwbGljZSB0aGVtIG91dCBvZiB0aGUgY2hhaW4gKi9cbiAgcHJpdmF0ZSBkZWxldGVTbGlkZXMocGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IHJ1biA9ICgpOiB2b2lkID0+IHZvaWQgdGhpcy5ydW5EZWxldGlvbihwYXRocyk7XG5cbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpIHtcbiAgICAgIHJ1bigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuYW1lcyA9IHBhdGhzLm1hcCgocCkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwKTtcbiAgICAgIHJldHVybiBmIGluc3RhbmNlb2YgVEZpbGUgPyBmLmJhc2VuYW1lIDogcDtcbiAgICB9KTtcbiAgICBuZXcgQ29uZmlybURlbGV0ZU1vZGFsKHRoaXMuYXBwLCBuYW1lcywgcnVuLCBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzID0gZmFsc2U7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJ1bkRlbGV0aW9uKHBhdGhzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IG51bGw7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICAgIHRoaXMubGFzdENoYWluLFxuICAgICAgbmV3IFNldChwYXRocyksXG4gICAgICBhY3RpdmVQYXRoLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgcGF0aHMpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIGlmICh0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiBwYXRocy5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQubGFuZGluZ1BhdGgpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmVzdWx0LmxhbmRpbmdQYXRoKTtcbiAgICAgIGlmIChmIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMub3BlblNsaWRlKGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqIE9wZW4gYSBzbGlkZSBpbiBhIG1hcmtkb3duIGxlYWYgKG5ldmVyIGluIHRoaXMgcGFuZWwncyBvd24gbGVhZikgKi9cbiAgcHJpdmF0ZSBhc3luYyBvcGVuU2xpZGUoZjogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsZWFmID1cbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoXCJtYXJrZG93blwiKVswXSA/PyB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGYpO1xuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHsgZm9jdXM6IHRydWUgfSk7XG4gIH1cbn1cblxuLyoqIE9yZGVyLXNlbnNpdGl2ZSBjaGFpbiBjb21wYXJpc29uICovXG5mdW5jdGlvbiBjaGFpbkVxdWFscyhhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KChwLCBpKSA9PiBwID09PSBiW2ldKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBNYXggbmFtZXMgc2hvd24gaW4gdGhlIGRpYWxvZyBiZWZvcmUgY29sbGFwc2luZyBpbnRvIGEgXCIrTiBtb3JlXCIgbGluZSAqL1xuY29uc3QgTUFYX1ZJU0lCTEVfTkFNRVMgPSA4O1xuXG4vKipcbiAqIENvbmZpcm1hdGlvbiBkaWFsb2cgZm9yIERlbGV0ZSBzbGlkZXMuIExpc3RzIHRoZSBub3RlcyBhYm91dCB0byBiZVxuICogdHJhc2hlZCAobnVtYmVyZWQgbGlrZSB0aGUgcGFuZWwsIHNvIHRoZSB1c2VyIGNhbiBtYXAgdGhlbSAxOjEpLCBvZmZlcnNcbiAqIGEgXCJkb24ndCBhc2sgYWdhaW5cIiB0b2dnbGUgdGhhdCBmbGlwcyB0aGUgYGNvbmZpcm1EZWxldGVTbGlkZXNgIHNldHRpbmdcbiAqIG9mZiAocGVyc2lzdGVkIGJ5IHRoZSBjYWxsZXIgdmlhIG9uRG9udEFzayksIGFuZCBhc2tzIGZvciBhbiBleHBsaWNpdFxuICogQ2FuY2VsIC8gRGVsZXRlIGRlY2lzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlybURlbGV0ZU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGNvbmZpcm1lZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFwcDogQXBwLFxuICAgIHByaXZhdGUgbmFtZXM6IHN0cmluZ1tdLFxuICAgIHByaXZhdGUgb25Db25maXJtOiAoKSA9PiB2b2lkLFxuICAgIHByaXZhdGUgb25Eb250QXNrOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICApIHtcbiAgICBzdXBlcihhcHApO1xuICB9XG5cbiAgb25PcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5tb2RhbEVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZVwiKTtcblxuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5uYW1lcy5sZW5ndGg7XG4gICAgdGhpcy5jb250ZW50RWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS10aXRsZVwiLFxuICAgICAgdGV4dDogY291bnQgPT09IDEgPyBcIkRlbGV0ZSB0aGlzIHNsaWRlP1wiIDogYERlbGV0ZSAke2NvdW50fSBzbGlkZXM/YCxcbiAgICB9KTtcbiAgICB0aGlzLmNvbnRlbnRFbFxuICAgICAgLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXN1YlwiIH0pXG4gICAgICAuc2V0VGV4dChcbiAgICAgICAgY291bnQgPT09IDFcbiAgICAgICAgICA/IFwiVGhlIG5vdGUgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCJcbiAgICAgICAgICA6IFwiVGhlc2Ugbm90ZXMgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCIsXG4gICAgICApO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWxpc3RcIiB9KTtcbiAgICBmb3IgKGNvbnN0IFtpLCBuYW1lXSBvZiB0aGlzLm5hbWVzLnNsaWNlKDAsIE1BWF9WSVNJQkxFX05BTUVTKS5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW51bVwiIH0pLnNldFRleHQoU3RyaW5nKGkgKyAxKSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW5hbWVcIiB9KS5zZXRUZXh0KG5hbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lcy5sZW5ndGggPiBNQVhfVklTSUJMRV9OQU1FUykge1xuICAgICAgbGlzdFxuICAgICAgICAuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbW9yZVwiIH0pXG4gICAgICAgIC5zZXRUZXh0KGBcdTIwMjYgYW5kICR7dGhpcy5uYW1lcy5sZW5ndGggLSBNQVhfVklTSUJMRV9OQU1FU30gbW9yZWApO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGREb250QXNrUm93KCk7XG4gICAgdGhpcy5idWlsZEFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKiBDb21wYWN0IGxlZnQtYWxpZ25lZCBcImRvbid0IGFzayBhZ2FpblwiIGNoZWNrYm94IHJvdyAqL1xuICBwcml2YXRlIGJ1aWxkRG9udEFza1JvdygpOiB2b2lkIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1kb250YXNrXCIgfSk7XG4gICAgcm93LmNyZWF0ZUVsKFwibGFiZWxcIikuc2V0VGV4dChcIkRvbid0IGFzayBhZ2FpblwiKTtcbiAgICBjb25zdCBjaGVja2JveCA9IHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdm9pZCB0aGlzLm9uRG9udEFzaygpLnRoZW4oXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBjaGVja2JveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICAvLyBrZWVwIHRoZSBjaGVja2JveCBlbmFibGVkIGlmIHBlcnNpc3RpbmcgdGhlIHByZWZlcmVuY2UgZmFpbGVkXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJpZ2h0LWFsaWduZWQgQ2FuY2VsIC8gRGVsZXRlIGJ1dHRvbiByb3cgKi9cbiAgcHJpdmF0ZSBidWlsZEFjdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWFjdGlvbnNcIiB9KTtcbiAgICBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxcIiB9KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICBhY3Rpb25zXG4gICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkRlbGV0ZVwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBvbkNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbmZpcm1lZCkgdGhpcy5vbkNvbmZpcm0oKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIHR5cGUgU2V0dGluZ0RlZmluaXRpb25JdGVtIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IFNMSURFU19USEVNRVMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKipcbiAqIFNldHRpbmdzIHRhYjogdG9nZ2xlcyB0aGUgbmF2IGJ1dHRvbnMsIHBhZ2UgbnVtYmVyLCBhdXRvLWVudGVyIGFuZCBiYXJcbiAqIHZpc2liaWxpdHkuIERlY2xhcmF0aXZlIGRlZmluaXRpb25zIChPYnNpZGlhbiBcdTIyNjUgMS4xMy4wLCBzZWFyY2hhYmxlIGluIHRoZVxuICogc2V0dGluZ3MgbW9kYWwpIHdpdGggYW4gaW1wZXJhdGl2ZSBgZGlzcGxheSgpYCBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pIHtcbiAgICBzdXBlcihwbHVnaW4uYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgLyoqIERlY2xhcmF0aXZlIHNldHRpbmdzIChPYnNpZGlhbiBcdTIyNjUgMS4xMy4wKSBcdTIwMTQgc2VhcmNoYWJsZSBieSB0aGUgc2V0dGluZ3MgbW9kYWwuICovXG4gIGdldFNldHRpbmdEZWZpbml0aW9ucygpOiBTZXR0aW5nRGVmaW5pdGlvbkl0ZW1bXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTdHlsZSB0ZW1wbGF0ZVwiLFxuICAgICAgICBkZXNjOiBcIkJ1aWx0LWluIGxvb2sgZm9yIHRoZSBzbGlkZXMgY2FyZCBhbmQgc2xpZGVzIGJhciAoYm9yZGVyLCBiYWNrZ3JvdW5kLCBzaGFkb3csIGJhciBzdHlsaW5nKS4gRXZlcnkgdGVtcGxhdGUgYWRhcHRzIHRvIGxpZ2h0IGFuZCBkYXJrIHRoZW1lcy5cIixcbiAgICAgICAgY29udHJvbDoge1xuICAgICAgICAgIGtleTogXCJzbGlkZXNUaGVtZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZHJvcGRvd25cIixcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuZnJvbUVudHJpZXMoU0xJREVTX1RIRU1FUy5tYXAoKHQpID0+IFt0LmlkLCB0LmxhYmVsXSkpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHNsaWRlcyBiYXJcIixcbiAgICAgICAgZGVzYzogXCJNYXN0ZXIgdG9nZ2xlIGZvciB0aGUgZW50aXJlIHNsaWRlcyBiYXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93XCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dTbGlkZXNCYXJcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHByZXZpb3VzL25leHQgYnV0dG9uc1wiLFxuICAgICAgICBkZXNjOiBcIlNob3cgXHUyNUMwIFx1MjVCNiBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyIHdoZW4gdGhlIG5vdGUgYmVsb25ncyB0byBhIGRlY2sgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSlcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd05hdkJ1dHRvbnNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJQYWdlIG51bWJlciBzdHlsZVwiLFxuICAgICAgICBkZXNjOiAnU2hvd24gYXQgdGhlIGJvdHRvbS1yaWdodC4gXCJuIC8gdG90YWxcIjogMS1iYXNlZCBvdmVyIHRoZSB3aG9sZSBkZWNrIGNoYWluIChoZWFkIHNsaWRlID0gMSkuIFwiblwiOiBqdXN0IHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyLiBcIm5vbmVcIjogaGlkZGVuLicsXG4gICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICBrZXk6IFwicGFnZU51bWJlclN0eWxlXCIsXG4gICAgICAgICAgdHlwZTogXCJkcm9wZG93blwiLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGZyYWN0aW9uOiBcIk4gLyBUb3RhbFwiLFxuICAgICAgICAgICAgY3VycmVudDogXCJOXCIsXG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHByb2dyZXNzIGJhclwiLFxuICAgICAgICBkZXNjOiBcIkRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyIC0tIG9uZSBwZXIgc2xpZGUsIGNsaWNrIHRvIGp1bXBcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd1Byb2dyZXNzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQXV0by1lbnRlciBzbGlkZXMgbW9kZVwiLFxuICAgICAgICBkZXNjOiBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJhdXRvRW50ZXJTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJFc2NhcGUgZXhpdHMgc2xpZGVzIG1vZGVcIixcbiAgICAgICAgZGVzYzogXCJQcmVzcyBlc2NhcGUgdG8gbGVhdmUgc2xpZGVzIG1vZGUgYW5kIHJldHVybiB0byB0aGUgcHJldmlvdXMgdmlld1wiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJlc2NFeGl0c1NsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNsaWRlcyB0aXRsZVwiLFxuICAgICAgICBkZXNjOiBcIkZyb250bWF0dGVyIHByb3BlcnR5IHRvIHNob3cgYXMgdGhlIGNhcmQgdGl0bGUgKEgxKS4gTGVhdmUgZW1wdHkgZm9yIG5vbmU7IHR5cGUgYGZpbGVuYW1lYCB0byB1c2UgdGhlIGZpbGUgbmFtZSBcdTIwMTQgdGhhdCB0aXRsZSBpcyBlZGl0YWJsZSAocmVuYW1lcyB0aGUgbm90ZSk7IHByb3BlcnR5LWJhY2tlZCB0aXRsZXMgYXJlIHJlYWQtb25seSAoZWRpdCB0aGUgcHJvcGVydHkgb3V0c2lkZSBzbGlkZXMgbW9kZSkuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNsaWRlc1RpdGxlXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJFLmcuIFRpdGxlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQmFyIHByb3BlcnRpZXNcIixcbiAgICAgICAgZGVzYzogXCJDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgdG8gc2hvdyBpbiB0aGUgc2xpZGVzIGJhciAoZS5nLiBgdW5pdmVyc2l0eSwgc2hvcnQtdGl0bGUsIGRhdGVgKS4gRWFjaCB2YWx1ZSBmaWxscyBhbiBlcXVhbC13aWR0aCBjb2x1bW47IGRyYWcgZGl2aWRlcnMgdG8gcmVzaXplLiBMZWF2ZSBlbXB0eSB0byBzaG93IG5vdGhpbmcuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImJhclByb3BlcnRpZXNcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIkUuZy4gVW5pdmVyc2l0eSwgZGF0ZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkNvbmZpcm0gc2xpZGUgZGVsZXRpb25cIixcbiAgICAgICAgZGVzYzogXCJBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHNsaWRlcyBwYW5lbCdzIHJpZ2h0LWNsaWNrIG1lbnUuIERlbGV0aW9uIG1vdmVzIHNsaWRlcyB0byB0aGUgdHJhc2guXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImNvbmZpcm1EZWxldGVTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJOYXZpZ2F0aW9uIGhvdGtleXNcIixcbiAgICAgICAgZGVzYzogXCJEZWZhdWx0OiBQcmV2aW91cyBwYWdlIG1vZCtzaGlmdCtcdTIxOTAsIG5leHQgcGFnZSBtb2Qrc2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgc2V0dGluZ3MgXHUyMTkyIGhvdGtleXMuXCIsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICAvKiogUGVyc2lzdCBjb250cm9sIGNoYW5nZXMsIHRoZW4gcmVmcmVzaCB0aGUgYmFyIHNvIHRoZSBuZXcgc2V0dGluZyBhcHBsaWVzLiAqL1xuICBzZXRDb250cm9sVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogdm9pZCB7XG4gICAgdm9pZCB0aGlzLmFwcGx5Q29udHJvbFZhbHVlKGtleSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBhcHBseUNvbnRyb2xWYWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAodGhpcy5wbHVnaW4uc2V0dGluZ3MgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IHZhbHVlO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBJbXBlcmF0aXZlIGZhbGxiYWNrIGZvciBPYnNpZGlhbiA8IDEuMTMuMCAobm90IGNhbGxlZCB3aXRoIGRlZmluaXRpb25zIHByZXNlbnQpLiAqL1xuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTdHlsZSB0ZW1wbGF0ZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQnVpbHQtaW4gbG9vayBmb3IgdGhlIHNsaWRlcyBjYXJkIGFuZCBzbGlkZXMgYmFyIChib3JkZXIsIGJhY2tncm91bmQsIHNoYWRvdywgYmFyIHN0eWxpbmcpLiBFdmVyeSB0ZW1wbGF0ZSBhZGFwdHMgdG8gbGlnaHQgYW5kIGRhcmsgdGhlbWVzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgU0xJREVTX1RIRU1FUykgZHJvcGRvd24uYWRkT3B0aW9uKHQuaWQsIHQubGFiZWwpO1xuICAgICAgICBkcm9wZG93bi5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGhlbWUgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBzbGlkZXMgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcIk1hc3RlciB0b2dnbGUgZm9yIHRoZSBlbnRpcmUgc2xpZGVzIGJhciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3dcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByZXZpb3VzL25leHQgYnV0dG9uc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU2hvdyBcdTI1QzAgXHUyNUI2IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgd2hlbiB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KVwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dOYXZCdXR0b25zID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiUGFnZSBudW1iZXIgc3R5bGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnU2hvd24gYXQgdGhlIGJvdHRvbS1yaWdodC4gXCJuIC8gdG90YWxcIjogMS1iYXNlZCBvdmVyIHRoZSB3aG9sZSBkZWNrIGNoYWluIChoZWFkIHNsaWRlID0gMSkuIFwiblwiOiBqdXN0IHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyLiBcIm5vbmVcIjogaGlkZGVuLicsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PlxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb25zKHtcbiAgICAgICAgICAgIGZyYWN0aW9uOiBcIk4gLyBUb3RhbFwiLFxuICAgICAgICAgICAgY3VycmVudDogXCJOXCIsXG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucGFnZU51bWJlclN0eWxlID0gdmFsdWUgYXMgXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByb2dyZXNzIGJhclwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgLS0gb25lIHBlciBzbGlkZSwgY2xpY2sgdG8ganVtcFwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1Byb2dyZXNzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBdXRvLWVudGVyIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcIlByZXNzIGVzY2FwZSB0byBsZWF2ZSBzbGlkZXMgbW9kZSBhbmQgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyB2aWV3XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNsaWRlcyB0aXRsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRnJvbnRtYXR0ZXIgcHJvcGVydHkgdG8gc2hvdyBhcyB0aGUgY2FyZCB0aXRsZSAoSDEpLiBMZWF2ZSBlbXB0eSBmb3Igbm9uZTsgdHlwZSBgZmlsZW5hbWVgIHRvIHVzZSB0aGUgZmlsZSBuYW1lLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFRpdGxlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQmFyIHByb3BlcnRpZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkNvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyB0byBzaG93IGluIHRoZSBzbGlkZXMgYmFyIChlLmcuIGB1bml2ZXJzaXR5LCBzaG9ydC10aXRsZSwgZGF0ZWApLiBFYWNoIHZhbHVlIGZpbGxzIGFuIGVxdWFsLXdpZHRoIGNvbHVtbjsgZHJhZyBkaXZpZGVycyB0byByZXNpemUuIExlYXZlIGVtcHR5IHRvIHNob3cgbm90aGluZy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRS5nLiBVbml2ZXJzaXR5LCBkYXRlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmJhclByb3BlcnRpZXMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbmZpcm0gc2xpZGUgZGVsZXRpb25cIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgc2xpZGVzIHBhbmVsJ3MgcmlnaHQtY2xpY2sgbWVudS4gRGVsZXRpb24gbW92ZXMgc2xpZGVzIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk5hdmlnYXRpb24gaG90a2V5c1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PlxuICAgICAgICBidXR0b24uc2V0QnV0dG9uVGV4dChcIk9wZW4gaG90a2V5cyBzZXR0aW5nc1wiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG4gIH1cbn1cbiIsICIvKiogUmVtb3ZlIGFsbCBjaGlsZHJlbiBvZiBhbiBlbGVtZW50ICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDaGlsZHJlbihlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBMEJBLElBQUFBLG1CQUE0Qzs7O0FDekJyQyxTQUFTLFlBQXlCO0FBQ3ZDLFFBQU0sTUFBTSxVQUFVLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQztBQUNsRCxNQUFJLGFBQWEsRUFBRSxTQUFTLE9BQU8sQ0FBQztBQUNwQyxNQUFJLFFBQVE7QUFJWixNQUFJLGlCQUFpQixhQUFhLENBQUMsTUFBTTtBQUN2QyxNQUFFLGVBQWU7QUFDakIsVUFBTSxTQUFTLFNBQVM7QUFDeEIsUUFBSSxrQkFBa0IsZUFBZSxXQUFXLFNBQVMsS0FBTSxRQUFPLEtBQUs7QUFBQSxFQUM3RSxDQUFDO0FBQ0QsU0FBTztBQUNUO0FBR08sU0FBUyxVQUNkLE9BQ0EsS0FDQSxTQUNBLFdBQVcsT0FDUTtBQUNuQixRQUFNLE1BQU0sU0FBUyxVQUFVO0FBQUEsSUFDN0IsS0FBSztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTSxFQUFFLE9BQU8sSUFBSTtBQUFBLEVBQ3JCLENBQUM7QUFDRCxNQUFJLFdBQVc7QUFDZixNQUFJLENBQUMsU0FBVSxLQUFJLGlCQUFpQixTQUFTLE9BQU87QUFDcEQsU0FBTztBQUNUO0FBUU8sU0FBUyxpQkFBaUIsUUFBd0I7QUFDdkQsUUFBTSxTQUFTLFNBQVM7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7QUFDQSxNQUFJLFVBQVUsT0FBTyxlQUFlLEVBQUcsVUFBUyxPQUFPO0FBQ3ZELE1BQUksU0FBUyxHQUFHO0FBQ2QsYUFBUyxnQkFBZ0IsWUFBWSxFQUFFLGlDQUFpQyxHQUFHLE1BQU0sS0FBSyxDQUFDO0FBQUEsRUFDekYsT0FBTztBQUVMLGFBQVMsZ0JBQWdCLE1BQU0sZUFBZSwrQkFBK0I7QUFBQSxFQUMvRTtBQUNBLFNBQU87QUFDVDs7O0FDbkRBLElBQUFDLG1CQUFpRDs7O0FDQWpELHNCQUF5QztBQUdsQyxTQUFTLFlBQVksS0FBcUM7QUFDL0QsUUFBTSxPQUFPLElBQUksVUFBVSxvQkFBb0IsNEJBQVk7QUFDM0QsU0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJO0FBQ2pDO0FBUU8sU0FBUyxjQUFjLEtBQW1CO0FBQy9DLFFBQU0sT0FBTyxJQUFJLFVBQVUsb0JBQW9CLDRCQUFZO0FBQzNELE1BQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxNQUFNLFNBQVUsUUFBTztBQUNqRCxRQUFNLFFBQVEsS0FBSyxTQUFTO0FBQzVCLE1BQUksTUFBTSxXQUFXLEtBQU0sUUFBTztBQUNsQyxNQUFJLE1BQU0sV0FBVyxNQUFPLFFBQU87QUFDbkMsU0FBTyxDQUFDLENBQUMsS0FBSyxVQUFVLGNBQWMsK0NBQStDO0FBQ3ZGO0FBR08sU0FBUyxjQUFjLEtBQVUsTUFBNkM7QUFDbkYsUUFBTSxRQUFRLElBQUksY0FBYyxhQUFhLElBQUk7QUFDakQsU0FBTyxPQUFPLGVBQWU7QUFDL0I7QUFHTyxTQUFTLGtCQUFrQixLQUEwQztBQUMxRSxRQUFNLE9BQU8sSUFBSSxVQUFVLGNBQWM7QUFDekMsU0FBTyxPQUFPLGNBQWMsS0FBSyxJQUFJLElBQUk7QUFDM0M7OztBRGxCTyxJQUFNLG9CQUFvQjtBQUFBLEVBQy9CO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBR0EsSUFBTSxpQkFBaUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBR0EsU0FBUyxNQUFNLElBQTJCO0FBQ3hDLFNBQU8sSUFBSSxRQUFRLENBQUMsWUFBWSxPQUFPLFdBQVcsU0FBUyxFQUFFLENBQUM7QUFDaEU7QUFNQSxTQUFTLFlBQVksUUFBaUMsUUFBdUM7QUFDM0YsYUFBVyxPQUFPLGdCQUFnQjtBQUNoQyxVQUFNLFVBQVUsT0FBTyxHQUFHO0FBQzFCLFFBQUksQ0FBQyxXQUFXLGVBQWUsUUFBUztBQUN4QyxVQUFNLFdBQVcsT0FBTyxHQUFHO0FBQzNCLFFBQUksWUFBWSxFQUFFLGVBQWUsVUFBVztBQUM1QyxXQUFPLEdBQUcsSUFBSTtBQUFBLEVBQ2hCO0FBRUEsYUFBVyxPQUFPO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixHQUFHO0FBQ0QsVUFBTSxRQUFRLE9BQU8sR0FBRztBQUN4QixRQUFJLFVBQVUsVUFBYSxVQUFVLEtBQU07QUFDM0MsUUFBSSxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sV0FBVyxFQUFHO0FBQ2hELFFBQUksT0FBTyxVQUFVLFlBQVksQ0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFLLE9BQU8sS0FBSyxLQUFLLEVBQUUsV0FBVztBQUN0RjtBQUNGLFFBQUksT0FBTyxHQUFHLE1BQU0sT0FBVyxRQUFPLEdBQUcsSUFBSTtBQUFBLEVBQy9DO0FBQ0Y7QUFNQSxTQUFTLFVBQ1AsTUFDQSxTQUN5QjtBQUN6QixRQUFNLE1BQStCLENBQUM7QUFDdEMsYUFBVyxXQUFXLGdCQUFnQjtBQUNwQyxVQUFNLElBQUssS0FBSyxPQUFPLEtBQUssQ0FBQztBQUM3QixVQUFNLElBQUssUUFBUSxPQUFPLEtBQUssQ0FBQztBQUNoQyxVQUFNLE9BQU8sb0JBQUksSUFBSSxDQUFDLEdBQUcsT0FBTyxLQUFLLENBQUMsR0FBRyxHQUFHLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzRCxVQUFNLFFBQTJELENBQUM7QUFDbEUsZUFBVyxPQUFPLE1BQU07QUFDdEIsVUFBSSxFQUFFLEdBQUcsTUFBTSxFQUFFLEdBQUcsR0FBRztBQUNyQixjQUFNLEdBQUcsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssYUFBYSxTQUFTLEVBQUUsR0FBRyxLQUFLLFlBQVk7QUFBQSxNQUM3RTtBQUFBLElBQ0Y7QUFDQSxRQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUUsU0FBUyxFQUFHLEtBQUksT0FBTyxJQUFJO0FBQUEsRUFDcEQ7QUFDQSxTQUFPO0FBQ1Q7QUFHQSxTQUFTLGFBQWEsS0FBMEM7QUFDOUQsUUFBTSxPQUFPLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDM0QsTUFBSSxDQUFDLEtBQU0sUUFBTztBQUNsQixRQUFNLFNBQVMsS0FBSyxRQUFRLE1BQU07QUFDbEMsUUFBTSxZQUFZLEtBQUs7QUFHdkIsUUFBTSxPQUFPLENBQUMsU0FBdUM7QUFDbkQsZUFBVyxPQUFPLE1BQU07QUFDdEIsWUFBTSxLQUFLLFVBQVUsY0FBMkIsR0FBRztBQUNuRCxVQUFJLEdBQUksUUFBTztBQUFBLElBQ2pCO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFDQSxRQUFNLFFBQVEsQ0FBQyxJQUF3QixVQUE0QztBQUNqRixRQUFJLENBQUMsR0FBSSxRQUFPLEVBQUUsYUFBYSwyQkFBMkI7QUFDMUQsVUFBTSxLQUFLLGlCQUFpQixFQUFFO0FBQzlCLFVBQU0sTUFBOEIsQ0FBQztBQUNyQyxlQUFXLEtBQUssT0FBTztBQUNyQixZQUFNLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLEtBQUs7QUFDdEMsVUFBSSxFQUFHLEtBQUksQ0FBQyxJQUFJO0FBQUEsSUFDbEI7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNBLFFBQU0sT0FBTyxpQkFBaUIsU0FBUyxJQUFJO0FBQzNDLFFBQU0sU0FBUyxDQUFDLFNBQXlCLEtBQUssaUJBQWlCLElBQUksRUFBRSxLQUFLO0FBRTFFLFFBQU0sWUFBWSxLQUFLO0FBQUEsSUFDckIsU0FDSSw4Q0FDQTtBQUFBLEVBQ04sQ0FBQztBQUNELFFBQU0sT0FBTyxLQUFLO0FBQUEsSUFDaEIsU0FDSSxnRUFDQTtBQUFBLEVBQ04sQ0FBQztBQUNELFFBQU0sS0FBSyxLQUFLO0FBQUEsSUFDZCxTQUFTLCtDQUErQztBQUFBLElBQ3hELFNBQ0kscUNBQ0E7QUFBQSxFQUNOLENBQUM7QUFDRCxRQUFNLFdBQVcsS0FBSztBQUFBLElBQ3BCLFNBQVMscURBQXFEO0FBQUEsSUFDOUQsU0FBUyx1QkFBdUI7QUFBQSxFQUNsQyxDQUFDO0FBQ0QsUUFBTSxNQUFNLEtBQUs7QUFBQSxJQUNmLFNBQ0ksc0NBQ0E7QUFBQSxJQUNKLFNBQVMsa0RBQWtEO0FBQUEsSUFDM0QsU0FBUyxxREFBcUQ7QUFBQSxFQUNoRSxDQUFDO0FBQ0QsUUFBTSxRQUFRLEtBQUs7QUFBQSxJQUNqQixTQUFTLDZDQUE2QztBQUFBLElBQ3RELFNBQ0ksaURBQ0E7QUFBQSxFQUNOLENBQUM7QUFDRCxRQUFNLGFBQWEsS0FBSztBQUFBLElBQ3RCLFNBQVMsdUNBQXVDO0FBQUEsSUFDaEQsU0FDSSxrREFDQTtBQUFBLEVBQ04sQ0FBQztBQUNELFFBQU0sUUFBUSxLQUFLO0FBQUEsSUFDakIsU0FBUyx3Q0FBd0M7QUFBQSxJQUNqRCxTQUFTLG1CQUFtQjtBQUFBLEVBQzlCLENBQUM7QUFDRCxRQUFNLE1BQU0sS0FBSztBQUFBLElBQ2YsU0FBUyxzQ0FBc0M7QUFBQSxJQUMvQyxTQUFTLGlCQUFpQjtBQUFBLElBQzFCO0FBQUE7QUFBQSxFQUNGLENBQUM7QUFDRCxRQUFNLEtBQUssS0FBSztBQUFBLElBQ2QsU0FBUyxxQ0FBcUM7QUFBQSxJQUM5QyxTQUFTLGdCQUFnQjtBQUFBLElBQ3pCLFNBQVMsV0FBVztBQUFBLEVBQ3RCLENBQUM7QUFNRCxRQUFNLGtCQUFrQixVQUFVLGNBQWMsK0JBQStCLEdBQUcsYUFBYTtBQUMvRixRQUFNLFVBQW9CLENBQUM7QUFDM0IsTUFBSSxRQUFRO0FBQ1YsVUFBTSxPQUFPLG9CQUFJLElBQVk7QUFDN0IsY0FDRyxpQkFBaUIsaUNBQWlDLEVBQ2xELFFBQVEsQ0FBQyxPQUFPLEtBQUssSUFBSSxHQUFHLFFBQVEsWUFBWSxDQUFDLENBQUM7QUFDckQsWUFBUSxLQUFLLEdBQUcsSUFBSTtBQUFBLEVBQ3RCO0FBS0EsUUFBTSxZQUEwRCxDQUFDO0FBQ2pFLE1BQUksUUFBUTtBQUNWLGNBQVUsaUJBQWlCLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxJQUFJLE1BQU07QUFDbEUsVUFBSSxLQUFLLEVBQUc7QUFDWixZQUFNLEtBQUssaUJBQWlCLEVBQUU7QUFDOUIsZ0JBQVUsS0FBSztBQUFBLFFBQ2IsV0FBVyxHQUFHO0FBQUEsUUFDZCxhQUFhLEdBQUcsaUJBQWlCLGNBQWMsRUFBRSxLQUFLO0FBQUEsTUFDeEQsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0g7QUFJQSxRQUFNLG1CQUFtQixNQUFNO0FBQzdCLFVBQU0sTUFBTSxTQUNSLDhDQUNBO0FBQ0osVUFBTSxLQUFLLFVBQVUsY0FBMkIsR0FBRztBQUNuRCxXQUFPLEtBQUssaUJBQWlCLEVBQUUsRUFBRSxVQUFVO0FBQUEsRUFDN0MsR0FBRztBQUNILFFBQU0sZUFBZSxNQUFNO0FBQ3pCLFFBQUksQ0FBQyxHQUFJLFFBQU87QUFDaEIsUUFBSSxNQUFNO0FBQ1YsUUFBSSxPQUEyQjtBQUMvQixXQUFPLFFBQVEsU0FBUyxhQUFhLFNBQVMsU0FBUyxNQUFNO0FBQzNELGFBQU8sS0FBSztBQUNaLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFDQSxXQUFPO0FBQUEsRUFDVCxHQUFHO0FBSUgsUUFBTSxTQUFTLFNBQ1gsVUFBVSxjQUEyQixhQUFhLElBQ2xELFVBQVUsY0FBMkIsK0NBQStDO0FBQ3hGLFFBQU0sa0JBQWtCLE1BQU07QUFDNUIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFRLFFBQU87QUFDM0IsV0FBTyxLQUFLLE1BQU0sR0FBRyxzQkFBc0IsRUFBRSxNQUFNLE9BQU8sc0JBQXNCLEVBQUUsR0FBRztBQUFBLEVBQ3ZGLEdBQUc7QUFDSCxRQUFNLG1CQUFtQixNQUFNO0FBQzdCLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBUSxRQUFPO0FBQzNCLFdBQU8sS0FBSyxNQUFNLEdBQUcsc0JBQXNCLEVBQUUsT0FBTyxPQUFPLHNCQUFzQixFQUFFLElBQUk7QUFBQSxFQUN6RixHQUFHO0FBQ0gsUUFBTSxtQkFBbUIsTUFBTTtBQUM3QixRQUFJLENBQUMsT0FBUSxRQUFPO0FBQ3BCLFdBQU8sTUFBTSxLQUFLLE9BQU8sUUFBUSxFQUM5QixNQUFNLEdBQUcsQ0FBQyxFQUNWLElBQUksQ0FBQyxPQUFPO0FBQ1gsWUFBTSxLQUFLLGlCQUFpQixFQUFFO0FBQzlCLGFBQU87QUFBQSxRQUNMLEtBQU0sR0FBbUIsYUFBYSxHQUFHLFFBQVEsWUFBWTtBQUFBLFFBQzdELFNBQVMsR0FBRztBQUFBLFFBQ1osUUFBUSxLQUFLLE1BQU0sR0FBRyxzQkFBc0IsRUFBRSxNQUFNO0FBQUEsUUFDcEQsV0FBVyxHQUFHO0FBQUEsUUFDZCxZQUFZLEdBQUc7QUFBQSxRQUNmLGNBQWMsR0FBRztBQUFBLFFBQ2pCLGVBQWUsR0FBRztBQUFBLE1BQ3BCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDTCxHQUFHO0FBSUgsUUFBTSxZQUFZLE1BQU07QUFDdEIsUUFBSSxDQUFDLE9BQVEsUUFBTztBQUNwQixVQUFNLFFBQTJELENBQUM7QUFDbEUsUUFBSSxPQUEyQjtBQUMvQixXQUFPLFFBQVEsU0FBUyxhQUFhLFNBQVMsU0FBUyxNQUFNO0FBQzNELFlBQU0sS0FBSyxpQkFBaUIsSUFBSTtBQUNoQyxZQUFNLEtBQUs7QUFBQSxRQUNULEtBQUssS0FBSyxhQUFhLEtBQUssUUFBUSxZQUFZO0FBQUEsUUFDaEQsUUFBUSxHQUFHO0FBQUEsUUFDWCxRQUFRLEdBQUc7QUFBQSxNQUNiLENBQUM7QUFDRCxhQUFPLEtBQUs7QUFBQSxJQUNkO0FBQ0EsV0FBTztBQUFBLEVBQ1QsR0FBRztBQUtILFFBQU0sZUFBZSxNQUFNO0FBQ3pCLFFBQUksQ0FBQyxPQUFRLFFBQU87QUFDcEIsVUFBTSxVQUFVLFVBQVUsY0FBMkIsYUFBYTtBQUNsRSxRQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsYUFBYSxtQkFBbUIsRUFBRyxRQUFPO0FBQ25FLFVBQU0sS0FBSyxpQkFBaUIsU0FBUyxVQUFVO0FBQy9DLFdBQU87QUFBQSxNQUNMLFNBQVMsR0FBRztBQUFBLE1BQ1osU0FBUyxHQUFHO0FBQUEsTUFDWixVQUFVLEdBQUc7QUFBQSxNQUNiLEtBQUssR0FBRztBQUFBLE1BQ1IsTUFBTSxHQUFHO0FBQUEsTUFDVCxZQUFZLEdBQUc7QUFBQSxNQUNmLFlBQVksR0FBRztBQUFBLE1BQ2YsVUFBVSxHQUFHO0FBQUEsTUFDYixZQUFZLEdBQUc7QUFBQSxNQUNmLFlBQVksR0FBRztBQUFBLE1BQ2YsYUFBYSxHQUFHO0FBQUEsTUFDaEIsT0FBTyxHQUFHO0FBQUEsTUFDVixlQUFlLEdBQUc7QUFBQSxNQUNsQixlQUFlLEdBQUc7QUFBQSxNQUNsQixhQUFhLEdBQUc7QUFBQSxNQUNoQixhQUFhLEdBQUc7QUFBQSxNQUNoQixxQkFBcUIsR0FBRztBQUFBLE1BQ3hCLG9CQUFvQixHQUFHO0FBQUEsTUFDdkIsc0JBQXNCLEdBQUc7QUFBQSxNQUN6QixpQkFBaUIsR0FBRztBQUFBLElBQ3RCO0FBQUEsRUFDRixHQUFHO0FBRUgsUUFBTSxPQUFPO0FBQUEsSUFDWCxNQUFNLFNBQVMsd0JBQXdCO0FBQUE7QUFBQSxJQUV2QyxjQUFjLFNBQVMsS0FBSyxVQUFVLFNBQVMsb0JBQW9CO0FBQUEsSUFDbkUsU0FBUyxTQUFTLFVBQVU7QUFBQSxJQUM1QixpQkFBaUIsU0FBUyxrQkFBa0I7QUFBQSxJQUM1QyxhQUFhLFNBQVMsY0FBYyxHQUFHLElBQUk7QUFBQSxJQUMzQyxXQUFXLFNBQVMsWUFBWTtBQUFBLElBQ2hDLDBCQUEwQjtBQUFBLElBQzFCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsT0FBTztBQUFBLElBQ1AsV0FBVyxNQUFNLFdBQVc7QUFBQSxNQUMxQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVcsTUFBTSxNQUFNO0FBQUEsTUFDckI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxJQUFJLE1BQU0sSUFBSTtBQUFBLE1BQ1o7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxVQUFVLE1BQU0sVUFBVTtBQUFBLE1BQ3hCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVcsTUFBTSxLQUFLO0FBQUEsTUFDcEI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxZQUFZLE1BQU0sT0FBTztBQUFBLE1BQ3ZCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsWUFBWSxNQUFNLFlBQVk7QUFBQSxNQUM1QjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsT0FBTyxNQUFNLE9BQU8sQ0FBQyxhQUFhLGVBQWUsU0FBUyxpQkFBaUIsQ0FBQztBQUFBLElBQzVFLE9BQU8sTUFBTSxLQUFLLENBQUMsV0FBVyxlQUFlLGdCQUFnQixhQUFhLE9BQU8sQ0FBQztBQUFBLElBQ2xGLGdCQUFnQixNQUFNLElBQUksQ0FBQyxjQUFjLGlCQUFpQixvQkFBb0IsUUFBUSxDQUFDO0FBQUEsSUFDdkYsY0FBYztBQUFBLE1BQ1osZUFBZSxPQUFPLGFBQWE7QUFBQSxNQUNuQyx3QkFBd0IsT0FBTyxzQkFBc0I7QUFBQSxNQUNyRCxhQUFhLE9BQU8sV0FBVztBQUFBLE1BQy9CLG9CQUFvQixPQUFPLGtCQUFrQjtBQUFBLE1BQzdDLGVBQWUsT0FBTyxhQUFhO0FBQUEsTUFDbkMsZ0JBQWdCLE9BQU8sY0FBYztBQUFBLE1BQ3JDLGNBQWMsT0FBTyxZQUFZO0FBQUEsTUFDakMsbUJBQW1CLE9BQU8saUJBQWlCO0FBQUEsTUFDM0Msc0JBQXNCLE9BQU8sb0JBQW9CO0FBQUEsTUFDakQsZUFBZSxPQUFPLGFBQWE7QUFBQSxNQUNuQyxrQkFBa0IsT0FBTyxnQkFBZ0I7QUFBQSxNQUN6QyxpQkFBaUIsT0FBTyxlQUFlO0FBQUEsTUFDdkMsZUFBZSxPQUFPLGFBQWE7QUFBQSxNQUNuQyxrQkFBa0IsT0FBTyxnQkFBZ0I7QUFBQSxNQUN6QyxpQkFBaUIsT0FBTyxlQUFlO0FBQUEsTUFDdkMsd0JBQXdCLE9BQU8sc0JBQXNCO0FBQUEsTUFDckQsaUNBQWlDLE9BQU8sK0JBQStCO0FBQUEsTUFDdkUsa0JBQWtCLE9BQU8sZ0JBQWdCO0FBQUEsTUFDekMscUJBQXFCLE9BQU8sbUJBQW1CO0FBQUEsTUFDL0Msc0JBQXNCLE9BQU8sb0JBQW9CO0FBQUEsTUFDakQsb0JBQW9CLE9BQU8sa0JBQWtCO0FBQUEsSUFDL0M7QUFBQSxFQUNGO0FBQ0EsU0FBTztBQUNUO0FBVUEsZUFBc0IsZUFBZSxRQUEyQztBQUM5RSxRQUFNLE1BQU0sT0FBTztBQUNuQixNQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsU0FBUyxvQkFBb0IsR0FBRztBQUMzRCxRQUFJLHdCQUFPLHFFQUFxRTtBQUNoRjtBQUFBLEVBQ0Y7QUFDQSxRQUFNLE9BQU8sSUFBSSxVQUFVLG9CQUFvQiw2QkFBWTtBQUMzRCxNQUFJLENBQUMsTUFBTTtBQUNULFFBQUksd0JBQU8sd0NBQXdDO0FBQ25EO0FBQUEsRUFDRjtBQUNBLFFBQU0sWUFBWSxLQUFLLFFBQVE7QUFDL0IsUUFBTSxhQUFhLElBQUksVUFBVSxjQUFjO0FBQy9DLFFBQU0sT0FBTyxJQUFJLFVBQVUsUUFBUSxLQUFLO0FBR3hDLFFBQU0sT0FBZ0MsQ0FBQztBQUN2QyxhQUFXLFFBQVEsbUJBQW1CO0FBQ3BDLFVBQU0sSUFBSSxJQUFJLE1BQU0sc0JBQXNCLFNBQVMsSUFBSSxLQUFLO0FBQzVELFFBQUksRUFBRSxhQUFhLHdCQUFRO0FBQzNCLFVBQU0sS0FBSyxTQUFTLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxTQUFTLEVBQUUsQ0FBQztBQUNwRCxVQUFNLE1BQU0sR0FBRztBQUNmLFVBQU0sSUFBSSxhQUFhLEdBQUc7QUFDMUIsUUFBSSxFQUFHLGFBQVksTUFBTSxDQUFDO0FBQUEsRUFDNUI7QUFHQSxNQUFJLFVBQTBDO0FBQzlDLFFBQU0sT0FBTyxJQUFJLE1BQU0sc0JBQXNCLDBCQUEwQjtBQUN2RSxNQUFJLGdCQUFnQix3QkFBTztBQUN6QixVQUFNLEtBQUssU0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sVUFBVSxFQUFFLENBQUM7QUFDeEQsVUFBTSxNQUFNLEdBQUc7QUFDZixjQUFVLGFBQWEsR0FBRztBQUFBLEVBQzVCO0FBR0EsTUFBSSxZQUFZO0FBQ2QsVUFBTSxLQUFLLFNBQVMsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsRUFBRSxDQUFDO0FBQzlELFdBQU8sUUFBUTtBQUFBLEVBQ2pCO0FBQ0EsTUFBSSxDQUFDLFNBQVM7QUFDWixRQUFJLHdCQUFPLHNDQUFzQztBQUNqRDtBQUFBLEVBQ0Y7QUFFQSxRQUFNLFVBQVUsRUFBRSxNQUFNLFNBQVMsTUFBTSxVQUFVLE1BQU0sT0FBTyxFQUFFO0FBQ2hFLE1BQUk7QUFDRixVQUFNLElBQUksTUFBTSxRQUFRLE1BQU0sNkJBQTZCLEtBQUssVUFBVSxTQUFTLE1BQU0sQ0FBQyxDQUFDO0FBQzNGLFFBQUksd0JBQU8sK0RBQTBEO0FBQUEsRUFDdkUsU0FBUyxPQUFPO0FBQ2QsUUFBSSx3QkFBTyw4Q0FBOEMsT0FBTyxLQUFLLENBQUMsR0FBRztBQUFBLEVBQzNFO0FBQ0Y7QUFHTyxTQUFTLHFCQUFxQixRQUFrQztBQUNyRSxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixVQUFVLE1BQU0sS0FBSyxlQUFlLE1BQU07QUFBQSxFQUM1QyxDQUFDO0FBQ0g7OztBRWhmTyxJQUFNLGdCQUF3QztBQUFBLEVBQ25ELEVBQUUsSUFBSSxPQUFPLE9BQU8sZ0JBQWdCO0FBQUEsRUFDcEMsRUFBRSxJQUFJLFVBQVUsT0FBTyxpQkFBaUI7QUFBQSxFQUN4QyxFQUFFLElBQUksU0FBUyxPQUFPLGFBQWE7QUFBQSxFQUNuQyxFQUFFLElBQUksV0FBVyxPQUFPLFVBQVU7QUFBQSxFQUNsQyxFQUFFLElBQUksVUFBVSxPQUFPLGNBQWM7QUFBQSxFQUNyQyxFQUFFLElBQUksU0FBUyxPQUFPLGdCQUFnQjtBQUN4QztBQThCTyxJQUFNLG1CQUF5QztBQUFBLEVBQ3BELGdCQUFnQjtBQUFBLEVBQ2hCLGlCQUFpQjtBQUFBLEVBQ2pCLGNBQWM7QUFBQSxFQUNkLGVBQWU7QUFBQSxFQUNmLFdBQVc7QUFBQSxFQUNYLGlCQUFpQjtBQUFBLEVBQ2pCLGdCQUFnQjtBQUFBLEVBQ2hCLGFBQWE7QUFBQSxFQUNiLGFBQWE7QUFBQSxFQUNiLGVBQWU7QUFBQSxFQUNmLG1CQUFtQjtBQUFBLEVBQ25CLHFCQUFxQjtBQUN2QjtBQUdPLElBQU0sV0FBVzs7O0FDdERqQixTQUFTLGlCQUFpQixRQUFrQztBQUVqRSxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixVQUFVLFlBQVk7QUFDcEIsYUFBTyxTQUFTLFlBQVksQ0FBQyxPQUFPLFNBQVM7QUFDN0MsWUFBTSxPQUFPLGFBQWE7QUFDMUIsYUFBTyxRQUFRO0FBQUEsSUFDakI7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixVQUFVLE1BQU0sS0FBSyxPQUFPLG9CQUFvQjtBQUFBLEVBQ2xELENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsT0FBTyxPQUFPLEdBQUcsS0FBSyxJQUFJLENBQUM7QUFBQSxJQUNuRCxlQUFlLENBQUMsYUFBYTtBQUMzQixVQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsU0FBUyxvQkFBb0IsRUFBRyxRQUFPO0FBQ3BFLFVBQUksQ0FBQyxTQUFVLFFBQU8sY0FBYztBQUNwQyxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUVELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxPQUFPLE9BQU8sR0FBRyxLQUFLLFlBQVksQ0FBQztBQUFBLElBQzNELFVBQVUsTUFBTSxPQUFPLFNBQVMsTUFBTTtBQUFBLEVBQ3hDLENBQUM7QUFDRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsT0FBTyxPQUFPLEdBQUcsS0FBSyxhQUFhLENBQUM7QUFBQSxJQUM1RCxVQUFVLE1BQU0sT0FBTyxTQUFTLE1BQU07QUFBQSxFQUN4QyxDQUFDO0FBRUQsU0FBTyxXQUFXO0FBQUEsSUFDaEIsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLEVBQUUsV0FBVyxDQUFDLE9BQU8sT0FBTyxHQUFHLEtBQUssSUFBSSxDQUFDO0FBQUE7QUFBQTtBQUFBLElBR25ELGVBQWUsQ0FBQyxhQUFhO0FBQzNCLFlBQU0sT0FBTyxPQUFPLElBQUksVUFBVSxjQUFjO0FBQ2hELFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxZQUFZLFNBQVMsSUFBSSxFQUFHLFFBQU87QUFDeEQsWUFBTSxPQUFPLE9BQU8sWUFBWSxlQUFlLElBQUk7QUFDbkQsVUFBSSxDQUFDLEtBQU0sUUFBTztBQUNsQixVQUFJLENBQUMsU0FBVSxNQUFLLE9BQU8sWUFBWSxrQkFBa0IsTUFBTSxJQUFJO0FBQ25FLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBR0QsU0FBTyxXQUFXO0FBQUEsSUFDaEIsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBO0FBQUE7QUFBQSxJQUdOLFVBQVUsTUFBTSxLQUFLLE9BQU8sWUFBWSxpQkFBaUIsT0FBTyxZQUFZLGNBQWMsQ0FBQztBQUFBLEVBQzdGLENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsT0FBTyxPQUFPLEdBQUcsS0FBSyxJQUFJLENBQUM7QUFBQSxJQUNuRCxlQUFlLENBQUMsYUFBYTtBQUMzQixZQUFNLE9BQU8sT0FBTyxJQUFJLFVBQVUsY0FBYztBQUNoRCxVQUFJLENBQUMsS0FBTSxRQUFPO0FBQ2xCLFlBQU0sS0FBSyxjQUFjLE9BQU8sS0FBSyxJQUFJO0FBQ3pDLFVBQUksT0FBTyxRQUFRLEVBQUUsWUFBWSxJQUFLLFFBQU87QUFDN0MsVUFBSSxDQUFDLFNBQVUsUUFBTyxhQUFhO0FBQ25DLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBRUQsTUFBSSxLQUFVLHNCQUFxQixNQUFNO0FBQzNDOzs7QUN4RkEsSUFBQUMsbUJBQW1DOzs7QUNVNUIsSUFBTSxpQkFBaUI7QUErQnZCLFNBQVMsWUFDZCxhQUNBLFVBQ0EsU0FDaUI7QUFJakIsUUFBTSxjQUFjLG9CQUFJLElBQVksQ0FBQyxXQUFXLENBQUM7QUFDakQsTUFBSSxPQUFPO0FBQ1gsYUFBUztBQUNQLFVBQU0sT0FBTyxRQUFRLElBQUk7QUFDekIsUUFBSSxDQUFDLFFBQVEsWUFBWSxJQUFJLElBQUksRUFBRztBQUNwQyxnQkFBWSxJQUFJLElBQUk7QUFDcEIsV0FBTztBQUFBLEVBQ1Q7QUFHQSxRQUFNLFFBQWtCLENBQUM7QUFDekIsUUFBTSxVQUFVLG9CQUFJLElBQVk7QUFDaEMsTUFBSSxNQUEwQjtBQUM5QixTQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksR0FBRyxHQUFHO0FBQy9CLFlBQVEsSUFBSSxHQUFHO0FBQ2YsVUFBTSxLQUFLLEdBQUc7QUFDZCxVQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFBQSxFQUN2QjtBQUVBLFFBQU0sUUFBUSxNQUFNLFFBQVEsV0FBVztBQUN2QyxNQUFJLFVBQVUsR0FBSSxRQUFPO0FBQ3pCLFNBQU8sRUFBRSxPQUFPLE1BQU07QUFDeEI7QUFPTyxTQUFTLGFBQWEsT0FBZ0IsTUFBYyxnQkFBMEI7QUFDbkYsUUFBTSxPQUFrQixDQUFDO0FBQ3pCLFFBQU0sVUFBVSxDQUFDLE1BQXFCO0FBQ3BDLFFBQUksTUFBTSxRQUFRLENBQUMsR0FBRztBQUNwQixpQkFBVyxRQUFRLEVBQUcsU0FBUSxJQUFJO0FBQUEsSUFDcEMsT0FBTztBQUNMLFdBQUssS0FBSyxDQUFDO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFDQSxVQUFRLEtBQUs7QUFFYixRQUFNLE1BQWdCLENBQUM7QUFDdkIsYUFBVyxRQUFRLE1BQU07QUFDdkIsVUFBTSxPQUFPLGdCQUFnQixJQUFJO0FBQ2pDLFFBQUksS0FBTSxLQUFJLEtBQUssSUFBSTtBQUN2QixRQUFJLElBQUksVUFBVSxJQUFLO0FBQUEsRUFDekI7QUFDQSxTQUFPO0FBQ1Q7QUFPTyxTQUFTLGdCQUFnQixPQUFnQixNQUFjLGdCQUEwQjtBQUN0RixRQUFNLE9BQWtCLENBQUM7QUFDekIsUUFBTSxVQUFVLENBQUMsTUFBcUI7QUFDcEMsUUFBSSxNQUFNLFFBQVEsQ0FBQyxHQUFHO0FBQ3BCLGlCQUFXLFFBQVEsRUFBRyxTQUFRLElBQUk7QUFBQSxJQUNwQyxPQUFPO0FBQ0wsV0FBSyxLQUFLLENBQUM7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUNBLFVBQVEsS0FBSztBQUViLFFBQU0sTUFBZ0IsQ0FBQztBQUN2QixhQUFXLFFBQVEsTUFBTTtBQUN2QixRQUFJLE9BQU8sU0FBUyxTQUFVO0FBQzlCLFVBQU0sVUFBVSxLQUFLLEtBQUs7QUFDMUIsUUFBSSxDQUFDLFFBQVM7QUFDZCxRQUFJLEtBQUssT0FBTztBQUNoQixRQUFJLElBQUksVUFBVSxJQUFLO0FBQUEsRUFDekI7QUFDQSxTQUFPO0FBQ1Q7QUFVTyxTQUFTLGdCQUFnQixPQUErQjtBQUM3RCxNQUFJLE9BQU8sVUFBVSxTQUFVLFFBQU87QUFDdEMsUUFBTSxVQUFVLE1BQU0sS0FBSztBQUMzQixNQUFJLENBQUMsUUFBUyxRQUFPO0FBQ3JCLFNBQU8sUUFBUSxRQUFRLFNBQVMsRUFBRSxFQUFFLFFBQVEsU0FBUyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLO0FBQzVGO0FBR08sU0FBUyxZQUFZLE9BQXdCO0FBQ2xELE1BQUksVUFBVSxRQUFRLFVBQVUsT0FBVyxRQUFPO0FBQ2xELFVBQVEsT0FBTyxPQUFPO0FBQUEsSUFDcEIsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxVQUFJO0FBQ0YsZUFBTyxLQUFLLFVBQVUsS0FBSyxLQUFLO0FBQUEsTUFDbEMsUUFBUTtBQUVOLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRixLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQ0gsYUFBTyxPQUFPLEtBQUs7QUFBQSxJQUNyQjtBQUVFLGFBQU8sT0FBTztBQUFBLEVBQ2xCO0FBQ0Y7OztBQ2hHTyxTQUFTLGVBQWUsT0FBaUQ7QUFDOUUsUUFBTSxFQUFFLGFBQWEsYUFBYSxJQUFJO0FBQ3RDLFFBQU0sV0FBVyxhQUFhLENBQUM7QUFFL0IsTUFBSSxVQUFVO0FBQ1osVUFBTSxXQUFXLGdCQUFnQixRQUFRO0FBQ3pDLFFBQUksWUFBWSxZQUFZLFFBQVEsS0FBSyxhQUFhLGFBQWE7QUFDakUsVUFBSSxDQUFDLE1BQU0sY0FBYyxJQUFJLFFBQVEsR0FBRztBQUd0QyxlQUFPLEVBQUUsU0FBUyxVQUFVLGNBQWMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQUEsTUFDN0Q7QUFFQSxZQUFNQyxXQUFVLFdBQVcsR0FBRyxXQUFXLFNBQVMsTUFBTSxhQUFhO0FBQ3JFLGFBQU87QUFBQSxRQUNMLFNBQUFBO0FBQUEsUUFDQSxjQUFjLENBQUMsUUFBUTtBQUFBLFFBQ3ZCLFVBQVUsQ0FBQyxFQUFFLE1BQU0sYUFBYSxNQUFNLENBQUMsS0FBS0EsUUFBTyxJQUFJLEVBQUUsQ0FBQztBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUFBLEVBR0Y7QUFHQSxRQUFNLFVBQVUsV0FBVyxHQUFHLFdBQVcsU0FBUyxNQUFNLGFBQWE7QUFDckUsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLGNBQWMsQ0FBQztBQUFBLElBQ2YsVUFBVSxDQUFDLEVBQUUsTUFBTSxhQUFhLE1BQU0sQ0FBQyxLQUFLLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFBQSxFQUM1RDtBQUNGO0FBU08sU0FBUyxjQUFjLE9BQXlEO0FBQ3JGLFNBQU87QUFBQSxJQUNMLFNBQVMsV0FBVyxtQkFBbUIsTUFBTSxhQUFhO0FBQUEsSUFDMUQsY0FBYyxDQUFDO0FBQUEsSUFDZixVQUFVLENBQUM7QUFBQSxFQUNiO0FBQ0Y7QUFHQSxTQUFTLFlBQVksTUFBdUI7QUFDMUMsU0FBTyxLQUFLLFNBQVMsS0FBSyxDQUFDLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLFNBQVMsSUFBSTtBQUN0RTtBQUdBLFNBQVMsV0FBVyxNQUFjLFVBQStCO0FBQy9ELE1BQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFHLFFBQU87QUFDaEMsV0FBUyxJQUFJLEtBQUssS0FBSztBQUNyQixVQUFNLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQztBQUM5QixRQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsRUFBRyxRQUFPO0FBQUEsRUFDdkM7QUFDRjs7O0FDMUZPLFNBQVMsaUJBQ2QsT0FDQSxhQUNpQjtBQUNqQixRQUFNLFdBQTRCLENBQUM7QUFDbkMsV0FBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUNyQyxVQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxRQUFRLFlBQVksSUFBSSxJQUFJLEVBQUc7QUFFcEMsUUFBSSxJQUFJLElBQUk7QUFDWixXQUFPLElBQUksTUFBTSxVQUFVLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFHO0FBQ3RELFVBQU0sV0FBVyxJQUFJLE1BQU0sU0FBUyxNQUFNLENBQUMsSUFBSTtBQUMvQyxVQUFNLFVBQVUsY0FBYyxNQUFNLElBQUksQ0FBQyxLQUFLO0FBQzlDLFFBQUksUUFBUyxVQUFTLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUFBLEVBQy9DO0FBQ0EsU0FBTztBQUNUO0FBUU8sU0FBUyxnQkFDZCxPQUNBLGFBQ0EsV0FDZTtBQUNmLE1BQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxJQUFJLFNBQVMsRUFBRyxRQUFPO0FBQ3RELFFBQU0sUUFBUSxNQUFNLFFBQVEsU0FBUztBQUNyQyxNQUFJLFVBQVUsR0FBSSxRQUFPO0FBQ3pCLFdBQVMsSUFBSSxRQUFRLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUM3QyxRQUFJLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUcsUUFBTyxNQUFNLENBQUM7QUFBQSxFQUNoRDtBQUNBLFdBQVMsSUFBSSxRQUFRLEdBQUcsS0FBSyxHQUFHLEtBQUs7QUFDbkMsUUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFHLFFBQU8sTUFBTSxDQUFDO0FBQUEsRUFDaEQ7QUFDQSxTQUFPO0FBQ1Q7OztBSHRETyxJQUFNLGNBQU4sTUFBa0I7QUFBQSxFQUN2QixZQUFvQixLQUFVO0FBQVY7QUFBQSxFQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTy9CLFNBQVMsTUFBc0I7QUFDN0IsVUFBTSxLQUFLLGNBQWMsS0FBSyxLQUFLLElBQUk7QUFDdkMsV0FBUSxPQUFPLFFBQVEsWUFBWSxNQUFPLEtBQUssT0FBTyxLQUFLLElBQUksTUFBTTtBQUFBLEVBQ3ZFO0FBQUE7QUFBQSxFQUdBLFFBQVEsTUFBOEI7QUFDcEMsUUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLEVBQUcsUUFBTztBQUNqQyxXQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxDQUFDLFNBQVMsS0FBSyxVQUFVLElBQUk7QUFBQSxNQUM3QixDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUk7QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR1EsVUFBVSxNQUF3QjtBQUN4QyxVQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sc0JBQXNCLElBQUk7QUFDbkQsUUFBSSxFQUFFLGFBQWEsd0JBQVEsUUFBTyxDQUFDO0FBQ25DLFVBQU0sS0FBSyxjQUFjLEtBQUssS0FBSyxDQUFDO0FBQ3BDLFVBQU0sUUFBUSxLQUFLLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2pELFdBQU8sTUFDSixJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksY0FBYyxxQkFBcUIsTUFBTSxJQUFJLENBQUMsRUFDckUsT0FBTyxDQUFDLE1BQWtCLENBQUMsQ0FBQyxDQUFDLEVBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSTtBQUFBLEVBQ3RCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT1EsT0FBTyxNQUFrQztBQUMvQyxlQUFXLEtBQUssS0FBSyxJQUFJLE1BQU0saUJBQWlCLEdBQUc7QUFDakQsVUFBSSxFQUFFLFNBQVMsS0FBTTtBQUNyQixVQUFJLEtBQUssVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBTSxRQUFPLEVBQUU7QUFBQSxJQUNuRDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQSxFQUdBLE9BQU8sTUFBdUI7QUFDNUIsVUFBTSxLQUFLLGNBQWMsS0FBSyxLQUFLLElBQUk7QUFDdkMsVUFBTSxRQUFRLEtBQUssYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDakQsV0FBTyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLGNBQWMscUJBQXFCLE1BQU0sS0FBSyxJQUFJLENBQUM7QUFBQSxFQUM3RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUUEsZUFBZSxNQUFzQztBQUNuRCxVQUFNLEtBQUssY0FBYyxLQUFLLEtBQUssSUFBSTtBQUN2QyxVQUFNLE1BQU0sS0FBSyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2xELFVBQU0sZ0JBQWdCLElBQUksSUFBSSxLQUFLLElBQUksTUFBTSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUN0RixXQUFPLGVBQUssRUFBRSxhQUFhLEtBQUssVUFBVSxjQUFjLEtBQUssY0FBYyxDQUFDO0FBQUEsRUFDOUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUEsZ0JBQWtDO0FBQ2hDLFVBQU0sZ0JBQWdCLElBQUksSUFBSSxLQUFLLElBQUksTUFBTSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUN0RixXQUFPLGNBQVEsRUFBRSxjQUFjLENBQUM7QUFBQSxFQUNsQztBQUFBO0FBQUEsRUFHQSxNQUFNLGtCQUFrQixNQUFhLE1BQXdCLE9BQU8sTUFBcUI7QUFDdkYsVUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLFVBQVUsS0FBSyxRQUFRLElBQUksR0FBRyxJQUFJO0FBQUEsRUFDckU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFBLE1BQU0saUJBQWlCLE1BQXVDO0FBQzVELFVBQU0sYUFBYSxLQUFLLElBQUksVUFBVSxjQUFjLEdBQUcsUUFBUTtBQUMvRCxVQUFNLEtBQUs7QUFBQSxNQUNUO0FBQUEsTUFDQTtBQUFBLE1BQ0EsVUFBVSxLQUFLLElBQUksWUFBWSxpQkFBaUIsVUFBVSxHQUFHLElBQUk7QUFBQSxJQUNuRTtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsTUFBYyxVQUNaLE1BQ0EsTUFDQSxLQUNBLE9BQU8sTUFDUTtBQUNmLFVBQU0sVUFBVSxHQUFHLEdBQUcsR0FBRyxLQUFLLE9BQU87QUFDckMsVUFBTSxjQUFjLEtBQUssYUFBYSxJQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJO0FBQ25GLFVBQU0sVUFBVTtBQUFBLFNBQWUsV0FBVztBQUFBO0FBQUE7QUFFMUMsUUFBSTtBQUNKLFFBQUk7QUFDRixnQkFBVSxNQUFNLEtBQUssSUFBSSxNQUFNLE9BQU8sU0FBUyxPQUFPO0FBQUEsSUFDeEQsU0FBUyxPQUFPO0FBQ2QsVUFBSSx3QkFBTyxvQ0FBb0MsS0FBSyxPQUFPLFNBQVMsT0FBTyxLQUFLLENBQUMsR0FBRztBQUNwRjtBQUFBLElBQ0Y7QUFHQSxlQUFXLFdBQVcsS0FBSyxVQUFVO0FBQ25DLFVBQUksQ0FBQyxRQUFRLFFBQVEsU0FBUyxLQUFLLFNBQVU7QUFDN0MsWUFBTSxLQUFLLElBQUksWUFBWSxtQkFBbUIsTUFBTSxDQUFDLE9BQWdDO0FBQ25GLFdBQUcsUUFBUSxJQUFJLFFBQVE7QUFBQSxNQUN6QixDQUFDO0FBQUEsSUFDSDtBQUVBLFFBQUksQ0FBQyxLQUFNO0FBR1gsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLFFBQVEsS0FBSztBQUM3QyxVQUFNLEtBQUssU0FBUyxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxFQUFFLENBQUM7QUFBQSxFQUM1RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFTQSxNQUFNLG9CQUNKLE9BQ0EsYUFDQSxXQUM2QjtBQUM3QixVQUFNLFdBQVcsaUJBQWlCLE9BQU8sV0FBVztBQUVwRCxlQUFXLFdBQVcsVUFBVTtBQUM5QixZQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sc0JBQXNCLFFBQVEsSUFBSTtBQUMzRCxVQUFJLEVBQUUsYUFBYSx3QkFBUTtBQUMzQixZQUFNLE9BQU8sUUFBUSxXQUFXLEtBQUssSUFBSSxNQUFNLHNCQUFzQixRQUFRLFFBQVEsSUFBSTtBQUN6RixZQUFNLEtBQUssSUFBSSxZQUFZLG1CQUFtQixHQUFHLENBQUMsT0FBZ0M7QUFDaEYsV0FBRyxRQUFRLElBQUksZ0JBQWdCLHlCQUFRLENBQUMsS0FBSyxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUM7QUFBQSxNQUNyRSxDQUFDO0FBQUEsSUFDSDtBQUVBLFVBQU0sVUFBb0IsQ0FBQztBQUMzQixlQUFXLFFBQVEsYUFBYTtBQUM5QixZQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sc0JBQXNCLElBQUk7QUFDbkQsVUFBSSxFQUFFLGFBQWEsd0JBQVE7QUFDM0IsVUFBSTtBQUNGLGNBQU0sS0FBSyxJQUFJLFlBQVksVUFBVSxDQUFDO0FBQ3RDLGdCQUFRLEtBQUssSUFBSTtBQUFBLE1BQ25CLFNBQVMsT0FBTztBQUNkLFlBQUksd0JBQU8sb0NBQW9DLEVBQUUsUUFBUSxNQUFNLE9BQU8sS0FBSyxDQUFDLEdBQUc7QUFBQSxNQUNqRjtBQUFBLElBQ0Y7QUFFQSxXQUFPLEVBQUUsU0FBUyxhQUFhLGdCQUFnQixPQUFPLGFBQWEsU0FBUyxFQUFFO0FBQUEsRUFDaEY7QUFDRjtBQUdBLFNBQVMsVUFBVSxNQUFrQztBQUNuRCxNQUFJLENBQUMsUUFBUSxTQUFTLElBQUssUUFBTztBQUNsQyxTQUFPLEdBQUcsS0FBSyxRQUFRLFFBQVEsRUFBRSxDQUFDO0FBQ3BDOzs7QUlsTUEsSUFBQUMsbUJBQXFEOzs7QUNBckQsSUFBQUMsbUJBQTJCO0FBRzNCLElBQU0sb0JBQW9CO0FBU25CLElBQU0scUJBQU4sY0FBaUMsdUJBQU07QUFBQSxFQUc1QyxZQUNFLEtBQ1EsT0FDQSxXQUNBLFdBQ1I7QUFDQSxVQUFNLEdBQUc7QUFKRDtBQUNBO0FBQ0E7QUFOVixTQUFRLFlBQVk7QUFBQSxFQVNwQjtBQUFBLEVBRUEsU0FBZTtBQUNiLFNBQUssVUFBVSxNQUFNO0FBQ3JCLFNBQUssUUFBUSxTQUFTLDhCQUE4QjtBQUVwRCxVQUFNLFFBQVEsS0FBSyxNQUFNO0FBQ3pCLFNBQUssVUFBVSxTQUFTLE1BQU07QUFBQSxNQUM1QixLQUFLO0FBQUEsTUFDTCxNQUFNLFVBQVUsSUFBSSx1QkFBdUIsVUFBVSxLQUFLO0FBQUEsSUFDNUQsQ0FBQztBQUNELFNBQUssVUFDRixVQUFVLEVBQUUsS0FBSyxtQ0FBbUMsQ0FBQyxFQUNyRDtBQUFBLE1BQ0MsVUFBVSxJQUNOLHlDQUNBO0FBQUEsSUFDTjtBQUVGLFVBQU0sT0FBTyxLQUFLLFVBQVUsVUFBVSxFQUFFLEtBQUssb0NBQW9DLENBQUM7QUFDbEYsZUFBVyxDQUFDLEdBQUcsSUFBSSxLQUFLLEtBQUssTUFBTSxNQUFNLEdBQUcsaUJBQWlCLEVBQUUsUUFBUSxHQUFHO0FBQ3hFLFlBQU0sTUFBTSxLQUFLLFVBQVUsRUFBRSxLQUFLLG1DQUFtQyxDQUFDO0FBQ3RFLFVBQUksV0FBVyxFQUFFLEtBQUssbUNBQW1DLENBQUMsRUFBRSxRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUM7QUFDakYsVUFBSSxXQUFXLEVBQUUsS0FBSyxvQ0FBb0MsQ0FBQyxFQUFFLFFBQVEsSUFBSTtBQUFBLElBQzNFO0FBQ0EsUUFBSSxLQUFLLE1BQU0sU0FBUyxtQkFBbUI7QUFDekMsV0FDRyxVQUFVLEVBQUUsS0FBSyxvQ0FBb0MsQ0FBQyxFQUN0RCxRQUFRLGNBQVMsS0FBSyxNQUFNLFNBQVMsaUJBQWlCLE9BQU87QUFBQSxJQUNsRTtBQUVBLFNBQUssZ0JBQWdCO0FBQ3JCLFNBQUssYUFBYTtBQUFBLEVBQ3BCO0FBQUE7QUFBQSxFQUdRLGtCQUF3QjtBQUM5QixVQUFNLE1BQU0sS0FBSyxVQUFVLFVBQVUsRUFBRSxLQUFLLHVDQUF1QyxDQUFDO0FBQ3BGLFFBQUksU0FBUyxPQUFPLEVBQUUsUUFBUSxpQkFBaUI7QUFDL0MsVUFBTSxXQUFXLElBQUksU0FBUyxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDM0QsYUFBUyxpQkFBaUIsVUFBVSxNQUFNO0FBQ3hDLFdBQUssS0FBSyxVQUFVLEVBQUU7QUFBQSxRQUNwQixNQUFNO0FBQ0osbUJBQVMsV0FBVztBQUFBLFFBQ3RCO0FBQUEsUUFDQSxNQUFNO0FBQUEsUUFFTjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUE7QUFBQSxFQUdRLGVBQXFCO0FBQzNCLFVBQU0sVUFBVSxLQUFLLFVBQVUsVUFBVSxFQUFFLEtBQUssdUNBQXVDLENBQUM7QUFDeEYsWUFBUSxTQUFTLFVBQVUsRUFBRSxNQUFNLFNBQVMsQ0FBQyxFQUFFLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxNQUFNLENBQUM7QUFDM0YsWUFDRyxTQUFTLFVBQVUsRUFBRSxNQUFNLFVBQVUsS0FBSyxjQUFjLENBQUMsRUFDekQsaUJBQWlCLFNBQVMsTUFBTTtBQUMvQixXQUFLLFlBQVk7QUFDakIsV0FBSyxNQUFNO0FBQUEsSUFDYixDQUFDO0FBQUEsRUFDTDtBQUFBLEVBRUEsVUFBZ0I7QUFDZCxRQUFJLEtBQUssVUFBVyxNQUFLLFVBQVU7QUFBQSxFQUNyQztBQUNGOzs7QURwRk8sSUFBTSxvQkFBb0I7QUFhMUIsSUFBTSxrQkFBTixjQUE4QiwwQkFBUztBQUFBLEVBVTVDLFlBQ1UsUUFDUixNQUNBO0FBQ0EsVUFBTSxJQUFJO0FBSEY7QUFUVjtBQUFBLFNBQVEsWUFBc0IsQ0FBQztBQUUvQjtBQUFBLFNBQVEsUUFBNkMsQ0FBQztBQUV0RDtBQUFBLFNBQVEsV0FBVyxvQkFBSSxJQUFZO0FBRW5DO0FBQUEsU0FBUSxTQUF3QjtBQUFBLEVBT2hDO0FBQUEsRUFFQSxjQUFzQjtBQUNwQixXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsaUJBQXlCO0FBQ3ZCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFQSxVQUFrQjtBQUNoQixXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsTUFBTSxTQUF3QjtBQUM1QixTQUFLLFlBQVksU0FBUyxxQkFBcUI7QUFDL0MsU0FBSyxjQUFjLEtBQUssSUFBSSxVQUFVLEdBQUcsYUFBYSxNQUFNLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDMUUsU0FBSyxjQUFjLEtBQUssSUFBSSxVQUFVLEdBQUcsc0JBQXNCLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQztBQUNuRixTQUFLLGNBQWMsS0FBSyxJQUFJLFVBQVUsR0FBRyxpQkFBaUIsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQzlFLFNBQUssY0FBYyxLQUFLLElBQUksY0FBYyxHQUFHLFdBQVcsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQzVFLFNBQUssY0FBYyxLQUFLLElBQUksTUFBTSxHQUFHLFVBQVUsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ25FLFNBQUssY0FBYyxLQUFLLElBQUksTUFBTSxHQUFHLFVBQVUsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ25FLFNBQUssT0FBTztBQUFBLEVBQ2Q7QUFBQSxFQUVBLE1BQU0sVUFBeUI7QUFDN0IsU0FBSyxZQUFZLE1BQU07QUFDdkIsU0FBSyxZQUFZLENBQUM7QUFDbEIsU0FBSyxRQUFRLENBQUM7QUFDZCxTQUFLLFNBQVMsTUFBTTtBQUNwQixTQUFLLFNBQVM7QUFBQSxFQUNoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVVRLFNBQWU7QUFDckIsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsVUFBTSxPQUFPLE9BQU8sS0FBSyxPQUFPLFlBQVksUUFBUSxJQUFJLElBQUk7QUFDNUQsVUFBTSxRQUFRLE9BQ1YsS0FBSyxNQUFNLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxNQUFNLHNCQUFzQixDQUFDLGFBQWEsc0JBQUssSUFDakYsQ0FBQztBQUdMLFFBQUksS0FBSyxTQUFTLE9BQU8sR0FBRztBQUMxQixZQUFNLE9BQU8sSUFBSSxJQUFJLEtBQUs7QUFDMUIsaUJBQVcsUUFBUSxLQUFLLFNBQVUsS0FBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUcsTUFBSyxTQUFTLE9BQU8sSUFBSTtBQUFBLElBQ2xGO0FBRUEsUUFBSSxLQUFLLFdBQVcsUUFBUSxDQUFDLE1BQU0sU0FBUyxLQUFLLE1BQU0sRUFBRyxNQUFLLFNBQVM7QUFFeEUsUUFBSSxDQUFDLFlBQVksS0FBSyxXQUFXLEtBQUssR0FBRztBQUN2QyxXQUFLLFFBQVEsS0FBSztBQUFBLElBQ3BCLE9BQU87QUFDTCxpQkFBVyxNQUFNLEtBQUssTUFBTyxJQUFHLEdBQUcsVUFBVSxPQUFPLGFBQWEsR0FBRyxTQUFTLE1BQU0sSUFBSTtBQUFBLElBQ3pGO0FBQ0EsU0FBSyxxQkFBcUI7QUFBQSxFQUM1QjtBQUFBO0FBQUEsRUFHUSxRQUFRLE9BQXVCO0FBQ3JDLFVBQU0sT0FBTyxLQUFLO0FBQ2xCLFNBQUssTUFBTTtBQUNYLFNBQUssUUFBUSxDQUFDO0FBQ2QsU0FBSyxZQUFZO0FBRWpCLFFBQUksTUFBTSxXQUFXLEdBQUc7QUFDdEIsWUFBTSxRQUFRLEtBQUssVUFBVSxFQUFFLEtBQUssNEJBQTRCLENBQUM7QUFDakUsWUFBTTtBQUFBLFFBQ0o7QUFBQSxNQUNGO0FBQ0E7QUFBQSxJQUNGO0FBRUEsVUFBTSxhQUFhLEtBQUssSUFBSSxVQUFVLGNBQWMsR0FBRztBQUN2RCxVQUFNLFFBQVEsQ0FBQyxNQUFNLE1BQU07QUFDekIsWUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLHNCQUFzQixJQUFJO0FBQ25ELFVBQUksRUFBRSxhQUFhLHdCQUFRO0FBQzNCLFlBQU0sT0FBTyxLQUFLLFVBQVUsRUFBRSxLQUFLLDJCQUEyQixDQUFDO0FBQy9ELFVBQUksU0FBUyxXQUFZLE1BQUssU0FBUyxXQUFXO0FBQ2xELFdBQUssV0FBVyxFQUFFLEtBQUssMEJBQTBCLENBQUMsRUFBRSxRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUM7QUFDekUsV0FBSyxXQUFXLEVBQUUsS0FBSyw0QkFBNEIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRO0FBQ3hFLFdBQUssaUJBQWlCLFNBQVMsQ0FBQyxNQUFNLEtBQUssWUFBWSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQy9ELFdBQUssaUJBQWlCLGVBQWUsQ0FBQyxNQUFNO0FBQzFDLFVBQUUsZUFBZTtBQUNqQixhQUFLLGdCQUFnQixHQUFHLENBQUM7QUFBQSxNQUMzQixDQUFDO0FBQ0QsV0FBSyxNQUFNLEtBQUssRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDO0FBQUEsSUFDcEMsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBR1EsWUFBWSxHQUFlLE9BQWUsR0FBZ0I7QUFDaEUsUUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsU0FBUztBQUN4QyxVQUFJLEVBQUUsVUFBVTtBQUdkLGNBQU0sYUFBYSxLQUFLLElBQUksVUFBVSxjQUFjLEdBQUcsUUFBUTtBQUMvRCxjQUFNLGFBQ0osS0FBSyxXQUFXLFFBQVEsS0FBSyxNQUFNLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxLQUFLLE1BQU0sSUFDbkUsS0FBSyxTQUNMO0FBQ04sY0FBTSxPQUFPLEtBQUssTUFBTSxVQUFVLENBQUMsT0FBTyxHQUFHLFNBQVMsVUFBVTtBQUNoRSxZQUFJLGVBQWUsUUFBUSxTQUFTLElBQUk7QUFDdEMsZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxPQUFPLFFBQVEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sSUFBSTtBQUM1RCxtQkFBUyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUssTUFBSyxTQUFTLElBQUksS0FBSyxNQUFNLENBQUMsRUFBRSxJQUFJO0FBR25FLGNBQUksZUFBZSxRQUFRLEtBQUssTUFBTSxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsVUFBVSxHQUFHO0FBQzFFLGlCQUFLLFNBQVMsSUFBSSxVQUFVO0FBQUEsVUFDOUI7QUFDQSxlQUFLLFNBQVMsS0FBSyxNQUFNLEtBQUssRUFBRTtBQUNoQyxlQUFLLHFCQUFxQjtBQUMxQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBR0EsVUFBSSxLQUFLLFNBQVMsSUFBSSxFQUFFLElBQUksRUFBRyxNQUFLLFNBQVMsT0FBTyxFQUFFLElBQUk7QUFBQSxVQUNyRCxNQUFLLFNBQVMsSUFBSSxFQUFFLElBQUk7QUFDN0IsV0FBSyxTQUFTLEVBQUU7QUFDaEIsV0FBSyxxQkFBcUI7QUFDMUI7QUFBQSxJQUNGO0FBQ0EsU0FBSyxTQUFTLE1BQU07QUFJcEIsU0FBSyxTQUFTLEVBQUU7QUFDaEIsU0FBSyxxQkFBcUI7QUFDMUIsU0FBSyxLQUFLLFVBQVUsQ0FBQztBQUFBLEVBQ3ZCO0FBQUE7QUFBQSxFQUdRLHVCQUE2QjtBQUNuQyxlQUFXLE1BQU0sS0FBSyxNQUFPLElBQUcsR0FBRyxVQUFVLE9BQU8sZUFBZSxLQUFLLFNBQVMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUFBLEVBQy9GO0FBQUE7QUFBQSxFQUdRLGdCQUFnQixHQUFlLEdBQWdCO0FBQ3JELFVBQU0sT0FBTyxJQUFJLHNCQUFLO0FBQ3RCLFNBQUs7QUFBQSxNQUFRLENBQUMsT0FDWixHQUNHLFNBQVMsbUJBQW1CLEVBQzVCLFFBQVEsTUFBTSxFQUNkLFFBQVEsTUFBTSxLQUFLLEtBQUssZ0JBQWdCLENBQUMsQ0FBQztBQUFBLElBQy9DO0FBQ0EsVUFBTSxVQUFVLEtBQUssU0FBUyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxDQUFDLEVBQUUsSUFBSTtBQUN4RSxVQUFNLFVBQVUsS0FBSyxVQUFVLE9BQU8sQ0FBQyxNQUFNLFFBQVEsU0FBUyxDQUFDLENBQUM7QUFDaEUsU0FBSztBQUFBLE1BQVEsQ0FBQyxPQUNaLEdBQ0csU0FBUyxRQUFRLFNBQVMsSUFBSSxVQUFVLFFBQVEsTUFBTSxZQUFZLGNBQWMsRUFDaEYsUUFBUSxPQUFPLEVBQ2YsUUFBUSxNQUFNLEtBQUssYUFBYSxPQUFPLENBQUM7QUFBQSxJQUM3QztBQUNBLFNBQUssaUJBQWlCLENBQUM7QUFBQSxFQUN6QjtBQUFBO0FBQUEsRUFHQSxNQUFjLGdCQUFnQixHQUF5QjtBQUNyRCxVQUFNLE9BQU8sS0FBSyxPQUFPLFlBQVksZUFBZSxDQUFDO0FBQ3JELFFBQUksQ0FBQyxLQUFNO0FBQ1gsVUFBTSxLQUFLLE9BQU8sWUFBWSxrQkFBa0IsR0FBRyxNQUFNLEtBQUs7QUFDOUQsU0FBSyxPQUFPO0FBQUEsRUFDZDtBQUFBO0FBQUEsRUFHUSxhQUFhLE9BQXVCO0FBQzFDLFFBQUksTUFBTSxXQUFXLEVBQUc7QUFDeEIsVUFBTSxNQUFNLE1BQVksS0FBSyxLQUFLLFlBQVksS0FBSztBQUVuRCxRQUFJLENBQUMsS0FBSyxPQUFPLFNBQVMscUJBQXFCO0FBQzdDLFVBQUk7QUFDSjtBQUFBLElBQ0Y7QUFDQSxVQUFNLFFBQVEsTUFBTSxJQUFJLENBQUMsTUFBTTtBQUM3QixZQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsYUFBTyxhQUFhLHlCQUFRLEVBQUUsV0FBVztBQUFBLElBQzNDLENBQUM7QUFDRCxRQUFJLG1CQUFtQixLQUFLLEtBQUssT0FBTyxLQUFLLFlBQVk7QUFDdkQsV0FBSyxPQUFPLFNBQVMsc0JBQXNCO0FBQzNDLFlBQU0sS0FBSyxPQUFPLGFBQWE7QUFBQSxJQUNqQyxDQUFDLEVBQUUsS0FBSztBQUFBLEVBQ1Y7QUFBQSxFQUVBLE1BQWMsWUFBWSxPQUFnQztBQUN4RCxVQUFNLGFBQWEsS0FBSyxJQUFJLFVBQVUsY0FBYyxHQUFHLFFBQVE7QUFDL0QsVUFBTSxTQUFTLE1BQU0sS0FBSyxPQUFPLFlBQVk7QUFBQSxNQUMzQyxLQUFLO0FBQUEsTUFDTCxJQUFJLElBQUksS0FBSztBQUFBLE1BQ2I7QUFBQSxJQUNGO0FBRUEsZUFBVyxRQUFRLE1BQU8sTUFBSyxTQUFTLE9BQU8sSUFBSTtBQUNuRCxRQUFJLEtBQUssV0FBVyxRQUFRLE1BQU0sU0FBUyxLQUFLLE1BQU0sRUFBRyxNQUFLLFNBQVM7QUFFdkUsUUFBSSxPQUFPLGFBQWE7QUFDdEIsWUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLHNCQUFzQixPQUFPLFdBQVc7QUFDakUsVUFBSSxhQUFhLHVCQUFPLE9BQU0sS0FBSyxVQUFVLENBQUM7QUFDOUM7QUFBQSxJQUNGO0FBQ0EsU0FBSyxPQUFPO0FBQUEsRUFDZDtBQUFBO0FBQUEsRUFHQSxNQUFjLFVBQVUsR0FBeUI7QUFDL0MsVUFBTSxPQUNKLEtBQUssSUFBSSxVQUFVLGdCQUFnQixVQUFVLEVBQUUsQ0FBQyxLQUFLLEtBQUssSUFBSSxVQUFVLFFBQVEsSUFBSTtBQUN0RixVQUFNLEtBQUssU0FBUyxDQUFDO0FBQ3JCLFNBQUssSUFBSSxVQUFVLGNBQWMsTUFBTSxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQUEsRUFDeEQ7QUFDRjtBQUdBLFNBQVMsWUFBWSxHQUFhLEdBQXNCO0FBQ3RELFNBQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM5RDs7O0FFOVBBLElBQUFDLG1CQUFzRTtBQVMvRCxJQUFNLHlCQUFOLGNBQXFDLGtDQUFpQjtBQUFBLEVBQzNELFlBQW9CLFFBQTRCO0FBQzlDLFVBQU0sT0FBTyxLQUFLLE1BQU07QUFETjtBQUFBLEVBRXBCO0FBQUE7QUFBQSxFQUdBLHdCQUFpRDtBQUMvQyxXQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFVBQ04sU0FBUyxPQUFPLFlBQVksY0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQUEsUUFDdkU7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssaUJBQWlCLE1BQU0sU0FBUztBQUFBLE1BQ2xEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssa0JBQWtCLE1BQU0sU0FBUztBQUFBLE1BQ25EO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFVBQ04sU0FBUztBQUFBLFlBQ1AsVUFBVTtBQUFBLFlBQ1YsU0FBUztBQUFBLFlBQ1QsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLGdCQUFnQixNQUFNLFNBQVM7QUFBQSxNQUNqRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLG1CQUFtQixNQUFNLFNBQVM7QUFBQSxNQUNwRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLGtCQUFrQixNQUFNLFNBQVM7QUFBQSxNQUNuRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLGVBQWUsTUFBTSxRQUFRLGFBQWEsYUFBYTtBQUFBLE1BQ3pFO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssaUJBQWlCLE1BQU0sUUFBUSxhQUFhLHdCQUF3QjtBQUFBLE1BQ3RGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssdUJBQXVCLE1BQU0sU0FBUztBQUFBLE1BQ3hEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sUUFBUSxNQUFNO0FBRVosVUFDRSxLQUFLLElBQ0wsU0FBUyxjQUFjLFNBQVM7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxnQkFBZ0IsS0FBYSxPQUFzQjtBQUNqRCxTQUFLLEtBQUssa0JBQWtCLEtBQUssS0FBSztBQUFBLEVBQ3hDO0FBQUEsRUFFQSxNQUFjLGtCQUFrQixLQUFhLE9BQStCO0FBQzFFLElBQUMsS0FBSyxPQUFPLFNBQWdELEdBQUcsSUFBSTtBQUNwRSxVQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLFNBQUssT0FBTyxRQUFRO0FBQUEsRUFDdEI7QUFBQTtBQUFBLEVBR0EsVUFBZ0I7QUFDZCxVQUFNLEVBQUUsWUFBWSxJQUFJO0FBQ3hCLGdCQUFZLE1BQU07QUFFbEIsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsZ0JBQWdCLEVBQ3hCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQyxZQUFZLENBQUMsYUFBYTtBQUN6QixpQkFBVyxLQUFLLGNBQWUsVUFBUyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUs7QUFDL0QsZUFBUyxTQUFTLEtBQUssT0FBTyxTQUFTLFdBQVcsRUFBRSxTQUFTLE9BQU8sVUFBVTtBQUM1RSxhQUFLLE9BQU8sU0FBUyxjQUFjO0FBQ25DLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUgsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsaUJBQWlCLEVBQ3pCLFFBQVEscUVBQXFFLEVBQzdFO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxTQUFTLEtBQUssT0FBTyxTQUFTLGFBQWEsRUFBRSxTQUFTLE9BQU8sVUFBVTtBQUM1RSxhQUFLLE9BQU8sU0FBUyxnQkFBZ0I7QUFDckMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsNEJBQTRCLEVBQ3BDO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxjQUFjLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDN0UsYUFBSyxPQUFPLFNBQVMsaUJBQWlCO0FBQ3RDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDSDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLG1CQUFtQixFQUMzQjtBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFZLENBQUMsYUFDWixTQUNHLFdBQVc7QUFBQSxRQUNWLFVBQVU7QUFBQSxRQUNWLFNBQVM7QUFBQSxRQUNULE1BQU07QUFBQSxNQUNSLENBQUMsRUFDQSxTQUFTLEtBQUssT0FBTyxTQUFTLGVBQWUsRUFDN0MsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsa0JBQWtCO0FBQ3ZDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDTDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLG1CQUFtQixFQUMzQjtBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFVLENBQUMsV0FDVixPQUFPLFNBQVMsS0FBSyxPQUFPLFNBQVMsWUFBWSxFQUFFLFNBQVMsT0FBTyxVQUFVO0FBQzNFLGFBQUssT0FBTyxTQUFTLGVBQWU7QUFDcEMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsd0JBQXdCLEVBQ2hDO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxlQUFlLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDOUUsYUFBSyxPQUFPLFNBQVMsa0JBQWtCO0FBQ3ZDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDSDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLDBCQUEwQixFQUNsQyxRQUFRLG1FQUFtRSxFQUMzRTtBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxjQUFjLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDN0UsYUFBSyxPQUFPLFNBQVMsaUJBQWlCO0FBQ3RDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFBQSxNQUNqQyxDQUFDO0FBQUEsSUFDSDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLGNBQWMsRUFDdEI7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBUSxDQUFDLFNBQ1IsS0FDRyxlQUFlLFlBQVksRUFDM0IsU0FBUyxLQUFLLE9BQU8sU0FBUyxXQUFXLEVBQ3pDLFNBQVMsT0FBTyxVQUFVO0FBQ3pCLGFBQUssT0FBTyxTQUFTLGNBQWM7QUFDbkMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNMO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsZ0JBQWdCLEVBQ3hCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVEsQ0FBQyxTQUNSLEtBQ0csZUFBZSx1QkFBdUIsRUFDdEMsU0FBUyxLQUFLLE9BQU8sU0FBUyxhQUFhLEVBQzNDLFNBQVMsT0FBTyxVQUFVO0FBQ3pCLGFBQUssT0FBTyxTQUFTLGdCQUFnQjtBQUNyQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxRQUFRO0FBQUEsTUFDdEIsQ0FBQztBQUFBLElBQ0w7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSx3QkFBd0IsRUFDaEM7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxTQUFTLEtBQUssT0FBTyxTQUFTLG1CQUFtQixFQUFFLFNBQVMsT0FBTyxVQUFVO0FBQ2xGLGFBQUssT0FBTyxTQUFTLHNCQUFzQjtBQUMzQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQUEsTUFDakMsQ0FBQztBQUFBLElBQ0g7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSxvQkFBb0IsRUFDNUI7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxjQUFjLHVCQUF1QixFQUFFLFFBQVEsTUFBTTtBQUUxRCxRQUNFLEtBQUssSUFDTCxTQUFTLGNBQWMsU0FBUztBQUFBLE1BQ3BDLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDSjtBQUNGOzs7QUNuUU8sU0FBUyxjQUFjLElBQXVCO0FBQ25ELFNBQU8sR0FBRyxXQUFZLElBQUcsWUFBWSxHQUFHLFVBQVU7QUFDcEQ7OztBYmtDQSxJQUFxQixxQkFBckIsY0FBZ0Qsd0JBQU87QUFBQSxFQUF2RDtBQUFBO0FBRUU7QUFBQSxlQUEwQjtBQUkxQjtBQUFBLG9CQUFpQyxFQUFFLEdBQUcsaUJBQWlCO0FBR3ZEO0FBQUEsU0FBUSxhQUFhO0FBRXJCO0FBQUEsU0FBUSxXQUFpQztBQUV6QztBQUFBLFNBQVEsYUFBYTtBQUVyQjtBQUFBLFNBQVEsa0JBQWtCO0FBRTFCO0FBQUEsU0FBUSxVQUFVO0FBRWxCO0FBQUEsU0FBUSxlQUFlO0FBRXZCO0FBQUEseUJBQWdCO0FBRWhCO0FBQUEsU0FBUSxpQkFBZ0M7QUFFeEM7QUFBQSxTQUFRLGlCQUFpQjtBQTROekI7QUFBQSxTQUFRLGdCQUFvQztBQUU1QztBQUFBLFNBQVEsa0JBQWdEO0FBRXhEO0FBQUEsU0FBUSxpQkFBc0M7QUFFOUM7QUFBQSxTQUFRLGFBQWE7QUFBQTtBQUFBLEVBaE9yQixNQUFNLFNBQXdCO0FBQzVCLFVBQU0sS0FBSyxhQUFhO0FBQ3hCLFNBQUssY0FBYyxJQUFJLFlBQVksS0FBSyxHQUFHO0FBQzNDLFNBQUssY0FBYyxJQUFJLHVCQUF1QixJQUFJLENBQUM7QUFHbkQsU0FBSztBQUFBLE1BQ0gsS0FBSyxJQUFJLFVBQVUsR0FBRyxhQUFhLE1BQU07QUFDdkMsYUFBSyxxQkFBcUI7QUFDMUIsYUFBSyxRQUFRO0FBQUEsTUFDZixDQUFDO0FBQUEsSUFDSDtBQUNBLFNBQUssY0FBYyxLQUFLLElBQUksVUFBVSxHQUFHLHNCQUFzQixNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7QUFDcEYsU0FBSyxjQUFjLEtBQUssSUFBSSxVQUFVLEdBQUcsaUJBQWlCLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztBQUUvRSxTQUFLO0FBQUEsTUFDSCxLQUFLLElBQUksY0FBYyxHQUFHLFdBQVcsQ0FBQyxTQUFnQjtBQUNwRCxZQUFJLFNBQVMsS0FBSyxJQUFJLFVBQVUsY0FBYyxFQUFHLE1BQUssUUFBUTtBQUFBLE1BQ2hFLENBQUM7QUFBQSxJQUNIO0FBR0EsU0FBSztBQUFBLE1BQ0gsT0FBTyxZQUFZLE1BQU07QUFDdkIsY0FBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsY0FBTSxNQUFNLE9BQU8sR0FBRyxLQUFLLElBQUksSUFBSSxZQUFZLEtBQUssR0FBRyxDQUFDLEtBQUs7QUFDN0QsWUFBSSxRQUFRLEtBQUssU0FBUztBQUN4QixlQUFLLFVBQVU7QUFDZixlQUFLLFFBQVE7QUFBQSxRQUNmO0FBQUEsTUFDRixHQUFHLEdBQUc7QUFBQSxJQUNSO0FBT0EsU0FBSztBQUFBLE1BQ0gsS0FBSyxJQUFJLFVBQVUsR0FBRyxpQkFBaUIsTUFBTTtBQUMzQyxZQUFJLENBQUMsS0FBSyxXQUFZO0FBQ3RCLGFBQUssa0JBQWtCO0FBQ3ZCLGFBQUssb0JBQW9CO0FBQUEsTUFDM0IsQ0FBQztBQUFBLElBQ0g7QUFHQSxxQkFBaUIsSUFBSTtBQUdyQixTQUFLLGFBQWEsbUJBQW1CLENBQUMsU0FBUyxJQUFJLGdCQUFnQixNQUFNLElBQUksQ0FBQztBQUM5RSxTQUFLLGNBQWMsZ0JBQWdCLHFCQUFxQixNQUFNO0FBQzVELFdBQUssS0FBSyxvQkFBb0I7QUFBQSxJQUNoQyxDQUFDO0FBT0QsU0FBSztBQUFBLE1BQ0g7QUFBQSxNQUNBO0FBQUEsTUFDQSxDQUFDLFFBQVE7QUFDUCxZQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsU0FBUyxvQkFBb0IsRUFBRztBQUM3RCxjQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQ2hFLFlBQUksQ0FBQyxLQUFNO0FBQ1gsY0FBTSxLQUFLLElBQUk7QUFDZixZQUFJLGNBQWMsZUFBZSxLQUFLLFVBQVUsU0FBUyxFQUFFLEdBQUc7QUFDNUQsY0FBSSxHQUFHLGNBQWMsRUFBRyxJQUFHLFlBQVk7QUFDdkMsY0FBSSxHQUFHLGVBQWUsRUFBRyxJQUFHLGFBQWE7QUFBQSxRQUMzQztBQUFBLE1BQ0Y7QUFBQSxNQUNBLEVBQUUsU0FBUyxLQUFLO0FBQUEsSUFDbEI7QUFHQSxTQUFLLGlCQUFpQixVQUFVLFdBQVcsQ0FBQyxRQUF1QjtBQUNqRSxVQUFJLElBQUksUUFBUSxZQUFZLEtBQUssY0FBYyxLQUFLLFNBQVMsZ0JBQWdCO0FBQzNFLGFBQUssV0FBVztBQUFBLE1BQ2xCO0FBQUEsSUFDRixDQUFDO0FBR0QsU0FBSyxNQUFNLFVBQVU7QUFDckIsYUFBUyxLQUFLLFlBQVksS0FBSyxHQUFHO0FBQ2xDLFNBQUssUUFBUTtBQUFBLEVBQ2Y7QUFBQSxFQUVBLFdBQWlCO0FBQ2YsUUFBSSxLQUFLLG1CQUFtQixLQUFNLFFBQU8scUJBQXFCLEtBQUssY0FBYztBQUNqRixTQUFLLGlCQUFpQjtBQUN0QixTQUFLLEtBQUssT0FBTztBQUNqQixTQUFLLE1BQU07QUFDWCxhQUFTLEtBQUssVUFBVSxPQUFPLG9CQUFvQjtBQUNuRCxhQUFTLEtBQUssVUFBVSxPQUFPLDhCQUE4QjtBQUM3RCxTQUFLLG1CQUFtQjtBQUFBLEVBQzFCO0FBQUE7QUFBQSxFQUlBLE1BQU0sZUFBOEI7QUFDbEMsVUFBTSxPQUFRLE1BQU0sS0FBSyxTQUFTO0FBQ2xDLFNBQUssV0FBVyxPQUFPLE9BQU8sQ0FBQyxHQUFHLGtCQUFrQixRQUFRLENBQUMsQ0FBQztBQUFBLEVBQ2hFO0FBQUEsRUFFQSxNQUFNLGVBQThCO0FBQ2xDLFVBQU0sS0FBSyxTQUFTLEtBQUssUUFBUTtBQUFBLEVBQ25DO0FBQUE7QUFBQTtBQUFBLEVBS1EsV0FBVyxNQUE2QjtBQUM5QyxRQUFJLENBQUMsS0FBTSxRQUFPO0FBQ2xCLFVBQU0sS0FBSyxjQUFjLEtBQUssS0FBSyxJQUFJO0FBQ3ZDLFdBQU8sT0FBTyxRQUFRLFlBQVk7QUFBQSxFQUNwQztBQUFBO0FBQUEsRUFHUSxxQkFBMkI7QUFDakMsZUFBVyxPQUFPLE1BQU0sS0FBSyxTQUFTLEtBQUssU0FBUyxHQUFHO0FBQ3JELFVBQUksSUFBSSxXQUFXLHNCQUFzQixFQUFHLFVBQVMsS0FBSyxVQUFVLE9BQU8sR0FBRztBQUFBLElBQ2hGO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9RLGtCQUF3QjtBQUM5QixVQUFNLEtBQUssY0FBYyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sS0FBSyxTQUFTLFdBQVcsSUFDbkUsS0FBSyxTQUFTLGNBQ2QsaUJBQWlCO0FBQ3JCLFVBQU0sTUFBTSx1QkFBdUIsRUFBRTtBQUNyQyxlQUFXLEtBQUssTUFBTSxLQUFLLFNBQVMsS0FBSyxTQUFTLEdBQUc7QUFDbkQsVUFBSSxFQUFFLFdBQVcsc0JBQXNCLEtBQUssTUFBTSxJQUFLLFVBQVMsS0FBSyxVQUFVLE9BQU8sQ0FBQztBQUFBLElBQ3pGO0FBQ0EsYUFBUyxLQUFLLFVBQVUsSUFBSSxHQUFHO0FBQUEsRUFDakM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPQSxnQkFBc0I7QUFDcEIsU0FBSyxnQkFBZ0IsQ0FBQyxLQUFLO0FBQzNCLFFBQUksS0FBSyxlQUFlO0FBQ3RCLFlBQU0sU0FBUyxTQUFTO0FBQ3hCLFVBQUksa0JBQWtCLGVBQWUsV0FBVyxTQUFTLEtBQU0sUUFBTyxLQUFLO0FBQUEsSUFDN0U7QUFDQSxTQUFLLFFBQVE7QUFBQSxFQUNmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT1EsaUJBQWlCLFFBQXVCO0FBQzlDLGFBQVMsS0FBSyxVQUFVLE9BQU8sZ0NBQWdDLFVBQVUsS0FBSyxhQUFhO0FBQUEsRUFDN0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFRLGtCQUFrQixRQUF1QjtBQUMvQyxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQ2hFLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxjQUFjO0FBQzlDLFVBQU0sVUFBVSxNQUFNLFVBQVUsY0FBMkIsYUFBYTtBQUN4RSxRQUFJLENBQUMsV0FBVyxDQUFDLEtBQU07QUFFdkIsVUFBTSxNQUFNLEtBQUssU0FBUyxZQUFZLEtBQUs7QUFRM0MsVUFBTSxjQUFjLFVBQVUsUUFBUTtBQUN0QyxVQUFNLGFBQWEsTUFBTSxVQUFVLGNBQTJCLHVCQUF1QjtBQUNyRixRQUFJLGVBQWUsV0FBWSxZQUFXLGFBQWEsd0JBQXdCLFVBQVU7QUFBQSxRQUNwRixhQUFZLGdCQUFnQixzQkFBc0I7QUFDdkQsWUFBUSxnQkFBZ0IsNEJBQTRCLFdBQVc7QUFJL0QsUUFBSSxPQUFzQjtBQUMxQixRQUFJLFVBQVUsT0FBTyxRQUFRLFlBQVk7QUFDdkMsWUFBTSxLQUFLLGNBQWMsS0FBSyxLQUFLLElBQUk7QUFDdkMsWUFBTSxJQUFJLEtBQUssR0FBRztBQUNsQixVQUFJLEtBQUssS0FBTSxRQUFPLFlBQVksQ0FBQztBQUFBLElBQ3JDO0FBRUEsUUFBSSxLQUFNLFNBQVEsYUFBYSxxQkFBcUIsSUFBSTtBQUFBLFFBQ25ELFNBQVEsZ0JBQWdCLG1CQUFtQjtBQUFBLEVBQ2xEO0FBQUE7QUFBQSxFQUdRLGtCQUFrQixTQUErQjtBQUN2RCxRQUFJLFVBQVU7QUFDZCxlQUFXLFFBQVEsUUFBUSxpQkFBOEIsbUJBQW1CLEdBQUc7QUFDN0UsWUFBTSxPQUFPLGdCQUFnQixJQUFJO0FBQ2pDLFVBQUksS0FBSyxVQUFVLFNBQVMsMEJBQTBCLE1BQU0sTUFBTTtBQUNoRSxrQkFBVTtBQUNWLGFBQUssVUFBVSxPQUFPLDRCQUE0QixJQUFJO0FBQUEsTUFDeEQ7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUErQlEsc0JBQXNCLFFBQXVCO0FBQ25ELFFBQUksUUFBUTtBQUNWLFlBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDaEUsWUFBTSxPQUFPLE1BQU0sYUFBYTtBQUNoQyxVQUFJLFFBQVEsS0FBSyxvQkFBb0IsTUFBTTtBQUN6QyxhQUFLLGdCQUFnQjtBQUNyQixhQUFLLGtCQUFrQixNQUFNO0FBQzNCLGNBQUksS0FBSyxXQUFZLE1BQUssb0JBQW9CO0FBQUEsUUFDaEQ7QUFDQSxhQUFLLGlCQUFpQixlQUFlLEtBQUssaUJBQWlCLElBQUk7QUFDL0QsYUFBSyxpQkFBaUIsUUFBUSxLQUFLLGlCQUFpQixJQUFJO0FBQ3hELGFBQUssaUJBQWlCLE1BQU07QUFDMUIsY0FBSSxLQUFLLFdBQVksTUFBSyxvQkFBb0I7QUFBQSxRQUNoRDtBQUNBLGlCQUFTLGlCQUFpQixtQkFBbUIsS0FBSyxjQUFjO0FBQUEsTUFDbEU7QUFDQSxXQUFLLGFBQWE7QUFDbEIsV0FBSyxvQkFBb0IsSUFBSTtBQUM3QjtBQUFBLElBQ0Y7QUFDQSxRQUFJLEtBQUssbUJBQW1CLEtBQUssZUFBZTtBQUM5QyxXQUFLLGNBQWMsb0JBQW9CLGVBQWUsS0FBSyxpQkFBaUIsSUFBSTtBQUNoRixXQUFLLGNBQWMsb0JBQW9CLFFBQVEsS0FBSyxpQkFBaUIsSUFBSTtBQUFBLElBQzNFO0FBQ0EsU0FBSyxrQkFBa0I7QUFDdkIsU0FBSyxnQkFBZ0I7QUFDckIsUUFBSSxLQUFLLGVBQWdCLFVBQVMsb0JBQW9CLG1CQUFtQixLQUFLLGNBQWM7QUFDNUYsU0FBSyxpQkFBaUI7QUFDdEIsUUFBSSxLQUFLLG1CQUFtQixNQUFNO0FBQ2hDLGFBQU8scUJBQXFCLEtBQUssY0FBYztBQUMvQyxXQUFLLGlCQUFpQjtBQUFBLElBQ3hCO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHUSxvQkFBb0IsS0FBSyxLQUFXO0FBQzFDLFNBQUssaUJBQWlCLE9BQU8sWUFBWSxJQUFJLElBQUk7QUFDakQsUUFBSSxLQUFLLG1CQUFtQixLQUFNO0FBQ2xDLFVBQU0sT0FBTyxNQUFZO0FBQ3ZCLFdBQUssaUJBQWlCO0FBQ3RCLFVBQUksT0FBTyxZQUFZLElBQUksS0FBSyxLQUFLLGdCQUFnQjtBQUluRCxZQUFJLEtBQUssYUFBYSxLQUFLLEtBQUssa0JBQWtCLEdBQUc7QUFDbkQsZUFBSztBQUNMLGVBQUssb0JBQW9CO0FBQUEsUUFDM0I7QUFDQTtBQUFBLE1BQ0Y7QUFDQSxXQUFLLGtCQUFrQjtBQUN2QixXQUFLLGlCQUFpQixPQUFPLHNCQUFzQixJQUFJO0FBQUEsSUFDekQ7QUFDQSxTQUFLLGlCQUFpQixPQUFPLHNCQUFzQixJQUFJO0FBQUEsRUFDekQ7QUFBQTtBQUFBLEVBR1Esb0JBQTZCO0FBQ25DLFVBQU0sVUFBVSxLQUFLLElBQUksVUFDdEIsb0JBQW9CLDZCQUFZLEdBQy9CLFVBQVUsY0FBMkIsYUFBYTtBQUN0RCxXQUFPLFVBQVUsS0FBSyxrQkFBa0IsT0FBTyxJQUFJO0FBQUEsRUFDckQ7QUFBQTtBQUFBLEVBR0EsTUFBYyxjQUE2QjtBQUN6QyxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQ2hFLFFBQUksTUFBTTtBQUNSLFlBQU0sUUFBUSxLQUFLLFNBQVM7QUFDNUIsV0FBSyxXQUFXLE1BQU0sU0FBUyxZQUFZLFlBQVk7QUFDdkQsV0FBSyxhQUFhLE1BQU0sV0FBVztBQUVuQyxZQUFNLE9BQU8sS0FBSyxLQUFLLGFBQWE7QUFDcEMsV0FBSyxRQUFRLEVBQUUsR0FBRyxLQUFLLE9BQU8sTUFBTSxVQUFVLFFBQVEsTUFBTTtBQUM1RCxZQUFNLEtBQUssS0FBSyxhQUFhLE1BQU0sRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUFBLElBQ3JEO0FBQ0EsU0FBSyxhQUFhO0FBQ2xCLFNBQUssUUFBUTtBQUFBLEVBQ2Y7QUFBQTtBQUFBLEVBR1EsYUFBbUI7QUFDekIsU0FBSyxhQUFhO0FBQ2xCLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDaEUsUUFBSSxNQUFNO0FBQ1IsWUFBTSxRQUFRLEtBQUssS0FBSyxhQUFhO0FBQ3JDLFVBQUksS0FBSyxhQUFhLFdBQVc7QUFDL0IsY0FBTSxRQUFRLEVBQUUsR0FBRyxNQUFNLE9BQU8sTUFBTSxVQUFVO0FBQUEsTUFDbEQsT0FBTztBQUNMLGNBQU0sUUFBUSxFQUFFLEdBQUcsTUFBTSxPQUFPLE1BQU0sVUFBVSxRQUFRLEtBQUssV0FBVztBQUFBLE1BQzFFO0FBQ0EsV0FBSyxLQUFLLEtBQUssYUFBYSxPQUFPLEVBQUUsT0FBTyxNQUFNLENBQUM7QUFBQSxJQUNyRDtBQUNBLFNBQUssUUFBUTtBQUFBLEVBQ2Y7QUFBQTtBQUFBLEVBR0EsZUFBcUI7QUFDbkIsUUFBSSxLQUFLLFdBQVksTUFBSyxXQUFXO0FBQUEsUUFDaEMsTUFBSyxLQUFLLFlBQVk7QUFBQSxFQUM3QjtBQUFBO0FBQUEsRUFHQSxNQUFNLHNCQUFxQztBQUN6QyxVQUFNLFdBQVcsS0FBSyxJQUFJLFVBQVUsZ0JBQWdCLGlCQUFpQjtBQUNyRSxRQUFJLFNBQVMsU0FBUyxHQUFHO0FBQ3ZCLFlBQU0sS0FBSyxJQUFJLFVBQVUsV0FBVyxTQUFTLENBQUMsQ0FBQztBQUMvQztBQUFBLElBQ0Y7QUFDQSxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsYUFBYSxLQUFLO0FBQ2xELFFBQUksQ0FBQyxLQUFNO0FBQ1gsVUFBTSxLQUFLLGFBQWEsRUFBRSxNQUFNLG1CQUFtQixRQUFRLEtBQUssQ0FBQztBQUNqRSxVQUFNLEtBQUssSUFBSSxVQUFVLFdBQVcsSUFBSTtBQUFBLEVBQzFDO0FBQUE7QUFBQSxFQUdRLHVCQUE2QjtBQUNuQyxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsY0FBYztBQUM5QyxRQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsS0FBSyxnQkFBaUI7QUFDakQsU0FBSyxrQkFBa0IsS0FBSztBQUM1QixRQUFJLEtBQUssU0FBUyxtQkFBbUIsS0FBSyxXQUFXLElBQUksS0FBSyxDQUFDLEtBQUssWUFBWTtBQUM5RSxXQUFLLEtBQUssWUFBWTtBQUFBLElBQ3hCO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQSxFQUtBLE1BQU0sU0FBUyxXQUEyQztBQUN4RCxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsY0FBYztBQUM5QyxRQUFJLENBQUMsS0FBTTtBQUNYLFVBQU0sT0FBTyxLQUFLLFlBQVksUUFBUSxJQUFJO0FBQzFDLFFBQUksQ0FBQyxLQUFNO0FBQ1gsVUFBTSxTQUFTLEtBQUssTUFBTSxjQUFjLFNBQVMsS0FBSyxRQUFRLElBQUksS0FBSyxRQUFRLENBQUM7QUFDaEYsUUFBSSxDQUFDLE9BQVE7QUFDYixRQUFJLENBQUMsS0FBSyxXQUFZLE9BQU0sS0FBSyxZQUFZO0FBQzdDLFNBQUssS0FBSyxJQUFJLFVBQVUsYUFBYSxRQUFRLEtBQUssSUFBSTtBQUFBLEVBQ3hEO0FBQUE7QUFBQSxFQUdBLE1BQU0sT0FBTyxPQUE4QjtBQUN6QyxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsY0FBYztBQUM5QyxRQUFJLENBQUMsS0FBTTtBQUNYLFVBQU0sT0FBTyxLQUFLLFlBQVksUUFBUSxJQUFJO0FBQzFDLFFBQUksQ0FBQyxRQUFRLFFBQVEsS0FBSyxTQUFTLEtBQUssTUFBTSxVQUFVLFVBQVUsS0FBSyxNQUFPO0FBQzlFLFVBQU0sU0FBUyxLQUFLLE1BQU0sS0FBSztBQUMvQixRQUFJLENBQUMsT0FBUTtBQUNiLFFBQUksQ0FBQyxLQUFLLFdBQVksT0FBTSxLQUFLLFlBQVk7QUFDN0MsU0FBSyxLQUFLLElBQUksVUFBVSxhQUFhLFFBQVEsS0FBSyxJQUFJO0FBQUEsRUFDeEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVNRLHFCQUFxQixPQUF5QjtBQUNwRCxRQUFJO0FBQ0YsWUFBTSxTQUFTLEtBQUssTUFBTSxLQUFLLFNBQVMscUJBQXFCLElBQUk7QUFDakUsVUFBSSxhQUFhLFFBQVEsS0FBSyxFQUFHLFFBQU87QUFBQSxJQUMxQyxRQUFRO0FBQUEsSUFFUjtBQUNBLFdBQU8sSUFBSSxNQUFjLEtBQUssRUFBRSxLQUFLLE1BQU0sS0FBSztBQUFBLEVBQ2xEO0FBQUE7QUFBQSxFQUdBLE1BQWMsc0JBQXNCLFFBQWlDO0FBQ25FLFNBQUssU0FBUyxvQkFBb0IsS0FBSyxVQUFVLE1BQU07QUFDdkQsVUFBTSxLQUFLLGFBQWE7QUFBQSxFQUMxQjtBQUFBO0FBQUEsRUFHQSxVQUFnQjtBQUNkLFFBQUksQ0FBQyxLQUFLLElBQUs7QUFDZixTQUFLLGdCQUFnQjtBQUVyQixVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsY0FBYztBQUM5QyxVQUFNLE9BQU8sWUFBWSxLQUFLLEdBQUc7QUFDakMsVUFBTSxTQUFTLEtBQUssV0FBVyxJQUFJO0FBQ25DLFVBQU0saUJBQWlCLFNBQVMsWUFBWSxjQUFjLEtBQUssR0FBRztBQUlsRSxRQUFJLEtBQUssZUFBZSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUI7QUFDbkQsV0FBSyxhQUFhO0FBQUEsSUFDcEI7QUFJQSxTQUFLLGVBQWUsaUJBQWlCLEtBQUssWUFBWTtBQUd0RCxVQUFNLFNBQVMsS0FBSyxjQUFjLFVBQVU7QUFDNUMsYUFBUyxLQUFLLFVBQVUsT0FBTyxzQkFBc0IsTUFBTTtBQUMzRCxRQUFJLENBQUMsT0FBUSxNQUFLLGdCQUFnQjtBQUNsQyxTQUFLLGlCQUFpQixNQUFNO0FBQzVCLFNBQUssa0JBQWtCLE1BQU07QUFLN0IsU0FBSyxzQkFBc0IsTUFBTTtBQUVqQyxVQUFNLGFBQWEsVUFBVSxLQUFLLFNBQVMsaUJBQWlCLENBQUMsS0FBSyxTQUFTO0FBSTNFLFFBQUksWUFBWTtBQUNkLGVBQVMsZ0JBQWdCLE1BQU0sZUFBZSw0QkFBNEI7QUFBQSxJQUM1RSxPQUFPO0FBQ0wsZUFBUyxnQkFBZ0IsWUFBWSxFQUFFLDhCQUE4QixNQUFNLENBQUM7QUFBQSxJQUM5RTtBQUNBLFFBQUksQ0FBQyxZQUFZO0FBQ2YsV0FBSyxJQUFJLGFBQWEsRUFBRSxTQUFTLE9BQU8sQ0FBQztBQUN6QztBQUFBLElBQ0Y7QUFDQSxRQUFJLENBQUMsS0FBTTtBQUVYLFVBQU0sS0FBSyxrQkFBa0IsS0FBSyxHQUFHO0FBQ3JDLFVBQU0sT0FBTyxLQUFLLFlBQVksUUFBUSxJQUFJO0FBQzFDLGtCQUFjLEtBQUssR0FBRztBQUl0QixRQUFJLEtBQUssU0FBUyxrQkFBa0IsTUFBTTtBQUN4QyxZQUFNLFVBQVUsS0FBSyxRQUFRO0FBQzdCLFlBQU0sVUFBVSxLQUFLLFFBQVEsS0FBSyxNQUFNLFNBQVM7QUFDakQsWUFBTSxNQUFNLFVBQVUsRUFBRSxLQUFLLG9CQUFvQixDQUFDO0FBQ2xELFVBQUksWUFBWSxVQUFVLFVBQUssaUJBQWlCLE1BQU0sS0FBSyxLQUFLLFNBQVMsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQzNGLFVBQUksWUFBWSxVQUFVLFVBQUssYUFBYSxNQUFNLEtBQUssS0FBSyxTQUFTLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUN2RixXQUFLLElBQUksWUFBWSxHQUFHO0FBQUEsSUFDMUI7QUFHQSxVQUFNLFlBQVksS0FBSyxTQUFTLGNBQzdCLE1BQU0sR0FBRyxFQUNULElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQ25CLE9BQU8sT0FBTztBQUVqQixRQUFJLFVBQVUsU0FBUyxLQUFLLElBQUk7QUFDOUIsWUFBTSxVQUE4QixDQUFDO0FBQ3JDLGlCQUFXLFFBQVEsV0FBVztBQUM1QixZQUFJLFFBQVEsSUFBSTtBQUNkLGdCQUFNLE1BQU0sR0FBRyxJQUFJO0FBQ25CLGNBQUksT0FBTyxLQUFNLFNBQVEsS0FBSyxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQztBQUFBLFFBQ3hEO0FBQUEsTUFDRjtBQUVBLFVBQUksUUFBUSxTQUFTLEdBQUc7QUFDdEIsY0FBTSxZQUFZLFVBQVUsRUFBRSxLQUFLLCtCQUErQixDQUFDO0FBRW5FLGNBQU0sU0FBUyxLQUFLLHFCQUFxQixRQUFRLE1BQU07QUFFdkQsaUJBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxRQUFRLEtBQUs7QUFDdkMsZ0JBQU0sQ0FBQyxFQUFFLEtBQUssSUFBSSxRQUFRLENBQUM7QUFDM0IsZ0JBQU0sT0FBTyxXQUFXLEVBQUUsS0FBSywrQkFBK0IsTUFBTSxNQUFNLENBQUM7QUFDM0UsZUFBSyxhQUFhO0FBQUEsWUFDaEIsV0FBVyxRQUFRLE9BQU8sQ0FBQyxDQUFDLFFBQVMsUUFBUSxTQUFTLEtBQUssSUFBSyxRQUFRLE1BQU07QUFBQSxVQUNoRixDQUFDO0FBQ0Qsb0JBQVUsWUFBWSxJQUFJO0FBRTFCLGNBQUksSUFBSSxRQUFRLFNBQVMsR0FBRztBQUMxQixrQkFBTSxVQUFVLFVBQVUsRUFBRSxLQUFLLDRCQUE0QixDQUFDO0FBQzlELG9CQUFRLGlCQUFpQixhQUFhLENBQUMsTUFBTTtBQUMzQyxnQkFBRSxlQUFlO0FBQ2pCLG9CQUFNLFNBQVMsRUFBRTtBQUNqQixvQkFBTSxpQkFBaUIsVUFBVTtBQUNqQyxvQkFBTSxnQkFBZ0IsQ0FBQyxHQUFHLE1BQU07QUFDaEMsb0JBQU0sU0FBUyxDQUFDLE9BQW1CO0FBQ2pDLHNCQUFNLFNBQVUsR0FBRyxVQUFVLFVBQVUsaUJBQWtCO0FBQ3pELHNCQUFNLFVBQVUsS0FBSyxJQUFJLEdBQUcsY0FBYyxDQUFDLElBQUksS0FBSztBQUNwRCxzQkFBTSxXQUFXLEtBQUssSUFBSSxHQUFHLGNBQWMsSUFBSSxDQUFDLElBQUksS0FBSztBQUN6RCx1QkFBTyxDQUFDLElBQUk7QUFDWix1QkFBTyxJQUFJLENBQUMsSUFBSTtBQUNoQixzQkFBTSxRQUFRLFVBQVU7QUFBQSxrQkFDdEI7QUFBQSxnQkFDRjtBQUNBLHNCQUFNLENBQUMsRUFBRSxhQUFhO0FBQUEsa0JBQ3BCLFdBQVcsUUFBUSxPQUFPLFFBQVMsUUFBUSxTQUFTLEtBQUssSUFBSyxRQUFRLE1BQU07QUFBQSxnQkFDOUUsQ0FBQztBQUNELHNCQUFNLElBQUksQ0FBQyxFQUFFLGFBQWE7QUFBQSxrQkFDeEIsV0FBVyxRQUFRLFFBQVEsUUFBUyxRQUFRLFNBQVMsS0FBSyxJQUFLLFFBQVEsTUFBTTtBQUFBLGdCQUMvRSxDQUFDO0FBQUEsY0FDSDtBQUNBLG9CQUFNLE9BQU8sTUFBTTtBQUNqQix5QkFBUyxvQkFBb0IsYUFBYSxNQUFNO0FBQ2hELHlCQUFTLG9CQUFvQixXQUFXLElBQUk7QUFDNUMseUJBQVMsS0FBSyxhQUFhLEVBQUUsUUFBUSxJQUFJLFlBQVksR0FBRyxDQUFDO0FBQ3pELHFCQUFLLEtBQUssc0JBQXNCLE1BQU07QUFBQSxjQUN4QztBQUNBLHVCQUFTLGlCQUFpQixhQUFhLE1BQU07QUFDN0MsdUJBQVMsaUJBQWlCLFdBQVcsSUFBSTtBQUN6Qyx1QkFBUyxLQUFLLGFBQWEsRUFBRSxRQUFRLGNBQWMsWUFBWSxPQUFPLENBQUM7QUFBQSxZQUN6RSxDQUFDO0FBQ0Qsc0JBQVUsWUFBWSxPQUFPO0FBQUEsVUFDL0I7QUFBQSxRQUNGO0FBRUEsYUFBSyxJQUFJLFlBQVksU0FBUztBQUFBLE1BQ2hDO0FBQUEsSUFDRjtBQUdBLFVBQU0sU0FBUyxPQUFPLEtBQUssWUFBWSxPQUFPLElBQUksSUFBSSxDQUFDO0FBQ3ZELFFBQUksT0FBTyxTQUFTLEdBQUc7QUFDckIsWUFBTSxPQUFPLFdBQVc7QUFBQSxRQUN0QixLQUFLO0FBQUEsUUFDTCxNQUFNLFlBQU8sT0FBTyxLQUFLLElBQUk7QUFBQSxRQUM3QixNQUFNLEVBQUUsT0FBTyw0REFBdUQ7QUFBQSxNQUN4RSxDQUFDO0FBQ0QsV0FBSyxJQUFJLFlBQVksSUFBSTtBQUFBLElBQzNCO0FBR0EsUUFBSSxLQUFLLFNBQVMsb0JBQW9CLFVBQVUsTUFBTTtBQUdwRCxZQUFNLFFBQVEsS0FBSyxNQUFNO0FBQ3pCLFlBQU0sT0FBTyxXQUFXO0FBQUEsUUFDdEIsS0FBSztBQUFBLFFBQ0wsTUFDRSxLQUFLLFNBQVMsb0JBQW9CLGFBQzlCLEdBQUcsS0FBSyxRQUFRLENBQUMsTUFBTSxLQUFLLEtBQzVCLEdBQUcsS0FBSyxRQUFRLENBQUM7QUFBQSxNQUN6QixDQUFDO0FBQ0QsV0FBSyxJQUFJLFlBQVksSUFBSTtBQUFBLElBQzNCO0FBR0EsUUFBSSxLQUFLLFNBQVMsZ0JBQWdCLFFBQVEsS0FBSyxNQUFNLFNBQVMsR0FBRztBQUMvRCxZQUFNLFdBQVcsVUFBVSxFQUFFLEtBQUsseUJBQXlCLENBQUM7QUFDNUQsZUFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLE1BQU0sUUFBUSxLQUFLO0FBQzFDLGNBQU0sUUFBUSxJQUFJLEtBQUssUUFBUSxTQUFTLE1BQU0sS0FBSyxRQUFRLFlBQVk7QUFDdkUsY0FBTSxNQUFNLFVBQVU7QUFBQSxVQUNwQixLQUFLLDBEQUEwRCxLQUFLO0FBQUEsUUFDdEUsQ0FBQztBQUNELFlBQUksaUJBQWlCLFNBQVMsTUFBTSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDdkQsaUJBQVMsWUFBWSxHQUFHO0FBQUEsTUFDMUI7QUFDQSxXQUFLLElBQUksWUFBWSxRQUFRO0FBQUEsSUFDL0I7QUFJQSxTQUFLLElBQUksYUFBYSxFQUFFLFNBQVMsS0FBSyxJQUFJLHNCQUFzQixJQUFJLFNBQVMsR0FBRyxDQUFDO0FBQUEsRUFDbkY7QUFDRjtBQUdBLFNBQVMsYUFBYSxPQUFnQixPQUFrQztBQUN0RSxTQUNFLE1BQU0sUUFBUSxLQUFLLEtBQUssTUFBTSxXQUFXLFNBQVMsTUFBTSxNQUFNLENBQUMsTUFBTSxPQUFPLE1BQU0sUUFBUTtBQUU5RjtBQVFBLFNBQVMsZ0JBQWdCLE1BQXdCO0FBQy9DLE1BQUksV0FBVztBQUNmLE1BQUksVUFBVTtBQUNkLGFBQVcsUUFBUSxNQUFNLEtBQUssS0FBSyxVQUFVLEdBQUc7QUFDOUMsUUFBSSxLQUFLLGFBQWEsS0FBSyxXQUFXO0FBQ3BDLFVBQUksS0FBSyxlQUFlLEtBQUssWUFBWSxLQUFLLEVBQUcsV0FBVTtBQUMzRDtBQUFBLElBQ0Y7QUFDQSxRQUFJLENBQUMsS0FBSyxXQUFXLFdBQVcsRUFBRztBQUNuQyxRQUNFLEtBQUssVUFBVSxTQUFTLGlCQUFpQixLQUN6QyxLQUFLLFVBQVUsU0FBUyxtQkFBbUIsR0FDM0M7QUFDQTtBQUFBLElBQ0Y7QUFDQSxRQUFJLEtBQUssWUFBWSxPQUFPO0FBQzFCLGlCQUFXO0FBQ1g7QUFBQSxJQUNGO0FBQ0EsUUFBSSxLQUFLLFVBQVUsU0FBUyxlQUFlLEdBQUc7QUFDNUMsVUFBSSxLQUFLLGVBQWUsS0FBSyxZQUFZLEtBQUssRUFBRyxXQUFVO0FBQzNEO0FBQUEsSUFDRjtBQUNBLFFBQUksS0FBSyxjQUFjLEtBQUssRUFBRyxZQUFXO0FBQUEsYUFDakMsS0FBSyxlQUFlLEtBQUssWUFBWSxLQUFLLEVBQUcsV0FBVTtBQUFBLEVBQ2xFO0FBQ0EsU0FBTyxZQUFZLENBQUM7QUFDdEI7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgIm5ld05hbWUiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
