import { FastifyInstance, FastifyLoggerInstance, RouteShorthandOptions } from "fastify";
import { Container } from "typedi";
import { SubtitlesSchema, SubtitlesType } from "./schema";
import SubtitlesService from "./subtitlesService";

const logger: FastifyLoggerInstance = Container.get("logger");
const subtitlesService = Container.get(SubtitlesService);

const SubtitlesOptions: RouteShorthandOptions = {
  schema: {
    description: "Fetch subtitles for specified title",
    summary: "Subtitles",
    tags: ["Subtitles"],
    body: SubtitlesSchema,
  },
};

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: SubtitlesType }>("/", SubtitlesOptions, async (req, res) => {
    const data = req.body;
    const subs = await subtitlesService.getSubtitles(data);
    res.send(subs);
  });
}
