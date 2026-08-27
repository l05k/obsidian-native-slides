/**
 * native-slides — a "Slides mode" for Obsidian deck notes
 *
 * One reserved frontmatter key, `deck` (a single markdown link to the next
 * slide — next-only semantics, no overview page since v1.0.0), drives
 * prev/next navigation and auto-computed page numbers. A deck note can be
 * entered into **Slides mode** — an immersive, editable (Live Preview) view
 * with a slides bar showing properties, navigation and the page number.
 *
 * Native Obsidian modes (Source / default Live Preview / Reading view) are
 * left completely untouched: no status-bar hiding, no slides bar, no
 * fullscreen, no styling. Slides mode is the plugin's only surface.
 *
 * This file is the entry point and a thin orchestration layer; the logic
 * lives in `src/`:
 *   - src/types.ts        settings shape + defaults + reserved `deck` key
 *   - src/mode.ts         view mode / frontmatter helpers (pure, `App`-based)
 *   - src/deck-service.ts deck chain resolution + "create next slide" glue
 *   - src/bar.ts          bar DOM helpers (create / buttons / tab-bar measure)
 *   - src/panel.ts        slides sidebar panel (deck slide list)
 *   - src/commands.ts     command registration (dev-gated debug command)
 *   - src/settings.ts     settings tab
 *   - src/debug.ts        typography measurement tooling (dev builds only)
 *   - src/deck.ts         pure deck core (with src/createNext.ts)
 */

import { MarkdownView, Plugin, TFile } from "obsidian";
import { createBar, navButton, syncTabBarHeight } from "./src/bar";
import { registerCommands } from "./src/commands";
import { DeckService } from "./src/deck-service";
import { formatValue } from "./src/deck";
import { activeFrontmatter, currentMode, frontmatterOf, isLivePreview } from "./src/mode";
import { SlidesPanelView, SLIDES_PANEL_VIEW } from "./src/panel";
import { NativeSlidesSettingTab } from "./src/settings";
import { DECK_KEY, DEFAULT_SETTINGS, SLIDES_THEMES, type NativeSlidesSettings } from "./src/types";
import { clearChildren } from "./src/utils";

export default class NativeSlidesPlugin extends Plugin {
  /** The slides bar DOM element */
  bar: HTMLElement | null = null;
  /** Deck chain resolution + "create next slide" glue */
  deckService!: DeckService;
  /** Plugin settings */
  settings: NativeSlidesSettings = { ...DEFAULT_SETTINGS };

  /** Whether Slides mode is currently active (session state, not persisted) */
  private slidesMode = false;
  /** View mode to restore when leaving Slides mode ("preview" | "source") */
  private exitMode: "preview" | "source" = "source";
  /** Whether the exit view was Source mode (true) vs Live Preview (false) */
  private exitSource = false;
  /** Last note auto-entered into Slides mode (prevents re-entering after manual exit) */
  private autoEnteredPath = "";
  /** Last refresh key ("path|mode") to avoid pointless re-renders */
  private lastKey = "";
  /** Last measured tab-bar height (px) — cached while the slides bar is hidden */
  private tabBarHeight = 0;
  /** Whether the mouse pointer is hidden for presenting (session state) */
  pointerHidden = false;
  /** Mutation observer keeping the solo-image tags fresh */
  private soloImageObserver: MutationObserver | null = null;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.deckService = new DeckService(this.app);
    this.addSettingTab(new NativeSlidesSettingTab(this));

