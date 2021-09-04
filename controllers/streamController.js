const DriveAPI = require('../services/drive');

const drive = new DriveAPI();

const videoplayback = async (req, res) => {
  if (req.query.id) {
    await drive.streamFile(req.query.id, res, req.headers.range);
  } else
    res.status(404).json({
      success: false,
      message: 'provide id',
    });
};

const retreiveStreamLinks = async (req, res) => {
  const { fileName, platform, isFireFox } = req.query;

  const links = {
    720: [],
    1080: [],
    2160: [],
  };

  if (fileName) {
    if (platform) {
      // android, no need to check for firefox.
      // get only 2160p & 1080p videos.
      const search2160 = fileName.concat(' 2160');
      const search1080 = fileName.concat(' 1080');

      links['2160'] = await drive.getStreamLinks(search2160, platform);
      links['1080'] = await drive.getStreamLinks(search1080, platform);
    } else {
      // WEB
      // get only 1080p & 720p videos & also check for firefox

      const search1080 = fileName.concat(' 1080');
      const search720 = fileName.concat(' 720');

      // links['1080'] = await drive.getStreamLinks(
      //   search1080,
      //   platform,
      //   isFireFox
      // );
      // links['720'] = await drive.getStreamLinks(search720, platform, isFireFox);

      // call two requests parallely to improve performance/wait time
      // note that promise.all fails fast, which means that as soon as one of the promises supplied to it rejects, then the entire thing rejects.
      const [links1080, links720] = await Promise.all([
        drive.getStreamLinks(search1080, platform, isFireFox),
        drive.getStreamLinks(search720, platform, isFireFox),
      ]);

      links['1080'] = links1080;
      links['720'] = links720;
    }
    res.set({
      'Cache-Control': 'public, max-age=3600',
    });

    res.json(links);
  } else {
    res.json({
      status: false,
      message: 'Invalid parameters',
    });
  }
};

module.exports = {
  videoplayback,
  retreiveStreamLinks,
};
