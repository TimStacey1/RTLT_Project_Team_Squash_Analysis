
const Joi = require('joi');
const joi = require('joi-oid');


const matchSchema = Joi.object({
    title: Joi.string().min(5).max(50).regex(/^[a-z\d\-_\s]+$/i),
    duration: Joi.number().integer().min(0).max(7200), // 2 hours
    description: Joi.string().max(200).optional(),
    players: Joi.object({
        player1: Joi.object({
            firstName: Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i),
            lastName: Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i)
        }),
        player2: Joi.object({
            firstName: Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i),
            lastName: Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i)
        }),
    })
}).options({ stripUnknown: true, abortEarly: false }).min(1);


const matchIdSchema = Joi.object({ match_id: joi.objectId().required() });


const createMatchSchema = matchSchema.options({ presence: 'required' });


const updateMatchSchema = matchSchema.options({ presence: 'optional' }).empty('', null).default(undefined);


module.exports = {
    matchSchema,
    createMatchSchema,
    updateMatchSchema,
    matchIdSchema
};