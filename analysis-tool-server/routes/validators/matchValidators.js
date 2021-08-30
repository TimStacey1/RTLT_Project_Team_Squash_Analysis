

const { objectIdSchema, fileSchema } = require('./utility.schemas');
const { createMatchSchema, updateMatchSchema } = require('./match.schemas');


function validateMatchId(req, res, next) {
    const result = objectIdSchema.validate({ _id: req.params.match_id });

    if (result.error) return res.status(400).json(result.error.message);

    next();
};


function validateNewMatch(req, res, next) {
    const result = createMatchSchema.validate(req.body);

    if (result.error) return res.status(400).json(result.error.message);

    next();
};


function validateUpdatedMatch(req, res, next) {
    const result = updateMatchSchema.validate(req.body);

    if (result.error) return res.status(400).json(result.error.message);

    next();
};


function validateMatchVideo(req, res, next) {
    if (req.files && Object.keys(req.files).length > 0) {
        const _file = req.files.video;

        _file.name = req.params.match_id; // Use the match_id as a reference to the file. 

        const validMimetypes = ['video/mp4'];

        const maxFileSize = 1024 * 1024 * 1024; // ~1.07 Gb

        const result = fileSchema(validMimetypes, maxFileSize).validate(_file);

        if (result.error) return res.status(400).json(result.error.message);
    }
    next();
};


module.exports = {
    validateMatchId,
    validateNewMatch,
    validateUpdatedMatch,
    validateMatchVideo
};