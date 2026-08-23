import { describe, expect, it } from "vitest";
import {
  MAX_DECK_LINKS,
  computeDeck,
  extractLinkText,
  extractLinks,
  extractRawLinks,
  formatValue,
} from "../src/deck";

// ── extractLinks ──────────────────────────────────────────────────────────

describe("extractLinks", () => {
  it("accepts a single string", () => {
    expect(extractLinks("[[slide-2]]")).toEqual(["slide-2"]);
  });

  it("accepts a YAML list of strings", () => {
    expect(extractLinks(["[[slide-2]]"])).toEqual(["slide-2"]);
  });

  it("flattens nested arrays from unquoted [[x]] values", () => {
    expect(extractLinks([["slide-2"]])).toEqual(["slide-2"]);
  });

  it("caps at MAX_DECK_LINKS (one link in v1.0.0)", () => {
    expect(MAX_DECK_LINKS).toBe(1);
    expect(extractLinks(["[[a]]", "[[b]]", "[[c]]"])).toEqual(["a"]);
  });

  it("returns [] for null/undefined/empty", () => {
    expect(extractLinks(null)).toEqual([]);
    expect(extractLinks(undefined)).toEqual([]);
    expect(extractLinks("")).toEqual([]);
  });

  it("skips non-string entries", () => {
    expect(extractLinks([42, "[[a]]", { x: 1 }])).toEqual(["a"]);
  });

  it("honors a custom max", () => {
    expect(extractLinks(["[[a]]", "[[b]]"], 2)).toEqual(["a", "b"]);
  });
});

// ── extractRawLinks ───────────────────────────────────────────────────────

describe("extractRawLinks", () => {
  it("returns the raw link string exactly as written", () => {
    expect(extractRawLinks(["[[slide-2|alias]]"])).toEqual(["[[slide-2|alias]]"]);
  });

  it("accepts a single string", () => {
    expect(extractRawLinks("[[slide-2]]")).toEqual(["[[slide-2]]"]);
  });

  it("flattens nested arrays from unquoted [[x]] values", () => {
    expect(extractRawLinks([["slide-2"]])).toEqual(["slide-2"]);
  });

  it("trims whitespace and drops empty strings", () => {
    expect(extractRawLinks(["  [[slide-2]]  ", "", "  "])).toEqual(["[[slide-2]]"]);
  });

  it("skips non-string entries", () => {
    expect(extractRawLinks([42, "[[a]]", { x: 1 }])).toEqual(["[[a]]"]);
  });

  it("caps at MAX_DECK_LINKS", () => {
    expect(extractRawLinks(["[[a]]", "[[b]]", "[[c]]"])).toEqual(["[[a]]"]);
  });

  it("returns [] for null/undefined/empty", () => {
    expect(extractRawLinks(null)).toEqual([]);
    expect(extractRawLinks(undefined)).toEqual([]);
    expect(extractRawLinks("")).toEqual([]);
  });
});

// ── extractLinkText ───────────────────────────────────────────────────────

describe("extractLinkText", () => {
  it("strips [[ ]]", () => {
    expect(extractLinkText("[[slide-2]]")).toBe("slide-2");
  });

  it("drops the alias part", () => {
    expect(extractLinkText("[[slide-2|alias]]")).toBe("slide-2");
  });

  it("drops the section part", () => {
    expect(extractLinkText("[[slide-2#section]]")).toBe("slide-2");
  });

  it("keeps bare filenames", () => {
    expect(extractLinkText("slide-2")).toBe("slide-2");
  });

  it("trims whitespace", () => {
    expect(extractLinkText("  [[slide-2]]  ")).toBe("slide-2");
  });

  it("returns null for non-strings and empties", () => {
    expect(extractLinkText(42)).toBeNull();
    expect(extractLinkText("")).toBeNull();
    expect(extractLinkText("   ")).toBeNull();
  });
});

// ── formatValue ───────────────────────────────────────────────────────────

