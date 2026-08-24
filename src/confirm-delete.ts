import { App, Modal } from "obsidian";

/** Max names shown in the dialog before collapsing into a "+N more" line */
const MAX_VISIBLE_NAMES = 8;

/**
 * Confirmation dialog for Delete slides. Lists the notes about to be
 * trashed (numbered like the panel, so the user can map them 1:1), offers
 * a "don't ask again" toggle that flips the `confirmDeleteSlides` setting
 * off (persisted by the caller via onDontAsk), and asks for an explicit
 * Cancel / Delete decision.
 */
export class ConfirmDeleteModal extends Modal {
  private confirmed = false;

  constructor(
    app: App,
    private names: string[],
    private onConfirm: () => void,
    private onDontAsk: () => Promise<void>,
  ) {
    super(app);
  }

  onOpen(): void {
    this.contentEl.empty();
    this.modalEl.addClass("native-slides-confirm-delete");

    const count = this.names.length;
    this.contentEl.createEl("h3", {
      cls: "native-slides-confirm-delete-title",
      text: count === 1 ? "Delete this slide?" : `Delete ${count} slides?`,
    });
    this.contentEl
      .createDiv({ cls: "native-slides-confirm-delete-sub" })
      .setText(
        count === 1
          ? "The note will be moved to the trash."
          : "These notes will be moved to the trash.",
      );

    const list = this.contentEl.createDiv({ cls: "native-slides-confirm-delete-list" });
    for (const [i, name] of this.names.slice(0, MAX_VISIBLE_NAMES).entries()) {
      const row = list.createDiv({ cls: "native-slides-confirm-delete-row" });
      row.createSpan({ cls: "native-slides-confirm-delete-num" }).setText(String(i + 1));
      row.createSpan({ cls: "native-slides-confirm-delete-name" }).setText(name);
    }
    if (this.names.length > MAX_VISIBLE_NAMES) {
      list
        .createDiv({ cls: "native-slides-confirm-delete-more" })
        .setText(`… and ${this.names.length - MAX_VISIBLE_NAMES} more`);
    }

    this.buildDontAskRow();
    this.buildActions();
  }

  /** Compact left-aligned "don't ask again" checkbox row */
  private buildDontAskRow(): void {
    const row = this.contentEl.createDiv({ cls: "native-slides-confirm-delete-dontask" });
    row.createEl("label").setText("Don't ask again");
    const checkbox = row.createEl("input", { type: "checkbox" });
    checkbox.addEventListener("change", () => {
      void this.onDontAsk().then(
        () => {
          checkbox.disabled = true;
        },
        () => {
          // keep the checkbox enabled if persisting the preference failed
        },
      );
    });
  }

  /** Right-aligned Cancel / Delete button row */
  private buildActions(): void {
    const actions = this.contentEl.createDiv({ cls: "native-slides-confirm-delete-actions" });
    actions.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    actions
      .createEl("button", { text: "Delete", cls: "mod-warning" })
      .addEventListener("click", () => {
        this.confirmed = true;
        this.close();
      });
  }

  onClose(): void {
    if (this.confirmed) this.onConfirm();
  }
}
