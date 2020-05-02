module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint", "filenames", "import", "fp" 
  ],
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "yoda": ["error", "never"],
    "require-unicode-regexp": "error",
    "require-await": "error",
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
    "no-magic-numbers": ["error", { "ignore": [0] }],
    "no-loop-func": "error",
    "no-lone-blocks": "error",
    "no-labels": "error",
    "no-iterator": 'error',
    "no-invalid-this": "error",
    "no-implied-eval": "error",
    "no-implicit-coercion": "error",
    "no-floating-decimal": "error",
    "no-extend-native": "error",
    "no-eval": "error",
    "no-eq-null": "error",
    "no-empty-function": "error",
    "no-constructor-return": "error",
    "no-caller": "error",
    "no-alert": "error",
    "max-classes-per-file": "error",
    "guard-for-in": "error",
    "default-param-last": "error",
    "complexity": "error",
    "no-await-in-loop": "error",
    "no-console": "error",
    "require-atomic-updates": "error",
    "array-callback-return": "error",
    "no-extra-parens": "error",
    "no-template-curly-in-string": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "filenames/match-regex": ["error", "^[a-z\\-]+(\\.[a-z]+)*$", true],
    "filenames/match-exported": "error",
    "fp/no-let": "error"
  },
  settings: {
    "react": {
      "version": "detect"
    }
  }
}
