# Design Principles

**English** | [简体中文](design-zh.md)

Four core principles guide every change to this project. If a change conflicts
with one of them, the change needs a strong justification.

## 1. Zero intrusion into note content

Notes stay perfectly readable in **source mode** and **live preview**. The plugin
never rewrites, reorders, or injects markers into note content — it only _reads_
(via `metadataCache`) and _renders UI_ (the bottom bar, CSS overrides). The only
in-note footprint is the `deck` frontmatter property, which is plain, readable YAML.

## 2. Minimal intrusion into properties

The plugin adds exactly **one** reserved frontmatter key — `deck` — and nothing
else. All other keys are left untouched and merely _displayed_ if the user already
has them. Demo notes keep this footprint to the bare minimum (no decorative
`tags`), so adopting the plugin costs exactly one property per note.

## 3. No unnecessary persistence beyond configuration

- Everything derived from the notes (deck chains, page numbers) is computed
  **on the fly** from `metadataCache`; nothing derived is ever cached to disk.
- The only persisted data is **configuration** (show ◀ ▶ buttons, show page
  number, hide the bar, auto-enter Slides mode), via `loadData/saveData`.
- Required data belongs to the **note structure itself** — the deck _is_ the
  chain of each slide's single next link. Backward resolution (finding the
  chain head) scans frontmatter on demand; there is no separate "deck
  index" file or database to create, keep in sync, or corrupt.
- No background scans, no persisted indexes, no writes to the vault.

## 4. Efficient implementation, no premature optimization

- Efficiency is a goal, not an obsession: on-the-fly in-memory computation,
  event-driven refreshes, and a guarded 500 ms fallback timer are enough for
  real use — no more.
- No premature optimization: no memoization, caching layers, or indexes until
  profiling shows they are actually needed.
- Code follows open-source conventions and best practices: strongly typed,
  documented, readable, elegant; conventional commits; CI-friendly.

## Trade-offs

- Slides mode hides the in-note properties panel (CSS only) in its Live Preview
  to avoid duplicating what the bottom bar shows — the note file itself is never touched.
- The `deck` chain walk reads the frontmatter of every note in the chain on each
  refresh; acceptable because `metadataCache` is in-memory and decks are small.
  Per principle 4, a memoized chain cache is deliberately deferred until profiling
  shows a real need.

## How it works

The concrete mechanisms behind the features in the README:

| Piece                             | Mechanism                                                                                                                                                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hide the status bar (Slides mode) | `body.native-slides-mode .status-bar { display: none }` — native modes keep Obsidian's default status bar                                                                                                                                    |
| Immersive layout (Slides mode)    | `body.native-slides-mode` hides the ribbon / sidebars / tab bar; the slides bar takes the tab bar's measured height (`--native-slides-tabbar-height`)                                                                                        |
| Hide in-note properties           | `.markdown-source-view.mod-cm6.is-live-preview .metadata-container { display: none }` — properties live in the slides bar instead                                                                                                            |
| Deck resolution                   | `computeDeck()` reads each slide's single next link → walks backward via a reverse `deck`-link index to the chain head → walks the chain forward (cycle-guarded) → returns the chain + current index                                         |
| Page number                       | position in the chain, 1-based (head slide = page 1); no stored `page-number` property                                                                                                                                                       |
| PPT navigation                    | `navigate()` steps along the chain and opens via `workspace.openLinkText`; it enters Slides mode first when invoked from a native mode                                                                                                       |
| Slides enter / exit               | `enterSlides()` records the current view state and forces the Live Preview; `exitSlides()` restores that exact view state (Source / Live Preview / Reading)                                                                                  |
| Create Next Slide                 | `planCreateNext()` (pure core) computes the new file name, the new note's `deck` links and the rewrites; the command applies them via `vault.create` + `fileManager.processFrontMatter` and opens the new note in edit mode. Deck notes only |
| Create New Slide                  | `planCreateNew()` (pure core) names a fresh first-page note (`untitled-slides`, collision-aware); created with `deck: []` in the default new-note location — nothing else is touched. Any note not part of a deck, blank tab included        |
| Initialize slides with this note  | `planMakeFirstSlide()` (pure core) guards on `deckService.isMember`; the command writes `deck: []` via `fileManager.processFrontMatter` (every other property stays), waits for the metadata cache to index it, then auto-enters Slides mode |
| Settings                          | Declarative settings API (Obsidian ≥ 1.13.0, searchable in Settings) with a classic `PluginSettingTab` fallback; `loadData/saveData` persist the toggles; hotkeys use Obsidian's native command system                                       |
