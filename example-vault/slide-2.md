---
deck: ["[[slide-3]]"]
---

# Slide 2 · One property drives the deck

Each page's frontmatter drives the deck — just one reserved key, **next-only**:

- `deck: ["[[next-slide]]"]` → the single link **is the next slide** (this page links to `slide-3`)
- the **last slide** has no link: `deck: []`
- any other frontmatter key can be shown in the slides bar via _Bar properties_

Some typography on the side: **bold**, _italic_, `inline code`, an [external link](https://obsidian.md) and an [[welcome|internal link]].

> Blockquotes render with a thin left rule, like the lecture notes this template is modeled after.

Press `Cmd/Ctrl + Shift + ←` to go back to slide 1.
