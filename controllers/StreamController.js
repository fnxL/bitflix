const fs = require('fs');
const token_path = 'token.json';
const { google } = require('../driveAuth');
const drive = google.drive('v3');
const scope = 'https://www.googleapis.com/auth/drive';

const authApp = (req, res) => {
  //check for existing tokens
  fs.readFile(token_path, (err, token) => {
    if (err) {
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scope,
      });
      res.json({ url: authorizeUrl });
    }
    res.end('Already authenticated');
  });
};

const authCallback = async (req, res) => {
  console.log(req.query);
  if (req.query.code) {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    fs.writeFile(token_path, JSON.stringify(tokens), (err) => {
      if (err) return console.error(err);
      console.log('Token stored to', token_path);
    });

    res.end();
  }
  res.send('hello');
};

const download = async (req, res) => {
  if (req.query.id) {
    let {
      data: { mimeType, name, size },
    } = await drive.files.get({
      fileId: req.query.id,
      fields: 'name, mimeType, size',
    });
    console.log(size);

    let value = 'attachment; filename=' + name;

    let resp = await drive.files.get(
      {
        fileId: req.query.id,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-disposition', value);
    res.setHeader('Content-Length', size);

    resp.data.pipe(res);
  } else
    res.status(404).json({
      success: false,
      message: 'provide id',
    });
};

const getList = async (req, res) => {
  const params = { pageSize: 3 };

  const resp = await drive.files.list(params);
  console.log(resp.data);
  res.send(resp.data);
};

module.exports = {
  authApp,
  authCallback,
  download,
  getList,
};
