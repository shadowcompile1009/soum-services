import Joi from 'joi';

export const schema = Joi.object({
  display: Joi.string().required(),
  name: Joi.string().required(),
  value: Joi.number().max(100).min(1),
});
