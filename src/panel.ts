import { ItemView, Menu, TFile, WorkspaceLeaf } from "obsidian";
import type NativeSlidesPlugin from "../main";
import { ConfirmDeleteModal } from "./confirm-delete";

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
 *   - right-click      → context menu: Create next slide / Delete slide(s)
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

  constructor(
    private plugin: NativeSlidesPlugin,
    leaf: WorkspaceLeaf,
  ) {
    super(leaf);
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
    this.containerEl.empty();
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
    const file = this.app.workspace.getActiveFile();
    const deck = file ? this.plugin.deckService.compute(file) : null;
    const chain = deck
      ? deck.chain.filter((p) => this.app.vault.getAbstractFileByPath(p) instanceof TFile)
      : [];

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

  /** Full rebuild (chain shape changed) */
  private rebuild(chain: string[]): void {
    const root = this.containerEl;
    root.empty();
    this.items = [];
    this.lastChain = chain;

    if (chain.length === 0) {
      const empty = root.createDiv({ cls: "native-slides-panel-empty" });
      empty.setText(
        "No slides deck — open a deck note, or run Create next slide on any note to start one.",
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
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.openContextMenu(e, f);
      });
      this.items.push({ path, el: item });
    });
  }

  /** Click routing: plain = open, Mod = toggle select, Shift = range select */
  private onItemClick(e: MouseEvent, index: number, f: TFile): void {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      if (e.shiftKey && this.anchor !== null) {
        const from = this.items.findIndex((it) => it.path === this.anchor);
        if (from !== -1) {
          const [lo, hi] = from < index ? [from, index] : [index, from];
          for (let i = lo; i <= hi; i++) this.selected.add(this.items[i].path);
          this.anchor = this.items[index].path;
          this.syncSelectionClasses();
          return;
        }
      }
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

  /** Right-click menu on one item; operates on the whole selection when it belongs to one */
  private openContextMenu(e: MouseEvent, f: TFile): void {
    const menu = new Menu();
    menu.addItem((mi) =>
      mi
        .setTitle("Create next slide")
        .setIcon("plus")
        .onClick(() => void this.createNextAfter(f)),
    );
    const targets = this.selected.has(f.path) ? [...this.selected] : [f.path];
    const ordered = this.lastChain.filter((p) => targets.includes(p));
    menu.addItem((mi) =>
      mi
        .setTitle(ordered.length > 1 ? `Delete ${ordered.length} slides` : "Delete slide")
        .setIcon("trash")
        .onClick(() => this.deleteSlides(ordered)),
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
