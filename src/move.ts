/**
 * move.ts — Pure "move slides" planning core for native-slides.
 *
 * Free of Obsidian runtime dependencies so it can be unit tested directly
 * (see test/move.test.ts). The adapter in deck-service.ts applies the plan:
 * it rewrites the `deck` properties of the notes whose next link changed.
 *
 * A deck stores no order of its own — the order *is* the next-link chain
 * (see src/deck.ts). Moving slides is therefore a **rewiring**, not a write
 * of a new order property: the moving slides become one block inserted at a
 * gap, and every note whose next link is different afterwards gets
 * rewritten. The head slide needs no marker (it is simply `chain[0]`), and
 * the new last slide ends the chain with `deck: []` — the same shape
 * createNext and deleteSlides write, so nothing else in the plugin has to
 * know that a move happened.
 */

/** One note whose `deck` property must be rewritten */
export interface MoveRewrite {
  /** Vault path of the note to rewrite */
  path: string;
  /**
   * Vault path of the note that should become this note's next slide,
   * or null when the note becomes the new last slide (`deck: []`).
   */
  nextPath: string | null;
}

/** The result of planning a move */
export interface MovePlan {
  /** The chain after the move ([0] = the new head slide) */
  chain: string[];
  /**
   * Notes whose next link differs afterwards, in new chain order. Empty when
   * the drop does not change the order — callers must then write nothing.
   */
  rewrites: MoveRewrite[];
}

/**
 * Plan moving `moving` to the insertion gap `insertAt`.
 *
 * `insertAt` is a **gap** index, not an item index: 0 = before the first
 * slide (the block becomes the new head), `chain.length` = after the last
 * slide (the block becomes the new tail), and any other value `g` = before
 * `chain[g]`. The moving slides are inserted as ONE block in their current
 * chain order, and every slide that is not moving keeps its relative order —
 * so a non-contiguous selection moves as a block
 * (`[1,2,3,4,5]` moving `{2,4}` to the end → `[1,3,5,2,4]`).
 *
 * Returns null when there is nothing to plan: a chain of fewer than two
 * slides, an empty moving set, every slide moving (no anchor left to hang
 * the block from), or an `insertAt` that is not an integer inside
 * `0..chain.length`. Paths in `moving` that are not in the chain are ignored
 * (as in planDeleteSlides). A gap inside the moving block itself is a
 * legitimate no-op: the plan comes back with an unchanged chain and no
 * rewrites, so a drop that changes nothing writes nothing.
 */
export function planMove(
  chain: string[],
  moving: readonly string[],
  insertAt: number,
): MovePlan | null {
  if (chain.length < 2) return null;
  if (!Number.isInteger(insertAt) || insertAt < 0 || insertAt > chain.length) return null;

  const movingSet = new Set(moving);
  const block = chain.filter((path) => movingSet.has(path));
  if (block.length === 0 || block.length === chain.length) return null;

  const rest = chain.filter((path) => !movingSet.has(path));
  // How many non-moving slides precede the gap — that is where the block
  // lands once the moving slides are lifted out of the chain. Counting the
  // survivors (instead of using `insertAt` directly) is what makes a gap
  // inside the block itself resolve to "no move".
  const before = chain.slice(0, insertAt).filter((path) => !movingSet.has(path)).length;
  const next = [...rest.slice(0, before), ...block, ...rest.slice(before)];

  const oldNext = new Map<string, string | null>();
  for (let i = 0; i < chain.length; i++) oldNext.set(chain[i], chain[i + 1] ?? null);

  const rewrites: MoveRewrite[] = [];
  for (let i = 0; i < next.length; i++) {
    const newNext = next[i + 1] ?? null;
    if (oldNext.get(next[i]) !== newNext) rewrites.push({ path: next[i], nextPath: newNext });
  }
  return { chain: next, rewrites };
}

/**
 * The insertion gap for moving `moving` one step towards `direction` — the
 * plan behind the slides panel's Move up / Move down menu items. Returns null
 * when the block already sits at that end of the chain (or `moving` names no
 * chain member at all), which is what lets the caller disable the action.
 */
export function stepInsertAt(
  chain: string[],
  moving: readonly string[],
  direction: "up" | "down",
): number | null {
  const movingSet = new Set(moving);
  const first = chain.findIndex((path) => movingSet.has(path));
  if (first === -1) return null;

  let last = first;
  for (let i = chain.length - 1; i > first; i--) {
    if (movingSet.has(chain[i])) {
      last = i;
      break;
    }
  }

  // One step past the block's far end: for "down" that is the gap after the
  // slide that follows the block (last + 2, since gaps sit between slides).
  if (direction === "up") return first > 0 ? first - 1 : null;
  return last < chain.length - 1 ? last + 2 : null;
}
