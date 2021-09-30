import express from 'express';
import { celebrate, Joi } from 'celebrate';
import { signup, login, logout, verify } from './auth.controllers';
import asyncHandler from '../../middlewares/asyncHandler';
import requireAuth from '../../middlewares/requireAuth';

const router = express.Router();

router.post(
  '/signup',
  celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
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

router.get('/user', requireAuth, (req, res) => {
  res.send({ message: 'Welcome Back' });
});

router.post('/logout', asyncHandler(logout));

router.get('/verify', asyncHandler(verify));

export default router;
