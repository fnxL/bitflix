const OS = require('opensubtitles-api');

class Subtitles {
  constructor() {
    this.OpenSubtitles = new OS({
      useragent: 'UserAgent',
      username: 'ronanthonas',
      password: '33w1ws2eD@',
      ssl: true,
    });
  }

  getSubs = async (obj) => {
    try {
      const subs = await this.OpenSubtitles.search(obj);
      return subs;
    } catch (error) {
      throw Error(error);
    }
  };
}

module.exports = Subtitles;
