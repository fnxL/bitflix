import typedi from 'typedi';

const { Container } = typedi;

const logger = Container.get('logger');

export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  logger.error(error);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  if (err.response?.status) statusCode = err.response.status;
  res.status(statusCode);

  logger.error(err?.response?.statusText || err.message);
  res.json({
    status: false,
    message: err.response?.statusText ? err.response?.statusText : err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
