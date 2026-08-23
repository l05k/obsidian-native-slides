/**
 * createNext.ts — Pure "Create Next Slide" planning core for native-slides.
 *
 * Everything in this module is free of Obsidian runtime dependencies so it
 * can be unit tested directly (see test/createNext.test.ts). main.ts adapts
 * the vault (metadataCache, computeDeck) to this pure interface and applies
 * the resulting plan with vault.create() + fileManager.processFrontMatter().
 *
 * v1.0.0 convention — next-only, no overview page: a slide's `deck`
 * property holds at most ONE link (its next slide). The plan decides, for
 * the current note:
 *   - the name of the new slide file (collision-aware),
 *   - the raw `deck` link texts of the new note,
 *   - the rewrites needed on existing notes (in practice always the
 *     current note itself).
 */

import { extractLinkText } from "./deck";

/** Inputs for planning — resolved by the adapter in main.ts */
export interface CreateNextInput {
  /** Basename (without extension) of the current note */
  currentName: string;
  /** Raw `deck` link texts of the current note (extracted, at most one) */
  currentLinks: string[];
  /** Basenames of every markdown note in the vault (collision-free naming) */
  existingNames: Set<string>;
}

/** One note whose `deck` property must be rewritten */
export interface DeckRewrite {
  /** Basename of the note to rewrite */
  name: string;
  /** The new raw `deck` link texts (serialized as a YAML list) */
  deck: string[];
}

/** The full plan for creating one new slide */
export interface CreateNextResult {
  /** Basename (without extension) of the new slide file */
  newName: string;
  /** Raw `deck` link texts for the new note's frontmatter */
  newDeckLinks: string[];
  /** Rewrites to apply to existing notes (in practice always the current note) */
  rewrites: DeckRewrite[];
}

/**
 * Plan the creation of a new slide after the current note.
 *
 * Behaviors:
 *   - No next link (last slide, fresh deck head, or a plain note starting
 *     a brand-new deck): append `<current>-next` as the new last slide; the
 *     current note's `deck` gains the link to it.
 *   - Valid next link: insert `<current>-next` between the current note and
 *     its next; the new note takes over the old next link.
 *   - Broken next link (plain, non-existing name): create exactly the
 *     declared missing note as the new next slide — the ⚠ warning
 *     disappears and the author's intent is honoured. A broken link that is
 *     not a plain basename (path-qualified, self-referencing) is treated as
 *     invalid and dropped (append a `<current>-next` last slide instead).
 */
export function planCreateNext(input: CreateNextInput): CreateNextResult | null {
  const { currentName, currentLinks } = input;
  const nextLink = currentLinks[0];

  if (nextLink) {
    const nextName = extractLinkText(nextLink);
    if (nextName && isPlainName(nextName) && nextName !== currentName) {
      if (!input.existingNames.has(nextName)) {
        // The declared next note does not exist yet → create exactly that
        // note (fixes the broken-link warning, honours the author's intent).
        return { newName: nextName, newDeckLinks: [], rewrites: [] };
      }
      // A valid next note exists → insert between it and the current note.
      const newName = uniqueName(`${currentName}-next`, input.existingNames);
      return {
        newName,
        newDeckLinks: [nextLink],
        rewrites: [{ name: currentName, deck: [`[[${newName}]]`] }],
      };
    }
    // Invalid (path-qualified / self-referencing) next link → drop it and
    // append a new last slide (fall through to the no-next branch).
  }

  // ── No (usable) next link → append a new last slide ───────────────────
  const newName = uniqueName(`${currentName}-next`, input.existingNames);
  return {
    newName,
    newDeckLinks: [],
    rewrites: [{ name: currentName, deck: [`[[${newName}]]`] }],
  };
}

/** A name usable as a vault note name: no path separators, non-empty */
function isPlainName(name: string): boolean {
  return name.length > 0 && !name.includes("/") && !name.includes("\\");
}

/** First free name in the family `base`, `base-2`, `base-3`, … */
function uniqueName(base: string, existing: Set<string>): string {
  if (!existing.has(base)) return base;
  for (let i = 2; ; i++) {
    const candidate = `${base}-${i}`;
    if (!existing.has(candidate)) return candidate;
  }
}
