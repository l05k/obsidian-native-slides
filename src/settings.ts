import { PluginSettingTab, Setting, type SettingDefinitionItem } from "obsidian";
import type NativeSlidesPlugin from "../main";
import { SLIDES_THEMES } from "./types";

/**
 * Settings tab: toggles the nav buttons, page number, auto-enter and bar
 * visibility. Declarative definitions (Obsidian ≥ 1.13.0, searchable in the
 * settings modal) with an imperative `display()` fallback for older versions.
 */
export class NativeSlidesSettingTab extends PluginSettingTab {
  constructor(private plugin: NativeSlidesPlugin) {
    super(plugin.app, plugin);
  }

  /** Declarative settings (Obsidian ≥ 1.13.0) — searchable by the settings modal. */
  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        name: "Style template",
        desc: "Built-in look for the slides card and slides bar (border, background, shadow, bar styling). Every template adapts to light and dark themes.",
        control: {
          key: "slidesTheme",
          type: "dropdown",
          options: Object.fromEntries(SLIDES_THEMES.map((t) => [t.id, t.label])),
        },
      },
      {
        name: "Show slides bar",
        desc: "Master toggle for the entire slides bar at the bottom of the window",
        control: { key: "showSlidesBar", type: "toggle" },
      },
      {
        name: "Show previous/next buttons",
        desc: "Show ◀ ▶ buttons on the left of the slides bar when the note belongs to a deck (has a `deck` property)",
        control: { key: "showNavButtons", type: "toggle" },
      },
      {
        name: "Page number style",
        desc: 'Shown at the bottom-right. "n / total": 1-based over the whole deck chain (head slide = 1). "n": just the current page number. "none": hidden.',
        control: {
          key: "pageNumberStyle",
          type: "dropdown",
          options: {
            fraction: "N / Total",
            current: "N",
            none: "None",
          },
        },
      },
      {
        name: "Show progress bar",
        desc: "Discrete clickable segments at the top of the slides bar -- one per slide, click to jump",
        control: { key: "showProgress", type: "toggle" },
      },
      {
        name: "Auto-enter slides mode",
        desc: "Open deck notes directly in Slides mode. Leave off to enter manually with the Toggle Slides Mode command (Mod+Shift+E) or the previous/next page hotkeys.",
        control: { key: "autoEnterSlides", type: "toggle" },
      },
      {
        name: "Escape exits slides mode",
        desc: "Press escape to leave slides mode and return to the previous view",
        control: { key: "escExitsSlides", type: "toggle" },
      },
      {
        name: "Slides title",
        desc: "Frontmatter property to show as the card title (H1). Leave empty for none; type `filename` to use the file name — that title is editable (renames the note); property-backed titles are read-only (edit the property outside slides mode).",
        control: { key: "slidesTitle", type: "text", placeholder: "E.g. Title" },
      },
      {
        name: "Bar properties",
        desc: "Comma-separated frontmatter property names to show in the slides bar (e.g. `university, short-title, date`). Each value fills an equal-width column; drag dividers to resize. Leave empty to show nothing.",
        control: { key: "barProperties", type: "text", placeholder: "E.g. University, date" },
      },
      {
        name: "Confirm slide deletion",
        desc: "Ask for confirmation before deleting slides from the slides panel's right-click menu. Deletion moves slides to the trash.",
        control: { key: "confirmDeleteSlides", type: "toggle" },
      },
      {
        name: "Navigation hotkeys",
        desc: "Default: Previous page mod+shift+←, next page mod+shift+→. Rebind under settings → hotkeys.",
        action: () => {
          // Open Obsidian's hotkeys settings page (internal API; ignore failures)
          (
            this.app as unknown as { setting?: { openTabById?: (id: string) => void } }
          ).setting?.openTabById?.("hotkeys");
        },
      },
    ];
  }

  /** Persist control changes, then refresh the bar so the new setting applies. */
  setControlValue(key: string, value: unknown): void {
    void this.applyControlValue(key, value);
  }

  private async applyControlValue(key: string, value: unknown): Promise<void> {
    (this.plugin.settings as unknown as Record<string, unknown>)[key] = value;
    await this.plugin.saveSettings();
    this.plugin.refresh();
  }

  /** Imperative fallback for Obsidian < 1.13.0 (not called with definitions present). */
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Style template")
      .setDesc(
        "Built-in look for the slides card and slides bar (border, background, shadow, bar styling). Every template adapts to light and dark themes.",
      )
      .addDropdown((dropdown) => {
        for (const t of SLIDES_THEMES) dropdown.addOption(t.id, t.label);
        dropdown.setValue(this.plugin.settings.slidesTheme).onChange(async (value) => {
          this.plugin.settings.slidesTheme = value;
          await this.plugin.saveSettings();
          this.plugin.refresh();
        });
      });

    new Setting(containerEl)
      .setName("Show slides bar")
      .setDesc("Master toggle for the entire slides bar at the bottom of the window")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showSlidesBar).onChange(async (value) => {
          this.plugin.settings.showSlidesBar = value;
          await this.plugin.saveSettings();
          this.plugin.refresh();
        }),
      );

    new Setting(containerEl)
      .setName("Show previous/next buttons")
      .setDesc(
        "Show ◀ ▶ buttons on the left of the slides bar when the note belongs to a deck (has a `deck` property)",
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showNavButtons).onChange(async (value) => {
          this.plugin.settings.showNavButtons = value;
          await this.plugin.saveSettings();
          this.plugin.refresh();
        }),
      );

    new Setting(containerEl)
      .setName("Page number style")
      .setDesc(
        'Shown at the bottom-right. "n / total": 1-based over the whole deck chain (head slide = 1). "n": just the current page number. "none": hidden.',
      )
      .addDropdown((dropdown) =>
        dropdown
          .addOptions({
            fraction: "N / Total",
            current: "N",
            none: "None",
          })
          .setValue(this.plugin.settings.pageNumberStyle)
          .onChange(async (value) => {
            this.plugin.settings.pageNumberStyle = value as "fraction" | "current" | "none";
            await this.plugin.saveSettings();
            this.plugin.refresh();
          }),
      );

    new Setting(containerEl)
      .setName("Show progress bar")
      .setDesc(
        "Discrete clickable segments at the top of the slides bar -- one per slide, click to jump",
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showProgress).onChange(async (value) => {
          this.plugin.settings.showProgress = value;
          await this.plugin.saveSettings();
          this.plugin.refresh();
        }),
      );

    new Setting(containerEl)
      .setName("Auto-enter slides mode")
      .setDesc(
        "Open deck notes directly in Slides mode. Leave off to enter manually with the Toggle Slides Mode command (Mod+Shift+E) or the previous/next page hotkeys.",
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoEnterSlides).onChange(async (value) => {
          this.plugin.settings.autoEnterSlides = value;
          await this.plugin.saveSettings();
          this.plugin.refresh();
        }),
      );

    new Setting(containerEl)
      .setName("Escape exits slides mode")
      .setDesc("Press escape to leave slides mode and return to the previous view")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.escExitsSlides).onChange(async (value) => {
          this.plugin.settings.escExitsSlides = value;
          await this.plugin.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName("Slides title")
      .setDesc(
        "Frontmatter property to show as the card title (H1). Leave empty for none; type `filename` to use the file name.",
      )
      .addText((text) =>
        text
          .setPlaceholder("E.g. Title")
          .setValue(this.plugin.settings.slidesTitle)
          .onChange(async (value) => {
            this.plugin.settings.slidesTitle = value;
            await this.plugin.saveSettings();
            this.plugin.refresh();
          }),
      );

    new Setting(containerEl)
      .setName("Bar properties")
      .setDesc(
        "Comma-separated frontmatter property names to show in the slides bar (e.g. `university, short-title, date`). Each value fills an equal-width column; drag dividers to resize. Leave empty to show nothing.",
      )
      .addText((text) =>
        text
          .setPlaceholder("E.g. University, date")
          .setValue(this.plugin.settings.barProperties)
          .onChange(async (value) => {
            this.plugin.settings.barProperties = value;
            await this.plugin.saveSettings();
            this.plugin.refresh();
          }),
      );

    new Setting(containerEl)
      .setName("Confirm slide deletion")
      .setDesc(
        "Ask for confirmation before deleting slides from the slides panel's right-click menu. Deletion moves slides to the trash.",
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.confirmDeleteSlides).onChange(async (value) => {
          this.plugin.settings.confirmDeleteSlides = value;
          await this.plugin.saveSettings();
        }),
      );

    new Setting(containerEl)
      .setName("Navigation hotkeys")
      .setDesc(
        "Default: Previous page mod+shift+←, next page mod+shift+→. Rebind under settings → hotkeys.",
      )
      .addButton((button) =>
        button.setButtonText("Open hotkeys settings").onClick(() => {
          // Open Obsidian's hotkeys settings page (internal API; ignore failures)
          (
            this.app as unknown as { setting?: { openTabById?: (id: string) => void } }
          ).setting?.openTabById?.("hotkeys");
        }),
      );
  }
}
