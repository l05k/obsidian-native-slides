/**
 * nav.ts — Pure navigation core for native-slides.
 *
 * Two rules live here, both free of Obsidian runtime dependencies so they can
 * be unit tested directly (see test/nav.test.ts):
 *
 *   1. A queued press steps from the *previous press's target*, not from the
 *      note the editor happens to show. Without this, every press in a burst
 *      resolves to the same next slide and all but one are swallowed (issue #110).
 *   2. A navigation session stays inside the chain it started in while the note
 *      it is on still belongs to that chain. Re-resolving the deck on every step
 *      lets a shared `deck` link — two slides pointing at the same next slide —
 *      swap the chain under the reader, which moves the page number and sends
 *      `Previous page` somewhere else (issue #110).
 */

import type { DeckInfo } from "./deck";

/** One queued navigation request: a direction, or an absolute chain index */
export type NavIntent = { dir: "prev" | "next" } | { index: number };

/**
 * Deck resolution inside a navigation session. Prefers the chain the session is
 * already walking (`remembered`) as long as `anchorPath` belongs to it, and
 * falls back to a fresh resolution (`compute`) otherwise.
 */
export function sessionDeck(
  remembered: readonly string[] | null,
  anchorPath: string | null,
  compute: (path: string) => DeckInfo | null,
): DeckInfo | null {
  if (!anchorPath) return null;
  if (remembered) {
    const index = remembered.indexOf(anchorPath);
    if (index !== -1) return { chain: [...remembered], index };
  }
  return compute(anchorPath);
}

/**
 * Target of one intent inside a resolved deck, or null when it would leave the
 * deck — the first slide has no previous page, the last slide has no next page,
 * and a jump to the current index is a no-op.
 */
export function stepTarget(deck: DeckInfo, intent: NavIntent): string | null {
  const index =
    "index" in intent ? intent.index : intent.dir === "prev" ? deck.index - 1 : deck.index + 1;
  if (index === deck.index || index < 0 || index >= deck.chain.length) return null;
  return deck.chain[index] ?? null;
}

/**
 * Walk queued intents the way the plugin's queue does, but synchronously: each
 * step anchors on the previous step's target, so N presses advance N slides
 * (up to the end of the chain) instead of collapsing into one. Returns the path
 * the reader ends on plus the slides visited along the way.
 *
 * This is the contract the runtime queue implements with real `await`ed opens;
 * keeping it pure is what makes "a burst of presses" testable.
 */
export function walkIntents(
  startPath: string,
  intents: readonly NavIntent[],
  compute: (path: string) => DeckInfo | null,
  remembered: readonly string[] | null = null,
): { path: string; visited: string[]; chain: string[] | null } {
  let anchor = startPath;
  let chain = remembered ? [...remembered] : null;
  const visited: string[] = [];

  for (const intent of intents) {
    const deck = sessionDeck(chain, anchor, compute);
    if (!deck) break;
    chain = deck.chain;
    const target = stepTarget(deck, intent);
    if (!target) continue; // boundary — the press is a no-op, the anchor stays
    anchor = target;
    visited.push(target);
  }

  return { path: anchor, visited, chain };
}
