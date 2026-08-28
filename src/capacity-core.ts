/**
 * capacity-core.ts — pure capacity math + prompt formatting for Slides.
 *
 * This module is DOM-free and unit-tested (like src/deck.ts). It turns
 * measured numbers (from src/capacity.ts) into a one-screen capacity
 * report: how many body lines / bullets / H1 lines fit the active text
 * area, with per-element line boxes, and formats them into an AI-ready
 * prompt in the Obsidian UI language.
 */

/** Raw live-layout measurements of the active Slides note */
export interface SlideMetrics {
  /** Screen (viewport) size in CSS px */
  viewport: { width: number; height: number };
  /** Available text area (screen minus scroller paddings, card padding, title) */
  text: { width: number; height: number };
  /** Slides bar state — its height is on the page; the number is informational */
  bar: { visible: boolean; height: number };
  /** Vertical space reserved for the card title (0 = no title) */
  titleReserved: number;
  /** Body paragraph metrics (font size / line box, px) */
  body: { fontSize: number; lineHeight: number };
  /** Heading line boxes (px) — null when the note has none of this level */
  h1: { fontSize: number; lineHeight: number } | null;
  h2: { fontSize: number; lineHeight: number } | null;
  h3: { fontSize: number; lineHeight: number } | null;
  /** One bullet item's total height (line box + list paddings, px) */
  bullet: { itemHeight: number } | null;
  /** One code line's box (font 1rem in Slides; measured when a block exists) */
  code: { lineHeight: number } | null;
  /** Height of the first rendered image (px); null when the note has none */
  imageHeight: number | null;
  /** Average character widths (px) at the body font */
  char: { latin: number; cjk: number };
}

/** Derived capacity counts (pure; takes numbers, not the DOM) */
export interface CapacityResult {
  /** Body text lines that fit one screen */
  bodyLines: number;
  /** Bullet items that fit one screen (full list) */
  bullets: number;
  /** H1 lines that fit (one per H1 line box) */
  h1Lines: number;
  /** Examples: count of a second block type after one first block */
  combos: {
    afterH1Bullets: number;
    afterH2Bullets: number;
    afterH1BodyLines: number;
  };
}

/**
 * Derived capacity from raw metrics — pure and deterministic.
 * Every number floors (blocks are discrete); a negative result is clamped to 0.
 */
export function computeCapacity(m: SlideMetrics): CapacityResult {
  const H = m.text.height;
  const floor = (n: number): number => Math.max(0, Math.floor(n));
  const bodyLines = floor(H / m.body.lineHeight);

  const bulletH = m.bullet?.itemHeight ?? m.body.lineHeight;
  const bullets = floor(H / bulletH);

  const h1H = m.h1?.lineHeight ?? m.body.lineHeight;
  const h1Lines = floor(H / h1H);

  const h2H = m.h2?.lineHeight ?? m.body.lineHeight;
  const afterSpan = (firstH: number, itemH: number): number => floor((H - firstH) / itemH);

  return {
    bodyLines,
    bullets,
    h1Lines,
    combos: {
      afterH1Bullets: afterSpan(h1H, bulletH),
      afterH2Bullets: afterSpan(h2H, bulletH),
      afterH1BodyLines: afterSpan(h1H, m.body.lineHeight),
    },
  };
}

