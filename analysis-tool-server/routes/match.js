const router = require('express').Router();
const handle = require('../validators/handle');
const validate = require('../validators/validate');
const {
  matchIdSchema,
  createMatchSchema,
  updateMatchSchema,
} = require('../validators/match.schemas');
const matchController = require('../controllers/match.controller');

// route for the creation of a new match
router.post('/new',
  handle(
    validate.body(createMatchSchema)
  ),
  matchController.create
);

// route for getting a single match
router.get('/:match_id/get',
  handle(
    validate.params(matchIdSchema)
  ),
  matchController.get
);

// route for retrieving all matches
router.get('/all',
  matchController.getAll
);

// route for updating an existing match
router.post('/:match_id/update',
  handle(
    validate.params(matchIdSchema),
    validate.body(updateMatchSchema)
  ),
  matchController.update
);

// route for removing an existing match
router.post('/:match_id/remove',
  handle(
    validate.params(matchIdSchema)
  ),
  matchController.remove
);

module.exports = router;
