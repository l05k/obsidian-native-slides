import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Contract for the card's width basis (#120).
 *
 * The card (`.cm-content`) and the filename card title (`> .inline-title`,
 * the `[data-ns-inline-title]` rule) are positioned by two different rules,
 * and the title's `left`/`right` must be measured against the SAME basis as
 * the card's own width. When they disagree the title drifts off the card's
 * text column and the scroller clips its bottom rule short — the bug in #120,
 * where the card was a fixed `80vw` while the title's offset assumed it had
 * been centred in the pane.
 *
 * This is a CSS-text contract, not a behavioural test: the failure is pure
 * layout and the test environment has no layout engine (no jsdom here, so no
 * `getBoundingClientRect`). The rendered behaviour is verified in
 * `example-vault` over CDP — `docs/development.md#testing-in-the-example-vault`.
 *
 * The assertions match against the whole file flattened to one string of
 * *declarations* (comments stripped), so a Prettier-only re-wrap of a
 * `min()`/`var()`/`calc()` cannot fail them, and every property is anchored at
 * a `{` / `;` declaration boundary so `max-width` can never satisfy a `width`
 * assertion. They are deliberately file-scoped rather than rule-scoped:
 * locating a declaration by the very substring it is then asserted to contain
 * would make the assertion vacuous.
 */
const css = readFileSync(fileURLToPath(new URL("../styles.css", import.meta.url)), "utf8");
// Comments may discuss `80vw` without declaring anything — drop them first.
const flat = css.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\s+/g, " ");

describe("card width basis", () => {
  it("declares exactly one basis, capped by the container rather than a bare 80vw", () => {
    // The cap is the fix: min(<design width>, <container>) can never overflow
    // the pane the card sits in. Counting is what makes "one basis" mean one:
    // a second, competing declaration must fail this.
    const declarations = flat.match(/[{;]\s*--ns-card-w\s*:\s*min\(\s*80vw\s*,\s*100%\s*\)/g) ?? [];
    expect(declarations).toHaveLength(1);
  });

  it("consumes that basis from a width and from a max-width, not one or the other", () => {
    // `[{;]` is what keeps `max-width: …` from satisfying the `width` line.
    expect(flat).toMatch(/[{;]\s*width\s*:\s*var\(\s*--ns-card-w/);
    expect(flat).toMatch(/[{;]\s*max-width\s*:\s*var\(\s*--ns-card-w/);
  });

  it("positions the filename card title's left and right from the same basis", () => {
    // Whitespace-tolerant: Prettier decides where the calc() wraps.
    expect(flat).toMatch(/[{;]\s*left\s*:\s*calc\(\s*\(\s*100%\s*-\s*var\(\s*--ns-card-w/);
    expect(flat).toMatch(/[{;]\s*right\s*:\s*calc\(\s*\(\s*100%\s*-\s*var\(\s*--ns-card-w/);
  });

  it("leaves no uncapped viewport-width basis behind", () => {
    // Guards the #120 regression directly: a bare 80vw width, or a
    // `(100% - 80vw)` offset that assumes a centred fixed-width card — under
    // any wrapping, so Prettier alone can neither pass nor fail this.
    expect(flat).not.toMatch(/[{;]\s*(?:max-)?width\s*:\s*80vw/);
    expect(flat).not.toMatch(/\(\s*100%\s*-\s*80vw\s*\)/);
  });
});
