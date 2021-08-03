const { validationResult } = require('express-validator');

function validateRequest(req, res, next) {

    const errors = validationResult(req);

    // Can throw custom errors here
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
} 

module.exports = validateRequest; 