    // ── 1. Refresh on "current note / view changed" events ──────────────
    this.registerEvent(
      this.app.workspace.on("file-open", () => {
        this.maybeAutoEnterSlides();
        this.refresh();
      }),
    );
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.refresh()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.refresh()));
    // Refresh when the note content (including frontmatter) changes / saves
    this.registerEvent(
      this.app.metadataCache.on("changed", (file: TFile) => {
        if (file === this.app.workspace.getActiveFile()) this.refresh();
      }),
    );

    // ── 2. Fallback timer: edit↔reading toggles may fire no standard event ──
    this.registerInterval(
      window.setInterval(() => {
        const file = this.app.workspace.getActiveFile();
        const key = file ? `${file.path}|${currentMode(this.app)}` : "";
        if (key !== this.lastKey) {
          this.lastKey = key;
          this.refresh();
        }
      }, 500),
    );

    // ── 2b. Solo-image safety net: re-tag once a second while Slides mode
    // is active. The mutation path re-tags immediately, but Obsidian's
    // asynchronous editor rebuilds leave a small attach-race window where a
    // re-rendered line escapes the observer; the interval guarantees the
    // class converges within 500ms. It is idempotent (classList.toggle is a
    // no-op when the class is already present) so it causes no flicker. ──
    this.registerInterval(
      window.setInterval(() => {
        if (this.slidesMode && this.soloImageObserver) this.tagCurrentContent();
      }, 500),
    );

    // ── 3. Commands ─────────────────────────────────────────────────────
    registerCommands(this);

    // ── 3b. Slides sidebar panel (deck overview, replaces the old overview page) ──
    this.registerView(SLIDES_PANEL_VIEW, (leaf) => new SlidesPanelView(this, leaf));
    this.addRibbonIcon("presentation", "Show slides panel", () => {
      void this.activateSlidesPanel();
    });

    // ── 4. Pin the Slides editor to one screen ───────────────────────────
    // CSS `overflow: hidden` blocks the wheel, but native drag-select
    // autoscroll and CodeMirror's programmatic scrollIntoView still move the
    // scroller. This capture-phase listener resets any scroll inside the
    // active markdown view back to the top while Slides mode is active.
    this.registerDomEvent(
      document,
      "scroll",
      (evt) => {
        if (!document.body.classList.contains("native-slides-mode")) return;
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return;
        const el = evt.target;
        if (el instanceof HTMLElement && view.contentEl.contains(el)) {
          if (el.scrollTop !== 0) el.scrollTop = 0;
          if (el.scrollLeft !== 0) el.scrollLeft = 0;
        }
      },
      { capture: true },
    );

    // ── 5. Escape key exits Slides mode ─────────────────────────────────
    this.registerDomEvent(document, "keydown", (evt: KeyboardEvent) => {
      if (evt.key === "Escape" && this.slidesMode && this.settings.escExitsSlides) {
        this.exitSlides();
      }
    });

    // ── 6. Create the slides bar and do the first render ────────────────
    this.bar = createBar();
    document.body.appendChild(this.bar);
    this.refresh();
  }

  onunload(): void {
    this.soloImageObserver?.disconnect();
    this.soloImageObserver = null;
    this.bar?.remove();
    this.bar = null;
    document.body.classList.remove("native-slides-mode");
    document.body.classList.remove("native-slides-pointer-hidden");
    this.removeThemeClasses();
  }

  // ── Settings ──────────────────────────────────────────────────────────

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as Partial<NativeSlidesSettings> | null;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  // ── Slides mode ───────────────────────────────────────────────────────

  /** Whether the active note is a deck note (has a `deck` property) */
  private isDeckNote(file: TFile | null): boolean {
    if (!file) return false;
    const fm = frontmatterOf(this.app, file);
    return fm !== null && DECK_KEY in fm;
  }

  /** Remove every `native-slides-theme-*` class from <body> */
  private removeThemeClasses(): void {
    for (const cls of Array.from(document.body.classList)) {
      if (cls.startsWith("native-slides-theme-")) document.body.classList.remove(cls);
    }
  }

  /**
   * Keep the single `native-slides-theme-<id>` body class in sync with the
   * `slidesTheme` setting — the style templates in styles.css hook off it.
   * Unknown ids (e.g. after a downgrade) fall back to the default theme.
   */
  private applyThemeClass(): void {
    const id = SLIDES_THEMES.some((t) => t.id === this.settings.slidesTheme)
      ? this.settings.slidesTheme
      : DEFAULT_SETTINGS.slidesTheme;
    const cls = `native-slides-theme-${id}`;
    for (const c of Array.from(document.body.classList)) {
      if (c.startsWith("native-slides-theme-") && c !== cls) document.body.classList.remove(c);
    }
    document.body.classList.add(cls);
  }

  /**
   * Toggle hiding the mouse pointer window-wide for presenting. Hiding also
   * parks focus (blurs the editor, so the caret disappears); showing leaves
   * focus parked — click slide content to resume editing.
   */
  togglePointer(): void {
    this.pointerHidden = !this.pointerHidden;
    if (this.pointerHidden) {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) active.blur();
    }
    this.refresh();
  }

  /**
   * Keep the `native-slides-pointer-hidden` body class in sync with the
   * presenting state — styles.css turns every cursor invisible while set.
   * Leaving Slides mode always restores the pointer.
   */
  private syncPointerClass(slides: boolean): void {
    document.body.classList.toggle("native-slides-pointer-hidden", slides && this.pointerHidden);
  }

  /**
   * Render the card title per the `slidesTitle` setting. "filename" restyles
   * the native inline title into the card title (still editable — typing
   * renames the note); "" shows nothing; any other value names a frontmatter
   * property rendered read-only via the ::before pseudo-element.
   */
  private updateInlineTitle(slides: boolean): void {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const file = this.app.workspace.getActiveFile();
    const content = view?.contentEl.querySelector<HTMLElement>(".cm-content");
    if (!content || !file) return;

    const src = this.settings.slidesTitle.trim();

    // "filename": restyle the native .inline-title into the card title. It
    // stays contenteditable, so editing it renames the note as in Live
    // Preview. The native inline title lives on the markdown-source-view
    // element (a sibling branch of the card), so the styling hook is a
    // view attribute + a brand-new .cm-content attribute that reserves the
    // title's height the same way the pseudo-element version did.
    const nativeTitle = slides && src === "filename";
    const sourceView = view?.contentEl.querySelector<HTMLElement>(".markdown-source-view");
    if (nativeTitle && sourceView) sourceView.setAttribute("data-ns-inline-title", "filename");
    else sourceView?.removeAttribute("data-ns-inline-title");
    content.toggleAttribute("data-slides-title-native", nativeTitle);

    // Property-backed titles render read-only via the ::before pseudo-element
    // (no editing surface — the properties panel is hidden in Slides mode).
    let text: string | null = null;
    if (slides && src && src !== "filename") {
      const fm = frontmatterOf(this.app, file);
      const v = fm?.[src];
      if (v != null) text = formatValue(v);
    }

    if (text) content.setAttribute("data-slides-title", text);
    else content.removeAttribute("data-slides-title");
  }

  /**
   * Tag every image-only line in the editor with
   * `native-slides-solo-image` so styles.css can center it while keeping
   * the embed inline (line height stays the image height).
   */
  private tagSoloImageLines(content: HTMLElement): void {
    for (const line of content.querySelectorAll<HTMLElement>(":scope > .cm-line")) {
      line.classList.toggle("native-slides-solo-image", isSoloImageLine(line));
    }
  }

  /**
   * Keep the solo-image tags fresh while Slides mode is active. CodeMirror
   * re-creates line elements on its re-renders, and Obsidian swaps the whole
   * editor subtree on view-mode switches — the observer watches
   * `document.body` and re-resolves the CURRENT active editor each pass.
   * Crucially the re-tag runs synchronously in the mutation callback (a
   * microtask, before the browser paints): a line recreated without the
   * class is re-tagged in the same frame, so the centering never visibly
   * flaps. Debouncing would reintroduce a 60ms window of left-aligned
   * painting on every keystroke.
   */
  private syncSoloImageObserver(active: boolean): void {
    if (active && this.soloImageObserver) {
      this.tagCurrentContent();
      return;
    }
    if (!active && !this.soloImageObserver) return;
    if (this.soloImageObserver) {
      this.soloImageObserver.disconnect();
      this.soloImageObserver = null;
    }
    if (!active) return;
    this.soloImageObserver = new MutationObserver(() => {
      this.tagCurrentContent();
    });
    this.soloImageObserver.observe(document.body, { childList: true, subtree: true });
    this.tagCurrentContent();
  }

  /** Tag the solo-image lines of the active editor, wherever it is now. */
  private tagCurrentContent(): void {
    const content = this.app.workspace
      .getActiveViewOfType(MarkdownView)
      ?.contentEl.querySelector<HTMLElement>(".cm-content");
    if (content) this.tagSoloImageLines(content);
  }

  /** Enter Slides mode: record the exit state and force the Live Preview */
  private async enterSlides(): Promise<void> {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      const state = view.getState() as { mode?: string; source?: boolean };
      this.exitMode = state.mode === "preview" ? "preview" : "source";
      this.exitSource = state.source === true;
      // Slides mode is always the editable Live Preview
      const next = view.leaf.getViewState();
      next.state = { ...next.state, mode: "source", source: false };
      await view.leaf.setViewState(next, { focus: false });
    }
    this.slidesMode = true;
    this.refresh();
  }

  /** Exit Slides mode: restore the view mode recorded at entry */
  private exitSlides(): void {
    this.slidesMode = false;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      const state = view.leaf.getViewState();
      if (this.exitMode === "preview") {
        state.state = { ...state.state, mode: "preview" };
      } else {
        state.state = { ...state.state, mode: "source", source: this.exitSource };
      }
      void view.leaf.setViewState(state, { focus: false });
    }
    this.refresh();
  }

  /** Toggle Slides mode (deck notes only — enforced by the command) */
  toggleSlides(): void {
    if (this.slidesMode) this.exitSlides();
    else void this.enterSlides();
  }

  /** Reveal the slides sidebar panel, creating it in the right sidebar if needed */
  async activateSlidesPanel(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(SLIDES_PANEL_VIEW);
    if (existing.length > 0) {
      await this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: SLIDES_PANEL_VIEW, active: true });
    await this.app.workspace.revealLeaf(leaf);
  }

  /** Auto-enter Slides mode once per opened deck note when the setting is on */
  private maybeAutoEnterSlides(): void {
    const file = this.app.workspace.getActiveFile();
    if (!file || file.path === this.autoEnteredPath) return;
    this.autoEnteredPath = file.path;
    if (this.settings.autoEnterSlides && this.isDeckNote(file) && !this.slidesMode) {
      void this.enterSlides();
    }
  }

  // ── PPT navigation ────────────────────────────────────────────────────

  /** Move one step back/forward along the deck chain (entering Slides mode as needed) */
  async navigate(direction: "prev" | "next"): Promise<void> {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    const deck = this.deckService.compute(file);
    if (!deck) return;
    const target = deck.chain[direction === "prev" ? deck.index - 1 : deck.index + 1];
    if (!target) return;
    if (!this.slidesMode) await this.enterSlides();
    void this.app.workspace.openLinkText(target, file.path);
  }

  /** Jump to a specific index in the deck chain (progress bar click) */
  async jumpTo(index: number): Promise<void> {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    const deck = this.deckService.compute(file);
    if (!deck || index < 0 || index >= deck.chain.length || index === deck.index) return;
    const target = deck.chain[index];
    if (!target) return;
    if (!this.slidesMode) await this.enterSlides();
    void this.app.workspace.openLinkText(target, file.path);
  }

  // ── Bar rendering ─────────────────────────────────────────────────────

  /**
   * Get column width percentages for the bar properties. Returns an array of
   * percentages (summing to 100) for each property. Loads from settings or
   * defaults to equal distribution.
   */
  private getBarPropertyWidths(count: number): number[] {
    try {
      const stored = JSON.parse(this.settings.barPropertyWidths || "[]") as unknown;
      if (isNumberList(stored, count)) return stored;
    } catch {
      // ignore
    }
    return new Array<number>(count).fill(100 / count);
  }

  /** Save column width percentages to settings */
  private async saveBarPropertyWidths(widths: number[]): Promise<void> {
    this.settings.barPropertyWidths = JSON.stringify(widths);
    await this.saveSettings();
  }

  /** Decide what the slides bar shows, then re-render it */
  refresh(): void {
    if (!this.bar) return;
    this.applyThemeClass();

    const file = this.app.workspace.getActiveFile();
    const mode = currentMode(this.app);
    const isCard = this.isDeckNote(file);
    const livePreviewNow = mode === "source" && isLivePreview(this.app);

    // Leaving a deck note, or leaving the Live Preview (e.g. Cmd/Ctrl+E to
    // reading view), ends Slides mode — only the toggle command re-enters it.
    if (this.slidesMode && (!isCard || !livePreviewNow)) {
      this.slidesMode = false;
    }

    // Measure the tab bar while it is still visible (Slides mode hides it
    // below; the last measured value is reused once hidden).
    this.tabBarHeight = syncTabBarHeight(this.tabBarHeight);

    // Slides mode is active only while actually in the editable Live Preview
    const slides = this.slidesMode && isCard && livePreviewNow;
    document.body.classList.toggle("native-slides-mode", slides);
    if (!slides) this.pointerHidden = false; // leaving Slides restores the pointer
    this.syncPointerClass(slides);
    this.updateInlineTitle(slides);

    // Keep standalone-image line tags fresh while Slides mode is active.
    // The observer watches document.body and re-resolves the active editor
    // each pass, so editor rebuilds (view-mode switches) cannot strand it.
    this.syncSoloImageObserver(slides);

    const barVisible = slides && this.settings.showSlidesBar && !this.settings.barHidden;
    // When bar is hidden, set bottom padding to 0 so the card fills the full
    // window height. When visible, remove the override so CSS falls back to
    // --native-slides-tabbar-height (clears the bar as before).
    if (barVisible) {
      document.documentElement.style.removeProperty("--native-slides-bar-height");
    } else {
      document.documentElement.setCssProps({ "--native-slides-bar-height": "0px" });
    }
    if (!barVisible) {
      this.bar.setCssStyles({ display: "none" });
      return;
    }
    if (!file) return; // barVisible implies a file, but narrow for TypeScript

    const fm = activeFrontmatter(this.app);
    const deck = this.deckService.compute(file);
    clearChildren(this.bar);

    // ── Left: previous / next buttons (both always shown inside a deck;
    //        the one that cannot move is disabled / light gray) ──
    if (this.settings.showNavButtons && deck) {
      const hasPrev = deck.index > 0;
      const hasNext = deck.index < deck.chain.length - 1;
      const nav = createDiv({ cls: "native-slides-nav" });
      nav.appendChild(navButton("◀", "Previous page", () => void this.navigate("prev"), !hasPrev));
      nav.appendChild(navButton("▶", "Next page", () => void this.navigate("next"), !hasNext));
      this.bar.appendChild(nav);
    }

    // ── Middle: configured property columns with draggable dividers ──
    const propNames = this.settings.barProperties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (propNames.length > 0 && fm) {
      const entries: [string, string][] = [];
      for (const name of propNames) {
        if (name in fm) {
          const val = fm[name];
          if (val != null) entries.push([name, formatValue(val)]);
        }
      }

      if (entries.length > 0) {
        const container = createDiv({ cls: "native-slides-bar-properties" });

        const widths = this.getBarPropertyWidths(entries.length);

        for (let i = 0; i < entries.length; i++) {
          const [, value] = entries[i];
          const item = createSpan({ cls: "native-slides-bar-prop-item", text: value });
          item.setCssStyles({
            flexBasis: `calc(${widths[i]}% - ${((entries.length - 1) * 4) / entries.length}px)`,
          });
          container.appendChild(item);

          if (i < entries.length - 1) {
            const divider = createDiv({ cls: "native-slides-bar-divider" });
            divider.addEventListener("mousedown", (e) => {
              e.preventDefault();
              const startX = e.clientX;
              const containerWidth = container.clientWidth;
              const initialWidths = [...widths];
              const onMove = (ev: MouseEvent) => {
                const delta = ((ev.clientX - startX) / containerWidth) * 100;
                const newLeft = Math.max(5, initialWidths[i] + delta);
                const newRight = Math.max(5, initialWidths[i + 1] - delta);
                widths[i] = newLeft;
                widths[i + 1] = newRight;
                const items = container.querySelectorAll<HTMLElement>(
                  ".native-slides-bar-prop-item",
                );
                items[i].setCssStyles({
                  flexBasis: `calc(${newLeft}% - ${((entries.length - 1) * 4) / entries.length}px)`,
                });
                items[i + 1].setCssStyles({
                  flexBasis: `calc(${newRight}% - ${((entries.length - 1) * 4) / entries.length}px)`,
                });
              };
              const onUp = () => {
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
                document.body.setCssStyles({ cursor: "", userSelect: "" });
                void this.saveBarPropertyWidths(widths);
              };
              document.addEventListener("mousemove", onMove);
              document.addEventListener("mouseup", onUp);
              document.body.setCssStyles({ cursor: "col-resize", userSelect: "none" });
            });
            container.appendChild(divider);
          }
        }

        this.bar.appendChild(container);
      }
    }

    // Broken deck links → warning chip so deck authors spot typos
    const broken = file ? this.deckService.broken(file) : [];
    if (broken.length > 0) {
      const warn = createSpan({
        cls: "native-slides-warn",
        text: "⚠ " + broken.join(", "),
        attr: { title: "Broken deck link(s) — the target note does not exist" },
      });
      this.bar.appendChild(warn);
    }

    // ── Bottom-right: auto-computed page number ──
    if (this.settings.pageNumberStyle !== "none" && deck) {
      // v1.0.0 next-only semantics: chain[0] is the head slide = page 1;
      // total is the full chain length.
      const total = deck.chain.length;
      const page = createSpan({
        cls: "native-slides-page",
        text:
          this.settings.pageNumberStyle === "fraction"
            ? `${deck.index + 1} / ${total}`
            : `${deck.index + 1}`,
      });
      this.bar.appendChild(page);
    }

    // ── Progress indicator: discrete clickable segments at bar top ──
    if (this.settings.showProgress && deck && deck.chain.length > 1) {
      const progress = createDiv({ cls: "native-slides-progress" });
      for (let i = 0; i < deck.chain.length; i++) {
        const state = i < deck.index ? "past" : i === deck.index ? "current" : "future";
        const seg = createDiv({
          cls: `native-slides-progress-seg native-slides-progress-seg--${state}`,
        });
        seg.addEventListener("click", () => void this.jumpTo(i));
        progress.appendChild(seg);
      }
      this.bar.appendChild(progress);
    }

    // Hide the slides bar entirely when it has nothing to display (no properties,
    // and not part of a deck)
    this.bar.setCssStyles({ display: this.bar.childElementCount === 0 ? "none" : "" });
  }
}

