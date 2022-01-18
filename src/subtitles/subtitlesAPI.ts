import { FastifyInstance, FastifyPluginOptions } from "fastify";
import "reflect-metadata";
import { Container } from "typedi";
import { subtitlesRequestType } from "../types-and-schemas";
import SubtitlesService from "./subtitlesService";

const subtitlesService = Container.get(SubtitlesService);

async function subtitlesRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{ Body: subtitlesRequestType }>("/", async (request, reply) => {
    const data = request.body;
    const subs = await subtitlesService.getSubtitles(data);
    reply.send(subs);
  });
}

export default subtitlesRoutes;
