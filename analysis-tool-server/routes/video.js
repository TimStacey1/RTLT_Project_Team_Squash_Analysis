const router = require('express').Router();

const {
  validateMatchId,
  validateMatchVideo
} = require('./validators/matchValidators');

const videoController = require('../controllers/video.controller');

// route for uploading a single match video
router.post('/:match_id/upload',
  validateMatchId,
  // validateMatchVideo,
  videoController.upload
);

// route for getting a single match video
router.get('/:match_id/stream',
  validateMatchId,
  videoController.stream
);

module.exports = router;