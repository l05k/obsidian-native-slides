import { describe, expect, it } from "vitest";
import { computeCapacity, formatCapacity, type SlideMetrics } from "../src/capacity-core";

/** A realistic fixture from the live example-vault layout (23px font, 1440×842) */
const base: SlideMetrics = {
  viewport: { width: 1440, height: 842 },
  text: { width: 1106, height: 757 },
  bar: { visible: true, height: 38 },
  titleReserved: 46,
  body: { fontSize: 23, lineHeight: 34.5 },
  h1: { fontSize: 32.2, lineHeight: 46.046 },
  h2: { fontSize: 25.875, lineHeight: 40.365 },
  h3: { fontSize: 23, lineHeight: 29.9 },
  bullet: { itemHeight: 35 },
  code: { lineHeight: 34.5 },
  imageHeight: null,
  char: { latin: 11.3, cjk: 23 },
};

describe("computeCapacity", () => {
  it("floors body lines over the usable height", () => {
    const c = computeCapacity(base);
    // 757 / 34.5 ≈ 21.94
    expect(c.bodyLines).toBe(21);
    // 757 / 35 ≈ 21.6
    expect(c.bullets).toBe(21);
    // H1 line 46.046: 757 / 46.046 ≈ 16.44
    expect(c.h1Lines).toBe(16);
    // (757 − 46.046) / 35 ≈ 20.3
    expect(c.combos.afterH1Bullets).toBe(20);
    // (757 − 40.365) / 35 ≈ 20.5
    expect(c.combos.afterH2Bullets).toBe(20);
  });

  it("clamps negative remainders to zero", () => {
    const tiny: SlideMetrics = { ...base, text: { width: 100, height: 10 } };
    const c = computeCapacity(tiny);
    expect(c.bodyLines).toBe(0);
    expect(c.combos.afterH1Bullets).toBe(0);
  });

  it("answers bullet height from the bullet metric, not body", () => {
    const m: SlideMetrics = { ...base, bullet: { itemHeight: 70 } };
    const c = computeCapacity(m);
    expect(c.bullets).toBe(Math.floor(757 / 70));
    expect(c.combos.afterH1Bullets).toBe(Math.floor((757 - 46.04600172) / 70));
  });

  it("uses the body line height when a heading type is absent (measured base)", () => {
    const m: SlideMetrics = { ...base, h1: null };
    const c = computeCapacity(m);
    expect(c.h1Lines).toBe(Math.floor(757 / 34.5));
    expect(c.combos.afterH1Bullets).toBe(Math.floor((757 - 34.5) / 35));
  });
});
describe("formatCapacity", () => {
  it("produces an English prompt with key numbers", () => {
    const prompt = formatCapacity(base, computeCapacity(base), "en");
    expect(prompt).toContain("1440×842px");
    expect(prompt).toContain("21 body lines");
    expect(prompt).toContain("chars/line");
    expect(prompt).toContain("46.0px/line");
    expect(prompt).toContain("one screen");
  });

  it("produces a Chinese prompt", () => {
    const prompt = formatCapacity(base, computeCapacity(base), "zh");
    expect(prompt).toContain("屏幕 1440×842px");
    expect(prompt).toContain("21 行");
    expect(prompt).toContain("每行约");
  });

  it("reports the bar and title state", () => {
    const hidden = { ...base, bar: { visible: false, height: 0 }, titleReserved: 0 };
    const prompt = formatCapacity(hidden, computeCapacity(hidden), "en");
    expect(prompt).toContain("Slides bar: hidden");
    expect(prompt).toContain("Card title: none.");
  });

  it("reports a measured image height when present", () => {
    const m = { ...base, imageHeight: 360 };
    const prompt = formatCapacity(m, computeCapacity(m), "en");
    expect(prompt).toContain("Image: 360px tall");
  });

  it("marks absent element types with '-'", () => {
    const m = { ...base, h1: null, code: null, bullet: null };
    const prompt = formatCapacity(m, computeCapacity(m), "en");
    expect(prompt).toContain("H1: -");
    expect(prompt).toContain("bullet: -");
    expect(prompt).toContain("code: -");
  });
});
