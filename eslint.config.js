import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    ignores: [
      "build/",
      ".react-router/",
      "node_modules/",
      "app/types/api-client.ts",
    ],
  },
  {
    // Parse JS/TS/JSX/TSX so Prettier can check every source file.
    // Parser only — no TypeScript lint rules, so existing code isn't flagged.
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  // Runs Prettier as an ESLint rule: any formatting problem is an ESLint error.
  prettierRecommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Collapse 2+ consecutive blank lines down to 1 (clearer message than
      // Prettier's raw "Delete ⏎"). --fix removes the extra line automatically.
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0, maxBOF: 0 }],
    },
  },
);
