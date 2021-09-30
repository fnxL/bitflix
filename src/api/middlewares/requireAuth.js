/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import config from '../../config';

const requireAuth = (req, res, next) => {
  const cookie = req.cookies['x-auth-token'];
  if (!cookie) {
    return res.status(401).send({
      status: 'unauthenticated',
      message: 'You are not authenticated',
    });
  }

  const claims = jwt.verify(cookie, config.jwtSecret);

  if (!claims) {
    return res.status(401).send({
      status: 'invalid_token',
      message: 'Invalid or expired token',
    });
  }
  next();
};

export default requireAuth;
