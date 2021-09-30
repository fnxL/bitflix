import typedi from 'typedi';
import expressLoader from './express';

const { Container } = typedi;
const logger = Container.get('logger');

export default async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  logger.info('Express Server Initialized');
};
