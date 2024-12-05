import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";


export default [
  {
    files: ["src/**/*.{js,mjs,cjs,jsx}"]
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        process: "readonly"
      }
    },
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    rules: {
      "react/prop-types": 0,
      "react/react-in-jsx-scope": "off",
      "no-undef": "off"
    }
  }
];