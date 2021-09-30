import typedi from 'typedi';
import AuthAppService from '../../../services/AuthAppService';

const { Container } = typedi;

const authApp = Container.get(AuthAppService);

export const getAuthUrl = async (req, res) => {
  const authUrl = await authApp.genAuthUrl();
  res.json({
    success: true,
    url: authUrl,
  });
};

export const handleCallback = async (req, res) => {
  if (req.query.code) {
    const tokens = await authApp.getTokens(req.query.code);
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
