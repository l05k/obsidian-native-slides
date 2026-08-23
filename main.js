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

// src/commands.ts
var import_obsidian3 = require("obsidian");

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
    id: "ns-new-deck",
    name: "New slides deck",
    callback: async () => {
      let baseName = "untitled-overview";
      let counter = 1;
      while (plugin.app.vault.getAbstractFileByPath(`${baseName}.md`)) {
        baseName = `untitled-overview-${counter}`;
        counter++;
      }
      const template = `---
deck: ["[[run-create-next-slide-command-to-create-first-slide]]"]
---

# Overview

This is the **overview page** of your deck. The \`deck\` property has a placeholder link \u2014 run the **Create Next Slide** command to create your first slide automatically.

## Base view: all slides

\`\`\`base
filters:
  and:
    - file.hasLink("${baseName}")
    - "!deck.isEmpty()"
views:
  - type: table
    name: Slides
\`\`\`

> If the Base view does not render: enable the core **Bases** plugin
> (_Settings \u2192 Core plugins \u2192 Bases_), then reload this note.

## How to add slides

1. **Create the first slide:** Run the **Create Next Slide** command (\`Cmd/Ctrl+Shift+P\` \u2192 "Create Next Slide") \u2014 a new slide is created after this overview, and the \`deck\` property is rewired automatically.
2. **Add more slides:** Open any slide and run **Create Next Slide** again \u2014 each run appends a new slide after the current one.
3. **Enter Slides mode:** Open any slide and press \`Cmd/Ctrl+Shift+E\` to enter the immersive card view.

**Convention for the \`deck\` property** (one property, up to two links):

- **Overview page:** \`deck: ["[[first-slide]]"]\` \u2014 one link = the first page.
- **Slide page:** \`deck: ["[[overview]]", "[[next-slide]]"]\` \u2014 first link = the overview page, second link = the next slide (omit it on the last slide).

Page numbers are computed automatically by walking these links, so no \`page-number\` property is needed.
`;
      try {
        const file = await plugin.app.vault.create(`${baseName}.md`, template);
        const leaf = plugin.app.workspace.getLeaf(false);
        await leaf.openFile(file, { state: { mode: "source" } });
        new import_obsidian3.Notice(`Native Slides: Created "${baseName}.md"`);
      } catch (error) {
        new import_obsidian3.Notice(`Native Slides: could not create "${baseName}.md" (${String(error)})`);
      }
    }
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
var import_obsidian4 = require("obsidian");

