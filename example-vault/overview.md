---
deck: ["[[welcome]]"]
---

# Deck index · Page 1

This note is the **first page (the head)** of the demo deck. Since v1.0.0 the `deck` property is **next-only**: its single link (`welcome`) is simply the next slide — no overview back-links, no special roles.

**Seeing the whole deck:** run the **Show slides panel** command (or click the presentation ribbon icon) — the sidebar panel lists every slide of the deck in chain order and jumps to the one you click.

**Convention for the `deck` property** (one property, at most one link):

- **Slide:** `deck: ["[[next-slide]]"]` — the next slide in the chain.
- **Last slide:** `deck: []` — no link at all.
- **Create Next Slide command:** run "Create next slide" on any slide to insert/append a new page after it (named `<current>-next`, collision-aware); the `deck` links are rewired automatically. Run it on a note that is not part of a deck to **start a brand-new deck**. If a slide's link points to a missing note, that exact note is created instead (fixing the ⚠ warning).

Page numbers are computed automatically by walking these links (1-based, head = 1), so no `page-number` property is needed. Open `welcome.md` and enter Slides mode (`Cmd/Ctrl+Shift+E`) to flip through the deck.
