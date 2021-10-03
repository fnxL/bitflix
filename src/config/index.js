// Set NODE_ENV to development by default
import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const env = dotenv.config();
if (env.error) {
  throw new Error('No .env file present');
}

export default {
  port: process.env.PORT || 5000,
  databaseURL: process.env.DATABASE_URL,
  base_url: process.env.BASE_URL,
  appCredentials: {
    client_id: process.env.CLIENT_ID,
    project_id: 'bitflix-321117',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ['http://localhost:5000/api/validateapp/callback'],
  },
  token: {
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
    scope: 'https://www.googleapis.com/auth/drive',
    token_type: 'Bearer',
    expiry_date: 1630265945478,
  },
  api: {
    prefix: '/api',
  },
  opensubtitles: {
    username: process.env.OS_USERNAME,
    password: process.env.OS_PASSWORD,
  },
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
  jwtSecret: process.env.JWT_SECRET,
};
