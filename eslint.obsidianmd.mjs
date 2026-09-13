/**
 * The community-scanner's TypeScript pass, run in CI.
 *
 * `eslint-plugin-obsidianmd`'s `configs.recommended` is the exact rule set the
 * Obsidian community scanner runs against a plugin's source; keeping this file
 * as a thin wrapper (rather than merging the rules into `eslint.config.mjs`)
 * keeps `npm run lint` and the scanner check independently tunable, and makes
 * it obvious that the scanner's rule set is not ours to edit.
 *
 * Two additions on top of the preset, both required to run it here:
 *
 * 1. `projectService` — the preset enables type-aware rules
 *    (`no-floating-promises`, `await-thenable`, …) that need the type checker.
 * 2. `DEV_MODE` — the build-time flag esbuild injects via `--define`; it is not
 *    a real global, so `no-undef` needs to be told about it.
 *
 * And one deliberate exception:
 *
 * - `obsidianmd/commands/no-default-hotkeys` is off. The plugin ships five
 *   default hotkeys by design (README, HANDOFF), the scanner reports them as
 *   warnings, and the preset's own `eslint-comments/*` rules forbid silencing
 *   them inline — so the exception lives here, in one place, with this comment.
 *
 * With that exception, this check must report zero problems; `npm run
 * check:scanner` runs it with `--max-warnings 0`.
 */

import obsidianmd from "eslint-plugin-obsidianmd";

export default [
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { DEV_MODE: "readonly" },
    },
  },
  {
    rules: {
      "obsidianmd/commands/no-default-hotkeys": "off",
    },
  },
];
