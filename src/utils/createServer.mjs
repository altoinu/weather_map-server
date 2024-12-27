/**
 * Function to create Express app and server
 * @module app_base
 * @version 2.0.0 2024-12-25
 * @requires express
 * @requires morgan
 *
 * @example
 * import createServer from "./utils/createServer.mjs";
 * import express from "express";
 *
 * const configRoute = express.Router();
 * configRoute.get("/getip.json", (req, res) => {
 *   let clientIP = req.header("x-forwarded-for") || req.socket.remoteAddress;
 *   let configValues = {
 *     ip: clientIP,
 *   };
 *
 *   res.status(200);
 *   res.header("Cache-Control", "no-cache, no-store, must-revalidate");
 *   res.header("Pragma", "no-cache");
 *   res.header("Expires", 0);
 *
 *   if (Object.prototype.hasOwnProperty.call(req.query, "callback"))
 *     res.jsonp(configValues);
 *   else res.json(configValues);
 * });
 *
 * const app = createServer({
 *    baseUrl: '/some/base/path',
 *    port: 3000,
 *    appSettings: [
 *       {
 *          name: 'view engine',
 *          value: 'hbs'
 *       },
 *       {
 *          name: 'views',
 *          value: path.join(__dirname, 'utils/hbs_views')
 *       }
 *    ],
 *    middleware: [
 *       $bodyParser.json({
 *          limit: '1mb'
 *       }),
 *       $bodyParser.urlencoded({
 *          parameterLimit: 100000,
 *          limit: '1mb',
 *          extended: true
 *       }),
 *       cors.allow,
 *       configRoute,
 *       {
 *          middleware: anotherRoute,
 *          shutdown: function () {
 *             console.log('shutdown for this route');
 *          }
 *       },
 *       $express.static(path.join(__dirname, '../public')),
 *       {
 *          baseUrl: '/angular',
 *          middleware: $express.static(path.join(__dirname, '../my-angular-app/dist/my-angular-app'))
 *       },
 *       {
 *          baseUrl: '/angular/*',
 *          method: 'GET',
 *          middleware: function (req, res) {
 *             // redirect to index.html
 *             res.sendFile(path.join(__dirname, '../my-angular-app/dist/my-angular-app', 'index.html'));
 *          }
 *       },
 *       {
 *          baseUrl: '/react',
 *          middleware: (function() {
 *             var router = $express.Router();
 *             var filePath = '../my-react-app/build';
 *             router.use($express.static(path.join(__dirname, filePath)));
 *             router.get('/*', function(req, res) {
 *                // redirect to index.html
 *                res.sendFile(path.join(__dirname, filePath, 'index.html'));
 *             });
 *
 *             return router;
 *          })()
 *       }
 *    ]
 * });
 *
 * @todo Sample TODO text
 */
/*
 *    routesDef: RouteDefinition([
 *       path.join(__dirname, '/routes/ConfigRoute.js'),
 *       {
 *          route: express.Router() or require('...'),
 *          baseUrl: '/whatever', //optional
 *          shutdown: function() {
 *             console.log('shutdown for this route');
 *          }
 *       }
 *    ])
 */

import CONSTANTS from "../constants/constants.mjs";
import ENV from "../env.mjs";
import express from "express";
import morgan from "morgan";

export const VERSION = "2.0.0";

/**
 * Setup Express server based on specified config.
 * @param {Object} config - App configuration.
 * @param {string} [config.baseUrl] - Base URL
 * @param {string} config.port - Port number for server.
 * @param {Object[]} [config.appSettings]
 * @param {string} config.appSettings[].name
 * @param {string} config.appSettings[].value
 * @param {Object[]} [config.middleware]
 * @param {string} config.middleware[].baseUrl
 * @param {Object} config.middleware[].middleware Express middleware
 * @param {() => Promise<any>} config.middleware[].shutdown Function to be called on shutdown
 * @returns {{app:Express, server:Server<typeof IncomingMessage, typeof ServerResponse>, shutdown:() => Promise<any[]>}}
 */
