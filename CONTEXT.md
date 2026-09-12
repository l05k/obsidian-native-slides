# Native Slides

An Obsidian plugin that presents a group of notes as a slide show: one `deck`
frontmatter property links a note to the slide that follows it, and Slides mode
renders each note as a single-screen card.

## Language

**Deck**:
A set of notes presented as one slide show, wired together by their `deck` links.
_Avoid_: slideshow, presentation, collection

**Slide**:
One note of a deck — the unit the reader sees as a single screen.
_Avoid_: page, card (when deck membership is what matters)

**Deck chain**:
The slides of a deck in presentation order, from the head slide to the last one.
_Avoid_: deck order, slide list, sequence

**Head slide**:
The first slide of a deck chain — the slide page 1 belongs to.
_Avoid_: first page, root, start

**Next link**:
The single markdown link a slide's `deck` property holds, naming the slide that
follows it. The last slide of a chain holds none.
_Avoid_: deck pointer, forward reference

**Move a slide**:
Changing one slide's position in its deck chain — by dragging it in the slides
panel, or with Move up / Move down. A move rewires the next links around it, and
the deck is reordered as a result.
_Avoid_: reorder (as the name of the operation), sort, drag-and-drop

**Slides panel**:
The sidebar view that lists every slide of the active note's deck in chain order,
and where slides are opened, created, moved and deleted.
_Avoid_: overview, deck list, sidebar

**Slides mode**:
The immersive single-screen card view of one slide. Entered from a deck note,
left again with the same command or Escape.
_Avoid_: presentation mode, fullscreen, preview

**Slides bar**:
The bar shown in Slides mode, carrying the configured properties, ◀ ▶ navigation
and the page number.
_Avoid_: status bar, toolbar, bottom bar

**Page number**:
A slide's 1-based position in its deck chain — the head slide is page 1.
_Avoid_: index, slide number
