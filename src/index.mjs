"use strict";

import server from "./server.mjs";

const serverObj = server();
serverObj.start();

async function doPM2Shutdown() {
  await serverObj.shutdown();
  process.exit(0);
}

process.on("message", (message) => {
  if (message === "shutdown") doPM2Shutdown();
});

process.on("SIGINT", () => {
  doPM2Shutdown();
});
