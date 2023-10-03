const router = require('express').Router();
const handle = require('../validators/handle');
const validate = require('../validators/validate');
const { matchIdSchema } = require('../validators/match.schemas');
const videoController = require('../controllers/video.controller');

// route for uploading a single match video
router.post('/:match_id/upload',
  handle(
    validate.params(matchIdSchema)
  ),
  videoController.upload
);

// route for getting a single match video
router.get('/:match_id/stream',
  handle(
    validate.params(matchIdSchema)
  ),
  videoController.stream
);

module.exports = router;
