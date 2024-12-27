import ENV from "./env.mjs";
import CORS from "./middleware/CORS.mjs";
import configRoute from "./routes/configRoute.mjs";
import openWeatherMapRouter from "./routes/openWeatherMap.mjs";
import createServer from "./utils/createServer.mjs";
import bodyParser from "body-parser";
import cluster from "cluster";
import os from "os";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

console.log("System info----------------");
console.log("nodejs version:", process.version);
console.log("num cpus:", os.cpus().length);
console.log("cluster.isPrimary:", cluster.isPrimary);
console.log("process:", process.pid);
console.log("----------------end system info");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Normalize a port into a number, string, or false.
 * @param {*} val
 * @returns Normalized port
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

const port = normalizePort(ENV.port);
const cors = CORS({
  origin: ENV.corsAllowOrigin,
});

function createAndStartServer() {
  return createServer({
    port: port,
    appSettings: [
      {
        name: "view engine",
        value: "hbs",
      },
      {
        name: "views",
        value: path.join(__dirname, "hbs_views"),
      },
    ],
    middleware: [
      bodyParser.json({ limit: "1mb" }),
      bodyParser.urlencoded({
        parameterLimit: 100000,
        limit: "1mb",
        extended: true,
      }),
      cors.allow,
      {
        middleware: configRoute,
      },
      {
        middleware: openWeatherMapRouter,
      },
    ],
  });
}

function server() {
  let shutdown;
  return {
    start: () => {
      const appObj = createAndStartServer();
      shutdown = appObj.shutdown;
      return appObj;
    },
    shutdown: () => {
      return shutdown();
    },
  };
}

export default server;
