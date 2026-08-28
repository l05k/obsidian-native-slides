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
var import_obsidian8 = require("obsidian");

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

// src/capacity.ts
var import_obsidian = require("obsidian");

// src/capacity-core.ts
function computeCapacity(m) {
  const H = m.text.height;
  const floor = (n) => Math.max(0, Math.floor(n));
  const bodyLines = floor(H / m.body.lineHeight);
  const bulletH = m.bullet?.itemHeight ?? m.body.lineHeight;
  const bullets = floor(H / bulletH);
  const h1H = m.h1?.lineHeight ?? m.body.lineHeight;
  const h1Lines = floor(H / h1H);
  const h2H = m.h2?.lineHeight ?? m.body.lineHeight;
  const afterSpan = (firstH, itemH) => floor((H - firstH) / itemH);
  return {
    bodyLines,
    bullets,
    h1Lines,
    combos: {
      afterH1Bullets: afterSpan(h1H, bulletH),
      afterH2Bullets: afterSpan(h2H, bulletH),
      afterH1BodyLines: afterSpan(h1H, m.body.lineHeight)
    }
  };
}
function promptLocale() {
  const lang = typeof document !== "undefined" ? document.documentElement.getAttribute("lang") ?? navigator.language ?? "en" : "en";
  return lang.toLowerCase().startsWith("zh") ? "zh" : "en";
}
function fmt(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
function boxStr(kind, box) {
  if (!box) return `${kind}: -`;
  return `${kind}: ${fmt(box.lineHeight)}px/line (font ${fmt(box.fontSize)}px)`;
}
function enPrompt(m, c, note) {
  const bar = m.bar.visible || m.bar.height > 0 ? `Slides bar: visible, ${m.bar.height}px (already excluded from the text area).` : "Slides bar: hidden.";
  const title = m.titleReserved > 0 ? `Card title: ${m.titleReserved}px reserved.` : "Card title: none.";
  const img = m.imageHeight !== null ? `Image: ${m.imageHeight}px tall (first image on the slide).` : "";
  const samples = [
    `Plain text: ${c.bodyLines} body lines`,
    `H1 + bullets: ${c.combos.afterH1Bullets} bullets after a H1 line`,
    `Pure list: ${c.bullets} bullet items`,
    `H1 lines only: ${c.h1Lines}`
  ].join("; ");
  return [
    `Slide capacity \u2014 one screen, no scrolling. Generated from the live Slides layout of this note; every number is measured/branch-derived at the current UI scale.`,
    ``,
    `Geometry: screen ${m.viewport.width}\xD7${m.viewport.height}px; text area ${m.text.width}\xD7${m.text.height}px. ${bar} ${title}`,
    ``,
    `Text metrics (body font ${fmt(m.body.fontSize)}px):`,
    `chars/line \u2248 ${Math.floor(m.text.width / m.char.latin)} latin / ${Math.floor(m.text.width / m.char.cjk)} CJK; body line ${fmt(m.body.lineHeight)}px.`,
    boxStr("H1", m.h1),
    boxStr("H2", m.h2),
    boxStr("H3", m.h3),
    boxStr(
      "bullet",
      m.bullet ? { fontSize: m.body.fontSize, lineHeight: m.bullet.itemHeight } : null
    ),
    boxStr("code", m.code ? { fontSize: m.body.fontSize, lineHeight: m.code.lineHeight } : null)
  ].concat(img ? [img] : []).concat([``, `Capacity: ${samples}.`, ``, note]).join("\n");
}
function zhPrompt(m, c, note) {
  const bar = m.bar.visible || m.bar.height > 0 ? `Slides \u680F\uFF1A\u663E\u793A\uFF0C${m.bar.height}px\uFF08\u5DF2\u4ECE\u6587\u5B57\u533A\u6263\u51CF\uFF09\u3002` : "Slides \u680F\uFF1A\u9690\u85CF\u3002";
  const title = m.titleReserved > 0 ? `\u5361\u7247\u6807\u9898\uFF1A\u9884\u7559 ${m.titleReserved}px\u3002` : "\u5361\u7247\u6807\u9898\uFF1A\u65E0\u3002";
  const img = m.imageHeight !== null ? `\u56FE\u7247\uFF1A${m.imageHeight}px \u9AD8\uFF08\u5F53\u524D\u9875\u7B2C\u4E00\u5F20\uFF09\u3002` : "";
  const samples = [
    `\u7EAF\u6B63\u6587\uFF1A${c.bodyLines} \u884C`,
    `H1 + \u5217\u8868\uFF1AH1 \u540E\u8FD8\u53EF\u653E ${c.combos.afterH1Bullets} \u4E2A\u5217\u8868\u9879`,
    `\u7EAF\u5217\u8868\uFF1A${c.bullets} \u4E2A\u5217\u8868\u9879`,
    `\u7EAF H1\uFF1A${c.h1Lines} \u884C`
  ].join("\uFF1B");
  return [
    `\u5E7B\u706F\u7247\u5BB9\u91CF \u2014\u2014 \u4E00\u5C4F\uFF0C\u4E0D\u6EDA\u52A8\u3002\u57FA\u4E8E\u5F53\u524D\u7B14\u8BB0\u7684\u5B9E\u65F6 Slides \u5E03\u5C40\u751F\u6210\uFF1B\u6240\u6709\u6570\u5B57\u6309\u5F53\u524D UI \u6BD4\u4F8B\u5B9E\u6D4B/\u63A8\u7B97\u3002`,
    ``,
    `\u51E0\u4F55\uFF1A\u5C4F\u5E55 ${m.viewport.width}\xD7${m.viewport.height}px\uFF1B\u6587\u5B57\u533A ${m.text.width}\xD7${m.text.height}px\u3002${bar} ${title}`,
    ``,
    `\u6587\u5B57\u53C2\u6570\uFF08\u6B63\u6587 ${fmt(m.body.fontSize)}px\uFF09\uFF1A`,
    `\u6BCF\u884C\u7EA6 ${Math.floor(m.text.width / m.char.cjk)} \u4E2A\u6C49\u5B57 / ${Math.floor(m.text.width / m.char.latin)} \u4E2A\u62C9\u4E01\u5B57\u7B26\uFF1B\u6B63\u6587\u884C\u9AD8 ${fmt(m.body.lineHeight)}px\u3002`,
    boxStr("H1", m.h1),
    boxStr("H2", m.h2),
    boxStr("H3", m.h3),
    boxStr(
      "\u5217\u8868\u9879",
      m.bullet ? { fontSize: m.body.fontSize, lineHeight: m.bullet.itemHeight } : null
    ),
    boxStr("\u4EE3\u7801\u884C", m.code ? { fontSize: m.body.fontSize, lineHeight: m.code.lineHeight } : null)
  ].concat(img ? [img] : []).concat([``, `\u5BB9\u91CF\uFF1A${samples}\u3002`, ``, note]).join("\n");
}
function formatCapacity(m, c, locale) {
  const note = locale === "zh" ? "\u8981\u6C42\uFF1A\u751F\u6210\u7684\u5185\u5BB9\u5FC5\u987B\u653E\u5728\u5F53\u524D\u8FD9\u4E00\u5C4F\u5185\uFF0C\u4E0D\u8981\u6EDA\u52A8\uFF1B\u7528\u4E0A\u9762\u7684\u51E0\u4F55\u4E0E\u884C\u9AD8\u6570\u5B57\u6838\u7B97\u603B\u9AD8\u5EA6\uFF08\u6B63\u6587\u884C\u6570 \xD7 \u884C\u9AD8 + \u6807\u9898\u9884\u7559 + \u5757\u95F4\u95F4\u8DDD \u2264 \u6587\u5B57\u533A\u9AD8\u5EA6\uFF09\u3002" : "Requirement: the generated content must fit this one screen \u2014 no scrolling. Check the total height with the numbers above (lines \xD7 line-height + title reserve + inter-block spacing \u2264 text area height).";
  return locale === "zh" ? zhPrompt(m, c, note) : enPrompt(m, c, note);
}

// src/capacity.ts
var px = (v) => Number.parseFloat(v);
var SAMPLE_LATIN = "The quick brown fox jumps over the lazy dog 0123456789 abcdefghijklmnopqrstuvwxyz";
var SAMPLE_CJK = "\u4E00\u5C4F\u4E00\u5361\u5E7B\u706F\u7247\u5185\u5BB9\u6D4B\u91CF\u793A\u4F8B\uFF0C\u6BCF\u884C\u53EF\u4EE5\u6392\u4E0B\u591A\u5C11\u4E2A\u5B57\uFF1A\u52A0\u51CF\u4E58\u9664\u767E\u5206\u6BD4\u3002";
function avgCharWidth(font, sample) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 24;
  ctx.font = font;
  return ctx.measureText(sample).width / sample.length;
}
function lineBox(el) {
  const cs = getComputedStyle(el);
  const fs = px(cs.fontSize);
  const lhRaw = cs.lineHeight;
  return { fontSize: fs, lineHeight: px(lhRaw) > 0 ? px(lhRaw) : fs * 1.5 };
}
function measureSlides(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
  if (!view) return null;
  const root = view.contentEl;
  const scroller = root.querySelector(".cm-scroller");
  const content = root.querySelector(".cm-content");
  if (!scroller || !content) return null;
  const csScroll = getComputedStyle(scroller);
  const csContent = getComputedStyle(content);
  const screenH = scroller.clientHeight;
  const textTopPad = px(csScroll.paddingTop);
  const textBottomPad = px(csScroll.paddingBottom);
  const cardPadTop = px(csContent.paddingTop);
  const cardPadBottom = px(csContent.paddingBottom);
  const hasTitle = content.hasAttribute("data-slides-title") || content.hasAttribute("data-slides-title-native");
  const titleReserved = hasTitle ? Math.round(Math.max(0, cardPadTop - cardPadBottom) * 100) / 100 : 0;
  const textHeight = Math.round(
    Math.max(0, screenH - textTopPad - textBottomPad - cardPadTop - cardPadBottom) * 100
  ) / 100;
  const textWidth = content.clientWidth - px(csContent.paddingLeft) - px(csContent.paddingRight);
  const viewportWidth = scroller.clientWidth;
  const viewportHeight = screenH;
  const bar = document.querySelector(".native-slides-bar");
  const barVisible = bar !== null && getComputedStyle(bar).display !== "none";
  const barHeight = bar && barVisible ? bar.offsetHeight : 0;
  const header = (cls) => root.querySelector(`.cm-content ${cls}`);
  const h1El = header(".cm-header-1");
  const h2El = header(".cm-header-2");
  const h3El = header(".cm-header-3");
  const bulletEl = root.querySelector(".cm-content .HyperMD-list-line");
  const codeEl = root.querySelector(".cm-content pre, .cm-content .HyperMD-codeblock");
  const imgEl = root.querySelector(".cm-content img:not(.cm-widgetBuffer)");
  const bodyEl = Array.from(
    root.querySelectorAll(
      ".cm-content .cm-line:not(.HyperMD-header):not(.HyperMD-list-line):not(.HyperMD-quote):not(.HyperMD-codeblock)"
    )
  ).find((el) => el.textContent !== null && el.textContent.trim().length > 0) ?? content;
  const body = lineBox(bodyEl);
  const h1 = h1El ? lineBox(h1El) : null;
  const h2 = h2El ? lineBox(h2El) : null;
  const h3 = h3El ? lineBox(h3El) : null;
  const cs = (el) => getComputedStyle(el);
  let bullet = null;
  if (bulletEl) {
    const c = cs(bulletEl);
    bullet = {
      itemHeight: px(c.lineHeight) + px(c.paddingTop) + px(c.paddingBottom)
    };
  }
  let code = null;
  if (codeEl) {
    const c = cs(codeEl);
    code = { lineHeight: px(c.lineHeight) > 0 ? px(c.lineHeight) : px(c.fontSize) * 1.5 };
  }
  const imageHeight = imgEl && imgEl.getBoundingClientRect().height > 0 ? Math.round(imgEl.getBoundingClientRect().height) : null;
  const sizer = root.querySelector(".cm-sizer");
  const sizerStyle = sizer ? cs(sizer) : null;
  const deriveBox = (sizeVar, lhVar) => {
    const em = sizerStyle ? px(sizerStyle.getPropertyValue(sizeVar)) : NaN;
    const lh = sizerStyle ? px(sizerStyle.getPropertyValue(lhVar)) : NaN;
    const fontSize = em > 0 ? em * body.fontSize : body.fontSize;
    const lineHeight = lh > 0 ? lh * fontSize : body.lineHeight;
    return { fontSize, lineHeight };
  };
  const deriveH1 = deriveBox("--h1-size", "--h1-line-height");
  const deriveH2 = deriveBox("--h2-size", "--h2-line-height");
  const deriveH3 = deriveBox("--h3-size", "--h3-line-height");
  const deriveCode = () => {
    const rootFont = px(getComputedStyle(document.documentElement).fontSize);
    return { lineHeight: rootFont * 1.5 };
  };
  const fontFamily = cs(content).fontFamily;
  const font = `400 ${body.fontSize}px ${fontFamily}`;
  const char = {
    latin: avgCharWidth(font, SAMPLE_LATIN),
    cjk: avgCharWidth(font, SAMPLE_CJK)
  };
  return {
    viewport: { width: viewportWidth, height: viewportHeight },
    text: { width: textWidth, height: textHeight },
    bar: {
      visible: barVisible,
      height: barHeight
    },
    titleReserved: Math.round(titleReserved * 100) / 100,
    body,
    h1: h1 ?? deriveH1,
    h2: h2 ?? deriveH2,
    h3: h3 ?? deriveH3,
    bullet,
    code: code ?? deriveCode(),
    imageHeight,
    char
  };
}
async function copyCapacityPrompt(app) {
  const m = measureSlides(app);
  if (!m) {
    new import_obsidian.Notice("Native slides: could not measure the Slides layout");
    return;
  }
  const prompt = formatCapacity(m, computeCapacity(m), promptLocale());
  try {
    await navigator.clipboard.writeText(prompt);
  } catch (error) {
    new import_obsidian.Notice(`Native slides: clipboard write failed (${String(error)})`);
  }
}

// src/debug.ts
var import_obsidian3 = require("obsidian");

// src/mode.ts
var import_obsidian2 = require("obsidian");
function currentMode(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
  return view ? view.getMode() : "";
}
function isLivePreview(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
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
  const view = app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
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
    new import_obsidian3.Notice("Native slides: enter Slides mode first (Mod+Shift+E on a deck note)");
    return;
  }
  const view = app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
  if (!view) {
    new import_obsidian3.Notice("Native slides: no active Markdown note");
    return;
  }
  const startMode = view.getMode();
  const activeFile = app.workspace.getActiveFile();
  const leaf = app.workspace.getLeaf(false);
  const edit = {};
  for (const name of SAMPLE_NOTE_NAMES) {
    const f = app.vault.getAbstractFileByPath(`tests/${name}.md`);
    if (!(f instanceof import_obsidian3.TFile)) continue;
    await leaf.openFile(f, { state: { mode: "source" } });
    await sleep(500);
    const s = sampleStyles(app);
    if (s) mergeSample(edit, s);
  }
  let reading = null;
  const demo = app.vault.getAbstractFileByPath("tests/typography-demo.md");
  if (demo instanceof import_obsidian3.TFile) {
    await leaf.openFile(demo, { state: { mode: "preview" } });
    await sleep(800);
    reading = sampleStyles(app);
  }
  if (activeFile) {
    await leaf.openFile(activeFile, { state: { mode: startMode } });
    plugin.refresh();
  }
  if (!reading) {
    new import_obsidian3.Notice("Native slides: reading sample failed");
    return;
  }
  const payload = { edit, reading, diff: diffDumps(edit, reading) };
  try {
    await app.vault.adapter.write(".native-slides-debug.json", JSON.stringify(payload, null, 2));
    new import_obsidian3.Notice("Typography dump \u2192 .native-slides-debug.json (vault root)");
  } catch (error) {
    new import_obsidian3.Notice(`Native slides: could not write debug file (${String(error)})`);
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
    id: "ns-copy-capacity",
    name: "Copy slide capacity",
    checkCallback: (checking) => {
      if (!document.body.classList.contains("native-slides-mode")) return false;
      if (!checking) void copyCapacityPrompt(plugin.app);
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
    if (!(f instanceof import_obsidian4.TFile)) return [];
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
      new import_obsidian4.Notice(`Native slides: could not create "${plan.newName}.md" (${String(error)})`);
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
      if (!(f instanceof import_obsidian4.TFile)) continue;
      const next = rewrite.nextPath ? this.app.vault.getAbstractFileByPath(rewrite.nextPath) : null;
      await this.app.fileManager.processFrontMatter(f, (fm) => {
        fm[DECK_KEY] = next instanceof import_obsidian4.TFile ? [`[[${next.basename}]]`] : [];
      });
    }
    const trashed = [];
    for (const path of deletePaths) {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof import_obsidian4.TFile)) continue;
      try {
        await this.app.fileManager.trashFile(f);
        trashed.push(path);
      } catch (error) {
        new import_obsidian4.Notice(`Native slides: could not delete "${f.basename}" (${String(error)})`);
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
var import_obsidian6 = require("obsidian");

// src/confirm-delete.ts
var import_obsidian5 = require("obsidian");
var MAX_VISIBLE_NAMES = 8;
var ConfirmDeleteModal = class extends import_obsidian5.Modal {
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
var SlidesPanelView = class extends import_obsidian6.ItemView {
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
    const chain = deck ? deck.chain.filter((p) => this.app.vault.getAbstractFileByPath(p) instanceof import_obsidian6.TFile) : [];
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
      if (!(f instanceof import_obsidian6.TFile)) return;
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
    const menu = new import_obsidian6.Menu();
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
      return f instanceof import_obsidian6.TFile ? f.basename : p;
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
      if (f instanceof import_obsidian6.TFile) await this.openSlide(f);
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
var import_obsidian7 = require("obsidian");
var NativeSlidesSettingTab = class extends import_obsidian7.PluginSettingTab {
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
    new import_obsidian7.Setting(containerEl).setName("Style template").setDesc(
      "Built-in look for the slides card and slides bar (border, background, shadow, bar styling). Every template adapts to light and dark themes."
    ).addDropdown((dropdown) => {
      for (const t of SLIDES_THEMES) dropdown.addOption(t.id, t.label);
      dropdown.setValue(this.plugin.settings.slidesTheme).onChange(async (value) => {
        this.plugin.settings.slidesTheme = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      });
    });
    new import_obsidian7.Setting(containerEl).setName("Center images").setDesc(
      "Images render centered on the slide as a card block exactly as tall as the picture. Turn off for Obsidian's usual behavior: images stay inline with the text (a small image and its caption sit on the same row)."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.imageLayout).onChange(async (value) => {
        this.plugin.settings.imageLayout = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Show slides bar").setDesc("Master toggle for the entire slides bar at the bottom of the window").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showSlidesBar).onChange(async (value) => {
        this.plugin.settings.showSlidesBar = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Show previous/next buttons").setDesc(
      "Show \u25C0 \u25B6 buttons on the left of the slides bar when the note belongs to a deck (has a `deck` property)"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showNavButtons).onChange(async (value) => {
        this.plugin.settings.showNavButtons = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Page number style").setDesc(
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
    new import_obsidian7.Setting(containerEl).setName("Show progress bar").setDesc(
      "Discrete clickable segments at the top of the slides bar -- one per slide, click to jump"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showProgress).onChange(async (value) => {
        this.plugin.settings.showProgress = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Auto-enter slides mode").setDesc(
      "Open deck notes directly in Slides mode. Leave off to enter manually with the Toggle Slides Mode command (Mod+Shift+E) or the previous/next page hotkeys."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoEnterSlides).onChange(async (value) => {
        this.plugin.settings.autoEnterSlides = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Escape exits slides mode").setDesc("Press escape to leave slides mode and return to the previous view").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.escExitsSlides).onChange(async (value) => {
        this.plugin.settings.escExitsSlides = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Slides title").setDesc(
      "Frontmatter property to show as the card title (H1). Leave empty for none; type `filename` to use the file name."
    ).addText(
      (text) => text.setPlaceholder("E.g. Title").setValue(this.plugin.settings.slidesTitle).onChange(async (value) => {
        this.plugin.settings.slidesTitle = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Bar properties").setDesc(
      "Comma-separated frontmatter property names to show in the slides bar (e.g. `university, short-title, date`). Each value fills an equal-width column; drag dividers to resize. Leave empty to show nothing."
    ).addText(
      (text) => text.setPlaceholder("E.g. University, date").setValue(this.plugin.settings.barProperties).onChange(async (value) => {
        this.plugin.settings.barProperties = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Confirm slide deletion").setDesc(
      "Ask for confirmation before deleting slides from the slides panel's right-click menu. Deletion moves slides to the trash."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.confirmDeleteSlides).onChange(async (value) => {
        this.plugin.settings.confirmDeleteSlides = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian7.Setting(containerEl).setName("Navigation hotkeys").setDesc(
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
var NativeSlidesPlugin = class extends import_obsidian8.Plugin {
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
        const view = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian8.MarkdownView);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jYXBhY2l0eS50cyIsICJzcmMvY2FwYWNpdHktY29yZS50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVjay1zZXJ2aWNlLnRzIiwgInNyYy9kZWNrLnRzIiwgInNyYy9jcmVhdGVOZXh0LnRzIiwgInNyYy9kZWxldGVTbGlkZXMudHMiLCAic3JjL3BhbmVsLnRzIiwgInNyYy9jb25maXJtLWRlbGV0ZS50cyIsICJzcmMvc2V0dGluZ3MudHMiLCAic3JjL3V0aWxzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIG5hdGl2ZS1zbGlkZXMgXHUyMDE0IGEgXCJTbGlkZXMgbW9kZVwiIGZvciBPYnNpZGlhbiBkZWNrIG5vdGVzXG4gKlxuICogT25lIHJlc2VydmVkIGZyb250bWF0dGVyIGtleSwgYGRlY2tgIChhIHNpbmdsZSBtYXJrZG93biBsaW5rIHRvIHRoZSBuZXh0XG4gKiBzbGlkZSBcdTIwMTQgbmV4dC1vbmx5IHNlbWFudGljcywgbm8gb3ZlcnZpZXcgcGFnZSBzaW5jZSB2MS4wLjApLCBkcml2ZXNcbiAqIHByZXYvbmV4dCBuYXZpZ2F0aW9uIGFuZCBhdXRvLWNvbXB1dGVkIHBhZ2UgbnVtYmVycy4gQSBkZWNrIG5vdGUgY2FuIGJlXG4gKiBlbnRlcmVkIGludG8gKipTbGlkZXMgbW9kZSoqIFx1MjAxNCBhbiBpbW1lcnNpdmUsIGVkaXRhYmxlIChMaXZlIFByZXZpZXcpIHZpZXdcbiAqIHdpdGggYSBzbGlkZXMgYmFyIHNob3dpbmcgcHJvcGVydGllcywgbmF2aWdhdGlvbiBhbmQgdGhlIHBhZ2UgbnVtYmVyLlxuICpcbiAqIE5hdGl2ZSBPYnNpZGlhbiBtb2RlcyAoU291cmNlIC8gZGVmYXVsdCBMaXZlIFByZXZpZXcgLyBSZWFkaW5nIHZpZXcpIGFyZVxuICogbGVmdCBjb21wbGV0ZWx5IHVudG91Y2hlZDogbm8gc3RhdHVzLWJhciBoaWRpbmcsIG5vIHNsaWRlcyBiYXIsIG5vXG4gKiBmdWxsc2NyZWVuLCBubyBzdHlsaW5nLiBTbGlkZXMgbW9kZSBpcyB0aGUgcGx1Z2luJ3Mgb25seSBzdXJmYWNlLlxuICpcbiAqIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgYW5kIGEgdGhpbiBvcmNoZXN0cmF0aW9uIGxheWVyOyB0aGUgbG9naWNcbiAqIGxpdmVzIGluIGBzcmMvYDpcbiAqICAgLSBzcmMvdHlwZXMudHMgICAgICAgIHNldHRpbmdzIHNoYXBlICsgZGVmYXVsdHMgKyByZXNlcnZlZCBgZGVja2Aga2V5XG4gKiAgIC0gc3JjL21vZGUudHMgICAgICAgICB2aWV3IG1vZGUgLyBmcm9udG1hdHRlciBoZWxwZXJzIChwdXJlLCBgQXBwYC1iYXNlZClcbiAqICAgLSBzcmMvZGVjay1zZXJ2aWNlLnRzIGRlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiY3JlYXRlIG5leHQgc2xpZGVcIiBnbHVlXG4gKiAgIC0gc3JjL2Jhci50cyAgICAgICAgICBiYXIgRE9NIGhlbHBlcnMgKGNyZWF0ZSAvIGJ1dHRvbnMgLyB0YWItYmFyIG1lYXN1cmUpXG4gKiAgIC0gc3JjL3BhbmVsLnRzICAgICAgICBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICogICAtIHNyYy9jb21tYW5kcy50cyAgICAgY29tbWFuZCByZWdpc3RyYXRpb24gKGRldi1nYXRlZCBkZWJ1ZyBjb21tYW5kKVxuICogICAtIHNyYy9zZXR0aW5ncy50cyAgICAgc2V0dGluZ3MgdGFiXG4gKiAgIC0gc3JjL2RlYnVnLnRzICAgICAgICB0eXBvZ3JhcGh5IG1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSlcbiAqICAgLSBzcmMvZGVjay50cyAgICAgICAgIHB1cmUgZGVjayBjb3JlICh3aXRoIHNyYy9jcmVhdGVOZXh0LnRzKVxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlIH0gZnJvbSBcIi4vc3JjL2RlY2tcIjtcbmltcG9ydCB7IGFjdGl2ZUZyb250bWF0dGVyLCBjdXJyZW50TW9kZSwgZnJvbnRtYXR0ZXJPZiwgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL3NyYy9tb2RlXCI7XG5pbXBvcnQgeyBTbGlkZXNQYW5lbFZpZXcsIFNMSURFU19QQU5FTF9WSUVXIH0gZnJvbSBcIi4vc3JjL3BhbmVsXCI7XG5pbXBvcnQgeyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIH0gZnJvbSBcIi4vc3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBERUNLX0tFWSwgREVGQVVMVF9TRVRUSU5HUywgU0xJREVTX1RIRU1FUywgdHlwZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB9IGZyb20gXCIuL3NyYy90eXBlc1wiO1xuaW1wb3J0IHsgY2xlYXJDaGlsZHJlbiB9IGZyb20gXCIuL3NyYy91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXRpdmVTbGlkZXNQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAvKiogVGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKi9cbiAgYmFyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWUgKi9cbiAgZGVja1NlcnZpY2UhOiBEZWNrU2VydmljZTtcbiAgLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuICBzZXR0aW5nczogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7IC4uLkRFRkFVTFRfU0VUVElOR1MgfTtcblxuICAvKiogV2hldGhlciBTbGlkZXMgbW9kZSBpcyBjdXJyZW50bHkgYWN0aXZlIChzZXNzaW9uIHN0YXRlLCBub3QgcGVyc2lzdGVkKSAqL1xuICBwcml2YXRlIHNsaWRlc01vZGUgPSBmYWxzZTtcbiAgLyoqIFZpZXcgbW9kZSB0byByZXN0b3JlIHdoZW4gbGVhdmluZyBTbGlkZXMgbW9kZSAoXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiKSAqL1xuICBwcml2YXRlIGV4aXRNb2RlOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgPSBcInNvdXJjZVwiO1xuICAvKiogV2hldGhlciB0aGUgZXhpdCB2aWV3IHdhcyBTb3VyY2UgbW9kZSAodHJ1ZSkgdnMgTGl2ZSBQcmV2aWV3IChmYWxzZSkgKi9cbiAgcHJpdmF0ZSBleGl0U291cmNlID0gZmFsc2U7XG4gIC8qKiBMYXN0IG5vdGUgYXV0by1lbnRlcmVkIGludG8gU2xpZGVzIG1vZGUgKHByZXZlbnRzIHJlLWVudGVyaW5nIGFmdGVyIG1hbnVhbCBleGl0KSAqL1xuICBwcml2YXRlIGF1dG9FbnRlcmVkUGF0aCA9IFwiXCI7XG4gIC8qKiBMYXN0IHJlZnJlc2gga2V5IChcInBhdGh8bW9kZVwiKSB0byBhdm9pZCBwb2ludGxlc3MgcmUtcmVuZGVycyAqL1xuICBwcml2YXRlIGxhc3RLZXkgPSBcIlwiO1xuICAvKiogTGFzdCBtZWFzdXJlZCB0YWItYmFyIGhlaWdodCAocHgpIFx1MjAxNCBjYWNoZWQgd2hpbGUgdGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuICovXG4gIHByaXZhdGUgdGFiQmFySGVpZ2h0ID0gMDtcbiAgLyoqIFdoZXRoZXIgdGhlIG1vdXNlIHBvaW50ZXIgaXMgaGlkZGVuIGZvciBwcmVzZW50aW5nIChzZXNzaW9uIHN0YXRlKSAqL1xuICBwb2ludGVySGlkZGVuID0gZmFsc2U7XG5cbiAgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy5kZWNrU2VydmljZSA9IG5ldyBEZWNrU2VydmljZSh0aGlzLmFwcCk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAxLiBSZWZyZXNoIG9uIFwiY3VycmVudCBub3RlIC8gdmlldyBjaGFuZ2VkXCIgZXZlbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubWF5YmVBdXRvRW50ZXJTbGlkZXMoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZWZyZXNoKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIC8vIFJlZnJlc2ggd2hlbiB0aGUgbm90ZSBjb250ZW50IChpbmNsdWRpbmcgZnJvbnRtYXR0ZXIpIGNoYW5nZXMgLyBzYXZlc1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChmaWxlOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDIuIEZhbGxiYWNrIHRpbWVyOiBlZGl0XHUyMTk0cmVhZGluZyB0b2dnbGVzIG1heSBmaXJlIG5vIHN0YW5kYXJkIGV2ZW50IFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbChcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBjb25zdCBrZXkgPSBmaWxlID8gYCR7ZmlsZS5wYXRofXwke2N1cnJlbnRNb2RlKHRoaXMuYXBwKX1gIDogXCJcIjtcbiAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5sYXN0S2V5KSB7XG4gICAgICAgICAgdGhpcy5sYXN0S2V5ID0ga2V5O1xuICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMy4gQ29tbWFuZHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgcmVnaXN0ZXJDb21tYW5kcyh0aGlzKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzYi4gU2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgb3ZlcnZpZXcsIHJlcGxhY2VzIHRoZSBvbGQgb3ZlcnZpZXcgcGFnZSkgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoU0xJREVTX1BBTkVMX1ZJRVcsIChsZWFmKSA9PiBuZXcgU2xpZGVzUGFuZWxWaWV3KHRoaXMsIGxlYWYpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJwcmVzZW50YXRpb25cIiwgXCJTaG93IHNsaWRlcyBwYW5lbFwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMuYWN0aXZhdGVTbGlkZXNQYW5lbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDQuIFBpbiB0aGUgU2xpZGVzIGVkaXRvciB0byBvbmUgc2NyZWVuIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIENTUyBgb3ZlcmZsb3c6IGhpZGRlbmAgYmxvY2tzIHRoZSB3aGVlbCwgYnV0IG5hdGl2ZSBkcmFnLXNlbGVjdFxuICAgIC8vIGF1dG9zY3JvbGwgYW5kIENvZGVNaXJyb3IncyBwcm9ncmFtbWF0aWMgc2Nyb2xsSW50b1ZpZXcgc3RpbGwgbW92ZSB0aGVcbiAgICAvLyBzY3JvbGxlci4gVGhpcyBjYXB0dXJlLXBoYXNlIGxpc3RlbmVyIHJlc2V0cyBhbnkgc2Nyb2xsIGluc2lkZSB0aGVcbiAgICAvLyBhY3RpdmUgbWFya2Rvd24gdmlldyBiYWNrIHRvIHRoZSB0b3Agd2hpbGUgU2xpZGVzIG1vZGUgaXMgYWN0aXZlLlxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChcbiAgICAgIGRvY3VtZW50LFxuICAgICAgXCJzY3JvbGxcIixcbiAgICAgIChldnQpID0+IHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKCF2aWV3KSByZXR1cm47XG4gICAgICAgIGNvbnN0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdmlldy5jb250ZW50RWwuY29udGFpbnMoZWwpKSB7XG4gICAgICAgICAgaWYgKGVsLnNjcm9sbFRvcCAhPT0gMCkgZWwuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7IGNhcHR1cmU6IHRydWUgfSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDUuIEVzY2FwZSBrZXkgZXhpdHMgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCBcImtleWRvd25cIiwgKGV2dDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IFwiRXNjYXBlXCIgJiYgdGhpcy5zbGlkZXNNb2RlICYmIHRoaXMuc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMpIHtcbiAgICAgICAgdGhpcy5leGl0U2xpZGVzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNi4gQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIGFuZCBkbyB0aGUgZmlyc3QgcmVuZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMuYmFyID0gY3JlYXRlQmFyKCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmJhcik7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBvbnVubG9hZCgpOiB2b2lkIHtcbiAgICB0aGlzLmJhcj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5iYXIgPSBudWxsO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtYmxvY2staW1hZ2VzXCIpO1xuICAgIHRoaXMucmVtb3ZlVGhlbWVDbGFzc2VzKCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2V0dGluZ3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRhdGEgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSBhcyBQYXJ0aWFsPE5hdGl2ZVNsaWRlc1NldHRpbmdzPiB8IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGRhdGEgPz8ge30pO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBub3RlIGlzIGEgZGVjayBub3RlIChoYXMgYSBgZGVja2AgcHJvcGVydHkpICovXG4gIHByaXZhdGUgaXNEZWNrTm90ZShmaWxlOiBURmlsZSB8IG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiBmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgZXZlcnkgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtKmAgY2xhc3MgZnJvbSA8Ym9keT4gKi9cbiAgcHJpdmF0ZSByZW1vdmVUaGVtZUNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBjbHMgb2YgQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNsYXNzTGlzdCkpIHtcbiAgICAgIGlmIChjbHMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgc2luZ2xlIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgc2xpZGVzVGhlbWVgIHNldHRpbmcgXHUyMDE0IHRoZSBzdHlsZSB0ZW1wbGF0ZXMgaW4gc3R5bGVzLmNzcyBob29rIG9mZiBpdC5cbiAgICogVW5rbm93biBpZHMgKGUuZy4gYWZ0ZXIgYSBkb3duZ3JhZGUpIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB0aGVtZS5cbiAgICovXG4gIHByaXZhdGUgYXBwbHlUaGVtZUNsYXNzKCk6IHZvaWQge1xuICAgIGNvbnN0IGlkID0gU0xJREVTX1RIRU1FUy5zb21lKCh0KSA9PiB0LmlkID09PSB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1Muc2xpZGVzVGhlbWU7XG4gICAgY29uc3QgY2xzID0gYG5hdGl2ZS1zbGlkZXMtdGhlbWUtJHtpZH1gO1xuICAgIGZvciAoY29uc3QgYyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpICYmIGMgIT09IGNscykgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaGlkaW5nIHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIGZvciBwcmVzZW50aW5nLiBIaWRpbmcgYWxzb1xuICAgKiBwYXJrcyBmb2N1cyAoYmx1cnMgdGhlIGVkaXRvciwgc28gdGhlIGNhcmV0IGRpc2FwcGVhcnMpOyBzaG93aW5nIGxlYXZlc1xuICAgKiBmb2N1cyBwYXJrZWQgXHUyMDE0IGNsaWNrIHNsaWRlIGNvbnRlbnQgdG8gcmVzdW1lIGVkaXRpbmcuXG4gICAqL1xuICB0b2dnbGVQb2ludGVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9pbnRlckhpZGRlbiA9ICF0aGlzLnBvaW50ZXJIaWRkZW47XG4gICAgaWYgKHRoaXMucG9pbnRlckhpZGRlbikge1xuICAgICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuYCBib2R5IGNsYXNzIGluIHN5bmMgd2l0aCB0aGVcbiAgICogcHJlc2VudGluZyBzdGF0ZSBcdTIwMTQgc3R5bGVzLmNzcyB0dXJucyBldmVyeSBjdXJzb3IgaW52aXNpYmxlIHdoaWxlIHNldC5cbiAgICogTGVhdmluZyBTbGlkZXMgbW9kZSBhbHdheXMgcmVzdG9yZXMgdGhlIHBvaW50ZXIuXG4gICAqL1xuICBwcml2YXRlIHN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwibmF0aXZlLXNsaWRlcy1wb2ludGVyLWhpZGRlblwiLCBzbGlkZXMgJiYgdGhpcy5wb2ludGVySGlkZGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBgbmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNgIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgaW1hZ2VMYXlvdXRgIHNldHRpbmcgXHUyMDE0IHN0eWxlcy5jc3MncyBpbWFnZS1sYXlvdXQgcnVsZXMgaG9vayBvZmYgaXQuXG4gICAqIFRoZSBjbGFzcyBpcyBvbmx5IG1lYW5pbmdmdWwgaW4gU2xpZGVzIG1vZGUuXG4gICAqL1xuICBwcml2YXRlIHN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlczogYm9vbGVhbik6IHZvaWQge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgIFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIixcbiAgICAgIHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLmltYWdlTGF5b3V0LFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjYXJkIHRpdGxlIHBlciB0aGUgYHNsaWRlc1RpdGxlYCBzZXR0aW5nLiBcImZpbGVuYW1lXCIgcmVzdHlsZXNcbiAgICogdGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZSAoc3RpbGwgZWRpdGFibGUgXHUyMDE0IHR5cGluZ1xuICAgKiByZW5hbWVzIHRoZSBub3RlKTsgXCJcIiBzaG93cyBub3RoaW5nOyBhbnkgb3RoZXIgdmFsdWUgbmFtZXMgYSBmcm9udG1hdHRlclxuICAgKiBwcm9wZXJ0eSByZW5kZXJlZCByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudC5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgY29udGVudCA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICAgIGlmICghY29udGVudCB8fCAhZmlsZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3JjID0gdGhpcy5zZXR0aW5ncy5zbGlkZXNUaXRsZS50cmltKCk7XG5cbiAgICAvLyBcImZpbGVuYW1lXCI6IHJlc3R5bGUgdGhlIG5hdGl2ZSAuaW5saW5lLXRpdGxlIGludG8gdGhlIGNhcmQgdGl0bGUuIEl0XG4gICAgLy8gc3RheXMgY29udGVudGVkaXRhYmxlLCBzbyBlZGl0aW5nIGl0IHJlbmFtZXMgdGhlIG5vdGUgYXMgaW4gTGl2ZVxuICAgIC8vIFByZXZpZXcuIFRoZSBuYXRpdmUgaW5saW5lIHRpdGxlIGxpdmVzIG9uIHRoZSBtYXJrZG93bi1zb3VyY2Utdmlld1xuICAgIC8vIGVsZW1lbnQgKGEgc2libGluZyBicmFuY2ggb2YgdGhlIGNhcmQpLCBzbyB0aGUgc3R5bGluZyBob29rIGlzIGFcbiAgICAvLyB2aWV3IGF0dHJpYnV0ZSArIGEgYnJhbmQtbmV3IC5jbS1jb250ZW50IGF0dHJpYnV0ZSB0aGF0IHJlc2VydmVzIHRoZVxuICAgIC8vIHRpdGxlJ3MgaGVpZ2h0IHRoZSBzYW1lIHdheSB0aGUgcHNldWRvLWVsZW1lbnQgdmVyc2lvbiBkaWQuXG4gICAgY29uc3QgbmF0aXZlVGl0bGUgPSBzbGlkZXMgJiYgc3JjID09PSBcImZpbGVuYW1lXCI7XG4gICAgY29uc3Qgc291cmNlVmlldyA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1zb3VyY2Utdmlld1wiKTtcbiAgICBpZiAobmF0aXZlVGl0bGUgJiYgc291cmNlVmlldykgc291cmNlVmlldy5zZXRBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiLCBcImZpbGVuYW1lXCIpO1xuICAgIGVsc2Ugc291cmNlVmlldz8ucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1ucy1pbmxpbmUtdGl0bGVcIik7XG4gICAgY29udGVudC50b2dnbGVBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZS1uYXRpdmVcIiwgbmF0aXZlVGl0bGUpO1xuXG4gICAgLy8gUHJvcGVydHktYmFja2VkIHRpdGxlcyByZW5kZXIgcmVhZC1vbmx5IHZpYSB0aGUgOjpiZWZvcmUgcHNldWRvLWVsZW1lbnRcbiAgICAvLyAobm8gZWRpdGluZyBzdXJmYWNlIFx1MjAxNCB0aGUgcHJvcGVydGllcyBwYW5lbCBpcyBoaWRkZW4gaW4gU2xpZGVzIG1vZGUpLlxuICAgIGxldCB0ZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBpZiAoc2xpZGVzICYmIHNyYyAmJiBzcmMgIT09IFwiZmlsZW5hbWVcIikge1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICAgIGNvbnN0IHYgPSBmbT8uW3NyY107XG4gICAgICBpZiAodiAhPSBudWxsKSB0ZXh0ID0gZm9ybWF0VmFsdWUodik7XG4gICAgfVxuXG4gICAgaWYgKHRleHQpIGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIiwgdGV4dCk7XG4gICAgZWxzZSBjb250ZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpO1xuICB9XG5cbiAgLyoqIEVudGVyIFNsaWRlcyBtb2RlOiByZWNvcmQgdGhlIGV4aXQgc3RhdGUgYW5kIGZvcmNlIHRoZSBMaXZlIFByZXZpZXcgKi9cbiAgcHJpdmF0ZSBhc3luYyBlbnRlclNsaWRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAodmlldykge1xuICAgICAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBtb2RlPzogc3RyaW5nOyBzb3VyY2U/OiBib29sZWFuIH07XG4gICAgICB0aGlzLmV4aXRNb2RlID0gc3RhdGUubW9kZSA9PT0gXCJwcmV2aWV3XCIgPyBcInByZXZpZXdcIiA6IFwic291cmNlXCI7XG4gICAgICB0aGlzLmV4aXRTb3VyY2UgPSBzdGF0ZS5zb3VyY2UgPT09IHRydWU7XG4gICAgICAvLyBTbGlkZXMgbW9kZSBpcyBhbHdheXMgdGhlIGVkaXRhYmxlIExpdmUgUHJldmlld1xuICAgICAgY29uc3QgbmV4dCA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIG5leHQuc3RhdGUgPSB7IC4uLm5leHQuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogZmFsc2UgfTtcbiAgICAgIGF3YWl0IHZpZXcubGVhZi5zZXRWaWV3U3RhdGUobmV4dCwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMuc2xpZGVzTW9kZSA9IHRydWU7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgLy8gUGluIHRoZSBzY3JvbGxlciB0byB0aGUgdG9wIGJlZm9yZSBhbnkgZnJhbWUgcmVuZGVyczogdGhlIHZpZXctc3RhdGVcbiAgICAvLyBjaGFuZ2UgYWJvdmUgbWF5IHJlc3RvcmUgaXQgdG8gdGhlIHNhdmVkIGN1cnNvciBsaW5lIHdpdGhvdXQgZmlyaW5nIGFcbiAgICAvLyBzY3JvbGwgZXZlbnQgYWZ0ZXJ3YXJkcywgc28gdGhlIGNhcHR1cmUtcGhhc2UgcmVzZXQgYmVsb3cgd291bGQgbmV2ZXJcbiAgICAvLyBydW4gYW5kIGEgbG9uZyBub3RlIHdvdWxkIG9wZW4gbWlkLWRvY3VtZW50LlxuICAgIGZvciAoY29uc3QgZWwgb2Ygdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNtLXNjcm9sbGVyXCIpID8/IFtdKSB7XG4gICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgaWYgKGVsLnNjcm9sbExlZnQgIT09IDApIGVsLnNjcm9sbExlZnQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFeGl0IFNsaWRlcyBtb2RlOiByZXN0b3JlIHRoZSB2aWV3IG1vZGUgcmVjb3JkZWQgYXQgZW50cnkgKi9cbiAgcHJpdmF0ZSBleGl0U2xpZGVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIGlmICh0aGlzLmV4aXRNb2RlID09PSBcInByZXZpZXdcIikge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwicHJldmlld1wiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogdGhpcy5leGl0U291cmNlIH07XG4gICAgICB9XG4gICAgICB2b2lkIHZpZXcubGVhZi5zZXRWaWV3U3RhdGUoc3RhdGUsIHsgZm9jdXM6IGZhbHNlIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgU2xpZGVzIG1vZGUgKGRlY2sgbm90ZXMgb25seSBcdTIwMTQgZW5mb3JjZWQgYnkgdGhlIGNvbW1hbmQpICovXG4gIHRvZ2dsZVNsaWRlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlKSB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICBlbHNlIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqIFJldmVhbCB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwsIGNyZWF0aW5nIGl0IGluIHRoZSByaWdodCBzaWRlYmFyIGlmIG5lZWRlZCAqL1xuICBhc3luYyBhY3RpdmF0ZVNsaWRlc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTTElERVNfUEFORUxfVklFVyk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nWzBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikgcmV0dXJuO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogU0xJREVTX1BBTkVMX1ZJRVcsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIE1vdmUgb25lIHN0ZXAgYmFjay9mb3J3YXJkIGFsb25nIHRoZSBkZWNrIGNoYWluIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpICovXG4gIGFzeW5jIG5hdmlnYXRlKGRpcmVjdGlvbjogXCJwcmV2XCIgfCBcIm5leHRcIik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgaWYgKCFkZWNrKSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltkaXJlY3Rpb24gPT09IFwicHJldlwiID8gZGVjay5pbmRleCAtIDEgOiBkZWNrLmluZGV4ICsgMV07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvKiogSnVtcCB0byBhIHNwZWNpZmljIGluZGV4IGluIHRoZSBkZWNrIGNoYWluIChwcm9ncmVzcyBiYXIgY2xpY2spICovXG4gIGFzeW5jIGp1bXBUbyhpbmRleDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBpZiAoIWRlY2sgfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IGRlY2suY2hhaW4ubGVuZ3RoIHx8IGluZGV4ID09PSBkZWNrLmluZGV4KSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltpbmRleF07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQmFyIHJlbmRlcmluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKipcbiAgICogR2V0IGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgdGhlIGJhciBwcm9wZXJ0aWVzLiBSZXR1cm5zIGFuIGFycmF5IG9mXG4gICAqIHBlcmNlbnRhZ2VzIChzdW1taW5nIHRvIDEwMCkgZm9yIGVhY2ggcHJvcGVydHkuIExvYWRzIGZyb20gc2V0dGluZ3Mgb3JcbiAgICogZGVmYXVsdHMgdG8gZXF1YWwgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRCYXJQcm9wZXJ0eVdpZHRocyhjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgfHwgXCJbXVwiKSBhcyB1bmtub3duO1xuICAgICAgaWYgKGlzTnVtYmVyTGlzdChzdG9yZWQsIGNvdW50KSkgcmV0dXJuIHN0b3JlZDtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEFycmF5PG51bWJlcj4oY291bnQpLmZpbGwoMTAwIC8gY291bnQpO1xuICB9XG5cbiAgLyoqIFNhdmUgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIHRvIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRoczogbnVtYmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzID0gSlNPTi5zdHJpbmdpZnkod2lkdGhzKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLyoqIERlY2lkZSB3aGF0IHRoZSBzbGlkZXMgYmFyIHNob3dzLCB0aGVuIHJlLXJlbmRlciBpdCAqL1xuICByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXIpIHJldHVybjtcbiAgICB0aGlzLmFwcGx5VGhlbWVDbGFzcygpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKHRoaXMuYXBwKTtcbiAgICBjb25zdCBpc0NhcmQgPSB0aGlzLmlzRGVja05vdGUoZmlsZSk7XG4gICAgY29uc3QgbGl2ZVByZXZpZXdOb3cgPSBtb2RlID09PSBcInNvdXJjZVwiICYmIGlzTGl2ZVByZXZpZXcodGhpcy5hcHApO1xuXG4gICAgLy8gTGVhdmluZyBhIGRlY2sgbm90ZSwgb3IgbGVhdmluZyB0aGUgTGl2ZSBQcmV2aWV3IChlLmcuIENtZC9DdHJsK0UgdG9cbiAgICAvLyByZWFkaW5nIHZpZXcpLCBlbmRzIFNsaWRlcyBtb2RlIFx1MjAxNCBvbmx5IHRoZSB0b2dnbGUgY29tbWFuZCByZS1lbnRlcnMgaXQuXG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSAmJiAoIWlzQ2FyZCB8fCAhbGl2ZVByZXZpZXdOb3cpKSB7XG4gICAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIHRoZSB0YWIgYmFyIHdoaWxlIGl0IGlzIHN0aWxsIHZpc2libGUgKFNsaWRlcyBtb2RlIGhpZGVzIGl0XG4gICAgLy8gYmVsb3c7IHRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGlzIHJldXNlZCBvbmNlIGhpZGRlbikuXG4gICAgdGhpcy50YWJCYXJIZWlnaHQgPSBzeW5jVGFiQmFySGVpZ2h0KHRoaXMudGFiQmFySGVpZ2h0KTtcblxuICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZSBvbmx5IHdoaWxlIGFjdHVhbGx5IGluIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICBjb25zdCBzbGlkZXMgPSB0aGlzLnNsaWRlc01vZGUgJiYgaXNDYXJkICYmIGxpdmVQcmV2aWV3Tm93O1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiLCBzbGlkZXMpO1xuICAgIGlmICghc2xpZGVzKSB0aGlzLnBvaW50ZXJIaWRkZW4gPSBmYWxzZTsgLy8gbGVhdmluZyBTbGlkZXMgcmVzdG9yZXMgdGhlIHBvaW50ZXJcbiAgICB0aGlzLnN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy51cGRhdGVJbmxpbmVUaXRsZShzbGlkZXMpO1xuXG4gICAgY29uc3QgYmFyVmlzaWJsZSA9IHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgJiYgIXRoaXMuc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgIC8vIFdoZW4gYmFyIGlzIGhpZGRlbiwgc2V0IGJvdHRvbSBwYWRkaW5nIHRvIDAgc28gdGhlIGNhcmQgZmlsbHMgdGhlIGZ1bGxcbiAgICAvLyB3aW5kb3cgaGVpZ2h0LiBXaGVuIHZpc2libGUsIHJlbW92ZSB0aGUgb3ZlcnJpZGUgc28gQ1NTIGZhbGxzIGJhY2sgdG9cbiAgICAvLyAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCAoY2xlYXJzIHRoZSBiYXIgYXMgYmVmb3JlKS5cbiAgICBpZiAoYmFyVmlzaWJsZSkge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIjogXCIwcHhcIiB9KTtcbiAgICB9XG4gICAgaWYgKCFiYXJWaXNpYmxlKSB7XG4gICAgICB0aGlzLmJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFmaWxlKSByZXR1cm47IC8vIGJhclZpc2libGUgaW1wbGllcyBhIGZpbGUsIGJ1dCBuYXJyb3cgZm9yIFR5cGVTY3JpcHRcblxuICAgIGNvbnN0IGZtID0gYWN0aXZlRnJvbnRtYXR0ZXIodGhpcy5hcHApO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgY2xlYXJDaGlsZHJlbih0aGlzLmJhcik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTGVmdDogcHJldmlvdXMgLyBuZXh0IGJ1dHRvbnMgKGJvdGggYWx3YXlzIHNob3duIGluc2lkZSBhIGRlY2s7XG4gICAgLy8gICAgICAgIHRoZSBvbmUgdGhhdCBjYW5ub3QgbW92ZSBpcyBkaXNhYmxlZCAvIGxpZ2h0IGdyYXkpIFx1MjUwMFx1MjUwMFxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dOYXZCdXR0b25zICYmIGRlY2spIHtcbiAgICAgIGNvbnN0IGhhc1ByZXYgPSBkZWNrLmluZGV4ID4gMDtcbiAgICAgIGNvbnN0IGhhc05leHQgPSBkZWNrLmluZGV4IDwgZGVjay5jaGFpbi5sZW5ndGggLSAxO1xuICAgICAgY29uc3QgbmF2ID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtbmF2XCIgfSk7XG4gICAgICBuYXYuYXBwZW5kQ2hpbGQobmF2QnV0dG9uKFwiXHUyNUMwXCIsIFwiUHJldmlvdXMgcGFnZVwiLCAoKSA9PiB2b2lkIHRoaXMubmF2aWdhdGUoXCJwcmV2XCIpLCAhaGFzUHJldikpO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVCNlwiLCBcIk5leHQgcGFnZVwiLCAoKSA9PiB2b2lkIHRoaXMubmF2aWdhdGUoXCJuZXh0XCIpLCAhaGFzTmV4dCkpO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTWlkZGxlOiBjb25maWd1cmVkIHByb3BlcnR5IGNvbHVtbnMgd2l0aCBkcmFnZ2FibGUgZGl2aWRlcnMgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgcHJvcE5hbWVzID0gdGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzXG4gICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBpZiAocHJvcE5hbWVzLmxlbmd0aCA+IDAgJiYgZm0pIHtcbiAgICAgIGNvbnN0IGVudHJpZXM6IFtzdHJpbmcsIHN0cmluZ11bXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHByb3BOYW1lcykge1xuICAgICAgICBpZiAobmFtZSBpbiBmbSkge1xuICAgICAgICAgIGNvbnN0IHZhbCA9IGZtW25hbWVdO1xuICAgICAgICAgIGlmICh2YWwgIT0gbnVsbCkgZW50cmllcy5wdXNoKFtuYW1lLCBmb3JtYXRWYWx1ZSh2YWwpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItcHJvcGVydGllc1wiIH0pO1xuXG4gICAgICAgIGNvbnN0IHdpZHRocyA9IHRoaXMuZ2V0QmFyUHJvcGVydHlXaWR0aHMoZW50cmllcy5sZW5ndGgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IFssIHZhbHVlXSA9IGVudHJpZXNbaV07XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsIHRleHQ6IHZhbHVlIH0pO1xuICAgICAgICAgIGl0ZW0uc2V0Q3NzU3R5bGVzKHtcbiAgICAgICAgICAgIGZsZXhCYXNpczogYGNhbGMoJHt3aWR0aHNbaV19JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtKTtcblxuICAgICAgICAgIGlmIChpIDwgZW50cmllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBjb25zdCBkaXZpZGVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLWRpdmlkZXJcIiB9KTtcbiAgICAgICAgICAgIGRpdmlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgIGNvbnN0IGluaXRpYWxXaWR0aHMgPSBbLi4ud2lkdGhzXTtcbiAgICAgICAgICAgICAgY29uc3Qgb25Nb3ZlID0gKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSAoKGV2LmNsaWVudFggLSBzdGFydFgpIC8gY29udGFpbmVyV2lkdGgpICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xlZnQgPSBNYXRoLm1heCg1LCBpbml0aWFsV2lkdGhzW2ldICsgZGVsdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JpZ2h0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpICsgMV0gLSBkZWx0YSk7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2ldID0gbmV3TGVmdDtcbiAgICAgICAgICAgICAgICB3aWR0aHNbaSArIDFdID0gbmV3UmlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICBcIi5uYXRpdmUtc2xpZGVzLWJhci1wcm9wLWl0ZW1cIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7bmV3TGVmdH0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaXRlbXNbaSArIDFdLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7bmV3UmlnaHR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBjb25zdCBvblVwID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3ZlKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvblVwKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJcIiwgdXNlclNlbGVjdDogXCJcIiB9KTtcbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMuc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRocyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3ZlKTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2V0Q3NzU3R5bGVzKHsgY3Vyc29yOiBcImNvbC1yZXNpemVcIiwgdXNlclNlbGVjdDogXCJub25lXCIgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZpZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJyb2tlbiBkZWNrIGxpbmtzIFx1MjE5MiB3YXJuaW5nIGNoaXAgc28gZGVjayBhdXRob3JzIHNwb3QgdHlwb3NcbiAgICBjb25zdCBicm9rZW4gPSBmaWxlID8gdGhpcy5kZWNrU2VydmljZS5icm9rZW4oZmlsZSkgOiBbXTtcbiAgICBpZiAoYnJva2VuLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHdhcm4gPSBjcmVhdGVTcGFuKHtcbiAgICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtd2FyblwiLFxuICAgICAgICB0ZXh0OiBcIlx1MjZBMCBcIiArIGJyb2tlbi5qb2luKFwiLCBcIiksXG4gICAgICAgIGF0dHI6IHsgdGl0bGU6IFwiQnJva2VuIGRlY2sgbGluayhzKSBcdTIwMTQgdGhlIHRhcmdldCBub3RlIGRvZXMgbm90IGV4aXN0XCIgfSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQod2Fybik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEJvdHRvbS1yaWdodDogYXV0by1jb21wdXRlZCBwYWdlIG51bWJlciBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgIT09IFwibm9uZVwiICYmIGRlY2spIHtcbiAgICAgIC8vIHYxLjAuMCBuZXh0LW9ubHkgc2VtYW50aWNzOiBjaGFpblswXSBpcyB0aGUgaGVhZCBzbGlkZSA9IHBhZ2UgMTtcbiAgICAgIC8vIHRvdGFsIGlzIHRoZSBmdWxsIGNoYWluIGxlbmd0aC5cbiAgICAgIGNvbnN0IHRvdGFsID0gZGVjay5jaGFpbi5sZW5ndGg7XG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXBhZ2VcIixcbiAgICAgICAgdGV4dDpcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSA9PT0gXCJmcmFjdGlvblwiXG4gICAgICAgICAgICA/IGAke2RlY2suaW5kZXggKyAxfSAvICR7dG90YWx9YFxuICAgICAgICAgICAgOiBgJHtkZWNrLmluZGV4ICsgMX1gLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChwYWdlKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUHJvZ3Jlc3MgaW5kaWNhdG9yOiBkaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgYmFyIHRvcCBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MgJiYgZGVjayAmJiBkZWNrLmNoYWluLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVjay5jaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGkgPCBkZWNrLmluZGV4ID8gXCJwYXN0XCIgOiBpID09PSBkZWNrLmluZGV4ID8gXCJjdXJyZW50XCIgOiBcImZ1dHVyZVwiO1xuICAgICAgICBjb25zdCBzZWcgPSBjcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogYG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnIG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnLS0ke3N0YXRlfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBzZWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHZvaWQgdGhpcy5qdW1wVG8oaSkpO1xuICAgICAgICBwcm9ncmVzcy5hcHBlbmRDaGlsZChzZWcpO1xuICAgICAgfVxuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIEhpZGUgdGhlIHNsaWRlcyBiYXIgZW50aXJlbHkgd2hlbiBpdCBoYXMgbm90aGluZyB0byBkaXNwbGF5IChubyBwcm9wZXJ0aWVzLFxuICAgIC8vIGFuZCBub3QgcGFydCBvZiBhIGRlY2spXG4gICAgdGhpcy5iYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogdGhpcy5iYXIuY2hpbGRFbGVtZW50Q291bnQgPT09IDAgPyBcIm5vbmVcIiA6IFwiXCIgfSk7XG4gIH1cbn1cblxuLyoqIFdoZXRoZXIgYHZhbHVlYCBpcyBhbiBhcnJheSBvZiBleGFjdGx5IGBjb3VudGAgbnVtYmVycyAoc3RvcmVkIGJhciB3aWR0aHMpLiAqL1xuZnVuY3Rpb24gaXNOdW1iZXJMaXN0KHZhbHVlOiB1bmtub3duLCBjb3VudDogbnVtYmVyKTogdmFsdWUgaXMgbnVtYmVyW10ge1xuICByZXR1cm4gKFxuICAgIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gY291bnQgJiYgdmFsdWUuZXZlcnkoKG4pID0+IHR5cGVvZiBuID09PSBcIm51bWJlclwiKVxuICApO1xufVxuIiwgIi8qKiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKGhpZGRlbiB1bnRpbCByZWZyZXNoKCkgc2hvd3MgaXQpICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQmFyKCk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgYmFyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyXCIgfSk7XG4gIGJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgYmFyLnRpdGxlID0gXCJDbGljayB0byBwYXJrIHRoZSBtb3VzZSBcdTIwMTQgaGlkZXMgdGhlIGVkaXRvciBjYXJldCB3aGlsZSBwcmVzZW50aW5nXCI7XG4gIC8vIFByZXNlbnRhdGlvbiBwYXJraW5nOiBjbGlja2luZyB0aGUgYmFyIGtlZXBzIGZvY3VzIG91dCBvZiB0aGUgZWRpdG9yIHNvXG4gIC8vIHRoZSBibGlua2luZyBjYXJldCBkaXNhcHBlYXJzLiBwcmV2ZW50RGVmYXVsdCBzdG9wcyB0aGUgY2xpY2sgZnJvbSBtb3ZpbmdcbiAgLy8gZm9jdXMgb3Igc3RhcnRpbmcgYSB0ZXh0IHNlbGVjdGlvbjsgYnV0dG9ucyBzdGlsbCByZWNlaXZlIHRoZWlyIGNsaWNrIGV2ZW50LlxuICBiYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gIH0pO1xuICByZXR1cm4gYmFyO1xufVxuXG4vKiogQnVpbGQgYSBcdTI1QzAgLyBcdTI1QjYgbmF2aWdhdGlvbiBidXR0b247IGBkaXNhYmxlZGAgcmVuZGVycyBpdCBsaWdodCBncmF5L2luYWN0aXZlICovXG5leHBvcnQgZnVuY3Rpb24gbmF2QnV0dG9uKFxuICBsYWJlbDogc3RyaW5nLFxuICB0aXA6IHN0cmluZyxcbiAgb25DbGljazogKCkgPT4gdm9pZCxcbiAgZGlzYWJsZWQgPSBmYWxzZSxcbik6IEhUTUxCdXR0b25FbGVtZW50IHtcbiAgY29uc3QgYnRuID0gY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdi1idG5cIixcbiAgICB0ZXh0OiBsYWJlbCxcbiAgICBhdHRyOiB7IHRpdGxlOiB0aXAgfSxcbiAgfSk7XG4gIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICBpZiAoIWRpc2FibGVkKSBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uQ2xpY2spO1xuICByZXR1cm4gYnRuO1xufVxuXG4vKipcbiAqIE1lYXN1cmUgdGhlIHRvcCB0YWIgYmFyIGFuZCBleHBvc2UgaXRzIGhlaWdodCBhcyB0aGUgQ1NTIHZhcmlhYmxlXG4gKiAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCwgcmV0dXJuaW5nIHRoZSAocG9zc2libHkgdXBkYXRlZCkgY2FjaGVkXG4gKiB2YWx1ZS4gVGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuIGluIFNsaWRlcyBtb2RlLCBzbyB0aGUgbGFzdCBtZWFzdXJlZFxuICogdmFsdWUgaXMgcmV1c2VkIHRoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3luY1RhYkJhckhlaWdodChjYWNoZWQ6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHRhYkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFxuICAgIFwiLndvcmtzcGFjZS10YWJzLm1vZC10b3AgLndvcmtzcGFjZS10YWItaGVhZGVyLWNvbnRhaW5lclwiLFxuICApO1xuICBpZiAodGFiQmFyICYmIHRhYkJhci5vZmZzZXRIZWlnaHQgPiAwKSBjYWNoZWQgPSB0YWJCYXIub2Zmc2V0SGVpZ2h0O1xuICBpZiAoY2FjaGVkID4gMCkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIjogYCR7Y2FjaGVkfXB4YCB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBObyBtZWFzdXJlbWVudCB5ZXQgKHRhYiBiYXIgaGlkZGVuIHNpbmNlIGxvYWQpIFx1MjAxNCBsZXQgdGhlIENTUyBmYWxsYmFjayBhcHBseS5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGNvbXB1dGVDYXBhY2l0eSwgZm9ybWF0Q2FwYWNpdHksIHByb21wdExvY2FsZSwgdHlwZSBTbGlkZU1ldHJpY3MgfSBmcm9tIFwiLi9jYXBhY2l0eS1jb3JlXCI7XG5cbi8qKlxuICogY2FwYWNpdHkudHMgXHUyMDE0IG9uZS1zY3JlZW4gY2FwYWNpdHkgbWVhc3VyZW1lbnQgZm9yIHRoZSBhY3RpdmUgU2xpZGVzIG5vdGUuXG4gKlxuICogVGhlIFwiQ29weSBzbGlkZSBjYXBhY2l0eVwiIGNvbW1hbmQgbWVhc3VyZXMgdGhlIGxpdmUgU2xpZGVzIGxheW91dCBvZiB0aGVcbiAqIGN1cnJlbnQgbm90ZSAodGhlIG9ubHkgbGF5b3V0IHRoYXQgbWF0dGVyczogYSBuZXcgc2xpZGUgbXVzdCBmaXQgaW50byB0aGVcbiAqIHNhbWUgc2NyZWVuKSBhbmQgZm9ybWF0cyB0aGUgbnVtYmVycyBpbnRvIGFuIEFJLXJlYWR5IHByb21wdDpcbiAqXG4gKiAgIC0gdGhlIHNjcmVlbiAvIHRleHQtYXJlYSBkaW1lbnNpb25zIChiYXIgaGVpZ2h0LCB0aXRsZSByZXNlcnZlLCBwYWRkaW5nc1xuICogICAgIGFyZSByZWFkIGZyb20gdGhlIGxpdmUgY29tcHV0ZWQgc3R5bGVzLCBzbyBcIm9uZSBzY3JlZW5cIiBhbHdheXMgbWF0Y2hlc1xuICogICAgIGV4YWN0bHkgd2hhdCB0aGUgdmlld2VyIHNlZXMpLFxuICogICAtIHRoZSBsaW5lIGJveCBvZiBldmVyeSBlbGVtZW50IHR5cGUgXHUyMDE0IG1lYXN1cmVkIGZpcnN0ICh0aGUgY3VycmVudCBzbGlkZVxuICogICAgIGlzIGFscmVhZHkgb24gc2NyZWVuKSwgdGhlbiBkZXJpdmVkIGZyb20gdGhlIHBpbm5lZCBTbGlkZXMgdHlwb2dyYXBoeVxuICogICAgIHZhcmlhYmxlcyAoc3R5bGVzLmNzcyBcdTAwQTc5IHNldHMgLS1oMS1zaXplLy0taDEtbGluZS1oZWlnaHQvLS1wLXNwYWNpbmcvXHUyMDI2XG4gKiAgICAgb24gdGhlIHNpemVyOyBjb2RlIGJsb2NrcyBhcmUgMXJlbS8xLjUpIHdoZW4gdGhlIG5vdGUgaGFzIG5vIGluc3RhbmNlXG4gKiAgICAgb2YgdGhhdCB0eXBlLFxuICogICAtIGNoYXJzLXBlci1saW5lIGZvciBsYXRpbiBhbmQgQ0pLIHZpYSBjYW52YXMgbWVhc3VyZVRleHQuXG4gKlxuICogVGhlIG1hdGggYW5kIHByb21wdCBmb3JtYXR0aW5nIGxpdmUgaW4gc3JjL2NhcGFjaXR5LWNvcmUudHMgKHB1cmUsIHRlc3RlZCk7XG4gKiB0aGlzIGZpbGUgaXMgdGhlIERPTSBnbHVlOiBtZWFzdXJlbWVudCArIGNsaXBib2FyZC5cbiAqIFRoZSBwcm9tcHQgaXMgY29waWVkIHRvIHRoZSBjbGlwYm9hcmQgKG5vIG90aGVyIG91dHB1dCk7IHRoZSBtZXNzYWdlIHRleHRcbiAqIGZvbGxvd3MgdGhlIE9ic2lkaWFuIFVJIGxhbmd1YWdlIChcInpoKlwiIFx1MjE5MiBDaGluZXNlLCBvdGhlcndpc2UgRW5nbGlzaCkuXG4gKi9cblxuY29uc3QgcHggPSAodjogc3RyaW5nKTogbnVtYmVyID0+IE51bWJlci5wYXJzZUZsb2F0KHYpO1xuXG5jb25zdCBTQU1QTEVfTEFUSU4gPVxuICBcIlRoZSBxdWljayBicm93biBmb3gganVtcHMgb3ZlciB0aGUgbGF6eSBkb2cgMDEyMzQ1Njc4OSBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiO1xuY29uc3QgU0FNUExFX0NKSyA9IFwiXHU0RTAwXHU1QzRGXHU0RTAwXHU1MzYxXHU1RTdCXHU3MDZGXHU3MjQ3XHU1MTg1XHU1QkI5XHU2RDRCXHU5MUNGXHU3OTNBXHU0RjhCXHVGRjBDXHU2QkNGXHU4ODRDXHU1M0VGXHU0RUU1XHU2MzkyXHU0RTBCXHU1OTFBXHU1QzExXHU0RTJBXHU1QjU3XHVGRjFBXHU1MkEwXHU1MUNGXHU0RTU4XHU5NjY0XHU3NjdFXHU1MjA2XHU2QkQ0XHUzMDAyXCI7XG5cbi8qKiBBdmVyYWdlIGNoYXIgd2lkdGggKHB4KSBmb3IgYSBzYW1wbGUgc3RyaW5nIGF0IHRoZSBnaXZlbiBmb250IHNldHRpbmdzICovXG5mdW5jdGlvbiBhdmdDaGFyV2lkdGgoZm9udDogc3RyaW5nLCBzYW1wbGU6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGlmICghY3R4KSByZXR1cm4gMjQ7XG4gIGN0eC5mb250ID0gZm9udDtcbiAgcmV0dXJuIGN0eC5tZWFzdXJlVGV4dChzYW1wbGUpLndpZHRoIC8gc2FtcGxlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gbGluZUJveChlbDogSFRNTEVsZW1lbnQpOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHtcbiAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3QgZnMgPSBweChjcy5mb250U2l6ZSk7XG4gIGNvbnN0IGxoUmF3ID0gY3MubGluZUhlaWdodDtcbiAgcmV0dXJuIHsgZm9udFNpemU6IGZzLCBsaW5lSGVpZ2h0OiBweChsaFJhdykgPiAwID8gcHgobGhSYXcpIDogZnMgKiAxLjUgfTtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSBhY3RpdmUgU2xpZGVzIHZpZXcuIFJldHVybnMgbnVsbCB3aGVuIG5vIFNsaWRlcyBsYXlvdXQgaXNcbiAqIGFjdGl2ZSAodGhlIGNvbW1hbmQgaXMgb25seSByZWFjaGFibGUgdGhlcmUsIGJ1dCB0aGUgZ3VhcmQgaXMgY2hlYXApLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVhc3VyZVNsaWRlcyhhcHA6IEFwcCk6IFNsaWRlTWV0cmljcyB8IG51bGwge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHJvb3QgPSB2aWV3LmNvbnRlbnRFbDtcbiAgY29uc3Qgc2Nyb2xsZXIgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLXNjcm9sbGVyXCIpO1xuICBjb25zdCBjb250ZW50ID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICBpZiAoIXNjcm9sbGVyIHx8ICFjb250ZW50KSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBjc1Njcm9sbCA9IGdldENvbXB1dGVkU3R5bGUoc2Nyb2xsZXIpO1xuICBjb25zdCBjc0NvbnRlbnQgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQpO1xuXG4gIGNvbnN0IHNjcmVlbkggPSBzY3JvbGxlci5jbGllbnRIZWlnaHQ7XG4gIGNvbnN0IHRleHRUb3BQYWQgPSBweChjc1Njcm9sbC5wYWRkaW5nVG9wKTtcbiAgY29uc3QgdGV4dEJvdHRvbVBhZCA9IHB4KGNzU2Nyb2xsLnBhZGRpbmdCb3R0b20pO1xuICBjb25zdCBjYXJkUGFkVG9wID0gcHgoY3NDb250ZW50LnBhZGRpbmdUb3ApO1xuICBjb25zdCBjYXJkUGFkQm90dG9tID0gcHgoY3NDb250ZW50LnBhZGRpbmdCb3R0b20pO1xuXG4gIGNvbnN0IGhhc1RpdGxlID1cbiAgICBjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpIHx8IGNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGUtbmF0aXZlXCIpO1xuICAvLyBXaXRoIGEgdGl0bGUsIHRoZSBjYXJkJ3MgdG9wIHBhZGRpbmcgZ3Jvd3MgYnkgdGhlIHJlc2VydmVkIHRpdGxlIGJsb2NrXG4gIC8vIChwYWRkaW5nVG9wIC0gcGFkZGluZ0JvdHRvbSBpcyB0aGUgZGVsdGE7IGJvdGggYXJlIC0tbnMtcGFkLXkgbm9ybWFsbHkpLlxuICBjb25zdCB0aXRsZVJlc2VydmVkID0gaGFzVGl0bGVcbiAgICA/IE1hdGgucm91bmQoTWF0aC5tYXgoMCwgY2FyZFBhZFRvcCAtIGNhcmRQYWRCb3R0b20pICogMTAwKSAvIDEwMFxuICAgIDogMDtcblxuICBjb25zdCB0ZXh0SGVpZ2h0ID1cbiAgICBNYXRoLnJvdW5kKFxuICAgICAgTWF0aC5tYXgoMCwgc2NyZWVuSCAtIHRleHRUb3BQYWQgLSB0ZXh0Qm90dG9tUGFkIC0gY2FyZFBhZFRvcCAtIGNhcmRQYWRCb3R0b20pICogMTAwLFxuICAgICkgLyAxMDA7XG5cbiAgY29uc3QgdGV4dFdpZHRoID0gY29udGVudC5jbGllbnRXaWR0aCAtIHB4KGNzQ29udGVudC5wYWRkaW5nTGVmdCkgLSBweChjc0NvbnRlbnQucGFkZGluZ1JpZ2h0KTtcbiAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHNjcm9sbGVyLmNsaWVudFdpZHRoO1xuICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHNjcmVlbkg7XG5cbiAgLy8gVGhlIHNsaWRlcyBiYXIgaXMgYXBwZW5kZWQgdG8gZG9jdW1lbnQuYm9keSAobm90IHRoZSB2aWV3J3MgY29udGVudEVsKVxuICBjb25zdCBiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5uYXRpdmUtc2xpZGVzLWJhclwiKTtcbiAgY29uc3QgYmFyVmlzaWJsZSA9IGJhciAhPT0gbnVsbCAmJiBnZXRDb21wdXRlZFN0eWxlKGJhcikuZGlzcGxheSAhPT0gXCJub25lXCI7XG4gIGNvbnN0IGJhckhlaWdodCA9IGJhciAmJiBiYXJWaXNpYmxlID8gYmFyLm9mZnNldEhlaWdodCA6IDA7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGVsZW1lbnQgbGluZSBib3hlczogbWVhc3VyZSBmaXJzdCBpdGVtIG9mIGVhY2ggdHlwZSBwcmVzZW50IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBjb25zdCBoZWFkZXIgPSAoY2xzOiBzdHJpbmcpID0+IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYC5jbS1jb250ZW50ICR7Y2xzfWApO1xuICBjb25zdCBoMUVsID0gaGVhZGVyKFwiLmNtLWhlYWRlci0xXCIpO1xuICBjb25zdCBoMkVsID0gaGVhZGVyKFwiLmNtLWhlYWRlci0yXCIpO1xuICBjb25zdCBoM0VsID0gaGVhZGVyKFwiLmNtLWhlYWRlci0zXCIpO1xuICBjb25zdCBidWxsZXRFbCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudCAuSHlwZXJNRC1saXN0LWxpbmVcIik7XG4gIGNvbnN0IGNvZGVFbCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudCBwcmUsIC5jbS1jb250ZW50IC5IeXBlck1ELWNvZGVibG9ja1wiKTtcbiAgY29uc3QgaW1nRWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgaW1nOm5vdCguY20td2lkZ2V0QnVmZmVyKVwiKTtcblxuICAvLyBBIHBsYWluIGJvZHkgbGluZSBcdTIwMTQgc2tpcCBoZWFkZXJzLCBsaXN0IGxpbmVzLCBjb2RlLCBxdW90ZXMgYW5kIGVtcHR5XG4gIC8vIGxpbmVzIChDTSByZW5kZXJzIG9ubHkgdmlzaWJsZSBsaW5lczsgaW4gU2xpZGVzIG1vZGUgdGhlIGZpcnN0IHNjcmVlblxuICAvLyBpcyBleGFjdGx5IHRoZW0pLiBBbiBlbXB0eSBsaW5lIGJveCAoYSBibGFuayByb3csIH44cHgpIGlzIG5vdCBhIHVzZWZ1bFxuICAvLyBib2R5IHNhbXBsZSwgc28gcGljayB0aGUgZmlyc3QgY2FuZGlkYXRlIHdpdGggYWN0dWFsIHRleHQuXG4gIGNvbnN0IGJvZHlFbCA9XG4gICAgQXJyYXkuZnJvbShcbiAgICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgIFwiLmNtLWNvbnRlbnQgLmNtLWxpbmU6bm90KC5IeXBlck1ELWhlYWRlcik6bm90KC5IeXBlck1ELWxpc3QtbGluZSk6bm90KC5IeXBlck1ELXF1b3RlKTpub3QoLkh5cGVyTUQtY29kZWJsb2NrKVwiLFxuICAgICAgKSxcbiAgICApLmZpbmQoKGVsKSA9PiBlbC50ZXh0Q29udGVudCAhPT0gbnVsbCAmJiBlbC50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoID4gMCkgPz8gY29udGVudDtcblxuICBjb25zdCBib2R5ID0gbGluZUJveChib2R5RWwpO1xuICBjb25zdCBoMSA9IGgxRWwgPyBsaW5lQm94KGgxRWwpIDogbnVsbDtcbiAgY29uc3QgaDIgPSBoMkVsID8gbGluZUJveChoMkVsKSA6IG51bGw7XG4gIGNvbnN0IGgzID0gaDNFbCA/IGxpbmVCb3goaDNFbCkgOiBudWxsO1xuXG4gIGNvbnN0IGNzID0gKGVsOiBIVE1MRWxlbWVudCk6IENTU1N0eWxlRGVjbGFyYXRpb24gPT4gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGxldCBidWxsZXQ6IHsgaXRlbUhlaWdodDogbnVtYmVyIH0gfCBudWxsID0gbnVsbDtcbiAgaWYgKGJ1bGxldEVsKSB7XG4gICAgY29uc3QgYyA9IGNzKGJ1bGxldEVsKTtcbiAgICBidWxsZXQgPSB7XG4gICAgICBpdGVtSGVpZ2h0OiBweChjLmxpbmVIZWlnaHQpICsgcHgoYy5wYWRkaW5nVG9wKSArIHB4KGMucGFkZGluZ0JvdHRvbSksXG4gICAgfTtcbiAgfVxuXG4gIGxldCBjb2RlOiB7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG4gIGlmIChjb2RlRWwpIHtcbiAgICBjb25zdCBjID0gY3MoY29kZUVsKTtcbiAgICBjb2RlID0geyBsaW5lSGVpZ2h0OiBweChjLmxpbmVIZWlnaHQpID4gMCA/IHB4KGMubGluZUhlaWdodCkgOiBweChjLmZvbnRTaXplKSAqIDEuNSB9O1xuICB9XG5cbiAgY29uc3QgaW1hZ2VIZWlnaHQgPVxuICAgIGltZ0VsICYmIGltZ0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCA+IDBcbiAgICAgID8gTWF0aC5yb3VuZChpbWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpXG4gICAgICA6IG51bGw7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGRlcml2ZSBtaXNzaW5nIGVsZW1lbnQgYm94ZXMgZnJvbSB0aGUgcGlubmVkIFNsaWRlcyB0eXBvZ3JhcGh5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBzdHlsZXMuY3NzIFx1MDBBNzkgZGVjbGFyZXMgdGhlIHNsaWRlIHR5cG9ncmFwaHkgb24gdGhlIHNpemVyXG4gIC8vICgtLWgxLXNpemU6IDEuNGVtOyAtLWgxLWxpbmUtaGVpZ2h0OiAxLjQzOyBcdTIwMjYpIGFuZCBcdTAwQTc3IHBpbnMgY29kZSBibG9ja3NcbiAgLy8gdG8gMXJlbS8xLjUgXHUyMDE0IGEgbm90ZSB3aXRob3V0IHRoYXQgZWxlbWVudCB0eXBlIHN0aWxsIHJlcG9ydHMgaXRzIGJveC5cbiAgY29uc3Qgc2l6ZXIgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLXNpemVyXCIpO1xuICBjb25zdCBzaXplclN0eWxlID0gc2l6ZXIgPyBjcyhzaXplcikgOiBudWxsO1xuICBjb25zdCBkZXJpdmVCb3ggPSAoc2l6ZVZhcjogc3RyaW5nLCBsaFZhcjogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZW0gPSBzaXplclN0eWxlID8gcHgoc2l6ZXJTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHNpemVWYXIpKSA6IE5hTjtcbiAgICBjb25zdCBsaCA9IHNpemVyU3R5bGUgPyBweChzaXplclN0eWxlLmdldFByb3BlcnR5VmFsdWUobGhWYXIpKSA6IE5hTjtcbiAgICBjb25zdCBmb250U2l6ZSA9IGVtID4gMCA/IGVtICogYm9keS5mb250U2l6ZSA6IGJvZHkuZm9udFNpemU7XG4gICAgY29uc3QgbGluZUhlaWdodCA9IGxoID4gMCA/IGxoICogZm9udFNpemUgOiBib2R5LmxpbmVIZWlnaHQ7XG4gICAgcmV0dXJuIHsgZm9udFNpemUsIGxpbmVIZWlnaHQgfTtcbiAgfTtcbiAgY29uc3QgZGVyaXZlSDEgPSBkZXJpdmVCb3goXCItLWgxLXNpemVcIiwgXCItLWgxLWxpbmUtaGVpZ2h0XCIpO1xuICBjb25zdCBkZXJpdmVIMiA9IGRlcml2ZUJveChcIi0taDItc2l6ZVwiLCBcIi0taDItbGluZS1oZWlnaHRcIik7XG4gIGNvbnN0IGRlcml2ZUgzID0gZGVyaXZlQm94KFwiLS1oMy1zaXplXCIsIFwiLS1oMy1saW5lLWhlaWdodFwiKTtcbiAgY29uc3QgZGVyaXZlQ29kZSA9ICgpID0+IHtcbiAgICBjb25zdCByb290Rm9udCA9IHB4KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5mb250U2l6ZSk7XG4gICAgcmV0dXJuIHsgbGluZUhlaWdodDogcm9vdEZvbnQgKiAxLjUgfTtcbiAgfTtcblxuICAvLyBcdTI1MDBcdTI1MDAgY2hhciB3aWR0aHMgYXQgdGhlIGJvZHkgZm9udCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgZm9udEZhbWlseSA9IGNzKGNvbnRlbnQpLmZvbnRGYW1pbHk7XG4gIGNvbnN0IGZvbnQgPSBgNDAwICR7Ym9keS5mb250U2l6ZX1weCAke2ZvbnRGYW1pbHl9YDtcbiAgY29uc3QgY2hhciA9IHtcbiAgICBsYXRpbjogYXZnQ2hhcldpZHRoKGZvbnQsIFNBTVBMRV9MQVRJTiksXG4gICAgY2prOiBhdmdDaGFyV2lkdGgoZm9udCwgU0FNUExFX0NKSyksXG4gIH07XG5cbiAgLy8gTWVhc3VyZWQgd2luczsgZGVyaXZhdGlvbiBmaWxscyB0aGUgZ2FwcyBmb3IgYWJzZW50IHR5cGVzLlxuICByZXR1cm4ge1xuICAgIHZpZXdwb3J0OiB7IHdpZHRoOiB2aWV3cG9ydFdpZHRoLCBoZWlnaHQ6IHZpZXdwb3J0SGVpZ2h0IH0sXG4gICAgdGV4dDogeyB3aWR0aDogdGV4dFdpZHRoLCBoZWlnaHQ6IHRleHRIZWlnaHQgfSxcbiAgICBiYXI6IHtcbiAgICAgIHZpc2libGU6IGJhclZpc2libGUsXG4gICAgICBoZWlnaHQ6IGJhckhlaWdodCxcbiAgICB9LFxuICAgIHRpdGxlUmVzZXJ2ZWQ6IE1hdGgucm91bmQodGl0bGVSZXNlcnZlZCAqIDEwMCkgLyAxMDAsXG4gICAgYm9keSxcbiAgICBoMTogaDEgPz8gZGVyaXZlSDEsXG4gICAgaDI6IGgyID8/IGRlcml2ZUgyLFxuICAgIGgzOiBoMyA/PyBkZXJpdmVIMyxcbiAgICBidWxsZXQsXG4gICAgY29kZTogY29kZSA/PyBkZXJpdmVDb2RlKCksXG4gICAgaW1hZ2VIZWlnaHQsXG4gICAgY2hhcixcbiAgfTtcbn1cblxuLyoqXG4gKiBFbnRyeSBwb2ludCBvZiB0aGUgXCJDb3B5IHNsaWRlIGNhcGFjaXR5XCIgY29tbWFuZDogbWVhc3VyZSwgZm9ybWF0LFxuICogd3JpdGUgdG8gdGhlIGNsaXBib2FyZC4gUnVucyBvbmx5IGZyb20gU2xpZGVzIG1vZGUgKGNvbW1hbmQgZ2F0ZSkuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb3B5Q2FwYWNpdHlQcm9tcHQoYXBwOiBBcHApOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbSA9IG1lYXN1cmVTbGlkZXMoYXBwKTtcbiAgaWYgKCFtKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBtZWFzdXJlIHRoZSBTbGlkZXMgbGF5b3V0XCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBwcm9tcHQgPSBmb3JtYXRDYXBhY2l0eShtLCBjb21wdXRlQ2FwYWNpdHkobSksIHByb21wdExvY2FsZSgpKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwcm9tcHQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNsaXBib2FyZCB3cml0ZSBmYWlsZWQgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIGNhcGFjaXR5LWNvcmUudHMgXHUyMDE0IHB1cmUgY2FwYWNpdHkgbWF0aCArIHByb21wdCBmb3JtYXR0aW5nIGZvciBTbGlkZXMuXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgRE9NLWZyZWUgYW5kIHVuaXQtdGVzdGVkIChsaWtlIHNyYy9kZWNrLnRzKS4gSXQgdHVybnNcbiAqIG1lYXN1cmVkIG51bWJlcnMgKGZyb20gc3JjL2NhcGFjaXR5LnRzKSBpbnRvIGEgb25lLXNjcmVlbiBjYXBhY2l0eVxuICogcmVwb3J0OiBob3cgbWFueSBib2R5IGxpbmVzIC8gYnVsbGV0cyAvIEgxIGxpbmVzIGZpdCB0aGUgYWN0aXZlIHRleHRcbiAqIGFyZWEsIHdpdGggcGVyLWVsZW1lbnQgbGluZSBib3hlcywgYW5kIGZvcm1hdHMgdGhlbSBpbnRvIGFuIEFJLXJlYWR5XG4gKiBwcm9tcHQgaW4gdGhlIE9ic2lkaWFuIFVJIGxhbmd1YWdlLlxuICovXG5cbi8qKiBSYXcgbGl2ZS1sYXlvdXQgbWVhc3VyZW1lbnRzIG9mIHRoZSBhY3RpdmUgU2xpZGVzIG5vdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2xpZGVNZXRyaWNzIHtcbiAgLyoqIFNjcmVlbiAodmlld3BvcnQpIHNpemUgaW4gQ1NTIHB4ICovXG4gIHZpZXdwb3J0OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBBdmFpbGFibGUgdGV4dCBhcmVhIChzY3JlZW4gbWludXMgc2Nyb2xsZXIgcGFkZGluZ3MsIGNhcmQgcGFkZGluZywgdGl0bGUpICovXG4gIHRleHQ6IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfTtcbiAgLyoqIFNsaWRlcyBiYXIgc3RhdGUgXHUyMDE0IGl0cyBoZWlnaHQgaXMgb24gdGhlIHBhZ2U7IHRoZSBudW1iZXIgaXMgaW5mb3JtYXRpb25hbCAqL1xuICBiYXI6IHsgdmlzaWJsZTogYm9vbGVhbjsgaGVpZ2h0OiBudW1iZXIgfTtcbiAgLyoqIFZlcnRpY2FsIHNwYWNlIHJlc2VydmVkIGZvciB0aGUgY2FyZCB0aXRsZSAoMCA9IG5vIHRpdGxlKSAqL1xuICB0aXRsZVJlc2VydmVkOiBudW1iZXI7XG4gIC8qKiBCb2R5IHBhcmFncmFwaCBtZXRyaWNzIChmb250IHNpemUgLyBsaW5lIGJveCwgcHgpICovXG4gIGJvZHk6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBIZWFkaW5nIGxpbmUgYm94ZXMgKHB4KSBcdTIwMTQgbnVsbCB3aGVuIHRoZSBub3RlIGhhcyBub25lIG9mIHRoaXMgbGV2ZWwgKi9cbiAgaDE6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICBoMjogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIGgzOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIE9uZSBidWxsZXQgaXRlbSdzIHRvdGFsIGhlaWdodCAobGluZSBib3ggKyBsaXN0IHBhZGRpbmdzLCBweCkgKi9cbiAgYnVsbGV0OiB7IGl0ZW1IZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIE9uZSBjb2RlIGxpbmUncyBib3ggKGZvbnQgMXJlbSBpbiBTbGlkZXM7IG1lYXN1cmVkIHdoZW4gYSBibG9jayBleGlzdHMpICovXG4gIGNvZGU6IHsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICAvKiogSGVpZ2h0IG9mIHRoZSBmaXJzdCByZW5kZXJlZCBpbWFnZSAocHgpOyBudWxsIHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUgKi9cbiAgaW1hZ2VIZWlnaHQ6IG51bWJlciB8IG51bGw7XG4gIC8qKiBBdmVyYWdlIGNoYXJhY3RlciB3aWR0aHMgKHB4KSBhdCB0aGUgYm9keSBmb250ICovXG4gIGNoYXI6IHsgbGF0aW46IG51bWJlcjsgY2prOiBudW1iZXIgfTtcbn1cblxuLyoqIERlcml2ZWQgY2FwYWNpdHkgY291bnRzIChwdXJlOyB0YWtlcyBudW1iZXJzLCBub3QgdGhlIERPTSkgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FwYWNpdHlSZXN1bHQge1xuICAvKiogQm9keSB0ZXh0IGxpbmVzIHRoYXQgZml0IG9uZSBzY3JlZW4gKi9cbiAgYm9keUxpbmVzOiBudW1iZXI7XG4gIC8qKiBCdWxsZXQgaXRlbXMgdGhhdCBmaXQgb25lIHNjcmVlbiAoZnVsbCBsaXN0KSAqL1xuICBidWxsZXRzOiBudW1iZXI7XG4gIC8qKiBIMSBsaW5lcyB0aGF0IGZpdCAob25lIHBlciBIMSBsaW5lIGJveCkgKi9cbiAgaDFMaW5lczogbnVtYmVyO1xuICAvKiogRXhhbXBsZXM6IGNvdW50IG9mIGEgc2Vjb25kIGJsb2NrIHR5cGUgYWZ0ZXIgb25lIGZpcnN0IGJsb2NrICovXG4gIGNvbWJvczoge1xuICAgIGFmdGVySDFCdWxsZXRzOiBudW1iZXI7XG4gICAgYWZ0ZXJIMkJ1bGxldHM6IG51bWJlcjtcbiAgICBhZnRlckgxQm9keUxpbmVzOiBudW1iZXI7XG4gIH07XG59XG5cbi8qKlxuICogRGVyaXZlZCBjYXBhY2l0eSBmcm9tIHJhdyBtZXRyaWNzIFx1MjAxNCBwdXJlIGFuZCBkZXRlcm1pbmlzdGljLlxuICogRXZlcnkgbnVtYmVyIGZsb29ycyAoYmxvY2tzIGFyZSBkaXNjcmV0ZSk7IGEgbmVnYXRpdmUgcmVzdWx0IGlzIGNsYW1wZWQgdG8gMC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVDYXBhY2l0eShtOiBTbGlkZU1ldHJpY3MpOiBDYXBhY2l0eVJlc3VsdCB7XG4gIGNvbnN0IEggPSBtLnRleHQuaGVpZ2h0O1xuICBjb25zdCBmbG9vciA9IChuOiBudW1iZXIpOiBudW1iZXIgPT4gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihuKSk7XG4gIGNvbnN0IGJvZHlMaW5lcyA9IGZsb29yKEggLyBtLmJvZHkubGluZUhlaWdodCk7XG5cbiAgY29uc3QgYnVsbGV0SCA9IG0uYnVsbGV0Py5pdGVtSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBidWxsZXRzID0gZmxvb3IoSCAvIGJ1bGxldEgpO1xuXG4gIGNvbnN0IGgxSCA9IG0uaDE/LmxpbmVIZWlnaHQgPz8gbS5ib2R5LmxpbmVIZWlnaHQ7XG4gIGNvbnN0IGgxTGluZXMgPSBmbG9vcihIIC8gaDFIKTtcblxuICBjb25zdCBoMkggPSBtLmgyPy5saW5lSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBhZnRlclNwYW4gPSAoZmlyc3RIOiBudW1iZXIsIGl0ZW1IOiBudW1iZXIpOiBudW1iZXIgPT4gZmxvb3IoKEggLSBmaXJzdEgpIC8gaXRlbUgpO1xuXG4gIHJldHVybiB7XG4gICAgYm9keUxpbmVzLFxuICAgIGJ1bGxldHMsXG4gICAgaDFMaW5lcyxcbiAgICBjb21ib3M6IHtcbiAgICAgIGFmdGVySDFCdWxsZXRzOiBhZnRlclNwYW4oaDFILCBidWxsZXRIKSxcbiAgICAgIGFmdGVySDJCdWxsZXRzOiBhZnRlclNwYW4oaDJILCBidWxsZXRIKSxcbiAgICAgIGFmdGVySDFCb2R5TGluZXM6IGFmdGVyU3BhbihoMUgsIG0uYm9keS5saW5lSGVpZ2h0KSxcbiAgICB9LFxuICB9O1xufVxuXG4vKiogTG9jYWxlIG9mIHRoZSBnZW5lcmF0ZWQgcHJvbXB0OiBcInpoXCIgZm9yIENoaW5lc2UsIG90aGVyd2lzZSBFbmdsaXNoICovXG5leHBvcnQgZnVuY3Rpb24gcHJvbXB0TG9jYWxlKCk6IFwiemhcIiB8IFwiZW5cIiB7XG4gIGNvbnN0IGxhbmcgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgPyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImxhbmdcIikgPz8gbmF2aWdhdG9yLmxhbmd1YWdlID8/IFwiZW5cIilcbiAgICAgIDogXCJlblwiO1xuICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJ6aFwiKSA/IFwiemhcIiA6IFwiZW5cIjtcbn1cblxuZnVuY3Rpb24gZm10KG46IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG4pID8gU3RyaW5nKG4pIDogbi50b0ZpeGVkKDEpO1xufVxuXG4vKiogSHVtYW4tcmVhZGFibGUgbGlzdCBvZiB0aGUgbWVhc3VyZWQgZWxlbWVudCBsaW5lIGJveGVzICovXG5mdW5jdGlvbiBib3hTdHIoa2luZDogc3RyaW5nLCBib3g6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsKTogc3RyaW5nIHtcbiAgaWYgKCFib3gpIHJldHVybiBgJHtraW5kfTogLWA7XG4gIHJldHVybiBgJHtraW5kfTogJHtmbXQoYm94LmxpbmVIZWlnaHQpfXB4L2xpbmUgKGZvbnQgJHtmbXQoYm94LmZvbnRTaXplKX1weClgO1xufVxuXG5mdW5jdGlvbiBlblByb21wdChtOiBTbGlkZU1ldHJpY3MsIGM6IENhcGFjaXR5UmVzdWx0LCBub3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiYXIgPVxuICAgIG0uYmFyLnZpc2libGUgfHwgbS5iYXIuaGVpZ2h0ID4gMFxuICAgICAgPyBgU2xpZGVzIGJhcjogdmlzaWJsZSwgJHttLmJhci5oZWlnaHR9cHggKGFscmVhZHkgZXhjbHVkZWQgZnJvbSB0aGUgdGV4dCBhcmVhKS5gXG4gICAgICA6IFwiU2xpZGVzIGJhcjogaGlkZGVuLlwiO1xuICBjb25zdCB0aXRsZSA9XG4gICAgbS50aXRsZVJlc2VydmVkID4gMCA/IGBDYXJkIHRpdGxlOiAke20udGl0bGVSZXNlcnZlZH1weCByZXNlcnZlZC5gIDogXCJDYXJkIHRpdGxlOiBub25lLlwiO1xuICBjb25zdCBpbWcgPVxuICAgIG0uaW1hZ2VIZWlnaHQgIT09IG51bGwgPyBgSW1hZ2U6ICR7bS5pbWFnZUhlaWdodH1weCB0YWxsIChmaXJzdCBpbWFnZSBvbiB0aGUgc2xpZGUpLmAgOiBcIlwiO1xuICBjb25zdCBzYW1wbGVzID0gW1xuICAgIGBQbGFpbiB0ZXh0OiAke2MuYm9keUxpbmVzfSBib2R5IGxpbmVzYCxcbiAgICBgSDEgKyBidWxsZXRzOiAke2MuY29tYm9zLmFmdGVySDFCdWxsZXRzfSBidWxsZXRzIGFmdGVyIGEgSDEgbGluZWAsXG4gICAgYFB1cmUgbGlzdDogJHtjLmJ1bGxldHN9IGJ1bGxldCBpdGVtc2AsXG4gICAgYEgxIGxpbmVzIG9ubHk6ICR7Yy5oMUxpbmVzfWAsXG4gIF0uam9pbihcIjsgXCIpO1xuICByZXR1cm4gW1xuICAgIGBTbGlkZSBjYXBhY2l0eSBcdTIwMTQgb25lIHNjcmVlbiwgbm8gc2Nyb2xsaW5nLiBHZW5lcmF0ZWQgZnJvbSB0aGUgbGl2ZSBTbGlkZXMgbGF5b3V0IG9mIHRoaXMgbm90ZTsgZXZlcnkgbnVtYmVyIGlzIG1lYXN1cmVkL2JyYW5jaC1kZXJpdmVkIGF0IHRoZSBjdXJyZW50IFVJIHNjYWxlLmAsXG4gICAgYGAsXG4gICAgYEdlb21ldHJ5OiBzY3JlZW4gJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHg7IHRleHQgYXJlYSAke20udGV4dC53aWR0aH1cdTAwRDcke20udGV4dC5oZWlnaHR9cHguICR7YmFyfSAke3RpdGxlfWAsXG4gICAgYGAsXG4gICAgYFRleHQgbWV0cmljcyAoYm9keSBmb250ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHgpOmAsXG4gICAgYGNoYXJzL2xpbmUgXHUyMjQ4ICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIubGF0aW4pfSBsYXRpbiAvICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIuY2prKX0gQ0pLOyBib2R5IGxpbmUgJHtmbXQobS5ib2R5LmxpbmVIZWlnaHQpfXB4LmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJidWxsZXRcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiY29kZVwiLCBtLmNvZGUgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uY29kZS5saW5lSGVpZ2h0IH0gOiBudWxsKSxcbiAgXVxuICAgIC5jb25jYXQoaW1nID8gW2ltZ10gOiBbXSlcbiAgICAuY29uY2F0KFtgYCwgYENhcGFjaXR5OiAke3NhbXBsZXN9LmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gemhQcm9tcHQobTogU2xpZGVNZXRyaWNzLCBjOiBDYXBhY2l0eVJlc3VsdCwgbm90ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYmFyID1cbiAgICBtLmJhci52aXNpYmxlIHx8IG0uYmFyLmhlaWdodCA+IDBcbiAgICAgID8gYFNsaWRlcyBcdTY4MEZcdUZGMUFcdTY2M0VcdTc5M0FcdUZGMEMke20uYmFyLmhlaWdodH1weFx1RkYwOFx1NURGMlx1NEVDRVx1NjU4N1x1NUI1N1x1NTMzQVx1NjI2M1x1NTFDRlx1RkYwOVx1MzAwMmBcbiAgICAgIDogXCJTbGlkZXMgXHU2ODBGXHVGRjFBXHU5NjkwXHU4NUNGXHUzMDAyXCI7XG4gIGNvbnN0IHRpdGxlID0gbS50aXRsZVJlc2VydmVkID4gMCA/IGBcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTk4ODRcdTc1NTkgJHttLnRpdGxlUmVzZXJ2ZWR9cHhcdTMwMDJgIDogXCJcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTY1RTBcdTMwMDJcIjtcbiAgY29uc3QgaW1nID0gbS5pbWFnZUhlaWdodCAhPT0gbnVsbCA/IGBcdTU2RkVcdTcyNDdcdUZGMUEke20uaW1hZ2VIZWlnaHR9cHggXHU5QUQ4XHVGRjA4XHU1RjUzXHU1MjREXHU5ODc1XHU3QjJDXHU0RTAwXHU1RjIwXHVGRjA5XHUzMDAyYCA6IFwiXCI7XG4gIGNvbnN0IHNhbXBsZXMgPSBbXG4gICAgYFx1N0VBRlx1NkI2M1x1NjU4N1x1RkYxQSR7Yy5ib2R5TGluZXN9IFx1ODg0Q2AsXG4gICAgYEgxICsgXHU1MjE3XHU4ODY4XHVGRjFBSDEgXHU1NDBFXHU4RkQ4XHU1M0VGXHU2NTNFICR7Yy5jb21ib3MuYWZ0ZXJIMUJ1bGxldHN9IFx1NEUyQVx1NTIxN1x1ODg2OFx1OTg3OWAsXG4gICAgYFx1N0VBRlx1NTIxN1x1ODg2OFx1RkYxQSR7Yy5idWxsZXRzfSBcdTRFMkFcdTUyMTdcdTg4NjhcdTk4NzlgLFxuICAgIGBcdTdFQUYgSDFcdUZGMUEke2MuaDFMaW5lc30gXHU4ODRDYCxcbiAgXS5qb2luKFwiXHVGRjFCXCIpO1xuICByZXR1cm4gW1xuICAgIGBcdTVFN0JcdTcwNkZcdTcyNDdcdTVCQjlcdTkxQ0YgXHUyMDE0XHUyMDE0IFx1NEUwMFx1NUM0Rlx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1MzAwMlx1NTdGQVx1NEU4RVx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NFx1NUI5RVx1NjVGNiBTbGlkZXMgXHU1RTAzXHU1QzQwXHU3NTFGXHU2MjEwXHVGRjFCXHU2MjQwXHU2NzA5XHU2NTcwXHU1QjU3XHU2MzA5XHU1RjUzXHU1MjREIFVJIFx1NkJENFx1NEY4Qlx1NUI5RVx1NkQ0Qi9cdTYzQThcdTdCOTdcdTMwMDJgLFxuICAgIGBgLFxuICAgIGBcdTUxRTBcdTRGNTVcdUZGMUFcdTVDNEZcdTVFNTUgJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHhcdUZGMUJcdTY1ODdcdTVCNTdcdTUzM0EgJHttLnRleHQud2lkdGh9XHUwMEQ3JHttLnRleHQuaGVpZ2h0fXB4XHUzMDAyJHtiYXJ9ICR7dGl0bGV9YCxcbiAgICBgYCxcbiAgICBgXHU2NTg3XHU1QjU3XHU1M0MyXHU2NTcwXHVGRjA4XHU2QjYzXHU2NTg3ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHhcdUZGMDlcdUZGMUFgLFxuICAgIGBcdTZCQ0ZcdTg4NENcdTdFQTYgJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5jamspfSBcdTRFMkFcdTZDNDlcdTVCNTcgLyAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmxhdGluKX0gXHU0RTJBXHU2MkM5XHU0RTAxXHU1QjU3XHU3QjI2XHVGRjFCXHU2QjYzXHU2NTg3XHU4ODRDXHU5QUQ4ICR7Zm10KG0uYm9keS5saW5lSGVpZ2h0KX1weFx1MzAwMmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJcdTUyMTdcdTg4NjhcdTk4NzlcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiXHU0RUUzXHU3ODAxXHU4ODRDXCIsIG0uY29kZSA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5jb2RlLmxpbmVIZWlnaHQgfSA6IG51bGwpLFxuICBdXG4gICAgLmNvbmNhdChpbWcgPyBbaW1nXSA6IFtdKVxuICAgIC5jb25jYXQoW2BgLCBgXHU1QkI5XHU5MUNGXHVGRjFBJHtzYW1wbGVzfVx1MzAwMmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIGNhcGFjaXR5IHByb21wdC4gRm9sbG93cyB0aGUgT2JzaWRpYW4gVUkgbGFuZ3VhZ2UgdmlhIGBsb2NhbGVgXG4gKiAobWVhc3VyZWQgc2VwYXJhdGVseSBmcm9tIHRoZSBhcHApLiBUaGUgYG5vdGVgIHRhaWwgc3RhdGVzIHRoZSBwb2xpY3lcbiAqICh3aGF0IGZpdHMgb25lIHNjcmVlbikgXHUyMDE0IHNhbWUgd29yZGluZyBpbiBib3RoIGxhbmd1YWdlcyB3aGVyZSBwb3NzaWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdENhcGFjaXR5KG06IFNsaWRlTWV0cmljcywgYzogQ2FwYWNpdHlSZXN1bHQsIGxvY2FsZTogXCJ6aFwiIHwgXCJlblwiKTogc3RyaW5nIHtcbiAgY29uc3Qgbm90ZSA9XG4gICAgbG9jYWxlID09PSBcInpoXCJcbiAgICAgID8gXCJcdTg5ODFcdTZDNDJcdUZGMUFcdTc1MUZcdTYyMTBcdTc2ODRcdTUxODVcdTVCQjlcdTVGQzVcdTk4N0JcdTY1M0VcdTU3MjhcdTVGNTNcdTUyNERcdThGRDlcdTRFMDBcdTVDNEZcdTUxODVcdUZGMENcdTRFMERcdTg5ODFcdTZFREFcdTUyQThcdUZGMUJcdTc1MjhcdTRFMEFcdTk3NjJcdTc2ODRcdTUxRTBcdTRGNTVcdTRFMEVcdTg4NENcdTlBRDhcdTY1NzBcdTVCNTdcdTY4MzhcdTdCOTdcdTYwM0JcdTlBRDhcdTVFQTZcdUZGMDhcdTZCNjNcdTY1ODdcdTg4NENcdTY1NzAgXHUwMEQ3IFx1ODg0Q1x1OUFEOCArIFx1NjgwN1x1OTg5OFx1OTg4NFx1NzU1OSArIFx1NTc1N1x1OTVGNFx1OTVGNFx1OERERCBcdTIyNjQgXHU2NTg3XHU1QjU3XHU1MzNBXHU5QUQ4XHU1RUE2XHVGRjA5XHUzMDAyXCJcbiAgICAgIDogXCJSZXF1aXJlbWVudDogdGhlIGdlbmVyYXRlZCBjb250ZW50IG11c3QgZml0IHRoaXMgb25lIHNjcmVlbiBcdTIwMTQgbm8gc2Nyb2xsaW5nLiBDaGVjayB0aGUgdG90YWwgaGVpZ2h0IHdpdGggdGhlIG51bWJlcnMgYWJvdmUgKGxpbmVzIFx1MDBENyBsaW5lLWhlaWdodCArIHRpdGxlIHJlc2VydmUgKyBpbnRlci1ibG9jayBzcGFjaW5nIFx1MjI2NCB0ZXh0IGFyZWEgaGVpZ2h0KS5cIjtcbiAgcmV0dXJuIGxvY2FsZSA9PT0gXCJ6aFwiID8gemhQcm9tcHQobSwgYywgbm90ZSkgOiBlblByb21wdChtLCBjLCBub3RlKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBpc0xpdmVQcmV2aWV3IH0gZnJvbSBcIi4vbW9kZVwiO1xuXG4vKipcbiAqIFR5cG9ncmFwaHktbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KS5cbiAqXG4gKiBUaGUgYG5zLWRlYnVnLXN0eWxlc2AgY29tbWFuZCBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgaW5cbiAqIGVkaXQgKExpdmUgUHJldmlldykgYW5kIHRoZSBraXRjaGVuLXNpbmsgbm90ZSBpbiByZWFkaW5nIHZpZXcsIG1lcmdlcyB0aGVcbiAqIHJlc3VsdHMsIGNvbXB1dGVzIGFuIGVkaXQtdnMtcmVhZGluZyBkaWZmIGFuZCB3cml0ZXMgaXQgdG9cbiAqIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gaW4gdGhlIHZhdWx0IHJvb3QuIFJlZ2lzdGVyZWQgb25seSB3aGVuIHRoZVxuICogYnVpbGQtdGltZSBERVZfTU9ERSBmbGFnIGlzIHRydWU7IHJlbGVhc2UgYnVpbGRzIHRyZWUtc2hha2UgdGhpcyBtb2R1bGUgb3V0LlxuICovXG5cbi8qKiBGaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgdXNlZCBieSB0aGUgZGVidWcgY29tbWFuZCAoZWRpdCBzaWRlKSAqL1xuZXhwb3J0IGNvbnN0IFNBTVBMRV9OT1RFX05BTUVTID0gW1xuICBcInR5cG9ncmFwaHktc2FtcGxlLWhlYWRpbmdzXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbGlzdFwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLWNvZGVcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1xdW90ZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLW1lZGlhXCIsXG5dO1xuXG4vKiogU3R5bGUgc2VjdGlvbnMgc2FtcGxlZCBieSBzYW1wbGVTdHlsZXMoKSBhbmQgY29tcGFyZWQgYnkgZGlmZkR1bXBzKCkgKi9cbmNvbnN0IFNUWUxFX1NFQ1RJT05TID0gW1xuICBcImNvbnRhaW5lclwiLFxuICBcInBhcmFncmFwaFwiLFxuICBcImgxXCIsXG4gIFwibGlzdEl0ZW1cIixcbiAgXCJjb2RlQmxvY2tcIixcbiAgXCJibG9ja3F1b3RlXCIsXG4gIFwiaW5saW5lQ29kZVwiLFxuICBcInRhYmxlXCIsXG4gIFwiaW1hZ2VcIixcbiAgXCJob3Jpem9udGFsUnVsZVwiLFxuXTtcblxuLyoqIFByb21pc2UtYmFzZWQgc2xlZXAgKi9cbmZ1bmN0aW9uIHNsZWVwKG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB3aW5kb3cuc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vKipcbiAqIE1lcmdlIG5vbi1taXNzaW5nIHN0eWxlIHNlY3Rpb25zIG9mIGEgZnJlc2ggc2FtcGxlIGludG8gdGhlIHRhcmdldFxuICogKGZpcnN0IG5vbi1taXNzaW5nIHZhbHVlIHdpbnMpLlxuICovXG5mdW5jdGlvbiBtZXJnZVNhbXBsZSh0YXJnZXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBzYW1wbGU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XG4gIGZvciAoY29uc3Qga2V5IG9mIFNUWUxFX1NFQ1RJT05TKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IHNhbXBsZVtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKCFzZWN0aW9uIHx8IFwiKG1pc3NpbmcpXCIgaW4gc2VjdGlvbikgY29udGludWU7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0YXJnZXRba2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuICAgIGlmIChleGlzdGluZyAmJiAhKFwiKG1pc3NpbmcpXCIgaW4gZXhpc3RpbmcpKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNlY3Rpb247XG4gIH1cbiAgLy8gUHJvYmUgZmllbGRzIHJpZGUgYWxvbmcgKGZpcnN0IG5vbi1lbXB0eSB3aW5zKVxuICBmb3IgKGNvbnN0IGtleSBvZiBbXG4gICAgXCJsaXN0TGluZXNcIixcbiAgICBcIm1ldGFkYXRhQ29udGFpbmVyRGlzcGxheVwiLFxuICAgIFwiaDFPZmZzZXRUb3BcIixcbiAgICBcImgxVG9wSW5Db250ZW50XCIsXG4gICAgXCJoMUxlZnRJbkNvbnRlbnRcIixcbiAgICBcInRpdGxlXCIsXG4gICAgXCJjb250ZW50Q2hpbGRyZW5cIixcbiAgICBcInRvcENoYWluXCIsXG4gIF0pIHtcbiAgICBjb25zdCBwcm9iZSA9IHNhbXBsZVtrZXldO1xuICAgIGlmIChwcm9iZSA9PT0gdW5kZWZpbmVkIHx8IHByb2JlID09PSBudWxsKSBjb250aW51ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9iZSkgJiYgcHJvYmUubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBpZiAodHlwZW9mIHByb2JlID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHByb2JlKSAmJiBPYmplY3Qua2V5cyhwcm9iZSkubGVuZ3RoID09PSAwKVxuICAgICAgY29udGludWU7XG4gICAgaWYgKHRhcmdldFtrZXldID09PSB1bmRlZmluZWQpIHRhcmdldFtrZXldID0gcHJvYmU7XG4gIH1cbn1cblxuLyoqXG4gKiBDb21wYXJlIHRoZSBzdHlsZSBzZWN0aW9ucyBvZiBhbiBlZGl0IGR1bXAgYW5kIGEgcmVhZGluZyBkdW1wOyBvbmx5XG4gKiBrZXlzIHdob3NlIHZhbHVlcyBkaWZmZXIgYXJlIGtlcHQsIGFzIHsga2V5OiB7IGVkaXQsIHJlYWRpbmcgfSB9LlxuICovXG5mdW5jdGlvbiBkaWZmRHVtcHMoXG4gIGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICByZWFkaW5nOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBmb3IgKGNvbnN0IHNlY3Rpb24gb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBlID0gKGVkaXRbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3QgciA9IChyZWFkaW5nW3NlY3Rpb25dID8/IHt9KSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KFsuLi5PYmplY3Qua2V5cyhlKSwgLi4uT2JqZWN0LmtleXMocildKTtcbiAgICBjb25zdCBkaWZmczogUmVjb3JkPHN0cmluZywgeyBlZGl0OiBzdHJpbmc7IHJlYWRpbmc6IHN0cmluZyB9PiA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIGlmIChlW2tleV0gIT09IHJba2V5XSkge1xuICAgICAgICBkaWZmc1trZXldID0geyBlZGl0OiBlW2tleV0gPz8gXCIobWlzc2luZylcIiwgcmVhZGluZzogcltrZXldID8/IFwiKG1pc3NpbmcpXCIgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKGRpZmZzKS5sZW5ndGggPiAwKSBvdXRbc2VjdGlvbl0gPSBkaWZmcztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKiogU2FtcGxlIHRoZSBjdXJyZW50IHZpZXcncyB0eXBvZ3JhcGh5IGNvbXB1dGVkIHN0eWxlcyArIENTUyB2YXJpYWJsZXMgKi9cbmZ1bmN0aW9uIHNhbXBsZVN0eWxlcyhhcHA6IEFwcCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaXNFZGl0ID0gdmlldy5nZXRNb2RlKCkgPT09IFwic291cmNlXCI7XG4gIGNvbnN0IGNvbnRlbnRFbCA9IHZpZXcuY29udGVudEVsO1xuICAvLyBGaXJzdCBtYXRjaGluZyBjYW5kaWRhdGUgd2lucyBcdTIwMTQgZWRpdCAoY202KSBhbmQgcmVhZGluZyB1c2VcbiAgLy8gZGlmZmVyZW50IGVsZW1lbnQgc3RydWN0dXJlcyAoZS5nLiBubyBwcmUvYmxvY2txdW90ZSBpbiBjbTYpLlxuICBjb25zdCBwaWNrID0gKHNlbHM6IHN0cmluZ1tdKTogSFRNTEVsZW1lbnQgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBzZWxzKSB7XG4gICAgICBjb25zdCBlbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihzZWwpO1xuICAgICAgaWYgKGVsKSByZXR1cm4gZWw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBjb25zdCBzdHlsZSA9IChlbDogSFRNTEVsZW1lbnQgfCBudWxsLCBwcm9wczogc3RyaW5nW10pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgICBpZiAoIWVsKSByZXR1cm4geyBcIihtaXNzaW5nKVwiOiBcImVsZW1lbnQgbm90IGluIHRoaXMgbm90ZVwiIH07XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgcHJvcHMpIHtcbiAgICAgIGNvbnN0IHYgPSBjcy5nZXRQcm9wZXJ0eVZhbHVlKHApLnRyaW0oKTtcbiAgICAgIGlmICh2KSBvdXRbcF0gPSB2O1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCB2YXJzID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcbiAgY29uc3QgY3NzVmFyID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB2YXJzLmdldFByb3BlcnR5VmFsdWUobmFtZSkudHJpbSgpO1xuXG4gIGNvbnN0IGNvbnRhaW5lciA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1jb250ZW50XCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXdcIixcbiAgXSk7XG4gIGNvbnN0IHBhcmEgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tbGluZTpub3QoLkh5cGVyTUQtaGVhZGVyKVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHBcIixcbiAgXSk7XG4gIGNvbnN0IGgxID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20taGVhZGVyLTFcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoMVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGgxXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaDFcIixcbiAgXSk7XG4gIGNvbnN0IGxpc3RJdGVtID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1saXN0LWxpbmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyB1bCA+IGxpXCIsXG4gICAgaXNFZGl0ID8gXCIuSHlwZXJNRC1saXN0LWxpbmVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgXSk7XG4gIGNvbnN0IHByZSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IHByZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWVkaXRpbmcgcHJlXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1jb2RlYmxvY2tcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgXSk7XG4gIGNvbnN0IHF1b3RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBibG9ja3F1b3RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgYmxvY2txdW90ZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELXF1b3RlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgYmxvY2txdW90ZVwiLFxuICBdKTtcbiAgY29uc3QgaW5saW5lQ29kZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgY29kZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGNvZGVcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20taW5saW5lLWNvZGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBjb2RlXCIsXG4gIF0pO1xuICBjb25zdCB0YWJsZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgdGFibGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyB0YWJsZVwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgdGFibGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHRhYmxlXCIsXG4gIF0pO1xuICBjb25zdCBpbWcgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGltZ1wiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGltZ1wiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBpbWdcIixcbiAgICBcImltZ1wiLCAvLyB3aG9sZS1kb2N1bWVudCBmYWxsYmFja1xuICBdKTtcbiAgY29uc3QgaHIgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGhyXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaHJcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIGhyXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWhyXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaHJcIixcbiAgXSk7XG5cbiAgLy8gU3RydWN0dXJlIHByb2JlcyAoZWRpdCB2aWV3IG9ubHkpOiB0aGUgc291cmNlLXZpZXcgY2xhc3MgbGlzdFxuICAvLyAoY29uZmlybXMgdGhlIExpdmUgUHJldmlldyBtYXJrZXIgY2xhc3MpIGFuZCB1bmlxdWUgZWxlbWVudCB0YWdzXG4gIC8vIGluc2lkZSB0aGUgZWRpdG9yIChyZXZlYWxzIGhvdyBjbTYgcmVuZGVycyBjb2RlIGJsb2NrcyBldGMuIHdoZW5cbiAgLy8gdGhlIHVzdWFsIHNlbGVjdG9ycyBkbyBub3QgbWF0Y2gpLlxuICBjb25zdCBzb3VyY2VWaWV3Q2xhc3MgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202XCIpPy5jbGFzc05hbWUgPz8gXCJcIjtcbiAgY29uc3QgZG9tVGFnczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnN0IHRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb250ZW50RWxcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgKlwiKVxuICAgICAgLmZvckVhY2goKGVsKSA9PiB0YWdzLmFkZChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKTtcbiAgICBkb21UYWdzLnB1c2goLi4udGFncyk7XG4gIH1cbiAgLy8gTGlzdC1saW5lIHByb2JlIChlZGl0IHZpZXcgb25seSk6IGNsYXNzIG5hbWVzICsgY29tcHV0ZWQgcGFkZGluZ1xuICAvLyBvZiB0aGUgZmlyc3QgbGlzdCBsaW5lcyBcdTIwMTQgbmVzdGVkIGxldmVscyBvZnRlbiB1c2UgZGlzdGluY3RcbiAgLy8gY2xhc3NlcyBvciBpbmxpbmUgcGFkZGluZ3MsIHdoaWNoIGRlY2lkZXMgd2hldGhlciBhIGxldmVsLWF3YXJlXG4gIC8vIGluZGVudCBvdmVycmlkZSBpcyBldmVuIHBvc3NpYmxlLlxuICBjb25zdCBsaXN0TGluZXM6IHsgY2xhc3NOYW1lOiBzdHJpbmc7IHBhZGRpbmdMZWZ0OiBzdHJpbmcgfVtdID0gW107XG4gIGlmIChpc0VkaXQpIHtcbiAgICBjb250ZW50RWwucXVlcnlTZWxlY3RvckFsbChcIi5IeXBlck1ELWxpc3QtbGluZVwiKS5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgaWYgKGkgPj0gNCkgcmV0dXJuO1xuICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGxpc3RMaW5lcy5wdXNoKHtcbiAgICAgICAgY2xhc3NOYW1lOiBlbC5jbGFzc05hbWUsXG4gICAgICAgIHBhZGRpbmdMZWZ0OiBjcy5nZXRQcm9wZXJ0eVZhbHVlKFwicGFkZGluZy1sZWZ0XCIpLnRyaW0oKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIC8vIEZyb250bWF0dGVyIHByb2JlczogZG9lcyB0aGUgKGhpZGRlbikgcHJvcGVydGllcyBhcmVhIHN0aWxsXG4gIC8vIG9jY3VweSBzcGFjZSBpbiBMaXZlIFByZXZpZXc/IEFuZCBob3cgZmFyIGlzIHRoZSBIMSBmcm9tIHRoZVxuICAvLyB0b3Agb2YgdGhlIGNvbnRlbnQgYXJlYT8gKHJlYWRpbmcgbW9kZSBoYXMgbm8gc3VjaCBwYWRkaW5nKVxuICBjb25zdCBtZXRhZGF0YURpc3BsYXkgPSAoKCkgPT4ge1xuICAgIGNvbnN0IHNlbCA9IGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2UtdmlldyAubWV0YWRhdGEtY29udGFpbmVyXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIjtcbiAgICBjb25zdCBlbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihzZWwpO1xuICAgIHJldHVybiBlbCA/IGdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgOiBcIihub3QgaW4gRE9NKVwiO1xuICB9KSgpO1xuICBjb25zdCBoMU9mZnNldFRvcCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgdG9wID0gMDtcbiAgICBsZXQgbm9kZTogSFRNTEVsZW1lbnQgfCBudWxsID0gaDE7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIHRvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICAgIG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0b3A7XG4gIH0pKCk7XG4gIC8vIFdoYXQgb2NjdXBpZXMgdGhlIHNwYWNlIGJldHdlZW4gdGhlIGNvbnRlbnQgdG9wIGFuZCB0aGUgSDE/XG4gIC8vIChlZGl0KSBmaXJzdCBjaGlsZHJlbiBvZiAuY20tY29udGVudCwgYW5kIHRoZSBuZXQgSDEgZGlzdGFuY2VcbiAgLy8gZnJvbSB0aGUgY29udGVudCBhbmNob3IgXHUyMDE0IHJlYWRpbmcgaGFzIG5vIHN1Y2ggZ2FwLlxuICBjb25zdCBhbmNob3IgPSBpc0VkaXRcbiAgICA/IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpXG4gICAgOiBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXdcIik7XG4gIGNvbnN0IGgxVG9wSW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCk7XG4gIH0pKCk7XG4gIGNvbnN0IGgxTGVmdEluQ29udGVudCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSB8fCAhYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGgxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCk7XG4gIH0pKCk7XG4gIGNvbnN0IGNvbnRlbnRDaGlsZHJlbiA9ICgoKSA9PiB7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYW5jaG9yLmNoaWxkcmVuKVxuICAgICAgLnNsaWNlKDAsIDQpXG4gICAgICAubWFwKChlbCkgPT4ge1xuICAgICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNsczogKGVsIGFzIEhUTUxFbGVtZW50KS5jbGFzc05hbWUgfHwgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgIGRpc3BsYXk6IGNzLmRpc3BsYXksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCksXG4gICAgICAgICAgbWFyZ2luVG9wOiBjcy5tYXJnaW5Ub3AsXG4gICAgICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IGNzLm1hcmdpbkJvdHRvbSxcbiAgICAgICAgICBwYWRkaW5nQm90dG9tOiBjcy5wYWRkaW5nQm90dG9tLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH0pKCk7XG4gIC8vIENvbnRhaW5lciBjaGFpbiBwcm9iZTogZnJvbSAuY20tY29udGVudCB1cCB0byB0aGUgdmlldy1jb250ZW50LFxuICAvLyBlYWNoIHdyYXBwZXIncyBwYWRkaW5nL21hcmdpbiBcdTIwMTQgbG9jYXRlcyB0aGUgbGVmdG92ZXIgdmVydGljYWxcbiAgLy8gb2Zmc2V0IGJldHdlZW4gZWRpdCBhbmQgcmVhZGluZyBjb250ZW50IGFyZWFzLlxuICBjb25zdCB0b3BDaGFpbiA9ICgoKSA9PiB7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFydHM6IHsgY2xzOiBzdHJpbmc7IHBhZFRvcDogc3RyaW5nOyBtYXJUb3A6IHN0cmluZyB9W10gPSBbXTtcbiAgICBsZXQgbm9kZTogSFRNTEVsZW1lbnQgfCBudWxsID0gYW5jaG9yO1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRlbnRFbCAmJiBub2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgY2xzOiBub2RlLmNsYXNzTmFtZSB8fCBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgcGFkVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICBtYXJUb3A6IGNzLm1hcmdpblRvcCxcbiAgICAgIH0pO1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzO1xuICB9KSgpO1xuXG4gIC8vIFRpdGxlIHByb2JlOiB0aGUgZ2VuZXJhdGVkIDo6YmVmb3JlIGluIFNsaWRlcyBtb2RlICh3aGVuIGEgdGl0bGUgaXNcbiAgLy8gY29uZmlndXJlZCkuIENhcHR1cmVzIGl0cyBjb21wdXRlZCBzdHlsZSBzbyB3ZSBjYW4gZGlmZiBpdCBhZ2FpbnN0IHRoZVxuICAvLyBib2R5IEgxICguY20taGVhZGVyLTEpIGFuZCBhbGlnbiB0aGVtIGV4YWN0bHkuXG4gIGNvbnN0IHRpdGxlQmVmb3JlID0gKCgpID0+IHtcbiAgICBpZiAoIWlzRWRpdCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50LCBcIjo6YmVmb3JlXCIpO1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiBjcy5jb250ZW50LFxuICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgIHBvc2l0aW9uOiBjcy5wb3NpdGlvbixcbiAgICAgIHRvcDogY3MudG9wLFxuICAgICAgbGVmdDogY3MubGVmdCxcbiAgICAgIHBhZGRpbmdUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICBmb250RmFtaWx5OiBjcy5mb250RmFtaWx5LFxuICAgICAgZm9udFNpemU6IGNzLmZvbnRTaXplLFxuICAgICAgbGluZUhlaWdodDogY3MubGluZUhlaWdodCxcbiAgICAgIGZvbnRXZWlnaHQ6IGNzLmZvbnRXZWlnaHQsXG4gICAgICBmb250VmFyaWFudDogY3MuZm9udFZhcmlhbnQsXG4gICAgICBjb2xvcjogY3MuY29sb3IsXG4gICAgICBsZXR0ZXJTcGFjaW5nOiBjcy5sZXR0ZXJTcGFjaW5nLFxuICAgICAgdGV4dFRyYW5zZm9ybTogY3MudGV4dFRyYW5zZm9ybSxcbiAgICAgIHdvcmRTcGFjaW5nOiBjcy53b3JkU3BhY2luZyxcbiAgICAgIGZvbnRLZXJuaW5nOiBjcy5mb250S2VybmluZyxcbiAgICAgIGZvbnRGZWF0dXJlU2V0dGluZ3M6IGNzLmZvbnRGZWF0dXJlU2V0dGluZ3MsXG4gICAgICBmb250VmFyaWFudE51bWVyaWM6IGNzLmZvbnRWYXJpYW50TnVtZXJpYyxcbiAgICAgIGZvbnRWYXJpYW50TGlnYXR1cmVzOiBjcy5mb250VmFyaWFudExpZ2F0dXJlcyxcbiAgICAgIGZvbnRWYXJpYW50Q2FwczogY3MuZm9udFZhcmlhbnRDYXBzLFxuICAgIH07XG4gIH0pKCk7XG5cbiAgY29uc3QgZHVtcCA9IHtcbiAgICBtb2RlOiBpc0VkaXQgPyBcImVkaXQgKExpdmUgUHJldmlldylcIiA6IFwicmVhZGluZ1wiLFxuICAgIC8vIFNsaWRlcyBzdHlsaW5nIG9ubHkgYXBwbGllcyB3aGVuIFNsaWRlcyBtb2RlIGlzIG9uXG4gICAgc2xpZGVzQWN0aXZlOiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSxcbiAgICBkb21UYWdzOiBpc0VkaXQgPyBkb21UYWdzIDogdW5kZWZpbmVkLFxuICAgIHNvdXJjZVZpZXdDbGFzczogaXNFZGl0ID8gc291cmNlVmlld0NsYXNzIDogdW5kZWZpbmVkLFxuICAgIGxpdmVQcmV2aWV3OiBpc0VkaXQgPyBpc0xpdmVQcmV2aWV3KGFwcCkgOiB1bmRlZmluZWQsXG4gICAgbGlzdExpbmVzOiBpc0VkaXQgPyBsaXN0TGluZXMgOiB1bmRlZmluZWQsXG4gICAgbWV0YWRhdGFDb250YWluZXJEaXNwbGF5OiBtZXRhZGF0YURpc3BsYXksXG4gICAgaDFPZmZzZXRUb3A6IGgxT2Zmc2V0VG9wLFxuICAgIGgxVG9wSW5Db250ZW50OiBoMVRvcEluQ29udGVudCxcbiAgICBoMUxlZnRJbkNvbnRlbnQ6IGgxTGVmdEluQ29udGVudCxcbiAgICBjb250ZW50Q2hpbGRyZW46IGNvbnRlbnRDaGlsZHJlbixcbiAgICB0b3BDaGFpbjogdG9wQ2hhaW4sXG4gICAgdGl0bGU6IHRpdGxlQmVmb3JlLFxuICAgIGNvbnRhaW5lcjogc3R5bGUoY29udGFpbmVyLCBbXG4gICAgICBcImZvbnQtZmFtaWx5XCIsXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXgtd2lkdGhcIixcbiAgICAgIFwid2lkdGhcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwiY29sb3JcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIHBhcmFncmFwaDogc3R5bGUocGFyYSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcIm1hcmdpbi1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1yaWdodFwiLFxuICAgICAgXCJ0ZXh0LWluZGVudFwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgaDE6IHN0eWxlKGgxLCBbXG4gICAgICBcImZvbnQtZmFtaWx5XCIsXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJmb250LXdlaWdodFwiLFxuICAgICAgXCJmb250LXZhcmlhbnRcIixcbiAgICAgIFwiY29sb3JcIixcbiAgICAgIFwibGV0dGVyLXNwYWNpbmdcIixcbiAgICAgIFwidGV4dC10cmFuc2Zvcm1cIixcbiAgICAgIFwid29yZC1zcGFjaW5nXCIsXG4gICAgICBcImZvbnQta2VybmluZ1wiLFxuICAgICAgXCJmb250LWZlYXR1cmUtc2V0dGluZ3NcIixcbiAgICAgIFwiZm9udC12YXJpYW50LW51bWVyaWNcIixcbiAgICAgIFwiZm9udC12YXJpYW50LWxpZ2F0dXJlc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtY2Fwc1wiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGxpc3RJdGVtOiBzdHlsZShsaXN0SXRlbSwgW1xuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBjb2RlQmxvY2s6IHN0eWxlKHByZSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgXCJib3JkZXItcmFkaXVzXCIsXG4gICAgXSksXG4gICAgYmxvY2txdW90ZTogc3R5bGUocXVvdGUsIFtcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcImJvcmRlci1sZWZ0LXdpZHRoXCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICBdKSxcbiAgICBpbmxpbmVDb2RlOiBzdHlsZShpbmxpbmVDb2RlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICB0YWJsZTogc3R5bGUodGFibGUsIFtcImZvbnQtc2l6ZVwiLCBcImxpbmUtaGVpZ2h0XCIsIFwid2lkdGhcIiwgXCJib3JkZXItY29sbGFwc2VcIl0pLFxuICAgIGltYWdlOiBzdHlsZShpbWcsIFtcImRpc3BsYXlcIiwgXCJtYXJnaW4tbGVmdFwiLCBcIm1hcmdpbi1yaWdodFwiLCBcIm1heC13aWR0aFwiLCBcIndpZHRoXCJdKSxcbiAgICBob3Jpem9udGFsUnVsZTogc3R5bGUoaHIsIFtcIm1hcmdpbi10b3BcIiwgXCJtYXJnaW4tYm90dG9tXCIsIFwiYm9yZGVyLXRvcC13aWR0aFwiLCBcImhlaWdodFwiXSksXG4gICAgY3NzVmFyaWFibGVzOiB7XG4gICAgICBcIi0tZm9udC10ZXh0XCI6IGNzc1ZhcihcIi0tZm9udC10ZXh0XCIpLFxuICAgICAgXCItLWxpbmUtaGVpZ2h0LW5vcm1hbFwiOiBjc3NWYXIoXCItLWxpbmUtaGVpZ2h0LW5vcm1hbFwiKSxcbiAgICAgIFwiLS1oMS1zaXplXCI6IGNzc1ZhcihcIi0taDEtc2l6ZVwiKSxcbiAgICAgIFwiLS1oMS1saW5lLWhlaWdodFwiOiBjc3NWYXIoXCItLWgxLWxpbmUtaGVpZ2h0XCIpLFxuICAgICAgXCItLWgxLXdlaWdodFwiOiBjc3NWYXIoXCItLWgxLXdlaWdodFwiKSxcbiAgICAgIFwiLS1oMS12YXJpYW50XCI6IGNzc1ZhcihcIi0taDEtdmFyaWFudFwiKSxcbiAgICAgIFwiLS1oMS1jb2xvclwiOiBjc3NWYXIoXCItLWgxLWNvbG9yXCIpLFxuICAgICAgXCItLWgxLW1hcmdpbi10b3BcIjogY3NzVmFyKFwiLS1oMS1tYXJnaW4tdG9wXCIpLFxuICAgICAgXCItLWgxLW1hcmdpbi1ib3R0b21cIjogY3NzVmFyKFwiLS1oMS1tYXJnaW4tYm90dG9tXCIpLFxuICAgICAgXCItLXAtc3BhY2luZ1wiOiBjc3NWYXIoXCItLXAtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LXNwYWNpbmdcIjogY3NzVmFyKFwiLS1saXN0LXNwYWNpbmdcIiksXG4gICAgICBcIi0tbGlzdC1pbmRlbnRcIjogY3NzVmFyKFwiLS1saXN0LWluZGVudFwiKSxcbiAgICAgIFwiLS1jb2RlLXNpemVcIjogY3NzVmFyKFwiLS1jb2RlLXNpemVcIiksXG4gICAgICBcIi0tY29kZS1wYWRkaW5nXCI6IGNzc1ZhcihcIi0tY29kZS1wYWRkaW5nXCIpLFxuICAgICAgXCItLWNvZGUtcmFkaXVzXCI6IGNzc1ZhcihcIi0tY29kZS1yYWRpdXNcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1wYWRkaW5nXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1wYWRkaW5nXCIpLFxuICAgICAgXCItLWJsb2NrcXVvdGUtYm9yZGVyLXRoaWNrbmVzc1wiOiBjc3NWYXIoXCItLWJsb2NrcXVvdGUtYm9yZGVyLXRoaWNrbmVzc1wiKSxcbiAgICAgIFwiLS1maWxlLW1hcmdpbnNcIjogY3NzVmFyKFwiLS1maWxlLW1hcmdpbnNcIiksXG4gICAgICBcIi0tZmlsZS1saW5lLXdpZHRoXCI6IGNzc1ZhcihcIi0tZmlsZS1saW5lLXdpZHRoXCIpLFxuICAgICAgXCItLW5vcm1hbC1mb250LXNpemVcIjogY3NzVmFyKFwiLS1ub3JtYWwtZm9udC1zaXplXCIpLFxuICAgICAgXCItLWZvbnQtdGV4dC1zaXplXCI6IGNzc1ZhcihcIi0tZm9udC10ZXh0LXNpemVcIiksXG4gICAgfSxcbiAgfTtcbiAgcmV0dXJuIGR1bXA7XG59XG5cbi8qKlxuICogRGVidWcgdHlwb2dyYXBoeTogc2FtcGxlcyB0aGUgZml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIChlYWNoXG4gKiBjb3ZlcmluZyBhIGdyb3VwIG9mIGVsZW1lbnRzIFx1MjAxNCBhbGwgdmlzaWJsZSB3aXRob3V0IHNjcm9sbGluZyksXG4gKiB0aGVuIHRoZSBraXRjaGVuLXNpbmsgbm90ZSBpbiByZWFkaW5nIHZpZXcgKG5vIHZpcnR1YWxpemF0aW9uXG4gKiB0aGVyZSksIG1lcmdlcyBldmVyeXRoaW5nLCBjb21wdXRlcyB0aGUgZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kXG4gKiB3cml0ZXMgaXQgdG8gLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC5cbiAqIFRoZSB1c2VyJ3Mgb3duIG5vdGUgaXMgcmVzdG9yZWQgYXQgdGhlIGVuZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGFwcCA9IHBsdWdpbi5hcHA7XG4gIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogZW50ZXIgU2xpZGVzIG1vZGUgZmlyc3QgKE1vZCtTaGlmdCtFIG9uIGEgZGVjayBub3RlKVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogbm8gYWN0aXZlIE1hcmtkb3duIG5vdGVcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHN0YXJ0TW9kZSA9IHZpZXcuZ2V0TW9kZSgpO1xuICBjb25zdCBhY3RpdmVGaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIGNvbnN0IGxlYWYgPSBhcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpO1xuXG4gIC8vIEVkaXQgc2lkZTogZWFjaCBzaG9ydCBub3RlIGtlZXBzIGV2ZXJ5IHRhcmdldCBlbGVtZW50IG9uIHNjcmVlblxuICBjb25zdCBlZGl0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgU0FNUExFX05PVEVfTkFNRVMpIHtcbiAgICBjb25zdCBmID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgdGVzdHMvJHtuYW1lfS5tZGApO1xuICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIGNvbnRpbnVlO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZiwgeyBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0gfSk7XG4gICAgYXdhaXQgc2xlZXAoNTAwKTtcbiAgICBjb25zdCBzID0gc2FtcGxlU3R5bGVzKGFwcCk7XG4gICAgaWYgKHMpIG1lcmdlU2FtcGxlKGVkaXQsIHMpO1xuICB9XG5cbiAgLy8gUmVhZGluZyBzaWRlOiB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgcmVuZGVycyBldmVyeXRoaW5nIGF0IG9uY2VcbiAgbGV0IHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGRlbW8gPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFwidGVzdHMvdHlwb2dyYXBoeS1kZW1vLm1kXCIpO1xuICBpZiAoZGVtbyBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShkZW1vLCB7IHN0YXRlOiB7IG1vZGU6IFwicHJldmlld1wiIH0gfSk7XG4gICAgYXdhaXQgc2xlZXAoODAwKTtcbiAgICByZWFkaW5nID0gc2FtcGxlU3R5bGVzKGFwcCk7XG4gIH1cblxuICAvLyBSZXN0b3JlIHRoZSB1c2VyJ3Mgbm90ZVxuICBpZiAoYWN0aXZlRmlsZSkge1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoYWN0aXZlRmlsZSwgeyBzdGF0ZTogeyBtb2RlOiBzdGFydE1vZGUgfSB9KTtcbiAgICBwbHVnaW4ucmVmcmVzaCgpO1xuICB9XG4gIGlmICghcmVhZGluZykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiByZWFkaW5nIHNhbXBsZSBmYWlsZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGF5bG9hZCA9IHsgZWRpdCwgcmVhZGluZywgZGlmZjogZGlmZkR1bXBzKGVkaXQsIHJlYWRpbmcpIH07XG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLnZhdWx0LmFkYXB0ZXIud3JpdGUoXCIubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIDIpKTtcbiAgICBuZXcgTm90aWNlKFwiVHlwb2dyYXBoeSBkdW1wIFx1MjE5MiAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uICh2YXVsdCByb290KVwiKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3Qgd3JpdGUgZGVidWcgZmlsZSAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgfVxufVxuXG4vKiogUmVnaXN0ZXIgdGhlIGRldi1vbmx5IGRlYnVnIGNvbW1hbmQgKGNhbGxlZCBvbmx5IHdoZW4gREVWX01PREUgaXMgdHJ1ZSkuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiB2b2lkIHtcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWRlYnVnLXN0eWxlc1wiLFxuICAgIG5hbWU6IFwiRGVidWc6IGR1bXAgdHlwb2dyYXBoeSBzdHlsZXNcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBkdW1wVHlwb2dyYXBoeShwbHVnaW4pLFxuICB9KTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuLyoqIE1vZGUgb2YgdGhlIGFjdGl2ZSBNYXJrZG93biB2aWV3OiAncHJldmlldyc9cmVhZGluZyAnc291cmNlJz1lZGl0aW5nICcnPW5vbmUgKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXJyZW50TW9kZShhcHA6IEFwcCk6IFwicHJldmlld1wiIHwgXCJzb3VyY2VcIiB8IFwiXCIge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIHJldHVybiB2aWV3ID8gdmlldy5nZXRNb2RlKCkgOiBcIlwiO1xufVxuXG4vKipcbiAqIFRydWUgd2hlbiB0aGUgYWN0aXZlIGVkaXQgdmlldyBpcyBMaXZlIFByZXZpZXcgKFNsaWRlcykgXHUyMDE0IGFzXG4gKiBvcHBvc2VkIHRvIFNvdXJjZSBtb2RlLiBPYnNpZGlhbiByZXBvcnRzIGJvdGggYXMgbW9kZSBcInNvdXJjZVwiO1xuICogdGhlIHZpZXcgc3RhdGUgY2FycmllcyBhIGBzb3VyY2VgIGZsYWcgKFNvdXJjZSBtb2RlID0gdHJ1ZSksIHdpdGhcbiAqIGEgRE9NIGNsYXNzIGZhbGxiYWNrICguaXMtbGl2ZS1wcmV2aWV3KSBmb3Igc2FmZXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNMaXZlUHJldmlldyhhcHA6IEFwcCk6IGJvb2xlYW4ge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldyB8fCB2aWV3LmdldE1vZGUoKSAhPT0gXCJzb3VyY2VcIikgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgaWYgKHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoc3RhdGUuc291cmNlID09PSBmYWxzZSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiAhIXZpZXcuY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNi5pcy1saXZlLXByZXZpZXdcIik7XG59XG5cbi8qKiBGcm9udG1hdHRlciBvZiBhbnkgbm90ZSBhcyBhbiBvYmplY3QsIG9yIG51bGwgd2hlbiBhYnNlbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9udG1hdHRlck9mKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICByZXR1cm4gY2FjaGU/LmZyb250bWF0dGVyID8/IG51bGw7XG59XG5cbi8qKiBDdXJyZW50IG5vdGUncyBmcm9udG1hdHRlciBhcyBhbiBvYmplY3QsIG9yIG51bGwgd2hlbiBhYnNlbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmVGcm9udG1hdHRlcihhcHA6IEFwcCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IGZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgcmV0dXJuIGZpbGUgPyBmcm9udG1hdHRlck9mKGFwcCwgZmlsZSkgOiBudWxsO1xufVxuIiwgIi8qKiBBIGJ1aWx0LWluIFNsaWRlcyBzdHlsZSB0ZW1wbGF0ZSAocmVuZGVyZWQgYXMgYm9keSBjbGFzcyBgbmF0aXZlLXNsaWRlcy10aGVtZS08aWQ+YCkgKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2xpZGVzVGhlbWUge1xuICBpZDogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG4vKiogQnVpbHQtaW4gc3R5bGUgdGVtcGxhdGVzIGZvciB0aGUgU2xpZGVzIGNhcmQgKyBiYXIgKGFsbCB0aGVtZS1hZGFwdGl2ZSkgKi9cbmV4cG9ydCBjb25zdCBTTElERVNfVEhFTUVTOiByZWFkb25seSBTbGlkZXNUaGVtZVtdID0gW1xuICB7IGlkOiBcImp5eVwiLCBsYWJlbDogXCJMZWN0dXJlIChqeXkpXCIgfSxcbiAgeyBpZDogXCJkYXNoZWRcIiwgbGFiZWw6IFwiRGFzaGVkIG91dGxpbmVcIiB9LFxuICB7IGlkOiBcInBhcGVyXCIsIGxhYmVsOiBcIlBhcGVyIGNhcmRcIiB9LFxuICB7IGlkOiBcIm1pbmltYWxcIiwgbGFiZWw6IFwiTWluaW1hbFwiIH0sXG4gIHsgaWQ6IFwiYWNjZW50XCIsIGxhYmVsOiBcIkFjY2VudCBlZGdlXCIgfSxcbiAgeyBpZDogXCJnbGFzc1wiLCBsYWJlbDogXCJGcm9zdGVkIGdsYXNzXCIgfSxcbl07XG5cbi8qKiBQbHVnaW4gc2V0dGluZ3MgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmF0aXZlU2xpZGVzU2V0dGluZ3Mge1xuICAvKiogU2hvdyBcdTI1QzAgXHUyNUI2IHByZXZpb3VzL25leHQgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciAqL1xuICBzaG93TmF2QnV0dG9uczogYm9vbGVhbjtcbiAgLyoqIFBhZ2UgbnVtYmVyIGRpc3BsYXkgc3R5bGU6IFwiZnJhY3Rpb25cIiA9IE4gLyBUb3RhbCwgXCJjdXJyZW50XCIgPSBOLCBcIm5vbmVcIiA9IGhpZGRlbiAqL1xuICBwYWdlTnVtYmVyU3R5bGU6IFwiZnJhY3Rpb25cIiB8IFwiY3VycmVudFwiIHwgXCJub25lXCI7XG4gIC8qKiBTaG93IGEgdGhpbiBjbGlja2FibGUgcHJvZ3Jlc3MgbGluZSBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dQcm9ncmVzczogYm9vbGVhbjtcbiAgLyoqIFNob3cgdGhlIGVudGlyZSBzbGlkZXMgYmFyIChtYXN0ZXIgdG9nZ2xlKSAqL1xuICBzaG93U2xpZGVzQmFyOiBib29sZWFuO1xuICAvKiogV2hldGhlciB0aGUgdXNlciBtYW51YWxseSBoaWQgdGhlIHNsaWRlcyBiYXIgKHRvZ2dsZSBjb21tYW5kKSAqL1xuICBiYXJIaWRkZW46IGJvb2xlYW47XG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIHdoZW4gb3BlbmluZyBhIGRlY2sgbm90ZSAoZGVmYXVsdCBvZmYpICovXG4gIGF1dG9FbnRlclNsaWRlczogYm9vbGVhbjtcbiAgLyoqIFByZXNzIEVzY2FwZSB0byBleGl0IFNsaWRlcyBtb2RlIChkZWZhdWx0IG9uKSAqL1xuICBlc2NFeGl0c1NsaWRlczogYm9vbGVhbjtcbiAgLyoqIEZyb250bWF0dGVyIHByb3BlcnR5IHNob3duIGFzIHRoZSBjYXJkIHRpdGxlIChcIlwiID0gbm9uZSwgXCJmaWxlbmFtZVwiID0gZmlsZSBuYW1lKSAqL1xuICBzbGlkZXNUaXRsZTogc3RyaW5nO1xuICAvKiogU3R5bGUgdGVtcGxhdGUgaWQgZnJvbSBTTElERVNfVEhFTUVTIChjYXJkICsgYmFyIGFwcGVhcmFuY2UpICovXG4gIHNsaWRlc1RoZW1lOiBzdHJpbmc7XG4gIC8qKiBDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgZm9yIHRoZSBzbGlkZXMgYmFyIChlbXB0eSA9IG5vbmUpICovXG4gIGJhclByb3BlcnRpZXM6IHN0cmluZztcbiAgLyoqIEpTT04gYXJyYXkgb2YgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIGZvciBiYXIgcHJvcGVydGllcyAoZHJhZ2dhYmxlIGRpdmlkZXJzKSAqL1xuICBiYXJQcm9wZXJ0eVdpZHRoczogc3RyaW5nO1xuICAvKiogQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBwYW5lbCAoZGVmYXVsdCBvbikgKi9cbiAgY29uZmlybURlbGV0ZVNsaWRlczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEJsb2NrIGltYWdlIGVtYmVkcyBhcyBjZW50ZXJlZCBjYXJkIGJsb2NrcyAoZGVmYXVsdCBvbikuIFdoZW4gb2ZmLFxuICAgKiBpbWFnZXMga2VlcCBPYnNpZGlhbidzIG5hdGl2ZSBpbmxpbmUgZmxvdyBcdTIwMTQgdGV4dCBmbG93cyBhcm91bmQvYmVzaWRlXG4gICAqIHRoZW0gZXhhY3RseSBsaWtlIExpdmUgUHJldmlldyBvdXRzaWRlIFNsaWRlcyBtb2RlLlxuICAgKi9cbiAgaW1hZ2VMYXlvdXQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBOYXRpdmVTbGlkZXNTZXR0aW5ncyA9IHtcbiAgc2hvd05hdkJ1dHRvbnM6IHRydWUsXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJub25lXCIsXG4gIHNob3dQcm9ncmVzczogdHJ1ZSxcbiAgc2hvd1NsaWRlc0JhcjogdHJ1ZSxcbiAgYmFySGlkZGVuOiBmYWxzZSxcbiAgYXV0b0VudGVyU2xpZGVzOiBmYWxzZSxcbiAgZXNjRXhpdHNTbGlkZXM6IHRydWUsXG4gIHNsaWRlc1RpdGxlOiBcIlwiLFxuICBzbGlkZXNUaGVtZTogXCJqeXlcIixcbiAgYmFyUHJvcGVydGllczogXCJcIixcbiAgYmFyUHJvcGVydHlXaWR0aHM6IFwiXCIsXG4gIGNvbmZpcm1EZWxldGVTbGlkZXM6IHRydWUsXG4gIGltYWdlTGF5b3V0OiB0cnVlLFxufTtcblxuLyoqIFJlc2VydmVkIGZyb250bWF0dGVyIGtleSBkcml2aW5nIGRlY2sgbmF2aWdhdGlvbiAobmV2ZXIgcmVuZGVyZWQgYXMgYSBjaGlwKSAqL1xuZXhwb3J0IGNvbnN0IERFQ0tfS0VZID0gXCJkZWNrXCI7XG4iLCAiaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBjb3B5Q2FwYWNpdHlQcm9tcHQgfSBmcm9tIFwiLi9jYXBhY2l0eVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQgfSBmcm9tIFwiLi9kZWJ1Z1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB7IERFQ0tfS0VZIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqIFJlZ2lzdGVyIGV2ZXJ5IGNvbW1hbmQ7IHRoZSBkZWJ1ZyBjb21tYW5kIGlzIGRldi1idWlsZCBvbmx5LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ29tbWFuZHMocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiB2b2lkIHtcbiAgLy8gVG9nZ2xlIHRoZSBzbGlkZXMgYmFyICh3aXRoaW4gU2xpZGVzIG1vZGUpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtYmFyXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIGJhclwiLFxuICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICBwbHVnaW4uc2V0dGluZ3MuYmFySGlkZGVuID0gIXBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW47XG4gICAgICBhd2FpdCBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICBwbHVnaW4ucmVmcmVzaCgpO1xuICAgIH0sXG4gIH0pO1xuICAvLyBTaG93IHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtc2hvdy1wYW5lbFwiLFxuICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgcGFuZWxcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uYWN0aXZhdGVTbGlkZXNQYW5lbCgpLFxuICB9KTtcbiAgLy8gSGlkZSAvIHNob3cgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgKHByZXNlbnRpbmc7IFNsaWRlcyBtb2RlIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtcG9pbnRlclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIG1vdXNlIHBvaW50ZXJcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVBvaW50ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBQcmV2aW91cyAvIG5leHQgcGFnZSAoZGVjayBuYXZpZ2F0aW9uOyBlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1wcmV2XCIsXG4gICAgbmFtZTogXCJQcmV2aW91cyBwYWdlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkFycm93TGVmdFwiIH1dLFxuICAgIGNhbGxiYWNrOiAoKSA9PiBwbHVnaW4ubmF2aWdhdGUoXCJwcmV2XCIpLFxuICB9KTtcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLW5leHRcIixcbiAgICBuYW1lOiBcIk5leHQgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd1JpZ2h0XCIgfV0sXG4gICAgY2FsbGJhY2s6ICgpID0+IHBsdWdpbi5uYXZpZ2F0ZShcIm5leHRcIiksXG4gIH0pO1xuICAvLyBDcmVhdGUgTmV4dCBTbGlkZSBcdTIwMTQgbmV3IHNsaWRlIGFmdGVyIHRoZSBjdXJyZW50IG9uZSAoZGVjayBub3RlcyBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5leHRcIixcbiAgICBuYW1lOiBcIkNyZWF0ZSBuZXh0IHNsaWRlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIk5cIiB9XSxcbiAgICAvLyBHcmV5ZWQgb3V0IHVubGVzcyB0aGUgYWN0aXZlIG5vdGUgaXMgcGFydCBvZiBhIGRlY2sgXHUyMDE0IHBsYWluIG5vdGVzXG4gICAgLy8gc3RhcnQgZGVja3Mgd2l0aCBcIkNyZWF0ZSBuZXcgc2xpZGVcIiBpbnN0ZWFkLlxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSB8fCAhcGx1Z2luLmRlY2tTZXJ2aWNlLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBwbGFuID0gcGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXh0KGZpbGUpO1xuICAgICAgaWYgKCFwbGFuKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB2b2lkIHBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlQ3JlYXRlTmV4dChmaWxlLCBwbGFuKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBDcmVhdGUgTmV3IFNsaWRlIFx1MjAxNCBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZSAobm9uLWRlY2sgbm90ZXMgb25seTtcbiAgLy8gYWxzbyB3b3JrcyBmcm9tIGEgYmxhbmsgdGFiIFx1MjAxNCBsYW5kcyBpbiB0aGUgZGVmYXVsdCBuZXctbm90ZSBsb2NhdGlvbilcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXdcIixcbiAgICBuYW1lOiBcIkNyZWF0ZSBuZXcgc2xpZGVcIixcbiAgICAvLyBObyBkZWZhdWx0IGhvdGtleTogTW9kK1NoaWZ0K04gYmVsb25ncyB0byBDcmVhdGUgbmV4dCBzbGlkZSBcdTIwMTQgdHdvXG4gICAgLy8gY29tbWFuZHMgc2hhcmluZyBvbmUgZGVmYXVsdCBob3RrZXkgdHJpcHMgT2JzaWRpYW4ncyBjb25mbGljdCBVSS5cbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5ldyhwbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5ldygpKSxcbiAgfSk7XG4gIC8vIENvcHkgYSBvbmUtc2NyZWVuIGNhcGFjaXR5IHJlcG9ydCBvZiB0aGUgY3VycmVudCBTbGlkZXMgbGF5b3V0XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jb3B5LWNhcGFjaXR5XCIsXG4gICAgbmFtZTogXCJDb3B5IHNsaWRlIGNhcGFjaXR5XCIsXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB2b2lkIGNvcHlDYXBhY2l0eVByb21wdChwbHVnaW4uYXBwKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBUb2dnbGUgU2xpZGVzIG1vZGUgXHUyMDE0IHRoZSBpbW1lcnNpdmUgY2FyZCB2aWV3IChkZWNrIG5vdGVzIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtc2xpZGVzXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIG1vZGVcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiRVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHBsdWdpbi5hcHAsIGZpbGUpO1xuICAgICAgaWYgKGZtID09PSBudWxsIHx8ICEoREVDS19LRVkgaW4gZm0pKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSBwbHVnaW4udG9nZ2xlU2xpZGVzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gRGVidWcgdG9vbGluZyBcdTIwMTQgcmVnaXN0ZXJlZCBvbmx5IGluIGRldiBidWlsZHMgKHRyZWUtc2hha2VuIGluIHJlbGVhc2UpXG4gIGlmIChERVZfTU9ERSkgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQocGx1Z2luKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7XG4gIHBsYW5DcmVhdGVOZXcgYXMgcGxhbk5ldyxcbiAgcGxhbkNyZWF0ZU5leHQgYXMgcGxhbixcbiAgdHlwZSBDcmVhdGVOZXh0UmVzdWx0LFxufSBmcm9tIFwiLi9jcmVhdGVOZXh0XCI7XG5pbXBvcnQgeyBjb21wdXRlRGVjaywgZXh0cmFjdExpbmtzLCBleHRyYWN0UmF3TGlua3MsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5pbXBvcnQgeyBwaWNrTGFuZGluZ1BhdGgsIHBsYW5EZWxldGVTbGlkZXMgfSBmcm9tIFwiLi9kZWxldGVTbGlkZXNcIjtcbmltcG9ydCB7IGZyb250bWF0dGVyT2YgfSBmcm9tIFwiLi9tb2RlXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZXN1bHQgb2YgYSBEZWxldGUgc2xpZGVzIHJ1biAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVTbGlkZXNSZXN1bHQge1xuICAvKiogUGF0aHMgYWN0dWFsbHkgbW92ZWQgdG8gdGhlIHRyYXNoICovXG4gIHRyYXNoZWQ6IHN0cmluZ1tdO1xuICAvKiogV2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlcndhcmRzIChudWxsID0ga2VlcCBjdXJyZW50IG5vdGUpICovXG4gIGxhbmRpbmdQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjazogaXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW5cbiAgICogZW1wdHkgXHUyMDE0IGEgZnJlc2ggc2luZ2xlIHNsaWRlKSBvciBzb21lIG90aGVyIHNsaWRlIGRlY2xhcmVzIGl0IGFzIGl0c1xuICAgKiBuZXh0IHNsaWRlLlxuICAgKi9cbiAgaXNNZW1iZXIoZmlsZTogVEZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiAoZm0gIT09IG51bGwgJiYgREVDS19LRVkgaW4gZm0pIHx8IHRoaXMucHJldk9mKGZpbGUucGF0aCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBjdXJyZW50IG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2sgKG51bGwgd2hlbiBub3QgYSBtZW1iZXIpICovXG4gIGNvbXB1dGUoZmlsZTogVEZpbGUpOiBEZWNrSW5mbyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc01lbWJlcihmaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGNvbXB1dGVEZWNrKFxuICAgICAgZmlsZS5wYXRoLFxuICAgICAgKHBhdGgpID0+IHRoaXMubGlua1BhdGhzKHBhdGgpLFxuICAgICAgKHBhdGgpID0+IHRoaXMucHJldk9mKHBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogUmVzb2x2ZSB0aGUgYGRlY2tgIHByb3BlcnR5IG9mIGEgbm90ZSBpbnRvIHJlYWwgbm90ZSBwYXRocyAobWF4IG9uZSkgKi9cbiAgcHJpdmF0ZSBsaW5rUGF0aHMocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuIFtdO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZik7XG4gICAgY29uc3QgbmFtZXMgPSBmbSA/IGV4dHJhY3RMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgcmV0dXJuIG5hbWVzXG4gICAgICAubWFwKChuYW1lKSA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KG5hbWUsIHBhdGgpKVxuICAgICAgLmZpbHRlcigoeCk6IHggaXMgVEZpbGUgPT4gISF4KVxuICAgICAgLm1hcCgoeCkgPT4geC5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodGhlIHByZXZpb3VzIHNsaWRlIGluXG4gICAqIHRoZSBjaGFpbikuIFdpdGggbmV4dC1vbmx5IHNlbWFudGljcyB0aGlzIGJhY2t3YXJkIGxvb2t1cCBpcyB0aGUgb25seVxuICAgKiB3YXkgdG8gcmVhY2ggdGhlIGNoYWluIGhlYWQgZnJvbSBhIG1pZGRsZS9sYXN0IHNsaWRlLlxuICAgKi9cbiAgcHJpdmF0ZSBwcmV2T2YocGF0aDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAoZi5wYXRoID09PSBwYXRoKSBjb250aW51ZTtcbiAgICAgIGlmICh0aGlzLmxpbmtQYXRocyhmLnBhdGgpWzBdID09PSBwYXRoKSByZXR1cm4gZi5wYXRoO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIE5hbWVzIGluIHRoZSBgZGVja2AgcHJvcGVydHkgdGhhdCByZXNvbHZlIHRvIG5vIG5vdGUgKGJyb2tlbiBsaW5rcykgKi9cbiAgYnJva2VuKGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgY29uc3QgbmFtZXMgPSBmbSA/IGV4dHJhY3RMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgcmV0dXJuIG5hbWVzLmZpbHRlcigobmFtZSkgPT4gIXRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgZmlsZS5wYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiBydW4gZm9yIHRoZSBhY3RpdmUgbm90ZS4gRGVjayBzbGlkZXNcbiAgICogaW5zZXJ0L2FwcGVuZCBhZnRlciB0aGUgY3VycmVudCBub3RlLiAoUGxhaW4gbm90ZXMgYXJlIHJvdXRlZCB0b1xuICAgKiBwbGFuQ3JlYXRlTmV3IGJ5IHRoZSBjb21tYW5kIFx1MjAxNCB0aGlzIGNvcmUgc3RpbGwgaGFuZGxlcyB0aGVtIGFzXG4gICAqIFwibm8gdXNhYmxlIG5leHQgbGluayBcdTIxOTIgYXBwZW5kXCIuKVxuICAgKi9cbiAgcGxhbkNyZWF0ZU5leHQoZmlsZTogVEZpbGUpOiBDcmVhdGVOZXh0UmVzdWx0IHwgbnVsbCB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCByYXcgPSBmbSA/IGV4dHJhY3RSYXdMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuKHsgY3VycmVudE5hbWU6IGZpbGUuYmFzZW5hbWUsIGN1cnJlbnRMaW5rczogcmF3LCBleGlzdGluZ05hbWVzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYW4gYSBcIkNyZWF0ZSBOZXcgU2xpZGVcIiBydW46IGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIGluIHRoZVxuICAgKiBzYW1lIGZvbGRlciBhcyB0aGUgYWN0aXZlIG5vdGUsIHdoaWNoIGl0c2VsZiBzdGF5cyB1bnRvdWNoZWQuXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV3KCk6IENyZWF0ZU5leHRSZXN1bHQge1xuICAgIGNvbnN0IGV4aXN0aW5nTmFtZXMgPSBuZXcgU2V0KHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKS5tYXAoKGYpID0+IGYuYmFzZW5hbWUpKTtcbiAgICByZXR1cm4gcGxhbk5ldyh7IGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKiogQXBwbHkgYSBDcmVhdGUgTmV4dCBTbGlkZSBwbGFuOyBvcGVuPWZhbHNlIGtlZXBzIHRoZSBjdXJyZW50IG5vdGUgaW4gdGhlIGVkaXRvciAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV4dChmaWxlOiBURmlsZSwgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCwgb3BlbiA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmFwcGx5UGxhbihmaWxlLCBwbGFuLCBkaXJQcmVmaXgoZmlsZS5wYXJlbnQ/LnBhdGgpLCBvcGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhIENyZWF0ZSBOZXcgU2xpZGUgcGxhbi4gTGFuZHMgaW4gT2JzaWRpYW4ncyBkZWZhdWx0IG5ldy1ub3RlXG4gICAqIGxvY2F0aW9uIChTZXR0aW5ncyBcdTIxOTIgRmlsZXMgJiBsaW5rcyBcdTIxOTIgRGVmYXVsdCBsb2NhdGlvbiBmb3IgbmV3IG5vdGVzKTtcbiAgICogd2l0aCBcInNhbWUgZm9sZGVyIGFzIGN1cnJlbnRcIiBjb25maWd1cmVkIHRoYXQgaXMgdGhlIGFjdGl2ZSBub3RlJ3Mgb3duXG4gICAqIGZvbGRlci4gV29ya3Mgd2l0aCBubyBub3RlIG9wZW4gYXQgYWxsIChibGFuayB0YWIpLlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZUNyZWF0ZU5ldyhwbGFuOiBDcmVhdGVOZXh0UmVzdWx0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc291cmNlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gXCJcIjtcbiAgICBhd2FpdCB0aGlzLmFwcGx5UGxhbihcbiAgICAgIG51bGwsXG4gICAgICBwbGFuLFxuICAgICAgZGlyUHJlZml4KHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmdldE5ld0ZpbGVQYXJlbnQoc291cmNlUGF0aCk/LnBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogQXBwbHkgYSBwbGFuOiBjcmVhdGUgdGhlIG5vdGUsIHJld2lyZSBgZGVja2AgcHJvcGVydGllcywgb3B0aW9uYWxseSBvcGVuIGl0ICovXG4gIHByaXZhdGUgYXN5bmMgYXBwbHlQbGFuKFxuICAgIGZpbGU6IFRGaWxlIHwgbnVsbCxcbiAgICBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LFxuICAgIGRpcjogc3RyaW5nLFxuICAgIG9wZW4gPSB0cnVlLFxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBuZXdQYXRoID0gYCR7ZGlyfSR7cGxhbi5uZXdOYW1lfS5tZGA7XG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSBwbGFuLm5ld0RlY2tMaW5rcy5tYXAoKGxpbmspID0+IEpTT04uc3RyaW5naWZ5KGxpbmspKS5qb2luKFwiLCBcIik7XG4gICAgY29uc3QgY29udGVudCA9IGAtLS1cXG5kZWNrOiBbJHtmcm9udG1hdHRlcn1dXFxuLS0tXFxuYDtcblxuICAgIGxldCBuZXdGaWxlOiBURmlsZTtcbiAgICB0cnkge1xuICAgICAgbmV3RmlsZSA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShuZXdQYXRoLCBjb250ZW50KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IGNyZWF0ZSBcIiR7cGxhbi5uZXdOYW1lfS5tZFwiICgke1N0cmluZyhlcnJvcil9KWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJld2lyZSB0aGUgY3VycmVudCBub3RlJ3MgYGRlY2tgIChrZWVwcyBhbGwgb3RoZXIgcHJvcGVydGllcyBpbnRhY3QpXG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHBsYW4ucmV3cml0ZXMpIHtcbiAgICAgIGlmICghZmlsZSB8fCByZXdyaXRlLm5hbWUgIT09IGZpbGUuYmFzZW5hbWUpIGNvbnRpbnVlOyAvLyBpbiBwcmFjdGljZSBhbHdheXMgdGhlIGN1cnJlbnQgbm90ZVxuICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgICAgZm1bREVDS19LRVldID0gcmV3cml0ZS5kZWNrO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFvcGVuKSByZXR1cm47XG5cbiAgICAvLyBPcGVuIHRoZSBuZXcgbm90ZSBpbiB0aGUgY3VycmVudCBwYW5lLCBlZGl0IG1vZGUgKExpdmUgUHJldmlldylcbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUobmV3RmlsZSwgeyBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0gfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIHNsaWRlcyBvdXQgb2YgYW4gb3JkZXJlZCBkZWNrIGNoYWluOiBzcGxpY2UgdGhlIGNoYWluIGFyb3VuZFxuICAgKiBldmVyeSBkZWxldGVkIHJ1biAodGhlIHByZWRlY2Vzc29yJ3MgYGRlY2tgIHRha2VzIG92ZXIgdGhlIHJ1bidzIGZpcnN0XG4gICAqIHN1cnZpdm9yKSwgdGhlbiBtb3ZlIGVhY2ggZGVsZXRlZCBub3RlIHRvIHRoZSB0cmFzaC4gYGZvY3VzUGF0aGAgaXMgdGhlXG4gICAqIG5vdGUgdGhlIGVkaXRvciBjdXJyZW50bHkgc2hvd3MgXHUyMDE0IHdoZW4gaXQgaXMgYW1vbmcgdGhlIGRlbGV0ZWQsIHRoZVxuICAgKiByZXN1bHQgbmFtZXMgdGhlIG5lYXJlc3Qgc3Vydml2aW5nIG5laWdoYm91ciB0byBvcGVuIGluc3RlYWQuXG4gICAqL1xuICBhc3luYyBleGVjdXRlRGVsZXRlU2xpZGVzKFxuICAgIGNoYWluOiBzdHJpbmdbXSxcbiAgICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgICBmb2N1c1BhdGg6IHN0cmluZyB8IG51bGwsXG4gICk6IFByb21pc2U8RGVsZXRlU2xpZGVzUmVzdWx0PiB7XG4gICAgY29uc3QgcmV3cml0ZXMgPSBwbGFuRGVsZXRlU2xpZGVzKGNoYWluLCBkZWxldGVQYXRocyk7XG5cbiAgICBmb3IgKGNvbnN0IHJld3JpdGUgb2YgcmV3cml0ZXMpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmV3cml0ZS5wYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIGNvbnRpbnVlO1xuICAgICAgY29uc3QgbmV4dCA9IHJld3JpdGUubmV4dFBhdGggPyB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmV3cml0ZS5uZXh0UGF0aCkgOiBudWxsO1xuICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGYsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgICAgZm1bREVDS19LRVldID0gbmV4dCBpbnN0YW5jZW9mIFRGaWxlID8gW2BbWyR7bmV4dC5iYXNlbmFtZX1dXWBdIDogW107XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFzaGVkOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgcGF0aCBvZiBkZWxldGVQYXRocykge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIGNvbnRpbnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIudHJhc2hGaWxlKGYpO1xuICAgICAgICB0cmFzaGVkLnB1c2gocGF0aCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgZGVsZXRlIFwiJHtmLmJhc2VuYW1lfVwiICgke1N0cmluZyhlcnJvcil9KWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHRyYXNoZWQsIGxhbmRpbmdQYXRoOiBwaWNrTGFuZGluZ1BhdGgoY2hhaW4sIGRlbGV0ZVBhdGhzLCBmb2N1c1BhdGgpIH07XG4gIH1cbn1cblxuLyoqIEZvbGRlciBwYXRoIFx1MjE5MiB0cmFpbGluZy1zbGFzaCBwcmVmaXggKFwiXCIgZm9yIHZhdWx0IHJvb3QpICovXG5mdW5jdGlvbiBkaXJQcmVmaXgocGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFwYXRoIHx8IHBhdGggPT09IFwiL1wiKSByZXR1cm4gXCJcIjtcbiAgcmV0dXJuIGAke3BhdGgucmVwbGFjZSgvXFwvKyQvLCBcIlwiKX0vYDtcbn1cbiIsICIvKipcbiAqIGRlY2sudHMgXHUyMDE0IFB1cmUgZGVjay1yZXNvbHV0aW9uIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRXZlcnl0aGluZyBpbiB0aGlzIG1vZHVsZSBpcyBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0XG4gKiBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L2RlY2sudGVzdC50cykuIG1haW4udHMgYWRhcHRzIHRoZVxuICogdmF1bHQgKG1ldGFkYXRhQ2FjaGUpIHRvIHRoaXMgcHVyZSBpbnRlcmZhY2U6IGl0IHJlc29sdmVzIGBkZWNrYFxuICogcHJvcGVydGllcyB0byBub3RlIHBhdGhzLCB0aGVuIGhhbmRzIHRoZSBwYXRoIGdyYXBoIHRvIGNvbXB1dGVEZWNrKCkuXG4gKi9cblxuLyoqIEEgZGVjayBsaW5rIGxpc3QgaG9sZHMgYXQgbW9zdCBvbmUgZW50cnkgKHRoZSBuZXh0IHNsaWRlKSAqL1xuZXhwb3J0IGNvbnN0IE1BWF9ERUNLX0xJTktTID0gMTtcblxuLyoqIFJlc3VsdCBvZiByZXNvbHZpbmcgYSBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGEgZGVjayAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWNrSW5mbyB7XG4gIC8qKiBDaGFpbiBvZiBub3RlIHBhdGhzOiBbMF0gaXMgdGhlIGZpcnN0IHNsaWRlLCB0aGVuIHRoZSByZXN0IGluIG9yZGVyICovXG4gIGNoYWluOiBzdHJpbmdbXTtcbiAgLyoqIEluZGV4IG9mIHRoZSBjdXJyZW50IG5vdGUgaW5zaWRlIGNoYWluICovXG4gIGluZGV4OiBudW1iZXI7XG59XG5cbi8qKlxuICogUmVzb2x2ZSBhIG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2suXG4gKlxuICogdjEuMC4wIGNvbnZlbnRpb24gXHUyMDE0IG5leHQtb25seSwgbm8gb3ZlcnZpZXcgcGFnZTpcbiAqICAgLSBhIHNsaWRlJ3MgYGRlY2tgIHByb3BlcnR5IGhvbGRzIGF0IG1vc3QgT05FIGxpbms6IHRoZSBuZXh0IHNsaWRlXG4gKiAgICAgKHRoZSBsYXN0IHNsaWRlIGhhcyBubyBsaW5rIGF0IGFsbCk7XG4gKiAgIC0gYSBkZWNrIGlzIHNpbXBseSBhIGZvcndhcmQgbGluayBjaGFpbiBzdGFydGluZyBhdCBpdHMgaGVhZCBzbGlkZTtcbiAqICAgLSBhbnkgbm90ZSB0aGF0IGhvbGRzIGEgYGRlY2tgIHByb3BlcnR5IChldmVuIGVtcHR5KSBpcyBhIGRlY2sgbWVtYmVyLFxuICogICAgIHNvIGEgc2luZ2xlIGZyZXNobHkgY3JlYXRlZCBzbGlkZSBhbHJlYWR5IGNvdW50cyBhcyBhIG9uZS1wYWdlIGRlY2suXG4gKlxuICogQmVjYXVzZSBzbGlkZXMgbm8gbG9uZ2VyIGxpbmsgYmFjayB0byBhIGhlYWQgbm90ZSwgdGhlIGNoYWluIGhlYWQgaXNcbiAqIGxvY2F0ZWQgYnkgd2Fsa2luZyBiYWNrd2FyZDogYGdldFByZXYocGF0aClgIHJldHVybnMgdGhlIG5vdGUgd2hvc2VcbiAqIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh1bmRlZmluZWQgd2hlbiBub25lKS5cbiAqXG4gKiBgZ2V0TGlua3MocGF0aClgIG11c3QgcmV0dXJuIHRoZSByZXNvbHZlZCBub3RlIHBhdGhzIG9mIHRoZSBgZGVja2BcbiAqIHByb3BlcnR5IG9mIHRoZSBub3RlIGF0IGBwYXRoYCAoZW1wdHkgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSwgb3IgaXRzXG4gKiBsaW5rIGlzIGJyb2tlbiBcdTIwMTQgYSBicm9rZW4gbGluayBzaW1wbHkgZW5kcyB0aGUgY2hhaW4sIG5ldmVyIGNyYXNoZXMpLlxuICpcbiAqIFJldHVybnMgdGhlIGZ1bGwgY2hhaW4gYW5kIHRoZSBjdXJyZW50IG5vdGUncyBpbmRleCwgb3IgbnVsbCB3aGVuIHRoZVxuICogbm90ZSBpcyBub3QgcGFydCBvZiBhbnkgZGVjayAobm8gYGRlY2tgIHByb3BlcnR5IGFuZCBub2JvZHkgbGlua3MgdG8gaXQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZURlY2soXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmcsXG4gIGdldExpbmtzOiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmdbXSxcbiAgZ2V0UHJldjogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nIHwgdW5kZWZpbmVkLFxuKTogRGVja0luZm8gfCBudWxsIHtcbiAgLy8gV2FsayBiYWNrd2FyZCB0byB0aGUgY2hhaW4gaGVhZCAoY3ljbGUtZ3VhcmRlZCkuIEEgbG9uZSBub2RlIChubyBvd25cbiAgLy8gbGluaywgbm8gcHJlZGVjZXNzb3IpIHJlc29sdmVzIGFzIGEgb25lLXBhZ2UgY2hhaW4gXHUyMDE0IHdoZXRoZXIgaXQgY291bnRzXG4gIC8vIGFzIGEgZGVjayBtZW1iZXIgYXQgYWxsIGlzIGRlY2lkZWQgYnkgdGhlIGFkYXB0ZXIgKHRoZSBgZGVja2Aga2V5KS5cbiAgY29uc3QgYmFja1Zpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oW2N1cnJlbnRQYXRoXSk7XG4gIGxldCBoZWFkID0gY3VycmVudFBhdGg7XG4gIGZvciAoOzspIHtcbiAgICBjb25zdCBwcmV2ID0gZ2V0UHJldihoZWFkKTtcbiAgICBpZiAoIXByZXYgfHwgYmFja1Zpc2l0ZWQuaGFzKHByZXYpKSBicmVhaztcbiAgICBiYWNrVmlzaXRlZC5hZGQocHJldik7XG4gICAgaGVhZCA9IHByZXY7XG4gIH1cblxuICAvLyBXYWxrIGZvcndhcmQgZnJvbSB0aGUgaGVhZCAoY3ljbGUtZ3VhcmRlZCkuXG4gIGNvbnN0IGNoYWluOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB2aXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGxldCBjdXI6IHN0cmluZyB8IHVuZGVmaW5lZCA9IGhlYWQ7XG4gIHdoaWxlIChjdXIgJiYgIXZpc2l0ZWQuaGFzKGN1cikpIHtcbiAgICB2aXNpdGVkLmFkZChjdXIpO1xuICAgIGNoYWluLnB1c2goY3VyKTtcbiAgICBjdXIgPSBnZXRMaW5rcyhjdXIpWzBdO1xuICB9XG5cbiAgY29uc3QgaW5kZXggPSBjaGFpbi5pbmRleE9mKGN1cnJlbnRQYXRoKTtcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7IGNoYWluLCBpbmRleCB9O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgbm90ZSBuYW1lcyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlLlxuICogQWNjZXB0cyBhIHNpbmdsZSBzdHJpbmcgb3IgYSBZQU1MIGxpc3Qgb2Ygc3RyaW5nczsgdW5xdW90ZWQgW1t4XV0gdmFsdWVzXG4gKiBhcmUgcGFyc2VkIGJ5IFlBTUwgYXMgbmVzdGVkIGFycmF5cyBhbmQgZmxhdHRlbmVkIGhlcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0TGlua3ModmFsdWU6IHVua25vd24sIG1heDogbnVtYmVyID0gTUFYX0RFQ0tfTElOS1MpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGZsYXQ6IHVua25vd25bXSA9IFtdO1xuICBjb25zdCBjb2xsZWN0ID0gKHY6IHVua25vd24pOiB2b2lkID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHYpIGNvbGxlY3QoaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsYXQucHVzaCh2KTtcbiAgICB9XG4gIH07XG4gIGNvbGxlY3QodmFsdWUpO1xuXG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGZsYXQpIHtcbiAgICBjb25zdCBuYW1lID0gZXh0cmFjdExpbmtUZXh0KGl0ZW0pO1xuICAgIGlmIChuYW1lKSBvdXQucHVzaChuYW1lKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB1cCB0byBgbWF4YCByYXcgbGluayBzdHJpbmdzIGZyb20gYSBgZGVja2AgcHJvcGVydHkgdmFsdWUgXHUyMDE0IHRoZVxuICogdHJpbW1lZCB2YWx1ZXMgZXhhY3RseSBhcyB3cml0dGVuIChhbGlhcyAvIHBhdGggZm9ybXMgcHJlc2VydmVkKS4gU2FtZVxuICogZmxhdHRlbmluZyBydWxlcyBhcyBleHRyYWN0TGlua3MoKSwgYnV0IHdpdGhvdXQgZXh0cmFjdGluZyB0aGUgdGFyZ2V0IG5hbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UmF3TGlua3ModmFsdWU6IHVua25vd24sIG1heDogbnVtYmVyID0gTUFYX0RFQ0tfTElOS1MpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGZsYXQ6IHVua25vd25bXSA9IFtdO1xuICBjb25zdCBjb2xsZWN0ID0gKHY6IHVua25vd24pOiB2b2lkID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHYpIGNvbGxlY3QoaXRlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsYXQucHVzaCh2KTtcbiAgICB9XG4gIH07XG4gIGNvbGxlY3QodmFsdWUpO1xuXG4gIGNvbnN0IG91dDogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGZsYXQpIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09IFwic3RyaW5nXCIpIGNvbnRpbnVlO1xuICAgIGNvbnN0IHRyaW1tZWQgPSBpdGVtLnRyaW0oKTtcbiAgICBpZiAoIXRyaW1tZWQpIGNvbnRpbnVlO1xuICAgIG91dC5wdXNoKHRyaW1tZWQpO1xuICAgIGlmIChvdXQubGVuZ3RoID49IG1heCkgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHRoZSB0YXJnZXQgbm90ZSBuYW1lIGZyb20gYSBtYXJrZG93biBsaW5rIHN0cmluZy5cbiAqIEhhbmRsZXMgc2V2ZXJhbCBzaGFwZXM6XG4gKiAgIFwiW1tzbGlkZS0yXV1cIiAgICAgICAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTJ8YWxpYXNdXVwiICBcdTIxOTIgc2xpZGUtMlxuICogICBcIltbc2xpZGUtMiNzZWN0aW9uXV1cIlx1MjE5MiBzbGlkZS0yXG4gKiAgIHNsaWRlLTIgICAgICAgICAgICAgIFx1MjE5MiBzbGlkZS0yIChiYXJlIGZpbGVuYW1lKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtUZXh0KHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHJldHVybiBudWxsO1xuICBjb25zdCB0cmltbWVkID0gdmFsdWUudHJpbSgpO1xuICBpZiAoIXRyaW1tZWQpIHJldHVybiBudWxsO1xuICByZXR1cm4gdHJpbW1lZC5yZXBsYWNlKC9eXFxbXFxbLywgXCJcIikucmVwbGFjZSgvXFxdXFxdJC8sIFwiXCIpLnNwbGl0KFwifFwiKVswXS5zcGxpdChcIiNcIilbMF0udHJpbSgpO1xufVxuXG4vKiogUmVuZGVyIGEgcHJvcGVydHkgdmFsdWUgYXMgcmVhZGFibGUgdGV4dDogYXJyYXlzL29iamVjdHMgXHUyMTkyIEpTT04sIGVsc2UgU3RyaW5nICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VmFsdWUodmFsdWU6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXHUyMDE0XCI7XG4gIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgPz8gXCJcdTIwMTRcIjtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBjaXJjdWxhciAvIHVuLXN0cmluZ2lmaWFibGUgc3RydWN0dXJlIFx1MjAxNCBub3QgZXhwZWN0ZWQgZnJvbSBmcm9udG1hdHRlclxuICAgICAgICByZXR1cm4gXCJcdTIwMTRcIjtcbiAgICAgIH1cbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gc3ltYm9sIC8gZnVuY3Rpb24gXHUyMDE0IG5vdCBleHBlY3RlZCBmcm9tIGZyb250bWF0dGVyXG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlO1xuICB9XG59XG4iLCAiLyoqXG4gKiBjcmVhdGVOZXh0LnRzIFx1MjAxNCBQdXJlIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiAvIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHBsYW5uaW5nXG4gKiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9jcmVhdGVOZXh0LnRlc3QudHMpLiBtYWluLnRzIGFkYXB0c1xuICogdGhlIHZhdWx0IChtZXRhZGF0YUNhY2hlLCBjb21wdXRlRGVjaykgdG8gdGhpcyBwdXJlIGludGVyZmFjZSBhbmQgYXBwbGllc1xuICogdGhlIHJlc3VsdGluZyBwbGFuIHdpdGggdmF1bHQuY3JlYXRlKCkgKyBmaWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoKS5cbiAqXG4gKiB2MS4wLjAgY29udmVudGlvbiBcdTIwMTQgbmV4dC1vbmx5LCBubyBvdmVydmlldyBwYWdlOiBhIHNsaWRlJ3MgYGRlY2tgXG4gKiBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rIChpdHMgbmV4dCBzbGlkZSkuIHBsYW5DcmVhdGVOZXh0IGRlY2lkZXMsXG4gKiBmb3IgdGhlIGN1cnJlbnQgZGVjayBub3RlOlxuICogICAtIHRoZSBuYW1lIG9mIHRoZSBuZXcgc2xpZGUgZmlsZSAoY29sbGlzaW9uLWF3YXJlKSxcbiAqICAgLSB0aGUgcmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBuZXcgbm90ZSxcbiAqICAgLSB0aGUgcmV3cml0ZXMgbmVlZGVkIG9uIGV4aXN0aW5nIG5vdGVzIChpbiBwcmFjdGljZSBhbHdheXMgdGhlXG4gKiAgICAgY3VycmVudCBub3RlKS5cbiAqIHBsYW5DcmVhdGVOZXcgcGxhbnMgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgKGEgZnJlc2ggbm90ZSB0aGF0IGlzXG4gKiBub3QgcGFydCBvZiBhbnkgZGVjayB5ZXQgXHUyMDE0IGBkZWNrOiBbXWAsIG5vIHJld3JpdGVzIGFueXdoZXJlKS5cbiAqL1xuXG5pbXBvcnQgeyBleHRyYWN0TGlua1RleHQgfSBmcm9tIFwiLi9kZWNrXCI7XG5cbi8qKiBJbnB1dHMgZm9yIHBsYW5uaW5nIFx1MjAxNCByZXNvbHZlZCBieSB0aGUgYWRhcHRlciBpbiBtYWluLnRzICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRJbnB1dCB7XG4gIC8qKiBCYXNlbmFtZSAod2l0aG91dCBleHRlbnNpb24pIG9mIHRoZSBjdXJyZW50IG5vdGUgKi9cbiAgY3VycmVudE5hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgY3VycmVudCBub3RlIChleHRyYWN0ZWQsIGF0IG1vc3Qgb25lKSAqL1xuICBjdXJyZW50TGlua3M6IHN0cmluZ1tdO1xuICAvKiogQmFzZW5hbWVzIG9mIGV2ZXJ5IG1hcmtkb3duIG5vdGUgaW4gdGhlIHZhdWx0IChjb2xsaXNpb24tZnJlZSBuYW1pbmcpICovXG4gIGV4aXN0aW5nTmFtZXM6IFNldDxzdHJpbmc+O1xufVxuXG4vKiogT25lIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tSZXdyaXRlIHtcbiAgLyoqIEJhc2VuYW1lIG9mIHRoZSBub3RlIHRvIHJld3JpdGUgKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogVGhlIG5ldyByYXcgYGRlY2tgIGxpbmsgdGV4dHMgKHNlcmlhbGl6ZWQgYXMgYSBZQU1MIGxpc3QpICovXG4gIGRlY2s6IHN0cmluZ1tdO1xufVxuXG4vKiogVGhlIGZ1bGwgcGxhbiBmb3IgY3JlYXRpbmcgb25lIG5ldyBzbGlkZSAqL1xuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVOZXh0UmVzdWx0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIG5ldyBzbGlkZSBmaWxlICovXG4gIG5ld05hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBmb3IgdGhlIG5ldyBub3RlJ3MgZnJvbnRtYXR0ZXIgKi9cbiAgbmV3RGVja0xpbmtzOiBzdHJpbmdbXTtcbiAgLyoqIFJld3JpdGVzIHRvIGFwcGx5IHRvIGV4aXN0aW5nIG5vdGVzIChpbiBwcmFjdGljZSBhbHdheXMgdGhlIGN1cnJlbnQgbm90ZSkgKi9cbiAgcmV3cml0ZXM6IERlY2tSZXdyaXRlW107XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBuZXcgc2xpZGUgYWZ0ZXIgdGhlIGN1cnJlbnQgbm90ZS5cbiAqXG4gKiBCZWhhdmlvcnM6XG4gKiAgIC0gTm8gbmV4dCBsaW5rIChsYXN0IHNsaWRlLCBmcmVzaCBkZWNrIGhlYWQsIG9yIGEgcGxhaW4gbm90ZSBzdGFydGluZ1xuICogICAgIGEgYnJhbmQtbmV3IGRlY2spOiBhcHBlbmQgYDxjdXJyZW50Pi1uZXh0YCBhcyB0aGUgbmV3IGxhc3Qgc2xpZGU7IHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCBnYWlucyB0aGUgbGluayB0byBpdC5cbiAqICAgLSBWYWxpZCBuZXh0IGxpbms6IGluc2VydCBgPGN1cnJlbnQ+LW5leHRgIGJldHdlZW4gdGhlIGN1cnJlbnQgbm90ZSBhbmRcbiAqICAgICBpdHMgbmV4dDsgdGhlIG5ldyBub3RlIHRha2VzIG92ZXIgdGhlIG9sZCBuZXh0IGxpbmsuXG4gKiAgIC0gQnJva2VuIG5leHQgbGluayAocGxhaW4sIG5vbi1leGlzdGluZyBuYW1lKTogY3JlYXRlIGV4YWN0bHkgdGhlXG4gKiAgICAgZGVjbGFyZWQgbWlzc2luZyBub3RlIGFzIHRoZSBuZXcgbmV4dCBzbGlkZSBcdTIwMTQgdGhlIFx1MjZBMCB3YXJuaW5nXG4gKiAgICAgZGlzYXBwZWFycyBhbmQgdGhlIGF1dGhvcidzIGludGVudCBpcyBob25vdXJlZC4gQSBicm9rZW4gbGluayB0aGF0IGlzXG4gKiAgICAgbm90IGEgcGxhaW4gYmFzZW5hbWUgKHBhdGgtcXVhbGlmaWVkLCBzZWxmLXJlZmVyZW5jaW5nKSBpcyB0cmVhdGVkIGFzXG4gKiAgICAgaW52YWxpZCBhbmQgZHJvcHBlZCAoYXBwZW5kIGEgYDxjdXJyZW50Pi1uZXh0YCBsYXN0IHNsaWRlIGluc3RlYWQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5leHQoaW5wdXQ6IENyZWF0ZU5leHRJbnB1dCk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgY29uc3QgeyBjdXJyZW50TmFtZSwgY3VycmVudExpbmtzIH0gPSBpbnB1dDtcbiAgY29uc3QgbmV4dExpbmsgPSBjdXJyZW50TGlua3NbMF07XG5cbiAgaWYgKG5leHRMaW5rKSB7XG4gICAgY29uc3QgbmV4dE5hbWUgPSBleHRyYWN0TGlua1RleHQobmV4dExpbmspO1xuICAgIGlmIChuZXh0TmFtZSAmJiBpc1BsYWluTmFtZShuZXh0TmFtZSkgJiYgbmV4dE5hbWUgIT09IGN1cnJlbnROYW1lKSB7XG4gICAgICBpZiAoIWlucHV0LmV4aXN0aW5nTmFtZXMuaGFzKG5leHROYW1lKSkge1xuICAgICAgICAvLyBUaGUgZGVjbGFyZWQgbmV4dCBub3RlIGRvZXMgbm90IGV4aXN0IHlldCBcdTIxOTIgY3JlYXRlIGV4YWN0bHkgdGhhdFxuICAgICAgICAvLyBub3RlIChmaXhlcyB0aGUgYnJva2VuLWxpbmsgd2FybmluZywgaG9ub3VycyB0aGUgYXV0aG9yJ3MgaW50ZW50KS5cbiAgICAgICAgcmV0dXJuIHsgbmV3TmFtZTogbmV4dE5hbWUsIG5ld0RlY2tMaW5rczogW10sIHJld3JpdGVzOiBbXSB9O1xuICAgICAgfVxuICAgICAgLy8gQSB2YWxpZCBuZXh0IG5vdGUgZXhpc3RzIFx1MjE5MiBpbnNlcnQgYmV0d2VlbiBpdCBhbmQgdGhlIGN1cnJlbnQgbm90ZS5cbiAgICAgIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXdOYW1lLFxuICAgICAgICBuZXdEZWNrTGlua3M6IFtuZXh0TGlua10sXG4gICAgICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gSW52YWxpZCAocGF0aC1xdWFsaWZpZWQgLyBzZWxmLXJlZmVyZW5jaW5nKSBuZXh0IGxpbmsgXHUyMTkyIGRyb3AgaXQgYW5kXG4gICAgLy8gYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgKGZhbGwgdGhyb3VnaCB0byB0aGUgbm8tbmV4dCBicmFuY2gpLlxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE5vICh1c2FibGUpIG5leHQgbGluayBcdTIxOTIgYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICB9O1xufVxuXG4vKipcbiAqIFBsYW4gdGhlIGNyZWF0aW9uIG9mIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlLlxuICpcbiAqIFRoZSBuZXcgbm90ZSBzdGFydHMgYXMgYSBzaW5nbGUtc2xpZGUgZGVjayAoYGRlY2s6IFtdYCkgYW5kIG5vdGhpbmcgZWxzZVxuICogaXMgdG91Y2hlZCBcdTIwMTQgdGhlIG5vdGUgaXQgd2FzIGxhdW5jaGVkIGZyb20gc3RheXMgYXMtaXMuIExhdGVyIHBhZ2VzIGFyZVxuICogYWRkZWQgd2l0aCBDcmVhdGUgTmV4dCBTbGlkZSBmcm9tIGluc2lkZSB0aGUgZGVjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5DcmVhdGVOZXcoaW5wdXQ6IHsgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz4gfSk6IENyZWF0ZU5leHRSZXN1bHQge1xuICByZXR1cm4ge1xuICAgIG5ld05hbWU6IHVuaXF1ZU5hbWUoXCJ1bnRpdGxlZC1zbGlkZXNcIiwgaW5wdXQuZXhpc3RpbmdOYW1lcyksXG4gICAgbmV3RGVja0xpbmtzOiBbXSxcbiAgICByZXdyaXRlczogW10sXG4gIH07XG59XG5cbi8qKiBBIG5hbWUgdXNhYmxlIGFzIGEgdmF1bHQgbm90ZSBuYW1lOiBubyBwYXRoIHNlcGFyYXRvcnMsIG5vbi1lbXB0eSAqL1xuZnVuY3Rpb24gaXNQbGFpbk5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBuYW1lLmxlbmd0aCA+IDAgJiYgIW5hbWUuaW5jbHVkZXMoXCIvXCIpICYmICFuYW1lLmluY2x1ZGVzKFwiXFxcXFwiKTtcbn1cblxuLyoqIEZpcnN0IGZyZWUgbmFtZSBpbiB0aGUgZmFtaWx5IGBiYXNlYCwgYGJhc2UtMmAsIGBiYXNlLTNgLCBcdTIwMjYgKi9cbmZ1bmN0aW9uIHVuaXF1ZU5hbWUoYmFzZTogc3RyaW5nLCBleGlzdGluZzogU2V0PHN0cmluZz4pOiBzdHJpbmcge1xuICBpZiAoIWV4aXN0aW5nLmhhcyhiYXNlKSkgcmV0dXJuIGJhc2U7XG4gIGZvciAobGV0IGkgPSAyOyA7IGkrKykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2Jhc2V9LSR7aX1gO1xuICAgIGlmICghZXhpc3RpbmcuaGFzKGNhbmRpZGF0ZSkpIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGRlbGV0ZVNsaWRlcy50cyBcdTIwMTQgUHVyZSBcIkRlbGV0ZSBzbGlkZXNcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXQgY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5XG4gKiAoc2VlIHRlc3QvZGVsZXRlU2xpZGVzLnRlc3QudHMpLiBUaGUgYWRhcHRlciBpbiBkZWNrLXNlcnZpY2UudHMgYXBwbGllc1xuICogdGhlIHBsYW46IGl0IHJld3JpdGVzIHRoZSBzdXJ2aXZpbmcgbm90ZXMnIGBkZWNrYCBwcm9wZXJ0aWVzLCB0aGVuIG1vdmVzXG4gKiB0aGUgZGVsZXRlZCBub3RlcyB0byB0aGUgdHJhc2guXG4gKlxuICogRGVsZXRpb24gc3BsaWNlcyB0aGUgY2hhaW4gaW5zdGVhZCBvZiBicmVha2luZyBpdDogZXZlcnkgbWF4aW1hbCBydW4gb2ZcbiAqIGRlbGV0ZWQgc2xpZGVzIGJldHdlZW4gdHdvIHN1cnZpdm9ycyBBIFx1MjE5MiBcdTIwMjYgXHUyMTkyIEIgaXMgcmVwYWlyZWQgYnkgcG9pbnRpbmdcbiAqIEEncyBgZGVja2AgbGluayBhdCBCIChgW11gIHdoZW4gdGhlIHJ1biByZWFjaGVzIHRoZSBlbmQgb2YgdGhlIGNoYWluKS5cbiAqIFdoZW4gYSBydW4gc3RhcnRzIGF0IHRoZSBjaGFpbiBoZWFkLCB0aGUgZmlyc3Qgc3Vydml2b3IgYmVjb21lcyB0aGUgbmV3XG4gKiBoZWFkIGFuZCBuZWVkcyBubyByZXdyaXRlIGF0IGFsbCAoaXRzIG93biBgZGVja2AgYWxyZWFkeSBwb2ludHMgb253YXJkKS5cbiAqL1xuXG4vKiogT25lIHN1cnZpdmluZyBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBtdXN0IGJlIHJld3JpdHRlbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVSZXdyaXRlIHtcbiAgLyoqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBwYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBWYXVsdCBwYXRoIG9mIHRoZSBub3RlIHRoYXQgc2hvdWxkIGJlY29tZSB0aGlzIG5vdGUncyBuZXh0IHNsaWRlLFxuICAgKiBvciBudWxsIHdoZW4gdGhlIG5vdGUgYmVjb21lcyB0aGUgbmV3IGxhc3Qgc2xpZGUgKGBkZWNrOiBbXWApLlxuICAgKi9cbiAgbmV4dFBhdGg6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKlxuICogUGxhbiB0aGUgZGVsZXRpb24gb2Ygc2xpZGVzIGZyb20gYW4gb3JkZXJlZCBkZWNrIGNoYWluLlxuICpcbiAqIGBjaGFpbmAgaXMgdGhlIGZ1bGwgc2xpZGUgb3JkZXIgKFswXSA9IGhlYWQpLiBPbmx5IHBhdGhzIHByZXNlbnQgaW4gdGhlXG4gKiBjaGFpbiBhcmUgY29uc2lkZXJlZDsgYW55dGhpbmcgZWxzZSBpbiBgZGVsZXRlUGF0aHNgIGlzIGlnbm9yZWQuIFJldHVybnNcbiAqIG9uZSByZXdyaXRlIHBlciBzdXJ2aXZpbmcgbm90ZSB0aGF0IGRpcmVjdGx5IHByZWNlZGVkIGEgZGVsZXRlZCBydW4sXG4gKiBvcmRlcmVkIGJ5IGNoYWluIHBvc2l0aW9uLiBEZWxldGluZyBub3RoaW5nIHlpZWxkcyBubyByZXdyaXRlczsgZGVsZXRpbmdcbiAqIGV2ZXJ5dGhpbmcgeWllbGRzIG5vIHJld3JpdGVzIGVpdGhlciAobm8gc3Vydml2b3JzIGxlZnQgdG8gcmVwYWlyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5EZWxldGVTbGlkZXMoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4pOiBEZWxldGVSZXdyaXRlW10ge1xuICBjb25zdCByZXdyaXRlczogRGVsZXRlUmV3cml0ZVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXRoID0gY2hhaW5baV07XG4gICAgaWYgKCFwYXRoIHx8IGRlbGV0ZVBhdGhzLmhhcyhwYXRoKSkgY29udGludWU7XG4gICAgLy8gRmluZCB0aGUgZmlyc3Qgc3Vydml2b3IgYWZ0ZXIgdGhpcyBub3RlJ3MgcG9zaXRpb24uXG4gICAgbGV0IGogPSBpICsgMTtcbiAgICB3aGlsZSAoaiA8IGNoYWluLmxlbmd0aCAmJiBkZWxldGVQYXRocy5oYXMoY2hhaW5bal0pKSBqKys7XG4gICAgY29uc3QgbmV4dFBhdGggPSBqIDwgY2hhaW4ubGVuZ3RoID8gY2hhaW5bal0gOiBudWxsO1xuICAgIGNvbnN0IGNoYW5nZWQgPSBuZXh0UGF0aCAhPT0gKGNoYWluW2kgKyAxXSA/PyBudWxsKTtcbiAgICBpZiAoY2hhbmdlZCkgcmV3cml0ZXMucHVzaCh7IHBhdGgsIG5leHRQYXRoIH0pO1xuICB9XG4gIHJldHVybiByZXdyaXRlcztcbn1cblxuLyoqXG4gKiBQaWNrIHdoZXJlIHRoZSBlZGl0b3Igc2hvdWxkIGxhbmQgYWZ0ZXIgZGVsZXRpbmcgc2xpZGVzOiB0aGUgbmVhcmVzdFxuICogc3Vydml2b3Igb2YgYGRlbGV0ZWRQYXRoc2AnIG5laWdoYm91cmhvb2QgYXJvdW5kIGBmb2N1c1BhdGhgIFx1MjAxNCBwcmVmZXJcbiAqIHRoZSBjbG9zZXN0IHN1cnZpdm9yIGFmdGVyIGl0LCBlbHNlIHRoZSBjbG9zZXN0IGJlZm9yZSBpdC4gUmV0dXJucyBudWxsXG4gKiB3aGVuIGBmb2N1c1BhdGhgIHN1cnZpdmVzIG9yIG5vdGhpbmcgbmVhcmJ5IHJlbWFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrTGFuZGluZ1BhdGgoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIWZvY3VzUGF0aCB8fCAhZGVsZXRlUGF0aHMuaGFzKGZvY3VzUGF0aCkpIHJldHVybiBudWxsO1xuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoZm9jdXNQYXRoKTtcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG4gIGZvciAobGV0IGkgPSBpbmRleCArIDE7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGlmICghZGVsZXRlUGF0aHMuaGFzKGNoYWluW2ldKSkgcmV0dXJuIGNoYWluW2ldO1xuICB9XG4gIGZvciAobGV0IGkgPSBpbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIE1lbnUsIFRGaWxlLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IENvbmZpcm1EZWxldGVNb2RhbCB9IGZyb20gXCIuL2NvbmZpcm0tZGVsZXRlXCI7XG5cbi8qKiBWaWV3IHR5cGUgaWQgb2YgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsICovXG5leHBvcnQgY29uc3QgU0xJREVTX1BBTkVMX1ZJRVcgPSBcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIjtcblxuLyoqXG4gKiBTaWRlYmFyIHBhbmVsIGxpc3RpbmcgZXZlcnkgc2xpZGUgb2YgdGhlIGFjdGl2ZSBub3RlJ3MgZGVjayAobmV4dC1vbmx5XG4gKiBjaGFpbiBvcmRlcikuIFRha2VzIG92ZXIgdGhlIGFnZ3JlZ2F0aW9uL2VudHJ5IHJvbGUgdGhlIG92ZXJ2aWV3IHBhZ2VcbiAqIHVzZWQgdG8gcGxheSBiZWZvcmUgdjEuMC4wLlxuICpcbiAqIEludGVyYWN0aW9uOlxuICogICAtIGNsaWNrICAgICAgICAgICAgXHUyMTkyIG9wZW4gdGhhdCBzbGlkZSAoYW5kIGNsZWFyIGFueSBzZWxlY3Rpb24pXG4gKiAgIC0gTW9kK2NsaWNrICAgICAgICBcdTIxOTIgdG9nZ2xlIHRoZSBpdGVtIGluIHRoZSBzZWxlY3Rpb25cbiAqICAgLSBTaGlmdCtjbGljayAgICAgIFx1MjE5MiBleHRlbmQgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBsYXN0IGFuY2hvclxuICogICAtIHJpZ2h0LWNsaWNrICAgICAgXHUyMTkyIGNvbnRleHQgbWVudTogQ3JlYXRlIG5leHQgc2xpZGUgLyBEZWxldGUgc2xpZGUocylcbiAqL1xuZXhwb3J0IGNsYXNzIFNsaWRlc1BhbmVsVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgLyoqIENoYWluIHNpZ25hdHVyZSBvZiB0aGUgY3VycmVudGx5IHJlbmRlcmVkIGxpc3QgKi9cbiAgcHJpdmF0ZSBsYXN0Q2hhaW46IHN0cmluZ1tdID0gW107XG4gIC8qKiBSZW5kZXJlZCBpdGVtIGVsZW1lbnRzLCBpbmRleC1hbGlnbmVkIHdpdGggbGFzdENoYWluICovXG4gIHByaXZhdGUgaXRlbXM6IHsgcGF0aDogc3RyaW5nOyBlbDogSFRNTEVsZW1lbnQgfVtdID0gW107XG4gIC8qKiBDdXJyZW50bHkgc2VsZWN0ZWQgc2xpZGUgcGF0aHMgKG11bHRpLXNlbGVjdCBmb3IgRGVsZXRlKSAqL1xuICBwcml2YXRlIHNlbGVjdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIC8qKiBTZWxlY3Rpb24gYW5jaG9yIGZvciBTaGlmdCtjbGljayByYW5nZSBleHRlbnNpb24gKi9cbiAgcHJpdmF0ZSBhbmNob3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4sXG4gICAgbGVhZjogV29ya3NwYWNlTGVhZixcbiAgKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBTTElERVNfUEFORUxfVklFVztcbiAgfVxuXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiU2xpZGVzXCI7XG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwicHJlc2VudGF0aW9uXCI7XG4gIH1cblxuICBhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5hZGRDbGFzcyhcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIik7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9uKFwiY2hhbmdlZFwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhc3luYyBvbkNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IFtdO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bmMgdGhlIGxpc3Qgd2l0aCB0aGUgYWN0aXZlIG5vdGUncyBkZWNrLiBJbmNyZW1lbnRhbCBvbiBwdXJwb3NlOiB0aGVcbiAgICogcmVmcmVzaCBldmVudHMgYWxzbyBmaXJlIHdoaWxlIGEgY2xpY2sgb24gYW4gZW50cnkgaXMgaW4gZmxpZ2h0ICh0aGVcbiAgICogbW91c2Vkb3duIGFjdGl2YXRlcyB0aGlzIGxlYWYpLCBhbmQgcmVidWlsZGluZyB0aGUgRE9NIG1pZC1nZXN0dXJlXG4gICAqIGRlc3Ryb3lzIHRoZSBjbGljayB0YXJnZXQgXHUyMDE0IHdoaWNoIG1hZGUgb3BlbmluZyBhIHNsaWRlIHRha2UgdHdvIGNsaWNrc1xuICAgKiB3aGVuZXZlciB0aGUgcGFuZWwgd2FzIG5vdCB0aGUgYWN0aXZlIGxlYWYuIFVuY2hhbmdlZCBjaGFpbnMgb25seSBnZXRcbiAgICogdGhlaXIgaGlnaGxpZ2h0IHVwZGF0ZWQsIHNvIGl0ZW0gZWxlbWVudHMgYWx3YXlzIHN1cnZpdmUuXG4gICAqL1xuICBwcml2YXRlIHJlbmRlcigpOiB2b2lkIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBkZWNrID0gZmlsZSA/IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSkgOiBudWxsO1xuICAgIGNvbnN0IGNoYWluID0gZGVja1xuICAgICAgPyBkZWNrLmNoYWluLmZpbHRlcigocCkgPT4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHApIGluc3RhbmNlb2YgVEZpbGUpXG4gICAgICA6IFtdO1xuXG4gICAgLy8gRHJvcCBzZWxlY3Rpb25zIHdob3NlIG5vdGUgdmFuaXNoZWQgZnJvbSB0aGUgY2hhaW4gbWVhbndoaWxlXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQuc2l6ZSA+IDApIHtcbiAgICAgIGNvbnN0IGxpdmUgPSBuZXcgU2V0KGNoYWluKTtcbiAgICAgIGZvciAoY29uc3QgcGF0aCBvZiB0aGlzLnNlbGVjdGVkKSBpZiAoIWxpdmUuaGFzKHBhdGgpKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShwYXRoKTtcbiAgICB9XG4gICAgLy8gQSBkZWFkIGFuY2hvciBtdXN0IG5vdCBzaWxlbnRseSB0dXJuIGEgU2hpZnQrY2xpY2sgaW50byBhIHRvZ2dsZVxuICAgIGlmICh0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiAhY2hhaW4uaW5jbHVkZXModGhpcy5hbmNob3IpKSB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAoIWNoYWluRXF1YWxzKHRoaXMubGFzdENoYWluLCBjaGFpbikpIHtcbiAgICAgIHRoaXMucmVidWlsZChjaGFpbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5pdGVtcykgaXQuZWwuY2xhc3NMaXN0LnRvZ2dsZShcImlzLWFjdGl2ZVwiLCBpdC5wYXRoID09PSBmaWxlPy5wYXRoKTtcbiAgICB9XG4gICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIEZ1bGwgcmVidWlsZCAoY2hhaW4gc2hhcGUgY2hhbmdlZCkgKi9cbiAgcHJpdmF0ZSByZWJ1aWxkKGNoYWluOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRhaW5lckVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5sYXN0Q2hhaW4gPSBjaGFpbjtcblxuICAgIGlmIChjaGFpbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1lbXB0eVwiIH0pO1xuICAgICAgZW1wdHkuc2V0VGV4dChcbiAgICAgICAgXCJObyBzbGlkZXMgZGVjayBcdTIwMTQgb3BlbiBhIGRlY2sgbm90ZSwgb3IgcnVuIGNyZWF0ZSBuZXh0IHNsaWRlIG9uIGFueSBub3RlIHRvIHN0YXJ0IG9uZS5cIixcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGg7XG4gICAgY2hhaW4uZm9yRWFjaCgocGF0aCwgaSkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybjtcbiAgICAgIGNvbnN0IGl0ZW0gPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWl0ZW1cIiB9KTtcbiAgICAgIGlmIChwYXRoID09PSBhY3RpdmVQYXRoKSBpdGVtLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtbnVtXCIgfSkuc2V0VGV4dChTdHJpbmcoaSArIDEpKTtcbiAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLXRpdGxlXCIgfSkuc2V0VGV4dChmLmJhc2VuYW1lKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLm9uSXRlbUNsaWNrKGUsIGksIGYpKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoZSwgZik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaXRlbXMucHVzaCh7IHBhdGgsIGVsOiBpdGVtIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENsaWNrIHJvdXRpbmc6IHBsYWluID0gb3BlbiwgTW9kID0gdG9nZ2xlIHNlbGVjdCwgU2hpZnQgPSByYW5nZSBzZWxlY3QgKi9cbiAgcHJpdmF0ZSBvbkl0ZW1DbGljayhlOiBNb3VzZUV2ZW50LCBpbmRleDogbnVtYmVyLCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGlmIChlLnNoaWZ0S2V5IHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIC8vIFJhbmdlIGFuY2hvcjogdGhlIGxhc3Qgc2VsZWN0ZWQgaXRlbSwgb3IgdGhlIGRpc3BsYXllZCBzbGlkZVxuICAgICAgICAvLyB3aGVuIG5vIHVzYWJsZSBhbmNob3IgZXhpc3RzIChmaXJzdCBTaGlmdCtjbGljayBpbiBhIHNlc3Npb24pLlxuICAgICAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBudWxsO1xuICAgICAgICBjb25zdCBhbmNob3JQYXRoID1cbiAgICAgICAgICB0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLnNvbWUoKGl0KSA9PiBpdC5wYXRoID09PSB0aGlzLmFuY2hvcilcbiAgICAgICAgICAgID8gdGhpcy5hbmNob3JcbiAgICAgICAgICAgIDogYWN0aXZlUGF0aDtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuaXRlbXMuZmluZEluZGV4KChpdCkgPT4gaXQucGF0aCA9PT0gYW5jaG9yUGF0aCk7XG4gICAgICAgIGlmIChhbmNob3JQYXRoICE9PSBudWxsICYmIGZyb20gIT09IC0xKSB7XG4gICAgICAgICAgY29uc3QgW2xvLCBoaV0gPSBmcm9tIDwgaW5kZXggPyBbZnJvbSwgaW5kZXhdIDogW2luZGV4LCBmcm9tXTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gbG87IGkgPD0gaGk7IGkrKykgdGhpcy5zZWxlY3RlZC5hZGQodGhpcy5pdGVtc1tpXS5wYXRoKTtcbiAgICAgICAgICAvLyBUaGUgZGlzcGxheWVkIHNsaWRlIGpvaW5zIGV2ZXJ5IFNoaWZ0IHNlbGVjdGlvbiBcdTIwMTQgZXh0ZW5kaW5nIGFcbiAgICAgICAgICAvLyBzZWxlY3Rpb24gbmV2ZXIgc2lsZW50bHkgZHJvcHMgdGhlIHBhZ2UgeW91IGFyZSBsb29raW5nIGF0LlxuICAgICAgICAgIGlmIChhY3RpdmVQYXRoICE9PSBudWxsICYmIHRoaXMuaXRlbXMuc29tZSgoaXQpID0+IGl0LnBhdGggPT09IGFjdGl2ZVBhdGgpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChhY3RpdmVQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hbmNob3IgPSB0aGlzLml0ZW1zW2luZGV4XS5wYXRoO1xuICAgICAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE1vZCAob3IgU2hpZnQgd2l0aCBubyByZWFjaGFibGUgYW5jaG9yKTogcHVyZSB0b2dnbGUgXHUyMDE0IHRoZSBvbmx5IHdheVxuICAgICAgLy8gdG8gY2FuY2VsIGFuIGl0ZW0gb3V0IG9mIHRoZSBzZWxlY3Rpb24uXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZC5oYXMoZi5wYXRoKSkgdGhpcy5zZWxlY3RlZC5kZWxldGUoZi5wYXRoKTtcbiAgICAgIGVsc2UgdGhpcy5zZWxlY3RlZC5hZGQoZi5wYXRoKTtcbiAgICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgLy8gTm8gc2VsZWN0aW9uIGFmdGVyIGEgcGxhaW4gY2xpY2ssIGJ1dCB0aGUgY2xpY2tlZCBzbGlkZSBzdGF5cyB0aGVcbiAgICAvLyBTaGlmdCtjbGljayBhbmNob3IgXHUyMDE0IG1hdGNoaW5nIHRoZSBmaWxlLWV4cGxvcmVyIGZlZWw6IHBpY2sgYSBzbGlkZSxcbiAgICAvLyB0aGVuIFNoaWZ0K2NsaWNrIGEgbGF0ZXIgb25lIHRvIHNlbGVjdCB0aGUgd2hvbGUgcmFuZ2UgYmV0d2VlbiB0aGVtLlxuICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICB2b2lkIHRoaXMub3BlblNsaWRlKGYpO1xuICB9XG5cbiAgLyoqIFJlZmxlY3QgdGhlIHNlbGVjdGlvbiBzZXQgb24gdGhlIHJlbmRlcmVkIGl0ZW1zIHdpdGhvdXQgYSByZWJ1aWxkICovXG4gIHByaXZhdGUgc3luY1NlbGVjdGlvbkNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtc2VsZWN0ZWRcIiwgdGhpcy5zZWxlY3RlZC5oYXMoaXQucGF0aCkpO1xuICB9XG5cbiAgLyoqIFJpZ2h0LWNsaWNrIG1lbnUgb24gb25lIGl0ZW07IG9wZXJhdGVzIG9uIHRoZSB3aG9sZSBzZWxlY3Rpb24gd2hlbiBpdCBiZWxvbmdzIHRvIG9uZSAqL1xuICBwcml2YXRlIG9wZW5Db250ZXh0TWVudShlOiBNb3VzZUV2ZW50LCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUoXCJDcmVhdGUgbmV4dCBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInBsdXNcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdm9pZCB0aGlzLmNyZWF0ZU5leHRBZnRlcihmKSksXG4gICAgKTtcbiAgICBjb25zdCB0YXJnZXRzID0gdGhpcy5zZWxlY3RlZC5oYXMoZi5wYXRoKSA/IFsuLi50aGlzLnNlbGVjdGVkXSA6IFtmLnBhdGhdO1xuICAgIGNvbnN0IG9yZGVyZWQgPSB0aGlzLmxhc3RDaGFpbi5maWx0ZXIoKHApID0+IHRhcmdldHMuaW5jbHVkZXMocCkpO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUob3JkZXJlZC5sZW5ndGggPiAxID8gYERlbGV0ZSAke29yZGVyZWQubGVuZ3RofSBzbGlkZXNgIDogXCJEZWxldGUgc2xpZGVcIilcbiAgICAgICAgLnNldEljb24oXCJ0cmFzaFwiKVxuICAgICAgICAub25DbGljaygoKSA9PiB0aGlzLmRlbGV0ZVNsaWRlcyhvcmRlcmVkKSksXG4gICAgKTtcbiAgICBtZW51LnNob3dBdE1vdXNlRXZlbnQoZSk7XG4gIH1cblxuICAvKiogQ3JlYXRlIGEgc2xpZGUgYWZ0ZXIgdGhlIHJpZ2h0LWNsaWNrZWQgb25lICh3aXRob3V0IG9wZW5pbmcgaXQpICovXG4gIHByaXZhdGUgYXN5bmMgY3JlYXRlTmV4dEFmdGVyKGY6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGxhbiA9IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXh0KGYpO1xuICAgIGlmICghcGxhbikgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXh0KGYsIHBsYW4sIGZhbHNlKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqIENvbmZpcm0sIHRoZW4gdHJhc2ggdGhlIGdpdmVuIHNsaWRlcyBhbmQgc3BsaWNlIHRoZW0gb3V0IG9mIHRoZSBjaGFpbiAqL1xuICBwcml2YXRlIGRlbGV0ZVNsaWRlcyhwYXRoczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgcnVuID0gKCk6IHZvaWQgPT4gdm9pZCB0aGlzLnJ1bkRlbGV0aW9uKHBhdGhzKTtcblxuICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcykge1xuICAgICAgcnVuKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5hbWVzID0gcGF0aHMubWFwKChwKSA9PiB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHApO1xuICAgICAgcmV0dXJuIGYgaW5zdGFuY2VvZiBURmlsZSA/IGYuYmFzZW5hbWUgOiBwO1xuICAgIH0pO1xuICAgIG5ldyBDb25maXJtRGVsZXRlTW9kYWwodGhpcy5hcHAsIG5hbWVzLCBydW4sIGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMgPSBmYWxzZTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIH0pLm9wZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcnVuRGVsZXRpb24ocGF0aHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbDtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlRGVsZXRlU2xpZGVzKFxuICAgICAgdGhpcy5sYXN0Q2hhaW4sXG4gICAgICBuZXcgU2V0KHBhdGhzKSxcbiAgICAgIGFjdGl2ZVBhdGgsXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgcGF0aCBvZiBwYXRocykgdGhpcy5zZWxlY3RlZC5kZWxldGUocGF0aCk7XG4gICAgaWYgKHRoaXMuYW5jaG9yICE9PSBudWxsICYmIHBhdGhzLmluY2x1ZGVzKHRoaXMuYW5jaG9yKSkgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJlc3VsdC5sYW5kaW5nUGF0aCkge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXN1bHQubGFuZGluZ1BhdGgpO1xuICAgICAgaWYgKGYgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5vcGVuU2xpZGUoZik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKiogT3BlbiBhIHNsaWRlIGluIGEgbWFya2Rvd24gbGVhZiAobmV2ZXIgaW4gdGhpcyBwYW5lbCdzIG93biBsZWFmKSAqL1xuICBwcml2YXRlIGFzeW5jIG9wZW5TbGlkZShmOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxlYWYgPVxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShcIm1hcmtkb3duXCIpWzBdID8/IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZik7XG4gICAgdGhpcy5hcHAud29ya3NwYWNlLnNldEFjdGl2ZUxlYWYobGVhZiwgeyBmb2N1czogdHJ1ZSB9KTtcbiAgfVxufVxuXG4vKiogT3JkZXItc2Vuc2l0aXZlIGNoYWluIGNvbXBhcmlzb24gKi9cbmZ1bmN0aW9uIGNoYWluRXF1YWxzKGE6IHN0cmluZ1tdLCBiOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gYS5sZW5ndGggPT09IGIubGVuZ3RoICYmIGEuZXZlcnkoKHAsIGkpID0+IHAgPT09IGJbaV0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuLyoqIE1heCBuYW1lcyBzaG93biBpbiB0aGUgZGlhbG9nIGJlZm9yZSBjb2xsYXBzaW5nIGludG8gYSBcIitOIG1vcmVcIiBsaW5lICovXG5jb25zdCBNQVhfVklTSUJMRV9OQU1FUyA9IDg7XG5cbi8qKlxuICogQ29uZmlybWF0aW9uIGRpYWxvZyBmb3IgRGVsZXRlIHNsaWRlcy4gTGlzdHMgdGhlIG5vdGVzIGFib3V0IHRvIGJlXG4gKiB0cmFzaGVkIChudW1iZXJlZCBsaWtlIHRoZSBwYW5lbCwgc28gdGhlIHVzZXIgY2FuIG1hcCB0aGVtIDE6MSksIG9mZmVyc1xuICogYSBcImRvbid0IGFzayBhZ2FpblwiIHRvZ2dsZSB0aGF0IGZsaXBzIHRoZSBgY29uZmlybURlbGV0ZVNsaWRlc2Agc2V0dGluZ1xuICogb2ZmIChwZXJzaXN0ZWQgYnkgdGhlIGNhbGxlciB2aWEgb25Eb250QXNrKSwgYW5kIGFza3MgZm9yIGFuIGV4cGxpY2l0XG4gKiBDYW5jZWwgLyBEZWxldGUgZGVjaXNpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25maXJtRGVsZXRlTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgY29uZmlybWVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBuYW1lczogc3RyaW5nW10sXG4gICAgcHJpdmF0ZSBvbkNvbmZpcm06ICgpID0+IHZvaWQsXG4gICAgcHJpdmF0ZSBvbkRvbnRBc2s6ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICkge1xuICAgIHN1cGVyKGFwcCk7XG4gIH1cblxuICBvbk9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgICB0aGlzLm1vZGFsRWwuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlXCIpO1xuXG4gICAgY29uc3QgY291bnQgPSB0aGlzLm5hbWVzLmxlbmd0aDtcbiAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXRpdGxlXCIsXG4gICAgICB0ZXh0OiBjb3VudCA9PT0gMSA/IFwiRGVsZXRlIHRoaXMgc2xpZGU/XCIgOiBgRGVsZXRlICR7Y291bnR9IHNsaWRlcz9gLFxuICAgIH0pO1xuICAgIHRoaXMuY29udGVudEVsXG4gICAgICAuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtc3ViXCIgfSlcbiAgICAgIC5zZXRUZXh0KFxuICAgICAgICBjb3VudCA9PT0gMVxuICAgICAgICAgID8gXCJUaGUgbm90ZSB3aWxsIGJlIG1vdmVkIHRvIHRoZSB0cmFzaC5cIlxuICAgICAgICAgIDogXCJUaGVzZSBub3RlcyB3aWxsIGJlIG1vdmVkIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgICk7XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbGlzdFwiIH0pO1xuICAgIGZvciAoY29uc3QgW2ksIG5hbWVdIG9mIHRoaXMubmFtZXMuc2xpY2UoMCwgTUFYX1ZJU0lCTEVfTkFNRVMpLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbnVtXCIgfSkuc2V0VGV4dChTdHJpbmcoaSArIDEpKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbmFtZVwiIH0pLnNldFRleHQobmFtZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm5hbWVzLmxlbmd0aCA+IE1BWF9WSVNJQkxFX05BTUVTKSB7XG4gICAgICBsaXN0XG4gICAgICAgIC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1tb3JlXCIgfSlcbiAgICAgICAgLnNldFRleHQoYFx1MjAyNiBhbmQgJHt0aGlzLm5hbWVzLmxlbmd0aCAtIE1BWF9WSVNJQkxFX05BTUVTfSBtb3JlYCk7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZERvbnRBc2tSb3coKTtcbiAgICB0aGlzLmJ1aWxkQWN0aW9ucygpO1xuICB9XG5cbiAgLyoqIENvbXBhY3QgbGVmdC1hbGlnbmVkIFwiZG9uJ3QgYXNrIGFnYWluXCIgY2hlY2tib3ggcm93ICovXG4gIHByaXZhdGUgYnVpbGREb250QXNrUm93KCk6IHZvaWQge1xuICAgIGNvbnN0IHJvdyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWRvbnRhc2tcIiB9KTtcbiAgICByb3cuY3JlYXRlRWwoXCJsYWJlbFwiKS5zZXRUZXh0KFwiRG9uJ3QgYXNrIGFnYWluXCIpO1xuICAgIGNvbnN0IGNoZWNrYm94ID0gcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyB0eXBlOiBcImNoZWNrYm94XCIgfSk7XG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMub25Eb250QXNrKCkudGhlbihcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIGNoZWNrYm94LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIC8vIGtlZXAgdGhlIGNoZWNrYm94IGVuYWJsZWQgaWYgcGVyc2lzdGluZyB0aGUgcHJlZmVyZW5jZSBmYWlsZWRcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmlnaHQtYWxpZ25lZCBDYW5jZWwgLyBEZWxldGUgYnV0dG9uIHJvdyAqL1xuICBwcml2YXRlIGJ1aWxkQWN0aW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtYWN0aW9uc1wiIH0pO1xuICAgIGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbFwiIH0pLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmNsb3NlKCkpO1xuICAgIGFjdGlvbnNcbiAgICAgIC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRGVsZXRlXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29uZmlybWVkKSB0aGlzLm9uQ29uZmlybSgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgdHlwZSBTZXR0aW5nRGVmaW5pdGlvbkl0ZW0gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgU0xJREVTX1RIRU1FUyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKlxuICogU2V0dGluZ3MgdGFiOiB0b2dnbGVzIHRoZSBuYXYgYnV0dG9ucywgcGFnZSBudW1iZXIsIGF1dG8tZW50ZXIgYW5kIGJhclxuICogdmlzaWJpbGl0eS4gRGVjbGFyYXRpdmUgZGVmaW5pdGlvbnMgKE9ic2lkaWFuIFx1MjI2NSAxLjEzLjAsIHNlYXJjaGFibGUgaW4gdGhlXG4gKiBzZXR0aW5ncyBtb2RhbCkgd2l0aCBhbiBpbXBlcmF0aXZlIGBkaXNwbGF5KClgIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gIH1cblxuICAvKiogRGVjbGFyYXRpdmUgc2V0dGluZ3MgKE9ic2lkaWFuIFx1MjI2NSAxLjEzLjApIFx1MjAxNCBzZWFyY2hhYmxlIGJ5IHRoZSBzZXR0aW5ncyBtb2RhbC4gKi9cbiAgZ2V0U2V0dGluZ0RlZmluaXRpb25zKCk6IFNldHRpbmdEZWZpbml0aW9uSXRlbVtdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBuYW1lOiBcIlN0eWxlIHRlbXBsYXRlXCIsXG4gICAgICAgIGRlc2M6IFwiQnVpbHQtaW4gbG9vayBmb3IgdGhlIHNsaWRlcyBjYXJkIGFuZCBzbGlkZXMgYmFyIChib3JkZXIsIGJhY2tncm91bmQsIHNoYWRvdywgYmFyIHN0eWxpbmcpLiBFdmVyeSB0ZW1wbGF0ZSBhZGFwdHMgdG8gbGlnaHQgYW5kIGRhcmsgdGhlbWVzLlwiLFxuICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAga2V5OiBcInNsaWRlc1RoZW1lXCIsXG4gICAgICAgICAgdHlwZTogXCJkcm9wZG93blwiLFxuICAgICAgICAgIG9wdGlvbnM6IE9iamVjdC5mcm9tRW50cmllcyhTTElERVNfVEhFTUVTLm1hcCgodCkgPT4gW3QuaWQsIHQubGFiZWxdKSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkNlbnRlciBpbWFnZXNcIixcbiAgICAgICAgZGVzYzogXCJJbWFnZXMgcmVuZGVyIGNlbnRlcmVkIG9uIHRoZSBzbGlkZSBhcyBhIGNhcmQgYmxvY2sgZXhhY3RseSBhcyB0YWxsIGFzIHRoZSBwaWN0dXJlLiBUdXJuIG9mZiBmb3IgT2JzaWRpYW4ncyB1c3VhbCBiZWhhdmlvcjogaW1hZ2VzIHN0YXkgaW5saW5lIHdpdGggdGhlIHRleHQgKGEgc21hbGwgaW1hZ2UgYW5kIGl0cyBjYXB0aW9uIHNpdCBvbiB0aGUgc2FtZSByb3cpLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJpbWFnZUxheW91dFwiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgc2xpZGVzIGJhclwiLFxuICAgICAgICBkZXNjOiBcIk1hc3RlciB0b2dnbGUgZm9yIHRoZSBlbnRpcmUgc2xpZGVzIGJhciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3dcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd1NsaWRlc0JhclwiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgcHJldmlvdXMvbmV4dCBidXR0b25zXCIsXG4gICAgICAgIGRlc2M6IFwiU2hvdyBcdTI1QzAgXHUyNUI2IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgd2hlbiB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KVwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93TmF2QnV0dG9uc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlBhZ2UgbnVtYmVyIHN0eWxlXCIsXG4gICAgICAgIGRlc2M6ICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIm4gLyB0b3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJuXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwibm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgICAgY29udHJvbDoge1xuICAgICAgICAgIGtleTogXCJwYWdlTnVtYmVyU3R5bGVcIixcbiAgICAgICAgICB0eXBlOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgcHJvZ3Jlc3MgYmFyXCIsXG4gICAgICAgIGRlc2M6IFwiRGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgLS0gb25lIHBlciBzbGlkZSwgY2xpY2sgdG8ganVtcFwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93UHJvZ3Jlc3NcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJBdXRvLWVudGVyIHNsaWRlcyBtb2RlXCIsXG4gICAgICAgIGRlc2M6IFwiT3BlbiBkZWNrIG5vdGVzIGRpcmVjdGx5IGluIFNsaWRlcyBtb2RlLiBMZWF2ZSBvZmYgdG8gZW50ZXIgbWFudWFsbHkgd2l0aCB0aGUgVG9nZ2xlIFNsaWRlcyBNb2RlIGNvbW1hbmQgKE1vZCtTaGlmdCtFKSBvciB0aGUgcHJldmlvdXMvbmV4dCBwYWdlIGhvdGtleXMuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImF1dG9FbnRlclNsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkVzY2FwZSBleGl0cyBzbGlkZXMgbW9kZVwiLFxuICAgICAgICBkZXNjOiBcIlByZXNzIGVzY2FwZSB0byBsZWF2ZSBzbGlkZXMgbW9kZSBhbmQgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyB2aWV3XCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImVzY0V4aXRzU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2xpZGVzIHRpdGxlXCIsXG4gICAgICAgIGRlc2M6IFwiRnJvbnRtYXR0ZXIgcHJvcGVydHkgdG8gc2hvdyBhcyB0aGUgY2FyZCB0aXRsZSAoSDEpLiBMZWF2ZSBlbXB0eSBmb3Igbm9uZTsgdHlwZSBgZmlsZW5hbWVgIHRvIHVzZSB0aGUgZmlsZSBuYW1lIFx1MjAxNCB0aGF0IHRpdGxlIGlzIGVkaXRhYmxlIChyZW5hbWVzIHRoZSBub3RlKTsgcHJvcGVydHktYmFja2VkIHRpdGxlcyBhcmUgcmVhZC1vbmx5IChlZGl0IHRoZSBwcm9wZXJ0eSBvdXRzaWRlIHNsaWRlcyBtb2RlKS5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2xpZGVzVGl0bGVcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIkUuZy4gVGl0bGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJCYXIgcHJvcGVydGllc1wiLFxuICAgICAgICBkZXNjOiBcIkNvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyB0byBzaG93IGluIHRoZSBzbGlkZXMgYmFyIChlLmcuIGB1bml2ZXJzaXR5LCBzaG9ydC10aXRsZSwgZGF0ZWApLiBFYWNoIHZhbHVlIGZpbGxzIGFuIGVxdWFsLXdpZHRoIGNvbHVtbjsgZHJhZyBkaXZpZGVycyB0byByZXNpemUuIExlYXZlIGVtcHR5IHRvIHNob3cgbm90aGluZy5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiYmFyUHJvcGVydGllc1wiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiRS5nLiBVbml2ZXJzaXR5LCBkYXRlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ29uZmlybSBzbGlkZSBkZWxldGlvblwiLFxuICAgICAgICBkZXNjOiBcIkFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgc2xpZGVzIHBhbmVsJ3MgcmlnaHQtY2xpY2sgbWVudS4gRGVsZXRpb24gbW92ZXMgc2xpZGVzIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiY29uZmlybURlbGV0ZVNsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIk5hdmlnYXRpb24gaG90a2V5c1wiLFxuICAgICAgICBkZXNjOiBcIkRlZmF1bHQ6IFByZXZpb3VzIHBhZ2UgbW9kK3NoaWZ0K1x1MjE5MCwgbmV4dCBwYWdlIG1vZCtzaGlmdCtcdTIxOTIuIFJlYmluZCB1bmRlciBzZXR0aW5ncyBcdTIxOTIgaG90a2V5cy5cIixcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgLy8gT3BlbiBPYnNpZGlhbidzIGhvdGtleXMgc2V0dGluZ3MgcGFnZSAoaW50ZXJuYWwgQVBJOyBpZ25vcmUgZmFpbHVyZXMpXG4gICAgICAgICAgKFxuICAgICAgICAgICAgdGhpcy5hcHAgYXMgdW5rbm93biBhcyB7IHNldHRpbmc/OiB7IG9wZW5UYWJCeUlkPzogKGlkOiBzdHJpbmcpID0+IHZvaWQgfSB9XG4gICAgICAgICAgKS5zZXR0aW5nPy5vcGVuVGFiQnlJZD8uKFwiaG90a2V5c1wiKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIC8qKiBQZXJzaXN0IGNvbnRyb2wgY2hhbmdlcywgdGhlbiByZWZyZXNoIHRoZSBiYXIgc28gdGhlIG5ldyBzZXR0aW5nIGFwcGxpZXMuICovXG4gIHNldENvbnRyb2xWYWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiB2b2lkIHtcbiAgICB2b2lkIHRoaXMuYXBwbHlDb250cm9sVmFsdWUoa2V5LCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGFwcGx5Q29udHJvbFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICh0aGlzLnBsdWdpbi5zZXR0aW5ncyBhcyB1bmtub3duIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gdmFsdWU7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIEltcGVyYXRpdmUgZmFsbGJhY2sgZm9yIE9ic2lkaWFuIDwgMS4xMy4wIChub3QgY2FsbGVkIHdpdGggZGVmaW5pdGlvbnMgcHJlc2VudCkuICovXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlN0eWxlIHRlbXBsYXRlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgc2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBTTElERVNfVEhFTUVTKSBkcm9wZG93bi5hZGRPcHRpb24odC5pZCwgdC5sYWJlbCk7XG4gICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDZW50ZXIgaW1hZ2VzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJJbWFnZXMgcmVuZGVyIGNlbnRlcmVkIG9uIHRoZSBzbGlkZSBhcyBhIGNhcmQgYmxvY2sgZXhhY3RseSBhcyB0YWxsIGFzIHRoZSBwaWN0dXJlLiBUdXJuIG9mZiBmb3IgT2JzaWRpYW4ncyB1c3VhbCBiZWhhdmlvcjogaW1hZ2VzIHN0YXkgaW5saW5lIHdpdGggdGhlIHRleHQgKGEgc21hbGwgaW1hZ2UgYW5kIGl0cyBjYXB0aW9uIHNpdCBvbiB0aGUgc2FtZSByb3cpLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuaW1hZ2VMYXlvdXQpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmltYWdlTGF5b3V0ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBzbGlkZXMgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcIk1hc3RlciB0b2dnbGUgZm9yIHRoZSBlbnRpcmUgc2xpZGVzIGJhciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3dcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByZXZpb3VzL25leHQgYnV0dG9uc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU2hvdyBcdTI1QzAgXHUyNUI2IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgd2hlbiB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KVwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dOYXZCdXR0b25zID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiUGFnZSBudW1iZXIgc3R5bGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnU2hvd24gYXQgdGhlIGJvdHRvbS1yaWdodC4gXCJuIC8gdG90YWxcIjogMS1iYXNlZCBvdmVyIHRoZSB3aG9sZSBkZWNrIGNoYWluIChoZWFkIHNsaWRlID0gMSkuIFwiblwiOiBqdXN0IHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyLiBcIm5vbmVcIjogaGlkZGVuLicsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PlxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb25zKHtcbiAgICAgICAgICAgIGZyYWN0aW9uOiBcIk4gLyBUb3RhbFwiLFxuICAgICAgICAgICAgY3VycmVudDogXCJOXCIsXG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucGFnZU51bWJlclN0eWxlID0gdmFsdWUgYXMgXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByb2dyZXNzIGJhclwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgLS0gb25lIHBlciBzbGlkZSwgY2xpY2sgdG8ganVtcFwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1Byb2dyZXNzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBdXRvLWVudGVyIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcIlByZXNzIGVzY2FwZSB0byBsZWF2ZSBzbGlkZXMgbW9kZSBhbmQgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyB2aWV3XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNsaWRlcyB0aXRsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRnJvbnRtYXR0ZXIgcHJvcGVydHkgdG8gc2hvdyBhcyB0aGUgY2FyZCB0aXRsZSAoSDEpLiBMZWF2ZSBlbXB0eSBmb3Igbm9uZTsgdHlwZSBgZmlsZW5hbWVgIHRvIHVzZSB0aGUgZmlsZSBuYW1lLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFRpdGxlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQmFyIHByb3BlcnRpZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkNvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyB0byBzaG93IGluIHRoZSBzbGlkZXMgYmFyIChlLmcuIGB1bml2ZXJzaXR5LCBzaG9ydC10aXRsZSwgZGF0ZWApLiBFYWNoIHZhbHVlIGZpbGxzIGFuIGVxdWFsLXdpZHRoIGNvbHVtbjsgZHJhZyBkaXZpZGVycyB0byByZXNpemUuIExlYXZlIGVtcHR5IHRvIHNob3cgbm90aGluZy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRS5nLiBVbml2ZXJzaXR5LCBkYXRlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmJhclByb3BlcnRpZXMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbmZpcm0gc2xpZGUgZGVsZXRpb25cIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgc2xpZGVzIHBhbmVsJ3MgcmlnaHQtY2xpY2sgbWVudS4gRGVsZXRpb24gbW92ZXMgc2xpZGVzIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk5hdmlnYXRpb24gaG90a2V5c1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PlxuICAgICAgICBidXR0b24uc2V0QnV0dG9uVGV4dChcIk9wZW4gaG90a2V5cyBzZXR0aW5nc1wiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG4gIH1cbn1cbiIsICIvKiogUmVtb3ZlIGFsbCBjaGlsZHJlbiBvZiBhbiBlbGVtZW50ICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDaGlsZHJlbihlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBMEJBLElBQUFBLG1CQUE0Qzs7O0FDekJyQyxTQUFTLFlBQXlCO0FBQ3ZDLFFBQU0sTUFBTSxVQUFVLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQztBQUNsRCxNQUFJLGFBQWEsRUFBRSxTQUFTLE9BQU8sQ0FBQztBQUNwQyxNQUFJLFFBQVE7QUFJWixNQUFJLGlCQUFpQixhQUFhLENBQUMsTUFBTTtBQUN2QyxNQUFFLGVBQWU7QUFDakIsVUFBTSxTQUFTLFNBQVM7QUFDeEIsUUFBSSxrQkFBa0IsZUFBZSxXQUFXLFNBQVMsS0FBTSxRQUFPLEtBQUs7QUFBQSxFQUM3RSxDQUFDO0FBQ0QsU0FBTztBQUNUO0FBR08sU0FBUyxVQUNkLE9BQ0EsS0FDQSxTQUNBLFdBQVcsT0FDUTtBQUNuQixRQUFNLE1BQU0sU0FBUyxVQUFVO0FBQUEsSUFDN0IsS0FBSztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTSxFQUFFLE9BQU8sSUFBSTtBQUFBLEVBQ3JCLENBQUM7QUFDRCxNQUFJLFdBQVc7QUFDZixNQUFJLENBQUMsU0FBVSxLQUFJLGlCQUFpQixTQUFTLE9BQU87QUFDcEQsU0FBTztBQUNUO0FBUU8sU0FBUyxpQkFBaUIsUUFBd0I7QUFDdkQsUUFBTSxTQUFTLFNBQVM7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7QUFDQSxNQUFJLFVBQVUsT0FBTyxlQUFlLEVBQUcsVUFBUyxPQUFPO0FBQ3ZELE1BQUksU0FBUyxHQUFHO0FBQ2QsYUFBUyxnQkFBZ0IsWUFBWSxFQUFFLGlDQUFpQyxHQUFHLE1BQU0sS0FBSyxDQUFDO0FBQUEsRUFDekYsT0FBTztBQUVMLGFBQVMsZ0JBQWdCLE1BQU0sZUFBZSwrQkFBK0I7QUFBQSxFQUMvRTtBQUNBLFNBQU87QUFDVDs7O0FDbkRBLHNCQUEwQzs7O0FDd0RuQyxTQUFTLGdCQUFnQixHQUFpQztBQUMvRCxRQUFNLElBQUksRUFBRSxLQUFLO0FBQ2pCLFFBQU0sUUFBUSxDQUFDLE1BQXNCLEtBQUssSUFBSSxHQUFHLEtBQUssTUFBTSxDQUFDLENBQUM7QUFDOUQsUUFBTSxZQUFZLE1BQU0sSUFBSSxFQUFFLEtBQUssVUFBVTtBQUU3QyxRQUFNLFVBQVUsRUFBRSxRQUFRLGNBQWMsRUFBRSxLQUFLO0FBQy9DLFFBQU0sVUFBVSxNQUFNLElBQUksT0FBTztBQUVqQyxRQUFNLE1BQU0sRUFBRSxJQUFJLGNBQWMsRUFBRSxLQUFLO0FBQ3ZDLFFBQU0sVUFBVSxNQUFNLElBQUksR0FBRztBQUU3QixRQUFNLE1BQU0sRUFBRSxJQUFJLGNBQWMsRUFBRSxLQUFLO0FBQ3ZDLFFBQU0sWUFBWSxDQUFDLFFBQWdCLFVBQTBCLE9BQU8sSUFBSSxVQUFVLEtBQUs7QUFFdkYsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sZ0JBQWdCLFVBQVUsS0FBSyxPQUFPO0FBQUEsTUFDdEMsZ0JBQWdCLFVBQVUsS0FBSyxPQUFPO0FBQUEsTUFDdEMsa0JBQWtCLFVBQVUsS0FBSyxFQUFFLEtBQUssVUFBVTtBQUFBLElBQ3BEO0FBQUEsRUFDRjtBQUNGO0FBR08sU0FBUyxlQUE0QjtBQUMxQyxRQUFNLE9BQ0osT0FBTyxhQUFhLGNBQ2YsU0FBUyxnQkFBZ0IsYUFBYSxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQ3hFO0FBQ04sU0FBTyxLQUFLLFlBQVksRUFBRSxXQUFXLElBQUksSUFBSSxPQUFPO0FBQ3REO0FBRUEsU0FBUyxJQUFJLEdBQW1CO0FBQzlCLFNBQU8sT0FBTyxVQUFVLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQztBQUN0RDtBQUdBLFNBQVMsT0FBTyxNQUFjLEtBQThEO0FBQzFGLE1BQUksQ0FBQyxJQUFLLFFBQU8sR0FBRyxJQUFJO0FBQ3hCLFNBQU8sR0FBRyxJQUFJLEtBQUssSUFBSSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLFFBQVEsQ0FBQztBQUMxRTtBQUVBLFNBQVMsU0FBUyxHQUFpQixHQUFtQixNQUFzQjtBQUMxRSxRQUFNLE1BQ0osRUFBRSxJQUFJLFdBQVcsRUFBRSxJQUFJLFNBQVMsSUFDNUIsd0JBQXdCLEVBQUUsSUFBSSxNQUFNLDhDQUNwQztBQUNOLFFBQU0sUUFDSixFQUFFLGdCQUFnQixJQUFJLGVBQWUsRUFBRSxhQUFhLGlCQUFpQjtBQUN2RSxRQUFNLE1BQ0osRUFBRSxnQkFBZ0IsT0FBTyxVQUFVLEVBQUUsV0FBVyx3Q0FBd0M7QUFDMUYsUUFBTSxVQUFVO0FBQUEsSUFDZCxlQUFlLEVBQUUsU0FBUztBQUFBLElBQzFCLGlCQUFpQixFQUFFLE9BQU8sY0FBYztBQUFBLElBQ3hDLGNBQWMsRUFBRSxPQUFPO0FBQUEsSUFDdkIsa0JBQWtCLEVBQUUsT0FBTztBQUFBLEVBQzdCLEVBQUUsS0FBSyxJQUFJO0FBQ1gsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQSxvQkFBb0IsRUFBRSxTQUFTLEtBQUssT0FBSSxFQUFFLFNBQVMsTUFBTSxpQkFBaUIsRUFBRSxLQUFLLEtBQUssT0FBSSxFQUFFLEtBQUssTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLO0FBQUEsSUFDMUg7QUFBQSxJQUNBLDJCQUEyQixJQUFJLEVBQUUsS0FBSyxRQUFRLENBQUM7QUFBQSxJQUMvQyxxQkFBZ0IsS0FBSyxNQUFNLEVBQUUsS0FBSyxRQUFRLEVBQUUsS0FBSyxLQUFLLENBQUMsWUFBWSxLQUFLLE1BQU0sRUFBRSxLQUFLLFFBQVEsRUFBRSxLQUFLLEdBQUcsQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLEtBQUssVUFBVSxDQUFDO0FBQUEsSUFDakosT0FBTyxNQUFNLEVBQUUsRUFBRTtBQUFBLElBQ2pCLE9BQU8sTUFBTSxFQUFFLEVBQUU7QUFBQSxJQUNqQixPQUFPLE1BQU0sRUFBRSxFQUFFO0FBQUEsSUFDakI7QUFBQSxNQUNFO0FBQUEsTUFDQSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxVQUFVLFlBQVksRUFBRSxPQUFPLFdBQVcsSUFBSTtBQUFBLElBQzlFO0FBQUEsSUFDQSxPQUFPLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssVUFBVSxZQUFZLEVBQUUsS0FBSyxXQUFXLElBQUksSUFBSTtBQUFBLEVBQzdGLEVBQ0csT0FBTyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUN2QixPQUFPLENBQUMsSUFBSSxhQUFhLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxFQUM5QyxLQUFLLElBQUk7QUFDZDtBQUVBLFNBQVMsU0FBUyxHQUFpQixHQUFtQixNQUFzQjtBQUMxRSxRQUFNLE1BQ0osRUFBRSxJQUFJLFdBQVcsRUFBRSxJQUFJLFNBQVMsSUFDNUIsd0NBQWUsRUFBRSxJQUFJLE1BQU0sbUVBQzNCO0FBQ04sUUFBTSxRQUFRLEVBQUUsZ0JBQWdCLElBQUksOENBQVcsRUFBRSxhQUFhLGFBQVE7QUFDdEUsUUFBTSxNQUFNLEVBQUUsZ0JBQWdCLE9BQU8scUJBQU0sRUFBRSxXQUFXLG9FQUFrQjtBQUMxRSxRQUFNLFVBQVU7QUFBQSxJQUNkLDJCQUFPLEVBQUUsU0FBUztBQUFBLElBQ2xCLHNEQUFtQixFQUFFLE9BQU8sY0FBYztBQUFBLElBQzFDLDJCQUFPLEVBQUUsT0FBTztBQUFBLElBQ2hCLGtCQUFRLEVBQUUsT0FBTztBQUFBLEVBQ25CLEVBQUUsS0FBSyxRQUFHO0FBQ1YsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQSxrQ0FBUyxFQUFFLFNBQVMsS0FBSyxPQUFJLEVBQUUsU0FBUyxNQUFNLDhCQUFVLEVBQUUsS0FBSyxLQUFLLE9BQUksRUFBRSxLQUFLLE1BQU0sV0FBTSxHQUFHLElBQUksS0FBSztBQUFBLElBQ3ZHO0FBQUEsSUFDQSw4Q0FBVyxJQUFJLEVBQUUsS0FBSyxRQUFRLENBQUM7QUFBQSxJQUMvQixzQkFBTyxLQUFLLE1BQU0sRUFBRSxLQUFLLFFBQVEsRUFBRSxLQUFLLEdBQUcsQ0FBQyx5QkFBVSxLQUFLLE1BQU0sRUFBRSxLQUFLLFFBQVEsRUFBRSxLQUFLLEtBQUssQ0FBQyxpRUFBZSxJQUFJLEVBQUUsS0FBSyxVQUFVLENBQUM7QUFBQSxJQUNsSSxPQUFPLE1BQU0sRUFBRSxFQUFFO0FBQUEsSUFDakIsT0FBTyxNQUFNLEVBQUUsRUFBRTtBQUFBLElBQ2pCLE9BQU8sTUFBTSxFQUFFLEVBQUU7QUFBQSxJQUNqQjtBQUFBLE1BQ0U7QUFBQSxNQUNBLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLFVBQVUsWUFBWSxFQUFFLE9BQU8sV0FBVyxJQUFJO0FBQUEsSUFDOUU7QUFBQSxJQUNBLE9BQU8sc0JBQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssVUFBVSxZQUFZLEVBQUUsS0FBSyxXQUFXLElBQUksSUFBSTtBQUFBLEVBQzVGLEVBQ0csT0FBTyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUN2QixPQUFPLENBQUMsSUFBSSxxQkFBTSxPQUFPLFVBQUssSUFBSSxJQUFJLENBQUMsRUFDdkMsS0FBSyxJQUFJO0FBQ2Q7QUFPTyxTQUFTLGVBQWUsR0FBaUIsR0FBbUIsUUFBNkI7QUFDOUYsUUFBTSxPQUNKLFdBQVcsT0FDUCw2WUFDQTtBQUNOLFNBQU8sV0FBVyxPQUFPLFNBQVMsR0FBRyxHQUFHLElBQUksSUFBSSxTQUFTLEdBQUcsR0FBRyxJQUFJO0FBQ3JFOzs7QUQ1SkEsSUFBTSxLQUFLLENBQUMsTUFBc0IsT0FBTyxXQUFXLENBQUM7QUFFckQsSUFBTSxlQUNKO0FBQ0YsSUFBTSxhQUFhO0FBR25CLFNBQVMsYUFBYSxNQUFjLFFBQXdCO0FBQzFELFFBQU0sU0FBUyxTQUFTLGNBQWMsUUFBUTtBQUM5QyxRQUFNLE1BQU0sT0FBTyxXQUFXLElBQUk7QUFDbEMsTUFBSSxDQUFDLElBQUssUUFBTztBQUNqQixNQUFJLE9BQU87QUFDWCxTQUFPLElBQUksWUFBWSxNQUFNLEVBQUUsUUFBUSxPQUFPO0FBQ2hEO0FBRUEsU0FBUyxRQUFRLElBQTJEO0FBQzFFLFFBQU0sS0FBSyxpQkFBaUIsRUFBRTtBQUM5QixRQUFNLEtBQUssR0FBRyxHQUFHLFFBQVE7QUFDekIsUUFBTSxRQUFRLEdBQUc7QUFDakIsU0FBTyxFQUFFLFVBQVUsSUFBSSxZQUFZLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJO0FBQzFFO0FBTU8sU0FBUyxjQUFjLEtBQStCO0FBQzNELFFBQU0sT0FBTyxJQUFJLFVBQVUsb0JBQW9CLDRCQUFZO0FBQzNELE1BQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsUUFBTSxPQUFPLEtBQUs7QUFDbEIsUUFBTSxXQUFXLEtBQUssY0FBMkIsY0FBYztBQUMvRCxRQUFNLFVBQVUsS0FBSyxjQUEyQixhQUFhO0FBQzdELE1BQUksQ0FBQyxZQUFZLENBQUMsUUFBUyxRQUFPO0FBRWxDLFFBQU0sV0FBVyxpQkFBaUIsUUFBUTtBQUMxQyxRQUFNLFlBQVksaUJBQWlCLE9BQU87QUFFMUMsUUFBTSxVQUFVLFNBQVM7QUFDekIsUUFBTSxhQUFhLEdBQUcsU0FBUyxVQUFVO0FBQ3pDLFFBQU0sZ0JBQWdCLEdBQUcsU0FBUyxhQUFhO0FBQy9DLFFBQU0sYUFBYSxHQUFHLFVBQVUsVUFBVTtBQUMxQyxRQUFNLGdCQUFnQixHQUFHLFVBQVUsYUFBYTtBQUVoRCxRQUFNLFdBQ0osUUFBUSxhQUFhLG1CQUFtQixLQUFLLFFBQVEsYUFBYSwwQkFBMEI7QUFHOUYsUUFBTSxnQkFBZ0IsV0FDbEIsS0FBSyxNQUFNLEtBQUssSUFBSSxHQUFHLGFBQWEsYUFBYSxJQUFJLEdBQUcsSUFBSSxNQUM1RDtBQUVKLFFBQU0sYUFDSixLQUFLO0FBQUEsSUFDSCxLQUFLLElBQUksR0FBRyxVQUFVLGFBQWEsZ0JBQWdCLGFBQWEsYUFBYSxJQUFJO0FBQUEsRUFDbkYsSUFBSTtBQUVOLFFBQU0sWUFBWSxRQUFRLGNBQWMsR0FBRyxVQUFVLFdBQVcsSUFBSSxHQUFHLFVBQVUsWUFBWTtBQUM3RixRQUFNLGdCQUFnQixTQUFTO0FBQy9CLFFBQU0saUJBQWlCO0FBR3ZCLFFBQU0sTUFBTSxTQUFTLGNBQTJCLG9CQUFvQjtBQUNwRSxRQUFNLGFBQWEsUUFBUSxRQUFRLGlCQUFpQixHQUFHLEVBQUUsWUFBWTtBQUNyRSxRQUFNLFlBQVksT0FBTyxhQUFhLElBQUksZUFBZTtBQUd6RCxRQUFNLFNBQVMsQ0FBQyxRQUFnQixLQUFLLGNBQTJCLGVBQWUsR0FBRyxFQUFFO0FBQ3BGLFFBQU0sT0FBTyxPQUFPLGNBQWM7QUFDbEMsUUFBTSxPQUFPLE9BQU8sY0FBYztBQUNsQyxRQUFNLE9BQU8sT0FBTyxjQUFjO0FBQ2xDLFFBQU0sV0FBVyxLQUFLLGNBQTJCLGdDQUFnQztBQUNqRixRQUFNLFNBQVMsS0FBSyxjQUEyQixpREFBaUQ7QUFDaEcsUUFBTSxRQUFRLEtBQUssY0FBMkIsdUNBQXVDO0FBTXJGLFFBQU0sU0FDSixNQUFNO0FBQUEsSUFDSixLQUFLO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsUUFBUSxHQUFHLFlBQVksS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLO0FBRWpGLFFBQU0sT0FBTyxRQUFRLE1BQU07QUFDM0IsUUFBTSxLQUFLLE9BQU8sUUFBUSxJQUFJLElBQUk7QUFDbEMsUUFBTSxLQUFLLE9BQU8sUUFBUSxJQUFJLElBQUk7QUFDbEMsUUFBTSxLQUFLLE9BQU8sUUFBUSxJQUFJLElBQUk7QUFFbEMsUUFBTSxLQUFLLENBQUMsT0FBeUMsaUJBQWlCLEVBQUU7QUFDeEUsTUFBSSxTQUF3QztBQUM1QyxNQUFJLFVBQVU7QUFDWixVQUFNLElBQUksR0FBRyxRQUFRO0FBQ3JCLGFBQVM7QUFBQSxNQUNQLFlBQVksR0FBRyxFQUFFLFVBQVUsSUFBSSxHQUFHLEVBQUUsVUFBVSxJQUFJLEdBQUcsRUFBRSxhQUFhO0FBQUEsSUFDdEU7QUFBQSxFQUNGO0FBRUEsTUFBSSxPQUFzQztBQUMxQyxNQUFJLFFBQVE7QUFDVixVQUFNLElBQUksR0FBRyxNQUFNO0FBQ25CLFdBQU8sRUFBRSxZQUFZLEdBQUcsRUFBRSxVQUFVLElBQUksSUFBSSxHQUFHLEVBQUUsVUFBVSxJQUFJLEdBQUcsRUFBRSxRQUFRLElBQUksSUFBSTtBQUFBLEVBQ3RGO0FBRUEsUUFBTSxjQUNKLFNBQVMsTUFBTSxzQkFBc0IsRUFBRSxTQUFTLElBQzVDLEtBQUssTUFBTSxNQUFNLHNCQUFzQixFQUFFLE1BQU0sSUFDL0M7QUFNTixRQUFNLFFBQVEsS0FBSyxjQUEyQixXQUFXO0FBQ3pELFFBQU0sYUFBYSxRQUFRLEdBQUcsS0FBSyxJQUFJO0FBQ3ZDLFFBQU0sWUFBWSxDQUFDLFNBQWlCLFVBQWtCO0FBQ3BELFVBQU0sS0FBSyxhQUFhLEdBQUcsV0FBVyxpQkFBaUIsT0FBTyxDQUFDLElBQUk7QUFDbkUsVUFBTSxLQUFLLGFBQWEsR0FBRyxXQUFXLGlCQUFpQixLQUFLLENBQUMsSUFBSTtBQUNqRSxVQUFNLFdBQVcsS0FBSyxJQUFJLEtBQUssS0FBSyxXQUFXLEtBQUs7QUFDcEQsVUFBTSxhQUFhLEtBQUssSUFBSSxLQUFLLFdBQVcsS0FBSztBQUNqRCxXQUFPLEVBQUUsVUFBVSxXQUFXO0FBQUEsRUFDaEM7QUFDQSxRQUFNLFdBQVcsVUFBVSxhQUFhLGtCQUFrQjtBQUMxRCxRQUFNLFdBQVcsVUFBVSxhQUFhLGtCQUFrQjtBQUMxRCxRQUFNLFdBQVcsVUFBVSxhQUFhLGtCQUFrQjtBQUMxRCxRQUFNLGFBQWEsTUFBTTtBQUN2QixVQUFNLFdBQVcsR0FBRyxpQkFBaUIsU0FBUyxlQUFlLEVBQUUsUUFBUTtBQUN2RSxXQUFPLEVBQUUsWUFBWSxXQUFXLElBQUk7QUFBQSxFQUN0QztBQUdBLFFBQU0sYUFBYSxHQUFHLE9BQU8sRUFBRTtBQUMvQixRQUFNLE9BQU8sT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVO0FBQ2pELFFBQU0sT0FBTztBQUFBLElBQ1gsT0FBTyxhQUFhLE1BQU0sWUFBWTtBQUFBLElBQ3RDLEtBQUssYUFBYSxNQUFNLFVBQVU7QUFBQSxFQUNwQztBQUdBLFNBQU87QUFBQSxJQUNMLFVBQVUsRUFBRSxPQUFPLGVBQWUsUUFBUSxlQUFlO0FBQUEsSUFDekQsTUFBTSxFQUFFLE9BQU8sV0FBVyxRQUFRLFdBQVc7QUFBQSxJQUM3QyxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsTUFDVCxRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsZUFBZSxLQUFLLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSTtBQUFBLElBQ2pEO0FBQUEsSUFDQSxJQUFJLE1BQU07QUFBQSxJQUNWLElBQUksTUFBTTtBQUFBLElBQ1YsSUFBSSxNQUFNO0FBQUEsSUFDVjtBQUFBLElBQ0EsTUFBTSxRQUFRLFdBQVc7QUFBQSxJQUN6QjtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0Y7QUFNQSxlQUFzQixtQkFBbUIsS0FBeUI7QUFDaEUsUUFBTSxJQUFJLGNBQWMsR0FBRztBQUMzQixNQUFJLENBQUMsR0FBRztBQUNOLFFBQUksdUJBQU8sb0RBQW9EO0FBQy9EO0FBQUEsRUFDRjtBQUNBLFFBQU0sU0FBUyxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxhQUFhLENBQUM7QUFDbkUsTUFBSTtBQUNGLFVBQU0sVUFBVSxVQUFVLFVBQVUsTUFBTTtBQUFBLEVBQzVDLFNBQVMsT0FBTztBQUNkLFFBQUksdUJBQU8sMENBQTBDLE9BQU8sS0FBSyxDQUFDLEdBQUc7QUFBQSxFQUN2RTtBQUNGOzs7QUV6TUEsSUFBQUMsbUJBQWlEOzs7QUNBakQsSUFBQUMsbUJBQXlDO0FBR2xDLFNBQVMsWUFBWSxLQUFxQztBQUMvRCxRQUFNLE9BQU8sSUFBSSxVQUFVLG9CQUFvQiw2QkFBWTtBQUMzRCxTQUFPLE9BQU8sS0FBSyxRQUFRLElBQUk7QUFDakM7QUFRTyxTQUFTLGNBQWMsS0FBbUI7QUFDL0MsUUFBTSxPQUFPLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDM0QsTUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLE1BQU0sU0FBVSxRQUFPO0FBQ2pELFFBQU0sUUFBUSxLQUFLLFNBQVM7QUFDNUIsTUFBSSxNQUFNLFdBQVcsS0FBTSxRQUFPO0FBQ2xDLE1BQUksTUFBTSxXQUFXLE1BQU8sUUFBTztBQUNuQyxTQUFPLENBQUMsQ0FBQyxLQUFLLFVBQVUsY0FBYywrQ0FBK0M7QUFDdkY7QUFHTyxTQUFTLGNBQWMsS0FBVSxNQUE2QztBQUNuRixRQUFNLFFBQVEsSUFBSSxjQUFjLGFBQWEsSUFBSTtBQUNqRCxTQUFPLE9BQU8sZUFBZTtBQUMvQjtBQUdPLFNBQVMsa0JBQWtCLEtBQTBDO0FBQzFFLFFBQU0sT0FBTyxJQUFJLFVBQVUsY0FBYztBQUN6QyxTQUFPLE9BQU8sY0FBYyxLQUFLLElBQUksSUFBSTtBQUMzQzs7O0FEbEJPLElBQU0sb0JBQW9CO0FBQUEsRUFDL0I7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFHQSxJQUFNLGlCQUFpQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFHQSxTQUFTLE1BQU0sSUFBMkI7QUFDeEMsU0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZLE9BQU8sV0FBVyxTQUFTLEVBQUUsQ0FBQztBQUNoRTtBQU1BLFNBQVMsWUFBWSxRQUFpQyxRQUF1QztBQUMzRixhQUFXLE9BQU8sZ0JBQWdCO0FBQ2hDLFVBQU0sVUFBVSxPQUFPLEdBQUc7QUFDMUIsUUFBSSxDQUFDLFdBQVcsZUFBZSxRQUFTO0FBQ3hDLFVBQU0sV0FBVyxPQUFPLEdBQUc7QUFDM0IsUUFBSSxZQUFZLEVBQUUsZUFBZSxVQUFXO0FBQzVDLFdBQU8sR0FBRyxJQUFJO0FBQUEsRUFDaEI7QUFFQSxhQUFXLE9BQU87QUFBQSxJQUNoQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGLEdBQUc7QUFDRCxVQUFNLFFBQVEsT0FBTyxHQUFHO0FBQ3hCLFFBQUksVUFBVSxVQUFhLFVBQVUsS0FBTTtBQUMzQyxRQUFJLE1BQU0sUUFBUSxLQUFLLEtBQUssTUFBTSxXQUFXLEVBQUc7QUFDaEQsUUFBSSxPQUFPLFVBQVUsWUFBWSxDQUFDLE1BQU0sUUFBUSxLQUFLLEtBQUssT0FBTyxLQUFLLEtBQUssRUFBRSxXQUFXO0FBQ3RGO0FBQ0YsUUFBSSxPQUFPLEdBQUcsTUFBTSxPQUFXLFFBQU8sR0FBRyxJQUFJO0FBQUEsRUFDL0M7QUFDRjtBQU1BLFNBQVMsVUFDUCxNQUNBLFNBQ3lCO0FBQ3pCLFFBQU0sTUFBK0IsQ0FBQztBQUN0QyxhQUFXLFdBQVcsZ0JBQWdCO0FBQ3BDLFVBQU0sSUFBSyxLQUFLLE9BQU8sS0FBSyxDQUFDO0FBQzdCLFVBQU0sSUFBSyxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ2hDLFVBQU0sT0FBTyxvQkFBSSxJQUFJLENBQUMsR0FBRyxPQUFPLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzNELFVBQU0sUUFBMkQsQ0FBQztBQUNsRSxlQUFXLE9BQU8sTUFBTTtBQUN0QixVQUFJLEVBQUUsR0FBRyxNQUFNLEVBQUUsR0FBRyxHQUFHO0FBQ3JCLGNBQU0sR0FBRyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxhQUFhLFNBQVMsRUFBRSxHQUFHLEtBQUssWUFBWTtBQUFBLE1BQzdFO0FBQUEsSUFDRjtBQUNBLFFBQUksT0FBTyxLQUFLLEtBQUssRUFBRSxTQUFTLEVBQUcsS0FBSSxPQUFPLElBQUk7QUFBQSxFQUNwRDtBQUNBLFNBQU87QUFDVDtBQUdBLFNBQVMsYUFBYSxLQUEwQztBQUM5RCxRQUFNLE9BQU8sSUFBSSxVQUFVLG9CQUFvQiw2QkFBWTtBQUMzRCxNQUFJLENBQUMsS0FBTSxRQUFPO0FBQ2xCLFFBQU0sU0FBUyxLQUFLLFFBQVEsTUFBTTtBQUNsQyxRQUFNLFlBQVksS0FBSztBQUd2QixRQUFNLE9BQU8sQ0FBQyxTQUF1QztBQUNuRCxlQUFXLE9BQU8sTUFBTTtBQUN0QixZQUFNLEtBQUssVUFBVSxjQUEyQixHQUFHO0FBQ25ELFVBQUksR0FBSSxRQUFPO0FBQUEsSUFDakI7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNBLFFBQU0sUUFBUSxDQUFDLElBQXdCLFVBQTRDO0FBQ2pGLFFBQUksQ0FBQyxHQUFJLFFBQU8sRUFBRSxhQUFhLDJCQUEyQjtBQUMxRCxVQUFNLEtBQUssaUJBQWlCLEVBQUU7QUFDOUIsVUFBTSxNQUE4QixDQUFDO0FBQ3JDLGVBQVcsS0FBSyxPQUFPO0FBQ3JCLFlBQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsS0FBSztBQUN0QyxVQUFJLEVBQUcsS0FBSSxDQUFDLElBQUk7QUFBQSxJQUNsQjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQ0EsUUFBTSxPQUFPLGlCQUFpQixTQUFTLElBQUk7QUFDM0MsUUFBTSxTQUFTLENBQUMsU0FBeUIsS0FBSyxpQkFBaUIsSUFBSSxFQUFFLEtBQUs7QUFFMUUsUUFBTSxZQUFZLEtBQUs7QUFBQSxJQUNyQixTQUNJLDhDQUNBO0FBQUEsRUFDTixDQUFDO0FBQ0QsUUFBTSxPQUFPLEtBQUs7QUFBQSxJQUNoQixTQUNJLGdFQUNBO0FBQUEsRUFDTixDQUFDO0FBQ0QsUUFBTSxLQUFLLEtBQUs7QUFBQSxJQUNkLFNBQVMsK0NBQStDO0FBQUEsSUFDeEQsU0FDSSxxQ0FDQTtBQUFBLEVBQ04sQ0FBQztBQUNELFFBQU0sV0FBVyxLQUFLO0FBQUEsSUFDcEIsU0FBUyxxREFBcUQ7QUFBQSxJQUM5RCxTQUFTLHVCQUF1QjtBQUFBLEVBQ2xDLENBQUM7QUFDRCxRQUFNLE1BQU0sS0FBSztBQUFBLElBQ2YsU0FDSSxzQ0FDQTtBQUFBLElBQ0osU0FBUyxrREFBa0Q7QUFBQSxJQUMzRCxTQUFTLHFEQUFxRDtBQUFBLEVBQ2hFLENBQUM7QUFDRCxRQUFNLFFBQVEsS0FBSztBQUFBLElBQ2pCLFNBQVMsNkNBQTZDO0FBQUEsSUFDdEQsU0FDSSxpREFDQTtBQUFBLEVBQ04sQ0FBQztBQUNELFFBQU0sYUFBYSxLQUFLO0FBQUEsSUFDdEIsU0FBUyx1Q0FBdUM7QUFBQSxJQUNoRCxTQUNJLGtEQUNBO0FBQUEsRUFDTixDQUFDO0FBQ0QsUUFBTSxRQUFRLEtBQUs7QUFBQSxJQUNqQixTQUFTLHdDQUF3QztBQUFBLElBQ2pELFNBQVMsbUJBQW1CO0FBQUEsRUFDOUIsQ0FBQztBQUNELFFBQU0sTUFBTSxLQUFLO0FBQUEsSUFDZixTQUFTLHNDQUFzQztBQUFBLElBQy9DLFNBQVMsaUJBQWlCO0FBQUEsSUFDMUI7QUFBQTtBQUFBLEVBQ0YsQ0FBQztBQUNELFFBQU0sS0FBSyxLQUFLO0FBQUEsSUFDZCxTQUFTLHFDQUFxQztBQUFBLElBQzlDLFNBQVMsZ0JBQWdCO0FBQUEsSUFDekIsU0FBUyxXQUFXO0FBQUEsRUFDdEIsQ0FBQztBQU1ELFFBQU0sa0JBQWtCLFVBQVUsY0FBYywrQkFBK0IsR0FBRyxhQUFhO0FBQy9GLFFBQU0sVUFBb0IsQ0FBQztBQUMzQixNQUFJLFFBQVE7QUFDVixVQUFNLE9BQU8sb0JBQUksSUFBWTtBQUM3QixjQUNHLGlCQUFpQixpQ0FBaUMsRUFDbEQsUUFBUSxDQUFDLE9BQU8sS0FBSyxJQUFJLEdBQUcsUUFBUSxZQUFZLENBQUMsQ0FBQztBQUNyRCxZQUFRLEtBQUssR0FBRyxJQUFJO0FBQUEsRUFDdEI7QUFLQSxRQUFNLFlBQTBELENBQUM7QUFDakUsTUFBSSxRQUFRO0FBQ1YsY0FBVSxpQkFBaUIsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLElBQUksTUFBTTtBQUNsRSxVQUFJLEtBQUssRUFBRztBQUNaLFlBQU0sS0FBSyxpQkFBaUIsRUFBRTtBQUM5QixnQkFBVSxLQUFLO0FBQUEsUUFDYixXQUFXLEdBQUc7QUFBQSxRQUNkLGFBQWEsR0FBRyxpQkFBaUIsY0FBYyxFQUFFLEtBQUs7QUFBQSxNQUN4RCxDQUFDO0FBQUEsSUFDSCxDQUFDO0FBQUEsRUFDSDtBQUlBLFFBQU0sbUJBQW1CLE1BQU07QUFDN0IsVUFBTSxNQUFNLFNBQ1IsOENBQ0E7QUFDSixVQUFNLEtBQUssVUFBVSxjQUEyQixHQUFHO0FBQ25ELFdBQU8sS0FBSyxpQkFBaUIsRUFBRSxFQUFFLFVBQVU7QUFBQSxFQUM3QyxHQUFHO0FBQ0gsUUFBTSxlQUFlLE1BQU07QUFDekIsUUFBSSxDQUFDLEdBQUksUUFBTztBQUNoQixRQUFJLE1BQU07QUFDVixRQUFJLE9BQTJCO0FBQy9CLFdBQU8sUUFBUSxTQUFTLGFBQWEsU0FBUyxTQUFTLE1BQU07QUFDM0QsYUFBTyxLQUFLO0FBQ1osYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUNBLFdBQU87QUFBQSxFQUNULEdBQUc7QUFJSCxRQUFNLFNBQVMsU0FDWCxVQUFVLGNBQTJCLGFBQWEsSUFDbEQsVUFBVSxjQUEyQiwrQ0FBK0M7QUFDeEYsUUFBTSxrQkFBa0IsTUFBTTtBQUM1QixRQUFJLENBQUMsTUFBTSxDQUFDLE9BQVEsUUFBTztBQUMzQixXQUFPLEtBQUssTUFBTSxHQUFHLHNCQUFzQixFQUFFLE1BQU0sT0FBTyxzQkFBc0IsRUFBRSxHQUFHO0FBQUEsRUFDdkYsR0FBRztBQUNILFFBQU0sbUJBQW1CLE1BQU07QUFDN0IsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFRLFFBQU87QUFDM0IsV0FBTyxLQUFLLE1BQU0sR0FBRyxzQkFBc0IsRUFBRSxPQUFPLE9BQU8sc0JBQXNCLEVBQUUsSUFBSTtBQUFBLEVBQ3pGLEdBQUc7QUFDSCxRQUFNLG1CQUFtQixNQUFNO0FBQzdCLFFBQUksQ0FBQyxPQUFRLFFBQU87QUFDcEIsV0FBTyxNQUFNLEtBQUssT0FBTyxRQUFRLEVBQzlCLE1BQU0sR0FBRyxDQUFDLEVBQ1YsSUFBSSxDQUFDLE9BQU87QUFDWCxZQUFNLEtBQUssaUJBQWlCLEVBQUU7QUFDOUIsYUFBTztBQUFBLFFBQ0wsS0FBTSxHQUFtQixhQUFhLEdBQUcsUUFBUSxZQUFZO0FBQUEsUUFDN0QsU0FBUyxHQUFHO0FBQUEsUUFDWixRQUFRLEtBQUssTUFBTSxHQUFHLHNCQUFzQixFQUFFLE1BQU07QUFBQSxRQUNwRCxXQUFXLEdBQUc7QUFBQSxRQUNkLFlBQVksR0FBRztBQUFBLFFBQ2YsY0FBYyxHQUFHO0FBQUEsUUFDakIsZUFBZSxHQUFHO0FBQUEsTUFDcEI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNMLEdBQUc7QUFJSCxRQUFNLFlBQVksTUFBTTtBQUN0QixRQUFJLENBQUMsT0FBUSxRQUFPO0FBQ3BCLFVBQU0sUUFBMkQsQ0FBQztBQUNsRSxRQUFJLE9BQTJCO0FBQy9CLFdBQU8sUUFBUSxTQUFTLGFBQWEsU0FBUyxTQUFTLE1BQU07QUFDM0QsWUFBTSxLQUFLLGlCQUFpQixJQUFJO0FBQ2hDLFlBQU0sS0FBSztBQUFBLFFBQ1QsS0FBSyxLQUFLLGFBQWEsS0FBSyxRQUFRLFlBQVk7QUFBQSxRQUNoRCxRQUFRLEdBQUc7QUFBQSxRQUNYLFFBQVEsR0FBRztBQUFBLE1BQ2IsQ0FBQztBQUNELGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFDQSxXQUFPO0FBQUEsRUFDVCxHQUFHO0FBS0gsUUFBTSxlQUFlLE1BQU07QUFDekIsUUFBSSxDQUFDLE9BQVEsUUFBTztBQUNwQixVQUFNLFVBQVUsVUFBVSxjQUEyQixhQUFhO0FBQ2xFLFFBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxhQUFhLG1CQUFtQixFQUFHLFFBQU87QUFDbkUsVUFBTSxLQUFLLGlCQUFpQixTQUFTLFVBQVU7QUFDL0MsV0FBTztBQUFBLE1BQ0wsU0FBUyxHQUFHO0FBQUEsTUFDWixTQUFTLEdBQUc7QUFBQSxNQUNaLFVBQVUsR0FBRztBQUFBLE1BQ2IsS0FBSyxHQUFHO0FBQUEsTUFDUixNQUFNLEdBQUc7QUFBQSxNQUNULFlBQVksR0FBRztBQUFBLE1BQ2YsWUFBWSxHQUFHO0FBQUEsTUFDZixVQUFVLEdBQUc7QUFBQSxNQUNiLFlBQVksR0FBRztBQUFBLE1BQ2YsWUFBWSxHQUFHO0FBQUEsTUFDZixhQUFhLEdBQUc7QUFBQSxNQUNoQixPQUFPLEdBQUc7QUFBQSxNQUNWLGVBQWUsR0FBRztBQUFBLE1BQ2xCLGVBQWUsR0FBRztBQUFBLE1BQ2xCLGFBQWEsR0FBRztBQUFBLE1BQ2hCLGFBQWEsR0FBRztBQUFBLE1BQ2hCLHFCQUFxQixHQUFHO0FBQUEsTUFDeEIsb0JBQW9CLEdBQUc7QUFBQSxNQUN2QixzQkFBc0IsR0FBRztBQUFBLE1BQ3pCLGlCQUFpQixHQUFHO0FBQUEsSUFDdEI7QUFBQSxFQUNGLEdBQUc7QUFFSCxRQUFNLE9BQU87QUFBQSxJQUNYLE1BQU0sU0FBUyx3QkFBd0I7QUFBQTtBQUFBLElBRXZDLGNBQWMsU0FBUyxLQUFLLFVBQVUsU0FBUyxvQkFBb0I7QUFBQSxJQUNuRSxTQUFTLFNBQVMsVUFBVTtBQUFBLElBQzVCLGlCQUFpQixTQUFTLGtCQUFrQjtBQUFBLElBQzVDLGFBQWEsU0FBUyxjQUFjLEdBQUcsSUFBSTtBQUFBLElBQzNDLFdBQVcsU0FBUyxZQUFZO0FBQUEsSUFDaEMsMEJBQTBCO0FBQUEsSUFDMUI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxPQUFPO0FBQUEsSUFDUCxXQUFXLE1BQU0sV0FBVztBQUFBLE1BQzFCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVyxNQUFNLE1BQU07QUFBQSxNQUNyQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUksTUFBTSxJQUFJO0FBQUEsTUFDWjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFVBQVUsTUFBTSxVQUFVO0FBQUEsTUFDeEI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVyxNQUFNLEtBQUs7QUFBQSxNQUNwQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFlBQVksTUFBTSxPQUFPO0FBQUEsTUFDdkI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxZQUFZLE1BQU0sWUFBWTtBQUFBLE1BQzVCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxPQUFPLE1BQU0sT0FBTyxDQUFDLGFBQWEsZUFBZSxTQUFTLGlCQUFpQixDQUFDO0FBQUEsSUFDNUUsT0FBTyxNQUFNLEtBQUssQ0FBQyxXQUFXLGVBQWUsZ0JBQWdCLGFBQWEsT0FBTyxDQUFDO0FBQUEsSUFDbEYsZ0JBQWdCLE1BQU0sSUFBSSxDQUFDLGNBQWMsaUJBQWlCLG9CQUFvQixRQUFRLENBQUM7QUFBQSxJQUN2RixjQUFjO0FBQUEsTUFDWixlQUFlLE9BQU8sYUFBYTtBQUFBLE1BQ25DLHdCQUF3QixPQUFPLHNCQUFzQjtBQUFBLE1BQ3JELGFBQWEsT0FBTyxXQUFXO0FBQUEsTUFDL0Isb0JBQW9CLE9BQU8sa0JBQWtCO0FBQUEsTUFDN0MsZUFBZSxPQUFPLGFBQWE7QUFBQSxNQUNuQyxnQkFBZ0IsT0FBTyxjQUFjO0FBQUEsTUFDckMsY0FBYyxPQUFPLFlBQVk7QUFBQSxNQUNqQyxtQkFBbUIsT0FBTyxpQkFBaUI7QUFBQSxNQUMzQyxzQkFBc0IsT0FBTyxvQkFBb0I7QUFBQSxNQUNqRCxlQUFlLE9BQU8sYUFBYTtBQUFBLE1BQ25DLGtCQUFrQixPQUFPLGdCQUFnQjtBQUFBLE1BQ3pDLGlCQUFpQixPQUFPLGVBQWU7QUFBQSxNQUN2QyxlQUFlLE9BQU8sYUFBYTtBQUFBLE1BQ25DLGtCQUFrQixPQUFPLGdCQUFnQjtBQUFBLE1BQ3pDLGlCQUFpQixPQUFPLGVBQWU7QUFBQSxNQUN2Qyx3QkFBd0IsT0FBTyxzQkFBc0I7QUFBQSxNQUNyRCxpQ0FBaUMsT0FBTywrQkFBK0I7QUFBQSxNQUN2RSxrQkFBa0IsT0FBTyxnQkFBZ0I7QUFBQSxNQUN6QyxxQkFBcUIsT0FBTyxtQkFBbUI7QUFBQSxNQUMvQyxzQkFBc0IsT0FBTyxvQkFBb0I7QUFBQSxNQUNqRCxvQkFBb0IsT0FBTyxrQkFBa0I7QUFBQSxJQUMvQztBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQ1Q7QUFVQSxlQUFzQixlQUFlLFFBQTJDO0FBQzlFLFFBQU0sTUFBTSxPQUFPO0FBQ25CLE1BQUksQ0FBQyxTQUFTLEtBQUssVUFBVSxTQUFTLG9CQUFvQixHQUFHO0FBQzNELFFBQUksd0JBQU8scUVBQXFFO0FBQ2hGO0FBQUEsRUFDRjtBQUNBLFFBQU0sT0FBTyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQzNELE1BQUksQ0FBQyxNQUFNO0FBQ1QsUUFBSSx3QkFBTyx3Q0FBd0M7QUFDbkQ7QUFBQSxFQUNGO0FBQ0EsUUFBTSxZQUFZLEtBQUssUUFBUTtBQUMvQixRQUFNLGFBQWEsSUFBSSxVQUFVLGNBQWM7QUFDL0MsUUFBTSxPQUFPLElBQUksVUFBVSxRQUFRLEtBQUs7QUFHeEMsUUFBTSxPQUFnQyxDQUFDO0FBQ3ZDLGFBQVcsUUFBUSxtQkFBbUI7QUFDcEMsVUFBTSxJQUFJLElBQUksTUFBTSxzQkFBc0IsU0FBUyxJQUFJLEtBQUs7QUFDNUQsUUFBSSxFQUFFLGFBQWEsd0JBQVE7QUFDM0IsVUFBTSxLQUFLLFNBQVMsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLFNBQVMsRUFBRSxDQUFDO0FBQ3BELFVBQU0sTUFBTSxHQUFHO0FBQ2YsVUFBTSxJQUFJLGFBQWEsR0FBRztBQUMxQixRQUFJLEVBQUcsYUFBWSxNQUFNLENBQUM7QUFBQSxFQUM1QjtBQUdBLE1BQUksVUFBMEM7QUFDOUMsUUFBTSxPQUFPLElBQUksTUFBTSxzQkFBc0IsMEJBQTBCO0FBQ3ZFLE1BQUksZ0JBQWdCLHdCQUFPO0FBQ3pCLFVBQU0sS0FBSyxTQUFTLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxVQUFVLEVBQUUsQ0FBQztBQUN4RCxVQUFNLE1BQU0sR0FBRztBQUNmLGNBQVUsYUFBYSxHQUFHO0FBQUEsRUFDNUI7QUFHQSxNQUFJLFlBQVk7QUFDZCxVQUFNLEtBQUssU0FBUyxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sVUFBVSxFQUFFLENBQUM7QUFDOUQsV0FBTyxRQUFRO0FBQUEsRUFDakI7QUFDQSxNQUFJLENBQUMsU0FBUztBQUNaLFFBQUksd0JBQU8sc0NBQXNDO0FBQ2pEO0FBQUEsRUFDRjtBQUVBLFFBQU0sVUFBVSxFQUFFLE1BQU0sU0FBUyxNQUFNLFVBQVUsTUFBTSxPQUFPLEVBQUU7QUFDaEUsTUFBSTtBQUNGLFVBQU0sSUFBSSxNQUFNLFFBQVEsTUFBTSw2QkFBNkIsS0FBSyxVQUFVLFNBQVMsTUFBTSxDQUFDLENBQUM7QUFDM0YsUUFBSSx3QkFBTywrREFBMEQ7QUFBQSxFQUN2RSxTQUFTLE9BQU87QUFDZCxRQUFJLHdCQUFPLDhDQUE4QyxPQUFPLEtBQUssQ0FBQyxHQUFHO0FBQUEsRUFDM0U7QUFDRjtBQUdPLFNBQVMscUJBQXFCLFFBQWtDO0FBQ3JFLFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFVBQVUsTUFBTSxLQUFLLGVBQWUsTUFBTTtBQUFBLEVBQzVDLENBQUM7QUFDSDs7O0FFaGZPLElBQU0sZ0JBQXdDO0FBQUEsRUFDbkQsRUFBRSxJQUFJLE9BQU8sT0FBTyxnQkFBZ0I7QUFBQSxFQUNwQyxFQUFFLElBQUksVUFBVSxPQUFPLGlCQUFpQjtBQUFBLEVBQ3hDLEVBQUUsSUFBSSxTQUFTLE9BQU8sYUFBYTtBQUFBLEVBQ25DLEVBQUUsSUFBSSxXQUFXLE9BQU8sVUFBVTtBQUFBLEVBQ2xDLEVBQUUsSUFBSSxVQUFVLE9BQU8sY0FBYztBQUFBLEVBQ3JDLEVBQUUsSUFBSSxTQUFTLE9BQU8sZ0JBQWdCO0FBQ3hDO0FBb0NPLElBQU0sbUJBQXlDO0FBQUEsRUFDcEQsZ0JBQWdCO0FBQUEsRUFDaEIsaUJBQWlCO0FBQUEsRUFDakIsY0FBYztBQUFBLEVBQ2QsZUFBZTtBQUFBLEVBQ2YsV0FBVztBQUFBLEVBQ1gsaUJBQWlCO0FBQUEsRUFDakIsZ0JBQWdCO0FBQUEsRUFDaEIsYUFBYTtBQUFBLEVBQ2IsYUFBYTtBQUFBLEVBQ2IsZUFBZTtBQUFBLEVBQ2YsbUJBQW1CO0FBQUEsRUFDbkIscUJBQXFCO0FBQUEsRUFDckIsYUFBYTtBQUNmO0FBR08sSUFBTSxXQUFXOzs7QUM1RGpCLFNBQVMsaUJBQWlCLFFBQWtDO0FBRWpFLFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFVBQVUsWUFBWTtBQUNwQixhQUFPLFNBQVMsWUFBWSxDQUFDLE9BQU8sU0FBUztBQUM3QyxZQUFNLE9BQU8sYUFBYTtBQUMxQixhQUFPLFFBQVE7QUFBQSxJQUNqQjtBQUFBLEVBQ0YsQ0FBQztBQUVELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFVBQVUsTUFBTSxLQUFLLE9BQU8sb0JBQW9CO0FBQUEsRUFDbEQsQ0FBQztBQUVELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxPQUFPLE9BQU8sR0FBRyxLQUFLLElBQUksQ0FBQztBQUFBLElBQ25ELGVBQWUsQ0FBQyxhQUFhO0FBQzNCLFVBQUksQ0FBQyxTQUFTLEtBQUssVUFBVSxTQUFTLG9CQUFvQixFQUFHLFFBQU87QUFDcEUsVUFBSSxDQUFDLFNBQVUsUUFBTyxjQUFjO0FBQ3BDLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBRUQsU0FBTyxXQUFXO0FBQUEsSUFDaEIsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLEVBQUUsV0FBVyxDQUFDLE9BQU8sT0FBTyxHQUFHLEtBQUssWUFBWSxDQUFDO0FBQUEsSUFDM0QsVUFBVSxNQUFNLE9BQU8sU0FBUyxNQUFNO0FBQUEsRUFDeEMsQ0FBQztBQUNELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxPQUFPLE9BQU8sR0FBRyxLQUFLLGFBQWEsQ0FBQztBQUFBLElBQzVELFVBQVUsTUFBTSxPQUFPLFNBQVMsTUFBTTtBQUFBLEVBQ3hDLENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsT0FBTyxPQUFPLEdBQUcsS0FBSyxJQUFJLENBQUM7QUFBQTtBQUFBO0FBQUEsSUFHbkQsZUFBZSxDQUFDLGFBQWE7QUFDM0IsWUFBTSxPQUFPLE9BQU8sSUFBSSxVQUFVLGNBQWM7QUFDaEQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLFlBQVksU0FBUyxJQUFJLEVBQUcsUUFBTztBQUN4RCxZQUFNLE9BQU8sT0FBTyxZQUFZLGVBQWUsSUFBSTtBQUNuRCxVQUFJLENBQUMsS0FBTSxRQUFPO0FBQ2xCLFVBQUksQ0FBQyxTQUFVLE1BQUssT0FBTyxZQUFZLGtCQUFrQixNQUFNLElBQUk7QUFDbkUsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFHRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUE7QUFBQTtBQUFBLElBR04sVUFBVSxNQUFNLEtBQUssT0FBTyxZQUFZLGlCQUFpQixPQUFPLFlBQVksY0FBYyxDQUFDO0FBQUEsRUFDN0YsQ0FBQztBQUVELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGVBQWUsQ0FBQyxhQUFhO0FBQzNCLFVBQUksQ0FBQyxTQUFTLEtBQUssVUFBVSxTQUFTLG9CQUFvQixFQUFHLFFBQU87QUFDcEUsVUFBSSxDQUFDLFNBQVUsTUFBSyxtQkFBbUIsT0FBTyxHQUFHO0FBQ2pELGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBRUQsU0FBTyxXQUFXO0FBQUEsSUFDaEIsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLEVBQUUsV0FBVyxDQUFDLE9BQU8sT0FBTyxHQUFHLEtBQUssSUFBSSxDQUFDO0FBQUEsSUFDbkQsZUFBZSxDQUFDLGFBQWE7QUFDM0IsWUFBTSxPQUFPLE9BQU8sSUFBSSxVQUFVLGNBQWM7QUFDaEQsVUFBSSxDQUFDLEtBQU0sUUFBTztBQUNsQixZQUFNLEtBQUssY0FBYyxPQUFPLEtBQUssSUFBSTtBQUN6QyxVQUFJLE9BQU8sUUFBUSxFQUFFLFlBQVksSUFBSyxRQUFPO0FBQzdDLFVBQUksQ0FBQyxTQUFVLFFBQU8sYUFBYTtBQUNuQyxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUVELE1BQUksS0FBVSxzQkFBcUIsTUFBTTtBQUMzQzs7O0FDbkdBLElBQUFDLG1CQUFtQzs7O0FDVTVCLElBQU0saUJBQWlCO0FBK0J2QixTQUFTLFlBQ2QsYUFDQSxVQUNBLFNBQ2lCO0FBSWpCLFFBQU0sY0FBYyxvQkFBSSxJQUFZLENBQUMsV0FBVyxDQUFDO0FBQ2pELE1BQUksT0FBTztBQUNYLGFBQVM7QUFDUCxVQUFNLE9BQU8sUUFBUSxJQUFJO0FBQ3pCLFFBQUksQ0FBQyxRQUFRLFlBQVksSUFBSSxJQUFJLEVBQUc7QUFDcEMsZ0JBQVksSUFBSSxJQUFJO0FBQ3BCLFdBQU87QUFBQSxFQUNUO0FBR0EsUUFBTSxRQUFrQixDQUFDO0FBQ3pCLFFBQU0sVUFBVSxvQkFBSSxJQUFZO0FBQ2hDLE1BQUksTUFBMEI7QUFDOUIsU0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLEdBQUcsR0FBRztBQUMvQixZQUFRLElBQUksR0FBRztBQUNmLFVBQU0sS0FBSyxHQUFHO0FBQ2QsVUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQUEsRUFDdkI7QUFFQSxRQUFNLFFBQVEsTUFBTSxRQUFRLFdBQVc7QUFDdkMsTUFBSSxVQUFVLEdBQUksUUFBTztBQUN6QixTQUFPLEVBQUUsT0FBTyxNQUFNO0FBQ3hCO0FBT08sU0FBUyxhQUFhLE9BQWdCLE1BQWMsZ0JBQTBCO0FBQ25GLFFBQU0sT0FBa0IsQ0FBQztBQUN6QixRQUFNLFVBQVUsQ0FBQyxNQUFxQjtBQUNwQyxRQUFJLE1BQU0sUUFBUSxDQUFDLEdBQUc7QUFDcEIsaUJBQVcsUUFBUSxFQUFHLFNBQVEsSUFBSTtBQUFBLElBQ3BDLE9BQU87QUFDTCxXQUFLLEtBQUssQ0FBQztBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQ0EsVUFBUSxLQUFLO0FBRWIsUUFBTSxNQUFnQixDQUFDO0FBQ3ZCLGFBQVcsUUFBUSxNQUFNO0FBQ3ZCLFVBQU0sT0FBTyxnQkFBZ0IsSUFBSTtBQUNqQyxRQUFJLEtBQU0sS0FBSSxLQUFLLElBQUk7QUFDdkIsUUFBSSxJQUFJLFVBQVUsSUFBSztBQUFBLEVBQ3pCO0FBQ0EsU0FBTztBQUNUO0FBT08sU0FBUyxnQkFBZ0IsT0FBZ0IsTUFBYyxnQkFBMEI7QUFDdEYsUUFBTSxPQUFrQixDQUFDO0FBQ3pCLFFBQU0sVUFBVSxDQUFDLE1BQXFCO0FBQ3BDLFFBQUksTUFBTSxRQUFRLENBQUMsR0FBRztBQUNwQixpQkFBVyxRQUFRLEVBQUcsU0FBUSxJQUFJO0FBQUEsSUFDcEMsT0FBTztBQUNMLFdBQUssS0FBSyxDQUFDO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFDQSxVQUFRLEtBQUs7QUFFYixRQUFNLE1BQWdCLENBQUM7QUFDdkIsYUFBVyxRQUFRLE1BQU07QUFDdkIsUUFBSSxPQUFPLFNBQVMsU0FBVTtBQUM5QixVQUFNLFVBQVUsS0FBSyxLQUFLO0FBQzFCLFFBQUksQ0FBQyxRQUFTO0FBQ2QsUUFBSSxLQUFLLE9BQU87QUFDaEIsUUFBSSxJQUFJLFVBQVUsSUFBSztBQUFBLEVBQ3pCO0FBQ0EsU0FBTztBQUNUO0FBVU8sU0FBUyxnQkFBZ0IsT0FBK0I7QUFDN0QsTUFBSSxPQUFPLFVBQVUsU0FBVSxRQUFPO0FBQ3RDLFFBQU0sVUFBVSxNQUFNLEtBQUs7QUFDM0IsTUFBSSxDQUFDLFFBQVMsUUFBTztBQUNyQixTQUFPLFFBQVEsUUFBUSxTQUFTLEVBQUUsRUFBRSxRQUFRLFNBQVMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSztBQUM1RjtBQUdPLFNBQVMsWUFBWSxPQUF3QjtBQUNsRCxNQUFJLFVBQVUsUUFBUSxVQUFVLE9BQVcsUUFBTztBQUNsRCxVQUFRLE9BQU8sT0FBTztBQUFBLElBQ3BCLEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsVUFBSTtBQUNGLGVBQU8sS0FBSyxVQUFVLEtBQUssS0FBSztBQUFBLE1BQ2xDLFFBQVE7QUFFTixlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0YsS0FBSztBQUFBLElBQ0wsS0FBSztBQUFBLElBQ0wsS0FBSztBQUNILGFBQU8sT0FBTyxLQUFLO0FBQUEsSUFDckI7QUFFRSxhQUFPLE9BQU87QUFBQSxFQUNsQjtBQUNGOzs7QUNoR08sU0FBUyxlQUFlLE9BQWlEO0FBQzlFLFFBQU0sRUFBRSxhQUFhLGFBQWEsSUFBSTtBQUN0QyxRQUFNLFdBQVcsYUFBYSxDQUFDO0FBRS9CLE1BQUksVUFBVTtBQUNaLFVBQU0sV0FBVyxnQkFBZ0IsUUFBUTtBQUN6QyxRQUFJLFlBQVksWUFBWSxRQUFRLEtBQUssYUFBYSxhQUFhO0FBQ2pFLFVBQUksQ0FBQyxNQUFNLGNBQWMsSUFBSSxRQUFRLEdBQUc7QUFHdEMsZUFBTyxFQUFFLFNBQVMsVUFBVSxjQUFjLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRTtBQUFBLE1BQzdEO0FBRUEsWUFBTUMsV0FBVSxXQUFXLEdBQUcsV0FBVyxTQUFTLE1BQU0sYUFBYTtBQUNyRSxhQUFPO0FBQUEsUUFDTCxTQUFBQTtBQUFBLFFBQ0EsY0FBYyxDQUFDLFFBQVE7QUFBQSxRQUN2QixVQUFVLENBQUMsRUFBRSxNQUFNLGFBQWEsTUFBTSxDQUFDLEtBQUtBLFFBQU8sSUFBSSxFQUFFLENBQUM7QUFBQSxNQUM1RDtBQUFBLElBQ0Y7QUFBQSxFQUdGO0FBR0EsUUFBTSxVQUFVLFdBQVcsR0FBRyxXQUFXLFNBQVMsTUFBTSxhQUFhO0FBQ3JFLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQSxjQUFjLENBQUM7QUFBQSxJQUNmLFVBQVUsQ0FBQyxFQUFFLE1BQU0sYUFBYSxNQUFNLENBQUMsS0FBSyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQUEsRUFDNUQ7QUFDRjtBQVNPLFNBQVMsY0FBYyxPQUF5RDtBQUNyRixTQUFPO0FBQUEsSUFDTCxTQUFTLFdBQVcsbUJBQW1CLE1BQU0sYUFBYTtBQUFBLElBQzFELGNBQWMsQ0FBQztBQUFBLElBQ2YsVUFBVSxDQUFDO0FBQUEsRUFDYjtBQUNGO0FBR0EsU0FBUyxZQUFZLE1BQXVCO0FBQzFDLFNBQU8sS0FBSyxTQUFTLEtBQUssQ0FBQyxLQUFLLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxTQUFTLElBQUk7QUFDdEU7QUFHQSxTQUFTLFdBQVcsTUFBYyxVQUErQjtBQUMvRCxNQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRyxRQUFPO0FBQ2hDLFdBQVMsSUFBSSxLQUFLLEtBQUs7QUFDckIsVUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUM7QUFDOUIsUUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQUcsUUFBTztBQUFBLEVBQ3ZDO0FBQ0Y7OztBQzFGTyxTQUFTLGlCQUNkLE9BQ0EsYUFDaUI7QUFDakIsUUFBTSxXQUE0QixDQUFDO0FBQ25DLFdBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxRQUFRLEtBQUs7QUFDckMsVUFBTSxPQUFPLE1BQU0sQ0FBQztBQUNwQixRQUFJLENBQUMsUUFBUSxZQUFZLElBQUksSUFBSSxFQUFHO0FBRXBDLFFBQUksSUFBSSxJQUFJO0FBQ1osV0FBTyxJQUFJLE1BQU0sVUFBVSxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRztBQUN0RCxVQUFNLFdBQVcsSUFBSSxNQUFNLFNBQVMsTUFBTSxDQUFDLElBQUk7QUFDL0MsVUFBTSxVQUFVLGNBQWMsTUFBTSxJQUFJLENBQUMsS0FBSztBQUM5QyxRQUFJLFFBQVMsVUFBUyxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFBQSxFQUMvQztBQUNBLFNBQU87QUFDVDtBQVFPLFNBQVMsZ0JBQ2QsT0FDQSxhQUNBLFdBQ2U7QUFDZixNQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksSUFBSSxTQUFTLEVBQUcsUUFBTztBQUN0RCxRQUFNLFFBQVEsTUFBTSxRQUFRLFNBQVM7QUFDckMsTUFBSSxVQUFVLEdBQUksUUFBTztBQUN6QixXQUFTLElBQUksUUFBUSxHQUFHLElBQUksTUFBTSxRQUFRLEtBQUs7QUFDN0MsUUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFHLFFBQU8sTUFBTSxDQUFDO0FBQUEsRUFDaEQ7QUFDQSxXQUFTLElBQUksUUFBUSxHQUFHLEtBQUssR0FBRyxLQUFLO0FBQ25DLFFBQUksQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRyxRQUFPLE1BQU0sQ0FBQztBQUFBLEVBQ2hEO0FBQ0EsU0FBTztBQUNUOzs7QUh0RE8sSUFBTSxjQUFOLE1BQWtCO0FBQUEsRUFDdkIsWUFBb0IsS0FBVTtBQUFWO0FBQUEsRUFBVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU8vQixTQUFTLE1BQXNCO0FBQzdCLFVBQU0sS0FBSyxjQUFjLEtBQUssS0FBSyxJQUFJO0FBQ3ZDLFdBQVEsT0FBTyxRQUFRLFlBQVksTUFBTyxLQUFLLE9BQU8sS0FBSyxJQUFJLE1BQU07QUFBQSxFQUN2RTtBQUFBO0FBQUEsRUFHQSxRQUFRLE1BQThCO0FBQ3BDLFFBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxFQUFHLFFBQU87QUFDakMsV0FBTztBQUFBLE1BQ0wsS0FBSztBQUFBLE1BQ0wsQ0FBQyxTQUFTLEtBQUssVUFBVSxJQUFJO0FBQUEsTUFDN0IsQ0FBQyxTQUFTLEtBQUssT0FBTyxJQUFJO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdRLFVBQVUsTUFBd0I7QUFDeEMsVUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLHNCQUFzQixJQUFJO0FBQ25ELFFBQUksRUFBRSxhQUFhLHdCQUFRLFFBQU8sQ0FBQztBQUNuQyxVQUFNLEtBQUssY0FBYyxLQUFLLEtBQUssQ0FBQztBQUNwQyxVQUFNLFFBQVEsS0FBSyxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztBQUNqRCxXQUFPLE1BQ0osSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLGNBQWMscUJBQXFCLE1BQU0sSUFBSSxDQUFDLEVBQ3JFLE9BQU8sQ0FBQyxNQUFrQixDQUFDLENBQUMsQ0FBQyxFQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLElBQUk7QUFBQSxFQUN0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9RLE9BQU8sTUFBa0M7QUFDL0MsZUFBVyxLQUFLLEtBQUssSUFBSSxNQUFNLGlCQUFpQixHQUFHO0FBQ2pELFVBQUksRUFBRSxTQUFTLEtBQU07QUFDckIsVUFBSSxLQUFLLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQU0sUUFBTyxFQUFFO0FBQUEsSUFDbkQ7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUFBO0FBQUEsRUFHQSxPQUFPLE1BQXVCO0FBQzVCLFVBQU0sS0FBSyxjQUFjLEtBQUssS0FBSyxJQUFJO0FBQ3ZDLFVBQU0sUUFBUSxLQUFLLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2pELFdBQU8sTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxjQUFjLHFCQUFxQixNQUFNLEtBQUssSUFBSSxDQUFDO0FBQUEsRUFDN0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFBLGVBQWUsTUFBc0M7QUFDbkQsVUFBTSxLQUFLLGNBQWMsS0FBSyxLQUFLLElBQUk7QUFDdkMsVUFBTSxNQUFNLEtBQUssZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztBQUNsRCxVQUFNLGdCQUFnQixJQUFJLElBQUksS0FBSyxJQUFJLE1BQU0saUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7QUFDdEYsV0FBTyxlQUFLLEVBQUUsYUFBYSxLQUFLLFVBQVUsY0FBYyxLQUFLLGNBQWMsQ0FBQztBQUFBLEVBQzlFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLGdCQUFrQztBQUNoQyxVQUFNLGdCQUFnQixJQUFJLElBQUksS0FBSyxJQUFJLE1BQU0saUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7QUFDdEYsV0FBTyxjQUFRLEVBQUUsY0FBYyxDQUFDO0FBQUEsRUFDbEM7QUFBQTtBQUFBLEVBR0EsTUFBTSxrQkFBa0IsTUFBYSxNQUF3QixPQUFPLE1BQXFCO0FBQ3ZGLFVBQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxVQUFVLEtBQUssUUFBUSxJQUFJLEdBQUcsSUFBSTtBQUFBLEVBQ3JFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRQSxNQUFNLGlCQUFpQixNQUF1QztBQUM1RCxVQUFNLGFBQWEsS0FBSyxJQUFJLFVBQVUsY0FBYyxHQUFHLFFBQVE7QUFDL0QsVUFBTSxLQUFLO0FBQUEsTUFDVDtBQUFBLE1BQ0E7QUFBQSxNQUNBLFVBQVUsS0FBSyxJQUFJLFlBQVksaUJBQWlCLFVBQVUsR0FBRyxJQUFJO0FBQUEsSUFDbkU7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLE1BQWMsVUFDWixNQUNBLE1BQ0EsS0FDQSxPQUFPLE1BQ1E7QUFDZixVQUFNLFVBQVUsR0FBRyxHQUFHLEdBQUcsS0FBSyxPQUFPO0FBQ3JDLFVBQU0sY0FBYyxLQUFLLGFBQWEsSUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSTtBQUNuRixVQUFNLFVBQVU7QUFBQSxTQUFlLFdBQVc7QUFBQTtBQUFBO0FBRTFDLFFBQUk7QUFDSixRQUFJO0FBQ0YsZ0JBQVUsTUFBTSxLQUFLLElBQUksTUFBTSxPQUFPLFNBQVMsT0FBTztBQUFBLElBQ3hELFNBQVMsT0FBTztBQUNkLFVBQUksd0JBQU8sb0NBQW9DLEtBQUssT0FBTyxTQUFTLE9BQU8sS0FBSyxDQUFDLEdBQUc7QUFDcEY7QUFBQSxJQUNGO0FBR0EsZUFBVyxXQUFXLEtBQUssVUFBVTtBQUNuQyxVQUFJLENBQUMsUUFBUSxRQUFRLFNBQVMsS0FBSyxTQUFVO0FBQzdDLFlBQU0sS0FBSyxJQUFJLFlBQVksbUJBQW1CLE1BQU0sQ0FBQyxPQUFnQztBQUNuRixXQUFHLFFBQVEsSUFBSSxRQUFRO0FBQUEsTUFDekIsQ0FBQztBQUFBLElBQ0g7QUFFQSxRQUFJLENBQUMsS0FBTTtBQUdYLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxRQUFRLEtBQUs7QUFDN0MsVUFBTSxLQUFLLFNBQVMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLFNBQVMsRUFBRSxDQUFDO0FBQUEsRUFDNUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBU0EsTUFBTSxvQkFDSixPQUNBLGFBQ0EsV0FDNkI7QUFDN0IsVUFBTSxXQUFXLGlCQUFpQixPQUFPLFdBQVc7QUFFcEQsZUFBVyxXQUFXLFVBQVU7QUFDOUIsWUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLHNCQUFzQixRQUFRLElBQUk7QUFDM0QsVUFBSSxFQUFFLGFBQWEsd0JBQVE7QUFDM0IsWUFBTSxPQUFPLFFBQVEsV0FBVyxLQUFLLElBQUksTUFBTSxzQkFBc0IsUUFBUSxRQUFRLElBQUk7QUFDekYsWUFBTSxLQUFLLElBQUksWUFBWSxtQkFBbUIsR0FBRyxDQUFDLE9BQWdDO0FBQ2hGLFdBQUcsUUFBUSxJQUFJLGdCQUFnQix5QkFBUSxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDO0FBQUEsTUFDckUsQ0FBQztBQUFBLElBQ0g7QUFFQSxVQUFNLFVBQW9CLENBQUM7QUFDM0IsZUFBVyxRQUFRLGFBQWE7QUFDOUIsWUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLHNCQUFzQixJQUFJO0FBQ25ELFVBQUksRUFBRSxhQUFhLHdCQUFRO0FBQzNCLFVBQUk7QUFDRixjQUFNLEtBQUssSUFBSSxZQUFZLFVBQVUsQ0FBQztBQUN0QyxnQkFBUSxLQUFLLElBQUk7QUFBQSxNQUNuQixTQUFTLE9BQU87QUFDZCxZQUFJLHdCQUFPLG9DQUFvQyxFQUFFLFFBQVEsTUFBTSxPQUFPLEtBQUssQ0FBQyxHQUFHO0FBQUEsTUFDakY7QUFBQSxJQUNGO0FBRUEsV0FBTyxFQUFFLFNBQVMsYUFBYSxnQkFBZ0IsT0FBTyxhQUFhLFNBQVMsRUFBRTtBQUFBLEVBQ2hGO0FBQ0Y7QUFHQSxTQUFTLFVBQVUsTUFBa0M7QUFDbkQsTUFBSSxDQUFDLFFBQVEsU0FBUyxJQUFLLFFBQU87QUFDbEMsU0FBTyxHQUFHLEtBQUssUUFBUSxRQUFRLEVBQUUsQ0FBQztBQUNwQzs7O0FJbE1BLElBQUFDLG1CQUFxRDs7O0FDQXJELElBQUFDLG1CQUEyQjtBQUczQixJQUFNLG9CQUFvQjtBQVNuQixJQUFNLHFCQUFOLGNBQWlDLHVCQUFNO0FBQUEsRUFHNUMsWUFDRSxLQUNRLE9BQ0EsV0FDQSxXQUNSO0FBQ0EsVUFBTSxHQUFHO0FBSkQ7QUFDQTtBQUNBO0FBTlYsU0FBUSxZQUFZO0FBQUEsRUFTcEI7QUFBQSxFQUVBLFNBQWU7QUFDYixTQUFLLFVBQVUsTUFBTTtBQUNyQixTQUFLLFFBQVEsU0FBUyw4QkFBOEI7QUFFcEQsVUFBTSxRQUFRLEtBQUssTUFBTTtBQUN6QixTQUFLLFVBQVUsU0FBUyxNQUFNO0FBQUEsTUFDNUIsS0FBSztBQUFBLE1BQ0wsTUFBTSxVQUFVLElBQUksdUJBQXVCLFVBQVUsS0FBSztBQUFBLElBQzVELENBQUM7QUFDRCxTQUFLLFVBQ0YsVUFBVSxFQUFFLEtBQUssbUNBQW1DLENBQUMsRUFDckQ7QUFBQSxNQUNDLFVBQVUsSUFDTix5Q0FDQTtBQUFBLElBQ047QUFFRixVQUFNLE9BQU8sS0FBSyxVQUFVLFVBQVUsRUFBRSxLQUFLLG9DQUFvQyxDQUFDO0FBQ2xGLGVBQVcsQ0FBQyxHQUFHLElBQUksS0FBSyxLQUFLLE1BQU0sTUFBTSxHQUFHLGlCQUFpQixFQUFFLFFBQVEsR0FBRztBQUN4RSxZQUFNLE1BQU0sS0FBSyxVQUFVLEVBQUUsS0FBSyxtQ0FBbUMsQ0FBQztBQUN0RSxVQUFJLFdBQVcsRUFBRSxLQUFLLG1DQUFtQyxDQUFDLEVBQUUsUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDO0FBQ2pGLFVBQUksV0FBVyxFQUFFLEtBQUssb0NBQW9DLENBQUMsRUFBRSxRQUFRLElBQUk7QUFBQSxJQUMzRTtBQUNBLFFBQUksS0FBSyxNQUFNLFNBQVMsbUJBQW1CO0FBQ3pDLFdBQ0csVUFBVSxFQUFFLEtBQUssb0NBQW9DLENBQUMsRUFDdEQsUUFBUSxjQUFTLEtBQUssTUFBTSxTQUFTLGlCQUFpQixPQUFPO0FBQUEsSUFDbEU7QUFFQSxTQUFLLGdCQUFnQjtBQUNyQixTQUFLLGFBQWE7QUFBQSxFQUNwQjtBQUFBO0FBQUEsRUFHUSxrQkFBd0I7QUFDOUIsVUFBTSxNQUFNLEtBQUssVUFBVSxVQUFVLEVBQUUsS0FBSyx1Q0FBdUMsQ0FBQztBQUNwRixRQUFJLFNBQVMsT0FBTyxFQUFFLFFBQVEsaUJBQWlCO0FBQy9DLFVBQU0sV0FBVyxJQUFJLFNBQVMsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzNELGFBQVMsaUJBQWlCLFVBQVUsTUFBTTtBQUN4QyxXQUFLLEtBQUssVUFBVSxFQUFFO0FBQUEsUUFDcEIsTUFBTTtBQUNKLG1CQUFTLFdBQVc7QUFBQSxRQUN0QjtBQUFBLFFBQ0EsTUFBTTtBQUFBLFFBRU47QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUEsRUFHUSxlQUFxQjtBQUMzQixVQUFNLFVBQVUsS0FBSyxVQUFVLFVBQVUsRUFBRSxLQUFLLHVDQUF1QyxDQUFDO0FBQ3hGLFlBQVEsU0FBUyxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUMsRUFBRSxpQkFBaUIsU0FBUyxNQUFNLEtBQUssTUFBTSxDQUFDO0FBQzNGLFlBQ0csU0FBUyxVQUFVLEVBQUUsTUFBTSxVQUFVLEtBQUssY0FBYyxDQUFDLEVBQ3pELGlCQUFpQixTQUFTLE1BQU07QUFDL0IsV0FBSyxZQUFZO0FBQ2pCLFdBQUssTUFBTTtBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUVBLFVBQWdCO0FBQ2QsUUFBSSxLQUFLLFVBQVcsTUFBSyxVQUFVO0FBQUEsRUFDckM7QUFDRjs7O0FEcEZPLElBQU0sb0JBQW9CO0FBYTFCLElBQU0sa0JBQU4sY0FBOEIsMEJBQVM7QUFBQSxFQVU1QyxZQUNVLFFBQ1IsTUFDQTtBQUNBLFVBQU0sSUFBSTtBQUhGO0FBVFY7QUFBQSxTQUFRLFlBQXNCLENBQUM7QUFFL0I7QUFBQSxTQUFRLFFBQTZDLENBQUM7QUFFdEQ7QUFBQSxTQUFRLFdBQVcsb0JBQUksSUFBWTtBQUVuQztBQUFBLFNBQVEsU0FBd0I7QUFBQSxFQU9oQztBQUFBLEVBRUEsY0FBc0I7QUFDcEIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLGlCQUF5QjtBQUN2QixXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsVUFBa0I7QUFDaEIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLE1BQU0sU0FBd0I7QUFDNUIsU0FBSyxZQUFZLFNBQVMscUJBQXFCO0FBQy9DLFNBQUssY0FBYyxLQUFLLElBQUksVUFBVSxHQUFHLGFBQWEsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQzFFLFNBQUssY0FBYyxLQUFLLElBQUksVUFBVSxHQUFHLHNCQUFzQixNQUFNLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDbkYsU0FBSyxjQUFjLEtBQUssSUFBSSxVQUFVLEdBQUcsaUJBQWlCLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQztBQUM5RSxTQUFLLGNBQWMsS0FBSyxJQUFJLGNBQWMsR0FBRyxXQUFXLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQztBQUM1RSxTQUFLLGNBQWMsS0FBSyxJQUFJLE1BQU0sR0FBRyxVQUFVLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQztBQUNuRSxTQUFLLGNBQWMsS0FBSyxJQUFJLE1BQU0sR0FBRyxVQUFVLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQztBQUNuRSxTQUFLLE9BQU87QUFBQSxFQUNkO0FBQUEsRUFFQSxNQUFNLFVBQXlCO0FBQzdCLFNBQUssWUFBWSxNQUFNO0FBQ3ZCLFNBQUssWUFBWSxDQUFDO0FBQ2xCLFNBQUssUUFBUSxDQUFDO0FBQ2QsU0FBSyxTQUFTLE1BQU07QUFDcEIsU0FBSyxTQUFTO0FBQUEsRUFDaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFVUSxTQUFlO0FBQ3JCLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxjQUFjO0FBQzlDLFVBQU0sT0FBTyxPQUFPLEtBQUssT0FBTyxZQUFZLFFBQVEsSUFBSSxJQUFJO0FBQzVELFVBQU0sUUFBUSxPQUNWLEtBQUssTUFBTSxPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksTUFBTSxzQkFBc0IsQ0FBQyxhQUFhLHNCQUFLLElBQ2pGLENBQUM7QUFHTCxRQUFJLEtBQUssU0FBUyxPQUFPLEdBQUc7QUFDMUIsWUFBTSxPQUFPLElBQUksSUFBSSxLQUFLO0FBQzFCLGlCQUFXLFFBQVEsS0FBSyxTQUFVLEtBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFHLE1BQUssU0FBUyxPQUFPLElBQUk7QUFBQSxJQUNsRjtBQUVBLFFBQUksS0FBSyxXQUFXLFFBQVEsQ0FBQyxNQUFNLFNBQVMsS0FBSyxNQUFNLEVBQUcsTUFBSyxTQUFTO0FBRXhFLFFBQUksQ0FBQyxZQUFZLEtBQUssV0FBVyxLQUFLLEdBQUc7QUFDdkMsV0FBSyxRQUFRLEtBQUs7QUFBQSxJQUNwQixPQUFPO0FBQ0wsaUJBQVcsTUFBTSxLQUFLLE1BQU8sSUFBRyxHQUFHLFVBQVUsT0FBTyxhQUFhLEdBQUcsU0FBUyxNQUFNLElBQUk7QUFBQSxJQUN6RjtBQUNBLFNBQUsscUJBQXFCO0FBQUEsRUFDNUI7QUFBQTtBQUFBLEVBR1EsUUFBUSxPQUF1QjtBQUNyQyxVQUFNLE9BQU8sS0FBSztBQUNsQixTQUFLLE1BQU07QUFDWCxTQUFLLFFBQVEsQ0FBQztBQUNkLFNBQUssWUFBWTtBQUVqQixRQUFJLE1BQU0sV0FBVyxHQUFHO0FBQ3RCLFlBQU0sUUFBUSxLQUFLLFVBQVUsRUFBRSxLQUFLLDRCQUE0QixDQUFDO0FBQ2pFLFlBQU07QUFBQSxRQUNKO0FBQUEsTUFDRjtBQUNBO0FBQUEsSUFDRjtBQUVBLFVBQU0sYUFBYSxLQUFLLElBQUksVUFBVSxjQUFjLEdBQUc7QUFDdkQsVUFBTSxRQUFRLENBQUMsTUFBTSxNQUFNO0FBQ3pCLFlBQU0sSUFBSSxLQUFLLElBQUksTUFBTSxzQkFBc0IsSUFBSTtBQUNuRCxVQUFJLEVBQUUsYUFBYSx3QkFBUTtBQUMzQixZQUFNLE9BQU8sS0FBSyxVQUFVLEVBQUUsS0FBSywyQkFBMkIsQ0FBQztBQUMvRCxVQUFJLFNBQVMsV0FBWSxNQUFLLFNBQVMsV0FBVztBQUNsRCxXQUFLLFdBQVcsRUFBRSxLQUFLLDBCQUEwQixDQUFDLEVBQUUsUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDO0FBQ3pFLFdBQUssV0FBVyxFQUFFLEtBQUssNEJBQTRCLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUTtBQUN4RSxXQUFLLGlCQUFpQixTQUFTLENBQUMsTUFBTSxLQUFLLFlBQVksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUMvRCxXQUFLLGlCQUFpQixlQUFlLENBQUMsTUFBTTtBQUMxQyxVQUFFLGVBQWU7QUFDakIsYUFBSyxnQkFBZ0IsR0FBRyxDQUFDO0FBQUEsTUFDM0IsQ0FBQztBQUNELFdBQUssTUFBTSxLQUFLLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQztBQUFBLElBQ3BDLENBQUM7QUFBQSxFQUNIO0FBQUE7QUFBQSxFQUdRLFlBQVksR0FBZSxPQUFlLEdBQWdCO0FBQ2hFLFFBQUksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFNBQVM7QUFDeEMsVUFBSSxFQUFFLFVBQVU7QUFHZCxjQUFNLGFBQWEsS0FBSyxJQUFJLFVBQVUsY0FBYyxHQUFHLFFBQVE7QUFDL0QsY0FBTSxhQUNKLEtBQUssV0FBVyxRQUFRLEtBQUssTUFBTSxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsS0FBSyxNQUFNLElBQ25FLEtBQUssU0FDTDtBQUNOLGNBQU0sT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFDLE9BQU8sR0FBRyxTQUFTLFVBQVU7QUFDaEUsWUFBSSxlQUFlLFFBQVEsU0FBUyxJQUFJO0FBQ3RDLGdCQUFNLENBQUMsSUFBSSxFQUFFLElBQUksT0FBTyxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxPQUFPLElBQUk7QUFDNUQsbUJBQVMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFLLE1BQUssU0FBUyxJQUFJLEtBQUssTUFBTSxDQUFDLEVBQUUsSUFBSTtBQUduRSxjQUFJLGVBQWUsUUFBUSxLQUFLLE1BQU0sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFVBQVUsR0FBRztBQUMxRSxpQkFBSyxTQUFTLElBQUksVUFBVTtBQUFBLFVBQzlCO0FBQ0EsZUFBSyxTQUFTLEtBQUssTUFBTSxLQUFLLEVBQUU7QUFDaEMsZUFBSyxxQkFBcUI7QUFDMUI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUdBLFVBQUksS0FBSyxTQUFTLElBQUksRUFBRSxJQUFJLEVBQUcsTUFBSyxTQUFTLE9BQU8sRUFBRSxJQUFJO0FBQUEsVUFDckQsTUFBSyxTQUFTLElBQUksRUFBRSxJQUFJO0FBQzdCLFdBQUssU0FBUyxFQUFFO0FBQ2hCLFdBQUsscUJBQXFCO0FBQzFCO0FBQUEsSUFDRjtBQUNBLFNBQUssU0FBUyxNQUFNO0FBSXBCLFNBQUssU0FBUyxFQUFFO0FBQ2hCLFNBQUsscUJBQXFCO0FBQzFCLFNBQUssS0FBSyxVQUFVLENBQUM7QUFBQSxFQUN2QjtBQUFBO0FBQUEsRUFHUSx1QkFBNkI7QUFDbkMsZUFBVyxNQUFNLEtBQUssTUFBTyxJQUFHLEdBQUcsVUFBVSxPQUFPLGVBQWUsS0FBSyxTQUFTLElBQUksR0FBRyxJQUFJLENBQUM7QUFBQSxFQUMvRjtBQUFBO0FBQUEsRUFHUSxnQkFBZ0IsR0FBZSxHQUFnQjtBQUNyRCxVQUFNLE9BQU8sSUFBSSxzQkFBSztBQUN0QixTQUFLO0FBQUEsTUFBUSxDQUFDLE9BQ1osR0FDRyxTQUFTLG1CQUFtQixFQUM1QixRQUFRLE1BQU0sRUFDZCxRQUFRLE1BQU0sS0FBSyxLQUFLLGdCQUFnQixDQUFDLENBQUM7QUFBQSxJQUMvQztBQUNBLFVBQU0sVUFBVSxLQUFLLFNBQVMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxFQUFFLElBQUk7QUFDeEUsVUFBTSxVQUFVLEtBQUssVUFBVSxPQUFPLENBQUMsTUFBTSxRQUFRLFNBQVMsQ0FBQyxDQUFDO0FBQ2hFLFNBQUs7QUFBQSxNQUFRLENBQUMsT0FDWixHQUNHLFNBQVMsUUFBUSxTQUFTLElBQUksVUFBVSxRQUFRLE1BQU0sWUFBWSxjQUFjLEVBQ2hGLFFBQVEsT0FBTyxFQUNmLFFBQVEsTUFBTSxLQUFLLGFBQWEsT0FBTyxDQUFDO0FBQUEsSUFDN0M7QUFDQSxTQUFLLGlCQUFpQixDQUFDO0FBQUEsRUFDekI7QUFBQTtBQUFBLEVBR0EsTUFBYyxnQkFBZ0IsR0FBeUI7QUFDckQsVUFBTSxPQUFPLEtBQUssT0FBTyxZQUFZLGVBQWUsQ0FBQztBQUNyRCxRQUFJLENBQUMsS0FBTTtBQUNYLFVBQU0sS0FBSyxPQUFPLFlBQVksa0JBQWtCLEdBQUcsTUFBTSxLQUFLO0FBQzlELFNBQUssT0FBTztBQUFBLEVBQ2Q7QUFBQTtBQUFBLEVBR1EsYUFBYSxPQUF1QjtBQUMxQyxRQUFJLE1BQU0sV0FBVyxFQUFHO0FBQ3hCLFVBQU0sTUFBTSxNQUFZLEtBQUssS0FBSyxZQUFZLEtBQUs7QUFFbkQsUUFBSSxDQUFDLEtBQUssT0FBTyxTQUFTLHFCQUFxQjtBQUM3QyxVQUFJO0FBQ0o7QUFBQSxJQUNGO0FBQ0EsVUFBTSxRQUFRLE1BQU0sSUFBSSxDQUFDLE1BQU07QUFDN0IsWUFBTSxJQUFJLEtBQUssSUFBSSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELGFBQU8sYUFBYSx5QkFBUSxFQUFFLFdBQVc7QUFBQSxJQUMzQyxDQUFDO0FBQ0QsUUFBSSxtQkFBbUIsS0FBSyxLQUFLLE9BQU8sS0FBSyxZQUFZO0FBQ3ZELFdBQUssT0FBTyxTQUFTLHNCQUFzQjtBQUMzQyxZQUFNLEtBQUssT0FBTyxhQUFhO0FBQUEsSUFDakMsQ0FBQyxFQUFFLEtBQUs7QUFBQSxFQUNWO0FBQUEsRUFFQSxNQUFjLFlBQVksT0FBZ0M7QUFDeEQsVUFBTSxhQUFhLEtBQUssSUFBSSxVQUFVLGNBQWMsR0FBRyxRQUFRO0FBQy9ELFVBQU0sU0FBUyxNQUFNLEtBQUssT0FBTyxZQUFZO0FBQUEsTUFDM0MsS0FBSztBQUFBLE1BQ0wsSUFBSSxJQUFJLEtBQUs7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUVBLGVBQVcsUUFBUSxNQUFPLE1BQUssU0FBUyxPQUFPLElBQUk7QUFDbkQsUUFBSSxLQUFLLFdBQVcsUUFBUSxNQUFNLFNBQVMsS0FBSyxNQUFNLEVBQUcsTUFBSyxTQUFTO0FBRXZFLFFBQUksT0FBTyxhQUFhO0FBQ3RCLFlBQU0sSUFBSSxLQUFLLElBQUksTUFBTSxzQkFBc0IsT0FBTyxXQUFXO0FBQ2pFLFVBQUksYUFBYSx1QkFBTyxPQUFNLEtBQUssVUFBVSxDQUFDO0FBQzlDO0FBQUEsSUFDRjtBQUNBLFNBQUssT0FBTztBQUFBLEVBQ2Q7QUFBQTtBQUFBLEVBR0EsTUFBYyxVQUFVLEdBQXlCO0FBQy9DLFVBQU0sT0FDSixLQUFLLElBQUksVUFBVSxnQkFBZ0IsVUFBVSxFQUFFLENBQUMsS0FBSyxLQUFLLElBQUksVUFBVSxRQUFRLElBQUk7QUFDdEYsVUFBTSxLQUFLLFNBQVMsQ0FBQztBQUNyQixTQUFLLElBQUksVUFBVSxjQUFjLE1BQU0sRUFBRSxPQUFPLEtBQUssQ0FBQztBQUFBLEVBQ3hEO0FBQ0Y7QUFHQSxTQUFTLFlBQVksR0FBYSxHQUFzQjtBQUN0RCxTQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxNQUFNLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDOUQ7OztBRTlQQSxJQUFBQyxtQkFBc0U7QUFTL0QsSUFBTSx5QkFBTixjQUFxQyxrQ0FBaUI7QUFBQSxFQUMzRCxZQUFvQixRQUE0QjtBQUM5QyxVQUFNLE9BQU8sS0FBSyxNQUFNO0FBRE47QUFBQSxFQUVwQjtBQUFBO0FBQUEsRUFHQSx3QkFBaUQ7QUFDL0MsV0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLEtBQUs7QUFBQSxVQUNMLE1BQU07QUFBQSxVQUNOLFNBQVMsT0FBTyxZQUFZLGNBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUFBLFFBQ3ZFO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLGVBQWUsTUFBTSxTQUFTO0FBQUEsTUFDaEQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTLEVBQUUsS0FBSyxpQkFBaUIsTUFBTSxTQUFTO0FBQUEsTUFDbEQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTLEVBQUUsS0FBSyxrQkFBa0IsTUFBTSxTQUFTO0FBQUEsTUFDbkQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsWUFDUCxVQUFVO0FBQUEsWUFDVixTQUFTO0FBQUEsWUFDVCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssZ0JBQWdCLE1BQU0sU0FBUztBQUFBLE1BQ2pEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssbUJBQW1CLE1BQU0sU0FBUztBQUFBLE1BQ3BEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssa0JBQWtCLE1BQU0sU0FBUztBQUFBLE1BQ25EO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssZUFBZSxNQUFNLFFBQVEsYUFBYSxhQUFhO0FBQUEsTUFDekU7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTLEVBQUUsS0FBSyxpQkFBaUIsTUFBTSxRQUFRLGFBQWEsd0JBQXdCO0FBQUEsTUFDdEY7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTLEVBQUUsS0FBSyx1QkFBdUIsTUFBTSxTQUFTO0FBQUEsTUFDeEQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixRQUFRLE1BQU07QUFFWixVQUNFLEtBQUssSUFDTCxTQUFTLGNBQWMsU0FBUztBQUFBLFFBQ3BDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLGdCQUFnQixLQUFhLE9BQXNCO0FBQ2pELFNBQUssS0FBSyxrQkFBa0IsS0FBSyxLQUFLO0FBQUEsRUFDeEM7QUFBQSxFQUVBLE1BQWMsa0JBQWtCLEtBQWEsT0FBK0I7QUFDMUUsSUFBQyxLQUFLLE9BQU8sU0FBZ0QsR0FBRyxJQUFJO0FBQ3BFLFVBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsU0FBSyxPQUFPLFFBQVE7QUFBQSxFQUN0QjtBQUFBO0FBQUEsRUFHQSxVQUFnQjtBQUNkLFVBQU0sRUFBRSxZQUFZLElBQUk7QUFDeEIsZ0JBQVksTUFBTTtBQUVsQixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSxnQkFBZ0IsRUFDeEI7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDLFlBQVksQ0FBQyxhQUFhO0FBQ3pCLGlCQUFXLEtBQUssY0FBZSxVQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSztBQUMvRCxlQUFTLFNBQVMsS0FBSyxPQUFPLFNBQVMsV0FBVyxFQUFFLFNBQVMsT0FBTyxVQUFVO0FBQzVFLGFBQUssT0FBTyxTQUFTLGNBQWM7QUFDbkMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNILENBQUM7QUFFSCxRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSxlQUFlLEVBQ3ZCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxXQUFXLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDMUUsYUFBSyxPQUFPLFNBQVMsY0FBYztBQUNuQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxRQUFRO0FBQUEsTUFDdEIsQ0FBQztBQUFBLElBQ0g7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSxpQkFBaUIsRUFDekIsUUFBUSxxRUFBcUUsRUFDN0U7QUFBQSxNQUFVLENBQUMsV0FDVixPQUFPLFNBQVMsS0FBSyxPQUFPLFNBQVMsYUFBYSxFQUFFLFNBQVMsT0FBTyxVQUFVO0FBQzVFLGFBQUssT0FBTyxTQUFTLGdCQUFnQjtBQUNyQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxRQUFRO0FBQUEsTUFDdEIsQ0FBQztBQUFBLElBQ0g7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSw0QkFBNEIsRUFDcEM7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxTQUFTLEtBQUssT0FBTyxTQUFTLGNBQWMsRUFBRSxTQUFTLE9BQU8sVUFBVTtBQUM3RSxhQUFLLE9BQU8sU0FBUyxpQkFBaUI7QUFDdEMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsbUJBQW1CLEVBQzNCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVksQ0FBQyxhQUNaLFNBQ0csV0FBVztBQUFBLFFBQ1YsVUFBVTtBQUFBLFFBQ1YsU0FBUztBQUFBLFFBQ1QsTUFBTTtBQUFBLE1BQ1IsQ0FBQyxFQUNBLFNBQVMsS0FBSyxPQUFPLFNBQVMsZUFBZSxFQUM3QyxTQUFTLE9BQU8sVUFBVTtBQUN6QixhQUFLLE9BQU8sU0FBUyxrQkFBa0I7QUFDdkMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNMO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsbUJBQW1CLEVBQzNCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxZQUFZLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDM0UsYUFBSyxPQUFPLFNBQVMsZUFBZTtBQUNwQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxRQUFRO0FBQUEsTUFDdEIsQ0FBQztBQUFBLElBQ0g7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSx3QkFBd0IsRUFDaEM7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxTQUFTLEtBQUssT0FBTyxTQUFTLGVBQWUsRUFBRSxTQUFTLE9BQU8sVUFBVTtBQUM5RSxhQUFLLE9BQU8sU0FBUyxrQkFBa0I7QUFDdkMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsMEJBQTBCLEVBQ2xDLFFBQVEsbUVBQW1FLEVBQzNFO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxTQUFTLEtBQUssT0FBTyxTQUFTLGNBQWMsRUFBRSxTQUFTLE9BQU8sVUFBVTtBQUM3RSxhQUFLLE9BQU8sU0FBUyxpQkFBaUI7QUFDdEMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUFBLE1BQ2pDLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsY0FBYyxFQUN0QjtBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFRLENBQUMsU0FDUixLQUNHLGVBQWUsWUFBWSxFQUMzQixTQUFTLEtBQUssT0FBTyxTQUFTLFdBQVcsRUFDekMsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsY0FBYztBQUNuQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxRQUFRO0FBQUEsTUFDdEIsQ0FBQztBQUFBLElBQ0w7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSxnQkFBZ0IsRUFDeEI7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBUSxDQUFDLFNBQ1IsS0FDRyxlQUFlLHVCQUF1QixFQUN0QyxTQUFTLEtBQUssT0FBTyxTQUFTLGFBQWEsRUFDM0MsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsZ0JBQWdCO0FBQ3JDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDTDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLHdCQUF3QixFQUNoQztBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFVLENBQUMsV0FDVixPQUFPLFNBQVMsS0FBSyxPQUFPLFNBQVMsbUJBQW1CLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDbEYsYUFBSyxPQUFPLFNBQVMsc0JBQXNCO0FBQzNDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFBQSxNQUNqQyxDQUFDO0FBQUEsSUFDSDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLG9CQUFvQixFQUM1QjtBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFVLENBQUMsV0FDVixPQUFPLGNBQWMsdUJBQXVCLEVBQUUsUUFBUSxNQUFNO0FBRTFELFFBQ0UsS0FBSyxJQUNMLFNBQVMsY0FBYyxTQUFTO0FBQUEsTUFDcEMsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNKO0FBQ0Y7OztBQ3JSTyxTQUFTLGNBQWMsSUFBdUI7QUFDbkQsU0FBTyxHQUFHLFdBQVksSUFBRyxZQUFZLEdBQUcsVUFBVTtBQUNwRDs7O0Fma0NBLElBQXFCLHFCQUFyQixjQUFnRCx3QkFBTztBQUFBLEVBQXZEO0FBQUE7QUFFRTtBQUFBLGVBQTBCO0FBSTFCO0FBQUEsb0JBQWlDLEVBQUUsR0FBRyxpQkFBaUI7QUFHdkQ7QUFBQSxTQUFRLGFBQWE7QUFFckI7QUFBQSxTQUFRLFdBQWlDO0FBRXpDO0FBQUEsU0FBUSxhQUFhO0FBRXJCO0FBQUEsU0FBUSxrQkFBa0I7QUFFMUI7QUFBQSxTQUFRLFVBQVU7QUFFbEI7QUFBQSxTQUFRLGVBQWU7QUFFdkI7QUFBQSx5QkFBZ0I7QUFBQTtBQUFBLEVBRWhCLE1BQU0sU0FBd0I7QUFDNUIsVUFBTSxLQUFLLGFBQWE7QUFDeEIsU0FBSyxjQUFjLElBQUksWUFBWSxLQUFLLEdBQUc7QUFDM0MsU0FBSyxjQUFjLElBQUksdUJBQXVCLElBQUksQ0FBQztBQUduRCxTQUFLO0FBQUEsTUFDSCxLQUFLLElBQUksVUFBVSxHQUFHLGFBQWEsTUFBTTtBQUN2QyxhQUFLLHFCQUFxQjtBQUMxQixhQUFLLFFBQVE7QUFBQSxNQUNmLENBQUM7QUFBQSxJQUNIO0FBQ0EsU0FBSyxjQUFjLEtBQUssSUFBSSxVQUFVLEdBQUcsc0JBQXNCLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztBQUNwRixTQUFLLGNBQWMsS0FBSyxJQUFJLFVBQVUsR0FBRyxpQkFBaUIsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO0FBRS9FLFNBQUs7QUFBQSxNQUNILEtBQUssSUFBSSxjQUFjLEdBQUcsV0FBVyxDQUFDLFNBQWdCO0FBQ3BELFlBQUksU0FBUyxLQUFLLElBQUksVUFBVSxjQUFjLEVBQUcsTUFBSyxRQUFRO0FBQUEsTUFDaEUsQ0FBQztBQUFBLElBQ0g7QUFHQSxTQUFLO0FBQUEsTUFDSCxPQUFPLFlBQVksTUFBTTtBQUN2QixjQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsY0FBYztBQUM5QyxjQUFNLE1BQU0sT0FBTyxHQUFHLEtBQUssSUFBSSxJQUFJLFlBQVksS0FBSyxHQUFHLENBQUMsS0FBSztBQUM3RCxZQUFJLFFBQVEsS0FBSyxTQUFTO0FBQ3hCLGVBQUssVUFBVTtBQUNmLGVBQUssUUFBUTtBQUFBLFFBQ2Y7QUFBQSxNQUNGLEdBQUcsR0FBRztBQUFBLElBQ1I7QUFHQSxxQkFBaUIsSUFBSTtBQUdyQixTQUFLLGFBQWEsbUJBQW1CLENBQUMsU0FBUyxJQUFJLGdCQUFnQixNQUFNLElBQUksQ0FBQztBQUM5RSxTQUFLLGNBQWMsZ0JBQWdCLHFCQUFxQixNQUFNO0FBQzVELFdBQUssS0FBSyxvQkFBb0I7QUFBQSxJQUNoQyxDQUFDO0FBT0QsU0FBSztBQUFBLE1BQ0g7QUFBQSxNQUNBO0FBQUEsTUFDQSxDQUFDLFFBQVE7QUFDUCxZQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsU0FBUyxvQkFBb0IsRUFBRztBQUM3RCxjQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQ2hFLFlBQUksQ0FBQyxLQUFNO0FBQ1gsY0FBTSxLQUFLLElBQUk7QUFDZixZQUFJLGNBQWMsZUFBZSxLQUFLLFVBQVUsU0FBUyxFQUFFLEdBQUc7QUFDNUQsY0FBSSxHQUFHLGNBQWMsRUFBRyxJQUFHLFlBQVk7QUFDdkMsY0FBSSxHQUFHLGVBQWUsRUFBRyxJQUFHLGFBQWE7QUFBQSxRQUMzQztBQUFBLE1BQ0Y7QUFBQSxNQUNBLEVBQUUsU0FBUyxLQUFLO0FBQUEsSUFDbEI7QUFHQSxTQUFLLGlCQUFpQixVQUFVLFdBQVcsQ0FBQyxRQUF1QjtBQUNqRSxVQUFJLElBQUksUUFBUSxZQUFZLEtBQUssY0FBYyxLQUFLLFNBQVMsZ0JBQWdCO0FBQzNFLGFBQUssV0FBVztBQUFBLE1BQ2xCO0FBQUEsSUFDRixDQUFDO0FBR0QsU0FBSyxNQUFNLFVBQVU7QUFDckIsYUFBUyxLQUFLLFlBQVksS0FBSyxHQUFHO0FBQ2xDLFNBQUssUUFBUTtBQUFBLEVBQ2Y7QUFBQSxFQUVBLFdBQWlCO0FBQ2YsU0FBSyxLQUFLLE9BQU87QUFDakIsU0FBSyxNQUFNO0FBQ1gsYUFBUyxLQUFLLFVBQVUsT0FBTyxvQkFBb0I7QUFDbkQsYUFBUyxLQUFLLFVBQVUsT0FBTyw4QkFBOEI7QUFDN0QsYUFBUyxLQUFLLFVBQVUsT0FBTyw0QkFBNEI7QUFDM0QsU0FBSyxtQkFBbUI7QUFBQSxFQUMxQjtBQUFBO0FBQUEsRUFJQSxNQUFNLGVBQThCO0FBQ2xDLFVBQU0sT0FBUSxNQUFNLEtBQUssU0FBUztBQUNsQyxTQUFLLFdBQVcsT0FBTyxPQUFPLENBQUMsR0FBRyxrQkFBa0IsUUFBUSxDQUFDLENBQUM7QUFBQSxFQUNoRTtBQUFBLEVBRUEsTUFBTSxlQUE4QjtBQUNsQyxVQUFNLEtBQUssU0FBUyxLQUFLLFFBQVE7QUFBQSxFQUNuQztBQUFBO0FBQUE7QUFBQSxFQUtRLFdBQVcsTUFBNkI7QUFDOUMsUUFBSSxDQUFDLEtBQU0sUUFBTztBQUNsQixVQUFNLEtBQUssY0FBYyxLQUFLLEtBQUssSUFBSTtBQUN2QyxXQUFPLE9BQU8sUUFBUSxZQUFZO0FBQUEsRUFDcEM7QUFBQTtBQUFBLEVBR1EscUJBQTJCO0FBQ2pDLGVBQVcsT0FBTyxNQUFNLEtBQUssU0FBUyxLQUFLLFNBQVMsR0FBRztBQUNyRCxVQUFJLElBQUksV0FBVyxzQkFBc0IsRUFBRyxVQUFTLEtBQUssVUFBVSxPQUFPLEdBQUc7QUFBQSxJQUNoRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPUSxrQkFBd0I7QUFDOUIsVUFBTSxLQUFLLGNBQWMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEtBQUssU0FBUyxXQUFXLElBQ25FLEtBQUssU0FBUyxjQUNkLGlCQUFpQjtBQUNyQixVQUFNLE1BQU0sdUJBQXVCLEVBQUU7QUFDckMsZUFBVyxLQUFLLE1BQU0sS0FBSyxTQUFTLEtBQUssU0FBUyxHQUFHO0FBQ25ELFVBQUksRUFBRSxXQUFXLHNCQUFzQixLQUFLLE1BQU0sSUFBSyxVQUFTLEtBQUssVUFBVSxPQUFPLENBQUM7QUFBQSxJQUN6RjtBQUNBLGFBQVMsS0FBSyxVQUFVLElBQUksR0FBRztBQUFBLEVBQ2pDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT0EsZ0JBQXNCO0FBQ3BCLFNBQUssZ0JBQWdCLENBQUMsS0FBSztBQUMzQixRQUFJLEtBQUssZUFBZTtBQUN0QixZQUFNLFNBQVMsU0FBUztBQUN4QixVQUFJLGtCQUFrQixlQUFlLFdBQVcsU0FBUyxLQUFNLFFBQU8sS0FBSztBQUFBLElBQzdFO0FBQ0EsU0FBSyxRQUFRO0FBQUEsRUFDZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9RLGlCQUFpQixRQUF1QjtBQUM5QyxhQUFTLEtBQUssVUFBVSxPQUFPLGdDQUFnQyxVQUFVLEtBQUssYUFBYTtBQUFBLEVBQzdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT1EscUJBQXFCLFFBQXVCO0FBQ2xELGFBQVMsS0FBSyxVQUFVO0FBQUEsTUFDdEI7QUFBQSxNQUNBLFVBQVUsS0FBSyxTQUFTO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRUSxrQkFBa0IsUUFBdUI7QUFDL0MsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLG9CQUFvQiw2QkFBWTtBQUNoRSxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsY0FBYztBQUM5QyxVQUFNLFVBQVUsTUFBTSxVQUFVLGNBQTJCLGFBQWE7QUFDeEUsUUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFNO0FBRXZCLFVBQU0sTUFBTSxLQUFLLFNBQVMsWUFBWSxLQUFLO0FBUTNDLFVBQU0sY0FBYyxVQUFVLFFBQVE7QUFDdEMsVUFBTSxhQUFhLE1BQU0sVUFBVSxjQUEyQix1QkFBdUI7QUFDckYsUUFBSSxlQUFlLFdBQVksWUFBVyxhQUFhLHdCQUF3QixVQUFVO0FBQUEsUUFDcEYsYUFBWSxnQkFBZ0Isc0JBQXNCO0FBQ3ZELFlBQVEsZ0JBQWdCLDRCQUE0QixXQUFXO0FBSS9ELFFBQUksT0FBc0I7QUFDMUIsUUFBSSxVQUFVLE9BQU8sUUFBUSxZQUFZO0FBQ3ZDLFlBQU0sS0FBSyxjQUFjLEtBQUssS0FBSyxJQUFJO0FBQ3ZDLFlBQU0sSUFBSSxLQUFLLEdBQUc7QUFDbEIsVUFBSSxLQUFLLEtBQU0sUUFBTyxZQUFZLENBQUM7QUFBQSxJQUNyQztBQUVBLFFBQUksS0FBTSxTQUFRLGFBQWEscUJBQXFCLElBQUk7QUFBQSxRQUNuRCxTQUFRLGdCQUFnQixtQkFBbUI7QUFBQSxFQUNsRDtBQUFBO0FBQUEsRUFHQSxNQUFjLGNBQTZCO0FBQ3pDLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDaEUsUUFBSSxNQUFNO0FBQ1IsWUFBTSxRQUFRLEtBQUssU0FBUztBQUM1QixXQUFLLFdBQVcsTUFBTSxTQUFTLFlBQVksWUFBWTtBQUN2RCxXQUFLLGFBQWEsTUFBTSxXQUFXO0FBRW5DLFlBQU0sT0FBTyxLQUFLLEtBQUssYUFBYTtBQUNwQyxXQUFLLFFBQVEsRUFBRSxHQUFHLEtBQUssT0FBTyxNQUFNLFVBQVUsUUFBUSxNQUFNO0FBQzVELFlBQU0sS0FBSyxLQUFLLGFBQWEsTUFBTSxFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQUEsSUFDckQ7QUFDQSxTQUFLLGFBQWE7QUFDbEIsU0FBSyxRQUFRO0FBS2IsZUFBVyxNQUFNLE1BQU0sVUFBVSxpQkFBOEIsY0FBYyxLQUFLLENBQUMsR0FBRztBQUNwRixVQUFJLEdBQUcsY0FBYyxFQUFHLElBQUcsWUFBWTtBQUN2QyxVQUFJLEdBQUcsZUFBZSxFQUFHLElBQUcsYUFBYTtBQUFBLElBQzNDO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHUSxhQUFtQjtBQUN6QixTQUFLLGFBQWE7QUFDbEIsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLG9CQUFvQiw2QkFBWTtBQUNoRSxRQUFJLE1BQU07QUFDUixZQUFNLFFBQVEsS0FBSyxLQUFLLGFBQWE7QUFDckMsVUFBSSxLQUFLLGFBQWEsV0FBVztBQUMvQixjQUFNLFFBQVEsRUFBRSxHQUFHLE1BQU0sT0FBTyxNQUFNLFVBQVU7QUFBQSxNQUNsRCxPQUFPO0FBQ0wsY0FBTSxRQUFRLEVBQUUsR0FBRyxNQUFNLE9BQU8sTUFBTSxVQUFVLFFBQVEsS0FBSyxXQUFXO0FBQUEsTUFDMUU7QUFDQSxXQUFLLEtBQUssS0FBSyxhQUFhLE9BQU8sRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUFBLElBQ3JEO0FBQ0EsU0FBSyxRQUFRO0FBQUEsRUFDZjtBQUFBO0FBQUEsRUFHQSxlQUFxQjtBQUNuQixRQUFJLEtBQUssV0FBWSxNQUFLLFdBQVc7QUFBQSxRQUNoQyxNQUFLLEtBQUssWUFBWTtBQUFBLEVBQzdCO0FBQUE7QUFBQSxFQUdBLE1BQU0sc0JBQXFDO0FBQ3pDLFVBQU0sV0FBVyxLQUFLLElBQUksVUFBVSxnQkFBZ0IsaUJBQWlCO0FBQ3JFLFFBQUksU0FBUyxTQUFTLEdBQUc7QUFDdkIsWUFBTSxLQUFLLElBQUksVUFBVSxXQUFXLFNBQVMsQ0FBQyxDQUFDO0FBQy9DO0FBQUEsSUFDRjtBQUNBLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxhQUFhLEtBQUs7QUFDbEQsUUFBSSxDQUFDLEtBQU07QUFDWCxVQUFNLEtBQUssYUFBYSxFQUFFLE1BQU0sbUJBQW1CLFFBQVEsS0FBSyxDQUFDO0FBQ2pFLFVBQU0sS0FBSyxJQUFJLFVBQVUsV0FBVyxJQUFJO0FBQUEsRUFDMUM7QUFBQTtBQUFBLEVBR1EsdUJBQTZCO0FBQ25DLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxjQUFjO0FBQzlDLFFBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxLQUFLLGdCQUFpQjtBQUNqRCxTQUFLLGtCQUFrQixLQUFLO0FBQzVCLFFBQUksS0FBSyxTQUFTLG1CQUFtQixLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsS0FBSyxZQUFZO0FBQzlFLFdBQUssS0FBSyxZQUFZO0FBQUEsSUFDeEI7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBLEVBS0EsTUFBTSxTQUFTLFdBQTJDO0FBQ3hELFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxjQUFjO0FBQzlDLFFBQUksQ0FBQyxLQUFNO0FBQ1gsVUFBTSxPQUFPLEtBQUssWUFBWSxRQUFRLElBQUk7QUFDMUMsUUFBSSxDQUFDLEtBQU07QUFDWCxVQUFNLFNBQVMsS0FBSyxNQUFNLGNBQWMsU0FBUyxLQUFLLFFBQVEsSUFBSSxLQUFLLFFBQVEsQ0FBQztBQUNoRixRQUFJLENBQUMsT0FBUTtBQUNiLFFBQUksQ0FBQyxLQUFLLFdBQVksT0FBTSxLQUFLLFlBQVk7QUFDN0MsU0FBSyxLQUFLLElBQUksVUFBVSxhQUFhLFFBQVEsS0FBSyxJQUFJO0FBQUEsRUFDeEQ7QUFBQTtBQUFBLEVBR0EsTUFBTSxPQUFPLE9BQThCO0FBQ3pDLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxjQUFjO0FBQzlDLFFBQUksQ0FBQyxLQUFNO0FBQ1gsVUFBTSxPQUFPLEtBQUssWUFBWSxRQUFRLElBQUk7QUFDMUMsUUFBSSxDQUFDLFFBQVEsUUFBUSxLQUFLLFNBQVMsS0FBSyxNQUFNLFVBQVUsVUFBVSxLQUFLLE1BQU87QUFDOUUsVUFBTSxTQUFTLEtBQUssTUFBTSxLQUFLO0FBQy9CLFFBQUksQ0FBQyxPQUFRO0FBQ2IsUUFBSSxDQUFDLEtBQUssV0FBWSxPQUFNLEtBQUssWUFBWTtBQUM3QyxTQUFLLEtBQUssSUFBSSxVQUFVLGFBQWEsUUFBUSxLQUFLLElBQUk7QUFBQSxFQUN4RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBU1EscUJBQXFCLE9BQXlCO0FBQ3BELFFBQUk7QUFDRixZQUFNLFNBQVMsS0FBSyxNQUFNLEtBQUssU0FBUyxxQkFBcUIsSUFBSTtBQUNqRSxVQUFJLGFBQWEsUUFBUSxLQUFLLEVBQUcsUUFBTztBQUFBLElBQzFDLFFBQVE7QUFBQSxJQUVSO0FBQ0EsV0FBTyxJQUFJLE1BQWMsS0FBSyxFQUFFLEtBQUssTUFBTSxLQUFLO0FBQUEsRUFDbEQ7QUFBQTtBQUFBLEVBR0EsTUFBYyxzQkFBc0IsUUFBaUM7QUFDbkUsU0FBSyxTQUFTLG9CQUFvQixLQUFLLFVBQVUsTUFBTTtBQUN2RCxVQUFNLEtBQUssYUFBYTtBQUFBLEVBQzFCO0FBQUE7QUFBQSxFQUdBLFVBQWdCO0FBQ2QsUUFBSSxDQUFDLEtBQUssSUFBSztBQUNmLFNBQUssZ0JBQWdCO0FBRXJCLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxjQUFjO0FBQzlDLFVBQU0sT0FBTyxZQUFZLEtBQUssR0FBRztBQUNqQyxVQUFNLFNBQVMsS0FBSyxXQUFXLElBQUk7QUFDbkMsVUFBTSxpQkFBaUIsU0FBUyxZQUFZLGNBQWMsS0FBSyxHQUFHO0FBSWxFLFFBQUksS0FBSyxlQUFlLENBQUMsVUFBVSxDQUFDLGlCQUFpQjtBQUNuRCxXQUFLLGFBQWE7QUFBQSxJQUNwQjtBQUlBLFNBQUssZUFBZSxpQkFBaUIsS0FBSyxZQUFZO0FBR3RELFVBQU0sU0FBUyxLQUFLLGNBQWMsVUFBVTtBQUM1QyxhQUFTLEtBQUssVUFBVSxPQUFPLHNCQUFzQixNQUFNO0FBQzNELFFBQUksQ0FBQyxPQUFRLE1BQUssZ0JBQWdCO0FBQ2xDLFNBQUssaUJBQWlCLE1BQU07QUFDNUIsU0FBSyxxQkFBcUIsTUFBTTtBQUNoQyxTQUFLLGtCQUFrQixNQUFNO0FBRTdCLFVBQU0sYUFBYSxVQUFVLEtBQUssU0FBUyxpQkFBaUIsQ0FBQyxLQUFLLFNBQVM7QUFJM0UsUUFBSSxZQUFZO0FBQ2QsZUFBUyxnQkFBZ0IsTUFBTSxlQUFlLDRCQUE0QjtBQUFBLElBQzVFLE9BQU87QUFDTCxlQUFTLGdCQUFnQixZQUFZLEVBQUUsOEJBQThCLE1BQU0sQ0FBQztBQUFBLElBQzlFO0FBQ0EsUUFBSSxDQUFDLFlBQVk7QUFDZixXQUFLLElBQUksYUFBYSxFQUFFLFNBQVMsT0FBTyxDQUFDO0FBQ3pDO0FBQUEsSUFDRjtBQUNBLFFBQUksQ0FBQyxLQUFNO0FBRVgsVUFBTSxLQUFLLGtCQUFrQixLQUFLLEdBQUc7QUFDckMsVUFBTSxPQUFPLEtBQUssWUFBWSxRQUFRLElBQUk7QUFDMUMsa0JBQWMsS0FBSyxHQUFHO0FBSXRCLFFBQUksS0FBSyxTQUFTLGtCQUFrQixNQUFNO0FBQ3hDLFlBQU0sVUFBVSxLQUFLLFFBQVE7QUFDN0IsWUFBTSxVQUFVLEtBQUssUUFBUSxLQUFLLE1BQU0sU0FBUztBQUNqRCxZQUFNLE1BQU0sVUFBVSxFQUFFLEtBQUssb0JBQW9CLENBQUM7QUFDbEQsVUFBSSxZQUFZLFVBQVUsVUFBSyxpQkFBaUIsTUFBTSxLQUFLLEtBQUssU0FBUyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDM0YsVUFBSSxZQUFZLFVBQVUsVUFBSyxhQUFhLE1BQU0sS0FBSyxLQUFLLFNBQVMsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDO0FBQ3ZGLFdBQUssSUFBSSxZQUFZLEdBQUc7QUFBQSxJQUMxQjtBQUdBLFVBQU0sWUFBWSxLQUFLLFNBQVMsY0FDN0IsTUFBTSxHQUFHLEVBQ1QsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFDbkIsT0FBTyxPQUFPO0FBRWpCLFFBQUksVUFBVSxTQUFTLEtBQUssSUFBSTtBQUM5QixZQUFNLFVBQThCLENBQUM7QUFDckMsaUJBQVcsUUFBUSxXQUFXO0FBQzVCLFlBQUksUUFBUSxJQUFJO0FBQ2QsZ0JBQU0sTUFBTSxHQUFHLElBQUk7QUFDbkIsY0FBSSxPQUFPLEtBQU0sU0FBUSxLQUFLLENBQUMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQUEsUUFDeEQ7QUFBQSxNQUNGO0FBRUEsVUFBSSxRQUFRLFNBQVMsR0FBRztBQUN0QixjQUFNLFlBQVksVUFBVSxFQUFFLEtBQUssK0JBQStCLENBQUM7QUFFbkUsY0FBTSxTQUFTLEtBQUsscUJBQXFCLFFBQVEsTUFBTTtBQUV2RCxpQkFBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLFFBQVEsS0FBSztBQUN2QyxnQkFBTSxDQUFDLEVBQUUsS0FBSyxJQUFJLFFBQVEsQ0FBQztBQUMzQixnQkFBTSxPQUFPLFdBQVcsRUFBRSxLQUFLLCtCQUErQixNQUFNLE1BQU0sQ0FBQztBQUMzRSxlQUFLLGFBQWE7QUFBQSxZQUNoQixXQUFXLFFBQVEsT0FBTyxDQUFDLENBQUMsUUFBUyxRQUFRLFNBQVMsS0FBSyxJQUFLLFFBQVEsTUFBTTtBQUFBLFVBQ2hGLENBQUM7QUFDRCxvQkFBVSxZQUFZLElBQUk7QUFFMUIsY0FBSSxJQUFJLFFBQVEsU0FBUyxHQUFHO0FBQzFCLGtCQUFNLFVBQVUsVUFBVSxFQUFFLEtBQUssNEJBQTRCLENBQUM7QUFDOUQsb0JBQVEsaUJBQWlCLGFBQWEsQ0FBQyxNQUFNO0FBQzNDLGdCQUFFLGVBQWU7QUFDakIsb0JBQU0sU0FBUyxFQUFFO0FBQ2pCLG9CQUFNLGlCQUFpQixVQUFVO0FBQ2pDLG9CQUFNLGdCQUFnQixDQUFDLEdBQUcsTUFBTTtBQUNoQyxvQkFBTSxTQUFTLENBQUMsT0FBbUI7QUFDakMsc0JBQU0sU0FBVSxHQUFHLFVBQVUsVUFBVSxpQkFBa0I7QUFDekQsc0JBQU0sVUFBVSxLQUFLLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxLQUFLO0FBQ3BELHNCQUFNLFdBQVcsS0FBSyxJQUFJLEdBQUcsY0FBYyxJQUFJLENBQUMsSUFBSSxLQUFLO0FBQ3pELHVCQUFPLENBQUMsSUFBSTtBQUNaLHVCQUFPLElBQUksQ0FBQyxJQUFJO0FBQ2hCLHNCQUFNLFFBQVEsVUFBVTtBQUFBLGtCQUN0QjtBQUFBLGdCQUNGO0FBQ0Esc0JBQU0sQ0FBQyxFQUFFLGFBQWE7QUFBQSxrQkFDcEIsV0FBVyxRQUFRLE9BQU8sUUFBUyxRQUFRLFNBQVMsS0FBSyxJQUFLLFFBQVEsTUFBTTtBQUFBLGdCQUM5RSxDQUFDO0FBQ0Qsc0JBQU0sSUFBSSxDQUFDLEVBQUUsYUFBYTtBQUFBLGtCQUN4QixXQUFXLFFBQVEsUUFBUSxRQUFTLFFBQVEsU0FBUyxLQUFLLElBQUssUUFBUSxNQUFNO0FBQUEsZ0JBQy9FLENBQUM7QUFBQSxjQUNIO0FBQ0Esb0JBQU0sT0FBTyxNQUFNO0FBQ2pCLHlCQUFTLG9CQUFvQixhQUFhLE1BQU07QUFDaEQseUJBQVMsb0JBQW9CLFdBQVcsSUFBSTtBQUM1Qyx5QkFBUyxLQUFLLGFBQWEsRUFBRSxRQUFRLElBQUksWUFBWSxHQUFHLENBQUM7QUFDekQscUJBQUssS0FBSyxzQkFBc0IsTUFBTTtBQUFBLGNBQ3hDO0FBQ0EsdUJBQVMsaUJBQWlCLGFBQWEsTUFBTTtBQUM3Qyx1QkFBUyxpQkFBaUIsV0FBVyxJQUFJO0FBQ3pDLHVCQUFTLEtBQUssYUFBYSxFQUFFLFFBQVEsY0FBYyxZQUFZLE9BQU8sQ0FBQztBQUFBLFlBQ3pFLENBQUM7QUFDRCxzQkFBVSxZQUFZLE9BQU87QUFBQSxVQUMvQjtBQUFBLFFBQ0Y7QUFFQSxhQUFLLElBQUksWUFBWSxTQUFTO0FBQUEsTUFDaEM7QUFBQSxJQUNGO0FBR0EsVUFBTSxTQUFTLE9BQU8sS0FBSyxZQUFZLE9BQU8sSUFBSSxJQUFJLENBQUM7QUFDdkQsUUFBSSxPQUFPLFNBQVMsR0FBRztBQUNyQixZQUFNLE9BQU8sV0FBVztBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLE1BQU0sWUFBTyxPQUFPLEtBQUssSUFBSTtBQUFBLFFBQzdCLE1BQU0sRUFBRSxPQUFPLDREQUF1RDtBQUFBLE1BQ3hFLENBQUM7QUFDRCxXQUFLLElBQUksWUFBWSxJQUFJO0FBQUEsSUFDM0I7QUFHQSxRQUFJLEtBQUssU0FBUyxvQkFBb0IsVUFBVSxNQUFNO0FBR3BELFlBQU0sUUFBUSxLQUFLLE1BQU07QUFDekIsWUFBTSxPQUFPLFdBQVc7QUFBQSxRQUN0QixLQUFLO0FBQUEsUUFDTCxNQUNFLEtBQUssU0FBUyxvQkFBb0IsYUFDOUIsR0FBRyxLQUFLLFFBQVEsQ0FBQyxNQUFNLEtBQUssS0FDNUIsR0FBRyxLQUFLLFFBQVEsQ0FBQztBQUFBLE1BQ3pCLENBQUM7QUFDRCxXQUFLLElBQUksWUFBWSxJQUFJO0FBQUEsSUFDM0I7QUFHQSxRQUFJLEtBQUssU0FBUyxnQkFBZ0IsUUFBUSxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQy9ELFlBQU0sV0FBVyxVQUFVLEVBQUUsS0FBSyx5QkFBeUIsQ0FBQztBQUM1RCxlQUFTLElBQUksR0FBRyxJQUFJLEtBQUssTUFBTSxRQUFRLEtBQUs7QUFDMUMsY0FBTSxRQUFRLElBQUksS0FBSyxRQUFRLFNBQVMsTUFBTSxLQUFLLFFBQVEsWUFBWTtBQUN2RSxjQUFNLE1BQU0sVUFBVTtBQUFBLFVBQ3BCLEtBQUssMERBQTBELEtBQUs7QUFBQSxRQUN0RSxDQUFDO0FBQ0QsWUFBSSxpQkFBaUIsU0FBUyxNQUFNLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQztBQUN2RCxpQkFBUyxZQUFZLEdBQUc7QUFBQSxNQUMxQjtBQUNBLFdBQUssSUFBSSxZQUFZLFFBQVE7QUFBQSxJQUMvQjtBQUlBLFNBQUssSUFBSSxhQUFhLEVBQUUsU0FBUyxLQUFLLElBQUksc0JBQXNCLElBQUksU0FBUyxHQUFHLENBQUM7QUFBQSxFQUNuRjtBQUNGO0FBR0EsU0FBUyxhQUFhLE9BQWdCLE9BQWtDO0FBQ3RFLFNBQ0UsTUFBTSxRQUFRLEtBQUssS0FBSyxNQUFNLFdBQVcsU0FBUyxNQUFNLE1BQU0sQ0FBQyxNQUFNLE9BQU8sTUFBTSxRQUFRO0FBRTlGOyIsCiAgIm5hbWVzIjogWyJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAibmV3TmFtZSIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiJdCn0K
