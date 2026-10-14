# Usage

**English** | [简体中文](usage-zh.md)

The full user guide for Native Slides. The [README](../README.md) has the short tour; this page has the details.

## Decks and the `deck` property

A deck is a chain of notes. One reserved frontmatter property, **`deck`**, holds at most one markdown link: the next slide. The last slide holds an empty list.

```yaml
# A slide: one link = the next slide
deck: ["[[slide-2]]"]
# The last slide: no link
deck: []
```

- **Page numbers are computed** by walking the chain from the head slide, 1-based. The head slide is page 1. No `page-number` property is needed.
- Quote the link in YAML. An unquoted `[[...]]` parses as a nested array. The plugin tolerates it, but the quoted form is the correct one.
- The chain must not contain cycles. A broken link simply ends the chain (or excludes the link).

## Slides mode

Slides mode is an immersive, editable card view of one slide ("one screen = one card"). It applies to deck notes only.

- **Enter and leave** with **Toggle slides mode** (`Mod+Shift+E`). Leaving restores the view you came from (Source, Live Preview or Reading).
- **What it hides**: the ribbon, both sidebars, the tab bar and the core Backlinks plugin's in-document panel.
- **The card** is centered, 80vw wide, capped to the editor pane so it never overflows, and adapts to the theme. Its look is one of **six style templates**: _Lecture (jyy)_ (default), _Dashed outline_, _Paper card_, _Minimal_, _Accent edge_ and _Frosted glass_. Each restyles the card and the slides bar.
- **The card title**: the file name is hidden by default. The **Slides title** setting shows any frontmatter property, or `filename`, as the title. A filename title is editable on the card (click it and type; this renames the note, like the native inline title). A property-backed title is read-only on the card; edit the property in the properties panel.
- **One screen**: the editor clips to a single screen with no scrolling, and always opens at the top of the note.
- **Native modes stay untouched.** Source mode, the default Live Preview and Reading view keep Obsidian's behaviour: no status-bar hiding, no slides bar, no fullscreen, no styling. Slides mode is the plugin's only surface, so it coexists with other plugins that modify the reading view.

## The slides bar

The bar at the bottom of Slides mode carries the configured properties, the ◀ ▶ buttons and the page number.

- **Bar properties** (Settings → Bar properties): a comma-separated list such as `series, level, date`. Each value fills an equal-width column; drag the dividers between columns to resize them (widths persist). Empty means no property columns, and missing properties are skipped silently. Column typography matches the page number (both scale with the bar height); columns render muted while the page number stays prominent.
- **Navigation**: flip with ◀ ▶, or with **Previous page** / **Next page** (`Mod+Shift+←/→`, rebindable under Settings → Hotkeys). From a native mode they enter Slides mode first. Both arrows always show; the one that cannot move is disabled and light gray. The page number stays hidden until **Page number style** is set in the settings.
- **Broken links**: if a `deck` link points to a note that does not exist, the bar shows a ⚠ warning chip.

## Creating slides

- **Create next slide** (deck notes only, `Mod+Shift+N`): creates a new slide right after the current one, named `<current>-next` (collision-aware: `-2`, `-3`, …), rewires the `deck` links and opens the new note. If the current note's `deck` link points to a missing note, that exact note is created instead, which clears the ⚠ warning.
- **Create new slide** (notes not in any deck): starts a brand-new deck. A fresh note (`untitled-slides`, collision-aware) becomes its first page with `deck: []`; the note you ran it from stays untouched. It works from a blank tab too. Grow the deck with Create next slide.
- **Initialize slides with this note** (notes not in any deck): promotes the active note to the head of a new deck. Content, title and location stay put, and `deck: []` is written to its frontmatter. Slides mode then opens automatically. Use it when you drafted long-form first and now want to present it.

## Presenting

- **No blinking caret**: click the slides bar to move focus out of the editor. Click any slide content to resume editing.
- **Toggle mouse pointer** (`Mod+Shift+M`) hides the pointer window-wide and parks focus. Run it again to restore; leaving Slides mode always restores it.
- **Copy AI agent prompt** (used inside Slides mode; run it elsewhere and it tells you to enter Slides mode first) copies a prompt for an AI assistant: how a deck works (one screen = one card, the `deck` chain, Create new/next slide), then the measured layout of the live view. That covers the real text area, how many lines and latin/CJK characters fit one screen, the line box of each element type (H1/H2/H3, body, bullet, code, first image) — measured on the current note, and derived from the pinned Slides typography where the note has no such element — and capacity examples such as "20 body lines" or "H1 + 19 bullets". It follows the Obsidian UI language. Paste it after your request, for example "For <material>, make slides notes".

## Settings

Settings → Native Slides:

- **Style template** (default _Lecture (jyy)_): the look of the slide card and the slides bar.
- **Center images** (default on): images render centered as a card block exactly as tall as the picture. Off restores Obsidian's inline behaviour, where a small image and its caption share a row.
- **Show slides bar** (default on): the master toggle for the slides bar.
- **Show previous/next buttons** (default on): the ◀ ▶ buttons on deck notes.
- **Page number style** (default **None**): `N / Total`, `N` or `None` — a new install shows no page number.
- **Show progress bar** (default on): clickable segments at the top of the slides bar, one per slide; click one to jump to that slide.
- **Auto-enter slides mode** (default off): open deck notes straight into Slides mode.
- **Escape exits slides mode** (default on): Escape leaves Slides mode and returns to the view you came from.
- **Slides title** (default empty): the frontmatter property to show as the card title, or `filename`. Empty shows no title.
- **Bar properties** (default empty): the comma-separated property list for the slides bar, described above.
- **Confirm slide deletion** (default on): ask before deleting slides from the slides panel; see the slides panel below.
- **Navigation hotkeys** (informational): the default Previous page / Next page hotkeys, rebindable under Settings → Hotkeys.

