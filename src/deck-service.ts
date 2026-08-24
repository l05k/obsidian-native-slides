import { App, Notice, TFile } from "obsidian";
import {
  planCreateNew as planNew,
  planCreateNext as plan,
  type CreateNextResult,
} from "./createNext";
import { computeDeck, extractLinks, extractRawLinks, type DeckInfo } from "./deck";
import { frontmatterOf } from "./mode";
import { DECK_KEY } from "./types";

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

  /** Apply a plan: create the note, rewire `deck` properties, open it */
  async executeCreateNext(file: TFile, plan: CreateNextResult): Promise<void> {
    const dir = file.parent?.path ? file.parent.path + "/" : "";
    const newPath = `${dir}${plan.newName}.md`;
    const frontmatter = plan.newDeckLinks.map((link) => JSON.stringify(link)).join(", ");
    const content = `---\ndeck: [${frontmatter}]\n---\n`;

    let newFile: TFile;
    try {
      newFile = await this.app.vault.create(newPath, content);
    } catch (error) {
      new Notice(`Native Slides: could not create "${plan.newName}.md" (${String(error)})`);
      return;
    }

    // Rewire the current note's `deck` (keeps all other properties intact)
    for (const rewrite of plan.rewrites) {
      if (rewrite.name !== file.basename) continue; // in practice always the current note
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        fm[DECK_KEY] = rewrite.deck;
      });
    }

    // Open the new note in the current pane, edit mode (Live Preview)
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(newFile, { state: { mode: "source" } });
  }
}
