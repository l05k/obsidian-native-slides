import { describe, expect, it } from "vitest";
import { pickLandingPath, planDeleteSlides } from "../src/deleteSlides";

describe("planDeleteSlides", () => {
  const chain = ["a.md", "b.md", "c.md", "d.md"];

  it("returns no rewrites when nothing is deleted", () => {
    expect(planDeleteSlides(chain, new Set())).toEqual([]);
  });

  it("splices the predecessor to the successor when deleting a middle slide", () => {
    expect(planDeleteSlides(chain, new Set(["b.md"]))).toEqual([
      { path: "a.md", nextPath: "c.md" },
    ]);
  });

  it("empties the predecessor's deck when deleting the last slide", () => {
    expect(planDeleteSlides(chain, new Set(["d.md"]))).toEqual([{ path: "c.md", nextPath: null }]);
  });

  it("needs no rewrites when deleting the head only (successor keeps its own link)", () => {
    expect(planDeleteSlides(chain, new Set(["a.md"]))).toEqual([]);
  });

  it("splices across runs of consecutive deletions", () => {
    expect(planDeleteSlides(chain, new Set(["b.md", "c.md"]))).toEqual([
      { path: "a.md", nextPath: "d.md" },
    ]);
  });

  it("handles several separate deletion runs", () => {
    expect(planDeleteSlides(chain, new Set(["b.md", "d.md"]))).toEqual([
      { path: "a.md", nextPath: "c.md" },
      { path: "c.md", nextPath: null },
    ]);
  });

  it("handles head-inclusive runs without touching the first survivor", () => {
    expect(planDeleteSlides(chain, new Set(["a.md", "b.md"]))).toEqual([]);
  });

  it("returns no rewrites when every slide is deleted", () => {
    expect(planDeleteSlides(chain, new Set(chain))).toEqual([]);
  });

  it("ignores paths outside the chain", () => {
    expect(planDeleteSlides(chain, new Set(["x.md"]))).toEqual([]);
  });

  it("works on single-slide chains", () => {
    expect(planDeleteSlides(["solo.md"], new Set(["solo.md"]))).toEqual([]);
  });
});

describe("pickLandingPath", () => {
  const chain = ["a.md", "b.md", "c.md", "d.md"];

  it("returns null when the focused note survives", () => {
    expect(pickLandingPath(chain, new Set(["b.md"]), "a.md")).toBeNull();
    expect(pickLandingPath(chain, new Set(["b.md"]), null)).toBeNull();
  });

  it("prefers the nearest survivor after the focus", () => {
    expect(pickLandingPath(chain, new Set(["b.md"]), "b.md")).toBe("c.md");
  });

  it("falls back to the nearest survivor before the focus", () => {
    expect(pickLandingPath(chain, new Set(["c.md", "d.md"]), "d.md")).toBe("b.md");
  });

  it("lands on the head's successor after a head-only deletion", () => {
    expect(pickLandingPath(chain, new Set(["a.md"]), "a.md")).toBe("b.md");
  });

  it("returns null when everything around is gone", () => {
    expect(pickLandingPath(["a.md"], new Set(["a.md"]), "a.md")).toBeNull();
  });

  it("returns null for paths missing from the chain", () => {
    expect(pickLandingPath(chain, new Set(["b.md"]), "x.md")).toBeNull();
  });
});
