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
   * Apply a reorder plan: rewrite the `deck` property of every slide whose
   * next link changed, in new chain order, as bare `[[basename]]` links (the
   * form createNext and deleteSlides write). Only the notes the plan names are
   * touched — the rest of the deck keeps its frontmatter untouched.
   *
   * Stops at the first failed write and returns false: the remaining notes
   * keep their old links, which the caller shows by re-rendering from the live
   * chain. Returns true when every rewrite was applied.
   */
  async executeReorder(plan) {
    for (const rewrite of plan.rewrites) {
      const file = this.app.vault.getAbstractFileByPath(rewrite.path);
      if (!(file instanceof import_obsidian5.TFile)) {
        new import_obsidian5.Notice(`Native slides: could not reorder slides \u2014 "${rewrite.path}" is gone`);
        return false;
      }
      const next = rewrite.nextPath ? this.app.vault.getAbstractFileByPath(rewrite.nextPath) : null;
      try {
        await this.app.fileManager.processFrontMatter(file, (fm) => {
          fm[DECK_KEY] = next instanceof import_obsidian5.TFile ? [`[[${next.basename}]]`] : [];
        });
      } catch (error) {
        new import_obsidian5.Notice(
          `Native slides: could not reorder slides \u2014 writing "${file.basename}" failed (${String(error)})`
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
   * Re-base the session on a different chain head. A reorder rewires the deck
   * around the session, so the head it entered may no longer be the deck's
   * head (and, still reaching the current note, would walk a truncated chain
   * from the middle); the caller hands over the reordered chain's own head.
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
    if (event.button !== 0 || this.press || this.state) return;
    if (this.host.items().length < 2) return;
    this.dragged = false;
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

// src/reorder.ts
function planReorder(chain, moving, insertAt) {
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
    /** Whether a reorder is writing frontmatter right now (renders are held back) */
    this.writing = false;
    this.drag = new PanelDrag({
      items: () => this.items,
      movingFor: (path) => this.movingFor(path),
      container: () => this.contentEl,
      onGrab: (path) => this.onGrab(path),
      willChange: (moving, insertAt) => this.willChange(moving, insertAt),
      onDrop: (moving, insertAt, snapshot) => void this.applyReorder(moving, insertAt, snapshot)
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
    const plan = planReorder(this.lastChain, moving, insertAt);
    return plan !== null && plan.rewrites.length > 0;
  }
  /** Move the given slides one step towards `direction` (context menu) */
  moveStep(moving, direction) {
    const insertAt = stepInsertAt(this.lastChain, moving, direction);
    if (insertAt === null) return;
    void this.applyReorder(moving, insertAt, this.lastChain);
  }
  /**
   * Apply a move: plan it against the live chain, then let the deck service
   * rewire the `deck` links of the slides whose next link changes. `snapshot`
   * is the chain the gesture (or the menu action) was computed against — when
   * the deck changed meanwhile the gap index means nothing, so the move is
   * dropped rather than applied to a deck it no longer describes.
   */
  async applyReorder(moving, insertAt, snapshot) {
    const chain = this.liveChain(this.app.workspace.getActiveFile());
    if (!chainEquals(chain, snapshot)) return;
    const plan = planReorder(chain, moving, insertAt);
    if (!plan || plan.rewrites.length === 0) return;
    const applied = await this.runReorder(plan);
    this.plugin.rememberDeckHead(applied ? plan.chain[0] ?? null : null);
    this.render();
  }
  /** Run a reorder with the panel's re-rendering held back for its duration */
  async runReorder(plan) {
    this.writing = true;
    try {
      return await this.plugin.deckService.executeReorder(plan);
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
   * after a reorder: the session's remembered head may now sit mid-chain, so
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jYXBhY2l0eS50cyIsICJzcmMvY2FwYWNpdHktY29yZS50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVjay1zZXJ2aWNlLnRzIiwgInNyYy9kZWNrLnRzIiwgInNyYy9jcmVhdGVOZXh0LnRzIiwgInNyYy9kZWxldGVTbGlkZXMudHMiLCAic3JjL25hdi50cyIsICJzcmMvcGFuZWwudHMiLCAic3JjL2NvbmZpcm0tZGVsZXRlLnRzIiwgInNyYy9wYW5lbC1kcmFnLnRzIiwgInNyYy9yZW9yZGVyLnRzIiwgInNyYy9zZXR0aW5ncy50cyIsICJzcmMvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogbmF0aXZlLXNsaWRlcyBcdTIwMTQgYSBcIlNsaWRlcyBtb2RlXCIgZm9yIE9ic2lkaWFuIGRlY2sgbm90ZXNcbiAqXG4gKiBPbmUgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5LCBgZGVja2AgKGEgc2luZ2xlIG1hcmtkb3duIGxpbmsgdG8gdGhlIG5leHRcbiAqIHNsaWRlIFx1MjAxNCBuZXh0LW9ubHkgc2VtYW50aWNzLCBubyBvdmVydmlldyBwYWdlIHNpbmNlIHYxLjAuMCksIGRyaXZlc1xuICogcHJldi9uZXh0IG5hdmlnYXRpb24gYW5kIGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXJzLiBBIGRlY2sgbm90ZSBjYW4gYmVcbiAqIGVudGVyZWQgaW50byAqKlNsaWRlcyBtb2RlKiogXHUyMDE0IGFuIGltbWVyc2l2ZSwgZWRpdGFibGUgKExpdmUgUHJldmlldykgdmlld1xuICogd2l0aCBhIHNsaWRlcyBiYXIgc2hvd2luZyBwcm9wZXJ0aWVzLCBuYXZpZ2F0aW9uIGFuZCB0aGUgcGFnZSBudW1iZXIuXG4gKlxuICogTmF0aXZlIE9ic2lkaWFuIG1vZGVzIChTb3VyY2UgLyBkZWZhdWx0IExpdmUgUHJldmlldyAvIFJlYWRpbmcgdmlldykgYXJlXG4gKiBsZWZ0IGNvbXBsZXRlbHkgdW50b3VjaGVkOiBubyBzdGF0dXMtYmFyIGhpZGluZywgbm8gc2xpZGVzIGJhciwgbm9cbiAqIGZ1bGxzY3JlZW4sIG5vIHN0eWxpbmcuIFNsaWRlcyBtb2RlIGlzIHRoZSBwbHVnaW4ncyBvbmx5IHN1cmZhY2UuXG4gKlxuICogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBhbmQgYSB0aGluIG9yY2hlc3RyYXRpb24gbGF5ZXI7IHRoZSBsb2dpY1xuICogbGl2ZXMgaW4gYHNyYy9gOlxuICogICAtIHNyYy90eXBlcy50cyAgICAgICAgc2V0dGluZ3Mgc2hhcGUgKyBkZWZhdWx0cyArIHJlc2VydmVkIGBkZWNrYCBrZXlcbiAqICAgLSBzcmMvbW9kZS50cyAgICAgICAgIHZpZXcgbW9kZSAvIGZyb250bWF0dGVyIGhlbHBlcnMgKHB1cmUsIGBBcHBgLWJhc2VkKVxuICogICAtIHNyYy9kZWNrLXNlcnZpY2UudHMgZGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWVcbiAqICAgLSBzcmMvYmFyLnRzICAgICAgICAgIGJhciBET00gaGVscGVycyAoY3JlYXRlIC8gYnV0dG9ucyAvIHRhYi1iYXIgbWVhc3VyZSlcbiAqICAgLSBzcmMvcGFuZWwudHMgICAgICAgIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gKiAgIC0gc3JjL2NvbW1hbmRzLnRzICAgICBjb21tYW5kIHJlZ2lzdHJhdGlvbiAoZGV2LWdhdGVkIGRlYnVnIGNvbW1hbmQpXG4gKiAgIC0gc3JjL3NldHRpbmdzLnRzICAgICBzZXR0aW5ncyB0YWJcbiAqICAgLSBzcmMvZGVidWcudHMgICAgICAgIHR5cG9ncmFwaHkgbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KVxuICogICAtIHNyYy9kZWNrLnRzICAgICAgICAgcHVyZSBkZWNrIGNvcmUgKHdpdGggc3JjL2NyZWF0ZU5leHQudHMpXG4gKiAgIC0gc3JjL25hdi50cyAgICAgICAgICBwdXJlIG5hdmlnYXRpb24gY29yZSAocXVldWUgKyBzZXNzaW9uIGNoYWluKVxuICogICAtIHNyYy9yZW9yZGVyLnRzICAgICAgcHVyZSBcIm1vdmUgc2xpZGVzXCIgY29yZSAocmV3aXJlcyB0aGUgbmV4dCBsaW5rcylcbiAqICAgLSBzcmMvcGFuZWwtZHJhZy50cyAgIHRoZSBkcmFnLXRvLXJlb3JkZXIgZ2VzdHVyZSBiZWhpbmQgdGhlIHNsaWRlcyBwYW5lbFxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlLCBkZWNrRnJvbUhlYWQsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9zcmMvZGVja1wiO1xuaW1wb3J0IHsgTmF2U2Vzc2lvbiwgc2Vzc2lvbkRlY2sgfSBmcm9tIFwiLi9zcmMvbmF2XCI7XG5pbXBvcnQgeyBhY3RpdmVGcm9udG1hdHRlciwgY3VycmVudE1vZGUsIGZyb250bWF0dGVyT2YsIGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9zcmMvbW9kZVwiO1xuaW1wb3J0IHsgU2xpZGVzUGFuZWxWaWV3LCBTTElERVNfUEFORUxfVklFVyB9IGZyb20gXCIuL3NyYy9wYW5lbFwiO1xuaW1wb3J0IHsgTmF0aXZlU2xpZGVzU2V0dGluZ1RhYiB9IGZyb20gXCIuL3NyYy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgREVDS19LRVksIERFRkFVTFRfU0VUVElOR1MsIFNMSURFU19USEVNRVMsIHR5cGUgTmF0aXZlU2xpZGVzU2V0dGluZ3MgfSBmcm9tIFwiLi9zcmMvdHlwZXNcIjtcbmltcG9ydCB7IGNsZWFyQ2hpbGRyZW4gfSBmcm9tIFwiLi9zcmMvdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF0aXZlU2xpZGVzUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgLyoqIFRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50ICovXG4gIGJhcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgLyoqIERlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiY3JlYXRlIG5leHQgc2xpZGVcIiBnbHVlICovXG4gIGRlY2tTZXJ2aWNlITogRGVja1NlcnZpY2U7XG4gIC8qKiBQbHVnaW4gc2V0dGluZ3MgKi9cbiAgc2V0dGluZ3M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTIH07XG5cbiAgLyoqIFdoZXRoZXIgU2xpZGVzIG1vZGUgaXMgY3VycmVudGx5IGFjdGl2ZSAoc2Vzc2lvbiBzdGF0ZSwgbm90IHBlcnNpc3RlZCkgKi9cbiAgcHJpdmF0ZSBzbGlkZXNNb2RlID0gZmFsc2U7XG4gIC8qKiBWaWV3IG1vZGUgdG8gcmVzdG9yZSB3aGVuIGxlYXZpbmcgU2xpZGVzIG1vZGUgKFwicHJldmlld1wiIHwgXCJzb3VyY2VcIikgKi9cbiAgcHJpdmF0ZSBleGl0TW9kZTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiID0gXCJzb3VyY2VcIjtcbiAgLyoqIFdoZXRoZXIgdGhlIGV4aXQgdmlldyB3YXMgU291cmNlIG1vZGUgKHRydWUpIHZzIExpdmUgUHJldmlldyAoZmFsc2UpICovXG4gIHByaXZhdGUgZXhpdFNvdXJjZSA9IGZhbHNlO1xuICAvKiogTGFzdCBub3RlIGF1dG8tZW50ZXJlZCBpbnRvIFNsaWRlcyBtb2RlIChwcmV2ZW50cyByZS1lbnRlcmluZyBhZnRlciBtYW51YWwgZXhpdCkgKi9cbiAgcHJpdmF0ZSBhdXRvRW50ZXJlZFBhdGggPSBcIlwiO1xuICAvKiogTGFzdCByZWZyZXNoIGtleSAoXCJwYXRofG1vZGVcIikgdG8gYXZvaWQgcG9pbnRsZXNzIHJlLXJlbmRlcnMgKi9cbiAgcHJpdmF0ZSBsYXN0S2V5ID0gXCJcIjtcbiAgLyoqIExhc3QgbWVhc3VyZWQgdGFiLWJhciBoZWlnaHQgKHB4KSBcdTIwMTQgY2FjaGVkIHdoaWxlIHRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiAqL1xuICBwcml2YXRlIHRhYkJhckhlaWdodCA9IDA7XG4gIC8qKiBRdWV1ZSBiZWhpbmQgcHJldiAvIG5leHQgLyBqdW1wIFx1MjAxNCBzZWUgc3JjL25hdi50cyAoaXNzdWUgIzExMCkgKi9cbiAgcHJpdmF0ZSBuYXYhOiBOYXZTZXNzaW9uO1xuICAvKiogV2hldGhlciB0aGUgbW91c2UgcG9pbnRlciBpcyBoaWRkZW4gZm9yIHByZXNlbnRpbmcgKHNlc3Npb24gc3RhdGUpICovXG4gIHBvaW50ZXJIaWRkZW4gPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmRlY2tTZXJ2aWNlID0gbmV3IERlY2tTZXJ2aWNlKHRoaXMuYXBwKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOYXZTZXNzaW9uKHtcbiAgICAgIHJlc29sdmU6IChwYXRoLCBoZWFkKSA9PiB0aGlzLmRlY2tXaXRoSGVhZChwYXRoLCBoZWFkKSxcbiAgICAgIG9wZW46IGFzeW5jICh0YXJnZXQsIGZyb20pID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNsaWRlc01vZGUpIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZyb20pO1xuICAgICAgfSxcbiAgICAgIGFjdGl2ZVBhdGg6ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbCxcbiAgICB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIodGhpcykpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDEuIFJlZnJlc2ggb24gXCJjdXJyZW50IG5vdGUgLyB2aWV3IGNoYW5nZWRcIiBldmVudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5tYXliZUF1dG9FbnRlclNsaWRlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG4gICAgLy8gUmVmcmVzaCB3aGVuIHRoZSBub3RlIGNvbnRlbnQgKGluY2x1ZGluZyBmcm9udG1hdHRlcikgY2hhbmdlcyAvIHNhdmVzXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMi4gRmFsbGJhY2sgdGltZXI6IGVkaXRcdTIxOTRyZWFkaW5nIHRvZ2dsZXMgbWF5IGZpcmUgbm8gc3RhbmRhcmQgZXZlbnQgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKFxuICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGZpbGUgPyBgJHtmaWxlLnBhdGh9fCR7Y3VycmVudE1vZGUodGhpcy5hcHApfWAgOiBcIlwiO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCksXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzLiBDb21tYW5kcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICByZWdpc3RlckNvbW1hbmRzKHRoaXMpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDNiLiBTbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBvdmVydmlldywgcmVwbGFjZXMgdGhlIG9sZCBvdmVydmlldyBwYWdlKSBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhTTElERVNfUEFORUxfVklFVywgKGxlYWYpID0+IG5ldyBTbGlkZXNQYW5lbFZpZXcodGhpcywgbGVhZikpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInByZXNlbnRhdGlvblwiLCBcIlNob3cgc2xpZGVzIHBhbmVsXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVNsaWRlc1BhbmVsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNC4gUGluIHRoZSBTbGlkZXMgZWRpdG9yIHRvIG9uZSBzY3JlZW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ1NTIGBvdmVyZmxvdzogaGlkZGVuYCBibG9ja3MgdGhlIHdoZWVsLCBidXQgbmF0aXZlIGRyYWctc2VsZWN0XG4gICAgLy8gYXV0b3Njcm9sbCBhbmQgQ29kZU1pcnJvcidzIHByb2dyYW1tYXRpYyBzY3JvbGxJbnRvVmlldyBzdGlsbCBtb3ZlIHRoZVxuICAgIC8vIHNjcm9sbGVyLiBUaGlzIGNhcHR1cmUtcGhhc2UgbGlzdGVuZXIgcmVzZXRzIGFueSBzY3JvbGwgaW5zaWRlIHRoZVxuICAgIC8vIGFjdGl2ZSBtYXJrZG93biB2aWV3IGJhY2sgdG8gdGhlIHRvcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhY3RpdmUuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KFxuICAgICAgZG9jdW1lbnQsXG4gICAgICBcInNjcm9sbFwiLFxuICAgICAgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcbiAgICAgICAgY29uc3QgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB2aWV3LmNvbnRlbnRFbC5jb250YWlucyhlbCkpIHtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxMZWZ0ICE9PSAwKSBlbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHsgY2FwdHVyZTogdHJ1ZSB9LFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNS4gRXNjYXBlIGtleSBleGl0cyBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZG9jdW1lbnQsIFwia2V5ZG93blwiLCAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNsaWRlc01vZGUgJiYgdGhpcy5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykge1xuICAgICAgICB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA2LiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgYW5kIGRvIHRoZSBmaXJzdCByZW5kZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5iYXIgPSBjcmVhdGVCYXIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFyKTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9udW5sb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuYmFyPy5yZW1vdmUoKTtcbiAgICB0aGlzLmJhciA9IG51bGw7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIik7XG4gICAgdGhpcy5yZW1vdmVUaGVtZUNsYXNzZXMoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXR0aW5ncyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGF0YSA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIGFzIFBhcnRpYWw8TmF0aXZlU2xpZGVzU2V0dGluZ3M+IHwgbnVsbDtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgZGF0YSA/PyB7fSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG5vdGUgaXMgYSBkZWNrIG5vdGUgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSkgKi9cbiAgcHJpdmF0ZSBpc0RlY2tOb3RlKGZpbGU6IFRGaWxlIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBldmVyeSBgbmF0aXZlLXNsaWRlcy10aGVtZS0qYCBjbGFzcyBmcm9tIDxib2R5PiAqL1xuICBwcml2YXRlIHJlbW92ZVRoZW1lQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNscyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGNscy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBzaW5nbGUgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmAgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBzbGlkZXNUaGVtZWAgc2V0dGluZyBcdTIwMTQgdGhlIHN0eWxlIHRlbXBsYXRlcyBpbiBzdHlsZXMuY3NzIGhvb2sgb2ZmIGl0LlxuICAgKiBVbmtub3duIGlkcyAoZS5nLiBhZnRlciBhIGRvd25ncmFkZSkgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHRoZW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVRoZW1lQ2xhc3MoKTogdm9pZCB7XG4gICAgY29uc3QgaWQgPSBTTElERVNfVEhFTUVTLnNvbWUoKHQpID0+IHQuaWQgPT09IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWUpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5zbGlkZXNUaGVtZTtcbiAgICBjb25zdCBjbHMgPSBgbmF0aXZlLXNsaWRlcy10aGVtZS0ke2lkfWA7XG4gICAgZm9yIChjb25zdCBjIG9mIEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpKSB7XG4gICAgICBpZiAoYy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikgJiYgYyAhPT0gY2xzKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBoaWRpbmcgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgZm9yIHByZXNlbnRpbmcuIEhpZGluZyBhbHNvXG4gICAqIHBhcmtzIGZvY3VzIChibHVycyB0aGUgZWRpdG9yLCBzbyB0aGUgY2FyZXQgZGlzYXBwZWFycyk7IHNob3dpbmcgbGVhdmVzXG4gICAqIGZvY3VzIHBhcmtlZCBcdTIwMTQgY2xpY2sgc2xpZGUgY29udGVudCB0byByZXN1bWUgZWRpdGluZy5cbiAgICovXG4gIHRvZ2dsZVBvaW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5wb2ludGVySGlkZGVuID0gIXRoaXMucG9pbnRlckhpZGRlbjtcbiAgICBpZiAodGhpcy5wb2ludGVySGlkZGVuKSB7XG4gICAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgYG5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBwcmVzZW50aW5nIHN0YXRlIFx1MjAxNCBzdHlsZXMuY3NzIHR1cm5zIGV2ZXJ5IGN1cnNvciBpbnZpc2libGUgd2hpbGUgc2V0LlxuICAgKiBMZWF2aW5nIFNsaWRlcyBtb2RlIGFsd2F5cyByZXN0b3JlcyB0aGUgcG9pbnRlci5cbiAgICovXG4gIHByaXZhdGUgc3luY1BvaW50ZXJDbGFzcyhzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIsIHNsaWRlcyAmJiB0aGlzLnBvaW50ZXJIaWRkZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc2AgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBpbWFnZUxheW91dGAgc2V0dGluZyBcdTIwMTQgc3R5bGVzLmNzcydzIGltYWdlLWxheW91dCBydWxlcyBob29rIG9mZiBpdC5cbiAgICogVGhlIGNsYXNzIGlzIG9ubHkgbWVhbmluZ2Z1bCBpbiBTbGlkZXMgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgc3luY0ltYWdlTGF5b3V0Q2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgXCJuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc1wiLFxuICAgICAgc2xpZGVzICYmIHRoaXMuc2V0dGluZ3MuaW1hZ2VMYXlvdXQsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNhcmQgdGl0bGUgcGVyIHRoZSBgc2xpZGVzVGl0bGVgIHNldHRpbmcuIFwiZmlsZW5hbWVcIiByZXN0eWxlc1xuICAgKiB0aGUgbmF0aXZlIGlubGluZSB0aXRsZSBpbnRvIHRoZSBjYXJkIHRpdGxlIChzdGlsbCBlZGl0YWJsZSBcdTIwMTQgdHlwaW5nXG4gICAqIHJlbmFtZXMgdGhlIG5vdGUpOyBcIlwiIHNob3dzIG5vdGhpbmc7IGFueSBvdGhlciB2YWx1ZSBuYW1lcyBhIGZyb250bWF0dGVyXG4gICAqIHByb3BlcnR5IHJlbmRlcmVkIHJlYWQtb25seSB2aWEgdGhlIDo6YmVmb3JlIHBzZXVkby1lbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJbmxpbmVUaXRsZShzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBjb250ZW50ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFmaWxlKSByZXR1cm47XG5cbiAgICBjb25zdCBzcmMgPSB0aGlzLnNldHRpbmdzLnNsaWRlc1RpdGxlLnRyaW0oKTtcblxuICAgIC8vIFwiZmlsZW5hbWVcIjogcmVzdHlsZSB0aGUgbmF0aXZlIC5pbmxpbmUtdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZS4gSXRcbiAgICAvLyBzdGF5cyBjb250ZW50ZWRpdGFibGUsIHNvIGVkaXRpbmcgaXQgcmVuYW1lcyB0aGUgbm90ZSBhcyBpbiBMaXZlXG4gICAgLy8gUHJldmlldy4gVGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgbGl2ZXMgb24gdGhlIG1hcmtkb3duLXNvdXJjZS12aWV3XG4gICAgLy8gZWxlbWVudCAoYSBzaWJsaW5nIGJyYW5jaCBvZiB0aGUgY2FyZCksIHNvIHRoZSBzdHlsaW5nIGhvb2sgaXMgYVxuICAgIC8vIHZpZXcgYXR0cmlidXRlICsgYSBicmFuZC1uZXcgLmNtLWNvbnRlbnQgYXR0cmlidXRlIHRoYXQgcmVzZXJ2ZXMgdGhlXG4gICAgLy8gdGl0bGUncyBoZWlnaHQgdGhlIHNhbWUgd2F5IHRoZSBwc2V1ZG8tZWxlbWVudCB2ZXJzaW9uIGRpZC5cbiAgICBjb25zdCBuYXRpdmVUaXRsZSA9IHNsaWRlcyAmJiBzcmMgPT09IFwiZmlsZW5hbWVcIjtcbiAgICBjb25zdCBzb3VyY2VWaWV3ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXNvdXJjZS12aWV3XCIpO1xuICAgIGlmIChuYXRpdmVUaXRsZSAmJiBzb3VyY2VWaWV3KSBzb3VyY2VWaWV3LnNldEF0dHJpYnV0ZShcImRhdGEtbnMtaW5saW5lLXRpdGxlXCIsIFwiZmlsZW5hbWVcIik7XG4gICAgZWxzZSBzb3VyY2VWaWV3Py5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiKTtcbiAgICBjb250ZW50LnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiLCBuYXRpdmVUaXRsZSk7XG5cbiAgICAvLyBQcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIHJlbmRlciByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudFxuICAgIC8vIChubyBlZGl0aW5nIHN1cmZhY2UgXHUyMDE0IHRoZSBwcm9wZXJ0aWVzIHBhbmVsIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSkuXG4gICAgbGV0IHRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGlmIChzbGlkZXMgJiYgc3JjICYmIHNyYyAhPT0gXCJmaWxlbmFtZVwiKSB7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgICAgY29uc3QgdiA9IGZtPy5bc3JjXTtcbiAgICAgIGlmICh2ICE9IG51bGwpIHRleHQgPSBmb3JtYXRWYWx1ZSh2KTtcbiAgICB9XG5cbiAgICBpZiAodGV4dCkgY29udGVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiLCB0ZXh0KTtcbiAgICBlbHNlIGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIik7XG4gIH1cblxuICAvKiogRW50ZXIgU2xpZGVzIG1vZGU6IHJlY29yZCB0aGUgZXhpdCBzdGF0ZSBhbmQgZm9yY2UgdGhlIExpdmUgUHJldmlldyAqL1xuICBwcml2YXRlIGFzeW5jIGVudGVyU2xpZGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IG1vZGU/OiBzdHJpbmc7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgICAgIHRoaXMuZXhpdE1vZGUgPSBzdGF0ZS5tb2RlID09PSBcInByZXZpZXdcIiA/IFwicHJldmlld1wiIDogXCJzb3VyY2VcIjtcbiAgICAgIHRoaXMuZXhpdFNvdXJjZSA9IHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZTtcbiAgICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFsd2F5cyB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgICBjb25zdCBuZXh0ID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgbmV4dC5zdGF0ZSA9IHsgLi4ubmV4dC5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiBmYWxzZSB9O1xuICAgICAgYXdhaXQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShuZXh0LCB7IGZvY3VzOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gdHJ1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAvLyBQaW4gdGhlIHNjcm9sbGVyIHRvIHRoZSB0b3AgYmVmb3JlIGFueSBmcmFtZSByZW5kZXJzOiB0aGUgdmlldy1zdGF0ZVxuICAgIC8vIGNoYW5nZSBhYm92ZSBtYXkgcmVzdG9yZSBpdCB0byB0aGUgc2F2ZWQgY3Vyc29yIGxpbmUgd2l0aG91dCBmaXJpbmcgYVxuICAgIC8vIHNjcm9sbCBldmVudCBhZnRlcndhcmRzLCBzbyB0aGUgY2FwdHVyZS1waGFzZSByZXNldCBiZWxvdyB3b3VsZCBuZXZlclxuICAgIC8vIHJ1biBhbmQgYSBsb25nIG5vdGUgd291bGQgb3BlbiBtaWQtZG9jdW1lbnQuXG4gICAgZm9yIChjb25zdCBlbCBvZiB2aWV3Py5jb250ZW50RWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY20tc2Nyb2xsZXJcIikgPz8gW10pIHtcbiAgICAgIGlmIChlbC5zY3JvbGxUb3AgIT09IDApIGVsLnNjcm9sbFRvcCA9IDA7XG4gICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqIEV4aXQgU2xpZGVzIG1vZGU6IHJlc3RvcmUgdGhlIHZpZXcgbW9kZSByZWNvcmRlZCBhdCBlbnRyeSAqL1xuICBwcml2YXRlIGV4aXRTbGlkZXMoKTogdm9pZCB7XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgaWYgKHRoaXMuZXhpdE1vZGUgPT09IFwicHJldmlld1wiKSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJwcmV2aWV3XCIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiB0aGlzLmV4aXRTb3VyY2UgfTtcbiAgICAgIH1cbiAgICAgIHZvaWQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShzdGF0ZSwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZSBTbGlkZXMgbW9kZSAoZGVjayBub3RlcyBvbmx5IFx1MjAxNCBlbmZvcmNlZCBieSB0aGUgY29tbWFuZCkgKi9cbiAgdG9nZ2xlU2xpZGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHRoaXMuZXhpdFNsaWRlcygpO1xuICAgIGVsc2Ugdm9pZCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQXV0by1lbnRlciBTbGlkZXMgbW9kZSBmb3IgdGhlIGFjdGl2ZSBub3RlIG9uY2UgaXQgaGFzIGJlY29tZSBhIGRlY2tcbiAgICogbm90ZSBcdTIwMTQgdXNlZCBhZnRlciBhIGNvbW1hbmQgcHJvbW90ZXMgYSBwbGFpbiBub3RlIGludG8gYSBkZWNrIChlLmcuXG4gICAqIFwiTWFrZSB0aGlzIG5vdGUgdGhlIGZpcnN0IHNsaWRlXCIpLiBOby1vcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhbHJlYWR5XG4gICAqIGFjdGl2ZSBvciB0aGUgYWN0aXZlIG5vdGUgaXMgbm90ICh5ZXQpIGEgZGVjayBub3RlLlxuICAgKi9cbiAgYXN5bmMgZW50ZXJTbGlkZXNGb3JBY3RpdmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCAhdGhpcy5pc0RlY2tOb3RlKGZpbGUpKSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqIFJldmVhbCB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwsIGNyZWF0aW5nIGl0IGluIHRoZSByaWdodCBzaWRlYmFyIGlmIG5lZWRlZCAqL1xuICBhc3luYyBhY3RpdmF0ZVNsaWRlc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTTElERVNfUEFORUxfVklFVyk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nWzBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikgcmV0dXJuO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogU0xJREVTX1BBTkVMX1ZJRVcsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYSBub3RlJ3MgZGVjaywgcHJlZmVycmluZyB0aGUgY2hhaW4gaGVhZCB0aGUgY3VycmVudCBuYXZpZ2F0aW9uXG4gICAqIHNlc3Npb24gZW50ZXJlZCAod2Fsa2VkIGxpdmUsIHNvIGVkaXRzIHRvIHRoZSBkZWNrIGFyZSBob25vdXJlZCkuIFRoZSBiYXIgYW5kXG4gICAqIHRoZSBzbGlkZXMgcGFuZWwgcmVhZCB0aGlzIHRvbywgc28gdGhlIHBhZ2UgbnVtYmVyIGFsd2F5cyBkZXNjcmliZXMgdGhlIGNoYWluXG4gICAqIG5hdmlnYXRpb24gaXMgYWN0dWFsbHkgdXNpbmcuXG4gICAqL1xuICByZXNvbHZlRGVjayhmaWxlOiBURmlsZSk6IERlY2tJbmZvIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGVja1dpdGhIZWFkKGZpbGUucGF0aCwgdGhpcy5uYXYucmVtZW1iZXJlZEhlYWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlLWJhc2UgdGhlIG5hdmlnYXRpb24gc2Vzc2lvbiBvbiBhIGRlY2sgaGVhZC4gVGhlIHNsaWRlcyBwYW5lbCBjYWxscyB0aGlzXG4gICAqIGFmdGVyIGEgcmVvcmRlcjogdGhlIHNlc3Npb24ncyByZW1lbWJlcmVkIGhlYWQgbWF5IG5vdyBzaXQgbWlkLWNoYWluLCBzb1xuICAgKiB0aGUgYmFyLCB0aGUgcGFnZSBudW1iZXIgYW5kIHRoZSBwYW5lbCB3b3VsZCBvdGhlcndpc2UgZGVzY3JpYmUgYVxuICAgKiB0cnVuY2F0ZWQgZGVjay5cbiAgICovXG4gIHJlbWVtYmVyRGVja0hlYWQoaGVhZDogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMubmF2LnNldEhlYWQoaGVhZCk7XG4gIH1cblxuICAvKipcbiAgICogRGVjayBmb3IgYHBhdGhgLCB3YWxrZWQgbGl2ZSBmcm9tIGBoZWFkYCB3aGlsZSB0aGF0IGhlYWQgc3RpbGwgcmVhY2hlcyBpdCBhbmRcbiAgICogcmVzb2x2ZWQgYWZyZXNoIChhcmJpdHJhcnkgaGVhZCkgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHJpdmF0ZSBkZWNrV2l0aEhlYWQocGF0aDogc3RyaW5nLCBoZWFkOiBzdHJpbmcgfCBudWxsKTogRGVja0luZm8gfCBudWxsIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBzZXNzaW9uRGVjayhcbiAgICAgIGhlYWQsXG4gICAgICBwYXRoLFxuICAgICAgKGgsIHApID0+IHtcbiAgICAgICAgY29uc3QgaGVhZEZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoaCk7XG4gICAgICAgIGlmICghKGhlYWRGaWxlIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIGRlY2tGcm9tSGVhZChoLCBwLCAocSkgPT4gdGhpcy5kZWNrU2VydmljZS5uZXh0TGlua3MocSkpO1xuICAgICAgfSxcbiAgICAgICgpID0+IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIE1vdmUgb25lIHN0ZXAgYmFjay9mb3J3YXJkIGFsb25nIHRoZSBkZWNrIGNoYWluIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpICovXG4gIGFzeW5jIG5hdmlnYXRlKGRpcmVjdGlvbjogXCJwcmV2XCIgfCBcIm5leHRcIik6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMubmF2LnB1c2goeyBkaXI6IGRpcmVjdGlvbiB9KTtcbiAgfVxuXG4gIC8qKiBKdW1wIHRvIGEgc3BlY2lmaWMgaW5kZXggaW4gdGhlIGRlY2sgY2hhaW4gKHByb2dyZXNzIGJhciBjbGljaykgKi9cbiAgYXN5bmMganVtcFRvKGluZGV4OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLm5hdi5wdXNoKHsgaW5kZXggfSk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQmFyIHJlbmRlcmluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKipcbiAgICogR2V0IGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgdGhlIGJhciBwcm9wZXJ0aWVzLiBSZXR1cm5zIGFuIGFycmF5IG9mXG4gICAqIHBlcmNlbnRhZ2VzIChzdW1taW5nIHRvIDEwMCkgZm9yIGVhY2ggcHJvcGVydHkuIExvYWRzIGZyb20gc2V0dGluZ3Mgb3JcbiAgICogZGVmYXVsdHMgdG8gZXF1YWwgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRCYXJQcm9wZXJ0eVdpZHRocyhjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgfHwgXCJbXVwiKSBhcyB1bmtub3duO1xuICAgICAgaWYgKGlzTnVtYmVyTGlzdChzdG9yZWQsIGNvdW50KSkgcmV0dXJuIHN0b3JlZDtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEFycmF5PG51bWJlcj4oY291bnQpLmZpbGwoMTAwIC8gY291bnQpO1xuICB9XG5cbiAgLyoqIFNhdmUgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIHRvIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRoczogbnVtYmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzID0gSlNPTi5zdHJpbmdpZnkod2lkdGhzKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLyoqIERlY2lkZSB3aGF0IHRoZSBzbGlkZXMgYmFyIHNob3dzLCB0aGVuIHJlLXJlbmRlciBpdCAqL1xuICByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXIpIHJldHVybjtcbiAgICB0aGlzLmFwcGx5VGhlbWVDbGFzcygpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKHRoaXMuYXBwKTtcbiAgICBjb25zdCBpc0NhcmQgPSB0aGlzLmlzRGVja05vdGUoZmlsZSk7XG4gICAgY29uc3QgbGl2ZVByZXZpZXdOb3cgPSBtb2RlID09PSBcInNvdXJjZVwiICYmIGlzTGl2ZVByZXZpZXcodGhpcy5hcHApO1xuXG4gICAgLy8gTGVhdmluZyBhIGRlY2sgbm90ZSwgb3IgbGVhdmluZyB0aGUgTGl2ZSBQcmV2aWV3IChlLmcuIENtZC9DdHJsK0UgdG9cbiAgICAvLyByZWFkaW5nIHZpZXcpLCBlbmRzIFNsaWRlcyBtb2RlIFx1MjAxNCBvbmx5IHRoZSB0b2dnbGUgY29tbWFuZCByZS1lbnRlcnMgaXQuXG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSAmJiAoIWlzQ2FyZCB8fCAhbGl2ZVByZXZpZXdOb3cpKSB7XG4gICAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIHRoZSB0YWIgYmFyIHdoaWxlIGl0IGlzIHN0aWxsIHZpc2libGUgKFNsaWRlcyBtb2RlIGhpZGVzIGl0XG4gICAgLy8gYmVsb3c7IHRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGlzIHJldXNlZCBvbmNlIGhpZGRlbikuXG4gICAgdGhpcy50YWJCYXJIZWlnaHQgPSBzeW5jVGFiQmFySGVpZ2h0KHRoaXMudGFiQmFySGVpZ2h0KTtcblxuICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZSBvbmx5IHdoaWxlIGFjdHVhbGx5IGluIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICBjb25zdCBzbGlkZXMgPSB0aGlzLnNsaWRlc01vZGUgJiYgaXNDYXJkICYmIGxpdmVQcmV2aWV3Tm93O1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiLCBzbGlkZXMpO1xuICAgIGlmICghc2xpZGVzKSB0aGlzLnBvaW50ZXJIaWRkZW4gPSBmYWxzZTsgLy8gbGVhdmluZyBTbGlkZXMgcmVzdG9yZXMgdGhlIHBvaW50ZXJcbiAgICB0aGlzLnN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy51cGRhdGVJbmxpbmVUaXRsZShzbGlkZXMpO1xuXG4gICAgY29uc3QgYmFyVmlzaWJsZSA9IHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgJiYgIXRoaXMuc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgIC8vIFdoZW4gYmFyIGlzIGhpZGRlbiwgc2V0IGJvdHRvbSBwYWRkaW5nIHRvIDAgc28gdGhlIGNhcmQgZmlsbHMgdGhlIGZ1bGxcbiAgICAvLyB3aW5kb3cgaGVpZ2h0LiBXaGVuIHZpc2libGUsIHJlbW92ZSB0aGUgb3ZlcnJpZGUgc28gQ1NTIGZhbGxzIGJhY2sgdG9cbiAgICAvLyAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCAoY2xlYXJzIHRoZSBiYXIgYXMgYmVmb3JlKS5cbiAgICBpZiAoYmFyVmlzaWJsZSkge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIjogXCIwcHhcIiB9KTtcbiAgICB9XG4gICAgaWYgKCFiYXJWaXNpYmxlKSB7XG4gICAgICB0aGlzLmJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFmaWxlKSByZXR1cm47IC8vIGJhclZpc2libGUgaW1wbGllcyBhIGZpbGUsIGJ1dCBuYXJyb3cgZm9yIFR5cGVTY3JpcHRcblxuICAgIGNvbnN0IGZtID0gYWN0aXZlRnJvbnRtYXR0ZXIodGhpcy5hcHApO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLnJlc29sdmVEZWNrKGZpbGUpO1xuICAgIGNsZWFyQ2hpbGRyZW4odGhpcy5iYXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExlZnQ6IHByZXZpb3VzIC8gbmV4dCBidXR0b25zIChib3RoIGFsd2F5cyBzaG93biBpbnNpZGUgYSBkZWNrO1xuICAgIC8vICAgICAgICB0aGUgb25lIHRoYXQgY2Fubm90IG1vdmUgaXMgZGlzYWJsZWQgLyBsaWdodCBncmF5KSBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyAmJiBkZWNrKSB7XG4gICAgICBjb25zdCBoYXNQcmV2ID0gZGVjay5pbmRleCA+IDA7XG4gICAgICBjb25zdCBoYXNOZXh0ID0gZGVjay5pbmRleCA8IGRlY2suY2hhaW4ubGVuZ3RoIC0gMTtcbiAgICAgIGNvbnN0IG5hdiA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdlwiIH0pO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVDMFwiLCBcIlByZXZpb3VzIHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwicHJldlwiKSwgIWhhc1ByZXYpKTtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QjZcIiwgXCJOZXh0IHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwibmV4dFwiKSwgIWhhc05leHQpKTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKG5hdik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1pZGRsZTogY29uZmlndXJlZCBwcm9wZXJ0eSBjb2x1bW5zIHdpdGggZHJhZ2dhYmxlIGRpdmlkZXJzIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHByb3BOYW1lcyA9IHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydGllc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHByb3BOYW1lcy5sZW5ndGggPiAwICYmIGZtKSB7XG4gICAgICBjb25zdCBlbnRyaWVzOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwcm9wTmFtZXMpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gZm0pIHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBmbVtuYW1lXTtcbiAgICAgICAgICBpZiAodmFsICE9IG51bGwpIGVudHJpZXMucHVzaChbbmFtZSwgZm9ybWF0VmFsdWUodmFsKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3BlcnRpZXNcIiB9KTtcblxuICAgICAgICBjb25zdCB3aWR0aHMgPSB0aGlzLmdldEJhclByb3BlcnR5V2lkdGhzKGVudHJpZXMubGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBbLCB2YWx1ZV0gPSBlbnRyaWVzW2ldO1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLCB0ZXh0OiB2YWx1ZSB9KTtcbiAgICAgICAgICBpdGVtLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7d2lkdGhzW2ldfSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSA8IGVudHJpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY29uc3QgZGl2aWRlciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1kaXZpZGVyXCIgfSk7XG4gICAgICAgICAgICBkaXZpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICBjb25zdCBpbml0aWFsV2lkdGhzID0gWy4uLndpZHRoc107XG4gICAgICAgICAgICAgIGNvbnN0IG9uTW92ZSA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gKChldi5jbGllbnRYIC0gc3RhcnRYKSAvIGNvbnRhaW5lcldpZHRoKSAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMZWZ0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpXSArIGRlbHRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSaWdodCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaSArIDFdIC0gZGVsdGEpO1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpXSA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2kgKyAxXSA9IG5ld1JpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgXCIubmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld0xlZnR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2kgKyAxXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld1JpZ2h0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgY29uc3Qgb25VcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRDc3NTdHlsZXMoeyBjdXJzb3I6IFwiXCIsIHVzZXJTZWxlY3Q6IFwiXCIgfSk7XG4gICAgICAgICAgICAgICAgdm9pZCB0aGlzLnNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHMpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJjb2wtcmVzaXplXCIsIHVzZXJTZWxlY3Q6IFwibm9uZVwiIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2aWRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCcm9rZW4gZGVjayBsaW5rcyBcdTIxOTIgd2FybmluZyBjaGlwIHNvIGRlY2sgYXV0aG9ycyBzcG90IHR5cG9zXG4gICAgY29uc3QgYnJva2VuID0gZmlsZSA/IHRoaXMuZGVja1NlcnZpY2UuYnJva2VuKGZpbGUpIDogW107XG4gICAgaWYgKGJyb2tlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB3YXJuID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXdhcm5cIixcbiAgICAgICAgdGV4dDogXCJcdTI2QTAgXCIgKyBicm9rZW4uam9pbihcIiwgXCIpLFxuICAgICAgICBhdHRyOiB7IHRpdGxlOiBcIkJyb2tlbiBkZWNrIGxpbmsocykgXHUyMDE0IHRoZSB0YXJnZXQgbm90ZSBkb2VzIG5vdCBleGlzdFwiIH0sXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHdhcm4pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBCb3R0b20tcmlnaHQ6IGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXIgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlICE9PSBcIm5vbmVcIiAmJiBkZWNrKSB7XG4gICAgICAvLyB2MS4wLjAgbmV4dC1vbmx5IHNlbWFudGljczogY2hhaW5bMF0gaXMgdGhlIGhlYWQgc2xpZGUgPSBwYWdlIDE7XG4gICAgICAvLyB0b3RhbCBpcyB0aGUgZnVsbCBjaGFpbiBsZW5ndGguXG4gICAgICBjb25zdCB0b3RhbCA9IGRlY2suY2hhaW4ubGVuZ3RoO1xuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYWdlXCIsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPT09IFwiZnJhY3Rpb25cIlxuICAgICAgICAgICAgPyBgJHtkZWNrLmluZGV4ICsgMX0gLyAke3RvdGFsfWBcbiAgICAgICAgICAgIDogYCR7ZGVjay5pbmRleCArIDF9YCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFByb2dyZXNzIGluZGljYXRvcjogZGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IGJhciB0b3AgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1Byb2dyZXNzICYmIGRlY2sgJiYgZGVjay5jaGFpbi5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXByb2dyZXNzXCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlY2suY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBpIDwgZGVjay5pbmRleCA/IFwicGFzdFwiIDogaSA9PT0gZGVjay5pbmRleCA/IFwiY3VycmVudFwiIDogXCJmdXR1cmVcIjtcbiAgICAgICAgY29uc3Qgc2VnID0gY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IGBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZyBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZy0tJHtzdGF0ZX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB2b2lkIHRoaXMuanVtcFRvKGkpKTtcbiAgICAgICAgcHJvZ3Jlc3MuYXBwZW5kQ2hpbGQoc2VnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHRoZSBzbGlkZXMgYmFyIGVudGlyZWx5IHdoZW4gaXQgaGFzIG5vdGhpbmcgdG8gZGlzcGxheSAobm8gcHJvcGVydGllcyxcbiAgICAvLyBhbmQgbm90IHBhcnQgb2YgYSBkZWNrKVxuICAgIHRoaXMuYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IHRoaXMuYmFyLmNoaWxkRWxlbWVudENvdW50ID09PSAwID8gXCJub25lXCIgOiBcIlwiIH0pO1xuICB9XG59XG5cbi8qKiBXaGV0aGVyIGB2YWx1ZWAgaXMgYW4gYXJyYXkgb2YgZXhhY3RseSBgY291bnRgIG51bWJlcnMgKHN0b3JlZCBiYXIgd2lkdGhzKS4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyTGlzdCh2YWx1ZTogdW5rbm93biwgY291bnQ6IG51bWJlcik6IHZhbHVlIGlzIG51bWJlcltdIHtcbiAgcmV0dXJuIChcbiAgICBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IGNvdW50ICYmIHZhbHVlLmV2ZXJ5KChuKSA9PiB0eXBlb2YgbiA9PT0gXCJudW1iZXJcIilcbiAgKTtcbn1cbiIsICIvKiogQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50IChoaWRkZW4gdW50aWwgcmVmcmVzaCgpIHNob3dzIGl0KSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhcigpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGJhciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhclwiIH0pO1xuICBiYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gIGJhci50aXRsZSA9IFwiQ2xpY2sgdG8gcGFyayB0aGUgbW91c2UgXHUyMDE0IGhpZGVzIHRoZSBlZGl0b3IgY2FyZXQgd2hpbGUgcHJlc2VudGluZ1wiO1xuICAvLyBQcmVzZW50YXRpb24gcGFya2luZzogY2xpY2tpbmcgdGhlIGJhciBrZWVwcyBmb2N1cyBvdXQgb2YgdGhlIGVkaXRvciBzb1xuICAvLyB0aGUgYmxpbmtpbmcgY2FyZXQgZGlzYXBwZWFycy4gcHJldmVudERlZmF1bHQgc3RvcHMgdGhlIGNsaWNrIGZyb20gbW92aW5nXG4gIC8vIGZvY3VzIG9yIHN0YXJ0aW5nIGEgdGV4dCBzZWxlY3Rpb247IGJ1dHRvbnMgc3RpbGwgcmVjZWl2ZSB0aGVpciBjbGljayBldmVudC5cbiAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgYWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSBhY3RpdmUuYmx1cigpO1xuICB9KTtcbiAgcmV0dXJuIGJhcjtcbn1cblxuLyoqIEJ1aWxkIGEgXHUyNUMwIC8gXHUyNUI2IG5hdmlnYXRpb24gYnV0dG9uOyBgZGlzYWJsZWRgIHJlbmRlcnMgaXQgbGlnaHQgZ3JheS9pbmFjdGl2ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hdkJ1dHRvbihcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGlwOiBzdHJpbmcsXG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQsXG4gIGRpc2FibGVkID0gZmFsc2UsXG4pOiBIVE1MQnV0dG9uRWxlbWVudCB7XG4gIGNvbnN0IGJ0biA9IGNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1uYXYtYnRuXCIsXG4gICAgdGV4dDogbGFiZWwsXG4gICAgYXR0cjogeyB0aXRsZTogdGlwIH0sXG4gIH0pO1xuICBidG4uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgaWYgKCFkaXNhYmxlZCkgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSB0b3AgdGFiIGJhciBhbmQgZXhwb3NlIGl0cyBoZWlnaHQgYXMgdGhlIENTUyB2YXJpYWJsZVxuICogLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQsIHJldHVybmluZyB0aGUgKHBvc3NpYmx5IHVwZGF0ZWQpIGNhY2hlZFxuICogdmFsdWUuIFRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSwgc28gdGhlIGxhc3QgbWVhc3VyZWRcbiAqIHZhbHVlIGlzIHJldXNlZCB0aGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bmNUYWJCYXJIZWlnaHQoY2FjaGVkOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICBcIi53b3Jrc3BhY2UtdGFicy5tb2QtdG9wIC53b3Jrc3BhY2UtdGFiLWhlYWRlci1jb250YWluZXJcIixcbiAgKTtcbiAgaWYgKHRhYkJhciAmJiB0YWJCYXIub2Zmc2V0SGVpZ2h0ID4gMCkgY2FjaGVkID0gdGFiQmFyLm9mZnNldEhlaWdodDtcbiAgaWYgKGNhY2hlZCA+IDApIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0XCI6IGAke2NhY2hlZH1weGAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm8gbWVhc3VyZW1lbnQgeWV0ICh0YWIgYmFyIGhpZGRlbiBzaW5jZSBsb2FkKSBcdTIwMTQgbGV0IHRoZSBDU1MgZmFsbGJhY2sgYXBwbHkuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIik7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZDtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjb21wdXRlQ2FwYWNpdHksIGZvcm1hdENhcGFjaXR5LCBwcm9tcHRMb2NhbGUsIHR5cGUgU2xpZGVNZXRyaWNzIH0gZnJvbSBcIi4vY2FwYWNpdHktY29yZVwiO1xuXG4vKipcbiAqIGNhcGFjaXR5LnRzIFx1MjAxNCBvbmUtc2NyZWVuIGNhcGFjaXR5IG1lYXN1cmVtZW50IGZvciB0aGUgYWN0aXZlIFNsaWRlcyBub3RlLlxuICpcbiAqIFRoZSBcIkNvcHkgc2xpZGUgY2FwYWNpdHlcIiBjb21tYW5kIG1lYXN1cmVzIHRoZSBsaXZlIFNsaWRlcyBsYXlvdXQgb2YgdGhlXG4gKiBjdXJyZW50IG5vdGUgKHRoZSBvbmx5IGxheW91dCB0aGF0IG1hdHRlcnM6IGEgbmV3IHNsaWRlIG11c3QgZml0IGludG8gdGhlXG4gKiBzYW1lIHNjcmVlbikgYW5kIGZvcm1hdHMgdGhlIG51bWJlcnMgaW50byBhbiBBSS1yZWFkeSBwcm9tcHQ6XG4gKlxuICogICAtIHRoZSBzY3JlZW4gLyB0ZXh0LWFyZWEgZGltZW5zaW9ucyAoYmFyIGhlaWdodCwgdGl0bGUgcmVzZXJ2ZSwgcGFkZGluZ3NcbiAqICAgICBhcmUgcmVhZCBmcm9tIHRoZSBsaXZlIGNvbXB1dGVkIHN0eWxlcywgc28gXCJvbmUgc2NyZWVuXCIgYWx3YXlzIG1hdGNoZXNcbiAqICAgICBleGFjdGx5IHdoYXQgdGhlIHZpZXdlciBzZWVzKSxcbiAqICAgLSB0aGUgbGluZSBib3ggb2YgZXZlcnkgZWxlbWVudCB0eXBlIFx1MjAxNCBtZWFzdXJlZCBmaXJzdCAodGhlIGN1cnJlbnQgc2xpZGVcbiAqICAgICBpcyBhbHJlYWR5IG9uIHNjcmVlbiksIHRoZW4gZGVyaXZlZCBmcm9tIHRoZSBwaW5uZWQgU2xpZGVzIHR5cG9ncmFwaHlcbiAqICAgICB2YXJpYWJsZXMgKHN0eWxlcy5jc3MgXHUwMEE3OSBzZXRzIC0taDEtc2l6ZS8tLWgxLWxpbmUtaGVpZ2h0Ly0tcC1zcGFjaW5nL1x1MjAyNlxuICogICAgIG9uIHRoZSBzaXplcjsgY29kZSBibG9ja3MgYXJlIDFyZW0vMS41KSB3aGVuIHRoZSBub3RlIGhhcyBubyBpbnN0YW5jZVxuICogICAgIG9mIHRoYXQgdHlwZSxcbiAqICAgLSBjaGFycy1wZXItbGluZSBmb3IgbGF0aW4gYW5kIENKSyB2aWEgY2FudmFzIG1lYXN1cmVUZXh0LlxuICpcbiAqIFRoZSBtYXRoIGFuZCBwcm9tcHQgZm9ybWF0dGluZyBsaXZlIGluIHNyYy9jYXBhY2l0eS1jb3JlLnRzIChwdXJlLCB0ZXN0ZWQpO1xuICogdGhpcyBmaWxlIGlzIHRoZSBET00gZ2x1ZTogbWVhc3VyZW1lbnQgKyBjbGlwYm9hcmQuXG4gKiBUaGUgcHJvbXB0IGlzIGNvcGllZCB0byB0aGUgY2xpcGJvYXJkIChubyBvdGhlciBvdXRwdXQpOyB0aGUgbWVzc2FnZSB0ZXh0XG4gKiBmb2xsb3dzIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZSAoXCJ6aCpcIiBcdTIxOTIgQ2hpbmVzZSwgb3RoZXJ3aXNlIEVuZ2xpc2gpLlxuICovXG5cbmNvbnN0IHB4ID0gKHY6IHN0cmluZyk6IG51bWJlciA9PiBOdW1iZXIucGFyc2VGbG9hdCh2KTtcblxuY29uc3QgU0FNUExFX0xBVElOID1cbiAgXCJUaGUgcXVpY2sgYnJvd24gZm94IGp1bXBzIG92ZXIgdGhlIGxhenkgZG9nIDAxMjM0NTY3ODkgYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbmNvbnN0IFNBTVBMRV9DSksgPSBcIlx1NEUwMFx1NUM0Rlx1NEUwMFx1NTM2MVx1NUU3Qlx1NzA2Rlx1NzI0N1x1NTE4NVx1NUJCOVx1NkQ0Qlx1OTFDRlx1NzkzQVx1NEY4Qlx1RkYwQ1x1NkJDRlx1ODg0Q1x1NTNFRlx1NEVFNVx1NjM5Mlx1NEUwQlx1NTkxQVx1NUMxMVx1NEUyQVx1NUI1N1x1RkYxQVx1NTJBMFx1NTFDRlx1NEU1OFx1OTY2NFx1NzY3RVx1NTIwNlx1NkJENFx1MzAwMlwiO1xuXG4vKiogQXZlcmFnZSBjaGFyIHdpZHRoIChweCkgZm9yIGEgc2FtcGxlIHN0cmluZyBhdCB0aGUgZ2l2ZW4gZm9udCBzZXR0aW5ncyAqL1xuZnVuY3Rpb24gYXZnQ2hhcldpZHRoKGZvbnQ6IHN0cmluZywgc2FtcGxlOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBpZiAoIWN0eCkgcmV0dXJuIDI0O1xuICBjdHguZm9udCA9IGZvbnQ7XG4gIHJldHVybiBjdHgubWVhc3VyZVRleHQoc2FtcGxlKS53aWR0aCAvIHNhbXBsZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGxpbmVCb3goZWw6IEhUTUxFbGVtZW50KTogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB7XG4gIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGNvbnN0IGZzID0gcHgoY3MuZm9udFNpemUpO1xuICBjb25zdCBsaFJhdyA9IGNzLmxpbmVIZWlnaHQ7XG4gIHJldHVybiB7IGZvbnRTaXplOiBmcywgbGluZUhlaWdodDogcHgobGhSYXcpID4gMCA/IHB4KGxoUmF3KSA6IGZzICogMS41IH07XG59XG5cbi8qKlxuICogTWVhc3VyZSB0aGUgYWN0aXZlIFNsaWRlcyB2aWV3LiBSZXR1cm5zIG51bGwgd2hlbiBubyBTbGlkZXMgbGF5b3V0IGlzXG4gKiBhY3RpdmUgKHRoZSBjb21tYW5kIGlzIG9ubHkgcmVhY2hhYmxlIHRoZXJlLCBidXQgdGhlIGd1YXJkIGlzIGNoZWFwKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lYXN1cmVTbGlkZXMoYXBwOiBBcHApOiBTbGlkZU1ldHJpY3MgfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCByb290ID0gdmlldy5jb250ZW50RWw7XG4gIGNvbnN0IHNjcm9sbGVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zY3JvbGxlclwiKTtcbiAgY29uc3QgY29udGVudCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgaWYgKCFzY3JvbGxlciB8fCAhY29udGVudCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY3NTY3JvbGwgPSBnZXRDb21wdXRlZFN0eWxlKHNjcm9sbGVyKTtcbiAgY29uc3QgY3NDb250ZW50ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50KTtcblxuICBjb25zdCBzY3JlZW5IID0gc2Nyb2xsZXIuY2xpZW50SGVpZ2h0O1xuICBjb25zdCB0ZXh0VG9wUGFkID0gcHgoY3NTY3JvbGwucGFkZGluZ1RvcCk7XG4gIGNvbnN0IHRleHRCb3R0b21QYWQgPSBweChjc1Njcm9sbC5wYWRkaW5nQm90dG9tKTtcbiAgY29uc3QgY2FyZFBhZFRvcCA9IHB4KGNzQ29udGVudC5wYWRkaW5nVG9wKTtcbiAgY29uc3QgY2FyZFBhZEJvdHRvbSA9IHB4KGNzQ29udGVudC5wYWRkaW5nQm90dG9tKTtcblxuICBjb25zdCBoYXNUaXRsZSA9XG4gICAgY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKSB8fCBjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiKTtcbiAgLy8gV2l0aCBhIHRpdGxlLCB0aGUgY2FyZCdzIHRvcCBwYWRkaW5nIGdyb3dzIGJ5IHRoZSByZXNlcnZlZCB0aXRsZSBibG9ja1xuICAvLyAocGFkZGluZ1RvcCAtIHBhZGRpbmdCb3R0b20gaXMgdGhlIGRlbHRhOyBib3RoIGFyZSAtLW5zLXBhZC15IG5vcm1hbGx5KS5cbiAgY29uc3QgdGl0bGVSZXNlcnZlZCA9IGhhc1RpdGxlXG4gICAgPyBNYXRoLnJvdW5kKE1hdGgubWF4KDAsIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCkgLyAxMDBcbiAgICA6IDA7XG5cbiAgY29uc3QgdGV4dEhlaWdodCA9XG4gICAgTWF0aC5yb3VuZChcbiAgICAgIE1hdGgubWF4KDAsIHNjcmVlbkggLSB0ZXh0VG9wUGFkIC0gdGV4dEJvdHRvbVBhZCAtIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCxcbiAgICApIC8gMTAwO1xuXG4gIGNvbnN0IHRleHRXaWR0aCA9IGNvbnRlbnQuY2xpZW50V2lkdGggLSBweChjc0NvbnRlbnQucGFkZGluZ0xlZnQpIC0gcHgoY3NDb250ZW50LnBhZGRpbmdSaWdodCk7XG4gIGNvbnN0IHZpZXdwb3J0V2lkdGggPSBzY3JvbGxlci5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSBzY3JlZW5IO1xuXG4gIC8vIFRoZSBzbGlkZXMgYmFyIGlzIGFwcGVuZGVkIHRvIGRvY3VtZW50LmJvZHkgKG5vdCB0aGUgdmlldydzIGNvbnRlbnRFbClcbiAgY29uc3QgYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubmF0aXZlLXNsaWRlcy1iYXJcIik7XG4gIGNvbnN0IGJhclZpc2libGUgPSBiYXIgIT09IG51bGwgJiYgZ2V0Q29tcHV0ZWRTdHlsZShiYXIpLmRpc3BsYXkgIT09IFwibm9uZVwiO1xuICBjb25zdCBiYXJIZWlnaHQgPSBiYXIgJiYgYmFyVmlzaWJsZSA/IGJhci5vZmZzZXRIZWlnaHQgOiAwO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBlbGVtZW50IGxpbmUgYm94ZXM6IG1lYXN1cmUgZmlyc3QgaXRlbSBvZiBlYWNoIHR5cGUgcHJlc2VudCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgaGVhZGVyID0gKGNsczogc3RyaW5nKSA9PiByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGAuY20tY29udGVudCAke2Nsc31gKTtcbiAgY29uc3QgaDFFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMVwiKTtcbiAgY29uc3QgaDJFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMlwiKTtcbiAgY29uc3QgaDNFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItM1wiKTtcbiAgY29uc3QgYnVsbGV0RWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgLkh5cGVyTUQtbGlzdC1saW5lXCIpO1xuICBjb25zdCBjb2RlRWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgcHJlLCAuY20tY29udGVudCAuSHlwZXJNRC1jb2RlYmxvY2tcIik7XG4gIGNvbnN0IGltZ0VsID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50IGltZzpub3QoLmNtLXdpZGdldEJ1ZmZlcilcIik7XG5cbiAgLy8gQSBwbGFpbiBib2R5IGxpbmUgXHUyMDE0IHNraXAgaGVhZGVycywgbGlzdCBsaW5lcywgY29kZSwgcXVvdGVzIGFuZCBlbXB0eVxuICAvLyBsaW5lcyAoQ00gcmVuZGVycyBvbmx5IHZpc2libGUgbGluZXM7IGluIFNsaWRlcyBtb2RlIHRoZSBmaXJzdCBzY3JlZW5cbiAgLy8gaXMgZXhhY3RseSB0aGVtKS4gQW4gZW1wdHkgbGluZSBib3ggKGEgYmxhbmsgcm93LCB+OHB4KSBpcyBub3QgYSB1c2VmdWxcbiAgLy8gYm9keSBzYW1wbGUsIHNvIHBpY2sgdGhlIGZpcnN0IGNhbmRpZGF0ZSB3aXRoIGFjdHVhbCB0ZXh0LlxuICBjb25zdCBib2R5RWwgPVxuICAgIEFycmF5LmZyb20oXG4gICAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICBcIi5jbS1jb250ZW50IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpOm5vdCguSHlwZXJNRC1saXN0LWxpbmUpOm5vdCguSHlwZXJNRC1xdW90ZSk6bm90KC5IeXBlck1ELWNvZGVibG9jaylcIixcbiAgICAgICksXG4gICAgKS5maW5kKChlbCkgPT4gZWwudGV4dENvbnRlbnQgIT09IG51bGwgJiYgZWwudGV4dENvbnRlbnQudHJpbSgpLmxlbmd0aCA+IDApID8/IGNvbnRlbnQ7XG5cbiAgY29uc3QgYm9keSA9IGxpbmVCb3goYm9keUVsKTtcbiAgY29uc3QgaDEgPSBoMUVsID8gbGluZUJveChoMUVsKSA6IG51bGw7XG4gIGNvbnN0IGgyID0gaDJFbCA/IGxpbmVCb3goaDJFbCkgOiBudWxsO1xuICBjb25zdCBoMyA9IGgzRWwgPyBsaW5lQm94KGgzRWwpIDogbnVsbDtcblxuICBjb25zdCBjcyA9IChlbDogSFRNTEVsZW1lbnQpOiBDU1NTdHlsZURlY2xhcmF0aW9uID0+IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICBsZXQgYnVsbGV0OiB7IGl0ZW1IZWlnaHQ6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG4gIGlmIChidWxsZXRFbCkge1xuICAgIGNvbnN0IGMgPSBjcyhidWxsZXRFbCk7XG4gICAgYnVsbGV0ID0ge1xuICAgICAgaXRlbUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSArIHB4KGMucGFkZGluZ1RvcCkgKyBweChjLnBhZGRpbmdCb3R0b20pLFxuICAgIH07XG4gIH1cblxuICBsZXQgY29kZTogeyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGwgPSBudWxsO1xuICBpZiAoY29kZUVsKSB7XG4gICAgY29uc3QgYyA9IGNzKGNvZGVFbCk7XG4gICAgY29kZSA9IHsgbGluZUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSA+IDAgPyBweChjLmxpbmVIZWlnaHQpIDogcHgoYy5mb250U2l6ZSkgKiAxLjUgfTtcbiAgfVxuXG4gIGNvbnN0IGltYWdlSGVpZ2h0ID1cbiAgICBpbWdFbCAmJiBpbWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgPiAwXG4gICAgICA/IE1hdGgucm91bmQoaW1nRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KVxuICAgICAgOiBudWxsO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBkZXJpdmUgbWlzc2luZyBlbGVtZW50IGJveGVzIGZyb20gdGhlIHBpbm5lZCBTbGlkZXMgdHlwb2dyYXBoeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gc3R5bGVzLmNzcyBcdTAwQTc5IGRlY2xhcmVzIHRoZSBzbGlkZSB0eXBvZ3JhcGh5IG9uIHRoZSBzaXplclxuICAvLyAoLS1oMS1zaXplOiAxLjRlbTsgLS1oMS1saW5lLWhlaWdodDogMS40MzsgXHUyMDI2KSBhbmQgXHUwMEE3NyBwaW5zIGNvZGUgYmxvY2tzXG4gIC8vIHRvIDFyZW0vMS41IFx1MjAxNCBhIG5vdGUgd2l0aG91dCB0aGF0IGVsZW1lbnQgdHlwZSBzdGlsbCByZXBvcnRzIGl0cyBib3guXG4gIGNvbnN0IHNpemVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zaXplclwiKTtcbiAgY29uc3Qgc2l6ZXJTdHlsZSA9IHNpemVyID8gY3Moc2l6ZXIpIDogbnVsbDtcbiAgY29uc3QgZGVyaXZlQm94ID0gKHNpemVWYXI6IHN0cmluZywgbGhWYXI6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGVtID0gc2l6ZXJTdHlsZSA/IHB4KHNpemVyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzaXplVmFyKSkgOiBOYU47XG4gICAgY29uc3QgbGggPSBzaXplclN0eWxlID8gcHgoc2l6ZXJTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKGxoVmFyKSkgOiBOYU47XG4gICAgY29uc3QgZm9udFNpemUgPSBlbSA+IDAgPyBlbSAqIGJvZHkuZm9udFNpemUgOiBib2R5LmZvbnRTaXplO1xuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSBsaCA+IDAgPyBsaCAqIGZvbnRTaXplIDogYm9keS5saW5lSGVpZ2h0O1xuICAgIHJldHVybiB7IGZvbnRTaXplLCBsaW5lSGVpZ2h0IH07XG4gIH07XG4gIGNvbnN0IGRlcml2ZUgxID0gZGVyaXZlQm94KFwiLS1oMS1zaXplXCIsIFwiLS1oMS1saW5lLWhlaWdodFwiKTtcbiAgY29uc3QgZGVyaXZlSDIgPSBkZXJpdmVCb3goXCItLWgyLXNpemVcIiwgXCItLWgyLWxpbmUtaGVpZ2h0XCIpO1xuICBjb25zdCBkZXJpdmVIMyA9IGRlcml2ZUJveChcIi0taDMtc2l6ZVwiLCBcIi0taDMtbGluZS1oZWlnaHRcIik7XG4gIGNvbnN0IGRlcml2ZUNvZGUgPSAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdEZvbnQgPSBweChnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUpO1xuICAgIHJldHVybiB7IGxpbmVIZWlnaHQ6IHJvb3RGb250ICogMS41IH07XG4gIH07XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGNoYXIgd2lkdGhzIGF0IHRoZSBib2R5IGZvbnQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IGZvbnRGYW1pbHkgPSBjcyhjb250ZW50KS5mb250RmFtaWx5O1xuICBjb25zdCBmb250ID0gYDQwMCAke2JvZHkuZm9udFNpemV9cHggJHtmb250RmFtaWx5fWA7XG4gIGNvbnN0IGNoYXIgPSB7XG4gICAgbGF0aW46IGF2Z0NoYXJXaWR0aChmb250LCBTQU1QTEVfTEFUSU4pLFxuICAgIGNqazogYXZnQ2hhcldpZHRoKGZvbnQsIFNBTVBMRV9DSkspLFxuICB9O1xuXG4gIC8vIE1lYXN1cmVkIHdpbnM7IGRlcml2YXRpb24gZmlsbHMgdGhlIGdhcHMgZm9yIGFic2VudCB0eXBlcy5cbiAgcmV0dXJuIHtcbiAgICB2aWV3cG9ydDogeyB3aWR0aDogdmlld3BvcnRXaWR0aCwgaGVpZ2h0OiB2aWV3cG9ydEhlaWdodCB9LFxuICAgIHRleHQ6IHsgd2lkdGg6IHRleHRXaWR0aCwgaGVpZ2h0OiB0ZXh0SGVpZ2h0IH0sXG4gICAgYmFyOiB7XG4gICAgICB2aXNpYmxlOiBiYXJWaXNpYmxlLFxuICAgICAgaGVpZ2h0OiBiYXJIZWlnaHQsXG4gICAgfSxcbiAgICB0aXRsZVJlc2VydmVkOiBNYXRoLnJvdW5kKHRpdGxlUmVzZXJ2ZWQgKiAxMDApIC8gMTAwLFxuICAgIGJvZHksXG4gICAgaDE6IGgxID8/IGRlcml2ZUgxLFxuICAgIGgyOiBoMiA/PyBkZXJpdmVIMixcbiAgICBoMzogaDMgPz8gZGVyaXZlSDMsXG4gICAgYnVsbGV0LFxuICAgIGNvZGU6IGNvZGUgPz8gZGVyaXZlQ29kZSgpLFxuICAgIGltYWdlSGVpZ2h0LFxuICAgIGNoYXIsXG4gIH07XG59XG5cbi8qKlxuICogRW50cnkgcG9pbnQgb2YgdGhlIFwiQ29weSBzbGlkZSBjYXBhY2l0eVwiIGNvbW1hbmQ6IG1lYXN1cmUsIGZvcm1hdCxcbiAqIHdyaXRlIHRvIHRoZSBjbGlwYm9hcmQuIFJ1bnMgb25seSBmcm9tIFNsaWRlcyBtb2RlIChjb21tYW5kIGdhdGUpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29weUNhcGFjaXR5UHJvbXB0KGFwcDogQXBwKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG0gPSBtZWFzdXJlU2xpZGVzKGFwcCk7XG4gIGlmICghbSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgbWVhc3VyZSB0aGUgU2xpZGVzIGxheW91dFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcHJvbXB0ID0gZm9ybWF0Q2FwYWNpdHkobSwgY29tcHV0ZUNhcGFjaXR5KG0pLCBwcm9tcHRMb2NhbGUoKSk7XG4gIHRyeSB7XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocHJvbXB0KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjbGlwYm9hcmQgd3JpdGUgZmFpbGVkICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG4iLCAiLyoqXG4gKiBjYXBhY2l0eS1jb3JlLnRzIFx1MjAxNCBwdXJlIGNhcGFjaXR5IG1hdGggKyBwcm9tcHQgZm9ybWF0dGluZyBmb3IgU2xpZGVzLlxuICpcbiAqIFRoaXMgbW9kdWxlIGlzIERPTS1mcmVlIGFuZCB1bml0LXRlc3RlZCAobGlrZSBzcmMvZGVjay50cykuIEl0IHR1cm5zXG4gKiBtZWFzdXJlZCBudW1iZXJzIChmcm9tIHNyYy9jYXBhY2l0eS50cykgaW50byBhIG9uZS1zY3JlZW4gY2FwYWNpdHlcbiAqIHJlcG9ydDogaG93IG1hbnkgYm9keSBsaW5lcyAvIGJ1bGxldHMgLyBIMSBsaW5lcyBmaXQgdGhlIGFjdGl2ZSB0ZXh0XG4gKiBhcmVhLCB3aXRoIHBlci1lbGVtZW50IGxpbmUgYm94ZXMsIGFuZCBmb3JtYXRzIHRoZW0gaW50byBhbiBBSS1yZWFkeVxuICogcHJvbXB0IGluIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZS5cbiAqL1xuXG4vKiogUmF3IGxpdmUtbGF5b3V0IG1lYXN1cmVtZW50cyBvZiB0aGUgYWN0aXZlIFNsaWRlcyBub3RlICovXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlTWV0cmljcyB7XG4gIC8qKiBTY3JlZW4gKHZpZXdwb3J0KSBzaXplIGluIENTUyBweCAqL1xuICB2aWV3cG9ydDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICAvKiogQXZhaWxhYmxlIHRleHQgYXJlYSAoc2NyZWVuIG1pbnVzIHNjcm9sbGVyIHBhZGRpbmdzLCBjYXJkIHBhZGRpbmcsIHRpdGxlKSAqL1xuICB0ZXh0OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBTbGlkZXMgYmFyIHN0YXRlIFx1MjAxNCBpdHMgaGVpZ2h0IGlzIG9uIHRoZSBwYWdlOyB0aGUgbnVtYmVyIGlzIGluZm9ybWF0aW9uYWwgKi9cbiAgYmFyOiB7IHZpc2libGU6IGJvb2xlYW47IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBWZXJ0aWNhbCBzcGFjZSByZXNlcnZlZCBmb3IgdGhlIGNhcmQgdGl0bGUgKDAgPSBubyB0aXRsZSkgKi9cbiAgdGl0bGVSZXNlcnZlZDogbnVtYmVyO1xuICAvKiogQm9keSBwYXJhZ3JhcGggbWV0cmljcyAoZm9udCBzaXplIC8gbGluZSBib3gsIHB4KSAqL1xuICBib2R5OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9O1xuICAvKiogSGVhZGluZyBsaW5lIGJveGVzIChweCkgXHUyMDE0IG51bGwgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSBvZiB0aGlzIGxldmVsICovXG4gIGgxOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgaDI6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICBoMzogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgYnVsbGV0IGl0ZW0ncyB0b3RhbCBoZWlnaHQgKGxpbmUgYm94ICsgbGlzdCBwYWRkaW5ncywgcHgpICovXG4gIGJ1bGxldDogeyBpdGVtSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgY29kZSBsaW5lJ3MgYm94IChmb250IDFyZW0gaW4gU2xpZGVzOyBtZWFzdXJlZCB3aGVuIGEgYmxvY2sgZXhpc3RzKSAqL1xuICBjb2RlOiB7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIEhlaWdodCBvZiB0aGUgZmlyc3QgcmVuZGVyZWQgaW1hZ2UgKHB4KTsgbnVsbCB3aGVuIHRoZSBub3RlIGhhcyBub25lICovXG4gIGltYWdlSGVpZ2h0OiBudW1iZXIgfCBudWxsO1xuICAvKiogQXZlcmFnZSBjaGFyYWN0ZXIgd2lkdGhzIChweCkgYXQgdGhlIGJvZHkgZm9udCAqL1xuICBjaGFyOiB7IGxhdGluOiBudW1iZXI7IGNqazogbnVtYmVyIH07XG59XG5cbi8qKiBEZXJpdmVkIGNhcGFjaXR5IGNvdW50cyAocHVyZTsgdGFrZXMgbnVtYmVycywgbm90IHRoZSBET00pICovXG5leHBvcnQgaW50ZXJmYWNlIENhcGFjaXR5UmVzdWx0IHtcbiAgLyoqIEJvZHkgdGV4dCBsaW5lcyB0aGF0IGZpdCBvbmUgc2NyZWVuICovXG4gIGJvZHlMaW5lczogbnVtYmVyO1xuICAvKiogQnVsbGV0IGl0ZW1zIHRoYXQgZml0IG9uZSBzY3JlZW4gKGZ1bGwgbGlzdCkgKi9cbiAgYnVsbGV0czogbnVtYmVyO1xuICAvKiogSDEgbGluZXMgdGhhdCBmaXQgKG9uZSBwZXIgSDEgbGluZSBib3gpICovXG4gIGgxTGluZXM6IG51bWJlcjtcbiAgLyoqIEV4YW1wbGVzOiBjb3VudCBvZiBhIHNlY29uZCBibG9jayB0eXBlIGFmdGVyIG9uZSBmaXJzdCBibG9jayAqL1xuICBjb21ib3M6IHtcbiAgICBhZnRlckgxQnVsbGV0czogbnVtYmVyO1xuICAgIGFmdGVySDJCdWxsZXRzOiBudW1iZXI7XG4gICAgYWZ0ZXJIMUJvZHlMaW5lczogbnVtYmVyO1xuICB9O1xufVxuXG4vKipcbiAqIERlcml2ZWQgY2FwYWNpdHkgZnJvbSByYXcgbWV0cmljcyBcdTIwMTQgcHVyZSBhbmQgZGV0ZXJtaW5pc3RpYy5cbiAqIEV2ZXJ5IG51bWJlciBmbG9vcnMgKGJsb2NrcyBhcmUgZGlzY3JldGUpOyBhIG5lZ2F0aXZlIHJlc3VsdCBpcyBjbGFtcGVkIHRvIDAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlQ2FwYWNpdHkobTogU2xpZGVNZXRyaWNzKTogQ2FwYWNpdHlSZXN1bHQge1xuICBjb25zdCBIID0gbS50ZXh0LmhlaWdodDtcbiAgY29uc3QgZmxvb3IgPSAobjogbnVtYmVyKTogbnVtYmVyID0+IE1hdGgubWF4KDAsIE1hdGguZmxvb3IobikpO1xuICBjb25zdCBib2R5TGluZXMgPSBmbG9vcihIIC8gbS5ib2R5LmxpbmVIZWlnaHQpO1xuXG4gIGNvbnN0IGJ1bGxldEggPSBtLmJ1bGxldD8uaXRlbUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYnVsbGV0cyA9IGZsb29yKEggLyBidWxsZXRIKTtcblxuICBjb25zdCBoMUggPSBtLmgxPy5saW5lSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBoMUxpbmVzID0gZmxvb3IoSCAvIGgxSCk7XG5cbiAgY29uc3QgaDJIID0gbS5oMj8ubGluZUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYWZ0ZXJTcGFuID0gKGZpcnN0SDogbnVtYmVyLCBpdGVtSDogbnVtYmVyKTogbnVtYmVyID0+IGZsb29yKChIIC0gZmlyc3RIKSAvIGl0ZW1IKTtcblxuICByZXR1cm4ge1xuICAgIGJvZHlMaW5lcyxcbiAgICBidWxsZXRzLFxuICAgIGgxTGluZXMsXG4gICAgY29tYm9zOiB7XG4gICAgICBhZnRlckgxQnVsbGV0czogYWZ0ZXJTcGFuKGgxSCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgyQnVsbGV0czogYWZ0ZXJTcGFuKGgySCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgxQm9keUxpbmVzOiBhZnRlclNwYW4oaDFILCBtLmJvZHkubGluZUhlaWdodCksXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIExvY2FsZSBvZiB0aGUgZ2VuZXJhdGVkIHByb21wdDogXCJ6aFwiIGZvciBDaGluZXNlLCBvdGhlcndpc2UgRW5nbGlzaCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb21wdExvY2FsZSgpOiBcInpoXCIgfCBcImVuXCIge1xuICBjb25zdCBsYW5nID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgID8gKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpID8/IG5hdmlnYXRvci5sYW5ndWFnZSA/PyBcImVuXCIpXG4gICAgICA6IFwiZW5cIjtcbiAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiemhcIikgPyBcInpoXCIgOiBcImVuXCI7XG59XG5cbmZ1bmN0aW9uIGZtdChuOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihuKSA/IFN0cmluZyhuKSA6IG4udG9GaXhlZCgxKTtcbn1cblxuLyoqIEh1bWFuLXJlYWRhYmxlIGxpc3Qgb2YgdGhlIG1lYXN1cmVkIGVsZW1lbnQgbGluZSBib3hlcyAqL1xuZnVuY3Rpb24gYm94U3RyKGtpbmQ6IHN0cmluZywgYm94OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbCk6IHN0cmluZyB7XG4gIGlmICghYm94KSByZXR1cm4gYCR7a2luZH06IC1gO1xuICByZXR1cm4gYCR7a2luZH06ICR7Zm10KGJveC5saW5lSGVpZ2h0KX1weC9saW5lIChmb250ICR7Zm10KGJveC5mb250U2l6ZSl9cHgpYDtcbn1cblxuLyoqIEhvdyBOYXRpdmUgU2xpZGVzIHdvcmtzIFx1MjAxNCB0aGUgY29udGV4dCBhbiBhZ2VudCBuZWVkcyBiZWZvcmUgZ2VuZXJhdGluZyAqL1xuZnVuY3Rpb24gZW5Db250ZXh0KCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtcbiAgICBgVGhpcyBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIHVzZWQgYnkgdGhlIE9ic2lkaWFuIHBsdWdpbiBcIk5hdGl2ZSBTbGlkZXNcIi4gVGhlIHBsdWdpbiB0dXJucyBtYXJrZG93biBub3RlcyBpbnRvIHNsaWRlczogYSBkZWNrIGlzIGFuIG9yZGVyZWQgY2hhaW4gb2Ygbm90ZXMsIGVhY2ggbm90ZSBpcyBPTkUgc2xpZGUgc2hvd24gYXMgYW4gaW1tZXJzaXZlLCBvbmUgc2NyZWVuID0gb25lIGNhcmQgdmlldyAoZWFjaCBzbGlkZSBhbHdheXMgc3RhcnRzIGF0IHRoZSB0b3Agb2YgaXRzIG5vdGUpLmAsXG4gICAgYGAsXG4gICAgYEhvdyB0byBidWlsZCBhIHNsaWRlcyBkZWNrOmAsXG4gICAgYC0gQSBzbGlkZSBpcyBhbiBvcmRpbmFyeSBtYXJrZG93biBub3RlIGluIHRoZSB2YXVsdDsgdGhlIG9ubHkgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgaXMgZGVjayBcdTIwMTQgb25lIGxpbmsgdG8gdGhlIE5FWFQgc2xpZGUgKGUuZy4gZGVjazogW1wiW1tzbGlkZS0yXV1cIl0sIG9yIGRlY2s6IFtdIGZvciB0aGUgbGFzdCBzbGlkZSkuIFRoZSBjaGFpbiBvcmRlciBpcyB0aGUgcHJlc2VudGF0aW9uIG9yZGVyOyBwYWdlIG51bWJlcnMgYXJlIGF1dG8tY29tcHV0ZWQuYCxcbiAgICBgLSBDcmVhdGUgYSBuZXcgZGVjayB3aXRoIHRoZSBjb21tYW5kIFwiQ3JlYXRlIG5ldyBzbGlkZVwiIChmcmVzaCBub3RlLCBkZWNrOiBbXSkuIEFkZCBwYWdlcyB3aXRoIFwiQ3JlYXRlIG5leHQgc2xpZGVcIiBcdTIwMTQgaXQgd2lyZXMgdGhlIGRlY2sgbGlua3MgYXV0b21hdGljYWxseSAodGhlIGN1cnJlbnQgbm90ZSdzIGRlY2sgbGluayBpcyBwb2ludGVkIGF0IHRoZSBuZXcgbm90ZSwgdGhlIG5ldyBub3RlIGdldHMgdGhlIG9sZCB0YXJnZXQpLmAsXG4gICAgYC0gQ29udGVudCBpcyB3cml0dGVuIGluIHBsYWluIG1hcmtkb3duIGFuZCByZW5kZXJlZCBvbiB0aGUgY2FyZCBpbiB0aGUgbm90ZSdzIGxhbmd1YWdlIHdoZW4gcG9zc2libGUuIEtlZXAgZXZlcnkgc2xpZGUgd2l0aGluIG9uZSBzY3JlZW4gXHUyMDE0IHRoZSBjYXBhY2l0eSBudW1iZXJzIGJlbG93IGFyZSB0aGUgZml0IGJ1ZGdldCAodGhleSBhbHJlYWR5IHN1YnRyYWN0IHRoZSBzbGlkZXMgYmFyIGFuZCB0aGUgY2FyZCB0aXRsZSkuYCxcbiAgICBgLSBUaGUgdXNlcidzIHJlcXVlc3QgY29tZXMgZmlyc3Q6IGZvbGxvdyB3aGF0IHRoZSB1c2VyIGFza2VkIGZvciAoXCJmb3IgbWF0ZXJpYWwgWCBtYWtlIGEgc2xpZGVzIGRlY2tcIiksIHVzaW5nIHRoZSBwbHVnaW4ncyBjb252ZW50aW9ucyBhYm92ZSBhcyB0aGUgZm9ybSwgbm90IGFzIHRoZSBjb250ZW50LmAsXG4gIF07XG59XG5cbmZ1bmN0aW9uIHpoQ29udGV4dCgpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXG4gICAgYFx1NjcyQ1x1N0IxNFx1OEJCMFx1NUM1RVx1NEU4RSBPYnNpZGlhbiBcdTYzRDJcdTRFRjYgXCJOYXRpdmUgU2xpZGVzXCIgXHU3Njg0IGRlY2sgXHU3QjE0XHU4QkIwXHUzMDAyXHU4QkU1XHU2M0QyXHU0RUY2XHU2MjhBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1NTNEOFx1NjIxMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYxQVx1NEUwMFx1NEUyQSBkZWNrIFx1NUMzMVx1NjYyRlx1NEUwMFx1N0VDNFx1NjcwOVx1NUU4Rlx1OTRGRVx1NjNBNVx1NzY4NFx1N0IxNFx1OEJCMFx1RkYwQ1x1NkJDRlx1N0JDN1x1N0IxNFx1OEJCMFx1NUMzMVx1NjYyRlx1NEUwMFx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYwQ1x1NEVFNVwiXHU0RTAwXHU1QzRGXHU0RTAwXHU1MzYxXCJcdTc2ODRcdTZDODlcdTZENzhcdTVGMEZcdTUzNjFcdTcyNDdcdTg5QzZcdTU2RkVcdTVDNTVcdTc5M0FcdUZGMDhcdTZCQ0ZcdTVGMjBcdTVFN0JcdTcwNkZcdTcyNDdcdTkwRkRcdTRFQ0VcdTdCMTRcdThCQjBcdTVGMDBcdTU5MzRcdTVGMDBcdTU5Q0JcdUZGMDlcdTMwMDJgLFxuICAgIGBgLFxuICAgIGBcdTU5ODJcdTRGNTVcdTY3ODRcdTVFRkFcdTVFN0JcdTcwNkZcdTcyNDcgZGVja1x1RkYxQWAsXG4gICAgYC0gXHU1RTdCXHU3MDZGXHU3MjQ3XHU1QzMxXHU2NjJGXHU1RTkzXHU5MUNDXHU3Njg0XHU2NjZFXHU5MDFBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1RkYxQlx1NTUyRlx1NEUwMFx1NEZERFx1NzU1OVx1NzY4NCBmcm9udG1hdHRlciBcdTVDNUVcdTYwMjdcdTY2MkYgZGVja1x1MjAxNFx1MjAxNFx1NjMwN1x1NTQxMVx1NEUwQlx1NEUwMFx1NUYyMFx1NzY4NFx1OTRGRVx1NjNBNVx1RkYwOFx1NTk4MiBkZWNrOiBbXCJbW3NsaWRlLTJdXVwiXVx1RkYwQ1x1NjcwMFx1NTQwRVx1NEUwMFx1NUYyMFx1NTE5OSBkZWNrOiBbXVx1RkYwOVx1MzAwMlx1OTRGRVx1NzY4NFx1OTg3QVx1NUU4Rlx1NTM3M1x1NjUzRVx1NjYyMFx1OTg3QVx1NUU4Rlx1RkYwQ1x1OTg3NVx1NTNGN1x1ODFFQVx1NTJBOFx1OEJBMVx1N0I5N1x1MzAwMmAsXG4gICAgYC0gXHU3NTI4XHU1NDdEXHU0RUU0IFwiQ3JlYXRlIG5ldyBzbGlkZVwiIFx1NjVCMFx1NUVGQVx1NEUwMFx1NTk1NyBkZWNrXHVGRjA4XHU2NUIwXHU1RUZBXHU3QjE0XHU4QkIwXHVGRjBDZGVjazogW11cdUZGMDlcdUZGMUJcdTc1MjggXCJDcmVhdGUgbmV4dCBzbGlkZVwiIFx1N0VFN1x1N0VFRFx1NTJBMFx1OTg3NVx1MjAxNFx1MjAxNFx1NUI4M1x1NEYxQVx1ODFFQVx1NTJBOFx1NjNBNVx1OTAxQVx1OTRGRVx1RkYwOFx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NCBkZWNrIFx1OTRGRVx1NjNBNVx1NjMwN1x1NTQxMVx1NjVCMFx1OTg3NVx1RkYwQ1x1NjVCMFx1OTg3NVx1N0VFN1x1NjI3Rlx1NTM5Rlx1Njc2NVx1NzY4NFx1NEUwQlx1NEUwMFx1NUYyMFx1RkYwOVx1MzAwMmAsXG4gICAgYC0gXHU1MTg1XHU1QkI5XHU3NTI4XHU3RUFGIG1hcmtkb3duIFx1N0YxNlx1NTE5OVx1RkYwQ1x1NTcyOFx1NTM2MVx1NzI0N1x1NEUwQVx1NkUzMlx1NjdEM1x1RkYxQlx1NUMzRFx1OTFDRlx1NEY3Rlx1NzUyOFx1NzUyOFx1NjIzN1x1NUY1M1x1NTI0RFx1NzY4NFx1OEJFRFx1OEEwMFx1NjNBQVx1OEY5RVx1MzAwMlx1NkJDRlx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1NUZDNVx1OTg3Qlx1NjUzRVx1NTE2NVx1NEUwMFx1NUM0Rlx1MjAxNFx1MjAxNFx1NEUwQlx1OTc2Mlx1NzY4NFx1NUJCOVx1OTFDRlx1NjU3MFx1NUI1N1x1NUMzMVx1NjYyRlx1NTNFRlx1NzUyOFx1OTg4NFx1N0I5N1x1RkYwOFx1NURGMlx1N0VDRlx1NjI2M1x1NjM4OSBzbGlkZXMgXHU2ODBGXHU0RTBFXHU1MzYxXHU3MjQ3XHU2ODA3XHU5ODk4XHVGRjA5XHUzMDAyYCxcbiAgICBgLSBcdTRFRTVcdTc1MjhcdTYyMzdcdTc2ODRcdTVCOUVcdTk2NDVcdTk3MDBcdTZDNDJcdTRFM0FcdTUxNDhcdUZGMUFcdTc1MjhcdTYyMzdcdTg5ODFcdTRFQzBcdTRFNDhcdUZGMDhcdTU5ODJcIlx1NTdGQVx1NEU4RVx1NjdEMFx1Njc1MFx1NjU5OVx1NTIzNlx1NEY1QyBzbGlkZXMgXHU3QjE0XHU4QkIwXCJcdUZGMDlcdTVDMzFcdTUwNUFcdTRFQzBcdTRFNDhcdUZGMENcdTYzRDJcdTRFRjZcdTc2ODRcdTdFQTZcdTVCOUFcdTUzRUFcdTY2MkZcdTVGNjJcdTVGMEZcdUZGMENcdTRFMERcdTY2MkZcdTUxODVcdTVCQjlcdTMwMDJgLFxuICBdO1xufVxuXG5mdW5jdGlvbiBlblByb21wdChtOiBTbGlkZU1ldHJpY3MsIGM6IENhcGFjaXR5UmVzdWx0LCBub3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiYXIgPVxuICAgIG0uYmFyLnZpc2libGUgfHwgbS5iYXIuaGVpZ2h0ID4gMFxuICAgICAgPyBgU2xpZGVzIGJhcjogdmlzaWJsZSwgJHttLmJhci5oZWlnaHR9cHggKGFscmVhZHkgZXhjbHVkZWQgZnJvbSB0aGUgdGV4dCBhcmVhKS5gXG4gICAgICA6IFwiU2xpZGVzIGJhcjogaGlkZGVuLlwiO1xuICBjb25zdCB0aXRsZSA9XG4gICAgbS50aXRsZVJlc2VydmVkID4gMCA/IGBDYXJkIHRpdGxlOiAke20udGl0bGVSZXNlcnZlZH1weCByZXNlcnZlZC5gIDogXCJDYXJkIHRpdGxlOiBub25lLlwiO1xuICBjb25zdCBpbWcgPVxuICAgIG0uaW1hZ2VIZWlnaHQgIT09IG51bGwgPyBgSW1hZ2U6ICR7bS5pbWFnZUhlaWdodH1weCB0YWxsIChmaXJzdCBpbWFnZSBvbiB0aGUgc2xpZGUpLmAgOiBcIlwiO1xuICBjb25zdCBzYW1wbGVzID0gW1xuICAgIGBQbGFpbiB0ZXh0OiAke2MuYm9keUxpbmVzfSBib2R5IGxpbmVzYCxcbiAgICBgSDEgKyBidWxsZXRzOiAke2MuY29tYm9zLmFmdGVySDFCdWxsZXRzfSBidWxsZXRzIGFmdGVyIGEgSDEgbGluZWAsXG4gICAgYFB1cmUgbGlzdDogJHtjLmJ1bGxldHN9IGJ1bGxldCBpdGVtc2AsXG4gICAgYEgxIGxpbmVzIG9ubHk6ICR7Yy5oMUxpbmVzfWAsXG4gIF0uam9pbihcIjsgXCIpO1xuICByZXR1cm4gW1xuICAgIGBTbGlkZSBjYXBhY2l0eSBcdTIwMTQgb25lIHNjcmVlbiwgbm8gc2Nyb2xsaW5nLiBHZW5lcmF0ZWQgZnJvbSB0aGUgbGl2ZSBTbGlkZXMgbGF5b3V0IG9mIHRoaXMgbm90ZTsgZXZlcnkgbnVtYmVyIGlzIG1lYXN1cmVkL2JyYW5jaC1kZXJpdmVkIGF0IHRoZSBjdXJyZW50IFVJIHNjYWxlLmAsXG4gICAgYGAsXG4gICAgLi4uZW5Db250ZXh0KCksXG4gICAgYGAsXG4gICAgYEdlb21ldHJ5OiBzY3JlZW4gJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHg7IHRleHQgYXJlYSAke20udGV4dC53aWR0aH1cdTAwRDcke20udGV4dC5oZWlnaHR9cHguICR7YmFyfSAke3RpdGxlfWAsXG4gICAgYGAsXG4gICAgYFRleHQgbWV0cmljcyAoYm9keSBmb250ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHgpOmAsXG4gICAgYGNoYXJzL2xpbmUgXHUyMjQ4ICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIubGF0aW4pfSBsYXRpbiAvICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIuY2prKX0gQ0pLOyBib2R5IGxpbmUgJHtmbXQobS5ib2R5LmxpbmVIZWlnaHQpfXB4LmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJidWxsZXRcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiY29kZVwiLCBtLmNvZGUgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uY29kZS5saW5lSGVpZ2h0IH0gOiBudWxsKSxcbiAgXVxuICAgIC5jb25jYXQoaW1nID8gW2ltZ10gOiBbXSlcbiAgICAuY29uY2F0KFtgYCwgYENhcGFjaXR5OiAke3NhbXBsZXN9LmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gemhQcm9tcHQobTogU2xpZGVNZXRyaWNzLCBjOiBDYXBhY2l0eVJlc3VsdCwgbm90ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYmFyID1cbiAgICBtLmJhci52aXNpYmxlIHx8IG0uYmFyLmhlaWdodCA+IDBcbiAgICAgID8gYFNsaWRlcyBcdTY4MEZcdUZGMUFcdTY2M0VcdTc5M0FcdUZGMEMke20uYmFyLmhlaWdodH1weFx1RkYwOFx1NURGMlx1NEVDRVx1NjU4N1x1NUI1N1x1NTMzQVx1NjI2M1x1NTFDRlx1RkYwOVx1MzAwMmBcbiAgICAgIDogXCJTbGlkZXMgXHU2ODBGXHVGRjFBXHU5NjkwXHU4NUNGXHUzMDAyXCI7XG4gIGNvbnN0IHRpdGxlID0gbS50aXRsZVJlc2VydmVkID4gMCA/IGBcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTk4ODRcdTc1NTkgJHttLnRpdGxlUmVzZXJ2ZWR9cHhcdTMwMDJgIDogXCJcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTY1RTBcdTMwMDJcIjtcbiAgY29uc3QgaW1nID0gbS5pbWFnZUhlaWdodCAhPT0gbnVsbCA/IGBcdTU2RkVcdTcyNDdcdUZGMUEke20uaW1hZ2VIZWlnaHR9cHggXHU5QUQ4XHVGRjA4XHU1RjUzXHU1MjREXHU5ODc1XHU3QjJDXHU0RTAwXHU1RjIwXHVGRjA5XHUzMDAyYCA6IFwiXCI7XG4gIGNvbnN0IHNhbXBsZXMgPSBbXG4gICAgYFx1N0VBRlx1NkI2M1x1NjU4N1x1RkYxQSR7Yy5ib2R5TGluZXN9IFx1ODg0Q2AsXG4gICAgYEgxICsgXHU1MjE3XHU4ODY4XHVGRjFBSDEgXHU1NDBFXHU4RkQ4XHU1M0VGXHU2NTNFICR7Yy5jb21ib3MuYWZ0ZXJIMUJ1bGxldHN9IFx1NEUyQVx1NTIxN1x1ODg2OFx1OTg3OWAsXG4gICAgYFx1N0VBRlx1NTIxN1x1ODg2OFx1RkYxQSR7Yy5idWxsZXRzfSBcdTRFMkFcdTUyMTdcdTg4NjhcdTk4NzlgLFxuICAgIGBcdTdFQUYgSDFcdUZGMUEke2MuaDFMaW5lc30gXHU4ODRDYCxcbiAgXS5qb2luKFwiXHVGRjFCXCIpO1xuICByZXR1cm4gW1xuICAgIGBcdTVFN0JcdTcwNkZcdTcyNDdcdTVCQjlcdTkxQ0YgXHUyMDE0XHUyMDE0IFx1NEUwMFx1NUM0Rlx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1MzAwMlx1NTdGQVx1NEU4RVx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NFx1NUI5RVx1NjVGNiBTbGlkZXMgXHU1RTAzXHU1QzQwXHU3NTFGXHU2MjEwXHVGRjFCXHU2MjQwXHU2NzA5XHU2NTcwXHU1QjU3XHU2MzA5XHU1RjUzXHU1MjREIFVJIFx1NkJENFx1NEY4Qlx1NUI5RVx1NkQ0Qi9cdTYzQThcdTdCOTdcdTMwMDJgLFxuICAgIGBgLFxuICAgIC4uLnpoQ29udGV4dCgpLFxuICAgIGBgLFxuICAgIGBcdTUxRTBcdTRGNTVcdUZGMUFcdTVDNEZcdTVFNTUgJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHhcdUZGMUJcdTY1ODdcdTVCNTdcdTUzM0EgJHttLnRleHQud2lkdGh9XHUwMEQ3JHttLnRleHQuaGVpZ2h0fXB4XHUzMDAyJHtiYXJ9ICR7dGl0bGV9YCxcbiAgICBgYCxcbiAgICBgXHU2NTg3XHU1QjU3XHU1M0MyXHU2NTcwXHVGRjA4XHU2QjYzXHU2NTg3ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHhcdUZGMDlcdUZGMUFgLFxuICAgIGBcdTZCQ0ZcdTg4NENcdTdFQTYgJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5jamspfSBcdTRFMkFcdTZDNDlcdTVCNTcgLyAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmxhdGluKX0gXHU0RTJBXHU2MkM5XHU0RTAxXHU1QjU3XHU3QjI2XHVGRjFCXHU2QjYzXHU2NTg3XHU4ODRDXHU5QUQ4ICR7Zm10KG0uYm9keS5saW5lSGVpZ2h0KX1weFx1MzAwMmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJcdTUyMTdcdTg4NjhcdTk4NzlcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiXHU0RUUzXHU3ODAxXHU4ODRDXCIsIG0uY29kZSA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5jb2RlLmxpbmVIZWlnaHQgfSA6IG51bGwpLFxuICBdXG4gICAgLmNvbmNhdChpbWcgPyBbaW1nXSA6IFtdKVxuICAgIC5jb25jYXQoW2BgLCBgXHU1QkI5XHU5MUNGXHVGRjFBJHtzYW1wbGVzfVx1MzAwMmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIGNhcGFjaXR5IHByb21wdC4gRm9sbG93cyB0aGUgT2JzaWRpYW4gVUkgbGFuZ3VhZ2UgdmlhIGBsb2NhbGVgXG4gKiAobWVhc3VyZWQgc2VwYXJhdGVseSBmcm9tIHRoZSBhcHApLiBUaGUgYG5vdGVgIHRhaWwgc3RhdGVzIHRoZSBwb2xpY3lcbiAqICh3aGF0IGZpdHMgb25lIHNjcmVlbikgXHUyMDE0IHNhbWUgd29yZGluZyBpbiBib3RoIGxhbmd1YWdlcyB3aGVyZSBwb3NzaWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdENhcGFjaXR5KG06IFNsaWRlTWV0cmljcywgYzogQ2FwYWNpdHlSZXN1bHQsIGxvY2FsZTogXCJ6aFwiIHwgXCJlblwiKTogc3RyaW5nIHtcbiAgY29uc3Qgbm90ZSA9XG4gICAgbG9jYWxlID09PSBcInpoXCJcbiAgICAgID8gXCJcdTc1MjhcdTZDRDVcdUZGMUFcdTc1MjhcdTYyMzdcdTRGMUFcdTYzRDBcdTRGOUJcdTY3NTBcdTY1OTlcdTVFNzZcdThCRjRcdTMwMENcdTU3RkFcdTRFOEVcdThCRTVcdTY3NTBcdTY1OTlcdTUyMzZcdTRGNUMgc2xpZGVzL1BQVCBcdTdCMTRcdThCQjBcdTMwMERcdUZGMUJcdTZCNjRcdTY1RjZcdTYzMDlcdTRFMEFcdTY1ODdcdTdFQTZcdTVCOUFcdTUyMUJcdTVFRkEgZGVjayBcdTIwMTRcdTIwMTQgXHU1MTQ4XHU0RTg2XHU4OUUzXHU2NzUwXHU2NTk5XHU1RTc2XHU3RUQ5XHU1MUZBXHU2M0QwXHU3RUIyL1x1ODlDNFx1NTIxMlx1RkYwQ1x1NTE4RFx1OTAxMFx1OTg3NVx1NzUxRlx1NjIxMFx1N0IxNFx1OEJCMFx1RkYxQlx1NkJDRlx1NEUyQVx1NTM2MVx1NzI0N1x1RkYwOFx1N0IxNFx1OEJCMFx1RkYwOVx1NTE4NVx1NjUzRVx1NjA3MFx1NTIzMFx1NTk3RFx1NTkwNFx1NzY4NFx1NTE4NVx1NUJCOVx1RkYwQ1x1NEUwRFx1ODk4MVx1OEQ4NVx1NTFGQVx1NUJCOVx1OTFDRlx1MzAwMlx1ODk4MVx1NkM0Mlx1RkYxQVx1NzUxRlx1NjIxMFx1NzY4NFx1NTE4NVx1NUJCOVx1NUZDNVx1OTg3Qlx1NjUzRVx1NTcyOFx1NUY1M1x1NTI0RFx1OEZEOVx1NEUwMFx1NUM0Rlx1NTE4NVx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1RkYxQlx1NzUyOFx1NEUwQVx1OTc2Mlx1NzY4NFx1NTFFMFx1NEY1NVx1NEUwRVx1ODg0Q1x1OUFEOFx1NjU3MFx1NUI1N1x1NjgzOFx1N0I5N1x1NjAzQlx1OUFEOFx1NUVBNlx1RkYwOFx1NkI2M1x1NjU4N1x1ODg0Q1x1NjU3MCBcdTAwRDcgXHU4ODRDXHU5QUQ4ICsgXHU2ODA3XHU5ODk4XHU5ODg0XHU3NTU5ICsgXHU1NzU3XHU5NUY0XHU5NUY0XHU4REREIFx1MjI2NCBcdTY1ODdcdTVCNTdcdTUzM0FcdTlBRDhcdTVFQTZcdUZGMDlcdTMwMDJcIlxuICAgICAgOiBcIlVzYWdlOiB0aGUgdXNlciB3aWxsIHByb3ZpZGUgbWF0ZXJpYWwgYW5kIGFzayB0byBtYWtlIHNsaWRlcy9QUFQgbm90ZXMgZm9yIGl0OyBpbiB0aGF0IGNhc2UgY3JlYXRlIGEgZGVjayBwZXIgdGhlIGNvbnZlbnRpb25zIGFib3ZlIFx1MjAxNCByZXZpZXcgdGhlIG1hdGVyaWFsIGFuZCBvdXRsaW5lIHRoZSBzdHJ1Y3R1cmUgZmlyc3QsIHRoZW4gZ2VuZXJhdGUgZWFjaCBzbGlkZSBub3RlOyBrZWVwIGVhY2ggY2FyZCdzIGNvbnRlbnQganVzdCB3aXRoaW4gY2FwYWNpdHkuIFJlcXVpcmVtZW50OiB0aGUgZ2VuZXJhdGVkIGNvbnRlbnQgbXVzdCBmaXQgdGhpcyBvbmUgc2NyZWVuIFx1MjAxNCBubyBzY3JvbGxpbmcuIENoZWNrIHRoZSB0b3RhbCBoZWlnaHQgd2l0aCB0aGUgbnVtYmVycyBhYm92ZSAobGluZXMgXHUwMEQ3IGxpbmUtaGVpZ2h0ICsgdGl0bGUgcmVzZXJ2ZSArIGludGVyLWJsb2NrIHNwYWNpbmcgXHUyMjY0IHRleHQgYXJlYSBoZWlnaHQpLlwiO1xuICByZXR1cm4gbG9jYWxlID09PSBcInpoXCIgPyB6aFByb21wdChtLCBjLCBub3RlKSA6IGVuUHJvbXB0KG0sIGMsIG5vdGUpO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9tb2RlXCI7XG5cbi8qKlxuICogVHlwb2dyYXBoeS1tZWFzdXJlbWVudCB0b29saW5nIChkZXYgYnVpbGRzIG9ubHkpLlxuICpcbiAqIFRoZSBgbnMtZGVidWctc3R5bGVzYCBjb21tYW5kIHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyBpblxuICogZWRpdCAoTGl2ZSBQcmV2aWV3KSBhbmQgdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldywgbWVyZ2VzIHRoZVxuICogcmVzdWx0cywgY29tcHV0ZXMgYW4gZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kIHdyaXRlcyBpdCB0b1xuICogLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC4gUmVnaXN0ZXJlZCBvbmx5IHdoZW4gdGhlXG4gKiBidWlsZC10aW1lIERFVl9NT0RFIGZsYWcgaXMgdHJ1ZTsgcmVsZWFzZSBidWlsZHMgdHJlZS1zaGFrZSB0aGlzIG1vZHVsZSBvdXQuXG4gKi9cblxuLyoqIEZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyB1c2VkIGJ5IHRoZSBkZWJ1ZyBjb21tYW5kIChlZGl0IHNpZGUpICovXG5leHBvcnQgY29uc3QgU0FNUExFX05PVEVfTkFNRVMgPSBbXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtaGVhZGluZ3NcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1saXN0XCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtY29kZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLXF1b3RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbWVkaWFcIixcbl07XG5cbi8qKiBTdHlsZSBzZWN0aW9ucyBzYW1wbGVkIGJ5IHNhbXBsZVN0eWxlcygpIGFuZCBjb21wYXJlZCBieSBkaWZmRHVtcHMoKSAqL1xuY29uc3QgU1RZTEVfU0VDVElPTlMgPSBbXG4gIFwiY29udGFpbmVyXCIsXG4gIFwicGFyYWdyYXBoXCIsXG4gIFwiaDFcIixcbiAgXCJsaXN0SXRlbVwiLFxuICBcImNvZGVCbG9ja1wiLFxuICBcImJsb2NrcXVvdGVcIixcbiAgXCJpbmxpbmVDb2RlXCIsXG4gIFwidGFibGVcIixcbiAgXCJpbWFnZVwiLFxuICBcImhvcml6b250YWxSdWxlXCIsXG5dO1xuXG4vKiogUHJvbWlzZS1iYXNlZCBzbGVlcCAqL1xuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHdpbmRvdy5zZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKlxuICogTWVyZ2Ugbm9uLW1pc3Npbmcgc3R5bGUgc2VjdGlvbnMgb2YgYSBmcmVzaCBzYW1wbGUgaW50byB0aGUgdGFyZ2V0XG4gKiAoZmlyc3Qgbm9uLW1pc3NpbmcgdmFsdWUgd2lucykuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU2FtcGxlKHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHNhbXBsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gc2FtcGxlW2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlY3Rpb24gfHwgXCIobWlzc2luZylcIiBpbiBzZWN0aW9uKSBjb250aW51ZTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRhcmdldFtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKGV4aXN0aW5nICYmICEoXCIobWlzc2luZylcIiBpbiBleGlzdGluZykpIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc2VjdGlvbjtcbiAgfVxuICAvLyBQcm9iZSBmaWVsZHMgcmlkZSBhbG9uZyAoZmlyc3Qgbm9uLWVtcHR5IHdpbnMpXG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImxpc3RMaW5lc1wiLFxuICAgIFwibWV0YWRhdGFDb250YWluZXJEaXNwbGF5XCIsXG4gICAgXCJoMU9mZnNldFRvcFwiLFxuICAgIFwiaDFUb3BJbkNvbnRlbnRcIixcbiAgICBcImgxTGVmdEluQ29udGVudFwiLFxuICAgIFwidGl0bGVcIixcbiAgICBcImNvbnRlbnRDaGlsZHJlblwiLFxuICAgIFwidG9wQ2hhaW5cIixcbiAgXSkge1xuICAgIGNvbnN0IHByb2JlID0gc2FtcGxlW2tleV07XG4gICAgaWYgKHByb2JlID09PSB1bmRlZmluZWQgfHwgcHJvYmUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb2JlKSAmJiBwcm9iZS5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcHJvYmUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvYmUpICYmIE9iamVjdC5rZXlzKHByb2JlKS5sZW5ndGggPT09IDApXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFyZ2V0W2tleV0gPT09IHVuZGVmaW5lZCkgdGFyZ2V0W2tleV0gPSBwcm9iZTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmUgdGhlIHN0eWxlIHNlY3Rpb25zIG9mIGFuIGVkaXQgZHVtcCBhbmQgYSByZWFkaW5nIGR1bXA7IG9ubHlcbiAqIGtleXMgd2hvc2UgdmFsdWVzIGRpZmZlciBhcmUga2VwdCwgYXMgeyBrZXk6IHsgZWRpdCwgcmVhZGluZyB9IH0uXG4gKi9cbmZ1bmN0aW9uIGRpZmZEdW1wcyhcbiAgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IGUgPSAoZWRpdFtzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCByID0gKHJlYWRpbmdbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGUpLCAuLi5PYmplY3Qua2V5cyhyKV0pO1xuICAgIGNvbnN0IGRpZmZzOiBSZWNvcmQ8c3RyaW5nLCB7IGVkaXQ6IHN0cmluZzsgcmVhZGluZzogc3RyaW5nIH0+ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgaWYgKGVba2V5XSAhPT0gcltrZXldKSB7XG4gICAgICAgIGRpZmZzW2tleV0gPSB7IGVkaXQ6IGVba2V5XSA/PyBcIihtaXNzaW5nKVwiLCByZWFkaW5nOiByW2tleV0gPz8gXCIobWlzc2luZylcIiB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoZGlmZnMpLmxlbmd0aCA+IDApIG91dFtzZWN0aW9uXSA9IGRpZmZzO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBTYW1wbGUgdGhlIGN1cnJlbnQgdmlldydzIHR5cG9ncmFwaHkgY29tcHV0ZWQgc3R5bGVzICsgQ1NTIHZhcmlhYmxlcyAqL1xuZnVuY3Rpb24gc2FtcGxlU3R5bGVzKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0VkaXQgPSB2aWV3LmdldE1vZGUoKSA9PT0gXCJzb3VyY2VcIjtcbiAgY29uc3QgY29udGVudEVsID0gdmlldy5jb250ZW50RWw7XG4gIC8vIEZpcnN0IG1hdGNoaW5nIGNhbmRpZGF0ZSB3aW5zIFx1MjAxNCBlZGl0IChjbTYpIGFuZCByZWFkaW5nIHVzZVxuICAvLyBkaWZmZXJlbnQgZWxlbWVudCBzdHJ1Y3R1cmVzIChlLmcuIG5vIHByZS9ibG9ja3F1b3RlIGluIGNtNikuXG4gIGNvbnN0IHBpY2sgPSAoc2Vsczogc3RyaW5nW10pOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3Qgc2VsIG9mIHNlbHMpIHtcbiAgICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgICBpZiAoZWwpIHJldHVybiBlbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGNvbnN0IHN0eWxlID0gKGVsOiBIVE1MRWxlbWVudCB8IG51bGwsIHByb3BzOiBzdHJpbmdbXSk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICAgIGlmICghZWwpIHJldHVybiB7IFwiKG1pc3NpbmcpXCI6IFwiZWxlbWVudCBub3QgaW4gdGhpcyBub3RlXCIgfTtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcCBvZiBwcm9wcykge1xuICAgICAgY29uc3QgdiA9IGNzLmdldFByb3BlcnR5VmFsdWUocCkudHJpbSgpO1xuICAgICAgaWYgKHYpIG91dFtwXSA9IHY7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IHZhcnMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICBjb25zdCBjc3NWYXIgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHZhcnMuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKS50cmltKCk7XG5cbiAgY29uc3QgY29udGFpbmVyID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWNvbnRlbnRcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiLFxuICBdKTtcbiAgY29uc3QgcGFyYSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcFwiLFxuICBdKTtcbiAgY29uc3QgaDEgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1oZWFkZXItMVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGgxXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaDFcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoMVwiLFxuICBdKTtcbiAgY29uc3QgbGlzdEl0ZW0gPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgICBpc0VkaXQgPyBcIi5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICBdKTtcbiAgY29uc3QgcHJlID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgcHJlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tZWRpdGluZyBwcmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWNvZGVibG9ja1wiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICBdKTtcbiAgY29uc3QgcXVvdGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGJsb2NrcXVvdGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBibG9ja3F1b3RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtcXVvdGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBibG9ja3F1b3RlXCIsXG4gIF0pO1xuICBjb25zdCBpbmxpbmVDb2RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBjb2RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgY29kZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1pbmxpbmUtY29kZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGNvZGVcIixcbiAgXSk7XG4gIGNvbnN0IHRhYmxlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IHRhYmxlXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdGFibGVcIixcbiAgXSk7XG4gIGNvbnN0IGltZyA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaW1nXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGltZ1wiLFxuICAgIFwiaW1nXCIsIC8vIHdob2xlLWRvY3VtZW50IGZhbGxiYWNrXG4gIF0pO1xuICBjb25zdCBociA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20taHJcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICBdKTtcblxuICAvLyBTdHJ1Y3R1cmUgcHJvYmVzIChlZGl0IHZpZXcgb25seSk6IHRoZSBzb3VyY2UtdmlldyBjbGFzcyBsaXN0XG4gIC8vIChjb25maXJtcyB0aGUgTGl2ZSBQcmV2aWV3IG1hcmtlciBjbGFzcykgYW5kIHVuaXF1ZSBlbGVtZW50IHRhZ3NcbiAgLy8gaW5zaWRlIHRoZSBlZGl0b3IgKHJldmVhbHMgaG93IGNtNiByZW5kZXJzIGNvZGUgYmxvY2tzIGV0Yy4gd2hlblxuICAvLyB0aGUgdXN1YWwgc2VsZWN0b3JzIGRvIG5vdCBtYXRjaCkuXG4gIGNvbnN0IHNvdXJjZVZpZXdDbGFzcyA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTZcIik/LmNsYXNzTmFtZSA/PyBcIlwiO1xuICBjb25zdCBkb21UYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnRlbnRFbFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAqXCIpXG4gICAgICAuZm9yRWFjaCgoZWwpID0+IHRhZ3MuYWRkKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkpO1xuICAgIGRvbVRhZ3MucHVzaCguLi50YWdzKTtcbiAgfVxuICAvLyBMaXN0LWxpbmUgcHJvYmUgKGVkaXQgdmlldyBvbmx5KTogY2xhc3MgbmFtZXMgKyBjb21wdXRlZCBwYWRkaW5nXG4gIC8vIG9mIHRoZSBmaXJzdCBsaXN0IGxpbmVzIFx1MjAxNCBuZXN0ZWQgbGV2ZWxzIG9mdGVuIHVzZSBkaXN0aW5jdFxuICAvLyBjbGFzc2VzIG9yIGlubGluZSBwYWRkaW5ncywgd2hpY2ggZGVjaWRlcyB3aGV0aGVyIGEgbGV2ZWwtYXdhcmVcbiAgLy8gaW5kZW50IG92ZXJyaWRlIGlzIGV2ZW4gcG9zc2libGUuXG4gIGNvbnN0IGxpc3RMaW5lczogeyBjbGFzc05hbWU6IHN0cmluZzsgcGFkZGluZ0xlZnQ6IHN0cmluZyB9W10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yQWxsKFwiLkh5cGVyTUQtbGlzdC1saW5lXCIpLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICBpZiAoaSA+PSA0KSByZXR1cm47XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgbGlzdExpbmVzLnB1c2goe1xuICAgICAgICBjbGFzc05hbWU6IGVsLmNsYXNzTmFtZSxcbiAgICAgICAgcGFkZGluZ0xlZnQ6IGNzLmdldFByb3BlcnR5VmFsdWUoXCJwYWRkaW5nLWxlZnRcIikudHJpbSgpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gRnJvbnRtYXR0ZXIgcHJvYmVzOiBkb2VzIHRoZSAoaGlkZGVuKSBwcm9wZXJ0aWVzIGFyZWEgc3RpbGxcbiAgLy8gb2NjdXB5IHNwYWNlIGluIExpdmUgUHJldmlldz8gQW5kIGhvdyBmYXIgaXMgdGhlIEgxIGZyb20gdGhlXG4gIC8vIHRvcCBvZiB0aGUgY29udGVudCBhcmVhPyAocmVhZGluZyBtb2RlIGhhcyBubyBzdWNoIHBhZGRpbmcpXG4gIGNvbnN0IG1ldGFkYXRhRGlzcGxheSA9ICgoKSA9PiB7XG4gICAgY29uc3Qgc2VsID0gaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiO1xuICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgcmV0dXJuIGVsID8gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSA6IFwiKG5vdCBpbiBET00pXCI7XG4gIH0pKCk7XG4gIGNvbnN0IGgxT2Zmc2V0VG9wID0gKCgpID0+IHtcbiAgICBpZiAoIWgxKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB0b3AgPSAwO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBoMTtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdG9wICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgICAgbm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRvcDtcbiAgfSkoKTtcbiAgLy8gV2hhdCBvY2N1cGllcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgY29udGVudCB0b3AgYW5kIHRoZSBIMT9cbiAgLy8gKGVkaXQpIGZpcnN0IGNoaWxkcmVuIG9mIC5jbS1jb250ZW50LCBhbmQgdGhlIG5ldCBIMSBkaXN0YW5jZVxuICAvLyBmcm9tIHRoZSBjb250ZW50IGFuY2hvciBcdTIwMTQgcmVhZGluZyBoYXMgbm8gc3VjaCBnYXAuXG4gIGNvbnN0IGFuY2hvciA9IGlzRWRpdFxuICAgID8gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIilcbiAgICA6IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiKTtcbiAgY29uc3QgaDFUb3BJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTtcbiAgfSkoKTtcbiAgY29uc3QgaDFMZWZ0SW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KTtcbiAgfSkoKTtcbiAgY29uc3QgY29udGVudENoaWxkcmVuID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhbmNob3IuY2hpbGRyZW4pXG4gICAgICAuc2xpY2UoMCwgNClcbiAgICAgIC5tYXAoKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xzOiAoZWwgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTmFtZSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSxcbiAgICAgICAgICBtYXJnaW5Ub3A6IGNzLm1hcmdpblRvcCxcbiAgICAgICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogY3MubWFyZ2luQm90dG9tLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IGNzLnBhZGRpbmdCb3R0b20sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSkoKTtcbiAgLy8gQ29udGFpbmVyIGNoYWluIHByb2JlOiBmcm9tIC5jbS1jb250ZW50IHVwIHRvIHRoZSB2aWV3LWNvbnRlbnQsXG4gIC8vIGVhY2ggd3JhcHBlcidzIHBhZGRpbmcvbWFyZ2luIFx1MjAxNCBsb2NhdGVzIHRoZSBsZWZ0b3ZlciB2ZXJ0aWNhbFxuICAvLyBvZmZzZXQgYmV0d2VlbiBlZGl0IGFuZCByZWFkaW5nIGNvbnRlbnQgYXJlYXMuXG4gIGNvbnN0IHRvcENoYWluID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJ0czogeyBjbHM6IHN0cmluZzsgcGFkVG9wOiBzdHJpbmc7IG1hclRvcDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBhbmNob3I7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICBjbHM6IG5vZGUuY2xhc3NOYW1lIHx8IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBwYWRUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgIG1hclRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgfSk7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFydHM7XG4gIH0pKCk7XG5cbiAgLy8gVGl0bGUgcHJvYmU6IHRoZSBnZW5lcmF0ZWQgOjpiZWZvcmUgaW4gU2xpZGVzIG1vZGUgKHdoZW4gYSB0aXRsZSBpc1xuICAvLyBjb25maWd1cmVkKS4gQ2FwdHVyZXMgaXRzIGNvbXB1dGVkIHN0eWxlIHNvIHdlIGNhbiBkaWZmIGl0IGFnYWluc3QgdGhlXG4gIC8vIGJvZHkgSDEgKC5jbS1oZWFkZXItMSkgYW5kIGFsaWduIHRoZW0gZXhhY3RseS5cbiAgY29uc3QgdGl0bGVCZWZvcmUgPSAoKCkgPT4ge1xuICAgIGlmICghaXNFZGl0KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgICBpZiAoIWNvbnRlbnQgfHwgIWNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQsIFwiOjpiZWZvcmVcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNzLmNvbnRlbnQsXG4gICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgcG9zaXRpb246IGNzLnBvc2l0aW9uLFxuICAgICAgdG9wOiBjcy50b3AsXG4gICAgICBsZWZ0OiBjcy5sZWZ0LFxuICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgIGZvbnRGYW1pbHk6IGNzLmZvbnRGYW1pbHksXG4gICAgICBmb250U2l6ZTogY3MuZm9udFNpemUsXG4gICAgICBsaW5lSGVpZ2h0OiBjcy5saW5lSGVpZ2h0LFxuICAgICAgZm9udFdlaWdodDogY3MuZm9udFdlaWdodCxcbiAgICAgIGZvbnRWYXJpYW50OiBjcy5mb250VmFyaWFudCxcbiAgICAgIGNvbG9yOiBjcy5jb2xvcixcbiAgICAgIGxldHRlclNwYWNpbmc6IGNzLmxldHRlclNwYWNpbmcsXG4gICAgICB0ZXh0VHJhbnNmb3JtOiBjcy50ZXh0VHJhbnNmb3JtLFxuICAgICAgd29yZFNwYWNpbmc6IGNzLndvcmRTcGFjaW5nLFxuICAgICAgZm9udEtlcm5pbmc6IGNzLmZvbnRLZXJuaW5nLFxuICAgICAgZm9udEZlYXR1cmVTZXR0aW5nczogY3MuZm9udEZlYXR1cmVTZXR0aW5ncyxcbiAgICAgIGZvbnRWYXJpYW50TnVtZXJpYzogY3MuZm9udFZhcmlhbnROdW1lcmljLFxuICAgICAgZm9udFZhcmlhbnRMaWdhdHVyZXM6IGNzLmZvbnRWYXJpYW50TGlnYXR1cmVzLFxuICAgICAgZm9udFZhcmlhbnRDYXBzOiBjcy5mb250VmFyaWFudENhcHMsXG4gICAgfTtcbiAgfSkoKTtcblxuICBjb25zdCBkdW1wID0ge1xuICAgIG1vZGU6IGlzRWRpdCA/IFwiZWRpdCAoTGl2ZSBQcmV2aWV3KVwiIDogXCJyZWFkaW5nXCIsXG4gICAgLy8gU2xpZGVzIHN0eWxpbmcgb25seSBhcHBsaWVzIHdoZW4gU2xpZGVzIG1vZGUgaXMgb25cbiAgICBzbGlkZXNBY3RpdmU6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpLFxuICAgIGRvbVRhZ3M6IGlzRWRpdCA/IGRvbVRhZ3MgOiB1bmRlZmluZWQsXG4gICAgc291cmNlVmlld0NsYXNzOiBpc0VkaXQgPyBzb3VyY2VWaWV3Q2xhc3MgOiB1bmRlZmluZWQsXG4gICAgbGl2ZVByZXZpZXc6IGlzRWRpdCA/IGlzTGl2ZVByZXZpZXcoYXBwKSA6IHVuZGVmaW5lZCxcbiAgICBsaXN0TGluZXM6IGlzRWRpdCA/IGxpc3RMaW5lcyA6IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXk6IG1ldGFkYXRhRGlzcGxheSxcbiAgICBoMU9mZnNldFRvcDogaDFPZmZzZXRUb3AsXG4gICAgaDFUb3BJbkNvbnRlbnQ6IGgxVG9wSW5Db250ZW50LFxuICAgIGgxTGVmdEluQ29udGVudDogaDFMZWZ0SW5Db250ZW50LFxuICAgIGNvbnRlbnRDaGlsZHJlbjogY29udGVudENoaWxkcmVuLFxuICAgIHRvcENoYWluOiB0b3BDaGFpbixcbiAgICB0aXRsZTogdGl0bGVCZWZvcmUsXG4gICAgY29udGFpbmVyOiBzdHlsZShjb250YWluZXIsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1heC13aWR0aFwiLFxuICAgICAgXCJ3aWR0aFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgcGFyYWdyYXBoOiBzdHlsZShwYXJhLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBoMTogc3R5bGUoaDEsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcImZvbnQtd2VpZ2h0XCIsXG4gICAgICBcImZvbnQtdmFyaWFudFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJsZXR0ZXItc3BhY2luZ1wiLFxuICAgICAgXCJ0ZXh0LXRyYW5zZm9ybVwiLFxuICAgICAgXCJ3b3JkLXNwYWNpbmdcIixcbiAgICAgIFwiZm9udC1rZXJuaW5nXCIsXG4gICAgICBcImZvbnQtZmVhdHVyZS1zZXR0aW5nc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbnVtZXJpY1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbGlnYXR1cmVzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1jYXBzXCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgbGlzdEl0ZW06IHN0eWxlKGxpc3RJdGVtLCBbXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGNvZGVCbG9jazogc3R5bGUocHJlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICBibG9ja3F1b3RlOiBzdHlsZShxdW90ZSwgW1xuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwiYm9yZGVyLWxlZnQtd2lkdGhcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgIF0pLFxuICAgIGlubGluZUNvZGU6IHN0eWxlKGlubGluZUNvZGUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIHRhYmxlOiBzdHlsZSh0YWJsZSwgW1wiZm9udC1zaXplXCIsIFwibGluZS1oZWlnaHRcIiwgXCJ3aWR0aFwiLCBcImJvcmRlci1jb2xsYXBzZVwiXSksXG4gICAgaW1hZ2U6IHN0eWxlKGltZywgW1wiZGlzcGxheVwiLCBcIm1hcmdpbi1sZWZ0XCIsIFwibWFyZ2luLXJpZ2h0XCIsIFwibWF4LXdpZHRoXCIsIFwid2lkdGhcIl0pLFxuICAgIGhvcml6b250YWxSdWxlOiBzdHlsZShociwgW1wibWFyZ2luLXRvcFwiLCBcIm1hcmdpbi1ib3R0b21cIiwgXCJib3JkZXItdG9wLXdpZHRoXCIsIFwiaGVpZ2h0XCJdKSxcbiAgICBjc3NWYXJpYWJsZXM6IHtcbiAgICAgIFwiLS1mb250LXRleHRcIjogY3NzVmFyKFwiLS1mb250LXRleHRcIiksXG4gICAgICBcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCI6IGNzc1ZhcihcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCIpLFxuICAgICAgXCItLWgxLXNpemVcIjogY3NzVmFyKFwiLS1oMS1zaXplXCIpLFxuICAgICAgXCItLWgxLWxpbmUtaGVpZ2h0XCI6IGNzc1ZhcihcIi0taDEtbGluZS1oZWlnaHRcIiksXG4gICAgICBcIi0taDEtd2VpZ2h0XCI6IGNzc1ZhcihcIi0taDEtd2VpZ2h0XCIpLFxuICAgICAgXCItLWgxLXZhcmlhbnRcIjogY3NzVmFyKFwiLS1oMS12YXJpYW50XCIpLFxuICAgICAgXCItLWgxLWNvbG9yXCI6IGNzc1ZhcihcIi0taDEtY29sb3JcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLXRvcFwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi10b3BcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLWJvdHRvbVwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi1ib3R0b21cIiksXG4gICAgICBcIi0tcC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tcC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3Qtc3BhY2luZ1wiOiBjc3NWYXIoXCItLWxpc3Qtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LWluZGVudFwiOiBjc3NWYXIoXCItLWxpc3QtaW5kZW50XCIpLFxuICAgICAgXCItLWNvZGUtc2l6ZVwiOiBjc3NWYXIoXCItLWNvZGUtc2l6ZVwiKSxcbiAgICAgIFwiLS1jb2RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1jb2RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tY29kZS1yYWRpdXNcIjogY3NzVmFyKFwiLS1jb2RlLXJhZGl1c1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCIpLFxuICAgICAgXCItLWZpbGUtbWFyZ2luc1wiOiBjc3NWYXIoXCItLWZpbGUtbWFyZ2luc1wiKSxcbiAgICAgIFwiLS1maWxlLWxpbmUtd2lkdGhcIjogY3NzVmFyKFwiLS1maWxlLWxpbmUtd2lkdGhcIiksXG4gICAgICBcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiOiBjc3NWYXIoXCItLW5vcm1hbC1mb250LXNpemVcIiksXG4gICAgICBcIi0tZm9udC10ZXh0LXNpemVcIjogY3NzVmFyKFwiLS1mb250LXRleHQtc2l6ZVwiKSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gZHVtcDtcbn1cblxuLyoqXG4gKiBEZWJ1ZyB0eXBvZ3JhcGh5OiBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgKGVhY2hcbiAqIGNvdmVyaW5nIGEgZ3JvdXAgb2YgZWxlbWVudHMgXHUyMDE0IGFsbCB2aXNpYmxlIHdpdGhvdXQgc2Nyb2xsaW5nKSxcbiAqIHRoZW4gdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldyAobm8gdmlydHVhbGl6YXRpb25cbiAqIHRoZXJlKSwgbWVyZ2VzIGV2ZXJ5dGhpbmcsIGNvbXB1dGVzIHRoZSBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmRcbiAqIHdyaXRlcyBpdCB0byAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LlxuICogVGhlIHVzZXIncyBvd24gbm90ZSBpcyByZXN0b3JlZCBhdCB0aGUgZW5kLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHVtcFR5cG9ncmFwaHkocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYXBwID0gcGx1Z2luLmFwcDtcbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBubyBhY3RpdmUgTWFya2Rvd24gbm90ZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc3RhcnRNb2RlID0gdmlldy5nZXRNb2RlKCk7XG4gIGNvbnN0IGFjdGl2ZUZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgY29uc3QgbGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG5cbiAgLy8gRWRpdCBzaWRlOiBlYWNoIHNob3J0IG5vdGUga2VlcHMgZXZlcnkgdGFyZ2V0IGVsZW1lbnQgb24gc2NyZWVuXG4gIGNvbnN0IGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBTQU1QTEVfTk9URV9OQU1FUykge1xuICAgIGNvbnN0IGYgPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGB0ZXN0cy8ke25hbWV9Lm1kYCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg1MDApO1xuICAgIGNvbnN0IHMgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgICBpZiAocykgbWVyZ2VTYW1wbGUoZWRpdCwgcyk7XG4gIH1cblxuICAvLyBSZWFkaW5nIHNpZGU6IHRoZSBraXRjaGVuLXNpbmsgbm90ZSByZW5kZXJzIGV2ZXJ5dGhpbmcgYXQgb25jZVxuICBsZXQgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZGVtbyA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCJ0ZXN0cy90eXBvZ3JhcGh5LWRlbW8ubWRcIik7XG4gIGlmIChkZW1vIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGRlbW8sIHsgc3RhdGU6IHsgbW9kZTogXCJwcmV2aWV3XCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg4MDApO1xuICAgIHJlYWRpbmcgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgdGhlIHVzZXIncyBub3RlXG4gIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShhY3RpdmVGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IHN0YXJ0TW9kZSB9IH0pO1xuICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cbiAgaWYgKCFyZWFkaW5nKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IHJlYWRpbmcgc2FtcGxlIGZhaWxlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXlsb2FkID0geyBlZGl0LCByZWFkaW5nLCBkaWZmOiBkaWZmRHVtcHMoZWRpdCwgcmVhZGluZykgfTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci53cml0ZShcIi5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb25cIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMikpO1xuICAgIG5ldyBOb3RpY2UoXCJUeXBvZ3JhcGh5IGR1bXAgXHUyMTkyIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gKHZhdWx0IHJvb3QpXCIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCB3cml0ZSBkZWJ1ZyBmaWxlICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG5cbi8qKiBSZWdpc3RlciB0aGUgZGV2LW9ubHkgZGVidWcgY29tbWFuZCAoY2FsbGVkIG9ubHkgd2hlbiBERVZfTU9ERSBpcyB0cnVlKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtZGVidWctc3R5bGVzXCIsXG4gICAgbmFtZTogXCJEZWJ1ZzogZHVtcCB0eXBvZ3JhcGh5IHN0eWxlc1wiLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbiksXG4gIH0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTW9kZSBvZiB0aGUgYWN0aXZlIE1hcmtkb3duIHZpZXc6ICdwcmV2aWV3Jz1yZWFkaW5nICdzb3VyY2UnPWVkaXRpbmcgJyc9bm9uZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRNb2RlKGFwcDogQXBwKTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiIHwgXCJcIiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgcmV0dXJuIHZpZXcgPyB2aWV3LmdldE1vZGUoKSA6IFwiXCI7XG59XG5cbi8qKlxuICogVHJ1ZSB3aGVuIHRoZSBhY3RpdmUgZWRpdCB2aWV3IGlzIExpdmUgUHJldmlldyAoU2xpZGVzKSBcdTIwMTQgYXNcbiAqIG9wcG9zZWQgdG8gU291cmNlIG1vZGUuIE9ic2lkaWFuIHJlcG9ydHMgYm90aCBhcyBtb2RlIFwic291cmNlXCI7XG4gKiB0aGUgdmlldyBzdGF0ZSBjYXJyaWVzIGEgYHNvdXJjZWAgZmxhZyAoU291cmNlIG1vZGUgPSB0cnVlKSwgd2l0aFxuICogYSBET00gY2xhc3MgZmFsbGJhY2sgKC5pcy1saXZlLXByZXZpZXcpIGZvciBzYWZldHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xpdmVQcmV2aWV3KGFwcDogQXBwKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSBcInNvdXJjZVwiKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN0YXRlID0gdmlldy5nZXRTdGF0ZSgpIGFzIHsgc291cmNlPzogYm9vbGVhbiB9O1xuICBpZiAoc3RhdGUuc291cmNlID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IGZhbHNlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICEhdmlldy5jb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202LmlzLWxpdmUtcHJldmlld1wiKTtcbn1cblxuLyoqIEZyb250bWF0dGVyIG9mIGFueSBub3RlIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb250bWF0dGVyT2YoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIHJldHVybiBjYWNoZT8uZnJvbnRtYXR0ZXIgPz8gbnVsbDtcbn1cblxuLyoqIEN1cnJlbnQgbm90ZSdzIGZyb250bWF0dGVyIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2ZUZyb250bWF0dGVyKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgZmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICByZXR1cm4gZmlsZSA/IGZyb250bWF0dGVyT2YoYXBwLCBmaWxlKSA6IG51bGw7XG59XG4iLCAiLyoqIEEgYnVpbHQtaW4gU2xpZGVzIHN0eWxlIHRlbXBsYXRlIChyZW5kZXJlZCBhcyBib2R5IGNsYXNzIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gKSAqL1xuZXhwb3J0IGludGVyZmFjZSBTbGlkZXNUaGVtZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbi8qKiBCdWlsdC1pbiBzdHlsZSB0ZW1wbGF0ZXMgZm9yIHRoZSBTbGlkZXMgY2FyZCArIGJhciAoYWxsIHRoZW1lLWFkYXB0aXZlKSAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19USEVNRVM6IHJlYWRvbmx5IFNsaWRlc1RoZW1lW10gPSBbXG4gIHsgaWQ6IFwianl5XCIsIGxhYmVsOiBcIkxlY3R1cmUgKGp5eSlcIiB9LFxuICB7IGlkOiBcImRhc2hlZFwiLCBsYWJlbDogXCJEYXNoZWQgb3V0bGluZVwiIH0sXG4gIHsgaWQ6IFwicGFwZXJcIiwgbGFiZWw6IFwiUGFwZXIgY2FyZFwiIH0sXG4gIHsgaWQ6IFwibWluaW1hbFwiLCBsYWJlbDogXCJNaW5pbWFsXCIgfSxcbiAgeyBpZDogXCJhY2NlbnRcIiwgbGFiZWw6IFwiQWNjZW50IGVkZ2VcIiB9LFxuICB7IGlkOiBcImdsYXNzXCIsIGxhYmVsOiBcIkZyb3N0ZWQgZ2xhc3NcIiB9LFxuXTtcblxuLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB7XG4gIC8qKiBTaG93IFx1MjVDMCBcdTI1QjYgcHJldmlvdXMvbmV4dCBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dOYXZCdXR0b25zOiBib29sZWFuO1xuICAvKiogUGFnZSBudW1iZXIgZGlzcGxheSBzdHlsZTogXCJmcmFjdGlvblwiID0gTiAvIFRvdGFsLCBcImN1cnJlbnRcIiA9IE4sIFwibm9uZVwiID0gaGlkZGVuICovXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgLyoqIFNob3cgYSB0aGluIGNsaWNrYWJsZSBwcm9ncmVzcyBsaW5lIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd1Byb2dyZXNzOiBib29sZWFuO1xuICAvKiogU2hvdyB0aGUgZW50aXJlIHNsaWRlcyBiYXIgKG1hc3RlciB0b2dnbGUpICovXG4gIHNob3dTbGlkZXNCYXI6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIG1hbnVhbGx5IGhpZCB0aGUgc2xpZGVzIGJhciAodG9nZ2xlIGNvbW1hbmQpICovXG4gIGJhckhpZGRlbjogYm9vbGVhbjtcbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgd2hlbiBvcGVuaW5nIGEgZGVjayBub3RlIChkZWZhdWx0IG9mZikgKi9cbiAgYXV0b0VudGVyU2xpZGVzOiBib29sZWFuO1xuICAvKiogUHJlc3MgRXNjYXBlIHRvIGV4aXQgU2xpZGVzIG1vZGUgKGRlZmF1bHQgb24pICovXG4gIGVzY0V4aXRzU2xpZGVzOiBib29sZWFuO1xuICAvKiogRnJvbnRtYXR0ZXIgcHJvcGVydHkgc2hvd24gYXMgdGhlIGNhcmQgdGl0bGUgKFwiXCIgPSBub25lLCBcImZpbGVuYW1lXCIgPSBmaWxlIG5hbWUpICovXG4gIHNsaWRlc1RpdGxlOiBzdHJpbmc7XG4gIC8qKiBTdHlsZSB0ZW1wbGF0ZSBpZCBmcm9tIFNMSURFU19USEVNRVMgKGNhcmQgKyBiYXIgYXBwZWFyYW5jZSkgKi9cbiAgc2xpZGVzVGhlbWU6IHN0cmluZztcbiAgLyoqIENvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyBmb3IgdGhlIHNsaWRlcyBiYXIgKGVtcHR5ID0gbm9uZSkgKi9cbiAgYmFyUHJvcGVydGllczogc3RyaW5nO1xuICAvKiogSlNPTiBhcnJheSBvZiBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIGJhciBwcm9wZXJ0aWVzIChkcmFnZ2FibGUgZGl2aWRlcnMpICovXG4gIGJhclByb3BlcnR5V2lkdGhzOiBzdHJpbmc7XG4gIC8qKiBBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHBhbmVsIChkZWZhdWx0IG9uKSAqL1xuICBjb25maXJtRGVsZXRlU2xpZGVzOiBib29sZWFuO1xuICAvKipcbiAgICogQmxvY2sgaW1hZ2UgZW1iZWRzIGFzIGNlbnRlcmVkIGNhcmQgYmxvY2tzIChkZWZhdWx0IG9uKS4gV2hlbiBvZmYsXG4gICAqIGltYWdlcyBrZWVwIE9ic2lkaWFuJ3MgbmF0aXZlIGlubGluZSBmbG93IFx1MjAxNCB0ZXh0IGZsb3dzIGFyb3VuZC9iZXNpZGVcbiAgICogdGhlbSBleGFjdGx5IGxpa2UgTGl2ZSBQcmV2aWV3IG91dHNpZGUgU2xpZGVzIG1vZGUuXG4gICAqL1xuICBpbWFnZUxheW91dDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0ge1xuICBzaG93TmF2QnV0dG9uczogdHJ1ZSxcbiAgcGFnZU51bWJlclN0eWxlOiBcIm5vbmVcIixcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBzaG93U2xpZGVzQmFyOiB0cnVlLFxuICBiYXJIaWRkZW46IGZhbHNlLFxuICBhdXRvRW50ZXJTbGlkZXM6IGZhbHNlLFxuICBlc2NFeGl0c1NsaWRlczogdHJ1ZSxcbiAgc2xpZGVzVGl0bGU6IFwiXCIsXG4gIHNsaWRlc1RoZW1lOiBcImp5eVwiLFxuICBiYXJQcm9wZXJ0aWVzOiBcIlwiLFxuICBiYXJQcm9wZXJ0eVdpZHRoczogXCJcIixcbiAgY29uZmlybURlbGV0ZVNsaWRlczogdHJ1ZSxcbiAgaW1hZ2VMYXlvdXQ6IHRydWUsXG59O1xuXG4vKiogUmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5IGRyaXZpbmcgZGVjayBuYXZpZ2F0aW9uIChuZXZlciByZW5kZXJlZCBhcyBhIGNoaXApICovXG5leHBvcnQgY29uc3QgREVDS19LRVkgPSBcImRlY2tcIjtcbiIsICJpbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGNvcHlDYXBhY2l0eVByb21wdCB9IGZyb20gXCIuL2NhcGFjaXR5XCI7XG5pbXBvcnQgeyByZWdpc3RlckRlYnVnQ29tbWFuZCB9IGZyb20gXCIuL2RlYnVnXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBSZWdpc3RlciBldmVyeSBjb21tYW5kOyB0aGUgZGVidWcgY29tbWFuZCBpcyBkZXYtYnVpbGQgb25seS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbW1hbmRzKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIC8vIFRvZ2dsZSB0aGUgc2xpZGVzIGJhciBcdTIwMTQgb25seSBtZWFuaW5nZnVsIGluc2lkZSBTbGlkZXMgbW9kZSwgc28gYVxuICAvLyBjaGVja0NhbGxiYWNrIGtlZXBzIGl0IG91dCBvZiB0aGUgcGFsZXR0ZSBldmVyeXdoZXJlIGVsc2VcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1iYXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgYmFyXCIsXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB7XG4gICAgICAgIHBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW4gPSAhcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAgICAgdm9pZCBwbHVnaW4uc2F2ZVNldHRpbmdzKCkudGhlbigoKSA9PiBwbHVnaW4ucmVmcmVzaCgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBTaG93IHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtc2hvdy1wYW5lbFwiLFxuICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgcGFuZWxcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uYWN0aXZhdGVTbGlkZXNQYW5lbCgpLFxuICB9KTtcbiAgLy8gSGlkZSAvIHNob3cgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgKHByZXNlbnRpbmc7IFNsaWRlcyBtb2RlIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtcG9pbnRlclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIG1vdXNlIHBvaW50ZXJcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVBvaW50ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBQcmV2aW91cyAvIG5leHQgcGFnZSBcdTIwMTQgZGVjayBuYXZpZ2F0aW9uIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhc1xuICAvLyBuZWVkZWQpLiBjaGVja0NhbGxiYWNrIGtlZXBzIHRoZW0gb3V0IG9mIHRoZSBwYWxldHRlIG9uIG5vbi1kZWNrIG5vdGVzLFxuICAvLyB3aGVyZSB0aGV5IGhhdmUgbm90aGluZyB0byBmbGlwOyB0aGVpciBkZWZhdWx0IGhvdGtleXMgdGhlbiBubyBsb25nZXJcbiAgLy8gc2hhZG93IHRoZSBlZGl0b3IncyBzZWxlY3QtdG8tbGluZSBzaG9ydGN1dHMgb24gcGxhaW4gbm90ZXMgZWl0aGVyLlxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtcHJldlwiLFxuICAgIG5hbWU6IFwiUHJldmlvdXMgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd0xlZnRcIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4ubmF2aWdhdGUoXCJwcmV2XCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1uZXh0XCIsXG4gICAgbmFtZTogXCJOZXh0IHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dSaWdodFwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSB8fCAhcGx1Z2luLmRlY2tTZXJ2aWNlLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB2b2lkIHBsdWdpbi5uYXZpZ2F0ZShcIm5leHRcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5leHQgU2xpZGUgXHUyMDE0IG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBvbmUgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXh0XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV4dCBzbGlkZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJOXCIgfV0sXG4gICAgLy8gR3JleWVkIG91dCB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGlzIHBhcnQgb2YgYSBkZWNrIFx1MjAxNCBwbGFpbiBub3Rlc1xuICAgIC8vIHN0YXJ0IGRlY2tzIHdpdGggXCJDcmVhdGUgbmV3IHNsaWRlXCIgaW5zdGVhZC5cbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5ldyBTbGlkZSBcdTIwMTQgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuIEhpZGRlbiBvbiBkZWNrIG5vdGVzXG4gIC8vICh0aGUgZGVjayBncm93cyB2aWEgQ3JlYXRlIE5leHQgU2xpZGUgaW5zdGVhZCk7IHN0aWxsIHdvcmtzIGZyb20gYVxuICAvLyBibGFuayB0YWIgXHUyMDE0IGxhbmRzIGluIHRoZSBkZWZhdWx0IG5ldy1ub3RlIGxvY2F0aW9uLlxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5ld1wiLFxuICAgIG5hbWU6IFwiQ3JlYXRlIG5ldyBzbGlkZVwiLFxuICAgIC8vIE5vIGRlZmF1bHQgaG90a2V5OiBNb2QrU2hpZnQrTiBiZWxvbmdzIHRvIENyZWF0ZSBuZXh0IHNsaWRlIFx1MjAxNCB0d29cbiAgICAvLyBjb21tYW5kcyBzaGFyaW5nIG9uZSBkZWZhdWx0IGhvdGtleSB0cmlwcyBPYnNpZGlhbidzIGNvbmZsaWN0IFVJLlxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmIChmaWxlICYmIHBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5ldyhwbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5ldygpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBJbml0aWFsaXplIHNsaWRlcyB3aXRoIHRoaXMgbm90ZSBcdTIwMTQgcHJvbW90ZSB0aGUgYWN0aXZlIChwbGFpbikgbm90ZSBpbnRvXG4gIC8vIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGl0IGdhaW5zIGBkZWNrOiBbXWAgYW5kIGtlZXBzIGl0c1xuICAvLyBjb250ZW50LCB0aXRsZSBhbmQgbG9jYXRpb24sIHRoZW4gU2xpZGVzIG1vZGUgYXV0by1lbnRlcnMuIGNoZWNrQ2FsbGJhY2tcbiAgLy8gc2hvd3MgaXQgb25seSBvbiBub3RlcyB0aGF0IGFyZSBOT1QgYWxyZWFkeSBwYXJ0IG9mIGEgZGVjaywgc28gaXQgbmV2ZXJcbiAgLy8gYXBwZWFycyBvbiBkZWNrL3NsaWRlcyBub3RlcyB3aGVyZSBpdCB3b3VsZCBiZSBtaXNsZWFkaW5nLiBDb252ZXJzaW9uIGlzXG4gIC8vIGEgc2luZ2xlIGZyb250bWF0dGVyIHdyaXRlIChubyBjb25maXJtYXRpb24gZGlhbG9nKS5cbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLW1ha2UtZmlyc3Qtc2xpZGVcIixcbiAgICBuYW1lOiBcIkluaXRpYWxpemUgc2xpZGVzIHdpdGggdGhpcyBub3RlXCIsXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlIHx8IHBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udmVydGVkID0gYXdhaXQgcGx1Z2luLmRlY2tTZXJ2aWNlLm1ha2VGaXJzdFNsaWRlKGZpbGUpO1xuICAgICAgICAgIGlmICghY29udmVydGVkKSByZXR1cm47IC8vIGRlZmVuc2l2ZSBcdTIwMTQgdGhlIGNoZWNrIGFib3ZlIGFscmVhZHkgcGFzc2VkXG4gICAgICAgICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IG1hZGUgdGhpcyBub3RlIHRoZSBmaXJzdCBzbGlkZSBvZiBhIG5ldyBkZWNrXCIpO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5lbnRlclNsaWRlc0ZvckFjdGl2ZSgpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIENvcHkgYSBvbmUtc2NyZWVuIGNhcGFjaXR5IHJlcG9ydCBvZiB0aGUgY3VycmVudCBTbGlkZXMgbGF5b3V0XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jb3B5LXNsaWRlLXNraWxsXCIsXG4gICAgbmFtZTogXCJDb3B5IEFJIGFnZW50IHByb21wdFwiLFxuICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBjaGVja0NhbGxiYWNrIGlzIG5vdCB1c2VkOiBpdCB3b3VsZCBoaWRlIHRoZSBjb21tYW5kIGZyb20gdGhlXG4gICAgICAvLyBjb21tYW5kIHBhbGV0dGUgb3V0c2lkZSBTbGlkZXMgbW9kZSAocGFsZXR0ZSBvbmx5IHNob3dzIGNvbW1hbmRzXG4gICAgICAvLyB3aG9zZSBjaGVja0NhbGxiYWNrIHJldHVybnMgdHJ1ZSkuIEtlZXAgdGhlIGNvbW1hbmQgYWx3YXlzIHZpc2libGVcbiAgICAgIC8vIGFuZCBleHBsYWluIHRoZSByZXF1aXJlZCBtb2RlIHdoZW4gaW52b2tlZCB0b28gZWFybHkuXG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhd2FpdCBjb3B5Q2FwYWNpdHlQcm9tcHQocGx1Z2luLmFwcCk7XG4gICAgfSxcbiAgfSk7XG4gIC8vIFRvZ2dsZSBTbGlkZXMgbW9kZSBcdTIwMTQgdGhlIGltbWVyc2l2ZSBjYXJkIHZpZXcgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1zbGlkZXNcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgbW9kZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJFXCIgfV0sXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YocGx1Z2luLmFwcCwgZmlsZSk7XG4gICAgICBpZiAoZm0gPT09IG51bGwgfHwgIShERUNLX0tFWSBpbiBmbSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVTbGlkZXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBEZWJ1ZyB0b29saW5nIFx1MjAxNCByZWdpc3RlcmVkIG9ubHkgaW4gZGV2IGJ1aWxkcyAodHJlZS1zaGFrZW4gaW4gcmVsZWFzZSlcbiAgaWYgKERFVl9NT0RFKSByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW4pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtcbiAgcGxhbkNyZWF0ZU5ldyBhcyBwbGFuTmV3LFxuICBwbGFuQ3JlYXRlTmV4dCBhcyBwbGFuLFxuICBwbGFuTWFrZUZpcnN0U2xpZGUgYXMgcGxhbkZpcnN0LFxuICB0eXBlIENyZWF0ZU5leHRSZXN1bHQsXG59IGZyb20gXCIuL2NyZWF0ZU5leHRcIjtcbmltcG9ydCB7IGNvbXB1dGVEZWNrLCBleHRyYWN0TGlua3MsIGV4dHJhY3RSYXdMaW5rcywgdHlwZSBEZWNrSW5mbyB9IGZyb20gXCIuL2RlY2tcIjtcbmltcG9ydCB7IHBpY2tMYW5kaW5nUGF0aCwgcGxhbkRlbGV0ZVNsaWRlcyB9IGZyb20gXCIuL2RlbGV0ZVNsaWRlc1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB0eXBlIHsgUmVvcmRlclBsYW4gfSBmcm9tIFwiLi9yZW9yZGVyXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZXN1bHQgb2YgYSBEZWxldGUgc2xpZGVzIHJ1biAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVTbGlkZXNSZXN1bHQge1xuICAvKiogUGF0aHMgYWN0dWFsbHkgbW92ZWQgdG8gdGhlIHRyYXNoICovXG4gIHRyYXNoZWQ6IHN0cmluZ1tdO1xuICAvKiogV2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlcndhcmRzIChudWxsID0ga2VlcCBjdXJyZW50IG5vdGUpICovXG4gIGxhbmRpbmdQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjazogaXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW5cbiAgICogZW1wdHkgXHUyMDE0IGEgZnJlc2ggc2luZ2xlIHNsaWRlKSBvciBzb21lIG90aGVyIHNsaWRlIGRlY2xhcmVzIGl0IGFzIGl0c1xuICAgKiBuZXh0IHNsaWRlLlxuICAgKi9cbiAgaXNNZW1iZXIoZmlsZTogVEZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiAoZm0gIT09IG51bGwgJiYgREVDS19LRVkgaW4gZm0pIHx8IHRoaXMucHJldk9mKGZpbGUucGF0aCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBjdXJyZW50IG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2sgKG51bGwgd2hlbiBub3QgYSBtZW1iZXIpICovXG4gIGNvbXB1dGUoZmlsZTogVEZpbGUpOiBEZWNrSW5mbyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc01lbWJlcihmaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGNvbXB1dGVEZWNrKFxuICAgICAgZmlsZS5wYXRoLFxuICAgICAgKHBhdGgpID0+IHRoaXMubGlua1BhdGhzKHBhdGgpLFxuICAgICAgKHBhdGgpID0+IHRoaXMucHJldk9mKHBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogUmVzb2x2ZWQgbmV4dC1zbGlkZSBwYXRocyBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKFtdIHdoZW4gbm9uZSwgb3IgdGhlIGxpbmsgaXMgYnJva2VuKSAqL1xuICBuZXh0TGlua3MocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmxpbmtQYXRocyhwYXRoKTtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgYSBub3RlIGludG8gcmVhbCBub3RlIHBhdGhzIChtYXggb25lKSAqL1xuICBwcml2YXRlIGxpbmtQYXRocyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gW107XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXNcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KTogeCBpcyBURmlsZSA9PiAhIXgpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh0aGUgcHJldmlvdXMgc2xpZGUgaW5cbiAgICogdGhlIGNoYWluKS4gV2l0aCBuZXh0LW9ubHkgc2VtYW50aWNzIHRoaXMgYmFja3dhcmQgbG9va3VwIGlzIHRoZSBvbmx5XG4gICAqIHdheSB0byByZWFjaCB0aGUgY2hhaW4gaGVhZCBmcm9tIGEgbWlkZGxlL2xhc3Qgc2xpZGUuXG4gICAqL1xuICBwcml2YXRlIHByZXZPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLnBhdGggPT09IHBhdGgpIGNvbnRpbnVlO1xuICAgICAgaWYgKHRoaXMubGlua1BhdGhzKGYucGF0aClbMF0gPT09IHBhdGgpIHJldHVybiBmLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogTmFtZXMgaW4gdGhlIGBkZWNrYCBwcm9wZXJ0eSB0aGF0IHJlc29sdmUgdG8gbm8gbm90ZSAoYnJva2VuIGxpbmtzKSAqL1xuICBicm9rZW4oZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBmaWxlLnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIHJ1biBmb3IgdGhlIGFjdGl2ZSBub3RlLiBEZWNrIHNsaWRlc1xuICAgKiBpbnNlcnQvYXBwZW5kIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuIChQbGFpbiBub3RlcyBhcmUgcm91dGVkIHRvXG4gICAqIHBsYW5DcmVhdGVOZXcgYnkgdGhlIGNvbW1hbmQgXHUyMDE0IHRoaXMgY29yZSBzdGlsbCBoYW5kbGVzIHRoZW0gYXNcbiAgICogXCJubyB1c2FibGUgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmRcIi4pXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV4dChmaWxlOiBURmlsZSk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IHJhdyA9IGZtID8gZXh0cmFjdFJhd0xpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICBjb25zdCBleGlzdGluZ05hbWVzID0gbmV3IFNldCh0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkubWFwKChmKSA9PiBmLmJhc2VuYW1lKSk7XG4gICAgcmV0dXJuIHBsYW4oeyBjdXJyZW50TmFtZTogZmlsZS5iYXNlbmFtZSwgY3VycmVudExpbmtzOiByYXcsIGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHJ1bjogYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgaW4gdGhlXG4gICAqIHNhbWUgZm9sZGVyIGFzIHRoZSBhY3RpdmUgbm90ZSwgd2hpY2ggaXRzZWxmIHN0YXlzIHVudG91Y2hlZC5cbiAgICovXG4gIHBsYW5DcmVhdGVOZXcoKTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuTmV3KHsgZXhpc3RpbmdOYW1lcyB9KTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIENyZWF0ZSBOZXh0IFNsaWRlIHBsYW47IG9wZW49ZmFsc2Uga2VlcHMgdGhlIGN1cnJlbnQgbm90ZSBpbiB0aGUgZWRpdG9yICovXG4gIGFzeW5jIGV4ZWN1dGVDcmVhdGVOZXh0KGZpbGU6IFRGaWxlLCBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LCBvcGVuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKGZpbGUsIHBsYW4sIGRpclByZWZpeChmaWxlLnBhcmVudD8ucGF0aCksIG9wZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgQ3JlYXRlIE5ldyBTbGlkZSBwbGFuLiBMYW5kcyBpbiBPYnNpZGlhbidzIGRlZmF1bHQgbmV3LW5vdGVcbiAgICogbG9jYXRpb24gKFNldHRpbmdzIFx1MjE5MiBGaWxlcyAmIGxpbmtzIFx1MjE5MiBEZWZhdWx0IGxvY2F0aW9uIGZvciBuZXcgbm90ZXMpO1xuICAgKiB3aXRoIFwic2FtZSBmb2xkZXIgYXMgY3VycmVudFwiIGNvbmZpZ3VyZWQgdGhhdCBpcyB0aGUgYWN0aXZlIG5vdGUncyBvd25cbiAgICogZm9sZGVyLiBXb3JrcyB3aXRoIG5vIG5vdGUgb3BlbiBhdCBhbGwgKGJsYW5rIHRhYikuXG4gICAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV3KHBsYW46IENyZWF0ZU5leHRSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBcIlwiO1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKFxuICAgICAgbnVsbCxcbiAgICAgIHBsYW4sXG4gICAgICBkaXJQcmVmaXgodGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChzb3VyY2VQYXRoKT8ucGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9tb3RlIHRoZSBhY3RpdmUgbm90ZSBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGFkZCBgZGVjazogW11gXG4gICAqIHRvIGl0cyBmcm9udG1hdHRlciBcdTIwMTQgY29udGVudCwgdGl0bGUsIGxvY2F0aW9uIGFuZCBldmVyeSBvdGhlciBwcm9wZXJ0eVxuICAgKiBzdGF5IHVudG91Y2hlZC4gTm90ZXMgdGhhdCBhbHJlYWR5IGJlbG9uZyB0byBhIGRlY2sgYXJlIGxlZnQgYWxvbmUuXG4gICAqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBub3RlIHdhcyBjb252ZXJ0ZWQgKHRoZSBjYWxsZXIgbWF5IHRoZW4gYXV0by1lbnRlclxuICAgKiBTbGlkZXMgbW9kZSksIGZhbHNlIHdoZW4gaXQgd2FzIGFscmVhZHkgYSBkZWNrIG1lbWJlci5cbiAgICovXG4gIGFzeW5jIG1ha2VGaXJzdFNsaWRlKGZpbGU6IFRGaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKHBsYW5GaXJzdCh7IGFscmVhZHlEZWNrOiB0aGlzLmlzTWVtYmVyKGZpbGUpIH0pID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgIGZtW0RFQ0tfS0VZXSA9IFtdO1xuICAgIH0pO1xuICAgIC8vIE9ic2lkaWFuIGluZGV4ZXMgYSBzYXZlZCBmaWxlIGFzeW5jaHJvbm91c2x5OyB0aGUgY29tbWFuZCdzIGF1dG8tZW50ZXJcbiAgICAvLyByZWFkcyB0aGUgY2FjaGUsIHNvIGhhbmQgYmFjayBvbmx5IG9uY2UgdGhlIG5ldyBgZGVja2AgaXMgdmlzaWJsZS5cbiAgICBhd2FpdCB0aGlzLndhaXRGb3JDYWNoZWREZWNrKGZpbGUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXQgdW50aWwgdGhlIG1ldGFkYXRhIGNhY2hlIHJlZmxlY3RzIHRoZSBub3RlJ3MgYGRlY2tgIHByb3BlcnR5XG4gICAqIChiZXN0IGVmZm9ydCBcdTIwMTQgcmVzb2x2ZXMgb24gdGhlIHByb3BlcnR5IGFwcGVhcmluZywgb3IgYWZ0ZXIgYHRpbWVvdXRNc2ApLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyB3YWl0Rm9yQ2FjaGVkRGVjayhmaWxlOiBURmlsZSwgdGltZW91dE1zID0gMjAwMCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmhhc0RlY2tJbkNhY2hlKGZpbGUpKSByZXR1cm47XG4gICAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChjaGFuZ2VkOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlZC5wYXRoID09PSBmaWxlLnBhdGggJiYgdGhpcy5oYXNEZWNrSW5DYWNoZShmaWxlKSkge1xuICAgICAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub2ZmcmVmKHJlZik7XG4gICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9mZnJlZihyZWYpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCB0aW1lb3V0TXMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1ldGFkYXRhIGNhY2hlIGFscmVhZHkgc2hvd3MgYSBgZGVja2AgcHJvcGVydHkgb24gdGhlIG5vdGUgKi9cbiAgcHJpdmF0ZSBoYXNEZWNrSW5DYWNoZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIEFwcGx5IGEgcGxhbjogY3JlYXRlIHRoZSBub3RlLCByZXdpcmUgYGRlY2tgIHByb3BlcnRpZXMsIG9wdGlvbmFsbHkgb3BlbiBpdCAqL1xuICBwcml2YXRlIGFzeW5jIGFwcGx5UGxhbihcbiAgICBmaWxlOiBURmlsZSB8IG51bGwsXG4gICAgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCxcbiAgICBkaXI6IHN0cmluZyxcbiAgICBvcGVuID0gdHJ1ZSxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGAke2Rpcn0ke3BsYW4ubmV3TmFtZX0ubWRgO1xuICAgIGNvbnN0IGZyb250bWF0dGVyID0gcGxhbi5uZXdEZWNrTGlua3MubWFwKChsaW5rKSA9PiBKU09OLnN0cmluZ2lmeShsaW5rKSkuam9pbihcIiwgXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgLS0tXFxuZGVjazogWyR7ZnJvbnRtYXR0ZXJ9XVxcbi0tLVxcbmA7XG5cbiAgICBsZXQgbmV3RmlsZTogVEZpbGU7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUobmV3UGF0aCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBjcmVhdGUgXCIke3BsYW4ubmV3TmFtZX0ubWRcIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXdpcmUgdGhlIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCAoa2VlcHMgYWxsIG90aGVyIHByb3BlcnRpZXMgaW50YWN0KVxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiBwbGFuLnJld3JpdGVzKSB7XG4gICAgICBpZiAoIWZpbGUgfHwgcmV3cml0ZS5uYW1lICE9PSBmaWxlLmJhc2VuYW1lKSBjb250aW51ZTsgLy8gaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGVcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IHJld3JpdGUuZGVjaztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghb3BlbikgcmV0dXJuO1xuXG4gICAgLy8gT3BlbiB0aGUgbmV3IG5vdGUgaW4gdGhlIGN1cnJlbnQgcGFuZSwgZWRpdCBtb2RlIChMaXZlIFByZXZpZXcpXG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5ld0ZpbGUsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgcmVvcmRlciBwbGFuOiByZXdyaXRlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgZXZlcnkgc2xpZGUgd2hvc2VcbiAgICogbmV4dCBsaW5rIGNoYW5nZWQsIGluIG5ldyBjaGFpbiBvcmRlciwgYXMgYmFyZSBgW1tiYXNlbmFtZV1dYCBsaW5rcyAodGhlXG4gICAqIGZvcm0gY3JlYXRlTmV4dCBhbmQgZGVsZXRlU2xpZGVzIHdyaXRlKS4gT25seSB0aGUgbm90ZXMgdGhlIHBsYW4gbmFtZXMgYXJlXG4gICAqIHRvdWNoZWQgXHUyMDE0IHRoZSByZXN0IG9mIHRoZSBkZWNrIGtlZXBzIGl0cyBmcm9udG1hdHRlciB1bnRvdWNoZWQuXG4gICAqXG4gICAqIFN0b3BzIGF0IHRoZSBmaXJzdCBmYWlsZWQgd3JpdGUgYW5kIHJldHVybnMgZmFsc2U6IHRoZSByZW1haW5pbmcgbm90ZXNcbiAgICoga2VlcCB0aGVpciBvbGQgbGlua3MsIHdoaWNoIHRoZSBjYWxsZXIgc2hvd3MgYnkgcmUtcmVuZGVyaW5nIGZyb20gdGhlIGxpdmVcbiAgICogY2hhaW4uIFJldHVybnMgdHJ1ZSB3aGVuIGV2ZXJ5IHJld3JpdGUgd2FzIGFwcGxpZWQuXG4gICAqL1xuICBhc3luYyBleGVjdXRlUmVvcmRlcihwbGFuOiBSZW9yZGVyUGxhbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiBwbGFuLnJld3JpdGVzKSB7XG4gICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUucGF0aCk7XG4gICAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCByZW9yZGVyIHNsaWRlcyBcdTIwMTQgXCIke3Jld3JpdGUucGF0aH1cIiBpcyBnb25lYCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5leHQgPSByZXdyaXRlLm5leHRQYXRoID8gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUubmV4dFBhdGgpIDogbnVsbDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgICAgZm1bREVDS19LRVldID0gbmV4dCBpbnN0YW5jZW9mIFRGaWxlID8gW2BbWyR7bmV4dC5iYXNlbmFtZX1dXWBdIDogW107XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICBgTmF0aXZlIHNsaWRlczogY291bGQgbm90IHJlb3JkZXIgc2xpZGVzIFx1MjAxNCB3cml0aW5nIFwiJHtmaWxlLmJhc2VuYW1lfVwiIGZhaWxlZCAoJHtTdHJpbmcoZXJyb3IpfSlgLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzbGlkZXMgb3V0IG9mIGFuIG9yZGVyZWQgZGVjayBjaGFpbjogc3BsaWNlIHRoZSBjaGFpbiBhcm91bmRcbiAgICogZXZlcnkgZGVsZXRlZCBydW4gKHRoZSBwcmVkZWNlc3NvcidzIGBkZWNrYCB0YWtlcyBvdmVyIHRoZSBydW4ncyBmaXJzdFxuICAgKiBzdXJ2aXZvciksIHRoZW4gbW92ZSBlYWNoIGRlbGV0ZWQgbm90ZSB0byB0aGUgdHJhc2guIGBmb2N1c1BhdGhgIGlzIHRoZVxuICAgKiBub3RlIHRoZSBlZGl0b3IgY3VycmVudGx5IHNob3dzIFx1MjAxNCB3aGVuIGl0IGlzIGFtb25nIHRoZSBkZWxldGVkLCB0aGVcbiAgICogcmVzdWx0IG5hbWVzIHRoZSBuZWFyZXN0IHN1cnZpdmluZyBuZWlnaGJvdXIgdG8gb3BlbiBpbnN0ZWFkLlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICBjaGFpbjogc3RyaW5nW10sXG4gICAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gICAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuICApOiBQcm9taXNlPERlbGV0ZVNsaWRlc1Jlc3VsdD4ge1xuICAgIGNvbnN0IHJld3JpdGVzID0gcGxhbkRlbGV0ZVNsaWRlcyhjaGFpbiwgZGVsZXRlUGF0aHMpO1xuXG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHJld3JpdGVzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUucGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG5leHQgPSByZXdyaXRlLm5leHRQYXRoID8gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUubmV4dFBhdGgpIDogbnVsbDtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IG5leHQgaW5zdGFuY2VvZiBURmlsZSA/IFtgW1ske25leHQuYmFzZW5hbWV9XV1gXSA6IFtdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhc2hlZDogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgZGVsZXRlUGF0aHMpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnRyYXNoRmlsZShmKTtcbiAgICAgICAgdHJhc2hlZC5wdXNoKHBhdGgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IGRlbGV0ZSBcIiR7Zi5iYXNlbmFtZX1cIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0cmFzaGVkLCBsYW5kaW5nUGF0aDogcGlja0xhbmRpbmdQYXRoKGNoYWluLCBkZWxldGVQYXRocywgZm9jdXNQYXRoKSB9O1xuICB9XG59XG5cbi8qKiBGb2xkZXIgcGF0aCBcdTIxOTIgdHJhaWxpbmctc2xhc2ggcHJlZml4IChcIlwiIGZvciB2YXVsdCByb290KSAqL1xuZnVuY3Rpb24gZGlyUHJlZml4KHBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghcGF0aCB8fCBwYXRoID09PSBcIi9cIikgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBgJHtwYXRoLnJlcGxhY2UoL1xcLyskLywgXCJcIil9L2A7XG59XG4iLCAiLyoqXG4gKiBkZWNrLnRzIFx1MjAxNCBQdXJlIGRlY2stcmVzb2x1dGlvbiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9kZWNrLnRlc3QudHMpLiBtYWluLnRzIGFkYXB0cyB0aGVcbiAqIHZhdWx0IChtZXRhZGF0YUNhY2hlKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlOiBpdCByZXNvbHZlcyBgZGVja2BcbiAqIHByb3BlcnRpZXMgdG8gbm90ZSBwYXRocywgdGhlbiBoYW5kcyB0aGUgcGF0aCBncmFwaCB0byBjb21wdXRlRGVjaygpLlxuICovXG5cbi8qKiBBIGRlY2sgbGluayBsaXN0IGhvbGRzIGF0IG1vc3Qgb25lIGVudHJ5ICh0aGUgbmV4dCBzbGlkZSkgKi9cbmV4cG9ydCBjb25zdCBNQVhfREVDS19MSU5LUyA9IDE7XG5cbi8qKiBSZXN1bHQgb2YgcmVzb2x2aW5nIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBhIGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja0luZm8ge1xuICAvKiogQ2hhaW4gb2Ygbm90ZSBwYXRoczogWzBdIGlzIHRoZSBmaXJzdCBzbGlkZSwgdGhlbiB0aGUgcmVzdCBpbiBvcmRlciAqL1xuICBjaGFpbjogc3RyaW5nW107XG4gIC8qKiBJbmRleCBvZiB0aGUgY3VycmVudCBub3RlIGluc2lkZSBjaGFpbiAqL1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6XG4gKiAgIC0gYSBzbGlkZSdzIGBkZWNrYCBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rOiB0aGUgbmV4dCBzbGlkZVxuICogICAgICh0aGUgbGFzdCBzbGlkZSBoYXMgbm8gbGluayBhdCBhbGwpO1xuICogICAtIGEgZGVjayBpcyBzaW1wbHkgYSBmb3J3YXJkIGxpbmsgY2hhaW4gc3RhcnRpbmcgYXQgaXRzIGhlYWQgc2xpZGU7XG4gKiAgIC0gYW55IG5vdGUgdGhhdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlbiBlbXB0eSkgaXMgYSBkZWNrIG1lbWJlcixcbiAqICAgICBzbyBhIHNpbmdsZSBmcmVzaGx5IGNyZWF0ZWQgc2xpZGUgYWxyZWFkeSBjb3VudHMgYXMgYSBvbmUtcGFnZSBkZWNrLlxuICpcbiAqIEJlY2F1c2Ugc2xpZGVzIG5vIGxvbmdlciBsaW5rIGJhY2sgdG8gYSBoZWFkIG5vdGUsIHRoZSBjaGFpbiBoZWFkIGlzXG4gKiBsb2NhdGVkIGJ5IHdhbGtpbmcgYmFja3dhcmQ6IGBnZXRQcmV2KHBhdGgpYCByZXR1cm5zIHRoZSBub3RlIHdob3NlXG4gKiBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodW5kZWZpbmVkIHdoZW4gbm9uZSkuXG4gKlxuICogYGdldExpbmtzKHBhdGgpYCBtdXN0IHJldHVybiB0aGUgcmVzb2x2ZWQgbm90ZSBwYXRocyBvZiB0aGUgYGRlY2tgXG4gKiBwcm9wZXJ0eSBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKGVtcHR5IHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUsIG9yIGl0c1xuICogbGluayBpcyBicm9rZW4gXHUyMDE0IGEgYnJva2VuIGxpbmsgc2ltcGx5IGVuZHMgdGhlIGNoYWluLCBuZXZlciBjcmFzaGVzKS5cbiAqXG4gKiBSZXR1cm5zIHRoZSBmdWxsIGNoYWluIGFuZCB0aGUgY3VycmVudCBub3RlJ3MgaW5kZXgsIG9yIG51bGwgd2hlbiB0aGVcbiAqIG5vdGUgaXMgbm90IHBhcnQgb2YgYW55IGRlY2sgKG5vIGBkZWNrYCBwcm9wZXJ0eSBhbmQgbm9ib2R5IGxpbmtzIHRvIGl0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVEZWNrKFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuICBnZXRMaW5rczogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW10sXG4gIGdldFByZXY6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIC8vIFdhbGsgYmFja3dhcmQgdG8gdGhlIGNoYWluIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLiBBIGxvbmUgbm9kZSAobm8gb3duXG4gIC8vIGxpbmssIG5vIHByZWRlY2Vzc29yKSByZXNvbHZlcyBhcyBhIG9uZS1wYWdlIGNoYWluIFx1MjAxNCB3aGV0aGVyIGl0IGNvdW50c1xuICAvLyBhcyBhIGRlY2sgbWVtYmVyIGF0IGFsbCBpcyBkZWNpZGVkIGJ5IHRoZSBhZGFwdGVyICh0aGUgYGRlY2tgIGtleSkuXG4gIGNvbnN0IGJhY2tWaXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KFtjdXJyZW50UGF0aF0pO1xuICBsZXQgaGVhZCA9IGN1cnJlbnRQYXRoO1xuICBmb3IgKDs7KSB7XG4gICAgY29uc3QgcHJldiA9IGdldFByZXYoaGVhZCk7XG4gICAgaWYgKCFwcmV2IHx8IGJhY2tWaXNpdGVkLmhhcyhwcmV2KSkgYnJlYWs7XG4gICAgYmFja1Zpc2l0ZWQuYWRkKHByZXYpO1xuICAgIGhlYWQgPSBwcmV2O1xuICB9XG5cbiAgLy8gV2FsayBmb3J3YXJkIGZyb20gdGhlIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgY3VyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBoZWFkO1xuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyKTtcbiAgICBjaGFpbi5wdXNoKGN1cik7XG4gICAgY3VyID0gZ2V0TGlua3MoY3VyKVswXTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBXYWxrIHRoZSBjaGFpbiBmb3J3YXJkIGZyb20gYSBrbm93biBoZWFkIGFuZCBsb2NhdGUgYGN1cnJlbnRQYXRoYCBpbiBpdC5cbiAqXG4gKiBgY29tcHV0ZURlY2soKWAgZmluZHMgdGhlIGhlYWQgaXRzZWxmLCB3aGljaCBpcyBhbWJpZ3VvdXMgd2hlbiBzZXZlcmFsIHNsaWRlc1xuICogZGVjbGFyZSB0aGUgc2FtZSBuZXh0IHNsaWRlOyB0YWtpbmcgdGhlIGhlYWQgYXMgZ2l2ZW4gaXMgd2hhdCBsZXRzIGFcbiAqIG5hdmlnYXRpb24gc2Vzc2lvbiBrZWVwIHRoZSBjaGFpbiBpdCBlbnRlcmVkLiBUaGUgd2FsayBpcyBhbHdheXMgbGl2ZSBcdTIwMTQgdGhlXG4gKiBsaW5rcyBjb21lIGZyb20gdGhlIHZhdWx0IG9uIGV2ZXJ5IGNhbGwgXHUyMDE0IHNvIHNsaWRlcyBjcmVhdGVkLCBkZWxldGVkIG9yXG4gKiByZW5hbWVkIG1lYW53aGlsZSBhcmUgcmVmbGVjdGVkLCBhbmQgYSBoZWFkIHRoYXQgbm8gbG9uZ2VyIHJlYWNoZXNcbiAqIGBjdXJyZW50UGF0aGAgc2ltcGx5IHlpZWxkcyBudWxsICh0aGUgY2FsbGVyIGZhbGxzIGJhY2sgdG8gYGNvbXB1dGVEZWNrKClgKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY2tGcm9tSGVhZChcbiAgaGVhZDogc3RyaW5nLFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuICBnZXRMaW5rczogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW10sXG4pOiBEZWNrSW5mbyB8IG51bGwge1xuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgY3VyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBoZWFkO1xuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyKTtcbiAgICBjaGFpbi5wdXNoKGN1cik7XG4gICAgY3VyID0gZ2V0TGlua3MoY3VyKVswXTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIG5vdGUgbmFtZXMgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEFjY2VwdHMgYSBzaW5nbGUgc3RyaW5nIG9yIGEgWUFNTCBsaXN0IG9mIHN0cmluZ3M7IHVucXVvdGVkIFtbeF1dIHZhbHVlc1xuICogYXJlIHBhcnNlZCBieSBZQU1MIGFzIG5lc3RlZCBhcnJheXMgYW5kIGZsYXR0ZW5lZCBoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgY29uc3QgbmFtZSA9IGV4dHJhY3RMaW5rVGV4dChpdGVtKTtcbiAgICBpZiAobmFtZSkgb3V0LnB1c2gobmFtZSk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgcmF3IGxpbmsgc3RyaW5ncyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlIFx1MjAxNCB0aGVcbiAqIHRyaW1tZWQgdmFsdWVzIGV4YWN0bHkgYXMgd3JpdHRlbiAoYWxpYXMgLyBwYXRoIGZvcm1zIHByZXNlcnZlZCkuIFNhbWVcbiAqIGZsYXR0ZW5pbmcgcnVsZXMgYXMgZXh0cmFjdExpbmtzKCksIGJ1dCB3aXRob3V0IGV4dHJhY3RpbmcgdGhlIHRhcmdldCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFJhd0xpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSBcInN0cmluZ1wiKSBjb250aW51ZTtcbiAgICBjb25zdCB0cmltbWVkID0gaXRlbS50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh0cmltbWVkKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgdGFyZ2V0IG5vdGUgbmFtZSBmcm9tIGEgbWFya2Rvd24gbGluayBzdHJpbmcuXG4gKiBIYW5kbGVzIHNldmVyYWwgc2hhcGVzOlxuICogICBcIltbc2xpZGUtMl1dXCIgICAgICAgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yfGFsaWFzXV1cIiAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTIjc2VjdGlvbl1dXCJcdTIxOTIgc2xpZGUtMlxuICogICBzbGlkZS0yICAgICAgICAgICAgICBcdTIxOTIgc2xpZGUtMiAoYmFyZSBmaWxlbmFtZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rVGV4dCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHRyaW1tZWQucmVwbGFjZSgvXlxcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0uc3BsaXQoXCIjXCIpWzBdLnRyaW0oKTtcbn1cblxuLyoqIFJlbmRlciBhIHByb3BlcnR5IHZhbHVlIGFzIHJlYWRhYmxlIHRleHQ6IGFycmF5cy9vYmplY3RzIFx1MjE5MiBKU09OLCBlbHNlIFN0cmluZyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBcIlx1MjAxNFwiO1xuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpID8/IFwiXHUyMDE0XCI7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gY2lyY3VsYXIgLyB1bi1zdHJpbmdpZmlhYmxlIHN0cnVjdHVyZSBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgICAgcmV0dXJuIFwiXHUyMDE0XCI7XG4gICAgICB9XG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIHN5bWJvbCAvIGZ1bmN0aW9uIFx1MjAxNCBub3QgZXhwZWN0ZWQgZnJvbSBmcm9udG1hdHRlclxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogY3JlYXRlTmV4dC50cyBcdTIwMTQgUHVyZSBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgLyBcIkNyZWF0ZSBOZXcgU2xpZGVcIiBwbGFubmluZ1xuICogY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvY3JlYXRlTmV4dC50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHNcbiAqIHRoZSB2YXVsdCAobWV0YWRhdGFDYWNoZSwgY29tcHV0ZURlY2spIHRvIHRoaXMgcHVyZSBpbnRlcmZhY2UgYW5kIGFwcGxpZXNcbiAqIHRoZSByZXN1bHRpbmcgcGxhbiB3aXRoIHZhdWx0LmNyZWF0ZSgpICsgZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKCkuXG4gKlxuICogdjEuMC4wIGNvbnZlbnRpb24gXHUyMDE0IG5leHQtb25seSwgbm8gb3ZlcnZpZXcgcGFnZTogYSBzbGlkZSdzIGBkZWNrYFxuICogcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluayAoaXRzIG5leHQgc2xpZGUpLiBwbGFuQ3JlYXRlTmV4dCBkZWNpZGVzLFxuICogZm9yIHRoZSBjdXJyZW50IGRlY2sgbm90ZTpcbiAqICAgLSB0aGUgbmFtZSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKGNvbGxpc2lvbi1hd2FyZSksXG4gKiAgIC0gdGhlIHJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgbmV3IG5vdGUsXG4gKiAgIC0gdGhlIHJld3JpdGVzIG5lZWRlZCBvbiBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSkuXG4gKiBwbGFuQ3JlYXRlTmV3IHBsYW5zIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIChhIGZyZXNoIG5vdGUgdGhhdCBpc1xuICogbm90IHBhcnQgb2YgYW55IGRlY2sgeWV0IFx1MjAxNCBgZGVjazogW11gLCBubyByZXdyaXRlcyBhbnl3aGVyZSkuXG4gKiBwbGFuTWFrZUZpcnN0U2xpZGUgcGxhbnMgdGhlIGludmVyc2U6IHByb21vdGluZyBhbiBleGlzdGluZyBwbGFpbiBub3RlXG4gKiBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2sgKGBkZWNrOiBbXWAgd3JpdHRlbiBvbnRvIHRoZSBub3RlXG4gKiBpdHNlbGYsIG5vdGhpbmcgY3JlYXRlZCBvciByZXdyaXR0ZW4pLlxuICovXG5cbmltcG9ydCB7IGV4dHJhY3RMaW5rVGV4dCB9IGZyb20gXCIuL2RlY2tcIjtcblxuLyoqIElucHV0cyBmb3IgcGxhbm5pbmcgXHUyMDE0IHJlc29sdmVkIGJ5IHRoZSBhZGFwdGVyIGluIG1haW4udHMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dElucHV0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIGN1cnJlbnQgbm90ZSAqL1xuICBjdXJyZW50TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBjdXJyZW50IG5vdGUgKGV4dHJhY3RlZCwgYXQgbW9zdCBvbmUpICovXG4gIGN1cnJlbnRMaW5rczogc3RyaW5nW107XG4gIC8qKiBCYXNlbmFtZXMgb2YgZXZlcnkgbWFya2Rvd24gbm90ZSBpbiB0aGUgdmF1bHQgKGNvbGxpc2lvbi1mcmVlIG5hbWluZykgKi9cbiAgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz47XG59XG5cbi8qKiBPbmUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja1Jld3JpdGUge1xuICAvKiogQmFzZW5hbWUgb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IHJhdyBgZGVja2AgbGluayB0ZXh0cyAoc2VyaWFsaXplZCBhcyBhIFlBTUwgbGlzdCkgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKiBUaGUgZnVsbCBwbGFuIGZvciBjcmVhdGluZyBvbmUgbmV3IHNsaWRlICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRSZXN1bHQge1xuICAvKiogQmFzZW5hbWUgKHdpdGhvdXQgZXh0ZW5zaW9uKSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKi9cbiAgbmV3TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIGZvciB0aGUgbmV3IG5vdGUncyBmcm9udG1hdHRlciAqL1xuICBuZXdEZWNrTGlua3M6IHN0cmluZ1tdO1xuICAvKiogUmV3cml0ZXMgdG8gYXBwbHkgdG8gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlKSAqL1xuICByZXdyaXRlczogRGVja1Jld3JpdGVbXTtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBub3RlLlxuICpcbiAqIEJlaGF2aW9yczpcbiAqICAgLSBObyBuZXh0IGxpbmsgKGxhc3Qgc2xpZGUsIGZyZXNoIGRlY2sgaGVhZCwgb3IgYSBwbGFpbiBub3RlIHN0YXJ0aW5nXG4gKiAgICAgYSBicmFuZC1uZXcgZGVjayk6IGFwcGVuZCBgPGN1cnJlbnQ+LW5leHRgIGFzIHRoZSBuZXcgbGFzdCBzbGlkZTsgdGhlXG4gKiAgICAgY3VycmVudCBub3RlJ3MgYGRlY2tgIGdhaW5zIHRoZSBsaW5rIHRvIGl0LlxuICogICAtIFZhbGlkIG5leHQgbGluazogaW5zZXJ0IGA8Y3VycmVudD4tbmV4dGAgYmV0d2VlbiB0aGUgY3VycmVudCBub3RlIGFuZFxuICogICAgIGl0cyBuZXh0OyB0aGUgbmV3IG5vdGUgdGFrZXMgb3ZlciB0aGUgb2xkIG5leHQgbGluay5cbiAqICAgLSBCcm9rZW4gbmV4dCBsaW5rIChwbGFpbiwgbm9uLWV4aXN0aW5nIG5hbWUpOiBjcmVhdGUgZXhhY3RseSB0aGVcbiAqICAgICBkZWNsYXJlZCBtaXNzaW5nIG5vdGUgYXMgdGhlIG5ldyBuZXh0IHNsaWRlIFx1MjAxNCB0aGUgXHUyNkEwIHdhcm5pbmdcbiAqICAgICBkaXNhcHBlYXJzIGFuZCB0aGUgYXV0aG9yJ3MgaW50ZW50IGlzIGhvbm91cmVkLiBBIGJyb2tlbiBsaW5rIHRoYXQgaXNcbiAqICAgICBub3QgYSBwbGFpbiBiYXNlbmFtZSAocGF0aC1xdWFsaWZpZWQsIHNlbGYtcmVmZXJlbmNpbmcpIGlzIHRyZWF0ZWQgYXNcbiAqICAgICBpbnZhbGlkIGFuZCBkcm9wcGVkIChhcHBlbmQgYSBgPGN1cnJlbnQ+LW5leHRgIGxhc3Qgc2xpZGUgaW5zdGVhZCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuQ3JlYXRlTmV4dChpbnB1dDogQ3JlYXRlTmV4dElucHV0KTogQ3JlYXRlTmV4dFJlc3VsdCB8IG51bGwge1xuICBjb25zdCB7IGN1cnJlbnROYW1lLCBjdXJyZW50TGlua3MgfSA9IGlucHV0O1xuICBjb25zdCBuZXh0TGluayA9IGN1cnJlbnRMaW5rc1swXTtcblxuICBpZiAobmV4dExpbmspIHtcbiAgICBjb25zdCBuZXh0TmFtZSA9IGV4dHJhY3RMaW5rVGV4dChuZXh0TGluayk7XG4gICAgaWYgKG5leHROYW1lICYmIGlzUGxhaW5OYW1lKG5leHROYW1lKSAmJiBuZXh0TmFtZSAhPT0gY3VycmVudE5hbWUpIHtcbiAgICAgIGlmICghaW5wdXQuZXhpc3RpbmdOYW1lcy5oYXMobmV4dE5hbWUpKSB7XG4gICAgICAgIC8vIFRoZSBkZWNsYXJlZCBuZXh0IG5vdGUgZG9lcyBub3QgZXhpc3QgeWV0IFx1MjE5MiBjcmVhdGUgZXhhY3RseSB0aGF0XG4gICAgICAgIC8vIG5vdGUgKGZpeGVzIHRoZSBicm9rZW4tbGluayB3YXJuaW5nLCBob25vdXJzIHRoZSBhdXRob3IncyBpbnRlbnQpLlxuICAgICAgICByZXR1cm4geyBuZXdOYW1lOiBuZXh0TmFtZSwgbmV3RGVja0xpbmtzOiBbXSwgcmV3cml0ZXM6IFtdIH07XG4gICAgICB9XG4gICAgICAvLyBBIHZhbGlkIG5leHQgbm90ZSBleGlzdHMgXHUyMTkyIGluc2VydCBiZXR3ZWVuIGl0IGFuZCB0aGUgY3VycmVudCBub3RlLlxuICAgICAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ld05hbWUsXG4gICAgICAgIG5ld0RlY2tMaW5rczogW25leHRMaW5rXSxcbiAgICAgICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBJbnZhbGlkIChwYXRoLXF1YWxpZmllZCAvIHNlbGYtcmVmZXJlbmNpbmcpIG5leHQgbGluayBcdTIxOTIgZHJvcCBpdCBhbmRcbiAgICAvLyBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSAoZmFsbCB0aHJvdWdoIHRvIHRoZSBuby1uZXh0IGJyYW5jaCkuXG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTm8gKHVzYWJsZSkgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgcmV0dXJuIHtcbiAgICBuZXdOYW1lLFxuICAgIG5ld0RlY2tMaW5rczogW10sXG4gICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gIH07XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuXG4gKlxuICogVGhlIG5ldyBub3RlIHN0YXJ0cyBhcyBhIHNpbmdsZS1zbGlkZSBkZWNrIChgZGVjazogW11gKSBhbmQgbm90aGluZyBlbHNlXG4gKiBpcyB0b3VjaGVkIFx1MjAxNCB0aGUgbm90ZSBpdCB3YXMgbGF1bmNoZWQgZnJvbSBzdGF5cyBhcy1pcy4gTGF0ZXIgcGFnZXMgYXJlXG4gKiBhZGRlZCB3aXRoIENyZWF0ZSBOZXh0IFNsaWRlIGZyb20gaW5zaWRlIHRoZSBkZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5ldyhpbnB1dDogeyBleGlzdGluZ05hbWVzOiBTZXQ8c3RyaW5nPiB9KTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZTogdW5pcXVlTmFtZShcInVudGl0bGVkLXNsaWRlc1wiLCBpbnB1dC5leGlzdGluZ05hbWVzKSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbXSxcbiAgfTtcbn1cblxuLyoqIEEgbm90ZSBwcm9tb3RlZCBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFrZUZpcnN0U2xpZGVQbGFuIHtcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBmb3IgdGhlIG5vdGUncyBmcm9udG1hdHRlciAoYWx3YXlzIGVtcHR5IFx1MjAxNCBhIHNpbmdsZS1zbGlkZSBkZWNrKSAqL1xuICBkZWNrOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBQbGFuIGEgXCJNYWtlIHRoaXMgbm90ZSB0aGUgZmlyc3Qgc2xpZGVcIiBydW4gXHUyMDE0IHByb21vdGUgdGhlIGFjdGl2ZSBub3RlXG4gKiBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGl0cyBjb250ZW50LCB0aXRsZSBhbmQgbG9jYXRpb24gc3RheVxuICogdW50b3VjaGVkLCBhbmQgdGhlIGZyb250bWF0dGVyIGdhaW5zIGBkZWNrOiBbXWAgKGEgc2luZ2xlLXNsaWRlIGRlY2ssXG4gKiB0aGUgc3RhbmRhcmQgXCJsYXN0IHNsaWRlXCIgLyBzb2xvIG1hcmtlcikuIE5vIHJld3JpdGVzIGFueXdoZXJlIFx1MjAxNCBsYXRlclxuICogcGFnZXMgYXJlIGFkZGVkIHdpdGggQ3JlYXRlIE5leHQgU2xpZGUgZnJvbSBpbnNpZGUgdGhlIGRlY2suXG4gKlxuICogTm90ZXMgdGhhdCBhbHJlYWR5IGJlbG9uZyB0byBhIGRlY2sgKGhvbGQgYSBgZGVja2AgcHJvcGVydHksIG9yIGFyZVxuICogZGVjbGFyZWQgYXMgYW5vdGhlciBzbGlkZSdzIG5leHQpIGFyZSBOT1QgdG91Y2hlZDogdGhlIHBsYW4gaXMgbnVsbCBhbmRcbiAqIHRoZSBjb21tYW5kIG5vLW9wcyB3aXRoIGEgTm90aWNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbk1ha2VGaXJzdFNsaWRlKGlucHV0OiB7IGFscmVhZHlEZWNrOiBib29sZWFuIH0pOiBNYWtlRmlyc3RTbGlkZVBsYW4gfCBudWxsIHtcbiAgaWYgKGlucHV0LmFscmVhZHlEZWNrKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgZGVjazogW10gfTtcbn1cblxuLyoqIEEgbmFtZSB1c2FibGUgYXMgYSB2YXVsdCBub3RlIG5hbWU6IG5vIHBhdGggc2VwYXJhdG9ycywgbm9uLWVtcHR5ICovXG5mdW5jdGlvbiBpc1BsYWluTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiAhbmFtZS5pbmNsdWRlcyhcIi9cIikgJiYgIW5hbWUuaW5jbHVkZXMoXCJcXFxcXCIpO1xufVxuXG4vKiogRmlyc3QgZnJlZSBuYW1lIGluIHRoZSBmYW1pbHkgYGJhc2VgLCBgYmFzZS0yYCwgYGJhc2UtM2AsIFx1MjAyNiAqL1xuZnVuY3Rpb24gdW5pcXVlTmFtZShiYXNlOiBzdHJpbmcsIGV4aXN0aW5nOiBTZXQ8c3RyaW5nPik6IHN0cmluZyB7XG4gIGlmICghZXhpc3RpbmcuaGFzKGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YmFzZX0tJHtpfWA7XG4gICAgaWYgKCFleGlzdGluZy5oYXMoY2FuZGlkYXRlKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogZGVsZXRlU2xpZGVzLnRzIFx1MjAxNCBQdXJlIFwiRGVsZXRlIHNsaWRlc1wiIHBsYW5uaW5nIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdCBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHlcbiAqIChzZWUgdGVzdC9kZWxldGVTbGlkZXMudGVzdC50cykuIFRoZSBhZGFwdGVyIGluIGRlY2stc2VydmljZS50cyBhcHBsaWVzXG4gKiB0aGUgcGxhbjogaXQgcmV3cml0ZXMgdGhlIHN1cnZpdmluZyBub3RlcycgYGRlY2tgIHByb3BlcnRpZXMsIHRoZW4gbW92ZXNcbiAqIHRoZSBkZWxldGVkIG5vdGVzIHRvIHRoZSB0cmFzaC5cbiAqXG4gKiBEZWxldGlvbiBzcGxpY2VzIHRoZSBjaGFpbiBpbnN0ZWFkIG9mIGJyZWFraW5nIGl0OiBldmVyeSBtYXhpbWFsIHJ1biBvZlxuICogZGVsZXRlZCBzbGlkZXMgYmV0d2VlbiB0d28gc3Vydml2b3JzIEEgXHUyMTkyIFx1MjAyNiBcdTIxOTIgQiBpcyByZXBhaXJlZCBieSBwb2ludGluZ1xuICogQSdzIGBkZWNrYCBsaW5rIGF0IEIgKGBbXWAgd2hlbiB0aGUgcnVuIHJlYWNoZXMgdGhlIGVuZCBvZiB0aGUgY2hhaW4pLlxuICogV2hlbiBhIHJ1biBzdGFydHMgYXQgdGhlIGNoYWluIGhlYWQsIHRoZSBmaXJzdCBzdXJ2aXZvciBiZWNvbWVzIHRoZSBuZXdcbiAqIGhlYWQgYW5kIG5lZWRzIG5vIHJld3JpdGUgYXQgYWxsIChpdHMgb3duIGBkZWNrYCBhbHJlYWR5IHBvaW50cyBvbndhcmQpLlxuICovXG5cbi8qKiBPbmUgc3Vydml2aW5nIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVJld3JpdGUge1xuICAvKiogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdGhhdCBzaG91bGQgYmVjb21lIHRoaXMgbm90ZSdzIG5leHQgc2xpZGUsXG4gICAqIG9yIG51bGwgd2hlbiB0aGUgbm90ZSBiZWNvbWVzIHRoZSBuZXcgbGFzdCBzbGlkZSAoYGRlY2s6IFtdYCkuXG4gICAqL1xuICBuZXh0UGF0aDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBkZWxldGlvbiBvZiBzbGlkZXMgZnJvbSBhbiBvcmRlcmVkIGRlY2sgY2hhaW4uXG4gKlxuICogYGNoYWluYCBpcyB0aGUgZnVsbCBzbGlkZSBvcmRlciAoWzBdID0gaGVhZCkuIE9ubHkgcGF0aHMgcHJlc2VudCBpbiB0aGVcbiAqIGNoYWluIGFyZSBjb25zaWRlcmVkOyBhbnl0aGluZyBlbHNlIGluIGBkZWxldGVQYXRoc2AgaXMgaWdub3JlZC4gUmV0dXJuc1xuICogb25lIHJld3JpdGUgcGVyIHN1cnZpdmluZyBub3RlIHRoYXQgZGlyZWN0bHkgcHJlY2VkZWQgYSBkZWxldGVkIHJ1bixcbiAqIG9yZGVyZWQgYnkgY2hhaW4gcG9zaXRpb24uIERlbGV0aW5nIG5vdGhpbmcgeWllbGRzIG5vIHJld3JpdGVzOyBkZWxldGluZ1xuICogZXZlcnl0aGluZyB5aWVsZHMgbm8gcmV3cml0ZXMgZWl0aGVyIChubyBzdXJ2aXZvcnMgbGVmdCB0byByZXBhaXIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkRlbGV0ZVNsaWRlcyhcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbik6IERlbGV0ZVJld3JpdGVbXSB7XG4gIGNvbnN0IHJld3JpdGVzOiBEZWxldGVSZXdyaXRlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhdGggPSBjaGFpbltpXTtcbiAgICBpZiAoIXBhdGggfHwgZGVsZXRlUGF0aHMuaGFzKHBhdGgpKSBjb250aW51ZTtcbiAgICAvLyBGaW5kIHRoZSBmaXJzdCBzdXJ2aXZvciBhZnRlciB0aGlzIG5vdGUncyBwb3NpdGlvbi5cbiAgICBsZXQgaiA9IGkgKyAxO1xuICAgIHdoaWxlIChqIDwgY2hhaW4ubGVuZ3RoICYmIGRlbGV0ZVBhdGhzLmhhcyhjaGFpbltqXSkpIGorKztcbiAgICBjb25zdCBuZXh0UGF0aCA9IGogPCBjaGFpbi5sZW5ndGggPyBjaGFpbltqXSA6IG51bGw7XG4gICAgY29uc3QgY2hhbmdlZCA9IG5leHRQYXRoICE9PSAoY2hhaW5baSArIDFdID8/IG51bGwpO1xuICAgIGlmIChjaGFuZ2VkKSByZXdyaXRlcy5wdXNoKHsgcGF0aCwgbmV4dFBhdGggfSk7XG4gIH1cbiAgcmV0dXJuIHJld3JpdGVzO1xufVxuXG4vKipcbiAqIFBpY2sgd2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlciBkZWxldGluZyBzbGlkZXM6IHRoZSBuZWFyZXN0XG4gKiBzdXJ2aXZvciBvZiBgZGVsZXRlZFBhdGhzYCcgbmVpZ2hib3VyaG9vZCBhcm91bmQgYGZvY3VzUGF0aGAgXHUyMDE0IHByZWZlclxuICogdGhlIGNsb3Nlc3Qgc3Vydml2b3IgYWZ0ZXIgaXQsIGVsc2UgdGhlIGNsb3Nlc3QgYmVmb3JlIGl0LiBSZXR1cm5zIG51bGxcbiAqIHdoZW4gYGZvY3VzUGF0aGAgc3Vydml2ZXMgb3Igbm90aGluZyBuZWFyYnkgcmVtYWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tMYW5kaW5nUGF0aChcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghZm9jdXNQYXRoIHx8ICFkZWxldGVQYXRocy5oYXMoZm9jdXNQYXRoKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihmb2N1c1BhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgZm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgZm9yIChsZXQgaSA9IGluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoIWRlbGV0ZVBhdGhzLmhhcyhjaGFpbltpXSkpIHJldHVybiBjaGFpbltpXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiIsICIvKipcbiAqIG5hdi50cyBcdTIwMTQgUHVyZSBuYXZpZ2F0aW9uIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogVHdvIHJ1bGVzIGxpdmUgaGVyZSwgYm90aCBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIHRoZXkgY2FuXG4gKiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvbmF2LnRlc3QudHMpOlxuICpcbiAqICAgMS4gQSBwcmVzcyBzdGVwcyBmcm9tIHRoZSAqcHJldmlvdXMgcHJlc3MncyB0YXJnZXQqLCBub3QgZnJvbSB0aGUgbm90ZSB0aGVcbiAqICAgICAgZWRpdG9yIGhhcHBlbnMgdG8gc2hvdy4gV2l0aG91dCB0aGlzLCBldmVyeSBwcmVzcyBpbiBhIGJ1cnN0IHJlc29sdmVzIHRvXG4gKiAgICAgIHRoZSBzYW1lIG5leHQgc2xpZGUgYW5kIGFsbCBidXQgb25lIGFyZSBzd2FsbG93ZWQgKGlzc3VlICMxMTApLlxuICogICAyLiBBIHNlc3Npb24ga2VlcHMgdGhlIGNoYWluICpoZWFkKiBpdCBlbnRlcmVkIHdoaWxlIHRoYXQgaGVhZCBzdGlsbCByZWFjaGVzXG4gKiAgICAgIHRoZSBub3RlIGluIHRoZSBlZGl0b3IuIFRoZSBoZWFkIGlzIGEgaGludCwgbm90IGEgY2FjaGVkIGNoYWluOiB0aGUgY2hhaW5cbiAqICAgICAgaXMgd2Fsa2VkIGxpdmUgb24gZXZlcnkgcmVzb2x1dGlvbiwgc28gc2xpZGVzIGNyZWF0ZWQsIGRlbGV0ZWQgb3IgcmVuYW1lZFxuICogICAgICBtZWFud2hpbGUgYXJlIGhvbm91cmVkIChgZGVja0Zyb21IZWFkKClgKSwgYW5kIGEgaGludCB0aGF0IG5vIGxvbmdlciBsZWFkc1xuICogICAgICB0byB0aGUgY3VycmVudCBub3RlIGlzIGlnbm9yZWQuIFJlLXJlc29sdmluZyB0aGUgaGVhZCBvbiBldmVyeSBzdGVwIGlzIHdoYXRcbiAqICAgICAgdXNlZCB0byBsZXQgYSBzaGFyZWQgYGRlY2tgIGxpbmsgXHUyMDE0IHR3byBzbGlkZXMgZGVjbGFyaW5nIHRoZSBzYW1lIG5leHRcbiAqICAgICAgc2xpZGUgXHUyMDE0IHN3YXAgdGhlIGNoYWluIHVuZGVyIHRoZSByZWFkZXIgKGlzc3VlICMxMTApLlxuICovXG5cbmltcG9ydCB0eXBlIHsgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5cbi8qKiBPbmUgcXVldWVkIG5hdmlnYXRpb24gcmVxdWVzdDogYSBkaXJlY3Rpb24sIG9yIGFuIGFic29sdXRlIGNoYWluIGluZGV4ICovXG5leHBvcnQgdHlwZSBOYXZJbnRlbnQgPSB7IGRpcjogXCJwcmV2XCIgfCBcIm5leHRcIiB9IHwgeyBpbmRleDogbnVtYmVyIH07XG5cbi8qKlxuICogRGVjayByZXNvbHV0aW9uIGluc2lkZSBhIG5hdmlnYXRpb24gc2Vzc2lvbjogd2FsayBsaXZlIGZyb20gdGhlIHNlc3Npb24ncyBoZWFkXG4gKiBoaW50IHdoZW4gaXQgc3RpbGwgcmVhY2hlcyBgYW5jaG9yUGF0aGAsIGFuZCBmYWxsIGJhY2sgdG8gYSBmcmVzaCByZXNvbHV0aW9uXG4gKiAoYGNvbXB1dGVgLCB3aGljaCBmaW5kcyBpdHMgb3duIGhlYWQpIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlc3Npb25EZWNrKFxuICBoZWFkOiBzdHJpbmcgfCBudWxsLFxuICBhbmNob3JQYXRoOiBzdHJpbmcgfCBudWxsLFxuICBmcm9tSGVhZDogKGhlYWQ6IHN0cmluZywgcGF0aDogc3RyaW5nKSA9PiBEZWNrSW5mbyB8IG51bGwsXG4gIGNvbXB1dGU6IChwYXRoOiBzdHJpbmcpID0+IERlY2tJbmZvIHwgbnVsbCxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIGlmICghYW5jaG9yUGF0aCkgcmV0dXJuIG51bGw7XG4gIGlmIChoZWFkKSB7XG4gICAgY29uc3QgZGVjayA9IGZyb21IZWFkKGhlYWQsIGFuY2hvclBhdGgpO1xuICAgIGlmIChkZWNrKSByZXR1cm4gZGVjaztcbiAgfVxuICByZXR1cm4gY29tcHV0ZShhbmNob3JQYXRoKTtcbn1cblxuLyoqXG4gKiBUYXJnZXQgb2Ygb25lIGludGVudCBpbnNpZGUgYSByZXNvbHZlZCBkZWNrLCBvciBudWxsIHdoZW4gaXQgd291bGQgbGVhdmUgdGhlXG4gKiBkZWNrIFx1MjAxNCB0aGUgZmlyc3Qgc2xpZGUgaGFzIG5vIHByZXZpb3VzIHBhZ2UsIHRoZSBsYXN0IHNsaWRlIGhhcyBubyBuZXh0IHBhZ2UsXG4gKiBhbmQgYSBqdW1wIHRvIHRoZSBjdXJyZW50IGluZGV4IGlzIGEgbm8tb3AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGVwVGFyZ2V0KGRlY2s6IERlY2tJbmZvLCBpbnRlbnQ6IE5hdkludGVudCk6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBpbmRleCA9XG4gICAgXCJpbmRleFwiIGluIGludGVudCA/IGludGVudC5pbmRleCA6IGludGVudC5kaXIgPT09IFwicHJldlwiID8gZGVjay5pbmRleCAtIDEgOiBkZWNrLmluZGV4ICsgMTtcbiAgaWYgKGluZGV4ID09PSBkZWNrLmluZGV4IHx8IGluZGV4IDwgMCB8fCBpbmRleCA+PSBkZWNrLmNoYWluLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBkZWNrLmNoYWluW2luZGV4XSA/PyBudWxsO1xufVxuXG4vKiogV2hhdCB0aGUgc2Vzc2lvbiBuZWVkcyBmcm9tIHRoZSBlZGl0b3IsIGluamVjdGVkIHNvIHRoZSBxdWV1ZSBzdGF5cyB0ZXN0YWJsZSAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXZIb29rcyB7XG4gIC8qKiBMaXZlIGRlY2sgZm9yIGBwYXRoYCwgaG9ub3VyaW5nIHRoZSBzZXNzaW9uJ3MgaGVhZCBoaW50ICovXG4gIHJlc29sdmU6IChwYXRoOiBzdHJpbmcsIGhlYWQ6IHN0cmluZyB8IG51bGwpID0+IERlY2tJbmZvIHwgbnVsbDtcbiAgLyoqIE9wZW4gYHRhcmdldGAgKHRoZSBwcm9taXNlIHJlc29sdmluZyBvbmNlIHRoZSBlZGl0b3Igc3dpdGNoZWQgdG8gaXQpICovXG4gIG9wZW46ICh0YXJnZXQ6IHN0cmluZywgZnJvbTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogVGhlIG5vdGUgaW4gdGhlIGVkaXRvciwgdXNlZCBhcyB0aGUgYW5jaG9yIHdoZW4gdGhlIHNlc3Npb24gaGFzIG5vbmUgKi9cbiAgYWN0aXZlUGF0aDogKCkgPT4gc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBUaGUgcXVldWUgYmVoaW5kIHByZXYgLyBuZXh0IC8ganVtcC4gUHJlc3NlcyBhcmUgYXBwbGllZCBvbmUgYXdhaXRlZCBvcGVuIGF0IGFcbiAqIHRpbWUgc28gYSBidXJzdCBhZHZhbmNlcyBvbmUgc2xpZGUgcGVyIHByZXNzLCBhbmQgZWFjaCBzdGVwIGlzIGFuY2hvcmVkIG9uIHRoZVxuICogcHJldmlvdXMgc3RlcCdzIHRhcmdldCByYXRoZXIgdGhhbiBvbiB0aGUgbm90ZSB0aGUgZWRpdG9yIHN0aWxsIHNob3dzLlxuICovXG5leHBvcnQgY2xhc3MgTmF2U2Vzc2lvbiB7XG4gIHByaXZhdGUgcXVldWU6IE5hdkludGVudFtdID0gW107XG4gIHByaXZhdGUgcnVubmluZyA9IGZhbHNlO1xuICBwcml2YXRlIHBlbmRpbmc6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhlYWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaG9va3M6IE5hdkhvb2tzKSB7fVxuXG4gIC8qKiBUaGUgY2hhaW4gaGVhZCB0aGlzIHNlc3Npb24gZW50ZXJlZCwgb3IgbnVsbCBiZWZvcmUgaXRzIGZpcnN0IHN0ZXAgKi9cbiAgZ2V0IHJlbWVtYmVyZWRIZWFkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmhlYWQ7XG4gIH1cblxuICAvKipcbiAgICogUmUtYmFzZSB0aGUgc2Vzc2lvbiBvbiBhIGRpZmZlcmVudCBjaGFpbiBoZWFkLiBBIHJlb3JkZXIgcmV3aXJlcyB0aGUgZGVja1xuICAgKiBhcm91bmQgdGhlIHNlc3Npb24sIHNvIHRoZSBoZWFkIGl0IGVudGVyZWQgbWF5IG5vIGxvbmdlciBiZSB0aGUgZGVjaydzXG4gICAqIGhlYWQgKGFuZCwgc3RpbGwgcmVhY2hpbmcgdGhlIGN1cnJlbnQgbm90ZSwgd291bGQgd2FsayBhIHRydW5jYXRlZCBjaGFpblxuICAgKiBmcm9tIHRoZSBtaWRkbGUpOyB0aGUgY2FsbGVyIGhhbmRzIG92ZXIgdGhlIHJlb3JkZXJlZCBjaGFpbidzIG93biBoZWFkLlxuICAgKi9cbiAgc2V0SGVhZChoZWFkOiBzdHJpbmcgfCBudWxsKTogdm9pZCB7XG4gICAgdGhpcy5oZWFkID0gaGVhZDtcbiAgfVxuXG4gIC8qKiBRdWV1ZSBhIHByZXNzOyB0aGUgZmlyc3Qgb25lIHN0YXJ0cyB0aGUgZHJhaW4uIFJlc29sdmVzIG9uY2UgdGhlIHF1ZXVlIGlzIGVtcHR5LiAqL1xuICBwdXNoKGludGVudDogTmF2SW50ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKGludGVudCk7XG4gICAgaWYgKHRoaXMucnVubmluZykgcmV0dXJuIHRoaXMuZHJhaW5pbmcgPz8gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgdGhpcy5kcmFpbmluZyA9IHRoaXMuZHJhaW4oKS5jYXRjaCgoZXJyb3I6IHVua25vd24pID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJuYXRpdmUtc2xpZGVzOiBuYXZpZ2F0aW9uIGZhaWxlZFwiLCBlcnJvcik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZHJhaW5pbmc7XG4gIH1cblxuICAvKiogUmVzb2x2ZXMgd2hlbiB0aGUgcXVldWUgaGFzIGRyYWluZWQgKHRoZSBwcm9taXNlIGBwdXNoKClgIHJldHVybnMpICovXG4gIHByaXZhdGUgZHJhaW5pbmc6IFByb21pc2U8dm9pZD4gfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGFzeW5jIGRyYWluKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHdoaWxlICh0aGlzLnF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgaW50ZW50ID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICAgICAgICBpZiAoIWludGVudCkgYnJlYWs7XG4gICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLnBlbmRpbmcgPz8gdGhpcy5ob29rcy5hY3RpdmVQYXRoKCk7XG4gICAgICAgIGlmICghZnJvbSkgY29udGludWU7IC8vIG5vIG5vdGUgdG8gYW5jaG9yIG9uIFx1MjAxNCBkcm9wIHRoZSBwcmVzc1xuICAgICAgICBjb25zdCBkZWNrID0gdGhpcy5ob29rcy5yZXNvbHZlKGZyb20sIHRoaXMuaGVhZCk7XG4gICAgICAgIGlmICghZGVjaykgY29udGludWU7IC8vIG5vIGxvbmdlciBhIGRlY2sgbm90ZSBcdTIwMTQgZHJvcCB0aGUgcHJlc3NcbiAgICAgICAgdGhpcy5oZWFkID0gZGVjay5jaGFpblswXSA/PyB0aGlzLmhlYWQ7IC8vIHJlbWVtYmVyIHRoZSBjaGFpbiB3YWxrZWRcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gc3RlcFRhcmdldChkZWNrLCBpbnRlbnQpO1xuICAgICAgICBpZiAoIXRhcmdldCkgY29udGludWU7IC8vIGZpcnN0L2xhc3Qgc2xpZGUgXHUyMDE0IHRoZSBwcmVzcyBpcyBhIG5vLW9wXG4gICAgICAgIHRoaXMucGVuZGluZyA9IHRhcmdldDtcbiAgICAgICAgYXdhaXQgdGhpcy5ob29rcy5vcGVuKHRhcmdldCwgZnJvbSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIFByZXNzZXMgcXVldWVkIGJlaGluZCBhIGZhaWxlZCBvcGVuIGFyZSBzdGFsZTogcmVwbGF5aW5nIHRoZW0gbGF0ZXIgd291bGRcbiAgICAgIC8vIG1vdmUgdGhlIHJlYWRlciBmcm9tIHdoZXJldmVyIHRoZXkgZW5kIHVwLCBub3QgZnJvbSB3aGVyZSB0aGV5IHdlcmUuXG4gICAgICB0aGlzLnF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wZW5kaW5nID0gbnVsbDsgLy8gcXVldWUgZHJhaW5lZDogdGhlIGVkaXRvciBpcyBhdXRob3JpdGF0aXZlIGFnYWluXG4gICAgICB0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgTWVudSwgVEZpbGUsIFdvcmtzcGFjZUxlYWYgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgQ29uZmlybURlbGV0ZU1vZGFsIH0gZnJvbSBcIi4vY29uZmlybS1kZWxldGVcIjtcbmltcG9ydCB7IFBhbmVsRHJhZyB9IGZyb20gXCIuL3BhbmVsLWRyYWdcIjtcbmltcG9ydCB7IHBsYW5SZW9yZGVyLCBzdGVwSW5zZXJ0QXQsIHR5cGUgUmVvcmRlclBsYW4gfSBmcm9tIFwiLi9yZW9yZGVyXCI7XG5cbi8qKiBWaWV3IHR5cGUgaWQgb2YgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsICovXG5leHBvcnQgY29uc3QgU0xJREVTX1BBTkVMX1ZJRVcgPSBcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIjtcblxuLyoqXG4gKiBTaWRlYmFyIHBhbmVsIGxpc3RpbmcgZXZlcnkgc2xpZGUgb2YgdGhlIGFjdGl2ZSBub3RlJ3MgZGVjayAobmV4dC1vbmx5XG4gKiBjaGFpbiBvcmRlcikuIFRha2VzIG92ZXIgdGhlIGFnZ3JlZ2F0aW9uL2VudHJ5IHJvbGUgdGhlIG92ZXJ2aWV3IHBhZ2VcbiAqIHVzZWQgdG8gcGxheSBiZWZvcmUgdjEuMC4wLlxuICpcbiAqIEludGVyYWN0aW9uOlxuICogICAtIGNsaWNrICAgICAgICAgICAgXHUyMTkyIG9wZW4gdGhhdCBzbGlkZSAoYW5kIGNsZWFyIGFueSBzZWxlY3Rpb24pXG4gKiAgIC0gTW9kK2NsaWNrICAgICAgICBcdTIxOTIgdG9nZ2xlIHRoZSBpdGVtIGluIHRoZSBzZWxlY3Rpb25cbiAqICAgLSBTaGlmdCtjbGljayAgICAgIFx1MjE5MiBleHRlbmQgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBsYXN0IGFuY2hvclxuICogICAtIGRyYWcgICAgICAgICAgICAgXHUyMTkyIG1vdmUgdGhlIHNsaWRlIHRvIGEgZ2FwICh0aGUgd2hvbGUgc2VsZWN0aW9uLCB3aGVuIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICBncmFiYmVkIHNsaWRlIGlzIHBhcnQgb2Ygb25lKSBcdTIwMTQgc2VlIHNyYy9wYW5lbC1kcmFnLnRzXG4gKiAgIC0gcmlnaHQtY2xpY2sgICAgICBcdTIxOTIgY29udGV4dCBtZW51OiBNb3ZlIHVwIC8gTW92ZSBkb3duIC8gQ3JlYXRlIG5leHQgc2xpZGUgL1xuICogICAgICAgICAgICAgICAgICAgICAgICBEZWxldGUgc2xpZGUocylcbiAqL1xuZXhwb3J0IGNsYXNzIFNsaWRlc1BhbmVsVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgLyoqIENoYWluIHNpZ25hdHVyZSBvZiB0aGUgY3VycmVudGx5IHJlbmRlcmVkIGxpc3QgKi9cbiAgcHJpdmF0ZSBsYXN0Q2hhaW46IHN0cmluZ1tdID0gW107XG4gIC8qKiBSZW5kZXJlZCBpdGVtIGVsZW1lbnRzLCBpbmRleC1hbGlnbmVkIHdpdGggbGFzdENoYWluICovXG4gIHByaXZhdGUgaXRlbXM6IHsgcGF0aDogc3RyaW5nOyBlbDogSFRNTEVsZW1lbnQgfVtdID0gW107XG4gIC8qKiBDdXJyZW50bHkgc2VsZWN0ZWQgc2xpZGUgcGF0aHMgKG11bHRpLXNlbGVjdCBmb3IgRGVsZXRlKSAqL1xuICBwcml2YXRlIHNlbGVjdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIC8qKiBTZWxlY3Rpb24gYW5jaG9yIGZvciBTaGlmdCtjbGljayByYW5nZSBleHRlbnNpb24gKi9cbiAgcHJpdmF0ZSBhbmNob3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAvKiogVGhlIGRyYWctdG8tcmVvcmRlciBnZXN0dXJlIChwb2ludGVyIGhhbmRsaW5nIG9ubHkgXHUyMDE0IG5vIGRlY2sga25vd2xlZGdlKSAqL1xuICBwcml2YXRlIGRyYWc6IFBhbmVsRHJhZztcbiAgLyoqIFdoZXRoZXIgYSByZW9yZGVyIGlzIHdyaXRpbmcgZnJvbnRtYXR0ZXIgcmlnaHQgbm93IChyZW5kZXJzIGFyZSBoZWxkIGJhY2spICovXG4gIHByaXZhdGUgd3JpdGluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4sXG4gICAgbGVhZjogV29ya3NwYWNlTGVhZixcbiAgKSB7XG4gICAgc3VwZXIobGVhZik7XG4gICAgdGhpcy5kcmFnID0gbmV3IFBhbmVsRHJhZyh7XG4gICAgICBpdGVtczogKCkgPT4gdGhpcy5pdGVtcyxcbiAgICAgIG1vdmluZ0ZvcjogKHBhdGgpID0+IHRoaXMubW92aW5nRm9yKHBhdGgpLFxuICAgICAgY29udGFpbmVyOiAoKSA9PiB0aGlzLmNvbnRlbnRFbCxcbiAgICAgIG9uR3JhYjogKHBhdGgpID0+IHRoaXMub25HcmFiKHBhdGgpLFxuICAgICAgd2lsbENoYW5nZTogKG1vdmluZywgaW5zZXJ0QXQpID0+IHRoaXMud2lsbENoYW5nZShtb3ZpbmcsIGluc2VydEF0KSxcbiAgICAgIG9uRHJvcDogKG1vdmluZywgaW5zZXJ0QXQsIHNuYXBzaG90KSA9PiB2b2lkIHRoaXMuYXBwbHlSZW9yZGVyKG1vdmluZywgaW5zZXJ0QXQsIHNuYXBzaG90KSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFNMSURFU19QQU5FTF9WSUVXO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJTbGlkZXNcIjtcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJwcmVzZW50YXRpb25cIjtcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5kcmFnLmNhbmNlbCgpO1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5sYXN0Q2hhaW4gPSBbXTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jIHRoZSBsaXN0IHdpdGggdGhlIGFjdGl2ZSBub3RlJ3MgZGVjay4gSW5jcmVtZW50YWwgb24gcHVycG9zZTogdGhlXG4gICAqIHJlZnJlc2ggZXZlbnRzIGFsc28gZmlyZSB3aGlsZSBhIGNsaWNrIG9uIGFuIGVudHJ5IGlzIGluIGZsaWdodCAodGhlXG4gICAqIG1vdXNlZG93biBhY3RpdmF0ZXMgdGhpcyBsZWFmKSwgYW5kIHJlYnVpbGRpbmcgdGhlIERPTSBtaWQtZ2VzdHVyZVxuICAgKiBkZXN0cm95cyB0aGUgY2xpY2sgdGFyZ2V0IFx1MjAxNCB3aGljaCBtYWRlIG9wZW5pbmcgYSBzbGlkZSB0YWtlIHR3byBjbGlja3NcbiAgICogd2hlbmV2ZXIgdGhlIHBhbmVsIHdhcyBub3QgdGhlIGFjdGl2ZSBsZWFmLiBVbmNoYW5nZWQgY2hhaW5zIG9ubHkgZ2V0XG4gICAqIHRoZWlyIGhpZ2hsaWdodCB1cGRhdGVkLCBzbyBpdGVtIGVsZW1lbnRzIGFsd2F5cyBzdXJ2aXZlLlxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXIoKTogdm9pZCB7XG4gICAgLy8gQSBnZXN0dXJlIG9yIGEgcmVvcmRlciBvd25zIHRoZSBET006IHJlYnVpbGRpbmcgdGhlIGxpc3QgbWlkLWRyYWcgd291bGRcbiAgICAvLyBkZXN0cm95IHRoZSBlbGVtZW50cyB0aGUgZ2VzdHVyZSBpcyBtZWFzdXJpbmcsIGFuZCB0aGUgcmVvcmRlcidzIG93blxuICAgIC8vIHdyaXRlcyBmaXJlIGEgYnVyc3Qgb2YgbWV0YWRhdGFDYWNoZSBldmVudHMuIEJvdGggcGF0aHMgcmVuZGVyIG9uY2UgbW9yZVxuICAgIC8vIHdoZW4gdGhleSBhcmUgZG9uZSB3aXRoIGl0LlxuICAgIGlmICh0aGlzLmRyYWcuYWN0aXZlIHx8IHRoaXMud3JpdGluZykgcmV0dXJuO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgY2hhaW4gPSB0aGlzLmxpdmVDaGFpbihmaWxlKTtcblxuICAgIC8vIERyb3Agc2VsZWN0aW9ucyB3aG9zZSBub3RlIHZhbmlzaGVkIGZyb20gdGhlIGNoYWluIG1lYW53aGlsZVxuICAgIGlmICh0aGlzLnNlbGVjdGVkLnNpemUgPiAwKSB7XG4gICAgICBjb25zdCBsaXZlID0gbmV3IFNldChjaGFpbik7XG4gICAgICBmb3IgKGNvbnN0IHBhdGggb2YgdGhpcy5zZWxlY3RlZCkgaWYgKCFsaXZlLmhhcyhwYXRoKSkgdGhpcy5zZWxlY3RlZC5kZWxldGUocGF0aCk7XG4gICAgfVxuICAgIC8vIEEgZGVhZCBhbmNob3IgbXVzdCBub3Qgc2lsZW50bHkgdHVybiBhIFNoaWZ0K2NsaWNrIGludG8gYSB0b2dnbGVcbiAgICBpZiAodGhpcy5hbmNob3IgIT09IG51bGwgJiYgIWNoYWluLmluY2x1ZGVzKHRoaXMuYW5jaG9yKSkgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKCFjaGFpbkVxdWFscyh0aGlzLmxhc3RDaGFpbiwgY2hhaW4pKSB7XG4gICAgICB0aGlzLnJlYnVpbGQoY2hhaW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMuaXRlbXMpIGl0LmVsLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIiwgaXQucGF0aCA9PT0gZmlsZT8ucGF0aCk7XG4gICAgfVxuICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBUaGUgZGVjayBjaGFpbiBvZiBgZmlsZWAsIGxpbWl0ZWQgdG8gc2xpZGVzIHRoYXQgZXhpc3QgcmlnaHQgbm93ICovXG4gIHByaXZhdGUgbGl2ZUNoYWluKGZpbGU6IFRGaWxlIHwgbnVsbCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBkZWNrID0gZmlsZSA/IHRoaXMucGx1Z2luLnJlc29sdmVEZWNrKGZpbGUpIDogbnVsbDtcbiAgICByZXR1cm4gZGVja1xuICAgICAgPyBkZWNrLmNoYWluLmZpbHRlcigocCkgPT4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHApIGluc3RhbmNlb2YgVEZpbGUpXG4gICAgICA6IFtdO1xuICB9XG5cbiAgLyoqIEZ1bGwgcmVidWlsZCAoY2hhaW4gc2hhcGUgY2hhbmdlZCkgKi9cbiAgcHJpdmF0ZSByZWJ1aWxkKGNoYWluOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIC8vIFRoZSBpdGVtcyBsaXZlIGluIHRoZSB2aWV3J3Mgb3duIGNvbnRlbnQgZWxlbWVudCBcdTIwMTQgdGhlIHBhcnQgT2JzaWRpYW5cbiAgICAvLyBzY3JvbGxzIGFuZCB0aGUgb25seSBwYXJ0IHRoYXQgaXMgb3VycyB0byBlbXB0eSAoZW1wdHlpbmcgY29udGFpbmVyRWxcbiAgICAvLyB3b3VsZCB0YWtlIHRoZSB2aWV3IGhlYWRlciB3aXRoIGl0KS5cbiAgICBjb25zdCByb290ID0gdGhpcy5jb250ZW50RWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IGNoYWluO1xuXG4gICAgaWYgKGNoYWluLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWVtcHR5XCIgfSk7XG4gICAgICBlbXB0eS5zZXRUZXh0KFxuICAgICAgICBcIk5vIHNsaWRlcyBkZWNrIFx1MjAxNCBvcGVuIGEgZGVjayBub3RlLCBvciBydW4gY3JlYXRlIG5leHQgc2xpZGUgb24gYW55IG5vdGUgdG8gc3RhcnQgb25lLlwiLFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aDtcbiAgICBjaGFpbi5mb3JFYWNoKChwYXRoLCBpKSA9PiB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuO1xuICAgICAgY29uc3QgaXRlbSA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtaXRlbVwiIH0pO1xuICAgICAgaWYgKHBhdGggPT09IGFjdGl2ZVBhdGgpIGl0ZW0uYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1udW1cIiB9KS5zZXRUZXh0KFN0cmluZyhpICsgMSkpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtdGl0bGVcIiB9KS5zZXRUZXh0KGYuYmFzZW5hbWUpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHRoaXMub25JdGVtQ2xpY2soZSwgaSwgZikpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgKGUpID0+IHRoaXMuZHJhZy5iZWdpbihlLCBwYXRoKSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMub3BlbkNvbnRleHRNZW51KGUsIGYpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLml0ZW1zLnB1c2goeyBwYXRoLCBlbDogaXRlbSB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDbGljayByb3V0aW5nOiBwbGFpbiA9IG9wZW4sIE1vZCA9IHRvZ2dsZSBzZWxlY3QsIFNoaWZ0ID0gcmFuZ2Ugc2VsZWN0ICovXG4gIHByaXZhdGUgb25JdGVtQ2xpY2soZTogTW91c2VFdmVudCwgaW5kZXg6IG51bWJlciwgZjogVEZpbGUpOiB2b2lkIHtcbiAgICAvLyBBIGRyYWcgZW5kcyB3aXRoIGEgY2xpY2sgb24gdGhlIHNsaWRlIGl0IGdyYWJiZWQgXHUyMDE0IHRoYXQgY2xpY2sgbW92ZWQgdGhlXG4gICAgLy8gc2xpZGUsIGl0IGRvZXMgbm90IG9wZW4gaXQuXG4gICAgaWYgKHRoaXMuZHJhZy5jb25zdW1lQ2xpY2soKSkgcmV0dXJuO1xuICAgIGlmIChlLnNoaWZ0S2V5IHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIC8vIFJhbmdlIGFuY2hvcjogdGhlIGxhc3Qgc2VsZWN0ZWQgaXRlbSwgb3IgdGhlIGRpc3BsYXllZCBzbGlkZVxuICAgICAgICAvLyB3aGVuIG5vIHVzYWJsZSBhbmNob3IgZXhpc3RzIChmaXJzdCBTaGlmdCtjbGljayBpbiBhIHNlc3Npb24pLlxuICAgICAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBudWxsO1xuICAgICAgICBjb25zdCBhbmNob3JQYXRoID1cbiAgICAgICAgICB0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLnNvbWUoKGl0KSA9PiBpdC5wYXRoID09PSB0aGlzLmFuY2hvcilcbiAgICAgICAgICAgID8gdGhpcy5hbmNob3JcbiAgICAgICAgICAgIDogYWN0aXZlUGF0aDtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuaXRlbXMuZmluZEluZGV4KChpdCkgPT4gaXQucGF0aCA9PT0gYW5jaG9yUGF0aCk7XG4gICAgICAgIGlmIChhbmNob3JQYXRoICE9PSBudWxsICYmIGZyb20gIT09IC0xKSB7XG4gICAgICAgICAgY29uc3QgW2xvLCBoaV0gPSBmcm9tIDwgaW5kZXggPyBbZnJvbSwgaW5kZXhdIDogW2luZGV4LCBmcm9tXTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gbG87IGkgPD0gaGk7IGkrKykgdGhpcy5zZWxlY3RlZC5hZGQodGhpcy5pdGVtc1tpXS5wYXRoKTtcbiAgICAgICAgICAvLyBUaGUgZGlzcGxheWVkIHNsaWRlIGpvaW5zIGV2ZXJ5IFNoaWZ0IHNlbGVjdGlvbiBcdTIwMTQgZXh0ZW5kaW5nIGFcbiAgICAgICAgICAvLyBzZWxlY3Rpb24gbmV2ZXIgc2lsZW50bHkgZHJvcHMgdGhlIHBhZ2UgeW91IGFyZSBsb29raW5nIGF0LlxuICAgICAgICAgIGlmIChhY3RpdmVQYXRoICE9PSBudWxsICYmIHRoaXMuaXRlbXMuc29tZSgoaXQpID0+IGl0LnBhdGggPT09IGFjdGl2ZVBhdGgpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChhY3RpdmVQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hbmNob3IgPSB0aGlzLml0ZW1zW2luZGV4XS5wYXRoO1xuICAgICAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE1vZCAob3IgU2hpZnQgd2l0aCBubyByZWFjaGFibGUgYW5jaG9yKTogcHVyZSB0b2dnbGUgXHUyMDE0IHRoZSBvbmx5IHdheVxuICAgICAgLy8gdG8gY2FuY2VsIGFuIGl0ZW0gb3V0IG9mIHRoZSBzZWxlY3Rpb24uXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZC5oYXMoZi5wYXRoKSkgdGhpcy5zZWxlY3RlZC5kZWxldGUoZi5wYXRoKTtcbiAgICAgIGVsc2UgdGhpcy5zZWxlY3RlZC5hZGQoZi5wYXRoKTtcbiAgICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgLy8gTm8gc2VsZWN0aW9uIGFmdGVyIGEgcGxhaW4gY2xpY2ssIGJ1dCB0aGUgY2xpY2tlZCBzbGlkZSBzdGF5cyB0aGVcbiAgICAvLyBTaGlmdCtjbGljayBhbmNob3IgXHUyMDE0IG1hdGNoaW5nIHRoZSBmaWxlLWV4cGxvcmVyIGZlZWw6IHBpY2sgYSBzbGlkZSxcbiAgICAvLyB0aGVuIFNoaWZ0K2NsaWNrIGEgbGF0ZXIgb25lIHRvIHNlbGVjdCB0aGUgd2hvbGUgcmFuZ2UgYmV0d2VlbiB0aGVtLlxuICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICB2b2lkIHRoaXMub3BlblNsaWRlKGYpO1xuICB9XG5cbiAgLyoqIFJlZmxlY3QgdGhlIHNlbGVjdGlvbiBzZXQgb24gdGhlIHJlbmRlcmVkIGl0ZW1zIHdpdGhvdXQgYSByZWJ1aWxkICovXG4gIHByaXZhdGUgc3luY1NlbGVjdGlvbkNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtc2VsZWN0ZWRcIiwgdGhpcy5zZWxlY3RlZC5oYXMoaXQucGF0aCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzbGlkZXMgYW4gYWN0aW9uIG9uIGBwYXRoYCBhcHBsaWVzIHRvOiB0aGUgd2hvbGUgc2VsZWN0aW9uIHdoZW4gYHBhdGhgXG4gICAqIGJlbG9uZ3MgdG8gaXQsIG90aGVyd2lzZSBqdXN0IHRoYXQgc2xpZGUuIENoYWluLW9yZGVyZWQsIGFuZCBsaW1pdGVkIHRvXG4gICAqIHRoZSBzbGlkZXMgdGhlIGRlY2sgc3RpbGwgaG9sZHMuXG4gICAqL1xuICBwcml2YXRlIG1vdmluZ0ZvcihwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdGVkLmhhcyhwYXRoKSkgcmV0dXJuIFtwYXRoXTtcbiAgICByZXR1cm4gdGhpcy5sYXN0Q2hhaW4uZmlsdGVyKChwKSA9PiB0aGlzLnNlbGVjdGVkLmhhcyhwKSk7XG4gIH1cblxuICAvKiogQSBkcmFnIHN0YXJ0ZWQgb24gYHBhdGhgOiBhIHNsaWRlIG91dHNpZGUgdGhlIHNlbGVjdGlvbiBpcyBkcmFnZ2VkIGFsb25lICovXG4gIHByaXZhdGUgb25HcmFiKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RlZC5oYXMocGF0aCkgJiYgdGhpcy5zZWxlY3RlZC5zaXplID4gMCkge1xuICAgICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgIH1cbiAgICB0aGlzLmFuY2hvciA9IHBhdGg7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGF0IGRyb3Agd291bGQgYWN0dWFsbHkgcmV3aXJlIHNvbWV0aGluZyAoYSBuby1vcCBoaWRlcyB0aGUgbGluZSkgKi9cbiAgcHJpdmF0ZSB3aWxsQ2hhbmdlKG1vdmluZzogc3RyaW5nW10sIGluc2VydEF0OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBwbGFuID0gcGxhblJlb3JkZXIodGhpcy5sYXN0Q2hhaW4sIG1vdmluZywgaW5zZXJ0QXQpO1xuICAgIHJldHVybiBwbGFuICE9PSBudWxsICYmIHBsYW4ucmV3cml0ZXMubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRoZSBnaXZlbiBzbGlkZXMgb25lIHN0ZXAgdG93YXJkcyBgZGlyZWN0aW9uYCAoY29udGV4dCBtZW51KSAqL1xuICBwcml2YXRlIG1vdmVTdGVwKG1vdmluZzogc3RyaW5nW10sIGRpcmVjdGlvbjogXCJ1cFwiIHwgXCJkb3duXCIpOiB2b2lkIHtcbiAgICBjb25zdCBpbnNlcnRBdCA9IHN0ZXBJbnNlcnRBdCh0aGlzLmxhc3RDaGFpbiwgbW92aW5nLCBkaXJlY3Rpb24pO1xuICAgIGlmIChpbnNlcnRBdCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIHZvaWQgdGhpcy5hcHBseVJlb3JkZXIobW92aW5nLCBpbnNlcnRBdCwgdGhpcy5sYXN0Q2hhaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgbW92ZTogcGxhbiBpdCBhZ2FpbnN0IHRoZSBsaXZlIGNoYWluLCB0aGVuIGxldCB0aGUgZGVjayBzZXJ2aWNlXG4gICAqIHJld2lyZSB0aGUgYGRlY2tgIGxpbmtzIG9mIHRoZSBzbGlkZXMgd2hvc2UgbmV4dCBsaW5rIGNoYW5nZXMuIGBzbmFwc2hvdGBcbiAgICogaXMgdGhlIGNoYWluIHRoZSBnZXN0dXJlIChvciB0aGUgbWVudSBhY3Rpb24pIHdhcyBjb21wdXRlZCBhZ2FpbnN0IFx1MjAxNCB3aGVuXG4gICAqIHRoZSBkZWNrIGNoYW5nZWQgbWVhbndoaWxlIHRoZSBnYXAgaW5kZXggbWVhbnMgbm90aGluZywgc28gdGhlIG1vdmUgaXNcbiAgICogZHJvcHBlZCByYXRoZXIgdGhhbiBhcHBsaWVkIHRvIGEgZGVjayBpdCBubyBsb25nZXIgZGVzY3JpYmVzLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBhcHBseVJlb3JkZXIoXG4gICAgbW92aW5nOiBzdHJpbmdbXSxcbiAgICBpbnNlcnRBdDogbnVtYmVyLFxuICAgIHNuYXBzaG90OiBzdHJpbmdbXSxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY2hhaW4gPSB0aGlzLmxpdmVDaGFpbih0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKTtcbiAgICBpZiAoIWNoYWluRXF1YWxzKGNoYWluLCBzbmFwc2hvdCkpIHJldHVybjtcbiAgICBjb25zdCBwbGFuID0gcGxhblJlb3JkZXIoY2hhaW4sIG1vdmluZywgaW5zZXJ0QXQpO1xuICAgIGlmICghcGxhbiB8fCBwbGFuLnJld3JpdGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuOyAvLyBub3RoaW5nIG1vdmVkIFx1MjAxNCB3cml0ZSBub3RoaW5nXG5cbiAgICBjb25zdCBhcHBsaWVkID0gYXdhaXQgdGhpcy5ydW5SZW9yZGVyKHBsYW4pO1xuICAgIC8vIEEgY29tcGxldGUgcnVuIHJlLWJhc2VzIHRoZSBuYXZpZ2F0aW9uIHNlc3Npb24gb24gdGhlIHJlb3JkZXJlZCBjaGFpbidzXG4gICAgLy8gaGVhZC4gQSBmYWlsZWQgb25lIGxlYXZlcyBhIG1peGVkIG9yZGVyIGJlaGluZCwgYW5kIHRoZSBoZWFkIHRoZSBzZXNzaW9uXG4gICAgLy8gZW50ZXJlZCBtYXkgbm93IHNpdCBtaWQtY2hhaW4gXHUyMDE0IGZvcmdldHRpbmcgdGhlIGhpbnQgaXMgd2hhdCBsZXRzIHRoZSBuZXh0XG4gICAgLy8gcmVzb2x1dGlvbiBmaW5kIHRoZSBkZWNrJ3MgcmVhbCBoZWFkIGFnYWluLlxuICAgIHRoaXMucGx1Z2luLnJlbWVtYmVyRGVja0hlYWQoYXBwbGllZCA/IChwbGFuLmNoYWluWzBdID8/IG51bGwpIDogbnVsbCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBSdW4gYSByZW9yZGVyIHdpdGggdGhlIHBhbmVsJ3MgcmUtcmVuZGVyaW5nIGhlbGQgYmFjayBmb3IgaXRzIGR1cmF0aW9uICovXG4gIHByaXZhdGUgYXN5bmMgcnVuUmVvcmRlcihwbGFuOiBSZW9yZGVyUGxhbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHRoaXMud3JpdGluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlUmVvcmRlcihwbGFuKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy53cml0aW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJpZ2h0LWNsaWNrIG1lbnUgb24gb25lIGl0ZW07IG9wZXJhdGVzIG9uIHRoZSB3aG9sZSBzZWxlY3Rpb24gd2hlbiBpdCBiZWxvbmdzIHRvIG9uZSAqL1xuICBwcml2YXRlIG9wZW5Db250ZXh0TWVudShlOiBNb3VzZUV2ZW50LCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuICAgIGNvbnN0IG1vdmluZyA9IHRoaXMubW92aW5nRm9yKGYucGF0aCk7XG4gICAgY29uc3Qgd2hhdCA9IG1vdmluZy5sZW5ndGggPiAxID8gYCR7bW92aW5nLmxlbmd0aH0gc2xpZGVzYCA6IFwic2xpZGVcIjtcblxuICAgIC8vIE1vdmUgdXAgLyBkb3duIGFjdCBvbiBleGFjdGx5IHRoZSBzZXQgYSBkcmFnIHdvdWxkIG1vdmUsIHNvIGEgc2VsZWN0aW9uXG4gICAgLy8gc3RheXMgYSBibG9jazsgZWFjaCBpcyBkaXNhYmxlZCB3aGVuIHRoYXQgc2V0IGFscmVhZHkgc2l0cyBhdCBpdHMgZW5kLlxuICAgIGNvbnN0IHVwID0gc3RlcEluc2VydEF0KHRoaXMubGFzdENoYWluLCBtb3ZpbmcsIFwidXBcIik7XG4gICAgY29uc3QgZG93biA9IHN0ZXBJbnNlcnRBdCh0aGlzLmxhc3RDaGFpbiwgbW92aW5nLCBcImRvd25cIik7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShgTW92ZSAke3doYXR9IHVwYClcbiAgICAgICAgLnNldEljb24oXCJhcnJvdy11cFwiKVxuICAgICAgICAuc2V0RGlzYWJsZWQodXAgPT09IG51bGwpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMubW92ZVN0ZXAobW92aW5nLCBcInVwXCIpKSxcbiAgICApO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUoYE1vdmUgJHt3aGF0fSBkb3duYClcbiAgICAgICAgLnNldEljb24oXCJhcnJvdy1kb3duXCIpXG4gICAgICAgIC5zZXREaXNhYmxlZChkb3duID09PSBudWxsKVxuICAgICAgICAub25DbGljaygoKSA9PiB0aGlzLm1vdmVTdGVwKG1vdmluZywgXCJkb3duXCIpKSxcbiAgICApO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUoXCJDcmVhdGUgbmV4dCBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInBsdXNcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdm9pZCB0aGlzLmNyZWF0ZU5leHRBZnRlcihmKSksXG4gICAgKTtcbiAgICBtZW51LmFkZEl0ZW0oKG1pKSA9PlxuICAgICAgbWlcbiAgICAgICAgLnNldFRpdGxlKG1vdmluZy5sZW5ndGggPiAxID8gYERlbGV0ZSAke21vdmluZy5sZW5ndGh9IHNsaWRlc2AgOiBcIkRlbGV0ZSBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInRyYXNoXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMuZGVsZXRlU2xpZGVzKG1vdmluZykpLFxuICAgICk7XG4gICAgbWVudS5zaG93QXRNb3VzZUV2ZW50KGUpO1xuICB9XG5cbiAgLyoqIENyZWF0ZSBhIHNsaWRlIGFmdGVyIHRoZSByaWdodC1jbGlja2VkIG9uZSAod2l0aG91dCBvcGVuaW5nIGl0KSAqL1xuICBwcml2YXRlIGFzeW5jIGNyZWF0ZU5leHRBZnRlcihmOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBsYW4gPSB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmKTtcbiAgICBpZiAoIXBsYW4pIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlQ3JlYXRlTmV4dChmLCBwbGFuLCBmYWxzZSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBDb25maXJtLCB0aGVuIHRyYXNoIHRoZSBnaXZlbiBzbGlkZXMgYW5kIHNwbGljZSB0aGVtIG91dCBvZiB0aGUgY2hhaW4gKi9cbiAgcHJpdmF0ZSBkZWxldGVTbGlkZXMocGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IHJ1biA9ICgpOiB2b2lkID0+IHZvaWQgdGhpcy5ydW5EZWxldGlvbihwYXRocyk7XG5cbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpIHtcbiAgICAgIHJ1bigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuYW1lcyA9IHBhdGhzLm1hcCgocCkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwKTtcbiAgICAgIHJldHVybiBmIGluc3RhbmNlb2YgVEZpbGUgPyBmLmJhc2VuYW1lIDogcDtcbiAgICB9KTtcbiAgICBuZXcgQ29uZmlybURlbGV0ZU1vZGFsKHRoaXMuYXBwLCBuYW1lcywgcnVuLCBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzID0gZmFsc2U7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJ1bkRlbGV0aW9uKHBhdGhzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IG51bGw7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICAgIHRoaXMubGFzdENoYWluLFxuICAgICAgbmV3IFNldChwYXRocyksXG4gICAgICBhY3RpdmVQYXRoLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgcGF0aHMpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIGlmICh0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiBwYXRocy5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQubGFuZGluZ1BhdGgpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmVzdWx0LmxhbmRpbmdQYXRoKTtcbiAgICAgIGlmIChmIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMub3BlblNsaWRlKGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqIE9wZW4gYSBzbGlkZSBpbiBhIG1hcmtkb3duIGxlYWYgKG5ldmVyIGluIHRoaXMgcGFuZWwncyBvd24gbGVhZikgKi9cbiAgcHJpdmF0ZSBhc3luYyBvcGVuU2xpZGUoZjogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsZWFmID1cbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoXCJtYXJrZG93blwiKVswXSA/PyB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGYpO1xuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHsgZm9jdXM6IHRydWUgfSk7XG4gIH1cbn1cblxuLyoqIE9yZGVyLXNlbnNpdGl2ZSBjaGFpbiBjb21wYXJpc29uICovXG5mdW5jdGlvbiBjaGFpbkVxdWFscyhhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KChwLCBpKSA9PiBwID09PSBiW2ldKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBNYXggbmFtZXMgc2hvd24gaW4gdGhlIGRpYWxvZyBiZWZvcmUgY29sbGFwc2luZyBpbnRvIGEgXCIrTiBtb3JlXCIgbGluZSAqL1xuY29uc3QgTUFYX1ZJU0lCTEVfTkFNRVMgPSA4O1xuXG4vKipcbiAqIENvbmZpcm1hdGlvbiBkaWFsb2cgZm9yIERlbGV0ZSBzbGlkZXMuIExpc3RzIHRoZSBub3RlcyBhYm91dCB0byBiZVxuICogdHJhc2hlZCAobnVtYmVyZWQgbGlrZSB0aGUgcGFuZWwsIHNvIHRoZSB1c2VyIGNhbiBtYXAgdGhlbSAxOjEpLCBvZmZlcnNcbiAqIGEgXCJkb24ndCBhc2sgYWdhaW5cIiB0b2dnbGUgdGhhdCBmbGlwcyB0aGUgYGNvbmZpcm1EZWxldGVTbGlkZXNgIHNldHRpbmdcbiAqIG9mZiAocGVyc2lzdGVkIGJ5IHRoZSBjYWxsZXIgdmlhIG9uRG9udEFzayksIGFuZCBhc2tzIGZvciBhbiBleHBsaWNpdFxuICogQ2FuY2VsIC8gRGVsZXRlIGRlY2lzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlybURlbGV0ZU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGNvbmZpcm1lZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFwcDogQXBwLFxuICAgIHByaXZhdGUgbmFtZXM6IHN0cmluZ1tdLFxuICAgIHByaXZhdGUgb25Db25maXJtOiAoKSA9PiB2b2lkLFxuICAgIHByaXZhdGUgb25Eb250QXNrOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICApIHtcbiAgICBzdXBlcihhcHApO1xuICB9XG5cbiAgb25PcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5tb2RhbEVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZVwiKTtcblxuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5uYW1lcy5sZW5ndGg7XG4gICAgdGhpcy5jb250ZW50RWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS10aXRsZVwiLFxuICAgICAgdGV4dDogY291bnQgPT09IDEgPyBcIkRlbGV0ZSB0aGlzIHNsaWRlP1wiIDogYERlbGV0ZSAke2NvdW50fSBzbGlkZXM/YCxcbiAgICB9KTtcbiAgICB0aGlzLmNvbnRlbnRFbFxuICAgICAgLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXN1YlwiIH0pXG4gICAgICAuc2V0VGV4dChcbiAgICAgICAgY291bnQgPT09IDFcbiAgICAgICAgICA/IFwiVGhlIG5vdGUgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCJcbiAgICAgICAgICA6IFwiVGhlc2Ugbm90ZXMgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCIsXG4gICAgICApO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWxpc3RcIiB9KTtcbiAgICBmb3IgKGNvbnN0IFtpLCBuYW1lXSBvZiB0aGlzLm5hbWVzLnNsaWNlKDAsIE1BWF9WSVNJQkxFX05BTUVTKS5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW51bVwiIH0pLnNldFRleHQoU3RyaW5nKGkgKyAxKSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW5hbWVcIiB9KS5zZXRUZXh0KG5hbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lcy5sZW5ndGggPiBNQVhfVklTSUJMRV9OQU1FUykge1xuICAgICAgbGlzdFxuICAgICAgICAuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbW9yZVwiIH0pXG4gICAgICAgIC5zZXRUZXh0KGBcdTIwMjYgYW5kICR7dGhpcy5uYW1lcy5sZW5ndGggLSBNQVhfVklTSUJMRV9OQU1FU30gbW9yZWApO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGREb250QXNrUm93KCk7XG4gICAgdGhpcy5idWlsZEFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKiBDb21wYWN0IGxlZnQtYWxpZ25lZCBcImRvbid0IGFzayBhZ2FpblwiIGNoZWNrYm94IHJvdyAqL1xuICBwcml2YXRlIGJ1aWxkRG9udEFza1JvdygpOiB2b2lkIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1kb250YXNrXCIgfSk7XG4gICAgcm93LmNyZWF0ZUVsKFwibGFiZWxcIikuc2V0VGV4dChcIkRvbid0IGFzayBhZ2FpblwiKTtcbiAgICBjb25zdCBjaGVja2JveCA9IHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdm9pZCB0aGlzLm9uRG9udEFzaygpLnRoZW4oXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBjaGVja2JveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICAvLyBrZWVwIHRoZSBjaGVja2JveCBlbmFibGVkIGlmIHBlcnNpc3RpbmcgdGhlIHByZWZlcmVuY2UgZmFpbGVkXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJpZ2h0LWFsaWduZWQgQ2FuY2VsIC8gRGVsZXRlIGJ1dHRvbiByb3cgKi9cbiAgcHJpdmF0ZSBidWlsZEFjdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWFjdGlvbnNcIiB9KTtcbiAgICBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxcIiB9KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICBhY3Rpb25zXG4gICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkRlbGV0ZVwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBvbkNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbmZpcm1lZCkgdGhpcy5vbkNvbmZpcm0oKTtcbiAgfVxufVxuIiwgIi8qKlxuICogcGFuZWwtZHJhZy50cyBcdTIwMTQgdGhlIHBvaW50ZXIgZ2VzdHVyZSBiZWhpbmQgXCJkcmFnIGEgc2xpZGUgdG8gcmVvcmRlciBpdFwiLlxuICpcbiAqIFRoZSBzbGlkZXMgcGFuZWwgb3ducyB0aGUgZGVjayBtb2RlbCAod2hhdCBhIGRyb3AgKm1lYW5zKik7IHRoaXMgbW9kdWxlIG93bnNcbiAqIG9ubHkgdGhlIGdlc3R1cmU6IGl0IGRlY2lkZXMgd2hlbiBhIHByZXNzIGJlY29tZXMgYSBkcmFnLCBwYWludHMgdGhlIGdob3N0XG4gKiBhbmQgdGhlIGluc2VydGlvbiBsaW5lLCBzY3JvbGxzIHRoZSBsaXN0IHdoZW4gdGhlIHBvaW50ZXIgcmVhY2hlcyBpdHMgZWRnZSxcbiAqIGFuZCBoYW5kcyB0aGUgcGFuZWwgYSBzaW5nbGUgY29tbWl0IFx1MjAxNCBgb25Ecm9wKG1vdmluZywgaW5zZXJ0QXQsIHNuYXBzaG90KWAuXG4gKiBJdCBuZXZlciB3cml0ZXMgdG8gdGhlIHZhdWx0IGFuZCBrbm93cyBub3RoaW5nIGFib3V0IGBkZWNrYCBsaW5rcy5cbiAqXG4gKiBPYnNpZGlhbidzIHB1YmxpYyBBUEkgaGFzIG5vIGRyYWctdG8tcmVvcmRlciBoZWxwZXIgYSBjdXN0b20gdmlldyBjb3VsZCB1c2VcbiAqICh0aGUgZGVjbGFyYXRpdmUgc2V0dGluZ3MgbGlzdCdzIGBvblJlb3JkZXJgIHJlbmRlcnMgaW5zaWRlIHRoZSBzZXR0aW5nc1xuICogbW9kYWwgb25seSksIHNvIHRoZSBnZXN0dXJlIGlzIGJ1aWx0IG9uIHBvaW50ZXIgZXZlbnRzOiBgcG9pbnRlcmRvd25gIG9uIGFuXG4gKiBpdGVtLCBhIG1vdmVtZW50IHRocmVzaG9sZCBiZWZvcmUgYW55dGhpbmcgaGFwcGVucyAoYSBwbGFpbiBwcmVzcyBtdXN0IHN0YXlcbiAqIGEgcGxhaW4gY2xpY2ssIHdoaWNoIG9wZW5zIHRoZSBzbGlkZSksIHRoZW4gYHBvaW50ZXJtb3ZlYCAvIGBwb2ludGVydXBgIC9cbiAqIGBwb2ludGVyY2FuY2VsYCBvbiBgZG9jdW1lbnRgLCB3aXRoIGBFc2NhcGVgIGFuZCB3aW5kb3cgYmx1ciBhcyBjYW5jZWxzLlxuICpcbiAqIFR3byBkZXRhaWxzIGFyZSBsb2FkLWJlYXJpbmc6XG4gKiAgIC0gdGhlICoqaW5zZXJ0aW9uIGxpbmUqKiBpcyBoaWRkZW4gd2hlbiB0aGUgZHJvcCB3b3VsZCBub3QgY2hhbmdlIHRoZVxuICogICAgIG9yZGVyIChgd2lsbENoYW5nZWApLCBzbyBhIG5vLW9wIGRyb3AgcmVhZHMgYXMgYSBuby1vcCAqYmVmb3JlKiB0aGVcbiAqICAgICBidXR0b24gaXMgcmVsZWFzZWQ7XG4gKiAgIC0gdGhlIGRyb3AgY2FycmllcyB0aGUgKipjaGFpbiBzbmFwc2hvdCoqIHRoZSBnZXN0dXJlIHN0YXJ0ZWQgb24sIHNvIHRoZVxuICogICAgIHBhbmVsIGNhbiByZWZ1c2UgYSBkcm9wIHdob3NlIGdhcCBpbmRleCBubyBsb25nZXIgZGVzY3JpYmVzIHRoZSBkZWNrXG4gKiAgICAgKHRoZSBkZWNrIGNhbiBjaGFuZ2UgdW5kZXIgdGhlIGdlc3R1cmUgXHUyMDE0IGFuIGVkaXQgaW4gYW5vdGhlciBwYW5lLCBhXG4gKiAgICAgcmVuYW1lLCBhIGRlbGV0ZSkuXG4gKi9cblxuLyoqIFB4IHRoZSBwb2ludGVyIG11c3QgdHJhdmVsIGJlZm9yZSBhIHByZXNzIGNvdW50cyBhcyBhIGRyYWcgcmF0aGVyIHRoYW4gYSBjbGljayAqL1xuY29uc3QgRFJBR19USFJFU0hPTEQgPSA0O1xuLyoqIFB4IGJhbmQgYXQgdGhlIGxpc3QncyB0b3AvYm90dG9tIGVkZ2UgdGhhdCBzY3JvbGxzIHdoaWxlIHRoZSBwb2ludGVyIHNpdHMgaW4gaXQgKi9cbmNvbnN0IEVER0VfQkFORCA9IDI0O1xuLyoqIFB4IHNjcm9sbGVkIHBlciBhbmltYXRpb24gZnJhbWUgd2hpbGUgdGhlIHBvaW50ZXIgc2l0cyBpbiBhbiBlZGdlIGJhbmQgKi9cbmNvbnN0IEVER0VfU1BFRUQgPSA4O1xuXG4vKiogQSByZW5kZXJlZCBzbGlkZSBvZiB0aGUgbGlzdCAqL1xuZXhwb3J0IGludGVyZmFjZSBEcmFnSXRlbSB7XG4gIHBhdGg6IHN0cmluZztcbiAgZWw6IEhUTUxFbGVtZW50O1xufVxuXG4vKiogV2hhdCB0aGUgZ2VzdHVyZSBuZWVkcyBmcm9tIHRoZSBwYW5lbCwgd2hpY2ggb3ducyB0aGUgZGVjayBtb2RlbCAqL1xuZXhwb3J0IGludGVyZmFjZSBEcmFnSG9zdCB7XG4gIC8qKlxuICAgKiBUaGUgcmVuZGVyZWQgc2xpZGVzLCAqKmluZGV4LWFsaWduZWQgd2l0aCB0aGUgY2hhaW4qKiAoaXRlbSBgaWAgaXMgc2xpZGVcbiAgICogYGlgKSBcdTIwMTQgdGhlIGdlc3R1cmUgcmVhZHMgdGhlIGdlb21ldHJ5IGZyb20gdGhlc2UgZWxlbWVudHMuIE5ldmVyIG11dGF0ZWRcbiAgICogYnkgdGhlIGdlc3R1cmUuXG4gICAqL1xuICBpdGVtcygpOiByZWFkb25seSBEcmFnSXRlbVtdO1xuICAvKiogVGhlIHNsaWRlcyBhIGdyYWIgb24gYHBhdGhgIG1vdmVzOiB0aGUgc2VsZWN0aW9uIGJsb2NrLCBvciB0aGF0IHNsaWRlIGFsb25lICovXG4gIG1vdmluZ0ZvcihwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXTtcbiAgLyoqIFRoZSBzY3JvbGxhYmxlIGxpc3QgZWxlbWVudCAoZWRnZSBhdXRvLXNjcm9sbCkgKi9cbiAgY29udGFpbmVyKCk6IEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgLyoqIFRoZSB1c2VyIGdyYWJiZWQgYHBhdGhgOiB0aGUgcGFuZWwgZHJvcHMgYSBzZWxlY3Rpb24gaXQgaXMgbm90IHBhcnQgb2YgKi9cbiAgb25HcmFiKHBhdGg6IHN0cmluZyk6IHZvaWQ7XG4gIC8qKiBXaGV0aGVyIHRoYXQgZHJvcCB3b3VsZCBjaGFuZ2UgdGhlIG9yZGVyIChhIG5vLW9wIGhpZGVzIHRoZSBpbnNlcnRpb24gbGluZSkgKi9cbiAgd2lsbENoYW5nZShtb3Zpbmc6IHN0cmluZ1tdLCBpbnNlcnRBdDogbnVtYmVyKTogYm9vbGVhbjtcbiAgLyoqIENvbW1pdCBhIGRyb3A7IGBzbmFwc2hvdGAgaXMgdGhlIGNoYWluIHRoZSBnZXN0dXJlIHN0YXJ0ZWQgb24gKi9cbiAgb25Ecm9wKG1vdmluZzogc3RyaW5nW10sIGluc2VydEF0OiBudW1iZXIsIHNuYXBzaG90OiBzdHJpbmdbXSk6IHZvaWQ7XG59XG5cbi8qKiBHZXN0dXJlIHN0YXRlLCBjcmVhdGVkIG9uY2UgdGhlIHBvaW50ZXIgcGFzc2VzIHRoZSB0aHJlc2hvbGQgKi9cbmludGVyZmFjZSBEcmFnU3RhdGUge1xuICAvKiogVGhlIHNsaWRlcyBiZWluZyBtb3ZlZCwgaW4gY2hhaW4gb3JkZXIgKi9cbiAgbW92aW5nOiBzdHJpbmdbXTtcbiAgLyoqIFRoZSByZW5kZXJlZCBjaGFpbiB3aGVuIHRoZSBnZXN0dXJlIHN0YXJ0ZWQgKHRoZSBkcm9wJ3MgZnJhbWUgb2YgcmVmZXJlbmNlKSAqL1xuICBjaGFpbjogc3RyaW5nW107XG4gIC8qKiBQb2ludGVyIHkgb2YgdGhlIGxhc3QgbW92ZSBcdTIwMTQgdGhlIGdob3N0IGFuZCB0aGUgaW5zZXJ0aW9uIGxpbmUgZm9sbG93IGl0ICovXG4gIHk6IG51bWJlcjtcbiAgLyoqIE9mZnNldCBvZiB0aGUgcG9pbnRlciBpbnNpZGUgdGhlIGdyYWJiZWQgaXRlbSwga2VwdCBieSB0aGUgZ2hvc3QgKi9cbiAgb2Zmc2V0WTogbnVtYmVyO1xuICAvKiogVGhlIGdhcCB0aGUgZHJvcCB3b3VsZCBsYW5kIGluLCByZWNvbXB1dGVkIGJ5IGV2ZXJ5IHBhaW50ICovXG4gIGluc2VydEF0OiBudW1iZXI7XG4gIC8qKiBDbG9uZSBvZiB0aGUgZ3JhYmJlZCBpdGVtIHRoYXQgZm9sbG93cyB0aGUgcG9pbnRlciAqL1xuICBnaG9zdDogSFRNTEVsZW1lbnQgfCBudWxsO1xuICAvKiogVGhlIDJweCBsaW5lIG1hcmtpbmcgdGhlIGRyb3AgZ2FwICovXG4gIGxpbmU6IEhUTUxFbGVtZW50O1xuICAvKiogSGFuZGxlIG9mIHRoZSBhdXRvLXNjcm9sbCBhbmltYXRpb24gZnJhbWUgKi9cbiAgcmFmOiBudW1iZXI7XG59XG5cbi8qKiBEcmFnLXRvLXJlb3JkZXIgZ2VzdHVyZSBmb3IgYSBsaXN0IG9mIHJlbmRlcmVkIGl0ZW1zICovXG5leHBvcnQgY2xhc3MgUGFuZWxEcmFnIHtcbiAgLyoqIEEgcHJlc3MgdGhhdCBoYXMgbm90IHRyYXZlbGxlZCBmYXIgZW5vdWdoIHRvIGJlIGEgZHJhZyB5ZXQgKi9cbiAgcHJpdmF0ZSBwcmVzczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgcGF0aDogc3RyaW5nIH0gfCBudWxsID0gbnVsbDtcbiAgLyoqIFRoZSBkcmFnIGluIGZsaWdodCwgb3IgbnVsbCB3aGlsZSB0aGUgcHJlc3MgaXMgc3RpbGwgYSBjYW5kaWRhdGUgKi9cbiAgcHJpdmF0ZSBzdGF0ZTogRHJhZ1N0YXRlIHwgbnVsbCA9IG51bGw7XG4gIC8qKiBXaGV0aGVyIHRoZSBsYXN0IGZpbmlzaGVkIGdlc3R1cmUgd2FzIGEgZHJhZyBcdTIwMTQgc3dhbGxvd3MgdGhlIGNsaWNrIGl0IGVuZHMgd2l0aCAqL1xuICBwcml2YXRlIGRyYWdnZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGhvc3Q6IERyYWdIb3N0KSB7fVxuXG4gIC8qKiBXaGV0aGVyIGEgZHJhZyBpcyBpbiBmbGlnaHQgKHRoZSBwYW5lbCBzdXNwZW5kcyByZS1yZW5kZXJpbmcgbWVhbndoaWxlKSAqL1xuICBnZXQgYWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIEFiYW5kb24gdGhlIGdlc3R1cmUgXHUyMDE0IHRoZSB2aWV3IGlzIGNsb3NpbmcgdW5kZXIgaXQgKi9cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuZmluaXNoKHRydWUpO1xuICB9XG5cbiAgLyoqIEEgcHJlc3Mgb24gYW4gaXRlbTsgaXQgYmVjb21lcyBhIGRyYWcgb25jZSB0aGUgcG9pbnRlciB0cmF2ZWxzIGZhciBlbm91Z2ggKi9cbiAgYmVnaW4oZXZlbnQ6IFBvaW50ZXJFdmVudCwgcGF0aDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCB8fCB0aGlzLnByZXNzIHx8IHRoaXMuc3RhdGUpIHJldHVybjtcbiAgICBpZiAodGhpcy5ob3N0Lml0ZW1zKCkubGVuZ3RoIDwgMikgcmV0dXJuOyAvLyBhIGxvbmUgc2xpZGUgaGFzIG5vd2hlcmUgdG8gZ29cbiAgICB0aGlzLmRyYWdnZWQgPSBmYWxzZTtcbiAgICB0aGlzLnByZXNzID0geyB4OiBldmVudC5jbGllbnRYLCB5OiBldmVudC5jbGllbnRZLCBwYXRoIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMub25Nb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMub25VcCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgdGhpcy5vbkNhbmNlbCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5vbktleSwgdHJ1ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMub25DYW5jZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNsaWNrIHRoYXQgZW5kcyB0aGlzIGdlc3R1cmUgYmVsb25ncyB0byBhIGRyYWcuIFRydWUgYXQgbW9zdFxuICAgKiBvbmNlIHBlciBkcmFnLCBzbyBhIGRyYWcgZG9lcyBub3QgYWxzbyBvcGVuIHRoZSBzbGlkZSBpdCBtb3ZlZDsgYSBwbGFpblxuICAgKiBwcmVzcy1yZWxlYXNlIG5ldmVyIHNldHMgaXQuXG4gICAqL1xuICBjb25zdW1lQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZHJhZ2dlZCA9IHRoaXMuZHJhZ2dlZDtcbiAgICB0aGlzLmRyYWdnZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gZHJhZ2dlZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgb25Nb3ZlID0gKGV2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBwcmVzcyA9IHRoaXMucHJlc3M7XG4gICAgaWYgKCFwcmVzcykgcmV0dXJuO1xuICAgIGlmICghdGhpcy5zdGF0ZSkge1xuICAgICAgaWYgKE1hdGguaHlwb3QoZXZlbnQuY2xpZW50WCAtIHByZXNzLngsIGV2ZW50LmNsaWVudFkgLSBwcmVzcy55KSA8IERSQUdfVEhSRVNIT0xEKSByZXR1cm47XG4gICAgICB0aGlzLnN0YXJ0KGV2ZW50LCBwcmVzcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhdGUueSA9IGV2ZW50LmNsaWVudFk7XG4gICAgdGhpcy5wYWludCgpO1xuICB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgb25VcCA9ICgpOiB2b2lkID0+IHRoaXMuZmluaXNoKGZhbHNlKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IG9uQ2FuY2VsID0gKCk6IHZvaWQgPT4gdGhpcy5maW5pc2godHJ1ZSk7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBvbktleSA9IChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHRoaXMuZmluaXNoKHRydWUpO1xuICB9O1xuXG4gIC8qKiBUdXJuIHRoZSBjYW5kaWRhdGUgcHJlc3MgaW50byBhIGRyYWc6IGdob3N0LCBkaW1tZWQgaXRlbXMsIGluc2VydGlvbiBsaW5lICovXG4gIHByaXZhdGUgc3RhcnQoZXZlbnQ6IFBvaW50ZXJFdmVudCwgcHJlc3M6IHsgeTogbnVtYmVyOyBwYXRoOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgIGNvbnN0IG1vdmluZyA9IHRoaXMuaG9zdC5tb3ZpbmdGb3IocHJlc3MucGF0aCk7XG4gICAgaWYgKG1vdmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZmluaXNoKHRydWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdyYWJiZWQgPSB0aGlzLmhvc3QuaXRlbXMoKS5maW5kKChpdCkgPT4gaXQucGF0aCA9PT0gcHJlc3MucGF0aCk7XG4gICAgY29uc3QgcmVjdCA9IGdyYWJiZWQ/LmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxpbmUgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1kcm9wLWxpbmVcIiB9KTtcbiAgICBsaW5lLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IFwibm9uZVwiIH0pO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICBsZXQgZ2hvc3Q6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKGdyYWJiZWQgJiYgcmVjdCkge1xuICAgICAgZ2hvc3QgPSBncmFiYmVkLmVsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGdob3N0LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy1hY3RpdmVcIiwgXCJpcy1zZWxlY3RlZFwiLCBcImlzLWRyYWdnaW5nXCIpO1xuICAgICAgZ2hvc3QuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWRyYWctZ2hvc3RcIik7XG4gICAgICBnaG9zdC5zZXRDc3NTdHlsZXMoe1xuICAgICAgICBsZWZ0OiBgJHtyZWN0LmxlZnR9cHhgLFxuICAgICAgICB0b3A6IGAke3JlY3QudG9wfXB4YCxcbiAgICAgICAgd2lkdGg6IGAke3JlY3Qud2lkdGh9cHhgLFxuICAgICAgfSk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGdob3N0KTtcbiAgICB9XG5cbiAgICBjb25zdCBtb3ZpbmdTZXQgPSBuZXcgU2V0KG1vdmluZyk7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaG9zdC5pdGVtcygpKSB7XG4gICAgICBpZiAobW92aW5nU2V0LmhhcyhpdGVtLnBhdGgpKSBpdGVtLmVsLmFkZENsYXNzKFwiaXMtZHJhZ2dpbmdcIik7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLWRyYWdnaW5nXCIpO1xuICAgIC8vIEEgcHJlc3MgbWF5IGFscmVhZHkgaGF2ZSBzdGFydGVkIHNlbGVjdGluZyB0ZXh0IFx1MjAxNCBhIGRyYWcgaXMgbm90IGEgc2VsZWN0aW9uXG4gICAgd2luZG93LmdldFNlbGVjdGlvbigpPy5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICB0aGlzLmhvc3Qub25HcmFiKHByZXNzLnBhdGgpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1vdmluZyxcbiAgICAgIGNoYWluOiB0aGlzLmhvc3QuaXRlbXMoKS5tYXAoKGl0KSA9PiBpdC5wYXRoKSxcbiAgICAgIHk6IGV2ZW50LmNsaWVudFksXG4gICAgICBvZmZzZXRZOiByZWN0ID8gZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIDogMCxcbiAgICAgIGluc2VydEF0OiAwLFxuICAgICAgZ2hvc3QsXG4gICAgICBsaW5lLFxuICAgICAgcmFmOiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc2Nyb2xsVGljayksXG4gICAgfTtcbiAgICB0aGlzLnBhaW50KCk7XG4gIH1cblxuICAvKiogRW5kIHRoZSBnZXN0dXJlOiBjb21taXQgYSByZWFsIGRyb3AsIG9yIGNsZWFuIHVwIGFmdGVyIGEgY2FuY2VsICovXG4gIHByaXZhdGUgZmluaXNoKGNhbmNlbGxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLnByZXNzID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gbnVsbDtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5vbk1vdmUpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5vblVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcmNhbmNlbFwiLCB0aGlzLm9uQ2FuY2VsKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5LCB0cnVlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5vbkNhbmNlbCk7XG4gICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuXG4gICAgLy8gRXZlbiBhIGNhbmNlbGxlZCBkcmFnIG11c3Qgc3dhbGxvdyBpdHMgY2xpY2s6IHJlbGVhc2luZyB0aGUgYnV0dG9uIGFmdGVyXG4gICAgLy8gRXNjYXBlIHdvdWxkIG90aGVyd2lzZSBvcGVuIHRoZSBzbGlkZSB0aGF0IHdhcyBkcmFnZ2VkLlxuICAgIHRoaXMuZHJhZ2dlZCA9IHRydWU7XG4gICAgc3RhdGUuZ2hvc3Q/LnJlbW92ZSgpO1xuICAgIHN0YXRlLmxpbmUucmVtb3ZlKCk7XG4gICAgY29uc3QgbW92aW5nU2V0ID0gbmV3IFNldChzdGF0ZS5tb3ZpbmcpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmhvc3QuaXRlbXMoKSkge1xuICAgICAgaWYgKG1vdmluZ1NldC5oYXMoaXRlbS5wYXRoKSkgaXRlbS5lbC5yZW1vdmVDbGFzcyhcImlzLWRyYWdnaW5nXCIpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNsYXNzKFwibmF0aXZlLXNsaWRlcy1kcmFnZ2luZ1wiKTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoc3RhdGUucmFmKTtcblxuICAgIGlmICghY2FuY2VsbGVkKSB0aGlzLmhvc3Qub25Ecm9wKHN0YXRlLm1vdmluZywgc3RhdGUuaW5zZXJ0QXQsIHN0YXRlLmNoYWluKTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRoZSBnaG9zdCB0byB0aGUgcG9pbnRlciBhbmQgdGhlIGluc2VydGlvbiBsaW5lIHRvIHRoZSBuZWFyZXN0IGdhcCAqL1xuICBwcml2YXRlIHBhaW50KCk6IHZvaWQge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoIXN0YXRlKSByZXR1cm47XG5cbiAgICAvLyBSZWFkIGV2ZXJ5IHJlY3QgQkVGT1JFIHdyaXRpbmcgdGhlIGdob3N0J3MgcG9zaXRpb246IGEgd3JpdGUgZmlyc3Qgd291bGRcbiAgICAvLyBtYWtlIGVhY2ggb2YgdGhlc2UgcmVhZHMgZm9yY2UgYSBzeW5jaHJvbm91cyBsYXlvdXQgb2YgdGhlIHBhbmVsLlxuICAgIC8vIFRoZSBnYXBzIGFyZSB0aGUgaXRlbXMnIGVkZ2VzIFx1MjAxNCB0aGUgdG9wIG9mIGVhY2ggc2xpZGUsIHBsdXMgdGhlIGJvdHRvbSBvZlxuICAgIC8vIHRoZSBsYXN0IG9uZSAod2hpY2ggY2xvc2VzIHRoZSBsaXN0KS5cbiAgICBjb25zdCByZWN0cyA9IHRoaXMuaG9zdC5pdGVtcygpLm1hcCgoaXQpID0+IGl0LmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBjb25zdCBlZGdlcyA9IHJlY3RzLm1hcCgocmVjdCkgPT4gcmVjdC50b3ApO1xuICAgIGNvbnN0IGxhc3QgPSByZWN0c1tyZWN0cy5sZW5ndGggLSAxXTtcbiAgICBpZiAobGFzdCkgZWRnZXMucHVzaChsYXN0LmJvdHRvbSk7XG5cbiAgICBsZXQgYmVzdCA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBmb3IgKGxldCBnYXAgPSAwOyBnYXAgPCBlZGdlcy5sZW5ndGg7IGdhcCsrKSB7XG4gICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKHN0YXRlLnkgLSBlZGdlc1tnYXBdKTtcbiAgICAgIGlmIChkaXN0YW5jZSA8IGJlc3QpIHtcbiAgICAgICAgYmVzdCA9IGRpc3RhbmNlO1xuICAgICAgICBzdGF0ZS5pbnNlcnRBdCA9IGdhcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBnYXAgPSBzdGF0ZS5pbnNlcnRBdDtcbiAgICBjb25zdCByZWYgPSBnYXAgPCByZWN0cy5sZW5ndGggPyByZWN0c1tnYXBdIDogbGFzdDtcbiAgICBzdGF0ZS5naG9zdD8uc2V0Q3NzU3R5bGVzKHsgdG9wOiBgJHtzdGF0ZS55IC0gc3RhdGUub2Zmc2V0WX1weGAgfSk7XG4gICAgaWYgKCFyZWYgfHwgIXRoaXMuaG9zdC53aWxsQ2hhbmdlKHN0YXRlLm1vdmluZywgZ2FwKSkge1xuICAgICAgc3RhdGUubGluZS5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3RhdGUubGluZS5zZXRDc3NTdHlsZXMoe1xuICAgICAgZGlzcGxheTogXCJcIixcbiAgICAgIHRvcDogYCR7Z2FwIDwgcmVjdHMubGVuZ3RoID8gcmVmLnRvcCA6IHJlZi5ib3R0b219cHhgLFxuICAgICAgbGVmdDogYCR7cmVmLmxlZnQgKyA2fXB4YCxcbiAgICAgIHdpZHRoOiBgJHtNYXRoLm1heCgwLCByZWYud2lkdGggLSAxMil9cHhgLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEtlZXAgdGhlIGxpc3Qgc2Nyb2xsaW5nIHdoaWxlIHRoZSBwb2ludGVyIHNpdHMgaW4gYW4gZWRnZSBiYW5kICovXG4gIHByaXZhdGUgcmVhZG9ubHkgc2Nyb2xsVGljayA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuaG9zdC5jb250YWluZXIoKTtcbiAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICBjb25zdCByZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgZHkgPVxuICAgICAgICBzdGF0ZS55IDwgcmVjdC50b3AgKyBFREdFX0JBTkRcbiAgICAgICAgICA/IC1FREdFX1NQRUVEXG4gICAgICAgICAgOiBzdGF0ZS55ID4gcmVjdC5ib3R0b20gLSBFREdFX0JBTkRcbiAgICAgICAgICAgID8gRURHRV9TUEVFRFxuICAgICAgICAgICAgOiAwO1xuICAgICAgaWYgKGR5ICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IGNvbnRhaW5lci5zY3JvbGxUb3A7XG4gICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AgPSBiZWZvcmUgKyBkeTtcbiAgICAgICAgaWYgKGNvbnRhaW5lci5zY3JvbGxUb3AgIT09IGJlZm9yZSkgdGhpcy5wYWludCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0ZS5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc2Nyb2xsVGljayk7XG4gIH07XG59XG4iLCAiLyoqXG4gKiByZW9yZGVyLnRzIFx1MjAxNCBQdXJlIFwibW92ZSBzbGlkZXNcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXQgY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5XG4gKiAoc2VlIHRlc3QvcmVvcmRlci50ZXN0LnRzKS4gVGhlIGFkYXB0ZXIgaW4gZGVjay1zZXJ2aWNlLnRzIGFwcGxpZXMgdGhlXG4gKiBwbGFuOiBpdCByZXdyaXRlcyB0aGUgYGRlY2tgIHByb3BlcnRpZXMgb2YgdGhlIG5vdGVzIHdob3NlIG5leHQgbGlua1xuICogY2hhbmdlZC5cbiAqXG4gKiBBIGRlY2sgc3RvcmVzIG5vIG9yZGVyIG9mIGl0cyBvd24gXHUyMDE0IHRoZSBvcmRlciAqaXMqIHRoZSBuZXh0LWxpbmsgY2hhaW5cbiAqIChzZWUgc3JjL2RlY2sudHMpLiBSZW9yZGVyaW5nIGlzIHRoZXJlZm9yZSBhICoqcmV3aXJpbmcqKiwgbm90IGEgd3JpdGUgb2ZcbiAqIGEgbmV3IG9yZGVyIHByb3BlcnR5OiB0aGUgbW92aW5nIHNsaWRlcyBiZWNvbWUgb25lIGJsb2NrIGluc2VydGVkIGF0IGFcbiAqIGdhcCwgYW5kIGV2ZXJ5IG5vdGUgd2hvc2UgbmV4dCBsaW5rIGlzIGRpZmZlcmVudCBhZnRlcndhcmRzIGdldHNcbiAqIHJld3JpdHRlbi4gVGhlIGhlYWQgc2xpZGUgbmVlZHMgbm8gbWFya2VyIChpdCBpcyBzaW1wbHkgYGNoYWluWzBdYCksIGFuZFxuICogdGhlIG5ldyBsYXN0IHNsaWRlIGVuZHMgdGhlIGNoYWluIHdpdGggYGRlY2s6IFtdYCBcdTIwMTQgdGhlIHNhbWUgc2hhcGVcbiAqIGNyZWF0ZU5leHQgYW5kIGRlbGV0ZVNsaWRlcyB3cml0ZSwgc28gbm90aGluZyBlbHNlIGluIHRoZSBwbHVnaW4gaGFzIHRvXG4gKiBrbm93IHRoYXQgYSByZW9yZGVyIGhhcHBlbmVkLlxuICovXG5cbi8qKiBPbmUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVvcmRlclJld3JpdGUge1xuICAvKiogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdGhhdCBzaG91bGQgYmVjb21lIHRoaXMgbm90ZSdzIG5leHQgc2xpZGUsXG4gICAqIG9yIG51bGwgd2hlbiB0aGUgbm90ZSBiZWNvbWVzIHRoZSBuZXcgbGFzdCBzbGlkZSAoYGRlY2s6IFtdYCkuXG4gICAqL1xuICBuZXh0UGF0aDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqIFRoZSByZXN1bHQgb2YgcGxhbm5pbmcgYSBtb3ZlICovXG5leHBvcnQgaW50ZXJmYWNlIFJlb3JkZXJQbGFuIHtcbiAgLyoqIFRoZSByZW9yZGVyZWQgY2hhaW4gKFswXSA9IHRoZSBuZXcgaGVhZCBzbGlkZSkgKi9cbiAgY2hhaW46IHN0cmluZ1tdO1xuICAvKipcbiAgICogTm90ZXMgd2hvc2UgbmV4dCBsaW5rIGRpZmZlcnMgYWZ0ZXJ3YXJkcywgaW4gbmV3IGNoYWluIG9yZGVyLiBFbXB0eSB3aGVuXG4gICAqIHRoZSBkcm9wIGRvZXMgbm90IGNoYW5nZSB0aGUgb3JkZXIgXHUyMDE0IGNhbGxlcnMgbXVzdCB0aGVuIHdyaXRlIG5vdGhpbmcuXG4gICAqL1xuICByZXdyaXRlczogUmVvcmRlclJld3JpdGVbXTtcbn1cblxuLyoqXG4gKiBQbGFuIG1vdmluZyBgbW92aW5nYCB0byB0aGUgaW5zZXJ0aW9uIGdhcCBgaW5zZXJ0QXRgLlxuICpcbiAqIGBpbnNlcnRBdGAgaXMgYSAqKmdhcCoqIGluZGV4LCBub3QgYW4gaXRlbSBpbmRleDogMCA9IGJlZm9yZSB0aGUgZmlyc3RcbiAqIHNsaWRlICh0aGUgYmxvY2sgYmVjb21lcyB0aGUgbmV3IGhlYWQpLCBgY2hhaW4ubGVuZ3RoYCA9IGFmdGVyIHRoZSBsYXN0XG4gKiBzbGlkZSAodGhlIGJsb2NrIGJlY29tZXMgdGhlIG5ldyB0YWlsKSwgYW5kIGFueSBvdGhlciB2YWx1ZSBgZ2AgPSBiZWZvcmVcbiAqIGBjaGFpbltnXWAuIFRoZSBtb3Zpbmcgc2xpZGVzIGFyZSBpbnNlcnRlZCBhcyBPTkUgYmxvY2sgaW4gdGhlaXIgY3VycmVudFxuICogY2hhaW4gb3JkZXIsIGFuZCBldmVyeSBzbGlkZSB0aGF0IGlzIG5vdCBtb3Zpbmcga2VlcHMgaXRzIHJlbGF0aXZlIG9yZGVyIFx1MjAxNFxuICogc28gYSBub24tY29udGlndW91cyBzZWxlY3Rpb24gbW92ZXMgYXMgYSBibG9ja1xuICogKGBbMSwyLDMsNCw1XWAgbW92aW5nIGB7Miw0fWAgdG8gdGhlIGVuZCBcdTIxOTIgYFsxLDMsNSwyLDRdYCkuXG4gKlxuICogUmV0dXJucyBudWxsIHdoZW4gdGhlcmUgaXMgbm90aGluZyB0byBwbGFuOiBhIGNoYWluIG9mIGZld2VyIHRoYW4gdHdvXG4gKiBzbGlkZXMsIGFuIGVtcHR5IG1vdmluZyBzZXQsIGV2ZXJ5IHNsaWRlIG1vdmluZyAobm8gYW5jaG9yIGxlZnQgdG8gaGFuZ1xuICogdGhlIGJsb2NrIGZyb20pLCBvciBhbiBgaW5zZXJ0QXRgIHRoYXQgaXMgbm90IGFuIGludGVnZXIgaW5zaWRlXG4gKiBgMC4uY2hhaW4ubGVuZ3RoYC4gUGF0aHMgaW4gYG1vdmluZ2AgdGhhdCBhcmUgbm90IGluIHRoZSBjaGFpbiBhcmUgaWdub3JlZFxuICogKGFzIGluIHBsYW5EZWxldGVTbGlkZXMpLiBBIGdhcCBpbnNpZGUgdGhlIG1vdmluZyBibG9jayBpdHNlbGYgaXMgYVxuICogbGVnaXRpbWF0ZSBuby1vcDogdGhlIHBsYW4gY29tZXMgYmFjayB3aXRoIGFuIHVuY2hhbmdlZCBjaGFpbiBhbmQgbm9cbiAqIHJld3JpdGVzLCBzbyBhIGRyb3AgdGhhdCBjaGFuZ2VzIG5vdGhpbmcgd3JpdGVzIG5vdGhpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuUmVvcmRlcihcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBtb3Zpbmc6IHJlYWRvbmx5IHN0cmluZ1tdLFxuICBpbnNlcnRBdDogbnVtYmVyLFxuKTogUmVvcmRlclBsYW4gfCBudWxsIHtcbiAgaWYgKGNoYWluLmxlbmd0aCA8IDIpIHJldHVybiBudWxsO1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5zZXJ0QXQpIHx8IGluc2VydEF0IDwgMCB8fCBpbnNlcnRBdCA+IGNoYWluLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgbW92aW5nU2V0ID0gbmV3IFNldChtb3ZpbmcpO1xuICBjb25zdCBibG9jayA9IGNoYWluLmZpbHRlcigocGF0aCkgPT4gbW92aW5nU2V0LmhhcyhwYXRoKSk7XG4gIGlmIChibG9jay5sZW5ndGggPT09IDAgfHwgYmxvY2subGVuZ3RoID09PSBjaGFpbi5sZW5ndGgpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IHJlc3QgPSBjaGFpbi5maWx0ZXIoKHBhdGgpID0+ICFtb3ZpbmdTZXQuaGFzKHBhdGgpKTtcbiAgLy8gSG93IG1hbnkgbm9uLW1vdmluZyBzbGlkZXMgcHJlY2VkZSB0aGUgZ2FwIFx1MjAxNCB0aGF0IGlzIHdoZXJlIHRoZSBibG9ja1xuICAvLyBsYW5kcyBvbmNlIHRoZSBtb3Zpbmcgc2xpZGVzIGFyZSBsaWZ0ZWQgb3V0IG9mIHRoZSBjaGFpbi4gQ291bnRpbmcgdGhlXG4gIC8vIHN1cnZpdm9ycyAoaW5zdGVhZCBvZiB1c2luZyBgaW5zZXJ0QXRgIGRpcmVjdGx5KSBpcyB3aGF0IG1ha2VzIGEgZ2FwXG4gIC8vIGluc2lkZSB0aGUgYmxvY2sgaXRzZWxmIHJlc29sdmUgdG8gXCJubyBtb3ZlXCIuXG4gIGNvbnN0IGJlZm9yZSA9IGNoYWluLnNsaWNlKDAsIGluc2VydEF0KS5maWx0ZXIoKHBhdGgpID0+ICFtb3ZpbmdTZXQuaGFzKHBhdGgpKS5sZW5ndGg7XG4gIGNvbnN0IG5leHQgPSBbLi4ucmVzdC5zbGljZSgwLCBiZWZvcmUpLCAuLi5ibG9jaywgLi4ucmVzdC5zbGljZShiZWZvcmUpXTtcblxuICBjb25zdCBvbGROZXh0ID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZyB8IG51bGw+KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIG9sZE5leHQuc2V0KGNoYWluW2ldLCBjaGFpbltpICsgMV0gPz8gbnVsbCk7XG5cbiAgY29uc3QgcmV3cml0ZXM6IFJlb3JkZXJSZXdyaXRlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbmV3TmV4dCA9IG5leHRbaSArIDFdID8/IG51bGw7XG4gICAgaWYgKG9sZE5leHQuZ2V0KG5leHRbaV0pICE9PSBuZXdOZXh0KSByZXdyaXRlcy5wdXNoKHsgcGF0aDogbmV4dFtpXSwgbmV4dFBhdGg6IG5ld05leHQgfSk7XG4gIH1cbiAgcmV0dXJuIHsgY2hhaW46IG5leHQsIHJld3JpdGVzIH07XG59XG5cbi8qKlxuICogVGhlIGluc2VydGlvbiBnYXAgZm9yIG1vdmluZyBgbW92aW5nYCBvbmUgc3RlcCB0b3dhcmRzIGBkaXJlY3Rpb25gIFx1MjAxNCB0aGVcbiAqIHBsYW4gYmVoaW5kIHRoZSBzbGlkZXMgcGFuZWwncyBNb3ZlIHVwIC8gTW92ZSBkb3duIG1lbnUgaXRlbXMuIFJldHVybnMgbnVsbFxuICogd2hlbiB0aGUgYmxvY2sgYWxyZWFkeSBzaXRzIGF0IHRoYXQgZW5kIG9mIHRoZSBjaGFpbiAob3IgYG1vdmluZ2AgbmFtZXMgbm9cbiAqIGNoYWluIG1lbWJlciBhdCBhbGwpLCB3aGljaCBpcyB3aGF0IGxldHMgdGhlIGNhbGxlciBkaXNhYmxlIHRoZSBhY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGVwSW5zZXJ0QXQoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgbW92aW5nOiByZWFkb25seSBzdHJpbmdbXSxcbiAgZGlyZWN0aW9uOiBcInVwXCIgfCBcImRvd25cIixcbik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBtb3ZpbmdTZXQgPSBuZXcgU2V0KG1vdmluZyk7XG4gIGNvbnN0IGZpcnN0ID0gY2hhaW4uZmluZEluZGV4KChwYXRoKSA9PiBtb3ZpbmdTZXQuaGFzKHBhdGgpKTtcbiAgaWYgKGZpcnN0ID09PSAtMSkgcmV0dXJuIG51bGw7XG5cbiAgbGV0IGxhc3QgPSBmaXJzdDtcbiAgZm9yIChsZXQgaSA9IGNoYWluLmxlbmd0aCAtIDE7IGkgPiBmaXJzdDsgaS0tKSB7XG4gICAgaWYgKG1vdmluZ1NldC5oYXMoY2hhaW5baV0pKSB7XG4gICAgICBsYXN0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIE9uZSBzdGVwIHBhc3QgdGhlIGJsb2NrJ3MgZmFyIGVuZDogZm9yIFwiZG93blwiIHRoYXQgaXMgdGhlIGdhcCBhZnRlciB0aGVcbiAgLy8gc2xpZGUgdGhhdCBmb2xsb3dzIHRoZSBibG9jayAobGFzdCArIDIsIHNpbmNlIGdhcHMgc2l0IGJldHdlZW4gc2xpZGVzKS5cbiAgaWYgKGRpcmVjdGlvbiA9PT0gXCJ1cFwiKSByZXR1cm4gZmlyc3QgPiAwID8gZmlyc3QgLSAxIDogbnVsbDtcbiAgcmV0dXJuIGxhc3QgPCBjaGFpbi5sZW5ndGggLSAxID8gbGFzdCArIDIgOiBudWxsO1xufVxuIiwgImltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIHR5cGUgU2V0dGluZ0RlZmluaXRpb25JdGVtIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IFNMSURFU19USEVNRVMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKipcbiAqIFNldHRpbmdzIHRhYjogdG9nZ2xlcyB0aGUgbmF2IGJ1dHRvbnMsIHBhZ2UgbnVtYmVyLCBhdXRvLWVudGVyIGFuZCBiYXJcbiAqIHZpc2liaWxpdHkuIERlY2xhcmF0aXZlIGRlZmluaXRpb25zIChPYnNpZGlhbiBcdTIyNjUgMS4xMy4wLCBzZWFyY2hhYmxlIGluIHRoZVxuICogc2V0dGluZ3MgbW9kYWwpIHdpdGggYW4gaW1wZXJhdGl2ZSBgZGlzcGxheSgpYCBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pIHtcbiAgICBzdXBlcihwbHVnaW4uYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgLyoqIERlY2xhcmF0aXZlIHNldHRpbmdzIChPYnNpZGlhbiBcdTIyNjUgMS4xMy4wKSBcdTIwMTQgc2VhcmNoYWJsZSBieSB0aGUgc2V0dGluZ3MgbW9kYWwuICovXG4gIGdldFNldHRpbmdEZWZpbml0aW9ucygpOiBTZXR0aW5nRGVmaW5pdGlvbkl0ZW1bXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTdHlsZSB0ZW1wbGF0ZVwiLFxuICAgICAgICBkZXNjOiBcIkJ1aWx0LWluIGxvb2sgZm9yIHRoZSBzbGlkZXMgY2FyZCBhbmQgc2xpZGVzIGJhciAoYm9yZGVyLCBiYWNrZ3JvdW5kLCBzaGFkb3csIGJhciBzdHlsaW5nKS4gRXZlcnkgdGVtcGxhdGUgYWRhcHRzIHRvIGxpZ2h0IGFuZCBkYXJrIHRoZW1lcy5cIixcbiAgICAgICAgY29udHJvbDoge1xuICAgICAgICAgIGtleTogXCJzbGlkZXNUaGVtZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZHJvcGRvd25cIixcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuZnJvbUVudHJpZXMoU0xJREVTX1RIRU1FUy5tYXAoKHQpID0+IFt0LmlkLCB0LmxhYmVsXSkpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJDZW50ZXIgaW1hZ2VzXCIsXG4gICAgICAgIGRlc2M6IFwiSW1hZ2VzIHJlbmRlciBjZW50ZXJlZCBvbiB0aGUgc2xpZGUgYXMgYSBjYXJkIGJsb2NrIGV4YWN0bHkgYXMgdGFsbCBhcyB0aGUgcGljdHVyZS4gVHVybiBvZmYgZm9yIE9ic2lkaWFuJ3MgdXN1YWwgYmVoYXZpb3I6IGltYWdlcyBzdGF5IGlubGluZSB3aXRoIHRoZSB0ZXh0IChhIHNtYWxsIGltYWdlIGFuZCBpdHMgY2FwdGlvbiBzaXQgb24gdGhlIHNhbWUgcm93KS5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiaW1hZ2VMYXlvdXRcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHNsaWRlcyBiYXJcIixcbiAgICAgICAgZGVzYzogXCJNYXN0ZXIgdG9nZ2xlIGZvciB0aGUgZW50aXJlIHNsaWRlcyBiYXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93XCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dTbGlkZXNCYXJcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHByZXZpb3VzL25leHQgYnV0dG9uc1wiLFxuICAgICAgICBkZXNjOiBcIlNob3cgXHUyNUMwIFx1MjVCNiBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyIHdoZW4gdGhlIG5vdGUgYmVsb25ncyB0byBhIGRlY2sgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSlcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd05hdkJ1dHRvbnNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJQYWdlIG51bWJlciBzdHlsZVwiLFxuICAgICAgICBkZXNjOiAnU2hvd24gYXQgdGhlIGJvdHRvbS1yaWdodC4gXCJuIC8gdG90YWxcIjogMS1iYXNlZCBvdmVyIHRoZSB3aG9sZSBkZWNrIGNoYWluIChoZWFkIHNsaWRlID0gMSkuIFwiblwiOiBqdXN0IHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyLiBcIm5vbmVcIjogaGlkZGVuLicsXG4gICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICBrZXk6IFwicGFnZU51bWJlclN0eWxlXCIsXG4gICAgICAgICAgdHlwZTogXCJkcm9wZG93blwiLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGZyYWN0aW9uOiBcIk4gLyBUb3RhbFwiLFxuICAgICAgICAgICAgY3VycmVudDogXCJOXCIsXG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHByb2dyZXNzIGJhclwiLFxuICAgICAgICBkZXNjOiBcIkRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyIC0tIG9uZSBwZXIgc2xpZGUsIGNsaWNrIHRvIGp1bXBcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd1Byb2dyZXNzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQXV0by1lbnRlciBzbGlkZXMgbW9kZVwiLFxuICAgICAgICBkZXNjOiBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJhdXRvRW50ZXJTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJFc2NhcGUgZXhpdHMgc2xpZGVzIG1vZGVcIixcbiAgICAgICAgZGVzYzogXCJQcmVzcyBlc2NhcGUgdG8gbGVhdmUgc2xpZGVzIG1vZGUgYW5kIHJldHVybiB0byB0aGUgcHJldmlvdXMgdmlld1wiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJlc2NFeGl0c1NsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNsaWRlcyB0aXRsZVwiLFxuICAgICAgICBkZXNjOiBcIkZyb250bWF0dGVyIHByb3BlcnR5IHRvIHNob3cgYXMgdGhlIGNhcmQgdGl0bGUgKEgxKS4gTGVhdmUgZW1wdHkgZm9yIG5vbmU7IHR5cGUgYGZpbGVuYW1lYCB0byB1c2UgdGhlIGZpbGUgbmFtZSBcdTIwMTQgdGhhdCB0aXRsZSBpcyBlZGl0YWJsZSAocmVuYW1lcyB0aGUgbm90ZSk7IHByb3BlcnR5LWJhY2tlZCB0aXRsZXMgYXJlIHJlYWQtb25seSAoZWRpdCB0aGUgcHJvcGVydHkgb3V0c2lkZSBzbGlkZXMgbW9kZSkuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNsaWRlc1RpdGxlXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJFLmcuIFRpdGxlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQmFyIHByb3BlcnRpZXNcIixcbiAgICAgICAgZGVzYzogXCJDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgdG8gc2hvdyBpbiB0aGUgc2xpZGVzIGJhciAoZS5nLiBgdW5pdmVyc2l0eSwgc2hvcnQtdGl0bGUsIGRhdGVgKS4gRWFjaCB2YWx1ZSBmaWxscyBhbiBlcXVhbC13aWR0aCBjb2x1bW47IGRyYWcgZGl2aWRlcnMgdG8gcmVzaXplLiBMZWF2ZSBlbXB0eSB0byBzaG93IG5vdGhpbmcuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImJhclByb3BlcnRpZXNcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIkUuZy4gVW5pdmVyc2l0eSwgZGF0ZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkNvbmZpcm0gc2xpZGUgZGVsZXRpb25cIixcbiAgICAgICAgZGVzYzogXCJBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHNsaWRlcyBwYW5lbCdzIHJpZ2h0LWNsaWNrIG1lbnUuIERlbGV0aW9uIG1vdmVzIHNsaWRlcyB0byB0aGUgdHJhc2guXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImNvbmZpcm1EZWxldGVTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJOYXZpZ2F0aW9uIGhvdGtleXNcIixcbiAgICAgICAgZGVzYzogXCJEZWZhdWx0OiBQcmV2aW91cyBwYWdlIG1vZCtzaGlmdCtcdTIxOTAsIG5leHQgcGFnZSBtb2Qrc2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgc2V0dGluZ3MgXHUyMTkyIGhvdGtleXMuXCIsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICAvKiogUGVyc2lzdCBjb250cm9sIGNoYW5nZXMsIHRoZW4gcmVmcmVzaCB0aGUgYmFyIHNvIHRoZSBuZXcgc2V0dGluZyBhcHBsaWVzLiAqL1xuICBzZXRDb250cm9sVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogdm9pZCB7XG4gICAgdm9pZCB0aGlzLmFwcGx5Q29udHJvbFZhbHVlKGtleSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBhcHBseUNvbnRyb2xWYWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAodGhpcy5wbHVnaW4uc2V0dGluZ3MgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IHZhbHVlO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBJbXBlcmF0aXZlIGZhbGxiYWNrIGZvciBPYnNpZGlhbiA8IDEuMTMuMCAobm90IGNhbGxlZCB3aXRoIGRlZmluaXRpb25zIHByZXNlbnQpLiAqL1xuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTdHlsZSB0ZW1wbGF0ZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQnVpbHQtaW4gbG9vayBmb3IgdGhlIHNsaWRlcyBjYXJkIGFuZCBzbGlkZXMgYmFyIChib3JkZXIsIGJhY2tncm91bmQsIHNoYWRvdywgYmFyIHN0eWxpbmcpLiBFdmVyeSB0ZW1wbGF0ZSBhZGFwdHMgdG8gbGlnaHQgYW5kIGRhcmsgdGhlbWVzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgU0xJREVTX1RIRU1FUykgZHJvcGRvd24uYWRkT3B0aW9uKHQuaWQsIHQubGFiZWwpO1xuICAgICAgICBkcm9wZG93bi5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGhlbWUgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ2VudGVyIGltYWdlc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiSW1hZ2VzIHJlbmRlciBjZW50ZXJlZCBvbiB0aGUgc2xpZGUgYXMgYSBjYXJkIGJsb2NrIGV4YWN0bHkgYXMgdGFsbCBhcyB0aGUgcGljdHVyZS4gVHVybiBvZmYgZm9yIE9ic2lkaWFuJ3MgdXN1YWwgYmVoYXZpb3I6IGltYWdlcyBzdGF5IGlubGluZSB3aXRoIHRoZSB0ZXh0IChhIHNtYWxsIGltYWdlIGFuZCBpdHMgY2FwdGlvbiBzaXQgb24gdGhlIHNhbWUgcm93KS5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmltYWdlTGF5b3V0KS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbWFnZUxheW91dCA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgc2xpZGVzIGJhclwiKVxuICAgICAgLnNldERlc2MoXCJNYXN0ZXIgdG9nZ2xlIGZvciB0aGUgZW50aXJlIHNsaWRlcyBiYXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93U2xpZGVzQmFyKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93U2xpZGVzQmFyID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBwcmV2aW91cy9uZXh0IGJ1dHRvbnNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlNob3cgXHUyNUMwIFx1MjVCNiBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyIHdoZW4gdGhlIG5vdGUgYmVsb25ncyB0byBhIGRlY2sgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSlcIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dOYXZCdXR0b25zKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlBhZ2UgbnVtYmVyIHN0eWxlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgJ1Nob3duIGF0IHRoZSBib3R0b20tcmlnaHQuIFwibiAvIHRvdGFsXCI6IDEtYmFzZWQgb3ZlciB0aGUgd2hvbGUgZGVjayBjaGFpbiAoaGVhZCBzbGlkZSA9IDEpLiBcIm5cIjoganVzdCB0aGUgY3VycmVudCBwYWdlIG51bWJlci4gXCJub25lXCI6IGhpZGRlbi4nLFxuICAgICAgKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT5cbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9ucyh7XG4gICAgICAgICAgICBmcmFjdGlvbjogXCJOIC8gVG90YWxcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IFwiTlwiLFxuICAgICAgICAgICAgbm9uZTogXCJOb25lXCIsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucGFnZU51bWJlclN0eWxlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSA9IHZhbHVlIGFzIFwiZnJhY3Rpb25cIiB8IFwiY3VycmVudFwiIHwgXCJub25lXCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBwcm9ncmVzcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyIC0tIG9uZSBwZXIgc2xpZGUsIGNsaWNrIHRvIGp1bXBcIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1Byb2dyZXNzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQXV0by1lbnRlciBzbGlkZXMgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiT3BlbiBkZWNrIG5vdGVzIGRpcmVjdGx5IGluIFNsaWRlcyBtb2RlLiBMZWF2ZSBvZmYgdG8gZW50ZXIgbWFudWFsbHkgd2l0aCB0aGUgVG9nZ2xlIFNsaWRlcyBNb2RlIGNvbW1hbmQgKE1vZCtTaGlmdCtFKSBvciB0aGUgcHJldmlvdXMvbmV4dCBwYWdlIGhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVzY2FwZSBleGl0cyBzbGlkZXMgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXCJQcmVzcyBlc2NhcGUgdG8gbGVhdmUgc2xpZGVzIG1vZGUgYW5kIHJldHVybiB0byB0aGUgcHJldmlvdXMgdmlld1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTbGlkZXMgdGl0bGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkZyb250bWF0dGVyIHByb3BlcnR5IHRvIHNob3cgYXMgdGhlIGNhcmQgdGl0bGUgKEgxKS4gTGVhdmUgZW1wdHkgZm9yIG5vbmU7IHR5cGUgYGZpbGVuYW1lYCB0byB1c2UgdGhlIGZpbGUgbmFtZS5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRS5nLiBUaXRsZVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaXRsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaXRsZSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkJhciBwcm9wZXJ0aWVzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgdG8gc2hvdyBpbiB0aGUgc2xpZGVzIGJhciAoZS5nLiBgdW5pdmVyc2l0eSwgc2hvcnQtdGl0bGUsIGRhdGVgKS4gRWFjaCB2YWx1ZSBmaWxscyBhbiBlcXVhbC13aWR0aCBjb2x1bW47IGRyYWcgZGl2aWRlcnMgdG8gcmVzaXplLiBMZWF2ZSBlbXB0eSB0byBzaG93IG5vdGhpbmcuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkUuZy4gVW5pdmVyc2l0eSwgZGF0ZVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmJhclByb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDb25maXJtIHNsaWRlIGRlbGV0aW9uXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHNsaWRlcyBwYW5lbCdzIHJpZ2h0LWNsaWNrIG1lbnUuIERlbGV0aW9uIG1vdmVzIHNsaWRlcyB0byB0aGUgdHJhc2guXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJOYXZpZ2F0aW9uIGhvdGtleXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkRlZmF1bHQ6IFByZXZpb3VzIHBhZ2UgbW9kK3NoaWZ0K1x1MjE5MCwgbmV4dCBwYWdlIG1vZCtzaGlmdCtcdTIxOTIuIFJlYmluZCB1bmRlciBzZXR0aW5ncyBcdTIxOTIgaG90a2V5cy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT5cbiAgICAgICAgYnV0dG9uLnNldEJ1dHRvblRleHQoXCJPcGVuIGhvdGtleXMgc2V0dGluZ3NcIikub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgLy8gT3BlbiBPYnNpZGlhbidzIGhvdGtleXMgc2V0dGluZ3MgcGFnZSAoaW50ZXJuYWwgQVBJOyBpZ25vcmUgZmFpbHVyZXMpXG4gICAgICAgICAgKFxuICAgICAgICAgICAgdGhpcy5hcHAgYXMgdW5rbm93biBhcyB7IHNldHRpbmc/OiB7IG9wZW5UYWJCeUlkPzogKGlkOiBzdHJpbmcpID0+IHZvaWQgfSB9XG4gICAgICAgICAgKS5zZXR0aW5nPy5vcGVuVGFiQnlJZD8uKFwiaG90a2V5c1wiKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuICB9XG59XG4iLCAiLyoqIFJlbW92ZSBhbGwgY2hpbGRyZW4gb2YgYW4gZWxlbWVudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2hpbGRyZW4oZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIHdoaWxlIChlbC5maXJzdENoaWxkKSBlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTZCQSxJQUFBQSxtQkFBNEM7OztBQzVCckMsU0FBUyxZQUF5QjtBQUN2QyxRQUFNLE1BQU0sVUFBVSxFQUFFLEtBQUssb0JBQW9CLENBQUM7QUFDbEQsTUFBSSxhQUFhLEVBQUUsU0FBUyxPQUFPLENBQUM7QUFDcEMsTUFBSSxRQUFRO0FBSVosTUFBSSxpQkFB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UyxHQUFHO0FBQ3JCLFlBQU0sT0FBTyxXQUFXO0FBQUEsUUFDdEIsS0FBSztBQUFBLFFBQ0wsTUFBTSxZQUFPLE9BQU8sS0FBSyxJQUFJO0FBQUEsUUFDN0IsTUFBTSxFQUFFLE9BQU8sNERBQXVEO0FBQUEsTUFDeEUsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLG9CQUFvQixVQUFVLE1BQU07QUFHcEQsWUFBTSxRQUFRLEtBQUssTUFBTTtBQUN6QixZQUFNLE9BQU8sV0FBVztBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLE1BQ0UsS0FBSyxTQUFTLG9CQUFvQixhQUM5QixHQUFHLEtBQUssUUFBUSxDQUFDLE1BQU0sS0FBSyxLQUM1QixHQUFHLEtBQUssUUFBUSxDQUFDO0FBQUEsTUFDekIsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLGdCQUFnQixRQUFRLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFDL0QsWUFBTSxXQUFXLFVBQVUsRUFBRSxLQUFLLHlCQUF5QixDQUFDO0FBQzVELGVBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVEsS0FBSztBQUMxQyxjQUFNLFFBQVEsSUFBSSxLQUFLLFFBQVEsU0FBUyxNQUFNLEtBQUssUUFBUSxZQUFZO0FBQ3ZFLGNBQU0sTUFBTSxVQUFVO0FBQUEsVUFDcEIsS0FBSywwREFBMEQsS0FBSztBQUFBLFFBQ3RFLENBQUM7QUFDRCxZQUFJLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGlCQUFTLFlBQVksR0FBRztBQUFBLE1BQzFCO0FBQ0EsV0FBSyxJQUFJLFlBQVksUUFBUTtBQUFBLElBQy9CO0FBSUEsU0FBSyxJQUFJLGFBQWEsRUFBRSxTQUFTLEtBQUssSUFBSSxzQkFBc0IsSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUFBLEVBQ25GO0FBQ0Y7QUFHQSxTQUFTLGFBQWEsT0FBZ0IsT0FBa0M7QUFDdEUsU0FDRSxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sV0FBVyxTQUFTLE1BQU0sTUFBTSxDQUFDLE1BQU0sT0FBTyxNQUFNLFFBQVE7QUFFOUY7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAibmV3TmFtZSIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImdhcCIsICJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
