import pino from "pino";

const options = {
  base: {
    pid: false,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: "SYS:h:MM:ss TT",
    },
  },
};
const pinoInstance = pino(options);

export default pinoInstance;
