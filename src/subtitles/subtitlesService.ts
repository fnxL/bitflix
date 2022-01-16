import pino from "pino";
import "reflect-metadata";
import { Inject, Service } from "typedi";
import config from "../../config/default";
import OS from "opensubtitles-api";
import { OpenSubtitles } from "../interfaces/Subtitles/OpenSubtitles";

@Service()
class SubtitlesService {
  constructor(@Inject("logger") private logger: pino.Logger, private openSubtitles: any) {
    this.openSubtitles = new OS({
      useragent: "UserAgent",
      username: config.opensubtitles.username,
      password: config.opensubtitles.password,
      ssl: true,
    });

    this.logger.info("Subtitles Service initialized...");
  }

  async getSubtitles(data: OpenSubtitles) {
    this.logger.info("Fetching subs for " + data.filename);
    const subs = await this.openSubtitles.search(data);
    return subs;
  }
}

export default SubtitlesService;
