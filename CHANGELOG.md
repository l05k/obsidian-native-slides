# Changelog

All notable user-visible changes to Native Slides are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Categories: Added, Changed, Deprecated, Removed, Fixed, Security. Omit any category with no entries. On release, rename [Unreleased] to the version with its date and start a fresh empty [Unreleased] above it.

## [Unreleased]

### Changed

- **Card title is editable (Slides title = filename)**: the card title now renders with the native inline title element instead of a painted pseudo-element, so clicking it focuses the real editor — typing renames the note, exactly as in Live Preview. The title keeps the card geometry (H1 metrics pixel-identical to a body H1, height reserved, click mapping unchanged). Property-backed titles remain read-only on the card; edit the property in the note's properties panel. The shared slide typography variables moved to the sizer so the card and its title resolve identical values (#87).

### Fixed

- **Slides always open at the top of the note**: entering Slides mode resets the editor scroller to its first line. Previously, a long note opened mid-document when the view-state switch restored the scroller to the saved cursor line without firing a scroll event afterwards — the capture-phase scroll reset never ran, and the card showed the middle of the note instead of its beginning.

- **No more phantom top padding on foldable lines**: a long first line whose next line starts with deep indentation no longer gains a spurious empty row above it in Slides mode. Root cause: CodeMirror's internal zero-width `cm-widgetBuffer` placeholder (inserted when Obsidian marks the line foldable) was caught by the standalone-image centering rule and pushed the text down by a full line box; buffers are now excluded from that rule and taken out of the inline flow (#88).

- **Image layout is now a setting** (`Center images`, default on): images render centered on the slide as a card block exactly as tall as the picture — the embed's img and Obsidian's inline-flex `.image-wrapper` are blockified inside a blockified embed, so no line-height strut (≈9px) stretches a standalone image line; text rows are the only added height. Turning the setting off restores Obsidian's native inline flow: images stay inline with the text (a small image and its caption sit on the same row), wrapping only when the row runs out of width. Pure CSS + one body class (`native-slides-block-images`) — no JavaScript tagging, no re-render certification (the standalone-image centering previously survived via JS-tagged lines and their re-render machinery; that whole mechanism is gone, and the bug it existed to fix is gone with it). The `cm-widgetBuffer` fix (#88) stays on always.

## [1.0.2] - 2026-08-24

### Changed

- **Reviewer linter round 2**: settings styles are sentence-case (e.g. "Show previous/next buttons", "Auto-enter slides mode") and the notice prefix is "Native slides"; property values fall back to `—` instead of `[object Object]`.

### Fixed

- **Official plugin review linter — second report**: the settings tab now persists declarative-control changes without touching the 1.13.0-only `setControlValue` base (minAppVersion stays 1.7.2) and no longer carries a "Native Slides · Settings" heading (both heading rules); bar markup uses `createDiv`/`createSpan` helpers instead of `createEl("div"/"span")`; the stored bar-widths check became a proper type guard (no unnecessary assertion).

## [1.0.1] - 2026-08-24

### Changed

- **Delete slides follows your trash preference**: deleting slides from the panel now uses Obsidian's file manager (`trashFile`), so notes go to your configured trash location (vault trash or OS trash) instead of always the system trash.
- **Settings are searchable (Obsidian ≥ 1.13.0)**: the settings tab now implements the declarative settings API — every option appears in the Settings search — while keeping the classic form as a fallback for older Obsidian versions.

### Fixed

- **Official plugin review linter compliance**: replaced direct inline-style assignments with `setCssStyles`/`setCssProps`, `document.createElement` with Obsidian's `createEl` helpers, and the settings heading with a proper `Setting` heading; typed `loadData`/`JSON.parse`/`Array()` results, awaited `revealLeaf`, removed unnecessary type assertions, and cleaned up debug tooling (uses `window.setTimeout`, no more console dump). The minimum Obsidian version is raised to **1.7.2** (`workspace.revealLeaf`).

## [1.0.0] - 2026-08-24

### Added

