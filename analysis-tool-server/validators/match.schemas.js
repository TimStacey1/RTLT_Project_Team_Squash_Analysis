const Joi = require('joi');
const joi = require('joi-oid');

const matchIdSchema = Joi.object({ match_id: joi.objectId() }).options({ stripUnknown: true });
const matchSchema = Joi.object({
  title: Joi.string().min(5).max(100).regex(/^[\w\-\s]+$/),
  duration: Joi.number().integer().min(0).max(7200), // 2 hours
  description: Joi.string().max(250).allow('').optional(),
  players: Joi.object({
    player1: Joi.object({
      firstName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z,.'-\s]*$/),
      lastName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z,.'-\s]*$/),
    }),
    player2: Joi.object({
      firstName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z,.'-\s]*$/),
      lastName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z,.'-\s]*$/),
    }),
  }),
  courtBounds: Joi.array().items(Joi.array().items(Joi.number().integer())),
  playerRGB: Joi.array().items(Joi.array().items(Joi.number().integer())),
}).options({ stripUnknown: true, abortEarly: false }).min(1);
const createMatchSchema = matchSchema.options({ presence: 'required' });
const updateMatchSchema = matchSchema;

module.exports = {
  matchIdSchema,
  createMatchSchema,
  updateMatchSchema,
};
