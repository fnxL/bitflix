const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const keyPath = path.join(__dirname, 'credentials.json');
const token_path = 'token.json';

let keys = { redirect_uris: [''] };
if (fs.existsSync(keyPath)) {
  keys = require(keyPath).web;
}
const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[0]
);

fs.readFile(token_path, (err, token) => {
  if (err) return;
  oauth2Client.setCredentials(JSON.parse(token));
});

google.options({ auth: oauth2Client });

module.exports = {
  google,
};
