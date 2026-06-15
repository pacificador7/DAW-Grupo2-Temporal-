import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const noEmojiRule = {
  meta: {
    type: "problem",
    docs: {
      description: "prohibir emojis en el código fuente",
    },
    schema: [],
  },
  create(context) {
    const emojiRegex = /\p{Extended_Pictographic}/u;
    return {
      Literal(node) {
        if (typeof node.value === "string" && emojiRegex.test(node.value)) {
          context.report({
            node,
            message: "No se permiten emojis en el código fuente. Usa iconos (como lucide-react) o texto plano.",
          });
        }
      },
      TemplateElement(node) {
        if (emojiRegex.test(node.value.raw)) {
          context.report({
            node,
            message: "No se permiten emojis en el código fuente. Usa iconos (como lucide-react) o texto plano.",
          });
        }
      },
      JSXText(node) {
        if (emojiRegex.test(node.value)) {
          context.report({
            node,
            message: "No se permiten emojis en el código fuente. Usa iconos (como lucide-react) o texto plano.",
          });
        }
      }
    };
  }
};

export default [
  { ignores: ["dist", "node_modules"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "custom-rules": {
        rules: {
          "no-emojis": noEmojiRule,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "custom-rules/no-emojis": "error",
    },
  },
];
