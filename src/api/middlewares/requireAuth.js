/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';

import config from '../../config';

export const isAdmin = (req, res, next) => {
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

  const user = jwt.decode(cookie);
  if (user.username !== 'admin') {
    return res.status(403).send({
      status: 'unauthorized',
      message: 'You are not authorized to access this endpoint',
    });
  }

  next();
};

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