- **Slides panel**: a new sidebar view (command **Show slides panel**, or the presentation ribbon icon) that lists every slide of the active note's deck in chain order, numbered; clicking an entry opens that slide. It follows the active note and stays in sync with deck edits — taking over the aggregation role the overview page used to play.
- **Create new slide starts new decks**: running the command on a note that is not part of any deck creates a brand-new deck's first page — a fresh note (`untitled-slides`, collision-aware) with `deck: []`, leaving the note it was launched from untouched. It also works from a blank tab: the note lands in the default location for new notes.
- **Slides panel context menu — Create next slide / Delete slide(s)**: right-click a slide entry (or a multi-selection: `Cmd/Ctrl`-click toggles an item in and out — the only way to cancel one — `Shift`-click range-selects, and every Shift range also folds in the slide you are currently viewing, with the first Shift+click extending from it when nothing is selected yet) for **Create next slide** — inserts a new `⟨slide⟩-next` note _after the right-clicked slide_ without opening it — and **Delete slide(s)** — moves the notes to the trash and splices the deck chain around them (the predecessor's `deck` link jumps to the first surviving successor; deleting the head run makes the first survivor the new head with no rewrite needed). If the deleted set contains the currently open slide, the editor jumps to the nearest survivor (next one preferred). A confirmation dialog lists the notes about to be trashed and can be skipped globally via **Settings → Confirm slide deletion** (default on) or per-dialog with "Don't ask again".

### Changed

- **BREAKING — Create Next Slide is deck-notes-only**: the command now requires the active note to belong to a deck (greyed out otherwise); plain notes start decks with **Create new slide** instead.

- **BREAKING — next-only `deck` semantics (issue #67)**: a slide's `deck` property now holds **at most one link — the next slide** (last slide: `deck: []`). The overview back-link is gone; chains are resolved by walking backward via a reverse `deck`-link index. Old two-link decks (`[overview, next]`) are **not** understood — edit existing slides so `deck` holds only the next-slide link (old overview notes work unchanged as the chain's first page). This structurally eliminates the two-node deck ambiguity (#66).
- **BREAKING — page numbers are 1-based over the whole chain**: the head slide is page 1; `N / Total` counts every slide (no overview offset).
- **Example vault demo deck reworked**: one three-page demo deck — `Welcome` (a short design-principles intro, no bar properties) → `Make it yours` (the settings guide; carries `series` / `level` / `date` for the _Bar properties_ demo, list indentation follows Obsidian's default) → `Grow the Deck` (`deck: []`, the last page); file names match the slide titles. The old overview page, the bar-properties / broken-link / folded-properties demos and all jyy lecture notes are gone, and every typography test note (kitchen sink + the five dev-only samples) moved to `example-vault/tests/`.

### Removed

- **BREAKING — the overview page concept**: no dedicated overview note is required; any note can head a deck. The **New slides deck** command is removed (Create Next Slide covers starting a deck), and the example vault's overview/Base-view setup is replaced by the slides panel.

### Fixed

- **Slides card line overflow**: with Obsidian's _readable line width_ enabled, every editor line was sized for the full-width editor and spilled past the slide card's right border; lines now keep their natural width inside the card.
- **Slides panel sometimes needed a double click**: clicking a slide entry could be swallowed when the click also activated the panel leaf (the list rebuilt mid-gesture, destroying the click target). The list now updates incrementally — unchanged decks only refresh the highlight — and entries always open in a markdown leaf, never replacing the panel itself.

## [0.1.1] - 2026-08-19

### Added

- **New Slides Deck command**: one-click creation of a new deck overview note with a Base filter view (shows all slides linking to the overview) and built-in instructions for adding slides via the Create Next Slide command. Run from the command palette: "New slides deck".
- **Configurable bar properties**: choose which frontmatter properties appear in the slides bar and in what order. Settings → Bar properties accepts a comma-separated list (e.g. `university, short-title, date`); each value fills an equal-width column, and draggable dividers between columns let you resize them interactively (widths persist across sessions). Empty = no property columns. Missing properties are skipped silently. Column typography is harmonized with the page number: both scale from the bar height, columns render muted and the page number in normal weight.
- **Deck progress indicator**: discrete clickable segments at the top of the slides bar — one segment per slide in the deck chain. Past segments use semi-transparent accent, current uses full accent, future uses track colour. Each segment is an independent hover/click target to jump to that slide. Toggle under Settings → Show progress bar (default on).
- **Escape exits Slides mode**: press Escape to leave Slides mode and return to the previous view. Toggle under Settings → Escape exits Slides mode (default on).

### Fixed

- **Create Next Slide on new overview**: the command now works on overview notes created by "New Slides Deck" even when the placeholder link points to a non-existent note (previously failed because deck computation required bidirectional links). When the overview's deck link points to a missing note, Create Next Slide creates that exact note as the first slide.

### Changed

- **Command names**: all command names updated to sentence case for better command palette display (e.g., "Create next slide" instead of "Create Next Slide").
- **Page number format**: now shows `N / Total` instead of "Overview" / "Page N". Overview is page 0; content pages start from 1; total excludes the overview page.
- **Settings defaults**: `pageNumberStyle` now defaults to "none" (progress segments alone give enough context); new `showSlidesBar` master toggle (default on) can hide the entire bar. Page number is now a dropdown: "N / Total", "N", or "None".

## [0.1.0] - 2026-08-18

### Added

- **Style templates**: six built-in looks for the Slides card **and** slides bar — _Lecture (jyy)_ (default, after the slideshow cards of [jyywiki.cn](https://jyywiki.cn) lecture notes: a bordered card with soft shadow that fills the screen, a compact bold title over a thin bottom rule, tight headings, and disc bullets with a constant marker-to-text gap), _Dashed outline_ (the previous default look), _Paper card_ (solid slide with soft shadow), _Minimal_ (no card boundary, flat canvas), _Accent edge_ (accent line on card top and bar) and _Frosted glass_ (translucent, blurred surfaces over a tinted backdrop). Pick one under Settings → Style template; every template adapts to light and dark themes. The example vault ships a small deck (`jyy-overview`) that reproduces two jyywiki slides for side-by-side comparison.
- **Presentation parking**: click the slides bar to move focus out of the editor — the blinking caret disappears while you present (the nav buttons keep working), and the bar shows the plain arrow cursor with a gentle hover glow. Click any slide content to resume editing.
- **Toggle Mouse Pointer** command (default hotkey `Mod+Shift+M`, rebindable): hides the mouse pointer window-wide for presenting and parks focus at the same time (no caret either); run it again to bring the pointer back, and leaving Slides mode always restores it.
- **Create Next Slide** command: creates a new slide right after the current one — the file is named `<current>-next` (collision-aware: `-2`, `-3`, …), both `deck` properties are rewired automatically, and the new note opens in edit mode. If the current note's second `deck` link points to a missing note, that exact note is created instead (fixing the ⚠ warning); on the overview page it inserts a new first page. The command is greyed out for notes that cannot take a next slide.
- **WYSIWYG mode** (deck notes only): explicit immersive mode — command `Toggle WYSIWYG Mode` (default hotkey `Mod+Shift+E`), bottom-bar button, or settings toggle (default off). **WYSIWYG = Live Preview styled to match the reading view** (reading is the untouched reference): Live Preview's top margin, list indentation and code-block metrics align to reading; the **tab bar and sidebars hide** (Live Preview + reading view; Source mode stays completely native), the bottom bar shows in Live Preview too and matches the tab bar's measured height (runtime CSS variable; no content-area height change when switching modes), **in-note properties hide while editing** in Live Preview, and **standalone image lines are centered**. Toggling from reading view jumps into the WYSIWYG edit view.
- **WYSIWYG typography alignment (Live Preview → reading)**: reading view stays fully default; WYSIWYG's Live Preview aligns to it (top margin 32px, list indent `calc(var(--list-indent) - 0.375em)`, code blocks 16px/1.5). Known non-overridable delta: paragraph spacing (Live Preview blank line = 24px line-height vs reading's 16px `--p-spacing`). A **dev-only** `Debug: Dump Typography Styles` command (see below) samples both views and writes an edit-vs-reading diff to `.native-slides-debug.json` in the vault root.
- **Slides card appearance**: the slide content now sits in a centered, theme-adaptive card (rounded corners, border, soft shadow) over a dimmed backdrop — geometry only; typography is unchanged.

### Changed

- The default style template is now **Lecture (jyy)** (formerly _Lecture (wiki)_); the previous default, _Dashed outline_, stays selectable in Settings → Style template.
- Lecture (jyy) template: the card no longer locks the editor to 16px — it now follows Obsidian's font size setting (Settings → Appearance → Font size), with every metric em-based so the card, headings, list pitch and spacing all scale as one piece; this is the size control that goes beyond Obsidian's built-in zoom cap (at a 16px font the typography is unchanged). For large-screen reading the card now runs **80vw wide and stretches to fill the window height** (slim outer margins, content top-aligned) instead of a small 600px card, and list items carry the wiki's measured 4px item gaps (8px where a nested list resumes the parent level).
- Slides title: the file name is now hidden by default in Slides mode; a new **Slides title** setting takes any frontmatter property (or `filename` for the file name) and shows it as the card title. Card width increased to **80vw**.
- Slides bar polish: removed the redundant "Slides: On" chip (the bar's presence already implies Slides mode) and renamed the bar to **slides bar** (the `Toggle Properties Bar` command is now `Toggle Slides Bar`).
- Bottom bar: the "No properties" placeholder is removed — deck pages (frontmatter with only the reserved `deck` key) show just the nav buttons and page number, and the bar hides entirely when there is nothing to display.
- Navigation: the ◀ ▶ arrows are always both shown inside a deck; the one that cannot move (first page's ◀, last page's ▶) is disabled and light gray.
- Settings: the bar-hidden and auto-fullscreen toggles are now persisted (previously reset on reload); auto-fullscreen is also exposed in the settings tab.
- The plugin is now **desktop-only** (`isDesktopOnly: true`); mobile is not supported.
- Broken `deck` links are flagged with a ⚠ warning chip in the bar.
- WYSIWYG properties behavior reworked: the old always-hide-in-edit + auto-open-right-sidebar behavior is replaced by the WYSIWYG mode (above) — outside the mode, edit view shows in-note properties natively. `minAppVersion` remains 1.7.0.
- Development tooling: `main.ts` was split into `src/` modules (`types`, `mode`, `deck-service`, `bar`, `commands`, `settings`, `debug`) with `main.ts` as the orchestration entry point. The `Debug: Dump Typography Styles` command is now registered only in **dev builds** (`npm run build`/`npm run dev`); **release builds** (`npm run build:release`) are minified and exclude it entirely (`--define:DEV_MODE=false` + tree-shaking). No user-visible change beyond removing the debug command from release builds.
- **Slides mode replaces WYSIWYG mode**: the plugin now provides a single immersive, editable card view for deck notes — **Slides mode** — instead of modifying the reading view. Native modes (Source / default Live Preview / Reading) are now **completely untouched** (no status-bar hiding, no bottom bar, no auto-fullscreen, no styling), so the plugin coexists with other reading-view plugins. Enter Slides mode with the `Toggle Slides Mode` command (`Mod+Shift+E`), which records and restores your previous view; the `Previous Page` / `Next Page` hotkeys now auto-enter Slides mode and flip; a new `autoEnterSlides` setting (default off) opens deck notes straight into Slides mode. Slides mode's styling is unchanged from the WYSIWYG look for now.
- Slides mode now **clips to a single screen**: the editor no longer scrolls — content beyond the fold is clipped (no scrollbar), re-clipping automatically on window resize and theme changes.

### Removed

- Reading-view properties bar, reading-view auto-fullscreen, and the global status-bar hide — native modes are now fully untouched.
- `Pause/Resume Auto Fullscreen` command and the `autoFullscreen` setting (obsolete with reading-view fullscreen).
- `Toggle WYSIWYG Mode` command (renamed to `Toggle Slides Mode`).

## [0.1.0] - 2026-08-14

### Added

- Reading-view properties bar: hides the native status bar and renders the current note's frontmatter properties as chips in a bottom bar.
- Immersive fullscreen reading mode: ribbon, sidebars, tab bar and pane header are hidden and OS fullscreen is requested; `Esc` exits fullscreen and reading view together.
- PPT-style deck navigation driven by one reserved frontmatter property `deck` (overview + next links), with auto-computed page numbers — no stored `page-number` property.
- Previous Page / Next Page commands (default `Mod+Shift+←/→`, rebindable under Settings → Hotkeys).
- Settings tab toggling the ◀ ▶ buttons and the page number.
- Example vault (`example-vault/`) with a demo deck and an overview page embedding an Obsidian Base view.

[Unreleased]: https://github.com/Losk-x/obsidian-native-slides/compare/0.1.0...HEAD
[0.1.0]: https://github.com/Losk-x/obsidian-native-slides/releases/tag/0.1.0
