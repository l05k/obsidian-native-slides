import type NativeSlidesPlugin from "../main";
import { copyCapacityPrompt } from "./capacity";
import { registerDebugCommand } from "./debug";
import { frontmatterOf } from "./mode";
import { DECK_KEY } from "./types";
import { Notice } from "obsidian";

/** Register every command; the debug command is dev-build only. */
export function registerCommands(plugin: NativeSlidesPlugin): void {
  // Toggle the slides bar — only meaningful inside Slides mode, so a
  // checkCallback keeps it out of the palette everywhere else
  plugin.addCommand({
    id: "ns-toggle-bar",
    name: "Toggle slides bar",
    checkCallback: (checking) => {
      if (!document.body.classList.contains("native-slides-mode")) return false;
      if (!checking) {
        plugin.settings.barHidden = !plugin.settings.barHidden;
        void plugin.saveSettings().then(() => plugin.refresh());
      }
      return true;
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
  // Previous / next page — deck navigation (entering Slides mode as
  // needed). checkCallback keeps them out of the palette on non-deck notes,
  // where they have nothing to flip; their default hotkeys then no longer
  // shadow the editor's select-to-line shortcuts on plain notes either.
  plugin.addCommand({
    id: "ns-prev",
    name: "Previous page",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "ArrowLeft" }],
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || !plugin.deckService.isMember(file)) return false;
      if (!checking) void plugin.navigate("prev");
      return true;
    },
  });
  plugin.addCommand({
    id: "ns-next",
    name: "Next page",
    hotkeys: [{ modifiers: ["Mod", "Shift"], key: "ArrowRight" }],
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || !plugin.deckService.isMember(file)) return false;
      if (!checking) void plugin.navigate("next");
      return true;
    },
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
  // Create New Slide — a brand-new deck's first page. Hidden on deck notes
  // (the deck grows via Create Next Slide instead); still works from a
  // blank tab — lands in the default new-note location.
  plugin.addCommand({
    id: "ns-create-new",
    name: "Create new slide",
    // No default hotkey: Mod+Shift+N belongs to Create next slide — two
    // commands sharing one default hotkey trips Obsidian's conflict UI.
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (file && plugin.deckService.isMember(file)) return false;
      if (!checking) void plugin.deckService.executeCreateNew(plugin.deckService.planCreateNew());
      return true;
    },
  });
  // Initialize slides with this note — promote the active (plain) note into
  // the head of a brand-new deck: it gains `deck: []` and keeps its
  // content, title and location, then Slides mode auto-enters. checkCallback
  // shows it only on notes that are NOT already part of a deck, so it never
  // appears on deck/slides notes where it would be misleading. Conversion is
  // a single frontmatter write (no confirmation dialog).
  plugin.addCommand({
    id: "ns-make-first-slide",
    name: "Initialize slides with this note",
    checkCallback: (checking) => {
      const file = plugin.app.workspace.getActiveFile();
      if (!file || plugin.deckService.isMember(file)) return false;
      if (!checking) {
        void (async () => {
          const converted = await plugin.deckService.makeFirstSlide(file);
          if (!converted) return; // defensive — the check above already passed
          new Notice("Native slides: made this note the first slide of a new deck");
          await plugin.enterSlidesForActive();
        })();
      }
      return true;
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
