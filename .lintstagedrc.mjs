const linststagedConfig = {
  "*.{md,css,js,cjs,mjs}": () => "npm run lint:fix",
};

export default linststagedConfig;
