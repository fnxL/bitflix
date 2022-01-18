import "reflect-metadata";
import prismaClient from "./database";
import { Container } from "typedi";
import { FastifyLoggerInstance } from "fastify";

export default (logger: FastifyLoggerInstance) => {
  try {
    Container.set("prisma", prismaClient);
    Container.set("logger", logger);
  } catch (e) {
    throw e;
  }
};
