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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9kZWJ1Zy50cyIsICJzcmMvbW9kZS50cyIsICJzcmMvdHlwZXMudHMiLCAic3JjL2NvbW1hbmRzLnRzIiwgInNyYy9kZWNrLXNlcnZpY2UudHMiLCAic3JjL2RlY2sudHMiLCAic3JjL2NyZWF0ZU5leHQudHMiLCAic3JjL2RlbGV0ZVNsaWRlcy50cyIsICJzcmMvcGFuZWwudHMiLCAic3JjL2NvbmZpcm0tZGVsZXRlLnRzIiwgInNyYy9zZXR0aW5ncy50cyIsICJzcmMvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogbmF0aXZlLXNsaWRlcyBcdTIwMTQgYSBcIlNsaWRlcyBtb2RlXCIgZm9yIE9ic2lkaWFuIGRlY2sgbm90ZXNcbiAqXG4gKiBPbmUgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5LCBgZGVja2AgKGEgc2luZ2xlIG1hcmtkb3duIGxpbmsgdG8gdGhlIG5leHRcbiAqIHNsaWRlIFx1MjAxNCBuZXh0LW9ubHkgc2VtYW50aWNzLCBubyBvdmVydmlldyBwYWdlIHNpbmNlIHYxLjAuMCksIGRyaXZlc1xuICogcHJldi9uZXh0IG5hdmlnYXRpb24gYW5kIGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXJzLiBBIGRlY2sgbm90ZSBjYW4gYmVcbiAqIGVudGVyZWQgaW50byAqKlNsaWRlcyBtb2RlKiogXHUyMDE0IGFuIGltbWVyc2l2ZSwgZWRpdGFibGUgKExpdmUgUHJldmlldykgdmlld1xuICogd2l0aCBhIHNsaWRlcyBiYXIgc2hvd2luZyBwcm9wZXJ0aWVzLCBuYXZpZ2F0aW9uIGFuZCB0aGUgcGFnZSBudW1iZXIuXG4gKlxuICogTmF0aXZlIE9ic2lkaWFuIG1vZGVzIChTb3VyY2UgLyBkZWZhdWx0IExpdmUgUHJldmlldyAvIFJlYWRpbmcgdmlldykgYXJlXG4gKiBsZWZ0IGNvbXBsZXRlbHkgdW50b3VjaGVkOiBubyBzdGF0dXMtYmFyIGhpZGluZywgbm8gc2xpZGVzIGJhciwgbm9cbiAqIGZ1bGxzY3JlZW4sIG5vIHN0eWxpbmcuIFNsaWRlcyBtb2RlIGlzIHRoZSBwbHVnaW4ncyBvbmx5IHN1cmZhY2UuXG4gKlxuICogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBhbmQgYSB0aGluIG9yY2hlc3RyYXRpb24gbGF5ZXI7IHRoZSBsb2dpY1xuICogbGl2ZXMgaW4gYHNyYy9gOlxuICogICAtIHNyYy90eXBlcy50cyAgICAgICAgc2V0dGluZ3Mgc2hhcGUgKyBkZWZhdWx0cyArIHJlc2VydmVkIGBkZWNrYCBrZXlcbiAqICAgLSBzcmMvbW9kZS50cyAgICAgICAgIHZpZXcgbW9kZSAvIGZyb250bWF0dGVyIGhlbHBlcnMgKHB1cmUsIGBBcHBgLWJhc2VkKVxuICogICAtIHNyYy9kZWNrLXNlcnZpY2UudHMgZGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWVcbiAqICAgLSBzcmMvYmFyLnRzICAgICAgICAgIGJhciBET00gaGVscGVycyAoY3JlYXRlIC8gYnV0dG9ucyAvIHRhYi1iYXIgbWVhc3VyZSlcbiAqICAgLSBzcmMvcGFuZWwudHMgICAgICAgIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gKiAgIC0gc3JjL2NvbW1hbmRzLnRzICAgICBjb21tYW5kIHJlZ2lzdHJhdGlvbiAoZGV2LWdhdGVkIGRlYnVnIGNvbW1hbmQpXG4gKiAgIC0gc3JjL3NldHRpbmdzLnRzICAgICBzZXR0aW5ncyB0YWJcbiAqICAgLSBzcmMvZGVidWcudHMgICAgICAgIHR5cG9ncmFwaHkgbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KVxuICogICAtIHNyYy9kZWNrLnRzICAgICAgICAgcHVyZSBkZWNrIGNvcmUgKHdpdGggc3JjL2NyZWF0ZU5leHQudHMpXG4gKi9cblxuaW1wb3J0IHsgTWFya2Rvd25WaWV3LCBQbHVnaW4sIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjcmVhdGVCYXIsIG5hdkJ1dHRvbiwgc3luY1RhYkJhckhlaWdodCB9IGZyb20gXCIuL3NyYy9iYXJcIjtcbmltcG9ydCB7IHJlZ2lzdGVyQ29tbWFuZHMgfSBmcm9tIFwiLi9zcmMvY29tbWFuZHNcIjtcbmltcG9ydCB7IERlY2tTZXJ2aWNlIH0gZnJvbSBcIi4vc3JjL2RlY2stc2VydmljZVwiO1xuaW1wb3J0IHsgZm9ybWF0VmFsdWUgfSBmcm9tIFwiLi9zcmMvZGVja1wiO1xuaW1wb3J0IHsgYWN0aXZlRnJvbnRtYXR0ZXIsIGN1cnJlbnRNb2RlLCBmcm9udG1hdHRlck9mLCBpc0xpdmVQcmV2aWV3IH0gZnJvbSBcIi4vc3JjL21vZGVcIjtcbmltcG9ydCB7IFNsaWRlc1BhbmVsVmlldywgU0xJREVTX1BBTkVMX1ZJRVcgfSBmcm9tIFwiLi9zcmMvcGFuZWxcIjtcbmltcG9ydCB7IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgfSBmcm9tIFwiLi9zcmMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IERFQ0tfS0VZLCBERUZBVUxUX1NFVFRJTkdTLCBTTElERVNfVEhFTUVTLCB0eXBlIE5hdGl2ZVNsaWRlc1NldHRpbmdzIH0gZnJvbSBcIi4vc3JjL3R5cGVzXCI7XG5pbXBvcnQgeyBjbGVhckNoaWxkcmVuIH0gZnJvbSBcIi4vc3JjL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hdGl2ZVNsaWRlc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIC8qKiBUaGUgc2xpZGVzIGJhciBET00gZWxlbWVudCAqL1xuICBiYXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8qKiBEZWNrIGNoYWluIHJlc29sdXRpb24gKyBcImNyZWF0ZSBuZXh0IHNsaWRlXCIgZ2x1ZSAqL1xuICBkZWNrU2VydmljZSE6IERlY2tTZXJ2aWNlO1xuICAvKiogUGx1Z2luIHNldHRpbmdzICovXG4gIHNldHRpbmdzOiBOYXRpdmVTbGlkZXNTZXR0aW5ncyA9IHsgLi4uREVGQVVMVF9TRVRUSU5HUyB9O1xuXG4gIC8qKiBXaGV0aGVyIFNsaWRlcyBtb2RlIGlzIGN1cnJlbnRseSBhY3RpdmUgKHNlc3Npb24gc3RhdGUsIG5vdCBwZXJzaXN0ZWQpICovXG4gIHByaXZhdGUgc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAvKiogVmlldyBtb2RlIHRvIHJlc3RvcmUgd2hlbiBsZWF2aW5nIFNsaWRlcyBtb2RlIChcInByZXZpZXdcIiB8IFwic291cmNlXCIpICovXG4gIHByaXZhdGUgZXhpdE1vZGU6IFwicHJldmlld1wiIHwgXCJzb3VyY2VcIiA9IFwic291cmNlXCI7XG4gIC8qKiBXaGV0aGVyIHRoZSBleGl0IHZpZXcgd2FzIFNvdXJjZSBtb2RlICh0cnVlKSB2cyBMaXZlIFByZXZpZXcgKGZhbHNlKSAqL1xuICBwcml2YXRlIGV4aXRTb3VyY2UgPSBmYWxzZTtcbiAgLyoqIExhc3Qgbm90ZSBhdXRvLWVudGVyZWQgaW50byBTbGlkZXMgbW9kZSAocHJldmVudHMgcmUtZW50ZXJpbmcgYWZ0ZXIgbWFudWFsIGV4aXQpICovXG4gIHByaXZhdGUgYXV0b0VudGVyZWRQYXRoID0gXCJcIjtcbiAgLyoqIExhc3QgcmVmcmVzaCBrZXkgKFwicGF0aHxtb2RlXCIpIHRvIGF2b2lkIHBvaW50bGVzcyByZS1yZW5kZXJzICovXG4gIHByaXZhdGUgbGFzdEtleSA9IFwiXCI7XG4gIC8qKiBMYXN0IG1lYXN1cmVkIHRhYi1iYXIgaGVpZ2h0IChweCkgXHUyMDE0IGNhY2hlZCB3aGlsZSB0aGUgc2xpZGVzIGJhciBpcyBoaWRkZW4gKi9cbiAgcHJpdmF0ZSB0YWJCYXJIZWlnaHQgPSAwO1xuICAvKiogV2hldGhlciB0aGUgbW91c2UgcG9pbnRlciBpcyBoaWRkZW4gZm9yIHByZXNlbnRpbmcgKHNlc3Npb24gc3RhdGUpICovXG4gIHBvaW50ZXJIaWRkZW4gPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmRlY2tTZXJ2aWNlID0gbmV3IERlY2tTZXJ2aWNlKHRoaXMuYXBwKTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIodGhpcykpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDEuIFJlZnJlc2ggb24gXCJjdXJyZW50IG5vdGUgLyB2aWV3IGNoYW5nZWRcIiBldmVudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5tYXliZUF1dG9FbnRlclNsaWRlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG4gICAgLy8gUmVmcmVzaCB3aGVuIHRoZSBub3RlIGNvbnRlbnQgKGluY2x1ZGluZyBmcm9udG1hdHRlcikgY2hhbmdlcyAvIHNhdmVzXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMi4gRmFsbGJhY2sgdGltZXI6IGVkaXRcdTIxOTRyZWFkaW5nIHRvZ2dsZXMgbWF5IGZpcmUgbm8gc3RhbmRhcmQgZXZlbnQgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKFxuICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGZpbGUgPyBgJHtmaWxlLnBhdGh9fCR7Y3VycmVudE1vZGUodGhpcy5hcHApfWAgOiBcIlwiO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCksXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzLiBDb21tYW5kcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICByZWdpc3RlckNvbW1hbmRzKHRoaXMpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDNiLiBTbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBvdmVydmlldywgcmVwbGFjZXMgdGhlIG9sZCBvdmVydmlldyBwYWdlKSBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhTTElERVNfUEFORUxfVklFVywgKGxlYWYpID0+IG5ldyBTbGlkZXNQYW5lbFZpZXcodGhpcywgbGVhZikpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInByZXNlbnRhdGlvblwiLCBcIlNob3cgc2xpZGVzIHBhbmVsXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVNsaWRlc1BhbmVsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNC4gUGluIHRoZSBTbGlkZXMgZWRpdG9yIHRvIG9uZSBzY3JlZW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ1NTIGBvdmVyZmxvdzogaGlkZGVuYCBibG9ja3MgdGhlIHdoZWVsLCBidXQgbmF0aXZlIGRyYWctc2VsZWN0XG4gICAgLy8gYXV0b3Njcm9sbCBhbmQgQ29kZU1pcnJvcidzIHByb2dyYW1tYXRpYyBzY3JvbGxJbnRvVmlldyBzdGlsbCBtb3ZlIHRoZVxuICAgIC8vIHNjcm9sbGVyLiBUaGlzIGNhcHR1cmUtcGhhc2UgbGlzdGVuZXIgcmVzZXRzIGFueSBzY3JvbGwgaW5zaWRlIHRoZVxuICAgIC8vIGFjdGl2ZSBtYXJrZG93biB2aWV3IGJhY2sgdG8gdGhlIHRvcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhY3RpdmUuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KFxuICAgICAgZG9jdW1lbnQsXG4gICAgICBcInNjcm9sbFwiLFxuICAgICAgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcbiAgICAgICAgY29uc3QgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB2aWV3LmNvbnRlbnRFbC5jb250YWlucyhlbCkpIHtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxMZWZ0ICE9PSAwKSBlbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHsgY2FwdHVyZTogdHJ1ZSB9LFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNS4gRXNjYXBlIGtleSBleGl0cyBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZG9jdW1lbnQsIFwia2V5ZG93blwiLCAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNsaWRlc01vZGUgJiYgdGhpcy5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykge1xuICAgICAgICB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA2LiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgYW5kIGRvIHRoZSBmaXJzdCByZW5kZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5iYXIgPSBjcmVhdGVCYXIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFyKTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9udW5sb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuYmFyPy5yZW1vdmUoKTtcbiAgICB0aGlzLmJhciA9IG51bGw7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIik7XG4gICAgdGhpcy5yZW1vdmVUaGVtZUNsYXNzZXMoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXR0aW5ncyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGF0YSA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIGFzIFBhcnRpYWw8TmF0aXZlU2xpZGVzU2V0dGluZ3M+IHwgbnVsbDtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgZGF0YSA/PyB7fSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG5vdGUgaXMgYSBkZWNrIG5vdGUgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSkgKi9cbiAgcHJpdmF0ZSBpc0RlY2tOb3RlKGZpbGU6IFRGaWxlIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBldmVyeSBgbmF0aXZlLXNsaWRlcy10aGVtZS0qYCBjbGFzcyBmcm9tIDxib2R5PiAqL1xuICBwcml2YXRlIHJlbW92ZVRoZW1lQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNscyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGNscy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBzaW5nbGUgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmAgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBzbGlkZXNUaGVtZWAgc2V0dGluZyBcdTIwMTQgdGhlIHN0eWxlIHRlbXBsYXRlcyBpbiBzdHlsZXMuY3NzIGhvb2sgb2ZmIGl0LlxuICAgKiBVbmtub3duIGlkcyAoZS5nLiBhZnRlciBhIGRvd25ncmFkZSkgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHRoZW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVRoZW1lQ2xhc3MoKTogdm9pZCB7XG4gICAgY29uc3QgaWQgPSBTTElERVNfVEhFTUVTLnNvbWUoKHQpID0+IHQuaWQgPT09IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWUpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5zbGlkZXNUaGVtZTtcbiAgICBjb25zdCBjbHMgPSBgbmF0aXZlLXNsaWRlcy10aGVtZS0ke2lkfWA7XG4gICAgZm9yIChjb25zdCBjIG9mIEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpKSB7XG4gICAgICBpZiAoYy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikgJiYgYyAhPT0gY2xzKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBoaWRpbmcgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgZm9yIHByZXNlbnRpbmcuIEhpZGluZyBhbHNvXG4gICAqIHBhcmtzIGZvY3VzIChibHVycyB0aGUgZWRpdG9yLCBzbyB0aGUgY2FyZXQgZGlzYXBwZWFycyk7IHNob3dpbmcgbGVhdmVzXG4gICAqIGZvY3VzIHBhcmtlZCBcdTIwMTQgY2xpY2sgc2xpZGUgY29udGVudCB0byByZXN1bWUgZWRpdGluZy5cbiAgICovXG4gIHRvZ2dsZVBvaW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5wb2ludGVySGlkZGVuID0gIXRoaXMucG9pbnRlckhpZGRlbjtcbiAgICBpZiAodGhpcy5wb2ludGVySGlkZGVuKSB7XG4gICAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgYG5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBwcmVzZW50aW5nIHN0YXRlIFx1MjAxNCBzdHlsZXMuY3NzIHR1cm5zIGV2ZXJ5IGN1cnNvciBpbnZpc2libGUgd2hpbGUgc2V0LlxuICAgKiBMZWF2aW5nIFNsaWRlcyBtb2RlIGFsd2F5cyByZXN0b3JlcyB0aGUgcG9pbnRlci5cbiAgICovXG4gIHByaXZhdGUgc3luY1BvaW50ZXJDbGFzcyhzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIsIHNsaWRlcyAmJiB0aGlzLnBvaW50ZXJIaWRkZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc2AgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBpbWFnZUxheW91dGAgc2V0dGluZyBcdTIwMTQgc3R5bGVzLmNzcydzIGltYWdlLWxheW91dCBydWxlcyBob29rIG9mZiBpdC5cbiAgICogVGhlIGNsYXNzIGlzIG9ubHkgbWVhbmluZ2Z1bCBpbiBTbGlkZXMgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgc3luY0ltYWdlTGF5b3V0Q2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgXCJuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc1wiLFxuICAgICAgc2xpZGVzICYmIHRoaXMuc2V0dGluZ3MuaW1hZ2VMYXlvdXQsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNhcmQgdGl0bGUgcGVyIHRoZSBgc2xpZGVzVGl0bGVgIHNldHRpbmcuIFwiZmlsZW5hbWVcIiByZXN0eWxlc1xuICAgKiB0aGUgbmF0aXZlIGlubGluZSB0aXRsZSBpbnRvIHRoZSBjYXJkIHRpdGxlIChzdGlsbCBlZGl0YWJsZSBcdTIwMTQgdHlwaW5nXG4gICAqIHJlbmFtZXMgdGhlIG5vdGUpOyBcIlwiIHNob3dzIG5vdGhpbmc7IGFueSBvdGhlciB2YWx1ZSBuYW1lcyBhIGZyb250bWF0dGVyXG4gICAqIHByb3BlcnR5IHJlbmRlcmVkIHJlYWQtb25seSB2aWEgdGhlIDo6YmVmb3JlIHBzZXVkby1lbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJbmxpbmVUaXRsZShzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBjb250ZW50ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFmaWxlKSByZXR1cm47XG5cbiAgICBjb25zdCBzcmMgPSB0aGlzLnNldHRpbmdzLnNsaWRlc1RpdGxlLnRyaW0oKTtcblxuICAgIC8vIFwiZmlsZW5hbWVcIjogcmVzdHlsZSB0aGUgbmF0aXZlIC5pbmxpbmUtdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZS4gSXRcbiAgICAvLyBzdGF5cyBjb250ZW50ZWRpdGFibGUsIHNvIGVkaXRpbmcgaXQgcmVuYW1lcyB0aGUgbm90ZSBhcyBpbiBMaXZlXG4gICAgLy8gUHJldmlldy4gVGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgbGl2ZXMgb24gdGhlIG1hcmtkb3duLXNvdXJjZS12aWV3XG4gICAgLy8gZWxlbWVudCAoYSBzaWJsaW5nIGJyYW5jaCBvZiB0aGUgY2FyZCksIHNvIHRoZSBzdHlsaW5nIGhvb2sgaXMgYVxuICAgIC8vIHZpZXcgYXR0cmlidXRlICsgYSBicmFuZC1uZXcgLmNtLWNvbnRlbnQgYXR0cmlidXRlIHRoYXQgcmVzZXJ2ZXMgdGhlXG4gICAgLy8gdGl0bGUncyBoZWlnaHQgdGhlIHNhbWUgd2F5IHRoZSBwc2V1ZG8tZWxlbWVudCB2ZXJzaW9uIGRpZC5cbiAgICBjb25zdCBuYXRpdmVUaXRsZSA9IHNsaWRlcyAmJiBzcmMgPT09IFwiZmlsZW5hbWVcIjtcbiAgICBjb25zdCBzb3VyY2VWaWV3ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXNvdXJjZS12aWV3XCIpO1xuICAgIGlmIChuYXRpdmVUaXRsZSAmJiBzb3VyY2VWaWV3KSBzb3VyY2VWaWV3LnNldEF0dHJpYnV0ZShcImRhdGEtbnMtaW5saW5lLXRpdGxlXCIsIFwiZmlsZW5hbWVcIik7XG4gICAgZWxzZSBzb3VyY2VWaWV3Py5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiKTtcbiAgICBjb250ZW50LnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiLCBuYXRpdmVUaXRsZSk7XG5cbiAgICAvLyBQcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIHJlbmRlciByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudFxuICAgIC8vIChubyBlZGl0aW5nIHN1cmZhY2UgXHUyMDE0IHRoZSBwcm9wZXJ0aWVzIHBhbmVsIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSkuXG4gICAgbGV0IHRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGlmIChzbGlkZXMgJiYgc3JjICYmIHNyYyAhPT0gXCJmaWxlbmFtZVwiKSB7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgICAgY29uc3QgdiA9IGZtPy5bc3JjXTtcbiAgICAgIGlmICh2ICE9IG51bGwpIHRleHQgPSBmb3JtYXRWYWx1ZSh2KTtcbiAgICB9XG5cbiAgICBpZiAodGV4dCkgY29udGVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiLCB0ZXh0KTtcbiAgICBlbHNlIGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIik7XG4gIH1cblxuICAvKiogRW50ZXIgU2xpZGVzIG1vZGU6IHJlY29yZCB0aGUgZXhpdCBzdGF0ZSBhbmQgZm9yY2UgdGhlIExpdmUgUHJldmlldyAqL1xuICBwcml2YXRlIGFzeW5jIGVudGVyU2xpZGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IG1vZGU/OiBzdHJpbmc7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgICAgIHRoaXMuZXhpdE1vZGUgPSBzdGF0ZS5tb2RlID09PSBcInByZXZpZXdcIiA/IFwicHJldmlld1wiIDogXCJzb3VyY2VcIjtcbiAgICAgIHRoaXMuZXhpdFNvdXJjZSA9IHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZTtcbiAgICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFsd2F5cyB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgICBjb25zdCBuZXh0ID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgbmV4dC5zdGF0ZSA9IHsgLi4ubmV4dC5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiBmYWxzZSB9O1xuICAgICAgYXdhaXQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShuZXh0LCB7IGZvY3VzOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gdHJ1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBFeGl0IFNsaWRlcyBtb2RlOiByZXN0b3JlIHRoZSB2aWV3IG1vZGUgcmVjb3JkZWQgYXQgZW50cnkgKi9cbiAgcHJpdmF0ZSBleGl0U2xpZGVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIGlmICh0aGlzLmV4aXRNb2RlID09PSBcInByZXZpZXdcIikge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwicHJldmlld1wiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogdGhpcy5leGl0U291cmNlIH07XG4gICAgICB9XG4gICAgICB2b2lkIHZpZXcubGVhZi5zZXRWaWV3U3RhdGUoc3RhdGUsIHsgZm9jdXM6IGZhbHNlIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgU2xpZGVzIG1vZGUgKGRlY2sgbm90ZXMgb25seSBcdTIwMTQgZW5mb3JjZWQgYnkgdGhlIGNvbW1hbmQpICovXG4gIHRvZ2dsZVNsaWRlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlKSB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICBlbHNlIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqIFJldmVhbCB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwsIGNyZWF0aW5nIGl0IGluIHRoZSByaWdodCBzaWRlYmFyIGlmIG5lZWRlZCAqL1xuICBhc3luYyBhY3RpdmF0ZVNsaWRlc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTTElERVNfUEFORUxfVklFVyk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nWzBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikgcmV0dXJuO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogU0xJREVTX1BBTkVMX1ZJRVcsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIE1vdmUgb25lIHN0ZXAgYmFjay9mb3J3YXJkIGFsb25nIHRoZSBkZWNrIGNoYWluIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpICovXG4gIGFzeW5jIG5hdmlnYXRlKGRpcmVjdGlvbjogXCJwcmV2XCIgfCBcIm5leHRcIik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgaWYgKCFkZWNrKSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltkaXJlY3Rpb24gPT09IFwicHJldlwiID8gZGVjay5pbmRleCAtIDEgOiBkZWNrLmluZGV4ICsgMV07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvKiogSnVtcCB0byBhIHNwZWNpZmljIGluZGV4IGluIHRoZSBkZWNrIGNoYWluIChwcm9ncmVzcyBiYXIgY2xpY2spICovXG4gIGFzeW5jIGp1bXBUbyhpbmRleDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBpZiAoIWRlY2sgfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IGRlY2suY2hhaW4ubGVuZ3RoIHx8IGluZGV4ID09PSBkZWNrLmluZGV4KSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltpbmRleF07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQmFyIHJlbmRlcmluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKipcbiAgICogR2V0IGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgdGhlIGJhciBwcm9wZXJ0aWVzLiBSZXR1cm5zIGFuIGFycmF5IG9mXG4gICAqIHBlcmNlbnRhZ2VzIChzdW1taW5nIHRvIDEwMCkgZm9yIGVhY2ggcHJvcGVydHkuIExvYWRzIGZyb20gc2V0dGluZ3Mgb3JcbiAgICogZGVmYXVsdHMgdG8gZXF1YWwgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRCYXJQcm9wZXJ0eVdpZHRocyhjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgfHwgXCJbXVwiKSBhcyB1bmtub3duO1xuICAgICAgaWYgKGlzTnVtYmVyTGlzdChzdG9yZWQsIGNvdW50KSkgcmV0dXJuIHN0b3JlZDtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEFycmF5PG51bWJlcj4oY291bnQpLmZpbGwoMTAwIC8gY291bnQpO1xuICB9XG5cbiAgLyoqIFNhdmUgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIHRvIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRoczogbnVtYmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzID0gSlNPTi5zdHJpbmdpZnkod2lkdGhzKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLyoqIERlY2lkZSB3aGF0IHRoZSBzbGlkZXMgYmFyIHNob3dzLCB0aGVuIHJlLXJlbmRlciBpdCAqL1xuICByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXIpIHJldHVybjtcbiAgICB0aGlzLmFwcGx5VGhlbWVDbGFzcygpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKHRoaXMuYXBwKTtcbiAgICBjb25zdCBpc0NhcmQgPSB0aGlzLmlzRGVja05vdGUoZmlsZSk7XG4gICAgY29uc3QgbGl2ZVByZXZpZXdOb3cgPSBtb2RlID09PSBcInNvdXJjZVwiICYmIGlzTGl2ZVByZXZpZXcodGhpcy5hcHApO1xuXG4gICAgLy8gTGVhdmluZyBhIGRlY2sgbm90ZSwgb3IgbGVhdmluZyB0aGUgTGl2ZSBQcmV2aWV3IChlLmcuIENtZC9DdHJsK0UgdG9cbiAgICAvLyByZWFkaW5nIHZpZXcpLCBlbmRzIFNsaWRlcyBtb2RlIFx1MjAxNCBvbmx5IHRoZSB0b2dnbGUgY29tbWFuZCByZS1lbnRlcnMgaXQuXG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSAmJiAoIWlzQ2FyZCB8fCAhbGl2ZVByZXZpZXdOb3cpKSB7XG4gICAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIHRoZSB0YWIgYmFyIHdoaWxlIGl0IGlzIHN0aWxsIHZpc2libGUgKFNsaWRlcyBtb2RlIGhpZGVzIGl0XG4gICAgLy8gYmVsb3c7IHRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGlzIHJldXNlZCBvbmNlIGhpZGRlbikuXG4gICAgdGhpcy50YWJCYXJIZWlnaHQgPSBzeW5jVGFiQmFySGVpZ2h0KHRoaXMudGFiQmFySGVpZ2h0KTtcblxuICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZSBvbmx5IHdoaWxlIGFjdHVhbGx5IGluIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICBjb25zdCBzbGlkZXMgPSB0aGlzLnNsaWRlc01vZGUgJiYgaXNDYXJkICYmIGxpdmVQcmV2aWV3Tm93O1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiLCBzbGlkZXMpO1xuICAgIGlmICghc2xpZGVzKSB0aGlzLnBvaW50ZXJIaWRkZW4gPSBmYWxzZTsgLy8gbGVhdmluZyBTbGlkZXMgcmVzdG9yZXMgdGhlIHBvaW50ZXJcbiAgICB0aGlzLnN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy51cGRhdGVJbmxpbmVUaXRsZShzbGlkZXMpO1xuXG4gICAgY29uc3QgYmFyVmlzaWJsZSA9IHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgJiYgIXRoaXMuc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgIC8vIFdoZW4gYmFyIGlzIGhpZGRlbiwgc2V0IGJvdHRvbSBwYWRkaW5nIHRvIDAgc28gdGhlIGNhcmQgZmlsbHMgdGhlIGZ1bGxcbiAgICAvLyB3aW5kb3cgaGVpZ2h0LiBXaGVuIHZpc2libGUsIHJlbW92ZSB0aGUgb3ZlcnJpZGUgc28gQ1NTIGZhbGxzIGJhY2sgdG9cbiAgICAvLyAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCAoY2xlYXJzIHRoZSBiYXIgYXMgYmVmb3JlKS5cbiAgICBpZiAoYmFyVmlzaWJsZSkge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIjogXCIwcHhcIiB9KTtcbiAgICB9XG4gICAgaWYgKCFiYXJWaXNpYmxlKSB7XG4gICAgICB0aGlzLmJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFmaWxlKSByZXR1cm47IC8vIGJhclZpc2libGUgaW1wbGllcyBhIGZpbGUsIGJ1dCBuYXJyb3cgZm9yIFR5cGVTY3JpcHRcblxuICAgIGNvbnN0IGZtID0gYWN0aXZlRnJvbnRtYXR0ZXIodGhpcy5hcHApO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgY2xlYXJDaGlsZHJlbih0aGlzLmJhcik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTGVmdDogcHJldmlvdXMgLyBuZXh0IGJ1dHRvbnMgKGJvdGggYWx3YXlzIHNob3duIGluc2lkZSBhIGRlY2s7XG4gICAgLy8gICAgICAgIHRoZSBvbmUgdGhhdCBjYW5ub3QgbW92ZSBpcyBkaXNhYmxlZCAvIGxpZ2h0IGdyYXkpIFx1MjUwMFx1MjUwMFxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dOYXZCdXR0b25zICYmIGRlY2spIHtcbiAgICAgIGNvbnN0IGhhc1ByZXYgPSBkZWNrLmluZGV4ID4gMDtcbiAgICAgIGNvbnN0IGhhc05leHQgPSBkZWNrLmluZGV4IDwgZGVjay5jaGFpbi5sZW5ndGggLSAxO1xuICAgICAgY29uc3QgbmF2ID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtbmF2XCIgfSk7XG4gICAgICBuYXYuYXBwZW5kQ2hpbGQobmF2QnV0dG9uKFwiXHUyNUMwXCIsIFwiUHJldmlvdXMgcGFnZVwiLCAoKSA9PiB2b2lkIHRoaXMubmF2aWdhdGUoXCJwcmV2XCIpLCAhaGFzUHJldikpO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVCNlwiLCBcIk5leHQgcGFnZVwiLCAoKSA9PiB2b2lkIHRoaXMubmF2aWdhdGUoXCJuZXh0XCIpLCAhaGFzTmV4dCkpO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTWlkZGxlOiBjb25maWd1cmVkIHByb3BlcnR5IGNvbHVtbnMgd2l0aCBkcmFnZ2FibGUgZGl2aWRlcnMgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgcHJvcE5hbWVzID0gdGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzXG4gICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBpZiAocHJvcE5hbWVzLmxlbmd0aCA+IDAgJiYgZm0pIHtcbiAgICAgIGNvbnN0IGVudHJpZXM6IFtzdHJpbmcsIHN0cmluZ11bXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHByb3BOYW1lcykge1xuICAgICAgICBpZiAobmFtZSBpbiBmbSkge1xuICAgICAgICAgIGNvbnN0IHZhbCA9IGZtW25hbWVdO1xuICAgICAgICAgIGlmICh2YWwgIT0gbnVsbCkgZW50cmllcy5wdXNoKFtuYW1lLCBmb3JtYXRWYWx1ZSh2YWwpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItcHJvcGVydGllc1wiIH0pO1xuXG4gICAgICAgIGNvbnN0IHdpZHRocyA9IHRoaXMuZ2V0QmFyUHJvcGVydHlXaWR0aHMoZW50cmllcy5sZW5ndGgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IFssIHZhbHVlXSA9IGVudHJpZXNbaV07XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsIHRleHQ6IHZhbHVlIH0pO1xuICAgICAgICAgIGl0ZW0uc2V0Q3NzU3R5bGVzKHtcbiAgICAgICAgICAgIGZsZXhCYXNpczogYGNhbGMoJHt3aWR0aHNbaV19JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtKTtcblxuICAgICAgICAgIGlmIChpIDwgZW50cmllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBjb25zdCBkaXZpZGVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLWRpdmlkZXJcIiB9KTtcbiAgICAgICAgICAgIGRpdmlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgIGNvbnN0IGluaXRpYWxXaWR0aHMgPSBbLi4ud2lkdGhzXTtcbiAgICAgICAgICAgICAgY29uc3Qgb25Nb3ZlID0gKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSAoKGV2LmNsaWVudFggLSBzdGFydFgpIC8gY29udGFpbmVyV2lkdGgpICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xlZnQgPSBNYXRoLm1heCg1LCBpbml0aWFsV2lkdGhzW2ldICsgZGVsdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JpZ2h0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpICsgMV0gLSBkZWx0YSk7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2ldID0gbmV3TGVmdDtcbiAgICAgICAgICAgICAgICB3aWR0aHNbaSArIDFdID0gbmV3UmlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICBcIi5uYXRpdmUtc2xpZGVzLWJhci1wcm9wLWl0ZW1cIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7bmV3TGVmdH0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaXRlbXNbaSArIDFdLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7bmV3UmlnaHR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBjb25zdCBvblVwID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3ZlKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvblVwKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJcIiwgdXNlclNlbGVjdDogXCJcIiB9KTtcbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMuc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRocyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3ZlKTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2V0Q3NzU3R5bGVzKHsgY3Vyc29yOiBcImNvbC1yZXNpemVcIiwgdXNlclNlbGVjdDogXCJub25lXCIgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZpZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJyb2tlbiBkZWNrIGxpbmtzIFx1MjE5MiB3YXJuaW5nIGNoaXAgc28gZGVjayBhdXRob3JzIHNwb3QgdHlwb3NcbiAgICBjb25zdCBicm9rZW4gPSBmaWxlID8gdGhpcy5kZWNrU2VydmljZS5icm9rZW4oZmlsZSkgOiBbXTtcbiAgICBpZiAoYnJva2VuLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHdhcm4gPSBjcmVhdGVTcGFuKHtcbiAgICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtd2FyblwiLFxuICAgICAgICB0ZXh0OiBcIlx1MjZBMCBcIiArIGJyb2tlbi5qb2luKFwiLCBcIiksXG4gICAgICAgIGF0dHI6IHsgdGl0bGU6IFwiQnJva2VuIGRlY2sgbGluayhzKSBcdTIwMTQgdGhlIHRhcmdldCBub3RlIGRvZXMgbm90IGV4aXN0XCIgfSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQod2Fybik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEJvdHRvbS1yaWdodDogYXV0by1jb21wdXRlZCBwYWdlIG51bWJlciBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgIT09IFwibm9uZVwiICYmIGRlY2spIHtcbiAgICAgIC8vIHYxLjAuMCBuZXh0LW9ubHkgc2VtYW50aWNzOiBjaGFpblswXSBpcyB0aGUgaGVhZCBzbGlkZSA9IHBhZ2UgMTtcbiAgICAgIC8vIHRvdGFsIGlzIHRoZSBmdWxsIGNoYWluIGxlbmd0aC5cbiAgICAgIGNvbnN0IHRvdGFsID0gZGVjay5jaGFpbi5sZW5ndGg7XG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXBhZ2VcIixcbiAgICAgICAgdGV4dDpcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSA9PT0gXCJmcmFjdGlvblwiXG4gICAgICAgICAgICA/IGAke2RlY2suaW5kZXggKyAxfSAvICR7dG90YWx9YFxuICAgICAgICAgICAgOiBgJHtkZWNrLmluZGV4ICsgMX1gLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChwYWdlKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUHJvZ3Jlc3MgaW5kaWNhdG9yOiBkaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgYmFyIHRvcCBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MgJiYgZGVjayAmJiBkZWNrLmNoYWluLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVjay5jaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGkgPCBkZWNrLmluZGV4ID8gXCJwYXN0XCIgOiBpID09PSBkZWNrLmluZGV4ID8gXCJjdXJyZW50XCIgOiBcImZ1dHVyZVwiO1xuICAgICAgICBjb25zdCBzZWcgPSBjcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogYG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnIG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnLS0ke3N0YXRlfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBzZWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHZvaWQgdGhpcy5qdW1wVG8oaSkpO1xuICAgICAgICBwcm9ncmVzcy5hcHBlbmRDaGlsZChzZWcpO1xuICAgICAgfVxuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIEhpZGUgdGhlIHNsaWRlcyBiYXIgZW50aXJlbHkgd2hlbiBpdCBoYXMgbm90aGluZyB0byBkaXNwbGF5IChubyBwcm9wZXJ0aWVzLFxuICAgIC8vIGFuZCBub3QgcGFydCBvZiBhIGRlY2spXG4gICAgdGhpcy5iYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogdGhpcy5iYXIuY2hpbGRFbGVtZW50Q291bnQgPT09IDAgPyBcIm5vbmVcIiA6IFwiXCIgfSk7XG4gIH1cbn1cblxuLyoqIFdoZXRoZXIgYHZhbHVlYCBpcyBhbiBhcnJheSBvZiBleGFjdGx5IGBjb3VudGAgbnVtYmVycyAoc3RvcmVkIGJhciB3aWR0aHMpLiAqL1xuZnVuY3Rpb24gaXNOdW1iZXJMaXN0KHZhbHVlOiB1bmtub3duLCBjb3VudDogbnVtYmVyKTogdmFsdWUgaXMgbnVtYmVyW10ge1xuICByZXR1cm4gKFxuICAgIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gY291bnQgJiYgdmFsdWUuZXZlcnkoKG4pID0+IHR5cGVvZiBuID09PSBcIm51bWJlclwiKVxuICApO1xufVxuIiwgIi8qKiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKGhpZGRlbiB1bnRpbCByZWZyZXNoKCkgc2hvd3MgaXQpICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQmFyKCk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgYmFyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyXCIgfSk7XG4gIGJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgYmFyLnRpdGxlID0gXCJDbGljayB0byBwYXJrIHRoZSBtb3VzZSBcdTIwMTQgaGlkZXMgdGhlIGVkaXRvciBjYXJldCB3aGlsZSBwcmVzZW50aW5nXCI7XG4gIC8vIFByZXNlbnRhdGlvbiBwYXJraW5nOiBjbGlja2luZyB0aGUgYmFyIGtlZXBzIGZvY3VzIG91dCBvZiB0aGUgZWRpdG9yIHNvXG4gIC8vIHRoZSBibGlua2luZyBjYXJldCBkaXNhcHBlYXJzLiBwcmV2ZW50RGVmYXVsdCBzdG9wcyB0aGUgY2xpY2sgZnJvbSBtb3ZpbmdcbiAgLy8gZm9jdXMgb3Igc3RhcnRpbmcgYSB0ZXh0IHNlbGVjdGlvbjsgYnV0dG9ucyBzdGlsbCByZWNlaXZlIHRoZWlyIGNsaWNrIGV2ZW50LlxuICBiYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gIH0pO1xuICByZXR1cm4gYmFyO1xufVxuXG4vKiogQnVpbGQgYSBcdTI1QzAgLyBcdTI1QjYgbmF2aWdhdGlvbiBidXR0b247IGBkaXNhYmxlZGAgcmVuZGVycyBpdCBsaWdodCBncmF5L2luYWN0aXZlICovXG5leHBvcnQgZnVuY3Rpb24gbmF2QnV0dG9uKFxuICBsYWJlbDogc3RyaW5nLFxuICB0aXA6IHN0cmluZyxcbiAgb25DbGljazogKCkgPT4gdm9pZCxcbiAgZGlzYWJsZWQgPSBmYWxzZSxcbik6IEhUTUxCdXR0b25FbGVtZW50IHtcbiAgY29uc3QgYnRuID0gY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdi1idG5cIixcbiAgICB0ZXh0OiBsYWJlbCxcbiAgICBhdHRyOiB7IHRpdGxlOiB0aXAgfSxcbiAgfSk7XG4gIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICBpZiAoIWRpc2FibGVkKSBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uQ2xpY2spO1xuICByZXR1cm4gYnRuO1xufVxuXG4vKipcbiAqIE1lYXN1cmUgdGhlIHRvcCB0YWIgYmFyIGFuZCBleHBvc2UgaXRzIGhlaWdodCBhcyB0aGUgQ1NTIHZhcmlhYmxlXG4gKiAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCwgcmV0dXJuaW5nIHRoZSAocG9zc2libHkgdXBkYXRlZCkgY2FjaGVkXG4gKiB2YWx1ZS4gVGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuIGluIFNsaWRlcyBtb2RlLCBzbyB0aGUgbGFzdCBtZWFzdXJlZFxuICogdmFsdWUgaXMgcmV1c2VkIHRoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3luY1RhYkJhckhlaWdodChjYWNoZWQ6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHRhYkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFxuICAgIFwiLndvcmtzcGFjZS10YWJzLm1vZC10b3AgLndvcmtzcGFjZS10YWItaGVhZGVyLWNvbnRhaW5lclwiLFxuICApO1xuICBpZiAodGFiQmFyICYmIHRhYkJhci5vZmZzZXRIZWlnaHQgPiAwKSBjYWNoZWQgPSB0YWJCYXIub2Zmc2V0SGVpZ2h0O1xuICBpZiAoY2FjaGVkID4gMCkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIjogYCR7Y2FjaGVkfXB4YCB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBObyBtZWFzdXJlbWVudCB5ZXQgKHRhYiBiYXIgaGlkZGVuIHNpbmNlIGxvYWQpIFx1MjAxNCBsZXQgdGhlIENTUyBmYWxsYmFjayBhcHBseS5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9tb2RlXCI7XG5cbi8qKlxuICogVHlwb2dyYXBoeS1tZWFzdXJlbWVudCB0b29saW5nIChkZXYgYnVpbGRzIG9ubHkpLlxuICpcbiAqIFRoZSBgbnMtZGVidWctc3R5bGVzYCBjb21tYW5kIHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyBpblxuICogZWRpdCAoTGl2ZSBQcmV2aWV3KSBhbmQgdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldywgbWVyZ2VzIHRoZVxuICogcmVzdWx0cywgY29tcHV0ZXMgYW4gZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kIHdyaXRlcyBpdCB0b1xuICogLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC4gUmVnaXN0ZXJlZCBvbmx5IHdoZW4gdGhlXG4gKiBidWlsZC10aW1lIERFVl9NT0RFIGZsYWcgaXMgdHJ1ZTsgcmVsZWFzZSBidWlsZHMgdHJlZS1zaGFrZSB0aGlzIG1vZHVsZSBvdXQuXG4gKi9cblxuLyoqIEZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyB1c2VkIGJ5IHRoZSBkZWJ1ZyBjb21tYW5kIChlZGl0IHNpZGUpICovXG5leHBvcnQgY29uc3QgU0FNUExFX05PVEVfTkFNRVMgPSBbXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtaGVhZGluZ3NcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1saXN0XCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtY29kZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLXF1b3RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbWVkaWFcIixcbl07XG5cbi8qKiBTdHlsZSBzZWN0aW9ucyBzYW1wbGVkIGJ5IHNhbXBsZVN0eWxlcygpIGFuZCBjb21wYXJlZCBieSBkaWZmRHVtcHMoKSAqL1xuY29uc3QgU1RZTEVfU0VDVElPTlMgPSBbXG4gIFwiY29udGFpbmVyXCIsXG4gIFwicGFyYWdyYXBoXCIsXG4gIFwiaDFcIixcbiAgXCJsaXN0SXRlbVwiLFxuICBcImNvZGVCbG9ja1wiLFxuICBcImJsb2NrcXVvdGVcIixcbiAgXCJpbmxpbmVDb2RlXCIsXG4gIFwidGFibGVcIixcbiAgXCJpbWFnZVwiLFxuICBcImhvcml6b250YWxSdWxlXCIsXG5dO1xuXG4vKiogUHJvbWlzZS1iYXNlZCBzbGVlcCAqL1xuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHdpbmRvdy5zZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKlxuICogTWVyZ2Ugbm9uLW1pc3Npbmcgc3R5bGUgc2VjdGlvbnMgb2YgYSBmcmVzaCBzYW1wbGUgaW50byB0aGUgdGFyZ2V0XG4gKiAoZmlyc3Qgbm9uLW1pc3NpbmcgdmFsdWUgd2lucykuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU2FtcGxlKHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHNhbXBsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gc2FtcGxlW2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlY3Rpb24gfHwgXCIobWlzc2luZylcIiBpbiBzZWN0aW9uKSBjb250aW51ZTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRhcmdldFtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKGV4aXN0aW5nICYmICEoXCIobWlzc2luZylcIiBpbiBleGlzdGluZykpIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc2VjdGlvbjtcbiAgfVxuICAvLyBQcm9iZSBmaWVsZHMgcmlkZSBhbG9uZyAoZmlyc3Qgbm9uLWVtcHR5IHdpbnMpXG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImxpc3RMaW5lc1wiLFxuICAgIFwibWV0YWRhdGFDb250YWluZXJEaXNwbGF5XCIsXG4gICAgXCJoMU9mZnNldFRvcFwiLFxuICAgIFwiaDFUb3BJbkNvbnRlbnRcIixcbiAgICBcImgxTGVmdEluQ29udGVudFwiLFxuICAgIFwidGl0bGVcIixcbiAgICBcImNvbnRlbnRDaGlsZHJlblwiLFxuICAgIFwidG9wQ2hhaW5cIixcbiAgXSkge1xuICAgIGNvbnN0IHByb2JlID0gc2FtcGxlW2tleV07XG4gICAgaWYgKHByb2JlID09PSB1bmRlZmluZWQgfHwgcHJvYmUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb2JlKSAmJiBwcm9iZS5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcHJvYmUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvYmUpICYmIE9iamVjdC5rZXlzKHByb2JlKS5sZW5ndGggPT09IDApXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFyZ2V0W2tleV0gPT09IHVuZGVmaW5lZCkgdGFyZ2V0W2tleV0gPSBwcm9iZTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmUgdGhlIHN0eWxlIHNlY3Rpb25zIG9mIGFuIGVkaXQgZHVtcCBhbmQgYSByZWFkaW5nIGR1bXA7IG9ubHlcbiAqIGtleXMgd2hvc2UgdmFsdWVzIGRpZmZlciBhcmUga2VwdCwgYXMgeyBrZXk6IHsgZWRpdCwgcmVhZGluZyB9IH0uXG4gKi9cbmZ1bmN0aW9uIGRpZmZEdW1wcyhcbiAgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IGUgPSAoZWRpdFtzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCByID0gKHJlYWRpbmdbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGUpLCAuLi5PYmplY3Qua2V5cyhyKV0pO1xuICAgIGNvbnN0IGRpZmZzOiBSZWNvcmQ8c3RyaW5nLCB7IGVkaXQ6IHN0cmluZzsgcmVhZGluZzogc3RyaW5nIH0+ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgaWYgKGVba2V5XSAhPT0gcltrZXldKSB7XG4gICAgICAgIGRpZmZzW2tleV0gPSB7IGVkaXQ6IGVba2V5XSA/PyBcIihtaXNzaW5nKVwiLCByZWFkaW5nOiByW2tleV0gPz8gXCIobWlzc2luZylcIiB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoZGlmZnMpLmxlbmd0aCA+IDApIG91dFtzZWN0aW9uXSA9IGRpZmZzO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBTYW1wbGUgdGhlIGN1cnJlbnQgdmlldydzIHR5cG9ncmFwaHkgY29tcHV0ZWQgc3R5bGVzICsgQ1NTIHZhcmlhYmxlcyAqL1xuZnVuY3Rpb24gc2FtcGxlU3R5bGVzKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0VkaXQgPSB2aWV3LmdldE1vZGUoKSA9PT0gXCJzb3VyY2VcIjtcbiAgY29uc3QgY29udGVudEVsID0gdmlldy5jb250ZW50RWw7XG4gIC8vIEZpcnN0IG1hdGNoaW5nIGNhbmRpZGF0ZSB3aW5zIFx1MjAxNCBlZGl0IChjbTYpIGFuZCByZWFkaW5nIHVzZVxuICAvLyBkaWZmZXJlbnQgZWxlbWVudCBzdHJ1Y3R1cmVzIChlLmcuIG5vIHByZS9ibG9ja3F1b3RlIGluIGNtNikuXG4gIGNvbnN0IHBpY2sgPSAoc2Vsczogc3RyaW5nW10pOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3Qgc2VsIG9mIHNlbHMpIHtcbiAgICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgICBpZiAoZWwpIHJldHVybiBlbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGNvbnN0IHN0eWxlID0gKGVsOiBIVE1MRWxlbWVudCB8IG51bGwsIHByb3BzOiBzdHJpbmdbXSk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICAgIGlmICghZWwpIHJldHVybiB7IFwiKG1pc3NpbmcpXCI6IFwiZWxlbWVudCBub3QgaW4gdGhpcyBub3RlXCIgfTtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcCBvZiBwcm9wcykge1xuICAgICAgY29uc3QgdiA9IGNzLmdldFByb3BlcnR5VmFsdWUocCkudHJpbSgpO1xuICAgICAgaWYgKHYpIG91dFtwXSA9IHY7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IHZhcnMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICBjb25zdCBjc3NWYXIgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHZhcnMuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKS50cmltKCk7XG5cbiAgY29uc3QgY29udGFpbmVyID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWNvbnRlbnRcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiLFxuICBdKTtcbiAgY29uc3QgcGFyYSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcFwiLFxuICBdKTtcbiAgY29uc3QgaDEgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1oZWFkZXItMVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGgxXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaDFcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoMVwiLFxuICBdKTtcbiAgY29uc3QgbGlzdEl0ZW0gPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgICBpc0VkaXQgPyBcIi5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICBdKTtcbiAgY29uc3QgcHJlID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgcHJlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tZWRpdGluZyBwcmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWNvZGVibG9ja1wiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICBdKTtcbiAgY29uc3QgcXVvdGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGJsb2NrcXVvdGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBibG9ja3F1b3RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtcXVvdGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBibG9ja3F1b3RlXCIsXG4gIF0pO1xuICBjb25zdCBpbmxpbmVDb2RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBjb2RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgY29kZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1pbmxpbmUtY29kZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGNvZGVcIixcbiAgXSk7XG4gIGNvbnN0IHRhYmxlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IHRhYmxlXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdGFibGVcIixcbiAgXSk7XG4gIGNvbnN0IGltZyA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaW1nXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGltZ1wiLFxuICAgIFwiaW1nXCIsIC8vIHdob2xlLWRvY3VtZW50IGZhbGxiYWNrXG4gIF0pO1xuICBjb25zdCBociA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20taHJcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICBdKTtcblxuICAvLyBTdHJ1Y3R1cmUgcHJvYmVzIChlZGl0IHZpZXcgb25seSk6IHRoZSBzb3VyY2UtdmlldyBjbGFzcyBsaXN0XG4gIC8vIChjb25maXJtcyB0aGUgTGl2ZSBQcmV2aWV3IG1hcmtlciBjbGFzcykgYW5kIHVuaXF1ZSBlbGVtZW50IHRhZ3NcbiAgLy8gaW5zaWRlIHRoZSBlZGl0b3IgKHJldmVhbHMgaG93IGNtNiByZW5kZXJzIGNvZGUgYmxvY2tzIGV0Yy4gd2hlblxuICAvLyB0aGUgdXN1YWwgc2VsZWN0b3JzIGRvIG5vdCBtYXRjaCkuXG4gIGNvbnN0IHNvdXJjZVZpZXdDbGFzcyA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTZcIik/LmNsYXNzTmFtZSA/PyBcIlwiO1xuICBjb25zdCBkb21UYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnRlbnRFbFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAqXCIpXG4gICAgICAuZm9yRWFjaCgoZWwpID0+IHRhZ3MuYWRkKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkpO1xuICAgIGRvbVRhZ3MucHVzaCguLi50YWdzKTtcbiAgfVxuICAvLyBMaXN0LWxpbmUgcHJvYmUgKGVkaXQgdmlldyBvbmx5KTogY2xhc3MgbmFtZXMgKyBjb21wdXRlZCBwYWRkaW5nXG4gIC8vIG9mIHRoZSBmaXJzdCBsaXN0IGxpbmVzIFx1MjAxNCBuZXN0ZWQgbGV2ZWxzIG9mdGVuIHVzZSBkaXN0aW5jdFxuICAvLyBjbGFzc2VzIG9yIGlubGluZSBwYWRkaW5ncywgd2hpY2ggZGVjaWRlcyB3aGV0aGVyIGEgbGV2ZWwtYXdhcmVcbiAgLy8gaW5kZW50IG92ZXJyaWRlIGlzIGV2ZW4gcG9zc2libGUuXG4gIGNvbnN0IGxpc3RMaW5lczogeyBjbGFzc05hbWU6IHN0cmluZzsgcGFkZGluZ0xlZnQ6IHN0cmluZyB9W10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yQWxsKFwiLkh5cGVyTUQtbGlzdC1saW5lXCIpLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICBpZiAoaSA+PSA0KSByZXR1cm47XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgbGlzdExpbmVzLnB1c2goe1xuICAgICAgICBjbGFzc05hbWU6IGVsLmNsYXNzTmFtZSxcbiAgICAgICAgcGFkZGluZ0xlZnQ6IGNzLmdldFByb3BlcnR5VmFsdWUoXCJwYWRkaW5nLWxlZnRcIikudHJpbSgpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gRnJvbnRtYXR0ZXIgcHJvYmVzOiBkb2VzIHRoZSAoaGlkZGVuKSBwcm9wZXJ0aWVzIGFyZWEgc3RpbGxcbiAgLy8gb2NjdXB5IHNwYWNlIGluIExpdmUgUHJldmlldz8gQW5kIGhvdyBmYXIgaXMgdGhlIEgxIGZyb20gdGhlXG4gIC8vIHRvcCBvZiB0aGUgY29udGVudCBhcmVhPyAocmVhZGluZyBtb2RlIGhhcyBubyBzdWNoIHBhZGRpbmcpXG4gIGNvbnN0IG1ldGFkYXRhRGlzcGxheSA9ICgoKSA9PiB7XG4gICAgY29uc3Qgc2VsID0gaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiO1xuICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgcmV0dXJuIGVsID8gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSA6IFwiKG5vdCBpbiBET00pXCI7XG4gIH0pKCk7XG4gIGNvbnN0IGgxT2Zmc2V0VG9wID0gKCgpID0+IHtcbiAgICBpZiAoIWgxKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB0b3AgPSAwO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBoMTtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdG9wICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgICAgbm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRvcDtcbiAgfSkoKTtcbiAgLy8gV2hhdCBvY2N1cGllcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgY29udGVudCB0b3AgYW5kIHRoZSBIMT9cbiAgLy8gKGVkaXQpIGZpcnN0IGNoaWxkcmVuIG9mIC5jbS1jb250ZW50LCBhbmQgdGhlIG5ldCBIMSBkaXN0YW5jZVxuICAvLyBmcm9tIHRoZSBjb250ZW50IGFuY2hvciBcdTIwMTQgcmVhZGluZyBoYXMgbm8gc3VjaCBnYXAuXG4gIGNvbnN0IGFuY2hvciA9IGlzRWRpdFxuICAgID8gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIilcbiAgICA6IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiKTtcbiAgY29uc3QgaDFUb3BJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTtcbiAgfSkoKTtcbiAgY29uc3QgaDFMZWZ0SW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KTtcbiAgfSkoKTtcbiAgY29uc3QgY29udGVudENoaWxkcmVuID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhbmNob3IuY2hpbGRyZW4pXG4gICAgICAuc2xpY2UoMCwgNClcbiAgICAgIC5tYXAoKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xzOiAoZWwgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTmFtZSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSxcbiAgICAgICAgICBtYXJnaW5Ub3A6IGNzLm1hcmdpblRvcCxcbiAgICAgICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogY3MubWFyZ2luQm90dG9tLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IGNzLnBhZGRpbmdCb3R0b20sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSkoKTtcbiAgLy8gQ29udGFpbmVyIGNoYWluIHByb2JlOiBmcm9tIC5jbS1jb250ZW50IHVwIHRvIHRoZSB2aWV3LWNvbnRlbnQsXG4gIC8vIGVhY2ggd3JhcHBlcidzIHBhZGRpbmcvbWFyZ2luIFx1MjAxNCBsb2NhdGVzIHRoZSBsZWZ0b3ZlciB2ZXJ0aWNhbFxuICAvLyBvZmZzZXQgYmV0d2VlbiBlZGl0IGFuZCByZWFkaW5nIGNvbnRlbnQgYXJlYXMuXG4gIGNvbnN0IHRvcENoYWluID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJ0czogeyBjbHM6IHN0cmluZzsgcGFkVG9wOiBzdHJpbmc7IG1hclRvcDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBhbmNob3I7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICBjbHM6IG5vZGUuY2xhc3NOYW1lIHx8IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBwYWRUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgIG1hclRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgfSk7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFydHM7XG4gIH0pKCk7XG5cbiAgLy8gVGl0bGUgcHJvYmU6IHRoZSBnZW5lcmF0ZWQgOjpiZWZvcmUgaW4gU2xpZGVzIG1vZGUgKHdoZW4gYSB0aXRsZSBpc1xuICAvLyBjb25maWd1cmVkKS4gQ2FwdHVyZXMgaXRzIGNvbXB1dGVkIHN0eWxlIHNvIHdlIGNhbiBkaWZmIGl0IGFnYWluc3QgdGhlXG4gIC8vIGJvZHkgSDEgKC5jbS1oZWFkZXItMSkgYW5kIGFsaWduIHRoZW0gZXhhY3RseS5cbiAgY29uc3QgdGl0bGVCZWZvcmUgPSAoKCkgPT4ge1xuICAgIGlmICghaXNFZGl0KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgICBpZiAoIWNvbnRlbnQgfHwgIWNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQsIFwiOjpiZWZvcmVcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNzLmNvbnRlbnQsXG4gICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgcG9zaXRpb246IGNzLnBvc2l0aW9uLFxuICAgICAgdG9wOiBjcy50b3AsXG4gICAgICBsZWZ0OiBjcy5sZWZ0LFxuICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgIGZvbnRGYW1pbHk6IGNzLmZvbnRGYW1pbHksXG4gICAgICBmb250U2l6ZTogY3MuZm9udFNpemUsXG4gICAgICBsaW5lSGVpZ2h0OiBjcy5saW5lSGVpZ2h0LFxuICAgICAgZm9udFdlaWdodDogY3MuZm9udFdlaWdodCxcbiAgICAgIGZvbnRWYXJpYW50OiBjcy5mb250VmFyaWFudCxcbiAgICAgIGNvbG9yOiBjcy5jb2xvcixcbiAgICAgIGxldHRlclNwYWNpbmc6IGNzLmxldHRlclNwYWNpbmcsXG4gICAgICB0ZXh0VHJhbnNmb3JtOiBjcy50ZXh0VHJhbnNmb3JtLFxuICAgICAgd29yZFNwYWNpbmc6IGNzLndvcmRTcGFjaW5nLFxuICAgICAgZm9udEtlcm5pbmc6IGNzLmZvbnRLZXJuaW5nLFxuICAgICAgZm9udEZlYXR1cmVTZXR0aW5nczogY3MuZm9udEZlYXR1cmVTZXR0aW5ncyxcbiAgICAgIGZvbnRWYXJpYW50TnVtZXJpYzogY3MuZm9udFZhcmlhbnROdW1lcmljLFxuICAgICAgZm9udFZhcmlhbnRMaWdhdHVyZXM6IGNzLmZvbnRWYXJpYW50TGlnYXR1cmVzLFxuICAgICAgZm9udFZhcmlhbnRDYXBzOiBjcy5mb250VmFyaWFudENhcHMsXG4gICAgfTtcbiAgfSkoKTtcblxuICBjb25zdCBkdW1wID0ge1xuICAgIG1vZGU6IGlzRWRpdCA/IFwiZWRpdCAoTGl2ZSBQcmV2aWV3KVwiIDogXCJyZWFkaW5nXCIsXG4gICAgLy8gU2xpZGVzIHN0eWxpbmcgb25seSBhcHBsaWVzIHdoZW4gU2xpZGVzIG1vZGUgaXMgb25cbiAgICBzbGlkZXNBY3RpdmU6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpLFxuICAgIGRvbVRhZ3M6IGlzRWRpdCA/IGRvbVRhZ3MgOiB1bmRlZmluZWQsXG4gICAgc291cmNlVmlld0NsYXNzOiBpc0VkaXQgPyBzb3VyY2VWaWV3Q2xhc3MgOiB1bmRlZmluZWQsXG4gICAgbGl2ZVByZXZpZXc6IGlzRWRpdCA/IGlzTGl2ZVByZXZpZXcoYXBwKSA6IHVuZGVmaW5lZCxcbiAgICBsaXN0TGluZXM6IGlzRWRpdCA/IGxpc3RMaW5lcyA6IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXk6IG1ldGFkYXRhRGlzcGxheSxcbiAgICBoMU9mZnNldFRvcDogaDFPZmZzZXRUb3AsXG4gICAgaDFUb3BJbkNvbnRlbnQ6IGgxVG9wSW5Db250ZW50LFxuICAgIGgxTGVmdEluQ29udGVudDogaDFMZWZ0SW5Db250ZW50LFxuICAgIGNvbnRlbnRDaGlsZHJlbjogY29udGVudENoaWxkcmVuLFxuICAgIHRvcENoYWluOiB0b3BDaGFpbixcbiAgICB0aXRsZTogdGl0bGVCZWZvcmUsXG4gICAgY29udGFpbmVyOiBzdHlsZShjb250YWluZXIsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1heC13aWR0aFwiLFxuICAgICAgXCJ3aWR0aFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgcGFyYWdyYXBoOiBzdHlsZShwYXJhLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBoMTogc3R5bGUoaDEsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcImZvbnQtd2VpZ2h0XCIsXG4gICAgICBcImZvbnQtdmFyaWFudFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJsZXR0ZXItc3BhY2luZ1wiLFxuICAgICAgXCJ0ZXh0LXRyYW5zZm9ybVwiLFxuICAgICAgXCJ3b3JkLXNwYWNpbmdcIixcbiAgICAgIFwiZm9udC1rZXJuaW5nXCIsXG4gICAgICBcImZvbnQtZmVhdHVyZS1zZXR0aW5nc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbnVtZXJpY1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbGlnYXR1cmVzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1jYXBzXCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgbGlzdEl0ZW06IHN0eWxlKGxpc3RJdGVtLCBbXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGNvZGVCbG9jazogc3R5bGUocHJlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICBibG9ja3F1b3RlOiBzdHlsZShxdW90ZSwgW1xuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwiYm9yZGVyLWxlZnQtd2lkdGhcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgIF0pLFxuICAgIGlubGluZUNvZGU6IHN0eWxlKGlubGluZUNvZGUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIHRhYmxlOiBzdHlsZSh0YWJsZSwgW1wiZm9udC1zaXplXCIsIFwibGluZS1oZWlnaHRcIiwgXCJ3aWR0aFwiLCBcImJvcmRlci1jb2xsYXBzZVwiXSksXG4gICAgaW1hZ2U6IHN0eWxlKGltZywgW1wiZGlzcGxheVwiLCBcIm1hcmdpbi1sZWZ0XCIsIFwibWFyZ2luLXJpZ2h0XCIsIFwibWF4LXdpZHRoXCIsIFwid2lkdGhcIl0pLFxuICAgIGhvcml6b250YWxSdWxlOiBzdHlsZShociwgW1wibWFyZ2luLXRvcFwiLCBcIm1hcmdpbi1ib3R0b21cIiwgXCJib3JkZXItdG9wLXdpZHRoXCIsIFwiaGVpZ2h0XCJdKSxcbiAgICBjc3NWYXJpYWJsZXM6IHtcbiAgICAgIFwiLS1mb250LXRleHRcIjogY3NzVmFyKFwiLS1mb250LXRleHRcIiksXG4gICAgICBcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCI6IGNzc1ZhcihcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCIpLFxuICAgICAgXCItLWgxLXNpemVcIjogY3NzVmFyKFwiLS1oMS1zaXplXCIpLFxuICAgICAgXCItLWgxLWxpbmUtaGVpZ2h0XCI6IGNzc1ZhcihcIi0taDEtbGluZS1oZWlnaHRcIiksXG4gICAgICBcIi0taDEtd2VpZ2h0XCI6IGNzc1ZhcihcIi0taDEtd2VpZ2h0XCIpLFxuICAgICAgXCItLWgxLXZhcmlhbnRcIjogY3NzVmFyKFwiLS1oMS12YXJpYW50XCIpLFxuICAgICAgXCItLWgxLWNvbG9yXCI6IGNzc1ZhcihcIi0taDEtY29sb3JcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLXRvcFwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi10b3BcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLWJvdHRvbVwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi1ib3R0b21cIiksXG4gICAgICBcIi0tcC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tcC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3Qtc3BhY2luZ1wiOiBjc3NWYXIoXCItLWxpc3Qtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LWluZGVudFwiOiBjc3NWYXIoXCItLWxpc3QtaW5kZW50XCIpLFxuICAgICAgXCItLWNvZGUtc2l6ZVwiOiBjc3NWYXIoXCItLWNvZGUtc2l6ZVwiKSxcbiAgICAgIFwiLS1jb2RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1jb2RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tY29kZS1yYWRpdXNcIjogY3NzVmFyKFwiLS1jb2RlLXJhZGl1c1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCIpLFxuICAgICAgXCItLWZpbGUtbWFyZ2luc1wiOiBjc3NWYXIoXCItLWZpbGUtbWFyZ2luc1wiKSxcbiAgICAgIFwiLS1maWxlLWxpbmUtd2lkdGhcIjogY3NzVmFyKFwiLS1maWxlLWxpbmUtd2lkdGhcIiksXG4gICAgICBcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiOiBjc3NWYXIoXCItLW5vcm1hbC1mb250LXNpemVcIiksXG4gICAgICBcIi0tZm9udC10ZXh0LXNpemVcIjogY3NzVmFyKFwiLS1mb250LXRleHQtc2l6ZVwiKSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gZHVtcDtcbn1cblxuLyoqXG4gKiBEZWJ1ZyB0eXBvZ3JhcGh5OiBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgKGVhY2hcbiAqIGNvdmVyaW5nIGEgZ3JvdXAgb2YgZWxlbWVudHMgXHUyMDE0IGFsbCB2aXNpYmxlIHdpdGhvdXQgc2Nyb2xsaW5nKSxcbiAqIHRoZW4gdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldyAobm8gdmlydHVhbGl6YXRpb25cbiAqIHRoZXJlKSwgbWVyZ2VzIGV2ZXJ5dGhpbmcsIGNvbXB1dGVzIHRoZSBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmRcbiAqIHdyaXRlcyBpdCB0byAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LlxuICogVGhlIHVzZXIncyBvd24gbm90ZSBpcyByZXN0b3JlZCBhdCB0aGUgZW5kLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHVtcFR5cG9ncmFwaHkocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYXBwID0gcGx1Z2luLmFwcDtcbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBubyBhY3RpdmUgTWFya2Rvd24gbm90ZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc3RhcnRNb2RlID0gdmlldy5nZXRNb2RlKCk7XG4gIGNvbnN0IGFjdGl2ZUZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgY29uc3QgbGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG5cbiAgLy8gRWRpdCBzaWRlOiBlYWNoIHNob3J0IG5vdGUga2VlcHMgZXZlcnkgdGFyZ2V0IGVsZW1lbnQgb24gc2NyZWVuXG4gIGNvbnN0IGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBTQU1QTEVfTk9URV9OQU1FUykge1xuICAgIGNvbnN0IGYgPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGB0ZXN0cy8ke25hbWV9Lm1kYCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg1MDApO1xuICAgIGNvbnN0IHMgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgICBpZiAocykgbWVyZ2VTYW1wbGUoZWRpdCwgcyk7XG4gIH1cblxuICAvLyBSZWFkaW5nIHNpZGU6IHRoZSBraXRjaGVuLXNpbmsgbm90ZSByZW5kZXJzIGV2ZXJ5dGhpbmcgYXQgb25jZVxuICBsZXQgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZGVtbyA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCJ0ZXN0cy90eXBvZ3JhcGh5LWRlbW8ubWRcIik7XG4gIGlmIChkZW1vIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGRlbW8sIHsgc3RhdGU6IHsgbW9kZTogXCJwcmV2aWV3XCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg4MDApO1xuICAgIHJlYWRpbmcgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgdGhlIHVzZXIncyBub3RlXG4gIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShhY3RpdmVGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IHN0YXJ0TW9kZSB9IH0pO1xuICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cbiAgaWYgKCFyZWFkaW5nKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IHJlYWRpbmcgc2FtcGxlIGZhaWxlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXlsb2FkID0geyBlZGl0LCByZWFkaW5nLCBkaWZmOiBkaWZmRHVtcHMoZWRpdCwgcmVhZGluZykgfTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci53cml0ZShcIi5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb25cIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMikpO1xuICAgIG5ldyBOb3RpY2UoXCJUeXBvZ3JhcGh5IGR1bXAgXHUyMTkyIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gKHZhdWx0IHJvb3QpXCIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCB3cml0ZSBkZWJ1ZyBmaWxlICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG5cbi8qKiBSZWdpc3RlciB0aGUgZGV2LW9ubHkgZGVidWcgY29tbWFuZCAoY2FsbGVkIG9ubHkgd2hlbiBERVZfTU9ERSBpcyB0cnVlKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtZGVidWctc3R5bGVzXCIsXG4gICAgbmFtZTogXCJEZWJ1ZzogZHVtcCB0eXBvZ3JhcGh5IHN0eWxlc1wiLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbiksXG4gIH0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTW9kZSBvZiB0aGUgYWN0aXZlIE1hcmtkb3duIHZpZXc6ICdwcmV2aWV3Jz1yZWFkaW5nICdzb3VyY2UnPWVkaXRpbmcgJyc9bm9uZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRNb2RlKGFwcDogQXBwKTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiIHwgXCJcIiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgcmV0dXJuIHZpZXcgPyB2aWV3LmdldE1vZGUoKSA6IFwiXCI7XG59XG5cbi8qKlxuICogVHJ1ZSB3aGVuIHRoZSBhY3RpdmUgZWRpdCB2aWV3IGlzIExpdmUgUHJldmlldyAoU2xpZGVzKSBcdTIwMTQgYXNcbiAqIG9wcG9zZWQgdG8gU291cmNlIG1vZGUuIE9ic2lkaWFuIHJlcG9ydHMgYm90aCBhcyBtb2RlIFwic291cmNlXCI7XG4gKiB0aGUgdmlldyBzdGF0ZSBjYXJyaWVzIGEgYHNvdXJjZWAgZmxhZyAoU291cmNlIG1vZGUgPSB0cnVlKSwgd2l0aFxuICogYSBET00gY2xhc3MgZmFsbGJhY2sgKC5pcy1saXZlLXByZXZpZXcpIGZvciBzYWZldHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xpdmVQcmV2aWV3KGFwcDogQXBwKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSBcInNvdXJjZVwiKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN0YXRlID0gdmlldy5nZXRTdGF0ZSgpIGFzIHsgc291cmNlPzogYm9vbGVhbiB9O1xuICBpZiAoc3RhdGUuc291cmNlID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IGZhbHNlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICEhdmlldy5jb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202LmlzLWxpdmUtcHJldmlld1wiKTtcbn1cblxuLyoqIEZyb250bWF0dGVyIG9mIGFueSBub3RlIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb250bWF0dGVyT2YoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIHJldHVybiBjYWNoZT8uZnJvbnRtYXR0ZXIgPz8gbnVsbDtcbn1cblxuLyoqIEN1cnJlbnQgbm90ZSdzIGZyb250bWF0dGVyIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2ZUZyb250bWF0dGVyKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgZmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICByZXR1cm4gZmlsZSA/IGZyb250bWF0dGVyT2YoYXBwLCBmaWxlKSA6IG51bGw7XG59XG4iLCAiLyoqIEEgYnVpbHQtaW4gU2xpZGVzIHN0eWxlIHRlbXBsYXRlIChyZW5kZXJlZCBhcyBib2R5IGNsYXNzIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gKSAqL1xuZXhwb3J0IGludGVyZmFjZSBTbGlkZXNUaGVtZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbi8qKiBCdWlsdC1pbiBzdHlsZSB0ZW1wbGF0ZXMgZm9yIHRoZSBTbGlkZXMgY2FyZCArIGJhciAoYWxsIHRoZW1lLWFkYXB0aXZlKSAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19USEVNRVM6IHJlYWRvbmx5IFNsaWRlc1RoZW1lW10gPSBbXG4gIHsgaWQ6IFwianl5XCIsIGxhYmVsOiBcIkxlY3R1cmUgKGp5eSlcIiB9LFxuICB7IGlkOiBcImRhc2hlZFwiLCBsYWJlbDogXCJEYXNoZWQgb3V0bGluZVwiIH0sXG4gIHsgaWQ6IFwicGFwZXJcIiwgbGFiZWw6IFwiUGFwZXIgY2FyZFwiIH0sXG4gIHsgaWQ6IFwibWluaW1hbFwiLCBsYWJlbDogXCJNaW5pbWFsXCIgfSxcbiAgeyBpZDogXCJhY2NlbnRcIiwgbGFiZWw6IFwiQWNjZW50IGVkZ2VcIiB9LFxuICB7IGlkOiBcImdsYXNzXCIsIGxhYmVsOiBcIkZyb3N0ZWQgZ2xhc3NcIiB9LFxuXTtcblxuLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB7XG4gIC8qKiBTaG93IFx1MjVDMCBcdTI1QjYgcHJldmlvdXMvbmV4dCBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dOYXZCdXR0b25zOiBib29sZWFuO1xuICAvKiogUGFnZSBudW1iZXIgZGlzcGxheSBzdHlsZTogXCJmcmFjdGlvblwiID0gTiAvIFRvdGFsLCBcImN1cnJlbnRcIiA9IE4sIFwibm9uZVwiID0gaGlkZGVuICovXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgLyoqIFNob3cgYSB0aGluIGNsaWNrYWJsZSBwcm9ncmVzcyBsaW5lIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd1Byb2dyZXNzOiBib29sZWFuO1xuICAvKiogU2hvdyB0aGUgZW50aXJlIHNsaWRlcyBiYXIgKG1hc3RlciB0b2dnbGUpICovXG4gIHNob3dTbGlkZXNCYXI6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIG1hbnVhbGx5IGhpZCB0aGUgc2xpZGVzIGJhciAodG9nZ2xlIGNvbW1hbmQpICovXG4gIGJhckhpZGRlbjogYm9vbGVhbjtcbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgd2hlbiBvcGVuaW5nIGEgZGVjayBub3RlIChkZWZhdWx0IG9mZikgKi9cbiAgYXV0b0VudGVyU2xpZGVzOiBib29sZWFuO1xuICAvKiogUHJlc3MgRXNjYXBlIHRvIGV4aXQgU2xpZGVzIG1vZGUgKGRlZmF1bHQgb24pICovXG4gIGVzY0V4aXRzU2xpZGVzOiBib29sZWFuO1xuICAvKiogRnJvbnRtYXR0ZXIgcHJvcGVydHkgc2hvd24gYXMgdGhlIGNhcmQgdGl0bGUgKFwiXCIgPSBub25lLCBcImZpbGVuYW1lXCIgPSBmaWxlIG5hbWUpICovXG4gIHNsaWRlc1RpdGxlOiBzdHJpbmc7XG4gIC8qKiBTdHlsZSB0ZW1wbGF0ZSBpZCBmcm9tIFNMSURFU19USEVNRVMgKGNhcmQgKyBiYXIgYXBwZWFyYW5jZSkgKi9cbiAgc2xpZGVzVGhlbWU6IHN0cmluZztcbiAgLyoqIENvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyBmb3IgdGhlIHNsaWRlcyBiYXIgKGVtcHR5ID0gbm9uZSkgKi9cbiAgYmFyUHJvcGVydGllczogc3RyaW5nO1xuICAvKiogSlNPTiBhcnJheSBvZiBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIGJhciBwcm9wZXJ0aWVzIChkcmFnZ2FibGUgZGl2aWRlcnMpICovXG4gIGJhclByb3BlcnR5V2lkdGhzOiBzdHJpbmc7XG4gIC8qKiBBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHBhbmVsIChkZWZhdWx0IG9uKSAqL1xuICBjb25maXJtRGVsZXRlU2xpZGVzOiBib29sZWFuO1xuICAvKipcbiAgICogQmxvY2sgaW1hZ2UgZW1iZWRzIGFzIGNlbnRlcmVkIGNhcmQgYmxvY2tzIChkZWZhdWx0IG9uKS4gV2hlbiBvZmYsXG4gICAqIGltYWdlcyBrZWVwIE9ic2lkaWFuJ3MgbmF0aXZlIGlubGluZSBmbG93IFx1MjAxNCB0ZXh0IGZsb3dzIGFyb3VuZC9iZXNpZGVcbiAgICogdGhlbSBleGFjdGx5IGxpa2UgTGl2ZSBQcmV2aWV3IG91dHNpZGUgU2xpZGVzIG1vZGUuXG4gICAqL1xuICBpbWFnZUxheW91dDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0ge1xuICBzaG93TmF2QnV0dG9uczogdHJ1ZSxcbiAgcGFnZU51bWJlclN0eWxlOiBcIm5vbmVcIixcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBzaG93U2xpZGVzQmFyOiB0cnVlLFxuICBiYXJIaWRkZW46IGZhbHNlLFxuICBhdXRvRW50ZXJTbGlkZXM6IGZhbHNlLFxuICBlc2NFeGl0c1NsaWRlczogdHJ1ZSxcbiAgc2xpZGVzVGl0bGU6IFwiXCIsXG4gIHNsaWRlc1RoZW1lOiBcImp5eVwiLFxuICBiYXJQcm9wZXJ0aWVzOiBcIlwiLFxuICBiYXJQcm9wZXJ0eVdpZHRoczogXCJcIixcbiAgY29uZmlybURlbGV0ZVNsaWRlczogdHJ1ZSxcbiAgaW1hZ2VMYXlvdXQ6IHRydWUsXG59O1xuXG4vKiogUmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5IGRyaXZpbmcgZGVjayBuYXZpZ2F0aW9uIChuZXZlciByZW5kZXJlZCBhcyBhIGNoaXApICovXG5leHBvcnQgY29uc3QgREVDS19LRVkgPSBcImRlY2tcIjtcbiIsICJpbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IHJlZ2lzdGVyRGVidWdDb21tYW5kIH0gZnJvbSBcIi4vZGVidWdcIjtcbmltcG9ydCB7IGZyb250bWF0dGVyT2YgfSBmcm9tIFwiLi9tb2RlXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZWdpc3RlciBldmVyeSBjb21tYW5kOyB0aGUgZGVidWcgY29tbWFuZCBpcyBkZXYtYnVpbGQgb25seS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbW1hbmRzKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIC8vIFRvZ2dsZSB0aGUgc2xpZGVzIGJhciAod2l0aGluIFNsaWRlcyBtb2RlKVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLWJhclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIHNsaWRlcyBiYXJcIixcbiAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbiA9ICFwbHVnaW4uc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgcGx1Z2luLnJlZnJlc2goKTtcbiAgICB9LFxuICB9KTtcbiAgLy8gU2hvdyB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgc2xpZGUgbGlzdClcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXNob3ctcGFuZWxcIixcbiAgICBuYW1lOiBcIlNob3cgc2xpZGVzIHBhbmVsXCIsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgcGx1Z2luLmFjdGl2YXRlU2xpZGVzUGFuZWwoKSxcbiAgfSk7XG4gIC8vIEhpZGUgLyBzaG93IHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIChwcmVzZW50aW5nOyBTbGlkZXMgbW9kZSBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLXBvaW50ZXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBtb3VzZSBwb2ludGVyXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIk1cIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVQb2ludGVyKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gUHJldmlvdXMgLyBuZXh0IHBhZ2UgKGRlY2sgbmF2aWdhdGlvbjsgZW50ZXJpbmcgU2xpZGVzIG1vZGUgYXMgbmVlZGVkKVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtcHJldlwiLFxuICAgIG5hbWU6IFwiUHJldmlvdXMgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd0xlZnRcIiB9XSxcbiAgICBjYWxsYmFjazogKCkgPT4gcGx1Z2luLm5hdmlnYXRlKFwicHJldlwiKSxcbiAgfSk7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1uZXh0XCIsXG4gICAgbmFtZTogXCJOZXh0IHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dSaWdodFwiIH1dLFxuICAgIGNhbGxiYWNrOiAoKSA9PiBwbHVnaW4ubmF2aWdhdGUoXCJuZXh0XCIpLFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5leHQgU2xpZGUgXHUyMDE0IG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBvbmUgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXh0XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV4dCBzbGlkZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJOXCIgfV0sXG4gICAgLy8gR3JleWVkIG91dCB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGlzIHBhcnQgb2YgYSBkZWNrIFx1MjAxNCBwbGFpbiBub3Rlc1xuICAgIC8vIHN0YXJ0IGRlY2tzIHdpdGggXCJDcmVhdGUgbmV3IHNsaWRlXCIgaW5zdGVhZC5cbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5ldyBTbGlkZSBcdTIwMTQgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgKG5vbi1kZWNrIG5vdGVzIG9ubHk7XG4gIC8vIGFsc28gd29ya3MgZnJvbSBhIGJsYW5rIHRhYiBcdTIwMTQgbGFuZHMgaW4gdGhlIGRlZmF1bHQgbmV3LW5vdGUgbG9jYXRpb24pXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jcmVhdGUtbmV3XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV3IHNsaWRlXCIsXG4gICAgLy8gTm8gZGVmYXVsdCBob3RrZXk6IE1vZCtTaGlmdCtOIGJlbG9uZ3MgdG8gQ3JlYXRlIG5leHQgc2xpZGUgXHUyMDE0IHR3b1xuICAgIC8vIGNvbW1hbmRzIHNoYXJpbmcgb25lIGRlZmF1bHQgaG90a2V5IHRyaXBzIE9ic2lkaWFuJ3MgY29uZmxpY3QgVUkuXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgcGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXcocGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXcoKSksXG4gIH0pO1xuICAvLyBUb2dnbGUgU2xpZGVzIG1vZGUgXHUyMDE0IHRoZSBpbW1lcnNpdmUgY2FyZCB2aWV3IChkZWNrIG5vdGVzIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtc2xpZGVzXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIG1vZGVcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiRVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHBsdWdpbi5hcHAsIGZpbGUpO1xuICAgICAgaWYgKGZtID09PSBudWxsIHx8ICEoREVDS19LRVkgaW4gZm0pKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSBwbHVnaW4udG9nZ2xlU2xpZGVzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gRGVidWcgdG9vbGluZyBcdTIwMTQgcmVnaXN0ZXJlZCBvbmx5IGluIGRldiBidWlsZHMgKHRyZWUtc2hha2VuIGluIHJlbGVhc2UpXG4gIGlmIChERVZfTU9ERSkgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQocGx1Z2luKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7XG4gIHBsYW5DcmVhdGVOZXcgYXMgcGxhbk5ldyxcbiAgcGxhbkNyZWF0ZU5leHQgYXMgcGxhbixcbiAgdHlwZSBDcmVhdGVOZXh0UmVzdWx0LFxufSBmcm9tIFwiLi9jcmVhdGVOZXh0XCI7XG5pbXBvcnQgeyBjb21wdXRlRGVjaywgZXh0cmFjdExpbmtzLCBleHRyYWN0UmF3TGlua3MsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5pbXBvcnQgeyBwaWNrTGFuZGluZ1BhdGgsIHBsYW5EZWxldGVTbGlkZXMgfSBmcm9tIFwiLi9kZWxldGVTbGlkZXNcIjtcbmltcG9ydCB7IGZyb250bWF0dGVyT2YgfSBmcm9tIFwiLi9tb2RlXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZXN1bHQgb2YgYSBEZWxldGUgc2xpZGVzIHJ1biAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVTbGlkZXNSZXN1bHQge1xuICAvKiogUGF0aHMgYWN0dWFsbHkgbW92ZWQgdG8gdGhlIHRyYXNoICovXG4gIHRyYXNoZWQ6IHN0cmluZ1tdO1xuICAvKiogV2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlcndhcmRzIChudWxsID0ga2VlcCBjdXJyZW50IG5vdGUpICovXG4gIGxhbmRpbmdQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjazogaXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW5cbiAgICogZW1wdHkgXHUyMDE0IGEgZnJlc2ggc2luZ2xlIHNsaWRlKSBvciBzb21lIG90aGVyIHNsaWRlIGRlY2xhcmVzIGl0IGFzIGl0c1xuICAgKiBuZXh0IHNsaWRlLlxuICAgKi9cbiAgaXNNZW1iZXIoZmlsZTogVEZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiAoZm0gIT09IG51bGwgJiYgREVDS19LRVkgaW4gZm0pIHx8IHRoaXMucHJldk9mKGZpbGUucGF0aCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBjdXJyZW50IG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2sgKG51bGwgd2hlbiBub3QgYSBtZW1iZXIpICovXG4gIGNvbXB1dGUoZmlsZTogVEZpbGUpOiBEZWNrSW5mbyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc01lbWJlcihmaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGNvbXB1dGVEZWNrKFxuICAgICAgZmlsZS5wYXRoLFxuICAgICAgKHBhdGgpID0+IHRoaXMubGlua1BhdGhzKHBhdGgpLFxuICAgICAgKHBhdGgpID0+IHRoaXMucHJldk9mKHBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogUmVzb2x2ZSB0aGUgYGRlY2tgIHByb3BlcnR5IG9mIGEgbm90ZSBpbnRvIHJlYWwgbm90ZSBwYXRocyAobWF4IG9uZSkgKi9cbiAgcHJpdmF0ZSBsaW5rUGF0aHMocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuIFtdO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZik7XG4gICAgY29uc3QgbmFtZXMgPSBmbSA/IGV4dHJhY3RMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgcmV0dXJuIG5hbWVzXG4gICAgICAubWFwKChuYW1lKSA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KG5hbWUsIHBhdGgpKVxuICAgICAgLmZpbHRlcigoeCk6IHggaXMgVEZpbGUgPT4gISF4KVxuICAgICAgLm1hcCgoeCkgPT4geC5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodGhlIHByZXZpb3VzIHNsaWRlIGluXG4gICAqIHRoZSBjaGFpbikuIFdpdGggbmV4dC1vbmx5IHNlbWFudGljcyB0aGlzIGJhY2t3YXJkIGxvb2t1cCBpcyB0aGUgb25seVxuICAgKiB3YXkgdG8gcmVhY2ggdGhlIGNoYWluIGhlYWQgZnJvbSBhIG1pZGRsZS9sYXN0IHNsaWRlLlxuICAgKi9cbiAgcHJpdmF0ZSBwcmV2T2YocGF0aDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAoZi5wYXRoID09PSBwYXRoKSBjb250aW51ZTtcbiAgICAgIGlmICh0aGlzLmxpbmtQYXRocyhmLnBhdGgpWzBdID09PSBwYXRoKSByZXR1cm4gZi5wYXRoO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIE5hbWVzIGluIHRoZSBgZGVja2AgcHJvcGVydHkgdGhhdCByZXNvbHZlIHRvIG5vIG5vdGUgKGJyb2tlbiBsaW5rcykgKi9cbiAgYnJva2VuKGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgY29uc3QgbmFtZXMgPSBmbSA/IGV4dHJhY3RMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgcmV0dXJuIG5hbWVzLmZpbHRlcigobmFtZSkgPT4gIXRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgZmlsZS5wYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiBydW4gZm9yIHRoZSBhY3RpdmUgbm90ZS4gRGVjayBzbGlkZXNcbiAgICogaW5zZXJ0L2FwcGVuZCBhZnRlciB0aGUgY3VycmVudCBub3RlLiAoUGxhaW4gbm90ZXMgYXJlIHJvdXRlZCB0b1xuICAgKiBwbGFuQ3JlYXRlTmV3IGJ5IHRoZSBjb21tYW5kIFx1MjAxNCB0aGlzIGNvcmUgc3RpbGwgaGFuZGxlcyB0aGVtIGFzXG4gICAqIFwibm8gdXNhYmxlIG5leHQgbGluayBcdTIxOTIgYXBwZW5kXCIuKVxuICAgKi9cbiAgcGxhbkNyZWF0ZU5leHQoZmlsZTogVEZpbGUpOiBDcmVhdGVOZXh0UmVzdWx0IHwgbnVsbCB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCByYXcgPSBmbSA/IGV4dHJhY3RSYXdMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuKHsgY3VycmVudE5hbWU6IGZpbGUuYmFzZW5hbWUsIGN1cnJlbnRMaW5rczogcmF3LCBleGlzdGluZ05hbWVzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYW4gYSBcIkNyZWF0ZSBOZXcgU2xpZGVcIiBydW46IGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIGluIHRoZVxuICAgKiBzYW1lIGZvbGRlciBhcyB0aGUgYWN0aXZlIG5vdGUsIHdoaWNoIGl0c2VsZiBzdGF5cyB1bnRvdWNoZWQuXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV3KCk6IENyZWF0ZU5leHRSZXN1bHQge1xuICAgIGNvbnN0IGV4aXN0aW5nTmFtZXMgPSBuZXcgU2V0KHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKS5tYXAoKGYpID0+IGYuYmFzZW5hbWUpKTtcbiAgICByZXR1cm4gcGxhbk5ldyh7IGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKiogQXBwbHkgYSBDcmVhdGUgTmV4dCBTbGlkZSBwbGFuOyBvcGVuPWZhbHNlIGtlZXBzIHRoZSBjdXJyZW50IG5vdGUgaW4gdGhlIGVkaXRvciAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV4dChmaWxlOiBURmlsZSwgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCwgb3BlbiA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmFwcGx5UGxhbihmaWxlLCBwbGFuLCBkaXJQcmVmaXgoZmlsZS5wYXJlbnQ/LnBhdGgpLCBvcGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhIENyZWF0ZSBOZXcgU2xpZGUgcGxhbi4gTGFuZHMgaW4gT2JzaWRpYW4ncyBkZWZhdWx0IG5ldy1ub3RlXG4gICAqIGxvY2F0aW9uIChTZXR0aW5ncyBcdTIxOTIgRmlsZXMgJiBsaW5rcyBcdTIxOTIgRGVmYXVsdCBsb2NhdGlvbiBmb3IgbmV3IG5vdGVzKTtcbiAgICogd2l0aCBcInNhbWUgZm9sZGVyIGFzIGN1cnJlbnRcIiBjb25maWd1cmVkIHRoYXQgaXMgdGhlIGFjdGl2ZSBub3RlJ3Mgb3duXG4gICAqIGZvbGRlci4gV29ya3Mgd2l0aCBubyBub3RlIG9wZW4gYXQgYWxsIChibGFuayB0YWIpLlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZUNyZWF0ZU5ldyhwbGFuOiBDcmVhdGVOZXh0UmVzdWx0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc291cmNlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gXCJcIjtcbiAgICBhd2FpdCB0aGlzLmFwcGx5UGxhbihcbiAgICAgIG51bGwsXG4gICAgICBwbGFuLFxuICAgICAgZGlyUHJlZml4KHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmdldE5ld0ZpbGVQYXJlbnQoc291cmNlUGF0aCk/LnBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogQXBwbHkgYSBwbGFuOiBjcmVhdGUgdGhlIG5vdGUsIHJld2lyZSBgZGVja2AgcHJvcGVydGllcywgb3B0aW9uYWxseSBvcGVuIGl0ICovXG4gIHByaXZhdGUgYXN5bmMgYXBwbHlQbGFuKFxuICAgIGZpbGU6IFRGaWxlIHwgbnVsbCxcbiAgICBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LFxuICAgIGRpcjogc3RyaW5nLFxuICAgIG9wZW4gPSB0cnVlLFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBuZXdQYXRoID0gYCR7ZGlyfSR7cGxhbi5uZXdOYW1lfS5tZGA7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBwbGFuLm5ld0RlY2tMaW5rcy5tYXAoKGxpbmspID0+IEpTT04uc3RyaW5naWZ5KGxpbmspKS5qb2luKFwiLCBcIik7XG4gICAgY29uc3QgY29udGVudCA9IGAtLS1cXG5kZWNrOiBbJHtmcm9udG1hdHRlcn1dXFxuLS0tXFxuYDtcblxuICAgIGxldCBuZXdGaWxlOiBURmlsZTtcbiAgICB0cnkge1xuICAgICAgbmV3RmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShuZXdQYXRoLCBjb250ZW50KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IGNyZWF0ZSBcIiR7cGxhbi5uZXdOYW1lfS5tZFwiICgke1N0cmluZyhlcnJvcil9KWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJld2lyZSB0aGUgY3VycmVudCBub3RlJ3MgYGRlY2tgIChrZWVwcyBhbGwgb3RoZXIgcHJvcGVydGllcyBpbnRhY3QpXG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHBsYW4ucmV3cml0ZXMpIHtcbiAgICAgIGlmICghZmlsZSB8fCByZXdyaXRlLm5hbWUgIT09IGZpbGUuYmFzZW5hbWUpIGNvbnRpbnVlOyAvLyBpbiBwcmFjdGljZSBhbHdheXMgdGhlIGN1cnJlbnQgbm90ZVxuICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgICAgZm1bREVDS19LRVldID0gcmV3cml0ZS5kZWNrO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFvcGVuKSByZXR1cm47XG5cbiAgICAvLyBPcGVuIHRoZSBuZXcgbm90ZSBpbiB0aGUgY3VycmVudCBwYW5lLCBlZGl0IG1vZGUgKExpdmUgUHJldmlldylcbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUobmV3RmlsZSwgeyBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0gfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHNsaWRlcyBvdXQgb2YgYW4gb3JkZXJlZCBkZWNrIGNoYWluOiBzcGxpY2UgdGhlIGNoYWluIGFyb3VuZFxuICAgKiBldmVyeSBkZWxldGVkIHJ1biAodGhlIHByZWRlY2Vzc29yJ3MgYGRlY2tgIHRha2VzIG92ZXIgdGhlIHJ1bidzIGZpcnN0XG4gICAqIHN1cnZpdm9yKSwgdGhlbiBtb3ZlIGVhY2ggZGVsZXRlZCBub3RlIHRvIHRoZSB0cmFzaC4gYGZvY3VzUGF0aGAgaXMgdGhlXG4gICAqIG5vdGUgdGhlIGVkaXRvciBjdXJyZW50bHkgc2hvd3MgXHUyMDE0IHdoZW4gaXQgaXMgYW1vbmcgdGhlIGRlbGV0ZWQsIHRoZVxuICAgKiByZXN1bHQgbmFtZXMgdGhlIG5lYXJlc3Qgc3Vydml2aW5nIG5laWdoYm91ciB0byBvcGVuIGluc3RlYWQuXG4gICAqL1xuICBhc3luYyBleGVjdXRlRGVsZXRlU2xpZGVzKFxuICAgIGNoYWluOiBzdHJpbmdbXSxcbiAgICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgICBmb2N1c1BhdGg6IHN0cmluZyB8IG51bGwsXG4gICk6IFByb21pc2U8RGVsZXRlU2xpZGVzUmVzdWx0PiB7XG4gICAgY29uc3QgcmV3cml0ZXMgPSBwbGFuRGVsZXRlU2xpZGVzKGNoYWluLCBkZWxldGVQYXRocyk7XG5cbiAgICBmb3IgKGNvbnN0IHJld3JpdGUgb2YgcmV3cml0ZXMpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmV3cml0ZS5wYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgbmV4dCA9IHJld3JpdGUubmV4dFBhdGggPyB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmV3cml0ZS5uZXh0UGF0aCkgOiBudWxsO1xuICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGYsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgICAgZm1bREVDS19LRVldID0gbmV4dCBpbnN0YW5jZW9mIFRGaWxlID8gW2BbWyR7bmV4dC5iYXNlbmFtZX1dXWBdIDogW107XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFzaGVkOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBkZWxldGVQYXRocykge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIGNvbnRpbnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIudHJhc2hGaWxlKGYpO1xuICAgICAgICB0cmFzaGVkLnB1c2gocGF0aCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgZGVsZXRlIFwiJHtmLmJhc2VuYW1lfVwiICgke1N0cmluZyhlcnJvcil9KWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHRyYXNoZWQsIGxhbmRpbmdQYXRoOiBwaWNrTGFuZGluZ1BhdGgoY2hhaW4sIGRlbGV0ZVBhdGhzLCBmb2N1c1BhdGgpIH07XG4gIH1cbn1cblxuLyoqIEZvbGRlciBwYXRoIFx1MjE5MiB0cmFpbGluZy1zbGFzaCBwcmVmaXggKFwiXCIgZm9yIHZhdWx0IHJvb3QpICovXG5mdW5jdGlvbiBkaXJQcmVmaXgocGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFwYXRoIHx8IHBhdGggPT09IFwiL1wiKSByZXR1cm4gXCJcIjtcbiAgcmV0dXJuIGAke3BhdGgucmVwbGFjZSgvXFwvKyQvLCBcIlwiKX0vYDtcbn1cbiIsICIvKipcbiAqIGRlY2sudHMgXHUyMDE0IFB1cmUgZGVjay1yZXNvbHV0aW9uIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRXZlcnl0aGluZyBpbiB0aGlzIG1vZHVsZSBpcyBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0XG4gKiBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L2RlY2sudGVzdC50cykuIG1haW4udHMgYWRhcHRzIHRoZVxuICogdmF1bHQgKG1ldGFkYXRhQ2FjaGUpIHRvIHRoaXMgcHVyZSBpbnRlcmZhY2U6IGl0IHJlc29sdmVzIGBkZWNrYFxuICogcHJvcGVydGllcyB0byBub3RlIHBhdGhzLCB0aGVuIGhhbmRzIHRoZSBwYXRoIGdyYXBoIHRvIGNvbXB1dGVEZWNrKCkuXG4gKi9cblxuLyoqIEEgZGVjayBsaW5rIGxpc3QgaG9sZHMgYXQgbW9zdCBvbmUgZW50cnkgKHRoZSBuZXh0IHNsaWRlKSAqL1xuZXhwb3J0IGNvbnN0IE1BWF9ERUNLX0xJTktTID0gMTtcblxuLyoqIFJlc3VsdCBvZiByZXNvbHZpbmcgYSBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGEgZGVjayAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWNrSW5mbyB7XG4gIC8qKiBDaGFpbiBvZiBub3RlIHBhdGhzOiBbMF0gaXMgdGhlIGZpcnN0IHNsaWRlLCB0aGVuIHRoZSByZXN0IGluIG9yZGVyICovXG4gIGNoYWluOiBzdHJpbmdbXTtcbiAgLyoqIEluZGV4IG9mIHRoZSBjdXJyZW50IG5vdGUgaW5zaWRlIGNoYWluICovXG4gIGluZGV4OiBudW1iZXI7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBhIG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2suXG4gKlxuICogdjEuMC4wIGNvbnZlbnRpb24gXHUyMDE0IG5leHQtb25seSwgbm8gb3ZlcnZpZXcgcGFnZTpcbiAqICAgLSBhIHNsaWRlJ3MgYGRlY2tgIHByb3BlcnR5IGhvbGRzIGF0IG1vc3QgT05FIGxpbms6IHRoZSBuZXh0IHNsaWRlXG4gKiAgICAgKHRoZSBsYXN0IHNsaWRlIGhhcyBubyBsaW5rIGF0IGFsbCk7XG4gKiAgIC0gYSBkZWNrIGlzIHNpbXBseSBhIGZvcndhcmQgbGluayBjaGFpbiBzdGFydGluZyBhdCBpdHMgaGVhZCBzbGlkZTtcbiAqICAgLSBhbnkgbm90ZSB0aGF0IGhvbGRzIGEgYGRlY2tgIHByb3BlcnR5IChldmVuIGVtcHR5KSBpcyBhIGRlY2sgbWVtYmVyLFxuICogICAgIHNvIGEgc2luZ2xlIGZyZXNobHkgY3JlYXRlZCBzbGlkZSBhbHJlYWR5IGNvdW50cyBhcyBhIG9uZS1wYWdlIGRlY2suXG4gKlxuICogQmVjYXVzZSBzbGlkZXMgbm8gbG9uZ2VyIGxpbmsgYmFjayB0byBhIGhlYWQgbm90ZSwgdGhlIGNoYWluIGhlYWQgaXNcbiAqIGxvY2F0ZWQgYnkgd2Fsa2luZyBiYWNrd2FyZDogYGdldFByZXYocGF0aClgIHJldHVybnMgdGhlIG5vdGUgd2hvc2VcbiAqIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh1bmRlZmluZWQgd2hlbiBub25lKS5cbiAqXG4gKiBgZ2V0TGlua3MocGF0aClgIG11c3QgcmV0dXJuIHRoZSByZXNvbHZlZCBub3RlIHBhdGhzIG9mIHRoZSBgZGVja2BcbiAqIHByb3BlcnR5IG9mIHRoZSBub3RlIGF0IGBwYXRoYCAoZW1wdHkgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSwgb3IgaXRzXG4gKiBsaW5rIGlzIGJyb2tlbiBcdTIwMTQgYSBicm9rZW4gbGluayBzaW1wbHkgZW5kcyB0aGUgY2hhaW4sIG5ldmVyIGNyYXNoZXMpLlxuICpcbiAqIFJldHVybnMgdGhlIGZ1bGwgY2hhaW4gYW5kIHRoZSBjdXJyZW50IG5vdGUncyBpbmRleCwgb3IgbnVsbCB3aGVuIHRoZVxuICogbm90ZSBpcyBub3QgcGFydCBvZiBhbnkgZGVjayAobm8gYGRlY2tgIHByb3BlcnR5IGFuZCBub2JvZHkgbGlua3MgdG8gaXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZURlY2soXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmcsXG4gIGdldExpbmtzOiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmdbXSxcbiAgZ2V0UHJldjogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nIHwgdW5kZWZpbmVkLFxuKTogRGVja0luZm8gfCBudWxsIHtcbiAgLy8gV2FsayBiYWNrd2FyZCB0byB0aGUgY2hhaW4gaGVhZCAoY3ljbGUtZ3VhcmRlZCkuIEEgbG9uZSBub2RlIChubyBvd25cbiAgLy8gbGluaywgbm8gcHJlZGVjZXNzb3IpIHJlc29sdmVzIGFzIGEgb25lLXBhZ2UgY2hhaW4gXHUyMDE0IHdoZXRoZXIgaXQgY291bnRzXG4gIC8vIGFzIGEgZGVjayBtZW1iZXIgYXQgYWxsIGlzIGRlY2lkZWQgYnkgdGhlIGFkYXB0ZXIgKHRoZSBgZGVja2Aga2V5KS5cbiAgY29uc3QgYmFja1Zpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oW2N1cnJlbnRQYXRoXSk7XG4gIGxldCBoZWFkID0gY3VycmVudFBhdGg7XG4gIGZvciAoOzspIHtcbiAgICBjb25zdCBwcmV2ID0gZ2V0UHJldihoZWFkKTtcbiAgICBpZiAoIXByZXYgfHwgYmFja1Zpc2l0ZWQuaGFzKHByZXYpKSBicmVhaztcbiAgICBiYWNrVmlzaXRlZC5hZGQocHJldik7XG4gICAgaGVhZCA9IHByZXY7XG4gIH1cblxuICAvLyBXYWxrIGZvcndhcmQgZnJvbSB0aGUgaGVhZCAoY3ljbGUtZ3VhcmRlZCkuXG4gIGNvbnN0IGNoYWluOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB2aXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGxldCBjdXI6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGhlYWQ7XG4gIHdoaWxlIChjdXIgJiYgIXZpc2l0ZWQuaGFzKGN1cikpIHtcbiAgICB2aXNpdGVkLmFkZChjdXIpO1xuICAgIGNoYWluLnB1c2goY3VyKTtcbiAgICBjdXIgPSBnZXRMaW5rcyhjdXIpWzBdO1xuICB9XG5cbiAgY29uc3QgaW5kZXggPSBjaGFpbi5pbmRleE9mKGN1cnJlbnRQYXRoKTtcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7IGNoYWluLCBpbmRleCB9O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgbm90ZSBuYW1lcyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlLlxuICogQWNjZXB0cyBhIHNpbmdsZSBzdHJpbmcgb3IgYSBZQU1MIGxpc3Qgb2Ygc3RyaW5nczsgdW5xdW90ZWQgW1t4XV0gdmFsdWVzXG4gKiBhcmUgcGFyc2VkIGJ5IFlBTUwgYXMgbmVzdGVkIGFycmF5cyBhbmQgZmxhdHRlbmVkIGhlcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0TGlua3ModmFsdWU6IHVua25vd24sIG1heDogbnVtYmVyID0gTUFYX0RFQ0tfTElOS1MpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGZsYXQ6IHVua25vd25bXSA9IFtdO1xuICBjb25zdCBjb2xsZWN0ID0gKHY6IHVua25vd24pOiB2b2lkID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHYpIGNvbGxlY3QoaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsYXQucHVzaCh2KTtcbiAgICB9XG4gIH07XG4gIGNvbGxlY3QodmFsdWUpO1xuXG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGZsYXQpIHtcbiAgICBjb25zdCBuYW1lID0gZXh0cmFjdExpbmtUZXh0KGl0ZW0pO1xuICAgIGlmIChuYW1lKSBvdXQucHVzaChuYW1lKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB1cCB0byBgbWF4YCByYXcgbGluayBzdHJpbmdzIGZyb20gYSBgZGVja2AgcHJvcGVydHkgdmFsdWUgXHUyMDE0IHRoZVxuICogdHJpbW1lZCB2YWx1ZXMgZXhhY3RseSBhcyB3cml0dGVuIChhbGlhcyAvIHBhdGggZm9ybXMgcHJlc2VydmVkKS4gU2FtZVxuICogZmxhdHRlbmluZyBydWxlcyBhcyBleHRyYWN0TGlua3MoKSwgYnV0IHdpdGhvdXQgZXh0cmFjdGluZyB0aGUgdGFyZ2V0IG5hbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UmF3TGlua3ModmFsdWU6IHVua25vd24sIG1heDogbnVtYmVyID0gTUFYX0RFQ0tfTElOS1MpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGZsYXQ6IHVua25vd25bXSA9IFtdO1xuICBjb25zdCBjb2xsZWN0ID0gKHY6IHVua25vd24pOiB2b2lkID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHYpIGNvbGxlY3QoaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsYXQucHVzaCh2KTtcbiAgICB9XG4gIH07XG4gIGNvbGxlY3QodmFsdWUpO1xuXG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGZsYXQpIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09IFwic3RyaW5nXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHRyaW1tZWQgPSBpdGVtLnRyaW0oKTtcbiAgICBpZiAoIXRyaW1tZWQpIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHRyaW1tZWQpO1xuICAgIGlmIChvdXQubGVuZ3RoID49IG1heCkgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHRoZSB0YXJnZXQgbm90ZSBuYW1lIGZyb20gYSBtYXJrZG93biBsaW5rIHN0cmluZy5cbiAqIEhhbmRsZXMgc2V2ZXJhbCBzaGFwZXM6XG4gKiAgIFwiW1tzbGlkZS0yXV1cIiAgICAgICAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTJ8YWxpYXNdXVwiICBcdTIxOTIgc2xpZGUtMlxuICogICBcIltbc2xpZGUtMiNzZWN0aW9uXV1cIlx1MjE5MiBzbGlkZS0yXG4gKiAgIHNsaWRlLTIgICAgICAgICAgICAgIFx1MjE5MiBzbGlkZS0yIChiYXJlIGZpbGVuYW1lKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtUZXh0KHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHJldHVybiBudWxsO1xuICBjb25zdCB0cmltbWVkID0gdmFsdWUudHJpbSgpO1xuICBpZiAoIXRyaW1tZWQpIHJldHVybiBudWxsO1xuICByZXR1cm4gdHJpbW1lZC5yZXBsYWNlKC9eXFxbXFxbLywgXCJcIikucmVwbGFjZSgvXFxdXFxdJC8sIFwiXCIpLnNwbGl0KFwifFwiKVswXS5zcGxpdChcIiNcIilbMF0udHJpbSgpO1xufVxuXG4vKiogUmVuZGVyIGEgcHJvcGVydHkgdmFsdWUgYXMgcmVhZGFibGUgdGV4dDogYXJyYXlzL29iamVjdHMgXHUyMTkyIEpTT04sIGVsc2UgU3RyaW5nICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VmFsdWUodmFsdWU6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXHUyMDE0XCI7XG4gIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgPz8gXCJcdTIwMTRcIjtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBjaXJjdWxhciAvIHVuLXN0cmluZ2lmaWFibGUgc3RydWN0dXJlIFx1MjAxNCBub3QgZXhwZWN0ZWQgZnJvbSBmcm9udG1hdHRlclxuICAgICAgICByZXR1cm4gXCJcdTIwMTRcIjtcbiAgICAgIH1cbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gc3ltYm9sIC8gZnVuY3Rpb24gXHUyMDE0IG5vdCBleHBlY3RlZCBmcm9tIGZyb250bWF0dGVyXG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlO1xuICB9XG59XG4iLCAiLyoqXG4gKiBjcmVhdGVOZXh0LnRzIFx1MjAxNCBQdXJlIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiAvIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHBsYW5uaW5nXG4gKiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9jcmVhdGVOZXh0LnRlc3QudHMpLiBtYWluLnRzIGFkYXB0c1xuICogdGhlIHZhdWx0IChtZXRhZGF0YUNhY2hlLCBjb21wdXRlRGVjaykgdG8gdGhpcyBwdXJlIGludGVyZmFjZSBhbmQgYXBwbGllc1xuICogdGhlIHJlc3VsdGluZyBwbGFuIHdpdGggdmF1bHQuY3JlYXRlKCkgKyBmaWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoKS5cbiAqXG4gKiB2MS4wLjAgY29udmVudGlvbiBcdTIwMTQgbmV4dC1vbmx5LCBubyBvdmVydmlldyBwYWdlOiBhIHNsaWRlJ3MgYGRlY2tgXG4gKiBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rIChpdHMgbmV4dCBzbGlkZSkuIHBsYW5DcmVhdGVOZXh0IGRlY2lkZXMsXG4gKiBmb3IgdGhlIGN1cnJlbnQgZGVjayBub3RlOlxuICogICAtIHRoZSBuYW1lIG9mIHRoZSBuZXcgc2xpZGUgZmlsZSAoY29sbGlzaW9uLWF3YXJlKSxcbiAqICAgLSB0aGUgcmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBuZXcgbm90ZSxcbiAqICAgLSB0aGUgcmV3cml0ZXMgbmVlZGVkIG9uIGV4aXN0aW5nIG5vdGVzIChpbiBwcmFjdGljZSBhbHdheXMgdGhlXG4gKiAgICAgY3VycmVudCBub3RlKS5cbiAqIHBsYW5DcmVhdGVOZXcgcGxhbnMgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgKGEgZnJlc2ggbm90ZSB0aGF0IGlzXG4gKiBub3QgcGFydCBvZiBhbnkgZGVjayB5ZXQgXHUyMDE0IGBkZWNrOiBbXWAsIG5vIHJld3JpdGVzIGFueXdoZXJlKS5cbiAqL1xuXG5pbXBvcnQgeyBleHRyYWN0TGlua1RleHQgfSBmcm9tIFwiLi9kZWNrXCI7XG5cbi8qKiBJbnB1dHMgZm9yIHBsYW5uaW5nIFx1MjAxNCByZXNvbHZlZCBieSB0aGUgYWRhcHRlciBpbiBtYWluLnRzICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRJbnB1dCB7XG4gIC8qKiBCYXNlbmFtZSAod2l0aG91dCBleHRlbnNpb24pIG9mIHRoZSBjdXJyZW50IG5vdGUgKi9cbiAgY3VycmVudE5hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgY3VycmVudCBub3RlIChleHRyYWN0ZWQsIGF0IG1vc3Qgb25lKSAqL1xuICBjdXJyZW50TGlua3M6IHN0cmluZ1tdO1xuICAvKiogQmFzZW5hbWVzIG9mIGV2ZXJ5IG1hcmtkb3duIG5vdGUgaW4gdGhlIHZhdWx0IChjb2xsaXNpb24tZnJlZSBuYW1pbmcpICovXG4gIGV4aXN0aW5nTmFtZXM6IFNldDxzdHJpbmc+O1xufVxuXG4vKiogT25lIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tSZXdyaXRlIHtcbiAgLyoqIEJhc2VuYW1lIG9mIHRoZSBub3RlIHRvIHJld3JpdGUgKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogVGhlIG5ldyByYXcgYGRlY2tgIGxpbmsgdGV4dHMgKHNlcmlhbGl6ZWQgYXMgYSBZQU1MIGxpc3QpICovXG4gIGRlY2s6IHN0cmluZ1tdO1xufVxuXG4vKiogVGhlIGZ1bGwgcGxhbiBmb3IgY3JlYXRpbmcgb25lIG5ldyBzbGlkZSAqL1xuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVOZXh0UmVzdWx0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIG5ldyBzbGlkZSBmaWxlICovXG4gIG5ld05hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBmb3IgdGhlIG5ldyBub3RlJ3MgZnJvbnRtYXR0ZXIgKi9cbiAgbmV3RGVja0xpbmtzOiBzdHJpbmdbXTtcbiAgLyoqIFJld3JpdGVzIHRvIGFwcGx5IHRvIGV4aXN0aW5nIG5vdGVzIChpbiBwcmFjdGljZSBhbHdheXMgdGhlIGN1cnJlbnQgbm90ZSkgKi9cbiAgcmV3cml0ZXM6IERlY2tSZXdyaXRlW107XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBuZXcgc2xpZGUgYWZ0ZXIgdGhlIGN1cnJlbnQgbm90ZS5cbiAqXG4gKiBCZWhhdmlvcnM6XG4gKiAgIC0gTm8gbmV4dCBsaW5rIChsYXN0IHNsaWRlLCBmcmVzaCBkZWNrIGhlYWQsIG9yIGEgcGxhaW4gbm90ZSBzdGFydGluZ1xuICogICAgIGEgYnJhbmQtbmV3IGRlY2spOiBhcHBlbmQgYDxjdXJyZW50Pi1uZXh0YCBhcyB0aGUgbmV3IGxhc3Qgc2xpZGU7IHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCBnYWlucyB0aGUgbGluayB0byBpdC5cbiAqICAgLSBWYWxpZCBuZXh0IGxpbms6IGluc2VydCBgPGN1cnJlbnQ+LW5leHRgIGJldHdlZW4gdGhlIGN1cnJlbnQgbm90ZSBhbmRcbiAqICAgICBpdHMgbmV4dDsgdGhlIG5ldyBub3RlIHRha2VzIG92ZXIgdGhlIG9sZCBuZXh0IGxpbmsuXG4gKiAgIC0gQnJva2VuIG5leHQgbGluayAocGxhaW4sIG5vbi1leGlzdGluZyBuYW1lKTogY3JlYXRlIGV4YWN0bHkgdGhlXG4gKiAgICAgZGVjbGFyZWQgbWlzc2luZyBub3RlIGFzIHRoZSBuZXcgbmV4dCBzbGlkZSBcdTIwMTQgdGhlIFx1MjZBMCB3YXJuaW5nXG4gKiAgICAgZGlzYXBwZWFycyBhbmQgdGhlIGF1dGhvcidzIGludGVudCBpcyBob25vdXJlZC4gQSBicm9rZW4gbGluayB0aGF0IGlzXG4gKiAgICAgbm90IGEgcGxhaW4gYmFzZW5hbWUgKHBhdGgtcXVhbGlmaWVkLCBzZWxmLXJlZmVyZW5jaW5nKSBpcyB0cmVhdGVkIGFzXG4gKiAgICAgaW52YWxpZCBhbmQgZHJvcHBlZCAoYXBwZW5kIGEgYDxjdXJyZW50Pi1uZXh0YCBsYXN0IHNsaWRlIGluc3RlYWQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5leHQoaW5wdXQ6IENyZWF0ZU5leHRJbnB1dCk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgY29uc3QgeyBjdXJyZW50TmFtZSwgY3VycmVudExpbmtzIH0gPSBpbnB1dDtcbiAgY29uc3QgbmV4dExpbmsgPSBjdXJyZW50TGlua3NbMF07XG5cbiAgaWYgKG5leHRMaW5rKSB7XG4gICAgY29uc3QgbmV4dE5hbWUgPSBleHRyYWN0TGlua1RleHQobmV4dExpbmspO1xuICAgIGlmIChuZXh0TmFtZSAmJiBpc1BsYWluTmFtZShuZXh0TmFtZSkgJiYgbmV4dE5hbWUgIT09IGN1cnJlbnROYW1lKSB7XG4gICAgICBpZiAoIWlucHV0LmV4aXN0aW5nTmFtZXMuaGFzKG5leHROYW1lKSkge1xuICAgICAgICAvLyBUaGUgZGVjbGFyZWQgbmV4dCBub3RlIGRvZXMgbm90IGV4aXN0IHlldCBcdTIxOTIgY3JlYXRlIGV4YWN0bHkgdGhhdFxuICAgICAgICAvLyBub3RlIChmaXhlcyB0aGUgYnJva2VuLWxpbmsgd2FybmluZywgaG9ub3VycyB0aGUgYXV0aG9yJ3MgaW50ZW50KS5cbiAgICAgICAgcmV0dXJuIHsgbmV3TmFtZTogbmV4dE5hbWUsIG5ld0RlY2tMaW5rczogW10sIHJld3JpdGVzOiBbXSB9O1xuICAgICAgfVxuICAgICAgLy8gQSB2YWxpZCBuZXh0IG5vdGUgZXhpc3RzIFx1MjE5MiBpbnNlcnQgYmV0d2VlbiBpdCBhbmQgdGhlIGN1cnJlbnQgbm90ZS5cbiAgICAgIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXdOYW1lLFxuICAgICAgICBuZXdEZWNrTGlua3M6IFtuZXh0TGlua10sXG4gICAgICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gSW52YWxpZCAocGF0aC1xdWFsaWZpZWQgLyBzZWxmLXJlZmVyZW5jaW5nKSBuZXh0IGxpbmsgXHUyMTkyIGRyb3AgaXQgYW5kXG4gICAgLy8gYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgKGZhbGwgdGhyb3VnaCB0byB0aGUgbm8tbmV4dCBicmFuY2gpLlxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE5vICh1c2FibGUpIG5leHQgbGluayBcdTIxOTIgYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICB9O1xufVxuXG4vKipcbiAqIFBsYW4gdGhlIGNyZWF0aW9uIG9mIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlLlxuICpcbiAqIFRoZSBuZXcgbm90ZSBzdGFydHMgYXMgYSBzaW5nbGUtc2xpZGUgZGVjayAoYGRlY2s6IFtdYCkgYW5kIG5vdGhpbmcgZWxzZVxuICogaXMgdG91Y2hlZCBcdTIwMTQgdGhlIG5vdGUgaXQgd2FzIGxhdW5jaGVkIGZyb20gc3RheXMgYXMtaXMuIExhdGVyIHBhZ2VzIGFyZVxuICogYWRkZWQgd2l0aCBDcmVhdGUgTmV4dCBTbGlkZSBmcm9tIGluc2lkZSB0aGUgZGVjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5DcmVhdGVOZXcoaW5wdXQ6IHsgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz4gfSk6IENyZWF0ZU5leHRSZXN1bHQge1xuICByZXR1cm4ge1xuICAgIG5ld05hbWU6IHVuaXF1ZU5hbWUoXCJ1bnRpdGxlZC1zbGlkZXNcIiwgaW5wdXQuZXhpc3RpbmdOYW1lcyksXG4gICAgbmV3RGVja0xpbmtzOiBbXSxcbiAgICByZXdyaXRlczogW10sXG4gIH07XG59XG5cbi8qKiBBIG5hbWUgdXNhYmxlIGFzIGEgdmF1bHQgbm90ZSBuYW1lOiBubyBwYXRoIHNlcGFyYXRvcnMsIG5vbi1lbXB0eSAqL1xuZnVuY3Rpb24gaXNQbGFpbk5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBuYW1lLmxlbmd0aCA+IDAgJiYgIW5hbWUuaW5jbHVkZXMoXCIvXCIpICYmICFuYW1lLmluY2x1ZGVzKFwiXFxcXFwiKTtcbn1cblxuLyoqIEZpcnN0IGZyZWUgbmFtZSBpbiB0aGUgZmFtaWx5IGBiYXNlYCwgYGJhc2UtMmAsIGBiYXNlLTNgLCBcdTIwMjYgKi9cbmZ1bmN0aW9uIHVuaXF1ZU5hbWUoYmFzZTogc3RyaW5nLCBleGlzdGluZzogU2V0PHN0cmluZz4pOiBzdHJpbmcge1xuICBpZiAoIWV4aXN0aW5nLmhhcyhiYXNlKSkgcmV0dXJuIGJhc2U7XG4gIGZvciAobGV0IGkgPSAyOyA7IGkrKykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2Jhc2V9LSR7aX1gO1xuICAgIGlmICghZXhpc3RpbmcuaGFzKGNhbmRpZGF0ZSkpIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGRlbGV0ZVNsaWRlcy50cyBcdTIwMTQgUHVyZSBcIkRlbGV0ZSBzbGlkZXNcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXQgY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5XG4gKiAoc2VlIHRlc3QvZGVsZXRlU2xpZGVzLnRlc3QudHMpLiBUaGUgYWRhcHRlciBpbiBkZWNrLXNlcnZpY2UudHMgYXBwbGllc1xuICogdGhlIHBsYW46IGl0IHJld3JpdGVzIHRoZSBzdXJ2aXZpbmcgbm90ZXMnIGBkZWNrYCBwcm9wZXJ0aWVzLCB0aGVuIG1vdmVzXG4gKiB0aGUgZGVsZXRlZCBub3RlcyB0byB0aGUgdHJhc2guXG4gKlxuICogRGVsZXRpb24gc3BsaWNlcyB0aGUgY2hhaW4gaW5zdGVhZCBvZiBicmVha2luZyBpdDogZXZlcnkgbWF4aW1hbCBydW4gb2ZcbiAqIGRlbGV0ZWQgc2xpZGVzIGJldHdlZW4gdHdvIHN1cnZpdm9ycyBBIFx1MjE5MiBcdTIwMjYgXHUyMTkyIEIgaXMgcmVwYWlyZWQgYnkgcG9pbnRpbmdcbiAqIEEncyBgZGVja2AgbGluayBhdCBCIChgW11gIHdoZW4gdGhlIHJ1biByZWFjaGVzIHRoZSBlbmQgb2YgdGhlIGNoYWluKS5cbiAqIFdoZW4gYSBydW4gc3RhcnRzIGF0IHRoZSBjaGFpbiBoZWFkLCB0aGUgZmlyc3Qgc3Vydml2b3IgYmVjb21lcyB0aGUgbmV3XG4gKiBoZWFkIGFuZCBuZWVkcyBubyByZXdyaXRlIGF0IGFsbCAoaXRzIG93biBgZGVja2AgYWxyZWFkeSBwb2ludHMgb253YXJkKS5cbiAqL1xuXG4vKiogT25lIHN1cnZpdmluZyBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBtdXN0IGJlIHJld3JpdHRlbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVSZXdyaXRlIHtcbiAgLyoqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBwYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBWYXVsdCBwYXRoIG9mIHRoZSBub3RlIHRoYXQgc2hvdWxkIGJlY29tZSB0aGlzIG5vdGUncyBuZXh0IHNsaWRlLFxuICAgKiBvciBudWxsIHdoZW4gdGhlIG5vdGUgYmVjb21lcyB0aGUgbmV3IGxhc3Qgc2xpZGUgKGBkZWNrOiBbXWApLlxuICAgKi9cbiAgbmV4dFBhdGg6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKlxuICogUGxhbiB0aGUgZGVsZXRpb24gb2Ygc2xpZGVzIGZyb20gYW4gb3JkZXJlZCBkZWNrIGNoYWluLlxuICpcbiAqIGBjaGFpbmAgaXMgdGhlIGZ1bGwgc2xpZGUgb3JkZXIgKFswXSA9IGhlYWQpLiBPbmx5IHBhdGhzIHByZXNlbnQgaW4gdGhlXG4gKiBjaGFpbiBhcmUgY29uc2lkZXJlZDsgYW55dGhpbmcgZWxzZSBpbiBgZGVsZXRlUGF0aHNgIGlzIGlnbm9yZWQuIFJldHVybnNcbiAqIG9uZSByZXdyaXRlIHBlciBzdXJ2aXZpbmcgbm90ZSB0aGF0IGRpcmVjdGx5IHByZWNlZGVkIGEgZGVsZXRlZCBydW4sXG4gKiBvcmRlcmVkIGJ5IGNoYWluIHBvc2l0aW9uLiBEZWxldGluZyBub3RoaW5nIHlpZWxkcyBubyByZXdyaXRlczsgZGVsZXRpbmdcbiAqIGV2ZXJ5dGhpbmcgeWllbGRzIG5vIHJld3JpdGVzIGVpdGhlciAobm8gc3Vydml2b3JzIGxlZnQgdG8gcmVwYWlyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5EZWxldGVTbGlkZXMoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4pOiBEZWxldGVSZXdyaXRlW10ge1xuICBjb25zdCByZXdyaXRlczogRGVsZXRlUmV3cml0ZVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXRoID0gY2hhaW5baV07XG4gICAgaWYgKCFwYXRoIHx8IGRlbGV0ZVBhdGhzLmhhcyhwYXRoKSkgY29udGludWU7XG4gICAgLy8gRmluZCB0aGUgZmlyc3Qgc3Vydml2b3IgYWZ0ZXIgdGhpcyBub3RlJ3MgcG9zaXRpb24uXG4gICAgbGV0IGogPSBpICsgMTtcbiAgICB3aGlsZSAoaiA8IGNoYWluLmxlbmd0aCAmJiBkZWxldGVQYXRocy5oYXMoY2hhaW5bal0pKSBqKys7XG4gICAgY29uc3QgbmV4dFBhdGggPSBqIDwgY2hhaW4ubGVuZ3RoID8gY2hhaW5bal0gOiBudWxsO1xuICAgIGNvbnN0IGNoYW5nZWQgPSBuZXh0UGF0aCAhPT0gKGNoYWluW2kgKyAxXSA/PyBudWxsKTtcbiAgICBpZiAoY2hhbmdlZCkgcmV3cml0ZXMucHVzaCh7IHBhdGgsIG5leHRQYXRoIH0pO1xuICB9XG4gIHJldHVybiByZXdyaXRlcztcbn1cblxuLyoqXG4gKiBQaWNrIHdoZXJlIHRoZSBlZGl0b3Igc2hvdWxkIGxhbmQgYWZ0ZXIgZGVsZXRpbmcgc2xpZGVzOiB0aGUgbmVhcmVzdFxuICogc3Vydml2b3Igb2YgYGRlbGV0ZWRQYXRoc2AnIG5laWdoYm91cmhvb2QgYXJvdW5kIGBmb2N1c1BhdGhgIFx1MjAxNCBwcmVmZXJcbiAqIHRoZSBjbG9zZXN0IHN1cnZpdm9yIGFmdGVyIGl0LCBlbHNlIHRoZSBjbG9zZXN0IGJlZm9yZSBpdC4gUmV0dXJucyBudWxsXG4gKiB3aGVuIGBmb2N1c1BhdGhgIHN1cnZpdmVzIG9yIG5vdGhpbmcgbmVhcmJ5IHJlbWFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrTGFuZGluZ1BhdGgoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIWZvY3VzUGF0aCB8fCAhZGVsZXRlUGF0aHMuaGFzKGZvY3VzUGF0aCkpIHJldHVybiBudWxsO1xuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoZm9jdXNQYXRoKTtcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG4gIGZvciAobGV0IGkgPSBpbmRleCArIDE7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGlmICghZGVsZXRlUGF0aHMuaGFzKGNoYWluW2ldKSkgcmV0dXJuIGNoYWluW2ldO1xuICB9XG4gIGZvciAobGV0IGkgPSBpbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIE1lbnUsIFRGaWxlLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IENvbmZpcm1EZWxldGVNb2RhbCB9IGZyb20gXCIuL2NvbmZpcm0tZGVsZXRlXCI7XG5cbi8qKiBWaWV3IHR5cGUgaWQgb2YgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsICovXG5leHBvcnQgY29uc3QgU0xJREVTX1BBTkVMX1ZJRVcgPSBcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIjtcblxuLyoqXG4gKiBTaWRlYmFyIHBhbmVsIGxpc3RpbmcgZXZlcnkgc2xpZGUgb2YgdGhlIGFjdGl2ZSBub3RlJ3MgZGVjayAobmV4dC1vbmx5XG4gKiBjaGFpbiBvcmRlcikuIFRha2VzIG92ZXIgdGhlIGFnZ3JlZ2F0aW9uL2VudHJ5IHJvbGUgdGhlIG92ZXJ2aWV3IHBhZ2VcbiAqIHVzZWQgdG8gcGxheSBiZWZvcmUgdjEuMC4wLlxuICpcbiAqIEludGVyYWN0aW9uOlxuICogICAtIGNsaWNrICAgICAgICAgICAgXHUyMTkyIG9wZW4gdGhhdCBzbGlkZSAoYW5kIGNsZWFyIGFueSBzZWxlY3Rpb24pXG4gKiAgIC0gTW9kK2NsaWNrICAgICAgICBcdTIxOTIgdG9nZ2xlIHRoZSBpdGVtIGluIHRoZSBzZWxlY3Rpb25cbiAqICAgLSBTaGlmdCtjbGljayAgICAgIFx1MjE5MiBleHRlbmQgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBsYXN0IGFuY2hvclxuICogICAtIHJpZ2h0LWNsaWNrICAgICAgXHUyMTkyIGNvbnRleHQgbWVudTogQ3JlYXRlIG5leHQgc2xpZGUgLyBEZWxldGUgc2xpZGUocylcbiAqL1xuZXhwb3J0IGNsYXNzIFNsaWRlc1BhbmVsVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgLyoqIENoYWluIHNpZ25hdHVyZSBvZiB0aGUgY3VycmVudGx5IHJlbmRlcmVkIGxpc3QgKi9cbiAgcHJpdmF0ZSBsYXN0Q2hhaW46IHN0cmluZ1tdID0gW107XG4gIC8qKiBSZW5kZXJlZCBpdGVtIGVsZW1lbnRzLCBpbmRleC1hbGlnbmVkIHdpdGggbGFzdENoYWluICovXG4gIHByaXZhdGUgaXRlbXM6IHsgcGF0aDogc3RyaW5nOyBlbDogSFRNTEVsZW1lbnQgfVtdID0gW107XG4gIC8qKiBDdXJyZW50bHkgc2VsZWN0ZWQgc2xpZGUgcGF0aHMgKG11bHRpLXNlbGVjdCBmb3IgRGVsZXRlKSAqL1xuICBwcml2YXRlIHNlbGVjdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIC8qKiBTZWxlY3Rpb24gYW5jaG9yIGZvciBTaGlmdCtjbGljayByYW5nZSBleHRlbnNpb24gKi9cbiAgcHJpdmF0ZSBhbmNob3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4sXG4gICAgbGVhZjogV29ya3NwYWNlTGVhZixcbiAgKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBTTElERVNfUEFORUxfVklFVztcbiAgfVxuXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiU2xpZGVzXCI7XG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwicHJlc2VudGF0aW9uXCI7XG4gIH1cblxuICBhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5hZGRDbGFzcyhcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIik7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9uKFwiY2hhbmdlZFwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhc3luYyBvbkNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IFtdO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bmMgdGhlIGxpc3Qgd2l0aCB0aGUgYWN0aXZlIG5vdGUncyBkZWNrLiBJbmNyZW1lbnRhbCBvbiBwdXJwb3NlOiB0aGVcbiAgICogcmVmcmVzaCBldmVudHMgYWxzbyBmaXJlIHdoaWxlIGEgY2xpY2sgb24gYW4gZW50cnkgaXMgaW4gZmxpZ2h0ICh0aGVcbiAgICogbW91c2Vkb3duIGFjdGl2YXRlcyB0aGlzIGxlYWYpLCBhbmQgcmVidWlsZGluZyB0aGUgRE9NIG1pZC1nZXN0dXJlXG4gICAqIGRlc3Ryb3lzIHRoZSBjbGljayB0YXJnZXQgXHUyMDE0IHdoaWNoIG1hZGUgb3BlbmluZyBhIHNsaWRlIHRha2UgdHdvIGNsaWNrc1xuICAgKiB3aGVuZXZlciB0aGUgcGFuZWwgd2FzIG5vdCB0aGUgYWN0aXZlIGxlYWYuIFVuY2hhbmdlZCBjaGFpbnMgb25seSBnZXRcbiAgICogdGhlaXIgaGlnaGxpZ2h0IHVwZGF0ZWQsIHNvIGl0ZW0gZWxlbWVudHMgYWx3YXlzIHN1cnZpdmUuXG4gICAqL1xuICBwcml2YXRlIHJlbmRlcigpOiB2b2lkIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBkZWNrID0gZmlsZSA/IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSkgOiBudWxsO1xuICAgIGNvbnN0IGNoYWluID0gZGVja1xuICAgICAgPyBkZWNrLmNoYWluLmZpbHRlcigocCkgPT4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHApIGluc3RhbmNlb2YgVEZpbGUpXG4gICAgICA6IFtdO1xuXG4gICAgLy8gRHJvcCBzZWxlY3Rpb25zIHdob3NlIG5vdGUgdmFuaXNoZWQgZnJvbSB0aGUgY2hhaW4gbWVhbndoaWxlXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQuc2l6ZSA+IDApIHtcbiAgICAgIGNvbnN0IGxpdmUgPSBuZXcgU2V0KGNoYWluKTtcbiAgICAgIGZvciAoY29uc3QgcGF0aCBvZiB0aGlzLnNlbGVjdGVkKSBpZiAoIWxpdmUuaGFzKHBhdGgpKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShwYXRoKTtcbiAgICB9XG4gICAgLy8gQSBkZWFkIGFuY2hvciBtdXN0IG5vdCBzaWxlbnRseSB0dXJuIGEgU2hpZnQrY2xpY2sgaW50byBhIHRvZ2dsZVxuICAgIGlmICh0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiAhY2hhaW4uaW5jbHVkZXModGhpcy5hbmNob3IpKSB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAoIWNoYWluRXF1YWxzKHRoaXMubGFzdENoYWluLCBjaGFpbikpIHtcbiAgICAgIHRoaXMucmVidWlsZChjaGFpbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5pdGVtcykgaXQuZWwuY2xhc3NMaXN0LnRvZ2dsZShcImlzLWFjdGl2ZVwiLCBpdC5wYXRoID09PSBmaWxlPy5wYXRoKTtcbiAgICB9XG4gICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIEZ1bGwgcmVidWlsZCAoY2hhaW4gc2hhcGUgY2hhbmdlZCkgKi9cbiAgcHJpdmF0ZSByZWJ1aWxkKGNoYWluOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRhaW5lckVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5sYXN0Q2hhaW4gPSBjaGFpbjtcblxuICAgIGlmIChjaGFpbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1lbXB0eVwiIH0pO1xuICAgICAgZW1wdHkuc2V0VGV4dChcbiAgICAgICAgXCJObyBzbGlkZXMgZGVjayBcdTIwMTQgb3BlbiBhIGRlY2sgbm90ZSwgb3IgcnVuIGNyZWF0ZSBuZXh0IHNsaWRlIG9uIGFueSBub3RlIHRvIHN0YXJ0IG9uZS5cIixcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGg7XG4gICAgY2hhaW4uZm9yRWFjaCgocGF0aCwgaSkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybjtcbiAgICAgIGNvbnN0IGl0ZW0gPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWl0ZW1cIiB9KTtcbiAgICAgIGlmIChwYXRoID09PSBhY3RpdmVQYXRoKSBpdGVtLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtbnVtXCIgfSkuc2V0VGV4dChTdHJpbmcoaSArIDEpKTtcbiAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLXRpdGxlXCIgfSkuc2V0VGV4dChmLmJhc2VuYW1lKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLm9uSXRlbUNsaWNrKGUsIGksIGYpKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoZSwgZik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaXRlbXMucHVzaCh7IHBhdGgsIGVsOiBpdGVtIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENsaWNrIHJvdXRpbmc6IHBsYWluID0gb3BlbiwgTW9kID0gdG9nZ2xlIHNlbGVjdCwgU2hpZnQgPSByYW5nZSBzZWxlY3QgKi9cbiAgcHJpdmF0ZSBvbkl0ZW1DbGljayhlOiBNb3VzZUV2ZW50LCBpbmRleDogbnVtYmVyLCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGlmIChlLnNoaWZ0S2V5IHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIC8vIFJhbmdlIGFuY2hvcjogdGhlIGxhc3Qgc2VsZWN0ZWQgaXRlbSwgb3IgdGhlIGRpc3BsYXllZCBzbGlkZVxuICAgICAgICAvLyB3aGVuIG5vIHVzYWJsZSBhbmNob3IgZXhpc3RzIChmaXJzdCBTaGlmdCtjbGljayBpbiBhIHNlc3Npb24pLlxuICAgICAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBudWxsO1xuICAgICAgICBjb25zdCBhbmNob3JQYXRoID1cbiAgICAgICAgICB0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLnNvbWUoKGl0KSA9PiBpdC5wYXRoID09PSB0aGlzLmFuY2hvcilcbiAgICAgICAgICAgID8gdGhpcy5hbmNob3JcbiAgICAgICAgICAgIDogYWN0aXZlUGF0aDtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuaXRlbXMuZmluZEluZGV4KChpdCkgPT4gaXQucGF0aCA9PT0gYW5jaG9yUGF0aCk7XG4gICAgICAgIGlmIChhbmNob3JQYXRoICE9PSBudWxsICYmIGZyb20gIT09IC0xKSB7XG4gICAgICAgICAgY29uc3QgW2xvLCBoaV0gPSBmcm9tIDwgaW5kZXggPyBbZnJvbSwgaW5kZXhdIDogW2luZGV4LCBmcm9tXTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gbG87IGkgPD0gaGk7IGkrKykgdGhpcy5zZWxlY3RlZC5hZGQodGhpcy5pdGVtc1tpXS5wYXRoKTtcbiAgICAgICAgICAvLyBUaGUgZGlzcGxheWVkIHNsaWRlIGpvaW5zIGV2ZXJ5IFNoaWZ0IHNlbGVjdGlvbiBcdTIwMTQgZXh0ZW5kaW5nIGFcbiAgICAgICAgICAvLyBzZWxlY3Rpb24gbmV2ZXIgc2lsZW50bHkgZHJvcHMgdGhlIHBhZ2UgeW91IGFyZSBsb29raW5nIGF0LlxuICAgICAgICAgIGlmIChhY3RpdmVQYXRoICE9PSBudWxsICYmIHRoaXMuaXRlbXMuc29tZSgoaXQpID0+IGl0LnBhdGggPT09IGFjdGl2ZVBhdGgpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChhY3RpdmVQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hbmNob3IgPSB0aGlzLml0ZW1zW2luZGV4XS5wYXRoO1xuICAgICAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE1vZCAob3IgU2hpZnQgd2l0aCBubyByZWFjaGFibGUgYW5jaG9yKTogcHVyZSB0b2dnbGUgXHUyMDE0IHRoZSBvbmx5IHdheVxuICAgICAgLy8gdG8gY2FuY2VsIGFuIGl0ZW0gb3V0IG9mIHRoZSBzZWxlY3Rpb24uXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZC5oYXMoZi5wYXRoKSkgdGhpcy5zZWxlY3RlZC5kZWxldGUoZi5wYXRoKTtcbiAgICAgIGVsc2UgdGhpcy5zZWxlY3RlZC5hZGQoZi5wYXRoKTtcbiAgICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgLy8gTm8gc2VsZWN0aW9uIGFmdGVyIGEgcGxhaW4gY2xpY2ssIGJ1dCB0aGUgY2xpY2tlZCBzbGlkZSBzdGF5cyB0aGVcbiAgICAvLyBTaGlmdCtjbGljayBhbmNob3IgXHUyMDE0IG1hdGNoaW5nIHRoZSBmaWxlLWV4cGxvcmVyIGZlZWw6IHBpY2sgYSBzbGlkZSxcbiAgICAvLyB0aGVuIFNoaWZ0K2NsaWNrIGEgbGF0ZXIgb25lIHRvIHNlbGVjdCB0aGUgd2hvbGUgcmFuZ2UgYmV0d2VlbiB0aGVtLlxuICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICB2b2lkIHRoaXMub3BlblNsaWRlKGYpO1xuICB9XG5cbiAgLyoqIFJlZmxlY3QgdGhlIHNlbGVjdGlvbiBzZXQgb24gdGhlIHJlbmRlcmVkIGl0ZW1zIHdpdGhvdXQgYSByZWJ1aWxkICovXG4gIHByaXZhdGUgc3luY1NlbGVjdGlvbkNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtc2VsZWN0ZWRcIiwgdGhpcy5zZWxlY3RlZC5oYXMoaXQucGF0aCkpO1xuICB9XG5cbiAgLyoqIFJpZ2h0LWNsaWNrIG1lbnUgb24gb25lIGl0ZW07IG9wZXJhdGVzIG9uIHRoZSB3aG9sZSBzZWxlY3Rpb24gd2hlbiBpdCBiZWxvbmdzIHRvIG9uZSAqL1xuICBwcml2YXRlIG9wZW5Db250ZXh0TWVudShlOiBNb3VzZUV2ZW50LCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUoXCJDcmVhdGUgbmV4dCBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInBsdXNcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdm9pZCB0aGlzLmNyZWF0ZU5leHRBZnRlcihmKSksXG4gICAgKTtcbiAgICBjb25zdCB0YXJnZXRzID0gdGhpcy5zZWxlY3RlZC5oYXMoZi5wYXRoKSA/IFsuLi50aGlzLnNlbGVjdGVkXSA6IFtmLnBhdGhdO1xuICAgIGNvbnN0IG9yZGVyZWQgPSB0aGlzLmxhc3RDaGFpbi5maWx0ZXIoKHApID0+IHRhcmdldHMuaW5jbHVkZXMocCkpO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUob3JkZXJlZC5sZW5ndGggPiAxID8gYERlbGV0ZSAke29yZGVyZWQubGVuZ3RofSBzbGlkZXNgIDogXCJEZWxldGUgc2xpZGVcIilcbiAgICAgICAgLnNldEljb24oXCJ0cmFzaFwiKVxuICAgICAgICAub25DbGljaygoKSA9PiB0aGlzLmRlbGV0ZVNsaWRlcyhvcmRlcmVkKSksXG4gICAgKTtcbiAgICBtZW51LnNob3dBdE1vdXNlRXZlbnQoZSk7XG4gIH1cblxuICAvKiogQ3JlYXRlIGEgc2xpZGUgYWZ0ZXIgdGhlIHJpZ2h0LWNsaWNrZWQgb25lICh3aXRob3V0IG9wZW5pbmcgaXQpICovXG4gIHByaXZhdGUgYXN5bmMgY3JlYXRlTmV4dEFmdGVyKGY6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGxhbiA9IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXh0KGYpO1xuICAgIGlmICghcGxhbikgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXh0KGYsIHBsYW4sIGZhbHNlKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqIENvbmZpcm0sIHRoZW4gdHJhc2ggdGhlIGdpdmVuIHNsaWRlcyBhbmQgc3BsaWNlIHRoZW0gb3V0IG9mIHRoZSBjaGFpbiAqL1xuICBwcml2YXRlIGRlbGV0ZVNsaWRlcyhwYXRoczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgcnVuID0gKCk6IHZvaWQgPT4gdm9pZCB0aGlzLnJ1bkRlbGV0aW9uKHBhdGhzKTtcblxuICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcykge1xuICAgICAgcnVuKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5hbWVzID0gcGF0aHMubWFwKChwKSA9PiB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHApO1xuICAgICAgcmV0dXJuIGYgaW5zdGFuY2VvZiBURmlsZSA/IGYuYmFzZW5hbWUgOiBwO1xuICAgIH0pO1xuICAgIG5ldyBDb25maXJtRGVsZXRlTW9kYWwodGhpcy5hcHAsIG5hbWVzLCBydW4sIGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMgPSBmYWxzZTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIH0pLm9wZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcnVuRGVsZXRpb24ocGF0aHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbDtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlRGVsZXRlU2xpZGVzKFxuICAgICAgdGhpcy5sYXN0Q2hhaW4sXG4gICAgICBuZXcgU2V0KHBhdGhzKSxcbiAgICAgIGFjdGl2ZVBhdGgsXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgcGF0aCBvZiBwYXRocykgdGhpcy5zZWxlY3RlZC5kZWxldGUocGF0aCk7XG4gICAgaWYgKHRoaXMuYW5jaG9yICE9PSBudWxsICYmIHBhdGhzLmluY2x1ZGVzKHRoaXMuYW5jaG9yKSkgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJlc3VsdC5sYW5kaW5nUGF0aCkge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXN1bHQubGFuZGluZ1BhdGgpO1xuICAgICAgaWYgKGYgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5vcGVuU2xpZGUoZik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKiogT3BlbiBhIHNsaWRlIGluIGEgbWFya2Rvd24gbGVhZiAobmV2ZXIgaW4gdGhpcyBwYW5lbCdzIG93biBsZWFmKSAqL1xuICBwcml2YXRlIGFzeW5jIG9wZW5TbGlkZShmOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxlYWYgPVxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShcIm1hcmtkb3duXCIpWzBdID8/IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZik7XG4gICAgdGhpcy5hcHAud29ya3NwYWNlLnNldEFjdGl2ZUxlYWYobGVhZiwgeyBmb2N1czogdHJ1ZSB9KTtcbiAgfVxufVxuXG4vKiogT3JkZXItc2Vuc2l0aXZlIGNoYWluIGNvbXBhcmlzb24gKi9cbmZ1bmN0aW9uIGNoYWluRXF1YWxzKGE6IHN0cmluZ1tdLCBiOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gYS5sZW5ndGggPT09IGIubGVuZ3RoICYmIGEuZXZlcnkoKHAsIGkpID0+IHAgPT09IGJbaV0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuLyoqIE1heCBuYW1lcyBzaG93biBpbiB0aGUgZGlhbG9nIGJlZm9yZSBjb2xsYXBzaW5nIGludG8gYSBcIitOIG1vcmVcIiBsaW5lICovXG5jb25zdCBNQVhfVklTSUJMRV9OQU1FUyA9IDg7XG5cbi8qKlxuICogQ29uZmlybWF0aW9uIGRpYWxvZyBmb3IgRGVsZXRlIHNsaWRlcy4gTGlzdHMgdGhlIG5vdGVzIGFib3V0IHRvIGJlXG4gKiB0cmFzaGVkIChudW1iZXJlZCBsaWtlIHRoZSBwYW5lbCwgc28gdGhlIHVzZXIgY2FuIG1hcCB0aGVtIDE6MSksIG9mZmVyc1xuICogYSBcImRvbid0IGFzayBhZ2FpblwiIHRvZ2dsZSB0aGF0IGZsaXBzIHRoZSBgY29uZmlybURlbGV0ZVNsaWRlc2Agc2V0dGluZ1xuICogb2ZmIChwZXJzaXN0ZWQgYnkgdGhlIGNhbGxlciB2aWEgb25Eb250QXNrKSwgYW5kIGFza3MgZm9yIGFuIGV4cGxpY2l0XG4gKiBDYW5jZWwgLyBEZWxldGUgZGVjaXNpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25maXJtRGVsZXRlTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgY29uZmlybWVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBuYW1lczogc3RyaW5nW10sXG4gICAgcHJpdmF0ZSBvbkNvbmZpcm06ICgpID0+IHZvaWQsXG4gICAgcHJpdmF0ZSBvbkRvbnRBc2s6ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICkge1xuICAgIHN1cGVyKGFwcCk7XG4gIH1cblxuICBvbk9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgICB0aGlzLm1vZGFsRWwuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlXCIpO1xuXG4gICAgY29uc3QgY291bnQgPSB0aGlzLm5hbWVzLmxlbmd0aDtcbiAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXRpdGxlXCIsXG4gICAgICB0ZXh0OiBjb3VudCA9PT0gMSA/IFwiRGVsZXRlIHRoaXMgc2xpZGU/XCIgOiBgRGVsZXRlICR7Y291bnR9IHNsaWRlcz9gLFxuICAgIH0pO1xuICAgIHRoaXMuY29udGVudEVsXG4gICAgICAuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtc3ViXCIgfSlcbiAgICAgIC5zZXRUZXh0KFxuICAgICAgICBjb3VudCA9PT0gMVxuICAgICAgICAgID8gXCJUaGUgbm90ZSB3aWxsIGJlIG1vdmVkIHRvIHRoZSB0cmFzaC5cIlxuICAgICAgICAgIDogXCJUaGVzZSBub3RlcyB3aWxsIGJlIG1vdmVkIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgICk7XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbGlzdFwiIH0pO1xuICAgIGZvciAoY29uc3QgW2ksIG5hbWVdIG9mIHRoaXMubmFtZXMuc2xpY2UoMCwgTUFYX1ZJU0lCTEVfTkFNRVMpLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbnVtXCIgfSkuc2V0VGV4dChTdHJpbmcoaSArIDEpKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbmFtZVwiIH0pLnNldFRleHQobmFtZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm5hbWVzLmxlbmd0aCA+IE1BWF9WSVNJQkxFX05BTUVTKSB7XG4gICAgICBsaXN0XG4gICAgICAgIC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1tb3JlXCIgfSlcbiAgICAgICAgLnNldFRleHQoYFx1MjAyNiBhbmQgJHt0aGlzLm5hbWVzLmxlbmd0aCAtIE1BWF9WSVNJQkxFX05BTUVTfSBtb3JlYCk7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZERvbnRBc2tSb3coKTtcbiAgICB0aGlzLmJ1aWxkQWN0aW9ucygpO1xuICB9XG5cbiAgLyoqIENvbXBhY3QgbGVmdC1hbGlnbmVkIFwiZG9uJ3QgYXNrIGFnYWluXCIgY2hlY2tib3ggcm93ICovXG4gIHByaXZhdGUgYnVpbGREb250QXNrUm93KCk6IHZvaWQge1xuICAgIGNvbnN0IHJvdyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWRvbnRhc2tcIiB9KTtcbiAgICByb3cuY3JlYXRlRWwoXCJsYWJlbFwiKS5zZXRUZXh0KFwiRG9uJ3QgYXNrIGFnYWluXCIpO1xuICAgIGNvbnN0IGNoZWNrYm94ID0gcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyB0eXBlOiBcImNoZWNrYm94XCIgfSk7XG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMub25Eb250QXNrKCkudGhlbihcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIGNoZWNrYm94LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIC8vIGtlZXAgdGhlIGNoZWNrYm94IGVuYWJsZWQgaWYgcGVyc2lzdGluZyB0aGUgcHJlZmVyZW5jZSBmYWlsZWRcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmlnaHQtYWxpZ25lZCBDYW5jZWwgLyBEZWxldGUgYnV0dG9uIHJvdyAqL1xuICBwcml2YXRlIGJ1aWxkQWN0aW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtYWN0aW9uc1wiIH0pO1xuICAgIGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbFwiIH0pLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmNsb3NlKCkpO1xuICAgIGFjdGlvbnNcbiAgICAgIC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRGVsZXRlXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29uZmlybWVkKSB0aGlzLm9uQ29uZmlybSgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgdHlwZSBTZXR0aW5nRGVmaW5pdGlvbkl0ZW0gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgU0xJREVTX1RIRU1FUyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKlxuICogU2V0dGluZ3MgdGFiOiB0b2dnbGVzIHRoZSBuYXYgYnV0dG9ucywgcGFnZSBudW1iZXIsIGF1dG8tZW50ZXIgYW5kIGJhclxuICogdmlzaWJpbGl0eS4gRGVjbGFyYXRpdmUgZGVmaW5pdGlvbnMgKE9ic2lkaWFuIFx1MjI2NSAxLjEzLjAsIHNlYXJjaGFibGUgaW4gdGhlXG4gKiBzZXR0aW5ncyBtb2RhbCkgd2l0aCBhbiBpbXBlcmF0aXZlIGBkaXNwbGF5KClgIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gIH1cblxuICAvKiogRGVjbGFyYXRpdmUgc2V0dGluZ3MgKE9ic2lkaWFuIFx1MjI2NSAxLjEzLjApIFx1MjAxNCBzZWFyY2hhYmxlIGJ5IHRoZSBzZXR0aW5ncyBtb2RhbC4gKi9cbiAgZ2V0U2V0dGluZ0RlZmluaXRpb25zKCk6IFNldHRpbmdEZWZpbml0aW9uSXRlbVtdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBuYW1lOiBcIlN0eWxlIHRlbXBsYXRlXCIsXG4gICAgICAgIGRlc2M6IFwiQnVpbHQtaW4gbG9vayBmb3IgdGhlIHNsaWRlcyBjYXJkIGFuZCBzbGlkZXMgYmFyIChib3JkZXIsIGJhY2tncm91bmQsIHNoYWRvdywgYmFyIHN0eWxpbmcpLiBFdmVyeSB0ZW1wbGF0ZSBhZGFwdHMgdG8gbGlnaHQgYW5kIGRhcmsgdGhlbWVzLlwiLFxuICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAga2V5OiBcInNsaWRlc1RoZW1lXCIsXG4gICAgICAgICAgdHlwZTogXCJkcm9wZG93blwiLFxuICAgICAgICAgIG9wdGlvbnM6IE9iamVjdC5mcm9tRW50cmllcyhTTElERVNfVEhFTUVTLm1hcCgodCkgPT4gW3QuaWQsIHQubGFiZWxdKSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkNlbnRlciBpbWFnZXNcIixcbiAgICAgICAgZGVzYzogXCJJbWFnZXMgcmVuZGVyIGNlbnRlcmVkIG9uIHRoZSBzbGlkZSBhcyBhIGNhcmQgYmxvY2sgZXhhY3RseSBhcyB0YWxsIGFzIHRoZSBwaWN0dXJlLiBUdXJuIG9mZiBmb3IgT2JzaWRpYW4ncyB1c3VhbCBiZWhhdmlvcjogaW1hZ2VzIHN0YXkgaW5saW5lIHdpdGggdGhlIHRleHQgKGEgc21hbGwgaW1hZ2UgYW5kIGl0cyBjYXB0aW9uIHNpdCBvbiB0aGUgc2FtZSByb3cpLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJpbWFnZUxheW91dFwiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgc2xpZGVzIGJhclwiLFxuICAgICAgICBkZXNjOiBcIk1hc3RlciB0b2dnbGUgZm9yIHRoZSBlbnRpcmUgc2xpZGVzIGJhciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3dcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd1NsaWRlc0JhclwiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgcHJldmlvdXMvbmV4dCBidXR0b25zXCIsXG4gICAgICAgIGRlc2M6IFwiU2hvdyBcdTI1QzAgXHUyNUI2IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgd2hlbiB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KVwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93TmF2QnV0dG9uc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlBhZ2UgbnVtYmVyIHN0eWxlXCIsXG4gICAgICAgIGRlc2M6ICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIm4gLyB0b3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJuXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwibm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgICAgY29udHJvbDoge1xuICAgICAgICAgIGtleTogXCJwYWdlTnVtYmVyU3R5bGVcIixcbiAgICAgICAgICB0eXBlOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgcHJvZ3Jlc3MgYmFyXCIsXG4gICAgICAgIGRlc2M6IFwiRGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgLS0gb25lIHBlciBzbGlkZSwgY2xpY2sgdG8ganVtcFwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93UHJvZ3Jlc3NcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJBdXRvLWVudGVyIHNsaWRlcyBtb2RlXCIsXG4gICAgICAgIGRlc2M6IFwiT3BlbiBkZWNrIG5vdGVzIGRpcmVjdGx5IGluIFNsaWRlcyBtb2RlLiBMZWF2ZSBvZmYgdG8gZW50ZXIgbWFudWFsbHkgd2l0aCB0aGUgVG9nZ2xlIFNsaWRlcyBNb2RlIGNvbW1hbmQgKE1vZCtTaGlmdCtFKSBvciB0aGUgcHJldmlvdXMvbmV4dCBwYWdlIGhvdGtleXMuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImF1dG9FbnRlclNsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkVzY2FwZSBleGl0cyBzbGlkZXMgbW9kZVwiLFxuICAgICAgICBkZXNjOiBcIlByZXNzIGVzY2FwZSB0byBsZWF2ZSBzbGlkZXMgbW9kZSBhbmQgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyB2aWV3XCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImVzY0V4aXRzU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2xpZGVzIHRpdGxlXCIsXG4gICAgICAgIGRlc2M6IFwiRnJvbnRtYXR0ZXIgcHJvcGVydHkgdG8gc2hvdyBhcyB0aGUgY2FyZCB0aXRsZSAoSDEpLiBMZWF2ZSBlbXB0eSBmb3Igbm9uZTsgdHlwZSBgZmlsZW5hbWVgIHRvIHVzZSB0aGUgZmlsZSBuYW1lIFx1MjAxNCB0aGF0IHRpdGxlIGlzIGVkaXRhYmxlIChyZW5hbWVzIHRoZSBub3RlKTsgcHJvcGVydHktYmFja2VkIHRpdGxlcyBhcmUgcmVhZC1vbmx5IChlZGl0IHRoZSBwcm9wZXJ0eSBvdXRzaWRlIHNsaWRlcyBtb2RlKS5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2xpZGVzVGl0bGVcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIkUuZy4gVGl0bGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJCYXIgcHJvcGVydGllc1wiLFxuICAgICAgICBkZXNjOiBcIkNvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyB0byBzaG93IGluIHRoZSBzbGlkZXMgYmFyIChlLmcuIGB1bml2ZXJzaXR5LCBzaG9ydC10aXRsZSwgZGF0ZWApLiBFYWNoIHZhbHVlIGZpbGxzIGFuIGVxdWFsLXdpZHRoIGNvbHVtbjsgZHJhZyBkaXZpZGVycyB0byByZXNpemUuIExlYXZlIGVtcHR5IHRvIHNob3cgbm90aGluZy5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiYmFyUHJvcGVydGllc1wiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiRS5nLiBVbml2ZXJzaXR5LCBkYXRlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ29uZmlybSBzbGlkZSBkZWxldGlvblwiLFxuICAgICAgICBkZXNjOiBcIkFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgc2xpZGVzIHBhbmVsJ3MgcmlnaHQtY2xpY2sgbWVudS4gRGVsZXRpb24gbW92ZXMgc2xpZGVzIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiY29uZmlybURlbGV0ZVNsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIk5hdmlnYXRpb24gaG90a2V5c1wiLFxuICAgICAgICBkZXNjOiBcIkRlZmF1bHQ6IFByZXZpb3VzIHBhZ2UgbW9kK3NoaWZ0K1x1MjE5MCwgbmV4dCBwYWdlIG1vZCtzaGlmdCtcdTIxOTIuIFJlYmluZCB1bmRlciBzZXR0aW5ncyBcdTIxOTIgaG90a2V5cy5cIixcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgLy8gT3BlbiBPYnNpZGlhbidzIGhvdGtleXMgc2V0dGluZ3MgcGFnZSAoaW50ZXJuYWwgQVBJOyBpZ25vcmUgZmFpbHVyZXMpXG4gICAgICAgICAgKFxuICAgICAgICAgICAgdGhpcy5hcHAgYXMgdW5rbm93biBhcyB7IHNldHRpbmc/OiB7IG9wZW5UYWJCeUlkPzogKGlkOiBzdHJpbmcpID0+IHZvaWQgfSB9XG4gICAgICAgICAgKS5zZXR0aW5nPy5vcGVuVGFiQnlJZD8uKFwiaG90a2V5c1wiKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIC8qKiBQZXJzaXN0IGNvbnRyb2wgY2hhbmdlcywgdGhlbiByZWZyZXNoIHRoZSBiYXIgc28gdGhlIG5ldyBzZXR0aW5nIGFwcGxpZXMuICovXG4gIHNldENvbnRyb2xWYWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiB2b2lkIHtcbiAgICB2b2lkIHRoaXMuYXBwbHlDb250cm9sVmFsdWUoa2V5LCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGFwcGx5Q29udHJvbFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICh0aGlzLnBsdWdpbi5zZXR0aW5ncyBhcyB1bmtub3duIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gdmFsdWU7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIEltcGVyYXRpdmUgZmFsbGJhY2sgZm9yIE9ic2lkaWFuIDwgMS4xMy4wIChub3QgY2FsbGVkIHdpdGggZGVmaW5pdGlvbnMgcHJlc2VudCkuICovXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlN0eWxlIHRlbXBsYXRlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgc2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBTTElERVNfVEhFTUVTKSBkcm9wZG93bi5hZGRPcHRpb24odC5pZCwgdC5sYWJlbCk7XG4gICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDZW50ZXIgaW1hZ2VzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJJbWFnZXMgcmVuZGVyIGNlbnRlcmVkIG9uIHRoZSBzbGlkZSBhcyBhIGNhcmQgYmxvY2sgZXhhY3RseSBhcyB0YWxsIGFzIHRoZSBwaWN0dXJlLiBUdXJuIG9mZiBmb3IgT2JzaWRpYW4ncyB1c3VhbCBiZWhhdmlvcjogaW1hZ2VzIHN0YXkgaW5saW5lIHdpdGggdGhlIHRleHQgKGEgc21hbGwgaW1hZ2UgYW5kIGl0cyBjYXB0aW9uIHNpdCBvbiB0aGUgc2FtZSByb3cpLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuaW1hZ2VMYXlvdXQpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmltYWdlTGF5b3V0ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBzbGlkZXMgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcIk1hc3RlciB0b2dnbGUgZm9yIHRoZSBlbnRpcmUgc2xpZGVzIGJhciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3dcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByZXZpb3VzL25leHQgYnV0dG9uc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU2hvdyBcdTI1QzAgXHUyNUI2IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgd2hlbiB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KVwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dOYXZCdXR0b25zID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiUGFnZSBudW1iZXIgc3R5bGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnU2hvd24gYXQgdGhlIGJvdHRvbS1yaWdodC4gXCJuIC8gdG90YWxcIjogMS1iYXNlZCBvdmVyIHRoZSB3aG9sZSBkZWNrIGNoYWluIChoZWFkIHNsaWRlID0gMSkuIFwiblwiOiBqdXN0IHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyLiBcIm5vbmVcIjogaGlkZGVuLicsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PlxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb25zKHtcbiAgICAgICAgICAgIGZyYWN0aW9uOiBcIk4gLyBUb3RhbFwiLFxuICAgICAgICAgICAgY3VycmVudDogXCJOXCIsXG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucGFnZU51bWJlclN0eWxlID0gdmFsdWUgYXMgXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByb2dyZXNzIGJhclwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgLS0gb25lIHBlciBzbGlkZSwgY2xpY2sgdG8ganVtcFwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1Byb2dyZXNzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBdXRvLWVudGVyIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcIlByZXNzIGVzY2FwZSB0byBsZWF2ZSBzbGlkZXMgbW9kZSBhbmQgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyB2aWV3XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNsaWRlcyB0aXRsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRnJvbnRtYXR0ZXIgcHJvcGVydHkgdG8gc2hvdyBhcyB0aGUgY2FyZCB0aXRsZSAoSDEpLiBMZWF2ZSBlbXB0eSBmb3Igbm9uZTsgdHlwZSBgZmlsZW5hbWVgIHRvIHVzZSB0aGUgZmlsZSBuYW1lLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFRpdGxlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQmFyIHByb3BlcnRpZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkNvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyB0byBzaG93IGluIHRoZSBzbGlkZXMgYmFyIChlLmcuIGB1bml2ZXJzaXR5LCBzaG9ydC10aXRsZSwgZGF0ZWApLiBFYWNoIHZhbHVlIGZpbGxzIGFuIGVxdWFsLXdpZHRoIGNvbHVtbjsgZHJhZyBkaXZpZGVycyB0byByZXNpemUuIExlYXZlIGVtcHR5IHRvIHNob3cgbm90aGluZy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRS5nLiBVbml2ZXJzaXR5LCBkYXRlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmJhclByb3BlcnRpZXMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbmZpcm0gc2xpZGUgZGVsZXRpb25cIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgc2xpZGVzIHBhbmVsJ3MgcmlnaHQtY2xpY2sgbWVudS4gRGVsZXRpb24gbW92ZXMgc2xpZGVzIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk5hdmlnYXRpb24gaG90a2V5c1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PlxuICAgICAgICBidXR0b24uc2V0QnV0dG9uVGV4dChcIk9wZW4gaG90a2V5cyBzZXR0aW5nc1wiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG4gIH1cbn1cbiIsICIvKiogUmVtb3ZlIGFsbCBjaGlsZHJlbiBvZiBhbiBlbGVtZW50ICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDaGlsZHJlbihlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBMEJBLElBQUFBLG1CQUE0Qzs7O0FDekJyQyxTQUFTLFlBQXlCO0FBQ3ZDLFFBQU0sTUFBTSxVQUFVLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQztBQUNsRCxNQUFJLGFBQWEsRUFBRSxTQUFTLE9BQU8sQ0FBQztBQUNwQyxNQUFJLFFBQVE7QUFJWixNQUFJLGlCQUFpQixhQUFhLENBQUMsTUFBTTtBQUN2QyxNQUFFLGVBQWU7QUFDakIsVUFBTSxTQUFTLFNBQVM7QUFDeEIsUUFBSSxrQkFBa0IsZUFBZSxXQUFXLFNBQVMsS0FBTSxRQUFPLEtBQUs7QUFBQSxFQUM3RSxDQUFDO0FBQ0QsU0FB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LGFBQUssSUFBSSxZQUFZLFNBQVM7QUFBQSxNQUNoQztBQUFBLElBQ0Y7QUFHQSxVQUFNLFNBQVMsT0FBTyxLQUFLLFlBQVksT0FBTyxJQUFJLElBQUksQ0FBQztBQUN2RCxRQUFJLE9BQU8sU0FBUyxHQUFHO0FBQ3JCLFlBQU0sT0FBTyxXQUFXO0FBQUEsUUFDdEIsS0FBSztBQUFBLFFBQ0wsTUFBTSxZQUFPLE9BQU8sS0FBSyxJQUFJO0FBQUEsUUFDN0IsTUFBTSxFQUFFLE9BQU8sNERBQXVEO0FBQUEsTUFDeEUsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLG9CQUFvQixVQUFVLE1BQU07QUFHcEQsWUFBTSxRQUFRLEtBQUssTUFBTTtBQUN6QixZQUFNLE9BQU8sV0FBVztBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLE1BQ0UsS0FBSyxTQUFTLG9CQUFvQixhQUM5QixHQUFHLEtBQUssUUFBUSxDQUFDLE1BQU0sS0FBSyxLQUM1QixHQUFHLEtBQUssUUFBUSxDQUFDO0FBQUEsTUFDekIsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLGdCQUFnQixRQUFRLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFDL0QsWUFBTSxXQUFXLFVBQVUsRUFBRSxLQUFLLHlCQUF5QixDQUFDO0FBQzVELGVBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVEsS0FBSztBQUMxQyxjQUFNLFFBQVEsSUFBSSxLQUFLLFFBQVEsU0FBUyxNQUFNLEtBQUssUUFBUSxZQUFZO0FBQ3ZFLGNBQU0sTUFBTSxVQUFVO0FBQUEsVUFDcEIsS0FBSywwREFBMEQsS0FBSztBQUFBLFFBQ3RFLENBQUM7QUFDRCxZQUFJLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGlCQUFTLFlBQVksR0FBRztBQUFBLE1BQzFCO0FBQ0EsV0FBSyxJQUFJLFlBQVksUUFBUTtBQUFBLElBQy9CO0FBSUEsU0FBSyxJQUFJLGFBQWEsRUFBRSxTQUFTLEtBQUssSUFBSSxzQkFBc0IsSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUFBLEVBQ25GO0FBQ0Y7QUFHQSxTQUFTLGFBQWEsT0FBZ0IsT0FBa0M7QUFDdEUsU0FDRSxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sV0FBVyxTQUFTLE1BQU0sTUFBTSxDQUFDLE1BQU0sT0FBTyxNQUFNLFFBQVE7QUFFOUY7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgIm5ld05hbWUiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
