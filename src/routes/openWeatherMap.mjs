import ENV from "../env.mjs";
import RouteError from "../types/RouteError.mjs";
import axios from "axios";
import express from "express";

const openWeatherMapRouter = express.Router();

const OPEN_WEATHER_MAP_API_BASE_URL = "http://api.openweathermap.org/data/2.5/";
const openWeatherMapAPI = axios.create({
  baseURL: OPEN_WEATHER_MAP_API_BASE_URL,
});

/**
 * @api {get} /currentWeather.json Get current weather
 * @apiVersion 0.0.1
 * @apiName GetCurrentWeather
 * @apiGroup OpenWeatherMap
 * @apiDescription Gets current weather for specified latitude/longitude.
 *
 * @apiQuery {String} lat latitude
 * @apiQuery {String} lon longitude
 *
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/currentWeather.json?lat=xxxx&lon=xxxx
 *
 * @apiSuccess (200) {JSON} Current weather information.
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *  "coord": {
 *    "lon": xxxx,
 *    "lat": xxxx
 *  },
 *  "weather": [
 *    {
 *      "id": 803,
 *      "main": "Clouds",
 *      "description": "broken clouds",
 *      "icon": "04d"
 *    }
 *  ],
 *  "base": "stations",
 *  "main": {
 *    "temp": 50.18,
 *    "feels_like": 49.37,
 *    "temp_min": 49.01,
 *    "temp_max": 51.44,
 *    "pressure": 1013,
 *    "humidity": 95,
 *    "sea_level": 1013,
 *    "grnd_level": 982
 *  },
 *  "visibility": 10000,
 *  "wind": {
 *    "speed": 1.99,
 *    "deg": 221,
 *    "gust": 5.01
 *  },
 *  "clouds": {
 *    "all": 73
 *  },
 *  "dt": 1735392938,
 *  "sys": {
 *    "type": 2,
 *    "id": 2009848,
 *    "country": "US",
 *    "sunrise": 1735390969,
 *    "sunset": 1735423701
 *  },
 *  "timezone": -18000,
 *  "id": 5003956,
 *  "name": "ThisTown",
 *  "cod": 200
 * }
 */
openWeatherMapRouter.get("/currentWeather.json", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) throw new RouteError("Missing latitude/longitude", 400);

    // https://openweathermap.org/current
    // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    const url = new URL(OPEN_WEATHER_MAP_API_BASE_URL + "weather");
    const params = {
      appid: ENV.apiKey,
      lat: req.query.lat,
      lon: req.query.lon,
      units: "imperial",
    };
    url.search = new URLSearchParams(params).toString();

    /* For some reason Node.js fetch seems to fail often... going with axios for now
    const fetchResponse = await fetch(url, {
      method: "GET",
    });

    if (!fetchResponse.ok)
      throw new RouteError(
        "Error getting current weather: " + fetchResponse.body,
        500,
      );

    const jsonResponse = await fetchResponse.json();
    */

    const fetchResponse = await openWeatherMapAPI.get("weather", {
      method: "GET",
      params,
      responseType: "json",
    });

    const jsonResponse = fetchResponse.data;

    res.status(200);
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    res.json(jsonResponse);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /5DayWeather.json.json Get 5 day weather forecase
 * @apiVersion 0.0.1
 * @apiName Get5DayWeather
 * @apiGroup OpenWeatherMap
 * @apiDescription Gets 5 day weather forecast for specified latitude/longitude.
 *
 * @apiQuery {String} lat latitude
 * @apiQuery {String} lon longitude
 *
 * @apiExample {curl} Example usage:
 *    curl -i http://localhost/5DayWeather.json?lat=xxxx&lon=xxxx
 *
 * @apiSuccess (200) {JSON} 5 day weather forecast information.
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *  "cod": "200",
 *  "message": 0,
 *  "cnt": 40,
 *  "list": [
 *    {
 *      "dt": 1735398000,
 *      "main": {
 *        "temp": 50.27,
 *        "feels_like": 49.46,
 *        "temp_min": 50.27,
 *        "temp_max": 50.74,
 *        "pressure": 1014,
 *        "sea_level": 1014,
 *        "grnd_level": 983,
 *        "humidity": 95,
 *        "temp_kf": -0.26
 *      },
 *      "weather": [
 *        {
 *          "id": 500,
 *          "main": "Rain",
 *          "description": "light rain",
 *          "icon": "10d"
 *        }
 *      ],
 *      "clouds": {
 *        "all": 82
 *      },
 *      "wind": {
 *        "speed": 15.41,
 *        "deg": 217,
 *        "gust": 31.03
 *      },
 *      "visibility": 10000,
 *      "pop": 0.2,
 *      "rain": {
 *        "3h": 0.11
 *      },
 *      "sys": {
 *        "pod": "d"
 *      },
 *      "dt_txt": "2024-12-28 15:00:00"
 *    },
 *    ...
 *  ],
 *  "city": {
 *    "id": 5003956,
 *    "name": "ThisTown",
 *    "coord": {
 *      "lat": xxxx,
 *      "lon": xxxx
 *    },
 *    "country": "US",
 *    "population": 5970,
 *    "timezone": -18000,
 *    "sunrise": 1735390969,
 *    "sunset": 1735423703
 *  }
 * }
 */
openWeatherMapRouter.get("/5DayWeather.json", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) throw new RouteError("Missing latitude/longitude", 400);

    // https://openweathermap.org/forecast5
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const url = new URL(OPEN_WEATHER_MAP_API_BASE_URL + "forecast");
    const params = {
      appid: ENV.apiKey,
      lat: lat,
      lon: lon,
      units: "imperial",
    };
    url.search = new URLSearchParams(params).toString();

    /* For some reason Node.js fetch seems to fail often... going with axios for now
    const fetchResponse = await fetch(url, {
      method: "GET",
    });

    if (!fetchResponse.ok)
      throw new RouteError(
        "Error getting 5 day weather: " + fetchResponse.body,
        500,
      );

    const jsonResponse = await fetchResponse.json();
    */

    const fetchResponse = await openWeatherMapAPI.get("forecast", {
      method: "GET",
      params,
      responseType: "json",
    });

    const jsonResponse = fetchResponse.data;

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