On Obsidian 1.13.0 and later every setting is searchable in Settings.

## Commands

| Command                          | Default hotkey                | Available                           |
| -------------------------------- | ----------------------------- | ----------------------------------- |
| Toggle slides mode               | `Mod+Shift+E`                 | deck notes                          |
| Previous page / Next page        | `Mod+Shift+←` / `Mod+Shift+→` | deck notes                          |
| Create next slide                | `Mod+Shift+N`                 | deck notes                          |
| Create new slide                 | none                          | notes not in a deck                 |
| Initialize slides with this note | none                          | notes not in a deck                 |
| Toggle slides bar                | none                          | inside Slides mode                  |
| Toggle mouse pointer             | `Mod+Shift+M`                 | inside Slides mode                  |
| Show slides panel                | none                          | always                              |
| Copy AI agent prompt             | none                          | always (notice outside Slides mode) |

Every hotkey is rebindable under Settings → Hotkeys. Most commands appear in the palette only where they apply, so the Previous page / Next page hotkeys do not shadow the editor's "select to line start/end" shortcuts on plain notes; **Show slides panel** and **Copy AI agent prompt** are always available.

## Slides panel

The panel is a sidebar view that lists every slide of the active note's deck in chain order, numbered. Run **Show slides panel** or click the presentation ribbon icon. Clicking an entry opens that slide. The list follows the active note and stays in sync with deck edits.

**Create and delete.** Right-click an entry for **Create next slide** (same as the command, but relative to the right-clicked slide; the new note stays unopened) and **Delete slide**. Delete moves the note to your configured trash (vault or OS trash, per Settings → Files & links) and splices the chain, so the predecessor's `deck` link jumps over the deleted slide. Deleting the open slide moves the editor to the nearest survivor (next preferred, previous as fallback). A confirmation dialog lists what will be deleted; tick **Don't ask again** or turn off **Settings → Confirm slide deletion** to skip it.

**Selecting several.** Hold `Cmd/Ctrl` to toggle an entry in or out of the selection (the only way to cancel one), or `Shift` to range-select. A Shift range always includes the slide you are viewing, and the first Shift+click extends from it when nothing was selected. Right-click a selected entry to get **Delete N slides**.

**Move a slide** by dragging its entry. A 2px accent line marks the gap it would land in (above the first entry and below the last one are both included), the dragged entries dim while a copy follows the pointer, and `Escape` cancels. Dragging a selected entry moves the whole selection as one block, keeping the order of the slides you did not pick; dragging an unselected entry moves just that slide and clears the selection. The context menu offers **Move slide up** / **Move slide down** (**Move N slides up/down** for a selection), disabled at the ends of the chain.

A move rewrites the `deck` links of only the slides whose next link changed; every other note keeps its frontmatter byte for byte. The panel, the page number and ◀ ▶ navigation follow immediately. The panel scrolls when the deck is taller than the sidebar, and a drag near its top or bottom edge scrolls it for you.

Two things to know:

- A move writes frontmatter, which **`Cmd/Ctrl+Z` does not undo**. Move the slide back instead.
- Moving needs the panel visible, and Slides mode hides both sidebars. Sorting is an editing-time action.

## Example vault

[`example-vault/`](../example-vault/) is the Obsidian vault to open when you want to try the plugin. It holds a three-page demo deck:

1. `Welcome.md`, the short design-principles intro (no bar properties)
2. `Make it yours.md`, the settings guide (carries `series` / `level` / `date` as the Bar properties demo)
3. `Grow the Deck.md`, the last page (`deck: []`)

File names match the slide titles on the cards. A `demo-image.png` is used by the test notes. `example-vault/tests/` holds `typography-demo.md` (a Markdown kitchen sink) and five `typography-sample-*.md` fixtures that the dev-only `Debug: Dump Typography Styles` command reads; do not rename or remove them.

The plugin folder in the vault holds symlinks to `main.js`, `manifest.json` and `styles.css` at the repository root, so the vault always runs the current build. Symlinks need filesystem support: macOS and Linux work out of the box, and Windows needs Developer Mode. Without them, copy those three files into `example-vault/.obsidian/plugins/native-slides/`. The plugin's demo settings (the _Lecture (jyy)_ template and the `series, level, date` bar properties) are the tracked `data.json` in that folder.

## Known limitations

- **Desktop only.** Mobile is not supported.
- Slides mode applies only to deck notes; every other note stays fully native.
- Properties come from **frontmatter**. Inline `key:: value` properties are not read.
- `deck` is a reserved key. `position` is also reserved and hidden from the slides bar.
- The Previous page / Next page default hotkeys shadow the editor's "select to line start/end" shortcuts while a deck note is open. Remove them under Settings → Hotkeys if you do not need page navigation.
- A move writes a rewritten `deck` link in the bare `[[basename]]` form (as Create next slide and Delete slide do), so a path-qualified or aliased link that has to change loses that form.
