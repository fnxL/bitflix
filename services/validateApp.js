const { google } = require('googleapis');
const config = require('../api/config');

const scopes = ['https://www.googleapis.com/auth/drive'];

class validateApp {
  constructor() {
    const { client_secret, client_id, redirect_uris } = config.appCredentials;
    this.oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
  }

  genAuthUrl = async () => {
    const authorizeUrl = await this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
    return authorizeUrl;
  };

  getTokens = async (code) => {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  };
}

module.exports = validateApp;
