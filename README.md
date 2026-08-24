# Native Slides — Slides Mode for Deck Notes

**English** | [简体中文](README-zh.md)

> An Obsidian plugin that turns deck notes into **Slides**: an immersive,
> editable (Live Preview) "one screen = one card" view with a slides bar for
> properties and PPT-style navigation — driven by a single frontmatter property.

**Design principles** — zero intrusion into note content, minimal properties footprint (a single `deck` key), no persistence beyond configuration, and efficient, idiomatic code. See [docs/design.md](docs/design.md).

## Features

- **Slides mode** (_deck notes only_): an immersive, editable card view — "one screen = one card". Enter with the **Toggle Slides Mode** command (default hotkey `Mod+Shift+E`); the ribbon, sidebars and tab bar hide, the slide content sits in a **centered card** (80vw wide, theme-adaptive) whose look you choose from **six built-in style templates** — _Lecture (jyy)_ (default, modeled after the slideshow cards of [jyywiki.cn](https://jyywiki.cn) lecture notes), _Dashed outline_, _Paper card_, _Minimal_, _Accent edge_ and _Frosted glass_ — each restyling the card **and** the slides bar; the file name is hidden by default, and a **Slides title** setting can show any frontmatter property (or `filename` for the file name) as the card title, the editor **clips to a single screen** (no scrolling — content beyond the fold is clipped), and a slides bar shows the configured bar properties, ◀ ▶ navigation and the auto-computed page number. Exiting restores the view you came from (Source / Live Preview / Reading).
- **Native modes stay untouched**: Source mode, the default Live Preview and Reading view keep Obsidian's default behaviour — no status-bar hiding, no slides bar, no fullscreen, no styling. Slides mode is the plugin's only surface, so it coexists cleanly with other plugins that also modify the reading view.
- **PPT-style deck navigation** with **one reserved frontmatter property, `deck`** (next-only: at most one markdown link — the next slide; no overview page):

  ```yaml
  # Slide — one link = the next slide
  deck: ["[[slide-2]]"]
  # Last slide — no link (empty list)
  deck: []
  ```

  - **Page numbers are auto-computed** by walking the link chain (head slide → slide 2 → …), 1-based: the head slide is page 1, so no `page-number` property is needed.
  - Flip pages with the ◀ ▶ buttons in the slides bar, or with the **Previous Page / Next Page** commands (default hotkeys `Cmd/Ctrl+Shift+←/→`, rebindable under **Settings → Hotkeys**). Pressing them from a native mode enters Slides mode and flips. Both arrows are always shown; the one that cannot move (first page's ◀, last page's ▶) is disabled and light gray.
  - **Create Next Slide** command: creates a new slide right after the current one — the file is named `<current>-next` (collision-aware: `-2`, `-3`, …), the `deck` links are rewired automatically, and the new note opens ready for content. If the current note's `deck` link points to a missing note, that exact note is created instead (fixing the ⚠ warning). Run it on a note that is not part of any deck to **start a brand-new deck**.

- **Slides panel**: a sidebar view that lists every slide of the active note's deck in chain order — click an entry to jump to it. Open it with the **Show Slides Panel** command or the presentation ribbon icon.

- **Presenting without a blinking caret**: click the slides bar to move focus out of the editor — the caret disappears while you talk; click any slide content to resume editing. The **Toggle Mouse Pointer** command (`Mod+Shift+M`) goes one step further and hides the mouse pointer window-wide (focus parked too); run it again to restore, and leaving Slides mode always restores it.
- **Configurable bar properties**: choose which frontmatter properties appear in the slides bar and in what order. Settings → Bar properties accepts a comma-separated list (e.g. `university, short-title, date`); each value fills an equal-width column, and draggable dividers between columns let you resize them interactively (widths persist across sessions). Empty = no property columns. Missing properties are skipped silently. Column typography matches the page number (both scale with the bar height); columns render muted while the page number stays prominent.
- **Auto-enter Slides mode** (settings, default off): open deck notes straight into Slides mode; leave off to enter manually.
- A **settings tab** picks the style template, configures bar properties, and toggles the ◀ ▶ buttons, the page number, and auto-enter.
- **Broken deck-link warnings**: if a `deck` link points to a note that doesn't exist, the slides bar shows a ⚠ warning chip so authors can spot typos (the chain simply ends or excludes the link).
- **Commands**: _Toggle Slides Mode_ (`Mod+Shift+E`), _Previous Page / Next Page_, _Create Next Slide_, _Show Slides Panel_, _Toggle Mouse Pointer_ (`Mod+Shift+M`), and _Toggle Slides Bar_ — all rebindable under _Settings → Hotkeys_.

## Slides panel (sidebar)

Since v1.0.0 there is no overview page — the **slides panel** takes over the "see the whole deck" role. Run the **Show Slides Panel** command (or click the presentation ribbon icon) and a sidebar view lists every slide of the active note's deck in chain order, numbered; clicking an entry opens that slide. The list follows the active note and stays in sync with deck edits.

## Example vault

The demo notes live in [`example-vault/`](example-vault/), which is the Obsidian vault you open to try the plugin. It contains a three-page demo deck — `welcome.md` (frontmatter with `university` / `course` / `date` for the _Bar properties_ setting), `slide-2.md` (the next-only `deck` convention + a pointer to the plugin settings), `slide-3.md` (the last page, `deck: []`) — and a `demo-image.png` used by the test notes. Under `example-vault/tests/` there is `typography-demo.md` (a Markdown kitchen sink — headings, lists, tasks, quotes, code blocks, tables, images — used to test Slides typography) and five `typography-sample-*.md` notes (fixed one-page samples consumed by the **dev-only** `Debug: Dump Typography Styles` command — do not rename or remove them). The vault also carries a minimal `.obsidian/` configuration — including the demo look (`baseFontSize` 23, default theme) and the plugin's demo settings (Lecture (jyy) template, `university, course, date` bar properties) — so a fresh clone opens exactly as documented. It also has a plugin folder `example-vault/.obsidian/plugins/native-slides/` whose files (`manifest.json`, `main.js`, `styles.css`) are **symlinks to the repository root** — so the example vault always runs the current build.

> Symlinks require filesystem support (macOS/Linux work out of the box; on Windows enable Developer Mode). If symlinks are unavailable, copy `main.js`, `manifest.json`, `styles.css` into `example-vault/.obsidian/plugins/native-slides/`.

## Getting started

1. Open the example vault: Obsidian → _Open another vault_ → select the `example-vault/` directory inside this repo.
2. Allow community plugins: _Settings → Community plugins → Turn off Safe mode_ (one-time, manual).
3. Enable **Native Slides** under _Settings → Community plugins_.

Open `welcome.md` and press `Cmd/Ctrl+Shift+E` to enter Slides mode — the slides bar shows the configured properties, ◀ ▶ buttons and the page number. Press `Cmd/Ctrl+Shift+→` to go to the next slide, and run **Show Slides Panel** to see the whole deck.

Demo deck: `welcome.md` → `slide-2.md` → `slide-3.md`.

## How it works

| Piece                             | Mechanism                                                                                                                                                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hide the status bar (Slides mode) | `body.native-slides-mode .status-bar { display: none }` — native modes keep Obsidian's default status bar                                                                                                                   |
| Immersive layout (Slides mode)    | `body.native-slides-mode` hides the ribbon / sidebars / tab bar; the slides bar takes the tab bar's measured height (`--native-slides-tabbar-height`)                                                                       |
| Hide in-note properties           | `.markdown-source-view.mod-cm6.is-live-preview .metadata-container { display: none }` — properties live in the slides bar instead                                                                                           |
| Deck resolution                   | `computeDeck()` reads each slide's single next link → walks backward via a reverse `deck`-link index to the chain head → walks the chain forward (cycle-guarded) → returns the chain + current index                        |
| Page number                       | position in the chain, 1-based (head slide = page 1); no stored `page-number` property                                                                                                                                      |
| PPT navigation                    | `navigate()` steps along the chain and opens via `workspace.openLinkText`; it enters Slides mode first when invoked from a native mode                                                                                      |
| Slides enter / exit               | `enterSlides()` records the current view state and forces the Live Preview; `exitSlides()` restores that exact view state (Source / Live Preview / Reading)                                                                 |
| Create Next Slide                 | `planCreateNext()` (pure core) computes the new file name, the new note's `deck` links and the rewrites; the command applies them via `vault.create` + `fileManager.processFrontMatter` and opens the new note in edit mode |
| Settings                          | `PluginSettingTab` + `loadData/saveData` persist the toggles; hotkeys use Obsidian's native command system                                                                                                                  |

## Development

The plugin is written in TypeScript. You don't need to know TS to ask for changes — describe what you want in natural language and the code will be updated and rebuilt. To build manually:

Run the commands from the repository root:

```sh
npm ci             # first time only (downloads esbuild etc.)
npm run build      # compiles main.ts → main.js (dev build: debug command included)
npm run build:release  # publish build: minified, debug command excluded
npm run check      # optional: TypeScript type-check (tsc --noEmit)
npm run test       # optional: vitest unit tests
npm run lint       # optional: ESLint
npm run format:check  # optional: Prettier
```

### Dev loop (rebuild + reload)

Rebuild on change, then reload manually:

```sh
npm run dev        # watch main.ts, rebuild main.js on change
```

After editing `main.ts`, reload the plugin in Obsidian: open the command palette with `Cmd/Ctrl+P`, search for **Reload app without saving**, and run it (it has no default hotkey). Alternatively, disable/re-enable **Native Slides** under _Settings → Community plugins_.

## For developers

The typography-measurement tooling ships as a **dev-only** command and is excluded from release builds.

- **Dev build** (`npm run build` / `npm run dev`) registers the `Debug: Dump Typography Styles` command: it samples the current note in **both** edit and reading views, computes an edit-vs-reading diff, and writes `.native-slides-debug.json` to the vault root (no manual console copy/paste). Run it on a deck note with Slides mode on; the five `typography-sample-*.md` notes in `example-vault/` are its fixed one-page fixtures — do not rename or remove them.
- **Release build** (`npm run build:release`) minifies `main.js` and drops the debug command (and its supporting code) entirely via `--define:DEV_MODE=false` + tree-shaking. Run `npm run build` afterwards to restore the dev artifact.

The source is split into `src/` modules (`types`, `mode`, `deck-service`, `bar`, `commands`, `settings`, `debug`, `deck`, `createNext`) with `main.ts` as the orchestration entry point.

## Known limitations

- **Desktop only** — the plugin targets the Obsidian desktop app; mobile is not supported.
- Slides mode applies only to **deck notes** (notes with a `deck` property); all other notes are left fully native.
- Properties come from **frontmatter** (the `---` YAML block at the top); inline `key:: value` properties are not read.
- `deck` is a **reserved key name**; the `position` key is also reserved and hidden from the slides bar (it can be used by other tools without cluttering the bar).
- The default hotkeys shadow the editor's "select to line start/end" shortcuts in edit view; remove them in **Settings → Hotkeys** if you don't need page navigation.
- Quote link values in YAML (`deck: ["[[slide-2]]"]`) — unquoted `[[...]]` becomes a nested YAML array (the plugin tolerates it, but quoting is the correct form).
- The deck chain must not contain cycles; a broken link simply ends (or excludes) the chain.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Yuanhui Luo.

## Credits

- **Lecture (jyy) style template**: modeled after the slideshow cards of [jyywiki.cn](https://jyywiki.cn) by [Yanyan Jiang](https://jyywiki.cn/). The card geometry (80vw width, soft shadow, thin bottom rule on headings, disc bullets with constant marker-to-text gap, list item spacing) is adapted from Jiang's lecture notes design.
