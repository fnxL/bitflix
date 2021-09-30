import { google } from 'googleapis';
import config from '../config';

const scopes = ['https://www.googleapis.com/auth/drive'];

class AuthAppService {
  constructor(container) {
    const { client_secret, client_id, redirect_uris } = config.appCredentials;
    this.oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    this.logger = container.get('logger');

    this.logger.info('AuthApp Service Initialized');
  }

  async genAuthUrl() {
    const authorizeUrl = await this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
    return authorizeUrl;
  }

  async getTokens(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }
}

export default AuthAppService;
