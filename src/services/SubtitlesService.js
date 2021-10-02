import OS from 'opensubtitles-api';
import config from '../config';

class SubtitlesService {
  constructor(container) {
    this.OpenSubtitles = new OS({
      useragent: 'UserAgent',
      username: config.opensubtitles.username,
      password: config.opensubtitles.password,
      ssl: true,
    });
    this.logger = container.get('logger');
    this.logger.info('Subtitles Service Initialized');
  }

  async getSubs(obj) {
    try {
      const subs = await this.OpenSubtitles.search(obj);
      return subs;
    } catch (error) {
      this.logger.error(error);
      throw Error(error);
    }
  }
}

export default SubtitlesService;
