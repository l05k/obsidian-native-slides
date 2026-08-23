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
  }

  /** Rebuild the slide list for the active note's deck */
  private render(): void {
    const root = this.containerEl;
    root.empty();

    const file = this.app.workspace.getActiveFile();
    const deck = file ? this.plugin.deckService.compute(file) : null;

    if (!deck) {
      const empty = root.createDiv({ cls: "native-slides-panel-empty" });
      empty.setText(
        "No slides deck — open a deck note, or run Create next slide on any note to start one.",
      );
      return;
    }

    deck.chain.forEach((path, i) => {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof TFile)) return;
      const item = root.createDiv({ cls: "native-slides-panel-item" });
      if (path === file?.path) item.addClass("is-active");
      const num = item.createSpan({ cls: "native-slides-panel-num" });
      num.setText(String(i + 1));
      item.createSpan({ cls: "native-slides-panel-title" }).setText(f.basename);
      item.addEventListener("click", () => {
        void this.app.workspace.getLeaf(false).openFile(f);
      });
    });
  }
}
