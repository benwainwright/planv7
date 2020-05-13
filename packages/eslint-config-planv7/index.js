module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "filenames",
    "import",
    "fp",
    "sonarjs",
    "unicorn",
    "promise",
    "array-func",
  ],
  ignorePatterns: ["node_modules"],
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "plugin:promise/recommended",
    "plugin:array-func/all",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "unicorn/no-fn-reference-in-iterator": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/filename-case": "off",
    "import/namespace": "off",
    "import/named": "off",
    "import/prefer-default-export": "error",
    // Eslint build in
    "no-inline-comments": "error",
    "no-bitwise": "error",
    "array-func/prefer-array-from": "off",
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
    "no-multi-assign": "error",
    "no-lonely-if": "error",
    "new-cap": "error",
    "capitalized-comments": [
      "error",
      "always",
      { ignoreConsecutiveComments: true },
    ],
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
    // No-extra-parans keeps giving me false positives
    "no-extra-parens": "off",
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

    // Filenames
    "filenames/match-regex": ["error", "^[a-z\\-]+(\\.[a-z]+)*$", true],
    "filenames/match-exported": "error",

    // Fp
    "fp/no-let": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
      ],
      rules: {
        "@typescript-eslint/method-signature-style": ["error", "property"],
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/class-literal-property-style": ["error", "fields"],
        "@typescript-eslint/consistent-type-definitions": [
          "error",
          "interface",
        ],
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/array-type": ["error", { default: "array" }],
        "@typescript-eslint/no-magic-numbers": ["error", { ignore: [0, 1] }],
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/default-param-last": "error",
        "@typescript-eslint/no-array-constructor": "error",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/unified-signatures": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-readonly-parameter-types": "off",
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/prefer-reduce-type-parameter": "error",
      },
    },
    {
      files: ["*.js", "*.jsx"],
      rules: {
        "no-undef": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["*.tsx", "!*.spec.dom.tsx"],
      plugins: ["react-hooks", "react"],
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        "react/prop-types": "off",
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE", "PascalCase"],
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
    {
      files: ["*.spec.ts", "*.spec.dom.ts", "*.spec.dom.tsx"],
      rules: {
        "filenames/match-regex": "off",
        "filenames/match-exported": "off",
        "fp/no-let": "off",
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