/** Whether `value` is an array of exactly `count` numbers (stored bar widths). */
function isNumberList(value: unknown, count: number): value is number[] {
  return (
    Array.isArray(value) && value.length === count && value.every((n) => typeof n === "number")
  );
}

/**
 * Whether a line element holds an image and nothing else (no typed text and
 * no list/quote markers) — a "standalone image line". CodeMirror's own
 * widget plumbing (cm-widgetBuffer placeholders, the fold indicator) is
 * ignored; any real img (raw markdown image or embed) counts.
 */
function isSoloImageLine(line: Element): boolean {
  let sawImage = false;
  let sawText = false;
  for (const node of Array.from(line.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent && node.textContent.trim()) sawText = true;
      continue;
    }
    if (!node.instanceOf(HTMLElement)) continue;
    if (
      node.classList.contains("cm-widgetBuffer") ||
      node.classList.contains("cm-fold-indicator")
    ) {
      continue;
    }
    if (node.tagName === "IMG") {
      sawImage = true;
      continue;
    }
    if (node.classList.contains("cm-formatting")) {
      if (node.textContent && node.textContent.trim()) sawText = true;
      continue;
    }
    if (node.querySelector("img")) sawImage = true;
    else if (node.textContent && node.textContent.trim()) sawText = true;
  }
  return sawImage && !sawText;
}
