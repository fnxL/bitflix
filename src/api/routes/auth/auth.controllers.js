/* eslint-disable consistent-return */
import typedi from 'typedi';
import AuthService from '../../../services/AuthService';

const { Container } = typedi;

const logger = Container.get('logger');
const authService = Container.get(AuthService);

export const signup = async (req, res) => {
  logger.info(`${req.originalUrl}`);
  const { user } = await authService.signUp(req.body);

  res.status(201).json({ user, status: 'success', message: 'Account registered successfully!' });
};

export const login = async (req, res) => {
  logger.info(`${req.originalUrl}`);

  const { user, token } = await authService.login(req.body);

  res.cookie('x-auth-token', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ user, token, status: 'success', message: 'Logged in successfully!' });
};

export const logout = async (req, res) => {
  logger.info(`${req.originalUrl}`);

  res.cookie('x-auth-token', '', { maxAge: 0 });
  res.json({ status: 'success', message: 'Logged out successfully' });
};

export const createAdmin = async (req, res) => {
  logger.info('Creating admin user...');
  const check = await authService.createAdmin();
  if (check)
    res.status(201).json({ status: 'success', message: 'Admin user created successfully.' });
  else throw new Error('Admin user already exists');
  res.end();
};

export const verify = async (req, res) => {
  logger.info(`${req.originalUrl}`);
  const { token } = req.query;
  if (!token) {
    return res.status(401).send({
      status: 'unauthenticated',
      message: 'You are not authenticated',
    });
  }

  const verify_token = await authService.verify(token);

  if (!verify_token) {
    return res.status(401).send({
      status: 'invalid_token',
      message: 'Invalid or expired token',
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'Token Valid',
  });
};

export const generatekey = async (req, res) => {
  logger.info(`${req.originalUrl}`);
  const key = await authService.generateKey();
  res.json(key);
};

export const getInviteKeys = async (req, res) => {
  logger.info(`${req.originalUrl}`);
  const keys = await authService.getInviteKeys();
  res.json({ keys });
};
