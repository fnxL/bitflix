const DriveAPI = require('../../services/drive');
const SubtitlesService = require('../../services/subtitles');
const { cleanFileName, getSearchTerm } = require('../../utils');

const subtitles = new SubtitlesService();

const drive = new DriveAPI();

const videoplayback = async (req, res) => {
  const { id } = req.query;
  const { range } = req.headers;

  if (id && range) {
    //
    const response = await drive.streamFile(id, range);
    res.status(206);
    res.set(response.headers);
    response.data.pipe(res);
    //
  } else {
    res.status(400);
    throw new Error('Invalid request -> Missing ID or range headers');
  }
};

const retreiveStreamLinks = async (req, res) => {
  const { metadata, platform, isFireFox } = req.query;
  const obj = JSON.parse(Buffer.from(metadata, 'base64').toString('ascii'));

  const { title, season_number, episode_number, year, episode_name, type } =
    obj;

  const cleanedTitle = cleanFileName(title);

  const searchTerm = getSearchTerm(cleanedTitle, type, {
    season_number,
    episode_number,
    year,
  });

  const links = {
    720: [],
    1080: [],
    2160: [],
  };

  if (searchTerm) {
    if (platform === 'tv') {
      // android TV, no need to check for firefox.
      // get only 2160p & 1080p videos.
      const search2160 = searchTerm.concat(' 2160');
      const search1080 = searchTerm.concat(' 1080');

      links['2160'] = await drive.getStreamLinks(search2160, platform);
      links['1080'] = await drive.getStreamLinks(search1080, platform);
    } else {
      // WEB
      // get only 1080p & 720p videos & also check for firefox

      // links['1080'] = await drive.getStreamLinks(
      //   search1080,
      //   platform,
      //   isFireFox
      // );
      // links['720'] = await drive.getStreamLinks(search720, platform, isFireFox);

      // call two requests parallely to improve performance/wait time
      // note that promise.all fails fast, which means that as soon as one of the promises supplied to it rejects, then the entire thing rejects.
      const [links1080, links720] = await Promise.all([
        drive.getStreamLinks(searchTerm, '1080', platform, isFireFox),
        drive.getStreamLinks(searchTerm, '720', platform, isFireFox),
      ]);

      links['1080'] = links1080;
      links['720'] = links720;
    }
    res.set({
      'Cache-Control': 'public, max-age=3600',
    });

    res.json(links);
  } else {
    res.status(400);
    throw new Error('Invalid Parameters');
  }
};

const getSubtitles = async (req, res) => {
  const { metadata } = req.query;
  const obj = JSON.parse(Buffer.from(metadata, 'base64').toString('ascii'));
  const subs = await subtitles.getSubs(obj);
  res.json(subs);
};

module.exports = {
  videoplayback,
  retreiveStreamLinks,
  getSubtitles,
};
