import { describe, expect, it } from "vitest";
import { planCreateNext } from "../src/createNext";

const noNames = new Set<string>();

describe("planCreateNext (v1.0.0 next-only semantics)", () => {
  // ── no next link → append / start a new deck ───────────────────────────

  it("appends a new last slide after a last slide (empty deck list)", () => {
    const plan = planCreateNext({
      currentName: "slide-3",
      currentLinks: [],
      existingNames: noNames,
    })!;
    expect(plan.newName).toBe("slide-3-next");
    expect(plan.newDeckLinks).toEqual([]);
    expect(plan.rewrites).toEqual([{ name: "slide-3", deck: ["[[slide-3-next]]"] }]);
  });

  it("starts a brand-new deck from a plain note (no deck property)", () => {
    const plan = planCreateNext({
      currentName: "my-note",
      currentLinks: [],
      existingNames: noNames,
    })!;
    expect(plan.newName).toBe("my-note-next");
    expect(plan.newDeckLinks).toEqual([]);
    expect(plan.rewrites).toEqual([{ name: "my-note", deck: ["[[my-note-next]]"] }]);
  });

  // ── valid next → insert between ────────────────────────────────────────

  it("inserts between the current slide and its valid next", () => {
    const plan = planCreateNext({
      currentName: "slide-2",
      currentLinks: ["[[slide-3]]"],
      existingNames: new Set(["slide-3"]),
    })!;
    expect(plan.newName).toBe("slide-2-next");
    expect(plan.newDeckLinks).toEqual(["[[slide-3]]"]);
    expect(plan.rewrites).toEqual([{ name: "slide-2", deck: ["[[slide-2-next]]"] }]);
  });

  it("preserves the original link text (alias forms) in the new note", () => {
    const plan = planCreateNext({
      currentName: "slide-2",
      currentLinks: ["[[slide-3|Next]]"],
      existingNames: new Set(["slide-3"]),
    })!;
    expect(plan.newDeckLinks).toEqual(["[[slide-3|Next]]"]);
    expect(plan.rewrites[0].deck).toEqual(["[[slide-2-next]]"]);
  });

  // ── broken next → create the missing note ──────────────────────────────

  it("creates the missing declared next note (fixes the broken link)", () => {
    const plan = planCreateNext({
      currentName: "welcome",
      currentLinks: ["[[missing-slide]]"],
      existingNames: noNames,
    })!;
    expect(plan.newName).toBe("missing-slide");
    expect(plan.newDeckLinks).toEqual([]);
    expect(plan.rewrites).toEqual([]);
  });

  it("creates the missing note even when the link carries an alias", () => {
    const plan = planCreateNext({
      currentName: "welcome",
      currentLinks: ["[[missing-slide|Draft]]"],
      existingNames: noNames,
    })!;
    expect(plan.newName).toBe("missing-slide");
    expect(plan.newDeckLinks).toEqual([]);
  });

  it("treats a path-qualified broken link as invalid → appends a new last slide", () => {
    const plan = planCreateNext({
      currentName: "welcome",
      currentLinks: ["[[sub/missing]]"],
      existingNames: noNames,
    })!;
    expect(plan.newName).toBe("welcome-next");
    expect(plan.newDeckLinks).toEqual([]);
    expect(plan.rewrites[0].deck).toEqual(["[[welcome-next]]"]);
  });

  it("treats a self-referencing broken link as invalid → appends a new last slide", () => {
    const plan = planCreateNext({
      currentName: "welcome",
      currentLinks: ["[[welcome]]"],
      existingNames: noNames,
    })!;
    expect(plan.newName).toBe("welcome-next");
    expect(plan.newDeckLinks).toEqual([]);
  });

  it("inserts normally when the declared next note already exists", () => {
    const plan = planCreateNext({
      currentName: "welcome",
      currentLinks: ["[[slide-2]]"],
      existingNames: new Set(["slide-2"]),
    })!;
    expect(plan.newName).toBe("welcome-next");
    expect(plan.newDeckLinks).toEqual(["[[slide-2]]"]);
  });

  // ── naming collisions ──────────────────────────────────────────────────

  it("dedups the new name against existing note basenames", () => {
    const plan = planCreateNext({
      currentName: "welcome",
      currentLinks: [],
      existingNames: new Set(["welcome-next", "welcome-next-2"]),
    })!;
    expect(plan.newName).toBe("welcome-next-3");
  });
});
