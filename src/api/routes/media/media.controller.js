import typedi from 'typedi';
import DriveService from '../../../services/DriveService';
import SubtitlesService from '../../../services/SubtitlesService';
import { cleanFileName, getSearchTerm } from '../../../utils';

const { Container } = typedi;

const logger = Container.get('logger');

const subtitles = Container.get(SubtitlesService);

const drive = Container.get(DriveService);

export const videoplayback = async (req, res) => {
  const { id } = req.query;
  const { range } = req.headers;

  logger.info(req.originalUrl);

  if (id) {
    //
    const response = await drive.streamFile(id, range);
    res.status(206);
    res.set(response.headers);
    response.data.pipe(res);
    //
  } else {
    res.status(400);
    logger.error('Invalid request -> Missing ID or Range Headers');
    throw new Error('Invalid request -> Missing ID or range headers');
  }
};

export const retreiveStreamLinks = async (req, res) => {
  const { metadata, platform, isFireFox } = req.query;
  const obj = JSON.parse(Buffer.from(metadata, 'base64'));

  const { title, season_number, episode_number, year, episode_name, type } = obj;

  const cleanedTitle = cleanFileName(title);

  logger.info(`Fetching links for ${cleanedTitle}`);

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
    logger.error('Invalid Params');
    throw new Error('Invalid Parameters');
  }
};

export const getSubtitles = async (req, res) => {
  const { metadata } = req.query;
  const obj = JSON.parse(Buffer.from(metadata, 'base64').toString('ascii'));
  logger.info(`Retreving SRT file from opensubtitles.org for ${obj.filename}`);
  const subs = await subtitles.getSubs(obj);
  res.json(subs);
};
