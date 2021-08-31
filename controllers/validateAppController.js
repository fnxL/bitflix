const ValidateAppService = require('../services/validateApp');

const validateApp = new ValidateAppService();

const getAuthUrl = async (req, res) => {
  const authUrl = await validateApp.genAuthUrl();
  res.json({
    success: true,
    url: authUrl,
  });
};

const handleCallback = async (req, res) => {
  if (req.query.code) {
    const tokens = await validateApp.getTokens(req.query.code);
    res.json({
      success: true,
      message: null,
      data: tokens,
    });
  } else {
    res.json({
      success: false,
      message: 'No code provided for exchange',
    });
  }
};

module.exports = { getAuthUrl, handleCallback };
