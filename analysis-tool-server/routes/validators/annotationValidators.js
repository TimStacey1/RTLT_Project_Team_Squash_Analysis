
const Annotation = require('../../models/Annotation');

const { check } = require('express-validator');


const validateAnnotationId = () => {
    return [
        check('annotation_id')
            .isMongoId().withMessage('The annotation id does not exist.').bail()
            .custom((value) => {
                return Annotation.exists({ _id: value })
                    .then(res => {
                        return res || Promise.reject('Invalid id.')
                    })
            })
    ];
}


const validateAnnotation = () => {
    return [
        check('shot.*')
            .exists({ checkFalsy: true }).withMessage('Field required.').bail(),
        check('timestamp')
            .exists({ checkFalsy: true }).withMessage('Field required.').bail()
            .custom(value => {
                return !isNaN(Date.parse(value)) || Promise.reject('Timestamp is incorrect.');
            }),
        check('playerNumber')
            .exists({ checkFalsy: true }).withMessage('Field required.').bail()
            .isInt({ min: 1, max: 2 }).withMessage('Input is outside the value range.')
    ];
}


module.exports = {
    validateAnnotationId,
    validateAnnotation
}