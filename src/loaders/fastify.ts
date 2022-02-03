import dependencyInjectors from "./dependencies";
import Fastify from "fastify";
import config from "@config";
import fastifyCookie from "fastify-cookie";
import fastifyCors from "fastify-cors";
import fastifyAuth from "fastify-auth";
import fastifySwagger from "fastify-swagger";

const app = Fastify({
  logger:
    config.environment === "development"
      ? {
          prettyPrint: {
            colorize: true,
            levelFirst: true,
            translateTime: "SYS:h:MM:ss TT",
            ignore: "pid,hostname",
          },
        }
      : false,
});
// Pass logger instance of fastify App
dependencyInjectors(app.log);

import routes from "../routes";
import verifyUser from "@util/verifyUser";
import verifyAdmin from "@util/verifyAdmin";
import Container from "typedi";
import { PrismaClient } from "@prisma/client";

app.register(fastifyCookie, {
  secret: "secret",
  parseOptions: {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "none",
  },
});

app.register(fastifyCors, {
  credentials: true,
  origin: ["*"],
});

app.register(fastifySwagger, {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: "bitflix-api",
      version: "1.0.0",
    },
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      {
        name: "Admin",
        description: "Admin related endpoints",
      },
      {
        name: "Authentication",
        description: "Auth related end-points",
      },
      {
        name: "Media",
        description: "Media related endpoints",
      },
      {
        name: "Sync",
        description: "Media sync related endpoints",
      },
      {
        name: "Subtitles",
        description: "Subtitles related endpoints",
      },
      {
        name: "gdrive-oauth",
      },
    ],
  },
});

app.decorate("verifyUser", verifyUser).decorate("verifyAdmin", verifyAdmin).register(fastifyAuth);

// app.setErrorHandler(function (error, request, reply) {
//   let statusCode = error.statusCode || 500;
//   this.log.error(error);
//   reply.status(statusCode).send({ status: Status.ERROR, message: error.message, statusCode });
// });

app.register(routes, { prefix: "api" });

app.get("/app/updates", async (req, res) => {
  const prisma: PrismaClient = Container.get("prisma");
  const result = await prisma.appConfig.findUnique({
    where: {
      appName: "com.fnxl.bitflix",
    },
  });
  return result;
});

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

export default app;
