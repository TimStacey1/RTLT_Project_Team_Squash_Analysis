const router = require('express').Router();
const handle = require('../validators/handle');
const validate = require('../validators/validate');
const { matchIdSchema } = require('../validators/match.schemas');
const {
  annotationIdSchema,
  createAnnotationSchema,
  updateAnnotationSchema
} = require('../validators/annotation.schemas');
const annotationController = require('../controllers/annotate.controller');

// route for creating a new annotation in a match
router.post('/:match_id/new',
  handle(
    validate.params(matchIdSchema),
    validate.body(createAnnotationSchema)
  ),
  annotationController.create
);

// route for fetching annotations of an existing match
router.get('/:match_id/all',
  handle(
    validate.params(matchIdSchema)
  ),
  annotationController.getAll
);

// route for fetching a single annotation of an existing match
router.get('/:match_id/:annotation_id/get',
  handle(
    validate.params(matchIdSchema),
    validate.params(annotationIdSchema)
  ),
  annotationController.get
);

// route for editing an existing annotation of a match
router.post('/:match_id/:annotation_id/edit',
  handle(
    validate.params(matchIdSchema),
    validate.params(annotationIdSchema),
    validate.body(updateAnnotationSchema)
  ),
  annotationController.edit
);

// route for removing an existing annotation of a match
router.post('/:match_id/:annotation_id/remove',
  handle(
    validate.params(matchIdSchema),
    validate.params(annotationIdSchema)
  ),
  annotationController.remove
);

module.exports = router;
