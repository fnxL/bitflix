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
  const { fileName, duration } = req.query;
  if (fileName && duration) {
    const links = await drive.getStreamLinks(fileName, duration);
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
