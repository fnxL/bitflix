import { FastifyReply } from "fastify";
import "reflect-metadata";
import { Container } from "typedi";
import {
  Platform,
  PlayFastifyRequest,
  Quality,
  StreamLinksFastifyRequest,
  StreamLinksResponseType,
} from "../types-and-schemas";
import { ApiError } from "../utils/ApiError";
import { getSearchTerm } from "../utils/utils";
import MediaService from "./mediaService";

const mediaService = Container.get(MediaService);
const logger: any = Container.get("logger");

export const play = async (request: PlayFastifyRequest, reply: FastifyReply) => {
  const { id } = request.query;
  const { range } = request.headers;

  if (!id) throw new ApiError(400, "Invalid Request");

  if (range) {
    const response = await mediaService.streamVideo(id, range);

    reply.status(206);

    reply.headers(response.headers);

    reply.send(response.data);
  } else {
    throw new ApiError(400, "Invalid range headers");
  }
};

export const getStreamLinks = async (request: StreamLinksFastifyRequest, reply: FastifyReply) => {
  const searchTerm = getSearchTerm(request.body);
  const { platform } = request.body;
  logger.info(`Fetching links for ${searchTerm}`);

  const links: StreamLinksResponseType = {
    ultraHD: [],
    fullHD: [],
    hd: [],
  };

  if (searchTerm) {
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
  } else {
    throw new ApiError(500, "SearchTerm not found");
  }
};
