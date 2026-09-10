import { describe, expect, it, vi } from "vitest";
import { computeDeck, deckFromHead, type DeckInfo } from "../src/deck";
import { NavSession, sessionDeck, stepTarget, type NavIntent } from "../src/nav";

// ── a fake vault: notes hold at most one next link, like the real `deck` property

/** A vault keyed by note path, where each value is that note's next link ([] = last slide) */
type Vault = Record<string, string[]>;

/** Resolve a deck with the *real* `computeDeck` — same algorithm as production */
function freshDeck(vault: Vault, path: string): DeckInfo | null {
  const links = (p: string): string[] => (p in vault ? (vault[p] ?? []) : []);
  const prev = (p: string): string | undefined =>
    Object.keys(vault).find((from) => from !== p && (vault[from] ?? [])[0] === p);
  return computeDeck(path, links, prev);
}

/** Walk live from a head, like the plugin does for a session */
function deckFromHint(vault: Vault, head: string, path: string): DeckInfo | null {
  return deckFromHead(head, path, (p) => vault[p] ?? []);
}

/** The plugin's resolution: session head hint first, fresh computation otherwise */
function resolve(vault: Vault, path: string, head: string | null): DeckInfo | null {
  return sessionDeck(
    head,
    path,
    (h, p) => (h in vault ? deckFromHint(vault, h, p) : null),
    (p) => freshDeck(vault, p),
  );
}

/** Drive the real NavSession against a fake editor that "opens" synchronously-ish */
async function driveSession(
  vault: Vault,
  start: string,
  presses: NavIntent[],
): Promise<{ path: string; visited: string[]; head: string | null; opened: string[] }> {
  let current = start;
  const visited: string[] = [];
  const opened: string[] = [];
  let head: string | null = null;

  const session = new NavSession({
    resolve: (path, hint) => {
      const deck = resolve(vault, path, hint);
      if (deck) head = deck.chain[0] ?? head;
      return deck;
    },
    open: async (target) => {
      opened.push(target);
      current = target;
      visited.push(target);
    },
    activePath: () => current,
  });

  // queue every press in the same tick, like a burst of key presses
  await Promise.all(presses.map((intent) => session.push(intent)));

  return { path: current, visited, head, opened };
}

const next: NavIntent = { dir: "next" };
const prev: NavIntent = { dir: "prev" };

const four: Vault = {
  one: ["two"],
  two: ["three"],
  three: ["four"],
  four: [],
};

// ── stepTarget ────────────────────────────────────────────────────────────

describe("stepTarget", () => {
  const deck: DeckInfo = { chain: ["a", "b", "c"], index: 1 };

  it("steps forward and backward inside the chain", async () => {
    expect(stepTarget(deck, next)).toBe("c");
    expect(stepTarget(deck, prev)).toBe("a");
  });

  it("returns null at both ends — no wrap, no note creation", async () => {
    expect(stepTarget({ chain: ["a", "b"], index: 1 }, next)).toBeNull();
    expect(stepTarget({ chain: ["a", "b"], index: 0 }, prev)).toBeNull();
  });

  it("treats a jump to the current index as a no-op", async () => {
    expect(stepTarget(deck, { index: 1 })).toBeNull();
  });

  it("rejects out-of-range jumps", async () => {
    expect(stepTarget(deck, { index: -1 })).toBeNull();
    expect(stepTarget(deck, { index: 3 })).toBeNull();
  });

  it("jumps to an earlier or later slide", async () => {
    expect(stepTarget(deck, { index: 0 })).toBe("a");
    expect(stepTarget(deck, { index: 2 })).toBe("c");
  });

  it("handles a single-slide deck", async () => {
    expect(stepTarget({ chain: ["only"], index: 0 }, next)).toBeNull();
    expect(stepTarget({ chain: ["only"], index: 0 }, prev)).toBeNull();
  });
});

// ── deckFromHead ──────────────────────────────────────────────────────────

describe("deckFromHead", () => {
  it("walks forward from the given head and locates the note", async () => {
    expect(deckFromHint(four, "one", "three")).toEqual({
      chain: ["one", "two", "three", "four"],
      index: 2,
    });
  });

  it("returns null when the note is not reachable from that head", async () => {
    expect(deckFromHint(four, "two", "one")).toBeNull();
  });

  it("keeps a shared-next deck on the branch it started from", async () => {
    const vault: Vault = {
      welcome: ["shared"],
      "probe-image-2": ["shared"],
      shared: ["end"],
      end: [],
    };
    // a fresh resolution picks the first predecessor the vault offers…
    expect(freshDeck(vault, "shared")?.chain).toEqual(["welcome", "shared", "end"]);
    // …but a session that entered from probe-image-2 stays there
    expect(deckFromHint(vault, "probe-image-2", "shared")).toEqual({
      chain: ["probe-image-2", "shared", "end"],
      index: 1,
    });
  });

  it("is cycle-guarded", async () => {
    const looping: Vault = { a: ["b"], b: ["a"] };
    expect(deckFromHint(looping, "a", "b")).toEqual({ chain: ["a", "b"], index: 1 });
  });

  it("reflects slides created after the head was remembered", async () => {
    const vault: Vault = { a1: ["a2"], a2: [] };
    const head = freshDeck(vault, "a1")?.chain[0] ?? null;
    expect(head).toBe("a1");
    vault.a2 = ["a3"]; // a slide was created after a2
    vault.a3 = [];
    expect(deckFromHint(vault, "a1", "a2")).toEqual({
      chain: ["a1", "a2", "a3"],
      index: 1,
    });
  });

  it("reflects a deleted slide without leaving a dead path behind", async () => {
    const vault: Vault = { a1: ["a2"], a2: ["a3"], a3: [] };
    delete vault.a2;
    vault.a1 = ["a3"]; // the delete command splices the chain
    const deck = deckFromHint(vault, "a1", "a3");
    expect(deck).toEqual({ chain: ["a1", "a3"], index: 1 });
    expect(deck?.chain).not.toContain("a2");
  });

  it("yields null for a head that no longer exists", async () => {
    expect(deckFromHint({ a2: [] }, "gone", "a2")).toBeNull();
  });
});

