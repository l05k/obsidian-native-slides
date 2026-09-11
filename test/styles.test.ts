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
 */
const css = readFileSync(fileURLToPath(new URL("../styles.css", import.meta.url)), "utf8");
const flat = css.replace(/\s+/g, " ");

/** The declaration block of the rule whose selector contains `selector`. */
function ruleBySelector(selector: string): string {
  const at = css.indexOf(selector);
  if (at === -1) throw new Error(`no rule whose selector contains: ${selector}`);
  const open = css.indexOf("{", at);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close).replace(/\s+/g, " ");
}

/** The declaration block whose declarations contain `declaration`. */
function ruleByDeclaration(declaration: string): string {
  const at = css.indexOf(declaration);
  if (at === -1) throw new Error(`no rule containing: ${declaration}`);
  const open = css.lastIndexOf("{", at);
  const close = css.indexOf("}", at);
  return css.slice(open + 1, close).replace(/\s+/g, " ");
}

const CARD = ruleByDeclaration("width: var(--ns-card-w");
const TITLE = ruleBySelector("[data-ns-inline-title]");

describe("card width basis", () => {
  it("is declared once, capped by the container rather than a bare 80vw", () => {
    // The cap is the fix: min(<design width>, <container>) can never overflow
    // the pane the card sits in.
    expect(flat).toContain("--ns-card-w: min(80vw, 100%)");
  });

  it("sizes the card from that basis", () => {
    expect(CARD).toContain("width: var(--ns-card-w");
    expect(CARD).toContain("max-width: var(--ns-card-w");
  });

  it("positions the filename card title from the same basis", () => {
    // Whitespace-tolerant: Prettier decides where the calc() wraps.
    expect(TITLE).toMatch(/left: calc\(\s*\(100% - var\(--ns-card-w/);
    expect(TITLE).toMatch(/right: calc\(\s*\(100% - var\(--ns-card-w/);
  });

  it("leaves no uncapped viewport-width basis for either of them", () => {
    // Guards the #120 regression directly: a bare 80vw width, or a
    // `(100% - 80vw)` offset that assumes a centred fixed-width card.
    expect(flat).not.toMatch(/(?:width|max-width): 80vw/);
    expect(flat).not.toContain("(100% - 80vw)");
  });
});
