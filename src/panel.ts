import { ItemView, Menu, TFile, WorkspaceLeaf } from "obsidian";
import type NativeSlidesPlugin from "../main";
import { ConfirmDeleteModal } from "./confirm-delete";
import { PanelDrag } from "./panel-drag";
import { planReorder, stepInsertAt, type ReorderPlan } from "./reorder";

/** View type id of the slides sidebar panel */
export const SLIDES_PANEL_VIEW = "native-slides-panel";

/**
 * Sidebar panel listing every slide of the active note's deck (next-only
 * chain order). Takes over the aggregation/entry role the overview page
 * used to play before v1.0.0.
 *
 * Interaction:
 *   - click            → open that slide (and clear any selection)
 *   - Mod+click        → toggle the item in the selection
 *   - Shift+click      → extend the selection from the last anchor
 *   - drag             → move the slide to a gap (the whole selection, when the
 *                        grabbed slide is part of one) — see src/panel-drag.ts
 *   - right-click      → context menu: Move up / Move down / Create next slide /
 *                        Delete slide(s)
 */
export class SlidesPanelView extends ItemView {
  /** Chain signature of the currently rendered list */
  private lastChain: string[] = [];
  /** Rendered item elements, index-aligned with lastChain */
  private items: { path: string; el: HTMLElement }[] = [];
  /** Currently selected slide paths (multi-select for Delete) */
  private selected = new Set<string>();
  /** Selection anchor for Shift+click range extension */
  private anchor: string | null = null;
  /** The drag-to-reorder gesture (pointer handling only — no deck knowledge) */
  private drag: PanelDrag;
  /** Whether a reorder is writing frontmatter right now (renders are held back) */
  private writing = false;

  constructor(
    private plugin: NativeSlidesPlugin,
    leaf: WorkspaceLeaf,
  ) {
    super(leaf);
    this.drag = new PanelDrag({
      items: () => this.items,
      movingFor: (path) => this.movingFor(path),
      container: () => this.contentEl,
      onGrab: (path) => this.onGrab(path),
      willChange: (moving, insertAt) => this.willChange(moving, insertAt),
      onDrop: (moving, insertAt, snapshot) => void this.applyReorder(moving, insertAt, snapshot),
    });
  }

  getViewType(): string {
    return SLIDES_PANEL_VIEW;
  }

  getDisplayText(): string {
    return "Slides";
  }

  getIcon(): string {
    return "presentation";
  }

