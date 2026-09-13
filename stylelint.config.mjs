/**
 * The community-scanner's CSS pass, run in CI.
 *
 * `stylelint-config-obsidianmd` is the config the Obsidian community scanner
 * runs against a plugin's `styles.css`; extending it keeps this check a 1:1
 * map of the scorecard's CSS categories (`!important`, `:has`, `all`,
 * unsupported browser features, duplicate properties, named colours).
 *
 * Two deliberate differences from the package defaults:
 *
 * 1. Nine rules the package inherits are off — the nine below, which fire 134
 *    errors on this stylesheet. None of them is a category the scorecard
 *    shows (it reports the categories listed above and nothing else), which is
 *    the whole reason they are off: eight come from `stylelint-config-standard`
 *    and `no-descending-specificity` from `stylelint-config-recommended`
 *    beneath it. Two of the nine are formatting that Prettier owns in this
 *    repository (`rule-empty-line-before`, `comment-empty-line-before`); the
 *    rest are naming and notation conventions.
 * 2. `plugin/no-unsupported-browser-features` is pinned to `electron >= 30`.
 *    The package default (`electron >= 43`) is the version the config author
 *    developed against, but the scanner targets Obsidian 1.6.5 — its own
 *    baseline, the version the scorecard names — and 1.6.5 ships Electron 30.
 *    That target is what makes it report `css-text-indent` on the list
 *    geometry.
 *
 * The warnings this config still reports are tracked, one issue per rule:
 *   - `declaration-no-important`          -> #133
 *   - `selector-pseudo-class-disallowed-list` (`:has`) -> #135
 *   - `plugin/no-unsupported-browser-features` (`text-indent`) -> #134
 * `npm run check:scanner` uses a `--max-warnings` baseline of that count, so a
 * new warning fails CI; lower the baseline in the same PR that closes one of
 * those issues.
 */

/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-obsidianmd"],
  rules: {
    // Not scorecard categories — see 1. above.
    "rule-empty-line-before": null,
    "selector-class-pattern": null,
    "comment-empty-line-before": null,
    "alpha-value-notation": null,
    "color-function-alias-notation": null,
    "color-function-notation": null,
    "no-descending-specificity": null,
    "selector-not-notation": null,
    "length-zero-no-unit": null,

    // The scanner's target: Obsidian 1.6.5, which ships Electron 30.
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
        browsers: ["electron >= 30"],
        ignore: ["css-nesting", "css-cascade-layers"],
      },
    ],
  },
};
