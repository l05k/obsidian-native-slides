# Design Principles

**English** | [简体中文](design-zh.md)

Four core principles guide every change to this project. If a change conflicts
with one of them, the change needs a strong justification.

## 1. Zero intrusion into note content

Notes stay perfectly readable in **source mode** and **live preview**. The plugin
never rewrites, reorders, or injects markers into note content — it only _reads_
(via `metadataCache`) and _renders UI_ (the bottom bar, CSS overrides). Note
content is never touched at all; the one surface the plugin writes is the `deck`
frontmatter property, and only through the operations that maintain the chain —
Create Next Slide, Delete slide(s) and moving a slide. It stays plain, readable YAML.

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
| PPT navigation                    | `navigate()` queues presses, steps along the chain one awaited open at a time and enters Slides mode first when invoked from a native mode                                                                                                   |
| Slides enter / exit               | `enterSlides()` records the current view state and forces the Live Preview; `exitSlides()` restores that exact view state (Source / Live Preview / Reading)                                                                                  |
| Create Next Slide                 | `planCreateNext()` (pure core) computes the new file name, the new note's `deck` links and the rewrites; the command applies them via `vault.create` + `fileManager.processFrontMatter` and opens the new note in edit mode. Deck notes only |
| Create New Slide                  | `planCreateNew()` (pure core) names a fresh first-page note (`untitled-slides`, collision-aware); created with `deck: []` in the default new-note location — nothing else is touched. Any note not part of a deck, blank tab included        |
| Initialize slides with this note  | `planMakeFirstSlide()` (pure core) guards on `deckService.isMember`; the command writes `deck: []` via `fileManager.processFrontMatter` (every other property stays), waits for the metadata cache to index it, then auto-enters Slides mode |
| Move slides (drag, Move up/down)  | `planMove()` (pure core) turns a moving set plus a gap into the `deck` rewrites it implies; `executeMove()` writes them                                                                                                                      |
| Slides panel scrolling            | the entries live in the view content Obsidian already scrolls (`min-height: 0` so it may shrink); a deck taller than the sidebar scrolls inside the panel rather than being clipped — and that is what a drag at the edge scrolls            |
| Settings                          | Declarative settings API (Obsidian ≥ 1.13.0, searchable in Settings) with a classic `PluginSettingTab` fallback; `loadData/saveData` persist the toggles; hotkeys use Obsidian's native command system                                       |

**Moving slides (since #124).** A deck stores no order of its own — the order _is_ the next-link chain — so a move rewires the `deck` links around the slides being moved: `planMove()` (pure core) turns "these slides, this gap" into one rewrite per slide whose next link changed, and `DeckService.executeMove()` applies them. That is why navigation, page numbers and the slides panel itself need to know nothing about a move ([ADR 0001](adr/0001-slide-order-is-the-next-link-chain.md)). The gesture lives in `src/panel-drag.ts` and is built on pointer events — a 4 px threshold so a press stays a click, a ghost plus a gap line, `Escape` and window blur as cancels, edge auto-scroll — because Obsidian's public API offers no drag-to-move helper a custom view could use (the declarative settings list's `onReorder` renders inside the settings modal only). A drop is refused when the chain changed under the gesture, and a move that changes nothing writes nothing.

**Navigation session (since the #110 fix).** Presses are queued and every step is anchored on the previous step's target, so a burst — key repeat, fast clicks on the bar button — advances one slide per press instead of collapsing into a single open, and presses past the last slide stay put. A session also keeps the chain **head** it entered as long as that head still reaches the slide in the editor, so a shared `deck` link (two slides declaring the same next slide) cannot re-base the deck mid-navigation or redirect _Previous page_; the bar, the slides panel and the navigation all walk that same chain.

This is the only session state the plugin holds, and it is a **head hint, not a cached chain**: the chain itself is still walked live from `metadataCache` on every resolution (principle 3), so slides created, renamed or deleted meanwhile are honoured and no stale path can be navigated into, and a hint that no longer reaches the current slide is simply ignored — it needs no invalidation and no event wiring (principle 4). Its justification is correctness, not profiling: without it, `computeDeck()`'s backward walk has to pick a head for a slide that several predecessors point at, which is exactly what used to swap the deck mid-navigation.