/** Locale of the generated prompt: "zh" for Chinese, otherwise English */
export function promptLocale(): "zh" | "en" {
  const lang =
    typeof document !== "undefined"
      ? (document.documentElement.getAttribute("lang") ?? navigator.language ?? "en")
      : "en";
  return lang.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Human-readable list of the measured element line boxes */
function boxStr(kind: string, box: { fontSize: number; lineHeight: number } | null): string {
  if (!box) return `${kind}: -`;
  return `${kind}: ${fmt(box.lineHeight)}px/line (font ${fmt(box.fontSize)}px)`;
}

function enPrompt(m: SlideMetrics, c: CapacityResult, note: string): string {
  const bar =
    m.bar.visible || m.bar.height > 0
      ? `Slides bar: visible, ${m.bar.height}px (already excluded from the text area).`
      : "Slides bar: hidden.";
  const title =
    m.titleReserved > 0 ? `Card title: ${m.titleReserved}px reserved.` : "Card title: none.";
  const img =
    m.imageHeight !== null ? `Image: ${m.imageHeight}px tall (first image on the slide).` : "";
  const samples = [
    `Plain text: ${c.bodyLines} body lines`,
    `H1 + bullets: ${c.combos.afterH1Bullets} bullets after a H1 line`,
    `Pure list: ${c.bullets} bullet items`,
    `H1 lines only: ${c.h1Lines}`,
  ].join("; ");
  return [
    `Slide capacity — one screen, no scrolling. Generated from the live Slides layout of this note; every number is measured/branch-derived at the current UI scale.`,
    ``,
    `Geometry: screen ${m.viewport.width}×${m.viewport.height}px; text area ${m.text.width}×${m.text.height}px. ${bar} ${title}`,
    ``,
    `Text metrics (body font ${fmt(m.body.fontSize)}px):`,
    `chars/line ≈ ${Math.floor(m.text.width / m.char.latin)} latin / ${Math.floor(m.text.width / m.char.cjk)} CJK; body line ${fmt(m.body.lineHeight)}px.`,
    boxStr("H1", m.h1),
    boxStr("H2", m.h2),
    boxStr("H3", m.h3),
    boxStr(
      "bullet",
      m.bullet ? { fontSize: m.body.fontSize, lineHeight: m.bullet.itemHeight } : null,
    ),
    boxStr("code", m.code ? { fontSize: m.body.fontSize, lineHeight: m.code.lineHeight } : null),
  ]
    .concat(img ? [img] : [])
    .concat([``, `Capacity: ${samples}.`, ``, note])
    .join("\n");
}

function zhPrompt(m: SlideMetrics, c: CapacityResult, note: string): string {
  const bar =
    m.bar.visible || m.bar.height > 0
      ? `Slides 栏：显示，${m.bar.height}px（已从文字区扣减）。`
      : "Slides 栏：隐藏。";
  const title = m.titleReserved > 0 ? `卡片标题：预留 ${m.titleReserved}px。` : "卡片标题：无。";
  const img = m.imageHeight !== null ? `图片：${m.imageHeight}px 高（当前页第一张）。` : "";
  const samples = [
    `纯正文：${c.bodyLines} 行`,
    `H1 + 列表：H1 后还可放 ${c.combos.afterH1Bullets} 个列表项`,
    `纯列表：${c.bullets} 个列表项`,
    `纯 H1：${c.h1Lines} 行`,
  ].join("；");
  return [
    `幻灯片容量 —— 一屏，不滚动。基于当前笔记的实时 Slides 布局生成；所有数字按当前 UI 比例实测/推算。`,
    ``,
    `几何：屏幕 ${m.viewport.width}×${m.viewport.height}px；文字区 ${m.text.width}×${m.text.height}px。${bar} ${title}`,
    ``,
    `文字参数（正文 ${fmt(m.body.fontSize)}px）：`,
    `每行约 ${Math.floor(m.text.width / m.char.cjk)} 个汉字 / ${Math.floor(m.text.width / m.char.latin)} 个拉丁字符；正文行高 ${fmt(m.body.lineHeight)}px。`,
    boxStr("H1", m.h1),
    boxStr("H2", m.h2),
    boxStr("H3", m.h3),
    boxStr(
      "列表项",
      m.bullet ? { fontSize: m.body.fontSize, lineHeight: m.bullet.itemHeight } : null,
    ),
    boxStr("代码行", m.code ? { fontSize: m.body.fontSize, lineHeight: m.code.lineHeight } : null),
  ]
    .concat(img ? [img] : [])
    .concat([``, `容量：${samples}。`, ``, note])
    .join("\n");
}

/**
 * Format the capacity prompt. Follows the Obsidian UI language via `locale`
 * (measured separately from the app). The `note` tail states the policy
 * (what fits one screen) — same wording in both languages where possible.
 */
export function formatCapacity(m: SlideMetrics, c: CapacityResult, locale: "zh" | "en"): string {
  const note =
    locale === "zh"
      ? "要求：生成的内容必须放在当前这一屏内，不要滚动；用上面的几何与行高数字核算总高度（正文行数 × 行高 + 标题预留 + 块间间距 ≤ 文字区高度）。"
      : "Requirement: the generated content must fit this one screen — no scrolling. Check the total height with the numbers above (lines × line-height + title reserve + inter-block spacing ≤ text area height).";
  return locale === "zh" ? zhPrompt(m, c, note) : enPrompt(m, c, note);
}
