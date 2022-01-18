import dependencyInjectors from "./dependencyInjectors";
import Fastify from "fastify";
import config from "../../config/default";
import fastifyCookie from "fastify-cookie";
import fastifyCors from "fastify-cors";
import fastifyAuth from "fastify-auth";

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

dependencyInjectors(app.log);

import authRoutes from "../auth/authAPI";
import mediaRoutes from "../media/mediaAPI";
import oauthRoutes from "../gdrive-oauth/oauthAPI";
import subtitlesRoutes from "../subtitles/subtitlesAPI";
import verifyUser from "../utils/verifyUser";
import verifyAdmin from "../utils/verifyAdmin";

app.register(fastifyCookie, {
  secret: "secret",
  parseOptions: {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  },
});

app.register(fastifyCors, {
  credentials: true,
  origin: ["*"],
});

app.decorate("verifyUser", verifyUser).decorate("verifyAdmin", verifyAdmin).register(fastifyAuth);

// app.setErrorHandler(function (error, request, reply) {
//   let statusCode = error.statusCode || 500;
//   this.log.error(error);
//   reply.status(statusCode).send({ status: Status.ERROR, message: error.message, statusCode });
// });

app.register(authRoutes, { prefix: "api/auth" });
app.register(mediaRoutes, { prefix: "api/media" });
app.register(oauthRoutes, { prefix: "api/drive/oauth" });
app.register(subtitlesRoutes, { prefix: "api/subtitles" });

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

export default app;
