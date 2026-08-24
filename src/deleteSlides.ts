/**
 * deleteSlides.ts — Pure "Delete slides" planning core for native-slides.
 *
 * Free of Obsidian runtime dependencies so it can be unit tested directly
 * (see test/deleteSlides.test.ts). The adapter in deck-service.ts applies
 * the plan: it rewrites the surviving notes' `deck` properties, then moves
 * the deleted notes to the trash.
 *
 * Deletion splices the chain instead of breaking it: every maximal run of
 * deleted slides between two survivors A → … → B is repaired by pointing
 * A's `deck` link at B (`[]` when the run reaches the end of the chain).
 * When a run starts at the chain head, the first survivor becomes the new
 * head and needs no rewrite at all (its own `deck` already points onward).
 */

/** One surviving note whose `deck` property must be rewritten */
export interface DeleteRewrite {
  /** Vault path of the note to rewrite */
  path: string;
  /**
   * Vault path of the note that should become this note's next slide,
   * or null when the note becomes the new last slide (`deck: []`).
   */
  nextPath: string | null;
}

/**
 * Plan the deletion of slides from an ordered deck chain.
 *
 * `chain` is the full slide order ([0] = head). Only paths present in the
 * chain are considered; anything else in `deletePaths` is ignored. Returns
 * one rewrite per surviving note that directly preceded a deleted run,
 * ordered by chain position. Deleting nothing yields no rewrites; deleting
 * everything yields no rewrites either (no survivors left to repair).
 */
export function planDeleteSlides(
  chain: string[],
  deletePaths: ReadonlySet<string>,
): DeleteRewrite[] {
  const rewrites: DeleteRewrite[] = [];
  for (let i = 0; i < chain.length; i++) {
    const path = chain[i];
    if (!path || deletePaths.has(path)) continue;
    // Find the first survivor after this note's position.
    let j = i + 1;
    while (j < chain.length && deletePaths.has(chain[j])) j++;
    const nextPath = j < chain.length ? chain[j] : null;
    const changed = nextPath !== (chain[i + 1] ?? null);
    if (changed) rewrites.push({ path, nextPath });
  }
  return rewrites;
}

/**
 * Pick where the editor should land after deleting slides: the nearest
 * survivor of `deletedPaths`' neighbourhood around `focusPath` — prefer
 * the closest survivor after it, else the closest before it. Returns null
 * when `focusPath` survives or nothing nearby remains.
 */
export function pickLandingPath(
  chain: string[],
  deletePaths: ReadonlySet<string>,
  focusPath: string | null,
): string | null {
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
