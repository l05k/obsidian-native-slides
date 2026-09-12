# Slide order is the next-link chain, not a stored order

A deck's order is defined by the `deck` links themselves — every slide names the
one that follows it — so moving a slide rewires those links instead of writing a
position into each note: `planReorder()` turns "these slides, this gap" into one
`deck` rewrite per slide whose next link changed, and nothing else in the plugin
(navigation, page numbers, the slides bar, the slides panel, deletion) has to
know that a move happened. The alternative, a per-slide `deck-order` property,
would store the same fact twice and add a second reserved key, breaking the
plugin's "exactly one key, `deck`" rule (design principle 2) and forcing every
reader of a deck to sort before it could walk a chain. The price of the decision
is that a single move writes frontmatter to several notes at once, and
frontmatter writes are not part of the editor's undo history — so a move is
undone by moving the slide back, not by `Cmd/Ctrl+Z`.

## Considered options

- **`deck-order: 3` on every slide** (or any other stored position): two sources
  of truth for one fact, a second reserved key, and every deck consumer has to
  sort — a much larger change than the move itself, for a plugin whose whole
  premise is that the deck _is_ the notes.
- **A list-valued `deck` property** (each slide declaring every slide after it):
  the order would be a list by construction, but this is the model v1.0.0
  deliberately dropped ([#67](https://github.com/l05k/obsidian-native-slides/issues/67))
  in favour of next-only links, and it would rewrite the whole deck on every
  move instead of the few links around the moved block.
