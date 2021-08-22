
const mongoose = require('mongoose');

const Joi = require('joi-oid')


const objectIdSchema = Joi.object({
    _id: Joi.objectId()
        .required()
});


module.exports = {
    objectIdSchema
};