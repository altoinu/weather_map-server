// babel.config.js
module.exports = {
  // https://jenchan.biz/blog/dissecting-the-hell-jest-setup-esm-typescript-setup
  // https://jestjs.io/docs/getting-started#generate-a-basic-configuration-file
  // https://jestjs.io/docs/getting-started#using-babel
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
