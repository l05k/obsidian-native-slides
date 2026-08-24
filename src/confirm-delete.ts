import { App, Modal, Setting } from "obsidian";

/**
 * Confirmation dialog for Delete slides. Lists the notes about to be
 * trashed and offers a "don't ask again" checkbox that flips the
 * `confirmDeleteSlides` setting off (persisted by the caller via onDontAsk).
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

    const label =
      this.names.length === 1 ? "Delete this slide?" : `Delete ${this.names.length} slides?`;
    this.contentEl.createEl("h3", { text: label });

    const list = this.contentEl.createDiv({ cls: "native-slides-confirm-delete-list" });
    for (const name of this.names) list.createDiv().setText(name);

    new Setting(this.contentEl).setName("Don't ask again").addToggle((toggle) =>
      toggle.setValue(false).onChange(async () => {
        await this.onDontAsk();
        toggle.setDisabled(true);
      }),
    );

    new Setting(this.contentEl)
      .addButton((btn) => btn.setButtonText("Cancel").onClick(() => this.close()))
      .addButton((btn) =>
        btn
          .setButtonText("Delete")
          .setWarning()
          .onClick(() => {
            this.confirmed = true;
            this.close();
          }),
      );
  }

  onClose(): void {
    this.contentEl.empty();
    if (this.confirmed) this.onConfirm();
  }
}
