const { google } = require('googleapis');
const config = require('config');
const { sortBy, sortOrder } = require('../utils');

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.BASE_URL_DEV
    : process.env.BASE_URL_PROD;

class DriveAPI {
  constructor() {
    if (config.has('token')) {
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

  // redundant
  getRange = async (range, file) => {
    const videoObj = {
      mimeType: '',
      start: 0,
      end: 0,
      chunkSize: 0,
      size: 0,
    };

    videoObj.mimeType = file.mimeType;
    videoObj.size = parseInt(file.size, 10);

    const startEnd = range.replace(/bytes=/, '').split('-');
    videoObj.start = parseInt(startEnd[0], 10);
    videoObj.end =
      parseInt(startEnd[1], 10) > 0
        ? parseInt(startEnd[1], 10)
        : videoObj.size - 1;

    videoObj.chunkSize = videoObj.end - videoObj.start + 1;

    return videoObj;
  };

  streamFile = async (id, res, range) => {
    if (id) {
      try {
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

        // accept byte ranges
        res.set({ 'accept-ranges': 'bytes' });

        // delete this header to avoid downloading the file or set it to inline
        delete resp.headers['content-disposition'];

        // trash header
        delete resp.headers['alt-svc'];

        // keeps the connection alive
        resp.headers.connection = 'keep-alive';

        // for some reason this only works in firefox.
        resp.headers['cache-control'] = 'public, max-age=3600';

        // redundant header if cache-control exists
        delete resp.headers.expires;

        res.status(206);
        res.set(resp.headers);

        resp.data.pipe(res);
      } catch (error) {
        res.json(error);
      }
    } else
      res.status(404).json({
        status: false,
        message: 'No fileId provided',
      });
  };

  convertIdsToLink = (files) => {
    files.forEach((file) => {
      const fileNameEncoded = encodeURI(file.name);
      file.link = `${BASE_URL}/api/media/videoplayback/${fileNameEncoded}?id=${file.id}`;
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
   * for orderBy format use:
   *
   * orderby = [
   *  ['bluray', 'hdr'],
   *  ['bdrip'],
   *  ['etc,etc']
   * ]
   * @param {*} files
   * @returns sorted stream links.
   */

  sortStreamLinks = (files, orderBy) => {
    const sortedLinks = sortBy(files, orderBy);
    return sortedLinks;
  };
  // streamLinks -> wrapperFunc -> getStreamLinks
  /*
    linkformat = ${serverIp}/api/media/videoplayback?id=1Q_kA1j1LifWbf-3YFKmp_K-oL3sdD6x2x
    returns {
      "720": [],
      "1080": [strings], //10 links
      "2160": []
    }

     @dec     generate stream links of various quality by default.
     @params  fileName -> `MovieName releaseYear quality`
  */

  /**
   *
   * @param {*} fileName - Name of file
   * @param {*} duration - Duration in milliseconds
   * @param {*} type - type of file (movie/tv/show)
   * @param {*} pageSize  - result size default 100
   * @returns Stream links of given file sorted by highest quality.
   */

  getStreamLinks = async (
    fileName,
    duration,
    type = 'movie',
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
    try {
      const query = this.createQuery({
        mimeType: {
          contains: ['video/'],
        },
        fullText: {
          contains: [`${fileName}`],
          exclude: ['dual', 'hindi', 'sample', 'x265', 'hevc', 'h.265', 'h265'],
        },
      });

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

      // filter all wastefull links
      const links = this.filterStreamLinks(files, duration, type);

      /**
       * for sortOrder format use:
       *
       * Note: Also need to add the same keyword to the keyworldList array in utils file for regex to worknpm r
       *
       * sortOrder = [
       *  ['bluray', 'hdr'],
       *  ['bdrip'],
       *  ['etc,etc']
       * ]
       * @desc links will get sorted according to the order you provide in the array.
       */
      const sortedLinks = this.sortStreamLinks(links, sortOrder);

      return sortedLinks;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

module.exports = DriveAPI;
