import { App, MarkdownView, Notice } from "obsidian";
import { computeCapacity, formatCapacity, promptLocale, type SlideMetrics } from "./capacity-core";

/**
 * capacity.ts — one-screen capacity measurement for the active Slides note.
 *
 * The "Copy slide capacity" command measures the live Slides layout of the
 * current note (the only layout that matters: a new slide must fit into the
 * same screen) and formats the numbers into an AI-ready prompt:
 *
 *   - the screen / text-area dimensions (bar height, title reserve, paddings
 *     are read from the live computed styles, so "one screen" always matches
 *     exactly what the viewer sees),
 *   - the line box of every element type — measured first (the current slide
 *     is already on screen), then derived from the pinned Slides typography
 *     variables (styles.css §9 sets --h1-size/--h1-line-height/--p-spacing/…
 *     on the sizer; code blocks are 1rem/1.5) when the note has no instance
 *     of that type,
 *   - chars-per-line for latin and CJK via canvas measureText.
 *
 * The math and prompt formatting live in src/capacity-core.ts (pure, tested);
 * this file is the DOM glue: measurement + clipboard.
 * The prompt is copied to the clipboard (no other output); the message text
 * follows the Obsidian UI language ("zh*" → Chinese, otherwise English).
 */

const px = (v: string): number => Number.parseFloat(v);

const SAMPLE_LATIN =
  "The quick brown fox jumps over the lazy dog 0123456789 abcdefghijklmnopqrstuvwxyz";
const SAMPLE_CJK = "一屏一卡幻灯片内容测量示例，每行可以排下多少个字：加减乘除百分比。";

/** Average char width (px) for a sample string at the given font settings */
function avgCharWidth(font: string, sample: string): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 24;
  ctx.font = font;
  return ctx.measureText(sample).width / sample.length;
}

function lineBox(el: HTMLElement): { fontSize: number; lineHeight: number } {
  const cs = getComputedStyle(el);
  const fs = px(cs.fontSize);
  const lhRaw = cs.lineHeight;
  return { fontSize: fs, lineHeight: px(lhRaw) > 0 ? px(lhRaw) : fs * 1.5 };
}

/**
 * Measure the active Slides view. Returns null when no Slides layout is
 * active (the command is only reachable there, but the guard is cheap).
 */
