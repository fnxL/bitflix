import { celebrate, Joi, Segments } from "celebrate";

export const SignUpValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(4).required(),
    email: Joi.string().required(),
    inviteKey: Joi.string().required(),
  }),
});

export const LoginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(4).required(),
  }),
});
