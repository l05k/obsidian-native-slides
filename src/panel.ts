import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import type NativeSlidesPlugin from "../main";

/** View type id of the slides sidebar panel */
export const SLIDES_PANEL_VIEW = "native-slides-panel";

/**
 * Sidebar panel listing every slide of the active note's deck (next-only
 * chain order). Takes over the aggregation/entry role the overview page
 * used to play before v1.0.0. Clicking an entry opens that slide.
 */
export class SlidesPanelView extends ItemView {
  /** Chain signature of the currently rendered list */
  private lastChain: string[] = [];
  /** Rendered item elements, index-aligned with lastChain */
  private items: { path: string; el: HTMLElement }[] = [];

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

    if (!chainEquals(this.lastChain, chain)) {
      this.rebuild(chain);
    } else {
      for (const it of this.items) it.el.classList.toggle("is-active", it.path === file?.path);
    }
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
      item.addEventListener("click", () => this.openSlide(f));
      this.items.push({ path, el: item });
    });
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
