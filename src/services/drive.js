const { google } = require('googleapis');
const config = require('../config');
const { sortByFileSize } = require('../utils');

class DriveAPI {
  constructor() {
    if (config.token) {
      const { client_secret, client_id, redirect_uris } = config.appCredentials;
      const oauth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      oauth2Client.setCredentials(config.token);
      this.drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
      });
    } else {
      throw new Error('No auth tokens provided');
    }
  }

  // get file metadata
  getFile = async (id) => {
    try {
      const { data } = await this.drive.files.get({
        fileId: id,
        fields: 'id, name, size, mimeType',
        supportsAllDrives: true,
      });

      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  streamFile = async (id, range) => {
    const resp = await this.drive.files.get(
      {
        fileId: id,
        alt: 'media',
        supportsAllDrives: true,
      },
      {
        responseType: 'stream',
        headers: { Range: range },
      }
    );

    // delete this header to avoid downloading the file or set it to inline
    delete resp.headers['content-disposition'];
    // trash headers
    delete resp.headers['alt-svc'];
    delete resp.headers.vary;
    delete resp.headers['x-guploader-uploadid'];
    delete resp.headers.date;
    delete resp.headers.connection;
    delete resp.headers.expires;

    // accept byte ranges
    resp.headers['accept-ranges'] = 'bytes';

    // Cache Control 1 Hour
    resp.headers['cache-control'] = 'public, max-age=3600';

    // set Etag for cache control to work.
    resp.headers.Etag = id;

    return resp;
  };

  convertIdsToLink = (files) => {
    files.forEach((file) => {
      const fileNameEncoded = encodeURI(file.name);
      file.link = `${config.base_url}/api/media/videoplayback/${fileNameEncoded}?id=${file.id}`;
      delete file.id;
    });
  };

  createQuery = (rules) => {
    let query = '';
    Object.keys(rules).forEach((fieldName) => {
      const { contains, exclude } = rules[fieldName];
      if (contains) {
        contains.forEach((item) => {
          query = query.concat(` and ${fieldName} contains '${item}'`);
        });
      }
      if (exclude) {
        exclude.forEach((item) => {
          query = query.concat(` and not ( ${fieldName} contains '${item}' )`);
        });
      }
    });
    query = query && query.slice(5);
    return query;
  };

  // remove hasThumbnail false && no videoMetaData && filter by durationMillis
  filterStreamLinks = (files, duration, type) => {
    const threshold = type === 'movie' ? 600000 : 300000; // 10 minutes / 5 minutes
    const filteredLinks = files.filter(({ videoMediaMetadata }) => {
      if (videoMediaMetadata) {
        return true;
        // Math.abs(duration - videoMediaMetadata.durationMillis) <= threshold
      }
      return false;
    });
    return filteredLinks;
  };

  /**
   *
   * @param {*} fileName - Name of file
   * @param {*} duration - Duration in milliseconds
   * @param {*} type - type of file (movie/tv/show)
   * @param {*} pageSize  - result size default 100
   * @returns Stream links of given file sorted by file size.
   */

  getStreamLinks = async (
    fileName,
    platform = 'web',
    isFireFox = false,
    pageSize = 100
  ) => {
    /**
     * for query use format :
     * {
     *    fieldName:{
     *      contains:[string],
     *      exclude:[string]
     *    },
     * }
     */
    const queryWeb = {
      mimeType: {
        contains: [isFireFox ? 'video/mp4' : 'video/'],
      },
      fullText: {
        contains: [`${fileName}`],
        exclude: [
          'dual',
          'hindi',
          'sample',
          'x265',
          'hevc',
          'h265',
          'yify',
          'yts',
        ],
      },
    };

    const queryAndroid = {
      mimeType: {
        contains: ['video/'],
      },
      fullText: {
        contains: [`${fileName}`],
        exclude: ['sample', 'yify', 'yts'],
      },
    };

    const query = this.createQuery(
      platform === 'web' ? queryWeb : queryAndroid
    );

    const {
      data: { files },
    } = await this.drive.files.list({
      corpora: 'allDrives',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageSize: pageSize,
      fields:
        'files(id,name,mimeType,size,hasThumbnail,videoMediaMetadata(durationMillis))',
      q: query,
    });

    this.convertIdsToLink(files, fileName);

    // no need to filter links for now. will come back to it later.
    // const links = this.filterStreamLinks(files, duration, type);

    // simply sort by filesize in descending order.
    // since higher file size ==> higher bit rate ==> higher the quality of the video.
    const sortedLinks = sortByFileSize(files);

    return sortedLinks;
  };
}

module.exports = DriveAPI;
