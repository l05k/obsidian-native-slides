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
    id: "ns-make-first-slide",
    name: "Make this note the first slide",
    callback: async () => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file) return;
      const converted = await plugin.deckService.makeFirstSlide(file);
      if (!converted) {
        new import_obsidian4.Notice("Native slides: this note already belongs to a deck");
        return;
      }
      new import_obsidian4.Notice("Native slides: made this note the first slide of a new deck");
      await plugin.enterSlidesForActive();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jYXBhY2l0eS50cyIsICJzcmMvY2FwYWNpdHktY29yZS50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVjay1zZXJ2aWNlLnRzIiwgInNyYy9kZWNrLnRzIiwgInNyYy9jcmVhdGVOZXh0LnRzIiwgInNyYy9kZWxldGVTbGlkZXMudHMiLCAic3JjL3BhbmVsLnRzIiwgInNyYy9jb25maXJtLWRlbGV0ZS50cyIsICJzcmMvc2V0dGluZ3MudHMiLCAic3JjL3V0aWxzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIG5hdGl2ZS1zbGlkZXMgXHUyMDE0IGEgXCJTbGlkZXMgbW9kZVwiIGZvciBPYnNpZGlhbiBkZWNrIG5vdGVzXG4gKlxuICogT25lIHJlc2VydmVkIGZyb250bWF0dGVyIGtleSwgYGRlY2tgIChhIHNpbmdsZSBtYXJrZG93biBsaW5rIHRvIHRoZSBuZXh0XG4gKiBzbGlkZSBcdTIwMTQgbmV4dC1vbmx5IHNlbWFudGljcywgbm8gb3ZlcnZpZXcgcGFnZSBzaW5jZSB2MS4wLjApLCBkcml2ZXNcbiAqIHByZXYvbmV4dCBuYXZpZ2F0aW9uIGFuZCBhdXRvLWNvbXB1dGVkIHBhZ2UgbnVtYmVycy4gQSBkZWNrIG5vdGUgY2FuIGJlXG4gKiBlbnRlcmVkIGludG8gKipTbGlkZXMgbW9kZSoqIFx1MjAxNCBhbiBpbW1lcnNpdmUsIGVkaXRhYmxlIChMaXZlIFByZXZpZXcpIHZpZXdcbiAqIHdpdGggYSBzbGlkZXMgYmFyIHNob3dpbmcgcHJvcGVydGllcywgbmF2aWdhdGlvbiBhbmQgdGhlIHBhZ2UgbnVtYmVyLlxuICpcbiAqIE5hdGl2ZSBPYnNpZGlhbiBtb2RlcyAoU291cmNlIC8gZGVmYXVsdCBMaXZlIFByZXZpZXcgLyBSZWFkaW5nIHZpZXcpIGFyZVxuICogbGVmdCBjb21wbGV0ZWx5IHVudG91Y2hlZDogbm8gc3RhdHVzLWJhciBoaWRpbmcsIG5vIHNsaWRlcyBiYXIsIG5vXG4gKiBmdWxsc2NyZWVuLCBubyBzdHlsaW5nLiBTbGlkZXMgbW9kZSBpcyB0aGUgcGx1Z2luJ3Mgb25seSBzdXJmYWNlLlxuICpcbiAqIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgYW5kIGEgdGhpbiBvcmNoZXN0cmF0aW9uIGxheWVyOyB0aGUgbG9naWNcbiAqIGxpdmVzIGluIGBzcmMvYDpcbiAqICAgLSBzcmMvdHlwZXMudHMgICAgICAgIHNldHRpbmdzIHNoYXBlICsgZGVmYXVsdHMgKyByZXNlcnZlZCBgZGVja2Aga2V5XG4gKiAgIC0gc3JjL21vZGUudHMgICAgICAgICB2aWV3IG1vZGUgLyBmcm9udG1hdHRlciBoZWxwZXJzIChwdXJlLCBgQXBwYC1iYXNlZClcbiAqICAgLSBzcmMvZGVjay1zZXJ2aWNlLnRzIGRlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiY3JlYXRlIG5leHQgc2xpZGVcIiBnbHVlXG4gKiAgIC0gc3JjL2Jhci50cyAgICAgICAgICBiYXIgRE9NIGhlbHBlcnMgKGNyZWF0ZSAvIGJ1dHRvbnMgLyB0YWItYmFyIG1lYXN1cmUpXG4gKiAgIC0gc3JjL3BhbmVsLnRzICAgICAgICBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICogICAtIHNyYy9jb21tYW5kcy50cyAgICAgY29tbWFuZCByZWdpc3RyYXRpb24gKGRldi1nYXRlZCBkZWJ1ZyBjb21tYW5kKVxuICogICAtIHNyYy9zZXR0aW5ncy50cyAgICAgc2V0dGluZ3MgdGFiXG4gKiAgIC0gc3JjL2RlYnVnLnRzICAgICAgICB0eXBvZ3JhcGh5IG1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSlcbiAqICAgLSBzcmMvZGVjay50cyAgICAgICAgIHB1cmUgZGVjayBjb3JlICh3aXRoIHNyYy9jcmVhdGVOZXh0LnRzKVxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlIH0gZnJvbSBcIi4vc3JjL2RlY2tcIjtcbmltcG9ydCB7IGFjdGl2ZUZyb250bWF0dGVyLCBjdXJyZW50TW9kZSwgZnJvbnRtYXR0ZXJPZiwgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL3NyYy9tb2RlXCI7XG5pbXBvcnQgeyBTbGlkZXNQYW5lbFZpZXcsIFNMSURFU19QQU5FTF9WSUVXIH0gZnJvbSBcIi4vc3JjL3BhbmVsXCI7XG5pbXBvcnQgeyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIH0gZnJvbSBcIi4vc3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBERUNLX0tFWSwgREVGQVVMVF9TRVRUSU5HUywgU0xJREVTX1RIRU1FUywgdHlwZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB9IGZyb20gXCIuL3NyYy90eXBlc1wiO1xuaW1wb3J0IHsgY2xlYXJDaGlsZHJlbiB9IGZyb20gXCIuL3NyYy91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXRpdmVTbGlkZXNQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAvKiogVGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKi9cbiAgYmFyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWUgKi9cbiAgZGVja1NlcnZpY2UhOiBEZWNrU2VydmljZTtcbiAgLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuICBzZXR0aW5nczogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7IC4uLkRFRkFVTFRfU0VUVElOR1MgfTtcblxuICAvKiogV2hldGhlciBTbGlkZXMgbW9kZSBpcyBjdXJyZW50bHkgYWN0aXZlIChzZXNzaW9uIHN0YXRlLCBub3QgcGVyc2lzdGVkKSAqL1xuICBwcml2YXRlIHNsaWRlc01vZGUgPSBmYWxzZTtcbiAgLyoqIFZpZXcgbW9kZSB0byByZXN0b3JlIHdoZW4gbGVhdmluZyBTbGlkZXMgbW9kZSAoXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiKSAqL1xuICBwcml2YXRlIGV4aXRNb2RlOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgPSBcInNvdXJjZVwiO1xuICAvKiogV2hldGhlciB0aGUgZXhpdCB2aWV3IHdhcyBTb3VyY2UgbW9kZSAodHJ1ZSkgdnMgTGl2ZSBQcmV2aWV3IChmYWxzZSkgKi9cbiAgcHJpdmF0ZSBleGl0U291cmNlID0gZmFsc2U7XG4gIC8qKiBMYXN0IG5vdGUgYXV0by1lbnRlcmVkIGludG8gU2xpZGVzIG1vZGUgKHByZXZlbnRzIHJlLWVudGVyaW5nIGFmdGVyIG1hbnVhbCBleGl0KSAqL1xuICBwcml2YXRlIGF1dG9FbnRlcmVkUGF0aCA9IFwiXCI7XG4gIC8qKiBMYXN0IHJlZnJlc2gga2V5IChcInBhdGh8bW9kZVwiKSB0byBhdm9pZCBwb2ludGxlc3MgcmUtcmVuZGVycyAqL1xuICBwcml2YXRlIGxhc3RLZXkgPSBcIlwiO1xuICAvKiogTGFzdCBtZWFzdXJlZCB0YWItYmFyIGhlaWdodCAocHgpIFx1MjAxNCBjYWNoZWQgd2hpbGUgdGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuICovXG4gIHByaXZhdGUgdGFiQmFySGVpZ2h0ID0gMDtcbiAgLyoqIFdoZXRoZXIgdGhlIG1vdXNlIHBvaW50ZXIgaXMgaGlkZGVuIGZvciBwcmVzZW50aW5nIChzZXNzaW9uIHN0YXRlKSAqL1xuICBwb2ludGVySGlkZGVuID0gZmFsc2U7XG5cbiAgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy5kZWNrU2VydmljZSA9IG5ldyBEZWNrU2VydmljZSh0aGlzLmFwcCk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAxLiBSZWZyZXNoIG9uIFwiY3VycmVudCBub3RlIC8gdmlldyBjaGFuZ2VkXCIgZXZlbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubWF5YmVBdXRvRW50ZXJTbGlkZXMoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZWZyZXNoKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIC8vIFJlZnJlc2ggd2hlbiB0aGUgbm90ZSBjb250ZW50IChpbmNsdWRpbmcgZnJvbnRtYXR0ZXIpIGNoYW5nZXMgLyBzYXZlc1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChmaWxlOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDIuIEZhbGxiYWNrIHRpbWVyOiBlZGl0XHUyMTk0cmVhZGluZyB0b2dnbGVzIG1heSBmaXJlIG5vIHN0YW5kYXJkIGV2ZW50IFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbChcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBjb25zdCBrZXkgPSBmaWxlID8gYCR7ZmlsZS5wYXRofXwke2N1cnJlbnRNb2RlKHRoaXMuYXBwKX1gIDogXCJcIjtcbiAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5sYXN0S2V5KSB7XG4gICAgICAgICAgdGhpcy5sYXN0S2V5ID0ga2V5O1xuICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMy4gQ29tbWFuZHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgcmVnaXN0ZXJDb21tYW5kcyh0aGlzKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzYi4gU2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgb3ZlcnZpZXcsIHJlcGxhY2VzIHRoZSBvbGQgb3ZlcnZpZXcgcGFnZSkgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoU0xJREVTX1BBTkVMX1ZJRVcsIChsZWFmKSA9PiBuZXcgU2xpZGVzUGFuZWxWaWV3KHRoaXMsIGxlYWYpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJwcmVzZW50YXRpb25cIiwgXCJTaG93IHNsaWRlcyBwYW5lbFwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMuYWN0aXZhdGVTbGlkZXNQYW5lbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDQuIFBpbiB0aGUgU2xpZGVzIGVkaXRvciB0byBvbmUgc2NyZWVuIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIENTUyBgb3ZlcmZsb3c6IGhpZGRlbmAgYmxvY2tzIHRoZSB3aGVlbCwgYnV0IG5hdGl2ZSBkcmFnLXNlbGVjdFxuICAgIC8vIGF1dG9zY3JvbGwgYW5kIENvZGVNaXJyb3IncyBwcm9ncmFtbWF0aWMgc2Nyb2xsSW50b1ZpZXcgc3RpbGwgbW92ZSB0aGVcbiAgICAvLyBzY3JvbGxlci4gVGhpcyBjYXB0dXJlLXBoYXNlIGxpc3RlbmVyIHJlc2V0cyBhbnkgc2Nyb2xsIGluc2lkZSB0aGVcbiAgICAvLyBhY3RpdmUgbWFya2Rvd24gdmlldyBiYWNrIHRvIHRoZSB0b3Agd2hpbGUgU2xpZGVzIG1vZGUgaXMgYWN0aXZlLlxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChcbiAgICAgIGRvY3VtZW50LFxuICAgICAgXCJzY3JvbGxcIixcbiAgICAgIChldnQpID0+IHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKCF2aWV3KSByZXR1cm47XG4gICAgICAgIGNvbnN0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdmlldy5jb250ZW50RWwuY29udGFpbnMoZWwpKSB7XG4gICAgICAgICAgaWYgKGVsLnNjcm9sbFRvcCAhPT0gMCkgZWwuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7IGNhcHR1cmU6IHRydWUgfSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDUuIEVzY2FwZSBrZXkgZXhpdHMgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCBcImtleWRvd25cIiwgKGV2dDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IFwiRXNjYXBlXCIgJiYgdGhpcy5zbGlkZXNNb2RlICYmIHRoaXMuc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMpIHtcbiAgICAgICAgdGhpcy5leGl0U2xpZGVzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNi4gQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIGFuZCBkbyB0aGUgZmlyc3QgcmVuZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMuYmFyID0gY3JlYXRlQmFyKCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmJhcik7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBvbnVubG9hZCgpOiB2b2lkIHtcbiAgICB0aGlzLmJhcj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5iYXIgPSBudWxsO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtYmxvY2staW1hZ2VzXCIpO1xuICAgIHRoaXMucmVtb3ZlVGhlbWVDbGFzc2VzKCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2V0dGluZ3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRhdGEgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSBhcyBQYXJ0aWFsPE5hdGl2ZVNsaWRlc1NldHRpbmdzPiB8IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGRhdGEgPz8ge30pO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBub3RlIGlzIGEgZGVjayBub3RlIChoYXMgYSBgZGVja2AgcHJvcGVydHkpICovXG4gIHByaXZhdGUgaXNEZWNrTm90ZShmaWxlOiBURmlsZSB8IG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiBmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgZXZlcnkgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtKmAgY2xhc3MgZnJvbSA8Ym9keT4gKi9cbiAgcHJpdmF0ZSByZW1vdmVUaGVtZUNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBjbHMgb2YgQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNsYXNzTGlzdCkpIHtcbiAgICAgIGlmIChjbHMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgc2luZ2xlIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgc2xpZGVzVGhlbWVgIHNldHRpbmcgXHUyMDE0IHRoZSBzdHlsZSB0ZW1wbGF0ZXMgaW4gc3R5bGVzLmNzcyBob29rIG9mZiBpdC5cbiAgICogVW5rbm93biBpZHMgKGUuZy4gYWZ0ZXIgYSBkb3duZ3JhZGUpIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB0aGVtZS5cbiAgICovXG4gIHByaXZhdGUgYXBwbHlUaGVtZUNsYXNzKCk6IHZvaWQge1xuICAgIGNvbnN0IGlkID0gU0xJREVTX1RIRU1FUy5zb21lKCh0KSA9PiB0LmlkID09PSB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1Muc2xpZGVzVGhlbWU7XG4gICAgY29uc3QgY2xzID0gYG5hdGl2ZS1zbGlkZXMtdGhlbWUtJHtpZH1gO1xuICAgIGZvciAoY29uc3QgYyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpICYmIGMgIT09IGNscykgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaGlkaW5nIHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIGZvciBwcmVzZW50aW5nLiBIaWRpbmcgYWxzb1xuICAgKiBwYXJrcyBmb2N1cyAoYmx1cnMgdGhlIGVkaXRvciwgc28gdGhlIGNhcmV0IGRpc2FwcGVhcnMpOyBzaG93aW5nIGxlYXZlc1xuICAgKiBmb2N1cyBwYXJrZWQgXHUyMDE0IGNsaWNrIHNsaWRlIGNvbnRlbnQgdG8gcmVzdW1lIGVkaXRpbmcuXG4gICAqL1xuICB0b2dnbGVQb2ludGVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9pbnRlckhpZGRlbiA9ICF0aGlzLnBvaW50ZXJIaWRkZW47XG4gICAgaWYgKHRoaXMucG9pbnRlckhpZGRlbikge1xuICAgICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuYCBib2R5IGNsYXNzIGluIHN5bmMgd2l0aCB0aGVcbiAgICogcHJlc2VudGluZyBzdGF0ZSBcdTIwMTQgc3R5bGVzLmNzcyB0dXJucyBldmVyeSBjdXJzb3IgaW52aXNpYmxlIHdoaWxlIHNldC5cbiAgICogTGVhdmluZyBTbGlkZXMgbW9kZSBhbHdheXMgcmVzdG9yZXMgdGhlIHBvaW50ZXIuXG4gICAqL1xuICBwcml2YXRlIHN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwibmF0aXZlLXNsaWRlcy1wb2ludGVyLWhpZGRlblwiLCBzbGlkZXMgJiYgdGhpcy5wb2ludGVySGlkZGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBgbmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNgIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgaW1hZ2VMYXlvdXRgIHNldHRpbmcgXHUyMDE0IHN0eWxlcy5jc3MncyBpbWFnZS1sYXlvdXQgcnVsZXMgaG9vayBvZmYgaXQuXG4gICAqIFRoZSBjbGFzcyBpcyBvbmx5IG1lYW5pbmdmdWwgaW4gU2xpZGVzIG1vZGUuXG4gICAqL1xuICBwcml2YXRlIHN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlczogYm9vbGVhbik6IHZvaWQge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgIFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIixcbiAgICAgIHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLmltYWdlTGF5b3V0LFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjYXJkIHRpdGxlIHBlciB0aGUgYHNsaWRlc1RpdGxlYCBzZXR0aW5nLiBcImZpbGVuYW1lXCIgcmVzdHlsZXNcbiAgICogdGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZSAoc3RpbGwgZWRpdGFibGUgXHUyMDE0IHR5cGluZ1xuICAgKiByZW5hbWVzIHRoZSBub3RlKTsgXCJcIiBzaG93cyBub3RoaW5nOyBhbnkgb3RoZXIgdmFsdWUgbmFtZXMgYSBmcm9udG1hdHRlclxuICAgKiBwcm9wZXJ0eSByZW5kZXJlZCByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudC5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgY29udGVudCA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICAgIGlmICghY29udGVudCB8fCAhZmlsZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3JjID0gdGhpcy5zZXR0aW5ncy5zbGlkZXNUaXRsZS50cmltKCk7XG5cbiAgICAvLyBcImZpbGVuYW1lXCI6IHJlc3R5bGUgdGhlIG5hdGl2ZSAuaW5saW5lLXRpdGxlIGludG8gdGhlIGNhcmQgdGl0bGUuIEl0XG4gICAgLy8gc3RheXMgY29udGVudGVkaXRhYmxlLCBzbyBlZGl0aW5nIGl0IHJlbmFtZXMgdGhlIG5vdGUgYXMgaW4gTGl2ZVxuICAgIC8vIFByZXZpZXcuIFRoZSBuYXRpdmUgaW5saW5lIHRpdGxlIGxpdmVzIG9uIHRoZSBtYXJrZG93bi1zb3VyY2Utdmlld1xuICAgIC8vIGVsZW1lbnQgKGEgc2libGluZyBicmFuY2ggb2YgdGhlIGNhcmQpLCBzbyB0aGUgc3R5bGluZyBob29rIGlzIGFcbiAgICAvLyB2aWV3IGF0dHJpYnV0ZSArIGEgYnJhbmQtbmV3IC5jbS1jb250ZW50IGF0dHJpYnV0ZSB0aGF0IHJlc2VydmVzIHRoZVxuICAgIC8vIHRpdGxlJ3MgaGVpZ2h0IHRoZSBzYW1lIHdheSB0aGUgcHNldWRvLWVsZW1lbnQgdmVyc2lvbiBkaWQuXG4gICAgY29uc3QgbmF0aXZlVGl0bGUgPSBzbGlkZXMgJiYgc3JjID09PSBcImZpbGVuYW1lXCI7XG4gICAgY29uc3Qgc291cmNlVmlldyA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1zb3VyY2Utdmlld1wiKTtcbiAgICBpZiAobmF0aXZlVGl0bGUgJiYgc291cmNlVmlldykgc291cmNlVmlldy5zZXRBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiLCBcImZpbGVuYW1lXCIpO1xuICAgIGVsc2Ugc291cmNlVmlldz8ucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1ucy1pbmxpbmUtdGl0bGVcIik7XG4gICAgY29udGVudC50b2dnbGVBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZS1uYXRpdmVcIiwgbmF0aXZlVGl0bGUpO1xuXG4gICAgLy8gUHJvcGVydHktYmFja2VkIHRpdGxlcyByZW5kZXIgcmVhZC1vbmx5IHZpYSB0aGUgOjpiZWZvcmUgcHNldWRvLWVsZW1lbnRcbiAgICAvLyAobm8gZWRpdGluZyBzdXJmYWNlIFx1MjAxNCB0aGUgcHJvcGVydGllcyBwYW5lbCBpcyBoaWRkZW4gaW4gU2xpZGVzIG1vZGUpLlxuICAgIGxldCB0ZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBpZiAoc2xpZGVzICYmIHNyYyAmJiBzcmMgIT09IFwiZmlsZW5hbWVcIikge1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICAgIGNvbnN0IHYgPSBmbT8uW3NyY107XG4gICAgICBpZiAodiAhPSBudWxsKSB0ZXh0ID0gZm9ybWF0VmFsdWUodik7XG4gICAgfVxuXG4gICAgaWYgKHRleHQpIGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIiwgdGV4dCk7XG4gICAgZWxzZSBjb250ZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpO1xuICB9XG5cbiAgLyoqIEVudGVyIFNsaWRlcyBtb2RlOiByZWNvcmQgdGhlIGV4aXQgc3RhdGUgYW5kIGZvcmNlIHRoZSBMaXZlIFByZXZpZXcgKi9cbiAgcHJpdmF0ZSBhc3luYyBlbnRlclNsaWRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAodmlldykge1xuICAgICAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBtb2RlPzogc3RyaW5nOyBzb3VyY2U/OiBib29sZWFuIH07XG4gICAgICB0aGlzLmV4aXRNb2RlID0gc3RhdGUubW9kZSA9PT0gXCJwcmV2aWV3XCIgPyBcInByZXZpZXdcIiA6IFwic291cmNlXCI7XG4gICAgICB0aGlzLmV4aXRTb3VyY2UgPSBzdGF0ZS5zb3VyY2UgPT09IHRydWU7XG4gICAgICAvLyBTbGlkZXMgbW9kZSBpcyBhbHdheXMgdGhlIGVkaXRhYmxlIExpdmUgUHJldmlld1xuICAgICAgY29uc3QgbmV4dCA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIG5leHQuc3RhdGUgPSB7IC4uLm5leHQuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogZmFsc2UgfTtcbiAgICAgIGF3YWl0IHZpZXcubGVhZi5zZXRWaWV3U3RhdGUobmV4dCwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMuc2xpZGVzTW9kZSA9IHRydWU7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgLy8gUGluIHRoZSBzY3JvbGxlciB0byB0aGUgdG9wIGJlZm9yZSBhbnkgZnJhbWUgcmVuZGVyczogdGhlIHZpZXctc3RhdGVcbiAgICAvLyBjaGFuZ2UgYWJvdmUgbWF5IHJlc3RvcmUgaXQgdG8gdGhlIHNhdmVkIGN1cnNvciBsaW5lIHdpdGhvdXQgZmlyaW5nIGFcbiAgICAvLyBzY3JvbGwgZXZlbnQgYWZ0ZXJ3YXJkcywgc28gdGhlIGNhcHR1cmUtcGhhc2UgcmVzZXQgYmVsb3cgd291bGQgbmV2ZXJcbiAgICAvLyBydW4gYW5kIGEgbG9uZyBub3RlIHdvdWxkIG9wZW4gbWlkLWRvY3VtZW50LlxuICAgIGZvciAoY29uc3QgZWwgb2Ygdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNtLXNjcm9sbGVyXCIpID8/IFtdKSB7XG4gICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgaWYgKGVsLnNjcm9sbExlZnQgIT09IDApIGVsLnNjcm9sbExlZnQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFeGl0IFNsaWRlcyBtb2RlOiByZXN0b3JlIHRoZSB2aWV3IG1vZGUgcmVjb3JkZWQgYXQgZW50cnkgKi9cbiAgcHJpdmF0ZSBleGl0U2xpZGVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIGlmICh0aGlzLmV4aXRNb2RlID09PSBcInByZXZpZXdcIikge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwicHJldmlld1wiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogdGhpcy5leGl0U291cmNlIH07XG4gICAgICB9XG4gICAgICB2b2lkIHZpZXcubGVhZi5zZXRWaWV3U3RhdGUoc3RhdGUsIHsgZm9jdXM6IGZhbHNlIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgU2xpZGVzIG1vZGUgKGRlY2sgbm90ZXMgb25seSBcdTIwMTQgZW5mb3JjZWQgYnkgdGhlIGNvbW1hbmQpICovXG4gIHRvZ2dsZVNsaWRlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlKSB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICBlbHNlIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgZm9yIHRoZSBhY3RpdmUgbm90ZSBvbmNlIGl0IGhhcyBiZWNvbWUgYSBkZWNrXG4gICAqIG5vdGUgXHUyMDE0IHVzZWQgYWZ0ZXIgYSBjb21tYW5kIHByb21vdGVzIGEgcGxhaW4gbm90ZSBpbnRvIGEgZGVjayAoZS5nLlxuICAgKiBcIk1ha2UgdGhpcyBub3RlIHRoZSBmaXJzdCBzbGlkZVwiKS4gTm8tb3Agd2hpbGUgU2xpZGVzIG1vZGUgaXMgYWxyZWFkeVxuICAgKiBhY3RpdmUgb3IgdGhlIGFjdGl2ZSBub3RlIGlzIG5vdCAoeWV0KSBhIGRlY2sgbm90ZS5cbiAgICovXG4gIGFzeW5jIGVudGVyU2xpZGVzRm9yQWN0aXZlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHJldHVybjtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUgfHwgIXRoaXMuaXNEZWNrTm90ZShmaWxlKSkgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgfVxuXG4gIC8qKiBSZXZlYWwgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsLCBjcmVhdGluZyBpdCBpbiB0aGUgcmlnaHQgc2lkZWJhciBpZiBuZWVkZWQgKi9cbiAgYXN5bmMgYWN0aXZhdGVTbGlkZXNQYW5lbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoU0xJREVTX1BBTkVMX1ZJRVcpO1xuICAgIGlmIChleGlzdGluZy5sZW5ndGggPiAwKSB7XG4gICAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihleGlzdGluZ1swXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKTtcbiAgICBpZiAoIWxlYWYpIHJldHVybjtcbiAgICBhd2FpdCBsZWFmLnNldFZpZXdTdGF0ZSh7IHR5cGU6IFNMSURFU19QQU5FTF9WSUVXLCBhY3RpdmU6IHRydWUgfSk7XG4gICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gIH1cblxuICAvKiogQXV0by1lbnRlciBTbGlkZXMgbW9kZSBvbmNlIHBlciBvcGVuZWQgZGVjayBub3RlIHdoZW4gdGhlIHNldHRpbmcgaXMgb24gKi9cbiAgcHJpdmF0ZSBtYXliZUF1dG9FbnRlclNsaWRlcygpOiB2b2lkIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUgfHwgZmlsZS5wYXRoID09PSB0aGlzLmF1dG9FbnRlcmVkUGF0aCkgcmV0dXJuO1xuICAgIHRoaXMuYXV0b0VudGVyZWRQYXRoID0gZmlsZS5wYXRoO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcyAmJiB0aGlzLmlzRGVja05vdGUoZmlsZSkgJiYgIXRoaXMuc2xpZGVzTW9kZSkge1xuICAgICAgdm9pZCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFBQVCBuYXZpZ2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gIC8qKiBNb3ZlIG9uZSBzdGVwIGJhY2svZm9yd2FyZCBhbG9uZyB0aGUgZGVjayBjaGFpbiAoZW50ZXJpbmcgU2xpZGVzIG1vZGUgYXMgbmVlZGVkKSAqL1xuICBhc3luYyBuYXZpZ2F0ZShkaXJlY3Rpb246IFwicHJldlwiIHwgXCJuZXh0XCIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGlmICghZGVjaykgcmV0dXJuO1xuICAgIGNvbnN0IHRhcmdldCA9IGRlY2suY2hhaW5bZGlyZWN0aW9uID09PSBcInByZXZcIiA/IGRlY2suaW5kZXggLSAxIDogZGVjay5pbmRleCArIDFdO1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG4gICAgaWYgKCF0aGlzLnNsaWRlc01vZGUpIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB2b2lkIHRoaXMuYXBwLndvcmtzcGFjZS5vcGVuTGlua1RleHQodGFyZ2V0LCBmaWxlLnBhdGgpO1xuICB9XG5cbiAgLyoqIEp1bXAgdG8gYSBzcGVjaWZpYyBpbmRleCBpbiB0aGUgZGVjayBjaGFpbiAocHJvZ3Jlc3MgYmFyIGNsaWNrKSAqL1xuICBhc3luYyBqdW1wVG8oaW5kZXg6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgaWYgKCFkZWNrIHx8IGluZGV4IDwgMCB8fCBpbmRleCA+PSBkZWNrLmNoYWluLmxlbmd0aCB8fCBpbmRleCA9PT0gZGVjay5pbmRleCkgcmV0dXJuO1xuICAgIGNvbnN0IHRhcmdldCA9IGRlY2suY2hhaW5baW5kZXhdO1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG4gICAgaWYgKCF0aGlzLnNsaWRlc01vZGUpIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB2b2lkIHRoaXMuYXBwLndvcmtzcGFjZS5vcGVuTGlua1RleHQodGFyZ2V0LCBmaWxlLnBhdGgpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEJhciByZW5kZXJpbmcgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqXG4gICAqIEdldCBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIHRoZSBiYXIgcHJvcGVydGllcy4gUmV0dXJucyBhbiBhcnJheSBvZlxuICAgKiBwZXJjZW50YWdlcyAoc3VtbWluZyB0byAxMDApIGZvciBlYWNoIHByb3BlcnR5LiBMb2FkcyBmcm9tIHNldHRpbmdzIG9yXG4gICAqIGRlZmF1bHRzIHRvIGVxdWFsIGRpc3RyaWJ1dGlvbi5cbiAgICovXG4gIHByaXZhdGUgZ2V0QmFyUHJvcGVydHlXaWR0aHMoY291bnQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RvcmVkID0gSlNPTi5wYXJzZSh0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzIHx8IFwiW11cIikgYXMgdW5rbm93bjtcbiAgICAgIGlmIChpc051bWJlckxpc3Qoc3RvcmVkLCBjb3VudCkpIHJldHVybiBzdG9yZWQ7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmVcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBBcnJheTxudW1iZXI+KGNvdW50KS5maWxsKDEwMCAvIGNvdW50KTtcbiAgfVxuXG4gIC8qKiBTYXZlIGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyB0byBzZXR0aW5ncyAqL1xuICBwcml2YXRlIGFzeW5jIHNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHM6IG51bWJlcltdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0eVdpZHRocyA9IEpTT04uc3RyaW5naWZ5KHdpZHRocyk7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIC8qKiBEZWNpZGUgd2hhdCB0aGUgc2xpZGVzIGJhciBzaG93cywgdGhlbiByZS1yZW5kZXIgaXQgKi9cbiAgcmVmcmVzaCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYmFyKSByZXR1cm47XG4gICAgdGhpcy5hcHBseVRoZW1lQ2xhc3MoKTtcblxuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IG1vZGUgPSBjdXJyZW50TW9kZSh0aGlzLmFwcCk7XG4gICAgY29uc3QgaXNDYXJkID0gdGhpcy5pc0RlY2tOb3RlKGZpbGUpO1xuICAgIGNvbnN0IGxpdmVQcmV2aWV3Tm93ID0gbW9kZSA9PT0gXCJzb3VyY2VcIiAmJiBpc0xpdmVQcmV2aWV3KHRoaXMuYXBwKTtcblxuICAgIC8vIExlYXZpbmcgYSBkZWNrIG5vdGUsIG9yIGxlYXZpbmcgdGhlIExpdmUgUHJldmlldyAoZS5nLiBDbWQvQ3RybCtFIHRvXG4gICAgLy8gcmVhZGluZyB2aWV3KSwgZW5kcyBTbGlkZXMgbW9kZSBcdTIwMTQgb25seSB0aGUgdG9nZ2xlIGNvbW1hbmQgcmUtZW50ZXJzIGl0LlxuICAgIGlmICh0aGlzLnNsaWRlc01vZGUgJiYgKCFpc0NhcmQgfHwgIWxpdmVQcmV2aWV3Tm93KSkge1xuICAgICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gTWVhc3VyZSB0aGUgdGFiIGJhciB3aGlsZSBpdCBpcyBzdGlsbCB2aXNpYmxlIChTbGlkZXMgbW9kZSBoaWRlcyBpdFxuICAgIC8vIGJlbG93OyB0aGUgbGFzdCBtZWFzdXJlZCB2YWx1ZSBpcyByZXVzZWQgb25jZSBoaWRkZW4pLlxuICAgIHRoaXMudGFiQmFySGVpZ2h0ID0gc3luY1RhYkJhckhlaWdodCh0aGlzLnRhYkJhckhlaWdodCk7XG5cbiAgICAvLyBTbGlkZXMgbW9kZSBpcyBhY3RpdmUgb25seSB3aGlsZSBhY3R1YWxseSBpbiB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgY29uc3Qgc2xpZGVzID0gdGhpcy5zbGlkZXNNb2RlICYmIGlzQ2FyZCAmJiBsaXZlUHJldmlld05vdztcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIiwgc2xpZGVzKTtcbiAgICBpZiAoIXNsaWRlcykgdGhpcy5wb2ludGVySGlkZGVuID0gZmFsc2U7IC8vIGxlYXZpbmcgU2xpZGVzIHJlc3RvcmVzIHRoZSBwb2ludGVyXG4gICAgdGhpcy5zeW5jUG9pbnRlckNsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy5zeW5jSW1hZ2VMYXlvdXRDbGFzcyhzbGlkZXMpO1xuICAgIHRoaXMudXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzKTtcblxuICAgIGNvbnN0IGJhclZpc2libGUgPSBzbGlkZXMgJiYgdGhpcy5zZXR0aW5ncy5zaG93U2xpZGVzQmFyICYmICF0aGlzLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAvLyBXaGVuIGJhciBpcyBoaWRkZW4sIHNldCBib3R0b20gcGFkZGluZyB0byAwIHNvIHRoZSBjYXJkIGZpbGxzIHRoZSBmdWxsXG4gICAgLy8gd2luZG93IGhlaWdodC4gV2hlbiB2aXNpYmxlLCByZW1vdmUgdGhlIG92ZXJyaWRlIHNvIENTUyBmYWxscyBiYWNrIHRvXG4gICAgLy8gLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQgKGNsZWFycyB0aGUgYmFyIGFzIGJlZm9yZSkuXG4gICAgaWYgKGJhclZpc2libGUpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCI6IFwiMHB4XCIgfSk7XG4gICAgfVxuICAgIGlmICghYmFyVmlzaWJsZSkge1xuICAgICAgdGhpcy5iYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZmlsZSkgcmV0dXJuOyAvLyBiYXJWaXNpYmxlIGltcGxpZXMgYSBmaWxlLCBidXQgbmFycm93IGZvciBUeXBlU2NyaXB0XG5cbiAgICBjb25zdCBmbSA9IGFjdGl2ZUZyb250bWF0dGVyKHRoaXMuYXBwKTtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrU2VydmljZS5jb21wdXRlKGZpbGUpO1xuICAgIGNsZWFyQ2hpbGRyZW4odGhpcy5iYXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExlZnQ6IHByZXZpb3VzIC8gbmV4dCBidXR0b25zIChib3RoIGFsd2F5cyBzaG93biBpbnNpZGUgYSBkZWNrO1xuICAgIC8vICAgICAgICB0aGUgb25lIHRoYXQgY2Fubm90IG1vdmUgaXMgZGlzYWJsZWQgLyBsaWdodCBncmF5KSBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyAmJiBkZWNrKSB7XG4gICAgICBjb25zdCBoYXNQcmV2ID0gZGVjay5pbmRleCA+IDA7XG4gICAgICBjb25zdCBoYXNOZXh0ID0gZGVjay5pbmRleCA8IGRlY2suY2hhaW4ubGVuZ3RoIC0gMTtcbiAgICAgIGNvbnN0IG5hdiA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdlwiIH0pO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVDMFwiLCBcIlByZXZpb3VzIHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwicHJldlwiKSwgIWhhc1ByZXYpKTtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QjZcIiwgXCJOZXh0IHBhZ2VcIiwgKCkgPT4gdm9pZCB0aGlzLm5hdmlnYXRlKFwibmV4dFwiKSwgIWhhc05leHQpKTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKG5hdik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1pZGRsZTogY29uZmlndXJlZCBwcm9wZXJ0eSBjb2x1bW5zIHdpdGggZHJhZ2dhYmxlIGRpdmlkZXJzIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHByb3BOYW1lcyA9IHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydGllc1xuICAgICAgLnNwbGl0KFwiLFwiKVxuICAgICAgLm1hcCgocykgPT4gcy50cmltKCkpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgaWYgKHByb3BOYW1lcy5sZW5ndGggPiAwICYmIGZtKSB7XG4gICAgICBjb25zdCBlbnRyaWVzOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBwcm9wTmFtZXMpIHtcbiAgICAgICAgaWYgKG5hbWUgaW4gZm0pIHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBmbVtuYW1lXTtcbiAgICAgICAgICBpZiAodmFsICE9IG51bGwpIGVudHJpZXMucHVzaChbbmFtZSwgZm9ybWF0VmFsdWUodmFsKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3BlcnRpZXNcIiB9KTtcblxuICAgICAgICBjb25zdCB3aWR0aHMgPSB0aGlzLmdldEJhclByb3BlcnR5V2lkdGhzKGVudHJpZXMubGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBbLCB2YWx1ZV0gPSBlbnRyaWVzW2ldO1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLCB0ZXh0OiB2YWx1ZSB9KTtcbiAgICAgICAgICBpdGVtLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7d2lkdGhzW2ldfSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG5cbiAgICAgICAgICBpZiAoaSA8IGVudHJpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgY29uc3QgZGl2aWRlciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1kaXZpZGVyXCIgfSk7XG4gICAgICAgICAgICBkaXZpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBjb25zdCBzdGFydFggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICBjb25zdCBpbml0aWFsV2lkdGhzID0gWy4uLndpZHRoc107XG4gICAgICAgICAgICAgIGNvbnN0IG9uTW92ZSA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gKChldi5jbGllbnRYIC0gc3RhcnRYKSAvIGNvbnRhaW5lcldpZHRoKSAqIDEwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdMZWZ0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpXSArIGRlbHRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdSaWdodCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaSArIDFdIC0gZGVsdGEpO1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpXSA9IG5ld0xlZnQ7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2kgKyAxXSA9IG5ld1JpZ2h0O1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICAgICAgICAgICAgXCIubmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld0xlZnR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2kgKyAxXS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke25ld1JpZ2h0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgY29uc3Qgb25VcCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRDc3NTdHlsZXMoeyBjdXJzb3I6IFwiXCIsIHVzZXJTZWxlY3Q6IFwiXCIgfSk7XG4gICAgICAgICAgICAgICAgdm9pZCB0aGlzLnNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHMpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJjb2wtcmVzaXplXCIsIHVzZXJTZWxlY3Q6IFwibm9uZVwiIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2aWRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBCcm9rZW4gZGVjayBsaW5rcyBcdTIxOTIgd2FybmluZyBjaGlwIHNvIGRlY2sgYXV0aG9ycyBzcG90IHR5cG9zXG4gICAgY29uc3QgYnJva2VuID0gZmlsZSA/IHRoaXMuZGVja1NlcnZpY2UuYnJva2VuKGZpbGUpIDogW107XG4gICAgaWYgKGJyb2tlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB3YXJuID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXdhcm5cIixcbiAgICAgICAgdGV4dDogXCJcdTI2QTAgXCIgKyBicm9rZW4uam9pbihcIiwgXCIpLFxuICAgICAgICBhdHRyOiB7IHRpdGxlOiBcIkJyb2tlbiBkZWNrIGxpbmsocykgXHUyMDE0IHRoZSB0YXJnZXQgbm90ZSBkb2VzIG5vdCBleGlzdFwiIH0sXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHdhcm4pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBCb3R0b20tcmlnaHQ6IGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXIgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlICE9PSBcIm5vbmVcIiAmJiBkZWNrKSB7XG4gICAgICAvLyB2MS4wLjAgbmV4dC1vbmx5IHNlbWFudGljczogY2hhaW5bMF0gaXMgdGhlIGhlYWQgc2xpZGUgPSBwYWdlIDE7XG4gICAgICAvLyB0b3RhbCBpcyB0aGUgZnVsbCBjaGFpbiBsZW5ndGguXG4gICAgICBjb25zdCB0b3RhbCA9IGRlY2suY2hhaW4ubGVuZ3RoO1xuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYWdlXCIsXG4gICAgICAgIHRleHQ6XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPT09IFwiZnJhY3Rpb25cIlxuICAgICAgICAgICAgPyBgJHtkZWNrLmluZGV4ICsgMX0gLyAke3RvdGFsfWBcbiAgICAgICAgICAgIDogYCR7ZGVjay5pbmRleCArIDF9YCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocGFnZSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFByb2dyZXNzIGluZGljYXRvcjogZGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IGJhciB0b3AgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd1Byb2dyZXNzICYmIGRlY2sgJiYgZGVjay5jaGFpbi5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBwcm9ncmVzcyA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXByb2dyZXNzXCIgfSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlY2suY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBpIDwgZGVjay5pbmRleCA/IFwicGFzdFwiIDogaSA9PT0gZGVjay5pbmRleCA/IFwiY3VycmVudFwiIDogXCJmdXR1cmVcIjtcbiAgICAgICAgY29uc3Qgc2VnID0gY3JlYXRlRGl2KHtcbiAgICAgICAgICBjbHM6IGBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZyBuYXRpdmUtc2xpZGVzLXByb2dyZXNzLXNlZy0tJHtzdGF0ZX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB2b2lkIHRoaXMuanVtcFRvKGkpKTtcbiAgICAgICAgcHJvZ3Jlc3MuYXBwZW5kQ2hpbGQoc2VnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHRoZSBzbGlkZXMgYmFyIGVudGlyZWx5IHdoZW4gaXQgaGFzIG5vdGhpbmcgdG8gZGlzcGxheSAobm8gcHJvcGVydGllcyxcbiAgICAvLyBhbmQgbm90IHBhcnQgb2YgYSBkZWNrKVxuICAgIHRoaXMuYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IHRoaXMuYmFyLmNoaWxkRWxlbWVudENvdW50ID09PSAwID8gXCJub25lXCIgOiBcIlwiIH0pO1xuICB9XG59XG5cbi8qKiBXaGV0aGVyIGB2YWx1ZWAgaXMgYW4gYXJyYXkgb2YgZXhhY3RseSBgY291bnRgIG51bWJlcnMgKHN0b3JlZCBiYXIgd2lkdGhzKS4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyTGlzdCh2YWx1ZTogdW5rbm93biwgY291bnQ6IG51bWJlcik6IHZhbHVlIGlzIG51bWJlcltdIHtcbiAgcmV0dXJuIChcbiAgICBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IGNvdW50ICYmIHZhbHVlLmV2ZXJ5KChuKSA9PiB0eXBlb2YgbiA9PT0gXCJudW1iZXJcIilcbiAgKTtcbn1cbiIsICIvKiogQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50IChoaWRkZW4gdW50aWwgcmVmcmVzaCgpIHNob3dzIGl0KSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhcigpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGJhciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhclwiIH0pO1xuICBiYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gIGJhci50aXRsZSA9IFwiQ2xpY2sgdG8gcGFyayB0aGUgbW91c2UgXHUyMDE0IGhpZGVzIHRoZSBlZGl0b3IgY2FyZXQgd2hpbGUgcHJlc2VudGluZ1wiO1xuICAvLyBQcmVzZW50YXRpb24gcGFya2luZzogY2xpY2tpbmcgdGhlIGJhciBrZWVwcyBmb2N1cyBvdXQgb2YgdGhlIGVkaXRvciBzb1xuICAvLyB0aGUgYmxpbmtpbmcgY2FyZXQgZGlzYXBwZWFycy4gcHJldmVudERlZmF1bHQgc3RvcHMgdGhlIGNsaWNrIGZyb20gbW92aW5nXG4gIC8vIGZvY3VzIG9yIHN0YXJ0aW5nIGEgdGV4dCBzZWxlY3Rpb247IGJ1dHRvbnMgc3RpbGwgcmVjZWl2ZSB0aGVpciBjbGljayBldmVudC5cbiAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBpZiAoYWN0aXZlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgYWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KSBhY3RpdmUuYmx1cigpO1xuICB9KTtcbiAgcmV0dXJuIGJhcjtcbn1cblxuLyoqIEJ1aWxkIGEgXHUyNUMwIC8gXHUyNUI2IG5hdmlnYXRpb24gYnV0dG9uOyBgZGlzYWJsZWRgIHJlbmRlcnMgaXQgbGlnaHQgZ3JheS9pbmFjdGl2ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hdkJ1dHRvbihcbiAgbGFiZWw6IHN0cmluZyxcbiAgdGlwOiBzdHJpbmcsXG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQsXG4gIGRpc2FibGVkID0gZmFsc2UsXG4pOiBIVE1MQnV0dG9uRWxlbWVudCB7XG4gIGNvbnN0IGJ0biA9IGNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1uYXYtYnRuXCIsXG4gICAgdGV4dDogbGFiZWwsXG4gICAgYXR0cjogeyB0aXRsZTogdGlwIH0sXG4gIH0pO1xuICBidG4uZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgaWYgKCFkaXNhYmxlZCkgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSB0b3AgdGFiIGJhciBhbmQgZXhwb3NlIGl0cyBoZWlnaHQgYXMgdGhlIENTUyB2YXJpYWJsZVxuICogLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQsIHJldHVybmluZyB0aGUgKHBvc3NpYmx5IHVwZGF0ZWQpIGNhY2hlZFxuICogdmFsdWUuIFRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSwgc28gdGhlIGxhc3QgbWVhc3VyZWRcbiAqIHZhbHVlIGlzIHJldXNlZCB0aGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bmNUYWJCYXJIZWlnaHQoY2FjaGVkOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCB0YWJCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICBcIi53b3Jrc3BhY2UtdGFicy5tb2QtdG9wIC53b3Jrc3BhY2UtdGFiLWhlYWRlci1jb250YWluZXJcIixcbiAgKTtcbiAgaWYgKHRhYkJhciAmJiB0YWJCYXIub2Zmc2V0SGVpZ2h0ID4gMCkgY2FjaGVkID0gdGFiQmFyLm9mZnNldEhlaWdodDtcbiAgaWYgKGNhY2hlZCA+IDApIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0XCI6IGAke2NhY2hlZH1weGAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm8gbWVhc3VyZW1lbnQgeWV0ICh0YWIgYmFyIGhpZGRlbiBzaW5jZSBsb2FkKSBcdTIwMTQgbGV0IHRoZSBDU1MgZmFsbGJhY2sgYXBwbHkuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIik7XG4gIH1cbiAgcmV0dXJuIGNhY2hlZDtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjb21wdXRlQ2FwYWNpdHksIGZvcm1hdENhcGFjaXR5LCBwcm9tcHRMb2NhbGUsIHR5cGUgU2xpZGVNZXRyaWNzIH0gZnJvbSBcIi4vY2FwYWNpdHktY29yZVwiO1xuXG4vKipcbiAqIGNhcGFjaXR5LnRzIFx1MjAxNCBvbmUtc2NyZWVuIGNhcGFjaXR5IG1lYXN1cmVtZW50IGZvciB0aGUgYWN0aXZlIFNsaWRlcyBub3RlLlxuICpcbiAqIFRoZSBcIkNvcHkgc2xpZGUgY2FwYWNpdHlcIiBjb21tYW5kIG1lYXN1cmVzIHRoZSBsaXZlIFNsaWRlcyBsYXlvdXQgb2YgdGhlXG4gKiBjdXJyZW50IG5vdGUgKHRoZSBvbmx5IGxheW91dCB0aGF0IG1hdHRlcnM6IGEgbmV3IHNsaWRlIG11c3QgZml0IGludG8gdGhlXG4gKiBzYW1lIHNjcmVlbikgYW5kIGZvcm1hdHMgdGhlIG51bWJlcnMgaW50byBhbiBBSS1yZWFkeSBwcm9tcHQ6XG4gKlxuICogICAtIHRoZSBzY3JlZW4gLyB0ZXh0LWFyZWEgZGltZW5zaW9ucyAoYmFyIGhlaWdodCwgdGl0bGUgcmVzZXJ2ZSwgcGFkZGluZ3NcbiAqICAgICBhcmUgcmVhZCBmcm9tIHRoZSBsaXZlIGNvbXB1dGVkIHN0eWxlcywgc28gXCJvbmUgc2NyZWVuXCIgYWx3YXlzIG1hdGNoZXNcbiAqICAgICBleGFjdGx5IHdoYXQgdGhlIHZpZXdlciBzZWVzKSxcbiAqICAgLSB0aGUgbGluZSBib3ggb2YgZXZlcnkgZWxlbWVudCB0eXBlIFx1MjAxNCBtZWFzdXJlZCBmaXJzdCAodGhlIGN1cnJlbnQgc2xpZGVcbiAqICAgICBpcyBhbHJlYWR5IG9uIHNjcmVlbiksIHRoZW4gZGVyaXZlZCBmcm9tIHRoZSBwaW5uZWQgU2xpZGVzIHR5cG9ncmFwaHlcbiAqICAgICB2YXJpYWJsZXMgKHN0eWxlcy5jc3MgXHUwMEE3OSBzZXRzIC0taDEtc2l6ZS8tLWgxLWxpbmUtaGVpZ2h0Ly0tcC1zcGFjaW5nL1x1MjAyNlxuICogICAgIG9uIHRoZSBzaXplcjsgY29kZSBibG9ja3MgYXJlIDFyZW0vMS41KSB3aGVuIHRoZSBub3RlIGhhcyBubyBpbnN0YW5jZVxuICogICAgIG9mIHRoYXQgdHlwZSxcbiAqICAgLSBjaGFycy1wZXItbGluZSBmb3IgbGF0aW4gYW5kIENKSyB2aWEgY2FudmFzIG1lYXN1cmVUZXh0LlxuICpcbiAqIFRoZSBtYXRoIGFuZCBwcm9tcHQgZm9ybWF0dGluZyBsaXZlIGluIHNyYy9jYXBhY2l0eS1jb3JlLnRzIChwdXJlLCB0ZXN0ZWQpO1xuICogdGhpcyBmaWxlIGlzIHRoZSBET00gZ2x1ZTogbWVhc3VyZW1lbnQgKyBjbGlwYm9hcmQuXG4gKiBUaGUgcHJvbXB0IGlzIGNvcGllZCB0byB0aGUgY2xpcGJvYXJkIChubyBvdGhlciBvdXRwdXQpOyB0aGUgbWVzc2FnZSB0ZXh0XG4gKiBmb2xsb3dzIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZSAoXCJ6aCpcIiBcdTIxOTIgQ2hpbmVzZSwgb3RoZXJ3aXNlIEVuZ2xpc2gpLlxuICovXG5cbmNvbnN0IHB4ID0gKHY6IHN0cmluZyk6IG51bWJlciA9PiBOdW1iZXIucGFyc2VGbG9hdCh2KTtcblxuY29uc3QgU0FNUExFX0xBVElOID1cbiAgXCJUaGUgcXVpY2sgYnJvd24gZm94IGp1bXBzIG92ZXIgdGhlIGxhenkgZG9nIDAxMjM0NTY3ODkgYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbmNvbnN0IFNBTVBMRV9DSksgPSBcIlx1NEUwMFx1NUM0Rlx1NEUwMFx1NTM2MVx1NUU3Qlx1NzA2Rlx1NzI0N1x1NTE4NVx1NUJCOVx1NkQ0Qlx1OTFDRlx1NzkzQVx1NEY4Qlx1RkYwQ1x1NkJDRlx1ODg0Q1x1NTNFRlx1NEVFNVx1NjM5Mlx1NEUwQlx1NTkxQVx1NUMxMVx1NEUyQVx1NUI1N1x1RkYxQVx1NTJBMFx1NTFDRlx1NEU1OFx1OTY2NFx1NzY3RVx1NTIwNlx1NkJENFx1MzAwMlwiO1xuXG4vKiogQXZlcmFnZSBjaGFyIHdpZHRoIChweCkgZm9yIGEgc2FtcGxlIHN0cmluZyBhdCB0aGUgZ2l2ZW4gZm9udCBzZXR0aW5ncyAqL1xuZnVuY3Rpb24gYXZnQ2hhcldpZHRoKGZvbnQ6IHN0cmluZywgc2FtcGxlOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICBpZiAoIWN0eCkgcmV0dXJuIDI0O1xuICBjdHguZm9udCA9IGZvbnQ7XG4gIHJldHVybiBjdHgubWVhc3VyZVRleHQoc2FtcGxlKS53aWR0aCAvIHNhbXBsZS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGxpbmVCb3goZWw6IEhUTUxFbGVtZW50KTogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB7XG4gIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGNvbnN0IGZzID0gcHgoY3MuZm9udFNpemUpO1xuICBjb25zdCBsaFJhdyA9IGNzLmxpbmVIZWlnaHQ7XG4gIHJldHVybiB7IGZvbnRTaXplOiBmcywgbGluZUhlaWdodDogcHgobGhSYXcpID4gMCA/IHB4KGxoUmF3KSA6IGZzICogMS41IH07XG59XG5cbi8qKlxuICogTWVhc3VyZSB0aGUgYWN0aXZlIFNsaWRlcyB2aWV3LiBSZXR1cm5zIG51bGwgd2hlbiBubyBTbGlkZXMgbGF5b3V0IGlzXG4gKiBhY3RpdmUgKHRoZSBjb21tYW5kIGlzIG9ubHkgcmVhY2hhYmxlIHRoZXJlLCBidXQgdGhlIGd1YXJkIGlzIGNoZWFwKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lYXN1cmVTbGlkZXMoYXBwOiBBcHApOiBTbGlkZU1ldHJpY3MgfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCByb290ID0gdmlldy5jb250ZW50RWw7XG4gIGNvbnN0IHNjcm9sbGVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zY3JvbGxlclwiKTtcbiAgY29uc3QgY29udGVudCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgaWYgKCFzY3JvbGxlciB8fCAhY29udGVudCkgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgY3NTY3JvbGwgPSBnZXRDb21wdXRlZFN0eWxlKHNjcm9sbGVyKTtcbiAgY29uc3QgY3NDb250ZW50ID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50KTtcblxuICBjb25zdCBzY3JlZW5IID0gc2Nyb2xsZXIuY2xpZW50SGVpZ2h0O1xuICBjb25zdCB0ZXh0VG9wUGFkID0gcHgoY3NTY3JvbGwucGFkZGluZ1RvcCk7XG4gIGNvbnN0IHRleHRCb3R0b21QYWQgPSBweChjc1Njcm9sbC5wYWRkaW5nQm90dG9tKTtcbiAgY29uc3QgY2FyZFBhZFRvcCA9IHB4KGNzQ29udGVudC5wYWRkaW5nVG9wKTtcbiAgY29uc3QgY2FyZFBhZEJvdHRvbSA9IHB4KGNzQ29udGVudC5wYWRkaW5nQm90dG9tKTtcblxuICBjb25zdCBoYXNUaXRsZSA9XG4gICAgY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKSB8fCBjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiKTtcbiAgLy8gV2l0aCBhIHRpdGxlLCB0aGUgY2FyZCdzIHRvcCBwYWRkaW5nIGdyb3dzIGJ5IHRoZSByZXNlcnZlZCB0aXRsZSBibG9ja1xuICAvLyAocGFkZGluZ1RvcCAtIHBhZGRpbmdCb3R0b20gaXMgdGhlIGRlbHRhOyBib3RoIGFyZSAtLW5zLXBhZC15IG5vcm1hbGx5KS5cbiAgY29uc3QgdGl0bGVSZXNlcnZlZCA9IGhhc1RpdGxlXG4gICAgPyBNYXRoLnJvdW5kKE1hdGgubWF4KDAsIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCkgLyAxMDBcbiAgICA6IDA7XG5cbiAgY29uc3QgdGV4dEhlaWdodCA9XG4gICAgTWF0aC5yb3VuZChcbiAgICAgIE1hdGgubWF4KDAsIHNjcmVlbkggLSB0ZXh0VG9wUGFkIC0gdGV4dEJvdHRvbVBhZCAtIGNhcmRQYWRUb3AgLSBjYXJkUGFkQm90dG9tKSAqIDEwMCxcbiAgICApIC8gMTAwO1xuXG4gIGNvbnN0IHRleHRXaWR0aCA9IGNvbnRlbnQuY2xpZW50V2lkdGggLSBweChjc0NvbnRlbnQucGFkZGluZ0xlZnQpIC0gcHgoY3NDb250ZW50LnBhZGRpbmdSaWdodCk7XG4gIGNvbnN0IHZpZXdwb3J0V2lkdGggPSBzY3JvbGxlci5jbGllbnRXaWR0aDtcbiAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSBzY3JlZW5IO1xuXG4gIC8vIFRoZSBzbGlkZXMgYmFyIGlzIGFwcGVuZGVkIHRvIGRvY3VtZW50LmJvZHkgKG5vdCB0aGUgdmlldydzIGNvbnRlbnRFbClcbiAgY29uc3QgYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubmF0aXZlLXNsaWRlcy1iYXJcIik7XG4gIGNvbnN0IGJhclZpc2libGUgPSBiYXIgIT09IG51bGwgJiYgZ2V0Q29tcHV0ZWRTdHlsZShiYXIpLmRpc3BsYXkgIT09IFwibm9uZVwiO1xuICBjb25zdCBiYXJIZWlnaHQgPSBiYXIgJiYgYmFyVmlzaWJsZSA/IGJhci5vZmZzZXRIZWlnaHQgOiAwO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBlbGVtZW50IGxpbmUgYm94ZXM6IG1lYXN1cmUgZmlyc3QgaXRlbSBvZiBlYWNoIHR5cGUgcHJlc2VudCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgaGVhZGVyID0gKGNsczogc3RyaW5nKSA9PiByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGAuY20tY29udGVudCAke2Nsc31gKTtcbiAgY29uc3QgaDFFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMVwiKTtcbiAgY29uc3QgaDJFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItMlwiKTtcbiAgY29uc3QgaDNFbCA9IGhlYWRlcihcIi5jbS1oZWFkZXItM1wiKTtcbiAgY29uc3QgYnVsbGV0RWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgLkh5cGVyTUQtbGlzdC1saW5lXCIpO1xuICBjb25zdCBjb2RlRWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgcHJlLCAuY20tY29udGVudCAuSHlwZXJNRC1jb2RlYmxvY2tcIik7XG4gIGNvbnN0IGltZ0VsID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50IGltZzpub3QoLmNtLXdpZGdldEJ1ZmZlcilcIik7XG5cbiAgLy8gQSBwbGFpbiBib2R5IGxpbmUgXHUyMDE0IHNraXAgaGVhZGVycywgbGlzdCBsaW5lcywgY29kZSwgcXVvdGVzIGFuZCBlbXB0eVxuICAvLyBsaW5lcyAoQ00gcmVuZGVycyBvbmx5IHZpc2libGUgbGluZXM7IGluIFNsaWRlcyBtb2RlIHRoZSBmaXJzdCBzY3JlZW5cbiAgLy8gaXMgZXhhY3RseSB0aGVtKS4gQW4gZW1wdHkgbGluZSBib3ggKGEgYmxhbmsgcm93LCB+OHB4KSBpcyBub3QgYSB1c2VmdWxcbiAgLy8gYm9keSBzYW1wbGUsIHNvIHBpY2sgdGhlIGZpcnN0IGNhbmRpZGF0ZSB3aXRoIGFjdHVhbCB0ZXh0LlxuICBjb25zdCBib2R5RWwgPVxuICAgIEFycmF5LmZyb20oXG4gICAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFxuICAgICAgICBcIi5jbS1jb250ZW50IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpOm5vdCguSHlwZXJNRC1saXN0LWxpbmUpOm5vdCguSHlwZXJNRC1xdW90ZSk6bm90KC5IeXBlck1ELWNvZGVibG9jaylcIixcbiAgICAgICksXG4gICAgKS5maW5kKChlbCkgPT4gZWwudGV4dENvbnRlbnQgIT09IG51bGwgJiYgZWwudGV4dENvbnRlbnQudHJpbSgpLmxlbmd0aCA+IDApID8/IGNvbnRlbnQ7XG5cbiAgY29uc3QgYm9keSA9IGxpbmVCb3goYm9keUVsKTtcbiAgY29uc3QgaDEgPSBoMUVsID8gbGluZUJveChoMUVsKSA6IG51bGw7XG4gIGNvbnN0IGgyID0gaDJFbCA/IGxpbmVCb3goaDJFbCkgOiBudWxsO1xuICBjb25zdCBoMyA9IGgzRWwgPyBsaW5lQm94KGgzRWwpIDogbnVsbDtcblxuICBjb25zdCBjcyA9IChlbDogSFRNTEVsZW1lbnQpOiBDU1NTdHlsZURlY2xhcmF0aW9uID0+IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICBsZXQgYnVsbGV0OiB7IGl0ZW1IZWlnaHQ6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG4gIGlmIChidWxsZXRFbCkge1xuICAgIGNvbnN0IGMgPSBjcyhidWxsZXRFbCk7XG4gICAgYnVsbGV0ID0ge1xuICAgICAgaXRlbUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSArIHB4KGMucGFkZGluZ1RvcCkgKyBweChjLnBhZGRpbmdCb3R0b20pLFxuICAgIH07XG4gIH1cblxuICBsZXQgY29kZTogeyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGwgPSBudWxsO1xuICBpZiAoY29kZUVsKSB7XG4gICAgY29uc3QgYyA9IGNzKGNvZGVFbCk7XG4gICAgY29kZSA9IHsgbGluZUhlaWdodDogcHgoYy5saW5lSGVpZ2h0KSA+IDAgPyBweChjLmxpbmVIZWlnaHQpIDogcHgoYy5mb250U2l6ZSkgKiAxLjUgfTtcbiAgfVxuXG4gIGNvbnN0IGltYWdlSGVpZ2h0ID1cbiAgICBpbWdFbCAmJiBpbWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgPiAwXG4gICAgICA/IE1hdGgucm91bmQoaW1nRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KVxuICAgICAgOiBudWxsO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBkZXJpdmUgbWlzc2luZyBlbGVtZW50IGJveGVzIGZyb20gdGhlIHBpbm5lZCBTbGlkZXMgdHlwb2dyYXBoeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gc3R5bGVzLmNzcyBcdTAwQTc5IGRlY2xhcmVzIHRoZSBzbGlkZSB0eXBvZ3JhcGh5IG9uIHRoZSBzaXplclxuICAvLyAoLS1oMS1zaXplOiAxLjRlbTsgLS1oMS1saW5lLWhlaWdodDogMS40MzsgXHUyMDI2KSBhbmQgXHUwMEE3NyBwaW5zIGNvZGUgYmxvY2tzXG4gIC8vIHRvIDFyZW0vMS41IFx1MjAxNCBhIG5vdGUgd2l0aG91dCB0aGF0IGVsZW1lbnQgdHlwZSBzdGlsbCByZXBvcnRzIGl0cyBib3guXG4gIGNvbnN0IHNpemVyID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1zaXplclwiKTtcbiAgY29uc3Qgc2l6ZXJTdHlsZSA9IHNpemVyID8gY3Moc2l6ZXIpIDogbnVsbDtcbiAgY29uc3QgZGVyaXZlQm94ID0gKHNpemVWYXI6IHN0cmluZywgbGhWYXI6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGVtID0gc2l6ZXJTdHlsZSA/IHB4KHNpemVyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShzaXplVmFyKSkgOiBOYU47XG4gICAgY29uc3QgbGggPSBzaXplclN0eWxlID8gcHgoc2l6ZXJTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKGxoVmFyKSkgOiBOYU47XG4gICAgY29uc3QgZm9udFNpemUgPSBlbSA+IDAgPyBlbSAqIGJvZHkuZm9udFNpemUgOiBib2R5LmZvbnRTaXplO1xuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSBsaCA+IDAgPyBsaCAqIGZvbnRTaXplIDogYm9keS5saW5lSGVpZ2h0O1xuICAgIHJldHVybiB7IGZvbnRTaXplLCBsaW5lSGVpZ2h0IH07XG4gIH07XG4gIGNvbnN0IGRlcml2ZUgxID0gZGVyaXZlQm94KFwiLS1oMS1zaXplXCIsIFwiLS1oMS1saW5lLWhlaWdodFwiKTtcbiAgY29uc3QgZGVyaXZlSDIgPSBkZXJpdmVCb3goXCItLWgyLXNpemVcIiwgXCItLWgyLWxpbmUtaGVpZ2h0XCIpO1xuICBjb25zdCBkZXJpdmVIMyA9IGRlcml2ZUJveChcIi0taDMtc2l6ZVwiLCBcIi0taDMtbGluZS1oZWlnaHRcIik7XG4gIGNvbnN0IGRlcml2ZUNvZGUgPSAoKSA9PiB7XG4gICAgY29uc3Qgcm9vdEZvbnQgPSBweChnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUpO1xuICAgIHJldHVybiB7IGxpbmVIZWlnaHQ6IHJvb3RGb250ICogMS41IH07XG4gIH07XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGNoYXIgd2lkdGhzIGF0IHRoZSBib2R5IGZvbnQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IGZvbnRGYW1pbHkgPSBjcyhjb250ZW50KS5mb250RmFtaWx5O1xuICBjb25zdCBmb250ID0gYDQwMCAke2JvZHkuZm9udFNpemV9cHggJHtmb250RmFtaWx5fWA7XG4gIGNvbnN0IGNoYXIgPSB7XG4gICAgbGF0aW46IGF2Z0NoYXJXaWR0aChmb250LCBTQU1QTEVfTEFUSU4pLFxuICAgIGNqazogYXZnQ2hhcldpZHRoKGZvbnQsIFNBTVBMRV9DSkspLFxuICB9O1xuXG4gIC8vIE1lYXN1cmVkIHdpbnM7IGRlcml2YXRpb24gZmlsbHMgdGhlIGdhcHMgZm9yIGFic2VudCB0eXBlcy5cbiAgcmV0dXJuIHtcbiAgICB2aWV3cG9ydDogeyB3aWR0aDogdmlld3BvcnRXaWR0aCwgaGVpZ2h0OiB2aWV3cG9ydEhlaWdodCB9LFxuICAgIHRleHQ6IHsgd2lkdGg6IHRleHRXaWR0aCwgaGVpZ2h0OiB0ZXh0SGVpZ2h0IH0sXG4gICAgYmFyOiB7XG4gICAgICB2aXNpYmxlOiBiYXJWaXNpYmxlLFxuICAgICAgaGVpZ2h0OiBiYXJIZWlnaHQsXG4gICAgfSxcbiAgICB0aXRsZVJlc2VydmVkOiBNYXRoLnJvdW5kKHRpdGxlUmVzZXJ2ZWQgKiAxMDApIC8gMTAwLFxuICAgIGJvZHksXG4gICAgaDE6IGgxID8/IGRlcml2ZUgxLFxuICAgIGgyOiBoMiA/PyBkZXJpdmVIMixcbiAgICBoMzogaDMgPz8gZGVyaXZlSDMsXG4gICAgYnVsbGV0LFxuICAgIGNvZGU6IGNvZGUgPz8gZGVyaXZlQ29kZSgpLFxuICAgIGltYWdlSGVpZ2h0LFxuICAgIGNoYXIsXG4gIH07XG59XG5cbi8qKlxuICogRW50cnkgcG9pbnQgb2YgdGhlIFwiQ29weSBzbGlkZSBjYXBhY2l0eVwiIGNvbW1hbmQ6IG1lYXN1cmUsIGZvcm1hdCxcbiAqIHdyaXRlIHRvIHRoZSBjbGlwYm9hcmQuIFJ1bnMgb25seSBmcm9tIFNsaWRlcyBtb2RlIChjb21tYW5kIGdhdGUpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29weUNhcGFjaXR5UHJvbXB0KGFwcDogQXBwKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG0gPSBtZWFzdXJlU2xpZGVzKGFwcCk7XG4gIGlmICghbSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgbWVhc3VyZSB0aGUgU2xpZGVzIGxheW91dFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcHJvbXB0ID0gZm9ybWF0Q2FwYWNpdHkobSwgY29tcHV0ZUNhcGFjaXR5KG0pLCBwcm9tcHRMb2NhbGUoKSk7XG4gIHRyeSB7XG4gICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQocHJvbXB0KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjbGlwYm9hcmQgd3JpdGUgZmFpbGVkICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG4iLCAiLyoqXG4gKiBjYXBhY2l0eS1jb3JlLnRzIFx1MjAxNCBwdXJlIGNhcGFjaXR5IG1hdGggKyBwcm9tcHQgZm9ybWF0dGluZyBmb3IgU2xpZGVzLlxuICpcbiAqIFRoaXMgbW9kdWxlIGlzIERPTS1mcmVlIGFuZCB1bml0LXRlc3RlZCAobGlrZSBzcmMvZGVjay50cykuIEl0IHR1cm5zXG4gKiBtZWFzdXJlZCBudW1iZXJzIChmcm9tIHNyYy9jYXBhY2l0eS50cykgaW50byBhIG9uZS1zY3JlZW4gY2FwYWNpdHlcbiAqIHJlcG9ydDogaG93IG1hbnkgYm9keSBsaW5lcyAvIGJ1bGxldHMgLyBIMSBsaW5lcyBmaXQgdGhlIGFjdGl2ZSB0ZXh0XG4gKiBhcmVhLCB3aXRoIHBlci1lbGVtZW50IGxpbmUgYm94ZXMsIGFuZCBmb3JtYXRzIHRoZW0gaW50byBhbiBBSS1yZWFkeVxuICogcHJvbXB0IGluIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZS5cbiAqL1xuXG4vKiogUmF3IGxpdmUtbGF5b3V0IG1lYXN1cmVtZW50cyBvZiB0aGUgYWN0aXZlIFNsaWRlcyBub3RlICovXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlTWV0cmljcyB7XG4gIC8qKiBTY3JlZW4gKHZpZXdwb3J0KSBzaXplIGluIENTUyBweCAqL1xuICB2aWV3cG9ydDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICAvKiogQXZhaWxhYmxlIHRleHQgYXJlYSAoc2NyZWVuIG1pbnVzIHNjcm9sbGVyIHBhZGRpbmdzLCBjYXJkIHBhZGRpbmcsIHRpdGxlKSAqL1xuICB0ZXh0OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBTbGlkZXMgYmFyIHN0YXRlIFx1MjAxNCBpdHMgaGVpZ2h0IGlzIG9uIHRoZSBwYWdlOyB0aGUgbnVtYmVyIGlzIGluZm9ybWF0aW9uYWwgKi9cbiAgYmFyOiB7IHZpc2libGU6IGJvb2xlYW47IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBWZXJ0aWNhbCBzcGFjZSByZXNlcnZlZCBmb3IgdGhlIGNhcmQgdGl0bGUgKDAgPSBubyB0aXRsZSkgKi9cbiAgdGl0bGVSZXNlcnZlZDogbnVtYmVyO1xuICAvKiogQm9keSBwYXJhZ3JhcGggbWV0cmljcyAoZm9udCBzaXplIC8gbGluZSBib3gsIHB4KSAqL1xuICBib2R5OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9O1xuICAvKiogSGVhZGluZyBsaW5lIGJveGVzIChweCkgXHUyMDE0IG51bGwgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSBvZiB0aGlzIGxldmVsICovXG4gIGgxOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgaDI6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICBoMzogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgYnVsbGV0IGl0ZW0ncyB0b3RhbCBoZWlnaHQgKGxpbmUgYm94ICsgbGlzdCBwYWRkaW5ncywgcHgpICovXG4gIGJ1bGxldDogeyBpdGVtSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBPbmUgY29kZSBsaW5lJ3MgYm94IChmb250IDFyZW0gaW4gU2xpZGVzOyBtZWFzdXJlZCB3aGVuIGEgYmxvY2sgZXhpc3RzKSAqL1xuICBjb2RlOiB7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIEhlaWdodCBvZiB0aGUgZmlyc3QgcmVuZGVyZWQgaW1hZ2UgKHB4KTsgbnVsbCB3aGVuIHRoZSBub3RlIGhhcyBub25lICovXG4gIGltYWdlSGVpZ2h0OiBudW1iZXIgfCBudWxsO1xuICAvKiogQXZlcmFnZSBjaGFyYWN0ZXIgd2lkdGhzIChweCkgYXQgdGhlIGJvZHkgZm9udCAqL1xuICBjaGFyOiB7IGxhdGluOiBudW1iZXI7IGNqazogbnVtYmVyIH07XG59XG5cbi8qKiBEZXJpdmVkIGNhcGFjaXR5IGNvdW50cyAocHVyZTsgdGFrZXMgbnVtYmVycywgbm90IHRoZSBET00pICovXG5leHBvcnQgaW50ZXJmYWNlIENhcGFjaXR5UmVzdWx0IHtcbiAgLyoqIEJvZHkgdGV4dCBsaW5lcyB0aGF0IGZpdCBvbmUgc2NyZWVuICovXG4gIGJvZHlMaW5lczogbnVtYmVyO1xuICAvKiogQnVsbGV0IGl0ZW1zIHRoYXQgZml0IG9uZSBzY3JlZW4gKGZ1bGwgbGlzdCkgKi9cbiAgYnVsbGV0czogbnVtYmVyO1xuICAvKiogSDEgbGluZXMgdGhhdCBmaXQgKG9uZSBwZXIgSDEgbGluZSBib3gpICovXG4gIGgxTGluZXM6IG51bWJlcjtcbiAgLyoqIEV4YW1wbGVzOiBjb3VudCBvZiBhIHNlY29uZCBibG9jayB0eXBlIGFmdGVyIG9uZSBmaXJzdCBibG9jayAqL1xuICBjb21ib3M6IHtcbiAgICBhZnRlckgxQnVsbGV0czogbnVtYmVyO1xuICAgIGFmdGVySDJCdWxsZXRzOiBudW1iZXI7XG4gICAgYWZ0ZXJIMUJvZHlMaW5lczogbnVtYmVyO1xuICB9O1xufVxuXG4vKipcbiAqIERlcml2ZWQgY2FwYWNpdHkgZnJvbSByYXcgbWV0cmljcyBcdTIwMTQgcHVyZSBhbmQgZGV0ZXJtaW5pc3RpYy5cbiAqIEV2ZXJ5IG51bWJlciBmbG9vcnMgKGJsb2NrcyBhcmUgZGlzY3JldGUpOyBhIG5lZ2F0aXZlIHJlc3VsdCBpcyBjbGFtcGVkIHRvIDAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlQ2FwYWNpdHkobTogU2xpZGVNZXRyaWNzKTogQ2FwYWNpdHlSZXN1bHQge1xuICBjb25zdCBIID0gbS50ZXh0LmhlaWdodDtcbiAgY29uc3QgZmxvb3IgPSAobjogbnVtYmVyKTogbnVtYmVyID0+IE1hdGgubWF4KDAsIE1hdGguZmxvb3IobikpO1xuICBjb25zdCBib2R5TGluZXMgPSBmbG9vcihIIC8gbS5ib2R5LmxpbmVIZWlnaHQpO1xuXG4gIGNvbnN0IGJ1bGxldEggPSBtLmJ1bGxldD8uaXRlbUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYnVsbGV0cyA9IGZsb29yKEggLyBidWxsZXRIKTtcblxuICBjb25zdCBoMUggPSBtLmgxPy5saW5lSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBoMUxpbmVzID0gZmxvb3IoSCAvIGgxSCk7XG5cbiAgY29uc3QgaDJIID0gbS5oMj8ubGluZUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgYWZ0ZXJTcGFuID0gKGZpcnN0SDogbnVtYmVyLCBpdGVtSDogbnVtYmVyKTogbnVtYmVyID0+IGZsb29yKChIIC0gZmlyc3RIKSAvIGl0ZW1IKTtcblxuICByZXR1cm4ge1xuICAgIGJvZHlMaW5lcyxcbiAgICBidWxsZXRzLFxuICAgIGgxTGluZXMsXG4gICAgY29tYm9zOiB7XG4gICAgICBhZnRlckgxQnVsbGV0czogYWZ0ZXJTcGFuKGgxSCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgyQnVsbGV0czogYWZ0ZXJTcGFuKGgySCwgYnVsbGV0SCksXG4gICAgICBhZnRlckgxQm9keUxpbmVzOiBhZnRlclNwYW4oaDFILCBtLmJvZHkubGluZUhlaWdodCksXG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIExvY2FsZSBvZiB0aGUgZ2VuZXJhdGVkIHByb21wdDogXCJ6aFwiIGZvciBDaGluZXNlLCBvdGhlcndpc2UgRW5nbGlzaCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb21wdExvY2FsZSgpOiBcInpoXCIgfCBcImVuXCIge1xuICBjb25zdCBsYW5nID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgID8gKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpID8/IG5hdmlnYXRvci5sYW5ndWFnZSA/PyBcImVuXCIpXG4gICAgICA6IFwiZW5cIjtcbiAgcmV0dXJuIGxhbmcudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiemhcIikgPyBcInpoXCIgOiBcImVuXCI7XG59XG5cbmZ1bmN0aW9uIGZtdChuOiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihuKSA/IFN0cmluZyhuKSA6IG4udG9GaXhlZCgxKTtcbn1cblxuLyoqIEh1bWFuLXJlYWRhYmxlIGxpc3Qgb2YgdGhlIG1lYXN1cmVkIGVsZW1lbnQgbGluZSBib3hlcyAqL1xuZnVuY3Rpb24gYm94U3RyKGtpbmQ6IHN0cmluZywgYm94OiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbCk6IHN0cmluZyB7XG4gIGlmICghYm94KSByZXR1cm4gYCR7a2luZH06IC1gO1xuICByZXR1cm4gYCR7a2luZH06ICR7Zm10KGJveC5saW5lSGVpZ2h0KX1weC9saW5lIChmb250ICR7Zm10KGJveC5mb250U2l6ZSl9cHgpYDtcbn1cblxuLyoqIEhvdyBOYXRpdmUgU2xpZGVzIHdvcmtzIFx1MjAxNCB0aGUgY29udGV4dCBhbiBhZ2VudCBuZWVkcyBiZWZvcmUgZ2VuZXJhdGluZyAqL1xuZnVuY3Rpb24gZW5Db250ZXh0KCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtcbiAgICBgVGhpcyBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIHVzZWQgYnkgdGhlIE9ic2lkaWFuIHBsdWdpbiBcIk5hdGl2ZSBTbGlkZXNcIi4gVGhlIHBsdWdpbiB0dXJucyBtYXJrZG93biBub3RlcyBpbnRvIHNsaWRlczogYSBkZWNrIGlzIGFuIG9yZGVyZWQgY2hhaW4gb2Ygbm90ZXMsIGVhY2ggbm90ZSBpcyBPTkUgc2xpZGUgc2hvd24gYXMgYW4gaW1tZXJzaXZlLCBvbmUgc2NyZWVuID0gb25lIGNhcmQgdmlldyAoZWFjaCBzbGlkZSBhbHdheXMgc3RhcnRzIGF0IHRoZSB0b3Agb2YgaXRzIG5vdGUpLmAsXG4gICAgYGAsXG4gICAgYEhvdyB0byBidWlsZCBhIHNsaWRlcyBkZWNrOmAsXG4gICAgYC0gQSBzbGlkZSBpcyBhbiBvcmRpbmFyeSBtYXJrZG93biBub3RlIGluIHRoZSB2YXVsdDsgdGhlIG9ubHkgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgaXMgZGVjayBcdTIwMTQgb25lIGxpbmsgdG8gdGhlIE5FWFQgc2xpZGUgKGUuZy4gZGVjazogW1wiW1tzbGlkZS0yXV1cIl0sIG9yIGRlY2s6IFtdIGZvciB0aGUgbGFzdCBzbGlkZSkuIFRoZSBjaGFpbiBvcmRlciBpcyB0aGUgcHJlc2VudGF0aW9uIG9yZGVyOyBwYWdlIG51bWJlcnMgYXJlIGF1dG8tY29tcHV0ZWQuYCxcbiAgICBgLSBDcmVhdGUgYSBuZXcgZGVjayB3aXRoIHRoZSBjb21tYW5kIFwiQ3JlYXRlIG5ldyBzbGlkZVwiIChmcmVzaCBub3RlLCBkZWNrOiBbXSkuIEFkZCBwYWdlcyB3aXRoIFwiQ3JlYXRlIG5leHQgc2xpZGVcIiBcdTIwMTQgaXQgd2lyZXMgdGhlIGRlY2sgbGlua3MgYXV0b21hdGljYWxseSAodGhlIGN1cnJlbnQgbm90ZSdzIGRlY2sgbGluayBpcyBwb2ludGVkIGF0IHRoZSBuZXcgbm90ZSwgdGhlIG5ldyBub3RlIGdldHMgdGhlIG9sZCB0YXJnZXQpLmAsXG4gICAgYC0gQ29udGVudCBpcyB3cml0dGVuIGluIHBsYWluIG1hcmtkb3duIGFuZCByZW5kZXJlZCBvbiB0aGUgY2FyZCBpbiB0aGUgbm90ZSdzIGxhbmd1YWdlIHdoZW4gcG9zc2libGUuIEtlZXAgZXZlcnkgc2xpZGUgd2l0aGluIG9uZSBzY3JlZW4gXHUyMDE0IHRoZSBjYXBhY2l0eSBudW1iZXJzIGJlbG93IGFyZSB0aGUgZml0IGJ1ZGdldCAodGhleSBhbHJlYWR5IHN1YnRyYWN0IHRoZSBzbGlkZXMgYmFyIGFuZCB0aGUgY2FyZCB0aXRsZSkuYCxcbiAgICBgLSBUaGUgdXNlcidzIHJlcXVlc3QgY29tZXMgZmlyc3Q6IGZvbGxvdyB3aGF0IHRoZSB1c2VyIGFza2VkIGZvciAoXCJmb3IgbWF0ZXJpYWwgWCBtYWtlIGEgc2xpZGVzIGRlY2tcIiksIHVzaW5nIHRoZSBwbHVnaW4ncyBjb252ZW50aW9ucyBhYm92ZSBhcyB0aGUgZm9ybSwgbm90IGFzIHRoZSBjb250ZW50LmAsXG4gIF07XG59XG5cbmZ1bmN0aW9uIHpoQ29udGV4dCgpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXG4gICAgYFx1NjcyQ1x1N0IxNFx1OEJCMFx1NUM1RVx1NEU4RSBPYnNpZGlhbiBcdTYzRDJcdTRFRjYgXCJOYXRpdmUgU2xpZGVzXCIgXHU3Njg0IGRlY2sgXHU3QjE0XHU4QkIwXHUzMDAyXHU4QkU1XHU2M0QyXHU0RUY2XHU2MjhBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1NTNEOFx1NjIxMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYxQVx1NEUwMFx1NEUyQSBkZWNrIFx1NUMzMVx1NjYyRlx1NEUwMFx1N0VDNFx1NjcwOVx1NUU4Rlx1OTRGRVx1NjNBNVx1NzY4NFx1N0IxNFx1OEJCMFx1RkYwQ1x1NkJDRlx1N0JDN1x1N0IxNFx1OEJCMFx1NUMzMVx1NjYyRlx1NEUwMFx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1RkYwQ1x1NEVFNVwiXHU0RTAwXHU1QzRGXHU0RTAwXHU1MzYxXCJcdTc2ODRcdTZDODlcdTZENzhcdTVGMEZcdTUzNjFcdTcyNDdcdTg5QzZcdTU2RkVcdTVDNTVcdTc5M0FcdUZGMDhcdTZCQ0ZcdTVGMjBcdTVFN0JcdTcwNkZcdTcyNDdcdTkwRkRcdTRFQ0VcdTdCMTRcdThCQjBcdTVGMDBcdTU5MzRcdTVGMDBcdTU5Q0JcdUZGMDlcdTMwMDJgLFxuICAgIGBgLFxuICAgIGBcdTU5ODJcdTRGNTVcdTY3ODRcdTVFRkFcdTVFN0JcdTcwNkZcdTcyNDcgZGVja1x1RkYxQWAsXG4gICAgYC0gXHU1RTdCXHU3MDZGXHU3MjQ3XHU1QzMxXHU2NjJGXHU1RTkzXHU5MUNDXHU3Njg0XHU2NjZFXHU5MDFBIG1hcmtkb3duIFx1N0IxNFx1OEJCMFx1RkYxQlx1NTUyRlx1NEUwMFx1NEZERFx1NzU1OVx1NzY4NCBmcm9udG1hdHRlciBcdTVDNUVcdTYwMjdcdTY2MkYgZGVja1x1MjAxNFx1MjAxNFx1NjMwN1x1NTQxMVx1NEUwQlx1NEUwMFx1NUYyMFx1NzY4NFx1OTRGRVx1NjNBNVx1RkYwOFx1NTk4MiBkZWNrOiBbXCJbW3NsaWRlLTJdXVwiXVx1RkYwQ1x1NjcwMFx1NTQwRVx1NEUwMFx1NUYyMFx1NTE5OSBkZWNrOiBbXVx1RkYwOVx1MzAwMlx1OTRGRVx1NzY4NFx1OTg3QVx1NUU4Rlx1NTM3M1x1NjUzRVx1NjYyMFx1OTg3QVx1NUU4Rlx1RkYwQ1x1OTg3NVx1NTNGN1x1ODFFQVx1NTJBOFx1OEJBMVx1N0I5N1x1MzAwMmAsXG4gICAgYC0gXHU3NTI4XHU1NDdEXHU0RUU0IFwiQ3JlYXRlIG5ldyBzbGlkZVwiIFx1NjVCMFx1NUVGQVx1NEUwMFx1NTk1NyBkZWNrXHVGRjA4XHU2NUIwXHU1RUZBXHU3QjE0XHU4QkIwXHVGRjBDZGVjazogW11cdUZGMDlcdUZGMUJcdTc1MjggXCJDcmVhdGUgbmV4dCBzbGlkZVwiIFx1N0VFN1x1N0VFRFx1NTJBMFx1OTg3NVx1MjAxNFx1MjAxNFx1NUI4M1x1NEYxQVx1ODFFQVx1NTJBOFx1NjNBNVx1OTAxQVx1OTRGRVx1RkYwOFx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NCBkZWNrIFx1OTRGRVx1NjNBNVx1NjMwN1x1NTQxMVx1NjVCMFx1OTg3NVx1RkYwQ1x1NjVCMFx1OTg3NVx1N0VFN1x1NjI3Rlx1NTM5Rlx1Njc2NVx1NzY4NFx1NEUwQlx1NEUwMFx1NUYyMFx1RkYwOVx1MzAwMmAsXG4gICAgYC0gXHU1MTg1XHU1QkI5XHU3NTI4XHU3RUFGIG1hcmtkb3duIFx1N0YxNlx1NTE5OVx1RkYwQ1x1NTcyOFx1NTM2MVx1NzI0N1x1NEUwQVx1NkUzMlx1NjdEM1x1RkYxQlx1NUMzRFx1OTFDRlx1NEY3Rlx1NzUyOFx1NzUyOFx1NjIzN1x1NUY1M1x1NTI0RFx1NzY4NFx1OEJFRFx1OEEwMFx1NjNBQVx1OEY5RVx1MzAwMlx1NkJDRlx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1NUZDNVx1OTg3Qlx1NjUzRVx1NTE2NVx1NEUwMFx1NUM0Rlx1MjAxNFx1MjAxNFx1NEUwQlx1OTc2Mlx1NzY4NFx1NUJCOVx1OTFDRlx1NjU3MFx1NUI1N1x1NUMzMVx1NjYyRlx1NTNFRlx1NzUyOFx1OTg4NFx1N0I5N1x1RkYwOFx1NURGMlx1N0VDRlx1NjI2M1x1NjM4OSBzbGlkZXMgXHU2ODBGXHU0RTBFXHU1MzYxXHU3MjQ3XHU2ODA3XHU5ODk4XHVGRjA5XHUzMDAyYCxcbiAgICBgLSBcdTRFRTVcdTc1MjhcdTYyMzdcdTc2ODRcdTVCOUVcdTk2NDVcdTk3MDBcdTZDNDJcdTRFM0FcdTUxNDhcdUZGMUFcdTc1MjhcdTYyMzdcdTg5ODFcdTRFQzBcdTRFNDhcdUZGMDhcdTU5ODJcIlx1NTdGQVx1NEU4RVx1NjdEMFx1Njc1MFx1NjU5OVx1NTIzNlx1NEY1QyBzbGlkZXMgXHU3QjE0XHU4QkIwXCJcdUZGMDlcdTVDMzFcdTUwNUFcdTRFQzBcdTRFNDhcdUZGMENcdTYzRDJcdTRFRjZcdTc2ODRcdTdFQTZcdTVCOUFcdTUzRUFcdTY2MkZcdTVGNjJcdTVGMEZcdUZGMENcdTRFMERcdTY2MkZcdTUxODVcdTVCQjlcdTMwMDJgLFxuICBdO1xufVxuXG5mdW5jdGlvbiBlblByb21wdChtOiBTbGlkZU1ldHJpY3MsIGM6IENhcGFjaXR5UmVzdWx0LCBub3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiYXIgPVxuICAgIG0uYmFyLnZpc2libGUgfHwgbS5iYXIuaGVpZ2h0ID4gMFxuICAgICAgPyBgU2xpZGVzIGJhcjogdmlzaWJsZSwgJHttLmJhci5oZWlnaHR9cHggKGFscmVhZHkgZXhjbHVkZWQgZnJvbSB0aGUgdGV4dCBhcmVhKS5gXG4gICAgICA6IFwiU2xpZGVzIGJhcjogaGlkZGVuLlwiO1xuICBjb25zdCB0aXRsZSA9XG4gICAgbS50aXRsZVJlc2VydmVkID4gMCA/IGBDYXJkIHRpdGxlOiAke20udGl0bGVSZXNlcnZlZH1weCByZXNlcnZlZC5gIDogXCJDYXJkIHRpdGxlOiBub25lLlwiO1xuICBjb25zdCBpbWcgPVxuICAgIG0uaW1hZ2VIZWlnaHQgIT09IG51bGwgPyBgSW1hZ2U6ICR7bS5pbWFnZUhlaWdodH1weCB0YWxsIChmaXJzdCBpbWFnZSBvbiB0aGUgc2xpZGUpLmAgOiBcIlwiO1xuICBjb25zdCBzYW1wbGVzID0gW1xuICAgIGBQbGFpbiB0ZXh0OiAke2MuYm9keUxpbmVzfSBib2R5IGxpbmVzYCxcbiAgICBgSDEgKyBidWxsZXRzOiAke2MuY29tYm9zLmFmdGVySDFCdWxsZXRzfSBidWxsZXRzIGFmdGVyIGEgSDEgbGluZWAsXG4gICAgYFB1cmUgbGlzdDogJHtjLmJ1bGxldHN9IGJ1bGxldCBpdGVtc2AsXG4gICAgYEgxIGxpbmVzIG9ubHk6ICR7Yy5oMUxpbmVzfWAsXG4gIF0uam9pbihcIjsgXCIpO1xuICByZXR1cm4gW1xuICAgIGBTbGlkZSBjYXBhY2l0eSBcdTIwMTQgb25lIHNjcmVlbiwgbm8gc2Nyb2xsaW5nLiBHZW5lcmF0ZWQgZnJvbSB0aGUgbGl2ZSBTbGlkZXMgbGF5b3V0IG9mIHRoaXMgbm90ZTsgZXZlcnkgbnVtYmVyIGlzIG1lYXN1cmVkL2JyYW5jaC1kZXJpdmVkIGF0IHRoZSBjdXJyZW50IFVJIHNjYWxlLmAsXG4gICAgYGAsXG4gICAgLi4uZW5Db250ZXh0KCksXG4gICAgYGAsXG4gICAgYEdlb21ldHJ5OiBzY3JlZW4gJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHg7IHRleHQgYXJlYSAke20udGV4dC53aWR0aH1cdTAwRDcke20udGV4dC5oZWlnaHR9cHguICR7YmFyfSAke3RpdGxlfWAsXG4gICAgYGAsXG4gICAgYFRleHQgbWV0cmljcyAoYm9keSBmb250ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHgpOmAsXG4gICAgYGNoYXJzL2xpbmUgXHUyMjQ4ICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIubGF0aW4pfSBsYXRpbiAvICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIuY2prKX0gQ0pLOyBib2R5IGxpbmUgJHtmbXQobS5ib2R5LmxpbmVIZWlnaHQpfXB4LmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJidWxsZXRcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiY29kZVwiLCBtLmNvZGUgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uY29kZS5saW5lSGVpZ2h0IH0gOiBudWxsKSxcbiAgXVxuICAgIC5jb25jYXQoaW1nID8gW2ltZ10gOiBbXSlcbiAgICAuY29uY2F0KFtgYCwgYENhcGFjaXR5OiAke3NhbXBsZXN9LmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gemhQcm9tcHQobTogU2xpZGVNZXRyaWNzLCBjOiBDYXBhY2l0eVJlc3VsdCwgbm90ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYmFyID1cbiAgICBtLmJhci52aXNpYmxlIHx8IG0uYmFyLmhlaWdodCA+IDBcbiAgICAgID8gYFNsaWRlcyBcdTY4MEZcdUZGMUFcdTY2M0VcdTc5M0FcdUZGMEMke20uYmFyLmhlaWdodH1weFx1RkYwOFx1NURGMlx1NEVDRVx1NjU4N1x1NUI1N1x1NTMzQVx1NjI2M1x1NTFDRlx1RkYwOVx1MzAwMmBcbiAgICAgIDogXCJTbGlkZXMgXHU2ODBGXHVGRjFBXHU5NjkwXHU4NUNGXHUzMDAyXCI7XG4gIGNvbnN0IHRpdGxlID0gbS50aXRsZVJlc2VydmVkID4gMCA/IGBcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTk4ODRcdTc1NTkgJHttLnRpdGxlUmVzZXJ2ZWR9cHhcdTMwMDJgIDogXCJcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMUFcdTY1RTBcdTMwMDJcIjtcbiAgY29uc3QgaW1nID0gbS5pbWFnZUhlaWdodCAhPT0gbnVsbCA/IGBcdTU2RkVcdTcyNDdcdUZGMUEke20uaW1hZ2VIZWlnaHR9cHggXHU5QUQ4XHVGRjA4XHU1RjUzXHU1MjREXHU5ODc1XHU3QjJDXHU0RTAwXHU1RjIwXHVGRjA5XHUzMDAyYCA6IFwiXCI7XG4gIGNvbnN0IHNhbXBsZXMgPSBbXG4gICAgYFx1N0VBRlx1NkI2M1x1NjU4N1x1RkYxQSR7Yy5ib2R5TGluZXN9IFx1ODg0Q2AsXG4gICAgYEgxICsgXHU1MjE3XHU4ODY4XHVGRjFBSDEgXHU1NDBFXHU4RkQ4XHU1M0VGXHU2NTNFICR7Yy5jb21ib3MuYWZ0ZXJIMUJ1bGxldHN9IFx1NEUyQVx1NTIxN1x1ODg2OFx1OTg3OWAsXG4gICAgYFx1N0VBRlx1NTIxN1x1ODg2OFx1RkYxQSR7Yy5idWxsZXRzfSBcdTRFMkFcdTUyMTdcdTg4NjhcdTk4NzlgLFxuICAgIGBcdTdFQUYgSDFcdUZGMUEke2MuaDFMaW5lc30gXHU4ODRDYCxcbiAgXS5qb2luKFwiXHVGRjFCXCIpO1xuICByZXR1cm4gW1xuICAgIGBcdTVFN0JcdTcwNkZcdTcyNDdcdTVCQjlcdTkxQ0YgXHUyMDE0XHUyMDE0IFx1NEUwMFx1NUM0Rlx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1MzAwMlx1NTdGQVx1NEU4RVx1NUY1M1x1NTI0RFx1N0IxNFx1OEJCMFx1NzY4NFx1NUI5RVx1NjVGNiBTbGlkZXMgXHU1RTAzXHU1QzQwXHU3NTFGXHU2MjEwXHVGRjFCXHU2MjQwXHU2NzA5XHU2NTcwXHU1QjU3XHU2MzA5XHU1RjUzXHU1MjREIFVJIFx1NkJENFx1NEY4Qlx1NUI5RVx1NkQ0Qi9cdTYzQThcdTdCOTdcdTMwMDJgLFxuICAgIGBgLFxuICAgIC4uLnpoQ29udGV4dCgpLFxuICAgIGBgLFxuICAgIGBcdTUxRTBcdTRGNTVcdUZGMUFcdTVDNEZcdTVFNTUgJHttLnZpZXdwb3J0LndpZHRofVx1MDBENyR7bS52aWV3cG9ydC5oZWlnaHR9cHhcdUZGMUJcdTY1ODdcdTVCNTdcdTUzM0EgJHttLnRleHQud2lkdGh9XHUwMEQ3JHttLnRleHQuaGVpZ2h0fXB4XHUzMDAyJHtiYXJ9ICR7dGl0bGV9YCxcbiAgICBgYCxcbiAgICBgXHU2NTg3XHU1QjU3XHU1M0MyXHU2NTcwXHVGRjA4XHU2QjYzXHU2NTg3ICR7Zm10KG0uYm9keS5mb250U2l6ZSl9cHhcdUZGMDlcdUZGMUFgLFxuICAgIGBcdTZCQ0ZcdTg4NENcdTdFQTYgJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5jamspfSBcdTRFMkFcdTZDNDlcdTVCNTcgLyAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmxhdGluKX0gXHU0RTJBXHU2MkM5XHU0RTAxXHU1QjU3XHU3QjI2XHVGRjFCXHU2QjYzXHU2NTg3XHU4ODRDXHU5QUQ4ICR7Zm10KG0uYm9keS5saW5lSGVpZ2h0KX1weFx1MzAwMmAsXG4gICAgYm94U3RyKFwiSDFcIiwgbS5oMSksXG4gICAgYm94U3RyKFwiSDJcIiwgbS5oMiksXG4gICAgYm94U3RyKFwiSDNcIiwgbS5oMyksXG4gICAgYm94U3RyKFxuICAgICAgXCJcdTUyMTdcdTg4NjhcdTk4NzlcIixcbiAgICAgIG0uYnVsbGV0ID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmJ1bGxldC5pdGVtSGVpZ2h0IH0gOiBudWxsLFxuICAgICksXG4gICAgYm94U3RyKFwiXHU0RUUzXHU3ODAxXHU4ODRDXCIsIG0uY29kZSA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5jb2RlLmxpbmVIZWlnaHQgfSA6IG51bGwpLFxuICBdXG4gICAgLmNvbmNhdChpbWcgPyBbaW1nXSA6IFtdKVxuICAgIC5jb25jYXQoW2BgLCBgXHU1QkI5XHU5MUNGXHVGRjFBJHtzYW1wbGVzfVx1MzAwMmAsIGBgLCBub3RlXSlcbiAgICAuam9pbihcIlxcblwiKTtcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIGNhcGFjaXR5IHByb21wdC4gRm9sbG93cyB0aGUgT2JzaWRpYW4gVUkgbGFuZ3VhZ2UgdmlhIGBsb2NhbGVgXG4gKiAobWVhc3VyZWQgc2VwYXJhdGVseSBmcm9tIHRoZSBhcHApLiBUaGUgYG5vdGVgIHRhaWwgc3RhdGVzIHRoZSBwb2xpY3lcbiAqICh3aGF0IGZpdHMgb25lIHNjcmVlbikgXHUyMDE0IHNhbWUgd29yZGluZyBpbiBib3RoIGxhbmd1YWdlcyB3aGVyZSBwb3NzaWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdENhcGFjaXR5KG06IFNsaWRlTWV0cmljcywgYzogQ2FwYWNpdHlSZXN1bHQsIGxvY2FsZTogXCJ6aFwiIHwgXCJlblwiKTogc3RyaW5nIHtcbiAgY29uc3Qgbm90ZSA9XG4gICAgbG9jYWxlID09PSBcInpoXCJcbiAgICAgID8gXCJcdTc1MjhcdTZDRDVcdUZGMUFcdTc1MjhcdTYyMzdcdTRGMUFcdTYzRDBcdTRGOUJcdTY3NTBcdTY1OTlcdTVFNzZcdThCRjRcdTMwMENcdTU3RkFcdTRFOEVcdThCRTVcdTY3NTBcdTY1OTlcdTUyMzZcdTRGNUMgc2xpZGVzL1BQVCBcdTdCMTRcdThCQjBcdTMwMERcdUZGMUJcdTZCNjRcdTY1RjZcdTYzMDlcdTRFMEFcdTY1ODdcdTdFQTZcdTVCOUFcdTUyMUJcdTVFRkEgZGVjayBcdTIwMTRcdTIwMTQgXHU1MTQ4XHU0RTg2XHU4OUUzXHU2NzUwXHU2NTk5XHU1RTc2XHU3RUQ5XHU1MUZBXHU2M0QwXHU3RUIyL1x1ODlDNFx1NTIxMlx1RkYwQ1x1NTE4RFx1OTAxMFx1OTg3NVx1NzUxRlx1NjIxMFx1N0IxNFx1OEJCMFx1RkYxQlx1NkJDRlx1NEUyQVx1NTM2MVx1NzI0N1x1RkYwOFx1N0IxNFx1OEJCMFx1RkYwOVx1NTE4NVx1NjUzRVx1NjA3MFx1NTIzMFx1NTk3RFx1NTkwNFx1NzY4NFx1NTE4NVx1NUJCOVx1RkYwQ1x1NEUwRFx1ODk4MVx1OEQ4NVx1NTFGQVx1NUJCOVx1OTFDRlx1MzAwMlx1ODk4MVx1NkM0Mlx1RkYxQVx1NzUxRlx1NjIxMFx1NzY4NFx1NTE4NVx1NUJCOVx1NUZDNVx1OTg3Qlx1NjUzRVx1NTcyOFx1NUY1M1x1NTI0RFx1OEZEOVx1NEUwMFx1NUM0Rlx1NTE4NVx1RkYwQ1x1NEUwRFx1NkVEQVx1NTJBOFx1RkYxQlx1NzUyOFx1NEUwQVx1OTc2Mlx1NzY4NFx1NTFFMFx1NEY1NVx1NEUwRVx1ODg0Q1x1OUFEOFx1NjU3MFx1NUI1N1x1NjgzOFx1N0I5N1x1NjAzQlx1OUFEOFx1NUVBNlx1RkYwOFx1NkI2M1x1NjU4N1x1ODg0Q1x1NjU3MCBcdTAwRDcgXHU4ODRDXHU5QUQ4ICsgXHU2ODA3XHU5ODk4XHU5ODg0XHU3NTU5ICsgXHU1NzU3XHU5NUY0XHU5NUY0XHU4REREIFx1MjI2NCBcdTY1ODdcdTVCNTdcdTUzM0FcdTlBRDhcdTVFQTZcdUZGMDlcdTMwMDJcIlxuICAgICAgOiBcIlVzYWdlOiB0aGUgdXNlciB3aWxsIHByb3ZpZGUgbWF0ZXJpYWwgYW5kIGFzayB0byBtYWtlIHNsaWRlcy9QUFQgbm90ZXMgZm9yIGl0OyBpbiB0aGF0IGNhc2UgY3JlYXRlIGEgZGVjayBwZXIgdGhlIGNvbnZlbnRpb25zIGFib3ZlIFx1MjAxNCByZXZpZXcgdGhlIG1hdGVyaWFsIGFuZCBvdXRsaW5lIHRoZSBzdHJ1Y3R1cmUgZmlyc3QsIHRoZW4gZ2VuZXJhdGUgZWFjaCBzbGlkZSBub3RlOyBrZWVwIGVhY2ggY2FyZCdzIGNvbnRlbnQganVzdCB3aXRoaW4gY2FwYWNpdHkuIFJlcXVpcmVtZW50OiB0aGUgZ2VuZXJhdGVkIGNvbnRlbnQgbXVzdCBmaXQgdGhpcyBvbmUgc2NyZWVuIFx1MjAxNCBubyBzY3JvbGxpbmcuIENoZWNrIHRoZSB0b3RhbCBoZWlnaHQgd2l0aCB0aGUgbnVtYmVycyBhYm92ZSAobGluZXMgXHUwMEQ3IGxpbmUtaGVpZ2h0ICsgdGl0bGUgcmVzZXJ2ZSArIGludGVyLWJsb2NrIHNwYWNpbmcgXHUyMjY0IHRleHQgYXJlYSBoZWlnaHQpLlwiO1xuICByZXR1cm4gbG9jYWxlID09PSBcInpoXCIgPyB6aFByb21wdChtLCBjLCBub3RlKSA6IGVuUHJvbXB0KG0sIGMsIG5vdGUpO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9tb2RlXCI7XG5cbi8qKlxuICogVHlwb2dyYXBoeS1tZWFzdXJlbWVudCB0b29saW5nIChkZXYgYnVpbGRzIG9ubHkpLlxuICpcbiAqIFRoZSBgbnMtZGVidWctc3R5bGVzYCBjb21tYW5kIHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyBpblxuICogZWRpdCAoTGl2ZSBQcmV2aWV3KSBhbmQgdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldywgbWVyZ2VzIHRoZVxuICogcmVzdWx0cywgY29tcHV0ZXMgYW4gZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kIHdyaXRlcyBpdCB0b1xuICogLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC4gUmVnaXN0ZXJlZCBvbmx5IHdoZW4gdGhlXG4gKiBidWlsZC10aW1lIERFVl9NT0RFIGZsYWcgaXMgdHJ1ZTsgcmVsZWFzZSBidWlsZHMgdHJlZS1zaGFrZSB0aGlzIG1vZHVsZSBvdXQuXG4gKi9cblxuLyoqIEZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyB1c2VkIGJ5IHRoZSBkZWJ1ZyBjb21tYW5kIChlZGl0IHNpZGUpICovXG5leHBvcnQgY29uc3QgU0FNUExFX05PVEVfTkFNRVMgPSBbXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtaGVhZGluZ3NcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1saXN0XCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtY29kZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLXF1b3RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbWVkaWFcIixcbl07XG5cbi8qKiBTdHlsZSBzZWN0aW9ucyBzYW1wbGVkIGJ5IHNhbXBsZVN0eWxlcygpIGFuZCBjb21wYXJlZCBieSBkaWZmRHVtcHMoKSAqL1xuY29uc3QgU1RZTEVfU0VDVElPTlMgPSBbXG4gIFwiY29udGFpbmVyXCIsXG4gIFwicGFyYWdyYXBoXCIsXG4gIFwiaDFcIixcbiAgXCJsaXN0SXRlbVwiLFxuICBcImNvZGVCbG9ja1wiLFxuICBcImJsb2NrcXVvdGVcIixcbiAgXCJpbmxpbmVDb2RlXCIsXG4gIFwidGFibGVcIixcbiAgXCJpbWFnZVwiLFxuICBcImhvcml6b250YWxSdWxlXCIsXG5dO1xuXG4vKiogUHJvbWlzZS1iYXNlZCBzbGVlcCAqL1xuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHdpbmRvdy5zZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbi8qKlxuICogTWVyZ2Ugbm9uLW1pc3Npbmcgc3R5bGUgc2VjdGlvbnMgb2YgYSBmcmVzaCBzYW1wbGUgaW50byB0aGUgdGFyZ2V0XG4gKiAoZmlyc3Qgbm9uLW1pc3NpbmcgdmFsdWUgd2lucykuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlU2FtcGxlKHRhcmdldDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHNhbXBsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCBrZXkgb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBzZWN0aW9uID0gc2FtcGxlW2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlY3Rpb24gfHwgXCIobWlzc2luZylcIiBpbiBzZWN0aW9uKSBjb250aW51ZTtcbiAgICBjb25zdCBleGlzdGluZyA9IHRhcmdldFtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKGV4aXN0aW5nICYmICEoXCIobWlzc2luZylcIiBpbiBleGlzdGluZykpIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc2VjdGlvbjtcbiAgfVxuICAvLyBQcm9iZSBmaWVsZHMgcmlkZSBhbG9uZyAoZmlyc3Qgbm9uLWVtcHR5IHdpbnMpXG4gIGZvciAoY29uc3Qga2V5IG9mIFtcbiAgICBcImxpc3RMaW5lc1wiLFxuICAgIFwibWV0YWRhdGFDb250YWluZXJEaXNwbGF5XCIsXG4gICAgXCJoMU9mZnNldFRvcFwiLFxuICAgIFwiaDFUb3BJbkNvbnRlbnRcIixcbiAgICBcImgxTGVmdEluQ29udGVudFwiLFxuICAgIFwidGl0bGVcIixcbiAgICBcImNvbnRlbnRDaGlsZHJlblwiLFxuICAgIFwidG9wQ2hhaW5cIixcbiAgXSkge1xuICAgIGNvbnN0IHByb2JlID0gc2FtcGxlW2tleV07XG4gICAgaWYgKHByb2JlID09PSB1bmRlZmluZWQgfHwgcHJvYmUgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb2JlKSAmJiBwcm9iZS5sZW5ndGggPT09IDApIGNvbnRpbnVlO1xuICAgIGlmICh0eXBlb2YgcHJvYmUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvYmUpICYmIE9iamVjdC5rZXlzKHByb2JlKS5sZW5ndGggPT09IDApXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAodGFyZ2V0W2tleV0gPT09IHVuZGVmaW5lZCkgdGFyZ2V0W2tleV0gPSBwcm9iZTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBhcmUgdGhlIHN0eWxlIHNlY3Rpb25zIG9mIGFuIGVkaXQgZHVtcCBhbmQgYSByZWFkaW5nIGR1bXA7IG9ubHlcbiAqIGtleXMgd2hvc2UgdmFsdWVzIGRpZmZlciBhcmUga2VwdCwgYXMgeyBrZXk6IHsgZWRpdCwgcmVhZGluZyB9IH0uXG4gKi9cbmZ1bmN0aW9uIGRpZmZEdW1wcyhcbiAgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3Qgc2VjdGlvbiBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IGUgPSAoZWRpdFtzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCByID0gKHJlYWRpbmdbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGUpLCAuLi5PYmplY3Qua2V5cyhyKV0pO1xuICAgIGNvbnN0IGRpZmZzOiBSZWNvcmQ8c3RyaW5nLCB7IGVkaXQ6IHN0cmluZzsgcmVhZGluZzogc3RyaW5nIH0+ID0ge307XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgaWYgKGVba2V5XSAhPT0gcltrZXldKSB7XG4gICAgICAgIGRpZmZzW2tleV0gPSB7IGVkaXQ6IGVba2V5XSA/PyBcIihtaXNzaW5nKVwiLCByZWFkaW5nOiByW2tleV0gPz8gXCIobWlzc2luZylcIiB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoZGlmZnMpLmxlbmd0aCA+IDApIG91dFtzZWN0aW9uXSA9IGRpZmZzO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBTYW1wbGUgdGhlIGN1cnJlbnQgdmlldydzIHR5cG9ncmFwaHkgY29tcHV0ZWQgc3R5bGVzICsgQ1NTIHZhcmlhYmxlcyAqL1xuZnVuY3Rpb24gc2FtcGxlU3R5bGVzKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHJldHVybiBudWxsO1xuICBjb25zdCBpc0VkaXQgPSB2aWV3LmdldE1vZGUoKSA9PT0gXCJzb3VyY2VcIjtcbiAgY29uc3QgY29udGVudEVsID0gdmlldy5jb250ZW50RWw7XG4gIC8vIEZpcnN0IG1hdGNoaW5nIGNhbmRpZGF0ZSB3aW5zIFx1MjAxNCBlZGl0IChjbTYpIGFuZCByZWFkaW5nIHVzZVxuICAvLyBkaWZmZXJlbnQgZWxlbWVudCBzdHJ1Y3R1cmVzIChlLmcuIG5vIHByZS9ibG9ja3F1b3RlIGluIGNtNikuXG4gIGNvbnN0IHBpY2sgPSAoc2Vsczogc3RyaW5nW10pOiBIVE1MRWxlbWVudCB8IG51bGwgPT4ge1xuICAgIGZvciAoY29uc3Qgc2VsIG9mIHNlbHMpIHtcbiAgICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgICBpZiAoZWwpIHJldHVybiBlbDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGNvbnN0IHN0eWxlID0gKGVsOiBIVE1MRWxlbWVudCB8IG51bGwsIHByb3BzOiBzdHJpbmdbXSk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xuICAgIGlmICghZWwpIHJldHVybiB7IFwiKG1pc3NpbmcpXCI6IFwiZWxlbWVudCBub3QgaW4gdGhpcyBub3RlXCIgfTtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcCBvZiBwcm9wcykge1xuICAgICAgY29uc3QgdiA9IGNzLmdldFByb3BlcnR5VmFsdWUocCkudHJpbSgpO1xuICAgICAgaWYgKHYpIG91dFtwXSA9IHY7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG4gIGNvbnN0IHZhcnMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xuICBjb25zdCBjc3NWYXIgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHZhcnMuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKS50cmltKCk7XG5cbiAgY29uc3QgY29udGFpbmVyID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWNvbnRlbnRcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiLFxuICBdKTtcbiAgY29uc3QgcGFyYSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1saW5lOm5vdCguSHlwZXJNRC1oZWFkZXIpXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcFwiLFxuICBdKTtcbiAgY29uc3QgaDEgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1oZWFkZXItMVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGgxXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaDFcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoMVwiLFxuICBdKTtcbiAgY29uc3QgbGlzdEl0ZW0gPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgICBpc0VkaXQgPyBcIi5IeXBlck1ELWxpc3QtbGluZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICBdKTtcbiAgY29uc3QgcHJlID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgcHJlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tZWRpdGluZyBwcmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELWNvZGVibG9ja1wiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICBdKTtcbiAgY29uc3QgcXVvdGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGJsb2NrcXVvdGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBibG9ja3F1b3RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtcXVvdGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBibG9ja3F1b3RlXCIsXG4gIF0pO1xuICBjb25zdCBpbmxpbmVDb2RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBjb2RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgY29kZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1pbmxpbmUtY29kZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGNvZGVcIixcbiAgXSk7XG4gIGNvbnN0IHRhYmxlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IHRhYmxlXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSB0YWJsZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdGFibGVcIixcbiAgXSk7XG4gIGNvbnN0IGltZyA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaW1nXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGltZ1wiLFxuICAgIFwiaW1nXCIsIC8vIHdob2xlLWRvY3VtZW50IGZhbGxiYWNrXG4gIF0pO1xuICBjb25zdCBociA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaHJcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20taHJcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICBdKTtcblxuICAvLyBTdHJ1Y3R1cmUgcHJvYmVzIChlZGl0IHZpZXcgb25seSk6IHRoZSBzb3VyY2UtdmlldyBjbGFzcyBsaXN0XG4gIC8vIChjb25maXJtcyB0aGUgTGl2ZSBQcmV2aWV3IG1hcmtlciBjbGFzcykgYW5kIHVuaXF1ZSBlbGVtZW50IHRhZ3NcbiAgLy8gaW5zaWRlIHRoZSBlZGl0b3IgKHJldmVhbHMgaG93IGNtNiByZW5kZXJzIGNvZGUgYmxvY2tzIGV0Yy4gd2hlblxuICAvLyB0aGUgdXN1YWwgc2VsZWN0b3JzIGRvIG5vdCBtYXRjaCkuXG4gIGNvbnN0IHNvdXJjZVZpZXdDbGFzcyA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTZcIik/LmNsYXNzTmFtZSA/PyBcIlwiO1xuICBjb25zdCBkb21UYWdzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29uc3QgdGFncyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGNvbnRlbnRFbFxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAqXCIpXG4gICAgICAuZm9yRWFjaCgoZWwpID0+IHRhZ3MuYWRkKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSkpO1xuICAgIGRvbVRhZ3MucHVzaCguLi50YWdzKTtcbiAgfVxuICAvLyBMaXN0LWxpbmUgcHJvYmUgKGVkaXQgdmlldyBvbmx5KTogY2xhc3MgbmFtZXMgKyBjb21wdXRlZCBwYWRkaW5nXG4gIC8vIG9mIHRoZSBmaXJzdCBsaXN0IGxpbmVzIFx1MjAxNCBuZXN0ZWQgbGV2ZWxzIG9mdGVuIHVzZSBkaXN0aW5jdFxuICAvLyBjbGFzc2VzIG9yIGlubGluZSBwYWRkaW5ncywgd2hpY2ggZGVjaWRlcyB3aGV0aGVyIGEgbGV2ZWwtYXdhcmVcbiAgLy8gaW5kZW50IG92ZXJyaWRlIGlzIGV2ZW4gcG9zc2libGUuXG4gIGNvbnN0IGxpc3RMaW5lczogeyBjbGFzc05hbWU6IHN0cmluZzsgcGFkZGluZ0xlZnQ6IHN0cmluZyB9W10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yQWxsKFwiLkh5cGVyTUQtbGlzdC1saW5lXCIpLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICBpZiAoaSA+PSA0KSByZXR1cm47XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgbGlzdExpbmVzLnB1c2goe1xuICAgICAgICBjbGFzc05hbWU6IGVsLmNsYXNzTmFtZSxcbiAgICAgICAgcGFkZGluZ0xlZnQ6IGNzLmdldFByb3BlcnR5VmFsdWUoXCJwYWRkaW5nLWxlZnRcIikudHJpbSgpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gRnJvbnRtYXR0ZXIgcHJvYmVzOiBkb2VzIHRoZSAoaGlkZGVuKSBwcm9wZXJ0aWVzIGFyZWEgc3RpbGxcbiAgLy8gb2NjdXB5IHNwYWNlIGluIExpdmUgUHJldmlldz8gQW5kIGhvdyBmYXIgaXMgdGhlIEgxIGZyb20gdGhlXG4gIC8vIHRvcCBvZiB0aGUgY29udGVudCBhcmVhPyAocmVhZGluZyBtb2RlIGhhcyBubyBzdWNoIHBhZGRpbmcpXG4gIGNvbnN0IG1ldGFkYXRhRGlzcGxheSA9ICgoKSA9PiB7XG4gICAgY29uc3Qgc2VsID0gaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiO1xuICAgIGNvbnN0IGVsID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHNlbCk7XG4gICAgcmV0dXJuIGVsID8gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSA6IFwiKG5vdCBpbiBET00pXCI7XG4gIH0pKCk7XG4gIGNvbnN0IGgxT2Zmc2V0VG9wID0gKCgpID0+IHtcbiAgICBpZiAoIWgxKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB0b3AgPSAwO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBoMTtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgdG9wICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgICAgbm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRvcDtcbiAgfSkoKTtcbiAgLy8gV2hhdCBvY2N1cGllcyB0aGUgc3BhY2UgYmV0d2VlbiB0aGUgY29udGVudCB0b3AgYW5kIHRoZSBIMT9cbiAgLy8gKGVkaXQpIGZpcnN0IGNoaWxkcmVuIG9mIC5jbS1jb250ZW50LCBhbmQgdGhlIG5ldCBIMSBkaXN0YW5jZVxuICAvLyBmcm9tIHRoZSBjb250ZW50IGFuY2hvciBcdTIwMTQgcmVhZGluZyBoYXMgbm8gc3VjaCBnYXAuXG4gIGNvbnN0IGFuY2hvciA9IGlzRWRpdFxuICAgID8gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIilcbiAgICA6IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlld1wiKTtcbiAgY29uc3QgaDFUb3BJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wKTtcbiAgfSkoKTtcbiAgY29uc3QgaDFMZWZ0SW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KTtcbiAgfSkoKTtcbiAgY29uc3QgY29udGVudENoaWxkcmVuID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhbmNob3IuY2hpbGRyZW4pXG4gICAgICAuc2xpY2UoMCwgNClcbiAgICAgIC5tYXAoKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY2xzOiAoZWwgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTmFtZSB8fCBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSxcbiAgICAgICAgICBtYXJnaW5Ub3A6IGNzLm1hcmdpblRvcCxcbiAgICAgICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogY3MubWFyZ2luQm90dG9tLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IGNzLnBhZGRpbmdCb3R0b20sXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfSkoKTtcbiAgLy8gQ29udGFpbmVyIGNoYWluIHByb2JlOiBmcm9tIC5jbS1jb250ZW50IHVwIHRvIHRoZSB2aWV3LWNvbnRlbnQsXG4gIC8vIGVhY2ggd3JhcHBlcidzIHBhZGRpbmcvbWFyZ2luIFx1MjAxNCBsb2NhdGVzIHRoZSBsZWZ0b3ZlciB2ZXJ0aWNhbFxuICAvLyBvZmZzZXQgYmV0d2VlbiBlZGl0IGFuZCByZWFkaW5nIGNvbnRlbnQgYXJlYXMuXG4gIGNvbnN0IHRvcENoYWluID0gKCgpID0+IHtcbiAgICBpZiAoIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBwYXJ0czogeyBjbHM6IHN0cmluZzsgcGFkVG9wOiBzdHJpbmc7IG1hclRvcDogc3RyaW5nIH1bXSA9IFtdO1xuICAgIGxldCBub2RlOiBIVE1MRWxlbWVudCB8IG51bGwgPSBhbmNob3I7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIHBhcnRzLnB1c2goe1xuICAgICAgICBjbHM6IG5vZGUuY2xhc3NOYW1lIHx8IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBwYWRUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgIG1hclRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgfSk7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFydHM7XG4gIH0pKCk7XG5cbiAgLy8gVGl0bGUgcHJvYmU6IHRoZSBnZW5lcmF0ZWQgOjpiZWZvcmUgaW4gU2xpZGVzIG1vZGUgKHdoZW4gYSB0aXRsZSBpc1xuICAvLyBjb25maWd1cmVkKS4gQ2FwdHVyZXMgaXRzIGNvbXB1dGVkIHN0eWxlIHNvIHdlIGNhbiBkaWZmIGl0IGFnYWluc3QgdGhlXG4gIC8vIGJvZHkgSDEgKC5jbS1oZWFkZXItMSkgYW5kIGFsaWduIHRoZW0gZXhhY3RseS5cbiAgY29uc3QgdGl0bGVCZWZvcmUgPSAoKCkgPT4ge1xuICAgIGlmICghaXNFZGl0KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKTtcbiAgICBpZiAoIWNvbnRlbnQgfHwgIWNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQsIFwiOjpiZWZvcmVcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IGNzLmNvbnRlbnQsXG4gICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgcG9zaXRpb246IGNzLnBvc2l0aW9uLFxuICAgICAgdG9wOiBjcy50b3AsXG4gICAgICBsZWZ0OiBjcy5sZWZ0LFxuICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgIGZvbnRGYW1pbHk6IGNzLmZvbnRGYW1pbHksXG4gICAgICBmb250U2l6ZTogY3MuZm9udFNpemUsXG4gICAgICBsaW5lSGVpZ2h0OiBjcy5saW5lSGVpZ2h0LFxuICAgICAgZm9udFdlaWdodDogY3MuZm9udFdlaWdodCxcbiAgICAgIGZvbnRWYXJpYW50OiBjcy5mb250VmFyaWFudCxcbiAgICAgIGNvbG9yOiBjcy5jb2xvcixcbiAgICAgIGxldHRlclNwYWNpbmc6IGNzLmxldHRlclNwYWNpbmcsXG4gICAgICB0ZXh0VHJhbnNmb3JtOiBjcy50ZXh0VHJhbnNmb3JtLFxuICAgICAgd29yZFNwYWNpbmc6IGNzLndvcmRTcGFjaW5nLFxuICAgICAgZm9udEtlcm5pbmc6IGNzLmZvbnRLZXJuaW5nLFxuICAgICAgZm9udEZlYXR1cmVTZXR0aW5nczogY3MuZm9udEZlYXR1cmVTZXR0aW5ncyxcbiAgICAgIGZvbnRWYXJpYW50TnVtZXJpYzogY3MuZm9udFZhcmlhbnROdW1lcmljLFxuICAgICAgZm9udFZhcmlhbnRMaWdhdHVyZXM6IGNzLmZvbnRWYXJpYW50TGlnYXR1cmVzLFxuICAgICAgZm9udFZhcmlhbnRDYXBzOiBjcy5mb250VmFyaWFudENhcHMsXG4gICAgfTtcbiAgfSkoKTtcblxuICBjb25zdCBkdW1wID0ge1xuICAgIG1vZGU6IGlzRWRpdCA/IFwiZWRpdCAoTGl2ZSBQcmV2aWV3KVwiIDogXCJyZWFkaW5nXCIsXG4gICAgLy8gU2xpZGVzIHN0eWxpbmcgb25seSBhcHBsaWVzIHdoZW4gU2xpZGVzIG1vZGUgaXMgb25cbiAgICBzbGlkZXNBY3RpdmU6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpLFxuICAgIGRvbVRhZ3M6IGlzRWRpdCA/IGRvbVRhZ3MgOiB1bmRlZmluZWQsXG4gICAgc291cmNlVmlld0NsYXNzOiBpc0VkaXQgPyBzb3VyY2VWaWV3Q2xhc3MgOiB1bmRlZmluZWQsXG4gICAgbGl2ZVByZXZpZXc6IGlzRWRpdCA/IGlzTGl2ZVByZXZpZXcoYXBwKSA6IHVuZGVmaW5lZCxcbiAgICBsaXN0TGluZXM6IGlzRWRpdCA/IGxpc3RMaW5lcyA6IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXk6IG1ldGFkYXRhRGlzcGxheSxcbiAgICBoMU9mZnNldFRvcDogaDFPZmZzZXRUb3AsXG4gICAgaDFUb3BJbkNvbnRlbnQ6IGgxVG9wSW5Db250ZW50LFxuICAgIGgxTGVmdEluQ29udGVudDogaDFMZWZ0SW5Db250ZW50LFxuICAgIGNvbnRlbnRDaGlsZHJlbjogY29udGVudENoaWxkcmVuLFxuICAgIHRvcENoYWluOiB0b3BDaGFpbixcbiAgICB0aXRsZTogdGl0bGVCZWZvcmUsXG4gICAgY29udGFpbmVyOiBzdHlsZShjb250YWluZXIsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1heC13aWR0aFwiLFxuICAgICAgXCJ3aWR0aFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgcGFyYWdyYXBoOiBzdHlsZShwYXJhLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBoMTogc3R5bGUoaDEsIFtcbiAgICAgIFwiZm9udC1mYW1pbHlcIixcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcImZvbnQtd2VpZ2h0XCIsXG4gICAgICBcImZvbnQtdmFyaWFudFwiLFxuICAgICAgXCJjb2xvclwiLFxuICAgICAgXCJsZXR0ZXItc3BhY2luZ1wiLFxuICAgICAgXCJ0ZXh0LXRyYW5zZm9ybVwiLFxuICAgICAgXCJ3b3JkLXNwYWNpbmdcIixcbiAgICAgIFwiZm9udC1rZXJuaW5nXCIsXG4gICAgICBcImZvbnQtZmVhdHVyZS1zZXR0aW5nc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbnVtZXJpY1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtbGlnYXR1cmVzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1jYXBzXCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgbGlzdEl0ZW06IHN0eWxlKGxpc3RJdGVtLCBbXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGNvZGVCbG9jazogc3R5bGUocHJlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICBibG9ja3F1b3RlOiBzdHlsZShxdW90ZSwgW1xuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwiYm9yZGVyLWxlZnQtd2lkdGhcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgIF0pLFxuICAgIGlubGluZUNvZGU6IHN0eWxlKGlubGluZUNvZGUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctYm90dG9tXCIsXG4gICAgICBcInBhZGRpbmctbGVmdFwiLFxuICAgICAgXCJwYWRkaW5nLXJpZ2h0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIHRhYmxlOiBzdHlsZSh0YWJsZSwgW1wiZm9udC1zaXplXCIsIFwibGluZS1oZWlnaHRcIiwgXCJ3aWR0aFwiLCBcImJvcmRlci1jb2xsYXBzZVwiXSksXG4gICAgaW1hZ2U6IHN0eWxlKGltZywgW1wiZGlzcGxheVwiLCBcIm1hcmdpbi1sZWZ0XCIsIFwibWFyZ2luLXJpZ2h0XCIsIFwibWF4LXdpZHRoXCIsIFwid2lkdGhcIl0pLFxuICAgIGhvcml6b250YWxSdWxlOiBzdHlsZShociwgW1wibWFyZ2luLXRvcFwiLCBcIm1hcmdpbi1ib3R0b21cIiwgXCJib3JkZXItdG9wLXdpZHRoXCIsIFwiaGVpZ2h0XCJdKSxcbiAgICBjc3NWYXJpYWJsZXM6IHtcbiAgICAgIFwiLS1mb250LXRleHRcIjogY3NzVmFyKFwiLS1mb250LXRleHRcIiksXG4gICAgICBcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCI6IGNzc1ZhcihcIi0tbGluZS1oZWlnaHQtbm9ybWFsXCIpLFxuICAgICAgXCItLWgxLXNpemVcIjogY3NzVmFyKFwiLS1oMS1zaXplXCIpLFxuICAgICAgXCItLWgxLWxpbmUtaGVpZ2h0XCI6IGNzc1ZhcihcIi0taDEtbGluZS1oZWlnaHRcIiksXG4gICAgICBcIi0taDEtd2VpZ2h0XCI6IGNzc1ZhcihcIi0taDEtd2VpZ2h0XCIpLFxuICAgICAgXCItLWgxLXZhcmlhbnRcIjogY3NzVmFyKFwiLS1oMS12YXJpYW50XCIpLFxuICAgICAgXCItLWgxLWNvbG9yXCI6IGNzc1ZhcihcIi0taDEtY29sb3JcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLXRvcFwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi10b3BcIiksXG4gICAgICBcIi0taDEtbWFyZ2luLWJvdHRvbVwiOiBjc3NWYXIoXCItLWgxLW1hcmdpbi1ib3R0b21cIiksXG4gICAgICBcIi0tcC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tcC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3Qtc3BhY2luZ1wiOiBjc3NWYXIoXCItLWxpc3Qtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LWluZGVudFwiOiBjc3NWYXIoXCItLWxpc3QtaW5kZW50XCIpLFxuICAgICAgXCItLWNvZGUtc2l6ZVwiOiBjc3NWYXIoXCItLWNvZGUtc2l6ZVwiKSxcbiAgICAgIFwiLS1jb2RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1jb2RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tY29kZS1yYWRpdXNcIjogY3NzVmFyKFwiLS1jb2RlLXJhZGl1c1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLXBhZGRpbmdcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1ib3JkZXItdGhpY2tuZXNzXCIpLFxuICAgICAgXCItLWZpbGUtbWFyZ2luc1wiOiBjc3NWYXIoXCItLWZpbGUtbWFyZ2luc1wiKSxcbiAgICAgIFwiLS1maWxlLWxpbmUtd2lkdGhcIjogY3NzVmFyKFwiLS1maWxlLWxpbmUtd2lkdGhcIiksXG4gICAgICBcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiOiBjc3NWYXIoXCItLW5vcm1hbC1mb250LXNpemVcIiksXG4gICAgICBcIi0tZm9udC10ZXh0LXNpemVcIjogY3NzVmFyKFwiLS1mb250LXRleHQtc2l6ZVwiKSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gZHVtcDtcbn1cblxuLyoqXG4gKiBEZWJ1ZyB0eXBvZ3JhcGh5OiBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgKGVhY2hcbiAqIGNvdmVyaW5nIGEgZ3JvdXAgb2YgZWxlbWVudHMgXHUyMDE0IGFsbCB2aXNpYmxlIHdpdGhvdXQgc2Nyb2xsaW5nKSxcbiAqIHRoZW4gdGhlIGtpdGNoZW4tc2luayBub3RlIGluIHJlYWRpbmcgdmlldyAobm8gdmlydHVhbGl6YXRpb25cbiAqIHRoZXJlKSwgbWVyZ2VzIGV2ZXJ5dGhpbmcsIGNvbXB1dGVzIHRoZSBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmRcbiAqIHdyaXRlcyBpdCB0byAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LlxuICogVGhlIHVzZXIncyBvd24gbm90ZSBpcyByZXN0b3JlZCBhdCB0aGUgZW5kLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZHVtcFR5cG9ncmFwaHkocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYXBwID0gcGx1Z2luLmFwcDtcbiAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBlbnRlciBTbGlkZXMgbW9kZSBmaXJzdCAoTW9kK1NoaWZ0K0Ugb24gYSBkZWNrIG5vdGUpXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBubyBhY3RpdmUgTWFya2Rvd24gbm90ZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc3RhcnRNb2RlID0gdmlldy5nZXRNb2RlKCk7XG4gIGNvbnN0IGFjdGl2ZUZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgY29uc3QgbGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG5cbiAgLy8gRWRpdCBzaWRlOiBlYWNoIHNob3J0IG5vdGUga2VlcHMgZXZlcnkgdGFyZ2V0IGVsZW1lbnQgb24gc2NyZWVuXG4gIGNvbnN0IGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBTQU1QTEVfTk9URV9OQU1FUykge1xuICAgIGNvbnN0IGYgPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGB0ZXN0cy8ke25hbWV9Lm1kYCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg1MDApO1xuICAgIGNvbnN0IHMgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgICBpZiAocykgbWVyZ2VTYW1wbGUoZWRpdCwgcyk7XG4gIH1cblxuICAvLyBSZWFkaW5nIHNpZGU6IHRoZSBraXRjaGVuLXNpbmsgbm90ZSByZW5kZXJzIGV2ZXJ5dGhpbmcgYXQgb25jZVxuICBsZXQgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsID0gbnVsbDtcbiAgY29uc3QgZGVtbyA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoXCJ0ZXN0cy90eXBvZ3JhcGh5LWRlbW8ubWRcIik7XG4gIGlmIChkZW1vIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGRlbW8sIHsgc3RhdGU6IHsgbW9kZTogXCJwcmV2aWV3XCIgfSB9KTtcbiAgICBhd2FpdCBzbGVlcCg4MDApO1xuICAgIHJlYWRpbmcgPSBzYW1wbGVTdHlsZXMoYXBwKTtcbiAgfVxuXG4gIC8vIFJlc3RvcmUgdGhlIHVzZXIncyBub3RlXG4gIGlmIChhY3RpdmVGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShhY3RpdmVGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IHN0YXJ0TW9kZSB9IH0pO1xuICAgIHBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cbiAgaWYgKCFyZWFkaW5nKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IHJlYWRpbmcgc2FtcGxlIGZhaWxlZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXlsb2FkID0geyBlZGl0LCByZWFkaW5nLCBkaWZmOiBkaWZmRHVtcHMoZWRpdCwgcmVhZGluZykgfTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBhcHAudmF1bHQuYWRhcHRlci53cml0ZShcIi5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb25cIiwgSlNPTi5zdHJpbmdpZnkocGF5bG9hZCwgbnVsbCwgMikpO1xuICAgIG5ldyBOb3RpY2UoXCJUeXBvZ3JhcGh5IGR1bXAgXHUyMTkyIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gKHZhdWx0IHJvb3QpXCIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCB3cml0ZSBkZWJ1ZyBmaWxlICgke1N0cmluZyhlcnJvcil9KWApO1xuICB9XG59XG5cbi8qKiBSZWdpc3RlciB0aGUgZGV2LW9ubHkgZGVidWcgY29tbWFuZCAoY2FsbGVkIG9ubHkgd2hlbiBERVZfTU9ERSBpcyB0cnVlKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtZGVidWctc3R5bGVzXCIsXG4gICAgbmFtZTogXCJEZWJ1ZzogZHVtcCB0eXBvZ3JhcGh5IHN0eWxlc1wiLFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbiksXG4gIH0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTW9kZSBvZiB0aGUgYWN0aXZlIE1hcmtkb3duIHZpZXc6ICdwcmV2aWV3Jz1yZWFkaW5nICdzb3VyY2UnPWVkaXRpbmcgJyc9bm9uZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRNb2RlKGFwcDogQXBwKTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiIHwgXCJcIiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgcmV0dXJuIHZpZXcgPyB2aWV3LmdldE1vZGUoKSA6IFwiXCI7XG59XG5cbi8qKlxuICogVHJ1ZSB3aGVuIHRoZSBhY3RpdmUgZWRpdCB2aWV3IGlzIExpdmUgUHJldmlldyAoU2xpZGVzKSBcdTIwMTQgYXNcbiAqIG9wcG9zZWQgdG8gU291cmNlIG1vZGUuIE9ic2lkaWFuIHJlcG9ydHMgYm90aCBhcyBtb2RlIFwic291cmNlXCI7XG4gKiB0aGUgdmlldyBzdGF0ZSBjYXJyaWVzIGEgYHNvdXJjZWAgZmxhZyAoU291cmNlIG1vZGUgPSB0cnVlKSwgd2l0aFxuICogYSBET00gY2xhc3MgZmFsbGJhY2sgKC5pcy1saXZlLXByZXZpZXcpIGZvciBzYWZldHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xpdmVQcmV2aWV3KGFwcDogQXBwKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSBcInNvdXJjZVwiKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN0YXRlID0gdmlldy5nZXRTdGF0ZSgpIGFzIHsgc291cmNlPzogYm9vbGVhbiB9O1xuICBpZiAoc3RhdGUuc291cmNlID09PSB0cnVlKSByZXR1cm4gZmFsc2U7XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IGZhbHNlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICEhdmlldy5jb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202LmlzLWxpdmUtcHJldmlld1wiKTtcbn1cblxuLyoqIEZyb250bWF0dGVyIG9mIGFueSBub3RlIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb250bWF0dGVyT2YoYXBwOiBBcHAsIGZpbGU6IFRGaWxlKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY2FjaGUgPSBhcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZmlsZSk7XG4gIHJldHVybiBjYWNoZT8uZnJvbnRtYXR0ZXIgPz8gbnVsbDtcbn1cblxuLyoqIEN1cnJlbnQgbm90ZSdzIGZyb250bWF0dGVyIGFzIGFuIG9iamVjdCwgb3IgbnVsbCB3aGVuIGFic2VudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2ZUZyb250bWF0dGVyKGFwcDogQXBwKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgZmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICByZXR1cm4gZmlsZSA/IGZyb250bWF0dGVyT2YoYXBwLCBmaWxlKSA6IG51bGw7XG59XG4iLCAiLyoqIEEgYnVpbHQtaW4gU2xpZGVzIHN0eWxlIHRlbXBsYXRlIChyZW5kZXJlZCBhcyBib2R5IGNsYXNzIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gKSAqL1xuZXhwb3J0IGludGVyZmFjZSBTbGlkZXNUaGVtZSB7XG4gIGlkOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG59XG5cbi8qKiBCdWlsdC1pbiBzdHlsZSB0ZW1wbGF0ZXMgZm9yIHRoZSBTbGlkZXMgY2FyZCArIGJhciAoYWxsIHRoZW1lLWFkYXB0aXZlKSAqL1xuZXhwb3J0IGNvbnN0IFNMSURFU19USEVNRVM6IHJlYWRvbmx5IFNsaWRlc1RoZW1lW10gPSBbXG4gIHsgaWQ6IFwianl5XCIsIGxhYmVsOiBcIkxlY3R1cmUgKGp5eSlcIiB9LFxuICB7IGlkOiBcImRhc2hlZFwiLCBsYWJlbDogXCJEYXNoZWQgb3V0bGluZVwiIH0sXG4gIHsgaWQ6IFwicGFwZXJcIiwgbGFiZWw6IFwiUGFwZXIgY2FyZFwiIH0sXG4gIHsgaWQ6IFwibWluaW1hbFwiLCBsYWJlbDogXCJNaW5pbWFsXCIgfSxcbiAgeyBpZDogXCJhY2NlbnRcIiwgbGFiZWw6IFwiQWNjZW50IGVkZ2VcIiB9LFxuICB7IGlkOiBcImdsYXNzXCIsIGxhYmVsOiBcIkZyb3N0ZWQgZ2xhc3NcIiB9LFxuXTtcblxuLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB7XG4gIC8qKiBTaG93IFx1MjVDMCBcdTI1QjYgcHJldmlvdXMvbmV4dCBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dOYXZCdXR0b25zOiBib29sZWFuO1xuICAvKiogUGFnZSBudW1iZXIgZGlzcGxheSBzdHlsZTogXCJmcmFjdGlvblwiID0gTiAvIFRvdGFsLCBcImN1cnJlbnRcIiA9IE4sIFwibm9uZVwiID0gaGlkZGVuICovXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgLyoqIFNob3cgYSB0aGluIGNsaWNrYWJsZSBwcm9ncmVzcyBsaW5lIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd1Byb2dyZXNzOiBib29sZWFuO1xuICAvKiogU2hvdyB0aGUgZW50aXJlIHNsaWRlcyBiYXIgKG1hc3RlciB0b2dnbGUpICovXG4gIHNob3dTbGlkZXNCYXI6IGJvb2xlYW47XG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIG1hbnVhbGx5IGhpZCB0aGUgc2xpZGVzIGJhciAodG9nZ2xlIGNvbW1hbmQpICovXG4gIGJhckhpZGRlbjogYm9vbGVhbjtcbiAgLyoqIEF1dG8tZW50ZXIgU2xpZGVzIG1vZGUgd2hlbiBvcGVuaW5nIGEgZGVjayBub3RlIChkZWZhdWx0IG9mZikgKi9cbiAgYXV0b0VudGVyU2xpZGVzOiBib29sZWFuO1xuICAvKiogUHJlc3MgRXNjYXBlIHRvIGV4aXQgU2xpZGVzIG1vZGUgKGRlZmF1bHQgb24pICovXG4gIGVzY0V4aXRzU2xpZGVzOiBib29sZWFuO1xuICAvKiogRnJvbnRtYXR0ZXIgcHJvcGVydHkgc2hvd24gYXMgdGhlIGNhcmQgdGl0bGUgKFwiXCIgPSBub25lLCBcImZpbGVuYW1lXCIgPSBmaWxlIG5hbWUpICovXG4gIHNsaWRlc1RpdGxlOiBzdHJpbmc7XG4gIC8qKiBTdHlsZSB0ZW1wbGF0ZSBpZCBmcm9tIFNMSURFU19USEVNRVMgKGNhcmQgKyBiYXIgYXBwZWFyYW5jZSkgKi9cbiAgc2xpZGVzVGhlbWU6IHN0cmluZztcbiAgLyoqIENvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyBmb3IgdGhlIHNsaWRlcyBiYXIgKGVtcHR5ID0gbm9uZSkgKi9cbiAgYmFyUHJvcGVydGllczogc3RyaW5nO1xuICAvKiogSlNPTiBhcnJheSBvZiBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIGJhciBwcm9wZXJ0aWVzIChkcmFnZ2FibGUgZGl2aWRlcnMpICovXG4gIGJhclByb3BlcnR5V2lkdGhzOiBzdHJpbmc7XG4gIC8qKiBBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHBhbmVsIChkZWZhdWx0IG9uKSAqL1xuICBjb25maXJtRGVsZXRlU2xpZGVzOiBib29sZWFuO1xuICAvKipcbiAgICogQmxvY2sgaW1hZ2UgZW1iZWRzIGFzIGNlbnRlcmVkIGNhcmQgYmxvY2tzIChkZWZhdWx0IG9uKS4gV2hlbiBvZmYsXG4gICAqIGltYWdlcyBrZWVwIE9ic2lkaWFuJ3MgbmF0aXZlIGlubGluZSBmbG93IFx1MjAxNCB0ZXh0IGZsb3dzIGFyb3VuZC9iZXNpZGVcbiAgICogdGhlbSBleGFjdGx5IGxpa2UgTGl2ZSBQcmV2aWV3IG91dHNpZGUgU2xpZGVzIG1vZGUuXG4gICAqL1xuICBpbWFnZUxheW91dDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0ge1xuICBzaG93TmF2QnV0dG9uczogdHJ1ZSxcbiAgcGFnZU51bWJlclN0eWxlOiBcIm5vbmVcIixcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBzaG93U2xpZGVzQmFyOiB0cnVlLFxuICBiYXJIaWRkZW46IGZhbHNlLFxuICBhdXRvRW50ZXJTbGlkZXM6IGZhbHNlLFxuICBlc2NFeGl0c1NsaWRlczogdHJ1ZSxcbiAgc2xpZGVzVGl0bGU6IFwiXCIsXG4gIHNsaWRlc1RoZW1lOiBcImp5eVwiLFxuICBiYXJQcm9wZXJ0aWVzOiBcIlwiLFxuICBiYXJQcm9wZXJ0eVdpZHRoczogXCJcIixcbiAgY29uZmlybURlbGV0ZVNsaWRlczogdHJ1ZSxcbiAgaW1hZ2VMYXlvdXQ6IHRydWUsXG59O1xuXG4vKiogUmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5IGRyaXZpbmcgZGVjayBuYXZpZ2F0aW9uIChuZXZlciByZW5kZXJlZCBhcyBhIGNoaXApICovXG5leHBvcnQgY29uc3QgREVDS19LRVkgPSBcImRlY2tcIjtcbiIsICJpbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IGNvcHlDYXBhY2l0eVByb21wdCB9IGZyb20gXCIuL2NhcGFjaXR5XCI7XG5pbXBvcnQgeyByZWdpc3RlckRlYnVnQ29tbWFuZCB9IGZyb20gXCIuL2RlYnVnXCI7XG5pbXBvcnQgeyBmcm9udG1hdHRlck9mIH0gZnJvbSBcIi4vbW9kZVwiO1xuaW1wb3J0IHsgREVDS19LRVkgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBSZWdpc3RlciBldmVyeSBjb21tYW5kOyB0aGUgZGVidWcgY29tbWFuZCBpcyBkZXYtYnVpbGQgb25seS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbW1hbmRzKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIC8vIFRvZ2dsZSB0aGUgc2xpZGVzIGJhciAod2l0aGluIFNsaWRlcyBtb2RlKVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLWJhclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIHNsaWRlcyBiYXJcIixcbiAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbiA9ICFwbHVnaW4uc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgcGx1Z2luLnJlZnJlc2goKTtcbiAgICB9LFxuICB9KTtcbiAgLy8gU2hvdyB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgc2xpZGUgbGlzdClcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXNob3ctcGFuZWxcIixcbiAgICBuYW1lOiBcIlNob3cgc2xpZGVzIHBhbmVsXCIsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgcGx1Z2luLmFjdGl2YXRlU2xpZGVzUGFuZWwoKSxcbiAgfSk7XG4gIC8vIEhpZGUgLyBzaG93IHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIChwcmVzZW50aW5nOyBTbGlkZXMgbW9kZSBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLXBvaW50ZXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBtb3VzZSBwb2ludGVyXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIk1cIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVQb2ludGVyKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gUHJldmlvdXMgLyBuZXh0IHBhZ2UgKGRlY2sgbmF2aWdhdGlvbjsgZW50ZXJpbmcgU2xpZGVzIG1vZGUgYXMgbmVlZGVkKVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtcHJldlwiLFxuICAgIG5hbWU6IFwiUHJldmlvdXMgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd0xlZnRcIiB9XSxcbiAgICBjYWxsYmFjazogKCkgPT4gcGx1Z2luLm5hdmlnYXRlKFwicHJldlwiKSxcbiAgfSk7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1uZXh0XCIsXG4gICAgbmFtZTogXCJOZXh0IHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dSaWdodFwiIH1dLFxuICAgIGNhbGxiYWNrOiAoKSA9PiBwbHVnaW4ubmF2aWdhdGUoXCJuZXh0XCIpLFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5leHQgU2xpZGUgXHUyMDE0IG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBvbmUgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXh0XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV4dCBzbGlkZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJOXCIgfV0sXG4gICAgLy8gR3JleWVkIG91dCB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGlzIHBhcnQgb2YgYSBkZWNrIFx1MjAxNCBwbGFpbiBub3Rlc1xuICAgIC8vIHN0YXJ0IGRlY2tzIHdpdGggXCJDcmVhdGUgbmV3IHNsaWRlXCIgaW5zdGVhZC5cbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5ldyBTbGlkZSBcdTIwMTQgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgKG5vbi1kZWNrIG5vdGVzIG9ubHk7XG4gIC8vIGFsc28gd29ya3MgZnJvbSBhIGJsYW5rIHRhYiBcdTIwMTQgbGFuZHMgaW4gdGhlIGRlZmF1bHQgbmV3LW5vdGUgbG9jYXRpb24pXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jcmVhdGUtbmV3XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV3IHNsaWRlXCIsXG4gICAgLy8gTm8gZGVmYXVsdCBob3RrZXk6IE1vZCtTaGlmdCtOIGJlbG9uZ3MgdG8gQ3JlYXRlIG5leHQgc2xpZGUgXHUyMDE0IHR3b1xuICAgIC8vIGNvbW1hbmRzIHNoYXJpbmcgb25lIGRlZmF1bHQgaG90a2V5IHRyaXBzIE9ic2lkaWFuJ3MgY29uZmxpY3QgVUkuXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgcGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXcocGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXcoKSksXG4gIH0pO1xuICAvLyBNYWtlIFRoaXMgTm90ZSB0aGUgRmlyc3QgU2xpZGUgXHUyMDE0IHByb21vdGUgdGhlIGFjdGl2ZSAocGxhaW4pIG5vdGUgaW50b1xuICAvLyB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrOiBpdCBnYWlucyBgZGVjazogW11gIGFuZCBrZWVwcyBpdHNcbiAgLy8gY29udGVudCwgdGl0bGUgYW5kIGxvY2F0aW9uLiBBIHBsYWluIGNhbGxiYWNrIChub3QgY2hlY2tDYWxsYmFjaykgc29cbiAgLy8gdGhlIGNvbW1hbmQgc3RheXMgdmlzaWJsZSBpbiB0aGUgcGFsZXR0ZSBldmVuIHdoZW4gdGhlIGFjdGl2ZSBub3RlIGlzXG4gIC8vIGFscmVhZHkgaW4gYSBkZWNrIFx1MjAxNCB0aGF0IGNhc2Ugbm8tb3BzIHdpdGggYSBOb3RpY2UgaW5zdGVhZC4gQ29udmVyc2lvblxuICAvLyBpcyBhIHNpbmdsZSBmcm9udG1hdHRlciB3cml0ZSAobm8gY29uZmlybWF0aW9uIGRpYWxvZyksIHRoZW4gU2xpZGVzXG4gIC8vIG1vZGUgYXV0by1lbnRlcnMgc28gdGhlIHJlc3VsdCBpcyBpbW1lZGlhdGVseSB2aXNpYmxlLlxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtbWFrZS1maXJzdC1zbGlkZVwiLFxuICAgIG5hbWU6IFwiTWFrZSB0aGlzIG5vdGUgdGhlIGZpcnN0IHNsaWRlXCIsXG4gICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUpIHJldHVybjsgLy8gbm90aGluZyB0byBjb252ZXJ0IChibGFuayB0YWIpXG4gICAgICBjb25zdCBjb252ZXJ0ZWQgPSBhd2FpdCBwbHVnaW4uZGVja1NlcnZpY2UubWFrZUZpcnN0U2xpZGUoZmlsZSk7XG4gICAgICBpZiAoIWNvbnZlcnRlZCkge1xuICAgICAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogdGhpcyBub3RlIGFscmVhZHkgYmVsb25ncyB0byBhIGRlY2tcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBtYWRlIHRoaXMgbm90ZSB0aGUgZmlyc3Qgc2xpZGUgb2YgYSBuZXcgZGVja1wiKTtcbiAgICAgIGF3YWl0IHBsdWdpbi5lbnRlclNsaWRlc0ZvckFjdGl2ZSgpO1xuICAgIH0sXG4gIH0pO1xuICAvLyBDb3B5IGEgb25lLXNjcmVlbiBjYXBhY2l0eSByZXBvcnQgb2YgdGhlIGN1cnJlbnQgU2xpZGVzIGxheW91dFxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY29weS1zbGlkZS1za2lsbFwiLFxuICAgIG5hbWU6IFwiQ29weSBBSSBhZ2VudCBwcm9tcHRcIixcbiAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gY2hlY2tDYWxsYmFjayBpcyBub3QgdXNlZDogaXQgd291bGQgaGlkZSB0aGUgY29tbWFuZCBmcm9tIHRoZVxuICAgICAgLy8gY29tbWFuZCBwYWxldHRlIG91dHNpZGUgU2xpZGVzIG1vZGUgKHBhbGV0dGUgb25seSBzaG93cyBjb21tYW5kc1xuICAgICAgLy8gd2hvc2UgY2hlY2tDYWxsYmFjayByZXR1cm5zIHRydWUpLiBLZWVwIHRoZSBjb21tYW5kIGFsd2F5cyB2aXNpYmxlXG4gICAgICAvLyBhbmQgZXhwbGFpbiB0aGUgcmVxdWlyZWQgbW9kZSB3aGVuIGludm9rZWQgdG9vIGVhcmx5LlxuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgICAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogZW50ZXIgU2xpZGVzIG1vZGUgZmlyc3QgKE1vZCtTaGlmdCtFIG9uIGEgZGVjayBub3RlKVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXdhaXQgY29weUNhcGFjaXR5UHJvbXB0KHBsdWdpbi5hcHApO1xuICAgIH0sXG4gIH0pO1xuICAvLyBUb2dnbGUgU2xpZGVzIG1vZGUgXHUyMDE0IHRoZSBpbW1lcnNpdmUgY2FyZCB2aWV3IChkZWNrIG5vdGVzIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtc2xpZGVzXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIG1vZGVcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiRVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHBsdWdpbi5hcHAsIGZpbGUpO1xuICAgICAgaWYgKGZtID09PSBudWxsIHx8ICEoREVDS19LRVkgaW4gZm0pKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSBwbHVnaW4udG9nZ2xlU2xpZGVzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gRGVidWcgdG9vbGluZyBcdTIwMTQgcmVnaXN0ZXJlZCBvbmx5IGluIGRldiBidWlsZHMgKHRyZWUtc2hha2VuIGluIHJlbGVhc2UpXG4gIGlmIChERVZfTU9ERSkgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQocGx1Z2luKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7XG4gIHBsYW5DcmVhdGVOZXcgYXMgcGxhbk5ldyxcbiAgcGxhbkNyZWF0ZU5leHQgYXMgcGxhbixcbiAgcGxhbk1ha2VGaXJzdFNsaWRlIGFzIHBsYW5GaXJzdCxcbiAgdHlwZSBDcmVhdGVOZXh0UmVzdWx0LFxufSBmcm9tIFwiLi9jcmVhdGVOZXh0XCI7XG5pbXBvcnQgeyBjb21wdXRlRGVjaywgZXh0cmFjdExpbmtzLCBleHRyYWN0UmF3TGlua3MsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5pbXBvcnQgeyBwaWNrTGFuZGluZ1BhdGgsIHBsYW5EZWxldGVTbGlkZXMgfSBmcm9tIFwiLi9kZWxldGVTbGlkZXNcIjtcbmltcG9ydCB7IGZyb250bWF0dGVyT2YgfSBmcm9tIFwiLi9tb2RlXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZXN1bHQgb2YgYSBEZWxldGUgc2xpZGVzIHJ1biAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVTbGlkZXNSZXN1bHQge1xuICAvKiogUGF0aHMgYWN0dWFsbHkgbW92ZWQgdG8gdGhlIHRyYXNoICovXG4gIHRyYXNoZWQ6IHN0cmluZ1tdO1xuICAvKiogV2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlcndhcmRzIChudWxsID0ga2VlcCBjdXJyZW50IG5vdGUpICovXG4gIGxhbmRpbmdQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjazogaXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW5cbiAgICogZW1wdHkgXHUyMDE0IGEgZnJlc2ggc2luZ2xlIHNsaWRlKSBvciBzb21lIG90aGVyIHNsaWRlIGRlY2xhcmVzIGl0IGFzIGl0c1xuICAgKiBuZXh0IHNsaWRlLlxuICAgKi9cbiAgaXNNZW1iZXIoZmlsZTogVEZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiAoZm0gIT09IG51bGwgJiYgREVDS19LRVkgaW4gZm0pIHx8IHRoaXMucHJldk9mKGZpbGUucGF0aCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBjdXJyZW50IG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2sgKG51bGwgd2hlbiBub3QgYSBtZW1iZXIpICovXG4gIGNvbXB1dGUoZmlsZTogVEZpbGUpOiBEZWNrSW5mbyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc01lbWJlcihmaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGNvbXB1dGVEZWNrKFxuICAgICAgZmlsZS5wYXRoLFxuICAgICAgKHBhdGgpID0+IHRoaXMubGlua1BhdGhzKHBhdGgpLFxuICAgICAgKHBhdGgpID0+IHRoaXMucHJldk9mKHBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogUmVzb2x2ZSB0aGUgYGRlY2tgIHByb3BlcnR5IG9mIGEgbm90ZSBpbnRvIHJlYWwgbm90ZSBwYXRocyAobWF4IG9uZSkgKi9cbiAgcHJpdmF0ZSBsaW5rUGF0aHMocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuIFtdO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZik7XG4gICAgY29uc3QgbmFtZXMgPSBmbSA/IGV4dHJhY3RMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgcmV0dXJuIG5hbWVzXG4gICAgICAubWFwKChuYW1lKSA9PiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KG5hbWUsIHBhdGgpKVxuICAgICAgLmZpbHRlcigoeCk6IHggaXMgVEZpbGUgPT4gISF4KVxuICAgICAgLm1hcCgoeCkgPT4geC5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodGhlIHByZXZpb3VzIHNsaWRlIGluXG4gICAqIHRoZSBjaGFpbikuIFdpdGggbmV4dC1vbmx5IHNlbWFudGljcyB0aGlzIGJhY2t3YXJkIGxvb2t1cCBpcyB0aGUgb25seVxuICAgKiB3YXkgdG8gcmVhY2ggdGhlIGNoYWluIGhlYWQgZnJvbSBhIG1pZGRsZS9sYXN0IHNsaWRlLlxuICAgKi9cbiAgcHJpdmF0ZSBwcmV2T2YocGF0aDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpKSB7XG4gICAgICBpZiAoZi5wYXRoID09PSBwYXRoKSBjb250aW51ZTtcbiAgICAgIGlmICh0aGlzLmxpbmtQYXRocyhmLnBhdGgpWzBdID09PSBwYXRoKSByZXR1cm4gZi5wYXRoO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIE5hbWVzIGluIHRoZSBgZGVja2AgcHJvcGVydHkgdGhhdCByZXNvbHZlIHRvIG5vIG5vdGUgKGJyb2tlbiBsaW5rcykgKi9cbiAgYnJva2VuKGZpbGU6IFRGaWxlKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgY29uc3QgbmFtZXMgPSBmbSA/IGV4dHJhY3RMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgcmV0dXJuIG5hbWVzLmZpbHRlcigobmFtZSkgPT4gIXRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgZmlsZS5wYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5leHQgU2xpZGVcIiBydW4gZm9yIHRoZSBhY3RpdmUgbm90ZS4gRGVjayBzbGlkZXNcbiAgICogaW5zZXJ0L2FwcGVuZCBhZnRlciB0aGUgY3VycmVudCBub3RlLiAoUGxhaW4gbm90ZXMgYXJlIHJvdXRlZCB0b1xuICAgKiBwbGFuQ3JlYXRlTmV3IGJ5IHRoZSBjb21tYW5kIFx1MjAxNCB0aGlzIGNvcmUgc3RpbGwgaGFuZGxlcyB0aGVtIGFzXG4gICAqIFwibm8gdXNhYmxlIG5leHQgbGluayBcdTIxOTIgYXBwZW5kXCIuKVxuICAgKi9cbiAgcGxhbkNyZWF0ZU5leHQoZmlsZTogVEZpbGUpOiBDcmVhdGVOZXh0UmVzdWx0IHwgbnVsbCB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCByYXcgPSBmbSA/IGV4dHJhY3RSYXdMaW5rcyhmbVtERUNLX0tFWV0pIDogW107XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuKHsgY3VycmVudE5hbWU6IGZpbGUuYmFzZW5hbWUsIGN1cnJlbnRMaW5rczogcmF3LCBleGlzdGluZ05hbWVzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsYW4gYSBcIkNyZWF0ZSBOZXcgU2xpZGVcIiBydW46IGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIGluIHRoZVxuICAgKiBzYW1lIGZvbGRlciBhcyB0aGUgYWN0aXZlIG5vdGUsIHdoaWNoIGl0c2VsZiBzdGF5cyB1bnRvdWNoZWQuXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV3KCk6IENyZWF0ZU5leHRSZXN1bHQge1xuICAgIGNvbnN0IGV4aXN0aW5nTmFtZXMgPSBuZXcgU2V0KHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKS5tYXAoKGYpID0+IGYuYmFzZW5hbWUpKTtcbiAgICByZXR1cm4gcGxhbk5ldyh7IGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKiogQXBwbHkgYSBDcmVhdGUgTmV4dCBTbGlkZSBwbGFuOyBvcGVuPWZhbHNlIGtlZXBzIHRoZSBjdXJyZW50IG5vdGUgaW4gdGhlIGVkaXRvciAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV4dChmaWxlOiBURmlsZSwgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCwgb3BlbiA9IHRydWUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmFwcGx5UGxhbihmaWxlLCBwbGFuLCBkaXJQcmVmaXgoZmlsZS5wYXJlbnQ/LnBhdGgpLCBvcGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhIENyZWF0ZSBOZXcgU2xpZGUgcGxhbi4gTGFuZHMgaW4gT2JzaWRpYW4ncyBkZWZhdWx0IG5ldy1ub3RlXG4gICAqIGxvY2F0aW9uIChTZXR0aW5ncyBcdTIxOTIgRmlsZXMgJiBsaW5rcyBcdTIxOTIgRGVmYXVsdCBsb2NhdGlvbiBmb3IgbmV3IG5vdGVzKTtcbiAgICogd2l0aCBcInNhbWUgZm9sZGVyIGFzIGN1cnJlbnRcIiBjb25maWd1cmVkIHRoYXQgaXMgdGhlIGFjdGl2ZSBub3RlJ3Mgb3duXG4gICAqIGZvbGRlci4gV29ya3Mgd2l0aCBubyBub3RlIG9wZW4gYXQgYWxsIChibGFuayB0YWIpLlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZUNyZWF0ZU5ldyhwbGFuOiBDcmVhdGVOZXh0UmVzdWx0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc291cmNlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gXCJcIjtcbiAgICBhd2FpdCB0aGlzLmFwcGx5UGxhbihcbiAgICAgIG51bGwsXG4gICAgICBwbGFuLFxuICAgICAgZGlyUHJlZml4KHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmdldE5ld0ZpbGVQYXJlbnQoc291cmNlUGF0aCk/LnBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUHJvbW90ZSB0aGUgYWN0aXZlIG5vdGUgaW50byB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrOiBhZGQgYGRlY2s6IFtdYFxuICAgKiB0byBpdHMgZnJvbnRtYXR0ZXIgXHUyMDE0IGNvbnRlbnQsIHRpdGxlLCBsb2NhdGlvbiBhbmQgZXZlcnkgb3RoZXIgcHJvcGVydHlcbiAgICogc3RheSB1bnRvdWNoZWQuIE5vdGVzIHRoYXQgYWxyZWFkeSBiZWxvbmcgdG8gYSBkZWNrIGFyZSBsZWZ0IGFsb25lLlxuICAgKiBSZXR1cm5zIHRydWUgd2hlbiB0aGUgbm90ZSB3YXMgY29udmVydGVkICh0aGUgY2FsbGVyIG1heSB0aGVuIGF1dG8tZW50ZXJcbiAgICogU2xpZGVzIG1vZGUpLCBmYWxzZSB3aGVuIGl0IHdhcyBhbHJlYWR5IGEgZGVjayBtZW1iZXIuXG4gICAqL1xuICBhc3luYyBtYWtlRmlyc3RTbGlkZShmaWxlOiBURmlsZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmIChwbGFuRmlyc3QoeyBhbHJlYWR5RGVjazogdGhpcy5pc01lbWJlcihmaWxlKSB9KSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICBmbVtERUNLX0tFWV0gPSBbXTtcbiAgICB9KTtcbiAgICAvLyBPYnNpZGlhbiBpbmRleGVzIGEgc2F2ZWQgZmlsZSBhc3luY2hyb25vdXNseTsgdGhlIGNvbW1hbmQncyBhdXRvLWVudGVyXG4gICAgLy8gcmVhZHMgdGhlIGNhY2hlLCBzbyBoYW5kIGJhY2sgb25seSBvbmNlIHRoZSBuZXcgYGRlY2tgIGlzIHZpc2libGUuXG4gICAgYXdhaXQgdGhpcy53YWl0Rm9yQ2FjaGVkRGVjayhmaWxlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0IHVudGlsIHRoZSBtZXRhZGF0YSBjYWNoZSByZWZsZWN0cyB0aGUgbm90ZSdzIGBkZWNrYCBwcm9wZXJ0eVxuICAgKiAoYmVzdCBlZmZvcnQgXHUyMDE0IHJlc29sdmVzIG9uIHRoZSBwcm9wZXJ0eSBhcHBlYXJpbmcsIG9yIGFmdGVyIGB0aW1lb3V0TXNgKS5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgd2FpdEZvckNhY2hlZERlY2soZmlsZTogVEZpbGUsIHRpbWVvdXRNcyA9IDIwMDApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5oYXNEZWNrSW5DYWNoZShmaWxlKSkgcmV0dXJuO1xuICAgIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCByZWYgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9uKFwiY2hhbmdlZFwiLCAoY2hhbmdlZDogVEZpbGUpID0+IHtcbiAgICAgICAgaWYgKGNoYW5nZWQucGF0aCA9PT0gZmlsZS5wYXRoICYmIHRoaXMuaGFzRGVja0luQ2FjaGUoZmlsZSkpIHtcbiAgICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9mZnJlZihyZWYpO1xuICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vZmZyZWYocmVmKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSwgdGltZW91dE1zKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZXRhZGF0YSBjYWNoZSBhbHJlYWR5IHNob3dzIGEgYGRlY2tgIHByb3BlcnR5IG9uIHRoZSBub3RlICovXG4gIHByaXZhdGUgaGFzRGVja0luQ2FjaGUoZmlsZTogVEZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiBmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIHBsYW46IGNyZWF0ZSB0aGUgbm90ZSwgcmV3aXJlIGBkZWNrYCBwcm9wZXJ0aWVzLCBvcHRpb25hbGx5IG9wZW4gaXQgKi9cbiAgcHJpdmF0ZSBhc3luYyBhcHBseVBsYW4oXG4gICAgZmlsZTogVEZpbGUgfCBudWxsLFxuICAgIHBsYW46IENyZWF0ZU5leHRSZXN1bHQsXG4gICAgZGlyOiBzdHJpbmcsXG4gICAgb3BlbiA9IHRydWUsXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG5ld1BhdGggPSBgJHtkaXJ9JHtwbGFuLm5ld05hbWV9Lm1kYDtcbiAgICBjb25zdCBmcm9udG1hdHRlciA9IHBsYW4ubmV3RGVja0xpbmtzLm1hcCgobGluaykgPT4gSlNPTi5zdHJpbmdpZnkobGluaykpLmpvaW4oXCIsIFwiKTtcbiAgICBjb25zdCBjb250ZW50ID0gYC0tLVxcbmRlY2s6IFske2Zyb250bWF0dGVyfV1cXG4tLS1cXG5gO1xuXG4gICAgbGV0IG5ld0ZpbGU6IFRGaWxlO1xuICAgIHRyeSB7XG4gICAgICBuZXdGaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKG5ld1BhdGgsIGNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgY3JlYXRlIFwiJHtwbGFuLm5ld05hbWV9Lm1kXCIgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmV3aXJlIHRoZSBjdXJyZW50IG5vdGUncyBgZGVja2AgKGtlZXBzIGFsbCBvdGhlciBwcm9wZXJ0aWVzIGludGFjdClcbiAgICBmb3IgKGNvbnN0IHJld3JpdGUgb2YgcGxhbi5yZXdyaXRlcykge1xuICAgICAgaWYgKCFmaWxlIHx8IHJld3JpdGUubmFtZSAhPT0gZmlsZS5iYXNlbmFtZSkgY29udGludWU7IC8vIGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlXG4gICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZmlsZSwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSByZXdyaXRlLmRlY2s7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIW9wZW4pIHJldHVybjtcblxuICAgIC8vIE9wZW4gdGhlIG5ldyBub3RlIGluIHRoZSBjdXJyZW50IHBhbmUsIGVkaXQgbW9kZSAoTGl2ZSBQcmV2aWV3KVxuICAgIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShuZXdGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgc2xpZGVzIG91dCBvZiBhbiBvcmRlcmVkIGRlY2sgY2hhaW46IHNwbGljZSB0aGUgY2hhaW4gYXJvdW5kXG4gICAqIGV2ZXJ5IGRlbGV0ZWQgcnVuICh0aGUgcHJlZGVjZXNzb3IncyBgZGVja2AgdGFrZXMgb3ZlciB0aGUgcnVuJ3MgZmlyc3RcbiAgICogc3Vydml2b3IpLCB0aGVuIG1vdmUgZWFjaCBkZWxldGVkIG5vdGUgdG8gdGhlIHRyYXNoLiBgZm9jdXNQYXRoYCBpcyB0aGVcbiAgICogbm90ZSB0aGUgZWRpdG9yIGN1cnJlbnRseSBzaG93cyBcdTIwMTQgd2hlbiBpdCBpcyBhbW9uZyB0aGUgZGVsZXRlZCwgdGhlXG4gICAqIHJlc3VsdCBuYW1lcyB0aGUgbmVhcmVzdCBzdXJ2aXZpbmcgbmVpZ2hib3VyIHRvIG9wZW4gaW5zdGVhZC5cbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVEZWxldGVTbGlkZXMoXG4gICAgY2hhaW46IHN0cmluZ1tdLFxuICAgIGRlbGV0ZVBhdGhzOiBSZWFkb25seVNldDxzdHJpbmc+LFxuICAgIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbiAgKTogUHJvbWlzZTxEZWxldGVTbGlkZXNSZXN1bHQ+IHtcbiAgICBjb25zdCByZXdyaXRlcyA9IHBsYW5EZWxldGVTbGlkZXMoY2hhaW4sIGRlbGV0ZVBhdGhzKTtcblxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiByZXdyaXRlcykge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLnBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICBjb25zdCBuZXh0ID0gcmV3cml0ZS5uZXh0UGF0aCA/IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLm5leHRQYXRoKSA6IG51bGw7XG4gICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZiwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSBuZXh0IGluc3RhbmNlb2YgVEZpbGUgPyBbYFtbJHtuZXh0LmJhc2VuYW1lfV1dYF0gOiBbXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYXNoZWQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIGRlbGV0ZVBhdGhzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci50cmFzaEZpbGUoZik7XG4gICAgICAgIHRyYXNoZWQucHVzaChwYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBkZWxldGUgXCIke2YuYmFzZW5hbWV9XCIgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdHJhc2hlZCwgbGFuZGluZ1BhdGg6IHBpY2tMYW5kaW5nUGF0aChjaGFpbiwgZGVsZXRlUGF0aHMsIGZvY3VzUGF0aCkgfTtcbiAgfVxufVxuXG4vKiogRm9sZGVyIHBhdGggXHUyMTkyIHRyYWlsaW5nLXNsYXNoIHByZWZpeCAoXCJcIiBmb3IgdmF1bHQgcm9vdCkgKi9cbmZ1bmN0aW9uIGRpclByZWZpeChwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIXBhdGggfHwgcGF0aCA9PT0gXCIvXCIpIHJldHVybiBcIlwiO1xuICByZXR1cm4gYCR7cGF0aC5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpfS9gO1xufVxuIiwgIi8qKlxuICogZGVjay50cyBcdTIwMTQgUHVyZSBkZWNrLXJlc29sdXRpb24gY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvZGVjay50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHMgdGhlXG4gKiB2YXVsdCAobWV0YWRhdGFDYWNoZSkgdG8gdGhpcyBwdXJlIGludGVyZmFjZTogaXQgcmVzb2x2ZXMgYGRlY2tgXG4gKiBwcm9wZXJ0aWVzIHRvIG5vdGUgcGF0aHMsIHRoZW4gaGFuZHMgdGhlIHBhdGggZ3JhcGggdG8gY29tcHV0ZURlY2soKS5cbiAqL1xuXG4vKiogQSBkZWNrIGxpbmsgbGlzdCBob2xkcyBhdCBtb3N0IG9uZSBlbnRyeSAodGhlIG5leHQgc2xpZGUpICovXG5leHBvcnQgY29uc3QgTUFYX0RFQ0tfTElOS1MgPSAxO1xuXG4vKiogUmVzdWx0IG9mIHJlc29sdmluZyBhIG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgYSBkZWNrICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tJbmZvIHtcbiAgLyoqIENoYWluIG9mIG5vdGUgcGF0aHM6IFswXSBpcyB0aGUgZmlyc3Qgc2xpZGUsIHRoZW4gdGhlIHJlc3QgaW4gb3JkZXIgKi9cbiAgY2hhaW46IHN0cmluZ1tdO1xuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnQgbm90ZSBpbnNpZGUgY2hhaW4gKi9cbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjay5cbiAqXG4gKiB2MS4wLjAgY29udmVudGlvbiBcdTIwMTQgbmV4dC1vbmx5LCBubyBvdmVydmlldyBwYWdlOlxuICogICAtIGEgc2xpZGUncyBgZGVja2AgcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluazogdGhlIG5leHQgc2xpZGVcbiAqICAgICAodGhlIGxhc3Qgc2xpZGUgaGFzIG5vIGxpbmsgYXQgYWxsKTtcbiAqICAgLSBhIGRlY2sgaXMgc2ltcGx5IGEgZm9yd2FyZCBsaW5rIGNoYWluIHN0YXJ0aW5nIGF0IGl0cyBoZWFkIHNsaWRlO1xuICogICAtIGFueSBub3RlIHRoYXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW4gZW1wdHkpIGlzIGEgZGVjayBtZW1iZXIsXG4gKiAgICAgc28gYSBzaW5nbGUgZnJlc2hseSBjcmVhdGVkIHNsaWRlIGFscmVhZHkgY291bnRzIGFzIGEgb25lLXBhZ2UgZGVjay5cbiAqXG4gKiBCZWNhdXNlIHNsaWRlcyBubyBsb25nZXIgbGluayBiYWNrIHRvIGEgaGVhZCBub3RlLCB0aGUgY2hhaW4gaGVhZCBpc1xuICogbG9jYXRlZCBieSB3YWxraW5nIGJhY2t3YXJkOiBgZ2V0UHJldihwYXRoKWAgcmV0dXJucyB0aGUgbm90ZSB3aG9zZVxuICogYGRlY2tgIHByb3BlcnR5IHBvaW50cyBhdCBgcGF0aGAgKHVuZGVmaW5lZCB3aGVuIG5vbmUpLlxuICpcbiAqIGBnZXRMaW5rcyhwYXRoKWAgbXVzdCByZXR1cm4gdGhlIHJlc29sdmVkIG5vdGUgcGF0aHMgb2YgdGhlIGBkZWNrYFxuICogcHJvcGVydHkgb2YgdGhlIG5vdGUgYXQgYHBhdGhgIChlbXB0eSB3aGVuIHRoZSBub3RlIGhhcyBub25lLCBvciBpdHNcbiAqIGxpbmsgaXMgYnJva2VuIFx1MjAxNCBhIGJyb2tlbiBsaW5rIHNpbXBseSBlbmRzIHRoZSBjaGFpbiwgbmV2ZXIgY3Jhc2hlcykuXG4gKlxuICogUmV0dXJucyB0aGUgZnVsbCBjaGFpbiBhbmQgdGhlIGN1cnJlbnQgbm90ZSdzIGluZGV4LCBvciBudWxsIHdoZW4gdGhlXG4gKiBub3RlIGlzIG5vdCBwYXJ0IG9mIGFueSBkZWNrIChubyBgZGVja2AgcHJvcGVydHkgYW5kIG5vYm9keSBsaW5rcyB0byBpdCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlRGVjayhcbiAgY3VycmVudFBhdGg6IHN0cmluZyxcbiAgZ2V0TGlua3M6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZ1tdLFxuICBnZXRQcmV2OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmcgfCB1bmRlZmluZWQsXG4pOiBEZWNrSW5mbyB8IG51bGwge1xuICAvLyBXYWxrIGJhY2t3YXJkIHRvIHRoZSBjaGFpbiBoZWFkIChjeWNsZS1ndWFyZGVkKS4gQSBsb25lIG5vZGUgKG5vIG93blxuICAvLyBsaW5rLCBubyBwcmVkZWNlc3NvcikgcmVzb2x2ZXMgYXMgYSBvbmUtcGFnZSBjaGFpbiBcdTIwMTQgd2hldGhlciBpdCBjb3VudHNcbiAgLy8gYXMgYSBkZWNrIG1lbWJlciBhdCBhbGwgaXMgZGVjaWRlZCBieSB0aGUgYWRhcHRlciAodGhlIGBkZWNrYCBrZXkpLlxuICBjb25zdCBiYWNrVmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPihbY3VycmVudFBhdGhdKTtcbiAgbGV0IGhlYWQgPSBjdXJyZW50UGF0aDtcbiAgZm9yICg7Oykge1xuICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2KGhlYWQpO1xuICAgIGlmICghcHJldiB8fCBiYWNrVmlzaXRlZC5oYXMocHJldikpIGJyZWFrO1xuICAgIGJhY2tWaXNpdGVkLmFkZChwcmV2KTtcbiAgICBoZWFkID0gcHJldjtcbiAgfVxuXG4gIC8vIFdhbGsgZm9yd2FyZCBmcm9tIHRoZSBoZWFkIChjeWNsZS1ndWFyZGVkKS5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgbGV0IGN1cjogc3RyaW5nIHwgdW5kZWZpbmVkID0gaGVhZDtcbiAgd2hpbGUgKGN1ciAmJiAhdmlzaXRlZC5oYXMoY3VyKSkge1xuICAgIHZpc2l0ZWQuYWRkKGN1cik7XG4gICAgY2hhaW4ucHVzaChjdXIpO1xuICAgIGN1ciA9IGdldExpbmtzKGN1cilbMF07XG4gIH1cblxuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoY3VycmVudFBhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgY2hhaW4sIGluZGV4IH07XG59XG5cbi8qKlxuICogRXh0cmFjdCB1cCB0byBgbWF4YCBub3RlIG5hbWVzIGZyb20gYSBgZGVja2AgcHJvcGVydHkgdmFsdWUuXG4gKiBBY2NlcHRzIGEgc2luZ2xlIHN0cmluZyBvciBhIFlBTUwgbGlzdCBvZiBzdHJpbmdzOyB1bnF1b3RlZCBbW3hdXSB2YWx1ZXNcbiAqIGFyZSBwYXJzZWQgYnkgWUFNTCBhcyBuZXN0ZWQgYXJyYXlzIGFuZCBmbGF0dGVuZWQgaGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGNvbnN0IG5hbWUgPSBleHRyYWN0TGlua1RleHQoaXRlbSk7XG4gICAgaWYgKG5hbWUpIG91dC5wdXNoKG5hbWUpO1xuICAgIGlmIChvdXQubGVuZ3RoID49IG1heCkgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIHJhdyBsaW5rIHN0cmluZ3MgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZSBcdTIwMTQgdGhlXG4gKiB0cmltbWVkIHZhbHVlcyBleGFjdGx5IGFzIHdyaXR0ZW4gKGFsaWFzIC8gcGF0aCBmb3JtcyBwcmVzZXJ2ZWQpLiBTYW1lXG4gKiBmbGF0dGVuaW5nIHJ1bGVzIGFzIGV4dHJhY3RMaW5rcygpLCBidXQgd2l0aG91dCBleHRyYWN0aW5nIHRoZSB0YXJnZXQgbmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RSYXdMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gXCJzdHJpbmdcIikgY29udGludWU7XG4gICAgY29uc3QgdHJpbW1lZCA9IGl0ZW0udHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgY29udGludWU7XG4gICAgb3V0LnB1c2godHJpbW1lZCk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdGhlIHRhcmdldCBub3RlIG5hbWUgZnJvbSBhIG1hcmtkb3duIGxpbmsgc3RyaW5nLlxuICogSGFuZGxlcyBzZXZlcmFsIHNoYXBlczpcbiAqICAgXCJbW3NsaWRlLTJdXVwiICAgICAgICBcdTIxOTIgc2xpZGUtMlxuICogICBcIltbc2xpZGUtMnxhbGlhc11dXCIgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yI3NlY3Rpb25dXVwiXHUyMTkyIHNsaWRlLTJcbiAqICAgc2xpZGUtMiAgICAgICAgICAgICAgXHUyMTkyIHNsaWRlLTIgKGJhcmUgZmlsZW5hbWUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0TGlua1RleHQodmFsdWU6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKCk7XG4gIGlmICghdHJpbW1lZCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB0cmltbWVkLnJlcGxhY2UoL15cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnNwbGl0KFwiI1wiKVswXS50cmltKCk7XG59XG5cbi8qKiBSZW5kZXIgYSBwcm9wZXJ0eSB2YWx1ZSBhcyByZWFkYWJsZSB0ZXh0OiBhcnJheXMvb2JqZWN0cyBcdTIxOTIgSlNPTiwgZWxzZSBTdHJpbmcgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcdTIwMTRcIjtcbiAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKSA/PyBcIlx1MjAxNFwiO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGNpcmN1bGFyIC8gdW4tc3RyaW5naWZpYWJsZSBzdHJ1Y3R1cmUgXHUyMDE0IG5vdCBleHBlY3RlZCBmcm9tIGZyb250bWF0dGVyXG4gICAgICAgIHJldHVybiBcIlx1MjAxNFwiO1xuICAgICAgfVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBzeW1ib2wgLyBmdW5jdGlvbiBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGNyZWF0ZU5leHQudHMgXHUyMDE0IFB1cmUgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIC8gXCJDcmVhdGUgTmV3IFNsaWRlXCIgcGxhbm5pbmdcbiAqIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRXZlcnl0aGluZyBpbiB0aGlzIG1vZHVsZSBpcyBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0XG4gKiBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L2NyZWF0ZU5leHQudGVzdC50cykuIG1haW4udHMgYWRhcHRzXG4gKiB0aGUgdmF1bHQgKG1ldGFkYXRhQ2FjaGUsIGNvbXB1dGVEZWNrKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlIGFuZCBhcHBsaWVzXG4gKiB0aGUgcmVzdWx0aW5nIHBsYW4gd2l0aCB2YXVsdC5jcmVhdGUoKSArIGZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcigpLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6IGEgc2xpZGUncyBgZGVja2BcbiAqIHByb3BlcnR5IGhvbGRzIGF0IG1vc3QgT05FIGxpbmsgKGl0cyBuZXh0IHNsaWRlKS4gcGxhbkNyZWF0ZU5leHQgZGVjaWRlcyxcbiAqIGZvciB0aGUgY3VycmVudCBkZWNrIG5vdGU6XG4gKiAgIC0gdGhlIG5hbWUgb2YgdGhlIG5ldyBzbGlkZSBmaWxlIChjb2xsaXNpb24tYXdhcmUpLFxuICogICAtIHRoZSByYXcgYGRlY2tgIGxpbmsgdGV4dHMgb2YgdGhlIG5ldyBub3RlLFxuICogICAtIHRoZSByZXdyaXRlcyBuZWVkZWQgb24gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGVcbiAqICAgICBjdXJyZW50IG5vdGUpLlxuICogcGxhbkNyZWF0ZU5ldyBwbGFucyBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZSAoYSBmcmVzaCBub3RlIHRoYXQgaXNcbiAqIG5vdCBwYXJ0IG9mIGFueSBkZWNrIHlldCBcdTIwMTQgYGRlY2s6IFtdYCwgbm8gcmV3cml0ZXMgYW55d2hlcmUpLlxuICogcGxhbk1ha2VGaXJzdFNsaWRlIHBsYW5zIHRoZSBpbnZlcnNlOiBwcm9tb3RpbmcgYW4gZXhpc3RpbmcgcGxhaW4gbm90ZVxuICogaW50byB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrIChgZGVjazogW11gIHdyaXR0ZW4gb250byB0aGUgbm90ZVxuICogaXRzZWxmLCBub3RoaW5nIGNyZWF0ZWQgb3IgcmV3cml0dGVuKS5cbiAqL1xuXG5pbXBvcnQgeyBleHRyYWN0TGlua1RleHQgfSBmcm9tIFwiLi9kZWNrXCI7XG5cbi8qKiBJbnB1dHMgZm9yIHBsYW5uaW5nIFx1MjAxNCByZXNvbHZlZCBieSB0aGUgYWRhcHRlciBpbiBtYWluLnRzICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRJbnB1dCB7XG4gIC8qKiBCYXNlbmFtZSAod2l0aG91dCBleHRlbnNpb24pIG9mIHRoZSBjdXJyZW50IG5vdGUgKi9cbiAgY3VycmVudE5hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgY3VycmVudCBub3RlIChleHRyYWN0ZWQsIGF0IG1vc3Qgb25lKSAqL1xuICBjdXJyZW50TGlua3M6IHN0cmluZ1tdO1xuICAvKiogQmFzZW5hbWVzIG9mIGV2ZXJ5IG1hcmtkb3duIG5vdGUgaW4gdGhlIHZhdWx0IChjb2xsaXNpb24tZnJlZSBuYW1pbmcpICovXG4gIGV4aXN0aW5nTmFtZXM6IFNldDxzdHJpbmc+O1xufVxuXG4vKiogT25lIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tSZXdyaXRlIHtcbiAgLyoqIEJhc2VuYW1lIG9mIHRoZSBub3RlIHRvIHJld3JpdGUgKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogVGhlIG5ldyByYXcgYGRlY2tgIGxpbmsgdGV4dHMgKHNlcmlhbGl6ZWQgYXMgYSBZQU1MIGxpc3QpICovXG4gIGRlY2s6IHN0cmluZ1tdO1xufVxuXG4vKiogVGhlIGZ1bGwgcGxhbiBmb3IgY3JlYXRpbmcgb25lIG5ldyBzbGlkZSAqL1xuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVOZXh0UmVzdWx0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIG5ldyBzbGlkZSBmaWxlICovXG4gIG5ld05hbWU6IHN0cmluZztcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBmb3IgdGhlIG5ldyBub3RlJ3MgZnJvbnRtYXR0ZXIgKi9cbiAgbmV3RGVja0xpbmtzOiBzdHJpbmdbXTtcbiAgLyoqIFJld3JpdGVzIHRvIGFwcGx5IHRvIGV4aXN0aW5nIG5vdGVzIChpbiBwcmFjdGljZSBhbHdheXMgdGhlIGN1cnJlbnQgbm90ZSkgKi9cbiAgcmV3cml0ZXM6IERlY2tSZXdyaXRlW107XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBuZXcgc2xpZGUgYWZ0ZXIgdGhlIGN1cnJlbnQgbm90ZS5cbiAqXG4gKiBCZWhhdmlvcnM6XG4gKiAgIC0gTm8gbmV4dCBsaW5rIChsYXN0IHNsaWRlLCBmcmVzaCBkZWNrIGhlYWQsIG9yIGEgcGxhaW4gbm90ZSBzdGFydGluZ1xuICogICAgIGEgYnJhbmQtbmV3IGRlY2spOiBhcHBlbmQgYDxjdXJyZW50Pi1uZXh0YCBhcyB0aGUgbmV3IGxhc3Qgc2xpZGU7IHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCBnYWlucyB0aGUgbGluayB0byBpdC5cbiAqICAgLSBWYWxpZCBuZXh0IGxpbms6IGluc2VydCBgPGN1cnJlbnQ+LW5leHRgIGJldHdlZW4gdGhlIGN1cnJlbnQgbm90ZSBhbmRcbiAqICAgICBpdHMgbmV4dDsgdGhlIG5ldyBub3RlIHRha2VzIG92ZXIgdGhlIG9sZCBuZXh0IGxpbmsuXG4gKiAgIC0gQnJva2VuIG5leHQgbGluayAocGxhaW4sIG5vbi1leGlzdGluZyBuYW1lKTogY3JlYXRlIGV4YWN0bHkgdGhlXG4gKiAgICAgZGVjbGFyZWQgbWlzc2luZyBub3RlIGFzIHRoZSBuZXcgbmV4dCBzbGlkZSBcdTIwMTQgdGhlIFx1MjZBMCB3YXJuaW5nXG4gKiAgICAgZGlzYXBwZWFycyBhbmQgdGhlIGF1dGhvcidzIGludGVudCBpcyBob25vdXJlZC4gQSBicm9rZW4gbGluayB0aGF0IGlzXG4gKiAgICAgbm90IGEgcGxhaW4gYmFzZW5hbWUgKHBhdGgtcXVhbGlmaWVkLCBzZWxmLXJlZmVyZW5jaW5nKSBpcyB0cmVhdGVkIGFzXG4gKiAgICAgaW52YWxpZCBhbmQgZHJvcHBlZCAoYXBwZW5kIGEgYDxjdXJyZW50Pi1uZXh0YCBsYXN0IHNsaWRlIGluc3RlYWQpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5leHQoaW5wdXQ6IENyZWF0ZU5leHRJbnB1dCk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgY29uc3QgeyBjdXJyZW50TmFtZSwgY3VycmVudExpbmtzIH0gPSBpbnB1dDtcbiAgY29uc3QgbmV4dExpbmsgPSBjdXJyZW50TGlua3NbMF07XG5cbiAgaWYgKG5leHRMaW5rKSB7XG4gICAgY29uc3QgbmV4dE5hbWUgPSBleHRyYWN0TGlua1RleHQobmV4dExpbmspO1xuICAgIGlmIChuZXh0TmFtZSAmJiBpc1BsYWluTmFtZShuZXh0TmFtZSkgJiYgbmV4dE5hbWUgIT09IGN1cnJlbnROYW1lKSB7XG4gICAgICBpZiAoIWlucHV0LmV4aXN0aW5nTmFtZXMuaGFzKG5leHROYW1lKSkge1xuICAgICAgICAvLyBUaGUgZGVjbGFyZWQgbmV4dCBub3RlIGRvZXMgbm90IGV4aXN0IHlldCBcdTIxOTIgY3JlYXRlIGV4YWN0bHkgdGhhdFxuICAgICAgICAvLyBub3RlIChmaXhlcyB0aGUgYnJva2VuLWxpbmsgd2FybmluZywgaG9ub3VycyB0aGUgYXV0aG9yJ3MgaW50ZW50KS5cbiAgICAgICAgcmV0dXJuIHsgbmV3TmFtZTogbmV4dE5hbWUsIG5ld0RlY2tMaW5rczogW10sIHJld3JpdGVzOiBbXSB9O1xuICAgICAgfVxuICAgICAgLy8gQSB2YWxpZCBuZXh0IG5vdGUgZXhpc3RzIFx1MjE5MiBpbnNlcnQgYmV0d2VlbiBpdCBhbmQgdGhlIGN1cnJlbnQgbm90ZS5cbiAgICAgIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuZXdOYW1lLFxuICAgICAgICBuZXdEZWNrTGlua3M6IFtuZXh0TGlua10sXG4gICAgICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gSW52YWxpZCAocGF0aC1xdWFsaWZpZWQgLyBzZWxmLXJlZmVyZW5jaW5nKSBuZXh0IGxpbmsgXHUyMTkyIGRyb3AgaXQgYW5kXG4gICAgLy8gYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgKGZhbGwgdGhyb3VnaCB0byB0aGUgbm8tbmV4dCBicmFuY2gpLlxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE5vICh1c2FibGUpIG5leHQgbGluayBcdTIxOTIgYXBwZW5kIGEgbmV3IGxhc3Qgc2xpZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IG5ld05hbWUgPSB1bmlxdWVOYW1lKGAke2N1cnJlbnROYW1lfS1uZXh0YCwgaW5wdXQuZXhpc3RpbmdOYW1lcyk7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbeyBuYW1lOiBjdXJyZW50TmFtZSwgZGVjazogW2BbWyR7bmV3TmFtZX1dXWBdIH1dLFxuICB9O1xufVxuXG4vKipcbiAqIFBsYW4gdGhlIGNyZWF0aW9uIG9mIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlLlxuICpcbiAqIFRoZSBuZXcgbm90ZSBzdGFydHMgYXMgYSBzaW5nbGUtc2xpZGUgZGVjayAoYGRlY2s6IFtdYCkgYW5kIG5vdGhpbmcgZWxzZVxuICogaXMgdG91Y2hlZCBcdTIwMTQgdGhlIG5vdGUgaXQgd2FzIGxhdW5jaGVkIGZyb20gc3RheXMgYXMtaXMuIExhdGVyIHBhZ2VzIGFyZVxuICogYWRkZWQgd2l0aCBDcmVhdGUgTmV4dCBTbGlkZSBmcm9tIGluc2lkZSB0aGUgZGVjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5DcmVhdGVOZXcoaW5wdXQ6IHsgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz4gfSk6IENyZWF0ZU5leHRSZXN1bHQge1xuICByZXR1cm4ge1xuICAgIG5ld05hbWU6IHVuaXF1ZU5hbWUoXCJ1bnRpdGxlZC1zbGlkZXNcIiwgaW5wdXQuZXhpc3RpbmdOYW1lcyksXG4gICAgbmV3RGVja0xpbmtzOiBbXSxcbiAgICByZXdyaXRlczogW10sXG4gIH07XG59XG5cbi8qKiBBIG5vdGUgcHJvbW90ZWQgaW50byB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrICovXG5leHBvcnQgaW50ZXJmYWNlIE1ha2VGaXJzdFNsaWRlUGxhbiB7XG4gIC8qKiBSYXcgYGRlY2tgIGxpbmsgdGV4dHMgZm9yIHRoZSBub3RlJ3MgZnJvbnRtYXR0ZXIgKGFsd2F5cyBlbXB0eSBcdTIwMTQgYSBzaW5nbGUtc2xpZGUgZGVjaykgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKlxuICogUGxhbiBhIFwiTWFrZSB0aGlzIG5vdGUgdGhlIGZpcnN0IHNsaWRlXCIgcnVuIFx1MjAxNCBwcm9tb3RlIHRoZSBhY3RpdmUgbm90ZVxuICogaW50byB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrOiBpdHMgY29udGVudCwgdGl0bGUgYW5kIGxvY2F0aW9uIHN0YXlcbiAqIHVudG91Y2hlZCwgYW5kIHRoZSBmcm9udG1hdHRlciBnYWlucyBgZGVjazogW11gIChhIHNpbmdsZS1zbGlkZSBkZWNrLFxuICogdGhlIHN0YW5kYXJkIFwibGFzdCBzbGlkZVwiIC8gc29sbyBtYXJrZXIpLiBObyByZXdyaXRlcyBhbnl3aGVyZSBcdTIwMTQgbGF0ZXJcbiAqIHBhZ2VzIGFyZSBhZGRlZCB3aXRoIENyZWF0ZSBOZXh0IFNsaWRlIGZyb20gaW5zaWRlIHRoZSBkZWNrLlxuICpcbiAqIE5vdGVzIHRoYXQgYWxyZWFkeSBiZWxvbmcgdG8gYSBkZWNrIChob2xkIGEgYGRlY2tgIHByb3BlcnR5LCBvciBhcmVcbiAqIGRlY2xhcmVkIGFzIGFub3RoZXIgc2xpZGUncyBuZXh0KSBhcmUgTk9UIHRvdWNoZWQ6IHRoZSBwbGFuIGlzIG51bGwgYW5kXG4gKiB0aGUgY29tbWFuZCBuby1vcHMgd2l0aCBhIE5vdGljZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5NYWtlRmlyc3RTbGlkZShpbnB1dDogeyBhbHJlYWR5RGVjazogYm9vbGVhbiB9KTogTWFrZUZpcnN0U2xpZGVQbGFuIHwgbnVsbCB7XG4gIGlmIChpbnB1dC5hbHJlYWR5RGVjaykgcmV0dXJuIG51bGw7XG4gIHJldHVybiB7IGRlY2s6IFtdIH07XG59XG5cbi8qKiBBIG5hbWUgdXNhYmxlIGFzIGEgdmF1bHQgbm90ZSBuYW1lOiBubyBwYXRoIHNlcGFyYXRvcnMsIG5vbi1lbXB0eSAqL1xuZnVuY3Rpb24gaXNQbGFpbk5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBuYW1lLmxlbmd0aCA+IDAgJiYgIW5hbWUuaW5jbHVkZXMoXCIvXCIpICYmICFuYW1lLmluY2x1ZGVzKFwiXFxcXFwiKTtcbn1cblxuLyoqIEZpcnN0IGZyZWUgbmFtZSBpbiB0aGUgZmFtaWx5IGBiYXNlYCwgYGJhc2UtMmAsIGBiYXNlLTNgLCBcdTIwMjYgKi9cbmZ1bmN0aW9uIHVuaXF1ZU5hbWUoYmFzZTogc3RyaW5nLCBleGlzdGluZzogU2V0PHN0cmluZz4pOiBzdHJpbmcge1xuICBpZiAoIWV4aXN0aW5nLmhhcyhiYXNlKSkgcmV0dXJuIGJhc2U7XG4gIGZvciAobGV0IGkgPSAyOyA7IGkrKykge1xuICAgIGNvbnN0IGNhbmRpZGF0ZSA9IGAke2Jhc2V9LSR7aX1gO1xuICAgIGlmICghZXhpc3RpbmcuaGFzKGNhbmRpZGF0ZSkpIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGRlbGV0ZVNsaWRlcy50cyBcdTIwMTQgUHVyZSBcIkRlbGV0ZSBzbGlkZXNcIiBwbGFubmluZyBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXQgY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5XG4gKiAoc2VlIHRlc3QvZGVsZXRlU2xpZGVzLnRlc3QudHMpLiBUaGUgYWRhcHRlciBpbiBkZWNrLXNlcnZpY2UudHMgYXBwbGllc1xuICogdGhlIHBsYW46IGl0IHJld3JpdGVzIHRoZSBzdXJ2aXZpbmcgbm90ZXMnIGBkZWNrYCBwcm9wZXJ0aWVzLCB0aGVuIG1vdmVzXG4gKiB0aGUgZGVsZXRlZCBub3RlcyB0byB0aGUgdHJhc2guXG4gKlxuICogRGVsZXRpb24gc3BsaWNlcyB0aGUgY2hhaW4gaW5zdGVhZCBvZiBicmVha2luZyBpdDogZXZlcnkgbWF4aW1hbCBydW4gb2ZcbiAqIGRlbGV0ZWQgc2xpZGVzIGJldHdlZW4gdHdvIHN1cnZpdm9ycyBBIFx1MjE5MiBcdTIwMjYgXHUyMTkyIEIgaXMgcmVwYWlyZWQgYnkgcG9pbnRpbmdcbiAqIEEncyBgZGVja2AgbGluayBhdCBCIChgW11gIHdoZW4gdGhlIHJ1biByZWFjaGVzIHRoZSBlbmQgb2YgdGhlIGNoYWluKS5cbiAqIFdoZW4gYSBydW4gc3RhcnRzIGF0IHRoZSBjaGFpbiBoZWFkLCB0aGUgZmlyc3Qgc3Vydml2b3IgYmVjb21lcyB0aGUgbmV3XG4gKiBoZWFkIGFuZCBuZWVkcyBubyByZXdyaXRlIGF0IGFsbCAoaXRzIG93biBgZGVja2AgYWxyZWFkeSBwb2ludHMgb253YXJkKS5cbiAqL1xuXG4vKiogT25lIHN1cnZpdmluZyBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBtdXN0IGJlIHJld3JpdHRlbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVSZXdyaXRlIHtcbiAgLyoqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBwYXRoOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBWYXVsdCBwYXRoIG9mIHRoZSBub3RlIHRoYXQgc2hvdWxkIGJlY29tZSB0aGlzIG5vdGUncyBuZXh0IHNsaWRlLFxuICAgKiBvciBudWxsIHdoZW4gdGhlIG5vdGUgYmVjb21lcyB0aGUgbmV3IGxhc3Qgc2xpZGUgKGBkZWNrOiBbXWApLlxuICAgKi9cbiAgbmV4dFBhdGg6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKlxuICogUGxhbiB0aGUgZGVsZXRpb24gb2Ygc2xpZGVzIGZyb20gYW4gb3JkZXJlZCBkZWNrIGNoYWluLlxuICpcbiAqIGBjaGFpbmAgaXMgdGhlIGZ1bGwgc2xpZGUgb3JkZXIgKFswXSA9IGhlYWQpLiBPbmx5IHBhdGhzIHByZXNlbnQgaW4gdGhlXG4gKiBjaGFpbiBhcmUgY29uc2lkZXJlZDsgYW55dGhpbmcgZWxzZSBpbiBgZGVsZXRlUGF0aHNgIGlzIGlnbm9yZWQuIFJldHVybnNcbiAqIG9uZSByZXdyaXRlIHBlciBzdXJ2aXZpbmcgbm90ZSB0aGF0IGRpcmVjdGx5IHByZWNlZGVkIGEgZGVsZXRlZCBydW4sXG4gKiBvcmRlcmVkIGJ5IGNoYWluIHBvc2l0aW9uLiBEZWxldGluZyBub3RoaW5nIHlpZWxkcyBubyByZXdyaXRlczsgZGVsZXRpbmdcbiAqIGV2ZXJ5dGhpbmcgeWllbGRzIG5vIHJld3JpdGVzIGVpdGhlciAobm8gc3Vydml2b3JzIGxlZnQgdG8gcmVwYWlyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYW5EZWxldGVTbGlkZXMoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4pOiBEZWxldGVSZXdyaXRlW10ge1xuICBjb25zdCByZXdyaXRlczogRGVsZXRlUmV3cml0ZVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXRoID0gY2hhaW5baV07XG4gICAgaWYgKCFwYXRoIHx8IGRlbGV0ZVBhdGhzLmhhcyhwYXRoKSkgY29udGludWU7XG4gICAgLy8gRmluZCB0aGUgZmlyc3Qgc3Vydml2b3IgYWZ0ZXIgdGhpcyBub3RlJ3MgcG9zaXRpb24uXG4gICAgbGV0IGogPSBpICsgMTtcbiAgICB3aGlsZSAoaiA8IGNoYWluLmxlbmd0aCAmJiBkZWxldGVQYXRocy5oYXMoY2hhaW5bal0pKSBqKys7XG4gICAgY29uc3QgbmV4dFBhdGggPSBqIDwgY2hhaW4ubGVuZ3RoID8gY2hhaW5bal0gOiBudWxsO1xuICAgIGNvbnN0IGNoYW5nZWQgPSBuZXh0UGF0aCAhPT0gKGNoYWluW2kgKyAxXSA/PyBudWxsKTtcbiAgICBpZiAoY2hhbmdlZCkgcmV3cml0ZXMucHVzaCh7IHBhdGgsIG5leHRQYXRoIH0pO1xuICB9XG4gIHJldHVybiByZXdyaXRlcztcbn1cblxuLyoqXG4gKiBQaWNrIHdoZXJlIHRoZSBlZGl0b3Igc2hvdWxkIGxhbmQgYWZ0ZXIgZGVsZXRpbmcgc2xpZGVzOiB0aGUgbmVhcmVzdFxuICogc3Vydml2b3Igb2YgYGRlbGV0ZWRQYXRoc2AnIG5laWdoYm91cmhvb2QgYXJvdW5kIGBmb2N1c1BhdGhgIFx1MjAxNCBwcmVmZXJcbiAqIHRoZSBjbG9zZXN0IHN1cnZpdm9yIGFmdGVyIGl0LCBlbHNlIHRoZSBjbG9zZXN0IGJlZm9yZSBpdC4gUmV0dXJucyBudWxsXG4gKiB3aGVuIGBmb2N1c1BhdGhgIHN1cnZpdmVzIG9yIG5vdGhpbmcgbmVhcmJ5IHJlbWFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrTGFuZGluZ1BhdGgoXG4gIGNoYWluOiBzdHJpbmdbXSxcbiAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbik6IHN0cmluZyB8IG51bGwge1xuICBpZiAoIWZvY3VzUGF0aCB8fCAhZGVsZXRlUGF0aHMuaGFzKGZvY3VzUGF0aCkpIHJldHVybiBudWxsO1xuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoZm9jdXNQYXRoKTtcbiAgaWYgKGluZGV4ID09PSAtMSkgcmV0dXJuIG51bGw7XG4gIGZvciAobGV0IGkgPSBpbmRleCArIDE7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGlmICghZGVsZXRlUGF0aHMuaGFzKGNoYWluW2ldKSkgcmV0dXJuIGNoYWluW2ldO1xuICB9XG4gIGZvciAobGV0IGkgPSBpbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIE1lbnUsIFRGaWxlLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IENvbmZpcm1EZWxldGVNb2RhbCB9IGZyb20gXCIuL2NvbmZpcm0tZGVsZXRlXCI7XG5cbi8qKiBWaWV3IHR5cGUgaWQgb2YgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsICovXG5leHBvcnQgY29uc3QgU0xJREVTX1BBTkVMX1ZJRVcgPSBcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIjtcblxuLyoqXG4gKiBTaWRlYmFyIHBhbmVsIGxpc3RpbmcgZXZlcnkgc2xpZGUgb2YgdGhlIGFjdGl2ZSBub3RlJ3MgZGVjayAobmV4dC1vbmx5XG4gKiBjaGFpbiBvcmRlcikuIFRha2VzIG92ZXIgdGhlIGFnZ3JlZ2F0aW9uL2VudHJ5IHJvbGUgdGhlIG92ZXJ2aWV3IHBhZ2VcbiAqIHVzZWQgdG8gcGxheSBiZWZvcmUgdjEuMC4wLlxuICpcbiAqIEludGVyYWN0aW9uOlxuICogICAtIGNsaWNrICAgICAgICAgICAgXHUyMTkyIG9wZW4gdGhhdCBzbGlkZSAoYW5kIGNsZWFyIGFueSBzZWxlY3Rpb24pXG4gKiAgIC0gTW9kK2NsaWNrICAgICAgICBcdTIxOTIgdG9nZ2xlIHRoZSBpdGVtIGluIHRoZSBzZWxlY3Rpb25cbiAqICAgLSBTaGlmdCtjbGljayAgICAgIFx1MjE5MiBleHRlbmQgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBsYXN0IGFuY2hvclxuICogICAtIHJpZ2h0LWNsaWNrICAgICAgXHUyMTkyIGNvbnRleHQgbWVudTogQ3JlYXRlIG5leHQgc2xpZGUgLyBEZWxldGUgc2xpZGUocylcbiAqL1xuZXhwb3J0IGNsYXNzIFNsaWRlc1BhbmVsVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgLyoqIENoYWluIHNpZ25hdHVyZSBvZiB0aGUgY3VycmVudGx5IHJlbmRlcmVkIGxpc3QgKi9cbiAgcHJpdmF0ZSBsYXN0Q2hhaW46IHN0cmluZ1tdID0gW107XG4gIC8qKiBSZW5kZXJlZCBpdGVtIGVsZW1lbnRzLCBpbmRleC1hbGlnbmVkIHdpdGggbGFzdENoYWluICovXG4gIHByaXZhdGUgaXRlbXM6IHsgcGF0aDogc3RyaW5nOyBlbDogSFRNTEVsZW1lbnQgfVtdID0gW107XG4gIC8qKiBDdXJyZW50bHkgc2VsZWN0ZWQgc2xpZGUgcGF0aHMgKG11bHRpLXNlbGVjdCBmb3IgRGVsZXRlKSAqL1xuICBwcml2YXRlIHNlbGVjdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIC8qKiBTZWxlY3Rpb24gYW5jaG9yIGZvciBTaGlmdCtjbGljayByYW5nZSBleHRlbnNpb24gKi9cbiAgcHJpdmF0ZSBhbmNob3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4sXG4gICAgbGVhZjogV29ya3NwYWNlTGVhZixcbiAgKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBTTElERVNfUEFORUxfVklFVztcbiAgfVxuXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiU2xpZGVzXCI7XG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwicHJlc2VudGF0aW9uXCI7XG4gIH1cblxuICBhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5hZGRDbGFzcyhcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIik7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9uKFwiY2hhbmdlZFwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhc3luYyBvbkNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IFtdO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bmMgdGhlIGxpc3Qgd2l0aCB0aGUgYWN0aXZlIG5vdGUncyBkZWNrLiBJbmNyZW1lbnRhbCBvbiBwdXJwb3NlOiB0aGVcbiAgICogcmVmcmVzaCBldmVudHMgYWxzbyBmaXJlIHdoaWxlIGEgY2xpY2sgb24gYW4gZW50cnkgaXMgaW4gZmxpZ2h0ICh0aGVcbiAgICogbW91c2Vkb3duIGFjdGl2YXRlcyB0aGlzIGxlYWYpLCBhbmQgcmVidWlsZGluZyB0aGUgRE9NIG1pZC1nZXN0dXJlXG4gICAqIGRlc3Ryb3lzIHRoZSBjbGljayB0YXJnZXQgXHUyMDE0IHdoaWNoIG1hZGUgb3BlbmluZyBhIHNsaWRlIHRha2UgdHdvIGNsaWNrc1xuICAgKiB3aGVuZXZlciB0aGUgcGFuZWwgd2FzIG5vdCB0aGUgYWN0aXZlIGxlYWYuIFVuY2hhbmdlZCBjaGFpbnMgb25seSBnZXRcbiAgICogdGhlaXIgaGlnaGxpZ2h0IHVwZGF0ZWQsIHNvIGl0ZW0gZWxlbWVudHMgYWx3YXlzIHN1cnZpdmUuXG4gICAqL1xuICBwcml2YXRlIHJlbmRlcigpOiB2b2lkIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBkZWNrID0gZmlsZSA/IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSkgOiBudWxsO1xuICAgIGNvbnN0IGNoYWluID0gZGVja1xuICAgICAgPyBkZWNrLmNoYWluLmZpbHRlcigocCkgPT4gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHApIGluc3RhbmNlb2YgVEZpbGUpXG4gICAgICA6IFtdO1xuXG4gICAgLy8gRHJvcCBzZWxlY3Rpb25zIHdob3NlIG5vdGUgdmFuaXNoZWQgZnJvbSB0aGUgY2hhaW4gbWVhbndoaWxlXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWQuc2l6ZSA+IDApIHtcbiAgICAgIGNvbnN0IGxpdmUgPSBuZXcgU2V0KGNoYWluKTtcbiAgICAgIGZvciAoY29uc3QgcGF0aCBvZiB0aGlzLnNlbGVjdGVkKSBpZiAoIWxpdmUuaGFzKHBhdGgpKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShwYXRoKTtcbiAgICB9XG4gICAgLy8gQSBkZWFkIGFuY2hvciBtdXN0IG5vdCBzaWxlbnRseSB0dXJuIGEgU2hpZnQrY2xpY2sgaW50byBhIHRvZ2dsZVxuICAgIGlmICh0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiAhY2hhaW4uaW5jbHVkZXModGhpcy5hbmNob3IpKSB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAoIWNoYWluRXF1YWxzKHRoaXMubGFzdENoYWluLCBjaGFpbikpIHtcbiAgICAgIHRoaXMucmVidWlsZChjaGFpbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5pdGVtcykgaXQuZWwuY2xhc3NMaXN0LnRvZ2dsZShcImlzLWFjdGl2ZVwiLCBpdC5wYXRoID09PSBmaWxlPy5wYXRoKTtcbiAgICB9XG4gICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICB9XG5cbiAgLyoqIEZ1bGwgcmVidWlsZCAoY2hhaW4gc2hhcGUgY2hhbmdlZCkgKi9cbiAgcHJpdmF0ZSByZWJ1aWxkKGNoYWluOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmNvbnRhaW5lckVsO1xuICAgIHJvb3QuZW1wdHkoKTtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgdGhpcy5sYXN0Q2hhaW4gPSBjaGFpbjtcblxuICAgIGlmIChjaGFpbi5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGVtcHR5ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1lbXB0eVwiIH0pO1xuICAgICAgZW1wdHkuc2V0VGV4dChcbiAgICAgICAgXCJObyBzbGlkZXMgZGVjayBcdTIwMTQgb3BlbiBhIGRlY2sgbm90ZSwgb3IgcnVuIGNyZWF0ZSBuZXh0IHNsaWRlIG9uIGFueSBub3RlIHRvIHN0YXJ0IG9uZS5cIixcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGg7XG4gICAgY2hhaW4uZm9yRWFjaCgocGF0aCwgaSkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybjtcbiAgICAgIGNvbnN0IGl0ZW0gPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWl0ZW1cIiB9KTtcbiAgICAgIGlmIChwYXRoID09PSBhY3RpdmVQYXRoKSBpdGVtLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtbnVtXCIgfSkuc2V0VGV4dChTdHJpbmcoaSArIDEpKTtcbiAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLXRpdGxlXCIgfSkuc2V0VGV4dChmLmJhc2VuYW1lKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB0aGlzLm9uSXRlbUNsaWNrKGUsIGksIGYpKTtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5vcGVuQ29udGV4dE1lbnUoZSwgZik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuaXRlbXMucHVzaCh7IHBhdGgsIGVsOiBpdGVtIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENsaWNrIHJvdXRpbmc6IHBsYWluID0gb3BlbiwgTW9kID0gdG9nZ2xlIHNlbGVjdCwgU2hpZnQgPSByYW5nZSBzZWxlY3QgKi9cbiAgcHJpdmF0ZSBvbkl0ZW1DbGljayhlOiBNb3VzZUV2ZW50LCBpbmRleDogbnVtYmVyLCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGlmIChlLnNoaWZ0S2V5IHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIC8vIFJhbmdlIGFuY2hvcjogdGhlIGxhc3Qgc2VsZWN0ZWQgaXRlbSwgb3IgdGhlIGRpc3BsYXllZCBzbGlkZVxuICAgICAgICAvLyB3aGVuIG5vIHVzYWJsZSBhbmNob3IgZXhpc3RzIChmaXJzdCBTaGlmdCtjbGljayBpbiBhIHNlc3Npb24pLlxuICAgICAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBudWxsO1xuICAgICAgICBjb25zdCBhbmNob3JQYXRoID1cbiAgICAgICAgICB0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLnNvbWUoKGl0KSA9PiBpdC5wYXRoID09PSB0aGlzLmFuY2hvcilcbiAgICAgICAgICAgID8gdGhpcy5hbmNob3JcbiAgICAgICAgICAgIDogYWN0aXZlUGF0aDtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuaXRlbXMuZmluZEluZGV4KChpdCkgPT4gaXQucGF0aCA9PT0gYW5jaG9yUGF0aCk7XG4gICAgICAgIGlmIChhbmNob3JQYXRoICE9PSBudWxsICYmIGZyb20gIT09IC0xKSB7XG4gICAgICAgICAgY29uc3QgW2xvLCBoaV0gPSBmcm9tIDwgaW5kZXggPyBbZnJvbSwgaW5kZXhdIDogW2luZGV4LCBmcm9tXTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gbG87IGkgPD0gaGk7IGkrKykgdGhpcy5zZWxlY3RlZC5hZGQodGhpcy5pdGVtc1tpXS5wYXRoKTtcbiAgICAgICAgICAvLyBUaGUgZGlzcGxheWVkIHNsaWRlIGpvaW5zIGV2ZXJ5IFNoaWZ0IHNlbGVjdGlvbiBcdTIwMTQgZXh0ZW5kaW5nIGFcbiAgICAgICAgICAvLyBzZWxlY3Rpb24gbmV2ZXIgc2lsZW50bHkgZHJvcHMgdGhlIHBhZ2UgeW91IGFyZSBsb29raW5nIGF0LlxuICAgICAgICAgIGlmIChhY3RpdmVQYXRoICE9PSBudWxsICYmIHRoaXMuaXRlbXMuc29tZSgoaXQpID0+IGl0LnBhdGggPT09IGFjdGl2ZVBhdGgpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmFkZChhY3RpdmVQYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hbmNob3IgPSB0aGlzLml0ZW1zW2luZGV4XS5wYXRoO1xuICAgICAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE1vZCAob3IgU2hpZnQgd2l0aCBubyByZWFjaGFibGUgYW5jaG9yKTogcHVyZSB0b2dnbGUgXHUyMDE0IHRoZSBvbmx5IHdheVxuICAgICAgLy8gdG8gY2FuY2VsIGFuIGl0ZW0gb3V0IG9mIHRoZSBzZWxlY3Rpb24uXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZC5oYXMoZi5wYXRoKSkgdGhpcy5zZWxlY3RlZC5kZWxldGUoZi5wYXRoKTtcbiAgICAgIGVsc2UgdGhpcy5zZWxlY3RlZC5hZGQoZi5wYXRoKTtcbiAgICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgLy8gTm8gc2VsZWN0aW9uIGFmdGVyIGEgcGxhaW4gY2xpY2ssIGJ1dCB0aGUgY2xpY2tlZCBzbGlkZSBzdGF5cyB0aGVcbiAgICAvLyBTaGlmdCtjbGljayBhbmNob3IgXHUyMDE0IG1hdGNoaW5nIHRoZSBmaWxlLWV4cGxvcmVyIGZlZWw6IHBpY2sgYSBzbGlkZSxcbiAgICAvLyB0aGVuIFNoaWZ0K2NsaWNrIGEgbGF0ZXIgb25lIHRvIHNlbGVjdCB0aGUgd2hvbGUgcmFuZ2UgYmV0d2VlbiB0aGVtLlxuICAgIHRoaXMuYW5jaG9yID0gZi5wYXRoO1xuICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICB2b2lkIHRoaXMub3BlblNsaWRlKGYpO1xuICB9XG5cbiAgLyoqIFJlZmxlY3QgdGhlIHNlbGVjdGlvbiBzZXQgb24gdGhlIHJlbmRlcmVkIGl0ZW1zIHdpdGhvdXQgYSByZWJ1aWxkICovXG4gIHByaXZhdGUgc3luY1NlbGVjdGlvbkNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtc2VsZWN0ZWRcIiwgdGhpcy5zZWxlY3RlZC5oYXMoaXQucGF0aCkpO1xuICB9XG5cbiAgLyoqIFJpZ2h0LWNsaWNrIG1lbnUgb24gb25lIGl0ZW07IG9wZXJhdGVzIG9uIHRoZSB3aG9sZSBzZWxlY3Rpb24gd2hlbiBpdCBiZWxvbmdzIHRvIG9uZSAqL1xuICBwcml2YXRlIG9wZW5Db250ZXh0TWVudShlOiBNb3VzZUV2ZW50LCBmOiBURmlsZSk6IHZvaWQge1xuICAgIGNvbnN0IG1lbnUgPSBuZXcgTWVudSgpO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUoXCJDcmVhdGUgbmV4dCBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInBsdXNcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdm9pZCB0aGlzLmNyZWF0ZU5leHRBZnRlcihmKSksXG4gICAgKTtcbiAgICBjb25zdCB0YXJnZXRzID0gdGhpcy5zZWxlY3RlZC5oYXMoZi5wYXRoKSA/IFsuLi50aGlzLnNlbGVjdGVkXSA6IFtmLnBhdGhdO1xuICAgIGNvbnN0IG9yZGVyZWQgPSB0aGlzLmxhc3RDaGFpbi5maWx0ZXIoKHApID0+IHRhcmdldHMuaW5jbHVkZXMocCkpO1xuICAgIG1lbnUuYWRkSXRlbSgobWkpID0+XG4gICAgICBtaVxuICAgICAgICAuc2V0VGl0bGUob3JkZXJlZC5sZW5ndGggPiAxID8gYERlbGV0ZSAke29yZGVyZWQubGVuZ3RofSBzbGlkZXNgIDogXCJEZWxldGUgc2xpZGVcIilcbiAgICAgICAgLnNldEljb24oXCJ0cmFzaFwiKVxuICAgICAgICAub25DbGljaygoKSA9PiB0aGlzLmRlbGV0ZVNsaWRlcyhvcmRlcmVkKSksXG4gICAgKTtcbiAgICBtZW51LnNob3dBdE1vdXNlRXZlbnQoZSk7XG4gIH1cblxuICAvKiogQ3JlYXRlIGEgc2xpZGUgYWZ0ZXIgdGhlIHJpZ2h0LWNsaWNrZWQgb25lICh3aXRob3V0IG9wZW5pbmcgaXQpICovXG4gIHByaXZhdGUgYXN5bmMgY3JlYXRlTmV4dEFmdGVyKGY6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcGxhbiA9IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXh0KGYpO1xuICAgIGlmICghcGxhbikgcmV0dXJuO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXh0KGYsIHBsYW4sIGZhbHNlKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqIENvbmZpcm0sIHRoZW4gdHJhc2ggdGhlIGdpdmVuIHNsaWRlcyBhbmQgc3BsaWNlIHRoZW0gb3V0IG9mIHRoZSBjaGFpbiAqL1xuICBwcml2YXRlIGRlbGV0ZVNsaWRlcyhwYXRoczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgcnVuID0gKCk6IHZvaWQgPT4gdm9pZCB0aGlzLnJ1bkRlbGV0aW9uKHBhdGhzKTtcblxuICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcykge1xuICAgICAgcnVuKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5hbWVzID0gcGF0aHMubWFwKChwKSA9PiB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHApO1xuICAgICAgcmV0dXJuIGYgaW5zdGFuY2VvZiBURmlsZSA/IGYuYmFzZW5hbWUgOiBwO1xuICAgIH0pO1xuICAgIG5ldyBDb25maXJtRGVsZXRlTW9kYWwodGhpcy5hcHAsIG5hbWVzLCBydW4sIGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMgPSBmYWxzZTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIH0pLm9wZW4oKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcnVuRGVsZXRpb24ocGF0aHM6IHN0cmluZ1tdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbDtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlRGVsZXRlU2xpZGVzKFxuICAgICAgdGhpcy5sYXN0Q2hhaW4sXG4gICAgICBuZXcgU2V0KHBhdGhzKSxcbiAgICAgIGFjdGl2ZVBhdGgsXG4gICAgKTtcblxuICAgIGZvciAoY29uc3QgcGF0aCBvZiBwYXRocykgdGhpcy5zZWxlY3RlZC5kZWxldGUocGF0aCk7XG4gICAgaWYgKHRoaXMuYW5jaG9yICE9PSBudWxsICYmIHBhdGhzLmluY2x1ZGVzKHRoaXMuYW5jaG9yKSkgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJlc3VsdC5sYW5kaW5nUGF0aCkge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXN1bHQubGFuZGluZ1BhdGgpO1xuICAgICAgaWYgKGYgaW5zdGFuY2VvZiBURmlsZSkgYXdhaXQgdGhpcy5vcGVuU2xpZGUoZik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKiogT3BlbiBhIHNsaWRlIGluIGEgbWFya2Rvd24gbGVhZiAobmV2ZXIgaW4gdGhpcyBwYW5lbCdzIG93biBsZWFmKSAqL1xuICBwcml2YXRlIGFzeW5jIG9wZW5TbGlkZShmOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGxlYWYgPVxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShcIm1hcmtkb3duXCIpWzBdID8/IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZik7XG4gICAgdGhpcy5hcHAud29ya3NwYWNlLnNldEFjdGl2ZUxlYWYobGVhZiwgeyBmb2N1czogdHJ1ZSB9KTtcbiAgfVxufVxuXG4vKiogT3JkZXItc2Vuc2l0aXZlIGNoYWluIGNvbXBhcmlzb24gKi9cbmZ1bmN0aW9uIGNoYWluRXF1YWxzKGE6IHN0cmluZ1tdLCBiOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gYS5sZW5ndGggPT09IGIubGVuZ3RoICYmIGEuZXZlcnkoKHAsIGkpID0+IHAgPT09IGJbaV0pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuLyoqIE1heCBuYW1lcyBzaG93biBpbiB0aGUgZGlhbG9nIGJlZm9yZSBjb2xsYXBzaW5nIGludG8gYSBcIitOIG1vcmVcIiBsaW5lICovXG5jb25zdCBNQVhfVklTSUJMRV9OQU1FUyA9IDg7XG5cbi8qKlxuICogQ29uZmlybWF0aW9uIGRpYWxvZyBmb3IgRGVsZXRlIHNsaWRlcy4gTGlzdHMgdGhlIG5vdGVzIGFib3V0IHRvIGJlXG4gKiB0cmFzaGVkIChudW1iZXJlZCBsaWtlIHRoZSBwYW5lbCwgc28gdGhlIHVzZXIgY2FuIG1hcCB0aGVtIDE6MSksIG9mZmVyc1xuICogYSBcImRvbid0IGFzayBhZ2FpblwiIHRvZ2dsZSB0aGF0IGZsaXBzIHRoZSBgY29uZmlybURlbGV0ZVNsaWRlc2Agc2V0dGluZ1xuICogb2ZmIChwZXJzaXN0ZWQgYnkgdGhlIGNhbGxlciB2aWEgb25Eb250QXNrKSwgYW5kIGFza3MgZm9yIGFuIGV4cGxpY2l0XG4gKiBDYW5jZWwgLyBEZWxldGUgZGVjaXNpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25maXJtRGVsZXRlTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgY29uZmlybWVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgYXBwOiBBcHAsXG4gICAgcHJpdmF0ZSBuYW1lczogc3RyaW5nW10sXG4gICAgcHJpdmF0ZSBvbkNvbmZpcm06ICgpID0+IHZvaWQsXG4gICAgcHJpdmF0ZSBvbkRvbnRBc2s6ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICkge1xuICAgIHN1cGVyKGFwcCk7XG4gIH1cblxuICBvbk9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgICB0aGlzLm1vZGFsRWwuYWRkQ2xhc3MoXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlXCIpO1xuXG4gICAgY29uc3QgY291bnQgPSB0aGlzLm5hbWVzLmxlbmd0aDtcbiAgICB0aGlzLmNvbnRlbnRFbC5jcmVhdGVFbChcImgzXCIsIHtcbiAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXRpdGxlXCIsXG4gICAgICB0ZXh0OiBjb3VudCA9PT0gMSA/IFwiRGVsZXRlIHRoaXMgc2xpZGU/XCIgOiBgRGVsZXRlICR7Y291bnR9IHNsaWRlcz9gLFxuICAgIH0pO1xuICAgIHRoaXMuY29udGVudEVsXG4gICAgICAuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtc3ViXCIgfSlcbiAgICAgIC5zZXRUZXh0KFxuICAgICAgICBjb3VudCA9PT0gMVxuICAgICAgICAgID8gXCJUaGUgbm90ZSB3aWxsIGJlIG1vdmVkIHRvIHRoZSB0cmFzaC5cIlxuICAgICAgICAgIDogXCJUaGVzZSBub3RlcyB3aWxsIGJlIG1vdmVkIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgICk7XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbGlzdFwiIH0pO1xuICAgIGZvciAoY29uc3QgW2ksIG5hbWVdIG9mIHRoaXMubmFtZXMuc2xpY2UoMCwgTUFYX1ZJU0lCTEVfTkFNRVMpLmVudHJpZXMoKSkge1xuICAgICAgY29uc3Qgcm93ID0gbGlzdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1yb3dcIiB9KTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbnVtXCIgfSkuc2V0VGV4dChTdHJpbmcoaSArIDEpKTtcbiAgICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbmFtZVwiIH0pLnNldFRleHQobmFtZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm5hbWVzLmxlbmd0aCA+IE1BWF9WSVNJQkxFX05BTUVTKSB7XG4gICAgICBsaXN0XG4gICAgICAgIC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1tb3JlXCIgfSlcbiAgICAgICAgLnNldFRleHQoYFx1MjAyNiBhbmQgJHt0aGlzLm5hbWVzLmxlbmd0aCAtIE1BWF9WSVNJQkxFX05BTUVTfSBtb3JlYCk7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZERvbnRBc2tSb3coKTtcbiAgICB0aGlzLmJ1aWxkQWN0aW9ucygpO1xuICB9XG5cbiAgLyoqIENvbXBhY3QgbGVmdC1hbGlnbmVkIFwiZG9uJ3QgYXNrIGFnYWluXCIgY2hlY2tib3ggcm93ICovXG4gIHByaXZhdGUgYnVpbGREb250QXNrUm93KCk6IHZvaWQge1xuICAgIGNvbnN0IHJvdyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWRvbnRhc2tcIiB9KTtcbiAgICByb3cuY3JlYXRlRWwoXCJsYWJlbFwiKS5zZXRUZXh0KFwiRG9uJ3QgYXNrIGFnYWluXCIpO1xuICAgIGNvbnN0IGNoZWNrYm94ID0gcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyB0eXBlOiBcImNoZWNrYm94XCIgfSk7XG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMub25Eb250QXNrKCkudGhlbihcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIGNoZWNrYm94LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIC8vIGtlZXAgdGhlIGNoZWNrYm94IGVuYWJsZWQgaWYgcGVyc2lzdGluZyB0aGUgcHJlZmVyZW5jZSBmYWlsZWRcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmlnaHQtYWxpZ25lZCBDYW5jZWwgLyBEZWxldGUgYnV0dG9uIHJvdyAqL1xuICBwcml2YXRlIGJ1aWxkQWN0aW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtYWN0aW9uc1wiIH0pO1xuICAgIGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkNhbmNlbFwiIH0pLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmNsb3NlKCkpO1xuICAgIGFjdGlvbnNcbiAgICAgIC5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiRGVsZXRlXCIsIGNsczogXCJtb2Qtd2FybmluZ1wiIH0pXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5jb25maXJtZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29uZmlybWVkKSB0aGlzLm9uQ29uZmlybSgpO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgdHlwZSBTZXR0aW5nRGVmaW5pdGlvbkl0ZW0gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgU0xJREVTX1RIRU1FUyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKlxuICogU2V0dGluZ3MgdGFiOiB0b2dnbGVzIHRoZSBuYXYgYnV0dG9ucywgcGFnZSBudW1iZXIsIGF1dG8tZW50ZXIgYW5kIGJhclxuICogdmlzaWJpbGl0eS4gRGVjbGFyYXRpdmUgZGVmaW5pdGlvbnMgKE9ic2lkaWFuIFx1MjI2NSAxLjEzLjAsIHNlYXJjaGFibGUgaW4gdGhlXG4gKiBzZXR0aW5ncyBtb2RhbCkgd2l0aCBhbiBpbXBlcmF0aXZlIGBkaXNwbGF5KClgIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbikge1xuICAgIHN1cGVyKHBsdWdpbi5hcHAsIHBsdWdpbik7XG4gIH1cblxuICAvKiogRGVjbGFyYXRpdmUgc2V0dGluZ3MgKE9ic2lkaWFuIFx1MjI2NSAxLjEzLjApIFx1MjAxNCBzZWFyY2hhYmxlIGJ5IHRoZSBzZXR0aW5ncyBtb2RhbC4gKi9cbiAgZ2V0U2V0dGluZ0RlZmluaXRpb25zKCk6IFNldHRpbmdEZWZpbml0aW9uSXRlbVtdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBuYW1lOiBcIlN0eWxlIHRlbXBsYXRlXCIsXG4gICAgICAgIGRlc2M6IFwiQnVpbHQtaW4gbG9vayBmb3IgdGhlIHNsaWRlcyBjYXJkIGFuZCBzbGlkZXMgYmFyIChib3JkZXIsIGJhY2tncm91bmQsIHNoYWRvdywgYmFyIHN0eWxpbmcpLiBFdmVyeSB0ZW1wbGF0ZSBhZGFwdHMgdG8gbGlnaHQgYW5kIGRhcmsgdGhlbWVzLlwiLFxuICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAga2V5OiBcInNsaWRlc1RoZW1lXCIsXG4gICAgICAgICAgdHlwZTogXCJkcm9wZG93blwiLFxuICAgICAgICAgIG9wdGlvbnM6IE9iamVjdC5mcm9tRW50cmllcyhTTElERVNfVEhFTUVTLm1hcCgodCkgPT4gW3QuaWQsIHQubGFiZWxdKSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkNlbnRlciBpbWFnZXNcIixcbiAgICAgICAgZGVzYzogXCJJbWFnZXMgcmVuZGVyIGNlbnRlcmVkIG9uIHRoZSBzbGlkZSBhcyBhIGNhcmQgYmxvY2sgZXhhY3RseSBhcyB0YWxsIGFzIHRoZSBwaWN0dXJlLiBUdXJuIG9mZiBmb3IgT2JzaWRpYW4ncyB1c3VhbCBiZWhhdmlvcjogaW1hZ2VzIHN0YXkgaW5saW5lIHdpdGggdGhlIHRleHQgKGEgc21hbGwgaW1hZ2UgYW5kIGl0cyBjYXB0aW9uIHNpdCBvbiB0aGUgc2FtZSByb3cpLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJpbWFnZUxheW91dFwiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgc2xpZGVzIGJhclwiLFxuICAgICAgICBkZXNjOiBcIk1hc3RlciB0b2dnbGUgZm9yIHRoZSBlbnRpcmUgc2xpZGVzIGJhciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3dcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd1NsaWRlc0JhclwiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgcHJldmlvdXMvbmV4dCBidXR0b25zXCIsXG4gICAgICAgIGRlc2M6IFwiU2hvdyBcdTI1QzAgXHUyNUI2IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgd2hlbiB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KVwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93TmF2QnV0dG9uc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlBhZ2UgbnVtYmVyIHN0eWxlXCIsXG4gICAgICAgIGRlc2M6ICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIm4gLyB0b3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJuXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwibm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgICAgY29udHJvbDoge1xuICAgICAgICAgIGtleTogXCJwYWdlTnVtYmVyU3R5bGVcIixcbiAgICAgICAgICB0eXBlOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNob3cgcHJvZ3Jlc3MgYmFyXCIsXG4gICAgICAgIGRlc2M6IFwiRGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgLS0gb25lIHBlciBzbGlkZSwgY2xpY2sgdG8ganVtcFwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93UHJvZ3Jlc3NcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJBdXRvLWVudGVyIHNsaWRlcyBtb2RlXCIsXG4gICAgICAgIGRlc2M6IFwiT3BlbiBkZWNrIG5vdGVzIGRpcmVjdGx5IGluIFNsaWRlcyBtb2RlLiBMZWF2ZSBvZmYgdG8gZW50ZXIgbWFudWFsbHkgd2l0aCB0aGUgVG9nZ2xlIFNsaWRlcyBNb2RlIGNvbW1hbmQgKE1vZCtTaGlmdCtFKSBvciB0aGUgcHJldmlvdXMvbmV4dCBwYWdlIGhvdGtleXMuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImF1dG9FbnRlclNsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkVzY2FwZSBleGl0cyBzbGlkZXMgbW9kZVwiLFxuICAgICAgICBkZXNjOiBcIlByZXNzIGVzY2FwZSB0byBsZWF2ZSBzbGlkZXMgbW9kZSBhbmQgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyB2aWV3XCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImVzY0V4aXRzU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2xpZGVzIHRpdGxlXCIsXG4gICAgICAgIGRlc2M6IFwiRnJvbnRtYXR0ZXIgcHJvcGVydHkgdG8gc2hvdyBhcyB0aGUgY2FyZCB0aXRsZSAoSDEpLiBMZWF2ZSBlbXB0eSBmb3Igbm9uZTsgdHlwZSBgZmlsZW5hbWVgIHRvIHVzZSB0aGUgZmlsZSBuYW1lIFx1MjAxNCB0aGF0IHRpdGxlIGlzIGVkaXRhYmxlIChyZW5hbWVzIHRoZSBub3RlKTsgcHJvcGVydHktYmFja2VkIHRpdGxlcyBhcmUgcmVhZC1vbmx5IChlZGl0IHRoZSBwcm9wZXJ0eSBvdXRzaWRlIHNsaWRlcyBtb2RlKS5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2xpZGVzVGl0bGVcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIkUuZy4gVGl0bGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJCYXIgcHJvcGVydGllc1wiLFxuICAgICAgICBkZXNjOiBcIkNvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyB0byBzaG93IGluIHRoZSBzbGlkZXMgYmFyIChlLmcuIGB1bml2ZXJzaXR5LCBzaG9ydC10aXRsZSwgZGF0ZWApLiBFYWNoIHZhbHVlIGZpbGxzIGFuIGVxdWFsLXdpZHRoIGNvbHVtbjsgZHJhZyBkaXZpZGVycyB0byByZXNpemUuIExlYXZlIGVtcHR5IHRvIHNob3cgbm90aGluZy5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiYmFyUHJvcGVydGllc1wiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiRS5nLiBVbml2ZXJzaXR5LCBkYXRlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ29uZmlybSBzbGlkZSBkZWxldGlvblwiLFxuICAgICAgICBkZXNjOiBcIkFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgc2xpZGVzIHBhbmVsJ3MgcmlnaHQtY2xpY2sgbWVudS4gRGVsZXRpb24gbW92ZXMgc2xpZGVzIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiY29uZmlybURlbGV0ZVNsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIk5hdmlnYXRpb24gaG90a2V5c1wiLFxuICAgICAgICBkZXNjOiBcIkRlZmF1bHQ6IFByZXZpb3VzIHBhZ2UgbW9kK3NoaWZ0K1x1MjE5MCwgbmV4dCBwYWdlIG1vZCtzaGlmdCtcdTIxOTIuIFJlYmluZCB1bmRlciBzZXR0aW5ncyBcdTIxOTIgaG90a2V5cy5cIixcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgICAgLy8gT3BlbiBPYnNpZGlhbidzIGhvdGtleXMgc2V0dGluZ3MgcGFnZSAoaW50ZXJuYWwgQVBJOyBpZ25vcmUgZmFpbHVyZXMpXG4gICAgICAgICAgKFxuICAgICAgICAgICAgdGhpcy5hcHAgYXMgdW5rbm93biBhcyB7IHNldHRpbmc/OiB7IG9wZW5UYWJCeUlkPzogKGlkOiBzdHJpbmcpID0+IHZvaWQgfSB9XG4gICAgICAgICAgKS5zZXR0aW5nPy5vcGVuVGFiQnlJZD8uKFwiaG90a2V5c1wiKTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXTtcbiAgfVxuXG4gIC8qKiBQZXJzaXN0IGNvbnRyb2wgY2hhbmdlcywgdGhlbiByZWZyZXNoIHRoZSBiYXIgc28gdGhlIG5ldyBzZXR0aW5nIGFwcGxpZXMuICovXG4gIHNldENvbnRyb2xWYWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiB2b2lkIHtcbiAgICB2b2lkIHRoaXMuYXBwbHlDb250cm9sVmFsdWUoa2V5LCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGFwcGx5Q29udHJvbFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IFByb21pc2U8dm9pZD4ge1xuICAgICh0aGlzLnBsdWdpbi5zZXR0aW5ncyBhcyB1bmtub3duIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtrZXldID0gdmFsdWU7XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIEltcGVyYXRpdmUgZmFsbGJhY2sgZm9yIE9ic2lkaWFuIDwgMS4xMy4wIChub3QgY2FsbGVkIHdpdGggZGVmaW5pdGlvbnMgcHJlc2VudCkuICovXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlN0eWxlIHRlbXBsYXRlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgc2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBTTElERVNfVEhFTUVTKSBkcm9wZG93bi5hZGRPcHRpb24odC5pZCwgdC5sYWJlbCk7XG4gICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDZW50ZXIgaW1hZ2VzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJJbWFnZXMgcmVuZGVyIGNlbnRlcmVkIG9uIHRoZSBzbGlkZSBhcyBhIGNhcmQgYmxvY2sgZXhhY3RseSBhcyB0YWxsIGFzIHRoZSBwaWN0dXJlLiBUdXJuIG9mZiBmb3IgT2JzaWRpYW4ncyB1c3VhbCBiZWhhdmlvcjogaW1hZ2VzIHN0YXkgaW5saW5lIHdpdGggdGhlIHRleHQgKGEgc21hbGwgaW1hZ2UgYW5kIGl0cyBjYXB0aW9uIHNpdCBvbiB0aGUgc2FtZSByb3cpLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuaW1hZ2VMYXlvdXQpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmltYWdlTGF5b3V0ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBzbGlkZXMgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcIk1hc3RlciB0b2dnbGUgZm9yIHRoZSBlbnRpcmUgc2xpZGVzIGJhciBhdCB0aGUgYm90dG9tIG9mIHRoZSB3aW5kb3dcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByZXZpb3VzL25leHQgYnV0dG9uc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU2hvdyBcdTI1QzAgXHUyNUI2IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgd2hlbiB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayAoaGFzIGEgYGRlY2tgIHByb3BlcnR5KVwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dOYXZCdXR0b25zID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiUGFnZSBudW1iZXIgc3R5bGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnU2hvd24gYXQgdGhlIGJvdHRvbS1yaWdodC4gXCJuIC8gdG90YWxcIjogMS1iYXNlZCBvdmVyIHRoZSB3aG9sZSBkZWNrIGNoYWluIChoZWFkIHNsaWRlID0gMSkuIFwiblwiOiBqdXN0IHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyLiBcIm5vbmVcIjogaGlkZGVuLicsXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duKSA9PlxuICAgICAgICBkcm9wZG93blxuICAgICAgICAgIC5hZGRPcHRpb25zKHtcbiAgICAgICAgICAgIGZyYWN0aW9uOiBcIk4gLyBUb3RhbFwiLFxuICAgICAgICAgICAgY3VycmVudDogXCJOXCIsXG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MucGFnZU51bWJlclN0eWxlID0gdmFsdWUgYXMgXCJmcmFjdGlvblwiIHwgXCJjdXJyZW50XCIgfCBcIm5vbmVcIjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHByb2dyZXNzIGJhclwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGlzY3JldGUgY2xpY2thYmxlIHNlZ21lbnRzIGF0IHRoZSB0b3Agb2YgdGhlIHNsaWRlcyBiYXIgLS0gb25lIHBlciBzbGlkZSwgY2xpY2sgdG8ganVtcFwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1Byb2dyZXNzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJBdXRvLWVudGVyIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcIlByZXNzIGVzY2FwZSB0byBsZWF2ZSBzbGlkZXMgbW9kZSBhbmQgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyB2aWV3XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNsaWRlcyB0aXRsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRnJvbnRtYXR0ZXIgcHJvcGVydHkgdG8gc2hvdyBhcyB0aGUgY2FyZCB0aXRsZSAoSDEpLiBMZWF2ZSBlbXB0eSBmb3Igbm9uZTsgdHlwZSBgZmlsZW5hbWVgIHRvIHVzZSB0aGUgZmlsZSBuYW1lLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFRpdGxlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RpdGxlID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQmFyIHByb3BlcnRpZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkNvbW1hLXNlcGFyYXRlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBuYW1lcyB0byBzaG93IGluIHRoZSBzbGlkZXMgYmFyIChlLmcuIGB1bml2ZXJzaXR5LCBzaG9ydC10aXRsZSwgZGF0ZWApLiBFYWNoIHZhbHVlIGZpbGxzIGFuIGVxdWFsLXdpZHRoIGNvbHVtbjsgZHJhZyBkaXZpZGVycyB0byByZXNpemUuIExlYXZlIGVtcHR5IHRvIHNob3cgbm90aGluZy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRS5nLiBVbml2ZXJzaXR5LCBkYXRlXCIpXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmJhclByb3BlcnRpZXMpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcyA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNvbmZpcm0gc2xpZGUgZGVsZXRpb25cIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgc2xpZGVzIHBhbmVsJ3MgcmlnaHQtY2xpY2sgbWVudS4gRGVsZXRpb24gbW92ZXMgc2xpZGVzIHRvIHRoZSB0cmFzaC5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk5hdmlnYXRpb24gaG90a2V5c1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PlxuICAgICAgICBidXR0b24uc2V0QnV0dG9uVGV4dChcIk9wZW4gaG90a2V5cyBzZXR0aW5nc1wiKS5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG4gIH1cbn1cbiIsICIvKiogUmVtb3ZlIGFsbCBjaGlsZHJlbiBvZiBhbiBlbGVtZW50ICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDaGlsZHJlbihlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpO1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBMEJBLElBQUFBLG1CQUE0Qzs7O0FDekJyQyxTQUFTLFlBQXlCO0FBQ3ZDLFFBQU0sTUFBTSxVQUFVLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQztBQUNsRCxNQUFJLGFBQWEsRUFBRSxTQUFTLE9BQU8sQ0FBQztBQUNwQyxNQUFJLFFBQVE7QUFJWixNQUFJLGlCQUFpQixhQUFhLENBQUMsTUFBTTtBQUN2QyxNQUFFLGVBQWU7QUFDakIsVUFBTSxTQUFTLFNBQVM7QUFDeEIsUUFBSSxrQkFBa0IsZUFBZSxXQUFXLFNBQVMsS0FBTSxRQUFPLEtBQUs7QUFBQSxFQUM3RSxDQUFDO0FBQ0QsU0FBTztBQUNUO0FBR08sU0FBUyxVQUNkLE9BQ0EsS0FDQSxTQUNBLFdB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QUNyQixZQUFNLE9BQU8sV0FBVztBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLE1BQU0sWUFBTyxPQUFPLEtBQUssSUFBSTtBQUFBLFFBQzdCLE1BQU0sRUFBRSxPQUFPLDREQUF1RDtBQUFBLE1BQ3hFLENBQUM7QUFDRCxXQUFLLElBQUksWUFBWSxJQUFJO0FBQUEsSUFDM0I7QUFHQSxRQUFJLEtBQUssU0FBUyxvQkFBb0IsVUFBVSxNQUFNO0FBR3BELFlBQU0sUUFBUSxLQUFLLE1BQU07QUFDekIsWUFBTSxPQUFPLFdBQVc7QUFBQSxRQUN0QixLQUFLO0FBQUEsUUFDTCxNQUNFLEtBQUssU0FBUyxvQkFBb0IsYUFDOUIsR0FBRyxLQUFLLFFBQVEsQ0FBQyxNQUFNLEtBQUssS0FDNUIsR0FBRyxLQUFLLFFBQVEsQ0FBQztBQUFBLE1BQ3pCLENBQUM7QUFDRCxXQUFLLElBQUksWUFBWSxJQUFJO0FBQUEsSUFDM0I7QUFHQSxRQUFJLEtBQUssU0FBUyxnQkFBZ0IsUUFBUSxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQy9ELFlBQU0sV0FBVyxVQUFVLEVBQUUsS0FBSyx5QkFBeUIsQ0FBQztBQUM1RCxlQUFTLElBQUksR0FBRyxJQUFJLEtBQUssTUFBTSxRQUFRLEtBQUs7QUFDMUMsY0FBTSxRQUFRLElBQUksS0FBSyxRQUFRLFNBQVMsTUFBTSxLQUFLLFFBQVEsWUFBWTtBQUN2RSxjQUFNLE1BQU0sVUFBVTtBQUFBLFVBQ3BCLEtBQUssMERBQTBELEtBQUs7QUFBQSxRQUN0RSxDQUFDO0FBQ0QsWUFBSSxpQkFBaUIsU0FBUyxNQUFNLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQztBQUN2RCxpQkFBUyxZQUFZLEdBQUc7QUFBQSxNQUMxQjtBQUNBLFdBQUssSUFBSSxZQUFZLFFBQVE7QUFBQSxJQUMvQjtBQUlBLFNBQUssSUFBSSxhQUFhLEVBQUUsU0FBUyxLQUFLLElBQUksc0JBQXNCLElBQUksU0FBUyxHQUFHLENBQUM7QUFBQSxFQUNuRjtBQUNGO0FBR0EsU0FBUyxhQUFhLE9BQWdCLE9BQWtDO0FBQ3RFLFNBQ0UsTUFBTSxRQUFRLEtBQUssS0FBSyxNQUFNLFdBQVcsU0FBUyxNQUFNLE1BQU0sQ0FBQyxNQUFNLE9BQU8sTUFBTSxRQUFRO0FBRTlGOyIsCiAgIm5hbWVzIjogWyJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgIm5ld05hbWUiLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iXQp9Cg==
