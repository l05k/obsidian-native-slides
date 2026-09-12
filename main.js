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
var import_obsidian9 = require("obsidian");

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
function enContext() {
  return [
    `This note belongs to a deck used by the Obsidian plugin "Native Slides". The plugin turns markdown notes into slides: a deck is an ordered chain of notes, each note is ONE slide shown as an immersive, one screen = one card view (each slide always starts at the top of its note).`,
    ``,
    `How to build a slides deck:`,
    `- A slide is an ordinary markdown note in the vault; the only reserved frontmatter property is deck \u2014 one link to the NEXT slide (e.g. deck: ["[[slide-2]]"], or deck: [] for the last slide). The chain order is the presentation order; page numbers are auto-computed.`,
    `- Create a new deck with the command "Create new slide" (fresh note, deck: []). Add pages with "Create next slide" \u2014 it wires the deck links automatically (the current note's deck link is pointed at the new note, the new note gets the old target).`,
    `- Content is written in plain markdown and rendered on the card in the note's language when possible. Keep every slide within one screen \u2014 the capacity numbers below are the fit budget (they already subtract the slides bar and the card title).`,
    `- The user's request comes first: follow what the user asked for ("for material X make a slides deck"), using the plugin's conventions above as the form, not as the content.`
  ];
}
function zhContext() {
  return [
    `\u672C\u7B14\u8BB0\u5C5E\u4E8E Obsidian \u63D2\u4EF6 "Native Slides" \u7684 deck \u7B14\u8BB0\u3002\u8BE5\u63D2\u4EF6\u628A markdown \u7B14\u8BB0\u53D8\u6210\u5E7B\u706F\u7247\uFF1A\u4E00\u4E2A deck \u5C31\u662F\u4E00\u7EC4\u6709\u5E8F\u94FE\u63A5\u7684\u7B14\u8BB0\uFF0C\u6BCF\u7BC7\u7B14\u8BB0\u5C31\u662F\u4E00\u5F20\u5E7B\u706F\u7247\uFF0C\u4EE5"\u4E00\u5C4F\u4E00\u5361"\u7684\u6C89\u6D78\u5F0F\u5361\u7247\u89C6\u56FE\u5C55\u793A\uFF08\u6BCF\u5F20\u5E7B\u706F\u7247\u90FD\u4ECE\u7B14\u8BB0\u5F00\u5934\u5F00\u59CB\uFF09\u3002`,
    ``,
    `\u5982\u4F55\u6784\u5EFA\u5E7B\u706F\u7247 deck\uFF1A`,
    `- \u5E7B\u706F\u7247\u5C31\u662F\u5E93\u91CC\u7684\u666E\u901A markdown \u7B14\u8BB0\uFF1B\u552F\u4E00\u4FDD\u7559\u7684 frontmatter \u5C5E\u6027\u662F deck\u2014\u2014\u6307\u5411\u4E0B\u4E00\u5F20\u7684\u94FE\u63A5\uFF08\u5982 deck: ["[[slide-2]]"]\uFF0C\u6700\u540E\u4E00\u5F20\u5199 deck: []\uFF09\u3002\u94FE\u7684\u987A\u5E8F\u5373\u653E\u6620\u987A\u5E8F\uFF0C\u9875\u53F7\u81EA\u52A8\u8BA1\u7B97\u3002`,
    `- \u7528\u547D\u4EE4 "Create new slide" \u65B0\u5EFA\u4E00\u5957 deck\uFF08\u65B0\u5EFA\u7B14\u8BB0\uFF0Cdeck: []\uFF09\uFF1B\u7528 "Create next slide" \u7EE7\u7EED\u52A0\u9875\u2014\u2014\u5B83\u4F1A\u81EA\u52A8\u63A5\u901A\u94FE\uFF08\u5F53\u524D\u7B14\u8BB0\u7684 deck \u94FE\u63A5\u6307\u5411\u65B0\u9875\uFF0C\u65B0\u9875\u7EE7\u627F\u539F\u6765\u7684\u4E0B\u4E00\u5F20\uFF09\u3002`,
    `- \u5185\u5BB9\u7528\u7EAF markdown \u7F16\u5199\uFF0C\u5728\u5361\u7247\u4E0A\u6E32\u67D3\uFF1B\u5C3D\u91CF\u4F7F\u7528\u7528\u6237\u5F53\u524D\u7684\u8BED\u8A00\u63AA\u8F9E\u3002\u6BCF\u5F20\u5E7B\u706F\u7247\u5FC5\u987B\u653E\u5165\u4E00\u5C4F\u2014\u2014\u4E0B\u9762\u7684\u5BB9\u91CF\u6570\u5B57\u5C31\u662F\u53EF\u7528\u9884\u7B97\uFF08\u5DF2\u7ECF\u6263\u6389 slides \u680F\u4E0E\u5361\u7247\u6807\u9898\uFF09\u3002`,
    `- \u4EE5\u7528\u6237\u7684\u5B9E\u9645\u9700\u6C42\u4E3A\u5148\uFF1A\u7528\u6237\u8981\u4EC0\u4E48\uFF08\u5982"\u57FA\u4E8E\u67D0\u6750\u6599\u5236\u4F5C slides \u7B14\u8BB0"\uFF09\u5C31\u505A\u4EC0\u4E48\uFF0C\u63D2\u4EF6\u7684\u7EA6\u5B9A\u53EA\u662F\u5F62\u5F0F\uFF0C\u4E0D\u662F\u5185\u5BB9\u3002`
  ];
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
    ...enContext(),
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
    ...zhContext(),
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
  const note = locale === "zh" ? "\u7528\u6CD5\uFF1A\u7528\u6237\u4F1A\u63D0\u4F9B\u6750\u6599\u5E76\u8BF4\u300C\u57FA\u4E8E\u8BE5\u6750\u6599\u5236\u4F5C slides/PPT \u7B14\u8BB0\u300D\uFF1B\u6B64\u65F6\u6309\u4E0A\u6587\u7EA6\u5B9A\u521B\u5EFA deck \u2014\u2014 \u5148\u4E86\u89E3\u6750\u6599\u5E76\u7ED9\u51FA\u63D0\u7EB2/\u89C4\u5212\uFF0C\u518D\u9010\u9875\u751F\u6210\u7B14\u8BB0\uFF1B\u6BCF\u4E2A\u5361\u7247\uFF08\u7B14\u8BB0\uFF09\u5185\u653E\u6070\u5230\u597D\u5904\u7684\u5185\u5BB9\uFF0C\u4E0D\u8981\u8D85\u51FA\u5BB9\u91CF\u3002\u8981\u6C42\uFF1A\u751F\u6210\u7684\u5185\u5BB9\u5FC5\u987B\u653E\u5728\u5F53\u524D\u8FD9\u4E00\u5C4F\u5185\uFF0C\u4E0D\u6EDA\u52A8\uFF1B\u7528\u4E0A\u9762\u7684\u51E0\u4F55\u4E0E\u884C\u9AD8\u6570\u5B57\u6838\u7B97\u603B\u9AD8\u5EA6\uFF08\u6B63\u6587\u884C\u6570 \xD7 \u884C\u9AD8 + \u6807\u9898\u9884\u7559 + \u5757\u95F4\u95F4\u8DDD \u2264 \u6587\u5B57\u533A\u9AD8\u5EA6\uFF09\u3002" : "Usage: the user will provide material and ask to make slides/PPT notes for it; in that case create a deck per the conventions above \u2014 review the material and outline the structure first, then generate each slide note; keep each card's content just within capacity. Requirement: the generated content must fit this one screen \u2014 no scrolling. Check the total height with the numbers above (lines \xD7 line-height + title reserve + inter-block spacing \u2264 text area height).";
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
var import_obsidian4 = require("obsidian");
function registerCommands(plugin) {
  plugin.addCommand({
    id: "ns-toggle-bar",
    name: "Toggle slides bar",
    checkCallback: (checking) => {
      if (!document.body.classList.contains("native-slides-mode")) return false;
      if (!checking) {
        plugin.settings.barHidden = !plugin.settings.barHidden;
        void plugin.saveSettings().then(() => plugin.refresh());
      }
      return true;
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
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || !plugin.deckService.isMember(file)) return false;
      if (!checking) void plugin.navigate("prev");
      return true;
    }
  });
  plugin.addCommand({
    id: "ns-next",
    name: "Next page",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "ArrowRight" }],
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || !plugin.deckService.isMember(file)) return false;
      if (!checking) void plugin.navigate("next");
      return true;
    }
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
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (file && plugin.deckService.isMember(file)) return false;
      if (!checking) void plugin.deckService.executeCreateNew(plugin.deckService.planCreateNew());
      return true;
    }
  });
  plugin.addCommand({
    id: "ns-make-first-slide",
    name: "Initialize slides with this note",
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || plugin.deckService.isMember(file)) return false;
      if (!checking) {
        void (async () => {
          const converted = await plugin.deckService.makeFirstSlide(file);
          if (!converted) return;
          new import_obsidian4.Notice("Native slides: made this note the first slide of a new deck");
          await plugin.enterSlidesForActive();
        })();
      }
      return true;
    }
  });
  plugin.addCommand({
    id: "ns-copy-slide-skill",
    name: "Copy AI agent prompt",
    callback: async () => {
      if (!document.body.classList.contains("native-slides-mode")) {
        new import_obsidian4.Notice("Native slides: enter Slides mode first (Mod+Shift+E on a deck note)");
        return;
      }
      await copyCapacityPrompt(plugin.app);
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
var import_obsidian5 = require("obsidian");

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
function deckFromHead(head, currentPath, getLinks) {
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
function planMakeFirstSlide(input) {
  if (input.alreadyDeck) return null;
  return { deck: [] };
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
  /** Resolved next-slide paths of the note at `path` ([] when none, or the link is broken) */
  nextLinks(path) {
    return this.linkPaths(path);
  }
  /** Resolve the `deck` property of a note into real note paths (max one) */
  linkPaths(path) {
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof import_obsidian5.TFile)) return [];
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
  /**
   * Promote the active note into the head of a brand-new deck: add `deck: []`
   * to its frontmatter — content, title, location and every other property
   * stay untouched. Notes that already belong to a deck are left alone.
   * Returns true when the note was converted (the caller may then auto-enter
   * Slides mode), false when it was already a deck member.
   */
  async makeFirstSlide(file) {
    if (planMakeFirstSlide({ alreadyDeck: this.isMember(file) }) === null) return false;
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm[DECK_KEY] = [];
    });
    await this.waitForCachedDeck(file);
    return true;
  }
  /**
   * Wait until the metadata cache reflects the note's `deck` property
   * (best effort — resolves on the property appearing, or after `timeoutMs`).
   */
  async waitForCachedDeck(file, timeoutMs = 2e3) {
    if (this.hasDeckInCache(file)) return;
    await new Promise((resolve) => {
      const ref = this.app.metadataCache.on("changed", (changed) => {
        if (changed.path === file.path && this.hasDeckInCache(file)) {
          this.app.metadataCache.offref(ref);
          window.clearTimeout(timer);
          resolve();
        }
      });
      const timer = window.setTimeout(() => {
        this.app.metadataCache.offref(ref);
        resolve();
      }, timeoutMs);
    });
  }
  /** Whether the metadata cache already shows a `deck` property on the note */
  hasDeckInCache(file) {
    const fm = frontmatterOf(this.app, file);
    return fm !== null && DECK_KEY in fm;
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
      new import_obsidian5.Notice(`Native slides: could not create "${plan.newName}.md" (${String(error)})`);
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
   * Apply a move plan: rewrite the `deck` property of every slide whose
   * next link changed, in new chain order, as bare `[[basename]]` links (the
   * form createNext and deleteSlides write). Only the notes the plan names are
   * touched — the rest of the deck keeps its frontmatter untouched.
   *
   * Stops at the first failed write and returns false: the remaining notes
   * keep their old links, which the caller shows by re-rendering from the live
   * chain. A rewrite whose source or target note has vanished aborts the same
   * way — writing `deck: []` for a target that is gone would silently truncate
   * the chain. Returns true when every rewrite was applied.
   */
  async executeMove(plan) {
    for (const rewrite of plan.rewrites) {
      const file = this.app.vault.getAbstractFileByPath(rewrite.path);
      if (!(file instanceof import_obsidian5.TFile)) {
        new import_obsidian5.Notice(`Native slides: could not move slides \u2014 "${rewrite.path}" is gone`);
        return false;
      }
      const nextPath = rewrite.nextPath;
      const next = nextPath ? this.app.vault.getAbstractFileByPath(nextPath) : null;
      if (nextPath !== null && !(next instanceof import_obsidian5.TFile)) {
        new import_obsidian5.Notice(
          `Native slides: could not move slides \u2014 "${nextPath}" is gone (needed by "${file.basename}")`
        );
        return false;
      }
      try {
        await this.app.fileManager.processFrontMatter(file, (fm) => {
          fm[DECK_KEY] = next instanceof import_obsidian5.TFile ? [`[[${next.basename}]]`] : [];
        });
      } catch (error) {
        new import_obsidian5.Notice(
          `Native slides: could not move slides \u2014 writing "${file.basename}" failed (${String(error)})`
        );
        return false;
      }
    }
    return true;
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
      if (!(f instanceof import_obsidian5.TFile)) continue;
      const next = rewrite.nextPath ? this.app.vault.getAbstractFileByPath(rewrite.nextPath) : null;
      await this.app.fileManager.processFrontMatter(f, (fm) => {
        fm[DECK_KEY] = next instanceof import_obsidian5.TFile ? [`[[${next.basename}]]`] : [];
      });
    }
    const trashed = [];
    for (const path of deletePaths) {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof import_obsidian5.TFile)) continue;
      try {
        await this.app.fileManager.trashFile(f);
        trashed.push(path);
      } catch (error) {
        new import_obsidian5.Notice(`Native slides: could not delete "${f.basename}" (${String(error)})`);
      }
    }
    return { trashed, landingPath: pickLandingPath(chain, deletePaths, focusPath) };
  }
};
function dirPrefix(path) {
  if (!path || path === "/") return "";
  return `${path.replace(/\/+$/, "")}/`;
}

// src/nav.ts
function sessionDeck(head, anchorPath, fromHead, compute) {
  if (!anchorPath) return null;
  if (head) {
    const deck = fromHead(head, anchorPath);
    if (deck) return deck;
  }
  return compute(anchorPath);
}
function stepTarget(deck, intent) {
  const index = "index" in intent ? intent.index : intent.dir === "prev" ? deck.index - 1 : deck.index + 1;
  if (index === deck.index || index < 0 || index >= deck.chain.length) return null;
  return deck.chain[index] ?? null;
}
var NavSession = class {
  constructor(hooks) {
    this.hooks = hooks;
    this.queue = [];
    this.running = false;
    this.pending = null;
    this.head = null;
    /** Resolves when the queue has drained (the promise `push()` returns) */
    this.draining = null;
  }
  /** The chain head this session entered, or null before its first step */
  get rememberedHead() {
    return this.head;
  }
  /**
   * Re-base the session on a different chain head. A move rewires the deck
   * around the session, so the head it entered may no longer be the deck's
   * head (and, still reaching the current note, would walk a truncated chain
   * from the middle); the caller hands over the new chain's own head.
   */
  setHead(head) {
    this.head = head;
  }
  /** Queue a press; the first one starts the drain. Resolves once the queue is empty. */
  push(intent) {
    this.queue.push(intent);
    if (this.running) return this.draining ?? Promise.resolve();
    this.draining = this.drain().catch((error) => {
      console.error("native-slides: navigation failed", error);
    });
    return this.draining;
  }
  async drain() {
    this.running = true;
    try {
      while (this.queue.length > 0) {
        const intent = this.queue.shift();
        if (!intent) break;
        const from = this.pending ?? this.hooks.activePath();
        if (!from) continue;
        const deck = this.hooks.resolve(from, this.head);
        if (!deck) continue;
        this.head = deck.chain[0] ?? this.head;
        const target = stepTarget(deck, intent);
        if (!target) continue;
        this.pending = target;
        await this.hooks.open(target, from);
      }
    } catch (error) {
      this.queue.length = 0;
      throw error;
    } finally {
      this.pending = null;
      this.running = false;
    }
  }
};

// src/panel.ts
var import_obsidian7 = require("obsidian");

// src/confirm-delete.ts
var import_obsidian6 = require("obsidian");
var MAX_VISIBLE_NAMES = 8;
var ConfirmDeleteModal = class extends import_obsidian6.Modal {
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

// src/panel-drag.ts
var DRAG_THRESHOLD = 4;
var EDGE_BAND = 24;
var EDGE_SPEED = 8;
var PanelDrag = class {
  constructor(host) {
    this.host = host;
    /** A press that has not travelled far enough to be a drag yet */
    this.press = null;
    /** The drag in flight, or null while the press is still a candidate */
    this.state = null;
    /** Whether the last finished gesture was a drag — swallows the click it ends with */
    this.dragged = false;
    this.onMove = (event) => {
      const press = this.press;
      if (!press) return;
      if (!this.state) {
        if (Math.hypot(event.clientX - press.x, event.clientY - press.y) < DRAG_THRESHOLD) return;
        this.start(event, press);
        return;
      }
      this.state.y = event.clientY;
      this.paint();
    };
    this.onUp = () => this.finish(false);
    this.onCancel = () => this.finish(true);
    this.onKey = (event) => {
      if (event.key === "Escape") this.finish(true);
    };
    /** Keep the list scrolling while the pointer sits in an edge band */
    this.scrollTick = () => {
      const state = this.state;
      if (!state) return;
      const container = this.host.container();
      if (container) {
        const rect = container.getBoundingClientRect();
        const dy = state.y < rect.top + EDGE_BAND ? -EDGE_SPEED : state.y > rect.bottom - EDGE_BAND ? EDGE_SPEED : 0;
        if (dy !== 0) {
          const before = container.scrollTop;
          container.scrollTop = before + dy;
          if (container.scrollTop !== before) this.paint();
        }
      }
      state.raf = window.requestAnimationFrame(this.scrollTick);
    };
  }
  /** Whether a drag is in flight (the panel suspends re-rendering meanwhile) */
  get active() {
    return this.state !== null;
  }
  /** Abandon the gesture — the view is closing under it */
  cancel() {
    this.finish(true);
  }
  /** A press on an item; it becomes a drag once the pointer travels far enough */
  begin(event, path) {
    if (event.button !== 0) return;
    this.dragged = false;
    if (event.shiftKey || event.ctrlKey || event.metaKey) return;
    if (this.press || this.state) return;
    if (this.host.items().length < 2) return;
    this.press = { x: event.clientX, y: event.clientY, path };
    document.addEventListener("pointermove", this.onMove);
    document.addEventListener("pointerup", this.onUp);
    document.addEventListener("pointercancel", this.onCancel);
    document.addEventListener("keydown", this.onKey, true);
    window.addEventListener("blur", this.onCancel);
  }
  /**
   * Whether the click that ends this gesture belongs to a drag. True at most
   * once per drag, so a drag does not also open the slide it moved; a plain
   * press-release never sets it.
   */
  consumeClick() {
    const dragged = this.dragged;
    this.dragged = false;
    return dragged;
  }
  /** Turn the candidate press into a drag: ghost, dimmed items, insertion line */
  start(event, press) {
    const moving = this.host.movingFor(press.path);
    if (moving.length === 0) {
      this.finish(true);
      return;
    }
    const grabbed = this.host.items().find((it) => it.path === press.path);
    const rect = grabbed?.el.getBoundingClientRect();
    const line = createDiv({ cls: "native-slides-panel-drop-line" });
    line.setCssStyles({ display: "none" });
    document.body.appendChild(line);
    let ghost = null;
    if (grabbed && rect) {
      ghost = grabbed.el.cloneNode(true);
      ghost.classList.remove("is-active", "is-selected", "is-dragging");
      ghost.addClass("native-slides-panel-drag-ghost");
      ghost.setCssStyles({
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`
      });
      document.body.appendChild(ghost);
    }
    const movingSet = new Set(moving);
    for (const item of this.host.items()) {
      if (movingSet.has(item.path)) item.el.addClass("is-dragging");
    }
    document.body.addClass("native-slides-dragging");
    window.getSelection()?.removeAllRanges();
    this.host.onGrab(press.path);
    this.state = {
      moving,
      chain: this.host.items().map((it) => it.path),
      y: event.clientY,
      offsetY: rect ? event.clientY - rect.top : 0,
      insertAt: 0,
      ghost,
      line,
      raf: window.requestAnimationFrame(this.scrollTick)
    };
    this.paint();
  }
  /** End the gesture: commit a real drop, or clean up after a cancel */
  finish(cancelled) {
    const state = this.state;
    this.press = null;
    this.state = null;
    document.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerup", this.onUp);
    document.removeEventListener("pointercancel", this.onCancel);
    document.removeEventListener("keydown", this.onKey, true);
    window.removeEventListener("blur", this.onCancel);
    if (!state) return;
    this.dragged = true;
    state.ghost?.remove();
    state.line.remove();
    const movingSet = new Set(state.moving);
    for (const item of this.host.items()) {
      if (movingSet.has(item.path)) item.el.removeClass("is-dragging");
    }
    document.body.removeClass("native-slides-dragging");
    window.cancelAnimationFrame(state.raf);
    if (!cancelled) this.host.onDrop(state.moving, state.insertAt, state.chain);
    this.host.onEnd();
  }
  /** Move the ghost to the pointer and the insertion line to the nearest gap */
  paint() {
    const state = this.state;
    if (!state) return;
    const rects = this.host.items().map((it) => it.el.getBoundingClientRect());
    const edges = rects.map((rect) => rect.top);
    const last = rects[rects.length - 1];
    if (last) edges.push(last.bottom);
    let best = Number.POSITIVE_INFINITY;
    for (let gap2 = 0; gap2 < edges.length; gap2++) {
      const distance = Math.abs(state.y - edges[gap2]);
      if (distance < best) {
        best = distance;
        state.insertAt = gap2;
      }
    }
    const gap = state.insertAt;
    const ref = gap < rects.length ? rects[gap] : last;
    state.ghost?.setCssStyles({ top: `${state.y - state.offsetY}px` });
    if (!ref || !this.host.willChange(state.moving, gap)) {
      state.line.setCssStyles({ display: "none" });
      return;
    }
    state.line.setCssStyles({
      display: "",
      top: `${gap < rects.length ? ref.top : ref.bottom}px`,
      left: `${ref.left + 6}px`,
      width: `${Math.max(0, ref.width - 12)}px`
    });
  }
};

// src/move.ts
function planMove(chain, moving, insertAt) {
  if (chain.length < 2) return null;
  if (!Number.isInteger(insertAt) || insertAt < 0 || insertAt > chain.length) return null;
  const movingSet = new Set(moving);
  const block = chain.filter((path) => movingSet.has(path));
  if (block.length === 0 || block.length === chain.length) return null;
  const rest = chain.filter((path) => !movingSet.has(path));
  const before = chain.slice(0, insertAt).filter((path) => !movingSet.has(path)).length;
  const next = [...rest.slice(0, before), ...block, ...rest.slice(before)];
  const oldNext = /* @__PURE__ */ new Map();
  for (let i = 0; i < chain.length; i++) oldNext.set(chain[i], chain[i + 1] ?? null);
  const rewrites = [];
  for (let i = 0; i < next.length; i++) {
    const newNext = next[i + 1] ?? null;
    if (oldNext.get(next[i]) !== newNext) rewrites.push({ path: next[i], nextPath: newNext });
  }
  return { chain: next, rewrites };
}
function stepInsertAt(chain, moving, direction) {
  const movingSet = new Set(moving);
  const first = chain.findIndex((path) => movingSet.has(path));
  if (first === -1) return null;
  let last = first;
  for (let i = chain.length - 1; i > first; i--) {
    if (movingSet.has(chain[i])) {
      last = i;
      break;
    }
  }
  if (direction === "up") return first > 0 ? first - 1 : null;
  return last < chain.length - 1 ? last + 2 : null;
}

// src/panel.ts
var SLIDES_PANEL_VIEW = "native-slides-panel";
var SlidesPanelView = class extends import_obsidian7.ItemView {
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
    /** Whether a move is writing frontmatter right now (renders are held back) */
    this.writing = false;
    this.drag = new PanelDrag({
      items: () => this.items,
      movingFor: (path) => this.movingFor(path),
      container: () => this.contentEl,
      onGrab: (path) => this.onGrab(path),
      willChange: (moving, insertAt) => this.willChange(moving, insertAt),
      onDrop: (moving, insertAt, snapshot) => void this.applyMove(moving, insertAt, snapshot),
      onEnd: () => this.render()
    });
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
    this.drag.cancel();
    this.contentEl.empty();
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
    if (this.drag.active || this.writing) return;
    const file = this.app.workspace.getActiveFile();
    const chain = this.liveChain(file);
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
  /** The deck chain of `file`, limited to slides that exist right now */
  liveChain(file) {
    const deck = file ? this.plugin.resolveDeck(file) : null;
    return deck ? deck.chain.filter((p) => this.app.vault.getAbstractFileByPath(p) instanceof import_obsidian7.TFile) : [];
  }
  /** Full rebuild (chain shape changed) */
  rebuild(chain) {
    const root = this.contentEl;
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
      if (!(f instanceof import_obsidian7.TFile)) return;
      const item = root.createDiv({ cls: "native-slides-panel-item" });
      if (path === activePath) item.addClass("is-active");
      item.createSpan({ cls: "native-slides-panel-num" }).setText(String(i + 1));
      item.createSpan({ cls: "native-slides-panel-title" }).setText(f.basename);
      item.addEventListener("click", (e) => this.onItemClick(e, i, f));
      item.addEventListener("pointerdown", (e) => this.drag.begin(e, path));
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.openContextMenu(e, f);
      });
      this.items.push({ path, el: item });
    });
  }
  /** Click routing: plain = open, Mod = toggle select, Shift = range select */
  onItemClick(e, index, f) {
    if (this.drag.consumeClick()) return;
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
  /**
   * The slides an action on `path` applies to: the whole selection when `path`
   * belongs to it, otherwise just that slide. Chain-ordered, and limited to
   * the slides the deck still holds.
   */
  movingFor(path) {
    if (!this.selected.has(path)) return [path];
    return this.lastChain.filter((p) => this.selected.has(p));
  }
  /** A drag started on `path`: a slide outside the selection is dragged alone */
  onGrab(path) {
    if (!this.selected.has(path) && this.selected.size > 0) {
      this.selected.clear();
      this.syncSelectionClasses();
    }
    this.anchor = path;
  }
  /** Whether that drop would actually rewire something (a no-op hides the line) */
  willChange(moving, insertAt) {
    const plan = planMove(this.lastChain, moving, insertAt);
    return plan !== null && plan.rewrites.length > 0;
  }
  /** Move the given slides one step towards `direction` (context menu) */
  moveStep(moving, direction) {
    const insertAt = stepInsertAt(this.lastChain, moving, direction);
    if (insertAt === null) return;
    void this.applyMove(moving, insertAt, this.lastChain);
  }
  /**
   * Apply a move: plan it against the live chain, then let the deck service
   * rewire the `deck` links of the slides whose next link changes. `snapshot`
   * is the chain the gesture (or the menu action) was computed against — when
   * the deck changed meanwhile the gap index means nothing, so the move is
   * dropped rather than applied to a deck it no longer describes.
   */
  async applyMove(moving, insertAt, snapshot) {
    const chain = this.liveChain(this.app.workspace.getActiveFile());
    if (!chainEquals(chain, snapshot)) return;
    const plan = planMove(chain, moving, insertAt);
    if (!plan || plan.rewrites.length === 0) return;
    const applied = await this.runMove(plan);
    this.plugin.rememberDeckHead(applied ? plan.chain[0] ?? null : null);
    this.render();
  }
  /** Run a move with the panel's re-rendering held back for its duration */
  async runMove(plan) {
    this.writing = true;
    try {
      return await this.plugin.deckService.executeMove(plan);
    } finally {
      this.writing = false;
    }
  }
  /** Right-click menu on one item; operates on the whole selection when it belongs to one */
  openContextMenu(e, f) {
    const menu = new import_obsidian7.Menu();
    const moving = this.movingFor(f.path);
    const what = moving.length > 1 ? `${moving.length} slides` : "slide";
    const up = stepInsertAt(this.lastChain, moving, "up");
    const down = stepInsertAt(this.lastChain, moving, "down");
    menu.addItem(
      (mi) => mi.setTitle(`Move ${what} up`).setIcon("arrow-up").setDisabled(up === null).onClick(() => this.moveStep(moving, "up"))
    );
    menu.addItem(
      (mi) => mi.setTitle(`Move ${what} down`).setIcon("arrow-down").setDisabled(down === null).onClick(() => this.moveStep(moving, "down"))
    );
    menu.addItem(
      (mi) => mi.setTitle("Create next slide").setIcon("plus").onClick(() => void this.createNextAfter(f))
    );
    menu.addItem(
      (mi) => mi.setTitle(moving.length > 1 ? `Delete ${moving.length} slides` : "Delete slide").setIcon("trash").onClick(() => this.deleteSlides(moving))
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
      return f instanceof import_obsidian7.TFile ? f.basename : p;
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
      if (f instanceof import_obsidian7.TFile) await this.openSlide(f);
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
var import_obsidian8 = require("obsidian");
var NativeSlidesSettingTab = class extends import_obsidian8.PluginSettingTab {
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
    new import_obsidian8.Setting(containerEl).setName("Style template").setDesc(
      "Built-in look for the slides card and slides bar (border, background, shadow, bar styling). Every template adapts to light and dark themes."
    ).addDropdown((dropdown) => {
      for (const t of SLIDES_THEMES) dropdown.addOption(t.id, t.label);
      dropdown.setValue(this.plugin.settings.slidesTheme).onChange(async (value) => {
        this.plugin.settings.slidesTheme = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      });
    });
    new import_obsidian8.Setting(containerEl).setName("Center images").setDesc(
      "Images render centered on the slide as a card block exactly as tall as the picture. Turn off for Obsidian's usual behavior: images stay inline with the text (a small image and its caption sit on the same row)."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.imageLayout).onChange(async (value) => {
        this.plugin.settings.imageLayout = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Show slides bar").setDesc("Master toggle for the entire slides bar at the bottom of the window").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showSlidesBar).onChange(async (value) => {
        this.plugin.settings.showSlidesBar = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Show previous/next buttons").setDesc(
      "Show \u25C0 \u25B6 buttons on the left of the slides bar when the note belongs to a deck (has a `deck` property)"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showNavButtons).onChange(async (value) => {
        this.plugin.settings.showNavButtons = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Page number style").setDesc(
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
    new import_obsidian8.Setting(containerEl).setName("Show progress bar").setDesc(
      "Discrete clickable segments at the top of the slides bar -- one per slide, click to jump"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showProgress).onChange(async (value) => {
        this.plugin.settings.showProgress = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Auto-enter slides mode").setDesc(
      "Open deck notes directly in Slides mode. Leave off to enter manually with the Toggle Slides Mode command (Mod+Shift+E) or the previous/next page hotkeys."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoEnterSlides).onChange(async (value) => {
        this.plugin.settings.autoEnterSlides = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Escape exits slides mode").setDesc("Press escape to leave slides mode and return to the previous view").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.escExitsSlides).onChange(async (value) => {
        this.plugin.settings.escExitsSlides = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Slides title").setDesc(
      "Frontmatter property to show as the card title (H1). Leave empty for none; type `filename` to use the file name."
    ).addText(
      (text) => text.setPlaceholder("E.g. Title").setValue(this.plugin.settings.slidesTitle).onChange(async (value) => {
        this.plugin.settings.slidesTitle = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Bar properties").setDesc(
      "Comma-separated frontmatter property names to show in the slides bar (e.g. `university, short-title, date`). Each value fills an equal-width column; drag dividers to resize. Leave empty to show nothing."
    ).addText(
      (text) => text.setPlaceholder("E.g. University, date").setValue(this.plugin.settings.barProperties).onChange(async (value) => {
        this.plugin.settings.barProperties = value;
        await this.plugin.saveSettings();
        this.plugin.refresh();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Confirm slide deletion").setDesc(
      "Ask for confirmation before deleting slides from the slides panel's right-click menu. Deletion moves slides to the trash."
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.confirmDeleteSlides).onChange(async (value) => {
        this.plugin.settings.confirmDeleteSlides = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Navigation hotkeys").setDesc(
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
var NativeSlidesPlugin = class extends import_obsidian9.Plugin {
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
    this.nav = new NavSession({
      resolve: (path, head) => this.deckWithHead(path, head),
      open: async (target, from) => {
        if (!this.slidesMode) await this.enterSlides();
        await this.app.workspace.openLinkText(target, from);
      },
      activePath: () => this.app.workspace.getActiveFile()?.path ?? null
    });
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
        const view = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian9.MarkdownView);
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
  /**
   * Auto-enter Slides mode for the active note once it has become a deck
   * note — used after a command promotes a plain note into a deck (e.g.
   * "Make this note the first slide"). No-op while Slides mode is already
   * active or the active note is not (yet) a deck note.
   */
  async enterSlidesForActive() {
    if (this.slidesMode) return;
    const file = this.app.workspace.getActiveFile();
    if (!file || !this.isDeckNote(file)) return;
    await this.enterSlides();
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
  /**
   * Resolve a note's deck, preferring the chain head the current navigation
   * session entered (walked live, so edits to the deck are honoured). The bar and
   * the slides panel read this too, so the page number always describes the chain
   * navigation is actually using.
   */
  resolveDeck(file) {
    return this.deckWithHead(file.path, this.nav.rememberedHead);
  }
  /**
   * Re-base the navigation session on a deck head. The slides panel calls this
   * after a move: the session's remembered head may now sit mid-chain, so
   * the bar, the page number and the panel would otherwise describe a
   * truncated deck.
   */
  rememberDeckHead(head) {
    this.nav.setHead(head);
  }
  /**
   * Deck for `path`, walked live from `head` while that head still reaches it and
   * resolved afresh (arbitrary head) otherwise.
   */
  deckWithHead(path, head) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian9.TFile)) return null;
    return sessionDeck(
      head,
      path,
      (h, p) => {
        const headFile = this.app.vault.getAbstractFileByPath(h);
        if (!(headFile instanceof import_obsidian9.TFile)) return null;
        return deckFromHead(h, p, (q) => this.deckService.nextLinks(q));
      },
      () => this.deckService.compute(file)
    );
  }
  /** Move one step back/forward along the deck chain (entering Slides mode as needed) */
  async navigate(direction) {
    this.nav.push({ dir: direction });
  }
  /** Jump to a specific index in the deck chain (progress bar click) */
  async jumpTo(index) {
    this.nav.push({ index });
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
    const deck = this.resolveDeck(file);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jYXBhY2l0eS50cyIsICJzcmMvY2FwYWNpdHktY29yZS50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVjay1zZXJ2aWNlLnRzIiwgInNyYy9kZWNrLnRzIiwgInNyYy9jcmVhdGVOZXh0LnRzIiwgInNyYy9kZWxldGVTbGlkZXMudHMiLCAic3JjL25hdi50cyIsICJzcmMvcGFuZWwudHMiLCAic3JjL2NvbmZpcm0tZGVsZXRlLnRzIiwgInNyYy9wYW5lbC1kcmFnLnRzIiwgInNyYy9tb3ZlLnRzIiwgInNyYy9zZXR0aW5ncy50cyIsICJzcmMvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogbmF0aXZlLXNsaWRlcyBcdTIwMTQgYSBcIlNsaWRlcyBtb2RlXCIgZm9yIE9ic2lkaWFuIGRlY2sgbm90ZXNcbiAqXG4gKiBPbmUgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5LCBgZGVja2AgKGEgc2luZ2xlIG1hcmtkb3duIGxpbmsgdG8gdGhlIG5leHRcbiAqIHNsaWRlIFx1MjAxNCBuZXh0LW9ubHkgc2VtYW50aWNzLCBubyBvdmVydmlldyBwYWdlIHNpbmNlIHYxLjAuMCksIGRyaXZlc1xuICogcHJldi9uZXh0IG5hdmlnYXRpb24gYW5kIGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXJzLiBBIGRlY2sgbm90ZSBjYW4gYmVcbiAqIGVudGVyZWQgaW50byAqKlNsaWRlcyBtb2RlKiogXHUyMDE0IGFuIGltbWVyc2l2ZSwgZWRpdGFibGUgKExpdmUgUHJldmlldykgdmlld1xuICogd2l0aCBhIHNsaWRlcyBiYXIgc2hvd2luZyBwcm9wZXJ0aWVzLCBuYXZpZ2F0aW9uIGFuZCB0aGUgcGFnZSBudW1iZXIuXG4gKlxuICogTmF0aXZlIE9ic2lkaWFuIG1vZGVzIChTb3VyY2UgLyBkZWZhdWx0IExpdmUgUHJldmlldyAvIFJlYWRpbmcgdmlldykgYXJlXG4gKiBsZWZ0IGNvbXBsZXRlbHkgdW50b3VjaGVkOiBubyBzdGF0dXMtYmFyIGhpZGluZywgbm8gc2xpZGVzIGJhciwgbm9cbiAqIGZ1bGxzY3JlZW4sIG5vIHN0eWxpbmcuIFNsaWRlcyBtb2RlIGlzIHRoZSBwbHVnaW4ncyBvbmx5IHN1cmZhY2UuXG4gKlxuICogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBhbmQgYSB0aGluIG9yY2hlc3RyYXRpb24gbGF5ZXI7IHRoZSBsb2dpY1xuICogbGl2ZXMgaW4gYHNyYy9gOlxuICogICAtIHNyYy90eXBlcy50cyAgICAgICAgc2V0dGluZ3Mgc2hhcGUgKyBkZWZhdWx0cyArIHJlc2VydmVkIGBkZWNrYCBrZXlcbiAqICAgLSBzcmMvbW9kZS50cyAgICAgICAgIHZpZXcgbW9kZSAvIGZyb250bWF0dGVyIGhlbHBlcnMgKHB1cmUsIGBBcHBgLWJhc2VkKVxuICogICAtIHNyYy9kZWNrLXNlcnZpY2UudHMgZGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWVcbiAqICAgLSBzcmMvYmFyLnRzICAgICAgICAgIGJhciBET00gaGVscGVycyAoY3JlYXRlIC8gYnV0dG9ucyAvIHRhYi1iYXIgbWVhc3VyZSlcbiAqICAgLSBzcmMvcGFuZWwudHMgICAgICAgIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gKiAgIC0gc3JjL2NvbW1hbmRzLnRzICAgICBjb21tYW5kIHJlZ2lzdHJhdGlvbiAoZGV2LWdhdGVkIGRlYnVnIGNvbW1hbmQpXG4gKiAgIC0gc3JjL3NldHRpbmdzLnRzICAgICBzZXR0aW5ncyB0YWJcbiAqICAgLSBzcmMvZGVidWcudHMgICAgICAgIHR5cG9ncmFwaHkgbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KVxuICogICAtIHNyYy9kZWNrLnRzICAgICAgICAgcHVyZSBkZWNrIGNvcmUgKHdpdGggc3JjL2NyZWF0ZU5leHQudHMpXG4gKiAgIC0gc3JjL25hdi50cyAgICAgICAgICBwdXJlIG5hdmlnYXRpb24gY29yZSAocXVldWUgKyBzZXNzaW9uIGNoYWluKVxuICogICAtIHNyYy9tb3ZlLnRzICAgICAgICAgcHVyZSBcIm1vdmUgc2xpZGVzXCIgY29yZSAocmV3aXJlcyB0aGUgbmV4dCBsaW5rcylcbiAqICAgLSBzcmMvcGFuZWwtZHJhZy50cyAgIHRoZSBkcmFnLXRvLW1vdmUgZ2VzdHVyZSBiZWhpbmQgdGhlIHNsaWRlcyBwYW5lbFxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlLCBkZWNrRnJvbUhlYWQsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9zcmMvZGVja1wiO1xuaW1wb3J0IHsgTmF2U2Vzc2lvbiwgc2Vzc2lvbkRlY2sgfSBmcm9tIFwiLi9zcmMvbmF2XCI7XG5pbXBvcnQgeyBhY3RpdmVGcm9udG1hdHRlciwgY3VycmVudE1vZGUsIGZyb250bWF0dGVyT2YsIGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9zcmMvbW9kZVwiO1xuaW1wb3J0IHsgU2xpZGVzUGFuZWxWaWV3LCBTTElERVNfUEFORUxfVklFVyB9IGZyb20gXCIuL3NyYy9wYW5lbFwiO1xuaW1wb3J0IHsgTmF0aXZlU2xpZGVzU2V0dGluZ1RhYiB9IGZyb20gXCIuL3NyYy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgREVDS19LRVksIERFRkFVTFRfU0VUVElOR1MsIFNMSURFU19USEVNRVMsIHR5cGUgTmF0aXZlU2xpZGVzU2V0dGluZ3MgfSBmcm9tIFwiLi9zcmMvdHlwZXNcIjtcbmltcG9ydCB7IGNsZWFyQ2hpbGRyZW4gfSBmcm9tIFwiLi9zcmMvdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF0aXZlU2xpZGVzUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgLyoqIFRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50ICovXG4gIGJhcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgLyoqIERlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiY3JlYXRlIG5leHQgc2xpZGVcIiBnbHVlICovXG4gIGRlY2tTZXJ2aWNlITogRGVja1NlcnZpY2U7XG4gIC8qKiBQbHVnaW4gc2V0dGluZ3MgKi9cbiAgc2V0dGluZ3M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTIH07XG5cbiAgLyoqIFdoZXRoZXIgU2xpZGVzIG1vZGUgaXMgY3VycmVudGx5IGFjdGl2ZSAoc2Vzc2lvbiBzdGF0ZSwgbm90IHBlcnNpc3RlZCkgKi9cbiAgcHJpdmF0ZSBzbGlkZXNNb2RlID0gZmFsc2U7XG4gIC8qKiBWaWV3IG1vZGUgdG8gcmVzdG9yZSB3aGVuIGxlYXZpbmcgU2xpZGVzIG1vZGUgKFwicHJldmlld1wiIHwgXCJzb3VyY2VcIikgKi9cbiAgcHJpdmF0ZSBleGl0TW9kZTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiID0gXCJzb3VyY2VcIjtcbiAgLyoqIFdoZXRoZXIgdGhlIGV4aXQgdmlldyB3YXMgU291cmNlIG1vZGUgKHRydWUpIHZzIExpdmUgUHJldmlldyAoZmFsc2UpICovXG4gIHByaXZhdGUgZXhpdFNvdXJjZSA9IGZhbHNlO1xuICAvKiogTGFzdCBub3RlIGF1dG8tZW50ZXJlZCBpbnRvIFNsaWRlcyBtb2RlIChwcmV2ZW50cyByZS1lbnRlcmluZyBhZnRlciBtYW51YWwgZXhpdCkgKi9cbiAgcHJpdmF0ZSBhdXRvRW50ZXJlZFBhdGggPSBcIlwiO1xuICAvKiogTGFzdCByZWZyZXNoIGtleSAoXCJwYXRofG1vZGVcIikgdG8gYXZvaWQgcG9pbnRsZXNzIHJlLXJlbmRlcnMgKi9cbiAgcHJpdmF0ZSBsYXN0S2V5ID0gXCJcIjtcbiAgLyoqIExhc3QgbWVhc3VyZWQgdGFiLWJhciBoZWlnaHQgKHB4KSBcdTIwMTQgY2FjaGVkIHdoaWxlIHRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiAqL1xuICBwcml2YXRlIHRhYkJhckhlaWdodCA9IDA7XG4gIC8qKiBRdWV1ZSBiZWhpbmQgcHJldiAvIG5leHQgLyBqdW1wIFx1MjAxNCBzZWUgc3JjL25hdi50cyAoaXNzdWUgIzExMCkgKi9cbiAgcHJpdmF0ZSBuYXYhOiBOYXZTZXNzaW9uO1xuICAvKiogV2hldGhlciB0aGUgbW91c2UgcG9pbnRlciBpcyBoaWRkZW4gZm9yIHByZXNlbnRpbmcgKHNlc3Npb24gc3RhdGUpICovXG4gIHBvaW50ZXJIaWRkZW4gPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmRlY2tTZXJ2aWNlID0gbmV3IERlY2tTZXJ2aWNlKHRoaXMuYXBwKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOYXZTZXNzaW9uKHtcbiAgICAgIHJlc29sdmU6IChwYXRoLCBoZWFkKSA9PiB0aGlzLmRlY2tXaXRoSGVhZChwYXRoLCBoZWFkKSxcbiAgICAgIG9wZW46IGFzeW5jICh0YXJnZXQsIGZyb20pID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNsaWRlc01vZGUpIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZyb20pO1xuICAgICAgfSxcbiAgICAgIGFjdGl2ZVBhdGg6ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbCxcbiAgICB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIodGhpcykpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDEuIFJlZnJlc2ggb24gXCJjdXJyZW50IG5vdGUgLyB2aWV3IGNoYW5nZWRcIiBldmVudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5tYXliZUF1dG9FbnRlclNsaWRlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG4gICAgLy8gUmVmcmVzaCB3aGVuIHRoZSBub3RlIGNvbnRlbnQgKGluY2x1ZGluZyBmcm9udG1hdHRlcikgY2hhbmdlcyAvIHNhdmVzXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMi4gRmFsbGJhY2sgdGltZXI6IGVkaXRcdTIxOTRyZWFkaW5nIHRvZ2dsZXMgbWF5IGZpcmUgbm8gc3RhbmRhcmQgZXZlbnQgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKFxuICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGZpbGUgPyBgJHtmaWxlLnBhdGh9fCR7Y3VycmVudE1vZGUodGhpcy5hcHApfWAgOiBcIlwiO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCksXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzLiBDb21tYW5kcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICByZWdpc3RlckNvbW1hbmRzKHRoaXMpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDNiLiBTbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBvdmVydmlldywgcmVwbGFjZXMgdGhlIG9sZCBvdmVydmlldyBwYWdlKSBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhTTElERVNfUEFORUxfVklFVywgKGxlYWYpID0+IG5ldyBTbGlkZXNQYW5lbFZpZXcodGhpcywgbGVhZikpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInByZXNlbnRhdGlvblwiLCBcIlNob3cgc2xpZGVzIHBhbmVsXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVNsaWRlc1BhbmVsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNC4gUGluIHRoZSBTbGlkZXMgZWRpdG9yIHRvIG9uZSBzY3JlZW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ1NTIGBvdmVyZmxvdzogaGlkZGVuYCBibG9ja3MgdGhlIHdoZWVsLCBidXQgbmF0aXZlIGRyYWctc2VsZWN0XG4gICAgLy8gYXV0b3Njcm9sbCBhbmQgQ29kZU1pcnJvcidzIHByb2dyYW1tYXRpYyBzY3JvbGxJbnRvVmlldyBzdGlsbCBtb3ZlIHRoZVxuICAgIC8vIHNjcm9sbGVyLiBUaGlzIGNhcHR1cmUtcGhhc2UgbGlzdGVuZXIgcmVzZXRzIGFueSBzY3JvbGwgaW5zaWRlIHRoZVxuICAgIC8vIGFjdGl2ZSBtYXJrZG93biB2aWV3IGJhY2sgdG8gdGhlIHRvcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhY3RpdmUuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KFxuICAgICAgZG9jdW1lbnQsXG4gICAgICBcInNjcm9sbFwiLFxuICAgICAgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcbiAgICAgICAgY29uc3QgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB2aWV3LmNvbnRlbnRFbC5jb250YWlucyhlbCkpIHtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxMZWZ0ICE9PSAwKSBlbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHsgY2FwdHVyZTogdHJ1ZSB9LFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNS4gRXNjYXBlIGtleSBleGl0cyBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZG9jdW1lbnQsIFwia2V5ZG93blwiLCAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNsaWRlc01vZGUgJiYgdGhpcy5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykge1xuICAgICAgICB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA2LiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgYW5kIGRvIHRoZSBmaXJzdCByZW5kZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5iYXIgPSBjcmVhdGVCYXIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFyKTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9udW5sb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuYmFyPy5yZW1vdmUoKTtcbiAgICB0aGlzLmJhciA9IG51bGw7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIik7XG4gICAgdGhpcy5yZW1vdmVUaGVtZUNsYXNzZXMoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXR0aW5ncyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGF0YSA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIGFzIFBhcnRpYWw8TmF0aXZlU2xpZGVzU2V0dGluZ3M+IHwgbnVsbDtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgZGF0YSA/PyB7fSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG5vdGUgaXMgYSBkZWNrIG5vdGUgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSkgKi9cbiAgcHJpdmF0ZSBpc0RlY2tOb3RlKGZpbGU6IFRGaWxlIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBldmVyeSBgbmF0aXZlLXNsaWRlcy10aGVtZS0qYCBjbGFzcyBmcm9tIDxib2R5PiAqL1xuICBwcml2YXRlIHJlbW92ZVRoZW1lQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNscyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGNscy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBzaW5nbGUgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmAgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBzbGlkZXNUaGVtZWAgc2V0dGluZyBcdTIwMTQgdGhlIHN0eWxlIHRlbXBsYXRlcyBpbiBzdHlsZXMuY3NzIGhvb2sgb2ZmIGl0LlxuICAgKiBVbmtub3duIGlkcyAoZS5nLiBhZnRlciBhIGRvd25ncmFkZSkgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHRoZW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVRoZW1lQ2xhc3MoKTogdm9pZCB7XG4gICAgY29uc3QgaWQgPSBTTElERVNfVEhFTUVTLnNvbWUoKHQpID0+IHQuaWQgPT09IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWUpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5zbGlkZXNUaGVtZTtcbiAgICBjb25zdCBjbHMgPSBgbmF0aXZlLXNsaWRlcy10aGVtZS0ke2lkfWA7XG4gICAgZm9yIChjb25zdCBjIG9mIEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpKSB7XG4gICAgICBpZiAoYy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikgJiYgYyAhPT0gY2xzKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBoaWRpbmcgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgZm9yIHByZXNlbnRpbmcuIEhpZGluZyBhbHNvXG4gICAqIHBhcmtzIGZvY3VzIChibHVycyB0aGUgZWRpdG9yLCBzbyB0aGUgY2FyZXQgZGlzYXBwZWFycyk7IHNob3dpbmcgbGVhdmVzXG4gICAqIGZvY3VzIHBhcmtlZCBcdTIwMTQgY2xpY2sgc2xpZGUgY29udGVudCB0byByZXN1bWUgZWRpdGluZy5cbiAgICovXG4gIHRvZ2dsZVBvaW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5wb2ludGVySGlkZGVuID0gIXRoaXMucG9pbnRlckhpZGRlbjtcbiAgICBpZiAodGhpcy5wb2ludGVySGlkZGVuKSB7XG4gICAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgYG5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBwcmVzZW50aW5nIHN0YXRlIFx1MjAxNCBzdHlsZXMuY3NzIHR1cm5zIGV2ZXJ5IGN1cnNvciBpbnZpc2libGUgd2hpbGUgc2V0LlxuICAgKiBMZWF2aW5nIFNsaWRlcyBtb2RlIGFsd2F5cyByZXN0b3JlcyB0aGUgcG9pbnRlci5cbiAgICovXG4gIHByaXZhdGUgc3luY1BvaW50ZXJDbGFzcyhzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIsIHNsaWRlcyAmJiB0aGlzLnBvaW50ZXJIaWRkZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc2AgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBpbWFnZUxheW91dGAgc2V0dGluZyBcdTIwMTQgc3R5bGVzLmNzcydzIGltYWdlLWxheW91dCBydWxlcyBob29rIG9mZiBpdC5cbiAgICogVGhlIGNsYXNzIGlzIG9ubHkgbWVhbmluZ2Z1bCBpbiBTbGlkZXMgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgc3luY0ltYWdlTGF5b3V0Q2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgXCJuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc1wiLFxuICAgICAgc2xpZGVzICYmIHRoaXMuc2V0dGluZ3MuaW1hZ2VMYXlvdXQsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNhcmQgdGl0bGUgcGVyIHRoZSBgc2xpZGVzVGl0bGVgIHNldHRpbmcuIFwiZmlsZW5hbWVcIiByZXN0eWxlc1xuICAgKiB0aGUgbmF0aXZlIGlubGluZSB0aXRsZSBpbnRvIHRoZSBjYXJkIHRpdGxlIChzdGlsbCBlZGl0YWJsZSBcdTIwMTQgdHlwaW5nXG4gICAqIHJlbmFtZXMgdGhlIG5vdGUpOyBcIlwiIHNob3dzIG5vdGhpbmc7IGFueSBvdGhlciB2YWx1ZSBuYW1lcyBhIGZyb250bWF0dGVyXG4gICAqIHByb3BlcnR5IHJlbmRlcmVkIHJlYWQtb25seSB2aWEgdGhlIDo6YmVmb3JlIHBzZXVkby1lbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJbmxpbmVUaXRsZShzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBjb250ZW50ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFmaWxlKSByZXR1cm47XG5cbiAgICBjb25zdCBzcmMgPSB0aGlzLnNldHRpbmdzLnNsaWRlc1RpdGxlLnRyaW0oKTtcblxuICAgIC8vIFwiZmlsZW5hbWVcIjogcmVzdHlsZSB0aGUgbmF0aXZlIC5pbmxpbmUtdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZS4gSXRcbiAgICAvLyBzdGF5cyBjb250ZW50ZWRpdGFibGUsIHNvIGVkaXRpbmcgaXQgcmVuYW1lcyB0aGUgbm90ZSBhcyBpbiBMaXZlXG4gICAgLy8gUHJldmlldy4gVGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgbGl2ZXMgb24gdGhlIG1hcmtkb3duLXNvdXJjZS12aWV3XG4gICAgLy8gZWxlbWVudCAoYSBzaWJsaW5nIGJyYW5jaCBvZiB0aGUgY2FyZCksIHNvIHRoZSBzdHlsaW5nIGhvb2sgaXMgYVxuICAgIC8vIHZpZXcgYXR0cmlidXRlICsgYSBicmFuZC1uZXcgLmNtLWNvbnRlbnQgYXR0cmlidXRlIHRoYXQgcmVzZXJ2ZXMgdGhlXG4gICAgLy8gdGl0bGUncyBoZWlnaHQgdGhlIHNhbWUgd2F5IHRoZSBwc2V1ZG8tZWxlbWVudCB2ZXJzaW9uIGRpZC5cbiAgICBjb25zdCBuYXRpdmVUaXRsZSA9IHNsaWRlcyAmJiBzcmMgPT09IFwiZmlsZW5hbWVcIjtcbiAgICBjb25zdCBzb3VyY2VWaWV3ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXNvdXJjZS12aWV3XCIpO1xuICAgIGlmIChuYXRpdmVUaXRsZSAmJiBzb3VyY2VWaWV3KSBzb3VyY2VWaWV3LnNldEF0dHJpYnV0ZShcImRhdGEtbnMtaW5saW5lLXRpdGxlXCIsIFwiZmlsZW5hbWVcIik7XG4gICAgZWxzZSBzb3VyY2VWaWV3Py5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiKTtcbiAgICBjb250ZW50LnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiLCBuYXRpdmVUaXRsZSk7XG5cbiAgICAvLyBQcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIHJlbmRlciByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudFxuICAgIC8vIChubyBlZGl0aW5nIHN1cmZhY2UgXHUyMDE0IHRoZSBwcm9wZXJ0aWVzIHBhbmVsIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSkuXG4gICAgbGV0IHRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGlmIChzbGlkZXMgJiYgc3JjICYmIHNyYyAhPT0gXCJmaWxlbmFtZVwiKSB7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgICAgY29uc3QgdiA9IGZtPy5bc3JjXTtcbiAgICAgIGlmICh2ICE9IG51bGwpIHRleHQgPSBmb3JtYXRWYWx1ZSh2KTtcbiAgICB9XG5cbiAgICBpZiAodGV4dCkgY29udGVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiLCB0ZXh0KTtcbiAgICBlbHNlIGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIik7XG4gIH1cblxuICAvKiogRW50ZXIgU2xpZGVzIG1vZGU6IHJlY29yZCB0aGUgZXhpdCBzdGF0ZSBhbmQgZm9yY2UgdGhlIExpdmUgUHJldmlldyAqL1xuICBwcml2YXRlIGFzeW5jIGVudGVyU2xpZGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IG1vZGU/OiBzdHJpbmc7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgICAgIHRoaXMuZXhpdE1vZGUgPSBzdGF0ZS5tb2RlID09PSBcInByZXZpZXdcIiA/IFwicHJldmlld1wiIDogXCJzb3VyY2VcIjtcbiAgICAgIHRoaXMuZXhpdFNvdXJjZSA9IHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZTtcbiAgICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFsd2F5cyB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgICBjb25zdCBuZXh0ID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgbmV4dC5zdGF0ZSA9IHsgLi4ubmV4dC5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiBmYWxzZSB9O1xuICAgICAgYXdhaXQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShuZXh0LCB7IGZvY3VzOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gdHJ1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAvLyBQaW4gdGhlIHNjcm9sbGVyIHRvIHRoZSB0b3AgYmVmb3JlIGFueSBmcmFtZSByZW5kZXJzOiB0aGUgdmlldy1zdGF0ZVxuICAgIC8vIGNoYW5nZSBhYm92ZSBtYXkgcmVzdG9yZSBpdCB0byB0aGUgc2F2ZWQgY3Vyc29yIGxpbmUgd2l0aG91dCBmaXJpbmcgYVxuICAgIC8vIHNjcm9sbCBldmVudCBhZnRlcndhcmRzLCBzbyB0aGUgY2FwdHVyZS1waGFzZSByZXNldCBiZWxvdyB3b3VsZCBuZXZlclxuICAgIC8vIHJ1biBhbmQgYSBsb25nIG5vdGUgd291bGQgb3BlbiBtaWQtZG9jdW1lbnQuXG4gICAgZm9yIChjb25zdCBlbCBvZiB2aWV3Py5jb250ZW50RWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY20tc2Nyb2xsZXJcIikgPz8gW10pIHtcbiAgICAgIGlmIChlbC5zY3JvbGxUb3AgIT09IDApIGVsLnNjcm9sbFRvcCA9IDA7XG4gICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqIEV4aXQgU2xpZGVzIG1vZGU6IHJlc3RvcmUgdGhlIHZpZXcgbW9kZSByZWNvcmRlZCBhdCBlbnRyeSAqL1xuICBwcml2YXRlIGV4aXRTbGlkZXMoKTogdm9pZCB7XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgaWYgKHRoaXMuZXhpdE1vZGUgPT09IFwicHJldmlld1wiKSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJwcmV2aWV3XCIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiB0aGlzLmV4aXRTb3VyY2UgfTtcbiAgICAgIH1cbiAgICAgIHZvaWQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShzdGF0ZSwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZSBTbGlkZXMgbW9kZSAoZGVjayBub3RlcyBvbmx5IFx1MjAxNCBlbmZvcmNlZCBieSB0aGUgY29tbWFuZCkgKi9cbiAgdG9nZ2xlU2xpZGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHRoaXMuZXhpdFNsaWRlcygpO1xuICAgIGVsc2Ugdm9pZCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQXV0by1lbnRlciBTbGlkZXMgbW9kZSBmb3IgdGhlIGFjdGl2ZSBub3RlIG9uY2UgaXQgaGFzIGJlY29tZSBhIGRlY2tcbiAgICogbm90ZSBcdTIwMTQgdXNlZCBhZnRlciBhIGNvbW1hbmQgcHJvbW90ZXMgYSBwbGFpbiBub3RlIGludG8gYSBkZWNrIChlLmcuXG4gICAqIFwiTWFrZSB0aGlzIG5vdGUgdGhlIGZpcnN0IHNsaWRlXCIpLiBOby1vcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhbHJlYWR5XG4gICAqIGFjdGl2ZSBvciB0aGUgYWN0aXZlIG5vdGUgaXMgbm90ICh5ZXQpIGEgZGVjayBub3RlLlxuICAgKi9cbiAgYXN5bmMgZW50ZXJTbGlkZXNGb3JBY3RpdmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCAhdGhpcy5pc0RlY2tOb3RlKGZpbGUpKSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqIFJldmVhbCB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwsIGNyZWF0aW5nIGl0IGluIHRoZSByaWdodCBzaWRlYmFyIGlmIG5lZWRlZCAqL1xuICBhc3luYyBhY3RpdmF0ZVNsaWRlc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTTElERVNfUEFORUxfVklFVyk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nWzBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikgcmV0dXJuO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogU0xJREVTX1BBTkVMX1ZJRVcsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYSBub3RlJ3MgZGVjaywgcHJlZmVycmluZyB0aGUgY2hhaW4gaGVhZCB0aGUgY3VycmVudCBuYXZpZ2F0aW9uXG4gICAqIHNlc3Npb24gZW50ZXJlZCAod2Fsa2VkIGxpdmUsIHNvIGVkaXRzIHRvIHRoZSBkZWNrIGFyZSBob25vdXJlZCkuIFRoZSBiYXIgYW5kXG4gICAqIHRoZSBzbGlkZXMgcGFuZWwgcmVhZCB0aGlzIHRvbywgc28gdGhlIHBhZ2UgbnVtYmVyIGFsd2F5cyBkZXNjcmliZXMgdGhlIGNoYWluXG4gICAqIG5hdmlnYXRpb24gaXMgYWN0dWFsbHkgdXNpbmcuXG4gICAqL1xuICByZXNvbHZlRGVjayhmaWxlOiBURmlsZSk6IERlY2tJbmZvIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGVja1dpdGhIZWFkKGZpbGUucGF0aCwgdGhpcy5uYXYucmVtZW1iZXJlZEhlYWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlLWJhc2UgdGhlIG5hdmlnYXRpb24gc2Vzc2lvbiBvbiBhIGRlY2sgaGVhZC4gVGhlIHNsaWRlcyBwYW5lbCBjYWxscyB0aGlzXG4gICAqIGFmdGVyIGEgbW92ZTogdGhlIHNlc3Npb24ncyByZW1lbWJlcmVkIGhlYWQgbWF5IG5vdyBzaXQgbWlkLWNoYWluLCBzb1xuICAgKiB0aGUgYmFyLCB0aGUgcGFnZSBudW1iZXIgYW5kIHRoZSBwYW5lbCB3b3VsZCBvdGhlcndpc2UgZGVzY3JpYmUgYVxuICAgKiB0cnVuY2F0ZWQgZGVjay5cbiAgICovXG4gIHJlbWVtYmVyRGVja0hlYWQoaGVhZDogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMubmF2LnNldEhlYWQoaGVhZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVjayBmb3IgYHBhdGhgLCB3YWxrZWQgbGl2ZSBmcm9tIGBoZWFkYCB3aGlsZSB0aGF0IGhlYWQgc3RpbGwgcmVhY2hlcyBpdCBhbmRcbiAgICogcmVzb2x2ZWQgYWZyZXNoIChhcmJpdHJhcnkgaGVhZCkgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHJpdmF0ZSBkZWNrV2l0aEhlYWQocGF0aDogc3RyaW5nLCBoZWFkOiBzdHJpbmcgfCBudWxsKTogRGVja0luZm8gfCBudWxsIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBzZXNzaW9uRGVjayhcbiAgICAgIGhlYWQsXG4gICAgICBwYXRoLFxuICAgICAgKGgsIHApID0+IHtcbiAgICAgICAgY29uc3QgaGVhZEZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoaCk7XG4gICAgICAgIGlmICghKGhlYWRGaWxlIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIGRlY2tGcm9tSGVhZChoLCBwLCAocSkgPT4gdGhpcy5kZWNrU2VydmljZS5uZXh0TGlua3MocSkpO1xuICAgICAgfSxcbiAgICAgICgpID0+IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIE1vdmUgb25lIHN0ZXAgYmFjay9mb3J3YXJkIGFsb25nIHRoZSBkZWNrIGNoYWluIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpICovXG4gIGFzeW5jIG5hdmlnYXRlKGRpcmVjdGlvbjogXCJwcmV2XCIgfCBcIm5leHRcIik6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMubmF2LnB1c2goeyBkaXI6IGRpcmVjdGlvbiB9KTtcbiAgfVxuXG4gIC8qKiBKdW1wIHRvIGEgc3BlY2lmaWMgaW5kZXggaW4gdGhlIGRlY2sgY2hhaW4gKHByb2dyZXNzIGJhciBjbGljaykgKi9cbiAgYXN5bmMganVtcFRvKGluZGV4OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLm5hdi5wdXNoKHsgaW5kZXggfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQmFyIHJlbmRlcmluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKipcbiAgICogR2V0IGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgdGhlIGJhciBwcm9wZXJ0aWVzLiBSZXR1cm5zIGFuIGFycmF5IG9mXG4gICAqIHBlcmNlbnRhZ2VzIChzdW1taW5nIHRvIDEwMCkgZm9yIGVhY2ggcHJvcGVydHkuIExvYWRzIGZyb20gc2V0dGluZ3Mgb3JcbiAgICogZGVmYXVsdHMgdG8gZXF1YWwgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRCYXJQcm9wZXJ0eVdpZHRocyhjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgfHwgXCJbXVwiKSBhcyB1bmtub3duO1xuICAgICAgaWYgKGlzTnVtYmVyTGlzdChzdG9yZWQsIGNvdW50KSkgcmV0dXJuIHN0b3JlZDtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEFycmF5PG51bWJlcj4oY291bnQpLmZpbGwoMTAwIC8gY291bnQpO1xuICB9XG5cbiAgLyoqIFNhdmUgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIHRvIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRoczogbnVtYmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzID0gSlNPTi5zdHJpbmdpZnkod2lkdGhzKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLyoqIERlY2lkZSB3aGF0IHRoZSBzbGlkZXMgYmFyIHNob3dzLCB0aGVuIHJlLXJlbmRlciBpdCAqL1xuICByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXIpIHJldHVybjtcbiAgICB0aGlzLmFwcGx5VGhlbWVDbGFzcygpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKHRoaXMuYXBwKTtcbiAgICBjb25zdCBpc0NhcmQgPSB0aGlzLmlzRGVja05vdGUoZmlsZSk7XG4gICAgY29uc3QgbGl2ZVByZXZpZXdOb3cgPSBtb2RlID09PSBcInNvdXJjZVwiICYmIGlzTGl2ZVByZXZpZXcodGhpcy5hcHApO1xuXG4gICAgLy8gTGVhdmluZyBhIGRlY2sgbm90ZSwgb3IgbGVhdmluZyB0aGUgTGl2ZSBQcmV2aWV3IChlLmcuIENtZC9DdHJsK0UgdG9cbiAgICAvLyByZWFkaW5nIHZpZXcpLCBlbmRzIFNsaWRlcyBtb2RlIFx1MjAxNCBvbmx5IHRoZSB0b2dnbGUgY29tbWFuZCByZS1lbnRlcnMgaXQuXG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSAmJiAoIWlzQ2FyZCB8fCAhbGl2ZVByZXZpZXdOb3cpKSB7XG4gICAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIHRoZSB0YWIgYmFyIHdoaWxlIGl0IGlzIHN0aWxsIHZpc2libGUgKFNsaWRlcyBtb2RlIGhpZGVzIGl0XG4gICAgLy8gYmVsb3c7IHRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGlzIHJldXNlZCBvbmNlIGhpZGRlbikuXG4gICAgdGhpcy50YWJCYXJIZWlnaHQgPSBzeW5jVGFiQmFySGVpZ2h0KHRoaXMudGFiQmFySGVpZ2h0KTtcblxuICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZSBvbmx5IHdoaWxlIGFjdHVhbGx5IGluIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICBjb25zdCBzbGlkZXMgPSB0aGlzLnNsaWRlc01vZGUgJiYgaXNDYXJkICYmIGxpdmVQcmV2aWV3Tm93O1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiLCBzbGlkZXMpO1xuICAgIGlmICghc2xpZGVzKSB0aGlzLnBvaW50ZXJIaWRkZW4gPSBmYWxzZTsgLy8gbGVhdmluZyBTbGlkZXMgcmVzdG9yZXMgdGhlIHBvaW50ZXJcbiAgICB0aGlzLnN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy51cGRhdGVJbmxpbmVUaXRsZShzbGlkZXMpO1xuXG4gICAgY29uc3QgYmFyVmlzaWJsZSA9IHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgJiYgIXRoaXMuc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgIC8vIFdoZW4gYmFyIGlzIGhpZGRlbiwgc2V0IGJvdHRvbSBwYWRkaW5nIHRvIDAgc28gdGhlIGNhcmQgZmlsbHMgdGhlIGZ1bGxcbiAgICAvLyB3aW5kb3cgaGVpZ2h0LiBXaGVuIHZpc2libGUsIHJlbW92ZSB0aGUgb3ZlcnJpZGUgc28gQ1NTIGZhbGxzIGJhY2sgdG9cbiAgICAvLyAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCAoY2xlYXJzIHRoZSBiYXIgYXMgYmVmb3JlKS5cbiAgICBpZiAoYmFyVmlzaWJsZSkge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIjogXCIwcHhcIiB9KTtcbiAgICB9XG4gICAgaWYgKCFiYXJWaXNpYmxlKSB7XG4gICAgICB0aGlzLmJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFmaWxlKSByZXR1cm47IC8vIGJhclZpc2libGUgaW1wbGllcyBhIGZpbGUsIGJ1dCBuYXJyb3cgZm9yIFR5cGVTY3JpcHRcblxuICAgIGNvbnN0IGZtID0gYWN0aXZlRnJvbnRtYXR0ZXIodGhpcy5hcHApO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLnJlc29sdmVEZWNrKGZpbGUpO1xuICAgIGNsZWFyQ2hpbGRyZW4odGhpcy5iYXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExlZnQ6IHByZXZpb3VzIC8gbmV4dCBidXR0b25zIChib3RoIGFsd2F5cyBzaG93biBpbnNpZGUgYSBkZWNrO1xuICAgIC8vICAgICAgICB0aGUgb25lIHRoYXQgY2Fubm90IG1vdmUgaXMgZGlzYWJsZWQgLyBsaWdodCBncmF5KSBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyAmJiBkZWNrKSB7XG4gICAgICBjb25zdCBoYXNQcmV2ID0gZGVjay5pbmRleCA+IDA7XG4gICAgICBjb25zdCBoYXNOZXh0ID0gZGVjay5pbmRleCA8IGRlY2suY2hhaW4ubGVuZ3RoIC0gMTtcbiAgICAgIGNvbnN0IG5hdiA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdlwiIH0pO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVDMFwiLCBcIlByZXZpb3VzIHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwicHJldlwiKSwgIWhhc1ByZXYpKTtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QjZcIiwgXCJOZXh0IHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwibmV4dFwiKSwgIWhhc05leHQpKTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKG5hdik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1pZGRsZTogY29uZmlndXJlZCBwcm9wZXJ0eSBjb2x1bW5zIHdpdGggZHJhZ2dhYmxlIGRpdmlkZXJzIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHByb3BOYW1lcyA9IHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydGllc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHByb3BOYW1lcy5sZW5ndGggPiAwICYmIGZtKSB7XG4gICAgICBjb25zdCBlbnRyaWVzOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwcm9wTmFtZXMpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gZm0pIHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBmbVtuYW1lXTtcbiAgICAgICAgICBpZiAodmFsICE9IG51bGwpIGVudHJpZXMucHVzaChbbmFtZSwgZm9ybWF0VmFsdWUodmFsKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3BlcnRpZXNcIiB9KTtcblxuICAgICAgICBjb25zdCB3aWR0aHMgPSB0aGlzLmdldEJhclByb3BlcnR5V2lkdGhzKGVudHJpZXMubGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBbLCB2YWx1ZV0gPSBlbnRyaWVzW2ldO1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLCB0ZXh0OiB2YWx1ZSB9KTtcbiAgICAgICAgICBpdGVtLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7d2lkdGhzW2ldfSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSA8IGVudHJpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY29uc3QgZGl2aWRlciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1kaXZpZGVyXCIgfSk7XG4gICAgICAgICAgICBkaXZpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICBjb25zdCBpbml0aWFsV2lkdGhzID0gWy4uLndpZHRoc107XG4gICAgICAgICAgICAgIGNvbnN0IG9uTW92ZSA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gKChldi5jbGllbnRYIC0gc3RhcnRYKSAvIGNvbnRhaW5lcldpZHRoKSAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMZWZ0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpXSArIGRlbHRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSaWdodCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaSArIDFdIC0gZGVsdGEpO1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpXSA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2kgKyAxXSA9IG5ld1JpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgXCIubmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld0xlZnR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2kgKyAxXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld1JpZ2h0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgY29uc3Qgb25VcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRDc3NTdHlsZXMoeyBjdXJzb3I6IFwiXCIsIHVzZXJTZWxlY3Q6IFwiXCIgfSk7XG4gICAgICAgICAgICAgICAgdm9pZCB0aGlzLnNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHMpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJjb2wtcmVzaXplXCIsIHVzZXJTZWxlY3Q6IFwibm9uZVwiIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2aWRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCcm9rZW4gZGVjayBsaW5rcyBcdTIxOTIgd2FybmluZyBjaGlwIHNvIGRlY2sgYXV0aG9ycyBzcG90IHR5cG9zXG4gICAgY29uc3QgYnJva2VuID0gZmlsZSA/IHRoaXMuZGVja1NlcnZpY2UuYnJva2VuKGZpbGUpIDogW107XG4gICAgaWYgKGJyb2tlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB3YXJuID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXdhcm5cIixcbiAgICAgICAgdGV4dDogXCJcdTI2QTAgXCIgKyBicm9rZW4uam9pbihcIiwgXCIpLFxuICAgICAgICBhdHRyOiB7IHRpdGxlOiBcIkJyb2tlbiBkZWNrIGxpbmsocykgXHUyMDE0IHRoZSB0YXJnZXQgbm90ZSBkb2VzIG5vdCBleGlzdFwiIH0sXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHdhcm4pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBCb3R0b20tcmlnaHQ6IGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXIgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlICE9PSBcIm5vbmVcIiAmJiBkZWNrKSB7XG4gICAgICAvLyB2MS4wLjAgbmV4dC1vbmx5IHNlbWFudGljczogY2hhaW5bMF0gaXMgdGhlIGhlYWQgc2xpZGUgPSBwYWdlIDE7XG4gICAgICAvLyB0b3RhbCBpcyB0aGUgZnVsbCBjaGFpbiBsZW5ndGguXG4gICAgICBjb25zdCB0b3RhbCA9IGRlY2suY2hhaW4ubGVuZ3RoO1xuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYWdlXCIsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPT09IFwiZnJhY3Rpb25cIlxuICAgICAgICAgICAgPyBgJHtkZWNrLmluZGV4ICsgMX0gLyAke3RvdGFsfWBcbiAgICAgICAgICAgIDogYCR7ZGVjay5pbmRleCArIDF9YCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFByb2dyZXNzIGluZGljYXRvcjogZGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IGJhciB0b3AgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1Byb2dyZXNzICYmIGRlY2sgJiYgZGVjay5jaGFpbi5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXByb2dyZXNzXCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlY2suY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBpIDwgZGVjay5pbmRleCA/IFwicGFzdFwiIDogaSA9PT0gZGVjay5pbmRleCA/IFwiY3VycmVudFwiIDogXCJmdXR1cmVcIjtcbiAgICAgICAgY29uc3Qgc2VnID0gY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IGBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZyBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZy0tJHtzdGF0ZX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB2b2lkIHRoaXMuanVtcFRvKGkpKTtcbiAgICAgICAgcHJvZ3Jlc3MuYXBwZW5kQ2hpbGQoc2VnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHRoZSBzbGlkZXMgYmFyIGVudGlyZWx5IHdoZW4gaXQgaGFzIG5vdGhpbmcgdG8gZGlzcGxheSAobm8gcHJvcGVydGllcyxcbiAgICAvLyBhbmQgbm90IHBhcnQgb2YgYSBkZWNrKVxuICAgIHRoaXMuYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IHRoaXMuYmFyLmNoaWxkRWxlbWVudENvdW50ID09PSAwID8gXCJub25lXCIgOiBcIlwiIH0pO1xuICB9XG59XG5cbi8qKiBXaGV0aGVyIGB2YWx1ZWAgaXMgYW4gYXJyYXkgb2YgZXhhY3RseSBgY291bnRgIG51bWJlcnMgKHN0b3JlZCBiYXIgd2lkdGhzKS4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyTGlzdCh2YWx1ZTogdW5rbm93biwgY291bnQ6IG51bWJlcik6IHZhbHVlIGlzIG51bWJlcltdIHtcbiAgcmV0dXJuIChcbiAgICBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IGNvdW50ICYmIHZhbHVlLmV2ZXJ5KChuKSA9PiB0eXBlb2YgbiA9PT0gXCJudW1iZXJcIilcbiAgKTtcbn1cbiIsICIvKiogQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50IChoaWRkZW4gdW50aWwgcmVmcmVzaCgpIHNob3dzIGl0KSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhcigpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGJhciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhclwiIH0pO1xuICBiYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gIGJhci50aXRsZSA9IFwiQ2xpY2sgdG8gcGFyayB0aGUgbW91c2UgXHUyMDE0IGhpZGVzIHRoZSBlZGl0b3IgY2FyZXQgd2hpbGUgcHJlc2VudGluZ1wiO1xuICAvLyBQcmVzZW50YXRpb24gcGFya2luZzogY2xpY2tpbmcgdGhlIGJhciBrZWVwcyBmb2N1cyBvdXQgb2YgdGhlIGVkaXRvciBzb1xuICAvLyB0aGUgYmxpbmtpbmcgY2FyZXQgZGlzYXBwZWFycy4gcHJldmVudERlZmF1bHQgc3RvcHMgdGhlIGNsaWNrIGZyb20gbW92aW5nXG4gIC8vIGZvY3VzIG9yIHN0YXJ0aW5nIGEgdGV4dCBzZWxlY3Rpb247IGJ1dHRvbnMgc3RpbGwgcmVjZWl2ZSB0aGVpciBjbGljayBldmVudC5cbiAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgYWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSBhY3RpdmUuYmx1cigpO1xuICB9KTtcbiAgcmV0dXJuIGJhcjtcbn1cblxuLyoqIEJ1aWxkIGEgXHUyNUMwIC8gXHUyNUI2IG5hdmlnYXRpb24gYnV0dG9uOyBgZGlzYWJsZWRgIHJlbmRlcnMgaXQgbGlnaHQgZ3JheS9pbmFjdGl2ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hdkJ1dHRvbihcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGlwOiBzdHJpbmcsXG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQsXG4gIGRpc2FibGVkID0gZmFsc2UsXG4pOiBIVE1MQnV0dG9uRWxlbWVudCB7XG4gIGNvbnN0IGJ0biA9IGNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1uYXYtYnRuXCIsXG4gICAgdGV4dDogbGFiZWwsXG4gICAgYXR0cjogeyB0aXRsZTogdGlwIH0sXG4gIH0pO1xuICBidG4uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgaWYgKCFkaXNhYmxlZCkgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSB0b3AgdGFiIGJhciBhbmQgZXhwb3NlIGl0cyBoZWlnaHQgYXMgdGhlIENTUyB2YXJpYWJsZVxuICogLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQsIHJldHVybmluZyB0aGUgKHBvc3NpYmx5IHVwZGF0ZWQpIGNhY2hlZFxuICogdmFsdWUuIFRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSwgc28gdGhlIGxhc3QgbWVhc3VyZWRcbiAqIHZhbHVlIGlzIHJldXNlZCB0aGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bmNUYWJCYXJIZWlnaHQoY2FjaGVkOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICBcIi53b3Jrc3BhY2UtdGFicy5tb2QtdG9wIC53b3Jrc3BhY2UtdGFiLWhlYWRlci1jb250YWluZXJcIixcbiAgKTtcbiAgaWYgKHRhYkJhciAmJiB0YWJCYXIub2Zmc2V0SGVpZ2h0ID4gMCkgY2FjaGVkID0gdGFiQmFyLm9mZnNldEhlaWdodDtcbiAgaWYgKGNhY2hlZCA+IDApIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0XCI6IGAke2NhY2hlZH1weGAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm8gbWVhc3VyZW1lbnQgeWV0ICh0YWIgYmFyIGhpZGRlbiBzaW5jZSBsb2FkKSBcdTIwMTQgbGV0IHRoZSBDU1MgZmFsbGJhY2sgYXBwbHkuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIik7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZDtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjb21wdXRlQ2FwYWNpdHksIGZvcm1hdENhcGFjaXR5LCBwcm9tcHRMb2NhbGUsIHR5cGUgU2xpZGVNZXRyaWNzIH0gZnJvbSBcIi4vY2FwYWNpdHktY29yZVwiO1xuXG4vKipcbiAqIGNhcGFjaXR5LnRzIFx1MjAxNCBvbmUtc2NyZWVuIGNhcGFjaXR5IG1lYXN1cmVtZW50IGZvciB0aGUgYWN0aXZlIFNsaWRlcyBub3RlLlxuICpcbiAqIFRoZSBcIkNvcHkgc2xpZGUgY2FwYWNpdHlcIiBjb21tYW5kIG1lYXN1cmVzIHRoZSBsaXZlIFNsaWRlcyBsYXlvdXQgb2YgdGhlXG4gKiBjdXJyZW50IG5vdGUgKHRoZSBvbmx5IGxheW91dCB0aGF0IG1hdHRlcnM6IGEgbmV3IHNsaWRlIG11c3QgZml0IGludG8gdGhlXG4gKiBzYW1lIHNjcmVlbikgYW5kIGZvcm1hdHMgdGhlIG51bWJlcnMgaW50byBhbiBBSS1yZWFkeSBwcm9tcHQ6XG4gKlxuICogICAtIHRoZSBzY3JlZW4gLyB0ZXh0LWFyZWEgZGltZW5zaW9ucyAoYmFyIGhlaWdodCwgdGl0bGUgcmVzZXJ2ZSwgcGFkZGluZ3NcbiAqICAgICBhcmUgcmVhZCBmcm9tIHRoZSBsaXZlIGNvbXB1dGVkIHN0eWxlcywgc28gXCJvbmUgc2NyZWVuXCIgYWx3YXlzIG1hdGNoZXNcbiAqICAgICBleGFjdGx5IHdoYXQgdGhlIHZpZXdlciBzZWVzKSxcbiAqICAgLSB0aGUgbGluZSBib3ggb2YgZXZlcnkgZWxlbWVudCB0eXBlIFx1MjAxNCBtZWFzdXJlZCBmaXJzdCAodGhlIGN1cnJlbnQgc2xpZGVcbiAqICAgICBpcyBhbHJlYWR5IG9uIHNjcmVlbiksIHRoZW4gZGVyaXZlZCBmcm9tIHRoZSBwaW5uZWQgU2xpZGVzIHR5cG9ncmFwaHlcbiAqICAgICB2YXJpYWJsZXMgKHN0eWxlcy5jc3MgXHUwMEE3OSBzZXRzIC0taDEtc2l6ZS8tLWgxLWxpbmUtaGVpZ2h0Ly0tcC1zcGFjaW5nL1x1MjAyNlxuICogICAgIG9uIHRoZSBzaXplcjsgY29kZSBibG9ja3MgYXJlIDFyZW0vMS41KSB3aGVuIHRoZSBub3RlIGhhcyBubyBpbnN0YW5jZVxuICogICAgIG9mIHRoYXQgdHlwZSxcbiAqICAgLSBjaGFycy1wZXItbGluZSBmb3IgbGF0aW4gYW5kIENKSyB2aWEgY2FudmFzIG1lYXN1cmVUZXh0LlxuICpcbiAqIFRoZSBtYXRoIGFuZCBwcm9tcHQgZm9ybWF0dGluZyBsaXZlIGluIHNyYy9jYXBhY2l0eS1jb3JlLnRzIChwdXJlLCB0ZXN0ZWQpO1xuICogdGhpcyBmaWxlIGlzIHRoZSBET00gZ2x1ZTogbWVhc3VyZW1lbnQgKyBjbGlwYm9hcmQuXG4gKiBUaGUgcHJvbXB0IGlzIGNvcGllZCB0byB0aGUgY2xpcGJvYXJkIChubyBvdGhlciBvdXRwdXQpOyB0aGUgbWVzc2FnZSB0ZXh0XG4gKiBmb2xsb3dzIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZSAoXCJ6aCpcIiBcdTIxOTIgQ2hpbmVzZSwgb3RoZXJ3aXNlIEVuZ2xpc2gpLlxuICovXG5cbmNvbnN0IHB4ID0gKHY6IHN0cmluZyk6IG51bWJlciA9PiBOdW1iZXIucGFyc2VGbG9hdCh2KTtcblxuY29uc3QgU0FNUExFX0xBVElOID1cbiAgXCJUaGUgcXVpY2sgYnJvd24gZm94IGp1bXBzIG92ZXIgdGhlIGxhenkgZG9nIDAxMjM0NTY3ODkgYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbmNvbnN0IFNBTVBMRV9DSksgPSBcIlx1NEUwMFx1NUM0Rlx1NEUwMFx1NTM2MVx1NUU3Qlx1NzA2Rlx1NzI0N1x1NTE4NVx1NUJCOVx1NkQ0Qlx1OTFDRlx1NzkzQVx1NEY4Qlx1RkYwQ1x1NkJDRlx1ODg0Q1x1NTNFRlx1NEVFNVx1NjM5Mlx1NEUwQlx1NTkxQVx1NUMxMVx1NEUyQVx1NUI1N1x1RkYxQVx1NTJBMFx1NTFDRlx1NEU1OFx1OTY2NFx1NzY3RVx1NTIwNlx1NkJENFx1MzAwMlwiO1xuXG4vKiogQXZlcmFnZSBjaGFyIHdpZHRoIChweCkgZm9yIGEgc2FtcGxlIHN0cmluZyBhdCB0aGUgZ2l2ZW4gZm9udCBzZXR0aW5ncyAqL1xuZnVuY3Rpb24gYXZnQ2hhcldpZHRoKGZvbnQ6IHN0cmluZywgc2FtcGxlOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBpZiAoIWN0eCkgcmV0dXJuIDI0O1xuICBjdHguZm9udCA9IGZvbnQ7XG4gIHJldHVybiBjdHgubWVhc3VyZVRleHQoc2FtcGxlKS53aWR0aCAvIHNhbXBsZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGxpbmVCb3goZWw6IEhUTUxFbGVtZW50KTogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB7XG4gIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGNvbnN0IGZzID0gcHgoY3MuZm9udFNpemUpO1xuICBjb25zdCBsaFJhdyA9IGNzLmxpbmVIZWlnaHQ7XG4gIHJldHVybiB7IGZvbnRTaXplOiBmcywgbGluZUhlaWdodDogcHgobGhSYXcpID4gMCA/IHB4KGxoUmF3KSA6IGZzICogMS41IH07XG59XG5cbi8qKlxuICogTWVhc3VyZSB0aGUgYWN0aXZlIFNsaWRlcyB2aWV3LiBSZXR1cm5zIG51bGwgd2hlbiBubyBTbGlkZXMgbGF5b3V0IGlzXG4gKiBhY3RpdmUgKHRoZSBjb21tYW5kIGlzIG9ubHkgcmVhY2hhYmxlIHRoZXJlLCBidXQgdGhlIGd1YXJkIGlzIGNoZWFwKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lYXN1cmVTbGlkZXMoYXBwOiBBcHApOiBTbGlkZU1ldHJpY3MgfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCByb290ID0gdmlldy5jb250ZW50RWw7XG4gIGNvbnN0IHNjcm9sbGVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zY3JvbGxlclwiKTtcbiAgY29uc3QgY29udGVudCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgaWYgKCFzY3JvbGxlciB8fCAhY29udGVudCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY3NTY3JvbGwgPSBnZXRDb21wdXRlZFN0eWxlKHNjcm9sbGVyKTtcbiAgY29uc3QgY3NDb250ZW50ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50KTtcblxuICBjb25zdCBzY3JlZW5IID0gc2Nyb2xsZXIuY2xpZW50SGVpZ2h0O1xuICBjb25zdCB0ZXh0VG9wUGFkID0gcHgoY3NTY3JvbGwucGFkZGluZ1RvcCk7XG4gIGNvbnN0IHRleHRCb3R0b21QYWQgPSBweChjc1Njcm9sbC5wYWRkaW5nQm90dG9tKTtcbiAgY29uc3QgY2FyZFBhZFRvcCA9IHB4KGNzQ29udGVudC5wYWRkaW5nVG9wKTtcbiAgY29uc3QgY2FyZFBhZEJvdHRvbSA9IHB4KGNzQ29udGVudC5wYWRkaW5nQm90dG9tKTtcblxuICBjb25zdCBoYXNUaXRsZSA9XG4gICAgY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKSB8fCBjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiKTtcbiAgLy8gV2l0aCBhIHRpdGxlLCB0aGUgY2FyZCdzIHRvcCBwYWRkaW5nIGdyb3dzIGJ5IHRoZSByZXNlcnZlZCB0aXRsZSBibG9ja1xuICAvLyAocGFkZGluZ1RvcCAtIHBhZGRpbmdCb3R0b20gaXMgdGhlIGRlbHRhOyBib3RoIGFyZSAtLW5zLXBhZC15IG5vcm1hbGx5KS5cbiAgY29uc3QgdGl0bGVSZXNlcnZlZCA9IGhhc1RpdGxlXG4gICAgPyBNYXRoLnJvdW5kKE1hdGgubWF4KDAsIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCkgLyAxMDBcbiAgICA6IDA7XG5cbiAgY29uc3QgdGV4dEhlaWdodCA9XG4gICAgTWF0aC5yb3VuZChcbiAgICAgIE1hdGgubWF4KDAsIHNjcmVlbkggLSB0ZXh0VG9wUGFkIC0gdGV4dEJvdHRvbVBhZCAtIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCxcbiAgICApIC8gMTAwO1xuXG4gIGNvbnN0IHRleHRXaWR0aCA9IGNvbnRlbnQuY2xpZW50V2lkdGggLSBweChjc0NvbnRlbnQucGFkZGluZ0xlZnQpIC0gcHgoY3NDb250ZW50LnBhZGRpbmdSaWdodCk7XG4gIGNvbnN0IHZpZXdwb3J0V2lkdGggPSBzY3JvbGxlci5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSBzY3JlZW5IO1xuXG4gIC8vIFRoZSBzbGlkZXMgYmFyIGlzIGFwcGVuZGVkIHRvIGRvY3VtZW50LmJvZHkgKG5vdCB0aGUgdmlldydzIGNvbnRlbnRFbClcbiAgY29uc3QgYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubmF0aXZlLXNsaWRlcy1iYXJcIik7XG4gIGNvbnN0IGJhclZpc2libGUgPSBiYXIgIT09IG51bGwgJiYgZ2V0Q29tcHV0ZWRTdHlsZShiYXIpLmRpc3BsYXkgIT09IFwibm9uZVwiO1xuICBjb25zdCBiYXJIZWlnaHQgPSBiYXIgJiYgYmFyVmlzaWJsZSA/IGJhci5vZmZzZXRIZWlnaHQgOiAwO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBlbGVtZW50IGxpbmUgYm94ZXM6IG1lYXN1cmUgZmlyc3QgaXRlbSBvZiBlYWNoIHR5cGUgcHJlc2VudCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgaGVhZGVyID0gKGNsczogc3RyaW5nKSA9PiByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGAuY20tY29udGVudCAke2Nsc31gKTtcbiAgY29uc3QgaDFFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMVwiKTtcbiAgY29uc3QgaDJFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMlwiKTtcbiAgY29uc3QgaDNFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItM1wiKTtcbiAgY29uc3QgYnVsbGV0RWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgLkh5cGVyTUQtbGlzdC1saW5lXCIpO1xuICBjb25zdCBjb2RlRWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgcHJlLCAuY20tY29udGVudCAuSHlwZXJNRC1jb2RlYmxvY2tcIik7XG4gIGNvbnN0IGltZ0VsID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50IGltZzpub3QoLmNtLXdpZGdldEJ1ZmZlcilcIik7XG5cbiAgLy8gQSBwbGFpbiBib2R5IGxpbmUgXHUyMDE0IHNraXAgaGVhZGVycywgbGlzdCBsaW5lcywgY29kZSwgcXVvdGVzIGFuZCBlbXB0eVxuICAvLyBsaW5lcyAoQ00gcmVuZGVycyBvbmx5IHZpc2libGUgbGluZXM7IGluIFNsaWRlcyBtb2RlIHRoZSBmaXJzdCBzY3JlZW5cbiAgLy8gaXMgZXhhY3RseSB0aGVtKS4gQW4gZW1wdHkgbGluZSBib3ggKGEgYmxhbmsgcm93LCB+OHB4KSBpcyBub3QgYSB1c2VmdWxcbiAgLy8gYm9keSBzYW1wbGUsIHNvIHBpY2sgdGhlIGZpcnN0IGNhbmRpZGF0ZSB3aXRoIGFjdHVhbCB0ZXh0LlxuICBjb25zdCBib2R5RWwgPVxuICAgIEFycmF5LmZyb20oXG4gICAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICBcIi5jbS1jb250ZW50IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpOm5vdCguSHlwZXJNRC1saXN0LWxpbmUpOm5vdCguSHlwZXJNRC1xdW90ZSk6bm90KC5IeXBlck1ELWNvZGVibG9jaylcIixcbiAgICAgICksXG4gICAgKS5maW5kKChlbCkgPT4gZWwudGV4dENvbnRlbnQgIT09IG51bGwgJiYgZWwudGV4dENvbnRlbnQudHJpbSgpLmxlbmd0aCA+IDApID8/IGNvbnRlbnQ7XG5cbiAgY29uc3QgYm9keSA9IGxpbmVCb3goYm9keUVsKTtcbiAgY29uc3QgaDEgPSBoMUVsID8gbGluZUJveChoMUVsKSA6IG51bGw7XG4gIGNvbnN0IGgyID0gaDJFbCA/IGxpbmVCb3goaDJFbCkgOiBudWxsO1xuICBjb25zdCBoMyA9IGgzRWwgPyBsaW5lQm94KGgzRWwpIDogbnVsbDtcblxuICBjb25zdCBjcyA9IChlbDogSFRNTEVsZW1lbnQpOiBDU1NTdHlsZURlY2xhcmF0aW9uID0+IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICBsZXQgYnVsbGV0OiB7IGl0ZW1IZWlnaHQ6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG4gIGlmIChidWxsZXRFbCkge1xuICAgIGNvbnN0IGMgPSBjcyhidWxsZXRFbCk7XG4gICAgYnVsbGV0ID0ge1xuICAgICAgaXRlbUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSArIHB4KGMucGFkZGluZ1RvcCkgKyBweChjLnBhZGRpbmdCb3R0b20pLFxuICAgIH07XG4gIH1cblxuICBsZXQgY29kZTogeyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGwgPSBudWxsO1xuICBpZiAoY29kZUVsKSB7XG4gICAgY29uc3QgYyA9IGNzKGNvZGVFbCk7XG4gICAgY29kZSA9IHsgbGluZUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSA+IDAgPyBweChjLmxpbmVIZWlnaHQpIDogcHgoYy5mb250U2l6ZSkgKiAxLjUgfTtcbiAgfVxuXG4gIGNvbnN0IGltYWdlSGVpZ2h0ID1cbiAgICBpbWdFbCAmJiBpbWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgPiAwXG4gICAgICA/IE1hdGgucm91bmQoaW1nRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KVxuICAgICAgOiBudWxsO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBkZXJpdmUgbWlzc2luZyBlbGVtZW50IGJveGVzIGZyb20gdGhlIHBpbm5lZCBTbGlkZXMgdHlwb2dyYXBoeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gc3R5bGVzLmNzcyBcdTAwQTc5IGRlY2xhcmVzIHRoZSBzbGlkZSB0eXBvZ3JhcGh5IG9uIHRoZSBzaXplclxuICAvLyAoLS1oMS1zaXplOiAxLjRlbTsgLS1oMS1saW5lLWhlaWdodDogMS40MzsgXHUyMDI2KSBhbmQgXHUwMEE3NyBwaW5zIGNvZGUgYmxvY2tzXG4gIC8vIHRvIDFyZW0vMS41IFx1MjAxNCBhIG5vdGUgd2l0aG91dCB0aGF0IGVsZW1lbnQgdHlwZSBzdGlsbCByZXBvcnRzIGl0cyBib3guXG4gIGNvbnN0IHNpemVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zaXplclwiKTtcbiAgY29uc3Qgc2l6ZXJTdHlsZSA9IHNpemVyID8gY3Moc2l6ZXIpIDogbnVsbDtcbiAgY29uc3QgZGVyaXZlQm94ID0gKHNpemVWYXI6IHN0cmluZywgbGhWYXI6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGVtID0gc2l6ZXJTdHlsZSA/IHB4KHNpemVyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzaXplVmFyKSkgOiBOYU47XG4gICAgY29uc3QgbGggPSBzaXplclN0eWxlID8gcHgoc2l6ZXJTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKGxoVmFyKSkgOiBOYU47XG4gICAgY29uc3QgZm9udFNpemUgPSBlbSA+IDAgPyBlbSAqIGJvZHkuZm9udFNpemUgOiBib2R5LmZvbnRTaXplO1xuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSBsaCA+IDAgPyBsaCAqIGZvbnRTaXplIDogYm9keS5saW5lSGVpZ2h0O1xuICAgIHJldHVybiB7IGZvbnRTaXplLCBsaW5lSGVpZ2h0IH07XG4gIH07XG4gIGNvbnN0IGRlcml2ZUgxID0gZGVyaXZlQm94KFwiLS1oMS1zaXplXCIsIFwiLS1oMS1saW5lLWhlaWdodFwiKTtcbiAgY29uc3QgZGVyaXZlSDIgPSBkZXJpdmVCb3goXCItLWgyLXNpemVcIiwgXCItLWgyLWxpbmUtaGVpZ2h0XCIpO1xuICBjb25zdCBkZXJpdmVIMyA9IGRlcml2ZUJveChcIi0taDMtc2l6ZVwiLCBcIi0taDMtbGluZS1oZWlnaHRcIik7XG4gIGNvbnN0IGRlcml2ZUNvZGUgPSAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdEZvbnQgPSBweChnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUpO1xuICAgIHJldHVybiB7IGxpbmVIZWlnaHQ6IHJvb3RGb250ICogMS41IH07XG4gIH07XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGNoYXIgd2lkdGhzIGF0IHRoZSBib2R5IGZvbnQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IGZvbnRGYW1pbHkgPSBjcyhjb250ZW50KS5mb250RmFtaWx5O1xuICBjb25zdCBmb250ID0gYDQwMCAke2JvZHkuZm9udFNpemV9cHggJHtmb250RmFtaWx5fWA7XG4gIGNvbnN0IGNoYXIgPSB7XG4gICAgbGF0aW46IGF2Z0NoYXJXaWR0aChmb250LCBTQU1QTEVfTEFUSU4pLFxuICAgIGNqazogYXZnQ2hhcldpZHRoKGZvbnQsIFNBTVBMRV9DSkspLFxuICB9O1xuXG4gIC8vIE1lYXN1cmVkIHdpbnM7IGRlcml2YXRpb24gZmlsbHMgdGhlIGdhcHMgZm9yIGFic2VudCB0eXBlcy5cbiAgcmV0dXJuIHtcbiAgICB2aWV3cG9ydDogeyB3aWR0aDogdmlld3BvcnRXaWR0aCwgaGVpZ2h0OiB2aWV3cG9ydEhlaWdodCB9LFxuICAgIHRleHQ6IHsgd2lkdGg6IHRleHRXaWR0aCwgaGVpZ2h0OiB0ZXh0SGVpZ2h0IH0sXG4gICAgYmFyOiB7XG4gICAgICB2aXNpYmxlOiBiYXJWaXNpYmxlLFxuICAgICAgaGVpZ2h0OiBiYXJIZWlnaHQsXG4gICAgfSxcbiAgICB0aXRsZVJlc2VydmVkOiBNYXRoLnJvdW5kKHRpdGxlUmVzZXJ2ZWQgKiAxMDApIC8gMTAwLFxuICAgIGJvZHksXG4gICAgaDE6IGgxID8/IGRlcml2ZUgxLFxuICAgIGgyOiBoMiA/PyBkZXJpdmVIMixcbiAgICBoMzogaDMgPz8gZGVyaXZlSDMsXG4gICAgYnVsbGV0LFxuICAgIGNvZGU6IGNvZGUgPz8gZGVyaXZlQ29kZSgpLFxuICAgIGltYWdlSGVpZ2h0LFxuICAgIGNoYXIsXG4gIH07XG59XG5cbi8qKlxuICogRW50cnkgcG9pbnQgb2YgdGhlIFwiQ29weSBzbGlkZSBjYXBhY2l0eVwiIGNvbW1hbmQ6IG1lYXN1cmUsIGZvcm1hdCxcbiAqIHdyaXRlIHRvIHRoZSBjbGlwYm9hcmQuIFJ1bnMgb25seSBmcm9tIFNsaWRlcyBtb2RlIChjb21tYW5kIGdhdGUpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29weUNhcGFjaXR5UHJvbXB0KGFwcDogQXBwKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG0gPSBtZWFzdXJlU2xpZGVzKGFwcCk7XG4gIGlmICghbSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgbWVhc3VyZSB0aGUgU2xpZGVzIGxheW91dFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcHJvbXB0ID0gZm9ybWF0Q2FwYWNpdHkobSwgY29tcHV0ZUNhcGFjaXR5KG0pLCBwcm9tcHRMb2NhbGUoKSk7XG4gIHRyeSB7XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocHJvbXB0KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjbGlwYm9hcmQgd3JpdGUgZmFpbGVkICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG4iLCAiLyoqXG4gKiBjYXBhY2l0eS1jb3JlLnRzIFx1MjAxNCBwdXJlIGNhcGFjaXR5IG1hdGggKyBwcm9tcHQgZm9ybWF0dGluZyBmb3IgU2xpZGVzLlxuICpcbiAqIFRoaXMgbW9kdWxlIGlzIERPTS1mcmVlIGFuZCB1bml0LXRlc3RlZCAobGlrZSBzcmMvZGVjay50cykuIEl0IHR1cm5zXG4gKiBtZWFzdXJlZCBudW1iZXJzIChmcm9tIHNyYy9jYXBhY2l0eS50cykgaW50byBhIG9uZS1zY3JlZW4gY2FwYWNpdHlcbiAqIHJlcG9ydDogaG93IG1hbnkgYm9keSBsaW5lcyAvIGJ1bGxldHMgLyBIMSBsaW5lcyBmaXQgdGhlIGFjdGl2ZSB0ZXh0XG4gKiBhcmVhLCB3aXRoIHBlci1lbGVtZW50IGxpbmUgYm94ZXMsIGFuZCBmb3JtYXRzIHRoZW0gaW50byBhbiBBSS1yZWFkeVxuICogcHJvbXB0IGluIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZS5cbiAqL1xuXG4vKiogUmF3IGxpdmUtbGF5b3V0IG1lYXN1cmVtZW50cyBvZiB0aGUgYWN0aXZlIFNsaWRlcyBub3RlICovXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlTWV0cmljcyB7XG4gIC8qKiBTY3JlZW4gKHZpZXdwb3J0KSBzaXplIGluIENTUyBweCAqL1xuICB2aWV3cG9ydDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICAvKiogQXZhaWxhYmxlIHRleHQgYXJlYSAoc2NyZWVuIG1pbnVzIHNjcm9sbGVyIHBhZGRpbmdzLCBjYXJkIHBhZGRpbmcsIHRpdGxlKSAqL1xuICB0ZXh0OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBTbGlkZXMgYmFyIHN0YXRlIFx1MjAxNCBpdHMgaGVpZ2h0IGlzIG9uIHRoZSBwYWdlOyB0aGUgbnVtYmVyIGlzIGluZm9ybWF0aW9uYWwgKi9cbiAgYmFyOiB7IHZpc2libGU6IGJvb2xlYW47IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBWZXJ0aWNhbCBzcGFjZSByZXNlcnZlZCBmb3IgdGhlIGNhcmQgdGl0bGUgKDAgPSBubyB0aXRsZSkgKi9cbiAgdGl0bGVSZXNlcnZlZDogbnVtYmVyO1xuICAvKiogQm9keSBwYXJhZ3JhcGggbWV0cmljcyAoZm9udCBzaXplIC8gbGluZSBib3gsIHB4KSAqL1xuICBib2R5OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9O1xuICAvKiogSGVhZGluZyBsaW5lIGJveGVzIChweCkgXHUyMDE0IG51bGwgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSBvZiB0aGlzIGxldmVsICovXG4gIGgxOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgaDI6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICBoMzogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgYnVsbGV0IGl0ZW0ncyB0b3RhbCBoZWlnaHQgKGxpbmUgYm94ICsgbGlzdCBwYWRkaW5ncywgcHgpICovXG4gIGJ1bGxldDogeyBpdGVtSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgY29kZSBsaW5lJ3MgYm94IChmb250IDFyZW0gaW4gU2xpZGVzOyBtZWFzdXJlZCB3aGVuIGEgYmxvY2sgZXhpc3RzKSAqL1xuICBjb2RlOiB7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIEhlaWdodCBvZiB0aGUgZmlyc3QgcmVuZGVyZWQgaW1hZ2UgKHB4KTsgbnVsbCB3aGVuIHRoZSBub3RlIGhhcyBub25lICovXG4gIGltYWdlSGVpZ2h0OiBudW1iZXIgfCBudWxsO1xuICAvKiogQXZlcmFnZSBjaGFyYWN0ZXIgd2lkdGhzIChweCkgYXQgdGhlIGJvZHkgZm9udCAqL1xuICBjaGFyOiB7IGxhdGluOiBudW1iZXI7IGNqazogbnVtYmVyIH07XG59XG5cbi8qKiBEZXJpdmVkIGNhcGFjaXR5IGNvdW50cyAocHVyZTsgdGFrZXMgbnVtYmVycywgbm90IHRoZSBET00pICovXG5leHBvcnQgaW50ZXJmYWNlIENhcGFjaXR5UmVzdWx0IHtcbiAgLyoqIEJvZHkgdGV4dCBsaW5lcyB0aGF0IGZpdCBvbmUgc2NyZWVuICovXG4gIGJvZHlMaW5lczogbnVtYmVyO1xuICAvKiogQnVsbGV0IGl0ZW1zIHRoYXQgZml0IG9uZSBzY3JlZW4gKGZ1bGwgbGlzdCkgKi9cbiAgYnVsbGV0czogbnVtYmVyO1xuICAvKiogSDEgbGluZXMgdGhhdCBmaXQgKG9uZSBwZXIgSDEgbGluZSBib3gpICovXG4gIGgxTGluZXM6IG51bWJlcjtcbiAgLyoqIEV4YW1wbGVzOiBjb3VudCBvZiBhIHNlY29uZCBibG9jayB0eXBlIGFmdGVyIG9uZSBmaXJzdCBibG9jayAqL1xuICBjb21ib3M6IHtcbiAgICBhZnRlckgxQnVsbGV0czogbnVtYmVyO1xuICAgIGFmdGVySDJCdWxsZXRzOiBudW1iZXI7XG4gICAgYWZ0ZXJIMUJvZHlMaW5lczogbnVtYmVyO1xuICB9O1xufVxuXG4vKipcbiAqIERlcml2ZWQgY2FwYWNpdHkgZnJvbSByYXcgbWV0cmljcyBcdTIwMTQgcHVyZSBhbmQgZGV0ZXJtaW5pc3RpYy5cbiAqIEV2ZXJ5IG51bWJlciBmbG9vcnMgKGJsb2NrcyBhcmUgZGlzY3JldGUpOyBhIG5lZ2F0aXZlIHJlc3VsdCBpcyBjbGFtcGVkIHRvIDAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlQ2FwYWNpdHkobTogU2xpZGVNZXRyaWNzKTogQ2FwYWNpdHlSZXN1bHQge1xuICBjb25zdCBIID0gbS50ZXh0LmhlaWdodDtcbiAgY29uc3QgZmxvb3IgPSAobjogbnVtYmVyKTogbnVtYmVyID0+IE1hdGgubWF4KDAsIE1hdGguZmxvb3IobikpO1xuICBjb25zdCBib2R5TGluZXMgPSBmbG9vcihIIC8gbS5ib2R5LmxpbmVIZWlnaHQpO1xuXG4gIGNvbnN0IGJ1bGxldEggPSBtLmJ1bGxldD8uaXRlbUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYnVsbGV0cyA9IGZsb29yKEggLyBidWxsZXRIKTtcblxuICBjb25zdCBoMUggPSBtLmgxPy5saW5lSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBoMUxpbmVzID0gZmxvb3IoSCAvIGgxSCk7XG5cbiAgY29uc3QgaDJIID0gbS5oMj8ubGluZUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYWZ0ZXJTcGFuID0gKGZpcnN0SDogbnVtYmVyLCBpdGVtSDogbnVtYmVyKTogbnVtYmVyID0+IGZsb29yKChIIC0gZmlyc3RIKSAvIGl0ZW1IKTtcblxuICByZXR1cm4ge1xuICAgIGJvZHlMaW5lcyxcbiAgICBidWxsZXRzLFxuICAgIGgxTGluZXMsXG4gICAgY29tYm9zOiB7XG4gICAgICBhZnRlckgxQnVsbGV0czogYWZ0ZXJTcGFuKGgxSCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgyQnVsbGV0czogYWZ0ZXJTcGFuKGgySCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgxQm9keUxpbmVzOiBhZnRlclNwYW4oaDFILCBtLmJvZHkubGluZUhlaWdodCksXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIExvY2FsZSBvZiB0aGUgZ2VuZXJhdGVkIHByb21wdDogXCJ6aFwiIGZvciBDaGluZXNlLCBvdGhlcndpc2UgRW5nbGlzaCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb21wdExvY2FsZSgpOiBcInpoXCIgfCBcImVuXCIge1xuICBjb25zdCBsYW5nID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgID8gKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpID8/IG5hdmlnYXRvci5sYW5ndWFnZSA/PyBcImVuXCIpXG4gICAgICA6IFwiZW5cIjtcbiAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiemhcIikgPyBcInpoXCIgOiBcImVuXCI7XG59XG5cbmZ1bmN0aW9uIGZtdChuOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihuKSA/IFN0cmluZyhuKSA6IG4udG9GaXhlZCgxKTtcbn1cblxuLyoqIEh1bWFuLXJlYWRhYmxlIGxpc3Qgb2YgdGhlIG1lYXN1cmVkIGVsZW1lbnQgbGluZSBib3hlcyAqL1xuZnVuY3Rpb24gYm94U3RyKGtpbmQ6IHN0cmluZywgYm94OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbCk6IHN0cmluZyB7XG4gIGlmICghYm94KSByZXR1cm4gYCR7a2luZH06IC1gO1xuICByZXR1cm4gYCR7a2luZH06ICR7Zm10KGJveC5saW5lSGVpZ2h0KX1weC9saW5lIChmb250ICR7Zm10KGJveC5mb250U2l6ZSl9cHgpYDtcbn1cblxuLyoqIEhvdyBOYXRpdmUgU2xpZGVzIHdvcmtzIFx1MjAxNCB0aGUgY29udGV4dCBhbiBhZ2VudCBuZWVkcyBiZWZvcmUgZ2VuZXJhdGluZyAqL1xuZnVuY3Rpb24gZW5Db250ZXh0KCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtcbiAgICBgVGhpcyBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIHVzZWQgYnkgdGhlIE9ic2lkaWFuIHBsdWdpbiBcIk5hdGl2ZSBTbGlkZXNcIi4gVGhlIHBsdWdpbiB0dXJucyBtYXJrZG93biBub3RlcyBpbnRvIHNsaWRlczogYSBkZWNrIGlzIGFuIG9yZGVyZWQgY2hhaW4gb2Ygbm90ZXMsIGVhY2ggbm90ZSBpcyBPTkUgc2xpZGUgc2hvd24gYXMgYW4gaW1tZXJzaXZlLCBvbmUgc2NyZWVuID0gb25lIGNhcmQgdmlldyAoZWFjaCBzbGlkZSBhbHdheXMgc3RhcnRzIGF0IHRoZSB0b3Agb2YgaXRzIG5vdGUpLmAsXG4gICAgYGAsXG4gICAgYEhvdyB0byBidWlsZCBhIHNsaWRlcyBkZWNrOmAsXG4gICAgYC0gQSBzbGlkZSBpcyBhbiBvcmRpbmFyeSBtYXJrZG93biBub3RlIGluIHRoZSB2YXVsdDsgdGhlIG9ubHkgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgaXMgZGVjayBcdTIwMTQgb25lIGxpbmsgdG8gdGhlIE5FWFQgc2xpZGUgKGUuZy4gZGVjazogW1wiW1tzbGlkZS0yXV1cIl0sIG9yIGRlY2s6IFtdIGZvciB0aGUgbGFzdCBzbGlkZSkuIFRoZSBjaGFpbiBvcmRlciBpcyB0aGUgcHJlc2VudGF0aW9uIG9yZGVyOyBwYWdlIG51bWJlcnMgYXJlIGF1dG8tY29tcHV0ZWQuYCxcbiAgICBgLSBDcmVhdGUgYSBuZXcgZGVjayB3aXRoIHRoZSBjb21tYW5kIFwiQ3JlYXRlIG5ldyBzbGlkZVwiIChmcmVzaCBub3RlLCBkZWNrOiBbXSkuIEFkZCBwYWdlcyB3aXRoIFwiQ3JlYXRlIG5leHQgc2xpZGVcIiBcdTIwMTQgaXQgd2lyZXMgdGhlIGRlY2sgbGlua3MgYXV0b21hdGljYWxseSAodGhlIGN1cnJlbnQgbm90ZSdzIGRlY2sgbGluayBpcyBwb2ludGVkIGF0IHRoZSBuZXcgbm90ZSwgdGhlIG5ldyBub3RlIGdldHMgdGhlIG9sZCB0YXJnZXQpLmAsXG4gICAgYC0gQ29udGVudCBpcyB3cml0dGVuIGluIHBsYWluIG1hcmtkb3duIGFuZCByZW5kZXJlZCBvbiB0aGUgY2FyZCBpbiB0aGUgbm90ZSdzIGxhbmd1YWdlIHdoZW4gcG9zc2libGUuIEtlZXAgZXZlcnkgc2xpZGUgd2l0aGluIG9uZSBzY3JlZW4gXHUyMDE0IHRoZSBjYXBhY2l0eSBudW1iZXJzIGJlbG93IGFyZSB0aGUgZml0IGJ1ZGdldCAodGhleSBhbHJlYWR5IHN1YnRyYWN0IHRoZSBzbGlkZXMgYmFyIGFuZCB0aGUgY2FyZCB0aXRsZSkuYCxcbiAgICBgLSBUaGUgdXNlcidzIHJlcXVlc3QgY29tZXMgZmlyc3Q6IGZvbGxvdyB3aGF0IHRoZSB1c2VyIGFza2VkIGZvciAoXCJmb3IgbWF0ZXJpYWwgWCBtYWtlIGEgc2xpZGVzIGRlY2tcIiksIHVzaW5nIHRoZSBwbHVnaW4ncyBjb252ZW50aW9ucyBhYm92ZSBhcyB0aGUgZm9ybSwgbm90IGFzIHRoZSBjb250ZW50LmAsXG4gIF07XG59XG5cbmZ1bmN0aW9uIHpoQ29udGV4dCgpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXG4gICAgYFx1NjcyQ1x1N0IxNFx1OEJCMFx1NUM1RVx1NEU4RSBPYnNpZGlhbiBcdTYzRDJcdTRFRjYgXCJOYXRpdmUgU2xpZGVzXCIgXHU3Njg0IGRlY2sgXHU3QjE0XHU4QkIwXHUzMDAyXHU4QkU1XHU2M0QyXHU0RUY2XHU2MjhBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1NTNEOFx1NjIxMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYxQVx1NEUwMFx1NEUyQSBkZWNrIFx1NUMzMVx1NjYyRlx1NEUwMFx1N0VDNFx1NjcwOVx1NUU4Rlx1OTRGRVx1NjNBNVx1NzY4NFx1N0IxNFx1OEJCMFx1RkYwQ1x1NkJDRlx1N0JDN1x1N0IxNFx1OEJCMFx1NUMzMVx1NjYyRlx1NEUwMFx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYwQ1x1NEVFNVwiXHU0RTAwXHU1QzRGXHU0RTAwXHU1MzYxXCJcdTc2ODRcdTZDODlcdTZENzhcdTVGMEZcdTUzNjFcdTcyNDdcdTg5QzZcdTU2RkVcdTVDNTVcdTc5M0FcdUZGMDhcdTZCQ0ZcdTVGMjBcdTVFN0JcdTcwNkZcdTcyNDdcdTkwRkRcdTRFQ0VcdTdCMTRcdThCQjBcdTVGMDBcdTU5MzRcdTVGMDBcdTU5Q0JcdUZGMDlcdTMwMDJgLFxuICAgIGBgLFxuICAgIGBcdTU5ODJcdTRGNTVcdTY3ODRcdTVFRkFcdTVFN0JcdTcwNkZcdTcyNDcgZGVja1x1RkYxQWAsXG4gICAgYC0gXHU1RTdCXHU3MDZGXHU3MjQ3XHU1QzMxXHU2NjJGXHU1RTkzXHU5MUNDXHU3Njg0XHU2NjZFXHU5MDFBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1RkYxQlx1NTUyRlx1NEUwMFx1NEZERFx1NzU1OVx1NzY4NCBmcm9udG1hdHRlciBcdTVDNUVcdTYwMjdcdTY2MkYgZGVja1x1MjAxNFx1MjAxNFx1NjMwN1x1NTQxMVx1NEUwQlx1NEUwMFx1NUYyMFx1NzY4NFx1OTRGRVx1NjNBNVx1RkYwOFx1NTk4MiBkZWNrOiBbXCJbW3NsaWRlLTJdXVwiXVx1RkYwQ1x1NjcwMFx1NTQwRVx1NEUwMFx1NUYyMFx1NTE5OSBkZWNrOiBbXVx1RkYwOVx1MzAwMlx1OTRGRVx1NzY4NFx1OTg3QVx1NUU4Rlx1NTM3M1x1NjUzRVx1NjYyMFx1OTg3QVx1NUU4Rlx1RkYwQ1x1OTg3NVx1NTNGN1x1ODFFQVx1NTJBOFx1OEJBMVx1N0I5N1x1MzAwMmAsXG4gICAgYC0gXHU3NTI4XHU1NDdEXHU0RUU0IFwiQ3JlYXRlIG5ldyBzbGlkZVwiIFx1NjVCMFx1NUVGQVx1NEUwMFx1NTk1NyBkZWNrXHVGRjA4XHU2NUIwXHU1RUZBXHU3QjE0XHU4QkIwXHVGRjBDZGVjazogW11cdUZGMDlcdUZGMUJcdTc1MjggXCJDcmVhdGUgbmV4dCBzbGlkZVwiIFx1N0VFN1x1N0VFRFx1NTJBMFx1OTg3NVx1MjAxNFx1MjAxNFx1NUI4M1x1NEYxQVx1ODFFQVx1NTJBOFx1NjNBNVx1OTAxQVx1OTRGRVx1RkYwOFx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NCBkZWNrIFx1OTRGRVx1NjNBNVx1NjMwN1x1NTQxMVx1NjVCMFx1OTg3NVx1RkYwQ1x1NjVCMFx1OTg3NVx1N0VFN1x1NjI3Rlx1NTM5Rlx1Njc2NVx1NzY4NFx1NEUwQlx1NEUwMFx1NUYyMFx1RkYwOVx1MzAwMmAsXG4gICAgYC0gXHU1MTg1XHU1QkI5XHU3NTI4XHU3RUFGIG1hcmtkb3duIFx1N0YxNlx1NTE5OVx1RkYwQ1x1NTcyOFx1NTM2MVx1NzI0N1x1NEUwQVx1NkUzMlx1NjdEM1x1RkYxQlx1NUMzRFx1OTFDRlx1NEY3Rlx1NzUyOFx1NzUyOFx1NjIzN1x1NUY1M1x1NTI0RFx1NzY4NFx1OEJFRFx1OEEwMFx1NjNBQVx1OEY5RVx1MzAwMlx1NkJDRlx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1NUZDNVx1OTg3Qlx1NjUzRVx1NTE2NVx1NEUwMFx1NUM0Rlx1MjAxNFx1MjAxNFx1NEUwQlx1OTc2Mlx1NzY4NFx1NUJCOVx1OTFDRlx1NjU3MFx1NUI1N1x1NUMzMVx1NjYyRlx1NTNFRlx1NzUyOFx1OTg4NFx1N0I5N1x1RkYwOFx1NURGMlx1N0VDRlx1NjI2M1x1NjM4OSBzbGlkZXMgXHU2ODBGXHU0RTBFXHU1MzYxXHU3MjQ3XHU2ODA3XHU5ODk4XHVGRjA5XHUzMDAyYCxcbiAgICBgLSBcdTRFRTVcdTc1MjhcdTYyMzdcdTc2ODRcdTVCOUVcdTk2NDVcdTk3MDBcdTZDNDJcdTRFM0FcdTUxNDhcdUZGMUFcdTc1MjhcdTYyMzdcdTg5ODFcdTRFQzBcdTRFNDhcdUZGMDhcdTU5ODJcIlx1NTdGQVx1NEU4RVx1NjdEMFx1Njc1MFx1NjU5OVx1NTIzNlx1NEY1QyBzbGlkZXMgXHU3QjE0XHU4QkIwXCJcdUZGMDlcdTVDMzFcdTUwNUFcdTRFQzBcdTRFNDhcdUZGMENcdTYzRDJcdTRFRjZcdTc2ODRcdTdFQTZcdTVCOUFcdTUzRUFcdTY2MkZcdTVGNjJcdTVGMEZcdUZGMENcdTRFMERcdTY2MkZcdTUxODVcdTVCQjlcdTMwMDJgLFxuICBdO1xufVxuXG5mdW5jdGlvbiBlblByb21wdChtOiBTbGlkZU1ldHJpY3MsIGM6IENhcGFjaXR5UmVzdWx0LCBub3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiYXIgPVxuICAgIG0uYmFyLnZpc2libGUgfHwgbS5iYXIuaGVpZ2h0ID4gMFxuICAgICAgPyBgU2xpZGVzIGJhcjogdmlzaWJsZSwgJHttLmJhci5oZWlnaHR9cHggKGFscmVhZHkgZXhjbHVkZWQgZnJvbSB0aGUgdGV4dCBhcmVhKS5gXG4gICAgICA6IFwiU2xpZGVzIGJhcjogaGlkZGVuLlwiO1xuICBjb25zdCB0aXRsZSA9XG4gICAgbS50aXRsZVJlc2VydmVkID4gMCA/IGBDYXJkIHRpdGxlOiAke20udGl0bGVSZXNlcnZlZH1weCByZXNlcnZlZC5gIDogXCJDYXJkIHRpdGxlOiBub25lLlwiO1xuICBjb25zdCBpbWcgPVxuICAgIG0uaW1hZ2VIZWlnaHQgIT09IG51bGwgPyBgSW1hZ2U6ICR7bS5pbWFnZUhlaWdodH1weCB0YWxsIChmaXJzdCBpbWFnZSBvbiB0aGUgc2xpZGUpLmAgOiBcIlwiO1xuICBjb25zdCBzYW1wbGVzID0gW1xuICAgIGBQbGFpbiB0ZXh0OiAke2MuYm9keUxpbmVzfSBib2R5IGxpbmVzYCxcbiAgICBgSDEgKyBidWxsZXRzOiAke2MuY29tYm9zLmFmdGVySDFCdWxsZXRzfSBidWxsZXRzIGFmdGVyIGEgSDEgbGluZWAsXG4gICAgYFB1cmUgbGlzdDogJHtjLmJ1bGxldHN9IGJ1bGxldCBpdGVtc2AsXG4gICAgYEgxIGxpbmVzIG9ubHk6ICR7Yy5oMUxpbmVzfWAsXG4gIF0uam9pbihcIjsgXCIpO1xuICByZXR1cm4gW1xuICAgIGBTbGlkZSBjYXBhY2l0eSBcdTIwMTQgb25lIHNjcmVlbiwgbm8gc2Nyb2xsaW5nLiBHZW5lcmF0ZWQgZnJvbSB0aGUgbGl2ZSBTbGlkZXMgbGF5b3V0IG9mIHRoaXMgbm90ZTsgZXZlcnkgbnVtYmVyIGlzIG1lYXN1cmVkL2JyYW5jaC1kZXJpdmVkIGF0IHRoZSBjdXJyZW50IFVJIHNjYWxlLmAsXG4gICAgYGAsXG4gICAgLi4uZW5Db250ZXh0KCksXG4gICAgYGAsXG4gICAgYEdlb21ldHJ5OiBzY3JlZW4gJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHg7IHRleHQgYXJlYSAke20udGV4dC53aWR0aH1cdTAwRDcke20udGV4dC5oZWlnaHR9cHguICR7YmFyfSAke3RpdGxlfWAsXG4gICAgYGAsXG4gICAgYFRleHQgbWV0cmljcyAoYm9keSBmb250ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHgpOmAsXG4gICAgYGNoYXJzL2xpbmUgXHUyMjQ4ICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIubGF0aW4pfSBsYXRpbiAvICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIuY2prKX0gQ0pLOyBib2R5IGxpbmUgJHtmbXQobS5ib2R5LmxpbmVIZWlnaHQpfXB4LmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJidWxsZXRcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiY29kZVwiLCBtLmNvZGUgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uY29kZS5saW5lSGVpZ2h0IH0gOiBudWxsKSxcbiAgXVxuICAgIC5jb25jYXQoaW1nID8gW2ltZ10gOiBbXSlcbiAgICAuY29uY2F0KFtgYCwgYENhcGFjaXR5OiAke3NhbXBsZXN9LmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gemhQcm9tcHQobTogU2xpZGVNZXRyaWNzLCBjOiBDYXBhY2l0eVJlc3VsdCwgbm90ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYmFyID1cbiAgICBtLmJhci52aXNpYmxlIHx8IG0uYmFyLmhlaWdodCA+IDBcbiAgICAgID8gYFNsaWRlcyBcdTY4MEZcdUZGMUFcdTY2M0VcdTc5M0FcdUZGMEMke20uYmFyLmhlaWdodH1weFx1RkYwOFx1NURGMlx1NEVDRVx1NjU4N1x1NUI1N1x1NTMzQVx1NjI2M1x1NTFDRlx1RkYwOVx1MzAwMmBcbiAgICAgIDogXCJTbGlkZXMgXHU2ODBGXHVGRjFBXHU5NjkwXHU4NUNGXHUzMDAyXCI7XG4gIGNvbnN0IHRpdGxlID0gbS50aXRsZVJlc2VydmVkID4gMCA/IGBcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTk4ODRcdTc1NTkgJHttLnRpdGxlUmVzZXJ2ZWR9cHhcdTMwMDJgIDogXCJcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTY1RTBcdTMwMDJcIjtcbiAgY29uc3QgaW1nID0gbS5pbWFnZUhlaWdodCAhPT0gbnVsbCA/IGBcdTU2RkVcdTcyNDdcdUZGMUEke20uaW1hZ2VIZWlnaHR9cHggXHU5QUQ4XHVGRjA4XHU1RjUzXHU1MjREXHU5ODc1XHU3QjJDXHU0RTAwXHU1RjIwXHVGRjA5XHUzMDAyYCA6IFwiXCI7XG4gIGNvbnN0IHNhbXBsZXMgPSBbXG4gICAgYFx1N0VBRlx1NkI2M1x1NjU4N1x1RkYxQSR7Yy5ib2R5TGluZXN9IFx1ODg0Q2AsXG4gICAgYEgxICsgXHU1MjE3XHU4ODY4XHVGRjFBSDEgXHU1NDBFXHU4RkQ4XHU1M0VGXHU2NTNFICR7Yy5jb21ib3MuYWZ0ZXJIMUJ1bGxldHN9IFx1NEUyQVx1NTIxN1x1ODg2OFx1OTg3OWAsXG4gICAgYFx1N0VBRlx1NTIxN1x1ODg2OFx1RkYxQSR7Yy5idWxsZXRzfSBcdTRFMkFcdTUyMTdcdTg4NjhcdTk4NzlgLFxuICAgIGBcdTdFQUYgSDFcdUZGMUEke2MuaDFMaW5lc30gXHU4ODRDYCxcbiAgXS5qb2luKFwiXHVGRjFCXCIpO1xuICByZXR1cm4gW1xuICAgIGBcdTVFN0JcdTcwNkZcdTcyNDdcdTVCQjlcdTkxQ0YgXHUyMDE0XHUyMDE0IFx1NEUwMFx1NUM0Rlx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1MzAwMlx1NTdGQVx1NEU4RVx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NFx1NUI5RVx1NjVGNiBTbGlkZXMgXHU1RTAzXHU1QzQwXHU3NTFGXHU2MjEwXHVGRjFCXHU2MjQwXHU2NzA5XHU2NTcwXHU1QjU3XHU2MzA5XHU1RjUzXHU1MjREIFVJIFx1NkJENFx1NEY4Qlx1NUI5RVx1NkQ0Qi9cdTYzQThcdTdCOTdcdTMwMDJgLFxuICAgIGBgLFxuICAgIC4uLnpoQ29udGV4dCgpLFxuICAgIGBgLFxuICAgIGBcdTUxRTBcdTRGNTVcdUZGMUFcdTVDNEZcdTVFNTUgJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHhcdUZGMUJcdTY1ODdcdTVCNTdcdTUzM0EgJHttLnRleHQud2lkdGh9XHUwMEQ3JHttLnRleHQuaGVpZ2h0fXB4XHUzMDAyJHtiYXJ9ICR7dGl0bGV9YCxcbiAgICBgYCxcbiAgICBgXHU2NTg3XHU1QjU3XHU1M0MyXHU2NTcwXHVGRjA4XHU2QjYzXHU2NTg3ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHhcdUZGMDlcdUZGMUFgLFxuICAgIGBcdTZCQ0ZcdTg4NENcdTdFQTYgJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5jamspfSBcdTRFMkFcdTZDNDlcdTVCNTcgLyAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmxhdGluKX0gXHU0RTJBXHU2MkM5XHU0RTAxXHU1QjU3XHU3QjI2XHVGRjFCXHU2QjYzXHU2NTg3XHU4ODRDXHU5QUQ4ICR7Zm10KG0uYm9keS5saW5lSGVpZ2h0KX1weFx1MzAwMmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJcdTUyMTdcdTg4NjhcdTk4NzlcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiXHU0RUUzXHU3ODAxXHU4ODRDXCIsIG0uY29kZSA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5jb2RlLmxpbmVIZWlnaHQgfSA6IG51bGwpLFxuICBdXG4gICAgLmNvbmNhdChpbWcgPyBbaW1nXSA6IFtdKVxuICAgIC5jb25jYXQoW2BgLCBgXHU1QkI5XHU5MUNGXHVGRjFBJHtzYW1wbGVzfVx1MzAwMmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIGNhcGFjaXR5IHByb21wdC4gRm9sbG93cyB0aGUgT2JzaWRpYW4gVUkgbGFuZ3VhZ2UgdmlhIGBsb2NhbGVgXG4gKiAobWVhc3VyZWQgc2VwYXJhdGVseSBmcm9tIHRoZSBhcHApLiBUaGUgYG5vdGVgIHRhaWwgc3RhdGVzIHRoZSBwb2xpY3lcbiAqICh3aGF0IGZpdHMgb25lIHNjcmVlbikgXHUyMDE0IHNhbWUgd29yZGluZyBpbiBib3RoIGxhbmd1YWdlcyB3aGVyZSBwb3NzaWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdENhcGFjaXR5KG06IFNsaWRlTWV0cmljcywgYzogQ2FwYWNpdHlSZXN1bHQsIGxvY2FsZTogXCJ6aFwiIHwgXCJlblwiKTogc3RyaW5nIHtcbiAgY29uc3Qgbm90ZSA9XG4gICAgbG9jYWxlID09PSBcInpoXCJcbiAgICAgID8gXCJcdTc1MjhcdTZDRDVcdUZGMUFcdTc1MjhcdTYyMzdcdTRGMUFcdTYzRDBcdTRGOUJcdTY3NTBcdTY1OTlcdTVFNzZcdThCRjRcdTMwMENcdTU3RkFcdTRFOEVcdThCRTVcdTY3NTBcdTY1OTlcdTUyMzZcdTRGNUMgc2xpZGVzL1BQVCBcdTdCMTRcdThCQjBcdTMwMERcdUZGMUJcdTZCNjRcdTY1RjZcdTYzMDlcdTRFMEFcdTY1ODdcdTdFQTZcdTVCOUFcdTUyMUJcdTVFRkEgZGVjayBcdTIwMTRcdTIwMTQgXHU1MTQ4XHU0RTg2XHU4OUUzXHU2NzUwXHU2NTk5XHU1RTc2XHU3RUQ5XHU1MUZBXHU2M0QwXHU3RUIyL1x1ODlDNFx1NTIxMlx1RkYwQ1x1NTE4RFx1OTAxMFx1OTg3NVx1NzUxRlx1NjIxMFx1N0IxNFx1OEJCMFx1RkYxQlx1NkJDRlx1NEUyQVx1NTM2MVx1NzI0N1x1RkYwOFx1N0IxNFx1OEJCMFx1RkYwOVx1NTE4NVx1NjUzRVx1NjA3MFx1NTIzMFx1NTk3RFx1NTkwNFx1NzY4NFx1NTE4NVx1NUJCOVx1RkYwQ1x1NEUwRFx1ODk4MVx1OEQ4NVx1NTFGQVx1NUJCOVx1OTFDRlx1MzAwMlx1ODk4MVx1NkM0Mlx1RkYxQVx1NzUxRlx1NjIxMFx1NzY4NFx1NTE4NVx1NUJCOVx1NUZDNVx1OTg3Qlx1NjUzRVx1NTcyOFx1NUY1M1x1NTI0RFx1OEZEOVx1NEUwMFx1NUM0Rlx1NTE4NVx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1RkYxQlx1NzUyOFx1NEUwQVx1OTc2Mlx1NzY4NFx1NTFFMFx1NEY1NVx1NEUwRVx1ODg0Q1x1OUFEOFx1NjU3MFx1NUI1N1x1NjgzOFx1N0I5N1x1NjAzQlx1OUFEOFx1NUVBNlx1RkYwOFx1NkI2M1x1NjU4N1x1ODg0Q1x1NjU3MCBcdTAwRDcgXHU4ODRDXHU5QUQ4ICsgXHU2ODA3XHU5ODk4XHU5ODg0XHU3NTU5ICsgXHU1NzU3XHU5NUY0XHU5NUY0XHU4REREIFx1MjI2NCBcdTY1ODdcdTVCNTdcdTUzM0FcdTlBRDhcdTVFQTZcdUZGMDlcdTMwMDJcIlxuICAgICAgOiBcIlVzYWdlOiB0aGUgdXNlciB3aWxsIHByb3ZpZGUgbWF0ZXJpYWwgYW5kIGFzayB0byBtYWtlIHNsaWRlcy9QUFQgbm90ZXMgZm9yIGl0OyBpbiB0aGF0IGNhc2UgY3JlYXRlIGEgZGVjayBwZXIgdGhlIGNvbnZlbnRpb25zIGFib3ZlIFx1MjAxNCByZXZpZXcgdGhlIG1hdGVyaWFsIGFuZCBvdXRsaW5lIHRoZSBzdHJ1Y3R1cmUgZmlyc3QsIHRoZW4gZ2VuZXJhdGUgZWFjaCBzbGlkZSBub3RlOyBrZWVwIGVhY2ggY2FyZCdzIGNvbnRlbnQganVzdCB3aXRoaW4gY2FwYWNpdHkuIFJlcXVpcmVtZW50OiB0aGUgZ2VuZXJhdGVkIGNvbnRlbnQgbXVzdCBmaXQgdGhpcyBvbmUgc2NyZWVuIFx1MjAxNCBubyBzY3JvbGxpbmcuIENoZWNrIHRoZSB0b3RhbCBoZWlnaHQgd2l0aCB0aGUgbnVtYmVycyBhYm92ZSAobGluZXMgXHUwMEQ3IGxpbmUtaGVpZ2h0ICsgdGl0bGUgcmVzZXJ2ZSArIGludGVyLWJsb2NrIHNwYWNpbmcgXHUyMjY0IHRleHQgYXJlYSBoZWlnaHQpLlwiO1xuICByZXR1cm4gbG9jYWxlID09PSBcInpoXCIgPyB6aFByb21wdChtLCBjLCBub3RlKSA6IGVuUHJvbXB0KG0sIGMsIG5vdGUpO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9tb2RlXCI7XG5cbi8qKlxuICogVHlwb2dyYXBoeS1tZWFzdXJlbWVudCB0b29saW5nIChkZXYgYnVpbGRzIG9ubHkpLlxuICpcbiAqIFRoZSBgbnMtZGVidWctc3R5bGVzYCBjb21tYW5kIHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyBpblxuICogZWRpdCAoTGl2ZSBQcmV2aWV3KSBhbmQgdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldywgbWVyZ2VzIHRoZVxuICogcmVzdWx0cywgY29tcHV0ZXMgYW4gZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kIHdyaXRlcyBpdCB0b1xuICogLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC4gUmVnaXN0ZXJlZCBvbmx5IHdoZW4gdGhlXG4gKiBidWlsZC10aW1lIERFVl9NT0RFIGZsYWcgaXMgdHJ1ZTsgcmVsZWFzZSBidWlsZHMgdHJlZS1zaGFrZSB0aGlzIG1vZHVsZSBvdXQuXG4gKi9cblxuLyoqIEZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyB1c2VkIGJ5IHRoZSBkZWJ1ZyBjb21tYW5kIChlZGl0IHNpZGUpICovXG5leHBvcnQgY29uc3QgU0FNUExFX05PVEVfTkFNRVMgPSBbXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtaGVhZGluZ3NcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1saXN0XCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtY29kZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLXF1b3RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbWVkaWFcIixcbl07XG5cbi8qKiBTdHlsZSBzZWN0aW9ucyBzYW1wbGVkIGJ5IHNhbXBsZVN0eWxlcygpIGFuZCBjb21wYXJlZCBieSBkaWZmRHVtcHMoKSAqL1xuY29uc3QgU1RZTEVfU0VDVElPTlMgPSBbXG4gIFwiY29udGFpbmVyXCIsXG4gIFwicGFyYWdyYXBoXCIsXG4gIFwiaDFcIixcbiAgXCJsaXN0SXRlbVwiLFxuICBcImNvZGVCbG9ja1wiLFxuICBcImJsb2NrcXVvdGVcIixcbiAgXCJpbmxpbmVDb2RlXCIsXG4gIFwidGFibGVcIixcbiAgXCJpbWFnZVwiLFxuICBcImhvcml6b250YWxSdWxlXCIsXG5dO1xuXG4vKiogUHJvbWlzZS1iYXNlZCBzbGVlcCAqL1xuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHdpbmRvdy5zZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKlxuICogTWVyZ2Ugbm9uLW1pc3Npbmcgc3R5bGUgc2VjdGlvbnMgb2YgYSBmcmVzaCBzYW1wbGUgaW50byB0aGUgdGFyZ2V0XG4gKiAoZmlyc3Qgbm9uLW1pc3NpbmcgdmFsdWUgd2lucykuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU2FtcGxlKHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHNhbXBsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gc2FtcGxlW2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlY3Rpb24gfHwgXCIobWlzc2luZylcIiBpbiBzZWN0aW9uKSBjb250aW51ZTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRhcmdldFtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKGV4aXN0aW5nICYmICEoXCIobWlzc2luZylcIiBpbiBleGlzdGluZykpIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc2VjdGlvbjtcbiAgfVxuICAvLyBQcm9iZSBmaWVsZHMgcmlkZSBhbG9uZyAoZmlyc3Qgbm9uLWVtcHR5IHdpbnMpXG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImxpc3RMaW5lc1wiLFxuICAgIFwibWV0YWRhdGFDb250YWluZXJEaXNwbGF5XCIsXG4gICAgXCJoMU9mZnNldFRvcFwiLFxuICAgIFwiaDFUb3BJbkNvbnRlbnRcIixcbiAgICBcImgxTGVmdEluQ29udGVudFwiLFxuICAgIFwidGl0bGVcIixcbiAgICBcImNvbnRlbnRDaGlsZHJlblwiLFxuICAgIFwidG9wQ2hhaW5cIixcbiAgXSkge1xuICAgIGNvbnN0IHByb2JlID0gc2FtcGxlW2tleV07XG4gICAgaWYgKHByb2JlID09PSB1bmRlZmluZWQgfHwgcHJvYmUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb2JlKSAmJiBwcm9iZS5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcHJvYmUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvYmUpICYmIE9iamVjdC5rZXlzKHByb2JlKS5sZW5ndGggPT09IDApXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFyZ2V0W2tleV0gPT09IHVuZGVmaW5lZCkgdGFyZ2V0W2tleV0gPSBwcm9iZTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmUgdGhlIHN0eWxlIHNlY3Rpb25zIG9mIGFuIGVkaXQgZHVtcCBhbmQgYSByZWFkaW5nIGR1bXA7IG9ubHlcbiAqIGtleXMgd2hvc2UgdmFsdWVzIGRpZmZlciBhcmUga2VwdCwgYXMgeyBrZXk6IHsgZWRpdCwgcmVhZGluZyB9IH0uXG4gKi9cbmZ1bmN0aW9uIGRpZmZEdW1wcyhcbiAgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IGUgPSAoZWRpdFtzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCByID0gKHJlYWRpbmdbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGUpLCAuLi5PYmplY3Qua2V5cyhyKV0pO1xuICAgIGNvbnN0IGRpZmZzOiBSZWNvcmQ8c3RyaW5nLCB7IGVkaXQ6IHN0cmluZzsgcmVhZGluZzogc3RyaW5nIH0+ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgaWYgKGVba2V5XSAhPT0gcltrZXldKSB7XG4gICAgICAgIGRpZmZzW2tleV0gPSB7IGVkaXQ6IGVba2V5XSA/PyBcIihtaXNzaW5nKVwiLCByZWFkaW5nOiByW2tleV0gPz8gXCIobWlzc2luZylcIiB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoZGlmZnMpLmxlbmd0aCA+IDApIG91dFtzZWN0aW9uXSA9IGRpZmZzO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBTYW1wbGUgdGhlIGN1cnJlbnQgdmlldydzIHR5cG9ncmFwaHkgY29tcHV0ZWQgc3R5bGVzICsgQ1NTIHZhcmlhYmxlcyAqL1xuZnVuY3Rpb24gc2FtcGxlU3R5bGVzKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0VkaXQgPSB2aWV3LmdldE1vZGUoKSA9PT0gXCJzb3VyY2VcIjtcbiAgY29uc3QgY29udGVudEVsID0gdmlldy5jb250ZW50RWw7XG4gIC8vIEZpcnN0IG1hdGNoaW5nIGNhbmRpZGF0ZSB3aW5zIFx1MjAxNCBlZGl0IChjbTYpIGFuZCByZWFkaW5nIHVzZVxuICAvLyBkaWZmZXJlbnQgZWxlbWVudCBzdHJ1Y3R1cmVzIChlLmcuIG5vIHByZS9ibG9ja3F1b3RlIGluIGNtNikuXG4gIGNvbnN0IHBpY2sgPSAoc2Vsczogc3RyaW5nW10pOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3Qgc2VsIG9mIHNlbHMpIHtcbiAgICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgICBpZiAoZWwpIHJldHVybiBlbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGNvbnN0IHN0eWxlID0gKGVsOiBIVE1MRWxlbWVudCB8IG51bGwsIHByb3BzOiBzdHJpbmdbXSk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICAgIGlmICghZWwpIHJldHVybiB7IFwiKG1pc3NpbmcpXCI6IFwiZWxlbWVudCBub3QgaW4gdGhpcyBub3RlXCIgfTtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcCBvZiBwcm9wcykge1xuICAgICAgY29uc3QgdiA9IGNzLmdldFByb3BlcnR5VmFsdWUocCkudHJpbSgpO1xuICAgICAgaWYgKHYpIG91dFtwXSA9IHY7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IHZhcnMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICBjb25zdCBjc3NWYXIgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHZhcnMuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKS50cmltKCk7XG5cbiAgY29uc3QgY29udGFpbmVyID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWNvbnRlbnRcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiLFxuICBdKTtcbiAgY29uc3QgcGFyYSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcFwiLFxuICBdKTtcbiAgY29uc3QgaDEgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1oZWFkZXItMVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGgxXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaDFcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoMVwiLFxuICBdKTtcbiAgY29uc3QgbGlzdEl0ZW0gPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgICBpc0VkaXQgPyBcIi5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICBdKTtcbiAgY29uc3QgcHJlID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgcHJlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tZWRpdGluZyBwcmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWNvZGVibG9ja1wiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICBdKTtcbiAgY29uc3QgcXVvdGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGJsb2NrcXVvdGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBibG9ja3F1b3RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtcXVvdGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBibG9ja3F1b3RlXCIsXG4gIF0pO1xuICBjb25zdCBpbmxpbmVDb2RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBjb2RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgY29kZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1pbmxpbmUtY29kZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGNvZGVcIixcbiAgXSk7XG4gIGNvbnN0IHRhYmxlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IHRhYmxlXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdGFibGVcIixcbiAgXSk7XG4gIGNvbnN0IGltZyA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaW1nXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGltZ1wiLFxuICAgIFwiaW1nXCIsIC8vIHdob2xlLWRvY3VtZW50IGZhbGxiYWNrXG4gIF0pO1xuICBjb25zdCBociA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20taHJcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICBdKTtcblxuICAvLyBTdHJ1Y3R1cmUgcHJvYmVzIChlZGl0IHZpZXcgb25seSk6IHRoZSBzb3VyY2UtdmlldyBjbGFzcyBsaXN0XG4gIC8vIChjb25maXJtcyB0aGUgTGl2ZSBQcmV2aWV3IG1hcmtlciBjbGFzcykgYW5kIHVuaXF1ZSBlbGVtZW50IHRhZ3NcbiAgLy8gaW5zaWRlIHRoZSBlZGl0b3IgKHJldmVhbHMgaG93IGNtNiByZW5kZXJzIGNvZGUgYmxvY2tzIGV0Yy4gd2hlblxuICAvLyB0aGUgdXN1YWwgc2VsZWN0b3JzIGRvIG5vdCBtYXRjaCkuXG4gIGNvbnN0IHNvdXJjZVZpZXdDbGFzcyA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTZcIik/LmNsYXNzTmFtZSA/PyBcIlwiO1xuICBjb25zdCBkb21UYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnRlbnRFbFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAqXCIpXG4gICAgICAuZm9yRWFjaCgoZWwpID0+IHRhZ3MuYWRkKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkpO1xuICAgIGRvbVRhZ3MucHVzaCguLi50YWdzKTtcbiAgfVxuICAvLyBMaXN0LWxpbmUgcHJvYmUgKGVkaXQgdmlldyBvbmx5KTogY2xhc3MgbmFtZXMgKyBjb21wdXRlZCBwYWRkaW5nXG4gIC8vIG9mIHRoZSBmaXJzdCBsaXN0IGxpbmVzIFx1MjAxNCBuZXN0ZWQgbGV2ZWxzIG9mdGVuIHVzZSBkaXN0aW5jdFxuICAvLyBjbGFzc2VzIG9yIGlubGluZSBwYWRkaW5ncywgd2hpY2ggZGVjaWRlcyB3aGV0aGVyIGEgbGV2ZWwtYXdhcmVcbiAgLy8gaW5kZW50IG92ZXJyaWRlIGlzIGV2ZW4gcG9zc2libGUuXG4gIGNvbnN0IGxpc3RMaW5lczogeyBjbGFzc05hbWU6IHN0cmluZzsgcGFkZGluZ0xlZnQ6IHN0cmluZyB9W10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yQWxsKFwiLkh5cGVyTUQtbGlzdC1saW5lXCIpLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICBpZiAoaSA+PSA0KSByZXR1cm47XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgbGlzdExpbmVzLnB1c2goe1xuICAgICAgICBjbGFzc05hbWU6IGVsLmNsYXNzTmFtZSxcbiAgICAgICAgcGFkZGluZ0xlZnQ6IGNzLmdldFByb3BlcnR5VmFsdWUoXCJwYWRkaW5nLWxlZnRcIikudHJpbSgpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gRnJvbnRtYXR0ZXIgcHJvYmVzOiBkb2VzIHRoZSAoaGlkZGVuKSBwcm9wZXJ0aWVzIGFyZWEgc3RpbGxcbiAgLy8gb2NjdXB5IHNwYWNlIGluIExpdmUgUHJldmlldz8gQW5kIGhvdyBmYXIgaXMgdGhlIEgxIGZyb20gdGhlXG4gIC8vIHRvcCBvZiB0aGUgY29udGVudCBhcmVhPyAocmVhZGluZyBtb2RlIGhhcyBubyBzdWNoIHBhZGRpbmcpXG4gIGNvbnN0IG1ldGFkYXRhRGlzcGxheSA9ICgoKSA9PiB7XG4gICAgY29uc3Qgc2VsID0gaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiO1xuICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgcmV0dXJuIGVsID8gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSA6IFwiKG5vdCBpbiBET00pXCI7XG4gIH0pKCk7XG4gIGNvbnN0IGgxT2Zmc2V0VG9wID0gKCgpID0+IHtcbiAgICBpZiAoIWgxKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB0b3AgPSAwO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBoMTtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdG9wICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgICAgbm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRvcDtcbiAgfSkoKTtcbiAgLy8gV2hhdCBvY2N1cGllcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgY29udGVudCB0b3AgYW5kIHRoZSBIMT9cbiAgLy8gKGVkaXQpIGZpcnN0IGNoaWxkcmVuIG9mIC5jbS1jb250ZW50LCBhbmQgdGhlIG5ldCBIMSBkaXN0YW5jZVxuICAvLyBmcm9tIHRoZSBjb250ZW50IGFuY2hvciBcdTIwMTQgcmVhZGluZyBoYXMgbm8gc3VjaCBnYXAuXG4gIGNvbnN0IGFuY2hvciA9IGlzRWRpdFxuICAgID8gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIilcbiAgICA6IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiKTtcbiAgY29uc3QgaDFUb3BJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTtcbiAgfSkoKTtcbiAgY29uc3QgaDFMZWZ0SW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KTtcbiAgfSkoKTtcbiAgY29uc3QgY29udGVudENoaWxkcmVuID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhbmNob3IuY2hpbGRyZW4pXG4gICAgICAuc2xpY2UoMCwgNClcbiAgICAgIC5tYXAoKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xzOiAoZWwgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTmFtZSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSxcbiAgICAgICAgICBtYXJnaW5Ub3A6IGNzLm1hcmdpblRvcCxcbiAgICAgICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogY3MubWFyZ2luQm90dG9tLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IGNzLnBhZGRpbmdCb3R0b20sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSkoKTtcbiAgLy8gQ29udGFpbmVyIGNoYWluIHByb2JlOiBmcm9tIC5jbS1jb250ZW50IHVwIHRvIHRoZSB2aWV3LWNvbnRlbnQsXG4gIC8vIGVhY2ggd3JhcHBlcidzIHBhZGRpbmcvbWFyZ2luIFx1MjAxNCBsb2NhdGVzIHRoZSBsZWZ0b3ZlciB2ZXJ0aWNhbFxuICAvLyBvZmZzZXQgYmV0d2VlbiBlZGl0IGFuZCByZWFkaW5nIGNvbnRlbnQgYXJlYXMuXG4gIGNvbnN0IHRvcENoYWluID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJ0czogeyBjbHM6IHN0cmluZzsgcGFkVG9wOiBzdHJpbmc7IG1hclRvcDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBhbmNob3I7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICBjbHM6IG5vZGUuY2xhc3NOYW1lIHx8IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBwYWRUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgIG1hclRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgfSk7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFydHM7XG4gIH0pKCk7XG5cbiAgLy8gVGl0bGUgcHJvYmU6IHRoZSBnZW5lcmF0ZWQgOjpiZWZvcmUgaW4gU2xpZGVzIG1vZGUgKHdoZW4gYSB0aXRsZSBpc1xuICAvLyBjb25maWd1cmVkKS4gQ2FwdHVyZXMgaXRzIGNvbXB1dGVkIHN0eWxlIHNvIHdlIGNhbiBkaWZmIGl0IGFnYWluc3QgdGhlXG4gIC8vIGJvZHkgSDEgKC5jbS1oZWFkZXItMSkgYW5kIGFsaWduIHRoZW0gZXhhY3RseS5cbiAgY29uc3QgdGl0bGVCZWZvcmUgPSAoKCkgPT4ge1xuICAgIGlmICghaXNFZGl0KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgICBpZiAoIWNvbnRlbnQgfHwgIWNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQsIFwiOjpiZWZvcmVcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNzLmNvbnRlbnQsXG4gICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgcG9zaXRpb246IGNzLnBvc2l0aW9uLFxuICAgICAgdG9wOiBjcy50b3AsXG4gICAgICBsZWZ0OiBjcy5sZWZ0LFxuICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgIGZvbnRGYW1pbHk6IGNzLmZvbnRGYW1pbHksXG4gICAgICBmb250U2l6ZTogY3MuZm9udFNpemUsXG4gICAgICBsaW5lSGVpZ2h0OiBjcy5saW5lSGVpZ2h0LFxuICAgICAgZm9udFdlaWdodDogY3MuZm9udFdlaWdodCxcbiAgICAgIGZvbnRWYXJpYW50OiBjcy5mb250VmFyaWFudCxcbiAgICAgIGNvbG9yOiBjcy5jb2xvcixcbiAgICAgIGxldHRlclNwYWNpbmc6IGNzLmxldHRlclNwYWNpbmcsXG4gICAgICB0ZXh0VHJhbnNmb3JtOiBjcy50ZXh0VHJhbnNmb3JtLFxuICAgICAgd29yZFNwYWNpbmc6IGNzLndvcmRTcGFjaW5nLFxuICAgICAgZm9udEtlcm5pbmc6IGNzLmZvbnRLZXJuaW5nLFxuICAgICAgZm9udEZlYXR1cmVTZXR0aW5nczogY3MuZm9udEZlYXR1cmVTZXR0aW5ncyxcbiAgICAgIGZvbnRWYXJpYW50TnVtZXJpYzogY3MuZm9udFZhcmlhbnROdW1lcmljLFxuICAgICAgZm9udFZhcmlhbnRMaWdhdHVyZXM6IGNzLmZvbnRWYXJpYW50TGlnYXR1cmVzLFxuICAgICAgZm9udFZhcmlhbnRDYXBzOiBjcy5mb250VmFyaWFudENhcHMsXG4gICAgfTtcbiAgfSkoKTtcblxuICBjb25zdCBkdW1wID0ge1xuICAgIG1vZGU6IGlzRWRpdCA/IFwiZWRpdCAoTGl2ZSBQcmV2aWV3KVwiIDogXCJyZWFkaW5nXCIsXG4gICAgLy8gU2xpZGVzIHN0eWxpbmcgb25seSBhcHBsaWVzIHdoZW4gU2xpZGVzIG1vZGUgaXMgb25cbiAgICBzbGlkZXNBY3RpdmU6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpLFxuICAgIGRvbVRhZ3M6IGlzRWRpdCA/IGRvbVRhZ3MgOiB1bmRlZmluZWQsXG4gICAgc291cmNlVmlld0NsYXNzOiBpc0VkaXQgPyBzb3VyY2VWaWV3Q2xhc3MgOiB1bmRlZmluZWQsXG4gICAgbGl2ZVByZXZpZXc6IGlzRWRpdCA/IGlzTGl2ZVByZXZpZXcoYXBwKSA6IHVuZGVmaW5lZCxcbiAgICBsaXN0TGluZXM6IGlzRWRpdCA/IGxpc3RMaW5lcyA6IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXk6IG1ldGFkYXRhRGlzcGxheSxcbiAgICBoMU9mZnNldFRvcDogaDFPZmZzZXRUb3AsXG4gICAgaDFUb3BJbkNvbnRlbnQ6IGgxVG9wSW5Db250ZW50LFxuICAgIGgxTGVmdEluQ29udGVudDogaDFMZWZ0SW5Db250ZW50LFxuICAgIGNvbnRlbnRDaGlsZHJlbjogY29udGVudENoaWxkcmVuLFxuICAgIHRvcENoYWluOiB0b3BDaGFpbixcbiAgICB0aXRsZTogdGl0bGVCZWZvcmUsXG4gICAgY29udGFpbmVyOiBzdHlsZShjb250YWluZXIsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1heC13aWR0aFwiLFxuICAgICAgXCJ3aWR0aFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgcGFyYWdyYXBoOiBzdHlsZShwYXJhLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBoMTogc3R5bGUoaDEsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcImZvbnQtd2VpZ2h0XCIsXG4gICAgICBcImZvbnQtdmFyaWFudFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJsZXR0ZXItc3BhY2luZ1wiLFxuICAgICAgXCJ0ZXh0LXRyYW5zZm9ybVwiLFxuICAgICAgXCJ3b3JkLXNwYWNpbmdcIixcbiAgICAgIFwiZm9udC1rZXJuaW5nXCIsXG4gICAgICBcImZvbnQtZmVhdHVyZS1zZXR0aW5nc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbnVtZXJpY1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbGlnYXR1cmVzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1jYXBzXCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgbGlzdEl0ZW06IHN0eWxlKGxpc3RJdGVtLCBbXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGNvZGVCbG9jazogc3R5bGUocHJlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICBibG9ja3F1b3RlOiBzdHlsZShxdW90ZSwgW1xuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwiYm9yZGVyLWxlZnQtd2lkdGhcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgIF0pLFxuICAgIGlubGluZUNvZGU6IHN0eWxlKGlubGluZUNvZGUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIHRhYmxlOiBzdHlsZSh0YWJsZSwgW1wiZm9udC1zaXplXCIsIFwibGluZS1oZWlnaHRcIiwgXCJ3aWR0aFwiLCBcImJvcmRlci1jb2xsYXBzZVwiXSksXG4gICAgaW1hZ2U6IHN0eWxlKGltZywgW1wiZGlzcGxheVwiLCBcIm1hcmdpbi1sZWZ0XCIsIFwibWFyZ2luLXJpZ2h0XCIsIFwibWF4LXdpZHRoXCIsIFwid2lkdGhcIl0pLFxuICAgIGhvcml6b250YWxSdWxlOiBzdHlsZShociwgW1wibWFyZ2luLXRvcFwiLCBcIm1hcmdpbi1ib3R0b21cIiwgXCJib3JkZXItdG9wLXdpZHRoXCIsIFwiaGVpZ2h0XCJdKSxcbiAgICBjc3NWYXJpYWJsZXM6IHtcbiAgICAgIFwiLS1mb250LXRleHRcIjogY3NzVmFyKFwiLS1mb250LXRleHRcIiksXG4gICAgICBcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCI6IGNzc1ZhcihcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCIpLFxuICAgICAgXCItLWgxLXNpemVcIjogY3NzVmFyKFwiLS1oMS1zaXplXCIpLFxuICAgICAgXCItLWgxLWxpbmUtaGVpZ2h0XCI6IGNzc1ZhcihcIi0taDEtbGluZS1oZWlnaHRcIiksXG4gICAgICBcIi0taDEtd2VpZ2h0XCI6IGNzc1ZhcihcIi0taDEtd2VpZ2h0XCIpLFxuICAgICAgXCItLWgxLXZhcmlhbnRcIjogY3NzVmFyKFwiLS1oMS12YXJpYW50XCIpLFxuICAgICAgXCItLWgxLWNvbG9yXCI6IGNzc1ZhcihcIi0taDEtY29sb3JcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLXRvcFwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi10b3BcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLWJvdHRvbVwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi1ib3R0b21cIiksXG4gICAgICBcIi0tcC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tcC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3Qtc3BhY2luZ1wiOiBjc3NWYXIoXCItLWxpc3Qtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LWluZGVudFwiOiBjc3NWYXIoXCItLWxpc3QtaW5kZW50XCIpLFxuICAgICAgXCItLWNvZGUtc2l6ZVwiOiBjc3NWYXIoXCItLWNvZGUtc2l6ZVwiKSxcbiAgICAgIFwiLS1jb2RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1jb2RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tY29kZS1yYWRpdXNcIjogY3NzVmFyKFwiLS1jb2RlLXJhZGl1c1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCIpLFxuICAgICAgXCItLWZpbGUtbWFyZ2luc1wiOiBjc3NWYXIoXCItLWZpbGUtbWFyZ2luc1wiKSxcbiAgICAgIFwiLS1maWxlLWxpbmUtd2lkdGhcIjogY3NzVmFyKFwiLS1maWxlLWxpbmUtd2lkdGhcIiksXG4gICAgICBcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiOiBjc3NWYXIoXCItLW5vcm1hbC1mb250LXNpemVcIiksXG4gICAgICBcIi0tZm9udC10ZXh0LXNpemVcIjogY3NzVmFyKFwiLS1mb250LXRleHQtc2l6ZVwiKSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gZHVtcDtcbn1cblxuLyoqXG4gKiBEZWJ1ZyB0eXBvZ3JhcGh5OiBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgKGVhY2hcbiAqIGNvdmVyaW5nIGEgZ3JvdXAgb2YgZWxlbWVudHMgXHUyMDE0IGFsbCB2aXNpYmxlIHdpdGhvdXQgc2Nyb2xsaW5nKSxcbiAqIHRoZW4gdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldyAobm8gdmlydHVhbGl6YXRpb25cbiAqIHRoZXJlKSwgbWVyZ2VzIGV2ZXJ5dGhpbmcsIGNvbXB1dGVzIHRoZSBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmRcbiAqIHdyaXRlcyBpdCB0byAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LlxuICogVGhlIHVzZXIncyBvd24gbm90ZSBpcyByZXN0b3JlZCBhdCB0aGUgZW5kLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHVtcFR5cG9ncmFwaHkocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYXBwID0gcGx1Z2luLmFwcDtcbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBubyBhY3RpdmUgTWFya2Rvd24gbm90ZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc3RhcnRNb2RlID0gdmlldy5nZXRNb2RlKCk7XG4gIGNvbnN0IGFjdGl2ZUZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgY29uc3QgbGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG5cbiAgLy8gRWRpdCBzaWRlOiBlYWNoIHNob3J0IG5vdGUga2VlcHMgZXZlcnkgdGFyZ2V0IGVsZW1lbnQgb24gc2NyZWVuXG4gIGNvbnN0IGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBTQU1QTEVfTk9URV9OQU1FUykge1xuICAgIGNvbnN0IGYgPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGB0ZXN0cy8ke25hbWV9Lm1kYCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg1MDApO1xuICAgIGNvbnN0IHMgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgICBpZiAocykgbWVyZ2VTYW1wbGUoZWRpdCwgcyk7XG4gIH1cblxuICAvLyBSZWFkaW5nIHNpZGU6IHRoZSBraXRjaGVuLXNpbmsgbm90ZSByZW5kZXJzIGV2ZXJ5dGhpbmcgYXQgb25jZVxuICBsZXQgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZGVtbyA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCJ0ZXN0cy90eXBvZ3JhcGh5LWRlbW8ubWRcIik7XG4gIGlmIChkZW1vIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGRlbW8sIHsgc3RhdGU6IHsgbW9kZTogXCJwcmV2aWV3XCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg4MDApO1xuICAgIHJlYWRpbmcgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgdGhlIHVzZXIncyBub3RlXG4gIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShhY3RpdmVGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IHN0YXJ0TW9kZSB9IH0pO1xuICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cbiAgaWYgKCFyZWFkaW5nKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IHJlYWRpbmcgc2FtcGxlIGZhaWxlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXlsb2FkID0geyBlZGl0LCByZWFkaW5nLCBkaWZmOiBkaWZmRHVtcHMoZWRpdCwgcmVhZGluZykgfTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci53cml0ZShcIi5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb25cIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMikpO1xuICAgIG5ldyBOb3RpY2UoXCJUeXBvZ3JhcGh5IGR1bXAgXHUyMTkyIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gKHZhdWx0IHJvb3QpXCIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCB3cml0ZSBkZWJ1ZyBmaWxlICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG5cbi8qKiBSZWdpc3RlciB0aGUgZGV2LW9ubHkgZGVidWcgY29tbWFuZCAoY2FsbGVkIG9ubHkgd2hlbiBERVZfTU9ERSBpcyB0cnVlKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtZGVidWctc3R5bGVzXCIsXG4gICAgbmFtZTogXCJEZWJ1ZzogZHVtcCB0eXBvZ3JhcGh5IHN0eWxlc1wiLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbiksXG4gIH0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTW9kZSBvZiB0aGUgYWN0aXZlIE1hcmtkb3duIHZpZXc6ICdwcmV2aWV3Jz1yZWFkaW5nICdzb3VyY2UnPWVkaXRpbmcgJyc9bm9uZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRNb2RlKGFwcDogQXBwKTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiIHwgXCJcIiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgcmV0dXJuIHZpZXcgPyB2aWV3LmdldE1vZGUoKSA6IFwiXCI7XG59XG5cbi8qKlxuICogVHJ1ZSB3aGVuIHRoZSBhY3RpdmUgZWRpdCB2aWV3IGlzIExpdmUgUHJldmlldyAoU2xpZGVzKSBcdTIwMTQgYXNcbiAqIG9wcG9zZWQgdG8gU291cmNlIG1vZGUuIE9ic2lkaWFuIHJlcG9ydHMgYm90aCBhcyBtb2RlIFwic291cmNlXCI7XG4gKiB0aGUgdmlldyBzdGF0ZSBjYXJyaWVzIGEgYHNvdXJjZWAgZmxhZyAoU291cmNlIG1vZGUgPSB0cnVlKSwgd2l0aFxuICogYSBET00gY2xhc3MgZmFsbGJhY2sgKC5pcy1saXZlLXByZXZpZXcpIGZvciBzYWZldHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xpdmVQcmV2aWV3KGFwcDogQXBwKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSBcInNvdXJjZVwiKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN0YXRlID0gdmlldy5nZXRTdGF0ZSgpIGFzIHsgc291cmNlPzogYm9vbGVhbiB9O1xuICBpZiAoc3RhdGUuc291cmNlID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IGZhbHNlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICEhdmlldy5jb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202LmlzLWxpdmUtcHJldmlld1wiKTtcbn1cblxuLyoqIEZyb250bWF0dGVyIG9mIGFueSBub3RlIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb250bWF0dGVyT2YoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIHJldHVybiBjYWNoZT8uZnJvbnRtYXR0ZXIgPz8gbnVsbDtcbn1cblxuLyoqIEN1cnJlbnQgbm90ZSdzIGZyb250bWF0dGVyIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2ZUZyb250bWF0dGVyKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgZmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICByZXR1cm4gZmlsZSA/IGZyb250bWF0dGVyT2YoYXBwLCBmaWxlKSA6IG51bGw7XG59XG4iLCAiLyoqIEEgYnVpbHQtaW4gU2xpZGVzIHN0eWxlIHRlbXBsYXRlIChyZW5kZXJlZCBhcyBib2R5IGNsYXNzIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gKSAqL1xuZXhwb3J0IGludGVyZmFjZSBTbGlkZXNUaGVtZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbi8qKiBCdWlsdC1pbiBzdHlsZSB0ZW1wbGF0ZXMgZm9yIHRoZSBTbGlkZXMgY2FyZCArIGJhciAoYWxsIHRoZW1lLWFkYXB0aXZlKSAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19USEVNRVM6IHJlYWRvbmx5IFNsaWRlc1RoZW1lW10gPSBbXG4gIHsgaWQ6IFwianl5XCIsIGxhYmVsOiBcIkxlY3R1cmUgKGp5eSlcIiB9LFxuICB7IGlkOiBcImRhc2hlZFwiLCBsYWJlbDogXCJEYXNoZWQgb3V0bGluZVwiIH0sXG4gIHsgaWQ6IFwicGFwZXJcIiwgbGFiZWw6IFwiUGFwZXIgY2FyZFwiIH0sXG4gIHsgaWQ6IFwibWluaW1hbFwiLCBsYWJlbDogXCJNaW5pbWFsXCIgfSxcbiAgeyBpZDogXCJhY2NlbnRcIiwgbGFiZWw6IFwiQWNjZW50IGVkZ2VcIiB9LFxuICB7IGlkOiBcImdsYXNzXCIsIGxhYmVsOiBcIkZyb3N0ZWQgZ2xhc3NcIiB9LFxuXTtcblxuLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB7XG4gIC8qKiBTaG93IFx1MjVDMCBcdTI1QjYgcHJldmlvdXMvbmV4dCBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dOYXZCdXR0b25zOiBib29sZWFuO1xuICAvKiogUGFnZSBudW1iZXIgZGlzcGxheSBzdHlsZTogXCJmcmFjdGlvblwiID0gTiAvIFRvdGFsLCBcImN1cnJlbnRcIiA9IE4sIFwibm9uZVwiID0gaGlkZGVuICovXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgLyoqIFNob3cgYSB0aGluIGNsaWNrYWJsZSBwcm9ncmVzcyBsaW5lIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd1Byb2dyZXNzOiBib29sZWFuO1xuICAvKiogU2hvdyB0aGUgZW50aXJlIHNsaWRlcyBiYXIgKG1hc3RlciB0b2dnbGUpICovXG4gIHNob3dTbGlkZXNCYXI6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIG1hbnVhbGx5IGhpZCB0aGUgc2xpZGVzIGJhciAodG9nZ2xlIGNvbW1hbmQpICovXG4gIGJhckhpZGRlbjogYm9vbGVhbjtcbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgd2hlbiBvcGVuaW5nIGEgZGVjayBub3RlIChkZWZhdWx0IG9mZikgKi9cbiAgYXV0b0VudGVyU2xpZGVzOiBib29sZWFuO1xuICAvKiogUHJlc3MgRXNjYXBlIHRvIGV4aXQgU2xpZGVzIG1vZGUgKGRlZmF1bHQgb24pICovXG4gIGVzY0V4aXRzU2xpZGVzOiBib29sZWFuO1xuICAvKiogRnJvbnRtYXR0ZXIgcHJvcGVydHkgc2hvd24gYXMgdGhlIGNhcmQgdGl0bGUgKFwiXCIgPSBub25lLCBcImZpbGVuYW1lXCIgPSBmaWxlIG5hbWUpICovXG4gIHNsaWRlc1RpdGxlOiBzdHJpbmc7XG4gIC8qKiBTdHlsZSB0ZW1wbGF0ZSBpZCBmcm9tIFNMSURFU19USEVNRVMgKGNhcmQgKyBiYXIgYXBwZWFyYW5jZSkgKi9cbiAgc2xpZGVzVGhlbWU6IHN0cmluZztcbiAgLyoqIENvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyBmb3IgdGhlIHNsaWRlcyBiYXIgKGVtcHR5ID0gbm9uZSkgKi9cbiAgYmFyUHJvcGVydGllczogc3RyaW5nO1xuICAvKiogSlNPTiBhcnJheSBvZiBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIGJhciBwcm9wZXJ0aWVzIChkcmFnZ2FibGUgZGl2aWRlcnMpICovXG4gIGJhclByb3BlcnR5V2lkdGhzOiBzdHJpbmc7XG4gIC8qKiBBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHBhbmVsIChkZWZhdWx0IG9uKSAqL1xuICBjb25maXJtRGVsZXRlU2xpZGVzOiBib29sZWFuO1xuICAvKipcbiAgICogQmxvY2sgaW1hZ2UgZW1iZWRzIGFzIGNlbnRlcmVkIGNhcmQgYmxvY2tzIChkZWZhdWx0IG9uKS4gV2hlbiBvZmYsXG4gICAqIGltYWdlcyBrZWVwIE9ic2lkaWFuJ3MgbmF0aXZlIGlubGluZSBmbG93IFx1MjAxNCB0ZXh0IGZsb3dzIGFyb3VuZC9iZXNpZGVcbiAgICogdGhlbSBleGFjdGx5IGxpa2UgTGl2ZSBQcmV2aWV3IG91dHNpZGUgU2xpZGVzIG1vZGUuXG4gICAqL1xuICBpbWFnZUxheW91dDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0ge1xuICBzaG93TmF2QnV0dG9uczogdHJ1ZSxcbiAgcGFnZU51bWJlclN0eWxlOiBcIm5vbmVcIixcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBzaG93U2xpZGVzQmFyOiB0cnVlLFxuICBiYXJIaWRkZW46IGZhbHNlLFxuICBhdXRvRW50ZXJTbGlkZXM6IGZhbHNlLFxuICBlc2NFeGl0c1NsaWRlczogdHJ1ZSxcbiAgc2xpZGVzVGl0bGU6IFwiXCIsXG4gIHNsaWRlc1RoZW1lOiBcImp5eVwiLFxuICBiYXJQcm9wZXJ0aWVzOiBcIlwiLFxuICBiYXJQcm9wZXJ0eVdpZHRoczogXCJcIixcbiAgY29uZmlybURlbGV0ZVNsaWRlczogdHJ1ZSxcbiAgaW1hZ2VMYXlvdXQ6IHRydWUsXG59O1xuXG4vKiogUmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5IGRyaXZpbmcgZGVjayBuYXZpZ2F0aW9uIChuZXZlciByZW5kZXJlZCBhcyBhIGNoaXApICovXG5leHBvcnQgY29uc3QgREVDS19LRVkgPSBcImRlY2tcIjtcbiIsICJpbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGNvcHlDYXBhY2l0eVByb21wdCB9IGZyb20gXCIuL2NhcGFjaXR5XCI7XG5pbXBvcnQgeyByZWdpc3RlckRlYnVnQ29tbWFuZCB9IGZyb20gXCIuL2RlYnVnXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBSZWdpc3RlciBldmVyeSBjb21tYW5kOyB0aGUgZGVidWcgY29tbWFuZCBpcyBkZXYtYnVpbGQgb25seS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbW1hbmRzKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIC8vIFRvZ2dsZSB0aGUgc2xpZGVzIGJhciBcdTIwMTQgb25seSBtZWFuaW5nZnVsIGluc2lkZSBTbGlkZXMgbW9kZSwgc28gYVxuICAvLyBjaGVja0NhbGxiYWNrIGtlZXBzIGl0IG91dCBvZiB0aGUgcGFsZXR0ZSBldmVyeXdoZXJlIGVsc2VcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1iYXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgYmFyXCIsXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB7XG4gICAgICAgIHBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW4gPSAhcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAgICAgdm9pZCBwbHVnaW4uc2F2ZVNldHRpbmdzKCkudGhlbigoKSA9PiBwbHVnaW4ucmVmcmVzaCgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBTaG93IHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtc2hvdy1wYW5lbFwiLFxuICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgcGFuZWxcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uYWN0aXZhdGVTbGlkZXNQYW5lbCgpLFxuICB9KTtcbiAgLy8gSGlkZSAvIHNob3cgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgKHByZXNlbnRpbmc7IFNsaWRlcyBtb2RlIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtcG9pbnRlclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIG1vdXNlIHBvaW50ZXJcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVBvaW50ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBQcmV2aW91cyAvIG5leHQgcGFnZSBcdTIwMTQgZGVjayBuYXZpZ2F0aW9uIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhc1xuICAvLyBuZWVkZWQpLiBjaGVja0NhbGxiYWNrIGtlZXBzIHRoZW0gb3V0IG9mIHRoZSBwYWxldHRlIG9uIG5vbi1kZWNrIG5vdGVzLFxuICAvLyB3aGVyZSB0aGV5IGhhdmUgbm90aGluZyB0byBmbGlwOyB0aGVpciBkZWZhdWx0IGhvdGtleXMgdGhlbiBubyBsb25nZXJcbiAgLy8gc2hhZG93IHRoZSBlZGl0b3IncyBzZWxlY3QtdG8tbGluZSBzaG9ydGN1dHMgb24gcGxhaW4gbm90ZXMgZWl0aGVyLlxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtcHJldlwiLFxuICAgIG5hbWU6IFwiUHJldmlvdXMgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd0xlZnRcIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4ubmF2aWdhdGUoXCJwcmV2XCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1uZXh0XCIsXG4gICAgbmFtZTogXCJOZXh0IHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dSaWdodFwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSB8fCAhcGx1Z2luLmRlY2tTZXJ2aWNlLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB2b2lkIHBsdWdpbi5uYXZpZ2F0ZShcIm5leHRcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5leHQgU2xpZGUgXHUyMDE0IG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBvbmUgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXh0XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV4dCBzbGlkZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJOXCIgfV0sXG4gICAgLy8gR3JleWVkIG91dCB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGlzIHBhcnQgb2YgYSBkZWNrIFx1MjAxNCBwbGFpbiBub3Rlc1xuICAgIC8vIHN0YXJ0IGRlY2tzIHdpdGggXCJDcmVhdGUgbmV3IHNsaWRlXCIgaW5zdGVhZC5cbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5ldyBTbGlkZSBcdTIwMTQgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuIEhpZGRlbiBvbiBkZWNrIG5vdGVzXG4gIC8vICh0aGUgZGVjayBncm93cyB2aWEgQ3JlYXRlIE5leHQgU2xpZGUgaW5zdGVhZCk7IHN0aWxsIHdvcmtzIGZyb20gYVxuICAvLyBibGFuayB0YWIgXHUyMDE0IGxhbmRzIGluIHRoZSBkZWZhdWx0IG5ldy1ub3RlIGxvY2F0aW9uLlxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5ld1wiLFxuICAgIG5hbWU6IFwiQ3JlYXRlIG5ldyBzbGlkZVwiLFxuICAgIC8vIE5vIGRlZmF1bHQgaG90a2V5OiBNb2QrU2hpZnQrTiBiZWxvbmdzIHRvIENyZWF0ZSBuZXh0IHNsaWRlIFx1MjAxNCB0d29cbiAgICAvLyBjb21tYW5kcyBzaGFyaW5nIG9uZSBkZWZhdWx0IGhvdGtleSB0cmlwcyBPYnNpZGlhbidzIGNvbmZsaWN0IFVJLlxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmIChmaWxlICYmIHBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5ldyhwbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5ldygpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBJbml0aWFsaXplIHNsaWRlcyB3aXRoIHRoaXMgbm90ZSBcdTIwMTQgcHJvbW90ZSB0aGUgYWN0aXZlIChwbGFpbikgbm90ZSBpbnRvXG4gIC8vIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGl0IGdhaW5zIGBkZWNrOiBbXWAgYW5kIGtlZXBzIGl0c1xuICAvLyBjb250ZW50LCB0aXRsZSBhbmQgbG9jYXRpb24sIHRoZW4gU2xpZGVzIG1vZGUgYXV0by1lbnRlcnMuIGNoZWNrQ2FsbGJhY2tcbiAgLy8gc2hvd3MgaXQgb25seSBvbiBub3RlcyB0aGF0IGFyZSBOT1QgYWxyZWFkeSBwYXJ0IG9mIGEgZGVjaywgc28gaXQgbmV2ZXJcbiAgLy8gYXBwZWFycyBvbiBkZWNrL3NsaWRlcyBub3RlcyB3aGVyZSBpdCB3b3VsZCBiZSBtaXNsZWFkaW5nLiBDb252ZXJzaW9uIGlzXG4gIC8vIGEgc2luZ2xlIGZyb250bWF0dGVyIHdyaXRlIChubyBjb25maXJtYXRpb24gZGlhbG9nKS5cbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLW1ha2UtZmlyc3Qtc2xpZGVcIixcbiAgICBuYW1lOiBcIkluaXRpYWxpemUgc2xpZGVzIHdpdGggdGhpcyBub3RlXCIsXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlIHx8IHBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udmVydGVkID0gYXdhaXQgcGx1Z2luLmRlY2tTZXJ2aWNlLm1ha2VGaXJzdFNsaWRlKGZpbGUpO1xuICAgICAgICAgIGlmICghY29udmVydGVkKSByZXR1cm47IC8vIGRlZmVuc2l2ZSBcdTIwMTQgdGhlIGNoZWNrIGFib3ZlIGFscmVhZHkgcGFzc2VkXG4gICAgICAgICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IG1hZGUgdGhpcyBub3RlIHRoZSBmaXJzdCBzbGlkZSBvZiBhIG5ldyBkZWNrXCIpO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5lbnRlclNsaWRlc0ZvckFjdGl2ZSgpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIENvcHkgYSBvbmUtc2NyZWVuIGNhcGFjaXR5IHJlcG9ydCBvZiB0aGUgY3VycmVudCBTbGlkZXMgbGF5b3V0XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jb3B5LXNsaWRlLXNraWxsXCIsXG4gICAgbmFtZTogXCJDb3B5IEFJIGFnZW50IHByb21wdFwiLFxuICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBjaGVja0NhbGxiYWNrIGlzIG5vdCB1c2VkOiBpdCB3b3VsZCBoaWRlIHRoZSBjb21tYW5kIGZyb20gdGhlXG4gICAgICAvLyBjb21tYW5kIHBhbGV0dGUgb3V0c2lkZSBTbGlkZXMgbW9kZSAocGFsZXR0ZSBvbmx5IHNob3dzIGNvbW1hbmRzXG4gICAgICAvLyB3aG9zZSBjaGVja0NhbGxiYWNrIHJldHVybnMgdHJ1ZSkuIEtlZXAgdGhlIGNvbW1hbmQgYWx3YXlzIHZpc2libGVcbiAgICAgIC8vIGFuZCBleHBsYWluIHRoZSByZXF1aXJlZCBtb2RlIHdoZW4gaW52b2tlZCB0b28gZWFybHkuXG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhd2FpdCBjb3B5Q2FwYWNpdHlQcm9tcHQocGx1Z2luLmFwcCk7XG4gICAgfSxcbiAgfSk7XG4gIC8vIFRvZ2dsZSBTbGlkZXMgbW9kZSBcdTIwMTQgdGhlIGltbWVyc2l2ZSBjYXJkIHZpZXcgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1zbGlkZXNcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgbW9kZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJFXCIgfV0sXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YocGx1Z2luLmFwcCwgZmlsZSk7XG4gICAgICBpZiAoZm0gPT09IG51bGwgfHwgIShERUNLX0tFWSBpbiBmbSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVTbGlkZXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBEZWJ1ZyB0b29saW5nIFx1MjAxNCByZWdpc3RlcmVkIG9ubHkgaW4gZGV2IGJ1aWxkcyAodHJlZS1zaGFrZW4gaW4gcmVsZWFzZSlcbiAgaWYgKERFVl9NT0RFKSByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW4pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtcbiAgcGxhbkNyZWF0ZU5ldyBhcyBwbGFuTmV3LFxuICBwbGFuQ3JlYXRlTmV4dCBhcyBwbGFuLFxuICBwbGFuTWFrZUZpcnN0U2xpZGUgYXMgcGxhbkZpcnN0LFxuICB0eXBlIENyZWF0ZU5leHRSZXN1bHQsXG59IGZyb20gXCIuL2NyZWF0ZU5leHRcIjtcbmltcG9ydCB7IGNvbXB1dGVEZWNrLCBleHRyYWN0TGlua3MsIGV4dHJhY3RSYXdMaW5rcywgdHlwZSBEZWNrSW5mbyB9IGZyb20gXCIuL2RlY2tcIjtcbmltcG9ydCB7IHBpY2tMYW5kaW5nUGF0aCwgcGxhbkRlbGV0ZVNsaWRlcyB9IGZyb20gXCIuL2RlbGV0ZVNsaWRlc1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB0eXBlIHsgTW92ZVBsYW4gfSBmcm9tIFwiLi9tb3ZlXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZXN1bHQgb2YgYSBEZWxldGUgc2xpZGVzIHJ1biAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVTbGlkZXNSZXN1bHQge1xuICAvKiogUGF0aHMgYWN0dWFsbHkgbW92ZWQgdG8gdGhlIHRyYXNoICovXG4gIHRyYXNoZWQ6IHN0cmluZ1tdO1xuICAvKiogV2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlcndhcmRzIChudWxsID0ga2VlcCBjdXJyZW50IG5vdGUpICovXG4gIGxhbmRpbmdQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjazogaXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW5cbiAgICogZW1wdHkgXHUyMDE0IGEgZnJlc2ggc2luZ2xlIHNsaWRlKSBvciBzb21lIG90aGVyIHNsaWRlIGRlY2xhcmVzIGl0IGFzIGl0c1xuICAgKiBuZXh0IHNsaWRlLlxuICAgKi9cbiAgaXNNZW1iZXIoZmlsZTogVEZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiAoZm0gIT09IG51bGwgJiYgREVDS19LRVkgaW4gZm0pIHx8IHRoaXMucHJldk9mKGZpbGUucGF0aCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBjdXJyZW50IG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2sgKG51bGwgd2hlbiBub3QgYSBtZW1iZXIpICovXG4gIGNvbXB1dGUoZmlsZTogVEZpbGUpOiBEZWNrSW5mbyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc01lbWJlcihmaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGNvbXB1dGVEZWNrKFxuICAgICAgZmlsZS5wYXRoLFxuICAgICAgKHBhdGgpID0+IHRoaXMubGlua1BhdGhzKHBhdGgpLFxuICAgICAgKHBhdGgpID0+IHRoaXMucHJldk9mKHBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogUmVzb2x2ZWQgbmV4dC1zbGlkZSBwYXRocyBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKFtdIHdoZW4gbm9uZSwgb3IgdGhlIGxpbmsgaXMgYnJva2VuKSAqL1xuICBuZXh0TGlua3MocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmxpbmtQYXRocyhwYXRoKTtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgYSBub3RlIGludG8gcmVhbCBub3RlIHBhdGhzIChtYXggb25lKSAqL1xuICBwcml2YXRlIGxpbmtQYXRocyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gW107XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXNcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KTogeCBpcyBURmlsZSA9PiAhIXgpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh0aGUgcHJldmlvdXMgc2xpZGUgaW5cbiAgICogdGhlIGNoYWluKS4gV2l0aCBuZXh0LW9ubHkgc2VtYW50aWNzIHRoaXMgYmFja3dhcmQgbG9va3VwIGlzIHRoZSBvbmx5XG4gICAqIHdheSB0byByZWFjaCB0aGUgY2hhaW4gaGVhZCBmcm9tIGEgbWlkZGxlL2xhc3Qgc2xpZGUuXG4gICAqL1xuICBwcml2YXRlIHByZXZPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLnBhdGggPT09IHBhdGgpIGNvbnRpbnVlO1xuICAgICAgaWYgKHRoaXMubGlua1BhdGhzKGYucGF0aClbMF0gPT09IHBhdGgpIHJldHVybiBmLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogTmFtZXMgaW4gdGhlIGBkZWNrYCBwcm9wZXJ0eSB0aGF0IHJlc29sdmUgdG8gbm8gbm90ZSAoYnJva2VuIGxpbmtzKSAqL1xuICBicm9rZW4oZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBmaWxlLnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIHJ1biBmb3IgdGhlIGFjdGl2ZSBub3RlLiBEZWNrIHNsaWRlc1xuICAgKiBpbnNlcnQvYXBwZW5kIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuIChQbGFpbiBub3RlcyBhcmUgcm91dGVkIHRvXG4gICAqIHBsYW5DcmVhdGVOZXcgYnkgdGhlIGNvbW1hbmQgXHUyMDE0IHRoaXMgY29yZSBzdGlsbCBoYW5kbGVzIHRoZW0gYXNcbiAgICogXCJubyB1c2FibGUgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmRcIi4pXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV4dChmaWxlOiBURmlsZSk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IHJhdyA9IGZtID8gZXh0cmFjdFJhd0xpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICBjb25zdCBleGlzdGluZ05hbWVzID0gbmV3IFNldCh0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkubWFwKChmKSA9PiBmLmJhc2VuYW1lKSk7XG4gICAgcmV0dXJuIHBsYW4oeyBjdXJyZW50TmFtZTogZmlsZS5iYXNlbmFtZSwgY3VycmVudExpbmtzOiByYXcsIGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHJ1bjogYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgaW4gdGhlXG4gICAqIHNhbWUgZm9sZGVyIGFzIHRoZSBhY3RpdmUgbm90ZSwgd2hpY2ggaXRzZWxmIHN0YXlzIHVudG91Y2hlZC5cbiAgICovXG4gIHBsYW5DcmVhdGVOZXcoKTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuTmV3KHsgZXhpc3RpbmdOYW1lcyB9KTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIENyZWF0ZSBOZXh0IFNsaWRlIHBsYW47IG9wZW49ZmFsc2Uga2VlcHMgdGhlIGN1cnJlbnQgbm90ZSBpbiB0aGUgZWRpdG9yICovXG4gIGFzeW5jIGV4ZWN1dGVDcmVhdGVOZXh0KGZpbGU6IFRGaWxlLCBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LCBvcGVuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKGZpbGUsIHBsYW4sIGRpclByZWZpeChmaWxlLnBhcmVudD8ucGF0aCksIG9wZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgQ3JlYXRlIE5ldyBTbGlkZSBwbGFuLiBMYW5kcyBpbiBPYnNpZGlhbidzIGRlZmF1bHQgbmV3LW5vdGVcbiAgICogbG9jYXRpb24gKFNldHRpbmdzIFx1MjE5MiBGaWxlcyAmIGxpbmtzIFx1MjE5MiBEZWZhdWx0IGxvY2F0aW9uIGZvciBuZXcgbm90ZXMpO1xuICAgKiB3aXRoIFwic2FtZSBmb2xkZXIgYXMgY3VycmVudFwiIGNvbmZpZ3VyZWQgdGhhdCBpcyB0aGUgYWN0aXZlIG5vdGUncyBvd25cbiAgICogZm9sZGVyLiBXb3JrcyB3aXRoIG5vIG5vdGUgb3BlbiBhdCBhbGwgKGJsYW5rIHRhYikuXG4gICAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV3KHBsYW46IENyZWF0ZU5leHRSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBcIlwiO1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKFxuICAgICAgbnVsbCxcbiAgICAgIHBsYW4sXG4gICAgICBkaXJQcmVmaXgodGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChzb3VyY2VQYXRoKT8ucGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9tb3RlIHRoZSBhY3RpdmUgbm90ZSBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGFkZCBgZGVjazogW11gXG4gICAqIHRvIGl0cyBmcm9udG1hdHRlciBcdTIwMTQgY29udGVudCwgdGl0bGUsIGxvY2F0aW9uIGFuZCBldmVyeSBvdGhlciBwcm9wZXJ0eVxuICAgKiBzdGF5IHVudG91Y2hlZC4gTm90ZXMgdGhhdCBhbHJlYWR5IGJlbG9uZyB0byBhIGRlY2sgYXJlIGxlZnQgYWxvbmUuXG4gICAqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBub3RlIHdhcyBjb252ZXJ0ZWQgKHRoZSBjYWxsZXIgbWF5IHRoZW4gYXV0by1lbnRlclxuICAgKiBTbGlkZXMgbW9kZSksIGZhbHNlIHdoZW4gaXQgd2FzIGFscmVhZHkgYSBkZWNrIG1lbWJlci5cbiAgICovXG4gIGFzeW5jIG1ha2VGaXJzdFNsaWRlKGZpbGU6IFRGaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKHBsYW5GaXJzdCh7IGFscmVhZHlEZWNrOiB0aGlzLmlzTWVtYmVyKGZpbGUpIH0pID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgIGZtW0RFQ0tfS0VZXSA9IFtdO1xuICAgIH0pO1xuICAgIC8vIE9ic2lkaWFuIGluZGV4ZXMgYSBzYXZlZCBmaWxlIGFzeW5jaHJvbm91c2x5OyB0aGUgY29tbWFuZCdzIGF1dG8tZW50ZXJcbiAgICAvLyByZWFkcyB0aGUgY2FjaGUsIHNvIGhhbmQgYmFjayBvbmx5IG9uY2UgdGhlIG5ldyBgZGVja2AgaXMgdmlzaWJsZS5cbiAgICBhd2FpdCB0aGlzLndhaXRGb3JDYWNoZWREZWNrKGZpbGUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXQgdW50aWwgdGhlIG1ldGFkYXRhIGNhY2hlIHJlZmxlY3RzIHRoZSBub3RlJ3MgYGRlY2tgIHByb3BlcnR5XG4gICAqIChiZXN0IGVmZm9ydCBcdTIwMTQgcmVzb2x2ZXMgb24gdGhlIHByb3BlcnR5IGFwcGVhcmluZywgb3IgYWZ0ZXIgYHRpbWVvdXRNc2ApLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyB3YWl0Rm9yQ2FjaGVkRGVjayhmaWxlOiBURmlsZSwgdGltZW91dE1zID0gMjAwMCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmhhc0RlY2tJbkNhY2hlKGZpbGUpKSByZXR1cm47XG4gICAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChjaGFuZ2VkOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlZC5wYXRoID09PSBmaWxlLnBhdGggJiYgdGhpcy5oYXNEZWNrSW5DYWNoZShmaWxlKSkge1xuICAgICAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub2ZmcmVmKHJlZik7XG4gICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9mZnJlZihyZWYpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCB0aW1lb3V0TXMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1ldGFkYXRhIGNhY2hlIGFscmVhZHkgc2hvd3MgYSBgZGVja2AgcHJvcGVydHkgb24gdGhlIG5vdGUgKi9cbiAgcHJpdmF0ZSBoYXNEZWNrSW5DYWNoZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIEFwcGx5IGEgcGxhbjogY3JlYXRlIHRoZSBub3RlLCByZXdpcmUgYGRlY2tgIHByb3BlcnRpZXMsIG9wdGlvbmFsbHkgb3BlbiBpdCAqL1xuICBwcml2YXRlIGFzeW5jIGFwcGx5UGxhbihcbiAgICBmaWxlOiBURmlsZSB8IG51bGwsXG4gICAgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCxcbiAgICBkaXI6IHN0cmluZyxcbiAgICBvcGVuID0gdHJ1ZSxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGAke2Rpcn0ke3BsYW4ubmV3TmFtZX0ubWRgO1xuICAgIGNvbnN0IGZyb250bWF0dGVyID0gcGxhbi5uZXdEZWNrTGlua3MubWFwKChsaW5rKSA9PiBKU09OLnN0cmluZ2lmeShsaW5rKSkuam9pbihcIiwgXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgLS0tXFxuZGVjazogWyR7ZnJvbnRtYXR0ZXJ9XVxcbi0tLVxcbmA7XG5cbiAgICBsZXQgbmV3RmlsZTogVEZpbGU7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUobmV3UGF0aCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBjcmVhdGUgXCIke3BsYW4ubmV3TmFtZX0ubWRcIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXdpcmUgdGhlIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCAoa2VlcHMgYWxsIG90aGVyIHByb3BlcnRpZXMgaW50YWN0KVxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiBwbGFuLnJld3JpdGVzKSB7XG4gICAgICBpZiAoIWZpbGUgfHwgcmV3cml0ZS5uYW1lICE9PSBmaWxlLmJhc2VuYW1lKSBjb250aW51ZTsgLy8gaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGVcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IHJld3JpdGUuZGVjaztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghb3BlbikgcmV0dXJuO1xuXG4gICAgLy8gT3BlbiB0aGUgbmV3IG5vdGUgaW4gdGhlIGN1cnJlbnQgcGFuZSwgZWRpdCBtb2RlIChMaXZlIFByZXZpZXcpXG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5ld0ZpbGUsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgbW92ZSBwbGFuOiByZXdyaXRlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgZXZlcnkgc2xpZGUgd2hvc2VcbiAgICogbmV4dCBsaW5rIGNoYW5nZWQsIGluIG5ldyBjaGFpbiBvcmRlciwgYXMgYmFyZSBgW1tiYXNlbmFtZV1dYCBsaW5rcyAodGhlXG4gICAqIGZvcm0gY3JlYXRlTmV4dCBhbmQgZGVsZXRlU2xpZGVzIHdyaXRlKS4gT25seSB0aGUgbm90ZXMgdGhlIHBsYW4gbmFtZXMgYXJlXG4gICAqIHRvdWNoZWQgXHUyMDE0IHRoZSByZXN0IG9mIHRoZSBkZWNrIGtlZXBzIGl0cyBmcm9udG1hdHRlciB1bnRvdWNoZWQuXG4gICAqXG4gICAqIFN0b3BzIGF0IHRoZSBmaXJzdCBmYWlsZWQgd3JpdGUgYW5kIHJldHVybnMgZmFsc2U6IHRoZSByZW1haW5pbmcgbm90ZXNcbiAgICoga2VlcCB0aGVpciBvbGQgbGlua3MsIHdoaWNoIHRoZSBjYWxsZXIgc2hvd3MgYnkgcmUtcmVuZGVyaW5nIGZyb20gdGhlIGxpdmVcbiAgICogY2hhaW4uIEEgcmV3cml0ZSB3aG9zZSBzb3VyY2Ugb3IgdGFyZ2V0IG5vdGUgaGFzIHZhbmlzaGVkIGFib3J0cyB0aGUgc2FtZVxuICAgKiB3YXkgXHUyMDE0IHdyaXRpbmcgYGRlY2s6IFtdYCBmb3IgYSB0YXJnZXQgdGhhdCBpcyBnb25lIHdvdWxkIHNpbGVudGx5IHRydW5jYXRlXG4gICAqIHRoZSBjaGFpbi4gUmV0dXJucyB0cnVlIHdoZW4gZXZlcnkgcmV3cml0ZSB3YXMgYXBwbGllZC5cbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVNb3ZlKHBsYW46IE1vdmVQbGFuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHBsYW4ucmV3cml0ZXMpIHtcbiAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmV3cml0ZS5wYXRoKTtcbiAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcbiAgICAgICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IG1vdmUgc2xpZGVzIFx1MjAxNCBcIiR7cmV3cml0ZS5wYXRofVwiIGlzIGdvbmVgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgbmV4dFBhdGggPSByZXdyaXRlLm5leHRQYXRoO1xuICAgICAgY29uc3QgbmV4dCA9IG5leHRQYXRoID8gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG5leHRQYXRoKSA6IG51bGw7XG4gICAgICBpZiAobmV4dFBhdGggIT09IG51bGwgJiYgIShuZXh0IGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBtb3ZlIHNsaWRlcyBcdTIwMTQgXCIke25leHRQYXRofVwiIGlzIGdvbmUgKG5lZWRlZCBieSBcIiR7ZmlsZS5iYXNlbmFtZX1cIilgLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZmlsZSwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICAgIGZtW0RFQ0tfS0VZXSA9IG5leHQgaW5zdGFuY2VvZiBURmlsZSA/IFtgW1ske25leHQuYmFzZW5hbWV9XV1gXSA6IFtdO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgICAgYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBtb3ZlIHNsaWRlcyBcdTIwMTQgd3JpdGluZyBcIiR7ZmlsZS5iYXNlbmFtZX1cIiBmYWlsZWQgKCR7U3RyaW5nKGVycm9yKX0pYCxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgc2xpZGVzIG91dCBvZiBhbiBvcmRlcmVkIGRlY2sgY2hhaW46IHNwbGljZSB0aGUgY2hhaW4gYXJvdW5kXG4gICAqIGV2ZXJ5IGRlbGV0ZWQgcnVuICh0aGUgcHJlZGVjZXNzb3IncyBgZGVja2AgdGFrZXMgb3ZlciB0aGUgcnVuJ3MgZmlyc3RcbiAgICogc3Vydml2b3IpLCB0aGVuIG1vdmUgZWFjaCBkZWxldGVkIG5vdGUgdG8gdGhlIHRyYXNoLiBgZm9jdXNQYXRoYCBpcyB0aGVcbiAgICogbm90ZSB0aGUgZWRpdG9yIGN1cnJlbnRseSBzaG93cyBcdTIwMTQgd2hlbiBpdCBpcyBhbW9uZyB0aGUgZGVsZXRlZCwgdGhlXG4gICAqIHJlc3VsdCBuYW1lcyB0aGUgbmVhcmVzdCBzdXJ2aXZpbmcgbmVpZ2hib3VyIHRvIG9wZW4gaW5zdGVhZC5cbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVEZWxldGVTbGlkZXMoXG4gICAgY2hhaW46IHN0cmluZ1tdLFxuICAgIGRlbGV0ZVBhdGhzOiBSZWFkb25seVNldDxzdHJpbmc+LFxuICAgIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbiAgKTogUHJvbWlzZTxEZWxldGVTbGlkZXNSZXN1bHQ+IHtcbiAgICBjb25zdCByZXdyaXRlcyA9IHBsYW5EZWxldGVTbGlkZXMoY2hhaW4sIGRlbGV0ZVBhdGhzKTtcblxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiByZXdyaXRlcykge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLnBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICBjb25zdCBuZXh0ID0gcmV3cml0ZS5uZXh0UGF0aCA/IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLm5leHRQYXRoKSA6IG51bGw7XG4gICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZiwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSBuZXh0IGluc3RhbmNlb2YgVEZpbGUgPyBbYFtbJHtuZXh0LmJhc2VuYW1lfV1dYF0gOiBbXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYXNoZWQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIGRlbGV0ZVBhdGhzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci50cmFzaEZpbGUoZik7XG4gICAgICAgIHRyYXNoZWQucHVzaChwYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBkZWxldGUgXCIke2YuYmFzZW5hbWV9XCIgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdHJhc2hlZCwgbGFuZGluZ1BhdGg6IHBpY2tMYW5kaW5nUGF0aChjaGFpbiwgZGVsZXRlUGF0aHMsIGZvY3VzUGF0aCkgfTtcbiAgfVxufVxuXG4vKiogRm9sZGVyIHBhdGggXHUyMTkyIHRyYWlsaW5nLXNsYXNoIHByZWZpeCAoXCJcIiBmb3IgdmF1bHQgcm9vdCkgKi9cbmZ1bmN0aW9uIGRpclByZWZpeChwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIXBhdGggfHwgcGF0aCA9PT0gXCIvXCIpIHJldHVybiBcIlwiO1xuICByZXR1cm4gYCR7cGF0aC5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpfS9gO1xufVxuIiwgIi8qKlxuICogZGVjay50cyBcdTIwMTQgUHVyZSBkZWNrLXJlc29sdXRpb24gY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvZGVjay50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHMgdGhlXG4gKiB2YXVsdCAobWV0YWRhdGFDYWNoZSkgdG8gdGhpcyBwdXJlIGludGVyZmFjZTogaXQgcmVzb2x2ZXMgYGRlY2tgXG4gKiBwcm9wZXJ0aWVzIHRvIG5vdGUgcGF0aHMsIHRoZW4gaGFuZHMgdGhlIHBhdGggZ3JhcGggdG8gY29tcHV0ZURlY2soKS5cbiAqL1xuXG4vKiogQSBkZWNrIGxpbmsgbGlzdCBob2xkcyBhdCBtb3N0IG9uZSBlbnRyeSAodGhlIG5leHQgc2xpZGUpICovXG5leHBvcnQgY29uc3QgTUFYX0RFQ0tfTElOS1MgPSAxO1xuXG4vKiogUmVzdWx0IG9mIHJlc29sdmluZyBhIG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgYSBkZWNrICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tJbmZvIHtcbiAgLyoqIENoYWluIG9mIG5vdGUgcGF0aHM6IFswXSBpcyB0aGUgZmlyc3Qgc2xpZGUsIHRoZW4gdGhlIHJlc3QgaW4gb3JkZXIgKi9cbiAgY2hhaW46IHN0cmluZ1tdO1xuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnQgbm90ZSBpbnNpZGUgY2hhaW4gKi9cbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjay5cbiAqXG4gKiB2MS4wLjAgY29udmVudGlvbiBcdTIwMTQgbmV4dC1vbmx5LCBubyBvdmVydmlldyBwYWdlOlxuICogICAtIGEgc2xpZGUncyBgZGVja2AgcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluazogdGhlIG5leHQgc2xpZGVcbiAqICAgICAodGhlIGxhc3Qgc2xpZGUgaGFzIG5vIGxpbmsgYXQgYWxsKTtcbiAqICAgLSBhIGRlY2sgaXMgc2ltcGx5IGEgZm9yd2FyZCBsaW5rIGNoYWluIHN0YXJ0aW5nIGF0IGl0cyBoZWFkIHNsaWRlO1xuICogICAtIGFueSBub3RlIHRoYXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW4gZW1wdHkpIGlzIGEgZGVjayBtZW1iZXIsXG4gKiAgICAgc28gYSBzaW5nbGUgZnJlc2hseSBjcmVhdGVkIHNsaWRlIGFscmVhZHkgY291bnRzIGFzIGEgb25lLXBhZ2UgZGVjay5cbiAqXG4gKiBCZWNhdXNlIHNsaWRlcyBubyBsb25nZXIgbGluayBiYWNrIHRvIGEgaGVhZCBub3RlLCB0aGUgY2hhaW4gaGVhZCBpc1xuICogbG9jYXRlZCBieSB3YWxraW5nIGJhY2t3YXJkOiBgZ2V0UHJldihwYXRoKWAgcmV0dXJucyB0aGUgbm90ZSB3aG9zZVxuICogYGRlY2tgIHByb3BlcnR5IHBvaW50cyBhdCBgcGF0aGAgKHVuZGVmaW5lZCB3aGVuIG5vbmUpLlxuICpcbiAqIGBnZXRMaW5rcyhwYXRoKWAgbXVzdCByZXR1cm4gdGhlIHJlc29sdmVkIG5vdGUgcGF0aHMgb2YgdGhlIGBkZWNrYFxuICogcHJvcGVydHkgb2YgdGhlIG5vdGUgYXQgYHBhdGhgIChlbXB0eSB3aGVuIHRoZSBub3RlIGhhcyBub25lLCBvciBpdHNcbiAqIGxpbmsgaXMgYnJva2VuIFx1MjAxNCBhIGJyb2tlbiBsaW5rIHNpbXBseSBlbmRzIHRoZSBjaGFpbiwgbmV2ZXIgY3Jhc2hlcykuXG4gKlxuICogUmV0dXJucyB0aGUgZnVsbCBjaGFpbiBhbmQgdGhlIGN1cnJlbnQgbm90ZSdzIGluZGV4LCBvciBudWxsIHdoZW4gdGhlXG4gKiBub3RlIGlzIG5vdCBwYXJ0IG9mIGFueSBkZWNrIChubyBgZGVja2AgcHJvcGVydHkgYW5kIG5vYm9keSBsaW5rcyB0byBpdCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlRGVjayhcbiAgY3VycmVudFBhdGg6IHN0cmluZyxcbiAgZ2V0TGlua3M6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZ1tdLFxuICBnZXRQcmV2OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmcgfCB1bmRlZmluZWQsXG4pOiBEZWNrSW5mbyB8IG51bGwge1xuICAvLyBXYWxrIGJhY2t3YXJkIHRvIHRoZSBjaGFpbiBoZWFkIChjeWNsZS1ndWFyZGVkKS4gQSBsb25lIG5vZGUgKG5vIG93blxuICAvLyBsaW5rLCBubyBwcmVkZWNlc3NvcikgcmVzb2x2ZXMgYXMgYSBvbmUtcGFnZSBjaGFpbiBcdTIwMTQgd2hldGhlciBpdCBjb3VudHNcbiAgLy8gYXMgYSBkZWNrIG1lbWJlciBhdCBhbGwgaXMgZGVjaWRlZCBieSB0aGUgYWRhcHRlciAodGhlIGBkZWNrYCBrZXkpLlxuICBjb25zdCBiYWNrVmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPihbY3VycmVudFBhdGhdKTtcbiAgbGV0IGhlYWQgPSBjdXJyZW50UGF0aDtcbiAgZm9yICg7Oykge1xuICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2KGhlYWQpO1xuICAgIGlmICghcHJldiB8fCBiYWNrVmlzaXRlZC5oYXMocHJldikpIGJyZWFrO1xuICAgIGJhY2tWaXNpdGVkLmFkZChwcmV2KTtcbiAgICBoZWFkID0gcHJldjtcbiAgfVxuXG4gIC8vIFdhbGsgZm9yd2FyZCBmcm9tIHRoZSBoZWFkIChjeWNsZS1ndWFyZGVkKS5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgbGV0IGN1cjogc3RyaW5nIHwgdW5kZWZpbmVkID0gaGVhZDtcbiAgd2hpbGUgKGN1ciAmJiAhdmlzaXRlZC5oYXMoY3VyKSkge1xuICAgIHZpc2l0ZWQuYWRkKGN1cik7XG4gICAgY2hhaW4ucHVzaChjdXIpO1xuICAgIGN1ciA9IGdldExpbmtzKGN1cilbMF07XG4gIH1cblxuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoY3VycmVudFBhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgY2hhaW4sIGluZGV4IH07XG59XG5cbi8qKlxuICogV2FsayB0aGUgY2hhaW4gZm9yd2FyZCBmcm9tIGEga25vd24gaGVhZCBhbmQgbG9jYXRlIGBjdXJyZW50UGF0aGAgaW4gaXQuXG4gKlxuICogYGNvbXB1dGVEZWNrKClgIGZpbmRzIHRoZSBoZWFkIGl0c2VsZiwgd2hpY2ggaXMgYW1iaWd1b3VzIHdoZW4gc2V2ZXJhbCBzbGlkZXNcbiAqIGRlY2xhcmUgdGhlIHNhbWUgbmV4dCBzbGlkZTsgdGFraW5nIHRoZSBoZWFkIGFzIGdpdmVuIGlzIHdoYXQgbGV0cyBhXG4gKiBuYXZpZ2F0aW9uIHNlc3Npb24ga2VlcCB0aGUgY2hhaW4gaXQgZW50ZXJlZC4gVGhlIHdhbGsgaXMgYWx3YXlzIGxpdmUgXHUyMDE0IHRoZVxuICogbGlua3MgY29tZSBmcm9tIHRoZSB2YXVsdCBvbiBldmVyeSBjYWxsIFx1MjAxNCBzbyBzbGlkZXMgY3JlYXRlZCwgZGVsZXRlZCBvclxuICogcmVuYW1lZCBtZWFud2hpbGUgYXJlIHJlZmxlY3RlZCwgYW5kIGEgaGVhZCB0aGF0IG5vIGxvbmdlciByZWFjaGVzXG4gKiBgY3VycmVudFBhdGhgIHNpbXBseSB5aWVsZHMgbnVsbCAodGhlIGNhbGxlciBmYWxscyBiYWNrIHRvIGBjb21wdXRlRGVjaygpYCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNrRnJvbUhlYWQoXG4gIGhlYWQ6IHN0cmluZyxcbiAgY3VycmVudFBhdGg6IHN0cmluZyxcbiAgZ2V0TGlua3M6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZ1tdLFxuKTogRGVja0luZm8gfCBudWxsIHtcbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgbGV0IGN1cjogc3RyaW5nIHwgdW5kZWZpbmVkID0gaGVhZDtcbiAgd2hpbGUgKGN1ciAmJiAhdmlzaXRlZC5oYXMoY3VyKSkge1xuICAgIHZpc2l0ZWQuYWRkKGN1cik7XG4gICAgY2hhaW4ucHVzaChjdXIpO1xuICAgIGN1ciA9IGdldExpbmtzKGN1cilbMF07XG4gIH1cblxuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoY3VycmVudFBhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgY2hhaW4sIGluZGV4IH07XG59XG5cbi8qKlxuICogRXh0cmFjdCB1cCB0byBgbWF4YCBub3RlIG5hbWVzIGZyb20gYSBgZGVja2AgcHJvcGVydHkgdmFsdWUuXG4gKiBBY2NlcHRzIGEgc2luZ2xlIHN0cmluZyBvciBhIFlBTUwgbGlzdCBvZiBzdHJpbmdzOyB1bnF1b3RlZCBbW3hdXSB2YWx1ZXNcbiAqIGFyZSBwYXJzZWQgYnkgWUFNTCBhcyBuZXN0ZWQgYXJyYXlzIGFuZCBmbGF0dGVuZWQgaGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGNvbnN0IG5hbWUgPSBleHRyYWN0TGlua1RleHQoaXRlbSk7XG4gICAgaWYgKG5hbWUpIG91dC5wdXNoKG5hbWUpO1xuICAgIGlmIChvdXQubGVuZ3RoID49IG1heCkgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIHJhdyBsaW5rIHN0cmluZ3MgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZSBcdTIwMTQgdGhlXG4gKiB0cmltbWVkIHZhbHVlcyBleGFjdGx5IGFzIHdyaXR0ZW4gKGFsaWFzIC8gcGF0aCBmb3JtcyBwcmVzZXJ2ZWQpLiBTYW1lXG4gKiBmbGF0dGVuaW5nIHJ1bGVzIGFzIGV4dHJhY3RMaW5rcygpLCBidXQgd2l0aG91dCBleHRyYWN0aW5nIHRoZSB0YXJnZXQgbmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RSYXdMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gXCJzdHJpbmdcIikgY29udGludWU7XG4gICAgY29uc3QgdHJpbW1lZCA9IGl0ZW0udHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgY29udGludWU7XG4gICAgb3V0LnB1c2godHJpbW1lZCk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdGhlIHRhcmdldCBub3RlIG5hbWUgZnJvbSBhIG1hcmtkb3duIGxpbmsgc3RyaW5nLlxuICogSGFuZGxlcyBzZXZlcmFsIHNoYXBlczpcbiAqICAgXCJbW3NsaWRlLTJdXVwiICAgICAgICBcdTIxOTIgc2xpZGUtMlxuICogICBcIltbc2xpZGUtMnxhbGlhc11dXCIgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yI3NlY3Rpb25dXVwiXHUyMTkyIHNsaWRlLTJcbiAqICAgc2xpZGUtMiAgICAgICAgICAgICAgXHUyMTkyIHNsaWRlLTIgKGJhcmUgZmlsZW5hbWUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0TGlua1RleHQodmFsdWU6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKCk7XG4gIGlmICghdHJpbW1lZCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB0cmltbWVkLnJlcGxhY2UoL15cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnNwbGl0KFwiI1wiKVswXS50cmltKCk7XG59XG5cbi8qKiBSZW5kZXIgYSBwcm9wZXJ0eSB2YWx1ZSBhcyByZWFkYWJsZSB0ZXh0OiBhcnJheXMvb2JqZWN0cyBcdTIxOTIgSlNPTiwgZWxzZSBTdHJpbmcgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcdTIwMTRcIjtcbiAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKSA/PyBcIlx1MjAxNFwiO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGNpcmN1bGFyIC8gdW4tc3RyaW5naWZpYWJsZSBzdHJ1Y3R1cmUgXHUyMDE0IG5vdCBleHBlY3RlZCBmcm9tIGZyb250bWF0dGVyXG4gICAgICAgIHJldHVybiBcIlx1MjAxNFwiO1xuICAgICAgfVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBzeW1ib2wgLyBmdW5jdGlvbiBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGNyZWF0ZU5leHQudHMgXHUyMDE0IFB1cmUgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIC8gXCJDcmVhdGUgTmV3IFNsaWRlXCIgcGxhbm5pbmdcbiAqIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRXZlcnl0aGluZyBpbiB0aGlzIG1vZHVsZSBpcyBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0XG4gKiBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L2NyZWF0ZU5leHQudGVzdC50cykuIG1haW4udHMgYWRhcHRzXG4gKiB0aGUgdmF1bHQgKG1ldGFkYXRhQ2FjaGUsIGNvbXB1dGVEZWNrKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlIGFuZCBhcHBsaWVzXG4gKiB0aGUgcmVzdWx0aW5nIHBsYW4gd2l0aCB2YXVsdC5jcmVhdGUoKSArIGZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcigpLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6IGEgc2xpZGUncyBgZGVja2BcbiAqIHByb3BlcnR5IGhvbGRzIGF0IG1vc3QgT05FIGxpbmsgKGl0cyBuZXh0IHNsaWRlKS4gcGxhbkNyZWF0ZU5leHQgZGVjaWRlcyxcbiAqIGZvciB0aGUgY3VycmVudCBkZWNrIG5vdGU6XG4gKiAgIC0gdGhlIG5hbWUgb2YgdGhlIG5ldyBzbGlkZSBmaWxlIChjb2xsaXNpb24tYXdhcmUpLFxuICogICAtIHRoZSByYXcgYGRlY2tgIGxpbmsgdGV4dHMgb2YgdGhlIG5ldyBub3RlLFxuICogICAtIHRoZSByZXdyaXRlcyBuZWVkZWQgb24gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGVcbiAqICAgICBjdXJyZW50IG5vdGUpLlxuICogcGxhbkNyZWF0ZU5ldyBwbGFucyBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZSAoYSBmcmVzaCBub3RlIHRoYXQgaXNcbiAqIG5vdCBwYXJ0IG9mIGFueSBkZWNrIHlldCBcdTIwMTQgYGRlY2s6IFtdYCwgbm8gcmV3cml0ZXMgYW55d2hlcmUpLlxuICogcGxhbk1ha2VGaXJzdFNsaWRlIHBsYW5zIHRoZSBpbnZlcnNlOiBwcm9tb3RpbmcgYW4gZXhpc3RpbmcgcGxhaW4gbm90ZVxuICogaW50byB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrIChgZGVjazogW11gIHdyaXR0ZW4gb250byB0aGUgbm90ZVxuICogaXRzZWxmLCBub3RoaW5nIGNyZWF0ZWQgb3IgcmV3cml0dGVuKS5cbiAqL1xuXG5pbXBvcnQgeyBleHRyYWN0TGlua1RleHQgfSBmcm9tIFwiLi9kZWNrXCI7XG5cbi8qKiBJbnB1dHMgZm9yIHBsYW5uaW5nIFx1MjAxNCByZXNvbHZlZCBieSB0aGUgYWRhcHRlciBpbiBtYWluLnRzICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRJbnB1dCB7XG4gIC8qKiBCYXNlbmFtZSAod2l0aG91dCBleHRlbnNpb24pIG9mIHRoZSBjdXJyZW50IG5vdGUgKi9cbiAgY3VycmVudE5hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgY3VycmVudCBub3RlIChleHRyYWN0ZWQsIGF0IG1vc3Qgb25lKSAqL1xuICBjdXJyZW50TGlua3M6IHN0cmluZ1tdO1xuICAvKiogQmFzZW5hbWVzIG9mIGV2ZXJ5IG1hcmtkb3duIG5vdGUgaW4gdGhlIHZhdWx0IChjb2xsaXNpb24tZnJlZSBuYW1pbmcpICovXG4gIGV4aXN0aW5nTmFtZXM6IFNldDxzdHJpbmc+O1xufVxuXG4vKiogT25lIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tSZXdyaXRlIHtcbiAgLyoqIEJhc2VuYW1lIG9mIHRoZSBub3RlIHRvIHJld3JpdGUgKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogVGhlIG5ldyByYXcgYGRlY2tgIGxpbmsgdGV4dHMgKHNlcmlhbGl6ZWQgYXMgYSBZQU1MIGxpc3QpICovXG4gIGRlY2s6IHN0cmluZ1tdO1xufVxuXG4vKiogVGhlIGZ1bGwgcGxhbiBmb3IgY3JlYXRpbmcgb25lIG5ldyBzbGlkZSAqL1xuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVOZXh0UmVzdWx0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIG5ldyBzbGlkZSBmaWxlICovXG4gIG5ld05hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBmb3IgdGhlIG5ldyBub3RlJ3MgZnJvbnRtYXR0ZXIgKi9cbiAgbmV3RGVja0xpbmtzOiBzdHJpbmdbXTtcbiAgLyoqIFJld3JpdGVzIHRvIGFwcGx5IHRvIGV4aXN0aW5nIG5vdGVzIChpbiBwcmFjdGljZSBhbHdheXMgdGhlIGN1cnJlbnQgbm90ZSkgKi9cbiAgcmV3cml0ZXM6IERlY2tSZXdyaXRlW107XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBuZXcgc2xpZGUgYWZ0ZXIgdGhlIGN1cnJlbnQgbm90ZS5cbiAqXG4gKiBCZWhhdmlvcnM6XG4gKiAgIC0gTm8gbmV4dCBsaW5rIChsYXN0IHNsaWRlLCBmcmVzaCBkZWNrIGhlYWQsIG9yIGEgcGxhaW4gbm90ZSBzdGFydGluZ1xuICogICAgIGEgYnJhbmQtbmV3IGRlY2spOiBhcHBlbmQgYDxjdXJyZW50Pi1uZXh0YCBhcyB0aGUgbmV3IGxhc3Qgc2xpZGU7IHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCBnYWlucyB0aGUgbGluayB0byBpdC5cbiAqICAgLSBWYWxpZCBuZXh0IGxpbms6IGluc2VydCBgPGN1cnJlbnQ+LW5leHRgIGJldHdlZW4gdGhlIGN1cnJlbnQgbm90ZSBhbmRcbiAqICAgICBpdHMgbmV4dDsgdGhlIG5ldyBub3RlIHRha2VzIG92ZXIgdGhlIG9sZCBuZXh0IGxpbmsuXG4gKiAgIC0gQnJva2VuIG5leHQgbGluayAocGxhaW4sIG5vbi1leGlzdGluZyBuYW1lKTogY3JlYXRlIGV4YWN0bHkgdGhlXG4gKiAgICAgZGVjbGFyZWQgbWlzc2luZyBub3RlIGFzIHRoZSBuZXcgbmV4dCBzbGlkZSBcdTIwMTQgdGhlIFx1MjZBMCB3YXJuaW5nXG4gKiAgICAgZGlzYXBwZWFycyBhbmQgdGhlIGF1dGhvcidzIGludGVudCBpcyBob25vdXJlZC4gQSBicm9rZW4gbGluayB0aGF0IGlzXG4gKiAgICAgbm90IGEgcGxhaW4gYmFzZW5hbWUgKHBhdGgtcXVhbGlmaWVkLCBzZWxmLXJlZmVyZW5jaW5nKSBpcyB0cmVhdGVkIGFzXG4gKiAgICAgaW52YWxpZCBhbmQgZHJvcHBlZCAoYXBwZW5kIGEgYDxjdXJyZW50Pi1uZXh0YCBsYXN0IHNsaWRlIGluc3RlYWQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5leHQoaW5wdXQ6IENyZWF0ZU5leHRJbnB1dCk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgY29uc3QgeyBjdXJyZW50TmFtZSwgY3VycmVudExpbmtzIH0gPSBpbnB1dDtcbiAgY29uc3QgbmV4dExpbmsgPSBjdXJyZW50TGlua3NbMF07XG5cbiAgaWYgKG5leHRMaW5rKSB7XG4gICAgY29uc3QgbmV4dE5hbWUgPSBleHRyYWN0TGlua1RleHQobmV4dExpbmspO1xuICAgIGlmIChuZXh0TmFtZSAmJiBpc1BsYWluTmFtZShuZXh0TmFtZSkgJiYgbmV4dE5hbWUgIT09IGN1cnJlbnROYW1lKSB7XG4gICAgICBpZiAoIWlucHV0LmV4aXN0aW5nTmFtZXMuaGFzKG5leHROYW1lKSkge1xuICAgICAgICAvLyBUaGUgZGVjbGFyZWQgbmV4dCBub3RlIGRvZXMgbm90IGV4aXN0IHlldCBcdTIxOTIgY3JlYXRlIGV4YWN0bHkgdGhhdFxuICAgICAgICAvLyBub3RlIChmaXhlcyB0aGUgYnJva2VuLWxpbmsgd2FybmluZywgaG9ub3VycyB0aGUgYXV0aG9yJ3MgaW50ZW50KS5cbiAgICAgICAgcmV0dXJuIHsgbmV3TmFtZTogbmV4dE5hbWUsIG5ld0RlY2tMaW5rczogW10sIHJld3JpdGVzOiBbXSB9O1xuICAgICAgfVxuICAgICAgLy8gQSB2YWxpZCBuZXh0IG5vdGUgZXhpc3RzIFx1MjE5MiBpbnNlcnQgYmV0d2VlbiBpdCBhbmQgdGhlIGN1cnJlbnQgbm90ZS5cbiAgICAgIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXdOYW1lLFxuICAgICAgICBuZXdEZWNrTGlua3M6IFtuZXh0TGlua10sXG4gICAgICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gSW52YWxpZCAocGF0aC1xdWFsaWZpZWQgLyBzZWxmLXJlZmVyZW5jaW5nKSBuZXh0IGxpbmsgXHUyMTkyIGRyb3AgaXQgYW5kXG4gICAgLy8gYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgKGZhbGwgdGhyb3VnaCB0byB0aGUgbm8tbmV4dCBicmFuY2gpLlxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE5vICh1c2FibGUpIG5leHQgbGluayBcdTIxOTIgYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICB9O1xufVxuXG4vKipcbiAqIFBsYW4gdGhlIGNyZWF0aW9uIG9mIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlLlxuICpcbiAqIFRoZSBuZXcgbm90ZSBzdGFydHMgYXMgYSBzaW5nbGUtc2xpZGUgZGVjayAoYGRlY2s6IFtdYCkgYW5kIG5vdGhpbmcgZWxzZVxuICogaXMgdG91Y2hlZCBcdTIwMTQgdGhlIG5vdGUgaXQgd2FzIGxhdW5jaGVkIGZyb20gc3RheXMgYXMtaXMuIExhdGVyIHBhZ2VzIGFyZVxuICogYWRkZWQgd2l0aCBDcmVhdGUgTmV4dCBTbGlkZSBmcm9tIGluc2lkZSB0aGUgZGVjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5DcmVhdGVOZXcoaW5wdXQ6IHsgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz4gfSk6IENyZWF0ZU5leHRSZXN1bHQge1xuICByZXR1cm4ge1xuICAgIG5ld05hbWU6IHVuaXF1ZU5hbWUoXCJ1bnRpdGxlZC1zbGlkZXNcIiwgaW5wdXQuZXhpc3RpbmdOYW1lcyksXG4gICAgbmV3RGVja0xpbmtzOiBbXSxcbiAgICByZXdyaXRlczogW10sXG4gIH07XG59XG5cbi8qKiBBIG5vdGUgcHJvbW90ZWQgaW50byB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrICovXG5leHBvcnQgaW50ZXJmYWNlIE1ha2VGaXJzdFNsaWRlUGxhbiB7XG4gIC8qKiBSYXcgYGRlY2tgIGxpbmsgdGV4dHMgZm9yIHRoZSBub3RlJ3MgZnJvbnRtYXR0ZXIgKGFsd2F5cyBlbXB0eSBcdTIwMTQgYSBzaW5nbGUtc2xpZGUgZGVjaykgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKlxuICogUGxhbiBhIFwiTWFrZSB0aGlzIG5vdGUgdGhlIGZpcnN0IHNsaWRlXCIgcnVuIFx1MjAxNCBwcm9tb3RlIHRoZSBhY3RpdmUgbm90ZVxuICogaW50byB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrOiBpdHMgY29udGVudCwgdGl0bGUgYW5kIGxvY2F0aW9uIHN0YXlcbiAqIHVudG91Y2hlZCwgYW5kIHRoZSBmcm9udG1hdHRlciBnYWlucyBgZGVjazogW11gIChhIHNpbmdsZS1zbGlkZSBkZWNrLFxuICogdGhlIHN0YW5kYXJkIFwibGFzdCBzbGlkZVwiIC8gc29sbyBtYXJrZXIpLiBObyByZXdyaXRlcyBhbnl3aGVyZSBcdTIwMTQgbGF0ZXJcbiAqIHBhZ2VzIGFyZSBhZGRlZCB3aXRoIENyZWF0ZSBOZXh0IFNsaWRlIGZyb20gaW5zaWRlIHRoZSBkZWNrLlxuICpcbiAqIE5vdGVzIHRoYXQgYWxyZWFkeSBiZWxvbmcgdG8gYSBkZWNrIChob2xkIGEgYGRlY2tgIHByb3BlcnR5LCBvciBhcmVcbiAqIGRlY2xhcmVkIGFzIGFub3RoZXIgc2xpZGUncyBuZXh0KSBhcmUgTk9UIHRvdWNoZWQ6IHRoZSBwbGFuIGlzIG51bGwgYW5kXG4gKiB0aGUgY29tbWFuZCBuby1vcHMgd2l0aCBhIE5vdGljZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5NYWtlRmlyc3RTbGlkZShpbnB1dDogeyBhbHJlYWR5RGVjazogYm9vbGVhbiB9KTogTWFrZUZpcnN0U2xpZGVQbGFuIHwgbnVsbCB7XG4gIGlmIChpbnB1dC5hbHJlYWR5RGVjaykgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7IGRlY2s6IFtdIH07XG59XG5cbi8qKiBBIG5hbWUgdXNhYmxlIGFzIGEgdmF1bHQgbm90ZSBuYW1lOiBubyBwYXRoIHNlcGFyYXRvcnMsIG5vbi1lbXB0eSAqL1xuZnVuY3Rpb24gaXNQbGFpbk5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBuYW1lLmxlbmd0aCA+IDAgJiYgIW5hbWUuaW5jbHVkZXMoXCIvXCIpICYmICFuYW1lLmluY2x1ZGVzKFwiXFxcXFwiKTtcbn1cblxuLyoqIEZpcnN0IGZyZWUgbmFtZSBpbiB0aGUgZmFtaWx5IGBiYXNlYCwgYGJhc2UtMmAsIGBiYXNlLTNgLCBcdTIwMjYgKi9cbmZ1bmN0aW9uIHVuaXF1ZU5hbWUoYmFzZTogc3RyaW5nLCBleGlzdGluZzogU2V0PHN0cmluZz4pOiBzdHJpbmcge1xuICBpZiAoIWV4aXN0aW5nLmhhcyhiYXNlKSkgcmV0dXJuIGJhc2U7XG4gIGZvciAobGV0IGkgPSAyOyA7IGkrKykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2Jhc2V9LSR7aX1gO1xuICAgIGlmICghZXhpc3RpbmcuaGFzKGNhbmRpZGF0ZSkpIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGRlbGV0ZVNsaWRlcy50cyBcdTIwMTQgUHVyZSBcIkRlbGV0ZSBzbGlkZXNcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXQgY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5XG4gKiAoc2VlIHRlc3QvZGVsZXRlU2xpZGVzLnRlc3QudHMpLiBUaGUgYWRhcHRlciBpbiBkZWNrLXNlcnZpY2UudHMgYXBwbGllc1xuICogdGhlIHBsYW46IGl0IHJld3JpdGVzIHRoZSBzdXJ2aXZpbmcgbm90ZXMnIGBkZWNrYCBwcm9wZXJ0aWVzLCB0aGVuIG1vdmVzXG4gKiB0aGUgZGVsZXRlZCBub3RlcyB0byB0aGUgdHJhc2guXG4gKlxuICogRGVsZXRpb24gc3BsaWNlcyB0aGUgY2hhaW4gaW5zdGVhZCBvZiBicmVha2luZyBpdDogZXZlcnkgbWF4aW1hbCBydW4gb2ZcbiAqIGRlbGV0ZWQgc2xpZGVzIGJldHdlZW4gdHdvIHN1cnZpdm9ycyBBIFx1MjE5MiBcdTIwMjYgXHUyMTkyIEIgaXMgcmVwYWlyZWQgYnkgcG9pbnRpbmdcbiAqIEEncyBgZGVja2AgbGluayBhdCBCIChgW11gIHdoZW4gdGhlIHJ1biByZWFjaGVzIHRoZSBlbmQgb2YgdGhlIGNoYWluKS5cbiAqIFdoZW4gYSBydW4gc3RhcnRzIGF0IHRoZSBjaGFpbiBoZWFkLCB0aGUgZmlyc3Qgc3Vydml2b3IgYmVjb21lcyB0aGUgbmV3XG4gKiBoZWFkIGFuZCBuZWVkcyBubyByZXdyaXRlIGF0IGFsbCAoaXRzIG93biBgZGVja2AgYWxyZWFkeSBwb2ludHMgb253YXJkKS5cbiAqL1xuXG4vKiogT25lIHN1cnZpdmluZyBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBtdXN0IGJlIHJld3JpdHRlbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVSZXdyaXRlIHtcbiAgLyoqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBwYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBWYXVsdCBwYXRoIG9mIHRoZSBub3RlIHRoYXQgc2hvdWxkIGJlY29tZSB0aGlzIG5vdGUncyBuZXh0IHNsaWRlLFxuICAgKiBvciBudWxsIHdoZW4gdGhlIG5vdGUgYmVjb21lcyB0aGUgbmV3IGxhc3Qgc2xpZGUgKGBkZWNrOiBbXWApLlxuICAgKi9cbiAgbmV4dFBhdGg6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKlxuICogUGxhbiB0aGUgZGVsZXRpb24gb2Ygc2xpZGVzIGZyb20gYW4gb3JkZXJlZCBkZWNrIGNoYWluLlxuICpcbiAqIGBjaGFpbmAgaXMgdGhlIGZ1bGwgc2xpZGUgb3JkZXIgKFswXSA9IGhlYWQpLiBPbmx5IHBhdGhzIHByZXNlbnQgaW4gdGhlXG4gKiBjaGFpbiBhcmUgY29uc2lkZXJlZDsgYW55dGhpbmcgZWxzZSBpbiBgZGVsZXRlUGF0aHNgIGlzIGlnbm9yZWQuIFJldHVybnNcbiAqIG9uZSByZXdyaXRlIHBlciBzdXJ2aXZpbmcgbm90ZSB0aGF0IGRpcmVjdGx5IHByZWNlZGVkIGEgZGVsZXRlZCBydW4sXG4gKiBvcmRlcmVkIGJ5IGNoYWluIHBvc2l0aW9uLiBEZWxldGluZyBub3RoaW5nIHlpZWxkcyBubyByZXdyaXRlczsgZGVsZXRpbmdcbiAqIGV2ZXJ5dGhpbmcgeWllbGRzIG5vIHJld3JpdGVzIGVpdGhlciAobm8gc3Vydml2b3JzIGxlZnQgdG8gcmVwYWlyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5EZWxldGVTbGlkZXMoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4pOiBEZWxldGVSZXdyaXRlW10ge1xuICBjb25zdCByZXdyaXRlczogRGVsZXRlUmV3cml0ZVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXRoID0gY2hhaW5baV07XG4gICAgaWYgKCFwYXRoIHx8IGRlbGV0ZVBhdGhzLmhhcyhwYXRoKSkgY29udGludWU7XG4gICAgLy8gRmluZCB0aGUgZmlyc3Qgc3Vydml2b3IgYWZ0ZXIgdGhpcyBub3RlJ3MgcG9zaXRpb24uXG4gICAgbGV0IGogPSBpICsgMTtcbiAgICB3aGlsZSAoaiA8IGNoYWluLmxlbmd0aCAmJiBkZWxldGVQYXRocy5oYXMoY2hhaW5bal0pKSBqKys7XG4gICAgY29uc3QgbmV4dFBhdGggPSBqIDwgY2hhaW4ubGVuZ3RoID8gY2hhaW5bal0gOiBudWxsO1xuICAgIGNvbnN0IGNoYW5nZWQgPSBuZXh0UGF0aCAhPT0gKGNoYWluW2kgKyAxXSA/PyBudWxsKTtcbiAgICBpZiAoY2hhbmdlZCkgcmV3cml0ZXMucHVzaCh7IHBhdGgsIG5leHRQYXRoIH0pO1xuICB9XG4gIHJldHVybiByZXdyaXRlcztcbn1cblxuLyoqXG4gKiBQaWNrIHdoZXJlIHRoZSBlZGl0b3Igc2hvdWxkIGxhbmQgYWZ0ZXIgZGVsZXRpbmcgc2xpZGVzOiB0aGUgbmVhcmVzdFxuICogc3Vydml2b3Igb2YgYGRlbGV0ZWRQYXRoc2AnIG5laWdoYm91cmhvb2QgYXJvdW5kIGBmb2N1c1BhdGhgIFx1MjAxNCBwcmVmZXJcbiAqIHRoZSBjbG9zZXN0IHN1cnZpdm9yIGFmdGVyIGl0LCBlbHNlIHRoZSBjbG9zZXN0IGJlZm9yZSBpdC4gUmV0dXJucyBudWxsXG4gKiB3aGVuIGBmb2N1c1BhdGhgIHN1cnZpdmVzIG9yIG5vdGhpbmcgbmVhcmJ5IHJlbWFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrTGFuZGluZ1BhdGgoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIWZvY3VzUGF0aCB8fCAhZGVsZXRlUGF0aHMuaGFzKGZvY3VzUGF0aCkpIHJldHVybiBudWxsO1xuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoZm9jdXNQYXRoKTtcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG4gIGZvciAobGV0IGkgPSBpbmRleCArIDE7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGlmICghZGVsZXRlUGF0aHMuaGFzKGNoYWluW2ldKSkgcmV0dXJuIGNoYWluW2ldO1xuICB9XG4gIGZvciAobGV0IGkgPSBpbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiLyoqXG4gKiBuYXYudHMgXHUyMDE0IFB1cmUgbmF2aWdhdGlvbiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIFR3byBydWxlcyBsaXZlIGhlcmUsIGJvdGggZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyB0aGV5IGNhblxuICogYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L25hdi50ZXN0LnRzKTpcbiAqXG4gKiAgIDEuIEEgcHJlc3Mgc3RlcHMgZnJvbSB0aGUgKnByZXZpb3VzIHByZXNzJ3MgdGFyZ2V0Kiwgbm90IGZyb20gdGhlIG5vdGUgdGhlXG4gKiAgICAgIGVkaXRvciBoYXBwZW5zIHRvIHNob3cuIFdpdGhvdXQgdGhpcywgZXZlcnkgcHJlc3MgaW4gYSBidXJzdCByZXNvbHZlcyB0b1xuICogICAgICB0aGUgc2FtZSBuZXh0IHNsaWRlIGFuZCBhbGwgYnV0IG9uZSBhcmUgc3dhbGxvd2VkIChpc3N1ZSAjMTEwKS5cbiAqICAgMi4gQSBzZXNzaW9uIGtlZXBzIHRoZSBjaGFpbiAqaGVhZCogaXQgZW50ZXJlZCB3aGlsZSB0aGF0IGhlYWQgc3RpbGwgcmVhY2hlc1xuICogICAgICB0aGUgbm90ZSBpbiB0aGUgZWRpdG9yLiBUaGUgaGVhZCBpcyBhIGhpbnQsIG5vdCBhIGNhY2hlZCBjaGFpbjogdGhlIGNoYWluXG4gKiAgICAgIGlzIHdhbGtlZCBsaXZlIG9uIGV2ZXJ5IHJlc29sdXRpb24sIHNvIHNsaWRlcyBjcmVhdGVkLCBkZWxldGVkIG9yIHJlbmFtZWRcbiAqICAgICAgbWVhbndoaWxlIGFyZSBob25vdXJlZCAoYGRlY2tGcm9tSGVhZCgpYCksIGFuZCBhIGhpbnQgdGhhdCBubyBsb25nZXIgbGVhZHNcbiAqICAgICAgdG8gdGhlIGN1cnJlbnQgbm90ZSBpcyBpZ25vcmVkLiBSZS1yZXNvbHZpbmcgdGhlIGhlYWQgb24gZXZlcnkgc3RlcCBpcyB3aGF0XG4gKiAgICAgIHVzZWQgdG8gbGV0IGEgc2hhcmVkIGBkZWNrYCBsaW5rIFx1MjAxNCB0d28gc2xpZGVzIGRlY2xhcmluZyB0aGUgc2FtZSBuZXh0XG4gKiAgICAgIHNsaWRlIFx1MjAxNCBzd2FwIHRoZSBjaGFpbiB1bmRlciB0aGUgcmVhZGVyIChpc3N1ZSAjMTEwKS5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7IERlY2tJbmZvIH0gZnJvbSBcIi4vZGVja1wiO1xuXG4vKiogT25lIHF1ZXVlZCBuYXZpZ2F0aW9uIHJlcXVlc3Q6IGEgZGlyZWN0aW9uLCBvciBhbiBhYnNvbHV0ZSBjaGFpbiBpbmRleCAqL1xuZXhwb3J0IHR5cGUgTmF2SW50ZW50ID0geyBkaXI6IFwicHJldlwiIHwgXCJuZXh0XCIgfSB8IHsgaW5kZXg6IG51bWJlciB9O1xuXG4vKipcbiAqIERlY2sgcmVzb2x1dGlvbiBpbnNpZGUgYSBuYXZpZ2F0aW9uIHNlc3Npb246IHdhbGsgbGl2ZSBmcm9tIHRoZSBzZXNzaW9uJ3MgaGVhZFxuICogaGludCB3aGVuIGl0IHN0aWxsIHJlYWNoZXMgYGFuY2hvclBhdGhgLCBhbmQgZmFsbCBiYWNrIHRvIGEgZnJlc2ggcmVzb2x1dGlvblxuICogKGBjb21wdXRlYCwgd2hpY2ggZmluZHMgaXRzIG93biBoZWFkKSBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXNzaW9uRGVjayhcbiAgaGVhZDogc3RyaW5nIHwgbnVsbCxcbiAgYW5jaG9yUGF0aDogc3RyaW5nIHwgbnVsbCxcbiAgZnJvbUhlYWQ6IChoZWFkOiBzdHJpbmcsIHBhdGg6IHN0cmluZykgPT4gRGVja0luZm8gfCBudWxsLFxuICBjb21wdXRlOiAocGF0aDogc3RyaW5nKSA9PiBEZWNrSW5mbyB8IG51bGwsXG4pOiBEZWNrSW5mbyB8IG51bGwge1xuICBpZiAoIWFuY2hvclBhdGgpIHJldHVybiBudWxsO1xuICBpZiAoaGVhZCkge1xuICAgIGNvbnN0IGRlY2sgPSBmcm9tSGVhZChoZWFkLCBhbmNob3JQYXRoKTtcbiAgICBpZiAoZGVjaykgcmV0dXJuIGRlY2s7XG4gIH1cbiAgcmV0dXJuIGNvbXB1dGUoYW5jaG9yUGF0aCk7XG59XG5cbi8qKlxuICogVGFyZ2V0IG9mIG9uZSBpbnRlbnQgaW5zaWRlIGEgcmVzb2x2ZWQgZGVjaywgb3IgbnVsbCB3aGVuIGl0IHdvdWxkIGxlYXZlIHRoZVxuICogZGVjayBcdTIwMTQgdGhlIGZpcnN0IHNsaWRlIGhhcyBubyBwcmV2aW91cyBwYWdlLCB0aGUgbGFzdCBzbGlkZSBoYXMgbm8gbmV4dCBwYWdlLFxuICogYW5kIGEganVtcCB0byB0aGUgY3VycmVudCBpbmRleCBpcyBhIG5vLW9wLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RlcFRhcmdldChkZWNrOiBEZWNrSW5mbywgaW50ZW50OiBOYXZJbnRlbnQpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgaW5kZXggPVxuICAgIFwiaW5kZXhcIiBpbiBpbnRlbnQgPyBpbnRlbnQuaW5kZXggOiBpbnRlbnQuZGlyID09PSBcInByZXZcIiA/IGRlY2suaW5kZXggLSAxIDogZGVjay5pbmRleCArIDE7XG4gIGlmIChpbmRleCA9PT0gZGVjay5pbmRleCB8fCBpbmRleCA8IDAgfHwgaW5kZXggPj0gZGVjay5jaGFpbi5sZW5ndGgpIHJldHVybiBudWxsO1xuICByZXR1cm4gZGVjay5jaGFpbltpbmRleF0gPz8gbnVsbDtcbn1cblxuLyoqIFdoYXQgdGhlIHNlc3Npb24gbmVlZHMgZnJvbSB0aGUgZWRpdG9yLCBpbmplY3RlZCBzbyB0aGUgcXVldWUgc3RheXMgdGVzdGFibGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmF2SG9va3Mge1xuICAvKiogTGl2ZSBkZWNrIGZvciBgcGF0aGAsIGhvbm91cmluZyB0aGUgc2Vzc2lvbidzIGhlYWQgaGludCAqL1xuICByZXNvbHZlOiAocGF0aDogc3RyaW5nLCBoZWFkOiBzdHJpbmcgfCBudWxsKSA9PiBEZWNrSW5mbyB8IG51bGw7XG4gIC8qKiBPcGVuIGB0YXJnZXRgICh0aGUgcHJvbWlzZSByZXNvbHZpbmcgb25jZSB0aGUgZWRpdG9yIHN3aXRjaGVkIHRvIGl0KSAqL1xuICBvcGVuOiAodGFyZ2V0OiBzdHJpbmcsIGZyb206IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIFRoZSBub3RlIGluIHRoZSBlZGl0b3IsIHVzZWQgYXMgdGhlIGFuY2hvciB3aGVuIHRoZSBzZXNzaW9uIGhhcyBub25lICovXG4gIGFjdGl2ZVBhdGg6ICgpID0+IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKlxuICogVGhlIHF1ZXVlIGJlaGluZCBwcmV2IC8gbmV4dCAvIGp1bXAuIFByZXNzZXMgYXJlIGFwcGxpZWQgb25lIGF3YWl0ZWQgb3BlbiBhdCBhXG4gKiB0aW1lIHNvIGEgYnVyc3QgYWR2YW5jZXMgb25lIHNsaWRlIHBlciBwcmVzcywgYW5kIGVhY2ggc3RlcCBpcyBhbmNob3JlZCBvbiB0aGVcbiAqIHByZXZpb3VzIHN0ZXAncyB0YXJnZXQgcmF0aGVyIHRoYW4gb24gdGhlIG5vdGUgdGhlIGVkaXRvciBzdGlsbCBzaG93cy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5hdlNlc3Npb24ge1xuICBwcml2YXRlIHF1ZXVlOiBOYXZJbnRlbnRbXSA9IFtdO1xuICBwcml2YXRlIHJ1bm5pbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBwZW5kaW5nOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBoZWFkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGhvb2tzOiBOYXZIb29rcykge31cblxuICAvKiogVGhlIGNoYWluIGhlYWQgdGhpcyBzZXNzaW9uIGVudGVyZWQsIG9yIG51bGwgYmVmb3JlIGl0cyBmaXJzdCBzdGVwICovXG4gIGdldCByZW1lbWJlcmVkSGVhZCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5oZWFkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlLWJhc2UgdGhlIHNlc3Npb24gb24gYSBkaWZmZXJlbnQgY2hhaW4gaGVhZC4gQSBtb3ZlIHJld2lyZXMgdGhlIGRlY2tcbiAgICogYXJvdW5kIHRoZSBzZXNzaW9uLCBzbyB0aGUgaGVhZCBpdCBlbnRlcmVkIG1heSBubyBsb25nZXIgYmUgdGhlIGRlY2snc1xuICAgKiBoZWFkIChhbmQsIHN0aWxsIHJlYWNoaW5nIHRoZSBjdXJyZW50IG5vdGUsIHdvdWxkIHdhbGsgYSB0cnVuY2F0ZWQgY2hhaW5cbiAgICogZnJvbSB0aGUgbWlkZGxlKTsgdGhlIGNhbGxlciBoYW5kcyBvdmVyIHRoZSBuZXcgY2hhaW4ncyBvd24gaGVhZC5cbiAgICovXG4gIHNldEhlYWQoaGVhZDogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuaGVhZCA9IGhlYWQ7XG4gIH1cblxuICAvKiogUXVldWUgYSBwcmVzczsgdGhlIGZpcnN0IG9uZSBzdGFydHMgdGhlIGRyYWluLiBSZXNvbHZlcyBvbmNlIHRoZSBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgcHVzaChpbnRlbnQ6IE5hdkludGVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMucXVldWUucHVzaChpbnRlbnQpO1xuICAgIGlmICh0aGlzLnJ1bm5pbmcpIHJldHVybiB0aGlzLmRyYWluaW5nID8/IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHRoaXMuZHJhaW5pbmcgPSB0aGlzLmRyYWluKCkuY2F0Y2goKGVycm9yOiB1bmtub3duKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwibmF0aXZlLXNsaWRlczogbmF2aWdhdGlvbiBmYWlsZWRcIiwgZXJyb3IpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmRyYWluaW5nO1xuICB9XG5cbiAgLyoqIFJlc29sdmVzIHdoZW4gdGhlIHF1ZXVlIGhhcyBkcmFpbmVkICh0aGUgcHJvbWlzZSBgcHVzaCgpYCByZXR1cm5zKSAqL1xuICBwcml2YXRlIGRyYWluaW5nOiBQcm9taXNlPHZvaWQ+IHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBhc3luYyBkcmFpbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB3aGlsZSAodGhpcy5xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGludGVudCA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgaWYgKCFpbnRlbnQpIGJyZWFrO1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5wZW5kaW5nID8/IHRoaXMuaG9va3MuYWN0aXZlUGF0aCgpO1xuICAgICAgICBpZiAoIWZyb20pIGNvbnRpbnVlOyAvLyBubyBub3RlIHRvIGFuY2hvciBvbiBcdTIwMTQgZHJvcCB0aGUgcHJlc3NcbiAgICAgICAgY29uc3QgZGVjayA9IHRoaXMuaG9va3MucmVzb2x2ZShmcm9tLCB0aGlzLmhlYWQpO1xuICAgICAgICBpZiAoIWRlY2spIGNvbnRpbnVlOyAvLyBubyBsb25nZXIgYSBkZWNrIG5vdGUgXHUyMDE0IGRyb3AgdGhlIHByZXNzXG4gICAgICAgIHRoaXMuaGVhZCA9IGRlY2suY2hhaW5bMF0gPz8gdGhpcy5oZWFkOyAvLyByZW1lbWJlciB0aGUgY2hhaW4gd2Fsa2VkXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHN0ZXBUYXJnZXQoZGVjaywgaW50ZW50KTtcbiAgICAgICAgaWYgKCF0YXJnZXQpIGNvbnRpbnVlOyAvLyBmaXJzdC9sYXN0IHNsaWRlIFx1MjAxNCB0aGUgcHJlc3MgaXMgYSBuby1vcFxuICAgICAgICB0aGlzLnBlbmRpbmcgPSB0YXJnZXQ7XG4gICAgICAgIGF3YWl0IHRoaXMuaG9va3Mub3Blbih0YXJnZXQsIGZyb20pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBQcmVzc2VzIHF1ZXVlZCBiZWhpbmQgYSBmYWlsZWQgb3BlbiBhcmUgc3RhbGU6IHJlcGxheWluZyB0aGVtIGxhdGVyIHdvdWxkXG4gICAgICAvLyBtb3ZlIHRoZSByZWFkZXIgZnJvbSB3aGVyZXZlciB0aGV5IGVuZCB1cCwgbm90IGZyb20gd2hlcmUgdGhleSB3ZXJlLlxuICAgICAgdGhpcy5xdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7IC8vIHF1ZXVlIGRyYWluZWQ6IHRoZSBlZGl0b3IgaXMgYXV0aG9yaXRhdGl2ZSBhZ2FpblxuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIE1lbnUsIFRGaWxlLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IENvbmZpcm1EZWxldGVNb2RhbCB9IGZyb20gXCIuL2NvbmZpcm0tZGVsZXRlXCI7XG5pbXBvcnQgeyBQYW5lbERyYWcgfSBmcm9tIFwiLi9wYW5lbC1kcmFnXCI7XG5pbXBvcnQgeyBwbGFuTW92ZSwgc3RlcEluc2VydEF0LCB0eXBlIE1vdmVQbGFuIH0gZnJvbSBcIi4vbW92ZVwiO1xuXG4vKiogVmlldyB0eXBlIGlkIG9mIHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19QQU5FTF9WSUVXID0gXCJuYXRpdmUtc2xpZGVzLXBhbmVsXCI7XG5cbi8qKlxuICogU2lkZWJhciBwYW5lbCBsaXN0aW5nIGV2ZXJ5IHNsaWRlIG9mIHRoZSBhY3RpdmUgbm90ZSdzIGRlY2sgKG5leHQtb25seVxuICogY2hhaW4gb3JkZXIpLiBUYWtlcyBvdmVyIHRoZSBhZ2dyZWdhdGlvbi9lbnRyeSByb2xlIHRoZSBvdmVydmlldyBwYWdlXG4gKiB1c2VkIHRvIHBsYXkgYmVmb3JlIHYxLjAuMC5cbiAqXG4gKiBJbnRlcmFjdGlvbjpcbiAqICAgLSBjbGljayAgICAgICAgICAgIFx1MjE5MiBvcGVuIHRoYXQgc2xpZGUgKGFuZCBjbGVhciBhbnkgc2VsZWN0aW9uKVxuICogICAtIE1vZCtjbGljayAgICAgICAgXHUyMTkyIHRvZ2dsZSB0aGUgaXRlbSBpbiB0aGUgc2VsZWN0aW9uXG4gKiAgIC0gU2hpZnQrY2xpY2sgICAgICBcdTIxOTIgZXh0ZW5kIHRoZSBzZWxlY3Rpb24gZnJvbSB0aGUgbGFzdCBhbmNob3JcbiAqICAgLSBkcmFnICAgICAgICAgICAgIFx1MjE5MiBtb3ZlIHRoZSBzbGlkZSB0byBhIGdhcCAodGhlIHdob2xlIHNlbGVjdGlvbiwgd2hlbiB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgZ3JhYmJlZCBzbGlkZSBpcyBwYXJ0IG9mIG9uZSkgXHUyMDE0IHNlZSBzcmMvcGFuZWwtZHJhZy50c1xuICogICAtIHJpZ2h0LWNsaWNrICAgICAgXHUyMTkyIGNvbnRleHQgbWVudTogTW92ZSB1cCAvIE1vdmUgZG93biAvIENyZWF0ZSBuZXh0IHNsaWRlIC9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgRGVsZXRlIHNsaWRlKHMpXG4gKi9cbmV4cG9ydCBjbGFzcyBTbGlkZXNQYW5lbFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gIC8qKiBDaGFpbiBzaWduYXR1cmUgb2YgdGhlIGN1cnJlbnRseSByZW5kZXJlZCBsaXN0ICovXG4gIHByaXZhdGUgbGFzdENoYWluOiBzdHJpbmdbXSA9IFtdO1xuICAvKiogUmVuZGVyZWQgaXRlbSBlbGVtZW50cywgaW5kZXgtYWxpZ25lZCB3aXRoIGxhc3RDaGFpbiAqL1xuICBwcml2YXRlIGl0ZW1zOiB7IHBhdGg6IHN0cmluZzsgZWw6IEhUTUxFbGVtZW50IH1bXSA9IFtdO1xuICAvKiogQ3VycmVudGx5IHNlbGVjdGVkIHNsaWRlIHBhdGhzIChtdWx0aS1zZWxlY3QgZm9yIERlbGV0ZSkgKi9cbiAgcHJpdmF0ZSBzZWxlY3RlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAvKiogU2VsZWN0aW9uIGFuY2hvciBmb3IgU2hpZnQrY2xpY2sgcmFuZ2UgZXh0ZW5zaW9uICovXG4gIHByaXZhdGUgYW5jaG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgLyoqIFRoZSBkcmFnLXRvLW1vdmUgZ2VzdHVyZSAocG9pbnRlciBoYW5kbGluZyBvbmx5IFx1MjAxNCBubyBkZWNrIGtub3dsZWRnZSkgKi9cbiAgcHJpdmF0ZSBkcmFnOiBQYW5lbERyYWc7XG4gIC8qKiBXaGV0aGVyIGEgbW92ZSBpcyB3cml0aW5nIGZyb250bWF0dGVyIHJpZ2h0IG5vdyAocmVuZGVycyBhcmUgaGVsZCBiYWNrKSAqL1xuICBwcml2YXRlIHdyaXRpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luLFxuICAgIGxlYWY6IFdvcmtzcGFjZUxlYWYsXG4gICkge1xuICAgIHN1cGVyKGxlYWYpO1xuICAgIHRoaXMuZHJhZyA9IG5ldyBQYW5lbERyYWcoe1xuICAgICAgaXRlbXM6ICgpID0+IHRoaXMuaXRlbXMsXG4gICAgICBtb3ZpbmdGb3I6IChwYXRoKSA9PiB0aGlzLm1vdmluZ0ZvcihwYXRoKSxcbiAgICAgIGNvbnRhaW5lcjogKCkgPT4gdGhpcy5jb250ZW50RWwsXG4gICAgICBvbkdyYWI6IChwYXRoKSA9PiB0aGlzLm9uR3JhYihwYXRoKSxcbiAgICAgIHdpbGxDaGFuZ2U6IChtb3ZpbmcsIGluc2VydEF0KSA9PiB0aGlzLndpbGxDaGFuZ2UobW92aW5nLCBpbnNlcnRBdCksXG4gICAgICBvbkRyb3A6IChtb3ZpbmcsIGluc2VydEF0LCBzbmFwc2hvdCkgPT4gdm9pZCB0aGlzLmFwcGx5TW92ZShtb3ZpbmcsIGluc2VydEF0LCBzbmFwc2hvdCksXG4gICAgICBvbkVuZDogKCkgPT4gdGhpcy5yZW5kZXIoKSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFNMSURFU19QQU5FTF9WSUVXO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJTbGlkZXNcIjtcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJwcmVzZW50YXRpb25cIjtcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5kcmFnLmNhbmNlbCgpO1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5sYXN0Q2hhaW4gPSBbXTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jIHRoZSBsaXN0IHdpdGggdGhlIGFjdGl2ZSBub3RlJ3MgZGVjay4gSW5jcmVtZW50YWwgb24gcHVycG9zZTogdGhlXG4gICAqIHJlZnJlc2ggZXZlbnRzIGFsc28gZmlyZSB3aGlsZSBhIGNsaWNrIG9uIGFuIGVudHJ5IGlzIGluIGZsaWdodCAodGhlXG4gICAqIG1vdXNlZG93biBhY3RpdmF0ZXMgdGhpcyBsZWFmKSwgYW5kIHJlYnVpbGRpbmcgdGhlIERPTSBtaWQtZ2VzdHVyZVxuICAgKiBkZXN0cm95cyB0aGUgY2xpY2sgdGFyZ2V0IFx1MjAxNCB3aGljaCBtYWRlIG9wZW5pbmcgYSBzbGlkZSB0YWtlIHR3byBjbGlja3NcbiAgICogd2hlbmV2ZXIgdGhlIHBhbmVsIHdhcyBub3QgdGhlIGFjdGl2ZSBsZWFmLiBVbmNoYW5nZWQgY2hhaW5zIG9ubHkgZ2V0XG4gICAqIHRoZWlyIGhpZ2hsaWdodCB1cGRhdGVkLCBzbyBpdGVtIGVsZW1lbnRzIGFsd2F5cyBzdXJ2aXZlLlxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XG4gICAgLy8gQSBnZXN0dXJlIG9yIGEgbW92ZSBvd25zIHRoZSBET006IHJlYnVpbGRpbmcgdGhlIGxpc3QgbWlkLWRyYWcgd291bGRcbiAgICAvLyBkZXN0cm95IHRoZSBlbGVtZW50cyB0aGUgZ2VzdHVyZSBpcyBtZWFzdXJpbmcsIGFuZCB0aGUgbW92ZSdzIG93blxuICAgIC8vIHdyaXRlcyBmaXJlIGEgYnVyc3Qgb2YgbWV0YWRhdGFDYWNoZSBldmVudHMuIEJvdGggcGF0aHMgcmVuZGVyIG9uY2UgbW9yZVxuICAgIC8vIHdoZW4gdGhleSBhcmUgZG9uZSB3aXRoIGl0IFx1MjAxNCB0aGUgZ2VzdHVyZSB0aHJvdWdoIGBvbkVuZGAsIHRoZSB3cml0ZXNcbiAgICAvLyB0aHJvdWdoIGBhcHBseU1vdmVgJ3Mgb3duIHJlbmRlci5cbiAgICBpZiAodGhpcy5kcmFnLmFjdGl2ZSB8fCB0aGlzLndyaXRpbmcpIHJldHVybjtcblxuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IGNoYWluID0gdGhpcy5saXZlQ2hhaW4oZmlsZSk7XG5cbiAgICAvLyBEcm9wIHNlbGVjdGlvbnMgd2hvc2Ugbm90ZSB2YW5pc2hlZCBmcm9tIHRoZSBjaGFpbiBtZWFud2hpbGVcbiAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplID4gMCkge1xuICAgICAgY29uc3QgbGl2ZSA9IG5ldyBTZXQoY2hhaW4pO1xuICAgICAgZm9yIChjb25zdCBwYXRoIG9mIHRoaXMuc2VsZWN0ZWQpIGlmICghbGl2ZS5oYXMocGF0aCkpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIH1cbiAgICAvLyBBIGRlYWQgYW5jaG9yIG11c3Qgbm90IHNpbGVudGx5IHR1cm4gYSBTaGlmdCtjbGljayBpbnRvIGEgdG9nZ2xlXG4gICAgaWYgKHRoaXMuYW5jaG9yICE9PSBudWxsICYmICFjaGFpbi5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmICghY2hhaW5FcXVhbHModGhpcy5sYXN0Q2hhaW4sIGNoYWluKSkge1xuICAgICAgdGhpcy5yZWJ1aWxkKGNoYWluKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIsIGl0LnBhdGggPT09IGZpbGU/LnBhdGgpO1xuICAgIH1cbiAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogVGhlIGRlY2sgY2hhaW4gb2YgYGZpbGVgLCBsaW1pdGVkIHRvIHNsaWRlcyB0aGF0IGV4aXN0IHJpZ2h0IG5vdyAqL1xuICBwcml2YXRlIGxpdmVDaGFpbihmaWxlOiBURmlsZSB8IG51bGwpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZGVjayA9IGZpbGUgPyB0aGlzLnBsdWdpbi5yZXNvbHZlRGVjayhmaWxlKSA6IG51bGw7XG4gICAgcmV0dXJuIGRlY2tcbiAgICAgID8gZGVjay5jaGFpbi5maWx0ZXIoKHApID0+IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwKSBpbnN0YW5jZW9mIFRGaWxlKVxuICAgICAgOiBbXTtcbiAgfVxuXG4gIC8qKiBGdWxsIHJlYnVpbGQgKGNoYWluIHNoYXBlIGNoYW5nZWQpICovXG4gIHByaXZhdGUgcmVidWlsZChjaGFpbjogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAvLyBUaGUgaXRlbXMgbGl2ZSBpbiB0aGUgdmlldydzIG93biBjb250ZW50IGVsZW1lbnQgXHUyMDE0IHRoZSBwYXJ0IE9ic2lkaWFuXG4gICAgLy8gc2Nyb2xscyBhbmQgdGhlIG9ubHkgcGFydCB0aGF0IGlzIG91cnMgdG8gZW1wdHkgKGVtcHR5aW5nIGNvbnRhaW5lckVsXG4gICAgLy8gd291bGQgdGFrZSB0aGUgdmlldyBoZWFkZXIgd2l0aCBpdCkuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGVudEVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5sYXN0Q2hhaW4gPSBjaGFpbjtcblxuICAgIGlmIChjaGFpbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1lbXB0eVwiIH0pO1xuICAgICAgZW1wdHkuc2V0VGV4dChcbiAgICAgICAgXCJObyBzbGlkZXMgZGVjayBcdTIwMTQgb3BlbiBhIGRlY2sgbm90ZSwgb3IgcnVuIGNyZWF0ZSBuZXh0IHNsaWRlIG9uIGFueSBub3RlIHRvIHN0YXJ0IG9uZS5cIixcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGg7XG4gICAgY2hhaW4uZm9yRWFjaCgocGF0aCwgaSkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybjtcbiAgICAgIGNvbnN0IGl0ZW0gPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWl0ZW1cIiB9KTtcbiAgICAgIGlmIChwYXRoID09PSBhY3RpdmVQYXRoKSBpdGVtLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtbnVtXCIgfSkuc2V0VGV4dChTdHJpbmcoaSArIDEpKTtcbiAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLXRpdGxlXCIgfSkuc2V0VGV4dChmLmJhc2VuYW1lKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLm9uSXRlbUNsaWNrKGUsIGksIGYpKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIChlKSA9PiB0aGlzLmRyYWcuYmVnaW4oZSwgcGF0aCkpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShlLCBmKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pdGVtcy5wdXNoKHsgcGF0aCwgZWw6IGl0ZW0gfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xpY2sgcm91dGluZzogcGxhaW4gPSBvcGVuLCBNb2QgPSB0b2dnbGUgc2VsZWN0LCBTaGlmdCA9IHJhbmdlIHNlbGVjdCAqL1xuICBwcml2YXRlIG9uSXRlbUNsaWNrKGU6IE1vdXNlRXZlbnQsIGluZGV4OiBudW1iZXIsIGY6IFRGaWxlKTogdm9pZCB7XG4gICAgLy8gQSBkcmFnIGVuZHMgd2l0aCBhIGNsaWNrIG9uIHRoZSBzbGlkZSBpdCBncmFiYmVkIFx1MjAxNCB0aGF0IGNsaWNrIG1vdmVkIHRoZVxuICAgIC8vIHNsaWRlLCBpdCBkb2VzIG5vdCBvcGVuIGl0LlxuICAgIGlmICh0aGlzLmRyYWcuY29uc3VtZUNsaWNrKCkpIHJldHVybjtcbiAgICBpZiAoZS5zaGlmdEtleSB8fCBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAvLyBSYW5nZSBhbmNob3I6IHRoZSBsYXN0IHNlbGVjdGVkIGl0ZW0sIG9yIHRoZSBkaXNwbGF5ZWQgc2xpZGVcbiAgICAgICAgLy8gd2hlbiBubyB1c2FibGUgYW5jaG9yIGV4aXN0cyAoZmlyc3QgU2hpZnQrY2xpY2sgaW4gYSBzZXNzaW9uKS5cbiAgICAgICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbDtcbiAgICAgICAgY29uc3QgYW5jaG9yUGF0aCA9XG4gICAgICAgICAgdGhpcy5hbmNob3IgIT09IG51bGwgJiYgdGhpcy5pdGVtcy5zb21lKChpdCkgPT4gaXQucGF0aCA9PT0gdGhpcy5hbmNob3IpXG4gICAgICAgICAgICA/IHRoaXMuYW5jaG9yXG4gICAgICAgICAgICA6IGFjdGl2ZVBhdGg7XG4gICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgoaXQpID0+IGl0LnBhdGggPT09IGFuY2hvclBhdGgpO1xuICAgICAgICBpZiAoYW5jaG9yUGF0aCAhPT0gbnVsbCAmJiBmcm9tICE9PSAtMSkge1xuICAgICAgICAgIGNvbnN0IFtsbywgaGldID0gZnJvbSA8IGluZGV4ID8gW2Zyb20sIGluZGV4XSA6IFtpbmRleCwgZnJvbV07XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGxvOyBpIDw9IGhpOyBpKyspIHRoaXMuc2VsZWN0ZWQuYWRkKHRoaXMuaXRlbXNbaV0ucGF0aCk7XG4gICAgICAgICAgLy8gVGhlIGRpc3BsYXllZCBzbGlkZSBqb2lucyBldmVyeSBTaGlmdCBzZWxlY3Rpb24gXHUyMDE0IGV4dGVuZGluZyBhXG4gICAgICAgICAgLy8gc2VsZWN0aW9uIG5ldmVyIHNpbGVudGx5IGRyb3BzIHRoZSBwYWdlIHlvdSBhcmUgbG9va2luZyBhdC5cbiAgICAgICAgICBpZiAoYWN0aXZlUGF0aCAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLnNvbWUoKGl0KSA9PiBpdC5wYXRoID09PSBhY3RpdmVQYXRoKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5hZGQoYWN0aXZlUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYW5jaG9yID0gdGhpcy5pdGVtc1tpbmRleF0ucGF0aDtcbiAgICAgICAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBNb2QgKG9yIFNoaWZ0IHdpdGggbm8gcmVhY2hhYmxlIGFuY2hvcik6IHB1cmUgdG9nZ2xlIFx1MjAxNCB0aGUgb25seSB3YXlcbiAgICAgIC8vIHRvIGNhbmNlbCBhbiBpdGVtIG91dCBvZiB0aGUgc2VsZWN0aW9uLlxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQuaGFzKGYucGF0aCkpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKGYucGF0aCk7XG4gICAgICBlbHNlIHRoaXMuc2VsZWN0ZWQuYWRkKGYucGF0aCk7XG4gICAgICB0aGlzLmFuY2hvciA9IGYucGF0aDtcbiAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgIC8vIE5vIHNlbGVjdGlvbiBhZnRlciBhIHBsYWluIGNsaWNrLCBidXQgdGhlIGNsaWNrZWQgc2xpZGUgc3RheXMgdGhlXG4gICAgLy8gU2hpZnQrY2xpY2sgYW5jaG9yIFx1MjAxNCBtYXRjaGluZyB0aGUgZmlsZS1leHBsb3JlciBmZWVsOiBwaWNrIGEgc2xpZGUsXG4gICAgLy8gdGhlbiBTaGlmdCtjbGljayBhIGxhdGVyIG9uZSB0byBzZWxlY3QgdGhlIHdob2xlIHJhbmdlIGJldHdlZW4gdGhlbS5cbiAgICB0aGlzLmFuY2hvciA9IGYucGF0aDtcbiAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgdm9pZCB0aGlzLm9wZW5TbGlkZShmKTtcbiAgfVxuXG4gIC8qKiBSZWZsZWN0IHRoZSBzZWxlY3Rpb24gc2V0IG9uIHRoZSByZW5kZXJlZCBpdGVtcyB3aXRob3V0IGEgcmVidWlsZCAqL1xuICBwcml2YXRlIHN5bmNTZWxlY3Rpb25DbGFzc2VzKCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5pdGVtcykgaXQuZWwuY2xhc3NMaXN0LnRvZ2dsZShcImlzLXNlbGVjdGVkXCIsIHRoaXMuc2VsZWN0ZWQuaGFzKGl0LnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2xpZGVzIGFuIGFjdGlvbiBvbiBgcGF0aGAgYXBwbGllcyB0bzogdGhlIHdob2xlIHNlbGVjdGlvbiB3aGVuIGBwYXRoYFxuICAgKiBiZWxvbmdzIHRvIGl0LCBvdGhlcndpc2UganVzdCB0aGF0IHNsaWRlLiBDaGFpbi1vcmRlcmVkLCBhbmQgbGltaXRlZCB0b1xuICAgKiB0aGUgc2xpZGVzIHRoZSBkZWNrIHN0aWxsIGhvbGRzLlxuICAgKi9cbiAgcHJpdmF0ZSBtb3ZpbmdGb3IocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGlmICghdGhpcy5zZWxlY3RlZC5oYXMocGF0aCkpIHJldHVybiBbcGF0aF07XG4gICAgcmV0dXJuIHRoaXMubGFzdENoYWluLmZpbHRlcigocCkgPT4gdGhpcy5zZWxlY3RlZC5oYXMocCkpO1xuICB9XG5cbiAgLyoqIEEgZHJhZyBzdGFydGVkIG9uIGBwYXRoYDogYSBzbGlkZSBvdXRzaWRlIHRoZSBzZWxlY3Rpb24gaXMgZHJhZ2dlZCBhbG9uZSAqL1xuICBwcml2YXRlIG9uR3JhYihwYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2VsZWN0ZWQuaGFzKHBhdGgpICYmIHRoaXMuc2VsZWN0ZWQuc2l6ZSA+IDApIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICB9XG4gICAgdGhpcy5hbmNob3IgPSBwYXRoO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhhdCBkcm9wIHdvdWxkIGFjdHVhbGx5IHJld2lyZSBzb21ldGhpbmcgKGEgbm8tb3AgaGlkZXMgdGhlIGxpbmUpICovXG4gIHByaXZhdGUgd2lsbENoYW5nZShtb3Zpbmc6IHN0cmluZ1tdLCBpbnNlcnRBdDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGxhbiA9IHBsYW5Nb3ZlKHRoaXMubGFzdENoYWluLCBtb3ZpbmcsIGluc2VydEF0KTtcbiAgICByZXR1cm4gcGxhbiAhPT0gbnVsbCAmJiBwbGFuLnJld3JpdGVzLmxlbmd0aCA+IDA7XG4gIH1cblxuICAvKiogTW92ZSB0aGUgZ2l2ZW4gc2xpZGVzIG9uZSBzdGVwIHRvd2FyZHMgYGRpcmVjdGlvbmAgKGNvbnRleHQgbWVudSkgKi9cbiAgcHJpdmF0ZSBtb3ZlU3RlcChtb3Zpbmc6IHN0cmluZ1tdLCBkaXJlY3Rpb246IFwidXBcIiB8IFwiZG93blwiKTogdm9pZCB7XG4gICAgY29uc3QgaW5zZXJ0QXQgPSBzdGVwSW5zZXJ0QXQodGhpcy5sYXN0Q2hhaW4sIG1vdmluZywgZGlyZWN0aW9uKTtcbiAgICBpZiAoaW5zZXJ0QXQgPT09IG51bGwpIHJldHVybjtcbiAgICB2b2lkIHRoaXMuYXBwbHlNb3ZlKG1vdmluZywgaW5zZXJ0QXQsIHRoaXMubGFzdENoYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhIG1vdmU6IHBsYW4gaXQgYWdhaW5zdCB0aGUgbGl2ZSBjaGFpbiwgdGhlbiBsZXQgdGhlIGRlY2sgc2VydmljZVxuICAgKiByZXdpcmUgdGhlIGBkZWNrYCBsaW5rcyBvZiB0aGUgc2xpZGVzIHdob3NlIG5leHQgbGluayBjaGFuZ2VzLiBgc25hcHNob3RgXG4gICAqIGlzIHRoZSBjaGFpbiB0aGUgZ2VzdHVyZSAob3IgdGhlIG1lbnUgYWN0aW9uKSB3YXMgY29tcHV0ZWQgYWdhaW5zdCBcdTIwMTQgd2hlblxuICAgKiB0aGUgZGVjayBjaGFuZ2VkIG1lYW53aGlsZSB0aGUgZ2FwIGluZGV4IG1lYW5zIG5vdGhpbmcsIHNvIHRoZSBtb3ZlIGlzXG4gICAqIGRyb3BwZWQgcmF0aGVyIHRoYW4gYXBwbGllZCB0byBhIGRlY2sgaXQgbm8gbG9uZ2VyIGRlc2NyaWJlcy5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgYXBwbHlNb3ZlKG1vdmluZzogc3RyaW5nW10sIGluc2VydEF0OiBudW1iZXIsIHNuYXBzaG90OiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNoYWluID0gdGhpcy5saXZlQ2hhaW4odGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSk7XG4gICAgaWYgKCFjaGFpbkVxdWFscyhjaGFpbiwgc25hcHNob3QpKSByZXR1cm47XG4gICAgY29uc3QgcGxhbiA9IHBsYW5Nb3ZlKGNoYWluLCBtb3ZpbmcsIGluc2VydEF0KTtcbiAgICBpZiAoIXBsYW4gfHwgcGxhbi5yZXdyaXRlcy5sZW5ndGggPT09IDApIHJldHVybjsgLy8gbm90aGluZyBtb3ZlZCBcdTIwMTQgd3JpdGUgbm90aGluZ1xuXG4gICAgY29uc3QgYXBwbGllZCA9IGF3YWl0IHRoaXMucnVuTW92ZShwbGFuKTtcbiAgICAvLyBBIGNvbXBsZXRlIHJ1biByZS1iYXNlcyB0aGUgbmF2aWdhdGlvbiBzZXNzaW9uIG9uIHRoZSBtb3ZlZCBjaGFpbidzXG4gICAgLy8gaGVhZC4gQSBmYWlsZWQgb25lIGxlYXZlcyBhIG1peGVkIG9yZGVyIGJlaGluZCwgYW5kIHRoZSBoZWFkIHRoZSBzZXNzaW9uXG4gICAgLy8gZW50ZXJlZCBtYXkgbm93IHNpdCBtaWQtY2hhaW4gXHUyMDE0IGZvcmdldHRpbmcgdGhlIGhpbnQgaXMgd2hhdCBsZXRzIHRoZSBuZXh0XG4gICAgLy8gcmVzb2x1dGlvbiBmaW5kIHRoZSBkZWNrJ3MgcmVhbCBoZWFkIGFnYWluLlxuICAgIHRoaXMucGx1Z2luLnJlbWVtYmVyRGVja0hlYWQoYXBwbGllZCA/IChwbGFuLmNoYWluWzBdID8/IG51bGwpIDogbnVsbCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBSdW4gYSBtb3ZlIHdpdGggdGhlIHBhbmVsJ3MgcmUtcmVuZGVyaW5nIGhlbGQgYmFjayBmb3IgaXRzIGR1cmF0aW9uICovXG4gIHByaXZhdGUgYXN5bmMgcnVuTW92ZShwbGFuOiBNb3ZlUGxhbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRoaXMud3JpdGluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlTW92ZShwbGFuKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy53cml0aW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJpZ2h0LWNsaWNrIG1lbnUgb24gb25lIGl0ZW07IG9wZXJhdGVzIG9uIHRoZSB3aG9sZSBzZWxlY3Rpb24gd2hlbiBpdCBiZWxvbmdzIHRvIG9uZSAqL1xuICBwcml2YXRlIG9wZW5Db250ZXh0TWVudShlOiBNb3VzZUV2ZW50LCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuICAgIGNvbnN0IG1vdmluZyA9IHRoaXMubW92aW5nRm9yKGYucGF0aCk7XG4gICAgY29uc3Qgd2hhdCA9IG1vdmluZy5sZW5ndGggPiAxID8gYCR7bW92aW5nLmxlbmd0aH0gc2xpZGVzYCA6IFwic2xpZGVcIjtcblxuICAgIC8vIE1vdmUgdXAgLyBkb3duIGFjdCBvbiBleGFjdGx5IHRoZSBzZXQgYSBkcmFnIHdvdWxkIG1vdmUsIHNvIGEgc2VsZWN0aW9uXG4gICAgLy8gc3RheXMgYSBibG9jazsgZWFjaCBpcyBkaXNhYmxlZCB3aGVuIHRoYXQgc2V0IGFscmVhZHkgc2l0cyBhdCBpdHMgZW5kLlxuICAgIGNvbnN0IHVwID0gc3RlcEluc2VydEF0KHRoaXMubGFzdENoYWluLCBtb3ZpbmcsIFwidXBcIik7XG4gICAgY29uc3QgZG93biA9IHN0ZXBJbnNlcnRBdCh0aGlzLmxhc3RDaGFpbiwgbW92aW5nLCBcImRvd25cIik7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShgTW92ZSAke3doYXR9IHVwYClcbiAgICAgICAgLnNldEljb24oXCJhcnJvdy11cFwiKVxuICAgICAgICAuc2V0RGlzYWJsZWQodXAgPT09IG51bGwpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMubW92ZVN0ZXAobW92aW5nLCBcInVwXCIpKSxcbiAgICApO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUoYE1vdmUgJHt3aGF0fSBkb3duYClcbiAgICAgICAgLnNldEljb24oXCJhcnJvdy1kb3duXCIpXG4gICAgICAgIC5zZXREaXNhYmxlZChkb3duID09PSBudWxsKVxuICAgICAgICAub25DbGljaygoKSA9PiB0aGlzLm1vdmVTdGVwKG1vdmluZywgXCJkb3duXCIpKSxcbiAgICApO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUoXCJDcmVhdGUgbmV4dCBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInBsdXNcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdm9pZCB0aGlzLmNyZWF0ZU5leHRBZnRlcihmKSksXG4gICAgKTtcbiAgICBtZW51LmFkZEl0ZW0oKG1pKSA9PlxuICAgICAgbWlcbiAgICAgICAgLnNldFRpdGxlKG1vdmluZy5sZW5ndGggPiAxID8gYERlbGV0ZSAke21vdmluZy5sZW5ndGh9IHNsaWRlc2AgOiBcIkRlbGV0ZSBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInRyYXNoXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMuZGVsZXRlU2xpZGVzKG1vdmluZykpLFxuICAgICk7XG4gICAgbWVudS5zaG93QXRNb3VzZUV2ZW50KGUpO1xuICB9XG5cbiAgLyoqIENyZWF0ZSBhIHNsaWRlIGFmdGVyIHRoZSByaWdodC1jbGlja2VkIG9uZSAod2l0aG91dCBvcGVuaW5nIGl0KSAqL1xuICBwcml2YXRlIGFzeW5jIGNyZWF0ZU5leHRBZnRlcihmOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBsYW4gPSB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmKTtcbiAgICBpZiAoIXBsYW4pIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlQ3JlYXRlTmV4dChmLCBwbGFuLCBmYWxzZSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBDb25maXJtLCB0aGVuIHRyYXNoIHRoZSBnaXZlbiBzbGlkZXMgYW5kIHNwbGljZSB0aGVtIG91dCBvZiB0aGUgY2hhaW4gKi9cbiAgcHJpdmF0ZSBkZWxldGVTbGlkZXMocGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IHJ1biA9ICgpOiB2b2lkID0+IHZvaWQgdGhpcy5ydW5EZWxldGlvbihwYXRocyk7XG5cbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpIHtcbiAgICAgIHJ1bigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuYW1lcyA9IHBhdGhzLm1hcCgocCkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwKTtcbiAgICAgIHJldHVybiBmIGluc3RhbmNlb2YgVEZpbGUgPyBmLmJhc2VuYW1lIDogcDtcbiAgICB9KTtcbiAgICBuZXcgQ29uZmlybURlbGV0ZU1vZGFsKHRoaXMuYXBwLCBuYW1lcywgcnVuLCBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzID0gZmFsc2U7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJ1bkRlbGV0aW9uKHBhdGhzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IG51bGw7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICAgIHRoaXMubGFzdENoYWluLFxuICAgICAgbmV3IFNldChwYXRocyksXG4gICAgICBhY3RpdmVQYXRoLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgcGF0aHMpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIGlmICh0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiBwYXRocy5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQubGFuZGluZ1BhdGgpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmVzdWx0LmxhbmRpbmdQYXRoKTtcbiAgICAgIGlmIChmIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMub3BlblNsaWRlKGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqIE9wZW4gYSBzbGlkZSBpbiBhIG1hcmtkb3duIGxlYWYgKG5ldmVyIGluIHRoaXMgcGFuZWwncyBvd24gbGVhZikgKi9cbiAgcHJpdmF0ZSBhc3luYyBvcGVuU2xpZGUoZjogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsZWFmID1cbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoXCJtYXJrZG93blwiKVswXSA/PyB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGYpO1xuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHsgZm9jdXM6IHRydWUgfSk7XG4gIH1cbn1cblxuLyoqIE9yZGVyLXNlbnNpdGl2ZSBjaGFpbiBjb21wYXJpc29uICovXG5mdW5jdGlvbiBjaGFpbkVxdWFscyhhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KChwLCBpKSA9PiBwID09PSBiW2ldKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBNYXggbmFtZXMgc2hvd24gaW4gdGhlIGRpYWxvZyBiZWZvcmUgY29sbGFwc2luZyBpbnRvIGEgXCIrTiBtb3JlXCIgbGluZSAqL1xuY29uc3QgTUFYX1ZJU0lCTEVfTkFNRVMgPSA4O1xuXG4vKipcbiAqIENvbmZpcm1hdGlvbiBkaWFsb2cgZm9yIERlbGV0ZSBzbGlkZXMuIExpc3RzIHRoZSBub3RlcyBhYm91dCB0byBiZVxuICogdHJhc2hlZCAobnVtYmVyZWQgbGlrZSB0aGUgcGFuZWwsIHNvIHRoZSB1c2VyIGNhbiBtYXAgdGhlbSAxOjEpLCBvZmZlcnNcbiAqIGEgXCJkb24ndCBhc2sgYWdhaW5cIiB0b2dnbGUgdGhhdCBmbGlwcyB0aGUgYGNvbmZpcm1EZWxldGVTbGlkZXNgIHNldHRpbmdcbiAqIG9mZiAocGVyc2lzdGVkIGJ5IHRoZSBjYWxsZXIgdmlhIG9uRG9udEFzayksIGFuZCBhc2tzIGZvciBhbiBleHBsaWNpdFxuICogQ2FuY2VsIC8gRGVsZXRlIGRlY2lzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlybURlbGV0ZU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGNvbmZpcm1lZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFwcDogQXBwLFxuICAgIHByaXZhdGUgbmFtZXM6IHN0cmluZ1tdLFxuICAgIHByaXZhdGUgb25Db25maXJtOiAoKSA9PiB2b2lkLFxuICAgIHByaXZhdGUgb25Eb250QXNrOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICApIHtcbiAgICBzdXBlcihhcHApO1xuICB9XG5cbiAgb25PcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5tb2RhbEVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZVwiKTtcblxuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5uYW1lcy5sZW5ndGg7XG4gICAgdGhpcy5jb250ZW50RWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS10aXRsZVwiLFxuICAgICAgdGV4dDogY291bnQgPT09IDEgPyBcIkRlbGV0ZSB0aGlzIHNsaWRlP1wiIDogYERlbGV0ZSAke2NvdW50fSBzbGlkZXM/YCxcbiAgICB9KTtcbiAgICB0aGlzLmNvbnRlbnRFbFxuICAgICAgLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXN1YlwiIH0pXG4gICAgICAuc2V0VGV4dChcbiAgICAgICAgY291bnQgPT09IDFcbiAgICAgICAgICA/IFwiVGhlIG5vdGUgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCJcbiAgICAgICAgICA6IFwiVGhlc2Ugbm90ZXMgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCIsXG4gICAgICApO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWxpc3RcIiB9KTtcbiAgICBmb3IgKGNvbnN0IFtpLCBuYW1lXSBvZiB0aGlzLm5hbWVzLnNsaWNlKDAsIE1BWF9WSVNJQkxFX05BTUVTKS5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW51bVwiIH0pLnNldFRleHQoU3RyaW5nKGkgKyAxKSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW5hbWVcIiB9KS5zZXRUZXh0KG5hbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lcy5sZW5ndGggPiBNQVhfVklTSUJMRV9OQU1FUykge1xuICAgICAgbGlzdFxuICAgICAgICAuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbW9yZVwiIH0pXG4gICAgICAgIC5zZXRUZXh0KGBcdTIwMjYgYW5kICR7dGhpcy5uYW1lcy5sZW5ndGggLSBNQVhfVklTSUJMRV9OQU1FU30gbW9yZWApO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGREb250QXNrUm93KCk7XG4gICAgdGhpcy5idWlsZEFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKiBDb21wYWN0IGxlZnQtYWxpZ25lZCBcImRvbid0IGFzayBhZ2FpblwiIGNoZWNrYm94IHJvdyAqL1xuICBwcml2YXRlIGJ1aWxkRG9udEFza1JvdygpOiB2b2lkIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1kb250YXNrXCIgfSk7XG4gICAgcm93LmNyZWF0ZUVsKFwibGFiZWxcIikuc2V0VGV4dChcIkRvbid0IGFzayBhZ2FpblwiKTtcbiAgICBjb25zdCBjaGVja2JveCA9IHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdm9pZCB0aGlzLm9uRG9udEFzaygpLnRoZW4oXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBjaGVja2JveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICAvLyBrZWVwIHRoZSBjaGVja2JveCBlbmFibGVkIGlmIHBlcnNpc3RpbmcgdGhlIHByZWZlcmVuY2UgZmFpbGVkXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJpZ2h0LWFsaWduZWQgQ2FuY2VsIC8gRGVsZXRlIGJ1dHRvbiByb3cgKi9cbiAgcHJpdmF0ZSBidWlsZEFjdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWFjdGlvbnNcIiB9KTtcbiAgICBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxcIiB9KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICBhY3Rpb25zXG4gICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkRlbGV0ZVwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBvbkNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbmZpcm1lZCkgdGhpcy5vbkNvbmZpcm0oKTtcbiAgfVxufVxuIiwgIi8qKlxuICogcGFuZWwtZHJhZy50cyBcdTIwMTQgdGhlIHBvaW50ZXIgZ2VzdHVyZSBiZWhpbmQgXCJkcmFnIGEgc2xpZGUgdG8gbW92ZSBpdFwiLlxuICpcbiAqIFRoZSBzbGlkZXMgcGFuZWwgb3ducyB0aGUgZGVjayBtb2RlbCAod2hhdCBhIGRyb3AgKm1lYW5zKik7IHRoaXMgbW9kdWxlIG93bnNcbiAqIG9ubHkgdGhlIGdlc3R1cmU6IGl0IGRlY2lkZXMgd2hlbiBhIHByZXNzIGJlY29tZXMgYSBkcmFnLCBwYWludHMgdGhlIGdob3N0XG4gKiBhbmQgdGhlIGluc2VydGlvbiBsaW5lLCBzY3JvbGxzIHRoZSBsaXN0IHdoZW4gdGhlIHBvaW50ZXIgcmVhY2hlcyBpdHMgZWRnZSxcbiAqIGFuZCBoYW5kcyB0aGUgcGFuZWwgYSBzaW5nbGUgY29tbWl0IFx1MjAxNCBgb25Ecm9wKG1vdmluZywgaW5zZXJ0QXQsIHNuYXBzaG90KWAuXG4gKiBFdmVyeSBnZXN0dXJlIHRoYXQgZXZlciBiZWNhbWUgYSBkcmFnIGFsc28gZW5kcyB3aXRoIGBvbkVuZCgpYCwgc28gdGhlIHBhbmVsXG4gKiBjYW4gcmUtcmVuZGVyIG9uY2UgdGhlIGRyYWcgaXMgbm8gbG9uZ2VyIGFjdGl2ZS4gSXQgbmV2ZXIgd3JpdGVzIHRvIHRoZVxuICogdmF1bHQgYW5kIGtub3dzIG5vdGhpbmcgYWJvdXQgYGRlY2tgIGxpbmtzLlxuICpcbiAqIE9ic2lkaWFuJ3MgcHVibGljIEFQSSBoYXMgbm8gZHJhZy10by1tb3ZlIGhlbHBlciBhIGN1c3RvbSB2aWV3IGNvdWxkIHVzZVxuICogKHRoZSBkZWNsYXJhdGl2ZSBzZXR0aW5ncyBsaXN0J3MgYG9uUmVvcmRlcmAgcmVuZGVycyBpbnNpZGUgdGhlIHNldHRpbmdzXG4gKiBtb2RhbCBvbmx5KSwgc28gdGhlIGdlc3R1cmUgaXMgYnVpbHQgb24gcG9pbnRlciBldmVudHM6IGBwb2ludGVyZG93bmAgb24gYW5cbiAqIGl0ZW0sIGEgbW92ZW1lbnQgdGhyZXNob2xkIGJlZm9yZSBhbnl0aGluZyBoYXBwZW5zIChhIHBsYWluIHByZXNzIG11c3Qgc3RheVxuICogYSBwbGFpbiBjbGljaywgd2hpY2ggb3BlbnMgdGhlIHNsaWRlKSwgdGhlbiBgcG9pbnRlcm1vdmVgIC8gYHBvaW50ZXJ1cGAgL1xuICogYHBvaW50ZXJjYW5jZWxgIG9uIGBkb2N1bWVudGAsIHdpdGggYEVzY2FwZWAgYW5kIHdpbmRvdyBibHVyIGFzIGNhbmNlbHMuXG4gKlxuICogVHdvIGRldGFpbHMgYXJlIGxvYWQtYmVhcmluZzpcbiAqICAgLSB0aGUgKippbnNlcnRpb24gbGluZSoqIGlzIGhpZGRlbiB3aGVuIHRoZSBkcm9wIHdvdWxkIG5vdCBjaGFuZ2UgdGhlXG4gKiAgICAgb3JkZXIgKGB3aWxsQ2hhbmdlYCksIHNvIGEgbm8tb3AgZHJvcCByZWFkcyBhcyBhIG5vLW9wICpiZWZvcmUqIHRoZVxuICogICAgIGJ1dHRvbiBpcyByZWxlYXNlZDtcbiAqICAgLSB0aGUgZHJvcCBjYXJyaWVzIHRoZSAqKmNoYWluIHNuYXBzaG90KiogdGhlIGdlc3R1cmUgc3RhcnRlZCBvbiwgc28gdGhlXG4gKiAgICAgcGFuZWwgY2FuIHJlZnVzZSBhIGRyb3Agd2hvc2UgZ2FwIGluZGV4IG5vIGxvbmdlciBkZXNjcmliZXMgdGhlIGRlY2tcbiAqICAgICAodGhlIGRlY2sgY2FuIGNoYW5nZSB1bmRlciB0aGUgZ2VzdHVyZSBcdTIwMTQgYW4gZWRpdCBpbiBhbm90aGVyIHBhbmUsIGFcbiAqICAgICByZW5hbWUsIGEgZGVsZXRlKS5cbiAqL1xuXG4vKiogUHggdGhlIHBvaW50ZXIgbXVzdCB0cmF2ZWwgYmVmb3JlIGEgcHJlc3MgY291bnRzIGFzIGEgZHJhZyByYXRoZXIgdGhhbiBhIGNsaWNrICovXG5jb25zdCBEUkFHX1RIUkVTSE9MRCA9IDQ7XG4vKiogUHggYmFuZCBhdCB0aGUgbGlzdCdzIHRvcC9ib3R0b20gZWRnZSB0aGF0IHNjcm9sbHMgd2hpbGUgdGhlIHBvaW50ZXIgc2l0cyBpbiBpdCAqL1xuY29uc3QgRURHRV9CQU5EID0gMjQ7XG4vKiogUHggc2Nyb2xsZWQgcGVyIGFuaW1hdGlvbiBmcmFtZSB3aGlsZSB0aGUgcG9pbnRlciBzaXRzIGluIGFuIGVkZ2UgYmFuZCAqL1xuY29uc3QgRURHRV9TUEVFRCA9IDg7XG5cbi8qKiBBIHJlbmRlcmVkIHNsaWRlIG9mIHRoZSBsaXN0ICovXG5leHBvcnQgaW50ZXJmYWNlIERyYWdJdGVtIHtcbiAgcGF0aDogc3RyaW5nO1xuICBlbDogSFRNTEVsZW1lbnQ7XG59XG5cbi8qKiBXaGF0IHRoZSBnZXN0dXJlIG5lZWRzIGZyb20gdGhlIHBhbmVsLCB3aGljaCBvd25zIHRoZSBkZWNrIG1vZGVsICovXG5leHBvcnQgaW50ZXJmYWNlIERyYWdIb3N0IHtcbiAgLyoqXG4gICAqIFRoZSByZW5kZXJlZCBzbGlkZXMsICoqaW5kZXgtYWxpZ25lZCB3aXRoIHRoZSBjaGFpbioqIChpdGVtIGBpYCBpcyBzbGlkZVxuICAgKiBgaWApIFx1MjAxNCB0aGUgZ2VzdHVyZSByZWFkcyB0aGUgZ2VvbWV0cnkgZnJvbSB0aGVzZSBlbGVtZW50cy4gTmV2ZXIgbXV0YXRlZFxuICAgKiBieSB0aGUgZ2VzdHVyZS5cbiAgICovXG4gIGl0ZW1zKCk6IHJlYWRvbmx5IERyYWdJdGVtW107XG4gIC8qKiBUaGUgc2xpZGVzIGEgZ3JhYiBvbiBgcGF0aGAgbW92ZXM6IHRoZSBzZWxlY3Rpb24gYmxvY2ssIG9yIHRoYXQgc2xpZGUgYWxvbmUgKi9cbiAgbW92aW5nRm9yKHBhdGg6IHN0cmluZyk6IHN0cmluZ1tdO1xuICAvKiogVGhlIHNjcm9sbGFibGUgbGlzdCBlbGVtZW50IChlZGdlIGF1dG8tc2Nyb2xsKSAqL1xuICBjb250YWluZXIoKTogSFRNTEVsZW1lbnQgfCBudWxsO1xuICAvKiogVGhlIHVzZXIgZ3JhYmJlZCBgcGF0aGA6IHRoZSBwYW5lbCBkcm9wcyBhIHNlbGVjdGlvbiBpdCBpcyBub3QgcGFydCBvZiAqL1xuICBvbkdyYWIocGF0aDogc3RyaW5nKTogdm9pZDtcbiAgLyoqIFdoZXRoZXIgdGhhdCBkcm9wIHdvdWxkIGNoYW5nZSB0aGUgb3JkZXIgKGEgbm8tb3AgaGlkZXMgdGhlIGluc2VydGlvbiBsaW5lKSAqL1xuICB3aWxsQ2hhbmdlKG1vdmluZzogc3RyaW5nW10sIGluc2VydEF0OiBudW1iZXIpOiBib29sZWFuO1xuICAvKiogQ29tbWl0IGEgZHJvcDsgYHNuYXBzaG90YCBpcyB0aGUgY2hhaW4gdGhlIGdlc3R1cmUgc3RhcnRlZCBvbiAqL1xuICBvbkRyb3AobW92aW5nOiBzdHJpbmdbXSwgaW5zZXJ0QXQ6IG51bWJlciwgc25hcHNob3Q6IHN0cmluZ1tdKTogdm9pZDtcbiAgLyoqXG4gICAqIFRoZSBnZXN0dXJlIGlzIG92ZXIgXHUyMDE0IGNvbW1pdHRlZCwgcmVmdXNlZCBvciBjYW5jZWxsZWQuIEFsd2F5cyBjYWxsZWQgZm9yIGFcbiAgICogZ2VzdHVyZSB0aGF0IGJlY2FtZSBhIGRyYWcsIGFuZCBhZnRlciBgb25Ecm9wYCB3aGVuIGEgZHJvcCB3YXMgY29tbWl0dGVkLFxuICAgKiBzbyB0aGUgcGFuZWwgY2FuIHJlLXJlbmRlciBvbmNlIHRoZSBkcmFnIGlzIG5vIGxvbmdlciBhY3RpdmUgKGl0cyByZW5kZXJzXG4gICAqIGFyZSBzdXNwZW5kZWQgd2hpbGUgb25lIGlzIGluIGZsaWdodCkuXG4gICAqL1xuICBvbkVuZCgpOiB2b2lkO1xufVxuXG4vKiogR2VzdHVyZSBzdGF0ZSwgY3JlYXRlZCBvbmNlIHRoZSBwb2ludGVyIHBhc3NlcyB0aGUgdGhyZXNob2xkICovXG5pbnRlcmZhY2UgRHJhZ1N0YXRlIHtcbiAgLyoqIFRoZSBzbGlkZXMgYmVpbmcgbW92ZWQsIGluIGNoYWluIG9yZGVyICovXG4gIG1vdmluZzogc3RyaW5nW107XG4gIC8qKiBUaGUgcmVuZGVyZWQgY2hhaW4gd2hlbiB0aGUgZ2VzdHVyZSBzdGFydGVkICh0aGUgZHJvcCdzIGZyYW1lIG9mIHJlZmVyZW5jZSkgKi9cbiAgY2hhaW46IHN0cmluZ1tdO1xuICAvKiogUG9pbnRlciB5IG9mIHRoZSBsYXN0IG1vdmUgXHUyMDE0IHRoZSBnaG9zdCBhbmQgdGhlIGluc2VydGlvbiBsaW5lIGZvbGxvdyBpdCAqL1xuICB5OiBudW1iZXI7XG4gIC8qKiBPZmZzZXQgb2YgdGhlIHBvaW50ZXIgaW5zaWRlIHRoZSBncmFiYmVkIGl0ZW0sIGtlcHQgYnkgdGhlIGdob3N0ICovXG4gIG9mZnNldFk6IG51bWJlcjtcbiAgLyoqIFRoZSBnYXAgdGhlIGRyb3Agd291bGQgbGFuZCBpbiwgcmVjb21wdXRlZCBieSBldmVyeSBwYWludCAqL1xuICBpbnNlcnRBdDogbnVtYmVyO1xuICAvKiogQ2xvbmUgb2YgdGhlIGdyYWJiZWQgaXRlbSB0aGF0IGZvbGxvd3MgdGhlIHBvaW50ZXIgKi9cbiAgZ2hvc3Q6IEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgLyoqIFRoZSAycHggbGluZSBtYXJraW5nIHRoZSBkcm9wIGdhcCAqL1xuICBsaW5lOiBIVE1MRWxlbWVudDtcbiAgLyoqIEhhbmRsZSBvZiB0aGUgYXV0by1zY3JvbGwgYW5pbWF0aW9uIGZyYW1lICovXG4gIHJhZjogbnVtYmVyO1xufVxuXG4vKiogRHJhZy10by1tb3ZlIGdlc3R1cmUgZm9yIGEgbGlzdCBvZiByZW5kZXJlZCBpdGVtcyAqL1xuZXhwb3J0IGNsYXNzIFBhbmVsRHJhZyB7XG4gIC8qKiBBIHByZXNzIHRoYXQgaGFzIG5vdCB0cmF2ZWxsZWQgZmFyIGVub3VnaCB0byBiZSBhIGRyYWcgeWV0ICovXG4gIHByaXZhdGUgcHJlc3M6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IHBhdGg6IHN0cmluZyB9IHwgbnVsbCA9IG51bGw7XG4gIC8qKiBUaGUgZHJhZyBpbiBmbGlnaHQsIG9yIG51bGwgd2hpbGUgdGhlIHByZXNzIGlzIHN0aWxsIGEgY2FuZGlkYXRlICovXG4gIHByaXZhdGUgc3RhdGU6IERyYWdTdGF0ZSB8IG51bGwgPSBudWxsO1xuICAvKiogV2hldGhlciB0aGUgbGFzdCBmaW5pc2hlZCBnZXN0dXJlIHdhcyBhIGRyYWcgXHUyMDE0IHN3YWxsb3dzIHRoZSBjbGljayBpdCBlbmRzIHdpdGggKi9cbiAgcHJpdmF0ZSBkcmFnZ2VkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBob3N0OiBEcmFnSG9zdCkge31cblxuICAvKiogV2hldGhlciBhIGRyYWcgaXMgaW4gZmxpZ2h0ICh0aGUgcGFuZWwgc3VzcGVuZHMgcmUtcmVuZGVyaW5nIG1lYW53aGlsZSkgKi9cbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBBYmFuZG9uIHRoZSBnZXN0dXJlIFx1MjAxNCB0aGUgdmlldyBpcyBjbG9zaW5nIHVuZGVyIGl0ICovXG4gIGNhbmNlbCgpOiB2b2lkIHtcbiAgICB0aGlzLmZpbmlzaCh0cnVlKTtcbiAgfVxuXG4gIC8qKiBBIHByZXNzIG9uIGFuIGl0ZW07IGl0IGJlY29tZXMgYSBkcmFnIG9uY2UgdGhlIHBvaW50ZXIgdHJhdmVscyBmYXIgZW5vdWdoICovXG4gIGJlZ2luKGV2ZW50OiBQb2ludGVyRXZlbnQsIHBhdGg6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChldmVudC5idXR0b24gIT09IDApIHJldHVybjtcbiAgICAvLyBFdmVyeSBsZWZ0IHByZXNzIGNsZWFycyB0aGUgcHJldmlvdXMgZ2VzdHVyZSdzIGNsaWNrIGZsYWc6IGEgZHJhZyB0aGF0XG4gICAgLy8gZW5kZWQgYXdheSBmcm9tIGl0cyBlbnRyeSBmaXJlcyBubyBjbGljayBvbiBpdCwgYW5kIGEgc3RhbGUgZmxhZyB3b3VsZFxuICAgIC8vIHN3YWxsb3cgYSBsYXRlciBjbGljayAodGhlIGZsYWcgaXMgb25seSBzYWZlIHRvIGxlYXZlIHNldCB1bnRpbCB0aGUgbmV4dFxuICAgIC8vIGxlZnQgcHJlc3MpLlxuICAgIHRoaXMuZHJhZ2dlZCA9IGZhbHNlO1xuICAgIC8vIEEgbW9kaWZpZWQgcHJlc3Mga2VlcHMgaXRzIHNlbGVjdGlvbiBtZWFuaW5nIChNb2QgdG9nZ2xlcyBhbiBpdGVtLCBTaGlmdFxuICAgIC8vIGV4dGVuZHMgdGhlIHJhbmdlKSwgc28gaXQgbXVzdCBub3QgYmVjb21lIGEgZHJhZyBpZiB0aGUgcG9pbnRlciBkcmlmdHMuXG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkgcmV0dXJuO1xuICAgIGlmICh0aGlzLnByZXNzIHx8IHRoaXMuc3RhdGUpIHJldHVybjtcbiAgICBpZiAodGhpcy5ob3N0Lml0ZW1zKCkubGVuZ3RoIDwgMikgcmV0dXJuOyAvLyBhIGxvbmUgc2xpZGUgaGFzIG5vd2hlcmUgdG8gZ29cbiAgICB0aGlzLnByZXNzID0geyB4OiBldmVudC5jbGllbnRYLCB5OiBldmVudC5jbGllbnRZLCBwYXRoIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMub25Nb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMub25VcCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgdGhpcy5vbkNhbmNlbCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5vbktleSwgdHJ1ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMub25DYW5jZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNsaWNrIHRoYXQgZW5kcyB0aGlzIGdlc3R1cmUgYmVsb25ncyB0byBhIGRyYWcuIFRydWUgYXQgbW9zdFxuICAgKiBvbmNlIHBlciBkcmFnLCBzbyBhIGRyYWcgZG9lcyBub3QgYWxzbyBvcGVuIHRoZSBzbGlkZSBpdCBtb3ZlZDsgYSBwbGFpblxuICAgKiBwcmVzcy1yZWxlYXNlIG5ldmVyIHNldHMgaXQuXG4gICAqL1xuICBjb25zdW1lQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZHJhZ2dlZCA9IHRoaXMuZHJhZ2dlZDtcbiAgICB0aGlzLmRyYWdnZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gZHJhZ2dlZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgb25Nb3ZlID0gKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBwcmVzcyA9IHRoaXMucHJlc3M7XG4gICAgaWYgKCFwcmVzcykgcmV0dXJuO1xuICAgIGlmICghdGhpcy5zdGF0ZSkge1xuICAgICAgaWYgKE1hdGguaHlwb3QoZXZlbnQuY2xpZW50WCAtIHByZXNzLngsIGV2ZW50LmNsaWVudFkgLSBwcmVzcy55KSA8IERSQUdfVEhSRVNIT0xEKSByZXR1cm47XG4gICAgICB0aGlzLnN0YXJ0KGV2ZW50LCBwcmVzcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhdGUueSA9IGV2ZW50LmNsaWVudFk7XG4gICAgdGhpcy5wYWludCgpO1xuICB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgb25VcCA9ICgpOiB2b2lkID0+IHRoaXMuZmluaXNoKGZhbHNlKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IG9uQ2FuY2VsID0gKCk6IHZvaWQgPT4gdGhpcy5maW5pc2godHJ1ZSk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBvbktleSA9IChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHRoaXMuZmluaXNoKHRydWUpO1xuICB9O1xuXG4gIC8qKiBUdXJuIHRoZSBjYW5kaWRhdGUgcHJlc3MgaW50byBhIGRyYWc6IGdob3N0LCBkaW1tZWQgaXRlbXMsIGluc2VydGlvbiBsaW5lICovXG4gIHByaXZhdGUgc3RhcnQoZXZlbnQ6IFBvaW50ZXJFdmVudCwgcHJlc3M6IHsgeTogbnVtYmVyOyBwYXRoOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgIGNvbnN0IG1vdmluZyA9IHRoaXMuaG9zdC5tb3ZpbmdGb3IocHJlc3MucGF0aCk7XG4gICAgaWYgKG1vdmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZmluaXNoKHRydWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdyYWJiZWQgPSB0aGlzLmhvc3QuaXRlbXMoKS5maW5kKChpdCkgPT4gaXQucGF0aCA9PT0gcHJlc3MucGF0aCk7XG4gICAgY29uc3QgcmVjdCA9IGdyYWJiZWQ/LmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxpbmUgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1kcm9wLWxpbmVcIiB9KTtcbiAgICBsaW5lLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IFwibm9uZVwiIH0pO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICBsZXQgZ2hvc3Q6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKGdyYWJiZWQgJiYgcmVjdCkge1xuICAgICAgZ2hvc3QgPSBncmFiYmVkLmVsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGdob3N0LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1hY3RpdmVcIiwgXCJpcy1zZWxlY3RlZFwiLCBcImlzLWRyYWdnaW5nXCIpO1xuICAgICAgZ2hvc3QuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWRyYWctZ2hvc3RcIik7XG4gICAgICBnaG9zdC5zZXRDc3NTdHlsZXMoe1xuICAgICAgICBsZWZ0OiBgJHtyZWN0LmxlZnR9cHhgLFxuICAgICAgICB0b3A6IGAke3JlY3QudG9wfXB4YCxcbiAgICAgICAgd2lkdGg6IGAke3JlY3Qud2lkdGh9cHhgLFxuICAgICAgfSk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGdob3N0KTtcbiAgICB9XG5cbiAgICBjb25zdCBtb3ZpbmdTZXQgPSBuZXcgU2V0KG1vdmluZyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaG9zdC5pdGVtcygpKSB7XG4gICAgICBpZiAobW92aW5nU2V0LmhhcyhpdGVtLnBhdGgpKSBpdGVtLmVsLmFkZENsYXNzKFwiaXMtZHJhZ2dpbmdcIik7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLWRyYWdnaW5nXCIpO1xuICAgIC8vIEEgcHJlc3MgbWF5IGFscmVhZHkgaGF2ZSBzdGFydGVkIHNlbGVjdGluZyB0ZXh0IFx1MjAxNCBhIGRyYWcgaXMgbm90IGEgc2VsZWN0aW9uXG4gICAgd2luZG93LmdldFNlbGVjdGlvbigpPy5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB0aGlzLmhvc3Qub25HcmFiKHByZXNzLnBhdGgpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1vdmluZyxcbiAgICAgIGNoYWluOiB0aGlzLmhvc3QuaXRlbXMoKS5tYXAoKGl0KSA9PiBpdC5wYXRoKSxcbiAgICAgIHk6IGV2ZW50LmNsaWVudFksXG4gICAgICBvZmZzZXRZOiByZWN0ID8gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIDogMCxcbiAgICAgIGluc2VydEF0OiAwLFxuICAgICAgZ2hvc3QsXG4gICAgICBsaW5lLFxuICAgICAgcmFmOiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc2Nyb2xsVGljayksXG4gICAgfTtcbiAgICB0aGlzLnBhaW50KCk7XG4gIH1cblxuICAvKiogRW5kIHRoZSBnZXN0dXJlOiBjb21taXQgYSByZWFsIGRyb3AsIG9yIGNsZWFuIHVwIGFmdGVyIGEgY2FuY2VsICovXG4gIHByaXZhdGUgZmluaXNoKGNhbmNlbGxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLnByZXNzID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gbnVsbDtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5vbk1vdmUpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5vblVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcmNhbmNlbFwiLCB0aGlzLm9uQ2FuY2VsKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5LCB0cnVlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5vbkNhbmNlbCk7XG4gICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuXG4gICAgLy8gRXZlbiBhIGNhbmNlbGxlZCBkcmFnIG11c3Qgc3dhbGxvdyBpdHMgY2xpY2s6IHJlbGVhc2luZyB0aGUgYnV0dG9uIGFmdGVyXG4gICAgLy8gRXNjYXBlIHdvdWxkIG90aGVyd2lzZSBvcGVuIHRoZSBzbGlkZSB0aGF0IHdhcyBkcmFnZ2VkLlxuICAgIHRoaXMuZHJhZ2dlZCA9IHRydWU7XG4gICAgc3RhdGUuZ2hvc3Q/LnJlbW92ZSgpO1xuICAgIHN0YXRlLmxpbmUucmVtb3ZlKCk7XG4gICAgY29uc3QgbW92aW5nU2V0ID0gbmV3IFNldChzdGF0ZS5tb3ZpbmcpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmhvc3QuaXRlbXMoKSkge1xuICAgICAgaWYgKG1vdmluZ1NldC5oYXMoaXRlbS5wYXRoKSkgaXRlbS5lbC5yZW1vdmVDbGFzcyhcImlzLWRyYWdnaW5nXCIpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNsYXNzKFwibmF0aXZlLXNsaWRlcy1kcmFnZ2luZ1wiKTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoc3RhdGUucmFmKTtcblxuICAgIGlmICghY2FuY2VsbGVkKSB0aGlzLmhvc3Qub25Ecm9wKHN0YXRlLm1vdmluZywgc3RhdGUuaW5zZXJ0QXQsIHN0YXRlLmNoYWluKTtcbiAgICAvLyBBIHJlZnVzZWQgb3Igbm8tb3AgZHJvcCByZXR1cm5zIGZyb20gYG9uRHJvcGAgd2l0aG91dCByZW5kZXJpbmcsIGFuZCBhXG4gICAgLy8gY2FuY2VsIG5ldmVyIHJlbmRlcnMgZWl0aGVyIFx1MjAxNCB0aGlzIGlzIHRoZSBvbmUgcmVwbGF5IHBhdGggZm9yIGFsbCB0aHJlZS5cbiAgICB0aGlzLmhvc3Qub25FbmQoKTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRoZSBnaG9zdCB0byB0aGUgcG9pbnRlciBhbmQgdGhlIGluc2VydGlvbiBsaW5lIHRvIHRoZSBuZWFyZXN0IGdhcCAqL1xuICBwcml2YXRlIHBhaW50KCk6IHZvaWQge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoIXN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBSZWFkIGV2ZXJ5IHJlY3QgQkVGT1JFIHdyaXRpbmcgdGhlIGdob3N0J3MgcG9zaXRpb246IGEgd3JpdGUgZmlyc3Qgd291bGRcbiAgICAvLyBtYWtlIGVhY2ggb2YgdGhlc2UgcmVhZHMgZm9yY2UgYSBzeW5jaHJvbm91cyBsYXlvdXQgb2YgdGhlIHBhbmVsLlxuICAgIC8vIFRoZSBnYXBzIGFyZSB0aGUgaXRlbXMnIGVkZ2VzIFx1MjAxNCB0aGUgdG9wIG9mIGVhY2ggc2xpZGUsIHBsdXMgdGhlIGJvdHRvbSBvZlxuICAgIC8vIHRoZSBsYXN0IG9uZSAod2hpY2ggY2xvc2VzIHRoZSBsaXN0KS5cbiAgICBjb25zdCByZWN0cyA9IHRoaXMuaG9zdC5pdGVtcygpLm1hcCgoaXQpID0+IGl0LmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBjb25zdCBlZGdlcyA9IHJlY3RzLm1hcCgocmVjdCkgPT4gcmVjdC50b3ApO1xuICAgIGNvbnN0IGxhc3QgPSByZWN0c1tyZWN0cy5sZW5ndGggLSAxXTtcbiAgICBpZiAobGFzdCkgZWRnZXMucHVzaChsYXN0LmJvdHRvbSk7XG5cbiAgICBsZXQgYmVzdCA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBmb3IgKGxldCBnYXAgPSAwOyBnYXAgPCBlZGdlcy5sZW5ndGg7IGdhcCsrKSB7XG4gICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKHN0YXRlLnkgLSBlZGdlc1tnYXBdKTtcbiAgICAgIGlmIChkaXN0YW5jZSA8IGJlc3QpIHtcbiAgICAgICAgYmVzdCA9IGRpc3RhbmNlO1xuICAgICAgICBzdGF0ZS5pbnNlcnRBdCA9IGdhcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBnYXAgPSBzdGF0ZS5pbnNlcnRBdDtcbiAgICBjb25zdCByZWYgPSBnYXAgPCByZWN0cy5sZW5ndGggPyByZWN0c1tnYXBdIDogbGFzdDtcbiAgICBzdGF0ZS5naG9zdD8uc2V0Q3NzU3R5bGVzKHsgdG9wOiBgJHtzdGF0ZS55IC0gc3RhdGUub2Zmc2V0WX1weGAgfSk7XG4gICAgaWYgKCFyZWYgfHwgIXRoaXMuaG9zdC53aWxsQ2hhbmdlKHN0YXRlLm1vdmluZywgZ2FwKSkge1xuICAgICAgc3RhdGUubGluZS5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3RhdGUubGluZS5zZXRDc3NTdHlsZXMoe1xuICAgICAgZGlzcGxheTogXCJcIixcbiAgICAgIHRvcDogYCR7Z2FwIDwgcmVjdHMubGVuZ3RoID8gcmVmLnRvcCA6IHJlZi5ib3R0b219cHhgLFxuICAgICAgbGVmdDogYCR7cmVmLmxlZnQgKyA2fXB4YCxcbiAgICAgIHdpZHRoOiBgJHtNYXRoLm1heCgwLCByZWYud2lkdGggLSAxMil9cHhgLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEtlZXAgdGhlIGxpc3Qgc2Nyb2xsaW5nIHdoaWxlIHRoZSBwb2ludGVyIHNpdHMgaW4gYW4gZWRnZSBiYW5kICovXG4gIHByaXZhdGUgcmVhZG9ubHkgc2Nyb2xsVGljayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuaG9zdC5jb250YWluZXIoKTtcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCByZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgZHkgPVxuICAgICAgICBzdGF0ZS55IDwgcmVjdC50b3AgKyBFREdFX0JBTkRcbiAgICAgICAgICA/IC1FREdFX1NQRUVEXG4gICAgICAgICAgOiBzdGF0ZS55ID4gcmVjdC5ib3R0b20gLSBFREdFX0JBTkRcbiAgICAgICAgICAgID8gRURHRV9TUEVFRFxuICAgICAgICAgICAgOiAwO1xuICAgICAgaWYgKGR5ICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IGNvbnRhaW5lci5zY3JvbGxUb3A7XG4gICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AgPSBiZWZvcmUgKyBkeTtcbiAgICAgICAgaWYgKGNvbnRhaW5lci5zY3JvbGxUb3AgIT09IGJlZm9yZSkgdGhpcy5wYWludCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0ZS5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc2Nyb2xsVGljayk7XG4gIH07XG59XG4iLCAiLyoqXG4gKiBtb3ZlLnRzIFx1MjAxNCBQdXJlIFwibW92ZSBzbGlkZXNcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXQgY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5XG4gKiAoc2VlIHRlc3QvbW92ZS50ZXN0LnRzKS4gVGhlIGFkYXB0ZXIgaW4gZGVjay1zZXJ2aWNlLnRzIGFwcGxpZXMgdGhlIHBsYW46XG4gKiBpdCByZXdyaXRlcyB0aGUgYGRlY2tgIHByb3BlcnRpZXMgb2YgdGhlIG5vdGVzIHdob3NlIG5leHQgbGluayBjaGFuZ2VkLlxuICpcbiAqIEEgZGVjayBzdG9yZXMgbm8gb3JkZXIgb2YgaXRzIG93biBcdTIwMTQgdGhlIG9yZGVyICppcyogdGhlIG5leHQtbGluayBjaGFpblxuICogKHNlZSBzcmMvZGVjay50cykuIE1vdmluZyBzbGlkZXMgaXMgdGhlcmVmb3JlIGEgKipyZXdpcmluZyoqLCBub3QgYSB3cml0ZVxuICogb2YgYSBuZXcgb3JkZXIgcHJvcGVydHk6IHRoZSBtb3Zpbmcgc2xpZGVzIGJlY29tZSBvbmUgYmxvY2sgaW5zZXJ0ZWQgYXQgYVxuICogZ2FwLCBhbmQgZXZlcnkgbm90ZSB3aG9zZSBuZXh0IGxpbmsgaXMgZGlmZmVyZW50IGFmdGVyd2FyZHMgZ2V0c1xuICogcmV3cml0dGVuLiBUaGUgaGVhZCBzbGlkZSBuZWVkcyBubyBtYXJrZXIgKGl0IGlzIHNpbXBseSBgY2hhaW5bMF1gKSwgYW5kXG4gKiB0aGUgbmV3IGxhc3Qgc2xpZGUgZW5kcyB0aGUgY2hhaW4gd2l0aCBgZGVjazogW11gIFx1MjAxNCB0aGUgc2FtZSBzaGFwZVxuICogY3JlYXRlTmV4dCBhbmQgZGVsZXRlU2xpZGVzIHdyaXRlLCBzbyBub3RoaW5nIGVsc2UgaW4gdGhlIHBsdWdpbiBoYXMgdG9cbiAqIGtub3cgdGhhdCBhIG1vdmUgaGFwcGVuZWQuXG4gKi9cblxuLyoqIE9uZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBtdXN0IGJlIHJld3JpdHRlbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb3ZlUmV3cml0ZSB7XG4gIC8qKiBWYXVsdCBwYXRoIG9mIHRoZSBub3RlIHRvIHJld3JpdGUgKi9cbiAgcGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0aGF0IHNob3VsZCBiZWNvbWUgdGhpcyBub3RlJ3MgbmV4dCBzbGlkZSxcbiAgICogb3IgbnVsbCB3aGVuIHRoZSBub3RlIGJlY29tZXMgdGhlIG5ldyBsYXN0IHNsaWRlIChgZGVjazogW11gKS5cbiAgICovXG4gIG5leHRQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKiogVGhlIHJlc3VsdCBvZiBwbGFubmluZyBhIG1vdmUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTW92ZVBsYW4ge1xuICAvKiogVGhlIGNoYWluIGFmdGVyIHRoZSBtb3ZlIChbMF0gPSB0aGUgbmV3IGhlYWQgc2xpZGUpICovXG4gIGNoYWluOiBzdHJpbmdbXTtcbiAgLyoqXG4gICAqIE5vdGVzIHdob3NlIG5leHQgbGluayBkaWZmZXJzIGFmdGVyd2FyZHMsIGluIG5ldyBjaGFpbiBvcmRlci4gRW1wdHkgd2hlblxuICAgKiB0aGUgZHJvcCBkb2VzIG5vdCBjaGFuZ2UgdGhlIG9yZGVyIFx1MjAxNCBjYWxsZXJzIG11c3QgdGhlbiB3cml0ZSBub3RoaW5nLlxuICAgKi9cbiAgcmV3cml0ZXM6IE1vdmVSZXdyaXRlW107XG59XG5cbi8qKlxuICogUGxhbiBtb3ZpbmcgYG1vdmluZ2AgdG8gdGhlIGluc2VydGlvbiBnYXAgYGluc2VydEF0YC5cbiAqXG4gKiBgaW5zZXJ0QXRgIGlzIGEgKipnYXAqKiBpbmRleCwgbm90IGFuIGl0ZW0gaW5kZXg6IDAgPSBiZWZvcmUgdGhlIGZpcnN0XG4gKiBzbGlkZSAodGhlIGJsb2NrIGJlY29tZXMgdGhlIG5ldyBoZWFkKSwgYGNoYWluLmxlbmd0aGAgPSBhZnRlciB0aGUgbGFzdFxuICogc2xpZGUgKHRoZSBibG9jayBiZWNvbWVzIHRoZSBuZXcgdGFpbCksIGFuZCBhbnkgb3RoZXIgdmFsdWUgYGdgID0gYmVmb3JlXG4gKiBgY2hhaW5bZ11gLiBUaGUgbW92aW5nIHNsaWRlcyBhcmUgaW5zZXJ0ZWQgYXMgT05FIGJsb2NrIGluIHRoZWlyIGN1cnJlbnRcbiAqIGNoYWluIG9yZGVyLCBhbmQgZXZlcnkgc2xpZGUgdGhhdCBpcyBub3QgbW92aW5nIGtlZXBzIGl0cyByZWxhdGl2ZSBvcmRlciBcdTIwMTRcbiAqIHNvIGEgbm9uLWNvbnRpZ3VvdXMgc2VsZWN0aW9uIG1vdmVzIGFzIGEgYmxvY2tcbiAqIChgWzEsMiwzLDQsNV1gIG1vdmluZyBgezIsNH1gIHRvIHRoZSBlbmQgXHUyMTkyIGBbMSwzLDUsMiw0XWApLlxuICpcbiAqIFJldHVybnMgbnVsbCB3aGVuIHRoZXJlIGlzIG5vdGhpbmcgdG8gcGxhbjogYSBjaGFpbiBvZiBmZXdlciB0aGFuIHR3b1xuICogc2xpZGVzLCBhbiBlbXB0eSBtb3Zpbmcgc2V0LCBldmVyeSBzbGlkZSBtb3ZpbmcgKG5vIGFuY2hvciBsZWZ0IHRvIGhhbmdcbiAqIHRoZSBibG9jayBmcm9tKSwgb3IgYW4gYGluc2VydEF0YCB0aGF0IGlzIG5vdCBhbiBpbnRlZ2VyIGluc2lkZVxuICogYDAuLmNoYWluLmxlbmd0aGAuIFBhdGhzIGluIGBtb3ZpbmdgIHRoYXQgYXJlIG5vdCBpbiB0aGUgY2hhaW4gYXJlIGlnbm9yZWRcbiAqIChhcyBpbiBwbGFuRGVsZXRlU2xpZGVzKS4gQSBnYXAgaW5zaWRlIHRoZSBtb3ZpbmcgYmxvY2sgaXRzZWxmIGlzIGFcbiAqIGxlZ2l0aW1hdGUgbm8tb3A6IHRoZSBwbGFuIGNvbWVzIGJhY2sgd2l0aCBhbiB1bmNoYW5nZWQgY2hhaW4gYW5kIG5vXG4gKiByZXdyaXRlcywgc28gYSBkcm9wIHRoYXQgY2hhbmdlcyBub3RoaW5nIHdyaXRlcyBub3RoaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbk1vdmUoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgbW92aW5nOiByZWFkb25seSBzdHJpbmdbXSxcbiAgaW5zZXJ0QXQ6IG51bWJlcixcbik6IE1vdmVQbGFuIHwgbnVsbCB7XG4gIGlmIChjaGFpbi5sZW5ndGggPCAyKSByZXR1cm4gbnVsbDtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGluc2VydEF0KSB8fCBpbnNlcnRBdCA8IDAgfHwgaW5zZXJ0QXQgPiBjaGFpbi5sZW5ndGgpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IG1vdmluZ1NldCA9IG5ldyBTZXQobW92aW5nKTtcbiAgY29uc3QgYmxvY2sgPSBjaGFpbi5maWx0ZXIoKHBhdGgpID0+IG1vdmluZ1NldC5oYXMocGF0aCkpO1xuICBpZiAoYmxvY2subGVuZ3RoID09PSAwIHx8IGJsb2NrLmxlbmd0aCA9PT0gY2hhaW4ubGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCByZXN0ID0gY2hhaW4uZmlsdGVyKChwYXRoKSA9PiAhbW92aW5nU2V0LmhhcyhwYXRoKSk7XG4gIC8vIEhvdyBtYW55IG5vbi1tb3Zpbmcgc2xpZGVzIHByZWNlZGUgdGhlIGdhcCBcdTIwMTQgdGhhdCBpcyB3aGVyZSB0aGUgYmxvY2tcbiAgLy8gbGFuZHMgb25jZSB0aGUgbW92aW5nIHNsaWRlcyBhcmUgbGlmdGVkIG91dCBvZiB0aGUgY2hhaW4uIENvdW50aW5nIHRoZVxuICAvLyBzdXJ2aXZvcnMgKGluc3RlYWQgb2YgdXNpbmcgYGluc2VydEF0YCBkaXJlY3RseSkgaXMgd2hhdCBtYWtlcyBhIGdhcFxuICAvLyBpbnNpZGUgdGhlIGJsb2NrIGl0c2VsZiByZXNvbHZlIHRvIFwibm8gbW92ZVwiLlxuICBjb25zdCBiZWZvcmUgPSBjaGFpbi5zbGljZSgwLCBpbnNlcnRBdCkuZmlsdGVyKChwYXRoKSA9PiAhbW92aW5nU2V0LmhhcyhwYXRoKSkubGVuZ3RoO1xuICBjb25zdCBuZXh0ID0gWy4uLnJlc3Quc2xpY2UoMCwgYmVmb3JlKSwgLi4uYmxvY2ssIC4uLnJlc3Quc2xpY2UoYmVmb3JlKV07XG5cbiAgY29uc3Qgb2xkTmV4dCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmcgfCBudWxsPigpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSBvbGROZXh0LnNldChjaGFpbltpXSwgY2hhaW5baSArIDFdID8/IG51bGwpO1xuXG4gIGNvbnN0IHJld3JpdGVzOiBNb3ZlUmV3cml0ZVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbmV4dC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IG5ld05leHQgPSBuZXh0W2kgKyAxXSA/PyBudWxsO1xuICAgIGlmIChvbGROZXh0LmdldChuZXh0W2ldKSAhPT0gbmV3TmV4dCkgcmV3cml0ZXMucHVzaCh7IHBhdGg6IG5leHRbaV0sIG5leHRQYXRoOiBuZXdOZXh0IH0pO1xuICB9XG4gIHJldHVybiB7IGNoYWluOiBuZXh0LCByZXdyaXRlcyB9O1xufVxuXG4vKipcbiAqIFRoZSBpbnNlcnRpb24gZ2FwIGZvciBtb3ZpbmcgYG1vdmluZ2Agb25lIHN0ZXAgdG93YXJkcyBgZGlyZWN0aW9uYCBcdTIwMTQgdGhlXG4gKiBwbGFuIGJlaGluZCB0aGUgc2xpZGVzIHBhbmVsJ3MgTW92ZSB1cCAvIE1vdmUgZG93biBtZW51IGl0ZW1zLiBSZXR1cm5zIG51bGxcbiAqIHdoZW4gdGhlIGJsb2NrIGFscmVhZHkgc2l0cyBhdCB0aGF0IGVuZCBvZiB0aGUgY2hhaW4gKG9yIGBtb3ZpbmdgIG5hbWVzIG5vXG4gKiBjaGFpbiBtZW1iZXIgYXQgYWxsKSwgd2hpY2ggaXMgd2hhdCBsZXRzIHRoZSBjYWxsZXIgZGlzYWJsZSB0aGUgYWN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RlcEluc2VydEF0KFxuICBjaGFpbjogc3RyaW5nW10sXG4gIG1vdmluZzogcmVhZG9ubHkgc3RyaW5nW10sXG4gIGRpcmVjdGlvbjogXCJ1cFwiIHwgXCJkb3duXCIsXG4pOiBudW1iZXIgfCBudWxsIHtcbiAgY29uc3QgbW92aW5nU2V0ID0gbmV3IFNldChtb3ZpbmcpO1xuICBjb25zdCBmaXJzdCA9IGNoYWluLmZpbmRJbmRleCgocGF0aCkgPT4gbW92aW5nU2V0LmhhcyhwYXRoKSk7XG4gIGlmIChmaXJzdCA9PT0gLTEpIHJldHVybiBudWxsO1xuXG4gIGxldCBsYXN0ID0gZmlyc3Q7XG4gIGZvciAobGV0IGkgPSBjaGFpbi5sZW5ndGggLSAxOyBpID4gZmlyc3Q7IGktLSkge1xuICAgIGlmIChtb3ZpbmdTZXQuaGFzKGNoYWluW2ldKSkge1xuICAgICAgbGFzdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBPbmUgc3RlcCBwYXN0IHRoZSBibG9jaydzIGZhciBlbmQ6IGZvciBcImRvd25cIiB0aGF0IGlzIHRoZSBnYXAgYWZ0ZXIgdGhlXG4gIC8vIHNsaWRlIHRoYXQgZm9sbG93cyB0aGUgYmxvY2sgKGxhc3QgKyAyLCBzaW5jZSBnYXBzIHNpdCBiZXR3ZWVuIHNsaWRlcykuXG4gIGlmIChkaXJlY3Rpb24gPT09IFwidXBcIikgcmV0dXJuIGZpcnN0ID4gMCA/IGZpcnN0IC0gMSA6IG51bGw7XG4gIHJldHVybiBsYXN0IDwgY2hhaW4ubGVuZ3RoIC0gMSA/IGxhc3QgKyAyIDogbnVsbDtcbn1cbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCB0eXBlIFNldHRpbmdEZWZpbml0aW9uSXRlbSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBTTElERVNfVEhFTUVTIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBTZXR0aW5ncyB0YWI6IHRvZ2dsZXMgdGhlIG5hdiBidXR0b25zLCBwYWdlIG51bWJlciwgYXV0by1lbnRlciBhbmQgYmFyXG4gKiB2aXNpYmlsaXR5LiBEZWNsYXJhdGl2ZSBkZWZpbml0aW9ucyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCwgc2VhcmNoYWJsZSBpbiB0aGVcbiAqIHNldHRpbmdzIG1vZGFsKSB3aXRoIGFuIGltcGVyYXRpdmUgYGRpc3BsYXkoKWAgZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zLlxuICovXG5leHBvcnQgY2xhc3MgTmF0aXZlU2xpZGVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKSB7XG4gICAgc3VwZXIocGx1Z2luLmFwcCwgcGx1Z2luKTtcbiAgfVxuXG4gIC8qKiBEZWNsYXJhdGl2ZSBzZXR0aW5ncyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCkgXHUyMDE0IHNlYXJjaGFibGUgYnkgdGhlIHNldHRpbmdzIG1vZGFsLiAqL1xuICBnZXRTZXR0aW5nRGVmaW5pdGlvbnMoKTogU2V0dGluZ0RlZmluaXRpb25JdGVtW10ge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU3R5bGUgdGVtcGxhdGVcIixcbiAgICAgICAgZGVzYzogXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgc2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICBrZXk6IFwic2xpZGVzVGhlbWVcIixcbiAgICAgICAgICB0eXBlOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgb3B0aW9uczogT2JqZWN0LmZyb21FbnRyaWVzKFNMSURFU19USEVNRVMubWFwKCh0KSA9PiBbdC5pZCwgdC5sYWJlbF0pKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ2VudGVyIGltYWdlc1wiLFxuICAgICAgICBkZXNjOiBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImltYWdlTGF5b3V0XCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgYmFyXCIsXG4gICAgICAgIGRlc2M6IFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93U2xpZGVzQmFyXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcmV2aW91cy9uZXh0IGJ1dHRvbnNcIixcbiAgICAgICAgZGVzYzogXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dOYXZCdXR0b25zXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiUGFnZSBudW1iZXIgc3R5bGVcIixcbiAgICAgICAgZGVzYzogJ1Nob3duIGF0IHRoZSBib3R0b20tcmlnaHQuIFwibiAvIHRvdGFsXCI6IDEtYmFzZWQgb3ZlciB0aGUgd2hvbGUgZGVjayBjaGFpbiAoaGVhZCBzbGlkZSA9IDEpLiBcIm5cIjoganVzdCB0aGUgY3VycmVudCBwYWdlIG51bWJlci4gXCJub25lXCI6IGhpZGRlbi4nLFxuICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAga2V5OiBcInBhZ2VOdW1iZXJTdHlsZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZHJvcGRvd25cIixcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBmcmFjdGlvbjogXCJOIC8gVG90YWxcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IFwiTlwiLFxuICAgICAgICAgICAgbm9uZTogXCJOb25lXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcm9ncmVzcyBiYXJcIixcbiAgICAgICAgZGVzYzogXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dQcm9ncmVzc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIixcbiAgICAgICAgZGVzYzogXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiYXV0b0VudGVyU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIsXG4gICAgICAgIGRlc2M6IFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiZXNjRXhpdHNTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTbGlkZXMgdGl0bGVcIixcbiAgICAgICAgZGVzYzogXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUgXHUyMDE0IHRoYXQgdGl0bGUgaXMgZWRpdGFibGUgKHJlbmFtZXMgdGhlIG5vdGUpOyBwcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIGFyZSByZWFkLW9ubHkgKGVkaXQgdGhlIHByb3BlcnR5IG91dHNpZGUgc2xpZGVzIG1vZGUpLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzbGlkZXNUaXRsZVwiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiRS5nLiBUaXRsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkJhciBwcm9wZXJ0aWVzXCIsXG4gICAgICAgIGRlc2M6IFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJiYXJQcm9wZXJ0aWVzXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJDb25maXJtIHNsaWRlIGRlbGV0aW9uXCIsXG4gICAgICAgIGRlc2M6IFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJjb25maXJtRGVsZXRlU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiTmF2aWdhdGlvbiBob3RrZXlzXCIsXG4gICAgICAgIGRlc2M6IFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgLyoqIFBlcnNpc3QgY29udHJvbCBjaGFuZ2VzLCB0aGVuIHJlZnJlc2ggdGhlIGJhciBzbyB0aGUgbmV3IHNldHRpbmcgYXBwbGllcy4gKi9cbiAgc2V0Q29udHJvbFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQge1xuICAgIHZvaWQgdGhpcy5hcHBseUNvbnRyb2xWYWx1ZShrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYXBwbHlDb250cm9sVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgKHRoaXMucGx1Z2luLnNldHRpbmdzIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW2tleV0gPSB2YWx1ZTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cblxuICAvKiogSW1wZXJhdGl2ZSBmYWxsYmFjayBmb3IgT2JzaWRpYW4gPCAxLjEzLjAgKG5vdCBjYWxsZWQgd2l0aCBkZWZpbml0aW9ucyBwcmVzZW50KS4gKi9cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3R5bGUgdGVtcGxhdGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkJ1aWx0LWluIGxvb2sgZm9yIHRoZSBzbGlkZXMgY2FyZCBhbmQgc2xpZGVzIGJhciAoYm9yZGVyLCBiYWNrZ3JvdW5kLCBzaGFkb3csIGJhciBzdHlsaW5nKS4gRXZlcnkgdGVtcGxhdGUgYWRhcHRzIHRvIGxpZ2h0IGFuZCBkYXJrIHRoZW1lcy5cIixcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIFNMSURFU19USEVNRVMpIGRyb3Bkb3duLmFkZE9wdGlvbih0LmlkLCB0LmxhYmVsKTtcbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGhlbWUpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNlbnRlciBpbWFnZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbWFnZUxheW91dCkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW1hZ2VMYXlvdXQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHNsaWRlcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0Jhcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0JhciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJldmlvdXMvbmV4dCBidXR0b25zXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQYWdlIG51bWJlciBzdHlsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIm4gLyB0b3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJuXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwibm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbnMoe1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPSB2YWx1ZSBhcyBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJvZ3Jlc3MgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFc2NhcGUgZXhpdHMgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2xpZGVzIHRpdGxlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkUuZy4gVGl0bGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJCYXIgcHJvcGVydGllc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29uZmlybSBzbGlkZSBkZWxldGlvblwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTmF2aWdhdGlvbiBob3RrZXlzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEZWZhdWx0OiBQcmV2aW91cyBwYWdlIG1vZCtzaGlmdCtcdTIxOTAsIG5leHQgcGFnZSBtb2Qrc2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgc2V0dGluZ3MgXHUyMTkyIGhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+XG4gICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiT3BlbiBob3RrZXlzIHNldHRpbmdzXCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgfVxufVxuIiwgIi8qKiBSZW1vdmUgYWxsIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNoaWxkcmVuKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE2QkEsSUFBQUEsbUJBQTRDOzs7QUM1QnJDLFNBQVMsWUFBeUI7QUFDdkMsUUFBTSxNQUFNLFVBQVUsRUFBRSxLQUFLLG9CQUFvQixDQUFDO0FBQ2xELE1BQUksYUFBYSxFQUFFLFNBQVMsT0FBTyxDQUFDO0FBQ3BDLE1BQUksUUFBUTtBQUlaLE1BQUksaUJBQWlCLGFBQWEsQ0FBQyxNQUFNO0FBQ3ZDLE1BQUUsZUFBZTtBQUNqQixVQUFNLFNBQVMsU0FBUztBQUN4QixRQUFJLGtCQUFrQixlQUFlLFdBQVcsU0FBUyxLQUFNLFFBQU8sS0FBSztBQUFBLEVBQzdFLENBQUM7QUFDRCxTQUFPO0FBQ1Q7QUFHTyxTQUFTLFVBQ2QsT0FDQSxLQUNBLFNBQ0EsV0FBVyxPQUNRO0FBQ25CLFFBQU0sTUFBTSxTQUFTLFVBQVU7QUFBQSxJQUM3QixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFD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LE9BQU8sU0FBUyxHQUFHO0FBQ3JCLFlBQU0sT0FBTyxXQUFXO0FBQUEsUUFDdEIsS0FBSztBQUFBLFFBQ0wsTUFBTSxZQUFPLE9BQU8sS0FBSyxJQUFJO0FBQUEsUUFDN0IsTUFBTSxFQUFFLE9BQU8sNERBQXVEO0FBQUEsTUFDeEUsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLG9CQUFvQixVQUFVLE1BQU07QUFHcEQsWUFBTSxRQUFRLEtBQUssTUFBTTtBQUN6QixZQUFNLE9BQU8sV0FBVztBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLE1BQ0UsS0FBSyxTQUFTLG9CQUFvQixhQUM5QixHQUFHLEtBQUssUUFBUSxDQUFDLE1BQU0sS0FBSyxLQUM1QixHQUFHLEtBQUssUUFBUSxDQUFDO0FBQUEsTUFDekIsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLGdCQUFnQixRQUFRLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFDL0QsWUFBTSxXQUFXLFVBQVUsRUFBRSxLQUFLLHlCQUF5QixDQUFDO0FBQzVELGVBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVEsS0FBSztBQUMxQyxjQUFNLFFBQVEsSUFBSSxLQUFLLFFBQVEsU0FBUyxNQUFNLEtBQUssUUFBUSxZQUFZO0FBQ3ZFLGNBQU0sTUFBTSxVQUFVO0FBQUEsVUFDcEIsS0FBSywwREFBMEQsS0FBSztBQUFBLFFBQ3RFLENBQUM7QUFDRCxZQUFJLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGlCQUFTLFlBQVksR0FBRztBQUFBLE1BQzFCO0FBQ0EsV0FBSyxJQUFJLFlBQVksUUFBUTtBQUFBLElBQy9CO0FBSUEsU0FBSyxJQUFJLGFBQWEsRUFBRSxTQUFTLEtBQUssSUFBSSxzQkFBc0IsSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUFBLEVBQ25GO0FBQ0Y7QUFHQSxTQUFTLGFBQWEsT0FBZ0IsT0FBa0M7QUFDdEUsU0FDRSxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sV0FBVyxTQUFTLE1BQU0sTUFBTSxDQUFDLE1BQU0sT0FBTyxNQUFNLFFBQVE7QUFFOUY7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAibmV3TmFtZSIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImdhcCIsICJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
