/**
 * nav.ts — Pure navigation core for native-slides.
 *
 * Two rules live here, both free of Obsidian runtime dependencies so they can
 * be unit tested directly (see test/nav.test.ts):
 *
 *   1. A press steps from the *previous press's target*, not from the note the
 *      editor happens to show. Without this, every press in a burst resolves to
 *      the same next slide and all but one are swallowed (issue #110).
 *   2. A session keeps the chain *head* it entered while that head still reaches
 *      the note in the editor. The head is a hint, not a cached chain: the chain
 *      is walked live on every resolution, so slides created, deleted or renamed
 *      meanwhile are honoured (`deckFromHead()`), and a hint that no longer leads
 *      to the current note is ignored. Re-resolving the head on every step is what
 *      used to let a shared `deck` link — two slides declaring the same next
 *      slide — swap the chain under the reader (issue #110).
 */

import type { DeckInfo } from "./deck";

/** One queued navigation request: a direction, or an absolute chain index */
export type NavIntent = { dir: "prev" | "next" } | { index: number };

/**
 * Deck resolution inside a navigation session: walk live from the session's head
 * hint when it still reaches `anchorPath`, and fall back to a fresh resolution
 * (`compute`, which finds its own head) otherwise.
 */
export function sessionDeck(
  head: string | null,
  anchorPath: string | null,
  fromHead: (head: string, path: string) => DeckInfo | null,
  compute: (path: string) => DeckInfo | null,
): DeckInfo | null {
  if (!anchorPath) return null;
  if (head) {
    const deck = fromHead(head, anchorPath);
    if (deck) return deck;
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

/** What the session needs from the editor, injected so the queue stays testable */
export interface NavHooks {
  /** Live deck for `path`, honouring the session's head hint */
  resolve: (path: string, head: string | null) => DeckInfo | null;
  /** Open `target` (the promise resolving once the editor switched to it) */
  open: (target: string, from: string) => Promise<void>;
  /** The note in the editor, used as the anchor when the session has none */
  activePath: () => string | null;
}

/**
 * The queue behind prev / next / jump. Presses are applied one awaited open at a
 * time so a burst advances one slide per press, and each step is anchored on the
 * previous step's target rather than on the note the editor still shows.
 */
export class NavSession {
  private queue: NavIntent[] = [];
  private running = false;
  private pending: string | null = null;
  private head: string | null = null;

  constructor(private readonly hooks: NavHooks) {}

  /** The chain head this session entered, or null before its first step */
  get rememberedHead(): string | null {
    return this.head;
  }

  /** Queue a press; the first one starts the drain. Resolves once the queue is empty. */
  push(intent: NavIntent): Promise<void> {
    this.queue.push(intent);
    if (this.running) return this.draining ?? Promise.resolve();
    this.draining = this.drain().catch((error: unknown) => {
      console.error("native-slides: navigation failed", error);
    });
    return this.draining;
  }

  /** Resolves when the queue has drained (the promise `push()` returns) */
  private draining: Promise<void> | null = null;

  private async drain(): Promise<void> {
    this.running = true;
    try {
      while (this.queue.length > 0) {
        const intent = this.queue.shift();
        if (!intent) break;
        const from = this.pending ?? this.hooks.activePath();
        if (!from) continue; // no note to anchor on — drop the press
        const deck = this.hooks.resolve(from, this.head);
        if (!deck) continue; // no longer a deck note — drop the press
        this.head = deck.chain[0] ?? this.head; // remember the chain walked
        const target = stepTarget(deck, intent);
        if (!target) continue; // first/last slide — the press is a no-op
        this.pending = target;
        await this.hooks.open(target, from);
      }
    } catch (error) {
      // Presses queued behind a failed open are stale: replaying them later would
      // move the reader from wherever they end up, not from where they were.
      this.queue.length = 0;
      throw error;
    } finally {
      this.pending = null; // queue drained: the editor is authoritative again
      this.running = false;
    }
  }
}
