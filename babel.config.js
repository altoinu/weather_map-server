// babel.config.js
module.exports = {
  // babel required for jest to work in node.js project
  // https://jenchan.biz/blog/dissecting-the-hell-jest-setup-esm-typescript-setup
  // https://jestjs.io/docs/getting-started#generate-a-basic-configuration-file
  // https://jestjs.io/docs/getting-started#using-babel
  // https://stackoverflow.com/questions/62820035/babel-throwing-support-for-the-experimental-syntax-jsx-isnt-currently-enabled
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
