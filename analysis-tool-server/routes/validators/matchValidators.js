const { Match } = require('../../models/Match');

const { check } = require('express-validator');

 
const validateMatchId = () => {
    return [
        check('match_id')
            .isMongoId().withMessage('The match id does not exist.').bail()
            .custom((value) => {
                return Match.exists({ _id: value })
                    .then(res => {
                        return res || Promise.reject('Invalid id.');                                               
                    })
            })
    ];
}


const validateMatch = () => {
    return [
        check('title')
            .exists({ checkFalsy: true }).withMessage('Field must not be empty.').bail()
            .isLength({ min: 5, max: 50 }).withMessage('Character requirements not met.')
            .matches(/^[a-z\d\-_\s]+$/i).withMessage('Character requirements not met.'),
        check(['players.*.firstName','players.*.lastName'])
            .exists({ checkFalsy: true }).withMessage('Field must not be empty.').bail()
            .isLength({ min: 1, max: 50 }).withMessage('Character requirements not met.')
            .isAlpha().withMessage('Character requirements not met.'),
        check('duration')
            .exists({ checkFalsy: true }).withMessage('Field must not be empty.').bail()
            .isNumeric({ no_symbols: true }).withMessage('Character requirements not met.')
            .isInt(min = 1).withMessage('Character requirements not met.')
    ];
}


module.exports = {
    validateMatchId,
    validateMatch
}