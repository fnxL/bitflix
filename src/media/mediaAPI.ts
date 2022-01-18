import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { StreamLinksRequest, StreamLinksResponse } from "../types-and-schemas";
import { routeOptions } from "../utils/utils";
import { getStreamLinks, play } from "./mediaController";

async function mediaRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  /* Get stream links for a title */
  fastify.post(
    "/stream-links",
    routeOptions(StreamLinksResponse, 200, StreamLinksRequest, fastify.auth([fastify.verifyUser])),
    getStreamLinks
  );

  /* Stream video file */
  fastify.get("/play/:name", play);
}

export default mediaRoutes;
