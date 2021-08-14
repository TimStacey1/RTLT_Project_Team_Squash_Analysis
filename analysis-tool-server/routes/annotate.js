const router = require('express').Router();

const matchValidator = require('./validators/matchValidators');

const annotationValidator = require('./validators/annotationValidators');

const validateRequest = require('./validators/validateRequest');

const annotationController = require('../controllers/annotate.controllers');

// route for creating a new annotation in a match
router.post('/:match_id/new',
    matchValidator.validateMatchId(),
    annotationValidator.validateAnnotation(),
    validateRequest,
    annotationController.create
);

// route for fetching annotations of an existing match
router.get('/:match_id/all',
    matchValidator.validateMatchId(),
    validateRequest,
    annotationController.all
);

// route for editing an existing annotation of a match
router.post('/:match_id/:annotation_id/edit',
    matchValidator.validateMatchId(),
    annotationValidator.validateAnnotationId(),
    annotationValidator.validateAnnotation(),
    validateRequest,
    annotationController.edit
);

// route for removing an existing annotation of a match
router.post('/:match_id/:annotation_id/remove',
    matchValidator.validateMatchId(),
    annotationValidator.validateAnnotationId(),
    validateRequest,
    annotationController.remove
);

module.exports = router;
