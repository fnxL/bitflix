import "reflect-metadata";
import "module-alias/register";
import app from "./loaders/fastify";
import config from "@config";

const start = async () => {
  try {
    await app.listen(config.port, "0.0.0.0");
    app.log.info(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
