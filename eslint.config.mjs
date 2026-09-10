// ESLint flat config (ESLint 9)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "**/main.js", // generated build artifact (incl. example-vault symlink)
      "node_modules/**",
      ".npm-cache/**",
      "package-lock.json",
      "demo-shots/**",
      ".agents/skills/**", // vendored third-party skills; repo-owned skills stay Prettier-checked
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier, // disable style rules handled by Prettier
);
