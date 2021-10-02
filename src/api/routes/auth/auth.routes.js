import { celebrate, Joi } from 'celebrate';
import express from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { isAdmin } from '../../middlewares/requireAuth';
import {
  createAdmin,
  generatekey,
  getInviteKeys,
  login,
  logout,
  signup,
  verify,
} from './auth.controllers';

const router = express.Router();

router.post(
  '/signup',
  celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      invitekey: Joi.string().required(),
    }),
  }),
  asyncHandler(signup)
);

router.post(
  '/login',
  celebrate({
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  asyncHandler(login)
);

router.post('/logout', asyncHandler(logout));

router.get('/verify', asyncHandler(verify));

router.get('/generatekey', isAdmin, asyncHandler(generatekey));

router.get('/invitekeys', isAdmin, asyncHandler(getInviteKeys));

router.get('/createadmin', asyncHandler(createAdmin));

export default router;