describe("formatValue", () => {
  it("renders null/undefined as em dash", () => {
    expect(formatValue(null)).toBe("—");
    expect(formatValue(undefined)).toBe("—");
  });

  it("renders strings/numbers/booleans as-is", () => {
    expect(formatValue("hi")).toBe("hi");
    expect(formatValue(42)).toBe("42");
    expect(formatValue(true)).toBe("true");
  });

  it("renders objects as JSON", () => {
    expect(formatValue({ a: 1 })).toBe('{"a":1}');
    expect(formatValue(["x", "y"])).toBe('["x","y"]');
  });
});

// ── computeDeck (v1.0.0 next-only semantics) ──────────────────────────────

/** Forward graph: path → its resolved next-slide path (at most one) */
function graphOf(defs: Record<string, string[]>): (path: string) => string[] {
  return (path) => defs[path] ?? [];
}

/** Backward lookup derived from the forward graph (the reverse index) */
function prevOfFactory(defs: Record<string, string[]>): (path: string) => string | undefined {
  return (path) => Object.keys(defs).find((k) => defs[k]?.[0] === path);
}

/** The demo deck: welcome → slide-2 → slide-3 (next-only) */
const demo = {
  welcome: ["slide-2"],
  "slide-2": ["slide-3"],
  "slide-3": [],
};

describe("computeDeck", () => {
  it("builds the full chain and index for the head slide", () => {
    const deck = computeDeck("welcome", graphOf(demo), prevOfFactory(demo))!;
    expect(deck.chain).toEqual(["welcome", "slide-2", "slide-3"]);
    expect(deck.index).toBe(0);
  });

  it("finds the chain head from a middle slide via backward walking", () => {
    const deck = computeDeck("slide-2", graphOf(demo), prevOfFactory(demo))!;
    expect(deck.chain).toEqual(["welcome", "slide-2", "slide-3"]);
    expect(deck.index).toBe(1);
  });

  it("finds the chain head from the last slide (no own deck link)", () => {
    const deck = computeDeck("slide-3", graphOf(demo), prevOfFactory(demo))!;
    expect(deck.chain).toEqual(["welcome", "slide-2", "slide-3"]);
    expect(deck.index).toBe(2);
  });

  it("treats a lone note as a one-page deck", () => {
    const deck = computeDeck("solo", graphOf({ solo: [] }), prevOfFactory({ solo: [] }))!;
    expect(deck.chain).toEqual(["solo"]);
    expect(deck.index).toBe(0);
  });

  it("handles a two-note deck with no role ambiguity (fixes #66)", () => {
    const g = { a: ["b"], b: [] };
    const fromA = computeDeck("a", graphOf(g), prevOfFactory(g))!;
    expect(fromA.chain).toEqual(["a", "b"]);
    expect(fromA.index).toBe(0);
    const fromB = computeDeck("b", graphOf(g), prevOfFactory(g))!;
    expect(fromB.chain).toEqual(["a", "b"]);
    expect(fromB.index).toBe(1);
  });

  it("resolves a lone node as a one-page chain (membership is gated by the adapter)", () => {
    const deck = computeDeck("untracked", graphOf(demo), prevOfFactory(demo))!;
    expect(deck.chain).toEqual(["untracked"]);
    expect(deck.index).toBe(0);
  });

  it("ends the chain at a slide with no next link (broken links are stripped by the adapter)", () => {
    const g = { a: ["b"], b: [] };
    const deck = computeDeck("a", graphOf(g), prevOfFactory(g))!;
    expect(deck.chain).toEqual(["a", "b"]);
  });

  it("guards against cycles", () => {
    const g = { a: ["b"], b: ["a"] };
    const deck = computeDeck("a", graphOf(g), prevOfFactory(g))!;
    // backward walk stops on revisit (head = b); forward walk stops on revisit
    expect(deck.chain).toEqual(["b", "a"]);
    expect(deck.index).toBe(1);
  });

  it("resolves a forked predecessor deterministically (malformed input)", () => {
    // orphan also points at slide-2 (two predecessors — malformed); the
    // backward walk from orphan finds no predecessor, so orphan heads its
    // own chain that merges into slide-2
    const g = {
      welcome: ["slide-2"],
      "slide-2": [],
      orphan: ["slide-2"],
    };
    const deck = computeDeck("orphan", graphOf(g), prevOfFactory(g))!;
    expect(deck.chain).toEqual(["orphan", "slide-2"]);
  });
});
