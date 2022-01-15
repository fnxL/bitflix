import "reflect-metadata";
import { Response, Request } from "express";
import { Container } from "typedi";
import MediaService from "./mediaService";
import { getSearchTerm } from "../utils/utils";
import { ApiError } from "../utils/ApiError";
import { Platform } from "../interfaces/Media/Platform";
import { Quality } from "../interfaces/Media/quality";
import { Links } from "../interfaces/Media/File";
import { IStreamLinks } from "../interfaces/Media/IStreamLinks";

const mediaService = Container.get(MediaService);
const logger: any = Container.get("logger");

export const play = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { range } = req.headers;

  if (id) {
    const response = await mediaService.streamVideo(id as string, range!);
    res.status(206);
    res.set(response.headers);
    response.data.pipe(res);
  } else {
    res.status(400);
    throw new ApiError(400, "Invalid id or Range headers");
  }
};

export const streamLinks = async (req: Request, res: Response) => {
  const searchTerm = getSearchTerm(req.body as IStreamLinks);
  const platform = req.body.platform as Platform;
  logger.info(`Fetching links for ${searchTerm}`);

  const links: Links = {
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
    res.set({
      "Cache-Control": "public, max-age=3600",
    });
    res.json(links);
  } else {
    throw new ApiError(500, "SearchTerm not found");
  }
};
