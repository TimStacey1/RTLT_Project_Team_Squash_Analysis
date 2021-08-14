const router = require('express').Router();

const { Match } = require('../models/Match');

const match_validators = require('./validators/matchValidators')

const annotation_validators = require('./validators/annotationValidators')

const validateRequest = require('./validators/validateRequest');

const annotation_controllers = require('../controllers/annotate')

// route for creating a new annotation in a match
router.post('/:match_id/new',
    match_validators.validateMatchId(),
    annotation_validators.validateAnnotation(),
    validateRequest,
    annotation_controllers.createNewAnnotation
});

// route for fetching annotations of an existing match
router.get('/:match_id/all',
    validateMatchId(),
    validateRequest,
    annotation_controllers.getAllAnnotations
});

// route for editing an existing annotation of a match
router.post('/:match_id/:annotation_id/edit',
    validateMatchId(),
    validateAnnotationId(),
    validateAnnotation(),
    validateRequest,
    annotation_controllers.editAnnotation
});

// route for removing an existing annotation of a match
router.post('/:match_id/:annotation_id/remove',
    validateMatchId(),
    validateAnnotationId(),
    validateRequest,
    annotation_controllers.removeAnnotation
});

module.exports = router;
