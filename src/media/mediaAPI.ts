import { FastifyInstance, FastifyLoggerInstance, RouteShorthandOptions } from "fastify";
import {
  Platform,
  PlayParams,
  PlayParamsType,
  PlayQueryString,
  PlayQueryStringType,
  Quality,
  StreamLinksResponseSchema,
  StreamLinksResponseType,
  StreamLinksSchema,
  StreamLinksType,
} from "./schema";
import { Container } from "typedi";
import MediaService from "./mediaService";
import { getSearchTerm } from "@util/utils";
import { ApiError } from "@util/ApiError";

const mediaService = Container.get(MediaService);
const logger: FastifyLoggerInstance = Container.get("logger");

export default async function (fastify: FastifyInstance) {
  const StreamLinksOptions: RouteShorthandOptions = {
    schema: {
      description: "Get stream links for a title",
      summary: "Stream links",
      tags: ["Media"],
      body: StreamLinksSchema,
      response: {
        200: StreamLinksResponseSchema,
      },
    },
  };

  /* Get stream links for a title */
  fastify.post<{ Body: StreamLinksType; Reply: StreamLinksResponseType }>(
    "/stream-links",
    StreamLinksOptions,
    async (req, res) => {
      const searchTerm = getSearchTerm(req.body);

      const { platform } = req.body;

      logger.info(`Fetching links for ${searchTerm}`);

      const links: StreamLinksResponseType = {
        ultraHD: [],
        fullHD: [],
        hd: [],
      };

      if (platform === Platform.ANDROID_TV) {
        // TV
        const [ultraHD, fullHD] = await Promise.all([
          mediaService.getStreamLinks({
            fileName: searchTerm,
            quality: Quality.ULTRA_HD,
            platform: Platform.ANDROID,
          }),
          mediaService.getStreamLinks({
            fileName: searchTerm,
            quality: Quality.FULL_HD,
            platform: Platform.ANDROID,
          }),
        ]);

        links.ultraHD = ultraHD;
        links.fullHD = fullHD;
      } else {
        // WEB & MOBILE
        const [fullHD, hd] = await Promise.all([
          mediaService.getStreamLinks({
            fileName: searchTerm,
            quality: Quality.FULL_HD,
            platform,
          }),
          mediaService.getStreamLinks({
            fileName: searchTerm,
            quality: Quality.HD,
            platform,
          }),
        ]);
        links.hd = hd;
        links.fullHD = fullHD;
      }
      return links;
    }
  );

  const PlayOptions: RouteShorthandOptions = {
    schema: {
      description: "Stream a video file",
      summary: "Play",
      tags: ["Media"],
      params: PlayParams,
      querystring: PlayQueryString,
    },
  };

  fastify.get<{ Params: PlayParamsType; Querystring: PlayQueryStringType }>(
    "/play/:name",
    PlayOptions,
    async (req, res) => {
      const { id } = req.query;
      const { range } = req.headers;

      if (!id) throw new ApiError(400, "Invalid Request");

      if (!range) throw new ApiError(400, "Invalid range headers");

      const response = await mediaService.streamVideo(id, range);

      res.status(206);

      res.headers(response.headers);

      res.send(response.data);
    }
  );
}
