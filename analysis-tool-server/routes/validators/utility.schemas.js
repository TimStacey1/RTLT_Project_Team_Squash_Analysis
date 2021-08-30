const Joi = require('joi-oid')


/*
 * @desc    a Joi object schema which checks if a 
 *          given value is a valid Mongoose objectId. 
 */
const objectIdSchema = Joi.object({
    _id: Joi.objectId().required()
});


/*
 * @desc    validates a given file against predefined mimetype and size requiremenents.
 *          The caller may provide whether or not the file is optional. 
 *          
 * @param   {Array} mimetypes - valid mimetypes for the given file. 
 * @param   {Integer} size - maximum file size. 
 * @param   {String} presence - file optionality: 'required' or (default) 'optional'.
 * 
 * @return  {Object} - Joi validation object schema. 
 */
const fileSchema = (mimetypes, size, presence = 'optional') => {
    return Joi.object({
        mimetype: Joi.string().valid(...mimetypes),
        size: Joi.number().integer().max(size)
    }).presence(presence);
};


module.exports = {
    objectIdSchema,
    fileSchema
};