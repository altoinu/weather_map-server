import DEFAULT_VALUES from "./constants/defaults.mjs";
import "dotenv/config";

/**
 * Loads custom environment variable or returns null, if not found.
 * @param {string} key
 * @returns Specified environment variable or null if not found
 */
function getEnv(key) {
  const windowEnv =
    Object.prototype.hasOwnProperty.call(global, "window") &&
    Object.prototype.hasOwnProperty.call(global.window, "__env")
      ? global.window.__env
      : {};
  return process.env[key] || windowEnv[key] || null;
}

const corsAllowOrigin = getEnv("CORS_ALLOW_ORIGIN");

/**
 * Environment variables are injected from .env at build-time via dotenv.
 * @link https://github.com/motdotla/dotenv
 */
const ENV = {
  apiKey: getEnv("OPEN_WEATHER_MAP_API_KEY"),
  env: getEnv("NODE_ENV") || DEFAULT_VALUES.env,
  corsAllowOrigin: corsAllowOrigin ? JSON.parse(corsAllowOrigin) : [],
  port: getEnv("PORT") || "3000",
};

export default ENV;
