import ENV from "../env.mjs";
import RouteError from "../types/RouteError.mjs";
import { getENVConstants } from "../utils/utils.mjs";
import express from "express";

const configRoute = express.Router();

/**
 * @api {get} /getip.json Get IP
 * @apiVersion 0.0.1
 * @apiName GetIP
 * @apiGroup Config
 * @apiDescription Gets client IP address.
 *
 * @apiParam {String} [callback] callback function for jsonp response
 *
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/getip.json
 *
 * @apiSuccess (200) {String} ip IP address of the client.
 *
 * @apiSuccessExample {json} Success-Response
 *    {
 *       "ip": "1.2.3.4"
 *    }
 */
configRoute.get("/getip.json", (req, res) => {
  let clientIP = req.header("x-forwarded-for") || req.socket.remoteAddress;
  let configValues = {
    ip: clientIP,
  };

  res.status(200);
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);

  if (Object.prototype.hasOwnProperty.call(req.query, "callback"))
    res.jsonp(configValues);
  else res.json(configValues);
});

/**
 * @api {get} /config.json Get Configuration
 * @apiVersion 0.0.1
 * @apiName GetConfig
 * @apiGroup Config
 * @apiDescription Gets configuration.
 *
 * @apiParam {String} [callback] callback function for jsonp response
 *
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/config.json
 *
 * @apiSuccess (200) {String} env Environment (NODE_ENV).
 * @apiSuccess (200) {String} envName Environment name.
 * @apiSuccess (200) {String} envLongName Environment name, long format.
 * @apiSuccess (200) {String} ip IP address of the client.
 *
 * @apiSuccessExample {json} Success-Response
 *    {
 *       "env": "production",
 *       "envName": "production",
 *       "envLongName": "Production",
 *       "ip": "1.2.3.4"
 *    }
 */
configRoute.get("/config.json", (req, res) => {
  let clientIP = req.header("x-forwarded-for") || req.socket.remoteAddress;
  let envConstants = getENVConstants(ENV.env);

  let configValues = {
    env: ENV.env,
    envName: envConstants["name"],
    envLongName: envConstants["longname"],
    ip: clientIP,
  };

  res.status(200);
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);

  if (Object.prototype.hasOwnProperty.call(req.query, "callback"))
    res.jsonp(configValues);
  else res.json(configValues);
});

/**
 * @api {get} /error.json RouteError example route
 * @apiVersion 0.0.1
 * @apiName DoError
 * @apiGroup Config
 * @apiDescription Returns 500 error.
 *
 * @apiParam {String} [callback] callback function for jsonp response
 *
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/error.json
 *
 */
configRoute.get("/error.json", (req, res, next) => {
  try {
    throw new RouteError("This is error message.", 500);
  } catch (error) {
    next(error);
  }
});

export default configRoute;
