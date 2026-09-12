/**
 * panel-drag.ts — the pointer gesture behind "drag a slide to reorder it".
 *
 * The slides panel owns the deck model (what a drop *means*); this module owns
 * only the gesture: it decides when a press becomes a drag, paints the ghost
 * and the insertion line, scrolls the list when the pointer reaches its edge,
 * and hands the panel a single commit — `onDrop(moving, insertAt, snapshot)`.
 * It never writes to the vault and knows nothing about `deck` links.
 *
 * Obsidian's public API has no drag-to-reorder helper a custom view could use
 * (the declarative settings list's `onReorder` renders inside the settings
 * modal only), so the gesture is built on pointer events: `pointerdown` on an
 * item, a movement threshold before anything happens (a plain press must stay
 * a plain click, which opens the slide), then `pointermove` / `pointerup` /
 * `pointercancel` on `document`, with `Escape` and window blur as cancels.
 *
 * Two details are load-bearing:
 *   - the **insertion line** is hidden when the drop would not change the
 *     order (`willChange`), so a no-op drop reads as a no-op *before* the
 *     button is released;
 *   - the drop carries the **chain snapshot** the gesture started on, so the
 *     panel can refuse a drop whose gap index no longer describes the deck
 *     (the deck can change under the gesture — an edit in another pane, a
 *     rename, a delete).
 */

/** Px the pointer must travel before a press counts as a drag rather than a click */
const DRAG_THRESHOLD = 4;
/** Px band at the list's top/bottom edge that scrolls while the pointer sits in it */
const EDGE_BAND = 24;
/** Px scrolled per animation frame while the pointer sits in an edge band */
const EDGE_SPEED = 8;

/** A rendered slide of the list */
export interface DragItem {
  path: string;
  el: HTMLElement;
}

/** What the gesture needs from the panel, which owns the deck model */
export interface DragHost {
  /**
   * The rendered slides, **index-aligned with the chain** (item `i` is slide
   * `i`) — the gesture reads the geometry from these elements. Never mutated
   * by the gesture.
   */
  items(): readonly DragItem[];
  /** The slides a grab on `path` moves: the selection block, or that slide alone */
  movingFor(path: string): string[];
  /** The scrollable list element (edge auto-scroll) */
  container(): HTMLElement | null;
  /** The user grabbed `path`: the panel drops a selection it is not part of */
  onGrab(path: string): void;
  /** Whether that drop would change the order (a no-op hides the insertion line) */
  willChange(moving: string[], insertAt: number): boolean;
  /** Commit a drop; `snapshot` is the chain the gesture started on */
  onDrop(moving: string[], insertAt: number, snapshot: string[]): void;
}

/** Gesture state, created once the pointer passes the threshold */
interface DragState {
  /** The slides being moved, in chain order */
  moving: string[];
  /** The rendered chain when the gesture started (the drop's frame of reference) */
  chain: string[];
  /** Pointer y of the last move — the ghost and the insertion line follow it */
  y: number;
  /** Offset of the pointer inside the grabbed item, kept by the ghost */
  offsetY: number;
  /** The gap the drop would land in, recomputed by every paint */
  insertAt: number;
  /** Clone of the grabbed item that follows the pointer */
  ghost: HTMLElement | null;
  /** The 2px line marking the drop gap */
  line: HTMLElement;
  /** Handle of the auto-scroll animation frame */
  raf: number;
}

/** Drag-to-reorder gesture for a list of rendered items */
export class PanelDrag {
  /** A press that has not travelled far enough to be a drag yet */
  private press: { x: number; y: number; path: string } | null = null;
  /** The drag in flight, or null while the press is still a candidate */
  private state: DragState | null = null;
  /** Whether the last finished gesture was a drag — swallows the click it ends with */
  private dragged = false;

  constructor(private readonly host: DragHost) {}

  /** Whether a drag is in flight (the panel suspends re-rendering meanwhile) */
  get active(): boolean {
    return this.state !== null;
  }

  /** Abandon the gesture — the view is closing under it */
  cancel(): void {
    this.finish(true);
  }

  /** A press on an item; it becomes a drag once the pointer travels far enough */
  begin(event: PointerEvent, path: string): void {
    if (event.button !== 0 || this.press || this.state) return;
    if (this.host.items().length < 2) return; // a lone slide has nowhere to go
    this.dragged = false;
    this.press = { x: event.clientX, y: event.clientY, path };
    document.addEventListener("pointermove", this.onMove);
    document.addEventListener("pointerup", this.onUp);
    document.addEventListener("pointercancel", this.onCancel);
    document.addEventListener("keydown", this.onKey, true);
    window.addEventListener("blur", this.onCancel);
  }

  /**
   * Whether the click that ends this gesture belongs to a drag. True at most
   * once per drag, so a drag does not also open the slide it moved; a plain
   * press-release never sets it.
   */
  consumeClick(): boolean {
    const dragged = this.dragged;
    this.dragged = false;
    return dragged;
  }

