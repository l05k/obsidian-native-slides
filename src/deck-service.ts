import { App, Notice, TFile } from "obsidian";
import {
  planCreateNew as planNew,
  planCreateNext as plan,
  planMakeFirstSlide as planFirst,
  type CreateNextResult,
} from "./createNext";
import { computeDeck, extractLinks, extractRawLinks, type DeckInfo } from "./deck";
import { pickLandingPath, planDeleteSlides } from "./deleteSlides";
import { frontmatterOf } from "./mode";
import type { ReorderPlan } from "./reorder";
import { DECK_KEY } from "./types";

/** Result of a Delete slides run */
export interface DeleteSlidesResult {
  /** Paths actually moved to the trash */
  trashed: string[];
  /** Where the editor should land afterwards (null = keep current note) */
  landingPath: string | null;
}

/** Deck chain resolution + "Create Next Slide" glue (wraps the pure core). */
export class DeckService {
  constructor(private app: App) {}

  /**
   * Whether the note belongs to a deck: it holds a `deck` property (even
   * empty — a fresh single slide) or some other slide declares it as its
   * next slide.
   */
  isMember(file: TFile): boolean {
    const fm = frontmatterOf(this.app, file);
    return (fm !== null && DECK_KEY in fm) || this.prevOf(file.path) !== undefined;
  }

  /** Resolve the current note's position inside its deck (null when not a member) */
  compute(file: TFile): DeckInfo | null {
    if (!this.isMember(file)) return null;
    return computeDeck(
      file.path,
      (path) => this.linkPaths(path),
      (path) => this.prevOf(path),
    );
  }

  /** Resolved next-slide paths of the note at `path` ([] when none, or the link is broken) */
  nextLinks(path: string): string[] {
    return this.linkPaths(path);
  }

  /** Resolve the `deck` property of a note into real note paths (max one) */
  private linkPaths(path: string): string[] {
    const f = this.app.vault.getAbstractFileByPath(path);
    if (!(f instanceof TFile)) return [];
    const fm = frontmatterOf(this.app, f);
    const names = fm ? extractLinks(fm[DECK_KEY]) : [];
    return names
      .map((name) => this.app.metadataCache.getFirstLinkpathDest(name, path))
      .filter((x): x is TFile => !!x)
      .map((x) => x.path);
  }

