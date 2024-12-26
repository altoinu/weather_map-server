const prettierConfig = {
  arrowParens: "always",
  bracketSpacing: true,
  bracketSameLine: false,
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  requirePragma: false,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  // prettier-plugin-sort-imports options
  sortingMethod: "alphabetical",
  plugins: ["./node_modules/prettier-plugin-sort-imports/dist/index.js"],
};

export default prettierConfig;
//  trailingComma: "es5",