// ── sessionDeck ───────────────────────────────────────────────────────────

describe("sessionDeck", () => {
  it("resolves fresh when the session has no head yet", async () => {
    expect(resolve(four, "two", null)).toEqual({
      chain: ["one", "two", "three", "four"],
      index: 1,
    });
  });

  it("uses the head hint while it still reaches the note", async () => {
    const vault: Vault = { a: ["shared"], b: ["shared"], shared: [] };
    expect(resolve(vault, "shared", "a")).toEqual({ chain: ["a", "shared"], index: 1 });
  });

  it("falls back to a fresh resolution when the hint does not reach the note", async () => {
    const vault: Vault = { a: ["shared"], b: ["shared"], shared: [], other: [] };
    expect(resolve(vault, "other", "a")).toEqual({ chain: ["other"], index: 0 });
  });

  it("falls back when the head hint is gone from the vault", async () => {
    const vault: Vault = { a: ["b"], b: [] };
    expect(resolve(vault, "b", "deleted-head")).toEqual({ chain: ["a", "b"], index: 1 });
  });

  it("returns null without an anchor", async () => {
    expect(
      sessionDeck(
        "head",
        null,
        () => null,
        () => null,
      ),
    ).toBeNull();
  });
});

// ── NavSession: the issue #110 contracts ──────────────────────────────────

describe("NavSession", () => {
  it("advances one slide per press — a burst no longer collapses", async () => {
    const run = await driveSession(
      four,
      "one",
      Array.from({ length: 6 }, () => next),
    );
    expect(run.visited).toEqual(["two", "three", "four"]);
    expect(run.path).toBe("four");
    expect(run.opened).toEqual(["two", "three", "four"]);
  });

  it("keeps one open per press, in order, and ignores presses past the end", async () => {
    const run = await driveSession(
      four,
      "three",
      Array.from({ length: 5 }, () => next),
    );
    expect(run.opened).toEqual(["four"]);
  });

  it("walks back and forth one slide per press", async () => {
    const run = await driveSession(four, "one", [next, next, prev, next]);
    expect(run.visited).toEqual(["two", "three", "two", "three"]);
  });

  it("jumps through the same queue", async () => {
    const run = await driveSession(four, "one", [{ index: 3 }, prev]);
    expect(run.visited).toEqual(["four", "three"]);
  });

  it("stays on the chain it entered when two slides share a next link", async () => {
    const vault: Vault = {
      "probe-image-2": ["shared"],
      welcome: ["shared"],
      shared: ["end"],
      end: [],
    };
    const run = await driveSession(vault, "probe-image-2", [next, prev]);
    expect(run.visited).toEqual(["shared", "probe-image-2"]);
    expect(run.head).toBe("probe-image-2");
  });

  it("re-resolves when the reader is no longer in the session's chain", async () => {
    const vault: Vault = { a1: ["a2"], a2: [], b1: ["b2"], b2: [] };
    const run = await driveSession(vault, "a1", [next]);
    expect(run.path).toBe("a2");
    // a fresh session on the other deck resolves through its own head
    const other = await driveSession(vault, "b1", [next]);
    expect(other.path).toBe("b2");
  });

  it("does nothing without a note to anchor on", async () => {
    const opened: string[] = [];
    const session = new NavSession({
      resolve: () => null,
      open: async (target) => void opened.push(target),
      activePath: () => null,
    });
    session.push(next);
    expect(opened).toEqual([]);
    expect(session.rememberedHead).toBeNull();
  });

  it("drops presses queued behind a failed open", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const opened: string[] = [];
    let failNext = true;
    const session = new NavSession({
      resolve: () => freshDeck(four, "one"),
      open: async (target) => {
        opened.push(target);
        if (failNext) {
          failNext = false;
          throw new Error("open failed");
        }
      },
      activePath: () => "one",
    });
    session.push(next);
    session.push(next);
    session.push(next);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(opened).toEqual(["two"]);
    consoleError.mockRestore();
  });

  it("remembers the head of the chain it walked", async () => {
    const run = await driveSession(four, "two", [next]);
    expect(run.head).toBe("one");
  });
});
