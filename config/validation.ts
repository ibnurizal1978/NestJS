import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
  JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  FRONTEND_URL: Joi.string(),
  NODE_ENV: Joi.string().valid('development', 'production', 'staging'),
});
