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
 * 1. `stylelint-config-standard`'s formatting rules are off. The package
 *    extends that config, and Prettier owns formatting in this repository, so
 *    leaving them on would report ~128 style errors that the scanner never
 *    sees. The rules below are the ones that fired on this stylesheet.
 * 2. `plugin/no-unsupported-browser-features` is pinned to `electron >= 25`.
 *    The package default (`electron >= 43`) is the version the config author
 *    developed against, but the scanner targets the plugin's declared minimum
 *    Obsidian (`1.6.5`, Electron 25), which is what makes it report
 *    `css-text-indent` on the list geometry.
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
    // Formatting — Prettier's job, not the scanner's.
    "rule-empty-line-before": null,
    "selector-class-pattern": null,
    "comment-empty-line-before": null,
    "alpha-value-notation": null,
    "color-function-alias-notation": null,
    "color-function-notation": null,
    "no-descending-specificity": null,
    "selector-not-notation": null,
    "length-zero-no-unit": null,

    // The scanner's target is the plugin's minimum supported Obsidian.
    "plugin/no-unsupported-browser-features": [
      true,
      {
        severity: "warning",
        browsers: ["electron >= 25"],
        ignore: ["css-nesting", "css-cascade-layers"],
      },
    ],
  },
};
