const { google } = require('googleapis');
const config = require('config');

class DriveAPI {
  constructor() {
    if (config.has('token')) {
      const { client_secret, client_id, redirect_uris } = config.appCredentials;
      const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      oauth2Client.setCredentials(config.token);
      this.drive = google.drive({ version: 'v3', auth: oauth2Client });
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
      });

      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

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
    videoObj.end = parseInt(startEnd[1], 10) > 0 ? parseInt(startEnd[1], 10) : videoObj.size - 1;

    videoObj.chunkSize = videoObj.end - videoObj.start + 1;
    return videoObj;
  };

  streamFile = async (id, res, range) => {
    const file = await this.getFile(id);
    if (file) {
      const { start, end, chunkSize, size, mimeType } = await this.getRange(range, file);

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });

      const { data } = await this.drive.files.get(
        {
          fileId: id,
          alt: 'media',
        },
        { responseType: 'stream', headers: { Range: `bytes=${start}-${end}` } }
      );

      data.pipe(res);
    } else
      res.status(404).json({
        success: false,
        message: 'File no longer exists.',
      });
  };
}

module.exports = DriveAPI;
