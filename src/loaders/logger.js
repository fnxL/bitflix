import pino from 'pino';
import typedi from 'typedi';

const { Container } = typedi;

const options = {
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    translateTime: 'dd-mm-yyyy, h:MM:ss TT',
  },
};
const pinoInstance = pino(options);

Container.set('logger', pinoInstance);

export default pinoInstance;
