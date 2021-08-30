const express = require('express');
const { google } = require('./driveAuth');
const fs = require('fs');
const drive = google.drive('v3');

const scope = 'https://www.googleapis.com/auth/drive';

const app = express();

app.use(express.json());

app.get('/download', async (req, res) => {
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
  } else res.status(404).json('provide id');
});

app.get('/list', async (req, res) => {
  const params = { pageSize: 3 };

  const resp = await drive.files.list(params);
  console.log(resp.data);
  res.send(resp.data);
});

app.get('/authenticate', (req, res) => {
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
});

//call back url
app.get('/', async (req, res) => {
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
});

app.listen(
  5000,
  console.log(`Server running in http://localhost:5000 mode on port`)
);
