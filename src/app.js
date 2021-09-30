/* eslint-disable global-require */
import express from 'express';
import config from './config';
import loader from './loaders';
import logger from './loaders/logger';

async function startServer() {
  const app = express();

  await loader({ expressApp: app }).catch((err) => console.log(err));

  app
    .listen(config.port, () => {
      logger.info(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
  `);
    })
    .on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();
