/**
 * Default values to be used if not specified in env var.
 * Don't put logics that are too crazy in here
 */

import CONSTANTS from "./constants.mjs";

const DEFAULT_VALUES = {
  env: CONSTANTS.ENV.dev.name,
};

export default DEFAULT_VALUES;
