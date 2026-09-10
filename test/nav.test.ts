import { describe, expect, it } from "vitest";
import { sessionDeck, stepTarget, walkIntents, type NavIntent } from "../src/nav";
import type { DeckInfo } from "../src/deck";

// ── helpers ───────────────────────────────────────────────────────────────

/** A vault whose decks are simple next-only chains: { slide: nextSlide } */
function chainVault(links: Record<string, string>, orders: Record<string, string[]> = {}) {
  return (path: string): DeckInfo | null => {
    const order = orders[path];
    if (order) return { chain: order, index: order.indexOf(path) };
    // walk back through `links` to the head, then forward
    const prev = new Map<string, string>();
    for (const [from, to] of Object.entries(links)) prev.set(to, from);
    let head = path;
    const back = new Set([path]);
    for (;;) {
      const p = prev.get(head);
      if (!p || back.has(p)) break;
      back.add(p);
      head = p;
    }
    const chain: string[] = [];
    const seen = new Set<string>();
    let cur: string | undefined = head;
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      chain.push(cur);
      cur = links[cur];
    }
    const index = chain.indexOf(path);
    return index === -1 ? null : { chain, index };
  };
}

const next: NavIntent = { dir: "next" };
const prev: NavIntent = { dir: "prev" };

// ── stepTarget ────────────────────────────────────────────────────────────

describe("stepTarget", () => {
  const deck: DeckInfo = { chain: ["a", "b", "c"], index: 1 };

  it("steps forward and backward inside the chain", () => {
    expect(stepTarget(deck, next)).toBe("c");
    expect(stepTarget(deck, prev)).toBe("a");
  });

  it("returns null at both ends — no wrap, no note creation", () => {
    expect(stepTarget({ chain: ["a", "b"], index: 1 }, next)).toBeNull();
    expect(stepTarget({ chain: ["a", "b"], index: 0 }, prev)).toBeNull();
  });

  it("treats a jump to the current index as a no-op", () => {
    expect(stepTarget(deck, { index: 1 })).toBeNull();
  });

  it("rejects out-of-range jumps", () => {
    expect(stepTarget(deck, { index: -1 })).toBeNull();
    expect(stepTarget(deck, { index: 3 })).toBeNull();
  });

  it("jumps to an earlier or later slide", () => {
    expect(stepTarget(deck, { index: 0 })).toBe("a");
    expect(stepTarget(deck, { index: 2 })).toBe("c");
  });
});

// ── sessionDeck ───────────────────────────────────────────────────────────

describe("sessionDeck", () => {
  it("resolves fresh when the session has no chain yet", () => {
    const deck = sessionDeck(null, "two", chainVault({ one: "two", two: "three" }));
    expect(deck).toEqual({ chain: ["one", "two", "three"], index: 1 });
  });

  it("stays in the remembered chain while the anchor belongs to it", () => {
    const remembered = ["left", "shared", "end"];
    const deck = sessionDeck(remembered, "shared", chainVault({ other: "shared", shared: "end" }));
    expect(deck).toEqual({ chain: remembered, index: 1 });
  });

  it("falls back to a fresh resolution once the anchor left the chain", () => {
    const deck = sessionDeck(["left", "shared"], "elsewhere", chainVault({ a: "elsewhere" }));
    expect(deck).toEqual({ chain: ["a", "elsewhere"], index: 1 });
  });

  it("returns null without an anchor", () => {
    expect(sessionDeck(null, null, () => null)).toBeNull();
  });
});

// ── walkIntents: the issue #110 regression contracts ──────────────────────

describe("walkIntents", () => {
  const fourSlides = chainVault({ one: "two", two: "three", three: "four" });

  it("advances one slide per press — a burst no longer collapses", () => {
    const burst: NavIntent[] = Array.from({ length: 6 }, () => next);
    const run = walkIntents("one", burst, fourSlides);
    expect(run.visited).toEqual(["two", "three", "four"]);
    expect(run.path).toBe("four");
  });

  it("stops at the last slide and ignores presses past the end", () => {
    const burst: NavIntent[] = Array.from({ length: 10 }, () => next);
    expect(walkIntents("three", burst, fourSlides).path).toBe("four");
  });

  it("walks back and forth one slide per press", () => {
    const run = walkIntents("one", [next, next, prev, next], fourSlides);
    expect(run.visited).toEqual(["two", "three", "two", "three"]);
    expect(run.path).toBe("three");
  });

  it("keeps the session inside its own chain when two slides share a next link", () => {
    // probe-image-2 → shared → end, and welcome → shared → end
    const vault = chainVault({ "probe-image-2": "shared", welcome: "shared", shared: "end" });
    // entering from probe-image-2, "shared" has an earlier predecessor (welcome)
    const fresh = vault("shared");
    expect(fresh).toEqual({ chain: ["welcome", "shared", "end"], index: 1 });

    // …but a session that started in the probe-image-2 chain stays there
    const session = vault("probe-image-2");
    expect(session).toEqual({ chain: ["probe-image-2", "shared", "end"], index: 0 });
    const run = walkIntents("probe-image-2", [next, prev], vault, session?.chain);
    expect(run.visited).toEqual(["shared", "probe-image-2"]);
    expect(run.path).toBe("probe-image-2");
    expect(run.chain).toEqual(["probe-image-2", "shared", "end"]);
  });

  it("jump intents share the same queue and anchor", () => {
    const run = walkIntents("one", [{ index: 2 }, next], fourSlides);
    expect(run.visited).toEqual(["three", "four"]);
  });

  it("leaves the anchor untouched when a press cannot move", () => {
    const run = walkIntents("four", [next, next, prev], fourSlides);
    expect(run.path).toBe("three");
    expect(run.visited).toEqual(["three"]);
  });
});
