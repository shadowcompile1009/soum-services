import Joi from 'joi';

export const schema = Joi.object({
  display: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  configurable: Joi.boolean().required(),
  value: Joi.boolean().required(),
  config: Joi.optional(),
});
