import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";


export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      "react/prop-types": 0,
      "react/react-in-jsx-scope": "off"
    }
  }
];

// "extends":
//       "eslint:recommended",
//       "plugin:react/recommended",
//       "plugin:prettier/recommended",