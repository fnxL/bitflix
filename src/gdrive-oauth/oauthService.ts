import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import pino from "pino";
import { Inject, Service } from "typedi";
import config from "../../config/default";

@Service()
class GDriveService {
  private oauth2Client: OAuth2Client;
  constructor(@Inject("logger") private logger: pino.Logger) {
    const { client_secret, client_id, redirect_uris } = config.appCredentials;
    this.oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    this.logger.info("AuthApp Service Initialized");
  }

  async generateAuthUrl() {
    const authorizeUrl = await this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: config.appCredentials.scope.join(" "),
    });
    return authorizeUrl;
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }
}

export default GDriveService;
