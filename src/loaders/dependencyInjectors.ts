import "reflect-metadata";
import loggerInstance from "../utils/logger";
import prismaClient from "./database";
import { Container } from "typedi";

export default () => {
  try {
    Container.set("logger", loggerInstance);
    Container.set("prisma", prismaClient);
  } catch (e) {
    loggerInstance.error("Error on dependency injector loader: " + e);
    throw e;
  }
};
