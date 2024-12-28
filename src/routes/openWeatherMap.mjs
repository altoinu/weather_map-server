import ENV from "../env.mjs";
import RouteError from "../types/RouteError.mjs";
import express from "express";

const openWeatherMapRouter = express.Router();

/**
 * @api {get} /currentWeather Gets current weather
 * @apiVersion 0.0.1
 * @apiName GetCurrentWeather
 * @apiGroup OpenWeatherMap
 * @apiDescription Gets current weather for specified latitude/longitude.
 *
 * @apiParam {String} [lat] latitude
 * @apiParam {String} [lon] longitude
 *
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/currentWeather.json?lat=xxxx&lon=xxxx
 *
 * @apiSuccess (200) {JSON} Current weather information.
 *
 * @apiSuccessExample {json} Success-Response
 *  {
 *      "main": {
 *          "temp": 75
 *      }
 *  }
 */
openWeatherMapRouter.get("/currentWeather.json", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) throw new RouteError("Missing latitude/longitude", 400);

    // https://openweathermap.org/current
    // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    const url = new URL("http://api.openweathermap.org/data/2.5/weather");
    const params = {
      appid: ENV.apiKey,
      lat: req.query.lat,
      lon: req.query.lon,
      units: "imperial",
    };
    url.search = new URLSearchParams(params).toString();

    const fetchResponse = await fetch(url, {
      method: "GET",
    });

    if (!fetchResponse.ok)
      throw new RouteError(
        "Error getting current weather: " + fetchResponse.body,
        500,
      );

    const jsonResponse = await fetchResponse.json();

    res.status(200);
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    res.json(jsonResponse);
  } catch (error) {
    next(error);
  }
});

openWeatherMapRouter.get("/5DayWeather.json", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) throw new RouteError("Missing latitude/longitude", 400);

    // https://openweathermap.org/forecast5
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const url = new URL("http://api.openweathermap.org/data/2.5/forecast");
    const params = {
      appid: ENV.apiKey,
      lat: lat,
      lon: lon,
      units: "imperial",
    };
    url.search = new URLSearchParams(params).toString();

    const fetchResponse = await fetch(url, {
      method: "GET",
    });

    if (!fetchResponse.ok)
      throw new RouteError(
        "Error getting 5 day weather: " + fetchResponse.body,
        500,
      );

    const jsonResponse = await fetchResponse.json();

    res.status(200);
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    res.json(jsonResponse);
  } catch (error) {
    next(error);
  }
});

export default openWeatherMapRouter;
