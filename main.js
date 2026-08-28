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
    id: "ns-copy-slide-skill",
    name: "Copy slide layout info for AI agent",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvYmFyLnRzIiwgInNyYy9jYXBhY2l0eS50cyIsICJzcmMvY2FwYWNpdHktY29yZS50cyIsICJzcmMvZGVidWcudHMiLCAic3JjL21vZGUudHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9jb21tYW5kcy50cyIsICJzcmMvZGVjay1zZXJ2aWNlLnRzIiwgInNyYy9kZWNrLnRzIiwgInNyYy9jcmVhdGVOZXh0LnRzIiwgInNyYy9kZWxldGVTbGlkZXMudHMiLCAic3JjL3BhbmVsLnRzIiwgInNyYy9jb25maXJtLWRlbGV0ZS50cyIsICJzcmMvc2V0dGluZ3MudHMiLCAic3JjL3V0aWxzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIG5hdGl2ZS1zbGlkZXMgXHUyMDE0IGEgXCJTbGlkZXMgbW9kZVwiIGZvciBPYnNpZGlhbiBkZWNrIG5vdGVzXG4gKlxuICogT25lIHJlc2VydmVkIGZyb250bWF0dGVyIGtleSwgYGRlY2tgIChhIHNpbmdsZSBtYXJrZG93biBsaW5rIHRvIHRoZSBuZXh0XG4gKiBzbGlkZSBcdTIwMTQgbmV4dC1vbmx5IHNlbWFudGljcywgbm8gb3ZlcnZpZXcgcGFnZSBzaW5jZSB2MS4wLjApLCBkcml2ZXNcbiAqIHByZXYvbmV4dCBuYXZpZ2F0aW9uIGFuZCBhdXRvLWNvbXB1dGVkIHBhZ2UgbnVtYmVycy4gQSBkZWNrIG5vdGUgY2FuIGJlXG4gKiBlbnRlcmVkIGludG8gKipTbGlkZXMgbW9kZSoqIFx1MjAxNCBhbiBpbW1lcnNpdmUsIGVkaXRhYmxlIChMaXZlIFByZXZpZXcpIHZpZXdcbiAqIHdpdGggYSBzbGlkZXMgYmFyIHNob3dpbmcgcHJvcGVydGllcywgbmF2aWdhdGlvbiBhbmQgdGhlIHBhZ2UgbnVtYmVyLlxuICpcbiAqIE5hdGl2ZSBPYnNpZGlhbiBtb2RlcyAoU291cmNlIC8gZGVmYXVsdCBMaXZlIFByZXZpZXcgLyBSZWFkaW5nIHZpZXcpIGFyZVxuICogbGVmdCBjb21wbGV0ZWx5IHVudG91Y2hlZDogbm8gc3RhdHVzLWJhciBoaWRpbmcsIG5vIHNsaWRlcyBiYXIsIG5vXG4gKiBmdWxsc2NyZWVuLCBubyBzdHlsaW5nLiBTbGlkZXMgbW9kZSBpcyB0aGUgcGx1Z2luJ3Mgb25seSBzdXJmYWNlLlxuICpcbiAqIFRoaXMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgYW5kIGEgdGhpbiBvcmNoZXN0cmF0aW9uIGxheWVyOyB0aGUgbG9naWNcbiAqIGxpdmVzIGluIGBzcmMvYDpcbiAqICAgLSBzcmMvdHlwZXMudHMgICAgICAgIHNldHRpbmdzIHNoYXBlICsgZGVmYXVsdHMgKyByZXNlcnZlZCBgZGVja2Aga2V5XG4gKiAgIC0gc3JjL21vZGUudHMgICAgICAgICB2aWV3IG1vZGUgLyBmcm9udG1hdHRlciBoZWxwZXJzIChwdXJlLCBgQXBwYC1iYXNlZClcbiAqICAgLSBzcmMvZGVjay1zZXJ2aWNlLnRzIGRlY2sgY2hhaW4gcmVzb2x1dGlvbiArIFwiY3JlYXRlIG5leHQgc2xpZGVcIiBnbHVlXG4gKiAgIC0gc3JjL2Jhci50cyAgICAgICAgICBiYXIgRE9NIGhlbHBlcnMgKGNyZWF0ZSAvIGJ1dHRvbnMgLyB0YWItYmFyIG1lYXN1cmUpXG4gKiAgIC0gc3JjL3BhbmVsLnRzICAgICAgICBzbGlkZXMgc2lkZWJhciBwYW5lbCAoZGVjayBzbGlkZSBsaXN0KVxuICogICAtIHNyYy9jb21tYW5kcy50cyAgICAgY29tbWFuZCByZWdpc3RyYXRpb24gKGRldi1nYXRlZCBkZWJ1ZyBjb21tYW5kKVxuICogICAtIHNyYy9zZXR0aW5ncy50cyAgICAgc2V0dGluZ3MgdGFiXG4gKiAgIC0gc3JjL2RlYnVnLnRzICAgICAgICB0eXBvZ3JhcGh5IG1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSlcbiAqICAgLSBzcmMvZGVjay50cyAgICAgICAgIHB1cmUgZGVjayBjb3JlICh3aXRoIHNyYy9jcmVhdGVOZXh0LnRzKVxuICovXG5cbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgY3JlYXRlQmFyLCBuYXZCdXR0b24sIHN5bmNUYWJCYXJIZWlnaHQgfSBmcm9tIFwiLi9zcmMvYmFyXCI7XG5pbXBvcnQgeyByZWdpc3RlckNvbW1hbmRzIH0gZnJvbSBcIi4vc3JjL2NvbW1hbmRzXCI7XG5pbXBvcnQgeyBEZWNrU2VydmljZSB9IGZyb20gXCIuL3NyYy9kZWNrLXNlcnZpY2VcIjtcbmltcG9ydCB7IGZvcm1hdFZhbHVlIH0gZnJvbSBcIi4vc3JjL2RlY2tcIjtcbmltcG9ydCB7IGFjdGl2ZUZyb250bWF0dGVyLCBjdXJyZW50TW9kZSwgZnJvbnRtYXR0ZXJPZiwgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL3NyYy9tb2RlXCI7XG5pbXBvcnQgeyBTbGlkZXNQYW5lbFZpZXcsIFNMSURFU19QQU5FTF9WSUVXIH0gZnJvbSBcIi4vc3JjL3BhbmVsXCI7XG5pbXBvcnQgeyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiIH0gZnJvbSBcIi4vc3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBERUNLX0tFWSwgREVGQVVMVF9TRVRUSU5HUywgU0xJREVTX1RIRU1FUywgdHlwZSBOYXRpdmVTbGlkZXNTZXR0aW5ncyB9IGZyb20gXCIuL3NyYy90eXBlc1wiO1xuaW1wb3J0IHsgY2xlYXJDaGlsZHJlbiB9IGZyb20gXCIuL3NyYy91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXRpdmVTbGlkZXNQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAvKiogVGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKi9cbiAgYmFyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvKiogRGVjayBjaGFpbiByZXNvbHV0aW9uICsgXCJjcmVhdGUgbmV4dCBzbGlkZVwiIGdsdWUgKi9cbiAgZGVja1NlcnZpY2UhOiBEZWNrU2VydmljZTtcbiAgLyoqIFBsdWdpbiBzZXR0aW5ncyAqL1xuICBzZXR0aW5nczogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7IC4uLkRFRkFVTFRfU0VUVElOR1MgfTtcblxuICAvKiogV2hldGhlciBTbGlkZXMgbW9kZSBpcyBjdXJyZW50bHkgYWN0aXZlIChzZXNzaW9uIHN0YXRlLCBub3QgcGVyc2lzdGVkKSAqL1xuICBwcml2YXRlIHNsaWRlc01vZGUgPSBmYWxzZTtcbiAgLyoqIFZpZXcgbW9kZSB0byByZXN0b3JlIHdoZW4gbGVhdmluZyBTbGlkZXMgbW9kZSAoXCJwcmV2aWV3XCIgfCBcInNvdXJjZVwiKSAqL1xuICBwcml2YXRlIGV4aXRNb2RlOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgPSBcInNvdXJjZVwiO1xuICAvKiogV2hldGhlciB0aGUgZXhpdCB2aWV3IHdhcyBTb3VyY2UgbW9kZSAodHJ1ZSkgdnMgTGl2ZSBQcmV2aWV3IChmYWxzZSkgKi9cbiAgcHJpdmF0ZSBleGl0U291cmNlID0gZmFsc2U7XG4gIC8qKiBMYXN0IG5vdGUgYXV0by1lbnRlcmVkIGludG8gU2xpZGVzIG1vZGUgKHByZXZlbnRzIHJlLWVudGVyaW5nIGFmdGVyIG1hbnVhbCBleGl0KSAqL1xuICBwcml2YXRlIGF1dG9FbnRlcmVkUGF0aCA9IFwiXCI7XG4gIC8qKiBMYXN0IHJlZnJlc2gga2V5IChcInBhdGh8bW9kZVwiKSB0byBhdm9pZCBwb2ludGxlc3MgcmUtcmVuZGVycyAqL1xuICBwcml2YXRlIGxhc3RLZXkgPSBcIlwiO1xuICAvKiogTGFzdCBtZWFzdXJlZCB0YWItYmFyIGhlaWdodCAocHgpIFx1MjAxNCBjYWNoZWQgd2hpbGUgdGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuICovXG4gIHByaXZhdGUgdGFiQmFySGVpZ2h0ID0gMDtcbiAgLyoqIFdoZXRoZXIgdGhlIG1vdXNlIHBvaW50ZXIgaXMgaGlkZGVuIGZvciBwcmVzZW50aW5nIChzZXNzaW9uIHN0YXRlKSAqL1xuICBwb2ludGVySGlkZGVuID0gZmFsc2U7XG5cbiAgYXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgdGhpcy5kZWNrU2VydmljZSA9IG5ldyBEZWNrU2VydmljZSh0aGlzLmFwcCk7XG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBOYXRpdmVTbGlkZXNTZXR0aW5nVGFiKHRoaXMpKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAxLiBSZWZyZXNoIG9uIFwiY3VycmVudCBub3RlIC8gdmlldyBjaGFuZ2VkXCIgZXZlbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubWF5YmVBdXRvRW50ZXJTbGlkZXMoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKCkgPT4gdGhpcy5yZWZyZXNoKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlZnJlc2goKSkpO1xuICAgIC8vIFJlZnJlc2ggd2hlbiB0aGUgbm90ZSBjb250ZW50IChpbmNsdWRpbmcgZnJvbnRtYXR0ZXIpIGNoYW5nZXMgLyBzYXZlc1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsIChmaWxlOiBURmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZSA9PT0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSkgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDIuIEZhbGxiYWNrIHRpbWVyOiBlZGl0XHUyMTk0cmVhZGluZyB0b2dnbGVzIG1heSBmaXJlIG5vIHN0YW5kYXJkIGV2ZW50IFx1MjUwMFx1MjUwMFxuICAgIHRoaXMucmVnaXN0ZXJJbnRlcnZhbChcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICBjb25zdCBrZXkgPSBmaWxlID8gYCR7ZmlsZS5wYXRofXwke2N1cnJlbnRNb2RlKHRoaXMuYXBwKX1gIDogXCJcIjtcbiAgICAgICAgaWYgKGtleSAhPT0gdGhpcy5sYXN0S2V5KSB7XG4gICAgICAgICAgdGhpcy5sYXN0S2V5ID0ga2V5O1xuICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICB9LCA1MDApLFxuICAgICk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgMy4gQ29tbWFuZHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgcmVnaXN0ZXJDb21tYW5kcyh0aGlzKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCAzYi4gU2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgb3ZlcnZpZXcsIHJlcGxhY2VzIHRoZSBvbGQgb3ZlcnZpZXcgcGFnZSkgXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlclZpZXcoU0xJREVTX1BBTkVMX1ZJRVcsIChsZWFmKSA9PiBuZXcgU2xpZGVzUGFuZWxWaWV3KHRoaXMsIGxlYWYpKTtcbiAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJwcmVzZW50YXRpb25cIiwgXCJTaG93IHNsaWRlcyBwYW5lbFwiLCAoKSA9PiB7XG4gICAgICB2b2lkIHRoaXMuYWN0aXZhdGVTbGlkZXNQYW5lbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDQuIFBpbiB0aGUgU2xpZGVzIGVkaXRvciB0byBvbmUgc2NyZWVuIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vIENTUyBgb3ZlcmZsb3c6IGhpZGRlbmAgYmxvY2tzIHRoZSB3aGVlbCwgYnV0IG5hdGl2ZSBkcmFnLXNlbGVjdFxuICAgIC8vIGF1dG9zY3JvbGwgYW5kIENvZGVNaXJyb3IncyBwcm9ncmFtbWF0aWMgc2Nyb2xsSW50b1ZpZXcgc3RpbGwgbW92ZSB0aGVcbiAgICAvLyBzY3JvbGxlci4gVGhpcyBjYXB0dXJlLXBoYXNlIGxpc3RlbmVyIHJlc2V0cyBhbnkgc2Nyb2xsIGluc2lkZSB0aGVcbiAgICAvLyBhY3RpdmUgbWFya2Rvd24gdmlldyBiYWNrIHRvIHRoZSB0b3Agd2hpbGUgU2xpZGVzIG1vZGUgaXMgYWN0aXZlLlxuICAgIHRoaXMucmVnaXN0ZXJEb21FdmVudChcbiAgICAgIGRvY3VtZW50LFxuICAgICAgXCJzY3JvbGxcIixcbiAgICAgIChldnQpID0+IHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKCF2aWV3KSByZXR1cm47XG4gICAgICAgIGNvbnN0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdmlldy5jb250ZW50RWwuY29udGFpbnMoZWwpKSB7XG4gICAgICAgICAgaWYgKGVsLnNjcm9sbFRvcCAhPT0gMCkgZWwuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICBpZiAoZWwuc2Nyb2xsTGVmdCAhPT0gMCkgZWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7IGNhcHR1cmU6IHRydWUgfSxcbiAgICApO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDUuIEVzY2FwZSBrZXkgZXhpdHMgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCBcImtleWRvd25cIiwgKGV2dDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IFwiRXNjYXBlXCIgJiYgdGhpcy5zbGlkZXNNb2RlICYmIHRoaXMuc2V0dGluZ3MuZXNjRXhpdHNTbGlkZXMpIHtcbiAgICAgICAgdGhpcy5leGl0U2xpZGVzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgNi4gQ3JlYXRlIHRoZSBzbGlkZXMgYmFyIGFuZCBkbyB0aGUgZmlyc3QgcmVuZGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHRoaXMuYmFyID0gY3JlYXRlQmFyKCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmJhcik7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBvbnVubG9hZCgpOiB2b2lkIHtcbiAgICB0aGlzLmJhcj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5iYXIgPSBudWxsO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuXCIpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm5hdGl2ZS1zbGlkZXMtYmxvY2staW1hZ2VzXCIpO1xuICAgIHRoaXMucmVtb3ZlVGhlbWVDbGFzc2VzKCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2V0dGluZ3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGRhdGEgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSBhcyBQYXJ0aWFsPE5hdGl2ZVNsaWRlc1NldHRpbmdzPiB8IG51bGw7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGRhdGEgPz8ge30pO1xuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2xpZGVzIG1vZGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBub3RlIGlzIGEgZGVjayBub3RlIChoYXMgYSBgZGVja2AgcHJvcGVydHkpICovXG4gIHByaXZhdGUgaXNEZWNrTm90ZShmaWxlOiBURmlsZSB8IG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIWZpbGUpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIHJldHVybiBmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgZXZlcnkgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtKmAgY2xhc3MgZnJvbSA8Ym9keT4gKi9cbiAgcHJpdmF0ZSByZW1vdmVUaGVtZUNsYXNzZXMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBjbHMgb2YgQXJyYXkuZnJvbShkb2N1bWVudC5ib2R5LmNsYXNzTGlzdCkpIHtcbiAgICAgIGlmIChjbHMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoY2xzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogS2VlcCB0aGUgc2luZ2xlIGBuYXRpdmUtc2xpZGVzLXRoZW1lLTxpZD5gIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgc2xpZGVzVGhlbWVgIHNldHRpbmcgXHUyMDE0IHRoZSBzdHlsZSB0ZW1wbGF0ZXMgaW4gc3R5bGVzLmNzcyBob29rIG9mZiBpdC5cbiAgICogVW5rbm93biBpZHMgKGUuZy4gYWZ0ZXIgYSBkb3duZ3JhZGUpIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCB0aGVtZS5cbiAgICovXG4gIHByaXZhdGUgYXBwbHlUaGVtZUNsYXNzKCk6IHZvaWQge1xuICAgIGNvbnN0IGlkID0gU0xJREVTX1RIRU1FUy5zb21lKCh0KSA9PiB0LmlkID09PSB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lKVxuICAgICAgPyB0aGlzLnNldHRpbmdzLnNsaWRlc1RoZW1lXG4gICAgICA6IERFRkFVTFRfU0VUVElOR1Muc2xpZGVzVGhlbWU7XG4gICAgY29uc3QgY2xzID0gYG5hdGl2ZS1zbGlkZXMtdGhlbWUtJHtpZH1gO1xuICAgIGZvciAoY29uc3QgYyBvZiBBcnJheS5mcm9tKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0KSkge1xuICAgICAgaWYgKGMuc3RhcnRzV2l0aChcIm5hdGl2ZS1zbGlkZXMtdGhlbWUtXCIpICYmIGMgIT09IGNscykgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgIH1cbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGUgaGlkaW5nIHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIGZvciBwcmVzZW50aW5nLiBIaWRpbmcgYWxzb1xuICAgKiBwYXJrcyBmb2N1cyAoYmx1cnMgdGhlIGVkaXRvciwgc28gdGhlIGNhcmV0IGRpc2FwcGVhcnMpOyBzaG93aW5nIGxlYXZlc1xuICAgKiBmb2N1cyBwYXJrZWQgXHUyMDE0IGNsaWNrIHNsaWRlIGNvbnRlbnQgdG8gcmVzdW1lIGVkaXRpbmcuXG4gICAqL1xuICB0b2dnbGVQb2ludGVyKCk6IHZvaWQge1xuICAgIHRoaXMucG9pbnRlckhpZGRlbiA9ICF0aGlzLnBvaW50ZXJIaWRkZW47XG4gICAgaWYgKHRoaXMucG9pbnRlckhpZGRlbikge1xuICAgICAgY29uc3QgYWN0aXZlID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEtlZXAgdGhlIGBuYXRpdmUtc2xpZGVzLXBvaW50ZXItaGlkZGVuYCBib2R5IGNsYXNzIGluIHN5bmMgd2l0aCB0aGVcbiAgICogcHJlc2VudGluZyBzdGF0ZSBcdTIwMTQgc3R5bGVzLmNzcyB0dXJucyBldmVyeSBjdXJzb3IgaW52aXNpYmxlIHdoaWxlIHNldC5cbiAgICogTGVhdmluZyBTbGlkZXMgbW9kZSBhbHdheXMgcmVzdG9yZXMgdGhlIHBvaW50ZXIuXG4gICAqL1xuICBwcml2YXRlIHN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKFwibmF0aXZlLXNsaWRlcy1wb2ludGVyLWhpZGRlblwiLCBzbGlkZXMgJiYgdGhpcy5wb2ludGVySGlkZGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwIHRoZSBgbmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNgIGJvZHkgY2xhc3MgaW4gc3luYyB3aXRoIHRoZVxuICAgKiBgaW1hZ2VMYXlvdXRgIHNldHRpbmcgXHUyMDE0IHN0eWxlcy5jc3MncyBpbWFnZS1sYXlvdXQgcnVsZXMgaG9vayBvZmYgaXQuXG4gICAqIFRoZSBjbGFzcyBpcyBvbmx5IG1lYW5pbmdmdWwgaW4gU2xpZGVzIG1vZGUuXG4gICAqL1xuICBwcml2YXRlIHN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlczogYm9vbGVhbik6IHZvaWQge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICAgIFwibmF0aXZlLXNsaWRlcy1ibG9jay1pbWFnZXNcIixcbiAgICAgIHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLmltYWdlTGF5b3V0LFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjYXJkIHRpdGxlIHBlciB0aGUgYHNsaWRlc1RpdGxlYCBzZXR0aW5nLiBcImZpbGVuYW1lXCIgcmVzdHlsZXNcbiAgICogdGhlIG5hdGl2ZSBpbmxpbmUgdGl0bGUgaW50byB0aGUgY2FyZCB0aXRsZSAoc3RpbGwgZWRpdGFibGUgXHUyMDE0IHR5cGluZ1xuICAgKiByZW5hbWVzIHRoZSBub3RlKTsgXCJcIiBzaG93cyBub3RoaW5nOyBhbnkgb3RoZXIgdmFsdWUgbmFtZXMgYSBmcm9udG1hdHRlclxuICAgKiBwcm9wZXJ0eSByZW5kZXJlZCByZWFkLW9ubHkgdmlhIHRoZSA6OmJlZm9yZSBwc2V1ZG8tZWxlbWVudC5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSW5saW5lVGl0bGUoc2xpZGVzOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgY29udGVudCA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICAgIGlmICghY29udGVudCB8fCAhZmlsZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgc3JjID0gdGhpcy5zZXR0aW5ncy5zbGlkZXNUaXRsZS50cmltKCk7XG5cbiAgICAvLyBcImZpbGVuYW1lXCI6IHJlc3R5bGUgdGhlIG5hdGl2ZSAuaW5saW5lLXRpdGxlIGludG8gdGhlIGNhcmQgdGl0bGUuIEl0XG4gICAgLy8gc3RheXMgY29udGVudGVkaXRhYmxlLCBzbyBlZGl0aW5nIGl0IHJlbmFtZXMgdGhlIG5vdGUgYXMgaW4gTGl2ZVxuICAgIC8vIFByZXZpZXcuIFRoZSBuYXRpdmUgaW5saW5lIHRpdGxlIGxpdmVzIG9uIHRoZSBtYXJrZG93bi1zb3VyY2Utdmlld1xuICAgIC8vIGVsZW1lbnQgKGEgc2libGluZyBicmFuY2ggb2YgdGhlIGNhcmQpLCBzbyB0aGUgc3R5bGluZyBob29rIGlzIGFcbiAgICAvLyB2aWV3IGF0dHJpYnV0ZSArIGEgYnJhbmQtbmV3IC5jbS1jb250ZW50IGF0dHJpYnV0ZSB0aGF0IHJlc2VydmVzIHRoZVxuICAgIC8vIHRpdGxlJ3MgaGVpZ2h0IHRoZSBzYW1lIHdheSB0aGUgcHNldWRvLWVsZW1lbnQgdmVyc2lvbiBkaWQuXG4gICAgY29uc3QgbmF0aXZlVGl0bGUgPSBzbGlkZXMgJiYgc3JjID09PSBcImZpbGVuYW1lXCI7XG4gICAgY29uc3Qgc291cmNlVmlldyA9IHZpZXc/LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5tYXJrZG93bi1zb3VyY2Utdmlld1wiKTtcbiAgICBpZiAobmF0aXZlVGl0bGUgJiYgc291cmNlVmlldykgc291cmNlVmlldy5zZXRBdHRyaWJ1dGUoXCJkYXRhLW5zLWlubGluZS10aXRsZVwiLCBcImZpbGVuYW1lXCIpO1xuICAgIGVsc2Ugc291cmNlVmlldz8ucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1ucy1pbmxpbmUtdGl0bGVcIik7XG4gICAgY29udGVudC50b2dnbGVBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZS1uYXRpdmVcIiwgbmF0aXZlVGl0bGUpO1xuXG4gICAgLy8gUHJvcGVydHktYmFja2VkIHRpdGxlcyByZW5kZXIgcmVhZC1vbmx5IHZpYSB0aGUgOjpiZWZvcmUgcHNldWRvLWVsZW1lbnRcbiAgICAvLyAobm8gZWRpdGluZyBzdXJmYWNlIFx1MjAxNCB0aGUgcHJvcGVydGllcyBwYW5lbCBpcyBoaWRkZW4gaW4gU2xpZGVzIG1vZGUpLlxuICAgIGxldCB0ZXh0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBpZiAoc2xpZGVzICYmIHNyYyAmJiBzcmMgIT09IFwiZmlsZW5hbWVcIikge1xuICAgICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICAgIGNvbnN0IHYgPSBmbT8uW3NyY107XG4gICAgICBpZiAodiAhPSBudWxsKSB0ZXh0ID0gZm9ybWF0VmFsdWUodik7XG4gICAgfVxuXG4gICAgaWYgKHRleHQpIGNvbnRlbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGVcIiwgdGV4dCk7XG4gICAgZWxzZSBjb250ZW50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpO1xuICB9XG5cbiAgLyoqIEVudGVyIFNsaWRlcyBtb2RlOiByZWNvcmQgdGhlIGV4aXQgc3RhdGUgYW5kIGZvcmNlIHRoZSBMaXZlIFByZXZpZXcgKi9cbiAgcHJpdmF0ZSBhc3luYyBlbnRlclNsaWRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICBpZiAodmlldykge1xuICAgICAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBtb2RlPzogc3RyaW5nOyBzb3VyY2U/OiBib29sZWFuIH07XG4gICAgICB0aGlzLmV4aXRNb2RlID0gc3RhdGUubW9kZSA9PT0gXCJwcmV2aWV3XCIgPyBcInByZXZpZXdcIiA6IFwic291cmNlXCI7XG4gICAgICB0aGlzLmV4aXRTb3VyY2UgPSBzdGF0ZS5zb3VyY2UgPT09IHRydWU7XG4gICAgICAvLyBTbGlkZXMgbW9kZSBpcyBhbHdheXMgdGhlIGVkaXRhYmxlIExpdmUgUHJldmlld1xuICAgICAgY29uc3QgbmV4dCA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIG5leHQuc3RhdGUgPSB7IC4uLm5leHQuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogZmFsc2UgfTtcbiAgICAgIGF3YWl0IHZpZXcubGVhZi5zZXRWaWV3U3RhdGUobmV4dCwgeyBmb2N1czogZmFsc2UgfSk7XG4gICAgfVxuICAgIHRoaXMuc2xpZGVzTW9kZSA9IHRydWU7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgLy8gUGluIHRoZSBzY3JvbGxlciB0byB0aGUgdG9wIGJlZm9yZSBhbnkgZnJhbWUgcmVuZGVyczogdGhlIHZpZXctc3RhdGVcbiAgICAvLyBjaGFuZ2UgYWJvdmUgbWF5IHJlc3RvcmUgaXQgdG8gdGhlIHNhdmVkIGN1cnNvciBsaW5lIHdpdGhvdXQgZmlyaW5nIGFcbiAgICAvLyBzY3JvbGwgZXZlbnQgYWZ0ZXJ3YXJkcywgc28gdGhlIGNhcHR1cmUtcGhhc2UgcmVzZXQgYmVsb3cgd291bGQgbmV2ZXJcbiAgICAvLyBydW4gYW5kIGEgbG9uZyBub3RlIHdvdWxkIG9wZW4gbWlkLWRvY3VtZW50LlxuICAgIGZvciAoY29uc3QgZWwgb2Ygdmlldz8uY29udGVudEVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KFwiLmNtLXNjcm9sbGVyXCIpID8/IFtdKSB7XG4gICAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSAwKSBlbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgaWYgKGVsLnNjcm9sbExlZnQgIT09IDApIGVsLnNjcm9sbExlZnQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFeGl0IFNsaWRlcyBtb2RlOiByZXN0b3JlIHRoZSB2aWV3IG1vZGUgcmVjb3JkZWQgYXQgZW50cnkgKi9cbiAgcHJpdmF0ZSBleGl0U2xpZGVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2xpZGVzTW9kZSA9IGZhbHNlO1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHZpZXcubGVhZi5nZXRWaWV3U3RhdGUoKTtcbiAgICAgIGlmICh0aGlzLmV4aXRNb2RlID09PSBcInByZXZpZXdcIikge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwicHJldmlld1wiIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5zdGF0ZSA9IHsgLi4uc3RhdGUuc3RhdGUsIG1vZGU6IFwic291cmNlXCIsIHNvdXJjZTogdGhpcy5leGl0U291cmNlIH07XG4gICAgICB9XG4gICAgICB2b2lkIHZpZXcubGVhZi5zZXRWaWV3U3RhdGUoc3RhdGUsIHsgZm9jdXM6IGZhbHNlIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGUgU2xpZGVzIG1vZGUgKGRlY2sgbm90ZXMgb25seSBcdTIwMTQgZW5mb3JjZWQgYnkgdGhlIGNvbW1hbmQpICovXG4gIHRvZ2dsZVNsaWRlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zbGlkZXNNb2RlKSB0aGlzLmV4aXRTbGlkZXMoKTtcbiAgICBlbHNlIHZvaWQgdGhpcy5lbnRlclNsaWRlcygpO1xuICB9XG5cbiAgLyoqIFJldmVhbCB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwsIGNyZWF0aW5nIGl0IGluIHRoZSByaWdodCBzaWRlYmFyIGlmIG5lZWRlZCAqL1xuICBhc3luYyBhY3RpdmF0ZVNsaWRlc1BhbmVsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShTTElERVNfUEFORUxfVklFVyk7XG4gICAgaWYgKGV4aXN0aW5nLmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGV4aXN0aW5nWzBdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpO1xuICAgIGlmICghbGVhZikgcmV0dXJuO1xuICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHsgdHlwZTogU0xJREVTX1BBTkVMX1ZJRVcsIGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICBhd2FpdCB0aGlzLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcbiAgfVxuXG4gIC8qKiBBdXRvLWVudGVyIFNsaWRlcyBtb2RlIG9uY2UgcGVyIG9wZW5lZCBkZWNrIG5vdGUgd2hlbiB0aGUgc2V0dGluZyBpcyBvbiAqL1xuICBwcml2YXRlIG1heWJlQXV0b0VudGVyU2xpZGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSB8fCBmaWxlLnBhdGggPT09IHRoaXMuYXV0b0VudGVyZWRQYXRoKSByZXR1cm47XG4gICAgdGhpcy5hdXRvRW50ZXJlZFBhdGggPSBmaWxlLnBhdGg7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzICYmIHRoaXMuaXNEZWNrTm90ZShmaWxlKSAmJiAhdGhpcy5zbGlkZXNNb2RlKSB7XG4gICAgICB2b2lkIHRoaXMuZW50ZXJTbGlkZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUFBUIG5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgLyoqIE1vdmUgb25lIHN0ZXAgYmFjay9mb3J3YXJkIGFsb25nIHRoZSBkZWNrIGNoYWluIChlbnRlcmluZyBTbGlkZXMgbW9kZSBhcyBuZWVkZWQpICovXG4gIGFzeW5jIG5hdmlnYXRlKGRpcmVjdGlvbjogXCJwcmV2XCIgfCBcIm5leHRcIik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgaWYgKCFkZWNrKSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltkaXJlY3Rpb24gPT09IFwicHJldlwiID8gZGVjay5pbmRleCAtIDEgOiBkZWNrLmluZGV4ICsgMV07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvKiogSnVtcCB0byBhIHNwZWNpZmljIGluZGV4IGluIHRoZSBkZWNrIGNoYWluIChwcm9ncmVzcyBiYXIgY2xpY2spICovXG4gIGFzeW5jIGp1bXBUbyhpbmRleDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKTtcbiAgICBpZiAoIWRlY2sgfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IGRlY2suY2hhaW4ubGVuZ3RoIHx8IGluZGV4ID09PSBkZWNrLmluZGV4KSByZXR1cm47XG4gICAgY29uc3QgdGFyZ2V0ID0gZGVjay5jaGFpbltpbmRleF07XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuc2xpZGVzTW9kZSkgYXdhaXQgdGhpcy5lbnRlclNsaWRlcygpO1xuICAgIHZvaWQgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0YXJnZXQsIGZpbGUucGF0aCk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgQmFyIHJlbmRlcmluZyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAvKipcbiAgICogR2V0IGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgdGhlIGJhciBwcm9wZXJ0aWVzLiBSZXR1cm5zIGFuIGFycmF5IG9mXG4gICAqIHBlcmNlbnRhZ2VzIChzdW1taW5nIHRvIDEwMCkgZm9yIGVhY2ggcHJvcGVydHkuIExvYWRzIGZyb20gc2V0dGluZ3Mgb3JcbiAgICogZGVmYXVsdHMgdG8gZXF1YWwgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBnZXRCYXJQcm9wZXJ0eVdpZHRocyhjb3VudDogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKHRoaXMuc2V0dGluZ3MuYmFyUHJvcGVydHlXaWR0aHMgfHwgXCJbXVwiKSBhcyB1bmtub3duO1xuICAgICAgaWYgKGlzTnVtYmVyTGlzdChzdG9yZWQsIGNvdW50KSkgcmV0dXJuIHN0b3JlZDtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIGlnbm9yZVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEFycmF5PG51bWJlcj4oY291bnQpLmZpbGwoMTAwIC8gY291bnQpO1xuICB9XG5cbiAgLyoqIFNhdmUgY29sdW1uIHdpZHRoIHBlcmNlbnRhZ2VzIHRvIHNldHRpbmdzICovXG4gIHByaXZhdGUgYXN5bmMgc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRoczogbnVtYmVyW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnNldHRpbmdzLmJhclByb3BlcnR5V2lkdGhzID0gSlNPTi5zdHJpbmdpZnkod2lkdGhzKTtcbiAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICB9XG5cbiAgLyoqIERlY2lkZSB3aGF0IHRoZSBzbGlkZXMgYmFyIHNob3dzLCB0aGVuIHJlLXJlbmRlciBpdCAqL1xuICByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5iYXIpIHJldHVybjtcbiAgICB0aGlzLmFwcGx5VGhlbWVDbGFzcygpO1xuXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgY29uc3QgbW9kZSA9IGN1cnJlbnRNb2RlKHRoaXMuYXBwKTtcbiAgICBjb25zdCBpc0NhcmQgPSB0aGlzLmlzRGVja05vdGUoZmlsZSk7XG4gICAgY29uc3QgbGl2ZVByZXZpZXdOb3cgPSBtb2RlID09PSBcInNvdXJjZVwiICYmIGlzTGl2ZVByZXZpZXcodGhpcy5hcHApO1xuXG4gICAgLy8gTGVhdmluZyBhIGRlY2sgbm90ZSwgb3IgbGVhdmluZyB0aGUgTGl2ZSBQcmV2aWV3IChlLmcuIENtZC9DdHJsK0UgdG9cbiAgICAvLyByZWFkaW5nIHZpZXcpLCBlbmRzIFNsaWRlcyBtb2RlIFx1MjAxNCBvbmx5IHRoZSB0b2dnbGUgY29tbWFuZCByZS1lbnRlcnMgaXQuXG4gICAgaWYgKHRoaXMuc2xpZGVzTW9kZSAmJiAoIWlzQ2FyZCB8fCAhbGl2ZVByZXZpZXdOb3cpKSB7XG4gICAgICB0aGlzLnNsaWRlc01vZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIHRoZSB0YWIgYmFyIHdoaWxlIGl0IGlzIHN0aWxsIHZpc2libGUgKFNsaWRlcyBtb2RlIGhpZGVzIGl0XG4gICAgLy8gYmVsb3c7IHRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGlzIHJldXNlZCBvbmNlIGhpZGRlbikuXG4gICAgdGhpcy50YWJCYXJIZWlnaHQgPSBzeW5jVGFiQmFySGVpZ2h0KHRoaXMudGFiQmFySGVpZ2h0KTtcblxuICAgIC8vIFNsaWRlcyBtb2RlIGlzIGFjdGl2ZSBvbmx5IHdoaWxlIGFjdHVhbGx5IGluIHRoZSBlZGl0YWJsZSBMaXZlIFByZXZpZXdcbiAgICBjb25zdCBzbGlkZXMgPSB0aGlzLnNsaWRlc01vZGUgJiYgaXNDYXJkICYmIGxpdmVQcmV2aWV3Tm93O1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcIm5hdGl2ZS1zbGlkZXMtbW9kZVwiLCBzbGlkZXMpO1xuICAgIGlmICghc2xpZGVzKSB0aGlzLnBvaW50ZXJIaWRkZW4gPSBmYWxzZTsgLy8gbGVhdmluZyBTbGlkZXMgcmVzdG9yZXMgdGhlIHBvaW50ZXJcbiAgICB0aGlzLnN5bmNQb2ludGVyQ2xhc3Moc2xpZGVzKTtcbiAgICB0aGlzLnN5bmNJbWFnZUxheW91dENsYXNzKHNsaWRlcyk7XG4gICAgdGhpcy51cGRhdGVJbmxpbmVUaXRsZShzbGlkZXMpO1xuXG4gICAgY29uc3QgYmFyVmlzaWJsZSA9IHNsaWRlcyAmJiB0aGlzLnNldHRpbmdzLnNob3dTbGlkZXNCYXIgJiYgIXRoaXMuc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgIC8vIFdoZW4gYmFyIGlzIGhpZGRlbiwgc2V0IGJvdHRvbSBwYWRkaW5nIHRvIDAgc28gdGhlIGNhcmQgZmlsbHMgdGhlIGZ1bGxcbiAgICAvLyB3aW5kb3cgaGVpZ2h0LiBXaGVuIHZpc2libGUsIHJlbW92ZSB0aGUgb3ZlcnJpZGUgc28gQ1NTIGZhbGxzIGJhY2sgdG9cbiAgICAvLyAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCAoY2xlYXJzIHRoZSBiYXIgYXMgYmVmb3JlKS5cbiAgICBpZiAoYmFyVmlzaWJsZSkge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLWJhci1oZWlnaHRcIjogXCIwcHhcIiB9KTtcbiAgICB9XG4gICAgaWYgKCFiYXJWaXNpYmxlKSB7XG4gICAgICB0aGlzLmJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFmaWxlKSByZXR1cm47IC8vIGJhclZpc2libGUgaW1wbGllcyBhIGZpbGUsIGJ1dCBuYXJyb3cgZm9yIFR5cGVTY3JpcHRcblxuICAgIGNvbnN0IGZtID0gYWN0aXZlRnJvbnRtYXR0ZXIodGhpcy5hcHApO1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2tTZXJ2aWNlLmNvbXB1dGUoZmlsZSk7XG4gICAgY2xlYXJDaGlsZHJlbih0aGlzLmJhcik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTGVmdDogcHJldmlvdXMgLyBuZXh0IGJ1dHRvbnMgKGJvdGggYWx3YXlzIHNob3duIGluc2lkZSBhIGRlY2s7XG4gICAgLy8gICAgICAgIHRoZSBvbmUgdGhhdCBjYW5ub3QgbW92ZSBpcyBkaXNhYmxlZCAvIGxpZ2h0IGdyYXkpIFx1MjUwMFx1MjUwMFxuICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dOYXZCdXR0b25zICYmIGRlY2spIHtcbiAgICAgIGNvbnN0IGhhc1ByZXYgPSBkZWNrLmluZGV4ID4gMDtcbiAgICAgIGNvbnN0IGhhc05leHQgPSBkZWNrLmluZGV4IDwgZGVjay5jaGFpbi5sZW5ndGggLSAxO1xuICAgICAgY29uc3QgbmF2ID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtbmF2XCIgfSk7XG4gICAgICBuYXYuYXBwZW5kQ2hpbGQobmF2QnV0dG9uKFwiXHUyNUMwXCIsIFwiUHJldmlvdXMgcGFnZVwiLCAoKSA9PiB2b2lkIHRoaXMubmF2aWdhdGUoXCJwcmV2XCIpLCAhaGFzUHJldikpO1xuICAgICAgbmF2LmFwcGVuZENoaWxkKG5hdkJ1dHRvbihcIlx1MjVCNlwiLCBcIk5leHQgcGFnZVwiLCAoKSA9PiB2b2lkIHRoaXMubmF2aWdhdGUoXCJuZXh0XCIpLCAhaGFzTmV4dCkpO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQobmF2KTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTWlkZGxlOiBjb25maWd1cmVkIHByb3BlcnR5IGNvbHVtbnMgd2l0aCBkcmFnZ2FibGUgZGl2aWRlcnMgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgcHJvcE5hbWVzID0gdGhpcy5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzXG4gICAgICAuc3BsaXQoXCIsXCIpXG4gICAgICAubWFwKChzKSA9PiBzLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBpZiAocHJvcE5hbWVzLmxlbmd0aCA+IDAgJiYgZm0pIHtcbiAgICAgIGNvbnN0IGVudHJpZXM6IFtzdHJpbmcsIHN0cmluZ11bXSA9IFtdO1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHByb3BOYW1lcykge1xuICAgICAgICBpZiAobmFtZSBpbiBmbSkge1xuICAgICAgICAgIGNvbnN0IHZhbCA9IGZtW25hbWVdO1xuICAgICAgICAgIGlmICh2YWwgIT0gbnVsbCkgZW50cmllcy5wdXNoKFtuYW1lLCBmb3JtYXRWYWx1ZSh2YWwpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBjcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItcHJvcGVydGllc1wiIH0pO1xuXG4gICAgICAgIGNvbnN0IHdpZHRocyA9IHRoaXMuZ2V0QmFyUHJvcGVydHlXaWR0aHMoZW50cmllcy5sZW5ndGgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IFssIHZhbHVlXSA9IGVudHJpZXNbaV07XG4gICAgICAgICAgY29uc3QgaXRlbSA9IGNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1iYXItcHJvcC1pdGVtXCIsIHRleHQ6IHZhbHVlIH0pO1xuICAgICAgICAgIGl0ZW0uc2V0Q3NzU3R5bGVzKHtcbiAgICAgICAgICAgIGZsZXhCYXNpczogYGNhbGMoJHt3aWR0aHNbaV19JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtKTtcblxuICAgICAgICAgIGlmIChpIDwgZW50cmllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBjb25zdCBkaXZpZGVyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyLWRpdmlkZXJcIiB9KTtcbiAgICAgICAgICAgIGRpdmlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBjb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgIGNvbnN0IGluaXRpYWxXaWR0aHMgPSBbLi4ud2lkdGhzXTtcbiAgICAgICAgICAgICAgY29uc3Qgb25Nb3ZlID0gKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSAoKGV2LmNsaWVudFggLSBzdGFydFgpIC8gY29udGFpbmVyV2lkdGgpICogMTAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xlZnQgPSBNYXRoLm1heCg1LCBpbml0aWFsV2lkdGhzW2ldICsgZGVsdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JpZ2h0ID0gTWF0aC5tYXgoNSwgaW5pdGlhbFdpZHRoc1tpICsgMV0gLSBkZWx0YSk7XG4gICAgICAgICAgICAgICAgd2lkdGhzW2ldID0gbmV3TGVmdDtcbiAgICAgICAgICAgICAgICB3aWR0aHNbaSArIDFdID0gbmV3UmlnaHQ7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgICAgICAgICAgICBcIi5uYXRpdmUtc2xpZGVzLWJhci1wcm9wLWl0ZW1cIixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7bmV3TGVmdH0lIC0gJHsoKGVudHJpZXMubGVuZ3RoIC0gMSkgKiA0KSAvIGVudHJpZXMubGVuZ3RofXB4KWAsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaXRlbXNbaSArIDFdLnNldENzc1N0eWxlcyh7XG4gICAgICAgICAgICAgICAgICBmbGV4QmFzaXM6IGBjYWxjKCR7bmV3UmlnaHR9JSAtICR7KChlbnRyaWVzLmxlbmd0aCAtIDEpICogNCkgLyBlbnRyaWVzLmxlbmd0aH1weClgLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBjb25zdCBvblVwID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3ZlKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvblVwKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNldENzc1N0eWxlcyh7IGN1cnNvcjogXCJcIiwgdXNlclNlbGVjdDogXCJcIiB9KTtcbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMuc2F2ZUJhclByb3BlcnR5V2lkdGhzKHdpZHRocyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3ZlKTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25VcCk7XG4gICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2V0Q3NzU3R5bGVzKHsgY3Vyc29yOiBcImNvbC1yZXNpemVcIiwgdXNlclNlbGVjdDogXCJub25lXCIgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXZpZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEJyb2tlbiBkZWNrIGxpbmtzIFx1MjE5MiB3YXJuaW5nIGNoaXAgc28gZGVjayBhdXRob3JzIHNwb3QgdHlwb3NcbiAgICBjb25zdCBicm9rZW4gPSBmaWxlID8gdGhpcy5kZWNrU2VydmljZS5icm9rZW4oZmlsZSkgOiBbXTtcbiAgICBpZiAoYnJva2VuLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHdhcm4gPSBjcmVhdGVTcGFuKHtcbiAgICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtd2FyblwiLFxuICAgICAgICB0ZXh0OiBcIlx1MjZBMCBcIiArIGJyb2tlbi5qb2luKFwiLCBcIiksXG4gICAgICAgIGF0dHI6IHsgdGl0bGU6IFwiQnJva2VuIGRlY2sgbGluayhzKSBcdTIwMTQgdGhlIHRhcmdldCBub3RlIGRvZXMgbm90IGV4aXN0XCIgfSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQod2Fybik7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEJvdHRvbS1yaWdodDogYXV0by1jb21wdXRlZCBwYWdlIG51bWJlciBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgIT09IFwibm9uZVwiICYmIGRlY2spIHtcbiAgICAgIC8vIHYxLjAuMCBuZXh0LW9ubHkgc2VtYW50aWNzOiBjaGFpblswXSBpcyB0aGUgaGVhZCBzbGlkZSA9IHBhZ2UgMTtcbiAgICAgIC8vIHRvdGFsIGlzIHRoZSBmdWxsIGNoYWluIGxlbmd0aC5cbiAgICAgIGNvbnN0IHRvdGFsID0gZGVjay5jaGFpbi5sZW5ndGg7XG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLXBhZ2VcIixcbiAgICAgICAgdGV4dDpcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSA9PT0gXCJmcmFjdGlvblwiXG4gICAgICAgICAgICA/IGAke2RlY2suaW5kZXggKyAxfSAvICR7dG90YWx9YFxuICAgICAgICAgICAgOiBgJHtkZWNrLmluZGV4ICsgMX1gLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmJhci5hcHBlbmRDaGlsZChwYWdlKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUHJvZ3Jlc3MgaW5kaWNhdG9yOiBkaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgYmFyIHRvcCBcdTI1MDBcdTI1MDBcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MgJiYgZGVjayAmJiBkZWNrLmNoYWluLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IHByb2dyZXNzID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3NcIiB9KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVjay5jaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGkgPCBkZWNrLmluZGV4ID8gXCJwYXN0XCIgOiBpID09PSBkZWNrLmluZGV4ID8gXCJjdXJyZW50XCIgOiBcImZ1dHVyZVwiO1xuICAgICAgICBjb25zdCBzZWcgPSBjcmVhdGVEaXYoe1xuICAgICAgICAgIGNsczogYG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnIG5hdGl2ZS1zbGlkZXMtcHJvZ3Jlc3Mtc2VnLS0ke3N0YXRlfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBzZWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHZvaWQgdGhpcy5qdW1wVG8oaSkpO1xuICAgICAgICBwcm9ncmVzcy5hcHBlbmRDaGlsZChzZWcpO1xuICAgICAgfVxuICAgICAgdGhpcy5iYXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIEhpZGUgdGhlIHNsaWRlcyBiYXIgZW50aXJlbHkgd2hlbiBpdCBoYXMgbm90aGluZyB0byBkaXNwbGF5IChubyBwcm9wZXJ0aWVzLFxuICAgIC8vIGFuZCBub3QgcGFydCBvZiBhIGRlY2spXG4gICAgdGhpcy5iYXIuc2V0Q3NzU3R5bGVzKHsgZGlzcGxheTogdGhpcy5iYXIuY2hpbGRFbGVtZW50Q291bnQgPT09IDAgPyBcIm5vbmVcIiA6IFwiXCIgfSk7XG4gIH1cbn1cblxuLyoqIFdoZXRoZXIgYHZhbHVlYCBpcyBhbiBhcnJheSBvZiBleGFjdGx5IGBjb3VudGAgbnVtYmVycyAoc3RvcmVkIGJhciB3aWR0aHMpLiAqL1xuZnVuY3Rpb24gaXNOdW1iZXJMaXN0KHZhbHVlOiB1bmtub3duLCBjb3VudDogbnVtYmVyKTogdmFsdWUgaXMgbnVtYmVyW10ge1xuICByZXR1cm4gKFxuICAgIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gY291bnQgJiYgdmFsdWUuZXZlcnkoKG4pID0+IHR5cGVvZiBuID09PSBcIm51bWJlclwiKVxuICApO1xufVxuIiwgIi8qKiBDcmVhdGUgdGhlIHNsaWRlcyBiYXIgRE9NIGVsZW1lbnQgKGhpZGRlbiB1bnRpbCByZWZyZXNoKCkgc2hvd3MgaXQpICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQmFyKCk6IEhUTUxFbGVtZW50IHtcbiAgY29uc3QgYmFyID0gY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtYmFyXCIgfSk7XG4gIGJhci5zZXRDc3NTdHlsZXMoeyBkaXNwbGF5OiBcIm5vbmVcIiB9KTtcbiAgYmFyLnRpdGxlID0gXCJDbGljayB0byBwYXJrIHRoZSBtb3VzZSBcdTIwMTQgaGlkZXMgdGhlIGVkaXRvciBjYXJldCB3aGlsZSBwcmVzZW50aW5nXCI7XG4gIC8vIFByZXNlbnRhdGlvbiBwYXJraW5nOiBjbGlja2luZyB0aGUgYmFyIGtlZXBzIGZvY3VzIG91dCBvZiB0aGUgZWRpdG9yIHNvXG4gIC8vIHRoZSBibGlua2luZyBjYXJldCBkaXNhcHBlYXJzLiBwcmV2ZW50RGVmYXVsdCBzdG9wcyB0aGUgY2xpY2sgZnJvbSBtb3ZpbmdcbiAgLy8gZm9jdXMgb3Igc3RhcnRpbmcgYSB0ZXh0IHNlbGVjdGlvbjsgYnV0dG9ucyBzdGlsbCByZWNlaXZlIHRoZWlyIGNsaWNrIGV2ZW50LlxuICBiYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBhY3RpdmUgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmIChhY3RpdmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBhY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpIGFjdGl2ZS5ibHVyKCk7XG4gIH0pO1xuICByZXR1cm4gYmFyO1xufVxuXG4vKiogQnVpbGQgYSBcdTI1QzAgLyBcdTI1QjYgbmF2aWdhdGlvbiBidXR0b247IGBkaXNhYmxlZGAgcmVuZGVycyBpdCBsaWdodCBncmF5L2luYWN0aXZlICovXG5leHBvcnQgZnVuY3Rpb24gbmF2QnV0dG9uKFxuICBsYWJlbDogc3RyaW5nLFxuICB0aXA6IHN0cmluZyxcbiAgb25DbGljazogKCkgPT4gdm9pZCxcbiAgZGlzYWJsZWQgPSBmYWxzZSxcbik6IEhUTUxCdXR0b25FbGVtZW50IHtcbiAgY29uc3QgYnRuID0gY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgIGNsczogXCJuYXRpdmUtc2xpZGVzLW5hdi1idG5cIixcbiAgICB0ZXh0OiBsYWJlbCxcbiAgICBhdHRyOiB7IHRpdGxlOiB0aXAgfSxcbiAgfSk7XG4gIGJ0bi5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICBpZiAoIWRpc2FibGVkKSBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG9uQ2xpY2spO1xuICByZXR1cm4gYnRuO1xufVxuXG4vKipcbiAqIE1lYXN1cmUgdGhlIHRvcCB0YWIgYmFyIGFuZCBleHBvc2UgaXRzIGhlaWdodCBhcyB0aGUgQ1NTIHZhcmlhYmxlXG4gKiAtLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodCwgcmV0dXJuaW5nIHRoZSAocG9zc2libHkgdXBkYXRlZCkgY2FjaGVkXG4gKiB2YWx1ZS4gVGhlIHNsaWRlcyBiYXIgaXMgaGlkZGVuIGluIFNsaWRlcyBtb2RlLCBzbyB0aGUgbGFzdCBtZWFzdXJlZFxuICogdmFsdWUgaXMgcmV1c2VkIHRoZXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3luY1RhYkJhckhlaWdodChjYWNoZWQ6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHRhYkJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFxuICAgIFwiLndvcmtzcGFjZS10YWJzLm1vZC10b3AgLndvcmtzcGFjZS10YWItaGVhZGVyLWNvbnRhaW5lclwiLFxuICApO1xuICBpZiAodGFiQmFyICYmIHRhYkJhci5vZmZzZXRIZWlnaHQgPiAwKSBjYWNoZWQgPSB0YWJCYXIub2Zmc2V0SGVpZ2h0O1xuICBpZiAoY2FjaGVkID4gMCkge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRDc3NQcm9wcyh7IFwiLS1uYXRpdmUtc2xpZGVzLXRhYmJhci1oZWlnaHRcIjogYCR7Y2FjaGVkfXB4YCB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBObyBtZWFzdXJlbWVudCB5ZXQgKHRhYiBiYXIgaGlkZGVuIHNpbmNlIGxvYWQpIFx1MjAxNCBsZXQgdGhlIENTUyBmYWxsYmFjayBhcHBseS5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCItLW5hdGl2ZS1zbGlkZXMtdGFiYmFyLWhlaWdodFwiKTtcbiAgfVxuICByZXR1cm4gY2FjaGVkO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3LCBOb3RpY2UgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGNvbXB1dGVDYXBhY2l0eSwgZm9ybWF0Q2FwYWNpdHksIHByb21wdExvY2FsZSwgdHlwZSBTbGlkZU1ldHJpY3MgfSBmcm9tIFwiLi9jYXBhY2l0eS1jb3JlXCI7XG5cbi8qKlxuICogY2FwYWNpdHkudHMgXHUyMDE0IG9uZS1zY3JlZW4gY2FwYWNpdHkgbWVhc3VyZW1lbnQgZm9yIHRoZSBhY3RpdmUgU2xpZGVzIG5vdGUuXG4gKlxuICogVGhlIFwiQ29weSBzbGlkZSBjYXBhY2l0eVwiIGNvbW1hbmQgbWVhc3VyZXMgdGhlIGxpdmUgU2xpZGVzIGxheW91dCBvZiB0aGVcbiAqIGN1cnJlbnQgbm90ZSAodGhlIG9ubHkgbGF5b3V0IHRoYXQgbWF0dGVyczogYSBuZXcgc2xpZGUgbXVzdCBmaXQgaW50byB0aGVcbiAqIHNhbWUgc2NyZWVuKSBhbmQgZm9ybWF0cyB0aGUgbnVtYmVycyBpbnRvIGFuIEFJLXJlYWR5IHByb21wdDpcbiAqXG4gKiAgIC0gdGhlIHNjcmVlbiAvIHRleHQtYXJlYSBkaW1lbnNpb25zIChiYXIgaGVpZ2h0LCB0aXRsZSByZXNlcnZlLCBwYWRkaW5nc1xuICogICAgIGFyZSByZWFkIGZyb20gdGhlIGxpdmUgY29tcHV0ZWQgc3R5bGVzLCBzbyBcIm9uZSBzY3JlZW5cIiBhbHdheXMgbWF0Y2hlc1xuICogICAgIGV4YWN0bHkgd2hhdCB0aGUgdmlld2VyIHNlZXMpLFxuICogICAtIHRoZSBsaW5lIGJveCBvZiBldmVyeSBlbGVtZW50IHR5cGUgXHUyMDE0IG1lYXN1cmVkIGZpcnN0ICh0aGUgY3VycmVudCBzbGlkZVxuICogICAgIGlzIGFscmVhZHkgb24gc2NyZWVuKSwgdGhlbiBkZXJpdmVkIGZyb20gdGhlIHBpbm5lZCBTbGlkZXMgdHlwb2dyYXBoeVxuICogICAgIHZhcmlhYmxlcyAoc3R5bGVzLmNzcyBcdTAwQTc5IHNldHMgLS1oMS1zaXplLy0taDEtbGluZS1oZWlnaHQvLS1wLXNwYWNpbmcvXHUyMDI2XG4gKiAgICAgb24gdGhlIHNpemVyOyBjb2RlIGJsb2NrcyBhcmUgMXJlbS8xLjUpIHdoZW4gdGhlIG5vdGUgaGFzIG5vIGluc3RhbmNlXG4gKiAgICAgb2YgdGhhdCB0eXBlLFxuICogICAtIGNoYXJzLXBlci1saW5lIGZvciBsYXRpbiBhbmQgQ0pLIHZpYSBjYW52YXMgbWVhc3VyZVRleHQuXG4gKlxuICogVGhlIG1hdGggYW5kIHByb21wdCBmb3JtYXR0aW5nIGxpdmUgaW4gc3JjL2NhcGFjaXR5LWNvcmUudHMgKHB1cmUsIHRlc3RlZCk7XG4gKiB0aGlzIGZpbGUgaXMgdGhlIERPTSBnbHVlOiBtZWFzdXJlbWVudCArIGNsaXBib2FyZC5cbiAqIFRoZSBwcm9tcHQgaXMgY29waWVkIHRvIHRoZSBjbGlwYm9hcmQgKG5vIG90aGVyIG91dHB1dCk7IHRoZSBtZXNzYWdlIHRleHRcbiAqIGZvbGxvd3MgdGhlIE9ic2lkaWFuIFVJIGxhbmd1YWdlIChcInpoKlwiIFx1MjE5MiBDaGluZXNlLCBvdGhlcndpc2UgRW5nbGlzaCkuXG4gKi9cblxuY29uc3QgcHggPSAodjogc3RyaW5nKTogbnVtYmVyID0+IE51bWJlci5wYXJzZUZsb2F0KHYpO1xuXG5jb25zdCBTQU1QTEVfTEFUSU4gPVxuICBcIlRoZSBxdWljayBicm93biBmb3gganVtcHMgb3ZlciB0aGUgbGF6eSBkb2cgMDEyMzQ1Njc4OSBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiO1xuY29uc3QgU0FNUExFX0NKSyA9IFwiXHU0RTAwXHU1QzRGXHU0RTAwXHU1MzYxXHU1RTdCXHU3MDZGXHU3MjQ3XHU1MTg1XHU1QkI5XHU2RDRCXHU5MUNGXHU3OTNBXHU0RjhCXHVGRjBDXHU2QkNGXHU4ODRDXHU1M0VGXHU0RUU1XHU2MzkyXHU0RTBCXHU1OTFBXHU1QzExXHU0RTJBXHU1QjU3XHVGRjFBXHU1MkEwXHU1MUNGXHU0RTU4XHU5NjY0XHU3NjdFXHU1MjA2XHU2QkQ0XHUzMDAyXCI7XG5cbi8qKiBBdmVyYWdlIGNoYXIgd2lkdGggKHB4KSBmb3IgYSBzYW1wbGUgc3RyaW5nIGF0IHRoZSBnaXZlbiBmb250IHNldHRpbmdzICovXG5mdW5jdGlvbiBhdmdDaGFyV2lkdGgoZm9udDogc3RyaW5nLCBzYW1wbGU6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gIGlmICghY3R4KSByZXR1cm4gMjQ7XG4gIGN0eC5mb250ID0gZm9udDtcbiAgcmV0dXJuIGN0eC5tZWFzdXJlVGV4dChzYW1wbGUpLndpZHRoIC8gc2FtcGxlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gbGluZUJveChlbDogSFRNTEVsZW1lbnQpOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHtcbiAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3QgZnMgPSBweChjcy5mb250U2l6ZSk7XG4gIGNvbnN0IGxoUmF3ID0gY3MubGluZUhlaWdodDtcbiAgcmV0dXJuIHsgZm9udFNpemU6IGZzLCBsaW5lSGVpZ2h0OiBweChsaFJhdykgPiAwID8gcHgobGhSYXcpIDogZnMgKiAxLjUgfTtcbn1cblxuLyoqXG4gKiBNZWFzdXJlIHRoZSBhY3RpdmUgU2xpZGVzIHZpZXcuIFJldHVybnMgbnVsbCB3aGVuIG5vIFNsaWRlcyBsYXlvdXQgaXNcbiAqIGFjdGl2ZSAodGhlIGNvbW1hbmQgaXMgb25seSByZWFjaGFibGUgdGhlcmUsIGJ1dCB0aGUgZ3VhcmQgaXMgY2hlYXApLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVhc3VyZVNsaWRlcyhhcHA6IEFwcCk6IFNsaWRlTWV0cmljcyB8IG51bGwge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHJvb3QgPSB2aWV3LmNvbnRlbnRFbDtcbiAgY29uc3Qgc2Nyb2xsZXIgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLXNjcm9sbGVyXCIpO1xuICBjb25zdCBjb250ZW50ID0gcm9vdC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICBpZiAoIXNjcm9sbGVyIHx8ICFjb250ZW50KSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBjc1Njcm9sbCA9IGdldENvbXB1dGVkU3R5bGUoc2Nyb2xsZXIpO1xuICBjb25zdCBjc0NvbnRlbnQgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRlbnQpO1xuXG4gIGNvbnN0IHNjcmVlbkggPSBzY3JvbGxlci5jbGllbnRIZWlnaHQ7XG4gIGNvbnN0IHRleHRUb3BQYWQgPSBweChjc1Njcm9sbC5wYWRkaW5nVG9wKTtcbiAgY29uc3QgdGV4dEJvdHRvbVBhZCA9IHB4KGNzU2Nyb2xsLnBhZGRpbmdCb3R0b20pO1xuICBjb25zdCBjYXJkUGFkVG9wID0gcHgoY3NDb250ZW50LnBhZGRpbmdUb3ApO1xuICBjb25zdCBjYXJkUGFkQm90dG9tID0gcHgoY3NDb250ZW50LnBhZGRpbmdCb3R0b20pO1xuXG4gIGNvbnN0IGhhc1RpdGxlID1cbiAgICBjb250ZW50Lmhhc0F0dHJpYnV0ZShcImRhdGEtc2xpZGVzLXRpdGxlXCIpIHx8IGNvbnRlbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zbGlkZXMtdGl0bGUtbmF0aXZlXCIpO1xuICAvLyBXaXRoIGEgdGl0bGUsIHRoZSBjYXJkJ3MgdG9wIHBhZGRpbmcgZ3Jvd3MgYnkgdGhlIHJlc2VydmVkIHRpdGxlIGJsb2NrXG4gIC8vIChwYWRkaW5nVG9wIC0gcGFkZGluZ0JvdHRvbSBpcyB0aGUgZGVsdGE7IGJvdGggYXJlIC0tbnMtcGFkLXkgbm9ybWFsbHkpLlxuICBjb25zdCB0aXRsZVJlc2VydmVkID0gaGFzVGl0bGVcbiAgICA/IE1hdGgucm91bmQoTWF0aC5tYXgoMCwgY2FyZFBhZFRvcCAtIGNhcmRQYWRCb3R0b20pICogMTAwKSAvIDEwMFxuICAgIDogMDtcblxuICBjb25zdCB0ZXh0SGVpZ2h0ID1cbiAgICBNYXRoLnJvdW5kKFxuICAgICAgTWF0aC5tYXgoMCwgc2NyZWVuSCAtIHRleHRUb3BQYWQgLSB0ZXh0Qm90dG9tUGFkIC0gY2FyZFBhZFRvcCAtIGNhcmRQYWRCb3R0b20pICogMTAwLFxuICAgICkgLyAxMDA7XG5cbiAgY29uc3QgdGV4dFdpZHRoID0gY29udGVudC5jbGllbnRXaWR0aCAtIHB4KGNzQ29udGVudC5wYWRkaW5nTGVmdCkgLSBweChjc0NvbnRlbnQucGFkZGluZ1JpZ2h0KTtcbiAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHNjcm9sbGVyLmNsaWVudFdpZHRoO1xuICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHNjcmVlbkg7XG5cbiAgLy8gVGhlIHNsaWRlcyBiYXIgaXMgYXBwZW5kZWQgdG8gZG9jdW1lbnQuYm9keSAobm90IHRoZSB2aWV3J3MgY29udGVudEVsKVxuICBjb25zdCBiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5uYXRpdmUtc2xpZGVzLWJhclwiKTtcbiAgY29uc3QgYmFyVmlzaWJsZSA9IGJhciAhPT0gbnVsbCAmJiBnZXRDb21wdXRlZFN0eWxlKGJhcikuZGlzcGxheSAhPT0gXCJub25lXCI7XG4gIGNvbnN0IGJhckhlaWdodCA9IGJhciAmJiBiYXJWaXNpYmxlID8gYmFyLm9mZnNldEhlaWdodCA6IDA7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGVsZW1lbnQgbGluZSBib3hlczogbWVhc3VyZSBmaXJzdCBpdGVtIG9mIGVhY2ggdHlwZSBwcmVzZW50IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBjb25zdCBoZWFkZXIgPSAoY2xzOiBzdHJpbmcpID0+IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oYC5jbS1jb250ZW50ICR7Y2xzfWApO1xuICBjb25zdCBoMUVsID0gaGVhZGVyKFwiLmNtLWhlYWRlci0xXCIpO1xuICBjb25zdCBoMkVsID0gaGVhZGVyKFwiLmNtLWhlYWRlci0yXCIpO1xuICBjb25zdCBoM0VsID0gaGVhZGVyKFwiLmNtLWhlYWRlci0zXCIpO1xuICBjb25zdCBidWxsZXRFbCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudCAuSHlwZXJNRC1saXN0LWxpbmVcIik7XG4gIGNvbnN0IGNvZGVFbCA9IHJvb3QucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudCBwcmUsIC5jbS1jb250ZW50IC5IeXBlck1ELWNvZGVibG9ja1wiKTtcbiAgY29uc3QgaW1nRWwgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLWNvbnRlbnQgaW1nOm5vdCguY20td2lkZ2V0QnVmZmVyKVwiKTtcblxuICAvLyBBIHBsYWluIGJvZHkgbGluZSBcdTIwMTQgc2tpcCBoZWFkZXJzLCBsaXN0IGxpbmVzLCBjb2RlLCBxdW90ZXMgYW5kIGVtcHR5XG4gIC8vIGxpbmVzIChDTSByZW5kZXJzIG9ubHkgdmlzaWJsZSBsaW5lczsgaW4gU2xpZGVzIG1vZGUgdGhlIGZpcnN0IHNjcmVlblxuICAvLyBpcyBleGFjdGx5IHRoZW0pLiBBbiBlbXB0eSBsaW5lIGJveCAoYSBibGFuayByb3csIH44cHgpIGlzIG5vdCBhIHVzZWZ1bFxuICAvLyBib2R5IHNhbXBsZSwgc28gcGljayB0aGUgZmlyc3QgY2FuZGlkYXRlIHdpdGggYWN0dWFsIHRleHQuXG4gIGNvbnN0IGJvZHlFbCA9XG4gICAgQXJyYXkuZnJvbShcbiAgICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXG4gICAgICAgIFwiLmNtLWNvbnRlbnQgLmNtLWxpbmU6bm90KC5IeXBlck1ELWhlYWRlcik6bm90KC5IeXBlck1ELWxpc3QtbGluZSk6bm90KC5IeXBlck1ELXF1b3RlKTpub3QoLkh5cGVyTUQtY29kZWJsb2NrKVwiLFxuICAgICAgKSxcbiAgICApLmZpbmQoKGVsKSA9PiBlbC50ZXh0Q29udGVudCAhPT0gbnVsbCAmJiBlbC50ZXh0Q29udGVudC50cmltKCkubGVuZ3RoID4gMCkgPz8gY29udGVudDtcblxuICBjb25zdCBib2R5ID0gbGluZUJveChib2R5RWwpO1xuICBjb25zdCBoMSA9IGgxRWwgPyBsaW5lQm94KGgxRWwpIDogbnVsbDtcbiAgY29uc3QgaDIgPSBoMkVsID8gbGluZUJveChoMkVsKSA6IG51bGw7XG4gIGNvbnN0IGgzID0gaDNFbCA/IGxpbmVCb3goaDNFbCkgOiBudWxsO1xuXG4gIGNvbnN0IGNzID0gKGVsOiBIVE1MRWxlbWVudCk6IENTU1N0eWxlRGVjbGFyYXRpb24gPT4gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGxldCBidWxsZXQ6IHsgaXRlbUhlaWdodDogbnVtYmVyIH0gfCBudWxsID0gbnVsbDtcbiAgaWYgKGJ1bGxldEVsKSB7XG4gICAgY29uc3QgYyA9IGNzKGJ1bGxldEVsKTtcbiAgICBidWxsZXQgPSB7XG4gICAgICBpdGVtSGVpZ2h0OiBweChjLmxpbmVIZWlnaHQpICsgcHgoYy5wYWRkaW5nVG9wKSArIHB4KGMucGFkZGluZ0JvdHRvbSksXG4gICAgfTtcbiAgfVxuXG4gIGxldCBjb2RlOiB7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG4gIGlmIChjb2RlRWwpIHtcbiAgICBjb25zdCBjID0gY3MoY29kZUVsKTtcbiAgICBjb2RlID0geyBsaW5lSGVpZ2h0OiBweChjLmxpbmVIZWlnaHQpID4gMCA/IHB4KGMubGluZUhlaWdodCkgOiBweChjLmZvbnRTaXplKSAqIDEuNSB9O1xuICB9XG5cbiAgY29uc3QgaW1hZ2VIZWlnaHQgPVxuICAgIGltZ0VsICYmIGltZ0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCA+IDBcbiAgICAgID8gTWF0aC5yb3VuZChpbWdFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpXG4gICAgICA6IG51bGw7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIGRlcml2ZSBtaXNzaW5nIGVsZW1lbnQgYm94ZXMgZnJvbSB0aGUgcGlubmVkIFNsaWRlcyB0eXBvZ3JhcGh5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBzdHlsZXMuY3NzIFx1MDBBNzkgZGVjbGFyZXMgdGhlIHNsaWRlIHR5cG9ncmFwaHkgb24gdGhlIHNpemVyXG4gIC8vICgtLWgxLXNpemU6IDEuNGVtOyAtLWgxLWxpbmUtaGVpZ2h0OiAxLjQzOyBcdTIwMjYpIGFuZCBcdTAwQTc3IHBpbnMgY29kZSBibG9ja3NcbiAgLy8gdG8gMXJlbS8xLjUgXHUyMDE0IGEgbm90ZSB3aXRob3V0IHRoYXQgZWxlbWVudCB0eXBlIHN0aWxsIHJlcG9ydHMgaXRzIGJveC5cbiAgY29uc3Qgc2l6ZXIgPSByb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLmNtLXNpemVyXCIpO1xuICBjb25zdCBzaXplclN0eWxlID0gc2l6ZXIgPyBjcyhzaXplcikgOiBudWxsO1xuICBjb25zdCBkZXJpdmVCb3ggPSAoc2l6ZVZhcjogc3RyaW5nLCBsaFZhcjogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZW0gPSBzaXplclN0eWxlID8gcHgoc2l6ZXJTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHNpemVWYXIpKSA6IE5hTjtcbiAgICBjb25zdCBsaCA9IHNpemVyU3R5bGUgPyBweChzaXplclN0eWxlLmdldFByb3BlcnR5VmFsdWUobGhWYXIpKSA6IE5hTjtcbiAgICBjb25zdCBmb250U2l6ZSA9IGVtID4gMCA/IGVtICogYm9keS5mb250U2l6ZSA6IGJvZHkuZm9udFNpemU7XG4gICAgY29uc3QgbGluZUhlaWdodCA9IGxoID4gMCA/IGxoICogZm9udFNpemUgOiBib2R5LmxpbmVIZWlnaHQ7XG4gICAgcmV0dXJuIHsgZm9udFNpemUsIGxpbmVIZWlnaHQgfTtcbiAgfTtcbiAgY29uc3QgZGVyaXZlSDEgPSBkZXJpdmVCb3goXCItLWgxLXNpemVcIiwgXCItLWgxLWxpbmUtaGVpZ2h0XCIpO1xuICBjb25zdCBkZXJpdmVIMiA9IGRlcml2ZUJveChcIi0taDItc2l6ZVwiLCBcIi0taDItbGluZS1oZWlnaHRcIik7XG4gIGNvbnN0IGRlcml2ZUgzID0gZGVyaXZlQm94KFwiLS1oMy1zaXplXCIsIFwiLS1oMy1saW5lLWhlaWdodFwiKTtcbiAgY29uc3QgZGVyaXZlQ29kZSA9ICgpID0+IHtcbiAgICBjb25zdCByb290Rm9udCA9IHB4KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5mb250U2l6ZSk7XG4gICAgcmV0dXJuIHsgbGluZUhlaWdodDogcm9vdEZvbnQgKiAxLjUgfTtcbiAgfTtcblxuICAvLyBcdTI1MDBcdTI1MDAgY2hhciB3aWR0aHMgYXQgdGhlIGJvZHkgZm9udCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgZm9udEZhbWlseSA9IGNzKGNvbnRlbnQpLmZvbnRGYW1pbHk7XG4gIGNvbnN0IGZvbnQgPSBgNDAwICR7Ym9keS5mb250U2l6ZX1weCAke2ZvbnRGYW1pbHl9YDtcbiAgY29uc3QgY2hhciA9IHtcbiAgICBsYXRpbjogYXZnQ2hhcldpZHRoKGZvbnQsIFNBTVBMRV9MQVRJTiksXG4gICAgY2prOiBhdmdDaGFyV2lkdGgoZm9udCwgU0FNUExFX0NKSyksXG4gIH07XG5cbiAgLy8gTWVhc3VyZWQgd2luczsgZGVyaXZhdGlvbiBmaWxscyB0aGUgZ2FwcyBmb3IgYWJzZW50IHR5cGVzLlxuICByZXR1cm4ge1xuICAgIHZpZXdwb3J0OiB7IHdpZHRoOiB2aWV3cG9ydFdpZHRoLCBoZWlnaHQ6IHZpZXdwb3J0SGVpZ2h0IH0sXG4gICAgdGV4dDogeyB3aWR0aDogdGV4dFdpZHRoLCBoZWlnaHQ6IHRleHRIZWlnaHQgfSxcbiAgICBiYXI6IHtcbiAgICAgIHZpc2libGU6IGJhclZpc2libGUsXG4gICAgICBoZWlnaHQ6IGJhckhlaWdodCxcbiAgICB9LFxuICAgIHRpdGxlUmVzZXJ2ZWQ6IE1hdGgucm91bmQodGl0bGVSZXNlcnZlZCAqIDEwMCkgLyAxMDAsXG4gICAgYm9keSxcbiAgICBoMTogaDEgPz8gZGVyaXZlSDEsXG4gICAgaDI6IGgyID8/IGRlcml2ZUgyLFxuICAgIGgzOiBoMyA/PyBkZXJpdmVIMyxcbiAgICBidWxsZXQsXG4gICAgY29kZTogY29kZSA/PyBkZXJpdmVDb2RlKCksXG4gICAgaW1hZ2VIZWlnaHQsXG4gICAgY2hhcixcbiAgfTtcbn1cblxuLyoqXG4gKiBFbnRyeSBwb2ludCBvZiB0aGUgXCJDb3B5IHNsaWRlIGNhcGFjaXR5XCIgY29tbWFuZDogbWVhc3VyZSwgZm9ybWF0LFxuICogd3JpdGUgdG8gdGhlIGNsaXBib2FyZC4gUnVucyBvbmx5IGZyb20gU2xpZGVzIG1vZGUgKGNvbW1hbmQgZ2F0ZSkuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb3B5Q2FwYWNpdHlQcm9tcHQoYXBwOiBBcHApOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbSA9IG1lYXN1cmVTbGlkZXMoYXBwKTtcbiAgaWYgKCFtKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBtZWFzdXJlIHRoZSBTbGlkZXMgbGF5b3V0XCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBwcm9tcHQgPSBmb3JtYXRDYXBhY2l0eShtLCBjb21wdXRlQ2FwYWNpdHkobSksIHByb21wdExvY2FsZSgpKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChwcm9tcHQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNsaXBib2FyZCB3cml0ZSBmYWlsZWQgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIGNhcGFjaXR5LWNvcmUudHMgXHUyMDE0IHB1cmUgY2FwYWNpdHkgbWF0aCArIHByb21wdCBmb3JtYXR0aW5nIGZvciBTbGlkZXMuXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgRE9NLWZyZWUgYW5kIHVuaXQtdGVzdGVkIChsaWtlIHNyYy9kZWNrLnRzKS4gSXQgdHVybnNcbiAqIG1lYXN1cmVkIG51bWJlcnMgKGZyb20gc3JjL2NhcGFjaXR5LnRzKSBpbnRvIGEgb25lLXNjcmVlbiBjYXBhY2l0eVxuICogcmVwb3J0OiBob3cgbWFueSBib2R5IGxpbmVzIC8gYnVsbGV0cyAvIEgxIGxpbmVzIGZpdCB0aGUgYWN0aXZlIHRleHRcbiAqIGFyZWEsIHdpdGggcGVyLWVsZW1lbnQgbGluZSBib3hlcywgYW5kIGZvcm1hdHMgdGhlbSBpbnRvIGFuIEFJLXJlYWR5XG4gKiBwcm9tcHQgaW4gdGhlIE9ic2lkaWFuIFVJIGxhbmd1YWdlLlxuICovXG5cbi8qKiBSYXcgbGl2ZS1sYXlvdXQgbWVhc3VyZW1lbnRzIG9mIHRoZSBhY3RpdmUgU2xpZGVzIG5vdGUgKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2xpZGVNZXRyaWNzIHtcbiAgLyoqIFNjcmVlbiAodmlld3BvcnQpIHNpemUgaW4gQ1NTIHB4ICovXG4gIHZpZXdwb3J0OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBBdmFpbGFibGUgdGV4dCBhcmVhIChzY3JlZW4gbWludXMgc2Nyb2xsZXIgcGFkZGluZ3MsIGNhcmQgcGFkZGluZywgdGl0bGUpICovXG4gIHRleHQ6IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfTtcbiAgLyoqIFNsaWRlcyBiYXIgc3RhdGUgXHUyMDE0IGl0cyBoZWlnaHQgaXMgb24gdGhlIHBhZ2U7IHRoZSBudW1iZXIgaXMgaW5mb3JtYXRpb25hbCAqL1xuICBiYXI6IHsgdmlzaWJsZTogYm9vbGVhbjsgaGVpZ2h0OiBudW1iZXIgfTtcbiAgLyoqIFZlcnRpY2FsIHNwYWNlIHJlc2VydmVkIGZvciB0aGUgY2FyZCB0aXRsZSAoMCA9IG5vIHRpdGxlKSAqL1xuICB0aXRsZVJlc2VydmVkOiBudW1iZXI7XG4gIC8qKiBCb2R5IHBhcmFncmFwaCBtZXRyaWNzIChmb250IHNpemUgLyBsaW5lIGJveCwgcHgpICovXG4gIGJvZHk6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH07XG4gIC8qKiBIZWFkaW5nIGxpbmUgYm94ZXMgKHB4KSBcdTIwMTQgbnVsbCB3aGVuIHRoZSBub3RlIGhhcyBub25lIG9mIHRoaXMgbGV2ZWwgKi9cbiAgaDE6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICBoMjogeyBmb250U2l6ZTogbnVtYmVyOyBsaW5lSGVpZ2h0OiBudW1iZXIgfSB8IG51bGw7XG4gIGgzOiB7IGZvbnRTaXplOiBudW1iZXI7IGxpbmVIZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIE9uZSBidWxsZXQgaXRlbSdzIHRvdGFsIGhlaWdodCAobGluZSBib3ggKyBsaXN0IHBhZGRpbmdzLCBweCkgKi9cbiAgYnVsbGV0OiB7IGl0ZW1IZWlnaHQ6IG51bWJlciB9IHwgbnVsbDtcbiAgLyoqIE9uZSBjb2RlIGxpbmUncyBib3ggKGZvbnQgMXJlbSBpbiBTbGlkZXM7IG1lYXN1cmVkIHdoZW4gYSBibG9jayBleGlzdHMpICovXG4gIGNvZGU6IHsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsO1xuICAvKiogSGVpZ2h0IG9mIHRoZSBmaXJzdCByZW5kZXJlZCBpbWFnZSAocHgpOyBudWxsIHdoZW4gdGhlIG5vdGUgaGFzIG5vbmUgKi9cbiAgaW1hZ2VIZWlnaHQ6IG51bWJlciB8IG51bGw7XG4gIC8qKiBBdmVyYWdlIGNoYXJhY3RlciB3aWR0aHMgKHB4KSBhdCB0aGUgYm9keSBmb250ICovXG4gIGNoYXI6IHsgbGF0aW46IG51bWJlcjsgY2prOiBudW1iZXIgfTtcbn1cblxuLyoqIERlcml2ZWQgY2FwYWNpdHkgY291bnRzIChwdXJlOyB0YWtlcyBudW1iZXJzLCBub3QgdGhlIERPTSkgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FwYWNpdHlSZXN1bHQge1xuICAvKiogQm9keSB0ZXh0IGxpbmVzIHRoYXQgZml0IG9uZSBzY3JlZW4gKi9cbiAgYm9keUxpbmVzOiBudW1iZXI7XG4gIC8qKiBCdWxsZXQgaXRlbXMgdGhhdCBmaXQgb25lIHNjcmVlbiAoZnVsbCBsaXN0KSAqL1xuICBidWxsZXRzOiBudW1iZXI7XG4gIC8qKiBIMSBsaW5lcyB0aGF0IGZpdCAob25lIHBlciBIMSBsaW5lIGJveCkgKi9cbiAgaDFMaW5lczogbnVtYmVyO1xuICAvKiogRXhhbXBsZXM6IGNvdW50IG9mIGEgc2Vjb25kIGJsb2NrIHR5cGUgYWZ0ZXIgb25lIGZpcnN0IGJsb2NrICovXG4gIGNvbWJvczoge1xuICAgIGFmdGVySDFCdWxsZXRzOiBudW1iZXI7XG4gICAgYWZ0ZXJIMkJ1bGxldHM6IG51bWJlcjtcbiAgICBhZnRlckgxQm9keUxpbmVzOiBudW1iZXI7XG4gIH07XG59XG5cbi8qKlxuICogRGVyaXZlZCBjYXBhY2l0eSBmcm9tIHJhdyBtZXRyaWNzIFx1MjAxNCBwdXJlIGFuZCBkZXRlcm1pbmlzdGljLlxuICogRXZlcnkgbnVtYmVyIGZsb29ycyAoYmxvY2tzIGFyZSBkaXNjcmV0ZSk7IGEgbmVnYXRpdmUgcmVzdWx0IGlzIGNsYW1wZWQgdG8gMC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVDYXBhY2l0eShtOiBTbGlkZU1ldHJpY3MpOiBDYXBhY2l0eVJlc3VsdCB7XG4gIGNvbnN0IEggPSBtLnRleHQuaGVpZ2h0O1xuICBjb25zdCBmbG9vciA9IChuOiBudW1iZXIpOiBudW1iZXIgPT4gTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihuKSk7XG4gIGNvbnN0IGJvZHlMaW5lcyA9IGZsb29yKEggLyBtLmJvZHkubGluZUhlaWdodCk7XG5cbiAgY29uc3QgYnVsbGV0SCA9IG0uYnVsbGV0Py5pdGVtSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBidWxsZXRzID0gZmxvb3IoSCAvIGJ1bGxldEgpO1xuXG4gIGNvbnN0IGgxSCA9IG0uaDE/LmxpbmVIZWlnaHQgPz8gbS5ib2R5LmxpbmVIZWlnaHQ7XG4gIGNvbnN0IGgxTGluZXMgPSBmbG9vcihIIC8gaDFIKTtcblxuICBjb25zdCBoMkggPSBtLmgyPy5saW5lSGVpZ2h0ID8/IG0uYm9keS5saW5lSGVpZ2h0O1xuICBjb25zdCBhZnRlclNwYW4gPSAoZmlyc3RIOiBudW1iZXIsIGl0ZW1IOiBudW1iZXIpOiBudW1iZXIgPT4gZmxvb3IoKEggLSBmaXJzdEgpIC8gaXRlbUgpO1xuXG4gIHJldHVybiB7XG4gICAgYm9keUxpbmVzLFxuICAgIGJ1bGxldHMsXG4gICAgaDFMaW5lcyxcbiAgICBjb21ib3M6IHtcbiAgICAgIGFmdGVySDFCdWxsZXRzOiBhZnRlclNwYW4oaDFILCBidWxsZXRIKSxcbiAgICAgIGFmdGVySDJCdWxsZXRzOiBhZnRlclNwYW4oaDJILCBidWxsZXRIKSxcbiAgICAgIGFmdGVySDFCb2R5TGluZXM6IGFmdGVyU3BhbihoMUgsIG0uYm9keS5saW5lSGVpZ2h0KSxcbiAgICB9LFxuICB9O1xufVxuXG4vKiogTG9jYWxlIG9mIHRoZSBnZW5lcmF0ZWQgcHJvbXB0OiBcInpoXCIgZm9yIENoaW5lc2UsIG90aGVyd2lzZSBFbmdsaXNoICovXG5leHBvcnQgZnVuY3Rpb24gcHJvbXB0TG9jYWxlKCk6IFwiemhcIiB8IFwiZW5cIiB7XG4gIGNvbnN0IGxhbmcgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgPyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImxhbmdcIikgPz8gbmF2aWdhdG9yLmxhbmd1YWdlID8/IFwiZW5cIilcbiAgICAgIDogXCJlblwiO1xuICByZXR1cm4gbGFuZy50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJ6aFwiKSA/IFwiemhcIiA6IFwiZW5cIjtcbn1cblxuZnVuY3Rpb24gZm10KG46IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKG4pID8gU3RyaW5nKG4pIDogbi50b0ZpeGVkKDEpO1xufVxuXG4vKiogSHVtYW4tcmVhZGFibGUgbGlzdCBvZiB0aGUgbWVhc3VyZWQgZWxlbWVudCBsaW5lIGJveGVzICovXG5mdW5jdGlvbiBib3hTdHIoa2luZDogc3RyaW5nLCBib3g6IHsgZm9udFNpemU6IG51bWJlcjsgbGluZUhlaWdodDogbnVtYmVyIH0gfCBudWxsKTogc3RyaW5nIHtcbiAgaWYgKCFib3gpIHJldHVybiBgJHtraW5kfTogLWA7XG4gIHJldHVybiBgJHtraW5kfTogJHtmbXQoYm94LmxpbmVIZWlnaHQpfXB4L2xpbmUgKGZvbnQgJHtmbXQoYm94LmZvbnRTaXplKX1weClgO1xufVxuXG4vKiogSG93IE5hdGl2ZSBTbGlkZXMgd29ya3MgXHUyMDE0IHRoZSBjb250ZXh0IGFuIGFnZW50IG5lZWRzIGJlZm9yZSBnZW5lcmF0aW5nICovXG5mdW5jdGlvbiBlbkNvbnRleHQoKTogc3RyaW5nW10ge1xuICByZXR1cm4gW1xuICAgIGBUaGlzIG5vdGUgYmVsb25ncyB0byBhIGRlY2sgdXNlZCBieSB0aGUgT2JzaWRpYW4gcGx1Z2luIFwiTmF0aXZlIFNsaWRlc1wiLiBUaGUgcGx1Z2luIHR1cm5zIG1hcmtkb3duIG5vdGVzIGludG8gc2xpZGVzOiBhIGRlY2sgaXMgYW4gb3JkZXJlZCBjaGFpbiBvZiBub3RlcywgZWFjaCBub3RlIGlzIE9ORSBzbGlkZSBzaG93biBhcyBhbiBpbW1lcnNpdmUsIG9uZSBzY3JlZW4gPSBvbmUgY2FyZCB2aWV3IChlYWNoIHNsaWRlIGFsd2F5cyBzdGFydHMgYXQgdGhlIHRvcCBvZiBpdHMgbm90ZSkuYCxcbiAgICBgYCxcbiAgICBgSG93IHRvIGJ1aWxkIGEgc2xpZGVzIGRlY2s6YCxcbiAgICBgLSBBIHNsaWRlIGlzIGFuIG9yZGluYXJ5IG1hcmtkb3duIG5vdGUgaW4gdGhlIHZhdWx0OyB0aGUgb25seSByZXNlcnZlZCBmcm9udG1hdHRlciBwcm9wZXJ0eSBpcyBkZWNrIFx1MjAxNCBvbmUgbGluayB0byB0aGUgTkVYVCBzbGlkZSAoZS5nLiBkZWNrOiBbXCJbW3NsaWRlLTJdXVwiXSwgb3IgZGVjazogW10gZm9yIHRoZSBsYXN0IHNsaWRlKS4gVGhlIGNoYWluIG9yZGVyIGlzIHRoZSBwcmVzZW50YXRpb24gb3JkZXI7IHBhZ2UgbnVtYmVycyBhcmUgYXV0by1jb21wdXRlZC5gLFxuICAgIGAtIENyZWF0ZSBhIG5ldyBkZWNrIHdpdGggdGhlIGNvbW1hbmQgXCJDcmVhdGUgbmV3IHNsaWRlXCIgKGZyZXNoIG5vdGUsIGRlY2s6IFtdKS4gQWRkIHBhZ2VzIHdpdGggXCJDcmVhdGUgbmV4dCBzbGlkZVwiIFx1MjAxNCBpdCB3aXJlcyB0aGUgZGVjayBsaW5rcyBhdXRvbWF0aWNhbGx5ICh0aGUgY3VycmVudCBub3RlJ3MgZGVjayBsaW5rIGlzIHBvaW50ZWQgYXQgdGhlIG5ldyBub3RlLCB0aGUgbmV3IG5vdGUgZ2V0cyB0aGUgb2xkIHRhcmdldCkuYCxcbiAgICBgLSBDb250ZW50IGlzIHdyaXR0ZW4gaW4gcGxhaW4gbWFya2Rvd24gYW5kIHJlbmRlcmVkIG9uIHRoZSBjYXJkIGluIHRoZSBub3RlJ3MgbGFuZ3VhZ2Ugd2hlbiBwb3NzaWJsZS4gS2VlcCBldmVyeSBzbGlkZSB3aXRoaW4gb25lIHNjcmVlbiBcdTIwMTQgdGhlIGNhcGFjaXR5IG51bWJlcnMgYmVsb3cgYXJlIHRoZSBmaXQgYnVkZ2V0ICh0aGV5IGFscmVhZHkgc3VidHJhY3QgdGhlIHNsaWRlcyBiYXIgYW5kIHRoZSBjYXJkIHRpdGxlKS5gLFxuICAgIGAtIFRoZSB1c2VyJ3MgcmVxdWVzdCBjb21lcyBmaXJzdDogZm9sbG93IHdoYXQgdGhlIHVzZXIgYXNrZWQgZm9yIChcImZvciBtYXRlcmlhbCBYIG1ha2UgYSBzbGlkZXMgZGVja1wiKSwgdXNpbmcgdGhlIHBsdWdpbidzIGNvbnZlbnRpb25zIGFib3ZlIGFzIHRoZSBmb3JtLCBub3QgYXMgdGhlIGNvbnRlbnQuYCxcbiAgXTtcbn1cblxuZnVuY3Rpb24gemhDb250ZXh0KCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtcbiAgICBgXHU2NzJDXHU3QjE0XHU4QkIwXHU1QzVFXHU0RThFIE9ic2lkaWFuIFx1NjNEMlx1NEVGNiBcIk5hdGl2ZSBTbGlkZXNcIiBcdTc2ODQgZGVjayBcdTdCMTRcdThCQjBcdTMwMDJcdThCRTVcdTYzRDJcdTRFRjZcdTYyOEEgbWFya2Rvd24gXHU3QjE0XHU4QkIwXHU1M0Q4XHU2MjEwXHU1RTdCXHU3MDZGXHU3MjQ3XHVGRjFBXHU0RTAwXHU0RTJBIGRlY2sgXHU1QzMxXHU2NjJGXHU0RTAwXHU3RUM0XHU2NzA5XHU1RThGXHU5NEZFXHU2M0E1XHU3Njg0XHU3QjE0XHU4QkIwXHVGRjBDXHU2QkNGXHU3QkM3XHU3QjE0XHU4QkIwXHU1QzMxXHU2NjJGXHU0RTAwXHU1RjIwXHU1RTdCXHU3MDZGXHU3MjQ3XHVGRjBDXHU0RUU1XCJcdTRFMDBcdTVDNEZcdTRFMDBcdTUzNjFcIlx1NzY4NFx1NkM4OVx1NkQ3OFx1NUYwRlx1NTM2MVx1NzI0N1x1ODlDNlx1NTZGRVx1NUM1NVx1NzkzQVx1RkYwOFx1NkJDRlx1NUYyMFx1NUU3Qlx1NzA2Rlx1NzI0N1x1OTBGRFx1NEVDRVx1N0IxNFx1OEJCMFx1NUYwMFx1NTkzNFx1NUYwMFx1NTlDQlx1RkYwOVx1MzAwMmAsXG4gICAgYGAsXG4gICAgYFx1NTk4Mlx1NEY1NVx1Njc4NFx1NUVGQVx1NUU3Qlx1NzA2Rlx1NzI0NyBkZWNrXHVGRjFBYCxcbiAgICBgLSBcdTVFN0JcdTcwNkZcdTcyNDdcdTVDMzFcdTY2MkZcdTVFOTNcdTkxQ0NcdTc2ODRcdTY2NkVcdTkwMUEgbWFya2Rvd24gXHU3QjE0XHU4QkIwXHVGRjFCXHU1NTJGXHU0RTAwXHU0RkREXHU3NTU5XHU3Njg0IGZyb250bWF0dGVyIFx1NUM1RVx1NjAyN1x1NjYyRiBkZWNrXHUyMDE0XHUyMDE0XHU2MzA3XHU1NDExXHU0RTBCXHU0RTAwXHU1RjIwXHU3Njg0XHU5NEZFXHU2M0E1XHVGRjA4XHU1OTgyIGRlY2s6IFtcIltbc2xpZGUtMl1dXCJdXHVGRjBDXHU2NzAwXHU1NDBFXHU0RTAwXHU1RjIwXHU1MTk5IGRlY2s6IFtdXHVGRjA5XHUzMDAyXHU5NEZFXHU3Njg0XHU5ODdBXHU1RThGXHU1MzczXHU2NTNFXHU2NjIwXHU5ODdBXHU1RThGXHVGRjBDXHU5ODc1XHU1M0Y3XHU4MUVBXHU1MkE4XHU4QkExXHU3Qjk3XHUzMDAyYCxcbiAgICBgLSBcdTc1MjhcdTU0N0RcdTRFRTQgXCJDcmVhdGUgbmV3IHNsaWRlXCIgXHU2NUIwXHU1RUZBXHU0RTAwXHU1OTU3IGRlY2tcdUZGMDhcdTY1QjBcdTVFRkFcdTdCMTRcdThCQjBcdUZGMENkZWNrOiBbXVx1RkYwOVx1RkYxQlx1NzUyOCBcIkNyZWF0ZSBuZXh0IHNsaWRlXCIgXHU3RUU3XHU3RUVEXHU1MkEwXHU5ODc1XHUyMDE0XHUyMDE0XHU1QjgzXHU0RjFBXHU4MUVBXHU1MkE4XHU2M0E1XHU5MDFBXHU5NEZFXHVGRjA4XHU1RjUzXHU1MjREXHU3QjE0XHU4QkIwXHU3Njg0IGRlY2sgXHU5NEZFXHU2M0E1XHU2MzA3XHU1NDExXHU2NUIwXHU5ODc1XHVGRjBDXHU2NUIwXHU5ODc1XHU3RUU3XHU2MjdGXHU1MzlGXHU2NzY1XHU3Njg0XHU0RTBCXHU0RTAwXHU1RjIwXHVGRjA5XHUzMDAyYCxcbiAgICBgLSBcdTUxODVcdTVCQjlcdTc1MjhcdTdFQUYgbWFya2Rvd24gXHU3RjE2XHU1MTk5XHVGRjBDXHU1NzI4XHU1MzYxXHU3MjQ3XHU0RTBBXHU2RTMyXHU2N0QzXHVGRjFCXHU1QzNEXHU5MUNGXHU0RjdGXHU3NTI4XHU3NTI4XHU2MjM3XHU1RjUzXHU1MjREXHU3Njg0XHU4QkVEXHU4QTAwXHU2M0FBXHU4RjlFXHUzMDAyXHU2QkNGXHU1RjIwXHU1RTdCXHU3MDZGXHU3MjQ3XHU1RkM1XHU5ODdCXHU2NTNFXHU1MTY1XHU0RTAwXHU1QzRGXHUyMDE0XHUyMDE0XHU0RTBCXHU5NzYyXHU3Njg0XHU1QkI5XHU5MUNGXHU2NTcwXHU1QjU3XHU1QzMxXHU2NjJGXHU1M0VGXHU3NTI4XHU5ODg0XHU3Qjk3XHVGRjA4XHU1REYyXHU3RUNGXHU2MjYzXHU2Mzg5IHNsaWRlcyBcdTY4MEZcdTRFMEVcdTUzNjFcdTcyNDdcdTY4MDdcdTk4OThcdUZGMDlcdTMwMDJgLFxuICAgIGAtIFx1NEVFNVx1NzUyOFx1NjIzN1x1NzY4NFx1NUI5RVx1OTY0NVx1OTcwMFx1NkM0Mlx1NEUzQVx1NTE0OFx1RkYxQVx1NzUyOFx1NjIzN1x1ODk4MVx1NEVDMFx1NEU0OFx1RkYwOFx1NTk4MlwiXHU1N0ZBXHU0RThFXHU2N0QwXHU2NzUwXHU2NTk5XHU1MjM2XHU0RjVDIHNsaWRlcyBcdTdCMTRcdThCQjBcIlx1RkYwOVx1NUMzMVx1NTA1QVx1NEVDMFx1NEU0OFx1RkYwQ1x1NjNEMlx1NEVGNlx1NzY4NFx1N0VBNlx1NUI5QVx1NTNFQVx1NjYyRlx1NUY2Mlx1NUYwRlx1RkYwQ1x1NEUwRFx1NjYyRlx1NTE4NVx1NUJCOVx1MzAwMmAsXG4gIF07XG59XG5cbmZ1bmN0aW9uIGVuUHJvbXB0KG06IFNsaWRlTWV0cmljcywgYzogQ2FwYWNpdHlSZXN1bHQsIG5vdGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGJhciA9XG4gICAgbS5iYXIudmlzaWJsZSB8fCBtLmJhci5oZWlnaHQgPiAwXG4gICAgICA/IGBTbGlkZXMgYmFyOiB2aXNpYmxlLCAke20uYmFyLmhlaWdodH1weCAoYWxyZWFkeSBleGNsdWRlZCBmcm9tIHRoZSB0ZXh0IGFyZWEpLmBcbiAgICAgIDogXCJTbGlkZXMgYmFyOiBoaWRkZW4uXCI7XG4gIGNvbnN0IHRpdGxlID1cbiAgICBtLnRpdGxlUmVzZXJ2ZWQgPiAwID8gYENhcmQgdGl0bGU6ICR7bS50aXRsZVJlc2VydmVkfXB4IHJlc2VydmVkLmAgOiBcIkNhcmQgdGl0bGU6IG5vbmUuXCI7XG4gIGNvbnN0IGltZyA9XG4gICAgbS5pbWFnZUhlaWdodCAhPT0gbnVsbCA/IGBJbWFnZTogJHttLmltYWdlSGVpZ2h0fXB4IHRhbGwgKGZpcnN0IGltYWdlIG9uIHRoZSBzbGlkZSkuYCA6IFwiXCI7XG4gIGNvbnN0IHNhbXBsZXMgPSBbXG4gICAgYFBsYWluIHRleHQ6ICR7Yy5ib2R5TGluZXN9IGJvZHkgbGluZXNgLFxuICAgIGBIMSArIGJ1bGxldHM6ICR7Yy5jb21ib3MuYWZ0ZXJIMUJ1bGxldHN9IGJ1bGxldHMgYWZ0ZXIgYSBIMSBsaW5lYCxcbiAgICBgUHVyZSBsaXN0OiAke2MuYnVsbGV0c30gYnVsbGV0IGl0ZW1zYCxcbiAgICBgSDEgbGluZXMgb25seTogJHtjLmgxTGluZXN9YCxcbiAgXS5qb2luKFwiOyBcIik7XG4gIHJldHVybiBbXG4gICAgYFNsaWRlIGNhcGFjaXR5IFx1MjAxNCBvbmUgc2NyZWVuLCBubyBzY3JvbGxpbmcuIEdlbmVyYXRlZCBmcm9tIHRoZSBsaXZlIFNsaWRlcyBsYXlvdXQgb2YgdGhpcyBub3RlOyBldmVyeSBudW1iZXIgaXMgbWVhc3VyZWQvYnJhbmNoLWRlcml2ZWQgYXQgdGhlIGN1cnJlbnQgVUkgc2NhbGUuYCxcbiAgICBgYCxcbiAgICAuLi5lbkNvbnRleHQoKSxcbiAgICBgYCxcbiAgICBgR2VvbWV0cnk6IHNjcmVlbiAke20udmlld3BvcnQud2lkdGh9XHUwMEQ3JHttLnZpZXdwb3J0LmhlaWdodH1weDsgdGV4dCBhcmVhICR7bS50ZXh0LndpZHRofVx1MDBENyR7bS50ZXh0LmhlaWdodH1weC4gJHtiYXJ9ICR7dGl0bGV9YCxcbiAgICBgYCxcbiAgICBgVGV4dCBtZXRyaWNzIChib2R5IGZvbnQgJHtmbXQobS5ib2R5LmZvbnRTaXplKX1weCk6YCxcbiAgICBgY2hhcnMvbGluZSBcdTIyNDggJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5sYXRpbil9IGxhdGluIC8gJHtNYXRoLmZsb29yKG0udGV4dC53aWR0aCAvIG0uY2hhci5jamspfSBDSks7IGJvZHkgbGluZSAke2ZtdChtLmJvZHkubGluZUhlaWdodCl9cHguYCxcbiAgICBib3hTdHIoXCJIMVwiLCBtLmgxKSxcbiAgICBib3hTdHIoXCJIMlwiLCBtLmgyKSxcbiAgICBib3hTdHIoXCJIM1wiLCBtLmgzKSxcbiAgICBib3hTdHIoXG4gICAgICBcImJ1bGxldFwiLFxuICAgICAgbS5idWxsZXQgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uYnVsbGV0Lml0ZW1IZWlnaHQgfSA6IG51bGwsXG4gICAgKSxcbiAgICBib3hTdHIoXCJjb2RlXCIsIG0uY29kZSA/IHsgZm9udFNpemU6IG0uYm9keS5mb250U2l6ZSwgbGluZUhlaWdodDogbS5jb2RlLmxpbmVIZWlnaHQgfSA6IG51bGwpLFxuICBdXG4gICAgLmNvbmNhdChpbWcgPyBbaW1nXSA6IFtdKVxuICAgIC5jb25jYXQoW2BgLCBgQ2FwYWNpdHk6ICR7c2FtcGxlc30uYCwgYGAsIG5vdGVdKVxuICAgIC5qb2luKFwiXFxuXCIpO1xufVxuXG5mdW5jdGlvbiB6aFByb21wdChtOiBTbGlkZU1ldHJpY3MsIGM6IENhcGFjaXR5UmVzdWx0LCBub3RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBiYXIgPVxuICAgIG0uYmFyLnZpc2libGUgfHwgbS5iYXIuaGVpZ2h0ID4gMFxuICAgICAgPyBgU2xpZGVzIFx1NjgwRlx1RkYxQVx1NjYzRVx1NzkzQVx1RkYwQyR7bS5iYXIuaGVpZ2h0fXB4XHVGRjA4XHU1REYyXHU0RUNFXHU2NTg3XHU1QjU3XHU1MzNBXHU2MjYzXHU1MUNGXHVGRjA5XHUzMDAyYFxuICAgICAgOiBcIlNsaWRlcyBcdTY4MEZcdUZGMUFcdTk2OTBcdTg1Q0ZcdTMwMDJcIjtcbiAgY29uc3QgdGl0bGUgPSBtLnRpdGxlUmVzZXJ2ZWQgPiAwID8gYFx1NTM2MVx1NzI0N1x1NjgwN1x1OTg5OFx1RkYxQVx1OTg4NFx1NzU1OSAke20udGl0bGVSZXNlcnZlZH1weFx1MzAwMmAgOiBcIlx1NTM2MVx1NzI0N1x1NjgwN1x1OTg5OFx1RkYxQVx1NjVFMFx1MzAwMlwiO1xuICBjb25zdCBpbWcgPSBtLmltYWdlSGVpZ2h0ICE9PSBudWxsID8gYFx1NTZGRVx1NzI0N1x1RkYxQSR7bS5pbWFnZUhlaWdodH1weCBcdTlBRDhcdUZGMDhcdTVGNTNcdTUyNERcdTk4NzVcdTdCMkNcdTRFMDBcdTVGMjBcdUZGMDlcdTMwMDJgIDogXCJcIjtcbiAgY29uc3Qgc2FtcGxlcyA9IFtcbiAgICBgXHU3RUFGXHU2QjYzXHU2NTg3XHVGRjFBJHtjLmJvZHlMaW5lc30gXHU4ODRDYCxcbiAgICBgSDEgKyBcdTUyMTdcdTg4NjhcdUZGMUFIMSBcdTU0MEVcdThGRDhcdTUzRUZcdTY1M0UgJHtjLmNvbWJvcy5hZnRlckgxQnVsbGV0c30gXHU0RTJBXHU1MjE3XHU4ODY4XHU5ODc5YCxcbiAgICBgXHU3RUFGXHU1MjE3XHU4ODY4XHVGRjFBJHtjLmJ1bGxldHN9IFx1NEUyQVx1NTIxN1x1ODg2OFx1OTg3OWAsXG4gICAgYFx1N0VBRiBIMVx1RkYxQSR7Yy5oMUxpbmVzfSBcdTg4NENgLFxuICBdLmpvaW4oXCJcdUZGMUJcIik7XG4gIHJldHVybiBbXG4gICAgYFx1NUU3Qlx1NzA2Rlx1NzI0N1x1NUJCOVx1OTFDRiBcdTIwMTRcdTIwMTQgXHU0RTAwXHU1QzRGXHVGRjBDXHU0RTBEXHU2RURBXHU1MkE4XHUzMDAyXHU1N0ZBXHU0RThFXHU1RjUzXHU1MjREXHU3QjE0XHU4QkIwXHU3Njg0XHU1QjlFXHU2NUY2IFNsaWRlcyBcdTVFMDNcdTVDNDBcdTc1MUZcdTYyMTBcdUZGMUJcdTYyNDBcdTY3MDlcdTY1NzBcdTVCNTdcdTYzMDlcdTVGNTNcdTUyNEQgVUkgXHU2QkQ0XHU0RjhCXHU1QjlFXHU2RDRCL1x1NjNBOFx1N0I5N1x1MzAwMmAsXG4gICAgYGAsXG4gICAgLi4uemhDb250ZXh0KCksXG4gICAgYGAsXG4gICAgYFx1NTFFMFx1NEY1NVx1RkYxQVx1NUM0Rlx1NUU1NSAke20udmlld3BvcnQud2lkdGh9XHUwMEQ3JHttLnZpZXdwb3J0LmhlaWdodH1weFx1RkYxQlx1NjU4N1x1NUI1N1x1NTMzQSAke20udGV4dC53aWR0aH1cdTAwRDcke20udGV4dC5oZWlnaHR9cHhcdTMwMDIke2Jhcn0gJHt0aXRsZX1gLFxuICAgIGBgLFxuICAgIGBcdTY1ODdcdTVCNTdcdTUzQzJcdTY1NzBcdUZGMDhcdTZCNjNcdTY1ODcgJHtmbXQobS5ib2R5LmZvbnRTaXplKX1weFx1RkYwOVx1RkYxQWAsXG4gICAgYFx1NkJDRlx1ODg0Q1x1N0VBNiAke01hdGguZmxvb3IobS50ZXh0LndpZHRoIC8gbS5jaGFyLmNqayl9IFx1NEUyQVx1NkM0OVx1NUI1NyAvICR7TWF0aC5mbG9vcihtLnRleHQud2lkdGggLyBtLmNoYXIubGF0aW4pfSBcdTRFMkFcdTYyQzlcdTRFMDFcdTVCNTdcdTdCMjZcdUZGMUJcdTZCNjNcdTY1ODdcdTg4NENcdTlBRDggJHtmbXQobS5ib2R5LmxpbmVIZWlnaHQpfXB4XHUzMDAyYCxcbiAgICBib3hTdHIoXCJIMVwiLCBtLmgxKSxcbiAgICBib3hTdHIoXCJIMlwiLCBtLmgyKSxcbiAgICBib3hTdHIoXCJIM1wiLCBtLmgzKSxcbiAgICBib3hTdHIoXG4gICAgICBcIlx1NTIxN1x1ODg2OFx1OTg3OVwiLFxuICAgICAgbS5idWxsZXQgPyB7IGZvbnRTaXplOiBtLmJvZHkuZm9udFNpemUsIGxpbmVIZWlnaHQ6IG0uYnVsbGV0Lml0ZW1IZWlnaHQgfSA6IG51bGwsXG4gICAgKSxcbiAgICBib3hTdHIoXCJcdTRFRTNcdTc4MDFcdTg4NENcIiwgbS5jb2RlID8geyBmb250U2l6ZTogbS5ib2R5LmZvbnRTaXplLCBsaW5lSGVpZ2h0OiBtLmNvZGUubGluZUhlaWdodCB9IDogbnVsbCksXG4gIF1cbiAgICAuY29uY2F0KGltZyA/IFtpbWddIDogW10pXG4gICAgLmNvbmNhdChbYGAsIGBcdTVCQjlcdTkxQ0ZcdUZGMUEke3NhbXBsZXN9XHUzMDAyYCwgYGAsIG5vdGVdKVxuICAgIC5qb2luKFwiXFxuXCIpO1xufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgY2FwYWNpdHkgcHJvbXB0LiBGb2xsb3dzIHRoZSBPYnNpZGlhbiBVSSBsYW5ndWFnZSB2aWEgYGxvY2FsZWBcbiAqIChtZWFzdXJlZCBzZXBhcmF0ZWx5IGZyb20gdGhlIGFwcCkuIFRoZSBgbm90ZWAgdGFpbCBzdGF0ZXMgdGhlIHBvbGljeVxuICogKHdoYXQgZml0cyBvbmUgc2NyZWVuKSBcdTIwMTQgc2FtZSB3b3JkaW5nIGluIGJvdGggbGFuZ3VhZ2VzIHdoZXJlIHBvc3NpYmxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q2FwYWNpdHkobTogU2xpZGVNZXRyaWNzLCBjOiBDYXBhY2l0eVJlc3VsdCwgbG9jYWxlOiBcInpoXCIgfCBcImVuXCIpOiBzdHJpbmcge1xuICBjb25zdCBub3RlID1cbiAgICBsb2NhbGUgPT09IFwiemhcIlxuICAgICAgPyBcIlx1NzUyOFx1NkNENVx1RkYxQVx1NzUyOFx1NjIzN1x1NEYxQVx1NjNEMFx1NEY5Qlx1Njc1MFx1NjU5OVx1NUU3Nlx1OEJGNFx1MzAwQ1x1NTdGQVx1NEU4RVx1OEJFNVx1Njc1MFx1NjU5OVx1NTIzNlx1NEY1QyBzbGlkZXMvUFBUIFx1N0IxNFx1OEJCMFx1MzAwRFx1RkYxQlx1NkI2NFx1NjVGNlx1NjMwOVx1NEUwQVx1NjU4N1x1N0VBNlx1NUI5QVx1NTIxQlx1NUVGQSBkZWNrIFx1MjAxNFx1MjAxNCBcdTUxNDhcdTRFODZcdTg5RTNcdTY3NTBcdTY1OTlcdTVFNzZcdTdFRDlcdTUxRkFcdTYzRDBcdTdFQjIvXHU4OUM0XHU1MjEyXHVGRjBDXHU1MThEXHU5MDEwXHU5ODc1XHU3NTFGXHU2MjEwXHU3QjE0XHU4QkIwXHVGRjFCXHU2QkNGXHU0RTJBXHU1MzYxXHU3MjQ3XHVGRjA4XHU3QjE0XHU4QkIwXHVGRjA5XHU1MTg1XHU2NTNFXHU2MDcwXHU1MjMwXHU1OTdEXHU1OTA0XHU3Njg0XHU1MTg1XHU1QkI5XHVGRjBDXHU0RTBEXHU4OTgxXHU4RDg1XHU1MUZBXHU1QkI5XHU5MUNGXHUzMDAyXHU4OTgxXHU2QzQyXHVGRjFBXHU3NTFGXHU2MjEwXHU3Njg0XHU1MTg1XHU1QkI5XHU1RkM1XHU5ODdCXHU2NTNFXHU1NzI4XHU1RjUzXHU1MjREXHU4RkQ5XHU0RTAwXHU1QzRGXHU1MTg1XHVGRjBDXHU0RTBEXHU2RURBXHU1MkE4XHVGRjFCXHU3NTI4XHU0RTBBXHU5NzYyXHU3Njg0XHU1MUUwXHU0RjU1XHU0RTBFXHU4ODRDXHU5QUQ4XHU2NTcwXHU1QjU3XHU2ODM4XHU3Qjk3XHU2MDNCXHU5QUQ4XHU1RUE2XHVGRjA4XHU2QjYzXHU2NTg3XHU4ODRDXHU2NTcwIFx1MDBENyBcdTg4NENcdTlBRDggKyBcdTY4MDdcdTk4OThcdTk4ODRcdTc1NTkgKyBcdTU3NTdcdTk1RjRcdTk1RjRcdThEREQgXHUyMjY0IFx1NjU4N1x1NUI1N1x1NTMzQVx1OUFEOFx1NUVBNlx1RkYwOVx1MzAwMlwiXG4gICAgICA6IFwiVXNhZ2U6IHRoZSB1c2VyIHdpbGwgcHJvdmlkZSBtYXRlcmlhbCBhbmQgYXNrIHRvIG1ha2Ugc2xpZGVzL1BQVCBub3RlcyBmb3IgaXQ7IGluIHRoYXQgY2FzZSBjcmVhdGUgYSBkZWNrIHBlciB0aGUgY29udmVudGlvbnMgYWJvdmUgXHUyMDE0IHJldmlldyB0aGUgbWF0ZXJpYWwgYW5kIG91dGxpbmUgdGhlIHN0cnVjdHVyZSBmaXJzdCwgdGhlbiBnZW5lcmF0ZSBlYWNoIHNsaWRlIG5vdGU7IGtlZXAgZWFjaCBjYXJkJ3MgY29udGVudCBqdXN0IHdpdGhpbiBjYXBhY2l0eS4gUmVxdWlyZW1lbnQ6IHRoZSBnZW5lcmF0ZWQgY29udGVudCBtdXN0IGZpdCB0aGlzIG9uZSBzY3JlZW4gXHUyMDE0IG5vIHNjcm9sbGluZy4gQ2hlY2sgdGhlIHRvdGFsIGhlaWdodCB3aXRoIHRoZSBudW1iZXJzIGFib3ZlIChsaW5lcyBcdTAwRDcgbGluZS1oZWlnaHQgKyB0aXRsZSByZXNlcnZlICsgaW50ZXItYmxvY2sgc3BhY2luZyBcdTIyNjQgdGV4dCBhcmVhIGhlaWdodCkuXCI7XG4gIHJldHVybiBsb2NhbGUgPT09IFwiemhcIiA/IHpoUHJvbXB0KG0sIGMsIG5vdGUpIDogZW5Qcm9tcHQobSwgYywgbm90ZSk7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIE5vdGljZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgaXNMaXZlUHJldmlldyB9IGZyb20gXCIuL21vZGVcIjtcblxuLyoqXG4gKiBUeXBvZ3JhcGh5LW1lYXN1cmVtZW50IHRvb2xpbmcgKGRldiBidWlsZHMgb25seSkuXG4gKlxuICogVGhlIGBucy1kZWJ1Zy1zdHlsZXNgIGNvbW1hbmQgc2FtcGxlcyB0aGUgZml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIGluXG4gKiBlZGl0IChMaXZlIFByZXZpZXcpIGFuZCB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgaW4gcmVhZGluZyB2aWV3LCBtZXJnZXMgdGhlXG4gKiByZXN1bHRzLCBjb21wdXRlcyBhbiBlZGl0LXZzLXJlYWRpbmcgZGlmZiBhbmQgd3JpdGVzIGl0IHRvXG4gKiAubmF0aXZlLXNsaWRlcy1kZWJ1Zy5qc29uIGluIHRoZSB2YXVsdCByb290LiBSZWdpc3RlcmVkIG9ubHkgd2hlbiB0aGVcbiAqIGJ1aWxkLXRpbWUgREVWX01PREUgZmxhZyBpcyB0cnVlOyByZWxlYXNlIGJ1aWxkcyB0cmVlLXNoYWtlIHRoaXMgbW9kdWxlIG91dC5cbiAqL1xuXG4vKiogRml4ZWQgb25lLXBhZ2Ugc2FtcGxlIG5vdGVzIHVzZWQgYnkgdGhlIGRlYnVnIGNvbW1hbmQgKGVkaXQgc2lkZSkgKi9cbmV4cG9ydCBjb25zdCBTQU1QTEVfTk9URV9OQU1FUyA9IFtcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1oZWFkaW5nc1wiLFxuICBcInR5cG9ncmFwaHktc2FtcGxlLWxpc3RcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1jb2RlXCIsXG4gIFwidHlwb2dyYXBoeS1zYW1wbGUtcXVvdGVcIixcbiAgXCJ0eXBvZ3JhcGh5LXNhbXBsZS1tZWRpYVwiLFxuXTtcblxuLyoqIFN0eWxlIHNlY3Rpb25zIHNhbXBsZWQgYnkgc2FtcGxlU3R5bGVzKCkgYW5kIGNvbXBhcmVkIGJ5IGRpZmZEdW1wcygpICovXG5jb25zdCBTVFlMRV9TRUNUSU9OUyA9IFtcbiAgXCJjb250YWluZXJcIixcbiAgXCJwYXJhZ3JhcGhcIixcbiAgXCJoMVwiLFxuICBcImxpc3RJdGVtXCIsXG4gIFwiY29kZUJsb2NrXCIsXG4gIFwiYmxvY2txdW90ZVwiLFxuICBcImlubGluZUNvZGVcIixcbiAgXCJ0YWJsZVwiLFxuICBcImltYWdlXCIsXG4gIFwiaG9yaXpvbnRhbFJ1bGVcIixcbl07XG5cbi8qKiBQcm9taXNlLWJhc2VkIHNsZWVwICovXG5mdW5jdGlvbiBzbGVlcChtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gd2luZG93LnNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbn1cblxuLyoqXG4gKiBNZXJnZSBub24tbWlzc2luZyBzdHlsZSBzZWN0aW9ucyBvZiBhIGZyZXNoIHNhbXBsZSBpbnRvIHRoZSB0YXJnZXRcbiAqIChmaXJzdCBub24tbWlzc2luZyB2YWx1ZSB3aW5zKS5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VTYW1wbGUodGFyZ2V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgc2FtcGxlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHZvaWQge1xuICBmb3IgKGNvbnN0IGtleSBvZiBTVFlMRV9TRUNUSU9OUykge1xuICAgIGNvbnN0IHNlY3Rpb24gPSBzYW1wbGVba2V5XSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHwgdW5kZWZpbmVkO1xuICAgIGlmICghc2VjdGlvbiB8fCBcIihtaXNzaW5nKVwiIGluIHNlY3Rpb24pIGNvbnRpbnVlO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGFyZ2V0W2tleV0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZDtcbiAgICBpZiAoZXhpc3RpbmcgJiYgIShcIihtaXNzaW5nKVwiIGluIGV4aXN0aW5nKSkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzZWN0aW9uO1xuICB9XG4gIC8vIFByb2JlIGZpZWxkcyByaWRlIGFsb25nIChmaXJzdCBub24tZW1wdHkgd2lucylcbiAgZm9yIChjb25zdCBrZXkgb2YgW1xuICAgIFwibGlzdExpbmVzXCIsXG4gICAgXCJtZXRhZGF0YUNvbnRhaW5lckRpc3BsYXlcIixcbiAgICBcImgxT2Zmc2V0VG9wXCIsXG4gICAgXCJoMVRvcEluQ29udGVudFwiLFxuICAgIFwiaDFMZWZ0SW5Db250ZW50XCIsXG4gICAgXCJ0aXRsZVwiLFxuICAgIFwiY29udGVudENoaWxkcmVuXCIsXG4gICAgXCJ0b3BDaGFpblwiLFxuICBdKSB7XG4gICAgY29uc3QgcHJvYmUgPSBzYW1wbGVba2V5XTtcbiAgICBpZiAocHJvYmUgPT09IHVuZGVmaW5lZCB8fCBwcm9iZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvYmUpICYmIHByb2JlLmxlbmd0aCA9PT0gMCkgY29udGludWU7XG4gICAgaWYgKHR5cGVvZiBwcm9iZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShwcm9iZSkgJiYgT2JqZWN0LmtleXMocHJvYmUpLmxlbmd0aCA9PT0gMClcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmICh0YXJnZXRba2V5XSA9PT0gdW5kZWZpbmVkKSB0YXJnZXRba2V5XSA9IHByb2JlO1xuICB9XG59XG5cbi8qKlxuICogQ29tcGFyZSB0aGUgc3R5bGUgc2VjdGlvbnMgb2YgYW4gZWRpdCBkdW1wIGFuZCBhIHJlYWRpbmcgZHVtcDsgb25seVxuICoga2V5cyB3aG9zZSB2YWx1ZXMgZGlmZmVyIGFyZSBrZXB0LCBhcyB7IGtleTogeyBlZGl0LCByZWFkaW5nIH0gfS5cbiAqL1xuZnVuY3Rpb24gZGlmZkR1bXBzKFxuICBlZGl0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgcmVhZGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IG91dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgZm9yIChjb25zdCBzZWN0aW9uIG9mIFNUWUxFX1NFQ1RJT05TKSB7XG4gICAgY29uc3QgZSA9IChlZGl0W3NlY3Rpb25dID8/IHt9KSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIGNvbnN0IHIgPSAocmVhZGluZ1tzZWN0aW9uXSA/PyB7fSkgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldChbLi4uT2JqZWN0LmtleXMoZSksIC4uLk9iamVjdC5rZXlzKHIpXSk7XG4gICAgY29uc3QgZGlmZnM6IFJlY29yZDxzdHJpbmcsIHsgZWRpdDogc3RyaW5nOyByZWFkaW5nOiBzdHJpbmcgfT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICBpZiAoZVtrZXldICE9PSByW2tleV0pIHtcbiAgICAgICAgZGlmZnNba2V5XSA9IHsgZWRpdDogZVtrZXldID8/IFwiKG1pc3NpbmcpXCIsIHJlYWRpbmc6IHJba2V5XSA/PyBcIihtaXNzaW5nKVwiIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhkaWZmcykubGVuZ3RoID4gMCkgb3V0W3NlY3Rpb25dID0gZGlmZnM7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqIFNhbXBsZSB0aGUgY3VycmVudCB2aWV3J3MgdHlwb2dyYXBoeSBjb21wdXRlZCBzdHlsZXMgKyBDU1MgdmFyaWFibGVzICovXG5mdW5jdGlvbiBzYW1wbGVTdHlsZXMoYXBwOiBBcHApOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCB2aWV3ID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gIGlmICghdmlldykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGlzRWRpdCA9IHZpZXcuZ2V0TW9kZSgpID09PSBcInNvdXJjZVwiO1xuICBjb25zdCBjb250ZW50RWwgPSB2aWV3LmNvbnRlbnRFbDtcbiAgLy8gRmlyc3QgbWF0Y2hpbmcgY2FuZGlkYXRlIHdpbnMgXHUyMDE0IGVkaXQgKGNtNikgYW5kIHJlYWRpbmcgdXNlXG4gIC8vIGRpZmZlcmVudCBlbGVtZW50IHN0cnVjdHVyZXMgKGUuZy4gbm8gcHJlL2Jsb2NrcXVvdGUgaW4gY202KS5cbiAgY29uc3QgcGljayA9IChzZWxzOiBzdHJpbmdbXSk6IEhUTUxFbGVtZW50IHwgbnVsbCA9PiB7XG4gICAgZm9yIChjb25zdCBzZWwgb2Ygc2Vscykge1xuICAgICAgY29uc3QgZWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc2VsKTtcbiAgICAgIGlmIChlbCkgcmV0dXJuIGVsO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgY29uc3Qgc3R5bGUgPSAoZWw6IEhUTUxFbGVtZW50IHwgbnVsbCwgcHJvcHM6IHN0cmluZ1tdKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gICAgaWYgKCFlbCkgcmV0dXJuIHsgXCIobWlzc2luZylcIjogXCJlbGVtZW50IG5vdCBpbiB0aGlzIG5vdGVcIiB9O1xuICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgZm9yIChjb25zdCBwIG9mIHByb3BzKSB7XG4gICAgICBjb25zdCB2ID0gY3MuZ2V0UHJvcGVydHlWYWx1ZShwKS50cmltKCk7XG4gICAgICBpZiAodikgb3V0W3BdID0gdjtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgY29uc3QgdmFycyA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XG4gIGNvbnN0IGNzc1ZhciA9IChuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4gdmFycy5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpLnRyaW0oKTtcblxuICBjb25zdCBjb250YWluZXIgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuY20tY29udGVudFwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3XCIsXG4gIF0pO1xuICBjb25zdCBwYXJhID0gcGljayhbXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWxpbmU6bm90KC5IeXBlck1ELWhlYWRlcilcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBwXCIsXG4gIF0pO1xuICBjb25zdCBoMSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWhlYWRlci0xXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgaDFcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBoMVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGgxXCIsXG4gIF0pO1xuICBjb25zdCBsaXN0SXRlbSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtbGlzdC1saW5lXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgdWwgPiBsaVwiLFxuICAgIGlzRWRpdCA/IFwiLkh5cGVyTUQtbGlzdC1saW5lXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyB1bCA+IGxpXCIsXG4gIF0pO1xuICBjb25zdCBwcmUgPSBwaWNrKFtcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBwcmVcIlxuICAgICAgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyBwcmVcIixcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IC5jbS1lZGl0aW5nIHByZVwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IHByZVwiLFxuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLkh5cGVyTUQtY29kZWJsb2NrXCIgOiBcIi5tYXJrZG93bi1wcmV2aWV3LXZpZXcgcHJlXCIsXG4gIF0pO1xuICBjb25zdCBxdW90ZSA9IHBpY2soW1xuICAgIGlzRWRpdCA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgYmxvY2txdW90ZVwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGJsb2NrcXVvdGVcIixcbiAgICBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiAuSHlwZXJNRC1xdW90ZVwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3IGJsb2NrcXVvdGVcIixcbiAgXSk7XG4gIGNvbnN0IGlubGluZUNvZGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IGNvZGVcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBjb2RlXCIsXG4gICAgaXNFZGl0XG4gICAgICA/IFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYgLmNtLWlubGluZS1jb2RlXCJcbiAgICAgIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgY29kZVwiLFxuICBdKTtcbiAgY29uc3QgdGFibGUgPSBwaWNrKFtcbiAgICBpc0VkaXQgPyBcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202IHRhYmxlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgdGFibGVcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIHRhYmxlXCIgOiBcIi5tYXJrZG93bi1yZWFkaW5nLXZpZXcgLm1hcmtkb3duLXByZXZpZXctdmlldyB0YWJsZVwiLFxuICBdKTtcbiAgY29uc3QgaW1nID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBpbWdcIiA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyBpbWdcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1saW5lIGltZ1wiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaW1nXCIsXG4gICAgXCJpbWdcIiwgLy8gd2hvbGUtZG9jdW1lbnQgZmFsbGJhY2tcbiAgXSk7XG4gIGNvbnN0IGhyID0gcGljayhbXG4gICAgaXNFZGl0ID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNiBoclwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IGhyXCIsXG4gICAgaXNFZGl0ID8gXCIuY20tbGluZSBoclwiIDogXCIubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXZpZXcgaHJcIixcbiAgICBpc0VkaXQgPyBcIi5jbS1oclwiIDogXCIubWFya2Rvd24tcHJldmlldy12aWV3IGhyXCIsXG4gIF0pO1xuXG4gIC8vIFN0cnVjdHVyZSBwcm9iZXMgKGVkaXQgdmlldyBvbmx5KTogdGhlIHNvdXJjZS12aWV3IGNsYXNzIGxpc3RcbiAgLy8gKGNvbmZpcm1zIHRoZSBMaXZlIFByZXZpZXcgbWFya2VyIGNsYXNzKSBhbmQgdW5pcXVlIGVsZW1lbnQgdGFnc1xuICAvLyBpbnNpZGUgdGhlIGVkaXRvciAocmV2ZWFscyBob3cgY202IHJlbmRlcnMgY29kZSBibG9ja3MgZXRjLiB3aGVuXG4gIC8vIHRoZSB1c3VhbCBzZWxlY3RvcnMgZG8gbm90IG1hdGNoKS5cbiAgY29uc3Qgc291cmNlVmlld0NsYXNzID0gY29udGVudEVsLnF1ZXJ5U2VsZWN0b3IoXCIubWFya2Rvd24tc291cmNlLXZpZXcubW9kLWNtNlwiKT8uY2xhc3NOYW1lID8/IFwiXCI7XG4gIGNvbnN0IGRvbVRhZ3M6IHN0cmluZ1tdID0gW107XG4gIGlmIChpc0VkaXQpIHtcbiAgICBjb25zdCB0YWdzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgY29udGVudEVsXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5tYXJrZG93bi1zb3VyY2Utdmlldy5tb2QtY202ICpcIilcbiAgICAgIC5mb3JFYWNoKChlbCkgPT4gdGFncy5hZGQoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSk7XG4gICAgZG9tVGFncy5wdXNoKC4uLnRhZ3MpO1xuICB9XG4gIC8vIExpc3QtbGluZSBwcm9iZSAoZWRpdCB2aWV3IG9ubHkpOiBjbGFzcyBuYW1lcyArIGNvbXB1dGVkIHBhZGRpbmdcbiAgLy8gb2YgdGhlIGZpcnN0IGxpc3QgbGluZXMgXHUyMDE0IG5lc3RlZCBsZXZlbHMgb2Z0ZW4gdXNlIGRpc3RpbmN0XG4gIC8vIGNsYXNzZXMgb3IgaW5saW5lIHBhZGRpbmdzLCB3aGljaCBkZWNpZGVzIHdoZXRoZXIgYSBsZXZlbC1hd2FyZVxuICAvLyBpbmRlbnQgb3ZlcnJpZGUgaXMgZXZlbiBwb3NzaWJsZS5cbiAgY29uc3QgbGlzdExpbmVzOiB7IGNsYXNzTmFtZTogc3RyaW5nOyBwYWRkaW5nTGVmdDogc3RyaW5nIH1bXSA9IFtdO1xuICBpZiAoaXNFZGl0KSB7XG4gICAgY29udGVudEVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuSHlwZXJNRC1saXN0LWxpbmVcIikuZm9yRWFjaCgoZWwsIGkpID0+IHtcbiAgICAgIGlmIChpID49IDQpIHJldHVybjtcbiAgICAgIGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBsaXN0TGluZXMucHVzaCh7XG4gICAgICAgIGNsYXNzTmFtZTogZWwuY2xhc3NOYW1lLFxuICAgICAgICBwYWRkaW5nTGVmdDogY3MuZ2V0UHJvcGVydHlWYWx1ZShcInBhZGRpbmctbGVmdFwiKS50cmltKCksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICAvLyBGcm9udG1hdHRlciBwcm9iZXM6IGRvZXMgdGhlIChoaWRkZW4pIHByb3BlcnRpZXMgYXJlYSBzdGlsbFxuICAvLyBvY2N1cHkgc3BhY2UgaW4gTGl2ZSBQcmV2aWV3PyBBbmQgaG93IGZhciBpcyB0aGUgSDEgZnJvbSB0aGVcbiAgLy8gdG9wIG9mIHRoZSBjb250ZW50IGFyZWE/IChyZWFkaW5nIG1vZGUgaGFzIG5vIHN1Y2ggcGFkZGluZylcbiAgY29uc3QgbWV0YWRhdGFEaXNwbGF5ID0gKCgpID0+IHtcbiAgICBjb25zdCBzZWwgPSBpc0VkaXRcbiAgICAgID8gXCIubWFya2Rvd24tc291cmNlLXZpZXcgLm1ldGFkYXRhLWNvbnRhaW5lclwiXG4gICAgICA6IFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWV0YWRhdGEtY29udGFpbmVyXCI7XG4gICAgY29uc3QgZWwgPSBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oc2VsKTtcbiAgICByZXR1cm4gZWwgPyBnZXRDb21wdXRlZFN0eWxlKGVsKS5kaXNwbGF5IDogXCIobm90IGluIERPTSlcIjtcbiAgfSkoKTtcbiAgY29uc3QgaDFPZmZzZXRUb3AgPSAoKCkgPT4ge1xuICAgIGlmICghaDEpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IHRvcCA9IDA7XG4gICAgbGV0IG5vZGU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGgxO1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT09IGNvbnRlbnRFbCAmJiBub2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICB0b3AgKz0gbm9kZS5vZmZzZXRUb3A7XG4gICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdG9wO1xuICB9KSgpO1xuICAvLyBXaGF0IG9jY3VwaWVzIHRoZSBzcGFjZSBiZXR3ZWVuIHRoZSBjb250ZW50IHRvcCBhbmQgdGhlIEgxP1xuICAvLyAoZWRpdCkgZmlyc3QgY2hpbGRyZW4gb2YgLmNtLWNvbnRlbnQsIGFuZCB0aGUgbmV0IEgxIGRpc3RhbmNlXG4gIC8vIGZyb20gdGhlIGNvbnRlbnQgYW5jaG9yIFx1MjAxNCByZWFkaW5nIGhhcyBubyBzdWNoIGdhcC5cbiAgY29uc3QgYW5jaG9yID0gaXNFZGl0XG4gICAgPyBjb250ZW50RWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIuY20tY29udGVudFwiKVxuICAgIDogY29udGVudEVsLnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KFwiLm1hcmtkb3duLXJlYWRpbmctdmlldyAubWFya2Rvd24tcHJldmlldy12aWV3XCIpO1xuICBjb25zdCBoMVRvcEluQ29udGVudCA9ICgoKSA9PiB7XG4gICAgaWYgKCFoMSB8fCAhYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGgxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGFuY2hvci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApO1xuICB9KSgpO1xuICBjb25zdCBoMUxlZnRJbkNvbnRlbnQgPSAoKCkgPT4ge1xuICAgIGlmICghaDEgfHwgIWFuY2hvcikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChoMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpO1xuICB9KSgpO1xuICBjb25zdCBjb250ZW50Q2hpbGRyZW4gPSAoKCkgPT4ge1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFuY2hvci5jaGlsZHJlbilcbiAgICAgIC5zbGljZSgwLCA0KVxuICAgICAgLm1hcCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjbHM6IChlbCBhcyBIVE1MRWxlbWVudCkuY2xhc3NOYW1lIHx8IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICBkaXNwbGF5OiBjcy5kaXNwbGF5LFxuICAgICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpLFxuICAgICAgICAgIG1hcmdpblRvcDogY3MubWFyZ2luVG9wLFxuICAgICAgICAgIHBhZGRpbmdUb3A6IGNzLnBhZGRpbmdUb3AsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiBjcy5tYXJnaW5Cb3R0b20sXG4gICAgICAgICAgcGFkZGluZ0JvdHRvbTogY3MucGFkZGluZ0JvdHRvbSxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9KSgpO1xuICAvLyBDb250YWluZXIgY2hhaW4gcHJvYmU6IGZyb20gLmNtLWNvbnRlbnQgdXAgdG8gdGhlIHZpZXctY29udGVudCxcbiAgLy8gZWFjaCB3cmFwcGVyJ3MgcGFkZGluZy9tYXJnaW4gXHUyMDE0IGxvY2F0ZXMgdGhlIGxlZnRvdmVyIHZlcnRpY2FsXG4gIC8vIG9mZnNldCBiZXR3ZWVuIGVkaXQgYW5kIHJlYWRpbmcgY29udGVudCBhcmVhcy5cbiAgY29uc3QgdG9wQ2hhaW4gPSAoKCkgPT4ge1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGNvbnN0IHBhcnRzOiB7IGNsczogc3RyaW5nOyBwYWRUb3A6IHN0cmluZzsgbWFyVG9wOiBzdHJpbmcgfVtdID0gW107XG4gICAgbGV0IG5vZGU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGFuY2hvcjtcbiAgICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBjb250ZW50RWwgJiYgbm9kZSAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgY29uc3QgY3MgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIGNsczogbm9kZS5jbGFzc05hbWUgfHwgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIHBhZFRvcDogY3MucGFkZGluZ1RvcCxcbiAgICAgICAgbWFyVG9wOiBjcy5tYXJnaW5Ub3AsXG4gICAgICB9KTtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBwYXJ0cztcbiAgfSkoKTtcblxuICAvLyBUaXRsZSBwcm9iZTogdGhlIGdlbmVyYXRlZCA6OmJlZm9yZSBpbiBTbGlkZXMgbW9kZSAod2hlbiBhIHRpdGxlIGlzXG4gIC8vIGNvbmZpZ3VyZWQpLiBDYXB0dXJlcyBpdHMgY29tcHV0ZWQgc3R5bGUgc28gd2UgY2FuIGRpZmYgaXQgYWdhaW5zdCB0aGVcbiAgLy8gYm9keSBIMSAoLmNtLWhlYWRlci0xKSBhbmQgYWxpZ24gdGhlbSBleGFjdGx5LlxuICBjb25zdCB0aXRsZUJlZm9yZSA9ICgoKSA9PiB7XG4gICAgaWYgKCFpc0VkaXQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgY29udGVudCA9IGNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIi5jbS1jb250ZW50XCIpO1xuICAgIGlmICghY29udGVudCB8fCAhY29udGVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNsaWRlcy10aXRsZVwiKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoY29udGVudCwgXCI6OmJlZm9yZVwiKTtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDogY3MuY29udGVudCxcbiAgICAgIGRpc3BsYXk6IGNzLmRpc3BsYXksXG4gICAgICBwb3NpdGlvbjogY3MucG9zaXRpb24sXG4gICAgICB0b3A6IGNzLnRvcCxcbiAgICAgIGxlZnQ6IGNzLmxlZnQsXG4gICAgICBwYWRkaW5nVG9wOiBjcy5wYWRkaW5nVG9wLFxuICAgICAgZm9udEZhbWlseTogY3MuZm9udEZhbWlseSxcbiAgICAgIGZvbnRTaXplOiBjcy5mb250U2l6ZSxcbiAgICAgIGxpbmVIZWlnaHQ6IGNzLmxpbmVIZWlnaHQsXG4gICAgICBmb250V2VpZ2h0OiBjcy5mb250V2VpZ2h0LFxuICAgICAgZm9udFZhcmlhbnQ6IGNzLmZvbnRWYXJpYW50LFxuICAgICAgY29sb3I6IGNzLmNvbG9yLFxuICAgICAgbGV0dGVyU3BhY2luZzogY3MubGV0dGVyU3BhY2luZyxcbiAgICAgIHRleHRUcmFuc2Zvcm06IGNzLnRleHRUcmFuc2Zvcm0sXG4gICAgICB3b3JkU3BhY2luZzogY3Mud29yZFNwYWNpbmcsXG4gICAgICBmb250S2VybmluZzogY3MuZm9udEtlcm5pbmcsXG4gICAgICBmb250RmVhdHVyZVNldHRpbmdzOiBjcy5mb250RmVhdHVyZVNldHRpbmdzLFxuICAgICAgZm9udFZhcmlhbnROdW1lcmljOiBjcy5mb250VmFyaWFudE51bWVyaWMsXG4gICAgICBmb250VmFyaWFudExpZ2F0dXJlczogY3MuZm9udFZhcmlhbnRMaWdhdHVyZXMsXG4gICAgICBmb250VmFyaWFudENhcHM6IGNzLmZvbnRWYXJpYW50Q2FwcyxcbiAgICB9O1xuICB9KSgpO1xuXG4gIGNvbnN0IGR1bXAgPSB7XG4gICAgbW9kZTogaXNFZGl0ID8gXCJlZGl0IChMaXZlIFByZXZpZXcpXCIgOiBcInJlYWRpbmdcIixcbiAgICAvLyBTbGlkZXMgc3R5bGluZyBvbmx5IGFwcGxpZXMgd2hlbiBTbGlkZXMgbW9kZSBpcyBvblxuICAgIHNsaWRlc0FjdGl2ZTogZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIiksXG4gICAgZG9tVGFnczogaXNFZGl0ID8gZG9tVGFncyA6IHVuZGVmaW5lZCxcbiAgICBzb3VyY2VWaWV3Q2xhc3M6IGlzRWRpdCA/IHNvdXJjZVZpZXdDbGFzcyA6IHVuZGVmaW5lZCxcbiAgICBsaXZlUHJldmlldzogaXNFZGl0ID8gaXNMaXZlUHJldmlldyhhcHApIDogdW5kZWZpbmVkLFxuICAgIGxpc3RMaW5lczogaXNFZGl0ID8gbGlzdExpbmVzIDogdW5kZWZpbmVkLFxuICAgIG1ldGFkYXRhQ29udGFpbmVyRGlzcGxheTogbWV0YWRhdGFEaXNwbGF5LFxuICAgIGgxT2Zmc2V0VG9wOiBoMU9mZnNldFRvcCxcbiAgICBoMVRvcEluQ29udGVudDogaDFUb3BJbkNvbnRlbnQsXG4gICAgaDFMZWZ0SW5Db250ZW50OiBoMUxlZnRJbkNvbnRlbnQsXG4gICAgY29udGVudENoaWxkcmVuOiBjb250ZW50Q2hpbGRyZW4sXG4gICAgdG9wQ2hhaW46IHRvcENoYWluLFxuICAgIHRpdGxlOiB0aXRsZUJlZm9yZSxcbiAgICBjb250YWluZXI6IHN0eWxlKGNvbnRhaW5lciwgW1xuICAgICAgXCJmb250LWZhbWlseVwiLFxuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwibWF4LXdpZHRoXCIsXG4gICAgICBcIndpZHRoXCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcImNvbG9yXCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBwYXJhZ3JhcGg6IHN0eWxlKHBhcmEsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJtYXJnaW4tbGVmdFwiLFxuICAgICAgXCJtYXJnaW4tcmlnaHRcIixcbiAgICAgIFwidGV4dC1pbmRlbnRcIixcbiAgICAgIFwidGV4dC1hbGlnblwiLFxuICAgIF0pLFxuICAgIGgxOiBzdHlsZShoMSwgW1xuICAgICAgXCJmb250LWZhbWlseVwiLFxuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwibGluZS1oZWlnaHRcIixcbiAgICAgIFwiZm9udC13ZWlnaHRcIixcbiAgICAgIFwiZm9udC12YXJpYW50XCIsXG4gICAgICBcImNvbG9yXCIsXG4gICAgICBcImxldHRlci1zcGFjaW5nXCIsXG4gICAgICBcInRleHQtdHJhbnNmb3JtXCIsXG4gICAgICBcIndvcmQtc3BhY2luZ1wiLFxuICAgICAgXCJmb250LWtlcm5pbmdcIixcbiAgICAgIFwiZm9udC1mZWF0dXJlLXNldHRpbmdzXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1udW1lcmljXCIsXG4gICAgICBcImZvbnQtdmFyaWFudC1saWdhdHVyZXNcIixcbiAgICAgIFwiZm9udC12YXJpYW50LWNhcHNcIixcbiAgICAgIFwibWFyZ2luLXRvcFwiLFxuICAgICAgXCJtYXJnaW4tYm90dG9tXCIsXG4gICAgICBcInRleHQtYWxpZ25cIixcbiAgICBdKSxcbiAgICBsaXN0SXRlbTogc3R5bGUobGlzdEl0ZW0sIFtcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi1yaWdodFwiLFxuICAgICAgXCJ0ZXh0LWluZGVudFwiLFxuICAgICAgXCJsaW5lLWhlaWdodFwiLFxuICAgICAgXCJ0ZXh0LWFsaWduXCIsXG4gICAgXSksXG4gICAgY29kZUJsb2NrOiBzdHlsZShwcmUsIFtcbiAgICAgIFwiZm9udC1zaXplXCIsXG4gICAgICBcImxpbmUtaGVpZ2h0XCIsXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcImJhY2tncm91bmQtY29sb3JcIixcbiAgICAgIFwiYm9yZGVyLXJhZGl1c1wiLFxuICAgIF0pLFxuICAgIGJsb2NrcXVvdGU6IHN0eWxlKHF1b3RlLCBbXG4gICAgICBcInBhZGRpbmctdG9wXCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcIm1hcmdpbi10b3BcIixcbiAgICAgIFwibWFyZ2luLWJvdHRvbVwiLFxuICAgICAgXCJib3JkZXItbGVmdC13aWR0aFwiLFxuICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCIsXG4gICAgXSksXG4gICAgaW5saW5lQ29kZTogc3R5bGUoaW5saW5lQ29kZSwgW1xuICAgICAgXCJmb250LXNpemVcIixcbiAgICAgIFwicGFkZGluZy10b3BcIixcbiAgICAgIFwicGFkZGluZy1ib3R0b21cIixcbiAgICAgIFwicGFkZGluZy1sZWZ0XCIsXG4gICAgICBcInBhZGRpbmctcmlnaHRcIixcbiAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiLFxuICAgICAgXCJib3JkZXItcmFkaXVzXCIsXG4gICAgXSksXG4gICAgdGFibGU6IHN0eWxlKHRhYmxlLCBbXCJmb250LXNpemVcIiwgXCJsaW5lLWhlaWdodFwiLCBcIndpZHRoXCIsIFwiYm9yZGVyLWNvbGxhcHNlXCJdKSxcbiAgICBpbWFnZTogc3R5bGUoaW1nLCBbXCJkaXNwbGF5XCIsIFwibWFyZ2luLWxlZnRcIiwgXCJtYXJnaW4tcmlnaHRcIiwgXCJtYXgtd2lkdGhcIiwgXCJ3aWR0aFwiXSksXG4gICAgaG9yaXpvbnRhbFJ1bGU6IHN0eWxlKGhyLCBbXCJtYXJnaW4tdG9wXCIsIFwibWFyZ2luLWJvdHRvbVwiLCBcImJvcmRlci10b3Atd2lkdGhcIiwgXCJoZWlnaHRcIl0pLFxuICAgIGNzc1ZhcmlhYmxlczoge1xuICAgICAgXCItLWZvbnQtdGV4dFwiOiBjc3NWYXIoXCItLWZvbnQtdGV4dFwiKSxcbiAgICAgIFwiLS1saW5lLWhlaWdodC1ub3JtYWxcIjogY3NzVmFyKFwiLS1saW5lLWhlaWdodC1ub3JtYWxcIiksXG4gICAgICBcIi0taDEtc2l6ZVwiOiBjc3NWYXIoXCItLWgxLXNpemVcIiksXG4gICAgICBcIi0taDEtbGluZS1oZWlnaHRcIjogY3NzVmFyKFwiLS1oMS1saW5lLWhlaWdodFwiKSxcbiAgICAgIFwiLS1oMS13ZWlnaHRcIjogY3NzVmFyKFwiLS1oMS13ZWlnaHRcIiksXG4gICAgICBcIi0taDEtdmFyaWFudFwiOiBjc3NWYXIoXCItLWgxLXZhcmlhbnRcIiksXG4gICAgICBcIi0taDEtY29sb3JcIjogY3NzVmFyKFwiLS1oMS1jb2xvclwiKSxcbiAgICAgIFwiLS1oMS1tYXJnaW4tdG9wXCI6IGNzc1ZhcihcIi0taDEtbWFyZ2luLXRvcFwiKSxcbiAgICAgIFwiLS1oMS1tYXJnaW4tYm90dG9tXCI6IGNzc1ZhcihcIi0taDEtbWFyZ2luLWJvdHRvbVwiKSxcbiAgICAgIFwiLS1wLXNwYWNpbmdcIjogY3NzVmFyKFwiLS1wLXNwYWNpbmdcIiksXG4gICAgICBcIi0tbGlzdC1zcGFjaW5nXCI6IGNzc1ZhcihcIi0tbGlzdC1zcGFjaW5nXCIpLFxuICAgICAgXCItLWxpc3QtaW5kZW50XCI6IGNzc1ZhcihcIi0tbGlzdC1pbmRlbnRcIiksXG4gICAgICBcIi0tY29kZS1zaXplXCI6IGNzc1ZhcihcIi0tY29kZS1zaXplXCIpLFxuICAgICAgXCItLWNvZGUtcGFkZGluZ1wiOiBjc3NWYXIoXCItLWNvZGUtcGFkZGluZ1wiKSxcbiAgICAgIFwiLS1jb2RlLXJhZGl1c1wiOiBjc3NWYXIoXCItLWNvZGUtcmFkaXVzXCIpLFxuICAgICAgXCItLWJsb2NrcXVvdGUtcGFkZGluZ1wiOiBjc3NWYXIoXCItLWJsb2NrcXVvdGUtcGFkZGluZ1wiKSxcbiAgICAgIFwiLS1ibG9ja3F1b3RlLWJvcmRlci10aGlja25lc3NcIjogY3NzVmFyKFwiLS1ibG9ja3F1b3RlLWJvcmRlci10aGlja25lc3NcIiksXG4gICAgICBcIi0tZmlsZS1tYXJnaW5zXCI6IGNzc1ZhcihcIi0tZmlsZS1tYXJnaW5zXCIpLFxuICAgICAgXCItLWZpbGUtbGluZS13aWR0aFwiOiBjc3NWYXIoXCItLWZpbGUtbGluZS13aWR0aFwiKSxcbiAgICAgIFwiLS1ub3JtYWwtZm9udC1zaXplXCI6IGNzc1ZhcihcIi0tbm9ybWFsLWZvbnQtc2l6ZVwiKSxcbiAgICAgIFwiLS1mb250LXRleHQtc2l6ZVwiOiBjc3NWYXIoXCItLWZvbnQtdGV4dC1zaXplXCIpLFxuICAgIH0sXG4gIH07XG4gIHJldHVybiBkdW1wO1xufVxuXG4vKipcbiAqIERlYnVnIHR5cG9ncmFwaHk6IHNhbXBsZXMgdGhlIGZpeGVkIG9uZS1wYWdlIHNhbXBsZSBub3RlcyAoZWFjaFxuICogY292ZXJpbmcgYSBncm91cCBvZiBlbGVtZW50cyBcdTIwMTQgYWxsIHZpc2libGUgd2l0aG91dCBzY3JvbGxpbmcpLFxuICogdGhlbiB0aGUga2l0Y2hlbi1zaW5rIG5vdGUgaW4gcmVhZGluZyB2aWV3IChubyB2aXJ0dWFsaXphdGlvblxuICogdGhlcmUpLCBtZXJnZXMgZXZlcnl0aGluZywgY29tcHV0ZXMgdGhlIGVkaXQtdnMtcmVhZGluZyBkaWZmIGFuZFxuICogd3JpdGVzIGl0IHRvIC5uYXRpdmUtc2xpZGVzLWRlYnVnLmpzb24gaW4gdGhlIHZhdWx0IHJvb3QuXG4gKiBUaGUgdXNlcidzIG93biBub3RlIGlzIHJlc3RvcmVkIGF0IHRoZSBlbmQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkdW1wVHlwb2dyYXBoeShwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBhcHAgPSBwbHVnaW4uYXBwO1xuICBpZiAoIWRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwibmF0aXZlLXNsaWRlcy1tb2RlXCIpKSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IGVudGVyIFNsaWRlcyBtb2RlIGZpcnN0IChNb2QrU2hpZnQrRSBvbiBhIGRlY2sgbm90ZSlcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHZpZXcgPSBhcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgaWYgKCF2aWV3KSB7XG4gICAgbmV3IE5vdGljZShcIk5hdGl2ZSBzbGlkZXM6IG5vIGFjdGl2ZSBNYXJrZG93biBub3RlXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBzdGFydE1vZGUgPSB2aWV3LmdldE1vZGUoKTtcbiAgY29uc3QgYWN0aXZlRmlsZSA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICBjb25zdCBsZWFmID0gYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcblxuICAvLyBFZGl0IHNpZGU6IGVhY2ggc2hvcnQgbm90ZSBrZWVwcyBldmVyeSB0YXJnZXQgZWxlbWVudCBvbiBzY3JlZW5cbiAgY29uc3QgZWRpdDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFNBTVBMRV9OT1RFX05BTUVTKSB7XG4gICAgY29uc3QgZiA9IGFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoYHRlc3RzLyR7bmFtZX0ubWRgKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSBjb250aW51ZTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGYsIHsgc3RhdGU6IHsgbW9kZTogXCJzb3VyY2VcIiB9IH0pO1xuICAgIGF3YWl0IHNsZWVwKDUwMCk7XG4gICAgY29uc3QgcyA9IHNhbXBsZVN0eWxlcyhhcHApO1xuICAgIGlmIChzKSBtZXJnZVNhbXBsZShlZGl0LCBzKTtcbiAgfVxuXG4gIC8vIFJlYWRpbmcgc2lkZTogdGhlIGtpdGNoZW4tc2luayBub3RlIHJlbmRlcnMgZXZlcnl0aGluZyBhdCBvbmNlXG4gIGxldCByZWFkaW5nOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPSBudWxsO1xuICBjb25zdCBkZW1vID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChcInRlc3RzL3R5cG9ncmFwaHktZGVtby5tZFwiKTtcbiAgaWYgKGRlbW8gaW5zdGFuY2VvZiBURmlsZSkge1xuICAgIGF3YWl0IGxlYWYub3BlbkZpbGUoZGVtbywgeyBzdGF0ZTogeyBtb2RlOiBcInByZXZpZXdcIiB9IH0pO1xuICAgIGF3YWl0IHNsZWVwKDgwMCk7XG4gICAgcmVhZGluZyA9IHNhbXBsZVN0eWxlcyhhcHApO1xuICB9XG5cbiAgLy8gUmVzdG9yZSB0aGUgdXNlcidzIG5vdGVcbiAgaWYgKGFjdGl2ZUZpbGUpIHtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKGFjdGl2ZUZpbGUsIHsgc3RhdGU6IHsgbW9kZTogc3RhcnRNb2RlIH0gfSk7XG4gICAgcGx1Z2luLnJlZnJlc2goKTtcbiAgfVxuICBpZiAoIXJlYWRpbmcpIHtcbiAgICBuZXcgTm90aWNlKFwiTmF0aXZlIHNsaWRlczogcmVhZGluZyBzYW1wbGUgZmFpbGVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBheWxvYWQgPSB7IGVkaXQsIHJlYWRpbmcsIGRpZmY6IGRpZmZEdW1wcyhlZGl0LCByZWFkaW5nKSB9O1xuICB0cnkge1xuICAgIGF3YWl0IGFwcC52YXVsdC5hZGFwdGVyLndyaXRlKFwiLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvblwiLCBKU09OLnN0cmluZ2lmeShwYXlsb2FkLCBudWxsLCAyKSk7XG4gICAgbmV3IE5vdGljZShcIlR5cG9ncmFwaHkgZHVtcCBcdTIxOTIgLm5hdGl2ZS1zbGlkZXMtZGVidWcuanNvbiAodmF1bHQgcm9vdClcIik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbmV3IE5vdGljZShgTmF0aXZlIHNsaWRlczogY291bGQgbm90IHdyaXRlIGRlYnVnIGZpbGUgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gIH1cbn1cblxuLyoqIFJlZ2lzdGVyIHRoZSBkZXYtb25seSBkZWJ1ZyBjb21tYW5kIChjYWxsZWQgb25seSB3aGVuIERFVl9NT0RFIGlzIHRydWUpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRGVidWdDb21tYW5kKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1kZWJ1Zy1zdHlsZXNcIixcbiAgICBuYW1lOiBcIkRlYnVnOiBkdW1wIHR5cG9ncmFwaHkgc3R5bGVzXCIsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgZHVtcFR5cG9ncmFwaHkocGx1Z2luKSxcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbi8qKiBNb2RlIG9mIHRoZSBhY3RpdmUgTWFya2Rvd24gdmlldzogJ3ByZXZpZXcnPXJlYWRpbmcgJ3NvdXJjZSc9ZWRpdGluZyAnJz1ub25lICovXG5leHBvcnQgZnVuY3Rpb24gY3VycmVudE1vZGUoYXBwOiBBcHApOiBcInByZXZpZXdcIiB8IFwic291cmNlXCIgfCBcIlwiIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICByZXR1cm4gdmlldyA/IHZpZXcuZ2V0TW9kZSgpIDogXCJcIjtcbn1cblxuLyoqXG4gKiBUcnVlIHdoZW4gdGhlIGFjdGl2ZSBlZGl0IHZpZXcgaXMgTGl2ZSBQcmV2aWV3IChTbGlkZXMpIFx1MjAxNCBhc1xuICogb3Bwb3NlZCB0byBTb3VyY2UgbW9kZS4gT2JzaWRpYW4gcmVwb3J0cyBib3RoIGFzIG1vZGUgXCJzb3VyY2VcIjtcbiAqIHRoZSB2aWV3IHN0YXRlIGNhcnJpZXMgYSBgc291cmNlYCBmbGFnIChTb3VyY2UgbW9kZSA9IHRydWUpLCB3aXRoXG4gKiBhIERPTSBjbGFzcyBmYWxsYmFjayAoLmlzLWxpdmUtcHJldmlldykgZm9yIHNhZmV0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTGl2ZVByZXZpZXcoYXBwOiBBcHApOiBib29sZWFuIHtcbiAgY29uc3QgdmlldyA9IGFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICBpZiAoIXZpZXcgfHwgdmlldy5nZXRNb2RlKCkgIT09IFwic291cmNlXCIpIHJldHVybiBmYWxzZTtcbiAgY29uc3Qgc3RhdGUgPSB2aWV3LmdldFN0YXRlKCkgYXMgeyBzb3VyY2U/OiBib29sZWFuIH07XG4gIGlmIChzdGF0ZS5zb3VyY2UgPT09IHRydWUpIHJldHVybiBmYWxzZTtcbiAgaWYgKHN0YXRlLnNvdXJjZSA9PT0gZmFsc2UpIHJldHVybiB0cnVlO1xuICByZXR1cm4gISF2aWV3LmNvbnRlbnRFbC5xdWVyeVNlbGVjdG9yKFwiLm1hcmtkb3duLXNvdXJjZS12aWV3Lm1vZC1jbTYuaXMtbGl2ZS1wcmV2aWV3XCIpO1xufVxuXG4vKiogRnJvbnRtYXR0ZXIgb2YgYW55IG5vdGUgYXMgYW4gb2JqZWN0LCBvciBudWxsIHdoZW4gYWJzZW50ICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbnRtYXR0ZXJPZihhcHA6IEFwcCwgZmlsZTogVEZpbGUpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCBjYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcbiAgcmV0dXJuIGNhY2hlPy5mcm9udG1hdHRlciA/PyBudWxsO1xufVxuXG4vKiogQ3VycmVudCBub3RlJ3MgZnJvbnRtYXR0ZXIgYXMgYW4gb2JqZWN0LCBvciBudWxsIHdoZW4gYWJzZW50ICovXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZlRnJvbnRtYXR0ZXIoYXBwOiBBcHApOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICBjb25zdCBmaWxlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gIHJldHVybiBmaWxlID8gZnJvbnRtYXR0ZXJPZihhcHAsIGZpbGUpIDogbnVsbDtcbn1cbiIsICIvKiogQSBidWlsdC1pbiBTbGlkZXMgc3R5bGUgdGVtcGxhdGUgKHJlbmRlcmVkIGFzIGJvZHkgY2xhc3MgYG5hdGl2ZS1zbGlkZXMtdGhlbWUtPGlkPmApICovXG5leHBvcnQgaW50ZXJmYWNlIFNsaWRlc1RoZW1lIHtcbiAgaWQ6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuLyoqIEJ1aWx0LWluIHN0eWxlIHRlbXBsYXRlcyBmb3IgdGhlIFNsaWRlcyBjYXJkICsgYmFyIChhbGwgdGhlbWUtYWRhcHRpdmUpICovXG5leHBvcnQgY29uc3QgU0xJREVTX1RIRU1FUzogcmVhZG9ubHkgU2xpZGVzVGhlbWVbXSA9IFtcbiAgeyBpZDogXCJqeXlcIiwgbGFiZWw6IFwiTGVjdHVyZSAoanl5KVwiIH0sXG4gIHsgaWQ6IFwiZGFzaGVkXCIsIGxhYmVsOiBcIkRhc2hlZCBvdXRsaW5lXCIgfSxcbiAgeyBpZDogXCJwYXBlclwiLCBsYWJlbDogXCJQYXBlciBjYXJkXCIgfSxcbiAgeyBpZDogXCJtaW5pbWFsXCIsIGxhYmVsOiBcIk1pbmltYWxcIiB9LFxuICB7IGlkOiBcImFjY2VudFwiLCBsYWJlbDogXCJBY2NlbnQgZWRnZVwiIH0sXG4gIHsgaWQ6IFwiZ2xhc3NcIiwgbGFiZWw6IFwiRnJvc3RlZCBnbGFzc1wiIH0sXG5dO1xuXG4vKiogUGx1Z2luIHNldHRpbmdzICovXG5leHBvcnQgaW50ZXJmYWNlIE5hdGl2ZVNsaWRlc1NldHRpbmdzIHtcbiAgLyoqIFNob3cgXHUyNUMwIFx1MjVCNiBwcmV2aW91cy9uZXh0IGJ1dHRvbnMgb24gdGhlIGxlZnQgb2YgdGhlIHNsaWRlcyBiYXIgKi9cbiAgc2hvd05hdkJ1dHRvbnM6IGJvb2xlYW47XG4gIC8qKiBQYWdlIG51bWJlciBkaXNwbGF5IHN0eWxlOiBcImZyYWN0aW9uXCIgPSBOIC8gVG90YWwsIFwiY3VycmVudFwiID0gTiwgXCJub25lXCIgPSBoaWRkZW4gKi9cbiAgcGFnZU51bWJlclN0eWxlOiBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAvKiogU2hvdyBhIHRoaW4gY2xpY2thYmxlIHByb2dyZXNzIGxpbmUgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAqL1xuICBzaG93UHJvZ3Jlc3M6IGJvb2xlYW47XG4gIC8qKiBTaG93IHRoZSBlbnRpcmUgc2xpZGVzIGJhciAobWFzdGVyIHRvZ2dsZSkgKi9cbiAgc2hvd1NsaWRlc0JhcjogYm9vbGVhbjtcbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgbWFudWFsbHkgaGlkIHRoZSBzbGlkZXMgYmFyICh0b2dnbGUgY29tbWFuZCkgKi9cbiAgYmFySGlkZGVuOiBib29sZWFuO1xuICAvKiogQXV0by1lbnRlciBTbGlkZXMgbW9kZSB3aGVuIG9wZW5pbmcgYSBkZWNrIG5vdGUgKGRlZmF1bHQgb2ZmKSAqL1xuICBhdXRvRW50ZXJTbGlkZXM6IGJvb2xlYW47XG4gIC8qKiBQcmVzcyBFc2NhcGUgdG8gZXhpdCBTbGlkZXMgbW9kZSAoZGVmYXVsdCBvbikgKi9cbiAgZXNjRXhpdHNTbGlkZXM6IGJvb2xlYW47XG4gIC8qKiBGcm9udG1hdHRlciBwcm9wZXJ0eSBzaG93biBhcyB0aGUgY2FyZCB0aXRsZSAoXCJcIiA9IG5vbmUsIFwiZmlsZW5hbWVcIiA9IGZpbGUgbmFtZSkgKi9cbiAgc2xpZGVzVGl0bGU6IHN0cmluZztcbiAgLyoqIFN0eWxlIHRlbXBsYXRlIGlkIGZyb20gU0xJREVTX1RIRU1FUyAoY2FyZCArIGJhciBhcHBlYXJhbmNlKSAqL1xuICBzbGlkZXNUaGVtZTogc3RyaW5nO1xuICAvKiogQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIGZvciB0aGUgc2xpZGVzIGJhciAoZW1wdHkgPSBub25lKSAqL1xuICBiYXJQcm9wZXJ0aWVzOiBzdHJpbmc7XG4gIC8qKiBKU09OIGFycmF5IG9mIGNvbHVtbiB3aWR0aCBwZXJjZW50YWdlcyBmb3IgYmFyIHByb3BlcnRpZXMgKGRyYWdnYWJsZSBkaXZpZGVycykgKi9cbiAgYmFyUHJvcGVydHlXaWR0aHM6IHN0cmluZztcbiAgLyoqIEFzayBmb3IgY29uZmlybWF0aW9uIGJlZm9yZSBkZWxldGluZyBzbGlkZXMgZnJvbSB0aGUgcGFuZWwgKGRlZmF1bHQgb24pICovXG4gIGNvbmZpcm1EZWxldGVTbGlkZXM6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBCbG9jayBpbWFnZSBlbWJlZHMgYXMgY2VudGVyZWQgY2FyZCBibG9ja3MgKGRlZmF1bHQgb24pLiBXaGVuIG9mZixcbiAgICogaW1hZ2VzIGtlZXAgT2JzaWRpYW4ncyBuYXRpdmUgaW5saW5lIGZsb3cgXHUyMDE0IHRleHQgZmxvd3MgYXJvdW5kL2Jlc2lkZVxuICAgKiB0aGVtIGV4YWN0bHkgbGlrZSBMaXZlIFByZXZpZXcgb3V0c2lkZSBTbGlkZXMgbW9kZS5cbiAgICovXG4gIGltYWdlTGF5b3V0OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogTmF0aXZlU2xpZGVzU2V0dGluZ3MgPSB7XG4gIHNob3dOYXZCdXR0b25zOiB0cnVlLFxuICBwYWdlTnVtYmVyU3R5bGU6IFwibm9uZVwiLFxuICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gIHNob3dTbGlkZXNCYXI6IHRydWUsXG4gIGJhckhpZGRlbjogZmFsc2UsXG4gIGF1dG9FbnRlclNsaWRlczogZmFsc2UsXG4gIGVzY0V4aXRzU2xpZGVzOiB0cnVlLFxuICBzbGlkZXNUaXRsZTogXCJcIixcbiAgc2xpZGVzVGhlbWU6IFwianl5XCIsXG4gIGJhclByb3BlcnRpZXM6IFwiXCIsXG4gIGJhclByb3BlcnR5V2lkdGhzOiBcIlwiLFxuICBjb25maXJtRGVsZXRlU2xpZGVzOiB0cnVlLFxuICBpbWFnZUxheW91dDogdHJ1ZSxcbn07XG5cbi8qKiBSZXNlcnZlZCBmcm9udG1hdHRlciBrZXkgZHJpdmluZyBkZWNrIG5hdmlnYXRpb24gKG5ldmVyIHJlbmRlcmVkIGFzIGEgY2hpcCkgKi9cbmV4cG9ydCBjb25zdCBERUNLX0tFWSA9IFwiZGVja1wiO1xuIiwgImltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgY29weUNhcGFjaXR5UHJvbXB0IH0gZnJvbSBcIi4vY2FwYWNpdHlcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRGVidWdDb21tYW5kIH0gZnJvbSBcIi4vZGVidWdcIjtcbmltcG9ydCB7IGZyb250bWF0dGVyT2YgfSBmcm9tIFwiLi9tb2RlXCI7XG5pbXBvcnQgeyBERUNLX0tFWSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSZWdpc3RlciBldmVyeSBjb21tYW5kOyB0aGUgZGVidWcgY29tbWFuZCBpcyBkZXYtYnVpbGQgb25seS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbW1hbmRzKHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKTogdm9pZCB7XG4gIC8vIFRvZ2dsZSB0aGUgc2xpZGVzIGJhciAod2l0aGluIFNsaWRlcyBtb2RlKVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLWJhclwiLFxuICAgIG5hbWU6IFwiVG9nZ2xlIHNsaWRlcyBiYXJcIixcbiAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgcGx1Z2luLnNldHRpbmdzLmJhckhpZGRlbiA9ICFwbHVnaW4uc2V0dGluZ3MuYmFySGlkZGVuO1xuICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgcGx1Z2luLnJlZnJlc2goKTtcbiAgICB9LFxuICB9KTtcbiAgLy8gU2hvdyB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwgKGRlY2sgc2xpZGUgbGlzdClcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXNob3ctcGFuZWxcIixcbiAgICBuYW1lOiBcIlNob3cgc2xpZGVzIHBhbmVsXCIsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgcGx1Z2luLmFjdGl2YXRlU2xpZGVzUGFuZWwoKSxcbiAgfSk7XG4gIC8vIEhpZGUgLyBzaG93IHRoZSBtb3VzZSBwb2ludGVyIHdpbmRvdy13aWRlIChwcmVzZW50aW5nOyBTbGlkZXMgbW9kZSBvbmx5KVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtdG9nZ2xlLXBvaW50ZXJcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBtb3VzZSBwb2ludGVyXCIsXG4gICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSwga2V5OiBcIk1cIiB9XSxcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVQb2ludGVyKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gUHJldmlvdXMgLyBuZXh0IHBhZ2UgKGRlY2sgbmF2aWdhdGlvbjsgZW50ZXJpbmcgU2xpZGVzIG1vZGUgYXMgbmVlZGVkKVxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtcHJldlwiLFxuICAgIG5hbWU6IFwiUHJldmlvdXMgcGFnZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJBcnJvd0xlZnRcIiB9XSxcbiAgICBjYWxsYmFjazogKCkgPT4gcGx1Z2luLm5hdmlnYXRlKFwicHJldlwiKSxcbiAgfSk7XG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1uZXh0XCIsXG4gICAgbmFtZTogXCJOZXh0IHBhZ2VcIixcbiAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLCBrZXk6IFwiQXJyb3dSaWdodFwiIH1dLFxuICAgIGNhbGxiYWNrOiAoKSA9PiBwbHVnaW4ubmF2aWdhdGUoXCJuZXh0XCIpLFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5leHQgU2xpZGUgXHUyMDE0IG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBvbmUgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLWNyZWF0ZS1uZXh0XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV4dCBzbGlkZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJOXCIgfV0sXG4gICAgLy8gR3JleWVkIG91dCB1bmxlc3MgdGhlIGFjdGl2ZSBub3RlIGlzIHBhcnQgb2YgYSBkZWNrIFx1MjAxNCBwbGFpbiBub3Rlc1xuICAgIC8vIHN0YXJ0IGRlY2tzIHdpdGggXCJDcmVhdGUgbmV3IHNsaWRlXCIgaW5zdGVhZC5cbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBwbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgICBpZiAoIWZpbGUgfHwgIXBsdWdpbi5kZWNrU2VydmljZS5pc01lbWJlcihmaWxlKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgcGxhbiA9IHBsdWdpbi5kZWNrU2VydmljZS5wbGFuQ3JlYXRlTmV4dChmaWxlKTtcbiAgICAgIGlmICghcGxhbikgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKCFjaGVja2luZykgdm9pZCBwbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZmlsZSwgcGxhbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcbiAgLy8gQ3JlYXRlIE5ldyBTbGlkZSBcdTIwMTQgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgKG5vbi1kZWNrIG5vdGVzIG9ubHk7XG4gIC8vIGFsc28gd29ya3MgZnJvbSBhIGJsYW5rIHRhYiBcdTIwMTQgbGFuZHMgaW4gdGhlIGRlZmF1bHQgbmV3LW5vdGUgbG9jYXRpb24pXG4gIHBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICBpZDogXCJucy1jcmVhdGUtbmV3XCIsXG4gICAgbmFtZTogXCJDcmVhdGUgbmV3IHNsaWRlXCIsXG4gICAgLy8gTm8gZGVmYXVsdCBob3RrZXk6IE1vZCtTaGlmdCtOIGJlbG9uZ3MgdG8gQ3JlYXRlIG5leHQgc2xpZGUgXHUyMDE0IHR3b1xuICAgIC8vIGNvbW1hbmRzIHNoYXJpbmcgb25lIGRlZmF1bHQgaG90a2V5IHRyaXBzIE9ic2lkaWFuJ3MgY29uZmxpY3QgVUkuXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWQgcGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVDcmVhdGVOZXcocGx1Z2luLmRlY2tTZXJ2aWNlLnBsYW5DcmVhdGVOZXcoKSksXG4gIH0pO1xuICAvLyBDb3B5IGEgb25lLXNjcmVlbiBjYXBhY2l0eSByZXBvcnQgb2YgdGhlIGN1cnJlbnQgU2xpZGVzIGxheW91dFxuICBwbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgaWQ6IFwibnMtY29weS1zbGlkZS1za2lsbFwiLFxuICAgIG5hbWU6IFwiQ29weSBzbGlkZSBsYXlvdXQgaW5mbyBmb3IgQUkgYWdlbnRcIixcbiAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmcpID0+IHtcbiAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYXRpdmUtc2xpZGVzLW1vZGVcIikpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHZvaWQgY29weUNhcGFjaXR5UHJvbXB0KHBsdWdpbi5hcHApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfSk7XG4gIC8vIFRvZ2dsZSBTbGlkZXMgbW9kZSBcdTIwMTQgdGhlIGltbWVyc2l2ZSBjYXJkIHZpZXcgKGRlY2sgbm90ZXMgb25seSlcbiAgcGx1Z2luLmFkZENvbW1hbmQoe1xuICAgIGlkOiBcIm5zLXRvZ2dsZS1zbGlkZXNcIixcbiAgICBuYW1lOiBcIlRvZ2dsZSBzbGlkZXMgbW9kZVwiLFxuICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sIGtleTogXCJFXCIgfV0sXG4gICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nKSA9PiB7XG4gICAgICBjb25zdCBmaWxlID0gcGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2U7XG4gICAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YocGx1Z2luLmFwcCwgZmlsZSk7XG4gICAgICBpZiAoZm0gPT09IG51bGwgfHwgIShERUNLX0tFWSBpbiBmbSkpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICghY2hlY2tpbmcpIHBsdWdpbi50b2dnbGVTbGlkZXMoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuICAvLyBEZWJ1ZyB0b29saW5nIFx1MjAxNCByZWdpc3RlcmVkIG9ubHkgaW4gZGV2IGJ1aWxkcyAodHJlZS1zaGFrZW4gaW4gcmVsZWFzZSlcbiAgaWYgKERFVl9NT0RFKSByZWdpc3RlckRlYnVnQ29tbWFuZChwbHVnaW4pO1xufVxuIiwgImltcG9ydCB7IEFwcCwgTm90aWNlLCBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHtcbiAgcGxhbkNyZWF0ZU5ldyBhcyBwbGFuTmV3LFxuICBwbGFuQ3JlYXRlTmV4dCBhcyBwbGFuLFxuICB0eXBlIENyZWF0ZU5leHRSZXN1bHQsXG59IGZyb20gXCIuL2NyZWF0ZU5leHRcIjtcbmltcG9ydCB7IGNvbXB1dGVEZWNrLCBleHRyYWN0TGlua3MsIGV4dHJhY3RSYXdMaW5rcywgdHlwZSBEZWNrSW5mbyB9IGZyb20gXCIuL2RlY2tcIjtcbmltcG9ydCB7IHBpY2tMYW5kaW5nUGF0aCwgcGxhbkRlbGV0ZVNsaWRlcyB9IGZyb20gXCIuL2RlbGV0ZVNsaWRlc1wiO1xuaW1wb3J0IHsgZnJvbnRtYXR0ZXJPZiB9IGZyb20gXCIuL21vZGVcIjtcbmltcG9ydCB7IERFQ0tfS0VZIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqIFJlc3VsdCBvZiBhIERlbGV0ZSBzbGlkZXMgcnVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVNsaWRlc1Jlc3VsdCB7XG4gIC8qKiBQYXRocyBhY3R1YWxseSBtb3ZlZCB0byB0aGUgdHJhc2ggKi9cbiAgdHJhc2hlZDogc3RyaW5nW107XG4gIC8qKiBXaGVyZSB0aGUgZWRpdG9yIHNob3VsZCBsYW5kIGFmdGVyd2FyZHMgKG51bGwgPSBrZWVwIGN1cnJlbnQgbm90ZSkgKi9cbiAgbGFuZGluZ1BhdGg6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKiBEZWNrIGNoYWluIHJlc29sdXRpb24gKyBcIkNyZWF0ZSBOZXh0IFNsaWRlXCIgZ2x1ZSAod3JhcHMgdGhlIHB1cmUgY29yZSkuICovXG5leHBvcnQgY2xhc3MgRGVja1NlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwKSB7fVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrOiBpdCBob2xkcyBhIGBkZWNrYCBwcm9wZXJ0eSAoZXZlblxuICAgKiBlbXB0eSBcdTIwMTQgYSBmcmVzaCBzaW5nbGUgc2xpZGUpIG9yIHNvbWUgb3RoZXIgc2xpZGUgZGVjbGFyZXMgaXQgYXMgaXRzXG4gICAqIG5leHQgc2xpZGUuXG4gICAqL1xuICBpc01lbWJlcihmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZtID0gZnJvbnRtYXR0ZXJPZih0aGlzLmFwcCwgZmlsZSk7XG4gICAgcmV0dXJuIChmbSAhPT0gbnVsbCAmJiBERUNLX0tFWSBpbiBmbSkgfHwgdGhpcy5wcmV2T2YoZmlsZS5wYXRoKSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIFJlc29sdmUgdGhlIGN1cnJlbnQgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjayAobnVsbCB3aGVuIG5vdCBhIG1lbWJlcikgKi9cbiAgY29tcHV0ZShmaWxlOiBURmlsZSk6IERlY2tJbmZvIHwgbnVsbCB7XG4gICAgaWYgKCF0aGlzLmlzTWVtYmVyKGZpbGUpKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gY29tcHV0ZURlY2soXG4gICAgICBmaWxlLnBhdGgsXG4gICAgICAocGF0aCkgPT4gdGhpcy5saW5rUGF0aHMocGF0aCksXG4gICAgICAocGF0aCkgPT4gdGhpcy5wcmV2T2YocGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBSZXNvbHZlIHRoZSBgZGVja2AgcHJvcGVydHkgb2YgYSBub3RlIGludG8gcmVhbCBub3RlIHBhdGhzIChtYXggb25lKSAqL1xuICBwcml2YXRlIGxpbmtQYXRocyhwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoIShmIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm4gW107XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXNcbiAgICAgIC5tYXAoKG5hbWUpID0+IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QobmFtZSwgcGF0aCkpXG4gICAgICAuZmlsdGVyKCh4KTogeCBpcyBURmlsZSA9PiAhIXgpXG4gICAgICAubWFwKCh4KSA9PiB4LnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBub3RlIHdob3NlIGBkZWNrYCBwcm9wZXJ0eSBwb2ludHMgYXQgYHBhdGhgICh0aGUgcHJldmlvdXMgc2xpZGUgaW5cbiAgICogdGhlIGNoYWluKS4gV2l0aCBuZXh0LW9ubHkgc2VtYW50aWNzIHRoaXMgYmFja3dhcmQgbG9va3VwIGlzIHRoZSBvbmx5XG4gICAqIHdheSB0byByZWFjaCB0aGUgY2hhaW4gaGVhZCBmcm9tIGEgbWlkZGxlL2xhc3Qgc2xpZGUuXG4gICAqL1xuICBwcml2YXRlIHByZXZPZihwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkpIHtcbiAgICAgIGlmIChmLnBhdGggPT09IHBhdGgpIGNvbnRpbnVlO1xuICAgICAgaWYgKHRoaXMubGlua1BhdGhzKGYucGF0aClbMF0gPT09IHBhdGgpIHJldHVybiBmLnBhdGg7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogTmFtZXMgaW4gdGhlIGBkZWNrYCBwcm9wZXJ0eSB0aGF0IHJlc29sdmUgdG8gbm8gbm90ZSAoYnJva2VuIGxpbmtzKSAqL1xuICBicm9rZW4oZmlsZTogVEZpbGUpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZm0gPSBmcm9udG1hdHRlck9mKHRoaXMuYXBwLCBmaWxlKTtcbiAgICBjb25zdCBuYW1lcyA9IGZtID8gZXh0cmFjdExpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICByZXR1cm4gbmFtZXMuZmlsdGVyKChuYW1lKSA9PiAhdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChuYW1lLCBmaWxlLnBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbGFuIGEgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIHJ1biBmb3IgdGhlIGFjdGl2ZSBub3RlLiBEZWNrIHNsaWRlc1xuICAgKiBpbnNlcnQvYXBwZW5kIGFmdGVyIHRoZSBjdXJyZW50IG5vdGUuIChQbGFpbiBub3RlcyBhcmUgcm91dGVkIHRvXG4gICAqIHBsYW5DcmVhdGVOZXcgYnkgdGhlIGNvbW1hbmQgXHUyMDE0IHRoaXMgY29yZSBzdGlsbCBoYW5kbGVzIHRoZW0gYXNcbiAgICogXCJubyB1c2FibGUgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmRcIi4pXG4gICAqL1xuICBwbGFuQ3JlYXRlTmV4dChmaWxlOiBURmlsZSk6IENyZWF0ZU5leHRSZXN1bHQgfCBudWxsIHtcbiAgICBjb25zdCBmbSA9IGZyb250bWF0dGVyT2YodGhpcy5hcHAsIGZpbGUpO1xuICAgIGNvbnN0IHJhdyA9IGZtID8gZXh0cmFjdFJhd0xpbmtzKGZtW0RFQ0tfS0VZXSkgOiBbXTtcbiAgICBjb25zdCBleGlzdGluZ05hbWVzID0gbmV3IFNldCh0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCkubWFwKChmKSA9PiBmLmJhc2VuYW1lKSk7XG4gICAgcmV0dXJuIHBsYW4oeyBjdXJyZW50TmFtZTogZmlsZS5iYXNlbmFtZSwgY3VycmVudExpbmtzOiByYXcsIGV4aXN0aW5nTmFtZXMgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGxhbiBhIFwiQ3JlYXRlIE5ldyBTbGlkZVwiIHJ1bjogYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UgaW4gdGhlXG4gICAqIHNhbWUgZm9sZGVyIGFzIHRoZSBhY3RpdmUgbm90ZSwgd2hpY2ggaXRzZWxmIHN0YXlzIHVudG91Y2hlZC5cbiAgICovXG4gIHBsYW5DcmVhdGVOZXcoKTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQodGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpLm1hcCgoZikgPT4gZi5iYXNlbmFtZSkpO1xuICAgIHJldHVybiBwbGFuTmV3KHsgZXhpc3RpbmdOYW1lcyB9KTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIENyZWF0ZSBOZXh0IFNsaWRlIHBsYW47IG9wZW49ZmFsc2Uga2VlcHMgdGhlIGN1cnJlbnQgbm90ZSBpbiB0aGUgZWRpdG9yICovXG4gIGFzeW5jIGV4ZWN1dGVDcmVhdGVOZXh0KGZpbGU6IFRGaWxlLCBwbGFuOiBDcmVhdGVOZXh0UmVzdWx0LCBvcGVuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKGZpbGUsIHBsYW4sIGRpclByZWZpeChmaWxlLnBhcmVudD8ucGF0aCksIG9wZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGEgQ3JlYXRlIE5ldyBTbGlkZSBwbGFuLiBMYW5kcyBpbiBPYnNpZGlhbidzIGRlZmF1bHQgbmV3LW5vdGVcbiAgICogbG9jYXRpb24gKFNldHRpbmdzIFx1MjE5MiBGaWxlcyAmIGxpbmtzIFx1MjE5MiBEZWZhdWx0IGxvY2F0aW9uIGZvciBuZXcgbm90ZXMpO1xuICAgKiB3aXRoIFwic2FtZSBmb2xkZXIgYXMgY3VycmVudFwiIGNvbmZpZ3VyZWQgdGhhdCBpcyB0aGUgYWN0aXZlIG5vdGUncyBvd25cbiAgICogZm9sZGVyLiBXb3JrcyB3aXRoIG5vIG5vdGUgb3BlbiBhdCBhbGwgKGJsYW5rIHRhYikuXG4gICAqL1xuICBhc3luYyBleGVjdXRlQ3JlYXRlTmV3KHBsYW46IENyZWF0ZU5leHRSZXN1bHQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBcIlwiO1xuICAgIGF3YWl0IHRoaXMuYXBwbHlQbGFuKFxuICAgICAgbnVsbCxcbiAgICAgIHBsYW4sXG4gICAgICBkaXJQcmVmaXgodGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChzb3VyY2VQYXRoKT8ucGF0aCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBBcHBseSBhIHBsYW46IGNyZWF0ZSB0aGUgbm90ZSwgcmV3aXJlIGBkZWNrYCBwcm9wZXJ0aWVzLCBvcHRpb25hbGx5IG9wZW4gaXQgKi9cbiAgcHJpdmF0ZSBhc3luYyBhcHBseVBsYW4oXG4gICAgZmlsZTogVEZpbGUgfCBudWxsLFxuICAgIHBsYW46IENyZWF0ZU5leHRSZXN1bHQsXG4gICAgZGlyOiBzdHJpbmcsXG4gICAgb3BlbiA9IHRydWUsXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG5ld1BhdGggPSBgJHtkaXJ9JHtwbGFuLm5ld05hbWV9Lm1kYDtcbiAgICBjb25zdCBmcm9udG1hdHRlciA9IHBsYW4ubmV3RGVja0xpbmtzLm1hcCgobGluaykgPT4gSlNPTi5zdHJpbmdpZnkobGluaykpLmpvaW4oXCIsIFwiKTtcbiAgICBjb25zdCBjb250ZW50ID0gYC0tLVxcbmRlY2s6IFske2Zyb250bWF0dGVyfV1cXG4tLS1cXG5gO1xuXG4gICAgbGV0IG5ld0ZpbGU6IFRGaWxlO1xuICAgIHRyeSB7XG4gICAgICBuZXdGaWxlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKG5ld1BhdGgsIGNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBuZXcgTm90aWNlKGBOYXRpdmUgc2xpZGVzOiBjb3VsZCBub3QgY3JlYXRlIFwiJHtwbGFuLm5ld05hbWV9Lm1kXCIgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmV3aXJlIHRoZSBjdXJyZW50IG5vdGUncyBgZGVja2AgKGtlZXBzIGFsbCBvdGhlciBwcm9wZXJ0aWVzIGludGFjdClcbiAgICBmb3IgKGNvbnN0IHJld3JpdGUgb2YgcGxhbi5yZXdyaXRlcykge1xuICAgICAgaWYgKCFmaWxlIHx8IHJld3JpdGUubmFtZSAhPT0gZmlsZS5iYXNlbmFtZSkgY29udGludWU7IC8vIGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlXG4gICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZmlsZSwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSByZXdyaXRlLmRlY2s7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIW9wZW4pIHJldHVybjtcblxuICAgIC8vIE9wZW4gdGhlIG5ldyBub3RlIGluIHRoZSBjdXJyZW50IHBhbmUsIGVkaXQgbW9kZSAoTGl2ZSBQcmV2aWV3KVxuICAgIGNvbnN0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShuZXdGaWxlLCB7IHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgc2xpZGVzIG91dCBvZiBhbiBvcmRlcmVkIGRlY2sgY2hhaW46IHNwbGljZSB0aGUgY2hhaW4gYXJvdW5kXG4gICAqIGV2ZXJ5IGRlbGV0ZWQgcnVuICh0aGUgcHJlZGVjZXNzb3IncyBgZGVja2AgdGFrZXMgb3ZlciB0aGUgcnVuJ3MgZmlyc3RcbiAgICogc3Vydml2b3IpLCB0aGVuIG1vdmUgZWFjaCBkZWxldGVkIG5vdGUgdG8gdGhlIHRyYXNoLiBgZm9jdXNQYXRoYCBpcyB0aGVcbiAgICogbm90ZSB0aGUgZWRpdG9yIGN1cnJlbnRseSBzaG93cyBcdTIwMTQgd2hlbiBpdCBpcyBhbW9uZyB0aGUgZGVsZXRlZCwgdGhlXG4gICAqIHJlc3VsdCBuYW1lcyB0aGUgbmVhcmVzdCBzdXJ2aXZpbmcgbmVpZ2hib3VyIHRvIG9wZW4gaW5zdGVhZC5cbiAgICovXG4gIGFzeW5jIGV4ZWN1dGVEZWxldGVTbGlkZXMoXG4gICAgY2hhaW46IHN0cmluZ1tdLFxuICAgIGRlbGV0ZVBhdGhzOiBSZWFkb25seVNldDxzdHJpbmc+LFxuICAgIGZvY3VzUGF0aDogc3RyaW5nIHwgbnVsbCxcbiAgKTogUHJvbWlzZTxEZWxldGVTbGlkZXNSZXN1bHQ+IHtcbiAgICBjb25zdCByZXdyaXRlcyA9IHBsYW5EZWxldGVTbGlkZXMoY2hhaW4sIGRlbGV0ZVBhdGhzKTtcblxuICAgIGZvciAoY29uc3QgcmV3cml0ZSBvZiByZXdyaXRlcykge1xuICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLnBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICBjb25zdCBuZXh0ID0gcmV3cml0ZS5uZXh0UGF0aCA/IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChyZXdyaXRlLm5leHRQYXRoKSA6IG51bGw7XG4gICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIoZiwgKGZtOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgICBmbVtERUNLX0tFWV0gPSBuZXh0IGluc3RhbmNlb2YgVEZpbGUgPyBbYFtbJHtuZXh0LmJhc2VuYW1lfV1dYF0gOiBbXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYXNoZWQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBwYXRoIG9mIGRlbGV0ZVBhdGhzKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgY29udGludWU7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci50cmFzaEZpbGUoZik7XG4gICAgICAgIHRyYXNoZWQucHVzaChwYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoYE5hdGl2ZSBzbGlkZXM6IGNvdWxkIG5vdCBkZWxldGUgXCIke2YuYmFzZW5hbWV9XCIgKCR7U3RyaW5nKGVycm9yKX0pYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgdHJhc2hlZCwgbGFuZGluZ1BhdGg6IHBpY2tMYW5kaW5nUGF0aChjaGFpbiwgZGVsZXRlUGF0aHMsIGZvY3VzUGF0aCkgfTtcbiAgfVxufVxuXG4vKiogRm9sZGVyIHBhdGggXHUyMTkyIHRyYWlsaW5nLXNsYXNoIHByZWZpeCAoXCJcIiBmb3IgdmF1bHQgcm9vdCkgKi9cbmZ1bmN0aW9uIGRpclByZWZpeChwYXRoOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIXBhdGggfHwgcGF0aCA9PT0gXCIvXCIpIHJldHVybiBcIlwiO1xuICByZXR1cm4gYCR7cGF0aC5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpfS9gO1xufVxuIiwgIi8qKlxuICogZGVjay50cyBcdTIwMTQgUHVyZSBkZWNrLXJlc29sdXRpb24gY29yZSBmb3IgbmF0aXZlLXNsaWRlcy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbW9kdWxlIGlzIGZyZWUgb2YgT2JzaWRpYW4gcnVudGltZSBkZXBlbmRlbmNpZXMgc28gaXRcbiAqIGNhbiBiZSB1bml0IHRlc3RlZCBkaXJlY3RseSAoc2VlIHRlc3QvZGVjay50ZXN0LnRzKS4gbWFpbi50cyBhZGFwdHMgdGhlXG4gKiB2YXVsdCAobWV0YWRhdGFDYWNoZSkgdG8gdGhpcyBwdXJlIGludGVyZmFjZTogaXQgcmVzb2x2ZXMgYGRlY2tgXG4gKiBwcm9wZXJ0aWVzIHRvIG5vdGUgcGF0aHMsIHRoZW4gaGFuZHMgdGhlIHBhdGggZ3JhcGggdG8gY29tcHV0ZURlY2soKS5cbiAqL1xuXG4vKiogQSBkZWNrIGxpbmsgbGlzdCBob2xkcyBhdCBtb3N0IG9uZSBlbnRyeSAodGhlIG5leHQgc2xpZGUpICovXG5leHBvcnQgY29uc3QgTUFYX0RFQ0tfTElOS1MgPSAxO1xuXG4vKiogUmVzdWx0IG9mIHJlc29sdmluZyBhIG5vdGUncyBwb3NpdGlvbiBpbnNpZGUgYSBkZWNrICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2tJbmZvIHtcbiAgLyoqIENoYWluIG9mIG5vdGUgcGF0aHM6IFswXSBpcyB0aGUgZmlyc3Qgc2xpZGUsIHRoZW4gdGhlIHJlc3QgaW4gb3JkZXIgKi9cbiAgY2hhaW46IHN0cmluZ1tdO1xuICAvKiogSW5kZXggb2YgdGhlIGN1cnJlbnQgbm90ZSBpbnNpZGUgY2hhaW4gKi9cbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgbm90ZSdzIHBvc2l0aW9uIGluc2lkZSBpdHMgZGVjay5cbiAqXG4gKiB2MS4wLjAgY29udmVudGlvbiBcdTIwMTQgbmV4dC1vbmx5LCBubyBvdmVydmlldyBwYWdlOlxuICogICAtIGEgc2xpZGUncyBgZGVja2AgcHJvcGVydHkgaG9sZHMgYXQgbW9zdCBPTkUgbGluazogdGhlIG5leHQgc2xpZGVcbiAqICAgICAodGhlIGxhc3Qgc2xpZGUgaGFzIG5vIGxpbmsgYXQgYWxsKTtcbiAqICAgLSBhIGRlY2sgaXMgc2ltcGx5IGEgZm9yd2FyZCBsaW5rIGNoYWluIHN0YXJ0aW5nIGF0IGl0cyBoZWFkIHNsaWRlO1xuICogICAtIGFueSBub3RlIHRoYXQgaG9sZHMgYSBgZGVja2AgcHJvcGVydHkgKGV2ZW4gZW1wdHkpIGlzIGEgZGVjayBtZW1iZXIsXG4gKiAgICAgc28gYSBzaW5nbGUgZnJlc2hseSBjcmVhdGVkIHNsaWRlIGFscmVhZHkgY291bnRzIGFzIGEgb25lLXBhZ2UgZGVjay5cbiAqXG4gKiBCZWNhdXNlIHNsaWRlcyBubyBsb25nZXIgbGluayBiYWNrIHRvIGEgaGVhZCBub3RlLCB0aGUgY2hhaW4gaGVhZCBpc1xuICogbG9jYXRlZCBieSB3YWxraW5nIGJhY2t3YXJkOiBgZ2V0UHJldihwYXRoKWAgcmV0dXJucyB0aGUgbm90ZSB3aG9zZVxuICogYGRlY2tgIHByb3BlcnR5IHBvaW50cyBhdCBgcGF0aGAgKHVuZGVmaW5lZCB3aGVuIG5vbmUpLlxuICpcbiAqIGBnZXRMaW5rcyhwYXRoKWAgbXVzdCByZXR1cm4gdGhlIHJlc29sdmVkIG5vdGUgcGF0aHMgb2YgdGhlIGBkZWNrYFxuICogcHJvcGVydHkgb2YgdGhlIG5vdGUgYXQgYHBhdGhgIChlbXB0eSB3aGVuIHRoZSBub3RlIGhhcyBub25lLCBvciBpdHNcbiAqIGxpbmsgaXMgYnJva2VuIFx1MjAxNCBhIGJyb2tlbiBsaW5rIHNpbXBseSBlbmRzIHRoZSBjaGFpbiwgbmV2ZXIgY3Jhc2hlcykuXG4gKlxuICogUmV0dXJucyB0aGUgZnVsbCBjaGFpbiBhbmQgdGhlIGN1cnJlbnQgbm90ZSdzIGluZGV4LCBvciBudWxsIHdoZW4gdGhlXG4gKiBub3RlIGlzIG5vdCBwYXJ0IG9mIGFueSBkZWNrIChubyBgZGVja2AgcHJvcGVydHkgYW5kIG5vYm9keSBsaW5rcyB0byBpdCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlRGVjayhcbiAgY3VycmVudFBhdGg6IHN0cmluZyxcbiAgZ2V0TGlua3M6IChwYXRoOiBzdHJpbmcpID0+IHN0cmluZ1tdLFxuICBnZXRQcmV2OiAocGF0aDogc3RyaW5nKSA9PiBzdHJpbmcgfCB1bmRlZmluZWQsXG4pOiBEZWNrSW5mbyB8IG51bGwge1xuICAvLyBXYWxrIGJhY2t3YXJkIHRvIHRoZSBjaGFpbiBoZWFkIChjeWNsZS1ndWFyZGVkKS4gQSBsb25lIG5vZGUgKG5vIG93blxuICAvLyBsaW5rLCBubyBwcmVkZWNlc3NvcikgcmVzb2x2ZXMgYXMgYSBvbmUtcGFnZSBjaGFpbiBcdTIwMTQgd2hldGhlciBpdCBjb3VudHNcbiAgLy8gYXMgYSBkZWNrIG1lbWJlciBhdCBhbGwgaXMgZGVjaWRlZCBieSB0aGUgYWRhcHRlciAodGhlIGBkZWNrYCBrZXkpLlxuICBjb25zdCBiYWNrVmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPihbY3VycmVudFBhdGhdKTtcbiAgbGV0IGhlYWQgPSBjdXJyZW50UGF0aDtcbiAgZm9yICg7Oykge1xuICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2KGhlYWQpO1xuICAgIGlmICghcHJldiB8fCBiYWNrVmlzaXRlZC5oYXMocHJldikpIGJyZWFrO1xuICAgIGJhY2tWaXNpdGVkLmFkZChwcmV2KTtcbiAgICBoZWFkID0gcHJldjtcbiAgfVxuXG4gIC8vIFdhbGsgZm9yd2FyZCBmcm9tIHRoZSBoZWFkIChjeWNsZS1ndWFyZGVkKS5cbiAgY29uc3QgY2hhaW46IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgbGV0IGN1cjogc3RyaW5nIHwgdW5kZWZpbmVkID0gaGVhZDtcbiAgd2hpbGUgKGN1ciAmJiAhdmlzaXRlZC5oYXMoY3VyKSkge1xuICAgIHZpc2l0ZWQuYWRkKGN1cik7XG4gICAgY2hhaW4ucHVzaChjdXIpO1xuICAgIGN1ciA9IGdldExpbmtzKGN1cilbMF07XG4gIH1cblxuICBjb25zdCBpbmRleCA9IGNoYWluLmluZGV4T2YoY3VycmVudFBhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgY2hhaW4sIGluZGV4IH07XG59XG5cbi8qKlxuICogRXh0cmFjdCB1cCB0byBgbWF4YCBub3RlIG5hbWVzIGZyb20gYSBgZGVja2AgcHJvcGVydHkgdmFsdWUuXG4gKiBBY2NlcHRzIGEgc2luZ2xlIHN0cmluZyBvciBhIFlBTUwgbGlzdCBvZiBzdHJpbmdzOyB1bnF1b3RlZCBbW3hdXSB2YWx1ZXNcbiAqIGFyZSBwYXJzZWQgYnkgWUFNTCBhcyBuZXN0ZWQgYXJyYXlzIGFuZCBmbGF0dGVuZWQgaGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGNvbnN0IG5hbWUgPSBleHRyYWN0TGlua1RleHQoaXRlbSk7XG4gICAgaWYgKG5hbWUpIG91dC5wdXNoKG5hbWUpO1xuICAgIGlmIChvdXQubGVuZ3RoID49IG1heCkgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHVwIHRvIGBtYXhgIHJhdyBsaW5rIHN0cmluZ3MgZnJvbSBhIGBkZWNrYCBwcm9wZXJ0eSB2YWx1ZSBcdTIwMTQgdGhlXG4gKiB0cmltbWVkIHZhbHVlcyBleGFjdGx5IGFzIHdyaXR0ZW4gKGFsaWFzIC8gcGF0aCBmb3JtcyBwcmVzZXJ2ZWQpLiBTYW1lXG4gKiBmbGF0dGVuaW5nIHJ1bGVzIGFzIGV4dHJhY3RMaW5rcygpLCBidXQgd2l0aG91dCBleHRyYWN0aW5nIHRoZSB0YXJnZXQgbmFtZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RSYXdMaW5rcyh2YWx1ZTogdW5rbm93biwgbWF4OiBudW1iZXIgPSBNQVhfREVDS19MSU5LUyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgZmxhdDogdW5rbm93bltdID0gW107XG4gIGNvbnN0IGNvbGxlY3QgPSAodjogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdikgY29sbGVjdChpdGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmxhdC5wdXNoKHYpO1xuICAgIH1cbiAgfTtcbiAgY29sbGVjdCh2YWx1ZSk7XG5cbiAgY29uc3Qgb3V0OiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgZmxhdCkge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gXCJzdHJpbmdcIikgY29udGludWU7XG4gICAgY29uc3QgdHJpbW1lZCA9IGl0ZW0udHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgY29udGludWU7XG4gICAgb3V0LnB1c2godHJpbW1lZCk7XG4gICAgaWYgKG91dC5sZW5ndGggPj0gbWF4KSBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEV4dHJhY3QgdGhlIHRhcmdldCBub3RlIG5hbWUgZnJvbSBhIG1hcmtkb3duIGxpbmsgc3RyaW5nLlxuICogSGFuZGxlcyBzZXZlcmFsIHNoYXBlczpcbiAqICAgXCJbW3NsaWRlLTJdXVwiICAgICAgICBcdTIxOTIgc2xpZGUtMlxuICogICBcIltbc2xpZGUtMnxhbGlhc11dXCIgIFx1MjE5MiBzbGlkZS0yXG4gKiAgIFwiW1tzbGlkZS0yI3NlY3Rpb25dXVwiXHUyMTkyIHNsaWRlLTJcbiAqICAgc2xpZGUtMiAgICAgICAgICAgICAgXHUyMTkyIHNsaWRlLTIgKGJhcmUgZmlsZW5hbWUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0TGlua1RleHQodmFsdWU6IHVua25vd24pOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKCk7XG4gIGlmICghdHJpbW1lZCkgcmV0dXJuIG51bGw7XG4gIHJldHVybiB0cmltbWVkLnJlcGxhY2UoL15cXFtcXFsvLCBcIlwiKS5yZXBsYWNlKC9cXF1cXF0kLywgXCJcIikuc3BsaXQoXCJ8XCIpWzBdLnNwbGl0KFwiI1wiKVswXS50cmltKCk7XG59XG5cbi8qKiBSZW5kZXIgYSBwcm9wZXJ0eSB2YWx1ZSBhcyByZWFkYWJsZSB0ZXh0OiBhcnJheXMvb2JqZWN0cyBcdTIxOTIgSlNPTiwgZWxzZSBTdHJpbmcgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcdTIwMTRcIjtcbiAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKSA/PyBcIlx1MjAxNFwiO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGNpcmN1bGFyIC8gdW4tc3RyaW5naWZpYWJsZSBzdHJ1Y3R1cmUgXHUyMDE0IG5vdCBleHBlY3RlZCBmcm9tIGZyb250bWF0dGVyXG4gICAgICAgIHJldHVybiBcIlx1MjAxNFwiO1xuICAgICAgfVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBzeW1ib2wgLyBmdW5jdGlvbiBcdTIwMTQgbm90IGV4cGVjdGVkIGZyb20gZnJvbnRtYXR0ZXJcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWU7XG4gIH1cbn1cbiIsICIvKipcbiAqIGNyZWF0ZU5leHQudHMgXHUyMDE0IFB1cmUgXCJDcmVhdGUgTmV4dCBTbGlkZVwiIC8gXCJDcmVhdGUgTmV3IFNsaWRlXCIgcGxhbm5pbmdcbiAqIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRXZlcnl0aGluZyBpbiB0aGlzIG1vZHVsZSBpcyBmcmVlIG9mIE9ic2lkaWFuIHJ1bnRpbWUgZGVwZW5kZW5jaWVzIHNvIGl0XG4gKiBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHkgKHNlZSB0ZXN0L2NyZWF0ZU5leHQudGVzdC50cykuIG1haW4udHMgYWRhcHRzXG4gKiB0aGUgdmF1bHQgKG1ldGFkYXRhQ2FjaGUsIGNvbXB1dGVEZWNrKSB0byB0aGlzIHB1cmUgaW50ZXJmYWNlIGFuZCBhcHBsaWVzXG4gKiB0aGUgcmVzdWx0aW5nIHBsYW4gd2l0aCB2YXVsdC5jcmVhdGUoKSArIGZpbGVNYW5hZ2VyLnByb2Nlc3NGcm9udE1hdHRlcigpLlxuICpcbiAqIHYxLjAuMCBjb252ZW50aW9uIFx1MjAxNCBuZXh0LW9ubHksIG5vIG92ZXJ2aWV3IHBhZ2U6IGEgc2xpZGUncyBgZGVja2BcbiAqIHByb3BlcnR5IGhvbGRzIGF0IG1vc3QgT05FIGxpbmsgKGl0cyBuZXh0IHNsaWRlKS4gcGxhbkNyZWF0ZU5leHQgZGVjaWRlcyxcbiAqIGZvciB0aGUgY3VycmVudCBkZWNrIG5vdGU6XG4gKiAgIC0gdGhlIG5hbWUgb2YgdGhlIG5ldyBzbGlkZSBmaWxlIChjb2xsaXNpb24tYXdhcmUpLFxuICogICAtIHRoZSByYXcgYGRlY2tgIGxpbmsgdGV4dHMgb2YgdGhlIG5ldyBub3RlLFxuICogICAtIHRoZSByZXdyaXRlcyBuZWVkZWQgb24gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGVcbiAqICAgICBjdXJyZW50IG5vdGUpLlxuICogcGxhbkNyZWF0ZU5ldyBwbGFucyBhIGJyYW5kLW5ldyBkZWNrJ3MgZmlyc3QgcGFnZSAoYSBmcmVzaCBub3RlIHRoYXQgaXNcbiAqIG5vdCBwYXJ0IG9mIGFueSBkZWNrIHlldCBcdTIwMTQgYGRlY2s6IFtdYCwgbm8gcmV3cml0ZXMgYW55d2hlcmUpLlxuICovXG5cbmltcG9ydCB7IGV4dHJhY3RMaW5rVGV4dCB9IGZyb20gXCIuL2RlY2tcIjtcblxuLyoqIElucHV0cyBmb3IgcGxhbm5pbmcgXHUyMDE0IHJlc29sdmVkIGJ5IHRoZSBhZGFwdGVyIGluIG1haW4udHMgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlYXRlTmV4dElucHV0IHtcbiAgLyoqIEJhc2VuYW1lICh3aXRob3V0IGV4dGVuc2lvbikgb2YgdGhlIGN1cnJlbnQgbm90ZSAqL1xuICBjdXJyZW50TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIG9mIHRoZSBjdXJyZW50IG5vdGUgKGV4dHJhY3RlZCwgYXQgbW9zdCBvbmUpICovXG4gIGN1cnJlbnRMaW5rczogc3RyaW5nW107XG4gIC8qKiBCYXNlbmFtZXMgb2YgZXZlcnkgbWFya2Rvd24gbm90ZSBpbiB0aGUgdmF1bHQgKGNvbGxpc2lvbi1mcmVlIG5hbWluZykgKi9cbiAgZXhpc3RpbmdOYW1lczogU2V0PHN0cmluZz47XG59XG5cbi8qKiBPbmUgbm90ZSB3aG9zZSBgZGVja2AgcHJvcGVydHkgbXVzdCBiZSByZXdyaXR0ZW4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVja1Jld3JpdGUge1xuICAvKiogQmFzZW5hbWUgb2YgdGhlIG5vdGUgdG8gcmV3cml0ZSAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IHJhdyBgZGVja2AgbGluayB0ZXh0cyAoc2VyaWFsaXplZCBhcyBhIFlBTUwgbGlzdCkgKi9cbiAgZGVjazogc3RyaW5nW107XG59XG5cbi8qKiBUaGUgZnVsbCBwbGFuIGZvciBjcmVhdGluZyBvbmUgbmV3IHNsaWRlICovXG5leHBvcnQgaW50ZXJmYWNlIENyZWF0ZU5leHRSZXN1bHQge1xuICAvKiogQmFzZW5hbWUgKHdpdGhvdXQgZXh0ZW5zaW9uKSBvZiB0aGUgbmV3IHNsaWRlIGZpbGUgKi9cbiAgbmV3TmFtZTogc3RyaW5nO1xuICAvKiogUmF3IGBkZWNrYCBsaW5rIHRleHRzIGZvciB0aGUgbmV3IG5vdGUncyBmcm9udG1hdHRlciAqL1xuICBuZXdEZWNrTGlua3M6IHN0cmluZ1tdO1xuICAvKiogUmV3cml0ZXMgdG8gYXBwbHkgdG8gZXhpc3Rpbmcgbm90ZXMgKGluIHByYWN0aWNlIGFsd2F5cyB0aGUgY3VycmVudCBub3RlKSAqL1xuICByZXdyaXRlczogRGVja1Jld3JpdGVbXTtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBjcmVhdGlvbiBvZiBhIG5ldyBzbGlkZSBhZnRlciB0aGUgY3VycmVudCBub3RlLlxuICpcbiAqIEJlaGF2aW9yczpcbiAqICAgLSBObyBuZXh0IGxpbmsgKGxhc3Qgc2xpZGUsIGZyZXNoIGRlY2sgaGVhZCwgb3IgYSBwbGFpbiBub3RlIHN0YXJ0aW5nXG4gKiAgICAgYSBicmFuZC1uZXcgZGVjayk6IGFwcGVuZCBgPGN1cnJlbnQ+LW5leHRgIGFzIHRoZSBuZXcgbGFzdCBzbGlkZTsgdGhlXG4gKiAgICAgY3VycmVudCBub3RlJ3MgYGRlY2tgIGdhaW5zIHRoZSBsaW5rIHRvIGl0LlxuICogICAtIFZhbGlkIG5leHQgbGluazogaW5zZXJ0IGA8Y3VycmVudD4tbmV4dGAgYmV0d2VlbiB0aGUgY3VycmVudCBub3RlIGFuZFxuICogICAgIGl0cyBuZXh0OyB0aGUgbmV3IG5vdGUgdGFrZXMgb3ZlciB0aGUgb2xkIG5leHQgbGluay5cbiAqICAgLSBCcm9rZW4gbmV4dCBsaW5rIChwbGFpbiwgbm9uLWV4aXN0aW5nIG5hbWUpOiBjcmVhdGUgZXhhY3RseSB0aGVcbiAqICAgICBkZWNsYXJlZCBtaXNzaW5nIG5vdGUgYXMgdGhlIG5ldyBuZXh0IHNsaWRlIFx1MjAxNCB0aGUgXHUyNkEwIHdhcm5pbmdcbiAqICAgICBkaXNhcHBlYXJzIGFuZCB0aGUgYXV0aG9yJ3MgaW50ZW50IGlzIGhvbm91cmVkLiBBIGJyb2tlbiBsaW5rIHRoYXQgaXNcbiAqICAgICBub3QgYSBwbGFpbiBiYXNlbmFtZSAocGF0aC1xdWFsaWZpZWQsIHNlbGYtcmVmZXJlbmNpbmcpIGlzIHRyZWF0ZWQgYXNcbiAqICAgICBpbnZhbGlkIGFuZCBkcm9wcGVkIChhcHBlbmQgYSBgPGN1cnJlbnQ+LW5leHRgIGxhc3Qgc2xpZGUgaW5zdGVhZCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGFuQ3JlYXRlTmV4dChpbnB1dDogQ3JlYXRlTmV4dElucHV0KTogQ3JlYXRlTmV4dFJlc3VsdCB8IG51bGwge1xuICBjb25zdCB7IGN1cnJlbnROYW1lLCBjdXJyZW50TGlua3MgfSA9IGlucHV0O1xuICBjb25zdCBuZXh0TGluayA9IGN1cnJlbnRMaW5rc1swXTtcblxuICBpZiAobmV4dExpbmspIHtcbiAgICBjb25zdCBuZXh0TmFtZSA9IGV4dHJhY3RMaW5rVGV4dChuZXh0TGluayk7XG4gICAgaWYgKG5leHROYW1lICYmIGlzUGxhaW5OYW1lKG5leHROYW1lKSAmJiBuZXh0TmFtZSAhPT0gY3VycmVudE5hbWUpIHtcbiAgICAgIGlmICghaW5wdXQuZXhpc3RpbmdOYW1lcy5oYXMobmV4dE5hbWUpKSB7XG4gICAgICAgIC8vIFRoZSBkZWNsYXJlZCBuZXh0IG5vdGUgZG9lcyBub3QgZXhpc3QgeWV0IFx1MjE5MiBjcmVhdGUgZXhhY3RseSB0aGF0XG4gICAgICAgIC8vIG5vdGUgKGZpeGVzIHRoZSBicm9rZW4tbGluayB3YXJuaW5nLCBob25vdXJzIHRoZSBhdXRob3IncyBpbnRlbnQpLlxuICAgICAgICByZXR1cm4geyBuZXdOYW1lOiBuZXh0TmFtZSwgbmV3RGVja0xpbmtzOiBbXSwgcmV3cml0ZXM6IFtdIH07XG4gICAgICB9XG4gICAgICAvLyBBIHZhbGlkIG5leHQgbm90ZSBleGlzdHMgXHUyMTkyIGluc2VydCBiZXR3ZWVuIGl0IGFuZCB0aGUgY3VycmVudCBub3RlLlxuICAgICAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5ld05hbWUsXG4gICAgICAgIG5ld0RlY2tMaW5rczogW25leHRMaW5rXSxcbiAgICAgICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBJbnZhbGlkIChwYXRoLXF1YWxpZmllZCAvIHNlbGYtcmVmZXJlbmNpbmcpIG5leHQgbGluayBcdTIxOTIgZHJvcCBpdCBhbmRcbiAgICAvLyBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSAoZmFsbCB0aHJvdWdoIHRvIHRoZSBuby1uZXh0IGJyYW5jaCkuXG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgTm8gKHVzYWJsZSkgbmV4dCBsaW5rIFx1MjE5MiBhcHBlbmQgYSBuZXcgbGFzdCBzbGlkZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgbmV3TmFtZSA9IHVuaXF1ZU5hbWUoYCR7Y3VycmVudE5hbWV9LW5leHRgLCBpbnB1dC5leGlzdGluZ05hbWVzKTtcbiAgcmV0dXJuIHtcbiAgICBuZXdOYW1lLFxuICAgIG5ld0RlY2tMaW5rczogW10sXG4gICAgcmV3cml0ZXM6IFt7IG5hbWU6IGN1cnJlbnROYW1lLCBkZWNrOiBbYFtbJHtuZXdOYW1lfV1dYF0gfV0sXG4gIH07XG59XG5cbi8qKlxuICogUGxhbiB0aGUgY3JlYXRpb24gb2YgYSBicmFuZC1uZXcgZGVjaydzIGZpcnN0IHBhZ2UuXG4gKlxuICogVGhlIG5ldyBub3RlIHN0YXJ0cyBhcyBhIHNpbmdsZS1zbGlkZSBkZWNrIChgZGVjazogW11gKSBhbmQgbm90aGluZyBlbHNlXG4gKiBpcyB0b3VjaGVkIFx1MjAxNCB0aGUgbm90ZSBpdCB3YXMgbGF1bmNoZWQgZnJvbSBzdGF5cyBhcy1pcy4gTGF0ZXIgcGFnZXMgYXJlXG4gKiBhZGRlZCB3aXRoIENyZWF0ZSBOZXh0IFNsaWRlIGZyb20gaW5zaWRlIHRoZSBkZWNrLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkNyZWF0ZU5ldyhpbnB1dDogeyBleGlzdGluZ05hbWVzOiBTZXQ8c3RyaW5nPiB9KTogQ3JlYXRlTmV4dFJlc3VsdCB7XG4gIHJldHVybiB7XG4gICAgbmV3TmFtZTogdW5pcXVlTmFtZShcInVudGl0bGVkLXNsaWRlc1wiLCBpbnB1dC5leGlzdGluZ05hbWVzKSxcbiAgICBuZXdEZWNrTGlua3M6IFtdLFxuICAgIHJld3JpdGVzOiBbXSxcbiAgfTtcbn1cblxuLyoqIEEgbmFtZSB1c2FibGUgYXMgYSB2YXVsdCBub3RlIG5hbWU6IG5vIHBhdGggc2VwYXJhdG9ycywgbm9uLWVtcHR5ICovXG5mdW5jdGlvbiBpc1BsYWluTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5hbWUubGVuZ3RoID4gMCAmJiAhbmFtZS5pbmNsdWRlcyhcIi9cIikgJiYgIW5hbWUuaW5jbHVkZXMoXCJcXFxcXCIpO1xufVxuXG4vKiogRmlyc3QgZnJlZSBuYW1lIGluIHRoZSBmYW1pbHkgYGJhc2VgLCBgYmFzZS0yYCwgYGJhc2UtM2AsIFx1MjAyNiAqL1xuZnVuY3Rpb24gdW5pcXVlTmFtZShiYXNlOiBzdHJpbmcsIGV4aXN0aW5nOiBTZXQ8c3RyaW5nPik6IHN0cmluZyB7XG4gIGlmICghZXhpc3RpbmcuaGFzKGJhc2UpKSByZXR1cm4gYmFzZTtcbiAgZm9yIChsZXQgaSA9IDI7IDsgaSsrKSB7XG4gICAgY29uc3QgY2FuZGlkYXRlID0gYCR7YmFzZX0tJHtpfWA7XG4gICAgaWYgKCFleGlzdGluZy5oYXMoY2FuZGlkYXRlKSkgcmV0dXJuIGNhbmRpZGF0ZTtcbiAgfVxufVxuIiwgIi8qKlxuICogZGVsZXRlU2xpZGVzLnRzIFx1MjAxNCBQdXJlIFwiRGVsZXRlIHNsaWRlc1wiIHBsYW5uaW5nIGNvcmUgZm9yIG5hdGl2ZS1zbGlkZXMuXG4gKlxuICogRnJlZSBvZiBPYnNpZGlhbiBydW50aW1lIGRlcGVuZGVuY2llcyBzbyBpdCBjYW4gYmUgdW5pdCB0ZXN0ZWQgZGlyZWN0bHlcbiAqIChzZWUgdGVzdC9kZWxldGVTbGlkZXMudGVzdC50cykuIFRoZSBhZGFwdGVyIGluIGRlY2stc2VydmljZS50cyBhcHBsaWVzXG4gKiB0aGUgcGxhbjogaXQgcmV3cml0ZXMgdGhlIHN1cnZpdmluZyBub3RlcycgYGRlY2tgIHByb3BlcnRpZXMsIHRoZW4gbW92ZXNcbiAqIHRoZSBkZWxldGVkIG5vdGVzIHRvIHRoZSB0cmFzaC5cbiAqXG4gKiBEZWxldGlvbiBzcGxpY2VzIHRoZSBjaGFpbiBpbnN0ZWFkIG9mIGJyZWFraW5nIGl0OiBldmVyeSBtYXhpbWFsIHJ1biBvZlxuICogZGVsZXRlZCBzbGlkZXMgYmV0d2VlbiB0d28gc3Vydml2b3JzIEEgXHUyMTkyIFx1MjAyNiBcdTIxOTIgQiBpcyByZXBhaXJlZCBieSBwb2ludGluZ1xuICogQSdzIGBkZWNrYCBsaW5rIGF0IEIgKGBbXWAgd2hlbiB0aGUgcnVuIHJlYWNoZXMgdGhlIGVuZCBvZiB0aGUgY2hhaW4pLlxuICogV2hlbiBhIHJ1biBzdGFydHMgYXQgdGhlIGNoYWluIGhlYWQsIHRoZSBmaXJzdCBzdXJ2aXZvciBiZWNvbWVzIHRoZSBuZXdcbiAqIGhlYWQgYW5kIG5lZWRzIG5vIHJld3JpdGUgYXQgYWxsIChpdHMgb3duIGBkZWNrYCBhbHJlYWR5IHBvaW50cyBvbndhcmQpLlxuICovXG5cbi8qKiBPbmUgc3Vydml2aW5nIG5vdGUgd2hvc2UgYGRlY2tgIHByb3BlcnR5IG11c3QgYmUgcmV3cml0dGVuICovXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZVJld3JpdGUge1xuICAvKiogVmF1bHQgcGF0aCBvZiB0aGUgbm90ZSB0byByZXdyaXRlICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFZhdWx0IHBhdGggb2YgdGhlIG5vdGUgdGhhdCBzaG91bGQgYmVjb21lIHRoaXMgbm90ZSdzIG5leHQgc2xpZGUsXG4gICAqIG9yIG51bGwgd2hlbiB0aGUgbm90ZSBiZWNvbWVzIHRoZSBuZXcgbGFzdCBzbGlkZSAoYGRlY2s6IFtdYCkuXG4gICAqL1xuICBuZXh0UGF0aDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBQbGFuIHRoZSBkZWxldGlvbiBvZiBzbGlkZXMgZnJvbSBhbiBvcmRlcmVkIGRlY2sgY2hhaW4uXG4gKlxuICogYGNoYWluYCBpcyB0aGUgZnVsbCBzbGlkZSBvcmRlciAoWzBdID0gaGVhZCkuIE9ubHkgcGF0aHMgcHJlc2VudCBpbiB0aGVcbiAqIGNoYWluIGFyZSBjb25zaWRlcmVkOyBhbnl0aGluZyBlbHNlIGluIGBkZWxldGVQYXRoc2AgaXMgaWdub3JlZC4gUmV0dXJuc1xuICogb25lIHJld3JpdGUgcGVyIHN1cnZpdmluZyBub3RlIHRoYXQgZGlyZWN0bHkgcHJlY2VkZWQgYSBkZWxldGVkIHJ1bixcbiAqIG9yZGVyZWQgYnkgY2hhaW4gcG9zaXRpb24uIERlbGV0aW5nIG5vdGhpbmcgeWllbGRzIG5vIHJld3JpdGVzOyBkZWxldGluZ1xuICogZXZlcnl0aGluZyB5aWVsZHMgbm8gcmV3cml0ZXMgZWl0aGVyIChubyBzdXJ2aXZvcnMgbGVmdCB0byByZXBhaXIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhbkRlbGV0ZVNsaWRlcyhcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbik6IERlbGV0ZVJld3JpdGVbXSB7XG4gIGNvbnN0IHJld3JpdGVzOiBEZWxldGVSZXdyaXRlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhdGggPSBjaGFpbltpXTtcbiAgICBpZiAoIXBhdGggfHwgZGVsZXRlUGF0aHMuaGFzKHBhdGgpKSBjb250aW51ZTtcbiAgICAvLyBGaW5kIHRoZSBmaXJzdCBzdXJ2aXZvciBhZnRlciB0aGlzIG5vdGUncyBwb3NpdGlvbi5cbiAgICBsZXQgaiA9IGkgKyAxO1xuICAgIHdoaWxlIChqIDwgY2hhaW4ubGVuZ3RoICYmIGRlbGV0ZVBhdGhzLmhhcyhjaGFpbltqXSkpIGorKztcbiAgICBjb25zdCBuZXh0UGF0aCA9IGogPCBjaGFpbi5sZW5ndGggPyBjaGFpbltqXSA6IG51bGw7XG4gICAgY29uc3QgY2hhbmdlZCA9IG5leHRQYXRoICE9PSAoY2hhaW5baSArIDFdID8/IG51bGwpO1xuICAgIGlmIChjaGFuZ2VkKSByZXdyaXRlcy5wdXNoKHsgcGF0aCwgbmV4dFBhdGggfSk7XG4gIH1cbiAgcmV0dXJuIHJld3JpdGVzO1xufVxuXG4vKipcbiAqIFBpY2sgd2hlcmUgdGhlIGVkaXRvciBzaG91bGQgbGFuZCBhZnRlciBkZWxldGluZyBzbGlkZXM6IHRoZSBuZWFyZXN0XG4gKiBzdXJ2aXZvciBvZiBgZGVsZXRlZFBhdGhzYCcgbmVpZ2hib3VyaG9vZCBhcm91bmQgYGZvY3VzUGF0aGAgXHUyMDE0IHByZWZlclxuICogdGhlIGNsb3Nlc3Qgc3Vydml2b3IgYWZ0ZXIgaXQsIGVsc2UgdGhlIGNsb3Nlc3QgYmVmb3JlIGl0LiBSZXR1cm5zIG51bGxcbiAqIHdoZW4gYGZvY3VzUGF0aGAgc3Vydml2ZXMgb3Igbm90aGluZyBuZWFyYnkgcmVtYWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tMYW5kaW5nUGF0aChcbiAgY2hhaW46IHN0cmluZ1tdLFxuICBkZWxldGVQYXRoczogUmVhZG9ubHlTZXQ8c3RyaW5nPixcbiAgZm9jdXNQYXRoOiBzdHJpbmcgfCBudWxsLFxuKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICghZm9jdXNQYXRoIHx8ICFkZWxldGVQYXRocy5oYXMoZm9jdXNQYXRoKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGluZGV4ID0gY2hhaW4uaW5kZXhPZihmb2N1c1BhdGgpO1xuICBpZiAoaW5kZXggPT09IC0xKSByZXR1cm4gbnVsbDtcbiAgZm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFkZWxldGVQYXRocy5oYXMoY2hhaW5baV0pKSByZXR1cm4gY2hhaW5baV07XG4gIH1cbiAgZm9yIChsZXQgaSA9IGluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoIWRlbGV0ZVBhdGhzLmhhcyhjaGFpbltpXSkpIHJldHVybiBjaGFpbltpXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgTWVudSwgVEZpbGUsIFdvcmtzcGFjZUxlYWYgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB0eXBlIE5hdGl2ZVNsaWRlc1BsdWdpbiBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgQ29uZmlybURlbGV0ZU1vZGFsIH0gZnJvbSBcIi4vY29uZmlybS1kZWxldGVcIjtcblxuLyoqIFZpZXcgdHlwZSBpZCBvZiB0aGUgc2xpZGVzIHNpZGViYXIgcGFuZWwgKi9cbmV4cG9ydCBjb25zdCBTTElERVNfUEFORUxfVklFVyA9IFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiO1xuXG4vKipcbiAqIFNpZGViYXIgcGFuZWwgbGlzdGluZyBldmVyeSBzbGlkZSBvZiB0aGUgYWN0aXZlIG5vdGUncyBkZWNrIChuZXh0LW9ubHlcbiAqIGNoYWluIG9yZGVyKS4gVGFrZXMgb3ZlciB0aGUgYWdncmVnYXRpb24vZW50cnkgcm9sZSB0aGUgb3ZlcnZpZXcgcGFnZVxuICogdXNlZCB0byBwbGF5IGJlZm9yZSB2MS4wLjAuXG4gKlxuICogSW50ZXJhY3Rpb246XG4gKiAgIC0gY2xpY2sgICAgICAgICAgICBcdTIxOTIgb3BlbiB0aGF0IHNsaWRlIChhbmQgY2xlYXIgYW55IHNlbGVjdGlvbilcbiAqICAgLSBNb2QrY2xpY2sgICAgICAgIFx1MjE5MiB0b2dnbGUgdGhlIGl0ZW0gaW4gdGhlIHNlbGVjdGlvblxuICogICAtIFNoaWZ0K2NsaWNrICAgICAgXHUyMTkyIGV4dGVuZCB0aGUgc2VsZWN0aW9uIGZyb20gdGhlIGxhc3QgYW5jaG9yXG4gKiAgIC0gcmlnaHQtY2xpY2sgICAgICBcdTIxOTIgY29udGV4dCBtZW51OiBDcmVhdGUgbmV4dCBzbGlkZSAvIERlbGV0ZSBzbGlkZShzKVxuICovXG5leHBvcnQgY2xhc3MgU2xpZGVzUGFuZWxWaWV3IGV4dGVuZHMgSXRlbVZpZXcge1xuICAvKiogQ2hhaW4gc2lnbmF0dXJlIG9mIHRoZSBjdXJyZW50bHkgcmVuZGVyZWQgbGlzdCAqL1xuICBwcml2YXRlIGxhc3RDaGFpbjogc3RyaW5nW10gPSBbXTtcbiAgLyoqIFJlbmRlcmVkIGl0ZW0gZWxlbWVudHMsIGluZGV4LWFsaWduZWQgd2l0aCBsYXN0Q2hhaW4gKi9cbiAgcHJpdmF0ZSBpdGVtczogeyBwYXRoOiBzdHJpbmc7IGVsOiBIVE1MRWxlbWVudCB9W10gPSBbXTtcbiAgLyoqIEN1cnJlbnRseSBzZWxlY3RlZCBzbGlkZSBwYXRocyAobXVsdGktc2VsZWN0IGZvciBEZWxldGUpICovXG4gIHByaXZhdGUgc2VsZWN0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgLyoqIFNlbGVjdGlvbiBhbmNob3IgZm9yIFNoaWZ0K2NsaWNrIHJhbmdlIGV4dGVuc2lvbiAqL1xuICBwcml2YXRlIGFuY2hvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IE5hdGl2ZVNsaWRlc1BsdWdpbixcbiAgICBsZWFmOiBXb3Jrc3BhY2VMZWFmLFxuICApIHtcbiAgICBzdXBlcihsZWFmKTtcbiAgfVxuXG4gIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFNMSURFU19QQU5FTF9WSUVXO1xuICB9XG5cbiAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJTbGlkZXNcIjtcbiAgfVxuXG4gIGdldEljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gXCJwcmVzZW50YXRpb25cIjtcbiAgfVxuXG4gIGFzeW5jIG9uT3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNvbnRhaW5lckVsLmFkZENsYXNzKFwibmF0aXZlLXNsaWRlcy1wYW5lbFwiKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZmlsZS1vcGVuXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUub24oXCJjaGFuZ2VkXCIsICgpID0+IHRoaXMucmVuZGVyKCkpKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAudmF1bHQub24oXCJyZW5hbWVcIiwgKCkgPT4gdGhpcy5yZW5kZXIoKSkpO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcImRlbGV0ZVwiLCAoKSA9PiB0aGlzLnJlbmRlcigpKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2xvc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuICAgIHRoaXMubGFzdENoYWluID0gW107XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICB0aGlzLmFuY2hvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU3luYyB0aGUgbGlzdCB3aXRoIHRoZSBhY3RpdmUgbm90ZSdzIGRlY2suIEluY3JlbWVudGFsIG9uIHB1cnBvc2U6IHRoZVxuICAgKiByZWZyZXNoIGV2ZW50cyBhbHNvIGZpcmUgd2hpbGUgYSBjbGljayBvbiBhbiBlbnRyeSBpcyBpbiBmbGlnaHQgKHRoZVxuICAgKiBtb3VzZWRvd24gYWN0aXZhdGVzIHRoaXMgbGVhZiksIGFuZCByZWJ1aWxkaW5nIHRoZSBET00gbWlkLWdlc3R1cmVcbiAgICogZGVzdHJveXMgdGhlIGNsaWNrIHRhcmdldCBcdTIwMTQgd2hpY2ggbWFkZSBvcGVuaW5nIGEgc2xpZGUgdGFrZSB0d28gY2xpY2tzXG4gICAqIHdoZW5ldmVyIHRoZSBwYW5lbCB3YXMgbm90IHRoZSBhY3RpdmUgbGVhZi4gVW5jaGFuZ2VkIGNoYWlucyBvbmx5IGdldFxuICAgKiB0aGVpciBoaWdobGlnaHQgdXBkYXRlZCwgc28gaXRlbSBlbGVtZW50cyBhbHdheXMgc3Vydml2ZS5cbiAgICovXG4gIHByaXZhdGUgcmVuZGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgIGNvbnN0IGRlY2sgPSBmaWxlID8gdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuY29tcHV0ZShmaWxlKSA6IG51bGw7XG4gICAgY29uc3QgY2hhaW4gPSBkZWNrXG4gICAgICA/IGRlY2suY2hhaW4uZmlsdGVyKChwKSA9PiB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocCkgaW5zdGFuY2VvZiBURmlsZSlcbiAgICAgIDogW107XG5cbiAgICAvLyBEcm9wIHNlbGVjdGlvbnMgd2hvc2Ugbm90ZSB2YW5pc2hlZCBmcm9tIHRoZSBjaGFpbiBtZWFud2hpbGVcbiAgICBpZiAodGhpcy5zZWxlY3RlZC5zaXplID4gMCkge1xuICAgICAgY29uc3QgbGl2ZSA9IG5ldyBTZXQoY2hhaW4pO1xuICAgICAgZm9yIChjb25zdCBwYXRoIG9mIHRoaXMuc2VsZWN0ZWQpIGlmICghbGl2ZS5oYXMocGF0aCkpIHRoaXMuc2VsZWN0ZWQuZGVsZXRlKHBhdGgpO1xuICAgIH1cbiAgICAvLyBBIGRlYWQgYW5jaG9yIG11c3Qgbm90IHNpbGVudGx5IHR1cm4gYSBTaGlmdCtjbGljayBpbnRvIGEgdG9nZ2xlXG4gICAgaWYgKHRoaXMuYW5jaG9yICE9PSBudWxsICYmICFjaGFpbi5pbmNsdWRlcyh0aGlzLmFuY2hvcikpIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmICghY2hhaW5FcXVhbHModGhpcy5sYXN0Q2hhaW4sIGNoYWluKSkge1xuICAgICAgdGhpcy5yZWJ1aWxkKGNoYWluKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBpdCBvZiB0aGlzLml0ZW1zKSBpdC5lbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIsIGl0LnBhdGggPT09IGZpbGU/LnBhdGgpO1xuICAgIH1cbiAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gIH1cblxuICAvKiogRnVsbCByZWJ1aWxkIChjaGFpbiBzaGFwZSBjaGFuZ2VkKSAqL1xuICBwcml2YXRlIHJlYnVpbGQoY2hhaW46IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuY29udGFpbmVyRWw7XG4gICAgcm9vdC5lbXB0eSgpO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmxhc3RDaGFpbiA9IGNoYWluO1xuXG4gICAgaWYgKGNoYWluLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZW1wdHkgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLXBhbmVsLWVtcHR5XCIgfSk7XG4gICAgICBlbXB0eS5zZXRUZXh0KFxuICAgICAgICBcIk5vIHNsaWRlcyBkZWNrIFx1MjAxNCBvcGVuIGEgZGVjayBub3RlLCBvciBydW4gY3JlYXRlIG5leHQgc2xpZGUgb24gYW55IG5vdGUgdG8gc3RhcnQgb25lLlwiLFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aDtcbiAgICBjaGFpbi5mb3JFYWNoKChwYXRoLCBpKSA9PiB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgaWYgKCEoZiBpbnN0YW5jZW9mIFRGaWxlKSkgcmV0dXJuO1xuICAgICAgY29uc3QgaXRlbSA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtaXRlbVwiIH0pO1xuICAgICAgaWYgKHBhdGggPT09IGFjdGl2ZVBhdGgpIGl0ZW0uYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgICBpdGVtLmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1wYW5lbC1udW1cIiB9KS5zZXRUZXh0KFN0cmluZyhpICsgMSkpO1xuICAgICAgaXRlbS5jcmVhdGVTcGFuKHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtcGFuZWwtdGl0bGVcIiB9KS5zZXRUZXh0KGYuYmFzZW5hbWUpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHRoaXMub25JdGVtQ2xpY2soZSwgaSwgZikpO1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm9wZW5Db250ZXh0TWVudShlLCBmKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pdGVtcy5wdXNoKHsgcGF0aCwgZWw6IGl0ZW0gfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xpY2sgcm91dGluZzogcGxhaW4gPSBvcGVuLCBNb2QgPSB0b2dnbGUgc2VsZWN0LCBTaGlmdCA9IHJhbmdlIHNlbGVjdCAqL1xuICBwcml2YXRlIG9uSXRlbUNsaWNrKGU6IE1vdXNlRXZlbnQsIGluZGV4OiBudW1iZXIsIGY6IFRGaWxlKTogdm9pZCB7XG4gICAgaWYgKGUuc2hpZnRLZXkgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSkge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgLy8gUmFuZ2UgYW5jaG9yOiB0aGUgbGFzdCBzZWxlY3RlZCBpdGVtLCBvciB0aGUgZGlzcGxheWVkIHNsaWRlXG4gICAgICAgIC8vIHdoZW4gbm8gdXNhYmxlIGFuY2hvciBleGlzdHMgKGZpcnN0IFNoaWZ0K2NsaWNrIGluIGEgc2Vzc2lvbikuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVBhdGggPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpPy5wYXRoID8/IG51bGw7XG4gICAgICAgIGNvbnN0IGFuY2hvclBhdGggPVxuICAgICAgICAgIHRoaXMuYW5jaG9yICE9PSBudWxsICYmIHRoaXMuaXRlbXMuc29tZSgoaXQpID0+IGl0LnBhdGggPT09IHRoaXMuYW5jaG9yKVxuICAgICAgICAgICAgPyB0aGlzLmFuY2hvclxuICAgICAgICAgICAgOiBhY3RpdmVQYXRoO1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoKGl0KSA9PiBpdC5wYXRoID09PSBhbmNob3JQYXRoKTtcbiAgICAgICAgaWYgKGFuY2hvclBhdGggIT09IG51bGwgJiYgZnJvbSAhPT0gLTEpIHtcbiAgICAgICAgICBjb25zdCBbbG8sIGhpXSA9IGZyb20gPCBpbmRleCA/IFtmcm9tLCBpbmRleF0gOiBbaW5kZXgsIGZyb21dO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBsbzsgaSA8PSBoaTsgaSsrKSB0aGlzLnNlbGVjdGVkLmFkZCh0aGlzLml0ZW1zW2ldLnBhdGgpO1xuICAgICAgICAgIC8vIFRoZSBkaXNwbGF5ZWQgc2xpZGUgam9pbnMgZXZlcnkgU2hpZnQgc2VsZWN0aW9uIFx1MjAxNCBleHRlbmRpbmcgYVxuICAgICAgICAgIC8vIHNlbGVjdGlvbiBuZXZlciBzaWxlbnRseSBkcm9wcyB0aGUgcGFnZSB5b3UgYXJlIGxvb2tpbmcgYXQuXG4gICAgICAgICAgaWYgKGFjdGl2ZVBhdGggIT09IG51bGwgJiYgdGhpcy5pdGVtcy5zb21lKChpdCkgPT4gaXQucGF0aCA9PT0gYWN0aXZlUGF0aCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuYWRkKGFjdGl2ZVBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmFuY2hvciA9IHRoaXMuaXRlbXNbaW5kZXhdLnBhdGg7XG4gICAgICAgICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gTW9kIChvciBTaGlmdCB3aXRoIG5vIHJlYWNoYWJsZSBhbmNob3IpOiBwdXJlIHRvZ2dsZSBcdTIwMTQgdGhlIG9ubHkgd2F5XG4gICAgICAvLyB0byBjYW5jZWwgYW4gaXRlbSBvdXQgb2YgdGhlIHNlbGVjdGlvbi5cbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkLmhhcyhmLnBhdGgpKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShmLnBhdGgpO1xuICAgICAgZWxzZSB0aGlzLnNlbGVjdGVkLmFkZChmLnBhdGgpO1xuICAgICAgdGhpcy5hbmNob3IgPSBmLnBhdGg7XG4gICAgICB0aGlzLnN5bmNTZWxlY3Rpb25DbGFzc2VzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQuY2xlYXIoKTtcbiAgICAvLyBObyBzZWxlY3Rpb24gYWZ0ZXIgYSBwbGFpbiBjbGljaywgYnV0IHRoZSBjbGlja2VkIHNsaWRlIHN0YXlzIHRoZVxuICAgIC8vIFNoaWZ0K2NsaWNrIGFuY2hvciBcdTIwMTQgbWF0Y2hpbmcgdGhlIGZpbGUtZXhwbG9yZXIgZmVlbDogcGljayBhIHNsaWRlLFxuICAgIC8vIHRoZW4gU2hpZnQrY2xpY2sgYSBsYXRlciBvbmUgdG8gc2VsZWN0IHRoZSB3aG9sZSByYW5nZSBiZXR3ZWVuIHRoZW0uXG4gICAgdGhpcy5hbmNob3IgPSBmLnBhdGg7XG4gICAgdGhpcy5zeW5jU2VsZWN0aW9uQ2xhc3NlcygpO1xuICAgIHZvaWQgdGhpcy5vcGVuU2xpZGUoZik7XG4gIH1cblxuICAvKiogUmVmbGVjdCB0aGUgc2VsZWN0aW9uIHNldCBvbiB0aGUgcmVuZGVyZWQgaXRlbXMgd2l0aG91dCBhIHJlYnVpbGQgKi9cbiAgcHJpdmF0ZSBzeW5jU2VsZWN0aW9uQ2xhc3NlcygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIHRoaXMuaXRlbXMpIGl0LmVsLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1zZWxlY3RlZFwiLCB0aGlzLnNlbGVjdGVkLmhhcyhpdC5wYXRoKSk7XG4gIH1cblxuICAvKiogUmlnaHQtY2xpY2sgbWVudSBvbiBvbmUgaXRlbTsgb3BlcmF0ZXMgb24gdGhlIHdob2xlIHNlbGVjdGlvbiB3aGVuIGl0IGJlbG9uZ3MgdG8gb25lICovXG4gIHByaXZhdGUgb3BlbkNvbnRleHRNZW51KGU6IE1vdXNlRXZlbnQsIGY6IFRGaWxlKTogdm9pZCB7XG4gICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShcIkNyZWF0ZSBuZXh0IHNsaWRlXCIpXG4gICAgICAgIC5zZXRJY29uKFwicGx1c1wiKVxuICAgICAgICAub25DbGljaygoKSA9PiB2b2lkIHRoaXMuY3JlYXRlTmV4dEFmdGVyKGYpKSxcbiAgICApO1xuICAgIGNvbnN0IHRhcmdldHMgPSB0aGlzLnNlbGVjdGVkLmhhcyhmLnBhdGgpID8gWy4uLnRoaXMuc2VsZWN0ZWRdIDogW2YucGF0aF07XG4gICAgY29uc3Qgb3JkZXJlZCA9IHRoaXMubGFzdENoYWluLmZpbHRlcigocCkgPT4gdGFyZ2V0cy5pbmNsdWRlcyhwKSk7XG4gICAgbWVudS5hZGRJdGVtKChtaSkgPT5cbiAgICAgIG1pXG4gICAgICAgIC5zZXRUaXRsZShvcmRlcmVkLmxlbmd0aCA+IDEgPyBgRGVsZXRlICR7b3JkZXJlZC5sZW5ndGh9IHNsaWRlc2AgOiBcIkRlbGV0ZSBzbGlkZVwiKVxuICAgICAgICAuc2V0SWNvbihcInRyYXNoXCIpXG4gICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMuZGVsZXRlU2xpZGVzKG9yZGVyZWQpKSxcbiAgICApO1xuICAgIG1lbnUuc2hvd0F0TW91c2VFdmVudChlKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgYSBzbGlkZSBhZnRlciB0aGUgcmlnaHQtY2xpY2tlZCBvbmUgKHdpdGhvdXQgb3BlbmluZyBpdCkgKi9cbiAgcHJpdmF0ZSBhc3luYyBjcmVhdGVOZXh0QWZ0ZXIoZjogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwbGFuID0gdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UucGxhbkNyZWF0ZU5leHQoZik7XG4gICAgaWYgKCFwbGFuKSByZXR1cm47XG4gICAgYXdhaXQgdGhpcy5wbHVnaW4uZGVja1NlcnZpY2UuZXhlY3V0ZUNyZWF0ZU5leHQoZiwgcGxhbiwgZmFsc2UpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKiogQ29uZmlybSwgdGhlbiB0cmFzaCB0aGUgZ2l2ZW4gc2xpZGVzIGFuZCBzcGxpY2UgdGhlbSBvdXQgb2YgdGhlIGNoYWluICovXG4gIHByaXZhdGUgZGVsZXRlU2xpZGVzKHBhdGhzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmIChwYXRocy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBydW4gPSAoKTogdm9pZCA9PiB2b2lkIHRoaXMucnVuRGVsZXRpb24ocGF0aHMpO1xuXG4gICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb25maXJtRGVsZXRlU2xpZGVzKSB7XG4gICAgICBydW4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmFtZXMgPSBwYXRocy5tYXAoKHApID0+IHtcbiAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocCk7XG4gICAgICByZXR1cm4gZiBpbnN0YW5jZW9mIFRGaWxlID8gZi5iYXNlbmFtZSA6IHA7XG4gICAgfSk7XG4gICAgbmV3IENvbmZpcm1EZWxldGVNb2RhbCh0aGlzLmFwcCwgbmFtZXMsIHJ1biwgYXN5bmMgKCkgPT4ge1xuICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcyA9IGZhbHNlO1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgfSkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBydW5EZWxldGlvbihwYXRoczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhY3RpdmVQYXRoID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKT8ucGF0aCA/PyBudWxsO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucGx1Z2luLmRlY2tTZXJ2aWNlLmV4ZWN1dGVEZWxldGVTbGlkZXMoXG4gICAgICB0aGlzLmxhc3RDaGFpbixcbiAgICAgIG5ldyBTZXQocGF0aHMpLFxuICAgICAgYWN0aXZlUGF0aCxcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCBwYXRoIG9mIHBhdGhzKSB0aGlzLnNlbGVjdGVkLmRlbGV0ZShwYXRoKTtcbiAgICBpZiAodGhpcy5hbmNob3IgIT09IG51bGwgJiYgcGF0aHMuaW5jbHVkZXModGhpcy5hbmNob3IpKSB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAocmVzdWx0LmxhbmRpbmdQYXRoKSB7XG4gICAgICBjb25zdCBmID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJlc3VsdC5sYW5kaW5nUGF0aCk7XG4gICAgICBpZiAoZiBpbnN0YW5jZW9mIFRGaWxlKSBhd2FpdCB0aGlzLm9wZW5TbGlkZShmKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKiBPcGVuIGEgc2xpZGUgaW4gYSBtYXJrZG93biBsZWFmIChuZXZlciBpbiB0aGlzIHBhbmVsJ3Mgb3duIGxlYWYpICovXG4gIHByaXZhdGUgYXN5bmMgb3BlblNsaWRlKGY6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgbGVhZiA9XG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFwibWFya2Rvd25cIilbMF0gPz8gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYodHJ1ZSk7XG4gICAgYXdhaXQgbGVhZi5vcGVuRmlsZShmKTtcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZihsZWFmLCB7IGZvY3VzOiB0cnVlIH0pO1xuICB9XG59XG5cbi8qKiBPcmRlci1zZW5zaXRpdmUgY2hhaW4gY29tcGFyaXNvbiAqL1xuZnVuY3Rpb24gY2hhaW5FcXVhbHMoYTogc3RyaW5nW10sIGI6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIHJldHVybiBhLmxlbmd0aCA9PT0gYi5sZW5ndGggJiYgYS5ldmVyeSgocCwgaSkgPT4gcCA9PT0gYltpXSk7XG59XG4iLCAiaW1wb3J0IHsgQXBwLCBNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG4vKiogTWF4IG5hbWVzIHNob3duIGluIHRoZSBkaWFsb2cgYmVmb3JlIGNvbGxhcHNpbmcgaW50byBhIFwiK04gbW9yZVwiIGxpbmUgKi9cbmNvbnN0IE1BWF9WSVNJQkxFX05BTUVTID0gODtcblxuLyoqXG4gKiBDb25maXJtYXRpb24gZGlhbG9nIGZvciBEZWxldGUgc2xpZGVzLiBMaXN0cyB0aGUgbm90ZXMgYWJvdXQgdG8gYmVcbiAqIHRyYXNoZWQgKG51bWJlcmVkIGxpa2UgdGhlIHBhbmVsLCBzbyB0aGUgdXNlciBjYW4gbWFwIHRoZW0gMToxKSwgb2ZmZXJzXG4gKiBhIFwiZG9uJ3QgYXNrIGFnYWluXCIgdG9nZ2xlIHRoYXQgZmxpcHMgdGhlIGBjb25maXJtRGVsZXRlU2xpZGVzYCBzZXR0aW5nXG4gKiBvZmYgKHBlcnNpc3RlZCBieSB0aGUgY2FsbGVyIHZpYSBvbkRvbnRBc2spLCBhbmQgYXNrcyBmb3IgYW4gZXhwbGljaXRcbiAqIENhbmNlbCAvIERlbGV0ZSBkZWNpc2lvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpcm1EZWxldGVNb2RhbCBleHRlbmRzIE1vZGFsIHtcbiAgcHJpdmF0ZSBjb25maXJtZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBhcHA6IEFwcCxcbiAgICBwcml2YXRlIG5hbWVzOiBzdHJpbmdbXSxcbiAgICBwcml2YXRlIG9uQ29uZmlybTogKCkgPT4gdm9pZCxcbiAgICBwcml2YXRlIG9uRG9udEFzazogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgfVxuXG4gIG9uT3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgIHRoaXMubW9kYWxFbC5hZGRDbGFzcyhcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGVcIik7XG5cbiAgICBjb25zdCBjb3VudCA9IHRoaXMubmFtZXMubGVuZ3RoO1xuICAgIHRoaXMuY29udGVudEVsLmNyZWF0ZUVsKFwiaDNcIiwge1xuICAgICAgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtdGl0bGVcIixcbiAgICAgIHRleHQ6IGNvdW50ID09PSAxID8gXCJEZWxldGUgdGhpcyBzbGlkZT9cIiA6IGBEZWxldGUgJHtjb3VudH0gc2xpZGVzP2AsXG4gICAgfSk7XG4gICAgdGhpcy5jb250ZW50RWxcbiAgICAgIC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1zdWJcIiB9KVxuICAgICAgLnNldFRleHQoXG4gICAgICAgIGNvdW50ID09PSAxXG4gICAgICAgICAgPyBcIlRoZSBub3RlIHdpbGwgYmUgbW92ZWQgdG8gdGhlIHRyYXNoLlwiXG4gICAgICAgICAgOiBcIlRoZXNlIG5vdGVzIHdpbGwgYmUgbW92ZWQgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgKTtcblxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1saXN0XCIgfSk7XG4gICAgZm9yIChjb25zdCBbaSwgbmFtZV0gb2YgdGhpcy5uYW1lcy5zbGljZSgwLCBNQVhfVklTSUJMRV9OQU1FUykuZW50cmllcygpKSB7XG4gICAgICBjb25zdCByb3cgPSBsaXN0LmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLXJvd1wiIH0pO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1udW1cIiB9KS5zZXRUZXh0KFN0cmluZyhpICsgMSkpO1xuICAgICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1uYW1lXCIgfSkuc2V0VGV4dChuYW1lKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubmFtZXMubGVuZ3RoID4gTUFYX1ZJU0lCTEVfTkFNRVMpIHtcbiAgICAgIGxpc3RcbiAgICAgICAgLmNyZWF0ZURpdih7IGNsczogXCJuYXRpdmUtc2xpZGVzLWNvbmZpcm0tZGVsZXRlLW1vcmVcIiB9KVxuICAgICAgICAuc2V0VGV4dChgXHUyMDI2IGFuZCAke3RoaXMubmFtZXMubGVuZ3RoIC0gTUFYX1ZJU0lCTEVfTkFNRVN9IG1vcmVgKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkRG9udEFza1JvdygpO1xuICAgIHRoaXMuYnVpbGRBY3Rpb25zKCk7XG4gIH1cblxuICAvKiogQ29tcGFjdCBsZWZ0LWFsaWduZWQgXCJkb24ndCBhc2sgYWdhaW5cIiBjaGVja2JveCByb3cgKi9cbiAgcHJpdmF0ZSBidWlsZERvbnRBc2tSb3coKTogdm9pZCB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm5hdGl2ZS1zbGlkZXMtY29uZmlybS1kZWxldGUtZG9udGFza1wiIH0pO1xuICAgIHJvdy5jcmVhdGVFbChcImxhYmVsXCIpLnNldFRleHQoXCJEb24ndCBhc2sgYWdhaW5cIik7XG4gICAgY29uc3QgY2hlY2tib3ggPSByb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IHR5cGU6IFwiY2hlY2tib3hcIiB9KTtcbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcbiAgICAgIHZvaWQgdGhpcy5vbkRvbnRBc2soKS50aGVuKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgY2hlY2tib3guZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgLy8ga2VlcCB0aGUgY2hlY2tib3ggZW5hYmxlZCBpZiBwZXJzaXN0aW5nIHRoZSBwcmVmZXJlbmNlIGZhaWxlZFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSaWdodC1hbGlnbmVkIENhbmNlbCAvIERlbGV0ZSBidXR0b24gcm93ICovXG4gIHByaXZhdGUgYnVpbGRBY3Rpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoeyBjbHM6IFwibmF0aXZlLXNsaWRlcy1jb25maXJtLWRlbGV0ZS1hY3Rpb25zXCIgfSk7XG4gICAgYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IHRleHQ6IFwiQ2FuY2VsXCIgfSkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuY2xvc2UoKSk7XG4gICAgYWN0aW9uc1xuICAgICAgLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgdGV4dDogXCJEZWxldGVcIiwgY2xzOiBcIm1vZC13YXJuaW5nXCIgfSlcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm1lZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb25maXJtZWQpIHRoaXMub25Db25maXJtKCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCB0eXBlIFNldHRpbmdEZWZpbml0aW9uSXRlbSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgTmF0aXZlU2xpZGVzUGx1Z2luIGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBTTElERVNfVEhFTUVTIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBTZXR0aW5ncyB0YWI6IHRvZ2dsZXMgdGhlIG5hdiBidXR0b25zLCBwYWdlIG51bWJlciwgYXV0by1lbnRlciBhbmQgYmFyXG4gKiB2aXNpYmlsaXR5LiBEZWNsYXJhdGl2ZSBkZWZpbml0aW9ucyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCwgc2VhcmNoYWJsZSBpbiB0aGVcbiAqIHNldHRpbmdzIG1vZGFsKSB3aXRoIGFuIGltcGVyYXRpdmUgYGRpc3BsYXkoKWAgZmFsbGJhY2sgZm9yIG9sZGVyIHZlcnNpb25zLlxuICovXG5leHBvcnQgY2xhc3MgTmF0aXZlU2xpZGVzU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogTmF0aXZlU2xpZGVzUGx1Z2luKSB7XG4gICAgc3VwZXIocGx1Z2luLmFwcCwgcGx1Z2luKTtcbiAgfVxuXG4gIC8qKiBEZWNsYXJhdGl2ZSBzZXR0aW5ncyAoT2JzaWRpYW4gXHUyMjY1IDEuMTMuMCkgXHUyMDE0IHNlYXJjaGFibGUgYnkgdGhlIHNldHRpbmdzIG1vZGFsLiAqL1xuICBnZXRTZXR0aW5nRGVmaW5pdGlvbnMoKTogU2V0dGluZ0RlZmluaXRpb25JdGVtW10ge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU3R5bGUgdGVtcGxhdGVcIixcbiAgICAgICAgZGVzYzogXCJCdWlsdC1pbiBsb29rIGZvciB0aGUgc2xpZGVzIGNhcmQgYW5kIHNsaWRlcyBiYXIgKGJvcmRlciwgYmFja2dyb3VuZCwgc2hhZG93LCBiYXIgc3R5bGluZykuIEV2ZXJ5IHRlbXBsYXRlIGFkYXB0cyB0byBsaWdodCBhbmQgZGFyayB0aGVtZXMuXCIsXG4gICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICBrZXk6IFwic2xpZGVzVGhlbWVcIixcbiAgICAgICAgICB0eXBlOiBcImRyb3Bkb3duXCIsXG4gICAgICAgICAgb3B0aW9uczogT2JqZWN0LmZyb21FbnRyaWVzKFNMSURFU19USEVNRVMubWFwKCh0KSA9PiBbdC5pZCwgdC5sYWJlbF0pKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ2VudGVyIGltYWdlc1wiLFxuICAgICAgICBkZXNjOiBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcImltYWdlTGF5b3V0XCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBzbGlkZXMgYmFyXCIsXG4gICAgICAgIGRlc2M6IFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzaG93U2xpZGVzQmFyXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcmV2aW91cy9uZXh0IGJ1dHRvbnNcIixcbiAgICAgICAgZGVzYzogXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dOYXZCdXR0b25zXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiUGFnZSBudW1iZXIgc3R5bGVcIixcbiAgICAgICAgZGVzYzogJ1Nob3duIGF0IHRoZSBib3R0b20tcmlnaHQuIFwibiAvIHRvdGFsXCI6IDEtYmFzZWQgb3ZlciB0aGUgd2hvbGUgZGVjayBjaGFpbiAoaGVhZCBzbGlkZSA9IDEpLiBcIm5cIjoganVzdCB0aGUgY3VycmVudCBwYWdlIG51bWJlci4gXCJub25lXCI6IGhpZGRlbi4nLFxuICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAga2V5OiBcInBhZ2VOdW1iZXJTdHlsZVwiLFxuICAgICAgICAgIHR5cGU6IFwiZHJvcGRvd25cIixcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBmcmFjdGlvbjogXCJOIC8gVG90YWxcIixcbiAgICAgICAgICAgIGN1cnJlbnQ6IFwiTlwiLFxuICAgICAgICAgICAgbm9uZTogXCJOb25lXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiU2hvdyBwcm9ncmVzcyBiYXJcIixcbiAgICAgICAgZGVzYzogXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICAgIGNvbnRyb2w6IHsga2V5OiBcInNob3dQcm9ncmVzc1wiLCB0eXBlOiBcInRvZ2dsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIixcbiAgICAgICAgZGVzYzogXCJPcGVuIGRlY2sgbm90ZXMgZGlyZWN0bHkgaW4gU2xpZGVzIG1vZGUuIExlYXZlIG9mZiB0byBlbnRlciBtYW51YWxseSB3aXRoIHRoZSBUb2dnbGUgU2xpZGVzIE1vZGUgY29tbWFuZCAoTW9kK1NoaWZ0K0UpIG9yIHRoZSBwcmV2aW91cy9uZXh0IHBhZ2UgaG90a2V5cy5cIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiYXV0b0VudGVyU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiRXNjYXBlIGV4aXRzIHNsaWRlcyBtb2RlXCIsXG4gICAgICAgIGRlc2M6IFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIixcbiAgICAgICAgY29udHJvbDogeyBrZXk6IFwiZXNjRXhpdHNTbGlkZXNcIiwgdHlwZTogXCJ0b2dnbGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJTbGlkZXMgdGl0bGVcIixcbiAgICAgICAgZGVzYzogXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUgXHUyMDE0IHRoYXQgdGl0bGUgaXMgZWRpdGFibGUgKHJlbmFtZXMgdGhlIG5vdGUpOyBwcm9wZXJ0eS1iYWNrZWQgdGl0bGVzIGFyZSByZWFkLW9ubHkgKGVkaXQgdGhlIHByb3BlcnR5IG91dHNpZGUgc2xpZGVzIG1vZGUpLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJzbGlkZXNUaXRsZVwiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiRS5nLiBUaXRsZVwiIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBcIkJhciBwcm9wZXJ0aWVzXCIsXG4gICAgICAgIGRlc2M6IFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJiYXJQcm9wZXJ0aWVzXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIiB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJDb25maXJtIHNsaWRlIGRlbGV0aW9uXCIsXG4gICAgICAgIGRlc2M6IFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgICBjb250cm9sOiB7IGtleTogXCJjb25maXJtRGVsZXRlU2xpZGVzXCIsIHR5cGU6IFwidG9nZ2xlXCIgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiTmF2aWdhdGlvbiBob3RrZXlzXCIsXG4gICAgICAgIGRlc2M6IFwiRGVmYXVsdDogUHJldmlvdXMgcGFnZSBtb2Qrc2hpZnQrXHUyMTkwLCBuZXh0IHBhZ2UgbW9kK3NoaWZ0K1x1MjE5Mi4gUmViaW5kIHVuZGVyIHNldHRpbmdzIFx1MjE5MiBob3RrZXlzLlwiLFxuICAgICAgICBhY3Rpb246ICgpID0+IHtcbiAgICAgICAgICAvLyBPcGVuIE9ic2lkaWFuJ3MgaG90a2V5cyBzZXR0aW5ncyBwYWdlIChpbnRlcm5hbCBBUEk7IGlnbm9yZSBmYWlsdXJlcylcbiAgICAgICAgICAoXG4gICAgICAgICAgICB0aGlzLmFwcCBhcyB1bmtub3duIGFzIHsgc2V0dGluZz86IHsgb3BlblRhYkJ5SWQ/OiAoaWQ6IHN0cmluZykgPT4gdm9pZCB9IH1cbiAgICAgICAgICApLnNldHRpbmc/Lm9wZW5UYWJCeUlkPy4oXCJob3RrZXlzXCIpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgLyoqIFBlcnNpc3QgY29udHJvbCBjaGFuZ2VzLCB0aGVuIHJlZnJlc2ggdGhlIGJhciBzbyB0aGUgbmV3IHNldHRpbmcgYXBwbGllcy4gKi9cbiAgc2V0Q29udHJvbFZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQge1xuICAgIHZvaWQgdGhpcy5hcHBseUNvbnRyb2xWYWx1ZShrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgYXBwbHlDb250cm9sVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgKHRoaXMucGx1Z2luLnNldHRpbmdzIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW2tleV0gPSB2YWx1ZTtcbiAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gIH1cblxuICAvKiogSW1wZXJhdGl2ZSBmYWxsYmFjayBmb3IgT2JzaWRpYW4gPCAxLjEzLjAgKG5vdCBjYWxsZWQgd2l0aCBkZWZpbml0aW9ucyBwcmVzZW50KS4gKi9cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3R5bGUgdGVtcGxhdGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkJ1aWx0LWluIGxvb2sgZm9yIHRoZSBzbGlkZXMgY2FyZCBhbmQgc2xpZGVzIGJhciAoYm9yZGVyLCBiYWNrZ3JvdW5kLCBzaGFkb3csIGJhciBzdHlsaW5nKS4gRXZlcnkgdGVtcGxhdGUgYWRhcHRzIHRvIGxpZ2h0IGFuZCBkYXJrIHRoZW1lcy5cIixcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+IHtcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIFNMSURFU19USEVNRVMpIGRyb3Bkb3duLmFkZE9wdGlvbih0LmlkLCB0LmxhYmVsKTtcbiAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGhlbWUpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNsaWRlc1RoZW1lID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNlbnRlciBpbWFnZXNcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIkltYWdlcyByZW5kZXIgY2VudGVyZWQgb24gdGhlIHNsaWRlIGFzIGEgY2FyZCBibG9jayBleGFjdGx5IGFzIHRhbGwgYXMgdGhlIHBpY3R1cmUuIFR1cm4gb2ZmIGZvciBPYnNpZGlhbidzIHVzdWFsIGJlaGF2aW9yOiBpbWFnZXMgc3RheSBpbmxpbmUgd2l0aCB0aGUgdGV4dCAoYSBzbWFsbCBpbWFnZSBhbmQgaXRzIGNhcHRpb24gc2l0IG9uIHRoZSBzYW1lIHJvdykuXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pbWFnZUxheW91dCkub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaW1hZ2VMYXlvdXQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTaG93IHNsaWRlcyBiYXJcIilcbiAgICAgIC5zZXREZXNjKFwiTWFzdGVyIHRvZ2dsZSBmb3IgdGhlIGVudGlyZSBzbGlkZXMgYmFyIGF0IHRoZSBib3R0b20gb2YgdGhlIHdpbmRvd1wiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0Jhcikub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NsaWRlc0JhciA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJldmlvdXMvbmV4dCBidXR0b25zXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTaG93IFx1MjVDMCBcdTI1QjYgYnV0dG9ucyBvbiB0aGUgbGVmdCBvZiB0aGUgc2xpZGVzIGJhciB3aGVuIHRoZSBub3RlIGJlbG9uZ3MgdG8gYSBkZWNrIChoYXMgYSBgZGVja2AgcHJvcGVydHkpXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93TmF2QnV0dG9ucykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd05hdkJ1dHRvbnMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJQYWdlIG51bWJlciBzdHlsZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgICdTaG93biBhdCB0aGUgYm90dG9tLXJpZ2h0LiBcIm4gLyB0b3RhbFwiOiAxLWJhc2VkIG92ZXIgdGhlIHdob2xlIGRlY2sgY2hhaW4gKGhlYWQgc2xpZGUgPSAxKS4gXCJuXCI6IGp1c3QgdGhlIGN1cnJlbnQgcGFnZSBudW1iZXIuIFwibm9uZVwiOiBoaWRkZW4uJyxcbiAgICAgIClcbiAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd24pID0+XG4gICAgICAgIGRyb3Bkb3duXG4gICAgICAgICAgLmFkZE9wdGlvbnMoe1xuICAgICAgICAgICAgZnJhY3Rpb246IFwiTiAvIFRvdGFsXCIsXG4gICAgICAgICAgICBjdXJyZW50OiBcIk5cIixcbiAgICAgICAgICAgIG5vbmU6IFwiTm9uZVwiLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZ2VOdW1iZXJTdHlsZSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5wYWdlTnVtYmVyU3R5bGUgPSB2YWx1ZSBhcyBcImZyYWN0aW9uXCIgfCBcImN1cnJlbnRcIiB8IFwibm9uZVwiO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlNob3cgcHJvZ3Jlc3MgYmFyXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEaXNjcmV0ZSBjbGlja2FibGUgc2VnbWVudHMgYXQgdGhlIHRvcCBvZiB0aGUgc2xpZGVzIGJhciAtLSBvbmUgcGVyIHNsaWRlLCBjbGljayB0byBqdW1wXCIsXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93UHJvZ3Jlc3MpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dQcm9ncmVzcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkF1dG8tZW50ZXIgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gZGVjayBub3RlcyBkaXJlY3RseSBpbiBTbGlkZXMgbW9kZS4gTGVhdmUgb2ZmIHRvIGVudGVyIG1hbnVhbGx5IHdpdGggdGhlIFRvZ2dsZSBTbGlkZXMgTW9kZSBjb21tYW5kIChNb2QrU2hpZnQrRSkgb3IgdGhlIHByZXZpb3VzL25leHQgcGFnZSBob3RrZXlzLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b0VudGVyU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvRW50ZXJTbGlkZXMgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFc2NhcGUgZXhpdHMgc2xpZGVzIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFwiUHJlc3MgZXNjYXBlIHRvIGxlYXZlIHNsaWRlcyBtb2RlIGFuZCByZXR1cm4gdG8gdGhlIHByZXZpb3VzIHZpZXdcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVzY0V4aXRzU2xpZGVzKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lc2NFeGl0c1NsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU2xpZGVzIHRpdGxlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJGcm9udG1hdHRlciBwcm9wZXJ0eSB0byBzaG93IGFzIHRoZSBjYXJkIHRpdGxlIChIMSkuIExlYXZlIGVtcHR5IGZvciBub25lOyB0eXBlIGBmaWxlbmFtZWAgdG8gdXNlIHRoZSBmaWxlIG5hbWUuXCIsXG4gICAgICApXG4gICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIkUuZy4gVGl0bGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUpXG4gICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2xpZGVzVGl0bGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJCYXIgcHJvcGVydGllc1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQ29tbWEtc2VwYXJhdGVkIGZyb250bWF0dGVyIHByb3BlcnR5IG5hbWVzIHRvIHNob3cgaW4gdGhlIHNsaWRlcyBiYXIgKGUuZy4gYHVuaXZlcnNpdHksIHNob3J0LXRpdGxlLCBkYXRlYCkuIEVhY2ggdmFsdWUgZmlsbHMgYW4gZXF1YWwtd2lkdGggY29sdW1uOyBkcmFnIGRpdmlkZXJzIHRvIHJlc2l6ZS4gTGVhdmUgZW1wdHkgdG8gc2hvdyBub3RoaW5nLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJFLmcuIFVuaXZlcnNpdHksIGRhdGVcIilcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuYmFyUHJvcGVydGllcylcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5iYXJQcm9wZXJ0aWVzID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiQ29uZmlybSBzbGlkZSBkZWxldGlvblwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiQXNrIGZvciBjb25maXJtYXRpb24gYmVmb3JlIGRlbGV0aW5nIHNsaWRlcyBmcm9tIHRoZSBzbGlkZXMgcGFuZWwncyByaWdodC1jbGljayBtZW51LiBEZWxldGlvbiBtb3ZlcyBzbGlkZXMgdG8gdGhlIHRyYXNoLlwiLFxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29uZmlybURlbGV0ZVNsaWRlcyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiTmF2aWdhdGlvbiBob3RrZXlzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJEZWZhdWx0OiBQcmV2aW91cyBwYWdlIG1vZCtzaGlmdCtcdTIxOTAsIG5leHQgcGFnZSBtb2Qrc2hpZnQrXHUyMTkyLiBSZWJpbmQgdW5kZXIgc2V0dGluZ3MgXHUyMTkyIGhvdGtleXMuXCIsXG4gICAgICApXG4gICAgICAuYWRkQnV0dG9uKChidXR0b24pID0+XG4gICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiT3BlbiBob3RrZXlzIHNldHRpbmdzXCIpLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgIC8vIE9wZW4gT2JzaWRpYW4ncyBob3RrZXlzIHNldHRpbmdzIHBhZ2UgKGludGVybmFsIEFQSTsgaWdub3JlIGZhaWx1cmVzKVxuICAgICAgICAgIChcbiAgICAgICAgICAgIHRoaXMuYXBwIGFzIHVua25vd24gYXMgeyBzZXR0aW5nPzogeyBvcGVuVGFiQnlJZD86IChpZDogc3RyaW5nKSA9PiB2b2lkIH0gfVxuICAgICAgICAgICkuc2V0dGluZz8ub3BlblRhYkJ5SWQ/LihcImhvdGtleXNcIik7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgfVxufVxuIiwgIi8qKiBSZW1vdmUgYWxsIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNoaWxkcmVuKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEw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QUFvQixVQUFVLE1BQU07QUFHcEQsWUFBTSxRQUFRLEtBQUssTUFBTTtBQUN6QixZQUFNLE9BQU8sV0FBVztBQUFBLFFBQ3RCLEtBQUs7QUFBQSxRQUNMLE1BQ0UsS0FBSyxTQUFTLG9CQUFvQixhQUM5QixHQUFHLEtBQUssUUFBUSxDQUFDLE1BQU0sS0FBSyxLQUM1QixHQUFHLEtBQUssUUFBUSxDQUFDO0FBQUEsTUFDekIsQ0FBQztBQUNELFdBQUssSUFBSSxZQUFZLElBQUk7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxTQUFTLGdCQUFnQixRQUFRLEtBQUssTUFBTSxTQUFTLEdBQUc7QUFDL0QsWUFBTSxXQUFXLFVBQVUsRUFBRSxLQUFLLHlCQUF5QixDQUFDO0FBQzVELGVBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxNQUFNLFFBQVEsS0FBSztBQUMxQyxjQUFNLFFBQVEsSUFBSSxLQUFLLFFBQVEsU0FBUyxNQUFNLEtBQUssUUFBUSxZQUFZO0FBQ3ZFLGNBQU0sTUFBTSxVQUFVO0FBQUEsVUFDcEIsS0FBSywwREFBMEQsS0FBSztBQUFBLFFBQ3RFLENBQUM7QUFDRCxZQUFJLGlCQUFpQixTQUFTLE1BQU0sS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGlCQUFTLFlBQVksR0FBRztBQUFBLE1BQzFCO0FBQ0EsV0FBSyxJQUFJLFlBQVksUUFBUTtBQUFBLElBQy9CO0FBSUEsU0FBSyxJQUFJLGFBQWEsRUFBRSxTQUFTLEtBQUssSUFBSSxzQkFBc0IsSUFBSSxTQUFTLEdBQUcsQ0FBQztBQUFBLEVBQ25GO0FBQ0Y7QUFHQSxTQUFTLGFBQWEsT0FBZ0IsT0FBa0M7QUFDdEUsU0FDRSxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sV0FBVyxTQUFTLE1BQU0sTUFBTSxDQUFDLE1BQU0sT0FBTyxNQUFNLFFBQVE7QUFFOUY7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJuZXdOYW1lIiwgImltcG9ydF9vYnNpZGlhbiIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIl0KfQo=
