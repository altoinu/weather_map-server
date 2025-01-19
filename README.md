# weather_map-server

Detroit Labs coding challenge - simple weather forecast application - Backend Node.js server

This is a Node.js backend server to provide API to be used with weather forecast application [altoinu/weather_map-client](https://github.com/altoinu/weather_map-client).

## Writing README stuff

[https://help.github.com/en/articles/basic-writing-and-formatting-syntax](https://help.github.com/en/articles/basic-writing-and-formatting-syntax)

## Node stuff

- Node.js (v23.5.0) and npm [https://nodejs.org/](https://nodejs.org/)
- PM2 (v5.4.3) [http://pm2.keymetrics.io](http://pm2.keymetrics.io)

## Initial set up

```
npm install
```

### Environment variables

Set following values via <code>.env</code>

```
# Array of origins to allow in CORS, JSON format
CORS_ALLOW_ORIGIN=["http://localhost", "http://localhost:3000"]
# Port number to listen to.
PORT=4000
# API key obtained from Open Weather Map
OPEN_WEATHER_MAP_API_KEY=XXXXXX
```

## To run (for development)

```
npm run dev
```

...then try accessing one of defined routes:

- [http://localhost:4000/getip.json](http://localhost:4000/getip.json)
- [http://localhost:4000/config.json](http://localhost:4000/config.json)

## To start/restart with PM2:

```
pm2 start [ecosystem config file].js
pm2 restart [ecosystem config file].js
pm2 startOrRestart [ecosystem config file].js
```

- [PM2 cluster mode](http://pm2.keymetrics.io/docs/usage/cluster-mode)
- Immediately shuts down currently running process and then starts new one.
  - Causes this too-
    - App \[app_name\] with id \[0\] and pid \[20743\], exited with code \[100\] via signal \[SIGINT\]

## To reload:

```
pm2 reload [ecosystem config file].js
pm2 startOrReload [ecosystem config file].js
```

- [PM2 cluster mode, reload](http://pm2.keymetrics.io/docs/usage/cluster-mode/#reload)
- [https://stackoverflow.com/questions/44883269/what-is-the-difference-between-pm2-restart-and-pm2-reload](https://stackoverflow.com/questions/44883269/what-is-the-difference-between-pm2-restart-and-pm2-reload)
  - "With reload, pm2 restarts all processes one by one, always keeping at least one process running."
  - "If the reload system hasn’t managed to reload your application, a timeout will fallback to a classic restart."

## To gracefully reload (RECOMMENDED):

```
pm2 gracefulReload [ecosystem config file].js
pm2 startOrGracefulReload [ecosystem config file].js (reloads env var as well)
```

- [PM2 cluster mode, graceful shutdown](http://pm2.keymetrics.io/docs/usage/cluster-mode/#graceful-shutdown)
- [http://pm2.keymetrics.io/docs/usage/signals-clean-restart/](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)
  - Allows to do process.on('SIGINT', function() {... before shutdown

## Notes when restarting:

As of pm2 -v 3.5.1

- --update-env option doesn't seem to be working as it should
  - [https://github.com/Unitech/pm2/issues/3796](https://github.com/Unitech/pm2/issues/3796)
- watch: true does not update env that were changed in config .js/json
  - need to manually do pm2 startOrGracefulReload \[ecosystem config file\].js
- Manual restart/reload/gracefulReload causes env to be updated to whatever is in config .js/json
  - However if env var is removed from .js/json, it still remains in process.env and gets loaded.
    Not sure if this is pm2/node bug or just the way things are. - To prevent this, do pm2 delete to completely remove then pm2 start

## Lint

```
npm run lint:fix
```

## Generating docs

```
npm run build:doc
```

- Runs both apidoc and jsdoc

### apidoc

```
npm run build:doc:apidoc
```

- outputs to docs/apidoc
- [https://www.npmjs.com/package/apidoc](https://www.npmjs.com/package/apidoc)
- [http://apidocjs.com/](http://apidocjs.com/)
  - [params](http://apidocjs.com/#params)

### jsdoc

```
npm run build:doc:jsdoc
```

- outputs to docs/jsdoc
- [https://www.npmjs.com/package/jsdoc](https://www.npmjs.com/package/jsdoc)
- [https://jsdoc.app/](https://jsdoc.app/)
  - [Getting started](https://jsdoc.app/about-getting-started.html)
  - [tags](https://jsdoc.app/tags-example.html)
  - [Namepaths](https://jsdoc.app/about-namepaths.html)
  - [Namespace](https://jsdoc.app/tags-namespace.html)
    - [memberof](https://jsdoc.app/tags-memberof.html)
  - [Module](https://jsdoc.app/tags-module.html)
    - [param](https://jsdoc.app/tags-param.html)
    - [Function](https://jsdoc.app/tags-function.html)
    - [Class](https://jsdoc.app/tags-class.html)
