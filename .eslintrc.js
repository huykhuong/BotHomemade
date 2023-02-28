module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: [
          "external",
          "builtin",
          "internal",
          "sibling",
          "parent",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    ///////////////////////////////////////////////////////////////////////////
    // TypeScript Linting                                                    //
    ///////////////////////////////////////////////////////////////////////////
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/consistent-type-definitions": ["off", "type"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/method-signature-style": "error",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-invalid-this": "error",
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-unused-expressions": ["error"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
};
