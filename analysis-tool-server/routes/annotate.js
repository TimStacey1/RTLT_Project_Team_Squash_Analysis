const router = require('express').Router();

const { validateAnnotationId, validateNewAnnotation, validateUpdatedAnnotation} = require('./validators/annotationValidators');

const { validateMatchId } = require('./validators/matchValidators');

const annotationController = require('../controllers/annotate.controller');


// route for creating a new annotation in a match
router.post('/:match_id/new',
    validateMatchId,
    validateNewAnnotation,
    annotationController.create
);


// route for fetching annotations of an existing match
router.get('/:match_id/all',
    validateMatchId,
    annotationController.getAll
);


// route for fetching a single annotation of an existing match
router.get('/:match_id/:annotation_id/get',
    validateMatchId,
    validateAnnotationId,
    annotationController.get
);


// route for editing an existing annotation of a match
router.post('/:match_id/:annotation_id/edit',
    validateMatchId,
    validateAnnotationId,
    validateUpdatedAnnotation,
    annotationController.edit
);


// route for removing an existing annotation of a match
router.post('/:match_id/:annotation_id/remove',
    validateMatchId,
    validateAnnotationId,
    annotationController.remove
);


module.exports = router;
