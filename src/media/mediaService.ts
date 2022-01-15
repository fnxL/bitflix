import pino from "pino";
import { Inject, Service } from "typedi";
import config from "../../config/default";
import { drive_v3, google } from "googleapis";
import { SearchParams } from "../interfaces/Media/SearchParams";
import { Platform } from "../interfaces/Media/Platform";
import { File } from "../interfaces/Media/File";
import { Quality } from "../interfaces/Media/quality";

@Service()
class MediaService {
  private drive: drive_v3.Drive;

  constructor(@Inject("logger") private logger: pino.Logger) {
    if (config.token) {
      const { client_secret, client_id, redirect_uris } = config.appCredentials;
      const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      oauth2Client.setCredentials(config.token);

      this.drive = google.drive({
        version: "v3",
        auth: oauth2Client,
      });
      logger.info("Media Service Innitialized...");
    } else {
      throw new Error("No auth tokens provided");
    }
  }

  /**
   * Get file metadata
   * @param {string} id - The id of the file in google drive
   */
  async getFile(id: string) {
    const { data } = await this.drive.files.get({
      fileId: id,
      fields: "id, name, size, mimeType",
      supportsAllDrives: true,
    });

    return data;
  }

  /**
   * Create query string for searching google drive.
   */
  async createQuery(rules: Rules) {
    let query = "";

    for (let [key, value] of Object.entries(rules)) {
      const { contains, exclude } = value as RuleValue;
      if (contains) {
        contains.forEach((element) => {
          query = query.concat(` and ${key} contains "${element}"`);
        });
      }

      if (exclude) {
        exclude.forEach((element) => {
          query = query.concat(` and not ( ${key} contains '${element}' )`);
        });
      }
    }

    query = query && query.slice(5);
    return query;
  }

  async convertIdsToLink(files: drive_v3.Schema$File[], quality: Quality): Promise<File[]> {
    const result = files.map((file) => {
      const encodedFileName = encodeURI(file.name as string);
      const url = `${config.base_url}/api/media/play/${encodedFileName}?id=${file.id}`;
      return {
        name: file.name,
        size: file.size,
        url,
      };
    });
    return result as File[];
  }

  /**
   * Get streaming links for specified title
   *
   * @param {SearchParams} search - Required search parameters
   * @returns Stream links for specified title name
   *
   */
  async getStreamLinks(search: SearchParams) {
    const { isFireFox, fileName, platform, pageSize, quality } = search;

    const fileNameQuality = fileName.concat(` ${quality}`);

    const queryWeb: Rules = {
      mimeType: {
        contains: [isFireFox ? "video/mp4" : "video/"],
      },
      fullText: {
        contains: [`${fileNameQuality}`],
        exclude: ["dual", "sample", "x265", "hevc", "h265", "yify", "yts", "dubbed", "rus"],
      },
    };

    const queryAndroid: Rules = {
      mimeType: {
        contains: ["video/"],
      },
      fullText: {
        contains: [`${fileNameQuality}`],
        exclude: ["sample", "yify", "yts"],
      },
    };

    const searchQuery = await this.createQuery(platform === Platform.WEB ? queryWeb : queryAndroid);

    const {
      data: { files },
    } = await this.drive.files.list({
      corpora: "allDrives",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageSize,
      fields: "files(id,name,size)",
      q: searchQuery,
    });

    let results: File[] = [];
    if (files) {
      results = await this.convertIdsToLink(files, quality);
    }

    return results;
  }

  /**
   * Stream a file/title
   * @param {string} id - Id of the file
   * @param {string} range - Requested range of the file.
   */
  async streamVideo(id: string, range: string) {
    const response = await this.drive.files.get(
      {
        fileId: id,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "stream",
        headers: { Range: range },
      }
    );

    // delete this header to avoid downloading the file or set it to inline
    delete response.headers["content-disposition"];
    // trash headers
    delete response.headers["alt-svc"];
    delete response.headers.vary;
    delete response.headers["x-guploader-uploadid"];
    delete response.headers.date;
    delete response.headers.connection;
    delete response.headers.expires;

    // accept byte ranges
    response.headers["accept-ranges"] = "bytes";

    // Cache Control 1 Hour
    response.headers["cache-control"] = "public, max-age=3600";

    // set Etag for cache control to work.
    response.headers.Etag = id;

    return response;
  }
}

export default MediaService;
