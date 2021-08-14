const router = require('express').Router();

const validateRequest = require('./validators/validateRequest');

const matchValidator = require('./validators/matchValidators');

const matchController = require('../controllers/match.controllers');


// route for the creation of a new match
router.post('/new',
    matchValidator.validateMatch(),
    validateRequest,
    matchController.create
);


// route for retrieving all matches
router.get('/all',
    matchController.all
);


// route for updating an existing match 
router.post('/:match_id/update',
    matchValidator.validateMatchId(),
    matchValidator.validateMatch(),
    matchController.update
);


// route for getting a single match
router.get('/:match_id/get',
    matchValidator.validateMatchId,
    matchController.get
);


module.exports = router;
