const router = require('express').Router();

const {
    validateMatchId,
    validateNewMatch,
    validateUpdatedMatch,
    validateMatchVideo
} = require('./validators/matchValidators');

const matchController = require('../controllers/match.controllers');


// route for the creation of a new match
router.post('/new',
    validateNewMatch,
    validateMatchVideo,
    matchController.create
);


// route for getting a single match
router.get('/:match_id/get',
    validateMatchId,
    matchController.get
);


// route for getting a single match video
router.get('/:video_id/video',
    validateMatchId,
    matchController.getVideo
);


// route for retrieving all matches
router.get('/all',
    matchController.getAll
);


// route for updating an existing match 
router.post('/:match_id/update',
    validateMatchId,
    validateUpdatedMatch,
    matchController.update
);


// route for removing an existing match
router.post('/:match_id/remove',
    validateMatchId,
    matchController.remove
);


module.exports = router;
