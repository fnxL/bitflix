const DriveAPI = require('../services/drive');
const drive = new DriveAPI();

const download = async (req, res) => {
  if (req.query.id) {
    await drive.streamFile(req.query.id, res, req.headers.range);
  } else
    res.status(404).json({
      success: false,
      message: 'provide id',
    });
};

module.exports = {
  download,
};
