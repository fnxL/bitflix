import { FastifyInstance } from "fastify";

import adminRoutes from "./admin";
import authRoutes from "./auth";
import oauthRoutes from "./gdrive-oauth/oauthAPI";
import mediaRoutes from "./media/mediaAPI";
import subtitlesRoutes from "./subtitles/subtitlesAPI";
import syncRoutes from "./sync";

export default async function (fastify: FastifyInstance) {
  fastify.register(adminRoutes, { prefix: "admin" });
  fastify.register(authRoutes, { prefix: "auth" });
  fastify.register(oauthRoutes, { prefix: "drive/oauth" });
  fastify.register(mediaRoutes, { prefix: "media" });
  fastify.register(syncRoutes, { prefix: "sync" });
  fastify.register(subtitlesRoutes, { prefix: "subtitles" });
}