export function measureSlides(app: App): SlideMetrics | null {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) return null;
  const root = view.contentEl;
  const scroller = root.querySelector<HTMLElement>(".cm-scroller");
  const content = root.querySelector<HTMLElement>(".cm-content");
  if (!scroller || !content) return null;

  const csScroll = getComputedStyle(scroller);
  const csContent = getComputedStyle(content);

  const screenH = scroller.clientHeight;
  const textTopPad = px(csScroll.paddingTop);
  const textBottomPad = px(csScroll.paddingBottom);
  const cardPadTop = px(csContent.paddingTop);
  const cardPadBottom = px(csContent.paddingBottom);

  const hasTitle =
    content.hasAttribute("data-slides-title") || content.hasAttribute("data-slides-title-native");
  // With a title, the card's top padding grows by the reserved title block
  // (paddingTop - paddingBottom is the delta; both are --ns-pad-y normally).
  const titleReserved = hasTitle
    ? Math.round(Math.max(0, cardPadTop - cardPadBottom) * 100) / 100
    : 0;

  const textHeight =
    Math.round(
      Math.max(0, screenH - textTopPad - textBottomPad - cardPadTop - cardPadBottom) * 100,
    ) / 100;

  const textWidth = content.clientWidth - px(csContent.paddingLeft) - px(csContent.paddingRight);
  const viewportWidth = scroller.clientWidth;
  const viewportHeight = screenH;

  // The slides bar is appended to document.body (not the view's contentEl)
  const bar = document.querySelector<HTMLElement>(".native-slides-bar");
  const barVisible = bar !== null && getComputedStyle(bar).display !== "none";
  const barHeight = bar && barVisible ? bar.offsetHeight : 0;

  // ── element line boxes: measure first item of each type present ────────
  const header = (cls: string) => root.querySelector<HTMLElement>(`.cm-content ${cls}`);
  const h1El = header(".cm-header-1");
  const h2El = header(".cm-header-2");
  const h3El = header(".cm-header-3");
  const bulletEl = root.querySelector<HTMLElement>(".cm-content .HyperMD-list-line");
  const codeEl = root.querySelector<HTMLElement>(".cm-content pre, .cm-content .HyperMD-codeblock");
  const imgEl = root.querySelector<HTMLElement>(".cm-content img:not(.cm-widgetBuffer)");

  // A plain body line — skip headers, list lines, code, quotes and empty
  // lines (CM renders only visible lines; in Slides mode the first screen
  // is exactly them). An empty line box (a blank row, ~8px) is not a useful
  // body sample, so pick the first candidate with actual text.
  const bodyEl =
    Array.from(
      root.querySelectorAll<HTMLElement>(
        ".cm-content .cm-line:not(.HyperMD-header):not(.HyperMD-list-line):not(.HyperMD-quote):not(.HyperMD-codeblock)",
      ),
    ).find((el) => el.textContent !== null && el.textContent.trim().length > 0) ?? content;

  const body = lineBox(bodyEl);
  const h1 = h1El ? lineBox(h1El) : null;
  const h2 = h2El ? lineBox(h2El) : null;
  const h3 = h3El ? lineBox(h3El) : null;

  const cs = (el: HTMLElement): CSSStyleDeclaration => getComputedStyle(el);
  let bullet: { itemHeight: number } | null = null;
  if (bulletEl) {
    const c = cs(bulletEl);
    bullet = {
      itemHeight: px(c.lineHeight) + px(c.paddingTop) + px(c.paddingBottom),
    };
  }

  let code: { lineHeight: number } | null = null;
  if (codeEl) {
    const c = cs(codeEl);
    code = { lineHeight: px(c.lineHeight) > 0 ? px(c.lineHeight) : px(c.fontSize) * 1.5 };
  }

  const imageHeight =
    imgEl && imgEl.getBoundingClientRect().height > 0
      ? Math.round(imgEl.getBoundingClientRect().height)
      : null;

  // ── derive missing element boxes from the pinned Slides typography ─────
  // styles.css §9 declares the slide typography on the sizer
  // (--h1-size: 1.4em; --h1-line-height: 1.43; …) and §7 pins code blocks
  // to 1rem/1.5 — a note without that element type still reports its box.
  const sizer = root.querySelector<HTMLElement>(".cm-sizer");
  const sizerStyle = sizer ? cs(sizer) : null;
  const deriveBox = (sizeVar: string, lhVar: string) => {
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

  // ── char widths at the body font ───────────────────────────────────────
  const fontFamily = cs(content).fontFamily;
  const font = `400 ${body.fontSize}px ${fontFamily}`;
  const char = {
    latin: avgCharWidth(font, SAMPLE_LATIN),
    cjk: avgCharWidth(font, SAMPLE_CJK),
  };

  // Measured wins; derivation fills the gaps for absent types.
  return {
    viewport: { width: viewportWidth, height: viewportHeight },
    text: { width: textWidth, height: textHeight },
    bar: {
      visible: barVisible,
      height: barHeight,
    },
    titleReserved: Math.round(titleReserved * 100) / 100,
    body,
    h1: h1 ?? deriveH1,
    h2: h2 ?? deriveH2,
    h3: h3 ?? deriveH3,
    bullet,
    code: code ?? deriveCode(),
    imageHeight,
    char,
  };
}

/**
 * Entry point of the "Copy slide capacity" command: measure, format,
 * write to the clipboard. Runs only from Slides mode (command gate).
 */
export async function copyCapacityPrompt(app: App): Promise<void> {
  const m = measureSlides(app);
  if (!m) {
    new Notice("Native slides: could not measure the Slides layout");
    return;
  }
  const prompt = formatCapacity(m, computeCapacity(m), promptLocale());
  try {
    await navigator.clipboard.writeText(prompt);
  } catch (error) {
    new Notice(`Native slides: clipboard write failed (${String(error)})`);
  }
}
