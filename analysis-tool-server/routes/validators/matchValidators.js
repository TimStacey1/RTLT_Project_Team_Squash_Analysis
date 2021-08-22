

const { objectIdSchema } = require('./objectId.schema');
const { createMatchSchema, updateMatchSchema} = require('./match.schemas');


function validateMatchId(req, res, next) {
    const result = objectIdSchema.validate({ _id: req.params.match_id });

    if (result.error) {
        return res.status(400).json(result.error.message);
    }

    next();
};


function validateNewMatch(req, res, next) {
    const result = createMatchSchema.validate(req.body);

    if (result.error) {
        return res.status(400).json(result.error.message);
    }

    next(); 
};


function validateUpdatedMatch(req, res, next) {
    const result = updateMatchSchema.validate(req.body);

    if (result.error) {
        return res.status(400).json(result.error.message);
    }

    next(); 
};


module.exports = {
    validateMatchId,
    validateNewMatch,
    validateUpdatedMatch   
};