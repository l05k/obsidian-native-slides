# Native Slides — Slides Mode for Deck Notes

**English** | [简体中文](README-zh.md)

> An Obsidian plugin that turns deck notes into **Slides**: an immersive,
> editable (Live Preview) "one screen = one card" view with a slides bar for
> properties and PPT-style navigation — driven by a single frontmatter property.

![Welcome slide in Slides mode](docs/welcome.png)

## Install

Requires Obsidian 1.7.2 or later, on desktop.

- **From the community catalogue**: _Settings → Community plugins → Browse_, search for **Native Slides**, then **Install** and **Enable**.
- **Manually**: download `main.js`, `manifest.json` and `styles.css` from the [latest release](https://github.com/l05k/obsidian-native-slides/releases/latest) into `<your vault>/.obsidian/plugins/native-slides/`, then enable **Native Slides** under _Settings → Community plugins_.

## Quick start

1. In a note, add the reserved property `deck: []` to its frontmatter, or run the **Initialize Slides with This Note** command. The note is now a one-slide deck.
2. Press `Cmd/Ctrl+Shift+E` (**Toggle Slides Mode**) to enter Slides mode, and again to leave it.
3. Press `Cmd/Ctrl+Shift+N` (**Create Next Slide**) to add a slide after the current one. The `deck` links are wired for you.
4. Flip with `Cmd/Ctrl+Shift+←/→`, and run **Show Slides Panel** to see and reorder the whole deck.

To see a finished deck first, open the repository's [`example-vault/`](example-vault/) and read `Welcome.md`.

## Features

- **Slides mode** (deck notes only): an immersive, editable card view, one screen per card, with six style templates and an optional card title taken from any property.
- **Native modes untouched**: Source, Live Preview and Reading keep Obsidian's behaviour. Slides mode is the plugin's only surface.
- **One property, `deck`**: each slide links to the next, so the chain is the deck. Page numbers are computed, never stored.
- **Slides bar**: configurable property columns, ◀ ▶ buttons and the page number.
- **Slides panel**: a sidebar list of the whole deck. Create, delete and drag slides to reorder them.
- **Presenting**: park the caret, hide the mouse pointer, and copy a layout-aware prompt for an AI assistant.
- **Context-aware commands**: each command appears in the palette only where it applies.

The details of every feature, the command table and the settings are in the [usage guide](docs/usage.md).

## Documentation

- **[Usage guide](docs/usage.md)** ([简体中文](docs/usage-zh.md)): every feature, command and setting, the slides panel, the example vault and the known limitations.
- **[Design principles & how it works](docs/design.md)** ([简体中文](docs/design-zh.md)): the four principles behind every change, and the mechanics of Slides mode, the deck chain and the create commands.
- **[Development](docs/development.md)** ([简体中文](docs/development-zh.md)): building, the dev loop, testing in `example-vault/` and the agent skills.
- **[Contributing](CONTRIBUTING.md)** and the **[changelog](CHANGELOG.md)**.

## Known limitations

- **Desktop only.** Mobile is not supported.
- Slides mode applies only to deck notes; every other note stays native.
- Properties come from frontmatter; inline `key:: value` properties are not read.
- A move in the slides panel writes frontmatter, so `Cmd/Ctrl+Z` does not undo it.

The full list is in the [usage guide](docs/usage.md#known-limitations).

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Yuanhui Luo.

## Credits

- **Lecture (jyy) style template**: modeled after the slideshow cards of [jyywiki.cn](https://jyywiki.cn) by [Yanyan Jiang](https://jyywiki.cn/). The card geometry (80vw width, soft shadow, thin bottom rule on headings, disc bullets with constant marker-to-text gap, list item spacing) is adapted from Jiang's lecture notes design.
