import { describe, expect, it } from "vitest";
import { planReorder, stepInsertAt } from "../src/reorder";

describe("planReorder", () => {
  const chain = ["a.md", "b.md", "c.md", "d.md"];

  it("returns null for a chain that cannot be reordered", () => {
    expect(planReorder(["solo.md"], ["solo.md"], 0)).toBeNull();
    expect(planReorder([], [], 0)).toBeNull();
  });

  it("returns null when nothing (or everything) is moving", () => {
    expect(planReorder(chain, [], 0)).toBeNull();
    expect(planReorder(chain, ["x.md"], 0)).toBeNull();
    expect(planReorder(chain, chain, 0)).toBeNull();
  });

  it("returns null for an insertAt outside the gaps", () => {
    expect(planReorder(chain, ["b.md"], -1)).toBeNull();
    expect(planReorder(chain, ["b.md"], chain.length + 1)).toBeNull();
    expect(planReorder(chain, ["b.md"], 1.5)).toBeNull();
  });

  it("moves a slide to the tail (gap = chain.length)", () => {
    const plan = planReorder(chain, ["b.md"], chain.length);
    expect(plan?.chain).toEqual(["a.md", "c.md", "d.md", "b.md"]);
    expect(plan?.rewrites).toEqual([
      { path: "a.md", nextPath: "c.md" },
      { path: "d.md", nextPath: "b.md" },
      { path: "b.md", nextPath: null },
    ]);
  });

  it("moves the tail slide to the head (gap = 0)", () => {
    const plan = planReorder(chain, ["d.md"], 0);
    expect(plan?.chain).toEqual(["d.md", "a.md", "b.md", "c.md"]);
    // The new head takes over the old head's link; the new tail closes the chain
    expect(plan?.rewrites).toEqual([
      { path: "d.md", nextPath: "a.md" },
      { path: "c.md", nextPath: null },
    ]);
  });

  it("rewires the three notes an adjacent swap touches", () => {
    const plan = planReorder(chain, ["b.md"], 3);
    expect(plan?.chain).toEqual(["a.md", "c.md", "b.md", "d.md"]);
    expect(plan?.rewrites).toEqual([
      { path: "a.md", nextPath: "c.md" },
      { path: "c.md", nextPath: "b.md" },
      { path: "b.md", nextPath: "d.md" },
    ]);
  });

  it("moves a non-contiguous selection as one block, keeping the rest in order", () => {
    const five = ["1.md", "2.md", "3.md", "4.md", "5.md"];
    const plan = planReorder(five, ["2.md", "4.md"], five.length);
    expect(plan?.chain).toEqual(["1.md", "3.md", "5.md", "2.md", "4.md"]);
  });

  it("keeps the block in chain order whatever order the moving paths arrive in", () => {
    const plan = planReorder(chain, ["d.md", "b.md"], 0);
    expect(plan?.chain).toEqual(["b.md", "d.md", "a.md", "c.md"]);
  });

  it("treats a gap inside the moving block as a no-op", () => {
    const plan = planReorder(chain, ["b.md"], 2);
    expect(plan?.chain).toEqual(chain);
    expect(plan?.rewrites).toEqual([]);

    const block = planReorder(chain, ["b.md", "c.md"], 3);
    expect(block?.chain).toEqual(chain);
    expect(block?.rewrites).toEqual([]);
  });

  it("drops the moving slide onto its own gap without a rewrite", () => {
    const plan = planReorder(chain, ["c.md"], 2);
    expect(plan?.chain).toEqual(chain);
    expect(plan?.rewrites).toEqual([]);
  });

  it("ignores moving paths outside the chain", () => {
    const plan = planReorder(chain, ["b.md", "x.md"], 0);
    expect(plan?.chain).toEqual(["b.md", "a.md", "c.md", "d.md"]);
  });

  it("closes the chain with a null next when the new tail had a link", () => {
    const plan = planReorder(chain, ["a.md"], chain.length);
    expect(plan?.rewrites).toContainEqual({ path: "a.md", nextPath: null });
  });
});

describe("stepInsertAt", () => {
  const chain = ["a.md", "b.md", "c.md", "d.md"];

  it("steps a single slide in both directions", () => {
    expect(stepInsertAt(chain, ["b.md"], "up")).toBe(0);
    expect(stepInsertAt(chain, ["b.md"], "down")).toBe(3);
  });

  it("refuses to step past either end of the chain", () => {
    expect(stepInsertAt(chain, ["a.md"], "up")).toBeNull();
    expect(stepInsertAt(chain, ["d.md"], "down")).toBeNull();
  });

  it("steps a whole block by one position", () => {
    expect(stepInsertAt(chain, ["c.md", "d.md"], "up")).toBe(1);
    expect(stepInsertAt(chain, ["b.md", "c.md"], "down")).toBe(4);
  });

  it("refuses a block already at that end", () => {
    expect(stepInsertAt(chain, ["a.md", "b.md"], "up")).toBeNull();
    expect(stepInsertAt(chain, ["c.md", "d.md"], "down")).toBeNull();
  });

  it("returns null when no moving path is in the chain", () => {
    expect(stepInsertAt(chain, ["x.md"], "up")).toBeNull();
    expect(stepInsertAt(chain, [], "down")).toBeNull();
    expect(stepInsertAt(["solo.md"], ["solo.md"], "up")).toBeNull();
    expect(stepInsertAt(["solo.md"], ["solo.md"], "down")).toBeNull();
  });

  it("produces a gap planReorder accepts", () => {
    const gap = stepInsertAt(chain, ["c.md"], "down");
    expect(gap).not.toBeNull();
    expect(planReorder(chain, ["c.md"], gap ?? -1)?.chain).toEqual([
      "a.md",
      "b.md",
      "d.md",
      "c.md",
    ]);
  });
});
