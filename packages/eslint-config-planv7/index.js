module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "filenames", "import", "fp"],
  ignorePatterns: ["node_modules"],
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "import/prefer-default-export": "error",
    // Eslint build in
    "no-inline-comments": "error",
    "no-bitwise": "error",
    "sort-imports": "error",
    "prefer-template": "error",
    "prefer-spread": "error",
    "prefer-rest-params": "error",
    "prefer-arrow-callback": "error",
    "object-shorthand": "error",
    "no-useless-rename": "error",
    "no-useless-computed-key": "error",
    "no-duplicate-imports": "error",
    "prefer-object-spread": "error",
    "prefer-exponentiation-operator": "error",
    "no-unneeded-ternary": "error",
    "no-underscore-dangle": "error",
    "no-nested-ternary": "error",
    "no-nested-ternary": "error",
    "no-multi-assign": "error",
    "no-lonely-if": "error",
    "new-cap": "error",
    "capitalized-comments": [
      "error",
      "always",
      { ignoreConsecutiveComments: true },
    ],
    "no-undefined": "error",
    "no-shadow": "error",
    yoda: ["error", "never"],
    "require-unicode-regexp": "error",
    "prefer-regex-literals": "error",
    "prefer-promise-reject-errors": "error",
    "prefer-named-capture-group": "error",
    "no-void": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "no-useless-call": "error",
    "no-unmodified-loop-condition": "error",
    "no-throw-literal": "error",
    "no-sequences": "error",
    "no-self-compare": "error",
    "no-script-url": "error",
    "no-return-await": "error",
    "no-return-assign": "error",
    "no-proto": "error",
    "no-param-reassign": "error",
    "no-octal-escape": "error",
    "no-new-wrappers": "error",
    "no-new-func": "error",
    "no-new": "error",
    "no-multi-str": "error",
    "no-loop-func": "error",
    "no-lone-blocks": "error",
    "no-labels": "error",
    "no-iterator": "error",
    // This is giving me false positives, so disabling for now
    // "no-invalid-this": "error",
    "no-implied-eval": "error",
    "no-implicit-coercion": "error",
    "no-floating-decimal": "error",
    "no-extend-native": "error",
    "no-eval": "error",
    "no-eq-null": "error",
    "no-constructor-return": "error",
    "no-caller": "error",
    "no-alert": "error",
    "max-classes-per-file": "error",
    "guard-for-in": "error",
    complexity: "error",
    "no-await-in-loop": "error",
    "no-console": "error",
    "require-atomic-updates": "error",
    "array-callback-return": "error",
    "no-extra-parens": "error",
    "no-template-curly-in-string": "error",

    "import/no-named-as-default": "off",

    // TypeScript
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: "enumMember",
        format: ["PascalCase"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
    ],
    "@typescript-eslint/method-signature-style": ["error", "property"],
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/class-literal-property-style": ["error", "fields"],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/class-literal-property-style": ["error", "fields"],
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/array-type": ["error", { default: "array" }],
    "@typescript-eslint/no-magic-numbers": ["error", { ignore: [0] }],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/default-param-last": "error",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/unified-signatures": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-for-of": "error",

    // The following rules don't work; they cause eslint to crash
    // "@typescript-eslint/no-floating-promises": "error",
    // "@typescript-eslint/no-base-to-string": "error",
    // "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    // "@typescript-eslint/no-unnecessary-condition": "error",
    // "@typescript-eslint/restrict-plus-operands": "error",
    // "@typescript-eslint/promise-function-async": "error",
    // "@typescript-eslint/prefer-string-starts-ends-with": "error",
    // "@typescript-eslint/switch-exhaustiveness-check": "error",
    // "@typescript-eslint/no-require-imports": "error",
    // "@typescript-eslint/prefer-nullish-coalescing": "error",
    // "@typescript-eslint/prefer-includes": "error",
    // "@typescript-eslint/prefer-readonly-parameter-types": "error",
    // "@typescript-eslint/require-await": "error",
    // "@typescript-eslint/prefer-reduce-type-parameter": "error",

    // Filenames
    "filenames/match-regex": ["error", "^[a-z\\-]+(\\.[a-z]+)*$", true],
    "filenames/match-exported": "error",

    // Fp
    "fp/no-let": "error",
  },

  overrides: [
    {
      files: ["*.dom.spec.ts", "*.tsx"],
      extends: ["plugin:react/recommended"],
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    {
      files: ["*.spec.ts"],
      rules: {
        "filenames/match-regex": "off",
        "filenames/match-exported": "off",
        "max-classes-per-file": "off",
        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid",
          },
          {
            selector: "typeLike",
            format: ["PascalCase"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid",
          },
          {
            selector: "enumMember",
            format: ["PascalCase"],
            leadingUnderscore: "forbid",
            trailingUnderscore: "forbid",
          },
        ],
      },
    },
  ],
};
