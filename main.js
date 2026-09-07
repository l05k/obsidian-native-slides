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
    const chain = deck ? deck.chain.filter((p) => this.app.vault.getAbstractFileByPath(p) instanceof import_obsidian7.TFile) : [];
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
      if (!(f instanceof import_obsidian7.TFile)) return;
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
    const menu = new import_obsidian7.Menu();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jYXBhY2l0eS50cyIsICJzcmMvY2FwYWNpdHktY29yZS50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVjay1zZXJ2aWNlLnRzIiwgInNyYy9kZWNrLnRzIiwgInNyYy9jcmVhdGVOZXh0LnRzIiwgInNyYy9kZWxldGVTbGlkZXMudHMiLCAic3JjL3BhbmVsLnRzIiwgInNyYy9jb25maXJtLWRlbGV0ZS50cyIsICJzcmMvc2V0dGluZ3MudHMiLCAic3JjL3V0aWxzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIG5hdGl2ZS1zbGlkZXMgXHUyMDE0IGEgXCJTbGlkZXMgbW9kZVwiIGZvciBPYnNpZGlhbiBkZWNrIG5vdGVzXG4gKlxuICogT25lIHJlc2VydmVkIGZyb250bWF0dGVyIGtleSwgYGRlY2tgIChhIHNpbmdsZSBtYXJrZG93biBsaW5rIHRvIHRoZSBuZXh0XG4gKiBzbGlkZSBcdTIwMTQgbmV4dC1vbmx5IHNlbWFudGljcywgbm8gb3ZlcnZpZXcgcGFnZSBzaW5jZSB2MS4wLjApLCBkcml2ZXNcbiAqIHByZXYvbmV4dCBuYXZpZ2F0aW9uIGFuZCBhdXRvLWNvbXB1dGVkIHBhZ2UgbnVtYmVycy4gQSBkZWNrIG5vdGUgY2FuIGJlXG4gKiBlbnRlcmVkIGludG8gKipTbGlkZXMgbW9kZSoqIFx1MjAxNCBhbiBpbW1lcnNpdmUsIGVkaXRhYmxlIChMaXZlIFByZXZpZXcpIHZpZXdcbiAqIHdpdGggYSBzbGlkZXMgYmFyIHNob3dpbmcgcHJvcGVydGllcywgbmF2aWdhdGlvbiBhbmQgdGhlIHBhZ2UgbnVtYmVyLlxuICpcbiAqIE5hdGl2ZSBPYnNpZGlhbiBtb2RlcyAoU291cmNlIC8gZGVmYXVsdCBMaXZlIFByZXZpZXcgLyBSZWFkaW5nIHZpZXcpIGFyZVxuICogbGVmdCBjb21wbGV0ZWx5IHVudG91Y2hlZDogbm8gc3RhdHVzLWJhciBoaWRpbmcsIG5vIHNsaWRlcyBiYXIsIG5vXG4gKiBmdWxsc2NyZWVuLCBubyBzdHlsaW5nLiBTbGlkZXMgbW9kZSBpcyB0aGUgcGx1Z2luJ3Mgb25seSBzdXJmYWNlLlxuICpcbiAqIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgYW5kIGEgdGhpbiBvcmNoZXN0cmF0aW9uIGxheWVyOyB0aGUgbG9naWNcbiAqIGxpdmVzIGluIGBzcmMvYDpcbiAqICAgLSBzcmMvdHlwZXMudHMgICAgICAgIHNldHRpbmdzIHNoYXBlICsgZGVmYXVsdHMgKyByZXNlcnZlZCBgZGVja2Aga2V5XG4gKiAgIC0gc3JjL21vZGUudHMgICAgICAgICB2aWV3IG1vZGUgLyBmcm9udG1hdHRlciBoZWxwZXJzIChwdXJlLCBgQXBwYC1iYXNlZClcbiAqICAgLSBzcmMvZGVjay1zZXJ2aWNlLnRzIGRlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiY3JlYXRlIG5leHQgc2xpZGVcIiBnbHVlXG4gKiAgIC0gc3JjL2Jhci50cyAgICAgICAgICBiYXIgRE9NIGhlbHBlcnMgKGNyZWF0ZSAvIGJ1dHRvbnMgLyB0YWItYmFyIG1lYXN1cmUpXG4gKiAgIC0gc3JjL3BhbmVsLnRzICAgICAgICBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICogICAtIHNyYy9jb21tYW5kcy50cyAgICAgY29tbWFuZCByZWdpc3RyYXRpb24gKGRldi1nYXRlZCBkZWJ1ZyBjb21tYW5kKVxuICogICAtIHNyYy9zZXR0aW5ncy50cyAgICAgc2V0dGluZ3MgdGFiXG4gKiAgIC0gc3JjL2RlYnVnLnRzICAgICAgICB0eXBvZ3JhcGh5IG1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSlcbiAqICAgLSBzcmMvZGVjay50cyAgICAgICAgIHB1cmUgZGVjayBjb3JlICh3aXRoIHNyYy9jcmVhdGVOZXh0LnRzKVxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlIH0gZnJvbSBcIi4vc3JjL2RlY2tcIjtcbmltcG9ydCB7IGFjdGl2ZUZyb250bWF0dGVyLCBjdXJyZW50TW9kZSwgZnJvbnRtYXR0ZXJPZiwgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL3NyYy9tb2RlXCI7XG5pbXBvcnQgeyBTbGlkZXNQYW5lbFZpZXcsIFNMSURFU19QQU5FTF9WSUVXIH0gZnJvbSBcIi4vc3JjL3BhbmVsXCI7XG5pbXBvcnQgeyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIH0gZnJvbSBcIi4vc3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBERUNLX0tFWSwgREVGQVVMVF9TRVRUSU5HUywgU0xJREVTX1RIRU1FUywgdHlwZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB9IGZyb20gXCIuL3NyYy90eXBlc1wiO1xuaW1wb3J0IHsgY2xlYXJDaGlsZHJlbiB9IGZyb20gXCIuL3NyYy91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXRpdmVTbGlkZXNQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAvKiogVGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKi9cbiAgYmFyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWUgKi9cbiAgZGVja1NlcnZpY2UhOiBEZWNrU2VydmljZTtcbiAgLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuICBzZXR0aW5nczogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7IC4uLkRFRkFVTFRfU0VUVElOR1MgfTtcblxuICAvKiogV2hldGhlciBTbGlkZXMgbW9kZSBpcyBjdXJyZW50bHkgYWN0aXZlIChzZXNzaW9uIHN0YXRlLCBub3QgcGVyc2lzdGVkKSAqL1xuICBwcml2YXRlIHNsaWRlc01vZGUgPSBmYWxzZTtcbiAgLyoqIFZpZXcgbW9kZSB0byByZXN0b3JlIHdoZW4gbGVhdmluZyBTbGlkZXMgbW9kZSAoXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiKSAqL1xuICBwcml2YXRlIGV4aXRNb2RlOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgPSBcInNvdXJjZVwiO1xuICAvKiogV2hldGhlciB0aGUgZXhpdCB2aWV3IHdhcyBTb3VyY2UgbW9kZSAodHJ1ZSkgdnMgTGl2ZSBQcmV2aWV3IChmYWxzZSkgKi9cbiAgcHJpdmF0ZSBleGl0U291cmNlID0gZmFsc2U7XG4gIC8qKiBMYXN0IG5vdGUgYXV0by1lbnRlcmVkIGludG8gU2xpZGVzIG1vZGUgKHByZXZlbnRzIHJlLWVudGVyaW5nIGFmdGVyIG1hbnVhbCBleGl0KSAqL1xuICBwcml2YXRlIGF1dG9FbnRlcmVkUGF0aCA9IFwiXCI7XG4gIC8qKiBMYXN0IHJlZnJlc2gga2V5IChcInBhdGh8bW9kZVwiKSB0byBhdm9pZCBwb2ludGxlc3MgcmUtcmVuZGVycyAqL1xuICBwcml2YXRlIGxhc3RLZXkgPSBcIlwiO1xuICAvKiogTGFzdCBtZWFzdXJlZCB0YWItYmFyIGhlaWdodCAocHgpIFx1MjAxNCBjYWNoZWQgd2hpbGUgdGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuICovXG4gIHByaXZhdGUgdGFiQmFySGVpZ2h0ID0gMDtcbiAgLyoqIFdoZXRoZXIgdGhlIG1vdXNlIHBvaW50ZXIgaXMgaGlkZGVuIGZvciBwcmVzZW50aW5nIChzZXNzaW9uIHN0YXRlKSAqL1xuICBwb2ludGVySGlkZGVuID0gZmFsc2U7XG5cbiAgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy5kZWNrU2VydmljZSA9IG5ldyBEZWNrU2VydmljZSh0aGlzLmFwcCk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAxLiBSZWZyZXNoIG9uIFwiY3VycmVudCBub3RlIC8gdmlldyBjaGFuZ2VkXCIgZXZlbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubWF5YmVBdXRvRW50ZXJTbGlkZXMoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZWZyZXNoKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIC8vIFJlZnJlc2ggd2hlbiB0aGUgbm90ZSBjb250ZW50IChpbmNsdWRpbmcgZnJvbnRtYXR0ZXIpIGNoYW5nZXMgLyBzYXZlc1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChmaWxlOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDIuIEZhbGxiYWNrIHRpbWVyOiBlZGl0XHUyMTk0cmVhZGluZyB0b2dnbGVzIG1heSBmaXJlIG5vIHN0YW5kYXJkIGV2ZW50IFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbChcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBjb25zdCBrZXkgPSBmaWxlID8gYCR7ZmlsZS5wYXRofXwke2N1cnJlbnRNb2RlKHRoaXMuYXBwKX1gIDogXCJcIjtcbiAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5sYXN0S2V5KSB7XG4gICAgICAgICAgdGhpcy5sYXN0S2V5ID0ga2V5O1xuICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMy4gQ29tbWFuZHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgcmVnaXN0ZXJDb21tYW5kcyh0aGlzKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzYi4gU2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgb3ZlcnZpZXcsIHJlcGxhY2VzIHRoZSBvbGQgb3ZlcnZpZXcgcGFnZSkgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoU0xJREVTX1BBTkVMX1ZJRVcsIChsZWFmKSA9PiBuZXcgU2xpZGVzUGFuZWxWaWV3KHRoaXMsIGxlYWYpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJwcmVzZW50YXRpb25cIiwgXCJTaG93IHNsaWRlcyBwYW5lbFwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMuYWN0aXZhdGVTbGlkZXNQYW5lbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDQuIFBpbiB0aGUgU2xpZGVzIGVkaXRvciB0byBvbmUgc2NyZWVuIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIENTUyBgb3ZlcmZsb3c6IGhpZGRlbmAgYmxvY2tzIHRoZSB3aGVlbCwgYnV0IG5hdGl2ZSBkcmFnLXNlbGVjdFxuICAgIC8vIGF1dG9zY3JvbGwgYW5kIENvZGVNaXJyb3IncyBwcm9ncmFtbWF0aWMgc2Nyb2xsSW50b1ZpZXcgc3RpbGwgbW92ZSB0aGVcbiAgICAvLyBzY3JvbGxlci4gVGhpcyBjYXB0dXJlLXBoYXNlIGxpc3RlbmVyIHJlc2V0cyBhbnkgc2Nyb2xsIGluc2lkZSB0aGVcbiAgICAvLyBhY3RpdmUgbWFya2Rvd24gdmlldyBiYWNrIHRvIHRoZSB0b3Agd2hpbGUgU2xpZGVzIG1vZGUgaXMgYWN0aXZlLlxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChcbiAgICAgIGRvY3VtZW50LFxuICAgICAgXCJzY3JvbGxcIixcbiAgICAgIChldnQpID0+IHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKCF2aWV3KSByZXR1cm47XG4gICAgICAgIGNvbnN0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdmlldy5jb250ZW50RWwuY29udGFpbnMoZWwpKSB7XG4gICAgICAgICAgaWYgKGVsLnNjcm9sbFRvcCAhPT0gMCkgZWwuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7IGNhcHR1cmU6IHRydWUgfSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDUuIEVzY2FwZSBrZXkgZXhpdHMgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCBcImtleWRvd25cIiwgKGV2dDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IFwiRXNjYXBlXCIgJiYgdGhpcy5zbGlkZXNNb2RlICYmIHRoaXMuc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMpIHtcbiAgICAgICAgdGhpcy5leGl0U2xpZGVzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNi4gQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIGFuZCBkbyB0aGUgZmlyc3QgcmVuZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMuYmFyID0gY3JlYXRlQmFyKCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmJhcik7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBvbnVubG9hZCgpOiB2b2lkIHtcbiAgICB0aGlzLmJhcj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5iYXIgPSBudWxsO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtYmxvY2staW1hZ2VzXCIpO1xuICAgIHRoaXMucmVtb3ZlVGhlbWVDbGFzc2VzKCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2V0dGluZ3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRhdGEgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSBhcyBQYXJ0aWFsPE5hdGl2ZVNsaWRlc1NldHRpbmdzPiB8IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGRhdGEgPz8ge30pO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBub3RlIGlzIGEgZGVjayBub3RlIChoYXMgYSBgZGVja2AgcHJvcGVydHkpICovXG4gIHByaXZhdGUgaXNEZWNrTm90ZShmaWxlOiBURmlsZSB8IG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiBmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgZXZlcnkgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtKmAgY2xhc3MgZnJvbSA8Ym9keT4gKi9cbiAgcHJpdmF0ZSByZW1vdmVUaGVtZUNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBjbHMgb2YgQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNsYXNzTGlzdCkpIHtcbiAgICAgIGlmIChjbHMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgc2luZ2xlIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgc2xpZGVzVGhlbWVgIHNldHRpbmcgXHUyMDE0IHRoZSBzdHlsZSB0ZW1wbGF0ZXMgaW4gc3R5bGVzLmNzcyBob29rIG9mZiBpdC5cbiAgICogVW5rbm93biBpZHMgKGUuZy4gYWZ0ZXIgYSBkb3duZ3JhZGUpIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB0aGVtZS5cbiAgICovXG4gIHByaXZhdGUgYXBwbHlUaGVtZUNsYXNzKCk6IHZvaWQge1xuICAgIGNvbnN0IGlkID0gU0xJREVTX1RIRU1FUy5zb21lKCh0KSA9PiB0LmlkID09PSB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1Muc2xpZGVzVGhlbWU7XG4gICAgY29uc3QgY2xzID0gYG5hdGl2ZS1zbGlkZXMtdGhlbWUtJHtpZH1gO1xuICAgIGZvciAoY29uc3QgYyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpICYmIGMgIT09IGNscykgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaGlkaW5nIHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIGZvciBwcmVzZW50aW5nLiBIaWRpbmcgYWxzb1xuICAgKiBwYXJrcyBmb2N1cyAoYmx1cnMgdGhlIGVkaXRvciwgc28gdGhlIGNhcmV0IGRpc2FwcGVhcnMpOyBzaG93aW5nIGxlYXZlc1xuICAgKiBmb2N1cyBwYXJrZWQgXHUyMDE0IGNsaWNrIHNsaWRlIGNvbnRlbnQgdG8gcmVzdW1lIGVkaXRpbmcuXG4gICAqL1xuICB0b2dnbGVQb2ludGVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9pbnRlckhpZGRlbiA9ICF0aGlzLnBvaW50ZXJIaWRkZW47XG4gICAgaWYgKHRoaXMucG9pbnRlckhpZGRlbikge1xuICAgICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuYCBib2R5IGNsYXNzIGluIHN5bmMgd2l0aCB0aGVcbiAgICogcHJlc2VudGluZyBzdGF0ZSBcdTIwMTQgc3R5bGVzLmNzcyB0dXJucyBldmVyeSBjdXJzb3IgaW52aXNpYmxlIHdoaWxlIHNldC5cbiAgICogTGVhdmluZyBTbGlkZXMgbW9kZSBhbHdheXMgcmVzdG9yZXMgdGhlIHBvaW50ZXIuXG4gICAqL1xuICBwcml2YXRlIHN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwibmF0aXZlLXNsaWRlcy1wb2ludGVyLWhpZGRlblwiLCBzbGlkZXMgJiYgdGhpcy5wb2ludGVySGlkZGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBgbmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNgIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgaW1hZ2VMYXlvdXRgIHNldHRpbmcgXHUyMDE0IHN0eWxlcy5jc3MncyBpbWFnZS1sYXlvdXQgcnVsZXMgaG9vayBvZmYgaXQuXG4gICAqIFRoZSBjbGFzcyBpcyBvbmx5IG1lYW5pbmdmdWwgaW4gU2xpZGVzIG1vZGUuXG4gICAqL1xuICBwcml2YXRlIHN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlczogYm9vbGVhbik6IHZvaWQge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgIFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIixcbiAgICAgIHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLmltYWdlTGF5b3V0LFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjYXJkIHRpdGxlIHBlciB0aGUgYHNsaWRlc1RpdGxlYCBzZXR0aW5nLiBcImZpbGVuYW1lXCIgcmVzdHlsZXNcbiAgICogdGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZSAoc3RpbGwgZWRpdGFibGUgXHUyMDE0IHR5cGluZ1xuICAgKiByZW5hbWVzIHRoZSBub3RlKTsgXCJcIiBzaG93cyBub3RoaW5nOyBhbnkgb3RoZXIgdmFsdWUgbmFtZXMgYSBmcm9udG1hdHRlclxuICAgKiBwcm9wZXJ0eSByZW5kZXJlZCByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudC5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgY29udGVudCA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICAgIGlmICghY29udGVudCB8fCAhZmlsZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3JjID0gdGhpcy5zZXR0aW5ncy5zbGlkZXNUaXRsZS50cmltKCk7XG5cbiAgICAvLyBcImZpbGVuYW1lXCI6IHJlc3R5bGUgdGhlIG5hdGl2ZSAuaW5saW5lLXRpdGxlIGludG8gdGhlIGNhcmQgdGl0bGUuIEl0XG4gICAgLy8gc3RheXMgY29udGVudGVkaXRhYmxlLCBzbyBlZGl0aW5nIGl0IHJlbmFtZXMgdGhlIG5vdGUgYXMgaW4gTGl2ZVxuICAgIC8vIFByZXZpZXcuIFRoZSBuYXRpdmUgaW5saW5lIHRpdGxlIGxpdmVzIG9uIHRoZSBtYXJrZG93bi1zb3VyY2Utdmlld1xuICAgIC8vIGVsZW1lbnQgKGEgc2libGluZyBicmFuY2ggb2YgdGhlIGNhcmQpLCBzbyB0aGUgc3R5bGluZyBob29rIGlzIGFcbiAgICAvLyB2aWV3IGF0dHJpYnV0ZSArIGEgYnJhbmQtbmV3IC5jbS1jb250ZW50IGF0dHJpYnV0ZSB0aGF0IHJlc2VydmVzIHRoZVxuICAgIC8vIHRpdGxlJ3MgaGVpZ2h0IHRoZSBzYW1lIHdheSB0aGUgcHNldWRvLWVsZW1lbnQgdmVyc2lvbiBkaWQuXG4gICAgY29uc3QgbmF0aXZlVGl0bGUgPSBzbGlkZXMgJiYgc3JjID09PSBcImZpbGVuYW1lXCI7XG4gICAgY29uc3Qgc291cmNlVmlldyA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1zb3VyY2Utdmlld1wiKTtcbiAgICBpZiAobmF0aXZlVGl0bGUgJiYgc291cmNlVmlldykgc291cmNlVmlldy5zZXRBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiLCBcImZpbGVuYW1lXCIpO1xuICAgIGVsc2Ugc291cmNlVmlldz8ucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1ucy1pbmxpbmUtdGl0bGVcIik7XG4gICAgY29udGVudC50b2dnbGVBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZS1uYXRpdmVcIiwgbmF0aXZlVGl0bGUpO1xuXG4gICAgLy8gUHJvcGVydHktYmFja2VkIHRpdGxlcyByZW5kZXIgcmVhZC1vbmx5IHZpYSB0aGUgOjpiZWZvcmUgcHNldWRvLWVsZW1lbnRcbiAgICAvLyAobm8gZWRpdGluZyBzdXJmYWNlIFx1MjAxNCB0aGUgcHJvcGVydGllcyBwYW5lbCBpcyBoaWRkZW4gaW4gU2xpZGVzIG1vZGUpLlxuICAgIGxldCB0ZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBpZiAoc2xpZGVzICYmIHNyYyAmJiBzcmMgIT09IFwiZmlsZW5hbWVcIikge1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICAgIGNvbnN0IHYgPSBmbT8uW3NyY107XG4gICAgICBpZiAodiAhPSBudWxsKSB0ZXh0ID0gZm9ybWF0VmFsdWUodik7XG4gICAgfVxuXG4gICAgaWYgKHRleHQpIGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIiwgdGV4dCk7XG4gICAgZWxzZSBjb250ZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpO1xuICB9XG5cbiAgLyoqIEVudGVyIFNsaWRlcyBtb2RlOiByZWNvcmQgdGhlIGV4aXQgc3RhdGUgYW5kIGZvcmNlIHRoZSBMaXZlIFByZXZpZXcgKi9cbiAgcHJpdmF0ZSBhc3luYyBlbnRlclNsaWRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAodmlldykge1xuICAgICAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBtb2RlPzogc3RyaW5nOyBzb3VyY2U/OiBib29sZWFuIH07XG4gICAgICB0aGlzLmV4aXRNb2RlID0gc3RhdGUubW9kZSA9PT0gXCJwcmV2aWV3XCIgPyBcInByZXZpZXdcIiA6IFwic291cmNlXCI7XG4gICAgICB0aGlzLmV4aXRTb3VyY2UgPSBzdGF0ZS5zb3VyY2UgPT09IHRydWU7XG4gICAgICAvLyBTbGlkZXMgbW9kZSBpcyBhbHdheXMgdGhlIGVkaXRhYmxlIExpdmUgUHJldmlld1xuICAgICAgY29uc3QgbmV4dCA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIG5leHQuc3RhdGUgPSB7IC4uLm5leHQuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogZmFsc2UgfTtcbiAgICAgIGF3YWl0IHZpZXcubGVhZi5zZXRWaWV3U3RhdGUobmV4dCwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMuc2xpZGVzTW9kZSA9IHRydWU7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgLy8gUGluIHRoZSBzY3JvbGxlciB0byB0aGUgdG9wIGJlZm9yZSBhbnkgZnJhbWUgcmVuZGVyczogdGhlIHZpZXctc3RhdGVcbiAgICAvLyBjaGFuZ2UgYWJvdmUgbWF5IHJlc3RvcmUgaXQgdG8gdGhlIHNhdmVkIGN1cnNvciBsaW5lIHdpdGhvdXQgZmlyaW5nIGFcbiAgICAvLyBzY3JvbGwgZXZlbnQgYWZ0ZXJ3YXJkcywgc28gdGhlIGNhcHR1cmUtcGhhc2UgcmVzZXQgYmVsb3cgd291bGQgbmV2ZXJcbiAgICAvLyBydW4gYW5kIGEgbG9uZyBub3RlIHdvdWxkIG9wZW4gbWlkLWRvY3VtZW50LlxuICAgIGZvciAoY29uc3QgZWwgb2Ygdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNtLXNjcm9sbGVyXCIpID8/IFtdKSB7XG4gICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgaWYgKGVsLnNjcm9sbExlZnQgIT09IDApIGVsLnNjcm9sbExlZnQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFeGl0IFNsaWRlcyBtb2RlOiByZXN0b3JlIHRoZSB2aWV3IG1vZGUgcmVjb3JkZWQgYXQgZW50cnkgKi9cbiAgcHJpdmF0ZSBleGl0U2xpZGVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIGlmICh0aGlzLmV4aXRNb2RlID09PSBcInByZXZpZXdcIikge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwicHJldmlld1wiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogdGhpcy5leGl0U291cmNlIH07XG4gICAgICB9XG4gICAgICB2b2lkIHZpZXcubGVhZi5zZXRWaWV3U3RhdGUoc3RhdGUsIHsgZm9jdXM6IGZhbHNlIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgU2xpZGVzIG1vZGUgKGRlY2sgbm90ZXMgb25seSBcdTIwMTQgZW5mb3JjZWQgYnkgdGhlIGNvbW1hbmQpICovXG4gIHRvZ2dsZVNsaWRlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlKSB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICBlbHNlIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgZm9yIHRoZSBhY3RpdmUgbm90ZSBvbmNlIGl0IGhhcyBiZWNvbWUgYSBkZWNrXG4gICAqIG5vdGUgXHUyMDE0IHVzZWQgYWZ0ZXIgYSBjb21tYW5kIHByb21vdGVzIGEgcGxhaW4gbm90ZSBpbnRvIGEgZGVjayAoZS5nLlxuICAgKiBcIk1ha2UgdGhpcyBub3RlIHRoZSBmaXJzdCBzbGlkZVwiKS4gTm8tb3Agd2hpbGUgU2xpZGVzIG1vZGUgaXMgYWxyZWFkeVxuICAgKiBhY3RpdmUgb3IgdGhlIGFjdGl2ZSBub3RlIGlzIG5vdCAoeWV0KSBhIGRlY2sgbm90ZS5cbiAgICovXG4gIGFzeW5jIGVudGVyU2xpZGVzRm9yQWN0aXZlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHJldHVybjtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUgfHwgIXRoaXMuaXNEZWNrTm90ZShmaWxlKSkgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgfVxuXG4gIC8qKiBSZXZlYWwgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsLCBjcmVhdGluZyBpdCBpbiB0aGUgcmlnaHQgc2lkZWJhciBpZiBuZWVkZWQgKi9cbiAgYXN5bmMgYWN0aXZhdGVTbGlkZXNQYW5lbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoU0xJREVTX1BBTkVMX1ZJRVcpO1xuICAgIGlmIChleGlzdGluZy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihleGlzdGluZ1swXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKTtcbiAgICBpZiAoIWxlYWYpIHJldHVybjtcbiAgICBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6IFNMSURFU19QQU5FTF9WSUVXLCBhY3RpdmU6IHRydWUgfSk7XG4gICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICAvKiogQXV0by1lbnRlciBTbGlkZXMgbW9kZSBvbmNlIHBlciBvcGVuZWQgZGVjayBub3RlIHdoZW4gdGhlIHNldHRpbmcgaXMgb24gKi9cbiAgcHJpdmF0ZSBtYXliZUF1dG9FbnRlclNsaWRlcygpOiB2b2lkIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUgfHwgZmlsZS5wYXRoID09PSB0aGlzLmF1dG9FbnRlcmVkUGF0aCkgcmV0dXJuO1xuICAgIHRoaXMuYXV0b0VudGVyZWRQYXRoID0gZmlsZS5wYXRoO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcyAmJiB0aGlzLmlzRGVja05vdGUoZmlsZSkgJiYgIXRoaXMuc2xpZGVzTW9kZSkge1xuICAgICAgdm9pZCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFBQVCBuYXZpZ2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIC8qKiBNb3ZlIG9uZSBzdGVwIGJhY2svZm9yd2FyZCBhbG9uZyB0aGUgZGVjayBjaGFpbiAoZW50ZXJpbmcgU2xpZGVzIG1vZGUgYXMgbmVlZGVkKSAqL1xuICBhc3luYyBuYXZpZ2F0ZShkaXJlY3Rpb246IFwicHJldlwiIHwgXCJuZXh0XCIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGlmICghZGVjaykgcmV0dXJuO1xuICAgIGNvbnN0IHRhcmdldCA9IGRlY2suY2hhaW5bZGlyZWN0aW9uID09PSBcInByZXZcIiA/IGRlY2suaW5kZXggLSAxIDogZGVjay5pbmRleCArIDFdO1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG4gICAgaWYgKCF0aGlzLnNsaWRlc01vZGUpIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB2b2lkIHRoaXMuYXBwLndvcmtzcGFjZS5vcGVuTGlua1RleHQodGFyZ2V0LCBmaWxlLnBhdGgpO1xuICB9XG5cbiAgLyoqIEp1bXAgdG8gYSBzcGVjaWZpYyBpbmRleCBpbiB0aGUgZGVjayBjaGFpbiAocHJvZ3Jlc3MgYmFyIGNsaWNrKSAqL1xuICBhc3luYyBqdW1wVG8oaW5kZXg6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgaWYgKCFkZWNrIHx8IGluZGV4IDwgMCB8fCBpbmRleCA+PSBkZWNrLmNoYWluLmxlbmd0aCB8fCBpbmRleCA9PT0gZGVjay5pbmRleCkgcmV0dXJuO1xuICAgIGNvbnN0IHRhcmdldCA9IGRlY2suY2hhaW5baW5kZXhdO1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG4gICAgaWYgKCF0aGlzLnNsaWRlc01vZGUpIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB2b2lkIHRoaXMuYXBwLndvcmtzcGFjZS5vcGVuTGlua1RleHQodGFyZ2V0LCBmaWxlLnBhdGgpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEJhciByZW5kZXJpbmcgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqXG4gICAqIEdldCBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIHRoZSBiYXIgcHJvcGVydGllcy4gUmV0dXJucyBhbiBhcnJheSBvZlxuICAgKiBwZXJjZW50YWdlcyAoc3VtbWluZyB0byAxMDApIGZvciBlYWNoIHByb3BlcnR5LiBMb2FkcyBmcm9tIHNldHRpbmdzIG9yXG4gICAqIGRlZmF1bHRzIHRvIGVxdWFsIGRpc3RyaWJ1dGlvbi5cbiAgICovXG4gIHByaXZhdGUgZ2V0QmFyUHJvcGVydHlXaWR0aHMoY291bnQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RvcmVkID0gSlNPTi5wYXJzZSh0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzIHx8IFwiW11cIikgYXMgdW5rbm93bjtcbiAgICAgIGlmIChpc051bWJlckxpc3Qoc3RvcmVkLCBjb3VudCkpIHJldHVybiBzdG9yZWQ7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmVcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBBcnJheTxudW1iZXI+KGNvdW50KS5maWxsKDEwMCAvIGNvdW50KTtcbiAgfVxuXG4gIC8qKiBTYXZlIGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyB0byBzZXR0aW5ncyAqL1xuICBwcml2YXRlIGFzeW5jIHNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHM6IG51bWJlcltdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0eVdpZHRocyA9IEpTT04uc3RyaW5naWZ5KHdpZHRocyk7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIC8qKiBEZWNpZGUgd2hhdCB0aGUgc2xpZGVzIGJhciBzaG93cywgdGhlbiByZS1yZW5kZXIgaXQgKi9cbiAgcmVmcmVzaCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYmFyKSByZXR1cm47XG4gICAgdGhpcy5hcHBseVRoZW1lQ2xhc3MoKTtcblxuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IG1vZGUgPSBjdXJyZW50TW9kZSh0aGlzLmFwcCk7XG4gICAgY29uc3QgaXNDYXJkID0gdGhpcy5pc0RlY2tOb3RlKGZpbGUpO1xuICAgIGNvbnN0IGxpdmVQcmV2aWV3Tm93ID0gbW9kZSA9PT0gXCJzb3VyY2VcIiAmJiBpc0xpdmVQcmV2aWV3KHRoaXMuYXBwKTtcblxuICAgIC8vIExlYXZpbmcgYSBkZWNrIG5vdGUsIG9yIGxlYXZpbmcgdGhlIExpdmUgUHJldmlldyAoZS5nLiBDbWQvQ3RybCtFIHRvXG4gICAgLy8gcmVhZGluZyB2aWV3KSwgZW5kcyBTbGlkZXMgbW9kZSBcdTIwMTQgb25seSB0aGUgdG9nZ2xlIGNvbW1hbmQgcmUtZW50ZXJzIGl0LlxuICAgIGlmICh0aGlzLnNsaWRlc01vZGUgJiYgKCFpc0NhcmQgfHwgIWxpdmVQcmV2aWV3Tm93KSkge1xuICAgICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gTWVhc3VyZSB0aGUgdGFiIGJhciB3aGlsZSBpdCBpcyBzdGlsbCB2aXNpYmxlIChTbGlkZXMgbW9kZSBoaWRlcyBpdFxuICAgIC8vIGJlbG93OyB0aGUgbGFzdCBtZWFzdXJlZCB2YWx1ZSBpcyByZXVzZWQgb25jZSBoaWRkZW4pLlxuICAgIHRoaXMudGFiQmFySGVpZ2h0ID0gc3luY1RhYkJhckhlaWdodCh0aGlzLnRhYkJhckhlaWdodCk7XG5cbiAgICAvLyBTbGlkZXMgbW9kZSBpcyBhY3RpdmUgb25seSB3aGlsZSBhY3R1YWxseSBpbiB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgY29uc3Qgc2xpZGVzID0gdGhpcy5zbGlkZXNNb2RlICYmIGlzQ2FyZCAmJiBsaXZlUHJldmlld05vdztcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIiwgc2xpZGVzKTtcbiAgICBpZiAoIXNsaWRlcykgdGhpcy5wb2ludGVySGlkZGVuID0gZmFsc2U7IC8vIGxlYXZpbmcgU2xpZGVzIHJlc3RvcmVzIHRoZSBwb2ludGVyXG4gICAgdGhpcy5zeW5jUG9pbnRlckNsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy5zeW5jSW1hZ2VMYXlvdXRDbGFzcyhzbGlkZXMpO1xuICAgIHRoaXMudXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzKTtcblxuICAgIGNvbnN0IGJhclZpc2libGUgPSBzbGlkZXMgJiYgdGhpcy5zZXR0aW5ncy5zaG93U2xpZGVzQmFyICYmICF0aGlzLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAvLyBXaGVuIGJhciBpcyBoaWRkZW4sIHNldCBib3R0b20gcGFkZGluZyB0byAwIHNvIHRoZSBjYXJkIGZpbGxzIHRoZSBmdWxsXG4gICAgLy8gd2luZG93IGhlaWdodC4gV2hlbiB2aXNpYmxlLCByZW1vdmUgdGhlIG92ZXJyaWRlIHNvIENTUyBmYWxscyBiYWNrIHRvXG4gICAgLy8gLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQgKGNsZWFycyB0aGUgYmFyIGFzIGJlZm9yZSkuXG4gICAgaWYgKGJhclZpc2libGUpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCI6IFwiMHB4XCIgfSk7XG4gICAgfVxuICAgIGlmICghYmFyVmlzaWJsZSkge1xuICAgICAgdGhpcy5iYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZmlsZSkgcmV0dXJuOyAvLyBiYXJWaXNpYmxlIGltcGxpZXMgYSBmaWxlLCBidXQgbmFycm93IGZvciBUeXBlU2NyaXB0XG5cbiAgICBjb25zdCBmbSA9IGFjdGl2ZUZyb250bWF0dGVyKHRoaXMuYXBwKTtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGNsZWFyQ2hpbGRyZW4odGhpcy5iYXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExlZnQ6IHByZXZpb3VzIC8gbmV4dCBidXR0b25zIChib3RoIGFsd2F5cyBzaG93biBpbnNpZGUgYSBkZWNrO1xuICAgIC8vICAgICAgICB0aGUgb25lIHRoYXQgY2Fubm90IG1vdmUgaXMgZGlzYWJsZWQgLyBsaWdodCBncmF5KSBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyAmJiBkZWNrKSB7XG4gICAgICBjb25zdCBoYXNQcmV2ID0gZGVjay5pbmRleCA+IDA7XG4gICAgICBjb25zdCBoYXNOZXh0ID0gZGVjay5pbmRleCA8IGRlY2suY2hhaW4ubGVuZ3RoIC0gMTtcbiAgICAgIGNvbnN0IG5hdiA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdlwiIH0pO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVDMFwiLCBcIlByZXZpb3VzIHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwicHJldlwiKSwgIWhhc1ByZXYpKTtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QjZcIiwgXCJOZXh0IHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwibmV4dFwiKSwgIWhhc05leHQpKTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKG5hdik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1pZGRsZTogY29uZmlndXJlZCBwcm9wZXJ0eSBjb2x1bW5zIHdpdGggZHJhZ2dhYmxlIGRpdmlkZXJzIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHByb3BOYW1lcyA9IHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydGllc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHByb3BOYW1lcy5sZW5ndGggPiAwICYmIGZtKSB7XG4gICAgICBjb25zdCBlbnRyaWVzOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwcm9wTmFtZXMpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gZm0pIHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBmbVtuYW1lXTtcbiAgICAgICAgICBpZiAodmFsICE9IG51bGwpIGVudHJpZXMucHVzaChbbmFtZSwgZm9ybWF0VmFsdWUodmFsKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3BlcnRpZXNcIiB9KTtcblxuICAgICAgICBjb25zdCB3aWR0aHMgPSB0aGlzLmdldEJhclByb3BlcnR5V2lkdGhzKGVudHJpZXMubGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBbLCB2YWx1ZV0gPSBlbnRyaWVzW2ldO1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLCB0ZXh0OiB2YWx1ZSB9KTtcbiAgICAgICAgICBpdGVtLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7d2lkdGhzW2ldfSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSA8IGVudHJpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY29uc3QgZGl2aWRlciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1kaXZpZGVyXCIgfSk7XG4gICAgICAgICAgICBkaXZpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICBjb25zdCBpbml0aWFsV2lkdGhzID0gWy4uLndpZHRoc107XG4gICAgICAgICAgICAgIGNvbnN0IG9uTW92ZSA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gKChldi5jbGllbnRYIC0gc3RhcnRYKSAvIGNvbnRhaW5lcldpZHRoKSAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMZWZ0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpXSArIGRlbHRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSaWdodCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaSArIDFdIC0gZGVsdGEpO1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpXSA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2kgKyAxXSA9IG5ld1JpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgXCIubmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld0xlZnR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2kgKyAxXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld1JpZ2h0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgY29uc3Qgb25VcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRDc3NTdHlsZXMoeyBjdXJzb3I6IFwiXCIsIHVzZXJTZWxlY3Q6IFwiXCIgfSk7XG4gICAgICAgICAgICAgICAgdm9pZCB0aGlzLnNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHMpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJjb2wtcmVzaXplXCIsIHVzZXJTZWxlY3Q6IFwibm9uZVwiIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2aWRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCcm9rZW4gZGVjayBsaW5rcyBcdTIxOTIgd2FybmluZyBjaGlwIHNvIGRlY2sgYXV0aG9ycyBzcG90IHR5cG9zXG4gICAgY29uc3QgYnJva2VuID0gZmlsZSA/IHRoaXMuZGVja1NlcnZpY2UuYnJva2VuKGZpbGUpIDogW107XG4gICAgaWYgKGJyb2tlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB3YXJuID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXdhcm5cIixcbiAgICAgICAgdGV4dDogXCJcdTI2QTAgXCIgKyBicm9rZW4uam9pbihcIiwgXCIpLFxuICAgICAgICBhdHRyOiB7IHRpdGxlOiBcIkJyb2tlbiBkZWNrIGxpbmsocykgXHUyMDE0IHRoZSB0YXJnZXQgbm90ZSBkb2VzIG5vdCBleGlzdFwiIH0sXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHdhcm4pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBCb3R0b20tcmlnaHQ6IGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXIgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlICE9PSBcIm5vbmVcIiAmJiBkZWNrKSB7XG4gICAgICAvLyB2MS4wLjAgbmV4dC1vbmx5IHNlbWFudGljczogY2hhaW5bMF0gaXMgdGhlIGhlYWQgc2xpZGUgPSBwYWdlIDE7XG4gICAgICAvLyB0b3RhbCBpcyB0aGUgZnVsbCBjaGFpbiBsZW5ndGguXG4gICAgICBjb25zdCB0b3RhbCA9IGRlY2suY2hhaW4ubGVuZ3RoO1xuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYWdlXCIsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPT09IFwiZnJhY3Rpb25cIlxuICAgICAgICAgICAgPyBgJHtkZWNrLmluZGV4ICsgMX0gLyAke3RvdGFsfWBcbiAgICAgICAgICAgIDogYCR7ZGVjay5pbmRleCArIDF9YCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFByb2dyZXNzIGluZGljYXRvcjogZGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IGJhciB0b3AgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1Byb2dyZXNzICYmIGRlY2sgJiYgZGVjay5jaGFpbi5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXByb2dyZXNzXCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlY2suY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBpIDwgZGVjay5pbmRleCA/IFwicGFzdFwiIDogaSA9PT0gZGVjay5pbmRleCA/IFwiY3VycmVudFwiIDogXCJmdXR1cmVcIjtcbiAgICAgICAgY29uc3Qgc2VnID0gY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IGBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZyBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZy0tJHtzdGF0ZX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB2b2lkIHRoaXMuanVtcFRvKGkpKTtcbiAgICAgICAgcHJvZ3Jlc3MuYXBwZW5kQ2hpbGQoc2VnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHRoZSBzbGlkZXMgYmFyIGVudGlyZWx5IHdoZW4gaXQgaGFzIG5vdGhpbmcgdG8gZGlzcGxheSAobm8gcHJvcGVydGllcyxcbiAgICAvLyBhbmQgbm90IHBhcnQgb2YgYSBkZWNrKVxuICAgIHRoaXMuYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IHRoaXMuYmFyLmNoaWxkRWxlbWVudENvdW50ID09PSAwID8gXCJub25lXCIgOiBcIlwiIH0pO1xuICB9XG59XG5cbi8qKiBXaGV0aGVyIGB2YWx1ZWAgaXMgYW4gYXJyYXkgb2YgZXhhY3RseSBgY291bnRgIG51bWJlcnMgKHN0b3JlZCBiYXIgd2lkdGhzKS4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyTGlzdCh2YWx1ZTogdW5rbm93biwgY291bnQ6IG51bWJlcik6IHZhbHVlIGlzIG51bWJlcltdIHtcbiAgcmV0dXJuIChcbiAgICBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IGNvdW50ICYmIHZhbHVlLmV2ZXJ5KChuKSA9PiB0eXBlb2YgbiA9PT0gXCJudW1iZXJcIilcbiAgKTtcbn1cbiIsICIvKiogQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50IChoaWRkZW4gdW50aWwgcmVmcmVzaCgpIHNob3dzIGl0KSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhcigpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGJhciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhclwiIH0pO1xuICBiYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gIGJhci50aXRsZSA9IFwiQ2xpY2sgdG8gcGFyayB0aGUgbW91c2UgXHUyMDE0IGhpZGVzIHRoZSBlZGl0b3IgY2FyZXQgd2hpbGUgcHJlc2VudGluZ1wiO1xuICAvLyBQcmVzZW50YXRpb24gcGFya2luZzogY2xpY2tpbmcgdGhlIGJhciBrZWVwcyBmb2N1cyBvdXQgb2YgdGhlIGVkaXRvciBzb1xuICAvLyB0aGUgYmxpbmtpbmcgY2FyZXQgZGlzYXBwZWFycy4gcHJldmVudERlZmF1bHQgc3RvcHMgdGhlIGNsaWNrIGZyb20gbW92aW5nXG4gIC8vIGZvY3VzIG9yIHN0YXJ0aW5nIGEgdGV4dCBzZWxlY3Rpb247IGJ1dHRvbnMgc3RpbGwgcmVjZWl2ZSB0aGVpciBjbGljayBldmVudC5cbiAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgYWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSBhY3RpdmUuYmx1cigpO1xuICB9KTtcbiAgcmV0dXJuIGJhcjtcbn1cblxuLyoqIEJ1aWxkIGEgXHUyNUMwIC8gXHUyNUI2IG5hdmlnYXRpb24gYnV0dG9uOyBgZGlzYWJsZWRgIHJlbmRlcnMgaXQgbGlnaHQgZ3JheS9pbmFjdGl2ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hdkJ1dHRvbihcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGlwOiBzdHJpbmcsXG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQsXG4gIGRpc2FibGVkID0gZmFsc2UsXG4pOiBIVE1MQnV0dG9uRWxlbWVudCB7XG4gIGNvbnN0IGJ0biA9IGNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1uYXYtYnRuXCIsXG4gICAgdGV4dDogbGFiZWwsXG4gICAgYXR0cjogeyB0aXRsZTogdGlwIH0sXG4gIH0pO1xuICBidG4uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgaWYgKCFkaXNhYmxlZCkgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSB0b3AgdGFiIGJhciBhbmQgZXhwb3NlIGl0cyBoZWlnaHQgYXMgdGhlIENTUyB2YXJpYWJsZVxuICogLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQsIHJldHVybmluZyB0aGUgKHBvc3NpYmx5IHVwZGF0ZWQpIGNhY2hlZFxuICogdmFsdWUuIFRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSwgc28gdGhlIGxhc3QgbWVhc3VyZWRcbiAqIHZhbHVlIGlzIHJldXNlZCB0aGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bmNUYWJCYXJIZWlnaHQoY2FjaGVkOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICBcIi53b3Jrc3BhY2UtdGFicy5tb2QtdG9wIC53b3Jrc3BhY2UtdGFiLWhlYWRlci1jb250YWluZXJcIixcbiAgKTtcbiAgaWYgKHRhYkJhciAmJiB0YWJCYXIub2Zmc2V0SGVpZ2h0ID4gMCkgY2FjaGVkID0gdGFiQmFyLm9mZnNldEhlaWdodDtcbiAgaWYgKGNhY2hlZCA+IDApIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0XCI6IGAke2NhY2hlZH1weGAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm8gbWVhc3VyZW1lbnQgeWV0ICh0YWIgYmFyIGhpZGRlbiBzaW5jZSBsb2FkKSBcdTIwMTQgbGV0IHRoZSBDU1MgZmFsbGJhY2sgYXBwbHkuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIik7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZDtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjb21wdXRlQ2FwYWNpdHksIGZvcm1hdENhcGFjaXR5LCBwcm9tcHRMb2NhbGUsIHR5cGUgU2xpZGVNZXRyaWNzIH0gZnJvbSBcIi4vY2FwYWNpdHktY29yZVwiO1xuXG4vKipcbiAqIGNhcGFjaXR5LnRzIFx1MjAxNCBvbmUtc2NyZWVuIGNhcGFjaXR5IG1lYXN1cmVtZW50IGZvciB0aGUgYWN0aXZlIFNsaWRlcyBub3RlLlxuICpcbiAqIFRoZSBcIkNvcHkgc2xpZGUgY2FwYWNpdHlcIiBjb21tYW5kIG1lYXN1cmVzIHRoZSBsaXZlIFNsaWRlcyBsYXlvdXQgb2YgdGhlXG4gKiBjdXJyZW50IG5vdGUgKHRoZSBvbmx5IGxheW91dCB0aGF0IG1hdHRlcnM6IGEgbmV3IHNsaWRlIG11c3QgZml0IGludG8gdGhlXG4gKiBzYW1lIHNjcmVlbikgYW5kIGZvcm1hdHMgdGhlIG51bWJlcnMgaW50byBhbiBBSS1yZWFkeSBwcm9tcHQ6XG4gKlxuICogICAtIHRoZSBzY3JlZW4gLyB0ZXh0LWFyZWEgZGltZW5zaW9ucyAoYmFyIGhlaWdodCwgdGl0bGUgcmVzZXJ2ZSwgcGFkZGluZ3NcbiAqICAgICBhcmUgcmVhZCBmcm9tIHRoZSBsaXZlIGNvbXB1dGVkIHN0eWxlcywgc28gXCJvbmUgc2NyZWVuXCIgYWx3YXlzIG1hdGNoZXNcbiAqICAgICBleGFjdGx5IHdoYXQgdGhlIHZpZXdlciBzZWVzKSxcbiAqICAgLSB0aGUgbGluZSBib3ggb2YgZXZlcnkgZWxlbWVudCB0eXBlIFx1MjAxNCBtZWFzdXJlZCBmaXJzdCAodGhlIGN1cnJlbnQgc2xpZGVcbiAqICAgICBpcyBhbHJlYWR5IG9uIHNjcmVlbiksIHRoZW4gZGVyaXZlZCBmcm9tIHRoZSBwaW5uZWQgU2xpZGVzIHR5cG9ncmFwaHlcbiAqICAgICB2YXJpYWJsZXMgKHN0eWxlcy5jc3MgXHUwMEE3OSBzZXRzIC0taDEtc2l6ZS8tLWgxLWxpbmUtaGVpZ2h0Ly0tcC1zcGFjaW5nL1x1MjAyNlxuICogICAgIG9uIHRoZSBzaXplcjsgY29kZSBibG9ja3MgYXJlIDFyZW0vMS41KSB3aGVuIHRoZSBub3RlIGhhcyBubyBpbnN0YW5jZVxuICogICAgIG9mIHRoYXQgdHlwZSxcbiAqICAgLSBjaGFycy1wZXItbGluZSBmb3IgbGF0aW4gYW5kIENKSyB2aWEgY2FudmFzIG1lYXN1cmVUZXh0LlxuICpcbiAqIFRoZSBtYXRoIGFuZCBwcm9tcHQgZm9ybWF0dGluZyBsaXZlIGluIHNyYy9jYXBhY2l0eS1jb3JlLnRzIChwdXJlLCB0ZXN0ZWQpO1xuICogdGhpcyBmaWxlIGlzIHRoZSBET00gZ2x1ZTogbWVhc3VyZW1lbnQgKyBjbGlwYm9hcmQuXG4gKiBUaGUgcHJvbXB0IGlzIGNvcGllZCB0byB0aGUgY2xpcGJvYXJkIChubyBvdGhlciBvdXRwdXQpOyB0aGUgbWVzc2FnZSB0ZXh0XG4gKiBmb2xsb3dzIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZSAoXCJ6aCpcIiBcdTIxOTIgQ2hpbmVzZSwgb3RoZXJ3aXNlIEVuZ2xpc2gpLlxuICovXG5cbmNvbnN0IHB4ID0gKHY6IHN0cmluZyk6IG51bWJlciA9PiBOdW1iZXIucGFyc2VGbG9hdCh2KTtcblxuY29uc3QgU0FNUExFX0xBVElOID1cbiAgXCJUaGUgcXVpY2sgYnJvd24gZm94IGp1bXBzIG92ZXIgdGhlIGxhenkgZG9nIDAxMjM0NTY3ODkgYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbmNvbnN0IFNBTVBMRV9DSksgPSBcIlx1NEUwMFx1NUM0Rlx1NEUwMFx1NTM2MVx1NUU3Qlx1NzA2Rlx1NzI0N1x1NTE4NVx1NUJCOVx1NkQ0Qlx1OTFDRlx1NzkzQVx1NEY4Qlx1RkYwQ1x1NkJDRlx1ODg0Q1x1NTNFRlx1NEVFNVx1NjM5Mlx1NEUwQlx1NTkxQVx1NUMxMVx1NEUyQVx1NUI1N1x1RkYxQVx1NTJBMFx1NTFDRlx1NEU1OFx1OTY2NFx1NzY3RVx1NTIwNlx1NkJENFx1MzAwMlwiO1xuXG4vKiogQXZlcmFnZSBjaGFyIHdpZHRoIChweCkgZm9yIGEgc2FtcGxlIHN0cmluZyBhdCB0aGUgZ2l2ZW4gZm9udCBzZXR0aW5ncyAqL1xuZnVuY3Rpb24gYXZnQ2hhcldpZHRoKGZvbnQ6IHN0cmluZywgc2FtcGxlOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBpZiAoIWN0eCkgcmV0dXJuIDI0O1xuICBjdHguZm9udCA9IGZvbnQ7XG4gIHJldHVybiBjdHgubWVhc3VyZVRleHQoc2FtcGxlKS53aWR0aCAvIHNhbXBsZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGxpbmVCb3goZWw6IEhUTUxFbGVtZW50KTogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB7XG4gIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGNvbnN0IGZzID0gcHgoY3MuZm9udFNpemUpO1xuICBjb25zdCBsaFJhdyA9IGNzLmxpbmVIZWlnaHQ7XG4gIHJldHVybiB7IGZvbnRTaXplOiBmcywgbGluZUhlaWdodDogcHgobGhSYXcpID4gMCA/IHB4KGxoUmF3KSA6IGZzICogMS41IH07XG59XG5cbi8qKlxuICogTWVhc3VyZSB0aGUgYWN0aXZlIFNsaWRlcyB2aWV3LiBSZXR1cm5zIG51bGwgd2hlbiBubyBTbGlkZXMgbGF5b3V0IGlzXG4gKiBhY3RpdmUgKHRoZSBjb21tYW5kIGlzIG9ubHkgcmVhY2hhYmxlIHRoZXJlLCBidXQgdGhlIGd1YXJkIGlzIGNoZWFwKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lYXN1cmVTbGlkZXMoYXBwOiBBcHApOiBTbGlkZU1ldHJpY3MgfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCByb290ID0gdmlldy5jb250ZW50RWw7XG4gIGNvbnN0IHNjcm9sbGVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zY3JvbGxlclwiKTtcbiAgY29uc3QgY29udGVudCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgaWYgKCFzY3JvbGxlciB8fCAhY29udGVudCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY3NTY3JvbGwgPSBnZXRDb21wdXRlZFN0eWxlKHNjcm9sbGVyKTtcbiAgY29uc3QgY3NDb250ZW50ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50KTtcblxuICBjb25zdCBzY3JlZW5IID0gc2Nyb2xsZXIuY2xpZW50SGVpZ2h0O1xuICBjb25zdCB0ZXh0VG9wUGFkID0gcHgoY3NTY3JvbGwucGFkZGluZ1RvcCk7XG4gIGNvbnN0IHRleHRCb3R0b21QYWQgPSBweChjc1Njcm9sbC5wYWRkaW5nQm90dG9tKTtcbiAgY29uc3QgY2FyZFBhZFRvcCA9IHB4KGNzQ29udGVudC5wYWRkaW5nVG9wKTtcbiAgY29uc3QgY2FyZFBhZEJvdHRvbSA9IHB4KGNzQ29udGVudC5wYWRkaW5nQm90dG9tKTtcblxuICBjb25zdCBoYXNUaXRsZSA9XG4gICAgY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKSB8fCBjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiKTtcbiAgLy8gV2l0aCBhIHRpdGxlLCB0aGUgY2FyZCdzIHRvcCBwYWRkaW5nIGdyb3dzIGJ5IHRoZSByZXNlcnZlZCB0aXRsZSBibG9ja1xuICAvLyAocGFkZGluZ1RvcCAtIHBhZGRpbmdCb3R0b20gaXMgdGhlIGRlbHRhOyBib3RoIGFyZSAtLW5zLXBhZC15IG5vcm1hbGx5KS5cbiAgY29uc3QgdGl0bGVSZXNlcnZlZCA9IGhhc1RpdGxlXG4gICAgPyBNYXRoLnJvdW5kKE1hdGgubWF4KDAsIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCkgLyAxMDBcbiAgICA6IDA7XG5cbiAgY29uc3QgdGV4dEhlaWdodCA9XG4gICAgTWF0aC5yb3VuZChcbiAgICAgIE1hdGgubWF4KDAsIHNjcmVlbkggLSB0ZXh0VG9wUGFkIC0gdGV4dEJvdHRvbVBhZCAtIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCxcbiAgICApIC8gMTAwO1xuXG4gIGNvbnN0IHRleHRXaWR0aCA9IGNvbnRlbnQuY2xpZW50V2lkdGggLSBweChjc0NvbnRlbnQucGFkZGluZ0xlZnQpIC0gcHgoY3NDb250ZW50LnBhZGRpbmdSaWdodCk7XG4gIGNvbnN0IHZpZXdwb3J0V2lkdGggPSBzY3JvbGxlci5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSBzY3JlZW5IO1xuXG4gIC8vIFRoZSBzbGlkZXMgYmFyIGlzIGFwcGVuZGVkIHRvIGRvY3VtZW50LmJvZHkgKG5vdCB0aGUgdmlldydzIGNvbnRlbnRFbClcbiAgY29uc3QgYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubmF0aXZlLXNsaWRlcy1iYXJcIik7XG4gIGNvbnN0IGJhclZpc2libGUgPSBiYXIgIT09IG51bGwgJiYgZ2V0Q29tcHV0ZWRTdHlsZShiYXIpLmRpc3BsYXkgIT09IFwibm9uZVwiO1xuICBjb25zdCBiYXJIZWlnaHQgPSBiYXIgJiYgYmFyVmlzaWJsZSA/IGJhci5vZmZzZXRIZWlnaHQgOiAwO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBlbGVtZW50IGxpbmUgYm94ZXM6IG1lYXN1cmUgZmlyc3QgaXRlbSBvZiBlYWNoIHR5cGUgcHJlc2VudCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgaGVhZGVyID0gKGNsczogc3RyaW5nKSA9PiByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGAuY20tY29udGVudCAke2Nsc31gKTtcbiAgY29uc3QgaDFFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMVwiKTtcbiAgY29uc3QgaDJFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMlwiKTtcbiAgY29uc3QgaDNFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItM1wiKTtcbiAgY29uc3QgYnVsbGV0RWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgLkh5cGVyTUQtbGlzdC1saW5lXCIpO1xuICBjb25zdCBjb2RlRWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgcHJlLCAuY20tY29udGVudCAuSHlwZXJNRC1jb2RlYmxvY2tcIik7XG4gIGNvbnN0IGltZ0VsID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50IGltZzpub3QoLmNtLXdpZGdldEJ1ZmZlcilcIik7XG5cbiAgLy8gQSBwbGFpbiBib2R5IGxpbmUgXHUyMDE0IHNraXAgaGVhZGVycywgbGlzdCBsaW5lcywgY29kZSwgcXVvdGVzIGFuZCBlbXB0eVxuICAvLyBsaW5lcyAoQ00gcmVuZGVycyBvbmx5IHZpc2libGUgbGluZXM7IGluIFNsaWRlcyBtb2RlIHRoZSBmaXJzdCBzY3JlZW5cbiAgLy8gaXMgZXhhY3RseSB0aGVtKS4gQW4gZW1wdHkgbGluZSBib3ggKGEgYmxhbmsgcm93LCB+OHB4KSBpcyBub3QgYSB1c2VmdWxcbiAgLy8gYm9keSBzYW1wbGUsIHNvIHBpY2sgdGhlIGZpcnN0IGNhbmRpZGF0ZSB3aXRoIGFjdHVhbCB0ZXh0LlxuICBjb25zdCBib2R5RWwgPVxuICAgIEFycmF5LmZyb20oXG4gICAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICBcIi5jbS1jb250ZW50IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpOm5vdCguSHlwZXJNRC1saXN0LWxpbmUpOm5vdCguSHlwZXJNRC1xdW90ZSk6bm90KC5IeXBlck1ELWNvZGVibG9jaylcIixcbiAgICAgICksXG4gICAgKS5maW5kKChlbCkgPT4gZWwudGV4dENvbnRlbnQgIT09IG51bGwgJiYgZWwudGV4dENvbnRlbnQudHJpbSgpLmxlbmd0aCA+IDApID8/IGNvbnRlbnQ7XG5cbiAgY29uc3QgYm9keSA9IGxpbmVCb3goYm9keUVsKTtcbiAgY29uc3QgaDEgPSBoMUVsID8gbGluZUJveChoMUVsKSA6IG51bGw7XG4gIGNvbnN0IGgyID0gaDJFbCA/IGxpbmVCb3goaDJFbCkgOiBudWxsO1xuICBjb25zdCBoMyA9IGgzRWwgPyBsaW5lQm94KGgzRWwpIDogbnVsbDtcblxuICBjb25zdCBjcyA9IChlbDogSFRNTEVsZW1lbnQpOiBDU1NTdHlsZURlY2xhcmF0aW9uID0+IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICBsZXQgYnVsbGV0OiB7IGl0ZW1IZWlnaHQ6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG4gIGlmIChidWxsZXRFbCkge1xuICAgIGNvbnN0IGMgPSBjcyhidWxsZXRFbCk7XG4gICAgYnVsbGV0ID0ge1xuICAgICAgaXRlbUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSArIHB4KGMucGFkZGluZ1RvcCkgKyBweChjLnBhZGRpbmdCb3R0b20pLFxuICAgIH07XG4gIH1cblxuICBsZXQgY29kZTogeyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGwgPSBudWxsO1xuICBpZiAoY29kZUVsKSB7XG4gICAgY29uc3QgYyA9IGNzKGNvZGVFbCk7XG4gICAgY29kZSA9IHsgbGluZUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSA+IDAgPyBweChjLmxpbmVIZWlnaHQpIDogcHgoYy5mb250U2l6ZSkgKiAxLjUgfTtcbiAgfVxuXG4gIGNvbnN0IGltYWdlSGVpZ2h0ID1cbiAgICBpbWdFbCAmJiBpbWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgPiAwXG4gICAgICA/IE1hdGgucm91bmQoaW1nRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KVxuICAgICAgOiBudWxsO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBkZXJpdmUgbWlzc2luZyBlbGVtZW50IGJveGVzIGZyb20gdGhlIHBpbm5lZCBTbGlkZXMgdHlwb2dyYXBoeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gc3R5bGVzLmNzcyBcdTAwQTc5IGRlY2xhcmVzIHRoZSBzbGlkZSB0eXBvZ3JhcGh5IG9uIHRoZSBzaXplclxuICAvLyAoLS1oMS1zaXplOiAxLjRlbTsgLS1oMS1saW5lLWhlaWdodDogMS40MzsgXHUyMDI2KSBhbmQgXHUwMEE3NyBwaW5zIGNvZGUgYmxvY2tzXG4gIC8vIHRvIDFyZW0vMS41IFx1MjAxNCBhIG5vdGUgd2l0aG91dCB0aGF0IGVsZW1lbnQgdHlwZSBzdGlsbCByZXBvcnRzIGl0cyBib3guXG4gIGNvbnN0IHNpemVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zaXplclwiKTtcbiAgY29uc3Qgc2l6ZXJTdHlsZSA9IHNpemVyID8gY3Moc2l6ZXIpIDogbnVsbDtcbiAgY29uc3QgZGVyaXZlQm94ID0gKHNpemVWYXI6IHN0cmluZywgbGhWYXI6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGVtID0gc2l6ZXJTdHlsZSA/IHB4KHNpemVyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzaXplVmFyKSkgOiBOYU47XG4gICAgY29uc3QgbGggPSBzaXplclN0eWxlID8gcHgoc2l6ZXJTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKGxoVmFyKSkgOiBOYU47XG4gICAgY29uc3QgZm9udFNpemUgPSBlbSA+IDAgPyBlbSAqIGJvZHkuZm9udFNpemUgOiBib2R5LmZvbnRTaXplO1xuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSBsaCA+IDAgPyBsaCAqIGZvbnRTaXplIDogYm9keS5saW5lSGVpZ2h0O1xuICAgIHJldHVybiB7IGZvbnRTaXplLCBsaW5lSGVpZ2h0IH07XG4gIH07XG4gIGNvbnN0IGRlcml2ZUgxID0gZGVyaXZlQm94KFwiLS1oMS1zaXplXCIsIFwiLS1oMS1saW5lLWhlaWdodFwiKTtcbiAgY29uc3QgZGVyaXZlSDIgPSBkZXJpdmVCb3goXCItLWgyLXNpemVcIiwgXCItLWgyLWxpbmUtaGVpZ2h0XCIpO1xuICBjb25zdCBkZXJpdmVIMyA9IGRlcml2ZUJveChcIi0taDMtc2l6ZVwiLCBcIi0taDMtbGluZS1oZWlnaHRcIik7XG4gIGNvbnN0IGRlcml2ZUNvZGUgPSAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdEZvbnQgPSBweChnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUpO1xuICAgIHJldHVybiB7IGxpbmVIZWlnaHQ6IHJvb3RGb250ICogMS41IH07XG4gIH07XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGNoYXIgd2lkdGhzIGF0IHRoZSBib2R5IGZvbnQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IGZvbnRGYW1pbHkgPSBjcyhjb250ZW50KS5mb250RmFtaWx5O1xuICBjb25zdCBmb250ID0gYDQwMCAke2JvZHkuZm9udFNpemV9cHggJHtmb250RmFtaWx5fWA7XG4gIGNvbnN0IGNoYXIgPSB7XG4gICAgbGF0aW46IGF2Z0NoYXJXaWR0aChmb250LCBTQU1QTEVfTEFUSU4pLFxuICAgIGNqazogYXZnQ2hhcldpZHRoKGZvbnQsIFNBTVBMRV9DSkspLFxuICB9O1xuXG4gIC8vIE1lYXN1cmVkIHdpbnM7IGRlcml2YXRpb24gZmlsbHMgdGhlIGdhcHMgZm9yIGFic2VudCB0eXBlcy5cbiAgcmV0dXJuIHtcbiAgICB2aWV3cG9ydDogeyB3aWR0aDogdmlld3BvcnRXaWR0aCwgaGVpZ2h0OiB2aWV3cG9ydEhlaWdodCB9LFxuICAgIHRleHQ6IHsgd2lkdGg6IHRleHRXaWR0aCwgaGVpZ2h0OiB0ZXh0SGVpZ2h0IH0sXG4gICAgYmFyOiB7XG4gICAgICB2aXNpYmxlOiBiYXJWaXNpYmxlLFxuICAgICAgaGVpZ2h0OiBiYXJIZWlnaHQsXG4gICAgfSxcbiAgICB0aXRsZVJlc2VydmVkOiBNYXRoLnJvdW5kKHRpdGxlUmVzZXJ2ZWQgKiAxMDApIC8gMTAwLFxuICAgIGJvZHksXG4gICAgaDE6IGgxID8/IGRlcml2ZUgxLFxuICAgIGgyOiBoMiA/PyBkZXJpdmVIMixcbiAgICBoMzogaDMgPz8gZGVyaXZlSDMsXG4gICAgYnVsbGV0LFxuICAgIGNvZGU6IGNvZGUgPz8gZGVyaXZlQ29kZSgpLFxuICAgIGltYWdlSGVpZ2h0LFxuICAgIGNoYXIsXG4gIH07XG59XG5cbi8qKlxuICogRW50cnkgcG9pbnQgb2YgdGhlIFwiQ29weSBzbGlkZSBjYXBhY2l0eVwiIGNvbW1hbmQ6IG1lYXN1cmUsIGZvcm1hdCxcbiAqIHdyaXRlIHRvIHRoZSBjbGlwYm9hcmQuIFJ1bnMgb25seSBmcm9tIFNsaWRlcyBtb2RlIChjb21tYW5kIGdhdGUpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29weUNhcGFjaXR5UHJvbXB0KGFwcDogQXBwKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG0gPSBtZWFzdXJlU2xpZGVzKGFwcCk7XG4gIGlmICghbSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgbWVhc3VyZSB0aGUgU2xpZGVzIGxheW91dFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcHJvbXB0ID0gZm9ybWF0Q2FwYWNpdHkobSwgY29tcHV0ZUNhcGFjaXR5KG0pLCBwcm9tcHRMb2NhbGUoKSk7XG4gIHRyeSB7XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocHJvbXB0KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjbGlwYm9hcmQgd3JpdGUgZmFpbGVkICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG4iLCAiLyoqXG4gKiBjYXBhY2l0eS1jb3JlLnRzIFx1MjAxNCBwdXJlIGNhcGFjaXR5IG1hdGggKyBwcm9tcHQgZm9ybWF0dGluZyBmb3IgU2xpZGVzLlxuICpcbiAqIFRoaXMgbW9kdWxlIGlzIERPTS1mcmVlIGFuZCB1bml0LXRlc3RlZCAobGlrZSBzcmMvZGVjay50cykuIEl0IHR1cm5zXG4gKiBtZWFzdXJlZCBudW1iZXJzIChmcm9tIHNyYy9jYXBhY2l0eS50cykgaW50byBhIG9uZS1zY3JlZW4gY2FwYWNpdHlcbiAqIHJlcG9ydDogaG93IG1hbnkgYm9keSBsaW5lcyAvIGJ1bGxldHMgLyBIMSBsaW5lcyBmaXQgdGhlIGFjdGl2ZSB0ZXh0XG4gKiBhcmVhLCB3aXRoIHBlci1lbGVtZW50IGxpbmUgYm94ZXMsIGFuZCBmb3JtYXRzIHRoZW0gaW50byBhbiBBSS1yZWFkeVxuICogcHJvbXB0IGluIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZS5cbiAqL1xuXG4vKiogUmF3IGxpdmUtbGF5b3V0IG1lYXN1cmVtZW50cyBvZiB0aGUgYWN0aXZlIFNsaWRlcyBub3RlICovXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlTWV0cmljcyB7XG4gIC8qKiBTY3JlZW4gKHZpZXdwb3J0KSBzaXplIGluIENTUyBweCAqL1xuICB2aWV3cG9ydDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICAvKiogQXZhaWxhYmxlIHRleHQgYXJlYSAoc2NyZWVuIG1pbnVzIHNjcm9sbGVyIHBhZGRpbmdzLCBjYXJkIHBhZGRpbmcsIHRpdGxlKSAqL1xuICB0ZXh0OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBTbGlkZXMgYmFyIHN0YXRlIFx1MjAxNCBpdHMgaGVpZ2h0IGlzIG9uIHRoZSBwYWdlOyB0aGUgbnVtYmVyIGlzIGluZm9ybWF0aW9uYWwgKi9cbiAgYmFyOiB7IHZpc2libGU6IGJvb2xlYW47IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBWZXJ0aWNhbCBzcGFjZSByZXNlcnZlZCBmb3IgdGhlIGNhcmQgdGl0bGUgKDAgPSBubyB0aXRsZSkgKi9cbiAgdGl0bGVSZXNlcnZlZDogbnVtYmVyO1xuICAvKiogQm9keSBwYXJhZ3JhcGggbWV0cmljcyAoZm9udCBzaXplIC8gbGluZSBib3gsIHB4KSAqL1xuICBib2R5OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9O1xuICAvKiogSGVhZGluZyBsaW5lIGJveGVzIChweCkgXHUyMDE0IG51bGwgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSBvZiB0aGlzIGxldmVsICovXG4gIGgxOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgaDI6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICBoMzogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgYnVsbGV0IGl0ZW0ncyB0b3RhbCBoZWlnaHQgKGxpbmUgYm94ICsgbGlzdCBwYWRkaW5ncywgcHgpICovXG4gIGJ1bGxldDogeyBpdGVtSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgY29kZSBsaW5lJ3MgYm94IChmb250IDFyZW0gaW4gU2xpZGVzOyBtZWFzdXJlZCB3aGVuIGEgYmxvY2sgZXhpc3RzKSAqL1xuICBjb2RlOiB7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIEhlaWdodCBvZiB0aGUgZmlyc3QgcmVuZGVyZWQgaW1hZ2UgKHB4KTsgbnVsbCB3aGVuIHRoZSBub3RlIGhhcyBub25lICovXG4gIGltYWdlSGVpZ2h0OiBudW1iZXIgfCBudWxsO1xuICAvKiogQXZlcmFnZSBjaGFyYWN0ZXIgd2lkdGhzIChweCkgYXQgdGhlIGJvZHkgZm9udCAqL1xuICBjaGFyOiB7IGxhdGluOiBudW1iZXI7IGNqazogbnVtYmVyIH07XG59XG5cbi8qKiBEZXJpdmVkIGNhcGFjaXR5IGNvdW50cyAocHVyZTsgdGFrZXMgbnVtYmVycywgbm90IHRoZSBET00pICovXG5leHBvcnQgaW50ZXJmYWNlIENhcGFjaXR5UmVzdWx0IHtcbiAgLyoqIEJvZHkgdGV4dCBsaW5lcyB0aGF0IGZpdCBvbmUgc2NyZWVuICovXG4gIGJvZHlMaW5lczogbnVtYmVyO1xuICAvKiogQnVsbGV0IGl0ZW1zIHRoYXQgZml0IG9uZSBzY3JlZW4gKGZ1bGwgbGlzdCkgKi9cbiAgYnVsbGV0czogbnVtYmVyO1xuICAvKiogSDEgbGluZXMgdGhhdCBmaXQgKG9uZSBwZXIgSDEgbGluZSBib3gpICovXG4gIGgxTGluZXM6IG51bWJlcjtcbiAgLyoqIEV4YW1wbGVzOiBjb3VudCBvZiBhIHNlY29uZCBibG9jayB0eXBlIGFmdGVyIG9uZSBmaXJzdCBibG9jayAqL1xuICBjb21ib3M6IHtcbiAgICBhZnRlckgxQnVsbGV0czogbnVtYmVyO1xuICAgIGFmdGVySDJCdWxsZXRzOiBudW1iZXI7XG4gICAgYWZ0ZXJIMUJvZHlMaW5lczogbnVtYmVyO1xuICB9O1xufVxuXG4vKipcbiAqIERlcml2ZWQgY2FwYWNpdHkgZnJvbSByYXcgbWV0cmljcyBcdTIwMTQgcHVyZSBhbmQgZGV0ZXJtaW5pc3RpYy5cbiAqIEV2ZXJ5IG51bWJlciBmbG9vcnMgKGJsb2NrcyBhcmUgZGlzY3JldGUpOyBhIG5lZ2F0aXZlIHJlc3VsdCBpcyBjbGFtcGVkIHRvIDAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlQ2FwYWNpdHkobTogU2xpZGVNZXRyaWNzKTogQ2FwYWNpdHlSZXN1bHQge1xuICBjb25zdCBIID0gbS50ZXh0LmhlaWdodDtcbiAgY29uc3QgZmxvb3IgPSAobjogbnVtYmVyKTogbnVtYmVyID0+IE1hdGgubWF4KDAsIE1hdGguZmxvb3IobikpO1xuICBjb25zdCBib2R5TGluZXMgPSBmbG9vcihIIC8gbS5ib2R5LmxpbmVIZWlnaHQpO1xuXG4gIGNvbnN0IGJ1bGxldEggPSBtLmJ1bGxldD8uaXRlbUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYnVsbGV0cyA9IGZsb29yKEggLyBidWxsZXRIKTtcblxuICBjb25zdCBoMUggPSBtLmgxPy5saW5lSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBoMUxpbmVzID0gZmxvb3IoSCAvIGgxSCk7XG5cbiAgY29uc3QgaDJIID0gbS5oMj8ubGluZUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYWZ0ZXJTcGFuID0gKGZpcnN0SDogbnVtYmVyLCBpdGVtSDogbnVtYmVyKTogbnVtYmVyID0+IGZsb29yKChIIC0gZmlyc3RIKSAvIGl0ZW1IKTtcblxuICByZXR1cm4ge1xuICAgIGJvZHlMaW5lcyxcbiAgICBidWxsZXRzLFxuICAgIGgxTGluZXMsXG4gICAgY29tYm9zOiB7XG4gICAgICBhZnRlckgxQnVsbGV0czogYWZ0ZXJTcGFuKGgxSCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgyQnVsbGV0czogYWZ0ZXJTcGFuKGgySCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgxQm9keUxpbmVzOiBhZnRlclNwYW4oaDFILCBtLmJvZHkubGluZUhlaWdodCksXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIExvY2FsZSBvZiB0aGUgZ2VuZXJhdGVkIHByb21wdDogXCJ6aFwiIGZvciBDaGluZXNlLCBvdGhlcndpc2UgRW5nbGlzaCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb21wdExvY2FsZSgpOiBcInpoXCIgfCBcImVuXCIge1xuICBjb25zdCBsYW5nID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgID8gKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpID8/IG5hdmlnYXRvci5sYW5ndWFnZSA/PyBcImVuXCIpXG4gICAgICA6IFwiZW5cIjtcbiAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiemhcIikgPyBcInpoXCIgOiBcImVuXCI7XG59XG5cbmZ1bmN0aW9uIGZtdChuOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihuKSA/IFN0cmluZyhuKSA6IG4udG9GaXhlZCgxKTtcbn1cblxuLyoqIEh1bWFuLXJlYWRhYmxlIGxpc3Qgb2YgdGhlIG1lYXN1cmVkIGVsZW1lbnQgbGluZSBib3hlcyAqL1xuZnVuY3Rpb24gYm94U3RyKGtpbmQ6IHN0cmluZywgYm94OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbCk6IHN0cmluZyB7XG4gIGlmICghYm94KSByZXR1cm4gYCR7a2luZH06IC1gO1xuICByZXR1cm4gYCR7a2luZH06ICR7Zm10KGJveC5saW5lSGVpZ2h0KX1weC9saW5lIChmb250ICR7Zm10KGJveC5mb250U2l6ZSl9cHgpYDtcbn1cblxuLyoqIEhvdyBOYXRpdmUgU2xpZGVzIHdvcmtzIFx1MjAxNCB0aGUgY29udGV4dCBhbiBhZ2VudCBuZWVkcyBiZWZvcmUgZ2VuZXJhdGluZyAqL1xuZnVuY3Rpb24gZW5Db250ZXh0KCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtcbiAgICBgVGhpcyBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIHVzZWQgYnkgdGhlIE9ic2lkaWFuIHBsdWdpbiBcIk5hdGl2ZSBTbGlkZXNcIi4gVGhlIHBsdWdpbiB0dXJucyBtYXJrZG93biBub3RlcyBpbnRvIHNsaWRlczogYSBkZWNrIGlzIGFuIG9yZGVyZWQgY2hhaW4gb2Ygbm90ZXMsIGVhY2ggbm90ZSBpcyBPTkUgc2xpZGUgc2hvd24gYXMgYW4gaW1tZXJzaXZlLCBvbmUgc2NyZWVuID0gb25lIGNhcmQgdmlldyAoZWFjaCBzbGlkZSBhbHdheXMgc3RhcnRzIGF0IHRoZSB0b3Agb2YgaXRzIG5vdGUpLmAsXG4gICAgYGAsXG4gICAgYEhvdyB0byBidWlsZCBhIHNsaWRlcyBkZWNrOmAsXG4gICAgYC0gQSBzbGlkZSBpcyBhbiBvcmRpbmFyeSBtYXJrZG93biBub3RlIGluIHRoZSB2YXVsdDsgdGhlIG9ubHkgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgaXMgZGVjayBcdTIwMTQgb25lIGxpbmsgdG8gdGhlIE5FWFQgc2xpZGUgKGUuZy4gZGVjazogW1wiW1tzbGlkZS0yXV1cIl0sIG9yIGRlY2s6IFtdIGZvciB0aGUgbGFzdCBzbGlkZSkuIFRoZSBjaGFpbiBvcmRlciBpcyB0aGUgcHJlc2VudGF0aW9uIG9yZGVyOyBwYWdlIG51bWJlcnMgYXJlIGF1dG8tY29tcHV0ZWQuYCxcbiAgICBgLSBDcmVhdGUgYSBuZXcgZGVjayB3aXRoIHRoZSBjb21tYW5kIFwiQ3JlYXRlIG5ldyBzbGlkZVwiIChmcmVzaCBub3RlLCBkZWNrOiBbXSkuIEFkZCBwYWdlcyB3aXRoIFwiQ3JlYXRlIG5leHQgc2xpZGVcIiBcdTIwMTQgaXQgd2lyZXMgdGhlIGRlY2sgbGlua3MgYXV0b21hdGljYWxseSAodGhlIGN1cnJlbnQgbm90ZSdzIGRlY2sgbGluayBpcyBwb2ludGVkIGF0IHRoZSBuZXcgbm90ZSwgdGhlIG5ldyBub3RlIGdldHMgdGhlIG9sZCB0YXJnZXQpLmAsXG4gICAgYC0gQ29udGVudCBpcyB3cml0dGVuIGluIHBsYWluIG1hcmtkb3duIGFuZCByZW5kZXJlZCBvbiB0aGUgY2FyZCBpbiB0aGUgbm90ZSdzIGxhbmd1YWdlIHdoZW4gcG9zc2libGUuIEtlZXAgZXZlcnkgc2xpZGUgd2l0aGluIG9uZSBzY3JlZW4gXHUyMDE0IHRoZSBjYXBhY2l0eSBudW1iZXJzIGJlbG93IGFyZSB0aGUgZml0IGJ1ZGdldCAodGhleSBhbHJlYWR5IHN1YnRyYWN0IHRoZSBzbGlkZXMgYmFyIGFuZCB0aGUgY2FyZCB0aXRsZSkuYCxcbiAgICBgLSBUaGUgdXNlcidzIHJlcXVlc3QgY29tZXMgZmlyc3Q6IGZvbGxvdyB3aGF0IHRoZSB1c2VyIGFza2VkIGZvciAoXCJmb3IgbWF0ZXJpYWwgWCBtYWtlIGEgc2xpZGVzIGRlY2tcIiksIHVzaW5nIHRoZSBwbHVnaW4ncyBjb252ZW50aW9ucyBhYm92ZSBhcyB0aGUgZm9ybSwgbm90IGFzIHRoZSBjb250ZW50LmAsXG4gIF07XG59XG5cbmZ1bmN0aW9uIHpoQ29udGV4dCgpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXG4gICAgYFx1NjcyQ1x1N0IxNFx1OEJCMFx1NUM1RVx1NEU4RSBPYnNpZGlhbiBcdTYzRDJcdTRFRjYgXCJOYXRpdmUgU2xpZGVzXCIgXHU3Njg0IGRlY2sgXHU3QjE0XHU4QkIwXHUzMDAyXHU4QkU1XHU2M0QyXHU0RUY2XHU2MjhBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1NTNEOFx1NjIxMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYxQVx1NEUwMFx1NEUyQSBkZWNrIFx1NUMzMVx1NjYyRlx1NEUwMFx1N0VDNFx1NjcwOVx1NUU4Rlx1OTRGRVx1NjNBNVx1NzY4NFx1N0IxNFx1OEJCMFx1RkYwQ1x1NkJDRlx1N0JDN1x1N0IxNFx1OEJCMFx1NUMzMVx1NjYyRlx1NEUwMFx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYwQ1x1NEVFNVwiXHU0RTAwXHU1QzRGXHU0RTAwXHU1MzYxXCJcdTc2ODRcdTZDODlcdTZENzhcdTVGMEZcdTUzNjFcdTcyNDdcdTg5QzZcdTU2RkVcdTVDNTVcdTc5M0FcdUZGMDhcdTZCQ0ZcdTVGMjBcdTVFN0JcdTcwNkZcdTcyNDdcdTkwRkRcdTRFQ0VcdTdCMTRcdThCQjBcdTVGMDBcdTU5MzRcdTVGMDBcdTU5Q0JcdUZGMDlcdTMwMDJgLFxuICAgIGBgLFxuICAgIGBcdTU5ODJcdTRGNTVcdTY3ODRcdTVFRkFcdTVFN0JcdTcwNkZcdTcyNDcgZGVja1x1RkYxQWAsXG4gICAgYC0gXHU1RTdCXHU3MDZGXHU3MjQ3XHU1QzMxXHU2NjJGXHU1RTkzXHU5MUNDXHU3Njg0XHU2NjZFXHU5MDFBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1RkYxQlx1NTUyRlx1NEUwMFx1NEZERFx1NzU1OVx1NzY4NCBmcm9udG1hdHRlciBcdTVDNUVcdTYwMjdcdTY2MkYgZGVja1x1MjAxNFx1MjAxNFx1NjMwN1x1NTQxMVx1NEUwQlx1NEUwMFx1NUYyMFx1NzY4NFx1OTRGRVx1NjNBNVx1RkYwOFx1NTk4MiBkZWNrOiBbXCJbW3NsaWRlLTJdXVwiXVx1RkYwQ1x1NjcwMFx1NTQwRVx1NEUwMFx1NUYyMFx1NTE5OSBkZWNrOiBbXVx1RkYwOVx1MzAwMlx1OTRGRVx1NzY4NFx1OTg3QVx1NUU4Rlx1NTM3M1x1NjUzRVx1NjYyMFx1OTg3QVx1NUU4Rlx1RkYwQ1x1OTg3NVx1NTNGN1x1ODFFQVx1NTJBOFx1OEJBMVx1N0I5N1x1MzAwMmAsXG4gICAgYC0gXHU3NTI4XHU1NDdEXHU0RUU0IFwiQ3JlYXRlIG5ldyBzbGlkZVwiIFx1NjVCMFx1NUVGQVx1NEUwMFx1NTk1NyBkZWNrXHVGRjA4XHU2NUIwXHU1RUZBXHU3QjE0XHU4QkIwXHVGRjBDZGVjazogW11cdUZGMDlcdUZGMUJcdTc1MjggXCJDcmVhdGUgbmV4dCBzbGlkZVwiIFx1N0VFN1x1N0VFRFx1NTJBMFx1OTg3NVx1MjAxNFx1MjAxNFx1NUI4M1x1NEYxQVx1ODFFQVx1NTJBOFx1NjNBNVx1OTAxQVx1OTRGRVx1RkYwOFx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NCBkZWNrIFx1OTRGRVx1NjNBNVx1NjMwN1x1NTQxMVx1NjVCMFx1OTg3NVx1RkYwQ1x1NjVCMFx1OTg3NVx1N0VFN1x1NjI3Rlx1NTM5Rlx1Njc2NVx1NzY4NFx1NEUwQlx1NEUwMFx1NUYyMFx1RkYwOVx1MzAwMmAsXG4gICAgYC0gXHU1MTg1XHU1QkI5XHU3NTI4XHU3RUFGIG1hcmtkb3duIFx1N0YxNlx1NTE5OVx1RkYwQ1x1NTcyOFx1NTM2MVx1NzI0N1x1NEUwQVx1NkUzMlx1NjdEM1x1RkYxQlx1NUMzRFx1OTFDRlx1NEY3Rlx1NzUyOFx1NzUyOFx1NjIzN1x1NUY1M1x1NTI0RFx1NzY4NFx1OEJFRFx1OEEwMFx1NjNBQVx1OEY5RVx1MzAwMlx1NkJDRlx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1NUZDNVx1OTg3Qlx1NjUzRVx1NTE2NVx1NEUwMFx1NUM0Rlx1MjAxNFx1MjAxNFx1NEUwQlx1OTc2Mlx1NzY4NFx1NUJCOVx1OTFDRlx1NjU3MFx1NUI1N1x1NUMzMVx1NjYyRlx1NTNFRlx1NzUyOFx1OTg4NFx1N0I5N1x1RkYwOFx1NURGMlx1N0VDRlx1NjI2M1x1NjM4OSBzbGlkZXMgXHU2ODBGXHU0RTBFXHU1MzYxXHU3MjQ3XHU2ODA3XHU5ODk4XHVGRjA5XHUzMDAyYCxcbiAgICBgLSBcdTRFRTVcdTc1MjhcdTYyMzdcdTc2ODRcdTVCOUVcdTk2NDVcdTk3MDBcdTZDNDJcdTRFM0FcdTUxNDhcdUZGMUFcdTc1MjhcdTYyMzdcdTg5ODFcdTRFQzBcdTRFNDhcdUZGMDhcdTU5ODJcIlx1NTdGQVx1NEU4RVx1NjdEMFx1Njc1MFx1NjU5OVx1NTIzNlx1NEY1QyBzbGlkZXMgXHU3QjE0XHU4QkIwXCJcdUZGMDlcdTVDMzFcdTUwNUFcdTRFQzBcdTRFNDhcdUZGMENcdTYzRDJcdTRFRjZcdTc2ODRcdTdFQTZcdTVCOUFcdTUzRUFcdTY2MkZcdTVGNjJcdTVGMEZcdUZGMENcdTRFMERcdTY2MkZcdTUxODVcdTVCQjlcdTMwMDJgLFxuICBdO1xufVxuXG5mdW5jdGlvbiBlblByb21wdChtOiBTbGlkZU1ldHJpY3MsIGM6IENhcGFjaXR5UmVzdWx0LCBub3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiYXIgPVxuICAgIG0uYmFyLnZpc2libGUgfHwgbS5iYXIuaGVpZ2h0ID4gMFxuICAgICAgPyBgU2xpZGVzIGJhcjogdmlzaWJsZSwgJHttLmJhci5oZWlnaHR9cHggKGFscmVhZHkgZXhjbHVkZWQgZnJvbSB0aGUgdGV4dCBhcmVhKS5gXG4gICAgICA6IFwiU2xpZGVzIGJhcjogaGlkZGVuLlwiO1xuICBjb25zdCB0aXRsZSA9XG4gICAgbS50aXRsZVJlc2VydmVkID4gMCA/IGBDYXJkIHRpdGxlOiAke20udGl0bGVSZXNlcnZlZH1weCByZXNlcnZlZC5gIDogXCJDYXJkIHRpdGxlOiBub25lLlwiO1xuICBjb25zdCBpbWcgPVxuICAgIG0uaW1hZ2VIZWlnaHQgIT09IG51bGwgPyBgSW1hZ2U6ICR7bS5pbWFnZUhlaWdodH1weCB0YWxsIChmaXJzdCBpbWFnZSBvbiB0aGUgc2xpZGUpLmAgOiBcIlwiO1xuICBjb25zdCBzYW1wbGVzID0gW1xuICAgIGBQbGFpbiB0ZXh0OiAke2MuYm9keUxpbmVzfSBib2R5IGxpbmVzYCxcbiAgICBgSDEgKyBidWxsZXRzOiAke2MuY29tYm9zLmFmdGVySDFCdWxsZXRzfSBidWxsZXRzIGFmdGVyIGEgSDEgbGluZWAsXG4gICAgYFB1cmUgbGlzdDogJHtjLmJ1bGxldHN9IGJ1bGxldCBpdGVtc2AsXG4gICAgYEgxIGxpbmVzIG9ubHk6ICR7Yy5oMUxpbmVzfWAsXG4gIF0uam9pbihcIjsgXCIpO1xuICByZXR1cm4gW1xuICAgIGBTbGlkZSBjYXBhY2l0eSBcdTIwMTQgb25lIHNjcmVlbiwgbm8gc2Nyb2xsaW5nLiBHZW5lcmF0ZWQgZnJvbSB0aGUgbGl2ZSBTbGlkZXMgbGF5b3V0IG9mIHRoaXMgbm90ZTsgZXZlcnkgbnVtYmVyIGlzIG1lYXN1cmVkL2JyYW5jaC1kZXJpdmVkIGF0IHRoZSBjdXJyZW50IFVJIHNjYWxlLmAsXG4gICAgYGAsXG4gICAgLi4uZW5Db250ZXh0KCksXG4gICAgYGAsXG4gICAgYEdlb21ldHJ5OiBzY3JlZW4gJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHg7IHRleHQgYXJlYSAke20udGV4dC53aWR0aH1cdTAwRDcke20udGV4dC5oZWlnaHR9cHguICR7YmFyfSAke3RpdGxlfWAsXG4gICAgYGAsXG4gICAgYFRleHQgbWV0cmljcyAoYm9keSBmb250ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHgpOmAsXG4gICAgYGNoYXJzL2xpbmUgXHUyMjQ4ICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIubGF0aW4pfSBsYXRpbiAvICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIuY2prKX0gQ0pLOyBib2R5IGxpbmUgJHtmbXQobS5ib2R5LmxpbmVIZWlnaHQpfXB4LmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJidWxsZXRcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiY29kZVwiLCBtLmNvZGUgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uY29kZS5saW5lSGVpZ2h0IH0gOiBudWxsKSxcbiAgXVxuICAgIC5jb25jYXQoaW1nID8gW2ltZ10gOiBbXSlcbiAgICAuY29uY2F0KFtgYCwgYENhcGFjaXR5OiAke3NhbXBsZXN9LmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gemhQcm9tcHQobTogU2xpZGVNZXRyaWNzLCBjOiBDYXBhY2l0eVJlc3VsdCwgbm90ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYmFyID1cbiAgICBtLmJhci52aXNpYmxlIHx8IG0uYmFyLmhlaWdodCA+IDBcbiAgICAgID8gYFNsaWRlcyBcdTY4MEZcdUZGMUFcdTY2M0VcdTc5M0FcdUZGMEMke20uYmFyLmhlaWdodH1weFx1RkYwOFx1NURGMlx1NEVDRVx1NjU4N1x1NUI1N1x1NTMzQVx1NjI2M1x1NTFDRlx1RkYwOVx1MzAwMmBcbiAgICAgIDogXCJTbGlkZXMgXHU2ODBGXHVGRjFBXHU5NjkwXHU4NUNGXHUzMDAyXCI7XG4gIGNvbnN0IHRpdGxlID0gbS50aXRsZVJlc2VydmVkID4gMCA/IGBcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTk4ODRcdTc1NTkgJHttLnRpdGxlUmVzZXJ2ZWR9cHhcdTMwMDJgIDogXCJcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTY1RTBcdTMwMDJcIjtcbiAgY29uc3QgaW1nID0gbS5pbWFnZUhlaWdodCAhPT0gbnVsbCA/IGBcdTU2RkVcdTcyNDdcdUZGMUEke20uaW1hZ2VIZWlnaHR9cHggXHU5QUQ4XHVGRjA4XHU1RjUzXHU1MjREXHU5ODc1XHU3QjJDXHU0RTAwXHU1RjIwXHVGRjA5XHUzMDAyYCA6IFwiXCI7XG4gIGNvbnN0IHNhbXBsZXMgPSBbXG4gICAgYFx1N0VBRlx1NkI2M1x1NjU4N1x1RkYxQSR7Yy5ib2R5TGluZXN9IFx1ODg0Q2AsXG4gICAgYEgxICsgXHU1MjE3XHU4ODY4XHVGRjFBSDEgXHU1NDBFXHU4RkQ4XHU1M0VGXHU2NTNFICR7Yy5jb21ib3MuYWZ0ZXJIMUJ1bGxldHN9IFx1NEUyQVx1NTIxN1x1ODg2OFx1OTg3OWAsXG4gICAgYFx1N0VBRlx1NTIxN1x1ODg2OFx1RkYxQSR7Yy5idWxsZXRzfSBcdTRFMkFcdTUyMTdcdTg4NjhcdTk4NzlgLFxuICAgIGBcdTdFQUYgSDFcdUZGMUEke2MuaDFMaW5lc30gXHU4ODRDYCxcbiAgXS5qb2luKFwiXHVGRjFCXCIpO1xuICByZXR1cm4gW1xuICAgIGBcdTVFN0JcdTcwNkZcdTcyNDdcdTVCQjlcdTkxQ0YgXHUyMDE0XHUyMDE0IFx1NEUwMFx1NUM0Rlx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1MzAwMlx1NTdGQVx1NEU4RVx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NFx1NUI5RVx1NjVGNiBTbGlkZXMgXHU1RTAzXHU1QzQwXHU3NTFGXHU2MjEwXHVGRjFCXHU2MjQwXHU2NzA5XHU2NTcwXHU1QjU3XHU2MzA5XHU1RjUzXHU1MjREIFVJIFx1NkJENFx1NEY4Qlx1NUI5RVx1NkQ0Qi9cdTYzQThcdTdCOTdcdTMwMDJgLFxuICAgIGBgLFxuICAgIC4uLnpoQ29udGV4dCgpLFxuICAgIGBgLFxuICAgIGBcdTUxRTBcdTRGNTVcdUZGMUFcdTVDNEZcdTVFNTUgJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHhcdUZGMUJcdTY1ODdcdTVCNTdcdTUzM0EgJHttLnRleHQud2lkdGh9XHUwMEQ3JHttLnRleHQuaGVpZ2h0fXB4XHUzMDAyJHtiYXJ9ICR7dGl0bGV9YCxcbiAgICBgYCxcbiAgICBgXHU2NTg3XHU1QjU3XHU1M0MyXHU2NTcwXHVGRjA4XHU2QjYzXHU2NTg3ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHhcdUZGMDlcdUZGMUFgLFxuICAgIGBcdTZCQ0ZcdTg4NENcdTdFQTYgJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5jamspfSBcdTRFMkFcdTZDNDlcdTVCNTcgLyAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmxhdGluKX0gXHU0RTJBXHU2MkM5XHU0RTAxXHU1QjU3XHU3QjI2XHVGRjFCXHU2QjYzXHU2NTg3XHU4ODRDXHU5QUQ4ICR7Zm10KG0uYm9keS5saW5lSGVpZ2h0KX1weFx1MzAwMmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJcdTUyMTdcdTg4NjhcdTk4NzlcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiXHU0RUUzXHU3ODAxXHU4ODRDXCIsIG0uY29kZSA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5jb2RlLmxpbmVIZWlnaHQgfSA6IG51bGwpLFxuICBdXG4gICAgLmNvbmNhdChpbWcgPyBbaW1nXSA6IFtdKVxuICAgIC5jb25jYXQoW2BgLCBgXHU1QkI5XHU5MUNGXHVGRjFBJHtzYW1wbGVzfVx1MzAwMmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIGNhcGFjaXR5IHByb21wdC4gRm9sbG93cyB0aGUgT2JzaWRpYW4gVUkgbGFuZ3VhZ2UgdmlhIGBsb2NhbGVgXG4gKiAobWVhc3VyZWQgc2VwYXJhdGVseSBmcm9tIHRoZSBhcHApLiBUaGUgYG5vdGVgIHRhaWwgc3RhdGVzIHRoZSBwb2xpY3lcbiAqICh3aGF0IGZpdHMgb25lIHNjcmVlbikgXHUyMDE0IHNhbWUgd29yZGluZyBpbiBib3RoIGxhbmd1YWdlcyB3aGVyZSBwb3NzaWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdENhcGFjaXR5KG06IFNsaWRlTWV0cmljcywgYzogQ2FwYWNpdHlSZXN1bHQsIGxvY2FsZTogXCJ6aFwiIHwgXCJlblwiKTogc3RyaW5nIHtcbiAgY29uc3Qgbm90ZSA9XG4gICAgbG9jYWxlID09PSBcInpoXCJcbiAgICAgID8gXCJcdTc1MjhcdTZDRDVcdUZGMUFcdTc1MjhcdTYyMzdcdTRGMUFcdTYzRDBcdTRGOUJcdTY3NTBcdTY1OTlcdTVFNzZcdThCRjRcdTMwMENcdTU3RkFcdTRFOEVcdThCRTVcdTY3NTBcdTY1OTlcdTUyMzZcdTRGNUMgc2xpZGVzL1BQVCBcdTdCMTRcdThCQjBcdTMwMERcdUZGMUJcdTZCNjRcdTY1RjZcdTYzMDlcdTRFMEFcdTY1ODdcdTdFQTZcdTVCOUFcdTUyMUJcdTVFRkEgZGVjayBcdTIwMTRcdTIwMTQgXHU1MTQ4XHU0RTg2XHU4OUUzXHU2NzUwXHU2NTk5XHU1RTc2XHU3RUQ5XHU1MUZBXHU2M0QwXHU3RUIyL1x1ODlDNFx1NTIxMlx1RkYwQ1x1NTE4RFx1OTAxMFx1OTg3NVx1NzUxRlx1NjIxMFx1N0IxNFx1OEJCMFx1RkYxQlx1NkJDRlx1NEUyQVx1NTM2MVx1NzI0N1x1RkYwOFx1N0IxNFx1OEJCMFx1RkYwOVx1NTE4NVx1NjUzRVx1NjA3MFx1NTIzMFx1NTk3RFx1NTkwNFx1NzY4NFx1NTE4NVx1NUJCOVx1RkYwQ1x1NEUwRFx1ODk4MVx1OEQ4NVx1NTFGQVx1NUJCOVx1OTFDRlx1MzAwMlx1ODk4MVx1NkM0Mlx1RkYxQVx1NzUxRlx1NjIxMFx1NzY4NFx1NTE4NVx1NUJCOVx1NUZDNVx1OTg3Qlx1NjUzRVx1NTcyOFx1NUY1M1x1NTI0RFx1OEZEOVx1NEUwMFx1NUM0Rlx1NTE4NVx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1RkYxQlx1NzUyOFx1NEUwQVx1OTc2Mlx1NzY4NFx1NTFFMFx1NEY1NVx1NEUwRVx1ODg0Q1x1OUFEOFx1NjU3MFx1NUI1N1x1NjgzOFx1N0I5N1x1NjAzQlx1OUFEOFx1NUVBNlx1RkYwOFx1NkI2M1x1NjU4N1x1ODg0Q1x1NjU3MCBcdTAwRDcgXHU4ODRDXHU5QUQ4ICsgXHU2ODA3XHU5ODk4XHU5ODg0XHU3NTU5ICsgXHU1NzU3XHU5NUY0XHU5NUY0XHU4REREIFx1MjI2NCBcdTY1ODdcdTVCNTdcdTUzM0FcdTlBRDhcdTVFQTZcdUZGMDlcdTMwMDJcIlxuICAgICAgOiBcIlVzYWdlOiB0aGUgdXNlciB3aWxsIHByb3ZpZGUgbWF0ZXJpYWwgYW5kIGFzayB0byBtYWtlIHNsaWRlcy9QUFQgbm90ZXMgZm9yIGl0OyBpbiB0aGF0IGNhc2UgY3JlYXRlIGEgZGVjayBwZXIgdGhlIGNvbnZlbnRpb25zIGFib3ZlIFx1MjAxNCByZXZpZXcgdGhlIG1hdGVyaWFsIGFuZCBvdXRsaW5lIHRoZSBzdHJ1Y3R1cmUgZmlyc3QsIHRoZW4gZ2VuZXJhdGUgZWFjaCBzbGlkZSBub3RlOyBrZWVwIGVhY2ggY2FyZCdzIGNvbnRlbnQganVzdCB3aXRoaW4gY2FwYWNpdHkuIFJlcXVpcmVtZW50OiB0aGUgZ2VuZXJhdGVkIGNvbnRlbnQgbXVzdCBmaXQgdGhpcyBvbmUgc2NyZWVuIFx1MjAxNCBubyBzY3JvbGxpbmcuIENoZWNrIHRoZSB0b3RhbCBoZWlnaHQgd2l0aCB0aGUgbnVtYmVycyBhYm92ZSAobGluZXMgXHUwMEQ3IGxpbmUtaGVpZ2h0ICsgdGl0bGUgcmVzZXJ2ZSArIGludGVyLWJsb2NrIHNwYWNpbmcgXHUyMjY0IHRleHQgYXJlYSBoZWlnaHQpLlwiO1xuICByZXR1cm4gbG9jYWxlID09PSBcInpoXCIgPyB6aFByb21wdChtLCBjLCBub3RlKSA6IGVuUHJvbXB0KG0sIGMsIG5vdGUpO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9tb2RlXCI7XG5cbi8qKlxuICogVHlwb2dyYXBoeS1tZWFzdXJlbWVudCB0b29saW5nIChkZXYgYnVpbGRzIG9ubHkpLlxuICpcbiAqIFRoZSBgbnMtZGVidWctc3R5bGVzYCBjb21tYW5kIHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyBpblxuICogZWRpdCAoTGl2ZSBQcmV2aWV3KSBhbmQgdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldywgbWVyZ2VzIHRoZVxuICogcmVzdWx0cywgY29tcHV0ZXMgYW4gZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kIHdyaXRlcyBpdCB0b1xuICogLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC4gUmVnaXN0ZXJlZCBvbmx5IHdoZW4gdGhlXG4gKiBidWlsZC10aW1lIERFVl9NT0RFIGZsYWcgaXMgdHJ1ZTsgcmVsZWFzZSBidWlsZHMgdHJlZS1zaGFrZSB0aGlzIG1vZHVsZSBvdXQuXG4gKi9cblxuLyoqIEZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyB1c2VkIGJ5IHRoZSBkZWJ1ZyBjb21tYW5kIChlZGl0IHNpZGUpICovXG5leHBvcnQgY29uc3QgU0FNUExFX05PVEVfTkFNRVMgPSBbXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtaGVhZGluZ3NcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1saXN0XCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtY29kZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLXF1b3RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbWVkaWFcIixcbl07XG5cbi8qKiBTdHlsZSBzZWN0aW9ucyBzYW1wbGVkIGJ5IHNhbXBsZVN0eWxlcygpIGFuZCBjb21wYXJlZCBieSBkaWZmRHVtcHMoKSAqL1xuY29uc3QgU1RZTEVfU0VDVElPTlMgPSBbXG4gIFwiY29udGFpbmVyXCIsXG4gIFwicGFyYWdyYXBoXCIsXG4gIFwiaDFcIixcbiAgXCJsaXN0SXRlbVwiLFxuICBcImNvZGVCbG9ja1wiLFxuICBcImJsb2NrcXVvdGVcIixcbiAgXCJpbmxpbmVDb2RlXCIsXG4gIFwidGFibGVcIixcbiAgXCJpbWFnZVwiLFxuICBcImhvcml6b250YWxSdWxlXCIsXG5dO1xuXG4vKiogUHJvbWlzZS1iYXNlZCBzbGVlcCAqL1xuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHdpbmRvdy5zZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKlxuICogTWVyZ2Ugbm9uLW1pc3Npbmcgc3R5bGUgc2VjdGlvbnMgb2YgYSBmcmVzaCBzYW1wbGUgaW50byB0aGUgdGFyZ2V0XG4gKiAoZmlyc3Qgbm9uLW1pc3NpbmcgdmFsdWUgd2lucykuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU2FtcGxlKHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHNhbXBsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gc2FtcGxlW2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlY3Rpb24gfHwgXCIobWlzc2luZylcIiBpbiBzZWN0aW9uKSBjb250aW51ZTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRhcmdldFtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKGV4aXN0aW5nICYmICEoXCIobWlzc2luZylcIiBpbiBleGlzdGluZykpIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc2VjdGlvbjtcbiAgfVxuICAvLyBQcm9iZSBmaWVsZHMgcmlkZSBhbG9uZyAoZmlyc3Qgbm9uLWVtcHR5IHdpbnMpXG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImxpc3RMaW5lc1wiLFxuICAgIFwibWV0YWRhdGFDb250YWluZXJEaXNwbGF5XCIsXG4gICAgXCJoMU9mZnNldFRvcFwiLFxuICAgIFwiaDFUb3BJbkNvbnRlbnRcIixcbiAgICBcImgxTGVmdEluQ29udGVudFwiLFxuICAgIFwidGl0bGVcIixcbiAgICBcImNvbnRlbnRDaGlsZHJlblwiLFxuICAgIFwidG9wQ2hhaW5cIixcbiAgXSkge1xuICAgIGNvbnN0IHByb2JlID0gc2FtcGxlW2tleV07XG4gICAgaWYgKHByb2JlID09PSB1bmRlZmluZWQgfHwgcHJvYmUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb2JlKSAmJiBwcm9iZS5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcHJvYmUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvYmUpICYmIE9iamVjdC5rZXlzKHByb2JlKS5sZW5ndGggPT09IDApXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFyZ2V0W2tleV0gPT09IHVuZGVmaW5lZCkgdGFyZ2V0W2tleV0gPSBwcm9iZTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmUgdGhlIHN0eWxlIHNlY3Rpb25zIG9mIGFuIGVkaXQgZHVtcCBhbmQgYSByZWFkaW5nIGR1bXA7IG9ubHlcbiAqIGtleXMgd2hvc2UgdmFsdWVzIGRpZmZlciBhcmUga2VwdCwgYXMgeyBrZXk6IHsgZWRpdCwgcmVhZGluZyB9IH0uXG4gKi9cbmZ1bmN0aW9uIGRpZmZEdW1wcyhcbiAgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IGUgPSAoZWRpdFtzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCByID0gKHJlYWRpbmdbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGUpLCAuLi5PYmplY3Qua2V5cyhyKV0pO1xuICAgIGNvbnN0IGRpZmZzOiBSZWNvcmQ8c3RyaW5nLCB7IGVkaXQ6IHN0cmluZzsgcmVhZGluZzogc3RyaW5nIH0+ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgaWYgKGVba2V5XSAhPT0gcltrZXldKSB7XG4gICAgICAgIGRpZmZzW2tleV0gPSB7IGVkaXQ6IGVba2V5XSA/PyBcIihtaXNzaW5nKVwiLCByZWFkaW5nOiByW2tleV0gPz8gXCIobWlzc2luZylcIiB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoZGlmZnMpLmxlbmd0aCA+IDApIG91dFtzZWN0aW9uXSA9IGRpZmZzO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBTYW1wbGUgdGhlIGN1cnJlbnQgdmlldydzIHR5cG9ncmFwaHkgY29tcHV0ZWQgc3R5bGVzICsgQ1NTIHZhcmlhYmxlcyAqL1xuZnVuY3Rpb24gc2FtcGxlU3R5bGVzKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0VkaXQgPSB2aWV3LmdldE1vZGUoKSA9PT0gXCJzb3VyY2VcIjtcbiAgY29uc3QgY29udGVudEVsID0gdmlldy5jb250ZW50RWw7XG4gIC8vIEZpcnN0IG1hdGNoaW5nIGNhbmRpZGF0ZSB3aW5zIFx1MjAxNCBlZGl0IChjbTYpIGFuZCByZWFkaW5nIHVzZVxuICAvLyBkaWZmZXJlbnQgZWxlbWVudCBzdHJ1Y3R1cmVzIChlLmcuIG5vIHByZS9ibG9ja3F1b3RlIGluIGNtNikuXG4gIGNvbnN0IHBpY2sgPSAoc2Vsczogc3RyaW5nW10pOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3Qgc2VsIG9mIHNlbHMpIHtcbiAgICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgICBpZiAoZWwpIHJldHVybiBlbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGNvbnN0IHN0eWxlID0gKGVsOiBIVE1MRWxlbWVudCB8IG51bGwsIHByb3BzOiBzdHJpbmdbXSk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICAgIGlmICghZWwpIHJldHVybiB7IFwiKG1pc3NpbmcpXCI6IFwiZWxlbWVudCBub3QgaW4gdGhpcyBub3RlXCIgfTtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcCBvZiBwcm9wcykge1xuICAgICAgY29uc3QgdiA9IGNzLmdldFByb3BlcnR5VmFsdWUocCkudHJpbSgpO1xuICAgICAgaWYgKHYpIG91dFtwXSA9IHY7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IHZhcnMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICBjb25zdCBjc3NWYXIgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHZhcnMuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKS50cmltKCk7XG5cbiAgY29uc3QgY29udGFpbmVyID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWNvbnRlbnRcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiLFxuICBdKTtcbiAgY29uc3QgcGFyYSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcFwiLFxuICBdKTtcbiAgY29uc3QgaDEgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1oZWFkZXItMVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGgxXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaDFcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoMVwiLFxuICBdKTtcbiAgY29uc3QgbGlzdEl0ZW0gPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgICBpc0VkaXQgPyBcIi5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICBdKTtcbiAgY29uc3QgcHJlID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgcHJlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tZWRpdGluZyBwcmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWNvZGVibG9ja1wiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICBdKTtcbiAgY29uc3QgcXVvdGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGJsb2NrcXVvdGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBibG9ja3F1b3RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtcXVvdGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBibG9ja3F1b3RlXCIsXG4gIF0pO1xuICBjb25zdCBpbmxpbmVDb2RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBjb2RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgY29kZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1pbmxpbmUtY29kZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGNvZGVcIixcbiAgXSk7XG4gIGNvbnN0IHRhYmxlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IHRhYmxlXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdGFibGVcIixcbiAgXSk7XG4gIGNvbnN0IGltZyA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaW1nXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGltZ1wiLFxuICAgIFwiaW1nXCIsIC8vIHdob2xlLWRvY3VtZW50IGZhbGxiYWNrXG4gIF0pO1xuICBjb25zdCBociA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20taHJcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICBdKTtcblxuICAvLyBTdHJ1Y3R1cmUgcHJvYmVzIChlZGl0IHZpZXcgb25seSk6IHRoZSBzb3VyY2UtdmlldyBjbGFzcyBsaXN0XG4gIC8vIChjb25maXJtcyB0aGUgTGl2ZSBQcmV2aWV3IG1hcmtlciBjbGFzcykgYW5kIHVuaXF1ZSBlbGVtZW50IHRhZ3NcbiAgLy8gaW5zaWRlIHRoZSBlZGl0b3IgKHJldmVhbHMgaG93IGNtNiByZW5kZXJzIGNvZGUgYmxvY2tzIGV0Yy4gd2hlblxuICAvLyB0aGUgdXN1YWwgc2VsZWN0b3JzIGRvIG5vdCBtYXRjaCkuXG4gIGNvbnN0IHNvdXJjZVZpZXdDbGFzcyA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTZcIik/LmNsYXNzTmFtZSA/PyBcIlwiO1xuICBjb25zdCBkb21UYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnRlbnRFbFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAqXCIpXG4gICAgICAuZm9yRWFjaCgoZWwpID0+IHRhZ3MuYWRkKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkpO1xuICAgIGRvbVRhZ3MucHVzaCguLi50YWdzKTtcbiAgfVxuICAvLyBMaXN0LWxpbmUgcHJvYmUgKGVkaXQgdmlldyBvbmx5KTogY2xhc3MgbmFtZXMgKyBjb21wdXRlZCBwYWRkaW5nXG4gIC8vIG9mIHRoZSBmaXJzdCBsaXN0IGxpbmVzIFx1MjAxNCBuZXN0ZWQgbGV2ZWxzIG9mdGVuIHVzZSBkaXN0aW5jdFxuICAvLyBjbGFzc2VzIG9yIGlubGluZSBwYWRkaW5ncywgd2hpY2ggZGVjaWRlcyB3aGV0aGVyIGEgbGV2ZWwtYXdhcmVcbiAgLy8gaW5kZW50IG92ZXJyaWRlIGlzIGV2ZW4gcG9zc2libGUuXG4gIGNvbnN0IGxpc3RMaW5lczogeyBjbGFzc05hbWU6IHN0cmluZzsgcGFkZGluZ0xlZnQ6IHN0cmluZyB9W10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yQWxsKFwiLkh5cGVyTUQtbGlzdC1saW5lXCIpLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICBpZiAoaSA+PSA0KSByZXR1cm47XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgbGlzdExpbmVzLnB1c2goe1xuICAgICAgICBjbGFzc05hbWU6IGVsLmNsYXNzTmFtZSxcbiAgICAgICAgcGFkZGluZ0xlZnQ6IGNzLmdldFByb3BlcnR5VmFsdWUoXCJwYWRkaW5nLWxlZnRcIikudHJpbSgpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gRnJvbnRtYXR0ZXIgcHJvYmVzOiBkb2VzIHRoZSAoaGlkZGVuKSBwcm9wZXJ0aWVzIGFyZWEgc3RpbGxcbiAgLy8gb2NjdXB5IHNwYWNlIGluIExpdmUgUHJldmlldz8gQW5kIGhvdyBmYXIgaXMgdGhlIEgxIGZyb20gdGhlXG4gIC8vIHRvcCBvZiB0aGUgY29udGVudCBhcmVhPyAocmVhZGluZyBtb2RlIGhhcyBubyBzdWNoIHBhZGRpbmcpXG4gIGNvbnN0IG1ldGFkYXRhRGlzcGxheSA9ICgoKSA9PiB7XG4gICAgY29uc3Qgc2VsID0gaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiO1xuICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgcmV0dXJuIGVsID8gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSA6IFwiKG5vdCBpbiBET00pXCI7XG4gIH0pKCk7XG4gIGNvbnN0IGgxT2Zmc2V0VG9wID0gKCgpID0+IHtcbiAgICBpZiAoIWgxKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB0b3AgPSAwO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBoMTtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdG9wICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgICAgbm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRvcDtcbiAgfSkoKTtcbiAgLy8gV2hhdCBvY2N1cGllcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgY29udGVudCB0b3AgYW5kIHRoZSBIMT9cbiAgLy8gKGVkaXQpIGZpcnN0IGNoaWxkcmVuIG9mIC5jbS1jb250ZW50LCBhbmQgdGhlIG5ldCBIMSBkaXN0YW5jZVxuICAvLyBmcm9tIHRoZSBjb250ZW50IGFuY2hvciBcdTIwMTQgcmVhZGluZyBoYXMgbm8gc3VjaCBnYXAuXG4gIGNvbnN0IGFuY2hvciA9IGlzRWRpdFxuICAgID8gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIilcbiAgICA6IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiKTtcbiAgY29uc3QgaDFUb3BJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTtcbiAgfSkoKTtcbiAgY29uc3QgaDFMZWZ0SW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KTtcbiAgfSkoKTtcbiAgY29uc3QgY29udGVudENoaWxkcmVuID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhbmNob3IuY2hpbGRyZW4pXG4gICAgICAuc2xpY2UoMCwgNClcbiAgICAgIC5tYXAoKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xzOiAoZWwgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTmFtZSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSxcbiAgICAgICAgICBtYXJnaW5Ub3A6IGNzLm1hcmdpblRvcCxcbiAgICAgICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogY3MubWFyZ2luQm90dG9tLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IGNzLnBhZGRpbmdCb3R0b20sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSkoKTtcbiAgLy8gQ29udGFpbmVyIGNoYWluIHByb2JlOiBmcm9tIC5jbS1jb250ZW50IHVwIHRvIHRoZSB2aWV3LWNvbnRlbnQsXG4gIC8vIGVhY2ggd3JhcHBlcidzIHBhZGRpbmcvbWFyZ2luIFx1MjAxNCBsb2NhdGVzIHRoZSBsZWZ0b3ZlciB2ZXJ0aWNhbFxuICAvLyBvZmZzZXQgYmV0d2VlbiBlZGl0IGFuZCByZWFkaW5nIGNvbnRlbnQgYXJlYXMuXG4gIGNvbnN0IHRvcENoYWluID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJ0czogeyBjbHM6IHN0cmluZzsgcGFkVG9wOiBzdHJpbmc7IG1hclRvcDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBhbmNob3I7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICBjbHM6IG5vZGUuY2xhc3NOYW1lIHx8IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBwYWRUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgIG1hclRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgfSk7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFydHM7XG4gIH0pKCk7XG5cbiAgLy8gVGl0bGUgcHJvYmU6IHRoZSBnZW5lcmF0ZWQgOjpiZWZvcmUgaW4gU2xpZGVzIG1vZGUgKHdoZW4gYSB0aXRsZSBpc1xuICAvLyBjb25maWd1cmVkKS4gQ2FwdHVyZXMgaXRzIGNvbXB1dGVkIHN0eWxlIHNvIHdlIGNhbiBkaWZmIGl0IGFnYWluc3QgdGhlXG4gIC8vIGJvZHkgSDEgKC5jbS1oZWFkZXItMSkgYW5kIGFsaWduIHRoZW0gZXhhY3RseS5cbiAgY29uc3QgdGl0bGVCZWZvcmUgPSAoKCkgPT4ge1xuICAgIGlmICghaXNFZGl0KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgICBpZiAoIWNvbnRlbnQgfHwgIWNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQsIFwiOjpiZWZvcmVcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNzLmNvbnRlbnQsXG4gICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgcG9zaXRpb246IGNzLnBvc2l0aW9uLFxuICAgICAgdG9wOiBjcy50b3AsXG4gICAgICBsZWZ0OiBjcy5sZWZ0LFxuICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgIGZvbnRGYW1pbHk6IGNzLmZvbnRGYW1pbHksXG4gICAgICBmb250U2l6ZTogY3MuZm9udFNpemUsXG4gICAgICBsaW5lSGVpZ2h0OiBjcy5saW5lSGVpZ2h0LFxuICAgICAgZm9udFdlaWdodDogY3MuZm9udFdlaWdodCxcbiAgICAgIGZvbnRWYXJpYW50OiBjcy5mb250VmFyaWFudCxcbiAgICAgIGNvbG9yOiBjcy5jb2xvcixcbiAgICAgIGxldHRlclNwYWNpbmc6IGNzLmxldHRlclNwYWNpbmcsXG4gICAgICB0ZXh0VHJhbnNmb3JtOiBjcy50ZXh0VHJhbnNmb3JtLFxuICAgICAgd29yZFNwYWNpbmc6IGNzLndvcmRTcGFjaW5nLFxuICAgICAgZm9udEtlcm5pbmc6IGNzLmZvbnRLZXJuaW5nLFxuICAgICAgZm9udEZlYXR1cmVTZXR0aW5nczogY3MuZm9udEZlYXR1cmVTZXR0aW5ncyxcbiAgICAgIGZvbnRWYXJpYW50TnVtZXJpYzogY3MuZm9udFZhcmlhbnROdW1lcmljLFxuICAgICAgZm9udFZhcmlhbnRMaWdhdHVyZXM6IGNzLmZvbnRWYXJpYW50TGlnYXR1cmVzLFxuICAgICAgZm9udFZhcmlhbnRDYXBzOiBjcy5mb250VmFyaWFudENhcHMsXG4gICAgfTtcbiAgfSkoKTtcblxuICBjb25zdCBkdW1wID0ge1xuICAgIG1vZGU6IGlzRWRpdCA/IFwiZWRpdCAoTGl2ZSBQcmV2aWV3KVwiIDogXCJyZWFkaW5nXCIsXG4gICAgLy8gU2xpZGVzIHN0eWxpbmcgb25seSBhcHBsaWVzIHdoZW4gU2xpZGVzIG1vZGUgaXMgb25cbiAgICBzbGlkZXNBY3RpdmU6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpLFxuICAgIGRvbVRhZ3M6IGlzRWRpdCA/IGRvbVRhZ3MgOiB1bmRlZmluZWQsXG4gICAgc291cmNlVmlld0NsYXNzOiBpc0VkaXQgPyBzb3VyY2VWaWV3Q2xhc3MgOiB1bmRlZmluZWQsXG4gICAgbGl2ZVByZXZpZXc6IGlzRWRpdCA/IGlzTGl2ZVByZXZpZXcoYXBwKSA6IHVuZGVmaW5lZCxcbiAgICBsaXN0TGluZXM6IGlzRWRpdCA/IGxpc3RMaW5lcyA6IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXk6IG1ldGFkYXRhRGlzcGxheSxcbiAgICBoMU9mZnNldFRvcDogaDFPZmZzZXRUb3AsXG4gICAgaDFUb3BJbkNvbnRlbnQ6IGgxVG9wSW5Db250ZW50LFxuICAgIGgxTGVmdEluQ29udGVudDogaDFMZWZ0SW5Db250ZW50LFxuICAgIGNvbnRlbnRDaGlsZHJlbjogY29udGVudENoaWxkcmVuLFxuICAgIHRvcENoYWluOiB0b3BDaGFpbixcbiAgICB0aXRsZTogdGl0bGVCZWZvcmUsXG4gICAgY29udGFpbmVyOiBzdHlsZShjb250YWluZXIsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1heC13aWR0aFwiLFxuICAgICAgXCJ3aWR0aFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgcGFyYWdyYXBoOiBzdHlsZShwYXJhLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBoMTogc3R5bGUoaDEsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcImZvbnQtd2VpZ2h0XCIsXG4gICAgICBcImZvbnQtdmFyaWFudFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJsZXR0ZXItc3BhY2luZ1wiLFxuICAgICAgXCJ0ZXh0LXRyYW5zZm9ybVwiLFxuICAgICAgXCJ3b3JkLXNwYWNpbmdcIixcbiAgICAgIFwiZm9udC1rZXJuaW5nXCIsXG4gICAgICBcImZvbnQtZmVhdHVyZS1zZXR0aW5nc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbnVtZXJpY1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbGlnYXR1cmVzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1jYXBzXCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgbGlzdEl0ZW06IHN0eWxlKGxpc3RJdGVtLCBbXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGNvZGVCbG9jazogc3R5bGUocHJlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICBibG9ja3F1b3RlOiBzdHlsZShxdW90ZSwgW1xuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwiYm9yZGVyLWxlZnQtd2lkdGhcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgIF0pLFxuICAgIGlubGluZUNvZGU6IHN0eWxlKGlubGluZUNvZGUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIHRhYmxlOiBzdHlsZSh0YWJsZSwgW1wiZm9udC1zaXplXCIsIFwibGluZS1oZWlnaHRcIiwgXCJ3aWR0aFwiLCBcImJvcmRlci1jb2xsYXBzZVwiXSksXG4gICAgaW1hZ2U6IHN0eWxlKGltZywgW1wiZGlzcGxheVwiLCBcIm1hcmdpbi1sZWZ0XCIsIFwibWFyZ2luLXJpZ2h0XCIsIFwibWF4LXdpZHRoXCIsIFwid2lkdGhcIl0pLFxuICAgIGhvcml6b250YWxSdWxlOiBzdHlsZShociwgW1wibWFyZ2luLXRvcFwiLCBcIm1hcmdpbi1ib3R0b21cIiwgXCJib3JkZXItdG9wLXdpZHRoXCIsIFwiaGVpZ2h0XCJdKSxcbiAgICBjc3NWYXJpYWJsZXM6IHtcbiAgICAgIFwiLS1mb250LXRleHRcIjogY3NzVmFyKFwiLS1mb250LXRleHRcIiksXG4gICAgICBcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCI6IGNzc1ZhcihcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCIpLFxuICAgICAgXCItLWgxLXNpemVcIjogY3NzVmFyKFwiLS1oMS1zaXplXCIpLFxuICAgICAgXCItLWgxLWxpbmUtaGVpZ2h0XCI6IGNzc1ZhcihcIi0taDEtbGluZS1oZWlnaHRcIiksXG4gICAgICBcIi0taDEtd2VpZ2h0XCI6IGNzc1ZhcihcIi0taDEtd2VpZ2h0XCIpLFxuICAgICAgXCItLWgxLXZhcmlhbnRcIjogY3NzVmFyKFwiLS1oMS12YXJpYW50XCIpLFxuICAgICAgXCItLWgxLWNvbG9yXCI6IGNzc1ZhcihcIi0taDEtY29sb3JcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLXRvcFwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi10b3BcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLWJvdHRvbVwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi1ib3R0b21cIiksXG4gICAgICBcIi0tcC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tcC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3Qtc3BhY2luZ1wiOiBjc3NWYXIoXCItLWxpc3Qtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LWluZGVudFwiOiBjc3NWYXIoXCItLWxpc3QtaW5kZW50XCIpLFxuICAgICAgXCItLWNvZGUtc2l6ZVwiOiBjc3NWYXIoXCItLWNvZGUtc2l6ZVwiKSxcbiAgICAgIFwiLS1jb2RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1jb2RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tY29kZS1yYWRpdXNcIjogY3NzVmFyKFwiLS1jb2RlLXJhZGl1c1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCIpLFxuICAgICAgXCItLWZpbGUtbWFyZ2luc1wiOiBjc3NWYXIoXCItLWZpbGUtbWFyZ2luc1wiKSxcbiAgICAgIFwiLS1maWxlLWxpbmUtd2lkdGhcIjogY3NzVmFyKFwiLS1maWxlLWxpbmUtd2lkdGhcIiksXG4gICAgICBcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiOiBjc3NWYXIoXCItLW5vcm1hbC1mb250LXNpemVcIiksXG4gICAgICBcIi0tZm9udC10ZXh0LXNpemVcIjogY3NzVmFyKFwiLS1mb250LXRleHQtc2l6ZVwiKSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gZHVtcDtcbn1cblxuLyoqXG4gKiBEZWJ1ZyB0eXBvZ3JhcGh5OiBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgKGVhY2hcbiAqIGNvdmVyaW5nIGEgZ3JvdXAgb2YgZWxlbWVudHMgXHUyMDE0IGFsbCB2aXNpYmxlIHdpdGhvdXQgc2Nyb2xsaW5nKSxcbiAqIHRoZW4gdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldyAobm8gdmlydHVhbGl6YXRpb25cbiAqIHRoZXJlKSwgbWVyZ2VzIGV2ZXJ5dGhpbmcsIGNvbXB1dGVzIHRoZSBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmRcbiAqIHdyaXRlcyBpdCB0byAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LlxuICogVGhlIHVzZXIncyBvd24gbm90ZSBpcyByZXN0b3JlZCBhdCB0aGUgZW5kLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHVtcFR5cG9ncmFwaHkocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYXBwID0gcGx1Z2luLmFwcDtcbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBubyBhY3RpdmUgTWFya2Rvd24gbm90ZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc3RhcnRNb2RlID0gdmlldy5nZXRNb2RlKCk7XG4gIGNvbnN0IGFjdGl2ZUZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgY29uc3QgbGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG5cbiAgLy8gRWRpdCBzaWRlOiBlYWNoIHNob3J0IG5vdGUga2VlcHMgZXZlcnkgdGFyZ2V0IGVsZW1lbnQgb24gc2NyZWVuXG4gIGNvbnN0IGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBTQU1QTEVfTk9URV9OQU1FUykge1xuICAgIGNvbnN0IGYgPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGB0ZXN0cy8ke25hbWV9Lm1kYCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg1MDApO1xuICAgIGNvbnN0IHMgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgICBpZiAocykgbWVyZ2VTYW1wbGUoZWRpdCwgcyk7XG4gIH1cblxuICAvLyBSZWFkaW5nIHNpZGU6IHRoZSBraXRjaGVuLXNpbmsgbm90ZSByZW5kZXJzIGV2ZXJ5dGhpbmcgYXQgb25jZVxuICBsZXQgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZGVtbyA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCJ0ZXN0cy90eXBvZ3JhcGh5LWRlbW8ubWRcIik7XG4gIGlmIChkZW1vIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGRlbW8sIHsgc3RhdGU6IHsgbW9kZTogXCJwcmV2aWV3XCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg4MDApO1xuICAgIHJlYWRpbmcgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgdGhlIHVzZXIncyBub3RlXG4gIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShhY3RpdmVGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IHN0YXJ0TW9kZSB9IH0pO1xuICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cbiAgaWYgKCFyZWFkaW5nKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IHJlYWRpbmcgc2FtcGxlIGZhaWxlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXlsb2FkID0geyBlZGl0LCByZWFkaW5nLCBkaWZmOiBkaWZmRHVtcHMoZWRpdCwgcmVhZGluZykgfTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci53cml0ZShcIi5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb25cIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMikpO1xuICAgIG5ldyBOb3RpY2UoXCJUeXBvZ3JhcGh5IGR1bXAgXHUyMTkyIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gKHZhdWx0IHJvb3QpXCIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCB3cml0ZSBkZWJ1ZyBmaWxlICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG5cbi8qKiBSZWdpc3RlciB0aGUgZGV2LW9ubHkgZGVidWcgY29tbWFuZCAoY2FsbGVkIG9ubHkgd2hlbiBERVZfTU9ERSBpcyB0cnVlKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtZGVidWctc3R5bGVzXCIsXG4gICAgbmFtZTogXCJEZWJ1ZzogZHVtcCB0eXBvZ3JhcGh5IHN0eWxlc1wiLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbiksXG4gIH0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTW9kZSBvZiB0aGUgYWN0aXZlIE1hcmtkb3duIHZpZXc6ICdwcmV2aWV3Jz1yZWFkaW5nICdzb3VyY2UnPWVkaXRpbmcgJyc9bm9uZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRNb2RlKGFwcDogQXBwKTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiIHwgXCJcIiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgcmV0dXJuIHZpZXcgPyB2aWV3LmdldE1vZGUoKSA6IFwiXCI7XG59XG5cbi8qKlxuICogVHJ1ZSB3aGVuIHRoZSBhY3RpdmUgZWRpdCB2aWV3IGlzIExpdmUgUHJldmlldyAoU2xpZGVzKSBcdTIwMTQgYXNcbiAqIG9wcG9zZWQgdG8gU291cmNlIG1vZGUuIE9ic2lkaWFuIHJlcG9ydHMgYm90aCBhcyBtb2RlIFwic291cmNlXCI7XG4gKiB0aGUgdmlldyBzdGF0ZSBjYXJyaWVzIGEgYHNvdXJjZWAgZmxhZyAoU291cmNlIG1vZGUgPSB0cnVlKSwgd2l0aFxuICogYSBET00gY2xhc3MgZmFsbGJhY2sgKC5pcy1saXZlLXByZXZpZXcpIGZvciBzYWZldHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xpdmVQcmV2aWV3KGFwcDogQXBwKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSBcInNvdXJjZVwiKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN0YXRlID0gdmlldy5nZXRTdGF0ZSgpIGFzIHsgc291cmNlPzogYm9vbGVhbiB9O1xuICBpZiAoc3RhdGUuc291cmNlID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IGZhbHNlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICEhdmlldy5jb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202LmlzLWxpdmUtcHJldmlld1wiKTtcbn1cblxuLyoqIEZyb250bWF0dGVyIG9mIGFueSBub3RlIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb250bWF0dGVyT2YoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIHJldHVybiBjYWNoZT8uZnJvbnRtYXR0ZXIgPz8gbnVsbDtcbn1cblxuLyoqIEN1cnJlbnQgbm90ZSdzIGZyb250bWF0dGVyIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2ZUZyb250bWF0dGVyKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgZmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICByZXR1cm4gZmlsZSA/IGZyb250bWF0dGVyT2YoYXBwLCBmaWxlKSA6IG51bGw7XG59XG4iLCAiLyoqIEEgYnVpbHQtaW4gU2xpZGVzIHN0eWxlIHRlbXBsYXRlIChyZW5kZXJlZCBhcyBib2R5IGNsYXNzIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gKSAqL1xuZXhwb3J0IGludGVyZmFjZSBTbGlkZXNUaGVtZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbi8qKiBCdWlsdC1pbiBzdHlsZSB0ZW1wbGF0ZXMgZm9yIHRoZSBTbGlkZXMgY2FyZCArIGJhciAoYWxsIHRoZW1lLWFkYXB0aXZlKSAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19USEVNRVM6IHJlYWRvbmx5IFNsaWRlc1RoZW1lW10gPSBbXG4gIHsgaWQ6IFwianl5XCIsIGxhYmVsOiBcIkxlY3R1cmUgKGp5eSlcIiB9LFxuICB7IGlkOiBcImRhc2hlZFwiLCBsYWJlbDogXCJEYXNoZWQgb3V0bGluZVwiIH0sXG4gIHsgaWQ6IFwicGFwZXJcIiwgbGFiZWw6IFwiUGFwZXIgY2FyZFwiIH0sXG4gIHsgaWQ6IFwibWluaW1hbFwiLCBsYWJlbDogXCJNaW5pbWFsXCIgfSxcbiAgeyBpZDogXCJhY2NlbnRcIiwgbGFiZWw6IFwiQWNjZW50IGVkZ2VcIiB9LFxuICB7IGlkOiBcImdsYXNzXCIsIGxhYmVsOiBcIkZyb3N0ZWQgZ2xhc3NcIiB9LFxuXTtcblxuLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB7XG4gIC8qKiBTaG93IFx1MjVDMCBcdTI1QjYgcHJldmlvdXMvbmV4dCBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dOYXZCdXR0b25zOiBib29sZWFuO1xuICAvKiogUGFnZSBudW1iZXIgZGlzcGxheSBzdHlsZTogXCJmcmFjdGlvblwiID0gTiAvIFRvdGFsLCBcImN1cnJlbnRcIiA9IE4sIFwibm9uZVwiID0gaGlkZGVuICovXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgLyoqIFNob3cgYSB0aGluIGNsaWNrYWJsZSBwcm9ncmVzcyBsaW5lIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd1Byb2dyZXNzOiBib29sZWFuO1xuICAvKiogU2hvdyB0aGUgZW50aXJlIHNsaWRlcyBiYXIgKG1hc3RlciB0b2dnbGUpICovXG4gIHNob3dTbGlkZXNCYXI6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIG1hbnVhbGx5IGhpZCB0aGUgc2xpZGVzIGJhciAodG9nZ2xlIGNvbW1hbmQpICovXG4gIGJhckhpZGRlbjogYm9vbGVhbjtcbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgd2hlbiBvcGVuaW5nIGEgZGVjayBub3RlIChkZWZhdWx0IG9mZikgKi9cbiAgYXV0b0VudGVyU2xpZGVzOiBib29sZWFuO1xuICAvKiogUHJlc3MgRXNjYXBlIHRvIGV4aXQgU2xpZGVzIG1vZGUgKGRlZmF1bHQgb24pICovXG4gIGVzY0V4aXRzU2xpZGVzOiBib29sZWFuO1xuICAvKiogRnJvbnRtYXR0ZXIgcHJvcGVydHkgc2hvd24gYXMgdGhlIGNhcmQgdGl0bGUgKFwiXCIgPSBub25lLCBcImZpbGVuYW1lXCIgPSBmaWxlIG5hbWUpICovXG4gIHNsaWRlc1RpdGxlOiBzdHJpbmc7XG4gIC8qKiBTdHlsZSB0ZW1wbGF0ZSBpZCBmcm9tIFNMSURFU19USEVNRVMgKGNhcmQgKyBiYXIgYXBwZWFyYW5jZSkgKi9cbiAgc2xpZGVzVGhlbWU6IHN0cmluZztcbiAgLyoqIENvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyBmb3IgdGhlIHNsaWRlcyBiYXIgKGVtcHR5ID0gbm9uZSkgKi9cbiAgYmFyUHJvcGVydGllczogc3RyaW5nO1xuICAvKiogSlNPTiBhcnJheSBvZiBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIGJhciBwcm9wZXJ0aWVzIChkcmFnZ2FibGUgZGl2aWRlcnMpICovXG4gIGJhclByb3BlcnR5V2lkdGhzOiBzdHJpbmc7XG4gIC8qKiBBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHBhbmVsIChkZWZhdWx0IG9uKSAqL1xuICBjb25maXJtRGVsZXRlU2xpZGVzOiBib29sZWFuO1xuICAvKipcbiAgICogQmxvY2sgaW1hZ2UgZW1iZWRzIGFzIGNlbnRlcmVkIGNhcmQgYmxvY2tzIChkZWZhdWx0IG9uKS4gV2hlbiBvZmYsXG4gICAqIGltYWdlcyBrZWVwIE9ic2lkaWFuJ3MgbmF0aXZlIGlubGluZSBmbG93IFx1MjAxNCB0ZXh0IGZsb3dzIGFyb3VuZC9iZXNpZGVcbiAgICogdGhlbSBleGFjdGx5IGxpa2UgTGl2ZSBQcmV2aWV3IG91dHNpZGUgU2xpZGVzIG1vZGUuXG4gICAqL1xuICBpbWFnZUxheW91dDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0ge1xuICBzaG93TmF2QnV0dG9uczogdHJ1ZSxcbiAgcGFnZU51bWJlclN0eWxlOiBcIm5vbmVcIixcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBzaG93U2xpZGVzQmFyOiB0cnVlLFxuICBiYXJIaWRkZW46IGZhbHNlLFxuICBhdXRvRW50ZXJTbGlkZXM6IGZhbHNlLFxuICBlc2NFeGl0c1NsaWRlczogdHJ1ZSxcbiAgc2xpZGVzVGl0bGU6IFwiXCIsXG4gIHNsaWRlc1RoZW1lOiBcImp5eVwiLFxuICBiYXJQcm9wZXJ0aWVzOiBcIlwiLFxuICBiYXJQcm9wZXJ0eVdpZHRoczogXCJcIixcbiAgY29uZmlybURlbGV0ZVNsaWRlczogdHJ1ZSxcbiAgaW1hZ2VMYXlvdXQ6IHRydWUsXG59O1xuXG4vKiogUmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5IGRyaXZpbmcgZGVjayBuYXZpZ2F0aW9uIChuZXZlciByZW5kZXJlZCBhcyBhIGNoaXApICovXG5leHBvcnQgY29uc3QgREVDS19LRVkgPSBcImRlY2tcIjtcbiIsICJpbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGNvcHlDYXBhY2l0eVByb21wdCB9IGZyb20gXCIuL2NhcGFjaXR5XCI7XG5pbXBvcnQgeyByZWdpc3RlckRlYnVnQ29tbWFuZCB9IGZyb20gXCIuL2RlYnVnXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBSZWdpc3RlciBldmVyeSBjb21tYW5kOyB0aGUgZGVidWcgY29tbWFuZCBpcyBkZXYtYnVpbGQgb25seS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbW1hbmRzKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIC8vIFRvZ2dsZSB0aGUgc2xpZGVzIGJhciBcdTIwMTQgb25seSBtZWFuaW5nZnVsIGluc2lkZSBTbGlkZXMgbW9kZSwgc28gYVxuICAvLyBjaGVja0NhbGxiYWNrIGtlZXBzIGl0IG91dCBvZiB0aGUgcGFsZXR0ZSBldmVyeXdoZXJlIGVsc2VcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1iYXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgYmFyXCIsXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB7XG4gICAgICAgIHBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW4gPSAhcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAgICAgdm9pZCBwbHVnaW4uc2F2ZVNldHRpbmdzKCkudGhlbigoKSA9PiBwbHVnaW4ucmVmcmVzaCgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBTaG93IHRoZSBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtc2hvdy1wYW5lbFwiLFxuICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgcGFuZWxcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBwbHVnaW4uYWN0aXZhdGVTbGlkZXNQYW5lbCgpLFxuICB9KTtcbiAgLy8gSGlkZSAvIHNob3cgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgKHByZXNlbnRpbmc7IFNsaWRlcyBtb2RlIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtcG9pbnRlclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIG1vdXNlIHBvaW50ZXJcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgcGx1Z2luLnRvZ2dsZVBvaW50ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBQcmV2aW91cyAvIG5leHQgcGFnZSBcdTIwMTQgZGVjayBuYXZpZ2F0aW9uIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhc1xuICAvLyBuZWVkZWQpLiBjaGVja0NhbGxiYWNrIGtlZXBzIHRoZW0gb3V0IG9mIHRoZSBwYWxldHRlIG9uIG5vbi1kZWNrIG5vdGVzLFxuICAvLyB3aGVyZSB0aGV5IGhhdmUgbm90aGluZyB0byBmbGlwOyB0aGVpciBkZWZhdWx0IGhvdGtleXMgdGhlbiBubyBsb25nZXJcbiAgLy8gc2hhZG93IHRoZSBlZGl0b3IncyBzZWxlY3QtdG8tbGluZSBzaG9ydGN1dHMgb24gcGxhaW4gbm90ZXMgZWl0aGVyLlxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtcHJldlwiLFxuICAgIG5hbWU6IFwiUHJldmlvdXMgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd0xlZnRcIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4ubmF2aWdhdGUoXCJwcmV2XCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1uZXh0XCIsXG4gICAgbmFtZTogXCJOZXh0IHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dSaWdodFwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSB8fCAhcGx1Z2luLmRlY2tTZXJ2aWNlLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSB2b2lkIHBsdWdpbi5uYXZpZ2F0ZShcIm5leHRcIik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5leHQgU2xpZGUgXHUyMDE0IG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBvbmUgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXh0XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV4dCBzbGlkZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJOXCIgfV0sXG4gICAgLy8gR3JleWVkIG91dCB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGlzIHBhcnQgb2YgYSBkZWNrIFx1MjAxNCBwbGFpbiBub3Rlc1xuICAgIC8vIHN0YXJ0IGRlY2tzIHdpdGggXCJDcmVhdGUgbmV3IHNsaWRlXCIgaW5zdGVhZC5cbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5ldyBTbGlkZSBcdTIwMTQgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuIEhpZGRlbiBvbiBkZWNrIG5vdGVzXG4gIC8vICh0aGUgZGVjayBncm93cyB2aWEgQ3JlYXRlIE5leHQgU2xpZGUgaW5zdGVhZCk7IHN0aWxsIHdvcmtzIGZyb20gYVxuICAvLyBibGFuayB0YWIgXHUyMDE0IGxhbmRzIGluIHRoZSBkZWZhdWx0IG5ldy1ub3RlIGxvY2F0aW9uLlxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY3JlYXRlLW5ld1wiLFxuICAgIG5hbWU6IFwiQ3JlYXRlIG5ldyBzbGlkZVwiLFxuICAgIC8vIE5vIGRlZmF1bHQgaG90a2V5OiBNb2QrU2hpZnQrTiBiZWxvbmdzIHRvIENyZWF0ZSBuZXh0IHNsaWRlIFx1MjAxNCB0d29cbiAgICAvLyBjb21tYW5kcyBzaGFyaW5nIG9uZSBkZWZhdWx0IGhvdGtleSB0cmlwcyBPYnNpZGlhbidzIGNvbmZsaWN0IFVJLlxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmIChmaWxlICYmIHBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5ldyhwbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5ldygpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBJbml0aWFsaXplIHNsaWRlcyB3aXRoIHRoaXMgbm90ZSBcdTIwMTQgcHJvbW90ZSB0aGUgYWN0aXZlIChwbGFpbikgbm90ZSBpbnRvXG4gIC8vIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGl0IGdhaW5zIGBkZWNrOiBbXWAgYW5kIGtlZXBzIGl0c1xuICAvLyBjb250ZW50LCB0aXRsZSBhbmQgbG9jYXRpb24sIHRoZW4gU2xpZGVzIG1vZGUgYXV0by1lbnRlcnMuIGNoZWNrQ2FsbGJhY2tcbiAgLy8gc2hvd3MgaXQgb25seSBvbiBub3RlcyB0aGF0IGFyZSBOT1QgYWxyZWFkeSBwYXJ0IG9mIGEgZGVjaywgc28gaXQgbmV2ZXJcbiAgLy8gYXBwZWFycyBvbiBkZWNrL3NsaWRlcyBub3RlcyB3aGVyZSBpdCB3b3VsZCBiZSBtaXNsZWFkaW5nLiBDb252ZXJzaW9uIGlzXG4gIC8vIGEgc2luZ2xlIGZyb250bWF0dGVyIHdyaXRlIChubyBjb25maXJtYXRpb24gZGlhbG9nKS5cbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLW1ha2UtZmlyc3Qtc2xpZGVcIixcbiAgICBuYW1lOiBcIkluaXRpYWxpemUgc2xpZGVzIHdpdGggdGhpcyBub3RlXCIsXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlIHx8IHBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykge1xuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29udmVydGVkID0gYXdhaXQgcGx1Z2luLmRlY2tTZXJ2aWNlLm1ha2VGaXJzdFNsaWRlKGZpbGUpO1xuICAgICAgICAgIGlmICghY29udmVydGVkKSByZXR1cm47IC8vIGRlZmVuc2l2ZSBcdTIwMTQgdGhlIGNoZWNrIGFib3ZlIGFscmVhZHkgcGFzc2VkXG4gICAgICAgICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IG1hZGUgdGhpcyBub3RlIHRoZSBmaXJzdCBzbGlkZSBvZiBhIG5ldyBkZWNrXCIpO1xuICAgICAgICAgIGF3YWl0IHBsdWdpbi5lbnRlclNsaWRlc0ZvckFjdGl2ZSgpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIENvcHkgYSBvbmUtc2NyZWVuIGNhcGFjaXR5IHJlcG9ydCBvZiB0aGUgY3VycmVudCBTbGlkZXMgbGF5b3V0XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jb3B5LXNsaWRlLXNraWxsXCIsXG4gICAgbmFtZTogXCJDb3B5IEFJIGFnZW50IHByb21wdFwiLFxuICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBjaGVja0NhbGxiYWNrIGlzIG5vdCB1c2VkOiBpdCB3b3VsZCBoaWRlIHRoZSBjb21tYW5kIGZyb20gdGhlXG4gICAgICAvLyBjb21tYW5kIHBhbGV0dGUgb3V0c2lkZSBTbGlkZXMgbW9kZSAocGFsZXR0ZSBvbmx5IHNob3dzIGNvbW1hbmRzXG4gICAgICAvLyB3aG9zZSBjaGVja0NhbGxiYWNrIHJldHVybnMgdHJ1ZSkuIEtlZXAgdGhlIGNvbW1hbmQgYWx3YXlzIHZpc2libGVcbiAgICAgIC8vIGFuZCBleHBsYWluIHRoZSByZXF1aXJlZCBtb2RlIHdoZW4gaW52b2tlZCB0b28gZWFybHkuXG4gICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhd2FpdCBjb3B5Q2FwYWNpdHlQcm9tcHQocGx1Z2luLmFwcCk7XG4gICAgfSxcbiAgfSk7XG4gIC8vIFRvZ2dsZSBTbGlkZXMgbW9kZSBcdTIwMTQgdGhlIGltbWVyc2l2ZSBjYXJkIHZpZXcgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1zbGlkZXNcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgbW9kZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJFXCIgfV0sXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YocGx1Z2luLmFwcCwgZmlsZSk7XG4gICAgICBpZiAoZm0gPT09IG51bGwgfHwgIShERUNLX0tFWSBpbiBmbSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVTbGlkZXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBEZWJ1ZyB0b29saW5nIFx1MjAxNCByZWdpc3RlcmVkIG9ubHkgaW4gZGV2IGJ1aWxkcyAodHJlZS1zaGFrZW4gaW4gcmVsZWFzZSlcbiAgaWYgKERFVl9NT0RFKSByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW4pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtcbiAgcGxhbkNyZWF0ZU5ldyBhcyBwbGFuTmV3LFxuICBwbGFuQ3JlYXRlTmV4dCBhcyBwbGFuLFxuICBwbGFuTWFrZUZpcnN0U2xpZGUgYXMgcGxhbkZpcnN0LFxuICB0eXBlIENyZWF0ZU5leHRSZXN1bHQsXG59IGZyb20gXCIuL2NyZWF0ZU5leHRcIjtcbmltcG9ydCB7IGNvbXB1dGVEZWNrLCBleHRyYWN0TGlua3MsIGV4dHJhY3RSYXdMaW5rcywgdHlwZSBEZWNrSW5mbyB9IGZyb20gXCIuL2RlY2tcIjtcbmltcG9ydCB7IHBpY2tMYW5kaW5nUGF0aCwgcGxhbkRlbGV0ZVNsaWRlcyB9IGZyb20gXCIuL2RlbGV0ZVNsaWRlc1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB7IERFQ0tfS0VZIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqIFJlc3VsdCBvZiBhIERlbGV0ZSBzbGlkZXMgcnVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVNsaWRlc1Jlc3VsdCB7XG4gIC8qKiBQYXRocyBhY3R1YWxseSBtb3ZlZCB0byB0aGUgdHJhc2ggKi9cbiAgdHJhc2hlZDogc3RyaW5nW107XG4gIC8qKiBXaGVyZSB0aGUgZWRpdG9yIHNob3VsZCBsYW5kIGFmdGVyd2FyZHMgKG51bGwgPSBrZWVwIGN1cnJlbnQgbm90ZSkgKi9cbiAgbGFuZGluZ1BhdGg6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKiBEZWNrIGNoYWluIHJlc29sdXRpb24gKyBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgZ2x1ZSAod3JhcHMgdGhlIHB1cmUgY29yZSkuICovXG5leHBvcnQgY2xhc3MgRGVja1NlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwKSB7fVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrOiBpdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlblxuICAgKiBlbXB0eSBcdTIwMTQgYSBmcmVzaCBzaW5nbGUgc2xpZGUpIG9yIHNvbWUgb3RoZXIgc2xpZGUgZGVjbGFyZXMgaXQgYXMgaXRzXG4gICAqIG5leHQgc2xpZGUuXG4gICAqL1xuICBpc01lbWJlcihmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIChmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbSkgfHwgdGhpcy5wcmV2T2YoZmlsZS5wYXRoKSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIFJlc29sdmUgdGhlIGN1cnJlbnQgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjayAobnVsbCB3aGVuIG5vdCBhIG1lbWJlcikgKi9cbiAgY29tcHV0ZShmaWxlOiBURmlsZSk6IERlY2tJbmZvIHwgbnVsbCB7XG4gICAgaWYgKCF0aGlzLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gY29tcHV0ZURlY2soXG4gICAgICBmaWxlLnBhdGgsXG4gICAgICAocGF0aCkgPT4gdGhpcy5saW5rUGF0aHMocGF0aCksXG4gICAgICAocGF0aCkgPT4gdGhpcy5wcmV2T2YocGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgYSBub3RlIGludG8gcmVhbCBub3RlIHBhdGhzIChtYXggb25lKSAqL1xuICBwcml2YXRlIGxpbmtQYXRocyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gW107XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXNcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KTogeCBpcyBURmlsZSA9PiAhIXgpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh0aGUgcHJldmlvdXMgc2xpZGUgaW5cbiAgICogdGhlIGNoYWluKS4gV2l0aCBuZXh0LW9ubHkgc2VtYW50aWNzIHRoaXMgYmFja3dhcmQgbG9va3VwIGlzIHRoZSBvbmx5XG4gICAqIHdheSB0byByZWFjaCB0aGUgY2hhaW4gaGVhZCBmcm9tIGEgbWlkZGxlL2xhc3Qgc2xpZGUuXG4gICAqL1xuICBwcml2YXRlIHByZXZPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLnBhdGggPT09IHBhdGgpIGNvbnRpbnVlO1xuICAgICAgaWYgKHRoaXMubGlua1BhdGhzKGYucGF0aClbMF0gPT09IHBhdGgpIHJldHVybiBmLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogTmFtZXMgaW4gdGhlIGBkZWNrYCBwcm9wZXJ0eSB0aGF0IHJlc29sdmUgdG8gbm8gbm90ZSAoYnJva2VuIGxpbmtzKSAqL1xuICBicm9rZW4oZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBmaWxlLnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIHJ1biBmb3IgdGhlIGFjdGl2ZSBub3RlLiBEZWNrIHNsaWRlc1xuICAgKiBpbnNlcnQvYXBwZW5kIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuIChQbGFpbiBub3RlcyBhcmUgcm91dGVkIHRvXG4gICAqIHBsYW5DcmVhdGVOZXcgYnkgdGhlIGNvbW1hbmQgXHUyMDE0IHRoaXMgY29yZSBzdGlsbCBoYW5kbGVzIHRoZW0gYXNcbiAgICogXCJubyB1c2FibGUgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmRcIi4pXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV4dChmaWxlOiBURmlsZSk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IHJhdyA9IGZtID8gZXh0cmFjdFJhd0xpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICBjb25zdCBleGlzdGluZ05hbWVzID0gbmV3IFNldCh0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkubWFwKChmKSA9PiBmLmJhc2VuYW1lKSk7XG4gICAgcmV0dXJuIHBsYW4oeyBjdXJyZW50TmFtZTogZmlsZS5iYXNlbmFtZSwgY3VycmVudExpbmtzOiByYXcsIGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHJ1bjogYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgaW4gdGhlXG4gICAqIHNhbWUgZm9sZGVyIGFzIHRoZSBhY3RpdmUgbm90ZSwgd2hpY2ggaXRzZWxmIHN0YXlzIHVudG91Y2hlZC5cbiAgICovXG4gIHBsYW5DcmVhdGVOZXcoKTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuTmV3KHsgZXhpc3RpbmdOYW1lcyB9KTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIENyZWF0ZSBOZXh0IFNsaWRlIHBsYW47IG9wZW49ZmFsc2Uga2VlcHMgdGhlIGN1cnJlbnQgbm90ZSBpbiB0aGUgZWRpdG9yICovXG4gIGFzeW5jIGV4ZWN1dGVDcmVhdGVOZXh0KGZpbGU6IFRGaWxlLCBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LCBvcGVuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKGZpbGUsIHBsYW4sIGRpclByZWZpeChmaWxlLnBhcmVudD8ucGF0aCksIG9wZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgQ3JlYXRlIE5ldyBTbGlkZSBwbGFuLiBMYW5kcyBpbiBPYnNpZGlhbidzIGRlZmF1bHQgbmV3LW5vdGVcbiAgICogbG9jYXRpb24gKFNldHRpbmdzIFx1MjE5MiBGaWxlcyAmIGxpbmtzIFx1MjE5MiBEZWZhdWx0IGxvY2F0aW9uIGZvciBuZXcgbm90ZXMpO1xuICAgKiB3aXRoIFwic2FtZSBmb2xkZXIgYXMgY3VycmVudFwiIGNvbmZpZ3VyZWQgdGhhdCBpcyB0aGUgYWN0aXZlIG5vdGUncyBvd25cbiAgICogZm9sZGVyLiBXb3JrcyB3aXRoIG5vIG5vdGUgb3BlbiBhdCBhbGwgKGJsYW5rIHRhYikuXG4gICAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV3KHBsYW46IENyZWF0ZU5leHRSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBcIlwiO1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKFxuICAgICAgbnVsbCxcbiAgICAgIHBsYW4sXG4gICAgICBkaXJQcmVmaXgodGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChzb3VyY2VQYXRoKT8ucGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9tb3RlIHRoZSBhY3RpdmUgbm90ZSBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGFkZCBgZGVjazogW11gXG4gICAqIHRvIGl0cyBmcm9udG1hdHRlciBcdTIwMTQgY29udGVudCwgdGl0bGUsIGxvY2F0aW9uIGFuZCBldmVyeSBvdGhlciBwcm9wZXJ0eVxuICAgKiBzdGF5IHVudG91Y2hlZC4gTm90ZXMgdGhhdCBhbHJlYWR5IGJlbG9uZyB0byBhIGRlY2sgYXJlIGxlZnQgYWxvbmUuXG4gICAqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBub3RlIHdhcyBjb252ZXJ0ZWQgKHRoZSBjYWxsZXIgbWF5IHRoZW4gYXV0by1lbnRlclxuICAgKiBTbGlkZXMgbW9kZSksIGZhbHNlIHdoZW4gaXQgd2FzIGFscmVhZHkgYSBkZWNrIG1lbWJlci5cbiAgICovXG4gIGFzeW5jIG1ha2VGaXJzdFNsaWRlKGZpbGU6IFRGaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKHBsYW5GaXJzdCh7IGFscmVhZHlEZWNrOiB0aGlzLmlzTWVtYmVyKGZpbGUpIH0pID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgIGZtW0RFQ0tfS0VZXSA9IFtdO1xuICAgIH0pO1xuICAgIC8vIE9ic2lkaWFuIGluZGV4ZXMgYSBzYXZlZCBmaWxlIGFzeW5jaHJvbm91c2x5OyB0aGUgY29tbWFuZCdzIGF1dG8tZW50ZXJcbiAgICAvLyByZWFkcyB0aGUgY2FjaGUsIHNvIGhhbmQgYmFjayBvbmx5IG9uY2UgdGhlIG5ldyBgZGVja2AgaXMgdmlzaWJsZS5cbiAgICBhd2FpdCB0aGlzLndhaXRGb3JDYWNoZWREZWNrKGZpbGUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXQgdW50aWwgdGhlIG1ldGFkYXRhIGNhY2hlIHJlZmxlY3RzIHRoZSBub3RlJ3MgYGRlY2tgIHByb3BlcnR5XG4gICAqIChiZXN0IGVmZm9ydCBcdTIwMTQgcmVzb2x2ZXMgb24gdGhlIHByb3BlcnR5IGFwcGVhcmluZywgb3IgYWZ0ZXIgYHRpbWVvdXRNc2ApLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyB3YWl0Rm9yQ2FjaGVkRGVjayhmaWxlOiBURmlsZSwgdGltZW91dE1zID0gMjAwMCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmhhc0RlY2tJbkNhY2hlKGZpbGUpKSByZXR1cm47XG4gICAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChjaGFuZ2VkOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlZC5wYXRoID09PSBmaWxlLnBhdGggJiYgdGhpcy5oYXNEZWNrSW5DYWNoZShmaWxlKSkge1xuICAgICAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub2ZmcmVmKHJlZik7XG4gICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9mZnJlZihyZWYpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCB0aW1lb3V0TXMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1ldGFkYXRhIGNhY2hlIGFscmVhZHkgc2hvd3MgYSBgZGVja2AgcHJvcGVydHkgb24gdGhlIG5vdGUgKi9cbiAgcHJpdmF0ZSBoYXNEZWNrSW5DYWNoZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIEFwcGx5IGEgcGxhbjogY3JlYXRlIHRoZSBub3RlLCByZXdpcmUgYGRlY2tgIHByb3BlcnRpZXMsIG9wdGlvbmFsbHkgb3BlbiBpdCAqL1xuICBwcml2YXRlIGFzeW5jIGFwcGx5UGxhbihcbiAgICBmaWxlOiBURmlsZSB8IG51bGwsXG4gICAgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCxcbiAgICBkaXI6IHN0cmluZyxcbiAgICBvcGVuID0gdHJ1ZSxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGAke2Rpcn0ke3BsYW4ubmV3TmFtZX0ubWRgO1xuICAgIGNvbnN0IGZyb250bWF0dGVyID0gcGxhbi5uZXdEZWNrTGlua3MubWFwKChsaW5rKSA9PiBKU09OLnN0cmluZ2lmeShsaW5rKSkuam9pbihcIiwgXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgLS0tXFxuZGVjazogWyR7ZnJvbnRtYXR0ZXJ9XVxcbi0tLVxcbmA7XG5cbiAgICBsZXQgbmV3RmlsZTogVEZpbGU7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUobmV3UGF0aCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBjcmVhdGUgXCIke3BsYW4ubmV3TmFtZX0ubWRcIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXdpcmUgdGhlIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCAoa2VlcHMgYWxsIG90aGVyIHByb3BlcnRpZXMgaW50YWN0KVxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiBwbGFuLnJld3JpdGVzKSB7XG4gICAgICBpZiAoIWZpbGUgfHwgcmV3cml0ZS5uYW1lICE9PSBmaWxlLmJhc2VuYW1lKSBjb250aW51ZTsgLy8gaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGVcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IHJld3JpdGUuZGVjaztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghb3BlbikgcmV0dXJuO1xuXG4gICAgLy8gT3BlbiB0aGUgbmV3IG5vdGUgaW4gdGhlIGN1cnJlbnQgcGFuZSwgZWRpdCBtb2RlIChMaXZlIFByZXZpZXcpXG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5ld0ZpbGUsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzbGlkZXMgb3V0IG9mIGFuIG9yZGVyZWQgZGVjayBjaGFpbjogc3BsaWNlIHRoZSBjaGFpbiBhcm91bmRcbiAgICogZXZlcnkgZGVsZXRlZCBydW4gKHRoZSBwcmVkZWNlc3NvcidzIGBkZWNrYCB0YWtlcyBvdmVyIHRoZSBydW4ncyBmaXJzdFxuICAgKiBzdXJ2aXZvciksIHRoZW4gbW92ZSBlYWNoIGRlbGV0ZWQgbm90ZSB0byB0aGUgdHJhc2guIGBmb2N1c1BhdGhgIGlzIHRoZVxuICAgKiBub3RlIHRoZSBlZGl0b3IgY3VycmVudGx5IHNob3dzIFx1MjAxNCB3aGVuIGl0IGlzIGFtb25nIHRoZSBkZWxldGVkLCB0aGVcbiAgICogcmVzdWx0IG5hbWVzIHRoZSBuZWFyZXN0IHN1cnZpdmluZyBuZWlnaGJvdXIgdG8gb3BlbiBpbnN0ZWFkLlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICBjaGFpbjogc3RyaW5nW10sXG4gICAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gICAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuICApOiBQcm9taXNlPERlbGV0ZVNsaWRlc1Jlc3VsdD4ge1xuICAgIGNvbnN0IHJld3JpdGVzID0gcGxhbkRlbGV0ZVNsaWRlcyhjaGFpbiwgZGVsZXRlUGF0aHMpO1xuXG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHJld3JpdGVzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUucGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG5leHQgPSByZXdyaXRlLm5leHRQYXRoID8gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUubmV4dFBhdGgpIDogbnVsbDtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IG5leHQgaW5zdGFuY2VvZiBURmlsZSA/IFtgW1ske25leHQuYmFzZW5hbWV9XV1gXSA6IFtdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhc2hlZDogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgZGVsZXRlUGF0aHMpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnRyYXNoRmlsZShmKTtcbiAgICAgICAgdHJhc2hlZC5wdXNoKHBhdGgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IGRlbGV0ZSBcIiR7Zi5iYXNlbmFtZX1cIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0cmFzaGVkLCBsYW5kaW5nUGF0aDogcGlja0xhbmRpbmdQYXRoKGNoYWluLCBkZWxldGVQYXRocywgZm9jdXNQYXRoKSB9O1xuICB9XG59XG5cbi8qKiBGb2xkZXIgcGF0aCBcdTIxOTIgdHJhaWxpbmctc2xhc2ggcHJlZml4IChcIlwiIGZvciB2YXVsdCByb290KSAqL1xuZnVuY3Rpb24gZGlyUHJlZml4KHBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghcGF0aCB8fCBwYXRoID09PSBcIi9cIikgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBgJHtwYXRoLnJlcGxhY2UoL1xcLyskLywgXCJcIil9L2A7XG59XG4iLCAiLyoqXG4gKiBkZWNrLnRzIFx1MjAxNCBQdXJlIGRlY2stcmVzb2x1dGlvbiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9kZWNrLnRlc3QudHMpLiBtYWluLnRzIGFkYXB0cyB0aGVcbiAqIHZhdWx0IChtZXRhZGF0YUNhY2hlKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlOiBpdCByZXNvbHZlcyBgZGVja2BcbiAqIHByb3BlcnRpZXMgdG8gbm90ZSBwYXRocywgdGhlbiBoYW5kcyB0aGUgcGF0aCBncmFwaCB0byBjb21wdXRlRGVjaygpLlxuICovXG5cbi8qKiBBIGRlY2sgbGluayBsaXN0IGhvbGRzIGF0IG1vc3Qgb25lIGVudHJ5ICh0aGUgbmV4dCBzbGlkZSkgKi9cbmV4cG9ydCBjb25zdCBNQVhfREVDS19MSU5LUyA9IDE7XG5cbi8qKiBSZXN1bHQgb2YgcmVzb2x2aW5nIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBhIGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja0luZm8ge1xuICAvKiogQ2hhaW4gb2Ygbm90ZSBwYXRoczogWzBdIGlzIHRoZSBmaXJzdCBzbGlkZSwgdGhlbiB0aGUgcmVzdCBpbiBvcmRlciAqL1xuICBjaGFpbjogc3RyaW5nW107XG4gIC8qKiBJbmRleCBvZiB0aGUgY3VycmVudCBub3RlIGluc2lkZSBjaGFpbiAqL1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6XG4gKiAgIC0gYSBzbGlkZSdzIGBkZWNrYCBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rOiB0aGUgbmV4dCBzbGlkZVxuICogICAgICh0aGUgbGFzdCBzbGlkZSBoYXMgbm8gbGluayBhdCBhbGwpO1xuICogICAtIGEgZGVjayBpcyBzaW1wbHkgYSBmb3J3YXJkIGxpbmsgY2hhaW4gc3RhcnRpbmcgYXQgaXRzIGhlYWQgc2xpZGU7XG4gKiAgIC0gYW55IG5vdGUgdGhhdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlbiBlbXB0eSkgaXMgYSBkZWNrIG1lbWJlcixcbiAqICAgICBzbyBhIHNpbmdsZSBmcmVzaGx5IGNyZWF0ZWQgc2xpZGUgYWxyZWFkeSBjb3VudHMgYXMgYSBvbmUtcGFnZSBkZWNrLlxuICpcbiAqIEJlY2F1c2Ugc2xpZGVzIG5vIGxvbmdlciBsaW5rIGJhY2sgdG8gYSBoZWFkIG5vdGUsIHRoZSBjaGFpbiBoZWFkIGlzXG4gKiBsb2NhdGVkIGJ5IHdhbGtpbmcgYmFja3dhcmQ6IGBnZXRQcmV2KHBhdGgpYCByZXR1cm5zIHRoZSBub3RlIHdob3NlXG4gKiBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodW5kZWZpbmVkIHdoZW4gbm9uZSkuXG4gKlxuICogYGdldExpbmtzKHBhdGgpYCBtdXN0IHJldHVybiB0aGUgcmVzb2x2ZWQgbm90ZSBwYXRocyBvZiB0aGUgYGRlY2tgXG4gKiBwcm9wZXJ0eSBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKGVtcHR5IHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUsIG9yIGl0c1xuICogbGluayBpcyBicm9rZW4gXHUyMDE0IGEgYnJva2VuIGxpbmsgc2ltcGx5IGVuZHMgdGhlIGNoYWluLCBuZXZlciBjcmFzaGVzKS5cbiAqXG4gKiBSZXR1cm5zIHRoZSBmdWxsIGNoYWluIGFuZCB0aGUgY3VycmVudCBub3RlJ3MgaW5kZXgsIG9yIG51bGwgd2hlbiB0aGVcbiAqIG5vdGUgaXMgbm90IHBhcnQgb2YgYW55IGRlY2sgKG5vIGBkZWNrYCBwcm9wZXJ0eSBhbmQgbm9ib2R5IGxpbmtzIHRvIGl0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVEZWNrKFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuICBnZXRMaW5rczogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW10sXG4gIGdldFByZXY6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIC8vIFdhbGsgYmFja3dhcmQgdG8gdGhlIGNoYWluIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLiBBIGxvbmUgbm9kZSAobm8gb3duXG4gIC8vIGxpbmssIG5vIHByZWRlY2Vzc29yKSByZXNvbHZlcyBhcyBhIG9uZS1wYWdlIGNoYWluIFx1MjAxNCB3aGV0aGVyIGl0IGNvdW50c1xuICAvLyBhcyBhIGRlY2sgbWVtYmVyIGF0IGFsbCBpcyBkZWNpZGVkIGJ5IHRoZSBhZGFwdGVyICh0aGUgYGRlY2tgIGtleSkuXG4gIGNvbnN0IGJhY2tWaXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KFtjdXJyZW50UGF0aF0pO1xuICBsZXQgaGVhZCA9IGN1cnJlbnRQYXRoO1xuICBmb3IgKDs7KSB7XG4gICAgY29uc3QgcHJldiA9IGdldFByZXYoaGVhZCk7XG4gICAgaWYgKCFwcmV2IHx8IGJhY2tWaXNpdGVkLmhhcyhwcmV2KSkgYnJlYWs7XG4gICAgYmFja1Zpc2l0ZWQuYWRkKHByZXYpO1xuICAgIGhlYWQgPSBwcmV2O1xuICB9XG5cbiAgLy8gV2FsayBmb3J3YXJkIGZyb20gdGhlIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgY3VyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBoZWFkO1xuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyKTtcbiAgICBjaGFpbi5wdXNoKGN1cik7XG4gICAgY3VyID0gZ2V0TGlua3MoY3VyKVswXTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIG5vdGUgbmFtZXMgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEFjY2VwdHMgYSBzaW5nbGUgc3RyaW5nIG9yIGEgWUFNTCBsaXN0IG9mIHN0cmluZ3M7IHVucXVvdGVkIFtbeF1dIHZhbHVlc1xuICogYXJlIHBhcnNlZCBieSBZQU1MIGFzIG5lc3RlZCBhcnJheXMgYW5kIGZsYXR0ZW5lZCBoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgY29uc3QgbmFtZSA9IGV4dHJhY3RMaW5rVGV4dChpdGVtKTtcbiAgICBpZiAobmFtZSkgb3V0LnB1c2gobmFtZSk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgcmF3IGxpbmsgc3RyaW5ncyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlIFx1MjAxNCB0aGVcbiAqIHRyaW1tZWQgdmFsdWVzIGV4YWN0bHkgYXMgd3JpdHRlbiAoYWxpYXMgLyBwYXRoIGZvcm1zIHByZXNlcnZlZCkuIFNhbWVcbiAqIGZsYXR0ZW5pbmcgcnVsZXMgYXMgZXh0cmFjdExpbmtzKCksIGJ1dCB3aXRob3V0IGV4dHJhY3RpbmcgdGhlIHRhcmdldCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFJhd0xpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSBcInN0cmluZ1wiKSBjb250aW51ZTtcbiAgICBjb25zdCB0cmltbWVkID0gaXRlbS50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh0cmltbWVkKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgdGFyZ2V0IG5vdGUgbmFtZSBmcm9tIGEgbWFya2Rvd24gbGluayBzdHJpbmcuXG4gKiBIYW5kbGVzIHNldmVyYWwgc2hhcGVzOlxuICogICBcIltbc2xpZGUtMl1dXCIgICAgICAgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yfGFsaWFzXV1cIiAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTIjc2VjdGlvbl1dXCJcdTIxOTIgc2xpZGUtMlxuICogICBzbGlkZS0yICAgICAgICAgICAgICBcdTIxOTIgc2xpZGUtMiAoYmFyZSBmaWxlbmFtZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rVGV4dCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHRyaW1tZWQucmVwbGFjZSgvXlxcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0uc3BsaXQoXCIjXCIpWzBdLnRyaW0oKTtcbn1cblxuLyoqIFJlbmRlciBhIHByb3BlcnR5IHZhbHVlIGFzIHJlYWRhYmxlIHRleHQ6IGFycmF5cy9vYmplY3RzIFx1MjE5MiBKU09OLCBlbHNlIFN0cmluZyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBcIlx1MjAxNFwiO1xuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpID8/IFwiXHUyMDE0XCI7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gY2lyY3VsYXIgLyB1bi1zdHJpbmdpZmlhYmxlIHN0cnVjdHVyZSBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgICAgcmV0dXJuIFwiXHUyMDE0XCI7XG4gICAgICB9XG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIHN5bWJvbCAvIGZ1bmN0aW9uIFx1MjAxNCBub3QgZXhwZWN0ZWQgZnJvbSBmcm9udG1hdHRlclxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogY3JlYXRlTmV4dC50cyBcdTIwMTQgUHVyZSBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgLyBcIkNyZWF0ZSBOZXcgU2xpZGVcIiBwbGFubmluZ1xuICogY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvY3JlYXRlTmV4dC50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHNcbiAqIHRoZSB2YXVsdCAobWV0YWRhdGFDYWNoZSwgY29tcHV0ZURlY2spIHRvIHRoaXMgcHVyZSBpbnRlcmZhY2UgYW5kIGFwcGxpZXNcbiAqIHRoZSByZXN1bHRpbmcgcGxhbiB3aXRoIHZhdWx0LmNyZWF0ZSgpICsgZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKCkuXG4gKlxuICogdjEuMC4wIGNvbnZlbnRpb24gXHUyMDE0IG5leHQtb25seSwgbm8gb3ZlcnZpZXcgcGFnZTogYSBzbGlkZSdzIGBkZWNrYFxuICogcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluayAoaXRzIG5leHQgc2xpZGUpLiBwbGFuQ3JlYXRlTmV4dCBkZWNpZGVzLFxuICogZm9yIHRoZSBjdXJyZW50IGRlY2sgbm90ZTpcbiAqICAgLSB0aGUgbmFtZSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKGNvbGxpc2lvbi1hd2FyZSksXG4gKiAgIC0gdGhlIHJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgbmV3IG5vdGUsXG4gKiAgIC0gdGhlIHJld3JpdGVzIG5lZWRlZCBvbiBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSkuXG4gKiBwbGFuQ3JlYXRlTmV3IHBsYW5zIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIChhIGZyZXNoIG5vdGUgdGhhdCBpc1xuICogbm90IHBhcnQgb2YgYW55IGRlY2sgeWV0IFx1MjAxNCBgZGVjazogW11gLCBubyByZXdyaXRlcyBhbnl3aGVyZSkuXG4gKiBwbGFuTWFrZUZpcnN0U2xpZGUgcGxhbnMgdGhlIGludmVyc2U6IHByb21vdGluZyBhbiBleGlzdGluZyBwbGFpbiBub3RlXG4gKiBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2sgKGBkZWNrOiBbXWAgd3JpdHRlbiBvbnRvIHRoZSBub3RlXG4gKiBpdHNlbGYsIG5vdGhpbmcgY3JlYXRlZCBvciByZXdyaXR0ZW4pLlxuICovXG5cbmltcG9ydCB7IGV4dHJhY3RMaW5rVGV4dCB9IGZyb20gXCIuL2RlY2tcIjtcblxuLyoqIElucHV0cyBmb3IgcGxhbm5pbmcgXHUyMDE0IHJlc29sdmVkIGJ5IHRoZSBhZGFwdGVyIGluIG1haW4udHMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dElucHV0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIGN1cnJlbnQgbm90ZSAqL1xuICBjdXJyZW50TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBjdXJyZW50IG5vdGUgKGV4dHJhY3RlZCwgYXQgbW9zdCBvbmUpICovXG4gIGN1cnJlbnRMaW5rczogc3RyaW5nW107XG4gIC8qKiBCYXNlbmFtZXMgb2YgZXZlcnkgbWFya2Rvd24gbm90ZSBpbiB0aGUgdmF1bHQgKGNvbGxpc2lvbi1mcmVlIG5hbWluZykgKi9cbiAgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz47XG59XG5cbi8qKiBPbmUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja1Jld3JpdGUge1xuICAvKiogQmFzZW5hbWUgb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IHJhdyBgZGVja2AgbGluayB0ZXh0cyAoc2VyaWFsaXplZCBhcyBhIFlBTUwgbGlzdCkgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKiBUaGUgZnVsbCBwbGFuIGZvciBjcmVhdGluZyBvbmUgbmV3IHNsaWRlICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRSZXN1bHQge1xuICAvKiogQmFzZW5hbWUgKHdpdGhvdXQgZXh0ZW5zaW9uKSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKi9cbiAgbmV3TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIGZvciB0aGUgbmV3IG5vdGUncyBmcm9udG1hdHRlciAqL1xuICBuZXdEZWNrTGlua3M6IHN0cmluZ1tdO1xuICAvKiogUmV3cml0ZXMgdG8gYXBwbHkgdG8gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlKSAqL1xuICByZXdyaXRlczogRGVja1Jld3JpdGVbXTtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBub3RlLlxuICpcbiAqIEJlaGF2aW9yczpcbiAqICAgLSBObyBuZXh0IGxpbmsgKGxhc3Qgc2xpZGUsIGZyZXNoIGRlY2sgaGVhZCwgb3IgYSBwbGFpbiBub3RlIHN0YXJ0aW5nXG4gKiAgICAgYSBicmFuZC1uZXcgZGVjayk6IGFwcGVuZCBgPGN1cnJlbnQ+LW5leHRgIGFzIHRoZSBuZXcgbGFzdCBzbGlkZTsgdGhlXG4gKiAgICAgY3VycmVudCBub3RlJ3MgYGRlY2tgIGdhaW5zIHRoZSBsaW5rIHRvIGl0LlxuICogICAtIFZhbGlkIG5leHQgbGluazogaW5zZXJ0IGA8Y3VycmVudD4tbmV4dGAgYmV0d2VlbiB0aGUgY3VycmVudCBub3RlIGFuZFxuICogICAgIGl0cyBuZXh0OyB0aGUgbmV3IG5vdGUgdGFrZXMgb3ZlciB0aGUgb2xkIG5leHQgbGluay5cbiAqICAgLSBCcm9rZW4gbmV4dCBsaW5rIChwbGFpbiwgbm9uLWV4aXN0aW5nIG5hbWUpOiBjcmVhdGUgZXhhY3RseSB0aGVcbiAqICAgICBkZWNsYXJlZCBtaXNzaW5nIG5vdGUgYXMgdGhlIG5ldyBuZXh0IHNsaWRlIFx1MjAxNCB0aGUgXHUyNkEwIHdhcm5pbmdcbiAqICAgICBkaXNhcHBlYXJzIGFuZCB0aGUgYXV0aG9yJ3MgaW50ZW50IGlzIGhvbm91cmVkLiBBIGJyb2tlbiBsaW5rIHRoYXQgaXNcbiAqICAgICBub3QgYSBwbGFpbiBiYXNlbmFtZSAocGF0aC1xdWFsaWZpZWQsIHNlbGYtcmVmZXJlbmNpbmcpIGlzIHRyZWF0ZWQgYXNcbiAqICAgICBpbnZhbGlkIGFuZCBkcm9wcGVkIChhcHBlbmQgYSBgPGN1cnJlbnQ+LW5leHRgIGxhc3Qgc2xpZGUgaW5zdGVhZCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuQ3JlYXRlTmV4dChpbnB1dDogQ3JlYXRlTmV4dElucHV0KTogQ3JlYXRlTmV4dFJlc3VsdCB8IG51bGwge1xuICBjb25zdCB7IGN1cnJlbnROYW1lLCBjdXJyZW50TGlua3MgfSA9IGlucHV0O1xuICBjb25zdCBuZXh0TGluayA9IGN1cnJlbnRMaW5rc1swXTtcblxuICBpZiAobmV4dExpbmspIHtcbiAgICBjb25zdCBuZXh0TmFtZSA9IGV4dHJhY3RMaW5rVGV4dChuZXh0TGluayk7XG4gICAgaWYgKG5leHROYW1lICYmIGlzUGxhaW5OYW1lKG5leHROYW1lKSAmJiBuZXh0TmFtZSAhPT0gY3VycmVudE5hbWUpIHtcbiAgICAgIGlmICghaW5wdXQuZXhpc3RpbmdOYW1lcy5oYXMobmV4dE5hbWUpKSB7XG4gICAgICAgIC8vIFRoZSBkZWNsYXJlZCBuZXh0IG5vdGUgZG9lcyBub3QgZXhpc3QgeWV0IFx1MjE5MiBjcmVhdGUgZXhhY3RseSB0aGF0XG4gICAgICAgIC8vIG5vdGUgKGZpeGVzIHRoZSBicm9rZW4tbGluayB3YXJuaW5nLCBob25vdXJzIHRoZSBhdXRob3IncyBpbnRlbnQpLlxuICAgICAgICByZXR1cm4geyBuZXdOYW1lOiBuZXh0TmFtZSwgbmV3RGVja0xpbmtzOiBbXSwgcmV3cml0ZXM6IFtdIH07XG4gICAgICB9XG4gICAgICAvLyBBIHZhbGlkIG5leHQgbm90ZSBleGlzdHMgXHUyMTkyIGluc2VydCBiZXR3ZWVuIGl0IGFuZCB0aGUgY3VycmVudCBub3RlLlxuICAgICAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ld05hbWUsXG4gICAgICAgIG5ld0RlY2tMaW5rczogW25leHRMaW5rXSxcbiAgICAgICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBJbnZhbGlkIChwYXRoLXF1YWxpZmllZCAvIHNlbGYtcmVmZXJlbmNpbmcpIG5leHQgbGluayBcdTIxOTIgZHJvcCBpdCBhbmRcbiAgICAvLyBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSAoZmFsbCB0aHJvdWdoIHRvIHRoZSBuby1uZXh0IGJyYW5jaCkuXG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTm8gKHVzYWJsZSkgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgcmV0dXJuIHtcbiAgICBuZXdOYW1lLFxuICAgIG5ld0RlY2tMaW5rczogW10sXG4gICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gIH07XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuXG4gKlxuICogVGhlIG5ldyBub3RlIHN0YXJ0cyBhcyBhIHNpbmdsZS1zbGlkZSBkZWNrIChgZGVjazogW11gKSBhbmQgbm90aGluZyBlbHNlXG4gKiBpcyB0b3VjaGVkIFx1MjAxNCB0aGUgbm90ZSBpdCB3YXMgbGF1bmNoZWQgZnJvbSBzdGF5cyBhcy1pcy4gTGF0ZXIgcGFnZXMgYXJlXG4gKiBhZGRlZCB3aXRoIENyZWF0ZSBOZXh0IFNsaWRlIGZyb20gaW5zaWRlIHRoZSBkZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5ldyhpbnB1dDogeyBleGlzdGluZ05hbWVzOiBTZXQ8c3RyaW5nPiB9KTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZTogdW5pcXVlTmFtZShcInVudGl0bGVkLXNsaWRlc1wiLCBpbnB1dC5leGlzdGluZ05hbWVzKSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbXSxcbiAgfTtcbn1cblxuLyoqIEEgbm90ZSBwcm9tb3RlZCBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFrZUZpcnN0U2xpZGVQbGFuIHtcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBmb3IgdGhlIG5vdGUncyBmcm9udG1hdHRlciAoYWx3YXlzIGVtcHR5IFx1MjAxNCBhIHNpbmdsZS1zbGlkZSBkZWNrKSAqL1xuICBkZWNrOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBQbGFuIGEgXCJNYWtlIHRoaXMgbm90ZSB0aGUgZmlyc3Qgc2xpZGVcIiBydW4gXHUyMDE0IHByb21vdGUgdGhlIGFjdGl2ZSBub3RlXG4gKiBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGl0cyBjb250ZW50LCB0aXRsZSBhbmQgbG9jYXRpb24gc3RheVxuICogdW50b3VjaGVkLCBhbmQgdGhlIGZyb250bWF0dGVyIGdhaW5zIGBkZWNrOiBbXWAgKGEgc2luZ2xlLXNsaWRlIGRlY2ssXG4gKiB0aGUgc3RhbmRhcmQgXCJsYXN0IHNsaWRlXCIgLyBzb2xvIG1hcmtlcikuIE5vIHJld3JpdGVzIGFueXdoZXJlIFx1MjAxNCBsYXRlclxuICogcGFnZXMgYXJlIGFkZGVkIHdpdGggQ3JlYXRlIE5leHQgU2xpZGUgZnJvbSBpbnNpZGUgdGhlIGRlY2suXG4gKlxuICogTm90ZXMgdGhhdCBhbHJlYWR5IGJlbG9uZyB0byBhIGRlY2sgKGhvbGQgYSBgZGVja2AgcHJvcGVydHksIG9yIGFyZVxuICogZGVjbGFyZWQgYXMgYW5vdGhlciBzbGlkZSdzIG5leHQpIGFyZSBOT1QgdG91Y2hlZDogdGhlIHBsYW4gaXMgbnVsbCBhbmRcbiAqIHRoZSBjb21tYW5kIG5vLW9wcyB3aXRoIGEgTm90aWNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbk1ha2VGaXJzdFNsaWRlKGlucHV0OiB7IGFscmVhZHlEZWNrOiBib29sZWFuIH0pOiBNYWtlRmlyc3RTbGlkZVBsYW4gfCBudWxsIHtcbiAgaWYgKGlucHV0LmFscmVhZHlEZWNrKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgZGVjazogW10gfTtcbn1cblxuLyoqIEEgbmFtZSB1c2FibGUgYXMgYSB2YXVsdCBub3RlIG5hbWU6IG5vIHBhdGggc2VwYXJhdG9ycywgbm9uLWVtcHR5ICovXG5mdW5jdGlvbiBpc1BsYWluTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiAhbmFtZS5pbmNsdWRlcyhcIi9cIikgJiYgIW5hbWUuaW5jbHVkZXMoXCJcXFxcXCIpO1xufVxuXG4vKiogRmlyc3QgZnJlZSBuYW1lIGluIHRoZSBmYW1pbHkgYGJhc2VgLCBgYmFzZS0yYCwgYGJhc2UtM2AsIFx1MjAyNiAqL1xuZnVuY3Rpb24gdW5pcXVlTmFtZShiYXNlOiBzdHJpbmcsIGV4aXN0aW5nOiBTZXQ8c3RyaW5nPik6IHN0cmluZyB7XG4gIGlmICghZXhpc3RpbmcuaGFzKGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YmFzZX0tJHtpfWA7XG4gICAgaWYgKCFleGlzdGluZy5oYXMoY2FuZGlkYXRlKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogZGVsZXRlU2xpZGVzLnRzIFx1MjAxNCBQdXJlIFwiRGVsZXRlIHNsaWRlc1wiIHBsYW5uaW5nIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdCBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHlcbiAqIChzZWUgdGVzdC9kZWxldGVTbGlkZXMudGVzdC50cykuIFRoZSBhZGFwdGVyIGluIGRlY2stc2VydmljZS50cyBhcHBsaWVzXG4gKiB0aGUgcGxhbjogaXQgcmV3cml0ZXMgdGhlIHN1cnZpdmluZyBub3RlcycgYGRlY2tgIHByb3BlcnRpZXMsIHRoZW4gbW92ZXNcbiAqIHRoZSBkZWxldGVkIG5vdGVzIHRvIHRoZSB0cmFzaC5cbiAqXG4gKiBEZWxldGlvbiBzcGxpY2VzIHRoZSBjaGFpbiBpbnN0ZWFkIG9mIGJyZWFraW5nIGl0OiBldmVyeSBtYXhpbWFsIHJ1biBvZlxuICogZGVsZXRlZCBzbGlkZXMgYmV0d2VlbiB0d28gc3Vydml2b3JzIEEgXHUyMTkyIFx1MjAyNiBcdTIxOTIgQiBpcyByZXBhaXJlZCBieSBwb2ludGluZ1xuICogQSdzIGBkZWNrYCBsaW5rIGF0IEIgKGBbXWAgd2hlbiB0aGUgcnVuIHJlYWNoZXMgdGhlIGVuZCBvZiB0aGUgY2hhaW4pLlxuICogV2hlbiBhIHJ1biBzdGFydHMgYXQgdGhlIGNoYWluIGhlYWQsIHRoZSBmaXJzdCBzdXJ2aXZvciBiZWNvbWVzIHRoZSBuZXdcbiAqIGhlYWQgYW5kIG5lZWRzIG5vIHJld3JpdGUgYXQgYWxsIChpdHMgb3duIGBkZWNrYCBhbHJlYWR5IHBvaW50cyBvbndhcmQpLlxuICovXG5cbi8qKiBPbmUgc3Vydml2aW5nIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVJld3JpdGUge1xuICAvKiogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdGhhdCBzaG91bGQgYmVjb21lIHRoaXMgbm90ZSdzIG5leHQgc2xpZGUsXG4gICAqIG9yIG51bGwgd2hlbiB0aGUgbm90ZSBiZWNvbWVzIHRoZSBuZXcgbGFzdCBzbGlkZSAoYGRlY2s6IFtdYCkuXG4gICAqL1xuICBuZXh0UGF0aDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBkZWxldGlvbiBvZiBzbGlkZXMgZnJvbSBhbiBvcmRlcmVkIGRlY2sgY2hhaW4uXG4gKlxuICogYGNoYWluYCBpcyB0aGUgZnVsbCBzbGlkZSBvcmRlciAoWzBdID0gaGVhZCkuIE9ubHkgcGF0aHMgcHJlc2VudCBpbiB0aGVcbiAqIGNoYWluIGFyZSBjb25zaWRlcmVkOyBhbnl0aGluZyBlbHNlIGluIGBkZWxldGVQYXRoc2AgaXMgaWdub3JlZC4gUmV0dXJuc1xuICogb25lIHJld3JpdGUgcGVyIHN1cnZpdmluZyBub3RlIHRoYXQgZGlyZWN0bHkgcHJlY2VkZWQgYSBkZWxldGVkIHJ1bixcbiAqIG9yZGVyZWQgYnkgY2hhaW4gcG9zaXRpb24uIERlbGV0aW5nIG5vdGhpbmcgeWllbGRzIG5vIHJld3JpdGVzOyBkZWxldGluZ1xuICogZXZlcnl0aGluZyB5aWVsZHMgbm8gcmV3cml0ZXMgZWl0aGVyIChubyBzdXJ2aXZvcnMgbGVmdCB0byByZXBhaXIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkRlbGV0ZVNsaWRlcyhcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbik6IERlbGV0ZVJld3JpdGVbXSB7XG4gIGNvbnN0IHJld3JpdGVzOiBEZWxldGVSZXdyaXRlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhdGggPSBjaGFpbltpXTtcbiAgICBpZiAoIXBhdGggfHwgZGVsZXRlUGF0aHMuaGFzKHBhdGgpKSBjb250aW51ZTtcbiAgICAvLyBGaW5kIHRoZSBmaXJzdCBzdXJ2aXZvciBhZnRlciB0aGlzIG5vdGUncyBwb3NpdGlvbi5cbiAgICBsZXQgaiA9IGkgKyAxO1xuICAgIHdoaWxlIChqIDwgY2hhaW4ubGVuZ3RoICYmIGRlbGV0ZVBhdGhzLmhhcyhjaGFpbltqXSkpIGorKztcbiAgICBjb25zdCBuZXh0UGF0aCA9IGogPCBjaGFpbi5sZW5ndGggPyBjaGFpbltqXSA6IG51bGw7XG4gICAgY29uc3QgY2hhbmdlZCA9IG5leHRQYXRoICE9PSAoY2hhaW5baSArIDFdID8/IG51bGwpO1xuICAgIGlmIChjaGFuZ2VkKSByZXdyaXRlcy5wdXNoKHsgcGF0aCwgbmV4dFBhdGggfSk7XG4gIH1cbiAgcmV0dXJuIHJld3JpdGVzO1xufVxuXG4vKipcbiAqIFBpY2sgd2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlciBkZWxldGluZyBzbGlkZXM6IHRoZSBuZWFyZXN0XG4gKiBzdXJ2aXZvciBvZiBgZGVsZXRlZFBhdGhzYCcgbmVpZ2hib3VyaG9vZCBhcm91bmQgYGZvY3VzUGF0aGAgXHUyMDE0IHByZWZlclxuICogdGhlIGNsb3Nlc3Qgc3Vydml2b3IgYWZ0ZXIgaXQsIGVsc2UgdGhlIGNsb3Nlc3QgYmVmb3JlIGl0LiBSZXR1cm5zIG51bGxcbiAqIHdoZW4gYGZvY3VzUGF0aGAgc3Vydml2ZXMgb3Igbm90aGluZyBuZWFyYnkgcmVtYWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tMYW5kaW5nUGF0aChcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghZm9jdXNQYXRoIHx8ICFkZWxldGVQYXRocy5oYXMoZm9jdXNQYXRoKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihmb2N1c1BhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgZm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgZm9yIChsZXQgaSA9IGluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoIWRlbGV0ZVBhdGhzLmhhcyhjaGFpbltpXSkpIHJldHVybiBjaGFpbltpXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgTWVudSwgVEZpbGUsIFdvcmtzcGFjZUxlYWYgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgQ29uZmlybURlbGV0ZU1vZGFsIH0gZnJvbSBcIi4vY29uZmlybS1kZWxldGVcIjtcblxuLyoqIFZpZXcgdHlwZSBpZCBvZiB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwgKi9cbmV4cG9ydCBjb25zdCBTTElERVNfUEFORUxfVklFVyA9IFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiO1xuXG4vKipcbiAqIFNpZGViYXIgcGFuZWwgbGlzdGluZyBldmVyeSBzbGlkZSBvZiB0aGUgYWN0aXZlIG5vdGUncyBkZWNrIChuZXh0LW9ubHlcbiAqIGNoYWluIG9yZGVyKS4gVGFrZXMgb3ZlciB0aGUgYWdncmVnYXRpb24vZW50cnkgcm9sZSB0aGUgb3ZlcnZpZXcgcGFnZVxuICogdXNlZCB0byBwbGF5IGJlZm9yZSB2MS4wLjAuXG4gKlxuICogSW50ZXJhY3Rpb246XG4gKiAgIC0gY2xpY2sgICAgICAgICAgICBcdTIxOTIgb3BlbiB0aGF0IHNsaWRlIChhbmQgY2xlYXIgYW55IHNlbGVjdGlvbilcbiAqICAgLSBNb2QrY2xpY2sgICAgICAgIFx1MjE5MiB0b2dnbGUgdGhlIGl0ZW0gaW4gdGhlIHNlbGVjdGlvblxuICogICAtIFNoaWZ0K2NsaWNrICAgICAgXHUyMTkyIGV4dGVuZCB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIGxhc3QgYW5jaG9yXG4gKiAgIC0gcmlnaHQtY2xpY2sgICAgICBcdTIxOTIgY29udGV4dCBtZW51OiBDcmVhdGUgbmV4dCBzbGlkZSAvIERlbGV0ZSBzbGlkZShzKVxuICovXG5leHBvcnQgY2xhc3MgU2xpZGVzUGFuZWxWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICAvKiogQ2hhaW4gc2lnbmF0dXJlIG9mIHRoZSBjdXJyZW50bHkgcmVuZGVyZWQgbGlzdCAqL1xuICBwcml2YXRlIGxhc3RDaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgLyoqIFJlbmRlcmVkIGl0ZW0gZWxlbWVudHMsIGluZGV4LWFsaWduZWQgd2l0aCBsYXN0Q2hhaW4gKi9cbiAgcHJpdmF0ZSBpdGVtczogeyBwYXRoOiBzdHJpbmc7IGVsOiBIVE1MRWxlbWVudCB9W10gPSBbXTtcbiAgLyoqIEN1cnJlbnRseSBzZWxlY3RlZCBzbGlkZSBwYXRocyAobXVsdGktc2VsZWN0IGZvciBEZWxldGUpICovXG4gIHByaXZhdGUgc2VsZWN0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLyoqIFNlbGVjdGlvbiBhbmNob3IgZm9yIFNoaWZ0K2NsaWNrIHJhbmdlIGV4dGVuc2lvbiAqL1xuICBwcml2YXRlIGFuY2hvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbixcbiAgICBsZWFmOiBXb3Jrc3BhY2VMZWFmLFxuICApIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFNMSURFU19QQU5FTF9WSUVXO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJTbGlkZXNcIjtcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJwcmVzZW50YXRpb25cIjtcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuICAgIHRoaXMubGFzdENoYWluID0gW107XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICB0aGlzLmFuY2hvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU3luYyB0aGUgbGlzdCB3aXRoIHRoZSBhY3RpdmUgbm90ZSdzIGRlY2suIEluY3JlbWVudGFsIG9uIHB1cnBvc2U6IHRoZVxuICAgKiByZWZyZXNoIGV2ZW50cyBhbHNvIGZpcmUgd2hpbGUgYSBjbGljayBvbiBhbiBlbnRyeSBpcyBpbiBmbGlnaHQgKHRoZVxuICAgKiBtb3VzZWRvd24gYWN0aXZhdGVzIHRoaXMgbGVhZiksIGFuZCByZWJ1aWxkaW5nIHRoZSBET00gbWlkLWdlc3R1cmVcbiAgICogZGVzdHJveXMgdGhlIGNsaWNrIHRhcmdldCBcdTIwMTQgd2hpY2ggbWFkZSBvcGVuaW5nIGEgc2xpZGUgdGFrZSB0d28gY2xpY2tzXG4gICAqIHdoZW5ldmVyIHRoZSBwYW5lbCB3YXMgbm90IHRoZSBhY3RpdmUgbGVhZi4gVW5jaGFuZ2VkIGNoYWlucyBvbmx5IGdldFxuICAgKiB0aGVpciBoaWdobGlnaHQgdXBkYXRlZCwgc28gaXRlbSBlbGVtZW50cyBhbHdheXMgc3Vydml2ZS5cbiAgICovXG4gIHByaXZhdGUgcmVuZGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IGRlY2sgPSBmaWxlID8gdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKSA6IG51bGw7XG4gICAgY29uc3QgY2hhaW4gPSBkZWNrXG4gICAgICA/IGRlY2suY2hhaW4uZmlsdGVyKChwKSA9PiB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocCkgaW5zdGFuY2VvZiBURmlsZSlcbiAgICAgIDogW107XG5cbiAgICAvLyBEcm9wIHNlbGVjdGlvbnMgd2hvc2Ugbm90ZSB2YW5pc2hlZCBmcm9tIHRoZSBjaGFpbiBtZWFud2hpbGVcbiAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplID4gMCkge1xuICAgICAgY29uc3QgbGl2ZSA9IG5ldyBTZXQoY2hhaW4pO1xuICAgICAgZm9yIChjb25zdCBwYXRoIG9mIHRoaXMuc2VsZWN0ZWQpIGlmICghbGl2ZS5oYXMocGF0aCkpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIH1cbiAgICAvLyBBIGRlYWQgYW5jaG9yIG11c3Qgbm90IHNpbGVudGx5IHR1cm4gYSBTaGlmdCtjbGljayBpbnRvIGEgdG9nZ2xlXG4gICAgaWYgKHRoaXMuYW5jaG9yICE9PSBudWxsICYmICFjaGFpbi5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmICghY2hhaW5FcXVhbHModGhpcy5sYXN0Q2hhaW4sIGNoYWluKSkge1xuICAgICAgdGhpcy5yZWJ1aWxkKGNoYWluKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIsIGl0LnBhdGggPT09IGZpbGU/LnBhdGgpO1xuICAgIH1cbiAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogRnVsbCByZWJ1aWxkIChjaGFpbiBzaGFwZSBjaGFuZ2VkKSAqL1xuICBwcml2YXRlIHJlYnVpbGQoY2hhaW46IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGFpbmVyRWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IGNoYWluO1xuXG4gICAgaWYgKGNoYWluLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWVtcHR5XCIgfSk7XG4gICAgICBlbXB0eS5zZXRUZXh0KFxuICAgICAgICBcIk5vIHNsaWRlcyBkZWNrIFx1MjAxNCBvcGVuIGEgZGVjayBub3RlLCBvciBydW4gY3JlYXRlIG5leHQgc2xpZGUgb24gYW55IG5vdGUgdG8gc3RhcnQgb25lLlwiLFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aDtcbiAgICBjaGFpbi5mb3JFYWNoKChwYXRoLCBpKSA9PiB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuO1xuICAgICAgY29uc3QgaXRlbSA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtaXRlbVwiIH0pO1xuICAgICAgaWYgKHBhdGggPT09IGFjdGl2ZVBhdGgpIGl0ZW0uYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1udW1cIiB9KS5zZXRUZXh0KFN0cmluZyhpICsgMSkpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtdGl0bGVcIiB9KS5zZXRUZXh0KGYuYmFzZW5hbWUpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHRoaXMub25JdGVtQ2xpY2soZSwgaSwgZikpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShlLCBmKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pdGVtcy5wdXNoKHsgcGF0aCwgZWw6IGl0ZW0gfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xpY2sgcm91dGluZzogcGxhaW4gPSBvcGVuLCBNb2QgPSB0b2dnbGUgc2VsZWN0LCBTaGlmdCA9IHJhbmdlIHNlbGVjdCAqL1xuICBwcml2YXRlIG9uSXRlbUNsaWNrKGU6IE1vdXNlRXZlbnQsIGluZGV4OiBudW1iZXIsIGY6IFRGaWxlKTogdm9pZCB7XG4gICAgaWYgKGUuc2hpZnRLZXkgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgLy8gUmFuZ2UgYW5jaG9yOiB0aGUgbGFzdCBzZWxlY3RlZCBpdGVtLCBvciB0aGUgZGlzcGxheWVkIHNsaWRlXG4gICAgICAgIC8vIHdoZW4gbm8gdXNhYmxlIGFuY2hvciBleGlzdHMgKGZpcnN0IFNoaWZ0K2NsaWNrIGluIGEgc2Vzc2lvbikuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IG51bGw7XG4gICAgICAgIGNvbnN0IGFuY2hvclBhdGggPVxuICAgICAgICAgIHRoaXMuYW5jaG9yICE9PSBudWxsICYmIHRoaXMuaXRlbXMuc29tZSgoaXQpID0+IGl0LnBhdGggPT09IHRoaXMuYW5jaG9yKVxuICAgICAgICAgICAgPyB0aGlzLmFuY2hvclxuICAgICAgICAgICAgOiBhY3RpdmVQYXRoO1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGl0KSA9PiBpdC5wYXRoID09PSBhbmNob3JQYXRoKTtcbiAgICAgICAgaWYgKGFuY2hvclBhdGggIT09IG51bGwgJiYgZnJvbSAhPT0gLTEpIHtcbiAgICAgICAgICBjb25zdCBbbG8sIGhpXSA9IGZyb20gPCBpbmRleCA/IFtmcm9tLCBpbmRleF0gOiBbaW5kZXgsIGZyb21dO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBsbzsgaSA8PSBoaTsgaSsrKSB0aGlzLnNlbGVjdGVkLmFkZCh0aGlzLml0ZW1zW2ldLnBhdGgpO1xuICAgICAgICAgIC8vIFRoZSBkaXNwbGF5ZWQgc2xpZGUgam9pbnMgZXZlcnkgU2hpZnQgc2VsZWN0aW9uIFx1MjAxNCBleHRlbmRpbmcgYVxuICAgICAgICAgIC8vIHNlbGVjdGlvbiBuZXZlciBzaWxlbnRseSBkcm9wcyB0aGUgcGFnZSB5b3UgYXJlIGxvb2tpbmcgYXQuXG4gICAgICAgICAgaWYgKGFjdGl2ZVBhdGggIT09IG51bGwgJiYgdGhpcy5pdGVtcy5zb21lKChpdCkgPT4gaXQucGF0aCA9PT0gYWN0aXZlUGF0aCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkKGFjdGl2ZVBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmFuY2hvciA9IHRoaXMuaXRlbXNbaW5kZXhdLnBhdGg7XG4gICAgICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTW9kIChvciBTaGlmdCB3aXRoIG5vIHJlYWNoYWJsZSBhbmNob3IpOiBwdXJlIHRvZ2dsZSBcdTIwMTQgdGhlIG9ubHkgd2F5XG4gICAgICAvLyB0byBjYW5jZWwgYW4gaXRlbSBvdXQgb2YgdGhlIHNlbGVjdGlvbi5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkLmhhcyhmLnBhdGgpKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShmLnBhdGgpO1xuICAgICAgZWxzZSB0aGlzLnNlbGVjdGVkLmFkZChmLnBhdGgpO1xuICAgICAgdGhpcy5hbmNob3IgPSBmLnBhdGg7XG4gICAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAvLyBObyBzZWxlY3Rpb24gYWZ0ZXIgYSBwbGFpbiBjbGljaywgYnV0IHRoZSBjbGlja2VkIHNsaWRlIHN0YXlzIHRoZVxuICAgIC8vIFNoaWZ0K2NsaWNrIGFuY2hvciBcdTIwMTQgbWF0Y2hpbmcgdGhlIGZpbGUtZXhwbG9yZXIgZmVlbDogcGljayBhIHNsaWRlLFxuICAgIC8vIHRoZW4gU2hpZnQrY2xpY2sgYSBsYXRlciBvbmUgdG8gc2VsZWN0IHRoZSB3aG9sZSByYW5nZSBiZXR3ZWVuIHRoZW0uXG4gICAgdGhpcy5hbmNob3IgPSBmLnBhdGg7XG4gICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgIHZvaWQgdGhpcy5vcGVuU2xpZGUoZik7XG4gIH1cblxuICAvKiogUmVmbGVjdCB0aGUgc2VsZWN0aW9uIHNldCBvbiB0aGUgcmVuZGVyZWQgaXRlbXMgd2l0aG91dCBhIHJlYnVpbGQgKi9cbiAgcHJpdmF0ZSBzeW5jU2VsZWN0aW9uQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMuaXRlbXMpIGl0LmVsLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1zZWxlY3RlZFwiLCB0aGlzLnNlbGVjdGVkLmhhcyhpdC5wYXRoKSk7XG4gIH1cblxuICAvKiogUmlnaHQtY2xpY2sgbWVudSBvbiBvbmUgaXRlbTsgb3BlcmF0ZXMgb24gdGhlIHdob2xlIHNlbGVjdGlvbiB3aGVuIGl0IGJlbG9uZ3MgdG8gb25lICovXG4gIHByaXZhdGUgb3BlbkNvbnRleHRNZW51KGU6IE1vdXNlRXZlbnQsIGY6IFRGaWxlKTogdm9pZCB7XG4gICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShcIkNyZWF0ZSBuZXh0IHNsaWRlXCIpXG4gICAgICAgIC5zZXRJY29uKFwicGx1c1wiKVxuICAgICAgICAub25DbGljaygoKSA9PiB2b2lkIHRoaXMuY3JlYXRlTmV4dEFmdGVyKGYpKSxcbiAgICApO1xuICAgIGNvbnN0IHRhcmdldHMgPSB0aGlzLnNlbGVjdGVkLmhhcyhmLnBhdGgpID8gWy4uLnRoaXMuc2VsZWN0ZWRdIDogW2YucGF0aF07XG4gICAgY29uc3Qgb3JkZXJlZCA9IHRoaXMubGFzdENoYWluLmZpbHRlcigocCkgPT4gdGFyZ2V0cy5pbmNsdWRlcyhwKSk7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShvcmRlcmVkLmxlbmd0aCA+IDEgPyBgRGVsZXRlICR7b3JkZXJlZC5sZW5ndGh9IHNsaWRlc2AgOiBcIkRlbGV0ZSBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInRyYXNoXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMuZGVsZXRlU2xpZGVzKG9yZGVyZWQpKSxcbiAgICApO1xuICAgIG1lbnUuc2hvd0F0TW91c2VFdmVudChlKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgYSBzbGlkZSBhZnRlciB0aGUgcmlnaHQtY2xpY2tlZCBvbmUgKHdpdGhvdXQgb3BlbmluZyBpdCkgKi9cbiAgcHJpdmF0ZSBhc3luYyBjcmVhdGVOZXh0QWZ0ZXIoZjogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwbGFuID0gdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5leHQoZik7XG4gICAgaWYgKCFwbGFuKSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZiwgcGxhbiwgZmFsc2UpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKiogQ29uZmlybSwgdGhlbiB0cmFzaCB0aGUgZ2l2ZW4gc2xpZGVzIGFuZCBzcGxpY2UgdGhlbSBvdXQgb2YgdGhlIGNoYWluICovXG4gIHByaXZhdGUgZGVsZXRlU2xpZGVzKHBhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBydW4gPSAoKTogdm9pZCA9PiB2b2lkIHRoaXMucnVuRGVsZXRpb24ocGF0aHMpO1xuXG4gICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzKSB7XG4gICAgICBydW4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmFtZXMgPSBwYXRocy5tYXAoKHApID0+IHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocCk7XG4gICAgICByZXR1cm4gZiBpbnN0YW5jZW9mIFRGaWxlID8gZi5iYXNlbmFtZSA6IHA7XG4gICAgfSk7XG4gICAgbmV3IENvbmZpcm1EZWxldGVNb2RhbCh0aGlzLmFwcCwgbmFtZXMsIHJ1biwgYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcyA9IGZhbHNlO1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBydW5EZWxldGlvbihwYXRoczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBudWxsO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVEZWxldGVTbGlkZXMoXG4gICAgICB0aGlzLmxhc3RDaGFpbixcbiAgICAgIG5ldyBTZXQocGF0aHMpLFxuICAgICAgYWN0aXZlUGF0aCxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCBwYXRoIG9mIHBhdGhzKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShwYXRoKTtcbiAgICBpZiAodGhpcy5hbmNob3IgIT09IG51bGwgJiYgcGF0aHMuaW5jbHVkZXModGhpcy5hbmNob3IpKSB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAocmVzdWx0LmxhbmRpbmdQYXRoKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJlc3VsdC5sYW5kaW5nUGF0aCk7XG4gICAgICBpZiAoZiBpbnN0YW5jZW9mIFRGaWxlKSBhd2FpdCB0aGlzLm9wZW5TbGlkZShmKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBPcGVuIGEgc2xpZGUgaW4gYSBtYXJrZG93biBsZWFmIChuZXZlciBpbiB0aGlzIHBhbmVsJ3Mgb3duIGxlYWYpICovXG4gIHByaXZhdGUgYXN5bmMgb3BlblNsaWRlKGY6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbGVhZiA9XG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFwibWFya2Rvd25cIilbMF0gPz8gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYodHJ1ZSk7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmKTtcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmLCB7IGZvY3VzOiB0cnVlIH0pO1xuICB9XG59XG5cbi8qKiBPcmRlci1zZW5zaXRpdmUgY2hhaW4gY29tcGFyaXNvbiAqL1xuZnVuY3Rpb24gY2hhaW5FcXVhbHMoYTogc3RyaW5nW10sIGI6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIHJldHVybiBhLmxlbmd0aCA9PT0gYi5sZW5ndGggJiYgYS5ldmVyeSgocCwgaSkgPT4gcCA9PT0gYltpXSk7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTWF4IG5hbWVzIHNob3duIGluIHRoZSBkaWFsb2cgYmVmb3JlIGNvbGxhcHNpbmcgaW50byBhIFwiK04gbW9yZVwiIGxpbmUgKi9cbmNvbnN0IE1BWF9WSVNJQkxFX05BTUVTID0gODtcblxuLyoqXG4gKiBDb25maXJtYXRpb24gZGlhbG9nIGZvciBEZWxldGUgc2xpZGVzLiBMaXN0cyB0aGUgbm90ZXMgYWJvdXQgdG8gYmVcbiAqIHRyYXNoZWQgKG51bWJlcmVkIGxpa2UgdGhlIHBhbmVsLCBzbyB0aGUgdXNlciBjYW4gbWFwIHRoZW0gMToxKSwgb2ZmZXJzXG4gKiBhIFwiZG9uJ3QgYXNrIGFnYWluXCIgdG9nZ2xlIHRoYXQgZmxpcHMgdGhlIGBjb25maXJtRGVsZXRlU2xpZGVzYCBzZXR0aW5nXG4gKiBvZmYgKHBlcnNpc3RlZCBieSB0aGUgY2FsbGVyIHZpYSBvbkRvbnRBc2spLCBhbmQgYXNrcyBmb3IgYW4gZXhwbGljaXRcbiAqIENhbmNlbCAvIERlbGV0ZSBkZWNpc2lvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpcm1EZWxldGVNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSBjb25maXJtZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBwcml2YXRlIG5hbWVzOiBzdHJpbmdbXSxcbiAgICBwcml2YXRlIG9uQ29uZmlybTogKCkgPT4gdm9pZCxcbiAgICBwcml2YXRlIG9uRG9udEFzazogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgfVxuXG4gIG9uT3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIHRoaXMubW9kYWxFbC5hZGRDbGFzcyhcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGVcIik7XG5cbiAgICBjb25zdCBjb3VudCA9IHRoaXMubmFtZXMubGVuZ3RoO1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtdGl0bGVcIixcbiAgICAgIHRleHQ6IGNvdW50ID09PSAxID8gXCJEZWxldGUgdGhpcyBzbGlkZT9cIiA6IGBEZWxldGUgJHtjb3VudH0gc2xpZGVzP2AsXG4gICAgfSk7XG4gICAgdGhpcy5jb250ZW50RWxcbiAgICAgIC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1zdWJcIiB9KVxuICAgICAgLnNldFRleHQoXG4gICAgICAgIGNvdW50ID09PSAxXG4gICAgICAgICAgPyBcIlRoZSBub3RlIHdpbGwgYmUgbW92ZWQgdG8gdGhlIHRyYXNoLlwiXG4gICAgICAgICAgOiBcIlRoZXNlIG5vdGVzIHdpbGwgYmUgbW92ZWQgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgKTtcblxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1saXN0XCIgfSk7XG4gICAgZm9yIChjb25zdCBbaSwgbmFtZV0gb2YgdGhpcy5uYW1lcy5zbGljZSgwLCBNQVhfVklTSUJMRV9OQU1FUykuZW50cmllcygpKSB7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1udW1cIiB9KS5zZXRUZXh0KFN0cmluZyhpICsgMSkpO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1uYW1lXCIgfSkuc2V0VGV4dChuYW1lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXMubGVuZ3RoID4gTUFYX1ZJU0lCTEVfTkFNRVMpIHtcbiAgICAgIGxpc3RcbiAgICAgICAgLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW1vcmVcIiB9KVxuICAgICAgICAuc2V0VGV4dChgXHUyMDI2IGFuZCAke3RoaXMubmFtZXMubGVuZ3RoIC0gTUFYX1ZJU0lCTEVfTkFNRVN9IG1vcmVgKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkRG9udEFza1JvdygpO1xuICAgIHRoaXMuYnVpbGRBY3Rpb25zKCk7XG4gIH1cblxuICAvKiogQ29tcGFjdCBsZWZ0LWFsaWduZWQgXCJkb24ndCBhc2sgYWdhaW5cIiBjaGVja2JveCByb3cgKi9cbiAgcHJpdmF0ZSBidWlsZERvbnRBc2tSb3coKTogdm9pZCB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtZG9udGFza1wiIH0pO1xuICAgIHJvdy5jcmVhdGVFbChcImxhYmVsXCIpLnNldFRleHQoXCJEb24ndCBhc2sgYWdhaW5cIik7XG4gICAgY29uc3QgY2hlY2tib3ggPSByb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IHR5cGU6IFwiY2hlY2tib3hcIiB9KTtcbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5vbkRvbnRBc2soKS50aGVuKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgY2hlY2tib3guZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgLy8ga2VlcCB0aGUgY2hlY2tib3ggZW5hYmxlZCBpZiBwZXJzaXN0aW5nIHRoZSBwcmVmZXJlbmNlIGZhaWxlZFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSaWdodC1hbGlnbmVkIENhbmNlbCAvIERlbGV0ZSBidXR0b24gcm93ICovXG4gIHByaXZhdGUgYnVpbGRBY3Rpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1hY3Rpb25zXCIgfSk7XG4gICAgYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsXCIgfSkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuY2xvc2UoKSk7XG4gICAgYWN0aW9uc1xuICAgICAgLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJEZWxldGVcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSlcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb25maXJtZWQpIHRoaXMub25Db25maXJtKCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCB0eXBlIFNldHRpbmdEZWZpbml0aW9uSXRlbSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBTTElERVNfVEhFTUVTIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBTZXR0aW5ncyB0YWI6IHRvZ2dsZXMgdGhlIG5hdiBidXR0b25zLCBwYWdlIG51bWJlciwgYXV0by1lbnRlciBhbmQgYmFyXG4gKiB2aXNpYmlsaXR5LiBEZWNsYXJhdGl2ZSBkZWZpbml0aW9ucyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCwgc2VhcmNoYWJsZSBpbiB0aGVcbiAqIHNldHRpbmdzIG1vZGFsKSB3aXRoIGFuIGltcGVyYXRpdmUgYGRpc3BsYXkoKWAgZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zLlxuICovXG5leHBvcnQgY2xhc3MgTmF0aXZlU2xpZGVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKSB7XG4gICAgc3VwZXIocGx1Z2luLmFwcCwgcGx1Z2luKTtcbiAgfVxuXG4gIC8qKiBEZWNsYXJhdGl2ZSBzZXR0aW5ncyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCkgXHUyMDE0IHNlYXJjaGFibGUgYnkgdGhlIHNldHRpbmdzIG1vZGFsLiAqL1xuICBnZXRTZXR0aW5nRGVmaW5pdGlvbnMoKTogU2V0dGluZ0RlZmluaXRpb25JdGVtW10ge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU3R5bGUgdGVtcGxhdGVcIixcbiAgICAgICAgZGVzYzogXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgc2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICBrZXk6IFwic2xpZGVzVGhlbWVcIixcbiAgICAgICAgICB0eXBlOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgb3B0aW9uczogT2JqZWN0LmZyb21FbnRyaWVzKFNMSURFU19USEVNRVMubWFwKCh0KSA9PiBbdC5pZCwgdC5sYWJlbF0pKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ2VudGVyIGltYWdlc1wiLFxuICAgICAgICBkZXNjOiBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImltYWdlTGF5b3V0XCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgYmFyXCIsXG4gICAgICAgIGRlc2M6IFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93U2xpZGVzQmFyXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcmV2aW91cy9uZXh0IGJ1dHRvbnNcIixcbiAgICAgICAgZGVzYzogXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dOYXZCdXR0b25zXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiUGFnZSBudW1iZXIgc3R5bGVcIixcbiAgICAgICAgZGVzYzogJ1Nob3duIGF0IHRoZSBib3R0b20tcmlnaHQuIFwibiAvIHRvdGFsXCI6IDEtYmFzZWQgb3ZlciB0aGUgd2hvbGUgZGVjayBjaGFpbiAoaGVhZCBzbGlkZSA9IDEpLiBcIm5cIjoganVzdCB0aGUgY3VycmVudCBwYWdlIG51bWJlci4gXCJub25lXCI6IGhpZGRlbi4nLFxuICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAga2V5OiBcInBhZ2VOdW1iZXJTdHlsZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZHJvcGRvd25cIixcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBmcmFjdGlvbjogXCJOIC8gVG90YWxcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IFwiTlwiLFxuICAgICAgICAgICAgbm9uZTogXCJOb25lXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcm9ncmVzcyBiYXJcIixcbiAgICAgICAgZGVzYzogXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dQcm9ncmVzc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIixcbiAgICAgICAgZGVzYzogXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiYXV0b0VudGVyU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIsXG4gICAgICAgIGRlc2M6IFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiZXNjRXhpdHNTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTbGlkZXMgdGl0bGVcIixcbiAgICAgICAgZGVzYzogXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUgXHUyMDE0IHRoYXQgdGl0bGUgaXMgZWRpdGFibGUgKHJlbmFtZXMgdGhlIG5vdGUpOyBwcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIGFyZSByZWFkLW9ubHkgKGVkaXQgdGhlIHByb3BlcnR5IG91dHNpZGUgc2xpZGVzIG1vZGUpLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzbGlkZXNUaXRsZVwiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiRS5nLiBUaXRsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkJhciBwcm9wZXJ0aWVzXCIsXG4gICAgICAgIGRlc2M6IFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJiYXJQcm9wZXJ0aWVzXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJDb25maXJtIHNsaWRlIGRlbGV0aW9uXCIsXG4gICAgICAgIGRlc2M6IFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJjb25maXJtRGVsZXRlU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiTmF2aWdhdGlvbiBob3RrZXlzXCIsXG4gICAgICAgIGRlc2M6IFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgLyoqIFBlcnNpc3QgY29udHJvbCBjaGFuZ2VzLCB0aGVuIHJlZnJlc2ggdGhlIGJhciBzbyB0aGUgbmV3IHNldHRpbmcgYXBwbGllcy4gKi9cbiAgc2V0Q29udHJvbFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQge1xuICAgIHZvaWQgdGhpcy5hcHBseUNvbnRyb2xWYWx1ZShrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYXBwbHlDb250cm9sVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgKHRoaXMucGx1Z2luLnNldHRpbmdzIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW2tleV0gPSB2YWx1ZTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cblxuICAvKiogSW1wZXJhdGl2ZSBmYWxsYmFjayBmb3IgT2JzaWRpYW4gPCAxLjEzLjAgKG5vdCBjYWxsZWQgd2l0aCBkZWZpbml0aW9ucyBwcmVzZW50KS4gKi9cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3R5bGUgdGVtcGxhdGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkJ1aWx0LWluIGxvb2sgZm9yIHRoZSBzbGlkZXMgY2FyZCBhbmQgc2xpZGVzIGJhciAoYm9yZGVyLCBiYWNrZ3JvdW5kLCBzaGFkb3csIGJhciBzdHlsaW5nKS4gRXZlcnkgdGVtcGxhdGUgYWRhcHRzIHRvIGxpZ2h0IGFuZCBkYXJrIHRoZW1lcy5cIixcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIFNMSURFU19USEVNRVMpIGRyb3Bkb3duLmFkZE9wdGlvbih0LmlkLCB0LmxhYmVsKTtcbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGhlbWUpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNlbnRlciBpbWFnZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbWFnZUxheW91dCkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW1hZ2VMYXlvdXQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHNsaWRlcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0Jhcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0JhciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJldmlvdXMvbmV4dCBidXR0b25zXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQYWdlIG51bWJlciBzdHlsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIm4gLyB0b3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJuXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwibm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbnMoe1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPSB2YWx1ZSBhcyBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJvZ3Jlc3MgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFc2NhcGUgZXhpdHMgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2xpZGVzIHRpdGxlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkUuZy4gVGl0bGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJCYXIgcHJvcGVydGllc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29uZmlybSBzbGlkZSBkZWxldGlvblwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTmF2aWdhdGlvbiBob3RrZXlzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEZWZhdWx0OiBQcmV2aW91cyBwYWdlIG1vZCtzaGlmdCtcdTIxOTAsIG5leHQgcGFnZSBtb2Qrc2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgc2V0dGluZ3MgXHUyMTkyIGhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+XG4gICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiT3BlbiBob3RrZXlzIHNldHRpbmdzXCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgfVxufVxuIiwgIi8qKiBSZW1vdmUgYWxsIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNoaWxkcmVuKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQkEsSUFBQUEsbUJBQTRDOzs7QUN6QnJDLFNBQVMsWUFBeUI7QUFDdkMsUUFBTSxNQUFNLFVBQVUsRUFBRSxLQUFLLG9CQUFvQixDQUFDO0FBQ2xELE1BQUksYUFBYSxFQUFFLFNBQVMsT0FBTyxDQUFDO0FBQ3BDLE1BQUksUUFBUTtBQUlaLE1BQUksaUJBQWlCLGFBQWEsQ0FBQyxNQUFNO0FBQ3ZDLE1BQUUsZUFBZTtBQUNqQixVQUFNLFNBQVMsU0FBUztBQUN4QixRQUFJLGtCQUFrQixlQUFlLFdBQVcsU0FBUyxLQUFNLFFBQU8sS0FBSztBQUFBLEVBQzdFLENBQUM7QUFDRCxTQUFPO0FBQ1Q7QUFHTyxTQUFTLFVBQ2QsT0FDQSxLQUNBLFNBQ0EsV0FBVyxPQUNRO0FBQ25CLFFBQU0sTUFBTSxTQUFTLFVBQVU7QUFBQSxJQUM3QixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixNQUFNLEVBQUUsT0FBTyxJQUFJO0FBQUEsRUFDckIsQ0FBQztBQUNELE1BQUksV0FBVztBQUNmLE1BQUksQ0FBQyxTQUFVLEtBQUksaUJBQWlCLFNBQVMsT0FBTztBQUNwRCxTQUFPO0FBQ1Q7QUFRTyxTQUFTLGlCQUFpQixRQUF3QjtBQUN2RCxRQUFNLFNBQVMsU0FBUztBQUFBLElBQ3RCO0FBQUEsRUFDRjtBQUNBLE1BQUksVUFBVSxPQUFPLGVBQWUsRUFBRyxVQUFTLE9BQU87QUFDdkQsTUFBSSxTQUFTLEdBQUc7QUFDZCxhQUFTLGdCQUFnQixZQUFZLEVBQUUsaUNBQWlDLEdBQUcsTUFBTSxLQUFLLENBQUM7QUFBQSxFQUN6RixPQUFPO0FBRUwsYUFBUyxnQkFBZ0IsTUFBTSxlQUFlLCtCQUErQjtBQUFBLEVBQy9FO0FBQ0EsU0FBTztBQUNUOzs7QUNuREEsc0JBQTBDOzs7QUN3RG5DLFNBQVMsZ0JBQWdCLEdBQWlDO0FBQy9ELFFBQU0sSUFBSSxFQUFFLEtBQUs7QUFDakIsUUFBTSxRQUFRLENBQUMsTUFBc0IsS0FBSyxJQUFJLEdBQUcsS0FBSyxNQUFNLENBQUMsQ0FBQztBQUM5RCxRQUFNLFlBQVksTUFBTSxJQUFJLEVBQUUsS0FBSyxVQUFVO0FBRTdDLFFBQU0sVUFBVSxFQUFFLFFBQVEsY0FBYyxFQUFFLEtBQUs7QUFDL0MsUUFBTSxVQUFVLE1BQU0sSUFBSSxPQUFPO0FBRWpDLFFBQU0sTUFBTSxFQUFFLElBQUksY0FBYyxFQUFFLEtBQUs7QUFDdkMsUUFBTSxVQUFVLE1BQU0sSUFBSSxHQUFHO0FBRTdCLFFBQU0sTUFBTSxFQUFFLElBQUksY0FBYyxFQUFFLEtBQUs7QUFDdkMsUUFBTSxZQUFZLENBQUMsUUFBZ0IsVUFBMEIsT0FBTyxJQUFJLFVBQVUsS0FBSztBQUV2RixTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixnQkFBZ0IsVUFBVSxLQUFLLE9BQU87QUFBQSxNQUN0QyxnQkFBZ0IsVUFBVSxLQUFLLE9BQU87QUFBQSxNQUN0QyxrQkFBa0IsVUFBVSxLQUFLLEVBQUUsS0FBSyxVQUFVO0FBQUEsSUFDcEQ7QUFBQSxFQUNGO0FBQ0Y7QUFHTyxTQUFTLGVBQTRCO0FBQzFDLFFBQU0sT0FDSixPQUFPLGFBQWEsY0FDZixTQUFTLGdCQUFnQixhQUFhLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FDeEU7QUFDTixTQUFPLEtBQUssWUFBWSxFQUFFLFdBQVcsSUFBSSxJQUFJLE9BQU87QUFDdEQ7QUFFQSxTQUFTLElBQUksR0FBbUI7QUFDOUIsU0FBTyxPQUFPLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO0FBQ3REO0FBR0EsU0FBUyxPQUFPLE1BQWMsS0FBOEQ7QUFDMUYsTUFBSSxDQUFDLElBQUssUUFBTyxHQUFHLElBQUk7QUFDeEIsU0FBTyxHQUFHLElBQUksS0FBSyxJQUFJLElBQUksVUFBVSxDQUFDLGlCQUFpQixJQUFJLElBQUksUUFBUSxDQUFDO0FBQzFFO0FBR0EsU0FBUyxZQUFzQjtBQUM3QixTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjtBQUVBLFNBQVMsWUFBc0I7QUFDN0IsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxTQUFTLFNBQVMsR0FBaUIsR0FBbUIsTUFBc0I7QUFDMUUsUUFBTSxNQUNKLEVBQUUsSUFBSSxXQUFXLEVBQUUsSUFBSSxTQUFTLElBQzVCLHdCQUF3QixFQUFFLElBQUksTUFBTSw4Q0FDcEM7QUFDTixRQUFNLFFBQ0osRUFBRSxnQkFBZ0IsSUFBSSxlQUFlLEVBQUUsYUFBYSxpQkFBaUI7QUFDdkUsUUFBTSxNQUNKLEVBQUUsZ0JBQWdCLE9BQU8sVUFBVSxFQUFFLFdBQVcsd0NBQXdDO0FBQzFGLFFBQU0sVUFBVTtBQUFBLElBQ2QsZUFBZSxFQUFFLFNBQVM7QUFBQSxJQUMxQixpQkFBaUIsRUFBRSxPQUFPLGNBQWM7QUFBQSxJQUN4QyxjQUFjLEVBQUUsT0FBTztBQUFBLElBQ3ZCLGtCQUFrQixFQUFFLE9BQU87QUFBQSxFQUM3QixFQUFFLEtBQUssSUFBSTtBQUNYLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQTtBQUFBLElBQ0EsR0FBRyxVQUFVO0FBQUEsSUFDYjtBQUFBLElBQ0Esb0JBQW9CLEVBQUUsU0FBUyxLQUFLLE9BQUksRUFBRSxTQUFTLE1BQU0saUJBQWlCLEVBQUUsS0FBSyxLQUFLLE9BQUksRUFBRSxLQUFLLE1BQU0sT0FBTyxHQUFHLElBQUksS0FBSztBQUFBLElBQzFIO0FBQUEsSUFDQSwyQkFBMkIsSUFBSSxFQUFFLEtBQUssUUFBUSxDQUFDO0FBQUEsSUFDL0MscUJBQWdCLEtBQUssTUFBTSxFQUFFLEtBQUssUUFBUSxFQUFFLEtBQUssS0FBSyxDQUFDLFlBQVksS0FBSyxNQUFNLEVBQUUsS0FBSyxRQUFRLEVBQUUsS0FBSyxHQUFHLENBQUMsbUJBQW1CLElBQUksRUFBRSxLQUFLLFVBQVUsQ0FBQztBQUFBLElBQ2pKLE9BQU8sTUFBTSxFQUFFLEVBQUU7QUFBQSxJQUNqQixPQUFPLE1BQU0sRUFBRSxFQUFFO0FBQUEsSUFDakIsT0FBTyxNQUFNLEVBQUUsRUFBRTtBQUFBLElBQ2pCO0FBQUEsTUFDRTtBQUFBLE1BQ0EsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssVUFBVSxZQUFZLEVBQUUsT0FBTyxXQUFXLElBQUk7QUFBQSxJQUM5RTtBQUFBLElBQ0EsT0FBTyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLFVBQVUsWUFBWSxFQUFFLEtBQUssV0FBVyxJQUFJLElBQUk7QUFBQSxFQUM3RixFQUNHLE9BQU8sTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDdkIsT0FBTyxDQUFDLElBQUksYUFBYSxPQUFPLEtBQUssSUFBSSxJQUFJLENBQUMsRUFDOUMsS0FBSyxJQUFJO0FBQ2Q7QUFFQSxTQUFTLFNBQVMsR0FBaUIsR0FBbUIsTUFBc0I7QUFDMUUsUUFBTSxNQUNKLEVBQUUsSUFBSSxXQUFXLEVBQUUsSUFBSSxTQUFTLElBQzVCLHdDQUFlLEVBQUUsSUFBSSxNQUFNLG1FQUMzQjtBQUNOLFFBQU0sUUFBUSxFQUFFLGdCQUFnQixJQUFJLDhDQUFXLEVBQUUsYUFBYSxhQUFRO0FBQ3RFLFFBQU0sTUFBTSxFQUFFLGdCQUFnQixPQUFPLHFCQUFNLEVBQUUsV0FBVyxvRUFBa0I7QUFDMUUsUUFBTSxVQUFVO0FBQUEsSUFDZCwyQkFBTyxFQUFFLFNBQVM7QUFBQSxJQUNsQixzREFBbUIsRUFBRSxPQUFPLGNBQWM7QUFBQSxJQUMxQywyQkFBTyxFQUFFLE9BQU87QUFBQSxJQUNoQixrQkFBUSxFQUFFLE9BQU87QUFBQSxFQUNuQixFQUFFLEtBQUssUUFBRztBQUNWLFNBQU87QUFBQSxJQUNMO0FBQUEsSUFDQTtBQUFBLElBQ0EsR0FBRyxVQUFVO0FBQUEsSUFDYjtBQUFBLElBQ0Esa0NBQVMsRUFBRSxTQUFTLEtBQUssT0FBSSxFQUFFLFNBQVMsTUFBTSw4QkFBVSxFQUFFLEtBQUssS0FBSyxPQUFJLEVBQUUsS0FBSyxNQUFNLFdBQU0sR0FBRyxJQUFJLEtBQUs7QUFBQSxJQUN2RztBQUFBLElBQ0EsOENBQVcsSUFBSSxFQUFFLEtBQUssUUFBUSxDQUFDO0FBQUEsSUFDL0Isc0JBQU8sS0FBSyxNQUFNLEVBQUUsS0FBSyxRQUFRLEVBQUUsS0FBSyxHQUFHLENBQUMseUJBQVUsS0FBSyxNQUFNLEVBQUUsS0FBSyxRQUFRLEVBQUUsS0FBSyxLQUFLLENBQUMsaUVBQWUsSUFBSSxFQUFFLEtBQUssVUFBVSxDQUFDO0FBQUEsSUFDbEksT0FBTyxNQUFNLEVBQUUsRUFBRTtBQUFBLElBQ2pCLE9BQU8sTUFBTSxFQUFFLEVBQUU7QUFBQSxJQUNqQixPQUFPLE1BQU0sRUFBRSxFQUFFO0FBQUEsSUFDakI7QUFBQSxNQUNFO0FBQUEsTUFDQSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxVQUFVLFlBQVksRUFBRSxPQUFPLFdBQVcsSUFBSTtBQUFBLElBQzlFO0FBQUEsSUFDQSxPQUFPLHNCQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLFVBQVUsWUFBWSxFQUFFLEtBQUssV0FBVyxJQUFJLElBQUk7QUFBQSxFQUM1RixFQUNHLE9BQU8sTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDdkIsT0FBTyxDQUFDLElBQUkscUJBQU0sT0FBTyxVQUFLLElBQUksSUFBSSxDQUFDLEVBQ3ZDLEtBQUssSUFBSTtBQUNkO0FBT08sU0FBUyxlQUFlLEdBQWlCLEdBQW1CLFFBQTZCO0FBQzlGLFFBQU0sT0FDSixXQUFXLE9BQ1AsaTRCQUNBO0FBQ04sU0FBTyxXQUFXLE9BQU8sU0FBUyxHQUFHLEdBQUcsSUFBSSxJQUFJLFNBQVMsR0FBRyxHQUFHLElBQUk7QUFDckU7OztBRHpMQSxJQUFNLEtBQUssQ0FBQyxNQUFzQixPQUFPLFdBQVcsQ0FBQztBQUVyRCxJQUFNLGVBQ0o7QUFDRixJQUFNLGFBQWE7QUFHbkIsU0FBUyxhQUFhLE1BQWMsUUFBd0I7QUFDMUQsUUFBTSxTQUFTLFNBQVMsY0FBYyxRQUFRO0FBQzlDLFFBQU0sTUFBTSxPQUFPLFdBQVcsSUFBSTtBQUNsQyxNQUFJLENBQUMsSUFBSyxRQUFPO0FBQ2pCLE1BQUksT0FBTztBQUNYLFNBQU8sSUFBSSxZQUFZLE1BQU0sRUFBRSxRQUFRLE9BQU87QUFDaEQ7QUFFQSxTQUFTLFFBQVEsSUFBMkQ7QUFDMUUsUUFBTSxLQUFLLGlCQUFpQixFQUFFO0FBQzlCLFFBQU0sS0FBSyxHQUFHLEdBQUcsUUFBUTtBQUN6QixRQUFNLFFBQVEsR0FBRztBQUNqQixTQUFPLEVBQUUsVUFBVSxJQUFJLFlBQVksR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssSUFBSSxLQUFLLElBQUk7QUFDMUU7QUFNTyxTQUFTLGNBQWMsS0FBK0I7QUFDM0QsUUFBTSxPQUFPLElBQUksVUFBVSxvQkFBb0IsNEJBQVk7QUFDM0QsTUFBSSxDQUFDLEtBQU0sUUFBTztBQUNsQixRQUFNLE9BQU8sS0FBSztBQUNsQixRQUFNLFdBQVcsS0FBSyxjQUEyQixjQUFjO0FBQy9ELFFBQU0sVUFBVSxLQUFLLGNBQTJCLGFBQWE7QUFDN0QsTUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFTLFFBQU87QUFFbEMsUUFBTSxXQUFXLGlCQUFpQixRQUFRO0FBQzFDLFFBQU0sWUFBWSxpQkFBaUIsT0FBTztBQUUxQyxRQUFNLFVBQVUsU0FBUztBQUN6QixRQUFNLGFBQWEsR0FBRyxTQUFTLFVBQVU7QUFDekMsUUFBTSxnQkFBZ0IsR0FBRyxTQUFTLGFBQWE7QUFDL0MsUUFBTSxhQUFhLEdBQUcsVUFBVSxVQUFVO0FBQzFDLFFBQU0sZ0JBQWdCLEdBQUcsVUFBVSxhQUFhO0FBRWhELFFBQU0sV0FDSixRQUFRLGFBQWEsbUJBQW1CLEtBQUssUUFBUSxhQUFhLDBCQUEwQjtBQUc5RixRQUFNLGdCQUFnQixXQUNsQixLQUFLLE1BQU0sS0FBSyxJQUFJLEdBQUcsYUFBYSxhQUFhLElBQUksR0FBRyxJQUFJLE1BQzVEO0FBRUosUUFBTSxhQUNKLEtBQUs7QUFBQSxJQUNILEtBQUssSUFBSSxHQUFHLFVBQVUsYUFBYSxnQkFBZ0IsYUFBYSxhQUFhLElBQUk7QUFBQSxFQUNuRixJQUFJO0FBRU4sUUFBTSxZQUFZLFFBQVEsY0FBYyxHQUFHLFVBQVUsV0FBVyxJQUFJLEdBQUcsVUFBVSxZQUFZO0FBQzdGLFFBQU0sZ0JBQWdCLFNBQVM7QUFDL0IsUUFBTSxpQkFBaUI7QUFHdkIsUUFBTSxNQUFNLFNBQVMsY0FBMkIsb0JBQW9CO0FBQ3BFLFFBQU0sYUFBYSxRQUFRLFFBQVEsaUJBQWlCLEdBQUcsRUFBRSxZQUFZO0FBQ3JFLFFBQU0sWUFBWSxPQUFPLGFBQWEsSUFBSSxlQUFlO0FBR3pELFFBQU0sU0FBUyxDQUFDLFFBQWdCLEtBQUssY0FBMkIsZUFBZSxHQUFHLEVBQUU7QUFDcEYsUUFBTSxPQUFPLE9BQU8sY0FBYztBQUNsQyxRQUFNLE9BQU8sT0FBTyxjQUFjO0FBQ2xDLFFBQU0sT0FBTyxPQUFPLGNBQWM7QUFDbEMsUUFBTSxXQUFXLEtBQUssY0FBMkIsZ0NBQWdDO0FBQ2pGLFFBQU0sU0FBUyxLQUFLLGNBQTJCLGlEQUFpRDtBQUNoRyxRQUFNLFFBQVEsS0FBSyxjQUEyQix1Q0FBdUM7QUFNckYsUUFBTSxTQUNKLE1BQU07QUFBQSxJQUNKLEtBQUs7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0YsRUFBRSxLQUFLLENBQUMsT0FBTyxHQUFHLGdCQUFnQixRQUFRLEdBQUcsWUFBWSxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUs7QUFFakYsUUFBTSxPQUFPLFFBQVEsTUFBTTtBQUMzQixRQUFNLEtBQUssT0FBTyxRQUFRLElBQUksSUFBSTtBQUNsQyxRQUFNLEtBQUssT0FBTyxRQUFRLElBQUksSUFBSTtBQUNsQyxRQUFNLEtBQUssT0FBTyxRQUFRLElBQUksSUFBSTtBQUVsQyxRQUFNLEtBQUssQ0FBQyxPQUF5QyxpQkFBaUIsRUFBRTtBQUN4RSxNQUFJLFNBQXdDO0FBQzVDLE1BQUksVUFBVTtBQUNaLFVBQU0sSUFBSSxHQUFHLFFBQVE7QUFDckIsYUFBUztBQUFBLE1BQ1AsWUFBWSxHQUFHLEVBQUUsVUFBVSxJQUFJLEdBQUcsRUFBRSxVQUFVLElBQUksR0FBRyxFQUFFLGFBQWE7QUFBQSxJQUN0RTtBQUFBLEVBQ0Y7QUFFQSxNQUFJLE9BQXNDO0FBQzFDLE1BQUksUUFBUTtBQUNWLFVBQU0sSUFBSSxHQUFHLE1BQU07QUFDbkIsV0FBTyxFQUFFLFlBQVksR0FBRyxFQUFFLFVBQVUsSUFBSSxJQUFJLEdBQUcsRUFBRSxVQUFVLElBQUksR0FBRyxFQUFFLFFBQVEsSUFBSSxJQUFJO0FBQUEsRUFDdEY7QUFFQSxRQUFNLGNBQ0osU0FBUyxNQUFNLHNCQUFzQixFQUFFLFNBQVMsSUFDNUMsS0FBSyxNQUFNLE1BQU0sc0JBQXNCLEVBQUUsTUFBTSxJQUMvQztBQU1OLFFBQU0sUUFBUSxLQUFLLGNBQTJCLFdBQVc7QUFDekQsUUFBTSxhQUFhLFFBQVEsR0FBRyxLQUFLLElBQUk7QUFDdkMsUUFBTSxZQUFZLENBQUMsU0FBaUIsVUFBa0I7QUFDcEQsVUFBTSxLQUFLLGFBQWEsR0FBRyxXQUFXLGlCQUFpQixPQUFPLENBQUMsSUFBSTtBQUNuRSxVQUFNLEtBQUssYUFBYSxHQUFHLFdBQVcsaUJBQWlCLEtBQUssQ0FBQyxJQUFJO0FBQ2pFLFVBQU0sV0FBVyxLQUFLLElBQUksS0FBSyxLQUFLLFdBQVcsS0FBSztBQUNwRCxVQUFNLGFBQWEsS0FBSyxJQUFJLEtBQUssV0FBVyxLQUFLO0FBQ2pELFdBQU8sRUFBRSxVQUFVLFdBQVc7QUFBQSxFQUNoQztBQUNBLFFBQU0sV0FBVyxVQUFVLGFBQWEsa0JBQWtCO0FBQzFELFFBQU0sV0FBVyxVQUFVLGFBQWEsa0JBQWtCO0FBQzFELFFBQU0sV0FBVyxVQUFVLGFBQWEsa0JBQWtCO0FBQzFELFFBQU0sYUFBYSxNQUFNO0FBQ3ZCLFVBQU0sV0FBVyxHQUFHLGlCQUFpQixTQUFTLGVBQWUsRUFBRSxRQUFRO0FBQ3ZFLFdBQU8sRUFBRSxZQUFZLFdBQVcsSUFBSTtBQUFBLEVBQ3RDO0FBR0EsUUFBTSxhQUFhLEdBQUcsT0FBTyxFQUFFO0FBQy9CLFFBQU0sT0FBTyxPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVU7QUFDakQsUUFBTSxPQUFPO0FBQUEsSUFDWCxPQUFPLGFBQWEsTUFBTSxZQUFZO0FBQUEsSUFDdEMsS0FBSyxhQUFhLE1BQU0sVUFBVTtBQUFBLEVBQ3BDO0FBR0EsU0FBTztBQUFBLElBQ0wsVUFBVSxFQUFFLE9BQU8sZUFBZSxRQUFRLGVBQWU7QUFBQSxJQUN6RCxNQUFNLEVBQUUsT0FBTyxXQUFXLFFBQVEsV0FBVztBQUFBLElBQzdDLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxNQUNULFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxlQUFlLEtBQUssTUFBTSxnQkFBZ0IsR0FBRyxJQUFJO0FBQUEsSUFDakQ7QUFBQSxJQUNBLElBQUksTUFBTTtBQUFBLElBQ1YsSUFBSSxNQUFNO0FBQUEsSUFDVixJQUFJLE1BQU07QUFBQSxJQUNWO0FBQUEsSUFDQSxNQUFNLFFBQVEsV0FBVztBQUFBLElBQ3pCO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjtBQU1BLGVBQXNCLG1CQUFtQixLQUF5QjtBQUNoRSxRQUFNLElBQUksY0FBYyxHQUFHO0FBQzNCLE1BQUksQ0FBQyxHQUFHO0FBQ04sUUFBSSx1QkFBTyxvREFBb0Q7QUFDL0Q7QUFBQSxFQUNGO0FBQ0EsUUFBTSxTQUFTLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLGFBQWEsQ0FBQztBQUNuRSxNQUFJO0FBQ0YsVUFBTSxVQUFVLFVBQVUsVUFBVSxNQUFNO0FBQUEsRUFDNUMsU0FBUyxPQUFPO0FBQ2QsUUFBSSx1QkFBTywwQ0FBMEMsT0FBTyxLQUFLLENBQUMsR0FBRztBQUFBLEVBQ3ZFO0FBQ0Y7OztBRXpNQSxJQUFBQyxtQkFBaUQ7OztBQ0FqRCxJQUFBQyxtQkFBeUM7QUFHbEMsU0FBUyxZQUFZLEtBQXFDO0FBQy9ELFFBQU0sT0FBTyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQzNELFNBQU8sT0FBTyxLQUFLLFFBQVEsSUFBSTtBQUNqQztBQVFPLFNBQVMsY0FBYyxLQUFtQjtBQUMvQyxRQUFNLE9BQU8sSUFBSSxVQUFVLG9CQUFvQiw2QkFBWTtBQUMzRCxNQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsTUFBTSxTQUFVLFFBQU87QUFDakQsUUFBTSxRQUFRLEtBQUssU0FBUztBQUM1QixNQUFJLE1BQU0sV0FBVyxLQUFNLFFBQU87QUFDbEMsTUFBSSxNQUFNLFdBQVcsTUFBTyxRQUFPO0FBQ25DLFNBQU8sQ0FBQyxDQUFDLEtBQUssVUFBVSxjQUFjLCtDQUErQztBQUN2RjtBQUdPLFNBQVMsY0FBYyxLQUFVLE1BQTZDO0FBQ25GLFFBQU0sUUFBUSxJQUFJLGNBQWMsYUFBYSxJQUFJO0FBQ2pELFNBQU8sT0FBTyxlQUFlO0FBQy9CO0FBR08sU0FBUyxrQkFBa0IsS0FBMEM7QUFDMUUsUUFBTSxPQUFPLElBQUksVUFBVSxjQUFjO0FBQ3pDLFNBQU8sT0FBTyxjQUFjLEtBQUssSUFBSSxJQUFJO0FBQzNDOzs7QURsQk8sSUFBTSxvQkFBb0I7QUFBQSxFQUMvQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUdBLElBQU0saUJBQWlCO0FBQUEsRUFDckI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUdBLFNBQVMsTUFBTSxJQUEyQjtBQUN4QyxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVksT0FBTyxXQUFXLFNBQVMsRUFBRSxDQUFDO0FBQ2hFO0FBTUEsU0FBUyxZQUFZLFFBQWlDLFFBQXVDO0FBQzNGLGFBQVcsT0FBTyxnQkFBZ0I7QUFDaEMsVUFBTSxVQUFVLE9BQU8sR0FBRztBQUMxQixRQUFJLENBQUMsV0FBVyxlQUFlLFFBQVM7QUFDeEMsVUFBTSxXQUFXLE9BQU8sR0FBRztBQUMzQixRQUFJLFlBQVksRUFBRSxlQUFlLFVBQVc7QUFDNUMsV0FBTyxHQUFHLElBQUk7QUFBQSxFQUNoQjtBQUVBLGFBQVcsT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0YsR0FBRztBQUNELFVBQU0sUUFBUSxPQUFPLEdBQUc7QUFDeEIsUUFBSSxVQUFVLFVBQWEsVUFBVSxLQUFNO0FBQzNDLFFBQUksTUFBTSxRQUFRLEtBQUssS0FBSyxNQUFNLFdBQVcsRUFBRztBQUNoRCxRQUFJLE9BQU8sVUFBVSxZQUFZLENBQUMsTUFBTSxRQUFRLEtBQUssS0FBSyxPQUFPLEtBQUssS0FBSyxFQUFFLFdBQVc7QUFDdEY7QUFDRixRQUFJLE9BQU8sR0FBRyxNQUFNLE9BQVcsUUFBTyxHQUFHLElBQUk7QUFBQSxFQUMvQztBQUNGO0FBTUEsU0FBUyxVQUNQLE1BQ0EsU0FDeUI7QUFDekIsUUFBTSxNQUErQixDQUFDO0FBQ3RDLGFBQVcsV0FBVyxnQkFBZ0I7QUFDcEMsVUFBTSxJQUFLLEtBQUssT0FBTyxLQUFLLENBQUM7QUFDN0IsVUFBTSxJQUFLLFFBQVEsT0FBTyxLQUFLLENBQUM7QUFDaEMsVUFBTSxPQUFPLG9CQUFJLElBQUksQ0FBQyxHQUFHLE9BQU8sS0FBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDM0QsVUFBTSxRQUEyRCxDQUFDO0FBQ2xFLGVBQVcsT0FBTyxNQUFNO0FBQ3RCLFVBQUksRUFBRSxHQUFHLE1BQU0sRUFBRSxHQUFHLEdBQUc7QUFDckIsY0FBTSxHQUFHLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLGFBQWEsU0FBUyxFQUFFLEdBQUcsS0FBSyxZQUFZO0FBQUEsTUFDN0U7QUFBQSxJQUNGO0FBQ0EsUUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFLFNBQVMsRUFBRyxLQUFJLE9BQU8sSUFBSTtBQUFBLEVBQ3BEO0FBQ0EsU0FBTztBQUNUO0FBR0EsU0FBUyxhQUFhLEtBQTBDO0FBQzlELFFBQU0sT0FBTyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQzNELE1BQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsUUFBTSxTQUFTLEtBQUssUUFBUSxNQUFNO0FBQ2xDLFFBQU0sWUFBWSxLQUFLO0FBR3ZCLFFBQU0sT0FBTyxDQUFDLFNBQXVDO0FBQ25ELGVBQVcsT0FBTyxNQUFNO0FBQ3RCLFlBQU0sS0FBSyxVQUFVLGNBQTJCLEdBQUc7QUFDbkQsVUFBSSxHQUFJLFFBQU87QUFBQSxJQUNqQjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQ0EsUUFBTSxRQUFRLENBQUMsSUFBd0IsVUFBNEM7QUFDakYsUUFBSSxDQUFDLEdBQUksUUFBTyxFQUFFLGFBQWEsMkJBQTJCO0FBQzFELFVBQU0sS0FBSyxpQkFBaUIsRUFBRTtBQUM5QixVQUFNLE1BQThCLENBQUM7QUFDckMsZUFBVyxLQUFLLE9BQU87QUFDckIsWUFBTSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxLQUFLO0FBQ3RDLFVBQUksRUFBRyxLQUFJLENBQUMsSUFBSTtBQUFBLElBQ2xCO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFDQSxRQUFNLE9BQU8saUJBQWlCLFNBQVMsSUFBSTtBQUMzQyxRQUFNLFNBQVMsQ0FBQyxTQUF5QixLQUFLLGlCQUFpQixJQUFJLEVBQUUsS0FBSztBQUUxRSxRQUFNLFlBQVksS0FBSztBQUFBLElBQ3JCLFNBQ0ksOENBQ0E7QUFBQSxFQUNOLENBQUM7QUFDRCxRQUFNLE9BQU8sS0FBSztBQUFBLElBQ2hCLFNBQ0ksZ0VBQ0E7QUFBQSxFQUNOLENBQUM7QUFDRCxRQUFNLEtBQUssS0FBSztBQUFBLElBQ2QsU0FBUywrQ0FBK0M7QUFBQSxJQUN4RCxTQUNJLHFDQUNBO0FBQUEsRUFDTixDQUFDO0FBQ0QsUUFBTSxXQUFXLEtBQUs7QUFBQSxJQUNwQixTQUFTLHFEQUFxRDtBQUFBLElBQzlELFNBQVMsdUJBQXVCO0FBQUEsRUFDbEMsQ0FBQztBQUNELFFBQU0sTUFBTSxLQUFLO0FBQUEsSUFDZixTQUNJLHNDQUNBO0FBQUEsSUFDSixTQUFTLGtEQUFrRDtBQUFBLElBQzNELFNBQVMscURBQXFEO0FBQUEsRUFDaEUsQ0FBQztBQUNELFFBQU0sUUFBUSxLQUFLO0FBQUEsSUFDakIsU0FBUyw2Q0FBNkM7QUFBQSxJQUN0RCxTQUNJLGlEQUNBO0FBQUEsRUFDTixDQUFDO0FBQ0QsUUFBTSxhQUFhLEtBQUs7QUFBQSxJQUN0QixTQUFTLHVDQUF1QztBQUFBLElBQ2hELFNBQ0ksa0RBQ0E7QUFBQSxFQUNOLENBQUM7QUFDRCxRQUFNLFFBQVEsS0FBSztBQUFBLElBQ2pCLFNBQVMsd0NBQXdDO0FBQUEsSUFDakQsU0FBUyxtQkFBbUI7QUFBQSxFQUM5QixDQUFDO0FBQ0QsUUFBTSxNQUFNLEtBQUs7QUFBQSxJQUNmLFNBQVMsc0NBQXNDO0FBQUEsSUFDL0MsU0FBUyxpQkFBaUI7QUFBQSxJQUMxQjtBQUFBO0FBQUEsRUFDRixDQUFDO0FBQ0QsUUFBTSxLQUFLLEtBQUs7QUFBQSxJQUNkLFNBQVMscUNBQXFDO0FBQUEsSUFDOUMsU0FBUyxnQkFBZ0I7QUFBQSxJQUN6QixTQUFTLFdBQVc7QUFBQSxFQUN0QixDQUFDO0FBTUQsUUFBTSxrQkFBa0IsVUFBVSxjQUFjLCtCQUErQixHQUFHLGFBQWE7QUFDL0YsUUFBTSxVQUFvQixDQUFDO0FBQzNCLE1BQUksUUFBUTtBQUNWLFVBQU0sT0FBTyxvQkFBSSxJQUFZO0FBQzdCLGNBQ0csaUJBQWlCLGlDQUFpQyxFQUNsRCxRQUFRLENBQUMsT0FBTyxLQUFLLElBQUksR0FBRyxRQUFRLFlBQVksQ0FBQyxDQUFDO0FBQ3JELFlBQVEsS0FBSyxHQUFHLElBQUk7QUFBQSxFQUN0QjtBQUtBLFFBQU0sWUFBMEQsQ0FBQztBQUNqRSxNQUFJLFFBQVE7QUFDVixjQUFVLGlCQUFpQixvQkFBb0IsRUFBRSxRQUFRLENBQUMsSUFBSSxNQUFNO0FBQ2xFLFVBQUksS0FBSyxFQUFHO0FBQ1osWUFBTSxLQUFLLGlCQUFpQixFQUFFO0FBQzlCLGdCQUFVLEtBQUs7QUFBQSxRQUNiLFdBQVcsR0FBRztBQUFBLFFBQ2QsYUFBYSxHQUFHLGlCQUFpQixjQUFjLEVBQUUsS0FBSztBQUFBLE1BQ3hELENBQUM7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNIO0FBSUEsUUFBTSxtQkFBbUIsTUFBTTtBQUM3QixVQUFNLE1BQU0sU0FDUiw4Q0FDQTtBQUNKLFVBQU0sS0FBSyxVQUFVLGNBQTJCLEdBQUc7QUFDbkQsV0FBTyxLQUFLLGlCQUFpQixFQUFFLEVBQUUsVUFBVTtBQUFBLEVBQzdDLEdBQUc7QUFDSCxRQUFNLGVBQWUsTUFBTTtBQUN6QixRQUFJLENBQUMsR0FBSSxRQUFPO0FBQ2hCLFFBQUksTUFBTTtBQUNWLFFBQUksT0FBMkI7QUFDL0IsV0FBTyxRQUFRLFNBQVMsYUFBYSxTQUFTLFNBQVMsTUFBTTtBQUMzRCxhQUFPLEtBQUs7QUFDWixhQUFPLEtBQUs7QUFBQSxJQUNkO0FBQ0EsV0FBTztBQUFBLEVBQ1QsR0FBRztBQUlILFFBQU0sU0FBUyxTQUNYLFVBQVUsY0FBMkIsYUFBYSxJQUNsRCxVQUFVLGNBQTJCLCtDQUErQztBQUN4RixRQUFNLGtCQUFrQixNQUFNO0FBQzVCLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBUSxRQUFPO0FBQzNCLFdBQU8sS0FBSyxNQUFNLEdBQUcsc0JBQXNCLEVBQUUsTUFBTSxPQUFPLHNCQUFzQixFQUFFLEdBQUc7QUFBQSxFQUN2RixHQUFHO0FBQ0gsUUFBTSxtQkFBbUIsTUFBTTtBQUM3QixRQUFJLENBQUMsTUFBTSxDQUFDLE9BQVEsUUFBTztBQUMzQixXQUFPLEtBQUssTUFBTSxHQUFHLHNCQUFzQixFQUFFLE9BQU8sT0FBTyxzQkFBc0IsRUFBRSxJQUFJO0FBQUEsRUFDekYsR0FBRztBQUNILFFBQU0sbUJBQW1CLE1BQU07QUFDN0IsUUFBSSxDQUFDLE9BQVEsUUFBTztBQUNwQixXQUFPLE1BQU0sS0FBSyxPQUFPLFFBQVEsRUFDOUIsTUFBTSxHQUFHLENBQUMsRUFDVixJQUFJLENBQUMsT0FBTztBQUNYLFlBQU0sS0FBSyxpQkFBaUIsRUFBRTtBQUM5QixhQUFPO0FBQUEsUUFDTCxLQUFNLEdBQW1CLGFBQWEsR0FBRyxRQUFRLFlBQVk7QUFBQSxRQUM3RCxTQUFTLEdBQUc7QUFBQSxRQUNaLFFBQVEsS0FBSyxNQUFNLEdBQUcsc0JBQXNCLEVBQUUsTUFBTTtBQUFBLFFBQ3BELFdBQVcsR0FBRztBQUFBLFFBQ2QsWUFBWSxHQUFHO0FBQUEsUUFDZixjQUFjLEdBQUc7QUFBQSxRQUNqQixlQUFlLEdBQUc7QUFBQSxNQUNwQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0wsR0FBRztBQUlILFFBQU0sWUFBWSxNQUFNO0FBQ3RCLFFBQUksQ0FBQyxPQUFRLFFBQU87QUFDcEIsVUFBTSxRQUEyRCxDQUFDO0FBQ2xFLFFBQUksT0FBMkI7QUFDL0IsV0FBTyxRQUFRLFNBQVMsYUFBYSxTQUFTLFNBQVMsTUFBTTtBQUMzRCxZQUFNLEtBQUssaUJBQWlCLElBQUk7QUFDaEMsWUFBTSxLQUFLO0FBQUEsUUFDVCxLQUFLLEtBQUssYUFBYSxLQUFLLFFBQVEsWUFBWTtBQUFBLFFBQ2hELFFBQVEsR0FBRztBQUFBLFFBQ1gsUUFBUSxHQUFHO0FBQUEsTUFDYixDQUFDO0FBQ0QsYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUNBLFdBQU87QUFBQSxFQUNULEdBQUc7QUFLSCxRQUFNLGVBQWUsTUFBTTtBQUN6QixRQUFJLENBQUMsT0FBUSxRQUFPO0FBQ3BCLFVBQU0sVUFBVSxVQUFVLGNBQTJCLGFBQWE7QUFDbEUsUUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLGFBQWEsbUJBQW1CLEVBQUcsUUFBTztBQUNuRSxVQUFNLEtBQUssaUJBQWlCLFNBQVMsVUFBVTtBQUMvQyxXQUFPO0FBQUEsTUFDTCxTQUFTLEdBQUc7QUFBQSxNQUNaLFNBQVMsR0FBRztBQUFBLE1BQ1osVUFBVSxHQUFHO0FBQUEsTUFDYixLQUFLLEdBQUc7QUFBQSxNQUNSLE1BQU0sR0FBRztBQUFBLE1BQ1QsWUFBWSxHQUFHO0FBQUEsTUFDZixZQUFZLEdBQUc7QUFBQSxNQUNmLFVBQVUsR0FBRztBQUFBLE1BQ2IsWUFBWSxHQUFHO0FBQUEsTUFDZixZQUFZLEdBQUc7QUFBQSxNQUNmLGFBQWEsR0FBRztBQUFBLE1BQ2hCLE9BQU8sR0FBRztBQUFBLE1BQ1YsZUFBZSxHQUFHO0FBQUEsTUFDbEIsZUFBZSxHQUFHO0FBQUEsTUFDbEIsYUFBYSxHQUFHO0FBQUEsTUFDaEIsYUFBYSxHQUFHO0FBQUEsTUFDaEIscUJBQXFCLEdBQUc7QUFBQSxNQUN4QixvQkFBb0IsR0FBRztBQUFBLE1BQ3ZCLHNCQUFzQixHQUFHO0FBQUEsTUFDekIsaUJBQWlCLEdBQUc7QUFBQSxJQUN0QjtBQUFBLEVBQ0YsR0FBRztBQUVILFFBQU0sT0FBTztBQUFBLElBQ1gsTUFBTSxTQUFTLHdCQUF3QjtBQUFBO0FBQUEsSUFFdkMsY0FBYyxTQUFTLEtBQUssVUFBVSxTQUFTLG9CQUFvQjtBQUFBLElBQ25FLFNBQVMsU0FBUyxVQUFVO0FBQUEsSUFDNUIsaUJBQWlCLFNBQVMsa0JBQWtCO0FBQUEsSUFDNUMsYUFBYSxTQUFTLGNBQWMsR0FBRyxJQUFJO0FBQUEsSUFDM0MsV0FBVyxTQUFTLFlBQVk7QUFBQSxJQUNoQywwQkFBMEI7QUFBQSxJQUMxQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBLE9BQU87QUFBQSxJQUNQLFdBQVcsTUFBTSxXQUFXO0FBQUEsTUFDMUI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxXQUFXLE1BQU0sTUFBTTtBQUFBLE1BQ3JCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsSUFBSSxNQUFNLElBQUk7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsVUFBVSxNQUFNLFVBQVU7QUFBQSxNQUN4QjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxXQUFXLE1BQU0sS0FBSztBQUFBLE1BQ3BCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsWUFBWSxNQUFNLE9BQU87QUFBQSxNQUN2QjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFlBQVksTUFBTSxZQUFZO0FBQUEsTUFDNUI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU8sTUFBTSxPQUFPLENBQUMsYUFBYSxlQUFlLFNBQVMsaUJBQWlCLENBQUM7QUFBQSxJQUM1RSxPQUFPLE1BQU0sS0FBSyxDQUFDLFdBQVcsZUFBZSxnQkFBZ0IsYUFBYSxPQUFPLENBQUM7QUFBQSxJQUNsRixnQkFBZ0IsTUFBTSxJQUFJLENBQUMsY0FBYyxpQkFBaUIsb0JBQW9CLFFBQVEsQ0FBQztBQUFBLElBQ3ZGLGNBQWM7QUFBQSxNQUNaLGVBQWUsT0FBTyxhQUFhO0FBQUEsTUFDbkMsd0JBQXdCLE9BQU8sc0JBQXNCO0FBQUEsTUFDckQsYUFBYSxPQUFPLFdBQVc7QUFBQSxNQUMvQixvQkFBb0IsT0FBTyxrQkFBa0I7QUFBQSxNQUM3QyxlQUFlLE9BQU8sYUFBYTtBQUFBLE1BQ25DLGdCQUFnQixPQUFPLGNBQWM7QUFBQSxNQUNyQyxjQUFjLE9BQU8sWUFBWTtBQUFBLE1BQ2pDLG1CQUFtQixPQUFPLGlCQUFpQjtBQUFBLE1BQzNDLHNCQUFzQixPQUFPLG9CQUFvQjtBQUFBLE1BQ2pELGVBQWUsT0FBTyxhQUFhO0FBQUEsTUFDbkMsa0JBQWtCLE9BQU8sZ0JBQWdCO0FBQUEsTUFDekMsaUJBQWlCLE9BQU8sZUFBZTtBQUFBLE1BQ3ZDLGVBQWUsT0FBTyxhQUFhO0FBQUEsTUFDbkMsa0JBQWtCLE9BQU8sZ0JBQWdCO0FBQUEsTUFDekMsaUJBQWlCLE9BQU8sZUFBZTtBQUFBLE1BQ3ZDLHdCQUF3QixPQUFPLHNCQUFzQjtBQUFBLE1BQ3JELGlDQUFpQyxPQUFPLCtCQUErQjtBQUFBLE1BQ3ZFLGtCQUFrQixPQUFPLGdCQUFnQjtBQUFBLE1BQ3pDLHFCQUFxQixPQUFPLG1CQUFtQjtBQUFBLE1BQy9DLHNCQUFzQixPQUFPLG9CQUFvQjtBQUFBLE1BQ2pELG9CQUFvQixPQUFPLGtCQUFrQjtBQUFBLElBQy9DO0FBQUEsRUFDRjtBQUNBLFNBQU87QUFDVDtBQVVBLGVBQXNCLGVBQWUsUUFBMkM7QUFDOUUsUUFBTSxNQUFNLE9BQU87QUFDbkIsTUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLFNBQVMsb0JBQW9CLEdBQUc7QUFDM0QsUUFBSSx3QkFBTyxxRUFBcUU7QUFDaEY7QUFBQSxFQUNGO0FBQ0EsUUFBTSxPQUFPLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDM0QsTUFBSSxDQUFDLE1BQU07QUFDVCxRQUFJLHdCQUFPLHdDQUF3QztBQUNuRDtBQUFBLEVBQ0Y7QUFDQSxRQUFNLFlBQVksS0FBSyxRQUFRO0FBQy9CLFFBQU0sYUFBYSxJQUFJLFVBQVUsY0FBYztBQUMvQyxRQUFNLE9BQU8sSUFBSSxVQUFVLFFBQVEsS0FBSztBQUd4QyxRQUFNLE9BQWdDLENBQUM7QUFDdkMsYUFBVyxRQUFRLG1CQUFtQjtBQUNwQyxVQUFNLElBQUksSUFBSSxNQUFNLHNCQUFzQixTQUFTLElBQUksS0FBSztBQUM1RCxRQUFJLEVBQUUsYUFBYSx3QkFBUTtBQUMzQixVQUFNLEtBQUssU0FBUyxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxFQUFFLENBQUM7QUFDcEQsVUFBTSxNQUFNLEdBQUc7QUFDZixVQUFNLElBQUksYUFBYSxHQUFHO0FBQzFCLFFBQUksRUFBRyxhQUFZLE1BQU0sQ0FBQztBQUFBLEVBQzVCO0FBR0EsTUFBSSxVQUEwQztBQUM5QyxRQUFNLE9BQU8sSUFBSSxNQUFNLHNCQUFzQiwwQkFBMEI7QUFDdkUsTUFBSSxnQkFBZ0Isd0JBQU87QUFDekIsVUFBTSxLQUFLLFNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsRUFBRSxDQUFDO0FBQ3hELFVBQU0sTUFBTSxHQUFHO0FBQ2YsY0FBVSxhQUFhLEdBQUc7QUFBQSxFQUM1QjtBQUdBLE1BQUksWUFBWTtBQUNkLFVBQU0sS0FBSyxTQUFTLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxVQUFVLEVBQUUsQ0FBQztBQUM5RCxXQUFPLFFBQVE7QUFBQSxFQUNqQjtBQUNBLE1BQUksQ0FBQyxTQUFTO0FBQ1osUUFBSSx3QkFBTyxzQ0FBc0M7QUFDakQ7QUFBQSxFQUNGO0FBRUEsUUFBTSxVQUFVLEVBQUUsTUFBTSxTQUFTLE1BQU0sVUFBVSxNQUFNLE9BQU8sRUFBRTtBQUNoRSxNQUFJO0FBQ0YsVUFBTSxJQUFJLE1BQU0sUUFBUSxNQUFNLDZCQUE2QixLQUFLLFVBQVUsU0FBUyxNQUFNLENBQUMsQ0FBQztBQUMzRixRQUFJLHdCQUFPLCtEQUEwRDtBQUFBLEVBQ3ZFLFNBQVMsT0FBTztBQUNkLFFBQUksd0JBQU8sOENBQThDLE9BQU8sS0FBSyxDQUFDLEdBQUc7QUFBQSxFQUMzRTtBQUNGO0FBR08sU0FBUyxxQkFBcUIsUUFBa0M7QUFDckUsU0FBTyxXQUFXO0FBQUEsSUFDaEIsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sVUFBVSxNQUFNLEtBQUssZUFBZSxNQUFNO0FBQUEsRUFDNUMsQ0FBQztBQUNIOzs7QUVoZk8sSUFBTSxnQkFBd0M7QUFBQSxFQUNuRCxFQUFFLElBQUksT0FBTyxPQUFPLGdCQUFnQjtBQUFBLEVBQ3BDLEVBQUUsSUFBSSxVQUFVLE9BQU8saUJBQWlCO0FBQUEsRUFDeEMsRUFBRSxJQUFJLFNBQVMsT0FBTyxhQUFhO0FBQUEsRUFDbkMsRUFBRSxJQUFJLFdBQVcsT0FBTyxVQUFVO0FBQUEsRUFDbEMsRUFBRSxJQUFJLFVBQVUsT0FBTyxjQUFjO0FBQUEsRUFDckMsRUFBRSxJQUFJLFNBQVMsT0FBTyxnQkFBZ0I7QUFDeEM7QUFvQ08sSUFBTSxtQkFBeUM7QUFBQSxFQUNwRCxnQkFBZ0I7QUFBQSxFQUNoQixpQkFBaUI7QUFBQSxFQUNqQixjQUFjO0FBQUEsRUFDZCxlQUFlO0FBQUEsRUFDZixXQUFXO0FBQUEsRUFDWCxpQkFBaUI7QUFBQSxFQUNqQixnQkFBZ0I7QUFBQSxFQUNoQixhQUFhO0FBQUEsRUFDYixhQUFhO0FBQUEsRUFDYixlQUFlO0FBQUEsRUFDZixtQkFBbUI7QUFBQSxFQUNuQixxQkFBcUI7QUFBQSxFQUNyQixhQUFhO0FBQ2Y7QUFHTyxJQUFNLFdBQVc7OztBQzlEeEIsSUFBQUMsbUJBQXVCO0FBR2hCLFNBQVMsaUJBQWlCLFFBQWtDO0FBR2pFLFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLGVBQWUsQ0FBQyxhQUFhO0FBQzNCLFVBQUksQ0FBQyxTQUFTLEtBQUssVUFBVSxTQUFTLG9CQUFvQixFQUFHLFFBQU87QUFDcEUsVUFBSSxDQUFDLFVBQVU7QUFDYixlQUFPLFNBQVMsWUFBWSxDQUFDLE9BQU8sU0FBUztBQUM3QyxhQUFLLE9BQU8sYUFBYSxFQUFFLEtBQUssTUFBTSxPQUFPLFFBQVEsQ0FBQztBQUFBLE1BQ3hEO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixVQUFVLE1BQU0sS0FBSyxPQUFPLG9CQUFvQjtBQUFBLEVBQ2xELENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsT0FBTyxPQUFPLEdBQUcsS0FBSyxJQUFJLENBQUM7QUFBQSxJQUNuRCxlQUFlLENBQUMsYUFBYTtBQUMzQixVQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsU0FBUyxvQkFBb0IsRUFBRyxRQUFPO0FBQ3BFLFVBQUksQ0FBQyxTQUFVLFFBQU8sY0FBYztBQUNwQyxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUtELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxPQUFPLE9BQU8sR0FBRyxLQUFLLFlBQVksQ0FBQztBQUFBLElBQzNELGVBQWUsQ0FBQyxhQUFhO0FBQzNCLFlBQU0sT0FBTyxPQUFPLElBQUksVUFBVSxjQUFjO0FBQ2hELFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxZQUFZLFNBQVMsSUFBSSxFQUFHLFFBQU87QUFDeEQsVUFBSSxDQUFDLFNBQVUsTUFBSyxPQUFPLFNBQVMsTUFBTTtBQUMxQyxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUNELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxPQUFPLE9BQU8sR0FBRyxLQUFLLGFBQWEsQ0FBQztBQUFBLElBQzVELGVBQWUsQ0FBQyxhQUFhO0FBQzNCLFlBQU0sT0FBTyxPQUFPLElBQUksVUFBVSxjQUFjO0FBQ2hELFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxZQUFZLFNBQVMsSUFBSSxFQUFHLFFBQU87QUFDeEQsVUFBSSxDQUFDLFNBQVUsTUFBSyxPQUFPLFNBQVMsTUFBTTtBQUMxQyxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUVELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLFNBQVMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxPQUFPLE9BQU8sR0FBRyxLQUFLLElBQUksQ0FBQztBQUFBO0FBQUE7QUFBQSxJQUduRCxlQUFlLENBQUMsYUFBYTtBQUMzQixZQUFNLE9BQU8sT0FBTyxJQUFJLFVBQVUsY0FBYztBQUNoRCxVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sWUFBWSxTQUFTLElBQUksRUFBRyxRQUFPO0FBQ3hELFlBQU0sT0FBTyxPQUFPLFlBQVksZUFBZSxJQUFJO0FBQ25ELFVBQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsVUFBSSxDQUFDLFNBQVUsTUFBSyxPQUFPLFlBQVksa0JBQWtCLE1BQU0sSUFBSTtBQUNuRSxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUlELFNBQU8sV0FBVztBQUFBLElBQ2hCLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQTtBQUFBO0FBQUEsSUFHTixlQUFlLENBQUMsYUFBYTtBQUMzQixZQUFNLE9BQU8sT0FBTyxJQUFJLFVBQVUsY0FBYztBQUNoRCxVQUFJLFFBQVEsT0FBTyxZQUFZLFNBQVMsSUFBSSxFQUFHLFFBQU87QUFDdEQsVUFBSSxDQUFDLFNBQVUsTUFBSyxPQUFPLFlBQVksaUJBQWlCLE9BQU8sWUFBWSxjQUFjLENBQUM7QUFDMUYsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFPRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixlQUFlLENBQUMsYUFBYTtBQUMzQixZQUFNLE9BQU8sT0FBTyxJQUFJLFVBQVUsY0FBYztBQUNoRCxVQUFJLENBQUMsUUFBUSxPQUFPLFlBQVksU0FBUyxJQUFJLEVBQUcsUUFBTztBQUN2RCxVQUFJLENBQUMsVUFBVTtBQUNiLGNBQU0sWUFBWTtBQUNoQixnQkFBTSxZQUFZLE1BQU0sT0FBTyxZQUFZLGVBQWUsSUFBSTtBQUM5RCxjQUFJLENBQUMsVUFBVztBQUNoQixjQUFJLHdCQUFPLDZEQUE2RDtBQUN4RSxnQkFBTSxPQUFPLHFCQUFxQjtBQUFBLFFBQ3BDLEdBQUc7QUFBQSxNQUNMO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixVQUFVLFlBQVk7QUFLcEIsVUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLFNBQVMsb0JBQW9CLEdBQUc7QUFDM0QsWUFBSSx3QkFBTyxxRUFBcUU7QUFDaEY7QUFBQSxNQUNGO0FBQ0EsWUFBTSxtQkFBbUIsT0FBTyxHQUFHO0FBQUEsSUFDckM7QUFBQSxFQUNGLENBQUM7QUFFRCxTQUFPLFdBQVc7QUFBQSxJQUNoQixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsT0FBTyxPQUFPLEdBQUcsS0FBSyxJQUFJLENBQUM7QUFBQSxJQUNuRCxlQUFlLENBQUMsYUFBYTtBQUMzQixZQUFNLE9BQU8sT0FBTyxJQUFJLFVBQVUsY0FBYztBQUNoRCxVQUFJLENBQUMsS0FBTSxRQUFPO0FBQ2xCLFlBQU0sS0FBSyxjQUFjLE9BQU8sS0FBSyxJQUFJO0FBQ3pDLFVBQUksT0FBTyxRQUFRLEVBQUUsWUFBWSxJQUFLLFFBQU87QUFDN0MsVUFBSSxDQUFDLFNBQVUsUUFBTyxhQUFhO0FBQ25DLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixDQUFDO0FBRUQsTUFBSSxLQUFVLHNCQUFxQixNQUFNO0FBQzNDOzs7QUN4SkEsSUFBQUMsbUJBQW1DOzs7QUNVNUIsSUFBTSxpQkFBaUI7QUErQnZCLFNBQVMsWUFDZCxhQUNBLFVBQ0EsU0FDaUI7QUFJakIsUUFBTSxjQUFjLG9CQUFJLElBQVksQ0FBQyxXQUFXLENBQUM7QUFDakQsTUFBSSxPQUFPO0FBQ1gsYUFBUztBQUNQLFVBQU0sT0FBTyxRQUFRLElBQUk7QUFDekIsUUFBSSxDQUFDLFFBQVEsWUFBWSxJQUFJLElBQUksRUFBRztBQUNwQyxnQkFBWSxJQUFJLElBQUk7QUFDcEIsV0FBTztBQUFBLEVBQ1Q7QUFHQSxRQUFNLFFBQWtCLENBQUM7QUFDekIsUUFBTSxVQUFVLG9CQUFJLElBQVk7QUFDaEMsTUFBSSxNQUEwQjtBQUM5QixTQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksR0FBRyxHQUFHO0FBQy9CLFlBQVEsSUFBSSxHQUFHO0FBQ2YsVUFBTSxLQUFLLEdBQUc7QUFDZCxVQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFBQSxFQUN2QjtBQUVBLFFBQU0sUUFBUSxNQUFNLFFBQVEsV0FBVztBQUN2QyxNQUFJLFVBQVUsR0FBSSxRQUFPO0FBQ3pCLFNBQU8sRUFBRSxPQUFPLE1BQU07QUFDeEI7QUFPTyxTQUFTLGFBQWEsT0FBZ0IsTUFBYyxnQkFBMEI7QUFDbkYsUUFBTSxPQUFrQixDQUFDO0FBQ3pCLFFBQU0sVUFBVSxDQUFDLE1BQXFCO0FBQ3BDLFFBQUksTUFBTSxRQUFRLENBQUMsR0FBRztBQUNwQixpQkFBVyxRQUFRLEVBQUcsU0FBUSxJQUFJO0FBQUEsSUFDcEMsT0FBTztBQUNMLFdBQUssS0FBSyxDQUFDO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFDQSxVQUFRLEtBQUs7QUFFYixRQUFNLE1BQWdCLENBQUM7QUFDdkIsYUFBVyxRQUFRLE1BQU07QUFDdkIsVUFBTSxPQUFPLGdCQUFnQixJQUFJO0FBQ2pDLFFBQUksS0FBTSxLQUFJLEtBQUssSUFBSTtBQUN2QixRQUFJLElBQUksVUFBVSxJQUFLO0FBQUEsRUFDekI7QUFDQSxTQUFPO0FBQ1Q7QUFPTyxTQUFTLGdCQUFnQixPQUFnQixNQUFjLGdCQUEwQjtBQUN0RixRQUFNLE9BQWtCLENBQUM7QUFDekIsUUFBTSxVQUFVLENBQUMsTUFBcUI7QUFDcEMsUUFBSSxNQUFNLFFBQVEsQ0FBQyxHQUFHO0FBQ3BCLGlCQUFXLFFBQVEsRUFBRyxTQUFRLElBQUk7QUFBQSxJQUNwQyxPQUFPO0FBQ0wsV0FBSyxLQUFLLENBQUM7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUNBLFVBQVEsS0FBSztBQUViLFFBQU0sTUFBZ0IsQ0FBQztBQUN2QixhQUFXLFFBQVEsTUFBTTtBQUN2QixRQUFJLE9BQU8sU0FBUyxTQUFVO0FBQzlCLFVBQU0sVUFBVSxLQUFLLEtBQUs7QUFDMUIsUUFBSSxDQUFDLFFBQVM7QUFDZCxRQUFJLEtBQUssT0FBTztBQUNoQixRQUFJLElBQUksVUFBVSxJQUFLO0FBQUEsRUFDekI7QUFDQSxTQUFPO0FBQ1Q7QUFVTyxTQUFTLGdCQUFnQixPQUErQjtBQUM3RCxNQUFJLE9BQU8sVUFBVSxTQUFVLFFBQU87QUFDdEMsUUFBTSxVQUFVLE1BQU0sS0FBSztBQUMzQixNQUFJLENBQUMsUUFBUyxRQUFPO0FBQ3JCLFNBQU8sUUFBUSxRQUFRLFNBQVMsRUFBRSxFQUFFLFFBQVEsU0FBUyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLO0FBQzVGO0FBR08sU0FBUyxZQUFZLE9BQXdCO0FBQ2xELE1BQUksVUFBVSxRQUFRLFVBQVUsT0FBVyxRQUFPO0FBQ2xELFVBQVEsT0FBTyxPQUFPO0FBQUEsSUFDcEIsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxVQUFJO0FBQ0YsZUFBTyxLQUFLLFVBQVUsS0FBSyxLQUFLO0FBQUEsTUFDbEMsUUFBUTtBQUVOLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRixLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQ0gsYUFBTyxPQUFPLEtBQUs7QUFBQSxJQUNyQjtBQUVFLGFBQU8sT0FBTztBQUFBLEVBQ2xCO0FBQ0Y7OztBQzdGTyxTQUFTLGVBQWUsT0FBaUQ7QUFDOUUsUUFBTSxFQUFFLGFBQWEsYUFBYSxJQUFJO0FBQ3RDLFFBQU0sV0FBVyxhQUFhLENBQUM7QUFFL0IsTUFBSSxVQUFVO0FBQ1osVUFBTSxXQUFXLGdCQUFnQixRQUFRO0FBQ3pDLFFBQUksWUFBWSxZQUFZLFFBQVEsS0FBSyxhQUFhLGFBQWE7QUFDakUsVUFBSSxDQUFDLE1BQU0sY0FBYyxJQUFJLFFBQVEsR0FBRztBQUd0QyxlQUFPLEVBQUUsU0FBUyxVQUFVLGNBQWMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQUEsTUFDN0Q7QUFFQSxZQUFNQyxXQUFVLFdBQVcsR0FBRyxXQUFXLFNBQVMsTUFBTSxhQUFhO0FBQ3JFLGFBQU87QUFBQSxRQUNMLFNBQUFBO0FBQUEsUUFDQSxjQUFjLENBQUMsUUFBUTtBQUFBLFFBQ3ZCLFVBQVUsQ0FBQyxFQUFFLE1BQU0sYUFBYSxNQUFNLENBQUMsS0FBS0EsUUFBTyxJQUFJLEVBQUUsQ0FBQztBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUFBLEVBR0Y7QUFHQSxRQUFNLFVBQVUsV0FBVyxHQUFHLFdBQVcsU0FBUyxNQUFNLGFBQWE7QUFDckUsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLGNBQWMsQ0FBQztBQUFBLElBQ2YsVUFBVSxDQUFDLEVBQUUsTUFBTSxhQUFhLE1BQU0sQ0FBQyxLQUFLLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFBQSxFQUM1RDtBQUNGO0FBU08sU0FBUyxjQUFjLE9BQXlEO0FBQ3JGLFNBQU87QUFBQSxJQUNMLFNBQVMsV0FBVyxtQkFBbUIsTUFBTSxhQUFhO0FBQUEsSUFDMUQsY0FBYyxDQUFDO0FBQUEsSUFDZixVQUFVLENBQUM7QUFBQSxFQUNiO0FBQ0Y7QUFtQk8sU0FBUyxtQkFBbUIsT0FBNEQ7QUFDN0YsTUFBSSxNQUFNLFlBQWEsUUFBTztBQUM5QixTQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUU7QUFDcEI7QUFHQSxTQUFTLFlBQVksTUFBdUI7QUFDMUMsU0FBTyxLQUFLLFNBQVMsS0FBSyxDQUFDLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLFNBQVMsSUFBSTtBQUN0RTtBQUdBLFNBQVMsV0FBVyxNQUFjLFVBQStCO0FBQy9ELE1BQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFHLFFBQU87QUFDaEMsV0FBUyxJQUFJLEtBQUssS0FBSztBQUNyQixVQUFNLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQztBQUM5QixRQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsRUFBRyxRQUFPO0FBQUEsRUFDdkM7QUFDRjs7O0FDbkhPLFNBQVMsaUJBQ2QsT0FDQSxhQUNpQjtBQUNqQixRQUFNLFdBQTRCLENBQUM7QUFDbkMsV0FBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUNyQyxVQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxRQUFRLFlBQVksSUFBSSxJQUFJLEVBQUc7QUFFcEMsUUFBSSxJQUFJLElBQUk7QUFDWixXQUFPLElBQUksTUFBTSxVQUFVLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFHO0FBQ3RELFVBQU0sV0FBVyxJQUFJLE1BQU0sU0FBUyxNQUFNLENBQUMsSUFBSTtBQUMvQyxVQUFNLFVBQVUsY0FBYyxNQUFNLElBQUksQ0FBQyxLQUFLO0FBQzlDLFFBQUksUUFBUyxVQUFTLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUFBLEVBQy9DO0FBQ0EsU0FBTztBQUNUO0FBUU8sU0FBUyxnQkFDZCxPQUNBLGFBQ0EsV0FDZTtBQUNmLE1BQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxJQUFJLFNBQVMsRUFBRyxRQUFPO0FBQ3RELFFBQU0sUUFBUSxNQUFNLFFBQVEsU0FBUztBQUNyQyxNQUFJLFVBQVUsR0FBSSxRQUFPO0FBQ3pCLFdBQVMsSUFBSSxRQUFRLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUM3QyxRQUFJLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUcsUUFBTyxNQUFNLENBQUM7QUFBQSxFQUNoRDtBQUNBLFdBQVMsSUFBSSxRQUFRLEdBQUcsS0FBSyxHQUFHLEtBQUs7QUFDbkMsUUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFHLFFBQU8sTUFBTSxDQUFDO0FBQUEsRUFDaEQ7QUFDQSxTQUFPO0FBQ1Q7OztBSHJETyxJQUFNLGNBQU4sTUFBa0I7QUFBQSxFQUN2QixZQUFvQixLQUFVO0FBQVY7QUFBQSxFQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTy9CLFNBQVMsTUFBc0I7QUFDN0IsVUFBTSxLQUFLLGNBQWMsS0FBSyxLQUFLLElBQUk7QUFDdkMsV0FBUSxPQUFPLFFBQVEsWUFBWSxNQUFPLEtBQUssT0FBTyxLQUFLLElBQUksTUFBTTtBQUFBLEVBQ3ZFO0FBQUE7QUFBQSxFQUdBLFFBQVEsTUFBOEI7QUFDcEMsUUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLEVBQUcsUUFBTztBQUNqQyxXQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxDQUFDLFNBQVMsS0FBSyxVQUFVLElBQUk7QUFBQSxNQUM3QixDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUk7QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR1EsVUFBVSxNQUF3QjtBQUN4QyxVQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sc0JBQXNCLElBQUk7QUFDbkQsUUFBSSxFQUFFLGFBQWEsd0JBQVEsUUFBTyxDQUFDO0FBQ25DLFVBQU0sS0FBSyxjQUFjLEtBQUssS0FBSyxDQUFDO0FBQ3BDLFVBQU0sUUFBUSxLQUFLLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2pELFdBQU8sTUFDSixJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksY0FBYyxxQkFBcUIsTUFBTSxJQUFJLENBQUMsRUFDckUsT0FBTyxDQUFDLE1BQWtCLENBQUMsQ0FBQyxDQUFDLEVBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSTtBQUFBLEVBQ3RCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT1EsT0FBTyxNQUFrQztBQUMvQyxlQUFXLEtBQUssS0FBSyxJQUFJLE1BQU0saUJBQWlCLEdBQUc7QUFDakQsVUFBSSxFQUFFLFNBQVMsS0FBTTtBQUNyQixVQUFJLEtBQUssVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBTSxRQUFPLEVBQUU7QUFBQSxJQUNuRDtBQUNBLFdBQU87QUFBQSxFQUNUO0FBQUE7QUFBQSxFQUdBLE9BQU8sTUFBdUI7QUFDNUIsVUFBTSxLQUFLLGNBQWMsS0FBSyxLQUFLLElBQUk7QUFDdkMsVUFBTSxRQUFRLEtBQUssYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDakQsV0FBTyxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLGNBQWMscUJBQXFCLE1BQU0sS0FBSyxJQUFJLENBQUM7QUFBQSxFQUM3RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUUEsZUFBZSxNQUFzQztBQUNuRCxVQUFNLEtBQUssY0FBYyxLQUFLLEtBQUssSUFBSTtBQUN2QyxVQUFNLE1BQU0sS0FBSyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2xELFVBQU0sZ0JBQWdCLElBQUksSUFBSSxLQUFLLElBQUksTUFBTSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUN0RixXQUFPLGVBQUssRUFBRSxhQUFhLEtBQUssVUFBVSxjQUFjLEtBQUssY0FBYyxDQUFDO0FBQUEsRUFDOUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUEsZ0JBQWtDO0FBQ2hDLFVBQU0sZ0JBQWdCLElBQUksSUFBSSxLQUFLLElBQUksTUFBTSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUN0RixXQUFPLGNBQVEsRUFBRSxjQUFjLENBQUM7QUFBQSxFQUNsQztBQUFBO0FBQUEsRUFHQSxNQUFNLGtCQUFrQixNQUFhLE1BQXdCLE9BQU8sTUFBcUI7QUFDdkYsVUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLFVBQVUsS0FBSyxRQUFRLElBQUksR0FBRyxJQUFJO0FBQUEsRUFDckU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFBLE1BQU0saUJBQWlCLE1BQXVDO0FBQzVELFVBQU0sYUFBYSxLQUFLLElBQUksVUFBVSxjQUFjLEdBQUcsUUFBUTtBQUMvRCxVQUFNLEtBQUs7QUFBQSxNQUNUO0FBQUEsTUFDQTtBQUFBLE1BQ0EsVUFBVSxLQUFLLElBQUksWUFBWSxpQkFBaUIsVUFBVSxHQUFHLElBQUk7QUFBQSxJQUNuRTtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBU0EsTUFBTSxlQUFlLE1BQStCO0FBQ2xELFFBQUksbUJBQVUsRUFBRSxhQUFhLEtBQUssU0FBUyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQU0sUUFBTztBQUNyRSxVQUFNLEtBQUssSUFBSSxZQUFZLG1CQUFtQixNQUFNLENBQUMsT0FBZ0M7QUFDbkYsU0FBRyxRQUFRLElBQUksQ0FBQztBQUFBLElBQ2xCLENBQUM7QUFHRCxVQUFNLEtBQUssa0JBQWtCLElBQUk7QUFDakMsV0FBTztBQUFBLEVBQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTUEsTUFBYyxrQkFBa0IsTUFBYSxZQUFZLEtBQXFCO0FBQzVFLFFBQUksS0FBSyxlQUFlLElBQUksRUFBRztBQUMvQixVQUFNLElBQUksUUFBYyxDQUFDLFlBQVk7QUFDbkMsWUFBTSxNQUFNLEtBQUssSUFBSSxjQUFjLEdBQUcsV0FBVyxDQUFDLFlBQW1CO0FBQ25FLFlBQUksUUFBUSxTQUFTLEtBQUssUUFBUSxLQUFLLGVBQWUsSUFBSSxHQUFHO0FBQzNELGVBQUssSUFBSSxjQUFjLE9BQU8sR0FBRztBQUNqQyxpQkFBTyxhQUFhLEtBQUs7QUFDekIsa0JBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRixDQUFDO0FBQ0QsWUFBTSxRQUFRLE9BQU8sV0FBVyxNQUFNO0FBQ3BDLGFBQUssSUFBSSxjQUFjLE9BQU8sR0FBRztBQUNqQyxnQkFBUTtBQUFBLE1BQ1YsR0FBRyxTQUFTO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUEsRUFHUSxlQUFlLE1BQXNCO0FBQzNDLFVBQU0sS0FBSyxjQUFjLEtBQUssS0FBSyxJQUFJO0FBQ3ZDLFdBQU8sT0FBTyxRQUFRLFlBQVk7QUFBQSxFQUNwQztBQUFBO0FBQUEsRUFHQSxNQUFjLFVBQ1osTUFDQSxNQUNBLEtBQ0EsT0FBTyxNQUNRO0FBQ2YsVUFBTSxVQUFVLEdBQUcsR0FBRyxHQUFHLEtBQUssT0FBTztBQUNyQyxVQUFNLGNBQWMsS0FBSyxhQUFhLElBQUksQ0FBQyxTQUFTLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUk7QUFDbkYsVUFBTSxVQUFVO0FBQUEsU0FBZSxXQUFXO0FBQUE7QUFBQTtBQUUxQyxRQUFJO0FBQ0osUUFBSTtBQUNGLGdCQUFVLE1BQU0sS0FBSyxJQUFJLE1BQU0sT0FBTyxTQUFTLE9BQU87QUFBQSxJQUN4RCxTQUFTLE9BQU87QUFDZCxVQUFJLHdCQUFPLG9DQUFvQyxLQUFLLE9BQU8sU0FBUyxPQUFPLEtBQUssQ0FBQyxHQUFHO0FBQ3BGO0FBQUEsSUFDRjtBQUdBLGVBQVcsV0FBVyxLQUFLLFVBQVU7QUFDbkMsVUFBSSxDQUFDLFFBQVEsUUFBUSxTQUFTLEtBQUssU0FBVTtBQUM3QyxZQUFNLEtBQUssSUFBSSxZQUFZLG1CQUFtQixNQUFNLENBQUMsT0FBZ0M7QUFDbkYsV0FBRyxRQUFRLElBQUksUUFBUTtBQUFBLE1BQ3pCLENBQUM7QUFBQSxJQUNIO0FBRUEsUUFBSSxDQUFDLEtBQU07QUFHWCxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsUUFBUSxLQUFLO0FBQzdDLFVBQU0sS0FBSyxTQUFTLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxTQUFTLEVBQUUsQ0FBQztBQUFBLEVBQzVEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVNBLE1BQU0sb0JBQ0osT0FDQSxhQUNBLFdBQzZCO0FBQzdCLFVBQU0sV0FBVyxpQkFBaUIsT0FBTyxXQUFXO0FBRXBELGVBQVcsV0FBVyxVQUFVO0FBQzlCLFlBQU0sSUFBSSxLQUFLLElBQUksTUFBTSxzQkFBc0IsUUFBUSxJQUFJO0FBQzNELFVBQUksRUFBRSxhQUFhLHdCQUFRO0FBQzNCLFlBQU0sT0FBTyxRQUFRLFdBQVcsS0FBSyxJQUFJLE1BQU0sc0JBQXNCLFFBQVEsUUFBUSxJQUFJO0FBQ3pGLFlBQU0sS0FBSyxJQUFJLFlBQVksbUJBQW1CLEdBQUcsQ0FBQyxPQUFnQztBQUNoRixXQUFHLFFBQVEsSUFBSSxnQkFBZ0IseUJBQVEsQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQztBQUFBLE1BQ3JFLENBQUM7QUFBQSxJQUNIO0FBRUEsVUFBTSxVQUFvQixDQUFDO0FBQzNCLGVBQVcsUUFBUSxhQUFhO0FBQzlCLFlBQU0sSUFBSSxLQUFLLElBQUksTUFBTSxzQkFBc0IsSUFBSTtBQUNuRCxVQUFJLEVBQUUsYUFBYSx3QkFBUTtBQUMzQixVQUFJO0FBQ0YsY0FBTSxLQUFLLElBQUksWUFBWSxVQUFVLENBQUM7QUFDdEMsZ0JBQVEsS0FBSyxJQUFJO0FBQUEsTUFDbkIsU0FBUyxPQUFPO0FBQ2QsWUFBSSx3QkFBTyxvQ0FBb0MsRUFBRSxRQUFRLE1BQU0sT0FBTyxLQUFLLENBQUMsR0FBRztBQUFBLE1BQ2pGO0FBQUEsSUFDRjtBQUVBLFdBQU8sRUFBRSxTQUFTLGFBQWEsZ0JBQWdCLE9BQU8sYUFBYSxTQUFTLEVBQUU7QUFBQSxFQUNoRjtBQUNGO0FBR0EsU0FBUyxVQUFVLE1BQWtDO0FBQ25ELE1BQUksQ0FBQyxRQUFRLFNBQVMsSUFBSyxRQUFPO0FBQ2xDLFNBQU8sR0FBRyxLQUFLLFFBQVEsUUFBUSxFQUFFLENBQUM7QUFDcEM7OztBSWhQQSxJQUFBQyxtQkFBcUQ7OztBQ0FyRCxJQUFBQyxtQkFBMkI7QUFHM0IsSUFBTSxvQkFBb0I7QUFTbkIsSUFBTSxxQkFBTixjQUFpQyx1QkFBTTtBQUFBLEVBRzVDLFlBQ0UsS0FDUSxPQUNBLFdBQ0EsV0FDUjtBQUNBLFVBQU0sR0FBRztBQUpEO0FBQ0E7QUFDQTtBQU5WLFNBQVEsWUFBWTtBQUFBLEVBU3BCO0FBQUEsRUFFQSxTQUFlO0FBQ2IsU0FBSyxVQUFVLE1BQU07QUFDckIsU0FBSyxRQUFRLFNBQVMsOEJBQThCO0FBRXBELFVBQU0sUUFBUSxLQUFLLE1BQU07QUFDekIsU0FBSyxVQUFVLFNBQVMsTUFBTTtBQUFBLE1BQzVCLEtBQUs7QUFBQSxNQUNMLE1BQU0sVUFBVSxJQUFJLHVCQUF1QixVQUFVLEtBQUs7QUFBQSxJQUM1RCxDQUFDO0FBQ0QsU0FBSyxVQUNGLFVBQVUsRUFBRSxLQUFLLG1DQUFtQyxDQUFDLEVBQ3JEO0FBQUEsTUFDQyxVQUFVLElBQ04seUNBQ0E7QUFBQSxJQUNOO0FBRUYsVUFBTSxPQUFPLEtBQUssVUFBVSxVQUFVLEVBQUUsS0FBSyxvQ0FBb0MsQ0FBQztBQUNsRixlQUFXLENBQUMsR0FBRyxJQUFJLEtBQUssS0FBSyxNQUFNLE1BQU0sR0FBRyxpQkFBaUIsRUFBRSxRQUFRLEdBQUc7QUFDeEUsWUFBTSxNQUFNLEtBQUssVUFBVSxFQUFFLEtBQUssbUNBQW1DLENBQUM7QUFDdEUsVUFBSSxXQUFXLEVBQUUsS0FBSyxtQ0FBbUMsQ0FBQyxFQUFFLFFBQVEsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUNqRixVQUFJLFdBQVcsRUFBRSxLQUFLLG9DQUFvQyxDQUFDLEVBQUUsUUFBUSxJQUFJO0FBQUEsSUFDM0U7QUFDQSxRQUFJLEtBQUssTUFBTSxTQUFTLG1CQUFtQjtBQUN6QyxXQUNHLFVBQVUsRUFBRSxLQUFLLG9DQUFvQyxDQUFDLEVBQ3RELFFBQVEsY0FBUyxLQUFLLE1BQU0sU0FBUyxpQkFBaUIsT0FBTztBQUFBLElBQ2xFO0FBRUEsU0FBSyxnQkFBZ0I7QUFDckIsU0FBSyxhQUFhO0FBQUEsRUFDcEI7QUFBQTtBQUFBLEVBR1Esa0JBQXdCO0FBQzlCLFVBQU0sTUFBTSxLQUFLLFVBQVUsVUFBVSxFQUFFLEtBQUssdUNBQXVDLENBQUM7QUFDcEYsUUFBSSxTQUFTLE9BQU8sRUFBRSxRQUFRLGlCQUFpQjtBQUMvQyxVQUFNLFdBQVcsSUFBSSxTQUFTLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUMzRCxhQUFTLGlCQUFpQixVQUFVLE1BQU07QUFDeEMsV0FBSyxLQUFLLFVBQVUsRUFBRTtBQUFBLFFBQ3BCLE1BQU07QUFDSixtQkFBUyxXQUFXO0FBQUEsUUFDdEI7QUFBQSxRQUNBLE1BQU07QUFBQSxRQUVOO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUFBLEVBR1EsZUFBcUI7QUFDM0IsVUFBTSxVQUFVLEtBQUssVUFBVSxVQUFVLEVBQUUsS0FBSyx1Q0FBdUMsQ0FBQztBQUN4RixZQUFRLFNBQVMsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDLEVBQUUsaUJBQWlCLFNBQVMsTUFBTSxLQUFLLE1BQU0sQ0FBQztBQUMzRixZQUNHLFNBQVMsVUFBVSxFQUFFLE1BQU0sVUFBVSxLQUFLLGNBQWMsQ0FBQyxFQUN6RCxpQkFBaUIsU0FBUyxNQUFNO0FBQy9CLFdBQUssWUFBWTtBQUNqQixXQUFLLE1BQU07QUFBQSxJQUNiLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFFQSxVQUFnQjtBQUNkLFFBQUksS0FBSyxVQUFXLE1BQUssVUFBVTtBQUFBLEVBQ3JDO0FBQ0Y7OztBRHBGTyxJQUFNLG9CQUFvQjtBQWExQixJQUFNLGtCQUFOLGNBQThCLDBCQUFTO0FBQUEsRUFVNUMsWUFDVSxRQUNSLE1BQ0E7QUFDQSxVQUFNLElBQUk7QUFIRjtBQVRWO0FBQUEsU0FBUSxZQUFzQixDQUFDO0FBRS9CO0FBQUEsU0FBUSxRQUE2QyxDQUFDO0FBRXREO0FBQUEsU0FBUSxXQUFXLG9CQUFJLElBQVk7QUFFbkM7QUFBQSxTQUFRLFNBQXdCO0FBQUEsRUFPaEM7QUFBQSxFQUVBLGNBQXNCO0FBQ3BCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFQSxpQkFBeUI7QUFDdkIsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUVBLFVBQWtCO0FBQ2hCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFQSxNQUFNLFNBQXdCO0FBQzVCLFNBQUssWUFBWSxTQUFTLHFCQUFxQjtBQUMvQyxTQUFLLGNBQWMsS0FBSyxJQUFJLFVBQVUsR0FBRyxhQUFhLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQztBQUMxRSxTQUFLLGNBQWMsS0FBSyxJQUFJLFVBQVUsR0FBRyxzQkFBc0IsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ25GLFNBQUssY0FBYyxLQUFLLElBQUksVUFBVSxHQUFHLGlCQUFpQixNQUFNLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDOUUsU0FBSyxjQUFjLEtBQUssSUFBSSxjQUFjLEdBQUcsV0FBVyxNQUFNLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDNUUsU0FBSyxjQUFjLEtBQUssSUFBSSxNQUFNLEdBQUcsVUFBVSxNQUFNLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDbkUsU0FBSyxjQUFjLEtBQUssSUFBSSxNQUFNLEdBQUcsVUFBVSxNQUFNLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDbkUsU0FBSyxPQUFPO0FBQUEsRUFDZDtBQUFBLEVBRUEsTUFBTSxVQUF5QjtBQUM3QixTQUFLLFlBQVksTUFBTTtBQUN2QixTQUFLLFlBQVksQ0FBQztBQUNsQixTQUFLLFFBQVEsQ0FBQztBQUNkLFNBQUssU0FBUyxNQUFNO0FBQ3BCLFNBQUssU0FBUztBQUFBLEVBQ2hCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBVVEsU0FBZTtBQUNyQixVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsY0FBYztBQUM5QyxVQUFNLE9BQU8sT0FBTyxLQUFLLE9BQU8sWUFBWSxRQUFRLElBQUksSUFBSTtBQUM1RCxVQUFNLFFBQVEsT0FDVixLQUFLLE1BQU0sT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLE1BQU0sc0JBQXNCLENBQUMsYUFBYSxzQkFBSyxJQUNqRixDQUFDO0FBR0wsUUFBSSxLQUFLLFNBQVMsT0FBTyxHQUFHO0FBQzFCLFlBQU0sT0FBTyxJQUFJLElBQUksS0FBSztBQUMxQixpQkFBVyxRQUFRLEtBQUssU0FBVSxLQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRyxNQUFLLFNBQVMsT0FBTyxJQUFJO0FBQUEsSUFDbEY7QUFFQSxRQUFJLEtBQUssV0FBVyxRQUFRLENBQUMsTUFBTSxTQUFTLEtBQUssTUFBTSxFQUFHLE1BQUssU0FBUztBQUV4RSxRQUFJLENBQUMsWUFBWSxLQUFLLFdBQVcsS0FBSyxHQUFHO0FBQ3ZDLFdBQUssUUFBUSxLQUFLO0FBQUEsSUFDcEIsT0FBTztBQUNMLGlCQUFXLE1BQU0sS0FBSyxNQUFPLElBQUcsR0FBRyxVQUFVLE9BQU8sYUFBYSxHQUFHLFNBQVMsTUFBTSxJQUFJO0FBQUEsSUFDekY7QUFDQSxTQUFLLHFCQUFxQjtBQUFBLEVBQzVCO0FBQUE7QUFBQSxFQUdRLFFBQVEsT0FBdUI7QUFDckMsVUFBTSxPQUFPLEtBQUs7QUFDbEIsU0FBSyxNQUFNO0FBQ1gsU0FBSyxRQUFRLENBQUM7QUFDZCxTQUFLLFlBQVk7QUFFakIsUUFBSSxNQUFNLFdBQVcsR0FBRztBQUN0QixZQUFNLFFBQVEsS0FBSyxVQUFVLEVBQUUsS0FBSyw0QkFBNEIsQ0FBQztBQUNqRSxZQUFNO0FBQUEsUUFDSjtBQUFBLE1BQ0Y7QUFDQTtBQUFBLElBQ0Y7QUFFQSxVQUFNLGFBQWEsS0FBSyxJQUFJLFVBQVUsY0FBYyxHQUFHO0FBQ3ZELFVBQU0sUUFBUSxDQUFDLE1BQU0sTUFBTTtBQUN6QixZQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sc0JBQXNCLElBQUk7QUFDbkQsVUFBSSxFQUFFLGFBQWEsd0JBQVE7QUFDM0IsWUFBTSxPQUFPLEtBQUssVUFBVSxFQUFFLEtBQUssMkJBQTJCLENBQUM7QUFDL0QsVUFBSSxTQUFTLFdBQVksTUFBSyxTQUFTLFdBQVc7QUFDbEQsV0FBSyxXQUFXLEVBQUUsS0FBSywwQkFBMEIsQ0FBQyxFQUFFLFFBQVEsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUN6RSxXQUFLLFdBQVcsRUFBRSxLQUFLLDRCQUE0QixDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVE7QUFDeEUsV0FBSyxpQkFBaUIsU0FBUyxDQUFDLE1BQU0sS0FBSyxZQUFZLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDL0QsV0FBSyxpQkFBaUIsZUFBZSxDQUFDLE1BQU07QUFDMUMsVUFBRSxlQUFlO0FBQ2pCLGFBQUssZ0JBQWdCLEdBQUcsQ0FBQztBQUFBLE1BQzNCLENBQUM7QUFDRCxXQUFLLE1BQU0sS0FBSyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUM7QUFBQSxJQUNwQyxDQUFDO0FBQUEsRUFDSDtBQUFBO0FBQUEsRUFHUSxZQUFZLEdBQWUsT0FBZSxHQUFnQjtBQUNoRSxRQUFJLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxTQUFTO0FBQ3hDLFVBQUksRUFBRSxVQUFVO0FBR2QsY0FBTSxhQUFhLEtBQUssSUFBSSxVQUFVLGNBQWMsR0FBRyxRQUFRO0FBQy9ELGNBQU0sYUFDSixLQUFLLFdBQVcsUUFBUSxLQUFLLE1BQU0sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUssTUFBTSxJQUNuRSxLQUFLLFNBQ0w7QUFDTixjQUFNLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQyxPQUFPLEdBQUcsU0FBUyxVQUFVO0FBQ2hFLFlBQUksZUFBZSxRQUFRLFNBQVMsSUFBSTtBQUN0QyxnQkFBTSxDQUFDLElBQUksRUFBRSxJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsT0FBTyxJQUFJO0FBQzVELG1CQUFTLElBQUksSUFBSSxLQUFLLElBQUksSUFBSyxNQUFLLFNBQVMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxFQUFFLElBQUk7QUFHbkUsY0FBSSxlQUFlLFFBQVEsS0FBSyxNQUFNLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDMUUsaUJBQUssU0FBUyxJQUFJLFVBQVU7QUFBQSxVQUM5QjtBQUNBLGVBQUssU0FBUyxLQUFLLE1BQU0sS0FBSyxFQUFFO0FBQ2hDLGVBQUsscUJBQXFCO0FBQzFCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFHQSxVQUFJLEtBQUssU0FBUyxJQUFJLEVBQUUsSUFBSSxFQUFHLE1BQUssU0FBUyxPQUFPLEVBQUUsSUFBSTtBQUFBLFVBQ3JELE1BQUssU0FBUyxJQUFJLEVBQUUsSUFBSTtBQUM3QixXQUFLLFNBQVMsRUFBRTtBQUNoQixXQUFLLHFCQUFxQjtBQUMxQjtBQUFBLElBQ0Y7QUFDQSxTQUFLLFNBQVMsTUFBTTtBQUlwQixTQUFLLFNBQVMsRUFBRTtBQUNoQixTQUFLLHFCQUFxQjtBQUMxQixTQUFLLEtBQUssVUFBVSxDQUFDO0FBQUEsRUFDdkI7QUFBQTtBQUFBLEVBR1EsdUJBQTZCO0FBQ25DLGVBQVcsTUFBTSxLQUFLLE1BQU8sSUFBRyxHQUFHLFVBQVUsT0FBTyxlQUFlLEtBQUssU0FBUyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQUEsRUFDL0Y7QUFBQTtBQUFBLEVBR1EsZ0JBQWdCLEdBQWUsR0FBZ0I7QUFDckQsVUFBTSxPQUFPLElBQUksc0JBQUs7QUFDdEIsU0FBSztBQUFBLE1BQVEsQ0FBQyxPQUNaLEdBQ0csU0FBUyxtQkFBbUIsRUFDNUIsUUFBUSxNQUFNLEVBQ2QsUUFBUSxNQUFNLEtBQUssS0FBSyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQUEsSUFDL0M7QUFDQSxVQUFNLFVBQVUsS0FBSyxTQUFTLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssUUFBUSxJQUFJLENBQUMsRUFBRSxJQUFJO0FBQ3hFLFVBQU0sVUFBVSxLQUFLLFVBQVUsT0FBTyxDQUFDLE1BQU0sUUFBUSxTQUFTLENBQUMsQ0FBQztBQUNoRSxTQUFLO0FBQUEsTUFBUSxDQUFDLE9BQ1osR0FDRyxTQUFTLFFBQVEsU0FBUyxJQUFJLFVBQVUsUUFBUSxNQUFNLFlBQVksY0FBYyxFQUNoRixRQUFRLE9BQU8sRUFDZixRQUFRLE1BQU0sS0FBSyxhQUFhLE9BQU8sQ0FBQztBQUFBLElBQzdDO0FBQ0EsU0FBSyxpQkFBaUIsQ0FBQztBQUFBLEVBQ3pCO0FBQUE7QUFBQSxFQUdBLE1BQWMsZ0JBQWdCLEdBQXlCO0FBQ3JELFVBQU0sT0FBTyxLQUFLLE9BQU8sWUFBWSxlQUFlLENBQUM7QUFDckQsUUFBSSxDQUFDLEtBQU07QUFDWCxVQUFNLEtBQUssT0FBTyxZQUFZLGtCQUFrQixHQUFHLE1BQU0sS0FBSztBQUM5RCxTQUFLLE9BQU87QUFBQSxFQUNkO0FBQUE7QUFBQSxFQUdRLGFBQWEsT0FBdUI7QUFDMUMsUUFBSSxNQUFNLFdBQVcsRUFBRztBQUN4QixVQUFNLE1BQU0sTUFBWSxLQUFLLEtBQUssWUFBWSxLQUFLO0FBRW5ELFFBQUksQ0FBQyxLQUFLLE9BQU8sU0FBUyxxQkFBcUI7QUFDN0MsVUFBSTtBQUNKO0FBQUEsSUFDRjtBQUNBLFVBQU0sUUFBUSxNQUFNLElBQUksQ0FBQyxNQUFNO0FBQzdCLFlBQU0sSUFBSSxLQUFLLElBQUksTUFBTSxzQkFBc0IsQ0FBQztBQUNoRCxhQUFPLGFBQWEseUJBQVEsRUFBRSxXQUFXO0FBQUEsSUFDM0MsQ0FBQztBQUNELFFBQUksbUJBQW1CLEtBQUssS0FBSyxPQUFPLEtBQUssWUFBWTtBQUN2RCxXQUFLLE9BQU8sU0FBUyxzQkFBc0I7QUFDM0MsWUFBTSxLQUFLLE9BQU8sYUFBYTtBQUFBLElBQ2pDLENBQUMsRUFBRSxLQUFLO0FBQUEsRUFDVjtBQUFBLEVBRUEsTUFBYyxZQUFZLE9BQWdDO0FBQ3hELFVBQU0sYUFBYSxLQUFLLElBQUksVUFBVSxjQUFjLEdBQUcsUUFBUTtBQUMvRCxVQUFNLFNBQVMsTUFBTSxLQUFLLE9BQU8sWUFBWTtBQUFBLE1BQzNDLEtBQUs7QUFBQSxNQUNMLElBQUksSUFBSSxLQUFLO0FBQUEsTUFDYjtBQUFBLElBQ0Y7QUFFQSxlQUFXLFFBQVEsTUFBTyxNQUFLLFNBQVMsT0FBTyxJQUFJO0FBQ25ELFFBQUksS0FBSyxXQUFXLFFBQVEsTUFBTSxTQUFTLEtBQUssTUFBTSxFQUFHLE1BQUssU0FBUztBQUV2RSxRQUFJLE9BQU8sYUFBYTtBQUN0QixZQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sc0JBQXNCLE9BQU8sV0FBVztBQUNqRSxVQUFJLGFBQWEsdUJBQU8sT0FBTSxLQUFLLFVBQVUsQ0FBQztBQUM5QztBQUFBLElBQ0Y7QUFDQSxTQUFLLE9BQU87QUFBQSxFQUNkO0FBQUE7QUFBQSxFQUdBLE1BQWMsVUFBVSxHQUF5QjtBQUMvQyxVQUFNLE9BQ0osS0FBSyxJQUFJLFVBQVUsZ0JBQWdCLFVBQVUsRUFBRSxDQUFDLEtBQUssS0FBSyxJQUFJLFVBQVUsUUFBUSxJQUFJO0FBQ3RGLFVBQU0sS0FBSyxTQUFTLENBQUM7QUFDckIsU0FBSyxJQUFJLFVBQVUsY0FBYyxNQUFNLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFBQSxFQUN4RDtBQUNGO0FBR0EsU0FBUyxZQUFZLEdBQWEsR0FBc0I7QUFDdEQsU0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLEdBQUcsTUFBTSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzlEOzs7QUU5UEEsSUFBQUMsbUJBQXNFO0FBUy9ELElBQU0seUJBQU4sY0FBcUMsa0NBQWlCO0FBQUEsRUFDM0QsWUFBb0IsUUFBNEI7QUFDOUMsVUFBTSxPQUFPLEtBQUssTUFBTTtBQUROO0FBQUEsRUFFcEI7QUFBQTtBQUFBLEVBR0Esd0JBQWlEO0FBQy9DLFdBQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixTQUFTLE9BQU8sWUFBWSxjQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFBQSxRQUN2RTtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixTQUFTLEVBQUUsS0FBSyxlQUFlLE1BQU0sU0FBUztBQUFBLE1BQ2hEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssaUJBQWlCLE1BQU0sU0FBUztBQUFBLE1BQ2xEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssa0JBQWtCLE1BQU0sU0FBUztBQUFBLE1BQ25EO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFVBQ04sU0FBUztBQUFBLFlBQ1AsVUFBVTtBQUFBLFlBQ1YsU0FBUztBQUFBLFlBQ1QsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLGdCQUFnQixNQUFNLFNBQVM7QUFBQSxNQUNqRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLG1CQUFtQixNQUFNLFNBQVM7QUFBQSxNQUNwRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLGtCQUFrQixNQUFNLFNBQVM7QUFBQSxNQUNuRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLFNBQVMsRUFBRSxLQUFLLGVBQWUsTUFBTSxRQUFRLGFBQWEsYUFBYTtBQUFBLE1BQ3pFO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssaUJBQWlCLE1BQU0sUUFBUSxhQUFhLHdCQUF3QjtBQUFBLE1BQ3RGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sU0FBUyxFQUFFLEtBQUssdUJBQXVCLE1BQU0sU0FBUztBQUFBLE1BQ3hEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sUUFBUSxNQUFNO0FBRVosVUFDRSxLQUFLLElBQ0wsU0FBUyxjQUFjLFNBQVM7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxnQkFBZ0IsS0FBYSxPQUFzQjtBQUNqRCxTQUFLLEtBQUssa0JBQWtCLEtBQUssS0FBSztBQUFBLEVBQ3hDO0FBQUEsRUFFQSxNQUFjLGtCQUFrQixLQUFhLE9BQStCO0FBQzFFLElBQUMsS0FBSyxPQUFPLFNBQWdELEdBQUcsSUFBSTtBQUNwRSxVQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLFNBQUssT0FBTyxRQUFRO0FBQUEsRUFDdEI7QUFBQTtBQUFBLEVBR0EsVUFBZ0I7QUFDZCxVQUFNLEVBQUUsWUFBWSxJQUFJO0FBQ3hCLGdCQUFZLE1BQU07QUFFbEIsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsZ0JBQWdCLEVBQ3hCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQyxZQUFZLENBQUMsYUFBYTtBQUN6QixpQkFBVyxLQUFLLGNBQWUsVUFBUyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUs7QUFDL0QsZUFBUyxTQUFTLEtBQUssT0FBTyxTQUFTLFdBQVcsRUFBRSxTQUFTLE9BQU8sVUFBVTtBQUM1RSxhQUFLLE9BQU8sU0FBUyxjQUFjO0FBQ25DLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDSCxDQUFDO0FBRUgsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsZUFBZSxFQUN2QjtBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFVLENBQUMsV0FDVixPQUFPLFNBQVMsS0FBSyxPQUFPLFNBQVMsV0FBVyxFQUFFLFNBQVMsT0FBTyxVQUFVO0FBQzFFLGFBQUssT0FBTyxTQUFTLGNBQWM7QUFDbkMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsaUJBQWlCLEVBQ3pCLFFBQVEscUVBQXFFLEVBQzdFO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxTQUFTLEtBQUssT0FBTyxTQUFTLGFBQWEsRUFBRSxTQUFTLE9BQU8sVUFBVTtBQUM1RSxhQUFLLE9BQU8sU0FBUyxnQkFBZ0I7QUFDckMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsNEJBQTRCLEVBQ3BDO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxjQUFjLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDN0UsYUFBSyxPQUFPLFNBQVMsaUJBQWlCO0FBQ3RDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDSDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLG1CQUFtQixFQUMzQjtBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFZLENBQUMsYUFDWixTQUNHLFdBQVc7QUFBQSxRQUNWLFVBQVU7QUFBQSxRQUNWLFNBQVM7QUFBQSxRQUNULE1BQU07QUFBQSxNQUNSLENBQUMsRUFDQSxTQUFTLEtBQUssT0FBTyxTQUFTLGVBQWUsRUFDN0MsU0FBUyxPQUFPLFVBQVU7QUFDekIsYUFBSyxPQUFPLFNBQVMsa0JBQWtCO0FBQ3ZDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDTDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLG1CQUFtQixFQUMzQjtBQUFBLE1BQ0M7QUFBQSxJQUNGLEVBQ0M7QUFBQSxNQUFVLENBQUMsV0FDVixPQUFPLFNBQVMsS0FBSyxPQUFPLFNBQVMsWUFBWSxFQUFFLFNBQVMsT0FBTyxVQUFVO0FBQzNFLGFBQUssT0FBTyxTQUFTLGVBQWU7QUFDcEMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNIO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsd0JBQXdCLEVBQ2hDO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxlQUFlLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDOUUsYUFBSyxPQUFPLFNBQVMsa0JBQWtCO0FBQ3ZDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsYUFBSyxPQUFPLFFBQVE7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDSDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLDBCQUEwQixFQUNsQyxRQUFRLG1FQUFtRSxFQUMzRTtBQUFBLE1BQVUsQ0FBQyxXQUNWLE9BQU8sU0FBUyxLQUFLLE9BQU8sU0FBUyxjQUFjLEVBQUUsU0FBUyxPQUFPLFVBQVU7QUFDN0UsYUFBSyxPQUFPLFNBQVMsaUJBQWlCO0FBQ3RDLGNBQU0sS0FBSyxPQUFPLGFBQWE7QUFBQSxNQUNqQyxDQUFDO0FBQUEsSUFDSDtBQUVGLFFBQUkseUJBQVEsV0FBVyxFQUNwQixRQUFRLGNBQWMsRUFDdEI7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBUSxDQUFDLFNBQ1IsS0FDRyxlQUFlLFlBQVksRUFDM0IsU0FBUyxLQUFLLE9BQU8sU0FBUyxXQUFXLEVBQ3pDLFNBQVMsT0FBTyxVQUFVO0FBQ3pCLGFBQUssT0FBTyxTQUFTLGNBQWM7QUFDbkMsY0FBTSxLQUFLLE9BQU8sYUFBYTtBQUMvQixhQUFLLE9BQU8sUUFBUTtBQUFBLE1BQ3RCLENBQUM7QUFBQSxJQUNMO0FBRUYsUUFBSSx5QkFBUSxXQUFXLEVBQ3BCLFFBQVEsZ0JBQWdCLEVBQ3hCO0FBQUEsTUFDQztBQUFBLElBQ0YsRUFDQztBQUFBLE1BQVEsQ0FBQyxTQUNSLEtBQ0csZUFBZSx1QkFBdUIsRUFDdEMsU0FBUyxLQUFLLE9BQU8sU0FBUyxhQUFhLEVBQzNDLFNBQVMsT0FBTyxVQUFVO0FBQ3pCLGFBQUssT0FBTyxTQUFTLGdCQUFnQjtBQUNyQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLGFBQUssT0FBTyxRQUFRO0FBQUEsTUFDdEIsQ0FBQztBQUFBLElBQ0w7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSx3QkFBd0IsRUFDaEM7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxTQUFTLEtBQUssT0FBTyxTQUFTLG1CQUFtQixFQUFFLFNBQVMsT0FBTyxVQUFVO0FBQ2xGLGFBQUssT0FBTyxTQUFTLHNCQUFzQjtBQUMzQyxjQUFNLEtBQUssT0FBTyxhQUFhO0FBQUEsTUFDakMsQ0FBQztBQUFBLElBQ0g7QUFFRixRQUFJLHlCQUFRLFdBQVcsRUFDcEIsUUFBUSxvQkFBb0IsRUFDNUI7QUFBQSxNQUNDO0FBQUEsSUFDRixFQUNDO0FBQUEsTUFBVSxDQUFDLFdBQ1YsT0FBTyxjQUFjLHVCQUF1QixFQUFFLFFBQVEsTUFBTTtBQUUxRCxRQUNFLEtBQUssSUFDTCxTQUFTLGNBQWMsU0FBUztBQUFBLE1BQ3BDLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDSjtBQUNGOzs7QUNyUk8sU0FBUyxjQUFjLElBQXVCO0FBQ25ELFNBQU8sR0FBRyxXQUFZLElBQUcsWUFBWSxHQUFHLFVBQVU7QUFDcEQ7OztBZmtDQSxJQUFxQixxQkFBckIsY0FBZ0Qsd0JBQU87QUFBQSxFQUF2RDtBQUFBO0FBRUU7QUFBQSxlQUEwQjtBQUkxQjtBQUFBLG9CQUFpQyxFQUFFLEdBQUcsaUJBQWlCO0FBR3ZEO0FBQUEsU0FBUSxhQUFhO0FBRXJCO0FBQUEsU0FBUSxXQUFpQztBQUV6QztBQUFBLFNBQVEsYUFBYTtBQUVyQjtBQUFBLFNBQVEsa0JBQWtCO0FBRTFCO0FBQUEsU0FBUSxVQUFVO0FBRWxCO0FBQUEsU0FBUSxlQUFlO0FBRXZCO0FBQUEseUJBQWdCO0FBQUE7QUFBQSxFQUVoQixNQUFNLFNBQXdCO0FBQzVCLFVBQU0sS0FBSyxhQUFhO0FBQ3hCLFNBQUssY0FBYyxJQUFJLFlBQVksS0FBSyxHQUFHO0FBQzNDLFNBQUssY0FBYyxJQUFJLHVCQUF1QixJQUFJLENBQUM7QUFHbkQsU0FBSztBQUFBLE1BQ0gsS0FBSyxJQUFJLFVBQVUsR0FBRyxhQUFhLE1BQU07QUFDdkMsYUFBSyxxQkFBcUI7QUFDMUIsYUFBSyxRQUFRO0FBQUEsTUFDZixDQUFDO0FBQUEsSUFDSDtBQUNBLFNBQUssY0FBYyxLQUFLLElBQUksVUFBVSxHQUFHLHNCQUFzQixNQUFNLEtBQUssUUFBUSxDQUFDLENBQUM7QUFDcEYsU0FBSyxjQUFjLEtBQUssSUFBSSxVQUFVLEdBQUcsaUJBQWlCLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztBQUUvRSxTQUFLO0FBQUEsTUFDSCxLQUFLLElBQUksY0FBYyxHQUFHLFdBQVcsQ0FBQyxTQUFnQjtBQUNwRCxZQUFJLFNBQVMsS0FBSyxJQUFJLFVBQVUsY0FBYyxFQUFHLE1BQUssUUFBUTtBQUFBLE1BQ2hFLENBQUM7QUFBQSxJQUNIO0FBR0EsU0FBSztBQUFBLE1BQ0gsT0FBTyxZQUFZLE1BQU07QUFDdkIsY0FBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsY0FBTSxNQUFNLE9BQU8sR0FBRyxLQUFLLElBQUksSUFBSSxZQUFZLEtBQUssR0FBRyxDQUFDLEtBQUs7QUFDN0QsWUFBSSxRQUFRLEtBQUssU0FBUztBQUN4QixlQUFLLFVBQVU7QUFDZixlQUFLLFFBQVE7QUFBQSxRQUNmO0FBQUEsTUFDRixHQUFHLEdBQUc7QUFBQSxJQUNSO0FBR0EscUJBQWlCLElBQUk7QUFHckIsU0FBSyxhQUFhLG1CQUFtQixDQUFDLFNBQVMsSUFBSSxnQkFBZ0IsTUFBTSxJQUFJLENBQUM7QUFDOUUsU0FBSyxjQUFjLGdCQUFnQixxQkFBcUIsTUFBTTtBQUM1RCxXQUFLLEtBQUssb0JBQW9CO0FBQUEsSUFDaEMsQ0FBQztBQU9ELFNBQUs7QUFBQSxNQUNIO0FBQUEsTUFDQTtBQUFBLE1BQ0EsQ0FBQyxRQUFRO0FBQ1AsWUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLFNBQVMsb0JBQW9CLEVBQUc7QUFDN0QsY0FBTSxPQUFPLEtBQUssSUFBSSxVQUFVLG9CQUFvQiw2QkFBWTtBQUNoRSxZQUFJLENBQUMsS0FBTTtBQUNYLGNBQU0sS0FBSyxJQUFJO0FBQ2YsWUFBSSxjQUFjLGVBQWUsS0FBSyxVQUFVLFNBQVMsRUFBRSxHQUFHO0FBQzVELGNBQUksR0FBRyxjQUFjLEVBQUcsSUFBRyxZQUFZO0FBQ3ZDLGNBQUksR0FBRyxlQUFlLEVBQUcsSUFBRyxhQUFhO0FBQUEsUUFDM0M7QUFBQSxNQUNGO0FBQUEsTUFDQSxFQUFFLFNBQVMsS0FBSztBQUFBLElBQ2xCO0FBR0EsU0FBSyxpQkFBaUIsVUFBVSxXQUFXLENBQUMsUUFBdUI7QUFDakUsVUFBSSxJQUFJLFFBQVEsWUFBWSxLQUFLLGNBQWMsS0FBSyxTQUFTLGdCQUFnQjtBQUMzRSxhQUFLLFdBQVc7QUFBQSxNQUNsQjtBQUFBLElBQ0YsQ0FBQztBQUdELFNBQUssTUFBTSxVQUFVO0FBQ3JCLGFBQVMsS0FBSyxZQUFZLEtBQUssR0FBRztBQUNsQyxTQUFLLFFBQVE7QUFBQSxFQUNmO0FBQUEsRUFFQSxXQUFpQjtBQUNmLFNBQUssS0FBSyxPQUFPO0FBQ2pCLFNBQUssTUFBTTtBQUNYLGFBQVMsS0FBSyxVQUFVLE9BQU8sb0JBQW9CO0FBQ25ELGFBQVMsS0FBSyxVQUFVLE9BQU8sOEJBQThCO0FBQzdELGFBQVMsS0FBSyxVQUFVLE9BQU8sNEJBQTRCO0FBQzNELFNBQUssbUJBQW1CO0FBQUEsRUFDMUI7QUFBQTtBQUFBLEVBSUEsTUFBTSxlQUE4QjtBQUNsQyxVQUFNLE9BQVEsTUFBTSxLQUFLLFNBQVM7QUFDbEMsU0FBSyxXQUFXLE9BQU8sT0FBTyxDQUFDLEdBQUcsa0JBQWtCLFFBQVEsQ0FBQyxDQUFDO0FBQUEsRUFDaEU7QUFBQSxFQUVBLE1BQU0sZUFBOEI7QUFDbEMsVUFBTSxLQUFLLFNBQVMsS0FBSyxRQUFRO0FBQUEsRUFDbkM7QUFBQTtBQUFBO0FBQUEsRUFLUSxXQUFXLE1BQTZCO0FBQzlDLFFBQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsVUFBTSxLQUFLLGNBQWMsS0FBSyxLQUFLLElBQUk7QUFDdkMsV0FBTyxPQUFPLFFBQVEsWUFBWTtBQUFBLEVBQ3BDO0FBQUE7QUFBQSxFQUdRLHFCQUEyQjtBQUNqQyxlQUFXLE9BQU8sTUFBTSxLQUFLLFNBQVMsS0FBSyxTQUFTLEdBQUc7QUFDckQsVUFBSSxJQUFJLFdBQVcsc0JBQXNCLEVBQUcsVUFBUyxLQUFLLFVBQVUsT0FBTyxHQUFHO0FBQUEsSUFDaEY7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT1Esa0JBQXdCO0FBQzlCLFVBQU0sS0FBSyxjQUFjLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxLQUFLLFNBQVMsV0FBVyxJQUNuRSxLQUFLLFNBQVMsY0FDZCxpQkFBaUI7QUFDckIsVUFBTSxNQUFNLHVCQUF1QixFQUFFO0FBQ3JDLGVBQVcsS0FBSyxNQUFNLEtBQUssU0FBUyxLQUFLLFNBQVMsR0FBRztBQUNuRCxVQUFJLEVBQUUsV0FBVyxzQkFBc0IsS0FBSyxNQUFNLElBQUssVUFBUyxLQUFLLFVBQVUsT0FBTyxDQUFDO0FBQUEsSUFDekY7QUFDQSxhQUFTLEtBQUssVUFBVSxJQUFJLEdBQUc7QUFBQSxFQUNqQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9BLGdCQUFzQjtBQUNwQixTQUFLLGdCQUFnQixDQUFDLEtBQUs7QUFDM0IsUUFBSSxLQUFLLGVBQWU7QUFDdEIsWUFBTSxTQUFTLFNBQVM7QUFDeEIsVUFBSSxrQkFBa0IsZUFBZSxXQUFXLFNBQVMsS0FBTSxRQUFPLEtBQUs7QUFBQSxJQUM3RTtBQUNBLFNBQUssUUFBUTtBQUFBLEVBQ2Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPUSxpQkFBaUIsUUFBdUI7QUFDOUMsYUFBUyxLQUFLLFVBQVUsT0FBTyxnQ0FBZ0MsVUFBVSxLQUFLLGFBQWE7QUFBQSxFQUM3RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9RLHFCQUFxQixRQUF1QjtBQUNsRCxhQUFTLEtBQUssVUFBVTtBQUFBLE1BQ3RCO0FBQUEsTUFDQSxVQUFVLEtBQUssU0FBUztBQUFBLElBQzFCO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUVEsa0JBQWtCLFFBQXVCO0FBQy9DLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDaEUsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsVUFBTSxVQUFVLE1BQU0sVUFBVSxjQUEyQixhQUFhO0FBQ3hFLFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBTTtBQUV2QixVQUFNLE1BQU0sS0FBSyxTQUFTLFlBQVksS0FBSztBQVEzQyxVQUFNLGNBQWMsVUFBVSxRQUFRO0FBQ3RDLFVBQU0sYUFBYSxNQUFNLFVBQVUsY0FBMkIsdUJBQXVCO0FBQ3JGLFFBQUksZUFBZSxXQUFZLFlBQVcsYUFBYSx3QkFBd0IsVUFBVTtBQUFBLFFBQ3BGLGFBQVksZ0JBQWdCLHNCQUFzQjtBQUN2RCxZQUFRLGdCQUFnQiw0QkFBNEIsV0FBVztBQUkvRCxRQUFJLE9BQXNCO0FBQzFCLFFBQUksVUFBVSxPQUFPLFFBQVEsWUFBWTtBQUN2QyxZQUFNLEtBQUssY0FBYyxLQUFLLEtBQUssSUFBSTtBQUN2QyxZQUFNLElBQUksS0FBSyxHQUFHO0FBQ2xCLFVBQUksS0FBSyxLQUFNLFFBQU8sWUFBWSxDQUFDO0FBQUEsSUFDckM7QUFFQSxRQUFJLEtBQU0sU0FBUSxhQUFhLHFCQUFxQixJQUFJO0FBQUEsUUFDbkQsU0FBUSxnQkFBZ0IsbUJBQW1CO0FBQUEsRUFDbEQ7QUFBQTtBQUFBLEVBR0EsTUFBYyxjQUE2QjtBQUN6QyxVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsb0JBQW9CLDZCQUFZO0FBQ2hFLFFBQUksTUFBTTtBQUNSLFlBQU0sUUFBUSxLQUFLLFNBQVM7QUFDNUIsV0FBSyxXQUFXLE1BQU0sU0FBUyxZQUFZLFlBQVk7QUFDdkQsV0FBSyxhQUFhLE1BQU0sV0FBVztBQUVuQyxZQUFNLE9BQU8sS0FBSyxLQUFLLGFBQWE7QUFDcEMsV0FBSyxRQUFRLEVBQUUsR0FBRyxLQUFLLE9BQU8sTUFBTSxVQUFVLFFBQVEsTUFBTTtBQUM1RCxZQUFNLEtBQUssS0FBSyxhQUFhLE1BQU0sRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUFBLElBQ3JEO0FBQ0EsU0FBSyxhQUFhO0FBQ2xCLFNBQUssUUFBUTtBQUtiLGVBQVcsTUFBTSxNQUFNLFVBQVUsaUJBQThCLGNBQWMsS0FBSyxDQUFDLEdBQUc7QUFDcEYsVUFBSSxHQUFHLGNBQWMsRUFBRyxJQUFHLFlBQVk7QUFDdkMsVUFBSSxHQUFHLGVBQWUsRUFBRyxJQUFHLGFBQWE7QUFBQSxJQUMzQztBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR1EsYUFBbUI7QUFDekIsU0FBSyxhQUFhO0FBQ2xCLFVBQU0sT0FBTyxLQUFLLElBQUksVUFBVSxvQkFBb0IsNkJBQVk7QUFDaEUsUUFBSSxNQUFNO0FBQ1IsWUFBTSxRQUFRLEtBQUssS0FBSyxhQUFhO0FBQ3JDLFVBQUksS0FBSyxhQUFhLFdBQVc7QUFDL0IsY0FBTSxRQUFRLEVBQUUsR0FBRyxNQUFNLE9BQU8sTUFBTSxVQUFVO0FBQUEsTUFDbEQsT0FBTztBQUNMLGNBQU0sUUFBUSxFQUFFLEdBQUcsTUFBTSxPQUFPLE1BQU0sVUFBVSxRQUFRLEtBQUssV0FBVztBQUFBLE1BQzFFO0FBQ0EsV0FBSyxLQUFLLEtBQUssYUFBYSxPQUFPLEVBQUUsT0FBTyxNQUFNLENBQUM7QUFBQSxJQUNyRDtBQUNBLFNBQUssUUFBUTtBQUFBLEVBQ2Y7QUFBQTtBQUFBLEVBR0EsZUFBcUI7QUFDbkIsUUFBSSxLQUFLLFdBQVksTUFBSyxXQUFXO0FBQUEsUUFDaEMsTUFBSyxLQUFLLFlBQVk7QUFBQSxFQUM3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUUEsTUFBTSx1QkFBc0M7QUFDMUMsUUFBSSxLQUFLLFdBQVk7QUFDckIsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFdBQVcsSUFBSSxFQUFHO0FBQ3JDLFVBQU0sS0FBSyxZQUFZO0FBQUEsRUFDekI7QUFBQTtBQUFBLEVBR0EsTUFBTSxzQkFBcUM7QUFDekMsVUFBTSxXQUFXLEtBQUssSUFBSSxVQUFVLGdCQUFnQixpQkFBaUI7QUFDckUsUUFBSSxTQUFTLFNBQVMsR0FBRztBQUN2QixZQUFNLEtBQUssSUFBSSxVQUFVLFdBQVcsU0FBUyxDQUFDLENBQUM7QUFDL0M7QUFBQSxJQUNGO0FBQ0EsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGFBQWEsS0FBSztBQUNsRCxRQUFJLENBQUMsS0FBTTtBQUNYLFVBQU0sS0FBSyxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsUUFBUSxLQUFLLENBQUM7QUFDakUsVUFBTSxLQUFLLElBQUksVUFBVSxXQUFXLElBQUk7QUFBQSxFQUMxQztBQUFBO0FBQUEsRUFHUSx1QkFBNkI7QUFDbkMsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsUUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEtBQUssZ0JBQWlCO0FBQ2pELFNBQUssa0JBQWtCLEtBQUs7QUFDNUIsUUFBSSxLQUFLLFNBQVMsbUJBQW1CLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxLQUFLLFlBQVk7QUFDOUUsV0FBSyxLQUFLLFlBQVk7QUFBQSxJQUN4QjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUEsRUFLQSxNQUFNLFNBQVMsV0FBMkM7QUFDeEQsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsUUFBSSxDQUFDLEtBQU07QUFDWCxVQUFNLE9BQU8sS0FBSyxZQUFZLFFBQVEsSUFBSTtBQUMxQyxRQUFJLENBQUMsS0FBTTtBQUNYLFVBQU0sU0FBUyxLQUFLLE1BQU0sY0FBYyxTQUFTLEtBQUssUUFBUSxJQUFJLEtBQUssUUFBUSxDQUFDO0FBQ2hGLFFBQUksQ0FBQyxPQUFRO0FBQ2IsUUFBSSxDQUFDLEtBQUssV0FBWSxPQUFNLEtBQUssWUFBWTtBQUM3QyxTQUFLLEtBQUssSUFBSSxVQUFVLGFBQWEsUUFBUSxLQUFLLElBQUk7QUFBQSxFQUN4RDtBQUFBO0FBQUEsRUFHQSxNQUFNLE9BQU8sT0FBOEI7QUFDekMsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsUUFBSSxDQUFDLEtBQU07QUFDWCxVQUFNLE9BQU8sS0FBSyxZQUFZLFFBQVEsSUFBSTtBQUMxQyxRQUFJLENBQUMsUUFBUSxRQUFRLEtBQUssU0FBUyxLQUFLLE1BQU0sVUFBVSxVQUFVLEtBQUssTUFBTztBQUM5RSxVQUFNLFNBQVMsS0FBSyxNQUFNLEtBQUs7QUFDL0IsUUFBSSxDQUFDLE9BQVE7QUFDYixRQUFJLENBQUMsS0FBSyxXQUFZLE9BQU0sS0FBSyxZQUFZO0FBQzdDLFNBQUssS0FBSyxJQUFJLFVBQVUsYUFBYSxRQUFRLEtBQUssSUFBSTtBQUFBLEVBQ3hEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFTUSxxQkFBcUIsT0FBeUI7QUFDcEQsUUFBSTtBQUNGLFlBQU0sU0FBUyxLQUFLLE1BQU0sS0FBSyxTQUFTLHFCQUFxQixJQUFJO0FBQ2pFLFVBQUksYUFBYSxRQUFRLEtBQUssRUFBRyxRQUFPO0FBQUEsSUFDMUMsUUFBUTtBQUFBLElBRVI7QUFDQSxXQUFPLElBQUksTUFBYyxLQUFLLEVBQUUsS0FBSyxNQUFNLEtBQUs7QUFBQSxFQUNsRDtBQUFBO0FBQUEsRUFHQSxNQUFjLHNCQUFzQixRQUFpQztBQUNuRSxTQUFLLFNBQVMsb0JBQW9CLEtBQUssVUFBVSxNQUFNO0FBQ3ZELFVBQU0sS0FBSyxhQUFhO0FBQUEsRUFDMUI7QUFBQTtBQUFBLEVBR0EsVUFBZ0I7QUFDZCxRQUFJLENBQUMsS0FBSyxJQUFLO0FBQ2YsU0FBSyxnQkFBZ0I7QUFFckIsVUFBTSxPQUFPLEtBQUssSUFBSSxVQUFVLGNBQWM7QUFDOUMsVUFBTSxPQUFPLFlBQVksS0FBSyxHQUFHO0FBQ2pDLFVBQU0sU0FBUyxLQUFLLFdBQVcsSUFBSTtBQUNuQyxVQUFNLGlCQUFpQixTQUFTLFlBQVksY0FBYyxLQUFLLEdBQUc7QUFJbEUsUUFBSSxLQUFLLGVBQWUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCO0FBQ25ELFdBQUssYUFBYTtBQUFBLElBQ3BCO0FBSUEsU0FBSyxlQUFlLGlCQUFpQixLQUFLLFlBQVk7QUFHdEQsVUFBTSxTQUFTLEtBQUssY0FBYyxVQUFVO0FBQzVDLGFBQVMsS0FBSyxVQUFVLE9BQU8sc0JBQXNCLE1BQU07QUFDM0QsUUFBSSxDQUFDLE9BQVEsTUFBSyxnQkFBZ0I7QUFDbEMsU0FBSyxpQkFBaUIsTUFBTTtBQUM1QixTQUFLLHFCQUFxQixNQUFNO0FBQ2hDLFNBQUssa0JBQWtCLE1BQU07QUFFN0IsVUFBTSxhQUFhLFVBQVUsS0FBSyxTQUFTLGlCQUFpQixDQUFDLEtBQUssU0FBUztBQUkzRSxRQUFJLFlBQVk7QUFDZCxlQUFTLGdCQUFnQixNQUFNLGVBQWUsNEJBQTRCO0FBQUEsSUFDNUUsT0FBTztBQUNMLGVBQVMsZ0JBQWdCLFlBQVksRUFBRSw4QkFBOEIsTUFBTSxDQUFDO0FBQUEsSUFDOUU7QUFDQSxRQUFJLENBQUMsWUFBWTtBQUNmLFdBQUssSUFBSSxhQUFhLEVBQUUsU0FBUyxPQUFPLENBQUM7QUFDekM7QUFBQSxJQUNGO0FBQ0EsUUFBSSxDQUFDLEtBQU07QUFFWCxVQUFNLEtBQUssa0JBQWtCLEtBQUssR0FBRztBQUNyQyxVQUFNLE9BQU8sS0FBSyxZQUFZLFFBQVEsSUFBSTtBQUMxQyxrQkFBYyxLQUFLLEdBQUc7QUFJdEIsUUFBSSxLQUFLLFNBQVMsa0JBQWtCLE1BQU07QUFDeEMsWUFBTSxVQUFVLEtBQUssUUFBUTtBQUM3QixZQUFNLFVBQVUsS0FBSyxRQUFRLEtBQUssTUFBTSxTQUFTO0FBQ2pELFlBQU0sTUFBTSxVQUFVLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQztBQUNsRCxVQUFJLFlBQVksVUFBVSxVQUFLLGlCQUFpQixNQUFNLEtBQUssS0FBSyxTQUFTLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQztBQUMzRixVQUFJLFlBQVksVUFBVSxVQUFLLGFBQWEsTUFBTSxLQUFLLEtBQUssU0FBUyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUM7QUFDdkYsV0FBSyxJQUFJLFlBQVksR0FBRztBQUFBLElBQzFCO0FBR0EsVUFBTSxZQUFZLEtBQUssU0FBUyxjQUM3QixNQUFNLEdBQUcsRUFDVCxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUNuQixPQUFPLE9BQU87QUFFakIsUUFBSSxVQUFVLFNBQVMsS0FBSyxJQUFJO0FBQzlCLFlBQU0sVUFBOEIsQ0FBQztBQUNyQyxpQkFBVyxRQUFRLFdBQVc7QUFDNUIsWUFBSSxRQUFRLElBQUk7QUFDZCxnQkFBTSxNQUFNLEdBQUcsSUFBSTtBQUNuQixjQUFJLE9BQU8sS0FBTSxTQUFRLEtBQUssQ0FBQyxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUM7QUFBQSxRQUN4RDtBQUFBLE1BQ0Y7QUFFQSxVQUFJLFFBQVEsU0FBUyxHQUFHO0FBQ3RCLGNBQU0sWUFBWSxVQUFVLEVBQUUsS0FBSywrQkFBK0IsQ0FBQztBQUVuRSxjQUFNLFNBQVMsS0FBSyxxQkFBcUIsUUFBUSxNQUFNO0FBRXZELGlCQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsUUFBUSxLQUFLO0FBQ3ZDLGdCQUFNLENBQUMsRUFBRSxLQUFLLElBQUksUUFBUSxDQUFDO0FBQzNCLGdCQUFNLE9BQU8sV0FBVyxFQUFFLEtBQUssK0JBQStCLE1BQU0sTUFBTSxDQUFDO0FBQzNFLGVBQUssYUFBYTtBQUFBLFlBQ2hCLFdBQVcsUUFBUSxPQUFPLENBQUMsQ0FBQyxRQUFTLFFBQVEsU0FBUyxLQUFLLElBQUssUUFBUSxNQUFNO0FBQUEsVUFDaEYsQ0FBQztBQUNELG9CQUFVLFlBQVksSUFBSTtBQUUxQixjQUFJLElBQUksUUFBUSxTQUFTLEdBQUc7QUFDMUIsa0JBQU0sVUFBVSxVQUFVLEVBQUUsS0FBSyw0QkFBNEIsQ0FBQztBQUM5RCxvQkFBUSxpQkFBaUIsYUFBYSxDQUFDLE1BQU07QUFDM0MsZ0JBQUUsZUFBZTtBQUNqQixvQkFBTSxTQUFTLEVBQUU7QUFDakIsb0JBQU0saUJBQWlCLFVBQVU7QUFDakMsb0JBQU0sZ0JBQWdCLENBQUMsR0FBRyxNQUFNO0FBQ2hDLG9CQUFNLFNBQVMsQ0FBQyxPQUFtQjtBQUNqQyxzQkFBTSxTQUFVLEdBQUcsVUFBVSxVQUFVLGlCQUFrQjtBQUN6RCxzQkFBTSxVQUFVLEtBQUssSUFBSSxHQUFHLGNBQWMsQ0FBQyxJQUFJLEtBQUs7QUFDcEQsc0JBQU0sV0FBVyxLQUFLLElBQUksR0FBRyxjQUFjLElBQUksQ0FBQyxJQUFJLEtBQUs7QUFDekQsdUJBQU8sQ0FBQyxJQUFJO0FBQ1osdUJBQU8sSUFBSSxDQUFDLElBQUk7QUFDaEIsc0JBQU0sUUFBUSxVQUFVO0FBQUEsa0JBQ3RCO0FBQUEsZ0JBQ0Y7QUFDQSxzQkFBTSxDQUFDLEVBQUUsYUFBYTtBQUFBLGtCQUNwQixXQUFXLFFBQVEsT0FBTyxRQUFTLFFBQVEsU0FBUyxLQUFLLElBQUssUUFBUSxNQUFNO0FBQUEsZ0JBQzlFLENBQUM7QUFDRCxzQkFBTSxJQUFJLENBQUMsRUFBRSxhQUFhO0FBQUEsa0JBQ3hCLFdBQVcsUUFBUSxRQUFRLFFBQVMsUUFBUSxTQUFTLEtBQUssSUFBSyxRQUFRLE1BQU07QUFBQSxnQkFDL0UsQ0FBQztBQUFBLGNBQ0g7QUFDQSxvQkFBTSxPQUFPLE1BQU07QUFDakIseUJBQVMsb0JBQW9CLGFBQWEsTUFBTTtBQUNoRCx5QkFBUyxvQkFBb0IsV0FBVyxJQUFJO0FBQzVDLHlCQUFTLEtBQUssYUFBYSxFQUFFLFFBQVEsSUFBSSxZQUFZLEdBQUcsQ0FBQztBQUN6RCxxQkFBSyxLQUFLLHNCQUFzQixNQUFNO0FBQUEsY0FDeEM7QUFDQSx1QkFBUyxpQkFBaUIsYUFBYSxNQUFNO0FBQzdDLHVCQUFTLGlCQUFpQixXQUFXLElBQUk7QUFDekMsdUJBQVMsS0FBSyxhQUFhLEVBQUUsUUFBUSxjQUFjLFlBQVksT0FBTyxDQUFDO0FBQUEsWUFDekUsQ0FBQztBQUNELHNCQUFVLFlBQVksT0FBTztBQUFBLFVBQy9CO0FBQUEsUUFDRjtBQUVBLGFBQUssSUFBSSxZQUFZLFNBQVM7QUFBQSxNQUNoQztBQUFBLElBQ0Y7QUFHQSxVQUFNLFNBQVMsT0FBTyxLQUFLLFlBQVksT0FBTyxJQUFJLElBQUksQ0FBQztBQUN2RCxRQUFJLE9BQU8sU0FBUyxHQUFHO0FBQ3JCLFlBQU0sT0FBTyxXQUFXO0FBQUEsUUFDdEIsS0FBSztBQUFBLFFBQ0wsTUFBTSxZQUFPLE9BQU8sS0FBSyxJQUFJO0FBQUEsUUFDN0IsTUFBTSxFQUFFLE9BQU8sNERBQXVEO0FBQUEsTUFDeEUsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLG9CQUFvQixVQUFVLE1BQU07QUFHcEQsWUFBTSxRQUFRLEtBQUssTUFBTTtBQUN6QixZQUFNLE9BQU8sV0FBVztBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLE1BQ0UsS0FBSyxTQUFTLG9CQUFvQixhQUM5QixHQUFHLEtBQUssUUFBUSxDQUFDLE1BQU0sS0FBSyxLQUM1QixHQUFHLEtBQUssUUFBUSxDQUFDO0FBQUEsTUFDekIsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLGdCQUFnQixRQUFRLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFDL0QsWUFBTSxXQUFXLFVBQVUsRUFBRSxLQUFLLHlCQUF5QixDQUFDO0FBQzVELGVBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVEsS0FBSztBQUMxQyxjQUFNLFFBQVEsSUFBSSxLQUFLLFFBQVEsU0FBUyxNQUFNLEtBQUssUUFBUSxZQUFZO0FBQ3ZFLGNBQU0sTUFBTSxVQUFVO0FBQUEsVUFDcEIsS0FBSywwREFBMEQsS0FBSztBQUFBLFFBQ3RFLENBQUM7QUFDRCxZQUFJLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGlCQUFTLFlBQVksR0FBRztBQUFBLE1BQzFCO0FBQ0EsV0FBSyxJQUFJLFlBQVksUUFBUTtBQUFBLElBQy9CO0FBSUEsU0FBSyxJQUFJLGFBQWEsRUFBRSxTQUFTLEtBQUssSUFBSSxzQkFBc0IsSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUFBLEVBQ25GO0FBQ0Y7QUFHQSxTQUFTLGFBQWEsT0FBZ0IsT0FBa0M7QUFDdEUsU0FDRSxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sV0FBVyxTQUFTLE1BQU0sTUFBTSxDQUFDLE1BQU0sT0FBTyxNQUFNLFFBQVE7QUFFOUY7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAibmV3TmFtZSIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiJdCn0K
