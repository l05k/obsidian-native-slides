/** Create the slides bar DOM element (hidden until refresh() shows it) */
export function createBar(): HTMLElement {
  const bar = createDiv({ cls: "native-slides-bar" });
  bar.setCssStyles({ display: "none" });
  bar.title = "Click to park the mouse — hides the editor caret while presenting";
  // Presentation parking: clicking the bar keeps focus out of the editor so
  // the blinking caret disappears. preventDefault stops the click from moving
  // focus or starting a text selection; buttons still receive their click event.
  bar.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) active.blur();
  });
  return bar;
}

/** Build a ◀ / ▶ navigation button; `disabled` renders it light gray/inactive */
export function navButton(
  label: string,
  tip: string,
  onClick: () => void,
  disabled = false,
): HTMLButtonElement {
  const btn = createEl("button", {
    cls: "native-slides-nav-btn",
    text: label,
    attr: { title: tip },
  });
  btn.disabled = disabled;
  if (!disabled) btn.addEventListener("click", onClick);
  return btn;
}

/**
 * Measure the top tab bar and expose its height as the CSS variable
 * --native-slides-tabbar-height, returning the (possibly updated) cached
 * value. The slides bar is hidden in Slides mode, so the last measured
 * value is reused there.
 */
export function syncTabBarHeight(cached: number): number {
  const tabBar = document.querySelector<HTMLElement>(
    ".workspace-tabs.mod-top .workspace-tab-header-container",
  );
  if (tabBar && tabBar.offsetHeight > 0) cached = tabBar.offsetHeight;
  if (cached > 0) {
    document.documentElement.setCssProps({ "--native-slides-tabbar-height": `${cached}px` });
  } else {
    // No measurement yet (tab bar hidden since load) — let the CSS fallback apply.
    document.documentElement.style.removeProperty("--native-slides-tabbar-height");
  }
  return cached;
}
