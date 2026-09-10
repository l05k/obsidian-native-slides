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
    const deck = file ? this.plugin.resolveDeck(file) : null;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jYXBhY2l0eS50cyIsICJzcmMvY2FwYWNpdHktY29yZS50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVjay1zZXJ2aWNlLnRzIiwgInNyYy9kZWNrLnRzIiwgInNyYy9jcmVhdGVOZXh0LnRzIiwgInNyYy9kZWxldGVTbGlkZXMudHMiLCAic3JjL25hdi50cyIsICJzcmMvcGFuZWwudHMiLCAic3JjL2NvbmZpcm0tZGVsZXRlLnRzIiwgInNyYy9zZXR0aW5ncy50cyIsICJzcmMvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogbmF0aXZlLXNsaWRlcyBcdTIwMTQgYSBcIlNsaWRlcyBtb2RlXCIgZm9yIE9ic2lkaWFuIGRlY2sgbm90ZXNcbiAqXG4gKiBPbmUgcmVzZXJ2ZWQgZnJvbnRtYXR0ZXIga2V5LCBgZGVja2AgKGEgc2luZ2xlIG1hcmtkb3duIGxpbmsgdG8gdGhlIG5leHRcbiAqIHNsaWRlIFx1MjAxNCBuZXh0LW9ubHkgc2VtYW50aWNzLCBubyBvdmVydmlldyBwYWdlIHNpbmNlIHYxLjAuMCksIGRyaXZlc1xuICogcHJldi9uZXh0IG5hdmlnYXRpb24gYW5kIGF1dG8tY29tcHV0ZWQgcGFnZSBudW1iZXJzLiBBIGRlY2sgbm90ZSBjYW4gYmVcbiAqIGVudGVyZWQgaW50byAqKlNsaWRlcyBtb2RlKiogXHUyMDE0IGFuIGltbWVyc2l2ZSwgZWRpdGFibGUgKExpdmUgUHJldmlldykgdmlld1xuICogd2l0aCBhIHNsaWRlcyBiYXIgc2hvd2luZyBwcm9wZXJ0aWVzLCBuYXZpZ2F0aW9uIGFuZCB0aGUgcGFnZSBudW1iZXIuXG4gKlxuICogTmF0aXZlIE9ic2lkaWFuIG1vZGVzIChTb3VyY2UgLyBkZWZhdWx0IExpdmUgUHJldmlldyAvIFJlYWRpbmcgdmlldykgYXJlXG4gKiBsZWZ0IGNvbXBsZXRlbHkgdW50b3VjaGVkOiBubyBzdGF0dXMtYmFyIGhpZGluZywgbm8gc2xpZGVzIGJhciwgbm9cbiAqIGZ1bGxzY3JlZW4sIG5vIHN0eWxpbmcuIFNsaWRlcyBtb2RlIGlzIHRoZSBwbHVnaW4ncyBvbmx5IHN1cmZhY2UuXG4gKlxuICogVGhpcyBmaWxlIGlzIHRoZSBlbnRyeSBwb2ludCBhbmQgYSB0aGluIG9yY2hlc3RyYXRpb24gbGF5ZXI7IHRoZSBsb2dpY1xuICogbGl2ZXMgaW4gYHNyYy9gOlxuICogICAtIHNyYy90eXBlcy50cyAgICAgICAgc2V0dGluZ3Mgc2hhcGUgKyBkZWZhdWx0cyArIHJlc2VydmVkIGBkZWNrYCBrZXlcbiAqICAgLSBzcmMvbW9kZS50cyAgICAgICAgIHZpZXcgbW9kZSAvIGZyb250bWF0dGVyIGhlbHBlcnMgKHB1cmUsIGBBcHBgLWJhc2VkKVxuICogICAtIHNyYy9kZWNrLXNlcnZpY2UudHMgZGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWVcbiAqICAgLSBzcmMvYmFyLnRzICAgICAgICAgIGJhciBET00gaGVscGVycyAoY3JlYXRlIC8gYnV0dG9ucyAvIHRhYi1iYXIgbWVhc3VyZSlcbiAqICAgLSBzcmMvcGFuZWwudHMgICAgICAgIHNsaWRlcyBzaWRlYmFyIHBhbmVsIChkZWNrIHNsaWRlIGxpc3QpXG4gKiAgIC0gc3JjL2NvbW1hbmRzLnRzICAgICBjb21tYW5kIHJlZ2lzdHJhdGlvbiAoZGV2LWdhdGVkIGRlYnVnIGNvbW1hbmQpXG4gKiAgIC0gc3JjL3NldHRpbmdzLnRzICAgICBzZXR0aW5ncyB0YWJcbiAqICAgLSBzcmMvZGVidWcudHMgICAgICAgIHR5cG9ncmFwaHkgbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KVxuICogICAtIHNyYy9kZWNrLnRzICAgICAgICAgcHVyZSBkZWNrIGNvcmUgKHdpdGggc3JjL2NyZWF0ZU5leHQudHMpXG4gKiAgIC0gc3JjL25hdi50cyAgICAgICAgICBwdXJlIG5hdmlnYXRpb24gY29yZSAocXVldWUgKyBzZXNzaW9uIGNoYWluKVxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlLCBkZWNrRnJvbUhlYWQsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9zcmMvZGVja1wiO1xuaW1wb3J0IHsgTmF2U2Vzc2lvbiwgc2Vzc2lvbkRlY2sgfSBmcm9tIFwiLi9zcmMvbmF2XCI7XG5pbXBvcnQgeyBhY3RpdmVGcm9udG1hdHRlciwgY3VycmVudE1vZGUsIGZyb250bWF0dGVyT2YsIGlzTGl2ZVByZXZpZXcgfSBmcm9tIFwiLi9zcmMvbW9kZVwiO1xuaW1wb3J0IHsgU2xpZGVzUGFuZWxWaWV3LCBTTElERVNfUEFORUxfVklFVyB9IGZyb20gXCIuL3NyYy9wYW5lbFwiO1xuaW1wb3J0IHsgTmF0aXZlU2xpZGVzU2V0dGluZ1RhYiB9IGZyb20gXCIuL3NyYy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgREVDS19LRVksIERFRkFVTFRfU0VUVElOR1MsIFNMSURFU19USEVNRVMsIHR5cGUgTmF0aXZlU2xpZGVzU2V0dGluZ3MgfSBmcm9tIFwiLi9zcmMvdHlwZXNcIjtcbmltcG9ydCB7IGNsZWFyQ2hpbGRyZW4gfSBmcm9tIFwiLi9zcmMvdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmF0aXZlU2xpZGVzUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgLyoqIFRoZSBzbGlkZXMgYmFyIERPTSBlbGVtZW50ICovXG4gIGJhcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgLyoqIERlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiY3JlYXRlIG5leHQgc2xpZGVcIiBnbHVlICovXG4gIGRlY2tTZXJ2aWNlITogRGVja1NlcnZpY2U7XG4gIC8qKiBQbHVnaW4gc2V0dGluZ3MgKi9cbiAgc2V0dGluZ3M6IE5hdGl2ZVNsaWRlc1NldHRpbmdzID0geyAuLi5ERUZBVUxUX1NFVFRJTkdTIH07XG5cbiAgLyoqIFdoZXRoZXIgU2xpZGVzIG1vZGUgaXMgY3VycmVudGx5IGFjdGl2ZSAoc2Vzc2lvbiBzdGF0ZSwgbm90IHBlcnNpc3RlZCkgKi9cbiAgcHJpdmF0ZSBzbGlkZXNNb2RlID0gZmFsc2U7XG4gIC8qKiBWaWV3IG1vZGUgdG8gcmVzdG9yZSB3aGVuIGxlYXZpbmcgU2xpZGVzIG1vZGUgKFwicHJldmlld1wiIHwgXCJzb3VyY2VcIikgKi9cbiAgcHJpdmF0ZSBleGl0TW9kZTogXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiID0gXCJzb3VyY2VcIjtcbiAgLyoqIFdoZXRoZXIgdGhlIGV4aXQgdmlldyB3YXMgU291cmNlIG1vZGUgKHRydWUpIHZzIExpdmUgUHJldmlldyAoZmFsc2UpICovXG4gIHByaXZhdGUgZXhpdFNvdXJjZSA9IGZhbHNlO1xuICAvKiogTGFzdCBub3RlIGF1dG8tZW50ZXJlZCBpbnRvIFNsaWRlcyBtb2RlIChwcmV2ZW50cyByZS1lbnRlcmluZyBhZnRlciBtYW51YWwgZXhpdCkgKi9cbiAgcHJpdmF0ZSBhdXRvRW50ZXJlZFBhdGggPSBcIlwiO1xuICAvKiogTGFzdCByZWZyZXNoIGtleSAoXCJwYXRofG1vZGVcIikgdG8gYXZvaWQgcG9pbnRsZXNzIHJlLXJlbmRlcnMgKi9cbiAgcHJpdmF0ZSBsYXN0S2V5ID0gXCJcIjtcbiAgLyoqIExhc3QgbWVhc3VyZWQgdGFiLWJhciBoZWlnaHQgKHB4KSBcdTIwMTQgY2FjaGVkIHdoaWxlIHRoZSBzbGlkZXMgYmFyIGlzIGhpZGRlbiAqL1xuICBwcml2YXRlIHRhYkJhckhlaWdodCA9IDA7XG4gIC8qKiBRdWV1ZSBiZWhpbmQgcHJldiAvIG5leHQgLyBqdW1wIFx1MjAxNCBzZWUgc3JjL25hdi50cyAoaXNzdWUgIzExMCkgKi9cbiAgcHJpdmF0ZSBuYXYhOiBOYXZTZXNzaW9uO1xuICAvKiogV2hldGhlciB0aGUgbW91c2UgcG9pbnRlciBpcyBoaWRkZW4gZm9yIHByZXNlbnRpbmcgKHNlc3Npb24gc3RhdGUpICovXG4gIHBvaW50ZXJIaWRkZW4gPSBmYWxzZTtcblxuICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICB0aGlzLmRlY2tTZXJ2aWNlID0gbmV3IERlY2tTZXJ2aWNlKHRoaXMuYXBwKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOYXZTZXNzaW9uKHtcbiAgICAgIHJlc29sdmU6IChwYXRoLCBoZWFkKSA9PiB0aGlzLmRlY2tXaXRoSGVhZChwYXRoLCBoZWFkKSxcbiAgICAgIG9wZW46IGFzeW5jICh0YXJnZXQsIGZyb20pID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnNsaWRlc01vZGUpIGF3YWl0IHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZyb20pO1xuICAgICAgfSxcbiAgICAgIGFjdGl2ZVBhdGg6ICgpID0+IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbCxcbiAgICB9KTtcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IE5hdGl2ZVNsaWRlc1NldHRpbmdUYWIodGhpcykpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDEuIFJlZnJlc2ggb24gXCJjdXJyZW50IG5vdGUgLyB2aWV3IGNoYW5nZWRcIiBldmVudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5tYXliZUF1dG9FbnRlclNsaWRlcygpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG4gICAgLy8gUmVmcmVzaCB3aGVuIHRoZSBub3RlIGNvbnRlbnQgKGluY2x1ZGluZyBmcm9udG1hdHRlcikgY2hhbmdlcyAvIHNhdmVzXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5vbihcImNoYW5nZWRcIiwgKGZpbGU6IFRGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlID09PSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMi4gRmFsbGJhY2sgdGltZXI6IGVkaXRcdTIxOTRyZWFkaW5nIHRvZ2dsZXMgbWF5IGZpcmUgbm8gc3RhbmRhcmQgZXZlbnQgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckludGVydmFsKFxuICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGZpbGUgPyBgJHtmaWxlLnBhdGh9fCR7Y3VycmVudE1vZGUodGhpcy5hcHApfWAgOiBcIlwiO1xuICAgICAgICBpZiAoa2V5ICE9PSB0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwMCksXG4gICAgKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzLiBDb21tYW5kcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICByZWdpc3RlckNvbW1hbmRzKHRoaXMpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDNiLiBTbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBvdmVydmlldywgcmVwbGFjZXMgdGhlIG9sZCBvdmVydmlldyBwYWdlKSBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyVmlldyhTTElERVNfUEFORUxfVklFVywgKGxlYWYpID0+IG5ldyBTbGlkZXNQYW5lbFZpZXcodGhpcywgbGVhZikpO1xuICAgIHRoaXMuYWRkUmliYm9uSWNvbihcInByZXNlbnRhdGlvblwiLCBcIlNob3cgc2xpZGVzIHBhbmVsXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5hY3RpdmF0ZVNsaWRlc1BhbmVsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNC4gUGluIHRoZSBTbGlkZXMgZWRpdG9yIHRvIG9uZSBzY3JlZW4gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy8gQ1NTIGBvdmVyZmxvdzogaGlkZGVuYCBibG9ja3MgdGhlIHdoZWVsLCBidXQgbmF0aXZlIGRyYWctc2VsZWN0XG4gICAgLy8gYXV0b3Njcm9sbCBhbmQgQ29kZU1pcnJvcidzIHByb2dyYW1tYXRpYyBzY3JvbGxJbnRvVmlldyBzdGlsbCBtb3ZlIHRoZVxuICAgIC8vIHNjcm9sbGVyLiBUaGlzIGNhcHR1cmUtcGhhc2UgbGlzdGVuZXIgcmVzZXRzIGFueSBzY3JvbGwgaW5zaWRlIHRoZVxuICAgIC8vIGFjdGl2ZSBtYXJrZG93biB2aWV3IGJhY2sgdG8gdGhlIHRvcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhY3RpdmUuXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KFxuICAgICAgZG9jdW1lbnQsXG4gICAgICBcInNjcm9sbFwiLFxuICAgICAgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcbiAgICAgICAgY29uc3QgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB2aWV3LmNvbnRlbnRFbC5jb250YWlucyhlbCkpIHtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIGlmIChlbC5zY3JvbGxMZWZ0ICE9PSAwKSBlbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHsgY2FwdHVyZTogdHJ1ZSB9LFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNS4gRXNjYXBlIGtleSBleGl0cyBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQoZG9jdW1lbnQsIFwia2V5ZG93blwiLCAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gXCJFc2NhcGVcIiAmJiB0aGlzLnNsaWRlc01vZGUgJiYgdGhpcy5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcykge1xuICAgICAgICB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCA2LiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgYW5kIGRvIHRoZSBmaXJzdCByZW5kZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5iYXIgPSBjcmVhdGVCYXIoKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFyKTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG9udW5sb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuYmFyPy5yZW1vdmUoKTtcbiAgICB0aGlzLmJhciA9IG51bGw7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5cIik7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIik7XG4gICAgdGhpcy5yZW1vdmVUaGVtZUNsYXNzZXMoKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTZXR0aW5ncyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGF0YSA9IChhd2FpdCB0aGlzLmxvYWREYXRhKCkpIGFzIFBhcnRpYWw8TmF0aXZlU2xpZGVzU2V0dGluZ3M+IHwgbnVsbDtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgZGF0YSA/PyB7fSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTbGlkZXMgbW9kZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG5vdGUgaXMgYSBkZWNrIG5vdGUgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSkgKi9cbiAgcHJpdmF0ZSBpc0RlY2tOb3RlKGZpbGU6IFRGaWxlIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBldmVyeSBgbmF0aXZlLXNsaWRlcy10aGVtZS0qYCBjbGFzcyBmcm9tIDxib2R5PiAqL1xuICBwcml2YXRlIHJlbW92ZVRoZW1lQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGNscyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGNscy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShjbHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBzaW5nbGUgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmAgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBzbGlkZXNUaGVtZWAgc2V0dGluZyBcdTIwMTQgdGhlIHN0eWxlIHRlbXBsYXRlcyBpbiBzdHlsZXMuY3NzIGhvb2sgb2ZmIGl0LlxuICAgKiBVbmtub3duIGlkcyAoZS5nLiBhZnRlciBhIGRvd25ncmFkZSkgZmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IHRoZW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBhcHBseVRoZW1lQ2xhc3MoKTogdm9pZCB7XG4gICAgY29uc3QgaWQgPSBTTElERVNfVEhFTUVTLnNvbWUoKHQpID0+IHQuaWQgPT09IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWUpXG4gICAgICA/IHRoaXMuc2V0dGluZ3Muc2xpZGVzVGhlbWVcbiAgICAgIDogREVGQVVMVF9TRVRUSU5HUy5zbGlkZXNUaGVtZTtcbiAgICBjb25zdCBjbHMgPSBgbmF0aXZlLXNsaWRlcy10aGVtZS0ke2lkfWA7XG4gICAgZm9yIChjb25zdCBjIG9mIEFycmF5LmZyb20oZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QpKSB7XG4gICAgICBpZiAoYy5zdGFydHNXaXRoKFwibmF0aXZlLXNsaWRlcy10aGVtZS1cIikgJiYgYyAhPT0gY2xzKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgfVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBoaWRpbmcgdGhlIG1vdXNlIHBvaW50ZXIgd2luZG93LXdpZGUgZm9yIHByZXNlbnRpbmcuIEhpZGluZyBhbHNvXG4gICAqIHBhcmtzIGZvY3VzIChibHVycyB0aGUgZWRpdG9yLCBzbyB0aGUgY2FyZXQgZGlzYXBwZWFycyk7IHNob3dpbmcgbGVhdmVzXG4gICAqIGZvY3VzIHBhcmtlZCBcdTIwMTQgY2xpY2sgc2xpZGUgY29udGVudCB0byByZXN1bWUgZWRpdGluZy5cbiAgICovXG4gIHRvZ2dsZVBvaW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5wb2ludGVySGlkZGVuID0gIXRoaXMucG9pbnRlckhpZGRlbjtcbiAgICBpZiAodGhpcy5wb2ludGVySGlkZGVuKSB7XG4gICAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgYG5hdGl2ZS1zbGlkZXMtcG9pbnRlci1oaWRkZW5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBwcmVzZW50aW5nIHN0YXRlIFx1MjAxNCBzdHlsZXMuY3NzIHR1cm5zIGV2ZXJ5IGN1cnNvciBpbnZpc2libGUgd2hpbGUgc2V0LlxuICAgKiBMZWF2aW5nIFNsaWRlcyBtb2RlIGFsd2F5cyByZXN0b3JlcyB0aGUgcG9pbnRlci5cbiAgICovXG4gIHByaXZhdGUgc3luY1BvaW50ZXJDbGFzcyhzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIsIHNsaWRlcyAmJiB0aGlzLnBvaW50ZXJIaWRkZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc2AgYm9keSBjbGFzcyBpbiBzeW5jIHdpdGggdGhlXG4gICAqIGBpbWFnZUxheW91dGAgc2V0dGluZyBcdTIwMTQgc3R5bGVzLmNzcydzIGltYWdlLWxheW91dCBydWxlcyBob29rIG9mZiBpdC5cbiAgICogVGhlIGNsYXNzIGlzIG9ubHkgbWVhbmluZ2Z1bCBpbiBTbGlkZXMgbW9kZS5cbiAgICovXG4gIHByaXZhdGUgc3luY0ltYWdlTGF5b3V0Q2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFxuICAgICAgXCJuYXRpdmUtc2xpZGVzLWJsb2NrLWltYWdlc1wiLFxuICAgICAgc2xpZGVzICYmIHRoaXMuc2V0dGluZ3MuaW1hZ2VMYXlvdXQsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNhcmQgdGl0bGUgcGVyIHRoZSBgc2xpZGVzVGl0bGVgIHNldHRpbmcuIFwiZmlsZW5hbWVcIiByZXN0eWxlc1xuICAgKiB0aGUgbmF0aXZlIGlubGluZSB0aXRsZSBpbnRvIHRoZSBjYXJkIHRpdGxlIChzdGlsbCBlZGl0YWJsZSBcdTIwMTQgdHlwaW5nXG4gICAqIHJlbmFtZXMgdGhlIG5vdGUpOyBcIlwiIHNob3dzIG5vdGhpbmc7IGFueSBvdGhlciB2YWx1ZSBuYW1lcyBhIGZyb250bWF0dGVyXG4gICAqIHByb3BlcnR5IHJlbmRlcmVkIHJlYWQtb25seSB2aWEgdGhlIDo6YmVmb3JlIHBzZXVkby1lbGVtZW50LlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJbmxpbmVUaXRsZShzbGlkZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBjb250ZW50ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFmaWxlKSByZXR1cm47XG5cbiAgICBjb25zdCBzcmMgPSB0aGlzLnNldHRpbmdzLnNsaWRlc1RpdGxlLnRyaW0oKTtcblxuICAgIC8vIFwiZmlsZW5hbWVcIjogcmVzdHlsZSB0aGUgbmF0aXZlIC5pbmxpbmUtdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZS4gSXRcbiAgICAvLyBzdGF5cyBjb250ZW50ZWRpdGFibGUsIHNvIGVkaXRpbmcgaXQgcmVuYW1lcyB0aGUgbm90ZSBhcyBpbiBMaXZlXG4gICAgLy8gUHJldmlldy4gVGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgbGl2ZXMgb24gdGhlIG1hcmtkb3duLXNvdXJjZS12aWV3XG4gICAgLy8gZWxlbWVudCAoYSBzaWJsaW5nIGJyYW5jaCBvZiB0aGUgY2FyZCksIHNvIHRoZSBzdHlsaW5nIGhvb2sgaXMgYVxuICAgIC8vIHZpZXcgYXR0cmlidXRlICsgYSBicmFuZC1uZXcgLmNtLWNvbnRlbnQgYXR0cmlidXRlIHRoYXQgcmVzZXJ2ZXMgdGhlXG4gICAgLy8gdGl0bGUncyBoZWlnaHQgdGhlIHNhbWUgd2F5IHRoZSBwc2V1ZG8tZWxlbWVudCB2ZXJzaW9uIGRpZC5cbiAgICBjb25zdCBuYXRpdmVUaXRsZSA9IHNsaWRlcyAmJiBzcmMgPT09IFwiZmlsZW5hbWVcIjtcbiAgICBjb25zdCBzb3VyY2VWaWV3ID0gdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXNvdXJjZS12aWV3XCIpO1xuICAgIGlmIChuYXRpdmVUaXRsZSAmJiBzb3VyY2VWaWV3KSBzb3VyY2VWaWV3LnNldEF0dHJpYnV0ZShcImRhdGEtbnMtaW5saW5lLXRpdGxlXCIsIFwiZmlsZW5hbWVcIik7XG4gICAgZWxzZSBzb3VyY2VWaWV3Py5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiKTtcbiAgICBjb250ZW50LnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlLW5hdGl2ZVwiLCBuYXRpdmVUaXRsZSk7XG5cbiAgICAvLyBQcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIHJlbmRlciByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudFxuICAgIC8vIChubyBlZGl0aW5nIHN1cmZhY2UgXHUyMDE0IHRoZSBwcm9wZXJ0aWVzIHBhbmVsIGlzIGhpZGRlbiBpbiBTbGlkZXMgbW9kZSkuXG4gICAgbGV0IHRleHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGlmIChzbGlkZXMgJiYgc3JjICYmIHNyYyAhPT0gXCJmaWxlbmFtZVwiKSB7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgICAgY29uc3QgdiA9IGZtPy5bc3JjXTtcbiAgICAgIGlmICh2ICE9IG51bGwpIHRleHQgPSBmb3JtYXRWYWx1ZSh2KTtcbiAgICB9XG5cbiAgICBpZiAodGV4dCkgY29udGVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiLCB0ZXh0KTtcbiAgICBlbHNlIGNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIik7XG4gIH1cblxuICAvKiogRW50ZXIgU2xpZGVzIG1vZGU6IHJlY29yZCB0aGUgZXhpdCBzdGF0ZSBhbmQgZm9yY2UgdGhlIExpdmUgUHJldmlldyAqL1xuICBwcml2YXRlIGFzeW5jIGVudGVyU2xpZGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IG1vZGU/OiBzdHJpbmc7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgICAgIHRoaXMuZXhpdE1vZGUgPSBzdGF0ZS5tb2RlID09PSBcInByZXZpZXdcIiA/IFwicHJldmlld1wiIDogXCJzb3VyY2VcIjtcbiAgICAgIHRoaXMuZXhpdFNvdXJjZSA9IHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZTtcbiAgICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFsd2F5cyB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgICBjb25zdCBuZXh0ID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgbmV4dC5zdGF0ZSA9IHsgLi4ubmV4dC5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiBmYWxzZSB9O1xuICAgICAgYXdhaXQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShuZXh0LCB7IGZvY3VzOiBmYWxzZSB9KTtcbiAgICB9XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gdHJ1ZTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAvLyBQaW4gdGhlIHNjcm9sbGVyIHRvIHRoZSB0b3AgYmVmb3JlIGFueSBmcmFtZSByZW5kZXJzOiB0aGUgdmlldy1zdGF0ZVxuICAgIC8vIGNoYW5nZSBhYm92ZSBtYXkgcmVzdG9yZSBpdCB0byB0aGUgc2F2ZWQgY3Vyc29yIGxpbmUgd2l0aG91dCBmaXJpbmcgYVxuICAgIC8vIHNjcm9sbCBldmVudCBhZnRlcndhcmRzLCBzbyB0aGUgY2FwdHVyZS1waGFzZSByZXNldCBiZWxvdyB3b3VsZCBuZXZlclxuICAgIC8vIHJ1biBhbmQgYSBsb25nIG5vdGUgd291bGQgb3BlbiBtaWQtZG9jdW1lbnQuXG4gICAgZm9yIChjb25zdCBlbCBvZiB2aWV3Py5jb250ZW50RWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCIuY20tc2Nyb2xsZXJcIikgPz8gW10pIHtcbiAgICAgIGlmIChlbC5zY3JvbGxUb3AgIT09IDApIGVsLnNjcm9sbFRvcCA9IDA7XG4gICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqIEV4aXQgU2xpZGVzIG1vZGU6IHJlc3RvcmUgdGhlIHZpZXcgbW9kZSByZWNvcmRlZCBhdCBlbnRyeSAqL1xuICBwcml2YXRlIGV4aXRTbGlkZXMoKTogdm9pZCB7XG4gICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gdmlldy5sZWFmLmdldFZpZXdTdGF0ZSgpO1xuICAgICAgaWYgKHRoaXMuZXhpdE1vZGUgPT09IFwicHJldmlld1wiKSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJwcmV2aWV3XCIgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnN0YXRlID0geyAuLi5zdGF0ZS5zdGF0ZSwgbW9kZTogXCJzb3VyY2VcIiwgc291cmNlOiB0aGlzLmV4aXRTb3VyY2UgfTtcbiAgICAgIH1cbiAgICAgIHZvaWQgdmlldy5sZWFmLnNldFZpZXdTdGF0ZShzdGF0ZSwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZSBTbGlkZXMgbW9kZSAoZGVjayBub3RlcyBvbmx5IFx1MjAxNCBlbmZvcmNlZCBieSB0aGUgY29tbWFuZCkgKi9cbiAgdG9nZ2xlU2xpZGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNsaWRlc01vZGUpIHRoaXMuZXhpdFNsaWRlcygpO1xuICAgIGVsc2Ugdm9pZCB0aGlzLmVudGVyU2xpZGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQXV0by1lbnRlciBTbGlkZXMgbW9kZSBmb3IgdGhlIGFjdGl2ZSBub3RlIG9uY2UgaXQgaGFzIGJlY29tZSBhIGRlY2tcbiAgICogbm90ZSBcdTIwMTQgdXNlZCBhZnRlciBhIGNvbW1hbmQgcHJvbW90ZXMgYSBwbGFpbiBub3RlIGludG8gYSBkZWNrIChlLmcuXG4gICAqIFwiTWFrZSB0aGlzIG5vdGUgdGhlIGZpcnN0IHNsaWRlXCIpLiBOby1vcCB3aGlsZSBTbGlkZXMgbW9kZSBpcyBhbHJlYWR5XG4gICAqIGFjdGl2ZSBvciB0aGUgYWN0aXZlIG5vdGUgaXMgbm90ICh5ZXQpIGEgZGVjayBub3RlLlxuICAgKi9cbiAgYXN5bmMgZW50ZXJTbGlkZXNGb3JBY3RpdmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCAhdGhpcy5pc0RlY2tOb3RlKGZpbGUpKSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqIFJldmVhbCB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwsIGNyZWF0aW5nIGl0IGluIHRoZSByaWdodCBzaWRlYmFyIGlmIG5lZWRlZCAqL1xuICBhc3luYyBhY3RpdmF0ZVNsaWRlc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTTElERVNfUEFORUxfVklFVyk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nWzBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikgcmV0dXJuO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogU0xJREVTX1BBTkVMX1ZJRVcsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYSBub3RlJ3MgZGVjaywgcHJlZmVycmluZyB0aGUgY2hhaW4gaGVhZCB0aGUgY3VycmVudCBuYXZpZ2F0aW9uXG4gICAqIHNlc3Npb24gZW50ZXJlZCAod2Fsa2VkIGxpdmUsIHNvIGVkaXRzIHRvIHRoZSBkZWNrIGFyZSBob25vdXJlZCkuIFRoZSBiYXIgYW5kXG4gICAqIHRoZSBzbGlkZXMgcGFuZWwgcmVhZCB0aGlzIHRvbywgc28gdGhlIHBhZ2UgbnVtYmVyIGFsd2F5cyBkZXNjcmliZXMgdGhlIGNoYWluXG4gICAqIG5hdmlnYXRpb24gaXMgYWN0dWFsbHkgdXNpbmcuXG4gICAqL1xuICByZXNvbHZlRGVjayhmaWxlOiBURmlsZSk6IERlY2tJbmZvIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGVja1dpdGhIZWFkKGZpbGUucGF0aCwgdGhpcy5uYXYucmVtZW1iZXJlZEhlYWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY2sgZm9yIGBwYXRoYCwgd2Fsa2VkIGxpdmUgZnJvbSBgaGVhZGAgd2hpbGUgdGhhdCBoZWFkIHN0aWxsIHJlYWNoZXMgaXQgYW5kXG4gICAqIHJlc29sdmVkIGFmcmVzaCAoYXJiaXRyYXJ5IGhlYWQpIG90aGVyd2lzZS5cbiAgICovXG4gIHByaXZhdGUgZGVja1dpdGhIZWFkKHBhdGg6IHN0cmluZywgaGVhZDogc3RyaW5nIHwgbnVsbCk6IERlY2tJbmZvIHwgbnVsbCB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gc2Vzc2lvbkRlY2soXG4gICAgICBoZWFkLFxuICAgICAgcGF0aCxcbiAgICAgIChoLCBwKSA9PiB7XG4gICAgICAgIGNvbnN0IGhlYWRGaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGgpO1xuICAgICAgICBpZiAoIShoZWFkRmlsZSBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBkZWNrRnJvbUhlYWQoaCwgcCwgKHEpID0+IHRoaXMuZGVja1NlcnZpY2UubmV4dExpbmtzKHEpKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBNb3ZlIG9uZSBzdGVwIGJhY2svZm9yd2FyZCBhbG9uZyB0aGUgZGVjayBjaGFpbiAoZW50ZXJpbmcgU2xpZGVzIG1vZGUgYXMgbmVlZGVkKSAqL1xuICBhc3luYyBuYXZpZ2F0ZShkaXJlY3Rpb246IFwicHJldlwiIHwgXCJuZXh0XCIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLm5hdi5wdXNoKHsgZGlyOiBkaXJlY3Rpb24gfSk7XG4gIH1cblxuICAvKiogSnVtcCB0byBhIHNwZWNpZmljIGluZGV4IGluIHRoZSBkZWNrIGNoYWluIChwcm9ncmVzcyBiYXIgY2xpY2spICovXG4gIGFzeW5jIGp1bXBUbyhpbmRleDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5uYXYucHVzaCh7IGluZGV4IH0pO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEJhciByZW5kZXJpbmcgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqXG4gICAqIEdldCBjb2x1bW4gd2lkdGggcGVyY2VudGFnZXMgZm9yIHRoZSBiYXIgcHJvcGVydGllcy4gUmV0dXJucyBhbiBhcnJheSBvZlxuICAgKiBwZXJjZW50YWdlcyAoc3VtbWluZyB0byAxMDApIGZvciBlYWNoIHByb3BlcnR5LiBMb2FkcyBmcm9tIHNldHRpbmdzIG9yXG4gICAqIGRlZmF1bHRzIHRvIGVxdWFsIGRpc3RyaWJ1dGlvbi5cbiAgICovXG4gIHByaXZhdGUgZ2V0QmFyUHJvcGVydHlXaWR0aHMoY291bnQ6IG51bWJlcik6IG51bWJlcltdIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RvcmVkID0gSlNPTi5wYXJzZSh0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzIHx8IFwiW11cIikgYXMgdW5rbm93bjtcbiAgICAgIGlmIChpc051bWJlckxpc3Qoc3RvcmVkLCBjb3VudCkpIHJldHVybiBzdG9yZWQ7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBpZ25vcmVcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBBcnJheTxudW1iZXI+KGNvdW50KS5maWxsKDEwMCAvIGNvdW50KTtcbiAgfVxuXG4gIC8qKiBTYXZlIGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyB0byBzZXR0aW5ncyAqL1xuICBwcml2YXRlIGFzeW5jIHNhdmVCYXJQcm9wZXJ0eVdpZHRocyh3aWR0aHM6IG51bWJlcltdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0eVdpZHRocyA9IEpTT04uc3RyaW5naWZ5KHdpZHRocyk7XG4gICAgYXdhaXQgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgfVxuXG4gIC8qKiBEZWNpZGUgd2hhdCB0aGUgc2xpZGVzIGJhciBzaG93cywgdGhlbiByZS1yZW5kZXIgaXQgKi9cbiAgcmVmcmVzaCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYmFyKSByZXR1cm47XG4gICAgdGhpcy5hcHBseVRoZW1lQ2xhc3MoKTtcblxuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IG1vZGUgPSBjdXJyZW50TW9kZSh0aGlzLmFwcCk7XG4gICAgY29uc3QgaXNDYXJkID0gdGhpcy5pc0RlY2tOb3RlKGZpbGUpO1xuICAgIGNvbnN0IGxpdmVQcmV2aWV3Tm93ID0gbW9kZSA9PT0gXCJzb3VyY2VcIiAmJiBpc0xpdmVQcmV2aWV3KHRoaXMuYXBwKTtcblxuICAgIC8vIExlYXZpbmcgYSBkZWNrIG5vdGUsIG9yIGxlYXZpbmcgdGhlIExpdmUgUHJldmlldyAoZS5nLiBDbWQvQ3RybCtFIHRvXG4gICAgLy8gcmVhZGluZyB2aWV3KSwgZW5kcyBTbGlkZXMgbW9kZSBcdTIwMTQgb25seSB0aGUgdG9nZ2xlIGNvbW1hbmQgcmUtZW50ZXJzIGl0LlxuICAgIGlmICh0aGlzLnNsaWRlc01vZGUgJiYgKCFpc0NhcmQgfHwgIWxpdmVQcmV2aWV3Tm93KSkge1xuICAgICAgdGhpcy5zbGlkZXNNb2RlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gTWVhc3VyZSB0aGUgdGFiIGJhciB3aGlsZSBpdCBpcyBzdGlsbCB2aXNpYmxlIChTbGlkZXMgbW9kZSBoaWRlcyBpdFxuICAgIC8vIGJlbG93OyB0aGUgbGFzdCBtZWFzdXJlZCB2YWx1ZSBpcyByZXVzZWQgb25jZSBoaWRkZW4pLlxuICAgIHRoaXMudGFiQmFySGVpZ2h0ID0gc3luY1RhYkJhckhlaWdodCh0aGlzLnRhYkJhckhlaWdodCk7XG5cbiAgICAvLyBTbGlkZXMgbW9kZSBpcyBhY3RpdmUgb25seSB3aGlsZSBhY3R1YWxseSBpbiB0aGUgZWRpdGFibGUgTGl2ZSBQcmV2aWV3XG4gICAgY29uc3Qgc2xpZGVzID0gdGhpcy5zbGlkZXNNb2RlICYmIGlzQ2FyZCAmJiBsaXZlUHJldmlld05vdztcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIiwgc2xpZGVzKTtcbiAgICBpZiAoIXNsaWRlcykgdGhpcy5wb2ludGVySGlkZGVuID0gZmFsc2U7IC8vIGxlYXZpbmcgU2xpZGVzIHJlc3RvcmVzIHRoZSBwb2ludGVyXG4gICAgdGhpcy5zeW5jUG9pbnRlckNsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy5zeW5jSW1hZ2VMYXlvdXRDbGFzcyhzbGlkZXMpO1xuICAgIHRoaXMudXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzKTtcblxuICAgIGNvbnN0IGJhclZpc2libGUgPSBzbGlkZXMgJiYgdGhpcy5zZXR0aW5ncy5zaG93U2xpZGVzQmFyICYmICF0aGlzLnNldHRpbmdzLmJhckhpZGRlbjtcbiAgICAvLyBXaGVuIGJhciBpcyBoaWRkZW4sIHNldCBib3R0b20gcGFkZGluZyB0byAwIHNvIHRoZSBjYXJkIGZpbGxzIHRoZSBmdWxsXG4gICAgLy8gd2luZG93IGhlaWdodC4gV2hlbiB2aXNpYmxlLCByZW1vdmUgdGhlIG92ZXJyaWRlIHNvIENTUyBmYWxscyBiYWNrIHRvXG4gICAgLy8gLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHQgKGNsZWFycyB0aGUgYmFyIGFzIGJlZm9yZSkuXG4gICAgaWYgKGJhclZpc2libGUpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0Q3NzUHJvcHMoeyBcIi0tbmF0aXZlLXNsaWRlcy1iYXItaGVpZ2h0XCI6IFwiMHB4XCIgfSk7XG4gICAgfVxuICAgIGlmICghYmFyVmlzaWJsZSkge1xuICAgICAgdGhpcy5iYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogXCJub25lXCIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZmlsZSkgcmV0dXJuOyAvLyBiYXJWaXNpYmxlIGltcGxpZXMgYSBmaWxlLCBidXQgbmFycm93IGZvciBUeXBlU2NyaXB0XG5cbiAgICBjb25zdCBmbSA9IGFjdGl2ZUZyb250bWF0dGVyKHRoaXMuYXBwKTtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5yZXNvbHZlRGVjayhmaWxlKTtcbiAgICBjbGVhckNoaWxkcmVuKHRoaXMuYmFyKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBMZWZ0OiBwcmV2aW91cyAvIG5leHQgYnV0dG9ucyAoYm90aCBhbHdheXMgc2hvd24gaW5zaWRlIGEgZGVjaztcbiAgICAvLyAgICAgICAgdGhlIG9uZSB0aGF0IGNhbm5vdCBtb3ZlIGlzIGRpc2FibGVkIC8gbGlnaHQgZ3JheSkgXHUyNTAwXHUyNTAwXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgJiYgZGVjaykge1xuICAgICAgY29uc3QgaGFzUHJldiA9IGRlY2suaW5kZXggPiAwO1xuICAgICAgY29uc3QgaGFzTmV4dCA9IGRlY2suaW5kZXggPCBkZWNrLmNoYWluLmxlbmd0aCAtIDE7XG4gICAgICBjb25zdCBuYXYgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1uYXZcIiB9KTtcbiAgICAgIG5hdi5hcHBlbmRDaGlsZChuYXZCdXR0b24oXCJcdTI1QzBcIiwgXCJQcmV2aW91cyBwYWdlXCIsICgpID0+IHZvaWQgdGhpcy5uYXZpZ2F0ZShcInByZXZcIiksICFoYXNQcmV2KSk7XG4gICAgICBuYXYuYXBwZW5kQ2hpbGQobmF2QnV0dG9uKFwiXHUyNUI2XCIsIFwiTmV4dCBwYWdlXCIsICgpID0+IHZvaWQgdGhpcy5uYXZpZ2F0ZShcIm5leHRcIiksICFoYXNOZXh0KSk7XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChuYXYpO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBNaWRkbGU6IGNvbmZpZ3VyZWQgcHJvcGVydHkgY29sdW1ucyB3aXRoIGRyYWdnYWJsZSBkaXZpZGVycyBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBwcm9wTmFtZXMgPSB0aGlzLnNldHRpbmdzLmJhclByb3BlcnRpZXNcbiAgICAgIC5zcGxpdChcIixcIilcbiAgICAgIC5tYXAoKHMpID0+IHMudHJpbSgpKVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgIGlmIChwcm9wTmFtZXMubGVuZ3RoID4gMCAmJiBmbSkge1xuICAgICAgY29uc3QgZW50cmllczogW3N0cmluZywgc3RyaW5nXVtdID0gW107XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgcHJvcE5hbWVzKSB7XG4gICAgICAgIGlmIChuYW1lIGluIGZtKSB7XG4gICAgICAgICAgY29uc3QgdmFsID0gZm1bbmFtZV07XG4gICAgICAgICAgaWYgKHZhbCAhPSBudWxsKSBlbnRyaWVzLnB1c2goW25hbWUsIGZvcm1hdFZhbHVlKHZhbCldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW50cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1wcm9wZXJ0aWVzXCIgfSk7XG5cbiAgICAgICAgY29uc3Qgd2lkdGhzID0gdGhpcy5nZXRCYXJQcm9wZXJ0eVdpZHRocyhlbnRyaWVzLmxlbmd0aCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgWywgdmFsdWVdID0gZW50cmllc1tpXTtcbiAgICAgICAgICBjb25zdCBpdGVtID0gY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWJhci1wcm9wLWl0ZW1cIiwgdGV4dDogdmFsdWUgfSk7XG4gICAgICAgICAgaXRlbS5zZXRDc3NTdHlsZXMoe1xuICAgICAgICAgICAgZmxleEJhc2lzOiBgY2FsYygke3dpZHRoc1tpXX0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWAsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW0pO1xuXG4gICAgICAgICAgaWYgKGkgPCBlbnRyaWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdmlkZXIgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItZGl2aWRlclwiIH0pO1xuICAgICAgICAgICAgZGl2aWRlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgY29uc3Qgc3RhcnRYID0gZS5jbGllbnRYO1xuICAgICAgICAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGNvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgY29uc3QgaW5pdGlhbFdpZHRocyA9IFsuLi53aWR0aHNdO1xuICAgICAgICAgICAgICBjb25zdCBvbk1vdmUgPSAoZXY6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9ICgoZXYuY2xpZW50WCAtIHN0YXJ0WCkgLyBjb250YWluZXJXaWR0aCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3TGVmdCA9IE1hdGgubWF4KDUsIGluaXRpYWxXaWR0aHNbaV0gKyBkZWx0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UmlnaHQgPSBNYXRoLm1heCg1LCBpbml0aWFsV2lkdGhzW2kgKyAxXSAtIGRlbHRhKTtcbiAgICAgICAgICAgICAgICB3aWR0aHNbaV0gPSBuZXdMZWZ0O1xuICAgICAgICAgICAgICAgIHdpZHRoc1tpICsgMV0gPSBuZXdSaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICAgICAgICAgICAgIFwiLm5hdGl2ZS1zbGlkZXMtYmFyLXByb3AtaXRlbVwiLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uc2V0Q3NzU3R5bGVzKHtcbiAgICAgICAgICAgICAgICAgIGZsZXhCYXNpczogYGNhbGMoJHtuZXdMZWZ0fSUgLSAkeygoZW50cmllcy5sZW5ndGggLSAxKSAqIDQpIC8gZW50cmllcy5sZW5ndGh9cHgpYCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpdGVtc1tpICsgMV0uc2V0Q3NzU3R5bGVzKHtcbiAgICAgICAgICAgICAgICAgIGZsZXhCYXNpczogYGNhbGMoJHtuZXdSaWdodH0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGNvbnN0IG9uVXAgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdmUpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uVXApO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2V0Q3NzU3R5bGVzKHsgY3Vyc29yOiBcIlwiLCB1c2VyU2VsZWN0OiBcIlwiIH0pO1xuICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5zYXZlQmFyUHJvcGVydHlXaWR0aHMod2lkdGhzKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdmUpO1xuICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvblVwKTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRDc3NTdHlsZXMoeyBjdXJzb3I6IFwiY29sLXJlc2l6ZVwiLCB1c2VyU2VsZWN0OiBcIm5vbmVcIiB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdmlkZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQnJva2VuIGRlY2sgbGlua3MgXHUyMTkyIHdhcm5pbmcgY2hpcCBzbyBkZWNrIGF1dGhvcnMgc3BvdCB0eXBvc1xuICAgIGNvbnN0IGJyb2tlbiA9IGZpbGUgPyB0aGlzLmRlY2tTZXJ2aWNlLmJyb2tlbihmaWxlKSA6IFtdO1xuICAgIGlmIChicm9rZW4ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgd2FybiA9IGNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy13YXJuXCIsXG4gICAgICAgIHRleHQ6IFwiXHUyNkEwIFwiICsgYnJva2VuLmpvaW4oXCIsIFwiKSxcbiAgICAgICAgYXR0cjogeyB0aXRsZTogXCJCcm9rZW4gZGVjayBsaW5rKHMpIFx1MjAxNCB0aGUgdGFyZ2V0IG5vdGUgZG9lcyBub3QgZXhpc3RcIiB9LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZCh3YXJuKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQm90dG9tLXJpZ2h0OiBhdXRvLWNvbXB1dGVkIHBhZ2UgbnVtYmVyIFx1MjUwMFx1MjUwMFxuICAgIGlmICh0aGlzLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSAhPT0gXCJub25lXCIgJiYgZGVjaykge1xuICAgICAgLy8gdjEuMC4wIG5leHQtb25seSBzZW1hbnRpY3M6IGNoYWluWzBdIGlzIHRoZSBoZWFkIHNsaWRlID0gcGFnZSAxO1xuICAgICAgLy8gdG90YWwgaXMgdGhlIGZ1bGwgY2hhaW4gbGVuZ3RoLlxuICAgICAgY29uc3QgdG90YWwgPSBkZWNrLmNoYWluLmxlbmd0aDtcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVTcGFuKHtcbiAgICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFnZVwiLFxuICAgICAgICB0ZXh0OlxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGFnZU51bWJlclN0eWxlID09PSBcImZyYWN0aW9uXCJcbiAgICAgICAgICAgID8gYCR7ZGVjay5pbmRleCArIDF9IC8gJHt0b3RhbH1gXG4gICAgICAgICAgICA6IGAke2RlY2suaW5kZXggKyAxfWAsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYmFyLmFwcGVuZENoaWxkKHBhZ2UpO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQcm9ncmVzcyBpbmRpY2F0b3I6IGRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCBiYXIgdG9wIFx1MjUwMFx1MjUwMFxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dQcm9ncmVzcyAmJiBkZWNrICYmIGRlY2suY2hhaW4ubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wcm9ncmVzc1wiIH0pO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWNrLmNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gaSA8IGRlY2suaW5kZXggPyBcInBhc3RcIiA6IGkgPT09IGRlY2suaW5kZXggPyBcImN1cnJlbnRcIiA6IFwiZnV0dXJlXCI7XG4gICAgICAgIGNvbnN0IHNlZyA9IGNyZWF0ZURpdih7XG4gICAgICAgICAgY2xzOiBgbmF0aXZlLXNsaWRlcy1wcm9ncmVzcy1zZWcgbmF0aXZlLXNsaWRlcy1wcm9ncmVzcy1zZWctLSR7c3RhdGV9YCxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdm9pZCB0aGlzLmp1bXBUbyhpKSk7XG4gICAgICAgIHByb2dyZXNzLmFwcGVuZENoaWxkKHNlZyk7XG4gICAgICB9XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChwcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gSGlkZSB0aGUgc2xpZGVzIGJhciBlbnRpcmVseSB3aGVuIGl0IGhhcyBub3RoaW5nIHRvIGRpc3BsYXkgKG5vIHByb3BlcnRpZXMsXG4gICAgLy8gYW5kIG5vdCBwYXJ0IG9mIGEgZGVjaylcbiAgICB0aGlzLmJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiB0aGlzLmJhci5jaGlsZEVsZW1lbnRDb3VudCA9PT0gMCA/IFwibm9uZVwiIDogXCJcIiB9KTtcbiAgfVxufVxuXG4vKiogV2hldGhlciBgdmFsdWVgIGlzIGFuIGFycmF5IG9mIGV4YWN0bHkgYGNvdW50YCBudW1iZXJzIChzdG9yZWQgYmFyIHdpZHRocykuICovXG5mdW5jdGlvbiBpc051bWJlckxpc3QodmFsdWU6IHVua25vd24sIGNvdW50OiBudW1iZXIpOiB2YWx1ZSBpcyBudW1iZXJbXSB7XG4gIHJldHVybiAoXG4gICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSBjb3VudCAmJiB2YWx1ZS5ldmVyeSgobikgPT4gdHlwZW9mIG4gPT09IFwibnVtYmVyXCIpXG4gICk7XG59XG4iLCAiLyoqIENyZWF0ZSB0aGUgc2xpZGVzIGJhciBET00gZWxlbWVudCAoaGlkZGVuIHVudGlsIHJlZnJlc2goKSBzaG93cyBpdCkgKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCYXIoKTogSFRNTEVsZW1lbnQge1xuICBjb25zdCBiYXIgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXJcIiB9KTtcbiAgYmFyLnNldENzc1N0eWxlcyh7IGRpc3BsYXk6IFwibm9uZVwiIH0pO1xuICBiYXIudGl0bGUgPSBcIkNsaWNrIHRvIHBhcmsgdGhlIG1vdXNlIFx1MjAxNCBoaWRlcyB0aGUgZWRpdG9yIGNhcmV0IHdoaWxlIHByZXNlbnRpbmdcIjtcbiAgLy8gUHJlc2VudGF0aW9uIHBhcmtpbmc6IGNsaWNraW5nIHRoZSBiYXIga2VlcHMgZm9jdXMgb3V0IG9mIHRoZSBlZGl0b3Igc29cbiAgLy8gdGhlIGJsaW5raW5nIGNhcmV0IGRpc2FwcGVhcnMuIHByZXZlbnREZWZhdWx0IHN0b3BzIHRoZSBjbGljayBmcm9tIG1vdmluZ1xuICAvLyBmb2N1cyBvciBzdGFydGluZyBhIHRleHQgc2VsZWN0aW9uOyBidXR0b25zIHN0aWxsIHJlY2VpdmUgdGhlaXIgY2xpY2sgZXZlbnQuXG4gIGJhci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGFjdGl2ZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGFjdGl2ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGFjdGl2ZSAhPT0gZG9jdW1lbnQuYm9keSkgYWN0aXZlLmJsdXIoKTtcbiAgfSk7XG4gIHJldHVybiBiYXI7XG59XG5cbi8qKiBCdWlsZCBhIFx1MjVDMCAvIFx1MjVCNiBuYXZpZ2F0aW9uIGJ1dHRvbjsgYGRpc2FibGVkYCByZW5kZXJzIGl0IGxpZ2h0IGdyYXkvaW5hY3RpdmUgKi9cbmV4cG9ydCBmdW5jdGlvbiBuYXZCdXR0b24oXG4gIGxhYmVsOiBzdHJpbmcsXG4gIHRpcDogc3RyaW5nLFxuICBvbkNsaWNrOiAoKSA9PiB2b2lkLFxuICBkaXNhYmxlZCA9IGZhbHNlLFxuKTogSFRNTEJ1dHRvbkVsZW1lbnQge1xuICBjb25zdCBidG4gPSBjcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtbmF2LWJ0blwiLFxuICAgIHRleHQ6IGxhYmVsLFxuICAgIGF0dHI6IHsgdGl0bGU6IHRpcCB9LFxuICB9KTtcbiAgYnRuLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gIGlmICghZGlzYWJsZWQpIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25DbGljayk7XG4gIHJldHVybiBidG47XG59XG5cbi8qKlxuICogTWVhc3VyZSB0aGUgdG9wIHRhYiBiYXIgYW5kIGV4cG9zZSBpdHMgaGVpZ2h0IGFzIHRoZSBDU1MgdmFyaWFibGVcbiAqIC0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0LCByZXR1cm5pbmcgdGhlIChwb3NzaWJseSB1cGRhdGVkKSBjYWNoZWRcbiAqIHZhbHVlLiBUaGUgc2xpZGVzIGJhciBpcyBoaWRkZW4gaW4gU2xpZGVzIG1vZGUsIHNvIHRoZSBsYXN0IG1lYXN1cmVkXG4gKiB2YWx1ZSBpcyByZXVzZWQgdGhlcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzeW5jVGFiQmFySGVpZ2h0KGNhY2hlZDogbnVtYmVyKTogbnVtYmVyIHtcbiAgY29uc3QgdGFiQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXG4gICAgXCIud29ya3NwYWNlLXRhYnMubW9kLXRvcCAud29ya3NwYWNlLXRhYi1oZWFkZXItY29udGFpbmVyXCIsXG4gICk7XG4gIGlmICh0YWJCYXIgJiYgdGFiQmFyLm9mZnNldEhlaWdodCA+IDApIGNhY2hlZCA9IHRhYkJhci5vZmZzZXRIZWlnaHQ7XG4gIGlmIChjYWNoZWQgPiAwKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldENzc1Byb3BzKHsgXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiOiBgJHtjYWNoZWR9cHhgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIE5vIG1lYXN1cmVtZW50IHlldCAodGFiIGJhciBoaWRkZW4gc2luY2UgbG9hZCkgXHUyMDE0IGxldCB0aGUgQ1NTIGZhbGxiYWNrIGFwcGx5LlxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIi0tbmF0aXZlLXNsaWRlcy10YWJiYXItaGVpZ2h0XCIpO1xuICB9XG4gIHJldHVybiBjYWNoZWQ7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIE5vdGljZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY29tcHV0ZUNhcGFjaXR5LCBmb3JtYXRDYXBhY2l0eSwgcHJvbXB0TG9jYWxlLCB0eXBlIFNsaWRlTWV0cmljcyB9IGZyb20gXCIuL2NhcGFjaXR5LWNvcmVcIjtcblxuLyoqXG4gKiBjYXBhY2l0eS50cyBcdTIwMTQgb25lLXNjcmVlbiBjYXBhY2l0eSBtZWFzdXJlbWVudCBmb3IgdGhlIGFjdGl2ZSBTbGlkZXMgbm90ZS5cbiAqXG4gKiBUaGUgXCJDb3B5IHNsaWRlIGNhcGFjaXR5XCIgY29tbWFuZCBtZWFzdXJlcyB0aGUgbGl2ZSBTbGlkZXMgbGF5b3V0IG9mIHRoZVxuICogY3VycmVudCBub3RlICh0aGUgb25seSBsYXlvdXQgdGhhdCBtYXR0ZXJzOiBhIG5ldyBzbGlkZSBtdXN0IGZpdCBpbnRvIHRoZVxuICogc2FtZSBzY3JlZW4pIGFuZCBmb3JtYXRzIHRoZSBudW1iZXJzIGludG8gYW4gQUktcmVhZHkgcHJvbXB0OlxuICpcbiAqICAgLSB0aGUgc2NyZWVuIC8gdGV4dC1hcmVhIGRpbWVuc2lvbnMgKGJhciBoZWlnaHQsIHRpdGxlIHJlc2VydmUsIHBhZGRpbmdzXG4gKiAgICAgYXJlIHJlYWQgZnJvbSB0aGUgbGl2ZSBjb21wdXRlZCBzdHlsZXMsIHNvIFwib25lIHNjcmVlblwiIGFsd2F5cyBtYXRjaGVzXG4gKiAgICAgZXhhY3RseSB3aGF0IHRoZSB2aWV3ZXIgc2VlcyksXG4gKiAgIC0gdGhlIGxpbmUgYm94IG9mIGV2ZXJ5IGVsZW1lbnQgdHlwZSBcdTIwMTQgbWVhc3VyZWQgZmlyc3QgKHRoZSBjdXJyZW50IHNsaWRlXG4gKiAgICAgaXMgYWxyZWFkeSBvbiBzY3JlZW4pLCB0aGVuIGRlcml2ZWQgZnJvbSB0aGUgcGlubmVkIFNsaWRlcyB0eXBvZ3JhcGh5XG4gKiAgICAgdmFyaWFibGVzIChzdHlsZXMuY3NzIFx1MDBBNzkgc2V0cyAtLWgxLXNpemUvLS1oMS1saW5lLWhlaWdodC8tLXAtc3BhY2luZy9cdTIwMjZcbiAqICAgICBvbiB0aGUgc2l6ZXI7IGNvZGUgYmxvY2tzIGFyZSAxcmVtLzEuNSkgd2hlbiB0aGUgbm90ZSBoYXMgbm8gaW5zdGFuY2VcbiAqICAgICBvZiB0aGF0IHR5cGUsXG4gKiAgIC0gY2hhcnMtcGVyLWxpbmUgZm9yIGxhdGluIGFuZCBDSksgdmlhIGNhbnZhcyBtZWFzdXJlVGV4dC5cbiAqXG4gKiBUaGUgbWF0aCBhbmQgcHJvbXB0IGZvcm1hdHRpbmcgbGl2ZSBpbiBzcmMvY2FwYWNpdHktY29yZS50cyAocHVyZSwgdGVzdGVkKTtcbiAqIHRoaXMgZmlsZSBpcyB0aGUgRE9NIGdsdWU6IG1lYXN1cmVtZW50ICsgY2xpcGJvYXJkLlxuICogVGhlIHByb21wdCBpcyBjb3BpZWQgdG8gdGhlIGNsaXBib2FyZCAobm8gb3RoZXIgb3V0cHV0KTsgdGhlIG1lc3NhZ2UgdGV4dFxuICogZm9sbG93cyB0aGUgT2JzaWRpYW4gVUkgbGFuZ3VhZ2UgKFwiemgqXCIgXHUyMTkyIENoaW5lc2UsIG90aGVyd2lzZSBFbmdsaXNoKS5cbiAqL1xuXG5jb25zdCBweCA9ICh2OiBzdHJpbmcpOiBudW1iZXIgPT4gTnVtYmVyLnBhcnNlRmxvYXQodik7XG5cbmNvbnN0IFNBTVBMRV9MQVRJTiA9XG4gIFwiVGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZyAwMTIzNDU2Nzg5IGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCI7XG5jb25zdCBTQU1QTEVfQ0pLID0gXCJcdTRFMDBcdTVDNEZcdTRFMDBcdTUzNjFcdTVFN0JcdTcwNkZcdTcyNDdcdTUxODVcdTVCQjlcdTZENEJcdTkxQ0ZcdTc5M0FcdTRGOEJcdUZGMENcdTZCQ0ZcdTg4NENcdTUzRUZcdTRFRTVcdTYzOTJcdTRFMEJcdTU5MUFcdTVDMTFcdTRFMkFcdTVCNTdcdUZGMUFcdTUyQTBcdTUxQ0ZcdTRFNThcdTk2NjRcdTc2N0VcdTUyMDZcdTZCRDRcdTMwMDJcIjtcblxuLyoqIEF2ZXJhZ2UgY2hhciB3aWR0aCAocHgpIGZvciBhIHNhbXBsZSBzdHJpbmcgYXQgdGhlIGdpdmVuIGZvbnQgc2V0dGluZ3MgKi9cbmZ1bmN0aW9uIGF2Z0NoYXJXaWR0aChmb250OiBzdHJpbmcsIHNhbXBsZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgaWYgKCFjdHgpIHJldHVybiAyNDtcbiAgY3R4LmZvbnQgPSBmb250O1xuICByZXR1cm4gY3R4Lm1lYXN1cmVUZXh0KHNhbXBsZSkud2lkdGggLyBzYW1wbGUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBsaW5lQm94KGVsOiBIVE1MRWxlbWVudCk6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0ge1xuICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICBjb25zdCBmcyA9IHB4KGNzLmZvbnRTaXplKTtcbiAgY29uc3QgbGhSYXcgPSBjcy5saW5lSGVpZ2h0O1xuICByZXR1cm4geyBmb250U2l6ZTogZnMsIGxpbmVIZWlnaHQ6IHB4KGxoUmF3KSA+IDAgPyBweChsaFJhdykgOiBmcyAqIDEuNSB9O1xufVxuXG4vKipcbiAqIE1lYXN1cmUgdGhlIGFjdGl2ZSBTbGlkZXMgdmlldy4gUmV0dXJucyBudWxsIHdoZW4gbm8gU2xpZGVzIGxheW91dCBpc1xuICogYWN0aXZlICh0aGUgY29tbWFuZCBpcyBvbmx5IHJlYWNoYWJsZSB0aGVyZSwgYnV0IHRoZSBndWFyZCBpcyBjaGVhcCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWFzdXJlU2xpZGVzKGFwcDogQXBwKTogU2xpZGVNZXRyaWNzIHwgbnVsbCB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3KSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgcm9vdCA9IHZpZXcuY29udGVudEVsO1xuICBjb25zdCBzY3JvbGxlciA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tc2Nyb2xsZXJcIik7XG4gIGNvbnN0IGNvbnRlbnQgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gIGlmICghc2Nyb2xsZXIgfHwgIWNvbnRlbnQpIHJldHVybiBudWxsO1xuXG4gIGNvbnN0IGNzU2Nyb2xsID0gZ2V0Q29tcHV0ZWRTdHlsZShzY3JvbGxlcik7XG4gIGNvbnN0IGNzQ29udGVudCA9IGdldENvbXB1dGVkU3R5bGUoY29udGVudCk7XG5cbiAgY29uc3Qgc2NyZWVuSCA9IHNjcm9sbGVyLmNsaWVudEhlaWdodDtcbiAgY29uc3QgdGV4dFRvcFBhZCA9IHB4KGNzU2Nyb2xsLnBhZGRpbmdUb3ApO1xuICBjb25zdCB0ZXh0Qm90dG9tUGFkID0gcHgoY3NTY3JvbGwucGFkZGluZ0JvdHRvbSk7XG4gIGNvbnN0IGNhcmRQYWRUb3AgPSBweChjc0NvbnRlbnQucGFkZGluZ1RvcCk7XG4gIGNvbnN0IGNhcmRQYWRCb3R0b20gPSBweChjc0NvbnRlbnQucGFkZGluZ0JvdHRvbSk7XG5cbiAgY29uc3QgaGFzVGl0bGUgPVxuICAgIGNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIikgfHwgY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZS1uYXRpdmVcIik7XG4gIC8vIFdpdGggYSB0aXRsZSwgdGhlIGNhcmQncyB0b3AgcGFkZGluZyBncm93cyBieSB0aGUgcmVzZXJ2ZWQgdGl0bGUgYmxvY2tcbiAgLy8gKHBhZGRpbmdUb3AgLSBwYWRkaW5nQm90dG9tIGlzIHRoZSBkZWx0YTsgYm90aCBhcmUgLS1ucy1wYWQteSBub3JtYWxseSkuXG4gIGNvbnN0IHRpdGxlUmVzZXJ2ZWQgPSBoYXNUaXRsZVxuICAgID8gTWF0aC5yb3VuZChNYXRoLm1heCgwLCBjYXJkUGFkVG9wIC0gY2FyZFBhZEJvdHRvbSkgKiAxMDApIC8gMTAwXG4gICAgOiAwO1xuXG4gIGNvbnN0IHRleHRIZWlnaHQgPVxuICAgIE1hdGgucm91bmQoXG4gICAgICBNYXRoLm1heCgwLCBzY3JlZW5IIC0gdGV4dFRvcFBhZCAtIHRleHRCb3R0b21QYWQgLSBjYXJkUGFkVG9wIC0gY2FyZFBhZEJvdHRvbSkgKiAxMDAsXG4gICAgKSAvIDEwMDtcblxuICBjb25zdCB0ZXh0V2lkdGggPSBjb250ZW50LmNsaWVudFdpZHRoIC0gcHgoY3NDb250ZW50LnBhZGRpbmdMZWZ0KSAtIHB4KGNzQ29udGVudC5wYWRkaW5nUmlnaHQpO1xuICBjb25zdCB2aWV3cG9ydFdpZHRoID0gc2Nyb2xsZXIuY2xpZW50V2lkdGg7XG4gIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gc2NyZWVuSDtcblxuICAvLyBUaGUgc2xpZGVzIGJhciBpcyBhcHBlbmRlZCB0byBkb2N1bWVudC5ib2R5IChub3QgdGhlIHZpZXcncyBjb250ZW50RWwpXG4gIGNvbnN0IGJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm5hdGl2ZS1zbGlkZXMtYmFyXCIpO1xuICBjb25zdCBiYXJWaXNpYmxlID0gYmFyICE9PSBudWxsICYmIGdldENvbXB1dGVkU3R5bGUoYmFyKS5kaXNwbGF5ICE9PSBcIm5vbmVcIjtcbiAgY29uc3QgYmFySGVpZ2h0ID0gYmFyICYmIGJhclZpc2libGUgPyBiYXIub2Zmc2V0SGVpZ2h0IDogMDtcblxuICAvLyBcdTI1MDBcdTI1MDAgZWxlbWVudCBsaW5lIGJveGVzOiBtZWFzdXJlIGZpcnN0IGl0ZW0gb2YgZWFjaCB0eXBlIHByZXNlbnQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IGhlYWRlciA9IChjbHM6IHN0cmluZykgPT4gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihgLmNtLWNvbnRlbnQgJHtjbHN9YCk7XG4gIGNvbnN0IGgxRWwgPSBoZWFkZXIoXCIuY20taGVhZGVyLTFcIik7XG4gIGNvbnN0IGgyRWwgPSBoZWFkZXIoXCIuY20taGVhZGVyLTJcIik7XG4gIGNvbnN0IGgzRWwgPSBoZWFkZXIoXCIuY20taGVhZGVyLTNcIik7XG4gIGNvbnN0IGJ1bGxldEVsID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50IC5IeXBlck1ELWxpc3QtbGluZVwiKTtcbiAgY29uc3QgY29kZUVsID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50IHByZSwgLmNtLWNvbnRlbnQgLkh5cGVyTUQtY29kZWJsb2NrXCIpO1xuICBjb25zdCBpbWdFbCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudCBpbWc6bm90KC5jbS13aWRnZXRCdWZmZXIpXCIpO1xuXG4gIC8vIEEgcGxhaW4gYm9keSBsaW5lIFx1MjAxNCBza2lwIGhlYWRlcnMsIGxpc3QgbGluZXMsIGNvZGUsIHF1b3RlcyBhbmQgZW1wdHlcbiAgLy8gbGluZXMgKENNIHJlbmRlcnMgb25seSB2aXNpYmxlIGxpbmVzOyBpbiBTbGlkZXMgbW9kZSB0aGUgZmlyc3Qgc2NyZWVuXG4gIC8vIGlzIGV4YWN0bHkgdGhlbSkuIEFuIGVtcHR5IGxpbmUgYm94IChhIGJsYW5rIHJvdywgfjhweCkgaXMgbm90IGEgdXNlZnVsXG4gIC8vIGJvZHkgc2FtcGxlLCBzbyBwaWNrIHRoZSBmaXJzdCBjYW5kaWRhdGUgd2l0aCBhY3R1YWwgdGV4dC5cbiAgY29uc3QgYm9keUVsID1cbiAgICBBcnJheS5mcm9tKFxuICAgICAgcm9vdC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcbiAgICAgICAgXCIuY20tY29udGVudCAuY20tbGluZTpub3QoLkh5cGVyTUQtaGVhZGVyKTpub3QoLkh5cGVyTUQtbGlzdC1saW5lKTpub3QoLkh5cGVyTUQtcXVvdGUpOm5vdCguSHlwZXJNRC1jb2RlYmxvY2spXCIsXG4gICAgICApLFxuICAgICkuZmluZCgoZWwpID0+IGVsLnRleHRDb250ZW50ICE9PSBudWxsICYmIGVsLnRleHRDb250ZW50LnRyaW0oKS5sZW5ndGggPiAwKSA/PyBjb250ZW50O1xuXG4gIGNvbnN0IGJvZHkgPSBsaW5lQm94KGJvZHlFbCk7XG4gIGNvbnN0IGgxID0gaDFFbCA/IGxpbmVCb3goaDFFbCkgOiBudWxsO1xuICBjb25zdCBoMiA9IGgyRWwgPyBsaW5lQm94KGgyRWwpIDogbnVsbDtcbiAgY29uc3QgaDMgPSBoM0VsID8gbGluZUJveChoM0VsKSA6IG51bGw7XG5cbiAgY29uc3QgY3MgPSAoZWw6IEhUTUxFbGVtZW50KTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9PiBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgbGV0IGJ1bGxldDogeyBpdGVtSGVpZ2h0OiBudW1iZXIgfSB8IG51bGwgPSBudWxsO1xuICBpZiAoYnVsbGV0RWwpIHtcbiAgICBjb25zdCBjID0gY3MoYnVsbGV0RWwpO1xuICAgIGJ1bGxldCA9IHtcbiAgICAgIGl0ZW1IZWlnaHQ6IHB4KGMubGluZUhlaWdodCkgKyBweChjLnBhZGRpbmdUb3ApICsgcHgoYy5wYWRkaW5nQm90dG9tKSxcbiAgICB9O1xuICB9XG5cbiAgbGV0IGNvZGU6IHsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsID0gbnVsbDtcbiAgaWYgKGNvZGVFbCkge1xuICAgIGNvbnN0IGMgPSBjcyhjb2RlRWwpO1xuICAgIGNvZGUgPSB7IGxpbmVIZWlnaHQ6IHB4KGMubGluZUhlaWdodCkgPiAwID8gcHgoYy5saW5lSGVpZ2h0KSA6IHB4KGMuZm9udFNpemUpICogMS41IH07XG4gIH1cblxuICBjb25zdCBpbWFnZUhlaWdodCA9XG4gICAgaW1nRWwgJiYgaW1nRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ID4gMFxuICAgICAgPyBNYXRoLnJvdW5kKGltZ0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodClcbiAgICAgIDogbnVsbDtcblxuICAvLyBcdTI1MDBcdTI1MDAgZGVyaXZlIG1pc3NpbmcgZWxlbWVudCBib3hlcyBmcm9tIHRoZSBwaW5uZWQgU2xpZGVzIHR5cG9ncmFwaHkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIHN0eWxlcy5jc3MgXHUwMEE3OSBkZWNsYXJlcyB0aGUgc2xpZGUgdHlwb2dyYXBoeSBvbiB0aGUgc2l6ZXJcbiAgLy8gKC0taDEtc2l6ZTogMS40ZW07IC0taDEtbGluZS1oZWlnaHQ6IDEuNDM7IFx1MjAyNikgYW5kIFx1MDBBNzcgcGlucyBjb2RlIGJsb2Nrc1xuICAvLyB0byAxcmVtLzEuNSBcdTIwMTQgYSBub3RlIHdpdGhvdXQgdGhhdCBlbGVtZW50IHR5cGUgc3RpbGwgcmVwb3J0cyBpdHMgYm94LlxuICBjb25zdCBzaXplciA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tc2l6ZXJcIik7XG4gIGNvbnN0IHNpemVyU3R5bGUgPSBzaXplciA/IGNzKHNpemVyKSA6IG51bGw7XG4gIGNvbnN0IGRlcml2ZUJveCA9IChzaXplVmFyOiBzdHJpbmcsIGxoVmFyOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBlbSA9IHNpemVyU3R5bGUgPyBweChzaXplclN0eWxlLmdldFByb3BlcnR5VmFsdWUoc2l6ZVZhcikpIDogTmFOO1xuICAgIGNvbnN0IGxoID0gc2l6ZXJTdHlsZSA/IHB4KHNpemVyU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShsaFZhcikpIDogTmFOO1xuICAgIGNvbnN0IGZvbnRTaXplID0gZW0gPiAwID8gZW0gKiBib2R5LmZvbnRTaXplIDogYm9keS5mb250U2l6ZTtcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gbGggPiAwID8gbGggKiBmb250U2l6ZSA6IGJvZHkubGluZUhlaWdodDtcbiAgICByZXR1cm4geyBmb250U2l6ZSwgbGluZUhlaWdodCB9O1xuICB9O1xuICBjb25zdCBkZXJpdmVIMSA9IGRlcml2ZUJveChcIi0taDEtc2l6ZVwiLCBcIi0taDEtbGluZS1oZWlnaHRcIik7XG4gIGNvbnN0IGRlcml2ZUgyID0gZGVyaXZlQm94KFwiLS1oMi1zaXplXCIsIFwiLS1oMi1saW5lLWhlaWdodFwiKTtcbiAgY29uc3QgZGVyaXZlSDMgPSBkZXJpdmVCb3goXCItLWgzLXNpemVcIiwgXCItLWgzLWxpbmUtaGVpZ2h0XCIpO1xuICBjb25zdCBkZXJpdmVDb2RlID0gKCkgPT4ge1xuICAgIGNvbnN0IHJvb3RGb250ID0gcHgoZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmZvbnRTaXplKTtcbiAgICByZXR1cm4geyBsaW5lSGVpZ2h0OiByb290Rm9udCAqIDEuNSB9O1xuICB9O1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBjaGFyIHdpZHRocyBhdCB0aGUgYm9keSBmb250IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBjb25zdCBmb250RmFtaWx5ID0gY3MoY29udGVudCkuZm9udEZhbWlseTtcbiAgY29uc3QgZm9udCA9IGA0MDAgJHtib2R5LmZvbnRTaXplfXB4ICR7Zm9udEZhbWlseX1gO1xuICBjb25zdCBjaGFyID0ge1xuICAgIGxhdGluOiBhdmdDaGFyV2lkdGgoZm9udCwgU0FNUExFX0xBVElOKSxcbiAgICBjams6IGF2Z0NoYXJXaWR0aChmb250LCBTQU1QTEVfQ0pLKSxcbiAgfTtcblxuICAvLyBNZWFzdXJlZCB3aW5zOyBkZXJpdmF0aW9uIGZpbGxzIHRoZSBnYXBzIGZvciBhYnNlbnQgdHlwZXMuXG4gIHJldHVybiB7XG4gICAgdmlld3BvcnQ6IHsgd2lkdGg6IHZpZXdwb3J0V2lkdGgsIGhlaWdodDogdmlld3BvcnRIZWlnaHQgfSxcbiAgICB0ZXh0OiB7IHdpZHRoOiB0ZXh0V2lkdGgsIGhlaWdodDogdGV4dEhlaWdodCB9LFxuICAgIGJhcjoge1xuICAgICAgdmlzaWJsZTogYmFyVmlzaWJsZSxcbiAgICAgIGhlaWdodDogYmFySGVpZ2h0LFxuICAgIH0sXG4gICAgdGl0bGVSZXNlcnZlZDogTWF0aC5yb3VuZCh0aXRsZVJlc2VydmVkICogMTAwKSAvIDEwMCxcbiAgICBib2R5LFxuICAgIGgxOiBoMSA/PyBkZXJpdmVIMSxcbiAgICBoMjogaDIgPz8gZGVyaXZlSDIsXG4gICAgaDM6IGgzID8/IGRlcml2ZUgzLFxuICAgIGJ1bGxldCxcbiAgICBjb2RlOiBjb2RlID8/IGRlcml2ZUNvZGUoKSxcbiAgICBpbWFnZUhlaWdodCxcbiAgICBjaGFyLFxuICB9O1xufVxuXG4vKipcbiAqIEVudHJ5IHBvaW50IG9mIHRoZSBcIkNvcHkgc2xpZGUgY2FwYWNpdHlcIiBjb21tYW5kOiBtZWFzdXJlLCBmb3JtYXQsXG4gKiB3cml0ZSB0byB0aGUgY2xpcGJvYXJkLiBSdW5zIG9ubHkgZnJvbSBTbGlkZXMgbW9kZSAoY29tbWFuZCBnYXRlKS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvcHlDYXBhY2l0eVByb21wdChhcHA6IEFwcCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtID0gbWVhc3VyZVNsaWRlcyhhcHApO1xuICBpZiAoIW0pIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogY291bGQgbm90IG1lYXN1cmUgdGhlIFNsaWRlcyBsYXlvdXRcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHByb21wdCA9IGZvcm1hdENhcGFjaXR5KG0sIGNvbXB1dGVDYXBhY2l0eShtKSwgcHJvbXB0TG9jYWxlKCkpO1xuICB0cnkge1xuICAgIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHByb21wdCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY2xpcGJvYXJkIHdyaXRlIGZhaWxlZCAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgfVxufVxuIiwgIi8qKlxuICogY2FwYWNpdHktY29yZS50cyBcdTIwMTQgcHVyZSBjYXBhY2l0eSBtYXRoICsgcHJvbXB0IGZvcm1hdHRpbmcgZm9yIFNsaWRlcy5cbiAqXG4gKiBUaGlzIG1vZHVsZSBpcyBET00tZnJlZSBhbmQgdW5pdC10ZXN0ZWQgKGxpa2Ugc3JjL2RlY2sudHMpLiBJdCB0dXJuc1xuICogbWVhc3VyZWQgbnVtYmVycyAoZnJvbSBzcmMvY2FwYWNpdHkudHMpIGludG8gYSBvbmUtc2NyZWVuIGNhcGFjaXR5XG4gKiByZXBvcnQ6IGhvdyBtYW55IGJvZHkgbGluZXMgLyBidWxsZXRzIC8gSDEgbGluZXMgZml0IHRoZSBhY3RpdmUgdGV4dFxuICogYXJlYSwgd2l0aCBwZXItZWxlbWVudCBsaW5lIGJveGVzLCBhbmQgZm9ybWF0cyB0aGVtIGludG8gYW4gQUktcmVhZHlcbiAqIHByb21wdCBpbiB0aGUgT2JzaWRpYW4gVUkgbGFuZ3VhZ2UuXG4gKi9cblxuLyoqIFJhdyBsaXZlLWxheW91dCBtZWFzdXJlbWVudHMgb2YgdGhlIGFjdGl2ZSBTbGlkZXMgbm90ZSAqL1xuZXhwb3J0IGludGVyZmFjZSBTbGlkZU1ldHJpY3Mge1xuICAvKiogU2NyZWVuICh2aWV3cG9ydCkgc2l6ZSBpbiBDU1MgcHggKi9cbiAgdmlld3BvcnQ6IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfTtcbiAgLyoqIEF2YWlsYWJsZSB0ZXh0IGFyZWEgKHNjcmVlbiBtaW51cyBzY3JvbGxlciBwYWRkaW5ncywgY2FyZCBwYWRkaW5nLCB0aXRsZSkgKi9cbiAgdGV4dDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICAvKiogU2xpZGVzIGJhciBzdGF0ZSBcdTIwMTQgaXRzIGhlaWdodCBpcyBvbiB0aGUgcGFnZTsgdGhlIG51bWJlciBpcyBpbmZvcm1hdGlvbmFsICovXG4gIGJhcjogeyB2aXNpYmxlOiBib29sZWFuOyBoZWlnaHQ6IG51bWJlciB9O1xuICAvKiogVmVydGljYWwgc3BhY2UgcmVzZXJ2ZWQgZm9yIHRoZSBjYXJkIHRpdGxlICgwID0gbm8gdGl0bGUpICovXG4gIHRpdGxlUmVzZXJ2ZWQ6IG51bWJlcjtcbiAgLyoqIEJvZHkgcGFyYWdyYXBoIG1ldHJpY3MgKGZvbnQgc2l6ZSAvIGxpbmUgYm94LCBweCkgKi9cbiAgYm9keTogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfTtcbiAgLyoqIEhlYWRpbmcgbGluZSBib3hlcyAocHgpIFx1MjAxNCBudWxsIHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUgb2YgdGhpcyBsZXZlbCAqL1xuICBoMTogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIGgyOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgaDM6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICAvKiogT25lIGJ1bGxldCBpdGVtJ3MgdG90YWwgaGVpZ2h0IChsaW5lIGJveCArIGxpc3QgcGFkZGluZ3MsIHB4KSAqL1xuICBidWxsZXQ6IHsgaXRlbUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICAvKiogT25lIGNvZGUgbGluZSdzIGJveCAoZm9udCAxcmVtIGluIFNsaWRlczsgbWVhc3VyZWQgd2hlbiBhIGJsb2NrIGV4aXN0cykgKi9cbiAgY29kZTogeyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIC8qKiBIZWlnaHQgb2YgdGhlIGZpcnN0IHJlbmRlcmVkIGltYWdlIChweCk7IG51bGwgd2hlbiB0aGUgbm90ZSBoYXMgbm9uZSAqL1xuICBpbWFnZUhlaWdodDogbnVtYmVyIHwgbnVsbDtcbiAgLyoqIEF2ZXJhZ2UgY2hhcmFjdGVyIHdpZHRocyAocHgpIGF0IHRoZSBib2R5IGZvbnQgKi9cbiAgY2hhcjogeyBsYXRpbjogbnVtYmVyOyBjams6IG51bWJlciB9O1xufVxuXG4vKiogRGVyaXZlZCBjYXBhY2l0eSBjb3VudHMgKHB1cmU7IHRha2VzIG51bWJlcnMsIG5vdCB0aGUgRE9NKSAqL1xuZXhwb3J0IGludGVyZmFjZSBDYXBhY2l0eVJlc3VsdCB7XG4gIC8qKiBCb2R5IHRleHQgbGluZXMgdGhhdCBmaXQgb25lIHNjcmVlbiAqL1xuICBib2R5TGluZXM6IG51bWJlcjtcbiAgLyoqIEJ1bGxldCBpdGVtcyB0aGF0IGZpdCBvbmUgc2NyZWVuIChmdWxsIGxpc3QpICovXG4gIGJ1bGxldHM6IG51bWJlcjtcbiAgLyoqIEgxIGxpbmVzIHRoYXQgZml0IChvbmUgcGVyIEgxIGxpbmUgYm94KSAqL1xuICBoMUxpbmVzOiBudW1iZXI7XG4gIC8qKiBFeGFtcGxlczogY291bnQgb2YgYSBzZWNvbmQgYmxvY2sgdHlwZSBhZnRlciBvbmUgZmlyc3QgYmxvY2sgKi9cbiAgY29tYm9zOiB7XG4gICAgYWZ0ZXJIMUJ1bGxldHM6IG51bWJlcjtcbiAgICBhZnRlckgyQnVsbGV0czogbnVtYmVyO1xuICAgIGFmdGVySDFCb2R5TGluZXM6IG51bWJlcjtcbiAgfTtcbn1cblxuLyoqXG4gKiBEZXJpdmVkIGNhcGFjaXR5IGZyb20gcmF3IG1ldHJpY3MgXHUyMDE0IHB1cmUgYW5kIGRldGVybWluaXN0aWMuXG4gKiBFdmVyeSBudW1iZXIgZmxvb3JzIChibG9ja3MgYXJlIGRpc2NyZXRlKTsgYSBuZWdhdGl2ZSByZXN1bHQgaXMgY2xhbXBlZCB0byAwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZUNhcGFjaXR5KG06IFNsaWRlTWV0cmljcyk6IENhcGFjaXR5UmVzdWx0IHtcbiAgY29uc3QgSCA9IG0udGV4dC5oZWlnaHQ7XG4gIGNvbnN0IGZsb29yID0gKG46IG51bWJlcik6IG51bWJlciA9PiBNYXRoLm1heCgwLCBNYXRoLmZsb29yKG4pKTtcbiAgY29uc3QgYm9keUxpbmVzID0gZmxvb3IoSCAvIG0uYm9keS5saW5lSGVpZ2h0KTtcblxuICBjb25zdCBidWxsZXRIID0gbS5idWxsZXQ/Lml0ZW1IZWlnaHQgPz8gbS5ib2R5LmxpbmVIZWlnaHQ7XG4gIGNvbnN0IGJ1bGxldHMgPSBmbG9vcihIIC8gYnVsbGV0SCk7XG5cbiAgY29uc3QgaDFIID0gbS5oMT8ubGluZUhlaWdodCA/PyBtLmJvZHkubGluZUhlaWdodDtcbiAgY29uc3QgaDFMaW5lcyA9IGZsb29yKEggLyBoMUgpO1xuXG4gIGNvbnN0IGgySCA9IG0uaDI/LmxpbmVIZWlnaHQgPz8gbS5ib2R5LmxpbmVIZWlnaHQ7XG4gIGNvbnN0IGFmdGVyU3BhbiA9IChmaXJzdEg6IG51bWJlciwgaXRlbUg6IG51bWJlcik6IG51bWJlciA9PiBmbG9vcigoSCAtIGZpcnN0SCkgLyBpdGVtSCk7XG5cbiAgcmV0dXJuIHtcbiAgICBib2R5TGluZXMsXG4gICAgYnVsbGV0cyxcbiAgICBoMUxpbmVzLFxuICAgIGNvbWJvczoge1xuICAgICAgYWZ0ZXJIMUJ1bGxldHM6IGFmdGVyU3BhbihoMUgsIGJ1bGxldEgpLFxuICAgICAgYWZ0ZXJIMkJ1bGxldHM6IGFmdGVyU3BhbihoMkgsIGJ1bGxldEgpLFxuICAgICAgYWZ0ZXJIMUJvZHlMaW5lczogYWZ0ZXJTcGFuKGgxSCwgbS5ib2R5LmxpbmVIZWlnaHQpLFxuICAgIH0sXG4gIH07XG59XG5cbi8qKiBMb2NhbGUgb2YgdGhlIGdlbmVyYXRlZCBwcm9tcHQ6IFwiemhcIiBmb3IgQ2hpbmVzZSwgb3RoZXJ3aXNlIEVuZ2xpc2ggKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9tcHRMb2NhbGUoKTogXCJ6aFwiIHwgXCJlblwiIHtcbiAgY29uc3QgbGFuZyA9XG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICA/IChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwibGFuZ1wiKSA/PyBuYXZpZ2F0b3IubGFuZ3VhZ2UgPz8gXCJlblwiKVxuICAgICAgOiBcImVuXCI7XG4gIHJldHVybiBsYW5nLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChcInpoXCIpID8gXCJ6aFwiIDogXCJlblwiO1xufVxuXG5mdW5jdGlvbiBmbXQobjogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobikgPyBTdHJpbmcobikgOiBuLnRvRml4ZWQoMSk7XG59XG5cbi8qKiBIdW1hbi1yZWFkYWJsZSBsaXN0IG9mIHRoZSBtZWFzdXJlZCBlbGVtZW50IGxpbmUgYm94ZXMgKi9cbmZ1bmN0aW9uIGJveFN0cihraW5kOiBzdHJpbmcsIGJveDogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGwpOiBzdHJpbmcge1xuICBpZiAoIWJveCkgcmV0dXJuIGAke2tpbmR9OiAtYDtcbiAgcmV0dXJuIGAke2tpbmR9OiAke2ZtdChib3gubGluZUhlaWdodCl9cHgvbGluZSAoZm9udCAke2ZtdChib3guZm9udFNpemUpfXB4KWA7XG59XG5cbi8qKiBIb3cgTmF0aXZlIFNsaWRlcyB3b3JrcyBcdTIwMTQgdGhlIGNvbnRleHQgYW4gYWdlbnQgbmVlZHMgYmVmb3JlIGdlbmVyYXRpbmcgKi9cbmZ1bmN0aW9uIGVuQ29udGV4dCgpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXG4gICAgYFRoaXMgbm90ZSBiZWxvbmdzIHRvIGEgZGVjayB1c2VkIGJ5IHRoZSBPYnNpZGlhbiBwbHVnaW4gXCJOYXRpdmUgU2xpZGVzXCIuIFRoZSBwbHVnaW4gdHVybnMgbWFya2Rvd24gbm90ZXMgaW50byBzbGlkZXM6IGEgZGVjayBpcyBhbiBvcmRlcmVkIGNoYWluIG9mIG5vdGVzLCBlYWNoIG5vdGUgaXMgT05FIHNsaWRlIHNob3duIGFzIGFuIGltbWVyc2l2ZSwgb25lIHNjcmVlbiA9IG9uZSBjYXJkIHZpZXcgKGVhY2ggc2xpZGUgYWx3YXlzIHN0YXJ0cyBhdCB0aGUgdG9wIG9mIGl0cyBub3RlKS5gLFxuICAgIGBgLFxuICAgIGBIb3cgdG8gYnVpbGQgYSBzbGlkZXMgZGVjazpgLFxuICAgIGAtIEEgc2xpZGUgaXMgYW4gb3JkaW5hcnkgbWFya2Rvd24gbm90ZSBpbiB0aGUgdmF1bHQ7IHRoZSBvbmx5IHJlc2VydmVkIGZyb250bWF0dGVyIHByb3BlcnR5IGlzIGRlY2sgXHUyMDE0IG9uZSBsaW5rIHRvIHRoZSBORVhUIHNsaWRlIChlLmcuIGRlY2s6IFtcIltbc2xpZGUtMl1dXCJdLCBvciBkZWNrOiBbXSBmb3IgdGhlIGxhc3Qgc2xpZGUpLiBUaGUgY2hhaW4gb3JkZXIgaXMgdGhlIHByZXNlbnRhdGlvbiBvcmRlcjsgcGFnZSBudW1iZXJzIGFyZSBhdXRvLWNvbXB1dGVkLmAsXG4gICAgYC0gQ3JlYXRlIGEgbmV3IGRlY2sgd2l0aCB0aGUgY29tbWFuZCBcIkNyZWF0ZSBuZXcgc2xpZGVcIiAoZnJlc2ggbm90ZSwgZGVjazogW10pLiBBZGQgcGFnZXMgd2l0aCBcIkNyZWF0ZSBuZXh0IHNsaWRlXCIgXHUyMDE0IGl0IHdpcmVzIHRoZSBkZWNrIGxpbmtzIGF1dG9tYXRpY2FsbHkgKHRoZSBjdXJyZW50IG5vdGUncyBkZWNrIGxpbmsgaXMgcG9pbnRlZCBhdCB0aGUgbmV3IG5vdGUsIHRoZSBuZXcgbm90ZSBnZXRzIHRoZSBvbGQgdGFyZ2V0KS5gLFxuICAgIGAtIENvbnRlbnQgaXMgd3JpdHRlbiBpbiBwbGFpbiBtYXJrZG93biBhbmQgcmVuZGVyZWQgb24gdGhlIGNhcmQgaW4gdGhlIG5vdGUncyBsYW5ndWFnZSB3aGVuIHBvc3NpYmxlLiBLZWVwIGV2ZXJ5IHNsaWRlIHdpdGhpbiBvbmUgc2NyZWVuIFx1MjAxNCB0aGUgY2FwYWNpdHkgbnVtYmVycyBiZWxvdyBhcmUgdGhlIGZpdCBidWRnZXQgKHRoZXkgYWxyZWFkeSBzdWJ0cmFjdCB0aGUgc2xpZGVzIGJhciBhbmQgdGhlIGNhcmQgdGl0bGUpLmAsXG4gICAgYC0gVGhlIHVzZXIncyByZXF1ZXN0IGNvbWVzIGZpcnN0OiBmb2xsb3cgd2hhdCB0aGUgdXNlciBhc2tlZCBmb3IgKFwiZm9yIG1hdGVyaWFsIFggbWFrZSBhIHNsaWRlcyBkZWNrXCIpLCB1c2luZyB0aGUgcGx1Z2luJ3MgY29udmVudGlvbnMgYWJvdmUgYXMgdGhlIGZvcm0sIG5vdCBhcyB0aGUgY29udGVudC5gLFxuICBdO1xufVxuXG5mdW5jdGlvbiB6aENvbnRleHQoKTogc3RyaW5nW10ge1xuICByZXR1cm4gW1xuICAgIGBcdTY3MkNcdTdCMTRcdThCQjBcdTVDNUVcdTRFOEUgT2JzaWRpYW4gXHU2M0QyXHU0RUY2IFwiTmF0aXZlIFNsaWRlc1wiIFx1NzY4NCBkZWNrIFx1N0IxNFx1OEJCMFx1MzAwMlx1OEJFNVx1NjNEMlx1NEVGNlx1NjI4QSBtYXJrZG93biBcdTdCMTRcdThCQjBcdTUzRDhcdTYyMTBcdTVFN0JcdTcwNkZcdTcyNDdcdUZGMUFcdTRFMDBcdTRFMkEgZGVjayBcdTVDMzFcdTY2MkZcdTRFMDBcdTdFQzRcdTY3MDlcdTVFOEZcdTk0RkVcdTYzQTVcdTc2ODRcdTdCMTRcdThCQjBcdUZGMENcdTZCQ0ZcdTdCQzdcdTdCMTRcdThCQjBcdTVDMzFcdTY2MkZcdTRFMDBcdTVGMjBcdTVFN0JcdTcwNkZcdTcyNDdcdUZGMENcdTRFRTVcIlx1NEUwMFx1NUM0Rlx1NEUwMFx1NTM2MVwiXHU3Njg0XHU2Qzg5XHU2RDc4XHU1RjBGXHU1MzYxXHU3MjQ3XHU4OUM2XHU1NkZFXHU1QzU1XHU3OTNBXHVGRjA4XHU2QkNGXHU1RjIwXHU1RTdCXHU3MDZGXHU3MjQ3XHU5MEZEXHU0RUNFXHU3QjE0XHU4QkIwXHU1RjAwXHU1OTM0XHU1RjAwXHU1OUNCXHVGRjA5XHUzMDAyYCxcbiAgICBgYCxcbiAgICBgXHU1OTgyXHU0RjU1XHU2Nzg0XHU1RUZBXHU1RTdCXHU3MDZGXHU3MjQ3IGRlY2tcdUZGMUFgLFxuICAgIGAtIFx1NUU3Qlx1NzA2Rlx1NzI0N1x1NUMzMVx1NjYyRlx1NUU5M1x1OTFDQ1x1NzY4NFx1NjY2RVx1OTAxQSBtYXJrZG93biBcdTdCMTRcdThCQjBcdUZGMUJcdTU1MkZcdTRFMDBcdTRGRERcdTc1NTlcdTc2ODQgZnJvbnRtYXR0ZXIgXHU1QzVFXHU2MDI3XHU2NjJGIGRlY2tcdTIwMTRcdTIwMTRcdTYzMDdcdTU0MTFcdTRFMEJcdTRFMDBcdTVGMjBcdTc2ODRcdTk0RkVcdTYzQTVcdUZGMDhcdTU5ODIgZGVjazogW1wiW1tzbGlkZS0yXV1cIl1cdUZGMENcdTY3MDBcdTU0MEVcdTRFMDBcdTVGMjBcdTUxOTkgZGVjazogW11cdUZGMDlcdTMwMDJcdTk0RkVcdTc2ODRcdTk4N0FcdTVFOEZcdTUzNzNcdTY1M0VcdTY2MjBcdTk4N0FcdTVFOEZcdUZGMENcdTk4NzVcdTUzRjdcdTgxRUFcdTUyQThcdThCQTFcdTdCOTdcdTMwMDJgLFxuICAgIGAtIFx1NzUyOFx1NTQ3RFx1NEVFNCBcIkNyZWF0ZSBuZXcgc2xpZGVcIiBcdTY1QjBcdTVFRkFcdTRFMDBcdTU5NTcgZGVja1x1RkYwOFx1NjVCMFx1NUVGQVx1N0IxNFx1OEJCMFx1RkYwQ2RlY2s6IFtdXHVGRjA5XHVGRjFCXHU3NTI4IFwiQ3JlYXRlIG5leHQgc2xpZGVcIiBcdTdFRTdcdTdFRURcdTUyQTBcdTk4NzVcdTIwMTRcdTIwMTRcdTVCODNcdTRGMUFcdTgxRUFcdTUyQThcdTYzQTVcdTkwMUFcdTk0RkVcdUZGMDhcdTVGNTNcdTUyNERcdTdCMTRcdThCQjBcdTc2ODQgZGVjayBcdTk0RkVcdTYzQTVcdTYzMDdcdTU0MTFcdTY1QjBcdTk4NzVcdUZGMENcdTY1QjBcdTk4NzVcdTdFRTdcdTYyN0ZcdTUzOUZcdTY3NjVcdTc2ODRcdTRFMEJcdTRFMDBcdTVGMjBcdUZGMDlcdTMwMDJgLFxuICAgIGAtIFx1NTE4NVx1NUJCOVx1NzUyOFx1N0VBRiBtYXJrZG93biBcdTdGMTZcdTUxOTlcdUZGMENcdTU3MjhcdTUzNjFcdTcyNDdcdTRFMEFcdTZFMzJcdTY3RDNcdUZGMUJcdTVDM0RcdTkxQ0ZcdTRGN0ZcdTc1MjhcdTc1MjhcdTYyMzdcdTVGNTNcdTUyNERcdTc2ODRcdThCRURcdThBMDBcdTYzQUFcdThGOUVcdTMwMDJcdTZCQ0ZcdTVGMjBcdTVFN0JcdTcwNkZcdTcyNDdcdTVGQzVcdTk4N0JcdTY1M0VcdTUxNjVcdTRFMDBcdTVDNEZcdTIwMTRcdTIwMTRcdTRFMEJcdTk3NjJcdTc2ODRcdTVCQjlcdTkxQ0ZcdTY1NzBcdTVCNTdcdTVDMzFcdTY2MkZcdTUzRUZcdTc1MjhcdTk4ODRcdTdCOTdcdUZGMDhcdTVERjJcdTdFQ0ZcdTYyNjNcdTYzODkgc2xpZGVzIFx1NjgwRlx1NEUwRVx1NTM2MVx1NzI0N1x1NjgwN1x1OTg5OFx1RkYwOVx1MzAwMmAsXG4gICAgYC0gXHU0RUU1XHU3NTI4XHU2MjM3XHU3Njg0XHU1QjlFXHU5NjQ1XHU5NzAwXHU2QzQyXHU0RTNBXHU1MTQ4XHVGRjFBXHU3NTI4XHU2MjM3XHU4OTgxXHU0RUMwXHU0RTQ4XHVGRjA4XHU1OTgyXCJcdTU3RkFcdTRFOEVcdTY3RDBcdTY3NTBcdTY1OTlcdTUyMzZcdTRGNUMgc2xpZGVzIFx1N0IxNFx1OEJCMFwiXHVGRjA5XHU1QzMxXHU1MDVBXHU0RUMwXHU0RTQ4XHVGRjBDXHU2M0QyXHU0RUY2XHU3Njg0XHU3RUE2XHU1QjlBXHU1M0VBXHU2NjJGXHU1RjYyXHU1RjBGXHVGRjBDXHU0RTBEXHU2NjJGXHU1MTg1XHU1QkI5XHUzMDAyYCxcbiAgXTtcbn1cblxuZnVuY3Rpb24gZW5Qcm9tcHQobTogU2xpZGVNZXRyaWNzLCBjOiBDYXBhY2l0eVJlc3VsdCwgbm90ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgYmFyID1cbiAgICBtLmJhci52aXNpYmxlIHx8IG0uYmFyLmhlaWdodCA+IDBcbiAgICAgID8gYFNsaWRlcyBiYXI6IHZpc2libGUsICR7bS5iYXIuaGVpZ2h0fXB4IChhbHJlYWR5IGV4Y2x1ZGVkIGZyb20gdGhlIHRleHQgYXJlYSkuYFxuICAgICAgOiBcIlNsaWRlcyBiYXI6IGhpZGRlbi5cIjtcbiAgY29uc3QgdGl0bGUgPVxuICAgIG0udGl0bGVSZXNlcnZlZCA+IDAgPyBgQ2FyZCB0aXRsZTogJHttLnRpdGxlUmVzZXJ2ZWR9cHggcmVzZXJ2ZWQuYCA6IFwiQ2FyZCB0aXRsZTogbm9uZS5cIjtcbiAgY29uc3QgaW1nID1cbiAgICBtLmltYWdlSGVpZ2h0ICE9PSBudWxsID8gYEltYWdlOiAke20uaW1hZ2VIZWlnaHR9cHggdGFsbCAoZmlyc3QgaW1hZ2Ugb24gdGhlIHNsaWRlKS5gIDogXCJcIjtcbiAgY29uc3Qgc2FtcGxlcyA9IFtcbiAgICBgUGxhaW4gdGV4dDogJHtjLmJvZHlMaW5lc30gYm9keSBsaW5lc2AsXG4gICAgYEgxICsgYnVsbGV0czogJHtjLmNvbWJvcy5hZnRlckgxQnVsbGV0c30gYnVsbGV0cyBhZnRlciBhIEgxIGxpbmVgLFxuICAgIGBQdXJlIGxpc3Q6ICR7Yy5idWxsZXRzfSBidWxsZXQgaXRlbXNgLFxuICAgIGBIMSBsaW5lcyBvbmx5OiAke2MuaDFMaW5lc31gLFxuICBdLmpvaW4oXCI7IFwiKTtcbiAgcmV0dXJuIFtcbiAgICBgU2xpZGUgY2FwYWNpdHkgXHUyMDE0IG9uZSBzY3JlZW4sIG5vIHNjcm9sbGluZy4gR2VuZXJhdGVkIGZyb20gdGhlIGxpdmUgU2xpZGVzIGxheW91dCBvZiB0aGlzIG5vdGU7IGV2ZXJ5IG51bWJlciBpcyBtZWFzdXJlZC9icmFuY2gtZGVyaXZlZCBhdCB0aGUgY3VycmVudCBVSSBzY2FsZS5gLFxuICAgIGBgLFxuICAgIC4uLmVuQ29udGV4dCgpLFxuICAgIGBgLFxuICAgIGBHZW9tZXRyeTogc2NyZWVuICR7bS52aWV3cG9ydC53aWR0aH1cdTAwRDcke20udmlld3BvcnQuaGVpZ2h0fXB4OyB0ZXh0IGFyZWEgJHttLnRleHQud2lkdGh9XHUwMEQ3JHttLnRleHQuaGVpZ2h0fXB4LiAke2Jhcn0gJHt0aXRsZX1gLFxuICAgIGBgLFxuICAgIGBUZXh0IG1ldHJpY3MgKGJvZHkgZm9udCAke2ZtdChtLmJvZHkuZm9udFNpemUpfXB4KTpgLFxuICAgIGBjaGFycy9saW5lIFx1MjI0OCAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmxhdGluKX0gbGF0aW4gLyAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmNqayl9IENKSzsgYm9keSBsaW5lICR7Zm10KG0uYm9keS5saW5lSGVpZ2h0KX1weC5gLFxuICAgIGJveFN0cihcIkgxXCIsIG0uaDEpLFxuICAgIGJveFN0cihcIkgyXCIsIG0uaDIpLFxuICAgIGJveFN0cihcIkgzXCIsIG0uaDMpLFxuICAgIGJveFN0cihcbiAgICAgIFwiYnVsbGV0XCIsXG4gICAgICBtLmJ1bGxldCA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5idWxsZXQuaXRlbUhlaWdodCB9IDogbnVsbCxcbiAgICApLFxuICAgIGJveFN0cihcImNvZGVcIiwgbS5jb2RlID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmNvZGUubGluZUhlaWdodCB9IDogbnVsbCksXG4gIF1cbiAgICAuY29uY2F0KGltZyA/IFtpbWddIDogW10pXG4gICAgLmNvbmNhdChbYGAsIGBDYXBhY2l0eTogJHtzYW1wbGVzfS5gLCBgYCwgbm90ZV0pXG4gICAgLmpvaW4oXCJcXG5cIik7XG59XG5cbmZ1bmN0aW9uIHpoUHJvbXB0KG06IFNsaWRlTWV0cmljcywgYzogQ2FwYWNpdHlSZXN1bHQsIG5vdGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGJhciA9XG4gICAgbS5iYXIudmlzaWJsZSB8fCBtLmJhci5oZWlnaHQgPiAwXG4gICAgICA/IGBTbGlkZXMgXHU2ODBGXHVGRjFBXHU2NjNFXHU3OTNBXHVGRjBDJHttLmJhci5oZWlnaHR9cHhcdUZGMDhcdTVERjJcdTRFQ0VcdTY1ODdcdTVCNTdcdTUzM0FcdTYyNjNcdTUxQ0ZcdUZGMDlcdTMwMDJgXG4gICAgICA6IFwiU2xpZGVzIFx1NjgwRlx1RkYxQVx1OTY5MFx1ODVDRlx1MzAwMlwiO1xuICBjb25zdCB0aXRsZSA9IG0udGl0bGVSZXNlcnZlZCA+IDAgPyBgXHU1MzYxXHU3MjQ3XHU2ODA3XHU5ODk4XHVGRjFBXHU5ODg0XHU3NTU5ICR7bS50aXRsZVJlc2VydmVkfXB4XHUzMDAyYCA6IFwiXHU1MzYxXHU3MjQ3XHU2ODA3XHU5ODk4XHVGRjFBXHU2NUUwXHUzMDAyXCI7XG4gIGNvbnN0IGltZyA9IG0uaW1hZ2VIZWlnaHQgIT09IG51bGwgPyBgXHU1NkZFXHU3MjQ3XHVGRjFBJHttLmltYWdlSGVpZ2h0fXB4IFx1OUFEOFx1RkYwOFx1NUY1M1x1NTI0RFx1OTg3NVx1N0IyQ1x1NEUwMFx1NUYyMFx1RkYwOVx1MzAwMmAgOiBcIlwiO1xuICBjb25zdCBzYW1wbGVzID0gW1xuICAgIGBcdTdFQUZcdTZCNjNcdTY1ODdcdUZGMUEke2MuYm9keUxpbmVzfSBcdTg4NENgLFxuICAgIGBIMSArIFx1NTIxN1x1ODg2OFx1RkYxQUgxIFx1NTQwRVx1OEZEOFx1NTNFRlx1NjUzRSAke2MuY29tYm9zLmFmdGVySDFCdWxsZXRzfSBcdTRFMkFcdTUyMTdcdTg4NjhcdTk4NzlgLFxuICAgIGBcdTdFQUZcdTUyMTdcdTg4NjhcdUZGMUEke2MuYnVsbGV0c30gXHU0RTJBXHU1MjE3XHU4ODY4XHU5ODc5YCxcbiAgICBgXHU3RUFGIEgxXHVGRjFBJHtjLmgxTGluZXN9IFx1ODg0Q2AsXG4gIF0uam9pbihcIlx1RkYxQlwiKTtcbiAgcmV0dXJuIFtcbiAgICBgXHU1RTdCXHU3MDZGXHU3MjQ3XHU1QkI5XHU5MUNGIFx1MjAxNFx1MjAxNCBcdTRFMDBcdTVDNEZcdUZGMENcdTRFMERcdTZFREFcdTUyQThcdTMwMDJcdTU3RkFcdTRFOEVcdTVGNTNcdTUyNERcdTdCMTRcdThCQjBcdTc2ODRcdTVCOUVcdTY1RjYgU2xpZGVzIFx1NUUwM1x1NUM0MFx1NzUxRlx1NjIxMFx1RkYxQlx1NjI0MFx1NjcwOVx1NjU3MFx1NUI1N1x1NjMwOVx1NUY1M1x1NTI0RCBVSSBcdTZCRDRcdTRGOEJcdTVCOUVcdTZENEIvXHU2M0E4XHU3Qjk3XHUzMDAyYCxcbiAgICBgYCxcbiAgICAuLi56aENvbnRleHQoKSxcbiAgICBgYCxcbiAgICBgXHU1MUUwXHU0RjU1XHVGRjFBXHU1QzRGXHU1RTU1ICR7bS52aWV3cG9ydC53aWR0aH1cdTAwRDcke20udmlld3BvcnQuaGVpZ2h0fXB4XHVGRjFCXHU2NTg3XHU1QjU3XHU1MzNBICR7bS50ZXh0LndpZHRofVx1MDBENyR7bS50ZXh0LmhlaWdodH1weFx1MzAwMiR7YmFyfSAke3RpdGxlfWAsXG4gICAgYGAsXG4gICAgYFx1NjU4N1x1NUI1N1x1NTNDMlx1NjU3MFx1RkYwOFx1NkI2M1x1NjU4NyAke2ZtdChtLmJvZHkuZm9udFNpemUpfXB4XHVGRjA5XHVGRjFBYCxcbiAgICBgXHU2QkNGXHU4ODRDXHU3RUE2ICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIuY2prKX0gXHU0RTJBXHU2QzQ5XHU1QjU3IC8gJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5sYXRpbil9IFx1NEUyQVx1NjJDOVx1NEUwMVx1NUI1N1x1N0IyNlx1RkYxQlx1NkI2M1x1NjU4N1x1ODg0Q1x1OUFEOCAke2ZtdChtLmJvZHkubGluZUhlaWdodCl9cHhcdTMwMDJgLFxuICAgIGJveFN0cihcIkgxXCIsIG0uaDEpLFxuICAgIGJveFN0cihcIkgyXCIsIG0uaDIpLFxuICAgIGJveFN0cihcIkgzXCIsIG0uaDMpLFxuICAgIGJveFN0cihcbiAgICAgIFwiXHU1MjE3XHU4ODY4XHU5ODc5XCIsXG4gICAgICBtLmJ1bGxldCA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5idWxsZXQuaXRlbUhlaWdodCB9IDogbnVsbCxcbiAgICApLFxuICAgIGJveFN0cihcIlx1NEVFM1x1NzgwMVx1ODg0Q1wiLCBtLmNvZGUgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uY29kZS5saW5lSGVpZ2h0IH0gOiBudWxsKSxcbiAgXVxuICAgIC5jb25jYXQoaW1nID8gW2ltZ10gOiBbXSlcbiAgICAuY29uY2F0KFtgYCwgYFx1NUJCOVx1OTFDRlx1RkYxQSR7c2FtcGxlc31cdTMwMDJgLCBgYCwgbm90ZV0pXG4gICAgLmpvaW4oXCJcXG5cIik7XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSBjYXBhY2l0eSBwcm9tcHQuIEZvbGxvd3MgdGhlIE9ic2lkaWFuIFVJIGxhbmd1YWdlIHZpYSBgbG9jYWxlYFxuICogKG1lYXN1cmVkIHNlcGFyYXRlbHkgZnJvbSB0aGUgYXBwKS4gVGhlIGBub3RlYCB0YWlsIHN0YXRlcyB0aGUgcG9saWN5XG4gKiAod2hhdCBmaXRzIG9uZSBzY3JlZW4pIFx1MjAxNCBzYW1lIHdvcmRpbmcgaW4gYm90aCBsYW5ndWFnZXMgd2hlcmUgcG9zc2libGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDYXBhY2l0eShtOiBTbGlkZU1ldHJpY3MsIGM6IENhcGFjaXR5UmVzdWx0LCBsb2NhbGU6IFwiemhcIiB8IFwiZW5cIik6IHN0cmluZyB7XG4gIGNvbnN0IG5vdGUgPVxuICAgIGxvY2FsZSA9PT0gXCJ6aFwiXG4gICAgICA/IFwiXHU3NTI4XHU2Q0Q1XHVGRjFBXHU3NTI4XHU2MjM3XHU0RjFBXHU2M0QwXHU0RjlCXHU2NzUwXHU2NTk5XHU1RTc2XHU4QkY0XHUzMDBDXHU1N0ZBXHU0RThFXHU4QkU1XHU2NzUwXHU2NTk5XHU1MjM2XHU0RjVDIHNsaWRlcy9QUFQgXHU3QjE0XHU4QkIwXHUzMDBEXHVGRjFCXHU2QjY0XHU2NUY2XHU2MzA5XHU0RTBBXHU2NTg3XHU3RUE2XHU1QjlBXHU1MjFCXHU1RUZBIGRlY2sgXHUyMDE0XHUyMDE0IFx1NTE0OFx1NEU4Nlx1ODlFM1x1Njc1MFx1NjU5OVx1NUU3Nlx1N0VEOVx1NTFGQVx1NjNEMFx1N0VCMi9cdTg5QzRcdTUyMTJcdUZGMENcdTUxOERcdTkwMTBcdTk4NzVcdTc1MUZcdTYyMTBcdTdCMTRcdThCQjBcdUZGMUJcdTZCQ0ZcdTRFMkFcdTUzNjFcdTcyNDdcdUZGMDhcdTdCMTRcdThCQjBcdUZGMDlcdTUxODVcdTY1M0VcdTYwNzBcdTUyMzBcdTU5N0RcdTU5MDRcdTc2ODRcdTUxODVcdTVCQjlcdUZGMENcdTRFMERcdTg5ODFcdThEODVcdTUxRkFcdTVCQjlcdTkxQ0ZcdTMwMDJcdTg5ODFcdTZDNDJcdUZGMUFcdTc1MUZcdTYyMTBcdTc2ODRcdTUxODVcdTVCQjlcdTVGQzVcdTk4N0JcdTY1M0VcdTU3MjhcdTVGNTNcdTUyNERcdThGRDlcdTRFMDBcdTVDNEZcdTUxODVcdUZGMENcdTRFMERcdTZFREFcdTUyQThcdUZGMUJcdTc1MjhcdTRFMEFcdTk3NjJcdTc2ODRcdTUxRTBcdTRGNTVcdTRFMEVcdTg4NENcdTlBRDhcdTY1NzBcdTVCNTdcdTY4MzhcdTdCOTdcdTYwM0JcdTlBRDhcdTVFQTZcdUZGMDhcdTZCNjNcdTY1ODdcdTg4NENcdTY1NzAgXHUwMEQ3IFx1ODg0Q1x1OUFEOCArIFx1NjgwN1x1OTg5OFx1OTg4NFx1NzU1OSArIFx1NTc1N1x1OTVGNFx1OTVGNFx1OERERCBcdTIyNjQgXHU2NTg3XHU1QjU3XHU1MzNBXHU5QUQ4XHU1RUE2XHVGRjA5XHUzMDAyXCJcbiAgICAgIDogXCJVc2FnZTogdGhlIHVzZXIgd2lsbCBwcm92aWRlIG1hdGVyaWFsIGFuZCBhc2sgdG8gbWFrZSBzbGlkZXMvUFBUIG5vdGVzIGZvciBpdDsgaW4gdGhhdCBjYXNlIGNyZWF0ZSBhIGRlY2sgcGVyIHRoZSBjb252ZW50aW9ucyBhYm92ZSBcdTIwMTQgcmV2aWV3IHRoZSBtYXRlcmlhbCBhbmQgb3V0bGluZSB0aGUgc3RydWN0dXJlIGZpcnN0LCB0aGVuIGdlbmVyYXRlIGVhY2ggc2xpZGUgbm90ZTsga2VlcCBlYWNoIGNhcmQncyBjb250ZW50IGp1c3Qgd2l0aGluIGNhcGFjaXR5LiBSZXF1aXJlbWVudDogdGhlIGdlbmVyYXRlZCBjb250ZW50IG11c3QgZml0IHRoaXMgb25lIHNjcmVlbiBcdTIwMTQgbm8gc2Nyb2xsaW5nLiBDaGVjayB0aGUgdG90YWwgaGVpZ2h0IHdpdGggdGhlIG51bWJlcnMgYWJvdmUgKGxpbmVzIFx1MDBENyBsaW5lLWhlaWdodCArIHRpdGxlIHJlc2VydmUgKyBpbnRlci1ibG9jayBzcGFjaW5nIFx1MjI2NCB0ZXh0IGFyZWEgaGVpZ2h0KS5cIjtcbiAgcmV0dXJuIGxvY2FsZSA9PT0gXCJ6aFwiID8gemhQcm9tcHQobSwgYywgbm90ZSkgOiBlblByb21wdChtLCBjLCBub3RlKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBpc0xpdmVQcmV2aWV3IH0gZnJvbSBcIi4vbW9kZVwiO1xuXG4vKipcbiAqIFR5cG9ncmFwaHktbWVhc3VyZW1lbnQgdG9vbGluZyAoZGV2IGJ1aWxkcyBvbmx5KS5cbiAqXG4gKiBUaGUgYG5zLWRlYnVnLXN0eWxlc2AgY29tbWFuZCBzYW1wbGVzIHRoZSBmaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgaW5cbiAqIGVkaXQgKExpdmUgUHJldmlldykgYW5kIHRoZSBraXRjaGVuLXNpbmsgbm90ZSBpbiByZWFkaW5nIHZpZXcsIG1lcmdlcyB0aGVcbiAqIHJlc3VsdHMsIGNvbXB1dGVzIGFuIGVkaXQtdnMtcmVhZGluZyBkaWZmIGFuZCB3cml0ZXMgaXQgdG9cbiAqIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gaW4gdGhlIHZhdWx0IHJvb3QuIFJlZ2lzdGVyZWQgb25seSB3aGVuIHRoZVxuICogYnVpbGQtdGltZSBERVZfTU9ERSBmbGFnIGlzIHRydWU7IHJlbGVhc2UgYnVpbGRzIHRyZWUtc2hha2UgdGhpcyBtb2R1bGUgb3V0LlxuICovXG5cbi8qKiBGaXhlZCBvbmUtcGFnZSBzYW1wbGUgbm90ZXMgdXNlZCBieSB0aGUgZGVidWcgY29tbWFuZCAoZWRpdCBzaWRlKSAqL1xuZXhwb3J0IGNvbnN0IFNBTVBMRV9OT1RFX05BTUVTID0gW1xuICBcInR5cG9ncmFwaHktc2FtcGxlLWhlYWRpbmdzXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtbGlzdFwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLWNvZGVcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1xdW90ZVwiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLW1lZGlhXCIsXG5dO1xuXG4vKiogU3R5bGUgc2VjdGlvbnMgc2FtcGxlZCBieSBzYW1wbGVTdHlsZXMoKSBhbmQgY29tcGFyZWQgYnkgZGlmZkR1bXBzKCkgKi9cbmNvbnN0IFNUWUxFX1NFQ1RJT05TID0gW1xuICBcImNvbnRhaW5lclwiLFxuICBcInBhcmFncmFwaFwiLFxuICBcImgxXCIsXG4gIFwibGlzdEl0ZW1cIixcbiAgXCJjb2RlQmxvY2tcIixcbiAgXCJibG9ja3F1b3RlXCIsXG4gIFwiaW5saW5lQ29kZVwiLFxuICBcInRhYmxlXCIsXG4gIFwiaW1hZ2VcIixcbiAgXCJob3Jpem9udGFsUnVsZVwiLFxuXTtcblxuLyoqIFByb21pc2UtYmFzZWQgc2xlZXAgKi9cbmZ1bmN0aW9uIHNsZWVwKG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB3aW5kb3cuc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vKipcbiAqIE1lcmdlIG5vbi1taXNzaW5nIHN0eWxlIHNlY3Rpb25zIG9mIGEgZnJlc2ggc2FtcGxlIGludG8gdGhlIHRhcmdldFxuICogKGZpcnN0IG5vbi1taXNzaW5nIHZhbHVlIHdpbnMpLlxuICovXG5mdW5jdGlvbiBtZXJnZVNhbXBsZSh0YXJnZXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBzYW1wbGU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XG4gIGZvciAoY29uc3Qga2V5IG9mIFNUWUxFX1NFQ1RJT05TKSB7XG4gICAgY29uc3Qgc2VjdGlvbiA9IHNhbXBsZVtrZXldIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCB1bmRlZmluZWQ7XG4gICAgaWYgKCFzZWN0aW9uIHx8IFwiKG1pc3NpbmcpXCIgaW4gc2VjdGlvbikgY29udGludWU7XG4gICAgY29uc3QgZXhpc3RpbmcgPSB0YXJnZXRba2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuICAgIGlmIChleGlzdGluZyAmJiAhKFwiKG1pc3NpbmcpXCIgaW4gZXhpc3RpbmcpKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNlY3Rpb247XG4gIH1cbiAgLy8gUHJvYmUgZmllbGRzIHJpZGUgYWxvbmcgKGZpcnN0IG5vbi1lbXB0eSB3aW5zKVxuICBmb3IgKGNvbnN0IGtleSBvZiBbXG4gICAgXCJsaXN0TGluZXNcIixcbiAgICBcIm1ldGFkYXRhQ29udGFpbmVyRGlzcGxheVwiLFxuICAgIFwiaDFPZmZzZXRUb3BcIixcbiAgICBcImgxVG9wSW5Db250ZW50XCIsXG4gICAgXCJoMUxlZnRJbkNvbnRlbnRcIixcbiAgICBcInRpdGxlXCIsXG4gICAgXCJjb250ZW50Q2hpbGRyZW5cIixcbiAgICBcInRvcENoYWluXCIsXG4gIF0pIHtcbiAgICBjb25zdCBwcm9iZSA9IHNhbXBsZVtrZXldO1xuICAgIGlmIChwcm9iZSA9PT0gdW5kZWZpbmVkIHx8IHByb2JlID09PSBudWxsKSBjb250aW51ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9iZSkgJiYgcHJvYmUubGVuZ3RoID09PSAwKSBjb250aW51ZTtcbiAgICBpZiAodHlwZW9mIHByb2JlID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHByb2JlKSAmJiBPYmplY3Qua2V5cyhwcm9iZSkubGVuZ3RoID09PSAwKVxuICAgICAgY29udGludWU7XG4gICAgaWYgKHRhcmdldFtrZXldID09PSB1bmRlZmluZWQpIHRhcmdldFtrZXldID0gcHJvYmU7XG4gIH1cbn1cblxuLyoqXG4gKiBDb21wYXJlIHRoZSBzdHlsZSBzZWN0aW9ucyBvZiBhbiBlZGl0IGR1bXAgYW5kIGEgcmVhZGluZyBkdW1wOyBvbmx5XG4gKiBrZXlzIHdob3NlIHZhbHVlcyBkaWZmZXIgYXJlIGtlcHQsIGFzIHsga2V5OiB7IGVkaXQsIHJlYWRpbmcgfSB9LlxuICovXG5mdW5jdGlvbiBkaWZmRHVtcHMoXG4gIGVkaXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICByZWFkaW5nOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBmb3IgKGNvbnN0IHNlY3Rpb24gb2YgU1RZTEVfU0VDVElPTlMpIHtcbiAgICBjb25zdCBlID0gKGVkaXRbc2VjdGlvbl0gPz8ge30pIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gICAgY29uc3QgciA9IChyZWFkaW5nW3NlY3Rpb25dID8/IHt9KSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KFsuLi5PYmplY3Qua2V5cyhlKSwgLi4uT2JqZWN0LmtleXMocildKTtcbiAgICBjb25zdCBkaWZmczogUmVjb3JkPHN0cmluZywgeyBlZGl0OiBzdHJpbmc7IHJlYWRpbmc6IHN0cmluZyB9PiA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIGlmIChlW2tleV0gIT09IHJba2V5XSkge1xuICAgICAgICBkaWZmc1trZXldID0geyBlZGl0OiBlW2tleV0gPz8gXCIobWlzc2luZylcIiwgcmVhZGluZzogcltrZXldID8/IFwiKG1pc3NpbmcpXCIgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKGRpZmZzKS5sZW5ndGggPiAwKSBvdXRbc2VjdGlvbl0gPSBkaWZmcztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKiogU2FtcGxlIHRoZSBjdXJyZW50IHZpZXcncyB0eXBvZ3JhcGh5IGNvbXB1dGVkIHN0eWxlcyArIENTUyB2YXJpYWJsZXMgKi9cbmZ1bmN0aW9uIHNhbXBsZVN0eWxlcyhhcHA6IEFwcCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3KSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaXNFZGl0ID0gdmlldy5nZXRNb2RlKCkgPT09IFwic291cmNlXCI7XG4gIGNvbnN0IGNvbnRlbnRFbCA9IHZpZXcuY29udGVudEVsO1xuICAvLyBGaXJzdCBtYXRjaGluZyBjYW5kaWRhdGUgd2lucyBcdTIwMTQgZWRpdCAoY202KSBhbmQgcmVhZGluZyB1c2VcbiAgLy8gZGlmZmVyZW50IGVsZW1lbnQgc3RydWN0dXJlcyAoZS5nLiBubyBwcmUvYmxvY2txdW90ZSBpbiBjbTYpLlxuICBjb25zdCBwaWNrID0gKHNlbHM6IHN0cmluZ1tdKTogSFRNTEVsZW1lbnQgfCBudWxsID0+IHtcbiAgICBmb3IgKGNvbnN0IHNlbCBvZiBzZWxzKSB7XG4gICAgICBjb25zdCBlbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihzZWwpO1xuICAgICAgaWYgKGVsKSByZXR1cm4gZWw7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBjb25zdCBzdHlsZSA9IChlbDogSFRNTEVsZW1lbnQgfCBudWxsLCBwcm9wczogc3RyaW5nW10pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgICBpZiAoIWVsKSByZXR1cm4geyBcIihtaXNzaW5nKVwiOiBcImVsZW1lbnQgbm90IGluIHRoaXMgbm90ZVwiIH07XG4gICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgcHJvcHMpIHtcbiAgICAgIGNvbnN0IHYgPSBjcy5nZXRQcm9wZXJ0eVZhbHVlKHApLnRyaW0oKTtcbiAgICAgIGlmICh2KSBvdXRbcF0gPSB2O1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuICBjb25zdCB2YXJzID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcbiAgY29uc3QgY3NzVmFyID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB2YXJzLmdldFByb3BlcnR5VmFsdWUobmFtZSkudHJpbSgpO1xuXG4gIGNvbnN0IGNvbnRhaW5lciA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1jb250ZW50XCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXdcIixcbiAgXSk7XG4gIGNvbnN0IHBhcmEgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tbGluZTpub3QoLkh5cGVyTUQtaGVhZGVyKVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHBcIixcbiAgXSk7XG4gIGNvbnN0IGgxID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20taGVhZGVyLTFcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBoMVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGgxXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaDFcIixcbiAgXSk7XG4gIGNvbnN0IGxpc3RJdGVtID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1saXN0LWxpbmVcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyB1bCA+IGxpXCIsXG4gICAgaXNFZGl0ID8gXCIuSHlwZXJNRC1saXN0LWxpbmVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHVsID4gbGlcIixcbiAgXSk7XG4gIGNvbnN0IHByZSA9IHBpY2soW1xuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IHByZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWVkaXRpbmcgcHJlXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1jb2RlYmxvY2tcIiA6IFwiLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgXSk7XG4gIGNvbnN0IHF1b3RlID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBibG9ja3F1b3RlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgYmxvY2txdW90ZVwiLFxuICAgIGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5IeXBlck1ELXF1b3RlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgYmxvY2txdW90ZVwiLFxuICBdKTtcbiAgY29uc3QgaW5saW5lQ29kZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgY29kZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGNvZGVcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20taW5saW5lLWNvZGVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBjb2RlXCIsXG4gIF0pO1xuICBjb25zdCB0YWJsZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgdGFibGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyB0YWJsZVwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgdGFibGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IHRhYmxlXCIsXG4gIF0pO1xuICBjb25zdCBpbWcgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGltZ1wiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGltZ1wiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWxpbmUgaW1nXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBpbWdcIixcbiAgICBcImltZ1wiLCAvLyB3aG9sZS1kb2N1bWVudCBmYWxsYmFja1xuICBdKTtcbiAgY29uc3QgaHIgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGhyXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaHJcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIGhyXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBoclwiLFxuICAgIGlzRWRpdCA/IFwiLmNtLWhyXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaHJcIixcbiAgXSk7XG5cbiAgLy8gU3RydWN0dXJlIHByb2JlcyAoZWRpdCB2aWV3IG9ubHkpOiB0aGUgc291cmNlLXZpZXcgY2xhc3MgbGlzdFxuICAvLyAoY29uZmlybXMgdGhlIExpdmUgUHJldmlldyBtYXJrZXIgY2xhc3MpIGFuZCB1bmlxdWUgZWxlbWVudCB0YWdzXG4gIC8vIGluc2lkZSB0aGUgZWRpdG9yIChyZXZlYWxzIGhvdyBjbTYgcmVuZGVycyBjb2RlIGJsb2NrcyBldGMuIHdoZW5cbiAgLy8gdGhlIHVzdWFsIHNlbGVjdG9ycyBkbyBub3QgbWF0Y2gpLlxuICBjb25zdCBzb3VyY2VWaWV3Q2xhc3MgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcihcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202XCIpPy5jbGFzc05hbWUgPz8gXCJcIjtcbiAgY29uc3QgZG9tVGFnczogc3RyaW5nW10gPSBbXTtcbiAgaWYgKGlzRWRpdCkge1xuICAgIGNvbnN0IHRhZ3MgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBjb250ZW50RWxcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgKlwiKVxuICAgICAgLmZvckVhY2goKGVsKSA9PiB0YWdzLmFkZChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpKTtcbiAgICBkb21UYWdzLnB1c2goLi4udGFncyk7XG4gIH1cbiAgLy8gTGlzdC1saW5lIHByb2JlIChlZGl0IHZpZXcgb25seSk6IGNsYXNzIG5hbWVzICsgY29tcHV0ZWQgcGFkZGluZ1xuICAvLyBvZiB0aGUgZmlyc3QgbGlzdCBsaW5lcyBcdTIwMTQgbmVzdGVkIGxldmVscyBvZnRlbiB1c2UgZGlzdGluY3RcbiAgLy8gY2xhc3NlcyBvciBpbmxpbmUgcGFkZGluZ3MsIHdoaWNoIGRlY2lkZXMgd2hldGhlciBhIGxldmVsLWF3YXJlXG4gIC8vIGluZGVudCBvdmVycmlkZSBpcyBldmVuIHBvc3NpYmxlLlxuICBjb25zdCBsaXN0TGluZXM6IHsgY2xhc3NOYW1lOiBzdHJpbmc7IHBhZGRpbmdMZWZ0OiBzdHJpbmcgfVtdID0gW107XG4gIGlmIChpc0VkaXQpIHtcbiAgICBjb250ZW50RWwucXVlcnlTZWxlY3RvckFsbChcIi5IeXBlck1ELWxpc3QtbGluZVwiKS5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgaWYgKGkgPj0gNCkgcmV0dXJuO1xuICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGxpc3RMaW5lcy5wdXNoKHtcbiAgICAgICAgY2xhc3NOYW1lOiBlbC5jbGFzc05hbWUsXG4gICAgICAgIHBhZGRpbmdMZWZ0OiBjcy5nZXRQcm9wZXJ0eVZhbHVlKFwicGFkZGluZy1sZWZ0XCIpLnRyaW0oKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIC8vIEZyb250bWF0dGVyIHByb2JlczogZG9lcyB0aGUgKGhpZGRlbikgcHJvcGVydGllcyBhcmVhIHN0aWxsXG4gIC8vIG9jY3VweSBzcGFjZSBpbiBMaXZlIFByZXZpZXc/IEFuZCBob3cgZmFyIGlzIHRoZSBIMSBmcm9tIHRoZVxuICAvLyB0b3Agb2YgdGhlIGNvbnRlbnQgYXJlYT8gKHJlYWRpbmcgbW9kZSBoYXMgbm8gc3VjaCBwYWRkaW5nKVxuICBjb25zdCBtZXRhZGF0YURpc3BsYXkgPSAoKCkgPT4ge1xuICAgIGNvbnN0IHNlbCA9IGlzRWRpdFxuICAgICAgPyBcIi5tYXJrZG93bi1zb3VyY2UtdmlldyAubWV0YWRhdGEtY29udGFpbmVyXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tZXRhZGF0YS1jb250YWluZXJcIjtcbiAgICBjb25zdCBlbCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihzZWwpO1xuICAgIHJldHVybiBlbCA/IGdldENvbXB1dGVkU3R5bGUoZWwpLmRpc3BsYXkgOiBcIihub3QgaW4gRE9NKVwiO1xuICB9KSgpO1xuICBjb25zdCBoMU9mZnNldFRvcCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgdG9wID0gMDtcbiAgICBsZXQgbm9kZTogSFRNTEVsZW1lbnQgfCBudWxsID0gaDE7XG4gICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGVudEVsICYmIG5vZGUgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIHRvcCArPSBub2RlLm9mZnNldFRvcDtcbiAgICAgIG5vZGUgPSBub2RlLm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0b3A7XG4gIH0pKCk7XG4gIC8vIFdoYXQgb2NjdXBpZXMgdGhlIHNwYWNlIGJldHdlZW4gdGhlIGNvbnRlbnQgdG9wIGFuZCB0aGUgSDE/XG4gIC8vIChlZGl0KSBmaXJzdCBjaGlsZHJlbiBvZiAuY20tY29udGVudCwgYW5kIHRoZSBuZXQgSDEgZGlzdGFuY2VcbiAgLy8gZnJvbSB0aGUgY29udGVudCBhbmNob3IgXHUyMDE0IHJlYWRpbmcgaGFzIG5vIHN1Y2ggZ2FwLlxuICBjb25zdCBhbmNob3IgPSBpc0VkaXRcbiAgICA/IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpXG4gICAgOiBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXdcIik7XG4gIGNvbnN0IGgxVG9wSW5Db250ZW50ID0gKCgpID0+IHtcbiAgICBpZiAoIWgxIHx8ICFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoaDEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCk7XG4gIH0pKCk7XG4gIGNvbnN0IGgxTGVmdEluQ29udGVudCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSB8fCAhYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGgxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCk7XG4gIH0pKCk7XG4gIGNvbnN0IGNvbnRlbnRDaGlsZHJlbiA9ICgoKSA9PiB7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYW5jaG9yLmNoaWxkcmVuKVxuICAgICAgLnNsaWNlKDAsIDQpXG4gICAgICAubWFwKChlbCkgPT4ge1xuICAgICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNsczogKGVsIGFzIEhUTUxFbGVtZW50KS5jbGFzc05hbWUgfHwgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgIGRpc3BsYXk6IGNzLmRpc3BsYXksXG4gICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCksXG4gICAgICAgICAgbWFyZ2luVG9wOiBjcy5tYXJnaW5Ub3AsXG4gICAgICAgICAgcGFkZGluZ1RvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IGNzLm1hcmdpbkJvdHRvbSxcbiAgICAgICAgICBwYWRkaW5nQm90dG9tOiBjcy5wYWRkaW5nQm90dG9tLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH0pKCk7XG4gIC8vIENvbnRhaW5lciBjaGFpbiBwcm9iZTogZnJvbSAuY20tY29udGVudCB1cCB0byB0aGUgdmlldy1jb250ZW50LFxuICAvLyBlYWNoIHdyYXBwZXIncyBwYWRkaW5nL21hcmdpbiBcdTIwMTQgbG9jYXRlcyB0aGUgbGVmdG92ZXIgdmVydGljYWxcbiAgLy8gb2Zmc2V0IGJldHdlZW4gZWRpdCBhbmQgcmVhZGluZyBjb250ZW50IGFyZWFzLlxuICBjb25zdCB0b3BDaGFpbiA9ICgoKSA9PiB7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcGFydHM6IHsgY2xzOiBzdHJpbmc7IHBhZFRvcDogc3RyaW5nOyBtYXJUb3A6IHN0cmluZyB9W10gPSBbXTtcbiAgICBsZXQgbm9kZTogSFRNTEVsZW1lbnQgfCBudWxsID0gYW5jaG9yO1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRlbnRFbCAmJiBub2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgY2xzOiBub2RlLmNsYXNzTmFtZSB8fCBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgcGFkVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgICBtYXJUb3A6IGNzLm1hcmdpblRvcCxcbiAgICAgIH0pO1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzO1xuICB9KSgpO1xuXG4gIC8vIFRpdGxlIHByb2JlOiB0aGUgZ2VuZXJhdGVkIDo6YmVmb3JlIGluIFNsaWRlcyBtb2RlICh3aGVuIGEgdGl0bGUgaXNcbiAgLy8gY29uZmlndXJlZCkuIENhcHR1cmVzIGl0cyBjb21wdXRlZCBzdHlsZSBzbyB3ZSBjYW4gZGlmZiBpdCBhZ2FpbnN0IHRoZVxuICAvLyBib2R5IEgxICguY20taGVhZGVyLTEpIGFuZCBhbGlnbiB0aGVtIGV4YWN0bHkuXG4gIGNvbnN0IHRpdGxlQmVmb3JlID0gKCgpID0+IHtcbiAgICBpZiAoIWlzRWRpdCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjb250ZW50ID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnRcIik7XG4gICAgaWYgKCFjb250ZW50IHx8ICFjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250ZW50LCBcIjo6YmVmb3JlXCIpO1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiBjcy5jb250ZW50LFxuICAgICAgZGlzcGxheTogY3MuZGlzcGxheSxcbiAgICAgIHBvc2l0aW9uOiBjcy5wb3NpdGlvbixcbiAgICAgIHRvcDogY3MudG9wLFxuICAgICAgbGVmdDogY3MubGVmdCxcbiAgICAgIHBhZGRpbmdUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICBmb250RmFtaWx5OiBjcy5mb250RmFtaWx5LFxuICAgICAgZm9udFNpemU6IGNzLmZvbnRTaXplLFxuICAgICAgbGluZUhlaWdodDogY3MubGluZUhlaWdodCxcbiAgICAgIGZvbnRXZWlnaHQ6IGNzLmZvbnRXZWlnaHQsXG4gICAgICBmb250VmFyaWFudDogY3MuZm9udFZhcmlhbnQsXG4gICAgICBjb2xvcjogY3MuY29sb3IsXG4gICAgICBsZXR0ZXJTcGFjaW5nOiBjcy5sZXR0ZXJTcGFjaW5nLFxuICAgICAgdGV4dFRyYW5zZm9ybTogY3MudGV4dFRyYW5zZm9ybSxcbiAgICAgIHdvcmRTcGFjaW5nOiBjcy53b3JkU3BhY2luZyxcbiAgICAgIGZvbnRLZXJuaW5nOiBjcy5mb250S2VybmluZyxcbiAgICAgIGZvbnRGZWF0dXJlU2V0dGluZ3M6IGNzLmZvbnRGZWF0dXJlU2V0dGluZ3MsXG4gICAgICBmb250VmFyaWFudE51bWVyaWM6IGNzLmZvbnRWYXJpYW50TnVtZXJpYyxcbiAgICAgIGZvbnRWYXJpYW50TGlnYXR1cmVzOiBjcy5mb250VmFyaWFudExpZ2F0dXJlcyxcbiAgICAgIGZvbnRWYXJpYW50Q2FwczogY3MuZm9udFZhcmlhbnRDYXBzLFxuICAgIH07XG4gIH0pKCk7XG5cbiAgY29uc3QgZHVtcCA9IHtcbiAgICBtb2RlOiBpc0VkaXQgPyBcImVkaXQgKExpdmUgUHJldmlldylcIiA6IFwicmVhZGluZ1wiLFxuICAgIC8vIFNsaWRlcyBzdHlsaW5nIG9ubHkgYXBwbGllcyB3aGVuIFNsaWRlcyBtb2RlIGlzIG9uXG4gICAgc2xpZGVzQWN0aXZlOiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSxcbiAgICBkb21UYWdzOiBpc0VkaXQgPyBkb21UYWdzIDogdW5kZWZpbmVkLFxuICAgIHNvdXJjZVZpZXdDbGFzczogaXNFZGl0ID8gc291cmNlVmlld0NsYXNzIDogdW5kZWZpbmVkLFxuICAgIGxpdmVQcmV2aWV3OiBpc0VkaXQgPyBpc0xpdmVQcmV2aWV3KGFwcCkgOiB1bmRlZmluZWQsXG4gICAgbGlzdExpbmVzOiBpc0VkaXQgPyBsaXN0TGluZXMgOiB1bmRlZmluZWQsXG4gICAgbWV0YWRhdGFDb250YWluZXJEaXNwbGF5OiBtZXRhZGF0YURpc3BsYXksXG4gICAgaDFPZmZzZXRUb3A6IGgxT2Zmc2V0VG9wLFxuICAgIGgxVG9wSW5Db250ZW50OiBoMVRvcEluQ29udGVudCxcbiAgICBoMUxlZnRJbkNvbnRlbnQ6IGgxTGVmdEluQ29udGVudCxcbiAgICBjb250ZW50Q2hpbGRyZW46IGNvbnRlbnRDaGlsZHJlbixcbiAgICB0b3BDaGFpbjogdG9wQ2hhaW4sXG4gICAgdGl0bGU6IHRpdGxlQmVmb3JlLFxuICAgIGNvbnRhaW5lcjogc3R5bGUoY29udGFpbmVyLCBbXG4gICAgICBcImZvbnQtZmFtaWx5XCIsXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJtYXgtd2lkdGhcIixcbiAgICAgIFwid2lkdGhcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwiY29sb3JcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIHBhcmFncmFwaDogc3R5bGUocGFyYSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcIm1hcmdpbi1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1yaWdodFwiLFxuICAgICAgXCJ0ZXh0LWluZGVudFwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgaDE6IHN0eWxlKGgxLCBbXG4gICAgICBcImZvbnQtZmFtaWx5XCIsXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJmb250LXdlaWdodFwiLFxuICAgICAgXCJmb250LXZhcmlhbnRcIixcbiAgICAgIFwiY29sb3JcIixcbiAgICAgIFwibGV0dGVyLXNwYWNpbmdcIixcbiAgICAgIFwidGV4dC10cmFuc2Zvcm1cIixcbiAgICAgIFwid29yZC1zcGFjaW5nXCIsXG4gICAgICBcImZvbnQta2VybmluZ1wiLFxuICAgICAgXCJmb250LWZlYXR1cmUtc2V0dGluZ3NcIixcbiAgICAgIFwiZm9udC12YXJpYW50LW51bWVyaWNcIixcbiAgICAgIFwiZm9udC12YXJpYW50LWxpZ2F0dXJlc1wiLFxuICAgICAgXCJmb250LXZhcmlhbnQtY2Fwc1wiLFxuICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICBcIm1hcmdpbi1ib3R0b21cIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGxpc3RJdGVtOiBzdHlsZShsaXN0SXRlbSwgW1xuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXJpZ2h0XCIsXG4gICAgICBcInRleHQtaW5kZW50XCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBjb2RlQmxvY2s6IHN0eWxlKHByZSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgXCJib3JkZXItcmFkaXVzXCIsXG4gICAgXSksXG4gICAgYmxvY2txdW90ZTogc3R5bGUocXVvdGUsIFtcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcImJvcmRlci1sZWZ0LXdpZHRoXCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICBdKSxcbiAgICBpbmxpbmVDb2RlOiBzdHlsZShpbmxpbmVDb2RlLCBbXG4gICAgICBcImZvbnQtc2l6ZVwiLFxuICAgICAgXCJwYWRkaW5nLXRvcFwiLFxuICAgICAgXCJwYWRkaW5nLWJvdHRvbVwiLFxuICAgICAgXCJwYWRkaW5nLWxlZnRcIixcbiAgICAgIFwicGFkZGluZy1yaWdodFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgICBcImJvcmRlci1yYWRpdXNcIixcbiAgICBdKSxcbiAgICB0YWJsZTogc3R5bGUodGFibGUsIFtcImZvbnQtc2l6ZVwiLCBcImxpbmUtaGVpZ2h0XCIsIFwid2lkdGhcIiwgXCJib3JkZXItY29sbGFwc2VcIl0pLFxuICAgIGltYWdlOiBzdHlsZShpbWcsIFtcImRpc3BsYXlcIiwgXCJtYXJnaW4tbGVmdFwiLCBcIm1hcmdpbi1yaWdodFwiLCBcIm1heC13aWR0aFwiLCBcIndpZHRoXCJdKSxcbiAgICBob3Jpem9udGFsUnVsZTogc3R5bGUoaHIsIFtcIm1hcmdpbi10b3BcIiwgXCJtYXJnaW4tYm90dG9tXCIsIFwiYm9yZGVyLXRvcC13aWR0aFwiLCBcImhlaWdodFwiXSksXG4gICAgY3NzVmFyaWFibGVzOiB7XG4gICAgICBcIi0tZm9udC10ZXh0XCI6IGNzc1ZhcihcIi0tZm9udC10ZXh0XCIpLFxuICAgICAgXCItLWxpbmUtaGVpZ2h0LW5vcm1hbFwiOiBjc3NWYXIoXCItLWxpbmUtaGVpZ2h0LW5vcm1hbFwiKSxcbiAgICAgIFwiLS1oMS1zaXplXCI6IGNzc1ZhcihcIi0taDEtc2l6ZVwiKSxcbiAgICAgIFwiLS1oMS1saW5lLWhlaWdodFwiOiBjc3NWYXIoXCItLWgxLWxpbmUtaGVpZ2h0XCIpLFxuICAgICAgXCItLWgxLXdlaWdodFwiOiBjc3NWYXIoXCItLWgxLXdlaWdodFwiKSxcbiAgICAgIFwiLS1oMS12YXJpYW50XCI6IGNzc1ZhcihcIi0taDEtdmFyaWFudFwiKSxcbiAgICAgIFwiLS1oMS1jb2xvclwiOiBjc3NWYXIoXCItLWgxLWNvbG9yXCIpLFxuICAgICAgXCItLWgxLW1hcmdpbi10b3BcIjogY3NzVmFyKFwiLS1oMS1tYXJnaW4tdG9wXCIpLFxuICAgICAgXCItLWgxLW1hcmdpbi1ib3R0b21cIjogY3NzVmFyKFwiLS1oMS1tYXJnaW4tYm90dG9tXCIpLFxuICAgICAgXCItLXAtc3BhY2luZ1wiOiBjc3NWYXIoXCItLXAtc3BhY2luZ1wiKSxcbiAgICAgIFwiLS1saXN0LXNwYWNpbmdcIjogY3NzVmFyKFwiLS1saXN0LXNwYWNpbmdcIiksXG4gICAgICBcIi0tbGlzdC1pbmRlbnRcIjogY3NzVmFyKFwiLS1saXN0LWluZGVudFwiKSxcbiAgICAgIFwiLS1jb2RlLXNpemVcIjogY3NzVmFyKFwiLS1jb2RlLXNpemVcIiksXG4gICAgICBcIi0tY29kZS1wYWRkaW5nXCI6IGNzc1ZhcihcIi0tY29kZS1wYWRkaW5nXCIpLFxuICAgICAgXCItLWNvZGUtcmFkaXVzXCI6IGNzc1ZhcihcIi0tY29kZS1yYWRpdXNcIiksXG4gICAgICBcIi0tYmxvY2txdW90ZS1wYWRkaW5nXCI6IGNzc1ZhcihcIi0tYmxvY2txdW90ZS1wYWRkaW5nXCIpLFxuICAgICAgXCItLWJsb2NrcXVvdGUtYm9yZGVyLXRoaWNrbmVzc1wiOiBjc3NWYXIoXCItLWJsb2NrcXVvdGUtYm9yZGVyLXRoaWNrbmVzc1wiKSxcbiAgICAgIFwiLS1maWxlLW1hcmdpbnNcIjogY3NzVmFyKFwiLS1maWxlLW1hcmdpbnNcIiksXG4gICAgICBcIi0tZmlsZS1saW5lLXdpZHRoXCI6IGNzc1ZhcihcIi0tZmlsZS1saW5lLXdpZHRoXCIpLFxuICAgICAgXCItLW5vcm1hbC1mb250LXNpemVcIjogY3NzVmFyKFwiLS1ub3JtYWwtZm9udC1zaXplXCIpLFxuICAgICAgXCItLWZvbnQtdGV4dC1zaXplXCI6IGNzc1ZhcihcIi0tZm9udC10ZXh0LXNpemVcIiksXG4gICAgfSxcbiAgfTtcbiAgcmV0dXJuIGR1bXA7XG59XG5cbi8qKlxuICogRGVidWcgdHlwb2dyYXBoeTogc2FtcGxlcyB0aGUgZml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIChlYWNoXG4gKiBjb3ZlcmluZyBhIGdyb3VwIG9mIGVsZW1lbnRzIFx1MjAxNCBhbGwgdmlzaWJsZSB3aXRob3V0IHNjcm9sbGluZyksXG4gKiB0aGVuIHRoZSBraXRjaGVuLXNpbmsgbm90ZSBpbiByZWFkaW5nIHZpZXcgKG5vIHZpcnR1YWxpemF0aW9uXG4gKiB0aGVyZSksIG1lcmdlcyBldmVyeXRoaW5nLCBjb21wdXRlcyB0aGUgZWRpdC12cy1yZWFkaW5nIGRpZmYgYW5kXG4gKiB3cml0ZXMgaXQgdG8gLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiBpbiB0aGUgdmF1bHQgcm9vdC5cbiAqIFRoZSB1c2VyJ3Mgb3duIG5vdGUgaXMgcmVzdG9yZWQgYXQgdGhlIGVuZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGR1bXBUeXBvZ3JhcGh5KHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGFwcCA9IHBsdWdpbi5hcHA7XG4gIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogZW50ZXIgU2xpZGVzIG1vZGUgZmlyc3QgKE1vZCtTaGlmdCtFIG9uIGEgZGVjayBub3RlKVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogbm8gYWN0aXZlIE1hcmtkb3duIG5vdGVcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHN0YXJ0TW9kZSA9IHZpZXcuZ2V0TW9kZSgpO1xuICBjb25zdCBhY3RpdmVGaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIGNvbnN0IGxlYWYgPSBhcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpO1xuXG4gIC8vIEVkaXQgc2lkZTogZWFjaCBzaG9ydCBub3RlIGtlZXBzIGV2ZXJ5IHRhcmdldCBlbGVtZW50IG9uIHNjcmVlblxuICBjb25zdCBlZGl0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgU0FNUExFX05PVEVfTkFNRVMpIHtcbiAgICBjb25zdCBmID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChgdGVzdHMvJHtuYW1lfS5tZGApO1xuICAgIGlmICghKGYgaW5zdGFuY2VvZiBURmlsZSkpIGNvbnRpbnVlO1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZiwgeyBzdGF0ZTogeyBtb2RlOiBcInNvdXJjZVwiIH0gfSk7XG4gICAgYXdhaXQgc2xlZXAoNTAwKTtcbiAgICBjb25zdCBzID0gc2FtcGxlU3R5bGVzKGFwcCk7XG4gICAgaWYgKHMpIG1lcmdlU2FtcGxlKGVkaXQsIHMpO1xuICB9XG5cbiAgLy8gUmVhZGluZyBzaWRlOiB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgcmVuZGVycyBldmVyeXRoaW5nIGF0IG9uY2VcbiAgbGV0IHJlYWRpbmc6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IGRlbW8gPSBhcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKFwidGVzdHMvdHlwb2dyYXBoeS1kZW1vLm1kXCIpO1xuICBpZiAoZGVtbyBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShkZW1vLCB7IHN0YXRlOiB7IG1vZGU6IFwicHJldmlld1wiIH0gfSk7XG4gICAgYXdhaXQgc2xlZXAoODAwKTtcbiAgICByZWFkaW5nID0gc2FtcGxlU3R5bGVzKGFwcCk7XG4gIH1cblxuICAvLyBSZXN0b3JlIHRoZSB1c2VyJ3Mgbm90ZVxuICBpZiAoYWN0aXZlRmlsZSkge1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoYWN0aXZlRmlsZSwgeyBzdGF0ZTogeyBtb2RlOiBzdGFydE1vZGUgfSB9KTtcbiAgICBwbHVnaW4ucmVmcmVzaCgpO1xuICB9XG4gIGlmICghcmVhZGluZykge1xuICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiByZWFkaW5nIHNhbXBsZSBmYWlsZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGF5bG9hZCA9IHsgZWRpdCwgcmVhZGluZywgZGlmZjogZGlmZkR1bXBzKGVkaXQsIHJlYWRpbmcpIH07XG4gIHRyeSB7XG4gICAgYXdhaXQgYXBwLnZhdWx0LmFkYXB0ZXIud3JpdGUoXCIubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uXCIsIEpTT04uc3RyaW5naWZ5KHBheWxvYWQsIG51bGwsIDIpKTtcbiAgICBuZXcgTm90aWNlKFwiVHlwb2dyYXBoeSBkdW1wIFx1MjE5MiAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uICh2YXVsdCByb290KVwiKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3Qgd3JpdGUgZGVidWcgZmlsZSAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgfVxufVxuXG4vKiogUmVnaXN0ZXIgdGhlIGRldi1vbmx5IGRlYnVnIGNvbW1hbmQgKGNhbGxlZCBvbmx5IHdoZW4gREVWX01PREUgaXMgdHJ1ZSkuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQocGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pOiB2b2lkIHtcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWRlYnVnLXN0eWxlc1wiLFxuICAgIG5hbWU6IFwiRGVidWc6IGR1bXAgdHlwb2dyYXBoeSBzdHlsZXNcIixcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZCBkdW1wVHlwb2dyYXBoeShwbHVnaW4pLFxuICB9KTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldywgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuLyoqIE1vZGUgb2YgdGhlIGFjdGl2ZSBNYXJrZG93biB2aWV3OiAncHJldmlldyc9cmVhZGluZyAnc291cmNlJz1lZGl0aW5nICcnPW5vbmUgKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXJyZW50TW9kZShhcHA6IEFwcCk6IFwicHJldmlld1wiIHwgXCJzb3VyY2VcIiB8IFwiXCIge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIHJldHVybiB2aWV3ID8gdmlldy5nZXRNb2RlKCkgOiBcIlwiO1xufVxuXG4vKipcbiAqIFRydWUgd2hlbiB0aGUgYWN0aXZlIGVkaXQgdmlldyBpcyBMaXZlIFByZXZpZXcgKFNsaWRlcykgXHUyMDE0IGFzXG4gKiBvcHBvc2VkIHRvIFNvdXJjZSBtb2RlLiBPYnNpZGlhbiByZXBvcnRzIGJvdGggYXMgbW9kZSBcInNvdXJjZVwiO1xuICogdGhlIHZpZXcgc3RhdGUgY2FycmllcyBhIGBzb3VyY2VgIGZsYWcgKFNvdXJjZSBtb2RlID0gdHJ1ZSksIHdpdGhcbiAqIGEgRE9NIGNsYXNzIGZhbGxiYWNrICguaXMtbGl2ZS1wcmV2aWV3KSBmb3Igc2FmZXR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNMaXZlUHJldmlldyhhcHA6IEFwcCk6IGJvb2xlYW4ge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldyB8fCB2aWV3LmdldE1vZGUoKSAhPT0gXCJzb3VyY2VcIikgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzdGF0ZSA9IHZpZXcuZ2V0U3RhdGUoKSBhcyB7IHNvdXJjZT86IGJvb2xlYW4gfTtcbiAgaWYgKHN0YXRlLnNvdXJjZSA9PT0gdHJ1ZSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoc3RhdGUuc291cmNlID09PSBmYWxzZSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiAhIXZpZXcuY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNi5pcy1saXZlLXByZXZpZXdcIik7XG59XG5cbi8qKiBGcm9udG1hdHRlciBvZiBhbnkgbm90ZSBhcyBhbiBvYmplY3QsIG9yIG51bGwgd2hlbiBhYnNlbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9udG1hdHRlck9mKGFwcDogQXBwLCBmaWxlOiBURmlsZSk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IGNhY2hlID0gYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICByZXR1cm4gY2FjaGU/LmZyb250bWF0dGVyID8/IG51bGw7XG59XG5cbi8qKiBDdXJyZW50IG5vdGUncyBmcm9udG1hdHRlciBhcyBhbiBvYmplY3QsIG9yIG51bGwgd2hlbiBhYnNlbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmVGcm9udG1hdHRlcihhcHA6IEFwcCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IGZpbGUgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgcmV0dXJuIGZpbGUgPyBmcm9udG1hdHRlck9mKGFwcCwgZmlsZSkgOiBudWxsO1xufVxuIiwgIi8qKiBBIGJ1aWx0LWluIFNsaWRlcyBzdHlsZSB0ZW1wbGF0ZSAocmVuZGVyZWQgYXMgYm9keSBjbGFzcyBgbmF0aXZlLXNsaWRlcy10aGVtZS08aWQ+YCkgKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2xpZGVzVGhlbWUge1xuICBpZDogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xufVxuXG4vKiogQnVpbHQtaW4gc3R5bGUgdGVtcGxhdGVzIGZvciB0aGUgU2xpZGVzIGNhcmQgKyBiYXIgKGFsbCB0aGVtZS1hZGFwdGl2ZSkgKi9cbmV4cG9ydCBjb25zdCBTTElERVNfVEhFTUVTOiByZWFkb25seSBTbGlkZXNUaGVtZVtdID0gW1xuICB7IGlkOiBcImp5eVwiLCBsYWJlbDogXCJMZWN0dXJlIChqeXkpXCIgfSxcbiAgeyBpZDogXCJkYXNoZWRcIiwgbGFiZWw6IFwiRGFzaGVkIG91dGxpbmVcIiB9LFxuICB7IGlkOiBcInBhcGVyXCIsIGxhYmVsOiBcIlBhcGVyIGNhcmRcIiB9LFxuICB7IGlkOiBcIm1pbmltYWxcIiwgbGFiZWw6IFwiTWluaW1hbFwiIH0sXG4gIHsgaWQ6IFwiYWNjZW50XCIsIGxhYmVsOiBcIkFjY2VudCBlZGdlXCIgfSxcbiAgeyBpZDogXCJnbGFzc1wiLCBsYWJlbDogXCJGcm9zdGVkIGdsYXNzXCIgfSxcbl07XG5cbi8qKiBQbHVnaW4gc2V0dGluZ3MgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmF0aXZlU2xpZGVzU2V0dGluZ3Mge1xuICAvKiogU2hvdyBcdTI1QzAgXHUyNUI2IHByZXZpb3VzL25leHQgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciAqL1xuICBzaG93TmF2QnV0dG9uczogYm9vbGVhbjtcbiAgLyoqIFBhZ2UgbnVtYmVyIGRpc3BsYXkgc3R5bGU6IFwiZnJhY3Rpb25cIiA9IE4gLyBUb3RhbCwgXCJjdXJyZW50XCIgPSBOLCBcIm5vbmVcIiA9IGhpZGRlbiAqL1xuICBwYWdlTnVtYmVyU3R5bGU6IFwiZnJhY3Rpb25cIiB8IFwiY3VycmVudFwiIHwgXCJub25lXCI7XG4gIC8qKiBTaG93IGEgdGhpbiBjbGlja2FibGUgcHJvZ3Jlc3MgbGluZSBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyICovXG4gIHNob3dQcm9ncmVzczogYm9vbGVhbjtcbiAgLyoqIFNob3cgdGhlIGVudGlyZSBzbGlkZXMgYmFyIChtYXN0ZXIgdG9nZ2xlKSAqL1xuICBzaG93U2xpZGVzQmFyOiBib29sZWFuO1xuICAvKiogV2hldGhlciB0aGUgdXNlciBtYW51YWxseSBoaWQgdGhlIHNsaWRlcyBiYXIgKHRvZ2dsZSBjb21tYW5kKSAqL1xuICBiYXJIaWRkZW46IGJvb2xlYW47XG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIHdoZW4gb3BlbmluZyBhIGRlY2sgbm90ZSAoZGVmYXVsdCBvZmYpICovXG4gIGF1dG9FbnRlclNsaWRlczogYm9vbGVhbjtcbiAgLyoqIFByZXNzIEVzY2FwZSB0byBleGl0IFNsaWRlcyBtb2RlIChkZWZhdWx0IG9uKSAqL1xuICBlc2NFeGl0c1NsaWRlczogYm9vbGVhbjtcbiAgLyoqIEZyb250bWF0dGVyIHByb3BlcnR5IHNob3duIGFzIHRoZSBjYXJkIHRpdGxlIChcIlwiID0gbm9uZSwgXCJmaWxlbmFtZVwiID0gZmlsZSBuYW1lKSAqL1xuICBzbGlkZXNUaXRsZTogc3RyaW5nO1xuICAvKiogU3R5bGUgdGVtcGxhdGUgaWQgZnJvbSBTTElERVNfVEhFTUVTIChjYXJkICsgYmFyIGFwcGVhcmFuY2UpICovXG4gIHNsaWRlc1RoZW1lOiBzdHJpbmc7XG4gIC8qKiBDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgZm9yIHRoZSBzbGlkZXMgYmFyIChlbXB0eSA9IG5vbmUpICovXG4gIGJhclByb3BlcnRpZXM6IHN0cmluZztcbiAgLyoqIEpTT04gYXJyYXkgb2YgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIGZvciBiYXIgcHJvcGVydGllcyAoZHJhZ2dhYmxlIGRpdmlkZXJzKSAqL1xuICBiYXJQcm9wZXJ0eVdpZHRoczogc3RyaW5nO1xuICAvKiogQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBwYW5lbCAoZGVmYXVsdCBvbikgKi9cbiAgY29uZmlybURlbGV0ZVNsaWRlczogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEJsb2NrIGltYWdlIGVtYmVkcyBhcyBjZW50ZXJlZCBjYXJkIGJsb2NrcyAoZGVmYXVsdCBvbikuIFdoZW4gb2ZmLFxuICAgKiBpbWFnZXMga2VlcCBPYnNpZGlhbidzIG5hdGl2ZSBpbmxpbmUgZmxvdyBcdTIwMTQgdGV4dCBmbG93cyBhcm91bmQvYmVzaWRlXG4gICAqIHRoZW0gZXhhY3RseSBsaWtlIExpdmUgUHJldmlldyBvdXRzaWRlIFNsaWRlcyBtb2RlLlxuICAgKi9cbiAgaW1hZ2VMYXlvdXQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBOYXRpdmVTbGlkZXNTZXR0aW5ncyA9IHtcbiAgc2hvd05hdkJ1dHRvbnM6IHRydWUsXG4gIHBhZ2VOdW1iZXJTdHlsZTogXCJub25lXCIsXG4gIHNob3dQcm9ncmVzczogdHJ1ZSxcbiAgc2hvd1NsaWRlc0JhcjogdHJ1ZSxcbiAgYmFySGlkZGVuOiBmYWxzZSxcbiAgYXV0b0VudGVyU2xpZGVzOiBmYWxzZSxcbiAgZXNjRXhpdHNTbGlkZXM6IHRydWUsXG4gIHNsaWRlc1RpdGxlOiBcIlwiLFxuICBzbGlkZXNUaGVtZTogXCJqeXlcIixcbiAgYmFyUHJvcGVydGllczogXCJcIixcbiAgYmFyUHJvcGVydHlXaWR0aHM6IFwiXCIsXG4gIGNvbmZpcm1EZWxldGVTbGlkZXM6IHRydWUsXG4gIGltYWdlTGF5b3V0OiB0cnVlLFxufTtcblxuLyoqIFJlc2VydmVkIGZyb250bWF0dGVyIGtleSBkcml2aW5nIGRlY2sgbmF2aWdhdGlvbiAobmV2ZXIgcmVuZGVyZWQgYXMgYSBjaGlwKSAqL1xuZXhwb3J0IGNvbnN0IERFQ0tfS0VZID0gXCJkZWNrXCI7XG4iLCAiaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBjb3B5Q2FwYWNpdHlQcm9tcHQgfSBmcm9tIFwiLi9jYXBhY2l0eVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQgfSBmcm9tIFwiLi9kZWJ1Z1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB7IERFQ0tfS0VZIH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IE5vdGljZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogUmVnaXN0ZXIgZXZlcnkgY29tbWFuZDsgdGhlIGRlYnVnIGNvbW1hbmQgaXMgZGV2LWJ1aWxkIG9ubHkuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21tYW5kcyhwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IHZvaWQge1xuICAvLyBUb2dnbGUgdGhlIHNsaWRlcyBiYXIgXHUyMDE0IG9ubHkgbWVhbmluZ2Z1bCBpbnNpZGUgU2xpZGVzIG1vZGUsIHNvIGFcbiAgLy8gY2hlY2tDYWxsYmFjayBrZWVwcyBpdCBvdXQgb2YgdGhlIHBhbGV0dGUgZXZlcnl3aGVyZSBlbHNlXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtYmFyXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIGJhclwiLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykge1xuICAgICAgICBwbHVnaW4uc2V0dGluZ3MuYmFySGlkZGVuID0gIXBsdWdpbi5zZXR0aW5ncy5iYXJIaWRkZW47XG4gICAgICAgIHZvaWQgcGx1Z2luLnNhdmVTZXR0aW5ncygpLnRoZW4oKCkgPT4gcGx1Z2luLnJlZnJlc2goKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gU2hvdyB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgc2xpZGUgbGlzdClcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXNob3ctcGFuZWxcIixcbiAgICBuYW1lOiBcIlNob3cgc2xpZGVzIHBhbmVsXCIsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgcGx1Z2luLmFjdGl2YXRlU2xpZGVzUGFuZWwoKSxcbiAgfSk7XG4gIC8vIEhpZGUgLyBzaG93IHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIChwcmVzZW50aW5nOyBTbGlkZXMgbW9kZSBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLXBvaW50ZXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBtb3VzZSBwb2ludGVyXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIk1cIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVQb2ludGVyKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gUHJldmlvdXMgLyBuZXh0IHBhZ2UgXHUyMDE0IGRlY2sgbmF2aWdhdGlvbiAoZW50ZXJpbmcgU2xpZGVzIG1vZGUgYXNcbiAgLy8gbmVlZGVkKS4gY2hlY2tDYWxsYmFjayBrZWVwcyB0aGVtIG91dCBvZiB0aGUgcGFsZXR0ZSBvbiBub24tZGVjayBub3RlcyxcbiAgLy8gd2hlcmUgdGhleSBoYXZlIG5vdGhpbmcgdG8gZmxpcDsgdGhlaXIgZGVmYXVsdCBob3RrZXlzIHRoZW4gbm8gbG9uZ2VyXG4gIC8vIHNoYWRvdyB0aGUgZWRpdG9yJ3Mgc2VsZWN0LXRvLWxpbmUgc2hvcnRjdXRzIG9uIHBsYWluIG5vdGVzIGVpdGhlci5cbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXByZXZcIixcbiAgICBuYW1lOiBcIlByZXZpb3VzIHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dMZWZ0XCIgfV0sXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlIHx8ICFwbHVnaW4uZGVja1NlcnZpY2UuaXNNZW1iZXIoZmlsZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHZvaWQgcGx1Z2luLm5hdmlnYXRlKFwicHJldlwiKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtbmV4dFwiLFxuICAgIG5hbWU6IFwiTmV4dCBwYWdlXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIkFycm93UmlnaHRcIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4ubmF2aWdhdGUoXCJuZXh0XCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIENyZWF0ZSBOZXh0IFNsaWRlIFx1MjAxNCBuZXcgc2xpZGUgYWZ0ZXIgdGhlIGN1cnJlbnQgb25lIChkZWNrIG5vdGVzIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jcmVhdGUtbmV4dFwiLFxuICAgIG5hbWU6IFwiQ3JlYXRlIG5leHQgc2xpZGVcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiTlwiIH1dLFxuICAgIC8vIEdyZXllZCBvdXQgdW5sZXNzIHRoZSBhY3RpdmUgbm90ZSBpcyBwYXJ0IG9mIGEgZGVjayBcdTIwMTQgcGxhaW4gbm90ZXNcbiAgICAvLyBzdGFydCBkZWNrcyB3aXRoIFwiQ3JlYXRlIG5ldyBzbGlkZVwiIGluc3RlYWQuXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlIHx8ICFwbHVnaW4uZGVja1NlcnZpY2UuaXNNZW1iZXIoZmlsZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGNvbnN0IHBsYW4gPSBwbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5leHQoZmlsZSk7XG4gICAgICBpZiAoIXBsYW4pIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHZvaWQgcGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXh0KGZpbGUsIHBsYW4pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIENyZWF0ZSBOZXcgU2xpZGUgXHUyMDE0IGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlLiBIaWRkZW4gb24gZGVjayBub3Rlc1xuICAvLyAodGhlIGRlY2sgZ3Jvd3MgdmlhIENyZWF0ZSBOZXh0IFNsaWRlIGluc3RlYWQpOyBzdGlsbCB3b3JrcyBmcm9tIGFcbiAgLy8gYmxhbmsgdGFiIFx1MjAxNCBsYW5kcyBpbiB0aGUgZGVmYXVsdCBuZXctbm90ZSBsb2NhdGlvbi5cbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXdcIixcbiAgICBuYW1lOiBcIkNyZWF0ZSBuZXcgc2xpZGVcIixcbiAgICAvLyBObyBkZWZhdWx0IGhvdGtleTogTW9kK1NoaWZ0K04gYmVsb25ncyB0byBDcmVhdGUgbmV4dCBzbGlkZSBcdTIwMTQgdHdvXG4gICAgLy8gY29tbWFuZHMgc2hhcmluZyBvbmUgZGVmYXVsdCBob3RrZXkgdHJpcHMgT2JzaWRpYW4ncyBjb25mbGljdCBVSS5cbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoZmlsZSAmJiBwbHVnaW4uZGVja1NlcnZpY2UuaXNNZW1iZXIoZmlsZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHZvaWQgcGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXcocGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXcoKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gSW5pdGlhbGl6ZSBzbGlkZXMgd2l0aCB0aGlzIG5vdGUgXHUyMDE0IHByb21vdGUgdGhlIGFjdGl2ZSAocGxhaW4pIG5vdGUgaW50b1xuICAvLyB0aGUgaGVhZCBvZiBhIGJyYW5kLW5ldyBkZWNrOiBpdCBnYWlucyBgZGVjazogW11gIGFuZCBrZWVwcyBpdHNcbiAgLy8gY29udGVudCwgdGl0bGUgYW5kIGxvY2F0aW9uLCB0aGVuIFNsaWRlcyBtb2RlIGF1dG8tZW50ZXJzLiBjaGVja0NhbGxiYWNrXG4gIC8vIHNob3dzIGl0IG9ubHkgb24gbm90ZXMgdGhhdCBhcmUgTk9UIGFscmVhZHkgcGFydCBvZiBhIGRlY2ssIHNvIGl0IG5ldmVyXG4gIC8vIGFwcGVhcnMgb24gZGVjay9zbGlkZXMgbm90ZXMgd2hlcmUgaXQgd291bGQgYmUgbWlzbGVhZGluZy4gQ29udmVyc2lvbiBpc1xuICAvLyBhIHNpbmdsZSBmcm9udG1hdHRlciB3cml0ZSAobm8gY29uZmlybWF0aW9uIGRpYWxvZykuXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1tYWtlLWZpcnN0LXNsaWRlXCIsXG4gICAgbmFtZTogXCJJbml0aWFsaXplIHNsaWRlcyB3aXRoIHRoaXMgbm90ZVwiLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSB8fCBwbHVnaW4uZGVja1NlcnZpY2UuaXNNZW1iZXIoZmlsZSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbnZlcnRlZCA9IGF3YWl0IHBsdWdpbi5kZWNrU2VydmljZS5tYWtlRmlyc3RTbGlkZShmaWxlKTtcbiAgICAgICAgICBpZiAoIWNvbnZlcnRlZCkgcmV0dXJuOyAvLyBkZWZlbnNpdmUgXHUyMDE0IHRoZSBjaGVjayBhYm92ZSBhbHJlYWR5IHBhc3NlZFxuICAgICAgICAgIG5ldyBOb3RpY2UoXCJOYXRpdmUgc2xpZGVzOiBtYWRlIHRoaXMgbm90ZSB0aGUgZmlyc3Qgc2xpZGUgb2YgYSBuZXcgZGVja1wiKTtcbiAgICAgICAgICBhd2FpdCBwbHVnaW4uZW50ZXJTbGlkZXNGb3JBY3RpdmUoKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBDb3B5IGEgb25lLXNjcmVlbiBjYXBhY2l0eSByZXBvcnQgb2YgdGhlIGN1cnJlbnQgU2xpZGVzIGxheW91dFxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY29weS1zbGlkZS1za2lsbFwiLFxuICAgIG5hbWU6IFwiQ29weSBBSSBhZ2VudCBwcm9tcHRcIixcbiAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gY2hlY2tDYWxsYmFjayBpcyBub3QgdXNlZDogaXQgd291bGQgaGlkZSB0aGUgY29tbWFuZCBmcm9tIHRoZVxuICAgICAgLy8gY29tbWFuZCBwYWxldHRlIG91dHNpZGUgU2xpZGVzIG1vZGUgKHBhbGV0dGUgb25seSBzaG93cyBjb21tYW5kc1xuICAgICAgLy8gd2hvc2UgY2hlY2tDYWxsYmFjayByZXR1cm5zIHRydWUpLiBLZWVwIHRoZSBjb21tYW5kIGFsd2F5cyB2aXNpYmxlXG4gICAgICAvLyBhbmQgZXhwbGFpbiB0aGUgcmVxdWlyZWQgbW9kZSB3aGVuIGludm9rZWQgdG9vIGVhcmx5LlxuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkge1xuICAgICAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogZW50ZXIgU2xpZGVzIG1vZGUgZmlyc3QgKE1vZCtTaGlmdCtFIG9uIGEgZGVjayBub3RlKVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXdhaXQgY29weUNhcGFjaXR5UHJvbXB0KHBsdWdpbi5hcHApO1xuICAgIH0sXG4gIH0pO1xuICAvLyBUb2dnbGUgU2xpZGVzIG1vZGUgXHUyMDE0IHRoZSBpbW1lcnNpdmUgY2FyZCB2aWV3IChkZWNrIG5vdGVzIG9ubHkpXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy10b2dnbGUtc2xpZGVzXCIsXG4gICAgbmFtZTogXCJUb2dnbGUgc2xpZGVzIG1vZGVcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiRVwiIH1dLFxuICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZykgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IHBsdWdpbi5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHBsdWdpbi5hcHAsIGZpbGUpO1xuICAgICAgaWYgKGZtID09PSBudWxsIHx8ICEoREVDS19LRVkgaW4gZm0pKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAoIWNoZWNraW5nKSBwbHVnaW4udG9nZ2xlU2xpZGVzKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gRGVidWcgdG9vbGluZyBcdTIwMTQgcmVnaXN0ZXJlZCBvbmx5IGluIGRldiBidWlsZHMgKHRyZWUtc2hha2VuIGluIHJlbGVhc2UpXG4gIGlmIChERVZfTU9ERSkgcmVnaXN0ZXJEZWJ1Z0NvbW1hbmQocGx1Z2luKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7XG4gIHBsYW5DcmVhdGVOZXcgYXMgcGxhbk5ldyxcbiAgcGxhbkNyZWF0ZU5leHQgYXMgcGxhbixcbiAgcGxhbk1ha2VGaXJzdFNsaWRlIGFzIHBsYW5GaXJzdCxcbiAgdHlwZSBDcmVhdGVOZXh0UmVzdWx0LFxufSBmcm9tIFwiLi9jcmVhdGVOZXh0XCI7XG5pbXBvcnQgeyBjb21wdXRlRGVjaywgZXh0cmFjdExpbmtzLCBleHRyYWN0UmF3TGlua3MsIHR5cGUgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5pbXBvcnQgeyBwaWNrTGFuZGluZ1BhdGgsIHBsYW5EZWxldGVTbGlkZXMgfSBmcm9tIFwiLi9kZWxldGVTbGlkZXNcIjtcbmltcG9ydCB7IGZyb250bWF0dGVyT2YgfSBmcm9tIFwiLi9tb2RlXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZXN1bHQgb2YgYSBEZWxldGUgc2xpZGVzIHJ1biAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWxldGVTbGlkZXNSZXN1bHQge1xuICAvKiogUGF0aHMgYWN0dWFsbHkgbW92ZWQgdG8gdGhlIHRyYXNoICovXG4gIHRyYXNoZWQ6IHN0cmluZ1tdO1xuICAvKiogV2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlcndhcmRzIChudWxsID0ga2VlcCBjdXJyZW50IG5vdGUpICovXG4gIGxhbmRpbmdQYXRoOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIGdsdWUgKHdyYXBzIHRoZSBwdXJlIGNvcmUpLiAqL1xuZXhwb3J0IGNsYXNzIERlY2tTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbm90ZSBiZWxvbmdzIHRvIGEgZGVjazogaXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW5cbiAgICogZW1wdHkgXHUyMDE0IGEgZnJlc2ggc2luZ2xlIHNsaWRlKSBvciBzb21lIG90aGVyIHNsaWRlIGRlY2xhcmVzIGl0IGFzIGl0c1xuICAgKiBuZXh0IHNsaWRlLlxuICAgKi9cbiAgaXNNZW1iZXIoZmlsZTogVEZpbGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiAoZm0gIT09IG51bGwgJiYgREVDS19LRVkgaW4gZm0pIHx8IHRoaXMucHJldk9mKGZpbGUucGF0aCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBjdXJyZW50IG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgaXRzIGRlY2sgKG51bGwgd2hlbiBub3QgYSBtZW1iZXIpICovXG4gIGNvbXB1dGUoZmlsZTogVEZpbGUpOiBEZWNrSW5mbyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc01lbWJlcihmaWxlKSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGNvbXB1dGVEZWNrKFxuICAgICAgZmlsZS5wYXRoLFxuICAgICAgKHBhdGgpID0+IHRoaXMubGlua1BhdGhzKHBhdGgpLFxuICAgICAgKHBhdGgpID0+IHRoaXMucHJldk9mKHBhdGgpLFxuICAgICk7XG4gIH1cblxuICAvKiogUmVzb2x2ZWQgbmV4dC1zbGlkZSBwYXRocyBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKFtdIHdoZW4gbm9uZSwgb3IgdGhlIGxpbmsgaXMgYnJva2VuKSAqL1xuICBuZXh0TGlua3MocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmxpbmtQYXRocyhwYXRoKTtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgYSBub3RlIGludG8gcmVhbCBub3RlIHBhdGhzIChtYXggb25lKSAqL1xuICBwcml2YXRlIGxpbmtQYXRocyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gW107XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXNcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KTogeCBpcyBURmlsZSA9PiAhIXgpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh0aGUgcHJldmlvdXMgc2xpZGUgaW5cbiAgICogdGhlIGNoYWluKS4gV2l0aCBuZXh0LW9ubHkgc2VtYW50aWNzIHRoaXMgYmFja3dhcmQgbG9va3VwIGlzIHRoZSBvbmx5XG4gICAqIHdheSB0byByZWFjaCB0aGUgY2hhaW4gaGVhZCBmcm9tIGEgbWlkZGxlL2xhc3Qgc2xpZGUuXG4gICAqL1xuICBwcml2YXRlIHByZXZPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLnBhdGggPT09IHBhdGgpIGNvbnRpbnVlO1xuICAgICAgaWYgKHRoaXMubGlua1BhdGhzKGYucGF0aClbMF0gPT09IHBhdGgpIHJldHVybiBmLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogTmFtZXMgaW4gdGhlIGBkZWNrYCBwcm9wZXJ0eSB0aGF0IHJlc29sdmUgdG8gbm8gbm90ZSAoYnJva2VuIGxpbmtzKSAqL1xuICBicm9rZW4oZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBmaWxlLnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIHJ1biBmb3IgdGhlIGFjdGl2ZSBub3RlLiBEZWNrIHNsaWRlc1xuICAgKiBpbnNlcnQvYXBwZW5kIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuIChQbGFpbiBub3RlcyBhcmUgcm91dGVkIHRvXG4gICAqIHBsYW5DcmVhdGVOZXcgYnkgdGhlIGNvbW1hbmQgXHUyMDE0IHRoaXMgY29yZSBzdGlsbCBoYW5kbGVzIHRoZW0gYXNcbiAgICogXCJubyB1c2FibGUgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmRcIi4pXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV4dChmaWxlOiBURmlsZSk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IHJhdyA9IGZtID8gZXh0cmFjdFJhd0xpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICBjb25zdCBleGlzdGluZ05hbWVzID0gbmV3IFNldCh0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkubWFwKChmKSA9PiBmLmJhc2VuYW1lKSk7XG4gICAgcmV0dXJuIHBsYW4oeyBjdXJyZW50TmFtZTogZmlsZS5iYXNlbmFtZSwgY3VycmVudExpbmtzOiByYXcsIGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHJ1bjogYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgaW4gdGhlXG4gICAqIHNhbWUgZm9sZGVyIGFzIHRoZSBhY3RpdmUgbm90ZSwgd2hpY2ggaXRzZWxmIHN0YXlzIHVudG91Y2hlZC5cbiAgICovXG4gIHBsYW5DcmVhdGVOZXcoKTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuTmV3KHsgZXhpc3RpbmdOYW1lcyB9KTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIENyZWF0ZSBOZXh0IFNsaWRlIHBsYW47IG9wZW49ZmFsc2Uga2VlcHMgdGhlIGN1cnJlbnQgbm90ZSBpbiB0aGUgZWRpdG9yICovXG4gIGFzeW5jIGV4ZWN1dGVDcmVhdGVOZXh0KGZpbGU6IFRGaWxlLCBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LCBvcGVuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKGZpbGUsIHBsYW4sIGRpclByZWZpeChmaWxlLnBhcmVudD8ucGF0aCksIG9wZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgQ3JlYXRlIE5ldyBTbGlkZSBwbGFuLiBMYW5kcyBpbiBPYnNpZGlhbidzIGRlZmF1bHQgbmV3LW5vdGVcbiAgICogbG9jYXRpb24gKFNldHRpbmdzIFx1MjE5MiBGaWxlcyAmIGxpbmtzIFx1MjE5MiBEZWZhdWx0IGxvY2F0aW9uIGZvciBuZXcgbm90ZXMpO1xuICAgKiB3aXRoIFwic2FtZSBmb2xkZXIgYXMgY3VycmVudFwiIGNvbmZpZ3VyZWQgdGhhdCBpcyB0aGUgYWN0aXZlIG5vdGUncyBvd25cbiAgICogZm9sZGVyLiBXb3JrcyB3aXRoIG5vIG5vdGUgb3BlbiBhdCBhbGwgKGJsYW5rIHRhYikuXG4gICAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV3KHBsYW46IENyZWF0ZU5leHRSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBcIlwiO1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKFxuICAgICAgbnVsbCxcbiAgICAgIHBsYW4sXG4gICAgICBkaXJQcmVmaXgodGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChzb3VyY2VQYXRoKT8ucGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9tb3RlIHRoZSBhY3RpdmUgbm90ZSBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGFkZCBgZGVjazogW11gXG4gICAqIHRvIGl0cyBmcm9udG1hdHRlciBcdTIwMTQgY29udGVudCwgdGl0bGUsIGxvY2F0aW9uIGFuZCBldmVyeSBvdGhlciBwcm9wZXJ0eVxuICAgKiBzdGF5IHVudG91Y2hlZC4gTm90ZXMgdGhhdCBhbHJlYWR5IGJlbG9uZyB0byBhIGRlY2sgYXJlIGxlZnQgYWxvbmUuXG4gICAqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBub3RlIHdhcyBjb252ZXJ0ZWQgKHRoZSBjYWxsZXIgbWF5IHRoZW4gYXV0by1lbnRlclxuICAgKiBTbGlkZXMgbW9kZSksIGZhbHNlIHdoZW4gaXQgd2FzIGFscmVhZHkgYSBkZWNrIG1lbWJlci5cbiAgICovXG4gIGFzeW5jIG1ha2VGaXJzdFNsaWRlKGZpbGU6IFRGaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKHBsYW5GaXJzdCh7IGFscmVhZHlEZWNrOiB0aGlzLmlzTWVtYmVyKGZpbGUpIH0pID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKGZpbGUsIChmbTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgIGZtW0RFQ0tfS0VZXSA9IFtdO1xuICAgIH0pO1xuICAgIC8vIE9ic2lkaWFuIGluZGV4ZXMgYSBzYXZlZCBmaWxlIGFzeW5jaHJvbm91c2x5OyB0aGUgY29tbWFuZCdzIGF1dG8tZW50ZXJcbiAgICAvLyByZWFkcyB0aGUgY2FjaGUsIHNvIGhhbmQgYmFjayBvbmx5IG9uY2UgdGhlIG5ldyBgZGVja2AgaXMgdmlzaWJsZS5cbiAgICBhd2FpdCB0aGlzLndhaXRGb3JDYWNoZWREZWNrKGZpbGUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhaXQgdW50aWwgdGhlIG1ldGFkYXRhIGNhY2hlIHJlZmxlY3RzIHRoZSBub3RlJ3MgYGRlY2tgIHByb3BlcnR5XG4gICAqIChiZXN0IGVmZm9ydCBcdTIwMTQgcmVzb2x2ZXMgb24gdGhlIHByb3BlcnR5IGFwcGVhcmluZywgb3IgYWZ0ZXIgYHRpbWVvdXRNc2ApLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyB3YWl0Rm9yQ2FjaGVkRGVjayhmaWxlOiBURmlsZSwgdGltZW91dE1zID0gMjAwMCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmhhc0RlY2tJbkNhY2hlKGZpbGUpKSByZXR1cm47XG4gICAgYXdhaXQgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChjaGFuZ2VkOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoY2hhbmdlZC5wYXRoID09PSBmaWxlLnBhdGggJiYgdGhpcy5oYXNEZWNrSW5DYWNoZShmaWxlKSkge1xuICAgICAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub2ZmcmVmKHJlZik7XG4gICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9mZnJlZihyZWYpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCB0aW1lb3V0TXMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1ldGFkYXRhIGNhY2hlIGFscmVhZHkgc2hvd3MgYSBgZGVja2AgcHJvcGVydHkgb24gdGhlIG5vdGUgKi9cbiAgcHJpdmF0ZSBoYXNEZWNrSW5DYWNoZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIGZtICE9PSBudWxsICYmIERFQ0tfS0VZIGluIGZtO1xuICB9XG5cbiAgLyoqIEFwcGx5IGEgcGxhbjogY3JlYXRlIHRoZSBub3RlLCByZXdpcmUgYGRlY2tgIHByb3BlcnRpZXMsIG9wdGlvbmFsbHkgb3BlbiBpdCAqL1xuICBwcml2YXRlIGFzeW5jIGFwcGx5UGxhbihcbiAgICBmaWxlOiBURmlsZSB8IG51bGwsXG4gICAgcGxhbjogQ3JlYXRlTmV4dFJlc3VsdCxcbiAgICBkaXI6IHN0cmluZyxcbiAgICBvcGVuID0gdHJ1ZSxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IGAke2Rpcn0ke3BsYW4ubmV3TmFtZX0ubWRgO1xuICAgIGNvbnN0IGZyb250bWF0dGVyID0gcGxhbi5uZXdEZWNrTGlua3MubWFwKChsaW5rKSA9PiBKU09OLnN0cmluZ2lmeShsaW5rKSkuam9pbihcIiwgXCIpO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBgLS0tXFxuZGVjazogWyR7ZnJvbnRtYXR0ZXJ9XVxcbi0tLVxcbmA7XG5cbiAgICBsZXQgbmV3RmlsZTogVEZpbGU7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0ZpbGUgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUobmV3UGF0aCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBjcmVhdGUgXCIke3BsYW4ubmV3TmFtZX0ubWRcIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZXdpcmUgdGhlIGN1cnJlbnQgbm90ZSdzIGBkZWNrYCAoa2VlcHMgYWxsIG90aGVyIHByb3BlcnRpZXMgaW50YWN0KVxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiBwbGFuLnJld3JpdGVzKSB7XG4gICAgICBpZiAoIWZpbGUgfHwgcmV3cml0ZS5uYW1lICE9PSBmaWxlLmJhc2VuYW1lKSBjb250aW51ZTsgLy8gaW4gcHJhY3RpY2UgYWx3YXlzIHRoZSBjdXJyZW50IG5vdGVcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmaWxlLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IHJld3JpdGUuZGVjaztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghb3BlbikgcmV0dXJuO1xuXG4gICAgLy8gT3BlbiB0aGUgbmV3IG5vdGUgaW4gdGhlIGN1cnJlbnQgcGFuZSwgZWRpdCBtb2RlIChMaXZlIFByZXZpZXcpXG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5ld0ZpbGUsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSBzbGlkZXMgb3V0IG9mIGFuIG9yZGVyZWQgZGVjayBjaGFpbjogc3BsaWNlIHRoZSBjaGFpbiBhcm91bmRcbiAgICogZXZlcnkgZGVsZXRlZCBydW4gKHRoZSBwcmVkZWNlc3NvcidzIGBkZWNrYCB0YWtlcyBvdmVyIHRoZSBydW4ncyBmaXJzdFxuICAgKiBzdXJ2aXZvciksIHRoZW4gbW92ZSBlYWNoIGRlbGV0ZWQgbm90ZSB0byB0aGUgdHJhc2guIGBmb2N1c1BhdGhgIGlzIHRoZVxuICAgKiBub3RlIHRoZSBlZGl0b3IgY3VycmVudGx5IHNob3dzIFx1MjAxNCB3aGVuIGl0IGlzIGFtb25nIHRoZSBkZWxldGVkLCB0aGVcbiAgICogcmVzdWx0IG5hbWVzIHRoZSBuZWFyZXN0IHN1cnZpdmluZyBuZWlnaGJvdXIgdG8gb3BlbiBpbnN0ZWFkLlxuICAgKi9cbiAgYXN5bmMgZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICBjaGFpbjogc3RyaW5nW10sXG4gICAgZGVsZXRlUGF0aHM6IFJlYWRvbmx5U2V0PHN0cmluZz4sXG4gICAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuICApOiBQcm9taXNlPERlbGV0ZVNsaWRlc1Jlc3VsdD4ge1xuICAgIGNvbnN0IHJld3JpdGVzID0gcGxhbkRlbGV0ZVNsaWRlcyhjaGFpbiwgZGVsZXRlUGF0aHMpO1xuXG4gICAgZm9yIChjb25zdCByZXdyaXRlIG9mIHJld3JpdGVzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUucGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IG5leHQgPSByZXdyaXRlLm5leHRQYXRoID8gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJld3JpdGUubmV4dFBhdGgpIDogbnVsbDtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcihmLCAoZm06IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgICAgIGZtW0RFQ0tfS0VZXSA9IG5leHQgaW5zdGFuY2VvZiBURmlsZSA/IFtgW1ske25leHQuYmFzZW5hbWV9XV1gXSA6IFtdO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhc2hlZDogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgZGVsZXRlUGF0aHMpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnRyYXNoRmlsZShmKTtcbiAgICAgICAgdHJhc2hlZC5wdXNoKHBhdGgpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IGRlbGV0ZSBcIiR7Zi5iYXNlbmFtZX1cIiAoJHtTdHJpbmcoZXJyb3IpfSlgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0cmFzaGVkLCBsYW5kaW5nUGF0aDogcGlja0xhbmRpbmdQYXRoKGNoYWluLCBkZWxldGVQYXRocywgZm9jdXNQYXRoKSB9O1xuICB9XG59XG5cbi8qKiBGb2xkZXIgcGF0aCBcdTIxOTIgdHJhaWxpbmctc2xhc2ggcHJlZml4IChcIlwiIGZvciB2YXVsdCByb290KSAqL1xuZnVuY3Rpb24gZGlyUHJlZml4KHBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghcGF0aCB8fCBwYXRoID09PSBcIi9cIikgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBgJHtwYXRoLnJlcGxhY2UoL1xcLyskLywgXCJcIil9L2A7XG59XG4iLCAiLyoqXG4gKiBkZWNrLnRzIFx1MjAxNCBQdXJlIGRlY2stcmVzb2x1dGlvbiBjb3JlIGZvciBuYXRpdmUtc2xpZGVzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBtb2R1bGUgaXMgZnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdFxuICogY2FuIGJlIHVuaXQgdGVzdGVkIGRpcmVjdGx5IChzZWUgdGVzdC9kZWNrLnRlc3QudHMpLiBtYWluLnRzIGFkYXB0cyB0aGVcbiAqIHZhdWx0IChtZXRhZGF0YUNhY2hlKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlOiBpdCByZXNvbHZlcyBgZGVja2BcbiAqIHByb3BlcnRpZXMgdG8gbm90ZSBwYXRocywgdGhlbiBoYW5kcyB0aGUgcGF0aCBncmFwaCB0byBjb21wdXRlRGVjaygpLlxuICovXG5cbi8qKiBBIGRlY2sgbGluayBsaXN0IGhvbGRzIGF0IG1vc3Qgb25lIGVudHJ5ICh0aGUgbmV4dCBzbGlkZSkgKi9cbmV4cG9ydCBjb25zdCBNQVhfREVDS19MSU5LUyA9IDE7XG5cbi8qKiBSZXN1bHQgb2YgcmVzb2x2aW5nIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBhIGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja0luZm8ge1xuICAvKiogQ2hhaW4gb2Ygbm90ZSBwYXRoczogWzBdIGlzIHRoZSBmaXJzdCBzbGlkZSwgdGhlbiB0aGUgcmVzdCBpbiBvcmRlciAqL1xuICBjaGFpbjogc3RyaW5nW107XG4gIC8qKiBJbmRleCBvZiB0aGUgY3VycmVudCBub3RlIGluc2lkZSBjaGFpbiAqL1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlc29sdmUgYSBub3RlJ3MgcG9zaXRpb24gaW5zaWRlIGl0cyBkZWNrLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6XG4gKiAgIC0gYSBzbGlkZSdzIGBkZWNrYCBwcm9wZXJ0eSBob2xkcyBhdCBtb3N0IE9ORSBsaW5rOiB0aGUgbmV4dCBzbGlkZVxuICogICAgICh0aGUgbGFzdCBzbGlkZSBoYXMgbm8gbGluayBhdCBhbGwpO1xuICogICAtIGEgZGVjayBpcyBzaW1wbHkgYSBmb3J3YXJkIGxpbmsgY2hhaW4gc3RhcnRpbmcgYXQgaXRzIGhlYWQgc2xpZGU7XG4gKiAgIC0gYW55IG5vdGUgdGhhdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlbiBlbXB0eSkgaXMgYSBkZWNrIG1lbWJlcixcbiAqICAgICBzbyBhIHNpbmdsZSBmcmVzaGx5IGNyZWF0ZWQgc2xpZGUgYWxyZWFkeSBjb3VudHMgYXMgYSBvbmUtcGFnZSBkZWNrLlxuICpcbiAqIEJlY2F1c2Ugc2xpZGVzIG5vIGxvbmdlciBsaW5rIGJhY2sgdG8gYSBoZWFkIG5vdGUsIHRoZSBjaGFpbiBoZWFkIGlzXG4gKiBsb2NhdGVkIGJ5IHdhbGtpbmcgYmFja3dhcmQ6IGBnZXRQcmV2KHBhdGgpYCByZXR1cm5zIHRoZSBub3RlIHdob3NlXG4gKiBgZGVja2AgcHJvcGVydHkgcG9pbnRzIGF0IGBwYXRoYCAodW5kZWZpbmVkIHdoZW4gbm9uZSkuXG4gKlxuICogYGdldExpbmtzKHBhdGgpYCBtdXN0IHJldHVybiB0aGUgcmVzb2x2ZWQgbm90ZSBwYXRocyBvZiB0aGUgYGRlY2tgXG4gKiBwcm9wZXJ0eSBvZiB0aGUgbm90ZSBhdCBgcGF0aGAgKGVtcHR5IHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUsIG9yIGl0c1xuICogbGluayBpcyBicm9rZW4gXHUyMDE0IGEgYnJva2VuIGxpbmsgc2ltcGx5IGVuZHMgdGhlIGNoYWluLCBuZXZlciBjcmFzaGVzKS5cbiAqXG4gKiBSZXR1cm5zIHRoZSBmdWxsIGNoYWluIGFuZCB0aGUgY3VycmVudCBub3RlJ3MgaW5kZXgsIG9yIG51bGwgd2hlbiB0aGVcbiAqIG5vdGUgaXMgbm90IHBhcnQgb2YgYW55IGRlY2sgKG5vIGBkZWNrYCBwcm9wZXJ0eSBhbmQgbm9ib2R5IGxpbmtzIHRvIGl0KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVEZWNrKFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuICBnZXRMaW5rczogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW10sXG4gIGdldFByZXY6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIC8vIFdhbGsgYmFja3dhcmQgdG8gdGhlIGNoYWluIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLiBBIGxvbmUgbm9kZSAobm8gb3duXG4gIC8vIGxpbmssIG5vIHByZWRlY2Vzc29yKSByZXNvbHZlcyBhcyBhIG9uZS1wYWdlIGNoYWluIFx1MjAxNCB3aGV0aGVyIGl0IGNvdW50c1xuICAvLyBhcyBhIGRlY2sgbWVtYmVyIGF0IGFsbCBpcyBkZWNpZGVkIGJ5IHRoZSBhZGFwdGVyICh0aGUgYGRlY2tgIGtleSkuXG4gIGNvbnN0IGJhY2tWaXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KFtjdXJyZW50UGF0aF0pO1xuICBsZXQgaGVhZCA9IGN1cnJlbnRQYXRoO1xuICBmb3IgKDs7KSB7XG4gICAgY29uc3QgcHJldiA9IGdldFByZXYoaGVhZCk7XG4gICAgaWYgKCFwcmV2IHx8IGJhY2tWaXNpdGVkLmhhcyhwcmV2KSkgYnJlYWs7XG4gICAgYmFja1Zpc2l0ZWQuYWRkKHByZXYpO1xuICAgIGhlYWQgPSBwcmV2O1xuICB9XG5cbiAgLy8gV2FsayBmb3J3YXJkIGZyb20gdGhlIGhlYWQgKGN5Y2xlLWd1YXJkZWQpLlxuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgY3VyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBoZWFkO1xuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyKTtcbiAgICBjaGFpbi5wdXNoKGN1cik7XG4gICAgY3VyID0gZ2V0TGlua3MoY3VyKVswXTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBXYWxrIHRoZSBjaGFpbiBmb3J3YXJkIGZyb20gYSBrbm93biBoZWFkIGFuZCBsb2NhdGUgYGN1cnJlbnRQYXRoYCBpbiBpdC5cbiAqXG4gKiBgY29tcHV0ZURlY2soKWAgZmluZHMgdGhlIGhlYWQgaXRzZWxmLCB3aGljaCBpcyBhbWJpZ3VvdXMgd2hlbiBzZXZlcmFsIHNsaWRlc1xuICogZGVjbGFyZSB0aGUgc2FtZSBuZXh0IHNsaWRlOyB0YWtpbmcgdGhlIGhlYWQgYXMgZ2l2ZW4gaXMgd2hhdCBsZXRzIGFcbiAqIG5hdmlnYXRpb24gc2Vzc2lvbiBrZWVwIHRoZSBjaGFpbiBpdCBlbnRlcmVkLiBUaGUgd2FsayBpcyBhbHdheXMgbGl2ZSBcdTIwMTQgdGhlXG4gKiBsaW5rcyBjb21lIGZyb20gdGhlIHZhdWx0IG9uIGV2ZXJ5IGNhbGwgXHUyMDE0IHNvIHNsaWRlcyBjcmVhdGVkLCBkZWxldGVkIG9yXG4gKiByZW5hbWVkIG1lYW53aGlsZSBhcmUgcmVmbGVjdGVkLCBhbmQgYSBoZWFkIHRoYXQgbm8gbG9uZ2VyIHJlYWNoZXNcbiAqIGBjdXJyZW50UGF0aGAgc2ltcGx5IHlpZWxkcyBudWxsICh0aGUgY2FsbGVyIGZhbGxzIGJhY2sgdG8gYGNvbXB1dGVEZWNrKClgKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY2tGcm9tSGVhZChcbiAgaGVhZDogc3RyaW5nLFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuICBnZXRMaW5rczogKHBhdGg6IHN0cmluZykgPT4gc3RyaW5nW10sXG4pOiBEZWNrSW5mbyB8IG51bGwge1xuICBjb25zdCBjaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBsZXQgY3VyOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBoZWFkO1xuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyKTtcbiAgICBjaGFpbi5wdXNoKGN1cik7XG4gICAgY3VyID0gZ2V0TGlua3MoY3VyKVswXTtcbiAgfVxuXG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihjdXJyZW50UGF0aCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiBudWxsO1xuICByZXR1cm4geyBjaGFpbiwgaW5kZXggfTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIG5vdGUgbmFtZXMgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEFjY2VwdHMgYSBzaW5nbGUgc3RyaW5nIG9yIGEgWUFNTCBsaXN0IG9mIHN0cmluZ3M7IHVucXVvdGVkIFtbeF1dIHZhbHVlc1xuICogYXJlIHBhcnNlZCBieSBZQU1MIGFzIG5lc3RlZCBhcnJheXMgYW5kIGZsYXR0ZW5lZCBoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdExpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgY29uc3QgbmFtZSA9IGV4dHJhY3RMaW5rVGV4dChpdGVtKTtcbiAgICBpZiAobmFtZSkgb3V0LnB1c2gobmFtZSk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdXAgdG8gYG1heGAgcmF3IGxpbmsgc3RyaW5ncyBmcm9tIGEgYGRlY2tgIHByb3BlcnR5IHZhbHVlIFx1MjAxNCB0aGVcbiAqIHRyaW1tZWQgdmFsdWVzIGV4YWN0bHkgYXMgd3JpdHRlbiAoYWxpYXMgLyBwYXRoIGZvcm1zIHByZXNlcnZlZCkuIFNhbWVcbiAqIGZsYXR0ZW5pbmcgcnVsZXMgYXMgZXh0cmFjdExpbmtzKCksIGJ1dCB3aXRob3V0IGV4dHJhY3RpbmcgdGhlIHRhcmdldCBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFJhd0xpbmtzKHZhbHVlOiB1bmtub3duLCBtYXg6IG51bWJlciA9IE1BWF9ERUNLX0xJTktTKTogc3RyaW5nW10ge1xuICBjb25zdCBmbGF0OiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgY29sbGVjdCA9ICh2OiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB2KSBjb2xsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGF0LnB1c2godik7XG4gICAgfVxuICB9O1xuICBjb2xsZWN0KHZhbHVlKTtcblxuICBjb25zdCBvdXQ6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBmbGF0KSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSBcInN0cmluZ1wiKSBjb250aW51ZTtcbiAgICBjb25zdCB0cmltbWVkID0gaXRlbS50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSBjb250aW51ZTtcbiAgICBvdXQucHVzaCh0cmltbWVkKTtcbiAgICBpZiAob3V0Lmxlbmd0aCA+PSBtYXgpIGJyZWFrO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgdGFyZ2V0IG5vdGUgbmFtZSBmcm9tIGEgbWFya2Rvd24gbGluayBzdHJpbmcuXG4gKiBIYW5kbGVzIHNldmVyYWwgc2hhcGVzOlxuICogICBcIltbc2xpZGUtMl1dXCIgICAgICAgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yfGFsaWFzXV1cIiAgXHUyMTkyIHNsaWRlLTJcbiAqICAgXCJbW3NsaWRlLTIjc2VjdGlvbl1dXCJcdTIxOTIgc2xpZGUtMlxuICogICBzbGlkZS0yICAgICAgICAgICAgICBcdTIxOTIgc2xpZGUtMiAoYmFyZSBmaWxlbmFtZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rVGV4dCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB8IG51bGwge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKTtcbiAgaWYgKCF0cmltbWVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHRyaW1tZWQucmVwbGFjZSgvXlxcW1xcWy8sIFwiXCIpLnJlcGxhY2UoL1xcXVxcXSQvLCBcIlwiKS5zcGxpdChcInxcIilbMF0uc3BsaXQoXCIjXCIpWzBdLnRyaW0oKTtcbn1cblxuLyoqIFJlbmRlciBhIHByb3BlcnR5IHZhbHVlIGFzIHJlYWRhYmxlIHRleHQ6IGFycmF5cy9vYmplY3RzIFx1MjE5MiBKU09OLCBlbHNlIFN0cmluZyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBcIlx1MjAxNFwiO1xuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpID8/IFwiXHUyMDE0XCI7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gY2lyY3VsYXIgLyB1bi1zdHJpbmdpZmlhYmxlIHN0cnVjdHVyZSBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgICAgcmV0dXJuIFwiXHUyMDE0XCI7XG4gICAgICB9XG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIHN5bWJvbCAvIGZ1bmN0aW9uIFx1MjAxNCBub3QgZXhwZWN0ZWQgZnJvbSBmcm9udG1hdHRlclxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogY3JlYXRlTmV4dC50cyBcdTIwMTQgUHVyZSBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgLyBcIkNyZWF0ZSBOZXcgU2xpZGVcIiBwbGFubmluZ1xuICogY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvY3JlYXRlTmV4dC50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHNcbiAqIHRoZSB2YXVsdCAobWV0YWRhdGFDYWNoZSwgY29tcHV0ZURlY2spIHRvIHRoaXMgcHVyZSBpbnRlcmZhY2UgYW5kIGFwcGxpZXNcbiAqIHRoZSByZXN1bHRpbmcgcGxhbiB3aXRoIHZhdWx0LmNyZWF0ZSgpICsgZmlsZU1hbmFnZXIucHJvY2Vzc0Zyb250TWF0dGVyKCkuXG4gKlxuICogdjEuMC4wIGNvbnZlbnRpb24gXHUyMDE0IG5leHQtb25seSwgbm8gb3ZlcnZpZXcgcGFnZTogYSBzbGlkZSdzIGBkZWNrYFxuICogcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluayAoaXRzIG5leHQgc2xpZGUpLiBwbGFuQ3JlYXRlTmV4dCBkZWNpZGVzLFxuICogZm9yIHRoZSBjdXJyZW50IGRlY2sgbm90ZTpcbiAqICAgLSB0aGUgbmFtZSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKGNvbGxpc2lvbi1hd2FyZSksXG4gKiAgIC0gdGhlIHJhdyBgZGVja2AgbGluayB0ZXh0cyBvZiB0aGUgbmV3IG5vdGUsXG4gKiAgIC0gdGhlIHJld3JpdGVzIG5lZWRlZCBvbiBleGlzdGluZyBub3RlcyAoaW4gcHJhY3RpY2UgYWx3YXlzIHRoZVxuICogICAgIGN1cnJlbnQgbm90ZSkuXG4gKiBwbGFuQ3JlYXRlTmV3IHBsYW5zIGEgYnJhbmQtbmV3IGRlY2sncyBmaXJzdCBwYWdlIChhIGZyZXNoIG5vdGUgdGhhdCBpc1xuICogbm90IHBhcnQgb2YgYW55IGRlY2sgeWV0IFx1MjAxNCBgZGVjazogW11gLCBubyByZXdyaXRlcyBhbnl3aGVyZSkuXG4gKiBwbGFuTWFrZUZpcnN0U2xpZGUgcGxhbnMgdGhlIGludmVyc2U6IHByb21vdGluZyBhbiBleGlzdGluZyBwbGFpbiBub3RlXG4gKiBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2sgKGBkZWNrOiBbXWAgd3JpdHRlbiBvbnRvIHRoZSBub3RlXG4gKiBpdHNlbGYsIG5vdGhpbmcgY3JlYXRlZCBvciByZXdyaXR0ZW4pLlxuICovXG5cbmltcG9ydCB7IGV4dHJhY3RMaW5rVGV4dCB9IGZyb20gXCIuL2RlY2tcIjtcblxuLyoqIElucHV0cyBmb3IgcGxhbm5pbmcgXHUyMDE0IHJlc29sdmVkIGJ5IHRoZSBhZGFwdGVyIGluIG1haW4udHMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dElucHV0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIGN1cnJlbnQgbm90ZSAqL1xuICBjdXJyZW50TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBjdXJyZW50IG5vdGUgKGV4dHJhY3RlZCwgYXQgbW9zdCBvbmUpICovXG4gIGN1cnJlbnRMaW5rczogc3RyaW5nW107XG4gIC8qKiBCYXNlbmFtZXMgb2YgZXZlcnkgbWFya2Rvd24gbm90ZSBpbiB0aGUgdmF1bHQgKGNvbGxpc2lvbi1mcmVlIG5hbWluZykgKi9cbiAgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz47XG59XG5cbi8qKiBPbmUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja1Jld3JpdGUge1xuICAvKiogQmFzZW5hbWUgb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IHJhdyBgZGVja2AgbGluayB0ZXh0cyAoc2VyaWFsaXplZCBhcyBhIFlBTUwgbGlzdCkgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKiBUaGUgZnVsbCBwbGFuIGZvciBjcmVhdGluZyBvbmUgbmV3IHNsaWRlICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRSZXN1bHQge1xuICAvKiogQmFzZW5hbWUgKHdpdGhvdXQgZXh0ZW5zaW9uKSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKi9cbiAgbmV3TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIGZvciB0aGUgbmV3IG5vdGUncyBmcm9udG1hdHRlciAqL1xuICBuZXdEZWNrTGlua3M6IHN0cmluZ1tdO1xuICAvKiogUmV3cml0ZXMgdG8gYXBwbHkgdG8gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlKSAqL1xuICByZXdyaXRlczogRGVja1Jld3JpdGVbXTtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBub3RlLlxuICpcbiAqIEJlaGF2aW9yczpcbiAqICAgLSBObyBuZXh0IGxpbmsgKGxhc3Qgc2xpZGUsIGZyZXNoIGRlY2sgaGVhZCwgb3IgYSBwbGFpbiBub3RlIHN0YXJ0aW5nXG4gKiAgICAgYSBicmFuZC1uZXcgZGVjayk6IGFwcGVuZCBgPGN1cnJlbnQ+LW5leHRgIGFzIHRoZSBuZXcgbGFzdCBzbGlkZTsgdGhlXG4gKiAgICAgY3VycmVudCBub3RlJ3MgYGRlY2tgIGdhaW5zIHRoZSBsaW5rIHRvIGl0LlxuICogICAtIFZhbGlkIG5leHQgbGluazogaW5zZXJ0IGA8Y3VycmVudD4tbmV4dGAgYmV0d2VlbiB0aGUgY3VycmVudCBub3RlIGFuZFxuICogICAgIGl0cyBuZXh0OyB0aGUgbmV3IG5vdGUgdGFrZXMgb3ZlciB0aGUgb2xkIG5leHQgbGluay5cbiAqICAgLSBCcm9rZW4gbmV4dCBsaW5rIChwbGFpbiwgbm9uLWV4aXN0aW5nIG5hbWUpOiBjcmVhdGUgZXhhY3RseSB0aGVcbiAqICAgICBkZWNsYXJlZCBtaXNzaW5nIG5vdGUgYXMgdGhlIG5ldyBuZXh0IHNsaWRlIFx1MjAxNCB0aGUgXHUyNkEwIHdhcm5pbmdcbiAqICAgICBkaXNhcHBlYXJzIGFuZCB0aGUgYXV0aG9yJ3MgaW50ZW50IGlzIGhvbm91cmVkLiBBIGJyb2tlbiBsaW5rIHRoYXQgaXNcbiAqICAgICBub3QgYSBwbGFpbiBiYXNlbmFtZSAocGF0aC1xdWFsaWZpZWQsIHNlbGYtcmVmZXJlbmNpbmcpIGlzIHRyZWF0ZWQgYXNcbiAqICAgICBpbnZhbGlkIGFuZCBkcm9wcGVkIChhcHBlbmQgYSBgPGN1cnJlbnQ+LW5leHRgIGxhc3Qgc2xpZGUgaW5zdGVhZCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuQ3JlYXRlTmV4dChpbnB1dDogQ3JlYXRlTmV4dElucHV0KTogQ3JlYXRlTmV4dFJlc3VsdCB8IG51bGwge1xuICBjb25zdCB7IGN1cnJlbnROYW1lLCBjdXJyZW50TGlua3MgfSA9IGlucHV0O1xuICBjb25zdCBuZXh0TGluayA9IGN1cnJlbnRMaW5rc1swXTtcblxuICBpZiAobmV4dExpbmspIHtcbiAgICBjb25zdCBuZXh0TmFtZSA9IGV4dHJhY3RMaW5rVGV4dChuZXh0TGluayk7XG4gICAgaWYgKG5leHROYW1lICYmIGlzUGxhaW5OYW1lKG5leHROYW1lKSAmJiBuZXh0TmFtZSAhPT0gY3VycmVudE5hbWUpIHtcbiAgICAgIGlmICghaW5wdXQuZXhpc3RpbmdOYW1lcy5oYXMobmV4dE5hbWUpKSB7XG4gICAgICAgIC8vIFRoZSBkZWNsYXJlZCBuZXh0IG5vdGUgZG9lcyBub3QgZXhpc3QgeWV0IFx1MjE5MiBjcmVhdGUgZXhhY3RseSB0aGF0XG4gICAgICAgIC8vIG5vdGUgKGZpeGVzIHRoZSBicm9rZW4tbGluayB3YXJuaW5nLCBob25vdXJzIHRoZSBhdXRob3IncyBpbnRlbnQpLlxuICAgICAgICByZXR1cm4geyBuZXdOYW1lOiBuZXh0TmFtZSwgbmV3RGVja0xpbmtzOiBbXSwgcmV3cml0ZXM6IFtdIH07XG4gICAgICB9XG4gICAgICAvLyBBIHZhbGlkIG5leHQgbm90ZSBleGlzdHMgXHUyMTkyIGluc2VydCBiZXR3ZWVuIGl0IGFuZCB0aGUgY3VycmVudCBub3RlLlxuICAgICAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ld05hbWUsXG4gICAgICAgIG5ld0RlY2tMaW5rczogW25leHRMaW5rXSxcbiAgICAgICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBJbnZhbGlkIChwYXRoLXF1YWxpZmllZCAvIHNlbGYtcmVmZXJlbmNpbmcpIG5leHQgbGluayBcdTIxOTIgZHJvcCBpdCBhbmRcbiAgICAvLyBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSAoZmFsbCB0aHJvdWdoIHRvIHRoZSBuby1uZXh0IGJyYW5jaCkuXG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTm8gKHVzYWJsZSkgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgcmV0dXJuIHtcbiAgICBuZXdOYW1lLFxuICAgIG5ld0RlY2tMaW5rczogW10sXG4gICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gIH07XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuXG4gKlxuICogVGhlIG5ldyBub3RlIHN0YXJ0cyBhcyBhIHNpbmdsZS1zbGlkZSBkZWNrIChgZGVjazogW11gKSBhbmQgbm90aGluZyBlbHNlXG4gKiBpcyB0b3VjaGVkIFx1MjAxNCB0aGUgbm90ZSBpdCB3YXMgbGF1bmNoZWQgZnJvbSBzdGF5cyBhcy1pcy4gTGF0ZXIgcGFnZXMgYXJlXG4gKiBhZGRlZCB3aXRoIENyZWF0ZSBOZXh0IFNsaWRlIGZyb20gaW5zaWRlIHRoZSBkZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5ldyhpbnB1dDogeyBleGlzdGluZ05hbWVzOiBTZXQ8c3RyaW5nPiB9KTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZTogdW5pcXVlTmFtZShcInVudGl0bGVkLXNsaWRlc1wiLCBpbnB1dC5leGlzdGluZ05hbWVzKSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbXSxcbiAgfTtcbn1cblxuLyoqIEEgbm90ZSBwcm9tb3RlZCBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFrZUZpcnN0U2xpZGVQbGFuIHtcbiAgLyoqIFJhdyBgZGVja2AgbGluayB0ZXh0cyBmb3IgdGhlIG5vdGUncyBmcm9udG1hdHRlciAoYWx3YXlzIGVtcHR5IFx1MjAxNCBhIHNpbmdsZS1zbGlkZSBkZWNrKSAqL1xuICBkZWNrOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBQbGFuIGEgXCJNYWtlIHRoaXMgbm90ZSB0aGUgZmlyc3Qgc2xpZGVcIiBydW4gXHUyMDE0IHByb21vdGUgdGhlIGFjdGl2ZSBub3RlXG4gKiBpbnRvIHRoZSBoZWFkIG9mIGEgYnJhbmQtbmV3IGRlY2s6IGl0cyBjb250ZW50LCB0aXRsZSBhbmQgbG9jYXRpb24gc3RheVxuICogdW50b3VjaGVkLCBhbmQgdGhlIGZyb250bWF0dGVyIGdhaW5zIGBkZWNrOiBbXWAgKGEgc2luZ2xlLXNsaWRlIGRlY2ssXG4gKiB0aGUgc3RhbmRhcmQgXCJsYXN0IHNsaWRlXCIgLyBzb2xvIG1hcmtlcikuIE5vIHJld3JpdGVzIGFueXdoZXJlIFx1MjAxNCBsYXRlclxuICogcGFnZXMgYXJlIGFkZGVkIHdpdGggQ3JlYXRlIE5leHQgU2xpZGUgZnJvbSBpbnNpZGUgdGhlIGRlY2suXG4gKlxuICogTm90ZXMgdGhhdCBhbHJlYWR5IGJlbG9uZyB0byBhIGRlY2sgKGhvbGQgYSBgZGVja2AgcHJvcGVydHksIG9yIGFyZVxuICogZGVjbGFyZWQgYXMgYW5vdGhlciBzbGlkZSdzIG5leHQpIGFyZSBOT1QgdG91Y2hlZDogdGhlIHBsYW4gaXMgbnVsbCBhbmRcbiAqIHRoZSBjb21tYW5kIG5vLW9wcyB3aXRoIGEgTm90aWNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbk1ha2VGaXJzdFNsaWRlKGlucHV0OiB7IGFscmVhZHlEZWNrOiBib29sZWFuIH0pOiBNYWtlRmlyc3RTbGlkZVBsYW4gfCBudWxsIHtcbiAgaWYgKGlucHV0LmFscmVhZHlEZWNrKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgZGVjazogW10gfTtcbn1cblxuLyoqIEEgbmFtZSB1c2FibGUgYXMgYSB2YXVsdCBub3RlIG5hbWU6IG5vIHBhdGggc2VwYXJhdG9ycywgbm9uLWVtcHR5ICovXG5mdW5jdGlvbiBpc1BsYWluTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiAhbmFtZS5pbmNsdWRlcyhcIi9cIikgJiYgIW5hbWUuaW5jbHVkZXMoXCJcXFxcXCIpO1xufVxuXG4vKiogRmlyc3QgZnJlZSBuYW1lIGluIHRoZSBmYW1pbHkgYGJhc2VgLCBgYmFzZS0yYCwgYGJhc2UtM2AsIFx1MjAyNiAqL1xuZnVuY3Rpb24gdW5pcXVlTmFtZShiYXNlOiBzdHJpbmcsIGV4aXN0aW5nOiBTZXQ8c3RyaW5nPik6IHN0cmluZyB7XG4gIGlmICghZXhpc3RpbmcuaGFzKGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YmFzZX0tJHtpfWA7XG4gICAgaWYgKCFleGlzdGluZy5oYXMoY2FuZGlkYXRlKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogZGVsZXRlU2xpZGVzLnRzIFx1MjAxNCBQdXJlIFwiRGVsZXRlIHNsaWRlc1wiIHBsYW5uaW5nIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdCBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHlcbiAqIChzZWUgdGVzdC9kZWxldGVTbGlkZXMudGVzdC50cykuIFRoZSBhZGFwdGVyIGluIGRlY2stc2VydmljZS50cyBhcHBsaWVzXG4gKiB0aGUgcGxhbjogaXQgcmV3cml0ZXMgdGhlIHN1cnZpdmluZyBub3RlcycgYGRlY2tgIHByb3BlcnRpZXMsIHRoZW4gbW92ZXNcbiAqIHRoZSBkZWxldGVkIG5vdGVzIHRvIHRoZSB0cmFzaC5cbiAqXG4gKiBEZWxldGlvbiBzcGxpY2VzIHRoZSBjaGFpbiBpbnN0ZWFkIG9mIGJyZWFraW5nIGl0OiBldmVyeSBtYXhpbWFsIHJ1biBvZlxuICogZGVsZXRlZCBzbGlkZXMgYmV0d2VlbiB0d28gc3Vydml2b3JzIEEgXHUyMTkyIFx1MjAyNiBcdTIxOTIgQiBpcyByZXBhaXJlZCBieSBwb2ludGluZ1xuICogQSdzIGBkZWNrYCBsaW5rIGF0IEIgKGBbXWAgd2hlbiB0aGUgcnVuIHJlYWNoZXMgdGhlIGVuZCBvZiB0aGUgY2hhaW4pLlxuICogV2hlbiBhIHJ1biBzdGFydHMgYXQgdGhlIGNoYWluIGhlYWQsIHRoZSBmaXJzdCBzdXJ2aXZvciBiZWNvbWVzIHRoZSBuZXdcbiAqIGhlYWQgYW5kIG5lZWRzIG5vIHJld3JpdGUgYXQgYWxsIChpdHMgb3duIGBkZWNrYCBhbHJlYWR5IHBvaW50cyBvbndhcmQpLlxuICovXG5cbi8qKiBPbmUgc3Vydml2aW5nIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVJld3JpdGUge1xuICAvKiogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdGhhdCBzaG91bGQgYmVjb21lIHRoaXMgbm90ZSdzIG5leHQgc2xpZGUsXG4gICAqIG9yIG51bGwgd2hlbiB0aGUgbm90ZSBiZWNvbWVzIHRoZSBuZXcgbGFzdCBzbGlkZSAoYGRlY2s6IFtdYCkuXG4gICAqL1xuICBuZXh0UGF0aDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBkZWxldGlvbiBvZiBzbGlkZXMgZnJvbSBhbiBvcmRlcmVkIGRlY2sgY2hhaW4uXG4gKlxuICogYGNoYWluYCBpcyB0aGUgZnVsbCBzbGlkZSBvcmRlciAoWzBdID0gaGVhZCkuIE9ubHkgcGF0aHMgcHJlc2VudCBpbiB0aGVcbiAqIGNoYWluIGFyZSBjb25zaWRlcmVkOyBhbnl0aGluZyBlbHNlIGluIGBkZWxldGVQYXRoc2AgaXMgaWdub3JlZC4gUmV0dXJuc1xuICogb25lIHJld3JpdGUgcGVyIHN1cnZpdmluZyBub3RlIHRoYXQgZGlyZWN0bHkgcHJlY2VkZWQgYSBkZWxldGVkIHJ1bixcbiAqIG9yZGVyZWQgYnkgY2hhaW4gcG9zaXRpb24uIERlbGV0aW5nIG5vdGhpbmcgeWllbGRzIG5vIHJld3JpdGVzOyBkZWxldGluZ1xuICogZXZlcnl0aGluZyB5aWVsZHMgbm8gcmV3cml0ZXMgZWl0aGVyIChubyBzdXJ2aXZvcnMgbGVmdCB0byByZXBhaXIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkRlbGV0ZVNsaWRlcyhcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbik6IERlbGV0ZVJld3JpdGVbXSB7XG4gIGNvbnN0IHJld3JpdGVzOiBEZWxldGVSZXdyaXRlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhdGggPSBjaGFpbltpXTtcbiAgICBpZiAoIXBhdGggfHwgZGVsZXRlUGF0aHMuaGFzKHBhdGgpKSBjb250aW51ZTtcbiAgICAvLyBGaW5kIHRoZSBmaXJzdCBzdXJ2aXZvciBhZnRlciB0aGlzIG5vdGUncyBwb3NpdGlvbi5cbiAgICBsZXQgaiA9IGkgKyAxO1xuICAgIHdoaWxlIChqIDwgY2hhaW4ubGVuZ3RoICYmIGRlbGV0ZVBhdGhzLmhhcyhjaGFpbltqXSkpIGorKztcbiAgICBjb25zdCBuZXh0UGF0aCA9IGogPCBjaGFpbi5sZW5ndGggPyBjaGFpbltqXSA6IG51bGw7XG4gICAgY29uc3QgY2hhbmdlZCA9IG5leHRQYXRoICE9PSAoY2hhaW5baSArIDFdID8/IG51bGwpO1xuICAgIGlmIChjaGFuZ2VkKSByZXdyaXRlcy5wdXNoKHsgcGF0aCwgbmV4dFBhdGggfSk7XG4gIH1cbiAgcmV0dXJuIHJld3JpdGVzO1xufVxuXG4vKipcbiAqIFBpY2sgd2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlciBkZWxldGluZyBzbGlkZXM6IHRoZSBuZWFyZXN0XG4gKiBzdXJ2aXZvciBvZiBgZGVsZXRlZFBhdGhzYCcgbmVpZ2hib3VyaG9vZCBhcm91bmQgYGZvY3VzUGF0aGAgXHUyMDE0IHByZWZlclxuICogdGhlIGNsb3Nlc3Qgc3Vydml2b3IgYWZ0ZXIgaXQsIGVsc2UgdGhlIGNsb3Nlc3QgYmVmb3JlIGl0LiBSZXR1cm5zIG51bGxcbiAqIHdoZW4gYGZvY3VzUGF0aGAgc3Vydml2ZXMgb3Igbm90aGluZyBuZWFyYnkgcmVtYWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tMYW5kaW5nUGF0aChcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghZm9jdXNQYXRoIHx8ICFkZWxldGVQYXRocy5oYXMoZm9jdXNQYXRoKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihmb2N1c1BhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgZm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgZm9yIChsZXQgaSA9IGluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoIWRlbGV0ZVBhdGhzLmhhcyhjaGFpbltpXSkpIHJldHVybiBjaGFpbltpXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiIsICIvKipcbiAqIG5hdi50cyBcdTIwMTQgUHVyZSBuYXZpZ2F0aW9uIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogVHdvIHJ1bGVzIGxpdmUgaGVyZSwgYm90aCBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIHRoZXkgY2FuXG4gKiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvbmF2LnRlc3QudHMpOlxuICpcbiAqICAgMS4gQSBwcmVzcyBzdGVwcyBmcm9tIHRoZSAqcHJldmlvdXMgcHJlc3MncyB0YXJnZXQqLCBub3QgZnJvbSB0aGUgbm90ZSB0aGVcbiAqICAgICAgZWRpdG9yIGhhcHBlbnMgdG8gc2hvdy4gV2l0aG91dCB0aGlzLCBldmVyeSBwcmVzcyBpbiBhIGJ1cnN0IHJlc29sdmVzIHRvXG4gKiAgICAgIHRoZSBzYW1lIG5leHQgc2xpZGUgYW5kIGFsbCBidXQgb25lIGFyZSBzd2FsbG93ZWQgKGlzc3VlICMxMTApLlxuICogICAyLiBBIHNlc3Npb24ga2VlcHMgdGhlIGNoYWluICpoZWFkKiBpdCBlbnRlcmVkIHdoaWxlIHRoYXQgaGVhZCBzdGlsbCByZWFjaGVzXG4gKiAgICAgIHRoZSBub3RlIGluIHRoZSBlZGl0b3IuIFRoZSBoZWFkIGlzIGEgaGludCwgbm90IGEgY2FjaGVkIGNoYWluOiB0aGUgY2hhaW5cbiAqICAgICAgaXMgd2Fsa2VkIGxpdmUgb24gZXZlcnkgcmVzb2x1dGlvbiwgc28gc2xpZGVzIGNyZWF0ZWQsIGRlbGV0ZWQgb3IgcmVuYW1lZFxuICogICAgICBtZWFud2hpbGUgYXJlIGhvbm91cmVkIChgZGVja0Zyb21IZWFkKClgKSwgYW5kIGEgaGludCB0aGF0IG5vIGxvbmdlciBsZWFkc1xuICogICAgICB0byB0aGUgY3VycmVudCBub3RlIGlzIGlnbm9yZWQuIFJlLXJlc29sdmluZyB0aGUgaGVhZCBvbiBldmVyeSBzdGVwIGlzIHdoYXRcbiAqICAgICAgdXNlZCB0byBsZXQgYSBzaGFyZWQgYGRlY2tgIGxpbmsgXHUyMDE0IHR3byBzbGlkZXMgZGVjbGFyaW5nIHRoZSBzYW1lIG5leHRcbiAqICAgICAgc2xpZGUgXHUyMDE0IHN3YXAgdGhlIGNoYWluIHVuZGVyIHRoZSByZWFkZXIgKGlzc3VlICMxMTApLlxuICovXG5cbmltcG9ydCB0eXBlIHsgRGVja0luZm8gfSBmcm9tIFwiLi9kZWNrXCI7XG5cbi8qKiBPbmUgcXVldWVkIG5hdmlnYXRpb24gcmVxdWVzdDogYSBkaXJlY3Rpb24sIG9yIGFuIGFic29sdXRlIGNoYWluIGluZGV4ICovXG5leHBvcnQgdHlwZSBOYXZJbnRlbnQgPSB7IGRpcjogXCJwcmV2XCIgfCBcIm5leHRcIiB9IHwgeyBpbmRleDogbnVtYmVyIH07XG5cbi8qKlxuICogRGVjayByZXNvbHV0aW9uIGluc2lkZSBhIG5hdmlnYXRpb24gc2Vzc2lvbjogd2FsayBsaXZlIGZyb20gdGhlIHNlc3Npb24ncyBoZWFkXG4gKiBoaW50IHdoZW4gaXQgc3RpbGwgcmVhY2hlcyBgYW5jaG9yUGF0aGAsIGFuZCBmYWxsIGJhY2sgdG8gYSBmcmVzaCByZXNvbHV0aW9uXG4gKiAoYGNvbXB1dGVgLCB3aGljaCBmaW5kcyBpdHMgb3duIGhlYWQpIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlc3Npb25EZWNrKFxuICBoZWFkOiBzdHJpbmcgfCBudWxsLFxuICBhbmNob3JQYXRoOiBzdHJpbmcgfCBudWxsLFxuICBmcm9tSGVhZDogKGhlYWQ6IHN0cmluZywgcGF0aDogc3RyaW5nKSA9PiBEZWNrSW5mbyB8IG51bGwsXG4gIGNvbXB1dGU6IChwYXRoOiBzdHJpbmcpID0+IERlY2tJbmZvIHwgbnVsbCxcbik6IERlY2tJbmZvIHwgbnVsbCB7XG4gIGlmICghYW5jaG9yUGF0aCkgcmV0dXJuIG51bGw7XG4gIGlmIChoZWFkKSB7XG4gICAgY29uc3QgZGVjayA9IGZyb21IZWFkKGhlYWQsIGFuY2hvclBhdGgpO1xuICAgIGlmIChkZWNrKSByZXR1cm4gZGVjaztcbiAgfVxuICByZXR1cm4gY29tcHV0ZShhbmNob3JQYXRoKTtcbn1cblxuLyoqXG4gKiBUYXJnZXQgb2Ygb25lIGludGVudCBpbnNpZGUgYSByZXNvbHZlZCBkZWNrLCBvciBudWxsIHdoZW4gaXQgd291bGQgbGVhdmUgdGhlXG4gKiBkZWNrIFx1MjAxNCB0aGUgZmlyc3Qgc2xpZGUgaGFzIG5vIHByZXZpb3VzIHBhZ2UsIHRoZSBsYXN0IHNsaWRlIGhhcyBubyBuZXh0IHBhZ2UsXG4gKiBhbmQgYSBqdW1wIHRvIHRoZSBjdXJyZW50IGluZGV4IGlzIGEgbm8tb3AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGVwVGFyZ2V0KGRlY2s6IERlY2tJbmZvLCBpbnRlbnQ6IE5hdkludGVudCk6IHN0cmluZyB8IG51bGwge1xuICBjb25zdCBpbmRleCA9XG4gICAgXCJpbmRleFwiIGluIGludGVudCA/IGludGVudC5pbmRleCA6IGludGVudC5kaXIgPT09IFwicHJldlwiID8gZGVjay5pbmRleCAtIDEgOiBkZWNrLmluZGV4ICsgMTtcbiAgaWYgKGluZGV4ID09PSBkZWNrLmluZGV4IHx8IGluZGV4IDwgMCB8fCBpbmRleCA+PSBkZWNrLmNoYWluLmxlbmd0aCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBkZWNrLmNoYWluW2luZGV4XSA/PyBudWxsO1xufVxuXG4vKiogV2hhdCB0aGUgc2Vzc2lvbiBuZWVkcyBmcm9tIHRoZSBlZGl0b3IsIGluamVjdGVkIHNvIHRoZSBxdWV1ZSBzdGF5cyB0ZXN0YWJsZSAqL1xuZXhwb3J0IGludGVyZmFjZSBOYXZIb29rcyB7XG4gIC8qKiBMaXZlIGRlY2sgZm9yIGBwYXRoYCwgaG9ub3VyaW5nIHRoZSBzZXNzaW9uJ3MgaGVhZCBoaW50ICovXG4gIHJlc29sdmU6IChwYXRoOiBzdHJpbmcsIGhlYWQ6IHN0cmluZyB8IG51bGwpID0+IERlY2tJbmZvIHwgbnVsbDtcbiAgLyoqIE9wZW4gYHRhcmdldGAgKHRoZSBwcm9taXNlIHJlc29sdmluZyBvbmNlIHRoZSBlZGl0b3Igc3dpdGNoZWQgdG8gaXQpICovXG4gIG9wZW46ICh0YXJnZXQ6IHN0cmluZywgZnJvbTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogVGhlIG5vdGUgaW4gdGhlIGVkaXRvciwgdXNlZCBhcyB0aGUgYW5jaG9yIHdoZW4gdGhlIHNlc3Npb24gaGFzIG5vbmUgKi9cbiAgYWN0aXZlUGF0aDogKCkgPT4gc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBUaGUgcXVldWUgYmVoaW5kIHByZXYgLyBuZXh0IC8ganVtcC4gUHJlc3NlcyBhcmUgYXBwbGllZCBvbmUgYXdhaXRlZCBvcGVuIGF0IGFcbiAqIHRpbWUgc28gYSBidXJzdCBhZHZhbmNlcyBvbmUgc2xpZGUgcGVyIHByZXNzLCBhbmQgZWFjaCBzdGVwIGlzIGFuY2hvcmVkIG9uIHRoZVxuICogcHJldmlvdXMgc3RlcCdzIHRhcmdldCByYXRoZXIgdGhhbiBvbiB0aGUgbm90ZSB0aGUgZWRpdG9yIHN0aWxsIHNob3dzLlxuICovXG5leHBvcnQgY2xhc3MgTmF2U2Vzc2lvbiB7XG4gIHByaXZhdGUgcXVldWU6IE5hdkludGVudFtdID0gW107XG4gIHByaXZhdGUgcnVubmluZyA9IGZhbHNlO1xuICBwcml2YXRlIHBlbmRpbmc6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhlYWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaG9va3M6IE5hdkhvb2tzKSB7fVxuXG4gIC8qKiBUaGUgY2hhaW4gaGVhZCB0aGlzIHNlc3Npb24gZW50ZXJlZCwgb3IgbnVsbCBiZWZvcmUgaXRzIGZpcnN0IHN0ZXAgKi9cbiAgZ2V0IHJlbWVtYmVyZWRIZWFkKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmhlYWQ7XG4gIH1cblxuICAvKiogUXVldWUgYSBwcmVzczsgdGhlIGZpcnN0IG9uZSBzdGFydHMgdGhlIGRyYWluLiBSZXNvbHZlcyBvbmNlIHRoZSBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgcHVzaChpbnRlbnQ6IE5hdkludGVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMucXVldWUucHVzaChpbnRlbnQpO1xuICAgIGlmICh0aGlzLnJ1bm5pbmcpIHJldHVybiB0aGlzLmRyYWluaW5nID8/IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHRoaXMuZHJhaW5pbmcgPSB0aGlzLmRyYWluKCkuY2F0Y2goKGVycm9yOiB1bmtub3duKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwibmF0aXZlLXNsaWRlczogbmF2aWdhdGlvbiBmYWlsZWRcIiwgZXJyb3IpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmRyYWluaW5nO1xuICB9XG5cbiAgLyoqIFJlc29sdmVzIHdoZW4gdGhlIHF1ZXVlIGhhcyBkcmFpbmVkICh0aGUgcHJvbWlzZSBgcHVzaCgpYCByZXR1cm5zKSAqL1xuICBwcml2YXRlIGRyYWluaW5nOiBQcm9taXNlPHZvaWQ+IHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBhc3luYyBkcmFpbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICB3aGlsZSAodGhpcy5xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGludGVudCA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgaWYgKCFpbnRlbnQpIGJyZWFrO1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5wZW5kaW5nID8/IHRoaXMuaG9va3MuYWN0aXZlUGF0aCgpO1xuICAgICAgICBpZiAoIWZyb20pIGNvbnRpbnVlOyAvLyBubyBub3RlIHRvIGFuY2hvciBvbiBcdTIwMTQgZHJvcCB0aGUgcHJlc3NcbiAgICAgICAgY29uc3QgZGVjayA9IHRoaXMuaG9va3MucmVzb2x2ZShmcm9tLCB0aGlzLmhlYWQpO1xuICAgICAgICBpZiAoIWRlY2spIGNvbnRpbnVlOyAvLyBubyBsb25nZXIgYSBkZWNrIG5vdGUgXHUyMDE0IGRyb3AgdGhlIHByZXNzXG4gICAgICAgIHRoaXMuaGVhZCA9IGRlY2suY2hhaW5bMF0gPz8gdGhpcy5oZWFkOyAvLyByZW1lbWJlciB0aGUgY2hhaW4gd2Fsa2VkXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHN0ZXBUYXJnZXQoZGVjaywgaW50ZW50KTtcbiAgICAgICAgaWYgKCF0YXJnZXQpIGNvbnRpbnVlOyAvLyBmaXJzdC9sYXN0IHNsaWRlIFx1MjAxNCB0aGUgcHJlc3MgaXMgYSBuby1vcFxuICAgICAgICB0aGlzLnBlbmRpbmcgPSB0YXJnZXQ7XG4gICAgICAgIGF3YWl0IHRoaXMuaG9va3Mub3Blbih0YXJnZXQsIGZyb20pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBQcmVzc2VzIHF1ZXVlZCBiZWhpbmQgYSBmYWlsZWQgb3BlbiBhcmUgc3RhbGU6IHJlcGxheWluZyB0aGVtIGxhdGVyIHdvdWxkXG4gICAgICAvLyBtb3ZlIHRoZSByZWFkZXIgZnJvbSB3aGVyZXZlciB0aGV5IGVuZCB1cCwgbm90IGZyb20gd2hlcmUgdGhleSB3ZXJlLlxuICAgICAgdGhpcy5xdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMucGVuZGluZyA9IG51bGw7IC8vIHF1ZXVlIGRyYWluZWQ6IHRoZSBlZGl0b3IgaXMgYXV0aG9yaXRhdGl2ZSBhZ2FpblxuICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIE1lbnUsIFRGaWxlLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IENvbmZpcm1EZWxldGVNb2RhbCB9IGZyb20gXCIuL2NvbmZpcm0tZGVsZXRlXCI7XG5cbi8qKiBWaWV3IHR5cGUgaWQgb2YgdGhlIHNsaWRlcyBzaWRlYmFyIHBhbmVsICovXG5leHBvcnQgY29uc3QgU0xJREVTX1BBTkVMX1ZJRVcgPSBcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIjtcblxuLyoqXG4gKiBTaWRlYmFyIHBhbmVsIGxpc3RpbmcgZXZlcnkgc2xpZGUgb2YgdGhlIGFjdGl2ZSBub3RlJ3MgZGVjayAobmV4dC1vbmx5XG4gKiBjaGFpbiBvcmRlcikuIFRha2VzIG92ZXIgdGhlIGFnZ3JlZ2F0aW9uL2VudHJ5IHJvbGUgdGhlIG92ZXJ2aWV3IHBhZ2VcbiAqIHVzZWQgdG8gcGxheSBiZWZvcmUgdjEuMC4wLlxuICpcbiAqIEludGVyYWN0aW9uOlxuICogICAtIGNsaWNrICAgICAgICAgICAgXHUyMTkyIG9wZW4gdGhhdCBzbGlkZSAoYW5kIGNsZWFyIGFueSBzZWxlY3Rpb24pXG4gKiAgIC0gTW9kK2NsaWNrICAgICAgICBcdTIxOTIgdG9nZ2xlIHRoZSBpdGVtIGluIHRoZSBzZWxlY3Rpb25cbiAqICAgLSBTaGlmdCtjbGljayAgICAgIFx1MjE5MiBleHRlbmQgdGhlIHNlbGVjdGlvbiBmcm9tIHRoZSBsYXN0IGFuY2hvclxuICogICAtIHJpZ2h0LWNsaWNrICAgICAgXHUyMTkyIGNvbnRleHQgbWVudTogQ3JlYXRlIG5leHQgc2xpZGUgLyBEZWxldGUgc2xpZGUocylcbiAqL1xuZXhwb3J0IGNsYXNzIFNsaWRlc1BhbmVsVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgLyoqIENoYWluIHNpZ25hdHVyZSBvZiB0aGUgY3VycmVudGx5IHJlbmRlcmVkIGxpc3QgKi9cbiAgcHJpdmF0ZSBsYXN0Q2hhaW46IHN0cmluZ1tdID0gW107XG4gIC8qKiBSZW5kZXJlZCBpdGVtIGVsZW1lbnRzLCBpbmRleC1hbGlnbmVkIHdpdGggbGFzdENoYWluICovXG4gIHByaXZhdGUgaXRlbXM6IHsgcGF0aDogc3RyaW5nOyBlbDogSFRNTEVsZW1lbnQgfVtdID0gW107XG4gIC8qKiBDdXJyZW50bHkgc2VsZWN0ZWQgc2xpZGUgcGF0aHMgKG11bHRpLXNlbGVjdCBmb3IgRGVsZXRlKSAqL1xuICBwcml2YXRlIHNlbGVjdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIC8qKiBTZWxlY3Rpb24gYW5jaG9yIGZvciBTaGlmdCtjbGljayByYW5nZSBleHRlbnNpb24gKi9cbiAgcHJpdmF0ZSBhbmNob3I6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4sXG4gICAgbGVhZjogV29ya3NwYWNlTGVhZixcbiAgKSB7XG4gICAgc3VwZXIobGVhZik7XG4gIH1cblxuICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBTTElERVNfUEFORUxfVklFVztcbiAgfVxuXG4gIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiU2xpZGVzXCI7XG4gIH1cblxuICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwicHJlc2VudGF0aW9uXCI7XG4gIH1cblxuICBhc3luYyBvbk9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5hZGRDbGFzcyhcIm5hdGl2ZS1zbGlkZXMtcGFuZWxcIik7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImFjdGl2ZS1sZWFmLWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImxheW91dC1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLm9uKFwiY2hhbmdlZFwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLnZhdWx0Lm9uKFwicmVuYW1lXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJkZWxldGVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBhc3luYyBvbkNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IFtdO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLnNlbGVjdGVkLmNsZWFyKCk7XG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bmMgdGhlIGxpc3Qgd2l0aCB0aGUgYWN0aXZlIG5vdGUncyBkZWNrLiBJbmNyZW1lbnRhbCBvbiBwdXJwb3NlOiB0aGVcbiAgICogcmVmcmVzaCBldmVudHMgYWxzbyBmaXJlIHdoaWxlIGEgY2xpY2sgb24gYW4gZW50cnkgaXMgaW4gZmxpZ2h0ICh0aGVcbiAgICogbW91c2Vkb3duIGFjdGl2YXRlcyB0aGlzIGxlYWYpLCBhbmQgcmVidWlsZGluZyB0aGUgRE9NIG1pZC1nZXN0dXJlXG4gICAqIGRlc3Ryb3lzIHRoZSBjbGljayB0YXJnZXQgXHUyMDE0IHdoaWNoIG1hZGUgb3BlbmluZyBhIHNsaWRlIHRha2UgdHdvIGNsaWNrc1xuICAgKiB3aGVuZXZlciB0aGUgcGFuZWwgd2FzIG5vdCB0aGUgYWN0aXZlIGxlYWYuIFVuY2hhbmdlZCBjaGFpbnMgb25seSBnZXRcbiAgICogdGhlaXIgaGlnaGxpZ2h0IHVwZGF0ZWQsIHNvIGl0ZW0gZWxlbWVudHMgYWx3YXlzIHN1cnZpdmUuXG4gICAqL1xuICBwcml2YXRlIHJlbmRlcigpOiB2b2lkIHtcbiAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICBjb25zdCBkZWNrID0gZmlsZSA/IHRoaXMucGx1Z2luLnJlc29sdmVEZWNrKGZpbGUpIDogbnVsbDtcbiAgICBjb25zdCBjaGFpbiA9IGRlY2tcbiAgICAgID8gZGVjay5jaGFpbi5maWx0ZXIoKHApID0+IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwKSBpbnN0YW5jZW9mIFRGaWxlKVxuICAgICAgOiBbXTtcblxuICAgIC8vIERyb3Agc2VsZWN0aW9ucyB3aG9zZSBub3RlIHZhbmlzaGVkIGZyb20gdGhlIGNoYWluIG1lYW53aGlsZVxuICAgIGlmICh0aGlzLnNlbGVjdGVkLnNpemUgPiAwKSB7XG4gICAgICBjb25zdCBsaXZlID0gbmV3IFNldChjaGFpbik7XG4gICAgICBmb3IgKGNvbnN0IHBhdGggb2YgdGhpcy5zZWxlY3RlZCkgaWYgKCFsaXZlLmhhcyhwYXRoKSkgdGhpcy5zZWxlY3RlZC5kZWxldGUocGF0aCk7XG4gICAgfVxuICAgIC8vIEEgZGVhZCBhbmNob3IgbXVzdCBub3Qgc2lsZW50bHkgdHVybiBhIFNoaWZ0K2NsaWNrIGludG8gYSB0b2dnbGVcbiAgICBpZiAodGhpcy5hbmNob3IgIT09IG51bGwgJiYgIWNoYWluLmluY2x1ZGVzKHRoaXMuYW5jaG9yKSkgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKCFjaGFpbkVxdWFscyh0aGlzLmxhc3RDaGFpbiwgY2hhaW4pKSB7XG4gICAgICB0aGlzLnJlYnVpbGQoY2hhaW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMuaXRlbXMpIGl0LmVsLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIiwgaXQucGF0aCA9PT0gZmlsZT8ucGF0aCk7XG4gICAgfVxuICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgfVxuXG4gIC8qKiBGdWxsIHJlYnVpbGQgKGNoYWluIHNoYXBlIGNoYW5nZWQpICovXG4gIHByaXZhdGUgcmVidWlsZChjaGFpbjogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5jb250YWluZXJFbDtcbiAgICByb290LmVtcHR5KCk7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMubGFzdENoYWluID0gY2hhaW47XG5cbiAgICBpZiAoY2hhaW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBlbXB0eSA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtZW1wdHlcIiB9KTtcbiAgICAgIGVtcHR5LnNldFRleHQoXG4gICAgICAgIFwiTm8gc2xpZGVzIGRlY2sgXHUyMDE0IG9wZW4gYSBkZWNrIG5vdGUsIG9yIHJ1biBjcmVhdGUgbmV4dCBzbGlkZSBvbiBhbnkgbm90ZSB0byBzdGFydCBvbmUuXCIsXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoO1xuICAgIGNoYWluLmZvckVhY2goKHBhdGgsIGkpID0+IHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm47XG4gICAgICBjb25zdCBpdGVtID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1pdGVtXCIgfSk7XG4gICAgICBpZiAocGF0aCA9PT0gYWN0aXZlUGF0aCkgaXRlbS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgICAgIGl0ZW0uY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLW51bVwiIH0pLnNldFRleHQoU3RyaW5nKGkgKyAxKSk7XG4gICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC10aXRsZVwiIH0pLnNldFRleHQoZi5iYXNlbmFtZSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gdGhpcy5vbkl0ZW1DbGljayhlLCBpLCBmKSk7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMub3BlbkNvbnRleHRNZW51KGUsIGYpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLml0ZW1zLnB1c2goeyBwYXRoLCBlbDogaXRlbSB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDbGljayByb3V0aW5nOiBwbGFpbiA9IG9wZW4sIE1vZCA9IHRvZ2dsZSBzZWxlY3QsIFNoaWZ0ID0gcmFuZ2Ugc2VsZWN0ICovXG4gIHByaXZhdGUgb25JdGVtQ2xpY2soZTogTW91c2VFdmVudCwgaW5kZXg6IG51bWJlciwgZjogVEZpbGUpOiB2b2lkIHtcbiAgICBpZiAoZS5zaGlmdEtleSB8fCBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICAvLyBSYW5nZSBhbmNob3I6IHRoZSBsYXN0IHNlbGVjdGVkIGl0ZW0sIG9yIHRoZSBkaXNwbGF5ZWQgc2xpZGVcbiAgICAgICAgLy8gd2hlbiBubyB1c2FibGUgYW5jaG9yIGV4aXN0cyAoZmlyc3QgU2hpZnQrY2xpY2sgaW4gYSBzZXNzaW9uKS5cbiAgICAgICAgY29uc3QgYWN0aXZlUGF0aCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk/LnBhdGggPz8gbnVsbDtcbiAgICAgICAgY29uc3QgYW5jaG9yUGF0aCA9XG4gICAgICAgICAgdGhpcy5hbmNob3IgIT09IG51bGwgJiYgdGhpcy5pdGVtcy5zb21lKChpdCkgPT4gaXQucGF0aCA9PT0gdGhpcy5hbmNob3IpXG4gICAgICAgICAgICA/IHRoaXMuYW5jaG9yXG4gICAgICAgICAgICA6IGFjdGl2ZVBhdGg7XG4gICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLml0ZW1zLmZpbmRJbmRleCgoaXQpID0+IGl0LnBhdGggPT09IGFuY2hvclBhdGgpO1xuICAgICAgICBpZiAoYW5jaG9yUGF0aCAhPT0gbnVsbCAmJiBmcm9tICE9PSAtMSkge1xuICAgICAgICAgIGNvbnN0IFtsbywgaGldID0gZnJvbSA8IGluZGV4ID8gW2Zyb20sIGluZGV4XSA6IFtpbmRleCwgZnJvbV07XG4gICAgICAgICAgZm9yIChsZXQgaSA9IGxvOyBpIDw9IGhpOyBpKyspIHRoaXMuc2VsZWN0ZWQuYWRkKHRoaXMuaXRlbXNbaV0ucGF0aCk7XG4gICAgICAgICAgLy8gVGhlIGRpc3BsYXllZCBzbGlkZSBqb2lucyBldmVyeSBTaGlmdCBzZWxlY3Rpb24gXHUyMDE0IGV4dGVuZGluZyBhXG4gICAgICAgICAgLy8gc2VsZWN0aW9uIG5ldmVyIHNpbGVudGx5IGRyb3BzIHRoZSBwYWdlIHlvdSBhcmUgbG9va2luZyBhdC5cbiAgICAgICAgICBpZiAoYWN0aXZlUGF0aCAhPT0gbnVsbCAmJiB0aGlzLml0ZW1zLnNvbWUoKGl0KSA9PiBpdC5wYXRoID09PSBhY3RpdmVQYXRoKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZC5hZGQoYWN0aXZlUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYW5jaG9yID0gdGhpcy5pdGVtc1tpbmRleF0ucGF0aDtcbiAgICAgICAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBNb2QgKG9yIFNoaWZ0IHdpdGggbm8gcmVhY2hhYmxlIGFuY2hvcik6IHB1cmUgdG9nZ2xlIFx1MjAxNCB0aGUgb25seSB3YXlcbiAgICAgIC8vIHRvIGNhbmNlbCBhbiBpdGVtIG91dCBvZiB0aGUgc2VsZWN0aW9uLlxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQuaGFzKGYucGF0aCkpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKGYucGF0aCk7XG4gICAgICBlbHNlIHRoaXMuc2VsZWN0ZWQuYWRkKGYucGF0aCk7XG4gICAgICB0aGlzLmFuY2hvciA9IGYucGF0aDtcbiAgICAgIHRoaXMuc3luY1NlbGVjdGlvbkNsYXNzZXMoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZC5jbGVhcigpO1xuICAgIC8vIE5vIHNlbGVjdGlvbiBhZnRlciBhIHBsYWluIGNsaWNrLCBidXQgdGhlIGNsaWNrZWQgc2xpZGUgc3RheXMgdGhlXG4gICAgLy8gU2hpZnQrY2xpY2sgYW5jaG9yIFx1MjAxNCBtYXRjaGluZyB0aGUgZmlsZS1leHBsb3JlciBmZWVsOiBwaWNrIGEgc2xpZGUsXG4gICAgLy8gdGhlbiBTaGlmdCtjbGljayBhIGxhdGVyIG9uZSB0byBzZWxlY3QgdGhlIHdob2xlIHJhbmdlIGJldHdlZW4gdGhlbS5cbiAgICB0aGlzLmFuY2hvciA9IGYucGF0aDtcbiAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgdm9pZCB0aGlzLm9wZW5TbGlkZShmKTtcbiAgfVxuXG4gIC8qKiBSZWZsZWN0IHRoZSBzZWxlY3Rpb24gc2V0IG9uIHRoZSByZW5kZXJlZCBpdGVtcyB3aXRob3V0IGEgcmVidWlsZCAqL1xuICBwcml2YXRlIHN5bmNTZWxlY3Rpb25DbGFzc2VzKCk6IHZvaWQge1xuICAgIGZvciAoY29uc3QgaXQgb2YgdGhpcy5pdGVtcykgaXQuZWwuY2xhc3NMaXN0LnRvZ2dsZShcImlzLXNlbGVjdGVkXCIsIHRoaXMuc2VsZWN0ZWQuaGFzKGl0LnBhdGgpKTtcbiAgfVxuXG4gIC8qKiBSaWdodC1jbGljayBtZW51IG9uIG9uZSBpdGVtOyBvcGVyYXRlcyBvbiB0aGUgd2hvbGUgc2VsZWN0aW9uIHdoZW4gaXQgYmVsb25ncyB0byBvbmUgKi9cbiAgcHJpdmF0ZSBvcGVuQ29udGV4dE1lbnUoZTogTW91c2VFdmVudCwgZjogVEZpbGUpOiB2b2lkIHtcbiAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcbiAgICBtZW51LmFkZEl0ZW0oKG1pKSA9PlxuICAgICAgbWlcbiAgICAgICAgLnNldFRpdGxlKFwiQ3JlYXRlIG5leHQgc2xpZGVcIilcbiAgICAgICAgLnNldEljb24oXCJwbHVzXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHZvaWQgdGhpcy5jcmVhdGVOZXh0QWZ0ZXIoZikpLFxuICAgICk7XG4gICAgY29uc3QgdGFyZ2V0cyA9IHRoaXMuc2VsZWN0ZWQuaGFzKGYucGF0aCkgPyBbLi4udGhpcy5zZWxlY3RlZF0gOiBbZi5wYXRoXTtcbiAgICBjb25zdCBvcmRlcmVkID0gdGhpcy5sYXN0Q2hhaW4uZmlsdGVyKChwKSA9PiB0YXJnZXRzLmluY2x1ZGVzKHApKTtcbiAgICBtZW51LmFkZEl0ZW0oKG1pKSA9PlxuICAgICAgbWlcbiAgICAgICAgLnNldFRpdGxlKG9yZGVyZWQubGVuZ3RoID4gMSA/IGBEZWxldGUgJHtvcmRlcmVkLmxlbmd0aH0gc2xpZGVzYCA6IFwiRGVsZXRlIHNsaWRlXCIpXG4gICAgICAgIC5zZXRJY29uKFwidHJhc2hcIilcbiAgICAgICAgLm9uQ2xpY2soKCkgPT4gdGhpcy5kZWxldGVTbGlkZXMob3JkZXJlZCkpLFxuICAgICk7XG4gICAgbWVudS5zaG93QXRNb3VzZUV2ZW50KGUpO1xuICB9XG5cbiAgLyoqIENyZWF0ZSBhIHNsaWRlIGFmdGVyIHRoZSByaWdodC1jbGlja2VkIG9uZSAod2l0aG91dCBvcGVuaW5nIGl0KSAqL1xuICBwcml2YXRlIGFzeW5jIGNyZWF0ZU5leHRBZnRlcihmOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHBsYW4gPSB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmKTtcbiAgICBpZiAoIXBsYW4pIHJldHVybjtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5kZWNrU2VydmljZS5leGVjdXRlQ3JlYXRlTmV4dChmLCBwbGFuLCBmYWxzZSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBDb25maXJtLCB0aGVuIHRyYXNoIHRoZSBnaXZlbiBzbGlkZXMgYW5kIHNwbGljZSB0aGVtIG91dCBvZiB0aGUgY2hhaW4gKi9cbiAgcHJpdmF0ZSBkZWxldGVTbGlkZXMocGF0aHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IHJ1biA9ICgpOiB2b2lkID0+IHZvaWQgdGhpcy5ydW5EZWxldGlvbihwYXRocyk7XG5cbiAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLmNvbmZpcm1EZWxldGVTbGlkZXMpIHtcbiAgICAgIHJ1bigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuYW1lcyA9IHBhdGhzLm1hcCgocCkgPT4ge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwKTtcbiAgICAgIHJldHVybiBmIGluc3RhbmNlb2YgVEZpbGUgPyBmLmJhc2VuYW1lIDogcDtcbiAgICB9KTtcbiAgICBuZXcgQ29uZmlybURlbGV0ZU1vZGFsKHRoaXMuYXBwLCBuYW1lcywgcnVuLCBhc3luYyAoKSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzID0gZmFsc2U7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB9KS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJ1bkRlbGV0aW9uKHBhdGhzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IG51bGw7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZURlbGV0ZVNsaWRlcyhcbiAgICAgIHRoaXMubGFzdENoYWluLFxuICAgICAgbmV3IFNldChwYXRocyksXG4gICAgICBhY3RpdmVQYXRoLFxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IHBhdGggb2YgcGF0aHMpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIGlmICh0aGlzLmFuY2hvciAhPT0gbnVsbCAmJiBwYXRocy5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQubGFuZGluZ1BhdGgpIHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmVzdWx0LmxhbmRpbmdQYXRoKTtcbiAgICAgIGlmIChmIGluc3RhbmNlb2YgVEZpbGUpIGF3YWl0IHRoaXMub3BlblNsaWRlKGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLyoqIE9wZW4gYSBzbGlkZSBpbiBhIG1hcmtkb3duIGxlYWYgKG5ldmVyIGluIHRoaXMgcGFuZWwncyBvd24gbGVhZikgKi9cbiAgcHJpdmF0ZSBhc3luYyBvcGVuU2xpZGUoZjogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBsZWFmID1cbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoXCJtYXJrZG93blwiKVswXSA/PyB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGYpO1xuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5zZXRBY3RpdmVMZWFmKGxlYWYsIHsgZm9jdXM6IHRydWUgfSk7XG4gIH1cbn1cblxuLyoqIE9yZGVyLXNlbnNpdGl2ZSBjaGFpbiBjb21wYXJpc29uICovXG5mdW5jdGlvbiBjaGFpbkVxdWFscyhhOiBzdHJpbmdbXSwgYjogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KChwLCBpKSA9PiBwID09PSBiW2ldKTtcbn1cbiIsICJpbXBvcnQgeyBBcHAsIE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBNYXggbmFtZXMgc2hvd24gaW4gdGhlIGRpYWxvZyBiZWZvcmUgY29sbGFwc2luZyBpbnRvIGEgXCIrTiBtb3JlXCIgbGluZSAqL1xuY29uc3QgTUFYX1ZJU0lCTEVfTkFNRVMgPSA4O1xuXG4vKipcbiAqIENvbmZpcm1hdGlvbiBkaWFsb2cgZm9yIERlbGV0ZSBzbGlkZXMuIExpc3RzIHRoZSBub3RlcyBhYm91dCB0byBiZVxuICogdHJhc2hlZCAobnVtYmVyZWQgbGlrZSB0aGUgcGFuZWwsIHNvIHRoZSB1c2VyIGNhbiBtYXAgdGhlbSAxOjEpLCBvZmZlcnNcbiAqIGEgXCJkb24ndCBhc2sgYWdhaW5cIiB0b2dnbGUgdGhhdCBmbGlwcyB0aGUgYGNvbmZpcm1EZWxldGVTbGlkZXNgIHNldHRpbmdcbiAqIG9mZiAocGVyc2lzdGVkIGJ5IHRoZSBjYWxsZXIgdmlhIG9uRG9udEFzayksIGFuZCBhc2tzIGZvciBhbiBleHBsaWNpdFxuICogQ2FuY2VsIC8gRGVsZXRlIGRlY2lzaW9uLlxuICovXG5leHBvcnQgY2xhc3MgQ29uZmlybURlbGV0ZU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGNvbmZpcm1lZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFwcDogQXBwLFxuICAgIHByaXZhdGUgbmFtZXM6IHN0cmluZ1tdLFxuICAgIHByaXZhdGUgb25Db25maXJtOiAoKSA9PiB2b2lkLFxuICAgIHByaXZhdGUgb25Eb250QXNrOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICApIHtcbiAgICBzdXBlcihhcHApO1xuICB9XG5cbiAgb25PcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgdGhpcy5tb2RhbEVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZVwiKTtcblxuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5uYW1lcy5sZW5ndGg7XG4gICAgdGhpcy5jb250ZW50RWwuY3JlYXRlRWwoXCJoM1wiLCB7XG4gICAgICBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS10aXRsZVwiLFxuICAgICAgdGV4dDogY291bnQgPT09IDEgPyBcIkRlbGV0ZSB0aGlzIHNsaWRlP1wiIDogYERlbGV0ZSAke2NvdW50fSBzbGlkZXM/YCxcbiAgICB9KTtcbiAgICB0aGlzLmNvbnRlbnRFbFxuICAgICAgLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXN1YlwiIH0pXG4gICAgICAuc2V0VGV4dChcbiAgICAgICAgY291bnQgPT09IDFcbiAgICAgICAgICA/IFwiVGhlIG5vdGUgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCJcbiAgICAgICAgICA6IFwiVGhlc2Ugbm90ZXMgd2lsbCBiZSBtb3ZlZCB0byB0aGUgdHJhc2guXCIsXG4gICAgICApO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWxpc3RcIiB9KTtcbiAgICBmb3IgKGNvbnN0IFtpLCBuYW1lXSBvZiB0aGlzLm5hbWVzLnNsaWNlKDAsIE1BWF9WSVNJQkxFX05BTUVTKS5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGxpc3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtcm93XCIgfSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW51bVwiIH0pLnNldFRleHQoU3RyaW5nKGkgKyAxKSk7XG4gICAgICByb3cuY3JlYXRlU3Bhbih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW5hbWVcIiB9KS5zZXRUZXh0KG5hbWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lcy5sZW5ndGggPiBNQVhfVklTSUJMRV9OQU1FUykge1xuICAgICAgbGlzdFxuICAgICAgICAuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtbW9yZVwiIH0pXG4gICAgICAgIC5zZXRUZXh0KGBcdTIwMjYgYW5kICR7dGhpcy5uYW1lcy5sZW5ndGggLSBNQVhfVklTSUJMRV9OQU1FU30gbW9yZWApO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGREb250QXNrUm93KCk7XG4gICAgdGhpcy5idWlsZEFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKiBDb21wYWN0IGxlZnQtYWxpZ25lZCBcImRvbid0IGFzayBhZ2FpblwiIGNoZWNrYm94IHJvdyAqL1xuICBwcml2YXRlIGJ1aWxkRG9udEFza1JvdygpOiB2b2lkIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1kb250YXNrXCIgfSk7XG4gICAgcm93LmNyZWF0ZUVsKFwibGFiZWxcIikuc2V0VGV4dChcIkRvbid0IGFzayBhZ2FpblwiKTtcbiAgICBjb25zdCBjaGVja2JveCA9IHJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdm9pZCB0aGlzLm9uRG9udEFzaygpLnRoZW4oXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBjaGVja2JveC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICAvLyBrZWVwIHRoZSBjaGVja2JveCBlbmFibGVkIGlmIHBlcnNpc3RpbmcgdGhlIHByZWZlcmVuY2UgZmFpbGVkXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJpZ2h0LWFsaWduZWQgQ2FuY2VsIC8gRGVsZXRlIGJ1dHRvbiByb3cgKi9cbiAgcHJpdmF0ZSBidWlsZEFjdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLWFjdGlvbnNcIiB9KTtcbiAgICBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJDYW5jZWxcIiB9KS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICBhY3Rpb25zXG4gICAgICAuY3JlYXRlRWwoXCJidXR0b25cIiwgeyB0ZXh0OiBcIkRlbGV0ZVwiLCBjbHM6IFwibW9kLXdhcm5pbmdcIiB9KVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY29uZmlybWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBvbkNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbmZpcm1lZCkgdGhpcy5vbkNvbmZpcm0oKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIHR5cGUgU2V0dGluZ0RlZmluaXRpb25JdGVtIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBOYXRpdmVTbGlkZXNQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcbmltcG9ydCB7IFNMSURFU19USEVNRVMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKipcbiAqIFNldHRpbmdzIHRhYjogdG9nZ2xlcyB0aGUgbmF2IGJ1dHRvbnMsIHBhZ2UgbnVtYmVyLCBhdXRvLWVudGVyIGFuZCBiYXJcbiAqIHZpc2liaWxpdHkuIERlY2xhcmF0aXZlIGRlZmluaXRpb25zIChPYnNpZGlhbiBcdTIyNjUgMS4xMy4wLCBzZWFyY2hhYmxlIGluIHRoZVxuICogc2V0dGluZ3MgbW9kYWwpIHdpdGggYW4gaW1wZXJhdGl2ZSBgZGlzcGxheSgpYCBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGx1Z2luOiBOYXRpdmVTbGlkZXNQbHVnaW4pIHtcbiAgICBzdXBlcihwbHVnaW4uYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgLyoqIERlY2xhcmF0aXZlIHNldHRpbmdzIChPYnNpZGlhbiBcdTIyNjUgMS4xMy4wKSBcdTIwMTQgc2VhcmNoYWJsZSBieSB0aGUgc2V0dGluZ3MgbW9kYWwuICovXG4gIGdldFNldHRpbmdEZWZpbml0aW9ucygpOiBTZXR0aW5nRGVmaW5pdGlvbkl0ZW1bXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTdHlsZSB0ZW1wbGF0ZVwiLFxuICAgICAgICBkZXNjOiBcIkJ1aWx0LWluIGxvb2sgZm9yIHRoZSBzbGlkZXMgY2FyZCBhbmQgc2xpZGVzIGJhciAoYm9yZGVyLCBiYWNrZ3JvdW5kLCBzaGFkb3csIGJhciBzdHlsaW5nKS4gRXZlcnkgdGVtcGxhdGUgYWRhcHRzIHRvIGxpZ2h0IGFuZCBkYXJrIHRoZW1lcy5cIixcbiAgICAgICAgY29udHJvbDoge1xuICAgICAgICAgIGtleTogXCJzbGlkZXNUaGVtZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZHJvcGRvd25cIixcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuZnJvbUVudHJpZXMoU0xJREVTX1RIRU1FUy5tYXAoKHQpID0+IFt0LmlkLCB0LmxhYmVsXSkpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJDZW50ZXIgaW1hZ2VzXCIsXG4gICAgICAgIGRlc2M6IFwiSW1hZ2VzIHJlbmRlciBjZW50ZXJlZCBvbiB0aGUgc2xpZGUgYXMgYSBjYXJkIGJsb2NrIGV4YWN0bHkgYXMgdGFsbCBhcyB0aGUgcGljdHVyZS4gVHVybiBvZmYgZm9yIE9ic2lkaWFuJ3MgdXN1YWwgYmVoYXZpb3I6IGltYWdlcyBzdGF5IGlubGluZSB3aXRoIHRoZSB0ZXh0IChhIHNtYWxsIGltYWdlIGFuZCBpdHMgY2FwdGlvbiBzaXQgb24gdGhlIHNhbWUgcm93KS5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiaW1hZ2VMYXlvdXRcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHNsaWRlcyBiYXJcIixcbiAgICAgICAgZGVzYzogXCJNYXN0ZXIgdG9nZ2xlIGZvciB0aGUgZW50aXJlIHNsaWRlcyBiYXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93XCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dTbGlkZXNCYXJcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHByZXZpb3VzL25leHQgYnV0dG9uc1wiLFxuICAgICAgICBkZXNjOiBcIlNob3cgXHUyNUMwIFx1MjVCNiBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyIHdoZW4gdGhlIG5vdGUgYmVsb25ncyB0byBhIGRlY2sgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSlcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd05hdkJ1dHRvbnNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJQYWdlIG51bWJlciBzdHlsZVwiLFxuICAgICAgICBkZXNjOiAnU2hvd24gYXQgdGhlIGJvdHRvbS1yaWdodC4gXCJuIC8gdG90YWxcIjogMS1iYXNlZCBvdmVyIHRoZSB3aG9sZSBkZWNrIGNoYWluIChoZWFkIHNsaWRlID0gMSkuIFwiblwiOiBqdXN0IHRoZSBjdXJyZW50IHBhZ2UgbnVtYmVyLiBcIm5vbmVcIjogaGlkZGVuLicsXG4gICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICBrZXk6IFwicGFnZU51bWJlclN0eWxlXCIsXG4gICAgICAgICAgdHlwZTogXCJkcm9wZG93blwiLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGZyYWN0aW9uOiBcIk4gLyBUb3RhbFwiLFxuICAgICAgICAgICAgY3VycmVudDogXCJOXCIsXG4gICAgICAgICAgICBub25lOiBcIk5vbmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTaG93IHByb2dyZXNzIGJhclwiLFxuICAgICAgICBkZXNjOiBcIkRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyIC0tIG9uZSBwZXIgc2xpZGUsIGNsaWNrIHRvIGp1bXBcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwic2hvd1Byb2dyZXNzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQXV0by1lbnRlciBzbGlkZXMgbW9kZVwiLFxuICAgICAgICBkZXNjOiBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJhdXRvRW50ZXJTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJFc2NhcGUgZXhpdHMgc2xpZGVzIG1vZGVcIixcbiAgICAgICAgZGVzYzogXCJQcmVzcyBlc2NhcGUgdG8gbGVhdmUgc2xpZGVzIG1vZGUgYW5kIHJldHVybiB0byB0aGUgcHJldmlvdXMgdmlld1wiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJlc2NFeGl0c1NsaWRlc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIlNsaWRlcyB0aXRsZVwiLFxuICAgICAgICBkZXNjOiBcIkZyb250bWF0dGVyIHByb3BlcnR5IHRvIHNob3cgYXMgdGhlIGNhcmQgdGl0bGUgKEgxKS4gTGVhdmUgZW1wdHkgZm9yIG5vbmU7IHR5cGUgYGZpbGVuYW1lYCB0byB1c2UgdGhlIGZpbGUgbmFtZSBcdTIwMTQgdGhhdCB0aXRsZSBpcyBlZGl0YWJsZSAocmVuYW1lcyB0aGUgbm90ZSk7IHByb3BlcnR5LWJhY2tlZCB0aXRsZXMgYXJlIHJlYWQtb25seSAoZWRpdCB0aGUgcHJvcGVydHkgb3V0c2lkZSBzbGlkZXMgbW9kZSkuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNsaWRlc1RpdGxlXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJFLmcuIFRpdGxlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQmFyIHByb3BlcnRpZXNcIixcbiAgICAgICAgZGVzYzogXCJDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgdG8gc2hvdyBpbiB0aGUgc2xpZGVzIGJhciAoZS5nLiBgdW5pdmVyc2l0eSwgc2hvcnQtdGl0bGUsIGRhdGVgKS4gRWFjaCB2YWx1ZSBmaWxscyBhbiBlcXVhbC13aWR0aCBjb2x1bW47IGRyYWcgZGl2aWRlcnMgdG8gcmVzaXplLiBMZWF2ZSBlbXB0eSB0byBzaG93IG5vdGhpbmcuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImJhclByb3BlcnRpZXNcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIkUuZy4gVW5pdmVyc2l0eSwgZGF0ZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkNvbmZpcm0gc2xpZGUgZGVsZXRpb25cIixcbiAgICAgICAgZGVzYzogXCJBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHNsaWRlcyBwYW5lbCdzIHJpZ2h0LWNsaWNrIG1lbnUuIERlbGV0aW9uIG1vdmVzIHNsaWRlcyB0byB0aGUgdHJhc2guXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImNvbmZpcm1EZWxldGVTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJOYXZpZ2F0aW9uIGhvdGtleXNcIixcbiAgICAgICAgZGVzYzogXCJEZWZhdWx0OiBQcmV2aW91cyBwYWdlIG1vZCtzaGlmdCtcdTIxOTAsIG5leHQgcGFnZSBtb2Qrc2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgc2V0dGluZ3MgXHUyMTkyIGhvdGtleXMuXCIsXG4gICAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICAvKiogUGVyc2lzdCBjb250cm9sIGNoYW5nZXMsIHRoZW4gcmVmcmVzaCB0aGUgYmFyIHNvIHRoZSBuZXcgc2V0dGluZyBhcHBsaWVzLiAqL1xuICBzZXRDb250cm9sVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogdm9pZCB7XG4gICAgdm9pZCB0aGlzLmFwcGx5Q29udHJvbFZhbHVlKGtleSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBhcHBseUNvbnRyb2xWYWx1ZShrZXk6IHN0cmluZywgdmFsdWU6IHVua25vd24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAodGhpcy5wbHVnaW4uc2V0dGluZ3MgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilba2V5XSA9IHZhbHVlO1xuICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBJbXBlcmF0aXZlIGZhbGxiYWNrIGZvciBPYnNpZGlhbiA8IDEuMTMuMCAobm90IGNhbGxlZCB3aXRoIGRlZmluaXRpb25zIHByZXNlbnQpLiAqL1xuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTdHlsZSB0ZW1wbGF0ZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQnVpbHQtaW4gbG9vayBmb3IgdGhlIHNsaWRlcyBjYXJkIGFuZCBzbGlkZXMgYmFyIChib3JkZXIsIGJhY2tncm91bmQsIHNoYWRvdywgYmFyIHN0eWxpbmcpLiBFdmVyeSB0ZW1wbGF0ZSBhZGFwdHMgdG8gbGlnaHQgYW5kIGRhcmsgdGhlbWVzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgU0xJREVTX1RIRU1FUykgZHJvcGRvd24uYWRkT3B0aW9uKHQuaWQsIHQubGFiZWwpO1xuICAgICAgICBkcm9wZG93bi5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaGVtZSkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGhlbWUgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ2VudGVyIGltYWdlc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiSW1hZ2VzIHJlbmRlciBjZW50ZXJlZCBvbiB0aGUgc2xpZGUgYXMgYSBjYXJkIGJsb2NrIGV4YWN0bHkgYXMgdGFsbCBhcyB0aGUgcGljdHVyZS4gVHVybiBvZmYgZm9yIE9ic2lkaWFuJ3MgdXN1YWwgYmVoYXZpb3I6IGltYWdlcyBzdGF5IGlubGluZSB3aXRoIHRoZSB0ZXh0IChhIHNtYWxsIGltYWdlIGFuZCBpdHMgY2FwdGlvbiBzaXQgb24gdGhlIHNhbWUgcm93KS5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmltYWdlTGF5b3V0KS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbWFnZUxheW91dCA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgc2xpZGVzIGJhclwiKVxuICAgICAgLnNldERlc2MoXCJNYXN0ZXIgdG9nZ2xlIGZvciB0aGUgZW50aXJlIHNsaWRlcyBiYXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgd2luZG93XCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93U2xpZGVzQmFyKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93U2xpZGVzQmFyID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBwcmV2aW91cy9uZXh0IGJ1dHRvbnNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlNob3cgXHUyNUMwIFx1MjVCNiBidXR0b25zIG9uIHRoZSBsZWZ0IG9mIHRoZSBzbGlkZXMgYmFyIHdoZW4gdGhlIG5vdGUgYmVsb25ncyB0byBhIGRlY2sgKGhhcyBhIGBkZWNrYCBwcm9wZXJ0eSlcIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dOYXZCdXR0b25zKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlBhZ2UgbnVtYmVyIHN0eWxlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgJ1Nob3duIGF0IHRoZSBib3R0b20tcmlnaHQuIFwibiAvIHRvdGFsXCI6IDEtYmFzZWQgb3ZlciB0aGUgd2hvbGUgZGVjayBjaGFpbiAoaGVhZCBzbGlkZSA9IDEpLiBcIm5cIjoganVzdCB0aGUgY3VycmVudCBwYWdlIG51bWJlci4gXCJub25lXCI6IGhpZGRlbi4nLFxuICAgICAgKVxuICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bikgPT5cbiAgICAgICAgZHJvcGRvd25cbiAgICAgICAgICAuYWRkT3B0aW9ucyh7XG4gICAgICAgICAgICBmcmFjdGlvbjogXCJOIC8gVG90YWxcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IFwiTlwiLFxuICAgICAgICAgICAgbm9uZTogXCJOb25lXCIsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucGFnZU51bWJlclN0eWxlKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSA9IHZhbHVlIGFzIFwiZnJhY3Rpb25cIiB8IFwiY3VycmVudFwiIHwgXCJub25lXCI7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2hvdyBwcm9ncmVzcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkRpc2NyZXRlIGNsaWNrYWJsZSBzZWdtZW50cyBhdCB0aGUgdG9wIG9mIHRoZSBzbGlkZXMgYmFyIC0tIG9uZSBwZXIgc2xpZGUsIGNsaWNrIHRvIGp1bXBcIixcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1Byb2dyZXNzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQXV0by1lbnRlciBzbGlkZXMgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiT3BlbiBkZWNrIG5vdGVzIGRpcmVjdGx5IGluIFNsaWRlcyBtb2RlLiBMZWF2ZSBvZmYgdG8gZW50ZXIgbWFudWFsbHkgd2l0aCB0aGUgVG9nZ2xlIFNsaWRlcyBNb2RlIGNvbW1hbmQgKE1vZCtTaGlmdCtFKSBvciB0aGUgcHJldmlvdXMvbmV4dCBwYWdlIGhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9FbnRlclNsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkVzY2FwZSBleGl0cyBzbGlkZXMgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXCJQcmVzcyBlc2NhcGUgdG8gbGVhdmUgc2xpZGVzIG1vZGUgYW5kIHJldHVybiB0byB0aGUgcHJldmlvdXMgdmlld1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTbGlkZXMgdGl0bGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkZyb250bWF0dGVyIHByb3BlcnR5IHRvIHNob3cgYXMgdGhlIGNhcmQgdGl0bGUgKEgxKS4gTGVhdmUgZW1wdHkgZm9yIG5vbmU7IHR5cGUgYGZpbGVuYW1lYCB0byB1c2UgdGhlIGZpbGUgbmFtZS5cIixcbiAgICAgIClcbiAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICB0ZXh0XG4gICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwiRS5nLiBUaXRsZVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaXRsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zbGlkZXNUaXRsZSA9IHZhbHVlO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkJhciBwcm9wZXJ0aWVzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJDb21tYS1zZXBhcmF0ZWQgZnJvbnRtYXR0ZXIgcHJvcGVydHkgbmFtZXMgdG8gc2hvdyBpbiB0aGUgc2xpZGVzIGJhciAoZS5nLiBgdW5pdmVyc2l0eSwgc2hvcnQtdGl0bGUsIGRhdGVgKS4gRWFjaCB2YWx1ZSBmaWxscyBhbiBlcXVhbC13aWR0aCBjb2x1bW47IGRyYWcgZGl2aWRlcnMgdG8gcmVzaXplLiBMZWF2ZSBlbXB0eSB0byBzaG93IG5vdGhpbmcuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkUuZy4gVW5pdmVyc2l0eSwgZGF0ZVwiKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzKVxuICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmJhclByb3BlcnRpZXMgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJDb25maXJtIHNsaWRlIGRlbGV0aW9uXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJBc2sgZm9yIGNvbmZpcm1hdGlvbiBiZWZvcmUgZGVsZXRpbmcgc2xpZGVzIGZyb20gdGhlIHNsaWRlcyBwYW5lbCdzIHJpZ2h0LWNsaWNrIG1lbnUuIERlbGV0aW9uIG1vdmVzIHNsaWRlcyB0byB0aGUgdHJhc2guXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJOYXZpZ2F0aW9uIGhvdGtleXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkRlZmF1bHQ6IFByZXZpb3VzIHBhZ2UgbW9kK3NoaWZ0K1x1MjE5MCwgbmV4dCBwYWdlIG1vZCtzaGlmdCtcdTIxOTIuIFJlYmluZCB1bmRlciBzZXR0aW5ncyBcdTIxOTIgaG90a2V5cy5cIixcbiAgICAgIClcbiAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT5cbiAgICAgICAgYnV0dG9uLnNldEJ1dHRvblRleHQoXCJPcGVuIGhvdGtleXMgc2V0dGluZ3NcIikub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgLy8gT3BlbiBPYnNpZGlhbidzIGhvdGtleXMgc2V0dGluZ3MgcGFnZSAoaW50ZXJuYWwgQVBJOyBpZ25vcmUgZmFpbHVyZXMpXG4gICAgICAgICAgKFxuICAgICAgICAgICAgdGhpcy5hcHAgYXMgdW5rbm93biBhcyB7IHNldHRpbmc/OiB7IG9wZW5UYWJCeUlkPzogKGlkOiBzdHJpbmcpID0+IHZvaWQgfSB9XG4gICAgICAgICAgKS5zZXR0aW5nPy5vcGVuVGFiQnlJZD8uKFwiaG90a2V5c1wiKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuICB9XG59XG4iLCAiLyoqIFJlbW92ZSBhbGwgY2hpbGRyZW4gb2YgYW4gZWxlbWVudCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2hpbGRyZW4oZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gIHdoaWxlIChlbC5maXJzdENoaWxkKSBlbC5yZW1v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dEUsQ0FBQztBQUNELFlBQUksaUJBQWlCLFNBQVMsTUFBTSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDdkQsaUJBQVMsWUFBWSxHQUFHO0FBQUEsTUFDMUI7QUFDQSxXQUFLLElBQUksWUFBWSxRQUFRO0FBQUEsSUFDL0I7QUFJQSxTQUFLLElBQUksYUFBYSxFQUFFLFNBQVMsS0FBSyxJQUFJLHNCQUFzQixJQUFJLFNBQVMsR0FBRyxDQUFDO0FBQUEsRUFDbkY7QUFDRjtBQUdBLFNBQVMsYUFBYSxPQUFnQixPQUFrQztBQUN0RSxTQUNFLE1BQU0sUUFBUSxLQUFLLEtBQUssTUFBTSxXQUFXLFNBQVMsTUFBTSxNQUFNLENBQUMsTUFBTSxPQUFPLE1BQU0sUUFBUTtBQUU5RjsiLAogICJuYW1lcyI6IFsiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJuZXdOYW1lIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIl0KfQo=
