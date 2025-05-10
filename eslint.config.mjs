import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
  {
    // Ignore the dist directory and other common ignores
    ignores: [
      "dist/**",
      "node_modules/**",
      ".cache/**",
      // Add any other directories or files you want to ignore
    ],
  },
  js.configs.recommended, // ESLint's recommended JavaScript rules for .js files

  // Base TypeScript configuration for all .ts, .tsx, .mts, .cts files
  // This applies rules that DO NOT require type information.
  // It will cover files like tsup.config.ts and files in src.
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [
      // tseslint.configs.base provides parser and plugin setup
      // tseslint.configs.eslintRecommended disables ESLint core rules covered by @typescript-eslint
      // tseslint.configs.recommended enables recommended rules that don't require type information
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      globals: { // Define globals available in these files
        ...globals.browser, // For client-side TS/TSX in src
        ...globals.node,    // For config files like tsup.config.ts
      }
    }
  },

  // Type-aware linting for src files ONLY
  // This applies rules that DO require type information.
  {
    files: ["src/**/*.{ts,tsx}"], // Only apply to files in the src directory
    extends: [
      // tseslint.configs.recommendedTypeChecked enables recommended rules that require type information
      ...tseslint.configs.recommendedTypeChecked,
      // You can also add ...tseslint.configs.stylisticTypeChecked for type-aware stylistic rules
    ],
    languageOptions: {
      parserOptions: {
        project: true, // Enable type-aware linting
        tsconfigRootDir: import.meta.dirname, // Assumes eslint.config.mjs is at the project root
      },
    },
  },

  // React specific configuration
  {
    files: ["**/*.{jsx,tsx}"], // Target JSX and TSX files
    ...pluginReact.configs.flat.recommended, // Spread React's flat recommended config
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      // Example: If using React 17+ new JSX transform, you might not need 'React' in scope
      // "react/react-in-jsx-scope": "off",
      // Add any other React specific rule overrides here
    }
  }
);