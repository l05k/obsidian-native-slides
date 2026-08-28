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
  confirmDeleteSlides: true,
  imageLayout: true
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
        name: "Center images",
        desc: "Images render centered on the slide as a card block exactly as tall as the picture. Turn off for Obsidian's usual behavior: images stay inline with the text (a small image and its caption sit on the same row).",
        control: { key: "imageLayout", type: "toggle" }
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
    new import_obsidian6.Setting(containerEl).setName("Center images").setDesc(
      "Images render centered on the slide as a card block exactly as tall as the picture. Turn off for Obsidian's usual behavior: images stay inline with the text (a small image and its caption sit on the same row)."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.imageLayout).onChange(async (value) => {
        this.plugin.settings.imageLayout = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
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
    this.bar?.remove();
    this.bar = null;
    document.body.classList.remove("native-slides-mode");
    document.body.classList.remove("native-slides-pointer-hidden");
    document.body.classList.remove("native-slides-block-images");
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
   * Keep the `native-slides-block-images` body class in sync with the
   * `imageLayout` setting — styles.css's image-layout rules hook off it.
   * The class is only meaningful in Slides mode.
   */
  syncImageLayoutClass(slides) {
    document.body.classList.toggle(
      "native-slides-block-images",
      slides && this.settings.imageLayout
    );
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
    for (const el of view?.contentEl.querySelectorAll(".cm-scroller") ?? []) {
      if (el.scrollTop !== 0) el.scrollTop = 0;
      if (el.scrollLeft !== 0) el.scrollLeft = 0;
    }
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
    this.syncImageLayoutClass(slides);
    this.updateInlineTitle(slides);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9kZWJ1Zy50cyIsICJzcmMvbW9kZS50cyIsICJzcmMvdHlwZXMudHMiLCAic3JjL2NvbW1hbmRzLnRzIiwgInNyYy9kZWNrLXNlcnZpY2UudHMiLCAic3JjL2RlY2sudHMiLCAic3JjL2NyZWF0ZU5leHQudHMiLCAic3JjL2RlbGV0ZVNsaWRlcy50cyIsICJzcmMvcGFuZWwudHMiLCAic3JjL2NvbmZpcm0tZGVsZXRlLnRzIiwgInNyYy9zZXR0aW5ncy50cyIsICJzcmMvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogbmF0aXZlLXNsaWRlcyBcdTIwMTQgYSBcIlNsaWRlcyBtb2RlXCIgZm9yIE9ic2lkaWFuIGRlY2sgbm90ZXNcbiAqXG4gKiBPbmUgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5LCBgZGVja2AgKGEgc2luZ2xlIG1hcmtkb3duIGxpbmsgdG8gdGhlIG5leHRcbiAqIHNsaWRlIFx1MjAxNCBuZXh0LW9ubHkgc2VtYW50aWNzLCBubyBvdmVydmlldyBwYWdlIHNpbmNlIHYxLjAuMCksIGRyaXZlc1xuICogcHJldi9uZXh0IG5hdmlnYXRpb24gYW5kIGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXJzLiBBIGRlY2sgbm90ZSBjYW4gYmVcbiAqIGVudGVyZWQgaW50byAqKlNsaWRlcyBtb2RlKiogXHUyMDE0IGFuIGltbWVyc2l2ZSwgZWRpdGFibGUgKExpdmUgUHJldmlldykgdmlld1xuICogd2l0aCBhIHNsaWRlcyBiYXIgc2hvd2luZyBwcm9wZXJ0aWVzLCBuYXZpZ2F0aW9uIGFuZCB0aGUgcGFnZSBudW1iZXIuXG4gKlxuICogTmF0aXZlIE9ic2lkaWFuIG1vZGVzIChTb3VyY2UgLyBkZWZhdWx0IExpdmUgUHJldmlldyAvIFJlYWRpbmcgdmlldykgYXJlXG4gKiBsZWZ0IGNvbXBsZXRlbHkgdW50b3VjaGVkOiBubyBzdGF0dXMtYmFyIGhpZGluZywgbm8gc2xpZGVzIGJhciwgbm9cbiAqIGZ1bGxzY3JlZW4sIG5vIHN0eWxpbmcuIFNsaWRlcyBtb2RlIGlzIHRoZSBwbHVnaW4ncyBvbmx5IHN1cmZhY2UuXG4gKlxuICogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBhbmQgYSB0aGluIG9yY2hlc3RyYXRpb24gbGF5ZXI7IHRoZSBsb2dpY1xuICogbGl2ZXMgaW4gYHNyYy9gOlxuICogICAtIHNyYy90eXBlcy50cyAgICAgICAgc2V0dGluZ3Mgc2hhcGUgKyBkZWZhdWx0cyArIHJlc2VydmVkIGBkZWNrYCBrZXlcbiAqICAgLSBzcmMvbW9kZS50cyAgICAgICAgIHZpZXcgbW9kZSAvIGZyb250bWF0dGVyIGhlbHBlcnMgKHB1cmUsIGBBcHBgLWJhc2VkKVxuICogICAtIHNyYy9kZWNrLXNlcnZpY2UudHMgZGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWVcbiAqICAgLSBzcmMvYmFyLnRzICAgICAgICAgIGJhciBET00gaGVscGVycyAoY3JlYXRlIC8gYnV0dG9ucyAvIHRhYi1iYXIgbWVhc3VyZSlcbiAqICAgLSBzcmMvcGFuZWwudHMgICAgICAgIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gKiAgIC0gc3JjL2NvbW1hbmRzLnRzICAgICBjb21tYW5kIHJlZ2lzdHJhdGlvbiAoZGV2LWdhdGVkIGRlYnVnIGNvbW1hbmQpXG4gKiAgIC0gc3JjL3NldHRpbmdzLnRzICAgICBzZXR0aW5ncyB0YWJcbiAqICAgLSBzcmMvZGVidWcudHMgICAgICAgIHR5cG9ncmFwaHkgbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KVxuICogICAtIHNyYy9kZWNrLnRzICAgICAgICAgcHVyZSBkZWNrIGNvcmUgKHdpdGggc3JjL2NyZWF0ZU5leHQudHMpXG4gKi9cblxuaW1wb3J0IHsgTWFya2Rvd25WaWV3LCBQbHVnaW4sIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjcmVhdGVCYXIsIG5hdkJ1dHRvbiwgc3luY1RhYkJhckhlaWdodCB9IGZyb20gXCIuL3NyYy9iYXJcIjtcbmltcG9ydCB7IHJlZ2lzdGVyQ29tbWFuZHMgfSBmcm9tIFwiLi9zcmMvY29tbWFuZHNcIjtcbmltcG9ydCB7IERlY2tTZXJ2aWNlIH0gZnJvbSBcIi4vc3JjL2RlY2stc2VydmljZVwiO1xuaW1wb3J0IHsgZm9ybWF0VmFsdWUgfSBmcm9tIFwiLi9zcmMvZGVja1wiO1xuaW1wb3J0IHsgYWN0aXZlRnJvbnRtYXR0ZXIsIGN1cnJlbnRNb2RlLCBmcm9udG1hdHRlck9mLCBpc0xpdmVQcmV2aWV3IH0gZnJvbSBcIi4vc3JjL21vZGVcIjtcbmltcG9ydCB7IFNsaWRlc1BhbmVsVmlldywgU0xJREVTX1BBTkVMX1ZJRVcgfSBmcm9tIFwiLi9zcmMvcGFuZWxcIjtcbmltcG9ydCB7IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgfSBmcm9tIFwiLi9zcmMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IERFQ0tfS0VZLCBERUZBVUxUX1NFVFRJTkdTLCBTTElERVNfVEhFTUVTLCB0eXBlIE5hdGl2ZVNsaWRlc1NldHRpbmdzIH0gZnJvbSBcIi4vc3JjL3R5cGVzXCI7XG5pbXBvcnQgeyBjbGVhckNoaWxkcmVuIH0gZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdGl2ZVNsaWRlc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIC8qKiBUaGUgc2xpZGVzIGJhciBET00gZWxlbWVudCAqL1xuICBiYXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8qKiBEZWNrIGNoYWluIHJlc29sdXRpb24gKyBcImNyZWF0ZSBuZXh0IHNsaWRlXCIgZ2x1ZSAqL1xuICBkZWNrU2VydmljZSE6IERlY2tTZXJ2aWNlO1xuICAvKiogUGx1Z2luIHNldHRpbmdzICovXG4gIHNldHRpbmdzOiBOYXRpdmVTbGlkZXNTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuXG4gIC8qKiBXaGV0aGVyIFNsaWRlcyBtb2RlIGlzIGN1cnJlbnRseSBhY3RpdmUgKHNlc3Npb24gc3RhdGUsIG5vdCBwZXJzaXN0ZWQpICovXG4gIHByaXZhdGUgc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAvKiogVmlldyBtb2RlIHRvIHJlc3RvcmUgd2hlbiBsZWF2aW5nIFNsaWRlcyBtb2RlIChcInByZXZpZXdcIiB8IFwic291cmNlXCIpICovXG4gIHByaXZhdGUgZXhpdE1vZGU6IFwicHJldmlld1wiIHwgXCJzb3VyY2VcIiA9IFwic291cmNlXCI7XG4gIC8qKiBXaGV0aGVyIHRoZSBleGl0IHZpZXcgd2FzIFNvdXJjZSBtb2RlICh0cnVlKSB2cyBMaXZlIFByZXZpZXcgKGZhbHNlKSAqL1xuICBwcml2YXRlIGV4aXRTb3VyY2UgPSBmYWxzZTtcbiAgLyoqIExhc3Qgbm90ZSBhdXRvLWVudGVyZWQgaW50byBTbGlkZXMgbW9kZSAocHJldmVudHMgcmUtZW50ZXJpbmcgYWZ0ZXIgbWFudWFsIGV4aXQpICovXG4gIHByaXZhdGUgYXV0b0VudGVyZWRQYXRoID0gXCJcIjtcbiAgLyoqIExhc3QgcmVmcmVzaCBrZXkgKFwicGF0aHxtb2RlXCIpIHRvIGF2b2lkIHBvaW50bGVzcyByZS1yZW5kZXJzICovXG4gIHByaXZhdGUgbGFzdEtleSA9IFwiXCI7XG4gIC8qKiBMYXN0IG1lYXN1cmVkIHRhYi1iYXIgaGVpZ2h0IChweCkgXHUyMDE0IGNhY2hlZCB3aGlsZSB0aGUgc2xpZGVzIGJhciBpcyBoaWRkZW4gKi9cbiAgcHJpdmF0ZSB0YWJCYXJIZWlnaHQgPSAwO1xuICAvKiogV2hldGhlciB0aGUgbW91c2UgcG9pbnRlciBpcyBoaWRkZW4gZm9yIHByZXNlbnRpbmcgKHNlc3Npb24gc3RhdGUpICovXG4gIHBvaW50ZXJIaWRkZW4gPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmRlY2tTZXJ2aWNlID0gbmV3IERlY2tTZXJ2aWNlKHRoaXMuYXBwKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIodGhpcykpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDEuIFJlZnJlc2ggb24gXCJjdXJyZW50IG5vdGUgLyB2aWV3IGNoYW5nZWRcIiBldmVudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5tYXliZUF1dG9FbnRlclNsaWRlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG4gICAgLy8gUmVmcmVzaCB3aGVuIHRoZSBub3RlIGNvbnRlbnQgKGluY2x1ZGluZyBmcm9udG1hdHRlcikgY2hhbmdlcyAvIHNhdmVzXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMi4gRmFsbGJhY2sgdGltZXI6IGVkaXRcdTIxOTRyZWFkaW5nIHRvZ2dsZXMgbWF5IGZpcmUgbm8gc3RhbmRhcmQgZXZlbnQgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKFxuICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGZpbGUgPyBgJHtmaWxlLnBhdGh9fCR7Y3VycmVudE1vZGUodGhpcy5hcHApfWAgOiBcIlwiO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCksXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzLiBDb21tYW5kcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICByZWdpc3RlckNvbW1hbmRzKHRoaXMpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDNiLiBTbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBvdmVydmlldywgcmVwbGFjZXMgdGhlIG9sZCBvdmVydmlldyBwYWdlKSBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhTTElERVNfUEFORUxfVklFVywgKGxlYWYpID0+IG5ldyBTbGlkZXNQYW5lbFZpZXcodGhpcywgbGVhZikpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInByZXNlbnRhdGlvblwiLCBcIlNob3cgc2xpZGVzIHBhbmVsXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVNsaWRlc1BhbmVsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNC4gUGluIHRoZSBTbGlkZXMgZWRpdG9yIHRvIG9uZSBzY3JlZW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ1NTIGBvdmVyZmxvdzogaGlkZGVuYCBibG9ja3MgdGhlIHdoZWVsLCBidXQgbmF0aXZlIGRyYWctc2VsZWN0XG4gICAgLy8gYXV0b3Njcm9sbCBhbmQgQ29kZU1pcnJvcidzIHByb2dyYW1tYXRpYyBzY3JvbGxJbnRvVmlldyBzdGlsbCBtb3ZlIHRoZVxuICAgIC8vIHNjcm9sbGVyLiBUaGlzIGNhcHR1cmUtcGhhc2UgbGlzdGVuZXIgcmVzZXRzIGFueSBzY3JvbGwgaW5zaWRlIHRoZVxuICAgIC8vIGFjdGl2ZSBtYXJrZG93biB2aWV3IGJhY2sgdG8gdGhlIHRvcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhY3RpdmUuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KFxuICAgICAgZG9jdW1lbnQsXG4gICAgICBcInNjcm9sbFwiLFxuICAgICAgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcbiAgICAgICAgY29uc3QgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB2aWV3LmNvbnRlbnRFbC5jb250YWlucyhlbCkpIHtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxMZWZ0ICE9PSAwKSBlbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHsgY2FwdHVyZTogdHJ1ZSB9LFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNS4gRXNjYXBlIGtleSBleGl0cyBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZG9jdW1lbnQsIFwia2V5ZG93blwiLCAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNsaWRlc01vZGUgJiYgdGhpcy5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykge1xuICAgICAgICB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA2LiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgYW5kIGRvIHRoZSBmaXJzdCByZW5kZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5iYXIgPSBjcmVhdGVCYXIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFyKTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9udW5sb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuYmFyPy5yZW1vdmUoKTtcbiAgICB0aGlzLmJhciA9IG51bGw7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIik7XG4gICAgdGhpcy5yZW1vdmVUaGVtZUNsYXNzZXMoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXR0aW5ncyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGF0YSA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIGFzIFBhcnRpYWw8TmF0aXZlU2xpZGVzU2V0dGluZ3M+IHwgbnVsbDtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgZGF0YSA/PyB7fSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG5vdGUgaXMgYSBkZWNrIG5vdGUgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSkgKi9cbiAgcHJpdmF0ZSBpc0RlY2tOb3RlKGZpbGU6IFRGaWxlIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBldmVyeSBgbmF0aXZlLXNsaWRlcy10aGVtZS0qYCBjbGFzcyBmcm9tIDxib2R5PiAqL1xuICBwcml2YXRlIHJlbW92ZVRoZW1lQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNscyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGNscy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBzaW5nbGUgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmAgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBzbGlkZXNUaGVtZWAgc2V0dGluZyBcdTIwMTQgdGhlIHN0eWxlIHRlbXBsYXRlcyBpbiBzdHlsZXMuY3NzIGhvb2sgb2ZmIGl0LlxuICAgKiBVbmtub3duIGlkcyAoZS5nLiBhZnRlciBhIGRvd25ncmFkZSkgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHRoZW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVRoZW1lQ2xhc3MoKTogdm9pZCB7XG4gICAgY29uc3QgaWQgPSBTTElERVNfVEhFTUVTLnNvbWUoKHQpID0+IHQuaWQgPT09IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWUpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5zbGlkZXNUaGVtZTtcbiAgICBjb25zdCBjbHMgPSBgbmF0aXZlLXNsaWRlcy10aGVtZS0ke2lkfWA7XG4gICAgZm9yIChjb25zdCBjIG9mIEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpKSB7XG4gICAgICBpZiAoYy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikgJiYgYyAhPT0gY2xzKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBoaWRpbmcgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgZm9yIHByZXNlbnRpbmcuIEhpZGluZyBhbHNvXG4gICAqIHBhcmtzIGZvY3VzIChibHVycyB0aGUgZWRpdG9yLCBzbyB0aGUgY2FyZXQgZGlzYXBwZWFycyk7IHNob3dpbmcgbGVhdmVzXG4gICAqIGZvY3VzIHBhcmtlZCBcdTIwMTQgY2xpY2sgc2xpZGUgY29udGVudCB0byByZXN1bWUgZWRpdGluZy5cbiAgICovXG4gIHRvZ2dsZVBvaW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5wb2ludGVySGlkZGVuID0gIXRoaXMucG9pbnRlckhpZGRlbjtcbiAgICBpZiAodGhpcy5wb2ludGVySGlkZGVuKSB7XG4gICAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgYG5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBwcmVzZW50aW5nIHN0YXRlIFx1MjAxNCBzdHlsZXMuY3NzIHR1cm5zIGV2ZXJ5IGN1cnNvciBpbnZpc2libGUgd2hpbGUgc2V0LlxuICAgKiBMZWF2aW5nIFNsaWRlcyBtb2RlIGFsd2F5cyByZXN0b3JlcyB0aGUgcG9pbnRlci5cbiAgICovXG4gIHByaXZhdGUgc3luY1BvaW50ZXJDbGFzcyhzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIsIHNsaWRlcyAmJiB0aGlzLnBvaW50ZXJIaWRkZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc2AgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBpbWFnZUxheW91dGAgc2V0dGluZyBcdTIwMTQgc3R5bGVzLmNzcydzIGltYWdlLWxheW91dCBydWxlcyBob29rIG9mZiBpdC5cbiAgICogVGhlIGNsYXNzIGlzIG9ubHkgbWVhbmluZ2Z1bCBpbiBTbGlkZXMgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgc3luY0ltYWdlTGF5b3V0Q2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgXCJuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc1wiLFxuICAgICAgc2xpZGVzICYmIHRoaXMuc2V0dGluZ3MuaW1hZ2VMYXlvdXQsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNhcmQgdGl0bGUgcGVyIHRoZSBgc2xpZGVzVGl0bGVgIHNldHRpbmcuIFwiZmlsZW5hbWVcIiByZXN0eWxlc1xuICAgKiB0aGUgbmF0aXZlIGlubGluZSB0aXRsZSBpbnRvIHRoZSBjYXJkIHRpdGxlIChzdGlsbCBlZGl0YWJsZSBcdTIwMTQgdHlwaW5nXG4gICAqIHJlbmFtZXMgdGhlIG5vdGUpOyBcIlwiIHNob3dzIG5vdGhpbmc7IGFueSBvdGhlciB2YWx1ZSBuYW1lcyBhIGZyb250bWF0dGVyXG4gICAqIHByb3BlcnR5IHJlbmRlcmVkIHJlYWQtb25seSB2aWEgdGhlIDo6YmVmb3JlIHBzZXVkby1lbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJbmxpbmVUaXRsZShzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBjb250ZW50ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFmaWxlKSByZXR1cm47XG5cbiAgICBjb25zdCBzcmMgPSB0aGlzLnNldHRpbmdzLnNsaWRlc1RpdGxlLnRyaW0oKTtcblxuICAgIC8vIFwiZmlsZW5hbWVcIjogcmVzdHlsZSB0aGUgbmF0aXZlIC5pbmxpbmUtdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZS4gSXRcbiAgICAvLyBzdGF5cyBjb250ZW50ZWRpdGFibGUsIHNvIGVkaXRpbmcgaXQgcmVuYW1lcyB0aGUgbm90ZSBhcyBpbiBMaXZlXG4gICAgLy8gUHJldmlldy4gVGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgbGl2ZXMgb24gdGhlIG1hcmtkb3duLXNvdXJjZS12aWV3XG4gICAgLy8gZWxlbWVudCAoYSBzaWJsaW5nIGJyYW5jaCBvZiB0aGUgY2FyZCksIHNvIHRoZSBzdHlsaW5nIGhvb2sgaXMgYVxuICAgIC8vIHZpZXcgYXR0cmlidXRlICsgYSBicmFuZC1uZXcgLmNtLWNvbnRlbnQgYXR0cmlidXRlIHRoYXQgcmVzZXJ2ZXMgdGhlXG4gICAgLy8gdGl0bGUncyBoZWlnaHQgdGhlIHNhbWUgd2F5IHRoZSBwc2V1ZG8tZWxlbWVudCB2ZXJzaW9uIGRpZC5cbiAgICBjb25zdCBuYXRpdmVUaXRsZSA9IHNsaWRlcyAmJiBzcmMgPT09IFwiZmlsZW5hbWVcIjtcbiAgICBjb25zdCBzb3VyY2VWaWV3ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXNvdXJjZS12aWV3XCIpO1xuICAgIGlmIChuYXRpdmVUaXRsZSAmJiBzb3VyY2VWaWV3KSBzb3VyY2VWaWV3LnNldEF0dHJpYnV0ZShcImRhdGEtbnMtaW5saW5lLXRpdGxlXCIsIFwiZmlsZW5hbWVcIik7XG4gICAgZWxzZSBzb3VyY2VWaWV3Py5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiKTtcbiAgICBjb250ZW50LnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiLCBuYXRpdmVUaXRsZSk7XG5cbiAgICAvLyBQcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIHJlbmRlciByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudFxuICAgIC8vIChubyBlZGl0aW5nIHN1cmZhY2UgXHUyMDE0IHRoZSBwcm9wZXJ0aWVzIHBhbmVsIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSkuXG4gICAgbGV0IHRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGlmIChzbGlkZXMgJiYgc3JjICYmIHNyYyAhPT0gXCJmaWxlbmFtZVwiKSB7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgICAgY29uc3QgdiA9IGZtPy5bc3JjXTtcbiAgICAgIGlmICh2ICE9IG51bGwpIHRleHQgPSBmb3JtYXRWYWx1ZSh2KTtcbiAgICB9XG5cbiAgICBpZiAodGV4dCkgY29udGVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiLCB0ZXh0KTtcbiAgICBlbHNlIGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIik7XG4gIH1cblxuICAvKiogRW50ZXIgU2xpZGVzIG1vZGU6IHJlY29yZCB0aGUgZXhpdCBzdGF0ZSBhbmQgZm9yY2UgdGhlIExpdmUgUHJldmlldyAqL1xuICBwcml2YXRlIGFzeW5jIGVudGVyU2xpZGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IG1vZGU/OiBzdHJpbmc7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgICAgIHRoaXMuZXhpdE1vZGUgPSBzdGF0ZS5tb2RlID09PSBcInByZXZpZXdcIiA/IFwicHJldmlld1wiIDogXCJzb3VyY2VcIjtcbiAgICAgIHRoaXMuZXhpdFNvdXJjZSA9IHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZTtcbiAgICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFsd2F5cyB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgICBjb25zdCBuZXh0ID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgbmV4dC5zdGF0ZSA9IHsgLi4ubmV4dC5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiBmYWxzZSB9O1xuICAgICAgYXdhaXQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShuZXh0LCB7IGZvY3VzOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gdHJ1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAvLyBQaW4gdGhlIHNjcm9sbGVyIHRvIHRoZSB0b3AgYmVmb3JlIGFueSBmcmFtZSByZW5kZXJzOiB0aGUgdmlldy1zdGF0ZVxuICAgIC8vIGNoYW5nZSBhYm92ZSBtYXkgcmVzdG9yZSBpdCB0byB0aGUgc2F2ZWQgY3Vyc29yIGxpbmUgd2l0aG91dCBmaXJpbmcgYVxuICAgIC8vIHNjcm9sbCBldmVudCBhZnRlcndhcmRzLCBzbyB0aGUgY2FwdHVyZS1waGFzZSByZXNldCBiZWxvdyB3b3VsZCBuZXZlclxuICAgIC8vIHJ1biBhbmQgYSBsb25nIG5vdGUgd291bGQgb3BlbiBtaWQtZG9jdW1lbnQuXG4gICAgZm9yIChjb25zdCBlbCBvZiB2aWV3Py5jb250ZW50RWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY20tc2Nyb2xsZXJcIikgPz8gW10pIHtcbiAgICAgIGlmIChlbC5zY3JvbGxUb3AgIT09IDApIGVsLnNjcm9sbFRvcCA9IDA7XG4gICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqIEV4aXQgU2xpZGVzIG1vZGU6IHJlc3RvcmUgdGhlIHZpZXcgbW9kZSByZWNvcmRlZCBhdCBlbnRyeSAqL1xuICBwcml2YXRlIGV4aXRTbGlkZXMoKTogdm9pZCB7XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgaWYgKHRoaXMuZXhpdE1vZGUgPT09IFwicHJldmlld1wiKSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJwcmV2aWV3XCIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiB0aGlzLmV4aXRTb3VyY2UgfTtcbiAgICAgIH1cbiAgICAgIHZvaWQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShzdGF0ZSwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZSBTbGlkZXMgbW9kZSAoZGVjayBub3RlcyBvbmx5IFx1MjAxNCBlbmZvcmNlZCBieSB0aGUgY29tbWFuZCkgKi9cbiAgdG9nZ2xlU2xpZGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHRoaXMuZXhpdFNsaWRlcygpO1xuICAgIGVsc2Ugdm9pZCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gIH1cblxuICAvKiogUmV2ZWFsIHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCwgY3JlYXRpbmcgaXQgaW4gdGhlIHJpZ2h0IHNpZGViYXIgaWYgbmVlZGVkICovXG4gIGFzeW5jIGFjdGl2YXRlU2xpZGVzUGFuZWwoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFNMSURFU19QQU5FTF9WSUVXKTtcbiAgICBpZiAoZXhpc3RpbmcubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLnJldmVhbExlYWYoZXhpc3RpbmdbMF0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSk7XG4gICAgaWYgKCFsZWFmKSByZXR1cm47XG4gICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoeyB0eXBlOiBTTElERVNfUEFORUxfVklFVywgYWN0aXZlOiB0cnVlIH0pO1xuICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xuICB9XG5cbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgb25jZSBwZXIgb3BlbmVkIGRlY2sgbm90ZSB3aGVuIHRoZSBzZXR0aW5nIGlzIG9uICovXG4gIHByaXZhdGUgbWF5YmVBdXRvRW50ZXJTbGlkZXMoKTogdm9pZCB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlIHx8IGZpbGUucGF0aCA9PT0gdGhpcy5hdXRvRW50ZXJlZFBhdGgpIHJldHVybjtcbiAgICB0aGlzLmF1dG9FbnRlcmVkUGF0aCA9IGZpbGUucGF0aDtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMgJiYgdGhpcy5pc0RlY2tOb3RlKGZpbGUpICYmICF0aGlzLnNsaWRlc01vZGUpIHtcbiAgICAgIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBQUFQgbmF2aWdhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogTW92ZSBvbmUgc3RlcCBiYWNrL2ZvcndhcmQgYWxvbmcgdGhlIGRlY2sgY2hhaW4gKGVudGVyaW5nIFNsaWRlcyBtb2RlIGFzIG5lZWRlZCkgKi9cbiAgYXN5bmMgbmF2aWdhdGUoZGlyZWN0aW9uOiBcInByZXZcIiB8IFwibmV4dFwiKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBpZiAoIWRlY2spIHJldHVybjtcbiAgICBjb25zdCB0YXJnZXQgPSBkZWNrLmNoYWluW2RpcmVjdGlvbiA9PT0gXCJwcmV2XCIgPyBkZWNrLmluZGV4IC0gMSA6IGRlY2suaW5kZXggKyAxXTtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5zbGlkZXNNb2RlKSBhd2FpdCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gICAgdm9pZCB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KHRhcmdldCwgZmlsZS5wYXRoKTtcbiAgfVxuXG4gIC8qKiBKdW1wIHRvIGEgc3BlY2lmaWMgaW5kZXggaW4gdGhlIGRlY2sgY2hhaW4gKHByb2dyZXNzIGJhciBjbGljaykgKi9cbiAgYXN5bmMganVtcFRvKGluZGV4OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGlmICghZGVjayB8fCBpbmRleCA8IDAgfHwgaW5kZXggPj0gZGVjay5jaGFpbi5sZW5ndGggfHwgaW5kZXggPT09IGRlY2suaW5kZXgpIHJldHVybjtcbiAgICBjb25zdCB0YXJnZXQgPSBkZWNrLmNoYWluW2luZGV4XTtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5zbGlkZXNNb2RlKSBhd2FpdCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gICAgdm9pZCB0aGlzLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KHRhcmdldCwgZmlsZS5wYXRoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBCYXIgcmVuZGVyaW5nIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIC8qKlxuICAgKiBHZXQgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIGZvciB0aGUgYmFyIHByb3BlcnRpZXMuIFJldHVybnMgYW4gYXJyYXkgb2ZcbiAgICogcGVyY2VudGFnZXMgKHN1bW1pbmcgdG8gMTAwKSBmb3IgZWFjaCBwcm9wZXJ0eS4gTG9hZHMgZnJvbSBzZXR0aW5ncyBvclxuICAgKiBkZWZhdWx0cyB0byBlcXVhbCBkaXN0cmlidXRpb24uXG4gICAqL1xuICBwcml2YXRlIGdldEJhclByb3BlcnR5V2lkdGhzKGNvdW50OiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0b3JlZCA9IEpTT04ucGFyc2UodGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0eVdpZHRocyB8fCBcIltdXCIpIGFzIHVua25vd247XG4gICAgICBpZiAoaXNOdW1iZXJMaXN0KHN0b3JlZCwgY291bnQpKSByZXR1cm4gc3RvcmVkO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gaWdub3JlXG4gICAgfVxuICAgIHJldHVybiBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCkuZmlsbCgxMDAgLyBjb3VudCk7XG4gIH1cblxuICAvKiogU2F2ZSBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgdG8gc2V0dGluZ3MgKi9cbiAgcHJpdmF0ZSBhc3luYyBzYXZlQmFyUHJvcGVydHlXaWR0aHMod2lkdGhzOiBudW1iZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgPSBKU09OLnN0cmluZ2lmeSh3aWR0aHMpO1xuICAgIGF3YWl0IHRoaXMuc2F2ZVNldHRpbmdzKCk7XG4gIH1cblxuICAvKiogRGVjaWRlIHdoYXQgdGhlIHNsaWRlcyBiYXIgc2hvd3MsIHRoZW4gcmUtcmVuZGVyIGl0ICovXG4gIHJlZnJlc2goKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmJhcikgcmV0dXJuO1xuICAgIHRoaXMuYXBwbHlUaGVtZUNsYXNzKCk7XG5cbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBtb2RlID0gY3VycmVudE1vZGUodGhpcy5hcHApO1xuICAgIGNvbnN0IGlzQ2FyZCA9IHRoaXMuaXNEZWNrTm90ZShmaWxlKTtcbiAgICBjb25zdCBsaXZlUHJldmlld05vdyA9IG1vZGUgPT09IFwic291cmNlXCIgJiYgaXNMaXZlUHJldmlldyh0aGlzLmFwcCk7XG5cbiAgICAvLyBMZWF2aW5nIGEgZGVjayBub3RlLCBvciBsZWF2aW5nIHRoZSBMaXZlIFByZXZpZXcgKGUuZy4gQ21kL0N0cmwrRSB0b1xuICAgIC8vIHJlYWRpbmcgdmlldyksIGVuZHMgU2xpZGVzIG1vZGUgXHUyMDE0IG9ubHkgdGhlIHRvZ2dsZSBjb21tYW5kIHJlLWVudGVycyBpdC5cbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlICYmICghaXNDYXJkIHx8ICFsaXZlUHJldmlld05vdykpIHtcbiAgICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE1lYXN1cmUgdGhlIHRhYiBiYXIgd2hpbGUgaXQgaXMgc3RpbGwgdmlzaWJsZSAoU2xpZGVzIG1vZGUgaGlkZXMgaXRcbiAgICAvLyBiZWxvdzsgdGhlIGxhc3QgbWVhc3VyZWQgdmFsdWUgaXMgcmV1c2VkIG9uY2UgaGlkZGVuKS5cbiAgICB0aGlzLnRhYkJhckhlaWdodCA9IHN5bmNUYWJCYXJIZWlnaHQodGhpcy50YWJCYXJIZWlnaHQpO1xuXG4gICAgLy8gU2xpZGVzIG1vZGUgaXMgYWN0aXZlIG9ubHkgd2hpbGUgYWN0dWFsbHkgaW4gdGhlIGVkaXRhYmxlIExpdmUgUHJldmlld1xuICAgIGNvbnN0IHNsaWRlcyA9IHRoaXMuc2xpZGVzTW9kZSAmJiBpc0NhcmQgJiYgbGl2ZVByZXZpZXdOb3c7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIsIHNsaWRlcyk7XG4gICAgaWYgKCFzbGlkZXMpIHRoaXMucG9pbnRlckhpZGRlbiA9IGZhbHNlOyAvLyBsZWF2aW5nIFNsaWRlcyByZXN0b3JlcyB0aGUgcG9pbnRlclxuICAgIHRoaXMuc3luY1BvaW50ZXJDbGFzcyhzbGlkZXMpO1xuICAgIHRoaXMuc3luY0ltYWdlTGF5b3V0Q2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnVwZGF0ZUlubGluZVRpdGxlKHNsaWRlcyk7XG5cbiAgICBjb25zdCBiYXJWaXNpYmxlID0gc2xpZGVzICYmIHRoaXMuc2V0dGluZ3Muc2hvd1NsaWRlc0JhciAmJiAhdGhpcy5zZXR0aW5ncy5iYXJIaWRkZW47XG4gICAgLy8gV2hlbiBiYXIgaXMgaGlkZGVuLCBzZXQgYm90dG9tIHBhZGRpbmcgdG8gMCBzbyB0aGUgY2FyZCBmaWxscyB0aGUgZnVsbFxuICAgIC8vIHdpbmRvdyBoZWlnaHQuIFdoZW4gdmlzaWJsZSwgcmVtb3ZlIHRoZSBvdmVycmlkZSBzbyBDU1MgZmFsbHMgYmFjayB0b1xuICAgIC8vIC0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0IChjbGVhcnMgdGhlIGJhciBhcyBiZWZvcmUpLlxuICAgIGlmIChiYXJWaXNpYmxlKSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtYmFyLWhlaWdodFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldENzc1Byb3BzKHsgXCItLW5hdGl2ZS1zbGlkZXMtYmFyLWhlaWdodFwiOiBcIjBweFwiIH0pO1xuICAgIH1cbiAgICBpZiAoIWJhclZpc2libGUpIHtcbiAgICAgIHRoaXMuYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IFwibm9uZVwiIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWZpbGUpIHJldHVybjsgLy8gYmFyVmlzaWJsZSBpbXBsaWVzIGEgZmlsZSwgYnV0IG5hcnJvdyBmb3IgVHlwZVNjcmlwdFxuXG4gICAgY29uc3QgZm0gPSBhY3RpdmVGcm9udG1hdHRlcih0aGlzLmFwcCk7XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBjbGVhckNoaWxkcmVuKHRoaXMuYmFyKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBMZWZ0OiBwcmV2aW91cyAvIG5leHQgYnV0dG9ucyAoYm90aCBhbHdheXMgc2hvd24gaW5zaWRlIGEgZGVjaztcbiAgICAvLyAgICAgICAgdGhlIG9uZSB0aGF0IGNhbm5vdCBtb3ZlIGlzIGRpc2FibGVkIC8gbGlnaHQgZ3JheSkgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgJiYgZGVjaykge1xuICAgICAgY29uc3QgaGFzUHJldiA9IGRlY2suaW5kZXggPiAwO1xuICAgICAgY29uc3QgaGFzTmV4dCA9IGRlY2suaW5kZXggPCBkZWNrLmNoYWluLmxlbmd0aCAtIDE7XG4gICAgICBjb25zdCBuYXYgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1uYXZcIiB9KTtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QzBcIiwgXCJQcmV2aW91cyBwYWdlXCIsICgpID0+IHZvaWQgdGhpcy5uYXZpZ2F0ZShcInByZXZcIiksICFoYXNQcmV2KSk7XG4gICAgICBuYXYuYXBwZW5kQ2hpbGQobmF2QnV0dG9uKFwiXHUyNUI2XCIsIFwiTmV4dCBwYWdlXCIsICgpID0+IHZvaWQgdGhpcy5uYXZpZ2F0ZShcIm5leHRcIiksICFoYXNOZXh0KSk7XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChuYXYpO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBNaWRkbGU6IGNvbmZpZ3VyZWQgcHJvcGVydHkgY29sdW1ucyB3aXRoIGRyYWdnYWJsZSBkaXZpZGVycyBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBwcm9wTmFtZXMgPSB0aGlzLnNldHRpbmdzLmJhclByb3BlcnRpZXNcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgIGlmIChwcm9wTmFtZXMubGVuZ3RoID4gMCAmJiBmbSkge1xuICAgICAgY29uc3QgZW50cmllczogW3N0cmluZywgc3RyaW5nXVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcHJvcE5hbWVzKSB7XG4gICAgICAgIGlmIChuYW1lIGluIGZtKSB7XG4gICAgICAgICAgY29uc3QgdmFsID0gZm1bbmFtZV07XG4gICAgICAgICAgaWYgKHZhbCAhPSBudWxsKSBlbnRyaWVzLnB1c2goW25hbWUsIGZvcm1hdFZhbHVlKHZhbCldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1wcm9wZXJ0aWVzXCIgfSk7XG5cbiAgICAgICAgY29uc3Qgd2lkdGhzID0gdGhpcy5nZXRCYXJQcm9wZXJ0eVdpZHRocyhlbnRyaWVzLmxlbmd0aCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgWywgdmFsdWVdID0gZW50cmllc1tpXTtcbiAgICAgICAgICBjb25zdCBpdGVtID0gY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1wcm9wLWl0ZW1cIiwgdGV4dDogdmFsdWUgfSk7XG4gICAgICAgICAgaXRlbS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke3dpZHRoc1tpXX0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWAsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW0pO1xuXG4gICAgICAgICAgaWYgKGkgPCBlbnRyaWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdmlkZXIgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItZGl2aWRlclwiIH0pO1xuICAgICAgICAgICAgZGl2aWRlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgY29uc3Qgc3RhcnRYID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgY29uc3QgaW5pdGlhbFdpZHRocyA9IFsuLi53aWR0aHNdO1xuICAgICAgICAgICAgICBjb25zdCBvbk1vdmUgPSAoZXY6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9ICgoZXYuY2xpZW50WCAtIHN0YXJ0WCkgLyBjb250YWluZXJXaWR0aCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TGVmdCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaV0gKyBkZWx0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UmlnaHQgPSBNYXRoLm1heCg1LCBpbml0aWFsV2lkdGhzW2kgKyAxXSAtIGRlbHRhKTtcbiAgICAgICAgICAgICAgICB3aWR0aHNbaV0gPSBuZXdMZWZ0O1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpICsgMV0gPSBuZXdSaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICAgICAgICAgICAgIFwiLm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uc2V0Q3NzU3R5bGVzKHtcbiAgICAgICAgICAgICAgICAgIGZsZXhCYXNpczogYGNhbGMoJHtuZXdMZWZ0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpdGVtc1tpICsgMV0uc2V0Q3NzU3R5bGVzKHtcbiAgICAgICAgICAgICAgICAgIGZsZXhCYXNpczogYGNhbGMoJHtuZXdSaWdodH0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGNvbnN0IG9uVXAgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdmUpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2V0Q3NzU3R5bGVzKHsgY3Vyc29yOiBcIlwiLCB1c2VyU2VsZWN0OiBcIlwiIH0pO1xuICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5zYXZlQmFyUHJvcGVydHlXaWR0aHMod2lkdGhzKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdmUpO1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvblVwKTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRDc3NTdHlsZXMoeyBjdXJzb3I6IFwiY29sLXJlc2l6ZVwiLCB1c2VyU2VsZWN0OiBcIm5vbmVcIiB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdmlkZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQnJva2VuIGRlY2sgbGlua3MgXHUyMTkyIHdhcm5pbmcgY2hpcCBzbyBkZWNrIGF1dGhvcnMgc3BvdCB0eXBvc1xuICAgIGNvbnN0IGJyb2tlbiA9IGZpbGUgPyB0aGlzLmRlY2tTZXJ2aWNlLmJyb2tlbihmaWxlKSA6IFtdO1xuICAgIGlmIChicm9rZW4ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgd2FybiA9IGNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy13YXJuXCIsXG4gICAgICAgIHRleHQ6IFwiXHUyNkEwIFwiICsgYnJva2VuLmpvaW4oXCIsIFwiKSxcbiAgICAgICAgYXR0cjogeyB0aXRsZTogXCJCcm9rZW4gZGVjayBsaW5rKHMpIFx1MjAxNCB0aGUgdGFyZ2V0IG5vdGUgZG9lcyBub3QgZXhpc3RcIiB9LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZCh3YXJuKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQm90dG9tLXJpZ2h0OiBhdXRvLWNvbXB1dGVkIHBhZ2UgbnVtYmVyIFx1MjUwMFx1MjUwMFxuICAgIGlmICh0aGlzLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSAhPT0gXCJub25lXCIgJiYgZGVjaykge1xuICAgICAgLy8gdjEuMC4wIG5leHQtb25seSBzZW1hbnRpY3M6IGNoYWluWzBdIGlzIHRoZSBoZWFkIHNsaWRlID0gcGFnZSAxO1xuICAgICAgLy8gdG90YWwgaXMgdGhlIGZ1bGwgY2hhaW4gbGVuZ3RoLlxuICAgICAgY29uc3QgdG90YWwgPSBkZWNrLmNoYWluLmxlbmd0aDtcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVTcGFuKHtcbiAgICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFnZVwiLFxuICAgICAgICB0ZXh0OlxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlID09PSBcImZyYWN0aW9uXCJcbiAgICAgICAgICAgID8gYCR7ZGVjay5pbmRleCArIDF9IC8gJHt0b3RhbH1gXG4gICAgICAgICAgICA6IGAke2RlY2suaW5kZXggKyAxfWAsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHBhZ2UpO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQcm9ncmVzcyBpbmRpY2F0b3I6IGRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCBiYXIgdG9wIFx1MjUwMFx1MjUwMFxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dQcm9ncmVzcyAmJiBkZWNrICYmIGRlY2suY2hhaW4ubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wcm9ncmVzc1wiIH0pO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWNrLmNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gaSA8IGRlY2suaW5kZXggPyBcInBhc3RcIiA6IGkgPT09IGRlY2suaW5kZXggPyBcImN1cnJlbnRcIiA6IFwiZnV0dXJlXCI7XG4gICAgICAgIGNvbnN0IHNlZyA9IGNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiBgbmF0aXZlLXNsaWRlcy1wcm9ncmVzcy1zZWcgbmF0aXZlLXNsaWRlcy1wcm9ncmVzcy1zZWctLSR7c3RhdGV9YCxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdm9pZCB0aGlzLmp1bXBUbyhpKSk7XG4gICAgICAgIHByb2dyZXNzLmFwcGVuZENoaWxkKHNlZyk7XG4gICAgICB9XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChwcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gSGlkZSB0aGUgc2xpZGVzIGJhciBlbnRpcmVseSB3aGVuIGl0IGhhcyBub3RoaW5nIHRvIGRpc3BsYXkgKG5vIHByb3BlcnRpZXMsXG4gICAgLy8gYW5kIG5vdCBwYXJ0IG9mIGEgZGVjaylcbiAgICB0aGlzLmJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiB0aGlzLmJhci5jaGlsZEVsZW1lbnRDb3VudCA9PT0gMCA/IFwibm9uZVwiIDogXCJcIiB9KTtcbiAgfVxufVxuXG4vKiogV2hldGhlciBgdmFsdWVgIGlzIGFuIGFycmF5IG9mIGV4YWN0bHkgYGNvdW50YCBudW1iZXJzIChzdG9yZWQgYmFyIHdpZHRocykuICovXG5mdW5jdGlvbiBpc051bWJlckxpc3QodmFsdWU6IHVua25vd24sIGNvdW50OiBudW1iZXIpOiB2YWx1ZSBpcyBudW1iZXJbXSB7XG4gIHJldHVybiAoXG4gICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSBjb3VudCAmJiB2YWx1ZS5ldmVyeSgobikgPT4gdHlwZW9mIG4gPT09IFwibnVtYmVyXCIpXG4gICk7XG59XG4iLCAiLyoqIENyZWF0ZSB0aGUgc2xpZGVzIGJhciBET00gZWxlbWVudCAoaGlkZGVuIHVudGlsIHJlZnJlc2goKSBzaG93cyBpdCkgKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCYXIoKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCBiYXIgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXJcIiB9KTtcbiAgYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IFwibm9uZVwiIH0pO1xuICBiYXIudGl0bGUgPSBcIkNsaWNrIHRvIHBhcmsgdGhlIG1vdXNlIFx1MjAxNCBoaWRlcyB0aGUgZWRpdG9yIGNhcmV0IHdoaWxlIHByZXNlbnRpbmdcIjtcbiAgLy8gUHJlc2VudGF0aW9uIHBhcmtpbmc6IGNsaWNraW5nIHRoZSBiYXIga2VlcHMgZm9jdXMgb3V0IG9mIHRoZSBlZGl0b3Igc29cbiAgLy8gdGhlIGJsaW5raW5nIGNhcmV0IGRpc2FwcGVhcnMuIHByZXZlbnREZWZhdWx0IHN0b3BzIHRoZSBjbGljayBmcm9tIG1vdmluZ1xuICAvLyBmb2N1cyBvciBzdGFydGluZyBhIHRleHQgc2VsZWN0aW9uOyBidXR0b25zIHN0aWxsIHJlY2VpdmUgdGhlaXIgY2xpY2sgZXZlbnQuXG4gIGJhci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGFjdGl2ZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgfSk7XG4gIHJldHVybiBiYXI7XG59XG5cbi8qKiBCdWlsZCBhIFx1MjVDMCAvIFx1MjVCNiBuYXZpZ2F0aW9uIGJ1dHRvbjsgYGRpc2FibGVkYCByZW5kZXJzIGl0IGxpZ2h0IGdyYXkvaW5hY3RpdmUgKi9cbmV4cG9ydCBmdW5jdGlvbiBuYXZCdXR0b24oXG4gIGxhYmVsOiBzdHJpbmcsXG4gIHRpcDogc3RyaW5nLFxuICBvbkNsaWNrOiAoKSA9PiB2b2lkLFxuICBkaXNhYmxlZCA9IGZhbHNlLFxuKTogSFRNTEJ1dHRvbkVsZW1lbnQge1xuICBjb25zdCBidG4gPSBjcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtbmF2LWJ0blwiLFxuICAgIHRleHQ6IGxhYmVsLFxuICAgIGF0dHI6IHsgdGl0bGU6IHRpcCB9LFxuICB9KTtcbiAgYnRuLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gIGlmICghZGlzYWJsZWQpIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25DbGljayk7XG4gIHJldHVybiBidG47XG59XG5cbi8qKlxuICogTWVhc3VyZSB0aGUgdG9wIHRhYiBiYXIgYW5kIGV4cG9zZSBpdHMgaGVpZ2h0IGFzIHRoZSBDU1MgdmFyaWFibGVcbiAqIC0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0LCByZXR1cm5pbmcgdGhlIChwb3NzaWJseSB1cGRhdGVkKSBjYWNoZWRcbiAqIHZhbHVlLiBUaGUgc2xpZGVzIGJhciBpcyBoaWRkZW4gaW4gU2xpZGVzIG1vZGUsIHNvIHRoZSBsYXN0IG1lYXN1cmVkXG4gKiB2YWx1ZSBpcyByZXVzZWQgdGhlcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzeW5jVGFiQmFySGVpZ2h0KGNhY2hlZDogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgdGFiQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXG4gICAgXCIud29ya3NwYWNlLXRhYnMubW9kLXRvcCAud29ya3NwYWNlLXRhYi1oZWFkZXItY29udGFpbmVyXCIsXG4gICk7XG4gIGlmICh0YWJCYXIgJiYgdGFiQmFyLm9mZnNldEhlaWdodCA+IDApIGNhY2hlZCA9IHRhYkJhci5vZmZzZXRIZWlnaHQ7XG4gIGlmIChjYWNoZWQgPiAwKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldENzc1Byb3BzKHsgXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiOiBgJHtjYWNoZWR9cHhgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIE5vIG1lYXN1cmVtZW50IHlldCAodGFiIGJhciBoaWRkZW4gc2luY2UgbG9hZCkgXHUyMDE0IGxldCB0aGUgQ1NTIGZhbGxiYWNrIGFwcGx5LlxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIi0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0XCIpO1xuICB9XG4gIHJldHVybiBjYWNoZWQ7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL21vZGVcIjtcblxuLyoqXG4gKiBUeXBvZ3JhcGh5LW1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSkuXG4gKlxuICogVGhlIGBucy1kZWJ1Zy1zdHlsZXNgIGNvbW1hbmQgc2FtcGxlcyB0aGUgZml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIGluXG4gKiBlZGl0IChMaXZlIFByZXZpZXcpIGFuZCB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgaW4gcmVhZGluZyB2aWV3LCBtZXJnZXMgdGhlXG4gKiByZXN1bHRzLCBjb21wdXRlcyBhbiBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmQgd3JpdGVzIGl0IHRvXG4gKiAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LiBSZWdpc3RlcmVkIG9ubHkgd2hlbiB0aGVcbiAqIGJ1aWxkLXRpbWUgREVWX01PREUgZmxhZyBpcyB0cnVlOyByZWxlYXNlIGJ1aWxkcyB0cmVlLXNoYWtlIHRoaXMgbW9kdWxlIG91dC5cbiAqL1xuXG4vKiogRml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIHVzZWQgYnkgdGhlIGRlYnVnIGNvbW1hbmQgKGVkaXQgc2lkZSkgKi9cbmV4cG9ydCBjb25zdCBTQU1QTEVfTk9URV9OQU1FUyA9IFtcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1oZWFkaW5nc1wiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLWxpc3RcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1jb2RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtcXVvdGVcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1tZWRpYVwiLFxuXTtcblxuLyoqIFN0eWxlIHNlY3Rpb25zIHNhbXBsZWQgYnkgc2FtcGxlU3R5bGVzKCkgYW5kIGNvbXBhcmVkIGJ5IGRpZmZEdW1wcygpICovXG5jb25zdCBTVFlMRV9TRUNUSU9OUyA9IFtcbiAgXCJjb250YWluZXJcIixcbiAgXCJwYXJhZ3JhcGhcIixcbiAgXCJoMVwiLFxuICBcImxpc3RJdGVtXCIsXG4gIFwiY29kZUJsb2NrXCIsXG4gIFwiYmxvY2txdW90ZVwiLFxuICBcImlubGluZUNvZGVcIixcbiAgXCJ0YWJsZVwiLFxuICBcImltYWdlXCIsXG4gIFwiaG9yaXpvbnRhbFJ1bGVcIixcbl07XG5cbi8qKiBQcm9taXNlLWJhc2VkIHNsZWVwICovXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gd2luZG93LnNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuLyoqXG4gKiBNZXJnZSBub24tbWlzc2luZyBzdHlsZSBzZWN0aW9ucyBvZiBhIGZyZXNoIHNhbXBsZSBpbnRvIHRoZSB0YXJnZXRcbiAqIChmaXJzdCBub24tbWlzc2luZyB2YWx1ZSB3aW5zKS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTYW1wbGUodGFyZ2V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgc2FtcGxlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHZvaWQge1xuICBmb3IgKGNvbnN0IGtleSBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IHNlY3Rpb24gPSBzYW1wbGVba2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuICAgIGlmICghc2VjdGlvbiB8fCBcIihtaXNzaW5nKVwiIGluIHNlY3Rpb24pIGNvbnRpbnVlO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGFyZ2V0W2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoZXhpc3RpbmcgJiYgIShcIihtaXNzaW5nKVwiIGluIGV4aXN0aW5nKSkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzZWN0aW9uO1xuICB9XG4gIC8vIFByb2JlIGZpZWxkcyByaWRlIGFsb25nIChmaXJzdCBub24tZW1wdHkgd2lucylcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwibGlzdExpbmVzXCIsXG4gICAgXCJtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXlcIixcbiAgICBcImgxT2Zmc2V0VG9wXCIsXG4gICAgXCJoMVRvcEluQ29udGVudFwiLFxuICAgIFwiaDFMZWZ0SW5Db250ZW50XCIsXG4gICAgXCJ0aXRsZVwiLFxuICAgIFwiY29udGVudENoaWxkcmVuXCIsXG4gICAgXCJ0b3BDaGFpblwiLFxuICBdKSB7XG4gICAgY29uc3QgcHJvYmUgPSBzYW1wbGVba2V5XTtcbiAgICBpZiAocHJvYmUgPT09IHVuZGVmaW5lZCB8fCBwcm9iZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvYmUpICYmIHByb2JlLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgaWYgKHR5cGVvZiBwcm9iZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShwcm9iZSkgJiYgT2JqZWN0LmtleXMocHJvYmUpLmxlbmd0aCA9PT0gMClcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmICh0YXJnZXRba2V5XSA9PT0gdW5kZWZpbmVkKSB0YXJnZXRba2V5XSA9IHByb2JlO1xuICB9XG59XG5cbi8qKlxuICogQ29tcGFyZSB0aGUgc3R5bGUgc2VjdGlvbnMgb2YgYW4gZWRpdCBkdW1wIGFuZCBhIHJlYWRpbmcgZHVtcDsgb25seVxuICoga2V5cyB3aG9zZSB2YWx1ZXMgZGlmZmVyIGFyZSBrZXB0LCBhcyB7IGtleTogeyBlZGl0LCByZWFkaW5nIH0gfS5cbiAqL1xuZnVuY3Rpb24gZGlmZkR1bXBzKFxuICBlZGl0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgZm9yIChjb25zdCBzZWN0aW9uIG9mIFNUWUxFX1NFQ1RJT05TKSB7XG4gICAgY29uc3QgZSA9IChlZGl0W3NlY3Rpb25dID8/IHt9KSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGNvbnN0IHIgPSAocmVhZGluZ1tzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldChbLi4uT2JqZWN0LmtleXMoZSksIC4uLk9iamVjdC5rZXlzKHIpXSk7XG4gICAgY29uc3QgZGlmZnM6IFJlY29yZDxzdHJpbmcsIHsgZWRpdDogc3RyaW5nOyByZWFkaW5nOiBzdHJpbmcgfT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICBpZiAoZVtrZXldICE9PSByW2tleV0pIHtcbiAgICAgICAgZGlmZnNba2V5XSA9IHsgZWRpdDogZVtrZXldID8/IFwiKG1pc3NpbmcpXCIsIHJlYWRpbmc6IHJba2V5XSA/PyBcIihtaXNzaW5nKVwiIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhkaWZmcykubGVuZ3RoID4gMCkgb3V0W3NlY3Rpb25dID0gZGlmZnM7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqIFNhbXBsZSB0aGUgY3VycmVudCB2aWV3J3MgdHlwb2dyYXBoeSBjb21wdXRlZCBzdHlsZXMgKyBDU1MgdmFyaWFibGVzICovXG5mdW5jdGlvbiBzYW1wbGVTdHlsZXMoYXBwOiBBcHApOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGlzRWRpdCA9IHZpZXcuZ2V0TW9kZSgpID09PSBcInNvdXJjZVwiO1xuICBjb25zdCBjb250ZW50RWwgPSB2aWV3LmNvbnRlbnRFbDtcbiAgLy8gRmlyc3QgbWF0Y2hpbmcgY2FuZGlkYXRlIHdpbnMgXHUyMDE0IGVkaXQgKGNtNikgYW5kIHJlYWRpbmcgdXNlXG4gIC8vIGRpZmZlcmVudCBlbGVtZW50IHN0cnVjdHVyZXMgKGUuZy4gbm8gcHJlL2Jsb2NrcXVvdGUgaW4gY202KS5cbiAgY29uc3QgcGljayA9IChzZWxzOiBzdHJpbmdbXSk6IEhUTUxFbGVtZW50IHwgbnVsbCA9PiB7XG4gICAgZm9yIChjb25zdCBzZWwgb2Ygc2Vscykge1xuICAgICAgY29uc3QgZWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc2VsKTtcbiAgICAgIGlmIChlbCkgcmV0dXJuIGVsO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgY29uc3Qgc3R5bGUgPSAoZWw6IEhUTUxFbGVtZW50IHwgbnVsbCwgcHJvcHM6IHN0cmluZ1tdKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gICAgaWYgKCFlbCkgcmV0dXJuIHsgXCIobWlzc2luZylcIjogXCJlbGVtZW50IG5vdCBpbiB0aGlzIG5vdGVcIiB9O1xuICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIHByb3BzKSB7XG4gICAgICBjb25zdCB2ID0gY3MuZ2V0UHJvcGVydHlWYWx1ZShwKS50cmltKCk7XG4gICAgICBpZiAodikgb3V0W3BdID0gdjtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgY29uc3QgdmFycyA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XG4gIGNvbnN0IGNzc1ZhciA9IChuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4gdmFycy5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpLnRyaW0oKTtcblxuICBjb25zdCBjb250YWluZXIgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tY29udGVudFwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3XCIsXG4gIF0pO1xuICBjb25zdCBwYXJhID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWxpbmU6bm90KC5IeXBlck1ELWhlYWRlcilcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBwXCIsXG4gIF0pO1xuICBjb25zdCBoMSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWhlYWRlci0xXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaDFcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBoMVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGgxXCIsXG4gIF0pO1xuICBjb25zdCBsaXN0SXRlbSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtbGlzdC1saW5lXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICAgIGlzRWRpdCA/IFwiLkh5cGVyTUQtbGlzdC1saW5lXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyB1bCA+IGxpXCIsXG4gIF0pO1xuICBjb25zdCBwcmUgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBwcmVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1lZGl0aW5nIHByZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtY29kZWJsb2NrXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gIF0pO1xuICBjb25zdCBxdW90ZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgYmxvY2txdW90ZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGJsb2NrcXVvdGVcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1xdW90ZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGJsb2NrcXVvdGVcIixcbiAgXSk7XG4gIGNvbnN0IGlubGluZUNvZGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGNvZGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBjb2RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWlubGluZS1jb2RlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgY29kZVwiLFxuICBdKTtcbiAgY29uc3QgdGFibGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IHRhYmxlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgdGFibGVcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIHRhYmxlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyB0YWJsZVwiLFxuICBdKTtcbiAgY29uc3QgaW1nID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBpbWdcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIGltZ1wiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaW1nXCIsXG4gICAgXCJpbWdcIiwgLy8gd2hvbGUtZG9jdW1lbnQgZmFsbGJhY2tcbiAgXSk7XG4gIGNvbnN0IGhyID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBoclwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBoclwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaHJcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1oclwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gIF0pO1xuXG4gIC8vIFN0cnVjdHVyZSBwcm9iZXMgKGVkaXQgdmlldyBvbmx5KTogdGhlIHNvdXJjZS12aWV3IGNsYXNzIGxpc3RcbiAgLy8gKGNvbmZpcm1zIHRoZSBMaXZlIFByZXZpZXcgbWFya2VyIGNsYXNzKSBhbmQgdW5pcXVlIGVsZW1lbnQgdGFnc1xuICAvLyBpbnNpZGUgdGhlIGVkaXRvciAocmV2ZWFscyBob3cgY202IHJlbmRlcnMgY29kZSBibG9ja3MgZXRjLiB3aGVuXG4gIC8vIHRoZSB1c3VhbCBzZWxlY3RvcnMgZG8gbm90IG1hdGNoKS5cbiAgY29uc3Qgc291cmNlVmlld0NsYXNzID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNlwiKT8uY2xhc3NOYW1lID8/IFwiXCI7XG4gIGNvbnN0IGRvbVRhZ3M6IHN0cmluZ1tdID0gW107XG4gIGlmIChpc0VkaXQpIHtcbiAgICBjb25zdCB0YWdzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29udGVudEVsXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202ICpcIilcbiAgICAgIC5mb3JFYWNoKChlbCkgPT4gdGFncy5hZGQoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG4gICAgZG9tVGFncy5wdXNoKC4uLnRhZ3MpO1xuICB9XG4gIC8vIExpc3QtbGluZSBwcm9iZSAoZWRpdCB2aWV3IG9ubHkpOiBjbGFzcyBuYW1lcyArIGNvbXB1dGVkIHBhZGRpbmdcbiAgLy8gb2YgdGhlIGZpcnN0IGxpc3QgbGluZXMgXHUyMDE0IG5lc3RlZCBsZXZlbHMgb2Z0ZW4gdXNlIGRpc3RpbmN0XG4gIC8vIGNsYXNzZXMgb3IgaW5saW5lIHBhZGRpbmdzLCB3aGljaCBkZWNpZGVzIHdoZXRoZXIgYSBsZXZlbC1hd2FyZVxuICAvLyBpbmRlbnQgb3ZlcnJpZGUgaXMgZXZlbiBwb3NzaWJsZS5cbiAgY29uc3QgbGlzdExpbmVzOiB7IGNsYXNzTmFtZTogc3RyaW5nOyBwYWRkaW5nTGVmdDogc3RyaW5nIH1bXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29udGVudEVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuSHlwZXJNRC1saXN0LWxpbmVcIikuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgIGlmIChpID49IDQpIHJldHVybjtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBsaXN0TGluZXMucHVzaCh7XG4gICAgICAgIGNsYXNzTmFtZTogZWwuY2xhc3NOYW1lLFxuICAgICAgICBwYWRkaW5nTGVmdDogY3MuZ2V0UHJvcGVydHlWYWx1ZShcInBhZGRpbmctbGVmdFwiKS50cmltKCksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvLyBGcm9udG1hdHRlciBwcm9iZXM6IGRvZXMgdGhlIChoaWRkZW4pIHByb3BlcnRpZXMgYXJlYSBzdGlsbFxuICAvLyBvY2N1cHkgc3BhY2UgaW4gTGl2ZSBQcmV2aWV3PyBBbmQgaG93IGZhciBpcyB0aGUgSDEgZnJvbSB0aGVcbiAgLy8gdG9wIG9mIHRoZSBjb250ZW50IGFyZWE/IChyZWFkaW5nIG1vZGUgaGFzIG5vIHN1Y2ggcGFkZGluZylcbiAgY29uc3QgbWV0YWRhdGFEaXNwbGF5ID0gKCgpID0+IHtcbiAgICBjb25zdCBzZWwgPSBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWV0YWRhdGEtY29udGFpbmVyXCI7XG4gICAgY29uc3QgZWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc2VsKTtcbiAgICByZXR1cm4gZWwgPyBnZXRDb21wdXRlZFN0eWxlKGVsKS5kaXNwbGF5IDogXCIobm90IGluIERPTSlcIjtcbiAgfSkoKTtcbiAgY29uc3QgaDFPZmZzZXRUb3AgPSAoKCkgPT4ge1xuICAgIGlmICghaDEpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IHRvcCA9IDA7XG4gICAgbGV0IG5vZGU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGgxO1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRlbnRFbCAmJiBub2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICB0b3AgKz0gbm9kZS5vZmZzZXRUb3A7XG4gICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdG9wO1xuICB9KSgpO1xuICAvLyBXaGF0IG9jY3VwaWVzIHRoZSBzcGFjZSBiZXR3ZWVuIHRoZSBjb250ZW50IHRvcCBhbmQgdGhlIEgxP1xuICAvLyAoZWRpdCkgZmlyc3QgY2hpbGRyZW4gb2YgLmNtLWNvbnRlbnQsIGFuZCB0aGUgbmV0IEgxIGRpc3RhbmNlXG4gIC8vIGZyb20gdGhlIGNvbnRlbnQgYW5jaG9yIFx1MjAxNCByZWFkaW5nIGhhcyBubyBzdWNoIGdhcC5cbiAgY29uc3QgYW5jaG9yID0gaXNFZGl0XG4gICAgPyBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKVxuICAgIDogY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3XCIpO1xuICBjb25zdCBoMVRvcEluQ29udGVudCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSB8fCAhYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGgxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApO1xuICB9KSgpO1xuICBjb25zdCBoMUxlZnRJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpO1xuICB9KSgpO1xuICBjb25zdCBjb250ZW50Q2hpbGRyZW4gPSAoKCkgPT4ge1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFuY2hvci5jaGlsZHJlbilcbiAgICAgIC5zbGljZSgwLCA0KVxuICAgICAgLm1hcCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjbHM6IChlbCBhcyBIVE1MRWxlbWVudCkuY2xhc3NOYW1lIHx8IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpLFxuICAgICAgICAgIG1hcmdpblRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgICAgIHBhZGRpbmdUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiBjcy5tYXJnaW5Cb3R0b20sXG4gICAgICAgICAgcGFkZGluZ0JvdHRvbTogY3MucGFkZGluZ0JvdHRvbSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9KSgpO1xuICAvLyBDb250YWluZXIgY2hhaW4gcHJvYmU6IGZyb20gLmNtLWNvbnRlbnQgdXAgdG8gdGhlIHZpZXctY29udGVudCxcbiAgLy8gZWFjaCB3cmFwcGVyJ3MgcGFkZGluZy9tYXJnaW4gXHUyMDE0IGxvY2F0ZXMgdGhlIGxlZnRvdmVyIHZlcnRpY2FsXG4gIC8vIG9mZnNldCBiZXR3ZWVuIGVkaXQgYW5kIHJlYWRpbmcgY29udGVudCBhcmVhcy5cbiAgY29uc3QgdG9wQ2hhaW4gPSAoKCkgPT4ge1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcnRzOiB7IGNsczogc3RyaW5nOyBwYWRUb3A6IHN0cmluZzsgbWFyVG9wOiBzdHJpbmcgfVtdID0gW107XG4gICAgbGV0IG5vZGU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGFuY2hvcjtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIGNsczogbm9kZS5jbGFzc05hbWUgfHwgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHBhZFRvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgICAgbWFyVG9wOiBjcy5tYXJnaW5Ub3AsXG4gICAgICB9KTtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBwYXJ0cztcbiAgfSkoKTtcblxuICAvLyBUaXRsZSBwcm9iZTogdGhlIGdlbmVyYXRlZCA6OmJlZm9yZSBpbiBTbGlkZXMgbW9kZSAod2hlbiBhIHRpdGxlIGlzXG4gIC8vIGNvbmZpZ3VyZWQpLiBDYXB0dXJlcyBpdHMgY29tcHV0ZWQgc3R5bGUgc28gd2UgY2FuIGRpZmYgaXQgYWdhaW5zdCB0aGVcbiAgLy8gYm9keSBIMSAoLmNtLWhlYWRlci0xKSBhbmQgYWxpZ24gdGhlbSBleGFjdGx5LlxuICBjb25zdCB0aXRsZUJlZm9yZSA9ICgoKSA9PiB7XG4gICAgaWYgKCFpc0VkaXQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY29udGVudCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICAgIGlmICghY29udGVudCB8fCAhY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoY29udGVudCwgXCI6OmJlZm9yZVwiKTtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogY3MuY29udGVudCxcbiAgICAgIGRpc3BsYXk6IGNzLmRpc3BsYXksXG4gICAgICBwb3NpdGlvbjogY3MucG9zaXRpb24sXG4gICAgICB0b3A6IGNzLnRvcCxcbiAgICAgIGxlZnQ6IGNzLmxlZnQsXG4gICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgZm9udEZhbWlseTogY3MuZm9udEZhbWlseSxcbiAgICAgIGZvbnRTaXplOiBjcy5mb250U2l6ZSxcbiAgICAgIGxpbmVIZWlnaHQ6IGNzLmxpbmVIZWlnaHQsXG4gICAgICBmb250V2VpZ2h0OiBjcy5mb250V2VpZ2h0LFxuICAgICAgZm9udFZhcmlhbnQ6IGNzLmZvbnRWYXJpYW50LFxuICAgICAgY29sb3I6IGNzLmNvbG9yLFxuICAgICAgbGV0dGVyU3BhY2luZzogY3MubGV0dGVyU3BhY2luZyxcbiAgICAgIHRleHRUcmFuc2Zvcm06IGNzLnRleHRUcmFuc2Zvcm0sXG4gICAgICB3b3JkU3BhY2luZzogY3Mud29yZFNwYWNpbmcsXG4gICAgICBmb250S2VybmluZzogY3MuZm9udEtlcm5pbmcsXG4gICAgICBmb250RmVhdHVyZVNldHRpbmdzOiBjcy5mb250RmVhdHVyZVNldHRpbmdzLFxuICAgICAgZm9udFZhcmlhbnROdW1lcmljOiBjcy5mb250VmFyaWFudE51bWVyaWMsXG4gICAgICBmb250VmFyaWFudExpZ2F0dXJlczogY3MuZm9udFZhcmlhbnRMaWdhdHVyZXMsXG4gICAgICBmb250VmFyaWFudENhcHM6IGNzLmZvbnRWYXJpYW50Q2FwcyxcbiAgICB9O1xuICB9KSgpO1xuXG4gIGNvbnN0IGR1bXAgPSB7XG4gICAgbW9kZTogaXNFZGl0ID8gXCJlZGl0IChMaXZlIFByZXZpZXcpXCIgOiBcInJlYWRpbmdcIixcbiAgICAvLyBTbGlkZXMgc3R5bGluZyBvbmx5IGFwcGxpZXMgd2hlbiBTbGlkZXMgbW9kZSBpcyBvblxuICAgIHNsaWRlc0FjdGl2ZTogZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIiksXG4gICAgZG9tVGFnczogaXNFZGl0ID8gZG9tVGFncyA6IHVuZGVmaW5lZCxcbiAgICBzb3VyY2VWaWV3Q2xhc3M6IGlzRWRpdCA/IHNvdXJjZVZpZXdDbGFzcyA6IHVuZGVmaW5lZCxcbiAgICBsaXZlUHJldmlldzogaXNFZGl0ID8gaXNMaXZlUHJldmlldyhhcHApIDogdW5kZWZpbmVkLFxuICAgIGxpc3RMaW5lczogaXNFZGl0ID8gbGlzdExpbmVzIDogdW5kZWZpbmVkLFxuICAgIG1ldGFkYXRhQ29udGFpbmVyRGlzcGxheTogbWV0YWRhdGFEaXNwbGF5LFxuICAgIGgxT2Zmc2V0VG9wOiBoMU9mZnNldFRvcCxcbiAgICBoMVRvcEluQ29udGVudDogaDFUb3BJbkNvbnRlbnQsXG4gICAgaDFMZWZ0SW5Db250ZW50OiBoMUxlZnRJbkNvbnRlbnQsXG4gICAgY29udGVudENoaWxkcmVuOiBjb250ZW50Q2hpbGRyZW4sXG4gICAgdG9wQ2hhaW46IHRvcENoYWluLFxuICAgIHRpdGxlOiB0aXRsZUJlZm9yZSxcbiAgICBjb250YWluZXI6IHN0eWxlKGNvbnRhaW5lciwgW1xuICAgICAgXCJmb250LWZhbWlseVwiLFxuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwibWF4LXdpZHRoXCIsXG4gICAgICBcIndpZHRoXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcImNvbG9yXCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBwYXJhZ3JhcGg6IHN0eWxlKHBhcmEsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGgxOiBzdHlsZShoMSwgW1xuICAgICAgXCJmb250LWZhbWlseVwiLFxuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwiZm9udC13ZWlnaHRcIixcbiAgICAgIFwiZm9udC12YXJpYW50XCIsXG4gICAgICBcImNvbG9yXCIsXG4gICAgICBcImxldHRlci1zcGFjaW5nXCIsXG4gICAgICBcInRleHQtdHJhbnNmb3JtXCIsXG4gICAgICBcIndvcmQtc3BhY2luZ1wiLFxuICAgICAgXCJmb250LWtlcm5pbmdcIixcbiAgICAgIFwiZm9udC1mZWF0dXJlLXNldHRpbmdzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1udW1lcmljXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1saWdhdHVyZXNcIixcbiAgICAgIFwiZm9udC12YXJpYW50LWNhcHNcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBsaXN0SXRlbTogc3R5bGUobGlzdEl0ZW0sIFtcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1yaWdodFwiLFxuICAgICAgXCJ0ZXh0LWluZGVudFwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgY29kZUJsb2NrOiBzdHlsZShwcmUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIGJsb2NrcXVvdGU6IHN0eWxlKHF1b3RlLCBbXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJib3JkZXItbGVmdC13aWR0aFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgXSksXG4gICAgaW5saW5lQ29kZTogc3R5bGUoaW5saW5lQ29kZSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgXCJib3JkZXItcmFkaXVzXCIsXG4gICAgXSksXG4gICAgdGFibGU6IHN0eWxlKHRhYmxlLCBbXCJmb250LXNpemVcIiwgXCJsaW5lLWhlaWdodFwiLCBcIndpZHRoXCIsIFwiYm9yZGVyLWNvbGxhcHNlXCJdKSxcbiAgICBpbWFnZTogc3R5bGUoaW1nLCBbXCJkaXNwbGF5XCIsIFwibWFyZ2luLWxlZnRcIiwgXCJtYXJnaW4tcmlnaHRcIiwgXCJtYXgtd2lkdGhcIiwgXCJ3aWR0aFwiXSksXG4gICAgaG9yaXpvbnRhbFJ1bGU6IHN0eWxlKGhyLCBbXCJtYXJnaW4tdG9wXCIsIFwibWFyZ2luLWJvdHRvbVwiLCBcImJvcmRlci10b3Atd2lkdGhcIiwgXCJoZWlnaHRcIl0pLFxuICAgIGNzc1ZhcmlhYmxlczoge1xuICAgICAgXCItLWZvbnQtdGV4dFwiOiBjc3NWYXIoXCItLWZvbnQtdGV4dFwiKSxcbiAgICAgIFwiLS1saW5lLWhlaWdodC1ub3JtYWxcIjogY3NzVmFyKFwiLS1saW5lLWhlaWdodC1ub3JtYWxcIiksXG4gICAgICBcIi0taDEtc2l6ZVwiOiBjc3NWYXIoXCItLWgxLXNpemVcIiksXG4gICAgICBcIi0taDEtbGluZS1oZWlnaHRcIjogY3NzVmFyKFwiLS1oMS1saW5lLWhlaWdodFwiKSxcbiAgICAgIFwiLS1oMS13ZWlnaHRcIjogY3NzVmFyKFwiLS1oMS13ZWlnaHRcIiksXG4gICAgICBcIi0taDEtdmFyaWFudFwiOiBjc3NWYXIoXCItLWgxLXZhcmlhbnRcIiksXG4gICAgICBcIi0taDEtY29sb3JcIjogY3NzVmFyKFwiLS1oMS1jb2xvclwiKSxcbiAgICAgIFwiLS1oMS1tYXJnaW4tdG9wXCI6IGNzc1ZhcihcIi0taDEtbWFyZ2luLXRvcFwiKSxcbiAgICAgIFwiLS1oMS1tYXJnaW4tYm90dG9tXCI6IGNzc1ZhcihcIi0taDEtbWFyZ2luLWJvdHRvbVwiKSxcbiAgICAgIFwiLS1wLXNwYWNpbmdcIjogY3NzVmFyKFwiLS1wLXNwYWNpbmdcIiksXG4gICAgICBcIi0tbGlzdC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tbGlzdC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3QtaW5kZW50XCI6IGNzc1ZhcihcIi0tbGlzdC1pbmRlbnRcIiksXG4gICAgICBcIi0tY29kZS1zaXplXCI6IGNzc1ZhcihcIi0tY29kZS1zaXplXCIpLFxuICAgICAgXCItLWNvZGUtcGFkZGluZ1wiOiBjc3NWYXIoXCItLWNvZGUtcGFkZGluZ1wiKSxcbiAgICAgIFwiLS1jb2RlLXJhZGl1c1wiOiBjc3NWYXIoXCItLWNvZGUtcmFkaXVzXCIpLFxuICAgICAgXCItLWJsb2NrcXVvdGUtcGFkZGluZ1wiOiBjc3NWYXIoXCItLWJsb2NrcXVvdGUtcGFkZGluZ1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLWJvcmRlci10aGlja25lc3NcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLWJvcmRlci10aGlja25lc3NcIiksXG4gICAgICBcIi0tZmlsZS1tYXJnaW5zXCI6IGNzc1ZhcihcIi0tZmlsZS1tYXJnaW5zXCIpLFxuICAgICAgXCItLWZpbGUtbGluZS13aWR0aFwiOiBjc3NWYXIoXCItLWZpbGUtbGluZS13aWR0aFwiKSxcbiAgICAgIFwiLS1ub3JtYWwtZm9udC1zaXplXCI6IGNzc1ZhcihcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiKSxcbiAgICAgIFwiLS1mb250LXRleHQtc2l6ZVwiOiBjc3NWYXIoXCItLWZvbnQtdGV4dC1zaXplXCIpLFxuICAgIH0sXG4gIH07XG4gIHJldHVybiBkdW1wO1xufVxuXG4vKipcbiAqIERlYnVnIHR5cG9ncmFwaHk6IHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyAoZWFjaFxuICogY292ZXJpbmcgYSBncm91cCBvZiBlbGVtZW50cyBcdTIwMTQgYWxsIHZpc2libGUgd2l0aG91dCBzY3JvbGxpbmcpLFxuICogdGhlbiB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgaW4gcmVhZGluZyB2aWV3IChubyB2aXJ0dWFsaXphdGlvblxuICogdGhlcmUpLCBtZXJnZXMgZXZlcnl0aGluZywgY29tcHV0ZXMgdGhlIGVkaXQtdnMtcmVhZGluZyBkaWZmIGFuZFxuICogd3JpdGVzIGl0IHRvIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gaW4gdGhlIHZhdWx0IHJvb3QuXG4gKiBUaGUgdXNlcidzIG93biBub3RlIGlzIHJlc3RvcmVkIGF0IHRoZSBlbmQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkdW1wVHlwb2dyYXBoeShwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBhcHAgPSBwbHVnaW4uYXBwO1xuICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IGVudGVyIFNsaWRlcyBtb2RlIGZpcnN0IChNb2QrU2hpZnQrRSBvbiBhIGRlY2sgbm90ZSlcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3KSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IG5vIGFjdGl2ZSBNYXJrZG93biBub3RlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBzdGFydE1vZGUgPSB2aWV3LmdldE1vZGUoKTtcbiAgY29uc3QgYWN0aXZlRmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICBjb25zdCBsZWFmID0gYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcblxuICAvLyBFZGl0IHNpZGU6IGVhY2ggc2hvcnQgbm90ZSBrZWVwcyBldmVyeSB0YXJnZXQgZWxlbWVudCBvbiBzY3JlZW5cbiAgY29uc3QgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFNBTVBMRV9OT1RFX05BTUVTKSB7XG4gICAgY29uc3QgZiA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoYHRlc3RzLyR7bmFtZX0ubWRgKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGYsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICAgIGF3YWl0IHNsZWVwKDUwMCk7XG4gICAgY29uc3QgcyA9IHNhbXBsZVN0eWxlcyhhcHApO1xuICAgIGlmIChzKSBtZXJnZVNhbXBsZShlZGl0LCBzKTtcbiAgfVxuXG4gIC8vIFJlYWRpbmcgc2lkZTogdGhlIGtpdGNoZW4tc2luayBub3RlIHJlbmRlcnMgZXZlcnl0aGluZyBhdCBvbmNlXG4gIGxldCByZWFkaW5nOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPSBudWxsO1xuICBjb25zdCBkZW1vID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChcInRlc3RzL3R5cG9ncmFwaHktZGVtby5tZFwiKTtcbiAgaWYgKGRlbW8gaW5zdGFuY2VvZiBURmlsZSkge1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZGVtbywgeyBzdGF0ZTogeyBtb2RlOiBcInByZXZpZXdcIiB9IH0pO1xuICAgIGF3YWl0IHNsZWVwKDgwMCk7XG4gICAgcmVhZGluZyA9IHNhbXBsZVN0eWxlcyhhcHApO1xuICB9XG5cbiAgLy8gUmVzdG9yZSB0aGUgdXNlcidzIG5vdGVcbiAgaWYgKGFjdGl2ZUZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGFjdGl2ZUZpbGUsIHsgc3RhdGU6IHsgbW9kZTogc3RhcnRNb2RlIH0gfSk7XG4gICAgcGx1Z2luLnJlZnJlc2goKTtcbiAgfVxuICBpZiAoIXJlYWRpbmcpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogcmVhZGluZyBzYW1wbGUgZmFpbGVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBheWxvYWQgPSB7IGVkaXQsIHJlYWRpbmcsIGRpZmY6IGRpZmZEdW1wcyhlZGl0LCByZWFkaW5nKSB9O1xuICB0cnkge1xuICAgIGF3YWl0IGFwcC52YXVsdC5hZGFwdGVyLndyaXRlKFwiLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvblwiLCBKU09OLnN0cmluZ2lmeShwYXlsb2FkLCBudWxsLCAyKSk7XG4gICAgbmV3IE5vdGljZShcIlR5cG9ncmFwaHkgZHVtcCBcdTIxOTIgLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiAodmF1bHQgcm9vdClcIik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IHdyaXRlIGRlYnVnIGZpbGUgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gIH1cbn1cblxuLyoqIFJlZ2lzdGVyIHRoZSBkZXYtb25seSBkZWJ1ZyBjb21tYW5kIChjYWxsZWQgb25seSB3aGVuIERFVl9NT0RFIGlzIHRydWUpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGVidWdDb21tYW5kKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1kZWJ1Zy1zdHlsZXNcIixcbiAgICBuYW1lOiBcIkRlYnVnOiBkdW1wIHR5cG9ncmFwaHkgc3R5bGVzXCIsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgZHVtcFR5cG9ncmFwaHkocGx1Z2luKSxcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBNb2RlIG9mIHRoZSBhY3RpdmUgTWFya2Rvd24gdmlldzogJ3ByZXZpZXcnPXJlYWRpbmcgJ3NvdXJjZSc9ZWRpdGluZyAnJz1ub25lICovXG5leHBvcnQgZnVuY3Rpb24gY3VycmVudE1vZGUoYXBwOiBBcHApOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgfCBcIlwiIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICByZXR1cm4gdmlldyA/IHZpZXcuZ2V0TW9kZSgpIDogXCJcIjtcbn1cblxuLyoqXG4gKiBUcnVlIHdoZW4gdGhlIGFjdGl2ZSBlZGl0IHZpZXcgaXMgTGl2ZSBQcmV2aWV3IChTbGlkZXMpIFx1MjAxNCBhc1xuICogb3Bwb3NlZCB0byBTb3VyY2UgbW9kZS4gT2JzaWRpYW4gcmVwb3J0cyBib3RoIGFzIG1vZGUgXCJzb3VyY2VcIjtcbiAqIHRoZSB2aWV3IHN0YXRlIGNhcnJpZXMgYSBgc291cmNlYCBmbGFnIChTb3VyY2UgbW9kZSA9IHRydWUpLCB3aXRoXG4gKiBhIERPTSBjbGFzcyBmYWxsYmFjayAoLmlzLWxpdmUtcHJldmlldykgZm9yIHNhZmV0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTGl2ZVByZXZpZXcoYXBwOiBBcHApOiBib29sZWFuIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcgfHwgdmlldy5nZXRNb2RlKCkgIT09IFwic291cmNlXCIpIHJldHVybiBmYWxzZTtcbiAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBzb3VyY2U/OiBib29sZWFuIH07XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IHRydWUpIHJldHVybiBmYWxzZTtcbiAgaWYgKHN0YXRlLnNvdXJjZSA9PT0gZmFsc2UpIHJldHVybiB0cnVlO1xuICByZXR1cm4gISF2aWV3LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYuaXMtbGl2ZS1wcmV2aWV3XCIpO1xufVxuXG4vKiogRnJvbnRtYXR0ZXIgb2YgYW55IG5vdGUgYXMgYW4gb2JqZWN0LCBvciBudWxsIHdoZW4gYWJzZW50ICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbnRtYXR0ZXJPZihhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgcmV0dXJuIGNhY2hlPy5mcm9udG1hdHRlciA/PyBudWxsO1xufVxuXG4vKiogQ3VycmVudCBub3RlJ3MgZnJvbnRtYXR0ZXIgYXMgYW4gb2JqZWN0LCBvciBudWxsIHdoZW4gYWJzZW50ICovXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZlRnJvbnRtYXR0ZXIoYXBwOiBBcHApOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCBmaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIHJldHVybiBmaWxlID8gZnJvbnRtYXR0ZXJPZihhcHAsIGZpbGUpIDogbnVsbDtcbn1cbiIsICIvKiogQSBidWlsdC1pbiBTbGlkZXMgc3R5bGUgdGVtcGxhdGUgKHJlbmRlcmVkIGFzIGJvZHkgY2xhc3MgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmApICovXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlc1RoZW1lIHtcbiAgaWQ6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuLyoqIEJ1aWx0LWluIHN0eWxlIHRlbXBsYXRlcyBmb3IgdGhlIFNsaWRlcyBjYXJkICsgYmFyIChhbGwgdGhlbWUtYWRhcHRpdmUpICovXG5leHBvcnQgY29uc3QgU0xJREVTX1RIRU1FUzogcmVhZG9ubHkgU2xpZGVzVGhlbWVbXSA9IFtcbiAgeyBpZDogXCJqeXlcIiwgbGFiZWw6IFwiTGVjdHVyZSAoanl5KVwiIH0sXG4gIHsgaWQ6IFwiZGFzaGVkXCIsIGxhYmVsOiBcIkRhc2hlZCBvdXRsaW5lXCIgfSxcbiAgeyBpZDogXCJwYXBlclwiLCBsYWJlbDogXCJQYXBlciBjYXJkXCIgfSxcbiAgeyBpZDogXCJtaW5pbWFsXCIsIGxhYmVsOiBcIk1pbmltYWxcIiB9LFxuICB7IGlkOiBcImFjY2VudFwiLCBsYWJlbDogXCJBY2NlbnQgZWRnZVwiIH0sXG4gIHsgaWQ6IFwiZ2xhc3NcIiwgbGFiZWw6IFwiRnJvc3RlZCBnbGFzc1wiIH0sXG5dO1xuXG4vKiogUGx1Z2luIHNldHRpbmdzICovXG5leHBvcnQgaW50ZXJmYWNlIE5hdGl2ZVNsaWRlc1NldHRpbmdzIHtcbiAgLyoqIFNob3cgXHUyNUMwIFx1MjVCNiBwcmV2aW91cy9uZXh0IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd05hdkJ1dHRvbnM6IGJvb2xlYW47XG4gIC8qKiBQYWdlIG51bWJlciBkaXNwbGF5IHN0eWxlOiBcImZyYWN0aW9uXCIgPSBOIC8gVG90YWwsIFwiY3VycmVudFwiID0gTiwgXCJub25lXCIgPSBoaWRkZW4gKi9cbiAgcGFnZU51bWJlclN0eWxlOiBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAvKiogU2hvdyBhIHRoaW4gY2xpY2thYmxlIHByb2dyZXNzIGxpbmUgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAqL1xuICBzaG93UHJvZ3Jlc3M6IGJvb2xlYW47XG4gIC8qKiBTaG93IHRoZSBlbnRpcmUgc2xpZGVzIGJhciAobWFzdGVyIHRvZ2dsZSkgKi9cbiAgc2hvd1NsaWRlc0JhcjogYm9vbGVhbjtcbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgbWFudWFsbHkgaGlkIHRoZSBzbGlkZXMgYmFyICh0b2dnbGUgY29tbWFuZCkgKi9cbiAgYmFySGlkZGVuOiBib29sZWFuO1xuICAvKiogQXV0by1lbnRlciBTbGlkZXMgbW9kZSB3aGVuIG9wZW5pbmcgYSBkZWNrIG5vdGUgKGRlZmF1bHQgb2ZmKSAqL1xuICBhdXRvRW50ZXJTbGlkZXM6IGJvb2xlYW47XG4gIC8qKiBQcmVzcyBFc2NhcGUgdG8gZXhpdCBTbGlkZXMgbW9kZSAoZGVmYXVsdCBvbikgKi9cbiAgZXNjRXhpdHNTbGlkZXM6IGJvb2xlYW47XG4gIC8qKiBGcm9udG1hdHRlciBwcm9wZXJ0eSBzaG93biBhcyB0aGUgY2FyZCB0aXRsZSAoXCJcIiA9IG5vbmUsIFwiZmlsZW5hbWVcIiA9IGZpbGUgbmFtZSkgKi9cbiAgc2xpZGVzVGl0bGU6IHN0cmluZztcbiAgLyoqIFN0eWxlIHRlbXBsYXRlIGlkIGZyb20gU0xJREVTX1RIRU1FUyAoY2FyZCArIGJhciBhcHBlYXJhbmNlKSAqL1xuICBzbGlkZXNUaGVtZTogc3RyaW5nO1xuICAvKiogQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIGZvciB0aGUgc2xpZGVzIGJhciAoZW1wdHkgPSBub25lKSAqL1xuICBiYXJQcm9wZXJ0aWVzOiBzdHJpbmc7XG4gIC8qKiBKU09OIGFycmF5IG9mIGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgYmFyIHByb3BlcnRpZXMgKGRyYWdnYWJsZSBkaXZpZGVycykgKi9cbiAgYmFyUHJvcGVydHlXaWR0aHM6IHN0cmluZztcbiAgLyoqIEFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgcGFuZWwgKGRlZmF1bHQgb24pICovXG4gIGNvbmZpcm1EZWxldGVTbGlkZXM6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBCbG9jayBpbWFnZSBlbWJlZHMgYXMgY2VudGVyZWQgY2FyZCBibG9ja3MgKGRlZmF1bHQgb24pLiBXaGVuIG9mZixcbiAgICogaW1hZ2VzIGtlZXAgT2JzaWRpYW4ncyBuYXRpdmUgaW5saW5lIGZsb3cgXHUyMDE0IHRleHQgZmxvd3MgYXJvdW5kL2Jlc2lkZVxuICAgKiB0aGVtIGV4YWN0bHkgbGlrZSBMaXZlIFByZXZpZXcgb3V0c2lkZSBTbGlkZXMgbW9kZS5cbiAgICovXG4gIGltYWdlTGF5b3V0OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7XG4gIHNob3dOYXZCdXR0b25zOiB0cnVlLFxuICBwYWdlTnVtYmVyU3R5bGU6IFwibm9uZVwiLFxuICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gIHNob3dTbGlkZXNCYXI6IHRydWUsXG4gIGJhckhpZGRlbjogZmFsc2UsXG4gIGF1dG9FbnRlclNsaWRlczogZmFsc2UsXG4gIGVzY0V4aXRzU2xpZGVzOiB0cnVlLFxuICBzbGlkZXNUaXRsZTogXCJcIixcbiAgc2xpZGVzVGhlbWU6IFwianl5XCIsXG4gIGJhclByb3BlcnRpZXM6IFwiXCIsXG4gIGJhclByb3BlcnR5V2lkdGhzOiBcIlwiLFxuICBjb25maXJtRGVsZXRlU2xpZGVzOiB0cnVlLFxuICBpbWFnZUxheW91dDogdHJ1ZSxcbn07XG5cbi8qKiBSZXNlcnZlZCBmcm9udG1hdHRlciBrZXkgZHJpdmluZyBkZWNrIG5hdmlnYXRpb24gKG5ldmVyIHJlbmRlcmVkIGFzIGEgY2hpcCkgKi9cbmV4cG9ydCBjb25zdCBERUNLX0tFWSA9IFwiZGVja1wiO1xuIiwgImltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQgfSBmcm9tIFwiLi9kZWJ1Z1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB7IERFQ0tfS0VZIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqIFJlZ2lzdGVyIGV2ZXJ5IGNvbW1hbmQ7IHRoZSBkZWJ1ZyBjb21tYW5kIGlzIGRldi1idWlsZCBvbmx5LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ29tbWFuZHMocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiB2b2lkIHtcbiAgLy8gVG9nZ2xlIHRoZSBzbGlkZXMgYmFyICh3aXRoaW4gU2xpZGVzIG1vZGUpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtYmFyXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIGJhclwiLFxuICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICBwbHVnaW4uc2V0dGluZ3MuYmFySGlkZGVuID0gIXBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW47XG4gICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICBwbHVnaW4ucmVmcmVzaCgpO1xuICAgIH0sXG4gIH0pO1xuICAvLyBTaG93IHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtc2hvdy1wYW5lbFwiLFxuICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgcGFuZWxcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uYWN0aXZhdGVTbGlkZXNQYW5lbCgpLFxuICB9KTtcbiAgLy8gSGlkZSAvIHNob3cgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgKHByZXNlbnRpbmc7IFNsaWRlcyBtb2RlIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtcG9pbnRlclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIG1vdXNlIHBvaW50ZXJcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVBvaW50ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBQcmV2aW91cyAvIG5leHQgcGFnZSAoZGVjayBuYXZpZ2F0aW9uOyBlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1wcmV2XCIsXG4gICAgbmFtZTogXCJQcmV2aW91cyBwYWdlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkFycm93TGVmdFwiIH1dLFxuICAgIGNhbGxiYWNrOiAoKSA9PiBwbHVnaW4ubmF2aWdhdGUoXCJwcmV2XCIpLFxuICB9KTtcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLW5leHRcIixcbiAgICBuYW1lOiBcIk5leHQgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd1JpZ2h0XCIgfV0sXG4gICAgY2FsbGJhY2s6ICgpID0+IHBsdWdpbi5uYXZpZ2F0ZShcIm5leHRcIiksXG4gIH0pO1xuICAvLyBDcmVhdGUgTmV4dCBTbGlkZSBcdTIwMTQgbmV3IHNsaWRlIGFmdGVyIHRoZSBjdXJyZW50IG9uZSAoZGVjayBub3RlcyBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5leHRcIixcbiAgICBuYW1lOiBcIkNyZWF0ZSBuZXh0IHNsaWRlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIk5cIiB9XSxcbiAgICAvLyBHcmV5ZWQgb3V0IHVubGVzcyB0aGUgYWN0aXZlIG5vdGUgaXMgcGFydCBvZiBhIGRlY2sgXHUyMDE0IHBsYWluIG5vdGVzXG4gICAgLy8gc3RhcnQgZGVja3Mgd2l0aCBcIkNyZWF0ZSBuZXcgc2xpZGVcIiBpbnN0ZWFkLlxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSB8fCAhcGx1Z2luLmRlY2tTZXJ2aWNlLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBwbGFuID0gcGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXh0KGZpbGUpO1xuICAgICAgaWYgKCFwbGFuKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB2b2lkIHBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlQ3JlYXRlTmV4dChmaWxlLCBwbGFuKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBDcmVhdGUgTmV3IFNsaWRlIFx1MjAxNCBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZSAobm9uLWRlY2sgbm90ZXMgb25seTtcbiAgLy8gYWxzbyB3b3JrcyBmcm9tIGEgYmxhbmsgdGFiIFx1MjAxNCBsYW5kcyBpbiB0aGUgZGVmYXVsdCBuZXctbm90ZSBsb2NhdGlvbilcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXdcIixcbiAgICBuYW1lOiBcIkNyZWF0ZSBuZXcgc2xpZGVcIixcbiAgICAvLyBObyBkZWZhdWx0IGhvdGtleTogTW9kK1NoaWZ0K04gYmVsb25ncyB0byBDcmVhdGUgbmV4dCBzbGlkZSBcdTIwMTQgdHdvXG4gICAgLy8gY29tbWFuZHMgc2hhcmluZyBvbmUgZGVmYXVsdCBob3RrZXkgdHJpcHMgT2JzaWRpYW4ncyBjb25mbGljdCBVSS5cbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5ldyhwbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5ldygpKSxcbiAgfSk7XG4gIC8vIFRvZ2dsZSBTbGlkZXMgbW9kZSBcdTIwMTQgdGhlIGltbWVyc2l2ZSBjYXJkIHZpZXcgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1zbGlkZXNcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgbW9kZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJFXCIgfV0sXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YocGx1Z2luLmFwcCwgZmlsZSk7XG4gICAgICBpZiAoZm0gPT09IG51bGwgfHwgIShERUNLX0tFWSBpbiBmbSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVTbGlkZXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBEZWJ1ZyB0b29saW5nIFx1MjAxNCByZWdpc3RlcmVkIG9ubHkgaW4gZGV2IGJ1aWxkcyAodHJlZS1zaGFrZW4gaW4gcmVsZWFzZSlcbiAgaWYgKERFVl9NT0RFKSByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW4pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtcbiAgcGxhbkNyZWF0ZU5ldyBhcyBwbGFuTmV3LFxuICBwbGFuQ3JlYXRlTmV4dCBhcyBwbGFuLFxuICB0eXBlIENyZWF0ZU5leHRSZXN1bHQsXG59IGZyb20gXCIuL2NyZWF0ZU5leHRcIjtcbmltcG9ydCB7IGNvbXB1dGVEZWNrLCBleHRyYWN0TGlua3MsIGV4dHJhY3RSYXdMaW5rcywgdHlwZSBEZWNrSW5mbyB9IGZyb20gXCIuL2RlY2tcIjtcbmltcG9ydCB7IHBpY2tMYW5kaW5nUGF0aCwgcGxhbkRlbGV0ZVNsaWRlcyB9IGZyb20gXCIuL2RlbGV0ZVNsaWRlc1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB7IERFQ0tfS0VZIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqIFJlc3VsdCBvZiBhIERlbGV0ZSBzbGlkZXMgcnVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVNsaWRlc1Jlc3VsdCB7XG4gIC8qKiBQYXRocyBhY3R1YWxseSBtb3ZlZCB0byB0aGUgdHJhc2ggKi9cbiAgdHJhc2hlZDogc3RyaW5nW107XG4gIC8qKiBXaGVyZSB0aGUgZWRpdG9yIHNob3VsZCBsYW5kIGFmdGVyd2FyZHMgKG51bGwgPSBrZWVwIGN1cnJlbnQgbm90ZSkgKi9cbiAgbGFuZGluZ1BhdGg6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKiBEZWNrIGNoYWluIHJlc29sdXRpb24gKyBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgZ2x1ZSAod3JhcHMgdGhlIHB1cmUgY29yZSkuICovXG5leHBvcnQgY2xhc3MgRGVja1NlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwKSB7fVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrOiBpdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlblxuICAgKiBlbXB0eSBcdTIwMTQgYSBmcmVzaCBzaW5nbGUgc2xpZGUpIG9yIHNvbWUgb3RoZXIgc2xpZGUgZGVjbGFyZXMgaXQgYXMgaXRzXG4gICAqIG5leHQgc2xpZGUuXG4gICAqL1xuICBpc01lbWJlcihmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIChmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbSkgfHwgdGhpcy5wcmV2T2YoZmlsZS5wYXRoKSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIFJlc29sdmUgdGhlIGN1cnJlbnQgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjayAobnVsbCB3aGVuIG5vdCBhIG1lbWJlcikgKi9cbiAgY29tcHV0ZShmaWxlOiBURmlsZSk6IERlY2tJbmZvIHwgbnVsbCB7XG4gICAgaWYgKCF0aGlzLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gY29tcHV0ZURlY2soXG4gICAgICBmaWxlLnBhdGgsXG4gICAgICAocGF0aCkgPT4gdGhpcy5saW5rUGF0aHMocGF0aCksXG4gICAgICAocGF0aCkgPT4gdGhpcy5wcmV2T2YocGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgYSBub3RlIGludG8gcmVhbCBub3RlIHBhdGhzIChtYXggb25lKSAqL1xuICBwcml2YXRlIGxpbmtQYXRocyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gW107XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXNcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KTogeCBpcyBURmlsZSA9PiAhIXgpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh0aGUgcHJldmlvdXMgc2xpZGUgaW5cbiAgICogdGhlIGNoYWluKS4gV2l0aCBuZXh0LW9ubHkgc2VtYW50aWNzIHRoaXMgYmFja3dhcmQgbG9va3VwIGlzIHRoZSBvbmx5XG4gICAqIHdheSB0byByZWFjaCB0aGUgY2hhaW4gaGVhZCBmcm9tIGEgbWlkZGxlL2xhc3Qgc2xpZGUuXG4gICAqL1xuICBwcml2YXRlIHByZXZPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLnBhdGggPT09IHBhdGgpIGNvbnRpbnVlO1xuICAgICAgaWYgKHRoaXMubGlua1BhdGhzKGYucGF0aClbMF0gPT09IHBhdGgpIHJldHVybiBmLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogTmFtZXMgaW4gdGhlIGBkZWNrYCBwcm9wZXJ0eSB0aGF0IHJlc29sdmUgdG8gbm8gbm90ZSAoYnJva2VuIGxpbmtzKSAqL1xuICBicm9rZW4oZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBmaWxlLnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIHJ1biBmb3IgdGhlIGFjdGl2ZSBub3RlLiBEZWNrIHNsaWRlc1xuICAgKiBpbnNlcnQvYXBwZW5kIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuIChQbGFpbiBub3RlcyBhcmUgcm91dGVkIHRvXG4gICAqIHBsYW5DcmVhdGVOZXcgYnkgdGhlIGNvbW1hbmQgXHUyMDE0IHRoaXMgY29yZSBzdGlsbCBoYW5kbGVzIHRoZW0gYXNcbiAgICogXCJubyB1c2FibGUgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmRcIi4pXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV4dChmaWxlOiBURmlsZSk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IHJhdyA9IGZtID8gZXh0cmFjdFJhd0xpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICBjb25zdCBleGlzdGluZ05hbWVzID0gbmV3IFNldCh0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkubWFwKChmKSA9PiBmLmJhc2VuYW1lKSk7XG4gICAgcmV0dXJuIHBsYW4oeyBjdXJyZW50TmFtZTogZmlsZS5iYXNlbmFtZSwgY3VycmVudExpbmtzOiByYXcsIGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHJ1bjogYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgaW4gdGhlXG4gICAqIHNhbWUgZm9sZGVyIGFzIHRoZSBhY3RpdmUgbm90ZSwgd2hpY2ggaXRzZWxmIHN0YXlzIHVudG91Y2hlZC5cbiAgICovXG4gIHBsYW5DcmVhdGVOZXcoKTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuTmV3KHsgZXhpc3RpbmdOYW1lcyB9KTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIENyZWF0ZSBOZXh0IFNsaWRlIHBsYW47IG9wZW49ZmFsc2Uga2VlcHMgdGhlIGN1cnJlbnQgbm90ZSBpbiB0aGUgZWRpdG9yICovXG4gIGFzeW5jIGV4ZWN1dGVDcmVhdGVOZXh0KGZpbGU6IFRGaWxlLCBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LCBvcGVuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKGZpbGUsIHBsYW4sIGRpclByZWZpeChmaWxlLnBhcmVudD8ucGF0aCksIG9wZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgQ3JlYXRlIE5ldyBTbGlkZSBwbGFuLiBMYW5kcyBpbiBPYnNpZGlhbidzIGRlZmF1bHQgbmV3LW5vdGVcbiAgICogbG9jYXRpb24gKFNldHRpbmdzIFx1MjE5MiBGaWxlcyAmIGxpbmtzIFx1MjE5MiBEZWZhdWx0IGxvY2F0aW9uIGZvciBuZXcgbm90ZXMpO1xuICAgKiB3aXRoIFwic2FtZSBmb2xkZXIgYXMgY3VycmVudFwiIGNvbmZpZ3VyZWQgdGhhdCBpcyB0aGUgYWN0aXZlIG5vdGUncyBvd25cbiAgICogZm9sZGVyLiBXb3JrcyB3aXRoIG5vIG5vdGUgb3BlbiBhdCBhbGwgKGJsYW5rIHRhYikuXG4gICAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV3KHBsYW46IENyZWF0ZU5leHRSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBcIlwiO1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKFxuICAgICAgbnVsbCxcbiAgICAgIHBsYW4sXG4gICAgICBkaXJQcmVmaXgodGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChzb3VyY2VQYXRoKT8ucGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIHBsYW46IGNyZWF0ZSB0aGUgbm90ZSwgcmV3aXJlIGBkZWNrYCBwcm9wZXJ0aWVzLCBvcHRpb25hbGx5IG9wZW4gaXQgKi9cbiAgcHJpdmF0ZSBhc3luYyBhcHBseVBsYW4oXG4gICAgZmlsZTogVEZpbGUgfCBudWxsLFxuICAgIHBsYW46IENyZWF0ZU5leHRSZXN1bHQsXG4gICAgZGlyOiBzdHJpbmcsXG4gICAgb3BlbiA9IHRydWUsXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG5ld1BhdGggPSBgJHtkaXJ9JHtwbGFuLm5ld05hbWV9Lm1kYDtcbiAgICBjb25zdCBmcm9udG1hdHRlciA9IHBsYW4ubmV3RGVja0xpbmtzLm1hcCgobGluaykgPT4gSlNPTi5zdHJpbmdpZnkobGluaykpLmpvaW4oXCIsIFwiKTtcbiAgICBjb25zdCBjb250ZW50ID0gYC0tLVxcbmRlY2s6IFske2Zyb250bWF0dGVyfV1cXG4tLS1cXG5gO1xuXG4gICAgbGV0IG5ld0ZpbGU6IFRGaWxlO1xuICAgIHRyeSB7XG4gICAgICBuZXdGaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKG5ld1BhdGgsIGNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgY3JlYXRlIFwiJHtwbGFuLm5ld05hbWV9Lm1kXCIgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmV3aXJlIHRoZSBjdXJyZW50IG5vdGUncyBgZGVja2AgKGtlZXBzIGFsbCBvdGhlciBwcm9wZXJ0aWVzIGludGFjdClcbiAgICBmb3IgKGNvbnN0IHJld3JpdGUgb2YgcGxhbi5yZXdyaXRlcykge1xuICAgICAgaWYgKCFmaWxlIHx8IHJld3JpdGUubmFtZSAhPT0gZmlsZS5iYXNlbmFtZSkgY29udGludWU7IC8vIGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlXG4gICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZmlsZSwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSByZXdyaXRlLmRlY2s7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIW9wZW4pIHJldHVybjtcblxuICAgIC8vIE9wZW4gdGhlIG5ldyBub3RlIGluIHRoZSBjdXJyZW50IHBhbmUsIGVkaXQgbW9kZSAoTGl2ZSBQcmV2aWV3KVxuICAgIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShuZXdGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgc2xpZGVzIG91dCBvZiBhbiBvcmRlcmVkIGRlY2sgY2hhaW46IHNwbGljZSB0aGUgY2hhaW4gYXJvdW5kXG4gICAqIGV2ZXJ5IGRlbGV0ZWQgcnVuICh0aGUgcHJlZGVjZXNzb3IncyBgZGVja2AgdGFrZXMgb3ZlciB0aGUgcnVuJ3MgZmlyc3RcbiAgICogc3Vydml2b3IpLCB0aGVuIG1vdmUgZWFjaCBkZWxldGVkIG5vdGUgdG8gdGhlIHRyYXNoLiBgZm9jdXNQYXRoYCBpcyB0aGVcbiAgICogbm90ZSB0aGUgZWRpdG9yIGN1cnJlbnRseSBzaG93cyBcdTIwMTQgd2hlbiBpdCBpcyBhbW9uZyB0aGUgZGVsZXRlZCwgdGhlXG4gICAqIHJlc3VsdCBuYW1lcyB0aGUgbmVhcmVzdCBzdXJ2aXZpbmcgbmVpZ2hib3VyIHRvIG9wZW4gaW5zdGVhZC5cbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVEZWxldGVTbGlkZXMoXG4gICAgY2hhaW46IHN0cmluZ1tdLFxuICAgIGRlbGV0ZVBhdGhzOiBSZWFkb25seVNldDxzdHJpbmc+LFxuICAgIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbiAgKTogUHJvbWlzZTxEZWxldGVTbGlkZXNSZXN1bHQ+IHtcbiAgICBjb25zdCByZXdyaXRlcyA9IHBsYW5EZWxldGVTbGlkZXMoY2hhaW4sIGRlbGV0ZVBhdGhzKTtcblxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiByZXdyaXRlcykge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLnBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICBjb25zdCBuZXh0ID0gcmV3cml0ZS5uZXh0UGF0aCA/IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLm5leHRQYXRoKSA6IG51bGw7XG4gICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZiwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSBuZXh0IGluc3RhbmNlb2YgVEZpbGUgPyBbYFtbJHtuZXh0LmJhc2VuYW1lfV1dYF0gOiBbXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYXNoZWQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIGRlbGV0ZVBhdGhzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci50cmFzaEZpbGUoZik7XG4gICAgICAgIHRyYXNoZWQucHVzaChwYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBkZWxldGUgXCIke2YuYmFzZW5hbWV9XCIgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdHJhc2hlZCwgbGFuZGluZ1BhdGg6IHBpY2tMYW5kaW5nUGF0aChjaGFpbiwgZGVsZXRlUGF0aHMsIGZvY3VzUGF0aCkgfTtcbiAgfVxufVxuXG4vKiogRm9sZGVyIHBhdGggXHUyMTkyIHRyYWlsaW5nLXNsYXNoIHByZWZpeCAoXCJcIiBmb3IgdmF1bHQgcm9vdCkgKi9cbmZ1bmN0aW9uIGRpclByZWZpeChwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIXBhdGggfHwgcGF0aCA9PT0gXCIvXCIpIHJldHVybiBcIlwiO1xuICByZXR1cm4gYCR7cGF0aC5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpfS9gO1xufVxuIiwgIi8qKlxuICogZGVjay50cyBcdTIwMTQgUHVyZSBkZWNrLXJlc29sdXRpb24gY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvZGVjay50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHMgdGhlXG4gKiB2YXVsdCAobWV0YWRhdGFDYWNoZSkgdG8gdGhpcyBwdXJlIGludGVyZmFjZTogaXQgcmVzb2x2ZXMgYGRlY2tgXG4gKiBwcm9wZXJ0aWVzIHRvIG5vdGUgcGF0aHMsIHRoZW4gaGFuZHMgdGhlIHBhdGggZ3JhcGggdG8gY29tcHV0ZURlY2soKS5cbiAqL1xuXG4vKiogQSBkZWNrIGxpbmsgbGlzdCBob2xkcyBhdCBtb3N0IG9uZSBlbnRyeSAodGhlIG5leHQgc2xpZGUpICovXG5leHBvcnQgY29uc3QgTUFYX0RFQ0tfTElOS1MgPSAxO1xuXG4vKiogUmVzdWx0IG9mIHJlc29sdmluZyBhIG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgYSBkZWNrICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tJbmZvIHtcbiAgLyoqIENoYWluIG9mIG5vdGUgcGF0aHM6IFswXSBpcyB0aGUgZmlyc3Qgc2xpZGUsIHRoZW4gdGhlIHJlc3QgaW4gb3JkZXIgKi9cbiAgY2hhaW46IHN0cmluZ1tdO1xuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnQgbm90ZSBpbnNpZGUgY2hhaW4gKi9cbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjay5cbiAqXG4gKiB2MS4wLjAgY29udmVudGlvbiBcdTIwMTQgbmV4dC1vbmx5LCBubyBvdmVydmlldyBwYWdlOlxuICogICAtIGEgc2xpZGUncyBgZGVja2AgcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluazogdGhlIG5leHQgc2xpZGVcbiAqICAgICAodGhlIGxhc3Qgc2xpZGUgaGFzIG5vIGxpbmsgYXQgYWxsKTtcbiAqICAgLSBhIGRlY2sgaXMgc2ltcGx5IGEgZm9yd2FyZCBsaW5rIGNoYWluIHN0YXJ0aW5nIGF0IGl0cyBoZWFkIHNsaWRlO1xuICogICAtIGFueSBub3RlIHRoYXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW4gZW1wdHkpIGlzIGEgZGVjayBtZW1iZXIsXG4gKiAgICAgc28gYSBzaW5nbGUgZnJlc2hseSBjcmVhdGVkIHNsaWRlIGFscmVhZHkgY291bnRzIGFzIGEgb25lLXBhZ2UgZGVjay5cbiAqXG4gKiBCZWNhdXNlIHNsaWRlcyBubyBsb25nZXIgbGluayBiYWNrIHRvIGEgaGVhZCBub3RlLCB0aGUgY2hhaW4gaGVhZCBpc1xuICogbG9jYXRlZCBieSB3YWxraW5nIGJhY2t3YXJkOiBgZ2V0UHJldihwYXRoKWAgcmV0dXJucyB0aGUgbm90ZSB3aG9zZVxuICogYGRlY2tgIHByb3BlcnR5IHBvaW50cyBhdCBgcGF0aGAgKHVuZGVmaW5lZCB3aGVuIG5vbmUpLlxuICpcbiAqIGBnZXRMaW5rcyhwYXRoKWAgbXVzdCByZXR1cm4gdGhlIHJlc29sdmVkIG5vdGUgcGF0aHMgb2YgdGhlIGBkZWNrYFxuICogcHJvcGVydHkgb2YgdGhlIG5vdGUgYXQgYHBhdGhgIChlbXB0eSB3aGVuIHRoZSBub3RlIGhhcyBub25lLCBvciBpdHNcbiAqIGxpbmsgaXMgYnJva2VuIFx1MjAxNCBhIGJyb2tlbiBsaW5rIHNpbXBseSBlbmRzIHRoZSBjaGFpbiwgbmV2ZXIgY3Jhc2hlcykuXG4gKlxuICogUmV0dXJucyB0aGUgZnVsbCBjaGFpbiBhbmQgdGhlIGN1cnJlbnQgbm90ZSdzIGluZGV4LCBvciBudWxsIHdoZW4gdGhlXG4gKiBub3RlIGlzIG5vdCBwYXJ0IG9mIGFueSBkZWNrIChubyBgZGVja2AgcHJvcGVydHkgYW5kIG5vYm9keSBsaW5rcyB0byBpdCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlRGVjayhcbiAgY3VycmVudFBhdGg6IHN0cmluZyxcbiAgZ2V0TGlua3M6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZ1tdLFxuICBnZXRQcmV2OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmcgfCB1bmRlZmluZWQsXG4pOiBEZWNrSW5mbyB8IG51bGwge1xuICAvLyBXYWxrIGJhY2t3YXJkIHRvIHRoZSBjaGFpbiBoZWFkIChjeWNsZS1ndWFyZGVkKS4gQSBsb25lIG5vZGUgKG5vIG93blxuICAvLyBsaW5rLCBubyBwcmVkZWNlc3NvcikgcmVzb2x2ZXMgYXMgYSBvbmUtcGFnZSBjaGFpbiBcdTIwMTQgd2hldGhlciBpdCBjb3VudHNcbiAgLy8gYXMgYSBkZWNrIG1lbWJlciBhdCBhbGwgaXMgZGVjaWRlZCBieSB0aGUgYWRhcHRlciAodGhlIGBkZWNrYCBrZXkpLlxuICBjb25zdCBiYWNrVmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPihbY3VycmVudFBhdGhdKTtcbiAgbGV0IGhlYWQgPSBjdXJyZW50UGF0aDtcbiAgZm9yICg7Oykge1xuICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2KGhlYWQpO1xuICAgIGlmICghcHJldiB8fCBiYWNrVmlzaXRlZC5oYXMocHJldikpIGJyZWFrO1xuICAgIGJhY2tWaXNpdGVkLmFkZChwcmV2KTtcbiAgICBoZWFkID0gcHJldjtcbiAgfVxuXG4gIC8vIFdhbGsgZm9yd2FyZCBmcm9tIHRoZSBoZWFkIChjeWNsZS1ndWFyZGVkKS5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgbGV0IGN1cjogc3RyaW5nIHwgdW5kZWZpbmVkID0gaGVhZDtcbiAgd2hpbGUgKGN1ciAmJiAhdmlzaXRlZC5oYXMoY3VyKSkge1xuICAgIHZpc2l0ZWQuYWRkKGN1cik7XG4gICAgY2hhaW4ucHVzaChjdXIpO1xuICAgIGN1ciA9IGdldExpbmtzKGN1cilbMF07XG4gIH1cblxuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoY3VycmVudFBhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgY2hhaW4sIGluZGV4IH07XG59XG5cbi8qKlxuICogRXh0cmFjdCB1cCB0byBgbWF4YCBub3RlIG5hbWVzIGZyb20gYSBgZGVja2AgcHJvcGVydHkgdmFsdWUuXG4gKiBBY2NlcHRzIGEgc2luZ2xlIHN0cmluZyBvciBhIFlBTUwgbGlzdCBvZiBzdHJpbmdzOyB1bnF1b3RlZCBbW3hdXSB2YWx1ZXNcbiAqIGFyZSBwYXJzZWQgYnkgWUFNTCBhcyBuZXN0ZWQgYXJyYXlzIGFuZCBmbGF0dGVuZWQgaGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGNvbnN0IG5hbWUgPSBleHRyYWN0TGlua1RleHQoaXRlbSk7XG4gICAgaWYgKG5hbWUpIG91dC5wdXNoKG5hbWUpO1xuICAgIGlmIChvdXQubGVuZ3RoID49IG1heCkgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIHJhdyBsaW5rIHN0cmluZ3MgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZSBcdTIwMTQgdGhlXG4gKiB0cmltbWVkIHZhbHVlcyBleGFjdGx5IGFzIHdyaXR0ZW4gKGFsaWFzIC8gcGF0aCBmb3JtcyBwcmVzZXJ2ZWQpLiBTYW1lXG4gKiBmbGF0dGVuaW5nIHJ1bGVzIGFzIGV4dHJhY3RMaW5rcygpLCBidXQgd2l0aG91dCBleHRyYWN0aW5nIHRoZSB0YXJnZXQgbmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RSYXdMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gXCJzdHJpbmdcIikgY29udGludWU7XG4gICAgY29uc3QgdHJpbW1lZCA9IGl0ZW0udHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgY29udGludWU7XG4gICAgb3V0LnB1c2godHJpbW1lZCk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdGhlIHRhcmdldCBub3RlIG5hbWUgZnJvbSBhIG1hcmtkb3duIGxpbmsgc3RyaW5nLlxuICogSGFuZGxlcyBzZXZlcmFsIHNoYXBlczpcbiAqICAgXCJbW3NsaWRlLTJdXVwiICAgICAgICBcdTIxOTIgc2xpZGUtMlxuICogICBcIltbc2xpZGUtMnxhbGlhc11dXCIgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yI3NlY3Rpb25dXVwiXHUyMTkyIHNsaWRlLTJcbiAqICAgc2xpZGUtMiAgICAgICAgICAgICAgXHUyMTkyIHNsaWRlLTIgKGJhcmUgZmlsZW5hbWUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0TGlua1RleHQodmFsdWU6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKCk7XG4gIGlmICghdHJpbW1lZCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB0cmltbWVkLnJlcGxhY2UoL15cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnNwbGl0KFwiI1wiKVswXS50cmltKCk7XG59XG5cbi8qKiBSZW5kZXIgYSBwcm9wZXJ0eSB2YWx1ZSBhcyByZWFkYWJsZSB0ZXh0OiBhcnJheXMvb2JqZWN0cyBcdTIxOTIgSlNPTiwgZWxzZSBTdHJpbmcgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcdTIwMTRcIjtcbiAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKSA/PyBcIlx1MjAxNFwiO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGNpcmN1bGFyIC8gdW4tc3RyaW5naWZpYWJsZSBzdHJ1Y3R1cmUgXHUyMDE0IG5vdCBleHBlY3RlZCBmcm9tIGZyb250bWF0dGVyXG4gICAgICAgIHJldHVybiBcIlx1MjAxNFwiO1xuICAgICAgfVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBzeW1ib2wgLyBmdW5jdGlvbiBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGNyZWF0ZU5leHQudHMgXHUyMDE0IFB1cmUgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIC8gXCJDcmVhdGUgTmV3IFNsaWRlXCIgcGxhbm5pbmdcbiAqIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRXZlcnl0aGluZyBpbiB0aGlzIG1vZHVsZSBpcyBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0XG4gKiBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L2NyZWF0ZU5leHQudGVzdC50cykuIG1haW4udHMgYWRhcHRzXG4gKiB0aGUgdmF1bHQgKG1ldGFkYXRhQ2FjaGUsIGNvbXB1dGVEZWNrKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlIGFuZCBhcHBsaWVzXG4gKiB0aGUgcmVzdWx0aW5nIHBsYW4gd2l0aCB2YXVsdC5jcmVhdGUoKSArIGZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcigpLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6IGEgc2xpZGUncyBgZGVja2BcbiAqIHByb3BlcnR5IGhvbGRzIGF0IG1vc3QgT05FIGxpbmsgKGl0cyBuZXh0IHNsaWRlKS4gcGxhbkNyZWF0ZU5leHQgZGVjaWRlcyxcbiAqIGZvciB0aGUgY3VycmVudCBkZWNrIG5vdGU6XG4gKiAgIC0gdGhlIG5hbWUgb2YgdGhlIG5ldyBzbGlkZSBmaWxlIChjb2xsaXNpb24tYXdhcmUpLFxuICogICAtIHRoZSByYXcgYGRlY2tgIGxpbmsgdGV4dHMgb2YgdGhlIG5ldyBub3RlLFxuICogICAtIHRoZSByZXdyaXRlcyBuZWVkZWQgb24gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGVcbiAqICAgICBjdXJyZW50IG5vdGUpLlxuICogcGxhbkNyZWF0ZU5ldyBwbGFucyBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZSAoYSBmcmVzaCBub3RlIHRoYXQgaXNcbiAqIG5vdCBwYXJ0IG9mIGFueSBkZWNrIHlldCBcdTIwMTQgYGRlY2s6IFtdYCwgbm8gcmV3cml0ZXMgYW55d2hlcmUpLlxuICovXG5cbmltcG9ydCB7IGV4dHJhY3RMaW5rVGV4dCB9IGZyb20gXCIuL2RlY2tcIjtcblxuLyoqIElucHV0cyBmb3IgcGxhbm5pbmcgXHUyMDE0IHJlc29sdmVkIGJ5IHRoZSBhZGFwdGVyIGluIG1haW4udHMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dElucHV0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIGN1cnJlbnQgbm90ZSAqL1xuICBjdXJyZW50TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBjdXJyZW50IG5vdGUgKGV4dHJhY3RlZCwgYXQgbW9zdCBvbmUpICovXG4gIGN1cnJlbnRMaW5rczogc3RyaW5nW107XG4gIC8qKiBCYXNlbmFtZXMgb2YgZXZlcnkgbWFya2Rvd24gbm90ZSBpbiB0aGUgdmF1bHQgKGNvbGxpc2lvbi1mcmVlIG5hbWluZykgKi9cbiAgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz47XG59XG5cbi8qKiBPbmUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja1Jld3JpdGUge1xuICAvKiogQmFzZW5hbWUgb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IHJhdyBgZGVja2AgbGluayB0ZXh0cyAoc2VyaWFsaXplZCBhcyBhIFlBTUwgbGlzdCkgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKiBUaGUgZnVsbCBwbGFuIGZvciBjcmVhdGluZyBvbmUgbmV3IHNsaWRlICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRSZXN1bHQge1xuICAvKiogQmFzZW5hbWUgKHdpdGhvdXQgZXh0ZW5zaW9uKSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKi9cbiAgbmV3TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIGZvciB0aGUgbmV3IG5vdGUncyBmcm9udG1hdHRlciAqL1xuICBuZXdEZWNrTGlua3M6IHN0cmluZ1tdO1xuICAvKiogUmV3cml0ZXMgdG8gYXBwbHkgdG8gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlKSAqL1xuICByZXdyaXRlczogRGVja1Jld3JpdGVbXTtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBub3RlLlxuICpcbiAqIEJlaGF2aW9yczpcbiAqICAgLSBObyBuZXh0IGxpbmsgKGxhc3Qgc2xpZGUsIGZyZXNoIGRlY2sgaGVhZCwgb3IgYSBwbGFpbiBub3RlIHN0YXJ0aW5nXG4gKiAgICAgYSBicmFuZC1uZXcgZGVjayk6IGFwcGVuZCBgPGN1cnJlbnQ+LW5leHRgIGFzIHRoZSBuZXcgbGFzdCBzbGlkZTsgdGhlXG4gKiAgICAgY3VycmVudCBub3RlJ3MgYGRlY2tgIGdhaW5zIHRoZSBsaW5rIHRvIGl0LlxuICogICAtIFZhbGlkIG5leHQgbGluazogaW5zZXJ0IGA8Y3VycmVudD4tbmV4dGAgYmV0d2VlbiB0aGUgY3VycmVudCBub3RlIGFuZFxuICogICAgIGl0cyBuZXh0OyB0aGUgbmV3IG5vdGUgdGFrZXMgb3ZlciB0aGUgb2xkIG5leHQgbGluay5cbiAqICAgLSBCcm9rZW4gbmV4dCBsaW5rIChwbGFpbiwgbm9uLWV4aXN0aW5nIG5hbWUpOiBjcmVhdGUgZXhhY3RseSB0aGVcbiAqICAgICBkZWNsYXJlZCBtaXNzaW5nIG5vdGUgYXMgdGhlIG5ldyBuZXh0IHNsaWRlIFx1MjAxNCB0aGUgXHUyNkEwIHdhcm5pbmdcbiAqICAgICBkaXNhcHBlYXJzIGFuZCB0aGUgYXV0aG9yJ3MgaW50ZW50IGlzIGhvbm91cmVkLiBBIGJyb2tlbiBsaW5rIHRoYXQgaXNcbiAqICAgICBub3QgYSBwbGFpbiBiYXNlbmFtZSAocGF0aC1xdWFsaWZpZWQsIHNlbGYtcmVmZXJlbmNpbmcpIGlzIHRyZWF0ZWQgYXNcbiAqICAgICBpbnZhbGlkIGFuZCBkcm9wcGVkIChhcHBlbmQgYSBgPGN1cnJlbnQ+LW5leHRgIGxhc3Qgc2xpZGUgaW5zdGVhZCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuQ3JlYXRlTmV4dChpbnB1dDogQ3JlYXRlTmV4dElucHV0KTogQ3JlYXRlTmV4dFJlc3VsdCB8IG51bGwge1xuICBjb25zdCB7IGN1cnJlbnROYW1lLCBjdXJyZW50TGlua3MgfSA9IGlucHV0O1xuICBjb25zdCBuZXh0TGluayA9IGN1cnJlbnRMaW5rc1swXTtcblxuICBpZiAobmV4dExpbmspIHtcbiAgICBjb25zdCBuZXh0TmFtZSA9IGV4dHJhY3RMaW5rVGV4dChuZXh0TGluayk7XG4gICAgaWYgKG5leHROYW1lICYmIGlzUGxhaW5OYW1lKG5leHROYW1lKSAmJiBuZXh0TmFtZSAhPT0gY3VycmVudE5hbWUpIHtcbiAgICAgIGlmICghaW5wdXQuZXhpc3RpbmdOYW1lcy5oYXMobmV4dE5hbWUpKSB7XG4gICAgICAgIC8vIFRoZSBkZWNsYXJlZCBuZXh0IG5vdGUgZG9lcyBub3QgZXhpc3QgeWV0IFx1MjE5MiBjcmVhdGUgZXhhY3RseSB0aGF0XG4gICAgICAgIC8vIG5vdGUgKGZpeGVzIHRoZSBicm9rZW4tbGluayB3YXJuaW5nLCBob25vdXJzIHRoZSBhdXRob3IncyBpbnRlbnQpLlxuICAgICAgICByZXR1cm4geyBuZXdOYW1lOiBuZXh0TmFtZSwgbmV3RGVja0xpbmtzOiBbXSwgcmV3cml0ZXM6IFtdIH07XG4gICAgICB9XG4gICAgICAvLyBBIHZhbGlkIG5leHQgbm90ZSBleGlzdHMgXHUyMTkyIGluc2VydCBiZXR3ZWVuIGl0IGFuZCB0aGUgY3VycmVudCBub3RlLlxuICAgICAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ld05hbWUsXG4gICAgICAgIG5ld0RlY2tMaW5rczogW25leHRMaW5rXSxcbiAgICAgICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBJbnZhbGlkIChwYXRoLXF1YWxpZmllZCAvIHNlbGYtcmVmZXJlbmNpbmcpIG5leHQgbGluayBcdTIxOTIgZHJvcCBpdCBhbmRcbiAgICAvLyBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSAoZmFsbCB0aHJvdWdoIHRvIHRoZSBuby1uZXh0IGJyYW5jaCkuXG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTm8gKHVzYWJsZSkgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgcmV0dXJuIHtcbiAgICBuZXdOYW1lLFxuICAgIG5ld0RlY2tMaW5rczogW10sXG4gICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gIH07XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuXG4gKlxuICogVGhlIG5ldyBub3RlIHN0YXJ0cyBhcyBhIHNpbmdsZS1zbGlkZSBkZWNrIChgZGVjazogW11gKSBhbmQgbm90aGluZyBlbHNlXG4gKiBpcyB0b3VjaGVkIFx1MjAxNCB0aGUgbm90ZSBpdCB3YXMgbGF1bmNoZWQgZnJvbSBzdGF5cyBhcy1pcy4gTGF0ZXIgcGFnZXMgYXJlXG4gKiBhZGRlZCB3aXRoIENyZWF0ZSBOZXh0IFNsaWRlIGZyb20gaW5zaWRlIHRoZSBkZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5ldyhpbnB1dDogeyBleGlzdGluZ05hbWVzOiBTZXQ8c3RyaW5nPiB9KTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZTogdW5pcXVlTmFtZShcInVudGl0bGVkLXNsaWRlc1wiLCBpbnB1dC5leGlzdGluZ05hbWVzKSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbXSxcbiAgfTtcbn1cblxuLyoqIEEgbmFtZSB1c2FibGUgYXMgYSB2YXVsdCBub3RlIG5hbWU6IG5vIHBhdGggc2VwYXJhdG9ycywgbm9uLWVtcHR5ICovXG5mdW5jdGlvbiBpc1BsYWluTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiAhbmFtZS5pbmNsdWRlcyhcIi9cIikgJiYgIW5hbWUuaW5jbHVkZXMoXCJcXFxcXCIpO1xufVxuXG4vKiogRmlyc3QgZnJlZSBuYW1lIGluIHRoZSBmYW1pbHkgYGJhc2VgLCBgYmFzZS0yYCwgYGJhc2UtM2AsIFx1MjAyNiAqL1xuZnVuY3Rpb24gdW5pcXVlTmFtZShiYXNlOiBzdHJpbmcsIGV4aXN0aW5nOiBTZXQ8c3RyaW5nPik6IHN0cmluZyB7XG4gIGlmICghZXhpc3RpbmcuaGFzKGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YmFzZX0tJHtpfWA7XG4gICAgaWYgKCFleGlzdGluZy5oYXMoY2FuZGlkYXRlKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogZGVsZXRlU2xpZGVzLnRzIFx1MjAxNCBQdXJlIFwiRGVsZXRlIHNsaWRlc1wiIHBsYW5uaW5nIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdCBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHlcbiAqIChzZWUgdGVzdC9kZWxldGVTbGlkZXMudGVzdC50cykuIFRoZSBhZGFwdGVyIGluIGRlY2stc2VydmljZS50cyBhcHBsaWVzXG4gKiB0aGUgcGxhbjogaXQgcmV3cml0ZXMgdGhlIHN1cnZpdmluZyBub3RlcycgYGRlY2tgIHByb3BlcnRpZXMsIHRoZW4gbW92ZXNcbiAqIHRoZSBkZWxldGVkIG5vdGVzIHRvIHRoZSB0cmFzaC5cbiAqXG4gKiBEZWxldGlvbiBzcGxpY2VzIHRoZSBjaGFpbiBpbnN0ZWFkIG9mIGJyZWFraW5nIGl0OiBldmVyeSBtYXhpbWFsIHJ1biBvZlxuICogZGVsZXRlZCBzbGlkZXMgYmV0d2VlbiB0d28gc3Vydml2b3JzIEEgXHUyMTkyIFx1MjAyNiBcdTIxOTIgQiBpcyByZXBhaXJlZCBieSBwb2ludGluZ1xuICogQSdzIGBkZWNrYCBsaW5rIGF0IEIgKGBbXWAgd2hlbiB0aGUgcnVuIHJlYWNoZXMgdGhlIGVuZCBvZiB0aGUgY2hhaW4pLlxuICogV2hlbiBhIHJ1biBzdGFydHMgYXQgdGhlIGNoYWluIGhlYWQsIHRoZSBmaXJzdCBzdXJ2aXZvciBiZWNvbWVzIHRoZSBuZXdcbiAqIGhlYWQgYW5kIG5lZWRzIG5vIHJld3JpdGUgYXQgYWxsIChpdHMgb3duIGBkZWNrYCBhbHJlYWR5IHBvaW50cyBvbndhcmQpLlxuICovXG5cbi8qKiBPbmUgc3Vydml2aW5nIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVJld3JpdGUge1xuICAvKiogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdGhhdCBzaG91bGQgYmVjb21lIHRoaXMgbm90ZSdzIG5leHQgc2xpZGUsXG4gICAqIG9yIG51bGwgd2hlbiB0aGUgbm90ZSBiZWNvbWVzIHRoZSBuZXcgbGFzdCBzbGlkZSAoYGRlY2s6IFtdYCkuXG4gICAqL1xuICBuZXh0UGF0aDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBkZWxldGlvbiBvZiBzbGlkZXMgZnJvbSBhbiBvcmRlcmVkIGRlY2sgY2hhaW4uXG4gKlxuICogYGNoYWluYCBpcyB0aGUgZnVsbCBzbGlkZSBvcmRlciAoWzBdID0gaGVhZCkuIE9ubHkgcGF0aHMgcHJlc2VudCBpbiB0aGVcbiAqIGNoYWluIGFyZSBjb25zaWRlcmVkOyBhbnl0aGluZyBlbHNlIGluIGBkZWxldGVQYXRoc2AgaXMgaWdub3JlZC4gUmV0dXJuc1xuICogb25lIHJld3JpdGUgcGVyIHN1cnZpdmluZyBub3RlIHRoYXQgZGlyZWN0bHkgcHJlY2VkZWQgYSBkZWxldGVkIHJ1bixcbiAqIG9yZGVyZWQgYnkgY2hhaW4gcG9zaXRpb24uIERlbGV0aW5nIG5vdGhpbmcgeWllbGRzIG5vIHJld3JpdGVzOyBkZWxldGluZ1xuICogZXZlcnl0aGluZyB5aWVsZHMgbm8gcmV3cml0ZXMgZWl0aGVyIChubyBzdXJ2aXZvcnMgbGVmdCB0byByZXBhaXIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkRlbGV0ZVNsaWRlcyhcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbik6IERlbGV0ZVJld3JpdGVbXSB7XG4gIGNvbnN0IHJld3JpdGVzOiBEZWxldGVSZXdyaXRlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhdGggPSBjaGFpbltpXTtcbiAgICBpZiAoIXBhdGggfHwgZGVsZXRlUGF0aHMuaGFzKHBhdGgpKSBjb250aW51ZTtcbiAgICAvLyBGaW5kIHRoZSBmaXJzdCBzdXJ2aXZvciBhZnRlciB0aGlzIG5vdGUncyBwb3NpdGlvbi5cbiAgICBsZXQgaiA9IGkgKyAxO1xuICAgIHdoaWxlIChqIDwgY2hhaW4ubGVuZ3RoICYmIGRlbGV0ZVBhdGhzLmhhcyhjaGFpbltqXSkpIGorKztcbiAgICBjb25zdCBuZXh0UGF0aCA9IGogPCBjaGFpbi5sZW5ndGggPyBjaGFpbltqXSA6IG51bGw7XG4gICAgY29uc3QgY2hhbmdlZCA9IG5leHRQYXRoICE9PSAoY2hhaW5baSArIDFdID8/IG51bGwpO1xuICAgIGlmIChjaGFuZ2VkKSByZXdyaXRlcy5wdXNoKHsgcGF0aCwgbmV4dFBhdGggfSk7XG4gIH1cbiAgcmV0dXJuIHJld3JpdGVzO1xufVxuXG4vKipcbiAqIFBpY2sgd2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlciBkZWxldGluZyBzbGlkZXM6IHRoZSBuZWFyZXN0XG4gKiBzdXJ2aXZvciBvZiBgZGVsZXRlZFBhdGhzYCcgbmVpZ2hib3VyaG9vZCBhcm91bmQgYGZvY3VzUGF0aGAgXHUyMDE0IHByZWZlclxuICogdGhlIGNsb3Nlc3Qgc3Vydml2b3IgYWZ0ZXIgaXQsIGVsc2UgdGhlIGNsb3Nlc3QgYmVmb3JlIGl0LiBSZXR1cm5zIG51bGxcbiAqIHdoZW4gYGZvY3VzUGF0aGAgc3Vydml2ZXMgb3Igbm90aGluZyBuZWFyYnkgcmVtYWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tMYW5kaW5nUGF0aChcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghZm9jdXNQYXRoIHx8ICFkZWxldGVQYXRocy5oYXMoZm9jdXNQYXRoKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihmb2N1c1BhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgZm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgZm9yIChsZXQgaSA9IGluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoIWRlbGV0ZVBhdGhzLmhhcyhjaGFpbltpXSkpIHJldHVybiBjaGFpbltpXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgTWVudSwgVEZpbGUsIFdvcmtzcGFjZUxlYWYgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgQ29uZmlybURlbGV0ZU1vZGFsIH0gZnJvbSBcIi4vY29uZmlybS1kZWxldGVcIjtcblxuLyoqIFZpZXcgdHlwZSBpZCBvZiB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwgKi9cbmV4cG9ydCBjb25zdCBTTElERVNfUEFORUxfVklFVyA9IFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiO1xuXG4vKipcbiAqIFNpZGViYXIgcGFuZWwgbGlzdGluZyBldmVyeSBzbGlkZSBvZiB0aGUgYWN0aXZlIG5vdGUncyBkZWNrIChuZXh0LW9ubHlcbiAqIGNoYWluIG9yZGVyKS4gVGFrZXMgb3ZlciB0aGUgYWdncmVnYXRpb24vZW50cnkgcm9sZSB0aGUgb3ZlcnZpZXcgcGFnZVxuICogdXNlZCB0byBwbGF5IGJlZm9yZSB2MS4wLjAuXG4gKlxuICogSW50ZXJhY3Rpb246XG4gKiAgIC0gY2xpY2sgICAgICAgICAgICBcdTIxOTIgb3BlbiB0aGF0IHNsaWRlIChhbmQgY2xlYXIgYW55IHNlbGVjdGlvbilcbiAqICAgLSBNb2QrY2xpY2sgICAgICAgIFx1MjE5MiB0b2dnbGUgdGhlIGl0ZW0gaW4gdGhlIHNlbGVjdGlvblxuICogICAtIFNoaWZ0K2NsaWNrICAgICAgXHUyMTkyIGV4dGVuZCB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIGxhc3QgYW5jaG9yXG4gKiAgIC0gcmlnaHQtY2xpY2sgICAgICBcdTIxOTIgY29udGV4dCBtZW51OiBDcmVhdGUgbmV4dCBzbGlkZSAvIERlbGV0ZSBzbGlkZShzKVxuICovXG5leHBvcnQgY2xhc3MgU2xpZGVzUGFuZWxWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICAvKiogQ2hhaW4gc2lnbmF0dXJlIG9mIHRoZSBjdXJyZW50bHkgcmVuZGVyZWQgbGlzdCAqL1xuICBwcml2YXRlIGxhc3RDaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgLyoqIFJlbmRlcmVkIGl0ZW0gZWxlbWVudHMsIGluZGV4LWFsaWduZWQgd2l0aCBsYXN0Q2hhaW4gKi9cbiAgcHJpdmF0ZSBpdGVtczogeyBwYXRoOiBzdHJpbmc7IGVsOiBIVE1MRWxlbWVudCB9W10gPSBbXTtcbiAgLyoqIEN1cnJlbnRseSBzZWxlY3RlZCBzbGlkZSBwYXRocyAobXVsdGktc2VsZWN0IGZvciBEZWxldGUpICovXG4gIHByaXZhdGUgc2VsZWN0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLyoqIFNlbGVjdGlvbiBhbmNob3IgZm9yIFNoaWZ0K2NsaWNrIHJhbmdlIGV4dGVuc2lvbiAqL1xuICBwcml2YXRlIGFuY2hvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbixcbiAgICBsZWFmOiBXb3Jrc3BhY2VMZWFmLFxuICApIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFNMSURFU19QQU5FTF9WSUVXO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJTbGlkZXNcIjtcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJwcmVzZW50YXRpb25cIjtcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuICAgIHRoaXMubGFzdENoYWluID0gW107XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICB0aGlzLmFuY2hvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU3luYyB0aGUgbGlzdCB3aXRoIHRoZSBhY3RpdmUgbm90ZSdzIGRlY2suIEluY3JlbWVudGFsIG9uIHB1cnBvc2U6IHRoZVxuICAgKiByZWZyZXNoIGV2ZW50cyBhbHNvIGZpcmUgd2hpbGUgYSBjbGljayBvbiBhbiBlbnRyeSBpcyBpbiBmbGlnaHQgKHRoZVxuICAgKiBtb3VzZWRvd24gYWN0aXZhdGVzIHRoaXMgbGVhZiksIGFuZCByZWJ1aWxkaW5nIHRoZSBET00gbWlkLWdlc3R1cmVcbiAgICogZGVzdHJveXMgdGhlIGNsaWNrIHRhcmdldCBcdTIwMTQgd2hpY2ggbWFkZSBvcGVuaW5nIGEgc2xpZGUgdGFrZSB0d28gY2xpY2tzXG4gICAqIHdoZW5ldmVyIHRoZSBwYW5lbCB3YXMgbm90IHRoZSBhY3RpdmUgbGVhZi4gVW5jaGFuZ2VkIGNoYWlucyBvbmx5IGdldFxuICAgKiB0aGVpciBoaWdobGlnaHQgdXBkYXRlZCwgc28gaXRlbSBlbGVtZW50cyBhbHdheXMgc3Vydml2ZS5cbiAgICovXG4gIHByaXZhdGUgcmVuZGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IGRlY2sgPSBmaWxlID8gdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKSA6IG51bGw7XG4gICAgY29uc3QgY2hhaW4gPSBkZWNrXG4gICAgICA/IGRlY2suY2hhaW4uZmlsdGVyKChwKSA9PiB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocCkgaW5zdGFuY2VvZiBURmlsZSlcbiAgICAgIDogW107XG5cbiAgICAvLyBEcm9wIHNlbGVjdGlvbnMgd2hvc2Ugbm90ZSB2YW5pc2hlZCBmcm9tIHRoZSBjaGFpbiBtZWFud2hpbGVcbiAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplID4gMCkge1xuICAgICAgY29uc3QgbGl2ZSA9IG5ldyBTZXQoY2hhaW4pO1xuICAgICAgZm9yIChjb25zdCBwYXRoIG9mIHRoaXMuc2VsZWN0ZWQpIGlmICghbGl2ZS5oYXMocGF0aCkpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIH1cbiAgICAvLyBBIGRlYWQgYW5jaG9yIG11c3Qgbm90IHNpbGVudGx5IHR1cm4gYSBTaGlmdCtjbGljayBpbnRvIGEgdG9nZ2xlXG4gICAgaWYgKHRoaXMuYW5jaG9yICE9PSBudWxsICYmICFjaGFpbi5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmICghY2hhaW5FcXVhbHModGhpcy5sYXN0Q2hhaW4sIGNoYWluKSkge1xuICAgICAgdGhpcy5yZWJ1aWxkKGNoYWluKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIsIGl0LnBhdGggPT09IGZpbGU/LnBhdGgpO1xuICAgIH1cbiAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogRnVsbCByZWJ1aWxkIChjaGFpbiBzaGFwZSBjaGFuZ2VkKSAqL1xuICBwcml2YXRlIHJlYnVpbGQoY2hhaW46IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGFpbmVyRWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IGNoYWluO1xuXG4gICAgaWYgKGNoYWluLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWVtcHR5XCIgfSk7XG4gICAgICBlbXB0eS5zZXRUZXh0KFxuICAgICAgICBcIk5vIHNsaWRlcyBkZWNrIFx1MjAxNCBvcGVuIGEgZGVjayBub3RlLCBvciBydW4gY3JlYXRlIG5leHQgc2xpZGUgb24gYW55IG5vdGUgdG8gc3RhcnQgb25lLlwiLFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aDtcbiAgICBjaGFpbi5mb3JFYWNoKChwYXRoLCBpKSA9PiB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuO1xuICAgICAgY29uc3QgaXRlbSA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtaXRlbVwiIH0pO1xuICAgICAgaWYgKHBhdGggPT09IGFjdGl2ZVBhdGgpIGl0ZW0uYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1udW1cIiB9KS5zZXRUZXh0KFN0cmluZyhpICsgMSkpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtdGl0bGVcIiB9KS5zZXRUZXh0KGYuYmFzZW5hbWUpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHRoaXMub25JdGVtQ2xpY2soZSwgaSwgZikpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShlLCBmKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pdGVtcy5wdXNoKHsgcGF0aCwgZWw6IGl0ZW0gfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xpY2sgcm91dGluZzogcGxhaW4gPSBvcGVuLCBNb2QgPSB0b2dnbGUgc2VsZWN0LCBTaGlmdCA9IHJhbmdlIHNlbGVjdCAqL1xuICBwcml2YXRlIG9uSXRlbUNsaWNrKGU6IE1vdXNlRXZlbnQsIGluZGV4OiBudW1iZXIsIGY6IFRGaWxlKTogdm9pZCB7XG4gICAgaWYgKGUuc2hpZnRLZXkgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgLy8gUmFuZ2UgYW5jaG9yOiB0aGUgbGFzdCBzZWxlY3RlZCBpdGVtLCBvciB0aGUgZGlzcGxheWVkIHNsaWRlXG4gICAgICAgIC8vIHdoZW4gbm8gdXNhYmxlIGFuY2hvciBleGlzdHMgKGZpcnN0IFNoaWZ0K2NsaWNrIGluIGEgc2Vzc2lvbikuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IG51bGw7XG4gICAgICAgIGNvbnN0IGFuY2hvclBhdGggPVxuICAgICAgICAgIHRoaXMuYW5jaG9yICE9PSBudWxsICYmIHRoaXMuaXRlbXMuc29tZSgoaXQpID0+IGl0LnBhdGggPT09IHRoaXMuYW5jaG9yKVxuICAgICAgICAgICAgPyB0aGlzLmFuY2hvclxuICAgICAgICAgICAgOiBhY3RpdmVQYXRoO1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGl0KSA9PiBpdC5wYXRoID09PSBhbmNob3JQYXRoKTtcbiAgICAgICAgaWYgKGFuY2hvclBhdGggIT09IG51bGwgJiYgZnJvbSAhPT0gLTEpIHtcbiAgICAgICAgICBjb25zdCBbbG8sIGhpXSA9IGZyb20gPCBpbmRleCA/IFtmcm9tLCBpbmRleF0gOiBbaW5kZXgsIGZyb21dO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBsbzsgaSA8PSBoaTsgaSsrKSB0aGlzLnNlbGVjdGVkLmFkZCh0aGlzLml0ZW1zW2ldLnBhdGgpO1xuICAgICAgICAgIC8vIFRoZSBkaXNwbGF5ZWQgc2xpZGUgam9pbnMgZXZlcnkgU2hpZnQgc2VsZWN0aW9uIFx1MjAxNCBleHRlbmRpbmcgYVxuICAgICAgICAgIC8vIHNlbGVjdGlvbiBuZXZlciBzaWxlbnRseSBkcm9wcyB0aGUgcGFnZSB5b3UgYXJlIGxvb2tpbmcgYXQuXG4gICAgICAgICAgaWYgKGFjdGl2ZVBhdGggIT09IG51bGwgJiYgdGhpcy5pdGVtcy5zb21lKChpdCkgPT4gaXQucGF0aCA9PT0gYWN0aXZlUGF0aCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkKGFjdGl2ZVBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmFuY2hvciA9IHRoaXMuaXRlbXNbaW5kZXhdLnBhdGg7XG4gICAgICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTW9kIChvciBTaGlmdCB3aXRoIG5vIHJlYWNoYWJsZSBhbmNob3IpOiBwdXJlIHRvZ2dsZSBcdTIwMTQgdGhlIG9ubHkgd2F5XG4gICAgICAvLyB0byBjYW5jZWwgYW4gaXRlbSBvdXQgb2YgdGhlIHNlbGVjdGlvbi5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkLmhhcyhmLnBhdGgpKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShmLnBhdGgpO1xuICAgICAgZWxzZSB0aGlzLnNlbGVjdGVkLmFkZChmLnBhdGgpO1xuICAgICAgdGhpcy5hbmNob3IgPSBmLnBhdGg7XG4gICAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAvLyBObyBzZWxlY3Rpb24gYWZ0ZXIgYSBwbGFpbiBjbGljaywgYnV0IHRoZSBjbGlja2VkIHNsaWRlIHN0YXlzIHRoZVxuICAgIC8vIFNoaWZ0K2NsaWNrIGFuY2hvciBcdTIwMTQgbWF0Y2hpbmcgdGhlIGZpbGUtZXhwbG9yZXIgZmVlbDogcGljayBhIHNsaWRlLFxuICAgIC8vIHRoZW4gU2hpZnQrY2xpY2sgYSBsYXRlciBvbmUgdG8gc2VsZWN0IHRoZSB3aG9sZSByYW5nZSBiZXR3ZWVuIHRoZW0uXG4gICAgdGhpcy5hbmNob3IgPSBmLnBhdGg7XG4gICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgIHZvaWQgdGhpcy5vcGVuU2xpZGUoZik7XG4gIH1cblxuICAvKiogUmVmbGVjdCB0aGUgc2VsZWN0aW9uIHNldCBvbiB0aGUgcmVuZGVyZWQgaXRlbXMgd2l0aG91dCBhIHJlYnVpbGQgKi9cbiAgcHJpdmF0ZSBzeW5jU2VsZWN0aW9uQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMuaXRlbXMpIGl0LmVsLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1zZWxlY3RlZFwiLCB0aGlzLnNlbGVjdGVkLmhhcyhpdC5wYXRoKSk7XG4gIH1cblxuICAvKiogUmlnaHQtY2xpY2sgbWVudSBvbiBvbmUgaXRlbTsgb3BlcmF0ZXMgb24gdGhlIHdob2xlIHNlbGVjdGlvbiB3aGVuIGl0IGJlbG9uZ3MgdG8gb25lICovXG4gIHByaXZhdGUgb3BlbkNvbnRleHRNZW51KGU6IE1vdXNlRXZlbnQsIGY6IFRGaWxlKTogdm9pZCB7XG4gICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShcIkNyZWF0ZSBuZXh0IHNsaWRlXCIpXG4gICAgICAgIC5zZXRJY29uKFwicGx1c1wiKVxuICAgICAgICAub25DbGljaygoKSA9PiB2b2lkIHRoaXMuY3JlYXRlTmV4dEFmdGVyKGYpKSxcbiAgICApO1xuICAgIGNvbnN0IHRhcmdldHMgPSB0aGlzLnNlbGVjdGVkLmhhcyhmLnBhdGgpID8gWy4uLnRoaXMuc2VsZWN0ZWRdIDogW2YucGF0aF07XG4gICAgY29uc3Qgb3JkZXJlZCA9IHRoaXMubGFzdENoYWluLmZpbHRlcigocCkgPT4gdGFyZ2V0cy5pbmNsdWRlcyhwKSk7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShvcmRlcmVkLmxlbmd0aCA+IDEgPyBgRGVsZXRlICR7b3JkZXJlZC5sZW5ndGh9IHNsaWRlc2AgOiBcIkRlbGV0ZSBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInRyYXNoXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMuZGVsZXRlU2xpZGVzKG9yZGVyZWQpKSxcbiAgICApO1xuICAgIG1lbnUuc2hvd0F0TW91c2VFdmVudChlKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgYSBzbGlkZSBhZnRlciB0aGUgcmlnaHQtY2xpY2tlZCBvbmUgKHdpdGhvdXQgb3BlbmluZyBpdCkgKi9cbiAgcHJpdmF0ZSBhc3luYyBjcmVhdGVOZXh0QWZ0ZXIoZjogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwbGFuID0gdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5leHQoZik7XG4gICAgaWYgKCFwbGFuKSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZiwgcGxhbiwgZmFsc2UpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKiogQ29uZmlybSwgdGhlbiB0cmFzaCB0aGUgZ2l2ZW4gc2xpZGVzIGFuZCBzcGxpY2UgdGhlbSBvdXQgb2YgdGhlIGNoYWluICovXG4gIHByaXZhdGUgZGVsZXRlU2xpZGVzKHBhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBydW4gPSAoKTogdm9pZCA9PiB2b2lkIHRoaXMucnVuRGVsZXRpb24ocGF0aHMpO1xuXG4gICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzKSB7XG4gICAgICBydW4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmFtZXMgPSBwYXRocy5tYXAoKHApID0+IHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocCk7XG4gICAgICByZXR1cm4gZiBpbnN0YW5jZW9mIFRGaWxlID8gZi5iYXNlbmFtZSA6IHA7XG4gICAgfSk7XG4gICAgbmV3IENvbmZpcm1EZWxldGVNb2RhbCh0aGlzLmFwcCwgbmFtZXMsIHJ1biwgYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcyA9IGZhbHNlO1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBydW5EZWxldGlvbihwYXRoczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBudWxsO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVEZWxldGVTbGlkZXMoXG4gICAgICB0aGlzLmxhc3RDaGFpbixcbiAgICAgIG5ldyBTZXQocGF0aHMpLFxuICAgICAgYWN0aXZlUGF0aCxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCBwYXRoIG9mIHBhdGhzKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShwYXRoKTtcbiAgICBpZiAodGhpcy5hbmNob3IgIT09IG51bGwgJiYgcGF0aHMuaW5jbHVkZXModGhpcy5hbmNob3IpKSB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAocmVzdWx0LmxhbmRpbmdQYXRoKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJlc3VsdC5sYW5kaW5nUGF0aCk7XG4gICAgICBpZiAoZiBpbnN0YW5jZW9mIFRGaWxlKSBhd2FpdCB0aGlzLm9wZW5TbGlkZShmKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBPcGVuIGEgc2xpZGUgaW4gYSBtYXJrZG93biBsZWFmIChuZXZlciBpbiB0aGlzIHBhbmVsJ3Mgb3duIGxlYWYpICovXG4gIHByaXZhdGUgYXN5bmMgb3BlblNsaWRlKGY6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbGVhZiA9XG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFwibWFya2Rvd25cIilbMF0gPz8gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYodHJ1ZSk7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmKTtcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmLCB7IGZvY3VzOiB0cnVlIH0pO1xuICB9XG59XG5cbi8qKiBPcmRlci1zZW5zaXRpdmUgY2hhaW4gY29tcGFyaXNvbiAqL1xuZnVuY3Rpb24gY2hhaW5FcXVhbHMoYTogc3RyaW5nW10sIGI6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIHJldHVybiBhLmxlbmd0aCA9PT0gYi5sZW5ndGggJiYgYS5ldmVyeSgocCwgaSkgPT4gcCA9PT0gYltpXSk7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTWF4IG5hbWVzIHNob3duIGluIHRoZSBkaWFsb2cgYmVmb3JlIGNvbGxhcHNpbmcgaW50byBhIFwiK04gbW9yZVwiIGxpbmUgKi9cbmNvbnN0IE1BWF9WSVNJQkxFX05BTUVTID0gODtcblxuLyoqXG4gKiBDb25maXJtYXRpb24gZGlhbG9nIGZvciBEZWxldGUgc2xpZGVzLiBMaXN0cyB0aGUgbm90ZXMgYWJvdXQgdG8gYmVcbiAqIHRyYXNoZWQgKG51bWJlcmVkIGxpa2UgdGhlIHBhbmVsLCBzbyB0aGUgdXNlciBjYW4gbWFwIHRoZW0gMToxKSwgb2ZmZXJzXG4gKiBhIFwiZG9uJ3QgYXNrIGFnYWluXCIgdG9nZ2xlIHRoYXQgZmxpcHMgdGhlIGBjb25maXJtRGVsZXRlU2xpZGVzYCBzZXR0aW5nXG4gKiBvZmYgKHBlcnNpc3RlZCBieSB0aGUgY2FsbGVyIHZpYSBvbkRvbnRBc2spLCBhbmQgYXNrcyBmb3IgYW4gZXhwbGljaXRcbiAqIENhbmNlbCAvIERlbGV0ZSBkZWNpc2lvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpcm1EZWxldGVNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSBjb25maXJtZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBwcml2YXRlIG5hbWVzOiBzdHJpbmdbXSxcbiAgICBwcml2YXRlIG9uQ29uZmlybTogKCkgPT4gdm9pZCxcbiAgICBwcml2YXRlIG9uRG9udEFzazogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgfVxuXG4gIG9uT3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIHRoaXMubW9kYWxFbC5hZGRDbGFzcyhcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGVcIik7XG5cbiAgICBjb25zdCBjb3VudCA9IHRoaXMubmFtZXMubGVuZ3RoO1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtdGl0bGVcIixcbiAgICAgIHRleHQ6IGNvdW50ID09PSAxID8gXCJEZWxldGUgdGhpcyBzbGlkZT9cIiA6IGBEZWxldGUgJHtjb3VudH0gc2xpZGVzP2AsXG4gICAgfSk7XG4gICAgdGhpcy5jb250ZW50RWxcbiAgICAgIC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1zdWJcIiB9KVxuICAgICAgLnNldFRleHQoXG4gICAgICAgIGNvdW50ID09PSAxXG4gICAgICAgICAgPyBcIlRoZSBub3RlIHdpbGwgYmUgbW92ZWQgdG8gdGhlIHRyYXNoLlwiXG4gICAgICAgICAgOiBcIlRoZXNlIG5vdGVzIHdpbGwgYmUgbW92ZWQgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgKTtcblxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1saXN0XCIgfSk7XG4gICAgZm9yIChjb25zdCBbaSwgbmFtZV0gb2YgdGhpcy5uYW1lcy5zbGljZSgwLCBNQVhfVklTSUJMRV9OQU1FUykuZW50cmllcygpKSB7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1udW1cIiB9KS5zZXRUZXh0KFN0cmluZyhpICsgMSkpO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1uYW1lXCIgfSkuc2V0VGV4dChuYW1lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXMubGVuZ3RoID4gTUFYX1ZJU0lCTEVfTkFNRVMpIHtcbiAgICAgIGxpc3RcbiAgICAgICAgLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW1vcmVcIiB9KVxuICAgICAgICAuc2V0VGV4dChgXHUyMDI2IGFuZCAke3RoaXMubmFtZXMubGVuZ3RoIC0gTUFYX1ZJU0lCTEVfTkFNRVN9IG1vcmVgKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkRG9udEFza1JvdygpO1xuICAgIHRoaXMuYnVpbGRBY3Rpb25zKCk7XG4gIH1cblxuICAvKiogQ29tcGFjdCBsZWZ0LWFsaWduZWQgXCJkb24ndCBhc2sgYWdhaW5cIiBjaGVja2JveCByb3cgKi9cbiAgcHJpdmF0ZSBidWlsZERvbnRBc2tSb3coKTogdm9pZCB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtZG9udGFza1wiIH0pO1xuICAgIHJvdy5jcmVhdGVFbChcImxhYmVsXCIpLnNldFRleHQoXCJEb24ndCBhc2sgYWdhaW5cIik7XG4gICAgY29uc3QgY2hlY2tib3ggPSByb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IHR5cGU6IFwiY2hlY2tib3hcIiB9KTtcbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5vbkRvbnRBc2soKS50aGVuKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgY2hlY2tib3guZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgLy8ga2VlcCB0aGUgY2hlY2tib3ggZW5hYmxlZCBpZiBwZXJzaXN0aW5nIHRoZSBwcmVmZXJlbmNlIGZhaWxlZFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSaWdodC1hbGlnbmVkIENhbmNlbCAvIERlbGV0ZSBidXR0b24gcm93ICovXG4gIHByaXZhdGUgYnVpbGRBY3Rpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1hY3Rpb25zXCIgfSk7XG4gICAgYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsXCIgfSkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuY2xvc2UoKSk7XG4gICAgYWN0aW9uc1xuICAgICAgLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJEZWxldGVcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSlcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb25maXJtZWQpIHRoaXMub25Db25maXJtKCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCB0eXBlIFNldHRpbmdEZWZpbml0aW9uSXRlbSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBTTElERVNfVEhFTUVTIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBTZXR0aW5ncyB0YWI6IHRvZ2dsZXMgdGhlIG5hdiBidXR0b25zLCBwYWdlIG51bWJlciwgYXV0by1lbnRlciBhbmQgYmFyXG4gKiB2aXNpYmlsaXR5LiBEZWNsYXJhdGl2ZSBkZWZpbml0aW9ucyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCwgc2VhcmNoYWJsZSBpbiB0aGVcbiAqIHNldHRpbmdzIG1vZGFsKSB3aXRoIGFuIGltcGVyYXRpdmUgYGRpc3BsYXkoKWAgZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zLlxuICovXG5leHBvcnQgY2xhc3MgTmF0aXZlU2xpZGVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKSB7XG4gICAgc3VwZXIocGx1Z2luLmFwcCwgcGx1Z2luKTtcbiAgfVxuXG4gIC8qKiBEZWNsYXJhdGl2ZSBzZXR0aW5ncyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCkgXHUyMDE0IHNlYXJjaGFibGUgYnkgdGhlIHNldHRpbmdzIG1vZGFsLiAqL1xuICBnZXRTZXR0aW5nRGVmaW5pdGlvbnMoKTogU2V0dGluZ0RlZmluaXRpb25JdGVtW10ge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU3R5bGUgdGVtcGxhdGVcIixcbiAgICAgICAgZGVzYzogXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgc2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICBrZXk6IFwic2xpZGVzVGhlbWVcIixcbiAgICAgICAgICB0eXBlOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgb3B0aW9uczogT2JqZWN0LmZyb21FbnRyaWVzKFNMSURFU19USEVNRVMubWFwKCh0KSA9PiBbdC5pZCwgdC5sYWJlbF0pKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ2VudGVyIGltYWdlc1wiLFxuICAgICAgICBkZXNjOiBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImltYWdlTGF5b3V0XCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgYmFyXCIsXG4gICAgICAgIGRlc2M6IFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93U2xpZGVzQmFyXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcmV2aW91cy9uZXh0IGJ1dHRvbnNcIixcbiAgICAgICAgZGVzYzogXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dOYXZCdXR0b25zXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiUGFnZSBudW1iZXIgc3R5bGVcIixcbiAgICAgICAgZGVzYzogJ1Nob3duIGF0IHRoZSBib3R0b20tcmlnaHQuIFwibiAvIHRvdGFsXCI6IDEtYmFzZWQgb3ZlciB0aGUgd2hvbGUgZGVjayBjaGFpbiAoaGVhZCBzbGlkZSA9IDEpLiBcIm5cIjoganVzdCB0aGUgY3VycmVudCBwYWdlIG51bWJlci4gXCJub25lXCI6IGhpZGRlbi4nLFxuICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAga2V5OiBcInBhZ2VOdW1iZXJTdHlsZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZHJvcGRvd25cIixcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBmcmFjdGlvbjogXCJOIC8gVG90YWxcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IFwiTlwiLFxuICAgICAgICAgICAgbm9uZTogXCJOb25lXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcm9ncmVzcyBiYXJcIixcbiAgICAgICAgZGVzYzogXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dQcm9ncmVzc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIixcbiAgICAgICAgZGVzYzogXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiYXV0b0VudGVyU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIsXG4gICAgICAgIGRlc2M6IFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiZXNjRXhpdHNTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTbGlkZXMgdGl0bGVcIixcbiAgICAgICAgZGVzYzogXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUgXHUyMDE0IHRoYXQgdGl0bGUgaXMgZWRpdGFibGUgKHJlbmFtZXMgdGhlIG5vdGUpOyBwcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIGFyZSByZWFkLW9ubHkgKGVkaXQgdGhlIHByb3BlcnR5IG91dHNpZGUgc2xpZGVzIG1vZGUpLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzbGlkZXNUaXRsZVwiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiRS5nLiBUaXRsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkJhciBwcm9wZXJ0aWVzXCIsXG4gICAgICAgIGRlc2M6IFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJiYXJQcm9wZXJ0aWVzXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJDb25maXJtIHNsaWRlIGRlbGV0aW9uXCIsXG4gICAgICAgIGRlc2M6IFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJjb25maXJtRGVsZXRlU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiTmF2aWdhdGlvbiBob3RrZXlzXCIsXG4gICAgICAgIGRlc2M6IFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgLyoqIFBlcnNpc3QgY29udHJvbCBjaGFuZ2VzLCB0aGVuIHJlZnJlc2ggdGhlIGJhciBzbyB0aGUgbmV3IHNldHRpbmcgYXBwbGllcy4gKi9cbiAgc2V0Q29udHJvbFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQge1xuICAgIHZvaWQgdGhpcy5hcHBseUNvbnRyb2xWYWx1ZShrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYXBwbHlDb250cm9sVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgKHRoaXMucGx1Z2luLnNldHRpbmdzIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW2tleV0gPSB2YWx1ZTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cblxuICAvKiogSW1wZXJhdGl2ZSBmYWxsYmFjayBmb3IgT2JzaWRpYW4gPCAxLjEzLjAgKG5vdCBjYWxsZWQgd2l0aCBkZWZpbml0aW9ucyBwcmVzZW50KS4gKi9cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3R5bGUgdGVtcGxhdGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkJ1aWx0LWluIGxvb2sgZm9yIHRoZSBzbGlkZXMgY2FyZCBhbmQgc2xpZGVzIGJhciAoYm9yZGVyLCBiYWNrZ3JvdW5kLCBzaGFkb3csIGJhciBzdHlsaW5nKS4gRXZlcnkgdGVtcGxhdGUgYWRhcHRzIHRvIGxpZ2h0IGFuZCBkYXJrIHRoZW1lcy5cIixcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIFNMSURFU19USEVNRVMpIGRyb3Bkb3duLmFkZE9wdGlvbih0LmlkLCB0LmxhYmVsKTtcbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGhlbWUpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNlbnRlciBpbWFnZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbWFnZUxheW91dCkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW1hZ2VMYXlvdXQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHNsaWRlcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0Jhcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0JhciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJldmlvdXMvbmV4dCBidXR0b25zXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQYWdlIG51bWJlciBzdHlsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIm4gLyB0b3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJuXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwibm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbnMoe1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPSB2YWx1ZSBhcyBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJvZ3Jlc3MgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFc2NhcGUgZXhpdHMgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2xpZGVzIHRpdGxlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkUuZy4gVGl0bGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJCYXIgcHJvcGVydGllc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29uZmlybSBzbGlkZSBkZWxldGlvblwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTmF2aWdhdGlvbiBob3RrZXlzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEZWZhdWx0OiBQcmV2aW91cyBwYWdlIG1vZCtzaGlmdCtcdTIxOTAsIG5leHQgcGFnZSBtb2Qrc2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgc2V0dGluZ3MgXHUyMTkyIGhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+XG4gICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiT3BlbiBob3RrZXlzIHNldHRpbmdzXCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgfVxufVxuIiwgIi8qKiBSZW1vdmUgYWxsIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNoaWxkcmVuKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQkEsSUFBQUEsbUJBQTRDOzs7QUN6QnJDLFNBQVMsWUFBeUI7QUFDdkMsUUFBTSxNQUFNLFVBQVUsRUFBRSxLQUFLLG9CQUFvQixDQUFDO0FBQ2xELE1BQUksYUFBYSxFQUFFLFNBQVMsT0FBTyxDQUFDO0FBQ3BDLE1BQUksUUFBUTtBQUlaLE1BQUksaUJBQWlCLGFBQWEsQ0FBQyxNQUFNO0FBQ3ZDLE1BQUUsZUFBZTtBQUNqQixVQUFNLFNBQVMsU0FBUztBQUN4QixRQUFJLGtCQUFrQixlQUFlLFdBQVcsU0FBUyxLQUFNLFFBQU8sS0FBSztBQUFBLEVBQzdFLENBQUM7QUFDRCxTQUFPO0FBQ1Q7QUFHTyxTQUFTLFVBQ2QsT0FDQSxLQUNBLFNBQ0EsV0FBVyxPQUNRO0FBQ25CLFFBQU0sTUFBTSxTQUFTLFVBQVU7QUFBQSxJQUM3QixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixNQUFNLEVBQUUsT0FBTyxJQUFJO0FBQUEsRUFDckIsQ0FBQztBQUNELE1BQUksV0FBVztBQUNmLE1BQUksQ0FBQyxTQUFVLEtBQUksaUJBQWlCLFNBQVMsT0FBTztBQUNwRCxTQUFPO0FBQ1Q7QUFRTyxTQUFTLGlCQUFpQixRQUF3QjtBQUN2RCxRQUFNLFNBQVMsU0FBUztBQUFBLElBQ3RCO0FBQUEsRUFDRjtBQUNBLE1BQUksVUFBVSxPQUFPLGVBQWUsRUFBRyxVQUFTLE9BQU87QUFDdkQsTUFBSSxTQUFTLEdBQUc7QUFDZCxhQUFTLGdCQUFnQixZQUFZLEVBQUUsaUNBQWlDLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFBQSxFQUN6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R0EsUUFBSSxLQUFLLFNBQVMsb0JBQW9CLFVBQVUsTUFBTTtBQUdwRCxZQUFNLFFBQVEsS0FBSyxNQUFNO0FBQ3pCLFlBQU0sT0FBTyxXQUFXO0FBQUEsUUFDdEIsS0FBSztBQUFBLFFBQ0wsTUFDRSxLQUFLLFNBQVMsb0JBQW9CLGFBQzlCLEdBQUcsS0FBSyxRQUFRLENBQUMsTUFBTSxLQUFLLEtBQzVCLEdBQUcsS0FBSyxRQUFRLENBQUM7QUFBQSxNQUN6QixDQUFDO0FBQ0QsV0FBSyxJQUFJLFlBQVksSUFBSTtBQUFBLElBQzNCO0FBR0EsUUFBSSxLQUFLLFNBQVMsZ0JBQWdCLFFBQVEsS0FBSyxNQUFNLFNBQVMsR0FBRztBQUMvRCxZQUFNLFdBQVcsVUFBVSxFQUFFLEtBQUsseUJBQXlCLENBQUM7QUFDNUQsZUFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLE1BQU0sUUFBUSxLQUFLO0FBQzFDLGNBQU0sUUFBUSxJQUFJLEtBQUssUUFBUSxTQUFTLE1BQU0sS0FBSyxRQUFRLFlBQVk7QUFDdkUsY0FBTSxNQUFNLFVBQVU7QUFBQSxVQUNwQixLQUFLLDBEQUEwRCxLQUFLO0FBQUEsUUFDdEUsQ0FBQztBQUNELFlBQUksaUJBQWlCLFNBQVMsTUFBTSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDdkQsaUJBQVMsWUFBWSxHQUFHO0FBQUEsTUFDMUI7QUFDQSxXQUFLLElBQUksWUFBWSxRQUFRO0FBQUEsSUFDL0I7QUFJQSxTQUFLLElBQUksYUFBYSxFQUFFLFNBQVMsS0FBSyxJQUFJLHNCQUFzQixJQUFJLFNBQVMsR0FBRyxDQUFDO0FBQUEsRUFDbkY7QUFDRjtBQUdBLFNBQVMsYUFBYSxPQUFnQixPQUFrQztBQUN0RSxTQUNFLE1BQU0sUUFBUSxLQUFLLEtBQUssTUFBTSxXQUFXLFNBQVMsTUFBTSxNQUFNLENBQUMsTUFBTSxPQUFPLE1BQU0sUUFBUTtBQUU5RjsiLAogICJuYW1lcyI6IFsiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAibmV3TmFtZSIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiJdCn0K
