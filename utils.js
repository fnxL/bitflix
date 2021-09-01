// use these functions to validate your app with googleapi client.
const { google } = require('googleapis');

const oauth2Client = new google.auth.oauth2Client();

const authApp = (req, res) => {
  // check for existing tokens
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
