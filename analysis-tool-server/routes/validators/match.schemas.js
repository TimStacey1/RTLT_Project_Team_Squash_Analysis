
const Joi = require('joi');
const joi = require('joi-oid');


const matchSchema = Joi.object({
    title: Joi.string().min(5).max(100).regex(/^[\w\-\s]+$/),
    description: Joi.string().max(250).optional(),
    players: Joi.object({
        player1: Joi.object({
            firstName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z.'\s]*$/),
            lastName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z.'\s]*$/)
        }),
        player2: Joi.object({
            firstName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z.'\s]*$/),
            lastName: Joi.string().min(1).max(50).regex(/^[a-zA-Z][a-zA-Z.'\s]*$/)
        }),
    }),
    duration: Joi.number().integer().min(0).max(7200), // 2 hours
}).options({ stripUnknown: true, abortEarly: false }).min(1);


const matchIdSchema = Joi.object({ match_id: joi.objectId().required() })
    .options({ stripUnknown: true });

const createMatchSchema = matchSchema.options({ presence: 'required' });


const updateMatchSchema = matchSchema.options({ presence: 'optional' }).empty('', null).default(undefined);


module.exports = {
    matchSchema,
    createMatchSchema,
    updateMatchSchema,
    matchIdSchema
};