
const Joi = require('joi');

const matchSchema = Joi.object({
    title       : Joi.string().min(5).max(50).regex(/^[a-z\d\-_\s]+$/i),
    duration    : Joi.number().integer().min(0).max(10000),
    description : Joi.string().max(200).optional(),
    players     : Joi.object({
        player1 : Joi.object({
            firstName : Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i),
            lastName  : Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i)
        }),
        player2 : Joi.object({
            firstName : Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i),
            lastName  : Joi.string().min(1).max(30).regex(/^[a-z ,.'-]+$/i)
        }),
    })
}).min(1);


const createMatchSchema = matchSchema.options({ presence: 'required' });


const updateMatchSchema = matchSchema.options({ presence: 'optional' }).empty('', null).default(undefined);


module.exports = {
    matchSchema,
    createMatchSchema,
    updateMatchSchema
};