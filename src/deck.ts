/**
 * deck.ts — Pure deck-resolution core for native-slides.
 *
 * Everything in this module is free of Obsidian runtime dependencies so it
 * can be unit tested directly (see test/deck.test.ts). main.ts adapts the
 * vault (metadataCache) to this pure interface: it resolves `deck`
 * properties to note paths, then hands the path graph to computeDeck().
 */

/** A deck link list holds at most one entry (the next slide) */
export const MAX_DECK_LINKS = 1;

/** Result of resolving a note's position inside a deck */
export interface DeckInfo {
  /** Chain of note paths: [0] is the first slide, then the rest in order */
  chain: string[];
  /** Index of the current note inside chain */
  index: number;
}

/**
 * Resolve a note's position inside its deck.
 *
 * v1.0.0 convention — next-only, no overview page:
 *   - a slide's `deck` property holds at most ONE link: the next slide
 *     (the last slide has no link at all);
 *   - a deck is simply a forward link chain starting at its head slide;
 *   - any note that holds a `deck` property (even empty) is a deck member,
 *     so a single freshly created slide already counts as a one-page deck.
 *
 * Because slides no longer link back to a head note, the chain head is
 * located by walking backward: `getPrev(path)` returns the note whose
 * `deck` property points at `path` (undefined when none).
 *
 * `getLinks(path)` must return the resolved note paths of the `deck`
 * property of the note at `path` (empty when the note has none, or its
 * link is broken — a broken link simply ends the chain, never crashes).
 *
 * Returns the full chain and the current note's index, or null when the
 * note is not part of any deck (no `deck` property and nobody links to it).
 */
export function computeDeck(
  currentPath: string,
  getLinks: (path: string) => string[],
  getPrev: (path: string) => string | undefined,
): DeckInfo | null {
  // Walk backward to the chain head (cycle-guarded). A lone node (no own
  // link, no predecessor) resolves as a one-page chain — whether it counts
  // as a deck member at all is decided by the adapter (the `deck` key).
  const backVisited = new Set<string>([currentPath]);
  let head = currentPath;
  for (;;) {
    const prev = getPrev(head);
    if (!prev || backVisited.has(prev)) break;
    backVisited.add(prev);
    head = prev;
  }

  // Walk forward from the head (cycle-guarded).
  const chain: string[] = [];
  const visited = new Set<string>();
  let cur: string | undefined = head;
  while (cur && !visited.has(cur)) {
    visited.add(cur);
    chain.push(cur);
    cur = getLinks(cur)[0];
  }

  const index = chain.indexOf(currentPath);
  if (index === -1) return null;
  return { chain, index };
}

/**
 * Extract up to `max` note names from a `deck` property value.
 * Accepts a single string or a YAML list of strings; unquoted [[x]] values
 * are parsed by YAML as nested arrays and flattened here.
 */
export function extractLinks(value: unknown, max: number = MAX_DECK_LINKS): string[] {
  const flat: unknown[] = [];
  const collect = (v: unknown): void => {
    if (Array.isArray(v)) {
      for (const item of v) collect(item);
    } else {
      flat.push(v);
    }
  };
  collect(value);

  const out: string[] = [];
  for (const item of flat) {
    const name = extractLinkText(item);
    if (name) out.push(name);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Extract up to `max` raw link strings from a `deck` property value — the
 * trimmed values exactly as written (alias / path forms preserved). Same
 * flattening rules as extractLinks(), but without extracting the target name.
 */
export function extractRawLinks(value: unknown, max: number = MAX_DECK_LINKS): string[] {
  const flat: unknown[] = [];
  const collect = (v: unknown): void => {
    if (Array.isArray(v)) {
      for (const item of v) collect(item);
    } else {
      flat.push(v);
    }
  };
  collect(value);

  const out: string[] = [];
  for (const item of flat) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!trimmed) continue;
    out.push(trimmed);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Extract the target note name from a markdown link string.
 * Handles several shapes:
 *   "[[slide-2]]"        → slide-2
 *   "[[slide-2|alias]]"  → slide-2
 *   "[[slide-2#section]]"→ slide-2
 *   slide-2              → slide-2 (bare filename)
 */
export function extractLinkText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^\[\[/, "").replace(/\]\]$/, "").split("|")[0].split("#")[0].trim();
}

/** Render a property value as readable text: arrays/objects → JSON, else String */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  switch (typeof value) {
    case "string":
      return value;
    case "object":
      try {
        return JSON.stringify(value) ?? "—";
      } catch {
        // circular / un-stringifiable structure — not expected from frontmatter
        return "—";
      }
    case "number":
    case "boolean":
    case "bigint":
      return String(value);
    default:
      // symbol / function — not expected from frontmatter
      return typeof value;
  }
}
