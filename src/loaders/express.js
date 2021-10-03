import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import expressPinoLogger from 'express-pino-logger';
import typedi from 'typedi';
import logger from './logger'; // init logger first
import { errorHandler, notFound } from '../api/middlewares/error';
import '../config/db'; // then db
import routes from '../api/routes'; // routes depend on both logger and db.

const { Container } = typedi;

export default ({ app }) => {
  // logger service
  const loggerMiddleware = expressPinoLogger({
    logger,
    autoLogging: false,
  });

  app.use(loggerMiddleware);

  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cookieParser());
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://localhost:3000', 'https://bitflix.pages.dev'],
    })
  );

  app.use(express.json());

  app.use(routes);

  /// catch 404 and forward to error handler
  app.use(notFound);

  /// error handlers
  app.use(errorHandler);
};
