module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint", "filenames"
  ],
  extends: [
    "prettier",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "filenames/match-regex": ["error", "^[a-z\\-]+$", true],
    "filenames/match-exported": "error"
  },
  settings: {
    "react": {
      "version": "detect"
    }
  }
}
