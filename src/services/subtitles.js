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
    const subs = await this.OpenSubtitles.search(obj);
    return subs;
  };
}

module.exports = Subtitles;
