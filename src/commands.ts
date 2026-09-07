import type NativeSlidesPlugin from "../main";
import { copyCapacityPrompt } from "./capacity";
import { registerDebugCommand } from "./debug";
import { frontmatterOf } from "./mode";
import { DECK_KEY } from "./types";
import { Notice } from "obsidian";

/** Register every command; the debug command is dev-build only. */
export function registerCommands(plugin: NativeSlidesPlugin): void {
  // Toggle the slides bar (within Slides mode)
  plugin.addCommand({
    id: "ns-toggle-bar",
    name: "Toggle slides bar",
    callback: async () => {
      plugin.settings.barHidden = !plugin.settings.barHidden;
      await plugin.saveSettings();
      plugin.refresh();
    },
  });
  // Show the slides sidebar panel (deck slide list)
  plugin.addCommand({
    id: "ns-show-panel",
    name: "Show slides panel",
    callback: () => void plugin.activateSlidesPanel(),
  });
  // Hide / show the mouse pointer window-wide (presenting; Slides mode only)
  plugin.addCommand({
    id: "ns-toggle-pointer",
    name: "Toggle mouse pointer",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "M" }],
    checkCallback: (checking) => {
      if (!document.body.classList.contains("native-slides-mode")) return false;
      if (!checking) plugin.togglePointer();
      return true;
    },
  });
  // Previous / next page (deck navigation; entering Slides mode as needed)
  plugin.addCommand({
    id: "ns-prev",
    name: "Previous page",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "ArrowLeft" }],
    callback: () => plugin.navigate("prev"),
  });
  plugin.addCommand({
    id: "ns-next",
    name: "Next page",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "ArrowRight" }],
    callback: () => plugin.navigate("next"),
  });
  // Create Next Slide — new slide after the current one (deck notes only)
  plugin.addCommand({
    id: "ns-create-next",
    name: "Create next slide",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "N" }],
    // Greyed out unless the active note is part of a deck — plain notes
    // start decks with "Create new slide" instead.
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || !plugin.deckService.isMember(file)) return false;
      const plan = plugin.deckService.planCreateNext(file);
      if (!plan) return false;
      if (!checking) void plugin.deckService.executeCreateNext(file, plan);
      return true;
    },
  });
  // Create New Slide — a brand-new deck's first page (non-deck notes only;
  // also works from a blank tab — lands in the default new-note location)
  plugin.addCommand({
    id: "ns-create-new",
    name: "Create new slide",
    // No default hotkey: Mod+Shift+N belongs to Create next slide — two
    // commands sharing one default hotkey trips Obsidian's conflict UI.
    callback: () => void plugin.deckService.executeCreateNew(plugin.deckService.planCreateNew()),
  });
  // Make This Note the First Slide — promote the active (plain) note into
  // the head of a brand-new deck: it gains `deck: []` and keeps its
  // content, title and location. A plain callback (not checkCallback) so
  // the command stays visible in the palette even when the active note is
  // already in a deck — that case no-ops with a Notice instead. Conversion
  // is a single frontmatter write (no confirmation dialog), then Slides
  // mode auto-enters so the result is immediately visible.
  plugin.addCommand({
    id: "ns-make-first-slide",
    name: "Make this note the first slide",
    callback: async () => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file) return; // nothing to convert (blank tab)
      const converted = await plugin.deckService.makeFirstSlide(file);
      if (!converted) {
        new Notice("Native slides: this note already belongs to a deck");
        return;
      }
      new Notice("Native slides: made this note the first slide of a new deck");
      await plugin.enterSlidesForActive();
    },
  });
  // Copy a one-screen capacity report of the current Slides layout
  plugin.addCommand({
    id: "ns-copy-slide-skill",
    name: "Copy AI agent prompt",
    callback: async () => {
      // checkCallback is not used: it would hide the command from the
      // command palette outside Slides mode (palette only shows commands
      // whose checkCallback returns true). Keep the command always visible
      // and explain the required mode when invoked too early.
      if (!document.body.classList.contains("native-slides-mode")) {
        new Notice("Native slides: enter Slides mode first (Mod+Shift+E on a deck note)");
        return;
      }
      await copyCapacityPrompt(plugin.app);
    },
  });
  // Toggle Slides mode — the immersive card view (deck notes only)
  plugin.addCommand({
    id: "ns-toggle-slides",
    name: "Toggle slides mode",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "E" }],
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file) return false;
      const fm = frontmatterOf(plugin.app, file);
      if (fm === null || !(DECK_KEY in fm)) return false;
      if (!checking) plugin.toggleSlides();
      return true;
    },
  });
  // Debug tooling — registered only in dev builds (tree-shaken in release)
  if (DEV_MODE) registerDebugCommand(plugin);
}