  /**
   * The note whose `deck` property points at `path` (the previous slide in
   * the chain). With next-only semantics this backward lookup is the only
   * way to reach the chain head from a middle/last slide.
   */
  private prevOf(path: string): string | undefined {
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.path === path) continue;
      if (this.linkPaths(f.path)[0] === path) return f.path;
    }
    return undefined;
  }

  /** Names in the `deck` property that resolve to no note (broken links) */
  broken(file: TFile): string[] {
    const fm = frontmatterOf(this.app, file);
    const names = fm ? extractLinks(fm[DECK_KEY]) : [];
    return names.filter((name) => !this.app.metadataCache.getFirstLinkpathDest(name, file.path));
  }

  /**
   * Plan a "Create Next Slide" run for the active note. Deck slides
   * insert/append after the current note. (Plain notes are routed to
   * planCreateNew by the command — this core still handles them as
   * "no usable next link → append".)
   */
  planCreateNext(file: TFile): CreateNextResult | null {
    const fm = frontmatterOf(this.app, file);
    const raw = fm ? extractRawLinks(fm[DECK_KEY]) : [];
    const existingNames = new Set(this.app.vault.getMarkdownFiles().map((f) => f.basename));
    return plan({ currentName: file.basename, currentLinks: raw, existingNames });
  }

  /**
   * Plan a "Create New Slide" run: a brand-new deck's first page in the
   * same folder as the active note, which itself stays untouched.
   */
  planCreateNew(): CreateNextResult {
    const existingNames = new Set(this.app.vault.getMarkdownFiles().map((f) => f.basename));
    return planNew({ existingNames });
  }

  /** Apply a Create Next Slide plan; open=false keeps the current note in the editor */
  async executeCreateNext(file: TFile, plan: CreateNextResult, open = true): Promise<void> {
    await this.applyPlan(file, plan, dirPrefix(file.parent?.path), open);
  }

  /**
   * Apply a Create New Slide plan. Lands in Obsidian's default new-note
   * location (Settings → Files & links → Default location for new notes);
   * with "same folder as current" configured that is the active note's own
   * folder. Works with no note open at all (blank tab).
   */
  async executeCreateNew(plan: CreateNextResult): Promise<void> {
    const sourcePath = this.app.workspace.getActiveFile()?.path ?? "";
    await this.applyPlan(
      null,
      plan,
      dirPrefix(this.app.fileManager.getNewFileParent(sourcePath)?.path),
    );
  }

  /**
   * Promote the active note into the head of a brand-new deck: add `deck: []`
   * to its frontmatter — content, title, location and every other property
   * stay untouched. Notes that already belong to a deck are left alone.
   * Returns true when the note was converted (the caller may then auto-enter
   * Slides mode), false when it was already a deck member.
   */
  async makeFirstSlide(file: TFile): Promise<boolean> {
    if (planFirst({ alreadyDeck: this.isMember(file) }) === null) return false;
    await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => {
      fm[DECK_KEY] = [];
    });
    // Obsidian indexes a saved file asynchronously; the command's auto-enter
    // reads the cache, so hand back only once the new `deck` is visible.
    await this.waitForCachedDeck(file);
    return true;
  }

  /**
   * Wait until the metadata cache reflects the note's `deck` property
   * (best effort — resolves on the property appearing, or after `timeoutMs`).
   */
  private async waitForCachedDeck(file: TFile, timeoutMs = 2000): Promise<void> {
    if (this.hasDeckInCache(file)) return;
    await new Promise<void>((resolve) => {
      const ref = this.app.metadataCache.on("changed", (changed: TFile) => {
        if (changed.path === file.path && this.hasDeckInCache(file)) {
          this.app.metadataCache.offref(ref);
          window.clearTimeout(timer);
          resolve();
        }
      });
      const timer = window.setTimeout(() => {
        this.app.metadataCache.offref(ref);
        resolve();
      }, timeoutMs);
    });
  }

  /** Whether the metadata cache already shows a `deck` property on the note */
  private hasDeckInCache(file: TFile): boolean {
    const fm = frontmatterOf(this.app, file);
    return fm !== null && DECK_KEY in fm;
  }

  /** Apply a plan: create the note, rewire `deck` properties, optionally open it */
  private async applyPlan(
    file: TFile | null,
    plan: CreateNextResult,
    dir: string,
    open = true,
  ): Promise<void> {
    const newPath = `${dir}${plan.newName}.md`;
    const frontmatter = plan.newDeckLinks.map((link) => JSON.stringify(link)).join(", ");
    const content = `---\ndeck: [${frontmatter}]\n---\n`;

    let newFile: TFile;
    try {
      newFile = await this.app.vault.create(newPath, content);
    } catch (error) {
      new Notice(`Native slides: could not create "${plan.newName}.md" (${String(error)})`);
      return;
    }

    // Rewire the current note's `deck` (keeps all other properties intact)
    for (const rewrite of plan.rewrites) {
      if (!file || rewrite.name !== file.basename) continue; // in practice always the current note
      await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => {
        fm[DECK_KEY] = rewrite.deck;
      });
    }

    if (!open) return;

    // Open the new note in the current pane, edit mode (Live Preview)
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(newFile, { state: { mode: "source" } });
  }

  /**
   * Apply a reorder plan: rewrite the `deck` property of every slide whose
   * next link changed, in new chain order, as bare `[[basename]]` links (the
   * form createNext and deleteSlides write). Only the notes the plan names are
   * touched — the rest of the deck keeps its frontmatter untouched.
   *
   * Stops at the first failed write and returns false: the remaining notes
   * keep their old links, which the caller shows by re-rendering from the live
   * chain. Returns true when every rewrite was applied.
   */
  async executeReorder(plan: ReorderPlan): Promise<boolean> {
    for (const rewrite of plan.rewrites) {
      const file = this.app.vault.getAbstractFileByPath(rewrite.path);
      if (!(file instanceof TFile)) {
        new Notice(`Native slides: could not reorder slides — "${rewrite.path}" is gone`);
        return false;
      }
      const next = rewrite.nextPath ? this.app.vault.getAbstractFileByPath(rewrite.nextPath) : null;
      try {
        await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => {
          fm[DECK_KEY] = next instanceof TFile ? [`[[${next.basename}]]`] : [];
        });
      } catch (error) {
        new Notice(
          `Native slides: could not reorder slides — writing "${file.basename}" failed (${String(error)})`,
        );
        return false;
      }
    }
    return true;
  }

  /**
   * Delete slides out of an ordered deck chain: splice the chain around
   * every deleted run (the predecessor's `deck` takes over the run's first
   * survivor), then move each deleted note to the trash. `focusPath` is the
   * note the editor currently shows — when it is among the deleted, the
   * result names the nearest surviving neighbour to open instead.
   */
  async executeDeleteSlides(
    chain: string[],
    deletePaths: ReadonlySet<string>,
    focusPath: string | null,
  ): Promise<DeleteSlidesResult> {
    const rewrites = planDeleteSlides(chain, deletePaths);

    for (const rewrite of rewrites) {
      const f = this.app.vault.getAbstractFileByPath(rewrite.path);
      if (!(f instanceof TFile)) continue;
      const next = rewrite.nextPath ? this.app.vault.getAbstractFileByPath(rewrite.nextPath) : null;
      await this.app.fileManager.processFrontMatter(f, (fm: Record<string, unknown>) => {
        fm[DECK_KEY] = next instanceof TFile ? [`[[${next.basename}]]`] : [];
      });
    }

    const trashed: string[] = [];
    for (const path of deletePaths) {
      const f = this.app.vault.getAbstractFileByPath(path);
      if (!(f instanceof TFile)) continue;
      try {
        await this.app.fileManager.trashFile(f);
        trashed.push(path);
      } catch (error) {
        new Notice(`Native slides: could not delete "${f.basename}" (${String(error)})`);
      }
    }

    return { trashed, landingPath: pickLandingPath(chain, deletePaths, focusPath) };
  }
}

/** Folder path → trailing-slash prefix ("" for vault root) */
function dirPrefix(path: string | undefined): string {
  if (!path || path === "/") return "";
  return `${path.replace(/\/+$/, "")}/`;
}
