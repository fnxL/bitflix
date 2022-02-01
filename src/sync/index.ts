import { FastifyInstance } from "fastify";

import playback from "./playback";

export default async function (fastify: FastifyInstance) {
  fastify.register(playback, { prefix: "playback" });
}
``;
