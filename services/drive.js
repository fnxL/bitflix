const { google } = require('googleapis');
const config = require('config');

const serverIp =
  process.env.NODE_ENV === 'development'
    ? process.env.SERVER_IP_DEV
    : process.env.SERVER_IP_PROD;

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
    // const file = await this.getFile(id);
    if (id) {
      // const { start, end, chunkSize, size, mimeType } = await this.getRange(range, file);

      // res.writeHead(206, {
      //   'Content-Range': `bytes ${start}-${end}/${size}`,
      //   'Accept-Ranges': 'bytes',
      //   'Content-Length': chunkSize,
      //   'Content-Type': mimeType,
      //   'Cache-Control': 'public, max-age=3600',
      // });

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
      // keeps the connection alive
      resp.headers.connection = 'keep-alive';
      // delete this header to avoid downloading the file
      delete resp.headers['content-disposition'];

      // this header does nothing currently
      resp.headers['cache-control'] = 'public, max-age=3600';

      res.writeHead(206, resp.headers);
      resp.data.pipe(res);
    } else
      res.status(404).json({
        success: false,
        message: 'No fileId provided',
      });
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
  convertIdsToLink = (movieDetails) => {
    movieDetails.forEach((movie) => {
      movie.link = `${serverIp}api/media/videoplayback?id=${movie.id}`;
      delete movie.id;
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

  getStreamLinks = async (fileName, pageSize = 100) => {
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
          exclude: ['dual', 'hindi', 'sample', 'HEVC', 'x265'],
        },
      });

      const {
        data: { files },
      } = await this.drive.files.list({
        corpora: 'allDrives',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        pageSize: pageSize,
        fields: 'files(id,name,size,mimeType)',
        q: query,
      });
      this.convertIdsToLink(files);
      return files;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

module.exports = DriveAPI;