  private readonly onMove = (event: PointerEvent): void => {
    const press = this.press;
    if (!press) return;
    if (!this.state) {
      if (Math.hypot(event.clientX - press.x, event.clientY - press.y) < DRAG_THRESHOLD) return;
      this.start(event, press);
      return;
    }
    this.state.y = event.clientY;
    this.paint();
  };

  private readonly onUp = (): void => this.finish(false);

  private readonly onCancel = (): void => this.finish(true);

  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") this.finish(true);
  };

  /** Turn the candidate press into a drag: ghost, dimmed items, insertion line */
  private start(event: PointerEvent, press: { y: number; path: string }): void {
    const moving = this.host.movingFor(press.path);
    if (moving.length === 0) {
      this.finish(true);
      return;
    }

    const grabbed = this.host.items().find((it) => it.path === press.path);
    const rect = grabbed?.el.getBoundingClientRect();
    const line = createDiv({ cls: "native-slides-panel-drop-line" });
    line.setCssStyles({ display: "none" });
    document.body.appendChild(line);

    let ghost: HTMLElement | null = null;
    if (grabbed && rect) {
      ghost = grabbed.el.cloneNode(true) as HTMLElement;
      ghost.classList.remove("is-active", "is-selected", "is-dragging");
      ghost.addClass("native-slides-panel-drag-ghost");
      ghost.setCssStyles({
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
      });
      document.body.appendChild(ghost);
    }

    const movingSet = new Set(moving);
    for (const item of this.host.items()) {
      if (movingSet.has(item.path)) item.el.addClass("is-dragging");
    }
    document.body.addClass("native-slides-dragging");
    // A press may already have started selecting text — a drag is not a selection
    window.getSelection()?.removeAllRanges();
    this.host.onGrab(press.path);

    this.state = {
      moving,
      chain: this.host.items().map((it) => it.path),
      y: event.clientY,
      offsetY: rect ? event.clientY - rect.top : 0,
      insertAt: 0,
      ghost,
      line,
      raf: window.requestAnimationFrame(this.scrollTick),
    };
    this.paint();
  }

  /** End the gesture: commit a real drop, or clean up after a cancel */
  private finish(cancelled: boolean): void {
    const state = this.state;
    this.press = null;
    this.state = null;
    document.removeEventListener("pointermove", this.onMove);
    document.removeEventListener("pointerup", this.onUp);
    document.removeEventListener("pointercancel", this.onCancel);
    document.removeEventListener("keydown", this.onKey, true);
    window.removeEventListener("blur", this.onCancel);
    if (!state) return;

    // Even a cancelled drag must swallow its click: releasing the button after
    // Escape would otherwise open the slide that was dragged.
    this.dragged = true;
    state.ghost?.remove();
    state.line.remove();
    const movingSet = new Set(state.moving);
    for (const item of this.host.items()) {
      if (movingSet.has(item.path)) item.el.removeClass("is-dragging");
    }
    document.body.removeClass("native-slides-dragging");
    window.cancelAnimationFrame(state.raf);

    if (!cancelled) this.host.onDrop(state.moving, state.insertAt, state.chain);
  }

  /** Move the ghost to the pointer and the insertion line to the nearest gap */
  private paint(): void {
    const state = this.state;
    if (!state) return;

    // Read every rect BEFORE writing the ghost's position: a write first would
    // make each of these reads force a synchronous layout of the panel.
    // The gaps are the items' edges — the top of each slide, plus the bottom of
    // the last one (which closes the list).
    const rects = this.host.items().map((it) => it.el.getBoundingClientRect());
    const edges = rects.map((rect) => rect.top);
    const last = rects[rects.length - 1];
    if (last) edges.push(last.bottom);

    let best = Number.POSITIVE_INFINITY;
    for (let gap = 0; gap < edges.length; gap++) {
      const distance = Math.abs(state.y - edges[gap]);
      if (distance < best) {
        best = distance;
        state.insertAt = gap;
      }
    }

    const gap = state.insertAt;
    const ref = gap < rects.length ? rects[gap] : last;
    state.ghost?.setCssStyles({ top: `${state.y - state.offsetY}px` });
    if (!ref || !this.host.willChange(state.moving, gap)) {
      state.line.setCssStyles({ display: "none" });
      return;
    }
    state.line.setCssStyles({
      display: "",
      top: `${gap < rects.length ? ref.top : ref.bottom}px`,
      left: `${ref.left + 6}px`,
      width: `${Math.max(0, ref.width - 12)}px`,
    });
  }

  /** Keep the list scrolling while the pointer sits in an edge band */
  private readonly scrollTick = (): void => {
    const state = this.state;
    if (!state) return;
    const container = this.host.container();
    if (container) {
      const rect = container.getBoundingClientRect();
      const dy =
        state.y < rect.top + EDGE_BAND
          ? -EDGE_SPEED
          : state.y > rect.bottom - EDGE_BAND
            ? EDGE_SPEED
            : 0;
      if (dy !== 0) {
        const before = container.scrollTop;
        container.scrollTop = before + dy;
        if (container.scrollTop !== before) this.paint();
      }
    }
    state.raf = window.requestAnimationFrame(this.scrollTick);
  };
}
