module.exports = {
  apps: [
    {
      name: "weather_map-server",
      script: "src/index.mjs",

      //'exec_mode': 'fork',
      // Use different version of node via nvm.
      // If not specified, defaults to system 'node'
      //'interpreter': 'node@10.16.0',
      //'interpreter': 'node@10.15.2',

      exec_mode: "cluster",
      instances: 0,
      //'interpreter' is not available when using cluster mode

      //'watch': true,
      watch: ["src/"],
      //'ignore_watch': [],
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        CORS_ALLOW_ORIGIN: ["http://localhost", "http://localhost:3000"],
      },
    },
  ],
};