function createServer(config) {
  const appSettings = Object.prototype.hasOwnProperty.call(
    config,
    "appSettings",
  )
    ? config.appSettings
    : null;

  const middleware = Object.prototype.hasOwnProperty.call(config, "middleware")
    ? config.middleware
    : null;

  // DEPRECATED - routesDef
  const routesDef = Object.prototype.hasOwnProperty.call(config, "routesDef")
    ? config.routesDef
    : null;

  const configBaseUrl = Object.prototype.hasOwnProperty.call(config, "baseUrl")
    ? config.baseUrl
    : null;
  const baseUrl = configBaseUrl
    ? (configBaseUrl.charAt(0) != "/" ? "/" : "") + configBaseUrl
    : null;

  const serverPort = Object.prototype.hasOwnProperty.call(config, "port")
    ? config.port
    : null;

  const app = express();

  if (appSettings) {
    const appSettingsArray = !Array.isArray(appSettings)
      ? [appSettings]
      : appSettings;

    appSettingsArray.forEach((setting) => {
      app.set(setting.name, setting.value);
    });
  }

  app.use(
    morgan(
      ENV.env +
        " :method :url :status :res[content-length] - :response-time ms",
    ),
  );

  if (middleware) {
    const middlewareArray = !Array.isArray(middleware)
      ? [middleware]
      : middleware;

    middlewareArray.forEach((mid) => {
      let targetMiddlewareMethod = "use";
      if (Object.prototype.hasOwnProperty.call(mid, "method")) {
        // https://expressjs.com/en/4x/api.html#app.METHOD
        switch (mid.method.toLowerCase()) {
          case "all":
          case "checkout":
          case "copy":
          case "delete":
          case "get":
          case "head":
          case "lock":
          case "merge":
          case "mkactivity":
          case "mkcol":
          case "move":
          case "m-search":
          case "notify":
          case "options":
          case "patch":
          case "post":
          case "purge":
          case "put":
          case "report":
          case "search":
          case "subscribe":
          case "trace":
          case "unlock":
          case "unsubscribe":
            targetMiddlewareMethod = mid.method.toLowerCase();
            break;

          default:
            targetMiddlewareMethod = "use";
        }
      }

      let targetMiddlewareBaseUrl =
        (baseUrl ? baseUrl : "") +
        (Object.prototype.hasOwnProperty.call(mid, "baseUrl")
          ? mid.baseUrl
          : "");
      let targetMiddleware = Object.prototype.hasOwnProperty.call(
        mid,
        "middleware",
      )
        ? mid.middleware
        : mid;

      if (targetMiddlewareBaseUrl.length > 0)
        app[targetMiddlewareMethod](targetMiddlewareBaseUrl, targetMiddleware);
      else app[targetMiddlewareMethod](targetMiddleware);
    });
  }

  // DEPRECATED - routesDef
  if (routesDef) {
    // If path specified, mount routes to there [baseUrl]/[routesDef routes]...
    // (ex baseUrl == /api then /api/[routesDef routes]...
    if (baseUrl) app.use(baseUrl, routesDef.routes);
    else app.use(routesDef.routes);
  }

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    next(err);
  });

  const isDevEnv = () => {
    //return app.get('env') === 'development';
    return app.get("env") === CONSTANTS.ENV.dev.name;
  };

  const createErrorReturnObj = (error) => {
    let errorObj = {
      status: error.status || 500,
      message: error.message,
    };

    if (isDevEnv()) {
      // development error handler
      // will print stacktrace
      errorObj.error = error;
    } else {
      // production error handler
      // no stacktraces leaked to user
      errorObj.error = {
        status: error.status,
      };
    }

    return errorObj;
  };

  // Return error as json if .json is in URL
  // Disabling ESLint rule here since Express error handler requires four args
  // eslint-disable-next-line no-unused-vars
  app.use(/.+\.json\??.*/, (err, req, res, next) => {
    let errorObj = createErrorReturnObj(err);
    if (isDevEnv()) errorObj.error = errorObj.error.stack;

    res.json(errorObj);
  });

  // or render error page
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.render("error", createErrorReturnObj(err));
  });

  const server = app.listen(serverPort, () => {
    const address = server.address().address;
    const port = server.address().port;

    console.log("address:" + address);
    console.log("listening at port:" + port);
  });

  return {
    app: app,
    server: server,
    shutdown: () => {
      let shutdownPromises = [
        new Promise((resolve) => {
          server.close(() => {
            resolve();
          });
        }),
      ];

      if (middleware) {
        const middlewareArray = !Array.isArray(middleware)
          ? [middleware]
          : middleware;

        shutdownPromises = shutdownPromises.concat(
          middlewareArray.reduce((shutdownActions, mid) => {
            if (Object.prototype.hasOwnProperty.call(mid, "shutdown"))
              shutdownActions.push(
                new Promise((resolve) => {
                  resolve(mid.shutdown());
                }),
              );

            return shutdownActions;
          }, []),
        );
      }

      // DEPRECATED - shutdown for routesDef
      if (routesDef) shutdownPromises.push(routesDef.shutdown());

      return Promise.allSettled(shutdownPromises);
    },
  };
}

export default createServer;
