// babel.config.js
module.exports = {
  // https://medium.com/trabe/testing-css-modules-in-react-components-with-jest-enzyme-and-a-custom-modulenamemapper-8ff86c7d18a2
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
