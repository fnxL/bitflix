import { celebrate, Joi, Segments } from "celebrate";

export const StreamLinksValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    year: Joi.number(),
    seasonNumber: Joi.number(),
    episodeNumber: Joi.number(),
    episodeName: Joi.string(),
    platform: Joi.string().required(),
    isFireFox: Joi.boolean(),
    type: Joi.string().required(),
  }),
});
