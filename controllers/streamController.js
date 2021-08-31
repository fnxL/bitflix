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
  console.log(req.query);
  if (req.query.fileName) {
    const links = await drive.getStreamLinks(req.query.fileName);
    res.json(links);
  } else {
    res.json({
      status: false,
      message: 'No fileName provided',
    });
  }
};

module.exports = {
  videoplayback,
  retreiveStreamLinks,
};