  async onOpen(): Promise<void> {
    this.containerEl.addClass("native-slides-panel");
    this.registerEvent(this.app.workspace.on("file-open", () => this.render()));
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.render()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.render()));
    this.registerEvent(this.app.metadataCache.on("changed", () => this.render()));
    this.registerEvent(this.app.vault.on("rename", () => this.render()));
    this.registerEvent(this.app.vault.on("delete", () => this.render()));
    this.render();
  }

  async onClose(): Promise<void> {
    this.drag.cancel();
    this.contentEl.empty();
    this.lastChain = [];
    this.items = [];
    this.selected.clear();
    this.anchor = null;
  }

  /**
   * Sync the list with the active note's deck. Incremental on purpose: the
   * refresh events also fire while a click on an entry is in flight (the
   * mousedown activates this leaf), and rebuilding the DOM mid-gesture
   * destroys the click target — which made opening a slide take two clicks
   * whenever the panel was not the active leaf. Unchanged chains only get
   * their highlight updated, so item elements always survive.
   */
  private render(): void {
    // A gesture or a reorder owns the DOM: rebuilding the list mid-drag would
    // destroy the elements the gesture is measuring, and the reorder's own
    // writes fire a burst of metadataCache events. Both paths render once more
    // when they are done with it.
    if (this.drag.active || this.writing) return;

    const file = this.app.workspace.getActiveFile();
    const chain = this.liveChain(file);

    // Drop selections whose note vanished from the chain meanwhile
    if (this.selected.size > 0) {
      const live = new Set(chain);
      for (const path of this.selected) if (!live.has(path)) this.selected.delete(path);
    }
    // A dead anchor must not silently turn a Shift+click into a toggle
    if (this.anchor !== null && !chain.includes(this.anchor)) this.anchor = null;

    if (!chainEquals(this.lastChain, chain)) {
      this.rebuild(chain);
    } else {
      for (const it of this.items) it.el.classList.toggle("is-active", it.path === file?.path);
    }
    this.syncSelectionClasses();
  }

  /** The deck chain of `file`, limited to slides that exist right now */
  private liveChain(file: TFile | null): string[] {
    const deck = file ? this.plugin.resolveDeck(file) : null;
    return deck
      ? deck.chain.filter((p) => this.app.vault.getAbstractFileByPath(p) instanceof TFile)
      : [];
  }

  /** Full rebuild (chain shape changed) */
  private rebuild(chain: string[]): void {
    // The items live in the view's own content element — the part Obsidian
    // scrolls and the only part that is ours to empty (emptying containerEl
    // would take the view header with it).
    const root = this.contentEl;
    root.empty();
    this.items = [];
    this.lastChain = chain;

    if (chain.length === 0) {
      const empty = root.createDiv({ cls: "native-slides-panel-empty" });
      empty.setText(
        "No slides deck — open a deck note, or run create next slide on any note to start one.",
      );
      return;
    }

    const activePath = this.app.workspace.getActiveFile()?.path;
    chain.forEach((path, i) => {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof TFile)) return;
      const item = root.createDiv({ cls: "native-slides-panel-item" });
      if (path === activePath) item.addClass("is-active");
      item.createSpan({ cls: "native-slides-panel-num" }).setText(String(i + 1));
      item.createSpan({ cls: "native-slides-panel-title" }).setText(f.basename);
      item.addEventListener("click", (e) => this.onItemClick(e, i, f));
      item.addEventListener("pointerdown", (e) => this.drag.begin(e, path));
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.openContextMenu(e, f);
      });
      this.items.push({ path, el: item });
    });
  }

  /** Click routing: plain = open, Mod = toggle select, Shift = range select */
  private onItemClick(e: MouseEvent, index: number, f: TFile): void {
    // A drag ends with a click on the slide it grabbed — that click moved the
    // slide, it does not open it.
    if (this.drag.consumeClick()) return;
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (e.shiftKey) {
        // Range anchor: the last selected item, or the displayed slide
        // when no usable anchor exists (first Shift+click in a session).
        const activePath = this.app.workspace.getActiveFile()?.path ?? null;
        const anchorPath =
          this.anchor !== null && this.items.some((it) => it.path === this.anchor)
            ? this.anchor
            : activePath;
        const from = this.items.findIndex((it) => it.path === anchorPath);
        if (anchorPath !== null && from !== -1) {
          const [lo, hi] = from < index ? [from, index] : [index, from];
          for (let i = lo; i <= hi; i++) this.selected.add(this.items[i].path);
          // The displayed slide joins every Shift selection — extending a
          // selection never silently drops the page you are looking at.
          if (activePath !== null && this.items.some((it) => it.path === activePath)) {
            this.selected.add(activePath);
          }
          this.anchor = this.items[index].path;
          this.syncSelectionClasses();
          return;
        }
      }
      // Mod (or Shift with no reachable anchor): pure toggle — the only way
      // to cancel an item out of the selection.
      if (this.selected.has(f.path)) this.selected.delete(f.path);
      else this.selected.add(f.path);
      this.anchor = f.path;
      this.syncSelectionClasses();
      return;
    }
    this.selected.clear();
    // No selection after a plain click, but the clicked slide stays the
    // Shift+click anchor — matching the file-explorer feel: pick a slide,
    // then Shift+click a later one to select the whole range between them.
    this.anchor = f.path;
    this.syncSelectionClasses();
    void this.openSlide(f);
  }

  /** Reflect the selection set on the rendered items without a rebuild */
  private syncSelectionClasses(): void {
    for (const it of this.items) it.el.classList.toggle("is-selected", this.selected.has(it.path));
  }

  /**
   * The slides an action on `path` applies to: the whole selection when `path`
   * belongs to it, otherwise just that slide. Chain-ordered, and limited to
   * the slides the deck still holds.
   */
  private movingFor(path: string): string[] {
    if (!this.selected.has(path)) return [path];
    return this.lastChain.filter((p) => this.selected.has(p));
  }

  /** A drag started on `path`: a slide outside the selection is dragged alone */
  private onGrab(path: string): void {
    if (!this.selected.has(path) && this.selected.size > 0) {
      this.selected.clear();
      this.syncSelectionClasses();
    }
    this.anchor = path;
  }

  /** Whether that drop would actually rewire something (a no-op hides the line) */
  private willChange(moving: string[], insertAt: number): boolean {
    const plan = planReorder(this.lastChain, moving, insertAt);
    return plan !== null && plan.rewrites.length > 0;
  }

  /** Move the given slides one step towards `direction` (context menu) */
  private moveStep(moving: string[], direction: "up" | "down"): void {
    const insertAt = stepInsertAt(this.lastChain, moving, direction);
    if (insertAt === null) return;
    void this.applyReorder(moving, insertAt, this.lastChain);
  }

  /**
   * Apply a move: plan it against the live chain, then let the deck service
   * rewire the `deck` links of the slides whose next link changes. `snapshot`
   * is the chain the gesture (or the menu action) was computed against — when
   * the deck changed meanwhile the gap index means nothing, so the move is
   * dropped rather than applied to a deck it no longer describes.
   */
  private async applyReorder(
    moving: string[],
    insertAt: number,
    snapshot: string[],
  ): Promise<void> {
    const chain = this.liveChain(this.app.workspace.getActiveFile());
    if (!chainEquals(chain, snapshot)) return;
    const plan = planReorder(chain, moving, insertAt);
    if (!plan || plan.rewrites.length === 0) return; // nothing moved — write nothing

    const applied = await this.runReorder(plan);
    // A complete run re-bases the navigation session on the reordered chain's
    // head. A failed one leaves a mixed order behind, and the head the session
    // entered may now sit mid-chain — forgetting the hint is what lets the next
    // resolution find the deck's real head again.
    this.plugin.rememberDeckHead(applied ? (plan.chain[0] ?? null) : null);
    this.render();
  }

  /** Run a reorder with the panel's re-rendering held back for its duration */
  private async runReorder(plan: ReorderPlan): Promise<boolean> {
    this.writing = true;
    try {
      return await this.plugin.deckService.executeReorder(plan);
    } finally {
      this.writing = false;
    }
  }

  /** Right-click menu on one item; operates on the whole selection when it belongs to one */
  private openContextMenu(e: MouseEvent, f: TFile): void {
    const menu = new Menu();
    const moving = this.movingFor(f.path);
    const what = moving.length > 1 ? `${moving.length} slides` : "slide";

    // Move up / down act on exactly the set a drag would move, so a selection
    // stays a block; each is disabled when that set already sits at its end.
    const up = stepInsertAt(this.lastChain, moving, "up");
    const down = stepInsertAt(this.lastChain, moving, "down");
    menu.addItem((mi) =>
      mi
        .setTitle(`Move ${what} up`)
        .setIcon("arrow-up")
        .setDisabled(up === null)
        .onClick(() => this.moveStep(moving, "up")),
    );
    menu.addItem((mi) =>
      mi
        .setTitle(`Move ${what} down`)
        .setIcon("arrow-down")
        .setDisabled(down === null)
        .onClick(() => this.moveStep(moving, "down")),
    );
    menu.addItem((mi) =>
      mi
        .setTitle("Create next slide")
        .setIcon("plus")
        .onClick(() => void this.createNextAfter(f)),
    );
    menu.addItem((mi) =>
      mi
        .setTitle(moving.length > 1 ? `Delete ${moving.length} slides` : "Delete slide")
        .setIcon("trash")
        .onClick(() => this.deleteSlides(moving)),
    );
    menu.showAtMouseEvent(e);
  }

  /** Create a slide after the right-clicked one (without opening it) */
  private async createNextAfter(f: TFile): Promise<void> {
    const plan = this.plugin.deckService.planCreateNext(f);
    if (!plan) return;
    await this.plugin.deckService.executeCreateNext(f, plan, false);
    this.render();
  }

  /** Confirm, then trash the given slides and splice them out of the chain */
  private deleteSlides(paths: string[]): void {
    if (paths.length === 0) return;
    const run = (): void => void this.runDeletion(paths);

    if (!this.plugin.settings.confirmDeleteSlides) {
      run();
      return;
    }
    const names = paths.map((p) => {
      const f = this.app.vault.getAbstractFileByPath(p);
      return f instanceof TFile ? f.basename : p;
    });
    new ConfirmDeleteModal(this.app, names, run, async () => {
      this.plugin.settings.confirmDeleteSlides = false;
      await this.plugin.saveSettings();
    }).open();
  }

  private async runDeletion(paths: string[]): Promise<void> {
    const activePath = this.app.workspace.getActiveFile()?.path ?? null;
    const result = await this.plugin.deckService.executeDeleteSlides(
      this.lastChain,
      new Set(paths),
      activePath,
    );

    for (const path of paths) this.selected.delete(path);
    if (this.anchor !== null && paths.includes(this.anchor)) this.anchor = null;

    if (result.landingPath) {
      const f = this.app.vault.getAbstractFileByPath(result.landingPath);
      if (f instanceof TFile) await this.openSlide(f);
      return;
    }
    this.render();
  }

  /** Open a slide in a markdown leaf (never in this panel's own leaf) */
  private async openSlide(f: TFile): Promise<void> {
    const leaf =
      this.app.workspace.getLeavesOfType("markdown")[0] ?? this.app.workspace.getLeaf(true);
    await leaf.openFile(f);
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
  }
}

/** Order-sensitive chain comparison */
function chainEquals(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((p, i) => p === b[i]);
}