// src/deck.ts
var MAX_DECK_LINKS = 2;
function computeDeck(currentPath, getLinks) {
  const currentLinks = getLinks(currentPath);
  if (currentLinks.length === 0) return null;
  let overview;
  let firstPage;
  if (currentLinks.length >= 2) {
    overview = currentLinks[0];
    firstPage = getLinks(overview)[0];
  } else {
    const only = currentLinks[0];
    const onlyLinks = getLinks(only);
    if (onlyLinks[0] === currentPath) {
      overview = currentPath;
      firstPage = only;
    } else {
      overview = only;
      firstPage = onlyLinks[0];
    }
  }
  if (!overview || !firstPage) return null;
  const chain = [];
  const visited = /* @__PURE__ */ new Set();
  const push = (p) => {
    if (p && !visited.has(p)) {
      visited.add(p);
      chain.push(p);
    }
  };
  push(overview);
  push(firstPage);
  let cur = firstPage;
  while (cur) {
    const next = getLinks(cur)[1];
    if (!next || visited.has(next)) break;
    push(next);
    cur = next;
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
  const { currentName, currentLinks, isOverview } = input;
  if (currentLinks.length === 0) return null;
  if (isOverview) {
    const oldFirst = currentLinks[0];
    if (!oldFirst) return null;
    const oldFirstName = extractLinkText(oldFirst);
    const firstPageExists = oldFirstName && input.existingNames.has(oldFirstName);
    const newName2 = oldFirstName && !firstPageExists ? oldFirstName : uniqueName(`${currentName}-next`, input.existingNames);
    const back = input.overviewBackLink ?? `[[${currentName}]]`;
    return {
      newName: newName2,
      newDeckLinks: firstPageExists ? [back, oldFirst] : [back],
      rewrites: [{ name: currentName, deck: [`[[${newName2}]]`] }]
    };
  }
  const overviewLink = currentLinks[0];
  if (!overviewLink) return null;
  const nextLink = currentLinks[1];
  if (nextLink) {
    const nextName = extractLinkText(nextLink);
    if (nextName && isPlainName(nextName) && nextName !== currentName) {
      if (!input.existingNames.has(nextName)) {
        return {
          newName: nextName,
          newDeckLinks: [overviewLink],
          rewrites: []
        };
      }
      const newName2 = uniqueName(`${currentName}-next`, input.existingNames);
      return {
        newName: newName2,
        newDeckLinks: [overviewLink, nextLink],
        rewrites: [{ name: currentName, deck: [overviewLink, `[[${newName2}]]`] }]
      };
    }
  }
  const newName = uniqueName(`${currentName}-next`, input.existingNames);
  return {
    newName,
    newDeckLinks: [overviewLink],
    rewrites: [{ name: currentName, deck: [overviewLink, `[[${newName}]]`] }]
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
  /** Resolve the current note's position inside its deck (path-based wrapper) */
  compute(file) {
    return computeDeck(file.path, (path) => this.linkPaths(path));
  }
  /** Resolve the `deck` property of a note into real note paths (max two) */
  linkPaths(path) {
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian4.TFile)) return [];
    const fm = frontmatterOf(this.app, f);
    const names = fm ? extractLinks(fm[DECK_KEY]) : [];
    return names.map((name) => this.app.metadataCache.getFirstLinkpathDest(name, path)).filter((x) => !!x).map((x) => x.path);
  }
  /** Names in the `deck` property that resolve to no note (broken links) */
  broken(file) {
    const fm = frontmatterOf(this.app, file);
    const names = fm ? extractLinks(fm[DECK_KEY]) : [];
    return names.filter((name) => !this.app.metadataCache.getFirstLinkpathDest(name, file.path));
  }
  /**
   * Plan a "Create Next Slide" run for the active note, or null when the
   * note cannot take a next slide (no usable `deck` property).
   *
   * Slides on the chain insert/append after the current note; the overview
   * page inserts a new first page; an off-chain note with a resolvable
   * overview link still gets its declared missing next note created.
   */
  planCreateNext(file) {
    const fm = frontmatterOf(this.app, file);
    const raw = fm ? extractRawLinks(fm[DECK_KEY]) : [];
    if (raw.length === 0) return null;
    const deck = this.compute(file);
    const existingNames = new Set(this.app.vault.getMarkdownFiles().map((f) => f.basename));
    if (deck) {
      let overviewBackLink;
      if (deck.index === 0) {
        const oldFirst = deck.chain[1] ? this.app.vault.getAbstractFileByPath(deck.chain[1]) : null;
        if (oldFirst instanceof import_obsidian4.TFile) {
          const f2 = frontmatterOf(this.app, oldFirst);
          overviewBackLink = f2 ? extractRawLinks(f2[DECK_KEY])[0] : void 0;
        }
      }
      return planCreateNext({
        currentName: file.basename,
        currentLinks: raw,
        isOverview: deck.index === 0,
        overviewBackLink,
        existingNames
      });
    }
    if (raw.length === 1) {
      const firstSlideName = extractLinks(raw[0])[0];
      if (firstSlideName && !this.app.metadataCache.getFirstLinkpathDest(firstSlideName, file.path)) {
        return planCreateNext({
          currentName: file.basename,
          currentLinks: raw,
          isOverview: true,
          overviewBackLink: `[[${file.basename}]]`,
          existingNames
        });
      }
    }
    const overviewName = raw.length >= 2 ? extractLinks(raw[0])[0] : null;
    if (overviewName && this.app.metadataCache.getFirstLinkpathDest(overviewName, file.path)) {
      return planCreateNext({
        currentName: file.basename,
        currentLinks: raw,
        isOverview: false,
        existingNames
      });
    }
    return null;
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
      new import_obsidian4.Notice(`Native Slides: could not create "${plan.newName}.md" (${String(error)})`);
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
      'Shown at the bottom-right. "N / Total": overview = page 0, content from 1, total excludes overview. "N": just the current page number. "None": hidden.'
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
      const total = deck.chain.length - 1;
      page.textContent = this.settings.pageNumberStyle === "fraction" ? `${deck.index} / ${total}` : `${deck.index}`;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9kZWNrLXNlcnZpY2UudHMiLCAic3JjL2RlY2sudHMiLCAic3JjL2NyZWF0ZU5leHQudHMiLCAic3JjL3NldHRpbmdzLnRzIiwgInNyYy91dGlscy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBuYXRpdmUtc2xpZGVzIFx1MjAxNCBhIFwiU2xpZGVzIG1vZGVcIiBmb3IgT2JzaWRpYW4gZGVjayBub3Rlc1xuICpcbiAqIE9uZSByZXNlcnZlZCBmcm9udG1hdHRlciBrZXksIGBkZWNrYCAodXAgdG8gdHdvIG1hcmtkb3duIGxpbmtzKSwgZHJpdmVzXG4gKiBwcmV2L25leHQgbmF2aWdhdGlvbiBhbmQgYXV0by1jb21wdXRlZCBwYWdlIG51bWJlcnMuIEEgZGVjayBub3RlIGNhbiBiZVxuICogZW50ZXJlZCBpbnRvICoqU2xpZGVzIG1vZGUqKiBcdTIwMTQgYW4gaW1tZXJzaXZlLCBlZGl0YWJsZSAoTGl2ZSBQcmV2aWV3KSB2aWV3XG4gKiB3aXRoIGEgc2xpZGVzIGJhciBzaG93aW5nIHByb3BlcnRpZXMsIG5hdmlnYXRpb24gYW5kIHRoZSBwYWdlIG51bWJlci5cbiAqXG4gKiBOYXRpdmUgT2JzaWRpYW4gbW9kZXMgKFNvdXJjZSAvIGRlZmF1bHQgTGl2ZSBQcmV2aWV3IC8gUmVhZGluZyB2aWV3KSBhcmVcbiAqIGxlZnQgY29tcGxldGVseSB1bnRvdWNoZWQ6IG5vIHN0YXR1cy1iYXIgaGlkaW5nLCBubyBzbGlkZXMgYmFyLCBub1xuICogZnVsbHNjcmVlbiwgbm8gc3R5bGluZy4gU2xpZGVzIG1vZGUgaXMgdGhlIHBsdWdpbidzIG9ubHkgc3VyZmFjZS5cbiAqXG4gKiBUaGlzIGZpbGUgaXMgdGhlIGVudHJ5IHBvaW50IGFuZCBhIHRoaW4gb3JjaGVzdHJhdGlvbiBsYXllcjsgdGhlIGxvZ2ljXG4gKiBsaXZlcyBpbiBgc3JjL2A6XG4gKiAgIC0gc3JjL3R5cGVzLnRzICAgICAgICBzZXR0aW5ncyBzaGFwZSArIGRlZmF1bHRzICsgcmVzZXJ2ZWQgYGRlY2tgIGtleVxuICogICAtIHNyYy9tb2RlLnRzICAgICAgICAgdmlldyBtb2RlIC8gZnJvbnRtYXR0ZXIgaGVscGVycyAocHVyZSwgYEFwcGAtYmFzZWQpXG4gKiAgIC0gc3JjL2RlY2stc2VydmljZS50cyBkZWNrIGNoYWluIHJlc29sdXRpb24gKyBcImNyZWF0ZSBuZXh0IHNsaWRlXCIgZ2x1ZVxuICogICAtIHNyYy9iYXIudHMgICAgICAgICAgYmFyIERPTSBoZWxwZXJzIChjcmVhdGUgLyBidXR0b25zIC8gdGFiLWJhciBtZWFzdXJlKVxuICogICAtIHNyYy9jb21tYW5kcy50cyAgICAgY29tbWFuZCByZWdpc3RyYXRpb24gKGRldi1nYXRlZCBkZWJ1ZyBjb21tYW5kKVxuICogICAtIHNyYy9zZXR0aW5ncy50cyAgICAgc2V0dGluZ3MgdGFiXG4gKiAgIC0gc3JjL2RlYnVnLnRzICAgICAgICB0eXBvZ3JhcGh5IG1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSlcbiAqICAgLSBzcmMvZGVjay50cyAgICAgICAgIHB1cmUgZGVjayBjb3JlICh3aXRoIHNyYy9jcmVhdGVOZXh0LnRzKVxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlIH0gZnJvbSBcIi4vc3JjL2RlY2tcIjtcbmltcG9ydCB7IGFjdGl2ZUZyb250bWF0dGVyLCBjdXJyZW50TW9kZSwgZnJvbnRtYXR0ZXJPZiwgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL3NyYy9tb2RlXCI7XG5pbXBvcnQgeyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIH0gZnJvbSBcIi4vc3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBERUNLX0tFWSwgREVGQVVMVF9TRVRUSU5HUywgU0xJREVTX1RIRU1FUywgdHlwZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB9IGZyb20gXCIuL3NyYy90eXBlc1wiO1xuaW1wb3J0IHsgY2xlYXJDaGlsZHJlbiB9IGZyb20gXCIuL3NyYy91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXRpdmVTbGlkZXNQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAvKiogVGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKi9cbiAgYmFyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWUgKi9cbiAgZGVja1NlcnZpY2UhOiBEZWNrU2VydmljZTtcbiAgLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuICBzZXR0aW5nczogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7IC4uLkRFRkFVTFRfU0VUVElOR1MgfTtcblxuICAvKiogV2hldGhlciBTbGlkZXMgbW9kZSBpcyBjdXJyZW50bHkgYWN0aXZlIChzZXNzaW9uIHN0YXRlLCBub3QgcGVyc2lzdGVkKSAqL1xuICBwcml2YXRlIHNsaWRlc01vZGUgPSBmYWxzZTtcbiAgLyoqIFZpZXcgbW9kZSB0byByZXN0b3JlIHdoZW4gbGVhdmluZyBTbGlkZXMgbW9kZSAoXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiKSAqL1xuICBwcml2YXRlIGV4aXRNb2RlOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgPSBcInNvdXJjZVwiO1xuICAvKiogV2hldGhlciB0aGUgZXhpdCB2aWV3IHdhcyBTb3VyY2UgbW9kZSAodHJ1ZSkgdnMgTGl2ZSBQcmV2aWV3IChmYWxzZSkgKi9cbiAgcHJpdmF0ZSBleGl0U291cmNlID0gZmFsc2U7XG4gIC8qKiBMYXN0IG5vdGUgYXV0by1lbnRlcmVkIGludG8gU2xpZGVzIG1vZGUgKHByZXZlbnRzIHJlLWVudGVyaW5nIGFmdGVyIG1hbnVhbCBleGl0KSAqL1xuICBwcml2YXRlIGF1dG9FbnRlcmVkUGF0aCA9IFwiXCI7XG4gIC8qKiBMYXN0IHJlZnJlc2gga2V5IChcInBhdGh8bW9kZVwiKSB0byBhdm9pZCBwb2ludGxlc3MgcmUtcmVuZGVycyAqL1xuICBwcml2YXRlIGxhc3RLZXkgPSBcIlwiO1xuICAvKiogTGFzdCBtZWFzdXJlZCB0YWItYmFyIGhlaWdodCAocHgpIFx1MjAxNCBjYWNoZWQgd2hpbGUgdGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuICovXG4gIHByaXZhdGUgdGFiQmFySGVpZ2h0ID0gMDtcbiAgLyoqIFdoZXRoZXIgdGhlIG1vdXNlIHBvaW50ZXIgaXMgaGlkZGVuIGZvciBwcmVzZW50aW5nIChzZXNzaW9uIHN0YXRlKSAqL1xuICBwb2ludGVySGlkZGVuID0gZmFsc2U7XG5cbiAgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy5kZWNrU2VydmljZSA9IG5ldyBEZWNrU2VydmljZSh0aGlzLmFwcCk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAxLiBSZWZyZXNoIG9uIFwiY3VycmVudCBub3RlIC8gdmlldyBjaGFuZ2VkXCIgZXZlbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubWF5YmVBdXRvRW50ZXJTbGlkZXMoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZWZyZXNoKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIC8vIFJlZnJlc2ggd2hlbiB0aGUgbm90ZSBjb250ZW50IChpbmNsdWRpbmcgZnJvbnRtYXR0ZXIpIGNoYW5nZXMgLyBzYXZlc1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChmaWxlOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDIuIEZhbGxiYWNrIHRpbWVyOiBlZGl0XHUyMTk0cmVhZGluZyB0b2dnbGVzIG1heSBmaXJlIG5vIHN0YW5kYXJkIGV2ZW50IFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbChcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBjb25zdCBrZXkgPSBmaWxlID8gYCR7ZmlsZS5wYXRofXwke2N1cnJlbnRNb2RlKHRoaXMuYXBwKX1gIDogXCJcIjtcbiAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5sYXN0S2V5KSB7XG4gICAgICAgICAgdGhpcy5sYXN0S2V5ID0ga2V5O1xuICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMy4gQ29tbWFuZHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgcmVnaXN0ZXJDb21tYW5kcyh0aGlzKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA0LiBQaW4gdGhlIFNsaWRlcyBlZGl0b3IgdG8gb25lIHNjcmVlbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvLyBDU1MgYG92ZXJmbG93OiBoaWRkZW5gIGJsb2NrcyB0aGUgd2hlZWwsIGJ1dCBuYXRpdmUgZHJhZy1zZWxlY3RcbiAgICAvLyBhdXRvc2Nyb2xsIGFuZCBDb2RlTWlycm9yJ3MgcHJvZ3JhbW1hdGljIHNjcm9sbEludG9WaWV3IHN0aWxsIG1vdmUgdGhlXG4gICAgLy8gc2Nyb2xsZXIuIFRoaXMgY2FwdHVyZS1waGFzZSBsaXN0ZW5lciByZXNldHMgYW55IHNjcm9sbCBpbnNpZGUgdGhlXG4gICAgLy8gYWN0aXZlIG1hcmtkb3duIHZpZXcgYmFjayB0byB0aGUgdG9wIHdoaWxlIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZS5cbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoXG4gICAgICBkb2N1bWVudCxcbiAgICAgIFwic2Nyb2xsXCIsXG4gICAgICAoZXZ0KSA9PiB7XG4gICAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHJldHVybjtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmICghdmlldykgcmV0dXJuO1xuICAgICAgICBjb25zdCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICAgIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHZpZXcuY29udGVudEVsLmNvbnRhaW5zKGVsKSkge1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxUb3AgIT09IDApIGVsLnNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgaWYgKGVsLnNjcm9sbExlZnQgIT09IDApIGVsLnNjcm9sbExlZnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgeyBjYXB0dXJlOiB0cnVlIH0sXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA1LiBFc2NhcGUga2V5IGV4aXRzIFNsaWRlcyBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChkb2N1bWVudCwgXCJrZXlkb3duXCIsIChldnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChldnQua2V5ID09PSBcIkVzY2FwZVwiICYmIHRoaXMuc2xpZGVzTW9kZSAmJiB0aGlzLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzKSB7XG4gICAgICAgIHRoaXMuZXhpdFNsaWRlcygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDYuIENyZWF0ZSB0aGUgc2xpZGVzIGJhciBhbmQgZG8gdGhlIGZpcnN0IHJlbmRlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLmJhciA9IGNyZWF0ZUJhcigpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5iYXIpO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgb251bmxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5iYXI/LnJlbW92ZSgpO1xuICAgIHRoaXMuYmFyID0gbnVsbDtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIik7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1wb2ludGVyLWhpZGRlblwiKTtcbiAgICB0aGlzLnJlbW92ZVRoZW1lQ2xhc3NlcygpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFNldHRpbmdzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVTZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFNsaWRlcyBtb2RlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIC8qKiBXaGV0aGVyIHRoZSBhY3RpdmUgbm90ZSBpcyBhIGRlY2sgbm90ZSAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KSAqL1xuICBwcml2YXRlIGlzRGVja05vdGUoZmlsZTogVEZpbGUgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICByZXR1cm4gZm0gIT09IG51bGwgJiYgREVDS19LRVkgaW4gZm07XG4gIH1cblxuICAvKiogUmVtb3ZlIGV2ZXJ5IGBuYXRpdmUtc2xpZGVzLXRoZW1lLSpgIGNsYXNzIGZyb20gPGJvZHk+ICovXG4gIHByaXZhdGUgcmVtb3ZlVGhlbWVDbGFzc2VzKCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgY2xzIG9mIEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpKSB7XG4gICAgICBpZiAoY2xzLnN0YXJ0c1dpdGgoXCJuYXRpdmUtc2xpZGVzLXRoZW1lLVwiKSkgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIHNpbmdsZSBgbmF0aXZlLXNsaWRlcy10aGVtZS08aWQ+YCBib2R5IGNsYXNzIGluIHN5bmMgd2l0aCB0aGVcbiAgICogYHNsaWRlc1RoZW1lYCBzZXR0aW5nIFx1MjAxNCB0aGUgc3R5bGUgdGVtcGxhdGVzIGluIHN0eWxlcy5jc3MgaG9vayBvZmYgaXQuXG4gICAqIFVua25vd24gaWRzIChlLmcuIGFmdGVyIGEgZG93bmdyYWRlKSBmYWxsIGJhY2sgdG8gdGhlIGRlZmF1bHQgdGhlbWUuXG4gICAqL1xuICBwcml2YXRlIGFwcGx5VGhlbWVDbGFzcygpOiB2b2lkIHtcbiAgICBjb25zdCBpZCA9IFNMSURFU19USEVNRVMuc29tZSgodCkgPT4gdC5pZCA9PT0gdGhpcy5zZXR0aW5ncy5zbGlkZXNUaGVtZSlcbiAgICAgID8gdGhpcy5zZXR0aW5ncy5zbGlkZXNUaGVtZVxuICAgICAgOiBERUZBVUxUX1NFVFRJTkdTLnNsaWRlc1RoZW1lO1xuICAgIGNvbnN0IGNscyA9IGBuYXRpdmUtc2xpZGVzLXRoZW1lLSR7aWR9YDtcbiAgICBmb3IgKGNvbnN0IGMgb2YgQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNsYXNzTGlzdCkpIHtcbiAgICAgIGlmIChjLnN0YXJ0c1dpdGgoXCJuYXRpdmUtc2xpZGVzLXRoZW1lLVwiKSAmJiBjICE9PSBjbHMpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGNscyk7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlIGhpZGluZyB0aGUgbW91c2UgcG9pbnRlciB3aW5kb3ctd2lkZSBmb3IgcHJlc2VudGluZy4gSGlkaW5nIGFsc29cbiAgICogcGFya3MgZm9jdXMgKGJsdXJzIHRoZSBlZGl0b3IsIHNvIHRoZSBjYXJldCBkaXNhcHBlYXJzKTsgc2hvd2luZyBsZWF2ZXNcbiAgICogZm9jdXMgcGFya2VkIFx1MjAxNCBjbGljayBzbGlkZSBjb250ZW50IHRvIHJlc3VtZSBlZGl0aW5nLlxuICAgKi9cbiAgdG9nZ2xlUG9pbnRlcigpOiB2b2lkIHtcbiAgICB0aGlzLnBvaW50ZXJIaWRkZW4gPSAhdGhpcy5wb2ludGVySGlkZGVuO1xuICAgIGlmICh0aGlzLnBvaW50ZXJIaWRkZW4pIHtcbiAgICAgIGNvbnN0IGFjdGl2ZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgYWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSBhY3RpdmUuYmx1cigpO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBgbmF0aXZlLXNsaWRlcy1wb2ludGVyLWhpZGRlbmAgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIHByZXNlbnRpbmcgc3RhdGUgXHUyMDE0IHN0eWxlcy5jc3MgdHVybnMgZXZlcnkgY3Vyc29yIGludmlzaWJsZSB3aGlsZSBzZXQuXG4gICAqIExlYXZpbmcgU2xpZGVzIG1vZGUgYWx3YXlzIHJlc3RvcmVzIHRoZSBwb2ludGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBzeW5jUG9pbnRlckNsYXNzKHNsaWRlczogYm9vbGVhbik6IHZvaWQge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5cIiwgc2xpZGVzICYmIHRoaXMucG9pbnRlckhpZGRlbik7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjYXJkIHRpdGxlIChhbiBIMSBpbnNpZGUgdGhlIGNhcmQpIHBlciB0aGUgYHNsaWRlc1RpdGxlYFxuICAgKiBzZXR0aW5nLCB2aWEgdGhlIGAuY20tY29udGVudGAgZGF0YS1zbGlkZXMtdGl0bGUgYXR0cmlidXRlIFx1MjAxNCB0aGUgQ1NTXG4gICAqIDo6YmVmb3JlIHBzZXVkby1lbGVtZW50IHJlbmRlcnMgaXQuIFwiXCIgKGRlZmF1bHQpIHNob3dzIG5vdGhpbmc7XG4gICAqIFwiZmlsZW5hbWVcIiB1c2VzIHRoZSBmaWxlIG5hbWU7IGFueSBvdGhlciB2YWx1ZSBuYW1lcyBhIGZyb250bWF0dGVyXG4gICAqIHByb3BlcnR5LiBUaGUgZmlsZSBuYW1lIChpbmxpbmUgdGl0bGUpIG91dHNpZGUgdGhlIGNhcmQgaXMgYWx3YXlzIGhpZGRlblxuICAgKiBieSBDU1MgaW4gU2xpZGVzIG1vZGUuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUlubGluZVRpdGxlKHNsaWRlczogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB2aWV3Py5jb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgICBpZiAoIWNvbnRlbnQgfHwgIWZpbGUpIHJldHVybjtcblxuICAgIGxldCB0ZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBpZiAoc2xpZGVzKSB7XG4gICAgICBjb25zdCBzcmMgPSB0aGlzLnNldHRpbmdzLnNsaWRlc1RpdGxlLnRyaW0oKTtcbiAgICAgIGlmIChzcmMgPT09IFwiZmlsZW5hbWVcIikge1xuICAgICAgICB0ZXh0ID0gZmlsZS5iYXNlbmFtZTtcbiAgICAgIH0gZWxzZSBpZiAoc3JjKSB7XG4gICAgICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgICAgIGNvbnN0IHYgPSBmbT8uW3NyY107XG4gICAgICAgIGlmICh2ICE9IG51bGwpIHtcbiAgICAgICAgICB0ZXh0ID0gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgPyB2IDogQXJyYXkuaXNBcnJheSh2KSA/IHYuam9pbihcIiwgXCIpIDogU3RyaW5nKHYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRleHQpIGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIiwgdGV4dCk7XG4gICAgZWxzZSBjb250ZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpO1xuICB9XG5cbiAgLyoqIEVudGVyIFNsaWRlcyBtb2RlOiByZWNvcmQgdGhlIGV4aXQgc3RhdGUgYW5kIGZvcmNlIHRoZSBMaXZlIFByZXZpZXcgKi9cbiAgcHJpdmF0ZSBhc3luYyBlbnRlclNsaWRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAodmlldykge1xuICAgICAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBtb2RlPzogc3RyaW5nOyBzb3VyY2U/OiBib29sZWFuIH07XG4gICAgICB0aGlzLmV4aXRNb2RlID0gc3RhdGUubW9kZSA9PT0gXCJwcmV2aWV3XCIgPyBcInByZXZpZXdcIiA6IFwic291cmNlXCI7XG4gICAgICB0aGlzLmV4aXRTb3VyY2UgPSBzdGF0ZS5zb3VyY2UgPT09IHRydWU7XG4gICAgICAvLyBTbGlkZXMgbW9kZSBpcyBhbHdheXMgdGhlIGVkaXRhYmxlIExpdmUgUHJldmlld1xuICAgICAgY29uc3QgbmV4dCA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIG5leHQuc3RhdGUgPSB7IC4uLm5leHQuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogZmFsc2UgfTtcbiAgICAgIGF3YWl0IHZpZXcubGVhZi5zZXRWaWV3U3RhdGUobmV4dCwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMuc2xpZGVzTW9kZSA9IHRydWU7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKiogRXhpdCBTbGlkZXMgbW9kZTogcmVzdG9yZSB0aGUgdmlldyBtb2RlIHJlY29yZGVkIGF0IGVudHJ5ICovXG4gIHByaXZhdGUgZXhpdFNsaWRlcygpOiB2b2lkIHtcbiAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAodmlldykge1xuICAgICAgY29uc3Qgc3RhdGUgPSB2aWV3LmxlYWYuZ2V0Vmlld1N0YXRlKCk7XG4gICAgICBpZiAodGhpcy5leGl0TW9kZSA9PT0gXCJwcmV2aWV3XCIpIHtcbiAgICAgICAgc3RhdGUuc3RhdGUgPSB7IC4uLnN0YXRlLnN0YXRlLCBtb2RlOiBcInByZXZpZXdcIiB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUuc3RhdGUgPSB7IC4uLnN0YXRlLnN0YXRlLCBtb2RlOiBcInNvdXJjZVwiLCBzb3VyY2U6IHRoaXMuZXhpdFNvdXJjZSB9O1xuICAgICAgfVxuICAgICAgdm9pZCB2aWV3LmxlYWYuc2V0Vmlld1N0YXRlKHN0YXRlLCB7IGZvY3VzOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKiogVG9nZ2xlIFNsaWRlcyBtb2RlIChkZWNrIG5vdGVzIG9ubHkgXHUyMDE0IGVuZm9yY2VkIGJ5IHRoZSBjb21tYW5kKSAqL1xuICB0b2dnbGVTbGlkZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSkgdGhpcy5leGl0U2xpZGVzKCk7XG4gICAgZWxzZSB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIE1vdmUgb25lIHN0ZXAgYmFjay9mb3J3YXJkIGFsb25nIHRoZSBkZWNrIGNoYWluIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpICovXG4gIGFzeW5jIG5hdmlnYXRlKGRpcmVjdGlvbjogXCJwcmV2XCIgfCBcIm5leHRcIik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgaWYgKCFkZWNrKSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltkaXJlY3Rpb24gPT09IFwicHJldlwiID8gZGVjay5pbmRleCAtIDEgOiBkZWNrLmluZGV4ICsgMV07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvKiogSnVtcCB0byBhIHNwZWNpZmljIGluZGV4IGluIHRoZSBkZWNrIGNoYWluIChwcm9ncmVzcyBiYXIgY2xpY2spICovXG4gIGFzeW5jIGp1bXBUbyhpbmRleDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBpZiAoIWRlY2sgfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IGRlY2suY2hhaW4ubGVuZ3RoIHx8IGluZGV4ID09PSBkZWNrLmluZGV4KSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltpbmRleF07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQmFyIHJlbmRlcmluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKipcbiAgICogR2V0IGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgdGhlIGJhciBwcm9wZXJ0aWVzLiBSZXR1cm5zIGFuIGFycmF5IG9mXG4gICAqIHBlcmNlbnRhZ2VzIChzdW1taW5nIHRvIDEwMCkgZm9yIGVhY2ggcHJvcGVydHkuIExvYWRzIGZyb20gc2V0dGluZ3Mgb3JcbiAgICogZGVmYXVsdHMgdG8gZXF1YWwgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRCYXJQcm9wZXJ0eVdpZHRocyhjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgfHwgXCJbXVwiKTtcbiAgICAgIGlmIChcbiAgICAgICAgQXJyYXkuaXNBcnJheShzdG9yZWQpICYmXG4gICAgICAgIHN0b3JlZC5sZW5ndGggPT09IGNvdW50ICYmXG4gICAgICAgIHN0b3JlZC5ldmVyeSgobikgPT4gdHlwZW9mIG4gPT09IFwibnVtYmVyXCIpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHN0b3JlZDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gQXJyYXkoY291bnQpLmZpbGwoMTAwIC8gY291bnQpO1xuICB9XG5cbiAgLyoqIFNhdmUgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIHRvIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRoczogbnVtYmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzID0gSlNPTi5zdHJpbmdpZnkod2lkdGhzKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLyoqIERlY2lkZSB3aGF0IHRoZSBzbGlkZXMgYmFyIHNob3dzLCB0aGVuIHJlLXJlbmRlciBpdCAqL1xuICByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXIpIHJldHVybjtcbiAgICB0aGlzLmFwcGx5VGhlbWVDbGFzcygpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKHRoaXMuYXBwKTtcbiAgICBjb25zdCBpc0NhcmQgPSB0aGlzLmlzRGVja05vdGUoZmlsZSk7XG4gICAgY29uc3QgbGl2ZVByZXZpZXdOb3cgPSBtb2RlID09PSBcInNvdXJjZVwiICYmIGlzTGl2ZVByZXZpZXcodGhpcy5hcHApO1xuXG4gICAgLy8gTGVhdmluZyBhIGRlY2sgbm90ZSwgb3IgbGVhdmluZyB0aGUgTGl2ZSBQcmV2aWV3IChlLmcuIENtZC9DdHJsK0UgdG9cbiAgICAvLyByZWFkaW5nIHZpZXcpLCBlbmRzIFNsaWRlcyBtb2RlIFx1MjAxNCBvbmx5IHRoZSB0b2dnbGUgY29tbWFuZCByZS1lbnRlcnMgaXQuXG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSAmJiAoIWlzQ2FyZCB8fCAhbGl2ZVByZXZpZXdOb3cpKSB7XG4gICAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIHRoZSB0YWIgYmFyIHdoaWxlIGl0IGlzIHN0aWxsIHZpc2libGUgKFNsaWRlcyBtb2RlIGhpZGVzIGl0XG4gICAgLy8gYmVsb3c7IHRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGlzIHJldXNlZCBvbmNlIGhpZGRlbikuXG4gICAgdGhpcy50YWJCYXJIZWlnaHQgPSBzeW5jVGFiQmFySGVpZ2h0KHRoaXMudGFiQmFySGVpZ2h0KTtcblxuICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZSBvbmx5IHdoaWxlIGFjdHVhbGx5IGluIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICBjb25zdCBzbGlkZXMgPSB0aGlzLnNsaWRlc01vZGUgJiYgaXNDYXJkICYmIGxpdmVQcmV2aWV3Tm93O1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiLCBzbGlkZXMpO1xuICAgIGlmICghc2xpZGVzKSB0aGlzLnBvaW50ZXJIaWRkZW4gPSBmYWxzZTsgLy8gbGVhdmluZyBTbGlkZXMgcmVzdG9yZXMgdGhlIHBvaW50ZXJcbiAgICB0aGlzLnN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnVwZGF0ZUlubGluZVRpdGxlKHNsaWRlcyk7XG5cbiAgICBjb25zdCBiYXJWaXNpYmxlID0gc2xpZGVzICYmIHRoaXMuc2V0dGluZ3Muc2hvd1NsaWRlc0JhciAmJiAhdGhpcy5zZXR0aW5ncy5iYXJIaWRkZW47XG4gICAgLy8gV2hlbiBiYXIgaXMgaGlkZGVuLCBzZXQgYm90dG9tIHBhZGRpbmcgdG8gMCBzbyB0aGUgY2FyZCBmaWxscyB0aGUgZnVsbFxuICAgIC8vIHdpbmRvdyBoZWlnaHQuIFdoZW4gdmlzaWJsZSwgcmVtb3ZlIHRoZSBvdmVycmlkZSBzbyBDU1MgZmFsbHMgYmFjayB0b1xuICAgIC8vIC0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0IChjbGVhcnMgdGhlIGJhciBhcyBiZWZvcmUpLlxuICAgIGlmIChiYXJWaXNpYmxlKSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtYmFyLWhlaWdodFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIiwgXCIwcHhcIik7XG4gICAgfVxuICAgIGlmICghYmFyVmlzaWJsZSkge1xuICAgICAgdGhpcy5iYXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWZpbGUpIHJldHVybjsgLy8gYmFyVmlzaWJsZSBpbXBsaWVzIGEgZmlsZSwgYnV0IG5hcnJvdyBmb3IgVHlwZVNjcmlwdFxuXG4gICAgY29uc3QgZm0gPSBhY3RpdmVGcm9udG1hdHRlcih0aGlzLmFwcCk7XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBjbGVhckNoaWxkcmVuKHRoaXMuYmFyKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBMZWZ0OiBwcmV2aW91cyAvIG5leHQgYnV0dG9ucyAoYm90aCBhbHdheXMgc2hvd24gaW5zaWRlIGEgZGVjaztcbiAgICAvLyAgICAgICAgdGhlIG9uZSB0aGF0IGNhbm5vdCBtb3ZlIGlzIGRpc2FibGVkIC8gbGlnaHQgZ3JheSkgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgJiYgZGVjaykge1xuICAgICAgY29uc3QgaGFzUHJldiA9IGRlY2suaW5kZXggPiAwO1xuICAgICAgY29uc3QgaGFzTmV4dCA9IGRlY2suaW5kZXggPCBkZWNrLmNoYWluLmxlbmd0aCAtIDE7XG4gICAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgbmF2LmNsYXNzTmFtZSA9IFwibmF0aXZlLXNsaWRlcy1uYXZcIjtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QzBcIiwgXCJQcmV2aW91cyBwYWdlXCIsICgpID0+IHRoaXMubmF2aWdhdGUoXCJwcmV2XCIpLCAhaGFzUHJldikpO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVCNlwiLCBcIk5leHQgcGFnZVwiLCAoKSA9PiB0aGlzLm5hdmlnYXRlKFwibmV4dFwiKSwgIWhhc05leHQpKTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKG5hdik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1pZGRsZTogY29uZmlndXJlZCBwcm9wZXJ0eSBjb2x1bW5zIHdpdGggZHJhZ2dhYmxlIGRpdmlkZXJzIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHByb3BOYW1lcyA9IHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydGllc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHByb3BOYW1lcy5sZW5ndGggPiAwICYmIGZtKSB7XG4gICAgICBjb25zdCBlbnRyaWVzOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwcm9wTmFtZXMpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gZm0pIHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBmbVtuYW1lXTtcbiAgICAgICAgICBpZiAodmFsICE9IG51bGwpIGVudHJpZXMucHVzaChbbmFtZSwgZm9ybWF0VmFsdWUodmFsKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTmFtZSA9IFwibmF0aXZlLXNsaWRlcy1iYXItcHJvcGVydGllc1wiO1xuXG4gICAgICAgIGNvbnN0IHdpZHRocyA9IHRoaXMuZ2V0QmFyUHJvcGVydHlXaWR0aHMoZW50cmllcy5sZW5ndGgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IFssIHZhbHVlXSA9IGVudHJpZXNbaV07XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gXCJuYXRpdmUtc2xpZGVzLWJhci1wcm9wLWl0ZW1cIjtcbiAgICAgICAgICBpdGVtLnN0eWxlLmZsZXhCYXNpcyA9IGBjYWxjKCR7d2lkdGhzW2ldfSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYDtcbiAgICAgICAgICBpdGVtLnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW0pO1xuXG4gICAgICAgICAgaWYgKGkgPCBlbnRyaWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdmlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgZGl2aWRlci5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtYmFyLWRpdmlkZXJcIjtcbiAgICAgICAgICAgIGRpdmlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgIGNvbnN0IGluaXRpYWxXaWR0aHMgPSBbLi4ud2lkdGhzXTtcbiAgICAgICAgICAgICAgY29uc3Qgb25Nb3ZlID0gKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSAoKGV2LmNsaWVudFggLSBzdGFydFgpIC8gY29udGFpbmVyV2lkdGgpICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xlZnQgPSBNYXRoLm1heCg1LCBpbml0aWFsV2lkdGhzW2ldICsgZGVsdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JpZ2h0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpICsgMV0gLSBkZWx0YSk7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2ldID0gbmV3TGVmdDtcbiAgICAgICAgICAgICAgICB3aWR0aHNbaSArIDFdID0gbmV3UmlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICBcIi5uYXRpdmUtc2xpZGVzLWJhci1wcm9wLWl0ZW1cIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnN0eWxlLmZsZXhCYXNpcyA9XG4gICAgICAgICAgICAgICAgICBgY2FsYygke25ld0xlZnR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2kgKyAxXS5zdHlsZS5mbGV4QmFzaXMgPVxuICAgICAgICAgICAgICAgICAgYGNhbGMoJHtuZXdSaWdodH0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWA7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGNvbnN0IG9uVXAgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdmUpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gXCJcIjtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnVzZXJTZWxlY3QgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5zYXZlQmFyUHJvcGVydHlXaWR0aHMod2lkdGhzKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdmUpO1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvblVwKTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSBcImNvbC1yZXNpemVcIjtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS51c2VyU2VsZWN0ID0gXCJub25lXCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZpZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJyb2tlbiBkZWNrIGxpbmtzIFx1MjE5MiB3YXJuaW5nIGNoaXAgc28gZGVjayBhdXRob3JzIHNwb3QgdHlwb3NcbiAgICBjb25zdCBicm9rZW4gPSBmaWxlID8gdGhpcy5kZWNrU2VydmljZS5icm9rZW4oZmlsZSkgOiBbXTtcbiAgICBpZiAoYnJva2VuLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHdhcm4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIHdhcm4uY2xhc3NOYW1lID0gXCJuYXRpdmUtc2xpZGVzLXdhcm5cIjtcbiAgICAgIHdhcm4udGV4dENvbnRlbnQgPSBcIlx1MjZBMCBcIiArIGJyb2tlbi5qb2luKFwiLCBcIik7XG4gICAgICB3YXJuLnRpdGxlID0gXCJCcm9rZW4gZGVjayBsaW5rKHMpIFx1MjAxNCB0aGUgdGFyZ2V0IG5vdGUgZG9lcyBub3QgZXhpc3RcIjtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHdhcm4pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBCb3R0b20tcmlnaHQ6IGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXIgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlICE9PSBcIm5vbmVcIiAmJiBkZWNrKSB7XG4gICAgICBjb25zdCBwYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBwYWdlLmNsYXNzTmFtZSA9IFwibmF0aXZlLXNsaWRlcy1wYWdlXCI7XG4gICAgICAvLyBjaGFpblswXSBpcyB0aGUgb3ZlcnZpZXcgKHBhZ2UgMCk7IGNvbnRlbnQgc2xpZGVzIHN0YXJ0IGF0IGluZGV4IDEuXG4gICAgICAvLyBUb3RhbCA9IGNvbnRlbnQgcGFnZXMgb25seSAoZXhjbHVkZXMgb3ZlcnZpZXcpLlxuICAgICAgY29uc3QgdG90YWwgPSBkZWNrLmNoYWluLmxlbmd0aCAtIDE7XG4gICAgICBwYWdlLnRleHRDb250ZW50ID1cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPT09IFwiZnJhY3Rpb25cIiA/IGAke2RlY2suaW5kZXh9IC8gJHt0b3RhbH1gIDogYCR7ZGVjay5pbmRleH1gO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFByb2dyZXNzIGluZGljYXRvcjogZGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IGJhciB0b3AgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1Byb2dyZXNzICYmIGRlY2sgJiYgZGVjay5jaGFpbi5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBwcm9ncmVzcy5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3NcIjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVjay5jaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGkgPCBkZWNrLmluZGV4ID8gXCJwYXN0XCIgOiBpID09PSBkZWNrLmluZGV4ID8gXCJjdXJyZW50XCIgOiBcImZ1dHVyZVwiO1xuICAgICAgICBzZWcuY2xhc3NOYW1lID0gYG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnIG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnLS0ke3N0YXRlfWA7XG4gICAgICAgIHNlZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdm9pZCB0aGlzLmp1bXBUbyhpKSk7XG4gICAgICAgIHByb2dyZXNzLmFwcGVuZENoaWxkKHNlZyk7XG4gICAgICB9XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChwcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gSGlkZSB0aGUgc2xpZGVzIGJhciBlbnRpcmVseSB3aGVuIGl0IGhhcyBub3RoaW5nIHRvIGRpc3BsYXkgKG5vIHByb3BlcnRpZXMsXG4gICAgLy8gYW5kIG5vdCBwYXJ0IG9mIGEgZGVjaylcbiAgICB0aGlzLmJhci5zdHlsZS5kaXNwbGF5ID0gdGhpcy5iYXIuY2hpbGRFbGVtZW50Q291bnQgPT09IDAgPyBcIm5vbmVcIiA6IFwiXCI7XG4gIH1cbn1cbiIsICIvKiogQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50IChoaWRkZW4gdW50aWwgcmVmcmVzaCgpIHNob3dzIGl0KSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhcigpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGJhci5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtYmFyXCI7XG4gIGJhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGJhci50aXRsZSA9IFwiQ2xpY2sgdG8gcGFyayB0aGUgbW91c2UgXHUyMDE0IGhpZGVzIHRoZSBlZGl0b3IgY2FyZXQgd2hpbGUgcHJlc2VudGluZ1wiO1xuICAvLyBQcmVzZW50YXRpb24gcGFya2luZzogY2xpY2tpbmcgdGhlIGJhciBrZWVwcyBmb2N1cyBvdXQgb2YgdGhlIGVkaXRvciBzb1xuICAvLyB0aGUgYmxpbmtpbmcgY2FyZXQgZGlzYXBwZWFycy4gcHJldmVudERlZmF1bHQgc3RvcHMgdGhlIGNsaWNrIGZyb20gbW92aW5nXG4gIC8vIGZvY3VzIG9yIHN0YXJ0aW5nIGEgdGV4dCBzZWxlY3Rpb247IGJ1dHRvbnMgc3RpbGwgcmVjZWl2ZSB0aGVpciBjbGljayBldmVudC5cbiAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgYWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSBhY3RpdmUuYmx1cigpO1xuICB9KTtcbiAgcmV0dXJuIGJhcjtcbn1cblxuLyoqIEJ1aWxkIGEgXHUyNUMwIC8gXHUyNUI2IG5hdmlnYXRpb24gYnV0dG9uOyBgZGlzYWJsZWRgIHJlbmRlcnMgaXQgbGlnaHQgZ3JheS9pbmFjdGl2ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hdkJ1dHRvbihcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGlwOiBzdHJpbmcsXG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQsXG4gIGRpc2FibGVkID0gZmFsc2UsXG4pOiBIVE1MQnV0dG9uRWxlbWVudCB7XG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIGJ0bi5jbGFzc05hbWUgPSBcIm5hdGl2ZS1zbGlkZXMtbmF2LWJ0blwiO1xuICBidG4udGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgYnRuLnRpdGxlID0gdGlwO1xuICBidG4uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgaWYgKCFkaXNhYmxlZCkgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSB0b3AgdGFiIGJhciBhbmQgZXhwb3NlIGl0cyBoZWlnaHQgYXMgdGhlIENTUyB2YXJpYWJsZVxuICogLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQsIHJldHVybmluZyB0aGUgKHBvc3NpYmx5IHVwZGF0ZWQpIGNhY2hlZFxuICogdmFsdWUuIFRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSwgc28gdGhlIGxhc3QgbWVhc3VyZWRcbiAqIHZhbHVlIGlzIHJldXNlZCB0aGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bmNUYWJCYXJIZWlnaHQoY2FjaGVkOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICBcIi53b3Jrc3BhY2UtdGFicy5tb2QtdG9wIC53b3Jrc3BhY2UtdGFiLWhlYWRlci1jb250YWluZXJcIixcbiAgKTtcbiAgaWYgKHRhYkJhciAmJiB0YWJCYXIub2Zmc2V0SGVpZ2h0ID4gMCkgY2FjaGVkID0gdGFiQmFyLm9mZnNldEhlaWdodDtcbiAgaWYgKGNhY2hlZCA+IDApIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiLCBgJHtjYWNoZWR9cHhgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBObyBtZWFzdXJlbWVudCB5ZXQgKHRhYiBiYXIgaGlkZGVuIHNpbmNlIGxvYWQpIFx1MjAxNCBsZXQgdGhlIENTUyBmYWxsYmFjayBhcHBseS5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkO1xufVxuIiwgImltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyByZWdpc3RlckRlYnVnQ29tbWFuZCB9IGZyb20gXCIuL2RlYnVnXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKiogUmVnaXN0ZXIgZXZlcnkgY29tbWFuZDsgdGhlIGRlYnVnIGNvbW1hbmQgaXMgZGV2LWJ1aWxkIG9ubHkuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21tYW5kcyhwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICAvLyBUb2dnbGUgdGhlIHNsaWRlcyBiYXIgKHdpdGhpbiBTbGlkZXMgbW9kZSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1iYXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgYmFyXCIsXG4gICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgIHBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW4gPSAhcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAgIGF3YWl0IHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gICAgfSxcbiAgfSk7XG4gIC8vIE5ldyBTbGlkZXMgRGVjayBcdTIwMTQgY3JlYXRlIGFuIG92ZXJ2aWV3IG5vdGUgd2l0aCBCYXNlIGZpbHRlciBhbmQgaW5zdHJ1Y3Rpb25zXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1uZXctZGVja1wiLFxuICAgIG5hbWU6IFwiTmV3IHNsaWRlcyBkZWNrXCIsXG4gICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEZpbmQgYSB1bmlxdWUgbmFtZSBmb3IgdGhlIG92ZXJ2aWV3IG5vdGVcbiAgICAgIGxldCBiYXNlTmFtZSA9IFwidW50aXRsZWQtb3ZlcnZpZXdcIjtcbiAgICAgIGxldCBjb3VudGVyID0gMTtcbiAgICAgIHdoaWxlIChwbHVnaW4uYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgJHtiYXNlTmFtZX0ubWRgKSkge1xuICAgICAgICBiYXNlTmFtZSA9IGB1bnRpdGxlZC1vdmVydmlldy0ke2NvdW50ZXJ9YDtcbiAgICAgICAgY291bnRlcisrO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgb3ZlcnZpZXcgbm90ZSB3aXRoIHRlbXBsYXRlXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGAtLS1cbmRlY2s6IFtcIltbcnVuLWNyZWF0ZS1uZXh0LXNsaWRlLWNvbW1hbmQtdG8tY3JlYXRlLWZpcnN0LXNsaWRlXV1cIl1cbi0tLVxuXG4jIE92ZXJ2aWV3XG5cblRoaXMgaXMgdGhlICoqb3ZlcnZpZXcgcGFnZSoqIG9mIHlvdXIgZGVjay4gVGhlIFxcYGRlY2tcXGAgcHJvcGVydHkgaGFzIGEgcGxhY2Vob2xkZXIgbGluayBcdTIwMTQgcnVuIHRoZSAqKkNyZWF0ZSBOZXh0IFNsaWRlKiogY29tbWFuZCB0byBjcmVhdGUgeW91ciBmaXJzdCBzbGlkZSBhdXRvbWF0aWNhbGx5LlxuXG4jIyBCYXNlIHZpZXc6IGFsbCBzbGlkZXNcblxuXFxgXFxgXFxgYmFzZVxuZmlsdGVyczpcbiAgYW5kOlxuICAgIC0gZmlsZS5oYXNMaW5rKFwiJHtiYXNlTmFtZX1cIilcbiAgICAtIFwiIWRlY2suaXNFbXB0eSgpXCJcbnZpZXdzOlxuICAtIHR5cGU6IHRhYmxlXG4gICAgbmFtZTogU2xpZGVzXG5cXGBcXGBcXGBcblxuPiBJZiB0aGUgQmFzZSB2aWV3IGRvZXMgbm90IHJlbmRlcjogZW5hYmxlIHRoZSBjb3JlICoqQmFzZXMqKiBwbHVnaW5cbj4gKF9TZXR0aW5ncyBcdTIxOTIgQ29yZSBwbHVnaW5zIFx1MjE5MiBCYXNlc18pLCB0aGVuIHJlbG9hZCB0aGlzIG5vdGUuXG5cbiMjIEhvdyB0byBhZGQgc2xpZGVzXG5cbjEuICoqQ3JlYXRlIHRoZSBmaXJzdCBzbGlkZToqKiBSdW4gdGhlICoqQ3JlYXRlIE5leHQgU2xpZGUqKiBjb21tYW5kIChcXGBDbWQvQ3RybCtTaGlmdCtQXFxgIFx1MjE5MiBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIpIFx1MjAxNCBhIG5ldyBzbGlkZSBpcyBjcmVhdGVkIGFmdGVyIHRoaXMgb3ZlcnZpZXcsIGFuZCB0aGUgXFxgZGVja1xcYCBwcm9wZXJ0eSBpcyByZXdpcmVkIGF1dG9tYXRpY2FsbHkuXG4yLiAqKkFkZCBtb3JlIHNsaWRlczoqKiBPcGVuIGFueSBzbGlkZSBhbmQgcnVuICoqQ3JlYXRlIE5leHQgU2xpZGUqKiBhZ2FpbiBcdTIwMTQgZWFjaCBydW4gYXBwZW5kcyBhIG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBvbmUuXG4zLiAqKkVudGVyIFNsaWRlcyBtb2RlOioqIE9wZW4gYW55IHNsaWRlIGFuZCBwcmVzcyBcXGBDbWQvQ3RybCtTaGlmdCtFXFxgIHRvIGVudGVyIHRoZSBpbW1lcnNpdmUgY2FyZCB2aWV3LlxuXG4qKkNvbnZlbnRpb24gZm9yIHRoZSBcXGBkZWNrXFxgIHByb3BlcnR5KiogKG9uZSBwcm9wZXJ0eSwgdXAgdG8gdHdvIGxpbmtzKTpcblxuLSAqKk92ZXJ2aWV3IHBhZ2U6KiogXFxgZGVjazogW1wiW1tmaXJzdC1zbGlkZV1dXCJdXFxgIFx1MjAxNCBvbmUgbGluayA9IHRoZSBmaXJzdCBwYWdlLlxuLSAqKlNsaWRlIHBhZ2U6KiogXFxgZGVjazogW1wiW1tvdmVydmlld11dXCIsIFwiW1tuZXh0LXNsaWRlXV1cIl1cXGAgXHUyMDE0IGZpcnN0IGxpbmsgPSB0aGUgb3ZlcnZpZXcgcGFnZSwgc2Vjb25kIGxpbmsgPSB0aGUgbmV4dCBzbGlkZSAob21pdCBpdCBvbiB0aGUgbGFzdCBzbGlkZSkuXG5cblBhZ2UgbnVtYmVycyBhcmUgY29tcHV0ZWQgYXV0b21hdGljYWxseSBieSB3YWxraW5nIHRoZXNlIGxpbmtzLCBzbyBubyBcXGBwYWdlLW51bWJlclxcYCBwcm9wZXJ0eSBpcyBuZWVkZWQuXG5gO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgcGx1Z2luLmFwcC52YXVsdC5jcmVhdGUoYCR7YmFzZU5hbWV9Lm1kYCwgdGVtcGxhdGUpO1xuICAgICAgICBjb25zdCBsZWFmID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG4gICAgICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZmlsZSwgeyBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0gfSk7XG4gICAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBTbGlkZXM6IENyZWF0ZWQgXCIke2Jhc2VOYW1lfS5tZFwiYCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBuZXcgTm90aWNlKGBOYXRpdmUgU2xpZGVzOiBjb3VsZCBub3QgY3JlYXRlIFwiJHtiYXNlTmFtZX0ubWRcIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcbiAgLy8gSGlkZSAvIHNob3cgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgKHByZXNlbnRpbmc7IFNsaWRlcyBtb2RlIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtcG9pbnRlclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIG1vdXNlIHBvaW50ZXJcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVBvaW50ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBQcmV2aW91cyAvIG5leHQgcGFnZSAoZGVjayBuYXZpZ2F0aW9uOyBlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1wcmV2XCIsXG4gICAgbmFtZTogXCJQcmV2aW91cyBwYWdlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkFycm93TGVmdFwiIH1dLFxuICAgIGNhbGxiYWNrOiAoKSA9PiBwbHVnaW4ubmF2aWdhdGUoXCJwcmV2XCIpLFxuICB9KTtcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLW5leHRcIixcbiAgICBuYW1lOiBcIk5leHQgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd1JpZ2h0XCIgfV0sXG4gICAgY2FsbGJhY2s6ICgpID0+IHBsdWdpbi5uYXZpZ2F0ZShcIm5leHRcIiksXG4gIH0pO1xuICAvLyBDcmVhdGUgTmV4dCBTbGlkZSBcdTIwMTQgbmV3IHNsaWRlIGFmdGVyIHRoZSBjdXJyZW50IG9uZSAoZGVjayBub3RlcyBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5leHRcIixcbiAgICBuYW1lOiBcIkNyZWF0ZSBuZXh0IHNsaWRlXCIsXG4gICAgLy8gR3JleWVkIG91dCBpbiB0aGUgcGFsZXR0ZSB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGNhbiB0YWtlIGEgbmV4dCBzbGlkZVxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gVG9nZ2xlIFNsaWRlcyBtb2RlIFx1MjAxNCB0aGUgaW1tZXJzaXZlIGNhcmQgdmlldyAoZGVjayBub3RlcyBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLXNsaWRlc1wiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIHNsaWRlcyBtb2RlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkVcIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZihwbHVnaW4uYXBwLCBmaWxlKTtcbiAgICAgIGlmIChmbSA9PT0gbnVsbCB8fCAhKERFQ0tfS0VZIGluIGZtKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVNsaWRlcygpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIERlYnVnIHRvb2xpbmcgXHUyMDE0IHJlZ2lzdGVyZWQgb25seSBpbiBkZXYgYnVpbGRzICh0cmVlLXNoYWtlbiBpbiByZWxlYXNlKVxuICBpZiAoREVWX01PREUpIHJlZ2lzdGVyRGVidWdDb21tYW5kKHBsdWdpbik7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL21vZGVcIjtcblxuLyoqXG4gKiBUeXBvZ3JhcGh5LW1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSkuXG4gKlxuICogVGhlIGBucy1kZWJ1Zy1zdHlsZXNgIGNvbW1hbmQgc2FtcGxlcyB0aGUgZml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIGluXG4gKiBlZGl0IChMaXZlIFByZXZpZXcpIGFuZCB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgaW4gcmVhZGluZyB2aWV3LCBtZXJnZXMgdGhlXG4gKiByZXN1bHRzLCBjb21wdXRlcyBhbiBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmQgd3JpdGVzIGl0IHRvXG4gKiAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LiBSZWdpc3RlcmVkIG9ubHkgd2hlbiB0aGVcbiAqIGJ1aWxkLXRpbWUgREVWX01PREUgZmxhZyBpcyB0cnVlOyByZWxlYXNlIGJ1aWxkcyB0cmVlLXNoYWtlIHRoaXMgbW9kdWxlIG91dC5cbiAqL1xuXG4vKiogRml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIHVzZWQgYnkgdGhlIGRlYnVnIGNvbW1hbmQgKGVkaXQgc2lkZSkgKi9cbmV4cG9ydCBjb25zdCBTQU1QTEVfTk9URV9OQU1FUyA9IFtcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1oZWFkaW5nc1wiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLWxpc3RcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1jb2RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtcXVvdGVcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1tZWRpYVwiLFxuXTtcblxuLyoqIFN0eWxlIHNlY3Rpb25zIHNhbXBsZWQgYnkgc2FtcGxlU3R5bGVzKCkgYW5kIGNvbXBhcmVkIGJ5IGRpZmZEdW1wcygpICovXG5jb25zdCBTVFlMRV9TRUNUSU9OUyA9IFtcbiAgXCJjb250YWluZXJcIixcbiAgXCJwYXJhZ3JhcGhcIixcbiAgXCJoMVwiLFxuICBcImxpc3RJdGVtXCIsXG4gIFwiY29kZUJsb2NrXCIsXG4gIFwiYmxvY2txdW90ZVwiLFxuICBcImlubGluZUNvZGVcIixcbiAgXCJ0YWJsZVwiLFxuICBcImltYWdlXCIsXG4gIFwiaG9yaXpvbnRhbFJ1bGVcIixcbl07XG5cbi8qKiBQcm9taXNlLWJhc2VkIHNsZWVwICovXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vKipcbiAqIE1lcmdlIG5vbi1taXNzaW5nIHN0eWxlIHNlY3Rpb25zIG9mIGEgZnJlc2ggc2FtcGxlIGludG8gdGhlIHRhcmdldFxuICogKGZpcnN0IG5vbi1taXNzaW5nIHZhbHVlIHdpbnMpLlxuICovXG5mdW5jdGlvbiBtZXJnZVNhbXBsZSh0YXJnZXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBzYW1wbGU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XG4gIGZvciAoY29uc3Qga2V5IG9mIFNUWUxFX1NFQ1RJT05TKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IHNhbXBsZVtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKCFzZWN0aW9uIHx8IFwiKG1pc3NpbmcpXCIgaW4gc2VjdGlvbikgY29udGludWU7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0YXJnZXRba2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuICAgIGlmIChleGlzdGluZyAmJiAhKFwiKG1pc3NpbmcpXCIgaW4gZXhpc3RpbmcpKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNlY3Rpb247XG4gIH1cbiAgLy8gUHJvYmUgZmllbGRzIHJpZGUgYWxvbmcgKGZpcnN0IG5vbi1lbXB0eSB3aW5zKVxuICBmb3IgKGNvbnN0IGtleSBvZiBbXG4gICAgXCJsaXN0TGluZXNcIixcbiAgICBcIm1ldGFkYXRhQ29udGFpbmVyRGlzcGxheVwiLFxuICAgIFwiaDFPZmZzZXRUb3BcIixcbiAgICBcImgxVG9wSW5Db250ZW50XCIsXG4gICAgXCJoMUxlZnRJbkNvbnRlbnRcIixcbiAgICBcInRpdGxlXCIsXG4gICAgXCJjb250ZW50Q2hpbGRyZW5cIixcbiAgICBcInRvcENoYWluXCIsXG4gIF0pIHtcbiAgICBjb25zdCBwcm9iZSA9IHNhbXBsZVtrZXldO1xuICAgIGlmIChwcm9iZSA9PT0gdW5kZWZpbmVkIHx8IHByb2JlID09PSBudWxsKSBjb250aW51ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9iZSkgJiYgcHJvYmUubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBpZiAodHlwZW9mIHByb2JlID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHByb2JlKSAmJiBPYmplY3Qua2V5cyhwcm9iZSkubGVuZ3RoID09PSAwKVxuICAgICAgY29udGludWU7XG4gICAgaWYgKHRhcmdldFtrZXldID09PSB1bmRlZmluZWQpIHRhcmdldFtrZXldID0gcHJvYmU7XG4gIH1cbn1cblxuLyoqXG4gKiBDb21wYXJlIHRoZSBzdHlsZSBzZWN0aW9ucyBvZiBhbiBlZGl0IGR1bXAgYW5kIGEgcmVhZGluZyBkdW1wOyBvbmx5XG4gKiBrZXlzIHdob3NlIHZhbHVlcyBkaWZmZXIgYXJlIGtlcHQsIGFzIHsga2V5OiB7IGVkaXQsIHJlYWRpbmcgfSB9LlxuICovXG5mdW5jdGlvbiBkaWZmRHVtcHMoXG4gIGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICByZWFkaW5nOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBmb3IgKGNvbnN0IHNlY3Rpb24gb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBlID0gKGVkaXRbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3QgciA9IChyZWFkaW5nW3NlY3Rpb25dID8/IHt9KSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KFsuLi5PYmplY3Qua2V5cyhlKSwgLi4uT2JqZWN0LmtleXMocildKTtcbiAgICBjb25zdCBkaWZmczogUmVjb3JkPHN0cmluZywgeyBlZGl0OiBzdHJpbmc7IHJlYWRpbmc6IHN0cmluZyB9PiA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIGlmIChlW2tleV0gIT09IHJba2V5XSkge1xuICAgICAgICBkaWZmc1trZXldID0geyBlZGl0OiBlW2tleV0gPz8gXCIobWlzc2luZylcIiwgcmVhZGluZzogcltrZXldID8/IFwiKG1pc3NpbmcpXCIgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKGRpZmZzKS5sZW5ndGggPiAwKSBvdXRbc2VjdGlvbl0gPSBkaWZmcztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKiogU2FtcGxlIHRoZSBjdXJyZW50IHZpZXcncyB0eXBvZ3JhcGh5IGNvbXB1dGVkIHN0eWxlcyArIENTUyB2YXJpYWJsZXMgKi9cbmZ1bmN0aW9uIHNhbXBsZVN0eWxlcyhhcHA6IEFwcCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaXNFZGl0ID0gdmlldy5nZXRNb2RlKCkgPT09IFwic291cmNlXCI7XG4gIGNvbnN0IGNvbnRlbnRFbCA9IHZpZXcuY29udGVudEVsO1xuICAvLyBGaXJzdCBtYXRjaGluZyBjYW5kaWRhdGUgd2lucyBcdTIwMTQgZWRpdCAoY202KSBhbmQgcmVhZGluZyB1c2VcbiAgLy8gZGlmZmVyZW50IGVsZW1lbnQgc3RydWN0dXJlcyAoZS5nLiBubyBwcmUvYmxvY2txdW90ZSBpbiBjbTYpLlxuICBjb25zdCBwaWNrID0gKHNlbHM6IHN0cmluZ1tdKTogSFRNTEVsZW1lbnQgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBzZWxzKSB7XG4gICAgICBjb25zdCBlbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihzZWwpO1xuICAgICAgaWYgKGVsKSByZXR1cm4gZWw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBjb25zdCBzdHlsZSA9IChlbDogSFRNTEVsZW1lbnQgfCBudWxsLCBwcm9wczogc3RyaW5nW10pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgICBpZiAoIWVsKSByZXR1cm4geyBcIihtaXNzaW5nKVwiOiBcImVsZW1lbnQgbm90IGluIHRoaXMgbm90ZVwiIH07XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgcHJvcHMpIHtcbiAgICAgIGNvbnN0IHYgPSBjcy5nZXRQcm9wZXJ0eVZhbHVlKHApLnRyaW0oKTtcbiAgICAgIGlmICh2KSBvdXRbcF0gPSB2O1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCB2YXJzID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcbiAgY29uc3QgY3NzVmFyID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB2YXJzLmdldFByb3BlcnR5VmFsdWUobmFtZSkudHJpbSgpO1xuXG4gIGNvbnN0IGNvbnRhaW5lciA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1jb250ZW50XCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXdcIixcbiAgXSk7XG4gIGNvbnN0IHBhcmEgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tbGluZTpub3QoLkh5cGVyTUQtaGVhZGVyKVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHBcIixcbiAgXSk7XG4gIGNvbnN0IGgxID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20taGVhZGVyLTFcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoMVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGgxXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaDFcIixcbiAgXSk7XG4gIGNvbnN0IGxpc3RJdGVtID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1saXN0LWxpbmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyB1bCA+IGxpXCIsXG4gICAgaXNFZGl0ID8gXCIuSHlwZXJNRC1saXN0LWxpbmVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgXSk7XG4gIGNvbnN0IHByZSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IHByZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWVkaXRpbmcgcHJlXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1jb2RlYmxvY2tcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgXSk7XG4gIGNvbnN0IHF1b3RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBibG9ja3F1b3RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgYmxvY2txdW90ZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELXF1b3RlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgYmxvY2txdW90ZVwiLFxuICBdKTtcbiAgY29uc3QgaW5saW5lQ29kZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgY29kZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGNvZGVcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20taW5saW5lLWNvZGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBjb2RlXCIsXG4gIF0pO1xuICBjb25zdCB0YWJsZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgdGFibGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyB0YWJsZVwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgdGFibGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHRhYmxlXCIsXG4gIF0pO1xuICBjb25zdCBpbWcgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGltZ1wiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGltZ1wiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBpbWdcIixcbiAgICBcImltZ1wiLCAvLyB3aG9sZS1kb2N1bWVudCBmYWxsYmFja1xuICBdKTtcbiAgY29uc3QgaHIgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGhyXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaHJcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIGhyXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWhyXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaHJcIixcbiAgXSk7XG5cbiAgLy8gU3RydWN0dXJlIHByb2JlcyAoZWRpdCB2aWV3IG9ubHkpOiB0aGUgc291cmNlLXZpZXcgY2xhc3MgbGlzdFxuICAvLyAoY29uZmlybXMgdGhlIExpdmUgUHJldmlldyBtYXJrZXIgY2xhc3MpIGFuZCB1bmlxdWUgZWxlbWVudCB0YWdzXG4gIC8vIGluc2lkZSB0aGUgZWRpdG9yIChyZXZlYWxzIGhvdyBjbTYgcmVuZGVycyBjb2RlIGJsb2NrcyBldGMuIHdoZW5cbiAgLy8gdGhlIHVzdWFsIHNlbGVjdG9ycyBkbyBub3QgbWF0Y2gpLlxuICBjb25zdCBzb3VyY2VWaWV3Q2xhc3MgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202XCIpPy5jbGFzc05hbWUgPz8gXCJcIjtcbiAgY29uc3QgZG9tVGFnczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnN0IHRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb250ZW50RWxcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgKlwiKVxuICAgICAgLmZvckVhY2goKGVsKSA9PiB0YWdzLmFkZChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKTtcbiAgICBkb21UYWdzLnB1c2goLi4udGFncyk7XG4gIH1cbiAgLy8gTGlzdC1saW5lIHByb2JlIChlZGl0IHZpZXcgb25seSk6IGNsYXNzIG5hbWVzICsgY29tcHV0ZWQgcGFkZGluZ1xuICAvLyBvZiB0aGUgZmlyc3QgbGlzdCBsaW5lcyBcdTIwMTQgbmVzdGVkIGxldmVscyBvZnRlbiB1c2UgZGlzdGluY3RcbiAgLy8gY2xhc3NlcyBvciBpbmxpbmUgcGFkZGluZ3MsIHdoaWNoIGRlY2lkZXMgd2hldGhlciBhIGxldmVsLWF3YXJlXG4gIC8vIGluZGVudCBvdmVycmlkZSBpcyBldmVuIHBvc3NpYmxlLlxuICBjb25zdCBsaXN0TGluZXM6IHsgY2xhc3NOYW1lOiBzdHJpbmc7IHBhZGRpbmdMZWZ0OiBzdHJpbmcgfVtdID0gW107XG4gIGlmIChpc0VkaXQpIHtcbiAgICBjb250ZW50RWwucXVlcnlTZWxlY3RvckFsbChcIi5IeXBlck1ELWxpc3QtbGluZVwiKS5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgaWYgKGkgPj0gNCkgcmV0dXJuO1xuICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGxpc3RMaW5lcy5wdXNoKHtcbiAgICAgICAgY2xhc3NOYW1lOiBlbC5jbGFzc05hbWUsXG4gICAgICAgIHBhZGRpbmdMZWZ0OiBjcy5nZXRQcm9wZXJ0eVZhbHVlKFwicGFkZGluZy1sZWZ0XCIpLnRyaW0oKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIC8vIEZyb250bWF0dGVyIHByb2JlczogZG9lcyB0aGUgKGhpZGRlbikgcHJvcGVydGllcyBhcmVhIHN0aWxsXG4gIC8vIG9jY3VweSBzcGFjZSBpbiBMaXZlIFByZXZpZXc/IEFuZCBob3cgZmFyIGlzIHRoZSBIMSBmcm9tIHRoZVxuICAvLyB0b3Agb2YgdGhlIGNvbnRlbnQgYXJlYT8gKHJlYWRpbmcgbW9kZSBoYXMgbm8gc3VjaCBwYWRkaW5nKVxuICBjb25zdCBtZXRhZGF0YURpc3BsYXkgPSAoKCkgPT4ge1xuICAgIGNvbnN0IHNlbCA9IGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2UtdmlldyAubWV0YWRhdGEtY29udGFpbmVyXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIjtcbiAgICBjb25zdCBlbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihzZWwpO1xuICAgIHJldHVybiBlbCA/IGdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgOiBcIihub3QgaW4gRE9NKVwiO1xuICB9KSgpO1xuICBjb25zdCBoMU9mZnNldFRvcCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgdG9wID0gMDtcbiAgICBsZXQgbm9kZTogSFRNTEVsZW1lbnQgfCBudWxsID0gaDE7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIHRvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICAgIG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0b3A7XG4gIH0pKCk7XG4gIC8vIFdoYXQgb2NjdXBpZXMgdGhlIHNwYWNlIGJldHdlZW4gdGhlIGNvbnRlbnQgdG9wIGFuZCB0aGUgSDE/XG4gIC8vIChlZGl0KSBmaXJzdCBjaGlsZHJlbiBvZiAuY20tY29udGVudCwgYW5kIHRoZSBuZXQgSDEgZGlzdGFuY2VcbiAgLy8gZnJvbSB0aGUgY29udGVudCBhbmNob3IgXHUyMDE0IHJlYWRpbmcgaGFzIG5vIHN1Y2ggZ2FwLlxuICBjb25zdCBhbmNob3IgPSBpc0VkaXRcbiAgICA/IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpXG4gICAgOiBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXdcIik7XG4gIGNvbnN0IGgxVG9wSW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCk7XG4gIH0pKCk7XG4gIGNvbnN0IGgxTGVmdEluQ29udGVudCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSB8fCAhYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGgxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCk7XG4gIH0pKCk7XG4gIGNvbnN0IGNvbnRlbnRDaGlsZHJlbiA9ICgoKSA9PiB7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYW5jaG9yLmNoaWxkcmVuKVxuICAgICAgLnNsaWNlKDAsIDQpXG4gICAgICAubWFwKChlbCkgPT4ge1xuICAgICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNsczogKGVsIGFzIEhUTUxFbGVtZW50KS5jbGFzc05hbWUgfHwgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgIGRpc3BsYXk6IGNzLmRpc3BsYXksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCksXG4gICAgICAgICAgbWFyZ2luVG9wOiBjcy5tYXJnaW5Ub3AsXG4gICAgICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IGNzLm1hcmdpbkJvdHRvbSxcbiAgICAgICAgICBwYWRkaW5nQm90dG9tOiBjcy5wYWRkaW5nQm90dG9tLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH0pKCk7XG4gIC8vIENvbnRhaW5lciBjaGFpbiBwcm9iZTogZnJvbSAuY20tY29udGVudCB1cCB0byB0aGUgdmlldy1jb250ZW50LFxuICAvLyBlYWNoIHdyYXBwZXIncyBwYWRkaW5nL21hcmdpbiBcdTIwMTQgbG9jYXRlcyB0aGUgbGVmdG92ZXIgdmVydGljYWxcbiAgLy8gb2Zmc2V0IGJldHdlZW4gZWRpdCBhbmQgcmVhZGluZyBjb250ZW50IGFyZWFzLlxuICBjb25zdCB0b3BDaGFpbiA9ICgoKSA9PiB7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFydHM6IHsgY2xzOiBzdHJpbmc7IHBhZFRvcDogc3RyaW5nOyBtYXJUb3A6IHN0cmluZyB9W10gPSBbXTtcbiAgICBsZXQgbm9kZTogSFRNTEVsZW1lbnQgfCBudWxsID0gYW5jaG9yO1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRlbnRFbCAmJiBub2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgY2xzOiBub2RlLmNsYXNzTmFtZSB8fCBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgcGFkVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICBtYXJUb3A6IGNzLm1hcmdpblRvcCxcbiAgICAgIH0pO1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzO1xuICB9KSgpO1xuXG4gIC8vIFRpdGxlIHByb2JlOiB0aGUgZ2VuZXJhdGVkIDo6YmVmb3JlIGluIFNsaWRlcyBtb2RlICh3aGVuIGEgdGl0bGUgaXNcbiAgLy8gY29uZmlndXJlZCkuIENhcHR1cmVzIGl0cyBjb21wdXRlZCBzdHlsZSBzbyB3ZSBjYW4gZGlmZiBpdCBhZ2FpbnN0IHRoZVxuICAvLyBib2R5IEgxICguY20taGVhZGVyLTEpIGFuZCBhbGlnbiB0aGVtIGV4YWN0bHkuXG4gIGNvbnN0IHRpdGxlQmVmb3JlID0gKCgpID0+IHtcbiAgICBpZiAoIWlzRWRpdCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50LCBcIjo6YmVmb3JlXCIpO1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiBjcy5jb250ZW50LFxuICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgIHBvc2l0aW9uOiBjcy5wb3NpdGlvbixcbiAgICAgIHRvcDogY3MudG9wLFxuICAgICAgbGVmdDogY3MubGVmdCxcbiAgICAgIHBhZGRpbmdUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICBmb250RmFtaWx5OiBjcy5mb250RmFtaWx5LFxuICAgICAgZm9udFNpemU6IGNzLmZvbnRTaXplLFxuICAgICAgbGluZUhlaWdodDogY3MubGluZUhlaWdodCxcbiAgICAgIGZvbnRXZWlnaHQ6IGNzLmZvbnRXZWlnaHQsXG4gICAgICBmb250VmFyaWFudDogY3MuZm9udFZhcmlhbnQsXG4gICAgICBjb2xvcjogY3MuY29sb3IsXG4gICAgICBsZXR0ZXJTcGFjaW5nOiBjcy5sZXR0ZXJTcGFjaW5nLFxuICAgICAgdGV4dFRyYW5zZm9ybTogY3MudGV4dFRyYW5zZm9ybSxcbiAgICAgIHdvcmRTcGFjaW5nOiBjcy53b3JkU3BhY2luZyxcbiAgICAgIGZvbnRLZXJuaW5nOiBjcy5mb250S2VybmluZyxcbiAgICAgIGZvbnRGZWF0dXJlU2V0dGluZ3M6IGNzLmZvbnRGZWF0dXJlU2V0dGluZ3MsXG4gICAgICBmb250VmFyaWFudE51bWVyaWM6IGNzLmZvbnRWYXJpYW50TnVtZXJpYyxcbiAgICAgIGZvbnRWYXJpYW50TGlnYXR1cmVzOiBjcy5mb250VmFyaWFudExpZ2F0dXJlcyxcbiAgICAgIGZvbnRWYXJpYW50Q2FwczogY3MuZm9udFZhcmlhbnRDYXBzLFxuICAgIH07XG4gIH0pKCk7XG5cbiAgY29uc3QgZHVtcCA9IHtcbiAgICBtb2RlOiBpc0VkaXQgPyBcImVkaXQgKExpdmUgUHJldmlldylcIiA6IFwicmVhZGluZ1wiLFxuICAgIC8vIFNsaWRlcyBzdHlsaW5nIG9ubHkgYXBwbGllcyB3aGVuIFNsaWRlcyBtb2RlIGlzIG9uXG4gICAgc2xpZGVzQWN0aXZlOiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSxcbiAgICBkb21UYWdzOiBpc0VkaXQgPyBkb21UYWdzIDogdW5kZWZpbmVkLFxuICAgIHNvdXJjZVZpZXdDbGFzczogaXNFZGl0ID8gc291cmNlVmlld0NsYXNzIDogdW5kZWZpbmVkLFxuICAgIGxpdmVQcmV2aWV3OiBpc0VkaXQgPyBpc0xpdmVQcmV2aWV3KGFwcCkgOiB1bmRlZmluZWQsXG4gICAgbGlzdExpbmVzOiBpc0VkaXQgPyBsaXN0TGluZXMgOiB1bmRlZmluZWQsXG4gICAgbWV0YWRhdGFDb250YWluZXJEaXNwbGF5OiBtZXRhZGF0YURpc3BsYXksXG4gICAgaDFPZmZzZXRUb3A6IGgxT2Zmc2V0VG9wLFxuICAgIGgxVG9wSW5Db250ZW50OiBoMVRvcEluQ29udGVudCxcbiAgICBoMUxlZnRJbkNvbnRlbnQ6IGgxTGVmdEluQ29udGVudCxcbiAgICBjb250ZW50Q2hpbGRyZW46IGNvbnRlbnRDaGlsZHJlbixcbiAgICB0b3BDaGFpbjogdG9wQ2hhaW4sXG4gICAgdGl0bGU6IHRpdGxlQmVmb3JlLFxuICAgIGNvbnRhaW5lcjogc3R5bGUoY29udGFpbmVyLCBbXG4gICAgICBcImZvbnQtZmFtaWx5XCIsXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXgtd2lkdGhcIixcbiAgICAgIFwid2lkdGhcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwiY29sb3JcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIHBhcmFncmFwaDogc3R5bGUocGFyYSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcIm1hcmdpbi1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1yaWdodFwiLFxuICAgICAgXCJ0ZXh0LWluZGVudFwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgaDE6IHN0eWxlKGgxLCBbXG4gICAgICBcImZvbnQtZmFtaWx5XCIsXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJmb250LXdlaWdodFwiLFxuICAgICAgXCJmb250LXZhcmlhbnRcIixcbiAgICAgIFwiY29sb3JcIixcbiAgICAgIFwibGV0dGVyLXNwYWNpbmdcIixcbiAgICAgIFwidGV4dC10cmFuc2Zvcm1cIixcbiAgICAgIFwid29yZC1zcGFjaW5nXCIsXG4gICAgICBcImZvbnQta2VybmluZ1wiLFxuICAgICAgXCJmb250LWZlYXR1cmUtc2V0dGluZ3NcIixcbiAgICAgIFwiZm9udC12YXJpYW50LW51bWVyaWNcIixcbiAgICAgIFwiZm9udC12YXJpYW50LWxpZ2F0dXJlc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtY2Fwc1wiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGxpc3RJdGVtOiBzdHlsZShsaXN0SXRlbSwgW1xuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBjb2RlQmxvY2s6IHN0eWxlKHByZSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgXCJib3JkZXItcmFkaXVzXCIsXG4gICAgXSksXG4gICAgYmxvY2txdW90ZTogc3R5bGUocXVvdGUsIFtcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcImJvcmRlci1sZWZ0LXdpZHRoXCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICBdKSxcbiAgICBpbmxpbmVDb2RlOiBzdHlsZShpbmxpbmVDb2RlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICB0YWJsZTogc3R5bGUodGFibGUsIFtcImZvbnQtc2l6ZVwiLCBcImxpbmUtaGVpZ2h0XCIsIFwid2lkdGhcIiwgXCJib3JkZXItY29sbGFwc2VcIl0pLFxuICAgIGltYWdlOiBzdHlsZShpbWcsIFtcImRpc3BsYXlcIiwgXCJtYXJnaW4tbGVmdFwiLCBcIm1hcmdpbi1yaWdodFwiLCBcIm1heC13aWR0aFwiLCBcIndpZHRoXCJdKSxcbiAgICBob3Jpem9udGFsUnVsZTogc3R5bGUoaHIsIFtcIm1hcmdpbi10b3BcIiwgXCJtYXJnaW4tYm90dG9tXCIsIFwiYm9yZGVyLXRvcC13aWR0aFwiLCBcImhlaWdodFwiXSksXG4gICAgY3NzVmFyaWFibGVzOiB7XG4gICAgICBcIi0tZm9udC10ZXh0XCI6IGNzc1ZhcihcIi0tZm9udC10ZXh0XCIpLFxuICAgICAgXCItLWxpbmUtaGVpZ2h0LW5vcm1hbFwiOiBjc3NWYXIoXCItLWxpbmUtaGVpZ2h0LW5vcm1hbFwiKSxcbiAgICAgIFwiLS1oMS1zaXplXCI6IGNzc1ZhcihcIi0taDEtc2l6ZVwiKSxcbiAgICAgIFwiLS1oMS1saW5lLWhlaWdodFwiOiBjc3NWYXIoXCItLWgxLWxpbmUtaGVpZ2h0XCIpLFxuICAgICAgXCItLWgxLXdlaWdodFwiOiBjc3NWYXIoXCItLWgxLXdlaWdodFwiKSxcbiAgICAgIFwiLS1oMS12YXJpYW50XCI6IGNzc1ZhcihcIi0taDEtdmFyaWFudFwiKSxcbiAgICAgIFwiLS1oMS1jb2xvclwiOiBjc3NWYXIoXCItLWgxLWNvbG9yXCIpLFxuICAgICAgXCItLWgxLW1hcmdpbi10b3BcIjogY3NzVmFyKFwiLS1oMS1tYXJnaW4tdG9wXCIpLFxuICAgICAgXCItLWgxLW1hcmdpbi1ib3R0b21cIjogY3NzVmFyKFwiLS1oMS1tYXJnaW4tYm90dG9tXCIpLFxuICAgICAgXCItLXAtc3BhY2luZ1wiOiBjc3NWYXIoXCItLXAtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LXNwYWNpbmdcIjogY3NzVmFyKFwiLS1saXN0LXNwYWNpbmdcIiksXG4gICAgICBcIi0tbGlzdC1pbmRlbnRcIjogY3NzVmFyKFwiLS1saXN0LWluZGVudFwiKSxcbiAgICAgIFwiLS1jb2RlLXNpemVcIjogY3NzVmFyKFwiLS1jb2RlLXNpemVcIiksXG4gICAgICBcIi0tY29kZS1wYWRkaW5nXCI6IGNzc1ZhcihcIi0tY29kZS1wYWRkaW5nXCIpLFxuICAgICAgXCItLWNvZGUtcmFkaXVzXCI6IGNzc1ZhcihcIi0tY29kZS1yYWRpdXNcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1wYWRkaW5nXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1wYWRkaW5nXCIpLFxuICAgICAgXCItLWJsb2NrcXVvdGUtYm9yZGVyLXRoaWNrbmVzc1wiOiBjc3NWYXIoXCItLWJsb2NrcXVvdGUtYm9yZGVyLXRoaWNrbmVzc1wiKSxcbiAgICAgIFwiLS1maWxlLW1hcmdpbnNcIjogY3NzVmFyKFwiLS1maWxlLW1hcmdpbnNcIiksXG4gICAgICBcIi0tZmlsZS1saW5lLXdpZHRoXCI6IGNzc1ZhcihcIi0tZmlsZS1saW5lLXdpZHRoXCIpLFxuICAgICAgXCItLW5vcm1hbC1mb250LXNpemVcIjogY3NzVmFyKFwiLS1ub3JtYWwtZm9udC1zaXplXCIpLFxuICAgICAgXCItLWZvbnQtdGV4dC1zaXplXCI6IGNzc1ZhcihcIi0tZm9udC10ZXh0LXNpemVcIiksXG4gICAgfSxcbiAgfTtcbiAgcmV0dXJuIGR1bXA7XG59XG5cbi8qKlxuICogRGVidWcgdHlwb2dyYXBoeTogc2FtcGxlcyB0aGUgZml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIChlYWNoXG4gKiBjb3ZlcmluZyBhIGdyb3VwIG9mIGVsZW1lbnRzIFx1MjAxNCBhbGwgdmlzaWJsZSB3aXRob3V0IHNjcm9sbGluZyksXG4gKiB0aGVuIHRoZSBraXRjaGVuLXNpbmsgbm90ZSBpbiByZWFkaW5nIHZpZXcgKG5vIHZpcnR1YWxpemF0aW9uXG4gKiB0aGVyZSksIG1lcmdlcyBldmVyeXRoaW5nLCBjb21wdXRlcyB0aGUgZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kXG4gKiB3cml0ZXMgaXQgdG8gLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC5cbiAqIFRoZSB1c2VyJ3Mgb3duIG5vdGUgaXMgcmVzdG9yZWQgYXQgdGhlIGVuZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGFwcCA9IHBsdWdpbi5hcHA7XG4gIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIFNsaWRlczogZW50ZXIgU2xpZGVzIG1vZGUgZmlyc3QgKE1vZCtTaGlmdCtFIG9uIGEgZGVjayBub3RlKVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIFNsaWRlczogbm8gYWN0aXZlIE1hcmtkb3duIG5vdGVcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHN0YXJ0TW9kZSA9IHZpZXcuZ2V0TW9kZSgpO1xuICBjb25zdCBhY3RpdmVGaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIGNvbnN0IGxlYWYgPSBhcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpO1xuXG4gIC8vIEVkaXQgc2lkZTogZWFjaCBzaG9ydCBub3RlIGtlZXBzIGV2ZXJ5IHRhcmdldCBlbGVtZW50IG9uIHNjcmVlblxuICBjb25zdCBlZGl0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgU0FNUExFX05PVEVfTkFNRVMpIHtcbiAgICBjb25zdCBmID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgJHtuYW1lfS5tZGApO1xuICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIGNvbnRpbnVlO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZiwgeyBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0gfSk7XG4gICAgYXdhaXQgc2xlZXAoNTAwKTtcbiAgICBjb25zdCBzID0gc2FtcGxlU3R5bGVzKGFwcCk7XG4gICAgaWYgKHMpIG1lcmdlU2FtcGxlKGVkaXQsIHMpO1xuICB9XG5cbiAgLy8gUmVhZGluZyBzaWRlOiB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgcmVuZGVycyBldmVyeXRoaW5nIGF0IG9uY2VcbiAgbGV0IHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGRlbW8gPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFwidHlwb2dyYXBoeS1kZW1vLm1kXCIpO1xuICBpZiAoZGVtbyBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShkZW1vLCB7IHN0YXRlOiB7IG1vZGU6IFwicHJldmlld1wiIH0gfSk7XG4gICAgYXdhaXQgc2xlZXAoODAwKTtcbiAgICByZWFkaW5nID0gc2FtcGxlU3R5bGVzKGFwcCk7XG4gIH1cblxuICAvLyBSZXN0b3JlIHRoZSB1c2VyJ3Mgbm90ZVxuICBpZiAoYWN0aXZlRmlsZSkge1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoYWN0aXZlRmlsZSwgeyBzdGF0ZTogeyBtb2RlOiBzdGFydE1vZGUgfSB9KTtcbiAgICBwbHVnaW4ucmVmcmVzaCgpO1xuICB9XG4gIGlmICghcmVhZGluZykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgU2xpZGVzOiByZWFkaW5nIHNhbXBsZSBmYWlsZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGF5bG9hZCA9IHsgZWRpdCwgcmVhZGluZywgZGlmZjogZGlmZkR1bXBzKGVkaXQsIHJlYWRpbmcpIH07XG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLnZhdWx0LmFkYXB0ZXIud3JpdGUoXCIubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIDIpKTtcbiAgICBuZXcgTm90aWNlKFwiVHlwb2dyYXBoeSBkdW1wIFx1MjE5MiAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uICh2YXVsdCByb290KVwiKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBuZXcgTm90aWNlKGBOYXRpdmUgU2xpZGVzOiBjb3VsZCBub3Qgd3JpdGUgZGVidWcgZmlsZSAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgfVxuICBjb25zb2xlLmxvZyhcIltuYXRpdmUtc2xpZGVzIGRlYnVnLXN0eWxlc11cIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMikpO1xufVxuXG4vKiogUmVnaXN0ZXIgdGhlIGRldi1vbmx5IGRlYnVnIGNvbW1hbmQgKGNhbGxlZCBvbmx5IHdoZW4gREVWX01PREUgaXMgdHJ1ZSkuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiB2b2lkIHtcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWRlYnVnLXN0eWxlc1wiLFxuICAgIG5hbWU6IFwiRGVidWc6IGR1bXAgdHlwb2dyYXBoeSBzdHlsZXNcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBkdW1wVHlwb2dyYXBoeShwbHVnaW4pLFxuICB9KTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuLyoqIE1vZGUgb2YgdGhlIGFjdGl2ZSBNYXJrZG93biB2aWV3OiAncHJldmlldyc9cmVhZGluZyAnc291cmNlJz1lZGl0aW5nICcnPW5vbmUgKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXJyZW50TW9kZShhcHA6IEFwcCk6IFwicHJldmlld1wiIHwgXCJzb3VyY2VcIiB8IFwiXCIge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIHJldHVybiB2aWV3ID8gKHZpZXcuZ2V0TW9kZSgpIGFzIFwicHJldmlld1wiIHwgXCJzb3VyY2VcIikgOiBcIlwiO1xufVxuXG4vKipcbiAqIFRydWUgd2hlbiB0aGUgYWN0aXZlIGVkaXQgdmlldyBpcyBMaXZlIFByZXZpZXcgKFNsaWRlcykgXHUyMDE0IGFzXG4gKiBvcHBvc2VkIHRvIFNvdXJjZSBtb2RlLiBPYnNpZGlhbiByZXBvcnRzIGJvdGggYXMgbW9kZSBcInNvdXJjZVwiO1xuICogdGhlIHZpZXcgc3RhdGUgY2FycmllcyBhIGBzb3VyY2VgIGZsYWcgKFNvdXJjZSBtb2RlID0gdHJ1ZSksIHdpdGhcbiAqIGEgRE9NIGNsYXNzIGZhbGxiYWNrICguaXMtbGl2ZS1wcmV2aWV3KSBmb3Igc2FmZXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNMaXZlUHJldmlldyhhcHA6IEFwcCk6IGJvb2xlYW4ge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldyB8fCB2aWV3LmdldE1vZGUoKSAhPT0gXCJzb3VyY2VcIikgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgaWYgKHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoc3RhdGUuc291cmNlID09PSBmYWxzZSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiAhIXZpZXcuY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNi5pcy1saXZlLXByZXZpZXdcIik7XG59XG5cbi8qKiBGcm9udG1hdHRlciBvZiBhbnkgbm90ZSBhcyBhbiBvYmplY3QsIG9yIG51bGwgd2hlbiBhYnNlbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9udG1hdHRlck9mKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICByZXR1cm4gY2FjaGU/LmZyb250bWF0dGVyID8/IG51bGw7XG59XG5cbi8qKiBDdXJyZW50IG5vdGUncyBmcm9udG1hdHRlciBhcyBhbiBvYmplY3QsIG9yIG51bGwgd2hlbiBhYnNlbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmVGcm9udG1hdHRlcihhcHA6IEFwcCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IGZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgcmV0dXJuIGZpbGUgPyBmcm9udG1hdHRlck9mKGFwcCwgZmlsZSkgOiBudWxsO1xufVxuIiwgIi8qKiBBIGJ1aWx0LWluIFNsaWRlcyBzdHlsZSB0ZW1wbGF0ZSAocmVuZGVyZWQgYXMgYm9keSBjbGFzcyBgbmF0aXZlLXNsaWRlcy10aGVtZS08aWQ+YCkgKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2xpZGVzVGhlbWUge1xuICBpZDogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG4vKiogQnVpbHQtaW4gc3R5bGUgdGVtcGxhdGVzIGZvciB0aGUgU2xpZGVzIGNhcmQgKyBiYXIgKGFsbCB0aGVtZS1hZGFwdGl2ZSkgKi9cbmV4cG9ydCBjb25zdCBTTElERVNfVEhFTUVTOiByZWFkb25seSBTbGlkZXNUaGVtZVtdID0gW1xuICB7IGlkOiBcImp5eVwiLCBsYWJlbDogXCJMZWN0dXJlIChqeXkpXCIgfSxcbiAgeyBpZDogXCJkYXNoZWRcIiwgbGFiZWw6IFwiRGFzaGVkIG91dGxpbmVcIiB9LFxuICB7IGlkOiBcInBhcGVyXCIsIGxhYmVsOiBcIlBhcGVyIGNhcmRcIiB9LFxuICB7IGlkOiBcIm1pbmltYWxcIiwgbGFiZWw6IFwiTWluaW1hbFwiIH0sXG4gIHsgaWQ6IFwiYWNjZW50XCIsIGxhYmVsOiBcIkFjY2VudCBlZGdlXCIgfSxcbiAgeyBpZDogXCJnbGFzc1wiLCBsYWJlbDogXCJGcm9zdGVkIGdsYXNzXCIgfSxcbl07XG5cbi8qKiBQbHVnaW4gc2V0dGluZ3MgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmF0aXZlU2xpZGVzU2V0dGluZ3Mge1xuICAvKiogU2hvdyBcdTI1QzAgXHUyNUI2IHByZXZpb3VzL25leHQgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciAqL1xuICBzaG93TmF2QnV0dG9uczogYm9vbGVhbjtcbiAgLyoqIFBhZ2UgbnVtYmVyIGRpc3BsYXkgc3R5bGU6IFwiZnJhY3Rpb25cIiA9IE4gLyBUb3RhbCwgXCJjdXJyZW50XCIgPSBOLCBcIm5vbmVcIiA9IGhpZGRlbiAqL1xuICBwYWdlTnVtYmVyU3R5bGU6IFwiZnJhY3Rpb25cIiB8IFwiY3VycmVudFwiIHwgXCJub25lXCI7XG4gIC8qKiBTaG93IGEgdGhpbiBjbGlja2FibGUgcHJvZ3Jlc3MgbGluZSBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dQcm9ncmVzczogYm9vbGVhbjtcbiAgLyoqIFNob3cgdGhlIGVudGlyZSBzbGlkZXMgYmFyIChtYXN0ZXIgdG9nZ2xlKSAqL1xuICBzaG93U2xpZGVzQmFyOiBib29sZWFuO1xuICAvKiogV2hldGhlciB0aGUgdXNlciBtYW51YWxseSBoaWQgdGhlIHNsaWRlcyBiYXIgKHRvZ2dsZSBjb21tYW5kKSAqL1xuICBiYXJIaWRkZW46IGJvb2xlYW47XG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIHdoZW4gb3BlbmluZyBhIGRlY2sgbm90ZSAoZGVmYXVsdCBvZmYpICovXG4gIGF1dG9FbnRlclNsaWRlczogYm9vbGVhbjtcbiAgLyoqIFByZXNzIEVzY2FwZSB0byBleGl0IFNsaWRlcyBtb2RlIChkZWZhdWx0IG9uKSAqL1xuICBlc2NFeGl0c1NsaWRlczogYm9vbGVhbjtcbiAgLyoqIEZyb250bWF0dGVyIHByb3BlcnR5IHNob3duIGFzIHRoZSBjYXJkIHRpdGxlIChcIlwiID0gbm9uZSwgXCJmaWxlbmFtZVwiID0gZmlsZSBuYW1lKSAqL1xuICBzbGlkZXNUaXRsZTogc3RyaW5nO1xuICAvKiogU3R5bGUgdGVtcGxhdGUgaWQgZnJvbSBTTElERVNfVEhFTUVTIChjYXJkICsgYmFyIGFwcGVhcmFuY2UpICovXG4gIHNsaWRlc1RoZW1lOiBzdHJpbmc7XG4gIC8qKiBDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgZm9yIHRoZSBzbGlkZXMgYmFyIChlbXB0eSA9IG5vbmUpICovXG4gIGJhclByb3BlcnRpZXM6IHN0cmluZztcbiAgLyoqIEpTT04gYXJyYXkgb2YgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIGZvciBiYXIgcHJvcGVydGllcyAoZHJhZ2dhYmxlIGRpdmlkZXJzKSAqL1xuICBiYXJQcm9wZXJ0eVdpZHRoczogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7XG4gIHNob3dOYXZCdXR0b25zOiB0cnVlLFxuICBwYWdlTnVtYmVyU3R5bGU6IFwibm9uZVwiLFxuICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gIHNob3dTbGlkZXNCYXI6IHRydWUsXG4gIGJhckhpZGRlbjogZmFsc2UsXG4gIGF1dG9FbnRlclNsaWRlczogZmFsc2UsXG4gIGVzY0V4aXRzU2xpZGVzOiB0cnVlLFxuICBzbGlkZXNUaXRsZTogXCJcIixcbiAgc2xpZGVzVGhlbWU6IFwianl5XCIsXG4gIGJhclByb3BlcnRpZXM6IFwiXCIsXG4gIGJhclByb3BlcnR5V2lkdGhzOiBcIlwiLFxufTtcblxuLyoqIFJlc2VydmVkIGZyb250bWF0dGVyIGtleSBkcml2aW5nIGRlY2sgbmF2aWdhdGlvbiAobmV2ZXIgcmVuZGVyZWQgYXMgYSBjaGlwKSAqL1xuZXhwb3J0IGNvbnN0IERFQ0tfS0VZID0gXCJkZWNrXCI7XG4iLCAiaW1wb3J0IHsgQXBwLCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBwbGFuQ3JlYXRlTmV4dCBhcyBwbGFuLCB0eXBlIENyZWF0ZU5leHRSZXN1bHQgfSBmcm9tIFwiLi9jcmVhdGVOZXh0XCI7XG5pbXBvcnQgeyBjb21wdXRlRGVjaywgZXh0cmFjdExpbmtzLCBleHRyYWN0UmF3TGlua3MsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKiogUmVzb2x2ZSB0aGUgY3VycmVudCBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrIChwYXRoLWJhc2VkIHdyYXBwZXIpICovXG4gIGNvbXB1dGUoZmlsZTogVEZpbGUpOiBEZWNrSW5mbyB8IG51bGwge1xuICAgIHJldHVybiBjb21wdXRlRGVjayhmaWxlLnBhdGgsIChwYXRoKSA9PiB0aGlzLmxpbmtQYXRocyhwYXRoKSk7XG4gIH1cblxuICAvKiogUmVzb2x2ZSB0aGUgYGRlY2tgIHByb3BlcnR5IG9mIGEgbm90ZSBpbnRvIHJlYWwgbm90ZSBwYXRocyAobWF4IHR3bykgKi9cbiAgcHJpdmF0ZSBsaW5rUGF0aHMocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuIFtdO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZik7XG4gICAgY29uc3QgbmFtZXMgPSBmbSA/IGV4dHJhY3RMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgcmV0dXJuIG5hbWVzXG4gICAgICAubWFwKChuYW1lKSA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KG5hbWUsIHBhdGgpKVxuICAgICAgLmZpbHRlcigoeCk6IHggaXMgVEZpbGUgPT4gISF4KVxuICAgICAgLm1hcCgoeCkgPT4geC5wYXRoKTtcbiAgfVxuXG4gIC8qKiBOYW1lcyBpbiB0aGUgYGRlY2tgIHByb3BlcnR5IHRoYXQgcmVzb2x2ZSB0byBubyBub3RlIChicm9rZW4gbGlua3MpICovXG4gIGJyb2tlbihmaWxlOiBURmlsZSk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IG5hbWVzID0gZm0gPyBleHRyYWN0TGlua3MoZm1bREVDS19LRVldKSA6IFtdO1xuICAgIHJldHVybiBuYW1lcy5maWx0ZXIoKG5hbWUpID0+ICF0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KG5hbWUsIGZpbGUucGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYW4gYSBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgcnVuIGZvciB0aGUgYWN0aXZlIG5vdGUsIG9yIG51bGwgd2hlbiB0aGVcbiAgICogbm90ZSBjYW5ub3QgdGFrZSBhIG5leHQgc2xpZGUgKG5vIHVzYWJsZSBgZGVja2AgcHJvcGVydHkpLlxuICAgKlxuICAgKiBTbGlkZXMgb24gdGhlIGNoYWluIGluc2VydC9hcHBlbmQgYWZ0ZXIgdGhlIGN1cnJlbnQgbm90ZTsgdGhlIG92ZXJ2aWV3XG4gICAqIHBhZ2UgaW5zZXJ0cyBhIG5ldyBmaXJzdCBwYWdlOyBhbiBvZmYtY2hhaW4gbm90ZSB3aXRoIGEgcmVzb2x2YWJsZVxuICAgKiBvdmVydmlldyBsaW5rIHN0aWxsIGdldHMgaXRzIGRlY2xhcmVkIG1pc3NpbmcgbmV4dCBub3RlIGNyZWF0ZWQuXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV4dChmaWxlOiBURmlsZSk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IHJhdyA9IGZtID8gZXh0cmFjdFJhd0xpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICBpZiAocmF3Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBkZWNrID0gdGhpcy5jb21wdXRlKGZpbGUpO1xuICAgIGNvbnN0IGV4aXN0aW5nTmFtZXMgPSBuZXcgU2V0KHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKS5tYXAoKGYpID0+IGYuYmFzZW5hbWUpKTtcblxuICAgIGlmIChkZWNrKSB7XG4gICAgICAvLyBPdmVydmlldyBpbnNlcnRpb24gbmVlZHMgdGhlIG9sZCBmaXJzdCBwYWdlJ3MgYmFjayBsaW5rIHRvIHRoZVxuICAgICAgLy8gb3ZlcnZpZXcgKGl0cyBvd24gZnJvbnRtYXR0ZXIgb25seSBsaW5rcyBmb3J3YXJkKS5cbiAgICAgIGxldCBvdmVydmlld0JhY2tMaW5rOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICBpZiAoZGVjay5pbmRleCA9PT0gMCkge1xuICAgICAgICBjb25zdCBvbGRGaXJzdCA9IGRlY2suY2hhaW5bMV0gPyB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZGVjay5jaGFpblsxXSkgOiBudWxsO1xuICAgICAgICBpZiAob2xkRmlyc3QgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgIGNvbnN0IGYyID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgb2xkRmlyc3QpO1xuICAgICAgICAgIG92ZXJ2aWV3QmFja0xpbmsgPSBmMiA/IGV4dHJhY3RSYXdMaW5rcyhmMltERUNLX0tFWV0pWzBdIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGxhbih7XG4gICAgICAgIGN1cnJlbnROYW1lOiBmaWxlLmJhc2VuYW1lLFxuICAgICAgICBjdXJyZW50TGlua3M6IHJhdyxcbiAgICAgICAgaXNPdmVydmlldzogZGVjay5pbmRleCA9PT0gMCxcbiAgICAgICAgb3ZlcnZpZXdCYWNrTGluayxcbiAgICAgICAgZXhpc3RpbmdOYW1lcyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIE9mZi1jaGFpbiBub3RlOiBjaGVjayBpZiB0aGlzIGNvdWxkIGJlIGFuIG92ZXJ2aWV3IHdpdGggYSBicm9rZW4gbGlua1xuICAgIC8vIHRvIHRoZSBmaXJzdCBzbGlkZSAoZS5nLiwgZnJvbSBcIk5ldyBTbGlkZXMgRGVja1wiIGNvbW1hbmQpLlxuICAgIGlmIChyYXcubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBmaXJzdFNsaWRlTmFtZSA9IGV4dHJhY3RMaW5rcyhyYXdbMF0pWzBdO1xuICAgICAgaWYgKFxuICAgICAgICBmaXJzdFNsaWRlTmFtZSAmJlxuICAgICAgICAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChmaXJzdFNsaWRlTmFtZSwgZmlsZS5wYXRoKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYW4gb3ZlcnZpZXcgd2l0aCBhIGJyb2tlbiBsaW5rIHRvIHRoZSBmaXJzdCBzbGlkZSBcdTIwMTQgY3JlYXRlIGl0XG4gICAgICAgIHJldHVybiBwbGFuKHtcbiAgICAgICAgICBjdXJyZW50TmFtZTogZmlsZS5iYXNlbmFtZSxcbiAgICAgICAgICBjdXJyZW50TGlua3M6IHJhdyxcbiAgICAgICAgICBpc092ZXJ2aWV3OiB0cnVlLFxuICAgICAgICAgIG92ZXJ2aWV3QmFja0xpbms6IGBbWyR7ZmlsZS5iYXNlbmFtZX1dXWAsXG4gICAgICAgICAgZXhpc3RpbmdOYW1lcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT2ZmLWNoYWluIHNsaWRlOiBzdGlsbCBjcmVhdGUgaXRzIGRlY2xhcmVkIG1pc3NpbmcgbmV4dCBub3RlIHdoZW4gdGhlXG4gICAgLy8gb3ZlcnZpZXcgbGluayByZXNvbHZlcyAodGhlICBicm9rZW4tbGluayB3YXJuaW5nIGRpc2FwcGVhcnMpLlxuICAgIGNvbnN0IG92ZXJ2aWV3TmFtZSA9IHJhdy5sZW5ndGggPj0gMiA/IGV4dHJhY3RMaW5rcyhyYXdbMF0pWzBdIDogbnVsbDtcbiAgICBpZiAob3ZlcnZpZXdOYW1lICYmIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3Qob3ZlcnZpZXdOYW1lLCBmaWxlLnBhdGgpKSB7XG4gICAgICByZXR1cm4gcGxhbih7XG4gICAgICAgIGN1cnJlbnROYW1lOiBmaWxlLmJhc2VuYW1lLFxuICAgICAgICBjdXJyZW50TGlua3M6IHJhdyxcbiAgICAgICAgaXNPdmVydmlldzogZmFsc2UsXG4gICAgICAgIGV4aXN0aW5nTmFtZXMsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogQXBwbHkgYSBwbGFuOiBjcmVhdGUgdGhlIG5vdGUsIHJld2lyZSBgZGVja2AgcHJvcGVydGllcywgb3BlbiBpdCAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV4dChmaWxlOiBURmlsZSwgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRpciA9IGZpbGUucGFyZW50Py5wYXRoID8gZmlsZS5wYXJlbnQucGF0aCArIFwiL1wiIDogXCJcIjtcbiAgICBjb25zdCBuZXdQYXRoID0gYCR7ZGlyfSR7cGxhbi5uZXdOYW1lfS5tZGA7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBwbGFuLm5ld0RlY2tMaW5rcy5tYXAoKGxpbmspID0+IEpTT04uc3RyaW5naWZ5KGxpbmspKS5qb2luKFwiLCBcIik7XG4gICAgY29uc3QgY29udGVudCA9IGAtLS1cXG5kZWNrOiBbJHtmcm9udG1hdHRlcn1dXFxuLS0tXFxuYDtcblxuICAgIGxldCBuZXdGaWxlOiBURmlsZTtcbiAgICB0cnkge1xuICAgICAgbmV3RmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShuZXdQYXRoLCBjb250ZW50KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbmV3IE5vdGljZShgTmF0aXZlIFNsaWRlczogY291bGQgbm90IGNyZWF0ZSBcIiR7cGxhbi5uZXdOYW1lfS5tZFwiICgke1N0cmluZyhlcnJvcil9KWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJld2lyZSB0aGUgY3VycmVudCBub3RlJ3MgYGRlY2tgIChrZWVwcyBhbGwgb3RoZXIgcHJvcGVydGllcyBpbnRhY3QpXG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHBsYW4ucmV3cml0ZXMpIHtcbiAgICAgIGlmIChyZXdyaXRlLm5hbWUgIT09IGZpbGUuYmFzZW5hbWUpIGNvbnRpbnVlOyAvLyBpbiBwcmFjdGljZSBhbHdheXMgdGhlIGN1cnJlbnQgbm90ZVxuICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbSkgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSByZXdyaXRlLmRlY2s7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBPcGVuIHRoZSBuZXcgbm90ZSBpbiB0aGUgY3VycmVudCBwYW5lLCBlZGl0IG1vZGUgKExpdmUgUHJldmlldylcbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUobmV3RmlsZSwgeyBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0gfSk7XG4gIH1cbn1cbiIsICIvKipcbiAqIGRlY2sudHMgXHUyMDE0IFB1cmUgZGVjay1yZXNvbHV0aW9uIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRXZlcnl0aGluZyBpbiB0aGlzIG1vZHVsZSBpcyBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0IGNhblxuICogYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L2RlY2sudGVzdC50cykuIG1haW4udHMgYWRhcHRzIHRoZSB2YXVsdFxuICogKG1ldGFkYXRhQ2FjaGUpIHRvIHRoaXMgcHVyZSBpbnRlcmZhY2U6IGl0IHJlc29sdmVzIGBkZWNrYCBwcm9wZXJ0aWVzIHRvXG4gKiBub3RlIHBhdGhzLCB0aGVuIGhhbmRzIHRoZSBwYXRoIGdyYXBoIHRvIGNvbXB1dGVEZWNrKCkuXG4gKi9cblxuLyoqIEEgZGVjayBsaW5rIGxpc3QgbmV2ZXIgaG9sZHMgbW9yZSB0aGFuIHR3byBlbnRyaWVzICovXG5leHBvcnQgY29uc3QgTUFYX0RFQ0tfTElOS1MgPSAyO1xuXG4vKiogUmVzdWx0IG9mIHJlc29sdmluZyBhIG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgYSBkZWNrICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tJbmZvIHtcbiAgLyoqIENoYWluIG9mIG5vdGUgcGF0aHM6IFswXSBpcyB0aGUgb3ZlcnZpZXcgbm90ZSwgdGhlbiBzbGlkZXMgaW4gb3JkZXIgKi9cbiAgY2hhaW46IHN0cmluZ1tdO1xuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnQgbm90ZSBpbnNpZGUgY2hhaW4gKi9cbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjayBieSB3YWxraW5nIHRoZSBsaW5rIGNoYWluLlxuICpcbiAqIENvbnZlbnRpb24gZm9yIHRoZSBzaW5nbGUgYGRlY2tgIHByb3BlcnR5ICh1cCB0byB0d28gbGlua3MpOlxuICogICAtIG92ZXJ2aWV3IG5vdGU6IG9uZSBsaW5rIFx1MjE5MiB0aGF0IGxpbmsgSVMgdGhlIGZpcnN0IHBhZ2U7XG4gKiAgIC0gc2xpZGUgbm90ZTogICAgZmlyc3QgbGluayBcdTIxOTIgdGhlIG92ZXJ2aWV3IHBhZ2UsIHNlY29uZCBsaW5rIFx1MjE5MiBuZXh0IHNsaWRlXG4gKiAgICAgICAgICAgICAgICAgICAgKG5vIHNlY29uZCBsaW5rIG9uIHRoZSBsYXN0IHNsaWRlKS5cbiAqXG4gKiBgZ2V0TGlua3MocGF0aClgIG11c3QgcmV0dXJuIHRoZSByZXNvbHZlZCBub3RlIHBhdGhzIG9mIHRoZSBgZGVja2AgcHJvcGVydHlcbiAqIG9mIHRoZSBub3RlIGF0IGBwYXRoYCAoZW1wdHkgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSwgb3IgaXRzIGxpbmtzIGFyZVxuICogYnJva2VuIFx1MjAxNCBhIGJyb2tlbiBsaW5rIHNpbXBseSBlbmRzIG9yIGV4Y2x1ZGVzIHRoZSBjaGFpbiwgbmV2ZXIgY3Jhc2hlcykuXG4gKlxuICogUmV0dXJucyB0aGUgZnVsbCBjaGFpbiAoW292ZXJ2aWV3LCBzbGlkZSAxLCBzbGlkZSAyLCBcdTIwMjZdKSBhbmQgdGhlIGN1cnJlbnRcbiAqIG5vdGUncyBpbmRleCwgb3IgbnVsbCB3aGVuIHRoZSBub3RlIGlzIG5vdCBwYXJ0IG9mIGFueSBkZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZURlY2soXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmcsXG4gIGdldExpbmtzOiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmdbXSxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIGNvbnN0IGN1cnJlbnRMaW5rcyA9IGdldExpbmtzKGN1cnJlbnRQYXRoKTtcbiAgaWYgKGN1cnJlbnRMaW5rcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXG4gIGxldCBvdmVydmlldzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBsZXQgZmlyc3RQYWdlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgaWYgKGN1cnJlbnRMaW5rcy5sZW5ndGggPj0gMikge1xuICAgIC8vIEEgc2xpZGU6IGZpcnN0IGxpbmsgaXMgdGhlIG92ZXJ2aWV3IHBhZ2VcbiAgICBvdmVydmlldyA9IGN1cnJlbnRMaW5rc1swXTtcbiAgICBmaXJzdFBhZ2UgPSBnZXRMaW5rcyhvdmVydmlldylbMF07XG4gIH0gZWxzZSB7XG4gICAgLy8gQSBzaW5nbGUgbGluazogZWl0aGVyIHdlIEFSRSB0aGUgb3ZlcnZpZXcgKGxpbmsgPSBmaXJzdCBwYWdlKSxcbiAgICAvLyBvciB3ZSBhcmUgdGhlIGxhc3Qgc2xpZGUgKGxpbmsgPSBvdmVydmlldyBwYWdlKVxuICAgIGNvbnN0IG9ubHkgPSBjdXJyZW50TGlua3NbMF07XG4gICAgY29uc3Qgb25seUxpbmtzID0gZ2V0TGlua3Mob25seSk7XG4gICAgaWYgKG9ubHlMaW5rc1swXSA9PT0gY3VycmVudFBhdGgpIHtcbiAgICAgIG92ZXJ2aWV3ID0gY3VycmVudFBhdGg7XG4gICAgICBmaXJzdFBhZ2UgPSBvbmx5O1xuICAgIH0gZWxzZSB7XG4gICAgICBvdmVydmlldyA9IG9ubHk7XG4gICAgICBmaXJzdFBhZ2UgPSBvbmx5TGlua3NbMF07XG4gICAgfVxuICB9XG4gIGlmICghb3ZlcnZpZXcgfHwgIWZpcnN0UGFnZSkgcmV0dXJuIG51bGw7XG5cbiAgLy8gV2FsayB0aGUgY2hhaW46IG92ZXJ2aWV3IFx1MjE5MiBmaXJzdCBwYWdlIFx1MjE5MiBuZXh0IFx1MjE5MiBuZXh0IFx1MjE5MiBcdTIwMjZcbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcHVzaCA9IChwOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICBpZiAocCAmJiAhdmlzaXRlZC5oYXMocCkpIHtcbiAgICAgIHZpc2l0ZWQuYWRkKHApO1xuICAgICAgY2hhaW4ucHVzaChwKTtcbiAgICB9XG4gIH07XG4gIHB1c2gob3ZlcnZpZXcpO1xuICBwdXNoKGZpcnN0UGFnZSk7XG4gIGxldCBjdXIgPSBmaXJzdFBhZ2U7XG4gIHdoaWxlIChjdXIpIHtcbiAgICBjb25zdCBuZXh0ID0gZ2V0TGlua3MoY3VyKVsxXTtcbiAgICBpZiAoIW5leHQgfHwgdmlzaXRlZC5oYXMobmV4dCkpIGJyZWFrOyAvLyBlbmQgb2YgZGVjayBvciBjeWNsZSBndWFyZFxuICAgIHB1c2gobmV4dCk7XG4gICAgY3VyID0gbmV4dDtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIG5vdGUgbmFtZXMgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEFjY2VwdHMgYSBzaW5nbGUgc3RyaW5nIG9yIGEgWUFNTCBsaXN0IG9mIHN0cmluZ3M7IHVucXVvdGVkIFtbeF1dIHZhbHVlcyBhcmVcbiAqIHBhcnNlZCBieSBZQU1MIGFzIG5lc3RlZCBhcnJheXMgYW5kIGZsYXR0ZW5lZCBoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgY29uc3QgbmFtZSA9IGV4dHJhY3RMaW5rVGV4dChpdGVtKTtcbiAgICBpZiAobmFtZSkgb3V0LnB1c2gobmFtZSk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgcmF3IGxpbmsgc3RyaW5ncyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlIFx1MjAxNCB0aGVcbiAqIHRyaW1tZWQgdmFsdWVzIGV4YWN0bHkgYXMgd3JpdHRlbiAoYWxpYXMgLyBwYXRoIGZvcm1zIHByZXNlcnZlZCkuIFNhbWVcbiAqIGZsYXR0ZW5pbmcgcnVsZXMgYXMgZXh0cmFjdExpbmtzKCksIGJ1dCB3aXRob3V0IGV4dHJhY3RpbmcgdGhlIHRhcmdldCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFJhd0xpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSBcInN0cmluZ1wiKSBjb250aW51ZTtcbiAgICBjb25zdCB0cmltbWVkID0gaXRlbS50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh0cmltbWVkKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgdGFyZ2V0IG5vdGUgbmFtZSBmcm9tIGEgbWFya2Rvd24gbGluayBzdHJpbmcuXG4gKiBIYW5kbGVzIHNldmVyYWwgc2hhcGVzOlxuICogICBcIltbc2xpZGUtMl1dXCIgICAgICAgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yfGFsaWFzXV1cIiAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTIjc2VjdGlvbl1dXCJcdTIxOTIgc2xpZGUtMlxuICogICBzbGlkZS0yICAgICAgICAgICAgICBcdTIxOTIgc2xpZGUtMiAoYmFyZSBmaWxlbmFtZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rVGV4dCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHRyaW1tZWQucmVwbGFjZSgvXlxcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0uc3BsaXQoXCIjXCIpWzBdLnRyaW0oKTtcbn1cblxuLyoqIFJlbmRlciBhIHByb3BlcnR5IHZhbHVlIGFzIHJlYWRhYmxlIHRleHQ6IGFycmF5cy9vYmplY3RzIFx1MjE5MiBKU09OLCBlbHNlIFN0cmluZyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBcIlx1MjAxNFwiO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG59XG4iLCAiLyoqXG4gKiBjcmVhdGVOZXh0LnRzIFx1MjAxNCBQdXJlIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdCBjYW5cbiAqIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9jcmVhdGVOZXh0LnRlc3QudHMpLiBtYWluLnRzIGFkYXB0cyB0aGVcbiAqIHZhdWx0IChtZXRhZGF0YUNhY2hlLCBjb21wdXRlRGVjaykgdG8gdGhpcyBwdXJlIGludGVyZmFjZSBhbmQgYXBwbGllcyB0aGVcbiAqIHJlc3VsdGluZyBwbGFuIHdpdGggdmF1bHQuY3JlYXRlKCkgKyBmaWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoKS5cbiAqXG4gKiBUaGUgcGxhbiBkZWNpZGVzLCBmb3IgdGhlIGN1cnJlbnQgbm90ZTpcbiAqICAgLSB0aGUgbmFtZSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKGNvbGxpc2lvbi1hd2FyZSksXG4gKiAgIC0gdGhlIHJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgbmV3IG5vdGUsXG4gKiAgIC0gdGhlIHJld3JpdGVzIG5lZWRlZCBvbiBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50XG4gKiAgICAgbm90ZSBpdHNlbGYpLlxuICovXG5cbmltcG9ydCB7IGV4dHJhY3RMaW5rVGV4dCB9IGZyb20gXCIuL2RlY2tcIjtcblxuLyoqIElucHV0cyBmb3IgcGxhbm5pbmcgXHUyMDE0IHJlc29sdmVkIGJ5IHRoZSBhZGFwdGVyIGluIG1haW4udHMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dElucHV0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIGN1cnJlbnQgbm90ZSAqL1xuICBjdXJyZW50TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBjdXJyZW50IG5vdGUgKGV4dHJhY3RlZCwgdXAgdG8gdHdvKSAqL1xuICBjdXJyZW50TGlua3M6IHN0cmluZ1tdO1xuICAvKiogVHJ1ZSB3aGVuIHRoZSBjdXJyZW50IG5vdGUgSVMgdGhlIGRlY2sncyBvdmVydmlldyBwYWdlIChjaGFpbiBpbmRleCAwKSAqL1xuICBpc092ZXJ2aWV3OiBib29sZWFuO1xuICAvKipcbiAgICogUmF3IGxpbmsgdGV4dCB0aGUgb2xkIGZpcnN0IHBhZ2UgdXNlcyB0byBsaW5rIGJhY2sgdG8gdGhlIG92ZXJ2aWV3LlxuICAgKiBPbmx5IG1lYW5pbmdmdWwgZm9yIG92ZXJ2aWV3IGluc2VydGlvbiAodGhlIG92ZXJ2aWV3IGl0c2VsZiBvbmx5IGxpbmtzXG4gICAqIGZvcndhcmQsIHNvIGl0cyBvd24gZnJvbnRtYXR0ZXIgY29udGFpbnMgbm8gc2VsZi1yZWZlcmVuY2UpLlxuICAgKi9cbiAgb3ZlcnZpZXdCYWNrTGluaz86IHN0cmluZztcbiAgLyoqIEJhc2VuYW1lcyBvZiBldmVyeSBtYXJrZG93biBub3RlIGluIHRoZSB2YXVsdCAoY29sbGlzaW9uLWZyZWUgbmFtaW5nKSAqL1xuICBleGlzdGluZ05hbWVzOiBTZXQ8c3RyaW5nPjtcbn1cblxuLyoqIE9uZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBtdXN0IGJlIHJld3JpdHRlbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWNrUmV3cml0ZSB7XG4gIC8qKiBCYXNlbmFtZSBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqIFRoZSBuZXcgcmF3IGBkZWNrYCBsaW5rIHRleHRzIChzZXJpYWxpemVkIGFzIGEgWUFNTCBsaXN0KSAqL1xuICBkZWNrOiBzdHJpbmdbXTtcbn1cblxuLyoqIFRoZSBmdWxsIHBsYW4gZm9yIGNyZWF0aW5nIG9uZSBuZXcgc2xpZGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dFJlc3VsdCB7XG4gIC8qKiBCYXNlbmFtZSAod2l0aG91dCBleHRlbnNpb24pIG9mIHRoZSBuZXcgc2xpZGUgZmlsZSAqL1xuICBuZXdOYW1lOiBzdHJpbmc7XG4gIC8qKiBSYXcgYGRlY2tgIGxpbmsgdGV4dHMgZm9yIHRoZSBuZXcgbm90ZSdzIGZyb250bWF0dGVyICovXG4gIG5ld0RlY2tMaW5rczogc3RyaW5nW107XG4gIC8qKiBSZXdyaXRlcyB0byBhcHBseSB0byBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGUpICovXG4gIHJld3JpdGVzOiBEZWNrUmV3cml0ZVtdO1xufVxuXG4vKipcbiAqIFBsYW4gdGhlIGNyZWF0aW9uIG9mIGEgbmV3IHNsaWRlIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuXG4gKlxuICogQmVoYXZpb3JzOlxuICogICAtIExhc3Qgc2xpZGUgKG5vIHNlY29uZCBsaW5rKTogYXBwZW5kIGA8Y3VycmVudD4tbmV4dGAgYXMgdGhlIG5ldyBsYXN0XG4gKiAgICAgc2xpZGU7IHRoZSBjdXJyZW50IG5vdGUgZ2FpbnMgdGhlIHNlY29uZCBsaW5rLlxuICogICAtIFNsaWRlIHdpdGggYSB2YWxpZCBuZXh0OiBpbnNlcnQgYDxjdXJyZW50Pi1uZXh0YCBiZXR3ZWVuIHRoZW07IHRoZSBuZXdcbiAqICAgICBub3RlIHRha2VzIG92ZXIgdGhlIG9sZCBuZXh0IGxpbmsuXG4gKiAgIC0gU2xpZGUgd2hvc2Ugc2Vjb25kIGxpbmsgaXMgYnJva2VuIChwbGFpbiwgbm9uLWV4aXN0aW5nIG5hbWUpOiBjcmVhdGVcbiAqICAgICBleGFjdGx5IHRoZSBkZWNsYXJlZCBtaXNzaW5nIG5vdGUgYXMgdGhlIG5ldyBsYXN0IHNsaWRlIFx1MjAxNCB0aGUgXHUyNkEwIHdhcm5pbmdcbiAqICAgICBkaXNhcHBlYXJzIGFuZCB0aGUgYXV0aG9yJ3MgaW50ZW50IGlzIGhvbm91cmVkLiBBIGJyb2tlbiBsaW5rIHRoYXQgaXNcbiAqICAgICBub3QgYSBwbGFpbiBiYXNlbmFtZSAocGF0aC1xdWFsaWZpZWQsIHNlbGYtcmVmZXJlbmNpbmcpIGlzIHRyZWF0ZWQgYXNcbiAqICAgICBpbnZhbGlkIGFuZCBkcm9wcGVkIChhcHBlbmQgYSBgPGN1cnJlbnQ+LW5leHRgIGxhc3Qgc2xpZGUgaW5zdGVhZCkuXG4gKiAgIC0gT3ZlcnZpZXcgcGFnZSAoc2luZ2xlIGxpbmsgPSBmaXJzdCBwYWdlKTogaW5zZXJ0IGEgbmV3IGZpcnN0IHBhZ2U7IHRoZVxuICogICAgIG92ZXJ2aWV3J3MgbGluayBwb2ludHMgdG8gaXQgYW5kIHRoZSBvbGQgZmlyc3QgcGFnZSBpcyBwdXNoZWQgYmFjay5cbiAqXG4gKiBSZXR1cm5zIG51bGwgd2hlbiB0aGUgbm90ZSBoYXMgbm8gdXNhYmxlIGBkZWNrYCBsaW5rcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5DcmVhdGVOZXh0KGlucHV0OiBDcmVhdGVOZXh0SW5wdXQpOiBDcmVhdGVOZXh0UmVzdWx0IHwgbnVsbCB7XG4gIGNvbnN0IHsgY3VycmVudE5hbWUsIGN1cnJlbnRMaW5rcywgaXNPdmVydmlldyB9ID0gaW5wdXQ7XG4gIGlmIChjdXJyZW50TGlua3MubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICAvLyBcdTI1MDBcdTI1MDAgT3ZlcnZpZXcgcGFnZTogaW5zZXJ0IGEgbmV3IGZpcnN0IHBhZ2UgYWZ0ZXIgaXQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGlmIChpc092ZXJ2aWV3KSB7XG4gICAgY29uc3Qgb2xkRmlyc3QgPSBjdXJyZW50TGlua3NbMF07XG4gICAgaWYgKCFvbGRGaXJzdCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgb2xkRmlyc3ROYW1lID0gZXh0cmFjdExpbmtUZXh0KG9sZEZpcnN0KTtcbiAgICBjb25zdCBmaXJzdFBhZ2VFeGlzdHMgPSBvbGRGaXJzdE5hbWUgJiYgaW5wdXQuZXhpc3RpbmdOYW1lcy5oYXMob2xkRmlyc3ROYW1lKTtcbiAgICAvLyBXaGVuIHRoZSBkZWNsYXJlZCBmaXJzdC1wYWdlIG5vdGUgZG9lcyBub3QgZXhpc3QgeWV0LCBjcmVhdGUgZXhhY3RseVxuICAgIC8vIHRoYXQgbm90ZSAoaG9ub3VycyB0aGUgcGxhY2Vob2xkZXIgbGluayBmcm9tIFwiTmV3IFNsaWRlcyBEZWNrXCIpLlxuICAgIGNvbnN0IG5ld05hbWUgPVxuICAgICAgb2xkRmlyc3ROYW1lICYmICFmaXJzdFBhZ2VFeGlzdHNcbiAgICAgICAgPyBvbGRGaXJzdE5hbWVcbiAgICAgICAgOiB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gICAgY29uc3QgYmFjayA9IGlucHV0Lm92ZXJ2aWV3QmFja0xpbmsgPz8gYFtbJHtjdXJyZW50TmFtZX1dXWA7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5ld05hbWUsXG4gICAgICBuZXdEZWNrTGlua3M6IGZpcnN0UGFnZUV4aXN0cyA/IFtiYWNrLCBvbGRGaXJzdF0gOiBbYmFja10sXG4gICAgICByZXdyaXRlczogW3sgbmFtZTogY3VycmVudE5hbWUsIGRlY2s6IFtgW1ske25ld05hbWV9XV1gXSB9XSxcbiAgICB9O1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFNsaWRlOiBmaXJzdCBsaW5rIGlzIHRoZSBvdmVydmlldyBwYWdlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBjb25zdCBvdmVydmlld0xpbmsgPSBjdXJyZW50TGlua3NbMF07XG4gIGlmICghb3ZlcnZpZXdMaW5rKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgbmV4dExpbmsgPSBjdXJyZW50TGlua3NbMV07XG5cbiAgaWYgKG5leHRMaW5rKSB7XG4gICAgY29uc3QgbmV4dE5hbWUgPSBleHRyYWN0TGlua1RleHQobmV4dExpbmspO1xuICAgIGlmIChuZXh0TmFtZSAmJiBpc1BsYWluTmFtZShuZXh0TmFtZSkgJiYgbmV4dE5hbWUgIT09IGN1cnJlbnROYW1lKSB7XG4gICAgICBpZiAoIWlucHV0LmV4aXN0aW5nTmFtZXMuaGFzKG5leHROYW1lKSkge1xuICAgICAgICAvLyBUaGUgZGVjbGFyZWQgbmV4dCBub3RlIGRvZXMgbm90IGV4aXN0IHlldCBcdTIxOTIgY3JlYXRlIGV4YWN0bHkgdGhhdFxuICAgICAgICAvLyBub3RlIChmaXhlcyB0aGUgYnJva2VuLWxpbmsgd2FybmluZywgaG9ub3VycyB0aGUgYXV0aG9yJ3MgaW50ZW50KS5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuZXdOYW1lOiBuZXh0TmFtZSxcbiAgICAgICAgICBuZXdEZWNrTGlua3M6IFtvdmVydmlld0xpbmtdLFxuICAgICAgICAgIHJld3JpdGVzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIC8vIEEgdmFsaWQgbmV4dCBub3RlIGV4aXN0cyBcdTIxOTIgaW5zZXJ0IGJldHdlZW4gaXQgYW5kIHRoZSBjdXJyZW50IG5vdGUuXG4gICAgICBjb25zdCBuZXdOYW1lID0gdW5pcXVlTmFtZShgJHtjdXJyZW50TmFtZX0tbmV4dGAsIGlucHV0LmV4aXN0aW5nTmFtZXMpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmV3TmFtZSxcbiAgICAgICAgbmV3RGVja0xpbmtzOiBbb3ZlcnZpZXdMaW5rLCBuZXh0TGlua10sXG4gICAgICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW292ZXJ2aWV3TGluaywgYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBJbnZhbGlkIChwYXRoLXF1YWxpZmllZCAvIHNlbGYtcmVmZXJlbmNpbmcpIG5leHQgbGluayBcdTIxOTIgZHJvcCBpdCBhbmRcbiAgICAvLyBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSAoZmFsbCB0aHJvdWdoIHRvIHRoZSBuby1uZXh0IGJyYW5jaCkuXG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTGFzdCBzbGlkZSBcdTIxOTIgYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgYWZ0ZXIgaXQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZSxcbiAgICBuZXdEZWNrTGlua3M6IFtvdmVydmlld0xpbmtdLFxuICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW292ZXJ2aWV3TGluaywgYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gIH07XG59XG5cbi8qKiBBIG5hbWUgdXNhYmxlIGFzIGEgdmF1bHQgbm90ZSBuYW1lOiBubyBwYXRoIHNlcGFyYXRvcnMsIG5vbi1lbXB0eSAqL1xuZnVuY3Rpb24gaXNQbGFpbk5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBuYW1lLmxlbmd0aCA+IDAgJiYgIW5hbWUuaW5jbHVkZXMoXCIvXCIpICYmICFuYW1lLmluY2x1ZGVzKFwiXFxcXFwiKTtcbn1cblxuLyoqIEZpcnN0IGZyZWUgbmFtZSBpbiB0aGUgZmFtaWx5IGBiYXNlYCwgYGJhc2UtMmAsIGBiYXNlLTNgLCBcdTIwMjYgKi9cbmZ1bmN0aW9uIHVuaXF1ZU5hbWUoYmFzZTogc3RyaW5nLCBleGlzdGluZzogU2V0PHN0cmluZz4pOiBzdHJpbmcge1xuICBpZiAoIWV4aXN0aW5nLmhhcyhiYXNlKSkgcmV0dXJuIGJhc2U7XG4gIGZvciAobGV0IGkgPSAyOyA7IGkrKykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2Jhc2V9LSR7aX1gO1xuICAgIGlmICghZXhpc3RpbmcuaGFzKGNhbmRpZGF0ZSkpIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IFNMSURFU19USEVNRVMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKiogU2V0dGluZ3MgdGFiOiB0b2dnbGVzIHRoZSBuYXYgYnV0dG9ucywgcGFnZSBudW1iZXIsIGF1dG8tZW50ZXIgYW5kIGJhciB2aXNpYmlsaXR5LiAqL1xuZXhwb3J0IGNsYXNzIE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJOYXRpdmUgU2xpZGVzIFx1MDBCNyBTZXR0aW5nc1wiIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlN0eWxlIHRlbXBsYXRlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgU2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBTTElERVNfVEhFTUVTKSBkcm9wZG93bi5hZGRPcHRpb24odC5pZCwgdC5sYWJlbCk7XG4gICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHNsaWRlcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0Jhcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0JhciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgUHJldmlvdXMvTmV4dCBidXR0b25zXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQYWdlIG51bWJlciBzdHlsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIk4gLyBUb3RhbFwiOiBvdmVydmlldyA9IHBhZ2UgMCwgY29udGVudCBmcm9tIDEsIHRvdGFsIGV4Y2x1ZGVzIG92ZXJ2aWV3LiBcIk5cIjoganVzdCB0aGUgY3VycmVudCBwYWdlIG51bWJlci4gXCJOb25lXCI6IGhpZGRlbi4nLFxuICAgICAgKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT5cbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9ucyh7XG4gICAgICAgICAgICBmcmFjdGlvbjogXCJOIC8gVG90YWxcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IFwiTlwiLFxuICAgICAgICAgICAgbm9uZTogXCJOb25lXCIsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucGFnZU51bWJlclN0eWxlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSA9IHZhbHVlIGFzIFwiZnJhY3Rpb25cIiB8IFwiY3VycmVudFwiIHwgXCJub25lXCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBwcm9ncmVzcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyIC0tIG9uZSBwZXIgc2xpZGUsIGNsaWNrIHRvIGp1bXBcIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1Byb2dyZXNzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQXV0by1lbnRlciBTbGlkZXMgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiT3BlbiBkZWNrIG5vdGVzIGRpcmVjdGx5IGluIFNsaWRlcyBtb2RlLiBMZWF2ZSBvZmYgdG8gZW50ZXIgbWFudWFsbHkgd2l0aCB0aGUgVG9nZ2xlIFNsaWRlcyBNb2RlIGNvbW1hbmQgKE1vZCtTaGlmdCtFKSBvciB0aGUgcHJldmlvdXMvbmV4dCBwYWdlIGhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVzY2FwZSBleGl0cyBTbGlkZXMgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXCJQcmVzcyBFc2NhcGUgdG8gbGVhdmUgU2xpZGVzIG1vZGUgYW5kIHJldHVybiB0byB0aGUgcHJldmlvdXMgdmlld1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTbGlkZXMgdGl0bGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkZyb250bWF0dGVyIHByb3BlcnR5IHRvIHNob3cgYXMgdGhlIGNhcmQgdGl0bGUgKEgxKS4gTGVhdmUgZW1wdHkgZm9yIG5vbmU7IHR5cGUgYGZpbGVuYW1lYCB0byB1c2UgdGhlIGZpbGUgbmFtZS5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiZS5nLiB0aXRsZVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaXRsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaXRsZSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkJhciBwcm9wZXJ0aWVzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgdG8gc2hvdyBpbiB0aGUgc2xpZGVzIGJhciAoZS5nLiBgdW5pdmVyc2l0eSwgc2hvcnQtdGl0bGUsIGRhdGVgKS4gRWFjaCB2YWx1ZSBmaWxscyBhbiBlcXVhbC13aWR0aCBjb2x1bW47IGRyYWcgZGl2aWRlcnMgdG8gcmVzaXplLiBMZWF2ZSBlbXB0eSB0byBzaG93IG5vdGhpbmcuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcImUuZy4gdW5pdmVyc2l0eSwgZGF0ZVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmJhclByb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJOYXZpZ2F0aW9uIGhvdGtleXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkRlZmF1bHQ6IFByZXZpb3VzIFBhZ2UgTW9kK1NoaWZ0K1x1MjE5MCwgTmV4dCBQYWdlIE1vZCtTaGlmdCtcdTIxOTIuIFJlYmluZCB1bmRlciBTZXR0aW5ncyBcdTIxOTIgSG90a2V5cy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT5cbiAgICAgICAgYnV0dG9uLnNldEJ1dHRvblRleHQoXCJPcGVuIEhvdGtleXMgU2V0dGluZ3NcIikub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgLy8gT3BlbiBPYnNpZGlhbidzIGhvdGtleXMgc2V0dGluZ3MgcGFnZSAoaW50ZXJuYWwgQVBJOyBpZ25vcmUgZmFpbHVyZXMpXG4gICAgICAgICAgKFxuICAgICAgICAgICAgdGhpcy5hcHAgYXMgdW5rbm93biBhcyB7IHNldHRpbmc/OiB7IG9wZW5UYWJCeUlkPzogKGlkOiBzdHJpbmcpID0+IHZvaWQgfSB9XG4gICAgICAgICAgKS5zZXR0aW5nPy5vcGVuVGFiQnlJZD8uKFwiaG90a2V5c1wiKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuICB9XG59XG4iLCAiLyoqIFJlbW92ZSBhbGwgY2hpbGRyZW4gb2YgYW4gZWxlbWVudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2hpbGRyZW4oZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIHdoaWxlIChlbC5maXJzdENoaWxkKSBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXdCQSxJQUFBQSxtQkFBNEM7OztBQ3ZCckMsU0FBUyxZQUF5QjtBQUN2QyxRQUFNLE1BQU0sU0FBUyxjQUFjLEtBQUs7QUFDeEMsTUFBSSxZQUFZO0FBQ2hCLE1BQUksTUFBTSxVQUFVO0FBQ3BCLE1BQUksUUFBUTtBQUlaLE1BQUksaUJBQWlCLGFBQWEsQ0FBQyxNQUFNO0FBQ3ZDLE1BQUUsZUFBZTtBQUNqQixVQUFNLFNBQVMsU0FBUztBQUN4QixRQUFJLGtCQUFrQixlQUFlLFdBQVcsU0FBUyxLQUFNLFFBQU8sS0FBSztBQUFBLEVBQzdFLENBQUM7QUFDRCxTQUFPO0FBQ1Q7QUFHTyxTQUFTLFVBQ2QsT0FDQSxLQUNBLFNBQ0EsV0FBVyxPQUNRO0FBQ25CLFFBQU0sTUFBTSxTQUFTLGNBQWMsUUFBUTtBQUMzQyxNQUFJLFlBQVk7QUFDaEIsTUFBSSxjQUFjO0FBQ2xCLE1BQUksUUFBUTtBQUNaLE1BQUksV0FBVztBQUNmLE1BQUksQ0FB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SUFDaEMsMEJBQTBCO0FBQUEsSUFDMUI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxPQUFPO0FBQUEsSUFDUCxXQUFXLE1BQU0sV0FBVztBQUFBLE1BQzFCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVyxNQUFNLE1BQU07QUFBQSxNQUNyQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUksTUFBTSxJQUFJO0FBQUEsTUFDWjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFVBQVUsTUFBTSxVQUFVO0FBQUEsTUFDeEI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVyxNQUFNLEtBQUs7QUFBQSxNQUNwQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFlBQVksTUFBTSxPQUFPO0FBQUEsTUFDdkI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixD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TSxRQUFRLEtBQUssTUFBTSxTQUFTO0FBQ2xDLFdBQUssY0FDSCxLQUFLLFNBQVMsb0JBQW9CLGFBQWEsR0FBRyxLQUFLLEtBQUssTUFBTSxLQUFLLEtBQUssR0FBRyxLQUFLLEtBQUs7QUFDM0YsV0FBSyxJQUFJLFlBQVksSUFBSTtBQUFBLElBQzNCO0FBR0EsUUFBSSxLQUFLLFNBQVMsZ0JBQWdCLFFBQVEsS0FBSyxNQUFNLFNBQVMsR0FBRztBQUMvRCxZQUFNLFdBQVcsU0FBUyxjQUFjLEtBQUs7QUFDN0MsZUFBUyxZQUFZO0FBQ3JCLGVBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVEsS0FBSztBQUMxQyxjQUFNLE1BQU0sU0FBUyxjQUFjLEtBQUs7QUFDeEMsY0FBTSxRQUFRLElBQUksS0FBSyxRQUFRLFNBQVMsTUFBTSxLQUFLLFFBQVEsWUFBWTtBQUN2RSxZQUFJLFlBQVksMERBQTBELEtBQUs7QUFDL0UsWUFBSSxpQkFBaUIsU0FBUyxNQUFNLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQztBQUN2RCxpQkFBUyxZQUFZLEdBQUc7QUFBQSxNQUMxQjtBQUNBLFdBQUssSUFBSSxZQUFZLFFBQVE7QUFBQSxJQUMvQjtBQUlBLFNBQUssSUFBSSxNQUFNLFVBQVUsS0FBSyxJQUFJLHNCQUFzQixJQUFJLFNBQVM7QUFBQSxFQUN2RTtBQUNGOyIsCiAgIm5hbWVzIjogWyJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAibmV3TmFtZSIsICJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
