import "reflect-metadata";
import app from "./loaders/express";
import logger from "./utils/logger";
import config from "../config/default";

async function startServer() {
  app
    .listen(config.port, () => {
      logger.info(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
  `);
    })
    .on("error", (err: Error) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();
