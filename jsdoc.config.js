"use strict";

module.exports = {
  plugins: [],
  source: {
    includePattern: ".+\\.(js(doc|x)?|mjs)$",
    include: ["src/middleware", "src/utils"],
  },
  sourceType: "module",
};
