/**
 * Express js middleware to allow CORS request on origin specified in corsDef
 * @memberof module:CORS
 * @alias module:CORS#allow
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
function allow(corsDef, req, res, next) {
  if (req.method == "OPTIONS") {
    console.log(req.method + " " + req.originalUrl);
    console.log(req.headers);
  }

  if (Object.prototype.hasOwnProperty.call(req.headers, "origin")) {
    let is_CORS_ALLOW_ORIGIN_WILDCARD = corsDef.origin.indexOf("*") != -1;
    if (
      is_CORS_ALLOW_ORIGIN_WILDCARD ||
      corsDef.origin.indexOf(req.headers.origin) != -1
    ) {
      res.header(
        "Access-Control-Allow-Origin",
        is_CORS_ALLOW_ORIGIN_WILDCARD ? "*" : req.headers.origin,
      );
      // Access-Control-Allow-Credentials true/false
      // Access-Control-Expose-Headers

      // TODO: set these values in corsDef too?
      var requestMethod;
      var requestHeader;
      for (var header in req.headers) {
        if (header.toLowerCase() == "access-control-request-method")
          requestMethod = req.headers[header];

        if (header.toLowerCase() == "access-control-request-headers")
          requestHeader = req.headers[header];
      }

      if (!requestMethod) requestMethod = "GET,POST,OPTIONS";
      if (!requestHeader) requestHeader = "accept, content-type";

      res.header("Access-Control-Allow-Methods", requestMethod);
      res.header("Access-Control-Allow-Headers", requestHeader);
    } else {
      console.error(
        `CORS error... origin "${req.headers.origin}" not specified`,
      );
    }
  }

  if (req.method == "OPTIONS") res.status(200).end();
  else next();
}

/**
 * @typedef {function(Request, Response, Function):void} ExpressMiddleware
 * @memberof module:CORS
 * @alias module:CORS.ExpressMiddleware
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */

/**
 * Express js middleware to allow CORS request on origin specified
 * @module CORS
 * @version 1.0.3 2025/02/16
 * @param {Object} corsDef - CORS definition.
 * @param {string[]} [corsDef.origin] - CORS allowed origin domain.
 * @returns {{allow:ExpressMiddleware}} Object {allow - expressjs middleware}
 * @example
 * import CORS from "./middleware/CORS.mjs";
 *
 * const cors = CORS({
 *    "origin": [
 *       "http://localhost",
 *       "http://localhost:3001",
 *       "http://www.example.com",...
 *    ]
 * });
 *
 * // or
 * const cors = CORS({
 *    "origin": [
 *       "*"
 *    ]
 * });
 *
 * app.use(cors.allow);
 *
 * @todo Set requestMethod, requestHeader via corsDef too?
 */
function CORS(corsDef) {
  return {
    allow: allow.bind(this, corsDef),
    /*
	allow: function(req, res, next) {
		allow(corsDef, req, res, next);
	}
	 */
  };
}

export default CORS;
